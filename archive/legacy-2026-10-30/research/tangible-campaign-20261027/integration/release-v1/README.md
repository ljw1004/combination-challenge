# Combination journeys — integration release v1

Nine active journeys, ordered **Mars → Ideas → Elements → Food → Theology → Literature → Restoration → Shoreline → purpose-driven Causation**. `active-scenarios.json` is the active-selection contract; `scenarios.ts` exports the same typed `scenarios` array for the browser. Original School by the Well and old Causation files are preserved outside this active list.

## What is included

- Three full campaigns and six smaller journeys: **95 scenes**, each with completion copy gated by its actual goals.
- **104 earned debug checkpoints**: `chapter-1` through each journey’s final scene, then `complete` after the real Finish action. Every checkpoint is an exact accepted action prefix; none injects tokens, discoveries, history or stage state.
- Exact canonical route witnesses under `routes/`. These prove reachability, not optimal routes or required combination quotas.
- `evidence/*-replay.json` includes `actionsLog`, `combinations`, metrics, exact step output, scene boundaries and state hashes for Site test compatibility.
- Three alternate Ideas witnesses defer either or both optional first-scene discoveries until they become useful. They require no manual backtracking or hidden supplies.
- Explicit input, engine and bundle SHA-256 provenance in `manifest.json`.

## Deliberate integration changes

1. Completion patches apply by exact stage ID to every Elements, Ideas and Mars scene. The five `presentation-v5` minis retain their authored completion copy.
2. Causation’s new completion text describes the broad ferry actually carrying the loaded cart across and the narrow skiff bringing the fisher back. These are the scenario’s stated compressed deployment convention, not a new boat-physics simulation or new outcome tokens.
3. Mars retains `relay-goal-0` (rescue route) and the capable relay’s real transmission at `relay-knoll`. It removes only redundant `relay-goal-1` and the later `place relay → relay-knoll` witness action.
4. Ideas removes only Anatomy and Inference’s restrictive explicit carry overrides. Existing current-goal dependency traversal collects Observation + Notebook or Observation + Question when Field note or Hypothesis is absent; it stops at an existing intermediate otherwise. Optional early work remains optional. Canonical local item counts are unchanged.
5. All debug checkpoints are regenerated from the resulting exact routes, including completed endings.
6. Eight sole-use Mars repair bases explicitly become part of their repaired successors: broken radio, ascent cabin shell, sensor mast, relay transceiver, service shelter, spare drive, greenhouse shell and electrolyzer stack. Each has one consuming recipe and no objective use; per-recipe reasons describe physical incorporation. Discovery/incorporation provenance and exact Undo restoration are tested. Tools and multiple-use crawler/tow alternatives remain; nothing is removed merely because it is finished. `evidence/mars-repair-incorporation-proof.json` records the individual checks.

The manifest identifies the exact engine revision. `evidence/baseline-v5/` preserves the original frozen/v5 authored-route-only baseline and its 66 passing tests; it predates the alternate-route and arrival-layout repairs and must not be represented as final release validation.

## Run and verify

Requires Node capable of executing erasable TypeScript (tested with Node 24.22.1). No runtime packages are needed for the engine or tests.

```sh
node --test engine/model.test.ts engine/arrival.test.ts release.test.ts
node verify-manifest.ts
```

The final engine is `engine-arrival-v6`, a layout-only extension of frozen/v5: one shared arrival operation separates carried source groups from occupied destination objects without changing identities, recipes, carry choices, placements or objectives. The bundled `baseline-engine/model.ts` is byte-identical to frozen/v5 for comparison. Arrival regression imports are relocated for the standalone package; `engine-source.json` documents those two path-only replacements. Arrival fixtures also cover width 375, occupied old areas, manual visits, preserved rigid groups and coincident-item separation.

Tests exercise all canonical routes and all checkpoints at board widths 320, 360 and 600, exact drag/action equivalence, save restoration, completion gating and reversal, Mars relay semantics and three Ideas delayed-discovery routes (either omitted item and both together).

`build.ts` is a source-workspace-only regeneration tool: it reads the provenance inputs two directories above and writes only this integration directory. `engine-source.json` chooses the exact implementation to copy. After the independent reviewer has finalized its audit, `collect-independent-audit.ts` verifies that audit against the exact current engine/scenario bytes and preserves its report/scripts/evidence. `report.ts` records passed tests and typechecking; `seal.ts` records the final files. Rebuilding or editing sealed files intentionally invalidates the old bundle hash until resealed.

## Limits and publication

This is author-aware logical correctness evidence. It is **not** a fresh source-blind playtest, human enjoyment result, historical/scientific source re-verification, or visual browser QA. Scene lengths and optional branches need actual player feedback. This subtask makes no GitHub or Site write. Browser installation and live validation belong to the parent integration task.
