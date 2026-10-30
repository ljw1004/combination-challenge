# Elemental Game Research and Invention Handoff

Research, invent and iteratively prototype a game in which Doodle God style combinations become tools for overcoming concrete challenges. The central test is whether choosing what to create and how to use it is enjoyable. A large recipe collection, a working simulation, or a capable AI player does not establish that the game is fun.

## The core design question

What challenge does the player face, what skill lets them overcome it, and what result or discovery follows? The discovery should enrich subsequent decisions. A promising experience is: I understand the situation, I have several plausible constructions, I commit to one, and its consequences make me reconsider my next move.

## Requirements to preserve

- Reveal available combinations from the player's current set of concepts. Show ingredients and result before commitment. The main question is which combination to choose next, then how to use what it enables. Do not make blind recipe guessing the central obstacle.

- Treat factories as access to concepts. Once glass is established, glass is available without production rates, stock counting, duplicate factories or waiting for another batch. Discovery permanently expands capability within the encounter; persistence between encounters is open.

- Give combinations practical consequences in a changing world. Include concrete goals, pressure, understandable feedback and success or failure. Combat is optional.

- Avoid repeated crafting chores. A consumed or destroyed deployment may cost another action to replace; it must not require rebuilding the same ingredient chain.

- Run a closed loop: state a hypothesis about fun, implement a small test, play it, inspect evidence, change the design and play again. Reject attractive ideas when the evidence does not support them.

## What remains open

Setting, combat versus environmental challenges, real time versus turns, spatial representation, offer size, persistent unlocks and campaign structure are design questions. The directions in this brief are candidates, not a request to combine every idea into one game. Build the smallest experiment that resolves the most important uncertainty.

## Make combinations into decisions

### A proposed starting loop

Observe a visible threat and its likely next action. Inspect a small set of legal recipes, each showing its output and a concise account of its effect. Choose a discovery or deploy an established capability. Resolve the world response. See new consequences and newly available recipes, then choose again.

Use the same concepts in both invention and the world. Rain should actually wet ground or extinguish fire; mud should affect movement. Avoid an alchemy minigame that merely awards an abstract attack token to a disconnected battle system.

### Separate three kinds of state

- Known concepts: a set of unlocked capabilities. Combining two known concepts can add a third. Inputs remain known. There are no quantities or production timers for these concepts.

- World state: particular walls, fires, weather effects, creatures and terrain. These can expire, move, be destroyed or interact. Their behaviour must be readable.

- Scarce decisions: actions before a threat arrives, deployment locations, or a simple commitment allowance. Start with one main source of scarcity. Unlimited conceptual supply must not permit unlimited instantaneous deployment.

Proposed first rule: discovering a concept takes one turn; deploying a known concept takes one turn; the world advances after either action. Test a variant where discovery also creates one local instance. This distinguishes the pleasure of an immediate experiment from the cost of a two-step unlock and deployment process.

### Reveal recipes without revealing the whole answer

Show A + B = C, together with the properties necessary to predict C's immediate use. Future branches may unfold as concepts appear. The uncertainty should concern worthwhile plans and consequences, rather than a hidden dependency that makes one early choice secretly mandatory. Include several viable routes and opportunities to recover.

Begin with all currently legal novel recipes in a small content set. If the menu becomes unwieldy, compare a curated offer of three or four with the full menu. Curation must not randomly withhold the only survival move. Test offer fairness separately from tactical skill.

### Defeat arbitrariness

A combination can mean transformation, construction, causation or association. Unannounced switching between those meanings makes inference unreliable. Use a bounded vocabulary and recurring properties; make any magical premises consistent. A rule learned in one situation should help in another. Revealing recipes solves move legality, but does not by itself make their effects coherent or their selection interesting.

## Explore distinct kinds of challenge

### A personified opponent

As a god working from raw elements, confront a determined mortal approaching your sanctuary. The Hector image is a design prompt, not a historical reconstruction: watch an individual advance and ask what you can construct to stop, delay, distract or redirect them. A Zeus and humankind setting is another possible framing.

Give the opponent a small, observable personality expressed through behaviour: protect companions, avoid fire, break barriers, seek high ground. Preview intent. Learnable motives allow the player to reason about the opponent. Do not make an omniscient opponent invalidate plans arbitrarily or require dialogue generation to simulate personality.

Illustrative decision: rain plus earth unlocks mud, which slows an approaching hero. The hero can detour onto a ridge. You can deploy mud now to buy time, develop a hazard on the ridge, or pursue a more decisive construction. Recipe and behavioural rules here are proposals to implement and test, not existing game facts.

### A noncombat environment

Try rising water, erosion, decay or encroaching vegetation. Choose one process for the first encounter. The challenge is to protect something, restore a stable condition, or finish a larger project before the process overwhelms you. Blocking water might divert it into something valuable; encouraging growth might stabilise soil while obstructing a channel.

Specify a genuine endpoint. Surviving indefinitely through identical repairs is not the intended payoff. Let a successful invention remove an old maintenance burden and open a new problem.

### The reverse shooter campaign

Preserve this separate campaign idea for research: play the enemy commander in a scrolling shooter inspired by 1942, R-Type or Xenon 2. Your first stage corresponds to the hero's last stage near your base, with bosses and abundant forces. Later stages move towards the hero's home, where your available forces become punier. Player mastery grows while material advantage shrinks.

Its skill could be arranging formations, hazards and timings to influence the hero's movement. Decide whether this is literally reverse chronology or an advancing front, and whether the hero also loses upgrades. Do not assume this campaign belongs in the elemental prototype unless it improves the core decisions.

### Choose through comparison

Sketch all three directions in one page each, including a specific choice between two plausible moves and its consequences. Select the strongest two for cheap simulation, then implement one playable slice. The two-player race was an earlier possibility; the current emphasis is an asymmetric challenge or an active environment.

## Research what fun means

Treat fun as a disputed design question, not a scalar the agent can calculate. Read designers' original work, compare their claims, and translate each useful claim into a prediction that the prototype could fail. The following is a researched starting map; source numbers refer to the final page.

### Mastery and prediction

Raph Koster describes the useful core of fun for game systems as mastery of problems and progress in prediction. [1] Application: ask whether players become better at anticipating interactions and solving unfamiliar encounters. Limitation: improved performance alone does not demonstrate enjoyment, and curiosity, spectacle or relaxation may matter independently.

### Different pleasures require different evidence

Hunicke, LeBlanc and Zubek's MDA framework connects mechanics, emergent dynamics and desired emotional responses. Its aesthetic vocabulary includes challenge, discovery, expression, fantasy and other pleasures. [2] Application: name the intended experience before adding features. An expanding recipe menu is a mechanic; improvisation under pressure is a possible dynamic; feeling ingenious is the intended experience. That causal chain needs testing.

Nicole Lazzaro's Four Keys distinguishes hard fun associated with triumph, easy fun with curiosity, serious fun with changes of feeling, and people fun with amusement. [3] This provides a counterweight to treating difficulty as the sole source of enjoyment. Select a few desired pleasures for this game; do not turn the categories into a mandatory checklist.

### Consequential choice and coherent discovery

Sid Meier's 2012 talk frames gameplay through interesting decisions. [4] The design hypothesis here is that revealed recipes can support situational tradeoffs: immediate relief versus a more powerful future capability. Soren Johnson's account of working with Meier advocates repeated prototyping and substantial changes that expose the design space. [5] Neither is a formula guaranteeing that every choice is enjoyable.

Marc ten Bosch and Jonathan Blow describe discovering the consequences and structure of interactive systems, rather than relying only on accumulating combinations. [6] Application: test whether a new concept enables an inference that works elsewhere. This is a design aesthetic, not an empirical law of pleasure.

### A working position to challenge

For this project, hypothesise that fun comes from understandable agency, curiosity about new capabilities, consequential commitment, and the satisfaction of a plan working or being intelligently revised. The player should feel inventive. Pressure is useful only if it sharpens those experiences. Explore whether relief, beauty or playful absurdity improve them; reject the assumption that more pressure always means more fun.

Extend the research with designer postmortems and contrasting views. For each source record author, date, direct URL, actual claim, practical implication and limitation. Distinguish a talk description from a watched talk, a paraphrase from a quotation, and our hypothesis from the source's conclusion. Avoid unsupported neuroscience and universal claims.

## Build the smallest revealing prototype

### A bounded first slice

Suggested scope: 15 to 25 concepts, 20 to 35 recipes, three short encounters and one main pressure system. Aim for a five to ten minute human session. These are starting constraints, not targets to pad with content. Use a small board or lane if position matters. Make recipes and threat intent legible before adding visual polish.

Encounter one teaches a useful interaction. Encounter two asks the player to recognise it in a different situation. Encounter three permits an inventive combination or alternative route. Include at least one temporary intervention that buys time for a larger solution. Avoid a single concealed winning chain.

### Make the design inspectable

- Keep concepts, recipes, effects and scenarios in editable data. Use a deterministic state transition where possible, with seeded randomness when needed.

- Expose legal offers, known concepts, visible world state, threat intent and victory conditions through a play interface. A headless interface helps bulk tests; a simple visual interface is needed to assess human readability.

- Record every offer, choice, deployment, world response and outcome with build version, rules version and seed. Support replay and branching from a saved decision.

- Validate reachable goals, legal actions, bounded resolution, accurate previews and absence of unavoidable opening losses. Report these separately from experience evaluation.

### Work in a closed loop

1. State one hypothesis: for example, spending a turn on discovery creates enjoyable tension between invention and survival. Specify what evidence would contradict it.

2. Identify the smallest rules change that tests it. Predict the change in play, not just the change in win rate. Keep a baseline version.

3. Run matched playtests on baseline and variant. Inspect traces and replays, including failures and counterexamples. Where several rules change together, label the comparison exploratory rather than causal.

4. Diagnose the experience. Was a bad move caused by unclear presentation, arbitrary effects, a shallow decision, excessive pressure or a player preference? Each suggests a different fix.

5. Keep, revise or remove the mechanic. Record evidence, uncertainty and the next test. Repeat for at least three substantive iterations before recommending expansion. Stop a dead end early and try a different direction when necessary.

The Experimental Gameplay Project's firsthand prototyping account supports short cycles, simple mechanics and abandoning weak ideas; it also distinguishes useful presentation from trying to rescue poor play through theming. [7] Provide enough feedback to understand consequences, then spend effort where the tests show it matters.

## Use AI playtests as diagnostic evidence

An AI player can reveal strategy, coherence and failure modes. Its claim to have enjoyed itself is not evidence of human enjoyment. The following protocol is a proposed engineering method, not a validated psychological instrument.

### Keep the player blind to implementation

Give each fresh player only the rules and observations a human would receive. No source code, hidden recipe graph, future seed, privileged world state or external walkthrough. Reveal available recipes exactly as the game does. A separate evaluator may inspect internals, but must label that access. Use original recipe content to reduce memorised solutions.

Ask for a short structured decision annotation: immediate objective, selected action, expected effect and confidence. Request a prediction, not an extended private reasoning transcript. Keep annotations out of the game's rewards. Compare some runs without annotations, because explaining a move may itself change play.

### Compare against meaningful baselines

Start with random legal choice, a greedy policy seeking immediate relief, a simple goal-directed policy, and a planning agent. An informed solver can estimate reachability and wasted actions, but its privileged score is not a fair player result. Skill should confer advantage without making every encounter trivial once one sequence is known.

For a screening pass, use about 12 shared scenario seeds per variant and more than one fresh planning run per seed if affordable. Record model, prompt and action budget. Swap offer order, keep observations equal and reserve unseen scenarios. Report counts and variation; do not present a small screen as statistical proof.

### Inspect behaviour rather than a single fun score

- Meaningful choice: find states where two plausible actions lead to different future options. Branch and replay them. A long menu with one dominant move is not depth.

- Learning and transfer: compare a fresh player with one that has experienced the teaching encounter, using an unseen related challenge. Separate learnt rules from memorised solutions.

- Plan revision: identify where a discovery or world response changes the next action for a sensible reason. A polished explanation must agree with the replay.

- Chore burden: count repeated actions with no new decision or context, time spent maintaining solved threats, and recipe steps that merely reconstruct known capability.

- Fairness and variety: examine unavoidable failures, misleading previews, viable alternative solutions and strategies that remain best across every scenario.

### Guard against false success

Neither completion rate, solution diversity, continued AI play nor confident praise establishes fun. Agents are unusually persistent and may tolerate bookkeeping or exploit opaque rules. Use these measures to locate promising decisions and failures for human inspection. Treat agreement among similar models as correlated evidence, not independent human validation.

## Judge the experience and decide what to change

### Use a small experience rubric

Review each encounter through five questions: Did I understand what was happening? Did I have a worthwhile choice? Did my invention visibly matter? Did I learn something I wanted to use? Did pressure create anticipation rather than busywork? These are prompts for evidence, not components of a mechanically averaged fun score.

Anchor each judgement to a decision or event. Distinguish observed behaviour, the player's own report, evaluator interpretation and automated measurements. Keep contradiction visible: a mechanically rich encounter may still feel tiring or emotionally flat.

### Bring in people before declaring success

When human access is available, run a small formative round with roughly four to six people, including newcomers who were not taught by the designer. This is qualitative design research, not population validation. Give only the intended onboarding. Observe one uninterrupted attempt before a short retrospective; test matched variants in counterbalanced order where practical.

Ask neutral questions: What were you trying to achieve here? What did you expect? Which choice felt worthwhile? Where did it become work? What would you try on another attempt? Let players stop freely and offer an optional replay without pressure. Ask about enjoyment directly as well as inferring it from behaviour. A retry may reflect confusion, obligation or stubbornness.

If no humans can play, complete the useful AI and mechanical work and state exactly what remains unvalidated. Never invent participants, quotations, ratings, preferences or human conclusions.

### Plan comparisons that can change your mind

- Revealed recipes versus hidden outputs: does removing guesswork improve reasoning while preserving curiosity? Revealed recipes remain the main design; this comparison tests the premise.

- Permanent concept access versus repeated crafting: does removing reconstruction reduce chores without removing meaningful commitment?

- Intention-driven opponent versus a predictable environmental process: is reading a character more engaging than managing propagation? Keep overall difficulty comparable.

- Action-paced pressure versus real time or generous pressure: does urgency help the intended pleasure or suppress experimentation?

Run the most consequential comparison first. Change one major factor where practical. Do not spend the entire budget testing every possibility or tuning difficulty around one model.

### Advance only on inspectable evidence

A promising slice has understandable consequences, several defensible plans, examples of skill transferring to a fresh challenge, and little compulsory repetition. Human evidence should include concrete enjoyable moments and reasons to try another approach. These are design judgement gates, not universal numeric thresholds. If difficulty or feature count rises while those qualities do not, simplify or change direction.

## Sources and the agent deliverable

Primary sources checked on 25 October 2026. The summaries in this brief are paraphrases; practical applications and the playtest protocol are project hypotheses. Read the sources themselves and extend this map before settling on a design.

[1  Raph Koster  Game design is simple actually  2025](https://www.raphkoster.com/2025/11/03/game-design-is-simple-actually/)

[2  Hunicke LeBlanc and Zubek  MDA  2004](https://www.cs.northwestern.edu/~hunicke/MDA.pdf)

[3  Nicole Lazzaro  The 4 Keys 2 Fun](https://www.nicolelazzaro.com/the4-keys-to-fun/)

[4  Sid Meier  Interesting Decisions  GDC 2012](https://www.gdcvault.com/play/1015756/Do-Say-The-Right-Thing)

[5  Soren Johnson  Sid's Rules  2009](https://www.designer-notes.com/game-developer-column-5-sids-rules/)

[6  Marc ten Bosch and Jonathan Blow  Designing to Reveal the Nature of the Universe  2011](https://marctenbosch.com/news/2011/11/designing-to-reveal-the-nature-of-the-universe/)

[7  Experimental Gameplay Project  How to Prototype a Game in Under 7 Days  2005](https://www.gamedeveloper.com/game-platforms/how-to-prototype-a-game-in-under-7-days)

Source 4 is the official talk listing and abstract; this brief does not claim a full viewing. Source 6 includes the authors' summary and embedded talk. Source 7 is the team's firsthand account, with contributions from Kyle Gabler, Kyle Gray, Matt Kucic and Shalin Shodhan.

### Return a decision package

- A concise research synthesis with direct sources, competing accounts of fun, limitations and the chosen experiential target. Include relevant adjacent games and what their designers learned; verify comparisons rather than inferring them from genre labels.

- Three concrete concept sketches, a reasoned selection, and the smallest playable prototype of the selected direction, with launch instructions and editable rules.

- A playtest record with builds, seeds, player conditions, outcomes, decision examples and failures. Separate mechanical verification, AI diagnostics and actual human findings.

- An iteration log: hypothesis, change, predicted effect, observed evidence, decision and next experiment. Preserve at least three substantive cycles or explain an early rejection.

- A recommendation to continue, revise or abandon, supported by the strongest evidence against it as well as for it. State what you still do not know about enjoyment.

## Philosophy

- Aristotle gave us four elements with which to combine
- China gave us five primitive elements
- "Birth of the modern diet" in ~/Downloads explains that it's fermentation not combination that gives rise to transformations
- Melvyn Bragg "In Our Time" would say that the things you combine are IDEAS, to produce new ideas. I wonder what it would look like if Bologna University or Oxford University in the middle ages were competing to see which ideas would combine, which would produce something like the Edinburgh school of medicine in the 1800s, which would produce the most nobel prize winners.
- Manicheanism, predestination, catholic vs protest, those two are about ideas
- When we talk about combining things we're using Aristotle's theory of "Material Cause". He had another three theories, Formal Cause, Efficient Cause, Final Cause, which are all different takes on causation.
- Minecraft has a chain of combinations in its crafting systems. Terraria. I think it'd be useful to get comprehensive documents that show the full chains of combinations across a wide range of games (Doodle God of course, and Alchemy Lab 2, and food combination cooking games, and the crafting games, and I bet there are more)
- I wonder if different levels in the game would simply have different paradigms? That would keep something fresh, the ontology of the nature of the game to combine things into a challenge, but you'd explore more. If the game indicates to you the possible combinations then that'd help.