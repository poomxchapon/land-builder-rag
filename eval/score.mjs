// Recomputes every number in the results table from the published runs and labels. No keys, no network.
//   node eval/score.mjs                 Kimi labels (all 36 steps)
//   node eval/score.mjs --claude        the second labeller (Claude, 8 steps)
// eval/eval-cards.json holds, for each of the 36 design steps, the cards every method returned (in order).
// eval/labels/*.json hold the graded pool: { step id: { card id: 0 | 1 | 2 } }, 2 = essential, 1 = helpful.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const D = path.dirname(fileURLToPath(import.meta.url));
const ev = JSON.parse(fs.readFileSync(path.join(D, 'eval-cards.json'), 'utf8'));
const who = process.argv.includes('--claude') ? 'claude' : 'kimi', gold = JSON.parse(fs.readFileSync(path.join(D, 'labels', who + '.json'), 'utf8'));
const steps = ev.steps_detail.filter(s => gold[s.id]), variants = Object.keys(steps[0].got);
const K = { interview: 6, options: 9, prototype: 9, build: 6 };   // what the live system sends per phase

function metrics(got, g, k) {
  const rel = Object.keys(g).filter(id => g[id] >= 1), ess = rel.filter(id => g[id] === 2), top = got.slice(0, k).map(h => h.id);
  const hit = top.filter(id => (g[id] || 0) >= 1).length, first = top.findIndex(id => g[id] === 2);
  const dcg = top.reduce((s, id, r) => s + (2 ** (g[id] || 0) - 1) / Math.log2(r + 2), 0);
  const ideal = Object.values(g).sort((a, b) => b - a).slice(0, k).reduce((s, v, r) => s + (2 ** v - 1) / Math.log2(r + 2), 0);
  return { recall: rel.length ? hit / rel.length : 1, essential: ess.length ? top.filter(id => g[id] === 2).length / ess.length : 1,
    precision: hit / k, mrr: first >= 0 ? 1 / (first + 1) : 0, ndcg: ideal ? dcg / ideal : 1 };
}
const per = v => steps.map(s => metrics(s.got[v], gold[s.id], K[s.phase]));
const avg = (xs, f) => +(xs.reduce((s, m) => s + m[f], 0) / xs.length).toFixed(3);
const binom = (n, k) => { let c = 1; for (let i = 0; i < k; i++) c = c * (n - i) / (i + 1); return c; };
const base = per(variants[0]);

console.log(`${steps.length} steps, labels: ${who}`);
console.table(variants.map(v => { const m = per(v); let w = 0, l = 0;
  m.forEach((x, i) => { if (x.essential > base[i].essential + 1e-9) w++; else if (base[i].essential > x.essential + 1e-9) l++; });
  let p = 0; for (let i = 0; i <= Math.min(w, l); i++) p += binom(w + l, i);
  return { method: v, 'Recall@k': avg(m, 'recall'), 'Essential recall@k': avg(m, 'essential'), 'Precision@k': avg(m, 'precision'), 'MRR': avg(m, 'mrr'), 'nDCG@k': avg(m, 'ndcg'),
    'better/worse vs A': v === variants[0] ? '' : `${w}/${l}`, 'sign p': v === variants[0] ? '' : +Math.min(1, 2 * p / 2 ** (w + l)).toFixed(4) }; }));
