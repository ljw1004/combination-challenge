# Pastry/supper trial: continuation audit, version 1

## Decision

**No content change.** The suspected second saucepan requirement does not exist. The candidate, deterministic author, frozen trial and every pre-existing evidence file are retained byte-for-byte. This separately versioned directory adds regression and review evidence only. The candidate remains `6ab0bd320f9d286c3ce44fe07706a5d740cf15abb036f6408032253c98db1ba4`, with 185 goal-route combinations and 197 recipes.

Both `author.py` and the frozen `fresh-pastry-v1/scenario.json` specify `at: saucepan` only for flour + butter → white roux. Roux + milk → béchamel and roux + broth → velouté already have no `at` requirement. The fresh trial never attempted milk on the unplaced roux. Its successful placement is evidence of the player's choice, not proof the placement was required.

The 24 regression cases create roux at the saucepan and assert it is newly made and unplaced, then directly combine it with milk or broth. They cover both directions of the roux-making gesture, both directions of the liquid gesture, and widths 320/360/600, using `dropAction` rather than invented CLI semantics. The initial uncatalysed flour/butter attempt must still fail. A second regression replays the frozen participant's actual drops, omitting only the extra roux placement: the same discoveries and recipes result, including voluntary velouté, and both chapters complete in 22 instead of 23 attempted drops. This counterfactual is source-aware author verification, **not another player trial**.

## Physical plausibility

Real sauce does not finish merely by contacting cold milk and flour-fat paste. The existing béchamel description explicitly includes the cook continuing to stir and heat. [Escoffier, *A Guide to Modern Cookery*, section 28](https://www.gutenberg.org/cache/epub/71395/pg71395-images.html) describes milk being worked into prepared roux followed by further cooking; its alternate method also separates roux preparation from the subsequent sauce cooking. That supports compressing continuing kitchen work into the combination, not claiming heat is unnecessary. This simplified milk-and-roux construction is not the book's full formula.

Retaining the initial saucepan matters: it distinguishes cooked roux from cold pastry crumbs made with the same familiar ingredients. Repeating the placement is neither required by this abstraction nor a missing scientific step. A new rule, recipe, instructional toast or explanatory paragraph would solve the wrong problem.

## What the fresh trial does and does not show

The parent reports that fresh session `fresh_pastry_a` found shortcrust versus lamination and cold crumbs versus hot roux meaningful and inferable. It finished both scenes in 23 player actions and voluntarily explored velouté. There were no explicit hint commands. However, its first unsuccessful flour/butter attempt received the engine's automatic setting feedback; “no explicit hints” must not be relabelled “no assistance of any kind.” This is bounded fresh-agent feedback, not human enjoyment validation.

The extra roux placement remains genuine **subjective friction**. The fresh roux appears separately from the saucepan, which plausibly suggests that the cooking context needs renewing; the earlier setting failure may also have encouraged the player to generalise that rule. These are hypotheses, not established causes. The trial did not demonstrate an enforced redundant action. No shared-runtime change is justified by that inference alone.

The participant would continue briefly for unfamiliar transformations but found repeated sauce/bake steps increasingly predictable. The positive local distinctions do not validate the full 185-combination campaign. Dessert repetition and repeated heat destinations remain open design risks; adding padding would worsen them.

## Automatic handoff tradeoff

Completing puff pastry opened supper before the participant tried optional cheese twists. Preserve the user's requested automatic transition: no Continue button, forced optional dish or extra goal is introduced. Ordinary forward play can therefore miss optional discoveries.

The CLI applies the advance immediately in the same command. The current browser source schedules handoff after a **700 ms creation cue**, with existing modal/reader blocking logic. This was confirmed by source inspection, not by a browser/touch trial. The delay makes the completion perceptible; it is not a meaningful optional-exploration interval. Do not equate the CLI's abruptness with a measured browser experience or claim the browser cue eliminates the tradeoff.

## Reproduce without touching the frozen trial

From the Food candidate directory:

```sh
node --test campaign.test.ts engine/model.test.ts evidence/pastry-continuation-v1/continuation.test.ts
node evidence/pastry-continuation-v1/audit.ts
```

`protected-before.json` records all 110 pre-existing file hashes. `author-regeneration.json` shows the unmodified generator reproducing its current artifacts in a temporary directory. The separate test log and verification report belong only to this audit; the original sealed results and participant session are not overwritten.

The first new regression incorrectly expected an unplaced token's location to be `undefined`; the model explicitly represents it as `null`. The test assertion was corrected to the schema, not the runtime. That failed run is retained as `first-test-null-location-failure.log`; it is not a product defect or a discarded playtest.

Final validation: **96/96** combined candidate/runtime/regression tests, **2/2** separately rerun new regressions, **15/15** full route-width replays, and strict TypeScript checking pass. The prior full-repository build and 127-test fixture were not rerun: their candidate and runtime inputs are unchanged. None of these logical checks establishes human enjoyment or browser/touch quality.
