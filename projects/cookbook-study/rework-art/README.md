# Cookbook rework artwork

Finished art for the revised Cookbook, made with the built-in image generator and installed in [the story assets](../../../stories/cookbook/assets/rework/). The user commissioned this work after the manuscript rework and requested home interiors for afternoon tea and dinner, plus butter visibly spread across both bread slices. Current presentation decisions belong in [UX](../../../docs/ux.md#item-artwork).

The selected Cook’s Pen language continues: observed food structure, fine irregular pen contours and restrained colour washes. The new cooking stations retain the quieter monochrome pencil treatment. Cooking pages retain faint culinary margins; the two serving occasions use furnished rooms with quiet surfaces behind the movable food.

## Delivered work

- Twenty-three standalone food/tool illustrations, including the bread correction. Sauces remain in the same saucepan; pasta has no herb garnish. Mushroom filling connects ravioli with Wellington, whose raw, seared, coated, wrapped and baked states remain distinct.
- Eight station drawings, four adapted from approved sources and four newly generated. Breakfast, Dairy and Wellington backgrounds contain their stations; transparent receiving images avoid drawing them twice. The parlour hob, mushroom pan and freezing churn use separate fixed drawings.
- Five backgrounds: revised Breakfast and Dairy, new Wellington, a home parlour and a home dining room. A painted tea table supports the stand’s initial position. The dining room leaves space for the movable feast table.
- Two compound bases and thirteen registered food layers. The tea stand has five servings. The feast table has eight distinct places, accommodating either cake or both. Food layers reuse the standalone illustrations rather than inventing different dishes.

## Source and export

[Prompts](prompts/) retain the exact generation and revision requests. [Sources](sources/) retain the selected drawings and necessary edit inputs; the manifests distinguish repaired versions. Sources are never recoloured or repainted during export. Native SVG/browser composition measures alpha contours, crops, scales proportionally and registers transparent layers. Background runtime exports use WebP.

| Family | Provenance and geometry | Export command from repository root |
|---|---|---|
| Savoury food | [Manifest](savory-manifest.json) | `node projects/cookbook-study/rework-art/tools/export-savory.mjs` |
| Tea, butter and sauces | [Manifest](tea-sauce-manifest.json) | `node projects/cookbook-study/rework-art/tools/tea-sauce-export.mjs` |
| Stations and cookbook pages | [Generation](production/station-generation.json), [registration](production/stations-and-pages.json) | `node projects/cookbook-study/rework-art/production/build-stations-and-pages.mjs` |
| Rooms and serving assemblies | [Registration](serving-registration.json), [generation](serving-generation.json) | `node projects/cookbook-study/rework-art/tools/build-serving.mjs` |

These commands deliberately replace the corresponding runtime exports. Proofs go to ignored `runs/cookbook-art/`. The tea stand uses an 880×960 canvas and the feast table 1280×1040; all fitted layers share their owner’s dimensions. The tabletop was redrawn from a higher viewpoint because the first drawing offered too little surface for the food. The parlour table was moved down after a phone check showed crowding around the stand. The final stand starts at 50%, 47.3%; the hob at 50%, 19%, with its base aligned to the sideboard. The dinner table keeps its 50%, 56% start.

## Recognition decisions

The first independent reviewer saw an anonymous sheet of 23 illustrations at their actual display sizes. A second fresh reviewer saw only four revised images. These were model checks, not human recognition or preference trials. Review inputs and individual answers are disposable; do not pool repeat/contextual answers with fresh guesses.

- The first noodle topping looked like meat sauce. The revision uses a sparse scattering of light, dry crumbs. The second reader initially saw cheese or short noodles, then found the complete pasta-dish interpretation plausible in its chapter. Exact topping identity remains contextual.
- Biscuit dough initially read as hard cheese because of its cut wedge. Soft folds and pressed edges replaced the wedge; the fresh repair reader identified dough.
- The initial jar wrench could be read as a can opener. Its revised drawing shows a strap wrench gripping a solid screw lid on a glass jar. The repair reader initially read a strainer, then found the jar-opening interpretation mechanically plausible with the preserve context. The tool is appropriate, but unaided exact recognition remains unresolved.
- Roux was made paler while retaining thick tracks and the exposed pan bottom. Fresh review identified thick cream sauce rather than roux specifically. The sauce family, brown butter and sweetened butter still need their ordinary names and recipe context for exact preparation states.
- Both bread slices have continuous knife-spread butter and no separate pat. The first small-image reading remained bread; context established buttered bread, with the fine spread difficult to identify independently at that size. The requested physical correction is present; exact unaided spread recognition is not claimed.
- Mushrooms, chopped mushrooms, raw beef, the baked Wellington, tea vessels and biscuits supported their broad families. Mushroom coating and intermediate dough/filling identities remain more specific than the picture alone reliably establishes.

All illustrations and empty, single-fitting, incremental, either-cake and both-cake assemblies received informed inspection at display size. Browser checks and their limits are summarized in [outcomes](../outcomes.md); reusable instructions are in [verification](../verification.md). The closing page explicitly carries the completed feast table, so advancing does not replace the feast with an empty room.
