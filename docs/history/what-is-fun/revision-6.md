# What is fun for Combination Challenge?

Working model, revision 6, revised after the first evaluator audit. This document is a design hypothesis to improve through play, not a definition of every kind of fun or a validated measure of human enjoyment. UI work remains frozen. The immediate task is to discover a worthwhile logical game. [Revision 1](history/what-is-fun/revision-1.md), its [self-review](history/what-is-fun/review-1.md), [revision 2](history/what-is-fun/revision-2.md), and the [independent source review](interesting-decisions-research.md#independent-review-of-what-is-funmd-revision-1-before-application) preserve the changes.

## What makes the player care about what happens next?

> The useful question is not how many combinations occurred, but what made performing them worth the player's attention.

The owner has identified **narrative sweep, beauty, philosophical resonance and the hook of discovering what comes next** as central personal motivations, citing their experience of Psychonauts 2. This is direct preference evidence for this project, not a universal claim about all players. The choice of what we combine belongs in the design from the start.

The current generative hypothesis is: **fun can arise when the player forms an intention, devises a combination that might realize it, observes a consequential result, and finds themselves wanting to act again.** The last part is an independent hypothesis. Intelligent action, victory and nontrivial choice do not establish it.

A game can offer a developing relationship between a player and a world, rather than a series of individually defensible decisions. The owner's examples distinguish anticipating and repairing disorder, pursuing an ambition against opposition, and growing from a tiny conceptual world into astonishing powers. They are experiential models to investigate, not equivalent configurations of a choice-count metric.

### The intention–construction–response–renewal loop

1. **Intention.** What does this player want to make happen? An assigned goal can seed an intention, but subsequent ambitions may be self-chosen. Record an actual intention or mark it unobserved.
2. **Tension and devising.** What gap, uncertainty, opposition or opportunity makes a combination worth imagining? All recipes may be known while their larger implications still invite thought.
3. **Consequential response.** What does the world do, and what does the player notice? The result should honor a coherent law, resolve or revise an expectation, and preserve a recognizable connection to their action.
4. **Renewed intention.** What now seems worth attempting? A useful result can open a new power, reveal a consequence, change an adversary's behavior or make a self-chosen project imaginable. Do not infer this from the mere existence of another legal move.

Not every action must traverse this entire loop. Several combines can enact one intention; a satisfying known action can be part of a larger ambition. Nor must every success create another emergency. Relief, appreciation, closure and choosing to stop satisfied are legitimate experiences. Distinguish eager continuation, satisfied completion, boredom, confusion and required compliance.

### Experience engines to invent with

The designer should choose a mechanism that might generate an experience over time, not merely assert that a state space is large. These are bold, testable proposals, not established laws of enjoyment.

| Engine | Possible sequence | Prediction worth trying | How it could fail |
| --- | --- | --- | --- |
| Anticipation and restored order | Notice a developing problem → invent an intervention → see order return → notice an opportunity the recovery makes possible | The player can name an anticipated problem and an intended next use of the recovered freedom | The same emergency repeats forever, or restoration leaves nothing the player values |
| Ambition, opposition and adaptation | Form a project → construct a strategy → encounter understandable resistance → revise while retaining an ambition | A player changes an approach in response to this opponent or world, rather than simply obeying the next objective | Random obstruction replaces a legible opponent, or every response is a prescribed counter-recipe |
| Expanding agency | Begin with a small conceptual world → invent an intermediate → discover a previously unavailable kind of action → imagine something larger | A prior result becomes a whole ingredient in a new, player-articulated possibility | Unlocks merely add nouns or postpone an obvious prerequisite chain |
| Consequences of one's ingenuity | Solve a problem → the solution changes a connected part of the world → recognize ownership of that change → choose whether and how to respond | The player names a new intention tied to a specific consequence of their own construction | Success is always punished with mandatory repairs, or the new problem could follow any action unchanged |
| A developing relationship | Act on a persistent actor/world → observe a characteristic response → revise expectations → try a new way of dealing with it | The next plan refers to something learned about this particular actor or system | A personified name hides a fixed menu, irrelevant dialogue or an endlessly resetting situation |
| Meaningful enactment | Understand a relation → realize it → reuse a familiar act with a new purpose or appreciated significance | The player values a concrete enactment or notices a changed role, not merely its novelty | The evaluator supplies a poetic meaning the player did not experience |

Narrative discovery can also be an engine: a combination reveals a surprising aspect of a world or character, advances an unfolding question, or makes a beautiful possibility imaginable. The next intention may be “I want to understand what this place is becoming,” rather than “I need to optimize the next move.” An evocative concept can be valuable in its own right, through meaning and association, without introducing a new algorithm.

Persistent places, actors, capabilities and consequences are candidate anchors for caring. A score can summarize an outcome, but adding a score does not supply a reason to care. Neither does appending a new independent puzzle. The intended continuity must be visible in the world's causal structure or in a player's developing purpose.

### Narrative promise, beauty and conceptual choice

For a candidate, the designer should name: **the world or person to care about; the unresolved narrative question; the concepts whose combination feels worth imagining; and a possible revelation or transformation that could deepen that interest.** A tiny written encounter is enough to test a promise. Logical-only development excludes interface work, not story, character, imagery in prose or philosophical meaning.

The fiction can invite an intention before a formal goal exists. Combining memory with a voice, intention with an institution, or a living process with a preserved form can suggest different kinds of creation. Those are illustrative design possibilities, not historically or scientifically unique recipes. Expose the local combination rules; do not make thematic association another hidden password.

A narrative may be linear and still be absorbing. A thematic change may matter even when mechanics are isomorphic. It would be wrong to infer new strategic depth from a new name, and equally wrong to infer that the new meaning has no value. Separate claims about decision structure, narrative curiosity, conceptual resonance and aesthetic appreciation.

For logical play, seek a particular passage, revelation, relationship or concept the player responds to, and a concrete question they want answered. Record whether that response was elicited or offered spontaneously. Prose that mechanically reflects a choice can support an agency claim; evocative prose can support a reported aesthetic experience even without branching. Neither is proved simply because a designer supplied a poetic label. Visual and tactile beauty remain outside this phase. The owner's own reaction to narrative and beauty takes precedence over an agent's taste.

### Locate the live question

A designer's proposed question, a question printed by the game, a player-adopted question, a known answer worth enacting, and a satisfactorily closed concern are different things. Record who posed the question, what was already disclosed, whether this player adopted it, and what appreciation, action or stopping followed. An authored option can be sincerely desired; self-chosen does not require inventing something outside the offered possibilities.

An interpretive revelation can matter without adding a new state-graph branch. A passage can also be appreciated even if its plot was known. For each claimed revelation, distinguish its earliest available exposure from reported reading, committing an action, and appreciating its enactment. Exact text matching detects some prior disclosure; it does not prove semantic novelty or that a player read everything available.

The first audit showed why this needs an implementation contract. Different report vocabularies hid the Bell player's quiet-memory appreciation and Mneme player's satisfied closure from the evaluator's summary. Preserve source paths, explicit absence, negative reports and unknown fields. A summary must not turn unrecognized language into missing experience.

### Separate designer and critic

The **designer** proposes an experience engine, an intended sequence of possible feelings/intentions, and a small coherent mechanism. Speculation is welcome. The designer need not prove fun before building a cheap logical experiment.

The **critic** asks whether the mechanism produced that sequence in play, checks alternatives and rival explanations, and proposes a falsifying next test. The critic must not demand statistical proof before every invention, nor treat uncertainty as a reason to stop designing. A negative finding should narrow or change a mechanism; it should not become an endlessly expanding warning checklist.

Roles and access should be recorded. An independent critic can audit the implementation and traces without inheriting the designer's desired verdict. Several agents agreeing is still correlated AI evidence.

### Test the invitation, not just the decision

Before play, specify a short required exposure and a genuine stopping point. After the first meaningful response, ask what, if anything, the player wants to attempt next **before suggesting a desirable answer**. Offer stopping as a fully valid way to finish the test. If they choose continuation, record the actual optional action and the intention expressed before it. A promise to play again is weaker evidence than doing so.

Do not call instructed completion voluntary. Report separately: an expressed future intention, an optional action actually begun, a concrete self-generated possibility, a satisfied stopping reason, and continued play required by the task. Agents can comply with an optional-play prompt without feeling absorbed; none of this establishes human motivation.

The experience account for each candidate must identify the immediate intention, the source of tension, the world response, the narrative question or valued object, and the proposed invitation. A missing link is a design question. If a player performs a clever construction but has no reason to act again, report a momentary insight or satisfaction rather than sustained absorption. When feasible, compare the same first interaction with a closed ending and a continuing consequence. If several mechanics change at once, do not claim the comparison isolates continuity.

## The experience we are trying to create

The player can understand a possibility, combine things to make it real, and find that the result changes what they can meaningfully do next. They can also enjoy enacting or expressing a relationship they already understand. They may feel inventive, curious, capable or expressive. New possibilities are one source of value, not a requirement for every action. The useful question is not how many combinations occurred, but what made performing them worth the player's attention.

For this project, the combination system must constitute the meaningful activity. Its inputs, their relationship or their order should explain the result. Each individual combine need not introduce new reasoning: mastered execution can enact an insight, intention or valued ritual. A recipe catalogue attached to an unrelated ability menu is weak evidence. All legal combinations and their rules may be known. We are not trying to make guessing the author's vocabulary enjoyable.

The player has inexhaustible access to established concepts. Do not manufacture tradeoffs with finite ingredient stocks, action credits or production chores. Time pressure is a possible game form, not the default cure for a dull construction problem.

## Interesting decisions are one route to fun

The owner's Sid Meier proposal is our main decision-making hypothesis: an interesting decision is informed, consequential, and presents a worthwhile choice without an obvious universal winner. This is our operational synthesis, not a verbatim Meier definition. His talk allows situational tradeoffs, consequences, understandable information and different play styles, while explicitly acknowledging limits of the decision lens for some puzzles and rhythm games. [Talk transcript, third-party transcription](https://raw.githubusercontent.com/dklassic/GDC-transcript/main/static/src/transcript/WggIdtrqgKg.txt), [contemporary report](https://www.gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions).

- **Informed:** the player can understand the relevant options and explain a plausible reason for choosing one. This does not require knowing the optimal multi-step plan.
- **Consequential:** alternatives change a relevant possibility, property, commitment or world response. Different names or animation do not suffice.
- **A real choice:** more than one option deserves consideration in the current situation. An obviously worse option is not a tradeoff merely because it exists.
- **A situated choice:** what is useful can depend on the world, goals or chosen approach. A short common winning routine can expose a solved problem.

Publicly available information establishes an opportunity to choose intelligently. It does not establish that the player understood it. A correct prediction, a relevant adaptation or a concrete player account can provide further evidence. These remain separate findings.

Not every action needs to be a strategic decision. A puzzle can offer one excellent insight followed by a short construction. A player can form a plan before the first move and still enjoy making it work. Count the plan as a possible decision episode; do not demand a new dilemma from every combine command.

A generic algorithm that eventually solves every finite puzzle is not the same as a short routine that makes these particular encounters uninteresting. Equally, overwhelming a solver with more possibilities does not establish depth.

## What a player might be doing

These are different activities to observe, not a hierarchy that awards points for the grandest label:

| Activity | What to look for | Common false inference |
| --- | --- | --- |
| Strategy | Choosing a lasting approach, relationship or commitment that shapes later possibilities | A long plan or large number of states automatically means strategy |
| Tactics | Responding to this situation using current capabilities | Every local choice is trivial because a long-term plan exists |
| Optimization | Improving an already working construction along a valued dimension | Smaller or faster automatically means more enjoyable |
| Construction/execution | Realizing an understood composition | A fully understood action must be busywork |
| Exploration/learning | Testing a relation or applying it in a new context | More discoveries prove curiosity or learning |
| Upkeep/overhead | Repeating actions to maintain a settled arrangement | Every upkeep action is either fun or tedious for everyone |
| Ritual/expression | Choosing an action for its felt significance, pattern or authorship | No measurable tactical improvement means no value |

The last two rows matter to the owner's hunch: combining may be familiar and repetitive while its meaning changes. The chores paper provides evidence about social board-game activities, not a general validation of solo repetition. Our solo-combining hypothesis needs its own evidence. Ask what repetition is doing for this player and preserve disagreement.

### Decision episodes

Before testing a candidate, name its proposed pleasure and the expected unit of thought. An episode starts with an unresolved question or choice of approach and ends when that question is settled, replaced, or abandoned. It may span a plan plus several combines; one irreversible combine can itself be an episode.

Use a player's brief annotation or a concrete report tied to actions to identify experienced episodes. If neither establishes the boundary or unresolved question, mark it unknown. Model analysis can separately identify opportunities for a consequential choice. Do not retrospectively split one plan into many episodes to raise a density score. Counts at different episode definitions are not comparable.

## Nonresource tradeoffs to investigate

Examples include flexibility versus permanence, independence versus coordination, breadth versus specificity, retaining a living property versus transforming it, and exposing information versus preserving privacy. These are candidate design materials, not automatic interesting decisions.

A real game must make both sides arise from the same coherent operation. If the player can harmlessly acquire and apply every safeguard first, the supposed tradeoff has collapsed. If one arrangement achieves every valued outcome better, the alternatives may be dominated. If every first move can still reach exactly the same outcomes, the consequential commitment may occur later. Find it rather than declaring every setup action strategic.

Test future joint achievability, not only immediate numbers. Two currently incomparable outputs can be merely a choice of order if a safe continuation obtains and applies both. Keep exact enumeration, bounded searches and unknown feasibility distinct. Reversible setup may be useful exploration even when it makes no binding commitment yet.

Distinct viable outcomes are evidence of a choice structure. They do not show that anyone cares about the difference. Compare alternatives from the same saved state under the same disclosed rules. A truncated search is not proof an alternative is impossible. Conversely, a unique-solution insight puzzle can be worthwhile without a Pareto frontier. A clear answer after the insight does not invalidate the earlier insight. The evaluator must identify which kind of pleasure the candidate claims to offer.

## Repetition, mastery and meaning

Classify repeated actions by their use and context, not their syntax. Combining the same pair to maintain the same settled result differs from reusing an established construction in a new role. Both differ from a familiar action performed because the player enjoys its rhythm or significance.

Ask: what does the player expect; what remains unresolved; what does this repetition make possible; would they choose to continue it? A claim of meaningful repetition needs a concrete example or player report. An absent report means unknown, not boredom. Likewise, an eloquent description does not establish enjoyment or correct understanding.

Do not rescue unwanted routine with an invented account of its possible significance. A player reporting that an action has become work is counterevidence for that player's experience, even though another player might value it. Preserve both rather than averaging away a disagreement.

An actionable counterfactual is: if this settled chain resolved automatically while preserving its logical result, what would this player lose? A new use, a chance to reconsider, authorship, a meaningful enactment or an explicitly valued moment may matter. Same final state does not prove that execution has no value. In a solo logical test, social/tactile reasons remain untested unless the relevant mechanism is actually present.

Logical play can test changing roles, inference, authorship and consequences. It cannot establish tactile pleasure, a pleasing rhythm of hand movements, or human emotional response. Keep those out of the current verdict rather than filling the gap with speculative UI work.

## The evaluator's job

For a game and a saved play, first produce an **experience-across-time account**: intention, tension, noticed response, renewed intention, and observed optional continuation or stopping reason. Then produce:

1. **The proposed pleasure:** what kind of experience this candidate claims to offer, and which observations could contradict it.
2. **A decision account:** a few concrete decisions with available information, a plausible alternative and the resulting difference. Include where the meaningful commitment actually occurs.
3. **A learning/reuse account:** what a construction or rule enables later; distinguish observed behavior from a report about understanding.
4. **An attention account:** what work is inference, execution, optimization or upkeep, and whether repetition has a new role or reported value.
5. **An adversarial account:** attempt an obvious dominant policy, a short universal routine, all-safeguards preparation and a cosmetic-variety explanation where applicable.
6. **A recommendation:** keep, change or reject one concrete hypothesis, with counterevidence and a next test.

Do not collapse these into a supposedly measured fun total. Report mechanical findings, player reports and evaluator interpretations separately. A numerical estimate can be a prediction to validate, but cannot become evidence for its own correctness.

The density idea is useful: worthwhile decisions can be diluted by irrelevant work. However, commands are not time, and an AI's tool latency or deliberation time is not human playtime. Report the numerator, denominator and access condition. Do not rename actions-per-game as interesting-decisions-per-minute. Bundling a solved chain into one command must not automatically improve the attention verdict. Track episode quality and valued execution separately.

## Source findings that change the rules

The [research note](interesting-decisions-research.md) records the access and interpretation in detail. These are design arguments and a narrow qualitative study, not a calibrated enjoyment model.

| Source actually accessed | Consequence for this doctrine |
| --- | --- |
| Meier's transcript and contemporary report, linked above | Use informed, consequential, situational decisions as one strong lens. Do not make every game or every action pass it. The transcript was read, not independently authenticated or watched. |
| Soren Johnson, [8 Things Not To Do, Part I](https://www.designer-notes.com/8-things-not-to-do-part-i/) | His decision/time expression warns about repetitive tasks with settled outcomes. Treat it as a heuristic. His correction about an existing shortcut also requires checking whether a purported chore is mandatory. |
| [Characteristics of Games publisher page](https://mitpress.mit.edu/9780262542692/characteristics-of-games/) and authorized contents preview | The relevant chapter text was not accessible. The owner's chapter6 paraphrase remains unverified here. Do not claim the chapter was read. |
| Richard Garfield, [Removing Busywork](https://magic.wizards.com/en/news/feature/removing-busywork-2006-11-27) | This accessible primary discussion supports investigating decided play and burdens, while preserving activities whose enactment or unfolding has value. It is a related source, not a substitute claim of access to the book chapter. |
| Oliver Kiley, [This Thing Called Strategy](https://explorminate4x.wordpress.com/2016/07/15/this-thing-called-strategy-an-exposition/) | Distinguish choosing an objective, actualizing it, optimization and maintenance. This is a stated preference/theory, not consensus that puzzles or hard calculation are invalid games. |
| Xu and colleagues, [DiGRA paper](https://dl.digra.org/index.php/dl/article/view/591), [full text](https://dl.digra.org/index.php/dl/article/download/591/591/588) | Chores in the observed group board-game sessions supported social activities. This does not establish that arbitrary solo repetition is fun. Seek the actual supporting mechanism and acknowledge excessive chores. |

## Tests that should catch a bad evaluator

- Many labels lead to the same world: no consequential-choice credit.
- One option dominates every other: do not count the menu as a dilemma.
- A player correctly builds an elegant three-step answer: do not reject it just for brevity or an early insight.
- A player repeats a known action in a new functional role: do not automatically call it upkeep.
- A player explicitly enjoys familiar repetition: preserve that report even if no new skill is learned.
- A player reports satisfaction while predicting the rules incorrectly: keep pleasure and understanding separate.
- All player reports are absent: subjective findings remain unknown.
- A game is solved by exhaustive enumeration: report the cost and method before deciding whether it is a shortcut.
- Several nondominated endings exist but differ in arbitrary points: structural variety alone does not establish meaningful tradeoffs.
- A familiar expert solves the whole puzzle immediately: investigate prior skill before concluding the puzzle is universally trivial.

## Different ways of combining

A level may change the local meaning of combination if its rules are explicit. Its philosophical or narrative meaning can also change what the player cares about, even when part of the algebra transfers. We need not force geometry, processes, ideas and institutions into the same operator merely to reuse an implementation.

Compare three things: **semantics** (what the combination does), **skill** (what the player must work out), and **consequences** (what changes afterward). Joining a shape, transforming a living material and binding independent councils are candidate differences. Renaming shapes as ideas is not sufficient to establish a new inference, but the ideas may still contribute narrative or conceptual value; test that claim separately. Different truth tables can still invite the same familiar construction method. Conversely, the same familiar method can acquire a new significance through a developing story. Ask what transferred and what required a new inference; do not equate a new vocabulary with a new kind of play.

## Safeguards supporting the experience theory

F1–F10 are useful critics of false positives. They support the generative account above; passing them does not demonstrate absorption or invent the next compelling mechanism. In particular, their cosmetic-variety warning rejects a false claim of strategic novelty, not the possibility that theme, narrative or beauty gives the player real value.

### Principle-to-evidence contract

These IDs are an audit contract, not a checklist that every game must score positively on.

| ID | Principle | Evaluator obligation | A failure the audit should catch |
| --- | --- | --- | --- |
| F1 | State the proposed pleasure | Declare decision, insight, exploration, expression or valued repetition as a hypothesis; record what could contradict it | Treating every game as an optimization puzzle |
| F2 | Separate information from understanding | Record available rules/previews separately from player predictions and adaptations | Public preview counted as demonstrated learning |
| F3 | Establish relevant consequences | Replay plausible alternatives from one state; compare meaningful world/capability effects and exact feasible continuations where possible; locate deferred commitments | Cosmetic labels or an impossible alternative credited as a dilemma |
| F4 | Test tradeoffs without forcing them on every pleasure | For a decision claim, look for defensible choices and counterexamples to dominance; for insight, identify the actual construction inference | Rejecting an elegant unique solution or inventing a resource budget |
| F5 | Locate the unit of thought | Declare episode boundaries or mark them unknown; allow one plan or insight to cover several actions | Counting each command as a strategic decision |
| F6 | Treat repetition as an empirical question | Record context/role changes, reports of value, unwanted routine and the automatic-resolution counterfactual separately | Repetition automatically penalized or automatically romanticized |
| F7 | Test reuse and development | Identify a specific prior construction used in a later functional role; do not equate collection with mastery | More unlocked nouns counted as richer play |
| F8 | Respect attention and evidence limits | Name every denominator; distinguish agent time, action count and human playtime; retain uncertainty and prior expertise | A fabricated fun-per-minute score |
| F9 | Close the loop | Give a source-linked hypothesis, actual test, counterevidence, revision and a new test | Static judgments that do not change after play |
| F10 | Test qualitative variety | Compare semantics, skills and consequences across levels | The same task reskinned as a new philosophy |

An implementation should expose which obligations it can check mechanically, which require reviewed player evidence, and which remain unknown. The post-play reviewer should mark coverage, cite a concrete trace or fixture, and identify the most consequential mismatch. It should not simply agree that the document sounds reasonable.

## Test the longer sweep

The owner's new design target is about30–40 minutes at roughly one decision every10 seconds: approximately180–240 decision opportunities. This is a scope target, not permission to pad a game to a minimum command count or declare AI tool time to be human playtime.

A long prototype should keep places, actors, earlier inventions and consequences alive across the arc. Qualitatively different combination laws should give existing creations new roles. A connected world is a hypothesis for sustaining intentions; a long scene list or a large menu does not establish it.

Use two clearly labeled conditions where feasible: a mandated long diagnostic to expose the middle and late game, and an elective-interest condition with valid stopping checkpoints. Forced completion of180 interventions is coverage, not appetite. At approximately30,60,120 and180 commitments, record the current intention, live question, meaningful reuse, valued enactment or burden, and why the player would or would not choose another action. Count player decision episodes separately from interventions. If the game naturally resolves early or runs out of meaningful choices, retain that failure rather than adding ceremonial actions.

## Audit and revision contract

For each played candidate, keep a reviewed ledger of which experience hypotheses to retain, change, reject or leave untested, with supporting and opposing trace references and a new falsifiable experiment. Copying the designer's pre-play next-test sentence is not closing the loop.

Verify elective construction against a valid earlier checkpoint and recorded intention. Keep a chronological choice log; distinguish continued construction, optional inspection, choosing closure and required action. A linked new session must have prospective provenance, not merely an arbitrary matching filename. These checks establish protocol behavior, never intrinsic human motivation.

The independent [first audit](fun-evaluator-audit-1.md) evaluated revision5's implementation against four actual plays. Revision6 incorporates its report-preservation, live-question, disclosure, chronology and evidence-linked revision findings. A correction by the audit author should be identified as such; subsequent verification should not be mislabeled independent of that implementation.

## How this document will change

The sources and pre-application reviews informed revisions1–3. The owner's temporal-experience critique led to revision4: generative engines and observable renewed intention now precede F1–F10. Revision5 adds the owner's narrative, beauty and philosophical motivations and corrects the earlier tendency to treat thematic changes as valueless. Next, review that extension, try a game and implement an evaluator against this contract. Ask an independent reviewer whether the evaluator embodied these principles, what the experience exposed as missing, and whether either the evaluator or the document needs correction. Keep the previous revision and the reason for each change. A changed doctrine must not silently relabel old evidence as if its new criteria had been specified before those plays.
