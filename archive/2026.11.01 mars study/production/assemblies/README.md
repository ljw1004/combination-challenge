# Mars constructions and vehicle states

This package supplies 13 compound bases, 35 fitted overlays and 13 related vehicle/cabin/cargo states. Runtime PNGs live in `stories/mars/assets/expedition/items/` and `slots/`; `manifest.json` records their item identities, paths, dimensions, source crops and registration geometry. The manuscript and shared format retain ownership of the actual construction rules.

Artwork was generated with the built-in image-generation tool. Exact requests are in `prompts/`, with selected and repair-input paintings in `sources/`. The multicolour industrial study established the materials and accent families. All constructions retain cream metal, charcoal rubber, restrained wear and a modest elevated view; mobility equipment uses muted mustard, shelter fittings teal and specimen equipment cobalt.

`export.py` performs only mechanical cropping, alpha-preserving resizing, registration and composition. Its measurements use the 390×844 reference scene; final PNG dimensions are four times those measurements. Rover and crawler have 220px visible widths. Cases, electronics and stands retain their different aspect ratios. The base and every overlay use the same canvas, and fitted parts use the construction's scale rather than the standalone minimum.

Run after the ordinary directional-antenna icon has been exported:

```sh
runs/mars-artwork/.venv/bin/python 'projects/mars-study/production/assemblies/export.py'
```

The Relay overlay uses the selected loose Yagi antenna rather than the superseded dish from the component source sheet. The return capsule's mount is occluded by the capsule body, and its comparison-case fitting includes the two specimen appearances. Greenhouse fittings leave the planted trough visible inside the enclosure. The vehicle-state repair retains one recognizable specimen-case design across ground transport, the flight cradle and the ascent vehicle. A separate ascent-vehicle repair restores the complete tapered exhaust.

The repair requests used mechanical source crops: the specimen-case reference comes from `compound-bases-01.png` at `(972,456,1408,887)` followed by alpha trimming; the ascent reference comes from `vehicle-states.png` at `(1212,355,1605,793)`. These source coordinates preserve the inputs without retaining duplicate scratch images.

Verification covers alpha/canvas completeness, matching base/overlay dimensions, and construction of all 192 fitting subsets. Informed visual review checked full assemblies, all rover and return-capsule subsets, related vehicle states and the remaining smaller compound families at their intended display size. Repairs addressed the greenhouse's obscured plants, a detached capsule mount, antenna-family mismatch, cargo-case identity, a clipped exhaust and a crop fragment above the cabin shell. This is artwork/registration evidence; browser interactions and first-use human recognition require their own checks. Detailed contact sheets and review output remain disposable under `runs/mars-artwork/assemblies/`.
