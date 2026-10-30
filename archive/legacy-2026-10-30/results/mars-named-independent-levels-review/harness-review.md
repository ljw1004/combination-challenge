# Independent logical harness review

**PASS after adding explicit loose movement.** `harness_review.py` imports the harness as the subject under test, but reads authored routes only in the test process. No player was recruited or given those routes. Run it from the repository root. Results: `harness-results.json`.

The runtime content is checked exactly against the six-level candidate after removal of route witnesses. Both complete collections replay successfully: ordinary **49 combines + 21 placements = 70**, simple **40 + 22 = 62**. Every level finishes with the candidate's exact board. All six completion snapshots survive explicit `next` transitions; ordinary ledger contains 47 distinct learned recipe entries, simple 39. A JSON persistence round-trip after every physical action preserves view and knowledge.

Public-output checks cover visible introduced goals without internal acceptance arrays or future route/recipe controls; partner discovery lists only currently legal novel targets and does not preview unknown results. Successfully made recipes enter the knowledge ledger. No unknown result is disclosed by rejection. Saved-board responses are detached/read-only; editing a returned snapshot does not edit the saved state.

Atomic rejection checks cover premature advancement, absent operands, malformed commands and argument types. CLI checks show successful state persistence and byte-identical saved files after a rejected command. The contract probes cover actual target context, contextual precedence before novelty, duplicate-result rejection, portable location outputs, reverse contextual harvest orientation, source movement, and refusal to treat a command-supplied `at` field as real target placement. Only broken radio retires; its cable remains.

## Fixed during independent review

The initial harness could place an object onto a location but could not drag it loose except through synthesis/displacement. Independent test reproduced `place` with explicit `place: null` being rejected. The implementer added that gesture. Retest verifies the pump can move loose, its current endpoint becomes false while historical achievement remains true, `next` rejects atomically, and replacing the pump restores completion. Displacing the pump with the canister also correctly makes the current endpoint false. This is a necessary grammar repair, not added content or duration padding.

## Limits and current direction

This is a logical JSON-command harness, not the deployed UI or a layout/navigation test. It cannot establish pointer work, catalog retrieval cost, visible board usability, human pleasure, or 200 worthwhile decisions. It omits spatial coordinates and free dragging between equivalent loose positions because they have no logical consequence; those unmodeled gestures are not counted.

The root's latest human direction prefers a continuous expanding world with a scrollable catalog. This independent-level harness is therefore a preserved alternative, not the chosen replacement for that direction. Its passing tests establish consistency only; they do not justify removing continuity or treating 102 retained objects as automatically unacceptable.
