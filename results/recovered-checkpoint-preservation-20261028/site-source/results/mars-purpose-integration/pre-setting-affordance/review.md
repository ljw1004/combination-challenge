# Mars purpose checkpoint integration review

27 October 2026. Independent test author; implementation owned by the integration parent. Scope: separate `src/mars-purpose-*` browser adapter/controller over unchanged `experiments/mars-next` logical engine. No deployment or fresh player trial.

## Executed coverage

`tests/mars-purpose-dom.test.ts` contains 19 passing tests. Eight independently assembled authored whole routes cover ordinary versus glacier-source water, plain versus heated growth, and early versus late Rover. Every route alternates the actual view's click and pointer handlers and compares each resulting logical state with the frozen engine. These are scripted routes, not unassisted discoveries or fun evidence.

Other checks cover:
- all initial salvage and unrevealed locations; no result-name previews;
- incoming-only stationary catalyst hint, explicit instruction to bring the other thing here, legal directional drag, and first-click-source / second-click-target without automatic reversal;
- surviving operands' exact coordinates and location; chapter advance preserves all tokens/coordinates and grants nothing;
- enhanced radio functional behavior, unlabelled empty Rover slots, labelled installed slots, radio's supply not powering traction, ordinary-width cards, optional slot only when installed, absorbed/retired inputs and no duplicate result;
- replayed debug checkpoints, geometry non-overlap through every authored adapter route, nearby result creation;
- synthetic touch versus blank-space pan, cancellation, repeated touch-end and touch/pointer double-event safety;
- Reset from open modal and during drag, renewed instructions, clean save and no stale mutation;
- narrow viewport offset preservation, one nearest-visibility request on result creation, and no animation replay on selection.

The tests found an omitted result visibility request in the new controller: the implementation restored `scrollIntoView({block:'nearest',inline:'nearest'})` only for newly created results. Regression passes.

A test-author assumption was corrected, not the engine: the source-collection canister remains outside while its ordinary filling recipe is still an available authored use. The initial expected-null DOM assertion generated a huge cyclic-object failure report and the test process was killed; the corrected retention assertion and complete reruns pass.

## Limits

The DOM harness executes the production controller in a synthetic DOM. It does not establish native text layout, actual hit testing, touch scrolling, accessibility focus behavior or human enjoyment. Geometry checks use model bounds and CSS contracts, not rendered pixels. Parent reports Playwright's bundled Chromium executable absent and system Chromium unable to start because socket creation is prohibited; therefore native desktop/mobile testing was not completed. No trial was launched and no 200-action/finished-game claim is supported.

See `controller-tests.txt`, `typecheck.txt` and `full-tests.txt` for executed commands' results. Existing named/history code is not modified by this test author.

## Final verification

- Focused controller suite: **19/19 passed** after final progress-strip and anonymous-slot wording edits.
- Repository TypeScript check: **passed** (`npx tsc --noEmit`).
- Full repository suite: **708/708 passed**, zero failures, approximately 209 seconds. Full suite ran during display-only integration edits; the final focused rerun covers final controller/adapter source.
