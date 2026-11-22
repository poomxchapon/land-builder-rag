# b01-kids-living · WITH the knowledge base (RAG)

Model: Kimi K3.1 Pro. Same brief and same steps in both runs. The system prompts were not saved; this is the creator input and every AI output, in order.

## Creator: the game brief

```json
{
 "platform": "mr",
 "concept": "เกมไดโนเสาร์น่ารัก งานวันเกิดลูก",
 "players": "เด็กอนุบาล 5-6 ขวบ 8 คน ผลัดกันเล่น",
 "group_size": "ทีละ 1 คน",
 "vr_experience": "ไม่เคย",
 "feelings": [
  "discovery",
  "sensation"
 ],
 "venue": "space",
 "width_m": 3,
 "depth_m": 3.5,
 "indoor": true,
 "obstacles": "โซฟาชิดผนัง",
 "environment": "ห้องนั่งเล่นบ้าน ไฟสว่าง",
 "time_of_day": "บ่าย",
 "session_minutes": 3,
 "play_mode": "solo",
 "constraints": "ห้ามน่ากลัว",
 "spectators": "พ่อแม่และเด็กนั่งโซฟา"
}
```

## AI designer: three game options

Knowledge cards retrieved for this step (9):
- cs-living-room-family: Family living room 3 x 3 m: a gentle loop runner
- cs-museum-dinosaurs: Museum education about dinosaurs: a timeline walk
- cs-birthday-party: Birthday party in a garden: treasure walk race by turns
- pu-party-birthday-star: Birthday party: the birthday child is the star of the story
- un-example-full-vague-brief: Worked example: 'a fun ghost game for my kid's party' resolved in 5 questions
- sp-venue-living-room: Living room: small, furniture, 1-2 players
- sp-players-families: Mixed-age families: one route, two levels of challenge
- un-conflict-scary-for-young-kids: Scary but for 5-year-olds: offer spooky-cute, not fear
- sp-venue-garden: Garden or lawn: daylight, trees, uneven ground

```json
{
 "options": [
  {
   "axes": {
    "aesthetic": "discovery",
    "loop": "explore",
    "route": "loop",
    "social": "solo"
   },
   "confidence": "high",
   "core_loop": "เดินตามรอยไข่ไดโนเสาร์ แตะจุดหมายเพื่อเก็บไข่ทีละฟอง แล้วกลับมาฉลองที่เค้ก",
   "environment_fit": "ใช้พื้นที่ 3 × 3.5 เมตรเป็นวงเดินสั้น 4 จุด โดยเว้นจากโซฟาและขอบพื้นที่ ไม่ต้องมองขึ้นหรือวิ่ง ไฟบ้านสว่างทำให้สีสดของไดโนเสาร์และไข่มองเห็นชัด ฝั่งโซฟาเป็นฝั่งผู้ชมและเป็นทิศของเส้นชัย",
   "feelings": [
    "discovery",
    "sensation"
   ],
   "feelings_how": "ได้ค้นหาไข่และเจอไดโนเสาร์น่ารักขนาดเล็ก พร้อมช็อตเค้กและประตูฉลองตอนจบ",
   "genre": "runner",
   "lighting": "default",
   "mechanics": "เล่นคนเดียวผลัดกัน ไม่จับเวลา มี 4 จุดหมายเรียงลำดับ: “ตามรอยเท้า”, “เจอไข่สีเขียว”, “ช่วยไดโนเสาร์น้อย”, “นำไข่ไปที่รัง” มีแอ่งโคลนสีแดงนุ่มนวล 1 จุดหลังจุดหมายที่สอง เมื่อเหยียบจะกลับไปจุดหมายล่าสุด จากนั้นเดินเข้าประตูเค้กวันเกิดเพื่อจบ คะแนนมีไว้เป็นรางวัล ไม่จัดอันดับเด็ก",
   "pitch": "ผจญภัยเป็นเพื่อนไดโนเสาร์น้อย ตามหาไข่หายในห้องนั่งเล่นแล้วนำไปฉลองที่เค้กยักษ์ ทุกคนจบเกมได้ในรอบสั้น ๆ และได้เสียงเชียร์จากโซฟา",
   "players_fit": "เด็ก 5–6 ขวบที่เพิ่งใส่แว่นครั้งแรกเดินช้า ๆ ตามภาพใหญ่ชัดเจน ฟังผู้ใหญ่บอกทีละขั้น และไม่ต้องแข่งกับเพื่อน รอบละประมาณ 3 นาทีเหมาะกับการผลัดกัน 8 คน",
   "risks": [
    "เด็กอายุต่ำกว่า 10 ปีซึ่งเป็นช่วงอายุที่ Meta แนะนำสำหรับ Quest จึงต้องมีผู้ใหญ่ช่วยใส่แว่น ปรับสาย และเดินอยู่ใกล้ ๆ ตลอดรอบ",
    "พื้นที่เล็กทำให้ฉากไม่ใหญ่มาก และผู้ใหญ่ต้องช่วยดูไม่ให้เด็กรอต่อคิวเข้ามาในแนวเดิน"
   ],
   "route": "วงกลมสั้นรอบกลางพื้นที่ จบหันเข้าหาโซฟา",
   "scores": {
    "buildability": 5,
    "fun": 5,
    "mr_fit": 5,
    "players_fit": 5
   },
   "scores_why": {
    "buildability": "วงเดิน 4 จุด อุปสรรค 1 จุด และโมเดลไดโนเสาร์กับเค้กทำได้ตรงกับระบบเดิน",
    "fun": "การตามหาไข่และของฉลองตอนจบเข้ากับธีมวันเกิดและความอยากค้นหา",
    "mr_fit": "วงสั้นเหมาะกับพื้นที่ 3 × 3.5 เมตร และใช้โซฟาเป็นจุดชมโดยไม่บังทาง",
    "players_fit": "ไม่มีการต่อสู้หรือจับเวลา เด็กมือใหม่เดินช้า ๆ และจบได้พร้อมผู้ใหญ่ช่วย"
   },
   "sources": [
    "cs-living-room-family",
    "sp-venue-living-room",
    "cs-museum-dinosaurs",
    "pu-party-birthday-star"
   ],
   "spectator_view": "พ่อแม่และเด็กนั่งบนโซฟา เห็นผู้เล่นเดินตามรอย ก้าวเลี่ยงแอ่งโคลน และเข้าประตูเค้กซึ่งหันหาพวกเขา ช่วยเชียร์หรือบอกใบ้สั้น ๆ ได้โดยไม่เข้าไปในพื้นที่เล่น และเฉลิมฉลองทุกคนที่จบโดยไม่เปรียบเทียบอันดับ",
   "theme": "ไดโนเสาร์การ์ตูนตัวกลม สีเขียวมิ้นต์ เหลือง และส้ม พร้อมไข่ลายจุดและเค้กวันเกิด",
   "title": "ไดโนน้อยตามหาไข่วันเกิด",
   "why": "ตอบโจทย์ไดโนเสาร์น่ารักและงานวันเกิดโดยตรง ผ่านการเดินค้นหาที่เด็กมือใหม่ทำได้โดยไม่ต้องเรียนการต่อสู้หรือกฎซับซ้อน เส้นทางสั้น 4 จุดเหมาะกับห้องและเวลา 3 นาที ขณะที่ฉากจบหันไปหาผู้ชมทำให้ทุกคนร่วมฉลองได้"
  },
  {
   "axes": {
    "aesthetic": "sensation",
    "loop": "dodge",
    "route": "hub",
    "social": "solo"
   },
   "confidence": "medium",
   "core_loop": "ยืนตรงกลาง ฟันดาบของเล่นใส่ไดโนเสาร์ของเล่นที่เดินเข้ามา และก้าวออกจากวงแหวนเตือน",
   "environment_fit": "ใช้พื้นที่ทั้งหมดเป็นสนามยืนและก้าวสั้น ๆ โดยมีผู้เล่นอยู่กลางห้อง ไม่มีแนวเดินผ่านโซฟา สีสดอ่านง่ายในไฟบ้าน แต่พื้นที่ 3 × 3.5 เมตรค่อนข้างแคบสำหรับการเหวี่ยงคอนโทรลเลอร์และหลบวงแหวน",
   "feelings": [
    "sensation",
    "challenge"
   ],
   "feelings_how": "ดาบของเล่นและไดโนเสาร์จำนวนมากสร้างความตื่นตา ส่วนการก้าวหลบวงแหวนให้ช่วงเวลาตื่นเต้นแบบไม่น่ากลัว",
   "genre": "battle",
   "lighting": "default",
   "mechanics": "เล่นคนเดียวประมาณ 3 นาที คอนโทรลเลอร์ขวาเป็นดาบของเล่น ใช้ท่าฟันต่อเนื่อง 3 ครั้งและพุ่งสั้น บทแรกมีศัตรูตัวเล็กที่เป็นไดโนเสาร์ไขลาน บทที่สองเพิ่มศัตรูถือโล่แบบเปลือกไข่ จากนั้นสู้เจ้าตัวใหญ่ไดโนเสาร์ของเล่นที่ชาร์จช้า ๆ วงแหวนสีแดงเตือนให้ก้าวออกโดยไม่ต้องวิ่ง ไม่มีฉากเลือดหรือเสียงขู่",
   "pitch": "ห้องนั่งเล่นกลายเป็นสนามของเล่นไดโนเสาร์ เด็กถือดาบของเล่น ตีไดโนเสาร์ไขลานให้กลิ้งกลับไป และเผชิญหน้าเจ้าตัวใหญ่ยิ้มแย้มในฉากจบ",
   "players_fit": "เหมาะกับเด็กที่ชอบขยับตัวและภาพตื่นตามากกว่าการตามหา แต่ต้องให้ผู้ใหญ่สาธิตการถือคอนโทรลเลอร์และคอยประคอง เนื่องจากผู้เล่นอายุน้อยและไม่เคยใช้ VR",
   "risks": [
    "เด็กอายุต่ำกว่า 10 ปีซึ่งเป็นช่วงอายุที่ Meta แนะนำสำหรับ Quest และการฟันดาบในพื้นที่แคบเสี่ยงเหวี่ยงโดนคนหรือเฟอร์นิเจอร์ จึงต้องมีผู้ใหญ่คุมใกล้ชิดและจัดพื้นที่รอบตัวให้ว่าง",
    "กฎดาบ การหลบ และบอสหลายขั้นอาจยากเกินไปสำหรับเด็ก 5–6 ขวบที่ไม่เคยใส่แว่น จึงไม่ใช่ตัวเลือกที่ปลอดภัยและง่ายที่สุด"
   ],
   "route": "จุดยืนกลางห้อง ศัตรูเข้าจากขอบพื้นที่ และก้าวหลบรอบจุดเดิม",
   "scores": {
    "buildability": 4,
    "fun": 3,
    "mr_fit": 2,
    "players_fit": 2
   },
   "scores_why": {
    "buildability": "ใช้บท ศัตรู ดาบ วงแหวน และบอสที่ระบบต่อสู้มีอยู่ แต่ต้องปรับให้ช้ามาก",
    "fun": "ภาพไดโนเสาร์ของเล่นสนุก แต่ความยากอาจบดบังความน่ารักสำหรับเด็กกลุ่มนี้",
    "mr_fit": "พื้นที่ผ่านขั้นต่ำ แต่แคบสำหรับการฟันและหลบ และโซฟาทำให้ต้องระวังด้านหนึ่งเป็นพิเศษ",
    "players_fit": "เด็ก 5–6 ขวบมือใหม่ต้องเรียนการควบคุมหลายอย่างและต้องมีผู้ใหญ่ดูแลตลอด"
   },
   "sources": [
    "cs-living-room-family",
    "sp-venue-living-room",
    "un-conflict-scary-for-young-kids"
   ],
   "spectator_view": "ผู้ชมบนโซฟาเห็นผู้เล่นเหวี่ยงดาบของเล่นและก้าวหลบเป็นช่วง ๆ โดยเฉพาะตอนบอส ช่วยเรียกเตือนให้ชะลอและเชียร์ได้ แต่เด็กรอคิวต้องนั่งห่างจากระยะแขนผู้เล่น",
   "theme": "ไดโนเสาร์ของเล่นไขลานสีพาสเทล ดาบของเล่นขอบมน และเปลือกไข่เป็นโล่",
   "title": "สนามไดโนเสาร์ไขลาน",
   "why": "เป็นทางเลือกที่ให้ความรู้สึกตื่นตาและได้ขยับร่างกายมากกว่าการเดินสำรวจ ยังคงไดโนเสาร์น่ารักและไม่มีภาพน่ากลัว แต่การต่อสู้ในห้องเล็กกับเด็กมือใหม่มีข้อแลกเปลี่ยงชัดเจน จึงให้คะแนนความเหมาะสมต่ำกว่า"
  },
  {
   "axes": {
    "aesthetic": "challenge",
    "loop": "collect",
    "route": "zigzag",
    "social": "solo"
   },
   "confidence": "medium",
   "core_loop": "เดินเหมือนตัวหมากบนแผนที่ฟอสซิล เลือกช่องปลอดภัยเพื่อเก็บฟอสซิลตามลำดับ",
   "environment_fit": "วางกระดาน 6 × 8 ช่องบนพื้นจริง โดยย่อช่องให้พอดีห้องและไม่ล้ำไปถึงโซฟา ใช้ไฟบ้านช่วยให้ช่องและสีเตือนชัด แต่ช่องจะเล็กมากจนเด็กต้องก้าวสั้นและมองพื้นอย่างต่อเนื่อง",
   "feelings": [
    "discovery",
    "challenge"
   ],
   "feelings_how": "ได้เปิดเผยฟอสซิลทีละชิ้นและคิดเลือกทางเดิน โดยยามเป็นไดโนเสาร์ของเล่นที่เดินช้าเป็นจังหวะ",
   "genre": "tactics",
   "lighting": "default",
   "mechanics": "ผู้เล่นเป็นตัวหมากบนกระดาน 6 × 8 ช่อง มี 3 กระดานสั้น: ใช้เรือเก็บกระดูก 2 ชิ้น ใช้ม้าข้ามหลุมขุด และใช้บิชอปนำฟอสซิลไปที่รังไข่ เป้าหมายต้องเก็บตามลำดับ ยามเดินทุก 4 วินาทีและช่องที่ยามจะโจมตีมีสีเตือน มีช่องแตกร้าวและโต๊ะขุดเป็นอุปสรรค ไม่มีการจับเวลา",
   "pitch": "กลายเป็นหมากนักสำรวจตัวจิ๋ว เดินไต่กระดานขุดฟอสซิล หลบไดโนเสาร์ยามของเล่น และประกอบโครงกระดูกให้สมบูรณ์",
   "players_fit": "เหมาะกับเด็กที่ชอบไขปริศนาทีละขั้นและไม่รีบ ผู้ใหญ่สามารถชี้ช่องถัดไปช่วยได้ แต่ต้องอธิบายท่าเดินของหมากใหม่ทุกกระดาน",
   "risks": [
    "เด็กอายุต่ำกว่า 10 ปีซึ่งเป็นช่วงอายุที่ Meta แนะนำสำหรับ Quest ต้องมีผู้ใหญ่ช่วยใส่แว่นและชี้ทางตลอดการเล่น",
    "ช่องหมากขนาดเล็กมากในพื้นที่ 3 × 3.5 เมตร และกฎการเดินของเรือ ม้า บิชอปอาจยากสำหรับเด็ก 5–6 ขวบ ทำให้รอบเกิน 3 นาทีได้"
   ],
   "route": "กระดานย่อส่วน เส้นทางเดินหมากซิกแซกจากมุมเริ่มไปยังรังไข่",
   "scores": {
    "buildability": 4,
    "fun": 3,
    "mr_fit": 2,
    "players_fit": 2
   },
   "scores_why": {
    "buildability": "กระดาน 3 แบบและเป้าหมายตามลำดับสร้างได้ แต่ต้องออกแบบให้สั้นและง่ายเป็นพิเศษ",
    "fun": "การเก็บฟอสซิลน่าสนใจ แต่จังหวะคิดหมากอาจไม่ให้ความตื่นตาเท่าการพบไดโนเสาร์",
    "mr_fit": "กระดาน 6 × 8 ช่องในห้องนี้ทำให้ช่องเล็กและเหมาะกับการก้าวของเด็กน้อย",
    "players_fit": "ต้องเข้าใจหมากหลายชนิดและรอจังหวะยาม จึงยากสำหรับอายุและประสบการณ์ของผู้เล่น"
   },
   "sources": [
    "cs-living-room-family",
    "cs-museum-dinosaurs",
    "sp-venue-living-room"
   ],
   "spectator_view": "ผู้ชมบนโซฟาเห็นเด็กก้าวทีละช่อง หยุดคิด และเปลี่ยนทิศตามจังหวะยาม พ่อแม่ช่วยถามว่าช่องไหนปลอดภัยหรือชี้เป้าหมายถัดไปได้โดยไม่เหยียบเข้ากระดาน",
   "theme": "สนามขุดฟอสซิลของเล่นสีทรายอ่อน กระดูกสีครีม ไข่สีฟ้า และยามไดโนเสาร์หุ่นยนต์ยิ้ม",
   "title": "หมากนักขุดฟอสซิล",
   "why": "เปลี่ยนความค้นพบเป็นเกมคิดทางเดินที่ต่างจากการตามหาไข่และการต่อสู้อย่างชัดเจน ธีมฟอสซิลยังเชื่อมกับไดโนเสาร์น่ารัก แต่ขนาดช่องและกฎหมากทำให้เหมาะกับเด็กโตกว่ากลุ่มนี้มากกว่า"
  }
 ],
 "recommend": 0,
 "recommend_why": "แนะนำ “ไดโนน้อยตามหาไข่วันเกิด” เพราะเด็กมือใหม่เดินช้า ๆ แล้วจบได้ในห้องเล็กอย่างปลอดภัย ทั้งยังให้ความค้นพบ ความน่ารัก และช่วงฉลองร่วมกับผู้ชมครบที่สุดค่ะ"
}
```

## Creator: picks an option

Option 1 (the option the AI recommended; this step was automatic so both runs are treated the same).

## AI designer: playable prototype plan

Knowledge cards retrieved for this step (9):
- pu-party-birthday-star: Birthday party: the birthday child is the star of the story
- cs-museum-dinosaurs: Museum education about dinosaurs: a timeline walk
- cs-birthday-party: Birthday party in a garden: treasure walk race by turns
- cs-garden-morning-kids: Garden in the morning: dinosaur egg hunt walk
- un-example-full-vague-brief: Worked example: 'a fun ghost game for my kid's party' resolved in 5 questions
- cu-dinosaurs-museum: Dinosaurs and museums: discovery with a roar
- pt-pal-toy-room: Toy room: primary blue, block yellow, play green, cream
- pt-pal-jungle-dino: Jungle dinosaur: canopy green, mud brown, fern lime
- pu-family-day-cross-gen: Family day: grandparents and grandchildren play together

```json
{
 "title": "ไดโนน้อยตามหาไข่วันเกิด",
 "logline": "คุณคือเพื่อนไดโนเสาร์น้อย เดินตามรอยเท้าเพื่อหาไข่ที่หายไป ช่วยนำไข่กลับรัง แล้วเข้าประตูเค้กยักษ์ให้ทุกคนบนโซฟาร่วมฉลอง",
 "pillars": [
  "ค้นหาง่ายด้วยภาพใหญ่และทีละขั้น",
  "น่ารัก สดใส ไม่น่ากลัวและไม่ต้องรีบ",
  "จบทุกรอบด้วยการฉลองร่วมกับครอบครัว"
 ],
 "art": {
  "style": "โลว์โพลี 3 มิติแบบของเล่น ขอบมน สีทึบ ไดโนเสาร์ตัวกลมตาโต ไข่ลายจุดและเค้กชิ้นใหญ่",
  "mood": "อบอุ่น ร่าเริง สดใสเหมือนงานวันเกิดของเล่น ไม่มีฉากตกใจ",
  "prompt_style": "Cute rounded low-poly flat-shaded 3D toy dinosaurs, giant spotted eggs and birthday cake, warm playful indoor party mood, bright toy colours, soft simple shapes, no frightening details",
  "palette": [
   "#2b6cff",
   "#ffc93c",
   "#3ccf6e",
   "#fff6e5",
   "#ff1f3d"
  ],
  "palette_names": [
   "น้ำเงินบล็อกของเล่น",
   "เหลืองบล็อกของเล่น",
   "เขียวสนามเล่น",
   "ครีมห้องเด็ก",
   "แดงเตือนอันตราย"
  ]
 },
 "key_art": {
  "caption": "ไดโนน้อยยิ้มรอรับไข่ ข้างประตูเค้กวันเกิดที่หันไปหาครอบครัวบนโซฟา",
  "prompt": "One in-game frame seen through a mixed-reality headset in a bright real living room: real walls, ceiling light and a sofa with seated family silhouettes remain visible, while only the clear floor becomes a colourful toy-like prehistoric patch. First-person child-height view facing a small rounded smiling green dinosaur beside a giant spotted egg and an open glowing birthday-cake portal. A short dotted footprint trail curves across the floor; one soft red circular mud hazard sits off the safe path. Low-poly flat-shaded models, vivid blue yellow green and cream, warm afternoon indoor light, friendly composition, generous clear walking space, no text, no logos, no UI words."
 },
 "storyboard": [
  {
   "beat": "start",
   "title": "ตามรอยเท้า",
   "caption": "รอยเท้าสีสดโผล่บนพื้นห้องจริง และไดโนเสาร์น้อยตัวกลมยืนรออย่างเป็นมิตร",
   "player_does": "ยืนที่จุดเริ่มกับผู้ใหญ่ แล้วเดินช้า ๆ ตามรอยเท้าไปแตะจุดหมายแรก"
  },
  {
   "beat": "middle",
   "title": "เจอไข่และเพื่อนตัวน้อย",
   "caption": "พบไข่สีเขียวลายจุด จากนั้นมีแอ่งโคลนสีแดงนุ่มนวลกั้นทางแคบ ๆ ก่อนถึงเพื่อนไดโนเสาร์",
   "player_does": "แตะเก็บไข่ มองวงแดงแล้วเดินอ้อม จากนั้นไปแตะจุดช่วยไดโนเสาร์น้อย"
  },
  {
   "beat": "climax",
   "title": "นำไข่กลับรัง",
   "caption": "รังใบใหญ่และไดโนเสาร์ครอบครัวปรากฏข้างทางเดิน พร้อมเค้กวันเกิดที่มองเห็นจากโซฟา",
   "player_does": "เดินไปแตะจุดหมายสุดท้ายเพื่อนำไข่เข้ารัง โดยไม่ต้องรีบหรือมองขึ้น"
  },
  {
   "beat": "end",
   "title": "ฉลองที่เค้กยักษ์",
   "caption": "ประตูเค้กเปิดหันเข้าหาโซฟา ไดโนเสาร์ยืนอยู่ข้างฉากจบให้ทุกคนเห็นผู้เล่นเดินเข้าประตู",
   "player_does": "เดินเข้าประตูเค้ก รับคำยินดีและเสียงเชียร์ แล้วให้ผู้ใหญ่ช่วยถอดแว่นเพื่อผลัดคนต่อไป"
  }
 ],
 "hud": [
  "จุดหมายถัดไปและข้อความสั้น เช่น “เจอไข่สีเขียว”",
  "จำนวนจุดที่ทำแล้ว เช่น 2 จาก 4",
  "คะแนนเป็นรางวัลเล็ก ๆ โดยไม่มีอันดับ",
  "ไม่มีนาฬิกาจับเวลา",
  "ข้อความอ่อนโยนเมื่อเหยียบโคลนและกลับจุดล่าสุด"
 ],
 "flow": [
  {
   "t": "0:00",
   "what": "ผู้ใหญ่ช่วยใส่แว่นและยืนใกล้ผู้เล่น การ์ดเรื่องสั้นบอกให้ตามหาไข่และไปที่เค้ก"
  },
  {
   "t": "0:25",
   "what": "เดินจากจุดเริ่มตามรอยเท้า แตะจุด “ตามรอยเท้า” และเห็นทางโค้งชัดเจน"
  },
  {
   "t": "0:55",
   "what": "แตะจุด “เจอไข่สีเขียว” แล้วเดินอ้อมแอ่งโคลนแดงหนึ่งจุด"
  },
  {
   "t": "1:25",
   "what": "แตะจุด “ช่วยไดโนเสาร์น้อย” และเดินต่อไปยังรัง"
  },
  {
   "t": "1:55",
   "what": "แตะจุด “นำไข่ไปที่รัง” ฉากเค้กและประตูฉลองเด่นขึ้นฝั่งโซฟา"
  },
  {
   "t": "2:20",
   "what": "เดินเข้าประตูเค้ก จบเกมและรับเสียงเชียร์จากผู้ชม"
  },
  {
   "t": "3:00",
   "what": "ผู้ใหญ่ช่วยออกจากพื้นที่และเตรียมผลัดให้เด็กคนถัดไป"
  }
 ],
 "sketch": {
  "shape": "route",
  "path": [
   [
    0.28,
    0.7
   ],
   [
    0.25,
    0.43
   ],
   [
    0.45,
    0.25
   ],
   [
    0.68,
    0.4
   ],
   [
    0.72,
    0.68
   ],
   [
    0.5,
    0.78
   ]
  ],
  "zones": [
   {
    "name": "จุดเริ่มและผู้ใหญ่คอยช่วย",
    "x": 0.28,
    "y": 0.7,
    "kind": "start",
    "r": 0.09
   },
   {
    "name": "รอยเท้าแรก",
    "x": 0.25,
    "y": 0.43,
    "kind": "story",
    "r": 0.08
   },
   {
    "name": "ไข่สีเขียว",
    "x": 0.45,
    "y": 0.25,
    "kind": "story",
    "r": 0.09
   },
   {
    "name": "แอ่งโคลนแดง",
    "x": 0.53,
    "y": 0.39,
    "kind": "danger",
    "r": 0.07
   },
   {
    "name": "ไดโนเสาร์น้อย",
    "x": 0.68,
    "y": 0.4,
    "kind": "story",
    "r": 0.09
   },
   {
    "name": "รังไข่",
    "x": 0.72,
    "y": 0.68,
    "kind": "story",
    "r": 0.09
   },
   {
    "name": "ประตูเค้กวันเกิด",
    "x": 0.5,
    "y": 0.78,
    "kind": "goal",
    "r": 0.11
   },
   {
    "name": "โซฟาพ่อแม่และเพื่อน ๆ",
    "x": 0.5,
    "y": 0.94,
    "kind": "audience",
    "r": 0.16
   }
  ]
 },
 "test_questions": [
  "เด็ก 5–6 ขวบที่ใส่แว่นครั้งแรกเข้าใจว่าต้องเดินไปจุดถัดไปโดยผู้ใหญ่บอกเพียงทีละขั้นหรือไม่",
  "เด็กมองเห็นแอ่งโคลนสีแดงและเดินอ้อมได้โดยไม่รีบหรือสะดุดในพื้นที่ 3 × 3.5 เมตรหรือไม่",
  "ทางเดินกว้างและห่างขอบพอให้ผู้ใหญ่เดินประกบได้โดยไม่บังผู้ชมบนโซฟาหรือไม่",
  "ผู้ชมบนโซฟาเห็นช่วงเลี่ยงโคลนและช่วงเข้าประตูเค้กชัดพอที่จะเชียร์ทุกรอบหรือไม่"
 ],
 "decisions": [
  {
   "what": "ธีมและโอกาสของเกม",
   "choice": "ไดโนเสาร์น่ารักในงานวันเกิด เดินตามหาไข่แล้วจบที่เค้ก",
   "by": "creator",
   "quote": "เกมไดโนเสาร์น่ารัก งานวันเกิดลูก"
  },
  {
   "what": "รูปแบบการเล่นและเวลา",
   "choice": "เล่นคนเดียวผลัดกัน รอบละประมาณ 3 นาที ไม่จับเวลาและไม่จัดอันดับ",
   "by": "option"
  },
  {
   "what": "เส้นทางและจุดหมาย",
   "choice": "วงเดินสั้น 4 จุดเรียงลำดับ ได้แก่ ตามรอยเท้า เจอไข่สีเขียว ช่วยไดโนเสาร์น้อย นำไข่ไปที่รัง แล้วเข้าประตูเค้ก",
   "by": "option"
  },
  {
   "what": "ระดับความน่ากลัว",
   "choice": "ไม่มีฉากไล่ล่า เสียงตกใจ แสงสยอง หรือพื้นหลุม ไดโนเสาร์ทุกตัวยิ้มและอยู่ข้างทาง",
   "by": "creator",
   "quote": "ห้ามน่ากลัว"
  },
  {
   "what": "สีของฉากและอุปสรรค",
   "choice": "ใช้ชุดสีของเล่นน้ำเงิน เหลือง เขียว และครีม โดยเก็บสีแดงไว้เฉพาะแอ่งโคลนเพื่อให้เด็กแยกอันตรายได้ทันที",
   "by": "card",
   "card": "pt-pal-toy-room"
  },
  {
   "what": "การจัดวางไดโนเสาร์",
   "choice": "วางโมเดลไดโนเสาร์ข้างเส้นทางเป็นฉากให้ค้นพบ ไม่วางบนทางเดินและไม่ให้ไล่ผู้เล่น",
   "by": "card",
   "card": "cu-dinosaurs-museum"
  },
  {
   "what": "ช่วงฉลองและผู้ชม",
   "choice": "ประตูเค้กหันเข้าหาโซฟา ฉลองทุกคนที่จบโดยไม่เปรียบเทียบคะแนนหรืออันดับ",
   "by": "card",
   "card": "pu-party-birthday-star"
  },
  {
   "what": "การช่วยเหลือผู้เล่นอายุน้อย",
   "choice": "มีผู้ใหญ่ช่วยใส่แว่น ปรับสาย และเดินอยู่ใกล้ตลอดรอบ เพราะผู้เล่นอายุต่ำกว่าช่วงที่ Meta แนะนำสำหรับ Quest",
   "by": "default"
  },
  {
   "what": "ผลของการเหยียบแอ่งโคลน",
   "choice": "หัก 25 คะแนนและส่งกลับจุดหมายล่าสุด โดยยังเล่นต่อและจบเกมได้ ไม่มีการแพ้",
   "by": "engine"
  },
  {
   "what": "คะแนนเมื่อเล่นจบ",
   "choice": "จุดหมายแต่ละจุดให้ 100 คะแนน การเข้าประตูให้ 300 คะแนนและโบนัสเวลา แต่ HUD เน้นรางวัลไม่เน้นการแข่งขัน",
   "by": "engine"
  }
 ]
}
```

## Creator: approves the prototype

Approved without changes (automatic).

## AI designer: final build plan

Knowledge cards retrieved for this step (6):
- cs-museum-dinosaurs: Museum education about dinosaurs: a timeline walk
- cs-birthday-party: Birthday party in a garden: treasure walk race by turns
- pu-party-birthday-star: Birthday party: the birthday child is the star of the story
- cs-living-room-family: Family living room 3 x 3 m: a gentle loop runner
- cu-dinosaurs-museum: Dinosaurs and museums: discovery with a roar
- un-example-full-vague-brief: Worked example: 'a fun ghost game for my kid's party' resolved in 5 questions

```json
{
 "description": "เดินตามรอยเท้า ตามหาไข่ไดโนเสาร์น้อยแล้วนำกลับรัง ก่อนฉลองวันเกิดที่ประตูเค้กยักษ์",
 "game": {
  "goal": "เดินแตะจุดหมายทั้ง 4 จุดตามลำดับ นำไข่กลับรัง แล้วเข้าประตูเค้กวันเกิด",
  "rules": [
   "เล่นทีละ 1 คน โดยมีผู้ใหญ่ช่วยใส่แว่นและอยู่ใกล้ตลอดรอบ",
   "เดินช้า ๆ ตามรอยเท้า และแตะจุดหมายให้ครบ 4 จุดตามลำดับ",
   "อย่าเหยียบแอ่งโคลนสีแดง ถ้าเหยียบจะเสีย 25 คะแนนและกลับไปจุดหมายล่าสุด แต่เล่นต่อได้",
   "เมื่อนำไข่ไปที่รังแล้ว ให้เดินเข้าประตูเค้กเพื่อจบเกมและรับเสียงเชียร์",
   "ไม่มีเวลาจับและไม่จัดอันดับ ทุกคนที่เล่นจบได้รับการฉลอง"
  ],
  "story": "ไข่วันเกิดของไดโนเสาร์น้อยหายไปในห้องนั่งเล่น! เดินตามรอยเท้าสีสดเพื่อช่วยตามหาไข่ แล้วพาเพื่อนตัวน้อยนำไข่กลับรัง เมื่อสำเร็จ เค้กยักษ์และประตูฉลองจะรอให้ทุกคนบนโซฟาร่วมยินดีกับคุณ",
  "timeLimit": null,
  "title": "ไดโนน้อยตามหาไข่วันเกิด"
 },
 "layout_brief": "MR runner for a bright 3 x 3.5 m indoor living room, with the real room, afternoon light, walls, and spectators remaining visible and only the floor replaced. The real sofa is along the spectator side and is an obstacle: keep it and all other real edges outside the route. Build a short clockwise loop matching the approved sketch: spawn near the lower-left, first checkpoint upper-left, second near the top centre, third at middle-right, fourth lower-right, and the finish portal near the sofa side. Use exactly 4 ordered checkpoints with these Thai labels: 1) “ตามรอยเท้า” 2) “เจอไข่สีเขียว” 3) “ช่วยไดโนเสาร์น้อย” 4) “นำไข่ไปที่รัง”. Place one small soft red mud-puddle hazard on the narrow route between checkpoints 2 and 3, with an obvious, comfortable walking bypass; no other hazards. Use large colourful footprints, a giant green spotted egg, one friendly round baby dinosaur beside checkpoint 3, a large nest with a friendly dinosaur family beside checkpoint 4, and a giant birthday-cake portal as the finish. All dinosaurs are smiling static vignettes beside, never on, the walking path; no chases, surprises, scary scenery, or void floor. Use rounded flat-shaded low-poly toy shapes and blue #2b6cff, yellow #ffc93c, green #3ccf6e, and cream #fff6e5; reserve red #ff1f3d for the mud hazard. Keep the route clear, models away from walking lines, and props at least 0.6 m from the playable edge where possible. From spawn, the first footprints and friendly baby dinosaur must be immediately readable. Spectators sit on the sofa side; place the mud dodge and the cake portal where they can clearly see the player's body, and orient the portal toward the sofa for the shared celebration.",
 "lighting": "default",
 "name": "ไดโนน้อยตามหาไข่วันเกิด",
 "spectator_plan": "พ่อแม่และเด็ก ๆ นั่งชมจากโซฟาโดยไม่เข้ามาในแนวเดิน จะเห็นผู้เล่นเดินอ้อมแอ่งโคลนและเดินเข้าประตูเค้กที่หันเข้าหาโซฟา ช่วยเชียร์หรือบอกใบ้สั้น ๆ ได้ และร่วมปรบมือฉลองทุกคนที่เล่นจบโดยไม่เปรียบเทียบอันดับ"
}
```
