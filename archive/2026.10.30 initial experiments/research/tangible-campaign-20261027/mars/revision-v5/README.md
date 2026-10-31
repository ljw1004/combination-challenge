# Mars v5: lighter machinery, more reasons to go on

## Result, not a completion claim

This executable whole-story draft integrates the reviewed lighter v4 Weather/Relay/Rescue into a20-stage arc. The catalogue has172 recipes. Independently replayed author-informed witnesses are:

|Route|Combinations|Creations|Installations|Peak local tiles|
|---|---:|---:|---:|---:|
|Repair-first|159|136|23|23|
|Tow-first|162|138|24|23|
|Optical-beacon-first|163|140|23|23|
|Broad current-area sweep|168|144|24|24|

The requested200–300-combination target is **not met**. The shorter count is not disguised by counting six placements or20 chapter advances as combinations. No optimality proof, human-fun verdict or fresh-player result is claimed. v4's source was narratively reviewed, not yet validated through the next fresh trial when this draft was authored.

## Design changes

- Preserve the existing successful opening and rescue spine.
- Integrate the v4 ready sensor logger, largely intact weather mast and five-operation relay, including the corrected refuge geography.
- Treat water-treatment skid, guarded machine, scout electronics, microscope, plant safety internals and flight console as ready manufactured mission equipment. Stop rebuilding every subassembly in every cabinet.
- Make greenhouse, camp radio and return capsule retain their identity as their components are fitted. This avoids repeated adjectives masquerading as discoveries.
- Give the oxygen chapter an actual physical downstream output: a serviced ascent oxygen module. It is no longer just a production certificate unrelated to the vehicle.
- Add three modest local projects because the story calls for them: a shared camp workspace/message home, a controlled thermal comparison leading to a cabin screen, and a ground survey of the scout's channel route. These are not enough to replace all removed work, and were not expanded until the counter happened to reach200.
- Keep current-scene-only packing and fixed old places. No stock accounting, invented finite resources or new UI mechanics.

See `BEAT-MAP.md` for each invitation, local operation count, narrative payoff and remaining contradictions/abstractions to challenge.

## Actual checks

`results/verification.json` records schema validation and full replay of the repair, tow, beacon and broad-sweep witnesses on the same unmodified scenario and frozen enginev4. All complete with no manual old-area visits. Every slot installation preserves object identity; packed objects retain their components and source provenance; fixed places stay fixed. The three catalyst actions are independently attempted without the required target setting and rejected, then accepted in ordinary replay at the proper setting.

The thermal comparison has two real catalyst interactions: logger+bare coupon, and logger+wrapped coupon, each in the controlled chamber. The oxygen module servicing uses the qualified depot loading setting. No operational process settings or real survival instructions are provided.

`results/source-manifest.json` hashes the scenario, author source and engine. `goal_route.ts` knows the recipe graph and greedily constructs local goals; it is not a blind player. `probe.ts` performs a broad available-recipe sweep; it is not an exhaustive ordering proof or a typical route.

## Scope and next useful work

1. Independent narrative/authenticity review should challenge the new thermal and route-observation logic and the convenience of the mission stores. The draft deliberately calls these out rather than certifying itself.
2. Preserve current fresh v4 trial isolation. Do not replace live Mars or frozen v4 with this whole campaign before its local changes are evaluated.
3. Length remains41 combinations short on the shortest witnessed route. More genuinely worthwhile episodes or a further act could eventually supply that difference, but no concrete41-step filler has been authored. Review actual player responses before deciding whether to deepen the expedition, add a new scientific discovery arc, or accept shorter chapters across multiple scenarios.
4. One-screen usability is untested. Peak23 tiles is better than the earlier50, but composite heights, arrangement and mobile interaction still matter.
5. Some final vehicle-state changes may be better narrated than combined. If so, reduce the count honestly.

## Reproduce

```sh
python mars/revision-v5/author.py
node --experimental-strip-types mars/revision-v5/goal_route.ts
MARS_FORCE_TOW=1 node --experimental-strip-types mars/revision-v5/goal_route.ts
MARS_FORCE_BEACON=1 node --experimental-strip-types mars/revision-v5/goal_route.ts
node --experimental-strip-types mars/revision-v5/probe.ts
node --experimental-strip-types mars/revision-v5/verify.ts
```

All changes are isolated under `mars/revision-v5/`. Earlier fullv3, reviewed/frozenv4 and originalv2 pilot remain untouched.
