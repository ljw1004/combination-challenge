# Named Mars: Rover slots and initial supplies

Current contract, 27 October 2026. This revision supersedes the sparse-start, recoil, exact-kind-goal and atomic-Rover sections of the earlier `mars-named-contract.md` and `mars-named-implementation.md`. Those documents and their earlier evidence remain historical records, not claims about this source. Old routes, hosting configuration and entrypoints are unchanged.

## Current interaction

- All 18 stranded raw supplies are physically present initially. Objectives reveal locations, never grant items. One continuous board retains earlier things and places.
- Ordinary A+B produces nearby loose C while surviving A and B remain exactly at their original positions, including placements. Broken radio is explicitly retired by repair; unrelated ingredients are not cleaned up. Plain movement ends at the released position, subject to board bounds, without a replay animation.
- One stable named Rover is built with frame+motor. Cart+motor is an alternative with wheels already installed. Required Wheels and Solar charger slots appear empty; optional Radio appears only after installation. It is not a cumulative-location assembly.
- Direct installation fills a compatible slot in either gesture direction. A component remains outside if a real future use remains; otherwise it moves inside. Remaining uses are unmade authored unique recipe outputs, current or future exact placement goals, undiscovered exact discovery goals, and missing compatible Rover slots. The newly filled slot does not itself justify keeping a copy. Wheels therefore stay outside if Cart is unmade, but are absorbed if Cart already exists. No unrelated outside wheels are removed by the Cart+motor alternative.
- An absorbed kind still exists inside the Rover: it cannot be recreated or advertised as a novel output. Filled slots and globally existing outputs reject duplicates.

## Functional goals

Placement goals use explicit capabilities, not names or automatic recipe-ancestry inheritance. Heated greenhouse/propagator retain their growing functions, lit workbench retains workbench, and long-range radio retains powered-radio communication.

Rover travel requires wheels **and** charger. Installed radio provides working-radio; radio **and** charger provide the contact goal's powered-radio function, independently of wheels. No dish range is inferred. UI distinguishes drive readiness from communication. Removing an object from its goal location changes current truth while preserving historical achievement.

## Geometry, saves and evidence

Ordinary cards occupy 10×6 board units. Rover occupies 20×24, expanding to 20×30 with Radio. Renderer, allocation and occupied-location bounds share these dimensions. New output allocation can reflow obstructing loose neighbours, never surviving operands. A newly revealed location may shift once to avoid a pinned operand; that position persists across save/undo. Existing revealed locations remain fixed.

The save key remains `mars-named-portable-v1`; state schema is `mars-named-slots-2`. Legacy Rover variants consolidate into one Rover with only evidenced installed parts, preferring canyon placement. Explicit empty slots remain empty. State and undo snapshots migrate; only missing raw starting supplies are added, never completed outputs. Expanded legacy Rover clears obstructing loose neighbours without resetting progress.

Current runtime: 40 named concepts, 25 binary recipes plus typed slot installations, nine objectives. This checkpoint does not claim a measured duration, player study or native-browser validation. Node model and synthetic DOM tests are not native input/layout evidence.

The exact source parity manifest and Site build/full-test logs are produced by the final sync under `results/mars-rover-site-final-*`. The immutable game-checkout verification passed 625 aggregate tests, then 63 focused named/DOM/independent tests including the reviewer's complete 16-test supplement. Site verification must independently finish before publication.
