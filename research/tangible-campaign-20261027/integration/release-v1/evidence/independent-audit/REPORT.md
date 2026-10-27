# Independent long-campaign playability audit

## Result

**Two concrete defect classes found and corrected in the tested integration candidate. No remaining mechanical blocker found in this bounded audit.** Original Elements v5, Ideas v6, Mars story-expansion and frozen/v5 sources still match their existing manifests. Reviewer changed only `reviews/integration-audit/`; integration/engine corrections belong to the designated workers.

Tested candidate: `integration/release-v1/scenarios/{elements,ideas,mars}.json` with `engine-arrival-v6/engine/model.ts` SHA256 `bbac9262164459ab13a0f041f8ec17a3e6d0d6a70363225ee7bf969daac2bddf`. The known redundant Mars `relay-goal-1` removal is accounted for, not reported anew.

## Findings and realistic reproductions

1. **Ideas could strand a valid short first-scene route.** Question + Prediction satisfies the testable-question goal without requiring a Field note or Hypothesis. A player can finish both Ask goals and press Continue without making these optional intermediates.
   - At Anatomy, the explicit carry list collects only an existing Field note, not Observation + Notebook when it was never made. Both goals are then impossible locally; no local recipe is available.
   - If only Hypothesis was omitted, Inference later cannot combine it with Rival model. The player must make an unexplained trip to an earlier area.
   - These are recoverable scene-local stalls, not destroyed saves. `sceneCarry` returns an explicit list verbatim (`frozen/v5/engine/model.ts:83`), so its fallback prerequisite closure never runs.
   - **Verified correction:** remove only Anatomy and Inference's explicit overrides. The existing grammar recollects missing prerequisites only when needed, and ordinary combining creates the missing artifact in that scene. All local recipes remain goal-connected; canonical entry inventories remain unchanged. Field note is subsequently mandatory before Rocks, so Rocks needs no blanket override removal. All32 authored producer assignments were inspected for deferred optional cross-stage outputs; only these two were found. Elements and Mars already use dynamic carry.
   - Exact independent witnesses: `ideas-omit-{field-note,hypothesis}-route.json`, corresponding `-failure.json`, `optional-prerequisite-results.json`, `carry-override-scope-results.json`.

2. **Automatic arrival could fully conceal available things.** Frozen/v5 translates every source-area group independently to y=56 without checking other arriving groups (`model.ts:99`). Equal-position opaque tiles fully cover one another.
   - Elements checkpoint `chapter-6` (Bakery): Bowl / Flour / Fiber all96×44 at(248,56).
   - Mars `chapter-9` (Cargo return): Field camera / Bearing map / Crew message all96×44 at(308,56). `chapter-13` (Nursery) also stacks Sprouted tray / Field camera / taller Greenhouse.
   - Ideas `chapter-21`: Held-out observations / Accessible appeal at(252,56).
   - The ordinary authored routes show full cover on23 Elements,1 Ideas and4 Mars stage entries. Moving a covering tile can recover access, but the promised visible inventory is initially concealed. This is geometry/CSS evidence, not a browser screenshot claim.
   - **Verified correction:** arrival-v6 relocates only arriving things while leaving stationary destination things unchanged. Its source diff does not change recipes, birth positioning, objective rules, retirement or source identity. Raw baseline evidence: `carry-layout-results.json`.

## Final Mars repair-content revalidation

Root's subsequent native QA identified the radio repair's duplicate-body contradiction. The integration owner added explicit incorporation for eight individually checked sole-use repair bases: broken radio, cabin shell, weather mast, relay transceiver, service shelter, spare drive, greenhouse shell and electrolyzer stack. This is targeted physical repair semantics, not automatic deletion of finished things. Multi-use crawler/towing alternatives remain untouched.

Against final Mars SHA256 `bb5b10d54f795025da40fe7d7f196ecd759051112da54af6cdf25f14035accfc`, the reviewer reran **all180 Mars branch runs and25 Mars checkpoints**, and independently verified every added base has only its repair consumer, matches no objective, survives in incorporation provenance, and restores exactly under Undo/redo. Actions and combination counts are unchanged. `mars-repair-provenance-results.json` records all eight checks.

Earlier evidence is preserved in `superseded-before-mars-repair-incorporation/`. Final aggregate results explicitly retain the360 Elements/Ideas runs and55 checkpoints only after their scenario/engine hashes were rechecked unchanged; they replace Mars results with the fresh reruns. `seal-after-mars-repairs.py` reproduces that provenance-preserving aggregation.

## Verification

- **540/540 seeded runs complete:**180 per campaign, three ordering modes (immediate Continue, optional-half, exhaustive current-local combinations),60 seeds each. Tests vary ingredient orientation, prepare only catalyst receivers, exercise optional branches, check monotone satisfied creation goals, unique identities, provenance, stationary destination positions and no fully covered arrivals. `release-branch-audit-results.json`.
- **80/80 prepared long-campaign checkpoints:**31 Elements,24 Ideas,25 Mars. Exact route-prefix state, expected stage, no premature caches, restore equality and final completion verified. Also10 wrong-setting/receiver-only catalyst checks,3 placement move/Undo/gold revocations,31 stable-identity installations and77 retired-token checks. `arrival-release-invariants-results.json`.
- Original regression witnesses intentionally fail on original data; they are preserved as evidence, not relabeled passes. `originals-integrity.json` verifies untouched originals.

Reproduce: `node reviews/integration-audit/release-branch-audit.ts` and `node reviews/integration-audit/arrival-release-invariants.ts`. The focused original-defect reproducer is `optional-prerequisite-regressions.ts`.

## Limits

These are source-aware mechanical/adversarial tests, not fresh play, human-fun evidence, mobile rendering, native touch or browser-performance certification. Broad stress sweeps can intentionally discover many unrelated things early (Elements maximum146 local tiles); that is not a claim about ordinary player inventory or a new required task count. Final browser verification remains with the integration owner.
