# Relations 2: different structures, shorter constructions

This is one revision cycle after the first logical player learned the factorization in [relations 1](logical-relations.md), found echo relocation routine, and treated the stronger threshold as a small duality adaptation. It changes the desired relationships rather than adding variables, resources or additional versions of the same threshold.

The [new module](../experiments/logical-relations-2.ts) is self-contained and uses `RELATIONS_VERSION='relations-2'`. Relations-1 captured states, observations and hashes remain unchanged. This experiment adds no interface work.

**Hypothesis:** a different relationship can require a fresh composition insight, while a shorter witness reduces execution after that insight. Algebraic difference alone does not establish an interesting difference for an experienced player.

## Three relationships on the same inputs

Every case states which of A–D are present and whether the resulting support is sufficient. All sixteen cases are public. ALL and EITHER retain exactly their intersection/union meanings; no goal changes the legal combination rules.

| Context | Desired relationship | Deliberate witness | Direct minimal-case construction |
| --- | --- | --- | --- |
| `complete-coalitions` | A/B complete one coalition; C/D complete another. Crossed incomplete coalitions do not suffice. | `AB OR CD`: 3 combinations. | 3 combinations. |
| `essential-anchor` | A is indispensable. B supplies direct support; C/D together supply an alternative. | `A AND (B OR CD)`: 3 combinations. | `AB OR ACD`: 4 combinations. |
| `neighboring-links` | The sufficient pairs are AB, BC and CD: the edges of A—B—C—D. | `B AND (A OR C) OR CD`: 4 combinations. | `AB OR BC OR CD`: 5 combinations. |

These are desired support relationships in a bounded construction puzzle. They do not claim that a real institution, research result or society follows these formulas. The target family is authored and fully disclosed by the case table. The game actions construct judgments about those cases; they do not change a simulated world.

The possible new insights are identifying complete rather than partial coalitions, factoring an indispensable anchor out of alternatives, and sharing a middle support across neighboring links. They are candidates for observation, not presumed enjoyable discoveries.

## What the mechanical screen establishes

Run:

```sh
node experiments/logical-relations-2.ts > /tmp/logical-relations-2-screen.json
```

Importing the module prints nothing and runs no screen. The executable screen prints replayable action lists, exact case patterns, blanket-action failures, full closure, equivalent-renaming checks, shared-method comparisons and a staged-reuse counterfactual.

| Diagnostic | Observed |
| --- | --- |
| ALL every primitive | Fails all three contexts by rejecting sufficient support. |
| EITHER every primitive | Fails all three by accepting insufficient support. |
| Deliberate witness lengths | 3, 3 and 4 combinations; every witness replays to `won`. |
| Exact minimum expression-tree operations | 3, 3 and 4; not a proof of minimum reusable-circuit actions. |
| Reuse each fixed witness in other contexts | Each works only in its own context. |
| Rename A–D in every possible way | No pair of targets is equivalent under any of the 24 renamings. |
| Also exchange AND/OR by Boolean duality | Still no equivalent target pair. |
| Exhaustive saturation, first win | 46, 66 and 99 novel combinations in the script's fixed enumeration order. |
| Exhaustive saturation, complete closure | 162 new conditions beyond the four inputs. |

Generic exhaustive solvability remains a weak criticism: it takes many more actions than the short deliberate witnesses. The three functions are different in a stronger sense than renamed columns or dual thresholds. Neither observation proves fun.

The stronger counterexample is also small. An experienced player can list each minimal accepted input set, AND its members, and OR those terms. That single **adaptive construction method** solves all three contexts in 3, 4 and 5 actions. Factoring saves one action in the latter two; no action budget makes that saving mandatory. Once the method is familiar, these may still feel like truth-table worksheets.

Thus the revision successfully changes the logical structure and reduces settled execution. Whether it changes the player's intellectual experience requires the experienced player's account. It would be misleading to call three different truth functions three distinct sources of fun.

## Actual reuse between targets

The counterfactual progression retains every established condition while changing only the required judgments over the same sixteen cases:

1. Complete coalitions: 3 combinations.
2. Essential anchor: **1 additional combination**. Intersect the existing coalition result with A. Distributivity gives `A AND (AB OR CD) = AB OR ACD`.
3. Neighboring links: **2 additional combinations**. Establish BC, then combine it with the retained coalition result using EITHER.

None of the later answers was already present after the preceding intentional witness. These are genuine uses of retained relationships, with less repeated construction. Full saturation would already contain every later answer, as expected in this finite algebra. It is not necessary to erase discoveries to test progression.

This is a screening counterfactual, not an implemented automatic campaign. The standard API still creates an independent context for each player run.

## API and replay

The exports mirror relations 1:

```ts
RELATIONS_VERSION // 'relations-2'
scenarios
createRelations(scenarioIdOrData, seed?)
observeRelations(state)
inspectRelations(state, action)
legalRelationsActions(state)
stepRelations(state, action)
replayRelations(scenarioId, actions, seed?)
screenRelations()
```

Types include `RelationsState` and `RelationsAction`. Actions remain `{type:'combine', op:'all'|'either', a:currentId, b:currentId}`. Observation includes public case semantics, all cases, current concepts, action schema and explicit status. Inputs persist and duplicate conditions coalesce. The seed changes only case order; it does not supply new structural content.

Replay any screen witness:

```sh
node --input-type=module - <<'JS'
import {readFileSync} from 'node:fs';
import {replayRelations} from './experiments/logical-relations-2.ts';
const report=JSON.parse(readFileSync('/tmp/logical-relations-2-screen.json','utf8'));
for(const example of report.rows)
  console.log(example.scenario,replayRelations(example.scenario,example.witness).status);
JS
```

## Decision for this cycle

Give the experienced player these contexts without supplying the formulas above. Record whether they discover a changed relationship, immediately translate minimal accepted rows into standard terms, or simply perform a settled expression. Ask what they would want to encounter next, without counting completion or fluent explanation as enjoyment.

If the result is another short worksheet, stop expanding this candidate. A limited algebra exercise can be a useful baseline without becoming the proposed universe-creation game. If one new relation provides a worthwhile insight, retain that specific evidence and its limits; do not infer a campaign from it.
