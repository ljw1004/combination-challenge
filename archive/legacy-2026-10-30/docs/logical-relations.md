# Logical relations: a construction probe

This experiment tests whether inspecting every combination can coexist with a worthwhile inference about what a construction means. It contains no interface, scarce materials, experiment credits, gate budget, deadline or action quota. The [pure model](../experiments/logical-relations.ts) is deliberately a small Boolean construction puzzle. It is not a model of realistic social judgment, genomic evidence or mathematical truth.

The candidate survives blanket “use every safeguard” answers. It remains unproven as a game: recognizing the independent inputs may be interesting once and the subsequent construction may become familiar. A fresh logical player should resolve that question before further implementation.

## The one combination rule

Every concept is a condition: the public cases that it accepts. Combining two conditions has two inspectable forms:

| Combination | Exact consequence |
| --- | --- |
| ALL | Accept cases accepted by both inputs: intersection. |
| EITHER | Accept cases accepted by either input: union. |

The cases specify which judgments must be accepted and rejected. Establishing any condition that meets all those requirements wins. Both inputs remain. Equal resulting conditions reuse an existing concept; repeating an action does not produce a new stock. A failed construction supplies an inspectable intermediate, so there is no irreversible loss or paid retry.

There are six initial signals, A–F, but some are echoes of the same underlying source. The entire sixteen-case table is public, including the required judgments. Repeated columns reveal repeated evidence directly. No private independence tag changes a reaction. ALL and EITHER completely determine every output from the visible columns.

The starting signals are separate reports even when two reports accept exactly the same cases. New composite conditions are identified by their case behavior. Thus a mathematical alias does not create a supply of consumable material.

The remaining inference is twofold: distinguish overlapping reports from independent support, then construct a judgment that preserves legitimate alternatives while excluding inadequate support. The author does not offer a finished-output button or require discovering an arbitrary recipe name. Whether carrying out that inference feels rewarding remains an empirical question.

## Contexts and actual counterexamples

Three contexts require support from at least two of four independent sources. Their source-to-signal relationships differ. A fourth uses the same relationships as the third but requires three independent sources. These requirements generate the complete visible case tables; the model uses no extra exception once the table has been built.

In `echo-left`, A/B/C repeat one source and D/E/F represent three others. In `echo-right`, A/B/C represent three sources and D/E/F repeat one source. Therefore the identical visible input pattern `111000` must be **rejected** in the first context and **accepted** in the second. No fixed expression over A–F, of any length, can give the correct judgment in both contexts. The relationship changed; inspecting a combination has not supplied a universal answer.

That statement concerns one fixed expression. It does not rule out a common adaptive strategy. After finding four independent columns and reading the required judgments, the same symmetric construction pattern solves each context. Learning that abstraction could be satisfying; repeating it without further inference could become ceremony. The screen reports both facts.

## Executed screen

Run:

```sh
node experiments/logical-relations.ts > /tmp/logical-relations-screen.json
```

The script prints its complete replayable witnesses and diagnostics and writes no files itself. Importing it runs no screen and prints nothing.

| Check | Result across the four contexts |
| --- | --- |
| Fold every initial signal with ALL | Incorrect in 4/4. It rejects legitimate cases. |
| Fold every initial signal with EITHER | Incorrect in 4/4. It accepts inadequate support. |
| Fold the entire saturated catalogue with ALL or EITHER | Both incorrect in 4/4. More safeguards do not fix the judgment. |
| Intentional construction witness | Seven combinations in each context; all replay successfully. |
| Exact minimum expression-tree operations | Seven in each context. This is not a proof of minimum actions when intermediates can be reused. |
| Three pairings of independent inputs | All three yield seven-combination solutions in each context. They are algebraic variants, not three different strategic systems. |
| Substitute an echo for its identical source column | Preserves the judgment in every tested substitution. |
| Reuse each context's fixed witness in the other contexts | Most fail. The first and third share one compatible witness; no witness solves all four. |
| Exhaustively establish every reachable condition | First wins after 157–158 novel combinations, then finishes at 162. |

There are 166 distinct reachable acceptance patterns. Two additional initial reports are aliases, so the fully saturated catalogue contains 168 named entries. These numbers follow from this finite algebra; they are not gameplay limits.

**Saturation is generic brute-force solvability, not a short winning routine.** This particular enumeration takes more than twenty times the seven-action intentional witness before its first success. A finite construction puzzle is not disproved by the existence of an exhaustive solver. Enumeration order matters, and this is not a lower bound on blind search. Conversely, long search is not proof of fun.

The more relevant short routine is adaptive: find representatives of the four distinct input columns, infer whether two or three are needed from the public judgments, then use a symmetric seven-combination threshold construction. It works in all four authored contexts. The screen deliberately exposes that narrowness rather than calling the four contexts four independent kinds of challenge.

## Staged reuse and its limits

The screen also tests a counterfactual progression with unchanged signal relationships: first construct the two-source judgment in `interleaved`, then require three sources in `stricter-judgment`.

The first intentional seven-combination construction does **not** already contain the second answer. Two additional combinations construct it by reusing earlier intermediates. If the four independent predicates are grouped into pairs, the first solution has already established “one from each pair,” “both from the first pair” and “both from the second pair.” The stronger judgment combines “one from each pair” with “a complete pair.” This is an actual compositional reuse, rather than another name for an unchanged answer.

If the player instead exhaustively saturates the first context, the second answer is already present and needs no further construction. This limits what such a campaign can ask after exhaustive exploration. It does not decide first-play quality. The staged screen is an analysis of preserved concepts, not an implemented campaign or an excuse to remove acquired capabilities.

## Pure API and replay

The module exports `RELATIONS_VERSION`, `scenarios`, `RelationsState` and `RelationsAction`, plus:

```ts
createRelations(scenarioIdOrData, seed?)
observeRelations(state)
inspectRelations(state, action)
legalRelationsActions(state)
stepRelations(state, action)
replayRelations(scenarioId, actions, seed?)
screenRelations()
```

An action is `{type:'combine', op:'all'|'either', a:currentId, b:currentId}`. A returned state is independent of its input. `observeRelations` contains the public rules, action schema, case table, current concepts and explicit `playing`/`won` status. `inspectRelations` exposes exact outputs. `legalRelationsActions` includes every unordered pair and both operators, including idempotent same-input actions; the exhaustive screen omits those because they cannot establish a new condition.

The seed only permutes the signal columns. It tests robustness to superficial naming, not additional game content. The scenario data supplied to `createRelations` should be an entry from `scenarios` when its ID will subsequently be used by `replayRelations`.

For example, this replays the first published witness:

```sh
node --input-type=module - <<'JS'
import {readFileSync} from 'node:fs';
import {replayRelations} from './experiments/logical-relations.ts';
const report=JSON.parse(readFileSync('/tmp/logical-relations-screen.json','utf8'));
const example=report.rows[0];
console.log(replayRelations(example.scenario,example.witness).status); // won
JS
```

## What the next player experiment should decide

The [designer-source revisit](challenge-research-revisit.md) motivates asking what relation the player learned and whether later use changes. It does not validate this Boolean puzzle. This probe removes recipe uncertainty and resource management so those cannot explain an apparent challenge.

A fresh player should receive only `observeRelations` and exact inspection of legal actions. Record the moment they identify echoing columns, the reason for an ALL versus EITHER choice, any useful intermediate they reuse, and whether the second half of the construction is merely execution of an already solved expression. Ask for that account without treating action count, completion, or fluent mathematical explanation as enjoyment.

If players immediately recognize a threshold-circuit exercise and the rest is routine, reject this slice as the project's central challenge. If they make a worthwhile inference once, that supports a short puzzle; it does not yet support a large society simulation or a campaign of renamed copies. No UI work is authorized by this result.
