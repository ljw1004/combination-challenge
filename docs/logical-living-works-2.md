# Living Works 2 — a different temporal goal, unchanged ontology

**Frozen:** `living-works-2`, scenario `slow`. New [wrapper module](../experiments/logical-living-works-2.ts), [eight focused tests](../tests/logical-living-works-2.test.ts), [mechanical witnesses](../results/logical-living-works-2-screen.json), and [verification output](../results/logical-living-works-2-verification.txt). [Prospective player protocol](living-works-2-play-protocol.md).

V2 source SHA256 at freeze: `a3da674164943462dd01431fba6655a632afe43dbe66343978a2db4a0a6f4696`.

## Why this goal was selected

This is **author/research context, not public player onboarding**.

All three completed V1 players found a compact direct-sensing valve construction with a full period-four physical cycle and two-beat wet/dry phases:

- [Sequence](../results/logical-players/fun-living-sequence-1.json): 15 combinations across all three levels; reused the Valve later as a steady source-controlled router in publication.
- [Prebuilt](../results/logical-players/fun-living-prebuilt-1.json): 10 combinations; all designs already available, but the actual worlds still had to be constructed.
- [Reverse](../results/logical-players/fun-living-reverse-1.json): 17 combinations; record/fragment ordering and timing supplied different work, then the final crossing was mostly transfer.

These are successful V1 solutions, not defects. Their unused Loop/Delay/Feedback branches remain **untested in those plays**, not invalid. Reports also identify prerequisite-only execution as routine once a desired method had been selected. None of this warrants making every recipe compulsory or forcing a larger construction for its own sake.

The next bounded question is whether a **different explicit goal in the identical ontology** calls for a useful extension of what the player knows. It does not test a qualitatively new ontology, indefinite self-renewal or 30–40-minute play.

## Exactly what changes

One board, all **24 existing concepts known**, with the same material, port, source, record, controller, propagation and full-cycle laws as V1's alternation board.

New goal, entirely public:

> Throughout the exact repeating physical cycle, each rooted living grove must have every uninterrupted wet phase and every uninterrupted dry phase last at least three beats. Never water both simultaneously or flood either.

Matching first and last displayed runs join across the circular boundary. Both wet and dry phases must exist for each grove: an indefinitely wet or dry grove cannot satisfy the requirement.

This is a level's **phase-duration construction requirement**, not a new plant-health simulation, resource allowance, timer, number-of-actions minimum or mandatory recipe. There is no “use Loop” condition. Any legal arrangement that produces the required physical cycle is accepted, including one built from individual components.

## Exactly what does not change

V2 imports the frozen [V1 engine](../experiments/logical-living-works.ts) without modifying it. Its SHA256 remains `8647032f9697c901b11302223cc327a370596be3fc6695ec7b74d84bbd83d6d2`, checked by a regression. Old observations, semantic rules and captures are untouched.

The wrapper obtains the ordinary V1 alternation initialization through its standard board transition, then removes the tutorial bookkeeping **before the new session starts**. The public start has no player actions, completed levels, constructed work or controller. All 24 designs are known. The discarded constructor steps are not presented or counted as participant play.

Each subsequent wrapper action delegates to the unchanged engine. A step-by-step regression compares the complete inner state against direct V1 execution throughout the positive witness, establishing identical causal behavior. Only the outer goal, version/single-board metadata and public instructions differ. There is no `next` action on this single board; `finish` remains valid even without success.

## Executed positive and negative witnesses

These are privileged author tests, not evidence about player experience.

| Actual construction | Full period | Each grove's cyclic wet/dry runs | V1 goal | V2 goal |
| --- | ---: | --- | --- | --- |
| Direct C3 valve sensing C2 | 4 beats | 2 wet / 2 dry | Pass | **Fail** |
| Real closed route opened into Delay, composed with Valve | 8 beats | 4 wet / 4 dry | Pass | **Pass** |
| Individual Valve plus two Channel placements | 8 beats | 4 wet / 4 dry | Pass | **Pass** |

The whole-route witness uses C3→C2→D2→D3. Water traverses the retained path before its actual D3 float changes C3's chosen outlet. The manual witness creates that physical arrangement without any Loop/Delay work descriptor. This is direct evidence that the goal is about a temporal result, not a permission token.

Every witnessed period returns to the identical full physical state after another complete period. Cutting D2's output invalidates the proof and fails the new goal. Run-length tests rotate the displayed cycle boundary and preserve the correct four/four durations; an exact three/three synthetic run also meets the duration threshold, while a constant phase lacks its required counterpart.

## Availability-matched transfer test

The prospective protocol assigns the same single-board task and the same all-24-known availability to:

1. The experienced player from the previous sequence condition.
2. A fresh player with no previous model, source, session or witness exposure.

The experienced player may use their own prior knowledge and public notes. The fresh player sees only public rules/state. This is not an uninterrupted campaign, an elective continuation claim or a controlled human-learning experiment. Prior CLI familiarity and rule knowledge remain part of the experience difference; matching available concepts does not remove them.

Public onboarding contains the goal and every actual law, **not** other players' constructions, the period-four result, or a suggested longer return path. A pre-freeze review caught those research explanations in the first wrapper draft; they were removed and a regression now guards the public output. Research rationale lives only in this document and the protocol.

Inspect what the player actually predicts, builds, revises and reports. A longer route may be an interesting new inference, familiar but valued transfer, or merely routine parameter adjustment. Those are different outcomes. Do not demand a new paradigm to justify a finite goal variation, and do not infer one from an increased period or command count.

## Verification at freeze

- **8/8 focused tests passed.**
- **3,618 legal forecasts across three states** matched exact public post-observations; inputs were unchanged.
- Every positive/negative witness replayed exactly, including one additional full-period physical replay.
- V1's file hash is unchanged; wrapped and direct V1 execution are identical on the witness actions.
- Cyclic first/last-run joining, missing wet/dry counterparts, route-edit invalidation and valid early finish are tested.
- Public onboarding excludes prior-session results and preferred constructions.
- TypeScript passed. Project-wide validation belongs to the parent; the focused checks are not relabeled a full-suite result.

```sh
node experiments/logical-living-works-2.ts
node --test tests/logical-living-works-2.test.ts
```

Exports: `LIVING2_VERSION`, `LIVING2_SCENARIOS`, `createLiving2`, `observeLiving2`, `stepLiving2`, `previewLiving2`, `living2Actions`, `living2Rules`, `living2Outcome`, `living2Key`, `statusLiving2`, `replayLiving2`; diagnostic helpers expose the cyclic-run calculation, goal and mechanical witnesses.

**Decision after play:** whether this changed goal produced useful construction/transfer under the same ontology, and what was inference versus execution. The answer may justify this small level, a revision, or no further enlargement. It does not establish a long game or human enjoyment.
