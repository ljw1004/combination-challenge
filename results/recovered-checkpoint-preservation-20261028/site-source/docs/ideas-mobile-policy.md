# Ideas: mobile active board (2026-10-27)

- Board is viewport-width; touch panning and edge dragging are vertical only. Legacy wide coordinates reflow on width/chapter change; free movement then keeps its position. Initial mobile layout uses two 134px readable text columns. Current destination occupies the top of the board, with relevant already-discovered tools immediately below it. Other revealed locations remain accessible further down.
- Closing or escaping an invitation frames its destination and gives a short in-character destination cue, without giving recipes. Drag intervals end on drop, pointer/touch cancellation, render/modal/reset, pagehide and blur.
- Bounds derive only from active pieces and revealed locations, with small hit-area margins; the board has a viewport minimum but no minimum scrollable world height. Rendering clamps obsolete scroll offsets after retirement.
- `things` remains canonical discovery state. `activeThings` is a derived rendering subset, not a collection or delete operation. Retain inputs to any undiscovered recipe regardless of current partners; retain still-needed goal candidates; retain every tool/tide variant with a missing reachable channel/duration output. Previously achieved goals remain canonical. Archived tokens cannot be moved to displace or reverse a goal.
- Creations prefer the nearest readable local opening (including a newly retired operand’s slot), then fall back to a bounded overlapping offset; packing never blocks creation. Original operands remain unchanged. Duplicate suppression remains canonical.

## Verification

`node --test tests/history-ideas-mobile-policy.test.ts`: 7/7 pass. Includes 12 complete active-only alternative routes at each of 320/375/390px, mathematical bounds checks, future tide variants, local crowded creation, and synthetic controller dismissal/panning/cancellation checks. `tsc --noEmit` passes.

This is mathematical/synthetic verification, **not native browser hit testing, layout, focus, scrolling or drag validation**.

Original first-run failures are preserved; their three superseded assertions were subsequently updated explicitly. `evidence/ideas-mobile-legacy-first.txt` preserves the first 19-test run (16 pass, 3 fail). Those original failures required behaviors superseded by the user's request: horizontal edge pan, dragging the now-hidden completed tide, and using retired Number to displace a library goal. New assertions explicitly check the replacement policies. Existing model alternative-route tests passed. Final aggregate verification is owned by the parent task.

Parent-task native Chromium verification at 500px (mouse, not physical touch): Measurement reuses retired Number’s slot without covering Doubt; Measurement + Doubt and Controlled experiment + Reason succeed; advancing/dismissing the invitation visibly frames Public library with method/writing/craft below and its in-character cue. This native pass exposed the overlap issue, which is now covered by a 320/375/390/500px mathematical birth-geometry regression. No claim of native 375px or touch testing.
