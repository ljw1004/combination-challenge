# Living Atlas: five goals, one known ontology

**Status:** frozen for play after 12 focused tests, 2,874 forecasts and TypeScript validation; bounded logical consolidation, version `living-atlas-1`; no new recipes, causal physics, map layouts or narrative. No UI changes. Existing Living Works V1/V2/V3 sources and their player captures remain frozen.

## Why this step

The owner's revised direction permits substantial shared combinations and different explicit level goals, rather than requiring every level to invent its own indefinite purpose. The preceding three-goal and two goal/input variations are now one playable campaign. This tests continuity, goal-directed reuse and optional selection without expanding the ontology again. It does not by itself establish enjoyment, elective appetite, a large final catalogue, or human play duration.

The comparison between completing an assigned order and freely choosing further offered goals belongs to the play protocol, **not** to different game rules. There is one scenario, `open`.

## Public campaign laws

1. **One shared knowledge set.** Start with Earth, Water, Air, Heat, Seed and Memory. All 24 concepts, 18 recipes and their conditions are inspectable. Physically combine known inputs, optionally at an actual place. Concepts remain inexhaustible. A known concept learned anywhere becomes usable on any selected board without reconstructing its prerequisite chain.
2. **Five immediately available goals.** Crossing is initially selected. `select-level` can choose crossing, ordinary alternation, publication, slow alternation or intermittent publication at any time. No completion gate or prerequisite order. Selecting is navigation, not a combination or beat.
3. **Separate retained places.** Each board begins in its existing provided initial state. Knowledge transfers; cells, routes, records, controllers and water do not. Inactive boards are fully paused, including source phase. Revisit the same retained arrangement, now able to use any concepts learned elsewhere. Known Loop does not supply another board's physical return route.
4. **Unchanged action and goal physics.** Combine advances one selected-world beat. Wait records 1–24 actual selected-world beats. Sources, roots, recording, routing and controllers use the unchanged V1 engine; V2 supplies its slow-cycle predicate and V3 its declared intermittent inputs/full-cycle predicate. Every actual beat is checked, including inside a batched wait.
5. **Achievement is not a lock or obligation.** First satisfaction creates an immutable certificate. Later edits may make the current predicate false without erasing the earlier achievement. Goal cards show both. Finish is valid before any goal, after a chosen subset, or after all five; no special failure state is imposed on a satisfied shorter visit.

### The five exact scopes

| Board | Goal scope |
|---|---|
| Crossing | Current unflooded A2↔E2 walk, while both rivers water rooted living B3/D3. |
| Ordinary alternation | An actual exact repeated physical-state cycle waters rooted living C2/C4 in nonoverlapping wet phases; neither grove floods. |
| Publication | Current A-only record at B1, B-only at D1, A+B fragments/no exact identity at C2, and an unflooded A2↔E2 walk. This is not an all-history exclusion invariant. |
| Slow alternation | Ordinary cycle requirements, plus **every cyclic wet run and every cyclic dry run** of each grove lasts at least three beats. No named route or recipe requirement. |
| Intermittent publication | A2 schedule `[2,2,0,0]`, E2 `[0,0,2,2]`. Every phase of an exact repeated physical cycle retains separate originals, continuously supplies combined A+B fragments/no exact identity at C2, and maintains the walk. Construction transients are not failures. |

A full physical state includes cells, fields, resolved outlets, controllers, records, roots and source phases. Existing cycle detection retains at most 256 preceding states; a longer unobserved period remains unverified. Crossing/publication keep their original instantaneous predicates: Atlas does not silently strengthen them into invariants. No global dry-world requirement is added.

## State and API

Module: `experiments/logical-living-atlas.ts`; focused tests: `tests/logical-living-atlas.test.ts`.

- `LIVING_ATLAS_VERSION`, `LIVING_ATLAS_SCENARIOS=['open']`, `LIVING_ATLAS_LEVELS`.
- `createLivingAtlas(scenario='open', seed=0)`; `stepLivingAtlas`, `observeLivingAtlas`, `previewLivingAtlas`, `statusLivingAtlas`.
- `livingAtlasActions`, `livingAtlasRules`, `livingAtlasOutcome`, `livingAtlasKey`, `livingAtlasGoal`.
- `replayLivingAtlas`, author-only `livingAtlasWitness`, `screenLivingAtlas`.
- Action: existing `combine`/`wait` fields, `{type:'select-level',level:<one of the five IDs>}`, or `{type:'finish'}`. `next` is not accepted.

The outer state stores one global `known`, an active level ID, five independent inner worlds, a command log and each board's first-entry knowledge/visit metadata. Knowledge is copied into the selected inner state on entry; an inactive stored inner copy can lag behind global knowledge, but its physical state does not change. Known-on-first-entry remains historical rather than being overwritten on revisit.

`observe.goal` is the **selected current goal**, not campaign completion. `goalCards` expose all five goals and separate `currentlyAchieved`/`completedEver`. `campaign` distinguishes all-five-ever from all-five-current. `outcome.goal` and its five objective values measure five goals completed-ever, for assigned-five verification; false is not an invalid finish or a judgment on a voluntary subset. No method preference or prior player finding appears in onboarding.

Each stored first certificate records outer command number (one-based), beat within that command (one-based), local tick, total played beats, known concepts, exact physical state and actual goal evidence. Public cards display compact stamps (command/beat, tick, goal, cycle period and physical-state SHA-256), while the exact full certificate stays in the saved state. The selected board still exposes its actual goal/cycle evidence. This avoids repeating five full physical states and old cycle proofs on every view. A certificate can therefore be reconstructed at the precise point within a batched wait. World edits never rewrite it. Inner wait bookkeeping is restored to the original single command after beat-by-beat sampling; the entire inner state still deep-equals its unchanged engine's batched transition.

### Initializer limitation, explicit

V1's board setup is private. Its untouched ordinary alternation board is obtained through the already frozen V2 initializer, which internally discards a temporary tutorial and returns a clean tick-0 board with no actions, works or controller. Atlas retains **only that provided untouched board**, not the tutorial's arrangement or completion. Tests compare all five initial physical states directly to their existing initializers. Duplicating or exposing frozen setup code was unnecessary.

## Mechanical evidence — not player evidence

Run:

```sh
node --test tests/logical-living-atlas.test.ts
node experiments/logical-living-atlas.ts
npx tsc --noEmit
```

`results/logical-living-atlas-screen.json` contains exact legal author witnesses in offered and reversed order. Both start from six primitives, complete all five goals and replay exactly. They use 37 and 38 combines respectively, six wait commands totaling 86 waited beats, and four/five level selections. They end with 21 known concepts; this is not a claim that every one of the 24 must be used. Broadcast and genuine recirculation remain accepted intermittent-publication answers.

The first certificates occur before the endpoints of several waits: ordinary and slow alternation are certified on beat eight of their settling waits; intermittent publication on beat five. Replaying only to those beats reproduces the exact physical state and predicate, with every preceding beat still false.

Focused checks cover:

- source-hash guards for all three frozen imports;
- exact provided initial states, no inherited works, all five cards and immediate unrestricted selection;
- persistent knowledge versus no transferred physical construction;
- first-entry knowledge, paused inactive fields/records/works/cycles/source phases and intact revisits;
- current satisfaction becoming false after a destructive edit while its first certificate remains immutable;
- every physical action matching the unchanged delegated engine, including batched waits;
- all five goals in both orders, exact replays, and **2,874** input-preserving exact legal forecasts;
- valid early/subset finish and neutral public onboarding.

These checks establish the consolidation contract. Fresh play must still establish which constructions a player actually wants to make, what carries usefully between goals, which execution feels routine, and whether an offered next goal is adopted. World persistence is available; elective return has not been demonstrated merely by storing boards.

## Freeze record

Atlas source SHA-256: `8af85e4d84e79a223939b37e2bdada54fa629da2cf864389b75211890f79a5b4`. Focused verification and unchanged V1/V2/V3 hashes: `results/logical-living-atlas-verification.txt`. The final public all-complete observation is 22,704 bytes rather than 142,831 bytes with repeated full certificates; exact archived evidence remains in state. No gameplay condition was hidden.
