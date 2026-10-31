# Three challenge concepts and the first selection

These are original design proposals for this prototype, not descriptions of existing games. The adjacent-game comparisons and designer claims belong in [research.md](research.md). The intended experience is **a readable problem, a plausible invention, and a visible consequence that changes the next decision**. All three proposals reveal each currently available recipe, retain ingredient concepts, and spend one action per discovery or deployment. World objects can be consumed without deleting concept access.

## 1. The sanctuary and the determined traveller

**Situation.** A traveller is approaching a sanctuary along three connected paths. Ringing the sanctuary bell ends the encounter; the player must buy enough time to prepare it. The traveller has a readable motive: avoid dangerous terrain, take the shortest safe route, then break an obstruction when no shorter safe route exists. Show the next action and the rule that selected it. A rule learned in encounter one must remain true in encounter three.

**Skill.** Predicting a person's response and arranging interventions around it. The player chooses between directly slowing the traveller, inviting a detour, and developing a lasting protection. Threat motion gives each construction a local use rather than converting recipes into abstract attack points.

**A concrete decision.** The traveller will cross the centre approach next turn. Mud is available now. Deploying it at the centre forces a one-turn detour to the left; this buys discovery time but changes the future approach. Alternatively, develop a brick barrier while the traveller advances. That barrier blocks for longer, but the player must spend the next deployment on the traveller's new lane. In the larger proposal, a sanctuary seal offers a finite endpoint; barriers should create opportunities to finish it rather than become an endless stun cycle.

**Three short encounters.** First, teach the avoidance rule with a harmless visible detour. Second, put a protected companion on a different route and show the traveller's priority rule before the choice. Third, require protecting a bridge while preparing the bell, so a successful delay changes the next objective. Personality should consist of a small explicit priority list, not arbitrary intelligent counterplay.

**Small test.** A three-lane approach, a single visible traveller, six constructed concepts, ten-turn cap. Compare a greedy delaying policy with a goal policy and a shallow planner. Inspect whether barriers alter future plans or simply demand a replacement every turn.

**What could make it worthwhile.** The traveller's response can make constructions feel addressed to someone. A deliberate detour can reveal understanding of a motive, and a later encounter can test transfer.

**Rejection gate.** Reject this implementation if the best robust plan is to place the same cheap obstacle in the current lane every turn, or if the only satisfying resolution is a memorised preparation chain. Do not rescue it by adding many arbitrary personalities before the core decision works. The cheap screen below triggers both concerns, so this version is parked.

## 2. A town above the spillway — selected direction

**Situation.** A finite storm pushes water through three connected terraces. Two contain assets; the lower terrace leads to a safe tidal outlet. The player starts with a few elemental concepts, inspects the next pulse, and chooses what to discover or place. Water remains water: a wall redirects it, a basin stores a finite amount, plants absorb it, and a channel sends it toward a lower route. The final storm pulse and its subsequent runoff create an explicit endpoint.

**Skill.** Planning flows across space and time. The player must distinguish a temporary buffer from a durable solution, reason about what happens to diverted water, and decide when invention is worth allowing a pulse to advance. Several routes should succeed: temporary storage buys time for growth, a diversion sends water safely through a prepared lower route, or a longer recipe path builds a reliable drain.

**A concrete decision.** Four water units will reach the upper orchard. A levee can turn the flow south immediately, saving the orchard but sending it toward the lower workshop. A basin can hold part of the pulse while leaving the lower route clear. Alternatively, discovering reeds now might establish ongoing absorption, but the orchard must tolerate the current pulse before the new concept can be deployed. After the levee decision, the next choice changes: make the lower route safe or reverse the diversion. This is a specific plan consequence, not merely a different damage amount.

**Three short encounters.** First, a single asset and a visible safe outlet teach diversion. Second, a valuable downstream site makes the same diversion rule consequential. Third, delayed growth and a forked flow permit either a temporary intervention plus a permanent route, or a more expensive direct drain. The teaching rule is preserved; the context changes.

**Small test.** Three lanes, a few build slots, one deterministic pulse process, and one action per world step. Keep the number of concepts small enough that every available novel recipe fits on screen. Compare separate discovery/deployment against discovery that also creates the first instance. Compare pressure schedules only after action consequences are clear.

**What could make it worthwhile.** Inventing a route that resolves the source of a problem can produce relief and a sense of authorship. Directional effects make the player's construction and its consequence inspectable. The world needs no extra theory of personality before the combination question can be tested.

**Rejection gate.** Reject a version in which repeating cheap absorption always dominates routing, or in which one permanent absorber can be copied everywhere and solve every scenario. Reject a version in which discovering a visually interesting concept is usually a trap because its action cost makes recovery impossible. Watch for an apparent puzzle that has only one hidden prerequisite chain.

**Selection.** Continue this direction because it lets us inspect spatial consequences with fewer interpretation rules. This is a reasoned choice of experimental tractability, not evidence that floods are more enjoyable than opponents. The tiny screen exposes shallow strategies in both candidates; the playable routing model must answer those failures rather than merely grow the menu.

## 3. The retreating armada — preserved campaign idea

**Situation.** Play the defending commander as a heroic ship advances from your fortified home toward its own border. The campaign is an advancing front, not literal reverse time. Early encounters give the commander heavy ships and strong installations. Later encounters reduce material advantage while the player's knowledge of formations, timing, and enemy movement grows. The hero retains a visible, consistent movement policy within an encounter; changes in upgrades must be announced rather than used as hidden difficulty balancing.

**Skill.** Shaping movement with formations and timing. Combining concepts constructs a capability: for example, a buoy plus a signal creates a decoy emitter, and an engine plus a shield creates a slow protected escort. Each unlocked capability remains available; an action deploys a formation into a visible segment of the approaching battle. A turn-based timing strip would be cheaper to test than a complete scrolling action game.

**A concrete decision.** The hero will enter the centre corridor in two beats. Deploying a wide weak formation now encourages a dodge toward the left edge, setting up the existing left emplacement. Spending the beat discovering an armoured escort offers a later interception but leaves the hero free to choose the right corridor. The intended insight is arranging a weak unit so that the hero's evasive move makes a later threat effective. Attrition alone is a poor substitute for that insight.

**Three short encounters.** First, several powerful threats make the hero's dodge rule visible. Second, remove one heavy emplacement while preserving the movement rule. Third, provide a sparse set of weak units whose timing can still create a crossfire. The reward for mastery is achieving more with less, rather than watching numerical strength rise.

**Small test.** A three-lane timing strip and five scripted hero policies; no scrolling renderer, projectiles, upgrade economy, or campaign persistence initially. Compare a single strong placement with a formation that redirects the hero. The question is whether weak units become interesting through arrangement, not whether a bot can evade bullets.

**What could make it worthwhile.** The shrinking material advantage could make learning visible across encounters, and formations could give construction a compositional use.

**Rejection gate and decision.** Park it for this elemental slice. It introduces hero navigation, collision or targeting rules, formation timing, and campaign inversion before showing why element combinations help. Those mechanics could independently carry a game; that would leave the combination hypothesis unresolved. Retain the campaign idea for a separate prototype if the routing slice fails or an elemental formation mechanic earns its place.

## Executed cheap screen

Run `node experiments/candidate-screen.ts` with Node 25 or another runtime that supports TypeScript type stripping. It prints a complete reproducible JSON report, including two paired opening branches per model. It uses seeds **1–12**, ten world steps per run, four model-informed policies, and six derived concepts. No dependency installation is required. The executable is intentionally independent of the production engine so that these rejected abstractions remain inspectable.

**Access condition.** These are mechanical policy screens, not blind subagent playtests. Every policy knows the rules. The depth-four, beam-18 planner can call the transition model and consequently sees the deterministic future schedule. The goal policy is a hand-authored strategy using knowledge of the recipe graph. These results must never be pooled with fair AI-player results or human findings.

**Model differences.** The flood model has three catchments, finite absorption, drains, and a brick levee that sends one incoming unit into an adjacent catchment. It abstracts away columns, transit time, growth, safe outlets, and delayed runoff. The hero model has three approaches, an avoidance/breaking rule, repeatable obstructions, and a discoverable gate that ends the encounter. Their different rules and endpoints make this an exploratory comparison; equal win rates do not mean equal difficulty or enjoyment.

| Candidate | Policy | Wins / 12 | Mean discoveries | Mean identical adjacent actions |
| --- | --- | ---: | ---: | ---: |
| Flood | Random legal | 4 | 3.08 | 0.58 |
| Flood | Greedy immediate utility | 12 | 1.00 | 1.67 |
| Flood | Goal-directed | 12 | 2.00 | 0.92 |
| Flood | Depth-four model planner | 12 | 2.75 | 1.00 |
| Traveller | Random legal | 5 | 3.00 | 1.08 |
| Traveller | Greedy immediate utility | 12 | 1.00 | 6.33 |
| Traveller | Goal-directed | 12 | 4.00 | 0.00 |
| Traveller | Depth-four model planner | 12 | 3.67 | 0.33 |

The repetitive-action count is deliberately narrow: identical actions on adjacent turns. It misses repeated placements at different targets and cannot establish chore burden on its own. The utility function includes known concepts, which can encourage late discoveries that accomplish nothing. Such padding is a grader failure candidate, not evidence of curiosity.

### Decisions and counterexamples from the traces

- **Traveller, seed 4, mud opening.** The planner discovers mud, places it in the middle, follows the detour to the left, then places mud on the left for eight consecutive turns. The traveller stays at progress 1; the player wins at turn 10. The seven adjacent repeats expose a maintenance exploit. Success here says very little about a worthwhile sequence of decisions.
- **Traveller, goal policy, all 12 seeds.** Discover mud, roots, brick, and gate, then deploy the gate. All runs end at turn 5. This is an equally serious counterexample in the other direction: a fixed construction chain outruns the threat and makes its personality irrelevant. More sophisticated avoidance would not fix the missing reason to improvise.
- **Flood, seed 4, mud opening.** Discover mud, deploy it at the pressured catchment, and redeploy across the changing pulse locations. Only on turn 6 does the planner discover roots, followed by wetland on turn 7. The last three actions establish lasting drainage at the three catchments. The run wins with zero damage but spends four early actions on absorption.
- **Flood, seed 4, roots opening.** Permanent low drainage goes down on turns 2 and 3; mud and wetland are discovered on turns 4 and 5. Wetlands then replace the low drains. The run wins with zero damage, and all water is cleared by turn 7. This differs from the mud opening in timing and residual water, while reaching the same endpoint.
- **Flood, greedy policy, all 12 seeds.** Wins require only one derived concept on average. The tiny model therefore fails to establish a need for a combination network. A larger recipe graph would hide this failure if evaluated only by completion.

The two flood branches are viable openings with different timing, but this screen does **not** demonstrate that either branch offers sustained worthwhile decisions. Both converge on coverage by absorbers or drains. In particular, the roots/wetland path mostly replaces smaller numbers with larger ones. The next prototype should make direction, target occupancy, delayed growth, and downstream consequences change the plan; adding these factors together makes that next comparison exploratory rather than a causal test of one variable.

## What the selection commits to testing

Continue the environmental direction, preserve these failures, and test the following claims against the playable version:

1. A temporary construction can buy an action for a lasting intervention without becoming a compulsory repeated job.
2. At least two defensible plans differ in what happens downstream, rather than only in final score.
3. A rule learned in the teaching encounter supports a new inference in a held-out layout.
4. Increasing available concepts does not earn credit unless they alter a decision or consequence.
5. Forecast and outcome agree closely enough that a failed plan can be revised from visible evidence.

The strongest evidence against continuing is already present: both simple candidates are easy for informed policies, and the flood model permits a one-concept solution. The reason to continue is the new routing experiment's ability to address that concrete failure cheaply. No human enjoyment finding has been collected here.
