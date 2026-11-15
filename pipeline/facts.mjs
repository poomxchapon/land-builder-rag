// Step 2 of RAG v2: hard facts about the engines and the play space leave the vector database and become rules.
// Which cards: source "FortalLand engine" and kind pitfall / default / genre-rule / question (what the engines can and
// cannot do, fixed defaults). Their platform / genre / phase come from the card tags; Kimi only writes WHEN each one
// is triggered (words the creator may say, a space size, children, a dark room), and code checks every field.
// Usage: node knowledge/ingest/facts.mjs           -> knowledge/facts.json
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import { fileURLToPath } from 'node:url';
import { configure, structured } from '../../ai/engine.mjs';
import { SCHEMAS, CHECKS } from '../../ai/schema.mjs';

const K = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
configure({ key: () => process.env.KIMI_API_KEY || fs.readFileSync(path.join(os.homedir(), '.kimi/api_key'), 'utf8') });
const cards = JSON.parse(fs.readFileSync(path.join(K, 'index.json'), 'utf8')).cards;
const pick = cards.filter(c => /engine/i.test(c.source || '') && ['pitfall', 'default', 'genre-rule', 'question'].includes(c.kind));
console.log(pick.length, 'fact cards');

const FIELDS = ['always', 'words', 'side_max_m', 'side_min_m', 'kids', 'dark', 'missing', 'priority'];
const BRIEF_FIELDS = ['width_m', 'depth_m', 'players', 'vr_experience', 'session_minutes', 'play_mode', 'time_of_day', 'environment', 'spectators', 'platform'];
SCHEMAS.facts = { type: 'object', required: ['rules'], properties: { rules: { type: 'array', items: { type: 'object', required: ['id', 'priority'], properties: {
  id: { type: 'string' }, always: { type: 'boolean' }, words: { type: 'array', items: { type: 'string' } }, side_max_m: { type: 'number' }, side_min_m: { type: 'number' },
  kids: { type: 'boolean' }, dark: { type: 'boolean' }, missing: { type: 'string', enum: BRIEF_FIELDS }, priority: { type: 'number', minimum: 1, maximum: 3 } } } } } };
CHECKS.facts = (r, ctx) => { const e = [], want = new Set(ctx.ids), got = new Set();
  for (const x of r.rules) { if (!want.has(x.id)) e.push(`$.rules: unknown id ${x.id}`); got.add(x.id);
    const trig = x.always || x.words?.length || x.side_max_m || x.side_min_m || x.kids || x.dark != null || x.missing;
    if (!trig) e.push(`${x.id}: give at least one trigger (always, words, side_max_m, side_min_m, kids, dark, missing)`);
    if ((x.words || []).some(w => w.length < 3 || w.split(' ').length > 3)) e.push(`${x.id}: each word is 1 to 3 words, at least 3 letters`);
    if (x.always && x.words?.length) e.push(`${x.id}: "always" and "words" together makes no sense, pick one`); }
  for (const id of want) if (!got.has(id)) e.push(`$.rules: missing ${id}`);
  return e; };

const out = [], B = 12;
for (let i = 0; i < pick.length; i += B) { const part = pick.slice(i, i + B);
  const list = part.map(c => `- ${c.id} (${c.kind}; platform ${c.tags.platform.join('/') || 'any'}; genre ${c.tags.genre.join('/') || 'any'}; phase ${c.tags.phase.join('/')}): ${c.title}. ${c.text} WHEN: ${c.use_when}`).join('\n');
  const r = await structured('facts', `These are fixed facts about a game-design tool's engines and play spaces. A design AI must see a fact whenever it applies to the creator's brief. The platform, genre and phase filters are already handled from the tags. Your job: for each fact, say WHEN it is triggered, using only these fields:
- always: true if it applies to every brief that passes the filters (use sparingly: only for facts every design of that platform/genre needs)
- words: 2 to 10 short words or phrases the creator might write that mean the fact applies, in English AND Thai (for example "gun", "shoot", "ยิง", "ปืน"). Lowercase. Matched as plain substrings, so prefer word stems ("shoot" catches "shooting").
- side_max_m: applies when the shorter side of the play space is at most this many metres
- side_min_m: applies when the shorter side is at least this many metres
- kids: true if it applies when the players are children
- dark: true if it applies in a dark or night room, false if it applies in daylight
- missing: a brief field whose being unknown triggers it (one of ${BRIEF_FIELDS.join(', ')})
- priority: 3 = breaks the game or safety if missed, 2 = clearly worse design, 1 = nice to know
Use the fewest triggers that are true. Base everything on the fact's text and WHEN line.

Facts:
${list}`, { ctx: { ids: part.map(c => c.id) }, model: 'k3.1-pro', effort: 'low', maxTokens: 12000 });
  for (const x of r.result.rules) { const c = part.find(p => p.id === x.id);
    x.priority = Math.round(x.priority); out.push({ id: x.id, title: c.title, kind: c.kind, platform: c.tags.platform, genre: c.tags.genre, phase: c.tags.phase, ...Object.fromEntries(FIELDS.filter(f => x[f] != null && !(Array.isArray(x[f]) && !x[f].length)).map(f => [f, x[f]])) }); }
  console.log(`  ${Math.min(i + B, pick.length)}/${pick.length}`); }
fs.writeFileSync(path.join(K, 'facts.json'), JSON.stringify({ built: new Date().toISOString(), method: 'engine fact cards (pitfall, default, genre-rule, question); tags give platform/genre/phase; Kimi wrote the triggers, code-checked', n: out.length, facts: out }, null, 1));
console.log('wrote knowledge/facts.json', out.length);
