# Mars v12 — independent final artwork review

**Outcome: repair two fuel scenes and one portable; keep the remaining reviewed artwork.** This verdict applies to the frozen **pre-repair** pictures identified below. Subsequent oxygen-routing and lettuce repairs were not shown to this reviewer and require a separate fresh review.

The assignment began **4 November 2026 at approximately 08:13 PST**. The precise second was not recorded; `00` in the directory name is a minute-granularity convention. Reviewer: fresh independent AI agent `feedback_final_scene_review`, with no participation in making the artwork and no prior exposure to it or earlier review answers.

The informed assignment used the [icon guide](../../../../docs/icon-guide.md), [v12 design brief](../../mars-v12/design-brief.md), [established Mars brief](../../../../stories/mars/design-brief.md), project philosophy and [equipment reference](../../inspiration/02-multiple-accents.png). The [production record](../../production/v12/survival/README.md), [selection](../../production/v12/survival/selection.json) and [registration](../../production/v12/survival/registration.json) own the continuing artwork provenance; their current contents may include later revisions.

## Coverage and conditions

Visually inspected all **24 scene proof sheets, 103 fixed appearances and their supplied slot overlays**, plus all **23 portable proofs**. Scene cells were 390 pixels wide; portables used their authored playing sizes on light, dark and Martian grounds. The packet included exact manuscript, layout, artwork and registration snapshots. The reviewer consulted manuscript dependencies when interpreting independent equipment and mutually exclusive appearances; an all-appearance sheet was not treated as a legal gameplay state.

Seven completed legal checkpoints were also inspected in Chromium at **390 × 844**: Air, Earth, A bed under the hill, One room for roots, Heat worth keeping, Keep the roots alive, and Supper from the garden. These used the frozen manuscript and the then-current assets before the subsequent repairs. A closer garden comparison confirmed that the liner changes the rim silhouette while preserving the ceramic footprint.

## Decisions

- **Needs repair — Fuel from air and water and Two tanks, two liquids.** In the isolated `connected-oxygen-store` appearance, the right-hand hose visibly emerges beside the central reactor and enters the oxygen flask, mirroring the left methane outlet. The same route persists in the transfer scene. It reads as two reactor products, contradicting the specified oxygen supply directly from electrolysis. This is visible in the pictures themselves and is not caused by stacking exclusive states. Give oxygen a visibly separate supply route. The rejected source versions are [lean-fuel-build-footed.png](../../production/v12/survival/sources/lean-fuel-build-footed.png) and `lean-fuel-transfer-footed.png` (superseded source; hash retained below).
- **Needs repair — `supper-lettuce`.** The portable repeats the earlier lettuce-in-basket picture from [survival-harvest-foods.png](../../production/v12/survival/sources/survival-harvest-foods.png), although this harvest explicitly uses fresh food cloth. Depict the leaves on that cloth. This is a smaller continuity mismatch; the completed supper already places lettuce on cloth correctly.
- **Keep — the other 22 scenes and 22 portables.** All seven cave-hab scenes retain the intended architecture: exterior door left/window right; garden interior window left, sink centre-left and door right; separate opaque rear sleeping and service alcoves; and a distinct original surface dome for laboratory/control scenes. Side/back edging first appears with the floor and stays in place, the deflated envelope occupies its final footprint at roughly one fifth height, and the window warms only after lighting. Keep the stable furnace and lander geometry, low unloaded rock catch and modest permanent support, separated well and water routes, single original array and independent cable, grounded gully/winch, cold-core preparation, compact laboratory, full entrance-wall curtain, modest stationary fuel stores, complete independent lander transfer lines, and cooked camp-pot stew followed by fresh lettuce. No further blocker was found.

This is **informed AI visual judgment**, not blind recognition evidence, a human preference trial, a fresh playthrough or a mission-engineering certification. The seven browser views establish checkpoint appearance, not an interaction test. Exact gas identity, washing/soaking and examination history appropriately depend on ordinary names and readings. The assigned 24 scenes exclude the two reused manuscript chapters; their artwork is outside this coverage.

## Frozen version identification

The disposable packet was `runs/mars-feedback/final-art-review`. SHA-256 values identify its snapshots and the three negatively reviewed proofs; no raw notes or screenshots are retained here.

| Frozen file | SHA-256 |
|---|---|
| `mars.md` | `e9bcf68cd69123957b0708942b4cdab1d50ed0b14bff1dc6df2404156e1a8bc6` |
| `layout.json` | `3adcbe860f84dd6aa5454ada50f345a431e98c93df9dcd0d4fb4c62f303a0203` |
| `artwork.json` | `ecbbc8d1a6d7f5d44d403a77aa9ae0509217ca2f0a87fc39676a7bc28b7b3545` |
| `registration.json` | `7b7563ea859e84932a59a1f4a160a55e4f57b21c72d0c8d11abaa619aab25713` |
| `Fuel from air and water.jpg` | `0aee35491a3ca764eb8524b3cd5ad7d6bc95d2fb0fce487f71bcd5f62ebdfcff` |
| `Two tanks, two liquids.jpg` | `9ddffa8ba7751971cfd3706fad1dfb07879efdd33d1b143150a4d476e6a574bf` |
| `supper-lettuce.png` | `842c01ac41b2cebecbf41c4f92cb9ead00b622a893bde1b18a2fa06c76b72337` |

The combined fingerprint of all 47 image proofs is `1d925082b6f6f158782a2c8a9cdccb46e06519260974ef833357016a7ec9446f`: SHA-256 of UTF-8 lines `filename<TAB>file-sha256<LF>`, sorted by filename. This records the reviewed image set without preserving disposable review artifacts.
