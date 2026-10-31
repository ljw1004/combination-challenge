# Playtest record

Build `0.4.0`, data `watershed-1`. Initial diagnostic rubric `evidence-1`; audited profiles use `evidence-2`. All work in this record was executed. Read [evaluation.md](evaluation.md) for the broader proposed protocol; not every proposed experiment was performed. Raw captures and generated profiles are retained.

## Mechanical verification

- **28 engine/grader tests pass.** Flow conservation and column ordering, grow/mature timing, routing side effects, concept permanence, basin/heat interaction, correct forecasts, exact previews, immutable transitions, bounded endpoints, replay/tamper checks, branching, optional safe completion, and adversarial grading. A real solver trace protects the settled-activity correction as a regression.
- **64,227 transitions checked** by [verification.json](../results/verification.json): every legal two-action sequence from seed1 in three scenarios × four rules, plus full witness runs. This is exhaustive shallow checking, not exhaustive whole-game search.
- **36/36 winning replayable witnesses** for selected rooted rules across three scenarios × seeds1–12. One historical separate/confluence/seed1 solver search fails; this is not an impossibility proof. All chosen openings avoid immediate unavoidable losses in the tested scope.
- **9 Chromium browser tests pass**, including actual card selection, free preview, keyboard commitment/focus, undo/seek/branch, blocked bedrock, replacement warning, ingredient disabling, export/import equality, safe completion/win/next, loss/retry, desktop and mobile width. [Machine results](../results/browser-results.json), [desktop](../results/desktop-initial.png), [mobile](../results/mobile-game.png).
- Production build passes. Tested Node25.2.1/npm11.6.2. Chromium mobile viewport390×844 is not a physical-device or human readability test.

## Candidate comparison

[candidate-screen.ts](../experiments/candidate-screen.ts) runs96 games: two small independent models × four policies × twelve seeds. Both models admit shallow informed wins. The flood can be solved with one derived capability; the opponent with repeated mud or a fixed gate chain. Those results rejected the toy implementations. They do not estimate the selected production prototype's quality. [Concept sketches and exact screen](concepts.md).

## Production development screen

Three encounters (`headwaters`, `confluence`, `cloudburst`), seeds1–12. Each policy plays36 games per variant: four variants × four policies ×36 = **576 captures**. Policy seed is scenario seed+10000; random mixes that seed before sampling to avoid correlated adjacent-LCG openings.

| Rules | Random wins | Greedy wins | Goal heuristic wins | Privileged beam wins | Beam mean discoveries |
| --- | ---: | ---: | ---: | ---: | ---: |
| Separate discovery | 0/36 | 12/36 | 12/36 | 32/36 | 0.00 |
| Invent in place | 1/36 | 36/36 | 36/36 | 36/36 | 4.28 |
| Rooted reeds | 2/36 | 36/36 | 36/36 | 36/36 | 4.00 |
| Two preparation turns | 6/36 | 36/36 | 36/36 | 36/36 | 5.36 |

[Full split results](../results/screen.json), [all captures](../results/runs/). Random samples displayed legal actions uniformly, including equivalent recipe aliases. Greedy minimizes exact immediate damage with a small tie preference for retained protection. Goal adds a public-rule stability heuristic. Both use the same one-turn preview available in the browser. The beam solver has privileged transition/model access, width6, depth3, with three additional passive turns in its evaluator. Its failure to find a win proves nothing about unreachability.

The beam and goal heuristics reward stability/novelty, so discovery counts are confounded.15/154 field,26/144 rooted and105/193 breathing planner discoveries have no observed useful effect or useful ingredient descendant.36,47 and108 respectively occur after the first state where all remaining waits already win without damage. These are separate diagnostics. Neither is a measure of curiosity or fun.

### Held-out timing screen

Reserved before selection:101,203,307,409,503,607,709,811,907,1009,1103,1201. Evaluated selected rooted rules only, three encounters, four policies = **144 captures**. [Holdout results](../results/holdout.json).

Random wins2/36; greedy, goal and beam each win36/36. Seeds shift one water unit between neighboring pulses, preserving total rain. Geometry varies between three scenarios, not between their seeds. Development schedules have4/7/6 unique forecasts; holdout6/12/10, with2/1/2 unique holdout schedules overlapping development. This is narrow timing robustness, not generalization to unseen geometry. The holdout is now exposed; future tuning needs new cases.

## Seven instructed blind-agent sessions

Six fresh agents plus one follow-up session; inherited `gpt-6.1-sol`, no model diversity. [Reusable exact interface/prompt](../experiments/PLAYER_PROTOCOL.md). Agents received only public effect rules, current concepts, all legal novel recipes, visible world state and full forecast. One-step previews were permitted; every player reported using none. Source/trace access was prohibited by instruction, not a technical sandbox. There is no independent command-audit guarantee. No branching or multi-step search was reported.

| Capture | Condition | Outcome/health | Constructions | Trailing waits | Checked damage predictions |
| --- | --- | --- | ---: | ---: | ---: |
| [blind-field-a](../results/players/blind-field-a.json) | Field, confluence4; fresh, annotated, normal offers | Won[6,5] | 4 | 5 | 9/9 |
| [blind-field-b](../results/players/blind-field-b.json) | Same, action-only, reversed offers | Won[6,5] | 4 | 5 | None |
| [blind-field-c](../results/players/blind-field-c.json) | Same, annotated, reversed offers | Won[6,5] | 4 | 5 | 9/9 |
| [blind-field-d](../results/players/blind-field-d.json) | Same, action-only, normal offers | Won[6,5] | 4 | 5 | None |
| [blind-separate-a](../results/players/blind-separate-a.json) | Separate, confluence4; fresh, annotated, normal | Won[3,3] | 5 including one unplaced discovery | 4 | 9/9 |
| [trained-rooted-cloudburst](../results/players/trained-rooted-cloudburst.json) | Rooted, cloudburst7; retains field-a experience | Won[6,6] | 4 | 5 | 9/9 |
| [fresh-rooted-cloudburst](../results/players/fresh-rooted-cloudburst.json) | Rooted, cloudburst7; fresh, annotated, normal | Won[6,6] | 5 | 4 | 9/9 |

Here constructions means non-wait decisions, including separate discovery. The four field controls cross annotation yes/no and normal/reversed offer order on one board; one game per cell. They all use a pair of early groves, but later constructions differ. This checks for an obvious artifact on this case; it cannot rule out order/annotation effects generally. The separate comparison has unequal player coverage. Fresh/experienced cloudburst is one pair, both winning with equal health; it does not establish a transfer advantage. No fresh planning sessions were run on every development seed; that broader proposed protocol remains unexecuted.

All45 declared damage vectors match. Many are settled zero-damage waits, so this is narrower than45 novel interaction predictions. The experienced player's metadata initially inherited the CLI's generic fresh label; audit corrected the exposure label without altering any decisions. Player c requested action syntax and once ran the CLI without arguments, receiving an error with a usage-source line. This incidental interface line contained no strategy; the CLI now prints explicit help and sanitized errors. The two early players caught duplicate weather/variant text errors, which were corrected.

### Concrete decisions and counterexamples

- **A plan with visible consequences.** Field-a turns0–3: grow a north grove, grow a middle grove, create the middle downstream outlet, then channel northern overflow south. At the peak, the groves remove two each and the channel chain removes overflow. All four field players report early construction as the useful part and later waiting as repetitive. These are AI reports, supported by the trace's changing flow.
- **A distinct alternative.** Field-b uses a finite north basin instead of an upper channel. Field-d uses a middle basin instead of channels. All finish[6,5]. This supports mechanism variety; the agents have little pressure to compare deeper recipes.
- **A transferred relation, without a transfer effect estimate.** The experienced cloudburst player uses a downstream basin where bedrock blocked its previous channel geometry. The fresh player independently shelters a grove with a basin, then builds a middle levee and downstream reeds. Both win[6,6]. The fresh player's reeds absorb once; disposable reeds would also suffice.
- **Recovery witness.** At field-a's saved turn2, waiting instead of creating the outlet still admits a winning continuation, ending[5,5] rather than[6,5]. The mistake has a cost and a recovery; its mildness also limits claims about tension.
- **Retained failure.** `separate-confluence-1-greedy` loses after repeatedly using base interventions; the bounded solver also loses this case. A different blind player's Grove discovery wins confluence4, so algorithm failure must not become a claim that discovery is impossible or the whole variant unfair.

[Nine branch continuations](../results/branches.json) replay the same public-cue choices and bounded solver continuations. Several alternatives win with different costs; the reviewer notes that a worse channel continuation is not yet shown to buy a compensating advantage. The branch set contains no branch selected from an actual failed run, a remaining gap in the proposed evaluation contract.

## Pacing and grader audit

All seven blind runs become safe before their last4–5 waits. Every rooted beam run,72 development+holdout games, can safely finish2–5 turns before its recorded end, mean4.736. The beam's zero trailing-wait metric hid additional levees and novelty inventions after safety. The grader now computes earliest safe completion independently of activity, and reports unused discoveries.

An independent evaluator also caught an initial aggregate bug: choice support depended only on a branch file's presence. The corrected evaluator measures distinct viable consequences and leaves worthwhile choice unknown for semantic review. Eight adversarial supplied-feature fixtures pass; real tests also preserve an eloquent wrong prediction and reject late-collection novelty as practical effect. This tests our instrument, not just the game. [Full independent review](decision-review.md).

The optional final-interface safe-resolution control is mechanically and browser tested. The historical blind traces document the problem it addresses; they do not test whether people prefer the solution. Automatic pulses are distinguished from manual actions in new traces.

## Human findings

**Participants0.** Enjoyment, emotional pressure, fatigue, voluntary replay and visual clarity for newcomers remain unvalidated. No human quotations, scores or preferences were generated. The next formative test should compare actual experiences with the grader's prewritten predictions, allowing disagreement to revise the grader.
