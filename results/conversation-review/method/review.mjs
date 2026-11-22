// Blind pair reviews (Design X / Design Y) by two AI models, then an unblinded synthesis answering the three questions.
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import { spawn } from 'node:child_process';
const OUT = path.resolve('out'), AB = 'D:/Unity/Oracle/rift-builder/dev/ab', RAG = 'D:/Unity/Oracle/land-builder-rag';
const briefs = JSON.parse(fs.readFileSync(AB + '/briefs.json', 'utf8')), key = JSON.parse(fs.readFileSync(OUT + '/blind-key.json', 'utf8'));
const cards = new Map(JSON.parse(fs.readFileSync(RAG + '/data/index.json', 'utf8')).cards.map(c => [c.id, c]));
const KEY = fs.readFileSync(path.join(os.homedir(), '.kimi/api_key'), 'utf8').trim();

const obj = p => ({ type: 'object', additionalProperties: false, required: Object.keys(p), properties: p }), S = { type: 'string' }, A = i => ({ type: 'array', items: i }), E = (...v) => ({ type: 'string', enum: v });
const PAIR = obj({ summary: S, differences: A(obj({ aspect: S, design_x: S, design_y: S, evidence: S, better: E('X', 'Y', 'same') })), preferred: E('X', 'Y', 'tie'), confidence: E('low', 'medium', 'high'), why: S, x_weaknesses: A(S), y_weaknesses: A(S), improvements: A(S) });
const SYN = obj({ overall_answer: S,
  q1_differences: A(obj({ difference: S, evidence: S, briefs: A(S), consistency: E('most briefs', 'some briefs', 'few briefs') })),
  q2_advantages: A(obj({ advantage: S, evidence: S, briefs: A(S), traced_to_retrieved_cards: E('yes', 'partly', 'no') })),
  rag_weaknesses: A(obj({ weakness: S, evidence: S, briefs: A(S) })),
  where_without_rag_was_better: A(obj({ brief: S, why: S })),
  q3_improvements: A(obj({ priority: { type: 'integer' }, improvement: S, why: S, how_to_test: S })),
  caveats: A(S) });

async function kimi(name, schema, prompt) {
  for (let i = 1; ; i++) {
    try {
      const ac = new AbortController(), t = setTimeout(() => ac.abort(), 600000);
      const r = await fetch('https://api.kimi.com/coding/v1/messages', { method: 'POST', signal: ac.signal, headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'k3', max_tokens: 16000, thinking: { type: 'disabled' }, tools: [{ name, description: 'Return the review', input_schema: schema }], tool_choice: { type: 'tool', name }, messages: [{ role: 'user', content: prompt }] }) });
      clearTimeout(t); const j = await r.json(); if (!r.ok) throw new Error(r.status + ' ' + JSON.stringify(j).slice(0, 200));
      const u = (j.content || []).find(c => c.type === 'tool_use'); if (!u) throw new Error('no tool call'); return u.input;
    } catch (e) { if (i >= 4) throw e; console.log('kimi retry', i, String(e.message).slice(0, 140)); }
  }
}
function gptOnce(schema, prompt) {
  return new Promise((res, rej) => {
    const d = fs.mkdtempSync(path.join(OUT, 'tmp-')), sf = path.join(d, 's.json'), of = path.join(d, 'o.json'); fs.writeFileSync(sf, JSON.stringify(schema));
    const p = spawn('codex', ['exec', '--skip-git-repo-check', '--ephemeral', '-s', 'read-only', '-m', 'gpt-5.6-terra', '--output-schema', sf, '-o', of, '-'], { cwd: d, shell: true, stdio: ['pipe', 'ignore', 'pipe'] });
    let err = ''; p.stderr.on('data', x => err += x); const t = setTimeout(() => p.kill(), 1200000);
    p.on('close', c => { clearTimeout(t); try { res(JSON.parse(fs.readFileSync(of, 'utf8'))); } catch { rej(new Error('codex ' + c + ' ' + err.slice(-300))); } finally { fs.rmSync(d, { recursive: true, force: true }); } });
    p.stdin.end(prompt);
  });
}
async function gpt(name, schema, prompt) { for (let i = 1; ; i++) { try { return await gptOnce(schema, prompt); } catch (e) { if (i >= 3) throw e; console.log('gpt retry', i, String(e.message).slice(0, 200)); } } }
const MODELS = { kimi: { fn: kimi, par: 4 }, chatgpt: { fn: gpt, par: 3 } };
const pool = async (xs, n, f) => { const q = [...xs]; await Promise.all(Array.from({ length: n }, async () => { while (q.length) { const x = q.shift(); try { await f(x); } catch (e) { console.log('FAILED', x.id || x, String(e.message).slice(0, 240)); } } })); };

const pairPrompt = b => `You are an experienced game designer reviewing two AI-assisted design sessions. Both sessions started from the same creator brief and went through the same steps: three options, a prototype plan, then a build plan. They were produced by two different approaches, which you are not told about. Judge only what is on the page.

Compare Design X and Design Y for this brief. Always write "Design X" and "Design Y" in full. Report real differences that matter to the creator or the players (fit to the brief, gameplay, safety in the real space, specificity, feasibility, consistency between steps). Each difference needs concrete evidence from the sessions: name the step and give the detail, translated into English if the source is Thai. Do not assume that longer is better. If neither is better on an aspect, say "same". A tie is an acceptable verdict. Write in English.

===== DESIGN X SESSION =====
${fs.readFileSync(`${OUT}/blind/${b.id}-X.md`, 'utf8')}

===== DESIGN Y SESSION =====
${fs.readFileSync(`${OUT}/blind/${b.id}-Y.md`, 'utf8')}`;

const name = (k, l) => k[l] === 'on' ? 'With RAG' : 'Without RAG';
const un = (t, k) => String(t).replace(/\bDesign X\b/g, name(k, 'X')).replace(/\bDesign Y\b/g, name(k, 'Y')).replace(/\bX\b/g, name(k, 'X')).replace(/\bY\b/g, name(k, 'Y'));
const lab = (v, k) => v === 'X' || v === 'Y' ? (k[v] === 'on' ? 'with_rag' : 'without_rag') : v;
function unmask(r, id) {
  const k = key[id], f = o => Array.isArray(o) ? o.map(f) : typeof o === 'string' ? un(o, k) : o, rag = k.X === 'on' ? 'x' : 'y', no = rag === 'x' ? 'y' : 'x';
  return { brief: id, summary: f(r.summary), preferred: lab(r.preferred, k), confidence: r.confidence, why: f(r.why),
    differences: r.differences.map(d => ({ aspect: f(d.aspect), with_rag: f(d['design_' + rag]), without_rag: f(d['design_' + no]), evidence: f(d.evidence), better: lab(d.better, k) })),
    with_rag_weaknesses: f(r[rag + '_weaknesses']), without_rag_weaknesses: f(r[no + '_weaknesses']), improvements: f(r.improvements) };
}
const retrieved = () => briefs.map(b => { const r = JSON.parse(fs.readFileSync(`${AB}/${b.id}-on.json`, 'utf8')), ids = [...new Set(r.calls.flatMap(c => c.rag || []))];
  return `### ${b.id}\n` + ids.map(i => { const c = cards.get(i); return `- ${i}: ${c?.title || '(not in current index)'}. ${(c?.text || '').slice(0, 320)}`; }).join('\n'); }).join('\n\n');

for (const m of Object.keys(MODELS)) fs.mkdirSync(`${OUT}/reviews/${m}`, { recursive: true });
await Promise.all(Object.entries(MODELS).map(async ([m, M]) => {
  await pool(briefs, M.par, async b => { const f = `${OUT}/reviews/${m}/${b.id}.json`; if (fs.existsSync(f)) return; const t = Date.now(), r = await M.fn('submit_review', PAIR, pairPrompt(b)); fs.writeFileSync(f, JSON.stringify(r, null, 1)); console.log('done', m, b.id, ((Date.now() - t) / 1000 | 0) + 's'); });
  const have = briefs.filter(b => fs.existsSync(`${OUT}/reviews/${m}/${b.id}.json`)); if (have.length < briefs.length) { console.log('INCOMPLETE', m, have.length); return; }
  const rs = have.map(b => unmask(JSON.parse(fs.readFileSync(`${OUT}/reviews/${m}/${b.id}.json`, 'utf8')), b.id)); fs.writeFileSync(`${OUT}/reviews/${m}/unblinded.json`, JSON.stringify(rs, null, 1));
  const sf = `${OUT}/reviews/${m}/synthesis.json`; if (fs.existsSync(sf)) return;
  const r = await M.fn('submit_synthesis', SYN, `Ten game briefs were each designed twice by the same AI model through the same steps. One run could retrieve cards from a game-design knowledge base (With RAG). The other had no knowledge base (Without RAG). Each pair was reviewed blind, without knowing which was which. The reviews are below, now labelled, followed by the cards the With RAG runs retrieved.

Answer these three questions across all ten briefs, in English:
1. What is the difference between the two approaches?
2. What is the advantage of the approach with RAG? For each advantage, check whether it can actually be traced to the retrieved cards (yes, partly or no). Do not credit RAG for something the cards do not contain.
3. What further improvement should be made? Give a priority order and a concrete way to test each improvement.

Also report honestly where RAG did not help or made things worse, and where the design without RAG was better. Base every claim on the reviews and name the briefs. List the limits of this evidence in caveats.

===== BLIND REVIEWS, LABELLED AFTERWARDS =====
${JSON.stringify(rs)}

===== CARDS RETRIEVED BY THE WITH RAG RUNS =====
${retrieved()}`);
  fs.writeFileSync(sf, JSON.stringify(r, null, 1)); console.log('done synthesis', m);
}));
console.log('ALL DONE');
