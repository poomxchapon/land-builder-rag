// Step 5: the knowledge graph. Nodes are concepts (every knowledge card) and the raw sources; edges say how they connect:
//   similar   card <-> card    the two cards mean nearly the same kind of thing (each card's 3 nearest, cosine >= SIM)
//   tag       card <-> card    same genre rule set or same venue/space topic AND similar (keeps the graph readable)
//   from      card  -> source  the card was distilled from chunks of this source (ingest/distill.mjs)
//   evidence  card  -> source  a hand-written card that a real source backs up (a distilled card said the same thing)
// Writes knowledge/graph.json (for dev/kg.html) and prints the most connected concepts.
// Usage: node knowledge/ingest/graph.mjs
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { loadIndex } from '../../ai/rag.mjs';

const K = path.join(path.dirname(fileURLToPath(import.meta.url)), '..'), SIM = 0.62, NEAR = 3;
const IX = loadIndex(JSON.parse(fs.readFileSync(path.join(K, 'index.json'), 'utf8')));
const CH = JSON.parse(fs.readFileSync(path.join(K, 'chunks.json'), 'utf8')), chunk = Object.fromEntries(CH.chunks.map(c => [c.id, c]));
const EV = fs.existsSync(path.join(K, 'evidence.json')) ? JSON.parse(fs.readFileSync(path.join(K, 'evidence.json'), 'utf8')) : {};
const dot = (a, b) => { let s = 0; for (let k = 0; k < a.length; k++) s += a[k] * b[k]; return s; };

const nodes = IX.cards.map(c => ({ id: c.id, type: 'card', cat: c.cat, kind: c.kind, title: c.title, text: c.text, source: c.source, from: c.from || [], genre: c.tags?.genre || [], platform: c.tags?.platform || [] }));
for (const s of CH.sources) nodes.push({ id: 'src:' + s.id, type: 'source', title: s.title, kind: s.kind, stype: s.type, chunks: s.stats?.chunks || 0, tokens: s.stats?.tokens || 0 });
const edges = [], seen = new Set(), add = (a, b, type, w) => { const k = a < b ? a + '|' + b + '|' + type : b + '|' + a + '|' + type; if (seen.has(k)) return; seen.add(k); edges.push({ a, b, type, w: +w.toFixed(3) }); };
IX.cards.forEach((c, i) => { const near = IX.cards.map((d, j) => [j, i === j ? -1 : dot(IX.vecs[i], IX.vecs[j])]).sort((p, q) => q[1] - p[1]).slice(0, NEAR);
  for (const [j, s] of near) if (s >= SIM) add(c.id, IX.cards[j].id, (c.tags?.genre?.length && c.tags.genre.join() === IX.cards[j].tags?.genre?.join()) || (c.cat === 'space' && IX.cards[j].cat === 'space') ? 'tag' : 'similar', s); });
for (const c of IX.cards) { const by = {}; for (const f of c.from || []) { const s = chunk[f]?.source; if (s) by[s] = (by[s] || 0) + 1; } for (const [s, n] of Object.entries(by)) add(c.id, 'src:' + s, 'from', n); }
for (const [id, list] of Object.entries(EV)) { const by = {}; for (const f of list) { const s = chunk[f]?.source; if (s) by[s] = (by[s] || 0) + 1; } for (const [s, n] of Object.entries(by)) add(id, 'src:' + s, 'evidence', n); }

// the chunk text behind each distilled card (short), so the viewer can show where a card came from
const quotes = {}; for (const n of nodes) for (const f of n.from || []) if (chunk[f]) quotes[f] = { source: chunk[f].source, loc: chunk[f].loc, text: chunk[f].text.slice(0, 600) };
for (const list of Object.values(EV)) for (const f of list) if (chunk[f]) quotes[f] = { source: chunk[f].source, loc: chunk[f].loc, text: chunk[f].text.slice(0, 600) };
const deg = {}; edges.forEach(e => { deg[e.a] = (deg[e.a] || 0) + 1; deg[e.b] = (deg[e.b] || 0) + 1; });
nodes.forEach(n => n.degree = deg[n.id] || 0); Object.entries(EV).forEach(([id, l]) => { const n = nodes.find(x => x.id === id); if (n) n.evidence = l; });
// connected parts (union-find over card-card edges)
const P = {}, f = x => P[x] === undefined || P[x] === x ? (P[x] = x) : (P[x] = f(P[x])); edges.filter(e => e.type === 'similar' || e.type === 'tag').forEach(e => { P[f(e.a)] = f(e.b); });
const comps = {}; nodes.filter(n => n.type === 'card').forEach(n => comps[f(n.id)] = (comps[f(n.id)] || 0) + 1);
const stats = { cards: IX.cards.length, sources: CH.sources.length, chunks: CH.chunks.length, edges: edges.length, by_type: edges.reduce((o, e) => (o[e.type] = (o[e.type] || 0) + 1, o), {}),
  distilled: IX.cards.filter(c => c.from?.length).length, backed_by_evidence: Object.keys(EV).length, isolated: nodes.filter(n => n.type === 'card' && !n.degree).length,
  parts: Object.values(comps).filter(n => n > 1).length, largest_part: Math.max(...Object.values(comps)),
  hubs: nodes.filter(n => n.type === 'card').sort((a, b) => b.degree - a.degree).slice(0, 10).map(n => ({ id: n.id, title: n.title, degree: n.degree })) };
fs.writeFileSync(path.join(K, 'graph.json'), JSON.stringify({ built: new Date().toISOString(), stats, nodes, edges, quotes }));
console.log(JSON.stringify({ ...stats, hubs: stats.hubs.map(h => `${h.degree} ${h.title}`) }, null, 1));
