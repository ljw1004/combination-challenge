# Independent decision review

25 October 2026. Recommendation: **revise this slice before expanding it**. The prototype supports readable, practical construction and several viable mechanisms. It has not established sustained consequential choice, transfer advantage, or human enjoyment.

I am an evaluator with source, saved-state, and transition access. I am not a blind player. I read the project brief, [ideas](../ideas.md), [research](research.md), [research revisit](research-revisit.md), [evaluation contract](evaluation.md), development and holdout summaries, branch results, and the seven raw player traces. I also inspected representative policy failures and successes and replayed the comparisons described below. **Human participants: 0.** All player reports are AI reports; all judgments here are evaluator interpretations unless explicitly marked as measurements. Turns use the replay's zero-based indices. The observed games use build `0.4.0`, data `watershed-1`.

## Evidence cards

### 1. Understandable construction — support, limited to these agents and interface

**Measurement.** In [field-confluence-4-blind-field-a](../results/players/blind-field-a.json), turns 0–3 establish a north grove, a middle grove, a downstream channel, and an upper channel. The grove initially lets rain pass; later absorption and southward diversion agree with the player's short predictions. At turn 3 the upper channel sends one water south and the lower channel sends two south. All nine declared damage vectors match the recorded response. [blind-field-c](../results/players/blind-field-c.json) makes the same predictions with reversed offers. Across five annotated games, [evaluation.json](../results/evaluation.json) records 45 matching damage predictions and no mismatches.

**Counterevidence and rival explanation.** Correct damage vectors are narrower than correct causal models. Many later predictions are zero-damage waits on an already secure board. Exact previews are available, and the trace does not independently audit which commands a player consulted. The useful immediate interaction at turn 3 is stronger evidence than the five uneventful predictions that follow it. These are literate agents using the CLI; they do not establish browser onboarding or human readability.

**Next test.** Ask fresh players to predict both water destination and effect order in a changed arrangement before showing the exact preview. Count novel interaction predictions separately from dry or settled pulses. Preserve the full feedback afterward.

### 2. Distinct viable alternatives — support; worthwhile consequential choice — unknown

**Measurement.** [opening-route-or-roots-grow-north](../results/branches/opening-route-or-roots-grow-north.json), turn 0, takes damage `[1,1]`, while [divert-north](../results/branches/opening-route-or-roots-divert-north.json), turn 0, takes `[0,2]`: the channel actually transfers a burden between assets. Their found continuations finish at `[6,6]` and `[5,2]` respectively. [reed-north](../results/branches/opening-route-or-roots-reed-north.json) finishes at `[5,6]`. These are differences in protection and mechanism, beyond different button names.

**Concern.** The worse outcome is not automatically an interesting sacrifice. The diversion continuation repeatedly empties the same basin with Steam at turns 3–5; the grove continuation avoids that work. The search has not shown a contextual advantage that compensates for diversion's worse health and repeated interventions. In the cloudburst opening, [basin-peak](../results/branches/temporary-or-growing-basin-peak.json) reaches `[7,7]`, while [clay-relief](../results/branches/temporary-or-growing-clay-relief.json) and [grove-development](../results/branches/temporary-or-growing-grove-development.json) reach `[6,7]`. Three wins demonstrate possibility, not a balanced choice among those openings.

**Counterevidence to a depth claim.** [blind-player-turn-two-wait-too-early](../results/branches/blind-player-turn-two-wait-too-early.json), turn 2, waits and still wins `[5,5]`; [middle-outlet](../results/branches/blind-player-turn-two-middle-outlet.json) and [north-basin](../results/branches/blind-player-turn-two-north-basin.json) both win `[6,5]`. That provides a small recovery witness: postponing a useful move costs one health. It also shows that the nominal decision is forgiving. The two constructive branches then converge on channels/clay/levees under the same novelty-rewarded solver. None of the branch groups starts from a failed run, despite that requirement in the evaluation contract.

**Next test.** Preselect two publicly plausible actions, identify the advantage each buys, and compare their next few options with a continuation policy that does not reward discovery or construction count. Change one visible terrain/timing condition and test whether the preferred mechanism reverses. Include an actual plausible failed plan and recovery. Until then, keep consequential choice unknown while retaining narrow support for viable alternatives.

### 3. Immediate placement — provisional keep; causal experience claim — unknown

**Measurement.** The [development screen](../results/screen.json) records separate-action planner wins of 32/36 with zero discoveries, against field planner wins of 36/36 with mean 4.278 discoveries. Greedy relief improves from 12/36 to 36/36. That is useful evidence that the selected algorithms obtain practical benefit from cheaper access to stronger tools.

**Strong counterexample.** [separate-confluence-4-blind-separate-a](../results/players/blind-separate-a.json) discovers Grove at turn 0, places north/middle groves at turns 1–2, supplements them with Stone at turns 3–4, and wins `[3,3]`. It then waits four times. The matched annotated [field player](../results/players/blind-field-a.json) wins `[6,5]` after four construction actions, followed by five waits. Separate discovery is usable by this blind agent. The bounded planner's zero-discovery habit does not establish that separate discovery is dominated or undiscoverable.

**Interpretation.** Keep immediate placement provisionally because it connects an invention with a visible experiment and gives more room to act. Do not claim it has been shown more enjoyable, nor that separate discovery necessarily recreates arbitrary recipe guessing. The comparison changes action economy; it does not isolate the pleasure of immediate manifestation. Four field agents on one board and one separate agent are unequal, correlated coverage.

**Next test.** Match fresh runs across several boards, counterbalance offer order, and add an action-budget/time compensation for separate discovery. Compare actual commitment, understandable consequences, and settled intervals. Higher win or discovery count alone cannot select the winner.

### 4. Durable reeds — practical coherence rationale; strategic improvement — unknown

**Measurement.** In the 36 matched development games, field and rooted greedy action traces are identical in 36/36; goal-directed traces are identical in 36/36. Planner traces differ only in the twelve headwaters games; both variants still win 36/36. The [screen](../results/screen.json) shows no broad performance distinction for those deterministic policies. Random headwaters wins rise from 1/12 to 2/12; that tiny diagnostic is insufficient to establish a design benefit.

**Counterexample.** In [rooted-cloudburst-7-fresh-rooted-cloudburst](../results/players/fresh-rooted-cloudburst.json), Reeds are established at turn 4 behind a levee. They absorb one water at turn 5 and no further water. I replayed the identical action sequence using `field` instead of `rooted`: it still wins `[6,6]`. Disposable reeds with capacity two are enough for this trace. Its correct prediction of persistence is evidence of rule reading, not of durability changing a decision.

**Interpretation.** Persistent living defenses may be easier to explain and avoid future reconstruction, but the selected player example does not test that hypothesis. Neither a win nor adding Reeds to a successful plan establishes that this revision improved the core challenge.

**Next test.** Use an announced sequence with at least three relevant one-water pulses, so persistence can matter, and a publicly reasonable competing construction. Inspect whether durability changes a later choice without merely making the same script stronger. Keep the earlier disposable condition available.

### 5. Discovery and activity counts — concern about optimizer-induced evidence

**Measurement.** [policies.ts](../experiments/policies.ts) rewards known concepts in `solverValue` and `oneStepValue`; it also rewards stable structures. This helps produce coverage, but means more discoveries or construction actions are partly optimizer objectives.

In [breathing-confluence-4-planner](../results/runs/breathing-confluence-4-planner.json), zero-damage waiting wins from the state before turn 4. The planner continues placing structures, then discovers unplaced Brick at turn 9 and unplaced Reeds at turn 10. Its [profile](../results/profiles/breathing-confluence-4-planner.json) labels both discoveries unused. [rooted-headwaters-4-planner](../results/runs/rooted-headwaters-4-planner.json) can safely wait from turn 3, yet later discovers Clay and Levee, both marked unused.

I computed the following from all 36 development planner traces per condition, using ordinary replay and `settledForecast` before each recorded action:

| Condition | Total discoveries | Profile marks unused | Discoveries after zero-damage waiting already wins |
| --- | ---: | ---: | ---: |
| Field | 154 | 15 | 36 |
| Rooted | 144 | 26 | 47 |
| Breathing | 193 | 105 | 108 |

**Limits.** An optional invention may be expressive or provide a pleasing demonstration. These counts do not show it was useless to a person. Conversely, the profile's effect/ingredient ancestry credit does not establish that a discovery changed a later decision. The two columns ask different questions; neither is a fun score.

**Next test.** Add a continuation diagnostic that optimizes survival/health without novelty or structure rewards, then compare retained plans. Use action ablations and saved-state comparisons to establish when an invention is necessary, beneficial, or optional. Treat diversity-seeking runs as coverage rather than ordinary expression evidence.

### 6. Pressure and settled activity — concern; generous pressure remains an open design option

**Measurement.** All four field blind players wait turns 4–8; separate waits turns 5–8; fresh rooted waits turns 5–8; experienced rooted waits turns 4–8. For these states, replaying all remaining ordinary waits produces zero further damage. This supports the pacing concern independently of AI self-report.

The issue extends beyond visible waits. [rooted-confluence-4-planner](../results/runs/rooted-confluence-4-planner.json) has zero trailing waits but is secure before turn 4 and continues placing levees through turn 8. Across all 72 rooted planner games, development plus holdout, zero-damage waiting becomes sufficient with 2–5 turns left, mean 4.736. A low wait count concealed solved-objective activity.

**Counterevidence and limits.** The early route construction is coherent and may be a satisfying short puzzle. Easy completion does not refute that. Unnecessary actions encouraged by solver rewards are also not evidence that a human would feel compelled to perform them. What fails is the inference from activity to sustained pressure. Extra preparation in breathing increases the already settled interval; its larger discovery count does not vindicate creative room.

**Next test.** First test the implemented optional accelerated resolution with fresh players and preserve the actual water events. Existing seven player traces predate that UI change; it has mechanical verification, not experience evidence. Separately test one visible change in priority and ask whether it creates a fresh choice or forced upkeep. A short constructive puzzle with an explicit payoff is a valid direction if prolonged pressure adds little.

### 7. Transfer, controls, and holdout — unknown beyond narrow robustness

**Measurement.** [trained-rooted-cloudburst](../results/players/trained-rooted-cloudburst.json) records previous exposure to [blind-field-a](../results/players/blind-field-a.json). Against the same cloudburst seed 7, it and the [fresh player](../results/players/fresh-rooted-cloudburst.json) both win `[6,6]` and match all nine damage predictions. The experienced player makes three discoveries/four construction actions; the fresh player makes five discoveries/five construction actions. They use different reasonable routes. This is one matched pair, with ceiling performance; it cannot identify a training advantage. The earlier lesson used field rules and the test uses rooted rules, so the comparison also changes reed durability.

The field controls contain one game per annotated/action-only × normal/reversed-offer cell. All four begin with the same pair of grove actions and finish `[6,5]`, but later choices vary. This is a useful check against an obvious first-offer or annotation artifact on that board. It is not evidence that those effects are absent in the wider game. Isolation is instruction based, and agents share a model family.

**Holdout scope.** [holdout.json](../results/holdout.json) reports 36/36 wins for each rooted informed policy and 2/36 for random. It tests unseen seed numbers in the same three scenario geometries. Seeds only move one water unit between adjacent pulses. Development has 4, 7, and 6 unique schedules in headwaters/confluence/cloudburst; holdout has 6, 12, and 10. Of the holdout's unique schedules, 2, 1, and 2 respectively exactly match a development schedule. These are real schedule robustness tests, with partial overlap; they do not test new geometry, new rules, or human transfer. The all-file rooted total of 72 planner games in evaluation mixes development and holdout; use the split summaries for comparisons.

**Next test.** After this holdout is exposed, freeze new geometry and timing arrangements before further tuning. Use several independent fresh/experienced pairs, state the teaching exposure, and predict which relation should transfer. Include a case where an unchanged grove script should fail while the learned water-routing rule still helps.

### 8. Grader validity — improved during this audit; semantic inference remains incomplete

**Observed correction.** The initial aggregate evaluator marked consequential choice as support merely when `branches.json` existed. I reported this; the implementation now checks at least two winning continuations with differing measured consequences, labels that claim `viable-alternatives`, and leaves `consequential-choice` unknown. The audit also exposed the zero-wait/solved-activity problem above. Profiles now record earliest safe completion, actions after it, and unused discoveries; aggregate evaluation retains an activity-after-solved-survival concern. The experienced-player metadata initially said fresh; it now records the prior game. These corrections are genuine closed-loop grader revisions. They do not retroactively validate the original inference.

**Concern.** The eight passing adversarial fixtures supply already-coded features directly to `gradeFeatures`; they do not show the harness can extract equivalence, domination, forced chains, or meaningful plan revision from arbitrary traces. `analyzeRun` still cannot automatically establish consequential choice. The review/interpretation stage is therefore an essential part of the loop, and should remain visibly separate from mechanical features. Some aggregate support cards lack per-event causal detail even though the evaluation contract requires it; the raw evidence cited above is necessary to assess them.

**Next test.** Add real engine traces for cosmetic alternatives, one dominant opening across scenarios, optional novelty after secure survival, and a genuinely useful nonannotated interaction. Require the automated extractor plus independent reviewer to reach the expected bounded claim. Preserve rubric versions and the before/after output so grader changes cannot manufacture apparent game improvement.

## Decision and strongest argument against it

**Revise.** Preserve revealed outputs, permanent concept access, deterministic feedback, and provisional immediate placement. Treat rooted reeds as a coherent candidate with weak comparative evidence. Do not expand the recipe graph or campaign on the strength of wins, discoveries, branch count, or model praise.

The next decision gate should require a visible condition that changes the relative value of two understandable constructions, a recoverable mistake with a concrete cost, and a new rule prediction on an unseen arrangement. Compare continuation policies without novelty rewards and retain solved-state diagnostics. Then test the grader's prewritten expectations with roughly four to six actual formative participants when available. Human enjoyment, fatigue, visual readability, and desire to replay remain unknown until then.

**Strongest argument against further revision:** three substantial rules comparisons have so far produced a practical but short construction puzzle whose greedy and informed policies both saturate. All seven blind games settle early, deeper inventions are weakly justified, and no tested arrangement yet demonstrates a reason to abandon the broad grove-first habit. More exceptions or recipe content could make it busier without creating a worthwhile decision. If one focused geometry/timing experiment still leaves the same script sufficient, abandon the current attempt to sustain tactical flood pressure and compare a deliberately short construction-and-resolution game with the other researched direction. Keep the reusable harness either way.

## Reproduction notes

The additional audit measurements do not modify or rerun the saved players. For each source run, reconstruct `replay(run, i)` for every decision index `i`; the first index with `settledForecast(state).settled` is the safe-completion boundary. Count discoveries at or after that boundary. Read unused discoveries from the corresponding regenerated profile. For the reed counterexample, start `createState('cloudburst', 7, 'field')` and apply every action from the fresh rooted player with ordinary `step`; its terminal state is won with `[6,6]`. Schedule comparisons serialize `createState(scenario, seed, 'rooted').waves` across the twelve development and twelve holdout seeds. Matched action comparisons serialize only `decisions.map(d => d.action)` for field/rooted runs with the same scenario, seed, and policy.
