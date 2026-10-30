# Causation reconsideration — isolated research

**Recommendation:** do not extend the old boat chain yet. Test whether physically reversing what makes one created object fit a job is legible. The internal concept is “A Good Hole”; the neutral player title is **The Workshop Bucket**.

## Read / run

- `RETHINK.md`: source-grounded distinctions, five approaches challenged, selected minimal probe, explicit limits.
- `pilot.json`, `pilot.ts`: compatible candidate data; new identity `causation-good-hole-probe-v1`.
- `PLAYTEST.md`: protocol and cautious interpretation criteria.
- `FRESH-PLAYER-ASSIGNMENT.txt`: exact blind assignment; contains no philosophical hypothesis or expected surprise.
- `play.ts`: player-only logical surface, automatic chapter advance, captured hints/actions/results, setup baseline and source hashes.
- `route.json`, `route-evidence.json`: **author-aware** route, nine engine actions (six combinations, one placement, two automatic advances).
- `pilot.test.ts`, `validation.log`: 18 focused tests.
- `integration-build.log`, `integration-tests.log`: full application compatibility in a disposable `/tmp` copy, not the live/recovered source.

```sh
python build.py
node --test pilot.test.ts
node evidence.ts
node play.ts sessions/fresh-a.json new
```

Each player session creates its state JSON, `.baseline.json`, and `.transcript.jsonl`. Hints and full before/after visible states are logged. Resuming after source changes is rejected. Do not reset a session or edit the candidate during a frozen playtest.

`runtime/` is an exact isolated copy of the recovered fork engine/schema at commit `3d3dbf36c7be473b30e09384f8a279b2fa2d9918`. No new engine/UI rules were added. Existing Why This Boat source and saved-game identity remain untouched.

## Evidence boundary

The probe demonstrates, at the authored-rule level, a real change from water-holding to through-flow properties on the same bucket lineage. It preserves earlier creation dependency, transformations at the same position, tools, intermediate goals, undo and restore.

It is intentionally **linear**. It cannot establish meaningful design choice, Aristotle comprehension, or fun. No source-blind player, human, or browser test has yet run. A successful mechanical route is not an argument for replacing the old game.

No Site edits, pushes, deployment, or publication occurred.

## Compatibility test fixture changes

The disposable copy appends this probe as an extra scenario and its exact route evidence. Its existing lifecycle audit assumes nine active scenarios and 735 recipes. The copy updates those expectations to ten/741 and appends the six explicit lifecycle audit rows; no runtime or UI code changes. Initial aggregate failures for those stale metadata expectations are preserved in `integration-tests-before-*-update.log`. They are not hidden as engine passes.

Strict typechecking of the isolated candidate, runner and tests also passes (`typecheck.log`, empty on success). The source-aware runner smoke in `evidence/` verifies automatic advancement and action/hint/source-baseline recording; it must not be described as a blind player.
