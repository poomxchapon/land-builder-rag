// What the brief fixes, as numbers, and whether the players fit the real floor.
// Two jobs, both from the blind review of 20 design conversations (19 Nov):
//   1. the brief overrules the cards: a card's default (a 150 s timer, night lighting) must not replace what the creator said
//   2. multiplayer layouts must be measured, not assumed: split the floor into one cell per walking player
// Pure code, no model call and no Node imports (runs in the local server and in the Cloudflare Worker).

export const SPACE = { edge: .6, gap: 1, cellMin: 2, sharedM2: 6, court: [14, 22] };
// gap = clear strip between two players' cells (an arm's reach each side); cellMin = Meta's 2 x 2 m roomscale minimum;
// sharedM2 = floor per player when everyone walks one shared route. gap and sharedM2 are our assumptions until walk tests.

const DARK = ['night', 'spooky', 'neon'];
const DAY = /เช้า|สาย|เที่ยง|บ่าย|กลางวัน|ทั้งวัน|แดด|morning|noon|midday|afternoon|daytime|daylight|all day|sunny/i;
const NIGHT = /กลางคืน|ค่ำ|ดึก|มืด|ปิดไฟ|night|after dark|dark|lights off/i;
// the creator's own words asking for a dark look (then a dark preset is theirs, not a card's)
const WANTS_DARK = /กลางคืน|มืด|ผี|หลอน|สยอง|นีออน|night|dark|spooky|ghost|haunt|horror|neon/i;

// a calm game: the creator asked to relax or for no pressure, so points and rankings stay out of what the player reads
const CALM = /no pressure|no rush|unhurried|relax|calm|ไม่ต้องรีบ|ไม่รีบ|ผ่อนคลาย|สบาย ?ๆ|ไม่กดดัน/i;
const SCORE = /คะแนน|แต้ม|อันดับ|โบนัส|\bscores?\b|\bpoints?\b|leaderboard|ranking|time bonus/i, NOT = /ไม่มี|ไม่นับ|ไม่แสดง|ไม่ใช่|ไม่ต้อง|\bno\b|\bnot\b|without|never|nothing/i;
export const isCalm = (b = {}) => (b.feelings || []).includes('submission') || CALM.test(`${b.constraints || ''} ${b.concept || ''}`);
/** lines that talk about points, ranks or bonuses as something to chase (a line that says there are none is fine) */
export const scoreTalk = lines => (lines || []).filter(t => SCORE.test(t || '') && !NOT.test(t));
// distance between players on one shared route: 2 m where the floor allows it, less on a small floor
export const sharedGap = usable => Math.min(...usable) >= 6 ? 2 : 1.2;

export function floorOf(b = {}) {
  if (b.platform === 'pc') return null;
  if (b.venue === 'fortal-court') return { w: SPACE.court[0], d: SPACE.court[1], preset: true };
  return +b.width_m > 0 && +b.depth_m > 0 ? { w: +b.width_m, d: +b.depth_m } : null;
}
// how many walk at the same moment: "ทีละ 4 คน", "2 at a time", "6 คนพร้อมกัน", "solo", "คนเดียว"
export function playersAtOnce(b = {}) {
  const t = String(b.group_size || ''); if (/solo|alone|คนเดียว|เดี่ยว/i.test(t)) return 1;
  const m = t.match(/(\d+)/); if (m) return Math.max(1, Math.min(30, +m[1]));
  return b.play_mode === 'solo' ? 1 : null;
}

/** the facts of the brief that no card may change */
export function briefFacts(b = {}) {
  const tod = `${b.time_of_day || ''}`, env = `${b.environment || ''}`, f = {};
  if (+b.session_minutes > 0) f.sessionS = Math.round(+b.session_minutes * 60);
  f.daylight = DAY.test(tod) && !NIGHT.test(tod + ' ' + env);
  f.outdoor = b.indoor === false;
  f.wantsDark = WANTS_DARK.test(`${b.concept || ''} ${b.constraints || ''} ${env}`);
  f.players = playersAtOnce(b); f.playMode = b.play_mode || null; f.floor = floorOf(b);
  return f;
}

/**
 * One cell per walking player. Tries every cols x rows grid that holds n players and keeps the one with the largest
 * smaller side. max = the most players this floor holds with every cell at least cellMin on both sides.
 */
export function solveLayout(b = {}) {
  const fl = floorOf(b); if (!fl) return null;
  const n = playersAtOnce(b) || 1, shared = b.play_mode === 'together', W = fl.w - 2 * SPACE.edge, D = fl.d - 2 * SPACE.edge;
  const cell = (cols, rows) => ({ cols, rows, w: +((W - (cols - 1) * SPACE.gap) / cols).toFixed(2), d: +((D - (rows - 1) * SPACE.gap) / rows).toFixed(2) });
  const best = k => { let b0 = null; for (let cols = 1; cols <= k; cols++) { const rows = Math.ceil(k / cols), c = cell(cols, rows), s = Math.min(c.w, c.d); if (!b0 || s > b0.s) b0 = { ...c, s }; } return b0; };
  let max = 0; for (let k = 1; k <= 30; k++) { if (best(k).s >= SPACE.cellMin) max = k; else break; }
  const sharedMax = Math.max(0, Math.floor(W * D / SPACE.sharedM2));
  const cap = Math.max(1, shared ? sharedMax : max), c = best(n);   // one player always fits: the small-room rules cover that case
  return { floor: fl, usable: [+W.toFixed(2), +D.toFixed(2)], players: n, mode: b.play_mode || 'solo', max: cap, fits: n <= cap, cell: c,
    obstaclesUnmeasured: !!b.obstacles && !/^(none|ไม่มี|-)?$/i.test(String(b.obstacles).trim()) };
}

/** the prompt block: facts the cards may not change, and the measured player layout */
export function factsBlock(q) {
  const b = q.brief || {}; if (!['options', 'prototype', 'build'].includes(q.phase)) return '';
  const f = briefFacts(b), L = solveLayout(b), out = [];
  if (f.sessionS) out.push(`- One play lasts ${f.sessionS} s (${b.session_minutes} min, the creator's number). If the game has a time limit it is ${f.sessionS} s (only a walking course can have one; battle and tactics never do). A card's worked example with another number does not change it. Time for handing over the headset is not part of the time limit.`);
  if (f.daylight && !f.wantsDark) out.push(`- It is played in daylight ("${b.time_of_day}"${f.outdoor ? ', outdoors' : ''}) and the creator did not ask for a dark look: the lighting preset is not night, spooky or neon, even if a card for this theme suggests one.`);
  if (isCalm(b)) out.push('- This is a calm game (the creator asked to relax, or for no pressure). The engine still counts points silently, but nothing the player reads talks about them: no score, points, bonus, ranking or leaderboard in the goal, the rules, the HUD or the story. Say what the player sees and does instead.');
  if (f.playMode) out.push(`- Play mode is "${f.playMode}"${f.players ? `, ${f.players} ${b.platform === 'pc' ? 'playing' : 'walking'} at once` : ''} (the creator's choice).`);
  if (L && L.players > 1) {
    const c = L.cell;
    if (L.mode === 'together') out.push(`- Measured: ${L.players} players share one route on a usable floor of ${L.usable[0]} x ${L.usable[1]} m. At ${SPACE.sharedM2} m² each this floor holds ${L.max}.${L.fits ? '' : ` ${L.players} is more than that.`} Players start one after the other and keep about ${sharedGap(L.usable)} m apart (${sharedGap(L.usable) < 2 ? 'two steps: this floor is too small for more' : 'three steps'}); say so in the rules in plain words.`);
    else out.push(`- Measured: ${L.players} players walk at once, each on their own copy of the Land. On this floor (${L.floor.w} x ${L.floor.d} m, ${SPACE.edge} m kept clear at the edge) that is ${c.cols} cell(s) across the ${L.floor.w} m side and ${c.rows} along the ${L.floor.d} m side, each ${c.w} x ${c.d} m, with ${SPACE.gap} m between cells (across: ${[SPACE.edge, ...Array(c.cols).fill(c.w).flatMap((w, i) => i ? [SPACE.gap, w] : [w]), SPACE.edge].join(' + ')} = ${L.floor.w} m; along: ${[SPACE.edge, ...Array(c.rows).fill(c.d).flatMap((d, i) => i ? [SPACE.gap, d] : [d]), SPACE.edge].join(' + ')} = ${L.floor.d} m). Design the route for ONE cell of ${c.w} x ${c.d} m, not for the whole floor, and copy this arithmetic into the layout brief so the builder can tape the cells. This floor holds at most ${L.max} players this way.`);
    if (!L.fits) out.push(`- ${L.players} players do not fit safely (the most is ${L.max}). The creator's number stays: write a decision with by "creator" and put this warning and the safer number (${L.max}, the rest wait their turn) in its "conflict", so the creator decides.`);
    if (L.obstaclesUnmeasured) out.push(`- The real obstacles ("${b.obstacles}") are not measured yet, so cells may lose room: tell the creator to check the cells in the editor before play.`);
  }
  return out.length ? `## Facts of this brief that no card may change (computed from the brief)\nThe design knowledge cards are guidance. These facts come from the creator and from measuring the floor; follow them exactly.\n${out.join('\n')}` : '';
}

/** errors when an answer goes against the brief. plan = { time_limit_s, lighting } read from the step's answer */
export function briefErrors(b, plan = {}, where = '') {
  const f = briefFacts(b || {}), e = [];
  if (f.sessionS && plan.time_limit_s != null && Math.abs(plan.time_limit_s - f.sessionS) > f.sessionS * .1)
    e.push(`${where}time limit ${plan.time_limit_s} s goes against the brief: the creator said one play lasts ${b.session_minutes} min, so the limit is ${f.sessionS} s (or no limit). Do not take the number from a card`);
  if (f.daylight && !f.wantsDark && DARK.includes(plan.lighting))
    e.push(`${where}lighting "${plan.lighting}" goes against the brief: it is played in daylight ("${b.time_of_day}") and the creator did not ask for a dark look. Use noon, morning, evening, studio or default`);
  return e;
}
