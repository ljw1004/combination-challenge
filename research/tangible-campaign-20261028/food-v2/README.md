# From Hearth to Snack Cake — bounded v2 candidate

**Isolated, not deployed.** New save identity: `hearth-to-twinkie-v2`. The complete v1 candidate, frozen pastry trial and all 125 existing files remain unchanged beside this directory.

The goal route now has **180 combinations** across 20 chapters. The catalogue has **195 recipes**, including 15 optional discoveries. Placements and automatic transitions are not counted as combinations.

## What changed

- The preserving works still offers its fruit-and-custard demonstration, but its other result is a **sealed stew tin**. That actual tin travels to the next station kitchen and is opened to feed a hungry early shift with the earlier soda loaf.
- The station prepares the existing **moulded small-cake batch and vanilla creme** for the final filling/wrapping scene. Its five display-cake-only recipes remain discoverable but are no longer required. No replacement quota or new recipe was added.
- Two thin optional paper recipes became one attributed, readable historical example from Evelyn. It is not a health claim or a compulsory task.
- Recipe links now distinguish actual technique support from contextual history. `source-attribution.json` records all 195 classifications; only 29 recipes claim a directly supported named technique. The ordinary reconstructed dishes are not falsely presented as independently verified source recipes.

The first 17 canonical chapters—including the **42-combination custard→chocolate section**—are unchanged. That section's pacing remains a hypothesis for a fresh trial, not a proven failure.

## Verification

- **104/104** candidate, frozen-runtime and revision tests pass.
- **18/18** full route-width replays pass: canonical, exhaustive, reverse-ready, reversed directions, early future discoveries and deliberately early tin opening, each at 320/360/600.
- **21** checkpoints are exact canonical prefixes; all 19 later chapters use actual required earlier creations.
- All 195 recipes are exercised. Across replay checks: 1,230 actual replacement-position assertions, 4,707 retained-input assertions and 8,178 undo/restore assertions pass.
- A disposable full-repository fixture passes **139/139** tangible tests and `npm run build`, with its lifecycle audit properly extended to 930 active recipes. The Vite bundle-size warning remains.
- Strict TypeScript passes. Five source-aware author CLI smoke segments complete; these are **not fresh participants**.
- Canonical/exhaustive maximum: 15 arrival objects, 19 live objects. Early opening reaches 16 on arrival; another adversarial route reaches 20 live objects. These are logical counts, not browser/touch readability evidence.

Runtime files are copied unchanged from the parent's stable recovered `61a9b4e` snapshot, including event-local retirement and text sizing. See `evidence/runtime-provenance.json` for exact hashes. This revision changes no runtime semantics.

## Files and replay

- `author.py`, `scenario.json`: deterministic authored source and executable result.
- `dependency-plan.json`, `dependency-graph.json`, `docs/CHAPTER-MAP.md`: goals, imports, supplies and complete graph.
- `docs/REVISION-REVIEW.md`: bounded decisions, tested shortcuts and remaining risks.
- `docs/SOURCES-AND-LIMITS.md`, `source-attribution.json`: claim-level source limits.
- `evidence/verification.json`, `evidence/tests.tap`, `manifest.json`: final verification and hashes.

```sh
python author.py
node --test campaign.test.ts revision.test.ts engine/model.test.ts
node verify.ts
node play.mjs init NEW_SESSION provisions-to-train
```

`provisions-to-train` spans the three revised late kitchens; `cake-travel` begins at the station. Other prepared segments are `pastry-supper`, `orchard-inn` and `custard-chocolate`. Give a fresh participant only the player instructions and surface, never this README, routes, graph or review. No fresh v2 trial, human enjoyment validation, browser/touch test, Site write or remote write is claimed.
