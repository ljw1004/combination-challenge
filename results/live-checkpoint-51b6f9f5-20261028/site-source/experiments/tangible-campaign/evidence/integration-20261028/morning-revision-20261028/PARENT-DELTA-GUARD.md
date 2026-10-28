# Original source61a9 behavior guard

The full deployment delta is compared with actual commit `61a9b4ee8c6235bff07f97eb16d713ec6125c81e`, not merely the immediate predecessor. Read-only git comparisons leave the real checkout clean.

- **43 original implementation files match byte-for-byte**, including all relevant `src`, model, CSS, save modules and the scenario schema contract.
- Model SHA-256: `793354131dc6b2cf9a5398e0dc163f5d834e62d477b719e7dedcfdcf6a2c8265`.
- `campaign-main.ts`: only chooser imports, registry-supplied featured IDs, presentation-only labels and chooser introduction change. **The complete `start(s:Scenario)` function and all following controller, rendering, checkpoint, reading and save code are byte-identical.** Exact diff is adjacent.
- `schema/lifecycle.ts`: only six earlier scenario IDs were added to `archivedScenarioIds` by the predecessor integration. Every validation/semantics function is byte-identical. This morning adds no exemptions. Exact diff is adjacent.
- Original `ui/scenarios.ts` bytes are retained verbatim in `ui/legacy-scenarios.ts`; the new facade registers content and chooser strings.
- Three inherited controller **test harness** files differ to accommodate registry imports. This is not a controller implementation change and those UI/controller tests were not run in this content-only work.
- Paused HUD geometry module, test and documentation are absent. No reference-summary implementation is included. The guarded model, controller tail and CSS make this a verified implementation boundary, not a claim inferred from a label such as “pre-HUD”.

`parent-delta-guard.json` records all exact paths/hashes and absent HUD paths. Current content still carries the previously documented overlap/clipped-ancestry presentation limitations; no UI/browser validation is claimed.
