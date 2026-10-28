# The Riverside Workshop — fresh logical session

Try this short combination game from its actual beginning. You can think aloud or leave notes as you play. Use only the visible player surface. Stop at the ending, if you decide you have seen enough, or if you cannot find a next action after trying your plausible ideas and the available help.

This is a source-blind logical-controller session, not a human playtest. Do not open the scenario, recipes, runtime, tests, author notes, saved state, private audit records, or other players’ sessions. Do not reset or create a second attempt after seeing the opening. Do not use scripts to enumerate solutions.

The coordinator supplies the exact manifest pin and a new session name. Run:

```sh
node /workspace/shared/riverside-workshop-probe-v1/play.mjs PIN SESSION start
```

Use the same prefix and session for subsequent commands:

- `view` — current scene and tiles.
- `mission` — reopen the scene's invitation.
- `drop ITEM_ID OTHER_ITEM_ID` — bring two things together.
- `drop ITEM_ID @PLACE_ID` — drop a thing at a place.
- `highlight ITEM_ID` — see the current partner tiles that selection would highlight. No result previews.
- `read ITEM_ID` — deliberately read a tile only if it is marked readable; ordinary descriptions are not a hidden inspection command.
- `undo` — one ordinary undo. If it undoes a chapter handoff, `mission` resumes the completed chapter's handoff.
- `note "your observation"` — record an optional comment without changing progress.
- `stop "your reason"` — end voluntarily and preserve this attempt.

No manual advance is needed: successful chapter endings advance automatically. The logical surface elides animation and modal-dismissal gestures; it does not test a browser, touch controls or layout. Optional `--expect "what you expect"` may be added to an action, but is not required.

When finished, **first give your own account of how it went**: what stood out, what you tried, where you were confused, and anything you would change. Distinguish what you actually noticed during play from thoughts that occurred while writing the report. Do not inspect other files to explain the game. The coordinator may ask separate follow-up questions only after this initial report is preserved.
