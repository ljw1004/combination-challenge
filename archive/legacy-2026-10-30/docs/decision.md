# Decision package: After the Rain

**Recommendation: revise the existing slice before expanding it.** The work establishes a playable, inspectable construction game and a useful diagnostic loop. It does not establish sustained tactical depth or human enjoyment.

## What is playable

Three short watersheds,16 concepts,15 explicit recipes, one scarce decision per weather pulse. Discoveries permanently expand access. In the selected rules, discovery can place its first instance; deployment never requires recrafting ingredients. Water actually flows through the board: channels transfer danger south, basins fill, groves mature, reeds absorb and can be uprooted, and pumps drain to sea.

The browser shows full weather, recipes and effects before commitment, plus exact next-response previews. It includes success/failure, undo and saved-decision branching, deterministic seed/rules selection, replay import/export, and optional accelerated resolution of a proven harmless remaining forecast. [Launch instructions](../README.md).

The three-encounter scope was kept small. The recipe graph was not padded to the brief's suggested20–35 because the current uncertainty is why to choose a construction, not how many combinations to collect. [Editable rules](../src/data.ts), [pure engine](../src/engine.ts).

## Research position and its revision

The experiential target is **feeling inventive through understandable, consequential construction**. Koster and Cook emphasize usable models and improving prediction. MDA and Lazzaro broaden the target to curiosity, expression and changes of feeling. Ma's Into the Breach account supports clear forecasts and room to invent; Barth's SpaceChem experience supports ownership through open-ended construction while warning about difficulty and onboarding. Foddy provides a useful counterweight to automatically removing failure. These are competing designer accounts, not a universal formula. The sources' actual claims, dates, access and limits are in [research.md](research.md) and [evaluation.md](evaluation.md).

Experiments prompted an actual return to original Koster, Ma, Barth, Teikari and MDA material. That rereading changed our inference: clear prediction and practical invention can coexist with a problem that stops producing decisions early. Extra activity and recipe uptake cannot stand in for anticipation. [Research revisit](research-revisit.md).

Three directions were concretely sketched: a readable mortal opponent, an active flood environment and a reverse-shooter campaign. Cheap simulations of the first two found shallow winning scripts. Flood routing was selected because spatial side effects and a finite endpoint could be tested cheaply. The reverse shooter remains separate. [Concepts](concepts.md).

## What the evidence supports

- **Practical, readable effects for these agents.** Five annotated CLI sessions predict45/45 damage vectors correctly without reported previews. A cascade redirects one bank's overflow through another, rather than awarding a disconnected damage token. Many predictions are later settled waits; this is not human UI evidence.
- **Different viable constructions.** Three opening branch choices—grove, channel and reeds—have found winning continuations with different damage and resulting capabilities. Blind players also use channel chains, finite basins, groves, and a levee/reed combination. Viability supports available alternatives. Their relative appeal and whether each buys a worthwhile advantage remain open.
- **Forgiving recovery.** At one saved decision, postponing an outlet still wins at one less health under a found continuation. This shows a recovery path, while also limiting claims about severe pressure.
- **An inspectable instrument.** All actions, offers, world responses and hashes are replayable. Mechanical tests, algorithmic diagnostics, blind-agent predictions, evaluator interpretation and missing human findings are visible separately. Audit corrected misleading evidence rather than hiding it.

## What argues against the current design

**The broad grove-first habit is too sufficient.** Greedy and bounded planner each win36/36 selected-rule development cases and36/36 timing holdouts. All seven blind sessions win. Stronger planning can preserve more health, but survival does not require much exploration or deeper recipes.

**The second half often has no survival decision.** Every blind run waits4–5 times after securing a zero-damage continuation. The same issue appears in all72 rooted solver runs, even though those runs continue building instead of waiting. The optional safe-resolution control removes redundant input; it does not create depth.

**Some positive metrics were induced by the grader/policy.** Solver novelty/stability bonuses encourage unnecessary late discovery.105/193 preparation-variant discoveries have no observed practical use. An initial aggregate evaluator even mistook a branch file's presence for choice support. Both issues are now exposed by unused-discovery and earliest-safe-state diagnostics; worthwhile choice remains a reviewed judgment.

**Several comparisons remain inconclusive.** One separate-discovery blind player wins by developing groves, so that variant is viable. Reed persistence changes little in current matched policies, and the fresh player's successful reed use would work with disposable reeds. One experienced/fresh pair with equal health does not establish transfer advantage. Holdouts reorder a little rain in the same three geometries and partly overlap development schedules. Agent isolation is instructed rather than technical, and the model sample is correlated.

**Human participants:0.** Enjoyment, emotional payoff, visual onboarding and voluntary replay remain unknown.

## Decisions already taken

1. **Keep immediate invention provisionally.** It makes capability consequences visible sooner. Separate and field variants remain available; budget/strength confounds are documented.
2. **Keep persistent rooted reeds provisionally.** They give a coherent lasting alternative. Comparative experience benefit is unproven.
3. **Reject two preparation turns as default.** In this screen they mostly add setup and unused discovery to an already forgiving challenge. Preserve the variant for comparison.
4. **Remove compulsory settled clicking.** Optional full-forecast resolution executes and records every actual pulse, preserving the payoff and replay.
5. **Revise the grader.** Require actual branch measurements, preserve interpretive unknowns, detect safe states despite continuing activity, and flag discovery without practical use. Eight adversarial feature fixtures and real replay counterexamples protect those bounded claims.

[Four substantive cycles and the grader audit](iterations.md); [actual playtest conditions, seeds and traces](playtests.md); [independent critical review](decision-review.md); [machine evidence](../results/evaluation.json). The rules comparisons use preserved configurations in one build; they are not four independently shipped releases. Rooted and preparation comparisons were screened in a batch after the first discovery comparison, with later retention decisions informed by replay inspection.

## The next experiment and stopping rule

Freeze one announced spatial/timing alteration that changes the relative value of two existing constructions. Compare continuations that optimize survival/health without novelty rewards. Before testing, specify what each opening buys, one plausible mistake, a recoverable consequence, and the relation a trained player should predict in an unseen arrangement. Reserve genuinely new geometry as well as new seed numbers. Include an actual failed-run branch.

If the same grove-first plan remains sufficient without a sensible revised decision, abandon the attempt to sustain tactical flood pressure. Compare a deliberately short construction-and-resolution puzzle with the reserved opponent direction. Do not add exceptions or more recipes to manufacture busyness.

When actual people can play, observe roughly4–6 formative newcomers with intended onboarding, neutral retrospectives and optional replay. Compare their concrete reactions with the grader's frozen predictions, and revise the grader when those disagree. That is the next evidence needed to connect the research-informed proxies with enjoyment. The reusable harness remains useful whichever design direction survives.
