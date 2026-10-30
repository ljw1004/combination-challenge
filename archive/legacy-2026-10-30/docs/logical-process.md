# Combining as irreversible causal processing

Frozen model: `process-1`, [logical-process.ts](../experiments/logical-process.ts). This is a logical-only candidate. It adds no interface. The invented laws are not advice about real signal-processing equipment.

## Hypothesis before implementation

A combination can apply a cause to the current world rather than classify cases or unite geometry. Public causal laws may create an informed choice between preserving distinctions and suppressing unwanted activity. An imperfect-looking move can prepare a useful later transformation, while an apparently helpful filter can erase something necessary. That is a tradeoff in what remains possible, without an inventory, action allowance or player clock.

Possible falsifiers: a short common process solves every context; the target makes every next step obvious; the operations merely rename Boolean choices; exact goal matching supplies only arithmetic transcription; or irreversible mistakes feel arbitrary despite the complete rules. A local Pareto frontier is not sufficient evidence of a strategic decision.

## The world and the operations

The current world is six values in `0,1,2`: absent, faint and strong. Each beat is part of the phenomenon being shaped, not a deadline for the player. A combination applies one inexhaustible process to the whole current trace. Every operation reads the old trace simultaneously, with a previous value of zero before the first beat:

| Process | Public effect |
| --- | --- |
| Amplify | Double each value, capped at2. Weak and strong can become indistinguishable. |
| Sieve | Keep2, replace1 with0. It removes faint events as well as faint noise. |
| Remember | At each beat use the maximum of current and previous values. Activity spreads into the following beat. |
| Settle | Use the minimum of current and previous values. Isolated arrivals disappear; persistence is required. |
| Contrast | Use the positive current-minus-previous difference. Sustained portions disappear and rises remain. |

These are five stable laws, not a hidden pair catalogue. Every immediate world/profile result is previewed. No-op combinations are omitted. A combination is `{type:'combine',a:'world',b:'remember'}`; reversing the two IDs is accepted.

The process capability remains forever. The **world changes**, so the old world is not an inexhaustible parallel copy to substitute later. History remains as evidence. This distinction creates actual irreversible consequences without making a material stock scarce. A fresh encounter starts a new world. There is no waiting action, score, turn limit or artificial operation currency.

The goal is an exact response trace. That deliberately makes this a short construction/control puzzle. The desired outcome is not given as a final formula or process chain.

## Executed model screen

Run `node experiments/logical-process.ts`; it writes [logical-process-screen.json](../results/logical-process-screen.json). Importing the module has no side effects. Reachability is exact over at most `3^6 = 729` possible world traces; the actual authored closures contain only17 or47 states.

| Encounter | Shortest BFS witness | Reachable states | Greedy immediate-error policy |
| --- | --- | ---: | --- |
| First voice | Amplify, Remember, Contrast | 47 | Fails |
| Sustained whisper | Amplify, Settle | 47 | Wins |
| Late flash | Sieve | 47 | Wins |
| Bridge an interruption | Remember, Settle | 17 | Wins |
| Separate arrivals | Amplify, Contrast | 47 | Wins |

The greedy policy's disclosed diagnostic error is missing desired signal plus unwanted signal plus overshoot. This sum is not a player reward or a fun score. Four of five wins is a concern for challenge depth, rather than evidence that most encounters are compelling.

All five exact witnesses replay to the target. Preview and step preserve the input state, the six world/process concepts remain available, and there is no player action budget.

## A consequence worth inspecting in a player test

The shared initial trace is `0 1 1 0 2 0`. First voice wants `0 2 0 0 0 0`.

Amplifying produces `0 2 2 0 2 0`: it preserves the wanted arrival but also produces unwanted activity. Remembering that amplified trace produces a plateau `0 2 2 2 2 2`, initially looking worse against the final goal. Contrast then turns the plateau into exactly the first arrival. The middle operation matters because it changes what the later process can distinguish; it is not a waiting tick.

Sieve first instead creates `0 0 0 0 2 0`. None of the public causal operations can recreate the earlier faint event. Exact search verifies the target is then unreachable. Yet that same Sieve operation immediately wins the Late flash encounter, whose goal wants only the strong arrival. This is a real consequence reversal under the same known laws.

Contrast first is an imperfect but recoverable alternative. It creates `0 1 0 0 2 0`; Amplify, Remember, Remember, Contrast still reaches First voice. Nothing has been used up, although this route requires two more combinations than the shortest route. Those extra actions are inefficiency, not a material or time penalty imposed by the game.

Immediate goal components also disagree. For First voice, Amplify preserves2 target units with4 unwanted units; Contrast preserves1 with2 unwanted units; Settle preserves0 with1 unwanted unit. All lie on the local Pareto frontier. Settle is nevertheless globally unhelpful because it loses the desired early arrival. Therefore local nondominance must be checked against future viability before being treated as a defensible alternative.

## Strong counterexamples and limits

The exact final target dominates other final profiles. Retained desired signal, unwanted signal and overshoot are components of **one specified output**, not independently meaningful player values. This model does not establish an open-ended strategic tradeoff with several equally good endings. It tests order, preparation and information loss in a bounded puzzle.

A fixed final process cannot produce several different targets from the same initial trace. That weak test is insufficient. The screen also finds a common eleven-operation trajectory that **visits every target sharing that trace**, stopping at the relevant goal:

`Amplify, Contrast, Remember, Remember, Contrast, Remember, Settle, Remember, Remember, Settle, Settle`.

Thus repeated levels over this one raw trace can become a memorized tour. Do not advertise them as five independent strategic challenges or expand them by changing only the target name. This is stronger counterevidence than the absence of one shared final expression.

Four of five encounters also yield to the immediate-error policy. First voice is the strongest small player-test candidate because it needs a temporarily worse-looking preparation and exposes recoverable versus irreversible changes. A fresh logical player should show whether that is an interesting causal insight or just a three-step exercise. No agent play session or human enjoyment finding is claimed by this model screen.

Combining a process with the world is asymmetric. If it feels like selecting an ability rather than composing meaningful causes, reject or revise it. No UI polish should be used to conceal that structural weakness.

## Frozen API for the shared harness

Exports:

```ts
PROCESS_VERSION // 'process-1'
PROCESS_SCENARIO_IDS
PROCESS_SCENARIOS
type State = ProcessState
type Action = ProcessAction // {type:'combine',a:string,b:string}
createProcess(scenarioId?, seed?) // seed currently does not alter the encounter
observeProcess(state)
stepProcess(state, action)
previewProcess(state, action)
legalProcessActions(state)
processOutcome(state)
processSemanticKey(state)
processReachability(world, target) // privileged exact evaluator
replayProcess(scenarioId, actions)
screenProcess()
```

`processOutcome` returns `terminal`, `status`, a semantic key, three goal-component objectives with higher/lower directions, and descriptive world values. `processSemanticKey` excludes history, messages and action logs. The observer does not expose privileged goal-reachability flags. Only exact completion or an all-zero absorbing world is terminal; an otherwise unreachable trace can remain `playing`, so a diagnostic stop must not be mislabeled an ordinary game loss.

State, transition and observation semantics are frozen for player use. Later revisions must use a new version/module rather than change recorded runs.
