# Compact Rover, anonymous slots, mobile drag and Reset

This revision supersedes the earlier large labelled Rover panel. Rover is the same10-board-unit width as ordinary things, with compact one-line component spaces. Frame + Wheels creates the chassis; Frame + Motor is not a recipe. Wheels become part of the chassis under explicit incorporation metadata and the remaining-use rule; reusable Frame stays at its origin. Incorporation is distinct from evolution retirement. Motor and Solar charger fill anonymous required spaces; optional Radio appears only after installation. Empty spaces do not disclose part names through visible text, titles, accessible labels, feedback or objective copy. Installed spaces display actual parts (short visible Charger, full accessible Solar charger).

The final mobile revision adds guarded non-passive touch handling for actual item drags, shares the existing highlight/drop logic, adopts overlapping touch-pointer input to avoid duplicate commits, and retains pointer-only touch/mouse/pen operation. Blank board/location touches remain unprevented. Inactive cancellation preserves viewport identity; active cancellation restores without committing. Existing CSS already specified touch-action:none on things, so source inspection alone did not establish the reported native-device cause.

Restart from beginning is reachable inside an open modal. It shares the toolbar Reset path and clears model progress/history/seen/queue, selection, dialog view, drag, suppression and animation state. Welcome and the initial objective replay, and stale drag completion cannot mutate the fresh game. Other prototype routes/storage remain untouched.

Earlier legacy compatibility work is retained and covered by existing tests; after the user clarified that they reset on every visit, no further migration design effort was pursued. This checkpoint prioritizes fresh/reset correctness and mobile input.

## Verification and publication

Final synthetic DOM25/25; named plus independent-slots80/80; full Site140/140. Named TypeScript/Vite, Site TypeScript/all-route build, source parity and diff check passed. Exact source/tests, intermediate and final logs, exit codes, parity and sanitized deployment receipt are in `results/mars-compact-mobile-reset-20261027/`. Earlier compact126/50 and chassis133/73 evidence is explicitly historical; an intermediate stale-test failure is preserved rather than presented as a final pass.

Parent-reported owner-private deployment succeeded2026-10-27T03:10:56.719582Z. No native mobile/browser validation, hit-testing, text-fit, player-study or fun claim is made. No separate intellectual-history route or mutable hosting configuration is part of this preservation package.
