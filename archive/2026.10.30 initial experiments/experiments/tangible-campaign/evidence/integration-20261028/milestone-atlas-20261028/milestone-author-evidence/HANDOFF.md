# Milestone prototype handoff

## Immutable author input

- Candidate: `/workspace/shared/combination-milestones-prototype-20261028`
- Candidate source seal: `765baca28a6a37eb9b160dbc448bde2a8ca1b7ae4ad380edf3e9083a42b2e206`
- Parent source seal: `141353c215738e7df4ffccbf9154610573175d667f2252a79ac93a02b2e37caa`
- `delivery-manifest.json`: `490339f58c96d7cea2a86da8245735c10dd9c8ef82df59fb2401ceed5322aca5`
- `milestone-source-overlay.tar.gz`: `15bbd92e5af6560c82827355520a6fbacf869683779c384fc928b39ed46d64f9`
- `milestone-source.patch`: `1321b3097c752ebc285607a1d944a2a3c16c034a2d767f7d5977da77bd3a38fc`

The overlay contains 20 files: twelve modified inherited source/test/doc files, seven explicit additions, and the newly generated source seal. Nothing is removed. All other 925 inherited files match the parent exactly. The archive's member set, path safety and every payload hash were verified against the sealed candidate. No checkout, GitHub, deployment, browser or native UI action was performed.

## Feature and shared grammar

Exactly four milestones: active Mars working solar Rover, Camp water system, ready Oxygen plant; active Elements housecraft Plant. No Cooking, Atlas, predecessor-world or uniform-quota rewards. Copy, predicates and limitations are in `experiments/tangible-campaign/reviews/milestones/README.md`.

Raw registered recipe scenarios stay immutable. UI decorates before initialization. Shared logical players should import `applyMilestones(s)` or `getPlayableScenario(id, catalog)` from `ui/campaign-milestones.ts` and use the resulting world consistently for creation, restore, actions, checkpoints and acknowledgement. Build validates the same decorated worlds.

The new parent ready-chapter behavior is retained: no recursive advance; objective clicks open the current challenge; reloading an already-earned challenge preserves its own dialog. A milestone Continue cannot consume a subsequent chapter acknowledgement. Pending rewards, reader/debug interruptions, stationary pointer/touch releases and Undo of later actions preserve liveness. Native dialog, Continue/Escape, reduced-motion CSS and focus-return code are present; native behavior/layout/emotional effect remain untested.

## Validation on this exact parent revision

Passed:
- 25 focused controller tests: milestones plus ready-chapter acknowledgement/reload/real Kitchen coverage.
- 13 engine + legacy Mars controller tests, including actual decorated Mars/housecraft routes and checkpoints.
- 6 exact source-chain/guard tests.
- `npm run build` (content validation, strict TypeScript, Vite); retained large-chunk warning only.
- Strict exact-set source seal: 944 files, excluding the seal itself.
- Exact milestone-only parent delta verifier.

Commands (candidate working directory):

```sh
node --test --test-name-pattern='milestone:|already-earned|ready challenge|future-first orchard' experiments/tangible-campaign/ui/campaign-controller.test.ts
node --test tests/milestones-engine.test.ts tests/mars-v4-ui.test.ts
node --test tests/arrival-source-contract.test.ts tests/milestones-source-contract.test.ts
npm run build
python experiments/tangible-campaign/integration/verify-manifest.py
python experiments/tangible-campaign/integration/verify-milestone-delta.py
```

Logs are under `results/milestones-20261028/`: `rebased-acknowledgement-focused.log`, `rebased-engine-and-legacy.log`, `final-source-contract.log`, `build.log`.

Independent review by `/root/review_milestone_flow` reported 88/88 engine/controller checks and 1/1 source-contract check before the parent's final three-spot ready-chapter fix. It reproduced and independently retested stationary pointer and legacy-touch holds, Undo of a later move, stale handlers, reader/final-ending flow, twelve legacy/compact migration cases at real Mars milestones and all real checkpoints. The final parent fix was reviewed with its integrator; three additional milestone/ready-chapter interplay regressions now pass. No independent native UI claim.

## Remaining combined verification

The earlier full aggregate was 400/407 on the superseded 6047 base. Two inherited Food audit failures were repaired in the final 141 parent; the five milestone integration plumbing failures (old Mars VM injection and exact schema-source chaining) were repaired and targeted-retested. That old run is not a final aggregate pass.

Per root instruction, do not duplicate the full matrices: `/root/prepare_milestone_atlas_checkpoint` owns the final combined all64 suite and aggregate after integrating the separately reviewed Atlas successor. Use the exact 64-file argv in `/workspace/shared/combination-kitchen-atlas-integration-20261028-clean-evidence/applicable-suite.json`, with `node --test --test-concurrency=3`. Native browser testing is excluded.

## Integration cautions

- Preserve this author freeze and the preceding grouped-arrival and chapter-acknowledgement manifests. Add exact successor hashes for any authorized combined integration edits.
- The author source-contract also pins inherited registry files and complete controller/test bytes. Atlas registry and requested chooser-copy changes therefore require a documented exact integration successor; do not silently rewrite the author manifest or broadly exempt hashes.
- No Atlas runtime/content files are part of this milestone author input. Corrected Atlas should still receive no milestones.
- Root requested the next integrator make chooser secondary wording accurate for both earlier snapshots and experiments; it was requested after this author pin and is intentionally not included here.
