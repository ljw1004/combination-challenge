# Tangible campaign harness

## Frozen fresh-player entrypoint
Use `frozen/v1/engine/player.ts`, not author route scripts. Freeze manifest hashes the engine, CLI, wrapper, schema and seven small scenarios. Do not edit v1 once a trial begins; change a new version and start another named trial.

```
node frozen/v1/engine/player.ts init PERSON_FOOD frozen/v1/scenarios/food.json
node frozen/v1/engine/player.ts view PERSON_FOOD
node frozen/v1/engine/player.ts hint PERSON_FOOD ITEM_ID
node frozen/v1/engine/player.ts act PERSON_FOOD '{"type":"combine","a":"A","b":"B"}'
node frozen/v1/engine/player.ts act PERSON_FOOD '{"type":"place","item":"A","location":"P"}'
node frozen/v1/engine/player.ts act PERSON_FOOD '{"type":"advance"}'
node frozen/v1/engine/player.ts act PERSON_FOOD '{"type":"visit","area":"OLD_AREA","carry":["TOOL"]}'
node frozen/v1/engine/player.ts undo PERSON_FOOD
node frozen/v1/engine/player.ts stop PERSON_FOOD 'Why I stopped; concrete reactions.'
```

Location operands use `"b":"@P"`. For a catalyst, place B at P, then combine A onto B. This is contextual two-thing combining, not a location accumulating ingredients. Ordinary movement uses `{type:"move",item,x,y}` and removes placement. A completed stage permits advance; later stage objectives and new caches are not revealed prematurely. `finish` records a player's conclusion, but its output separately says whether game completion was actually reached.

`hint` returns possible current partners/settings, never an unknown result catalogue. Explicit mission targets may name what the player must produce. No solution routes or required action counts are provided to fresh players. They can stop at any point; no quota is a fun criterion. CLI play is source-blind by protocol, not a security sandbox.

Each session has `transcript.jsonl` containing exact argv/stdout/stderr/process exit status, including errors. `commands.jsonl` captures structured normal views; `session.json` contains append-only action events, current state and undo history. Init refuses overwrite. Frozen-file hashes are checked on subsequent commands. Debug reset/checkpoint commands exist for engineering, but disqualify a trial as fresh play. Close a trial with stop/finish; closed sessions allow only inspection. Never rewrite raw evidence to turn failed or halted trials into passes.

## UI integration
`model.ts` is pure browser-compatible TypeScript. `createGame`, `applyAction`, `undo`, `resizeGame`, `playerView`, `partners`, `objectiveStates`, `gold`, and `checkpoint` are exported. Result gives `accepted`, `game`, message, created/updated ID, recipe ID, birth origin and retired IDs. The browser should use its normal visible world, not reveal scenario recipes.

Coordinates are CSS pixels local to an area at width320–600; things96×44, required or fitted construction slots add20px each above base26px. Locations106×82. Browser stacks area offsets to retain tangible previous areas. New output is adjacent to the drop target, with minimal overlap fallback; source returns unchanged unless coherently incorporated. Resize preserves horizontal ordering. No general terminal-item disappearance. Gold is recomputed from exact current objectives, never lifetime discovery.

## Evidence and limits
14 engine regression tests pass (`node --test engine/model.test.ts`), covering slot readiness, physical travel, no teleporting old tools, contextual recipes, birth positioning, saves, exact placement gold, current-stage objectives, no duplicates, hints, undo counts and piled-objective rejection. TypeScript noEmit check passes with ESNext/bundler resolution. Wrapper smoke test captured normal init/hint/stop and malformed JSON's stderr+exit1. This is correctness evidence, not human fun evidence.

The conservative carry rule includes any remaining legal recipe use and future objective use; authored route analysis must measure clutter before refining carry. Save validation is structural, not a cryptographic proof of legitimate play. No artificial timer/resource pressure is included. Author route replays prove reachability only and must remain clearly separate from source-blind reactions and human feedback.
