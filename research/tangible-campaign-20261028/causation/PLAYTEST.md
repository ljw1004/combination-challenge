# Logical playtest protocol: A Good Hole

## Purpose and stopping condition

Test whether a **physical reversal of fitness for use** is legible and interesting without teaching causal vocabulary. This is not a test of Aristotle's whole philosophy, not a simulated human fun score, and not a validation of real materials or water behavior.

One short session ends at completion, the player choosing to stop, or a clearly recorded inability to find a next action after they have tried their plausible options and asked for the available help. Do not force a fixed number of mistakes or hide help to manufacture difficulty. For a human scheduling invitation, reserve ten minutes, not a claimed completion time.

## Test materials

- `pilot.json` or `pilot.ts`: exact candidate content.
- `play.ts`: view/action-only logical surface backed by the unchanged fork runtime.
- `route.json`: **author-only witness; do not give it to a source-blind player**.
- `pilot.test.ts`: source-aware mechanical tests, not player evidence.
- Freeze candidate hashes before the session. Record any later edits as a new version; do not silently improve content mid-session.

The player may inspect their current item/location descriptions and current goals, and may request the same partner help the browser provides. They must not inspect recipes, future scenes, tests, this research report, or the author's route. If a model is used, call it a **source-blind logical-controller session**, never a human playtest. Retain the complete visible transcript and exact actions.

## Start

Ask only:

> “Try this short combination game. Think aloud if you like. Make what the people need; you can inspect things and ask for combination help.”

Do not say “Aristotle,” “final cause,” “purpose changes goodness,” or “you will need to undo what you just made.”

```sh
node play.ts sessions/player-a.json new
node play.ts sessions/player-a.json view
node play.ts sessions/player-a.json act '{"type":"combine","a":"ITEM_ID","b":"ITEM_OR_@LOCATION"}'
node play.ts sessions/player-a.json act '{"type":"place","item":"ITEM_ID","location":"LOCATION_ID"}'
node play.ts sessions/player-a.json partners ITEM_ID
node play.ts sessions/player-a.json undo
```

The runner creates the session directory, records a source-hashed baseline, and appends each view/action/result/help request to a transcript. It prints only current player information and terse action acceptance, not recipe explanations. It automatically advances a completed scene, matching the existing UI's design rather than adding a Continue chore. It is **not** browser/touch/animation testing; coordinates are logical state only. The neutral player title is “The Workshop Bucket.”

## Observe, do not coach

Record:

1. Which combination was immediately satisfying or obvious, in the player's own words.
2. Whether they recognize the same bucket in the second scene, without being told.
3. Whether the second scene produces a prediction (“that bucket holds water; now I need it to let water through”), a surprise, simple noun matching, or indifference.
4. Whether they anticipate that drilling sacrifices the old use.
5. Attempts to preserve the original bucket, use another plausible method, or repair the new holes. These may reveal a **content limitation**, not a player error.
6. Reliance on highlighted partners versus reasoning from affordances. A player who follows every highlight can complete the pilot without using the proposed distinction.
7. Any confusion caused by the sealing pad having no new role. Merely carrying it is not counted as successful continuity.
8. Moments where the player would rather simply pour/rinse the gravel. The scene requests a through-flow sieve, but if this feels contrived, record that objection rather than defending the recipe.

Do not add explanation after a wrong pair. The ordinary interface may say no combination; the research interpretation must not be smuggled into feedback.

## Questions after play—open first, diagnostic second

Ask the first two before mentioning holes or function:

1. “What changed between the two jobs?”
2. “Was anything here more interesting than following a recipe? What?”

Then ask these concrete counterfactuals, without presenting answer options:

3. “If the roof leaked again, would you take your last bucket back? Why?”
4. “The drill made the holes. Does that tell us everything about why you made them?”
5. “If the mason cancelled before you drilled, what would you do differently?”
6. “If the washing failed because the holes were too large, what had the bucket been made for?”
7. “Could you meet the mason's need another way? Does that make your chosen way pointless?”

Questions 4–6 probe distinctions between physical production, intended end, and successful outcome. They do not become a quiz within the game. If a player supplies a good alternative that the game rejects, that is important negative evidence.

## Interpret evidence cautiously

| Observation | What it supports | What it does not support |
|---|---|---|
| Route completes | This player/controller found a legal sequence. | Fun, meaningful choice, or philosophical comprehension. |
| Spontaneous prediction of lost water-holding use | The physical contrast was salient. | Full four-causes understanding. |
| Can explain why the same feature is good for one job and bad for the other | End-relative assessment is legible. | Aristotle's natural teleology or a uniquely Aristotelian lesson. |
| Distinguishes a drill's action from the reason to drill | An explanatory distinction worth developing. | That a physical law is missing from modern science. |
| “Only the highlighted pair worked” | The pilot's linearity dominated play. | Player inadequacy; do not fix this with more exposition. |
| Enjoyed it but calls it ordinary crafting | An enjoyable craft moment, not yet the intended conceptual game. | Success on the causality goal. |

## Decision rules

- **Reject the conceptual probe** if the physical reversal is not legible without coaching.
- **Keep the concept, reject the loop** if the distinction is legible but play feels rote or contrived.
- **Investigate a choice-bearing sequel** only if both making and reversal are promising. First propose how genuine alternatives will work under the reusable-object grammar; do not silently add exclusive consumption, timers, or failure simulations.
- Never extrapolate one controller or a few humans into a success percentage. Keep quotations and uncertainties alongside the judgment.

## Current evidence status

Eighteen source-aware tests pass. No source-blind session, human session, browser session, or enjoyment evaluation has been performed in this package. The study protocol is ready; its results are not invented.
