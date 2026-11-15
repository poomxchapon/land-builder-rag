// Second labeller check for eval-cards: a separate Claude agent graded 8 of the 36 steps blind (no Kimi grades, no variants).
//   node knowledge/ingest/eval-agree.mjs     -> agreement (weighted kappa) + the main result recomputed with the Claude labels
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const K = path.join(path.dirname(fileURLToPath(import.meta.url)), '..'), C = path.join(K, '.cache/evalc');
const kimi = JSON.parse(fs.readFileSync(path.join(C, 'gold.json'), 'utf8')), claude = JSON.parse(fs.readFileSync(path.join(C, 'agree/claude.json'), 'utf8'));
const ev = JSON.parse(fs.readFileSync(path.join(K, 'eval-cards.json'), 'utf8')), steps = new Map(ev.steps_detail.map(s => [s.id, s]));

// agreement on the cards both graded
const pairs = []; for (const [step, g] of Object.entries(claude)) for (const [id, v] of Object.entries(g)) if (id in (kimi[step] || {})) pairs.push([kimi[step][id], v]);
const n = pairs.length, exact = pairs.filter(([a, b]) => a === b).length / n, within1 = pairs.filter(([a, b]) => Math.abs(a - b) <= 1).length / n;
const kappa = w => { const pa = [0, 0, 0], pb = [0, 0, 0]; pairs.forEach(([a, b]) => { pa[a]++; pb[b]++; }); let o = 0, e = 0;
  pairs.forEach(([a, b]) => o += w(a, b)); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) e += w(i, j) * pa[i] * pb[j] / n; return 1 - o / e; };
const qk = kappa((a, b) => (a - b) ** 2), ck = kappa((a, b) => a === b ? 0 : 1);
const conf = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; pairs.forEach(([a, b]) => conf[a][b]++);

// the main comparison again, on these 8 steps, once with Kimi's grades and once with Claude's
const K_ = { interview: 6, options: 9, prototype: 9, build: 6 };
const ess = (got, g, k) => { const e = Object.keys(g).filter(id => g[id] === 2); return e.length ? got.slice(0, k).filter(h => g[h.id] === 2).length / e.length : 1; };
const prec = (got, g, k) => got.slice(0, k).filter(h => (g[h.id] || 0) >= 1).length / k;
const V = ['A live baseline (dense + tag boosts)', 'C + facts by rules', 'D + hybrid BM25 + RRF', 'E + hybrid + rerank', 'I facts + graph'];
const table = V.map(v => { const row = { variant: v }; for (const [who, G] of [['Kimi', kimi], ['Claude', claude]]) { const ids = Object.keys(claude);
  row[`essential recall (${who})`] = +(ids.reduce((s, id) => s + ess(steps.get(id).got[v], G[id], K_[steps.get(id).phase]), 0) / ids.length).toFixed(3);
  row[`precision (${who})`] = +(ids.reduce((s, id) => s + prec(steps.get(id).got[v], G[id], K_[steps.get(id).phase]), 0) / ids.length).toFixed(3); } return row; });
console.log({ cards: n, exact: +exact.toFixed(3), within1: +within1.toFixed(3), quadratic_kappa: +qk.toFixed(3), cohen_kappa: +ck.toFixed(3) }); console.log('rows Kimi 0/1/2, cols Claude 0/1/2', conf); console.table(table);
fs.writeFileSync(path.join(K, 'eval-agree.json'), JSON.stringify({ built: new Date().toISOString(), steps: Object.keys(claude), second_labeller: 'Claude agent, blind', cards: n, exact, within1, quadratic_kappa: qk, cohen_kappa: ck, confusion_kimi_rows_claude_cols: conf, table }, null, 1));
