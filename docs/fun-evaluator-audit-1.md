# Independent audit of the first fun evaluator

This audits `fun-evidence-2` against [doctrine revision 5](history/what-is-fun/revision-5.md), the narrative extension in [the research note](interesting-decisions-research.md), and the four raw `fun-*-1` captures. I had access to implementation, tests, design registration, generated profiles and player reports. I am an independent retrospective critic, not a fresh player or a human enjoyment judge. Existing game models were not changed. Line references below describe the evaluator at the start of this audit; later corrections should preserve that version and its outputs.

The evaluator implements useful safeguards, but its experience-first account does not yet embody the central theory reliably. Its most consequential actual error is losing the story players' appreciation and satisfied stopping evidence from that account. Its largest design omission is that post-play evidence never changes its recommendation. Passing the mechanical checks establishes neither absorption nor a reason to build a longer version.

## What the play actually supports

The raw reports remain intact under each profile's `evidence.player.report`. They are more informative than the top-level summaries.

| Capture | Intention → construction → noticed response | Renewal or closure actually reported | Defensible next decision |
| --- | --- | --- | --- |
| `fun-progress-1` | Recognize paired Boolean supports; build them; refine the completed whole with A. `report.episodes[1].value` calls the direct refinement the strongest moment. | All three goals were assigned. No stopping protocol or elective behavior. `report.wantAnother` expresses selective interest in a less obvious reuse problem; `report.overall` calls the exercise mildly satisfying. | Keep whole-as-ingredient recognition as a seed. Change the reason for the next construction; adding easy case tables is specifically warned against by this player. |
| `fun-council-1` | Bind A+B for the bridge, accepting B's first-climate harm. Forecast and seal match; the seal supplies no new response. | `report.closure`, `why` and `wantAnother:false` explicitly give satisfied completion and no unresolved question. Optional extra works/harms were available but did not become an ambition. | Keep as a static control for informed commitment. Do not promote its three nondominated profiles into evidence of sustained interest. |
| `fun-bell-1` | Restore the orchard with a safe river course; notice and appreciate exact, quiet remembrance; deliberately leave that valley. | `report.closure`, `furtherProjectSource`, `wantToDiscoverNext` and `optionalCombinations:0` say the offered memory project was not adopted. `passageThatMattered` and `storyAppreciation` support a specific thematic pleasure. | Keep quiet memory as a valid authored ending. Change the hook if sustained curiosity is the target; do not make this ending worse merely to force more actions. |
| `fun-mneme-1` | Preserve Mneme's identity while releasing the orchard; enact a two-step plan. Mneme's use of History to extend his old wish is noticed as coherent character behavior. | `report.renewedIntentionOrClosure` explicitly says satisfied closure and zero optional actions. The petal passage matters; `wantingMore` is low and no live question requires an epilogue. | Keep the combination/character connection and the distinction between remembering and possessing. Change the renewal mechanism if a longer relationship is the target. |

These are different limited successes and failures. Bell and Mneme supply positive narrative reports without a new mechanical frontier. They also supply counterevidence to the proposed optional hooks in these sessions. Both findings can be true. The reports do not establish human enjoyment, and one AI session does not settle a candidate's potential. It does justify a concrete design revision without another round of generic uncertainty.

## Priority 1: recover the actual experience before interpreting it

In the audited `fun-evaluator.ts`, lines 80–87 extract a few particular keys. `continuationEvidence`, lines 43–48, similarly recognizes only particular closure/renewal keys. This succeeds on the evaluator's small fixtures and the council's report vocabulary, but fails on the actual new narrative players.

| Raw evidence | Audited generated field | Consequence |
| --- | --- | --- |
| Bell `report.experienceSequence`, `noticedResponses` | `experienceAcrossTime.reportedExperience:null`, `noticedResponsesFromEpisodes:[]` | The sequence and noticed consequences disappear from the experience account. |
| Bell `passageThatMattered`, `storyAppreciation` | `narrativeOrConceptualReport:null` | An explicit response to a particular image is represented as absent. |
| Bell `renewedIntention:null`, closure and `wantToDiscoverNext` | Generic “Interest across time remains an open hypothesis” | The code requires both `renewedIntention===null` and `wantAnother===false`; Bell has no `wantAnother` key. Explicit non-uptake is treated like unobserved interest. |
| Mneme `experienceAcrossTime`, `noticedWorldAndCharacter`, `meaningfulConceptOrPassage`, `storyAppreciation` | Null experience/narrative fields and no noticed episode responses | The very account needed to test the proposed developing relationship is buried in the raw report. |
| Mneme `renewedIntentionOrClosure.{state,intention,optionalActions,reasonForStopping}` and `wantingMore` | `reportedClosure:null`; generic open-hypothesis interpretation | Satisfied closure and the absence of a live question are both missed. |
| Council `report.repetition` is an object with `valued`, `unwanted`, `neutral` | `evidence.player.repetitions:[]` | Its explicit warning that additional settled forecast commands would be overhead misses the repetition account. |

This is summary loss, not deletion of the raw capture. It still matters: `fun-evaluate.ts` lines 13–16 promotes the faulty interpretation into the aggregate that a designer will use to select the next experiment. A reader should not have to discover that null means “the extractor did not recognize this player's words.”

**Fix:** define a small canonical experience-report structure, with explicit adapters for these existing report versions. Preserve the original source paths, retrospective versus pre-action status, and any unrecognized relevant fields for review. Separate reported narrative appreciation, specific noticed responses, future wishes, concrete adopted intentions, satisfied closure, boredom and confusion. Missing evidence is different from an explicit negative report. Do not infer a favorable experience from a poetic passage supplied by the designer.

**Regression fixtures:** use the actual Bell and Mneme raw reports, not only mock reports written in the extractor's preferred dialect. Assert that the bell passage and petal passage reach the experience account; both players' reported closure remains visible; zero optional combines remains zero; and the summary states observed hook non-uptake alongside appreciation. Add the actual council repetition object. Keep the existing fixture that allows appreciation despite a wrong rule prediction and the one that allows appreciation without structural novelty.

Bell's missing pre-action prediction must remain missing. Its later `finish.intention` and retrospective sequence can support an ending choice; neither should be relabeled a recorded intention before the first combine.

## Priority 2: make the loop change a hypothesis and choose an experiment

The evaluator currently returns `design.nextExperiment` unchanged at line 108. Falsifiers are copied inside `design`; no finding checks whether one occurred. `principleCoverage` lines 96–106 consists largely of invariant descriptions of intended behavior. F9 says there is a next experiment, but [the doctrine's obligation](history/what-is-fun/revision-5.md) is a source-linked hypothesis, actual test, counterevidence, revision and new test.

The mismatch is concrete. Mneme's next experiment is still “Stop the required task at release. Record an optional intention and actual continuation, or satisfied closure without penalty.” The capture did that. Bell's next experiment still asks to use a valid checkpoint; its capture already has one. These recommendations would not change if the player eagerly continued, stopped satisfied, reported boredom, or supplied no report.

Nor is the current `experienceAcrossTime` a causal account yet: it places flat intention and response lists beside the design promise. It does not connect a particular intention, source of tension, combine, anticipated response, noticed response and next intention/closure. In Mneme, this distinction matters: the gallery response is an effective character beat in the player's report, but the second combine was already planned before the first. It is evidence of meaningful enactment, not observed tactical adaptation to an unexpected response.

**Fix:** add a small reviewed evidence ledger for each claimed pleasure and renewal mechanism. Each entry should have `keep/change/reject/untested`, supporting and opposing trace references, an interpretation explicitly distinguished from player words, and a new falsifiable test. A mechanical extractor can assemble the evidence; a recorded critic review can supply the interpretation. It need not invent an authoritative enjoyment score or pretend that free-text judgment is fully automatic.

For this application the ledger should at least say:

- Keep Bell's reported quiet-memory value; change the assumption that exposing the bell supplies a desire to transform it.
- Keep Mneme's coherent repurposing of a faculty and reported conceptual resonance; change the assumption that a menu of already understood grief answers supplies a live next question.
- Keep progression's whole-condition refinement; test a consequence-linked new use rather than counting another assigned table as renewed agency.
- Keep constitution as a control that separates defensible tradeoffs from appetite; do not request a larger civic optimization task merely because there are several Pareto profiles.

**A bold next experiment:** build one tiny continuing written encounter in which the player's first creation answers an immediate intention but reveals a specific unresolved fact about a persistent actor or place. Keep all legal recipes and mechanical consequences public. The optional construction should answer that fact or reinterpret the relationship, rather than supply another announced reward or mandatory repair. At the first valid stop, capture the player's own next question before asking about designer-named projects. Compare it with an equally polished complete ending, using fresh exposure. Predict a response-specific curiosity and an actually begun optional combine; retain appreciation and satisfied stopping as separate valid outcomes. If players still regard the optional result as an already known statement, change the invitation again instead of merely lengthening the chain.

This recommendation is a hypothesis to invent with, not a claim that withheld story alone creates fun. A longer campaign can test sweep only if it gives a continuing purpose or question; more required encounters cannot stand in for observed renewal. If several features change between prototypes, report that comparison as exploratory.

**Regression fixtures:** for the same design, provide (a) specific appreciation plus satisfied stop, (b) a response-specific intention followed by a real optional combine, and (c) required completion with no report. The reviewed recommendation must differ; (a) must preserve local value while changing the failed sustained-interest hypothesis, (b) may retain that mechanism provisionally, and (c) remains untested. Merely snapshotting three copies of `design.nextExperiment` must fail this contract.

## Priority 3: validate what “elective action” actually refers to

`continuationEvidence` counts every decision tagged `phase:'elective'`, then adds every decision in the session named by `continuation.nextSession` (lines 39–48). It does not check that the counted decision follows the recorded intention or that the linked session was actually launched as this continuation. The CLI retains only one continuation object and permits a later `continue` to replace it (`logical-play.ts`, lines 24–27). An earlier elective action can therefore be credited to a later intention without any action after that later intention.

I reproduced two false positives in memory, without changing any capture:

- Link the bell capture to the pre-existing progression capture: six assigned progression commands are counted as actual elective action, although that session began before the bell session. The finding says action followed the recorded intention.
- Give a capture an elective decision at index 0 and a recorded continuation at index 2, with no actions after index 2: that older decision is still counted as following the later intention.

These faults do **not** change the finding that all four audited captures contain zero recorded elective combines. They undermine the next positive result the harness might encounter.

The count also does not distinguish an optional construction from a `finish` command. Choosing closure is meaningful, but clicking an ending after a checkpoint is not continued constructive pursuit. A single scalar should not silently merge them.

**Fix:** preserve a chronological log of continuation choices and their action spans; validate the applicable stopping checkpoint and prospective linked-session provenance. A deliberately launched new scenario can be elective even if its local commands enact an assigned objective, but a bare link to an arbitrary existing capture is insufficient. Report optional construction, optional inspection, closure actions and required actions separately. The limitation about agent compliance remains necessary after these checks.

**Regression fixtures:** earlier elective action followed by a later unacted intention; an unrelated or pre-existing linked run; valid prospective linked replay; an optional `finish` with no optional combine; and valid optional combine following a recorded intention. Only the latter two construction cases corroborate actual constructive continuation. None establishes human absorption.

## Priority 4: record when a revelation was already disclosed

The access account reports `previewCalls:0` for Bell and Mneme and adds a general statement about embedded forecasts. That is a useful warning, but insufficient to test the experience engine.

Bell's `initialObservation.previews[0].events[0]` already contains the exact whispering-bell passage later returned after decision 0. Its player reports reading public laws and previews first. Mneme's initial `recipes[].immediateConsequence` already discloses the gallery, retained identity, singular loss and optional thematic endings. The player explicitly says the keeper's behavior was disclosed and that the second action executed a previously chosen plan. These passages can still be appreciated when enacted. They cannot be credited as newly discovered information caused by committing the combine in these sessions.

**Fix:** for a narrative claim, connect a particular valued fact or passage to its earliest available exposure, the result where it was enacted, and the player's notice. Keep “available,” “reported read,” “newly encountered” and “meaning appreciated on enactment” distinct. Separate transparent recipe/causal information from story disclosure when designing the next test; retain known combinations and avoid hidden thematic passwords. A complete prose preview is a test condition, not an automatic failure.

**Regression fixtures:** a result passage copied verbatim from the initial preview must receive no new-disclosure attribution, while its reported aesthetic value survives. A fresh story fact without a new state-graph branch may support an interpretive-revelation claim. No explicit `preview` CLI calls must not imply no prior narrative exposure.

## Mechanical safeguards: strengths and remaining limits

All 12 existing tests in `tests/fun-evaluator.test.ts` and `tests/decision-space.test.ts` passed during this audit. Exact replay validates the four captures when evaluated. The implementation avoids a fabricated fun total, names action/episode/time units, preserves unscored predictions, permits a unique-answer insight, and does not infer boredom from repeated syntax. `decision-space.ts` tests same feasible futures and bounded search honestly. These are useful constraints on a critic.

They do not satisfy the whole contract:

- All four profiles have zero checked prediction assertions. Their ordinary free-text expectations remain player accounts, not demonstrated rule understanding. Correct play and public forecasts should not silently fill that gap.
- The council has three nondominated numerical profiles but the player did not care to pursue the optional differences. Bell and Mneme each have one numerical profile because their adapters deliberately score only the required baseline; this says nothing adverse about their qualitative narrative alternatives. Retain both distinctions.
- `sameFeasibleFutures` is a global equality check across all offered branches. It does not itself identify the actual consequential commitment or whether the chosen branch retains every relevant ending. Council decision 0's chosen branch retains all four feasible ending keys; the player's lasting qualitative commitment must be identified from a relevant comparison rather than immediate-effect counts. F3 still needs a few reviewed decisions.
- Progression lacks an exact domain adapter, but its reported equivalent alternate construction and actual reused whole are still evidence to review. “No adapter” should mean exact continuation enumeration is unavailable, not that every consequence is unknowable.
- F6's automatic-resolution counterfactual, F8's account of inference versus execution, F9's post-play revision, and F10's comparison of transferred skill versus changed meaning are largely preserved as raw reports or design descriptions, not evaluated. `principleCoverage` should mark `mechanically checked`, `reviewed report`, `not checked`, or `not applicable`, with a concrete trace/fixture. It should not look like ten completed obligations merely because ten implementation strings exist.

## A doctrine clarification exposed by this play

Add a requirement to **locate the live question over time**. A designer's question, a displayed invitation, a known answer the player wants to enact, an unresolved question the player actually wants answered, and a question they consider satisfactorily closed are different things. Record who posed it, what the player had already seen, whether the player adopted it, and what action or appreciation followed.

Self-chosen does not have to mean unprecedented or invented outside the offered options. A player can sincerely want an authored option. Conversely, a poetic question printed by the game is not proof that it became the player's question. Bell and Mneme show that a coherent response can close the very concern that motivated the action. That is a local experiential success; it also means a proposed continuation needs a new invitation that this player actually values. The evaluator should help the designer invent that invitation, while preserving the completed moment.
