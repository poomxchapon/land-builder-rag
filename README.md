# Land Builder RAG: an open knowledge base for AI-assisted XR game design

A design-knowledge base and retrieval code for an AI game-design assistant. The assistant interviews a creator (a teacher, a parent, a museum, an event organiser), proposes game options, prototypes and builds a game for **Quest mixed reality** or **PC**. At every step it retrieves knowledge cards from this base and cites them.

**Browse it:** https://poomxchapon.github.io/land-builder-rag/ (cards, fact rules, evaluation, full design runs with vs without the knowledge base, knowledge gaps, and a retrieval demo that runs in the browser)

| | |
|---|---|
| `data/cards/*.json` | **1,025 knowledge cards** in 9 categories (genre, space, theory, uncertainty, prototype, purpose, story, culture, cases) |
| `data/index.json` | all cards + their embeddings (embeddinggemma-300m, 768-d, int8, base64): what dense retrieval searches |
| `data/facts.json` | **92 fact rules**: engine limits, defaults and genre rules, with structured triggers |
| `data/graph.json` | card-to-card links (similar, shared tags) |
| `data/gaps.json` | **knowledge gaps**: 562 needs found in 54 design sessions, graded against the cards (57% covered, 40% partly, 3% none), by topic, venue and phase, and 20 themes of cards to write next |
| `src/rag.mjs` | dense retrieval with tag boosts (the live baseline) and the prompt block the AI receives |
| `src/rag2.mjs` | BM25, reciprocal rank fusion, fact routing by rules, graph expansion, and the cascade that combines them |
| `eval/` | a card-level retrieval test: 36 design steps, 1,295 graded (step, card) pairs, two labellers, `score.mjs` to recompute every number |
| `pipeline/` | the scripts that built the base (ingest, distil, facts, graph, eval), for reference |
| `results/RAG-V2-RESULT.md` | the full write-up |
| `results/ab/ab-rag-on-off.json` | **end-to-end A/B**: 10 briefs designed with and without the knowledge base (options, prototype decisions and their sources, retrieved cards, build goal), scored blind by 4 AI judges: preferred with 17/20, overall 7.35 vs 6.30, AI-guessed decisions 14% vs 26% |

No dependencies. Node 18+.

## Quick start

```bash
git clone https://github.com/poomxchapon/land-builder-rag && cd land-builder-rag
node examples/search.mjs          # fact rules + BM25 for an example design step, no keys needed
node eval/score.mjs               # recompute the results table from the published labels
node eval/score.mjs --claude      # the same, with the second labeller
```

With Cloudflare Workers AI credentials (`CF_ACCOUNT_ID`, `CF_API_TOKEN`), `examples/search.mjs` also embeds the query and runs dense search, the full method C below. Any embedding service works if it uses `google/embeddinggemma-300m` with the same prefixes (`queryText`, `docText` in `src/rag.mjs`).

Use it in your own code:

```js
import { loadIndex, retrieve } from './src/rag.mjs';
import { retrieve2 } from './src/rag2.mjs';
const ix = loadIndex(JSON.parse(fs.readFileSync('data/index.json', 'utf8')));
const facts = JSON.parse(fs.readFileSync('data/facts.json', 'utf8')).facts;
const step = { phase: 'options', brief: { platform: 'mr', width_m: 4, depth_m: 5, concept: '...' } };
const hits = await retrieve2(ix, queryVector, step, { facts: { list: facts, byId: new Map(ix.cards.map(c => [c.id, c])) } });
```

## A card

```json
{ "id": "cs-too-many-checkpoints-small", "kind": "pitfall", "title": "Too many checkpoints in a small room",
  "text": "A 3 x 3 m living room has only about 1.8 m of usable side after the 0.6 m edge margin ...",
  "use_when": "...", "do": ["..."], "avoid": ["..."],
  "tags": { "platform": ["mr"], "genre": ["runner"], "phase": ["options", "build"] }, "source": "FortalLand engine" }
```

Field definitions: `data/CARD-SPEC.md`.

## Results: does the right card reach the AI?

36 design steps from 18 recorded design sessions (simulated creators), all four phases. Each method's top 15 cards were pooled and graded blind by an LLM (0 not useful, 1 helpful, 2 essential). k = what the live system sends (6 or 9).

| Method | Essential recall@k | Precision@k | MRR | Better / worse than A | Sign test p |
|---|---|---|---|---|---|
| A dense + tag boosts (baseline) | 0.236 | 0.605 | 0.575 | | |
| B LLM query refinement | 0.240 | 0.628 | 0.542 | 17 / 11 | 0.34 |
| **C facts by rules** | **0.356** | **0.733** | **0.803** | **27 / 3** | **< 0.0001** |
| D hybrid BM25 + RRF | 0.207 | 0.633 | 0.563 | 10 / 15 | 0.42 |
| E hybrid + cross-encoder rerank | 0.199 | 0.577 | 0.544 | 11 / 15 | 0.56 |
| F hybrid + graph | 0.230 | 0.648 | 0.588 | 10 / 15 | 0.42 |
| H facts + refinement | 0.370 | 0.731 | 0.796 | 26 / 6 | 0.0005 |
| I facts + graph | 0.369 | 0.750 | 0.803 | 25 / 6 | 0.0009 |

- **Routing hard facts by rules is the one clear win.** Engine limits and genre rules do not look like the creator's words, so vector search misses them; a structured trigger on the brief (platform, genre, room size, children, daylight, words the creator said) does not.
- BM25, reranking and the similarity graph did not help on these short English cards.
- Even the best method delivers about 37% of the essential cards: a step has about 10 essential cards and 6 to 9 slots. Next: merge near-duplicate cards, and typed relations (genre → its rules, an impossible wish → the nearest buildable thing).
- A second labeller (Claude, 8 steps, 288 cards) agreed with quadratic weighted kappa 0.77. On those steps facts still raise precision, with a smaller gain.

**Caveats.** LLM labels, not human designers; the "essential" definition names constraints and safety facts, which favours C; pooling bias; simulated creators; retrieval only, not final design quality.

## What is not here

The raw source documents and the chunk layer (studio game design documents, internal guides) and the raw design conversations are not published. Cards distilled from them are, without verbatim excerpts. The LLM steps in `pipeline/` (distil, facts, eval labelling) call the design assistant's own LLM wrapper, which is not in this repository; they are included to document the method.

## Cite

```
Fortal Interactive (2026). Land Builder RAG: an open knowledge base for AI-assisted XR game design. https://github.com/poomxchapon/land-builder-rag
```

## License

Code: MIT (`LICENSE`). Cards, rules, graph and evaluation data: CC BY 4.0 (`DATA_LICENSE`).
