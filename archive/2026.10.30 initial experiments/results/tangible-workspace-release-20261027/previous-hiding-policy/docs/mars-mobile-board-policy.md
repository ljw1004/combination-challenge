# Mars mobile board revision · 2026-10-27

## Implemented
- One fluid world column, fixed readable 88×60px ordinary cards, three-column salvage groups. No horizontal scroll or horizontal edge pan. Vertical blank-space pan and 80px edge drag bands (up to18px/frame).
- Nine opening items outside the lander preserve radio and optical contact routes. Habitat locker introduces12 living/lab items; recovered cargo sled8 vehicle/survey items. Final chapter opens a viewpoint, not a conveniently generated science kit. Cache membership partitions all29 canonical primitives exactly once.
- New locations trigger a named, persistent navigation button and scroll into view. Chapter reveals wait until the blocking mission dialog closes. Reset drops drag/pan state and restores the top of the board.
- Finished and no-future-use loose things leave the main board automatically, with **no collection UI**. Nothing is destroyed by this presentation filter: tokens, discoveries, slots, retirements and achievements remain canonical. Future unmade recipes anywhere, later-cache partners, slots and their Rover target including compatible radio upgrades, and unfinished goals conservatively keep useful objects visible.
- Logical recipe acceptance/highlights no longer depend on available geometric gaps. Creation may overlap locally and is briefly raised above other cards. Surviving operands retain their coordinates. Bounds use visible loose cards and revealed locations only, plus a small margin and CSS minimum viewport height.
- Independent replay checkpoints execute real actions and cache arrivals. Save identity bumped; no migration required.

## Verification
`node --test tests/mars-expedition-dom.test.ts tests/mars-expedition-mobile-policy.test.ts`

The synthetic DOM harness covers16 full authored route combinations (radio/optical, panorama/binocular, photo-first/seal-first, ordinary/contained), comparing canonical logical outcomes with the independent engine after filtering unencountered cache primitives. Also covers source return, directional context, no result previews, reset/cancel, stationary edge pan, scroll after dialog dismissal, compact rover slots, crowded legal creation, and320/375px rendered position contracts. Policy tests cover complete manifest partition, initial phone fit, no hidden-state mutation, future usefulness, occupied bounds and retained completed goals.

This is **synthetic controller and arithmetic layout evidence**, not native browser hit-testing or mobile hardware evidence. Native browser verification is separately owned by the parent publisher. The unchanged logical engine's no-depletion semantics and full optional-recipe graph remain authoritative; presentation is not a new deletion rule.
