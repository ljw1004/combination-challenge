# Terminal trial audit: voluntary stop, not sustained engagement

**Historical prior-hiding-policy trial.** The player completed this trial against the immutable earlier bench design. It does not test the user's subsequent persistent-object/physical-area policy. Nothing was revised after observing the outcome.

## Verdict

The candidate **failed to sustain this player's engagement**. They stopped voluntarily in chapter 5, with its invitation unfinished, after seven discoveries. The captured behavior corroborates several concrete complaints: five new objects immediately vanished from the returned bench; selecting the newly made Tent was rejected; the interface exposed only a boolean goal-complete flag rather than partial category progress; intuitive picnic attempts failed. The low visible item count did not prevent the experience from becoming frustrating.

This is one source-blind, text-interface agent trial, not a human study, visual/mobile assessment or controlled comparison. It is consistent with the user's concern that disappearing creations undermine tangibility. It does **not** establish that hiding alone caused the stop or that the new physical-area policy will solve it.

## Exact reconstruction

Session: `fresh_scenario_20261027a`. Raw wrapper capture, terminal snapshot, terminal note, freeze manifest and neutral player instructions are copied unchanged under `raw/`.

All **35 chronological invocations** were independently replayed in a separate local runtime copied from the frozen sources. Every stdout byte, stderr byte and exit code matched. The final saved state matched the terminal snapshot **byte-for-byte**:

`09461cd19d6af7449c7219b97c246dbcf931278bd11dc020b5a1a084e675f544`

The capture contains 86,502 decoded stdout bytes and zero stderr bytes. Output filtering is recorded as `none` for every invocation. Every recorded freeze matches the original pinned manifest, and the original runtime file hashes still match after the trial. Invocation timestamps are chronological. The original session save also equals the terminal snapshot.

The replay changes only the local executable path to the isolated replay copy, preserving session ID and action arguments; that path change has no output representation. Replay outputs and a per-command chronology are retained in `results/`.

## Counts, with categories kept separate

| Measure | Count |
|---|---:|
| Captured commands | 35 |
| Combination attempts | 20 |
| Successful discoveries | 7 |
| Unsuccessful combination attempts | 13 |
| Selection commands | 6 |
| Place switches | 5 |
| Context placements | 1 |
| Chapter advance | 1 |
| Initialization / voluntary stop | 1 each |
| Canonical discoveries | 26 → 33 |
| Largest visible bench during this trial | 26 |
| Process/execution failures | 0 |

Exit zero includes model-level rejected actions. The rejected Tent selection is not an execution failure; neither are unsuccessful combinations. Do not call all 35 interface commands meaningful combination decisions, or count navigation as progress toward a duration target. One combination attempt pairs Thread with itself, which this interface rejects; the other failed combinations are distinct attempted pairs.

## What objectively disappeared

| Capture event | Discovery | Present immediately in returned bench? |
|---:|---|---|
| 9 | Cloth | Yes |
| 11 | Tent | **No** |
| 18 | Tower | **No** |
| 19 | Swing | **No** |
| 22 | Houseboat | Yes |
| 25 | Cradle | **No** |
| 26 | Cushion | **No** |

The discovery notice names each result, and the canonical item is preserved; neither fact makes it tangible on the current work surface. Event 13 (`select tent`) returns “That thing is not on this bench. Try another place.” Later place changes reveal some items again, but that retrieval interrupts the player's immediate intent. The distinction between safe logical retrievability and satisfying object persistence matters here.

## Specific friction supported by the capture

- Events 3–4: Fruit + Basket and Flatbread + Basket both fail. The player is trying to prepare an outing with already suitable food and a carrier. The model's existing Bread-only Picnic basket route does not accept those pairs.
- Events 11–13: Tent is announced, absent from the bench, then not selectable.
- Events 18–19 and 25–26: Tower, Swing, Cradle and Cushion similarly disappear immediately in the current work area.
- The current invitation asks for two among staying, an outing or a use for a boat, but returned goal data only says `complete: false`. It does not identify that Tent/Houseboat both satisfy the same “stay” category. Independently inspecting the frozen model reveals another wording risk: Houseboat obviously uses a boat in ordinary language, yet does not count for the narrower hidden `river-work` category.
- Selection and free place switching correctly work in the mechanical sense. The player nevertheless reports that partner menus increasingly substituted for self-directed intentions. Logical access is not enough to establish enjoyable exploration.

## Limits and provenance

The replay auditor is source-aware and was involved in constructing the candidate; this is an independent execution/reconstruction pass, **not** a claim of independent experimental authorship. The original fresh player was launched by the parent with no inherited research context and neutral instructions. The capture proves what passed through the wrapper; it cannot prove that no tool outside that wrapper ever read source. Source-blindness therefore rests on the launch protocol and player adherence/report, not on an impossible claim that this log audits all tool access.

Only the player's complete original qualitative report should be treated as their own wording. The audit interpretation above is separate. The trial's brief duration and early stop are meaningful negative evidence; do not replace them with a source-aware successful route or retrospectively smooth the goals and hide policy before presenting the result.

## Publication

This is a separate terminal-evidence package referencing the already frozen research package. No original source, bench grammar, harness, capture log or terminal state was modified. No live publication or external write was performed by the audit.
