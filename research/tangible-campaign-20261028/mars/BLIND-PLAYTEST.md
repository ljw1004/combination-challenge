# Targeted source-blind diagnostic (not human fun evidence)

The author has read the source; their replay is **not** a fresh playtest. Give a source-blind player only this file and the commands below, not the candidate, routes, report, tests or script contents. Do not reset negative sessions or hide rejected actions. The surface exposes the real player view, accepted actions and the existing no-result-preview partner hints. It is a logical interaction surface, **not browser or touchscreen QA**.

From `/workspace/shared/combination-campaign-research-20261028/mars`:

- `node blind-player.ts refuge view`
- `node blind-player.ts night view`
- `node blind-player.ts water view`
- `node blind-player.ts oxygen view`
- Act: `node blind-player.ts SEGMENT act '{"type":"combine","a":"ITEM_ID","b":"OTHER_ID"}'`
- Put an item at a visible place: `node blind-player.ts SEGMENT act '{"type":"place","item":"ITEM_ID","location":"PLACE_ID"}'`
- Combine with a place: use `"b":"@PLACE_ID"`.
- Optional real player hint: `node blind-player.ts SEGMENT hint ITEM_ID`

Choose intentions from visible labels/descriptions and goals. State what you expect before an action. Stop when the segment completes, you are genuinely stuck, or the choices become purposeless. Do not brute-force all pairs. You may leave and report an unfinished segment. Session actions are preserved under `blind-sessions/`.

After play, report: what earlier creation you recognised and why it helped; where you felt a step had no real purpose; surprising rejection; whether object identity and fitted parts stayed understandable; which line or physical relationship felt unconvincing. Compare the refuge signal's purpose against the effort of relocating it. Do not rate overall fun from a short source-blind simulation.
