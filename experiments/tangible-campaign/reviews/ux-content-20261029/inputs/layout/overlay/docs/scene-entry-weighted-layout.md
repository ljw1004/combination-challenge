# Opt-in first-entry working-set layout

Implementation record, 29 October 2026. Logical geometry only; this record is not browser, native-touch, human visual-perception or enjoyment evidence.

## Current direction and authoring contract

A new scenario may set `locationPlan.entryLayout: 'weighted-third'`. Omitting it retains historical geometry. The reference panel remains 390 × 844; logical widths 320–390 continue to work. This is a declarative first-entry policy, not a renderer or an automatic tidying rule.

The user's final clarification supersedes the temporary suggestion that hotspots join the movable centroid: movable things should sit around one-third of the panel height. Hotspots represent scenery/furniture and should generally be introduced lower, anticipating future background artwork. “Below the fold” is interpreted here as beneath the working set/new-arrivals separation where feasible, **inside the bounded playable panel**, not an instruction to hide targets offscreen. No background image was regenerated.

- Movable rectangles contribute `width × actual rendered height` to a reproducible vertical center-of-weight approximation. Tall labels therefore count appropriately; reserved future construction height constrains bounds but does not add visual weight. This is an engineering approximation, not a perceptual measurement.
- First-entered items retain their x coordinates, full sizes, occupied vertical bands, old overlap geometry and order. Only globally empty vertical gaps can shrink, all by a common proportion. Compression is chosen only as needed for the closest feasible center; the arrival divider's gap stays intact. Existing carried/new grouping is preserved, with genuine new stock below the carried cluster.
- Newly initialized hotspots receive a separate rigid group translation toward a lower playable band (nominally 72% of panel height). They are never part of the one-third item weight. Their x coordinates and internal relative positions are retained. The item planner then treats them as fixed obstacles. If the preferred lower band cannot support safe item placement, alternate bounded group anchors or the existing safe arrival are used; dense scenes can have an off-target centroid.
- Top/bottom margins, actual card sizes and known construction-growth reservations constrain placement. No forcing the one-third target at the expense of clipping or a new overlap. If the reserved geometry cannot be safely placed by this limited transformation, keep the existing bounded arrival instead of inventing a new reflow or shrinking cards.
- Once initialized, every hotspot remains fixed. Same-location chapters, rare same-place deliveries, revisits, ordinary combinations, moves, rendering, resize and save restore do not invoke this policy. Old scrollback stays intact. Normal results still appear beside their receiver or inside a hotspot target as portable items; no combine-time recentering was added.

The provisional lower-band rule is **not** permission to move future artwork-anchored hotspots away from their depicted furniture. Explicit art anchors will need to supply fixed geometry to constrain movable-item placement. That artwork/schema change is not implemented here.

## Implementation boundaries

`engine/scene-entry-layout.ts` contains pure planners. The movable planner computes exact piecewise-linear feasible translation intervals around fixed hotspot rectangles rather than searching a pixel grid. It picks nearest target center first, least gap compression second. The runtime calls the composite planner only after existing supply/carry separation on the first genuine location entry, including earned mid-chapter travel.

`schema/campaign.ts` adds the optional policy and `schema/location-plan.ts` rejects unknown policies. The latter also validates the UI worker's optional `ChapterEntryCue.contextHeading`: when provided it must be a nonempty string, including on travel cues. Semantic era/place correctness remains author review, not a string validator.

No scenario source, current registry, controller, stylesheet, artwork, saved-state format or historical arrival helper was changed by this geometry patch. The parent integration owns opting new successor identities into the policy.

## Focused verification

`tests/scene-entry-weighted.test.ts` covers:

- initial and carried/new working sets at 320, 375 and 390;
- weighted center, proportional gap compression, divider and ordering;
- variable text height, reserved construction height, no card shrinking;
- lower hotspot group geometry, fixed-obstacle constraints, later invariance;
- no new overlap, panel boundaries, dense clamping and impossible-layout refusal;
- unchanged scrollback, same-location chapter, same-place delivery and revisit;
- ordinary receiver births and portable lower-hotspot operand births;
- earned travel, JSON/CCSP1 saves, Undo and stable vertical geometry on resize;
- old-save nonmigration and optional schema validation;
- 360 seeded geometry cases.

The integration's final build, content gate, full regression suite and final authored story route/visual review must be attributed separately. Temporary opt-in clones of the existing stories are smoke evidence, not published successors or approval of their old dense working sets.
