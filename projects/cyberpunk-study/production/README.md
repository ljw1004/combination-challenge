# Harbour artwork production

The [active brief](../design-brief.md) governs this work. Final runtime art belongs in `../harbour-assets/`; exact generation requests, necessary reference inputs and native authoring geometry belong here. Verification output is disposable under `runs/`. This illustrated development pass is complete and remains unpublished for user review.

## Direction

**A paper theatre in cyberspace.** Painted scenery and precise layered object illustrations share an ivory, deep teal, vermilion, cyan and warm gold palette. Broad silhouettes, translucent glass, visible cut-paper overlaps and a quiet working surface make impossible constructions readable. Circular objects have a size hierarchy; complex transformations receive large result pictures. Object illustrations are authored as compositional SVG so the same hull, flag, tree fork, fittings and enclosing glass can remain exactly the same across states. Painted settings use the built-in image generator. No stock museum image is shipped.

The visual research examined [V&A paper peepshows](https://www.vam.ac.uk/articles/paper-peepshows), including the Engelbrecht theatre and the view into the Thames Tunnel. Borrow the recurring frame, clear layers and sense of looking into a miniature world; omit their dense ornament and crowds. The [Cooper Hewitt account](https://www.cooperhewitt.org/2019/02/07/who-wouldnt-want-to-take-a-peep/) was found through search, but its page timed out; it is not an inspected visual reference.

## Identity requirements

- White ship, red-and-white striped mast/sail, bent yellow flag and warm lantern remain with the ship through inversion. The glass bottle is always the middle enclosure; the crescent pier, water and later exhibitions remain with the harbour.
- Every silver tree retains its fork and left-branch notch. Blue bells and broad gold fans occupy distinct attachment areas. An old garden sphere predates the ray and firefly; never quietly update it to the later Festival garden.
- Coloured winged puppet and dark tailed outline are different performers. Tracing copies shape only. The tailed glass parent supplies the later luminous regatta descendant.
- Motion diagrams show the authored outward segment(s), marked stops and return. At most two outward segments. A route supplies neither a new body nor light.
- The early Theatre globe has the two puppets and harbour backdrop, without the later garden. Its blue-hour version changes that earlier copy; the live window shows the current garden play.
- The four room/tree outcomes retain their chosen furniture, tree, cradle and globe. The room's pale blue corners and broad window stay with the room; the cradle stays with the tree.
- Regatta alternatives retain every installed part, whichever order it was added. The source pool stays in the gallery; the touring copy enters the side bay inside the original bottle.

## Verification

First inspect the ship/bottle/harbour reversal, related tree versions and route diagrams at actual playing size. Then expand the family and review all appearances for continuity. Recognition reviews receive unlabelled samples before context. Informed visual review receives the story requirements and actual browser scenes. Record exact scope, decisions and limits in `../development.md`.

The completed review sequence and final hashes are in [development outcomes](../development.md#final-verification-and-limits). It included unlabelled recognition, full-family informed continuity, targeted repairs and integrated browser reviews. Final checks loaded all 318 artwork files, replayed the 94-combination reference route exactly and inspected 81 chapter-entry layouts. Full pointer runs covered both phone sizes. Mechanical exploration exercised all 186 recipes within a per-chapter bound; it does not prove every history. No human play evidence is claimed.

## Deliverables and geometry

The [visual catalogue](gallery.html) presents the complete collection. [Catalogue data](catalogue.json) specifies all 215 identities and their ancestry; [catalogue notes](catalogue-notes.md) explain the invariants. [Artwork metadata](artwork.json) records the exported filenames and tiers. Native source lives under [drawings](drawings/).

The 318 runtime files comprise 215 circular portable drawings, 16 fixed variants, 56 ordinary object-reading pictures, nine full explanatory plates, 17 runtime comparison panels and five painted backgrounds. Portable source tiers 320/448/640 display at 80/112/160 CSS pixels on a 390-pixel-wide phone. Five fixed stages use 576-pixel canvases; the other fixed constructions use 768. All fixed placements are centred at 50%, 13%, leaving the working surface below available.

Keep separate comparison panels and native prose captions in the manuscript. The reader's existing 45dvh image-height limit made tall, combined plates too small on phones; the full plates remain useful in the catalogue. Motion segments use shared geometry (Up 90, Across 110, Around radius 54), identical scales when comparing order, and complete return paths. Figures retain their fittings and historical contents through shared component composition.

## Painted asset provenance

Seven calls used the built-in image generator; no image API or CLI was used. Final PNGs are selected generator outputs, without redundant production copies. Exact requests and necessary edit inputs are retained below. Native object drawings use SVG and did not require image generation.

| Selected runtime asset | Exact requests | Necessary edit input |
| --- | --- | --- |
| [Gallery](../harbour-assets/backgrounds/gallery.png) | [Initial](gallery-prompt.txt), [extended working surface](gallery-extend-prompt.txt) | [Initial gallery](gallery-reference.png) |
| [Harbour](../harbour-assets/backgrounds/harbour.png) | [Harbour request](harbour-background-prompt.txt) | Gallery setting for visual continuity |
| [Evening harbour](../harbour-assets/backgrounds/harbour-evening.png) | [Evening request](harbour-evening-prompt.txt) | Selected harbour |
| [Evening gallery](../harbour-assets/backgrounds/gallery-evening.png) | [Evening request](gallery-evening-prompt.txt) | Selected gallery |
| [Compact cover](../harbour-assets/backgrounds/cover-v2.png) | [Cover](cover-prompt.txt), [compact revision](cover-compact-prompt.txt) | Selected gallery, [exact ship geometry](cover-ship-reference.png), [original cover](cover-reference.png) |

The initial gallery and original cover remain solely because they are required inputs to the selected edits. Tool-owned generation-cache files follow their own retention policy. Discarded trials and verification captures are not deliverables.

## Reproduction

Run from the repository root with the repository's supported Node version. Regenerate native SVG artwork, its metadata and the catalogue:

```sh
node projects/cyberpunk-study/production/drawings/export.mjs
```

Start a separate local preview with `npm run dev -- --port 4182`. Then:

```sh
npm run lint -- projects/cyberpunk-study/harbour.md
node projects/cyberpunk-study/production/verify-artwork.mjs
node projects/cyberpunk-study/production/verify-layouts.mjs
node projects/cyberpunk-study/production/verify-branches.mjs
node projects/cyberpunk-study/production/verify-browser.mjs
node projects/cyberpunk-study/production/verify-browser.mjs --short
```

The layout check uses legal chapter checkpoints at 320 × 568, 390 × 844 and 1440 × 900. The browser checks execute real pointer combinations at 390 × 844 and, with `--short`, 320 × 568. The branch check explores up to 2,500 states per chapter, verifies fixed-object retirement and samples continuations. It reports limits separately from failures. Generated check output goes to ignored `runs/harbour-verification/`; record concise outcomes and discard it afterward, following [verification policy](../../../docs/engineering.md#verification-records).
