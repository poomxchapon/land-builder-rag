# b04-thai-ghost-teens · WITH the knowledge base (RAG)

Model: Kimi K3.1 Pro. Same brief and same steps in both runs. The system prompts were not saved; this is the creator input and every AI output, in order.

## Creator: the game brief

```json
{
 "platform": "mr",
 "concept": "บ้านผีไทย แม่นาค ปล่อยวิญญาณ",
 "players": "วัยรุ่น ม.ปลาย",
 "group_size": "ทีละ 2 คน",
 "vr_experience": "เคยเล่น",
 "feelings": [
  "fantasy",
  "challenge"
 ],
 "venue": "space",
 "width_m": 6,
 "depth_m": 8,
 "indoor": true,
 "obstacles": "เสา 1 ต้นตรงกลาง",
 "environment": "ห้องประชุมปิดไฟมืด",
 "time_of_day": "กลางคืน",
 "session_minutes": 5,
 "play_mode": "race",
 "constraints": "ไม่เอาจัมพ์สแกร์ที่ทำให้วิ่ง",
 "spectators": "เพื่อนยืนดูหลังห้อง"
}
```

## AI designer: three game options

Knowledge cards retrieved for this step (9):
- cs-haunted-night-teens: Haunted night event for teens: slow-dread story walk
- cs-thai-folklore-adults: Thai folklore for adults: original spirits, respectful setting
- cs-couple-date: Two players at home: shared floor date night
- un-example-full-vague-brief: Worked example: 'a fun ghost game for my kid's party' resolved in 5 questions
- cu-thai-ghost-tone-scale: Thai ghosts / ผีไทย: set the scare level by age before picking a spirit
- un-word-scary: 'Scary' or 'น่ากลัว': spooky-fun, tense, or real horror
- gn-cross-example-one-world: One brief, three genres: "Thai temple spirits" for a school group
- sp-venue-hall: Hall or function room: big, indoor, good for groups
- gn-runner-tiny-room: Under 3 x 3 m in MR, all three options are runners

```json
{
 "options": [
  {
   "title": "คมดาบปลดวิญญาณ",
   "pitch": "คุณคือผู้ถือดาบที่เข้าสู่หมู่บ้านของแม่นาค เพื่อส่งวิญญาณที่หลงทางกลับสู่ความสงบ ก่อนเผชิญหน้ากับแม่นาคในบทสุดท้าย ความหลอนมาจากบรรยากาศและการเผยตัวช้า ๆ ไม่ใช่เสียงหรือภาพกระตุกให้วิ่ง",
   "core_loop": "อ่านวงเตือนบนพื้น ก้าวหลบ แล้วเหวี่ยงคอนโทรลเลอร์ขวาเป็นดาบเพื่อปลดปล่อยวิญญาณ",
   "mechanics": "3 บทและบอสแม่นาค รวมประมาณ 5 นาที: บทแรกมีศัตรูตัวเล็กเดินช้าเข้ามา บทสองเพิ่มศัตรูถือโล่ บทสามเพิ่มเจ้าตัวใหญ่ จากนั้นสู้บอส ผู้เล่นหลบวงแดงใต้เท้าโดยก้าวออก ไม่ต้องวิ่ง ทั้งสองคนเล่นพร้อมกันในพื้นที่สำเนาของตัวเองและแข่งคะแนนกับเวลาบนกระดานผู้นำ",
   "feelings": [
    "fantasy",
    "challenge"
   ],
   "feelings_how": "ได้สวมบทนักดาบผู้ช่วยวิญญาณ และใช้ทั้งการฟัน การหลบ และการอ่านจังหวะศัตรู",
   "environment_fit": "แสงมืดของห้องช่วยให้โทนลึกลับและเงาวิญญาณอ่านง่าย ศัตรูเข้ามาจากรอบพื้นที่โดยเว้นเขตปลอดภัยจากผนังและเสาตรงกลาง ไม่มีวิญญาณหรือวงเตือนทับเสา และไม่มีจัมพ์สแกร์",
   "players_fit": "เหมาะกับวัยรุ่นที่เคยเล่น VR และต้องการความท้าทายแบบใช้ร่างกาย โดยสองคนแข่งกันได้โดยไม่ต้องเดินชนกันในพื้นที่จริง",
   "theme": "หมู่บ้านไทยยามคืนในโทนมืด วิญญาณเรือนร่างและแม่นาคเป็นตัวละครโลว์โพลี",
   "lighting": "spooky",
   "route": "สนามวงกลมหลายจุดรอบตัวผู้เล่น เว้นเสาตรงกลางไว้นอกเส้นทางเคลื่อนที่",
   "risks": [
    "การต่อสู้หลายบทใน 5 นาทีอาจตึงสำหรับผู้ที่หลบวงแดงไม่ทัน",
    "เสาตรงกลางลดพื้นที่หลบ จึงต้องจัดจุดเกิดศัตรูและวงเตือนอย่างระมัดระวัง"
   ],
   "axes": {
    "aesthetic": "challenge",
    "loop": "dodge",
    "social": "race",
    "route": "hub"
   },
   "spectator_view": "เพื่อนที่หลังห้องเห็นผู้เล่นเหวี่ยงดาบและก้าวหลบเป็นจังหวะ โดยเฉพาะฉากบอสที่หันจุดสำคัญเข้าหาฝั่งผู้ชม และช่วยเชียร์หรือดูกระดานผู้นำได้",
   "scores": {
    "fun": 5,
    "mr_fit": 4,
    "players_fit": 5,
    "buildability": 4
   },
   "scores_why": {
    "fun": "การใช้ดาบจริงและการแข่งกับเพื่อนตอบโจทย์ทั้งบทบาทและความท้าทาย",
    "mr_fit": "ห้องมืดเหมาะกับบรรยากาศ แต่เสาตรงกลางทำให้ต้องจำกัดตำแหน่งการหลบ",
    "players_fit": "วัยรุ่นที่เคยเล่น VR น่าจะเรียนรู้การฟันและหลบได้เร็ว",
    "buildability": "ใช้ระบบศัตรู บท และบอสที่มีอยู่ แต่ต้องทดสอบความปลอดภัยรอบเสาหลายครั้ง"
   },
   "confidence": "medium",
   "why": "ตัวเลือกนี้เปลี่ยนแนวคิดบ้านผีให้กลายเป็นบทบาทนักดาบที่ลงมือจริง จึงเด่นเรื่องความท้าทายมากที่สุด การใช้พื้นที่สำเนาทำให้คนสองคนแข่งกันได้โดยไม่ต้องใช้เส้นทางเดินไขว้กัน ส่วนความหลอนสร้างจากแสงและการเผยตัวช้า ๆ ตามข้อจำกัดที่ให้ไว้",
   "sources": [
    "cs-haunted-night-teens",
    "cu-thai-ghost-tone-scale",
    "gn-cross-example-one-world"
   ],
   "genre": "battle",
   "why_not": "",
   "spectator_notes": ""
  },
  {
   "title": "หมากวิญญาณแม่นาค",
   "pitch": "คุณกลายเป็นหมากตัวจริงบนกระดานยักษ์ในหมู่บ้านของแม่นาค คิดเส้นทางเพื่อเก็บวิญญาณตามลำดับโดยไม่ยืนในช่องที่ยามวิญญาณจ้องอยู่ ใครไขกระดานเร็วและแม่นกว่าจะขึ้นกระดานผู้นำ",
   "core_loop": "ดูจังหวะยาม วางแผนช่องถัดไป แล้วเดินไปเก็บวิญญาณตามลำดับให้ครบ",
   "mechanics": "3 กระดานขนาด 6 x 8 ช่อง ปรับขนาดช่องให้พอดีพื้นที่จริง: เริ่มด้วยเรือ ต่อด้วยม้า และจบด้วยบิชอป แต่ละกระดานมีวิญญาณให้เก็บตามลำดับ ยามเคลื่อนที่ทุก 3 วินาทีหรือช้ากว่า ช่องแตกและโต๊ะเป็นอุปสรรค ระบบสร้างและพิสูจน์ว่าแต่ละกระดานแก้ได้ สองคนเล่นสำเนาของตัวเองและแข่งเวลารวมประมาณ 5 นาที",
   "feelings": [
    "fantasy",
    "challenge"
   ],
   "feelings_how": "ผู้เล่นมีบทบาทเป็นหมากผู้ปลดวิญญาณ และความท้าทายมาจากการคิดล่วงหน้ากับการเดินให้ตรงแผน",
   "environment_fit": "กระดานวางบนพื้นจริงโดยเว้นรอบเสาและขอบห้อง ช่องเดินไม่ทับเสา ส่วนวิญญาณตั้งโชว์ด้านข้างห่างเส้นเดินอย่างน้อย 1.5 เมตร แสงมืดและสีพื้นกระดานช่วยสร้างความลึกลับโดยไม่มีภาพกระตุก",
   "players_fit": "เหมาะกับผู้เล่นที่เคยใช้ VR และอยากแข่งด้วยสมองมากกว่าความเร็วร่างกาย รอบสั้นหลายกระดานทำให้เพื่อนลุ้นเวลากันได้",
   "theme": "หมู่บ้านไทยลึกลับ กระดานหินเรืองแสงอ่อนและวิญญาณสีฟ้าเขียว",
   "lighting": "spooky",
   "route": "เส้นทางหมากแบบซิกแซกบนกระดาน เปลี่ยนจุดเริ่มและเป้าหมายในแต่ละกระดาน",
   "risks": [
    "ผู้เล่นสองคนอาจแก้กระดานเร็วต่างกันมาก ทำให้ผู้ที่เสร็จก่อนต้องรอ",
    "การอ่านช่องถูกโจมตีและตำแหน่งเสาพร้อมกันต้องทดสอบก่อนเล่นจริง"
   ],
   "axes": {
    "aesthetic": "challenge",
    "loop": "collect",
    "social": "race",
    "route": "zigzag"
   },
   "spectator_view": "เพื่อนที่หลังห้องเห็นผู้เล่นหยุดคิด เดินเปลี่ยนช่อง และหลบยามตามจังหวะ จึงช่วยเชียร์หรือบอกจังหวะจากด้านนอกได้ โดยไม่ต้องเข้าไปในพื้นที่เล่น",
   "scores": {
    "fun": 4,
    "mr_fit": 4,
    "players_fit": 4,
    "buildability": 4
   },
   "scores_why": {
    "fun": "การแข่งไขกระดานให้ความท้าทายชัดเจน แต่ไม่มีความตื่นเต้นจากการใช้ดาบ",
    "mr_fit": "การเดินเป็นหมากใช้พื้นจริงได้ดี แม้เสาจะจำกัดตำแหน่งวางกระดาน",
    "players_fit": "เหมาะกับวัยรุ่นที่ชอบวางแผน แต่ความยากอาจต่างกันระหว่างผู้เล่น",
    "buildability": "ระบบสร้างกระดานและพิสูจน์คำตอบให้ แต่ต้องปรับสามกระดานให้จบใน 5 นาที"
   },
   "confidence": "medium",
   "why": "ตัวเลือกนี้เก็บโลกแม่นาคไว้ แต่เปลี่ยนความท้าทายจากปฏิกิริยาเป็นการวางแผน จึงให้ประสบการณ์ต่างจากเกมดาบอย่างชัดเจน กระดานที่ระบบพิสูจน์ว่าแก้ได้ช่วยให้การแข่งยุติธรรม และจังหวะยามที่ช้าพอสอดคล้องกับการไม่ให้ผู้เล่นวิ่ง",
   "sources": [
    "gn-cross-example-one-world",
    "cu-thai-ghost-tone-scale"
   ],
   "genre": "tactics",
   "why_not": "",
   "spectator_notes": ""
  },
  {
   "title": "แม่นาค: ทางกลับของวิญญาณ",
   "pitch": "เดินผ่านหมู่บ้านร้างเพื่อรวบรวมวิญญาณหลงทางและเปิดทางให้แม่นาคปล่อยพวกเขาไปสู่รุ่งเช้า เป็นการแข่งเดินอ่านเรื่อง หลบพื้นต้องคำสาป และเลือกจังหวะให้แม่นกว่าอีกคน",
   "core_loop": "เดินแตะจุดเล่าเรื่องตามลำดับ หลบพื้นต้องคำสาป แล้วไปยังประตูวิญญาณให้เร็วที่สุด",
   "mechanics": "เส้นทาง 6 จุด: 1) เปิดประตูบ้าน 2) ตามเสียงร้องไห้ 3) รวบรวมวิญญาณแรก 4) ผ่านสวนต้องคำสาป 5) คืนวิญญาณให้แม่นาค 6) เปิดทางสู่รุ่งเช้า จากนั้นเข้าประตูจบ วงแดงคือพื้นต้องคำสาป เมื่อเหยียบจะกลับไปจุดล่าสุด คะแนนจากจุดตรวจ เวลา และการจบ สองคนเดินในสำเนาของตัวเองพร้อมกระดานผู้นำ รอบประมาณ 5 นาที",
   "feelings": [
    "fantasy",
    "challenge"
   ],
   "feelings_how": "ผู้เล่นมีบทบาทเป็นผู้ช่วยแม่นาคในเรื่องที่ค่อย ๆ เปิดเผย และแข่งกันเดินให้ถูกทางโดยไม่พลาดพื้นต้องคำสาป",
   "environment_fit": "เส้นทางซิกแซกกว้างอย่างน้อย 1.2 เมตร อ้อมเสาตรงกลางและห่างขอบพื้นที่อย่างน้อย 0.6 เมตร ใช้ผนังมืดเป็นขอบหมู่บ้าน วางผีด้านข้างห่างเส้นเดินอย่างน้อย 1.5 เมตร และจัดประตูจบหันหลังห้องให้เพื่อนเห็น",
   "players_fit": "กติกาเข้าใจง่ายสำหรับคนเคยเล่น VR แต่ยังมีความท้าทายจากเวลาและการหลบ เหมาะกับการแข่งสองคนโดยไม่ต้องอยู่ในเส้นทางจริงเส้นเดียวกัน",
   "theme": "หมู่บ้านไทยร้าง หมอกเรือนร่าง แสงฟ้าเย็น และประตูรุ่งเช้าตอนจบ",
   "lighting": "spooky",
   "route": "วงกลมอ้อมเสาตรงกลาง เริ่มด้านหน้าและจบที่ประตูซึ่งหันไปทางหลังห้อง",
   "risks": [
    "เรื่องเล่าต้องกระชับเพราะผู้เล่นที่แข่งเวลาอาจไม่หยุดอ่านป้ายนาน",
    "ถ้าพื้นต้องคำสาปมากเกินไป การถอยกลับจุดล่าสุดจะทำให้รอบ 5 นาทีหงุดหงิด"
   ],
   "axes": {
    "aesthetic": "fantasy",
    "loop": "escape",
    "social": "race",
    "route": "loop"
   },
   "spectator_view": "เพื่อนที่หลังห้องเห็นจังหวะหลบพื้นต้องคำสาปในสวนและการเดินเข้าประตูรุ่งเช้าอย่างชัดเจน ช่วยเชียร์และลุ้นอันดับบนกระดานผู้นำได้โดยไม่เข้าเส้นทาง",
   "scores": {
    "fun": 4,
    "mr_fit": 5,
    "players_fit": 5,
    "buildability": 5
   },
   "scores_why": {
    "fun": "เรื่องและการแข่งสร้างแรงจูงใจดี แม้ความตื่นเต้นทางร่างกายจะน้อยกว่าเกมดาบ",
    "mr_fit": "ห้องมืดช่วยบรรยากาศ และเส้นทางอ้อมเสาสามารถออกแบบให้ปลอดภัยชัดเจน",
    "players_fit": "สองคนแข่งกันได้ทันที กติกาสั้น และไม่มีจัมพ์สแกร์ที่ทำให้วิ่ง",
    "buildability": "ใช้จุดตรวจ วงอันตราย ประตู และคะแนนตามระบบเดิม โดยต้องปรับความยากไม่มาก"
   },
   "confidence": "high",
   "why": "ตัวเลือกนี้ตอบแนวคิดปล่อยวิญญาณได้ตรงที่สุด เพราะทุกจุดบนเส้นทางผลักเรื่องไปสู่การช่วยแม่นาค รูปแบบวงกลมอ้อมเสาใช้พื้นที่ 6 x 8 เมตรได้ปลอดภัย และยังคงการแข่งสองคนกับความท้าทายจากเวลาโดยไม่ต้องเพิ่มความหลอนแบบกระตุก",
   "sources": [
    "cs-haunted-night-teens",
    "cu-thai-ghost-tone-scale",
    "cs-thai-folklore-adults"
   ],
   "genre": "runner",
   "why_not": "",
   "spectator_notes": ""
  }
 ],
 "recommend": 2,
 "recommend_why": "ผมแนะนำ “แม่นาค: ทางกลับของวิญญาณ” เพราะเล่าเรื่องปล่อยวิญญาณได้ตรงที่สุด จัดเส้นทางอ้อมเสาได้ปลอดภัย และยังแข่งสองคนให้จบใน 5 นาทีได้โดยไม่พึ่งจัมพ์สแกร์"
}
```

## Creator: picks an option

Option 3 (the option the AI recommended; this step was automatic so both runs are treated the same).

## AI designer: playable prototype plan

Knowledge cards retrieved for this step (9):
- cs-thai-folklore-adults: Thai folklore for adults: original spirits, respectful setting
- cs-haunted-night-teens: Haunted night event for teens: slow-dread story walk
- cu-mae-nak: Mae Nak / แม่นาค: the loyal ghost wife, a love story first
- cs-couple-date: Two players at home: shared floor date night
- un-example-full-vague-brief: Worked example: 'a fun ghost game for my kid's party' resolved in 5 questions
- pt-flow-runner-8min: Runner flow, 8 minutes, 10 checkpoints in 3 acts
- pt-flow-runner-5min: Runner flow, 5 minutes, 8 checkpoints with a twist
- gn-runner-chase-pitfall: Runner has no enemies: turn a chase wish into hazards and a clock
- cu-fit-runner-routes: Themes that suit a runner route

```json
{
 "art": {
  "mood": "หลอนนิ่ง ๆ เศร้าและอบอุ่น ความตึงเครียดมาจากการเดินให้รอด ไม่ใช่การสะดุ้ง",
  "palette": [
   "#101722",
   "#33445C",
   "#6F8FA8",
   "#B44B52",
   "#D8B878",
   "#F4DDA0"
  ],
  "palette_names": [
   "คืนเรือนร้าง",
   "หมอกน้ำคลอง",
   "ฟ้าวิญญาณ",
   "แดงพื้นคำสาป",
   "ไฟประทีป",
   "ทองรุ่งเช้า"
  ],
  "prompt_style": "Stylized low-poly 3D, flat shaded; an abandoned Thai canal village in cold blue mist, restrained supernatural dread, crimson cursed ground, warm lantern accents and a gentle golden dawn finale.",
  "style": "โลว์โพลีสามมิติผิวเรียบ หมู่บ้านไทยริมคลองร้าง เรือนไม้ หมอกบาง และวิญญาณเรืองแสงนิ่ง"
 },
 "decisions": [
  {
   "by": "creator",
   "choice": "เรื่องผู้ช่วยแม่นาครวบรวมและปล่อยวิญญาณ โดยใช้เรือนริมคลองเป็นฉากหลัก",
   "quote": "บ้านผีไทย แม่นาค ปล่อยวิญญาณ",
   "what": "แกนเรื่องและบทบาทผู้เล่น"
  },
  {
   "by": "creator",
   "choice": "สร้างความหลอนด้วยแสง หมอก และการค่อย ๆ เผยเรื่อง ไม่มีเหตุการณ์กระตุกให้วิ่ง",
   "quote": "ไม่เอาจัมพ์สแกร์ที่ทำให้วิ่ง",
   "what": "ระดับความหลอน"
  },
  {
   "by": "option",
   "choice": "เส้นทาง 6 จุดตรวจตามลำดับ แล้วเข้าประตูรุ่งเช้า รอบประมาณ 5 นาที",
   "what": "ความยาวและโครงสร้างรอบเล่น"
  },
  {
   "by": "creator",
   "choice": "สองคนเดินพร้อมกันในสำเนาพื้นที่ของตัวเอง แข่งเวลาและคะแนนบนกระดานผู้นำ",
   "quote": "race",
   "what": "รูปแบบการเล่นสองคน"
  },
  {
   "by": "creator",
   "choice": "เส้นทางเดินอ้อมเสา ไม่วางของเสมือนหรือวงคำสาปทับเสา และเว้นทางกว้างอย่างน้อย 1.2 เมตร",
   "quote": "เสา 1 ต้นตรงกลาง",
   "what": "การจัดการเสาจริงกลางห้อง"
  },
  {
   "by": "card",
   "card": "cu-mae-nak",
   "choice": "ใช้เรือนไม้ คลอง เรือ เปล และต้นมะนาวเป็นฉากประกอบ; แขนยาวของแม่นาคอยู่ข้างทาง ไม่ใช่ศัตรู",
   "what": "ฉากและการนำเสนอแม่นาค"
  },
  {
   "by": "card",
   "card": "cs-haunted-night-teens",
   "choice": "สีฟ้าเย็นและหมอกครอบคลุมเกม ส่วนแดงใช้เฉพาะพื้นคำสาปและทองใช้ที่ตอนจบ",
   "what": "ชุดสีและบรรยากาศ"
  },
  {
   "by": "card",
   "card": "cs-thai-folklore-adults",
   "choice": "ประตูเปลี่ยนจากคืนเย็นเป็นแสงรุ่งเช้า และหันให้เพื่อนหลังห้องเห็นจังหวะผู้เล่นเดินเข้าประตู",
   "what": "ช่วงไคลแมกซ์"
  },
  {
   "by": "option",
   "choice": "สวนต้องคำสาปเป็นช่วงหลบหนักที่สุด จากนั้นลดอันตรายตอนคืนวิญญาณเพื่อให้ผู้เล่นได้พักและซึมซับตอนจบ",
   "what": "จังหวะความยาก"
  },
  {
   "by": "engine",
   "choice": "เหยียบวงแดงกลับจุดตรวจล่าสุดและเสีย 25 คะแนน; จุดตรวจให้ 100 คะแนน การจบให้ 300 คะแนนบวกโบนัสเวลา",
   "what": "กติกาคะแนนและบทลงโทษ"
  }
 ],
 "flow": [
  {
   "t": "0:00",
   "what": "การ์ดเรื่องและกติกาปรากฏ ผู้เล่นสองคนยืนที่จุดเริ่มและเห็นประตูเรือนไม้ด้านหน้า"
  },
  {
   "t": "0:20",
   "what": "แตะจุด 1–2 เพื่อเปิดเรือนและตามเสียงร้องไห้ เส้นทางยังกว้างและมีวงคำสาปให้เรียนรู้เพียงจุดเดียว"
  },
  {
   "t": "1:15",
   "what": "จุด 3 รวบรวมวิญญาณแรกริมคลอง เห็นเปลไหวและเรือนของแม่นาคอยู่ลึกเข้าไป"
  },
  {
   "t": "2:00",
   "what": "จุด 4 ผ่านสวนต้องคำสาป วงแดงหนาแน่นที่สุด แขนยาวของแม่นาคเป็นฉากข้างทางโดยไม่พุ่งใส่ผู้เล่น"
  },
  {
   "t": "3:00",
   "what": "ช่วงเดินสงบไปจุด 5 คืนวิญญาณให้แม่นาค ไม่มีวงคำสาปและเสียงเล่าเปลี่ยนจากเศร้าเป็นโล่ง"
  },
  {
   "t": "3:45",
   "what": "จุด 6 เปิดทางสู่รุ่งเช้า สีฟ้าเย็นค่อย ๆ มีแสงทอง และเห็นประตูจบชัดขึ้น"
  },
  {
   "t": "4:20",
   "what": "เดินเข้าประตูรุ่งเช้าให้เพื่อนหลังห้องเห็น รับคะแนนจบและโบนัสเวลา"
  },
  {
   "t": "4:40",
   "what": "แสดงคะแนน เวลา จำนวนครั้งที่เหยียบคำสาป และกระดานผู้นำของสองคน ก่อนเริ่มรอบใหม่ตอน 5:00"
  }
 ],
 "hud": [
  "เวลาที่ใช้และอันดับปัจจุบันของผู้เล่นสองคน",
  "คะแนนรวม",
  "ชื่อจุดตรวจถัดไปและจำนวนจุดที่ผ่าน เช่น 3/6",
  "ลูกศรสั้นชี้ไปยังจุดตรวจถัดไป",
  "คำเตือนสั้นเมื่อเข้าใกล้พื้นต้องคำสาป",
  "เมื่อพลาด แสดงการหัก 25 คะแนนและการกลับจุดล่าสุด"
 ],
 "key_art": {
  "caption": "ก้าวผ่านสวนคำสาปเพื่อคืนวิญญาณสู่รุ่งเช้า",
  "prompt": "First-person view through a Quest 3 mixed-reality headset inside a real dark meeting room, with the real walls and a central pillar still visible; only the floor is transformed into a stylized low-poly flat-shaded abandoned Thai canal village. The player carefully steps between two glowing crimson cursed circles on a clear walking path. Beside the route, Mae Nak stands quietly near a wooden stilt house and cradle, her long arm reaching toward a lime tree across a misty canal as a side spectacle, never attacking. Pale blue lost spirits drift above the ground, warm lanterns punctuate the cold night palette, and a distant portal glows with gentle golden dawn light. Wide eye-level camera, readable floor hazards, no text, no logos, no UI words."
 },
 "logline": "คุณคือผู้ช่วยแม่นาค ต้องเดินรวบรวมวิญญาณหลงทาง หลบพื้นต้องคำสาป และเปิดทางสู่รุ่งเช้าให้เร็วกว่าคู่แข่ง",
 "pillars": [
  "ทุกจุดเดินต้องเล่าเรื่องความรัก ความรอคอย และการปล่อยวิญญาณของแม่นาค",
  "ความท้าทายมาจากการอ่านทาง เลือกจังหวะ และแข่งเวลา ไม่ใช่ความตกใจ",
  "เส้นทางต้องปลอดภัยรอบเสาจริง และมีจังหวะสำคัญให้เพื่อนหลังห้องเชียร์ได้"
 ],
 "sketch": {
  "path": [
   [
    0.2,
    0.18
   ],
   [
    0.2,
    0.36
   ],
   [
    0.25,
    0.58
   ],
   [
    0.38,
    0.72
   ],
   [
    0.6,
    0.72
   ],
   [
    0.75,
    0.52
   ],
   [
    0.72,
    0.82
   ]
  ],
  "shape": "route",
  "zones": [
   {
    "kind": "start",
    "name": "จุดเริ่มและจุด 1 เปิดประตูบ้าน",
    "x": 0.2,
    "y": 0.18
   },
   {
    "kind": "story",
    "name": "จุด 2 ตามเสียงร้องไห้",
    "x": 0.2,
    "y": 0.36
   },
   {
    "kind": "story",
    "name": "จุด 3 รวบรวมวิญญาณแรก",
    "x": 0.25,
    "y": 0.58
   },
   {
    "kind": "danger",
    "name": "จุด 4 สวนต้องคำสาป",
    "r": 0.14,
    "x": 0.38,
    "y": 0.72
   },
   {
    "kind": "story",
    "name": "จุด 5 คืนวิญญาณให้แม่นาค",
    "x": 0.6,
    "y": 0.72
   },
   {
    "kind": "story",
    "name": "จุด 6 เปิดทางสู่รุ่งเช้า",
    "x": 0.75,
    "y": 0.52
   },
   {
    "kind": "goal",
    "name": "ประตูรุ่งเช้าหันให้ผู้ชม",
    "x": 0.72,
    "y": 0.82
   },
   {
    "kind": "danger",
    "name": "เสาจริงกลางห้อง ห้ามวางทางเดิน",
    "r": 0.1,
    "x": 0.5,
    "y": 0.43
   },
   {
    "kind": "audience",
    "name": "เพื่อนยืนดูหลังห้อง",
    "x": 0.55,
    "y": 0.95
   }
  ]
 },
 "storyboard": [
  {
   "beat": "start",
   "caption": "เรือนไม้ริมคลองเงียบในห้องมืด แสงประทีปนำทางไปยังเสียงร้องไห้ของวิญญาณที่ยังหาทางกลับไม่ได้",
   "player_does": "ยืนที่จุดเริ่ม อ่านเรื่องสั้น แล้วเดินแตะจุดเปิดประตูบ้านและตามเสียงร้องไห้",
   "title": "ประตูเรือนที่ไม่เคยปิด"
  },
  {
   "beat": "middle",
   "caption": "วิญญาณดวงแรกลอยเหนือคลอง ขณะที่พื้นสวนเปลี่ยนเป็นวงแดงและแขนยาวของแม่นาคปรากฏข้างทางอย่างช้า ๆ",
   "player_does": "เดินอ้อมเสาจริง เก็บวิญญาณจากจุดตรวจ และก้าวหลบวงคำสาปโดยไม่รีบวิ่ง",
   "title": "สวนที่พื้นจำความผิด"
  },
  {
   "beat": "climax",
   "caption": "แม่นาครับวิญญาณไว้อย่างอ่อนโยน หมอกสีฟ้าแยกออกและประตูรุ่งเช้าเปิดตรงหน้าผู้ชมหลังห้อง",
   "player_does": "คืนวิญญาณ แตะจุดเปิดทาง แล้วเลือกเส้นทางสุดท้ายให้เร็วโดยไม่เหยียบคำสาป",
   "title": "มือที่ปล่อย ไม่ใช่มือที่เกาะ"
  },
  {
   "beat": "end",
   "caption": "ผู้เล่นก้าวผ่านแสงทอง วิญญาณลอยขึ้นสู่เช้า และคะแนนของทั้งสองคนตัดสินผู้ชนะ",
   "player_does": "เดินเข้าประตูจบ ดูเวลา โบนัส และอันดับบนกระดานผู้นำ",
   "title": "รุ่งเช้าของผู้ที่ได้ไปต่อ"
  }
 ],
 "test_questions": [
  "ผู้เล่นมองเห็นเสาจริงและเข้าใจทางอ้อมได้ตลอด โดยไม่มีช่วงไหนที่ทางเดินแคบกว่า 1.2 เมตรหรือไม่",
  "ในห้องมืด ผู้เล่นแยกวงคำสาปสีแดงออกจากพื้นหมู่บ้านได้ก่อนเหยียบหรือไม่",
  "ป้ายเรื่อง 6 จุดสั้นพอให้คนที่แข่งเวลาอ่านเข้าใจโดยไม่หยุดนานเกินไปหรือไม่",
  "เพื่อนหลังห้องเห็นจังหวะหลบในสวนและการเข้าประตูจบชัดพอที่จะเชียร์ได้หรือไม่"
 ],
 "title": "แม่นาค: ทางกลับของวิญญาณ"
}
```

## Creator: approves the prototype

Approved without changes (automatic).

## AI designer: final build plan

Knowledge cards retrieved for this step (6):
- cs-thai-folklore-adults: Thai folklore for adults: original spirits, respectful setting
- cs-haunted-night-teens: Haunted night event for teens: slow-dread story walk
- cu-mae-nak: Mae Nak / แม่นาค: the loyal ghost wife, a love story first
- cs-fortal-court-race-6: Fortal court 14 x 22 m: 6-player two-lane race
- gn-runner-hazard-gate: Hazard gate: two circles with a clear gap between them
- gn-runner-race-vs-together: Runner online modes: race for rivals, shared floor for togetherness

```json
{
 "name": "แม่นาค: ทางกลับของวิญญาณ",
 "description": "แข่งเดินรวบรวมวิญญาณหลงทาง หลบพื้นต้องคำสาป และเปิดประตูรุ่งเช้าให้แม่นาค",
 "game": {
  "goal": "ผ่านจุดเล่าเรื่องทั้ง 6 จุดตามลำดับ คืนวิญญาณให้แม่นาค และเดินเข้าประตูรุ่งเช้าให้เร็วที่สุด",
  "rules": [
   "เดินแตะจุดตรวจทั้ง 6 จุดตามลำดับ แล้วเข้าสู่ประตูรุ่งเช้า",
   "วงสีแดงคือพื้นต้องคำสาป หากเหยียบจะกลับไปยังจุดตรวจล่าสุดและเสีย 25 คะแนน",
   "ผ่านจุดตรวจแต่ละจุดได้ 100 คะแนน และเข้าประตูจบได้ 300 คะแนนพร้อมโบนัสเวลา",
   "ผู้เล่นสองคนเดินในสำเนาพื้นที่ของตัวเอง ผลคะแนนและเวลาจะแสดงบนกระดานผู้นำ",
   "เดินด้วยความเร็วปกติ ไม่ต้องวิ่ง และระวังเสาจริงกลางห้อง",
   "ไม่มีจัมพ์สแกร์ ความท้าทายมาจากการเลือกทางและทำเวลา"
  ],
  "story": "คืนนี้เรือนไม้ริมคลองยังคงเสียงร้องไห้ของวิญญาณที่หาทางกลับไม่พบ คุณคือผู้ช่วยแม่นาค ผู้รอคอยคนรักและเปิดใจให้วิญญาณเหล่านั้นได้ไปต่อ เดินผ่านหมู่บ้านร้าง รวบรวมวิญญาณ และอย่าเหยียบพื้นที่จดจำความผิดไว้ เมื่อคืนวิญญาณให้แม่นาคแล้ว เปิดทางสู่รุ่งเช้าให้ทุกดวงได้หลุดพ้น",
  "timeLimit": 300,
  "title": "แม่นาค: ทางกลับของวิญญาณ"
 },
 "layout_brief": "MR runner for two simultaneous players, each walking a separate copy of the Land, in a 6 x 8 m enclosed meeting room at night with the lights off. The real room remains visible through passthrough; only the floor and virtual scenery change. There is one real pillar at the centre of the room. Build a calm, clockwise loop/zigzag around that pillar, starting at the front of the room and finishing near the back, with the dawn portal facing friends watching from behind the room. Keep every walking leg at least 1.2 m wide, keep all route elements at least 0.6 m from room edges, and never place a checkpoint, hazard, or virtual model on the real pillar. Keep ghost figures at least 1.5 m beside the route. Use spooky lighting and a stylized low-poly, flat-shaded abandoned Thai canal village: cold blue mist, weathered wooden stilt houses, quiet water, faint spirit-blue lights, warm lantern accents, crimson only for cursed ground, and a gentle golden dawn at the end. No jump scares, moving attacks, sacred objects as targets, monks, Buddha images, or touchable temple scenery.\n\nUse exactly 6 ordered checkpoints with these Thai labels: 1) “เปิดประตูบ้าน” beside the front stilt-house doorway; 2) “ตามเสียงร้องไห้” along a broad introductory leg; 3) “รวบรวมวิญญาณแรก” beside the canal, with a quiet glowing spirit and a swinging cradle vignette; 4) “ผ่านสวนต้องคำสาป” around the pillar side, the densest hazard section; 5) “คืนวิญญาณให้แม่นาค” in a calm, hazard-free clearing with Mae Nak presented gently as a loving wife, never an enemy; 6) “เปิดทางสู่รุ่งเช้า” where cold mist begins to separate and warm gold appears. The finish portal follows checkpoint 6 and is the glowing golden dawn exit, clearly visible from the final approach.\n\nPlace one forgiving red cursed-ground circle on the early leg between checkpoints 2 and 3 so players learn the rule. In the cursed garden between checkpoints 3, 4, and 5, use several red circles with broad, readable walking gaps; this is the main visible dodge moment for spectators. Mae Nak’s long arm is a static side spectacle reaching across the canal beside this section, never sweeping toward the player. Leave the approach to checkpoint 5 free of hazards for a quiet story pause. After checkpoint 6, use only a small final cursed-ground choice with a generous safe route so the player can finish quickly without running. Do not use hazard gates narrower than 1 m.\n\nHero pieces: Mae Nak’s stilt house, canal banks, a rowboat, the swinging cradle, a subtle lullaby note marker, a lime tree with the long-arm vignette, restrained original spirit figures standing beside the route, and the dawn portal. No film-specific recreation and no shrine or worship scoring. From spawn, the player should immediately read the wooden doorway ahead, the lantern-lit route, cold mist around the central obstacle, and a hint of warm dawn deeper in the loop. Spectators stand behind the room, outside the play area; orient the cursed-garden dodge and the finish portal toward them.",
 "lighting": "spooky",
 "spectator_plan": "เพื่อนยืนดูจากหลังห้องนอกพื้นที่เล่น จะเห็นจังหวะหลบพื้นต้องคำสาปในสวนและช่วงที่ผู้เล่นเดินเข้าประตูรุ่งเช้าอย่างชัดเจน ช่วยเชียร์และลุ้นเวลา คะแนน และอันดับของผู้เล่นสองคนบนกระดานผู้นำได้"
}
```
