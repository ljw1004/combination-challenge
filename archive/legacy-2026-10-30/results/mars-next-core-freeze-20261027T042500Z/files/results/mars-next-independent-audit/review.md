# Independent logical audit: Mars next revision

Scope: isolated `experiments/mars-next/{content,model}.ts`; original deployed source and frozen v3 player harness were not edited. See `source-sha256.txt` and reproducible `audit.ts`/`results.json`.

## Findings

- Three places now have distinct purposes: ridge clears an explicitly stated radio shadow (one placement goal); glacier supplies water (operand and source-collection catalyst); warm habitat supplies germination conditions (operand/catalyst). Broad later purpose goals require creations/functions, not individual parking errands.
- Glacier collection has a legible physical reason and a real alternative: Heater plus canister only collects water when the target is at the glacier; direct heating, filtering and filling remains lawful. Setting cannot be forged by an `at` parameter. The site is never an accumulating bag.
- Radio → solar radio → long-range radio retires predecessors; the latest radio can enter the Rover's typed module slot and provides explicitly authored communication functions. The radio module does not supply the motor/charger drive function.
- Heated propagator can become heated greenhouse without recreating obsolete propagator. Protected-growth capability remains available. Greenhouse and improved greenhouse satisfy functional purposes without exact-old-kind gates.
- Chassis wheels, obsolete workbench and incorporated solar lamp disappear; charger remains outside while real consumers (including future Rover) still need it and is incorporated after those uses are exhausted. Filter and ordinary unused cable are not swept away. Duplicate reconstruction is rejected.
- One implementation bug found independently was corrected: chassis construction originally retained Wheels because its own not-yet-created Rover slot counted as a future use. The explicit incorporation regression now passes. Stale pressure-patch repair-bench wording was also corrected.

## Evidence and limits

Five targeted regression checks plus 1,000 independently randomized recipe/slot-order closure runs are reproducible in `audit.ts`. All runs reached every purpose with zero terminal deadlocks. These vary enhanced-radio installation, recipe order, ordinary/contextual routes and evolving growth families; they are **not** exhaustive state-space proof, player trials, shortest-route proof or fun evidence. Random closure is omniscient about recipes and can intentionally place operands to meet known contexts.

No browser/UI was implemented or tested here. Continuous scroll positions, mobile/touch interaction, discovery hint legibility, task-modal cadence and native input behavior require the root's UI integration and browser/human evaluation. An empty later modal checklist replaced with one broad purpose is promising but not evidence of enjoyment. The remaining warmth catalyst is intelligible but still abstract, and the new glacier catalyst must be visibly discoverable to matter to a player.

Final reviewer rerun: after the author's description-only clarification of enhanced radio modules versus Rover drive power, this independent reviewer reran the full audit and refreshed the source digests. All five targeted checks and all 1,000 randomized closures still pass. The report and digests refer to this final candidate; reviewer-owned tests remain unchanged.

Implementation author's post-review note: removed the unused legacy Cart concept (no fresh recipe/supply/goal referenced it) after the reviewer run. Reran the independent audit code unchanged against final source, recording its results and refreshing source hashes. This rerun is author-executed, not a new independent interpretation.
