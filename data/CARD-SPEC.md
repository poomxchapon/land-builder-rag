# Knowledge card spec (FortalLand AI Game Design, RAG corpus)

The design AI (Kimi) retrieves 5-8 of these cards per step and must cite the ids it relied on.
Cards are retrieved by meaning (multilingual embedding bge-m3) plus tag filters, so each card must be ONE
self-contained, specific, actionable idea. No card should need another card to make sense.

File: one JSON array per category, `knowledge/cards/<category>.json`.

```json
{
  "id": "mr-daylight-washout",            // kebab-case, unique, prefix = category short name
  "kind": "principle | pattern | heuristic | question | default | genre-rule | example | pitfall | palette | style",
  "title": "Bright daylight washes out glow and dark themes",
  "text": "2-5 sentences, English, concrete. Say WHAT to decide and WHY. Use numbers when they exist (metres, seconds, counts).",
  "use_when": "one line: the situation in a brief/design where this applies",
  "do": ["short concrete actions"],
  "avoid": ["short concrete mistakes"],
  "tags": {
    "phase": ["interview", "options", "prototype", "build"],   // where it helps (1-4)
    "platform": ["mr", "pc"],                                  // or both
    "genre": ["battle", "tactics", "runner"],                  // or [] = any genre
    "feelings": ["sensation","fantasy","narrative","challenge","fellowship","discovery","expression","submission"], // MDA, may be []
    "players": ["kids","teens","adults","families","seniors","first-time-vr","gamers","groups","solo"]           // may be []
  },
  "source": "real reference (author year, work) OR \"FortalLand engine\" OR \"design practice\""
}
```

Rules
- English only in cards (the prompts are English; the embedding is multilingual so Thai briefs still match).
- Every recommendation must be BUILDABLE with the engines described in rift-builder/prompts/design.md and the
  schemas in rift-builder/ai/schema.mjs. Never suggest shooting, inventory, NPC dialogue, voice chat, crafting,
  free locomotion in MR, or any mechanic a genre's engine does not have. If a card is about a common wish the
  engine cannot do, make it a "pitfall" card that says what to offer instead.
- Sources: only cite works you are sure exist (e.g. Hunicke, LeBlanc & Zubek 2004 "MDA"; Schell, The Art of Game
  Design; Fullerton, Game Design Workshop; Koster, A Theory of Fun; Swink, Game Feel; Csikszentmihalyi 1990 Flow;
  Ryan, Rigby & Przybylski 2006 PENS/SDT; Caillois 1961 Man, Play and Games; Bjork & Holopainen 2005 Patterns in
  Game Design; Salen & Zimmerman 2004 Rules of Play; Meta/Oculus VR comfort and MR design guidelines). Otherwise
  write "design practice". Never invent page numbers or quotes. Write in your own words.
- No em-dashes. Plain sentences.
- Be specific, not generic: "Use 5-7 checkpoints in a 6 x 6 m room, 1.5-3 m apart" beats "use a good number".
- No duplicates inside your file; vary angles (players, venues, feelings, failure cases).
