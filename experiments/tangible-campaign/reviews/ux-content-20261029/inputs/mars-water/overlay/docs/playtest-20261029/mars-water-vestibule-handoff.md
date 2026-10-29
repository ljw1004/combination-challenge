# Mars direct water and either-order vestibule — isolated implementation

## Integration contract

Base: `/workspace/shared/combination-journey-cleanup-integration-20261029/source`, parent-provided seal `7629a2f122270c3b08a19a24e6251ae63f2f0178639b7576258b15ae003a4395`.

Import `withMarsWaterAndVestibule` from `ui/stories/mars-water-vestibule.ts` and call it with a scenario and a NEW identity. It returns a clone. It supports current `mars-evidence-repairs-v7` and optional `mars-creature-field-scenes-v3`. Apply before broad editorial helpers. `mars-water-vestibule-candidates.ts` exports isolated test inputs only; no catalogue, default URL, runtime, controller or historical world changed. The final integrator owns registration, UI QA and aggregate checks.

## Exact graph delta

- Remove items `empty-canister`, `water-canister` and recipe `habitat-2-water-canister`.
- Stable internal `meltwater` displays **Dirty water**; `filtered-water` displays **Water**. Filtering transforms the one dirty batch, preserving its position. Both existing heater/solar collection paths remain.
- Map all former canister consumers to Water: `habitat-4-watered-seed-tray`, `habitat-water-covered-tray`, `waterworks-prime`. Preserve the remaining supply at the event. The early habitat goal becomes Filter water; checkpoint fill actions disappear. All carry/stock/objective/action fields are traversed explicitly.
- New optional `habitat-wet-seeds`: Water + Seeds → Wet seeds, the same seeds. `habitat-plant-wet-seeds`: Wet seeds + Planting tray → existing Watered seed tray. No additional stock or mandatory action; no invisible tray or new plant. Plant-first and wet-first routes exclusively consume the same seeds and tray.
- Existing dry-cover, wet-cover, germinate-then-cover and covered-germination alternatives remain. A dry covered tray does not germinate; warmth remains required.
- New `wrapped-vestibule` is the actual blanket-fitted but unsecured structure. Existing ties-first route and new blanket-first route converge on existing `insulated-vestibule`. All assembly inputs are exclusive; hatch frame, ties and blanket remain visible components. The structure transforms in place in either drag direction. The shared pressure-patch supply remains meaningful for later crawler repair, not a duplicate vestibule.
- Meaningful later container/plant equipment remains unchanged: collected bulk water and the treatment skid feed the monitored tank; reserve + primed loop form the camp system; irrigation line supplies the planted potatoes. The small habitat supply is not silently promoted into a full bulk tank or a functioning irrigation apparatus.

Canonical survival/optional complete routes are **227 / 224 actions**, each one fewer than its parent. Each has 222 recipes after removing one and adding four optional-order edges. Survival has 452 item states, optional creature 446; removing two containers and adding two real incomplete states leaves the count unchanged.

## Verification

Focused suite: `node --test tests/mars-water-vestibule.test.ts`.

- 80 opening permutations: two scenarios × five seed/cover orders × two vestibule orders × two drag directions × two existing heat sources.
- 8 full downstream routes: both scenarios, canonical and combined alternatives, at widths 320 and 390. Check panel bounds, pump priming, nursery tray/cover continuity, complete ending and optional creature/core-tube return cargo.
- Both source worlds remain unchanged; schema, lifecycle, goal flow, construction continuity and lifecycle graph validation are clean.
- Every checkpoint retains its old chapter/completion destination. JSON and compact CCSP1 saves restore; Undo restores changed-input states/positions. Repeated operations and same-token drops reject without logical mutation. Legal partners are highlighted in both directions. No duplicate seed/tray/cover/vestibule/finishing-parts remain.
- First experimental suite had 4 failing full-route variants because the test reversed unrelated context-sensitive thermal-chamber recipes. Test corrected to preserve legitimate directional catalyst rules; runtime was not changed.
- Build first caught a TypeScript narrowing issue in the new test (mutable action captured by callback); test now captures an immutable pair key.

Evidence is engine/logical, not browser/native touch or human enjoyment. No full aggregate suite is claimed here; parent integrator owns `tests/tangible-campaign.test.ts` and final aggregate execution. Predecessor registry build remains a useful type/content/bundle check, while the new candidates receive direct validators in the focused suite.

## Open visual issue (independent audit preserved)

M02 artwork clearly shows an indoor cabin floor and enclosing walls. Its current exterior ice lens and refuge mast are inconsistent with that setting. This patch does NOT claim to fix that mismatch. Actual M01/M02/M03/M03-sled-build/M07/M08 pixels were inspected; independent reviewer also checked the full Mars art set. No existing image honestly establishes the early habitat entry, nearby ice and mast together. M01 shows a distant habitat; M03-sled-build is cargo lander access; M08 is the different, later refuge courtyard. Do not silently relabel one as corrected artwork.

A separate future source/layout correction can split outdoor water/vestibule/mast work from indoor planting, retaining actual earlier-created water and stock provenance. It needs a truthful exterior background, or explicit acceptance of generic repeated mission-module art; no generation, external publication or visual fix was authorized/performed by this packet.
