# Atlas v7 source-61a9 compatibility

**Logical research verification only. No original-source mutation, UI/browser testing, publication or enjoyment claim.**

Candidate SHA-256: `ef8ae2a9b5b3413e2818b3846f4be17a1526a420567cdf42449701444a937450`.

## Results

- `npm run build`: **PASS** — 998 active recipe lifecycle contracts validate, TypeScript checks, Vite bundles. The large-bundle warning is retained; no performance claim follows.
- `tests/tangible-campaign.test.ts`, with exact-name UI exclusions: **89 PASS / 0 FAIL**. Includes model, objective, lifecycle, legacy-save recovery, save-worker/codec and full authored-route/checkpoint checks for all **16 registry worlds**, including existing archived direct routes and new v7.
- Three lifecycle test files separately: **28 PASS / 0 FAIL**. These overlap the aggregate and are not 28 additional unique tests.
- All **485 tracked source files**, clean source status and HEAD `61a9b4ee8c6235bff07f97eb16d713ec6125c81e` preserved. The five frozen engine/schema/UI files match both source and disposable fixture byte-for-byte.

The disposable fixture appends v7 alongside all existing records. Only its scenario registry, lifecycle audit/count expectation and new route evidence are adapted. Its dependencies are private copies; builds cannot mutate the source through a shared `node_modules` link.

## Deliberate exclusions

The user requested no UI testing. **48 controller/fake-DOM tests and 2 UI-dispatch/lifecycle save tests are filtered out by exact names.** None execute. Node excludes name-filtered tests from TAP totals: the log's `# skipped 0` describes the 89 executed tests, not an absence of filtering. `compatibility-report.json` records all 50 exclusions and verifies that none appear among executed subtests.

No full `npm test`, complete mixed UI aggregate, native browser, layout, visual QA or fresh-player test was run. Several inherited test titles say “Shared browser data”; those tests only call the Node model's `validateScenario`, `replay` and `checkpoint` functions.

## Reproducibility and evidence

`compatibility-prepare.py` builds a **new** `compat-worktree` from the pinned clean source and refuses to merge into an existing fixture. `compatibility-run.py` reruns content checks, the filtered aggregate and lifecycle checks, verifies source preservation, and writes the report. Run the build separately inside `compat-worktree` with `npm run build`.

Exact output is in `compatibility-build.log`, `compatibility-content.log`, `compatibility-tangible-logical.log`, `compatibility-lifecycle.log` and `compatibility-report.json`. `compatibility-source-preservation.json` pins all source files; `compatibility-preparation.json` explains the fixture changes and runtime matches.

Two fixture-setup assumptions were corrected without candidate/runtime/source changes: tracked `dist` files must be copied for complete source comparison, and dependency `.bin` symlinks must remain symlinks rather than dereferenced executable copies. The initial diagnostic logs are preserved as `compatibility-preparation-initial-harness-error.log` and `compatibility-build-initial-harness-error.log`. The corrected build and checks pass. **No outstanding blocker.**
