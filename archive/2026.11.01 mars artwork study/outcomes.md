# Mars artwork outcomes

Completed 1 November 2026 for **Mars: A Light That Answers**. The user commissioned the complete collection, with physically informed relative sizes and landscape-integrated hotspots. The [design brief](../../stories/mars/design-brief.md) owns the adopted direction; [production](production/README.md) retains the source paintings, exact requests, catalogue and registration.

## Delivered collection

All 317 item identities have transparent artwork: 291 ordinary icons from 19 related atlases, plus 13 compound bases and 13 related construction/vehicle states. The 35 fitted overlays share their bases' dimensions and registration. Standalone visible longest edges are nominally 60–230px at the reference viewport; rover and crawler bodies span 220px. Natural aspect ratios and compressed physical scale keep small fittings usable while giving machines substantial visual weight.

All 27 illustrated chapters have framed backgrounds. Thirteen scenes were revised; fourteen existing paintings were retained and reframed. Their 24 transparent targets register with painted ledges, service interfaces, shelves, geological exposures and other physical features. Revisions made receiving surfaces accessible, connected the refuge signal mast to its platform, and removed painted vehicles that would duplicate movable equipment. The concluding text-only chapter remains the story's ending.

Cream housings, metal, rubber and modest wear link the collection; teal shelter/repair, mustard mobility and cobalt science accents distinguish equipment families. Information remains tangible as samples, photographs, maps, instrument traces and comparison boards. New paintings used the built-in image-generation tool. Original inspiration material is preserved separately from generated production sources.

## Review decisions

Informed review checked delivered icons at playing size on light, dark and warm grounds, compound compositions and registered scenes. Corrections addressed greenhouse fittings hiding plants, a detached capsule mount, antenna-family mismatch, cargo-case continuity, clipped exhaust and stray crop fragments. Repeated radio/panel components were resized consistently. Torn shelter and greenhouse states were redrawn from their repaired counterparts. The logger's arbitrary numeric display became a qualitative trace; orbital diagrams now show a meeting around one Mars; the family record preserves the established crew supper portrait.

A fresh agent reviewed 24 shuffled unnamed pilot objects. Broad equipment families generally read clearly. Ordinary chapter context clarified the sample labels, core photograph, entrance patch and signal light. The fabric roll's exact repair/insulation role remained ambiguous, and dry versus watered trays could not be reliably assigned. These are sheet-recognition findings with neighboring clues, not a timed comparison with text.

A second fresh agent reviewed 16 later records and related objects. Photographs, geology boards, specimen containers, a star chart, spectrum traces and the group portrait communicated their physical families. Context clarified navigation, spectroscopy, portrait archiving and the growing scene. Exact findings, mineral identity, provenance and causal conclusions were not recoverable from the pictures alone; the existing names and readings supply those meanings. The trays still failed the dry/wet distinction after the first moisture repair.

The final tray correction made dry substrate visibly pale and matte and removed condensation from the unwatered covered tray. A separate repeat-exposure check then distinguished all four states: light/dark substrate and clear/condensed cover. That supports the repair decision; first-use human recognition remains unmeasured. Ordinary context is still needed to interpret moisture and the fabric roll's specific role. Human phone trials remain in the [backlog](../../projects/backlog.md#icon-recognition-awaiting-human-trials).

## Verification

- Artwork coverage, transparency, physical-size bounds, all 35 fitted canvas registrations, 27 scene framings and 24 target regions passed. All 192 fitting subsets composed; complete and meaningful partial assemblies received informed visual inspection.
- Manuscript integration preserves parsed item identities, recipe inputs/results/fates, slots, exclusions, readings, goals, tutorial and primitive chapter supplies. It adds visual metadata and an explicit declaration for the already-existing `sediment-comparison` identity. Integration is idempotent.
- The integrated browser pass checked all 27 illustrated chapters at 390 × 844 and 320 × 740, plus actual radio repair, solar-power construction, landscape placement, Rover construction and three fittings, and reload persistence. Its 57 checks found no missing artwork, page errors, off-board items, horizontal overflow or item/target overlaps. Revised record canvases also passed an affected-chapter follow-up. Representative scenes were inspected visually.
- All 166 unit tests passed. The Chromium suite initially passed 131 of 132 checks; an editor-scroll assertion at `tests/editor.spec.ts:618` failed, then passed on a focused rerun. No test expectation or interaction rule was changed for this artwork project. This is an intermittent observed failure, not an established fix.
- The final production build passed story lint, TypeScript checking and bundling, with existing author-review and bundle-size warnings. Archive relocation preserved every source file before updating navigation and source metadata.

The [review instructions](review-instructions.md) and retained production tools describe repeatable checks. These results concern artwork, logical preservation and browser behavior. They do not establish scientific reproducibility, fresh-player enjoyment, recognition speed or native-device touch behavior. Detailed review answers, screenshots, checkpoints and logs were disposable under `runs/mars-artwork/` and were discarded after recording these outcomes.
