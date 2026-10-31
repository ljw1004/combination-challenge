# Elements - Icons

The complete Elements campaign in rustic coloured woodcut: 201 item icons, three aligned House fittings, eight fixed locations integrated into 31 new backgrounds, and transparent hotspot hit areas. The separate [manuscript](../../stories/elements-icons/story.md) preserves every original item, wonder, recipe, goal, primitive supply and chapter. The original Elements files are unchanged.

With the development server running, [play the edition](http://127.0.0.1:5173/combinations.html?story=elements-icons) or open the [review gallery](http://127.0.0.1:5173/docs/elements-icons/index.html). The gallery includes every chapter at phone size and a names toggle for browsing all item illustrations. Chapter screenshots use legal developer checkpoints; the opening is fresh.

## Art and continuity

The selected coloured woodcut study supplies the palette and earnest functional objects. This edition asks for broader irregular cuts, dry missed ink, imperfect colour registration and slightly crooked workmanship. All painted artwork was generated with the built-in image-generation tool. Canvas scripts extract atlas cells, resize assets, register existing fitting images on transparent owner-sized canvases, and create empty hit-area images; they draw no new illustration.

The [scene plan](../../scripts/elements-icons/scenes.ts) owns the geography and construction sequence. Home, the orchard and the opening cooking clearing are on the **near, starting bank**. The house replaces the lean-to there. The footbridge then crosses away from home toward the mill and village. River views retain right-to-left flow; no reference is mirrored. Later visits retain completed structures, while construction chapters avoid showing their own finished work prematurely.

The user’s admired [river inspiration](../../references/icon-sets/elements-rustic/river-inspiration.png) is retained as a palette and atmosphere reference only. Its far-bank shelter and busy foreground made it unsuitable as the playable scene. The selected opening puts the lean-to and orchard on our bank and gives the foreground a broad natural clearing. Every later background keeps similarly generous working space.

Every hotspot is now part of the background itself. Its separate PNG contains **100% transparent pixels** and defines only the interactive rectangle. The cellar was cut into the existing earth bank, the kiln built against the pottery yard wall, and the kitchen fire painted into the existing fireplace recess. Terrain hotspots use the actual landscape already present. All nine appearances were reviewed together, including both visits to the same quarry face. The final landing target covers empty inlet water until the player places the lantern. Each chapter’s author note records the centre, dimensions and physical feature; syntax and behaviour belong to the [specification](../story-format-spec.md) and [UX guide](../ux.md).

The [hotspot contact sheet](contact-sheets/hotspots-in-context.jpg) and [gallery](index.html#hotspots) show the actual hover boundaries. The scene plan owns the exact coordinates and sizes. The visual review found:

| Chapter | Hotspot | Location in the finished background |
|---|---|---|
| 6 | Warm cellar | Stone doorway and descending steps in the right-hand bank |
| 8 | Kiln yard | Full-sized brick kiln beside the pottery shed |
| 9, 15 | Iron quarry | Same rust-red seam in the actual quarry face on both visits |
| 11 | Harbour headland | Grassy cape and cliff continuous with the coastline; later lighthouse views retain that cape |
| 19 | Mill pond | Real water between the working mill wheel and the rushes |
| 22 | Tidal shore | Shallows washing onto the right-hand sandy beach |
| 25 | Kitchen hearth | Soot-dark firebox, empty hook and fire within the right wall |
| 31 | Gathering landing | Sheltered inlet beside the landing, below the moored boat |

The four primitive icon declarations also specify initial centres, maintained in the scene plan: Water begins in the river, Air in the sky, Fire in front of the lean-to, and Earth in the open clearing. These are first-arrival positions; an existing saved arrangement stays where the player put it. Start a new run or jump to the opening chapter to inspect the new composition. The main index discovers this edition from the story catalogue, with a description identifying its rustic woodcut artwork.

## Production files

| Material | Location |
|---|---|
| Runtime story and compact assets | [stories/elements-icons](../../stories/elements-icons/) |
| Selected source atlases and background originals | [references/icon-sets/elements-rustic](../../references/icon-sets/elements-rustic/) |
| Exact generation prompts, references and revision reasons | [generations](generations/) |
| Item distinctions and scene plan | [scripts/elements-icons](../../scripts/elements-icons/) |
| Extraction bounds and output dimensions | [atlas-maps](atlas-maps/) |
| Phone-size icon review sheets and all House states | [contact-sheets](contact-sheets/) |
| Chapter screenshots and capture metadata | [screenshots](screenshots/) |

Generation records ending in `-revision` supersede the initial prompt for that asset. The selected background files contain the corrected result. The built-in image-generation edits recorded in `background-06-integrated.json`, `background-08-integrated.json` and `background-25-integrated.json` select the corresponding `-integrated.png` source siblings; the scene plan selects these for runtime conversion. Their original backgrounds remain as references. `repairs.png` supersedes the Cloth and Festival banner cells, whose first crops included fragments from neighbouring atlas objects. Background source PNGs are authoring references; the game serves the resized WebP files. The first isolated hotspot atlas is retained as a source reference, with its former extraction map/contact sheet labelled `hotspots-original`; it no longer supplies runtime artwork. Empty hit-area PNGs are generated mechanically from the scene plan, with no painted marks.

To rebuild mechanical outputs after an intentional manuscript/art change:

```sh
node scripts/elements-icons/author.ts
node scripts/elements-icons/prepare.ts
node scripts/elements-icons/verify.ts
node scripts/elements-icons/capture.ts  # requires the local game server
```

`author.ts` derives the illustrated manuscript from the original, adding metadata without changing the campaign. Edit the original campaign only for an intentional shared story change; edit this edition’s scene plan and visual catalogue for artwork changes. Generated artwork itself is not deterministically recreated by these commands; the exact prompts are retained for later revisions.

## Review and evidence

Author review inspected all 201 extracted icons at display size, all eight House fitting states, all 31 chapter screenshots and every integrated hotspot appearance. Distinctions include soil versus stone, glass versus a framed window, empty versus filled containers, successive mechanisms, specimen sheets versus bound books, and the empty final lantern inlet. A second extraction pass replaced stray neighbouring fragments in Cloth and Festival banner. House fittings were moved inside the open bay after inspecting the composite. Background revisions corrected a cottage accidentally placed across the river and a mill wheel appearing before construction. The hotspot integration pass replaced miniature landscape stickers with locations at the scenery's scale while preserving the broad working clearings.

This was a source-informed visual review, **not a fresh or independent recognition trial**. The icons retain hover/press/focus names and the normal readings. Exact recognition rates and player enjoyment remain unmeasured; the gallery’s hidden-name view is provided for trying recognition directly.

Validation: all 110 Node tests and 48 Chromium tests passed after integration with the story-cover and encyclopedia updates, including complete legal replay witnesses for every manuscript. A separate semantic comparison confirms this edition preserves the original campaign. All chapter artwork loaded without missing-image responses; all 31 entry layouts were checked at 390px and 320px with no fallback tiles or out-of-board items at the captured states. All nine hotspot appearances passed full-transparency, intrinsic-size, pointer-hover, black dotted outline, name and touch/boundary checks at 390px and 320px. A fully transparent target also passes the operation, placement and image-preservation browser regression. Browser checks cover fixed hotspot centres, preparatory hotspot hints before other ingredients exist, contextual operations, placement, image-node preservation, missing-image fallback, primitive starting positions, the main-index link, and creation names that remain above their icons for 1.5 seconds then fade over 200 ms. Right-edge mouse and emulated-touch drops retain their preview positions through release and reload; an actual opening-chapter playthrough confirms carried coordinates stay exact in chapter two. The production build passes. The edition retains the original Elements linter’s 20 warnings, including four pessimistic opportunity findings; artwork work does not reopen those editorial decisions.

These are desktop Chromium and emulated-width checks, not a native-device playtest or a guarantee about every freely arranged later board.
