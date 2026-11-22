# Design guards: the review's improvements, built and tested (19 Nov 2026)

The conversation review (`../conversation-review/report.html`) ended with six improvements. Five became code checks
("guards") in the Land Builder design steps. A guard runs on the model's answer: an answer that fails goes back to the
model with the reason, up to two times.

| # | Improvement asked for | Guard |
|---|---|---|
| 1 | The brief overrules the cards | Facts computed from the brief (play length, daylight, play mode, players at once, calm or not) are placed after the retrieved cards and checked on the answer |
| 2 | Consistency across steps | The prototype states its numbers once; the build plan repeats them and code compares; rules and layout brief are read for other numbers |
| 3 | Prove multiplayer layouts | `space.mjs`: one measured cell per walking player (0.6 m edge, 1 m between cells, 2 x 2 m minimum), a warning when they do not fit |
| 4 | Which card shaped each decision | Every key value of the build plan names its source; a card id must have been retrieved |
| 5 | Protect the requested feeling | Each feeling of the brief gets a storyboard beat; the climax delivers at least one |
| 6 | Test with real players | Not done. Prepared: `review-cards.json` (10 cards from the review's findings) and `PLAYTEST.md` (a sheet per brief, pass marks computed from the brief, results empty) |

## Result on the same 10 briefs (RAG on, one run each)

| | Contradictions (code) | Layout brief, characters | Blind verdicts for the guarded design |
|---|---|---|---|
| RAG on, before guards | 6 | 19,915 | |
| guards v1 | 0 | 14,186 | 7 of 20 (before guards 11, ties 2) |
| guards v2 | 0 | 33,516 | 15 of 20 (before guards 4, ties 1) |

Guards v1 removed every contradiction the code counts and still lost a blind review by Kimi K3 and ChatGPT: the plans
had become thinner (29% less layout detail), calm games showed a score, and a 2 m spacing rule did not fit a small
floor. Guards v2 fixed those points and won the second review (Kimi 9 / 0 / 1, ChatGPT 6 / 4 / 0).

The code counter called both versions perfect. Only the blind review showed that v1 had made the designs worse.

## Limits

- One run per brief. v2 was tuned on the reviewers' comments about these same briefs: new briefs are the fair test.
- v2 plans are longer, and length may help a design win even though reviewers were told not to reward it.
- ChatGPT still named real faults in v2 where it preferred the older design: two planets with the same coordinates, a
  point inside the 0.6 m edge of a 2.2 x 2.5 m bedroom, score language left in a kids' game.
- The counter (`consistency.json`) and the guards share rules, so its zeros are not an independent quality score.
- The solver uses the floor size only. Real obstacles are free text in the brief and are not measured.
- Kimi wrote the designs and is one of the two reviewers.
- Documents were compared. No game was built or played.

## Files

- `consistency.json`: contradictions per brief for RAG off, RAG on, guards v1 and v2, and the sources of the v2 build plans
- `reviews/summary.json`: both blind rounds, verdict and reason per brief and model; `reviews/v1-*.json`, `reviews/v2-*.json`: the full reviews, unblinded
- `space.mjs`: brief facts and the floor solver, as used by the Land Builder
- `review-cards.json`: 10 cards written from the review's findings (in the builder's index, not yet in `data/`)
- `PLAYTEST.md`: playtest sheets
