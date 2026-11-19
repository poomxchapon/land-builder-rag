## Creator: the game brief

```json
{
 "platform": "mr",
 "concept": "แข่งวิ่งผ่านด่านธีมนีออนไซไฟ",
 "players": "กลุ่มเพื่อนวัยรุ่น-วัยทำงาน",
 "group_size": "6 คนพร้อมกัน",
 "vr_experience": "เคยเล่นบ้าง",
 "feelings": [
  "challenge",
  "fellowship"
 ],
 "venue": "fortal-court",
 "indoor": true,
 "obstacles": "none",
 "environment": "Fortal court ในร่ม",
 "time_of_day": "เย็น",
 "session_minutes": 5,
 "play_mode": "race",
 "constraints": "none",
 "spectators": "ครอบครัวยืนข้างสนามฝั่งยาว"
}
```

## AI designer: three game options

```json
{
 "options": [
  {
   "title": "นีออน: ศูนย์วิกฤต",
   "pitch": "แข่งกันพาพลังงานกลับเข้าเมืองไซไฟ โดยเดินผ่านด่านนีออนสองเลนตลอดความยาวสนาม ใครหลบวงอันตรายแม่นและเข้าประตูท้ายเร็วที่สุดคือผู้ชนะ",
   "core_loop": "เดินไปจุดต่อไปตามลำดับ หลบวงอันตราย แล้วเร่งเวลาให้นำเพื่อนบนกระดานคะแนน",
   "mechanics": "เกมเส้นทางเดินแบบแข่งขัน 6 คน ทุกคนเล่นสำเนาของตัวเองพร้อมกระดานคะแนนสด มี 9 จุดตรวจตลอดสนาม ตั้งแต่รับพลังงาน ผ่านประตูด่าน ไปจนส่งแกนพลังงาน วงอันตรายเป็นกระแสไฟรั่วระหว่างจุดตรวจ เมื่อเหยียบจะกลับไปจุดตรวจล่าสุด จบที่ประตูเมืองภายใน 5 นาที",
   "feelings": [
    "challenge",
    "fellowship"
   ],
   "feelings_how": "ความท้าทายมาจากเวลา การหลบและอันดับ ส่วนความสนุกกับเพื่อนมาจากการแข่งพร้อมกัน เชียร์กันและเทียบคะแนนหลังจบ",
   "environment_fit": "ใช้ความยาว 22 เมตรของสนามในร่มทำสองเลนยาวและแสงนีออนที่อ่านชัด ไม่วางจุดใดบนประตูหรือชิดผนัง และวางด่านสุดท้ายกับประตูจบใกล้ฝั่งยาวที่ครอบครัวยืนดู",
   "players_fit": "วัยรุ่นและวัยทำงานที่เคยใช้ VR เริ่มได้เร็ว มีเรื่องให้ลุ้นทั้งระหว่างแข่งและตอนสรุปอันดับ เหมาะกับกลุ่ม 6 คนโดยเฉพาะ",
   "theme": "เมืองไซไฟเหนือพื้นหลุมพลังงาน แท่นโลหะ หอส่งสัญญาณและประตูแสงนีออน",
   "lighting": "neon",
   "route": "สองเลนยาวตลอดสนาม โค้งเล็กน้อยระหว่างจุดตรวจโดยไม่ตัดกัน",
   "risks": [
    "ผู้เล่น 6 คนยังใช้พื้นที่จริงร่วมกัน ต้องแยกตำแหน่งเริ่มและควบคุมไม่ให้ตัดเลนหรือเร่งวิ่ง",
    "ผู้ที่เหยียบอันตรายหลายครั้งอาจตามเพื่อนไม่ทันจนหมดลุ้นก่อนจบ"
   ],
   "axes": {
    "aesthetic": "challenge",
    "loop": "race",
    "social": "race",
    "route": "lanes"
   },
   "spectator_view": "ครอบครัวยืนนอกสนามฝั่งยาว เห็นผู้เล่นหลบกระแสไฟช่วงท้ายและเข้าประตูจบชัดเจน เชียร์หรือบอกจุดต่อไปได้ และดูอันดับสดบนจอผนัง",
   "scores": {
    "fun": 5,
    "mr_fit": 5,
    "players_fit": 5,
    "buildability": 5
   },
   "scores_why": {
    "fun": "ตรงกับการแข่งผ่านด่านของเพื่อน 6 คนและมีจุดลุ้นตอนท้าย",
    "mr_fit": "ใช้ความยาวสนาม 14 x 22 เมตรเต็มที่และต้องเดินจริงตามแนวคิด",
    "players_fit": "แข่งพร้อมกันได้ครบ 6 คน รอบ 5 นาที และมีกระดานอันดับสำหรับกลุ่มเพื่อน",
    "buildability": "ใช้จุดตรวจ อันตราย ประตูจบ และโหมดแข่งที่เครื่องเกมมีอยู่โดยตรง"
   },
   "confidence": "high",
   "genre": "runner",
   "why": "ตัวเลือกนี้รักษาแกนที่คุณขอไว้ครบที่สุด คือวิ่งผ่านด่านธีมนีออนไซไฟและแข่งกัน แต่ปรับจังหวะเป็นการเดินเร็วอย่างปลอดภัยใน MR ความสนุกของกลุ่มเกิดจากการลุ้นอันดับและเสียงเชียร์ ไม่ใช่กลไกช่วยเหลือกันที่เครื่องเกมไม่มี"
  },
  {
   "title": "นีออน: ฝ่าแดนยามไซเบอร์",
   "pitch": "กลายเป็นหมากบนกระดานเมืองไซไฟขนาดยักษ์ อ่านจังหวะยามแล้วเดินไปยึดเป้าหมายตามลำดับ ใครวางแผนแม่นและใช้เวลาน้อยที่สุดจะขึ้นอันดับหนึ่ง",
   "core_loop": "ดูช่องที่ยามโจมตี เลือกจังหวะเดิน แล้วไปเก็บเป้าหมายโดยไม่โดนยาม",
   "mechanics": "เกมหมากแบบแข่งเวลา 6 คนบนกระดานของตัวเอง เล่น 3 กระดานภายใน 5 นาที เริ่มด้วยม้า ตามด้วยเรือ และจบด้วยราชินี เป้าหมายเป็นคอนโซลที่ต้องยึดตามลำดับ มียามเคลื่อนที่ทุก 3 วินาที ช่องแตกและโต๊ะเป็นอุปสรรค สรุปเวลารวมบนกระดานอันดับ",
   "feelings": [
    "challenge",
    "fellowship"
   ],
   "feelings_how": "ท้าทายด้านการคิดและการอ่านจังหวะ ขณะที่เพื่อนแข่งเวลาเดียวกันและคนดูช่วยบอกช่องหรือจังหวะยามได้จากนอกพื้นที่",
   "environment_fit": "ใช้แสงในร่มทำช่องนีออนและสัญลักษณ์เตือนให้อ่านง่าย กระดานขนาดช่องไม่เกิน 1 เมตรกระจายบนพื้นที่ยาวของสนาม เว้นประตูทั้งสี่และขอบสนาม ไม่ต้องอาศัยการมองเห็นแสงเรืองจากภายนอก",
   "players_fit": "เหมาะกับเพื่อนที่ชอบแข่งแต่อยากเอาชนะกันด้วยแผนมากกว่าความเร็ว และผู้เคยเล่น VR จะเข้าใจการเดินไปยังช่องได้เร็ว",
   "theme": "กระดานหมากในศูนย์ควบคุมไซเบอร์ หมากโลหะเรืองแสงและยามหุ่นยนต์",
   "lighting": "neon",
   "route": "เส้นทางคิดแผนไปและกลับบนกระดาน เปลี่ยนแนวทางตามเป้าหมายแต่ละกระดาน",
   "risks": [
    "เปลี่ยนจากการวิ่งผ่านด่านไปเป็นเกมคิดและรอจังหวะ อาจไม่ให้ความรู้สึกเร่งรีบตามแนวคิดแรก",
    "6 กระดานพร้อมกันในห้านาทีอาจคับคั่ง ต้องจัดพื้นที่และกำหนดกติกาการตกรอบให้คนที่ช้ากว่ายังจบรอบได้"
   ],
   "axes": {
    "aesthetic": "challenge",
    "loop": "collect",
    "social": "race",
    "route": "out-and-back"
   },
   "spectator_view": "คนดูฝั่งยาวเห็นผู้เล่นหยุดคิด เปลี่ยนทิศ และหลบยามแบบตัวเป็นๆ ช่วยเชียร์หรือตะโกนบอกจังหวะได้ และติดตามเวลารวมของเพื่อนบนจอ",
   "scores": {
    "fun": 4,
    "mr_fit": 4,
    "players_fit": 4,
    "buildability": 4
   },
   "scores_why": {
    "fun": "มีความลุ้นจากการอ่านยามและแข่งเวลาแต่ไม่ใช่การวิ่งผ่านด่านโดยตรง",
    "mr_fit": "การเดินเป็นหมากใช้พื้นที่จริงได้ชัด แต่ 6 กระดานต้องจัดพื้นที่รอบตัวรัดกุม",
    "players_fit": "เหมาะกับกลุ่มเพื่อนที่ชอบท้าทายและเทียบเวลา แต่คนที่อยากเคลื่อนไหวต่อเนื่องอาจรู้สึกช้า",
    "buildability": "สามกระดานและกฎหมากมีอยู่แล้ว แต่ต้องพิสูจน์ทางแก้และจัดผังหกผู้เล่น"
   },
   "confidence": "medium",
   "genre": "tactics",
   "why": "ตัวเลือกนี้เปลี่ยนความท้าทายจากความคล่องตัวเป็นการอ่านสถานการณ์ จึงให้เกมที่ต่างจากเส้นทางวิ่งอย่างแท้จริง ยังคงนีออนไซไฟ การแข่งหกคน และเสียงมีส่วนร่วมของเพื่อนกับคนดูไว้ครบ"
  },
  {
   "title": "นีออน: ดาบพิทักษ์แกนเมือง",
   "pitch": "ถือดาบพลังงานยืนปกป้องแกนเมืองจากหุ่นยนต์ที่ไหลเข้ามาจากรอบสนาม แข่งกันผ่านสามบทและบอสให้เร็วที่สุดโดยไม่หลบพลาด",
   "core_loop": "ฟันศัตรูด้วยคอนโทรลเลอร์ขวา ก้าวออกจากวงเตือน แล้วเคลียร์ศัตรูชุดต่อไปจนถึงบอส",
   "mechanics": "เกมดาบแบบแข่งผลการเล่น 6 คนในพื้นที่ของตัวเอง มี 3 บท เริ่มด้วยศัตรูตัวเล็ก เพิ่มศัตรูถือโล่ในบทสอง และเจ้าตัวใหญ่ในบทสามก่อนสู้บอสหุ่นแกนเมือง วงแดงใต้เท้าเตือนให้ก้าวหลบ ไม่มีวิ่ง เป้าหมายคือจบภายใน 5 นาทีและเทียบผลกับเพื่อน",
   "feelings": [
    "challenge",
    "fellowship"
   ],
   "feelings_how": "ความท้าทายมาจากจังหวะฟัน การเลือกเป้าหมายและการหลบ ส่วนกลุ่มเพื่อนได้เชียร์ฉากเดียวกันและเปรียบเทียบว่าใครผ่านบอสได้ดีกว่า",
   "environment_fit": "ผนังจริงรอบสนามกลายเป็นขอบเขตของฐานเมือง และแสงในร่มทำให้ดาบกับวงเตือนนีออนชัด ใช้พื้นที่รอบตัวแทนการวางเส้นทางยาว และเก็บฉากบอสไว้ด้านที่คนดูเห็นท่าหลบชัด",
   "players_fit": "ให้บทบาทฮีโร่และท่าทางที่ดูสนุกทั้งคนเล่นและคนดู เหมาะกับผู้เคยใช้ VR และกลุ่มเพื่อนที่อยากท้าทายกันในเวลาสั้น",
   "theme": "ฐานเมืองไซไฟสีเข้มตัดแสงฟ้าและชมพู ดาบพลังงานและกองหุ่นยนต์",
   "lighting": "neon",
   "route": "ลานวงกลมรอบผู้เล่น ศัตรูเข้ามาจากขอบและจุดไคลแมกซ์อยู่ตรงกลาง",
   "risks": [
    "ไม่มีด่านเดินตามลำดับหรือเส้นทางแข่งวิ่ง จึงห่างจากแนวคิดเดิมมากที่สุด",
    "ผู้เล่น 6 คนพร้อมกันต้องมีพื้นที่ส่วนตัวพอสำหรับแกว่งดาบและก้าวหลบ หากจัดแน่นเกินไปควรลดจำนวนรอบละ 2–3 คน"
   ],
   "axes": {
    "aesthetic": "fantasy",
    "loop": "dodge",
    "social": "race",
    "route": "hub"
   },
   "spectator_view": "คนดูฝั่งยาวเห็นท่าฟันและก้าวหลบของผู้เล่นชัดที่สุดในช่วงบอส สามารถเชียร์ตามจังหวะและดูสรุปผลหลังจบ โดยไม่เข้าไปในลานเล่น",
   "scores": {
    "fun": 4,
    "mr_fit": 3,
    "players_fit": 4,
    "buildability": 4
   },
   "scores_why": {
    "fun": "ดาบและบอสสร้างฉากลุ้นได้แรงแต่ขาดความเป็นการแข่งผ่านด่าน",
    "mr_fit": "ใช้การก้าวหลบและคอนโทรลเลอร์ได้ดี แต่หกคนแกว่งดาบพร้อมกันต้องระวังพื้นที่มาก",
    "players_fit": "เหมาะกับวัยรุ่น–วัยทำงานและผู้เคยเล่น VR แต่คนที่อยากเดินเต็มสนามอาจไม่ตอบโจทย์",
    "buildability": "สามบทและบอสสร้างได้ตามระบบ แต่ต้องจัดจุดเล่นหกคนและคุมความปลอดภัย"
   },
   "confidence": "medium",
   "genre": "battle",
   "why": "ตัวเลือกนี้ให้อีกรสชาติของนีออนไซไฟ โดยเน้นความรู้สึกเป็นฮีโร่และความบันเทิงสำหรับคนดู เหมาะเป็นทางเลือกหากกลุ่มอยากเคลื่อนร่างกายและฟันมากกว่าการแข่งตามเส้นทาง แต่ต้องยอมลดจำนวนผู้เล่นต่อรอบถ้าพื้นที่ปลอดภัยไม่พอ"
  }
 ],
 "recommend": 0,
 "recommend_why": "ตรงกับไอเดียแข่งผ่านด่านนีออนไซไฟมากที่สุด รองรับเพื่อน 6 คนใน 5 นาที และเปลี่ยนสนามยาวกับผู้ชมฝั่งข้างให้เป็นส่วนหนึ่งของความสนุกได้เต็มที่"
}
```

## Creator: picks an option

Option 1 (the option the AI recommended; this step was automatic so both runs are treated the same).

## AI designer: playable prototype plan

```json
{
 "art": {
  "mood": "เร้าใจ ชัดเจน และเป็นกันเองเหมือนแข่งในเมืองแห่งอนาคต ไม่น่ากลัว",
  "palette": [
   "#10152E",
   "#00E5FF",
   "#FF3DBB",
   "#FFE66D",
   "#FF4D4D",
   "#D9F7FF"
  ],
  "palette_names": [
   "กลางคืนเมือง",
   "นีออนฟ้า",
   "นีออนชมพู",
   "พลังงานเหลือง",
   "อันตรายแดง",
   "แสงประตู"
  ],
  "prompt_style": "Stylized low-poly 3D, flat shaded, crisp neon cyan and magenta sci-fi city over a deep energy abyss, warm yellow power cores, red hazard rings, energetic friendly race mood, clear silhouettes, indoor MR readability.",
  "style": "โลว์โพลี 3 มิติ พื้นผิวเรียบแบบแฟลต เมืองไซไฟโลหะลอยเหนือหลุมพลังงาน พร้อมเส้นแสงนีออนคมชัด"
 },
 "decisions": [
  {
   "choice": "เกมเส้นทางเดินแข่งขันธีมนีออนไซไฟ ปรับจังหวะเป็นเดินเร็วเพื่อความปลอดภัย",
   "what": "แกนของเกมและธีม"
  },
  {
   "choice": "แข่งออนไลน์ 6 คน ทุกคนเล่นสำเนาเส้นทางของตัวเองและเห็นกระดานอันดับสด",
   "what": "จำนวนผู้เล่นและรูปแบบการเล่น"
  },
  {
   "choice": "สองเลนยาว 9 จุดตรวจ จากรับพลังงานถึงส่งแกนพลังงาน จบภายใน 5 นาที",
   "what": "โครงสร้างเส้นทางและความยาวรอบ"
  },
  {
   "choice": "ใช้ความยาวสนาม 22 เมตร เว้นจุดตรวจห่างผนังอย่างน้อย 0.6 เมตร และไม่วางอะไรบนประตูทั้ง 4 บาน",
   "what": "การใช้สนามจริง"
  },
  {
   "choice": "ด่านอันตรายสุดท้ายและประตูจบอยู่ใกล้ฝั่งยาวที่ครอบครัวยืนดู พร้อมกระดานอันดับบนจอผนัง",
   "what": "จุดไคลแมกซ์และมุมมองผู้ชม"
  },
  {
   "choice": "จุดตรวจ 1–2 สอนการหลบ จุดที่ 3 พลิกเรื่อง จุด 4–6 หนาแน่นขึ้น จุดที่ 7 เป็นช่วงพักชมวิว แล้วเร่งความท้าทายที่จุด 8–9",
   "what": "จังหวะความยากในรอบ 5 นาที"
  },
  {
   "choice": "ไคลแมกซ์คือทางแคบเหนือหลุมพลังงาน วงไฟรั่วสองชุดก่อนส่งแกนพลังงานและเข้าประตูเมือง",
   "what": "ช่วงดราม่าและฉากจบ"
  },
  {
   "choice": "ทางเดินกว้างอย่างน้อย 1.2 เมตร แยกจุดเริ่ม 6 คน ห้ามตัดเลนหรือวิ่ง และไม่มีภารกิจที่ต้องเงยหน้าขณะเดินเร็ว",
   "what": "ข้อควบคุมความปลอดภัย"
  },
  {
   "choice": "แตะจุดตรวจตามลำดับได้จุดละ 100 คะแนน เหยียบวงอันตรายเสีย 25 คะแนนและกลับจุดตรวจล่าสุด เข้าประตูได้ 300 คะแนนบวกโบนัสเวลา",
   "what": "กฎคะแนนและผลของอันตราย"
  }
 ],
 "flow": [
  {
   "t": "0:00",
   "what": "การ์ดเรื่องเล่าว่าเมืองกำลังดับไฟ ผู้เล่นแยกยืนที่จุดเริ่มและรับแกนพลังงาน"
  },
  {
   "t": "0:15",
   "what": "ผ่านจุดตรวจ 1–2 บนทางกว้าง เรียนรู้การเดินตามลำดับและหลบวงกระแสไฟรั่วชุดแรก"
  },
  {
   "t": "1:15",
   "what": "ถึงจุดตรวจ 3 เปิดประตูด่านกลาง เรื่องพลิกเมื่อหลุมพลังงานเริ่มกลืนแท่นเมือง"
  },
  {
   "t": "2:00",
   "what": "ผ่านจุดตรวจ 4–6 ด้วยวงอันตรายที่ถี่ขึ้นและทางโค้งเล็กน้อย โดยยังรักษาทางเดินให้ชัด"
  },
  {
   "t": "3:15",
   "what": "จุดตรวจ 7 เป็นช่วงพักสั้นไม่มีอันตราย มองเมืองนีออนและหอส่งสัญญาณเหนือหลุมพลังงาน"
  },
  {
   "t": "3:45",
   "what": "เข้าสู่จุดตรวจ 8–9 หลบวงไฟรั่วสองชุดบนสะพานแคบ แล้วส่งแกนพลังงานใกล้ฝั่งผู้ชม"
  },
  {
   "t": "4:35",
   "what": "เดินเข้าประตูเมือง เมืองสว่างขึ้นและระบบสรุปคะแนนกับโบนัสเวลา"
  },
  {
   "t": "4:50",
   "what": "ดูกระดานอันดับสดบนจอผนัง เชียร์ผู้ที่ยังไม่จบและเทียบผลกับเพื่อนทั้งหมด"
  }
 ],
 "hud": [
  "จุดตรวจถัดไปและลำดับที่ต้องไป",
  "คะแนนปัจจุบัน",
  "เวลาที่เหลือจาก 5 นาที",
  "อันดับสดของผู้เล่น 6 คน",
  "ป้ายเรื่องสั้นเมื่อถึงจุดตรวจสำคัญ",
  "ผลคะแนน โบนัสเวลา และอันดับเมื่อจบ"
 ],
 "key_art": {
  "caption": "ก้าวสุดท้ายเหนือหลุมพลังงาน ก่อนประตูเมืองนีออนจะเปิด",
  "prompt": "First-person view through a Quest 3 mixed-reality headset at the dramatic finish of a six-player walking race. The real indoor Fortal sports court remains clearly visible: real walls, four doors along one long wall, steady indoor ceiling light, and real families watching safely beyond the long sideline. Only the floor is transformed into stylized low-poly flat-shaded sci-fi scenery: a narrow safe metal walkway above a deep luminous energy abyss, floating city platforms, signal towers, cyan and magenta neon light gates. Two crisp red circular electrical hazard rings sit on the walkway just ahead, with a clear route around them. A large white-cyan portal glows at the far end near the spectators. One real player is visible outside the play route near the finish, seen only as a body stepping carefully, with no virtual overlay. Dramatic but friendly, readable indoors, 1:1 real-world scale. One single gameplay frame, no text, no logos, no interface, no weapons."
 },
 "logline": "คุณคือผู้ส่งพลังงานที่ต้องเดินแข่งกับเพื่อน 5 คน ผ่านเมืองไซไฟที่กำลังพัง หลบกระแสไฟรั่วและคืนแสงสว่างให้เมืองก่อนใคร",
 "pillars": [
  "เดินเร็วอย่างปลอดภัยและอ่านทางได้ทันที",
  "ทุกด่านสร้างความลุ้นกับอันดับของเพื่อน",
  "ฉากสำคัญต้องทำให้ผู้ชมข้างสนามเชียร์ได้"
 ],
 "sketch": {
  "path": [
   [
    0.18,
    0.9
   ],
   [
    0.18,
    0.8
   ],
   [
    0.3,
    0.7
   ],
   [
    0.3,
    0.58
   ],
   [
    0.42,
    0.48
   ],
   [
    0.32,
    0.38
   ],
   [
    0.22,
    0.28
   ],
   [
    0.3,
    0.18
   ],
   [
    0.48,
    0.12
   ],
   [
    0.68,
    0.1
   ]
  ],
  "shape": "route",
  "zones": [
   {
    "kind": "start",
    "name": "จุดเริ่ม 6 คนแยกตำแหน่ง",
    "r": 0.07,
    "x": 0.18,
    "y": 0.9
   },
   {
    "kind": "story",
    "name": "รับแกนพลังงาน",
    "r": 0.05,
    "x": 0.18,
    "y": 0.8
   },
   {
    "kind": "story",
    "name": "หลุมพลังงานเริ่มกลืนเมือง",
    "r": 0.06,
    "x": 0.3,
    "y": 0.58
   },
   {
    "kind": "danger",
    "name": "วงไฟรั่วหนาแน่น",
    "r": 0.07,
    "x": 0.42,
    "y": 0.45
   },
   {
    "kind": "story",
    "name": "ช่วงพักชมหอส่งสัญญาณ",
    "r": 0.06,
    "x": 0.22,
    "y": 0.28
   },
   {
    "kind": "danger",
    "name": "สะพานไคลแมกซ์และวงไฟสองชุด",
    "r": 0.08,
    "x": 0.48,
    "y": 0.14
   },
   {
    "kind": "goal",
    "name": "ประตูเมืองใกล้ผู้ชม",
    "r": 0.06,
    "x": 0.68,
    "y": 0.1
   },
   {
    "kind": "audience",
    "name": "ครอบครัวและจออันดับฝั่งยาว",
    "r": 0.12,
    "x": 0.91,
    "y": 0.3
   }
  ]
 },
 "storyboard": [
  {
   "beat": "start",
   "caption": "ไฟในเมืองนีออนดับลง ผู้เล่น 6 คนยืนแยกจุดเริ่ม พร้อมแท่นรับแกนพลังงานและเส้นทางสองเลนที่ทอดยาวเต็มสนาม",
   "player_does": "ฟังเรื่องสั้น ดูจุดตรวจแรก แล้วเดินไปรับแกนพลังงาน",
   "title": "เมืองกำลังดับ"
  },
  {
   "beat": "middle",
   "caption": "ประตูด่านกลางเปิดออก เผยหลุมพลังงานใต้เมือง วงกระแสไฟรั่วเริ่มถี่ขึ้นและกระดานอันดับทำให้ทุกก้าวมีความหมาย",
   "player_does": "เดินผ่านจุดตรวจตามลำดับ เลี่ยงวงสีแดง และดูอันดับตนเอง",
   "title": "หลุมพลังงานตื่นขึ้น"
  },
  {
   "beat": "climax",
   "caption": "บนสะพานโลหะใกล้ฝั่งครอบครัว วงไฟรั่วสองชุดปิดทางตรง เหลือช่องโค้งที่ต้องอ่านให้ขาดก่อนส่งแกนพลังงาน",
   "player_does": "ชะลอจังหวะ เลือกช่องว่าง เดินหลบอันตราย และแตะจุดตรวจสุดท้าย",
   "title": "สะพานก่อนเมืองตื่น"
  },
  {
   "beat": "end",
   "caption": "ประตูเมืองเปิดรับแสงสีขาวฟ้า ตึกนีออนสว่างขึ้น และอันดับสุดท้ายปรากฏบนจอผนังให้เพื่อนและครอบครัวเห็นพร้อมกัน",
   "player_does": "เดินเข้าประตูจบ รับคะแนนและโบนัสเวลา แล้วเชียร์เพื่อนที่เหลือ",
   "title": "คืนแสงให้เมือง"
  }
 ],
 "test_questions": [
  "ผู้เล่นอ่านช่องทางปลอดภัยรอบวงไฟรั่วได้ทันโดยไม่ต้องวิ่งหรือไม่",
  "จุดเริ่ม 6 คนและสองเลนช่วยให้ไม่มีใครตัดหน้าหรือเข้าใกล้กันเกินไปหรือไม่",
  "ช่วงพักที่จุดตรวจ 7 ทำให้ผู้เล่นพร้อมสำหรับด่านท้ายโดยไม่เสียจังหวะการแข่งหรือไม่",
  "ครอบครัวฝั่งยาวเห็นการหลบครั้งสุดท้ายและการเข้าประตูชัดพอที่จะเชียร์ได้หรือไม่"
 ],
 "title": "นีออน: ศูนย์วิกฤต"
}
```

## Creator: approves the prototype

Approved without changes (automatic).

## AI designer: final build plan

```json
{
 "description": "แข่งเดินหลบกระแสไฟรั่วในเมืองไซไฟ คืนพลังงานให้เมืองและขึ้นอันดับหนึ่งก่อนเพื่อน",
 "game": {
  "goal": "ผ่านจุดตรวจทั้ง 9 จุดตามลำดับ หลบกระแสไฟรั่ว แล้วเข้าประตูเมืองให้เร็วที่สุด",
  "rules": [
   "เดินไปแตะจุดตรวจทั้ง 9 จุดตามลำดับ ห้ามข้ามจุด",
   "แยกเลนและจุดเริ่มของตัวเอง ห้ามตัดเลนหรือวิ่ง",
   "เหยียบวงกระแสไฟสีแดงจะเสีย 25 คะแนนและกลับไปจุดตรวจล่าสุด",
   "จุดตรวจแต่ละจุดให้ 100 คะแนน เข้าประตูเมืองให้ 300 คะแนนบวกโบนัสเวลา",
   "จบการแข่งขันภายใน 5 นาที และดูอันดับสดเพื่อลุ้นกับเพื่อนทั้ง 6 คน"
  ],
  "story": "ไฟทั่วเมืองนีออนกำลังดับลง และหลุมพลังงานใต้เมืองเริ่มกลืนแท่นโลหะทีละชิ้น คุณคือหนึ่งในผู้ส่งพลังงาน 6 คนที่ต้องนำแกนพลังงานข้ามด่านไฟรั่วไปยังประตูเมือง เดินให้แม่น อ่านทางให้ไว และคืนแสงสว่างให้เมืองก่อนเพื่อนของคุณ",
  "timeLimit": 300,
  "title": "นีออน: ศูนย์วิกฤต"
 },
 "layout_brief": "MR runner race for 6 simultaneous players at Fortal court (XR Arena), Chiang Mai, a 14 x 22 m indoor court with real walls, painted lines, four doors along one long wall, and no real obstacles. Each player walks their own copy of the Land with a live leaderboard; the real surroundings remain visible. Build a neon low-poly, flat-shaded sci-fi city of floating metal platforms over a glowing energy abyss, with cyan and magenta light strips, yellow power cores, red electrical hazard rings, signal towers, and a white-cyan city portal. Use two long, gently bending lanes spanning the full 22 m court; the lanes must never cross. Keep a physically clear walking corridor at least 1.2 m wide throughout, all content at least 0.6 m from walls, and the four real doors completely clear. Provide six separated spawn positions with an unobstructed view down the long neon route toward the city gate and signal tower.\n\nPlace exactly 9 ordered checkpoints, spaced approximately 2.5–9 m apart, with these labels: 1) “รับแกนพลังงาน” at a bright yellow core pedestal; 2) “ผ่านประตูย่านเงา” at the first neon gate; 3) “เปิดประตูด่านกลาง” at the central gate where the energy abyss becomes dramatic; 4) “ข้ามแท่นพลังงาน” among suspended metal platforms; 5) “ต่อสายส่งกระแส” beside a cyan power conduit; 6) “หลบกระแสไฟรั่ว” after the densest mid-route hazard group; 7) “พักที่หอส่งสัญญาณ” in a hazard-free scenic pause with a clear view of the tower and city; 8) “ข้ามสะพานสุดท้าย” on the visually narrow climax bridge; 9) “ส่งแกนพลังงาน” at the final core receiver. After checkpoint 9, place the finish portal as the city gate, with the city visibly brightening around it.\n\nUse red circular electrical-leak hazards only between checkpoints. Put one sparse, easy-to-read hazard set between checkpoints 1–2 to teach dodging. Increase density gradually between checkpoints 4–6 using staggered circles and gentle bends while preserving an obvious safe route. Leave checkpoint 7 and its approach calm and hazard-free. For the climax between checkpoints 8–9, use two distinct hazard groups on a bridge that looks narrow over the abyss but still retains the required 1.2 m safe corridor; leave readable curved gaps rather than blocking the direct line. Avoid tasks requiring players to look up while moving.\n\nFamilies watch from outside the court along the long spectator side, where the wall leaderboard screen is visible. Position the final two electrical hazard groups, checkpoint 9, and the finish portal near that long side so spectators can clearly see the dodge and finish. The spawn view should immediately communicate a friendly, energetic race: a glowing core ahead, two readable neon lanes, a deep stylized abyss below the scenery, and the luminous city portal in the distance.",
 "lighting": "neon",
 "name": "นีออน: ศูนย์วิกฤต",
 "spectator_plan": "ครอบครัวยืนนอกสนามตลอดฝั่งยาว โดยไม่เข้าไปในเส้นทางเดิน จะได้เห็นช่วงหลบกระแสไฟสองชุดบนสะพานท้ายเกมและการเข้าประตูเมืองอย่างชัดเจน ช่วยเชียร์หรือบอกจุดต่อไปจากข้างสนามได้ และร่วมลุ้นอันดับสดกับผลสุดท้ายบนจอผนัง"
}
```
