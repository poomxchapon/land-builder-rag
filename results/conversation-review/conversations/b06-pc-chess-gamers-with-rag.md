# b06-pc-chess-gamers · WITH the knowledge base (RAG)

Model: Kimi K3.1 Pro. Same brief and same steps in both runs. The system prompts were not saved; this is the creator input and every AI output, in order.

## Creator: the game brief

```json
{
 "platform": "pc",
 "concept": "a hard chess-piece puzzle in a haunted castle",
 "players": "teen and adult gamers",
 "group_size": "solo",
 "vr_experience": "n/a",
 "feelings": [
  "challenge",
  "expression"
 ],
 "session_minutes": 10,
 "play_mode": "solo",
 "constraints": "none",
 "spectators": "friends on stream"
}
```

## AI designer: three game options

Knowledge cards retrieved for this step (9):
- cs-pc-gamers: Gamers at a PC: battle, tactics and a speedrun runner
- un-default-play-mode: Default play mode follows group size and floor size
- gn-tactics-pvp-pitfall: Tactics is not two-player chess: offer the time race instead
- pu-family-pc-home: Family game night at home on PC: take turns on a tactics board
- gn-runner-race-vs-together: Runner online modes: race for rivals, shared floor for togetherness
- cs-pc-fantasy-story: PC story fan: a short fantasy saga across three genres
- th-mda-challenge: Challenge: an obstacle the player can master
- un-default-difficulty: Default difficulty: gentle start, one harder peak
- th-mda-fellowship: Fellowship: design moments that are shared

```json
{
 "options": [
  {
   "title": "The Hollow King’s Gambit",
   "pitch": "Become the last living chess piece in a haunted castle and capture the cursed court before its guards trap you. Every board is a tight, readable puzzle that rewards clever routes and daring speed.",
   "core_loop": "Study the guard pattern, plan a legal chess-piece route, capture targets in order, then replay for a cleaner and faster solution.",
   "mechanics": "Four solo 6 x 8 tactics boards for a 10-minute session: knight with 2 slow guards, bishop with longer capture orders, rook with cracked squares and tables, then queen against 3 guards on a faster beat. Guards move on visible 3-second beats at first, tightening to 1.5–2 seconds later; attacked squares reset the attempt. A total timer and fastest-clean-run leaderboard support streaming and repeat attempts.",
   "feelings": [
    "challenge",
    "expression"
   ],
   "feelings_how": "Hard pattern-reading creates mastery, while different legal routes and speedrun lines let the player show personal style.",
   "environment_fit": "This is a PC game, so no physical venue is needed. The haunted castle fills the screen, while the board remains clearly lit and readable for both the player and stream viewers.",
   "players_fit": "Teen and adult gamers get immediate complexity, demanding later boards, and a time worth mastering without a long campaign.",
   "theme": "Stylized haunted castle with moonlit stone, ghostly court pieces, candles, cracked floors, and gargoyles",
   "lighting": "spooky",
   "route": "A zig-zag capture route across four distinct castle boards",
   "risks": [
    "The faster final board may cause repeated failures within a 10-minute session.",
    "Friends can advise on stream, but there is no multiplayer chess match or intelligent enemy pursuit."
   ],
   "axes": {
    "aesthetic": "challenge",
    "loop": "collect",
    "route": "zigzag",
    "social": "solo"
   },
   "spectator_view": "Friends on the stream see the full board, guard timing, captures, and run time. They can call out patterns, debate routes, and compare clean-run times.",
   "scores": {
    "fun": 5,
    "mr_fit": 1,
    "players_fit": 5,
    "buildability": 5
   },
   "scores_why": {
    "fun": "The requested hard chess puzzle is the central activity, with visible improvement on every retry.",
    "mr_fit": "Designed specifically for PC rather than a walking MR floor.",
    "players_fit": "Solo teen and adult gamers match the difficult boards, speedrunning, and expressive route planning.",
    "buildability": "Four code-generated, solvability-checked boards use only established tactics rules."
   },
   "confidence": "high",
   "genre": "tactics",
   "why": "This directly answers the request instead of merely decorating another genre with chess imagery. Rising guard pressure supplies challenge, while route choice and leaderboard optimization make mastery personal and watchable.",
   "sources": [
    "cs-pc-gamers",
    "gn-tactics-pvp-pitfall",
    "th-mda-challenge",
    "un-default-play-mode"
   ]
  },
  {
   "title": "Sword of the Empty Throne",
   "pitch": "Cut through the haunted castle’s cursed court and claim the throne from its spectral ruler. Careful combos, dashes, and positioning turn each enemy wave into a fast combat puzzle.",
   "core_loop": "Read enemy attacks, dash clear of warning rings, strike with three-hit combos, and adapt to each new enemy kind.",
   "mechanics": "Four solo PC battle chapters followed by a boss. Chapter 1 uses a few grunts; chapter 2 introduces shields that must be flanked; chapter 3 adds a charging beast; chapter 4 combines up to 9 enemies with falling rain rings. The player uses a sword and dash, then faces an original boss, the Hollow King, in the throne room.",
   "feelings": [
    "challenge",
    "expression"
   ],
   "feelings_how": "Enemy mixes demand mechanical skill, while combos, flanking choices, and clean dodges create a personal combat style.",
   "environment_fit": "The PC screen presents a dark castle courtyard and throne room without needing a real room. Warning rings and silhouettes use bright highlights so the spooky setting remains readable on stream.",
   "players_fit": "Experienced teen and adult gamers get active difficulty and rapid retries, with a complete challenge arc in roughly 10 minutes.",
   "theme": "Dark haunted fortress with spectral knights, torn banners, cold braziers, and a ruined throne room",
   "lighting": "night",
   "route": "A loop through connected castle combat arenas ending at the throne",
   "risks": [
    "It keeps the haunted-castle difficulty but replaces literal chess-piece puzzling with sword combat.",
    "Four enemy chapters plus a boss may feel rushed in a strict 10-minute sitting."
   ],
   "axes": {
    "aesthetic": "challenge",
    "loop": "dodge",
    "route": "loop",
    "social": "solo"
   },
   "spectator_view": "Friends see the combat, failed attempts, boss phase, and completion time on stream. They can cheer close dodges and challenge the player to replay with cleaner movement.",
   "scores": {
    "fun": 4,
    "mr_fit": 1,
    "players_fit": 4,
    "buildability": 4
   },
   "scores_why": {
    "fun": "Combat variety and a boss create an exciting alternative, though it is less faithful to the chess request.",
    "mr_fit": "This concept uses PC mouse-and-keyboard combat, not MR.",
    "players_fit": "The difficulty and solo action suit gamers, but not specifically puzzle-focused players.",
    "buildability": "The chapter ramp is supported, but several enemy combinations and the boss need more tuning than a tactics board."
   },
   "confidence": "medium",
   "genre": "battle",
   "why": "This preserves the hard haunted-castle fantasy while offering a more physical, spectacular kind of challenge. It is the strongest choice if combat mastery matters more than literal chess movement.",
   "sources": [
    "cs-pc-gamers",
    "th-mda-challenge",
    "un-default-difficulty"
   ]
  },
  {
   "title": "Checkmate Before Midnight",
   "pitch": "Race through a haunted castle as a living chess piece, touching cursed seals in sequence before the clock strikes midnight. It turns the chess fantasy into a precise, replayable speedrun.",
   "core_loop": "Memorize the route, dodge spectral floor hazards, touch every seal in order, and sprint through the exit portal faster.",
   "mechanics": "A solo WASD runner with 7 ordered checkpoints: Awaken the Pawn, Cross the Knight’s Hall, Open the Bishop’s Crypt, Pass the Rook Gate, Break the Queen’s Seal, Enter the Throne Vault, and Ring the Midnight Bell. Red circles represent ghostly grasping hands and collapsing curses; contact returns the player to the last checkpoint. The 8-minute limit, checkpoint score, hazard penalties, finish bonus, and time leaderboard encourage repeated runs.",
   "feelings": [
    "challenge",
    "expression"
   ],
   "feelings_how": "Tight hazard spacing and a visible clock reward mastery, while optimized paths and clean runs create a recognizable speedrun style.",
   "environment_fit": "The entire course is built for a PC screen, with glowing seals and red hazards standing out against the castle gloom. There is no real walking space to clear or venue lighting to manage.",
   "players_fit": "It gives solo gamers a short, difficult run with instant retries and an easy score for streaming friends to understand.",
   "theme": "Haunted castle speedrun with chess-piece statues, spectral hands, moonlit corridors, and a towering midnight clock",
   "lighting": "spooky",
   "route": "An out-and-back castle course with a faster return along the far side",
   "risks": [
    "Chess is mainly theme and checkpoint language; movement is WASD rather than legal chess-piece movement.",
    "The strict time limit can make early exploration frustrating until the route is learned."
   ],
   "axes": {
    "aesthetic": "challenge",
    "loop": "race",
    "route": "out-and-back",
    "social": "solo"
   },
   "spectator_view": "Friends watch the same course, timer, hazard failures, and finish time on stream. They can suggest route lines and compare attempts on the leaderboard.",
   "scores": {
    "fun": 4,
    "mr_fit": 1,
    "players_fit": 4,
    "buildability": 5
   },
   "scores_why": {
    "fun": "Fast retries and time optimization are compelling, but the chess connection is shallower.",
    "mr_fit": "This is a keyboard-controlled PC runner rather than an MR walking course.",
    "players_fit": "A difficult solo speedrun fits gamer players and a 10-minute session.",
    "buildability": "Seven checkpoints, standard hazards, a timer, and a portal map directly onto the runner engine."
   },
   "confidence": "high",
   "genre": "runner",
   "why": "This turns the same haunted chess premise into a compact score-attack game with the clearest streaming spectacle. It is best if repeated time trials sound more appealing than board-based reasoning.",
   "sources": [
    "cs-pc-gamers",
    "th-mda-challenge",
    "gn-runner-race-vs-together",
    "un-default-difficulty"
   ]
  }
 ],
 "recommend": 0,
 "recommend_why": "It makes literal chess-piece puzzling the heart of the requested hard solo experience while adding expressive routes and stream-friendly times."
}
```

## Creator: picks an option

Option 1 (the option the AI recommended; this step was automatic so both runs are treated the same).

## AI designer: playable prototype plan

Knowledge cards retrieved for this step (9):
- pt-flow-tactics-8min: Tactics flow, 8 minutes, 6 boards with a new piece every 2 boards
- gn-tactics-pvp-pitfall: Tactics is not two-player chess: offer the time race instead
- gn-tactics-code-places: The AI chooses numbers; code places the board and proves it solvable
- cs-pc-gamers: Gamers at a PC: battle, tactics and a speedrun runner
- pt-ka-tactics-top-view: Tactics key art: high three-quarter view of the whole 6 x 8 board
- st-tactics-piece-roles: Give each chess piece a role that matches how it moves
- gn-tactics-story-wrap: Wrap each tactics board in one story line
- cs-pc-fantasy-story: PC story fan: a short fantasy saga across three genres
- st-example-tactics: Worked tactics text (heist, adults): The Moonstone Job

```json
{
 "title": "The Hollow King’s Gambit",
 "logline": "You are the last living chess piece in a haunted castle, capturing its cursed court through four hard boards where clever routes and faster clean runs prove your mastery.",
 "pillars": [
  "Read the haunting: every threat and capture order must be legible before you commit.",
  "Move with intention: each chess piece turns its movement rules into a distinct castle fantasy.",
  "Master the rerun: solve cleanly, then refine your route and time into a performance worth streaming."
 ],
 "art": {
  "style": "Stylized low-poly 3D, flat shaded, with chunky carved chess figurines and miniature haunted-castle boards.",
  "mood": "Moonlit, elegant and ominous rather than gruesome; cold ghostlight makes tactical information readable.",
  "prompt_style": "Stylized low-poly flat-shaded 3D haunted castle chess diorama, carved figurines, cold moonlight, readable tactical board, elegant gothic menace, clean silhouettes, restrained glow",
  "palette": [
   "#11182B",
   "#D8D2C4",
   "#63D6C5",
   "#E7B85C",
   "#A83C52",
   "#67507D"
  ],
  "palette_names": [
   "Midnight stone",
   "Old ivory",
   "Ghostlight",
   "Candle gold",
   "Danger crimson",
   "Royal decay"
  ]
 },
 "key_art": {
  "caption": "The Hollow Queen faces the cursed court on the final moonlit board.",
  "prompt": "A single frame from a third-person PC puzzle game: the whole 6 by 8 checkered board seen from a high 55-degree three-quarter angle inside a ruined haunted castle hall. The player is a large ivory queen figurine with a tattered royal cloak, facing two ghostly guard pieces and one clearly glowing teal target square. Cracked stone squares, low table obstacles, candles, gargoyles and tall moonlit arches frame the board without hiding the grid. Cold blue moonlight, small warm candle pools, crimson threatened squares, flat-shaded stylized low-poly 3D, readable silhouettes, dramatic but uncluttered. No text, logos, interface or words."
 },
 "storyboard": [
  {
   "beat": "start",
   "title": "The Graveyard Leap",
   "caption": "As a spectral rider, you enter the ruined courtyard where two slow court guards mark their attacks on every visible beat.",
   "player_does": "Study the knight’s legal jumps, capture the two cursed courtiers in order, and learn to move between guard beats."
  },
  {
   "beat": "middle",
   "title": " halls of the Court",
   "caption": "The hunt deepens: a shadow bishop slips through diagonal chapel aisles, then a castle-golem rook charges through cracked galleries and broken tables.",
   "player_does": "Switch between diagonal and straight-line planning, preserve a safe route through damaged squares, and improve each attempt."
  },
  {
   "beat": "climax",
   "title": "The Hollow Queen",
   "caption": "Crowned as the queen, you face three guards on the fastest beat and pursue the last ordered captures across the throne board.",
   "player_does": "Read overlapping attacked squares, commit to a decisive route, and capture the final target before the court closes in."
  },
  {
   "beat": "end",
   "title": "A Clean Gambit",
   "caption": "The court falls silent and your total time appears beside the clean-run record, inviting one sharper performance.",
   "player_does": "Review the run, compare the leaderboard time, and restart to demonstrate a cleaner or faster solution."
  }
 ],
 "hud": [
  "Current board and chess-piece role",
  "Ordered targets remaining",
  "Total run timer and clean-run status",
  "Visible guard-beat indicator and attacked squares",
  "Fastest-clean-run leaderboard"
 ],
 "flow": [
  {
   "t": "0:00",
   "what": "Intro card establishes the last living piece, the cursed court, ordered captures and guard-beat safety."
  },
  {
   "t": "0:30",
   "what": "Board 1: the spectral knight captures 2 targets while 2 guards patrol on a readable 3-second beat."
  },
  {
   "t": "2:30",
   "what": "Board 2: the shadow bishop follows a longer diagonal capture order through the chapel."
  },
  {
   "t": "4:45",
   "what": "Board 3: the castle-golem rook crosses cracked squares and navigates tables that block straight lines."
  },
  {
   "t": "7:00",
   "what": "Board 4: the queen confronts 3 guards on a 1.5–2-second beat and completes the cursed court’s capture order."
  },
  {
   "t": "9:15",
   "what": "The final capture triggers a short silent-castle payoff, followed by total time, clean-run result and leaderboard."
  },
  {
   "t": "10:00",
   "what": "Restart from the first board to refine routes and chase a faster clean run."
  }
 ],
 "sketch": {
  "shape": "board",
  "zones": [
   {
    "name": "Piece entrance",
    "x": 0.12,
    "y": 0.82,
    "kind": "start",
    "r": 0.08
   },
   {
    "name": "Cursed court targets",
    "x": 0.58,
    "y": 0.3,
    "kind": "goal",
    "r": 0.12
   },
   {
    "name": "Guard patrol pressure",
    "x": 0.7,
    "y": 0.68,
    "kind": "danger",
    "r": 0.15
   },
   {
    "name": "Cracked chapel gallery",
    "x": 0.3,
    "y": 0.42,
    "kind": "story",
    "r": 0.12
   },
   {
    "name": "Throne-board climax",
    "x": 0.86,
    "y": 0.14,
    "kind": "boss",
    "r": 0.09
   },
   {
    "name": "Stream audience",
    "x": 0.03,
    "y": 0.06,
    "kind": "audience",
    "r": 0.03
   }
  ]
 },
 "test_questions": [
  "Can players predict which squares each guard will attack before committing to a move?",
  "Do knight, bishop, rook and queen each produce a distinctly different planning challenge?",
  "Can skilled players find meaningfully different routes rather than one obvious solution?",
  "Does the final 1.5–2-second beat feel demanding but fair within a 10-minute run?"
 ],
 "decisions": [
  {
   "what": "Game premise and setting",
   "choice": "A hard chess-piece puzzle about capturing a cursed court inside a haunted castle.",
   "by": "creator",
   "quote": "a hard chess-piece puzzle in a haunted castle"
  },
  {
   "what": "Intended players and difficulty",
   "choice": "Demanding pattern-reading and replayable mastery for teen and adult gamers.",
   "by": "creator",
   "quote": "teen and adult gamers"
  },
  {
   "what": "Board sequence",
   "choice": "Four boards: knight with 2 targets and 2 guards, bishop with a longer order, rook with cracks and tables, then queen against 3 guards.",
   "by": "option"
  },
  {
   "what": "Guard timing",
   "choice": "Begin at a visible 3-second beat and tighten to 1.5–2 seconds on the final board.",
   "by": "option"
  },
  {
   "what": "Session and competition",
   "choice": "A roughly 10-minute solo run with a total timer and fastest-clean-run leaderboard.",
   "by": "option"
  },
  {
   "what": "Piece characterization",
   "choice": "The knight is a spectral rider, bishop a sliding shadow, rook a charging castle golem, and queen the royal hero.",
   "by": "card",
   "card": "st-tactics-piece-roles"
  },
  {
   "what": "Story progression",
   "choice": "Ordered targets are members of the cursed court, and the connected board stories build from courtyard entry to the throne-board climax.",
   "by": "card",
   "card": "gn-tactics-story-wrap"
  },
  {
   "what": "Puzzle construction",
   "choice": "Design specifies piece, story and obstacle counts; code places the elements and proves every board solvable rather than promising fixed square layouts.",
   "by": "card",
   "card": "gn-tactics-code-places"
  },
  {
   "what": "Visual identity",
   "choice": "Moonlit navy stone, ivory pieces, teal targets, crimson danger and small gold candle highlights, with a clean low-poly gothic finish.",
   "by": "default"
  },
  {
   "what": "Failure and movement rules",
   "choice": "Targets must be captured in order, pieces follow their chess movement, attacked squares reset the attempt, and guards follow fixed beats rather than intelligently chasing the player.",
   "by": "engine"
  }
 ]
}
```

## Creator: approves the prototype

Approved without changes (automatic).

## AI designer: final build plan

Knowledge cards retrieved for this step (6):
- cs-pc-gamers: Gamers at a PC: battle, tactics and a speedrun runner
- st-example-tactics: Worked tactics text (heist, adults): The Moonstone Job
- gn-tactics-pvp-pitfall: Tactics is not two-player chess: offer the time race instead
- pt-flow-tactics-8min: Tactics flow, 8 minutes, 6 boards with a new piece every 2 boards
- st-tactics-piece-roles: Give each chess piece a role that matches how it moves
- gn-tactics-queen-board: Queen boards: many green rings, so the danger is reading

```json
{
 "name": "The Hollow King’s Gambit",
 "description": "Capture a haunted castle’s cursed court across four hard chess puzzles, then return to master a faster clean run.",
 "game": {
  "title": "The Hollow King’s Gambit",
  "goal": "Capture every cursed court target in order across four boards without stepping into a guard’s attack.",
  "story": "You are the last living chess piece in a castle whose court has fallen under a ghostly curse. Cross the ruined courtyard, chapel and broken galleries, taking each cursed courtier in order. Claim the queen’s crown for the throne-board finale and end the Hollow King’s reign.",
  "rules": [
   "Move only as your current chess piece allows.",
   "Capture the glowing targets in the shown order.",
   "Red attacked squares are unsafe after each guard beat; entering one resets the attempt.",
   "Cracked squares and tables constrain your route.",
   "Finish all four boards, then replay to improve your total time and clean-run record."
  ]
 },
 "config": {
  "boards": [
   {
    "piece": "knight",
    "story": "As a spectral rider, leap through the ruined courtyard and take the first two cursed courtiers between the slow guard beats.",
    "targets": 2,
    "guards": 2,
    "tables": 0,
    "cracks": 0,
    "beat": 3,
    "target_piece": "pawn"
   },
   {
    "piece": "bishop",
    "story": "As a sliding shadow, follow the chapel’s diagonals and unravel a longer capture order beneath the watching court.",
    "targets": 4,
    "guards": 2,
    "tables": 1,
    "cracks": 0,
    "beat": 3,
    "target_piece": "knight"
   },
   {
    "piece": "rook",
    "story": "As a charging castle golem, drive through the cracked galleries while broken tables cut across your straight-line routes.",
    "targets": 4,
    "guards": 2,
    "tables": 3,
    "cracks": 4,
    "beat": 2.5,
    "target_piece": "bishop"
   },
   {
    "piece": "queen",
    "story": "As the crowned queen, read the throne board’s overlapping attacks and capture the Hollow King before the fastest court closes in.",
    "targets": 4,
    "guards": 3,
    "tables": 2,
    "cracks": 2,
    "beat": 1.5,
    "king": true,
    "target_piece": "rook"
   }
  ]
 }
}
```
