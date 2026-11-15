// Step 1 of RAG v2: is the RIGHT card reaching the design AI? A card-level retrieval test on real design steps.
// (knowledge/eval.json tests the raw chunks; this one tests what the design AI actually receives.)
//   1 queries   design steps rebuilt from 18 recorded design sessions (simulated creators), 2 phases each
//   2 refine    Kimi rewrites each step as a short English search query (query refinement)
//   3 embed     Workers AI embeddinggemma-300m, the same model and prefix as the live system
//   4 run       every retrieval variant (live baseline, facts by rules, hybrid BM25 + RRF, rerank, graph, all)
//   5 pool      the union of every variant's top 15 + the routed facts (TREC-style pooling)
//   6 label     Kimi grades each pooled card 0/1/2 for that step, blind to which variant found it
//   7 measure   Recall@k, essential recall@k, Precision@k, MRR, nDCG@k; k = the live k per phase (6 or 9)
// Usage: node knowledge/ingest/eval-cards.mjs      (caches in knowledge/.cache/evalc/; CF_ACCOUNT_ID picks the Cloudflare account)
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import { fileURLToPath } from 'node:url';
import { configure, structured } from '../../ai/engine.mjs';
import { SCHEMAS, CHECKS } from '../../ai/schema.mjs';
import { EMBED_MODEL, loadIndex, ragQuery, queryText, docText } from '../../ai/rag.mjs';
import { bm25Index, graphIndex, retrieve2 } from '../../ai/rag2.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..'), K = path.join(ROOT, 'knowledge'), C = path.join(K, '.cache/evalc');
fs.mkdirSync(C, { recursive: true });
const cache = (name, v) => { const f = path.join(C, name + '.json'); if (v !== undefined) fs.writeFileSync(f, JSON.stringify(v, null, 1)); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };
configure({ key: () => process.env.KIMI_API_KEY || fs.readFileSync(path.join(os.homedir(), '.kimi/api_key'), 'utf8') });
const ACCOUNT = process.env.CF_ACCOUNT_ID || '';
const cfTok = () => process.env.CF_API_TOKEN || (fs.readFileSync(path.join(process.env.APPDATA || os.homedir(), 'xdg.config/.wrangler/config/default.toml'), 'utf8').match(/oauth_token = "([^"]+)"/) || [])[1];
const cf = (model, body) => fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/ai/run/${model}`, { method: 'POST', headers: { authorization: 'Bearer ' + cfTok(), 'content-type': 'application/json' }, body: JSON.stringify(body) })
  .then(r => r.json()).then(r => { if (!r.success) throw new Error(JSON.stringify(r.errors)); return r.result; });
const pool = async (items, n, fn) => { const q = [...items]; await Promise.all(Array.from({ length: n }, async () => { while (q.length) await fn(q.shift()); })); };

// ---------- 1 queries ----------
const SESSIONS = ['sim-t101-v6-mwalupbi', 'sim-t102-v6-mwalupo7', 'sim-t104-v6-mwalup91', 'sim-t105-v6-mwalup9o', 'sim-t106-v6-mwalupcs', 'sim-t107-v6-mwalup9v',
  'sim-t108-v6-mwaluppk', 'sim-t109-v6-mwalup3q', 'sim-t110-v6-mwalupzd', 'sim-t001-v5-mw5aewde', 'sim-t002-v5-mw5aewg1', 'sim-t003-v5-mw5aewjo', 'sim-t005-v5-mw5aewjt',
  'sim-t006-v5-mw5aewmy', 'sim-t009-v5-mw5aewwt', 'sim-sim-t012-mw3wlzo8', 'd-20261112183704', 'd-20261112183913'];
const PAIRS = [['options', 'prototype'], ['interview', 'build'], ['options', 'build'], ['interview', 'prototype']];
let Q = cache('queries');
if (!Q) { Q = [];
  SESSIONS.forEach((s, n) => { const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'designs', s + '.json'), 'utf8')), said = d.log.filter(l => l.who === 'creator').map(l => l.text);
    const cut = said.findIndex(t => /^\(propose options\)|^pick \d/.test(t)), interview = said.slice(0, cut < 0 ? 3 : cut), b = d.brief, o = d.chosen || {};
    const comment = said.find(t => /^prototype comments:/.test(t))?.replace(/^prototype comments:\s*/, '');
    const opt = { title: o.title, genre: o.genre, pitch: o.pitch, theme: o.theme };
    for (const phase of PAIRS[n % PAIRS.length]) {
      const q = phase === 'interview' ? { phase, brief: { concept: b.concept, platform: b.platform, players: b.players }, history: interview.slice(0, 2).map(text => ({ who: 'creator', text })) }
        : phase === 'options' ? { phase, brief: b, history: interview.map(text => ({ who: 'creator', text })) }
        : phase === 'prototype' ? { phase, brief: b, option: opt, comments: comment, history: interview.slice(-2).map(text => ({ who: 'creator', text })) }
        : { phase, brief: b, option: opt, history: said.slice(-3).filter(t => !/^prototype approved/.test(t)).map(text => ({ who: 'creator', text })) };
      Q.push({ id: `${s}:${phase}`, session: s, phase, q }); } });
  cache('queries', Q); }
console.log(Q.length, 'design steps');

// ---------- 2 refine ----------
SCHEMAS.refine = { type: 'object', required: ['query'], properties: { query: { type: 'string', minLength: 30, maxLength: 600 } } };
CHECKS.refine = r => /[฀-๿]/.test(r.query) ? ['$.query: English only'] : [];
const refined = cache('refined') || {};
await pool(Q.filter(x => !refined[x.id]), 6, async x => {
  const r = await structured('refine', `A game-design AI is at the "${x.phase}" step for this creator. Rewrite the situation as ONE English search query (1 to 3 sentences) for a library of English design-knowledge cards: name the platform, players, space, mood, constraints, chosen genre and what this step must decide. Keep the creator's specific needs (accessibility, safety, size, light, theme); translate Thai to English. No preamble.\n\nSituation:\n${ragQuery(x.q)}`, { model: 'k3.1-pro', effort: 'low', maxTokens: 3000 });
  refined[x.id] = r.result.query; process.stdout.write('.'); });
cache('refined', refined); console.log(' refined');

// ---------- 3 embed ----------
const vecs = cache('vecs') || {};
const need = Q.flatMap(x => [['live:' + x.id, queryText(ragQuery(x.q))], ['ref:' + x.id, queryText(refined[x.id])]]).filter(([k]) => !vecs[k]);
for (let i = 0; i < need.length; i += 40) { const part = need.slice(i, i + 40), r = await cf(EMBED_MODEL, { text: part.map(p => p[1]) }); part.forEach(([k], j) => vecs[k] = r.data[j]); }
cache('vecs', vecs); console.log('embedded');

// ---------- 4 run every variant ----------
const ix = loadIndex(fs.readFileSync(path.join(K, 'index.json'), 'utf8')), byId = new Map(ix.cards.map(c => [c.id, c]));
const facts = { list: JSON.parse(fs.readFileSync(path.join(K, 'facts.json'), 'utf8')).facts, byId };
const bm = bm25Index(ix.cards), graph = graphIndex(JSON.parse(fs.readFileSync(path.join(K, 'graph.json'), 'utf8')));
const rrCache = cache('rerank') || {};
const rerank = async (query, cards) => { const key = query + '|' + cards.map(c => c.id).join(','); if (rrCache[key]) return rrCache[key];
  const r = await cf('@cf/baai/bge-reranker-base', { query, contexts: cards.map(c => ({ text: docText(c).slice(0, 1200) })), top_k: cards.length });
  const s = new Array(cards.length).fill(-99); (r.response || []).forEach(x => s[x.id] = x.score); return rrCache[key] = s; };
const VARIANTS = {
  'A live baseline (dense + tag boosts)': () => ({}),
  'B query refinement (dense on English query)': () => ({ refinedVec: true }),
  'C + facts by rules': () => ({ facts }),
  'D + hybrid BM25 + RRF': x => ({ lexical: bm, refined: refined[x.id] }),
  'E + hybrid + rerank': x => ({ lexical: bm, refined: refined[x.id], rerank }),
  'F + hybrid + graph': x => ({ lexical: bm, refined: refined[x.id], graph }),
  'G all: facts + hybrid + rerank + graph': x => ({ facts, lexical: bm, refined: refined[x.id], rerank, graph }),
  'H facts + query refinement': () => ({ facts, refinedVec: true }),
  'I facts + graph': () => ({ facts, graph }),
};
const runs = {}; // variant -> id -> [{ id, via }] (full list for the pool: top 15)
for (const [name, mk] of Object.entries(VARIANTS)) { runs[name] = {};
  for (const x of Q) { const o = mk(x), v = o.refinedVec ? vecs['ref:' + x.id] : vecs['live:' + x.id];
    const top = await retrieve2(ix, v, x.q, { ...o, k: 15 }), real = await retrieve2(ix, v, x.q, o);
    runs[name][x.id] = { pool: top.map(h => h.card.id), got: real.map(h => ({ id: h.card.id, via: h.via })) }; } }
cache('rerank', rrCache); console.log('ran', Object.keys(VARIANTS).length, 'variants');

// ---------- 5 + 6 pool and label ----------
SCHEMAS.grade = { type: 'object', required: ['grades'], properties: { grades: { type: 'array', items: { type: 'object', required: ['id', 'g'], properties: { id: { type: 'string' }, g: { type: 'number', minimum: 0, maximum: 2 } } } } } };
CHECKS.grade = (r, ctx) => { const got = new Set(r.grades.map(g => g.id)), e = []; ctx.ids.forEach(id => got.has(id) || e.push('$.grades: missing ' + id)); r.grades.forEach(g => ctx.ids.includes(g.id) || e.push('$.grades: unknown id ' + g.id)); return e; };
const gold = cache('gold') || {};
const STEP = { interview: 'choose the next question to ask the creator and what to assume', options: 'propose 3 game options (genre, theme, counts, lighting, route, difficulty)',
  prototype: 'write the prototype: look, palette, story beats, flow, playtest questions', build: 'write the build plan the engine will build (layout, objects, counts, timings)' };
// cards pooled by a variant added later are graded on their own, the earlier grades are kept
const todo = x => [...new Set(Object.values(runs).flatMap(r => r[x.id].pool))].filter(id => !(gold[x.id] && id in gold[x.id])).sort();
await pool(Q.filter(x => todo(x).length), 5, async x => {
  const ids = todo(x), b = x.q.brief || {}, o = x.q.option;
  const list = ids.map(id => { const c = byId.get(id); return `- ${id}: ${c.title}. ${c.text} WHEN: ${c.use_when || ''}`; }).join('\n');
  const r = await structured('grade', `You are labelling a test set for a design-knowledge search. A game-design AI is at the "${x.phase}" step: it must ${STEP[x.phase]}.
The creator's situation:
- brief: ${JSON.stringify(b)}
${o?.title ? `- chosen option: ${JSON.stringify(o)}\n` : ''}- creator's words: ${(x.q.history || []).map(h => h.text).join(' / ')}${x.q.comments ? `\n- creator's comments on the prototype: ${x.q.comments}` : ''}

Grade EVERY card below for THIS step and THIS creator:
2 = essential: it directly applies here, and without it the AI would likely make a worse or wrong decision (a constraint, a safety or accessibility fact, a size or light fact, a rule of the chosen genre, the creator's explicit wish)
1 = helpful: relevant and useful here, but not essential
0 = not relevant here (another genre, platform, audience or situation, or too generic to change anything)
Be strict: most cards should be 0 or 1. The order of the list means nothing.

Cards:
${list}`, { ctx: { ids }, model: 'k3.1-pro', effort: 'low', maxTokens: 12000 });
  gold[x.id] = { ...(gold[x.id] || {}), ...Object.fromEntries(r.result.grades.map(g => [g.id, Math.round(g.g)])) }; cache('gold', gold); process.stdout.write('g'); });
console.log(' labelled');

// ---------- 7 measure ----------
const K_ = { interview: 6, options: 9, prototype: 9, build: 6 };
const metrics = (got, g, k) => { const rel = Object.entries(g).filter(([, v]) => v >= 1).map(([id]) => id), ess = rel.filter(id => g[id] === 2), top = got.slice(0, k).map(h => h.id);
  const hit = top.filter(id => (g[id] || 0) >= 1).length, first = top.findIndex(id => g[id] === 2);
  const dcg = top.reduce((s, id, r) => s + ((2 ** (g[id] || 0)) - 1) / Math.log2(r + 2), 0), ideal = Object.values(g).sort((a, b) => b - a).slice(0, k).reduce((s, v, r) => s + ((2 ** v) - 1) / Math.log2(r + 2), 0);
  return { recall: rel.length ? hit / rel.length : 1, essential: ess.length ? top.filter(id => g[id] === 2).length / ess.length : 1, precision: hit / k, mrr: first >= 0 ? 1 / (first + 1) : 0, ndcg: ideal ? dcg / ideal : 1 }; };
const rows = Object.keys(VARIANTS).map(name => { const per = Q.map(x => metrics(runs[name][x.id].got, gold[x.id], K_[x.phase])), avg = f => +(per.reduce((s, m) => s + m[f], 0) / per.length).toFixed(3);
  return { variant: name, 'Recall@k': avg('recall'), 'Essential recall@k': avg('essential'), 'Precision@k': avg('precision'), 'MRR (essential)': avg('mrr'), 'nDCG@k': avg('ndcg') }; });
console.table(rows);
// paired: on how many steps does each variant beat / lose to the live baseline (essential recall), and a sign-test p
const A = Object.keys(VARIANTS)[0], binom = (n, k) => { let c = 1; for (let i = 0; i < k; i++) c = c * (n - i) / (i + 1); return c; };
const paired = Object.keys(VARIANTS).slice(1).map(name => { let w = 0, l = 0; Q.forEach(x => { const a = metrics(runs[A][x.id].got, gold[x.id], K_[x.phase]).essential, b = metrics(runs[name][x.id].got, gold[x.id], K_[x.phase]).essential; if (b > a + 1e-9) w++; else if (a > b + 1e-9) l++; });
  const n = w + l, m = Math.min(w, l); let p = 0; for (let i = 0; i <= m; i++) p += binom(n, i); p = Math.min(1, 2 * p / 2 ** n); return { variant: name, better: w, worse: l, same: Q.length - n, 'sign test p': +p.toFixed(4) }; });
console.table(paired);
const byPhase = Object.fromEntries(['interview', 'options', 'prototype', 'build'].map(p => [p, Object.fromEntries(Object.keys(VARIANTS).map(name => { const xs = Q.filter(x => x.phase === p);
  return [name, +(xs.reduce((s, x) => s + metrics(runs[name][x.id].got, gold[x.id], K_[p]).essential, 0) / xs.length).toFixed(3)]; }))]));
const poolStats = { cards_judged: Q.reduce((s, x) => s + Object.keys(gold[x.id]).length, 0), essential: Q.reduce((s, x) => s + Object.values(gold[x.id]).filter(v => v === 2).length, 0), helpful: Q.reduce((s, x) => s + Object.values(gold[x.id]).filter(v => v === 1).length, 0) };
fs.writeFileSync(path.join(K, 'eval-cards.json'), JSON.stringify({ built: new Date().toISOString(), steps: Q.length, sessions: SESSIONS.length, labeller: 'Kimi k3.1-pro, blind to variant', pool: poolStats, rows, paired_vs_baseline: paired, essential_by_phase: byPhase,
  steps_detail: Q.map(x => ({ id: x.id, phase: x.phase, refined: refined[x.id], gold: gold[x.id], got: Object.fromEntries(Object.keys(VARIANTS).map(n => [n, runs[n][x.id].got])) })) }, null, 1));
console.log('pool', poolStats, '\nessential recall by phase', byPhase, '\nwrote knowledge/eval-cards.json');
