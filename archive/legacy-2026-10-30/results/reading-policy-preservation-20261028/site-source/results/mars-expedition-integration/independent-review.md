# Independent browser-controller review: Mars expedition

Scope: new `src/mars-expedition-*` adapter/controller over the frozen `experiments/mars-remote-next` engine. This test author owns `tests/mars-expedition-dom.test.ts` and this review, not implementation. Prior purpose/named checkpoints and raw evidence remain unchanged.

## Coverage

Sixteen independently assembled authored whole routes run the production view's actual click and pointer handlers, alternating gestures. Each operation's logical result is compared with a fresh frozen-engine execution. The axes are optical/radio contact, binocular/panorama route survey, seal-before/photo-before sample handling, and ordinary/imaging-glovebox photography. All routes include powered travel with long-range communication, a living base, specimen collection/protection/photography, distant observation and an annotated map that retains navigation function.

Additional tests cover complete upfront supplies and save isolation; source return and chapter transitions preserving all token coordinates; incoming-only directional combinations and setting-placement discoverability without output-name previews; touch blank-pan versus item-drag, repeated end/cancellation/reset; compact anonymous Rover slots; replayed checkpoints and fixed world units; whole-route model non-overlap and nearby result placement.

## Evidence limits

The DOM harness runs the production controller in a synthetic DOM. It does not establish native text layout, pixel hit-testing, browser scrolling, real mobile gestures, accessibility focus behavior or human enjoyment. Fixed world geometry tests check model coordinates, generated CSS style values and CSS contracts, not rendered pixels. The routes are authored, not unassisted discovery. No action count is a claim of 200 interesting decisions, and optional glovebox construction is not required duration.

Native browser evidence must be reported separately by the integration owner; the earlier purpose-checkpoint browser limitation cannot be silently converted to a pass for this revision.

## Review finding: stale drag pan after Reset

A targeted test found that an old `requestAnimationFrame` callback survived Reset. Reset followed immediately by a fresh interior drag allowed the old edge coordinates to pan the new viewport by 6 px horizontally and 9 px vertically. This is a controller lifecycle defect, not a model defect. The regression queues an actual synthetic RAF callback, resets, begins a new drag at the viewport centre, then executes the queue. It requires no stale viewport movement. Resolution and final verification are recorded below.

The enhanced harness's board rectangle follows viewport scroll offsets. Separate tests verify a stationary edge pointer keeps scrolling; a free release becomes `(client coordinate − board rectangle offset) / 10`; successful combination returns a surviving source to its exact old world coordinates; cancellation after scroll does not commit moved visual coordinates; and newly revealed places request visibility without rearranging existing objects. These remain synthetic controller checks, not native gesture evidence.

## Focused verification after controller correction

The implementation now cancels the active animation frame before every rerender and clears the interrupted drag, including Reset/checkpoint/Undo/modal interruptions. The stale-Reset regression passes. The final focused suite passes **29/29 tests** (including all sixteen whole routes), and repository TypeScript checking passes. Intro dialogs are checked as brief Mission Control prose, without recipe-result spoilers or mechanic-manual terminology. Edge-pan rates are bounded and stationary in the viewport interior.

World-coordinate claims here are precise: chapter advance does not move any existing token; surviving combination operands return to their old physical origin; rendering uses fixed 10 px world units. Nearby result placement does not shift other cards. Rover slot-growth handling still contains a collision-resolution path for unrelated cards in the inspected implementation, so this review does not claim that every old card is absolutely immovable under every possible action.

## Aggregate verification

The full repository test command `npm test` finished successfully after the final focused/TypeScript runs: **745/745 passed**, with zero failures (approximately 206 seconds). See `full-tests.txt` for the exact aggregate count, including contemporaneous tests from other authorized work. The final expedition focused result is 29 tests; its scope is distinct from the aggregate repository count.
