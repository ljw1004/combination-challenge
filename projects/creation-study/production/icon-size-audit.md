# Icon-size audit

5 November 2026. The [active brief](../../../stories/creation/design-brief.md) owns the size rule. This pass inspected all active default icon references, including shared artwork, against the whole story and its transformation families. Landscape hotspot artwork remains separately scaled and registered.

The current inventory uses 182 distinct default icon artworks: 18 at 96px and the remainder at 64px in the reference viewport. Source images are respectively 384px and 256px square; all use the same deterministic circular frame. The cream Variation icon is ordinary-size. Its later pencil landscape annotations are separate artwork.

| Large family | Selected identities |
| --- | --- |
| Sun and whole-world states | Sun; Rocky world; Stone crust; Many-voiced world; Impact winter; Recovering world; World after the ice |
| Whole-forest states | First forest; Renewing forest; Flowering forest; Fallen forest; Pioneer woodland; New forests |
| Other milestones | Living cell; Sun-fed cells; Multicellular life; Language; Song of creation |

Hydrothermal vent, Living coast, Flowers and Tree dwellers return to ordinary size. Storm is also ordinary-size. Light is emitted sunlight, and weathered rock, moving plates and rivers are parts or consequences of the world; they do not inherit the size of the Sun or Earth. Seeds, saplings, groves and individual animal lineages likewise remain ordinary. The forest family represents whole communities rather than every plant descendant.

Rocky world's selected source crop is centred on its measured molten-ball silhouette. Stone crust retains its size and position when created from the movable world. Export geometry, source hashes and frame settings live in [icon-plan.json](icon-plan.json); output dimensions and hashes live in [selected-exports.json](selected-exports.json).

Verification uses `export-icons.py --verify`, native-size contact-sheet inspection and actual browser gestures at 390×664 touch and 1440×1000 mouse. The chapter-five Variation result and the final Song of creation remain usable with the revised milestone sizes. Detailed captures stay in ignored `runs/`; current consolidated results are recorded in [the revision outcome](art-revision-outcome.md).
