# Combination Challenge

Goal: a game prototype that takes the combination challenge from Little Alchemy 2 or Doodle God, but with the following:
- it doesn't have the frustrating feeling of having to experiment to discover someone's arbitrary ontology
- it has a game, a challenge, effort, skill, reward

This is a prototype, so build it in ts+html. Graphics and UX should be workable but are not the primary focus.

Please keep working notes in notes.md -- these are to keep track of what your ideas are, what hypothesis you're testing, what your goal is, what your strategy is.

My overriding hypothesis: if the AI can build a harness where it has subagents play the game, and it can evaluate those games for how much "fun" they are, then it can continue iterating until it really does produce something that's fun. Therefore the single most important part of this project is (1) research widely in the literature what game designers think constitutes "fun", (2) embody that in a closed-loop grader.

One proposal for Fun is from Sid Meier: fun is a series of "interesting decisions" (ones that are informed, not random, consequential, tradeoffs, not a clear winner)
- https://raw.githubusercontent.com/dklassic/GDC-transcript/main/static/src/transcript/WggIdtrqgKg.txt
- https://www.gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions
- https://www.designer-notes.com/8-things-not-to-do-part-i/ "fun = interesting decisions divided by total time played"
- https://mitpress.mit.edu/9780262542692/characteristics-of-games/ chapter 6 "what used to be an interesting gameplay/decision becomes busywork once the user understands it"
- https://explorminate4x.wordpress.com/2016/07/15/this-thing-called-strategy-an-exposition/ "strategic decisions vs tactical decisions vs optimizations vs upkeep+overhead" (and you can have complexity, where you spend time in decisions that aren't strategic/fun)
- https://dl.digra.org/index.php/dl/article/view/591 says that some chores are fun. I have a hunch that "combine things" as a central mechanic can be a chore, but also fun, because its meaning and significance changes as you understand.
- My caveat: if the tradeoff is "can I spend these resources" then that's a bit lame and turns you into a greengrocer. In many games the tradeoff is "do I have time to do this action" either in a realtime game against the clock, or in a turn-based game against the oponent. But there must be more interesting tradeoffs





## Kill your darlings

This project has only three givens: (1) combination, (2) fun in the sense of an interactive game, (3) empirical closed-loop to test "fun"

Every idea must be DISCARDED if it doesn't further these three givens. We must explore and experiment, and not be afraid to try and throw away different paths.

## Current user direction (27 October 2026)

These instructions reflect the latest human playtest feedback and supersede the earlier logical-only/UI-freeze and result-preview directions.

- Continue logical experiments and functional browser playtests in parallel. The eventual aim is a fun combination game of roughly 200 decisions, preferably with multiple scenarios. Do not inflate counts, require every recipe, or claim that an agent report proves human enjoyment.
- Clear, comfortable progress and learning the mechanics can be enjoyable. Not every action needs to be a difficult tradeoff. Preserve legitimate shortcuts and distinguish authored routes from fresh play.
- The player combines the things themselves. Selecting a finished output and delegating its construction is not the intended interaction. Avoid arbitrary ontology guessing: normal hover/selection reveals compatible partners, but not the future result name. Rich result previews belong to developer diagnostics, not a discovery-mode player interface.
- Normal playspace objects are things (rounded rectangles) and locations (hollow, square-cornered rectangles). Named slotted constructions are an explicit extension: slots belong inside the thing, not to an accumulating location. Results must be recognizable things, not generic bags of components.
- Mars is about improvising with recognizable salvaged things, not rebuilding civilization from raw elements. Do not turn it into stock management, depletion, or inventory accounting.
- Locations have three roles: a meaningful setting for a binary combination; one operand producing a portable thing; or a place where a functional thing satisfies an objective. Placement is freely reversible. A location must not silently collect and combine several things.
- A continuous scrolling playspace may become a catalogue. Leave older things where the player put them; reveal new locations as objectives need them, and let useful things be dragged forward. Total retained-item count is not itself a failure or a reason to reset the world into separate levels.
- All Mars starting supplies are present from the beginning. Later supplies require an explicit story event such as discovering a cache, not an unexplained objective-triggered grant. Only locations normally unfold with objectives.
- Enhanced things may satisfy a goal when they genuinely provide its required capabilities. Do not use exact names or arbitrary family barriers in place of functional checks, and do not grant capabilities merely because an unrelated part is contained somewhere.
- The current Rover is created by Frame + Wheels. Its remaining essential slots are for the engine and solar charger; empty slots are unlabelled and discovered through normal partner hints. Installed parts become labelled. An optional radio slot appears only when installed. Use compact one-line rows and the same tile width as other things.
- A component with further use keeps a reusable outside copy when installed. Otherwise it moves inside and stays there. An explicit clear evolution may also retire an obsolete predecessor, such as Broken radio becoming Radio. Do not remove all unused ingredients indiscriminately.
- After a successful combination, surviving dragged A returns to its original position or placement; an absorbed or retired input is the exception. An ordinary move drops where released. Keep new results close to the target and visibly animate their creation. Do not create a duplicate result already present on the Mars board, including incorporated parts.
- Finger dragging a thing should move it, while dragging empty space scrolls the playspace. Drag highlights must persist and distinguish a valid creation drop. Reset must fully replay instructions and be reachable from an open instruction dialog. The user resets these checkpoints, so migration work is not a priority.
- Preserve prior research and raw play evidence honestly. Freeze the actual player interface, assignment and source before a fresh trial; keep developer routes and previews out of that trial. Explain unavailable native tests and separate logical-interface findings from real scrolling, touch or human-play evidence.

## Recovered project guidance and current focus (28 October 2026)

The original prototype, empirical fun research, and kill-your-darlings goals above remain in force. The following accumulated playtest guidance is additive and supersedes older interaction details only where explicitly incompatible.

Before changing or adding a game, read [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md). It records the user's playtest decisions and applies to all current and future combination games in this project. Update it when the user establishes a new principle; implement the principle in content, runtime behaviour and build validation where appropriate.

For tangible campaigns, author explicit input lifecycles, intermediate-goal dependencies and construction-preservation declarations. Run `npm run build` and `node --test tests/tangible-campaign.test.ts` for changes affecting campaign semantics. Preserve saved progress and existing archived direct routes. Do not treat research candidates or continuity-audit findings as implemented improvements.

Current focus: Mars, Atlas of Questions, Elements, From Hearth to Snack Cake, Why This Boat, and Doctrine: Grace and Matter. Preserve other sketches and archived direct routes. Every non-opening chapter should meaningfully use earlier-created work; merely carrying an unused token or raw supply does not count. Research candidates and the manuscript reader remain IN PROGRESS / NOT LIVE at the 6204 source checkpoint. Preserve negative findings, raw play evidence and exact source provenance; never equate mechanical completion or simulated play with proof of human fun.
