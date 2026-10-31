# Arrival layout v6 — reviewed engine candidate

**Outcome:** all nine release routes and all their checkpoints pass at widths320,375,600. All258 non-final stage transitions contain zero completely hidden arriving tokens. The existing25 engine tests plus24 focused arrival tests pass (49/49). The independent auditor additionally passed540 randomized long-world runs,80 long-world checkpoints,10 catalyst-direction checks and31 installation-identity checks.

## Narrow change

`engine/model.ts` is the only changed runtime source; engine CLI/player and scenario schema are copied byte-for-byte from `frozen/v5`. No scenario, recipe, objective, carry-selection, incorporation, birth-adjacency, manual movement, save format or metric semantics changed. Root engine, frozen sources and Site were not modified.

Advance and manual visit now share an arrival helper. For each source-area group it first preserves the normalized source arrangement, repairing only a fully hidden inherited same-group stack. It chooses the nearest deterministic rigid translation that clears existing destination tokens, places and earlier source groups with a2px gap. If the rigid shift wastes more than a50px row, a per-token nearest-clear-position alternative is considered and used only if its extent is smaller. Existing destination tokens/places never move. Ordinary partial birth overlap within an unchanged carried group is retained.

On canonical routes165/174 multi-token source groups retained exactly their relative positions; the remaining9 used local collision/compactness correction. Deliberately large source-group internal spacing is otherwise preserved; this does not globally tidy player arrangements.

## Arrival board extent (bottom edge, px)

| World |320 new /v5|375 new /v5|600 new /v5|
|---|---:|---:|---:|
| Elements, max across scenes |354 /220|358 /220|312 /216|
| Mars, max across scenes |378 /328|378 /378|274 /274|
| Ideas, max across scenes |278 /278|278 /278|178 /178|
| Elements Bakery |172 /128|172 /128|170 /122|
| Mars Cargo-return |324 /324|324 /324|224 /224|
| Mars Nursery |228 /228|228 /228|178 /178|

The old smaller Elements extent included exact overlapping stacks. The corrected long-world arrivals stay below400px content depth at all three widths; no new inventory is hidden or deleted.

## Verification and evidence

- `node --test engine-arrival-v6/engine/*.test.ts`:49/49, including return into an occupied area, manual visit, same-area no-op, group shape, inherited full stacks and exact checkpoint regressions.
- `node engine-arrival-v6/audit.ts`:27 exact full-route runs, all checkpoints,258 stage entries, zero fully hidden arriving pairs, retained identities/slots/locations/outcomes/metrics, exact deterministic replay/restore and Undo spatial restoration. Existing destination/archive positions are asserted unchanged.
- TypeScript7.0.2 check passed with `--noEmit --allowImportingTsExtensions --module esnext --moduleResolution bundler --target es2022 --skipLibCheck --typeRoots /workspace/shared/combination-playtest-site/node_modules/@types --types node` for local engine/schema/audit sources.
- `evidence/route-layout.json`: per-scene old/new geometry, full-cover pairs and source-group shape preservation.
- `evidence/checkpoint-positions.json`: complete before/after geometry for Bakery, Cargo-return, Nursery and Ideas chapter21 at all three widths.
- `evidence/arrival-geometry.html`: inspectable375px side-by-side geometry diagnostic (not the game UI).
- Independent audit: `../reviews/integration-audit/release-branch-audit-results.json`, `../reviews/integration-audit/arrival-release-invariants-results.json`.

The geometry HTML was not screenshot-rendered: local Chromium aborts because `socket()` is not permitted. This is not a game/engine failure; actual browser UI verification belongs to the integration/browser task. The failed renderer log is retained as `evidence/chromium.log`.

Undo intentionally keeps lifetime effort metrics, as in v5; all other state is exact. No publication occurred.
