# Returning to the sources after the first production experiments

Date: 25 October 2026. This revisits the original text rather than treating the initial research as settled justification. The initial interpretations remain in [research.md](research.md). The evidence below is mechanical screening and one blind agent's play, with **zero human participants**. Enjoyment is unvalidated.

## Evidence being explained

The historical run files, rather than the mutable latest `screen.json`, establish these development results across three scenarios and twelve seeds per scenario:

| Rule condition | Policy | Wins | Mean discoveries |
| --- | --- | --- | --- |
| Separate discovery action | Privileged planner | 32/36 | 0.000 |
| Separate discovery action | Greedy relief | 12/36 | 0.000 |
| Discovery with immediate placement | Privileged planner | 36/36 | 4.278 |
| Discovery with immediate placement | Greedy relief | 36/36 | 2.889 |

Source files are `results/runs/separate-*-planner.json`, `separate-*-greedy.json`, `field-*-planner.json`, and `field-*-greedy.json`. These algorithms are diagnostics; the planner has privileged transition access. A high planner completion rate is evidence of reachable solutions under its budget.

The recorded fresh agent run [blind-field-a.json](../results/players/blind-field-a.json), build `0.4.0`, rules `field`, scenario `confluence`, seed 4, contains nine decisions. It established a north grove, deployed a middle grove, established a downstream outlet, and deployed an upper diversion. It then waited five times. Its nine declared damage vectors all match the actual damage; the run ended with both assets standing. The supervising agent reports final health of 6/7 and 5/7, and that the player made its predictions without using the preview command. The trace itself records predictions and events, rather than command-access history. Isolation was instruction based.

The player reported that the second half had become settled and lacked meaningful decisions. That is an **AI report**, consistent with the five-wait suffix, rather than a human-experience finding. Its discovery of misleading reed text and a duplicate scenario-wave description identifies presentation faults; these are separate from the pacing diagnosis and require corrected observations before another clean comparison.

## 1. Koster: a changing problem matters more than repeated verbs

**Source revisited:** Raph Koster, 3 November 2025, [Game design is simple, actually](https://www.raphkoster.com/2025/11/03/game-design-is-simple-actually/), sections Three and Four. Author article reread; no video involved. Koster distinguishes an action loop from progressing through situations in which the answer changes.

**Original interpretation:** Reusing a consistent elemental property in a different arrangement can create mastery; readable responses support better predictions.

**Observation:** The agent's first four actions constructed a coherent route, and every damage prediction matched. The remaining five turns offered no needed revision.

**Revised inference:** The rules appear legible for this agent, but the encounter stops posing a useful problem well before its displayed endpoint. Correct prediction can mean successful learning or exhausted uncertainty. The grader must distinguish those explanations. Adding late water that the same fixed route handles would lengthen the encounter without restoring a decision.

**Next falsifiable test:** In matched runs, record the last consequential construction and the remaining safe-wait suffix. Test a small scenario change that makes the timing or location of one existing tool matter later. Retain it only if a defensible alternative and a recoverable revision appear; extra action count by itself fails the test.

## 2. Ma: creative room still needs competing priorities

**Source revisited:** Justin Ma's answers in Joel Couture's 23 February 2018 [Into the Breach interview](https://www.gamedeveloper.com/game-platforms/road-to-the-igf-subset-games-i-into-the-breach-i-), questions on collateral damage, telegraphs, and tactical appeal. Written interview reread; no talk watched. Ma ties creative play to interacting tools and changing priorities, while allowing slightly generous difficulty.

**Original interpretation:** Exact information and some breathing room can support invention. Diversion threatening another asset should create competing interests.

**Observation:** Immediate placement raises greedy and planner completion to 36/36. Two groves and a prebuilt outlet neutralize all later rain in the blind run.

**Revised inference:** Generosity may have removed the intended anticipation. The route expresses a useful idea, but its favorable completion does not show that later offers remain worthwhile. Neither returning to harsher damage nor automatically celebrating easier wins follows from the interview.

**Next falsifiable test:** Hold concept effects fixed and compare the existing schedule with one requiring a timing choice between immediate protection and completing the outlet. Inspect whether both routes remain viable, whether a plausible mistake can be repaired, and whether the player changes a plan for a visible reason. Reject a change that merely converts safe waiting into forced repairs.

## 3. Barth: discovery count cannot substitute for distinct problems

**Source revisited:** Zach Barth, 13 June 2012, [SpaceChem postmortem](https://www.gamedeveloper.com/design/postmortem-zachtronics-industries-i-spacechem-i-), What Went Right, item 1. Designer text reread. The account specifically describes removing logical duplicates rather than filling a campaign with reused solutions.

**Original interpretation:** Clear endpoints and open construction permit ownership; effective alternatives are worth preserving.

**Observation:** The separate-action planner wins 32/36 without any discovery. Immediate placement greatly increases discoveries, but the blind agent needs only groves and channels before waiting.

**Revised inference:** The baseline's recipe system is strategically bypassable. The variant makes discoveries useful, but that increase is also explained by obtaining a stronger deployment for one action. It does **not** isolate a pleasure of experimentation. A broad recipe menu can conceal a narrow effective vocabulary.

**Next falsifiable test:** Replay the same grove-and-channel opening on held-out arrangements, then branch a saved opening into a different mechanism with comparable health and action costs. If the same route is uniformly sufficient, revise the scenario family before expanding recipes. A solver's alternative establishes viability; a blind player's public cue establishes whether considering it was reasonable.

## 4. Teikari: cut support rules before rescuing content

**Source revisited:** Arvi Teikari's answers in John Harris's 8 May 2019 [Baba Is You interview](https://www.gamedeveloper.com/design/designing-i-baba-is-you-i-s-delightfully-innovative-rule-writing-system), question on building puzzles around words. Written designer answers reread. Teikari describes cutting interactions whose setups became excessively specific or required too many active rules.

**Original interpretation:** Coherent properties can unfold surprising uses; tested alternatives can inform variants.

**Observation:** Reed behavior was described inconsistently across conditions, and a descriptive wave list disagreed with the operative forecast. Deep recipes are unnecessary in the successful blind run.

**Revised inference:** Additional exceptions or recipe dependencies could make this slice harder while concealing its current strengths. Fixing mismatched descriptions is prerequisite work, not an aesthetic improvement to be credited as proof of fun. Unused deep branches need a demonstrated purpose or removal from the initial encounter.

**Next falsifiable test:** Give fresh agents corrected, single-source descriptions in normal and reversed offer order. Require one new interaction prediction. If misunderstanding persists, inspect effect ordering and vocabulary before adding explanation. Retain deep branches only when a trace shows a consequence that changes a later choice.

## 5. MDA: an expanding capability set is still a mechanic

**Source revisited:** Hunicke, LeBlanc, and Zubek, 2004, [MDA](https://www.cs.northwestern.edu/~hunicke/MDA.pdf), pages 2–3 on the design/player perspectives, experiential vocabulary, and dynamics. Paper text reread; no visual-layout analysis was needed.

**Original interpretation:** Revealed recipes plus scarce actions might generate improvisation and the feeling of ingenuity.

**Observation:** Immediate placement changes mechanical performance and discovery uptake. The agent constructs a defensible plan, then reports a flat settled second half.

**Revised inference:** The first causal link improved: inventions affect world behavior. The second link remains uncertain: these changes may produce convenience or a short puzzle rather than sustained inventive anticipation. The grader should preserve simultaneous support for readable invention and concern about pacing.

**Next falsifiable test:** Freeze the rubric before comparing the next variants. Require the evaluator to identify both a concrete choice and the strongest uneventful interval, using decision indices. An improvement claim fails if it relies solely on more discoveries, higher wins, or more favorable language.

## A narrower revision than adding more pressure

The five waits reveal two different questions: whether building the route was worthwhile, and whether manually advancing an already resolved threat adds value. They need separate experiments.

For the latter, test an optional **resolve the remaining rain** command when waiting through every remaining pulse satisfies the current objective. It should execute the ordinary deterministic wait transitions, retain every event in the replay, and display the water's route and final consequences. Compare it with manual waiting. Merely declaring victory early would hide the system response that makes the construction intelligible; requiring five identical confirmations preserves bookkeeping. An optional accelerated resolution can remove those confirmations while still showing the payoff. This is an interface hypothesis, not a claim from the sources.

For the former, compare the immediate-placement version against a condition with equivalent world-time/action allowance before attributing uptake to immediate experimentation. Otherwise, an increased action economy and access to stronger effects are sufficient explanations. The useful outcome may be a short construction puzzle with a visible resolution. If so, design around that endpoint rather than stretching it into nine turns of supposed tension.

The strongest current result is **legibility with practical invention in one blind agent trace**. The strongest counterevidence is **a solved second half and baseline success that bypasses invention**. Further work should test whether one coherent timing or spatial change creates a fresh decision without compulsory maintenance. Human pleasure, emotional pressure, fatigue, and voluntary replay remain unknown.
