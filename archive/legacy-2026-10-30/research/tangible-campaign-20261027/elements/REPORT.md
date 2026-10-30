# Elements river campaign — executable research draft, not release content

## Useful result
The new tangible model can express a 31-stage river-to-coast campaign requiring **197 distinct successful creations**, rather than the previous bank’s44. All201 recipes validate; a source-aware legal replay finishes in233 accepted actions (197 creations,5 catalyst placements,31 advances), with no visit/backtrack actions and four unused outputs. This is evidence of reachability and authored task length, **not evidence of fun**.

**Reject this draft for direct live integration:** it peaks at54 current-area items and several fixed structures are implausibly carried. The mobile target was approximately30–40 maximum, ideally materially below that. The middle third repeatedly exceeds45. No source-blind player has yet evaluated this draft.

## Files and reproduction
- `build.py`: authored201-recipe,31-stage source.
- `annotate.py`: adds researched caveats and revised narrative. Run after build.
- `scenario.json`: common executable schema.
- `evaluate.ts`: source-aware constructive goal solver using real engine actions, not a closure-only simulation.
- `metrics.json`: stage-by-stage creation and visible-item burden.
- `solution-actions.json`: replayable exact actions.

Run `python build.py && python annotate.py && node evaluate.ts` from this directory. Validation: `node ../engine/cli.ts validate scenario.json`.

## Narrative beat map
1–3: four storybook elements become supper and an overnight home.
4–6: cross a brook, harness its flow for flour, then make risen bread for the journey.
7–9: preserve summer fruit, furnish a durable communal table, make shared tools.
10–15: cross wider water; prepare harbour, garden, irrigation, shade and invitations.
16–20: prepare music and stories, then let the gathering reveal pond life, plants and weather.
21–24: provision crossing and winter, provide drinking water, light the water at dusk.
25–28: agree when to meet, chart stars and river, leave a public visual record.
29–31: wash, cook, gather, and leave an atlas for later visitors.

Strongest local sequence for a fresh trial: **Crossing → Mill → Bakery**. Different but legible motivations, old tool reuse, construction, a mechanical payoff, and fermentation are more promising than a generic “choose two useful objects” category. Comfortable progress is intentional; it need not be an optimization puzzle.

## Quantitative limits
201 authored outputs;197 objective-prerequisite outputs on the successful route. Unused: Brush, Brine, Salt, Hourglass. These optional items must not be counted as player duration. Stage counts range3–11 creations. A source-aware recursive solver has the entire recipe table; zero failures says nothing about player inference difficulty. All outputs are globally available once operands/settings exist, so an exploratory player can encounter future material earlier than the test route.

Conservative future-use carry, not magical hiding, produces54 visible things at Waterworks and Theatre. Optional recipes also keep useful-looking raw materials alive. Aggressive arbitrary retirement is not an acceptable repair. The old152-output experiment’s hidden benches and automatic terminal disappearance are absent.

## Known design defects to resolve next
- **Physical structure transport:** Bridge, Dock and Lighthouse are late map ingredients. Greenhouse reuses an earlier House. Landing clock and Lantern launch also turn stationary infrastructure into ingredients. These should become on-site recording/placement actions and durable places, or the story should revisit explicitly with the necessary portable tools. Do not silently teleport them.
- **Place versus thing ambiguity:**31 named stage areas but only7 functional locations. This is intentional segmentation, not31 catalysts, yet some stage titles are not convincing geographic travel destinations. Current travel copy is still scaffolding.
- **Count pressure:** new timekeeping/gallery/washday/kitchen branches improve breadth but have not earned their place through play. Do not add three arbitrary combinations just to change197 into200.
- **Contrived tool recipes:** Stone+Axe→Hammer, Iron+Stone→Carving tool, and Cloth+Air→Bellows are not sufficiently grounded. The unique binary-pair restriction exposed the need for genuine fabrication context or a coherent common tool, rather than synonyms to avoid collisions.
- **Structure accumulation:** broad reused craft primitives and future record-making cause excessive carrying. Design short geographic loops with explicit return, or produce portable records at first visit, rather than hidden inventory.
- **Gathering errands:** sustained preparation is coherent but risks becoming a sequence of favors with no discoveries or reversals. Naturalist/weather/navigation sections need trials to establish whether their new ways of seeing are genuinely rewarding.
- **Finale semantics:** Lantern launch is an event, not a portable item. Make it a clear current-stage placement objective at a durable landing. Likewise prefer installing an actual clock to inventing “Landing clock.”

## Authenticity
This is explicitly storybook alchemy, not a complete bill of materials or historical chronology. Sources in scenario metadata are checked institutional pages. Corning confirms ordinary glass needs ingredients omitted by Sand+Fire. Kew grounds herbarium/book relationships; proper specimens include preparation and documentation. Science Museum clock evidence makes clear that pendulum+gear omits power and escapement. CPSC supports the broad oil/alkali relationship for soap; no real hazardous procedure is given. Water filtering/boiling recipes are not real safety instructions. No claim that a sand/charcoal filter makes arbitrary water safe.

There are more unresearched abstractions than these annotations cover: metallurgy, glaze, preservation, optics and fermentation especially. Independent authenticity review is required before release. No automated result establishes historical accuracy.

## Follow-on experiments
`local-records-scenario.json` repairs some concrete semantic defects: record bridge/landing/lighthouse when visiting them, carry the maps later, replace a transported landing clock with a ferry timetable, and replace the non-object Lantern launch with a placement goal at the final landing. This variant legally completes196 creations from200 recipes, but **still peaks54 things**. Earlier paper-making offsets removing infrastructure carry. Semantic correctness is valuable but is not a mobile-layout solution. The variant is still not release quality.

An explicit next-project carrying experiment used genuine `visit` actions to collect left-behind required things from their old areas, grouped by area before returning. All objects stay tangible; none are remotely fetched or hidden. Peak local things fell to20, but required212 visit actions! That is106 round-trip retrievals: administrative busywork, not a successful design. No narrative was authored to justify this sequence.

A future-project lookahead sweep measured the trade-off:

| Carry horizon | Peak local things | Visit actions | Required creations |
|---|---:|---:|---:|
| 1 project |20|212|196|
| 3 projects |22|156|196|
| 5 projects |26|100|196|
| 8 projects |30|66|196|
| 12 projects |38|32|196|
| All projects |54|0|196|

These are omniscient route diagnostics, not proposed player inventory rules. Horizon12 suggests restructuring geographic clusters and a few meaningful returns may achieve useful density; simply making the player curate belongings is not the answer. Reordering stage dependencies by a synthetic greedy objective reduced peak54 to47 but gave incoherent ordering (for example music before invitations); that experiment is explicitly not an authored story or a valid fun result.

### Frozen small trial
`pilot-frozen-v1.json` is the Crossing→Mill→Bakery prepared checkpoint:19 possible recipes,11 earned starting things. It validates against the shared engine. `pilot-provenance.json` contains the exact upstream source-aware checkpoint route and SHA256, and must not be shown to a source-blind trial player. The fixture starts after earlier completed chapters and excludes their irrelevant left-behind belongings; it is not a full save or a migration. Do not claim this fixture tests the entire campaign.

### Geography grouping first pass (negative result)
`geography-design.py` creates real clustered regions with several jobs per physical area and a return to the riverside hall. It also declares physically incorporated components for safe retirement; the engine still retains any component with a further use. After correcting an illegal irrigation-before-quarry sequence, it legally finishes196 creations, but peaks at **61** current-area items. Several jobs in a shared area naturally retain all their completed products, which is the desired tangibility behavior; merging area IDs therefore worsens density unless recipe reuse and travel phases are redesigned too. This draft is research evidence, not proposed release content. The frozen pilot is unchanged.

The next promising content-level design is an outbound field kit and a later return to a prepared home/pantry, not a rolling omniscient twelve-stage inventory window. Put late food, vessels and fixed workshop fixtures at a durable home area, undertake observation/navigation with a compact set of portable tools, then return for the gathering. Group only a few local jobs per physical board; a whole town on one board accumulates too many completed things. Both future-use graph and tangible spatial accumulation need to be measured.

## Current-scene packing v3 — promising mechanical result
Following the newer user instruction to bring just the current scene’s things, shared engine v3 automatically transfers the actual already-made prerequisite objects from accessible prior areas, with provenance. This is a changed rule, not a claim that the older manual-retrieval policy worked. No items are cloned or newly granted; finished things remain in old scenes.

`prepare-v3.py` / `v3-scenario.json` retain the portable geographic-record fixes, and only share areas where the same real setting is genuinely necessary: Garden→Waterworks and Music→Theatre. No portable/fixed item type or extra UI grammar is introduced. Tower uses Brick+Window; the attempted Brick+Iron pairing collided with Stove and was rejected.

Measured legal replay: **200 authored recipes,196 required creations,31 stages,6 placements,0manual visits; peak28 local things.** Garden→Waterworks reaches28, Music→Theatre26; every other endpoint is20 or fewer. All196 goal-route outputs are reachable. The mapping stage now has only one new synthesis because geographic evidence is recorded at first visit: consider merging that reward into its surrounding chapter instead of adding an unnecessary modal/transition.

This resolves the measured local carrying burden under the new packing rule. It does **not** resolve all authenticity/narrative concerns listed above, nor establish source-blind fun. `v3-metrics.json` and `v3-actions.json` are source-aware evidence. The separately frozen Crossing→Mill→Bakery pilot is unchanged and remains the appropriate small blind trial.
