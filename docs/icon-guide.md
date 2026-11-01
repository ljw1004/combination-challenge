# Developing story icons: the Settlement process

Settlement's icons came from a small comparative study, repeated recognition and style reviews, targeted repairs, a user-selected direction, and a separate production pass over the whole campaign. The useful method is the feedback loop: describe what each object must communicate, make a manageable sample, inspect it at playing size, preserve wrong guesses, and revise both the pictures and the process before expanding.

This guide reconstructs the work recorded on 31 October 2026 from the original brief, raw reviews, generation records, working notes and local Git history. The story was called **Elements** during development; **Elements - Icons** was initially a separate illustrated edition, later made canonical and renamed **Settlement**. “Woodcut” in the early review records usually means the monochrome comparison, not the final coloured campaign.

This is an account of the method and its evidence, not another UX specification. Current presentation decisions belong to [UX](ux.md#item-artwork), syntax and completeness requirements to the [specification](story-format-spec.md), and experience claims to [fun and evaluation](fun-and-evaluation.md). The Kitchen possibility remains in the [backlog](backlog.md#icon-recognition-awaiting-human-trials).

## Start with the original brief

The original `docs/icons.md` survives as [archive/icon-generation/instructions.md](../archive/icon-generation/instructions.md). Local Git records its introduction in `4d25ff53`, refinement in `ff07a77f`, and move in `b494fe41`. The archived body is identical to the `ff07a77f` version; only the title and an added provenance paragraph reflect the story rename. The substantive refinement between the first two versions specified **one-chapter comparisons with a matching background for each style**.

The brief explained the problem more broadly than “replace words with pictures”:

| Concern | What the brief proposed |
|---|---|
| Recognition | Aim for recognition as quick as the existing text cards. Allow reasonable synonyms, but find out whether pictures communicate the intended things. This was an ambition, not an achieved measurement. |
| Character | Seek a coherent visual identity beyond familiar cute mobile-game graphics or an obviously generated finish. For Elements, the desired world was outdoor survival, subsistence and humble working objects. |
| References | Use the purchased/downloaded collections as optional inspiration for depictions, alongside more distinctive print and illustration directions. Their availability did not choose the style. |
| Consistency at scale | Write a short guide covering silhouette, line weight, palette, perspective, texture and visual scale. Keep a small approved reference family, adding related objects when extending a family. |
| Meaning before drawing | Supply physical and story context. “Earth” means loose soil, distinguishable from sand, clay and stone, rather than the planet. Chapter introductions and combinations that create or use the item can clarify its role. |
| Review | Ask a fresh icon reviewer what the picture depicts before revealing its target. If it fails, supply chapter context and record the guided answer separately. Count blind matches, guided matches and remaining failures; accept “soil” for “Earth.” |
| Small experiment first | Try representative objects in several versions of the same test story, learn which parts of generation and review work, then expand. The brief explicitly left atlas generation versus individual images open to experiment. |

The brief also anticipated practical constraints: artwork at four times display size; transparent, naturally shaped icons rather than one mandatory badge; compound bases with empty spaces and aligned overlays; complete coverage of items and slots; and names available during interaction. These constraints made the experiment playable. Its early suggestion of names **below** icons was subsequently superseded by placing them above for touch dragging; consult current UX rather than copying historical interaction instructions.

One important distinction: the brief suggested a fresh subagent viewing an **individual** icon. The implemented study used a reviewer viewing **whole numbered sheets**, then reused that reviewer. The proposed experiment and the evidence actually collected are not interchangeable.

## Build a representative, comparable pilot

The pilot used the same twenty belongings in **The maker's clearing**, with House accepting Window and Sleeping mat. The range was deliberate:

| Range | Pilot objects |
|---|---|
| Mechanisms and instruments | Telescope, Pendulum, Clockwork |
| Depiction versus physical thing | Botanical drawing |
| Food, contents and social arrangements | Bread, Porridge, Feast table, Cider |
| Materials and substances | Brick, Iron, Thread, Brine, Earth |
| Abstract or diffuse forms | Smoke, Air |
| Living things | Plant, Flower |
| Compound and fittings | House, Window, Sleeping mat |

Six initial directions were compared: risograph, woodcut, medieval manuscript, traditional game, Japanese Edo and Diderot/encyclopedic engraving. Each had twenty icons, two registered House overlays and a matching background. Coloured woodcut was later added as a seventh comparison, keeping the revised monochrome engraving available separately. The [study record](../archive/icon-generation/icon-study/README.md) describes each direction; the [seven-style overview](../archive/icon-generation/icon-study/screenshots/comparison.png) shows the resulting boards.

Generation used transparent five-column, four-row atlases, with explicit reading order, generous empty gutters, no labels or drawn grid, and physical descriptions for each object. Most extracted icons were 224 × 224 pixels, displayed at 56 × 56 in the reference scene. Wider or taller objects could use different dimensions. The pilot House and its layers shared a 384 × 320 canvas. These were concrete study choices, not a requirement that every future family use twenty objects or those exact dimensions.

The [prompt ledger](../archive/icon-generation/icon-study/prompts.json) retains selected, superseded and rejected requests. Mechanical scripts extracted, resized and padded the generated art, recorded crop bounds, and registered fittings; image generation supplied the painted marks. The distinction mattered when assessing whether an apparent drawing problem was actually a bad crop or overlay alignment.

## Iterate on style as well as recognition

The first woodcut drifted toward thick framed, cute inventory graphics. The user rejected that appearance and raised William Blake as a reference. Further verbal style prompts, including a monochrome attempt and an illuminated-colour proof, still drifted. A subsequent monochrome generation used an actual engraving reference and was retained. Risograph likewise went through rejected versions before a flatter reference-led treatment was retained. The lesson supported by these attempts is specific: more emphatic style adjectives alone did not resolve the observed drift.

Later, the user clarified that the desired woodcut should retain the **colour and feel of the original reference**, with an earnest treatment. That produced two coloured passes. The first still had fine hatching, modeled miniature volume and staging shadows. The second used the first atlas and the original reference together, keeping subjects and layout while asking for broader cuts, flatter colour, stronger ink masses and fewer shadows. This made a useful comparison of a targeted revision rather than an unrelated replacement.

Recognition and art direction were reviewed separately. A recognizable cottage could still look too cute; a more convincing print could lose an identifying feature. The fifth review explicitly found both outcomes in the same revision. The [round 4 sheet](../archive/icon-generation/icon-study/reviews/round-4-colour-sheet.png) and [round 5 sheet](../archive/icon-generation/icon-study/reviews/round-5-colour-sheet.png) preserve that comparison.

The traditional set had another correction: the user specified **20% black** circular backings. Generation isolated the foreground; canvas composition then applied exact alpha 51/255 black disks while preserving the foreground's own transparency. Pixel checks verified the backing and transparent exterior. The record acknowledges that generated isolation could repaint details, and that earlier reviews described the opaque-backing version.

## What the peer reviews actually did

The [review-sheet script](../archive/icon-generation/scripts/icon-review-sheet.ts) drew extracted icons at one quarter of their intrinsic dimensions on a paper-coloured sheet. It numbered them in a fixed order shuffled away from the atlas order and omitted names. The same numbering persisted across styles and rounds. The reviewer recorded best guesses, confidence and alternatives without the target list or source manuscript. It saw neighboring pictures together, and source isolation was by assignment, not an operating-system sandbox.

| Round | Material and exposure | Finding and consequence |
|---|---|---|
| [1: blind](../archive/icon-generation/icon-study/reviews/round-1-blind.md) | Fresh reviewer; initial woodcut and riso, forty pictures | The author scored 36/40 as broad object-family matches. Both Brine pictures suggested salt rather than liquid; both Cider pictures established a vessel/fruit drink without fermentation. |
| [1: guided](../archive/icon-generation/icon-study/reviews/round-1-guided.md) | Same reviewer, only those four failures | Shoreline pools and evaporation context recovered saltwater; pressed orchard fruit and wild yeast recovered fermented fruit drink/cider. All four became context-aided matches. The original blind answers were preserved. |
| [2](../archive/icon-generation/icon-study/reviews/round-2-review.md) | Same reviewer, six styles, 120 pictures | The new monochrome Botanical drawing read as a loose leaf; Earth suggested compost/organic scraps; Brick remained generic stone or masonry. Riso's mat read as a patterned rug and its telescope had a tripod. Botanical drawing and Earth were regenerated, and extraction crops were tightened. |
| [3](../archive/icon-generation/icon-study/reviews/round-3-review.md) | Same reviewer, twenty repaired monochrome pictures | Botanical drawing now read as a specimen page, and Earth as loose soil, though fine gravel remained plausible. Brick remained ambiguous. These were useful repair checks, not a fresh success rate. |
| [4: colour](../archive/icon-generation/icon-study/reviews/round-4-colour-review.md) | Same reviewer, first coloured proof; guesses recorded before examining the style reference | Broad objects were legible, but Brine's crystals resembled shells and iron/drink contents remained uncertain. Fine hatching, modeled volume and cozy inventory staging prompted the flatter revision. |
| [5: colour revision](../archive/icon-generation/icon-study/reviews/round-5-colour-review.md) | Same reviewer compared the two coloured sheets and reference | Removing shadows and flattening colour improved the earnest print direction. But removing motion marks weakened Pendulum versus hanging weight; the table looked more like a workbench; broader cuts made Earth look more stony. The set remained more polished than the reference. No recognition score was assigned. |

Additional fresh reviewer creation was rejected by automatic approval review during that work. Consequently, rounds 2–5 reused the original reviewer, including its memory of the Brine and Cider context. They document iterative peer feedback, not five independent trials or a panel of fresh reviewers.

The scoring also had deliberate limits. Soil/Earth, wind/Air and metal ingots/Iron counted as broad family matches. Salt alone did not count as Brine, and a generic fruit drink did not count as Cider. These were author-scored categories, not a calibrated benchmark. A confident identification of the **container** did not establish its **contents**. Recognition was not timed, so even the initial 36/40 does not show recognition as fast as text. It also describes early pictures, not the final production set.

The study retained failures instead of smoothing them into an approval: Brick versus stone, Brine versus salt/water, Cider versus juice, Smoke versus steam, and the newly weakened pendulum/table/soil distinctions remained visible. Human preference, phone recognition speed and native touch were still open at the end of the comparison.

## Expand the selected direction into a campaign

The [working notes](../notes.md#31-october-2026--complete-rustic-elements-icon-edition) record the user's subsequent selection of coloured woodcut and request for a complete, rougher illustrated edition. This was a human art-direction choice, not a winning score from the recognition rounds.

The full pass produced **201 item icons, three House fittings, eight fixed locations and 31 backgrounds**. Its [production record](../archive/icon-generation/settlement-icons/README.md) separates the source-informed visual review from fresh recognition testing.

### Describe distinctions across the whole family

The [visual catalogue](../archive/icon-generation/scripts/settlement-icons/catalogue.ts) gives each item an intended depiction and often a nearby confusion to avoid. Examples include bare glass versus a framed window; an empty basket versus a loaf-filled picnic basket; fine soil versus a single fieldstone; an empty reservoir versus a filled one; and a specimen sheet versus a bound herbarium. That makes consistency more than a shared palette: related states must also differ intelligibly.

The first [materials atlas request](../archive/icon-generation/settlement-icons/generations/materials.json) used the selected coloured study and original inspiration as references. Later families, including [food](../archive/icon-generation/settlement-icons/generations/food.json), used the materials atlas to anchor the style. The recurring guidance asked for fewer broad cuts, uneven inking, imperfect registration and slightly crooked functional objects, with silhouette ahead of surface texture. The pilot record also identified Botanical drawing, House and Thread as a useful small reference family for extensions.

### Review the extracted pictures and compounds

Author review inspected every extracted item at display size. It found neighboring atlas fragments in Cloth and Festival banner, leading to a [two-object repair generation](../archive/icon-generation/settlement-icons/generations/repairs.json) with wider separation. Reviewing the source atlas alone would have missed the exact delivered defect.

House was generated with an empty window opening and a visible open bay. Window, Sleeping mat and Hearth were registered onto owner-sized transparent canvases, then their placement was corrected after inspecting composites. All eight fitting combinations were examined; the retained [House proof](../archive/icon-generation/settlement-icons/contact-sheets/house-fittings.png) shows the combinations, while the [preparation script](../archive/icon-generation/scripts/settlement-icons/prepare.ts) records the mechanical registration. Its proof is enlarged for inspection, so it is not a blind phone-size recognition test.

### Review scenery as part of the icon system

The [scene plan](../archive/icon-generation/scripts/settlement-icons/scenes.ts) tracked geography, construction sequence and open working space. An admired river image remained inspiration because its far-bank shelter and busy foreground did not fit play. Revisions put the completed cottage back on the home bank and removed a mill wheel that appeared before the player built it. Later visits needed to retain completed structures.

Isolated hotspot illustrations initially looked like miniature landscape stickers. A later pass integrated locations into the actual scenery and used fully transparent PNGs for the hit rectangles. The cellar went into the earth bank, the kiln into its yard and the hearth into the wall recess; terrain targets followed real landscape features. All nine appearances of the eight locations were reviewed, including the repeated quarry. A real final lantern placement exposed contact with the bank, so the target moved farther into the inlet. The [hotspot contact sheet](../archive/icon-generation/settlement-icons/contact-sheets/hotspots-in-context.jpg) preserves the outlined locations.

### Check play separately from visual approval

The production review inspected all 31 chapter entries at 390px and 320px, checked loading, sizing, bounds, fittings, save/reload and hotspot behavior, and compared the illustrated manuscript with the original to preserve campaign semantics and supplies. User play also exposed interaction problems such as edge-drop jumps and carried icons being rearranged; those required runtime fixes in addition to better artwork. The [notes](../notes.md#31-october-2026--preserve-icon-placements) retain that work and its verification.

The integrated production record reports 110 Node tests and 48 Chromium tests passing at that checkpoint. Those are historical results, not tests rerun for this guide. Chapter screenshots used legal developer checkpoints except the fresh opening. They establish the inspected layouts, not arbitrary later arrangements, independent recognition, native-device behavior or enjoyment.

## Reusing the process

The brief and its implementation together support this working sequence:

1. **Define the communication problem.** List the actual objects and states, their story meaning, and their nearest confusable neighbors. State separately what style and recognition would need to achieve.
2. **Choose a small but difficult sample.** Include ordinary objects, similar materials, prepared states, abstract forms and a compound if relevant. Compare the same sample across candidate styles with suitable backgrounds.
3. **Make generation reviewable.** Keep exact prompts, references, atlas order and selected/superseded status. Give the generator physical context and distinctive structure, then extract and inspect the actual display-size assets.
4. **Record guesses before giving answers.** Retain the numbered input, reviewer exposure, best guess, confidence and alternatives. Follow failures with ordinary story context separately. A fresh reviewer can test first-use recognition; an exposed reviewer can diagnose a revision.
5. **Repair the observed cause and check for regressions.** Distinguish wrong object, unclear state, style drift, bad crop and bad registration. Freeze the earlier version. Check whether a style improvement removed useful cues elsewhere.
6. **Select, then expand through related families.** Keep approved references stable, author distinctions before generating each family, and review extracted assets, compound states and scene continuity. Selection does not imply that every ambiguity is solved.
7. **Verify the playable result and retain the limits.** Check coverage, semantic preservation, browser interaction and real layouts separately from recognition and human preference. Preserve contrary evidence and archive completed supporting material under the [archive policy](../archive/README.md).

For Kitchen, the clearest transferable question is whether the art distinguishes **ingredients and preparation states**, beyond identifying a bowl or plate. The [current manuscript](../stories/kitchen/kitchen.md) includes Flour/Sugar/Confectioner’s sugar, Milk/Cream/Yogurt, Dough/Leavened dough/Laminated dough, and Custard mixture/Pouring custard/Pastry cream. These are useful candidates for a difficult sample, not findings that Kitchen currently has an icon problem. Settlement's [food sheet](../archive/icon-generation/settlement-icons/contact-sheets/food.png) is a concrete starting reference, but its style choice and recognition results do not establish what Kitchen should adopt.

## Where the evidence lives now

| Material | Current location |
|---|---|
| Original brief, formerly `docs/icons.md` | [Archived instructions](../archive/icon-generation/instructions.md) |
| Comparative study, exact prompts and six raw reports covering five numbered rounds | [Study](../archive/icon-generation/icon-study/README.md), [prompts](../archive/icon-generation/icon-study/prompts.json), [reviews and input sheets](../archive/icon-generation/icon-study/reviews/) |
| Selected and rejected study source art | [Generated study](../references/icon-sets/generated-study/) |
| Seven style collections, their descriptions and previews | [References](../references/icon-sets/); the monochrome collection is now [woodcut-bw](../references/icon-sets/woodcut-bw/), and [coloured woodcut](../references/icon-sets/woodcut-color/) is separate |
| Comparable browser captures and source version | [Screenshots](../archive/icon-generation/icon-study/screenshots/), [capture manifest](../archive/icon-generation/icon-study/screenshots/manifest.json) |
| Full-campaign prompts, revisions, crop maps and visual evidence | [Production record](../archive/icon-generation/settlement-icons/README.md), [generation records](../archive/icon-generation/settlement-icons/generations/), [contact sheets](../archive/icon-generation/settlement-icons/contact-sheets/), [chapter captures](../archive/icon-generation/settlement-icons/screenshots/) |
| Full-campaign source paintings | [Rustic sources](../references/icon-sets/elements-rustic/) |
| Historical extraction, registration, review and capture implementation | [Archived scripts](../archive/icon-generation/scripts/) |
| Current playable manuscript and assets | [Settlement](../stories/settlement/settlement.md) |

Some archived prose, scripts and gallery links still contain former `docs/icon-study`, `docs/settlement-icons`, `scripts/settlement-icons`, `woodcut`, or `story.md` paths. Use the locations above to navigate. Archived commands are provenance, not a current regeneration workflow; they can write to retired destinations. The original art-style reference shared by the woodcut variants is now [woodcut-color/inspiration.png](../references/icon-sets/woodcut-color/inspiration.png).

For an exact local history check, `git show 4d25ff53:docs/icons.md` reads the initial brief, and `git show ff07a77f:docs/icons.md` reads its refined version. The seven-style captures identify `ff07a77f` as their source; `2962e0ec` added the gallery, `1aea45d0` integrated the full rustic edition, and `b494fe41` consolidated/renamed the story and archived the production material. These anchors allow the process to be inspected without restoring retired applications or rewriting the original evidence.
