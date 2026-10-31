# A challenge above fully known combinations

This screen follows the owner's explicit design requirement: every legal combination and result may be inspected; the challenge must survive that information. The player must also perform the join rather than select a finished product from a menu. [Design contract](design-contract.md).

**Selection: prototype geometry-sensitive joining first.** It places the consequential decision inside the physical gesture. The cheap models support that selection mechanically; they do not establish that a polyomino puzzle is enjoyable, novel, or a good long-term direction. The strongest concern is that it may become a familiar jigsaw whose only satisfying moment is spotting one fit. Actual browser play must decide whether the combining operation adds something worthwhile.

## Three candidates

### 1. Shared materials, competing useful outcomes

**The hand operation.** The shelf holds finite physical materials. Drag them together to make a tool; the result can be combined again. Hover reveals every available recipe, quantities and consequences. Making Clay, for example, commits Earth and Water that might instead support a Grove or irrigation.

**Concrete decision.** There is one Seed. Combining it with Water makes Reeds, supplying water-management capability; combining it with Earth makes a Grove, supplying cover. With the same stock, a place needing water3/cover2 can be completed after Reeds but not after Grove. A place needing water6/cover1 reverses that: Grove works and Reeds does not. Shared heat and the single Stone prevent simply making every stronger tool afterward. These are explicit resource consequences, not secret recipe knowledge.

**Skill hypothesis.** Plan a small portfolio of constructions, noticing which scarce input has another important use. An optional inefficient opening can leave a longer but possible route rather than a concealed instant loss.

**Small test and kill criterion.** Twelve visible need pairs with exactly the same stock and eleven recipes. Reject or simplify if players mostly follow a required shopping list, repeatedly remake Clay, or lose the bodily sense of combining because inventory arithmetic dominates. The abstract capability numbers in this screen deliberately omit a world simulation; they cannot demonstrate that the outputs matter in an appealing situation.

### 2. Process order: the living vat

**The hand operation.** Combine Grain and Water, then choose immediate heating or Culture followed by a later bake. The vessel changes visibly and the effect of another ingredient is shown before release. Order and conditions, not ingredient-name discovery, determine the output.

**Concrete decision.** Cook a small portion now for someone who needs it early, or culture that same batch for a larger later serving. Another productive preparation might occupy the interval while the first batch develops.

**Skill hypothesis.** Coordinate transformations and recognize a useful intermediate. The same grain/water/heat/culture should favor different orders under an announced early-meal requirement or fading warmth.

**Paper-model rejection.** In the smallest maturation design, a batch becomes ready after another fusion. With only two useful batches, some schedules need an unrelated Steam mix merely to advance the culture; removing that interval leaves a fixed bread prerequisite chain. A compulsory filler combination is not the desired skill. This is a design deduction from the proposed rules, not a simulated or played result. The process direction is parked before implementation. It should return only with an actual choice between productive operations, not a progress bar or waiting ritual justified by the historical theme.

### 3. Form: join a shape that still has room to become something

**The hand operation.** Pick up a small cell-based piece, rotate or move it, and bring an edge into contact with another piece. A ghost shows their exact combined geometry. Release fuses them into a rigid composite that can immediately be picked up as one thing. End contact creates span; a corner or offset creates a different shape. No artificial material-strength formula is needed.

**Concrete decision.** Two joins can each make a shape that fits somewhere inside the visible silhouette. One leaves room for the remaining pieces; the other leaves gaps those pieces cannot fill. With the same pieces and the same joins, changing only the visible silhouette can reverse which join works. That distinction survives complete rule disclosure.

**Skill hypothesis.** Mental rotation and global spatial planning, supported by tangible local experiments. A useful insight can be unique; several cosmetically reordered solutions are not required for the puzzle to be worthwhile. The relevant question is whether seeing and making the join is appealing, understandable, and transferable to a fresh outline.

**Small test and kill criterion.** Three or four pieces, a single visible silhouette and generous Undo. Every edge-adjacent non-overlapping join is legal and fully previewed. Reject if the outline makes every placement obvious, if pointer precision dominates spatial reasoning, or if an exact-fit puzzle makes the combining gesture feel redundant. A failed join must be readable and reversible. Do not introduce timers or a secondary system to rescue an uninteresting fit.

## Executed models and knowledge conditions

Run:

```sh
node experiments/challenge-screen.ts > /tmp/challenge-screen.json
node experiments/challenge-screen.ts --hard > /tmp/challenge-screen-hard.json
```

The program prints complete reproducible JSON, including stock, every goal, normalized first-action outcomes, actual policy traces, concrete context reversals and limitations. It does not import the production engine. All policies have complete rules, supplies and goals. The planner can inspect transitions and solve exact-cover/resource problems; it is a privileged mechanical diagnostic. These are not blind-player results, and the two models are not matched for difficulty.

### Geometry baseline and revision

Every piece is a set of integer cells. Rotations are allowed, reflection is not. A legal fusion joins two rigid components edge-to-edge without overlap. Components and outcomes are canonicalized up to rotation; equivalent component labels and interleavings are not counted as separate opening choices. The diagnostic model bounds shapes to5×5 for finite enumeration. A target must contain exactly all supplied cells.

The baseline stock is two dominoes, one L-triomino and one single cell,8 cells total. Twelve rotation-distinct connected silhouettes were generated by seeded complete assemblies. Generation removed rotational duplicates and bounded the shapes; it did not select cases based on policy outcomes. The denser revision uses two L-triominoes and two dominoes,10 cells total, and generates twelve new silhouettes in the same way. The two sets are **not matched silhouettes**, so this is an exploratory stock/target-space change, not a causal estimate of the effect of two extra cells.

| Diagnostic |8-cell baseline |10-cell revision |
| --- | ---: | ---: |
| Random complete-knowledge policy wins |0/12 |0/12 |
| Immediate geometric-fit policy wins |12/12 |7/12 |
| Exact-cover planner wins |12/12 |12/12 |
| Best one opening, across all contexts |12/12 |7/12 |
| Distinct viable opening shapes per target |7–20 |4–18 |
| Locally fitting but globally doomed openings per target |1–8 |6–24 |

The immediate policy enumerates orientations and prefers the largest joined component that fits somewhere inside the target, without checking placement of the other components. This is more spatial computation than a novice necessarily performs. The planner uses exact cover to place all current components, then fuses adjacent components from that solution. Every run is bounded to three fusions because four components become one.

The baseline's universal opening and saturated immediate policy are evidence against treating it as sufficient challenge. The denser set produces actual locally plausible mistakes, so it is a better diagnostic candidate. Lower greedy success is not a pleasure score, and an oracle win is only a reachability witness.

### A stronger contextual reversal

Both reports include `geometry.globalCompletionReversal`. In their respective `join-1` and `join-2` contexts, two candidate joined shapes **each individually fit both targets**, yet their ability to leave room for the remaining stock reverses. Thus the comparison goes beyond choosing whichever piece visibly matches a boundary.

For the10-cell stock, both alternatives join one L-triomino and one domino into a five-cell composite:

```text
Opening A       Opening B
■ ·             ■ ·
■ ■             ■ ·
■ ·             ■ ■
■ ·             · ■
```

Opening A can be completed in `join-1` and cannot in `join-2`; Opening B has the reverse result. Both have at least one standalone placement in each outline. The remaining L-triomino and domino cause the difference. Exact coordinates and the fixed initial stock are in the report, so this claim can be rechecked without interpreting an AI explanation.

This is a **feasibility reversal**, not a measured preference or an enjoyment judgment. Final winning outlines are necessarily identical to the target; the screen does not call different assembly orders expressive final solutions.

### One actual failure

In denser `join-6`, the greedy policy first fuses both L-triominoes into a six-cell composite that fits the outline locally. The remaining two dominoes cannot cover what is left, so the run is already unrecoverable after that first fusion. The exact-cover policy instead joins an L-triomino and domino into the five-cell Opening A above, then completes the target.

This is useful failure evidence because the rejected move is legal and locally plausible under full information. It must not be presented as a surprise hidden exception. A production interface can preview the actual shape while leaving the global packing inference to the player.

**Recovery limit:** once a rigid component cannot participate in any tiling, further irreversible fusions cannot repair that mistake. Recovery is through Undo, not through a costly forward adaptation. The screen explicitly reports this limitation. A design requiring in-world repair would need a different operation and a separate test; do not quietly claim the current model supplies it.

### Finite allocation comparator

The fixed stock is Earth4, Water3, Heat2, Stone1, Sand1 and Seed1. Eleven recipes expose Clay, Brick, Glass, Steam, Grove, Reeds, Basin, Channel, Levee and two Pump routes. Twelve need pairs vary water/cover demands while stock and recipes stay identical. Every fusion consumes two local instances and creates one; there are no production timers or undisclosed unlocks.

| Policy | Wins | Mean fusions |
| --- | ---: | ---: |
| Random legal |2/12 |6.00 |
| Immediate capability gain |11/12 |4.67 |
| Shortest-path planner |12/12 |4.42 |

All cases have found winning paths, requiring2–6 fusions. Each has2–6 distinct terminal capability/unused-resource signatures among shortest solutions. The broader count of all terminal signatures ranges from3 to95, but includes inefficient preparations and must not be advertised as depth. Recipe-order permutations collapse to the same inventory state. The signature compares actual held capabilities and unused raw materials, not action names.

In10/12 contexts, at least one opening still permits a win but needs more fusions than the shortest route. This is recoverable inefficiency with a consumed-resource cost. Because the model has no turn deadline, the extra fusion alone is not automatically pressure or a meaningful sacrifice.

The `allocation.contextReversal` example is stronger than a different label for an identical route:

- For water3/cover2, using the sole Seed for Reeds works; using it for Grove leaves insufficient shared Heat/Stone to meet both needs.
- For water6/cover1, Grove works with a Pump/Channel portfolio. Reeds spends the sole Seed, leaving cover dependent on Heat needed for that water portfolio; that opening fails.

The simple immediate policy nevertheless wins11/12, and the quantities/capability targets may turn this into a shopping list. A real world consequence is absent. The comparison demonstrates a resource-planning possibility, not evidence that finite stocks should replace the currently convenient shelf.

## Recommendation and the smallest playable test

Keep geometry joining as the next bounded experiment. Start with a recognisable easy silhouette to teach edge contact, rigid composites, rotation and Undo. Then try one outline with a locally plausible but globally incompatible opening. The generated jagged targets are diagnostic cases, not a proposed polished campaign. A2×4 rectangle with the8-cell stock is a reasonable teaching candidate; its simplicity is an advantage for testing the gesture, not proof of depth.

For the first useful comparison, keep stock fixed and use the two contexts from `globalCompletionReversal`. Ask a fresh browser player what future fit a join is expected to preserve, and record the actual joined geometry. Let them Undo freely. Test whether they revise the relative arrangement for the second outline instead of repeating an opening that happened to work earlier.

Keep all legal joins and exact resulting geometry available in preview. Do not supply the exact-cover solution as an automatic green/red survival verdict; that would turn planning back into following an oracle. The model can use exact cover for reachability and diagnostic branch selection while the player uses visible pieces and silhouette.

Inspect three rival explanations: this is a useful spatial insight; it is ordinary jigsaw assembly with redundant fusion; or it is mostly awkward dragging. Each suggests a different next change. If the main challenge becomes precision of lining up cells, improve snapping before claiming greater difficulty. If the only response to a weak puzzle is more pieces, pause and compare the reserve resource/process direction instead.

No human enjoyment finding is produced by this screen. The owner's approval of hover discoverability remains protected; the new surrounding challenge has to earn a separate judgment.
