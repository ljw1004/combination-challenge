# The player does the combining

Historical contact-1/contact-2 table-and-shelf experiment. The default now uses [one shared canvas](shared-canvas.md); the surface described below remains at `?experiment=hands`.

This iteration follows direct human feedback from the project owner. The earlier flood dashboard was hard to understand, and its output-first recipe cards made combination incidental. The user asked for a stock of things beside a free play area and for visceral handling of the ingredients themselves.

The change is intentionally substantial: the default is now the tactile table. The flood game remains at `?experiment=flood` as a baseline, rather than a template the new game must preserve. [Current design contract](design-contract.md).

## Hypothesis and implementation

**H5:** picking up ingredients, bringing them into contact and releasing to transform them will make the player's own combining perceptible. An output menu, correct recipe API or attractive screenshot cannot establish that.

The screen starts with Earth and Water on a quiet table. The Things shelf holds known concepts. Hovering a thing exposes compatible partners and their results. During a drag, the object follows the hand; contact produces a local preview and magnetic response. Release fuses the two physical pieces, forms one result there and adds a newly discovered concept to the shelf. The result stays manipulable. Mixing Clay with Heat can produce Brick, and that actual Brick can enter another combination. There is no recipe-selection/deployment mode switch.

The default includes the earlier small concept graph so that this experiment need not invent new content to test the gesture. It has no storm, turn budget or completion objective. Consequently it can test handling and discoverability, but it does not establish the intellectual/skill challenge requested for a finished game. Those surrounding systems must earn their place separately.

Pure tabletop transitions, permanence, invalid-pair safety and exact interaction replay have six tests in addition to the earlier engine/grader suite. Browser tests use real pointer movement, held contact inspection, release, shelf handling, keyboard/tap alternatives, undo, persistence and mobile bounds. Captured gestures distinguish source selection, contact preview, drop and actual fusion. [Model](../src/workbench-model.ts), [view](../src/workbench-view.ts).

## First fresh browser player: contact-1

Session `touch-a` received no recipes, source code or rules packet. It saw only screenshots, visible text/control locations, and could issue actual mouse/key commands through [gesture-player.ts](../experiments/gesture-player.ts). Isolation was instruction based. It used13 commands and made4 mixtures, then stopped as requested. [Command/screen record](../results/gesture-players/touch-a/commands.json), [model capture](../results/gesture-players/touch-a/run.json). This was a fresh inherited gpt-6.1-sol agent, not a human.

Observed sequence: Earth + Water → Clay; Clay + Heat → Brick; Brick + Water → Channel; Earth + Seed → Grove. Two mixtures directly reused the preceding physical result. A held preview was inspected before the first release. The input sequence supports actual ingredient handling rather than an output command.

The agent reported three interface failures:

- Hovering table Clay made shelf Heat glow and show Brick, but dropping Clay onto that highlighted shelf partner did nothing. The reverse drag—shelf Heat onto table Clay—worked. This was a false affordance.
- Channel/Grove had no compatible partner among current things, but the instruction still told the player to find a glowing thing.
- Newly unlocked shelf entries extended below the viewport without an obvious scrolling cue.

It also said result labels made later play feel directive/rote and that no objective gave a reason to continue. Those are AI reports, not proven human experience. The latter is consistent with this deliberately bounded interaction experiment lacking a challenge.

## Human feedback changes the evaluation

The owner independently praised hovering an icon to explore what could come next. They reported that this removed the frustrating search for an author's intended ontology. They also found the cross-icon placement slightly confusing and explicitly deferred that presentation detail. They reaffirmed that the source of fun should be an intellectual or skill challenge built on top of known combinations.

This conflicts with the agent's negative interpretation of pervasive result labels. Removing those labels was queued, then **cancelled before implementation**. The affordance is preserved. The grader must retain this counterexample: an AI may mistake enabling information for lost agency. Agent consensus or an elegant proxy cannot override direct player evidence about what they found useful.

This is real feedback from one human project owner, not a formal recruited playtest or proof of complete-game enjoyment. It is stronger evidence about the owner's preferred discoverability than the agent's speculation. It does not establish reaction timing, long-term challenge, skill transfer or enjoyment for other people.

## Revision: contact-2

Keep the hover revelation of compatible partners/results. Make the highlighted combination work in both directions, including dropping a table piece onto a shelf partner. A shelf-side fusion places its result at the adjoining reachable table edge, with visible ingredient motion. Truthful terminal hints and an explicit shelf scroll cue address the other reported errors. New discovery scrolling makes the result available for the next action.

The first implementation is preserved in [the contact-1 source snapshot](../experiments/snapshots/hands-1/workbench-view.ts), with its CSS beside it. Model replay version is `hands-1`; interface revision is recorded separately as `contact-2`, since the gesture changes do not invalidate earlier recipe/action captures.

These fixes are responses to specific observed behavior. They are not evidence that the combining gesture is already satisfying, or that collection alone supplies enough challenge. New browser regressions protect the human-loved hover behavior and exercise the exact reverse-drop case that failed.

### Fresh browser check of contact-2

Fresh session `touch-b` used13 commands and made4 mixtures. It repeated the previously failing table-Clay→shelf-Heat gesture, inspected the held Brick preview, and successfully received Brick at the reachable table edge. It then reused that Brick to create Channel. It also copied a known Brick from the shelf and combined it with Clay to create Levee. Four fusions have matching physical-gesture events, and two mixtures reuse the immediately preceding result. [Screens/commands](../results/gesture-players/touch-b/commands.json), [capture](../results/gesture-players/touch-b/run.json).

The new player still reported small contextual issues: after automatic shelf scrolling, a hovered shelf thing could supply the instruction even though the player's attention remained on the fresh table result; incompatible held pieces could overlap labels before their separating drop. These remain presentation work, not reasons to suppress the owner-approved hover information. The player again had little reason to continue after producing terminal things. That is evidence that the surrounding challenge is still absent, not evidence against discoverability.

Current checks:34 engine/model/grader tests and23 browser tests pass (14 tactile,9 archived flood). Production build passes. [Gesture evidence](../results/gesture-evaluation.json) deliberately does not average the owner's positive report with the agent's negative interpretation or claim an enjoyment total.

## Broader research without another fixed architecture

[Nine game systems](combination-systems.md) now include expanded rooted chains and full-catalogue/data links with edition/access limits. The comparison distinguishes contact fusion, spatial assembly, process preparation and executable rule composition. It does not claim to export every recipe in all nine games.

[Laudan and causal paradigms](transformations-and-ideas.md) examines the local diet article and historical sources. It proposes three separate experiments: materials/form, process/conditions, and proposition composition. The philosophical history supplies candidate operations; it does not justify adding all of them or keeping a failed one. The article's historical fermentation account is not a claim that fermentation alone causes all chemical transformation.

## Next gate

Preserve the direct handling and discoverability. Then compare challenges where knowing the complete legal combination graph still leaves something worthwhile to solve or perform. Candidate uncertainty belongs in arrangement, timing, sequence, resource/space constraints, competing consequences or manipulation skill.

The challenge must survive full recipe information. Reject a design that becomes difficult chiefly by hiding its combinations, asks the player to issue finished-output instructions, or adds repetitive preparation with no meaningful choice. Browser agents can expose interaction errors; actual human handling remains necessary to judge the desired visceral experience.
