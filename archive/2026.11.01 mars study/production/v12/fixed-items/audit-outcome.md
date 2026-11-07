# Mars v12 fixed artwork audit

The current revision replaces movable structures with chapter-local fixed items and integrates the user's subsequent corrections. Visual review covered all 36 chapters: **216 compositions**, comprising each background, **136 declared fixed appearances** separately, all declarations together in their authored order, and eight additional independent/combined compound-fitting views. The 129 newly exported fixed appearances and seven retained science targets share their scenes' geometry. The contact sheets were subsequently removed at the user's request; this concise outcome remains.

## Adopted corrections

- Fixed artwork retains its authored quarter-size dimensions; the portable-icon width cap no longer shrinks scene-wide patches. A browser regression checks scale, declaration order, late construction and reload.
- Opening repairs change the one rounded habitat and the one lander. The temporary crib takes the failed leg's load and brings the cabin upright; later support work remains on that vehicle.
- The full dish rim, well/pipe endpoints, retort hoses and process-frame silhouette are retained. Traced masks remove the intrusive background rectangles from the early solar, water, enclosure and growing scenes. Starting painted objects use transparent hit areas.
- The enclosure window exists before grow lights. The sleeping pad is thin and foldable. The potato wrapping is named for the bed wrapping; buried tubers and exposed foliage have different light requirements. Harvest and washing remain at the established growing room and basin.
- Chapter 13 shows compromised fragments; the complete outline in untouched ice appears in chapter 18. The original membrane remains fragmented when stowed.
- Chapter 19 receives modules on the separate left Solar-array footing. The right pad is for process machinery. No installation appears at a distant location after dropping on the wrong worksite.
- The workshop shelter, shelving and continuous workshop floor are removed. The press, furnace and later process equipment stand on individual outdoor supports. The rover's background cave is an unbuilt recess.
- Each of the three specimens is placed inside the cabin in chapter 34: source core in the upper refrigerated cradle, remote core in the lower one, membrane in its small locker. They can be loaded independently.
- Tool kit and Steel are compact 44-pixel symbols. Late harvest targets represent the mature crop states and preserve a genuinely fresh supper harvest instead of carrying first-meal lettuce forward.

## Implementation checks

- The shared engine reaches the ending in a legal reference replay of **304 actions, including 132 combinations**. The manuscript has **224 identities, 136 explicit recipes and four compound-fitting recipes**.
- Actual Chromium drags passed every operation on that route across chapters 1–35 at 390 × 844. The final crop/retort/array corrections were rerun in affected chapters. Opening repair and reload preserve the completed structures.
- Alternative browser routes passed oxygen-first collection and transfer, insulation-before-filling, and membrane-first/reverse core loading. The ordinary routes cover the other orders.
- All 36 chapter arrivals load at 320 × 740. The corrected chapters 2, 21, 23, 33 and 34 also passed their complete drag routes at that width.
- Both discovery readings were earned through browser play at that width: chapter 13 displays the fragmented membrane and chapter 18 the intact outline in ice.
- All **284 unique referenced bitmaps** decode. Current fast story/image checks have no errors and three intentional mixed-fate warnings: the array is used before cleaning transforms it, the retort is used before disconnection, and the reactor is tested before further assembly transforms it.
- TypeScript checking and all five focused fixed-item/artwork Chromium regressions pass. `git diff --check` passes. This pass does not claim to have rerun the entire unrelated repository suite or a production publication build.

**Remaining verification limit:** full story lint exits with `fixed-analysis-limit` at 20,000 states. It therefore has not exhaustively certified all arrival branches, retirement safety or peak hotspot counts. The reference replay peaks at three simultaneous fixed targets; that is a route measurement, not a proof over every order. No limit was silently raised or disabled.

The unified format counts 91 primitive identities: 44 never-fixed supplies and 47 fixed locations, installed machines, subregions or readiness states. This raw total includes things the older format counted separately as hotspots; it is not a launch inventory or a claim of 91 imported pieces. The old 45-item tally must not be compared directly to this unified count.

Visual review was performed by the authoring assistant with knowledge of the intended objects, on browser composites and generated source art. It is not a blind recognition study, a new human preference verdict, or validation of a present-day Mars mission. Browser input used emulation rather than a physical touchscreen. Mutually exclusive states intentionally coexist in the all-declarations proofs; the actual replay tests their legal progression.

Manuscript SHA-256: `79fc6cbb3a8cf776b2aa620054bf07f784197dd9bff8bd552d6e404cf00652c5`.

## Repeat the inspection

With the development server on port 5173, from the repository root:

```sh
node projects/mars-study/production/v12/fixed-items/tools/capture-scene-proofs.mjs
node src/debug/cli.ts projects/mars-study/mars-v12/mars.md 35 runs/mars-v12-fixed/checkpoint.json
npm run lint -- projects/mars-study/mars-v12/mars.md --details
npm run check
npx playwright test tests/fixed-artwork.spec.ts tests/fixed-items.spec.ts
```

Inspect each individual appearance and the combined image against the background, then exercise the legal assembly route and meaningful alternative orders in the browser. Temporary captures and action histories belong under `runs/`; retain only concise outcomes here.
