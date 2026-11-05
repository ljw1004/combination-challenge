# Compact four-sample return rack

4 November 2026. Selected artwork for the user's request that Chapter 22 receive either sample through the entire four-place compartment, with purely side-on specimens and minimal padding and spacing. This replaces the larger molded holders and visible cut-end perspective in [the previous core package](../core-readability/README.md). The original mission supplied this rack; it is not equipment fabricated on Mars.

## Selected artwork and provenance

- [Cabin master](cabin-compact-rack.png), generated with the built-in image tool using [the exact rack request](rack.request.json). The new rack has four close positions in a 2 × 2 arrangement, thin padding, simple teal restraints and a thin shared perimeter. Two lower positions remain empty.
- [Side-on core master](side-on-cores.png), with pale local ice, its close foil/felt wrapping and brown-banded remote ice. All are horizontal longitudinal profiles with **no visible circular end face**. The same images supply portable and installed appearances.
- [Initial request](cores.request.json) produced the necessary [proportion reference](references/initial-profile.png). The [exact refinement request](cores-refined.request.json) shortened the overly slender cylinders without changing their diameter, camera or materials. At generation time that request's input path `side-on-cores.png` held the initial image; its byte-identical reference is now retained under `references/initial-profile.png`. The selected replacement occupies `side-on-cores.png`.

[export.py](export.py) cleans disconnected alpha specks, crops and uniformly sizes the core family, composites the selected rear wall into the original cabin and extracts its foreground straps over the installed specimens. The cabin floor, chair, peripheral equipment and ceiling remain original pixels outside the recorded rear-wall mask. It exports the actual game assets under `stories/mars/assets/live-feedback/compact-sample-rack/`; [geometry.json](geometry.json) records all source bounds, masks and placements.

## Integration contract

The compartment is one fixed compound receiver. Its transparent base (`sample-rack-target.png`) and both independent fitted overlays (`stowed-source-core.png`, `stowed-remote-core.png`) share a **792 × 268** runtime canvas, displayed at **198 × 67**, with centre **(47.56410256%, 21.80094787%)**. The scene is `the-things-we-take.webp`. Do not assign separate target centres to the two specimens.

The upper left position accepts the local insulated specimen; the upper right accepts the brown-banded remote specimen. Either order works visually, and each overlay leaves all other positions unchanged. The lower two slots are empty scenery, not extra goals. The portable files are `cut-source-core.png`, `insulated-source-core.png` and `remote-ice-core.png`, each **384 × 128**, displayed at **96 × 32**. Use these profiles throughout collection, wrapping, investigation and flight storage.

Producer inspection covered the empty rack, each sample alone and both samples installed; the family was also viewed against the laboratory background at 390 × 844. This establishes source registration, not independent recognition or browser interaction. Disposable proofs are in `runs/mars-compact-sample-rack/`. The integrating parent owns fresh review, chapter changes and the playable interaction checks.

Integration and independent browser review are complete; see the [consolidated outcome](../../../art-review/2026.11.04_21.21.20/report.md). The single compound accepts either original core first, including drops over the lower empty places.
