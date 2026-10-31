# Frontier

Frozen public candidate: `frontier-2`, scenario `crossings`. Logical model only. No player has tested this version. Frozen Confluence, Imprints and the live server are unchanged.

## Hypothesis recorded before testing

Reciprocal growth could make a construction's perimeter an evolving problem. Expanding a lineage, preserving a living circuit, and keeping the other lineage present may call for different spatial interventions. Contact should leave a reusable directional catalyst, so an old contested crossing can later become infrastructure. Concepts are inexhaustible; tips and trails are processes, not purchased units. There is no claim that this supplies 180–240 worthwhile decisions.

## Inspectable laws

The board is eleven columns by nine rows. Blue and amber have the same movement, contact, terrain and placement laws. Blue combines two concepts at its trail or an unclaimed cardinal neighbor. Enemy trail must be reached through actual growth.

- `Root | Flame | Shell` + `Straight | Left | Right | Fork` installs a typed path and starts a front. The heading describes its approach. Fork splits left/right, giving up forward continuation. Friendly visits use the place's existing exits and type. A front never immediately reverses over the edge it just used.
- A freely chosen wait advances a world beat. A combination also advances a beat; there is no turn limit. All fronts move in that beat. Root creating a new path on water turns its faculty left; Flame entering water becomes Shell. Stone admits Flame. A front can contact an adjacent hostile trail across stone, but a successful attacker remains at its source until entry is possible. Stone blocks travel, not all attacks.
- Root defeats Shell, Shell defeats Flame, Flame defeats Root. A winner converts the target and installs its arriving faculty. A losing or tied attacking front disappears; its old trail remains. A front with no traversable exit rests instead. Equal same-lineage arrivals coalesce. Cyclic simultaneous opposition halts rather than resolving by actor order.
- Passages retain their headings. Hostile contact also retains both lineages. `Memory + Root` uses those actual remembered headings as continuations. `Memory + Shell` closes those remembered edges in both directions to both lineages. `Memory + Air` reopens them without erasing the past.
- `Earth + Water/Fire/Air` makes water/stone/ground. It leaves ownership, paths, scars and fronts in place. These consequences are all included in previews.

Amber is an active counterpart. It commits a visible next combination before blue acts. Blue combines, the committed amber act executes if still legal, then all fronts advance. Amber then commits again. It remembers the footprint of its first living circuit and prioritizes winning recaptures there; otherwise its public local policy counters its nearest frontier or extends into unclaimed neighboring places. A missing circuit makes an available remembered junction a reconstruction opportunity. Its exact scoring/ties are in `frontierRules()` and its current commitment/remembered footprint are in every observation. No new counterpart is spawned and no story stage advances.

The first invitation is a connected blue construction containing B5, column I or farther, and a living circuit **in that same connected component**. A remote circuit does not count. This is a snapshot criterion, not a promise of security against later actions. Finish is always available, including before achieving the invitation. The player may instead pursue coexistence, conquest, isolation or a self-chosen form. The model has no reward score. Territory/front counts are descriptive; they are not spendable supplies.

## Preplay attacks and iteration

The passive baseline is preserved in `experiments/snapshots/frontier-passive.ts` with `results/logical-frontier-preflight-overwrite.json`. A three-exit fork initially overwhelmed the map. Giving up the forward exit helped, but a stronger terrain-aware fork routine still reached the aim at 14 combinations and eventually removed every amber front. Finite preset opposition was not a credible longer-horizon engine.

Version2 adds the active counterpart and fixes stone's otherwise invulnerable type wall. Its 80-beat screens are model probes, not agent play or enjoyment ratings:

| Policy | First aim | Blue/amber trail places after80 | Blue/amber fronts after80 | First repeated semantic state |
| --- | --- | --- | --- | --- |
| Wait | — | 2 / 97 | 0 / 53 | 48 |
| All Root | — | 10 / 89 | 0 / 32 | 57 |
| All Flame | — | 0 / 99 | 0 / 41 | 57 |
| All Shell | — | 0 / 99 | 0 / 31 | 53 |
| All Fork, choosing local counters | — | 44 / 41 | 65 / 14 | 34 |
| Nearest current counter, terrain-aware | — | 46 / 41 | 19 / 14 | 20 |
| Counter the **announced** next type | 15 | 65 / 26 | 29 / 18 | 64 |
| Stone boundary, then remembered closures | — | 0 / 99 | 0 / 40 | 67 |

These are deliberately simple policies. Single-type policies only build that type. Fork always uses Fork, oriented to reach its target. Current-counter and announced-counter can flatten a local terrain obstacle; the latter considers amber's committed type change. Isolation here is the stated boundary routine, not a proof that every peaceful enclosure is impossible.

The announced-counter result is important negative evidence: a simple informed routine can achieve the first invitation and later repeat a configuration. An active counterpart creates continuing consequences but does **not** establish changing strategy, attachment, voluntary continuation or a long game. Public-only players must determine whether constructing and retaining a chosen form supplies a purpose beyond repeated local counters. Do not count repeated beats as fresh decisions.

## Executed reachability and integrity

`results/logical-frontier-goal-witness.json` saves the complete legal six-combination witness and resulting state. Both lineages remain active: blue44/amber39 places and blue23/amber16 fronts. The sequence was found by a deterministic one-step forecast search favoring connected eastern reach; it is reachability evidence, not a player report.

1. Root + Straight at C4 toward E.
2. Flame + Fork at E4 toward E.
3. Flame + Straight at F4 toward E.
4. Shell + Straight at G5 toward E.
5. Flame + Straight at G5 toward E.
6. Flame + Straight at G5 toward E.

The repeated G5 combination starts a fresh front after the previous one has moved/contacted. An exactly identical live faculty already present is rejected; wait advances it without reconstruction.

`verifyFrontier()` checked all862 initially legal actions for input preservation and exact cell/history/front/counterpart forecasts; deterministic replay; the six-combination aim; blocked-rest versus equal-contact disappearance; water's Root turn; contact across stone; rejection of a two-cell reversal as a circuit; rejection of a disconnected remote circuit; and distinct Memory fork/barrier outcomes on the actual G5 contact scar. TypeScript passed.

## Integration

Suggested registry ID: `frontier`.

- `FRONTIER_VERSION`, `FRONTIER_SCENARIOS`; types `State`, `Action`.
- `createFrontier(scenario='crossings', seed=0)`; the current seed does not vary the map.
- `observeFrontier(state, full=false)`; concise grid/terrain/trail tuples, current fronts, changes, availability and counterpart commitment. Full mode exposes expanded cells and events.
- `stepFrontier(state, action)`, `previewFrontier(state, action)`, `statusFrontier(state)`.
- `frontierActions(state)` is complete and finite. `compatibleFrontierPlaces(state,a,b)` returns exact legal placements/headings, suitable for future item/place highlighting. `frontierRules()` exposes all laws and the counterpart program.
- `frontierOutcome(state)` has terminal/goal, circuits and named dimensions with their directions. Only `homeCircuitEasternReach` is the joint initial objective; all population/territory counts are descriptive. `frontierKey(state)` excludes logs and time, but retains the counterpart's actual memory and commitment.
- `replayFrontier(actions)`, `screenFrontier()`, `verifyFrontier()`.

Actions use lowercase concept names, for example `{"type":"combine","a":"root","b":"left","at":"C4","toward":"E"}`, `{"type":"wait"}` or `{"type":"finish"}`. Status is `playing` or `ended`; finish is the only terminal action. Losing all blue trail prevents further placement but leaves observation/wait/finish available.

No UI work, authored dialogue, finite stocks, quotas, hidden recipes, compulsory upkeep or minimum-turn gate was added.
