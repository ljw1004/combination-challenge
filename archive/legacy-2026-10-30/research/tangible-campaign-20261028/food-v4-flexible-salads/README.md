# Food v4 — flexible salads: isolated logical experiment

**Status: reviewable, not integrated, published or deployed.** No UI, browser or touch testing was performed. The candidate was built only after a separate authenticity reviewer accepted these two narrow alternatives.

## Diagnosis and bounded change

The frozen `food-long-01` source-blind simulated player completed four chapters / 35 combinations, enjoyed actual food carryover, then voluntarily stopped after two rejected salad joins. This is a recorded AI stopping judgment, **not a technical dead end or proof of human dislike**. The existing goal asks for generic dressed roast roots, but the only route required mustard dressing and a separate mustard-paste step. Independent culinary checking supports two specific alternatives; it does not support a rule that every plausible pair must work. See [AUTHENTICITY.md](AUTHENTICITY.md).

Added, without removing anything:

- `roast-roots + vinaigrette → root-salad`
- `ground-mustard + vinaigrette → mustard-dressing`

All 195 existing recipes and every item, location, initial supply, stage, cache, objective, carry list and checkpoint are unchanged. Exact semantic change paths: `/id`, `/notes/0`, `/recipes/195`, `/recipes/196`, `/sources/18`, `/sources/19`. The new identity prevents accidentally treating old saves as new-candidate evidence. No old route or frozen session was rewritten.

**No mandatory padding:** the plain dressing route needs 178 combinations, direct mustard 179, and the old paste route remains 180. All still end with the original tangible snack cake and original later goals. The catalogue has 197 recipe alternatives but only 194 distinct output kinds (plus the existing installation); **zero new discovery objects**. A run cannot execute all definitions of the same output. Coverage of all 197 is the union of separate legitimate runs, not a 197-combination claim for one run.

## Verification

- **60/60 tests pass**: 59 candidate/copied-engine tests plus one extra after-handoff optional-recipe recovery test. Strict TypeScript passes.
- **39/39 complete route×logical-width replays pass**: 13 routes at 320, 360 and 600. Widths exercise pure runtime layout/state calculations, not UI usability.
- **12/12 focused alternative checks**: both new joins, both operand orders, all three logical widths; exact retained stocks, no added placement/paste prerequisite, save/undo, duplicate discovery blocked.
- **21 unchanged checkpoints** remain exact prefixes of the preserved canonical route and reproduce the baseline state at all three widths.
- All 19 later chapters use actual earlier-created inputs on every replay. No cache supplies a recipe output. The retained roots reach the noodle kitchen and make its existing filling; the salad is not substituted for them.
- A root salad discovered early in the pantry, after explicitly fetching its real vinaigrette from the orchard, is physically recollected at the salad table and does not soft-lock the later goals.
- Skipping mustard on the goal route does not erase it: after handoff, a return to the salad kitchen can still make the old paste and dressing from their real stocks.
- 4,044 baseline/candidate action comparisons show **identical complete states and events on every preserved route**, not just equivalent final completion.
- 10,029 retain checks, 3,012 explicitly justified event-local retirements, 8,649 undo checks and 8,649 restore checks pass. A retained construction may legitimately acquire its installed component; stable identity and fitted slot are checked rather than incorrectly requiring an unchanged slot.
- All **329 protected input files** and all five copied runtime/schema/test files remain byte-identical to their recorded hashes.
- The two stopped-player intentions now succeed from the reconstructed real pre-attempt inventory. This is **source-aware counterfactual replay**, not a fresh v4 trial or a claim that the player would continue.

## Honest route counts

Counts below are for one complete 360-wide logical run; the same route counts pass at 320 and 600. Creations exclude the retained-injector installation. Placements, visits and advances are not counted as combinations.

| Route | Combinations | Creations | Installations | Placements | Visits |
|---|---:|---:|---:|---:|---:|
| `preserved-v3/canonical` | 180 | 179 | 1 | 16 | 0 |
| `preserved-v3/all-recipes` | 195 | 194 | 1 | 17 | 0 |
| `preserved-v3/reverse-ready` | 195 | 194 | 1 | 17 | 0 |
| `preserved-v3/reverse-directions` | 195 | 194 | 1 | 17 | 0 |
| `preserved-v3/early-discovery` | 180 | 179 | 1 | 16 | 4 |
| `preserved-v3/early-opening` | 180 | 179 | 1 | 16 | 0 |
| `plain-vinaigrette` | 178 | 177 | 1 | 16 | 0 |
| `direct-mustard` | 179 | 178 | 1 | 16 | 0 |
| `catalogue-plain-vinaigrette` | 193 | 192 | 1 | 17 | 0 |
| `catalogue-direct-mustard` | 194 | 193 | 1 | 17 | 0 |
| `plain-vinaigrette-reversed` | 178 | 177 | 1 | 16 | 0 |
| `direct-mustard-reversed` | 179 | 178 | 1 | 16 | 0 |
| `early-plain-vinaigrette` | 178 | 177 | 1 | 16 | 2 |

`preserved-v3/all-recipes` is the frozen 195-recipe catalogue witness, not a claim that it executes the two new alternatives. The two `catalogue-*` witnesses preserve optional discoveries except the skipped paste/dressing branch as appropriate. Taken together, the witnesses exercise all 197 alternatives while unique-discovery rules remain intact.

## Provenance and reproducibility

- Base: `../narrative-review-20261028/food-copy-correction/scenario.json`
- Base SHA-256: `904efb40141971b629c1266e257527024a6a8dd81fc519ee430352de0fa8b27b`
- Candidate SHA-256: `008ec2f7c7afd080a7557d8c98f387f3cde7912881d94d7681006405dc13a00a`
- `scenario.diff` and `semantic-diff.json`: exact text and semantic changes.
- `manifest.json`, `protected-inputs.json`: bounded delta and frozen input/runtime provenance.
- `evidence/verification.json`: per-route mechanics, imports actually used and counterfactual intents.
- `evidence/tests.tap`, `evidence/handoff-tests.tap`, `evidence/typecheck.log`: final checks.
- `evidence/HARNESS-CORRECTIONS.md`: preserved initial harness failures and the narrow fixes. No gameplay change was made to hide a failing assertion.

```sh
python seal.py --check  # verify the delivered evidence before rerunning
python build-candidate.py
npm test
npm run verify
node /workspace/shared/combination-content-final-20261028/node_modules/typescript/bin/tsc -p tsconfig.json
# Reruns change timing logs; regenerate the artifact seal only after reviewing their results.
python seal.py
```

The compiler path references the already-installed local toolchain; no dependency installation was performed. The test/runtime files are copied unchanged from the frozen v3 packet’s matching runtime. There was no full application build or repository integration in this experiment; do not relabel these checks as that evidence.

## Decision and open boundary

Recommend these two additive alternatives for parent review, not a wholesale redesign of the food journey. The user’s positive experience with the earlier games is preserved, and this source-aware experiment does not establish human fun. A fresh blind play could test how this small allowance feels, but no new trial is claimed here.

**Blocker status:** none for the requested bounded logical experiment. **Pending action:** parent review/adoption, targeting this separate candidate; required because integration/publication was explicitly deferred. No user action or authorization is needed to read these results.
