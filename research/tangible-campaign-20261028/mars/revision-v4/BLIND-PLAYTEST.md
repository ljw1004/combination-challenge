# v4 source-blind diagnostic surface

Do not read the implementation, scenario, evidence, routes, tests, or prior player sessions. This is logical simulation, not a human fun judgment or browser-layout test. Preserve every rejected attempt, hint and stopped session.

From `/workspace/shared/combination-campaign-research-20261028/mars/revision-v4`:

- `node blind-player.ts night view`
- `node blind-player.ts workshop view`
- `node blind-player.ts SEGMENT drop SOURCE_ID TARGET_ID`
- For a visible place, target `@PLACE_ID`, e.g. `@thermal-chamber`. **Use the same drop command for objects and places:** it resolves with the browser's actual `M.dropAction`, so the player does not decide between raw place/combine actions.
- Optional existing hint: `node blind-player.ts SEGMENT hint ITEM_ID`.

State your intention before drops; use visible labels, descriptions and goals. Do not enumerate every pair. Stop when complete, genuinely stuck, or the actions cease to have a sensible purpose. Explain what the observation actually showed, whether you could make a physical plan, what earlier creation mattered, and any arbitrary restriction or lost object identity. Sessions persist under `blind-sessions/`; do not reset them.
