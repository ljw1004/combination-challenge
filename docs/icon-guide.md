# Developing story icons

Develop an icon set by defining what its pictures must communicate, researching a suitable visual language, testing a representative sample, and revising it before expanding to the whole story. Review recognition, art direction and playable behavior separately: each can expose a different reason to change the work.

This guide owns the art-development workflow. Use [UX](ux.md#item-artwork) for current presentation and interaction decisions, the [specification](story-format-spec.md) for artwork metadata and completeness requirements, and [fun and evaluation](fun-and-evaluation.md) for experience claims. Choose the medium, palette, sample size and production technique for the story; the examples below illustrate the method rather than prescribe one visual identity.

## 1. Establish the brief

For a catalogue identity, choose one subject or composition that carries the whole story. An ordinary image in the manuscript heading supplies it; [UX](ux.md#catalogue-and-story-identity) owns its display treatment and the [specification](story-format-spec.md#specification) owns validation. Review it at the actual catalogue size, with the title, on both light and dark surfaces, and in the shared [home-screen presentation](ux.md#home-screen-apps). Transparent PNG keeps an isolated silhouette; an opaque square lets a scene or coloured ground extend to every edge. Check how the composition reads inside the platform's mask, especially whether a circular scene acquires an unwanted second frame. Keep native-device observations separate from simulated masks. A 256 × 256 runtime export is useful, while the selected larger master remains available for future uses. Broad forms and strong light/dark relationships matter more than small decorative details. This identity need not use the same medium as every in-game illustration.

Describe the story's setting, tone, objects and intended audience. Decide what the artwork should contribute: immediate recognition, a particular atmosphere, pleasure in discovering objects, visible construction, or clearer preparation states. Name the specific appearances to pursue or avoid and explain why they suit this story.

Define the recognition task as well. Does the player need to distinguish an object family, its material, its contents, or its stage of preparation? Identify the information normally available alongside the picture. If the aim is recognition as quick as text, plan a comparison with text that measures time and errors; an untimed guessing exercise answers a narrower question.

Settle enough of the brief to make a small experiment, while keeping unresolved choices explicit. A useful brief describes the desired result without prematurely committing to an art style or a production tool.

For example, Settlement called for humble working objects in a subsistence world and an earnest handmade appearance. Those requirements explain its rustic treatment. Another story may call for precision, exuberance, strangeness or a contemporary setting. “Rustic,” “uncute” and “woodcut” are choices for a particular story, not universal requirements for good icons.

## 2. Catalogue meanings and distinctions

Follow the [authoring iteration process](story-authoring.md#develop-a-story) and the story's active brief, including when production takes place in a study directory. The brief selects applicable [story techniques](story-authoring.md#reusable-story-techniques); this guide supplies their graphics methods. Carry changed requirements through the affected image family and its later uses before expanding production.

Read the manuscript before drawing. Build a visual catalogue that records each item's intended meaning, relevant chapter context, creating and using combinations, and nearby objects or states it must remain distinguishable from. Include supplied items, derived results and fitted appearances; include fixed locations when the story uses them.

Describe the subject physically. A name alone can conceal ambiguity or encourage the wrong picture.

Record whether the image represents a material supply, an individual portable object or an installed part of the scene. Under the [artwork presentation guidance](ux.md#item-artwork), a supply such as **Steel** can use a compact representative sample of recognizable metal stock; it need not depict the full quantity available or occupy the space of a literal pile. Use that distinction when choosing visual weight, while keeping the story's established style.

For constructed objects, apply [resource-limited construction](story-authoring.md#resource-limited-construction) where appropriate: trace visible parts and joints to actual materials, tools, working conditions and donor equipment. Check whether each construction earns its effort as well as whether it could be made. Simplify an elaborate shape instead of silently supplying casting, machining, welding or new materials. Inspect this again in the delivered image: a plausible written brief does not guarantee a plausible painted construction. Successive states must retain the parts already fitted and keep separate physical systems separate.

Useful entries explain both what should be visible and which misleading interpretation to avoid:

| Item | Useful depiction brief | Distinction to review |
|---|---|---|
| Earth | Loose, fine soil with small crumbs | Soil rather than a planet, fieldstone, sand or clay |
| Botanical drawing | A visible sheet carrying a drawn specimen and detail studies | A drawing rather than a detached real leaf |
| Filled reservoir | The same recognizable basin as the empty reservoir, with a visible water surface | Changed contents while retaining the object's identity |

Choose a few identifying structures that survive reduction. Use silhouette, visible contents, arrangement and texture where they convey a real distinction. Do not assume a change of vessel or colour alone communicates a different substance. A clear jug can still leave its contents unidentified.

The [Settlement visual catalogue](../archive/icon-generation/scripts/settlement-icons/catalogue.ts) illustrates this level of specificity. Its particular objects are examples; writing down intended distinctions applies to any story.

## 3. Research a visual language for this story

Treat the [existing reference collections](../references/icon-sets/) as a starting library. They are neither an exhaustive menu nor a requirement to reuse Settlement's styles. If the story's subject, tone or recognition problems call for a different treatment, research additional art styles before selecting one. An established direction can be reused when it already fits; research should resolve an actual uncertainty.

Look at concrete works and object depictions, including sources outside game icon packs. Follow promising directions into their actual visual vocabulary. A style name alone is too broad: inspect how examples use contours, shapes, colour, perspective, texture and empty space. Record the source and the qualities worth borrowing. Distinguish a reference for technique or atmosphere from an object depiction; for artwork intended to ship directly, retain its source and usage terms.

Write a short style guide covering:

- **Silhouette and detail:** identifying structures, simplification and treatment of small features.
- **Line and colour:** contour weight, palette, contrast and how materials differ.
- **Perspective and scale:** viewpoints and relative visual weight across the family.
- **Texture and finish:** mark-making, shading and the degree of regularity or wear.
- **Presentation:** grounds, framing, transparency and the relationship to the scene.

Keep the story’s lasting visual intent in its active `design-brief.md`; keep lasting research, concise comparison outcomes and selected production records in its project. Experimental images and comparison panels follow the [scratch-retention policy](engineering.md#verification-records).

Establish a size hierarchy before exporting, distinguishing symbolic supplies from literal objects. For literal objects, measure visible drawings rather than transparent padding, compare like vessels and tools across the collection, and check repeated components within different pictures. A correctly sized whole icon can still contain an oversized component. Treat fixed scenery and fitted compound parts according to their scene’s scale rather than the standalone-item minimum. Judge symbolic supply icons by recognition and space for play, without scaling them to the bulk quantity they represent.

Explain these choices with a few reference images. Inspect candidate treatments at the intended display size and against plausible backgrounds. A large illustration may depend on detail that disappears in play, or on paper and framing that do not translate into isolated objects.

Research and testing should inform each other. If a promising direction loses essential structure at small size, investigate a different simplification or another visual language. Once a pilot works, retain a small approved family of icons as production references alongside the original art references. Continue comparing new work with those anchors so that successive batches do not drift.

For example, a print treatment can be specified through the shape of ink masses and cuts, not merely the word “woodcut.” Settlement's [reference image](../references/icon-sets/woodcut-color/inspiration.png) and [generation requests](../archive/icon-generation/icon-study/prompts.json) illustrate the difference between naming a style and describing its visible properties. They do not make that style the default for another story.

## 4. Choose a representative pilot

Include a difficult complete sequence when the story depends on changing scenery, improvised construction or recurring objects. An attractive standalone icon does not validate its partial assemblies, later uses or a reverse view of its room. Establish those physical relationships before commissioning the whole family; use existing artwork and disposable composites where possible.

Select a small set that covers the story's range and its hardest distinctions. Include easy, familiar objects as anchors as well as likely failures. Choose related examples deliberately; a collection of unrelated, attractive objects can conceal problems that appear when similar items coexist.

| Include when relevant | What it tests | Example |
|---|---|---|
| Familiar objects with strong shapes | Basic legibility and stylistic appeal | Apples or a rolling pin |
| Similar materials or contents | Whether the intended substance is identifiable | Flour and sugar; salt and brine |
| Successive preparation states | Whether meaningful changes remain visible | Dough, laminated dough and puff pastry |
| Thin, intricate or unusual objects | Whether simplification preserves structure | Whisk, telescope or clockwork |
| Depictions or abstract forms | Whether the visual convention communicates the intended identity | Botanical drawing, air or smoke |
| Assemblies and their components | Whether the whole and its fitted parts stay legible | House and fittings; a loaded supper trolley |
| Fixed locations | Whether targets belong to the scene and can be found | Oven or service hatch |

There is no required number of icons, styles or review rounds. Twenty items in a five-by-four sheet is one manageable experiment, not a completeness criterion. Select enough examples to expose the story's risks, and expand the sample if review reveals a missing category.

When the art direction is undecided, compare promising styles using the same subjects and intended sizes. Give each an appropriate background while keeping the task and comparison conditions consistent. A short playable test should exercise representative combinations, placements or fittings as applicable, as well as displaying the art. Preserve the intended distinctions even if the pilot contains only a small part of the campaign.

## 5. Produce reviewable artwork

Choose a production method suited to the art: individual illustrations, related batches or an atlas. An atlas can help establish a family, but tight packing can contaminate crops and varied object shapes may need individual treatment. Use the pilot to test the method as well as the style.

For each generated request, provide the physical subjects and relevant story context, the style guide and reference images, the required layout and transparency, and any structures that must remain unchanged. For a revision, state the observed defect and what to preserve. Keep the exact request, its inputs and output version together under `runs/` during experimentation; promote selected production material under the [retention policy](engineering.md#verification-records). Equivalent briefs and source files serve the same purpose for drawn or edited artwork.

For mechanically connected constructions, a dimensioned 3D model can supply loose parts, intermediate assemblies, finished objects and later installations from one source. Give meshes explicit supply ownership and use strict state selectors that reject unknown identities. Preserve original dimensions when reusing a finished toy; a different camera is not permission to resize its components. Keep a fixed camera canvas for successive hotspot replacements and all fitted overlays so unchanged parts remain registered.

Review actual receiving geometry as well as the final pose: bores, seats, retained fasteners, a clear assembly/service path, cable approaches and stored slack, and the mechanism's operating range. A lead changing pose retains its length and its attachment point and direction in the plug's own frame. Correct endpoint equations do not establish that a pin enters its bore or that a cover can pass over a fitted shaft. Fresh reviewers should inspect evaluated meshes and useful views, identifying finite sampling, declared mass assumptions and untested material/force behavior. Then review the delivered illustrations separately at playing size: a truthful but invisible contact gap or wave does not teach its intended lesson. Choose a clearer real phase, view or material contrast before enlarging or inventing a physical feature. Retain the editable geometry and pose controls even when the release uses still images.

If producing an atlas, specify an unambiguous order, generous gutters and complete objects within their cells. Keep labels and grid lines out of production artwork. Record extraction bounds and output dimensions. Inspect the extracted files individually at playing size: a good source sheet does not guarantee good crops.

When later atlases replace earlier cells, select the winning source for each identity before exporting it. Constrain automatic crop detection to that cell; validate cached exports against the source content, crop geometry, processing version and output content. Assemble review sheets from the final selected exports only, so a stale cache or an earlier atlas cannot silently replace the repair being reviewed.

Apply precise mechanical requirements through deterministic processing where appropriate. Cropping, resizing, padding, registration and an exact backing opacity should be inspectable operations. Review generated edits as new artwork even when the request was merely to isolate a foreground; such an edit can alter details.

Follow the current [asset requirements](story-format-spec.md) for dimensions, transparency and overlays. Review at the resulting display size rather than treating a familiar source size as a universal standard. Avoid deciding the art's success from enlarged proofs alone.

For example, neighboring fragments in Cloth and Festival banner required a [separate repair generation](../archive/icon-generation/settlement-icons/generations/repairs.json). The general lesson is to inspect delivered crops; the repair need not always be another generation if the original art can be extracted cleanly.

## 6. Run separate recognition and art-direction reviews

Use a reviewer who did not make the artwork and follow [reviewer independence](fun-and-evaluation.md#reviewer-independence) for every assignment and revision. A fresh agent can provide an initial recognition check; a human trial is needed for claims about human recognition or preference. Give each reviewer a defined assignment and record what they have already seen.

### First interpretation

Show unnamed pictures at the intended display size without target names, revealing filenames, recipes or earlier answers. Keep the answer key separate. Ask for a best guess, confidence, plausible alternatives and the visible features supporting the guess. Request concrete uncertainty rather than a general approval of the set.

Choose presentation to match the question. Individual images test interpretation without neighboring clues. Unnamed sheets help compare a family but allow neighboring pictures to supply context. In-game views test the information available during play. Record the condition, and use neutral identifiers or a shuffled order rather than exposing the target list through numbering.

Decide acceptable matches before scoring. Allow semantic equivalents such as “soil” for “Earth,” but keep broad-family recognition separate from the exact material, contents or preparation state that play requires. Correctly identifying a bowl does not establish that it contains brine. A picture of a scientific record need not communicate its exact finding, provenance or causal conclusion; distinguish the visible physical object from meanings supplied by names and readings.

### Interpretation with context

For wrong or uncertain answers, provide the ordinary chapter context and ask again. During the temporary review, keep the original response and exact additional context separate. In the final outcome, distinguish unaided matches, matches recovered with context, and remaining failures; discard the raw answers afterward. Supplying the answer is not a context test.

For example, a picture of fruit beside a jug may communicate a fruit drink while leaving fermentation unclear. Context can help establish cider; that does not show the picture alone distinguishes cider from juice. The [blind](../archive/icon-generation/icon-study/reviews/round-1-blind.md) and [guided](../archive/icon-generation/icon-study/reviews/round-1-guided.md) reports demonstrate how to retain both readings.

### Art direction and family consistency

In a separate fresh assignment, compare the work with the visual brief and references. Ask about specific differences in silhouette, mark-making, colour, perspective, finish and scene fit. A style reviewer may know the intended objects; keep that informed critique separate from first-use recognition evidence.

Compare references and candidates at similar scales where possible. An enlarged reference can make its texture seem richer than a small icon. Check the family together for uneven detail, visual weight and departures from the chosen language.

A review record should identify the artwork version, exact input images and display conditions, reviewer and prior exposure, guesses or observations, and the resulting keep/change/reject decision. Keep negative answers alongside successes.

## 7. Diagnose, revise and review again

Translate feedback into a specific change. Different failures need different repairs:

| Observed problem | Useful response |
|---|---|
| Wrong physical object | Clarify the subject and its distinctive structure in the depiction brief. |
| Right object, unclear contents or state | Review it beside its closest alternatives; strengthen meaningful visible cues and test ordinary context. |
| Correct subject, unsuitable style | Compare actual shapes and marks with the references; revise the treatment while preserving identifying structures. |
| Cropped details or neighboring fragments | Correct extraction or regenerate the affected objects with more separation. |
| Clear standalone part, confusing assembly | Adjust fitted scale, placement or occlusion and inspect the composite. |
| Clear isolated icon, poor visibility in play | Inspect its relationship to the background, nearby items and interaction feedback. |

Identify the artwork version that received the feedback. Make a targeted revision, then review the corrected object, nearby confusable objects and any affected compositions at display size. Retain the earlier artwork when useful to the design study and summarize its failure in the final outcome; detailed review packets are temporary.

Check for regressions across review dimensions. In the [coloured woodcut comparison](../archive/icon-generation/icon-study/reviews/round-5-colour-review.md), removing staging marks improved the print treatment but also removed the motion cue that distinguished a pendulum from a hanging weight. A style improvement can therefore justify another recognition check.

Use a new reviewer for the revised artwork, including informed repair checks. Initial interpretation followed by contextual interpretation of the same unchanged sample can be stages within one assignment; a new version is another assignment. Never pool historical repeat-exposure answers with blind answers into one claimed recognition rate. If fresh review is unavailable, leave that check unresolved.

Repeat while the feedback points to useful changes. When iterations stop resolving a problem, revisit the depiction, style or role of contextual information rather than repeatedly strengthening the same prompt. Do not force a false visual difference between things whose distinction is not visible. Decide how an acceptable ambiguity will be handled through the existing names, context and readings, and verify that in play.

Select a direction when the representative examples support the visual brief and the important confusions are resolved or explicitly understood. Style preference and recognition findings should both inform the choice; neither substitutes for the other.

## 8. Expand through related families

Extend the visual catalogue before generating the rest of the story. Group related materials, tools, containers and preparation states so their differences can be designed together. Use the approved reference family across batches, supplementing it with relevant neighboring objects. Review each batch against the original anchors as well as against itself.

Inspect every delivered icon at display size on light, dark and representative scene grounds. Compare related states for silhouettes, transparent margins, repeated-component scale, preparation changes and readable record contents. Give new or difficult distinctions recognition review; use informed visual inspection for coverage, consistent treatment and technical defects. Do not describe an author checking known targets as a fresh recognition trial.

For pale or transparent objects, inspect them over the actual scene texture: a clear silhouette on a flat swatch can disappear among rocks, tools or fabric folds. Preserve useful material edges and recognizable features; a deliberately translucent pane may need a light backing baked into the asset. Plan quieter working areas in new backgrounds where portable objects must remain legible. Follow the [authored-scenery rule](ux.md#item-artwork); a runtime wash is not a remedy for a busy painting.

For compound objects, plan the empty base and fitted appearances together. Compose the complete intended arrangement before extracting individual fittings when their relative size, perspective or placement is difficult to judge separately. When furniture must belong to a room, establish it within the scene first, then extract the matching object; compare the isolated result with the scene to catch changed proportions or perspective. After extraction and final registration, extend receding edges and surface seams to check that they share the room’s vanishing region. Generated isolation can symmetrize a shape or change its depth even when it preserves the object’s identity. Check ground contact, occluded supports and whether fitted objects rest on their surfaces. Follow the [compound artwork contract](story-format-spec.md) and inspect both standalone components and installed states. Check meaningful combinations, alternative fittings and possible overlap, including partial assemblies. A small compound can be checked exhaustively: three independent fittings give eight combinations, as illustrated by the [House proof](../archive/icon-generation/settlement-icons/contact-sheets/house-fittings.png). Choose coverage according to the actual structure rather than copying that count.

For stories with illustrated scenes, maintain a scene plan covering recurring locations, construction state and working space. Compose fixed targets with their backgrounds: a headland is the actual cape, a quarry is its rock face, and a kiln meets the ground and walls of its yard. Paint a feature into the background when that integrates it better; the [transparent hotspot contract](ux.md#item-artwork) supplies its interactive area. Preserve geography, perspective and open working space across repeated appearances. Review each target in its background. A target should be reviewed where the player encounters it, not only as an isolated asset. Settlement's [hotspot contact sheet](../archive/icon-generation/settlement-icons/contact-sheets/hotspots-in-context.jpg) illustrates this contextual inspection.

### Compose backgrounds for their intended frame

The [UX framing rule](ux.md#work-surface-and-dragging) determines cropping from the image proportions and available pane, without author metadata. Use the usual **390:844** composition (for example, **780 × 1688** pixels) for phone-first stories. Keep the setting recognizable near the top and leave usable working space below; shorter phone viewports crop the bottom, and taller/narrower ones crop the sides. A taller source is not required to cover every phone because uniform filling handles those differences. Keep essential fixed targets clear of the expected cropped edges. Inspect the complete composition too, since wide screens reveal all of it and enlarge its objects together. Intentionally broader artwork is supported and fits in full even on phones.

### Register changing scenery

Apply the authoring patterns for [changing fixed items](story-authoring.md#landscapes-that-change-through-fixed-items), [scenery targets](story-authoring.md#scenery-as-an-interaction-target) and [recurring places](story-authoring.md#recurring-objects-and-places). Generate fixed objects in the complete scene that contains them, using the approved scene as a reference for later states. An unrelated isolated generation can change lighting, perspective and scale. Use either of these production methods:

- For a fixed object that changes, generate its scene states with the same camera and surroundings, then extract the complete object as a transparent cutout, including openings between its parts. Remove surrounding ground, walls and sky: painted background patches can differ in colour or geometry and obscure other objects or their names. Prepare a background that remains valid when any of the changing objects is absent, so replacing a silhouette cannot expose its old state beneath it. Register each cutout at its scene coordinates, preserving the generated lighting and perspective; do not commission an unrelated standalone icon and try to fit it afterward. Related replacement states need a common registration canvas even when their silhouettes differ. Inspect the whole silhouette before export; a larger state such as an installed antenna must not inherit a crop that cuts through its new parts.
- For a fixed feature that remains part of the scene, use the complete painting as the background and a fully transparent PNG as its hotspot icon. The PNG defines the receiving area's size; its authored coordinates place it over the actual painted feature.

Use a tightly registered opaque replacement only when it must erase an earlier painted state in the background. Otherwise trace the object and openings to transparency so the scene retains one consistent ground, wall and sky. A full-scene master need not become a full-scene opaque hotspot: mask unchanged working ground and any pixels beyond the changing scenery. An independent receiving hitbox does not clip the artwork. Inspect visible goals and the following chapter on short screens as well as the scene itself; oversized replacement art can cover them even when its drop target works correctly.

Bake any desired wash into the background artwork; the game displays its authored colours without a runtime wash or colour adjustment. If matching source pixels still form a seam in the browser, inspect the rendering layers before repainting: a background-only tint, scrim, opacity or filter changes their appearance relative to fixed artwork. Compare both source composites and actual rendered pixels. Protected-region comparisons do not inspect every silhouette boundary; include the edges of any necessary opaque erasure separately.

Record source bounds, registration transform, common canvas, extraction mask, display dimensions and placement coordinates together in the existing layout record. Preserve fixed artwork's authored scene scale; do not size it as a portable inventory icon. Compound overlays must match their base canvas exactly. Keep the selected background and unaffected geometry stable while repairing a local detail. Mechanical registration, masking and compositing transform existing artwork; painting new or changed content uses the applicable image workflow.

Inspect every extracted state over the selected background, including alternate construction orders and independent compound fittings. Compare stable landmarks, contact points, receding edges, seams, lighting and openings between parts. A state crop must cover the old form without duplicating neighboring equipment or repainting another independently changing state. Look for rectangles of different soil or wall color, halos, clipped additions, displaced feet and disappearing installed parts. A transparent target must not reveal a finished construction before the player makes it.

For a scene audit, render the background alone, every declared fixed appearance separately at its authored size and position, and all declared appearances together in declaration order. Also inspect legal partial assemblies and independent fittings at playing size. The all-appearance proof can include mutually exclusive states; use legal gameplay states to judge the actual progression. Assemble recurring-object and location sheets across chapters, with camera direction identified for reverse views. These review sheets usually use existing images rather than new generation, and belong under `runs/`. Verify representative transitions through actual drag actions, narrow-screen crops and reload; source sheets cannot establish browser alignment or target usability.

Check whether decorative objects accidentally invite the same interaction as the movable icons. Fading a row of isolated objects may still leave it looking like inventory. Contextual setting, overlapping forms, shared supports and deliberate cropping can help a decorative illustration read as a scene. Review that distinction with the actual movable objects present; use the story's visual language rather than prescribing one universal composition.

For a downward landscape extension, give the generator a clean upper crop and ask it to outpaint beyond that edge. Locate any existing texture seam before choosing protected pixels: preserving a numerical half of the canvas can preserve the defect itself. Inspect the final exported junction close up as well as in the player; exact preserved pixels and a seamless generation do not prove that their composition is seamless.

Separate the generated painting from its page framing when layout limits need precision. A painting can extend beyond the visible page; place and crop it during scene composition instead of relying only on a prompt to establish the working area. Keep food and objects naturally proportioned, inspect the visible crop for lost subjects or awkward edges, and preserve the full painting alongside the composed export. Check the result in the actual player at its supported viewport sizes.

## 9. Verify the playable result and retain the work

Check the delivered story as well as its art files. Apply the current [engineering checks](engineering.md#tests-that-earn-their-cost) and [build/lint commands](../README.md#tools). For an artwork conversion, verify that recipes, goals, item identities and chapter supplies retain their intended behavior; adding metadata must not silently redesign the story.

Inspect relevant chapter entries, busy working states and completed assemblies in the browser at supported widths. Allow required artwork to decode and inspect fixed targets in the actual narrow-screen crop. Check loading and sizing, contrast against scenes, clipping and overflow, names and feedback, dragging and placement, fitting, and saved-state restoration as applicable. Exercise actual actions in addition to viewing checkpoint screenshots. Fix the cause of a failure, whether it lies in artwork, layout or interaction code.

Keep the conclusions proportional to the check. Browser emulation does not establish native touch behavior; a legal checkpoint is not a fresh playthrough; accurate guesses do not establish enjoyment. Measure recognition speed with representative users if speed is a success criterion. Follow the [evaluation method](fun-and-evaluation.md) for broader experience claims.

Retain a compact record in the named [active project directory](../projects/README.md) linking to the active brief, with the selected style references, catalogue, selected source artwork and exact requests, extraction/registration information, reviewer instructions and concise final outcomes. Identify selected and superseded versions, reasons for changes and unresolved questions. Trial generations, rejected candidates, reference crops and generated review sheets belong under ignored `runs/` by default; producing an image does not make it a permanent deliverable. Follow the [retention policy](engineering.md#verification-records) for the limited retained exceptions and cleanup. Apply the [directory hygiene and archive policy](../archive/README.md#project-evidence); put current UX decisions in UX and outstanding proposals in the [backlog](../projects/backlog.md).

Keep each review's concise report under `projects/<project>/art-review/YYYY.MM.DD_HH.MM.SS/report.md`, using the review's start time in the user's timezone. Record its artwork version, selected samples, supplied context, coverage and outcomes there; link to this guide for reusable instructions. When relocating an older summary whose review-start time is unknown, state the dated record used for its directory timestamp rather than inventing a start time. Keep source art and production tooling together separately, and evolving project notes in the project's `working-notes.md`.

## Examples and supporting material

Use these sources to inspect concrete implementations of the workflow. Their styles, counts, tools and historical results are examples, not required defaults.

| Material | Useful for |
|---|---|
| [Original icon brief](../archive/icon-generation/instructions.md) | Recognition goals, contextual depiction briefs and the idea of testing a small family first |
| [Reference collections](../references/icon-sets/) | Starting points for visual research; investigate further directions whenever the story calls for them |
| [Study prompts](../archive/icon-generation/icon-study/prompts.json), [source art](../references/icon-sets/generated-study/) and [review records](../archive/icon-generation/icon-study/reviews/) | Comparing requests, versions, guesses and targeted repairs |
| [Style comparison](../archive/icon-generation/icon-study/screenshots/comparison.png) | Inspecting the same pilot subjects in several visual languages and matching scenes |
| [Production record](../archive/icon-generation/settlement-icons/README.md), [generation records](../archive/icon-generation/settlement-icons/generations/) and [contact sheets](../archive/icon-generation/settlement-icons/contact-sheets/) | Extending a selected direction across a whole campaign |
| [Mars production sources](<../archive/2026.11.01 mars study/production/README.md>) and [outcomes](<../archive/2026.11.01 mars study/art-review/2026.11.01_22.36.52/report.md>) | Physically informed sizes, varied silhouettes, registered equipment fittings and landscape targets |
| [Builder model/render sources](<../archive/2026.11.07 builder study/art/README.md>) and [outcomes](<../archive/2026.11.07 builder study/art-review/2026.11.07_03.54.44/report.md>) | Canonical assemblies, real receiving/service paths, constant construction scale, actual-camera detail views and finished-toy scenes |

Archived scripts and embedded paths are historical source material. Adapt the method to current tooling rather than running old regeneration commands unchanged. The [archive index](../archive/README.md#icon-development-evidence) and [working notes](../notes.md#31-october-2026--reconstruct-the-icon-development-process) retain the original process and its provenance.
