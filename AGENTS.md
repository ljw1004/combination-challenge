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

## Subsequent user constraints

- The player physically combines the things; selecting a finished output and delegating its construction does not satisfy the intended interaction.
- Preserve hover discovery of compatible things and their results. Recipe secrecy and guessing the author's ontology are not the source of challenge. A challenge must remain worthwhile with all legal combinations inspectable.
- Discovered concepts are inexhaustible capabilities. Do not make finite material stocks, depletion, stockpiling, or inventory tallies the game. The user explicitly rejects resource-management games.
- The intended experience is creating a universe from its elements: gods, not grocers. Seek interesting consequences, relationships, arrangements, sequences, or skill challenges above known combinations.
- Current research priority: work wholly in logical game space. Freeze UI work. Use abstract combination actions, challenges, model tests and agent playtests to discover a compelling game structure before investing further in presentation.
