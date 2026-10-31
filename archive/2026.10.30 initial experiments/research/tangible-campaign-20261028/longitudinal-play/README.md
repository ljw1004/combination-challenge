# Longitudinal logical-play packets — 28 October 2026

## Assignment status

- **Atlas v4:** `atlas-v4-packet-v2/PLAYER_TASK.md` is ready for a new source-blind simulated player.
- **Mars v4, Elements v7, Food v3:** approved copy-only corrections are ready in `mars-v4-copyfix-packet-v1/PLAYER_TASK.md`, `elements-v7-copyfix-packet-v1/PLAYER_TASK.md`, and `food-v3-copyfix-packet-v1/PLAYER_TASK.md`. Their exact approved hashes match; only 10/1/2 narrative strings changed. Original packet copies remain preserved and unassigned. Never silently swap a scenario under a frozen packet or existing session.
- Direct folders `mars-v4/`, `elements-v7/`, `food-v3/`, `atlas-v4/` are first preparation freezes, **not assigned**. A preparer inspection found that the logical mission-opening operation also needed the shipped UI's already-complete-stage handoff after Undo. The v2 adapter fixes that without editing an existing frozen packet. All first freezes and preparation sessions remain intact.
- Original `mars-v4-packet-v2/`, `elements-v7-packet-v2/`, and `food-v3-packet-v2/` are **unassigned original-copy freezes**. Their source-aware smoke results are not fresh-play evidence for any corrected candidate.

A packet is immutable source input: mode 0444 files, mode 0555 directories, plus an externally pinned manifest that hashes the exact scenario, shipped runtime/schema, harness and provenance. Filesystem modes are an accident guard, not adversarial isolation. Players must not inspect hidden source or audit material. A command rejects changed pins/files before importing scenario/runtime code.

## Surface contract

- Every fresh session calls the shipped `createGame(scenario,360)` at actual stage 1. There is no baseline replay, checkpoint, reset, manual advance, recipe query, or output-name preview.
- Drop and the placement shortcut resolve through the actual `dropAction` and `applyAction`. Move and visit also use real engine actions. Successful stage-finishing actions settle automatic advances, returning the final creation and new visible challenge/motivation/supplies.
- Current-area things and places only; reached area names/counts permit returning to earlier creations. Existing slots and fitted components are visible. Partner highlighting is the same union of current UI-highlighted tiles, not output previews or textual recipe instructions.
- Read is explicit, uses only authored `Item.reading`, and does not change game progress. Generic item/location descriptions, recipe descriptions, hidden outputs and raw engine recipe IDs are withheld from player output. They are not disguised as optional source readings.
- Every deliberate interaction requires `--expect`, durably recorded before execution. Notes and voluntary permanent stops are supported. No target combination count, completion requirement, or brute pair enumeration is part of the task.

## Evidence and audit

All `sessions/*/smoke-preparation-*` are **source-aware preparer smoke**, never source-blind participant, human, engagement or UI evidence. Smoke routes use a handful of authored first-stage actions only to verify the adapter. First attempts that were halted during preparer verification remain preserved; do not relabel them as player stopping decisions.

For each real player session, `sessions/PACKET/SESSION/` contains:

- `intents.jsonl`: durable pre-action expectations, exact commands and every verified frozen hash.
- `player-output.jsonl`: exactly the visible command responses.
- `audit/NNNNN.json.gz`: complete raw engine results, including games/history/events, raw model views, before visible view and exact player output. **Assessor-only; may contain descriptions and recipe identifiers.**
- `receipts.jsonl`: hash-chained audit receipts, game and output hashes.
- `session.json`: current game and receipt pin; resumption checks consistency.
- `rejected-commands.jsonl`: malformed commands, missing expectations, attempts after stopping, and integrity failures; these are never erased.

The full audit may be read by an assessor with `gzip -dc PATH`, never by a source-blind player. Engine rejection results remain in their audit records even though player output shows only rejection/no visible change, matching the shipped UI's lack of explanatory toasts. Command rejection is instrumentation, not an extra gameplay hint.

## Verification performed

- Every hash in the original candidate manifests verified: Mars 1, Elements 7, Food 50, Atlas 22; no missing or changed files.
- Runtime/schema pinned byte-for-byte to Git commit `61a9b4ee8c6235bff07f97eb16d713ec6125c81e` from `/workspace/shared/combination-fork-recovery-20261028`.
- Production build passed, with the existing large-chunk Vite warning only.
- All 28 pure runtime model tests passed.
- v2 adapter source-aware smoke passed for Elements, Food and Atlas: real fresh start, pre-action expectation gate, rejected self-drop, selected highlighting, first-stage automatic handoff, undo → mission recovery, explicit notes/stopping, stopped-session rejection and compressed audit/receipt checks. Atlas additionally verifies deliberate Read does not alter progress.
- Independent temporary-copy fault injection rejected changes to scenario, model, both schemas, both harness files, manifest, and external pin before gameplay loading.

See `evidence/` and `packet-index.json` for exact reports and hashes. Corrected-copy packets have separate provenance and passing fresh-start smoke records; none inherits play evidence from old copies. Additional source-aware Mars smoke verified movement, return visits with a current item, and preserved unreached-area rejection.

## Limits

This is simulated logical testing, **not human evidence**. No browser, touch, visual, animation or UI tests were run. The adapter compresses the creation timer/mission acknowledgement and deliberate Read-and-close into logical steps; it does not model the UI's 700 ms reader-interruption window. Reading is limited to the visited area rather than off-area scroll selection. Visit accepts engine-supported carry lists as a logical convenience; single-item carry most closely matches the UI. Source blindness is protocol-only. No publication occurred, and no source scenario or shipped runtime was edited.

## Separate minimal cue experiments (06:13 UTC)

`mars-v4-cue-packet-v1/PLAYER_TASK.md` and `elements-v7-cue-packet-v1/PLAYER_TASK.md` are fresh-start packets for separately identified scenarios. Each changes only the scenario ID and one motivation from the copy-corrected base. Runtime, schema, logical harness, recipe definitions, goals and authored routes remain unchanged; no kiln-bowl alias was added. These are small narrative experiments, not proven fixes or human enjoyment improvements.

Both passed schema validation, real-opening logical smoke, and the 230-action complete authored-route parity regression against their own base: final states and engine events are identical. This is preparer regression evidence, never simulated-player completion evidence. Old stopped player sessions and frozen packets remain byte-identical; see `evidence/cue-experiment-preservation-after.json`. Nothing was integrated, published or browser-tested.

## Protocol v2 (06:30 UTC)

For new assignments use the four separately named `*-protocol-v2/PLAYER_TASK.md` paths in `active-packets.json`. They restore normal free partner-highlight exploration, brief curiosity-driven intent, and optional natural-pause notes. Prior instructions and negative sessions remain evidence under their actual protocol. See `PROTOCOL-V2-METHOD.md` for separate task/core pins, exact content/runtime parity and limitations; these are not controlled A/B tests or proof of improvement.
