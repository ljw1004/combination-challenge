# Elements waterworks — isolated author candidate

## Decision, after challenging the finding

Keep ordinary assembly compressed. The game need not name each fixing, bearing, seal, mounting or woodworking operation. Existing wood, saw and carving-tool context makes substantial fabrication reasonable, and wooden pumps certainly exist. The predecessor is **not physically impossible** merely because it leaves parts implicit.

The narrower source problem survives that challenge: the actual Wheel is a smooth solid disc, Hollow pipe is an open wooden conduit, and Pump is a generic mechanism whose moving parts need power. The inputs and displayed result do not select a recognizable lifting principle. Treating the pair as an ordinary piston, screw, vane or spiral pump requires the reviewer to choose that apparatus. The later Waterwheel gives rotation, not that missing choice. This is a forward-intelligibility judgment, not a requirement to simulate all engineering details or a human comprehension result.

The original independent Phase A and Phase B finding remains unchanged. This author candidate does not retrospectively change its classification, confidence, diagnostic history or other cases.

## Bounded alternative

**Waterwheel + Glazed clay jar → Waterwheel with jars.** Replace two generic pump operations with one direct-lift assembly. Open, fired ceramic jars on the existing paddled wheel scoop and raise water, then tip it into the reservoir. Fixing and positioning are normal assembly, not new tasks. No premade equipment, valves, fasteners, piston recipes, stock, places or hidden third operand are added.

FAO’s *Water lifting devices*, §3.4.1, describes a water-driven noria carrying containers around the wheel rim and discharging into a receiving trough. This supports the chosen direct-lift principle, not particular game dimensions or performance: <https://www.fao.org/4/ah810e/AH810E05.htm>.

The alternative keeps a meaningful purpose: lift stream water above the beds; store it in the existing basin; feed it through the existing channel; irrigate the existing climbing garden. The basin’s optional description clarifies its position; the player still sees the same familiar Reservoir and Filled reservoir labels. The chapter text no longer suggests that a channel alone goes uphill.

Other possibilities were considered, not implemented. Merely renaming Pump as Piston pump would leave the smooth-wheel-to-piston choice unexplained and make an ordinary Wheel a peculiar first choice. A spiral pump would require a different coiled/flexible passage than this authored wooden conduit. Deleting the lift in favour of gravity feed would undo the actual uphill-water purpose. None is ruled out in general; this candidate is a simpler local choice, subject to independent review.

## Actual pre-existing ceramic lineage and identity

- `bowl`: Clay + Wheel produces **Formed clay bowl**, explicitly dried/unfired and suitable for dry forming, not water service.
- `jar`: Clay + that forming bowl produces **Clay jar**, with a broad mouth.
- `glazed-bottle`: Jar + Glaze produces **Glazed clay jar**. Despite the historical internal ID, its current label and definition are ceramic, not transparent glass. The definition says the same jar has been coated and fired; its broad mouth and body remain. The existing recipe compresses coating, firing and cooling. This candidate does not claim an additional kiln event was observed.
- Existing `covered-urn`, `fill-water-bottle` and `pour-bowl-into-bottle` lifecycle reasons already explicitly describe a pottery supply of multiple ceramic vessels for cider, float and water service. The candidate uses that established resource abstraction; it does not duplicate one unique jar.
- The new recipe transforms the existing Waterwheel when no other unfinished independent wheel use needs the shared woodworking supply. Fired jars are incorporated, while an outside ceramic supply remains for outstanding water service. The wheel subsequently remains usable when filling the basin. These are declared event-local lifecycles, not later cleanup.

## Complete affected consumer closure

Removed: `pump`, `water-pump` items and recipes. Added: `water-lifting-wheel` item/recipe. Changed existing recipe: `filled-reservoir` now takes Reservoir + Waterwheel with jars. Descriptions changed only for Reservoir and Filled reservoir. The waterworks motivation/entry and successor cue IDs are updated.

Unchanged: Hollow pipe still supplies Water channel and Water filter; Waterwheel still supplies Mill gearing; the ceramic supply still serves Cider bottle, Float, Covered urn and both water-jar filling alternatives. Reservoir → Filled reservoir → Irrigation channel → Irrigated garden still satisfies the exact same goal. All downstream chapter goals, places, art, stock, milestones and skip policies remain unchanged. Stone hammer and Telescope recipes/items are untouched.

Every checkpoint is rewritten from its actual old prefix: remove Wheel + Hollow pipe, replace Pump + Waterwheel with Waterwheel + Glazed clay jar, and redirect Reservoir + Water pump to the new lift. Canonical route: **224 → 223 actions**, thirty chapters unchanged.

## Evidence and limits

The candidate is unregistered, with new identity `elements-waterworks-v9`, in `ui/stories/elements-waterworks-v1.ts`. All 2,411 baseline-manifest entries plus the original manifest remain byte-identical. The baseline seal is `7629a2f122270c3b08a19a24e6251ae63f2f0178639b7576258b15ae003a4395`. No shared runtime, catalogue, remote repository or public surface was edited.

Focused tests cover complete logical forward/combine/reverse-drop routes at 375/320/390 widths; normal highlights and local carry; all downstream goals; lifecycle/goal/construction graphs; token bounds; v2 JSON, legacy JSON and CCSP1 saves; Undo and duplicate suppression; two waterwheel routes; cover-first and fill-first ceramic service; wheel-first, reservoir-first and two randomized local preparation orders; earned complete/partial re-entry; and actual synthetic controller pointer handlers, reload/Undo and automatic handoff.

Canonical waterworks arrival/peak remains **9 / 14**, as in v8. The carried smooth Wheel is replaced by the relevant existing Glazed clay jar. Tested local alternative orders and synthetic controller orders also peak at 14. This is **not** a strict ten-item-cap pass or a density improvement claim. No deletion, automatic shelving or stock grant is used to reduce clutter.

The focused report is not a full aggregate/build pass, browser/native touch test, artwork inspection, measured understanding, enjoyment result or physical engineering certification. Independent review and serialized full-suite/build verification remain mandatory before registration/publication. This candidate does not validate unrelated inherited abstractions. The original independent reports and their source receipts are preserved verbatim alongside the author evidence.
