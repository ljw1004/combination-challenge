# Frozen fresh-play prerequisites

These immutable inputs are published before new fresh-player sessions. They are authored scenarios and implementation, not fresh-player evidence or a claim of fun.

Use Node with native TypeScript support and `frozen/v3/engine/player.ts` as the player surface; follow `docs/FRESH-PLAY-PROTOCOL.md` and `trials/PLAYER-INSTRUCTIONS.txt`.

Prospective scenario inputs:
- Mars: `mars/slice-v2.json`, checkpoint `weather-start`.
- Ideas: `ideas/pilot-optics-perspective-chance-v2.json`.
- Elements: `elements/pilot-frozen-v1.json`.
- Revised Food: `new-worlds/v3/food.json`.

The engine freeze manifest verifies its bundled historical mini scenarios. `frozen/v3/scenarios/food.json` is the original mini, NOT revised Food. The three pilots and revised Food are passed explicitly to the CLI. The wrapper records scenario and implementation hashes, exact commands, outputs, and failures in a new named session. Fresh players must not inspect source recipes or authored solutions.

This narrow snapshot intentionally precedes the full authored research/evidence checkpoint. It preserves all existing repository content and does not alter a browser deployment.
