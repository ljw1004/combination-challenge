# Mars v4 focused revision: get to the voice beyond the ridge

## Useful result

The authored checkpoint episode now completes in **23 combinations**: Weather7 → Relay5 → Rescue11. Repair and tow routes both replay successfully on the same unmodified scenario. They differ in creations/installations (19+4 versus18+5) and peak local tiles (23 versus21). These are author-known witnesses, not blind-player results or evidence that the revision is more fun.

`scenario.json` retains the first four chapters solely for a legal `weather-start` checkpoint. The full replay has61 combinations;38 belong to the earlier checkpoint prefix and must not be presented as new play.

## What the earlier agent actually showed

The fresh v2 agent stopped voluntarily at Relay after completing Weather:20 attempted actions,14 accepted,13 combinations,6 failures,4 hints. It understood mast+vane and valued station→record→route-map. It tried plausible raw logger/temperature/pressure parts against similarly named slots and encountered unexplained rejection. A second large cabinet looked like more of the same assembly before reaching the missing crew.

That does **not** demonstrate that linear or predictable construction is inherently unfun. The human expressly enjoys comfortable clear progress. We address concrete friction and repeated prepare/fit structure, not impose a requirement that every action be a clever choice.

## Changes

- **Weather:** the stored sensor mast already contains calibrated protected sensors. Restore its vane, attach the ready logger and existing power unit, then take a record and compare it with the map. Separately protect the exposed controller with a fitted dust screen. Seven operations retain the successful observation/payoff chain.
- **Relay:** a real, largely intact appliance with one identified fuse fault, a complete antenna and a ready powerpack. Five operations reach the recorded crew message and locate them on the map. We no longer assemble feedline, filters, antenna bracket, regulator and timer one by one.
- **Before-use information:** actual item descriptions explain the ready modules, missing connection, protection need or identified fault before a combination. No generic “Recovered X” descriptions for the new active scene supplies/results. Narrator invitations remain concise, rather than spelling out a walkthrough.
- **Rescue:** repair or tow still leads to warmth, shelter and a hot meal. Two unused cache props (pulley and traction mat) were removed rather than requiring arbitrary uses for them. No new mechanics or resource quantities were added.
- **Packing:** engine v3 current-scene packing moves existing objects with source provenance. Geography and old places remain; this is not a free-floating abstract inventory.

## Evidence and limits

`results/verification.json` records schema validation, legal checkpoint, both authored branches and distinct combination/install counts. `results/goal-route.json` and `tow-route.json` preserve actions. `results/source-manifest.json` hashes scenario and frozen engine v3 implementation used for the test. The v2 pilot and full sourcev3 were not changed.

The next trial should be source-blind and start at `weather-start`. Required-slot labels and generic failed-action feedback remain **engine/UI issues**; this content revision removes the particular prep traps, not the whole interface problem. Freeze the intended revised engine before that trial and record its hashes separately if it differs from v3.

Do not extrapolate23 combinations to a full campaign. Shortening repetitive assembly is intentional; the removed15 operations are not owed replacement padding. Later length should come from genuinely worthwhile scenes.

## Primary grounding

NASA's [MEDA overview](https://science.nasa.gov/resource/meda-is-ready-weather-or-not/) describes an engineered suite measuring wind, temperatures, pressure and other environmental conditions. This supports representing a ready sensor assembly rather than asking the player to manufacture its protected sensing internals. It does **not** describe this fictional station, wind-vane fitting or modular installation sequence. The broader Mars mission abstractions in `../docs/AUTHENTICITY.md` still apply. Observation time is narrated; a record is not obtained instantaneously in reality.

## Reproduce authored verification

```sh
python mars/revision-v4/author.py
node --experimental-strip-types mars/revision-v4/goal_route.ts
MARS_FORCE_TOW=1 node --experimental-strip-types mars/revision-v4/goal_route.ts
node --experimental-strip-types mars/revision-v4/verify.ts
```

Once a fresh trial is frozen, do not rerun the author against changing parent source. Preserve this directory and its scenario hash as the revision under test.

## Pre-trial narrative correction

The first v4 source hash `9c168450398d976688437fc0c1079cbf8492f73051f215a1ba18d52fa6bbcd1a` is preserved with its author script and evidence in `pre-review/`. Independent narrative review found a real contradiction: a refuge described as beside the crawler, with an invitation to shelter the crew before deciding recovery, did not match the required repaired-or-towed crawler dependency.

The final source consistently places the refuge a short way along the recovery route. The recording and map identify both sites; the service stock comes from the crawler/refuge; the invitation says prepare the refuge and bring the crew there by repair or tow. Both arrival recipes explicitly complete that journey. The chapter still uses the same simple local grammar—no walking simulation, extra location, inventory or recovery gate was added. Weather-apron and relay-knoll descriptions are now concrete, and two developer-style recipe qualifications were replaced by in-world prose.

The final hash is `da290dbab0f34793dbee9dc2080c36e8a051c587f2d58abacdba15bc1a921832`, checkpoint **weather-start**. Both23-combination episode routes were replayed again unchanged; source manifest and verification now refer to this final text. Frozen v2 and full v3 remain untouched.
