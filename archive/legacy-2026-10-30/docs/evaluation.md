# Evaluation contract

The intended experience is **feeling inventive through understandable, consequential constructions**. The harness evaluates evidence for that experience, suggests a falsifiable change, and compares the change with its baseline. Its output is a set of supported, concerning, and unknown claims. Human enjoyment remains an unvalidated hypothesis until people play.

This document specifies the evaluation method. Actual runs, counts, implementation coverage, and design decisions belong in the experiment results and iteration log; an intended protocol is not evidence that it was executed.

## Sources that constrain the grader

Primary texts checked on 25 October 2026. These are paraphrases; the test proposals are this project's hypotheses.

| Source and access | Actual claim | Implication to test | Limitation |
| --- | --- | --- | --- |
| **Daniel Cook, 19 July 2007**, [The Chemistry of Game Design](https://www.gamedeveloper.com/design/the-chemistry-of-game-design). Read original article text, including skill atoms and burnout sections. | Models learning through action, simulation, feedback, and the player's changing model. An acquired skill needs a further use; mastery and later loss of interest differ. | Record expected effects before a move; compare with the response; test whether an acquired capability becomes useful in a different context. | Designer model rather than proof of a universal psychology. We do not adopt the article's neuroscience claims. Telemetry cannot directly reveal a player's mental model or burnout. |
| **Greg Costikyan, 2002 revision**, [I Have No Words & I Must Design](https://worrydream.com/refs/Costikyan_2002_-_I_Have_No_Words_and_I_Must_Design.pdf). Read proceedings text, especially goals, struggle, and balance; mirror of original paper. | Goal-directed interaction requires obstacles; solitaire balance gives mastery a reasonable chance to improve success. Also describes pleasures beyond challenge. | Compare informed planning with immediate relief and random action, then inspect where skill changes the result. | A designer's conceptual position, not a validated enjoyment scale. Difficulty can increase while agency or pleasure declines. |
| **Ken Birdwell, 10 December 1999**, [The Cabal: Valve's Design Process for Creating Half-Life](https://www.gamedeveloper.com/design/the-cabal-valve-s-design-process-for-creating-i-half-life-i-). Read original firsthand article text. | Silent observation revealed supposedly obvious solutions to be arbitrary. The team fed playtests and instrumentation back into design and removed weak material. | Give fresh players only intended onboarding; preserve confused attempts; join event traces with retrospective explanations instead of correcting players mid-run. | One successful production's retrospective. Its telemetry interpretations and team process need not transfer to this small game or AI players. |
| **Sinan Ariyurek, Elif Surer, Aysu Betin-Can, submitted 26 July 2021, revised 6 April 2022**, [Playtesting: What is Beyond Personas](https://arxiv.org/html/2107.11965v2). Read paper introduction, method, results, and discussion. | Goal sequences and a method that seeks alternative paths can uncover trajectories missed by a fixed persona or repeated optimization. | Include changing objectives and deliberately inspect alternative winning paths, while keeping coverage-seeking runs labeled as diagnostics. | Experiments concern RL in GVG-AI and Doom, not LLM enjoyment judgments. More trajectories are useful coverage, not evidence of pleasure. |

These accounts pull in different directions. Efficient mastery might end curiosity; an obstacle might create triumph or merely consume time; a varied trace might express creativity or random wandering. The grader must retain those contradictions. The broader research synthesis supplies competing aesthetic targets; this contract operationalizes the current target only.

## Four layers of evidence

1. **Mechanical verification:** legal actions, exact deterministic replay, bounded termination, preview correctness, invariants, and existence of winning openings. Output pass/fail and counterexample. A failure prevents interpreting affected traces as a fair design comparison.
2. **Automated diagnostics:** policy performance, branch differences, repetition candidates, effect coverage, scenario sensitivity, and recovery after plausible mistakes. These locate decisions for inspection.
3. **Blind AI player evidence:** recorded choices and short predictions, plus optional retrospective reports. Report the model, exposure, action allowance, observation format, and access limitations. A player saying a moment was satisfying is an AI report.
4. **Human findings:** actual observations and participants' own accounts. Until conducted, every human-experience item is **unknown**, including readability, emotional pressure, desire to replay, fatigue, and enjoyment.

Do not merge these layers into a success score. A solver can establish possibility while a blind player cannot discover it; both findings matter.

## Trace and evidence schema

Every trace needs `buildVersion`, `rulesVersion`, scenario identifier, seed, run identifier, player condition, model if applicable, observation version, offer order, starting observation, and action budget. Every decision stores the exact offers shown, chosen legal action, deployment target, public forecast, response events, resulting public observation, and outcome. A hash or complete serialized state supports exact replay. Keep privileged snapshots out of the player's observation.

Optional decision annotation:

```json
{
  "objective": "Buy enough time to try a lasting diversion",
  "actionId": "a-legal-action-id-from-the-observation",
  "expectedEffect": "The next threat reaches the slowed tile and stops short of the objective",
  "confidence": "medium"
}
```

Ask for a prediction, not a private reasoning transcript. Do not reward eloquence, annotation length, agreement with the designer, or confidence. Store structured predictions before revealing the response. Mechanically check an asserted effect when possible; retain uncertain natural-language coding for evaluator review.

Each evaluation card should be executable JSON with this shape:

```json
{
  "criterion": "consequential-choice",
  "status": "support",
  "evidence": [
    {"runId": "run-id", "turn": 4, "kind": "measurement", "claim": "Two replayed actions leave different capabilities and different safe continuations"}
  ],
  "counterevidence": [],
  "access": "evaluator-with-implementation-access",
  "nextTest": "Try the same alternatives with the objective placed elsewhere"
}
```

Allowed statuses: `support`, `concern`, `unknown`. Allowed evidence kinds: `measurement`, `prediction`, `player-report`, `evaluator-interpretation`, `human-report`. A support claim must cite a real run and turn. No evidence yields unknown. A positive card needs an explicit attempted counterexample or a next counterexample to run. Preserve negative evidence even when a variant is kept.

## Rubric and failure evidence

Thresholds are experiment-specific screening conventions, chosen before a comparison. They are not laws of fun. Report raw numerators, denominators, ranges, and examples alongside any threshold.

| Criterion | Observable support | What should count against it | Grader trap |
| --- | --- | --- | --- |
| **Readable causality** | A player correctly predicts an immediate interaction, including an interaction previously seen elsewhere. Displayed forecast agrees with actual resolution. | Repeated confident effect errors, missed order-of-resolution rules, unexplained exception, forecast mismatch. | Correct legal syntax or eventual victory does not show understanding. Exact previews can also conceal whether rules were learned. |
| **Consequential choice** | At one saved decision, at least two plausible actions produce meaningfully different future capabilities, risks, or routes; both have defensible continuations. | Most offered actions are useless; one opening dominates every scenario; different buttons create equivalent states. | Counting offers or unique action IDs as depth. A viable alternative can still be uninteresting. |
| **Invention matters** | A newly established concept visibly changes propagation, movement, protection, or access; its consequence affects a later decision. | Discoveries merely fill a collection, add an interchangeable damage value, or only unlock a forced recipe step. | Any state change or extra text is mistaken for meaningful consequence. |
| **Learning and transfer** | After the teaching encounter, the player applies a relation to an unseen arrangement and predicts why it helps. | Success depends on memorizing an exact sequence; the same relation fails through an unannounced exception. | A solver's internal rule knowledge is mistaken for player learning. Reusing identical boards measures recall. |
| **Plan revision** | A new observed consequence causes a changed objective/action with a prediction that fits the replay. | Player repeats a failed tactic, or every response is so scripted that no revision is needed. | More action switching is rewarded even when random or caused by confusing feedback. |
| **Pressure with recovery** | A temporary measure gives room for a more durable plan; a plausible mistake has a costly but reachable recovery. | Opening loss is unavoidable; early innocent moves secretly doom the run; safe play becomes identical maintenance forever. | A narrow win margin or higher loss rate is treated as excitement. |
| **Chore burden** | Established capabilities can be redeployed directly; later uses involve changed timing, location, or purpose; solved threats terminate. | Rebuilding the same chain; repeated repairs in equivalent contexts; long mandatory setup with no changing choice. | Raw repeated-action counts punish legitimate skill use. Raw low counts reward trivial one-click wins. |
| **Expressive alternatives** | Players deliberately pursue different constructions that have distinguishable costs or consequences. | All successful paths are cosmetic reorderings of one chain; exploration always loses. | Diversity-seeking agents manufacture novelty that ordinary goal-seeking players would never choose. |

Pressure, expression, and learning can be unknown even when mechanical proxies pass. The evaluator should explicitly record an apparently strong encounter that still lacks an emotional payoff as a live concern.

## Policies and blindness

- **Random legal:** uniformly select a displayed legal action, with seeded policy randomness recorded separately from scenario randomness.
- **Greedy relief:** use only the observation to reduce the most immediate visible danger. Tie-break deterministically or record the tie RNG. No hidden recipe graph.
- **Goal directed:** follow a small public-rule heuristic toward the stated objective, while handling immediate danger. Publish the heuristic.
- **Fresh planning player:** a newly spawned agent with no inherited design conversation, source access, hidden state, future offers, seed, walkthrough, evaluator findings, or previous players' traces. It receives the same rules, public observation, offers, forecasts, and action feedback as a human.
- **Privileged solver:** may inspect transitions and branch exhaustively or with a bounded search. Label its results `privileged mechanical diagnostic`; record search budget and incomplete results. Failure to find a solution is not proof of impossibility unless search is exhaustive.

Fresh planning runs should use a restricted interface and an explicit prompt to stay in that interface. File names can leak strategy, so provide an isolated public observation/action command rather than pointing players at source directories. Record whether isolation is technical or instruction-based. A player that accessed internals is reclassified; do not silently include it as blind.

Baseline algorithms and planning agents must receive equal legal offers. A one-step preview available in the browser is fair; multi-step transition calls are privileged unless the browser gives the same capability. Do not describe an algorithm using internal transition search as blind merely because it ignores some fields.

## Matched screening and controls

For each major baseline/variant comparison, use twelve shared development seeds across the three encounters, reporting each encounter and seed separately. Run random, greedy, goal-directed, and planning conditions where implemented. Two fresh planning repetitions per seed are useful when affordable; if fewer are run, report actual coverage and the gap. Similar model runs are correlated evidence.

Reserve a separate named holdout seed set before tuning. Evaluate it only after selecting a candidate. If holdout results cause a redesign, mark those seeds as exposed and create a new holdout. Scenario seeds must alter a meaningful condition such as threat position, terrain, objective position, or timing. Merely reordering a menu is an offer-order control, not scenario variety.

Pair scenario seed and policy seed across rule variants. Present baseline/variant names anonymously to evaluators where practical. Swap action order on matched runs to detect first-option bias. For an LLM player, run annotated and action-only conditions on a small matched subset, with fresh agents in each condition. Compare choices, errors, and outcomes; neither condition's retrospective is ground truth. If annotation changes play, keep the two conditions separate.

Transfer needs a trained condition that has experienced the tutorial and a fresh condition with only intended onboarding. They face the same unseen related scenario. If no independent trained/fresh comparison is run, record anecdotal reuse without claiming transfer advantage.

Every result table reports actual counts. Keep incomplete games, illegal-action attempts, timeouts, and action-budget exhaustion visible. Never relabel an exhausted search or player allowance as an ordinary game loss.

## Branch replay inspection

Choose saved decisions before looking only at winners: at least one early opening, one temporary-relief versus development decision, one failure, and one apparent dominant strategy. Replay the selected move and a plausible alternative under identical conditions. Compare world state after a fixed number of decisions and available safe continuations, not just the final win bit.

Group actions by outcome-relevant effects. Two names that lead to the same relevant state are one alternative for this inspection. An evaluator may use privileged search to establish viability but must explain the public cue by which a player could reasonably consider that move.

Inspect a successful trace for possible chores and a failed trace for a worthwhile choice. This prevents winning from becoming an implicit proxy for enjoyment. Record the strongest counterexample to each retained mechanic.

## Adversarial tests for the grader

These are proposed diagnostic fixtures. Mark them as executed only when the harness actually runs them.

| Trace or scenario fixture | Tempting false positive | Required result |
| --- | --- | --- |
| Twelve differently named actions with identical effects | Large menu means depth | Consequential choice is concern or unknown; report equivalent outcomes. |
| A long forced winning recipe chain with useless distractors | Many discoveries mean invention | Chore/choice concern, even at 100% planner completion. |
| Repeat the same repair against the same restored hazard until timeout | Tension and useful repeat use | Maintenance concern; bounded endpoint failure if the design promises one. |
| A random player wins a trivial opening immediately | Fairness and skill | Mechanical success only; skill evidence unknown. |
| An eloquent annotation predicts the wrong effect | Smart plan revision | Prediction mismatch preserved; rhetoric earns no support. |
| No annotation but a precise, useful novel deployment | No explanation means no agency | Record measurable effect; subjective interpretation stays unknown. |
| An action-diversity agent intentionally takes long detours | Expression and replay value | Coverage evidence only until routes have defensible tradeoffs. |
| A single powerful construction solves all seeds | Efficient mastery | Dominance concern; test terrain/timing sensitivity before expanding content. |
| A visually clear rule has a hidden one-off exception | Surprise and challenge | Causality/fairness concern; curiosity is not inferred. |
| Same command repeated in different locations to redirect different hazards | Repetition means grind | Contextual difference retained; chore finding requires equivalent context. |
| Solver wins, blind players all fail on one missing cue | Challenging but fair | Reachability passes; readability concern blocks recommendation. |
| Generous pressure preserves choice but raises win rate | Too easy to be fun | Inspect alternative plans and reports; avoid automatic rejection. |

An executable grader can automatically test equivalence, forced sequences, replay, repeated contexts, and prediction assertions. Semantic claims about an ingenious plan need evidence review. If implementation covers only some fixtures, identify which ones.

## The closed design loop

Before an iteration, write a hypothesis and a prediction about behavior. Example: **discover-and-deploy in one action will increase immediate experimentation and reduce setup losses, but may erase the relief-versus-development tradeoff.** Choose a matched baseline, change that major factor, and preserve both variants.

The grader returns cards and candidate explanations. A design decision then cites the source-backed assumption, affected runs/turns, counterevidence, and next test. It may recommend keep, revise, or reject a mechanic; the decision log records the judgment. No automated number silently selects the next game.

Interpretation rules:

- Correct mechanical results plus prediction errors suggest presentation or inconsistent rules; change the cue or rule before increasing difficulty.
- Many offers plus equivalent branches suggest shallow choices; remove redundant recipes or add contextual consequences.
- A universal winning construction suggests dominance; alter scenarios or limit its situational effectiveness before adding a campaign.
- Frequent emergency repetition suggests a missing durable solution or excessive pressure; test an endpoint or more breathing room.
- More experimentation plus no consequential tradeoff suggests the pressure budget became too generous; inspect a targeted comparison.
- Better proxy scores plus no concrete compelling decision means the grader may be wrong; revisit the intended pleasure and source assumptions.

Return to the original research after substantial experiments, rather than just citing it in the initial proposal. Ask which designer claim predicted the observed pattern, which contradicted it, and whether the test operationalized the claim faithfully. Keep an explicit possibility that the selected direction should be abandoned.

## Human validation handoff

When people are available, recruit roughly four to six formative participants including newcomers, give the intended onboarding, and observe an uninterrupted first attempt without hints. With consent, retain the event trace and observer notes. Ask neutral retrospective questions tied to turns: what were you trying to do; what did you expect; which choice mattered; where did it become work; what would you try next? Ask about enjoyment directly and let players stop. Offer an optional replay without treating acceptance as proof of pleasure. Counterbalance variants where practical.

Compare those findings with the grader's prewritten predictions. A human enjoying an encounter the grader rejects, or disliking one it praises, is valuable model error. Revise the rubric while preserving the earlier output. Until this happens, report **human participants: 0; enjoyment, readability, fatigue, and replay preference: unvalidated**. Do not invent participants, quotations, preferences, or ratings.
