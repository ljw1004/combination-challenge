# Mars observation simplification — integration handoff

## Result

**Ready as an isolated, tested content overlay; not published and not a full successor-release pass.** The candidate removes the five-object scale/rack family and three required actions. It keeps the observations and their later basin/archive uses, without calibration chores or claims of life, dimensions or common age.

- Candidate: `/workspace/shared/mars-observation-streamline-20261029/candidate`.
- Base: frozen `/workspace/shared/combination-location-presentation-final-v2-20261028`, seal `60aa75dd30d776867324f738b900ed86e5c5188558c148666c0e6111e2b1b9be`.
- All **1,958** listed frozen files verified unchanged. All **40 historical scenario objects**, plus the six other new location worlds, are hash-identical. Only unpublished `mars-persistent-locations-v5` differs.
- **Do not reuse v5 if it publishes before integration.** This overlay supplies no migration for pre-simplification v5 saves. Parent confirmed v5 remains unpublished during this work.

## Gameplay delta

1. Core tube + Lookout ice → Ice core is unchanged. **Ice core + Camera → Core layer photograph** now replaces rack-mounting and scale-card processing. Field camera also works; both actual specimen and camera survive.
2. Field camera produces **Gravel photograph** and **Ripple photograph** at their existing hotspots. The two photographs compare directly into **Paired terrain photographs**. Offsite comparison is allowed because it compares records, not because it pretends to recapture or calibrate them.
3. Remove Scale card, Specimen rack, Core rack, Scaled core and Scaled gravel view. Remove `outcrop-12-core-rack`, `outcrop-13-scaled-core`, `contrast-scale`. No replacement stock or extra requirement is added.
4. The visible tasks become **Photograph core layers** and **Compare basin photographs**, then **Save basin comparison**. Keep specimens separate remains intact. The existing sediment finding now reads **Fine–coarse–fine layers**; this surfaces already-authored observations without inferring age, origin or life.
5. The earlier photograph still feeds `buried-story-11-layer-interpretation` and `departure-6-complete-field-archive`; the comparison still feeds terrain context and the qualified basin story. Both earned internal journeys, all18 panels,24 chapters,3 milestones and artwork stay unchanged.
6. Canonical route: **232 → 229 actions; 201 → 198 combinations**. All25 successor checkpoints are rewritten. Historical routes/checkpoints are not edited. Towing and the field-camera/reversed-pair alternative complete.

`evidence/effective-scenario-delta.json` gives exact recipe/item/chapter differences. Four accepted-route logs give every action, selected recipe ID and pre/post state SHA: old canonical, new canonical, new towing, supported-camera/reversed-pair.

## Audit and source closure

The new source helper is `streamlineMarsObservations(s: Scenario): void`, exported by `ui/stories/mars-observation-chains.ts` and invoked only on the already-cloned unpublished Mars location successor. No engine, schema, controller, CSS, asset or historical story source changed.

The current lifecycle ledger genuinely consumes the new Mars object. An explicit eight-row delta updates four rows, retires three unpublished rows and adds the supported-camera alternative. It asserts exact before-state equality. Removed rows remain in `supersededUnpublishedRecipes`, the new delta, and the untouched original location audit. No old audit grade or row is rewritten.

Dependency review also reproduced a **preexisting** frozen test-scope error: `reviewed-campaign-integration.test.ts` compared the current47 lifecycle ledger with its historical40 catalogue. Parent approved the narrow repair: import actual current catalogue for that ledger assertion alone; leave every historical40 assertion/route intact. Exact frozen failing output and repaired filtered pass are retained. The active frozen aggregate was not modified or interrupted.

The new `expectedSourceHashAfterMarsObservationStreamline(path, parentSha256)` composes after the existing location-presentation guard. Listed paths require their exact before hash; unknown paths pass through. Original manifests stay unchanged. Nine modified predecessor files are retained byte-for-byte in `reviews/mars-observation-streamline/predecessor/`.

## Passed verification

All commands ran in the isolated candidate unless stated otherwise:

| Command | Result |
|---|---|
| `node --test tests/mars-observation-streamline.test.ts` | **25/25** final tests,61.996s |
| `node --test --test-concurrency=1 tests/physical-location-successors.test.ts tests/physical-location-runtime.test.ts tests/location-current-registry.test.ts` | **45/45**,45.546s |
| `node --test tests/playtest-repairs-source-contract.test.ts tests/location-current-registry.test.ts` | **7/7** after ledger/guard closure |
| `node --test --test-name-pattern='new scenarios are not grandfathered' tests/reviewed-campaign-integration.test.ts` | **1/1** repaired assertion; not a full-file pass |
| `npm run build` | content validation (**5011 active recipes**), TypeScript and Vite passed after final source changes |

The dedicated suite covers canonical/tow/field-camera-reversed routes at **320/375/390/600** widths; no bounds, fresh-divider or newly introduced carry-overlap violation; same-place layout preservation; both earned journeys once; all checkpoints; meaningful downstream uses; both drop directions and highlights; duplicate prevention; retained source identity; JSON/v1/CCSP1 saves with available Undo history; offsite and cross-panel comparisons; visible labels/goals via actual synthetic controller. It also tests creation → reload's automatic ready-chapter handoff → Undo entry → Undo creation. A pending earned rover celebration is dismissed through the controller, not bypassed as if its covered scene were interactive.

Build retains the existing large-bundle advisory; no dependency update was performed. Independent source/scientific review found no blocking design regression. **Native browser/touch/layout and human enjoyment were not tested.**

## Remaining integration queue / exact blockers

- **Action:** run the required broad `node --test tests/tangible-campaign.test.ts` and complete all affected full-file checks against the final merged successor. **Target:** final Site/root successor, not frozen60aa75. **Reason:** art author explicitly holds heavy work behind the still-active frozen94-file aggregate and queued root8 checks. **Status:** deferred/not run for this overlay; parent/release integrator owns the queue. Do not call the filtered ledger assertion a full aggregate pass.
- Static import analysis identifies **34 potentially affected root test files**, not merely the four direct Mars/current-catalogue tests. Source-hash and current-ledger consumers are real additional dependencies. `test-selection-contract.json` separates active Mars, changed ledger, chained provenance and unchanged historical/fixture selections. It is **not an automatic waiver**: parent must approve exact equivalent-input receipt reuse or rerun full files. All46 unchanged effective scenario hashes support—but do not alone establish—source/ledger test equivalence.
- Native browser testing remains deliberately deferred by assignment, not a failure or a claimed pass.

## Exact handoff and compact-root contract

`changed-paths.json` and `overlay-manifest.json` are the complete delta, including source, tests, docs, predecessor snapshots and evidence. `overlay/` contains only those paths; `overlay.patch` and `overlay.tar.gz` carry the same complete delta. Nothing was committed, pushed, deployed or changed in the live/frozen checkout.

`provenance-read-contract.json` lists every new raw data dependency and every Site-root SHA read. In compact root, retain the new helper/guard, lifecycle delta, historical-scenario hashes and predecessor evidence raw. **Only whole-Site path/hash assumptions may use an explicit verified Site-source-context mapping; runtime/gameplay assertions must continue importing active root scenarios.** The approved current47 ledger test repair must not be reverted to historical40.

The candidate's existing `integration/source-manifest.json` remains the frozen60aa75 baseline record, not a claim that it seals this overlay. The external `candidate-source-manifest.json` and its SHA seal this handoff's exact file set. Final Site and compact-root integration must generate their own new seals after applying the complete delta; neither old60aa75 nor the overlay digest certifies that later merge.
