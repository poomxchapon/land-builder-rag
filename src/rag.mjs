// RAG for AI Game Design: the design AI gets the knowledge cards (knowledge/cards/*.json) that fit this step,
// so when it decides something the creator did not say, it decides from a stated principle and cites it.
// The index (knowledge/index.json) holds every card plus its embedding (int8, base64). The host embeds the
// query (local server: Cloudflare REST API; Worker: the AI binding) and passes the vector in.
// No Node imports: the same file runs in the local server and in the Cloudflare Worker.

export const EMBED_MODEL = '@cf/google/embeddinggemma-300m';
// embeddinggemma reads a task prefix; cards and queries use the retrieval pair it was trained with
export const docText = c => `title: ${c.title} | text: ${c.text} When: ${c.use_when || ''}`;
export const queryText = s => `task: search result | query: ${s}`;

/** unpacks knowledge/index.json once: { cards, vecs: Float32Array[] } */
export function loadIndex(json) {
  const ix = typeof json === 'string' ? JSON.parse(json) : json, bin = atob(ix.vecs), d = ix.dim, vecs = [];
  for (let i = 0; i < ix.cards.length; i++) { const v = new Float32Array(d); let n = 0;
    for (let k = 0; k < d; k++) { let b = bin.charCodeAt(i * d + k); if (b > 127) b -= 256; v[k] = b; n += b * b; }
    n = Math.sqrt(n) || 1; for (let k = 0; k < d; k++) v[k] /= n; vecs.push(v); }
  return { model: ix.model, dim: d, cards: ix.cards, vecs, ids: new Set(ix.cards.map(c => c.id)) };
}

// what the step is about, in words: the brief, the chosen option, the last things the creator said
export function ragQuery(q) {
  const b = q.brief || {}, o = q.option || {}, said = (q.history || []).filter(t => t.who !== 'ai').slice(-3).map(t => t.text);
  const bits = [`phase ${q.phase}`, b.platform && `platform ${b.platform}`, b.concept, b.players, b.group_size && `group ${b.group_size}`, b.vr_experience,
    (b.feelings || []).length && `feelings ${b.feelings.join(' ')}`, b.venue === 'space' && b.width_m && `space ${b.width_m} x ${b.depth_m} m ${b.indoor === false ? 'outdoor' : 'indoor'}`,
    b.environment, b.time_of_day, b.play_mode, b.constraints, b.spectators,
    o.title && `chosen ${o.genre || ''} ${o.title}: ${o.pitch || ''} theme ${o.theme || ''}`, q.note, q.comments, ...said];
  return bits.filter(Boolean).join('. ').slice(0, 1800);
}

const K = { interview: 6, options: 9, prototype: 9, build: 6 };
// which card categories help most in each phase (a small boost; meaning decides the rest)
const PHASE_CAT = { interview: ['uncertainty', 'space'], options: ['genre', 'theory', 'cases', 'space'], prototype: ['prototype', 'genre', 'cases'], build: ['genre', 'space', 'cases'] };

/**
 * picks the cards for this step: meaning (cosine) + tag fit, at most 3 per category so one topic cannot crowd out the rest.
 * @returns [{ card, score }]
 */
export function retrieve(index, qvec, q, k = K[q.phase] || 6, all = false) {
  let n = 0; for (const x of qvec) n += x * x; n = Math.sqrt(n) || 1;
  const b = q.brief || {}, plat = b.platform, genre = q.option?.genre, feel = new Set(b.feelings || []), kids = /kid|child|เด็ก|ป\.|อนุบาล|family|ครอบครัว/i.test(`${b.players} ${b.group_size}`);
  const scored = index.cards.map((c, i) => { const v = index.vecs[i], t = c.tags || {}; let s = 0;
    for (let j = 0; j < v.length; j++) s += v[j] * qvec[j]; s /= n; const cos = s;
    if (plat && t.platform?.length && !t.platform.includes(plat)) return { card: c, score: -1, cos, i };      // wrong platform: never
    if (genre && t.genre?.length && !t.genre.includes(genre)) s -= .12;                                      // about another genre
    else if (genre && t.genre?.includes(genre)) s += .05;
    if (t.phase?.includes(q.phase)) s += .04;
    if (PHASE_CAT[q.phase]?.includes(c.cat)) s += .02;
    s += .015 * (t.feelings || []).filter(f => feel.has(f)).length;
    if (kids && t.players?.some(p => p === 'kids' || p === 'families')) s += .02;
    return { card: c, score: s, cos, i }; });
  if (all) return scored;
  scored.splice(0, scored.length, ...scored.filter(x => x.score > 0).sort((a, b) => b.score - a.score));
  const out = [], per = {};
  for (const x of scored) { if (out.length >= k) break; if ((per[x.card.cat] = (per[x.card.cat] || 0) + 1) > 3) continue; out.push(x); }
  return out;
}

/** the prompt block: the retrieved cards, compact, with the rule to cite them. A card distilled from a real document
 * carries a short excerpt of it (knowledge/build.mjs), so the AI sees the source's own numbers and words. */
export function knowledgeBlock(hits, phase) {
  if (!hits?.length) return '';
  const cards = hits.map(({ card: c }) => `[${c.id}] ${c.title}. ${c.text}${c.do?.length ? ` Do: ${c.do.join('; ')}.` : ''}${c.avoid?.length ? ` Avoid: ${c.avoid.join('; ')}.` : ''}${c.excerpt ? `\n   Source (${c.excerpt.src}, ${c.excerpt.loc}; another game, for its numbers and lessons only): "${c.excerpt.text}"` : ''}`).join('\n');
  const how = { interview: 'Use them to choose the next question and the defaults you assume. Put the ids you used in `sources`.',
    options: 'Use them when you decide things the brief does not say (genre fit, counts, theme, lighting, route, difficulty). Each option lists the ids it relied on in `sources`.',
    prototype: 'Use them for the look, palette, beats, flow and playtest questions. In `decisions`, list the main design decisions and who made each one.',
    build: 'Follow them where the approved prototype leaves something open.' }[phase] || '';
  return `## Design knowledge (retrieved for this step)\nThese cards are design principles, rules and worked cases chosen for this brief. They are guidance, not orders: the creator's words always win, and never copy a worked example as the answer. ${how} Cite only ids from this list.\n${cards}`;
}

// the texts to embed for one step: the step itself, plus the creator's latest request or comments on their own
// (otherwise a long brief drowns a short comment like "not wow enough" and its cards never come up)
export const ragQueries = q => { const extra = q.comments || (q.phase === 'options' || q.phase === 'prototype' ? q.note : null);
  return [ragQuery(q), ...(extra ? [`creator feedback: ${extra}`] : [])].map(queryText); };

/** retrieve for every query vector: the main list, then up to 3 more cards that fit the feedback */
export function retrieveAll(index, vecs, q) {
  const main = retrieve(index, vecs[0], q); if (vecs.length < 2) return main;
  const have = new Set(main.map(h => h.card.id)), more = retrieve(index, vecs[1], q, 12).filter(h => !have.has(h.card.id)).slice(0, 3);
  return [...main, ...more];
}
