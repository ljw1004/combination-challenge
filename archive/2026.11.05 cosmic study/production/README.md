# Cosmic artwork production

The original artwork was designed against the accepted 193-recipe, 244-item text. Detailed-playtest corrections brought the delivered story to **198 recipes and 245 items**: five recipes were added and one existing recipe was revised. Light release, inherited cold ice, sea recharge and fractured-headland erosion use existing art. The alternate Earth-accretion order adds the `hydrated-embryo` icon and two recipes, allowing hydrogen-bearing rock to arrive before metal-rich fragments. The [revision-two catalogue supplement](catalogue-addendum-v2.json) records these changes; the original catalogue and text-lock retain their planning identity.

Production and selection are complete: **245 circular icons and 16 portrait backgrounds**. The [selected asset manifest](selected-assets.json) maps every runtime file to its retained source, request, extraction record and SHA-256 hashes, including all fourteen replacements of original atlas cells and the additional hydrated-embryo icon. The runtime artwork is retained in [the unreleased story's assets](../../../projects/cosmic-study/assets/); intent lives in its [design brief](../../../projects/cosmic-study/design-brief.md).

This record follows the [icon workflow](../../../docs/icon-guide.md). All illustration generation used the built-in image tool exclusively. Mechanical processing cropped, masked, resampled and encoded that raster artwork; it also assembled a necessary shore reference. Model identifiers and per-generation timestamps were not recorded and are not inferred. Scientific, recognition and art-direction review verdicts are recorded separately in the study.

## Retained production material

The [manifest](selected-assets.json) is the complete file index and final selection authority. Its `assets` array contains exactly 261 runtime mappings; `sources` indexes all 44 retained source/reference PNGs with hashes and reference dependencies; `supporting_records` indexes every retained request and extraction file. Paths in these arrays are relative to this production directory, except the explicitly repository-relative live `runtime` paths. References marked `selected-runtime-asset` use existing final assets through their selected IDs and hashes.

| Material | Retained path and purpose |
|---|---|
| Meaning, atlas and chapter plan | [catalogue.json](catalogue.json), [backgrounds-plan.json](backgrounds-plan.json), [story-lock.json](story-lock.json). These retain their original planning status and manuscript identity. |
| Later catalogue changes | [catalogue-addendum-v2.json](catalogue-addendum-v2.json) adds the hydrated-embryo identity and records the five recipe additions and one replacement, against a separately hashed manuscript revision. |
| Original generated atlases | [masters/](masters/), `atlas-01.png` through `atlas-16.png`; exact request records in [requests/](requests/), `atlas-01.json` through `atlas-16.json`; measured crops in `atlas-01-extraction.json` through `atlas-16-extraction.json`. 230 original cells remain selected. |
| Shore replacements | `masters/shore-dry-v2.png`, `shore-sea-v2.png`, `shore-reflection-v2.png`; matching request JSONs; [shore-extraction.json](shore-extraction.json). These supply `rock-hollows`, `early-sea` and `moon-reflection`. |
| Tidal-pool replacement | `masters/tidal-pools-anchor.png`; exact pilot prompt [pilot-v1.txt](requests/pilot-v1.txt); [pilot-reference-extraction.json](pilot-reference-extraction.json). The runtime re-encodes the retained 288px pilot crop with identical RGBA pixels. |
| Stellar-force replacements | `masters/stellar-forces-v2.png`, [request](requests/stellar-forces-v2.json), [crops](stellar-forces-v2-extraction.json): three icons. |
| Inner-disk replacements | `masters/inner-disk-v2.png`, [request](requests/inner-disk-v2.json), [crops](inner-disk-v2-extraction.json): two icons. The recorded wider integer crops preserve the generated ivory perimeter and source alpha. |
| Planet-process replacements | `masters/planet-processes-v2.png`, [request](requests/planet-processes-v2.json), [crops](planet-processes-v2-extraction.json): two icons. |
| Lunar-diagram replacements | `masters/lunar-diagrams-v2.png`, [request](requests/lunar-diagrams-v2.json), [crops](lunar-diagrams-v2-extraction.json): three icons. |
| Additional hydrated-embryo icon | `masters/hydrated-embryo-v1.png`, [request](requests/hydrated-embryo-v1.json), [crop](hydrated-embryo-v1-extraction.json). The complete 1254px source canvas is resized with its original alpha to preserve the generated rim. Its references are the existing final `metal-bearing-earth`, `proto-earth` and `water-rich-asteroids` icons; the manifest resolves them without duplicate reference copies. |
| Backgrounds | `masters/background-01.png` through `background-16.png` and matching [request JSONs](requests/). [Space extraction](background-extraction-space.json) contains thirteen selections and their actual sent `tool_arguments`; [coast extraction](background-extraction-coast.json) contains 13, 14 and 16. |
| Necessary reference inputs | `masters/pilot-v1.png` with [its prompt](requests/pilot-v1.txt); `masters/tidal-pools-anchor.png`; `masters/pale-moon-reference.png`, used by background 16; and `masters/shore-anchor-v2.png`, the four-image reference used by atlases 13–16. Exact pilot crop records are retained in [pilot-reference-extraction.json](pilot-reference-extraction.json). The shore composite's exact assembly command was not retained; its input bytes are preserved by hash. |

## Portable paths and mechanical replay

Original requests and extraction records remain unchanged, including historical paths and early statuses such as “planned” or “awaiting generation.” Resolve their `projects/cosmic-study/production/` prefix, also when embedded in an old absolute path, against this directory. The manifest explicitly maps the necessary historical scratch references:

| Historical reference | Retained input |
|---|---|
| `runs/cosmic/art/pilot-v1.png` | `masters/pilot-v1.png` |
| `runs/cosmic/art/pilot-icons/tidal-pools.png` | `masters/tidal-pools-anchor.png` |
| `runs/cosmic/art/pilot-icons/pale-moon.png` | `masters/pale-moon-reference.png` |

The thirteen space backgrounds' actual sent arguments in `background-extraction-space.json` take precedence over their earlier request plans. Its original generated-image cache paths and rejected-candidate paths are historical provenance; the selected source bytes are retained in `masters/`. Required generation references resolve to retained production inputs or existing selected runtime assets. The hydrated-embryo request's historical `projects/cosmic-study/assets/icons/` references again resolve at that path after the story returned to development; their bytes are also mechanically reproducible from retained sources. The added pilot reference record preserves the two necessary original extraction entries without retaining the disposable pilot test run.

[export-selected.py](export-selected.py) verifies retained record/source hashes and current runtime coverage, hashes, dimensions and modes. With `--output`, it replays recorded bounds directly, without circle detection or generation. Run from the repository root after archival:

```sh
uv run --with pillow==13.0.0 python "archive/2026.11.05 cosmic study/production/export-selected.py" --verify-assets projects/cosmic-study/assets
uv run --with pillow==13.0.0 python "archive/2026.11.05 cosmic study/production/export-selected.py" --output runs/cosmic/production-replay
```

Use an empty scratch output directory. All 245 PNG icons and thirteen WebP backgrounds reproduced byte-for-byte with Pillow 13.0.0 and libwebp 1.6.0. **Coast backgrounds 13, 14 and 16 have nominal replay only:** their original record preserves the analytical crop and WebP quality/method, but the exact resampling/encoding sequence could not be recovered. The tool identifies these three separately and emits a LANCZOS reconstruction from the recorded floating bounds. Keep their selected runtime originals for publication. Future encoder versions may also change file bytes.

Verification outcome: every original or supplemental catalogue item and planned background has exactly one selected runtime mapping; all 261 runtime/source mappings, final file hashes, sizes and modes passed. Replay matched 258 final files exactly, including the added hydrated-embryo icon; the three coast limits above remain explicit. No artwork was changed during provenance completion. Verification output is disposable under `runs/cosmic/`, following [the retention policy](../../../docs/engineering.md#verification-records).

## Selected direction

Astronomical chromolithograph with chalk and gouache-like marks: feathered ivory light, dark indigo and blue-green fields, amber heat, copper and charcoal rock, teal water. Dense texture is confined to subjects; surrounding space stays quiet. Simplified silhouettes and meaningful arrangements take precedence over tiny decorative details. Circular inventory medallions have one thin pale rim and transparent exterior. The illustrated field makes processes and material samples equally usable as symbolic tokens without pretending they share a physical scale.

Concrete reference research: the [Huntington’s Trouvelot collection](https://www.huntington.org/digital-classroom-resources/trouvelots-astronomical-drawings), specifically *The great nebula in Orion* and *Total eclipse of the sun*, inspected as full images. The useful qualities are the feathered luminous edge, irregular swept rays, subtle grain across broad dark masses, and a bright focal area surrounded by substantial negative space. These are references for technique and atmosphere, not scientific depictions of the story’s early universe or early Moon. No historical image is shipped as game art. Local reference downloads remain disposable research scratch.

## Recognition contract

At 72px, the image should identify a family and distinguish nearby changes of shape, arrangement, phase or structure. Normal item names and readings identify exact chemical species, invisible conditions and scientific mechanisms. Broad cloud recognition is not exact gas identification; a pale globe does not independently communicate its geologic age. Do not invent visible colours as a claim that chemistry has been observed.

Runtime icons use 288px square RGBA exports, quarter-scale in the player. All use the story’s circular metadata. Atlas extraction is a mechanical crop/resample/mask operation, recorded with bounds. Source art and exact requests remain beside this record; trial sheets and browser captures are disposable under `runs/`.

## Continuity invariants

Earth is one recurring world. Its hot states use a dark basalt skin and orange silicate melt; an interior view is clearly a cutaway, not another planet. Theia is a smaller impactor. The early Moon cools from orange melt to a pale feldspathic crust without modern dark maria. No familiar continents or life appear.

The final coast has a blunt, stepped basalt headland on the left, a low ridge inland to the right, and a sheltered basin between them. Later water states retain those landforms and the same viewing direction. Backgrounds establish conditions at chapter entry, leaving creations to the icons; the completed moonlit sea belongs to the ending and cover. The centre and lower middle remain quiet enough for movable tokens. No decorative inventory-like isolated objects, labels, grid lines, machinery or observers.
