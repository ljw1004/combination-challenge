# Estuary binary player protocol — separate wrapper candidate

This is a logical pair-command diagnostic, not a physical UI test. The frozen adapter and its authored witnesses remain unchanged. No player has been recruited; root must verify wrapper publication and explicitly authorize recruitment first.

## Exposure and assignment

The exact neutral assignment is the exported `ASSIGNMENT` in `experiments/ideas-history-estuary-binary-player.ts`. `init` records it verbatim along with all six objective descriptions, the exact initial player-facing state, the publication revision supplied by the coordinator and SHA-256 hashes of the four executing source files. Give the player that captured assignment, not a route, target action count or implementation briefing. Any navigation-only assistance must be recorded separately with exact text. Stop early is allowed; all shortcuts are legitimate; pursuing every objective is optional.

The player receives only the wrapper command surface: `state`, `objectives`, `inspect`, `partners`, `combine`, `finish` and `help`. Normal `partners` returns existing piece IDs and names only, never future result names, trajectories, commands or hypothetical worlds. `inspect` describes an already-existing piece, including exact current behavior and actual ancestry. After actual combination, the newly created pieces and outputs may be shown. Existing world laws and objective explanations remain public. `preview`, `source`, `routes`, arbitrary JSON engine actions, wait clicks and extra action parameters are rejected. This is an allowlisted interface and an assignment boundary, **not an operating-system sandbox**: do not give a player source/test/route files or internal `session.json`; an unrestricted shell could read them despite the assignment. If source/preview exposure occurs, record it and do not label that run discovery play.

## Coordinator initialization

After verified publication, from an isolated working directory with access only to the launcher, invoke:

```
node /verified/path/experiments/ideas-history-estuary-binary-player.ts init SESSION VERIFIED_COMMIT
```

The command creates `results/ideas-history-estuary-binary-players/SESSION/session.json` relative to its working directory and will not overwrite an existing session. The coordinator, not the player, supplies the verified commit. No commit string can itself prove remote publication: root must check it.

The player uses the same launcher followed by:

```
state SESSION
objectives SESSION
inspect SESSION EXISTING_PIECE_ID
partners SESSION EXISTING_PIECE_ID
combine SESSION LEFT_PIECE_ID RIGHT_PIECE_ID "optional reason"
finish SESSION "what I made, valued or disliked, what remained, and why I stopped"
help SESSION
```

Do not supply a sequence of example game pairs. These commands refer only to currently existing pieces; every normal action chooses exactly two. A combination is one gesture even if it causes multiple substrate commands. Automatic deliveries are separately listed, never extra choices. Current state includes all persistent known pieces: an accumulating catalogue is intended and not a failure measure.

## Evidence and persistence

One atomic session file retains the initial state/output, exact assignment/publication/source hashes, every subsequent command and its arguments/output, rejected requests, accepted two-piece actions, automatic transitions, and terminal report. A sequence number orders records. Optional reasons are recorded verbatim, not interpreted as measured decisions. Internal world history preserves the causal command ledger for after-play audit; do not expose it as a route guide to the player.

Each resume validates executing-source hashes and deterministically reconstructs the **entire session**, including queries, rejected actions, outputs and finish state, not just the world. Altered assignment, outputs, automatic records, history or finish flags fail closed. This is tamper detection against simple edits, not cryptographic authentication against someone rewriting a coherent complete journal. Session writes use a same-directory temporary file and atomic rename; a lock refuses concurrent writers. A stale lock after a crash requires coordinator investigation, not silent deletion. No mutation occurs on failed replay validation.

Finish is terminal for combinations and duplicate finish; read-only queries remain available and are recorded. A rejected query/action is not a gesture. Invalid startup/session-name requests cannot be attributed to an existing session and may only appear in the caller's process transcript; preserve that transcript if relevant. Failed attempts to overwrite an existing initialization leave its file unchanged.

## Review boundary

Evaluate actual chosen branches, subsequent uses, reasons for stopping and interface friction. The previously source-exposed 18/20/21/22-gesture witnesses are not observations from this protocol and must remain separate. The wrapper cannot establish human fun or about 200 interesting decisions by itself. No Mars source, Site or physical UI is changed.
