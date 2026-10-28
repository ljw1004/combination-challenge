# Independent elements discovery audit

## Useful results

- 100 seeded, randomized whole-world playthroughs each reached all 41 recipes and all four purposes. Inputs were reversed randomly; contextual recipes alternated which partner occupied the cellar. No failed progress, duplicate things, source consumption, or source movement occurred. Final allocation is tested for every birth within 28 board units and no coverage of either operand; canonical-route final bounds are disjoint. Crowded exploratory worlds may intentionally overlap unrelated things rather than move old objects or spawn far away.
- Both cellar recipes were separately checked with either operand anchored. Away from the cellar they were unavailable; dragging an anchored operand away onto an unplaced partner did not retain context. Placement did not produce discoveries by itself.
- Preview queries did not mutate state. Checkpoint capability projections matched token capabilities; ordinary replay checkpoints restored round-trip and Undo restored the prior chapter projection.
- Independently reran worker's 10 model/controller tests after malformed-history correction: all passed. Original `history=[{}]` restoration defect is fixed by rejecting malformed snapshots while preserving valid current progress.
- Fixed during audit: original dense-board allocator put seed 20's 33rd discovery, Fruit tart, 53.8145 board units from Fruit. Worker introduced a bounded local search. An initial radius of 24 then caused canonical Basket/Air overlap; the final radius of 28 avoids canonical-route overlap while retaining bounded local birth. Fallback overlap with unrelated things remains an explicit dense-board tradeoff.

## Discoverability assessment (reasoning, not human proof)

Four initial elements yield four immediate pair discoveries; new pair hints can lead from Clay and Stone to Bowl, and from Clay and Fire to Brick. Later chapter conditions are alternative capabilities rather than one forced result. The cellar fermentation branch is optional: flatbread and juice satisfy supper without it. Final travel/shelter/sharing choices remain available, not mutually exclusive locks. Kiln now has an onward use via charcoal. Textile steps (plant fiber + wood → thread; thread + wood → cloth) are storybook abstractions whose physical mechanism is less self-evident, although partner hints support exploration. Glazing without a firing step is also an abstraction. These are design caveats, not empirical claims that a player will enjoy or infer them.

## Source inspection and limits

Rounded thing buttons and hollow location frames are implemented in CSS. Hover/selection exposes participating things/settings rather than result names. Combination preserves source positions and only adds a new result; new-result scrollIntoView is present. Reset clears selection, drag, task-dialog flag, suppression/animation state, and the model, returning to the opening modal. Checkpoints replay legal actions rather than injecting completed inventory. Non-passive item touch handlers prevent default while empty-board touches remain available for panning, with pointer cancellation handling.

Those are source/controller facts only. Native browser launch is known blocked by socket() Operation not permitted; this audit did not retry unsupported launch routes. Real browser geometry, touch arbitration, scrolling, focus, rendered contrast, and actual fresh-player discoverability/fun are NOT verified.

## Reproduce

`node --test tests/elements-discovery-independent-audit.test.ts`

`node --test tests/elements-discovery-model.test.ts tests/elements-discovery-dom.test.ts`

Logs: `independent-audit-tests.txt` (final combined run), `independent-existing-tests.txt` (intermediate author-suite rerun), `independent-typecheck.txt` in this directory. No deployment or publication performed.
