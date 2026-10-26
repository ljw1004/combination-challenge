# Creating a world with inexhaustible powers

These are two small mechanical probes above inspectable combinations. They follow the owner's rejection of finite supplies, depletion, stockpiling and resource management. Neither contains an inventory budget, production quantity, replenishment timer or score meter. A discovered concept is an inexhaustible capability. The world can have positions, motion and qualitative states without those becoming stocks to manage.

**Scope changed during the experiment.** The newer proposed substrate has one instance of each concept on a unified board; parents remain when a new child appears, and completed pairs should not encourage repetition. The probes below predate that proposal. Their successful paths require repeated transformations, and the sky probe explicitly creates two Suns. They **do not validate the newer substrate**. Keep the causal evidence as a separate experiment; do not silently translate it into support for a different game.

The result is mixed: the sky probe contains a reproducible contextual choice without resource scarcity; the intentions probe has a common winning sequence and is rejected in its current slice. Neither has been played in a browser or judged enjoyable by a person.

Run the complete screen:

```sh
node experiments/god-world-screen.ts > /tmp/god-world-screen.json
```

The [source](../experiments/god-world-screen.ts) prints original rules, every initial state, sampled legal powers, successful witnesses, policy traces, counterfactuals, terminal failures and limitations. It writes no files itself. These are privileged mechanical agents, not fresh players: they inspect the model and have every concept available. The two models are not matched for difficulty and their success rates must not be ranked as pleasure scores.

## 1. Two worlds, one changing sky

The scene starts with two wandering worlds, a dark central world they must avoid, and two visible passages. Both wanderers move whenever a fusion changes their shared sky. The player creates forces; their effects on both trajectories matter together.

There are seven concepts and three inspectable combinations:

| Actual ingredients | Phenomenon | World consequence |
| --- | --- | --- |
| Earth + Fire | Sun | Persistent attraction toward the contact point |
| Air + Fire | Wind | A directional impulse shared by both wanderers |
| Water + Sun | Nebula | Local drag during this world response |

Every power can be used again. Suns coexist, and another Sun changes the field; it does not add a point or satisfy a construction quota. Wind direction belongs to the gesture in a possible interface. This script samples four directions; it does not implement that gesture.

One fusion advances the world by one simulated second. Planning itself has no countdown. Reaching a wrong passage, striking a Sun, striking the central world or colliding with the other wanderer ends the attempt. There is no imposed fusion limit. A player could slow or reverse motion; the seven-fusion search horizon is an evaluator limit, not a game rule.

**Avoiding filler.** Once unassisted trajectories already lead both wanderers home, the screen resolves that outcome without further player input. It never requires crafting an irrelevant thing just to tick a successful flight forward. Each found nonempty witness also receives a counterfactual: remove one fusion's physical effect while preserving its elapsed time. Every fusion in the selected witnesses fails this substitution test: the effect mattered, rather than merely advancing time. That does not prove every possible successful path lacks filler.

### What actually happened

The screen includes twelve deliberately specified starting contexts. Position, recipe rules, destinations and power samples stay fixed across the first eight; only starting vertical velocities change. Two additional near contexts share another fixed position and reverse which wanderer is moving inward. The final two reverse a stronger crosswind. These are authored diagnostic cases, not a random sample or a held-out evaluation set.

| Diagnostic | Observed |
| --- | --- |
| Cases already succeeding without any action | 2/12 |
| Active cases with a found completion | 9/10 |
| Active cases won by immediate progress policy | 0/10 |
| Active cases won by repeating one sampled action | 0/10 |
| Fusions in found active witnesses | 2–3 |
| Selected fusions replaceable by an effect-free tick | 0 |

The two already successful cases, `level` and `diverging`, are rejected as challenges. Before the automatic unassisted-completion check, they misleadingly appeared to reward repeated forward Wind. That was an evaluator defect: it credited actions for an outcome that needed none.

The beam planner explores thirteen sampled actions, retains 150 states per layer and searches up to seven fusions. A found path is a reproducible reachability witness. No found path is **not** proof of impossibility. In `converging`, no completion was found; this case is not ready to offer as a solvable puzzle.

The immediate policy selects the next state with most progress toward the passages and least vertical error. It sees exact transitions, but its score omits the distant consequence of the persistent field. Its failures establish a weakness of that policy, not a human challenge estimate. Lower success does not establish greater fun.

### A real reversal, rather than failed search

In both near contexts, the wanderers start at `(-1.1,+0.6)` and `(-1.1,-0.6)` with horizontal velocity `1`. In `near-upper-falling`, only the upper one has vertical velocity `-0.20`. In `near-lower-rising`, only the lower one has vertical velocity `+0.20`.

| Context | First Sun | Second Sun | Observed outcome |
| --- | --- | --- | --- |
| Upper falling | `(-1.1,+1.3)` | `(+1.1,-1.3)` | Both pass home unassisted afterward |
| Lower rising | `(-1.1,-1.3)` | `(+1.1,+1.3)` | Both pass home unassisted afterward |

Swap the **first** Sun between those contexts and a wanderer strikes the central world during that first response. This is an executed terminal collision, independent of later search. The same locally legal force is useful in one world and fatal in the other.

Each context also has a second viable first Sun at `x=0` on the same side. Both lead to found completions. Thus the model is not merely demanding one precise contact pixel, although the continuous width of the viable regions has not been measured.

This is the modest compositional insight: an attraction meant to rescue one world also changes the other's future route. Another force can complete that coupled trajectory. Inspecting the Earth/Fire recipe does not supply the spatial solution.

### What did not earn its place

The `upper-fast` and `lower-fast` cases have two-fusion Sun/Wind witnesses. The sampled seven-step single-family searches find no completion there with Sun alone, Wind alone or Nebula alone. This supports testing complementary forces; it does not prove that free continuous Sun placement can never solve them.

Nebula appears in alternative successful openings, but no selected found witness needs it. Adding it for a richer-looking catalogue is not justified. Test Sun and Wind first if returning to this model. Neither permanent concept learning nor the pleasure of expanding a catalogue was evaluated: all powers were supplied from the outset to test the complete-information requirement.

No fixed repeated sampled action wins an active case. A longer universal sequence, adaptive use of a single power and continuous-placement exploits have not been ruled out. Do not write “no dominant strategy” on the basis of this screen.

### The unresolved combination problem

The model represents a fusion as activating a phenomenon at its contact point. It has no hand, shelf or movable ingredients. If a learned Sun can simply be copied, placed and dragged as an active gravity source, then controlling its position may supply the entire challenge and combining becomes an ornamental trigger. The newer one-instance board creates that concern particularly sharply: moving its sole Sun could replace the two repeated fusions these witnesses use.

A future physical test would need to make two actual ingredients and their contact consequential, preserve truthful partner/result revelation, and observe a player reusing a result. It must distinguish “I enjoyed combining forces” from “I enjoyed moving a gravity well.” This screen cannot make that distinction, and it does not authorize replacing the current interaction with a force-selection menu.

**Disposition:** retain as a causal-placement probe. It demonstrates a non-stock source of consequential choice. Do not treat it as the selected game, a validation of the one-instance board, or enjoyment evidence.

## 2. Creatures with intentions: Light and Shade

This comparator has two living creatures, two homes and five connected places. The map is a crossing: Left—Crossing—Right, with Above and Below branching from Crossing. Fire + Air makes Light; Earth + Water makes Shade. Six concepts suffice. Either quality can be created at any place, without a quota; the opposing quality there is replaced.

Day seeks the nearest Light. Night seeks the nearest Shade. A creature at its preferred source stays. Equally near preferred sources cause visible hesitation. Both creatures follow their inspectable arrows together until they rest. Meeting, including swapping across the same connection, ends the attempt. Day must rest at Right and Night at Left.

A changed fusion immediately resolves movement. Repeating an equal field at the same place changes nothing and advances nothing. Setting a field for a later interaction may be useful even when neither creature moves immediately; there is no maturation or waiting requirement.

An exact breadth-first search solves all four authored contexts. The simple immediate-distance policy solves one of four. Repeating one action solves none. Shortest witnesses take two or four fusions.

A local reversal initially looked promising. With Night blocking the crossing and Day at Left, Shade at Above moves Night aside; Light there causes Day to meet Night. With Day blocking the crossing and Night at Right, Light at Above works and Shade there causes the meeting. Every consequence follows disclosed intentions, rather than a hidden recipe password.

### Why the apparent positive is rejected

The same six-fusion sequence wins **all four intended contexts**:

1. Light at Left.
2. Shade at Right.
3. Shade at Left.
4. Light at Above.
5. Light at Right.
6. Shade at Above.

The first two changes synchronize the creatures at the ends. The rest is a common routing routine. The script executes this full sequence in each context and records every movement. It is longer than individual shortest paths, but the game has no cost or deadline, so that difference does not rescue context-sensitive planning.

**Disposition: reject this four-context slice.** The planner/greedy gap and the local reversal were insufficient screening gates. The common sequence is a stronger counterexample than an evaluator's favorable explanation. A different map or richer intentions would be a different experiment; do not add them solely to preserve this idea. No claim is made that the sequence solves every imaginable starting configuration.

## What these experiments add to the loop

Successful model play is a prerequisite check, not a reward signal for fun. The useful observations here are specific: two “wins” required no action; immediate reward missed delayed field consequences; an effect-free-tick check removed the need for filler; a local reversal coexisted with a common winning routine; and a later human design proposal invalidated the substrate assumed by the stronger screen.

Keep these failures and boundaries in the record. None should become a larger scalar fun score, a vote against the owner's preferred hover affordance, or a reason to smuggle resource scarcity back into the next prototype.
