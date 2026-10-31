# Combining disciplines, then doing something with them

Research and exact model screen: 25 October 2026. The user's proposal is a useful expansion of what can be combined: intellectual methods can be things on the same canvas as physical elements. It does not establish a challenge by itself. This pass separates factual inspirations, an intentionally rejected catalogue challenge, and a small experiment-design hypothesis.

The new substrate stays fixed: one movable instance of each concept, parents remain after fusion, a newly discovered child appears, completed pairs lose their invitation, and all legal combinations are inspectable. There are no consumable materials, experiment credits, action quotas or deadlines in these screens. [The executable screen](../experiments/ideas-challenge-screen.ts) does not simulate a person or a browser.

## AI with mathematics or a genome has several possible meanings

These are examples of actual research, not a claim that any discipline pair has one scientifically correct recipe.

| Bridge | What the primary source supports | Design implication, which is our inference |
| --- | --- | --- |
| AI + mathematics → assistance in finding useful patterns and forming conjectures | Davies and colleagues used machine learning and interpretation to help mathematicians find relationships and develop mathematical arguments. Their process depends on human mathematical judgment; finding a pattern is not proving a universal claim. [Nature, 1 December 2021](https://www.nature.com/articles/s41586-021-04086-x). | A conjecture can be an intermediate to handle and test. Avoid presenting a confident generated sentence as an established theorem. |
| AI + mathematics + formal verification → search for checkable proofs | AlphaProof searches in Lean's formal environment. The kernel checks the resulting formal proof construction. The original announcement appeared in July 2024; the full research article was published online on 12 November 2025. [Original announcement](https://deepmind.google/blog/ai-solves-imo-problems-at-silver-medal-level/), [Nature paper](https://www.nature.com/articles/s41586-025-09833-y). | Proof search and conjecture assistance are distinct capabilities. A checked derivation concerns a formal statement under its formal assumptions; it is not an empirical guarantee about biology. |
| AI + genome → prediction of regulatory measurements and variant effects | AlphaGenome maps DNA sequence to predictions across several functional genomic measurements. The announcement was in June 2025 and the Nature article on 28 January 2026. Predictions can compare alternative and reference sequences. [Original announcement](https://deepmind.google/blog/alphagenome-ai-for-better-understanding-the-genome/), [Nature paper](https://www.nature.com/articles/s41586-025-10014-0). | “Regulatory prediction” is a more honest result than “understanding life” or “a cure.” It provides hypotheses to compare with evidence, rather than making experiment unnecessary. |
| Perturbation + measurement → evidence about regulatory relationships | Perturb-ATAC combines CRISPR perturbation with chromatin accessibility measurements in single cells. The study uses interventions and observations to investigate regulatory relationships. [Rubin and colleagues, Cell, 2019; authors' abstract](https://pubmed.ncbi.nlm.nih.gov/30580963/). | Predicting an outcome and intervening to test a mechanism are different moves. A game can model that distinction without pretending to reproduce the experimental method. |

The local catalogue may choose one bridge to introduce first. Its description should say what that bridge enables; it should not imply that “AI + Mathematics = Proof” exhausts the relationship between the disciplines. Later context can expose another genuinely different bridge. For the current small sketch, a single noun pair producing several unrelated results at random would restore the author's ontology problem.

## Screen 1: the research-toolkit shopping list is rejected

The ten concepts are AI, Mathematics, Genome, Logic, Experiment, Machine Mathematics, Regulation Prediction, Perturbation Assay, Proof Workflow and Model Comparison. Five public recipes unlock the latter five. This is an explicitly simplified catalogue, not a scientific model of automatically obtaining proofs or causal conclusions.

The script exhaustively checks all 31 nonempty subsets of the five unlockable concepts as goals. An exact shortest-path planner wins 31/31. A context-blind policy that takes the first unused legal pair also wins 31/31, using at most the same five fusions. The whole catalogue can be saturated with this shared sequence:

1. AI + Mathematics → Machine Mathematics.
2. AI + Genome → Regulation Prediction.
3. Genome + Experiment → Perturbation Assay.
4. Machine Mathematics + Logic → Proof Workflow.
5. Regulation Prediction + Perturbation Assay → Model Comparison.

A deliberately weak policy that only takes a recipe whose immediate output is named in the goal wins 14/31. Comparing only that policy against the planner would manufacture an impressive looking planning gap. The novelty policy exposes the simpler explanation: this tiny challenge is following prerequisites, with no useful distinction between contexts beyond the requested names. Do not promote it or rescue it with a five-action allowance.

This conclusion is deliberately narrow. Finite monotone catalogues have an exhaustive closure procedure, but that fact does **not** show that every construction or deduction puzzle is trivial. Brute force can coexist with a worthwhile insight. What fails here is the small shared script and the lack of any inference beyond the named recipes. A huge possibility space needs its own empirical test; making saturation cumbersome is not automatically depth.

## Screen 2: make an experiment that separates explanations

This tests a different source of uncertainty. All legal contacts are shown. All candidate mechanisms and their forecasts are shown. The unknown is which candidate governs this particular fictional world. The result of an experiment is an observation of that world, rather than a hidden recipe being discovered.

Seven concepts suffice: Probe, condition A, condition B, joint condition AB, Observation A, Observation B and Observation AB. The four recipes are public:

- A + B → AB.
- Probe + A → Observation A.
- Probe + B → Observation B.
- Probe + AB → Observation AB.

Each fusion leaves its parents, produces the unique child and becomes a completed pair. Observation children retain the measured binary outcome. Probing the same condition again adds no information and receives no invitation. AB is a deliberately simultaneous condition, not an instruction to an assistant to run two experiments. These are invented Boolean mechanisms, not a model of real gene regulation.

| Public candidate | A alone | B alone | A and B together |
| --- | --- | --- | --- |
| AND | 0 | 0 | 1 |
| OR | 1 | 1 | 1 |
| XOR | 1 | 1 | 0 |
| Relay A | 1 | 0 | 1 |
| Relay B | 0 | 1 | 1 |

The first context admits AND, OR and XOR. The second admits Relay A, Relay B and XOR. These are different causal possibilities, rather than renamed targets. Suppose the player has just observed A = 1:

- In the first context, OR and XOR remain. B alone produces 1 under both and cannot separate them. Combining A with B, then the resulting AB with Probe, supplies the distinguishing observation.
- In the second context, Relay A and XOR remain. B alone separates them. AB also separates them, but constructing it adds a fusion without adding a useful distinction.

This is a real consequence of the same fully known combinations in different public contexts. Choosing a redundant probe is recoverable: keep the observation, then perform a useful experiment. Nothing has been used up.

The exact screen evaluates all three possible true mechanisms per context, with a uniform prior used only for the diagnostic averages below. It also enumerates all six fixed orders of the three possible probes.

| Context | Optimal mean observations | Optimal mean physical fusions | Information-greedy mean fusions | Uniform random order mean fusions |
| --- | --- | --- | --- | --- |
| AND / OR / XOR | 1.67 | 2.33 | 2.33 | 2.67 |
| Relay A / Relay B / XOR | 1.67 | 1.67 | 1.67 | 2.22 |

Fusions and observations are evidence about the policies, not currencies or player quotas. AB requires a preparation fusion and a probing fusion; each single condition requires only probing. No policy loses because it takes more actions. A fixed exhaustive order eventually identifies the mechanism in both contexts. That is an honest baseline, not an automatic disqualification.

Reusing the first context's fixed rule, “A, then AB if necessary,” transfers poorly in efficiency to the second context: it uses 2.33 mean fusions instead of 1.67. Reading what separates the remaining candidates transfers correctly. This is an exact policy comparison, not an agent-learning experiment. There is no deep planning result: greedy information per fusion matches the exact planner, and the consequential decision is currently one comparison between two public forecasts. This is a plausible tutorial for an experiment-design skill; it has not earned promotion as the full game.

The information boundary must remain explicit in any browser probe. Hover should show candidate forecasts and that the result will be an observation. If hover instead reveals the actual unknown outcome without performing the experiment, hovering has already made the measurement; the screen no longer tests physical experimental choice. Conversely, hiding which pairs are legal would violate the intended discoverability. This distinction is a proposal to test with the owner, not permission to erode the praised hover feature.

## A civilization as an arrangement of mental capabilities

The user's new lens connects memory, number, enduring collective intent, communication and AI judgment or deceit as ways of extending mental faculties. Use that as a design vocabulary, rather than claiming a verified universal account of historical progress or one inevitable route to a singularity. An institution could be a persistent relationship among capabilities; a new technology could change who remembers, who can compare evidence, who can coordinate and whose mistakes propagate. The interesting object would be that relationship, not a stockpile of books, computers or administrative points.

One concrete small choice is **where scrutiny belongs when memory becomes shared**. A witness's testimony may be combined with Scrutiny before transmission, or combined with Privacy before it enters a public archive. The resulting child carries its visible evidence and disclosure properties. Testimony, Scrutiny, Privacy and Transmission all remain; there is no payment, depletion or need to collect duplicate witnesses. Publishing a child has a world consequence: subsequent transformations do not erase a disclosure that already occurred. The scenario can ask for a reliable shared warning while protecting a vulnerable source. It must show the data flow and the consequences, rather than ask the player to choose a finished institutional policy from a menu.

That sounds consequential, but its first tiny screen exposes a universal solution. The invented protocol has three operations: scrutinize a testimony bundle using its visible origin, redact its origin while preserving any completed check, and publish the current child. A forged message may accompany the authentic one; the authentic witness may or may not require protection. The two possible true warning values, forgery present/absent and protection required/not required produce eight cases. All six operation orders are executed by the screen. **Scrutinize → Redact → Publish wins all eight.** This is a toy protocol definition, not a claim about what real privacy or verification systems can do.

Thus the apparent scrutiny/privacy tradeoff does not earn a challenge: a short known safe chain resolves it everywhere. Harmlessly acquiring both optional capabilities first also dominates delaying either one. Since parents remain, an unhelpful unpublished child can be set aside and the original testimony reused; unsuccessful routes are not necessarily lost sessions. Do not restore difficulty with scrutiny credits, a material allowance, an unexplained exception that breaks the safe chain, or a timer whose only purpose is to prevent learning all the safeguards.

The useful next hypothesis concerns **which connections safeguards govern**, not whether the player owns them. For example, a shared archive might reconcile intentions but also make several apparent witnesses depend on the same origin; independent archives might preserve disagreement but leave a public warning unresolved. This suggests a tiny future relationship puzzle, with every dependency and local combination exposed. It has not been simulated or established as interesting here. Before implementing it, test a configuration with every safeguard available and applied everywhere: if that always achieves every goal, the proposed choice has collapsed again. The presence of catastrophic outcomes or several named paths to a singularity would not by itself fix that collapse.

## What this pass earns

Keep interdisciplinary methods as a promising vocabulary and offer the current catalogue as a free sketch. Reject the toolkit goal as an established challenge. The diagnostic laboratory earns a small browser experiment if capacity permits: can a player physically compose a condition, use a public forecast to choose a useful comparison, and recognize why an observation eliminated an explanation? Its current three-candidate size may be a very short teaching encounter.

For a stronger later screen, change the public candidate structure and test transfer, redundant observations, useful compositions and recovery. Preserve all legal previews and unlimited access. Do not use a minimum-query score, a statistical policy gap, or an agent's confident explanation as a surrogate for human enjoyment. The executed result here concerns causal discrimination under toy rules; tactile quality and enjoyment remain unmeasured.
