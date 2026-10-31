# Independent source-aware review: larger world v1

Reviewed `freeze/candidate-v1.ts` (SHA-256 `b1a48e1bd14ba6d4bd81f8b13d01b43a2f6bb21ba8fcf49ee07a3b14c058bb5f`), graph and result files, 2026-10-27. This is source-aware review, not player evidence. No source changed; prior continuation V3 remains untouched.

## Verdict

A materially richer research graph, **not ready to present as a validated long-play game**. There are recognizable, reusable connections between boats, building, growing, expression and observation. The current one-board projection fails the active-item budget. Contextual benches are worth testing but remain an unverified interaction design, not evidence that the failure is repaired.

The 19 chapters do not establish 19 meaningful decision episodes. Reported optimal creation counts are 53 from the four elements and 32 from the authored checkpoint. The 79 result is an optimum subject to richer forced ending choices, not a typical or unconstrained route. None measures human decisions, attempts or enjoyment.

## Evidence independently checked

- Parsed graph: 177 recipes, 152 distinct outputs, 156 concepts. Of the outputs, 49 are terminal and 103 feed another recipe: substantial improvement in reuse over the small continuation.
- Parsed all 300 stored shuffled traces: maximum active count 73. A single creation-to-next-creation interval can include 18 chapter advances. This demonstrates that many invitations can be pre-satisfied, not that players need 19 separate stretches of work.
- Ran an independent greedy legal replay directly against frozen v1: all 152 creations reachable; canonical count 156; final level 18; cellar and shore both revealed; final active count zero; active peak 62. No supplies or places were granted in this replay.
- Checked stored solver metadata: 53/32/79 minima, matching lower bounds and zero gaps. I did not independently rerun the MILP solver.
- Correction to an initial review suspicion: I initially missed the successful-combine shore reveal on a long line. Shore **does** open when travel is created, and the independent legal replay verifies Lighthouse is reachable. This is not an outstanding defect.

## Concrete semantic defects

Direct calls to `hasCapability` return false for all five:

| Existing discovery | Plainly relevant capability omitted |
|---|---|
| Salad | food |
| Oil lamp | light |
| Tent | shelter |
| Dyed cloth | fabric |
| Crate | carrier |

These omissions can reject reasonable early-player shortcuts. Audit all new concepts against old and new capabilities before treating route counts as final. Additional likely candidates include Wind chimes/Whistle as music, farm/garden as growing, and houseboat as shelter/travel. Apply judgment rather than automatically assigning every related tag.

## Goal depth and names

Good: dry crossing, moving bulky objects, wayfinding, correspondence and observation express distinct purposes. Existing accomplishments can satisfy later goals, which correctly preserves player initiative.

Weak: `landing` accepts only Covered landing. Its invitation is essentially that recipe renamed; the mandatory Oil → Oilcloth → Awning → Covered landing chain is unusually narrow. A tented landing or other recognizable cover could be a legitimate alternative, but do not add weak recipes simply to create nominal branching.

The river-work invitation narrows purpose to water machinery while Windmill is tagged `powered-work`, a capability no goal requests. That can be coherent if the river is truly the focus, but it should not imply that wind power was an incorrect invention.

`observe` says “Record” but accepts Windsock and Rain gauge, which observe rather than preserve a record. Change the wording or outcome semantics, not the player's discovery.

“Children library” should read “Children’s library.” “Oil wick” is clearer as “Oil-soaked wick.” “Mill” can mean both millstones and a building in the alternative recipes; use feedback that makes the intended working assembly clear.

The retained Glass + Water → Lens and House + Rope → Swing remain less legible than most new recipes. Flowers + Air → Seeds is storybook pollination, not universal botany. Seeds + Stone → Oil and Ash + Water → Lye are recognizable simplifications; the lye intermediate improves Soap's logic but should never be presented as practical chemistry instructions.

## Proposed contextual bench grammar

**Conditional support:** free natural places, no recipe gating, current-purpose default, automatic known-partner surfacing is much better than asking users to curate an inventory. However, it can become automated curation that still interrupts thought.

Required invariants before claiming success:

1. A visible item stays under the pointer through selection, drag, result birth and cancellation. Partner surfacing must not move the selected tile or target.
2. Birth remains visible long enough to understand; leaving a bench or completing a goal cannot silently hide the just-made result.
3. Selection of an item surfaces every known partner for a novel recipe, including contextual targets and reverse cellar/shore anchoring. It must not expose only the solver's preferred path.
4. No default bench hides every useful known starting point for an unfinished invitation. Test this on unusual discovery orders, not only the shortest route.
5. Deselecting and Undo restore a predictable view. Closing/reopening Purpose must not reset a player's current bench or create repeated rearrangement.
6. Bench switching is navigation, never a repeated transfer action needed to carry ingredients. Objects are reusable everywhere; legal combinations remain legal.
7. The union of local items, goal prerequisites, selected token, all surfaced partners, locations and temporary birth must meet the budget. Measuring the unselected bench alone is insufficient.
8. Avoid future-output spoilers: prerequisite filtering may internally know the graph, but should not display unknown recipe results or present one path as the answer.
9. Visually distinguish a reusable ingredient hidden by context from a terminal discovery safely retired. Otherwise familiar discoveries seem to have been deleted arbitrarily.
10. Already-satisfied chapter transitions should not create a long modal/congratulation click-through. Preserve the success while moving to the next useful invitation.

## Next decision

Fix capability semantics, freeze the revision, and preserve v1 failure evidence. Test contextual projections with adversarial orders and selected-partner expansion, then test actual play before describing benches as a solution. A larger ontology alone is not grounds to deploy a much more complicated interface to the enthusiastic current player.
