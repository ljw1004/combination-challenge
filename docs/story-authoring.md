# Writing a combination story

This is the guide to designing, writing and revising stories. Start from the [game's philosophy](../README.md#philosophy): enjoyable making and discovery should leave players with understanding worth carrying beyond the game. The [format specification](story-format-spec.md) defines syntax and game semantics; the [README](../README.md) covers file layout and tools; [fun and evaluation](fun-and-evaluation.md) owns review and playtesting methods. These are authoring aims, not claims that every current manuscript already meets them.

Before revising a story, read its companion `design-brief.md` when present. It owns the story’s lasting purpose, voice, pacing and visual direction; update it when that intent changes. Keep experiments and dated construction history in the project, and shared interface rules in UX. The [repository layout](../README.md#story-layout) reserves the brief filename outside manuscript discovery.

## Choose a premise that works through combination

Find the essential act of combining before committing to a setting. Cooking naturally joins ingredients into something satisfying; settlement-building can grow from a few raw materials; intellectual history can join inherited ideas with a new experience or argument. Other forms are welcome, but the premise must make the player's repeated act worthwhile.

Choose who the player is and what that role makes possible. Settlement casts the player as a pioneer building from raw materials; Cookbook can make combining an active recipe notation; Ideas and Theology put the player in successive thinkers' positions. A story may follow one continuous thread or interleave threads that later meet. Treat the structure as a design choice to test against clarity and momentum.

The framework supports manipulating objects and reconstructing ideas. It has no reciprocal social interaction: treating a person or animal as a thing to drag and combine can make a relationship uncanny. It also abstracts supplies rather than counting scarce units to allocate. Build the interest around choosing, learning and discovering what belongs together.

Satisfying construction and curiosity about the unfolding story are two useful hooks. Both need substantial content; neither implies that every step needs a surprise. The [analysis guidance](#analyze-combination-structure) helps inspect the shape and scale of that content without turning counts into a quality score.

## Develop a story

1. Establish the setting, player role and purpose with the user.
2. Explore the combination idea and narrative arc together. Challenge the hook, motivation, authenticity and overall experience through the [independent-review process](fun-and-evaluation.md#reviewer-independence), then revise.
3. Draft actual combinations and a playable manuscript. Track what each object physically represents in author comments where helpful, and examine its contribution and downstream continuity. Use [blind combination and story-beat readings](fun-and-evaluation.md#blind-combination-and-story-beat-readings) for local questions and [chapter playtests](fun-and-evaluation.md#chapter-fun-playtests) for passages of play.
4. Seek user evaluation of the playable result. Passing checks and positive agent reports do not establish that it works for its intended player.
5. Explore an art direction with representative items and contrasting contact sheets or playable studies, following the [icon guide](icon-guide.md). Produce the full set once the direction and story justify it.
6. Recheck physical continuity as objects become visible. Draw useful combination chains and review their form, scale and transformation; artwork can expose a change of identity that prose concealed.
7. Continue playtesting and revision across story, artwork and interaction. A finished draft or artwork pass is an intermediate milestone.

Keep the active project's drafts, research, hypotheses and retained design deliverables together until the overall development effort is complete. Follow the [project lifecycle](../AGENTS.md#directory-hygiene) and [verification retention policy](engineering.md#verification-records); those documents own where working material and concise outcomes belong.

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

Elapsed duration is a combination-game abstraction: use sensible time cues where they help, without adding waiting steps or rejecting worthwhile combinations merely because their real processes take different lengths of time.

Keep separate specimens as separate things. Studying two objects does not require combining them into a comparison unit; use a goal to study one and a `next:` goal to study the other. A physical container or working assembly can be a real construction, but merely comparing observations does not create an object. In a discovery story, each scientific operation should reveal something that changes the question or the next action; routine controls and repeated assays need not become compulsory gameplay.

A hotspot is an ordinary item annotated as fixed for a chapter. Declare its identity separately in Items; put starting primitives in the chapter that introduces them. A constructed fixed item appears only after it is made. For a later appearance, establish its creation through earlier goals and list the same surviving identity under Hotspots again. Keep its appearance recognizably the same equipment or working surface. The [specification](story-format-spec.md#specification) owns availability, conditional `@` rules, fixed retirement and carry restrictions. Do not rely on optional earlier work or a special action order to make fixed scenery behave correctly.

Use simple names and direct English. A quotation can be the item itself; do not compress an important 5–12 word claim into an obscure icon or slogan. A stronger tool should retain its applicable uses through explicitly authored alternative recipes. Do not grant capabilities just because an unrelated component is somewhere inside a construction.

Name what the player handles. In concrete stories, prefer physical nouns such as **Steel sheets and bars** or **Gas cylinders** to purpose-based abstractions such as **Structural stock** or **Gas receiver stock**. A useful condition can qualify that concrete object.

When an item is visibly unfinished, name the condition that suggests its next useful operation: `Unfiltered yoghurt + Filter -> Yoghurt`, or `Drinking water supply + Unwatered growing beds -> Irrigated growing beds`. Prefer a concrete need such as raw, dusty, empty or uninsulated over a label that merely records the previous step. Remove the qualifying adjective when the need is resolved, unless the resulting state matters later. Use this where it clarifies the object; do not invent deficiencies, add steps or reveal a discovery just to make every name instructional.

Names, artwork, physical access, supplies and task must agree. A whole greenhouse is not a portable tool. A photo, map or observation must answer a real story question. Avoid calibration, labelling and paperwork steps that merely lengthen a route. Keep crafting meaningful: an optional earlier construction should not arrive ready-made later if the player skipped making it.

Visual form tests a physical combination. Check whether the objects' shape, scale, perspective and relationship support the action; revise an ambition that cannot be represented convincingly. Preserve natural silhouettes and aspect ratios, and use proportional sizes with readable lower and usable upper bounds when physical size matters. Follow the [icon guide](icon-guide.md) for production. Text items or simple placeholders suffice during story exploration, and finished artwork must not prevent removing weak compositions.

Primitive icons can begin at an authored point in the landscape: a water supply in a river, for example, or fire beside a shelter. Leave room above each icon for its name. Use the starting-position syntax and restrictions in the [specification](story-format-spec.md); ordinary created items appear where the player combines their ingredients.

Compose hotspots together with their backgrounds, following the [scene composition guidance](icon-guide.md#8-expand-through-related-families). Use existing landscape features where suitable; architecture should meet the ground and surrounding walls naturally. A fully transparent hotspot icon can define a hit area over a feature painted into the background. In author comments, record its centre, display dimensions and the physical feature it covers. Check every appearance, including repeated locations, at phone size; retain enough blank space for arranging items and avoid painting future constructions before the player makes them.

Use a hotspot's `place:` entries when an item should settle at a particular point in the scenery: a tower on a cape, a beacon on a mast, or a cooked result inside an oven. List the receiving ingredient as well as the result when both should share a destination. The [specification](story-format-spec.md) defines centre coordinates, containment lint and occupied-space fallback. Choose a centre inside the hotspot's circular or rectangular hit area and leave room for the whole item and its name; placement does not introduce a supply or require a goal.

## Give chapters a purpose and a manageable working set

Chapters should usually have a particular place, time or speaker. A new table need not require a new city or invented date. Prefer “How does evil exist?” to routine first-person intentions such as “I need to know how evil exists.” For a new historical perspective, begin the authored opening with an italic `*Person, Place, Year*` line after any background image. Briefly introduce who the person is and their relevant situation, then establish the question that draws them forward. Subsequent chapters from the same perspective retain the orientation but continue the thought without repeating the biography. Use approximate dates or explicit uncertainty instead of invented precision. The chapter heading is not automatically repeated in the opening popup; author the orientation in the prose itself.

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

## Check and preview a draft

Use the shared tools for published stories and project drafts alike:

```sh
npm run lint -- path/to/story.md --details
npm run analyze -- path/to/story.md
npm run analyze -- path/to/story.md --json --details
npm run dev
```

Lint checks the manuscript against the specification; errors need correction and warnings need author review. Analysis produces a legal debugger route and the structural measures below. Inspect the draft through the normal Vite player and its [debug pane](../README.md#edit-a-story-live). For example, open `/combinations.html?story=projects/example-study/draft.md` for a draft saved at that repository-relative path. The `story=` value is a Markdown URL resolved relative to `combinations.html`; there is no implicit `stories/` prefix. Artwork paths resolve relative to the manuscript. The [README](../README.md#run-the-game) owns the complete routing and setup instructions.

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
