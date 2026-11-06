# Cosmic artwork packaging

These tools transform existing raster artwork through browser canvas. They copy rectangles, resize uniformly, add transparent padding and assemble comparison sheets. They do not paint subjects, change colour/alpha, apply circular masks or choose a production style. The [icon guide](../../../../docs/icon-guide.md#5-produce-reviewable-artwork) owns extraction and review guidance.

## Circular atlases

With no arguments, rebuild the selected production circles into `projects/cosmic-study/assets/lights-that-remain/icons/` using the production manifest. The defaults resolve from the script, so they also work outside the repository root:

```sh
node projects/cosmic-study/artwork/tools/extract-atlas.mjs
node projects/cosmic-study/artwork/tools/extract-atlas.mjs --help
```

Provide another manifest and optionally a separate output directory for a future batch or scratch check:

```sh
node projects/cosmic-study/artwork/tools/extract-atlas.mjs path/to/manifest.json runs/atlas-check
```

Use [the production circle manifest](../production/portable-extraction-manifest.json) as the complete schema example. Source paths are relative to the manifest. Every atlas specifies its source SHA-256 and exact dimensions, independent positive `columns` and `rows`, and a row-major `cells` list of exactly `columns × rows` entries. Every occupied entry has an exact identity; a blank cell is `null` and must pass `blankMaxAlpha` (normally zero). No filler image is inferred for a blank cell. A custom manifest's default output is its own directory; provide an explicit scratch output for experiments and remove or redirect its `recordFile` as well.

A minimal shape is shown below; substitute the actual source, hash, dimensions and inspected crop bounds. `selected: false` marks occupied but unselected art, while `null` asserts a blank source cell.

```json
{
  "schemaVersion": 1,
  "output": { "size": 320, "padding": 8, "flat": true },
  "alphaValidation": { "boundaryMaxAlpha": 8, "blankMaxAlpha": 0 },
  "comparison": { "sizes": [], "columns": 3, "background": "#f3f1eb" },
  "atlases": [{
    "id": "example", "anonymousLabel": "A",
    "sourceFile": "../masters/example.png", "sourceSha256": "REPLACE_WITH_ACTUAL_SHA256",
    "width": 1200, "height": 400, "columns": 3, "rows": 1,
    "cells": [{ "id": "selected", "rect": [0, 0, 400, 400] }, { "id": "unused", "selected": false }, null]
  }]
}
```

An occupied entry may give an explicit integer source `rect: [x, y, width, height]`. Otherwise the grid boundaries are calculated with rounded fractions of the declared dimensions, allowing unequal pixel widths when the source dimensions are not divisible by the grid. Measured `columnBoundaries` and `rowBoundaries` can override those cuts; each array must contain strictly increasing integer coordinates from zero to the full source extent, with one more entry than columns or rows. Explicit rectangles must stay inside their grid cell. Rectangles may be nonsquare: the largest dimension fits the available export area and the other receives equal transparent padding. The image retains its original aspect ratio. Inspect each future atlas before accepting inferred grid coordinates.

`output.size` sets a square PNG canvas; alternatively use `output.width` and `output.height` for rectangular exports. `output.padding` reserves pixels on all sides. `alphaValidation.boundaryMaxAlpha` is a rejection threshold for source crop edges, not an alpha-editing operation. An occupied cell also requires visible content and some completely transparent pixels. Every output must have a completely transparent outside edge. Source alpha bounds are measured at 1, 16 and 128 without modifying any pixels. Very faint source wisps are retained, including those that reach cell edges.

The extractor isolates the source rectangle on a separate native-size canvas before resizing, so interpolation cannot sample a neighboring cell. Every run writes fresh exports, then builds sheets from those exact exports. The extraction record includes source/crop/output geometry, source and output SHA-256 values, script and manifest hashes, Chromium version and alpha measurements. A source hash mismatch fails instead of silently rebuilding from changed art. Reproducibility is checked within the recorded Chromium environment; different browser versions may encode or resample differently. An atlas may override alpha validation only after inspecting its actual geometry: production batches 08–11 use measured gutters, and 09/11 allow recorded faint source-edge wisps. Receiver batch 01's unused cell permits alpha 1/255 residue; no blank cell is exported. These thresholds never edit alpha.

Comparison sizes are literal pixel bounds on the PNG, independent of a viewer's zoom. Anonymous style letters and cell numbers sit outside the images. The sheets support visual comparison; they do not establish recognition speed, scientific correctness, gameplay behaviour or a chosen style.

## Scene panels

```sh
node projects/cosmic-study/artwork/tools/package-scene-pilots.mjs path/to/scene-manifest.json runs/scene-check
```

The scene manifest lists `sources` with `id`, anonymous `label`, `file`, `sha256`, `width`, `height` and `panels`. Each panel has `id`, `status`, integer `rect` and optional `overlays` entries (`file`, `x`, `y`, `size`, measured in the 390 × 844 comparison panel). An overlay's `size` or `width` sets its display width; height follows the image's original aspect. An optional `label` is placed below its image. Paths resolve against the manifest. Panels are isolated, uniformly scaled to cover a 780 × 1688 canvas and aligned at the top; the record preserves any excess width/height. Composition sheets display the resulting panels at exactly 390 × 844 with the named existing icons overlaid. They are layout studies, not legal game states or browser interaction evidence.

Use ignored `runs/` for unselected/rejected scene panels and verification output. Promote selected art and exact extraction metadata only when it becomes a deliberate deliverable; the [retention policy](../../../../docs/engineering.md#verification-records) owns that distinction.

## Production updates

The [production records](../production/) select cells and sources independently of the root-owned subject and generation plans. `selected: false` skips a nonselected occupied source cell; it is different from a genuinely blank `null` cell. `output.flat: true` writes final identities directly under `icons/` and refuses duplicate selected filenames. `recordFile` keeps extraction metadata beside its manifest while PNGs go to the runtime directory. Scene panels can supply `outputFile`; `comparison: false` prevents review sheets from entering runtime assets.

After inspecting a new circular master, stage root-recorded batches and export the selected files:

```sh
node projects/cosmic-study/artwork/tools/stage-generated-circles.mjs
node projects/cosmic-study/artwork/tools/extract-atlas.mjs projects/cosmic-study/artwork/production/portable-extraction-manifest.json projects/cosmic-study/assets/lights-that-remain
```

Staging reads the exact grid/order from `production-batches.json`, records generation references and copies new full sources to hash-qualified master filenames. It refuses a changed source selection for an existing batch: select replacement cells explicitly and preserve any earlier master on which another selected cell still depends. Default circular filenames use the identity; chapter variants use `<identity>--from-<chapter-id>.png`.

Export selected scene panels and the accepted receiver geometry:

```sh
node projects/cosmic-study/artwork/tools/package-scene-pilots.mjs projects/cosmic-study/artwork/production/background-extraction-manifest.json projects/cosmic-study/assets/lights-that-remain/backgrounds
node projects/cosmic-study/artwork/tools/package-receivers.mjs projects/cosmic-study/artwork/production/receiver-extraction-manifest.json projects/cosmic-study/assets/lights-that-remain/hotspots
```

The receiver packager reuses the atlas extractor in disposable scratch, then reproduces the tested processing sequence: 512 × 380 crop export, uniform 640 × 475 rendering centred vertically on 640 × 480, and that canvas placed at `(0,96)` on transparent 640 × 672. Both intermediate PNG decodes are intentional: the three tested pilot files and four selected receiver repairs carry expected final hashes, and any mismatch fails. No intermediate PNGs are retained. New receiver sources follow the same recorded sequence; this does not by itself approve their physical subjects or scene placement.

Verify all final files and rebuild scratch review sheets:

```sh
node projects/cosmic-study/artwork/tools/catalogue-assets.mjs --check
node projects/cosmic-study/artwork/tools/build-review-sheets.mjs
```

The asset catalogue rejects output/source hash changes, wrong dimensions, duplicate outputs and unrecorded runtime images. `--check` verifies without rewriting the reviewed manifest; omit it after deliberate production changes to rebuild `production/asset-manifest.json` from extraction records. The catalogue joins selected source, crop, transform and final file information, including coverage against the subject plan. Review sheets use those exact exports at 80 px for circles, 160 × 168 for padded receivers and 390 × 844 for scenes. They belong to ignored `runs/cosmic-production-review/` and are disposable verification aids.

For the deliberately retained [authoring references](../contact-sheets/README.md), build one sheet per kind instead of per master:

```sh
node projects/cosmic-study/artwork/tools/build-review-sheets.mjs --compact
```

This writes three sheets under `artwork/contact-sheets/`: all 145 circles at 80 px, all 21 receivers at 160 × 168 px and all 13 background thumbnails at 195 × 422 px. Their `sheets.json` records exact source/output hashes and image bounds. The separately retained [three-style pilot comparison](../pilots/README.md) is a historical design reference; its trial export pipeline has been removed. Preserve original request paths as provenance and consult [reference-inputs.json](../reference-inputs.json) for the identical retained production inputs.

## Manuscript integration

```sh
node projects/cosmic-study/artwork/tools/integrate-story-art.mjs --stage
node projects/cosmic-study/artwork/tools/integrate-story-art.mjs --apply
node projects/cosmic-study/artwork/tools/integrate-story-art.mjs --check
```

`--stage` prepares metadata and scene registration under ignored `runs/cosmic-art-integration/`, leaving the manuscript unchanged. `--apply` requires the recorded pre-art manuscript and complete final inventory: 141 portable defaults, four later appearances, 21 receiver images and 13 backgrounds. It compares the shared parser's story structure before and after integration, checks fast/image lint, decodes every final PNG and verifies its dimensions and recorded hash before atomically replacing the manuscript. Existing descriptions precede the new item metadata so indented prose retains its reading semantics. The ending inherits its previous scene, and the first scene supplies the existing cover fallback.

`--check` verifies the delivered manuscript against [scene registration](../scene-registration.json), the semantic fingerprint and the final asset inventory. These are author implementation checks; independent artwork review and actual browser interactions remain separate checks under the [icon guide](../../../../docs/icon-guide.md#9-verify-the-playable-result-and-retain-the-work). Source/crop transforms remain in the production records, while scene registration owns chapter mapping and receiver centres.
