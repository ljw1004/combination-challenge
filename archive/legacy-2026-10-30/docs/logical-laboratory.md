# Logical laboratory: a small diagnostic game

25 October 2026. This is an abstract, headless candidate. There are no graphics, pointer mechanics, browser dependencies or claims about tactile quality. [The deterministic model](../experiments/logical-laboratory.ts) is playable through logical combine actions. [The saved exact screen](../results/logical-laboratory-screen.json) distinguishes scripted policy evidence from future blind play.

The intended remaining skill is experimental discrimination: choose a known experiment whose possible observations separate explanations. The hidden fact concerns this particular fictional world's mechanism. No recipe legality or authored concept vocabulary is hidden. Every candidate mechanism and every candidate's prediction are public.

## Rules and objective

Initially the player has three concepts: `probe`, `A` and `B`. A means A active with B inactive; B means B active with A inactive. The complete recipe set is:

| Parents, in either order | Child | Consequence |
| --- | --- | --- |
| A + B | AB | Creates the joint condition: both signals active simultaneously. |
| Probe + A | Observation A | Measures one scalar output for A alone. |
| Probe + B | Observation B | Measures one scalar output for B alone. |
| Probe + AB | Observation AB | Measures one scalar output for the simultaneous condition. |

Parents remain and each child occurs once. A completed pair is no longer invited; trying it again changes nothing. There are no supplies, credits, score, deadline or loss condition. Every measurement uses an identical test of the same fixed world; it does not alter the unknown mechanism. This is an invented Boolean laboratory, not a simulation of actual genomics or historical institutions.

The goal is to obtain evidence consistent with exactly one listed mechanism. Success follows from the evidence itself; there is no command to guess a mechanism's name. Feedback reports the observed output and the surviving explanations. Previews show every surviving candidate's prediction, including when all candidates agree and the proposed observation would be redundant.

Four contexts each admit three mechanisms:

| Context | Candidate mechanisms | What changes |
| --- | --- | --- |
| `pair-gates` | AND, OR, XOR | Distinguishing OR from XOR requires the joint condition. |
| `relays` | Relay A, Relay B, XOR | Individual conditions can distinguish the mechanisms; a joint compound need not be made. |
| `opposed-gates` | NAND, NOR, XNOR | Complements the first family's responses. This varies response reading, not the underlying inference structure. |
| `one-sided` | A without B, B without A, AND | Two negative individual observations can establish the joint explanation without measuring the joint condition. |

## One actual decision and a recoverable mistake

After observing A = 1 in `pair-gates`, OR and XOR remain. They both predict B = 1. Combining Probe with B is legal and makes a new observation, but does not distinguish the explanations. The useful composition is A + B, then Probe + AB: OR predicts 1 and XOR predicts 0.

After the same observation A = 1 in `relays`, Relay A and XOR remain. B alone distinguishes them. The compounds have exactly the same public recipes, while their usefulness changes with the public causal possibilities. This is a difference in what question to ask, rather than in what contacts are permitted.

The saved recovery trace performs the redundant B observation in the first context, then creates and probes AB. It still succeeds. No material, permission or future possibility has been spent. The extra observation is retained as evidence; its lack of discrimination is directly visible.

## Exact screen and the strongest counterexample

Run `node experiments/logical-laboratory.ts`. It saves `results/logical-laboratory-screen.json` and prints a short summary. The screen executes all twelve hidden worlds, compares a public-information adaptive policy with every one of the six fixed probe orders, and executes complete catalogue saturation. The adaptive policy optimizes expected combination count only as a diagnostic baseline; that optimization is not a player score or action limit.

| Context, three worlds each | Adaptive mean combinations | Fixed A, B, AB order, stopping when solved | Adaptive worlds needing useful AB composition |
| --- | --- | --- | --- |
| Pair gates | 2.33 | 3.00 | 2 |
| Relays | 1.67 | 1.67 | 0 |
| Opposed gates | 2.33 | 3.00 | 2 |
| One-sided | 1.67 | 1.67 | 0 |

The meaningful observation is that a joint composition adds discriminating evidence in four worlds and is unnecessary in the other eight. It is not that smaller action counts are inherently more enjoyable. Complete saturation always creates all seven concepts in four combinations and identifies the mechanism in every world. In eight worlds its final joint observation adds no discrimination because the individual observations have already settled the question.

**Strongest counterexample:** a single fixed routine—probe A, probe B, combine A with B, probe AB—solves all twelve worlds in at most four combinations. There is no growing obstacle and no need to transfer more than that routine. Exhaustive solvability alone does not invalidate a puzzle; here the exhaustive routine is itself short, obvious and shared by every context. This candidate is at most a brief tutorial for choosing a discriminating experiment. It has not earned promotion as the main challenge.

The rejected richer trial is also recorded. If one measurement returns the whole A/B/AB response vector, its public forecast signatures are unique in every context: a single trial identifies every mechanism. Adding a downstream truth-pattern construction objective would create another Boolean synthesis puzzle, overlapping the separate relations candidate. That branch was stopped before implementation. The playable laboratory deliberately measures one intervention at a time.

The screen verifies that all hidden worlds within a context have identical public starting observations, steps leave their input state untouched, parents survive and completed pairs cannot create repeated information. These are model properties, not enjoyment indicators. No blind agent or human play is reported by this screen.

## Public API for a common abstract harness

The module exports:

- `LAB_VERSION`, currently `logical-laboratory-1`.
- `LAB_SCENARIO_IDS`: `pair-gates`, `relays`, `opposed-gates`, `one-sided`.
- `createLaboratory(id = 'pair-gates', seed = 0): LaboratoryState`.
- `observeLaboratory(state)`: the public view, including rules, recipes, concept IDs, hypotheses and forecasts, measurements, surviving candidates, legal actions, previews, feedback and status.
- `stepLaboratory(state, action): LaboratoryState`.
- Types `LaboratoryState`, `LaboratoryAction`, and their aliases `State`, `Action`.
- `runLaboratoryScreen()`: returns the exact screening report without writing it.

The only action schema is `{ type: 'combine', a: 'known concept id', b: 'known concept id' }`. Initial IDs are `probe`, `A` and `B`; derived IDs are `AB`, `observation:A`, `observation:B`, `observation:AB`. Argument order does not matter. Invalid actions return feedback while leaving the puzzle unchanged. `status` is `playing` or `won`; `currentOutcome` explains the public evidence.

The state object contains the hidden mechanism for deterministic execution. **Adapters must show `observeLaboratory(state)`, not serialize `state`.** The seed selects a mechanism reproducibly and is not part of the public view. Importing the module runs no game, screen, logging or file writes. Direct CLI execution runs the screen and writes its JSON artifact.

A fresh abstract player can test whether the different contexts elicit a prediction, recognition of a redundant observation, a useful joint composition and recovery. Given the universal four-combination routine, a successful trace alone is weak evidence. Further work should be earned by an observed inference or useful transfer, not by adding a larger table of named mechanisms or a query allowance.
