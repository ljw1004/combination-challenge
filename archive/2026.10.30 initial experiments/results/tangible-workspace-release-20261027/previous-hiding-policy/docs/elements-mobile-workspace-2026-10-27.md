# Elements mobile workspace revision

## Implemented
- Fluid width, vertical-only board; compact readable text buttons (44px high). Three safe horizontal centers keep text inside 320/375/390px widths.
- Fixed vertical coordinate scale; content height follows visible active items, transient birth, and revealed cellar plus a small margin, with viewport height as the floor. No horizontal panning or unconditional 900px canvas.
- Edge dragging scrolls vertically; cancellation, lost pointer capture, Undo, Reset and modal opening stop the timer. Blank-board touch retains native vertical scrolling.
- New cellar explicitly announced in purpose modal; after dismissal it is brought into view. Its position is among active work rather than a remote lower-right corner.
- Derived retirement retains every ingredient of every undiscovered recipe, including optional recipes and missing partners, plus contributors to remaining current/future goals. Canonical discoveries, scoring and duplicate guards remain intact. Undo restores visibility from its state.
- Terminal births remain visible for 1.8s, then leave the board. No inventory-management or collection UI.
- Chapter transitions compact active work into a readable grid, reserving the cellar band. Ordinary combinations and drags do not reflow sources. Crowded local births prefer staggered small-edge overlap to covering labels.
- Placement geometry cannot reject a valid recipe/hint. Free local positions are preferred; local overlaps are allowed. Inputs remain at their canonical origins.
- Legacy saves and their undo snapshots receive a one-time width-fitting layout migration, without changing discovery identity, goals or actions.

## Evidence
`tsc -p elements-discovery.tsconfig.json --noEmit` passed.

24 focused model/controller/layout tests passed. The 100 shuffled whole-world orders cover every optional recipe, reversed operands and both cellar anchors, with retention safety checked before each creation; final canonical 45 discoveries remain while active board reaches 0. Peak active count 20; greatest birth displacement 40 model units. Sources and unrelated canonical items remain unchanged by combinations (chapter transitions explicitly tidy active positions); duplicate creation stays rejected.

Authored checkpoint active/canonical counts: supper 8/8, comfort 13/16, world 15/22, complete 18/26. Optional recipes are not all exhausted at that last checkpoint.

Synthetic 320/375/390px checks cover width bounds, content extent, edge scroll and cleanup, terminal/optional retention, Undo, old saves and extreme crowding. Synthetic DOM checks cover full authored route by clicks/drags, touch cancellation, cellar hints and post-modal reveal.

These are source-aware regressions, not fresh-player enjoyment evidence. Native cloud browser verification belongs to the parent task; these checks do not assert real mobile touch arbitration or native layout at 320/375/390px.

## Birth-scroll correction from native parent check
The parent verified a readable 500px comfort arrival and reached Cloth by ordinary clicks without rearranging. Its new row exposed a transform-sensitive scrolling bug: `scrollIntoView` observed the birth animation at its source, not its destination. Scrolling now uses untransformed layout coordinates and only runs for the current new creation. A 320px-width/250px-height synthetic comfort-to-Cloth regression verifies the whole destination tile is visible and Purpose reopening does not replay the old notice. TypeScript and all nine controller tests pass after this correction.
