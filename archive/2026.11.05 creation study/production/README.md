# Creation artwork production

The artwork was made with the built-in `image_gen` image tool. The Python helpers only extract, resize, mask and encode selected paintings; they do not generate or repaint content. [The icon guide](../../../docs/icon-guide.md) owns the production/review method and [the specification](../../../docs/story-format-spec.md) owns runtime presentation.

`visual-catalogue.json` records all 206 meanings, physical subjects, distinctions and recognition expectations. Its pre-art source hash and recipe line numbers describe the authoring snapshot, not the illustrated manuscript. `visual-catalogue-index.tsv` is its readable index. These are author specifications, not independent review verdicts.

## Retained sources and selection

[requests/](requests/) preserves the exact generation requests; [masters/](masters/) preserves selected source paintings, including atlases whose other cells were superseded. `atlas-plan.json` selects icon cells in row-major order. The **last available non-null occurrence of each identity wins before extraction**. Null cells produce nothing. Use `--complete` for a reproducible final export: it requires every planned master and all 206 identities.

The pilot, `pilot-repairs-02` and `tracks-03` establish the initial family and track/cave repairs. `icons-01` through `icons-10` supply the rest. The final overrides are `early-repairs-01` (nine identities), `middle-repairs-02` (six) and `late-repairs-03` (five, with an empty sixth cell). Consult the plan for the exact winning cells rather than exporting an entire old atlas as current artwork.

`background-plan.json` owns chapter/background mapping, cover and thumbnail geometry, exact source bounds, dimensions and hashes. The background selection includes six three-column atlases, the three-state coast atlas, the standalone final portrait and `vent-world-deep`. The old third cell of `backgrounds-02` is explicitly superseded; its first two cells remain selected. The standalone vent repair uses the exact retained input [inputs/vent-world-before.webp](inputs/vent-world-before.webp).

Historical absolute paths inside requests are provenance and remain unchanged. Their repository prefix was `/Users/ljw/code/combination-challenge/`. Resolve referenced images against the following retained files when using a request again:

| Historical path after that prefix | Retained location relative to this directory |
|---|---|
| `runs/creation-art/pilot-01.png` | `masters/pilot-01.png` |
| `runs/creation-art/pilot-repairs-02.png` | `masters/pilot-repairs-02.png` |
| `runs/creation-art/coast-sequence-01.png` | `masters/coast-sequence-01.png` |
| `runs/creation-art/icons-01.png` | `masters/icons-01.png` |
| `runs/creation-art/icons-02.png` | `masters/icons-02.png` |
| `runs/creation-art/icons-04.png` | `masters/icons-04.png` |
| `runs/creation-art/icons-05.png` | `masters/icons-05.png` |
| `runs/creation-art/icons-06.png` | `masters/icons-06.png` |
| `runs/creation-art/icons-08.png` | `masters/icons-08.png` |
| `runs/creation-art/icons-09.png` | `masters/icons-09.png` |
| `runs/creation-art/backgrounds-05.png` | `masters/backgrounds-05.png` |
| `runs/creation-art/backgrounds-06.png` | `masters/backgrounds-06.png` |
| `projects/creation-study/production/masters/pilot-01.png` | `masters/pilot-01.png` |
| `projects/creation-study/production/masters/pilot-repairs-02.png` | `masters/pilot-repairs-02.png` |
| `projects/creation-study/production/masters/coast-sequence-01.png` | `masters/coast-sequence-01.png` |
| `projects/creation-study/production/inputs/vent-world-before.webp` | `inputs/vent-world-before.webp` |

All 16 distinct historical reference paths were checked against their retained copies by SHA-256 before cleanup. No referenced input was missing. Resolve these paths in the new tool call; do not rewrite the historical request files. Repeating a generative request is not guaranteed to reproduce its selected painting; the retained masters make mechanical export reproducible.

## Export and read-only checks

Run commands from the repository root with Node.js 22.18 or later and `uv` with Pillow. Set the helper directory for its current location:

```sh
creation_production="archive/2026.11.05 creation study/production"
# During the completed development run this was:
# creation_production="projects/creation-study/production"
```

Helpers locate the repository by its `package.json` and shared parser. They prefer `stories/creation/creation.md` and its adjacent assets after promotion, otherwise the manuscript/assets beside the active study. An explicit output path overrides an export destination. `--dry-run` performs reads only: no files, proof directories, cache or plan are written.

```sh
node "$creation_production/validate-visual-catalogue.mjs"
uv run --with pillow python -B "$creation_production/export-atlases.py" --complete --dry-run
uv run --with pillow python -B "$creation_production/export-backgrounds.py" --dry-run
uv run --with pillow python -B "$creation_production/make-review-sheets.py" --dry-run
```

For a deliberate re-export:

```sh
uv run --with pillow python -B "$creation_production/export-atlases.py" --complete --output runs/creation-art/exports
uv run --with pillow python -B "$creation_production/export-backgrounds.py"
```

The icon exporter defaults to scratch output; its dry run defaults to the resolved runtime icons. Copy only the inspected `.webp` files from scratch into the story's `assets/icons/`, never `extraction.json`. The background exporter writes the resolved runtime `assets/backgrounds/` and updates its production geometry record; use `--output` for another destination. Both use retained `masters/` by default.

Icon **export version 3** finds each winning circle's opaque span within its own grid cell, using a narrow averaged alpha band and bridging only small gaps. Explicit plan bounds take precedence. It crops, resizes with LANCZOS and multiplies the original alpha by a four-times antialiased circular mask, then writes WebP quality 94/method 4. The cache checks winning master, source SHA-256, bounds, export version and every output's SHA-256. Matching filenames or modification times alone never authorize reuse. `selected-extraction.json` is the retained selection/hash record; an output-directory `extraction.json` takes precedence as a working cache. Dry runs report any missing or mismatched outputs without repairing them.

Background export splits exact equal logical cells, including fractional boundaries when source widths are not divisible by three. Each cell is centre-cropped to 780:1688 and uniformly resized with LANCZOS; nothing is stretched. WebP uses quality 92/method 4. The final `world-continues` portrait supplies both cover and ending. Its upper 780×780 region becomes the 256px square catalogue thumbnail, referenced through an ordinary preamble Markdown image; the cover uses `background:` metadata.

| Runtime files | Count | File dimensions | Presentation at the 390×844 reference viewport |
|---|---:|---|---|
| Ordinary circular icons | 206 | 256×256 | 64×64 |
| Chapter-local `fixed-*` circular icons | 12 | 384×384 | 96×96, used in 17 fixed appearances |
| Backgrounds, including cover/ending portrait | 22 | 780×1688 | 390×844 scene |
| Catalogue thumbnail | 1 | 256×256 | Intrinsic 256px square, constrained by the catalogue card |

## Verification scope and disposable proofs

`verify-art-integration.mjs` compares the shared parser's prose, identities, combinations, goals, supplies, references and tutorials against an **explicitly supplied** pre-art manuscript. It also checks the presentation paths and initial fixed coordinates. The expected baseline SHA-256 is `c4ff6efebe2229d8e273d5109420a985b0c1b8d3540a5775f95cf0a78816a2c4`; the image-only ending background intentionally clears inherited fixed presentation.

```sh
node "$creation_production/verify-art-integration.mjs" /path/to/disposable/creation-before-art.md
```

That baseline is disposable verification input. The helper has no implicit `runs/` dependency, and retaining this guide does not require preserving or reconstructing the baseline after cleanup. Catalogue/source checks remain usable without it. Verification of a later content revision needs an appropriate new comparison, not a weakened assertion against this snapshot.

`make-review-sheets.py` creates named 64px proofs and two shuffled 24-token samples, with separate prospective answer keys and image bindings. Its output must stay under repository `runs/`; these sheets, keys and bindings are disposable review inputs, not committed evidence. Keep answer keys away from blind reviewers. Use `--output runs/...` for another scratch destination and remove output after recording concise outcomes.

Final model artwork reviews and browser checks passed with documented small-size ambiguities. These helpers establish structural coverage, export integrity and the stated comparison scopes; they do not establish human recognition, preference, learning or enjoyment. Context-assisted pictures still depend on ordinary names and chapter context. The project summary owns review outcomes and remaining evidence limits; this directory owns reproducible production inputs and mechanics.
