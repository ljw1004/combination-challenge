# The Kitchen Caravan — shared-kitchen and departure-supper candidate

**Recommended local candidate only. The played Food source is unchanged; this task made no live modifications.**

The player enjoyed the full cooking journey. This keeps its cooking core while addressing its chapter-by-chapter supply gifts and forced branded ending.

## Useful result

- **Eight narrative facilities, ten small active workstations, twenty chapters.** Most boards host two chapters; the opening remains one short chapter, and the departure board hosts three. The railway tea counter, dessert room and supper bench are departments of one introduced kitchen, not three newly discovered institutions.
- Supplies arrive once at each active workstation’s first chapter, with ordinary provenance. The number of delivery caches falls from 17 to 9. On the ten same-board handoffs, no items move, no supplies spawn and no old objects disappear.
- The familiar five-item roadside opening remains. Ordinary equipment labels repeat across real facilities. Existing tools and preparations keep their value beyond one chapter.
- The ending is an actual **supper and provisions aboard the overnight train**: fresh bean stew with the earlier soda loaf, a separate unopened processed tin for later, either finished cake, and the apple juice reserved from the opening. All are visibly fitted to a real serving trolley before it is sent through the dining-car hatch.

## Why this grouping

Six large shared boards were rejected: their busiest eager-crafting route reached 75 visible things/locations. Eight boards still reached 47. Ten bounded workstations reach **37 maximum** across the final 16 route variants, including two eager cook-everything-available-first orders. No hidden shelf, automatic deletion, timed expiry, or invisible relocation was added to obtain this result.

The old canonical/catalogue boards peaked at 21, so this remains a larger active scene. **37 is a logical population bound, not a claim of phone readability.** Browser/touch and human playtesting were explicitly not performed. `evidence/layout-alternatives.json` records the rejected experiments and source hashes; the final 48 replays independently enforce the 40-object bound.

| Active workstation | Chapters served |
|---|---|
| Roadside hearth | The roadside breakfast |
| Orchard dairy and bakehouse | Breakfast at the farm, Lunch for the harvest crew |
| Market inn kitchen | An inn supper, A lighter second service |
| Market cookshop | Stretching the market lunch, Baking for market day |
| Community supper kitchen | The stallholders’ hot supper, Preserving the surplus fruit |
| Fair confectioner’s kitchen | Treats for the fair, Bread, fruit and custard |
| Fair bakehouse | Hollow buns for the counter, A birthday at the fair |
| Station kitchen — tea counter | Finish the birthday table, Tea before departure |
| Station kitchen — dessert room | Cold desserts for waiting passengers, The other half of the egg |
| Station kitchen — supper bench | Provisions for the departing train, Finish the departure supper, Supper aboard |

## Cooking retained and deliberately changed

- 184 existing food recipes remain. 181 retain their operands, results and lifecycle roles after the documented equipment/identifier mappings.
- Three existing preparations are clarified: marzipan uses the existing finely milled sugar; bottled fruit uses the earlier apples rather than newly appearing apricots; tonight’s bean supper uses a fresh portion of the earlier stew, not an immediately reopened tin.
- Twelve factory-only recipes and the redundant stew-reopening recipe are removed. Five ordinary serving installations load the trolley; either cake is sufficient, and loading both never overwrites or loses the first.
- The first 18 chapters retain their objective semantics. One syrup-goal sentence is corrected to name later desserts and preserves rather than a nonexistent destination. Optional readings, including Sugar’s history note, remain unchanged.
- There are now 231 item kinds, 25 equipment locations, 189 recipe alternatives, 20 chapters and 21 legal checkpoints. Representative full routes take 173–176 combinations, not 189 mandatory discoveries.

See `PRIMITIVE-AUDIT.md` for all 49 primitive sources and honest reuse limits, `ENDING-OPTIONS.md` for the three considered conclusions, and `SOURCE-REVIEW.md` for the narrow culinary citation and independent reading review.

## Verified, not assumed

- **51/51 tests pass**, including copied engine regressions; strict TypeScript passes for the candidate, route builders, verifier and schema/runtime copies.
- **48/48 full logical route×width replays pass**: 16 route variants at 320, 360 and 600, totaling 10,428 accepted actions. All 189 recipe alternatives are covered across the route set.
- **480 same-board chapter transitions** preserve token arrays, positions, places, discovered items, opened caches and empty transfer lists exactly.
- All 21 checkpoints at three widths restore correctly.
- The finale passes 144 complete loading-order cases, 96 missing-course cases, 144 repeated-load rejections and 576 undo restorations. Supper cannot finish without meal, juice, the still-sealed reserve, dessert and delivery at the hatch.
- 85 protected input files remain byte-identical, including the earlier research candidates and live food source/design principles. The new scenario identity is `kitchen-caravan-v6`; played `hearth-to-twinkie-v5-sugar-reading` is not rewritten.

This is **source-aware logical evidence**, not a fresh user playtest, rendered layout test, full-application build, integration, publication or deployment. The arrival-cue revision was separately published by the root task. Current-engine physical-state and arrival-cue parity independently pass all 48 complete runs at live commit 217ce742, including 480 stationary handoffs with no false arrivals, 2,112 actual supply entries and 4,986 actual transfers. Both engines restore after every one of 960 advances. See `evidence/current-arrival-review/`.

## Deliverables and rerun

`scenario.json` and `candidate.ts` are the complete candidate. `facility-plan.json`, `change-plan.json`, `scenario.diff`, `PRIMITIVE-AUDIT.md`, the ending/source reviews and `evidence/` document the choices and results. `base-routes/` preserves the input routes; routes under `routes/preserved-v3/` are **adapted descendants**, not a claim of byte-identical preservation. The earlier played route files themselves remain untouched.

```sh
python build-candidate.py
npm run routes
npm test
npm run verify
node /workspace/shared/combination-content-final-20261028/node_modules/typescript/bin/tsc -p tsconfig.json
python document-evidence.py
python seal.py  # after reviewing the rerun results
sha256sum -c SHA256SUMS
```

Reruns change timing logs; regenerate checksums only after reviewing the results. No dependency installation is needed. `INTEGRATION-NOTES.md` explains how to preserve the popular predecessor in any later authorized integration.

**Blocker:** none for the assigned local candidate. Browser/player validation and live integration remain intentionally unperformed.
