# Closed story trials: independent replay verification

## Result

**All 10 requested closed trials exactly reproduce against their frozen local runtimes.** There are no saved-game/event/log consistency mismatches. Authored setup was independently reproduced and excluded from every fresh metric. This is reproducibility evidence, **not evidence of human enjoyment or native-browser usability**.

The run checked full saved games (state, history and events), not only acceptance counts. It also independently replayed each command from the earned baseline and compared every recorded result, player-visible view and stage. All 105 original inputs read by the verifier retained their observed SHA-256 bytes throughout the run. No original session, source, manifest or existing evidence file was written.

## Fresh-only metrics

“User moves” means explicit `combine` or `drop` commands. A/R are accepted/rejected user moves. “Engine A/T” includes automatic stage-advance events. Reads and highlights are explicit `read` and `partners` commands. They do not measure comprehension. No trial used undo.

| Trial | Authored events excluded | Fresh user moves | A/R | Reads | Highlights | Engine A/T | Advances | Ending |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Doctrine v5 g | 14 | 3 | 3/0 | 6 | 0 | 4/4 | 1 | Desk 3 → 4; assigned boundary |
| Doctrine v5 h | 43 | 6 | 4/2 | 4 | 1 | 4/6 | 0 | Stopped on desk 7 |
| Doctrine v6 i | 43 | 6 | 6/0 | 3 | 0 | 7/7 | 1 | Desk 7 → 8; assigned boundary |
| Doctrine v8 m | 18 | 5 | 5/0 | 6 | 0 | 6/6 | 1 | Desk 4 → 5; assigned boundary |
| Doctrine v8 n | 24 | 6 | 5/1 | 11 | 0 | 6/7 | 1 | Desk 5 → 6; assigned boundary |
| Doctrine v8 o | 29 | 5 | 5/0 | 5 | 0 | 6/6 | 1 | Desk 6 → 7; assigned boundary |
| Doctrine v8 p | 41 | 7 | 6/1 | 7 | 1 | 7/8 | 1 | Final desk completed |
| Atlas v2 b | 0 | 25 | 21/4 | 7 | 2 | 24/28 | 3 | Chapters 1–3; stopped on arrival at 4 |
| Atlas v3 longitude_b | 133 | 17 | 14/3 | 5 | 5 | 15/18 | 1 | Chapter 15 → 16 |
| Atlas v3 future_b | 258 | 36 | 28/8 | 11 | 3 | 31/39 | 3 | Chapters 27–29; game completed |

Longitude's 14 accepted user moves are **13 combinations plus one placement**, not 14 combinations. All other accepted user moves above are combinations. `fresh_future_b` metadata says `stopped`, while its game state has `completed: true`; that is consistent with its harness, which records a stop status separately from game completion. Doctrine p has `status: completed`, including after its recorded stop command, because its harness overwrites metadata status whenever the game is complete.

These heterogeneous checkpoints should not be pooled as an enjoyment or success-rate experiment. The 603 authored setup events are not fresh play.

## Semantic mismatch findings

All **19** rejected moves have both operands present in the current area and **no recipe for that unordered pair of item kinds**. None of these rejections is explained by an absent operand, reversed drag direction, already-created output, or a location gate on an existing pair. The complete operands, component labels, matching-recipe checks and live partner hints are in `story-trial-results.json`.

1. **A precisely identifiable v5 failure is repaired in v6.** On v5 h, `household-priority + neighbour-priority` rejects with “No new combination here.” No matching recipe exists in v5. On v6 i, the exact pair succeeds as `pastoral-priorities` via `care-from-two-priorities`, and the participant reaches the next desk without hints or rejects. This verifies this particular semantic union, not general ease or fun. V5 h's earlier `indulgence-letter + repentance` rejection also remains accurately preserved.
2. **Latest Doctrine v8 is not rejection-free.** Trial n rejects `spiritual-baptism + gospel-and-hands`; it then succeeds with `ritual-leaf + gospel-and-hands` to establish an embodied rite. Trial p rejects `free-service + body-discipline`, requests a highlight, and succeeds with `body-discipline + promise-of-christ`. Both rejected pairs connect visibly related ideas, but are outside the authored graph. This is a semantic-affordance concern, not a replay defect. Neither m nor o has a reject or highlight.
3. **Atlas opening still requires specific intermediate representations.** B rejects `older-eclipses + night-records` before building a dated tablet; `matched-records + next-dates` and `month-counts + matched-records` before making the reckoning/cycle tables; and `rival-cause + next-watch` before creating the rival-prediction card. All four rejections are exact. The trial proceeds through the three requested opening chapters, but completion alone does not establish that these extra representations feel necessary.
4. **Longitude has two especially direct arithmetic affordance gaps.** `time-difference + rotation-card` rejects despite their labels supplying a time difference and Earth's 360°/24-hour turn. The accepted path first combines `rotation-card + merchant-manual` to make `time-angle-rule`. `cleared-lunar-angle + nautical-table` rejects; the accepted path first combines `nautical-table + predictive-sky-record` to make `lunar-time-scale`. The third rejection, `clock-longitude + lunar-longitude`, occurs before clock correction; that missing correction carries substantive case meaning. The logged rejection is **not** a sea-trial placement failure: no matching raw-clock/lunar pair exists. One later placement is accepted and necessary to the recorded path.
5. **Future cases preserve eight rejected joins across all three chapters.** They are `growth-rivals + trial-menu`; `competing-growth-predictions + trial-menu`; `distinguishing-trial + sealed-chamber`; `branching-recollection + photographic-archive`; `day-night-record + cycling-facade`; `unequal-city + revisable-agreement`; `changed-city + learning-observatory`; and `changed-city + seasonal-city-rule`. Some missing intermediates have a clear explanatory purpose (for example, instrumenting the chamber before observing it); others are plausible alternative ways of expressing an already-visible connection. The final pair succeeds only as `changed-city + adaptive-cycle` after the third highlight. The evidence establishes strict pair selection, not that every rejection is an authoring error.
6. **Atlas's logical-player surface suppresses rejection explanations.** Its model records “No new combination here.” for all 15 Atlas rejects, but each player command's result exposes only `accepted: false`. Doctrine exposes that generic message. Therefore these Atlas logs must not be described as having given explanatory feedback; none was present in the recorded rejection result.

The design interpretations above concern internal labels and accepted graph operations. This verification did not re-audit the historical/theological primary sources or judge those ideas' truth.

## Integrity and provenance limits

- **Doctrine v5/v6/v8:** every entry in each `pilot-integrity.json` passes (14/14/17 files respectively), the exact pinned Node version is `v24.22.1`, session candidate/pilot hashes match, and each authored baseline hash matches its saved bytes. Independently generated checkpoints equal the baselines.
- **Atlas v3:** all 13 package entries and all five runtime-manifest entries pass. Independently calculated scenario, manifest, runtime-manifest, aggregate-runtime and packet hashes agree with `package-provenance.json`, both session pins, and all command-log packet pins. Authored route prefixes exactly reconstruct the earned seeds and their metric baselines.
- **Atlas v2:** all seven current manifest entries pass and the complete session/log exactly replay, **but the session has no pinned scenario/manifest/runtime provenance**. Current consistency is verified; historical session-to-package binding is not.
- None of these local hashes is a tamper-proof chronology or proof of independent authorship/source blindness. A manifest and the bytes it describes can be changed together. The session/log bytes themselves have no prior cryptographic manifest in this checked chain; this verifier records their present hashes, not a retroactive seal.
- Frozen UI files being hashed does not imply browser/native-UI testing. These are protocol-source-blind simulated logical trials, not human trials. An explicit read or a player's stop reason does not demonstrate comprehension, enjoyment or desire to return.
- Authored smoke sessions, other unrequested sessions and still-running trials are excluded.

## Reproduction and artifacts

Run from any directory with Node **v24.22.1**:

```sh
node /workspace/shared/combination-campaign-research-20261028/closed-trial-verification-20261028/verify-story-trials.mjs
```

- `verify-story-trials.mjs`: independent verifier; writes only its new results artifact beside itself.
- `story-trial-results.json`: exact metrics, all rejection diagnostics, successful creations, manifest checks and 105 original-input hashes.
- `story-trial-run.log`: console results of the successful run.
- `story-trial-metrics.csv`: compact fresh-only metrics, generated from verified results.

No GitHub or site write was performed. No verification action was blocked or denied.
