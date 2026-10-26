# Mars Progressive Camp 1 — implementation and operator guidance

26 October 2026. Separate goal wrapper over frozen `mars-objects-1`; no new physics, recipes, UI, stock limits or pressure. The prospective design and interpretation rules are in [the proposal](mars-progressive-camp-proposal.md). This document is operator guidance, not player evidence. **Do not give this analyst document to a blind player:** it names a solution and links the prospective witness list. Provide neutral command instructions and actual public observations instead.

The public project is one retained camp. Complete it when the tray is **currently enclosed and illuminated** and the observer **has located the camp**. Both requirements are disclosed at the beginning. Both milestones may happen in one action. A garden milestone does not reset anything, and there is no `next` command. Temporary darkening is recoverable; a milestone is not a substitute for current garden function. The observer does not forget a real earlier reception.

The engine's concept/installation distinction is unchanged: known concepts are inexhaustible structured blueprints; installation creates fresh physical components. An action targeting an installed lead, shell or panel changes that particular object. All available actions, recipes and exact effects remain public. A complete-catalogue lit-clear-shell can complete the project in one placement; this is permitted, not evidence of constructing its internals.

## Commands

Run from the repository root:

```sh
node experiments/mars-progressive-camp-play.ts init SESSION ordinary '{"publicPrompt":"EXACT PUBLIC ASSIGNMENT","participant":{"id":"ACTUAL PARTICIPANT ID","model":"RECORD IF AVAILABLE; OTHERWISE SAY UNAVAILABLE"}}'
node experiments/mars-progressive-camp-play.ts view SESSION
node experiments/mars-progressive-camp-play.ts preview SESSION '{"type":"combine","a":"…","b":"…"}'
node experiments/mars-progressive-camp-play.ts act SESSION '{"type":"combine","a":"…","b":"…"}'
node experiments/mars-progressive-camp-play.ts checkpoint SESSION '{"aim":"…","expected":"…","confidence":"…"}'
node experiments/mars-progressive-camp-play.ts report SESSION '{"response":"…"}'
node experiments/mars-progressive-camp-play.ts finish SESSION
node experiments/mars-progressive-camp-play.ts verify SESSION
```

`init` also accepts `complete` for mechanical controls. The parent/operator records the exact assignment in `publicPrompt` and the actual participant identifier in `participant.id`; these are required, not placeholders to copy literally. Record model metadata only when available. `finish` is valid on completion or a requested early stop. It is a session decision, not a game combine. Actions remain physically legal after project completion until the session is finished. Reports/checkpoints must be JSON objects and record only what was actually supplied.

Captures are new append-only JSONL files under `results/mars-progressive-camp-players/`. Each event records its exact output, state and integrity chain; initial metadata records the base source, wrapper, CLI, original protocol, operator-guide and prospective-proposal hashes. Existing session IDs cannot be overwritten. Even `view` is logged so delivered observation/automatic-preview exposure is distinguishable from an explicit `preview` request. `verify` is a read-only integrity and deterministic replay check. A changed frozen source or protocol blocks further capture/replay rather than silently relabeling evidence.

Public-only players receive commands, public observations/laws and the assigned question, not the implementation, proposal, witness screen or prior-player report. An implementer or reviewer who has read those is not a fresh blind player. The first proposed pilot is one ordinary-catalogue player. Assigned completion, reports of routine, and source correctness do not establish human fun or sustained engagement.
