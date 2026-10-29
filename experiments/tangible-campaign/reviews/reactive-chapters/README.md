# Reactive chapter candidate — source-only, 28 October 2026

This candidate supersedes compulsory acknowledgements for the six current journeys. The immutable milestone+Atlas parent is source seal `565a8ada87cf543ab5fb07d82d9860e546d5151324bf2085a36f194d268bf0d6` (1021 files including its seal); its historical parent is `141353c215738e7df4ffccbf9154610573175d667f2252a79ac93a02b2e37caa`. No checkout, GitHub, Site, browser or native UI was modified/tested by this task.

## Source boundary and compatibility

`Stage.onAlreadyComplete` is optional for legacy content and explicitly authored for all 118 active chapters: 105 silent skips and 13 sparse narrative bridges. The overlay never mutates frozen scenario graphs or changes IDs/save keys. All prior direct routes and source manifests remain available. `applyMilestones` and `getPlayableScenario` compose both presentation metadata layers for UI and logical clients.

`createGame`, `applyAction(advance)` and `restore` use the same bounded pure entry resolver. `resolveChapterEntry` is also public and idempotent. A recorded entry snapshot distinguishes an already-earned entry from a chapter completed normally afterward. A legacy save without that optional marker is not guessed or destructively migrated: restoration preserves its state; the active controller resumes a ready chapter through its normal handoff. Policy-less worlds keep their previous acknowledgement behavior.

`pendingChapterBridges` derives ordered paragraphs only from actual skipped chapters. `acknowledgeChapterBridges` accepts only pending IDs. Earned facts are in undoable state, acknowledgements are once-per-run Game metadata like milestones. Reload preserves pending text; dismissal/Continue acknowledges exactly the displayed paragraph IDs. Undo does not repeat a dismissed paragraph; reset clears the run. Debug checkpoints mark replayed narrative and milestones as historical. All-remaining-complete cascades show the ending once without inventing combinations or displaying skipped objectives.

Chapter entry retains real supplies and locations; per-supply source-stage and area provenance survive skipped entries. Arrival dividers can span multiple still-populated areas, preserve new/old classification, react to intentional mixing, and survive save/undo. Already fulfilled placement witnesses are not moved away by auto-carry. Partial chapters remain visible with their fulfilled goals.

## Evidence

Focused headless/controller tests cover: actual Kitchen future-first route (exactly nine skipped chapters, all 187 real combinations, final real trolley placement); partial two-of-three goals; consecutive skips/bridges; actual Mars policy content; restored/acknowledged/undone/reset/debug state; skipped cache/location provenance and retained-area dividers; all-done endings; milestone queue handoff and stale clicks. Existing raw authored route evidence is preserved byte-for-byte, not regenerated with a new runtime hash.

Independent read-only model/controller review found and fixed four issues: retained-area birth packing used only the current divider; auto-carry could undo a fulfilled placement; vacated skipped areas retained empty dividers; root-returning carried provenance could invalidate an arrival on reload. Each has a focused regression. The reviewer separately replayed every authored checkpoint across all six decorated active journeys.

Native rendering, touch, animation and fresh human playtesting are not claimed. The final integrator owns combined hero metadata merge, exact source-successor guard chain, sealed source/package, and full aggregate validation. This local candidate itself is unpublished.
