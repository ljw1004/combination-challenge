# Writing a combination story

This is the guide to designing, writing and revising stories. Start from the [game's philosophy](../README.md#philosophy): enjoyable making and discovery should leave players with understanding worth carrying beyond the game. The [format specification](story-format-spec.md) defines syntax and game semantics; the [README](../README.md) covers file layout and tools; [fun and evaluation](fun-and-evaluation.md) owns review and playtesting methods. These are authoring aims, not claims that every current manuscript already meets them.

Before revising a story, read its active `design-brief.md`. It owns the story’s lasting purpose, voice, pacing, physical premises and visual direction. This guide owns the development process and reusable story techniques; the [icon guide](icon-guide.md) owns detailed graphics production, and [UX](ux.md) owns interface behavior. The [repository layout](../README.md#story-layout) reserves the brief filename outside manuscript discovery.

## Keep one active design brief

For a story in `stories/<story>/`, its companion `design-brief.md` is the authority for accepted intent, including work performed in a study directory. Link to it from the active study index and production instructions. Read it at the start of each new assignment; do not infer current intent from the nearest old draft or generation prompt. Update it when a decision is adopted, alongside affected work. Refer to the applicable techniques in this guide and record the story's choices and exceptions, rather than copying the universal instructions.

Keep proposed departures and unresolved questions in the study's working notes. An experimental draft follows the active brief except for its explicitly identified hypotheses; accepting an experiment updates the active brief deliberately. Frozen iteration briefs describe their original versions and do not become competing current instructions. Do not repeatedly copy a study brief wholesale over the active one. A new unpublished story may begin with its active brief in the study; move that authority beside the manuscript on promotion and update entry points.

Keep dated decisions and verification outcomes in notes or project records. Production commands must identify their actual input and output paths: moving the manuscript or changing a documentation link does not retarget a script. Preserve frozen references, and adapt historical tools before using them on current work.

## Choose a premise that works through combination

Find the essential act of combining before committing to a setting. Cooking naturally joins ingredients into something satisfying; settlement-building can grow from a few raw materials; intellectual history can join inherited ideas with a new experience or argument. Other forms are welcome, but the premise must make the player's repeated act worthwhile.

Choose who the player is and what that role makes possible. Settlement casts the player as a pioneer building from raw materials; Cookbook can make combining an active recipe notation; Ideas and Theology put the player in successive thinkers' positions. A story may follow one continuous thread or interleave threads that later meet. Treat the structure as a design choice to test against clarity and momentum.

The framework supports manipulating objects and reconstructing ideas. It has no reciprocal social interaction: treating a person or animal as a thing to drag and combine can make a relationship uncanny. It also abstracts supplies rather than counting scarce units to allocate. Build the interest around choosing, learning and discovering what belongs together.

Satisfying construction and curiosity about the unfolding story are two useful hooks. Both need substantial content; neither implies that every step needs a surprise. The [analysis guidance](#analyze-combination-structure) helps inspect the shape and scale of that content without turning counts into a quality score.

## Develop a story

Scale this loop to the change. A prose correction need not reopen the art direction, and an intellectual story may be revised entirely in logical/text space. Keep the applicable checks explicit without turning the process into mandatory artwork generation or repeated full campaigns.

1. **Establish intent and scope.** Read the active brief; identify the manuscript being changed, its audience, player role, purpose and applicable techniques below. For a revision, state the problem and the observable improvement sought. Separate accepted constraints from hypotheses and fictional allowances.
2. **Trace the work before decorating it.** Sketch the motives and actual combinations. For each operation, identify what each input contributes, what changes, why that matters now and what would be lost if the operation were removed or bundled. Follow important objects, ideas and capabilities across chapters. A plausible explanation does not establish that a step is useful.
3. **Prototype the difficult sequences.** Use text or placeholders to make the combinations playable. Test representative problems such as a recurring place, independent construction orders, a resource-dependent machine or an abstract argument. Resolve dependencies and motives before expanding an expensive artwork family. A familiar easy icon alone is an inadequate pilot for a story whose difficult scenes are assemblies.
4. **Review the relevant questions.** Choose assignments from the review table below. Use the current artifact and appropriate context, following [reviewer independence](fun-and-evaluation.md#reviewer-independence). Assess findings rather than automatically implementing them. Seek user evaluation of meaningful creative choices and the playable result; routine inconsistencies should be investigated before delivery.
5. **Carry each correction through the story.** Update the owning brief or shared guidance, then identify affected recipes, readings, supplies, appearances, source references and checks. Inspect downstream uses and earlier scenes that can expose the changed object. Update or retire superseded instructions; do not leave a new requirement only in a chat or one generation prompt.
6. **Produce and integrate related families when artwork is needed.** Follow the [icon guide](icon-guide.md) with approved physical references and explicit invariants. Generate independent families concurrently when useful; dependent states need a common reference and integration review. Inspect delivered pictures and actual gameplay against the requirements, even when the prompts were correct.
7. **Verify the changed result.** Run relevant semantic, continuity, visual and comprehension checks. Include meaningful alternate orders, partial assemblies and later appearances. Bind each result to the version and scope actually inspected. A changed dependency or image invalidates affected earlier approvals; unrelated checks need not be repeated without a reason.
8. **Retain the decision and continue deliberately.** Record concise outcomes, unresolved issues and the next hypothesis in their owning locations. Remove disposable output. A completed draft or artwork pass is an intermediate milestone; passing checks does not establish learning or enjoyment.

Keep the active project's drafts, research, hypotheses and retained design deliverables together until the overall development effort is complete. Follow the [project lifecycle](../AGENTS.md#directory-hygiene) and [verification retention policy](engineering.md#verification-records); those documents own where working material and concise outcomes belong.

### Choose reviews by question

Every substantial draft needs scrutiny of purpose, understandable causality and continuity. Add specialist assignments for the techniques and risks actually present. A narrow correction usually needs the affected checks, not another complete set of director rounds. Role titles alone do not establish coverage.

| Question and applicable scope | Input and useful finding | What it does not establish |
|---|---|---|
| Narrative and necessity: all stories | Current arc and recipes. Identify an unmotivated action, weak contribution, missing payoff or a simpler sequence; explain what its removal would lose. | Physical feasibility or player enjoyment. |
| Forward understanding: new or ambiguous combinations | The [blind two-question case](fun-and-evaluation.md#blind-combination-and-story-beat-readings), with only its prescribed player context. Record a natural action and predicted result before explanation. | Whole-story pacing or factual truth. |
| Continuity and mechanics: dependencies, reuse and changed states | Actual recipes, goals and versioned engine states. Find a concrete legal order that acts too early, loses a needed object, duplicates a unique one or strands continuation. | Physical identity in artwork or universal proof from one route. |
| Feasibility, provenance and necessity: physical construction | Available materials, donor equipment, tools, working conditions and allowed fiction, plus actual pictures when available. Identify unexplained parts and propose the least-work solution that serves the purpose. | Engineering qualification; a viable mechanism alone does not justify its construction. |
| Recognition: important visual distinctions | Unlabelled artwork, then the separately specified contextual stage in the [icon review method](icon-guide.md#6-run-separate-recognition-and-art-direction-reviews). Record interpretations and confusions. | Construction feasibility or consistent appearances elsewhere. |
| Visual continuity and registration: recurring places and assemblies | All relevant appearances, selected backgrounds, registered composites and legal partial states at playing size. Identify a changed landmark, missing fitted part, seam, wrong scale or obstructed target. | Blind recognition; this reviewer knows the intended objects. |
| Intellectual explanation and authenticity: arguments and teaching | Separate title-only and card-only readers; an informed reviewer separately receives actual recipes and relevant primary sources. Check each input's contribution, attribution and limits. | Learning from completion or a familiar reviewer repeating the intended label. |

Give informed reviewers the applicable current requirements without earlier criticism or verdicts. For each assignment, identify the input version, supplied context, question, observed issue, adopted response and remaining limit. Prefer a concrete counterexample or a named inspected case over a blanket verdict. Keep mechanics, plausibility, recognition, comprehension and enjoyment conclusions separate. The [evaluation guide](fun-and-evaluation.md) owns independence, player protocols and evidence limits; these assignments select what to examine.

### Keep requirements connected to the work

Use the existing manuscript, catalogue and layout records rather than maintaining parallel inventories. For a relevant object or idea, record its identity, physical form or claim, source or attribution, creating and using recipes, prerequisites, persistent features and appearances. For a change, identify affected entries and the checks that must be repeated. Keep proposed automation in the [backlog](../projects/backlog.md#authoring-automation); temporary review packets and comparison sheets belong in `runs/`.

These are required editorial practices, not claims that tools enforce them. Shared lint, checkpoints, replay and browser tests check their documented mechanics. Automatic provenance validation, complete cross-file change propagation and a general lifecycle-review generator remain proposed tooling. Until implemented, perform those reviews explicitly using the existing records; do not report a documented requirement as an automated pass.

## Make combining worthwhile

The player chooses and combines the things themselves. Give each operation a recognizable purpose, contribution and result. Keep the interaction predictable within the format's small grammar; if a passage appears to need several outputs at once, rethink its combinations.

Learning, comfortable construction, curiosity, beauty, conceptual resonance and a satisfying ending can all reward play. A plan may span several combinations, and straightforward enactment after an insight can be enjoyable. Keep clever short solutions. Do not manufacture a dilemma for every gesture, pad recipe counts or require every optional branch. Revise or discard an idea that does not further combination, enjoyable play and empirical learning. The [fun and evaluation guide](fun-and-evaluation.md) explains the working theory and how to test it.

Let the player perform the work that makes the story interesting. A sequence of photographing, recording or documenting an event rarely substitutes for participating in it. Each retained operation should be something a person in that situation would naturally do: flour and butter can make a roux; a contrived “routed navigation chip” may merely rename an instruction as an object. Authenticity should support substantial action, without requiring every screw and washer to become a separate step. Match the scale of work to the narrative pace, especially during a crisis.

## Let the story follow from the work

Situations, feelings, problems, next steps and solutions should arise from established circumstances. A crisis earns its place by changing something the player cares about; calm construction and nurturing can carry the story too. Avoid an accident, misunderstanding or unreasonable character decision inserted solely to force the next scene.

Follow a few substantial threads. At each beat, establish where the player is, what they are trying to do, why it matters now and what invites the next step. Too many locations and disconnected problems make even individually plausible scenes hard to follow. Ask narrative reviewers to examine that movement under the [evaluation guide](fun-and-evaluation.md#reviewer-independence).

Let consequential events happen through combinations and their results. Chapter introductions usually need only zero to two sentences to set the scene, provide motivation or explain a move; they should not carry a story that the player's actions never enact.

## Make the action understandable

Mark one immediately usable opening recipe as the tutorial, following the [format and lint rules](story-format-spec.md). Choose a clear example of combining, with the item to drag written first and its receiving target second. The demonstration reveals the gesture and ingredients, while the result remains a discovery. See [contextual tutorials](ux.md#contextual-tutorials) for when the cues appear and disappear.

Assume chapter prose and primitive explanations may be skipped. Necessary premises belong in the visible task, item name, component or observed result. Review a combination forwards: why would these two things suggest trying this operation, and what does each contribute? Reject an input that already states the complete output unless the operation adds a meaningful change. A longer explanation cannot repair a missing ingredient, premise or purpose.

Authors can distinguish operations on the same material through different receiving locations: `A @ H1` and `A @ H2` can produce different results. Prefer that simple gesture when the place makes the intended work clear. Use `A + B @ H` sparingly, where bringing both ingredients together at that place is compelling; the preparatory placement makes these combinations harder for players to understand.

Prefer no more than two simultaneously visible fixed items in a chapter, counting inherited locations too. Successive replacement states count by their simultaneous presence, not by the number of declarations. Three is an occasional exception for distinct, compelling jobs and produces a warning unless that chapter's Hotspots section contains the exact top-level acknowledgment below, with a meaningful explanation replacing `<REASON>`:

```md
- (three hotspots are a lot but okay here because <REASON>)
```

Four or more active hotspots are a hard lint error. Acknowledgments are chapter-local even when the hotspots are inherited. The editor's lightbulb inserts the explanation template and selects its placeholder; it also offers removal when fewer than three hotspots make the acknowledgment obsolete, just as for goal acknowledgments. The [specification](story-format-spec.md#specification) owns the exact syntax and diagnostics, and [UX](ux.md#debug-pane) owns these editor actions.

A hotspot should represent a meaningful place, apparatus or process. Cut needless station visits and let complete equipment perform routine internal steps; dividing a process among more locations can turn making into repetitive sequencing. Do not split chapters merely to satisfy the count.

Use [complete-operation abstractions](#complete-operations-and-elapsed-time) for routine handling and elapsed duration while preserving the important inputs and consequences.

Use [separate specimens and consequential discoveries](#separate-specimens-and-consequential-discoveries) when investigation drives the story. Mere comparison need not create another physical object.

A hotspot is an ordinary item annotated as fixed for a chapter. Declare its identity separately in Items; put starting primitives in the chapter that introduces them. A constructed fixed item appears only after it is made. For a later appearance, establish its creation through earlier goals and list the same surviving identity under Hotspots again. Keep its appearance recognizably the same equipment or working surface. The [specification](story-format-spec.md#specification) owns availability, conditional `@` rules, fixed retirement and carry restrictions. Do not rely on optional earlier work or a special action order to make fixed scenery behave correctly.

When a discovery changes only a location's appearance, use a chapter-local `icon after creating Reference:` directive under its Hotspots entry. This can show an impact changing a rocky world after Moon is made while preserving the world's identity and existing recipes. Keep capability changes in actual recipe prerequisites. The [specification](story-format-spec.md#specification) owns conditional icon ordering, references and inheritance.

Use simple names and direct English. A quotation can be the item itself; do not compress an important 5–12 word claim into an obscure icon or slogan. A stronger tool should retain its applicable uses through explicitly authored alternative recipes. Do not grant capabilities just because an unrelated component is somewhere inside a construction.

Name what the player handles. In concrete stories, prefer physical nouns such as **Steel sheets and bars** or **Gas cylinders** to purpose-based abstractions such as **Structural stock** or **Gas receiver stock**. A useful condition can qualify that concrete object.

When an item is visibly unfinished, name the condition that suggests its next useful operation: `Unfiltered yoghurt + Filter -> Yoghurt`, or `Drinking water supply + Unwatered growing beds -> Irrigated growing beds`. Prefer a concrete need such as raw, dusty, empty or uninsulated over a label that merely records the previous step. Remove the qualifying adjective when the need is resolved, unless the resulting state matters later. Use this where it clarifies the object; do not invent deficiencies, add steps or reveal a discovery just to make every name instructional.

Names, artwork, physical access, supplies and task must agree. A whole greenhouse is not a portable tool. A photo, map or observation must answer a real story question. Avoid calibration, labelling and paperwork steps that merely lengthen a route. Keep crafting meaningful: an optional earlier construction should not arrive ready-made later if the player skipped making it.

Visual form tests a physical combination. Check whether the objects' shape, scale, perspective and relationship support the action; revise an ambition that cannot be represented convincingly. Preserve natural silhouettes and aspect ratios, and use proportional sizes with readable lower and usable upper bounds when physical size matters. Follow the [icon guide](icon-guide.md) for production. Text items or simple placeholders suffice during story exploration, and finished artwork must not prevent removing weak compositions.

Primitive icons can begin at an authored point in the landscape: a water supply in a river, for example, or fire beside a shelter. Leave room above each icon for its name. Use the starting-position syntax and restrictions in the [specification](story-format-spec.md); ordinary created items appear where the player combines their ingredients.

Use [scenery as an interaction target](#scenery-as-an-interaction-target) and [landscapes that change](#landscapes-that-change-through-fixed-items) when the work belongs in the environment. The [icon guide](icon-guide.md#8-expand-through-related-families) owns production and registration details.

Use a hotspot's `place:` entries when an item should settle at a particular point in the scenery: a tower on a cape, a beacon on a mast, or a cooked result inside an oven. List the receiving ingredient as well as the result when both should share a destination. The [specification](story-format-spec.md) defines centre coordinates, containment lint and occupied-space fallback. Choose a centre inside the hotspot's circular or rectangular hit area and leave room for the whole item and its name; placement does not introduce a supply or require a goal.

## Give chapters a purpose and a manageable working set

Chapters should usually have a particular place, time or speaker. A new table need not require a new city or invented date. Prefer “How does evil exist?” to routine first-person intentions such as “I need to know how evil exists.” Declare scenery using the [specification's `background:` syntax](story-format-spec.md#specification); ordinary images illustrate the reading and can lead an opening even when the scenery is inherited. For a new historical perspective, begin the authored opening with an italic `*Person, Place, Year*` line after any background declaration. Briefly introduce who the person is and their relevant situation, then establish the question that draws them forward. Subsequent chapters from the same perspective retain the orientation but continue the thought without repeating the biography. Use approximate dates or explicit uncertainty instead of invented precision. The chapter heading is not automatically repeated in the opening popup; author the orientation in the prose itself.

State the next purpose or new information without retelling what play has shown. “Time to collect a core from this basin, and record its findings against the terrain” needs no recap of how the survey brought the player there. Bring the earlier Terrain model into the actual combination.

Use chapters to focus a smaller task as well as to change locations or introduce hotspots. Prefer roughly 2–5 things for difficult abstract reasoning and up to about 9 for familiar physical scenes. These are aims, not hard limits; keep worthwhile alternatives and review both arrival and peak clutter in the browser. A next-morning visit can explain a refreshed surface in the same location. Match the stated time and indoor/outdoor setting to the artwork.

A small set of primitive materials with many useful descendants can build continuity across chapters, as in Settlement and Cookbook. A larger supply of new ideas may fit successive historical speakers, as in Ideas and Theology. Choose that structure deliberately: repeatedly delivering new props can leave earlier work without consequence. Reduce near-identical vehicles, shelters, tools and repair problems when they add neither a new purpose nor a new kind of making. Review intermediate constructions as well as starting inventory when judging screen clutter.

Give every identity an explicit declaration under the [specification's declaration rules](story-format-spec.md#specification); a goal or recipe name alone is insufficient. Keep derived declarations near their producing recipes or explanations, and primitive Items entries in the chapters that should supply them. Derived entries describe objects without bringing in their ingredients or preventing cleanup. Goals still pull their dependencies into the chapter, including through global recipes; review future-supply warnings in that light. A return visit is a new story beat: give it a purpose and choose what matters now. The [opportunity lint](story-format-spec.md#opportunities-for-authored-content) checks optional constructions after goal-only play of preceding chapters, pessimistically treating possible earlier retirement as actual retirement. An opportunity dependent on a particular earlier leftover may therefore trigger a warning. A verification limit requires analysis of the checker’s growth, not an editorial claim that the content is impossible.

## Write purposeful goals and continuity

Prefer no more than two active goals at a time. Use `next:` chains to stage required preparations, while allowing early discovery. If two preparations must precede a third, put them in a single “both/and” goal followed by the next goal. Phrase the task so it stays understandable as its conditions are completed.

When three independent goals are clearer together, explain the specific reason in the Goals section using the [specification's exact acknowledgment syntax](story-format-spec.md). The editor's suppression action inserts the template and selects the reason to replace. Explain the scene's relationship, reuse or comparison; do not merely say that the warning is acceptable. Four visible chains require restructuring, and an obsolete acknowledgment should be removed when the count falls.

Accept alternative results when either serves the purpose. “Cook a cauliflower dish” can accept Cauliflower gratin or Buttered cauliflower; the player need not make both. Require both only when both matter: plain Puff pastry for later almond pastries and Cheese straws for the current meal, for example. Give optional products a useful choice, discovery or later use. Cut purposeless branches instead of inventing goals solely to retain them.

Later chapters should make useful earlier creations matter. Carrying an unused token or raw supply is not continuity. Reuse can cross a gap and should change what the player can do or understand. Accept plausible tools and preparation orders through explicit alternatives.

Keep shortcuts legitimate. Put essential continuity in `[If skipped]` text when a chapter's work might already be complete. A final text-only chapter can give the story a satisfying conclusion without adding chores.

## Choose fates and constructions that fit the action

Apply the specification's infinite-resource model through believable visibility and placement choices. Cooking dough into pastry or preparing a cauliflower dish suggests `[transform]`; using water, fire or a tool often suggests leaving it visible. Avoid turning these hints into stock accounting, replenishment chores, production rates or an action-credit economy.

Track the physical form and location of unique objects across their uses. Preserving a material stock is different from creating another copy of a particular crop, vehicle or sample. Make each input's physical contribution visible and carry the same object through its meaningful changes.

Be specific about a material's form. A tree and saw might yield a whole trunk or sawn planks; those forms support different later work. An abstract concept of “wood” can cover more possibilities in an abstract story, but a concrete object must not quietly change its nature to suit the next recipe.

Make the reason for retaining a shared ingredient visible through meaningful goals. In the pastry example, another required preparation protects the ingredient it still needs. Do not change a fitting transformation to preservation merely to keep an incidental recipe available. Use the specification's default and single-use annotation rules when writing the actual reagents.

Review mixed-fate warnings in context. Keeping a tool visible after using it and hiding its outside copy after fitting it into a construction can both make sense. Explain the changed role through the action. The warning is an invitation to review the presentation, not to preserve everything.

Use a named compound and slots when independently fitted parts should remain legible. Use a transformation when a genuine change of identity should wrap up those internal details. Existing parts satisfy their owner's slot requirements; they do not imply independently usable outside tools. Use exclusivity to express meaningful alternative histories, with consequences the player can understand before choosing.

## Review warnings against played behavior

Check undeclared names for spelling mistakes before adding new declarations. Review unused-declaration warnings for abandoned content or accidental alternate spellings; an intentionally supplied worldbuilding item can remain. Terminal recipe results already count as referenced, so they need no invented follow-on recipe or goal to silence this check. The [lint catalogue](story-format-spec.md#lint-rules) owns the exact reference and severity rules.

Three-goal, three-hotspot and mixed-fate warnings are invitations to inspect the player experience, not a target of zero warnings. Use `next:` when sequential disclosure helps; every stage still remains required. Independent goals or locations may be clearer together, subject to the [count limits and acknowledgment rules](story-format-spec.md#lint-rules).

When deep lint reports `no-continuation`, inspect the unsatisfiable or conflicting goal lines it identifies and their related dependencies. This check uses the specified chronological, monotone closure; it is not a proof about every possible order of play. Fix the requirements or dependencies, then regenerate a legal checkpoint route and inspect the affected passage.

Fate annotations are visibility/placement hints, and future-use protection can retain an input despite a hiding hint. Compare what a player actually sees across earlier and later uses before normalizing annotations. A consistent authored fate can still produce different visible behavior; preserving an old object beside its upgraded replacement can also blur identity. Keep tool reuse, material incorporation and genuine state changes legible. Test a concrete alternative and retain negative results rather than equating fewer warnings with more fun.

## Write wonders and attribution

Explain a useful distinction or what the result makes possible, and why it matters. Do not write operating instructions, an upcoming recipe list, an unearned capability claim or cryptic teasing prose. The [UX guide](ux.md) owns how these cards are presented.

An explanatory wonder should stand alone for someone who has not read either ingredient's title or explanation. A useful form is a motivating question in its own paragraph, the essential contribution of each input, and a fuller explanation of the resulting insight or disagreement, followed by the result's title in a separate italic paragraph. Name the people, objects and claims rather than relying on an unexplained “this” or “it”. Primitive readings explain their own premise or example; they need no invented synthesis. The closing title is authored Markdown, not an automatically generated caption. Review titles separately for readers who skip wonders, and wonders separately for readers who skip titles. Find the essential work of the question, each input and the synthesis; cut repeated framing and commentary about the act of reasoning. Keep qualifications that affect the conclusion, expressed as simply as possible. Brevity must not remove an input or make a card depend on earlier readings.

When the player occupies a thinker's desk, state their own premises directly, credit other writers naturally, and let the conclusion follow from their perspective. This usually means direct reasoning, not autobiographical “I read”, “I argue” or “my account”, nor a narrator telling the player what their current character believes. First person remains natural in attributed quotations and hypothetical examples (“I know I should return the stolen meal”), where it voices a supposed person rather than the historical thinker. Ordinary inclusive language need not be removed mechanically. This voice is an educational reconstruction, not a historical quotation. Preserve attributed disagreements and limits of an argument without signalling a predetermined winner. The [Theology brief](../stories/theology/design-brief.md) applies this pattern to its changing speakers.

Frequency depends on the story. Abstract Ideas and Theology advances often need immediate explanation, and most items in a small abstract scene may merit wonders. Theology's confusing intermediate arguments intentionally retain their explanations even when a later result revisits the topic. Familiar preparations such as Salt-preserved fish need not get a popup. Reserve them for what matters to the story or needs explanation about further uses; neither a fixed quota nor old reader-only status decides quality.

Treat primitive explanations as optional reading, not invented discovery awards. Use slot-qualified wonders to celebrate a completed construction rather than its bare shell. In complex multi-voice narratives, omit the current speaker's redundant name on their own desk: “Foo” can become “Previous speaker: Foo” when the player moves to another identity through a `from chapter` name change. A return to that speaker can restore the local title. Keep names for borrowed claims and comparisons that need to distinguish speakers. The authored wonder keeps the voice and closing title of its original desk, with foreign claims credited in the prose. Chapter-dependent icons can likewise show a solar array becoming dusty when a storm arrives. Use stable item and chapter identifiers while titles and chapter order are still changing; see the [specification](story-format-spec.md#specification) for syntax. These changes communicate the current condition; recipes still define what the player can do, and the explanation remains a stable record.

## Keep intellectual and factual claims honest

Distinguish physical transformation, historical transmission, analogy, interpretation, criticism and deduction. A historical or artistic synthesis need not be a logically forced theorem. A new name alone is not a new intellectual achievement, either.

Do not make intellectual history an inevitable ladder toward the latest speaker. Religious and natural explanations can coexist. Attribute doctrinal claims to particular texts and traditions; completing their combination reconstructs a position, not a proof of religious truth. Keep genuine quotations accurate. Put source references and factual qualifications in `> NOTE:` author comments when they do not belong in gameplay.

Review factual authenticity separately from forward player intuition. A defensible retrospective explanation does not make a contrived combination understandable. Use the [completed authenticity record](<../archive/2026.10.30 authenticity improvements/authenticity-improvements-2026-10-30.md>) for historical findings, decisions and evidence, and the [editorial backlog](../projects/backlog.md) for new work, current story directions and future ideas.

## Reusable story techniques

Select techniques because the story needs them. Its brief should link to the applicable entries and specify local choices, persistent features and fictional allowances. These are authoring patterns using the existing format, not new engine features. Each combines a purpose, common failures and an appropriate check; use the [review assignments](#choose-reviews-by-question) without imposing every specialist audit on every story.

### Resource-limited construction

Use this when scarce payload, local materials or improvised tools are part of the story's appeal. Trace significant parts to supplied equipment, an actual donor, a local source or an established fabrication process. Record the material's form, the necessary tools and conditions, what the donor loses, and where the part is used later. Distinguish a representative supply icon from a unique reusable object. The engine's infinite-resource abstraction does not establish unlimited physical cargo; an author-side allocation need not become player quantity accounting.

Ask both whether the construction can work and whether the person would choose to spend effort on it. Consider an existing object, a simpler local support, fewer parts or omission before adding machinery. Inspect the delivered picture for implied material, machining, joints, furniture and instruments that the recipe never supplied. Wear and rough paint do not make an elaborate assembly easy to fabricate. A donor cannot keep performing a function whose essential part has been removed; shared hardware cannot occupy two operating machines at once.

Separate the mechanism the story teaches from its bounded fictional allowances. Keep accepted assumptions visible in the brief; do not silently expand them into a supply of arbitrary capabilities, or add manufacturing and inspection chores merely to defend every abstraction. Review a complete chain from obtaining the first material through the later use of its product. Check circular prerequisites, incompatible material forms, unexplained precision parts and simpler ways to achieve the same purpose.

### Complete operations and elapsed time

Use this to keep attention on worthwhile making, investigation and care. A combination may include routine cleaning, fitting, transport, checking, repeated batches or elapsed growth when its result and context make that scope intelligible. Preserve the actual necessary inputs and apparatus, and teach the mechanism that matters. Include a short explanation when an otherwise invisible part of the operation is needed to understand the result.

Bundling must not turn a connection into a complete unexplained factory, a small container into an entire expedition's supply, or an observation into a stronger conclusion. Conversely, different real durations do not require waiting tokens, timers or extra maintenance chapters. Review what the player would reasonably infer from the objects, action and result; ask which omitted detail changes the causal account and which merely adds routine work.

### Landscapes that change through fixed items

Use this when repairing, clearing or constructing should visibly change the place where the player works. Represent each meaningful scene state with an ordinary item declared fixed in that chapter. Transform or consume the old fixed state through an actual recipe into the next state; declare the derived state without supplying it prematurely. Arrange the registered artwork so the action changes that part of the landscape in place. Later appearances must use the state actually established earlier.

Plan logical states and visual changes together. Keep the camera, physical scale, landmarks and unchanged contact points stable. A transparent replacement needs a background that remains valid outside its silhouette. If the old form is painted into the background, the replacement must erase that form without covering an independently changing neighbor. The [registration method](icon-guide.md#register-changing-scenery) covers production details. Do not paint a future construction permanently into an earlier background or add a duplicate portable building as the result.

Check actual fixed-state retirement, including alternative orders and scrollback. Future-use protection can retain an input; the [fixed-item contract](story-format-spec.md#specification) requires retiring fixed operands to disappear whenever the operation is executable. Inspect the initial state, each transition and the completed scene at playing size, then reload. A montage containing every declaration is useful for finding extraction errors, but mutually exclusive states together are not a legal gameplay witness.

### Scenery as an interaction target

Use this for an existing landscape feature or apparatus that belongs naturally in a painting. The complete background can show the rock face, shoreline, oven or work surface; a fully transparent PNG defines its fixed receiving area. Record the feature, center and display dimensions together. The transparent image supplies interaction geometry, not the visible object and not permission to reveal a construction before it exists.

Compose targets with their surroundings and preserve room for movable items and names. Use the existing `place:` mechanism when a received item or result should settle at a particular point; it does not create supplies or enforce a prerequisite. Check the actual hit area, target recognition, placement and narrow-screen crop through real dragging. A beautifully integrated feature can still be hard to identify as the receiver or have an unreachable target. See [scene composition](icon-guide.md#8-expand-through-related-families) and [placement semantics](story-format-spec.md#specification).

When attached details extend beyond the useful receiver, use an independent rectangular `hitbox:` to keep the receiving area on the apparatus while preserving the complete registered painting. A long cable need not make the intervening landscape interactive. Conversely, a small painted outlet can receive input over its clearly identified half of a vessel. Check both accepted and rejected drop points, not just the centre. Syntax and shared geometry belong to the [specification](story-format-spec.md#specification).

### Independent construction and operating states

Use a compound when independently added parts should remain individually meaningful. Its base and slot overlays share the same canvas and registered geometry; declaration order supplies the visual stacking order regardless of installation order. Plan the complete assembly and its partial states together. Preserve already installed parts when another slot is filled. An ordinary transformation creates a new identity and does not automatically transfer fitted details; author the resulting structure deliberately when a true transformation is needed.

Slots can also represent independent operating settings when that interpretation matches the action; an illuminated control need not be a new machine installed inside the panel. Keep required capabilities explicit through fitted-slot operands and goals. The [specification](story-format-spec.md#specification) owns eligibility and compound behavior.

For small assemblies, inspect every legal fitting subset and exercise meaningful alternative installation orders; three independent fittings have eight subsets. Check that incomplete states cannot perform the completed operation, layers do not erase neighboring parts, standalone components match their installed forms, and reload preserves the same appearance. Larger assemblies need stated coverage, especially overlapping parts and coupled prerequisites. Follow the [compound art method](icon-guide.md#8-expand-through-related-families).

### Recurring objects and places

Use this whenever recognition of the same container, vehicle, room, working surface or specimen matters later. Track its physical identity across logical transformations and distinguish it from similar objects. Record persistent features, permitted changes, components, connections, contact points and appearances in the existing catalogue or scene plan. A single reusable basket acquiring different contents should not quietly become several differently built baskets.

For places, establish a simple spatial account: entrances, windows, service walls, working zones and camera directions. Interior and exterior views must describe the same structure; matching screen-left positions is not sufficient when the camera changes sides. Compare all relevant appearances in a lifecycle sheet, including early/late states, reverse views and fitted components. Preserve geometry when repairing a small detail rather than regenerating the whole family without its references.

Review names and recipes alongside pictures: recognizable artwork cannot repair a duplicated unique token or an object appearing at a second site without a movement explanation. Likewise, a shared logical identity does not prove that its paintings agree. Check physical continuity and actual game states separately, using the [icon registration method](icon-guide.md#register-changing-scenery).

### Physical prerequisites and late events

Use physical availability and state to explain why an operation becomes possible. A receiving surface may be reached only after crossing, a room usable only after inflation, or a machine functional only after its fittings exist. Express those prerequisites in the actual operands, construction state or chapter-local fixed context. Global recipes are not gated by their source chapter; `next:` orders goal disclosure but does not prohibit early execution. A name or icon change through `from chapter` is presentation, not a new capability rule.

A late fixed receiver can localize an otherwise global operation to the affected place and time. Establish its existence through real prior work, and avoid supplying a primitive that bypasses the intended prerequisite. Test attempts before and after readiness, reversed preparations, access to earlier boards, and any premature completion that would bank a later repair before its damage occurs. Check the resulting art as well: the inaccessible space or incomplete assembly should make the restriction intelligible. Do not use arbitrary gates merely to force one sequence where alternatives make sense.

### Separate specimens and consequential discoveries

Use this when investigation changes the story's question or purpose. Keep the original material, an extracted section and observations distinct where their differences matter. Track collection, destructive preparation, retained remainder, examination and later custody. A picture of an intact object must not replace an earlier damaged fragment without a new source or operation.

Studying two specimens need not manufacture a comparison object; sequential goals can ask for both observations. Containers and working assemblies may be real constructions, but a comparison alone does not create a physical package. Let results change what the player can ask, understand or do; routine assays and record-making do not automatically deserve separate actions. Review the specimen lineage and the strength of the inference separately: an interesting shape or association may justify further investigation without proving origin, age or mechanism.

Make the image's certainty match that stage of the investigation. An early ambiguous finding must remain ambiguous in the painting, not only in cautious prose; a recognizable complete structure can reveal a later discovery too soon. Review an unnamed image at its displayed size before revealing the intended explanation. Preserve the preparation medium as well as the specimen: melted residue, a wet smear and an intact frozen section are different physical views.

### Intellectual synthesis and changing perspectives

Use this when combining reconstructs an argument, interpretation or discovery. Identify the actual question, each ingredient's contribution and what the result establishes. A thematic association, shared vocabulary or chronological succession alone does not make the two inputs a convincing recipe. Worked examples, contrasting cases, predictions and counterexamples can make an abstract relation usable. A worthwhile idea can also be a satisfying endpoint without supplying a later recipe.

Provide the two independent reading paths described in [wonders and attribution](#write-wonders-and-attribution): understandable titles for people who skip cards, and self-contained explanations for people who read only the resulting cards. Use a fresh title-only reader and a separate card-only reader. Supply only the current perspective and the layer under test, without recipes or missing ingredient explanations. Ask what the words mean, what relies on unstated context, and what could be clearer or shorter. Collection reviews give coverage but can teach readers context; use isolated fresh probes for remaining standalone ambiguities. An informed review must then compare each explanation against every recipe that can produce it, including alternate routes and primitive readings that need no invented synthesis.

For a comprehensive wording pass, inventory every chapter opening, local and inherited title variant, primitive explanation and result reading. One integrating editor checks consistency across any divided assignments. If gameplay is intended to stay unchanged, compare parsed structure before and after; check chapter-dependent names, authored closing titles and affected phone-size boards and readings. Keep temporary copies and reader packets under `runs/`. Focused follow-ups cover only their assigned material, not the whole manuscript.

For changing speakers, use the [chapter orientation](#give-chapters-a-purpose-and-a-manageable-working-set) and [attribution](#write-wonders-and-attribution) patterns. State the current speaker's reasoning naturally, attribute inherited claims, preserve the difference between historical quotation and educational reconstruction, and let disagreement earn its force before a reply. Check title changes at perspective changes and returns; a presentation change does not rewrite the original reading. A joint setting must not imply a meeting that did not occur.

Audit teaching through the motivating question, concrete case, explanation and limits, not the presence of a person's name or technical term. Ask readers to explain a distinction and apply it to a fresh case. Successful combination, repetition of the result's label and chapter-level fast completion do not establish understanding, later retention or continuous enjoyment. Follow the [evaluation method](fun-and-evaluation.md) for those separate questions.

To test whether a later reply changes a reader's view, record their response to the earlier argument before revealing the reply, then ask what changed and why. Do not instruct them to find a position persuasive or infer a real community's response from an AI impersonation. An umbrella chapter question need not be answered by every example within it; distinguish local comprehension from the whole argument's effect.

## Check and preview a draft

Use the shared tools for published stories and project drafts alike:

```sh
npm run lint -- path/to/story.md --details
npm run analyze -- path/to/story.md
npm run analyze -- path/to/story.md --json --details
npm run dev
```

Lint checks the manuscript against the specification; errors need correction and warnings need author review. Analysis produces a legal debugger route and the structural measures below. Inspect the draft through the normal Vite player and its [debug pane](../README.md#edit-a-story-live). For example, open `/make-something.html?story=projects/example-study/draft.md` for a draft saved at that repository-relative path. The `story=` value is a Markdown URL resolved relative to `make-something.html`; there is no implicit `stories/` prefix. Artwork paths resolve relative to the manuscript. The [README](../README.md#run-the-game) owns the complete routing and setup instructions.

Use chapter checkpoints to inspect arrivals, combinations, intermediate clutter and results in the browser. The shared route is evidence that the debugger can complete this version legally, not a shortest-route claim, a formal proof that every possible action order succeeds, or evidence of player enjoyment. Keep detailed JSON exports and other disposable verification output in ignored `runs/` space under the [retention policy](engineering.md#verification-records).

## Analyze combination structure

Analyze after the first playable draft and after changes to dependencies, supplies, chapters or pacing. Use the results to locate questions: does the story have enough substantial work, do earlier creations matter across chapters, does every scene introduce fresh supplies, or does an otherwise modest starting board become crowded? Inspect the responsible combinations and browser passage before deciding what to change. Comparing stories can suggest a different structure; matching another story's numbers cannot establish quality.

Roughly 200 meaningful combinations is a useful full-length planning hypothesis. At an assumed ten seconds per combination, that suggests about half an hour of combining. Neither the pace nor the resulting duration is established by recipe counts or agent action timings: reading, thought and interaction also take time. Test the intended length with players. Keep a strong short passage, and expand only through worthwhile making or story movement.

Compare your draft to some existing ones (cookbook, settlement, theology) to see if anything stands out. It's fine for some stories to have different structure, e.g. settlement deliberately cuts down to the absolute minimum primitives as the four elements, theology deliberately has lots of primitives for each new set of findings that have been discovered through the centuries. But figure out what kind of story you're telling: if you're telling a story about building things out of limited primitives, then cookbook and settlement are good models.

Number of items at start: a max of 10 is pretty high, and shouldn't go higher. 4-8 is a sweet spot.

The analyzer's six-line summary and comparison table use these conventions:

1. **Items:** count each different item once. Primitives are supplied ready-made; the others are made through combinations. Adding a component to an existing object does not create another item to count.
2. **Combinations:** include both making new items and adding components to existing objects. The completion count is the number used by the debugger to finish the story.
3. **Chapters:** include every chapter, including the ending.
4. **Chain length:** for each item, find the longest sequence of combinations leading to it, then take the average and maximum across all items. Items requiring no combinations count as zero. Count one chain per item; chains can share earlier steps. Consider the assembled forms that the story asks for.
5. **Chains across chapters:** count items whose history of successive combinations includes work in more than one chapter during the debugger’s playthrough. Count each item once, using its final assembled form.
6. **Items at chapter starts:** count the items on the board when the debugger opens each chapter, including the ending. An assembled object counts as one item. Items left on earlier boards and the landscape itself are excluded. If the debugger skips a requested chapter, count the board it opens instead.

Averages are rounded to one decimal place. The table has one row per number, with secondary numbers indented. Analysis fails for a story if it cannot finish the story or a chain loops back on itself; table mode warns and skips that input under the [comparison rules](ux.md#story-analysis-comparisons).

`--json --details` adds individual items and checkpoints, including `checkpoints[].peakItems`: the largest current-board item count observed for that checkpoint's chapter along the debugger route. This helps identify intermediate clutter, but another legal route may reach a different peak. It does not change the starting-item measure or the six-line summary. Inspect geometry and readability in the browser as well as counts.

The analyzer requires explicit file paths, absolute or relative to the current directory. It recognizes stories by parsed content under the [input rules](ux.md#story-analysis-comparisons), regardless of filename or extension. One input prints exactly six plain-text lines. Generate comparisons from current manuscripts; do not treat a copied table from an earlier draft as current evidence:

```sh
npm run analyze -- --table stories/cookbook/cookbook.md stories/settlement/settlement.md
npm run analyze -- --table stories/*/*.md
npm run analyze -- --table stories/*/*.md projects/example-study/draft.md
npm run analyze -- --table stories/*/*.md --output runs/story-comparison.md
```

`--table` prints a whitespace-aligned Markdown table with stories as columns, using the [column naming and input-skipping rules](ux.md#story-analysis-comparisons). Supply each input as a positional filename, including project drafts. Shell globs can include unrelated documents or invalid inputs: warnings identify files skipped based on their content or loading/analysis failures. Without `--output` the result is printed; with it, the result is saved after processing the inputs, provided at least one story succeeds. The destination's parent directory must already exist, and the command refuses to overwrite any input file, including skipped ones. `--help` lists the options.

`--json` provides machine-readable output; add `--details` for the individual items and checkpoints described above. JSON schema version 2 includes manuscript hashes. Keep detailed exports in ignored `runs/` space and discard them after recording useful conclusions, except for explicitly requested retained deliverables under the [verification policy](engineering.md#verification-records).

## Revise with evidence

Run the shared [checks and preview](#check-and-preview-a-draft), analyze the structure when relevant, and inspect the working sets and explanations in the browser. State what a change should improve, then use the [playtesting tools](fun-and-evaluation.md#logical-playtesting) under the [evaluation method](fun-and-evaluation.md#a-closed-loop-that-can-change-its-mind). Keep an observed success and its limitations together; a simulated report cannot overrule the user's enjoyment.

Here's a process for evaluating the report.md that came from playtesting:
1. Look for say bottom half of chapters in terms of their % worthwhile. And look for chapters in which the hook rating is entirely medium or lower, i.e. where no one reported a high hook. Together these will give us a shortlist of which chapters to focus on (it's a shortlist, not a verdict). I think that % fun is hard to use as a criterion. Note that a high hook shouldn't protect a chapter from scrutiny: players can remain eager about discovery while finding the intervening work tedious, and we still want to address that.
2. Look for themes about "Strongest moments" so we know what kind of combinations to copy
3. Look at all "Weakest moments", see if we can identify themes
4. Then we'll look at our chapter shortlists. Low "hook" ratings should prompt us to look at the emotional weight of the story arc around this chapter. Low "% worthwhile" should prompt us to look at the combinations available in the chapter. Any combinations that match the common "weakest moments" themes are particularly ripe for rework.

You should write down in a study-specific working-notes.md file, e.g. projects/example-study/working-notes.md, the actions you propose to take -- presumably things like how you'd restructure combinations/items within existing chapters, or even how you'd re-organize story arcs or chapter texts.

After a substantial multi-chapter playtest, include a chapter-by-chapter score table in those working notes. Use a fenced text block with space-padded columns so the table lines up in plain ASCII. List every tested chapter by number and title, with its Fun and Worthwhile scores. Follow the evaluation guide's [score definitions](fun-and-evaluation.md#chapter-synthesis): display the mean credited/mean total counts, rounding each to one decimal place and omitting a trailing `.0` (for example, `1.3/5`). Identify the story version, playstyle and linked report. For `--fast`, write `not measured` for Fun; keep missing or incomplete evidence explicit.

After revising and completing focused retests, add a second table restricted to those chapters, with Before and After columns for both Fun and Worthwhile. Identify the report and manuscript version supplying each side, including separate retest rounds where needed. Use verified counts without pooling different revisions or modes, and explain what the players' choices and reactions say about the intended fix. A score increase alone does not establish improvement; accepting a sensible route can remove frustrating decisions and lower the Fun count while improving the passage.


Review the concrete manuscript rather than treating an outline or target recipe count as evidence of quality. Check motivation and pacing separately from factual plausibility. Propose replacements for weak passages; neither cutting everything nor adding more steps necessarily improves the story. Use the [independent-review and blind-reading procedures](fun-and-evaluation.md#reviewer-independence) for narrative, continuity and authenticity reviews, and for predictions of combinations or story beats.

Sources: archived [human design decisions](<../archive/2026.10.30 initial experiments/DESIGN_PRINCIPLES.md>), [design contract](<../archive/2026.10.30 initial experiments/docs/design-contract.md>), [late manuscript decisions](<../archive/2026.10.30 initial experiments/notes.md>), [observation simplification](<../archive/2026.10.30 initial experiments/docs/mars-observation-streamline.md>), and [fun theory revision 9](<../archive/2026.10.30 initial experiments/docs/what-is-fun.md>). The [salvage index](../archive/salvage-index.md) records superseded historical directions.
