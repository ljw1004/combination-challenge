# Combination Challenge — overnight handoff

Written 25 October 2026, evening in America/Los_Angeles (26 October UTC).

## Start here

The user asked to pack up for the night. **Gameplay and development are stopped.** Two Faculties playtests were interrupted by that request and have saved their exact state and next intentions. They have not chosen to stop voluntarily. Resume them before inventing another prototype or judging this latest experiment.

Workspace: /Users/ljw/code/combination-challenge. TypeScript models and a public logical-play CLI are the current research surface. Node 25 is installed; the scripts require Node 22.18 or newer.

The current promising direction is **history expressed through game primitives**: a place or creation changes role through use, and that history changes what a later combination can do. The newest experiment transfers actual combination traces into faculties that can be combined into a process acting in the same world.

**The requested long experience is still unachieved.** Two completed long diagnostics exhausted worthwhile purposes well before the proposed 180–240 decision opportunities. Do not hide that result or manufacture a minimum-turn rule.

## User constraints and corrections

Read [AGENTS.md](AGENTS.md), [the current design contract](docs/design-contract.md) and [what-is-fun.md, revision 7](docs/what-is-fun.md). The following later user clarifications are particularly important:

- Combining is the player's primary activity. The user wants to perform it, rather than select a finished goal and delegate construction.
- Preserve the praised hover discovery of compatible things and their results. Unknown author ontology and secret recipes are not the challenge.
- **No finite ingredient supplies, depletion, stockpiling or inventory management.** Known concepts are inexhaustible capabilities: gods, not grocers. World things may genuinely change.
- Work on the logical game structure before UI polish. Existing browser surfaces are historical experiments. The small story reader was added only after the user explicitly requested URLs.
- Narrative sweep, beauty, philosophy and discovering what comes next matter to the owner. However, after trying Bell Orchard and Mneme, they clarified: **“I don't really want much text narrative at all”** and **“Any narrative we find must be emergent in the primitives of the game.”**
- Express that history through the game's building blocks: terrain, avatars, foes, moving blocks, processes and their consequences. Do not revive a prose-led campaign.
- The user specifically likes combining onto terrain. A place might be a retained catalyst in **A + B at P**, enabling a pair or changing its operation. This is promising and tentative, not an immutable grammar.
- Places should share the same availability/light-up logic. Show applicable inputs/results and actual conditions; do not introduce hidden location recipes.
- Place, time and other backdrop conditions should themselves contribute to the unfolding history. Time may be phase, order, movement or process; it need not become a scarce action allowance.
- Multiple qualitatively/philosophically different ways of combining remain desirable. Aim eventually at 30–40 minutes, approximately 180–240 opportunities under the user's ten-second pacing assumption. Counts are not measured human duration.

The owner authorized independent end-to-end work and subagents. Do not ask for routine approval on resuming. Their overnight stop is the current instruction.

## The immediate work to resume: Faculties

Frozen model: [logical-faculties.ts](experiments/logical-faculties.ts), version **faculties-1**, scenario **workshop**, registry ID **faculties**.

Read [the proposal and independent design review](docs/faculty-proposal.md) and [model/API documentation](docs/logical-faculties.md).

The qualitative shift is from making a thing to making an acting process:

1. An actual physical combination leaves a trace, including operation, source context and provenance.
2. Trace + Memory at the maker teaches its operation.
3. Learned faculties can be combined at a live place. A channel supplies succession; a split supplies guarded choice with local branch history; a wet closed basin supplies feedback.
4. A faculty combined with the maker runs through real bindings, movement, guards and physical effects. At most one maker physical operation occurs per beat.

The composition site remains part of the world. Its routing/flow can change subsequent execution. The destination supplies its own history: teaching a broadcast does not copy the teacher's recorded identity.

Mechanical checks already passed: 868 legal forecasts across four states, input preservation, replay, destination-history transfer, fork history, basin flow, and one maker physical action per beat. Root/fire ordering produced identical final rooted/fired forms but different retained marks, downstream flooding and growth. Gardening, firing everywhere and isolation reach finite saturation; this limitation is documented.

**Do not extend the language or build a campaign before completing the two interrupted plays.**

### Interrupted elective session

Capture: [fun-faculties-interest-1.json](results/logical-players/fun-faculties-interest-1.json).

- 11 commands: **6 player combinations, 5 waits, no finish**.
- Two maker combinations occurred as world events; do not add them to player decisions.
- No checkpoint or elective continuation decision has happened yet.
- Demonstrated fire at C1 and rooting at B1; learned their traces; composed f3 at east-flowing A2; installed it.
- The maker translated that procedure to C3/B3. C3 captured local **B**, retained it after upstream roots fragmented arrivals, and D3 grew. It did not fabricate the teacher's A identity.
- Current maker at B2 with f3 installed. Roots B1/D1/B3/D3; fired C1 retains A and C3 retains B.
- **Next step:** checkpoint the completed initial creation, then honestly decide whether anything invites further play. That decision is unmade.
- Saved report and latest note explicitly say externally interrupted by the user's overnight stop.

Original player agent: /root/faculties_interest_player.

### Interrupted long diagnostic

Capture: [fun-faculties-long-1.json](results/logical-players/fun-faculties-long-1.json).

- **6 combinations, no waits, no finish**; one project episode begun.
- Fired C3 captured B; C3 and A3 broadcast.
- Learned firing f1 and broadcasting f2; composed f3 at split B2; installed it.
- The maker chose the nearest enabled broadcast at A3 rather than approaching clay C1. Primitive guards and binding selection actually matter.
- Current maker A3, blue C3, amber E3; neither walker returned.
- **Tentative next plan, not executed:** pause with Stone + Maker at A3; route A2 south, then A1 south to bring A into the bottom B flow and preserve A+B at C3 before rooting B3. Then teach rooting/hooding and construct a quiet living route.
- This is required diagnostic examination, not elective appetite.
- The long target is **unassessed because of external interruption**, not a failed-purpose result.

Original player agent: /root/faculties_long_player.

### Resume commands and isolation

~~~sh
node experiments/logical-play.ts view fun-faculties-interest-1
node experiments/logical-play.ts notes fun-faculties-interest-1
node experiments/logical-play.ts view fun-faculties-long-1
node experiments/logical-play.ts notes fun-faculties-long-1
node experiments/logical-play.ts rules SESSION
node experiments/logical-play.ts actions SESSION '{"at":"A3"}'
node experiments/logical-play.ts preview SESSION 'JSON_ACTION'
node experiments/logical-play.ts act SESSION 'JSON_ACTION' 'JSON_PREDICTION'
~~~

Do not re-init these IDs. Prefer resuming the original agents through followup_task if their histories remain available. They must continue using only the public CLI, not this handoff, source, solver outputs or other reports. If replacing a player, record that provenance and do not describe it as uninterrupted fresh play.

CLI commands also include checkpoint, continue, note and report. Record an intention **before** elective actions. A plan may span several commands; do not invent an episode per command. Generic parsing of public JSON is allowed; scripts choosing moves or searching future states are not player evidence.

**Evaluator caveat:** the current evaluate-fun runner selects every matching capture, including these unfinished Faculty sessions. Its last generated aggregate predates them. Before regenerating conclusions, either finish the sessions or explicitly handle external interruption. An overnight report containing a closure field must not become evidence of voluntary closure, boredom or lack of appetite.

## What the completed experiments established

[The current cycle account](docs/fun-evaluation-cycle.md) links the complete evidence.

| Experiment | Actual result | Current interpretation |
| --- | --- | --- |
| Bell/Mneme written stories | Local appreciation; later versions each produced two elective combinations | Historical evidence. The owner rejected this prose vehicle. |
| Confluence 2 | Elective condition stopped at 20 interventions; mandated long run used 42 combines plus finish | Keep propagation, storage/publicity and changing roles. Actors exhausted their one-time ambitions; long target failed. |
| Field 1 | Two combines, one elective | Without authored scenes, a repaired orchard became a source that grew the village. Legible small chain; obvious local choices and early closure. |
| Imprints 1 | Five combines, two elective | A crossing enabled learning, return and settlement; an old record became a chosen quiet meeting place. Strong short primitive story; easy initial aim. |
| Resonance 1 | Seven combines, one six-beat wait, finish; no elective continuation | Scars and timing were functional. Quiet independent rhythms satisfied the player; more available operators did not supply a wanted coupling. |
| Frontier 2 elective | Five combines plus finish; one elective boundary act; three episodes | Bridge gate became hearth corner; approach became boundary after an actual collision. Wanted small ending, no conquest project. |
| Frontier 2 long | 36 combines, 12 waits, finish; 11 episodes | Coexistence architecture continued after initial goal, then settled by command 35/40. Final eight waits confirmed a repeating blocked policy. Long target failed. |

The five completed primitive-only sessions total **71 commands: 55 combines, 13 waits, 3 finish**, with **four verified elective combines**. These totals exclude the interrupted Faculty sessions.

None is a human enjoyment or human pacing study. Owner comments are direct human preferences of their specific scope; do not average them away against agent taste.

### The strongest leads

- A creation acquires a different role through actual use.
- A solution becomes a source elsewhere, then its consequences matter.
- Stored history and current transmission are distinct.
- Place history supplies a later construction ingredient.
- Familiar identities/places matter more than unrelated new unlocks.
- A continuing counterpart can generate an architectural project, but endless hostility or routine repair does not automatically sustain it.
- A valued short ending is legitimate. Do not punish success to force more play.
- The next scale should expand what the player can create with prior work.

The selected Faculties experiment tests that last point. [Live embedding](docs/next-scale-proposal.md) is an alternative: actual interiors, ports, delays and scars become operands for overlap, succession and feedback. It remains a proposal, not implemented long-play content. The sower/archivist proposal was rejected as insufficient because both monotonically exhaust a finite map. A visitor-written relay remains another unimplemented alternative in [the source revisit](docs/primitive-source-revisit.md).

## Important defects and evidence boundaries

[Confluence mechanics review](docs/confluence-mechanics-review.md):

- Ilex's first-mark and other actor prerequisites were inadequately disclosed.
- Mneme's “custody” prose overstated a narrower future testimony-policy change.
- Original previews omitted some configuration/history changes.
- Exactness/publicity need per-origin representation, not independent summary booleans.

Field addressed representation/disclosure, without altering the frozen underlying mechanics. Its own player still found missing bell location/awakening and parent provenance.

[Frontier mechanics review](docs/frontier-mechanics-review.md):

- Remembered footprint ownership does not preserve the original circuit's topology/liveness.
- Amber's “winning” counter scoring ignores closed edges; the actual movement law respects them.
- History mixes installed orientation and actual travel headings.
- Unequal friendly arrivals have an unstated first-arrival resolution.
- Automatic forks generate circuits and clutter without much deliberate work.

The long player independently corrected its final account: both lineages have live circuits, while the original cherished route changed. Preserve that correction. Frozen defects belong in their evidence; fix them only in a new version if returning to the model.

## Doctrine, evaluator and sources

Current doctrine: [revision 7](docs/what-is-fun.md), with identical [archive](docs/history/what-is-fun/revision-7.md) and [review](docs/history/what-is-fun/review-7.md).

Organizing question: what makes performing a combination worth attention, and what makes the resulting situation invite another action? Intention → construction → consequential response → renewed intention or satisfying closure. F1–F10 catch false positives; they are not themselves an invention engine or a fun score.

Current evaluator: **fun-evidence-4**.

- [fun-evaluator.ts](experiments/fun-evaluator.ts): experience, disclosure, continuation chronology, scope and principle evidence.
- [player-experience.ts](experiments/player-experience.ts): source-path-preserving report normalization; unknown fields survive.
- [fun-designs.ts](experiments/fun-designs.ts): hypotheses and explicit expression/direction labels.
- [fun-reviews.ts](experiments/fun-reviews.ts): reviewed keep/change/reject interpretations and revised next experiments.
- [primitive-development.ts](experiments/primitive-development.ts): version 2; reconstructed functional transitions, original public-observation references and narrowly checked development claims are separate.
- [results/fun-evaluation.json](results/fun-evaluation.json) and [profiles](results/fun-profiles): last completed generated application.

Independent audits: [audit 1](docs/fun-evaluator-audit-1.md), [verification 2](docs/fun-evaluator-audit-2.md), [audit 3](docs/fun-evaluator-audit-3.md).

Corrections include preserving appreciation/closure across report dialects, preventing forecast prose from counting as enacted history, checking elective provenance, separating ambition origins from prospective renewal, removing causal “invitation produced” language, and separating combines/waits/finish from human time. Primitive claims require actual state/law checks; prose or a meaningful label cannot establish an effect. Some negative controls explicitly catch overstated actor agency.

Research: [owner-linked source review](docs/interesting-decisions-research.md), [logical source revisit](docs/logical-first.md), [latest primary-source revisit](docs/primitive-source-revisit.md). Meier, Johnson, Kiley and the DiGRA paper were accessed; Characteristics of Games chapter 6 was not available through the authorized preview, so do not claim it was read. The latest revisit accessed Adams, Wright and Teikari as text. No claim of watching inaccessible video. The user's human-enjoyment prediction hypothesis remains open.

## Verification and preservation

At overnight stop:

- **npm test passes 143 tests**, including the latest registry integration; output: [primitive-integration-verification.txt](results/primitive-integration-verification.txt).
- TypeScript check passed after Faculties integration.
- Adapter smoke checks replay exactly.
- Faculties author checks covered 868 legal forecasts and the focused context/provenance/composition cases; these are mechanical checks, not player sessions.
- No new browser or visual/tactile enjoyment test was performed during these logical experiments.

Reproduce when appropriate:

~~~sh
npm test
npx tsc --noEmit
npm run evaluate-fun
~~~

Observe the interrupted-session caveat before the last command.

**Never silently change a played model's semantics, state schema or observation.** Captures hash both state and public observation. Use a separate version/module or archive the baseline first. Keep the raw records, failed screens and positive reports.

Relevant archives include experiments/snapshots/far-bank-authored, experiments/snapshots/frontier-passive.ts, experiments/snapshots/primitive-development-1, and earlier evaluator snapshots/results. The prose-led Far Bank campaign was superseded before a completed playtest; its material is history, not the current production plan.

## Servers and browser artifacts

The owned story server on **127.0.0.1:5180** was left running to preserve availability and in-memory user sessions. Last health check returned 200. Original tool session: 82743.

- http://127.0.0.1:5180/bell
- http://127.0.0.1:5180/mneme

These serve historical text prototypes, not the new primitive models. Do not advertise them as the selected direction. Restarting loses in-memory sessions. If the process has exited by tomorrow, npm run story starts it again. There is no hot reload; avoid unnecessary restarts.

The older Vite 5173 and gesture bridge were stopped previously. The existing shared-canvas frontend and praised hover behavior remain preserved. No new game UI has been selected or built. Terrain/item discoverability APIs in the logical models support a future light-up interface.

## Suggested order tomorrow

1. Read the latest user constraints and resume the two interrupted Faculty players through the public CLI.
2. Preserve interruption provenance. Complete their genuine stop/continue choices and the required diagnostic without padding.
3. Review what actually happened: operation transfer, local history, live composition site, method versus goal delegation, overhead, new intentions and saturation.
4. Give the evaluator explicit external-interruption handling before treating partial runs as ordinary evidence. Add Faculty primitive checks only for concrete claims found in play; do not infer causal understanding from available previews.
5. Decide whether to expand this mechanism. If promising, test a new kind of creation using earlier work, potentially another acting process or a retained whole. Prototype one real transfer before building a large language/campaign.
6. Return to the unmet long-game target and the preference for qualitatively different contexts. More recipes, more hostility, a scene budget or a command quota are not substitutes.
7. Resume UI work only once the logical direction earns it or the user requests it. Express actual history through places/processes/avatars and preserve the availability light-up logic.

All subagents have stopped except this handoff-writing turn. No overnight work, external publication, deployment or messaging is scheduled.

