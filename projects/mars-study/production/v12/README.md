# Mars v12 artwork production

**Accepted reference:** the [survival artwork package](survival/README.md) supplied the 24-chapter revision promoted into `stories/mars`. Its [verification](emergency-revision/README.md) records that version's scoped passes and remaining deep-analysis limit. Future work follows the [current production entry point](../README.md#current-production-entry-point) and [live brief](../../../../stories/mars/design-brief.md); the v12 manuscript and artwork are preserved unchanged. The retained export tools require deliberate adaptation before use with the live copy.

The [previous survival checks](survival/verification.md), [material artwork](materials/README.md), [fixed-item migration](fixed-items/README.md) and initial illustrated pass below describe earlier versions. Their counts, passes, equivalence checks and manuscript-rewriting commands do not verify subsequent work. The [v12 brief](../../mars-v12/design-brief.md) records its historical intent; the [icon guide](../../../../docs/icon-guide.md) owns current reusable graphics methods.

The initial illustrated pass had 171 default item icons, four chapter-dependent appearances, four registered panel overlays, 31 backgrounds used across 36 chapters and 44 painted landscape targets. Fourteen physically suitable earlier icons were reused; the other item depictions were new. All 254 referenced bitmaps lived beside v12, without a runtime dependency on another version's artwork directory. The following records describe that historical pass.

## Initial source and export records (historical)

- [Catalogue](catalogue.json): every item and appearance, physical size, intended depiction, nearest ambiguity, recipe context, provenance and manufacturing boundary. Locally made parts use plain cut/folded stock and accessible joints; precision machinery remains imported.
- [Atlas groups](atlas-groups.json): exact row-major subject order. `atlases/` retains selected generated masters, exact `.prompt.txt` requests and ordered `.inputs.json` references. Superseded generations and temporary input crops have been removed; the reference paths record the original calls. All painting and painted-content corrections used the built-in image-generation tool.
- [Source overrides](source-overrides.json): selected targeted repairs. Otherwise each catalogue entry's `source.filename` selects its master, falling back to the atlas ID. [Extraction](extraction.json) records actual source bounds, final dimensions and intended visible scale.
- [Panel registration](assembly-manifest.json): the generated base remains unchanged while four generated lenses illuminate its existing control indicators. Its symbol/switch positions persist in all sixteen slot combinations. These are operating states, not machinery put inside a cabinet.
- [Scene production](scenes/README.md) and [manifest](scene-manifest.json): selected paintings, framing and physical target geometry. The early scene plan is superseded by the selected manifest.

Every icon is extracted without repainting its alpha and fitted to the catalogue's visible size at four-times resolution. Padding is rounded to whole reference pixels. Scene exports are 780 × 1688 WebPs. Fully transparent hotspot PNGs define interactive areas over the actual painted features.

## Initial selected revisions (historical)

The first construction sheet was simplified after reviewing what one astronaut could make: plain bolted angle-stock replaced manufactured furniture fittings, and the berth became a low platform. The subsequent readability sheet exposed disconnected drain stubs, a common return and its fall into an open reservoir, and clearer under-deck insulation.

Selected process, heat and food sheets are `08-…-r2`, `09-…-r2` and `10-…-r2`; their superseded initial generations have been removed. These corrections seal operating retorts, preserve existing vessel/receiver boundaries, retain cooker jackets and avoid adding the potato collar before its construction.

`12-continuity-repairs` supplies the shared drain junction, root medium in all zones, simply lined opaque lettuce basins, the loaded case's existing insulation, and separate propellant ports with electrical control leads. The final screened farm comes from `12-screened-farm-return`: the original crop zones, tall dark collar, soybean trellis, strip lights, filled common reservoir and single aerating return remain visible. `06-membrane-repair` keeps the original body on its white filter membrane inside its separate flight holder. Earlier sheets are superseded only for the identities listed in the override file.

Scene sources 15/16 align the same open reservoir and mature potato collar across planting, storm and harvest. Other scene repairs retain the actual electrolysis equipment, eliminate premature constructions, and place the flight membrane locker on the departing upper cabin. The scene README records selected versus superseded panels without treating the ongoing Mars study as complete.

## Reproduce the initial pass (historical)

From the repository root:

```sh
uv venv runs/mars-v12/.venv
uv pip install --python runs/mars-v12/.venv/bin/python pillow numpy scipy
runs/mars-v12/.venv/bin/python projects/mars-study/production/v12/tools/export-items.py
runs/mars-v12/.venv/bin/python projects/mars-study/production/v12/tools/export-panel.py
runs/mars-v12/.venv/bin/python projects/mars-study/production/v12/scenes/export-scenes.py
node projects/mars-study/production/v12/tools/integrate-artwork.mjs
node projects/mars-study/production/v12/tools/verify-artwork.mjs
npm run lint -- projects/mars-study/mars-v12/mars.md
```

`export-items.py` optionally accepts atlas IDs and `--proofs`; proofs are temporary under `runs/`. `integrate-artwork.mjs --dry-run` writes only a scratch preview. The integration is idempotent and checks prose preservation and gameplay equivalence. `verify-artwork.mjs` checks asset coverage, decoding, scale, alpha, registration and all chapter checkpoints through the shared engine. Use `--skip-checkpoints` only for subsequent image-only repairs.

Two previously plain-name crop identities receive stable backtick IDs (`soybean-row`, `lettuce-tray`) because chapter-dependent artwork requires them. The explicit alias map in `tools/story-semantics.mjs` proves equivalence to v11; names, supplies, recipes, fates, goals, exclusions, slot/reading conditions and chapter order remain unchanged. V11 and its saves are untouched.

Independent review and integrated browser outcomes are linked from the [v12 README](../../mars-v12/README.md). Those are scoped AI visual and implementation checks, not a new human preference study or validated engineering design. Detailed answers, captures, action traces and proof sheets are disposable; source art, prompts and authoring geometry are retained.
