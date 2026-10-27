# Elements beyond the doorstep — bounded logical continuation

## Useful result first

A runnable **model-only continuation** adds 26 outputs and 33 binary recipe alternatives, extending four chapters to seven. Boats now support a houseboat, fishing craft and a river picnic; a home supports a pottery workshop, swing, library and observatory. Old food, cloth, fiber, bowls, glass and charcoal acquire further uses. No live site or source checkout was edited.

It is a useful content slice, **not a 200-decision game**. The exact minimum from the existing authored complete checkpoint is **8 additional successful creations**. Keep that route. It proves these three invitations are shallow; it does not prove a substantially richer single-world arc cannot work. Comfortable, clear crafting is legitimate progress: an action need not present a strategic dilemma to be worthwhile.

## Evidence and scope

- Frozen base: checkout HEAD `35c2a92aae6fbdecda960e22846aeb866fe84532`, model SHA256 `5bc750c4f41955293a8b05e998e582ce53bbdd50542370fef7b2aa2049ee4cfd`.
- Exact tested source: `freeze/candidate-v3.ts`, SHA256 `2e1b931f5abe7d25236677a645fc4f6b8a41126d6e732f2dd47a8fe34d60f504`. Byte-identical to candidate `src/elements-discovery-model.ts`; frozen before tests. V1 retained; V1 was never tested.
- 74 total recipes, 67 distinct discoverable outputs, 71 total concepts (including four starting elements).
- 1,000 seeded full-discovery logical runs: all outputs reachable, no required undiscovered recipe operand retired, no input depletion, all chapters completable, final active count zero. **Observed** peak active 39; this is not a proven global upper bound. Full traces are retained in `results/shuffled-orders.json`.
- Shortest-route active count: 24 at the old completion checkpoint; peak 29. Canonical count ends at 34; hidden things remain canonical and score goals.
- Focused three model tests and isolated model TypeScript check passed. No controller integration, browser, mobile geometry, saved-live-state migration, blind trial or human enjoyment test was run.
- Minimum route is exact for successful creations from the specified 22-creation checkpoint: enumerate all nondominated prerequisite sets for each qualifying capability pair, union across all three goals, then legally replay the smallest. 1,584 nondominated full routes remain. No transitions, movement, failure attempts or elapsed time counted. This is **not** a claim of minimum play from four elements or from the user's unknown actual save.

## Three compared arcs

1. **Shared home and riverside — chosen bounded slice.** Reuses most of the user's achievements, offers gardening, making, play, books and music. Risk: terminal decorations and short badge-like goals rather than a sustained story.
2. **River expedition.** Boat genuinely matters; shore context could make navigation, fishing, beacons and field observation coherent. Rejected version manufactures geography (`boat + water → marsh`) or makes travel arbitrarily grant supplies. A shore should be a naturally encountered place, not a recipe output or a checklist lock.
3. **Changing seasons.** Cellar preservation, textiles, insulation and growing under glass could form a substantial alternative arc. Risk: stocks, maintenance and mandatory winter-preparation checklists. No depletion or survival accounting should be introduced to make it longer.

These are alternative experiments, not a decision to split everything into tiny scenarios. A richer continuous world remains a serious candidate.

## Candidate invitations and shortest authored continuation

- **Make a day of it:** choose two of room to stay, an outing, or a useful boat. Minimum: House + Raft → Houseboat; Rope + Thread → Net; Net + Raft → Fishing raft. A sailboat also works with the net and house. An existing Picnic basket already counts as an outing; River picnic is optional, not a forced upgrade.
- **A place that grows with us:** choose two of growing, making or play. Minimum from the checkpoint: Fruit + Earth → Orchard; House + Rope → Swing. Existing Greenhouse counts as growing. Pottery workshop and kite are alternatives.
- **Something to pass on:** choose two of pictures/books, music or a place to learn. Minimum: Fiber + Water → Paper; Paper + Thread → Book; Wood + Air → Flute. Drawing, drum, library and observatory offer other approaches.

All recipes are available when their ingredients exist. Chapters do not lock them. Existing achievements are not invalidated or required to be newly made. The original optional warm-cellar fermentation remains the only catalyst; no catalyst was added just to add gestures. Places beyond the cellar are a next design task, not falsely claimed in this model.

## Rejections and unresolved weaknesses

Preserved V1 used Wood + Water → Paper, Paper + Cloth → Book and House + Cloth → Curtains. V2 uses more legible Fiber + Water, Paper + Thread and Window + Cloth. V1's Basket + Wood → Cart and Cart + Plant → Garden cart were rejected: absent wheel mechanism, then a weak badge upgrade. V2 substitutes independent optional embroidery and hourglass.

Glass + Cloth → Stained glass and Window + Drawing → Painted window were rejected before testing: coloration mechanism is not justified. Their records are retained in candidate-recipes.json. The V3 checkpoint test initially failed because it selected the first recipe producing Swing, which became the new Orchard alternative; the old checkpoint has no Orchard. The test now explicitly selects the still-valid House alternative. This was a fixture-selection bug, not a model change; raw failure is retained in results/v3-fixture-failure.txt.

Remaining candidates needing player intuition evidence: Glass + Water → Lens, Lens + Wood → Telescope, Wood + Air → Flute, Paper + Rope → Kite and House + Raft → Houseboat compress real construction. This follows the existing storybook style, not chemistry or manufacturing realism, but source-aware approval cannot establish that players will infer them. A fishing boat is recognizable yet currently terminal, so it promises more activity than the model delivers. A pottery workshop has no additional production mechanics; it is currently a crafted destination, not a functional crafting station. Do not describe either as a deep system.

## Next experiment that could address the actual duration target

Build a **larger single-world candidate first**, with the riverside as an encountered context and approximately 12 purposeful invitations beyond settlement, not 12 arbitrary collect-N lists. Compare it to a distinct seasonal scenario only after the larger world's length and workspace are measured. Candidate material families:

- **Make the shore welcoming and navigable:** landing/dock structures, nets and alternate fishing craft, a shore beacon/lighthouse, signs/maps, shelter and portable meals. Reuse existing raft/sailboat, lantern, cloth, rope, house and shared food. Keep short food and boat alternatives.
- **Build places to make things:** recognizable stone/wood tools and ore/metal processing, workbench, pottery/weaving/woodworking branches. Require a tool only where its action actually distinguishes the output, not as a generic universal key. Existing direct recipes keep working.
- **Carry stories and signals farther:** paper, charcoal/ink, bound books, printing, bells and flags, map-making and instruments. Existing book/library route stays valid for a library; a press must serve a different invitation, not retroactively complicate books.
- **Observe and understand this place:** simple optics, rain/sun/time instruments, star observation and a record. Retain the simple telescope shortcut. Larger assemblies should be recognizable useful outcomes, not “research level 2” badges.
- **Make a place people return to:** cultivated growing, paths/seats/shade, communal cooking, music and performances. No dish list, attendance counter or harvest replenishment. Shared food already made must count.
- **Respond to one changing condition:** choose a naturally meaningful problem such as a flooded crossing or a dark shoreline. Accept bridge/ferry or beacon/sheltered route alternatives; never delete the old solution to demand an upgrade.

Before a trial, author the complete graph and freeze it; calculate exact or explicitly bounded shortest goal routes, optional ontology size and cumulative active-item counts. Target **roughly 80–130 successful creations on a purposeful full authored route and 120–180 reachable outputs** as a testable design hypothesis, not as measured duration or a requirement to inflate recipes. Alternate approaches may be substantially shorter. If the graph reaches those numbers only through contrived steps, reject the numbers rather than the shortcuts.

Then run genuinely fresh source-blind play on that exact freeze. Count attempted combinations, successful discoveries, productive optional exploration, repeats, movement/admin, hints, progress and voluntary stopping separately. Observe whether comfortable self-directed play actually approaches ~200 decisions; do not count 100 decorative failed guesses as success. Ask whether players want to continue, not whether they can endure the recipe total. Compare the continuous-world and seasonal variants on the same measures; neither is preselected as the answer.

Workspace acceptance: target observed active peak 30–40 without manual curation; stress delay optional branches deliberately as well as shuffled discovery. Retirement remains conservative and derived. If future branches keep too much live, structure the world into naturally encountered work places with local relevance, but keep known objects accessible without inventory gardening and never silently remove a possible recipe. Geometry and real mobile play must be retested, since a logical peak of 39 says nothing about scroll comfort.

## Publication boundary

Research artifact only. Publisher may commit this directory's source, tests, freeze and evidence under a research/experiment path in the authorized private repository. **Do not replace the live model or deploy this as a 200-decision completion.** No external writes or public publication were performed by this task.

## V3 response to independent review

The independent review targets frozen V2 and remains unchanged. V3 adds Feast/Fruit tart + either boat as four legitimate River picnic alternatives, plus Orchard + Rope → Swing while preserving House + Rope. Thus the user's existing shared foods have a direct continuation and Orchard becomes reusable; no shortcut is removed. Of the 26 new outputs, 20 remain terminal, so the deeper-ontology criticism still stands. V2 traces and metrics are retained under results/v2; V3 is the final tested candidate. Additional alternatives increase the observed shuffled peak from 36 to 39. The first V3 fixture failure and subsequent corrected test are both retained; the model stayed frozen. These modest fixes do not make the three invitation forms less repetitive or establish enjoyment.
