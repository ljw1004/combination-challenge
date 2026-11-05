# Mars production sources

## Current production entry point

The live [Mars design brief](../../../stories/mars/design-brief.md) owns accepted intent for all work in this study. Use its [applicable techniques and revision checks](../../../stories/mars/design-brief.md#revision-and-artwork-requirements), the shared [iteration process](../../../docs/story-authoring.md#develop-a-story) and [graphics methods](../../../docs/icon-guide.md).

| Role | Location and use |
|---|---|
| Editable manuscript and runtime assets | `stories/mars/mars.md` and `stories/mars/assets/`. Future integrated changes target these paths. |
| Accepted physical and visual intent | `stories/mars/design-brief.md`, also governing study iterations. |
| Preserved story references | `projects/mars-study/mars-v12/` and `illustrated-baseline/`; do not export into or rewrite them. |
| Current live revision | [Chapter feedback, selected art and checks](live-feedback/README.md), including the two-fill water cell. |
| Selected production inputs | The [v12 survival package](v12/survival/README.md) supplies the accepted source family, registration, exact requests and catalogue. The [v12 index](v12/README.md) distinguishes its earlier passes. |
| Disposable work | Ignored `runs/` subdirectories for trial generations, rejected candidates, crops, scene/lifecycle proofs and browser captures. |

The retained tools predate promotion. Several survival exporters and integrators hard-code `projects/mars-study/mars-v12`; earlier tools target the old illustrated story at `stories/mars`. Neither is a ready-to-run current production command. Before adapting a tool, inspect its actual source and destination paths, select only the changed family, stage outputs under `runs/`, and verify the intended live target and unchanged reference. A new documentation link does not retarget code. Do not run historical manuscript migrations on the live story.

Keep selected masters, exact requests, necessary reference inputs and authoring geometry here under the [retention policy](../../../docs/engineering.md#verification-records). Finished game assets belong beside their manuscript; use them directly instead of retaining redundant production copies. Reuse existing artwork for review panels where possible. New experimental generations stay in `runs/` until selected; the resulting concise decision belongs with the project.

## Earlier illustrated production records

The files and commands below describe the earlier illustrated story. They retain its original target paths and assumptions, not current regeneration instructions. Superseded generations and unused cutout experiments have been removed. Retained requests record original inputs, some of which were superseded or temporary and are no longer stored; selected masters remain available as production sources.

- `subjects.tsv` is the authored physical catalogue: one row per story identity, desired longest visible edge at the reference viewport, depiction and nearest ambiguity. `catalogue.json` adds parsed item identities, declaration sites, creating/using recipes, ownership and runtime paths.
- `atlas-groups.json` records exact row-major extraction order. `atlases/` keeps the generated transparent sheets and their exact prompts. The first five sheets were generated while the complete catalogue was being prepared; their recorded prompts define their fixed order.
- `extraction.json` records source bounds and output dimensions for standalone icons. Connected alpha regions assign complete silhouettes to their atlas cells, rather than slicing legs or antennas at rigid grid boundaries. Original generated alpha is retained.
- `assemblies/` keeps bases, fitted-part sources, registration and compound exports. Its manifest owns fitted geometry; the story preserves the original declaration order for slot layering.
- `scenes/` and `scene-manifest.json` keep scene sources and registered landscape targets. Transparent hotspot PNGs define interaction geometry over painted scenery.
- `repairs/` retains exact revision requests, ordered input images and corrected source sheets. Selected corrections are registered in `source-overrides.json`. These address preparation states, shelter identity, instrument/diagram content and the archived crew photograph.

All new paintings used the built-in image-generation tool. Cropping, resizing and registration are deterministic operations. These tools were checked against the application on 1 November 2026; review their assumptions before regenerating a later manuscript. Run from the repository root. The isolated Python environment lives in ignored scratch space:

```sh
uv venv runs/mars-artwork/.venv
uv pip install --python runs/mars-artwork/.venv/bin/python pillow numpy scipy
MARS_ART_SOURCE='projects/mars-study/production'
node "$MARS_ART_SOURCE/tools/build-catalogue.mjs"
runs/mars-artwork/.venv/bin/python "$MARS_ART_SOURCE/tools/export-atlases.py"
```

Pass atlas IDs to export only selected sources. Add `--proofs` to create temporary contact sheets on light, dark and ochre grounds at the intended display size. They are verification output under `runs/mars-artwork/` and are discarded after review. The generated source sheets, exact prompts, catalogue and registration information are retained production deliverables.

`source-overrides.json` preserves targeted repairs across re-exports. Its `items` object maps exact catalogue IDs to a repository-relative `source` path, with an optional `crop` array of left, top, right and bottom source pixels. A shared repair sheet can instead specify `"grid": { "columns": 2, "rows": 2, "cell": 1 }`, using one-based row-major cells and the same alpha-aware extraction. Recorded component-detection settings separate faint bridges between neighboring objects while preserving the original edge alpha. Without a crop or grid, the complete visible alpha is fitted to the catalogue's physical size. The extraction record identifies the repaired source; select the item's original atlas ID to re-export it.

When faint alpha connects separate source objects, a grid can specify `componentThreshold` to identify their solid silhouettes separately. This changes region ownership only; exported edge alpha retains its original values. The record-repair sheet uses 60 to separate the adjacent diagram and portrait. A crop can also be combined with a grid, in full source coordinates, to remove excess faint canvas after neighboring objects have been separated.

After ordinary icons, compound assets and scene exports all exist:

```sh
node "$MARS_ART_SOURCE/tools/integrate-artwork.mjs"
runs/mars-artwork/.venv/bin/python "$MARS_ART_SOURCE/tools/verify-artwork.py"
npm run lint -- mars
```

Integration adds artwork metadata and the one explicit Items declaration required for the already-existing `sediment-comparison` identity. Before writing, it compares parsed identities, recipes, slots, readings, goals, tutorial and primitive chapter supplies, excluding presentation and source locations. Scene changes and image metadata do not alter gameplay semantics. The full build and browser checks remain governed by [engineering](../../../docs/engineering.md).

With `npm run dev` serving locally, run `node "$MARS_ART_SOURCE/tools/verify-browser.mjs"`. Set `MARS_REVIEW_URL` for a different local origin; add `--captures` only when visual inspection needs temporary screenshots. Reports always go to ignored `runs/mars-artwork/`. See the [icon guide](../../../docs/icon-guide.md#9-verify-the-playable-result-and-retain-the-work) for the review method and the [November 1 review report](../art-review/2026.11.01_22.36.52/report.md) for the recorded scope and outcomes.
