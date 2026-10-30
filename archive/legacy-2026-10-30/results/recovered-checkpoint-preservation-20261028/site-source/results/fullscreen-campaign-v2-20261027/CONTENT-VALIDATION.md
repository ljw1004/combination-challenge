# Release v2 — final validation

**101/101 tests pass**, with no failures or skips. Strict TypeScript passes. **540/540 seeded source-aware stress runs complete** on the final patched scenarios. The arrival-v6 runtime is byte-identical to sealed release-v1.

| Journey | Scenes | Checkpoints | Canonical actions | Combinations |
|---|---:|---:|---:|---:|
| Mars: A Light That Answers | 24 | 25 | 227 | 198 |
| Atlas of Questions | 23 | 24 | 222 | 197 |
| Elements: A River Worth Returning To | 30 | 31 | 234 | 198 |
| From Hearth to Snack Cake | 4 | 5 | 31 | 21 |
| The Guest and the Fast | 3 | 4 | 16 | 12 |
| The Last Train | 3 | 4 | 15 | 12 |
| After the Flood | 3 | 4 | 17 | 14 |
| The Sheltered Shore | 3 | 4 | 14 | 10 |
| Why This Boat? | 2 | 3 | 15 | 11 |
| **Total** | **95** | **104** | **791** | **673** |

## Exact source and patch integration

The full sources are Mars cargo-revision-v2, the sealed Ideas transmission-revision-v8 retest scenario, and Elements observation-revision-v6. Their three requested input SHA-256 hashes were checked before building. The same six active minis are carried from release-v1. All three full journeys have new save identities; old live routes/saves remain separate archives under the parent task. School remains excluded from this active export.

Exactly **60 parent-reviewed continuity strings** were applied: 24 Mars, 32 Ideas and 4 Elements. A separately guarded parent patch then shortens exactly two Mars cargo invitations (stage motivation and cache narrative), and one separate parent patch shortens the Elements optics motivation, for 63 presentation fields total; travel text and objectives remain unchanged. Every expected old value matched, including all 32 Ideas edits authored against v7 rebased onto v8. The original 60-field patch permits only motivation, completionText, description, speaker and area.travelText; the separate parent patches permit only the exact cargo motivation/cache-narrative pair and optics motivation; objectives, labels, IDs, recipes, retirement, carry and other gameplay fields are unchanged by these patches. Replaying every canonical action at three widths gives the exact same mechanical states before and after presentation edits.

## Route, checkpoint and branch evidence

- All nine canonical witnesses execute the actual Finish action. **104 earned scene-start/complete checkpoints × 3 widths = 312 exact checkpoint replays**, with 104 save round-trips. No checkpoint injects state.
- **109 alternative complete witnesses × 3 widths = 327 replays:** two other Mars routes, 24 Elements sample/specimen/weather/feast assignments, 48 Ideas communications producer assignments, 32 preserved earlier Ideas producer assignments (with the revised communications scene), and three Ideas deferred-prerequisite regressions. Assignments are source-aware cases, not necessarily distinct player paths or play sessions.
- Mars cargo recovery is six accepted combinations with a visible partner at every step, no portable unrecovered sled, no manual visit or placement gate, physical table/picture incorporation, and the portrait retained through the return archive. The original eight sole-use repair integrations and Undo/provenance tests still pass.
- Ideas accepts both new data/code/protection gestures in both directions. A plan alone still cannot replace actual received-packet recovery. An unprotected failed transmission retains the original for a protected retry; receiver-side retroactive redundancy remains rejected. Optional first-scene Field note/Hypothesis may still be deferred individually or together.
- Elements requires the actual pond observation, retains microscope/sample, admits the natural alternate recipes, does not manufacture rain from wind notes, and earns the existing feast table at scene 24 without duplicating its final goal.
- The 540 seeded runs vary immediate advancement, some optional combining and exhaustive current-local combining at 60 seeds each per campaign. They check legal actions, stable identities, current-goal gold, transfer provenance and arrival geometry. The final optics-only change reruns 180 Elements cases and retains the 180 + 180 Ideas/Mars cases only after verifying their scenario bytes are unchanged; all three result rows hash to the final scenarios. The harness is inherited from prior independent work; these new runs were performed by this integrator, not represented as another independent review.

## Preservation and limits

Release-v1, all candidate originals, frozen engines and all closed trials captured at build start remain hash-identical. The earlier narrative-author report is preserved explicitly as v7-specific evidence, not relabeled as a v8 pass. See manifest.json and evidence/validation-report.json for exact provenance, tests.tap for assertions, and evidence/branch-audit-results.json for the stress sweep.

The bounded fresh logical retests motivated these revisions; this integration does not claim new human play, visual/native-browser validation, enjoyment of the full campaigns, or a full-game retention improvement. Counts describe witnesses, never a quota. No Site or GitHub write was made by this task.
