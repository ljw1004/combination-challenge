# Elements: a world to make

## Playable scope

Standalone entry: `elements-discovery.html`. All four raw elements—Earth, Water, Air and Fire—exist immediately. This is explicitly a **storybook elemental world, not a chemistry lesson**. There are 41 authored binary discoveries (45 distinct things), not a claim of 200 decisions or a proven-fun finished game.

Four short invitations widen the scale of creation:

1. The keeper asks for a food vessel and building material.
2. The baker asks for something to eat and an orchard drink.
3. The neighbour asks for any two comforts: light, cloth or carrying things.
4. The keeper invites any two of shelter, water travel and food to share.

Later goals do not grant supplies. The warm cellar is the only location, revealed for the baker's invitation. Dough + starter and juice + starter use it as **binary target context**. A target is set down there, then its partner is brought onto it. The cellar never accumulates ingredients. Flatbread and juice are legitimate shorter routes; fermentation is optional elaboration, not mandatory padding.

The complete authored checkpoint uses 22 creations and three chapter transitions, no cellar actions required. This is an authored regression route, not fresh-player evidence and not an upper or lower bound on human play. Checkpoints are made by replaying actual legal actions; there are no granted completed outputs.

## Interaction contract

The Mars purpose controller is adapted into isolated prefixed files: rounded things, square hollow location, source/partner highlights without future output labels, asymmetric contextual hints, click pairing and pointer/touch dragging, empty-space native panning, creation animation near the target, undo, saved state and reset reachable inside dialogs. Surviving source and target state remain unchanged on creation. Every thing is reusable; duplicate discoveries are rejected and stop highlighting. Old discoveries remain on the board.

Ordinary movement is free, including away from the cellar. No inventory depletion, quantity ledger, countdown, arbitrary recipe completion quota, or later supply grant. A 1000×900 minimum scrollable worktable leaves room for the expanding set of things without shrinking tiles into unreadability.

## Validation (2026-10-27)

- `node --test tests/elements-discovery-model.test.ts tests/elements-discovery-dom.test.ts`: **10 passed**.
- Standalone TypeScript configuration: passed.
- Project aggregate TypeScript check at this point: passed (concurrent project changes remain publisher's responsibility).
- `vite build --config elements-discovery.vite.config.ts`: passed.
- Exhaustive logical discovery reaches all 41 outputs, with no duplicated result, input depletion or surviving-input displacement.
- Synthetic controller whole authored route exercised through both click and drag; reset from open dialog; item-touch cancellation and blank-space event contract; source return and cellar direction exercised.
- Native Chromium launch **failed before navigation**: `socket() failed: Operation not permitted`, with Crashpad database initialization error. No native layout, real focus, actual touch/pan, screenshot, or human-fun validation is claimed. An opt-in native regression remains in `tests/elements-discovery-browser.test.ts`; run with `ELEMENTS_TEST_URL=http://127.0.0.1:4193/elements-discovery.html` once the execution environment permits Chromium launch.

Raw logical/controller output: `results/elements-discovery/logical-and-controller.txt`.

## Next human question

Does following a small request make open-ended element discovery satisfying, or merely reduce random guessing? In particular, observe whether the optional cellar invites curiosity after flatbread/juice already satisfy supper. Comfortable progress is intended; longer routes and discovery counts are not treated as better by default.

### Crowded-table revision

Independent varied-order discovery found a late result could be placed 53.8 board units from its target. Creation placement is now bounded to **28 board units**. It prefers a free nearby spot, never covers either operand, and never moves existing things. If an exhaustively crowded local area has no free spot, it accepts the least-overlapping local spot so the player can rearrange it, rather than teleporting the result across the table. The canonical 22-creation completion has no overlaps. This is an explicit continuity-over-perfect-packing choice, not a claim that every exhaustive discovery order remains overlap-free. Invalid saved undo snapshots are also discarded before restoration.
