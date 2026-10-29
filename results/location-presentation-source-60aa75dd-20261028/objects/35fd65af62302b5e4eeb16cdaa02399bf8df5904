# Elements opening: Wheel candidate (local research only)

## Result

A one-recipe replacement removes the rejected Clay + Stone → Bowl from the opening without changing the nine other original first-ten combinations. Chapter 1 now asks for **Stone and Brick**. Bowl moves to its first necessary use, the chapter-6 basket: **Clay + Wheel → Bowl**, using the Wheel created in chapter 4. No new item, supplied tool, recipe, quota, location, chapter or runtime mechanic is added.

This is a candidate, not a live improvement. No publication or live-checkout edit has occurred.

## Why the reorder matters

- **Stone must still be made in chapter 1.** It is chapter 2's only earlier-created input, used to grind Grain into Flour. A straight early Kiln substitution loses that handoff. Making Stone a real opening goal protects it rather than assuming optional discovery.
- Bowl has no recipe use until **Plant fiber + Bowl → Basket**, chapter 6. There is no need to invent a bowl-making tool before the first supper.
- Wheel already exists by chapter 4, and its current definition is a solid wooden disc that can roll or turn. The candidate uses it as a turning surface, a more recognizable pottery association than Stone. The author-only description is **not** player-visible and cannot be credited as an in-game clue. The frozen logical surface likewise shows only the existing **Wheel** label. Whether that association is recognizable remains a semantic question for the independent reviewer and source-blind reader; a generic wheel is not a complete real potter's wheel.
- Clay is shaped into the new bowl; Wheel is explicitly retained as a tool. Drying/firing/support/handwork remain storybook compression rather than extra recipes. No claim is made that unfired clay is a finished functional bowl or that the two inputs form a complete ceramics procedure.

The [V&A's description of Richard Batterham's making process](https://www.vam.ac.uk/articles/richard-batterham-methods-of-making) supports forming vessels on a rotating wheel and separates this from firing. It does **not** establish that a bare cart wheel is sufficient equipment. This source is support for the craft relationship, not evidence of player intuitiveness.

## Fresh source-blind result

The changed bowl recipe was inferred without author-only descriptions or result previews. The pre-action expectation was: “A wheel can serve as a potters wheel to shape clay into a bowl or pot.” The reviewer then made Bowl and tentatively understood Bowl + Fiber as a weaving mould. They wanted to continue after both ten combinations and the chapter-six boundary.

Their actual first ten varied from the preferred route: seven direct matches, Clay as a close Mud variant, Stone as a secondary prediction, and an optional Sand detour while seeking Plant. Stone returning for Flour was explicitly satisfying. Later, unchanged Thread, Waterwheel, Hammerstone, Wheelset and map timing caused friction; these are documented but not expanded into this narrowly authorized fix. This is one simulated logical reader, not human validation or UI evidence.

## First ten, preferred route

1. Earth + Water → Clay
2. Earth + Fire → Stone
3. Clay + Fire → Brick
4. Air + Water → Rain
5. Earth + Rain → Plant
6. Plant + Air → Grain
7. Grain + Stone → Flour
8. Flour + Water → Dough
9. Dough + Fire → Flatbread
10. Plant + Water → Fruit

The first nine here are the original opening ten minus the rejected Bowl. Fruit is the unchanged next original recipe. Fruit juice still completes supper. Alternative order and normal highlighting remain available.

## Scope and compatibility

Baseline: exact live `elements.ts` at commit `51b6f9f5090c99174997793e49affff24fecd814`, including the live **Lidded crock** override. Scenario SHA-256: `8005617debb0a262c9e1df9cf2961508a1341e470ec060d0b8d38c10c7879702`.

New identity: `elements-opening-wheel-v1-research`. Original source, direct route, 31 checkpoints and saves are retained. The isolated validation copy registers the research scenario as an additional route; it does not replace the featured live version. It includes its own route witness and lifecycle audit rows.

Unchanged: all item definitions, initial inputs, locations, 216 other recipes, all chapter 2–30 text/objectives, every runtime/schema/rendering/save source file. Changed: one recipe pair and its explicit lifecycle/research metadata; opening Stone objective and associated story text; matching earned checkpoint prefixes; new scenario identity and research note/source attribution.

## Verification

- 7 focused content/engine tests pass: unchanged-scope assertions; first-ten result sequence; chapter carryover; all 31 earned checkpoint prefixes/restoration; both opening objective orders; normal partner highlighting, retained Wheel and undo; no retirement on chapter travel or unrelated actions.
- Full route: **196 combinations**, unchanged from baseline; 230 accepted actions; completed.
- **96 alternative routes** (juice, waterwheel, slide, herbarium, weather, feast families) all complete with every one of the **29 later chapters goal-connected to earlier creations**.
- All original 31 checkpoints also replay independently under the original identity.
- Isolated `npm run build` passes content validation, TypeScript and Vite packaging. Existing large-bundle warning remains. Build is not a UI test.
- **116/116 logical regression tests pass**, including lifecycle/objective/identity/engine checks and preserved catalogue routes/checkpoints. Independent source review (`reports/independent-review.md`) recommends the narrow research candidate while preserving the generic-Wheel, bakery-detour and separate-save-identity caveats. The fresh label-only reader completed the six-chapter observation: 45 combinations, 2 preserved rejections, 18 normal highlights, and voluntary willingness to return. At command 72 they predicted Clay + Wheel → Bowl/Pot **before** acting, without highlighting Clay or Wheel in that chapter. The stopped 75-command receipt chain and every audit-file hash were independently verified (`reports/source-blind-evidence-summary.json`).
- No browser, DOM, controller, layout, pointer or UI test was run. The aggregate `tests/tangible-campaign.test.ts` imports controller tests, so it was intentionally not run under the no-UI-tests instruction; its relevant logical constituents were run separately.

Initial local test-assertion and validation-copy preparation failures are preserved in reports: undo records attempts/events rather than erasing audit history; copied `.bin` symlinks and nested Vite `dist` needed faithful copying; appended research registration required regenerated lifecycle audit rows. These are resolved in the final scripts; no gameplay assertion was weakened to hide a content failure.

## Files

- `scenario.json` — candidate data.
- `baseline.scenario.json` — exact live baseline data, read-only evidence.
- `elements-opening-candidate.ts` — candidate source module.
- `scenario.diff`, `reports/content-delta.json` — exact data changes.
- `tools/make-candidate.py`, `tools/prepare-validation.py` — reproducible candidate/isolated integration preparation.
- `tools/opening.test.ts`, `tools/regressions.ts`, `tools/goal-audit.ts` — scoped logical tests and route audits.
- `player-packet/PLAYER_TASK.md` — frozen source-blind normal-highlighting protocol; not human or UI evidence.
- `tools/verify-scope.py`, `reports/scope-verification.json` — live-source/runtime preservation checks.

**Recommendation:** Prefer this minimal candidate for the next human check. The independent source reviewer favors it with medium semantic confidence, and one genuinely source-blind label-only reader correctly inferred the changed bowl recipe. That is useful evidence, not proof every player will read a generic Wheel as pottery equipment. No broader recipe changes are justified by this narrow pass; original saves/direct routes must remain available on any eventual promotion.
