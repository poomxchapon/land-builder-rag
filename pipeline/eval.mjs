// How good is the database? A retrieval test, the way the Hugging Face "RAG evaluation" cookbook does it:
//   1 pick chunks across all sources, 2 Kimi writes one question a designer would ask that the chunk answers, plus a
//   short answer quoted word for word from it (checked in code), 3 embed each question, 4 search every database
//   variant, 5 a hit = a retrieved chunk contains the quoted answer. Because the test is about the answer text, not a
//   chunk id, it compares different ways of splitting the same sources fairly.
// Usage: node knowledge/ingest/eval.mjs [--n 60]            variants: knowledge/chunks.json + knowledge/.cache/chunks-*.json
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import { fileURLToPath } from 'node:url';
import { configure, structured } from '../../ai/engine.mjs';
import { SCHEMAS, CHECKS } from '../../ai/schema.mjs';
import { EMBED_MODEL, queryText } from '../../ai/rag.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url)), K = path.join(DIR, '..'), C = path.join(K, '.cache');
const N = +(process.argv[process.argv.indexOf('--n') + 1] || 60), QA = path.join(C, 'eval-qa.json');
configure({ key: () => process.env.KIMI_API_KEY || fs.readFileSync(path.join(os.homedir(), '.kimi/api_key'), 'utf8') });
// the Thai sara am fix (ingest.py) is applied here too, so answers match whichever version of the PDF text a variant holds
const norm = s => String(s).replace(/([ก-ฮ][่-๋]?) า/g, '$1ำ').toLowerCase().replace(/\s+/g, ' ').replace(/[“”"']/g, '').trim();

SCHEMAS.evalqa = { type: 'object', required: ['question', 'answer_quote'], properties: { question: { type: 'string', minLength: 12 }, answer_quote: { type: 'string', minLength: 6 } } };
CHECKS.evalqa = (r, ctx) => { const e = [], q = norm(r.answer_quote);
  if (!norm(ctx.text).includes(q)) e.push('$.answer_quote: must be copied word for word from the chunk (a short exact span, 3 to 12 words)');
  if (q.split(' ').length > 16) e.push('$.answer_quote: keep it short, 3 to 12 words');
  if (/this (document|chunk|text|section|gdd)|the source/i.test(r.question)) e.push('$.question: ask as a designer would, without mentioning the document');
  return e; };

const base = JSON.parse(fs.readFileSync(path.join(K, 'chunks.json'), 'utf8'));
let qa = fs.existsSync(QA) ? JSON.parse(fs.readFileSync(QA, 'utf8')) : [];
if (qa.length < N) {
  // spread the picks over the sources (more from big ones), skip code summaries: designers ask about design, not code
  const pool = base.chunks.filter(c => !/^(Unity script|Source file)/.test(c.text) && c.tokens > 80), by = {};
  pool.forEach(c => (by[c.source] ||= []).push(c));
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const picks = []; while (picks.length < N - qa.length) for (const list of Object.values(by)) { if (!list.length || picks.length >= N - qa.length) continue; picks.push(list.splice(Math.floor(rnd() * list.length), 1)[0]); }
  let done = 0;
  await Promise.all(Array.from({ length: 6 }, async () => { while (picks.length) { const c = picks.shift();
    try { const r = await structured('evalqa', `Write ONE question that a game designer or a game creator might ask an AI design assistant, which this passage answers. Ask about the design knowledge (a number, a rule, a fact, a reason), in the same language as the passage, without mentioning the passage or the document. Then copy the answer as a short exact span (3 to 12 words) from the passage.\n\nPassage (from "${c.source_title}"):\n${c.text}\n\nCall the tool with { "question": "...", "answer_quote": "..." }.`, { ctx: { text: c.text }, model: 'k3.1-pro', effort: 'low', maxTokens: 4000 });
      qa.push({ chunk: c.id, source: c.source, ...r.result }); } catch (e) { console.log('  ! ' + c.id + ': ' + e.message.slice(0, 100)); }
    process.stdout.write(`\r  questions ${++done}`); } }));
  fs.writeFileSync(QA, JSON.stringify(qa, null, 1)); console.log(''); }
console.log(`${qa.length} test questions`);

const ACCOUNT = process.env.CF_ACCOUNT || '';
const cfTok = () => process.env.CF_API_TOKEN || (fs.readFileSync(path.join(process.env.APPDATA || os.homedir(), 'xdg.config/.wrangler/config/default.toml'), 'utf8').match(/oauth_token = "([^"]+)"/) || [])[1];
const QV = path.join(C, 'eval-qvec.json'); let qv = fs.existsSync(QV) ? JSON.parse(fs.readFileSync(QV, 'utf8')) : {};
const need = qa.filter(q => !qv[q.question]);
for (let i = 0; i < need.length; i += 50) { const part = need.slice(i, i + 50);
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/ai/run/${EMBED_MODEL}`, { method: 'POST', headers: { authorization: 'Bearer ' + cfTok(), 'content-type': 'application/json' }, body: JSON.stringify({ text: part.map(q => queryText(q.question)) }) }).then(r => r.json());
  if (!r.success) throw new Error(JSON.stringify(r.errors)); part.forEach((q, j) => qv[q.question] = r.result.data[j]); }
fs.writeFileSync(QV, JSON.stringify(qv));

const unpack = ix => { const bin = Buffer.from(ix.vecs, 'base64'), d = ix.dim; return ix.chunks.map((_, i) => { const v = new Float32Array(d); let n = 0; for (let k = 0; k < d; k++) { const b = bin[i * d + k]; v[k] = b > 127 ? b - 256 : b; n += v[k] * v[k]; } n = Math.sqrt(n) || 1; for (let k = 0; k < d; k++) v[k] /= n; return v; }); };
const variants = [['chunks.json', path.join(K, 'chunks.json')], ...fs.readdirSync(C).filter(f => /^chunks-.*\.json$/.test(f)).map(f => [f, path.join(C, f)])];
const rows = [];
for (const [name, file] of variants) { const ix = JSON.parse(fs.readFileSync(file, 'utf8')), vecs = unpack(ix), texts = ix.chunks.map(c => norm(c.text));
  let h1 = 0, h5 = 0, mrr = 0; const miss = [];
  for (const q of qa) { const v = qv[q.question], n = Math.hypot(...v), a = norm(q.answer_quote);
    const top = vecs.map((x, i) => { let s = 0; for (let k = 0; k < x.length; k++) s += x[k] * v[k]; return [s / n, i]; }).sort((p, r) => r[0] - p[0]).slice(0, 10);
    const rank = top.findIndex(([, i]) => texts[i].includes(a)); if (rank === 0) h1++; if (rank >= 0 && rank < 5) h5++; if (rank >= 0) mrr += 1 / (rank + 1); else miss.push(q.question); }
  const avg = ix.chunks.reduce((s, c) => s + c.tokens, 0) / ix.chunks.length;
  rows.push({ variant: name, max_tokens: ix.split?.max_tokens, header: !/nohead/.test(name), chunks: ix.chunks.length, avg_tokens: Math.round(avg), hit1: +(h1 / qa.length).toFixed(3), hit5: +(h5 / qa.length).toFixed(3), mrr10: +(mrr / qa.length).toFixed(3), tokens_for_top5: Math.round(avg * 5), miss: miss.slice(0, 5) }); }
rows.sort((a, b) => (a.max_tokens || 0) - (b.max_tokens || 0) || (a.header ? 1 : -1));
console.table(rows.map(({ miss, ...r }) => r));
fs.writeFileSync(path.join(K, 'eval.json'), JSON.stringify({ built: new Date().toISOString(), questions: qa.length, method: 'synthetic QA (Kimi), answer span must appear in a retrieved chunk', rows, qa }, null, 1));
