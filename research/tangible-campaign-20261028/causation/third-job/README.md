# Gate property trial — isolated v3 candidate

This appends **one short job and one recipe** to a frozen copy of Quarry v2. It is not a replacement release or a full game.

An earlier rope can hold the raised gate at an overhead ring. Alternatively, sorted gravel fills the earlier basket, which hangs from the pulley. Both leave room for the parcel carriers. Direct rope reuse requires **no new assembly**.

Read `DECISION.md` for the hypothesis, counterargument, preserved rejected designs, and narrow claim. Use `FRESH-PLAYER-ASSIGNMENT.txt` unchanged for the earned third-job checkpoint test.

```sh
python build.py
node --test pilot.test.ts
node evidence.ts
node play.ts sessions/fresh-gate-a.json new       # earned third-job checkpoint
node play.ts sessions/full-example.json new-full # entire candidate, separately labelled
```

The DROP runner records requested gestures and the existing runtime's resolved actions, before/after views, hints, source hashes, baseline, and earned prefix. It adds no engine or UI behavior. Its automatic chapter advance matches the existing logical convention.

## Evidence

- `pilot.json`, `pilot.ts`: new scenario identity; original v2 files remain untouched.
- `third-job-checkpoint.json`: exact earned prefix with both carriers available; no injected items.
- `routes.json`, `route-evidence.json`: ten source-aware full witnesses.
- `prior-terminal-coverage.json`: both solutions from all 22 prior canonical terminal states (44 continuations).
- `pilot.test.ts`, `validation.log`: focused positive and negative tests, including earlier inventory equivalence and part preservation.
- `rejected-direct-prop/`, `rejected-tied-crate/`: rejected content traps, source snapshots and runnable reproductions. Neither changed the engine.
- `manifest.json`: frozen source hashes, excluding changing sessions/logs.

The observable human outcome is shown in the ordinary completion text: the gate stops dropping and carriers pass through with both hands occupied. There is no new gate animation or physics calculation.

No fresh checkpoint or human result is included in author validation. No shared integration, recovered app, Site, remote, or staged-v2 edits. The old v2 source hashes, recipes, stages and lifecycles remain verified; only this separate candidate adds a use capability to the existing rope and clarifies shared supplies.

## Checks passed

- 18 focused tests; ten full route witnesses.
- Both gate solutions from all 22 prior canonical terminal states: 44 continuations.
- Twelve source-aware DROP runner smokes: ten full routes and both earned-checkpoint solutions.
- Strict typecheck.
- Disposable full application build and 129 aggregate tests. The application baseline is the hash-verified earlier v2 compatibility snapshot, **not** the current shared/staged integration. `integration-setup.json` records the fixture-only changes; no runtime or UI was changed.

The normal large-chunk build warning remains. See `VALIDATION.md` for the scope and limits. Nothing in these checks is human enjoyment evidence.
