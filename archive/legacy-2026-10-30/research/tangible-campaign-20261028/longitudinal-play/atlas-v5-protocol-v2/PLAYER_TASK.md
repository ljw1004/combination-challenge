# Source-blind simulated player: atlas-v5-protocol-v2

This is **simulated logical play, not human playtesting**. Play a connected journey and decide whether you want to continue. There is no minimum or maximum number of combinations, no chapter stopping target, and no pressure to complete. Stop voluntarily whenever you want; an unfinished session is valid evidence.

**Highlighting is an ordinary part of play**, equivalent to hovering, selecting or beginning a drag. It is not a hint, concession, or failure of reasoning. You may freely scan every current item and try highlighted pairs out of curiosity. Discovering an unexpected output is intentional gameplay. You do not need a prior physical explanation or a guessed output before trying a possibility.

Read only this task and the command output. Do not inspect scenario/runtime/harness files, manifests, other sessions, reports, routes, author tests or assessor audit logs. Source blindness is a protocol, not OS isolation. Do not script exhaustive impossible-pair/all-pairs enumeration or access hidden source. This does **not** prohibit normal exploration of every visible item’s highlights or trying highlighted possibilities.

Start a NEW session at the actual opening; no authored baseline, checkpoint, reset, external clues, or stage skipping. Continue the same session for your journey.

```bash
P='/workspace/shared/combination-campaign-research-20261028/longitudinal-play/atlas-v5-protocol-v2'
SEAL='54022a01348b885b90531a1089c68944cd063c5ac22b793e11460d2249a03572'
SESSION='fresh-01'  # Use your assigned fresh ID; never replace another session.
play() { node "$P/play.mjs" "$SEAL" "$SESSION" "$@"; }
play start
```

Use only IDs you see. Examples:

```text
play view
play mission
play highlight ITEM --expect "See what lights up"
play read ITEM --expect "Curious about this source"
play drop ITEM OTHER_ITEM --expect "Highlight shows a possibility; curious what emerges"
play drop ITEM @PLACE --expect "Try this possibility"
play place ITEM @PLACE --expect "Put this here"
play move ITEM X Y --expect "Rearrange this"
play visit AREA --expect "Look around here"
play visit AREA ITEM[,ITEM] --expect "Bring this along"
play undo --expect "Undo that"
play note "A brief impression at a natural pause"
play stop "Why I choose to stop, and whether I would return"
```

The harness requires `--expect` before interactions solely to record your intent before seeing the result. A brief, honest “curious what emerges” is sufficient. If you genuinely predict a result, you may say so; there is no required essay or physical justification. Do not invent a prediction afterward.

`highlight` shows the existing tiles the UI highlights, never output names or recipe directions. Use it freely. `place` is the same real drop gesture and can combine at a location. Read is intentional and exists only on marked sources; it changes no progress. Generic object/recipe descriptions are not Read sources and remain withheld because the shipped UI does not display them. A rejected gesture is preserved and may produce no visible change; do not erase it by restarting.

Every command verifies the pinned scenario, runtime and harness hashes. Commands, brief pre-action intent, raw results and before/after views are retained for assessors. Do not inspect assessor files. Stage transitions are automatic; the final creation, new objectives, motivation and supplies are shown. Timing, modal acknowledgement and read-and-close are compressed into logical steps; this is not browser, touch or visual testing.

Notes are optional at natural pauses, not required after each surprise. When useful, briefly say what caught your interest, what confused you, whether earlier creations mattered, or whether you felt like continuing. Normal highlight exploration needs no apology or special justification.

When you choose to stop, call `stop` even if unfinished. Give a concise report with your session ID, actual opening-to-stop scope, memorable discoveries, curiosity/fatigue/confusion and stopping reason. Mention expectation mismatches only where you actually had an expectation. No need to reproduce the full log. Never label this human evidence or a UI test.
