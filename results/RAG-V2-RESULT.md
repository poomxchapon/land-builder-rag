# RAG v2: measuring and rebuilding the knowledge base

> File paths below are as in the Land Builder app. In this repository: `pipeline/` (scripts), `data/` (facts.json, index.json), `eval/` (results), `src/rag2.mjs`. Recompute the table with `node eval/score.mjs`.

13 November 2026 · Land Builder knowledge base (1,025 cards) · following the retrieval cascade of the NLP and LLMs lecture, Module 7

## Why
Three end-to-end comparisons (design with RAG vs without) showed no gain from RAG: 1 win, 2 losses, about 3x the input tokens.
End-to-end tests cannot say where the problem is. Following the lecture ("RAG quality depends on the whole pipeline"), this round measures the
retrieval step itself: does the right card reach the design AI?

## Test set (Recall@k, MRR, as in the lecture's lab)
- 36 real design steps from 18 recorded design sessions (simulated creators: teachers, parents, a museum, a company seminar, a mall booth, a lab, a Thai horror streamer...), 2 phases per session, all 4 phases covered (interview, options, prototype, build).
- Pooling: the union of every method's top 15 cards, 1,295 (step, card) pairs.
- Labels: Kimi K3.1 Pro graded every pooled card 0 / 1 / 2 (2 = essential: without it the design would likely be worse or wrong), blind to which method found it.
- Second labeller: a separate Claude agent graded 8 of the 36 steps (288 cards) blind. Agreement: exact 74%, within one grade 99%, quadratic weighted kappa **0.77**, Cohen's kappa 0.61.
- k = what the live system sends: 6 cards (interview, build) or 9 (options, prototype).

## Methods compared
| | What it does |
|---|---|
| A live baseline | dense search (embeddinggemma-300m) + tag boosts, at most 3 cards per category |
| B query refinement | an LLM rewrites the step as an English query, then dense search (cards are English, many briefs Thai) |
| C facts by rules | 92 engine facts (what the engines can and cannot do, defaults, genre rules) leave the vector database and become rules with structured triggers (platform, genre, phase, words the creator said, room size, children, daylight). Up to 3 matched facts first, then A for the rest |
| D hybrid | BM25 on the refined query + dense, merged with reciprocal rank fusion |
| E hybrid + rerank | D, then a cross-encoder (bge-reranker-base) re-scores the top 30 |
| F hybrid + graph | D, then one hop over the existing knowledge graph (similarity and tag edges) |
| G, H, I | combinations: all; facts + refinement; facts + graph |

## Results (36 steps)
| Method | Essential recall@k | Precision@k | MRR (first essential) | nDCG@k | Better / worse than A (steps) | Sign test p |
|---|---|---|---|---|---|---|
| A live baseline | 0.236 | 0.605 | 0.575 | 0.434 | | |
| B query refinement | 0.240 | 0.628 | 0.542 | 0.450 | 17 / 11 | 0.34 |
| **C facts by rules** | **0.356** | **0.733** | **0.803** | **0.624** | **27 / 3** | **< 0.0001** |
| D hybrid BM25 + RRF | 0.207 | 0.633 | 0.563 | 0.441 | 10 / 15 | 0.42 |
| E hybrid + rerank | 0.199 | 0.577 | 0.544 | 0.397 | 11 / 15 | 0.56 |
| F hybrid + graph | 0.230 | 0.648 | 0.588 | 0.455 | 10 / 15 | 0.42 |
| G all four | 0.333 | 0.699 | 0.795 | 0.598 | 23 / 6 | 0.002 |
| H facts + refinement | 0.370 | 0.731 | 0.796 | 0.630 | 26 / 6 | 0.0005 |
| I facts + graph | 0.369 | 0.750 | 0.803 | 0.635 | 25 / 6 | 0.0009 |

Essential recall by phase, A → C: interview 0.28 → 0.41, options 0.30 → 0.35, prototype 0.22 → 0.33, **build 0.15 → 0.32**.

With the Claude labels on the 8 checked steps the direction holds for facts (precision 0.54 → 0.72, essential recall 0.19 → 0.26), but the gain is smaller than with Kimi's labels, and hybrid / rerank look close to facts there. 8 steps are too few to rank B, D, E, F against each other.

## What this means
1. **Routing facts by rules is the one clear win** (lecture: "Not every question belongs in a vector database"). A fact card picked by a rule is useful 74% of the time (62% essential); a card from vector search 61% (33% essential). The live system's first essential card moves from about rank 2 to rank 1.
   Example: for the 12 November planets brief, the baseline build step did not retrieve "Checkpoint count and spacing follow the room size"; the rule always delivers it for a runner. (In that run the level lost 2 of the 8 planets in the layout step, which does not use RAG yet, so this card alone would not have fixed it.)
2. **Hybrid BM25, reranking and the similarity graph did not help.** Likely reasons: the cards are short and already English, so exact-term matching adds little; the small English cross-encoder ignores the platform and genre filters that the live scoring uses; the existing graph links cards that are similar, which brings more of the same rather than what is missing.
3. **Even the best method delivers only about 37% of the essential cards**: a step has about 10 essential cards and only 6 to 9 slots. The cards overlap a lot. Next: merge near-duplicate cards, and give the AI fewer, denser cards.
4. **Graph, done properly**: the useful relations are typed (genre → its rules, a wish the engine cannot build → the nearest thing it can, a room size → counts and spacing). The rules in C are already a small version of this (brief attribute → fact). Next: extract typed relations between cards and test them with this same set.

## Caveats
- Labels are by LLMs (Kimi, with a Claude check on 8 steps), not by human designers. The label definition of "essential" names constraints and safety facts, which favours method C.
- Pooling only judges cards some method found; recall is relative to that pool.
- Simulated creators. Retrieval quality only: whether better retrieval gives better designs still needs the end-to-end test.
- Two facts were fixed by hand after a first run (a daylight rule that fired without a dark theme, a rule with daylight and dark swapped); the table is after the fix, with the same labels.

## Files
- `knowledge/ingest/eval-cards.mjs` test set + every method + metrics → `knowledge/eval-cards.json`
- `knowledge/ingest/facts.mjs` → `knowledge/facts.json` (92 rules) · `knowledge/ingest/eval-agree.mjs` → `knowledge/eval-agree.json`
- `ai/rag2.mjs` BM25, RRF, fact rules, graph expansion, the cascade
- Live switch (local server only, not deployed): `?kb=v2` on the builder page uses facts by rules
