# Closed gate challenge: independent verification

**PASS:** `causation/third-job/sessions/fresh-gate-challenge.json` exactly reproduces from the frozen runtime. Every saved event, final state and history entry matches. A separate command-level reconstruction matches both transcript records, their before/after player views, resolved action, feedback and emitted events.

## What the participant actually did

The transcript contains only:

1. `new` — opens the authored earned checkpoint.
2. `drop {"source":"rope","target":"@gate"}` — resolves to `place rope at gate`, succeeds, then automatically advances to completion.

**Exactly one fresh DROP, not ten fresh actions or two player moves.** No fresh combination, creation, hint request, undo, rejected action, visit, or alternative route appears.

| Metric | Authored baseline | Terminal | Fresh delta |
|---|---:|---:|---:|
| Engine attempts | 8 | 10 | 2 |
| Accepted engine actions | 8 | 10 | 2 |
| Combinations / creations | 5 / 5 | 5 / 5 | 0 / 0 |
| Placements | 1 | 2 | 1 |
| Advances | 2 | 3 | 1 automatic |

The checkpoint `chapter-3-both-pierce-crate`, route `both-pierce-crate`, was independently regenerated from its explicit eight-action earned prefix and exactly equals `M.checkpoint`. Those eight events also equal the saved game's event prefix and are excluded from fresh counts. No inventory injection was needed. At arrival, rope, open-weave basket, perforated crate and sorted gravel are already available; the fresh participant did not make or earn them in this session.

## What this outcome supports—and does not

The final **player-visible** completion text says the gate stops dropping, both carriers pass through holding parcels with both hands, and nobody remains behind holding the gate. This is an intelligible authored consequence of the accepted placement, not merely an internal event message.

The action is heavily signposted. The initial scene identifies a ring above the raised gate; the rope description says it secures workshop fittings; the gate description says the overhead ring can hold a tie to the raised gate. Thus the observed one-DROP completion supports basic recognition and logical-runner intelligibility. It does **not** establish meaningful choice, puzzle depth, enjoyment, desire for another job, or whether the basket/counterweight alternative is fun. No alternative was attempted. There is no negative-action feedback coverage and no native/browser/animated outcome test.

The baseline explicitly warns that this logical `playerView` may expose more description than the browser. Its `sourceBlindRequested: true` records the requested protocol, not independent proof that the participant never viewed source. The transcript contains gameplay commands, not an exhaustive account of other information access.

## Integrity

- **34/34** current package-manifest file hashes match, including source, assignment, evidence and frozen runtime files.
- **8/8** source/runtime hashes in the session baseline match current bytes and every transcript record's hash map.
- Imported `pilot.ts` and `pilot.json` represent exactly the same scenario.
- Recorded and executing Node versions agree: **v24.22.1**.
- **38 original inputs** retained their observed bytes throughout verification. Their present SHA-256 values are in the result artifact.
- Local hashes establish byte consistency and reproducibility, not tamper-proof chronology or independent source blindness. The reported source/runtime Git commit is recorded metadata; Git ancestry was not independently checked.

No input file was changed. The earlier ten-trial report/results were not overwritten. No GitHub/site write was performed; no verification step was blocked or denied.

## Reproduce

```sh
node /workspace/shared/combination-campaign-research-20261028/closed-trial-verification-20261028/verify-gate-challenge.mjs
```

Separate artifacts: `verify-gate-challenge.mjs`, `gate-challenge-result.json`, `gate-challenge-run.log`, and this report.
