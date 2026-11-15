// Ask the knowledge base for the cards one design step should see.
//   node examples/search.mjs                         the built-in example brief, facts by rules + BM25 (no keys needed)
//   node examples/search.mjs examples/brief.json     your own step (same shape as the example below)
// With CF_ACCOUNT_ID and CF_API_TOKEN set (Cloudflare Workers AI), it also runs the full method C:
// dense search with embeddinggemma-300m + tag boosts, facts routed by rules first.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { loadIndex, ragQuery, queryText, EMBED_MODEL } from '../src/rag.mjs';
import { bm25Index, bm25Rank, routeFacts, retrieve2 } from '../src/rag2.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));

// one design step: the phase, the creator's brief so far, the option they chose (if any), what they said
const step = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : {
  phase: 'build',
  brief: { platform: 'mr', concept: 'kids run through the solar system and collect all 8 planets', players: 'a class of 9-year-olds, one at a time',
    venue: 'space', width_m: 4, depth_m: 5, indoor: true, environment: 'school classroom, bright daylight', vr_experience: 'first time' },
  option: { genre: 'runner', title: 'Planet Dash', pitch: 'run the orbit path and grab each planet in order', theme: 'outer space' },
  history: [{ who: 'creator', text: 'I want them to shoot the asteroids too' }],
};

const ix = loadIndex(read('data/index.json')), byId = new Map(ix.cards.map(c => [c.id, c]));
const facts = read('data/facts.json').facts;

console.log('\n== facts routed by rules (no vectors): structured triggers on the brief ==');
for (const f of routeFacts(facts, byId, step)) console.log(`  [${f.card.id}] ${f.card.title}\n      why: ${f.why}`);

console.log('\n== BM25 over the cards (lexical, English) ==');
const bm = bm25Index(ix.cards);
for (const h of bm25Rank(bm, ragQuery(step), 6)) console.log(`  [${ix.cards[h.i].id}] ${ix.cards[h.i].title}  (${h.score.toFixed(2)})`);

const { CF_ACCOUNT_ID: acc, CF_API_TOKEN: tok } = process.env;
if (acc && tok) {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${acc}/ai/run/${EMBED_MODEL}`, { method: 'POST',
    headers: { authorization: 'Bearer ' + tok, 'content-type': 'application/json' }, body: JSON.stringify({ text: [queryText(ragQuery(step))] }) }).then(r => r.json());
  const qvec = r.result.data[0], factIds = { list: facts, byId };
  console.log('\n== method C: facts by rules, then dense + tag boosts (what the design AI would get) ==');
  for (const h of await retrieve2(ix, qvec, step, { facts: factIds })) console.log(`  [${h.card.id}] ${h.card.title}  via ${h.via}`);
} else console.log('\n(set CF_ACCOUNT_ID and CF_API_TOKEN to also run dense search, the full method C)');
