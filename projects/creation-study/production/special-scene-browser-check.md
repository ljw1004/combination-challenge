# Special-scene browser integration

The [current revision outcome](art-revision-outcome.md) supersedes the asset names, lighting, world-axis presentation and final placements recorded in the earlier passes below.

Author/integrator verification, 5 November 2026. Browser mouse at 1440×1000 and Chromium touch emulation at 390×664. This is technical interaction and visual integration evidence, not independent creative review, native-device touch testing or a fresh player experience. Variation was excluded.

The final representative runs used manuscript SHA-256 `fd89049baf54e67b4a8205a24ba84645d2275ec1b59c0c292073f51e33d3a840`. The revised unlit cave, gathering and abstract ending exports had SHA-256 prefixes `2e35d91c509a`, `a950f44bc5d9` and `602b6d0e4413`. Their selected sources and requests remain in the production records. Earlier complete opening/cave permutations used `e848dc27d1c183a369067a44f871a75fe7a272c94b14720e4c57e4270612e133`; the subsequent changes affected unlit brightness, gathering art/receiver position and ending composition, so those scenes received fresh representative checks.

## Interaction coverage

- **Opening:** four actual gesture sequences covered ordinary creation and Stars/Asteroids before Void on both viewports. Light was made before and after Steadied world; the Sun was also made before the world in the early-bodies route. Deep, Void and current world receivers remained usable after portable icons were rearranged. Completion and reload passed.
- **Cave:** all four Echo timings were exercised on both viewports, with Teaching before or after painting. Fire replaced Sea cave; Pigment was placed at Lit cave and Memory dragged onto it; Stars replaced Painted cave while retaining the animal. Exactly one cave receiver remained active, with a stable centre through all four states. Song, Teaching, chapter completion and reload passed. The much darker final unlit background received a new complete state-transition pass on each viewport.
- **Final song:** Song was dragged onto the updated gathering at (49%,34%). Shared song was then moved outside that receiver and combined with Wonder. Song of creation survived reload, and the story reached the abstract ending on both viewports.

No page errors or failed asset requests occurred in the passing runs.

## Visible results and repairs

The first full-scene overlays hid goal text and let the previous cave's lower 180 pixels paint over the next chapter on the short phone viewport. The revised alpha masks corrected both defects. Fresh screenshots show readable goals in Lit cave, Painted cave and Painted cave with stars, and an unobscured sky and distant cave on arrival at the gathering. All five full-scene overlay exports were checked as 1560×3376, fully opaque above their authored changing-region cutoffs and exactly transparent below their fade ends.

The final unlit cave is barely visible; adding Fire reveals the wall and its material contours. The three lit states retain the torch, wall seam and animal position. No hard rectangular fade edge was visible in the inspected phone and desktop composites; light falls into the dark lower playing field. The smaller gathering aligns with its receiving area, and the cave mouth remains behind it. The abstract ending's central interwoven composition survives the short-screen crop without a detached blank playing field.

In the initial, superseded placement pass, the opening involved ordinary inventory housekeeping. In the ordinary route, Light and retained Sun were moved aside to expose the world; Moon was moved away before being dragged back to steady it. In the early-bodies route, Sun and Moon were moved similarly, and final Light was moved to expose Steadied world. Both routes completed. Automatic clearance of every receiver after every result was not established.

The executable gesture scripts, screenshots, pixel/geometry probes and detailed outcomes are disposable under `runs/creation-art-v2/`, principally `browser/`. This record retains the scope and conclusions. No engine or manuscript edits were made by this verification task. Later changes to these assets, receiver geometry or relevant recipes require the affected checks again.

## Opening placement and globe-size follow-up

The localized Void artwork and larger surrounding Waters receiver received four fresh opening gesture sequences on the same phone/desktop viewports. Waters is centred with Void at (51%,31%), with a 94%×52% rectangle; its outer region remains available above, below and beside the 62%×23% Void. The initially tried 60% height crowded the short-phone primitive arrival; 52% retains a clear row of three starting icons. Actual early and late Stars/Asteroids drops, Light before/after the steadied world, all three active receivers, completion and reload passed. No failed requests or page errors occurred. Final phone checks used manuscript `64b3dcd9faa63bf5d32315cfca68691ab2ecd12b3c4c89237eb33f3e0db19096`; desktop used `36f4abe3135d028782bf7a528589bc8d81bb66a0d68beeec983deb28910d6133`. Their opening declarations and artwork were identical.

Existing `place:` metadata now starts Sun at (33%,25.5%), Stars at (85%,14%) and Asteroids at (15%,36%). All three positions were measured within one display pixel of their authored destinations on both viewports and in both recipe orders. Their circles remain movable. The initial conclusion that Moon and Light could not be offset within the world receiver was incorrect: the specification checks the prescribed centre against the hotspot, not the entire icon. The corrected peripheral placements and direct checks are recorded below.

Phone and desktop screenshots show the same surrounding nebula, natural cavity edges, small molten planet and visible goals. The localized Void alpha is zero outside its authored ellipse; a 38,995-pixel outer-scene sample in actual before/after phone captures was identical after excluding tutorial/UI feedback. The new chapter-two magma surface also received arrival inspection. Rocky world and Stone crust retain identical position and 96px reference size across an actual Water drag on both viewports. Their 64/96px export proofs were inspected; all 223 selected icon outputs reproduced byte-for-byte before the subsequent hierarchy audit.

This follow-up changed only story geometry/result destinations, selected icon crop/size metadata and generated icon exports; it made no engine changes. Later cave brightness and Variation revisions belong to their separate checks.


### Peripheral Moon and Light

Moon now appears at (59.5%,28.5%) and Light at (42%,37%), at the upper-right and lower-left periphery of the molten world. Both world states carry these `place:` entries. The original 18%×9% world receiver and 61px painted planet remain unchanged. Four actual routes (ordinary/early bodies on 390×664 touch and 1440×1000 mouse) reached all five authored portable destinations within one display pixel, completed, and reloaded successfully. No inventory rearrangement was necessary in these four routes. These checks establish the tested empty-destination cases; ordinary fallback still applies if a player deliberately occupies a destination.
