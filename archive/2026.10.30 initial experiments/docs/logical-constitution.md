# Binding wills: a constitution as a combination

This is a small logical-only candidate. It was prepared while the parent agent revised `what-is-fun.md`; the mechanical screen below does not constitute evaluator approval. No UI, browser or human play is included.

**Hypothesis:** combining independent wills can create decisions about what to bind and what to leave independent. Union enables joint action, while its shared policy can become inappropriate for some members. The tradeoff concerns relationships and adaptation, rather than stocks, action credits or a deadline. A founding purpose can survive as an institutional rule after the world changes.

## The invented world and its rules

Four towns, A–D, begin with independent councils. A council's members must follow one shared policy, `open` or `shelter`. Each announced climate gives every town an explicit local need. Members vote for their need; a majority chooses the policy for the whole council. A tie preserves the founding voice's **original first-climate purpose**. Combining councils is ordered: the current group containing the left ingredient preserves its founding voice.

| Town | First climate | Changed climate |
| --- | --- | --- |
| A | Open | Shelter |
| B | Shelter | Shelter |
| C | Open | Open |
| D | Shelter | Open |

A town is protected when its shared policy matches its local need. The four joint works are Harbor bridge AB, Shared observatory AC, Common refuge CD and Storm canal BD. A work becomes possible when both endpoints belong to one binding will.

Each logical combination creates a named council and binds the two **current groups** involved. Both ingredient concepts remain known. Selecting an old council does not detach its members from a later, larger binding. This is an irreversible world relationship, not depletion of a material supply. There are no inventories or quantities of councils to collect. Repeated unions within the same current will change nothing and receive no further legal invitation.

When satisfied with the arrangement, combine `constitution` with `world`. That seals the current relationships and resolves both public climates automatically. This is an endpoint commitment; it should be counted separately from interesting syntheses. There are no mandatory waits or repeated maintenance operations.

There is no weighted reward. Each encounter requires one named work and one named town protected in both climates. Other consequences remain visible. A player can choose among viable endings that protect different towns or enable different works; the model does not claim that every feasible ending is equally attractive to every player.

These are deliberately restrictive **binding-will** rules. The model does not claim that real societies must impose uniform policy to cooperate. Consultation or federation without that constraint is a different operator and is tested as a counterfactual below. That premise needs player scrutiny; removing an obviously superior real-world arrangement is not by itself a source of fun.

## One substantive model revision

The first model let connected towns complete the same joint works while each town still followed its own need. Exact enumeration shows that uniting everyone then dominates every lesser partition: four works and all towns protected in both climates. There is no downside, so the small game collapses.

The revision changes one causal rule: connection now binds policy. Concepts remain inexhaustible, and no time or material price is added. The resulting world has 41 semantically distinct unsealed arrangements and 41 sealed endings per encounter. Founding voices are included in state identity because they can change future ties. Different labels or merge orderings that produce the same arrangement are not counted as new outcomes.

| Encounter | Mandatory outcomes | Viable endings | Distinct nondominated profiles |
| --- | --- | ---: | ---: |
| Harbor | Bridge AB; A protected in both climates | 6 | 3 |
| Observatory | Observatory AC; A protected in both climates | 3 | 1 |
| Refuge | Refuge CD; C protected in both climates | 8 | 4 |

The outcome profile uses literal world consequences: number of completed works, towns protected in the first climate, and towns protected in the changed climate. These are diagnostic summaries, not in-game currencies or a fun score. The full named consequences accompany every vector. Nondominance is computed among endings that meet the encounter requirements.

For Harbor, three nondominated consequence profiles are `(1 work, 3 protected now, 4 later)`, `(2,3,3)` and `(2,2,4)`. A+B can be enough; adding C enables another work but binds C to a later shelter policy it does not need. A player can also bind C/D separately, trading present protection for another work while preserving later fit. It is not possible to maximize every listed consequence simultaneously.

Observatory is a teaching/constraint case, not evidence of expressive alternatives: its three viable endings share the same ABC group, differing only in a founding voice that does not change the two resolved majority outcomes. Those do not count as three strategically distinct successes.

No single sealed arrangement wins all three encounters. This excludes a fixed common final constitution for this tiny set, not all possible simple adaptive policies. A player might still find a straightforward target-aware rule and regard the exercise as routine.

## A recoverable commitment with a changed meaning

In Harbor, combine B+A first. B's original shelter purpose wins the tied AB council, so A is unprotected in the first climate. The public preview exposes this before commitment.

Combine that AB will with C. The three-member majority opens in the first climate and shelters in the changed climate, restoring A's protection in both and completing the bridge. This is forward recovery without paying resources or undoing the first combination. It also causes C to shelter in the changed climate when C needs to remain open. The correction is not free of consequences: it converts an individually responsive C into part of a stable shared actor.

The alternative A+B from the beginning would protect A and allow C to remain independent. These paths differ through the purpose that persists and the later people affected, not through different names for the same result.

## Pure API and exact checks

The implementation is [logical-constitution.ts](../experiments/logical-constitution.ts), version `constitution-1`. Importing it performs no work.

```ts
CONSTITUTION_VERSION
SCENARIO_IDS // harbor, observatory, refuge
createConstitution(scenarioId?, seed?)
observeConstitution(state)
stepConstitution(state, action)
previewConstitution(state, action)
legalActions(state)
semanticKey(state)
outcomeProfile(state)
status(state)
screenConstitution()
```

Types `State` and `Action` are exported. Actions are `{type:'combine', a:knownCouncilId, b:knownCouncilId}` or `{type:'combine', a:'constitution', b:'world'}`. The left council preserves its current group's founding voice. The seed is accepted for the shared harness but intentionally adds no random or cosmetic scenario variety.

`legalActions` supplies one representative for each distinct ordered union, plus sealing. Every known council remains usable; representatives avoid counting equivalent names as choices. `semanticKey` includes the scenario, status, groups and founding voices, excluding logs and text. `outcomeProfile` includes terminal/feasible status, maximized consequence dimensions and the full literal outcome. Exact preview, immutable input and retained-parent checks pass. The screen exhaustively enumerates the finite world space and records replayable witnesses.

Run `node experiments/logical-constitution.ts`. The complete report is written to [logical-constitution-screen.json](../results/logical-constitution-screen.json).

## Limits and the next test

The world is tiny, the operator is intentionally restrictive, and two or three binding decisions may be worked out before acting. Pareto tradeoffs do not establish enjoyable choices. There is no reason yet to add more towns, counters or a campaign.

After the research doctrine review, a fresh logical player should choose a defensible ending, predict one changed-climate consequence, and play the binding sequence. Then inspect a plausible alternate choice and a different encounter. Ask whether founding purpose and transitive binding produced a useful inference, whether leaving a town independent felt like a consequential choice, and whether sealing merely added clerical input. A player choosing the safest named goal and ignoring optional works is legitimate counterevidence to assuming every nondominated ending is appealing.

The concept is retained only for that empirical test. It has not been declared fun, fair for humans, or an adequate model of institutions.
