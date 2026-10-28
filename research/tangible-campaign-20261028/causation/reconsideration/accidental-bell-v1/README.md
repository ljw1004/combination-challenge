# The Riverside Workshop — isolated Accidental Bell v1

Two short scenes: make a washbasin, then reuse **that basin and its earlier shaping mallet** as a mounted call gong. The gust-driven clang is visible next-scene narration, explicitly **not simulated physics**. This is a new probe identity, not a replacement for staged Why This Boat or the previous bucket/quarry/gate probes.

## Reproduce

```sh
python author.py
node --test --test-reporter=tap pilot.test.ts surface-v2.test.mjs engine/model.test.ts
```

- Candidate: `scenario.json`; source-aware witness: `author-route.json`.
- Unchanged runtime/schema/fixture: extracted directly from commit `61a9b4ee8c6235bff07f97eb16d713ec6125c81e`; hashes in `evidence/runtime-provenance.json`.
- `manifest-player-v2.json` freezes the final player, content, assignment and runtime. The neutral portable player packet is `/workspace/shared/riverside-workshop-probe-v2`; use its `play.mjs` only for the independent trial. The original unassigned v1 packet and its seal remain preserved; v2 removes a non-UI internal scenario identifier from the visible projection without changing game data or runtime.
- `PLAYER_TASK-V2.md` gives the final unprimed assignment (copied as `PLAYER_TASK.md` in the v2 player packet). `docs/FOLLOW-UP-AFTER-FIRST-REPORT.md` is **author-only** until the first spontaneous report is preserved.

## Exact scope and count

Minimum **5 DROP gestures**: three combinations (one is fitting the striker) and two placements. The two automatic advances make seven engine actions. No readings, hints, manual Continue or extra polishing step is required. Two objects are newly created: the washbasin and its suspended-gong transformation; fitting the mallet retains the assembly's identity.

A 20-state bounded search confirms this minimum over local item pairs and placements. Geometry-only movement and optional travel are not exhaustively explored; the independent recipe/placement lower bound is also stated in `evidence/minimum-actions.json`. Natural placement-first and reversed-input orders work. This is not a five-action human completion-time claim.

## Verification

55 candidate, player-surface and unchanged runtime tests pass. They cover actual opening, earlier-object continuity, installed parts, no stale duplicates, reversed drops, placement-first recovery, goal gating, save/restore, undo, visible narration, withheld descriptions, no recipe previews, and 320/360/600 logical widths. Strict TypeScript passes. Disposable full application build/content validation is recorded separately; no browser, UI interaction or touch testing is performed.

Two setup failures are retained rather than erased: the first copied runtime-test invocation lacked its fixture; the first standalone TypeScript invocation omitted the explicit Node types flag. Copying the pinned fixture and correcting the invocation resolved them without runtime changes.

## Important limits

The current UI does not display generic item descriptions. Essential incident and hardware facts therefore live in the next scene's **visible mission/cache prose**, not in hidden descriptions, completion text that automatic handoff skips, or fake readings. The adapter omits generic descriptions and allows Read only for authored reading tiles; this candidate has none.

The suspended fixture is the keeper's requested design, not proof that a handheld basin could never summon anyone. Supplying the prepared crossbar/hooks/cord kit avoids a false single-rope suspension or extra hardware crafting chores. Sound, brush washing, wind and the keeper's response are narrated, not calculated.

The philosophical hypothesis is whether the distinction between an incidental useful sound and a deliberately installed call signal becomes salient. A finished route does not establish that. No fresh-player result or human enjoyment claim is included in this package. Do not replace the staged game before independent trial and parent review.
