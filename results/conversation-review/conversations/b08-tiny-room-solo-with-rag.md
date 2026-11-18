# b08-tiny-room-solo · WITH the knowledge base (RAG)

Model: Kimi K3.1 Pro. Same brief and same steps in both runs. The system prompts were not saved; this is the creator input and every AI output, in order.

## Creator: the game brief

```json
{
 "platform": "mr",
 "concept": "อยากเล่นเกมยิงซอมบี้คนเดียวในห้องนอน",
 "players": "ผู้ใหญ่ 30 ปี",
 "group_size": "คนเดียว",
 "vr_experience": "เล่นประจำ",
 "feelings": [
  "challenge",
  "sensation"
 ],
 "venue": "space",
 "width_m": 2.2,
 "depth_m": 2.5,
 "indoor": true,
 "obstacles": "เตียงชิดผนัง",
 "environment": "ห้องนอนคอนโด",
 "time_of_day": "กลางคืน",
 "session_minutes": 5,
 "play_mode": "solo",
 "constraints": "none",
 "spectators": "none"
}
```

## AI designer: three game options

Knowledge cards retrieved for this step (9):
- cs-tiny-room-2x2: Tiny 2 x 2 m room: three different runners
- cs-couple-date: Two players at home: shared floor date night
- cs-solo-relaxation: Solo relaxation after work: slow zen walk
- sp-players-adults: Adults at home or with friends: longer, harder, a bit of nostalgia
- un-default-play-mode: Default play mode follows group size and floor size
- un-impossible-shooting: Shooting wish: offer the sword arena or a dodge course
- gn-runner-tiny-room: Under 3 x 3 m in MR, all three options are runners
- sp-venue-living-room: Living room: small, furniture, 1-2 players
- th-formal-players-objectives: Defaults for players and objectives

```json
{
 "options": [
  {
   "axes": {
    "aesthetic": "narrative",
    "loop": "story",
    "route": "out-and-back",
    "social": "solo"
   },
   "confidence": "high",
   "core_loop": "เดินตามจุดหมายเพื่อเปิดทางหนี แล้วย้อนกลับผ่านซอมบี้สู่ทางออก",
   "environment_fit": "ใช้ผนังห้องนอนเป็นแนวเขตโซนกักกันและแสงกลางคืนช่วยให้ฉากสยองอ่านง่าย โดยวางทุกอย่างบนพื้นว่าง 2.2 × 2.5 เมตร ไม่วางของบนเตียงและเว้นทางเดินให้ปลอดภัย",
   "feelings": [
    "challenge",
    "sensation"
   ],
   "feelings_how": "เส้นทางไป–กลับและเวลาจำกัดสร้างแรงกดดัน ส่วนฉากห้องกักกันซอมบี้ที่ทับพื้นห้องจริงให้ความตื่นเต้นโดยไม่มีเสียงหรือภาพจู่โจม",
   "genre": "runner",
   "lighting": "spooky",
   "mechanics": "เดินคนเดียว 4 จุดเช็กพอยต์ตามลำดับ: ‘รับสัญญาณฉุกเฉิน’, ‘เปิดประตูกักกัน’, ‘กู้แบตเตอรี่’, ‘เปิดทางหนี’ แล้วเข้าประตูทางออก มีวงอันตรายซอมบี้ 2 จุดรัศมีประมาณ 0.35 เมตรบนขากลับ เหยียบแล้วกลับจุดเช็กพอยต์ล่าสุด จำกัดเวลา 5 นาที ไม่มีการยิงหรือสู้",
   "pitch": "ห้องนอนของคุณกลายเป็นโซนกักกันซอมบี้: รับสัญญาณ กู้แบตเตอรี่ แล้วรีบหนีกลับก่อนโซนถูกปิด แม้ยิงไม่ได้ แต่ความเร่งรีบในการหลบและหนียังให้ความรู้สึกบีบหัวใจ",
   "players_fit": "เหมาะกับผู้ใหญ่ที่เล่น VR ประจำและต้องการความท้าทายสั้น 5 นาที โดยควบคุมจังหวะการเดินเองได้ในพื้นที่แคบ",
   "risks": [
    "การเดินย้อนเส้นเดิมอาจรู้สึกซ้ำหากเล่นหลายรอบ",
    "เวลา 5 นาทีกับวงอันตรายอาจกดดันจนเผลอเดินเร็วเกินไป จึงต้องเตือนให้เดินเท่านั้น"
   ],
   "route": "ไป–กลับตามแนวยาวของพื้นที่ว่าง",
   "scores": {
    "buildability": 5,
    "fun": 4,
    "mr_fit": 4,
    "players_fit": 4
   },
   "scores_why": {
    "buildability": "ใช้เช็กพอยต์ วงอันตราย และประตูทางออกมาตรฐานเพียง 4 จุด",
    "fun": "เรื่องหนีซอมบี้และขากลับที่มีอันตรายสร้างจังหวะตื่นเต้น แต่ไม่มีการยิงตามความต้องการเดิม",
    "mr_fit": "เส้นทางสั้นและของชิ้นเล็กเหมาะกับพื้นที่ 2.2 × 2.5 เมตร แต่เหลือระยะเคลื่อนที่จำกัด",
    "players_fit": "ผู้เล่นมีประสบการณ์ VR และชอบความท้าทาย จึงน่าจะรับจังหวะเร่งได้ แต่อาจคิดถึงแอ็กชันยิง"
   },
   "sources": [
    "cs-tiny-room-2x2",
    "gn-runner-tiny-room",
    "un-impossible-shooting",
    "sp-players-adults"
   ],
   "spectator_view": "ไม่มีผู้ชมตามบรีฟ; จังหวะสำคัญจึงจัดให้ผู้เล่นเห็นชัดจากแนวเดินของตัวเอง โดยไม่ต้องมีคนเข้าไปในพื้นที่เล่น",
   "theme": "โซนกักกันซอมบี้ในคอนโด โปรพกระเบื้องเตือน ไฟฉุกเฉิน และซอมบี้โลว์โพลีขนาดเล็ก",
   "title": "หนีรอดจากห้องกักกัน",
   "why": "ตัวเลือกนี้เก็บบรรยากาศซอมบี้และความเร่งด่วนของเกมยิง แต่แปลงเป็นเส้นทางเดินหนีที่ระบบสร้างได้จริง แนวไป–กลับทำให้พื้นที่เล็กมีการเปลี่ยนจังหวะระหว่างตอนกู้ของกับตอนหนี โดยไม่สัญญาว่าจะมีปืนหรือการต่อสู้"
  },
  {
   "axes": {
    "aesthetic": "sensation",
    "loop": "tour",
    "route": "loop",
    "social": "solo"
   },
   "confidence": "high",
   "core_loop": "เดินชมจุดเหตุการณ์รอบวงเล็ก ๆ เพื่อไล่ดูคำเตือนและร่องรอยการระบาดอย่างสงบ",
   "environment_fit": "ผนังจริงช่วยจัดฉากเหมือนห้องพักที่ถูกปิดตาย ส่วนแสงกลางคืนในร่มทำให้สีเขียว toxic และแสงไฟฉุกเฉินเด่น ใช้เฉพาะโปรพเล็กรอบพื้น ไม่บังเตียงหรือทางเดิน",
   "feelings": [
    "sensation"
   ],
   "feelings_how": "ฉากเมืองจิ๋วที่ถูกซอมบี้ overrun และไฟฉุกเฉินบนพื้นห้องจริงสร้างความ wow โดยไม่บังคับให้รีบหรือหลบ",
   "genre": "runner",
   "lighting": "night",
   "mechanics": "เดินคนเดียว 4 จุดเช็กพอยต์เป็นวงเล็ก: ‘จุดตรวจหน้าห้อง’, ‘ศูนย์แจ้งเตือน’, ‘ห้องแล็บจิ๋ว’, ‘สัญญาณเครื่องบินรับตัว’ แล้วเข้าประตูทางออก ไม่มีวงอันตรายและไม่จับเวลา คาดรอบละประมาณ 5 นาที ไม่มีการยิงหรือสู้",
   "pitch": "ชมภัยพิบัติซอมบี้แบบโลกจิ๋วที่ผุดขึ้นบนพื้นห้องนอน โดยไม่ต้องรีบหรือกลัวพลาด เหมาะกับการซึมซับบรรยากาศสยองที่สวยและแปลกตา",
   "players_fit": "ผู้เล่นคนเดียวสามารถกำหนดจังหวะได้เองและไม่ต้องกังวลเรื่องพื้นที่แคบหรือคะแนน เหมาะถ้าต้องการความตื่นตามากกว่าความยาก",
   "risks": [
    "ความท้าทายต่ำมาก จึงอาจไม่ตอบโจทย์ผู้ที่ต้องการแอ็กชัน",
    "ช่วง 5 นาทีอาจรู้สึกยาวหากดูจุดเช็กพอยต์ทั้งสี่จบเร็ว"
   ],
   "route": "วงกลมเล็กรอบพื้นที่ว่าง โดยจุดห่างกันประมาณ 0.5–1 เมตร",
   "scores": {
    "buildability": 5,
    "fun": 3,
    "mr_fit": 5,
    "players_fit": 3
   },
   "scores_why": {
    "buildability": "ไม่มีอันตรายหรือตัวจับเวลา จึงประกอบจากเช็กพอยต์และฉากอย่างตรงไปตรงมา",
    "fun": "บรรยากาศน่าสนใจแต่ไม่มีเป้าหมายที่กดดันหรือทักษะให้ฝึก",
    "mr_fit": "เส้นทางช้า ไม่มีอันตราย และโปรพเล็กจึงเข้ากับห้องขนาด 2.2 × 2.5 เมตรมาก",
    "players_fit": "ตอบ sensation ได้ชัด แต่เสิร์ฟ challenge ที่ผู้เล่นเลือกน้อย"
   },
   "sources": [
    "cs-tiny-room-2x2",
    "gn-runner-tiny-room",
    "un-impossible-shooting"
   ],
   "spectator_view": "ไม่มีผู้ชมตามบรีฟ; ผู้เล่นสามารถหยุดมองฉากได้โดยไม่มีใครเข้ามาในเขตเดิน",
   "theme": "ดิโอรามาหายนะซอมบี้ขนาดจิ๋ว ไฟฉุกเฉิน หมอกต่ำ และอาคารโลว์โพลีเล็ก ๆ",
   "title": "เมืองจิ๋วคืนระบาด",
   "why": "ตัวเลือกนี้เน่นความตื่นตาจากการเห็นห้องจริงกลายเป็นจุดเกิดเหตุซอมบี้ แทนการเลียนแบบเกมยิงที่ระบบไม่รองรับ วงเดินช้าและไม่มีอันตรายช่วยใช้ห้องเล็กได้ปลอดภัยที่สุด พร้อมให้ทางเลือกที่ต่างจากเกมหนีและเกมหลบอย่างชัดเจน"
  },
  {
   "axes": {
    "aesthetic": "challenge",
    "loop": "dodge",
    "route": "zigzag",
    "social": "solo"
   },
   "confidence": "high",
   "core_loop": "เดินซิกแซกอ่านวงเตือนแล้วหลบซอมบี้ที่ล้มตัวขวางทางไปยังจุดชุบชีวิต",
   "environment_fit": "ใช้พื้น 2.2 × 2.5 เมตรเป็นเลนซิกแซกสั้น ผนังและเตียงยังมองเห็นจริงเพื่อช่วยระบุขอบเขต แสงกลางคืนทำให้วงเตือนสีแดงชัด และไม่มีภาพจู่โจมที่ทำให้วิ่ง",
   "feelings": [
    "challenge",
    "sensation"
   ],
   "feelings_how": "การอ่านวงอันตรายและเลือกจังหวะก้าวให้ทักษะที่ชัด ส่วนซอมบี้และวงแดงใกล้ตัวสร้างความตื่นเต้นแบบควบคุมได้",
   "genre": "runner",
   "lighting": "spooky",
   "mechanics": "เดินคนเดียว 4 จุดเช็กพอยต์: ‘จุดปฐมพยาบาล’, ‘ผ่านซากรถ’, ‘ถึงตู้วัคซีน’, ‘เปิดจุดอพยพ’ แล้วเข้าประตูทางออก มีวงอันตรายมือซอมบี้ 2 จุดรัศมีประมาณ 0.35 เมตรระหว่างทาง เหยียบแล้วกลับจุดล่าสุด จำกัดเวลา 5 นาทีและให้โบนัสตามเวลา ไม่มีการยิงหรือสู้",
   "pitch": "นี่คือเวอร์ชันที่ใกล้ความรู้สึกลุ้นระทึกของเกมซอมบี้ที่สุด: ไม่ได้ยิง แต่ต้องอ่านพื้น หลบมือซอมบี้ และไปให้ถึงวัคซีนก่อนหมดเวลา",
   "players_fit": "เหมาะกับผู้ใหญ่ที่เล่น VR ประจำ เพราะกฎเข้าใจเร็วและให้ฝึกทำเวลาให้ดีขึ้นในรอบสั้น 5 นาที",
   "risks": [
    "วงอันตรายในห้องเล็กอาจทำให้ผู้เล่นก้าวหลบกว้าง จึงต้องจัดวงไม่ชิดเตียงและกำชับให้เดินเท่านั้น",
    "การหลบเพียงสองจุดอาจให้ความลึกน้อยกว่าเกมแอ็กชันเต็มรูปแบบ"
   ],
   "route": "ซิกแซกสั้นผ่านกลางพื้นที่ว่าง จบด้วยประตูทางออกฝั่งตรงข้ามจุดเริ่ม",
   "scores": {
    "buildability": 4,
    "fun": 4,
    "mr_fit": 4,
    "players_fit": 5
   },
   "scores_why": {
    "buildability": "วางได้ด้วยระบบมาตรฐาน แต่ต้องทดสอบตำแหน่งวงสองจุดให้เหลือทางหลบปลอดภัยในห้องแคบ",
    "fun": "เป้าหมายชัดและมีทั้งความผิดพลาด เวลา และการพัฒนาฝีมือ แม้ไม่มีการยิง",
    "mr_fit": "รัศมีวงเล็กและเส้นทางสั้นเข้ากับห้อง แต่ต้องระวังการก้าวหลบใกล้ขอบ",
    "players_fit": "ตอบทั้ง challenge และ sensation พร้อมประสบการณ์ 5 นาทีสำหรับผู้เล่นคนเดียวที่คุ้น VR"
   },
   "sources": [
    "cs-tiny-room-2x2",
    "gn-runner-tiny-room",
    "un-impossible-shooting",
    "sp-players-adults"
   ],
   "spectator_view": "ไม่มีผู้ชมตามบรีฟ; จังหวะหลบและเข้าประตูทางออกอยู่ในมุมมองผู้เล่นเอง โดยไม่ต้องมีใครอยู่ในเขตเล่น",
   "theme": "จุดอพยพซอมบี้ มือซอมบี้จากพื้น ซากรถจิ๋ว ตู้วัคซีน และแถบเตือนสีแดง",
   "title": "หลบมือซอมบี้ถึงวัคซีน",
   "why": "ตัวเลือกนี้เปลี่ยนพลังของเกมยิงให้เป็นทักษะการอ่านจังหวะและหลบ ซึ่งเป็นแอ็กชันที่ทำได้จริงในห้องเล็ก มันตอบทั้งความท้าทายและความตื่นเต้นของผู้เล่นมากที่สุด โดยยังคงพื้นที่ปลอดภัยและบอกชัดว่าไม่มีปืนหรือการสู้"
  }
 ],
 "recommend": 2,
 "recommend_why": "แนะนำ ‘หลบมือซอมบี้ถึงวัคซีน’ เพราะให้ทั้งความท้าทายและความลุ้นระทึกใกล้กับเกมซอมบี้ที่ต้องการมากที่สุด ขณะยังสร้างได้จริงและปรับให้ปลอดภัยในห้องขนาด 2.2 × 2.5 เมตร"
}
```

## Creator: picks an option

Option 3 (the option the AI recommended; this step was automatic so both runs are treated the same).

## AI designer: playable prototype plan

Knowledge cards retrieved for this step (9):
- cs-tiny-room-2x2: Tiny 2 x 2 m room: three different runners
- cs-couple-date: Two players at home: shared floor date night
- cs-solo-relaxation: Solo relaxation after work: slow zen walk
- pt-flow-runner-2min: Runner flow, 2 minutes, 5 checkpoints
- pt-qt-runner: Runner playtest questions
- pu-team-mixed-fitness: Mixed-ability teams: walking pace, no running, optional effort
- pt-flow-runner-5min: Runner flow, 5 minutes, 8 checkpoints with a twist
- gn-runner-tiny-room: Under 3 x 3 m in MR, all three options are runners
- gn-runner-chase-pitfall: Runner has no enemies: turn a chase wish into hazards and a clock

```json
{
 "title": "หลบมือซอมบี้ถึงวัคซีน",
 "logline": "คุณคือผู้รอดชีวิตที่ต้องเดินซิกแซกหลบมือซอมบี้ในห้องนอนจริง เก็บวัคซีนและเปิดจุดอพยพให้ทันเวลา โดยความสนุกอยู่ที่การอ่านวงแดงและเลือกจังหวะก้าวให้แม่นยำ",
 "pillars": [
  "ทุกจังหวะต้องท้าทายการอ่านพื้นและจังหวะเดิน ไม่ใช่ความเร็ว",
  "ห้องนอนจริงต้องมองเห็นชัดและเส้นทางต้องปลอดภัยห่างเตียง",
  "ความลุ้นระทึกมาจากมือซอมบี้ เสียงบรรยากาศและเวลา โดยไม่มีภาพจู่โจมหรือการยิง"
 ],
 "art": {
  "style": "โลว์โพลี 3D ผิวเรียบสีชัด ซอมบี้และซากรถขนาดเล็กแบบของเล่น",
  "mood": "ลุ้นระทึกแบบควบคุมได้ มืดแต่อ่านทางและวงเตือนง่าย",
  "prompt_style": "Stylized low-poly flat-shaded 3D, miniature zombie evacuation props, controlled suspense, dark readable scene with crisp red floor warnings and cool vaccine light",
  "palette": [
   "#171B2E",
   "#38465A",
   "#E34850",
   "#72E0B8",
   "#D9E4DD"
  ],
  "palette_names": [
   "น้ำเงินราตรี",
   "เทาซากเมือง",
   "แดงเตือนอันตราย",
   "เขียวมิ้นต์วัคซีน",
   "ขาวอ่านง่าย"
  ]
 },
 "key_art": {
  "caption": "ก้าวผ่านวงมือซอมบี้ แล้วเล็งตู้วัคซีนสีเขียวไว้ข้างหน้า",
  "prompt": "First-person view through a mixed-reality Quest 3 headset inside a small real condominium bedroom at night, the real walls and a real bed against one wall clearly visible and untouched, only the clear 2.2 by 2.5 metre floor replaced by a stylized low-poly flat-shaded disaster ground. The player is mid-step around a crisp red circular warning on the floor with still low-poly zombie hands rising from it, a safe zigzag route ahead, a tiny wrecked car prop to one side, and a softly mint-glowing vaccine cabinet beside the next checkpoint. Controlled spooky lighting, readable colours, realistic room scale, no running pose, no guns, no combat, no text, no logos, no UI words."
 },
 "storyboard": [
  {
   "beat": "start",
   "title": "เริ่มภารกิจชุบชีวิต",
   "caption": "พื้นห้องนอนกลายเป็นจุดอพยพขนาดย่อม ส่วนผนังและเตียงจริงยังช่วยบอกขอบเขต",
   "player_does": "ยืนที่จุดเริ่ม อ่านเป้าหมาย แล้วเดินช้า ๆ ไปแตะจุดปฐมพยาบาล"
  },
  {
   "beat": "middle",
   "title": "อ่านวงแล้วเลือกทาง",
   "caption": "มือซอมบี้นิ่งโผล่ในวงแดงแรก ทำให้เส้นทางตรงไม่ปลอดภัยอีกต่อไป",
   "player_does": "หยุดดูวงเตือน เดินอ้อมด้านที่ว่าง แล้วผ่านซากรถไปยังจุดถัดไป"
  },
  {
   "beat": "climax",
   "title": "วัคซีนอยู่อีกฝั่งของวงแดง",
   "caption": "วงมือซอมบี้จุดสุดท้ายบังทางซิกแซกก่อนถึงตู้วัคซีนและจุดอพยพ",
   "player_does": "เลือกจังหวะก้าวอ้อมโดยไม่เหยียบวง แตะตู้วัคซีน แล้วเดินไปเปิดจุดอพยพ"
  },
  {
   "beat": "end",
   "title": "อพยพพร้อมวัคซีน",
   "caption": "ประตูทางออกสว่างขึ้นที่ปลายเส้นทาง และผลคะแนนสรุปความแม่นยำกับเวลาที่ใช้",
   "player_does": "เดินเข้าประตูทางออก ดูคะแนน แล้วเลือกเล่นซ้ำเพื่อลดเวลาหรือเลี่ยงการถูกหักคะแนน"
  }
 ],
 "hud": [
  "เวลาที่เหลือจาก 5 นาที",
  "คะแนนปัจจุบัน",
  "จำนวนเช็กพอยต์ที่ผ่าน เช่น 2/4",
  "ชื่อเช็กพอยต์ถัดไปแบบสั้น",
  "ข้อความ −25 และจุดที่กลับไปเมื่อเหยียบวงอันตราย"
 ],
 "flow": [
  {
   "t": "0:00",
   "what": "การ์ดเรื่องและกฎสั้นย้ำให้เดินเท่านั้น ไม่มีการยิง พร้อมมองเห็นเส้นทางและเตียงจริงจากจุดเริ่ม"
  },
  {
   "t": "0:20",
   "what": "แตะเช็กพอยต์ 1 ‘จุดปฐมพยาบาล’ เพื่อเรียนรู้การเดินตามลำดับโดยยังไม่มีอันตราย"
  },
  {
   "t": "0:45",
   "what": "อ้อมวงมือซอมบี้จุดแรกแล้วแตะเช็กพอยต์ 2 ‘ผ่านซากรถ’"
  },
  {
   "t": "1:20",
   "what": "เดินช่วงซิกแซกสั้นไปแตะเช็กพอยต์ 3 ‘ถึงตู้วัคซีน’ และพักอ่านทางหน้า"
  },
  {
   "t": "1:50",
   "what": "หลบวงมือซอมบี้จุดสุดท้ายอย่างช้า ๆ แล้วแตะเช็กพอยต์ 4 ‘เปิดจุดอพยพ’"
  },
  {
   "t": "2:20",
   "what": "เข้าประตูทางออก รับคะแนนจบและโบนัสเวลา แล้วดูว่าพลาดวงใดบ้าง"
  },
  {
   "t": "2:40",
   "what": "เลือกเล่นซ้ำได้เพื่อทำเวลาและคะแนนให้ดีขึ้น โดยเริ่มจากจุดเดิม"
  },
  {
   "t": "5:00",
   "what": "หมดเวลารอบเล่น หากยังไม่ถึงประตูทางออกให้สรุปคะแนนและเสนอเริ่มใหม่"
  }
 ],
 "sketch": {
  "shape": "route",
  "zones": [
   {
    "name": "จุดเริ่มภารกิจ",
    "x": 0.2,
    "y": 0.84,
    "kind": "start",
    "r": 0.07
   },
   {
    "name": "จุดปฐมพยาบาล",
    "x": 0.32,
    "y": 0.7,
    "kind": "story",
    "r": 0.07
   },
   {
    "name": "ผ่านซากรถ",
    "x": 0.7,
    "y": 0.57,
    "kind": "story",
    "r": 0.07
   },
   {
    "name": "ถึงตู้วัคซีน",
    "x": 0.29,
    "y": 0.34,
    "kind": "story",
    "r": 0.07
   },
   {
    "name": "เปิดจุดอพยพ",
    "x": 0.66,
    "y": 0.21,
    "kind": "story",
    "r": 0.07
   },
   {
    "name": "มือซอมบี้จุดแรก",
    "x": 0.5,
    "y": 0.61,
    "kind": "danger",
    "r": 0.11
   },
   {
    "name": "มือซอมบี้จุดสุดท้าย",
    "x": 0.45,
    "y": 0.27,
    "kind": "danger",
    "r": 0.11
   },
   {
    "name": "ประตูทางออก",
    "x": 0.8,
    "y": 0.1,
    "kind": "goal",
    "r": 0.08
   }
  ],
  "path": [
   [
    0.2,
    0.84
   ],
   [
    0.32,
    0.7
   ],
   [
    0.36,
    0.55
   ],
   [
    0.57,
    0.48
   ],
   [
    0.7,
    0.57
   ],
   [
    0.55,
    0.43
   ],
   [
    0.29,
    0.34
   ],
   [
    0.29,
    0.2
   ],
   [
    0.5,
    0.14
   ],
   [
    0.66,
    0.21
   ],
   [
    0.8,
    0.1
   ]
  ]
 },
 "test_questions": [
  "ผู้เล่นหาเช็กพอยต์ ‘ผ่านซากรถ’ ได้เองโดยไม่ต้องมีคนบอกหรือไม่",
  "ในแต่ละรอบผู้เล่นเหยียบวงอันตรายกี่ครั้ง และเกิดที่วงใด",
  "ผู้เล่นสามารถอ้อมวงทั้งสองโดยไม่ก้าวเข้าใกล้เตียงหรือขอบพื้นที่ว่างได้หรือไม่",
  "วงแดงและตู้วัคซีนสีเขียวอ่านชัดในแสงห้องนอนตอนกลางคืนหรือไม่"
 ],
 "decisions": [
  {
   "what": "แกนความรู้สึกของเกม",
   "choice": "รักษาบรรยากาศซอมบี้และการเล่นคนเดียวในห้องนอน แต่เปลี่ยนการยิงเป็นการหลบ",
   "by": "creator",
   "quote": "อยากเล่นเกมยิงซอมบี้คนเดียวในห้องนอน"
  },
  {
   "what": "ระบบที่ใช้สร้างเกม",
   "choice": "เส้นทางเดิน 4 เช็กพอยต์ วงอันตราย 2 จุด และประตูทางออก ไม่มีปืนหรือซอมบี้ที่เคลื่อนที่เข้าหาผู้เล่น",
   "by": "option"
  },
  {
   "what": "ขนาดและจำนวนองค์ประกอบในห้องเล็ก",
   "choice": "ใช้ 4 เช็กพอยต์ ของประกอบฉากขนาดเล็ก และวงอันตรายรัศมีประมาณ 0.35 เมตร",
   "by": "card",
   "card": "cs-tiny-room-2x2"
  },
  {
   "what": "เส้นทางและความปลอดภัย",
   "choice": "ซิกแซกสั้นกลางพื้นที่ว่าง เดินเท่านั้น เว้นทางรอบวงและไม่วางสิ่งใดบนเตียงจริง",
   "by": "card",
   "card": "gn-runner-tiny-room"
  },
  {
   "what": "สาเหตุที่ต้องรีบโดยไม่มีมอนสเตอร์ไล่ล่า",
   "choice": "ใช้เวลาจำกัด 5 นาทีและฉากมือซอมบี้นิ่งเป็นภัยคุกคาม แทนศัตรูที่เดินไล่",
   "by": "card",
   "card": "gn-runner-chase-pitfall"
  },
  {
   "what": "บีตสำคัญของรอบเล่น",
   "choice": "ช่วงแรกสอนเดิน วงแรกสอนหลบ ช่วงไคลแมกซ์เป็นวงสุดท้ายก่อนเปิดจุดอพยพ แล้วพักดูคะแนน",
   "by": "default"
  },
  {
   "what": "สีและแสง",
   "choice": "แสงแบบสปูกกี้ พื้นน้ำเงินเข้ม วงแดงสด และวัคซีนสีเขียวมิ้นต์เพื่อให้แยกเป้าหมายกับอันตรายชัด",
   "by": "default"
  },
  {
   "what": "ผลเมื่อเหยียบวงอันตรายและการให้คะแนน",
   "choice": "กลับเช็กพอยต์ล่าสุด หัก 25 คะแนน; เช็กพอยต์ละ 100 และจบได้ 300 บวกโบนัสเวลา",
   "by": "engine"
  }
 ]
}
```

## Creator: approves the prototype

Approved without changes (automatic).

## AI designer: final build plan

Knowledge cards retrieved for this step (6):
- cs-tiny-room-2x2: Tiny 2 x 2 m room: three different runners
- cs-fitness-challenge: Fitness-minded adults: an active battle with rain rings
- cs-living-room-family: Family living room 3 x 3 m: a gentle loop runner
- sp-size-small: Under 4 x 4 m: 1-2 players, a short loop, no race
- sp-tiny-room: A shortest side under 3.7 m triggers the tiny-room rules
- gn-runner-race-vs-together: Runner online modes: race for rivals, shared floor for togetherness

```json
{
 "name": "หลบมือซอมบี้ถึงวัคซีน",
 "description": "เดินซิกแซกในห้องนอนจริง หลบมือซอมบี้ เก็บวัคซีน และเปิดจุดอพยพให้ทันเวลา",
 "game": {
  "goal": "ผ่าน 4 เช็กพอยต์ตามลำดับ หลบวงมือซอมบี้ แล้วเข้าประตูทางออกให้ทันใน 5 นาที",
  "story": "ห้องนอนของคุณกลายเป็นจุดอพยพแห่งสุดท้าย ขณะที่มือซอมบี้โผล่ขึ้นจากพื้นขวางเส้นทางไปยังวัคซีน คุณต้องเดินผ่านจุดปฐมพยาบาลและซากรถ เก็บวัคซีน แล้วเปิดจุดอพยพก่อนหมดเวลา ไม่มีปืนให้ใช้—ความแม่นยำในการอ่านวงแดงและเลือกจังหวะก้าวคือกุญแจรอดชีวิต",
  "rules": [
   "เดินเท่านั้น ห้ามวิ่งหรือกระโดด และระวังเตียงกับผนังจริงตลอดเวลา",
   "แตะเช็กพอยต์ทั้ง 4 จุดตามลำดับ โดยแต่ละจุดให้ 100 คะแนน",
   "อย่าเหยียบวงแดงมือซอมบี้ หากเหยียบจะเสีย 25 คะแนนและกลับไปยังเช็กพอยต์ล่าสุด",
   "หลังแตะ ‘เปิดจุดอพยพ’ ให้เดินเข้าประตูทางออกเพื่อจบภารกิจ",
   "การเข้าประตูทางออกให้ 300 คะแนน พร้อมโบนัสตามเวลาที่เหลือ",
   "ภารกิจมีเวลา 5 นาที และเล่นซ้ำได้เพื่อทำเวลาและคะแนนให้ดีขึ้น"
  ],
  "timeLimit": 300,
  "title": "หลบมือซอมบี้ถึงวัคซีน"
 },
 "layout_brief": "Create a solo MR runner in a 2.2 x 2.5 m condominium bedroom at night. The real walls and the real bed against one wall remain visible in passthrough; replace only the floor with a dark navy miniature evacuation ground. Use a very compact zigzag route through the central clear floor, never across or onto the bed. Keep the route walking-only, with no running prompts, jump scares, moving pursuing zombies, or large props. Use the approved four-checkpoint sequence and a 0.6 m spawn circle; keep checkpoints roughly 0.5–1 m apart, all virtual props clear of real furniture, and position hazards so the player can read them before stepping and detour without moving toward the bed.\n\nRoute and checkpoints, in exact order: spawn near the lower/front end of the clear area; checkpoint 1 ‘จุดปฐมพยาบาล’ with a tiny first-aid vignette and no hazard before it; checkpoint 2 ‘ผ่านซากรถ’ with a small toy-like wrecked-car vignette; checkpoint 3 ‘ถึงตู้วัคซีน’ with the hero vaccine cabinet glowing cool mint; checkpoint 4 ‘เปิดจุดอพยพ’ with a small evacuation marker. After checkpoint 4, place the finish portal at the opposite end from spawn, visible as the final destination.\n\nUse exactly two stationary red-circle hazards, each approximately 0.35 m radius, with miniature zombie hands rising from the floor. Put the first between checkpoints 1 and 2 so it blocks the direct line and teaches the player to stop, read the floor, and walk around it. Put the second between checkpoints 3 and 4 as the climax, again with a clear slow walking detour away from the bed and walls. Do not add any other hazards or enemies.\n\nUse 2–4 compact vignettes and roughly 8–20 small low-poly, flat-shaded objects total: first-aid supplies, the miniature wreck, the mint-lit vaccine cabinet as the main hero piece, evacuation markers, sparse debris, and red warning accents. Palette: #171B2E night-blue ground, #38465A ruin gray, #E34850 crisp danger red, #72E0B8 vaccine mint, and #D9E4DD readable white. The mood is controlled suspense: dark but highly readable, with strong separation between red hazards and the mint objective. From spawn, the player should immediately see the first checkpoint, the general zigzag direction, the distant mint vaccine glow, and enough of the real room to understand the bed and wall boundaries. There are no spectators and no spectator side; keep both hazard dodges and the finish portal unobstructed in the player’s own view, with nobody required inside or outside the play area.",
 "lighting": "spooky",
 "spectator_plan": "ไม่มีผู้ชมตามบรีฟ จึงไม่จัดพื้นที่ยืนหรือกิจกรรมสำหรับผู้ชม จังหวะหลบวงแดงทั้งสองครั้งและการเข้าประตูทางออกจะมองเห็นได้ชัดจากมุมมองของผู้เล่นเอง โดยไม่ต้องมีใครเข้ามาในเขตเล่น"
}
```
