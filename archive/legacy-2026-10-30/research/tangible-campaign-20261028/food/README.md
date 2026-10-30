# From Hearth to Snack Cake — long-journey candidate

**Standalone candidate, not a deployment.** The original four-scene food starter and nine-recipe saucepan pilot are untouched. New save identity: `hearth-to-twinkie-v1`.

A kitchen caravan feeds travellers, harvest workers, rain-stranded guests, a crowded market and departing train passengers. Twenty connected chapters end at **Twinkie** after **185 combinations** on the goal route. The catalogue has **197 recipes**, including 12 optional discoveries. Counts exclude placements and automatic chapter transitions.

## What to read

- `scenario.json` — executable declarative campaign, latest lifecycle/schema grammar.
- `author.py` — deterministic authoring source.
- `dependency-plan.json`, `dependency-graph.json`, `docs/CHAPTER-MAP.md` — complete dependencies, imports, caches and chapter map.
- `docs/SOURCES-AND-LIMITS.md` — historical/technical evidence, reconstructed combinations and safety boundaries.
- `docs/CRITICAL-REVIEW.md` — strengths, revisions and unresolved design risks.
- `pilots/` and `pilot-player.ts` — bounded uncoached-pilot preparation; no fresh human trial claimed.
- `evidence/verification.json` — exact source-aware route, position, retention, undo/restore and checkpoint results.
- `evidence/lifecycle-audit-rows.json` — explicit audit rows for integration.

## Verified on the final candidate

- **94/94** focused and copied-engine tests pass.
- **15/15** full route-width replays pass: canonical, all-recipes, reverse-ready order, reversed input directions and adversarial early discovery, each at 320/360/600 logical widths.
- **21 checkpoints** are exact canonical prefixes, tested at all three widths.
- **19/19 later chapters** receive and use actual required earlier-created preparations.
- All 197 recipes are exercised; 1,062 actual replacement-position checks and 4,011 retain-input checks pass across the replay set.
- 6,966 undo/restore checks pass. These are mechanical assertions, not player decisions or enjoyment scores.
- The early-discovery route creates five future preparations early, using four real visit/carry actions to fetch retained milk or sugar where needed. They are recollected rather than stranded or respawned.
- Canonical/exhaustive arrival load: at most 11 items; peak scene load: 19. The adversarial route reaches 12 on arrival and 20 in a scene. These are logical token counts, **not browser/touch readability evidence**.
- Three actual CLI pilot smoke routes complete, explicitly marked **source-aware author**, not fresh participants.
- Strict TypeScript checking passes.
- A disposable full-repository fixture containing the existing campaigns plus this candidate passes `npm run build` and **127/127** root tangible tests. Its lifecycle audit is extended rather than bypassed. Vite retains a bundle-size warning; this is not final multi-candidate integration or publication.

The frozen runtime matches the recovered working-tree snapshot recorded in `evidence/runtime-provenance.json`, including the parent's additive reading-card extension. Food uses no reading cards. This task changes no engine semantics.

## Reproduce

Node 24; no install needed for these commands:

```sh
python author.py
node --test campaign.test.ts engine/model.test.ts
node verify.ts
node pilot-player.ts init NEW_SESSION pastry-supper
```

Other pilot segments: `cake-travel`, `orchard-inn`. Give a fresh participant only `pilots/PLAYER-INSTRUCTIONS.txt` and the player surface, not this README, the graph or routes. `smoke-pilots.py` preserves its named author sessions and refuses to overwrite them; choose new names for another run.

## Design boundaries

- One continuous narrative; a parallel paper-research storyline would dilute the culinary connections.
- Binary tangible preparations, sparse real workstations, current-scene carry and explicit input lifecycles. The injector gains a visible creme slot instead of becoming an unrelated replacement tool.
- Earlier creations do real work; caches supply named local materials/tools, never missing authored outputs. Scene carry also recollects that scene's own outputs if a player discovered them early through globally available recipes.
- No universal chronology, inevitable progress ladder, valid humoral-health claim, preservation instructions, commercial recipe reproduction or shelf-life guarantee.
- No human fun validation, browser/touch review, Site write, remote commit, push or deployment.

The long dessert sequence and repeated ovens still need critical playtesting. Three useful preparations for later customers—fruit syrup, pouring custard and sifted flour—are independent final requests. They do not gate unrelated local dishes. The earlier gated version is preserved under `revisions/pre-export-goal-fix/`. Do not replace the short starter solely because this candidate is solvable.
