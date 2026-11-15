# Exports the chunk database in the format the Hugging Face RAG retriever reads for a custom index
# (transformers RagRetriever with index_name="custom"): a datasets.Dataset with the columns "title", "text" and
# "embeddings", saved to disk, plus a faiss index over "embeddings" saved next to it.
#   RagRetriever.from_pretrained(..., index_name="custom", passages_path=<out>/passages, index_path=<out>/index.faiss)
# Our vectors come from embeddinggemma-300m (768 numbers, the same size as RAG's DPR), so a query must be embedded
# with the same model (Workers AI) and passed in as question_hidden_states; the demo below does exactly that.
# Needs: pip install datasets faiss-cpu  (a separate venv is fine)
# Usage: <venv python> knowledge/ingest/export_hf.py ["a question to try"]
import json, os, sys, hashlib, re, urllib.request
import numpy as np, faiss
from datasets import Dataset

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')); K = os.path.join(ROOT, 'knowledge')
OUT = os.path.join(K, 'export', 'hf'); os.makedirs(OUT, exist_ok=True)
sys.stdout.reconfigure(encoding="utf-8")
MODEL = '@cf/google/embeddinggemma-300m'
ix = json.load(open(os.path.join(K, 'chunks.json'), encoding='utf-8'))
cache = json.load(open(os.path.join(K, '.cache', 'chunk-emb.json'), encoding='utf-8'))
doc_text = lambda c: f"title: {c['source_title']} | {c['heading']} | text: {c['text']}"   # as in ingest.py
vecs = []
for c in ix['chunks']:
    v = np.array(cache[hashlib.sha1((MODEL + '\n' + doc_text(c)).encode()).hexdigest()], dtype='float32'); vecs.append(v / (np.linalg.norm(v) or 1))
ds = Dataset.from_dict({'title': [f"{c['source_title']} / {c['heading'] or c['loc']}" for c in ix['chunks']], 'text': [c['text'] for c in ix['chunks']],
                        'embeddings': [v.tolist() for v in vecs], 'id': [c['id'] for c in ix['chunks']], 'source': [c['source'] for c in ix['chunks']], 'loc': [c['loc'] for c in ix['chunks']]})
ds.save_to_disk(os.path.join(OUT, 'passages'))
ds.add_faiss_index(column='embeddings', metric_type=faiss.METRIC_INNER_PRODUCT)   # vectors are unit length: inner product = cosine
ds.get_index('embeddings').save(os.path.join(OUT, 'index.faiss'))
print(f'passages: {len(ds)} rows · columns {ds.column_names} · dim {len(vecs[0])} -> {OUT}')

q = sys.argv[1] if len(sys.argv) > 1 else 'How long should one round of an MR team game last?'
p = os.path.join(os.environ.get('APPDATA', os.path.expanduser('~')), 'xdg.config/.wrangler/config/default.toml')
tok = os.environ.get('CF_API_TOKEN') or re.search(r'oauth_token = "([^"]+)"', open(p, encoding='utf-8').read()).group(1)
req = urllib.request.Request(f"https://api.cloudflare.com/client/v4/accounts/{os.environ.get('CF_ACCOUNT', '')}/ai/run/{MODEL}",
                             data=json.dumps({'text': [f'task: search result | query: {q}']}).encode('utf-8'), headers={'authorization': 'Bearer ' + tok, 'content-type': 'application/json'})
qv = np.array(json.load(urllib.request.urlopen(req))['result']['data'][0], dtype='float32'); qv /= np.linalg.norm(qv)
scores, ex = ds.get_nearest_examples('embeddings', qv, k=5)
sys.stdout.reconfigure(encoding='utf-8'); print(f'\nquery: {q}')
for s, i, t, txt in zip(scores, ex['id'], ex['title'], ex['text']): print(f'  {s:.3f}  {i:<26} {t[:70]}\n         {txt[:150].replace(chr(10), " ")}')
