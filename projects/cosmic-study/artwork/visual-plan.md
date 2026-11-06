# Cosmic artwork plan

This document preserves the production proposal and three candidate directions for [the current manuscript](../galaxies.md), governed by its [single design brief](../design-brief.md), the [icon guide](../../../docs/icon-guide.md), [artwork presentation rules](../../../docs/ux.md#item-artwork) and [format specification](../../../docs/story-format-spec.md). Production is now complete: repaired luminous pastel was selected for material circles and scenes, with open charcoal receiving drawings. The [production index](README.md) owns the selected artwork and records; [review outcomes](../art-review/) record what was actually checked. The proposal below predates those outcomes. Earlier Cosmic artwork and review results were not consulted when making it.

The [catalogue](catalogue.json) records the planning baseline's fingerprint, material identities, physical subjects, nearest misleading interpretations, creating and using recipes, authored goals, portable/fixed roles, chapter-entry scenes, branch constraints and proposed atlas cells. That baseline has **157 identities, 113 recipes and 23 chapters: 22 playable chapters plus the ending**, with **141 portable defaults, 21 fixed identities, 26 explicit chapter-local fixed presentations and four later circular appearances**. Its manuscript SHA-256 is `89f0fda5ac9aee0418cb4573aafc0f5f0fd71e4d218b4c4f628421928437445d`. Three subsequent trajectory paragraphs produced final text `f2704f1286627903e2b2a1cc963b584d38e6d0a9f77354cae697f93bdbcfa5c2` without changing those identities or recipes. The final [scene registration](scene-registration.json) and [asset manifest](production/asset-manifest.json) own implemented coverage; the planning catalogue is not a regenerated copy of the integrated manuscript.

## What the pictures should teach

The game asks what a collision can destroy when almost every star survives. Its visual argument is the difference between compact separated stars and extended interacting gas, then the different things the same material becomes. The chosen fuller game follows the moon-bearing world, disrupted moon and rings, escaping rubble world, changing stellar companions and required return of the small disk's lost material into central stars. Recognition should help players make physical predictions and remember those histories. A beautiful cloud that could mean any of twelve supplies would miss that purpose.

Material selections use circular illustrations. A circle means “the selected thing or portion of material”; it does not claim that the cloud has a circular boundary, a star is portable, or a galaxy and a pebble have equal physical size. Leave the exterior transparent and use the existing `(circular)` metadata. No Gravity, Cooling, Heat, Time, Compression, speed arrows or nuclear reaction collectibles are commissioned.

Fixed receivers use open, transparent line drawings of the actual surroundings. Use interrupted spatial contours, sparse material marks and a few identity anchors, with no enclosing medallion, button plate or decorative target ring. They must look like regions to receive material, and remain recognizably the same material when a former portable item becomes fixed. Field lines and orbital arcs, when needed, are explanatory context rather than new objects. Names carry information that a still image cannot honestly establish, including relative speed, orbital binding, elemental enrichment and provenance.

## Three directions on the same subjects

The references below were inspected for visual technique. They are references, not proposed source assets to ship, and their historical astronomy is not this game's scientific authority.

| Direction | Concrete visual language | Strength to test | Likely failure and repair |
|---|---|---|---|
| **A — Luminous pastel** | Deep blue-green fields; luminous forms made from broad softly blended chalk masses; sharply limited bright stellar points; opaque dust silhouettes cut across pale clouds. Surfaces have broad tone rather than outline. Fixed art becomes sparse chalk contours with no filled field. | Gas can feel extensive, diffuse or dense; scale and darkness can retain wonder without a human observer. | Every cloud may become a pretty glow, and small features may dissolve. Require two or three strong masses per icon, dark interiors for cold dense gas, and a strict star-point budget. |
| **B — Flat screenprint** | Four or five flat pigment values; deliberately cut silhouettes; hard-edged overlaps; a few broad offset bands rather than gradients. Stars are simple filled points, worlds use large color regions, cloud opacity uses overlapping cut shapes. Fixed contexts are open single-weight contour shapes. | Strong small-size structure and consistent family production; clouds and material fragments can differ through shape. | A cloud may look like solid paper or flame, and an orbit may look like a mechanism. Keep gas edges interrupted and layered, avoid enclosing hard outlines around gas, and reserve sharp facets for solids. |
| **C — Engraved observatory** | Bone-white or subdued slate grounds; charcoal contour, open hatching and sparse stipple; one restrained accent per material family. World volume comes from broad curved hatch bands; dark gas from sparse-to-dense stipple; stars remain tiny simple points. Fixed receivers use the same pen with most fills removed. | Material structure, grains, rubble and cutaways can be precise; paper-like negative space can keep the work surface calm. | Fine engraving can vanish or become noise; fixed and portable line art may be too similar. Use fewer heavier marks at phone size, a clearly bounded circular field only for portable art, and substantially sparser open receiver drawings. |

A's technique reference is Trouvelot's *Great Nebula in Orion*: luminous branching volumes, a strong dark cleft, tiny separate stars and a large quiet dark field. Borrow the control of light and empty space, not the particular nebula or its historical physical interpretation. [The Huntington's Trouvelot collection](https://www.huntington.org/digital-classroom-resources/trouvelots-astronomical-drawings).

B's reference is JPL's *Grand Tour* poster: large flat planetary disks, decisive ring geometry, transparent-looking overlaps and a restricted graphic vocabulary. Omit its ships, typography and decorative speed bands. [NASA/JPL, The Grand Tour](https://www.jpl.nasa.gov/images/the-grand-tour-jpl-travel-poster/).

C's reference is Hooke's lunar and stellar plate: different densities of hatch describe relief, and isolated star marks sit in generous open space. Omit lettering, frame, ornamental starbursts and literal book-page props. [Science History Institute, Telescopic view of moon and stars](https://digital.sciencehistory.org/works/0c483k64v).

These are different rendering systems—soft volumes, cut flat shapes, and ink structure—not three palettes applied to the same painting. Give all three identical subject states, camera orientations, relative feature sizes, phone-size samples and review questions. Each may use its appropriate scene palette. Do not judge A's large painting against C's tiny icon.

### Identical comparison subjects

| Subject | A: luminous pastel | B: flat screenprint | C: engraved observatory | Non-negotiable physical distinction |
|---|---|---|---|---|
| Old orange star and changed stream | Orange point with tight bloom; pale companions rearranged through darkness | Orange dot plus separated small dots; changed curve | Warm point and sparse ink lights; changed spacing | Same surviving star, no burst, broken stellar surfaces or new star |
| Dark lane before and after crowding | Opaque forked silhouette cutting a faint luminous field | Forked overlapping dark masses, denser knots in result | Dense dark hatching interrupting background star stipple | Dark gas blocks light; it is not an empty crack; no newborn stars yet |
| Young star with dusty disk | Cream star with broad softly lit ellipse and dark near-side notch | Cream point with layered elliptical bands and one dark notch | Compact white opening, curved hatch bands, interrupted dark notch | One actual host; no finished planets; disk is not Saturn's thin solid ring |
| Moon-bearing rocky world | Quiet shaded rocky sphere and small distinct moon | Two unequal disks with broad impact basin shapes | Curved rocky hatching, compact crater marks, separate small moon | Same struck world; no Earth continents, ocean or giant rings |
| Ringed giant | Broad gas bands inside thin luminous inclined rings | Bold oblate form, broad belts, two slim flat ring bands | Sparse curved bands, thin particulate ring lines | Same giant as fixed predecessor; lost close moon becomes ring material; separate outer moon not assumed present at creation |
| Cold cloudlets and heated disrupted cloud | Opaque cold clumps versus luminous shredded gas | Closed dense masses versus broken expanding shapes | Dense opaque hatching versus open radial fragments | Two different selected populations in the initial comparison; do not label them a before/after sequence. Later compare actual path-cloud predecessor with its shocked result |
| Black-hole external disk and jet | Brilliant external ellipse, genuinely dark centre; narrow material stream | Bright broken elliptical band around dark gap; narrow knotty shape | White external hatch bands around unfilled darkness; narrow separated plume marks | All visible emission and launched material outside the horizon; no luminous hole, portal or matter escaping from within |
| Open receiving regions | Sparse chalk contours crossing the scene | Interrupted contour arcs with sparse pigment fragments | Sparse ink arcs and material stipple | Distinct from the portable circular fields; target region recognizable without a fake receptacle |

**Recommendation:** take A into the first production pilot, while generating the same small comparison in B and C before selecting the full direction. A is the strongest initial hypothesis for a story about matter, darkness and scale. B is the clearest alternative if glow destroys distinctions; C is the clearest alternative if material structure needs stronger articulation. This recommendation is design judgment, not a tested winner. Do not combine all three into an inconsistent family merely to keep favorite individual pictures.

## Physical reference boundaries

The intended palette is illustrative. An infrared or submillimetre observation translated into visible color does not establish what a person would see or provide a universal temperature chart. Use observations to study shape, occlusion, disk orientation and separation; consult the manuscript's scientific notes for the selected causal model.

| Primary reference | What it helps establish | What not to copy or infer |
|---|---|---|
| [NASA/ESA, L1527 in NIRCam](https://science.nasa.gov/asset/webb/l1527-and-protostar-nircam-image/) and [NASA's explanation](https://www.nasa.gov/universe/nasas-webb-catches-fiery-hourglass-as-new-star-forms/) | Dark disk across a small source, dust extinction, extended cavities around a young object | The blue/orange are representative infrared colors; they are not simply cold/hot gas. The followed young host initially shines through contraction and settles into sustained fusion later. L1527 is one reference morphology, not its required appearance. Do not give the starting young-system a completed jet cavity before its action or imply light begins only with fusion. |
| [ESO/ALMA, HL Tauri](https://www.eso.org/public/news/eso1436/) | Flattened dusty disk, inclination, broad rings and dark gaps as a morphology reference | Submillimetre intensity rendered in color is not naked-eye orange heat. Do not copy all rings, infer one planet for every gap, or turn a disk into solid planetary rings. |
| [NASA/Hubble, tidal-tail clusters](https://science.nasa.gov/missions/hubble/nasas-hubble-traces-string-of-pearls-star-clusters-in-galaxy-collisions/) | Long distorted tidal arms and spatially separated populations in them | Use the image as a morphology example, not this fictional galaxy's exact geometry. Do not preserve young blue massive stars through hundreds of millions of years or make every tail form a bound cluster. |
| [NASA, Anatomy of a Black Hole](https://science.nasa.gov/universe/black-holes/anatomy/) | Exterior disk, dark shadow, view-dependent lensing and external jet geometry | Its explanatory illustrations are not photographs. Do not trace visible bright matter into the horizon and out again; do not assert the displayed shadow's apparent edge is the literal event-horizon radius. |

## Identity anchors and permitted changes

| Family | Carry forward | Permit or require change |
|---|---|---|
| Orange-star stream | Orange stellar color, modest halo and identity of the followed long-lived star | Stream curvature and neighbor arrangement; do not imply every neighboring star remains unchanged forever |
| Forked lane | The large fork and broad dense-gas knot hierarchy through compression | Gas shape evolves and disperses. Do not preserve a cloud silhouette as though it were a rigid object for hundreds of millions of years |
| Lane-born population | An open fan rather than the tail cluster's compact triangle; three modest long-lived anchor lights | Massive bright early blue members disappear over the long time jump; later stars are surviving population members, not newly supplied copies |
| Pillars to tail cluster | Unequal three-lobe hierarchy through pillars, carried clumps and dense knot; compact triangular stellar population after collapse | Gas contours do not become literal star shapes. Ageing cluster loses its brightest short-lived members while retaining a lower-mass subgroup |
| Young host | Cream-white host and common disk inclination; near-side notch while the dusty disk exists | Host shines through contraction before eventual sustained fusion and remains a separate earlier identity. Disk gas escapes early; do not preserve an ancient dust notch after dispersal or absorb the host into a later planet icon |
| Moon-bearing rocky world | Same individual rocky sphere, muted palette, broad impact basin, one small moon and readable moon gap through `b-moon-world`, `rocky-system` and `c-cratered-system` | Stone impacts add scars in `rocky-system`; icy impacts add new craters in `c-cratered-system`. Both circles and the final fixed appearance contain only that world and moon, with no duplicated star or extra planets |
| Giant | Broad pale belt, narrow dark band, illumination and axis inclination | Envelope grows; later thin rings appear from the actual lost moon. Do not assume a particular cloud marking lasts unchanged for astronomical time |
| Rubble world | Bean-shaped outline, deep notch, three major boulders including pale wedge | Surrounding orbital context changes; losing the sun does not break apart or melt the body |
| Escaping cluster star | Same warm ivory light in portable result and fixed passer | Context widens enormously; it must never be drawn beside the giant's rings as if the passage occurred there |
| Exchanged pair | Middle member remains recognizable; larger newcomer replaces small former companion | Later merge into one star with ejecta; intruder is distinct and departs |
| Nuclear flow | Same viewing angle, central dark region and gas-disk plane on refill | Brightness and feeding stream change outside the hole; no inferred black-hole merger or new black hole |

The required material link is `b-dusty-outflow` → `c-dust-rich-cloud` → `c-central-stars`. Show gas and grains leaving the actual small disk, joining the larger cold neighboring cloud, and eventually entering central star formation. The cold cloud has no substitute producer and the central stars have no returning-gas bypass in this graph. Names and the enacted sequence carry this ancestry; avoid invented colored “special grains” that persist unchanged inside stars.

The original `b-shattered-body` is the continuing rocky fragment reservoir. Its portions gather the rubble world, collide with inward icy bodies, strike the giant's rings and become fine dust. Later artwork must use that rocky source directly; no extra comet-remains mixture or new debris identity is needed. The differentiated `b-layered-world` remains an optional discovery: the moon-forming impact can also follow the molten world directly, so later required art must not assume its optional cutaway was seen.

In `b-ch5`, `b-moon-world [transform] + b-fast-stones [consume] → rocky-system` follows an actual collision with the same world. Despite its historical identifier, `rocky-system` now means **Moon-bearing world after the impacts**; `c-cratered-system` means **Moon-bearing world with new craters**. Neither represents the host or a tableau of its planets. Keep both in the rocky-world atlas family, alongside the earlier moon-bearing world. The young host is not retired or recreated by this operation.

These are recognition devices within a stylized depiction, not promises of rigid topology, exact star counts, precise temperature or measured orbital distances. Render important survivors recognizably even when a name is hidden, while allowing the physical changes the story establishes.

### Portable and fixed appearances

Five identities need both circular defaults and open chapter-local forms: `a-collided-lane`, `young-system`, `a-tail-stars`, `e-escaping-star`, and `c-cratered-system`. Keep the same material anchors in each form. A fixed-only item such as `b-giant` needs open receiving artwork; its later `ringed-giant` result needs a circle. The catalogue records all chapters rather than guessing fixedness from an `@` occurrence.

Two operations move from a fixed predecessor to a new portable identity:

| Chapter | Fixed material → circular result | Continuity obligation |
|---|---|---|
| `b-ch4` | `b-giant` → `ringed-giant` | Same planet, new ring from the close moon; no old ringless giant painted beneath the removed fixed asset |
| `c-ch4` | `a-tail-stars` → `c-surviving-tail-cluster` | Same ageing cluster, brightest early members gone, surviving lower-mass group recognizable |

The old fixed item does not become movable simply because a later chapter omits it. These are actual recipe transformations. `young-system` is fixed only in `b-ch1`; it is absent from `b-ch5` Hotspots and remains in the earlier history. The final `c-cratered-system` fixed appearance in `c-ch10` is the existing world and moon, without its host. The current ending inherits the last scene and its presentation under the specification; its empty Hotspots section in parser data does not mean the UI necessarily erases inherited targets.

### Later appearances of the same material

The catalogue proposes four circular appearance changes from `c-ch5`, when the galaxies return after hundreds of millions of years. These are proposed artwork metadata, not new logical states or edits already made to the manuscript:

| Existing identity | Later appearance |
|---|---|
| `lane-born-stars` | Surviving open stellar population, modest long-lived anchors recognizable, original short-lived massive blue members absent before the final crossing |
| `c-tail-shell` | Irregular dispersed and regathered gas, with no ancient closed shell or scalloped rim |
| `c-dust-rich-cloud` | A differently shaped cold gathering with dusty folds, still carrying some of the small disk's actual lost material |
| `c-enriched-tail-cloud` | Changed dusty mixture without the old remnant-shell edge, ready for its later outer-gas encounter |

The logical identities follow material ancestry through mixing, dispersal and renewed gathering. Do not preserve exact cloud contours across that interval. The format's `from chapter` artwork changes are global current-presentation changes, including earlier panels, so review their effect in scrollback during integration. Fixed chapter-local artwork is a different mechanism. The four proposals have their own exact atlas cells and do not change the count of 157 material identities or 141 required portable defaults.

Two matching names are already authored from `c-ch5`: `c-tail-shell` becomes **Gas once swept into the tail shell**, and `c-dust-rich-cloud` becomes **Cold gas carrying the disk's lost matter**. The catalogue records those actual name changes separately from the proposed image changes.

## Chapter-entry backgrounds

The catalogue gives a physical entry brief and an explicit forbidden-results list for all 23 chapters. Before painting, generate the actual chapter checkpoint for the final text and check which derived identities exist. An Items declaration is not proof that its result is already present.

Compose phone-first at **780 × 1688** or another exact **390:844** multiple, with broad working space, essential orientation near the upper half and no essential target near a crop edge. Fixed targets need suitable local scene luminance for the existing black dotted feedback. Bake that composition into the artwork; do not propose a runtime wash, halo or custom UI to rescue it. Test shorter phone, standard phone, desktop editor preview and wide desktop framing under current UX rules.

Use a small set of geographic masters with genuinely different scale and time states, not one generic nebula behind every chapter:

| Scene family | Chapters | Entry-state constraint |
|---|---|---|
| First crossing and dark lane | `a-ch1`, `a-ch2`, `a-ch3` | Arms begin recognizable; crowded lane appears only after collision; new lights only after their creation; no finished jets or pillars in the next action's starting field |
| Tail base and nursery boundary | `a-ch5`, `a-ch6`, `c-ch1`, `c-ch4` | Same tail hook and nursery direction; knot precedes cluster; later cluster ages; shells and cooled/enriched clouds remain discoveries |
| Same young system at changing scales | `b-ch1`–`b-ch5`, `c-ch3` | Grain scale, rocky-body scale and outer gas disk are views of one system. `b-ch3` returns to earlier gas-rich time; `b-ch5` juxtaposes early gas loss with later moon-world history. Never paint the later moon and rings into the early gas-loss episode |
| Cluster encounters and outer flyby | `e-ch1`, `e-ch2`, `e-ch3` | The flyby is hundreds-of-AU context, main giant a few-AU inner context. The rare stellar surface merger belongs to its cluster encounter, not galaxy overlap |
| Returning galaxies and central gas | `c-ch5` | Hundreds of millions of years later, distorted stellar concentrations return; old shell material has changed shape, disk-export cold gas approaches and stellar populations have aged. No central stars or outflow already complete |
| Nuclear feeding, jet surroundings, return | `c-ch6`, `c-ch7`, `c-ch8` | Keep nucleus orientation; initially unlit feeding context, then broader gas, then surviving centre receiving returns. The required hot cavity and optional plasma bubble can each lift cold clouds; do not prepaint either route's results |
| Outer remnant and last crossing | `c-ch9`, `c-ch10`, `c-end` | Surviving cluster and locally cold material sit in broad diffuse surroundings; actual lane stars make the last crossing; ending currently inherits its scene |

Changing receivers are separate transparent assets, composed with the scene first. Backgrounds must remain valid if they retire. For example, the giant's `b-ch3` fixed art cannot be painted permanently into that entry scene before the giant is made, and `b-ch4` cannot leave a second ringless planet behind after transformation. A fixed surviving star or cloud should not also appear as an equally prominent decorative copy behind itself.

For `b-ch5`, use a quiet common stellar-field ground with one open fixed early gas-and-dust band at `b-exposed-disk`, and separate clear working space for the movable moon-world and fast stones in the later impact episode. There is no fixed host in this chapter. This is a view across one system's history, not a literal single-time panorama. Do not paint the later result, a duplicate star, future outflow, late moon-world inside the early disk, or rings that imply all these events happened together. The chapter introduction supplies the time relationship; inspect the actual entry composition to establish whether the separation is understandable.

Optional discoveries also stay out of permanent backgrounds: rebuilt grain clumps, an exposed differentiated core, the dusty circumplanetary intermediate, fresh scars on the outer moon, ring spray and the plasma bubble are not guaranteed earlier facts. In `c-ch7`, the shared lifted-cloud result must fit either the hot-cavity or plasma-bubble route without showing an uncreated bubble. The catalogue records these branch constraints beside the actual authored goals and recipes; it does not claim an exhaustive runtime optionality proof.

## Recommended pilot

Produce the following **12 circular material icons** in each of the three directions. Keep exact order for comparison and extraction:

| Cell | Identity | Reason to include |
|---|---|---|
| 1 | `a-old-stream` | Orange star among separated neighbors |
| 2 | `bent-old-stream` | Same star survives a different arrangement |
| 3 | `a-lane-cloud` | Opaque gas recognizable against space |
| 4 | `a-collided-lane` | Crowding without premature stars; later fixed counterpart |
| 5 | `young-system` | Single actual host, broad dusty disk and later fixed counterpart |
| 6 | `b-moon-world` | Small moon and rocky-world identity at phone size |
| 7 | `ringed-giant` | Rings distinct from dusty disk, planet remains recognizable |
| 8 | `c-cold-halo-clouds` | Dense cold population with readable separate clumps |
| 9 | `c-shocked-jet-cloud` | Hot shredded material, not a new cluster or mere recolor |
| 10 | `c-accretion-disk` | Bright external flow and dark central region |
| 11 | `c-fast-jet` | Thin material stream with correct external origin |
| 12 | `b-rubble-pile` | Unique solid body whose recognizable shape must later survive ejection |

Alongside the circles, make **five open receiver studies**: `a-stellar-outskirts`, `a-collided-lane`, `young-system`, `c-central-black-hole`, and `c-inner-polar-space`. These test the presentation contract and dual identities; they are not extra collectible things or filler cells.

Make **two entry scenes per direction**:

1. **`a-ch1`: first crossing.** Two inclined spiral regions approach, forked dark lane on one side, sparse stellar outskirts as the actual open target. Reserve a quiet central/lower work area. Do not paint bent stream, compressed lane, bridge or stretched tail. Exercise the real tutorial by dragging the old-star stream onto the outskirts. Other still-text supplies can remain in an isolated scratch preview until the selected direction receives full icon coverage.
2. **`c-ch6`: existing dark centre.** External gas approaches a dark receiving region; polar surroundings are open. No completed bright disk or jet in the entry painting. Use the real accretion and jet operations in a scratch preview after the cold-cloud input is supplied. Also inspect the same scene after results appear to ensure a bright disk is not visually mistaken for the black hole itself.

The first comparison is **36 circular icons, 15 receiver studies and 6 scene paintings**, not a commission for all 157 identities. A 4 × 3 atlas is suitable for each 12-circle style pilot with generous transparent gutters. The five receivers need separate open studies because their scene scale differs. If a generator cannot maintain 12 subjects distinctly, split into two exact six-subject sheets; never add unrelated fillers. The proposed directions and pilot subjects are unchanged; this catalogue refresh does not modify the separately prepared [pilot prompts](pilot-prompts.json).

This pilot samples a causal crossing and an external-emission scene. It cannot validate the whole planetary sequence, late population ageing, actual cold-cloud survival or outer flyby distance. After choosing a direction, the next family proofs should cover (a) the entire giant → ring transformation, (b) actual path cloud → shocked cloud → hot cavity and both routes to cold cloudlets → lifted → falling, (c) moon-bearing world → same world after stone impacts → same world after icy impacts, including the two-time `b-ch5` scene and final open fixed world-and-moon appearance, (d) rubble body → distant body → unbound body with the passer at the correct scale, and (e) the required disk export → cold cloud → central stars alongside the age-adjusted returning material.

## Production and acceptance gates

Treat catalogue families as related comparison sets. Its atlas proposals specify every occupied cell's exact identity, physical subject and distinction; empty cells remain transparent. Small families can be generated together only if their own anchor references remain explicit. Do not spend an atlas slot on a decorative comet, spiral, unrelated planet or future cut item.

Begin with a **320 × 320 runtime PNG** for an ordinary circular item, yielding **80 CSS px** at the 390 × 844 reference frame. Compare at 64, 80 and 96 CSS px before adopting a final size; larger pivotal circles remain a proposal, not a new UX rule. Keep meaningful material within the circular field and leave a modest transparent outer margin. Atlas master size must leave at least the target crop resolution per cell, with gutters outside crops. Record actual bounds and inspect extracted files, because a full sheet cannot establish crop quality.

Receiver export dimensions follow authored scene scale, not the portable 80px target. Plan their centers, common source canvas and any independent receiving rectangle only after scene composition. All final assets follow the specification's four-times-display sizing. Reuse the same registered source where camera and state match; otherwise commission the chapter-specific variant recorded in the catalogue. Do not mutate recipe logic, item identities or supply declarations while adding metadata.

Run separate checks with fresh reviewers and retain concise outcomes according to the [icon guide](../../../docs/icon-guide.md#6-run-separate-recognition-and-art-direction-reviews) and [verification retention rule](../../../docs/engineering.md#verification-records):

| Check | Evidence needed before expansion |
|---|---|
| Recognition | First unaided material-family reading, then ordinary names/context for unresolved cases. Record cold-gas/empty-space, planet/disk, stars/emitting-gas and receiver/portable confusions separately. Do not claim exact provenance or orbital binding should be visible alone |
| Art direction | Like-sized comparison against the chosen mark-making and anchor family; no uncontrolled glow, surface noise or palette drift |
| Continuity | Side-by-side lifecycle comparison across both fixed and portable forms; age-appropriate stellar populations; same surviving moon, giant and rubble body where required |
| Science | External black-hole emission; no cold/hot inference from false-color hue alone; no giant duplicated in system icon; correct flyby scale; no Earth ocean or inevitable life; no rigid centuries-long gas cloud contours |
| Entry and interaction | Background alone, legal entry state, busy state and completed state in actual browser; real tutorial and nuclear gestures; receiver highlighting, name wrapping, minimum touch region, narrow crops, transformation cleanup and reload |

Reject or revise a candidate if it requires a false visual distinction to explain the game, if it spoils a result in the entry scene, or if a recurring body's identity is lost. An attractive picture does not offset those failures. A successful AI recognition exercise does not establish human speed, usability on native touch devices or enjoyment.

Refresh the parser-derived counts, source hash, recipe links, atlas memberships and entry briefs after the text settles. Then generate and review the pilot, select a direction with the user-facing comparison, extend related families and only afterward integrate complete metadata. Keep temporary generation attempts, comparison composites and browser captures in ignored `runs/`; retain requested contact sheets, selected sources, exact requests, extraction/registration data and final runtime assets in this active project. No full production or release is implied by this plan.
