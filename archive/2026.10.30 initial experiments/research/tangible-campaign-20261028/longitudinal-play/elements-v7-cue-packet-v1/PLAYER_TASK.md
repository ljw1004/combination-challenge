# Source-blind simulated player: elements-v7-cue-packet-v1

This is **simulated logical play, not human playtesting**. Evaluate whether you understand and want to continue a connected journey; completion or any combination count is not the target. You may stop voluntarily whenever confused, bored, satisfied, or no longer curious. Do not force 200 combinations or enumerate pairs mechanically.

Read only this task and output from the command below. Do not read scenario/runtime/harness files, manifests, other sessions, reports, routes, author tests, or assessor audit logs. Source blindness is a protocol, not OS isolation. Start a NEW session at the actual opening; no authored baseline, checkpoint, reset, external clues, or stage skipping. Continue the same session for your entire journey.

```bash
P='/workspace/shared/combination-campaign-research-20261028/longitudinal-play/elements-v7-cue-packet-v1'
SEAL='af6d9688e3c0b6c8b2a459613ca03bf147e1128bf56ef2016f21898ba0a86415'
SESSION='fresh-01'  # Use your assigned fresh ID; never replace another session.
play() { node "$P/play.mjs" "$SEAL" "$SESSION" "$@"; }
play start
```

Use only IDs you see. Ordinary commands are one deliberate step each:

```text
play view
play mission
play highlight ITEM --expect "What I am looking for or why I select this"
play read ITEM --expect "What I hope this source will clarify"
play drop ITEM OTHER_ITEM --expect "What these mean together and what I expect to change"
play drop ITEM @PLACE --expect "Why this belongs at that place"
play place ITEM @PLACE --expect "Why I place this here"
play move ITEM X Y --expect "Why I move it; this clears its placement"
play visit AREA --expect "Why I return here"
play visit AREA ITEM[,ITEM] --expect "Why I bring these current things"
play undo --expect "What I intend to undo and why"
play note "What happened versus my expectation; curiosity, fatigue, or confusion"
play stop "Why I voluntarily stop, and whether I would choose to return"
```

`place` is the same real drop gesture, so it can combine at a location. `highlight` shows only the existing tiles the UI highlights, never result names or recipe directions. Read is intentional and only exists on marked sources; it changes no game progress. Generic object descriptions and recipe descriptions are **not** Read sources and are withheld because the shipped UI does not show them. A rejected game gesture is preserved and may produce no visible change; do not replace the evidence by restarting.

Every command checks the pinned scenario, runtime and harness hashes and preserves the command, pre-action expectation, complete raw engine result, and before/after views for assessors. Do not inspect those assessor files. New chapter transitions happen automatically after the creation; visible motivation, objectives, supplies and final-creation state are returned. The 700 ms animation, modal acknowledgement and read-and-close are compressed into logical steps; this is not browser/touch/visual evidence.

Write an honest `note` after a surprising outcome and at natural pauses: did the result make sense, did prior creations matter, is the next goal clear, and do you want to continue? Do not rationalize an unexpected result after the fact. Before changing play actions, put your expectation in `--expect`. Selective highlighting is allowed; systematically harvesting every highlight or trying every pair is not.

At your stopping point, call `stop` even if unfinished. Report the exact session ID, opening-to-stop scope, meaningful combinations you remember, expectation mismatches/rejections, reuse of earlier creations, optional discoveries, curiosity/fatigue and why you stopped. No need to reproduce every logged command. Never call this human evidence or a UI test.
