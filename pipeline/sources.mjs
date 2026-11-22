// Where does each card come from, and which published work supports it?
//   1 provenance  read from the card's own "source": literature, platform guideline, studio document, engine,
//                 design sessions, or design practice (written from the team's experience, no publication behind it)
//   2 cited       works the source line already names are linked to data/references.json (checked DOIs/ISBNs/URLs)
//   3 see also    for cards that say "design practice", an AI agent (Kimi K3) proposes up to 2 works from that list
//                 only; a second, separate call checks each pair blind ("does this work discuss this idea?").
//                 A pair is kept only when the checker says yes. These are supporting reading, found after the card
//                 was written, not the card's source.
// Usage: node pipeline/sources.mjs   (KIMI_API_KEY or ~/.kimi/api_key; caches in pipeline/.cache/sources/)
// Output: data/card-sources.json, and refs / see_also / provenance fields added to data/cards/*.json and data/index.json
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REFS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/references.json'), 'utf8')).references, RID = REFS.map(r => r.id);
const IXF = path.join(ROOT, 'data/index.json'), IX = JSON.parse(fs.readFileSync(IXF, 'utf8')), CARDS = IX.cards;
const C = path.join(ROOT, 'pipeline/.cache/sources'); fs.mkdirSync(C, { recursive: true });
const cache = (n, v) => { const f = path.join(C, n + '.json'); if (v !== undefined) fs.writeFileSync(f, JSON.stringify(v, null, 1)); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };

const KEY = (process.env.KIMI_API_KEY || fs.readFileSync(path.join(os.homedir(), '.kimi/api_key'), 'utf8')).trim();
const URL = process.env.KIMI_URL || 'https://api.kimi.com/coding/v1/messages', MODEL = process.env.KIMI_MODEL || 'k3';
async function tool(name, schema, prompt, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const ac = new AbortController(); const t = setTimeout(() => ac.abort(), 300000);
      const r = await fetch(URL, { method: 'POST', signal: ac.signal, headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: MODEL, max_tokens: 16000, thinking: { type: 'disabled' }, tools: [{ name, description: 'Return the answer', input_schema: schema }], tool_choice: { type: 'tool', name }, messages: [{ role: 'user', content: prompt }] }) });
      clearTimeout(t); const j = await r.json(); if (!r.ok) throw new Error(r.status + ' ' + JSON.stringify(j).slice(0, 200));
      const u = (j.content || []).find(c => c.type === 'tool_use'); if (!u) throw new Error('no tool call'); return u.input;
    } catch (e) { if (i >= tries) throw e; console.log(' retry', i, String(e.message).slice(0, 120)); }
  }
}
const pool = async (items, n, fn) => { const q = [...items]; await Promise.all(Array.from({ length: n }, async () => { while (q.length) { const x = q.shift(); try { await fn(x); } catch (e) { console.log('!', String(e.message).slice(0, 160)); } } })); };

// ---------- 1 provenance, 2 cited ----------
const provenance = s => /Land Builder users/.test(s) ? 'design-sessions' : /FortalLand engine|Land Builder (PC|MR)? ?\w* ?engine|engine \(Vite/.test(s) ? 'engine'
  : /^Fortal Interactive 2026/.test(s) ? 'studio-document' : /^Meta/.test(s) && !/design practice/.test(s) ? 'platform-guideline'
  : /^design practice$/.test(s.trim()) ? 'design-practice' : RID.some(id => cited(s).includes(id)) ? 'literature' : /design practice/.test(s) ? 'design-practice' : 'other';
function cited(s) { return REFS.filter(r => (r.match || []).some(m => s.includes(m))).map(r => r.id); }

// ---------- 3 see also ----------
const refList = REFS.map(r => `${r.id}: ${r.cite}. Covers: ${r.topics}`).join('\n');
const practice = CARDS.filter(c => /design practice/.test(c.source));
const prop = cache('propose') || {};
const batches = []; const todo = practice.filter(c => !prop[c.id]); for (let i = 0; i < todo.length; i += 25) batches.push(todo.slice(i, i + 25));
const pSchema = { type: 'object', required: ['cards'], properties: { cards: { type: 'array', items: { type: 'object', required: ['id', 'refs'], properties: {
  id: { type: 'string' }, refs: { type: 'array', maxItems: 2, items: { type: 'object', required: ['ref', 'why'], properties: { ref: { type: 'string', enum: RID }, why: { type: 'string', maxLength: 200 } } } } } } } } };
await pool(batches, 5, async b => {
  const r = await tool('propose', pSchema, `Below are game-design knowledge cards written from practical experience, and a list of published works. For each card, pick 0, 1 or 2 works from the list ONLY IF that work clearly discusses the card's main idea (not just the general topic). Most cards about local culture, venues, brands or this product's engine will have none: return an empty list for those. Never pick a work just because it is a general game design book. Give a one-sentence reason naming the concept in the work.

Works:
${refList}

Cards:
${b.map(c => `${c.id}: ${c.title}. ${c.text}`).join('\n')}`);
  for (const c of r.cards) if (b.some(x => x.id === c.id)) prop[c.id] = c.refs.filter(x => RID.includes(x.ref));
  for (const c of b) prop[c.id] ||= []; cache('propose', prop); process.stdout.write(`propose ${Object.keys(prop).length}/${practice.length}\r`);
});
const pairs = Object.entries(prop).flatMap(([id, rs]) => rs.map(r => ({ id, ref: r.ref, why: r.why })));
console.log('\nproposed pairs', pairs.length);
const ver = cache('verify') || {}; const key = p => p.id + '|' + p.ref;
const vb = []; const vt = pairs.filter(p => !ver[key(p)]); for (let i = 0; i < vt.length; i += 20) vb.push(vt.slice(i, i + 20));
const vSchema = { type: 'object', required: ['pairs'], properties: { pairs: { type: 'array', items: { type: 'object', required: ['n', 'verdict'], properties: {
  n: { type: 'integer' }, verdict: { type: 'string', enum: ['yes', 'partly', 'no'] }, note: { type: 'string', maxLength: 160 } } } } } };
const byId = new Map(CARDS.map(c => [c.id, c])), byRef = new Map(REFS.map(r => [r.id, r]));
await pool(vb, 5, async b => {
  const r = await tool('verify', vSchema, `You are checking citations. For each numbered pair, answer whether the published work actually discusses the main idea of the card: "yes" (the work makes this point or a clearly equivalent one), "partly" (same topic, but the work does not make this point), "no". Be strict. If you do not know the work's content well enough, answer "partly".

${b.map((p, n) => `${n}. WORK: ${byRef.get(p.ref).cite}\n   CARD: ${byId.get(p.id).title}. ${byId.get(p.id).text}`).join('\n')}`);
  for (const v of r.pairs) if (b[v.n]) ver[key(b[v.n])] = { verdict: v.verdict, note: v.note || '' };
  cache('verify', ver); process.stdout.write(`verify ${Object.keys(ver).length}/${pairs.length}\r`);
});

// ---------- write ----------
const out = {}; const stat = { provenance: {}, cited: 0, see_also_cards: 0, proposed: pairs.length, kept: 0, partly: 0, rejected: 0 };
for (const c of CARDS) {
  const pv = provenance(c.source), refs = cited(c.source);
  const see = (prop[c.id] || []).filter(p => !refs.includes(p.ref)).map(p => ({ ...p, ...ver[key({ id: c.id, ref: p.ref })] }));
  for (const s of see) stat[s.verdict === 'yes' ? 'kept' : s.verdict === 'partly' ? 'partly' : 'rejected']++;
  const keep = see.filter(s => s.verdict === 'yes').map(s => ({ ref: s.ref, why: s.why }));
  out[c.id] = { provenance: pv, refs, see_also: keep };
  stat.provenance[pv] = (stat.provenance[pv] || 0) + 1; if (refs.length) stat.cited++; if (keep.length) stat.see_also_cards++;
}
fs.writeFileSync(path.join(ROOT, 'data/card-sources.json'), JSON.stringify({ _about: 'Per card: provenance (where the card came from), refs (works its source line names), see_also (published works an AI agent matched to "design practice" cards afterwards and a second blind check confirmed; supporting reading, not the source). Works are in data/references.json.', stats: stat, cards: out }));
for (const c of CARDS) Object.assign(c, out[c.id]);
fs.writeFileSync(IXF, JSON.stringify(IX));
for (const f of fs.readdirSync(path.join(ROOT, 'data/cards')).filter(f => f.endsWith('.json'))) {
  const p = path.join(ROOT, 'data/cards', f); const list = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const c of list) if (out[c.id]) Object.assign(c, out[c.id]); fs.writeFileSync(p, JSON.stringify(list, null, 1));
}
console.log('\n' + JSON.stringify(stat, null, 1));
