# Resonance 1: executable spatial/process slice

**Status:** implemented, mechanically checked and played once by a fresh agent. The player chose quiet closure with no elective continuation. This is a 12-place experiment in places remembering their past, not a demonstrated long game. It contains no authored scenes, characters, inventory, resource stocks, depletion, hidden recipes or frontend work.

## Public interface

Model: `experiments/logical-resonance.ts`. Version `resonance-1`; scenario `shared-garden`.

Exports for the logical registry:

- `createResonance(scenarioId, seed)` → `State`; seed is recorded, mechanics deterministic.
- `stepResonance(state, action)` → immutable next state.
- `observeResonance(state)` → full board, fronts, delayed returns, exact recurrence witnesses, reusable forms, all legal actions and place availability.
- `resonanceRules()`, `resonanceActions(state)`, `resonanceAvailability(state, {item?, a?, b?, at?})`.
- `previewResonance(state, action)` → exact next observation without mutation.
- `resonanceOutcome(state)`, `resonanceKey(state)`, `replayResonance(actions)`.
- `resonanceCycles(state)` → exact current recurrence witnesses, recognized within 24 beats.
- `resonanceQuietChain(polarity)` → first runnable construction chain.

Action shape: `combine` uses `a,b,at`; Earth+Water also uses `ports:[north|east|south|west]`; Air+Fire/Air+Water uses a connected exit `toward`; remembered-form+Memory uses optional `phase` (default 0). `wait` uses `beats` (default 1); `finish` has no other required field. Pair order is symmetric. There are no separate build-output or remote commissioning commands.

Run the model/screen with `node experiments/logical-resonance.ts`. It writes the new `results/logical-resonance-screen.json`. Focused checks: `node --test tests/logical-resonance.test.ts`.

## Concrete situation and laws

```
A1 B1 C1 D1
A2 B2 C2 D2
A3 B3 C3 D3
```

The existing west creation circulates one + front through A1→B1→B2→A2→A1, period four. Its directional scars and one refractory place reflect that continuing motion; it is not an unstarted construction. Its recurring routing/wave form is already a reusable capability.

Initial intention: preserve that rhythm and construct an independent period-six rhythm on the six east places. Finishing there is valid. There is no mandatory coupling checklist, bonus act quota or narrative invitation. This target is deliberately small and probably easy: discovering an entire solution before executing it remains a live failure possibility.

Every combination edits its target, then the whole map advances one simultaneous beat. Waiting is freely repeatable. Pulses follow reciprocal cardinal ports and split at junctions, excluding their ingress edges. Equal arrivals merge; opposite arrivals annihilate. An excited place emits, stays refractory for one following beat, then rests. Excited/refractory destinations reject arrival before collision resolution.

A successful passage replaces a place's scar with the ingress side(s). A same-polarity simultaneous tie stores all sides, so it cannot orient a new directed product. Opposite cancellation preserves the prior scar. A subsequent unique passage resolves ambiguity. Idle time, conductor rebuilding and stone retain scars.

- Earth+Water makes a conductor with chosen on-board ports.
- Earth+Fire makes stone, erasing local excitation/recovery/delayed returns and closing ports.
- Air+Fire / Air+Water injects + / − through a selected connected exit from a resting conducting place.
- Memory+Stone at a uniquely scarred place makes a diode admitting only the recorded side. Existing other ports remain exits.
- Memory+Water at a uniquely scarred place makes an echo. It emits normal exits, then returns a copy toward its recorded side **one beat later**, allowing a predecessor to recover. The scheduled return persists after a later mode change; stone cancels it and disconnected ports block it.

Gates are frozen from the scar at construction. A later scar changes later affordances, not an already built gate. Directed recipes restore their gate port. They apply even to scarred stone: the site's actual past supplies the new orientation.

## First executable chain and a causal next scale

`resonanceQuietChain('-')` sets these six ordinary conductors:

| Place | Ports |
| --- | --- |
| C1 | east, south |
| D1 | south, west |
| D2 | north, south |
| D3 | north, west |
| C3 | north, east |
| C2 | north, south |

Then combine Air+Water at C1 toward east, and freely wait six beats. The two creations now recur with periods four and six. Seven combinations plus one wait batch suffice. A second recurring form has actually been established; it is not a reward unlocked by intervention count. `finish` succeeds immediately.

To couple them, add east to B2's ports and west to C2's. The new shared route lets the two creations reach one another. In the screen's exact twelve-beat continuation, ten of twelve starting phases produce an annihilation; offsets 3 and 8 do not during that interval. This is a bounded mechanical finding, not proof that those phases never collide or that coupling is enjoyable.

A separate tested example creates B3 with a north port, extends B2 south and waits for an actual passage. Previously virgin B3 acquires a north scar. Combining the existing four-place form with Memory there rotates its remembered entry by 180 degrees, extends routing through A3, A2, B2 and B3, and superposes the selected pulse phase. The actual resulting arrivals can create new ambiguous scars. A destination never receives an invented historical scar merely because it is in a remembered footprint.

Recognition requires the current full component state to return exactly, including scars, recovery and delayed returns, with live motion. A forecast that only becomes recurrent after an unplayed transient does not establish a form yet. Recognition is bounded to period 24 in this slice. Known forms are inexhaustible and survive destruction. Planting one preserves local terrain/recovery/history and unions routing, so its remembered period is not promised in a different place. The local unique scar supplies orientation; the entire rotated footprint must fit without stone.

## What the screen establishes and leaves open

Eight focused tests pass; TypeScript checks pass. They cover exact existing recurrence, quiet closure, immutable preview, symmetric discovery, tied scars, cancellation/recovery precedence, frozen diode/echo directions, an effective delayed echo, actual-history form orientation, and phase-dependent interference. The generated screen verifies replay and tries broad expansion, copying the starting form wherever eligible, and directed safeguards after quiet closure.

**The safeguard policy preserves the quiet ending.** That is a real acceptable solution for someone who wants independent creations. The first two broad policies do not establish the initial six-place rhythm in this screen. These observations do not establish a challenging later game. The strongest unsupported hypothesis is that players will voluntarily couple forms and care enough about the resulting interference to compose something else.

The next fresh play must allow closure after the initial intention. Record whether a player actually adopts a coupling/echo/whole-form intention, whether its consequences renew that intention, and whether a remembered place changes role. Stop if their interest ends. If disconnection provides everything they want, or optional coupling merely means knowingly breaking a finished toy, change or discard the design. Do not convert available combinations or recognition diversity into a fun score or a duration claim.

## Actual first play

[fun-resonance-1](../results/logical-players/fun-resonance-1.json) used seven combinations, one wait advancing six beats, then finish. It made no elective construction. The player chose the east ring topology immediately and found most placements routine. It predicted that blank scars would delay recognition and valued seeing a full lap establish history while the original rhythm survived.

The new whole-form capability and history-dependent recipes were not needed for the aim and were not used afterward. No specific coupling experiment was wanted enough to disturb the quiet ending. This falsifies the present optional-coupling invitation for this player; it does not establish that timing, history or process composition cannot support a game. The next design needs an independently valued relationship between processes or a continuing counterpart, rather than more available circuit features. This is AI protocol evidence, with no human duration claim.
