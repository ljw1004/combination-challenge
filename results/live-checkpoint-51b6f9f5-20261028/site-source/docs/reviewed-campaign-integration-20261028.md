# Reviewed campaign integration candidate — 28 October 2026

**Isolated candidate, not published.** Base: exact Site source commit `61a9b4ee8c6235bff07f97eb16d713ec6125c81e`. Native/browser layout and touch QA, fresh complete-campaign discovery, and human enjoyment remain unverified.

## Catalogue and preservation

| Focus | Integrated identity | Chapters | Definitions | Canonical combinations |
|---|---|---:|---:|---:|
| Mars | `mars-connected-survival-v4` | 24 | 213 | 200 |
| Atlas of Questions | `atlas-connected-questions-v4-methods-and-agreement-research` | 29 | 264 | 258 |
| Elements | `elements-gathering-refinement-v7` | 30 | 217 | 196 |
| From Hearth to Snack Cake | `hearth-to-twinkie-v3` | 20 | 195 | 180 |
| Why This Boat? · Purpose workshop | `causation-fitting-forms-probe-v2` | 2 | 6 | 3 basket / 4 crate |
| Doctrine: Grace and Matter | `doctrine-argument-desks-v10-ceremony-clarity` | 8 | 88 | 40 |

The purpose selection explicitly says **short research prototype, not a full game**. Its actual title remains **The Quarry Workshop**. Literature, Restoration and Shoreline remain inside the initially collapsed “Early experiments · not developed” section.

The active catalogue has **9 scenarios / 1,021 recipe definitions**. The complete catalogue has **21 records / 2,390 definitions**, including twelve archived identities. Recipe counts are not route length or enjoyment evidence.

`ui/legacy-scenarios.ts` is byte-for-byte the old `ui/scenarios.ts`. The small `ui/scenarios.ts` facade imports it plus six typed per-campaign modules; existing consumers retain the same `scenarios` API. Every old object, identifier, checkpoint, direct route and save-key derivation remains unchanged. No engine, save codec, schema contract or mechanics changed. The sole archive set lives in `schema/lifecycle.ts`, shared by UI and tests. Newly replaced versions are hidden only from the chooser, not removed.

The parent-approved Doctrine v10 ceremony-clarity draft is now integrated with its exact nine earned checkpoints, attributed readings and preserved reference relationships. Its old v1 remains addressable directly with unchanged saves. The two added v9 inference edges are bounded authored alternatives, not a general entailment mechanic. Frozen v8 simulated trial findings remain historical evidence; no fresh v10 or human enjoyment claim is made.

## Exact review inputs and allowed integration deltas

`experiments/tangible-campaign/evidence/integration-20261028/source-inputs.json` records research paths, hashes and local snapshots. The original candidates/reports remain unchanged; snapshot reports retain historical claims and limitations, including obsolete runtime observations.

Two bounded deviations from the frozen scenario objects are separately recorded:

1. **Mars presentation only:** `mounted-sample-carrier` is labelled “Bracketed sample carrier” before crawler fitting. Three linked carrier descriptions state their actual condition, remove irrelevant food-container wording and avoid post-creation instructions. Four string fields change; no recipe, identity, lifecycle, count or checkpoint changes. Full before/after values: `mars-presentation-delta.json`.
2. **Atlas debug checkpoints only:** add 29 stage-entry checkpoints plus complete, generated from exact accepted canonical action prefixes. No inventory injection or changed content. Full additive field: `atlas-checkpoint-addition.json`. Checkpoints are playable earned states, not claims of fresh discovery. Historical synthetic UI selection checks covered 320/375/600 widths; current content-only checks replay checkpoint state without UI testing.

## Evidence, authoring and lifecycle review

Canonical evidence is regenerated with the current unchanged event-local runtime from documented author routes. Each file identifies its source witness and runtime hash, action count, route, checkpoint/state evidence and per-chapter goal ancestry. All 107 later chapters across the six new drafts have a goal-connected earlier-created witness on the canonical route. Optional unrelated combinations and passive inventory presence do not qualify. This diagnostic does not prove that every possible route is connected or that the narrative reuse is compelling.

Author-known alternative routes cover Mars beacon/tow/old-alias branches, Food all-recipes/early-discovery/early-opening/reversed/order routes and all five Quarry witnesses. Focused branch regressions cover Elements basins, bottle routes and cooking appliances, Atlas independent clock-correction branches and the current seasonal city agreement, and Food's portable fitted injector. The portable Mars and Quarry tests are adapted to the current integrated modules; no disposable worktree was copied.

Every active recipe has explicit valid lifecycle metadata. The active audit rows are merged in exact scenario/recipe order, with historical audit bytes preserved separately. Food's original singular `lifecycle` row field is preserved and verified; other source rows use `lifecycles`, and Doctrine's original packet uses `decisions`; each is checked against the exact recipe declarations. Quarry has no separate author audit-row packet, so its six rows honestly identify their extraction from the reviewed pilot's explicit declarations.

The current policy retains outside bread after the Elements warm-feast action; it no longer performs the deferred absorption described in that candidate's frozen old-engine report. A regression proves the bread and original picnic basket remain unchanged. No frozen report was rewritten or relabelled as current evidence.

## Existing UI retained — content-only checkpoint

Latest user direction defers UI/browser testing and UI experimentation in favor of logical playing and iteration, with packaging into the existing UI at presentation. This checkpoint restores the exact pre-HUD UI and controller fixtures while retaining all six reviewed content drafts. The unfinished measured-corner HUD revision, source seal, proposal and failed/flaky results remain separately preserved at `/workspace/shared/combination-campaign-integration-20261028` and are not shipped here. The reference-summary proposal remains unimplemented.

Known existing presentation limits, including top-right overlay intersections and clipped flattened argument-reference rows, are recorded rather than claimed fixed. Native/UI validation is deferred by the user. No new UI behavior or physical packing mechanism is introduced in this content-only checkpoint.

## Verification and limits

Use `results/content-final-20261028/` for current content validation, source integrity and build packaging. No UI tests were run for this content-only checkpoint. Prior HUD full/aggregate failures are preserved separately, not counted as this checkpoint passing or failing. Current logical content/route checks are reported separately; earlier successful five-candidate integration and prior Doctrine checks remain historical evidence. Initial adapter failures are retained, not erased: an evidence-shape reader expected an array where Food early-discovery stores `{actions}`, and a TypeScript union needed an explicit optional witness field. A first full run also exposed one old chooser test still using the replaced focus IDs; its fixture now uses the central featured IDs while retaining all assertions. These were integration harness/fixture issues, not suppressed content failures.

Reproduction (logical/content/type/build only; no UI test imports):

```sh
python3 experiments/tangible-campaign/integration/verify-manifest.py
node experiments/tangible-campaign/integration/generate-evidence.ts
node --test tests/reviewed-campaign-integration.test.ts tests/reviewed-copy-corrections.test.ts tests/doctrine-v9-integration.test.ts tests/mars-v4-refinement.test.ts tests/purpose-workshop-integration.test.ts tests/campaign-refinement-branches.test.ts
npm run build
python3 experiments/tangible-campaign/integration/verify-manifest.py
```

The source seal requires exact path-set and SHA256 equality, excludes generated build/test output and dependencies, and can additionally verify the untouched external input packets using `--research-root PATH`. Regenerated evidence must match the sealed bytes. Build output remains large; the existing Vite chunk warning is a real deployment/performance caveat, not hidden or solved by modular source authoring.

**Still pending:** native/browser screen layout, touch quality, actual navigation/back/forward QA and human playtesting. Synthetic controller tests are not native browser evidence. No art, new game mechanics, live Site changes, shared-checkout edits, remote writes or publication were performed.

## Final approved copy correction

The current content-only successor preserves the original checkpoint at `/workspace/shared/combination-content-only-20261028` and uses `/workspace/shared/combination-content-final-20261028`. Four approved frozen sources replace the corresponding unshipped draft modules: Doctrine v10 changes one comparison goal and one bodily-rubric label plus identity/note; Mars changes ten narrative fields; Elements changes one kiln-yard motivation; Food changes two whisk-cache timing strings. No recipe, lifecycle, required route, checkpoint actions, reading/reference data or runtime changes. Exact independently computed before/after JSON pointers and source hashes are in `evidence/integration-20261028/copy-revision-20261028/`. The four carrier presentation fields remain a separate unchanged Mars delta. The current Doctrine identity is v10; the unpublished v9 checkpoint is retained separately, while shipped Doctrine v1 remains directly addressable.
