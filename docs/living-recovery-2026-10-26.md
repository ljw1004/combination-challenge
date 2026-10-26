# Living Works / Atlas recovery

Recovered 26 October 2026 after the earlier workspace was no longer present. This report covers a recovery package, not restoration of the complete investigation or its original raw player records.

## Verified original bytes

All four source files match the independently retained frozen SHA-256 values exactly:

- `experiments/logical-living-works.ts` — V1, shared 24-concept engine and three goals.
- `experiments/logical-living-works-2.ts` — V2, slow-alternation goal wrapper.
- `experiments/logical-living-works-3.ts` — V3, intermittent-publication input/goal wrapper.
- `experiments/logical-living-atlas.ts` — five-goal persistent campaign wrapper.

`tests/logical-living-atlas.test.ts` also matches its retained original hash. Check all five with:

```sh
sha256sum -c results/recovery-2026-10-26/living-original-hashes.sha256
```

These were recovered from retained source reads and creation/patch tool calls, not rewritten from the design summaries. Two other agents independently retained the same missing V2 tail; the assembled file matches its original hash. No restricted session files were accessed.

## Recovered text without an independent old hash

The V3 test file, Atlas model document, V2/V3 model documents and V2/V3 play protocols were recovered from complete original tool output or complete creation/patch commands. Their current hashes record this recovered snapshot, but are not independent proof against an old file hash. Separate provenance notes from the restoring agents accompany their documents. Historical documents preserve historical statements and paths; a link to an old capture or result file does **not** mean that file was recovered here.

The reviewer additionally recovered retained proposal and independent-review snapshots. The older design-contract snapshot was deliberately skipped because another recovery agent owns a newer doctrine revision. See the manifest and that agent's provenance record for the precise snapshot scope. No missing protocol or test was silently rewritten as an original.

## New checks, explicitly not old captures

`results/recovery-rerun-2026-10-26/` contains **new mechanical reruns**, not restored historical player recordings. On Node v24.22.1:

- 20 recovered tests pass: 12 Atlas tests and 8 V3 tests.
- V1, V2, V3 and Atlas author screens execute successfully: respectively 1,585, 3,618, 1,366 and 2,874 exact forecasts; 9,443 total.
- Author witness replays and full-cycle checks pass. Atlas's offered and reversed orders both reach all five goals.

```sh
node --test tests/logical-living-atlas.test.ts tests/logical-living-works-3.test.ts
```

The files need only Node's built-in TypeScript stripping and standard modules to run these checks. After integration with the restored baseline and Mars source, the current workspace passes 176 tests and TypeScript. Logs are in results/recovery-2026-10-26/living-plus-baseline-tests.txt and living-plus-baseline-typecheck.txt. This is not the original 227-test suite: some earlier test/evaluator files remain unrecovered.

## Limits

This recovery subtask recovered **no original player captures**. It also has no complete retained original V1/V2 test files, V1 model document, V1 play protocol, Atlas play protocol, or full registry/evaluator integration. Other recovery subtasks may independently recover additional evidence; their provenance must be checked separately.

The exact model can now be used again, but historical enjoyment/choice claims still require the actual original capture or a clearly identified retained summary, not a newly simulated witness. The new reruns establish mechanical operation only. No experiment redesign or remote publication was performed by this recovery subtask.
