# Current status

Current-scene packing v3 supersedes the carry-population figures below; see [CURRENT-SCENE-PACKING.md](CURRENT-SCENE-PACKING.md). The sections below retain the v2 development record. Frozen pilot v2 is unchanged.

# Mars: A Light That Answers — authored research candidate

## Useful result

The campaign has a coherent, executable 17-stage witness, with **194 successful combinations** on the repair route and **197** on the tow-first route. Those are 164+30 and 166+31 creations+slot installations respectively. Neither reaches the requested 200–300 floor, and neither is a shortest-path proof. The catalogue has 216 recipes; a broad all-available sweep executes 214. We do **not** call the catalogue count the game's length, or the solver's completion evidence of fun.

The strongest new story slice is **Weather → Relay → Rescue**: observe and protect equipment, hear an actual distress message, then recover the crew and give them refuge. `slice-v2.json` freezes those three new chapters after a legally replayed opening checkpoint. No live UI or published game was changed.

## What changed after challenge

- Adjective ladders became persistent Rover, weather station, relay, crawler, scout, oxygen plant and ascent cabin identities with component slots. Required components gate function. Slot installations are counted separately.
- Redundant endgame acceptance/certificate chains and several awkward crew-as-items states were removed. Some final abstract documents/vehicle states still need narrative refinement.
- The contact objective accepts a powered radio or optical beacon; enhancing the radio does not invalidate working-radio capabilities.
- Towing now requires an actual recovery line installed in the rover. Merely having solar power was an authored defect caught during verification.
- A towed crawler can be repaired later at the workshop. Rescue need not wait for that repair. This is a local ordering/approach alternative, **not demonstrated strategic depth**; the later expedition needs the working crawler.
- Explicit scene carry lists leave abandoned optional projects in their original areas. They do not delete finished items or grant old items again. The witness maximum local population fell from 50 to 36; exhaustive closure peaks at 37. This still does not establish mobile screen fit, especially with multi-line composite tiles.
- The relay placement goal requires the working relay capability, not a bare shell. Rescue instructions describe shelter and a meal rather than internal state names.

## Evidence

`results/verification.json` records replay on the unmodified scenario for both rescue branches, catalogue closure, token uniqueness, fixed places, preservation of old tangible items across every travel transition, cache uniqueness, and combination/navigation count separation. All three witnesses complete with zero old-area visits. This shows no mandatory accidental retreat **on these routes**, not every ordering's safety.

`results/goal-route.json`, `tow-route.json` and `closure.json` preserve actions. The goal planner knows recipes and selects short local branches; it is an authoring tool, not a blind player. It does not explore every order or prove optimality. Closure attempts only plausible available pairs and is likewise not human-like play.

Fresh-play source hashes are in `results/slice-v2-manifest.json`. `slice-v1.json` and its earlier manifest remain unchanged as prior evidence. A human or independent agent should use the player CLI only, not read scenario recipes.

## Run

```sh
python mars/author_campaign.py
python mars/compile_scenario.py
node --experimental-strip-types mars/goal_route.ts
MARS_FORCE_TOW=1 node --experimental-strip-types mars/goal_route.ts
node --experimental-strip-types mars/probe.ts
python mars/freeze_slice.py
node --experimental-strip-types mars/test_campaign.ts
```

Fresh slice: `engine/cli.ts init NEW_SESSION mars/slice-v2.json`, then `checkpoint NEW_SESSION weather-start`. Afterwards use view/hint/act. Do not reveal the authored route to the player. Follow `docs/FRESH-PLAY-PROTOCOL.md` at the research root. CLI sessions are outside this worker's owned directory and should be created by the trial coordinator.

## Remaining limitations / next decisions

1. No fresh-player result yet. No human result for this longer content, unlike the successful old short Mars prototype.
2. 194/197 is below target. Do not add six renamed machines or compulsory certificates to hit 200. Develop genuine episodes only after the new slice survives play.
3. The whole campaign still has too many conveniently disassembled systems. Only the first new slice has fully revised cache provenance. Later scenes need more intact artifacts and fewer assembly ladders.
4. The candidate currently uses location operands and placement, but no genuine catalyst recipe. Do not invent a contrived third condition just to tick a grammar box; a meaningful controlled-setting experiment can be introduced later.
5. Initial and outcrop board population still merits review. Explicit carry is authored from future scene inputs with deliberate repair/radio continuity exceptions; arbitrary alternative action orders are not exhaustively tested.
6. The late ascent sequence is fictional restored qualified mission hardware. It is not realistic DIY spacecraft construction or operational survival guidance.
7. The catalogue includes definitions not encountered on each route. Preserve honest observed counts; all definitions are not demanded collectibles.

### Final branch check

The optical-beacon-first route exposed one carry defect: its solar charger is not built during contact, so the raw battery must travel to the Rover chapter. The full candidate now explicitly carries panel+battery through that chapter. Its complete beacon witness has **198 combinations** (168 creations +30 installs), peak36. It replays against the unmodified full candidate. The frozen slice-v2 remains unchanged: its established solar-radio checkpoint is legal and unaffected; do not regenerate frozen pilot files while play is running. This further illustrates why the first two routes were not evidence for every ordering.
