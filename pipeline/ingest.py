# Builds the raw layer of the design knowledge base: knowledge/chunks.json.
#
#   raw material (sources.json)  ->  1 extract  ->  2 split into chunks by real tokens  ->  3 embed  ->  chunks.json
#
# 1 extract: PDF pages (PyMuPDF), markdown/HTML headings, design conversations (turn by turn), game projects
#   (docs + code: class names, tunable fields, comments). Every piece keeps where it came from (page, heading, turn, file).
# 2 split: recursive, like the Hugging Face "Advanced RAG" cookbook: try the biggest natural break first
#   (heading, blank line, line, sentence, space) and pack pieces up to MAX_TOK tokens, with OVERLAP tokens carried over.
#   Tokens are counted with the embedding model's own tokenizer (Gemma SentencePiece, 262k vocabulary), so a chunk
#   never gets cut by the model. Exact duplicates are dropped.
# 3 embed: Workers AI embeddinggemma-300m (768 numbers), the same model and doc prefix as the cards, so chunks and
#   cards live in one space. Each chunk is embedded with a short header (source title + section), so a chunk that
#   says "it" still knows what it is about. Vectors are cached by text.
#
# Usage: python knowledge/ingest/ingest.py [--only <source id>] [--no-embed]
import json, re, os, sys, glob, hashlib, html, urllib.request, time

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
KDIR = os.path.join(ROOT, 'knowledge')
CACHE_DIR = os.path.join(KDIR, '.cache'); os.makedirs(CACHE_DIR, exist_ok=True)
EMB_CACHE = os.path.join(CACHE_DIR, 'chunk-emb.json')
MODEL = '@cf/google/embeddinggemma-300m'
TOK_URL = 'https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX/resolve/main/tokenizer.json'
_a = sys.argv[1:]; _opt = lambda n, d: type(d)(_a[_a.index(n) + 1]) if n in _a else d
MAX_TOK = _opt('--max-tok', 320); OVERLAP = _opt('--overlap', max(8, MAX_TOK // 8)); MIN_TOK = 24
OUT_NAME = _opt('--out', 'chunks.json')
ACCOUNT = os.environ.get('CF_ACCOUNT', '')
SEPARATORS = ['\n# ', '\n## ', '\n### ', '\n#### ', '\n\n', '\n', '. ', '? ', '! ', ' ', '']

# ---------- tokenizer ----------
def tokenizer():
    from tokenizers import Tokenizer
    p = os.path.join(CACHE_DIR, 'tokenizer.json')
    if not os.path.exists(p): print('downloading the embedding model tokenizer...'); urllib.request.urlretrieve(TOK_URL, p)
    return Tokenizer.from_file(p)
TOK = tokenizer()
ntok = lambda s: len(TOK.encode(s, add_special_tokens=False).ids)

# ---------- 1 extract: each returns [{loc, heading, text}] ----------
def clean(s): return re.sub(r'[ \t ]+', ' ', re.sub(r'\n{3,}', '\n\n', s)).strip()

def ex_pdf(src, path):
    import fitz
    # Thai PDFs often come out with sara am split off ("ล าดับ" for "ลำดับ"); า never starts a Thai word, so join it back
    fix = lambda t: re.sub(r'([ก-ฮ][่-๋]?) า', r'\1ำ', t)
    return [{'loc': f'p.{i + 1}', 'heading': '', 'text': fix(clean(pg.get_text()))} for i, pg in enumerate(fitz.open(path)) if pg.get_text().strip()]

def html_to_md(s):
    s = re.sub(r'(?is)<(script|style|head|svg)[^>]*>.*?</\1>', '', s)
    for n in range(1, 5): s = re.sub(rf'(?is)<h{n}[^>]*>(.*?)</h{n}>', lambda m: '\n' + '#' * n + ' ' + re.sub('<[^>]+>', '', m.group(1)).strip() + '\n', s)
    s = re.sub(r'(?is)<li[^>]*>', '\n- ', s); s = re.sub(r'(?is)<(br|/p|/div|/tr|/table|/ul|/ol)[^>]*>', '\n', s)
    s = re.sub(r'(?is)</t[dh]>', ' | ', s); s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(s)

def by_headings(md):
    out, head, buf = [], '', []
    for line in md.split('\n'):
        m = re.match(r'^(#{1,4})\s+(.*)', line)
        if m:
            if ''.join(buf).strip(): out.append({'loc': head or 'top', 'heading': head, 'text': clean('\n'.join(buf))})
            head, buf = m.group(2).strip()[:90], [line]
        else: buf.append(line)
    if ''.join(buf).strip(): out.append({'loc': head or 'top', 'heading': head, 'text': clean('\n'.join(buf))})
    return out

def ex_doc(src, path):
    s = open(path, encoding='utf-8', errors='replace').read()
    if path.lower().endswith(('.html', '.htm')): s = html_to_md(s)
    s = re.sub(r'(?s)^---\n.*?\n---\n', '', s)  # front matter
    return by_headings(s)

def cs_summary(code):
    # what a designer needs from a script: what it is, what can be tuned, what it does (not the code itself)
    cls = re.findall(r'\b(?:class|struct|enum)\s+(\w+)', code)
    fields = re.findall(r'(?:\[SerializeField\][^\n;]*?|public\s+)(?:static\s+)?(?:readonly\s+)?([\w<>\[\],]+)\s+(\w+)\s*(=\s*[^;]{1,40})?;', code)
    meths = re.findall(r'(?:public|private|protected|void)\s+[\w<>\[\]]+\s+(\w+)\s*\([^)]*\)\s*\{', code)
    comments = [c.strip() for c in re.findall(r'(?://+\s?|/\*+\s?|\*\s)(.{12,200})', code) if not c.strip().startswith(('<', 'using'))]
    enums = re.findall(r'enum\s+(\w+)\s*\{([^}]*)\}', code)
    parts = []
    if cls: parts.append('Types: ' + ', '.join(dict.fromkeys(cls)))
    if enums: parts += [f'Enum {n}: ' + ', '.join(x.strip().split('=')[0] for x in v.split(',') if x.strip()) for n, v in enums]
    if fields: parts.append('Tunable fields: ' + '; '.join(f'{n} ({t}{(" " + d.strip()) if d else ""})' for t, n, d in fields[:40]))
    if meths: parts.append('Methods: ' + ', '.join(dict.fromkeys(m for m in meths if m not in ('if', 'for', 'while', 'switch'))))
    if comments: parts.append('Notes in the code:\n' + '\n'.join('- ' + c for c in dict.fromkeys(comments[:40])))
    return '\n'.join(parts)

def js_summary(code):
    exp = re.findall(r'export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class|let)\s+(\w+)', code)
    consts = re.findall(r'\b(?:const|let)\s+([A-Z][A-Z0-9_]{2,})\s*=\s*([^;\n]{1,80})', code)
    comments = [c.strip() for c in re.findall(r'(?://\s?|/\*+\s?|\*\s)(.{12,220})', code)]
    parts = []
    if exp: parts.append('Exports: ' + ', '.join(dict.fromkeys(exp)))
    if consts: parts.append('Constants: ' + '; '.join(f'{k} = {v.strip()}' for k, v in consts[:30]))
    if comments: parts.append('Notes in the code:\n' + '\n'.join('- ' + c for c in dict.fromkeys(comments[:50])))
    return '\n'.join(parts)

def ex_project(src, path):
    out, files = [], []
    for pat in src.get('include', ['**/*']): files += sorted(glob.glob(os.path.join(path, pat), recursive=True))
    for f in dict.fromkeys(files):
        if '/Editor/' in f.replace('\\', '/') or not os.path.isfile(f): continue
        rel = os.path.relpath(f, path).replace('\\', '/'); s = open(f, encoding='utf-8', errors='replace').read()
        if f.endswith('.md'): out += [dict(x, loc=f'{rel} § {x["loc"]}') for x in by_headings(s)]
        elif f.endswith('.cs'): t = cs_summary(s); t and out.append({'loc': rel, 'heading': os.path.basename(f), 'text': f'Unity script {os.path.basename(f)}\n{t}'})
        elif f.endswith(('.js', '.mjs')): t = js_summary(s); t and out.append({'loc': rel, 'heading': os.path.basename(f), 'text': f'Source file {rel}\n{t}'})
        elif f.endswith('.json'): out.append({'loc': rel, 'heading': os.path.basename(f), 'text': s[:4000]})
    scenes = sorted(glob.glob(os.path.join(path, 'Assets/Scenes/**/*.unity'), recursive=True))
    if scenes: out.append({'loc': 'Assets/Scenes', 'heading': 'scenes', 'text': 'Unity scenes in the project: ' + ', '.join(os.path.basename(s)[:-6] for s in scenes)})
    return out

def ex_conversation(src, path):
    # one section per design session: the brief, then every turn (creator words, AI questions with their choices,
    # the options it offered, prototype comments), so a chunk is a short stretch of a real conversation
    out = []
    for f in sorted(glob.glob(os.path.join(path, '*.json'))):
        d = json.load(open(f, encoding='utf-8')); log = d.get('log') or []
        if sum(1 for t in log if t.get('who') == 'creator') < 2: continue
        sim = os.path.basename(f).startswith('sim-')
        b = d.get('brief') or {}; ch = d.get('chosen') or {}
        lines = [f"Design session ({'simulated creator' if sim else 'real creator'}). Brief: " + '; '.join(f'{k} {v}' for k, v in b.items() if v not in ('', None, [], {}))[:900]]
        if ch: lines.append(f"Chosen option: {ch.get('title', '')} ({ch.get('genre', '')}): {ch.get('pitch', '')}")
        for t in log:
            who, text, data = t.get('who'), (t.get('text') or '').strip(), t.get('data') or {}
            if who == 'creator' and text: lines.append('Creator: ' + text)
            elif who == 'ai' and text and text != 'ai':
                c = data.get('choices') or []; lines.append('AI: ' + text + (f" [choices: {' · '.join(map(str, c))}]" if c else ''))
                if data.get('why'): lines.append('AI reason: ' + str(data['why']))
        out.append({'loc': os.path.basename(f)[:-5], 'heading': ch.get('title') or (b.get('concept') or '')[:60], 'text': '\n'.join(lines)})
    return out

EXTRACT = {'pdf': ex_pdf, 'doc': ex_doc, 'project': ex_project, 'conversation': ex_conversation}

# ---------- 2 split ----------
def split_text(text, seps=SEPARATORS):
    if ntok(text) <= MAX_TOK: return [text]
    sep = next((s for s in seps if s and s in text), '')
    if not sep:  # no break left: cut by tokens
        ids = TOK.encode(text, add_special_tokens=False).ids
        return [TOK.decode(ids[i:i + MAX_TOK]) for i in range(0, len(ids), MAX_TOK - OVERLAP)]
    parts = [p for p in text.split(sep)]
    parts = [(sep.lstrip('\n') if i and sep.startswith('\n#') else '') + p for i, p in enumerate(parts)]
    joiner = '' if sep.startswith('\n#') else sep
    rest = seps[seps.index(sep) + 1:]
    pieces = []
    for p in parts:
        if ntok(p) > MAX_TOK: pieces += [(s, True) for s in split_text(p, rest)]   # already packed, with their own overlap
        elif p.strip(): pieces.append((p, False))
    # pack small pieces together up to MAX_TOK, carrying the tail of the last chunk over (OVERLAP tokens).
    # Pieces that came back from a deeper split are whole chunks already: packing them again would repeat their overlap.
    chunks, cur = [], ''
    for p, whole in pieces:
        if whole:
            if cur: chunks.append(cur)
            chunks.append(p); cur = ''; continue
        cand = (cur + (joiner if cur else '') + p) if cur else p
        if ntok(cand) <= MAX_TOK: cur = cand; continue
        if cur: chunks.append(cur)
        ids = TOK.encode(cur, add_special_tokens=False).ids if cur else []
        tail = TOK.decode(ids[-OVERLAP:]) if len(ids) > OVERLAP else ''
        cur = (tail + joiner + p) if tail and ntok(tail + joiner + p) <= MAX_TOK else p
    if cur: chunks.append(cur)
    return chunks

def merge_small(secs):
    # short neighbouring sections (a heading with 2 lines) are packed together so a chunk holds a whole idea;
    # conversations and code files stay one section each
    out = []
    for s in secs:
        p = out[-1] if out else None
        if p and not p.get('solo') and ntok(p['text']) + ntok(s['text']) <= MAX_TOK * 0.8 and not s['loc'].endswith(('.cs', '.js', '.mjs', '.json')) and not re.match(r'^(d|sim)-', s['loc']):
            p['text'] += '\n\n' + s['text']; p['loc'] = p['loc'].split(' … ')[0] + ' … ' + s['loc']; p['heading'] = p['heading'] or s['heading']
        else: out.append(dict(s))
    return out

# ---------- 3 embed ----------
def cf_token():
    p = os.path.join(os.environ.get('APPDATA', os.path.expanduser('~')), 'xdg.config/.wrangler/config/default.toml')
    return os.environ.get('CF_API_TOKEN') or re.search(r'oauth_token = "([^"]+)"', open(p, encoding='utf-8').read()).group(1)

def embed(texts):
    req = urllib.request.Request(f'https://api.cloudflare.com/client/v4/accounts/{ACCOUNT}/ai/run/{MODEL}', data=json.dumps({'text': texts}).encode('utf-8'),
                                 headers={'authorization': 'Bearer ' + cf_token(), 'content-type': 'application/json'})
    r = json.load(urllib.request.urlopen(req, timeout=120))
    if not r.get('success'): raise SystemExit('embedding failed: ' + json.dumps(r.get('errors'))[:200] + ' (run npx wrangler whoami to refresh the login)')
    return r['result']['data']

HEADER = '--no-header' not in sys.argv[1:]   # ablation: embed the bare chunk without its source title + section
def doc_text(c): return f"title: {c['source_title']} | {c['heading']} | text: {c['text']}" if HEADER else f"title: none | text: {c['text']}"   # same task prefix as the cards (title: ... | text: ...)

def main():
    args = sys.argv[1:]; only = args[args.index('--only') + 1] if '--only' in args else None
    man = json.load(open(os.path.join(KDIR, 'ingest', 'sources.json'), encoding='utf-8'))['sources']
    out_path = os.path.join(KDIR, OUT_NAME) if os.path.isabs(OUT_NAME) is False else OUT_NAME
    old = json.load(open(out_path, encoding='utf-8')) if os.path.exists(out_path) and only else {'sources': [], 'chunks': []}
    chunks = [c for c in old['chunks'] if only and c['source'] != only]; seen = {hashlib.sha1(c['text'].encode()).hexdigest() for c in chunks}
    stats = []
    for src in man:
        if only and src['id'] != only: continue
        path = os.path.normpath(os.path.join(ROOT, src['path']))
        if not os.path.exists(path): print(f"  ! {src['id']}: not found {path}"); continue
        secs = merge_small(EXTRACT[src['type']](src, path)); n0, dup, toks = len(chunks), 0, []
        for s in secs:
            for k, t in enumerate(split_text(s['text'])):
                t = t.strip(); h = hashlib.sha1(t.encode()).hexdigest(); n = ntok(t)
                if n < MIN_TOK: continue
                if h in seen: dup += 1; continue
                seen.add(h); toks.append(n)
                chunks.append({'id': f"{src['id']}#{len(chunks) - n0 + 1}", 'source': src['id'], 'source_title': src['title'], 'loc': s['loc'], 'heading': s['heading'], 'tokens': n, 'text': t})
        st = {'id': src['id'], 'type': src['type'], 'sections': len(secs), 'chunks': len(chunks) - n0, 'duplicates': dup, 'tokens': sum(toks), 'avg_tokens': round(sum(toks) / max(1, len(toks)))}
        stats.append(st); print(f"  {src['id']:<26} {src['type']:<12} {st['sections']:>4} sections -> {st['chunks']:>4} chunks · {st['tokens']:>6} tokens (avg {st['avg_tokens']}){' · ' + str(dup) + ' dup' if dup else ''}")
    if '--no-embed' in args: return
    cache = json.load(open(EMB_CACHE, encoding='utf-8')) if os.path.exists(EMB_CACHE) else {}
    key = lambda c: hashlib.sha1((MODEL + '\n' + doc_text(c)).encode()).hexdigest()
    todo = [c for c in chunks if key(c) not in cache]
    for i in range(0, len(todo), 40):
        part = todo[i:i + 40]
        for c, v in zip(part, embed([doc_text(c) for c in part])): cache[key(c)] = v
        print(f'  embedded {min(i + 40, len(todo))}/{len(todo)}')
    json.dump(cache, open(EMB_CACHE, 'w', encoding='utf-8'))
    import base64, array
    dim = len(cache[key(chunks[0])]); buf = bytearray(len(chunks) * dim)
    for i, c in enumerate(chunks):
        v = cache[key(c)]; m = max(abs(x) for x in v) or 1
        for k, x in enumerate(v): buf[i * dim + k] = (round(x / m * 127) + 256) % 256
    srcs = {s['id']: {k: s[k] for k in ('id', 'type', 'title', 'author', 'year', 'kind')} for s in man}
    for st in stats: srcs[st['id']]['stats'] = st
    for s in old.get('sources', []):
        if s['id'] in srcs and 'stats' not in srcs[s['id']] and s.get('stats'): srcs[s['id']]['stats'] = s['stats']
    out = {'model': MODEL, 'dim': dim, 'built': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'split': {'max_tokens': MAX_TOK, 'overlap': OVERLAP, 'min_tokens': MIN_TOK, 'tokenizer': 'embeddinggemma-300m (Gemma SentencePiece)'},
           'sources': [s for s in srcs.values() if 'stats' in s], 'chunks': chunks, 'vecs': base64.b64encode(bytes(buf)).decode()}
    json.dump(out, open(out_path, 'w', encoding='utf-8'), ensure_ascii=False)
    print(f'chunks.json · {len(chunks)} chunks · {sum(c["tokens"] for c in chunks)} tokens · {os.path.getsize(out_path) // 1024} KB')

if __name__ == '__main__': main()
