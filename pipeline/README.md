# How the knowledge base was built (reference)

```
sources.json -> ingest.py -> chunks (320 tokens, 40 overlap, embeddinggemma-300m)   raw layer, not published
             -> distill.mjs -> cards (LLM + code checks; a card too close to an existing one, cosine >= 0.86, becomes evidence instead)
             -> build.mjs   -> data/index.json (cards + vectors)
             -> graph.mjs   -> data/graph.json (similar / tag links, 3 nearest, cosine >= 0.62)
             -> facts.mjs   -> data/facts.json (an LLM proposes structured triggers for each engine fact; code checks them)
eval.mjs        chunk-level test: synthetic questions, hit@k and MRR across chunk sizes (320 tokens: hit@5 92%)
eval-cards.mjs  card-level test: 36 design steps, methods A to I, pooled top 15, blind 0/1/2 labels -> eval/eval-cards.json
eval-agree.mjs  second labeller agreement (weighted kappa) -> eval/eval-agree.json
export_hf.py    the chunk layer as a Hugging Face datasets + faiss index for transformers' RagRetriever
```

These scripts are copied from the Land Builder app and import its LLM wrapper (`ai/engine.mjs`, `ai/schema.mjs`) and its
design sessions, which are not in this repository; they document the method rather than run as is.
`sources.json` lists the sources by title only. Cloudflare Workers AI needs `CF_ACCOUNT` / `CF_ACCOUNT_ID` and `CF_API_TOKEN`.
To recompute the published results use `node eval/score.mjs`, which needs nothing else.
