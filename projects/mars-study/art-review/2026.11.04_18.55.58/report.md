# Live Mars feedback: final artwork and interaction outcome

The final microscope-slide review began **4 November 2026, 18:55:58 America/Los_Angeles**. This record also consolidates earlier independent stages of the same revision; their individual start times were not retained. Follow the [icon-guide review method](../../../../docs/icon-guide.md#6-run-separate-recognition-and-art-direction-reviews) and [retention policy](../../../../docs/engineering.md#verification-records). Selected production sources, exact requests and registration live in [live-feedback](../../production/live-feedback/README.md); raw review inputs and captures were disposable scratch.

Version: live `stories/mars/mars.md`, SHA-256 `0079d5f1f149182842d5f533fd5741da0c3d85592921c0db03a88bcc973757cd`, with the selected `assets/live-feedback/` exports. The new glass family uses `sources/glass-slides.png`, the recorded extraction polygons and RGBA `(237,239,239,51)` backing. Final slides display at 96 × 50 CSS pixels. The manuscript uses one prepared image for two separately identified specimens.

The 90 runtime exports have aggregate SHA-256 `ac9d7ac09eaf2524f4874f45d342d09e8f910bf0597ef12df055fb975bb326d8`, hashing compact JSON of sorted `[relative POSIX path, file SHA-256]` pairs beneath `assets/live-feedback/`.

## Independent review and adopted repairs

All reviewers were agents separate from the producers. Scene reviewers knew the brief and intended actions; those checks are informed continuity/interaction evidence, not unaided recognition or human preference. Revised artwork received a new reviewer.

| Assignment | Coverage and conclusion |
|---|---|
| `live_cave_garden_review` | Chapters 4–8, 13, 17 and 21; 39 pointer combinations and 56 captures at 390px/320px. Found a broad tan irrigation-header mask and a straight cleared-floor boundary. Narrow pipe extraction and a terrain-following mask repaired them. Berth ordering, garden state preservation, low covers and furnace continuity otherwise supported. |
| `live_water_fuel_review` | Chapters 2–3, 9–12, 14–15, 19–20 and 22; 51 states at both widths, including 16 narrow-screen drags. Found the lander replacement rectangle, right transfer-tank clipping, disappearing reached rover and tank creation obscuring the cell. Repairs restrict the replacement footprint, move the tank inboard, retain the same rover at the cable end and place new tanks away from the cell. Reviewed all eight reactor fitting states. |
| `live_mars_final_visual` | Fresh informed review of repaired chapters 5, 7, 11, 14, 19 and 20, after removal of the runtime wash. 45 combinations plus targeted ice-face and stable-320px gas checks; both gas orders and reload. No remaining scene seams, missing rover, support bricks or cropped tank bodies in those views. |
| `live_icon_recognition` | Unnamed pot and old-slide images at play size, then ordinary lab context. Pots distinguished empty/ice/liquid states; exact fluid composition remained uncertain. Old slides read as test strips unaided and recovered as slides in context. Those slide depictions were rejected. |
| `glass_icon_first_read` | Fresh unnamed review of the replacement glass silhouettes before the later backing finish, at 96 × 50 on light/warm grounds. Read blank and prepared microscope slides; the coverslip distinguished preparation, while specimen composition remained unknown as intended. This outcome does not evaluate the later 20% backing. |
| `glass_final_context` | Fresh informed review of the finished 20% panes over actual lab scenery; chapter 9 and 12 routes independently at 390px and 320px. Blank reading, sample preparation, microscope use, movement away, return and rereading all worked through ordinary controls and pointer drags. Frosted ends, pane edges and prepared coverslips remained visible over textured floor, filter and microscope stage. Enlargement fits without hiding the working microscope. No browser errors. The assignment disclosed identities, so this is not blind recognition. |

Root integration also identified the background-only scrim: source-matched pixels were being rendered differently from fixed artwork. Removing it fixes this class of seam across stories. The new regression test compares both the replacement against scenery and scenery against the authored colour.

## Verification and practical limits

- TypeScript passes. The complete legal route covers 24 chapters, 101 recipes and 213 actions. All **75** targeted alternate continuations replay to the ending, including both pot orders, independent beds, either gas order, reactor permutations, harvest/cooking alternatives and the two original cores.
- All **31** protected-region comparisons pass. Cave/furnace/lander protected surroundings remain unchanged; a small resampling difference inside the water vessel remains below the declared tolerance. These comparisons cover named regions, not every silhouette edge.
- The focused icon/scenery browser run passes **33 tests**; the subsequently strengthened authored-colour assertions pass at both widths. Actual scene reviews supplement those generic tests.
- All **190 unique referenced images** decode successfully (283 manuscript references). Cleanup removed 12 unused runtime proofs and obsolete slides; the 90 retained live-feedback exports are unchanged by cleanup. All **716 v12 files** and **405 illustrated-baseline files** match the directory digests in `promotion.json`.
- Full lint has no fast/image/placement errors, three intentional mixed-fate warnings, and the existing **20,000-state fixed-analysis limit**. Arrival/retirement/peak-target safety is therefore not exhaustively proved. The limit remains enabled; no full build or hosted publication is claimed.
- At the reached bank, the automatically carried drill can cover the rover/cable connection until moved aside. The reviewer confirmed the same underlying rover and working ice-face target at both widths. This is a remaining visual-crowding limit. The oxygen transfer tank fits at 320px with little left margin.
- Water and ice slides intentionally share their visible preparation. Names and readings convey provenance and findings. Reviews support informed legibility and tested interactions, not human recognition rates, learning, enjoyment, native touch behavior or an engineered mission budget.

The [three-view design sheet](../../production/live-feedback/design-examples.md) was refreshed separately from actual gameplay. Frozen v12 and illustrated-baseline remain reference material; the study stays active.
