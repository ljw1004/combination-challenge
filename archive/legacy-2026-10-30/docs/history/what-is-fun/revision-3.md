# What is fun for Combination Challenge?

Working model, revision 3, reviewed before application. This document is a design hypothesis to improve through play, not a definition of every kind of fun or a validated measure of human enjoyment. UI work remains frozen. The immediate task is to discover a worthwhile logical game. [Revision 1](history/what-is-fun/revision-1.md), its [self-review](history/what-is-fun/review-1.md), [revision 2](history/what-is-fun/revision-2.md), and the [independent source review](interesting-decisions-research.md#independent-review-of-what-is-funmd-revision-1-before-application) preserve the changes.

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

For a game and a saved play, the evaluator should produce:

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

A level may change the local meaning of combination if its rules are explicit. We need not force geometry, processes, ideas and institutions into the same operator merely to reuse an implementation.

Compare three things: **semantics** (what the combination does), **skill** (what the player must work out), and **consequences** (what changes afterward). Joining a shape, transforming a living material and binding independent councils are candidate differences. Renaming shapes as ideas is not sufficient. Different truth tables can still invite the same familiar construction method. Ask what transferred and what required a new inference; do not equate a new vocabulary with a new kind of play.

## Principle-to-evidence contract

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

## How this document will change

The sources and pre-application reviews above informed revisions1–3. Next, try a game and implement an evaluator against this contract. Ask an independent reviewer whether the evaluator embodied these principles, what the experience exposed as missing, and whether either the evaluator or the document needs correction. Keep the previous revision and the reason for each change. A changed doctrine must not silently relabel old evidence as if its new criteria had been specified before those plays.
