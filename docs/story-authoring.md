# Writing a combination story

This is the guide to designing, writing and revising stories. The [format specification](story-format-spec.md) defines syntax and game semantics; the [README](../README.md) covers file layout, tools and playtesting. These are authoring aims, not claims that every current manuscript already meets them.

## Make combining worthwhile

The player chooses and combines the things themselves. Give each operation a recognizable purpose, contribution and result. Keep the interaction predictable within the format's small grammar; if a passage appears to need several outputs at once, rethink its combinations.

Learning, comfortable construction, curiosity, beauty, conceptual resonance and a satisfying ending can all reward play. A plan may span several combinations, and straightforward enactment after an insight can be enjoyable. Keep clever short solutions. Do not manufacture a dilemma for every gesture, pad recipe counts or require every optional branch. Revise or discard an idea that does not further combination, enjoyable play and empirical learning. The [fun and evaluation guide](fun-and-evaluation.md) explains the working theory and how to test it.

## Make the action understandable

Mark one immediately usable opening recipe as the tutorial, following the [format and lint rules](story-format-spec.md). Choose a clear example of combining, with the item to drag written first and its receiving target second. The demonstration reveals the gesture and ingredients, while the result remains a discovery. See [contextual tutorials](ux.md#contextual-tutorials) for when the cues appear and disappear.

Assume chapter prose and primitive explanations may be skipped. Necessary premises belong in the visible task, item name, component or observed result. Review a combination forwards: why would these two things suggest trying this operation, and what does each contribute? Reject an input that already states the complete output unless the operation adds a meaningful change. A longer explanation cannot repair a missing ingredient, premise or purpose.

Use simple names and direct English. A quotation can be the item itself; do not compress an important 5–12 word claim into an obscure icon or slogan. A stronger tool should retain its applicable uses through explicitly authored alternative recipes. Do not grant capabilities just because an unrelated component is somewhere inside a construction.

Names, artwork, physical access, supplies and task must agree. A whole greenhouse is not a portable tool. A photo, map or observation must answer a real story question. Avoid calibration, labelling and paperwork steps that merely lengthen a route. Keep crafting meaningful: an optional earlier construction should not arrive ready-made later if the player skipped making it.

Primitive icons can begin at an authored point in the landscape: a water supply in a river, for example, or fire beside a shelter. Leave room above each icon for its name. Use the starting-position syntax and restrictions in the [specification](story-format-spec.md); ordinary created items appear where the player combines their ingredients.

Compose hotspots together with their backgrounds, following the [scene integration rule](ux.md#item-artwork). Use existing landscape features where suitable; architecture should meet the ground and surrounding walls naturally. A fully transparent hotspot icon can define a hit area over a feature painted into the background. In author comments, record its centre, display dimensions and the physical feature it covers. Check every appearance, including repeated locations, at phone size; retain enough blank space for arranging items and avoid painting future constructions before the player makes them.

Use a hotspot's `place:` entries when an item should settle at a particular point in the scenery: a tower on a cape, a beacon on a mast, or a cooked result inside an oven. List the receiving ingredient as well as the result when both should share a destination. The [specification](story-format-spec.md) defines centre coordinates, containment lint and occupied-space fallback. Choose a centre inside the hotspot's circular or rectangular hit area and leave room for the whole item and its name; placement does not introduce a supply or require a goal.

## Give chapters a purpose and a manageable working set

Chapters should usually have a particular place, time or speaker. A new table need not require a new city or invented date. Prefer “How does evil exist?” to routine first-person intentions such as “I need to know how evil exists.” Historical scenes can introduce a speaker with `![portrait](...) *Person, Place, Year*` in the chapter text.

State the next purpose or new information without retelling what play has shown. “Time to collect a core from this basin, and record its findings against the terrain” needs no recap of how the survey brought the player there. Bring the earlier Terrain model into the actual combination.

Use chapters to focus a smaller task as well as to change locations or introduce hotspots. Prefer roughly 2–5 things for difficult abstract reasoning and up to about 9 for familiar physical scenes. These are aims, not hard limits; keep worthwhile alternatives and review both arrival and peak clutter in the browser. A next-morning visit can explain a refreshed surface in the same location. Match the stated time and indoor/outdoor setting to the artwork.

Give every identity an explicit declaration under the [specification's declaration rules](story-format-spec.md#specification); a goal or recipe name alone is insufficient. Keep derived declarations near their producing recipes or explanations, and primitive Items entries in the chapters that should supply them. Derived entries describe objects without bringing in their ingredients or preventing cleanup. Goals still pull their dependencies into the chapter, including through global recipes; review future-supply warnings in that light. A return visit is a new story beat: give it a purpose and choose what matters now. The [opportunity lint](story-format-spec.md#opportunities-for-authored-content) checks optional constructions after goal-only play of preceding chapters, pessimistically treating possible earlier retirement as actual retirement. An opportunity dependent on a particular earlier leftover may therefore trigger a warning. A verification limit requires analysis of the checker’s growth, not an editorial claim that the content is impossible.

## Write purposeful goals and continuity

Prefer no more than two active goals at a time. Use `next:` chains to stage required preparations, while allowing early discovery. If two preparations must precede a third, put them in a single “both/and” goal followed by the next goal. Phrase the task so it stays understandable as its conditions are completed.

When three independent goals are clearer together, explain the specific reason in the Goals section using the [specification's exact acknowledgment syntax](story-format-spec.md). The editor's suppression action inserts the template and selects the reason to replace. Explain the scene's relationship, reuse or comparison; do not merely say that the warning is acceptable. Four visible chains require restructuring, and an obsolete acknowledgment should be removed when the count falls.

Accept alternative results when either serves the purpose. “Cook a cauliflower dish” can accept Cauliflower gratin or Buttered cauliflower; the player need not make both. Require both only when both matter: plain Puff pastry for later almond pastries and Cheese straws for the current meal, for example. Give optional products a useful choice, discovery or later use. Cut purposeless branches instead of inventing goals solely to retain them.

Later chapters should make useful earlier creations matter. Carrying an unused token or raw supply is not continuity. Reuse can cross a gap and should change what the player can do or understand. Accept plausible tools and preparation orders through explicit alternatives.

Keep shortcuts legitimate. Put essential continuity in `[If skipped]` text when a chapter's work might already be complete. A final text-only chapter can give the story a satisfying conclusion without adding chores.

## Choose fates and constructions that fit the action

Apply the specification's infinite-resource model through believable visibility and placement choices. Cooking dough into pastry or preparing a cauliflower dish suggests `[transform]`; using water, fire or a tool often suggests leaving it visible. Avoid turning these hints into stock accounting, replenishment chores, production rates or an action-credit economy.

Make the reason for retaining a shared ingredient visible through meaningful goals. In the pastry example, another required preparation protects the ingredient it still needs. Do not change a fitting transformation to preservation merely to keep an incidental recipe available. Use the specification's default and single-use annotation rules when writing the actual reagents.

Review mixed-fate warnings in context. Keeping a tool visible after using it and hiding its outside copy after fitting it into a construction can both make sense. Explain the changed role through the action. The warning is an invitation to review the presentation, not to preserve everything.

Use a named compound and slots when independently fitted parts should remain legible. Use a transformation when a genuine change of identity should wrap up those internal details. Existing parts satisfy their owner's slot requirements; they do not imply independently usable outside tools. Use exclusivity to express meaningful alternative histories, with consequences the player can understand before choosing.

## Review warnings against played behavior

Check undeclared names for spelling mistakes before adding new declarations. Review unused-declaration warnings for abandoned content or accidental alternate spellings; an intentionally supplied worldbuilding item can remain. Terminal recipe results already count as referenced, so they need no invented follow-on recipe or goal to silence this check. The [lint catalogue](story-format-spec.md#lint-rules) owns the exact reference and severity rules.

Three-goal and mixed-fate warnings are invitations to inspect the player experience, not a target of zero warnings. Use `next:` when sequential disclosure helps; every stage still remains required. Independent goals may be clearer when shown together, subject to the [count limit and acknowledgment rules](story-format-spec.md#lint-rules).

Fate annotations are visibility/placement hints, and future-use protection can retain an input despite a hiding hint. Compare what a player actually sees across earlier and later uses before normalizing annotations. A consistent authored fate can still produce different visible behavior; preserving an old object beside its upgraded replacement can also blur identity. Keep tool reuse, material incorporation and genuine state changes legible. Test a concrete alternative and retain negative results rather than equating fewer warnings with more fun.

## Write wonders and attribution

Explain a useful distinction or what the result makes possible, and why it matters. Do not write operating instructions, an upcoming recipe list, an unearned capability claim or cryptic teasing prose. The [UX guide](ux.md) owns how these cards are presented.

Frequency depends on the story. Abstract Ideas and Theology advances often need immediate explanation, and most items in a small abstract scene may merit wonders. Theology's confusing intermediate arguments intentionally retain their explanations even when a later result revisits the topic. Familiar preparations such as Salt-preserved fish need not get a popup. Reserve them for what matters to the story or needs explanation about further uses; neither a fixed quota nor old reader-only status decides quality.

Treat primitive explanations as optional reading, not invented discovery awards. Use slot-qualified wonders to celebrate a completed construction rather than its bare shell. In complex multi-voice narratives, the current speaker's item can be “Foo” and become “Previous speaker: Foo” in later chapters through an authored rename. This keeps ownership clear while the explanation remains a stable record.

## Keep intellectual and factual claims honest

Distinguish physical transformation, historical transmission, analogy, interpretation, criticism and deduction. A historical or artistic synthesis need not be a logically forced theorem. A new name alone is not a new intellectual achievement, either.

Do not make intellectual history an inevitable ladder toward the latest speaker. Religious and natural explanations can coexist. Attribute doctrinal claims to particular texts and traditions; completing their combination reconstructs a position, not a proof of religious truth. Keep genuine quotations accurate. Put source references and factual qualifications in `> NOTE:` author comments when they do not belong in gameplay.

Review factual authenticity separately from forward player intuition. A defensible retrospective explanation does not make a contrived combination understandable. Use the [completed authenticity record](<../archive/2026.10.30 authenticity improvements/authenticity-improvements-2026-10-30.md>) for historical findings, decisions and evidence, and the [editorial backlog](../projects/backlog.md) for new work, current story directions and future ideas.

## Revise with evidence

Run the linter and inspect the working sets and explanations in the browser. State what a change should improve, then use the [playtesting tools](../README.md#logical-playtesting) under the [evaluation method](fun-and-evaluation.md#a-closed-loop-that-can-change-its-mind). Keep an observed success and its limitations together; a simulated report cannot overrule the user's enjoyment.

Sources: archived [human design decisions](../archive/legacy-2026-10-30/DESIGN_PRINCIPLES.md), [design contract](../archive/legacy-2026-10-30/docs/design-contract.md), [late manuscript decisions](../archive/legacy-2026-10-30/notes.md), [observation simplification](../archive/legacy-2026-10-30/docs/mars-observation-streamline.md), and [fun theory revision 9](../archive/legacy-2026-10-30/docs/what-is-fun.md). The [salvage index](../archive/salvage-index.md) records superseded historical directions.
