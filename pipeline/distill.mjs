// Step 4 of the knowledge base: distil raw chunks (knowledge/chunks.json, from ingest.py) into knowledge cards.
//
//   chunks of one source (a few at a time)  ->  Kimi, one forced tool call per batch (structure guard like every AI step)
//   ->  each card must cite the chunk ids it came from (checked: only ids in that batch)
//   ->  new card too close in meaning to an existing card (cosine >= DUP)?  keep the existing card, record the chunk as
//       its evidence instead (so hand-written cards gain real sources too)
//   ->  knowledge/cards/ingested.json (new cards, each with `from`)  +  knowledge/evidence.json (chunk -> existing card)
//
// Usage: node knowledge/ingest/distill.mjs [--only <source id>] [--max <batches>] [--par 6]
// Then: node knowledge/build.mjs (validates + embeds the cards into index.json) and node knowledge/ingest/graph.mjs
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import { fileURLToPath } from 'node:url';
import { configure, structured } from '../../ai/engine.mjs';
import { SCHEMAS, CHECKS } from '../../ai/schema.mjs';
import { EMBED_MODEL, loadIndex, docText } from '../../ai/rag.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url)), K = path.join(DIR, '..'), ROOT = path.join(K, '..');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };
const ONLY = arg('only'), MAX = +arg('max', 1e9), PAR = +arg('par', 6), BATCH = 5, DUP = 0.86;
const OUT = path.join(K, 'cards/ingested.json'), EVID = path.join(K, 'evidence.json'), DONE = path.join(K, '.cache/distill-done.json');
configure({ key: () => process.env.KIMI_API_KEY || fs.readFileSync(path.join(os.homedir(), '.kimi/api_key'), 'utf8') });

const CATS = { theory: 'th', genre: 'gn', space: 'sp', uncertainty: 'un', prototype: 'pt', cases: 'cs', culture: 'cu', story: 'st', purpose: 'pu' };
const CAT_ABOUT = { theory: 'game design theory: fun, flow, motivation, feedback, difficulty', genre: 'rules and tuning for battle, tactics or runner games in this engine',
  space: 'real venues and floor space: sizes, clearance, safety, comfort, spectators, LED floor, UWB tracking', uncertainty: 'what to ask or assume when the creator is vague or contradicts themself; how to read creator wishes',
  prototype: 'how a paper prototype looks: palette, key art, storyboard, HUD, playtest questions', cases: 'a worked example from a real design or game and what it teaches',
  culture: 'cultural content and respectful theming', story: 'narrative, beats, climax, characters', purpose: 'learning, brand, event or other goals behind a game' };
const TAG = { phase: ['interview', 'options', 'prototype', 'build'], platform: ['mr', 'pc'], genre: ['battle', 'tactics', 'runner'],
  feelings: ['sensation', 'fantasy', 'narrative', 'challenge', 'fellowship', 'discovery', 'expression', 'submission'],
  players: ['kids', 'teens', 'adults', 'families', 'seniors', 'first-time-vr', 'gamers', 'groups', 'solo'] };
const KINDS = ['principle', 'pattern', 'heuristic', 'question', 'default', 'genre-rule', 'example', 'pitfall', 'palette', 'style'];
const S = (x = {}) => ({ type: 'string', ...x }), A = (items, x = {}) => ({ type: 'array', items, ...x }), E = list => A(S({ enum: list }));
SCHEMAS.distill = { type: 'object', required: ['cards'], properties: { cards: A({ type: 'object', required: ['cat', 'kind', 'title', 'text', 'use_when', 'tags', 'from'], properties: {
  cat: S({ enum: Object.keys(CATS) }), kind: S({ enum: KINDS }), slug: S(), title: S({ minLength: 8 }), text: S({ minLength: 60 }), use_when: S({ minLength: 8 }),
  do: A(S(), { maxItems: 4 }), avoid: A(S(), { maxItems: 4 }), from: A(S(), { minItems: 1, maxItems: 5 }),
  tags: { type: 'object', required: ['phase'], properties: Object.fromEntries(Object.entries(TAG).map(([k, v]) => [k, E(v)])) } } }, { maxItems: 4 }) } };
CHECKS.distill = (r, ctx) => { const e = [];
  if ((r.cards || []).filter(c => c.kind === 'pitfall').length > 1) e.push('$.cards: at most ONE pitfall card per batch. Keep the most useful pitfall, and turn the others into positive cards about the design reasoning (pacing, roles, readability, space) or drop them');
  (r.cards || []).forEach((c, i) => { const at = `$.cards[${i}]`;
    for (const f of c.from || []) if (!ctx.chunkIds.has(f)) e.push(`${at}.from: "${f}" is not one of the chunk ids in this batch (${[...ctx.chunkIds].join(', ')})`);
    if (!c.tags?.phase?.length) e.push(`${at}.tags.phase: list at least one phase`);
    if (/—/.test(JSON.stringify(c))) e.push(`${at}: no em-dashes, use plain sentences`);
    if (/[฀-๿]/.test(c.title + c.text + (c.use_when || ''))) e.push(`${at}: write the card in English (keep a Thai name only inside quotes if needed)`); });
  return e; };

const DESIGN = fs.readFileSync(path.join(ROOT, 'prompts/design.md'), 'utf8'), section = h => (DESIGN.split('\n## ').find(s => s.startsWith(h)) || '').slice(0, 3500);
const ENGINE = ['Platform:', 'What MR means here', 'What the game engine can do'].map(section).join('\n\n## ');
const prompt = (src, batch) => `You build the design knowledge base of an AI game designer (FortalLand Land Builder). Read these raw chunks from one source and write 0 to 4 knowledge cards: the reusable design knowledge in them that would help an AI design a NEW game for a creator.

Source: ${src.title} (${src.kind}, ${src.author} ${src.year})

## What the engines can build (cards must stay inside this)
${ENGINE}

## Card rules
- One self-contained, specific, actionable idea per card, in English (translate Thai sources), in your own words. 2-5 sentences in "text": what to decide and why, with the numbers the source gives (metres, seconds, counts, ages).
- Only knowledge that transfers to other games: rules of thumb, tuning numbers, venue facts, safety, what creators ask for and how to answer, patterns, pitfalls. A worked example is fine as a "cases" card if it teaches something.
- Skip prices, addresses, opening hours, marketing copy, code plumbing (serial ports, parsers, editor tools), and anything only true for this one product. Writing no card is better than a generic one.
- Look first for knowledge that still holds when the mechanic is different: session and round length, pacing and difficulty curves, onboarding and how players learn the goal, feedback and readability, team and group dynamics, spectators and queues, safety and space numbers, venue facts, what makes a moment memorable. Many sources were written for another engine: take the design reasoning, not the feature.
- At most ONE "pitfall" card per batch, and only for a wish creators are likely to bring (e.g. shooting, team territory control): say what to offer instead.
- In a design conversation, the knowledge is how the creator talks and what they need: vague words and what they meant, conflicts, what the AI did that helped or confused. Never copy their brief as a card.
- "from": the chunk ids your card is based on (only ids listed below). "cat": ${Object.entries(CAT_ABOUT).map(([k, v]) => `${k} = ${v}`).join('; ')}.
- tags: phase (where it helps), platform (mr and/or pc, empty = both), genre (empty = any), feelings (MDA), players.
- No em-dashes.

## Chunks
${batch.map(c => `[${c.id}] (${c.loc}${c.heading ? ' · ' + c.heading : ''})\n${c.text}`).join('\n\n')}

Call the tool with { "cards": [...] } (an empty list is fine).`;

const CH = JSON.parse(fs.readFileSync(path.join(K, 'chunks.json'), 'utf8'));
const SRC = Object.fromEntries(CH.sources.map(s => [s.id, s]));
const done = fs.existsSync(DONE) ? JSON.parse(fs.readFileSync(DONE, 'utf8')) : {};
let cards = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : [];
const evidence = fs.existsSync(EVID) ? JSON.parse(fs.readFileSync(EVID, 'utf8')) : {};
const batches = [];
for (const s of CH.sources) { if (ONLY && s.id !== ONLY) continue; const list = CH.chunks.filter(c => c.source === s.id);
  for (let i = 0; i < list.length; i += BATCH) { const b = list.slice(i, i + BATCH), key = b.map(c => c.id).join(','); if (!(key in done)) batches.push({ src: s, b, key }); } }
console.log(`${batches.length} batches to distil${batches.length > MAX ? ` (running ${MAX})` : ''}`);

// existing cards (hand-written + already ingested): new cards that say the same thing become evidence instead
const IX = loadIndex(JSON.parse(fs.readFileSync(path.join(K, 'index.json'), 'utf8')));
const ACCOUNT = process.env.CF_ACCOUNT || '';
const cfTok = () => process.env.CF_API_TOKEN || (fs.readFileSync(path.join(process.env.APPDATA || os.homedir(), 'xdg.config/.wrangler/config/default.toml'), 'utf8').match(/oauth_token = "([^"]+)"/) || [])[1];
import { execSync } from 'node:child_process';
// the wrangler login lasts about an hour: on an auth error refresh it once (npx wrangler whoami) and retry
async function embed(texts, again = true) { const r = await embedOnce(texts); if (r.ok) return r.v;
  if (again && /10000|Authentication/.test(r.err)) { try { execSync('npx wrangler whoami', { stdio: 'ignore', shell: true }); } catch { } return embed(texts, false); }
  throw new Error('embedding failed ' + r.err); }
async function embedOnce(texts) { const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/ai/run/${EMBED_MODEL}`, { method: 'POST', headers: { authorization: 'Bearer ' + cfTok(), 'content-type': 'application/json' }, body: JSON.stringify({ text: texts }) }).then(r => r.json());
  if (!r.success) return { err: JSON.stringify(r.errors).slice(0, 160) }; return { ok: true, v: r.result.data.map(v => { const n = Math.hypot(...v) || 1; return v.map(x => x / n); }) }; }
const pool = [...IX.cards.map((c, i) => ({ id: c.id, v: IX.vecs[i] }))]; // new cards join the pool as they are accepted
const nearest = v => { let best = null; for (const p of pool) { let s = 0; for (let k = 0; k < v.length; k++) s += v[k] * p.v[k]; if (!best || s > best.s) best = { id: p.id, s }; } return best; };
const ids = new Set([...IX.ids, ...cards.map(c => c.id)]);
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').split('-').slice(0, 6).join('-');

let n = 0, made = 0, dups = 0, calls = 0; const t0 = Date.now();
const save = () => { fs.writeFileSync(OUT, JSON.stringify(cards, null, 1)); fs.writeFileSync(EVID, JSON.stringify(evidence, null, 1)); fs.writeFileSync(DONE, JSON.stringify(done)); };
async function work({ src, b, key }) {
  const r = await structured('distill', prompt(src, b), { ctx: { chunkIds: new Set(b.map(c => c.id)) }, model: 'k3.1-pro', effort: 'low', maxTokens: 12000 }); calls++;
  const got = r.result.cards || []; const vecs = got.length ? await embed(got.map(c => docText(c))) : [];
  got.forEach((c, i) => { const near = nearest(vecs[i]);
    if (near && near.s >= DUP) { dups++; (evidence[near.id] ||= []).push(...c.from.filter(f => !(evidence[near.id] || []).includes(f))); return; }
    let id = `${CATS[c.cat]}-${slug(c.slug || c.title)}`; while (ids.has(id)) id += '-x'; ids.add(id);
    const card = { id, cat: c.cat, kind: c.kind, title: c.title, text: c.text, use_when: c.use_when, do: c.do || [], avoid: c.avoid || [],
      tags: Object.fromEntries(Object.keys(TAG).map(k => [k, c.tags?.[k] || []])), source: `${src.author} ${src.year}, ${src.title}`, from: c.from };
    cards.push(card); pool.push({ id, v: vecs[i] }); made++; });
  done[key] = got.length; n++;
  process.stdout.write(`\r  ${n}/${Math.min(batches.length, MAX)} batches · ${made} new cards · ${dups} matched an existing card · ${((Date.now() - t0) / 1000).toFixed(0)} s   `);
  if (n % 5 === 0) save(); }
const queue = batches.slice(0, MAX); let fails = 0;
await Promise.all(Array.from({ length: PAR }, async () => { while (queue.length) { const job = queue.shift(); try { await work(job); } catch (e) { fails++; console.log(`\n  ! ${job.key.slice(0, 60)}: ${e.message.slice(0, 160)}`); } } }));
save(); console.log(`\ndone: ${made} new cards, ${dups} merged as evidence into existing cards, ${fails} failed batches, ${calls} Kimi calls · cards/ingested.json now ${cards.length}`);
