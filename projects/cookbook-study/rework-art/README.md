# Cookbook rework artwork

Artwork for the revised Cookbook, made with the built-in image generator and installed in [the story assets](../../../stories/cookbook/assets/rework/). The user commissioned this work after the manuscript rework and requested home interiors for afternoon tea and dinner, plus butter visibly spread across both bread slices. Lasting story and art direction belongs in the [Cookbook design brief](../../../stories/cookbook/design-brief.md). Shared interaction behaviour belongs in [UX](../../../docs/ux.md#item-artwork).

The selected Cook’s Pen language continues: observed food structure, fine irregular pen contours and restrained colour washes. The new cooking stations retain the quieter monochrome pencil treatment. Cooking pages retain faint culinary margins; the two serving occasions use furnished rooms with quiet surfaces behind the movable food.

## Delivered work

The current runtime collection contains 54 images: 29 standalone icons, five backgrounds, two compound bases, fourteen fitted layers and four station/receiving images.

- Twenty-nine current standalone food/tool illustrations, including butter spread across both bread slices, a chef’s knife, sliced cucumber and finger sandwiches, tea bags, cups of water and tea, apple juice with a correctly scaled cut apple, and an unbaked Alaska. Sauces remain in the same saucepan. Noodles have plain butter or toasted crumbs; ravioli and its brown butter include sage leaves. Mushroom filling connects ravioli with Wellington, whose raw, seared, coated, wrapped and baked states remain distinct.
- Fixed stations combine approved pencil drawings with newly generated equipment. Breakfast, Dairy and Wellington backgrounds contain their stations; transparent receiving images avoid drawing them twice. A kettle replaces the parlour hob and is scaled to the painted sideboard. The mushroom pan and freezing churn remain separate fixed drawings. Their receiving geometry is independent of standalone food and tool sizing.
- Five backgrounds: revised Breakfast and Dairy, new Wellington, a home parlour and a home dining room. A painted tea table supports the stand’s initial position. The dining room leaves bare wooden floor for the movable dining table.
- Two compound bases with fourteen fitted layers. Afternoon tea has six servings: cucumber finger sandwiches, scones, brown-butter biscuits, jam roll, whipped cream and jam. The cream pot sits behind the jam jar, which has no spoon. Dinner has eight separate servings, accommodating either cake or both. Its dishes were composed with the table in the room; the final table follows a construction sketch registered to the room’s perspective.

## Size audit and corrections

The audit covered all 91 raster files introduced by commit `fcf2606475a609d01395ec544d7332570d67d4c2`, including the intentionally empty receiving-area PNG:

| Role | Files |
|---|---:|
| Standalone runtime icons | 23 |
| Fitted serving layers | 13 |
| Furniture bases | 2 |
| Station and receiving-area PNGs | 4 |
| Runtime backgrounds | 5 |
| Retained source paintings and necessary variants | 41 |
| Production page PNGs | 3 |

Most new standalone drawings had been fitted into an 80×60px display canvas, leaving about 73–77px of visible artwork. This met the small-object minimum but lost the original physical hierarchy: pasta plates, preparation bowls, whole roasts and handled saucepans had become similarly small. The retained sources have sufficient resolution; their painting dimensions do not determine the size seen in play.

The [item size catalogue](item-sizes.json) records each corrected extent and its comparison with the original collection. Plates and bowls recover their established scale; the Wellington stages grow with the coating, pastry and final platter; saucepan handles count toward the whole object. New cups, the chef’s knife and Unbaked Alaska match their existing counterparts. Exporters size the visible drawing, preserve its proportions and add minimal transparent padding. Fitted servings and fixed stations use their own registration, rather than the standalone minimum.

All 29 current standalone exports matched their intended visible extents within 0.5px, retained transparent borders and had current source hashes. Their display proofs received informed inspection. This is an export check, not browser or fresh-recognition evidence.

A subsequent comparison of the older standalone apple illustrations found the juice icon's cut fruit was about 60px wide, against roughly 35px for each fruit body in the Apples ingredient. These are approximate visible body bounds, excluding stems and leaves. Targeted generated edits reduced the cut fruit, then reduced the jug to match the Water carafe: its body is about 60px wide and 82px tall, against about 60×92px for Water. The cut apple remains about 35px wide. The complete juice drawing, including handle and fruit, has a 92px intended extent. The original ingredient, juice illustration and source atlases remain preserved; the story uses the corrected juice export. The [tea/sauce manifest](tea-sauce-manifest.json) records the edit requests and their inputs. This correction concerns the standalone illustration; dinner uses its separately composed fitted juice.

The audit also found the dinner table’s steep viewpoint and short legs made it look squat; its prompt had explicitly requested those proportions. The fitted chocolate cake was shrunk by a height cap, and the Wellington platter appeared about the same width as the bean pie. A room composition established the replacement table and exactly eight dishes together. Their fitted sizes and placement follow that composition; the table’s subsequent perspective correction is described below. The tea stand, station canvases, background exports and retained production pages had no additional size defect identified in the original audit.

## Source and export

[Prompts](prompts/) retain the exact generation and revision requests. [Sources](sources/) retain the selected drawings and necessary edit inputs; the manifests distinguish repaired versions. Sources are never recoloured or repainted during export. Native SVG/browser composition measures alpha contours, crops, scales proportionally and registers transparent layers. Background runtime exports use WebP.

For dinner, the [laden room composition](sources/dining-room-laden.png) establishes the table and exactly eight dishes together. The image generator separately isolated an [empty table](sources/dining-table-from-laden.png) and [each fitted dish](sources/fitted-dinner/). Targeted generated repairs removed herb flecks from Wellington and restored dark ganache between the chocolate cake layers. The [generation record](serving-generation.json) records these inputs, selections and repairs; [registration](serving-registration.json) records their final placement. Tea follows the same whole-composition method. The [accepted stand](sources/tea-stand-service.png) puts biscuits around the top post, one scone with cream and jam on the middle tier, and the roll with three plate-free sandwiches below. All six [fitted servings](sources/fitted-tea/) were extracted separately and registered back onto the original empty stand. The user retained this sandwich arrangement after rejecting a later orientation attempt.

The table extraction was superseded after an informed geometry review found that it had symmetrized the tabletop: its rear edge was centred above the front edge, losing the room composition’s offset. The construction used an approximate vanishing region right of centre, (570, 250) in the 853×1844 room reference. A [construction sketch](sources/dining-table-construction.svg) supplied the corrected silhouette for the [selected table](sources/dining-table-constructed.png). The construction guided its receding sides and plank seams against the room; the fitted dishes rest on the surface. A further generated repair removed the exposed rear-leg stubs from the [preceding version](sources/dining-table-before-leg-repair.png): at this viewing angle, the rear feet are correctly occluded by the tabletop and apron. The rug revisions did not resolve the user’s perspective concerns, despite the supplied construction guides and informed review. The [selected background](sources/dining-room-bare-floor.png) therefore removes the rug entirely and continues the wooden flooring. The existing table, dishes and their registration remain unchanged. Earlier rug paintings and guides are retained as generation inputs and superseded construction work; they are not the current design direction. These were informed visual reviews, not fresh recognition trials.

| Family | Provenance and geometry | Export command from repository root |
|---|---|---|
| Savoury food | [Manifest](savory-manifest.json) | `node projects/cookbook-study/rework-art/tools/export-savory.mjs` |
| Tea, butter and sauces | [Manifest](tea-sauce-manifest.json) | `node projects/cookbook-study/rework-art/tools/tea-sauce-export.mjs` |
| Stations and cookbook pages | [Generation](production/station-generation.json), [registration](production/stations-and-pages.json) | `node projects/cookbook-study/rework-art/production/build-stations-and-pages.mjs` |
| Rooms and serving assemblies | [Registration](serving-registration.json), [generation](serving-generation.json) | `node projects/cookbook-study/rework-art/tools/build-serving.mjs` |

These commands deliberately replace the corresponding runtime exports. The two standalone exporters share [framing code](tools/item-framing.mjs) and the [size catalogue](item-sizes.json). Proofs go to ignored `runs/cookbook-art/`. Run `node projects/cookbook-study/rework-art/tools/review-art.mjs` for an unnamed sheet at current display sizes and its separate answer key; it reads the current catalogue and manifests. All fitted layers share their owner’s canvas dimensions.

Current serving geometry belongs in [registration](serving-registration.json). At the reference viewport, the tea stand is 220×240px and starts at 50%, 44%. Its kettle drawing is 38px high within a 64×56px receiving target at 50%, 22%, with its base resting on the sideboard. The dining table is 300×290px and starts at 57.6%, 41.7%, aligning its constructed perspective with the room. Intrinsic compound canvases are four times these display dimensions.

## Recognition decisions

The first independent reviewer saw an anonymous sheet of 23 illustrations at their actual display sizes. A second fresh reviewer saw only four revised images. These were model checks, not human recognition or preference trials. Review inputs and individual answers are disposable; do not pool repeat/contextual answers with fresh guesses.

- The first noodle topping looked like meat sauce. The revision uses a sparse scattering of light, dry crumbs. The second reader initially saw cheese or short noodles, then found the complete pasta-dish interpretation plausible in its chapter. Exact topping identity remains contextual.
- Biscuit dough initially read as hard cheese because of its cut wedge. Soft folds and pressed edges replaced the wedge; the fresh repair reader identified dough.
- The initial jar wrench could be read as a can opener. Its revised drawing shows a strap wrench gripping a solid screw lid on a glass jar. The repair reader initially read a strainer, then found the jar-opening interpretation mechanically plausible with the preserve context. The tool is appropriate, but unaided exact recognition remains unresolved.
- Roux was made paler while retaining thick tracks and the exposed pan bottom. Fresh review identified thick cream sauce rather than roux specifically. The sauce family, brown butter and sweetened butter still need their ordinary names and recipe context for exact preparation states.
- Both bread slices have continuous knife-spread butter and no separate pat. The first small-image reading remained bread; context established buttered bread, with the fine spread difficult to identify independently at that size. The requested physical correction is present; exact unaided spread recognition is not claimed.
- Mushrooms, chopped mushrooms, raw beef, the baked Wellington, tea vessels and biscuits supported their broad families. Mushroom coating and intermediate dough/filling identities remain more specific than the picture alone reliably establishes.

Earlier icons and empty, single-fitting, incremental, either-cake and both-cake assemblies received informed inspection at display size. A repeat reviewer who knew the story inspected the then-current unnamed icon sheet: the beef stages and tea bags were readable, while mixtures, mushroom coating and the jar tool still needed context. This was informed model critique, not new fresh or human recognition evidence. These artwork reviews do not establish final browser behavior for the latest serving layouts. Recorded browser checks and their limits are summarized in [outcomes](../outcomes.md); reusable instructions are in [verification](../verification.md).
