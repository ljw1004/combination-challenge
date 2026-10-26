# Fresh-player protocol

This is the reusable instruction template used for the actual sessions, with scenario/rules/ID/order/annotation fields varied. Agent instructions provide isolation; the filesystem is shared and access is not technically blocked. All actual players reported staying in the interface. One requested command syntax, ran the CLI without arguments, and incidentally received a usage-source line; no gameplay implementation was intentionally read. The CLI now has explicit usage and sanitized errors.

> You are a fresh blind game player. Use only `node experiments/play.ts ...` via the command tool in this workspace. Do not read source, documents, directory listings, other replays, hidden recipes or future evaluator results. Do not branch or simulate multiple future decisions. You may inspect the current public forecast, effects and all legal recipes, and use a one-turn preview available in the browser. Parse the current command's JSON output for brevity if needed; do not read files directly.
>
> Initialize `node experiments/play.ts init SESSION SCENARIO SEED RULES annotated normal`. Play to the actual terminal state, one action per call, reading the world response before choosing again. Use `node experiments/play.ts act SESSION 'JSON_ACTION' 'JSON_ANNOTATION'`. The annotation is a brief immediate objective, expected effect, expectedDamage[north,middle] and confidence0..1; it is not a request for private extended reasoning. Predict without using a preview for at least half your actions. The action-only condition omits annotations. Reverse condition uses `reverse` at initialization.
>
> Goal: keep both assets standing until the finite storm passes. Read the displayed rules. Known concepts remain available permanently. Your game budget is the scenario's horizon. At the end, report a specific worthwhile choice, confusion or surprise, repeated work, and what you might try next. Include the session ID and any isolation deviations. Your report is AI evidence, not evidence of human enjoyment.

Command example (syntax only):

```sh
node experiments/play.ts init my-session headwaters 1 rooted annotated normal
node experiments/play.ts view my-session
node experiments/play.ts preview my-session '{"type":"discover","recipe":"grow-reeds","at":{"row":0,"col":0}}'
node experiments/play.ts act my-session '{"type":"discover","recipe":"grow-reeds","at":{"row":0,"col":0}}' '{"objective":"Protect this bank","expectedDamage":[0,0],"confidence":0.7}'
```

Actions use zero-based `{row,col}`. Omitting `at` discovers without placing; separate rules always require that. `view --actions` displays indexed actions if desired; indexes change each turn. All available novel recipes are shown; there is no curated offer restriction or hidden output. Ingredient concepts cannot be deployed directly.

The final interface additionally offers `finish SESSION` when the whole remaining public forecast causes zero damage. It records every actual pulse as automatic forecast input. Historical blind sessions predate testing that control. Arbitrary branching is supported for evaluators, not allowed during a fresh-player run.

Exposure matters. A follow-up agent retaining its earlier game is an **experienced** condition. Supply the optional seventh initialization argument, such as `experienced-after-my-session`, and describe the prior run. The trained cloudburst record's metadata was corrected after the audit because the original initialization template had labeled every agent fresh. The underlying actions, hashes and observations were unchanged.

Actual model: inherited `gpt-6.1-sol`; six fresh agents and one follow-up session, all from the same model family. This is a highly correlated diagnostic sample. Four field conditions cross annotations yes/no with offer order normal/reverse at the same public scenario and seed. The transfer comparison contains one fresh and one experienced run only; it cannot establish a transfer advantage.
