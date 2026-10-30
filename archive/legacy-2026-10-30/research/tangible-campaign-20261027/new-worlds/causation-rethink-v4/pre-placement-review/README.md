# Why This Boat? — ends before construction

## Result

A runnable replacement episode: **2 scenes, 13 combinations, no new engine mechanics**. The player measures the actual load or route, builds an appropriate form with the same material stock and tools, then performs the intended trip. A finished boat or a boat merely parked at its destination does not complete either objective.

`node new-worlds/causation-rethink-v4/validate.ts` passes against **frozen/v4**. Legal route and every resulting player view are in `route-evidence.json`; initial/second-scene text and exact discovery messages are isolated in `pre-use-and-discoveries.json`. Both in-file checkpoints replay. Max visible things on witness: 10; scene 2 starts with 5. No Site/GitHub changes; older freezes untouched.

## What changed

- Removed the four exhibit-card assembly tasks completely.
- The **loaded cart** is present before the wide layout. Measuring its wheels leads to room for the cargo; the builder then assembles, shapes, seals and equips that particular hull.
- A new **rescue through a narrow reed passage** makes repeating the first boat inadequate. Measuring the gap leads to a slim form, despite the same material and skilled operations.
- Place the ferry at its landing and bring the cart aboard; bring the skiff to the reed mouth to make its rescue trip. The trip produces the tangible fulfilled end: cart across / fisher safe. The stranded person is not an inventory ingredient.
- Tool descriptions and discoveries distinguish measuring/thinking from physically making. Plans do not transform wood without work. The player acts as the builder; an adze is not presented as the whole efficient cause.
- The existing v4 packing closure brings only the stock and tools needed now. The ferry remains at its actual landing. No artificial purpose-slot or hidden resource/timer system.

## Philosophical basis and boundaries

[Aristotle, Physics II](https://classics.mit.edu/Aristotle/physics.2.ii.html), especially II.3 and II.9, motivates distinguishing material, organization, source of change and end. The craft analogy here makes the end explain the selection and ordering of means. It does not claim a future event mechanically pushes present timber, nor that nature has human intentions. The jobs and boat specifications are fictional instructional examples, not Aristotle quotations, actual boatbuilding instructions or a historical reconstruction. II.9’s conditional necessity is the useful connection: given an intended result, suitable means are needed; the existence of those means alone does not explain why this artifact was made.

## What is and is not tested

Author-aware checks prove reachability and schema validity, not discovery quality or fun. In addition to the witness:

1. A completed unused boat does not win.
2. Parking the ferry does not deliver the cart.
3. A measured layout cannot perform the crossing.
4. The ferry can legally be fetched from the old area and positioned at the reed mouth, but cannot rescue the fisher. The engine reports its normal generic failure; it does **not** simulate grounding or report a bespoke physical failure.

The comparison of purposes is strongly authored, not an open-ended engineering simulator. Once the correct layout is chosen, building steps are deliberately parallel. A player may still experience two linear crafting chains and learn only “different jobs need different boats.” The fresh trial must determine whether they can explain why the form and work were chosen, rather than simply repeat causal vocabulary from the discovery text.

## Fresh-player protocol (root should freeze and recruit)

Use the normal frozen-v4 player interface with a newly frozen candidate. Do not show this README, recipes or witness. Let a player stop at any point. After play, ask without first naming the four causes:

- Why wasn't a second copy of the first boat enough for the second job?
- Before any wood was cut, what determined the shape you needed? What actually changed the wood?
- Suppose the fisher unexpectedly crossed by another route before you launched. What had the skiff been built for? Would the failed opportunity erase that explanation?

The last question probes an important limitation: realized utility is not identical to final cause. The built artifact can still have an intended end if that end is frustrated. The engine's successful-trip goals do not implement this counterfactual, and the player need not answer with Aristotelian terminology.

## Files

- `causation.json`: executable scenario with checkpoints.
- `build.py`: reproducible content generator (rerun validation afterward to regenerate checkpoints).
- `validate.ts`: v4 legal gesture witness plus semantic-negative assertions.
- `route-evidence.json`: exact actions, outcomes, transitions and player views.
- `pre-use-and-discoveries.json`: actual exposed text, not a proposed script.
- `independent-critique.md`: source-aware independent review; not a blind playtest.
