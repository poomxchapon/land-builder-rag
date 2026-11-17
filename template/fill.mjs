// Fill the game description template (template/game-template.json) from real design runs, and sort the knowledge
// cards into the same template slots, so the designs and the knowledge base share one structure.
//   1 fill   an AI agent (Kimi K3) reads each finished design (brief, chosen option, prototype, build plan) and fills
//            every slot as stated / implied / missing, with a short quote as evidence. It is blind to whether the
//            design used the knowledge base: card ids and decision sources are removed first.
//   2 cards  the same agent tags every knowledge card with the 1-3 template slots it informs.
//   3 report fill rate per slot and section, with vs without the knowledge base, and cards per slot.
// Usage: node template/fill.mjs   (needs KIMI_API_KEY or ~/.kimi/api_key; caches in template/.cache/)
// Output: results/template/template-fill.json
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'template/game-template.json'), 'utf8'));
const AB = JSON.parse(fs.readFileSync(path.join(ROOT, 'results/ab/ab-rag-on-off.json'), 'utf8'));
const IX = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/index.json'), 'utf8')); const CARDS = IX.cards || IX;
const C = path.join(ROOT, 'template/.cache'); fs.mkdirSync(C, { recursive: true });
const cache = (n, v) => { const f = path.join(C, n + '.json'); if (v !== undefined) fs.writeFileSync(f, JSON.stringify(v, null, 1)); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };
const SLOTS = T.sections.flatMap(s => s.slots.map(x => ({ ...x, section: s.id })));
const IDS = SLOTS.map(s => s.id);

const KEY = (process.env.KIMI_API_KEY || fs.readFileSync(path.join(os.homedir(), '.kimi/api_key'), 'utf8')).trim();
const URL = process.env.KIMI_URL || 'https://api.kimi.com/coding/v1/messages', MODEL = process.env.KIMI_MODEL || 'k3';
async function tool(name, schema, prompt, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const ac = new AbortController(); const t = setTimeout(() => ac.abort(), 300000);
      const r = await fetch(URL, { method: 'POST', signal: ac.signal, headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: MODEL, max_tokens: 16000, thinking: { type: 'disabled' }, tools: [{ name, description: 'Return the answer', input_schema: schema }], tool_choice: { type: 'tool', name }, messages: [{ role: 'user', content: prompt }] }) });
      clearTimeout(t); const j = await r.json(); if (!r.ok) throw new Error(r.status + ' ' + JSON.stringify(j).slice(0, 200));
      const u = (j.content || []).find(c => c.type === 'tool_use'); if (!u) throw new Error('no tool call');
      return { input: u.input, usage: j.usage };
    } catch (e) { if (i >= tries) throw e; console.log(' retry', i, String(e.message).slice(0, 120)); }
  }
}
const pool = async (items, n, fn) => { const q = [...items]; await Promise.all(Array.from({ length: n }, async () => { while (q.length) { const x = q.shift(); try { await fn(x); } catch (e) { console.log('!', x.key || x, String(e.message).slice(0, 160)); } } })); };

// ---------- 1 fill ----------
// what the agent sees: the design only, with every trace of the knowledge base removed
const blind = side => {
  const o = side.options?.[side.pick ?? side.recommend] || {};
  const p = side.prototype || {};
  return { option: { title: o.title, pitch: o.pitch, genre: o.genre, core_loop: o.core_loop },
    prototype: { title: p.title, logline: p.logline, pillars: p.pillars, storyboard: p.storyboard,
      decisions: (p.decisions || []).map(d => ({ what: d.what, choice: d.choice, quote: d.quote })) },
    build: side.build };
};
const slotList = SLOTS.map(s => `- ${s.id} (${s.section}): ${s.ask}`).join('\n');
const fillSchema = { type: 'object', required: ['slots'], properties: { slots: { type: 'object', required: IDS, additionalProperties: false,
  properties: Object.fromEntries(IDS.map(id => [id, { type: 'object', required: ['status', 'value'], properties: {
    status: { type: 'string', enum: ['stated', 'implied', 'missing'] }, value: { type: 'string', maxLength: 240 }, evidence: { type: 'string', maxLength: 160 } } }])) } } };
const filled = cache('filled') || {};
const jobs = AB.runs.flatMap(r => ['on', 'off'].map(side => ({ key: `${r.id}:${side}`, r, side })));
await pool(jobs.filter(j => !filled[j.key]), 5, async j => {
  const doc = { brief: j.r.brief, ...blind(j.r[j.side]) };
  const { input } = await tool('fill_template', fillSchema, `You are filling a game description template from a finished game design. The template is one shared skeleton for describing a whole game, based on what Unity and Unreal projects both hold (project settings, rules, player, levels, actors, art, animation, audio, UI, camera, networking) plus the design intent.

For EVERY slot below give:
- status: "stated" if the design says it directly; "implied" if it does not say it but it follows clearly from what is said; "missing" if a builder would have to guess.
- value: the answer in short plain English (max 2 sentences). Empty string when missing. Do not invent details the design does not support.
- evidence: a short quote copied from the design (any language) that supports the value. Empty when missing.

Slots:
${slotList}

The design (JSON, partly in Thai):
${JSON.stringify(doc)}`);
  filled[j.key] = input.slots; cache('filled', filled); process.stdout.write(`fill ${Object.keys(filled).length}/${jobs.length}\r`);
});
console.log('\nfilled', Object.keys(filled).length);

// ---------- 2 cards ----------
const tags = cache('cards') || {};
const batches = []; const todo = CARDS.filter(c => !tags[c.id]); for (let i = 0; i < todo.length; i += 40) batches.push({ key: 'b' + i, cards: todo.slice(i, i + 40) });
const cardSchema = { type: 'object', required: ['cards'], properties: { cards: { type: 'array', items: { type: 'object', required: ['id', 'slots'], properties: {
  id: { type: 'string' }, slots: { type: 'array', minItems: 1, maxItems: 3, items: { type: 'string', enum: IDS } } } } } } };
await pool(batches, 5, async b => {
  const { input } = await tool('tag_cards', cardSchema, `Below are knowledge cards from a game-design knowledge base, and the slots of a game description template. For each card, list the 1-3 template slots whose content the card most helps a designer decide. Return every card id.

Slots:
${slotList}

Cards:
${b.cards.map(c => `${c.id}: ${c.title}. Use when: ${c.use_when}`).join('\n')}`);
  for (const c of input.cards) if (b.cards.some(x => x.id === c.id)) tags[c.id] = c.slots.filter(s => IDS.includes(s));
  cache('cards', tags); process.stdout.write(`cards ${Object.keys(tags).length}/${CARDS.length}\r`);
});
console.log('\ncards tagged', Object.keys(tags).length, 'of', CARDS.length);

// ---------- 3 report ----------
const runs = jobs.filter(j => filled[j.key]).map(j => ({ id: j.r.id, side: j.side, title: blind(j.r[j.side]).prototype.title, slots: filled[j.key] }));
const pct = (n, d) => d ? Math.round(1000 * n / d) / 10 : 0;
const rate = (rs, ids) => { const n = rs.length * ids.length; const c = st => rs.reduce((a, r) => a + ids.filter(id => r.slots[id]?.status === st).length, 0);
  return { stated: pct(c('stated'), n), implied: pct(c('implied'), n), missing: pct(c('missing'), n) }; };
const on = runs.filter(r => r.side === 'on'), off = runs.filter(r => r.side === 'off');
const perRun = runs.map(r => ({ id: r.id, side: r.side, title: r.title, ...rate([r], IDS) }));
const cardsPer = Object.fromEntries(IDS.map(id => [id, 0])); for (const s of Object.values(tags)) for (const id of s) cardsPer[id]++;
// paired test: per brief, does "on" leave fewer slots missing than "off"? (sign test, two-sided)
const pairs = AB.runs.map(r => { const a = perRun.find(x => x.id === r.id && x.side === 'on'), b = perRun.find(x => x.id === r.id && x.side === 'off'); return a && b ? b.missing - a.missing : null; }).filter(x => x !== null);
const wins = pairs.filter(x => x > 0).length, losses = pairs.filter(x => x < 0).length, nn = wins + losses;
const binom = (n, k) => { let c = 1; for (let i = 0; i < k; i++) c = c * (n - i) / (i + 1); return c; };
const sign = nn ? Math.min(1, 2 * Array.from({ length: Math.min(wins, losses) + 1 }, (_, k) => binom(nn, k)).reduce((a, b) => a + b, 0) / 2 ** nn) : 1;
const out = {
  title: 'Game description template: filled from 20 design runs', date: new Date().toISOString().slice(0, 10), model: MODEL,
  template: 'template/game-template.json',
  method: 'An AI agent fills every slot of the template from each finished design (brief, chosen option, prototype, build plan), blind to whether the knowledge base was used. The same agent tags each knowledge card with the template slots it informs.',
  overall: { all: rate(runs, IDS), on: rate(on, IDS), off: rate(off, IDS) },
  paired: { briefs: pairs.length, on_fewer_missing: wins, off_fewer_missing: losses, ties: pairs.length - nn, sign_p: Math.round(sign * 1000) / 1000 },
  sections: T.sections.map(s => { const ids = s.slots.map(x => x.id); return { id: s.id, label: s.label, unity: s.unity, unreal: s.unreal,
    on: rate(on, ids), off: rate(off, ids), cards: [...new Set(Object.entries(tags).filter(([, v]) => v.some(x => ids.includes(x))).map(([k]) => k))].length,
    slots: s.slots.map(x => ({ id: x.id, label: x.label, ask: x.ask, on: rate(on, [x.id]), off: rate(off, [x.id]), cards: cardsPer[x.id] })) }; }),
  runs: perRun, filled: runs, card_slots: tags
};
fs.mkdirSync(path.join(ROOT, 'results/template'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'results/template/template-fill.json'), JSON.stringify(out));
console.log(JSON.stringify({ overall: out.overall, paired: out.paired }, null, 1));
console.log(out.sections.map(s => `${s.label.padEnd(22)} on miss ${String(s.on.missing).padStart(5)}%  off miss ${String(s.off.missing).padStart(5)}%  cards ${s.cards}`).join('\n'));
