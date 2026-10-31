# Elements icon study — 31 October 2026

Seven playable versions of **The maker's clearing** compare the same twenty belongings and two House fittings. Start `npm run dev`, then use the catalogue or these routes:

| Direction | Local player |
|---|---|
| Coloured woodcut, following the original reference | [Try coloured woodcut](http://127.0.0.1:5173/combinations.html?story=icon-test-woodcut-color) |
| Wood engraving, revised after the Blake discussion | [Try wood engraving](http://127.0.0.1:5173/combinations.html?story=icon-test-woodcut) |
| Risograph | [Try risograph](http://127.0.0.1:5173/combinations.html?story=icon-test-riso) |
| Medieval manuscript | [Try medieval](http://127.0.0.1:5173/combinations.html?story=icon-test-medieval) |
| Traditional game | [Try traditional game](http://127.0.0.1:5173/combinations.html?story=icon-test-traditional-game) |
| Japanese Edo | [Try Japanese Edo](http://127.0.0.1:5173/combinations.html?story=icon-test-japanese-edo) |
| Encyclopedic engraving / Diderot | [Try encyclopedic engraving](http://127.0.0.1:5173/combinations.html?story=icon-test-diderot) |

Each story owns 20 item PNGs, two transparent House overlays, one background JPEG and its Markdown. These deliberately dense comparison boards are not proposed twenty-item opening chapters for Elements. The full Elements manuscript remains unchanged. Syntax belongs to the [specification](../story-format-spec.md); interaction belongs to [UX](../ux.md).

## Compare the screenshots

Open the [comparison gallery](screenshots/index.html) for an overview or a horizontally scrollable row at phone size. Click any screenshot to see its full resolution. The [overview PNG](screenshots/comparison.png) and [single-row PNG](screenshots/side-by-side.png) can be saved or shared directly. With `npm run dev` running, the gallery is also available at [the local comparison page](http://127.0.0.1:5173/docs/icon-study/screenshots/index.html).

All seven captures show fresh opening states after Begin, with the same 390×844 viewport and a 2× pixel density. They include every item and its matching background; no combinations have been performed and hover labels are cleared. The [capture manifest](screenshots/manifest.json) records the source commit, browser, dimensions and files. Reproduce them against a running development or production-preview server with `node scripts/capture-icon-study.ts`; set `ICON_STUDY_URL` to use a server other than `http://127.0.0.1:5173`. These are ordinary Chromium captures, not generated mockups or native-phone photographs.

## Visual language

Keep a recognizable silhouette before texture. At the usual 56px display size, one or two identifying structures matter more than surface detail. Most source PNGs are 224×224; long or tall unframed objects can be 288px wide or 272px tall. House and its registered layers are 384×320. The renderer uses one quarter of natural pixel dimensions, then the board's responsive scale. Base silhouettes and fitted layers use a common canvas; overlays are not standalone item portraits.

| Direction | Line, palette and texture | Perspective and scale |
|---|---|---|
| Coloured woodcut | Warm black, ochre, clay red, slate blue and dull olive; broad pale cuts and imperfect flat ink; no enclosing frames | Plain working objects, angular contours and spare detail; quarter-size silhouettes on a matching pale printed clearing |
| Wood engraving | Monochrome broken contours and fine hatch; no enclosing badge or decorative frame | Modest observed objects, irregular ground marks, restrained volume; clear structure ahead of texture |
| Risograph | Flat vermilion, mustard and black; sparse misregistration and patterned ink | Flat or simplified oblique views, variable natural shapes, strong solid areas |
| Medieval | Umber outlines, lapis/ochre/red/green washes and parchment panels | Frontal or flattened views; decorative borders retained as this comparison condition |
| Traditional game | Painted surfaces on exactly 20%-opaque black circular backings | Three-quarter views, ordinary 56px circles; rectangular House canvas |
| Japanese Edo | Brown contour, indigo, red and straw; printed texture | Flattened oblique objects, varied silhouette; no common badge |
| Diderot | Sepia contour and hatch, restrained material washes and ivory grounds | Observational technical views simplified for the phone; not literal reduced historical plates |

The first woodcut and riso generations drifted toward rounded game inventory graphics. The user rejected the woodcut's thick borders and cute rendering. A second style-only generation still drifted and was rejected. A reference-led monochrome generation was retained; two illustrations were then repaired after review. These are contemporary generated interpretations, not authentic historical prints or a claim about what William Blake would have made.

Blake's actual *Thornton's Virgil* engravings cut white lines through black masses; his illuminated books use a different relief-etching and hand-finishing process. The [NGV article and reference image](https://www.ngv.vic.gov.au/essay/william-blake-and-the-ngv-the-history-of-the-virgil-wood-engravings/) guided the revised engraving. The [British Museum account](https://www.britishmuseum.org/collection/term/BIOG19807) supplies the illuminated-printing distinction. An early illuminated-colour proof did not escape the rendered-game look and remains an unused proof.

The user subsequently asked for the colour and feel of [the original woodcut reference](../../references/icon-sets/art-styles/woodcut.png), with an earnest treatment. The seventh story follows that reference directly, keeping the monochrome engraving available separately. Its first proof retained too much fine hatching and modeled miniature detail. A second pass uses broader cuts, flatter coloured areas and fewer presentation shadows. The generated clearing uses the same inks, with a pale open centre. The reviewer still has reservations about its game-inventory character; this is a comparison to try, not a claim that human style preference has been settled.

The traditional circles were corrected after the user specified **20% black**, rather than opaque charcoal. Image generation isolated the foreground objects; deterministic canvas composition puts a black disk with alpha 51/255 behind each. Foreground paint retains its own opacity, including the translucent air and smoke. This isolation may repaint small details; it is not a pixel-identical cutout. The original atlas and earlier review sheets are retained, and those earlier reviews describe the opaque-backing version.

## Recognition record

Hypothesis: small pictures can identify the intended object family without permanent text cards. A wrong best guess, or a distinction recovered only after context, is contrary evidence. Broad synonyms such as soil/Earth, gear mechanism/Clockwork, wind/Air and metal ingots/Iron count as family matches; a generic fruit drink is insufficient for Cider, and salt alone is insufficient for Brine. These are author-scored categories, not a calibrated recognition benchmark.

The numbered sheets show icons at their reference CSS sizes against paper, with shuffled target order and no names. A reviewer saw each complete sheet, not isolated trials; neighboring objects could help interpretation. Source and targets were withheld by assignment rather than an OS sandbox. Recognition was not timed, so these tests do not establish recognition speed equivalent to text.

| Round | Exposure | Result and action |
|---|---|---|
| [1: blind](reviews/round-1-blind.md) | Fresh reviewer; initial woodcut and riso, 40 pictures | 36/40 broad family matches. Both Brine pictures read as salt; both Cider pictures read as vessels/fruit drink. |
| [1: guided](reviews/round-1-guided.md) | Same four pictures, shoreline/evaporation and orchard/yeast context | 4/4 recovered saltwater or fermented fruit drink/cider. These are context-aided answers, not blind successes. |
| [2](reviews/round-2-review.md) | Same reviewer, all six styles, 120 pictures | The new engraving's Botanical drawing became a loose leaf; Earth resembled organic scraps, and Brick remained generic masonry. Repaired the first two; tightened atlas crops. Riso mat read as a patterned rug. |
| [3](reviews/round-3-review.md) | Same reviewer, revised engraving, 20 pictures | Botanical drawing read as a botanical sheet and Earth as loose soil. Brick remains ambiguous. |
| [4: colour](reviews/round-4-colour-review.md) | Same reviewer, first coloured woodcut proof, 20 pictures | Objects were broadly identifiable; brine's crystals looked like shells, and metal/drink distinctions remained uncertain. Reviewer identified fine hatching, modeled volume and a cozy inventory feel; prompted a flatter, broader-cut revision. |
| [5: colour revision](reviews/round-5-colour-review.md) | Same reviewer, revised coloured woodcut | Flatter colour and reduced shadows helped the earnest print direction, though clean outlines still suggested inventory art. Pendulum/weight, feast/workbench and soil/gravel distinctions weakened; no recognition score. |

Additional fresh reviewer creation was rejected by automatic approval review. Rounds 2–5 are explicitly repeat exposure, including remembered context for Brine and Cider. Their answers are diagnostic feedback and must not be pooled with round 1 into a final blind-recognition percentage. All raw answers and exact numbered inputs are retained, including failures.

Remaining questions for human comparison: monochrome Brick versus stone; Brine versus salt/water (the coloured crystals also read as shells); Cider versus juice; smoke versus steam; whether the patterned riso mat and tripod-bearing telescope would conflict with more specific Elements items. The coloured revision introduces weaker distinctions between pendulum/weight, feast/workbench and soil/gravel. Its stronger printing treatment is a style tradeoff, not an unqualified recognition improvement. Edo/Diderot/medieval are still stylized interpretations. No set has been selected for the whole Elements story. Human style preference, recognition speed and native touch remain unmeasured.

## Assets and reproduction

Artwork was produced with the built-in image generator. [Exact prompts](prompts.json) record selected and rejected directions. Source atlases and the reviewed superseded sheets are under `references/icon-sets/generated-study/`; purchased/reference artwork was not modified. The new [coloured assets](../../stories/icon-test-woodcut-color/assets) and corrected [traditional assets](../../stories/icon-test-traditional-game/assets) live with their stories. [Atlas maps](atlas-maps) record extraction regions. Mechanical extraction, resizing, alpha padding, traditional circle composition and slot registration use Chromium canvas; they do not synthesize or redraw the illustrated objects.

```sh
node scripts/prepare-icon-study.ts riso woodcut woodcut-color medieval traditional-game japanese-edo diderot
node scripts/pack-icon-slots.ts riso woodcut woodcut-color medieval traditional-game japanese-edo diderot
node scripts/icon-review-sheet.ts woodcut /tmp/woodcut-review.png
```

Use the selected Botanical drawing, House and Thread as a small reference family when extending a chosen direction. Supply the physical object and relevant story context, then test its silhouette against its nearest confusable neighbors. Do not promote an attractive large sheet without checking the phone-size objects and their background.

All seven stories pass lint without warnings, and the production build passes. The initial implementation passed 77 Node tests and 19 Chromium tests. Final artwork checks exercised every story at 390px and 320px, fitting both House parts, reloading saved state and checking dimensions, errors and overflow; the coloured woodcut and corrected traditional set received those checks again after their asset changes. A pixel audit found exact 20% black backing pixels and transparent exterior pixels in all twenty traditional icons. This is Chromium evidence, not a native iOS test. Hosted publication was blocked at the repository write-credential step; the existing private site's access and deployment were unchanged.

Integration onto `origin/main` at `1c1e6b9c` passed all 86 Node tests and 24 Chromium tests plus the production build. The encyclopedia's pressed book cue and deliberate reading behaviour also apply to icons; a held drag opens no reading. The user subsequently authorized committing and pushing this integrated work.
