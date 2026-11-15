// RAG v2 experiments, following the retrieval cascade in the NLP and LLMs lecture (Module 7):
//   facts      structured facts are routed by rules, not by vector search ("not every question belongs in a vector database")
//   lexical    BM25 over the card text, on a refined English query (cards are English, many briefs are Thai)
//   fusion     reciprocal rank fusion of the dense and lexical rankings
//   rerank     a cross-encoder scores (query, card) pairs on the fused top candidates
//   graph      one hop over the knowledge graph from the brief's concepts and the top hits
// Pure functions, no Node imports: the same file can run in the local server and in the Cloudflare Worker.
import { retrieve } from './rag.mjs';

// ---------- lexical: BM25 ----------
const STOP = new Set('a an and are as at be but by can do does for from has have if in into is it its not of on or so than that the then there these this to was were what when where which while who will with you your they their them one two any all each more most no yes very only also just like'.split(' '));
export const tokens = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(w => w.length > 1 && !STOP.has(w)).map(w => w.replace(/(ing|ed|es|s)$/, '') || w);
const cardText = c => `${c.title} ${c.title} ${c.text} ${c.use_when || ''} ${(c.do || []).join(' ')} ${(c.avoid || []).join(' ')}`;

/** builds a BM25 index over the cards once */
export function bm25Index(cards, k1 = 1.2, b = 0.75) {
  const docs = cards.map(c => { const tf = new Map(), t = tokens(cardText(c)); t.forEach(w => tf.set(w, (tf.get(w) || 0) + 1)); return { tf, len: t.length }; });
  const df = new Map(); docs.forEach(d => d.tf.forEach((_, w) => df.set(w, (df.get(w) || 0) + 1)));
  const N = docs.length, avg = docs.reduce((s, d) => s + d.len, 0) / N;
  return { docs, idf: w => { const n = df.get(w) || 0; return Math.log(1 + (N - n + .5) / (n + .5)); }, k1, b, avg };
}
/** @returns [{ i, score }] best first */
export function bm25Rank(bm, query, top = 50) {
  const q = [...new Set(tokens(query))];
  return bm.docs.map((d, i) => { let s = 0; for (const w of q) { const f = d.tf.get(w); if (!f) continue; s += bm.idf(w) * f * (bm.k1 + 1) / (f + bm.k1 * (1 - bm.b + bm.b * d.len / bm.avg)); } return { i, score: s }; })
    .filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, top);
}

// ---------- fusion ----------
/** reciprocal rank fusion: score(d) = sum over rankings of 1 / (k0 + rank) */
export function rrf(rankings, k0 = 60) {
  const s = new Map(); rankings.forEach(list => list.forEach((i, r) => s.set(i, (s.get(i) || 0) + 1 / (k0 + r + 1))));
  return [...s.entries()].sort((a, b) => b[1] - a[1]).map(([i, score]) => ({ i, score }));
}

// ---------- facts routed by rules ----------
// a fact: { id, platform[], genre[], phase[], words[] (any one matches), side_max_m, side_min_m, dark, outdoor, kids, missing, always, all, priority }
const briefText = q => { const b = q.brief || {}, o = q.option || {};
  return [b.concept, b.players, b.group_size, b.vr_experience, b.environment, b.obstacles, b.time_of_day, b.constraints, b.spectators, o.title, o.pitch, o.theme, q.note, q.comments,
    ...(q.history || []).filter(t => t.who !== 'ai').map(t => t.text)].filter(Boolean).join(' \n ').toLowerCase(); };
export function factMatches(f, q) {
  const b = q.brief || {}, genre = q.option?.genre, why = [];
  if (f.platform?.length && b.platform && !f.platform.includes(b.platform)) return null;
  if (f.phase?.length && !f.phase.includes(q.phase)) return null;
  if (f.genre?.length) { if (!genre || !f.genre.includes(genre)) return null; why.push('genre ' + genre); }
  const side = Math.min(+b.width_m || 99, +b.depth_m || 99), text = briefText(q);
  // each trigger the fact names is checked; any one is enough, or every one when f.all (e.g. daylight AND a dark theme)
  const res = [];
  if (f.always) res.push(true);
  if (f.side_max_m) { const ok = side <= f.side_max_m; res.push(ok); if (ok) why.push(`space ${side} m <= ${f.side_max_m}`); }
  if (f.side_min_m) { const ok = side < 99 && side >= f.side_min_m; res.push(ok); if (ok) why.push(`space ${side} m >= ${f.side_min_m}`); }
  if (f.kids) { const ok = /kid|child|year \d|เด็ก|ลูก|หลาน|ป\.\s?\d|ขวบ|อนุบาล|famil|son|daughter/i.test(text); res.push(ok); if (ok) why.push('children'); }
  if (f.dark != null) { const dark = /night|dark|evening|lamp|กลางคืน|มืด|ค่ำ/i.test(`${b.time_of_day} ${b.environment}`), ok = dark === f.dark; res.push(ok); if (ok) why.push(dark ? 'dark room' : 'daylight'); }
  if (f.outdoor) { const ok = b.indoor === false || /outdoor|outside|garden|yard|กลางแจ้ง|สนาม/i.test(`${b.environment}`); res.push(ok); if (ok) why.push('outdoors'); }
  if (f.words?.length) { const w = f.words.find(x => x && text.includes(x.toLowerCase())); res.push(!!w); if (w) why.push(`said "${w}"`); }
  if (f.missing) { const ok = !(b[f.missing] ?? null); res.push(ok); if (ok) why.push(`${f.missing} unknown`); }
  const trig = res.length && (f.all ? res.every(Boolean) : res.some(Boolean));
  return trig ? why.join(', ') || 'always' : null;
}
/** the facts this step must see, best first: [{ card, why }] */
export function routeFacts(facts, byId, q, max = 3) {
  return facts.map(f => ({ f, why: factMatches(f, q) })).filter(x => x.why && byId.has(x.f.id))
    .sort((a, b) => (b.f.priority || 1) - (a.f.priority || 1) || (b.why.split(',').length - a.why.split(',').length))
    .slice(0, max).map(x => ({ card: byId.get(x.f.id), why: x.why }));
}

// ---------- graph ----------
/** adjacency from knowledge/graph.json (card to card edges only) */
export function graphIndex(g) { const adj = new Map(); for (const e of g.edges) { if (e.type === 'from' || e.type === 'evidence') continue;
  for (const [a, b] of [[e.a, e.b], [e.b, e.a]]) { if (!adj.has(a)) adj.set(a, []); adj.get(a).push([b, e.w || .5, e.type]); } } return adj; }
/** one hop from the seeds (top hits): a neighbour gains the seed's weight times the edge weight */
export function graphExpand(adj, seeds, top = 20) { const s = new Map();
  seeds.forEach(({ id, w }) => (adj.get(id) || []).forEach(([b, ew]) => s.set(b, (s.get(b) || 0) + w * ew)));
  seeds.forEach(({ id }) => s.delete(id)); return [...s.entries()].sort((a, b) => b[1] - a[1]).slice(0, top); }

// ---------- the cascade ----------
// opts: { lexical, rerank (fn(query, cards) -> scores), facts, graph, refined (English query text) }
const K = { interview: 6, options: 9, prototype: 9, build: 6 };
const capPerCat = (list, k, per = 3, have = []) => { const out = [...have], n = {}; have.forEach(x => n[x.card.cat] = (n[x.card.cat] || 0) + 1);
  for (const x of list) { if (out.length >= k) break; if (out.some(o => o.card.id === x.card.id)) continue; if ((n[x.card.cat] = (n[x.card.cat] || 0) + 1) > 3) continue; out.push(x); } return out; };

/** @returns [{ card, score, via }] in the order the AI would get them */
export async function retrieve2(ix, qvec, q, opts = {}) {
  const k = opts.k || K[q.phase] || 6, factIds = opts.facts ? new Set(opts.facts.list.map(f => f.id)) : null;
  // dense with the live boosts (the baseline ranking), facts left out when they are routed by rules
  const all = retrieve(ix, qvec, q, 0, true);
  let dense = all.filter(x => x.score > 0 && !(factIds && factIds.has(x.card.id))).sort((a, b) => b.score - a.score).slice(0, 60);
  let ranked = dense.map(x => ({ i: x.i, score: x.score, via: 'dense' }));
  if (opts.lexical) { const lex = bm25Rank(opts.lexical, opts.refined || '', 60).filter(x => !(factIds && factIds.has(ix.cards[x.i].id)) && all[x.i].score > 0);
    const viaL = new Set(lex.slice(0, 20).map(x => x.i)), viaD = new Set(dense.slice(0, 20).map(x => x.i));
    ranked = rrf([dense.map(x => x.i), lex.map(x => x.i)]).map(x => ({ ...x, via: viaD.has(x.i) && viaL.has(x.i) ? 'both' : viaL.has(x.i) ? 'lexical' : 'dense' })); }
  if (opts.graph) { const seeds = ranked.slice(0, 5).map((x, r) => ({ id: ix.cards[x.i].id, w: 1 / (r + 1) })), idx = new Map(ix.cards.map((c, i) => [c.id, i]));
    const add = graphExpand(opts.graph, seeds).map(([id, s]) => ({ i: idx.get(id), s })).filter(x => x.i != null && !(factIds && factIds.has(ix.cards[x.i].id)));
    const top = ranked[0]?.score || 1, have = new Map(ranked.map(x => [x.i, x]));
    for (const a of add) { const g = a.s * top * .35; if (have.has(a.i)) have.get(a.i).score += g; else { const x = { i: a.i, score: g, via: 'graph' }; ranked.push(x); have.set(a.i, x); } }
    ranked.sort((a, b) => b.score - a.score); }
  let list = ranked.map(x => ({ card: ix.cards[x.i], score: x.score, via: x.via }));
  if (opts.rerank) { const cand = list.slice(0, 30), sc = await opts.rerank(opts.refined || '', cand.map(x => x.card));
    list = cand.map((x, j) => ({ ...x, score: sc[j], via: x.via + '+rerank' })).sort((a, b) => b.score - a.score); }
  const facts = opts.facts ? routeFacts(opts.facts.list, opts.facts.byId, q).map(x => ({ card: x.card, score: 1, via: 'rule: ' + x.why })) : [];
  return capPerCat(list, k, 3, facts);
}
