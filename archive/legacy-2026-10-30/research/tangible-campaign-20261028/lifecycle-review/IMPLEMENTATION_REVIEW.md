# Isolated event-local correction: parent review packet

Status: implementation and automated verification complete; **not integrated into the shared Site and not published**. The original `REPORT.md`, `baseline/`, characterization tests, and frozen trials remain unchanged historical evidence.

## Apply/review

- Isolated tree: `lifecycle-review/integration/`
- Minimal patch: `lifecycle-review/event-local-policy.patch`
- Per-file base/result hashes: `lifecycle-review/patch-manifest.json`
- Baseline with the parent's newer long-label layout: `lifecycle-review/implementation-baseline/`

The patch touches seven files: one runtime file, the existing lifecycle tests, a new focused regression file, the aggregate test import, design principles, and two policy documents. It excludes the parent's independently developed long-label renderer/packing changes and all generated build assets. `git apply --check` succeeds against the shared working tree without modifying it.

## Runtime change

1. Remove generic deferred-incorporation reconciliation from actions and restore.
2. Keep `needed()` unchanged as a decision at the actual combining/installing event. Only the current recipe may remove its authored inputs.
3. Preserve declared fitted parts on the new owner immediately, including retained-source installations. Populate creation components before choosing adjacent placement so its actual height is available.
4. Introduce optional `lifecycleVersion: 2` within the existing `Game.version: 1` format. New games and migrated old games carry it; normal marked save/restore is an exact round trip.
5. Unmarked old saves receive only evidence-based visible-component repair: find the recipe's first observed use between adjacent retained snapshots, use the **pre-event** source's actual parts, and follow recorded output/owner ancestry. This fixes old installation preservation too. It does not delete or resurrect tokens, change their slots/coordinates, or change events/metrics.

No item-instance model, finite supply counting, changes to `needed`, forced tidying, hidden last-use filtering, or scenario-specific retirement exceptions were introduced.

## Deliberate migration limits

- Already-absent components/items are not resurrected as outside tokens. Existing recorded construction metadata is not guessed away or removed.
- A live loose source that acquired parts later is not a reliable record of an earlier assembly. Recovery does not copy its latest state backward.
- Missing pre-action history means missing old parts stay unknown. The 100-snapshot history bound can prevent recovery of older constructions. No catalogue-based parts are invented.
- **Legacy soup expectation consciously changed:** an unmarked pre-lifecycle save containing both prepared pouch and warmed soup keeps its ambiguous leftover pouch. It still loads, keeps progress, and can pack the warmed soup. New play transforms the pouch immediately as before. Deleting that historical duplicate would require a separately justified provenance-specific migration; the old broad graph cleanup is not retained under a different name.
- The lifecycle marker makes recovery one-time and idempotent. Unknown future marker values are rejected rather than silently reinterpreted.

The original `lifecycle.test.ts` last-use deletion assertion is transparently reversed. The legacy soup test is renamed and explicitly asserts the conservative limit. The legacy construction fixture now declares itself unmarked, as actual old saves are.

## Verification against final code

| Command/check | Result |
|---|---|
| `npm run build` in isolated tree | PASS: content validation, TypeScript and Vite. Existing large-bundle warning remains. |
| `node --test tests/tangible-campaign.test.ts` | **138/138 passed** (`corrected-campaign-tests.tap`). |
| `npm test` | **455 passed, 0 failed, 1 skipped** across 456 tests (`corrected-full-tests.tap`). The skipped native-browser test was not exercised; this is not native UI evidence. |
| New lifecycle tests | 10 tests covering all ordinary authored routes, actual retained inputs, movement/travel, explicit later consumption, save/history, fitted source/copy visibility, two drag directions, legacy repair and truncation, immediate replacement/non-resurrection. |
| Historical characterization suite | Still runs against its original copied baseline, not the corrected implementation. |
| Differential replay | **112 route/width runs, zero discrepancies in acceptance, discoveries, recipe use, stage progress, metrics or carry transfers**. All complete. |
| Frozen Elements v7 action replay | All **196 historical events** retain their acceptance/rejection pattern, stage and metrics; physical state correctly differs. Oil retires only Seeds, warm Feast only Porridge/Compote. |

The differential set includes all 15 existing authored routes; current Elements v7, Mars v4, Atlas, Food, Causation and Doctrine v3 research candidates; three Mars alternate/alias routes; and 72 Doctrine alternatives. Active Mars, active Elements and the six primary candidates are compared at widths 320, 360 and 375. This verifies compatibility, **not release approval of research candidates**. Exact inputs and outcomes are in `compare-policy.ts`, `corrected-route-clutter.json`, and `corrected-route-clutter-stdout.json`.

## Extra local clutter and route effects

Counts compare the same action at the same width; they are not new physical copies created by the patch. They are outside tokens that the old reconciliation used to remove.

| Journey | Maximum extra current-area tokens | Extra surviving tokens across all areas | Modeled board-bottom growth |
|---|---:|---:|---:|
| Active Mars / Mars v4 candidate | +2 | +2 | 0 px at tested widths |
| Active Elements / Elements v7 candidate | +1 | +6 | 0 px at tested widths |
| Primary Atlas, Food, Causation, Doctrine candidates | 0 | 0 | 0 px |

Mars's outside Solar charger and Pressure patch remain in the Garden. The Garden's entire-stage peak remains 12 objects; at the particular grow-light action its count is 9 rather than 7.

Elements leftovers stay in their last-use areas: Kiln/Harbour, Lens/Botany, Millstone/Washday, Bread/Kitchen, River map/Timekeeping, and Stone/Gallery. Harbour's stage peak rises 12→13, Botany 5→6; v7 Timekeeping rises 8→9. Kitchen's peak remains 9; only the post-Feast snapshot keeps its extra Bread. **No extra leftovers are carried into the next stage** in the tested routes, and all transfer event arrays are identical.

Old archived routes also complete: Theology has +1 Linen and a 59 px modeled board-bottom increase at width 360; archived Mars has up to +2 local/+4 global; archived Elements +1 local/global. Those are disclosed compatibility differences, not hidden evidence rewrites.

At width 360, active Elements/v7 have 10 action snapshots with different common-token coordinates due to the retained obstacles affecting later creation placement. Thus this is not a claim of pixel-identical layouts. Modeled extents and controller tests do not replace a browser/native visual review. Original source position/slots are explicitly asserted unchanged at the actual retained-input actions.

## Recommended integration boundary

Review/apply only the seven-file patch, then rerun aggregate checks in the parent's final combined tree. Keep frozen playtest evidence immutable and record new policy runs separately. Native visual confirmation of the optional fitted radio and the Elements oil/Feast moments remains the main unperformed verification, not a known blocker or a claim that source data was lost.
