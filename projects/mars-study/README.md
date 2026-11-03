# Mars study

This is an active development project for a compelling, authentic combination story about survival and exploration on Mars, inspired by *Subnautica* and *The Martian*. Finishing a story draft or artwork pass is one milestone in a longer chain; the whole study stays here until that development is finished. This page owns the Mars direction; [story authoring](../../docs/story-authoring.md) owns the reusable design process and guidance.

The user rejected the v2 rewrite on 2 November 2026 and asked to preserve both versions for rethinking. The illustrated story is restored as the main game. Restoration does not resolve its previously reported narrative and composition problems.

| Material | Location and status |
|---|---|
| Illustrated version — **Mars: A Light That Answers** | [Published manuscript](../../stories/mars/mars.md) and its [visual brief](../../stories/mars/design-brief.md), restored from `a12ee144`. |
| V2 — **Mars: What the Ice Kept** | [Preserved manuscript](mars-v2/mars.md), [draft-specific brief](mars-v2/design-brief.md), [review outcomes](mars-v2/outcomes.md) and [preview instructions](mars-v2/README.md). An unaccepted experiment. |
| V3 — **Mars: A Place That Can Endure** | [Playable candidate and preview](mars-v3/README.md), [design brief](mars-v3/design-brief.md), [project working notes](working-notes.md). Solo expedition, local making and scientific discovery; awaiting user evaluation. |
| Artwork studies | [Inspiration and verdicts](inspiration/README.txt), including the preferred industrial/multiple-accent reference. |
| Artwork production | [Sources and tooling](production/README.md), [November 1 delivery and review report](art-review/2026.11.01_22.36.52/report.md): 317 item identities, 35 fitted appearances, 27 backgrounds and 24 landscape targets. |

Reusable methods live in [story authoring](../../docs/story-authoring.md), [fun and evaluation](../../docs/fun-and-evaluation.md) and the [icon guide](../../docs/icon-guide.md). Evolving project decisions and hypotheses belong in [working-notes.md](working-notes.md); dated art-review findings live under `art-review/`.

Run `npm run dev` and use the shared player:

| Version | Local URL |
|---|---|
| Illustrated story | `/combinations.html?story=mars/mars.md` |
| V2 | `/combinations.html?story=projects/mars-study/mars-v2/mars.md` |
| V3 | `/combinations.html?story=projects/mars-study/mars-v3/mars.md` |

Neither project draft is added to the published catalogue. The `story=` path resolves relative to `combinations.html`, with no implicit `stories/` prefix. Use the shared [lint, analysis and preview workflow](../../docs/story-authoring.md#check-and-preview-a-draft) for all versions. The earlier versions and their artwork references are preserved without generating or recompressing images.

The artwork phase was completed on 1 November 2026. Its source paintings, exact generation requests, extraction and registration records remain available for further development. The narrative rewrite is another phase of this same project, not grounds to close it. Keep detailed reviewer output and verification captures in ignored `runs/` space; retain only concise outcomes and useful project deliverables here.

## Story direction

The central design problem is to make dramatic tension and practical tinkering work through combinations. The player should build a dependable, eventually fruitful place from a small useful set of mission equipment and local materials, then do science that changes what they understand and what they need to do. This is a direction to test through the [shared development process](../../docs/story-authoring.md#develop-a-story), not an assertion that the current candidate has succeeded.

The user confirmed a **solo surface expedition**, plausible future engineering and a handful of explicit fictional allowances where useful. The mission's scientific purpose remains central. This resolves the earlier question about rescuing crewmates: passive companions should not become objects the player must manage. Draft-specific equipment and fiction assumptions belong in each `design-brief.md`; the [v3 brief](mars-v3/design-brief.md) records its current choices and scientific boundaries.

### Make a place, investigate it and care what happens

Explore tinkering and building in situ with limited payload space, without turning the game into resource accounting. Payload limits are a possible narrative explanation for the solo mission and compact starting supplies, not a demonstrated mission requirement. Local making must remain physically intelligible: imported precision hardware can do substantial work, while local materials provide appropriate bulk and feedstocks.

The original planning target was approximately 200 meaningful combinations along a complete playthrough. The user later requested removing unnecessary processing and comparison work; preserve that priority when judging length. Use [structural analysis](../../docs/story-authoring.md#analyze-combination-structure) to inspect the current draft rather than carrying forward a stale table or padding its route. The [working notes](working-notes.md) retain the development history and findings.

Make the habitat feel like somewhere worth living, with room for calm, constructive and nurturing work. Growing things was a strength of the illustrated story. Its purpose, physical conditions and payoff should fit the expedition, rather than serving as an unrelated interlude.

Keep meaningful science in the player's hands. Explore how combining can let the player investigate a question, form a hypothesis and act on evidence. Each retained experiment should reveal something that changes the question or next action. Avoid a long procession of instrument attachments, routine controls and documentation before the interesting discovery can happen.

### Let something extraordinary happen

The intended discovery is a small, long-dead bug-like creature preserved in an ice core, possibly only visible through microscopy. Make the find exciting and consequential. It is a preserved body, not a living companion; social interaction in the manner of *Project Hail Mary* would not fit this story's object-combining activity.

Preserve the scientific identity of the expedition while making the fiction explicit. The game's discovery is not a claim about actual Martian life. Research should support the meaningful operations and their limits; the draft brief should distinguish that support from the story's allowances.

### Narrative possibilities to test

The following is an exploratory arc, not a required sequence or a list of scenes every revision must contain:

1. **Recover:** landing damage or damage to a previously delivered installation gives the opening a practical, dramatic purpose.
2. **Stabilize:** establish water, communications and a comfortable home, with growing and nurturing work that matters.
3. **Expand:** make the expedition capable of investigation through a useful rover, laboratory and scientific equipment, using local materials where plausible.
4. **Study:** carry out substantial experiments; avoid dividing worthwhile science into trivial procedural steps.
5. **Discover:** find the preserved creature in the ice and follow the consequences of that evidence.
6. **Return:** prepare fuel, the return vessel and the actual sample for the journey home.

Adversity can arise along this arc when it follows from circumstances and changes something the player values. Landing damage, a pressure-dome rupture, equipment breaking during an expedition or a fall were suggested possibilities, not mandatory accidents. A difficulty involving an earlier construction might give that work practical and emotional weight. Balance that possibility with the user's welcome for calm and nurturing passages.

Other unselected ideas include adapting caves, making useful structures from local dust with solar heat, and finding a comfortable habitat form with light or windows. Local water extraction, construction materials, solar power and propellant production are research directions; lunar resource-use concepts and Mars oxygen-production work such as MOXIE are possible starting points, not proof of a complete Mars settlement's feasibility. Any adopted process needs appropriate research and a clear fictional boundary.

Radio messages from the base, orbiter or Earth might provide concise human reactions and scene motivation. A loss of communications could convey trouble, if earned by events. Test whether the voice feels like something a person would naturally say, rather than exposition or a recipe list; respect the communication conditions of the chosen mission. The player's combinations should still perform the consequential work.

### Address the reported failures

For the illustrated story, the user's criticism identifies these priorities:

- Remove photography as progression, including photographs of findings, scientific work, crew and meals. Let the player do the interesting work itself.
- Develop fewer substantial threads with clearer movement between situations.
- Introduce fewer fresh items and avoid repeated deliveries of supplies.
- Reduce near-identical rovers, vehicles, tents, canopies and shelters, along with repeated rips and repairs.
- Remove chains of tiny attachments that delay the science; every retained composition needs a natural practical purpose.
- Reconsider actions that fail visually. Placing an ascent vehicle onto an orbiter exposed problems of perspective and representational scale.
- Keep actual working sets manageable, including intermediate states.

The rejected v2 was too short, lacked drama and left the work poorly motivated. Its technical completion and positive agent reactions did not resolve those failures or establish user acceptance. Further reviews and playtests follow [fun and evaluation](../../docs/fun-and-evaluation.md); the user evaluates whether the result succeeds.

### Preserve the physical art direction

Mars should use objects sized in proportion to their physical size, with readable limits for very small and very large things. The rover should feel big, and different shapes should retain their silhouettes. Use the [Cookbook design brief](../../stories/cookbook/design-brief.md) as the size-hierarchy reference.

Integrate fixed hotspots into the landscape as in Settlement. Review the [Settlement examples](../../stories/settlement/design-examples.png), [Cookbook examples](../../stories/cookbook/design-examples.png) and [icon guide](../../docs/icon-guide.md) when returning to artwork. Preserve this project's existing inspiration studies and production sources.

Art remains secondary while finding a compelling story and set of compositions. Placeholder icons or ordinary text items are acceptable; the user allowed missing-icon lint errors during this exploratory phase. That allowance does not change the shared linter's validation rules. Do not produce new artwork simply to make an unproven draft appear finished.
