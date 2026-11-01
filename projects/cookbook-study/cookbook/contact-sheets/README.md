# Artistic directions and verdicts

The initial question was whether this should feel like a travelling cook’s inventory or the pages of a cookbook. The comparison used twenty common subjects to expose differences of shape, material, preparation state and scale. The user chose **B1 Cook’s Pen** for its personality; **S1 tight fading halo** was the other finalist for its immediate familiarity to mobile-game players.

[Browse the gallery](index.html). [Briefs](briefs.json) retain the twenty subjects, generation requests and selected source paths. [Research references](../research-overview.md) explain the inspiration. Finished sheets are in [sheets](sheets/), original game panels in [scenes](scenes/), selected source atlases in [artwork](artwork/), and finished grounds in [backgrounds](backgrounds/). These are intentionally selected works, not a complete iteration log.

## Travelling cook

| Direction | Artistic statement and reconstruction cues | Verdict |
|---|---|---|
| Traditional painted inventory | Familiar individually rendered objects, rounded volume, readable silhouette and warm painted scenery. Use the retained traditional atlas and the repository’s [traditional game collection](../../../../references/icon-sets/traditional-game/). | The user preferred its background to the original mobile scene. It supplied the setting for the later cartoon hybrid. |
| Mobile cartoon | Plump exaggerated forms, bright appetizing colour, polished highlights, strong outlines and equal visual weight. | The user preferred these icons. The first mobile background was not the preferred setting. |
| Grounded tempera | Quiet earth colours, matte painted surfaces, observed proportions and handmade domestic objects. | Explored as a more grounded story treatment; not shortlisted. No separate negative user verdict was recorded. |
| Storybook pencil | Warm coloured hatching and domestic picture-book softness in a narrative scene. | Explored, not shortlisted; no separate rejection reason recorded. |
| Cartoon on painted scenery, faint backings | Combine the preferred mobile drawings and inventory scenery; reduce the opacity of circular supports. | A transitional solution. The user wanted the support to follow the object more closely. |
| **S1 tight fading halo** | Big uniform 72px cartoon drawings. A tight grey silhouette halo begins near 10% opacity and fades to zero; no circular badge. The native SVG implementation is [artwork.mjs](../artwork.mjs). | **Finalist and runner-up:** immediately familiar to mobile-game players. |
| Fully transparent cartoon | The same uniform mobile objects and painted scenery with no supporting halo. | Retained alternative; S1 won the travelling-cook comparison. |

The first travelling-cook experiments with modest size variation remain visible in the [early overview](overviews/round-01-story-in-game-uniform.png) and the [hybrid overview](overviews/round-02-story-in-game-uniform.png). Final game-style objects deliberately returned to uniform, bold sizes.

## Cookbook pages

The first cookbook treatments looked too similar. The revision made the media much more distinct, varied the grounds and pushed physical scale. The [early comparison](overviews/round-01-book-in-game-varied.png) and [exuberant revision](overviews/round-02-book-in-game-varied.png) preserve that change without retaining each intermediate export.

| Direction | Artistic statement and reconstruction cues | Verdict |
|---|---|---|
| **B1 Cook’s Pen** | Searching black pen contours, irregular observational drawing, sparse hatching, open interiors and restrained olive/ochre/rust washes. A warm, personal working notebook. MacNaughton’s explanatory drawings informed legibility and the relation of line to colour; invent new subjects and compositions. | **Selected for personality.** Open edges replaced the crowded border, and production moved the strong illustration downward. |
| Crayon recipe scrapbook | Energetic coloured-pencil hatching, scribbles, planar shapes, imperfect vessels and pale blush paper. Sala’s ingredient and method sheets informed the marks and instructional clarity. | Retained alternative, not selected. |
| Bold gouache | Broad opaque colour masses, matte brushwork, dragged edges and few continuous ink outlines; pale yellow paper with strong painted accents. Pineles’s food paintings informed colour and mass. | Retained alternative, not selected. |
| Watercolor | The first direction used luminous transparent washes and lost edges. The revised direction deliberately added wobbly amateur pen lines, playful uncontrolled washes, blooms and pigment pooling. The loose marks should stay visible at game size. | The user called this work beautiful and regretted leaving it behind. It remains a complete alternative, not a failed style. Both the early wash atlas and the exuberant finished sheets survive. |
| Cut-paper pantry | Crisp irregular paper-cut shapes, limited natural colours, purposeful incisions for wires/layers, flat shadows and a mint ground with bold sparse decoration. | Also specifically loved by the user, but not selected. Finished uniform and varied sheets survive. |
| Photorealism | The early real-kitchen photograph panels misunderstood the request. The final direction isolates convincing food and tools as if photographed individually in a professional white lightbox: true materials, soft studio light, complete objects and transparent surroundings. | The photographic-panel approach was rejected; lightbox objects corrected the brief. The final style remained an alternative. |

## Scale and composition

Physical relationships are part of the drawn cookbook direction: a jug is larger than folded pastry, an apple smaller than a mixing bowl, tools long, and a trolley conspicuous without being literally life-size. The final samples impose a **60px minimum longest edge** so small subjects such as soy sauce remain usable. Photoreal objects use about half the severity of physical variation. Game icons stay uniform at 72px. The [sample layout source](../page-layouts.mjs) retains the actual dimensions and arrangements; [current UX](../../../../docs/ux.md#item-artwork) owns the production sizing contract.

The comparison set is apples, eggs, flour, sugar, chickpeas, milk, cream, whipped cream, pouring custard, pastry cream, raw dough, laminated dough, puff pastry, ginger, coriander, soy sauce, whisk, rolling pin, bean stew with bread, and a trolley. It tests powders, liquids, aeration, raw/baked layers, thin tools, vessels and large compounds. Chickpeas, ginger, coriander and soy sauce broadened the food vocabulary beyond the original pastry-heavy story.

The PNG sheets preserve both uniform and varied final cookbook compositions as finished comparison work. They do not require keeping all extracted per-item assets or duplicate desktop/phone views. New studies should use the relevant brief, source atlas, reference images and a freshly composed in-game sample.
