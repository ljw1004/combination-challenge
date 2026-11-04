# Mars v12 emergency revision

This active production phase implements the user's 32-point response, **Iron recovered from the red ground without char or alloying**, and the later austerity pass. The [current manuscript](../../../mars-v12/mars.md) has 24 chapters. The [design brief](../../../mars-v12/design-brief.md) owns adopted physical and visual intent; this record owns this phase's work and verification scope.

- [Story plan and all 32 request mappings](story-plan.md)
- [Manual water and garden consultation](science-water-garden.md)
- [Metal, gases, fuel and support consultation](science-metal-fuel.md)
- [Current material survey](../../../mars-v12/metal-survey.md), with the earlier survey preserved behind an explicit historical boundary
- [Focused branch verifier](tools/verify-branches.ts)

The revision moves water electrolysis after discovery and iron-making, merges fuel construction, removes heat storage, and retains the merged harvest/supper chapter. The same manually made oxygen and methane cylinders feed the lander separately. The austerity pass removes the cave baffle and potato collar, uses existing attachment tabs and a salvaged synthetic cargo net, and specifies plain equipment with finite precision-part donors and one shared process instrument. Cave shelter, independent crop planting, standalone ice slab, ordered support repair and ascent above the completed base follow the latest feedback.

## Semantic outcome — 4 November 2026

The implemented graph has **24 chapters and 97 combinations**, including implicit compound fittings. Fast semantic checking and referenced-image path checking passed with no errors. These semantic image checks establish file existence, not visual suitability; the final artwork and browser evidence is recorded separately below.

The complete legal checkpoint reached the ending in **207 engine actions**, including reading dismissals. The focused verifier passed **80 branch continuations**, replaying each to the ending through the shared engine. Coverage includes both opening goal orders, four Air fitting orders, manual-water orders, both ceramic product orders, the six-state cave construction, all 24 planting/cover orders, both direct-hilling/net-support orders, the reused-filter discovery, crossing and slab gates, both concentration/adaptation orders, four water-gas orders, all 24 methane-assembly orders, support blocking before stone removal before Iron, both flight-transfer orders, mandatory raw-bean retirement at the sink, and all six specimen-stow orders. Every visited scene stayed at three or fewer active fixed targets in these witnesses.

**Full lint remains incomplete:** its fixed-item verifier reaches the existing 20,000-state limit and reports `fixed-analysis-limit`. The final run reported no other errors. The scoped witnesses above do not substitute for exhaustive retirement, arrival or hotspot-count certification. No engine limits were changed or checks suppressed.

Four mixed-fate warnings were reviewed and retained deliberately:

| Identity | Why its fates differ |
|---|---|
| Assembled solar furnace | Ceramic batches preserve it; fitting the laboratory electrodes transforms the same installation into its adapted state. Both ceramic products are required before leaving Fire. |
| Lined harvest basket | The first lettuce picking preserves the reusable basket. The later final-harvest operation consumes its empty state into the first potato load. |
| Potato harvest in basket | Continued harvesting preserves the potatoes set aside on the clean counter. Cooking consumes them into the stew. |
| Lettuce harvest in basket | Gathering the final soybean load preserves the lettuce set aside. Serving consumes it with the cooked stew. |

The raw soybean harvest has no alternate cooking use; washing transforms and retires it before cooked beans can enter the stew. The artifact's scoped checks are developer replay witnesses, not a fresh player study or an engineering qualification.

## Run the checks

From the repository root:

```sh
node projects/mars-study/production/v12/emergency-revision/tools/verify-branches.ts
npm run lint -- projects/mars-study/mars-v12/mars.md --details
npm run checkpoint -- projects/mars-study/mars-v12/mars.md 23 runs/mars-v12-ending.json
```

The branch verifier includes fast semantic and image-path checks and prints a concise outcome. The full lint command currently exits with the bounded fixed-analysis error described above. The checkpoint is disposable scratch output; remove it after use. Keep captures, transcripts, checkpoints and detailed run output under ignored `runs/`, following the [engineering retention policy](../../../../../docs/engineering.md#verification-records).

## Artwork and earlier evidence

## Artwork and browser outcome — 4 November 2026

Current generated artwork is integrated through the single [survival pipeline](../survival/README.md). It exports 24 backgrounds, 82 fixed appearances and 48 portable icons; the parser catalogue contains 160 identities and 200 referenced runtime bitmaps. Integration asserts that artwork changes preserve parsed prose and gameplay.

The actual browser completed all 24 chapters through visible Start, Begin, drag/combine, reading and Next interactions. All 200 referenced bitmaps decoded. Arrival checks and selected construction milestones covered 320×740 and 390×844 viewports, independent fitted canvases, active-target limits, movable-item bounds and saved-state restoration. A separate run passed both oxygen/methane transfer orders, wrong-port rejection and transfer reloads. The gully drill action successfully used the derived ice-bank receiver after crossing. These are emulated-browser witnesses, not exhaustive ordering or native-touch certification.

`npm run check` passed. The current 80-branch verifier passed; full lint reported only the bounded fixed-analysis error and the four reviewed warnings above. No engine checks were disabled. Reuse naming reported zero pending renames. Current source/extraction geometry and hashes are in `selection.json`, `registration.json` and `catalogue.json` beside the exporter.

Fresh independent review records:

- [Original austerity pilot art review](../../../art-review/2026.11.04_12.44.32/report.md) and [two-stage pilot interpretation](../../../art-review/2026.11.04_13.34.42/report.md). The latter honestly records retrospective hashing and its original exposure limits.
- [Garden composition review](../../../art-review/2026.11.04_13.21.21/report.md): kept planting, hilling, irrigation and canopy; requested clearer pre-existing screen anchors.
- [Thirteen-scene review](../../../art-review/2026.11.04_13.28.08/report.md): kept the cave, furnace, field, support, transfer and specimen/ascent work; found rectangular water-cap replacement seams.
- [Final assembly and portable review](../../../art-review/2026.11.04_13.34.39/report.md): no blocking defect in the repaired water cell, all 16 fuel fitting subsets, four garden states/supper and 16 selected portable proofs. Small fittings need service context; empty/full opaque cylinders intentionally share appearances. Granule firing relies mostly on colour, the rock has coarse texture, and a small controller readout cannot prove shared identity by itself.

Exact executed requests and selected masters remain in production. Superseded source iterations and unused runtime exports were pruned after integration. Temporary review packets, browser captures and detailed output stay under ignored `runs/` and are removed after retaining these concise outcomes.

The [preceding survival verification](../survival/feedback-verification.md), earlier materials/fixed-item production records and previous visual reviews describe their recorded versions. They remain useful provenance, but their passes and old chapter counts do not verify this 24-chapter graph or its replacement artwork. This remains an active development draft outside the published story catalogue.
