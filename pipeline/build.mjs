// Builds knowledge/index.json from knowledge/cards/*.json: checks every card against CARD-SPEC.md,
// embeds it with Workers AI (Cloudflare REST API, wrangler's login) and stores the vectors as int8 base64.
// Embeddings are cached by text, so re-running after adding cards only embeds the new ones.
// Usage: node knowledge/build.mjs            (check + embed + write)
//        node knowledge/build.mjs --check    (check only)
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { EMBED_MODEL, docText } from '../ai/rag.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url)), CARDS = path.join(DIR, 'cards'), CACHE = path.join(DIR, '.embcache.json');
const ACCOUNT = process.env.CF_ACCOUNT || '';
const token = () => process.env.CF_API_TOKEN || (fs.readFileSync(path.join(process.env.APPDATA || os.homedir(), 'xdg.config/.wrangler/config/default.toml'), 'utf8').match(/oauth_token = "([^"]+)"/) || [])[1];
const KINDS = ['principle', 'pattern', 'heuristic', 'question', 'default', 'genre-rule', 'example', 'pitfall', 'palette', 'style'];
const TAGS = { phase: ['interview', 'options', 'prototype', 'build'], platform: ['mr', 'pc'], genre: ['battle', 'tactics', 'runner'],
  feelings: ['sensation', 'fantasy', 'narrative', 'challenge', 'fellowship', 'discovery', 'expression', 'submission'],
  players: ['kids', 'teens', 'adults', 'families', 'seniors', 'first-time-vr', 'gamers', 'groups', 'solo'] };

const CATS = ['theory', 'genre', 'space', 'uncertainty', 'prototype', 'cases', 'culture', 'story', 'purpose'];
const cards = [], errs = [], seen = new Set();
for (const f of fs.readdirSync(CARDS).filter(f => f.endsWith('.json')).sort()) {
  const cat = f.slice(0, -5); let list;
  try { list = JSON.parse(fs.readFileSync(path.join(CARDS, f), 'utf8')); } catch (e) { errs.push(`${f}: not valid JSON (${e.message})`); continue; }
  for (const c of list) { const at = `${f} ${c.id || '?'}`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)+$/.test(c.id || '')) errs.push(`${at}: id must be kebab-case with a prefix`);
    if (seen.has(c.id)) errs.push(`${at}: duplicate id`); seen.add(c.id);
    if (!KINDS.includes(c.kind)) errs.push(`${at}: kind "${c.kind}"`);
    for (const k of ['title', 'text', 'use_when', 'source']) if (!String(c[k] || '').trim()) errs.push(`${at}: ${k} missing`);
    if ((c.text || '').length < 60) errs.push(`${at}: text too short`);
    if (/—/.test(JSON.stringify(c))) errs.push(`${at}: em-dash`);
    for (const [k, ok] of Object.entries(TAGS)) for (const v of c.tags?.[k] || []) if (!ok.includes(v)) errs.push(`${at}: tags.${k} "${v}"`);
    if (!c.tags?.phase?.length) errs.push(`${at}: tags.phase empty`);
    // ingested.json (made by ingest/distill.mjs from real sources) holds cards of every category: each card says its cat
    const cc = c.cat || cat; if (!CATS.includes(cc)) errs.push(`${at}: cat "${cc}"`);
    cards.push({ ...c, cat: cc }); } }
const by = {}; cards.forEach(c => by[c.cat] = (by[c.cat] || 0) + 1);
console.log(`${cards.length} cards ·`, Object.entries(by).map(([k, v]) => `${k} ${v}`).join(' · '));
if (errs.length) { console.log(`${errs.length} problem(s):\n- ` + errs.slice(0, 40).join('\n- ')); process.exit(1); }
if (process.argv.includes('--check')) process.exit(0);

const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const key = c => crypto.createHash('sha1').update(EMBED_MODEL + '\n' + docText(c)).digest('hex');
const todo = cards.filter(c => !cache[key(c)]);
for (let i = 0; i < todo.length; i += 50) { const part = todo.slice(i, i + 50);
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/ai/run/${EMBED_MODEL}`, { method: 'POST', headers: { authorization: 'Bearer ' + token(), 'content-type': 'application/json' }, body: JSON.stringify({ text: part.map(docText) }) }).then(r => r.json());
  if (!r.success) throw new Error('embedding failed: ' + JSON.stringify(r.errors).slice(0, 200) + ' (run npx wrangler whoami to refresh the login)');
  part.forEach((c, j) => cache[key(c)] = r.result.data[j]); console.log(`embedded ${Math.min(i + 50, todo.length)}/${todo.length}`); }
fs.writeFileSync(CACHE, JSON.stringify(cache));

const dim = cache[key(cards[0])].length, bytes = new Uint8Array(cards.length * dim);
cards.forEach((c, i) => { const v = cache[key(c)], m = Math.max(...v.map(Math.abs)) || 1; v.forEach((x, k) => bytes[i * dim + k] = (Math.round(x / m * 127) + 256) % 256); });
// raw source text travels with the cards (knowledge/chunks.json from ingest/ingest.py):
// - a card distilled from a source carries a short excerpt of the chunk it came from
// (direct chunk retrieval with the whole brief as the query was tried and dropped: it returned the same generic overview
//  chunks for every brief at cosine 0.3 to 0.45. One idea per card is what makes retrieval precise.)
const CHF = path.join(DIR, 'chunks.json');
if (fs.existsSync(CHF)) { const CH = JSON.parse(fs.readFileSync(CHF, 'utf8')), byId = Object.fromEntries(CH.chunks.map(c => [c.id, c])), srcOf = Object.fromEntries(CH.sources.map(s => [s.id, s]));
  const short = s => s.title.split(':')[0].replace(/\(.*?\)/g, '').trim(), clip = (t, n) => { t = t.replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n).replace(/\s\S*$/, '') + ' ...' : t; };
  const EV = fs.existsSync(path.join(DIR, 'evidence.json')) ? JSON.parse(fs.readFileSync(path.join(DIR, 'evidence.json'), 'utf8')) : {};
  for (const c of cards) { const f = (c.from || EV[c.id] || []).map(i => byId[i]).find(x => x && srcOf[x.source]?.type !== 'conversation'); /* a conversation excerpt is another creator's brief: not quoted */ if (f) c.excerpt = { src: short(srcOf[f.source]), loc: f.loc, text: clip(f.text, 320) }; }
  console.log(`excerpts on ${cards.filter(c => c.excerpt).length} cards`); }
const out = { model: EMBED_MODEL, dim, built: new Date().toISOString(), cards, vecs: Buffer.from(bytes).toString('base64') };
fs.writeFileSync(path.join(DIR, 'index.json'), JSON.stringify(out));
console.log(`index.json · ${cards.length} cards · ${dim} dims · ${(fs.statSync(path.join(DIR, 'index.json')).size / 1024).toFixed(0)} KB`);
