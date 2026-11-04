# Emergency field and flight source handoff

4 November 2026, austerity revision. Built-in imagegen production; exact executed requests and references are retained under `prompts/austere-*.json`. This handoff supplies source paintings and proposed extraction geometry. Shared layout and manuscript were not edited by this production task.

| Selected source in `sources/` | Grid, row-major | Meanings |
| --- | --- | --- |
| `austere-gas-canisters-r2.png` | 4 × 2 | C1–C4 H₂, O₂, CO₂, CH₄ horizontal Iron canisters; V1–V4 plain gray fittings |
| `austere-transfer-canisters.png` | 2 × 1 | T1 oxygen canister + dedicated hose; T2 methane canister + dedicated hose |
| `austere-lander-support.png` | 2 × 2 | S1 rock; S2 blocking/footer + rock; S3 empty gap; S4 plain Iron support |
| `austere-gully-axis-ice-r2.png` | 3 × 1 | G1 terrain; G2 unused intermediate; G3 registered winch/sling and arrived rover |
| `austere-flight-gas-transfer-r2.png` | 2 × 2 | F1 empty; F2 oxygen left; F3 methane right; F4 both connected |
| `austere-ascent-above-base.png` | 1 × 1 | A1 ascending cabin; lower frame/support remain on Mars |

[Candidate layout JSON](emergency-field-flight-layout.json) contains zero-based cells, proposed masks, hose strokes, bounds, portable mapping and source hashes. These are integration starting points; final extraction, registration and phone/browser checks belong to the parent pipeline.

The approved canister lineage is `austere-canister-pilot.png`: horizontal round-ended matte Iron body, weld seam, one small gray lever valve, direct handwritten gas label. No handle, gauge, brass, plaque, foot ring or fabricated cradle. Empty/full canisters intentionally share an opaque appearance. Installed bodies can reverse end orientation while keeping lettering readable. Each transfer hose correctly joins the bottle's **single valve**; the opposite end is closed. Found stones and shallow ground hollows restrain bottles. F1 has neither bottles nor hoses. Oxygen is left; methane is right. Port centers are approximately [.333, .408] and [.647, .408]; proposed fitting bounds [.01, .375, .43, .96] and [.58, .375, .99, .96].

The gully ice receiver remains [.37, .025, .998, .55], with its target centered on ice and the late rover at its lower edge. Use **G3/cell 2 for both installed winch/sling and late rover silhouettes**. Exclude rover/working line from the winch mask. G2 still has a small generated winch displacement and is deliberately unused; extracting actual appearances from G3 locks equipment geometry. The anchor uses a narrow flat webbing sling. Remaining line stays on the drum; there is no unexplained loose coil. The rover remains on rough ground along the direct pull axis.

The support is a short thick Iron tube with a simple saddle and welded foot, without machined adjustment collars or jack mechanism. The blocking/empty-gap sequence remains. The finale uses the simplified cave entrance from `austere-cave-footprint.png`, with warm window and no exterior baffle/apron, plus the simple ceramic receiver from `austere-furnace-stages.png`. The original habitat, single array and air apparatus remain recognizable.

Informed author inspection checked the sources and 290px-cell proofs. Canister lineage, support-state differences, single-valve hose routing and airborne-cabin/grounded-frame separation are readable. This is not a blind recognition trial or browser integration verification. Dimensions, alpha and JSON parsing were checked. Canister atlas borders are transparent. Transfer-icon source has a few alpha-1 pixels at the far left edge, outside actual objects; bounded extraction excludes them.

- [Canister family contact sheet](contact-sheets/austere-canister-family.jpg): C1–C4, V1–V4, T1–T2.
- [Field/flight contact sheet](contact-sheets/austere-field-flight.jpg): S1–S4, G1–G3, F1–F4, A1.

Earlier `emergency-*` art described by this handoff is superseded. Initial austerity atlas/fueling/gully sources are superseded by the selected `-r2` files: first atlas clipped a valve, first fueling attached hoses to sealed ends, first gully displaced the winch and duplicated a rock. Requests remain provenance; do not integrate older versions by filename similarity.
