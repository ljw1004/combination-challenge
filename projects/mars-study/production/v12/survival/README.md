# Mars v12 — survival artwork pipeline

This package produced the accepted 24-chapter [v12 reference](../../../mars-v12/mars.md), now copied into the editable [live story](../../../../../stories/mars/mars.md). The [live design brief](../../../../../stories/mars/design-brief.md) owns accepted intent for future work, including study iterations. The [current production entry point](../../README.md#current-production-entry-point) identifies targets and scratch storage. The [emergency revision record](../emergency-revision/README.md) records checks of the accepted version; [feedback verification](feedback-verification.md) describes the earlier 26-chapter version.

The commands below still target v12 and are preserved production implementations, not current export commands. Do not run write operations against the frozen reference. Adapt inputs and outputs deliberately for the live story and stage trial results under `runs/`; changing this README does not retarget the scripts. Read-only checks can inspect the reference but do not verify later live edits. The [v12 brief](../../../mars-v12/design-brief.md) is a historical snapshot, not an authority to copy over the live brief.

The current art uses a snug end-on cave room without exterior masonry, hand-carried water, soft cargo-net supports and plain local iron vessels on cleared ground. Small precision parts have finite original experiment/repair donors. A shared service controller moves between scheduled batches. See the [science consultation](../emergency-revision/science-metal-fuel.md) and [austerity review](../emergency-revision/austerity-review.md) for the reasoning and accepted fiction.

## Files and workflow

- [Selection](selection.json) identifies 43 current export inputs and ten retained mechanical dependencies, pilot references or representative rejected designs. `sources/` keeps these masters; `prompts/` keeps exact built-in imagegen requests and mechanical provenance. Historical requests may name superseded inputs that were removed.
- [Layout](layout.json) is the sole current cell/mask/size configuration. [Registration](registration.json) records transforms and extraction bounds; [artwork metadata](artwork.json) supplies integration. Current exports contain 24 backgrounds, 82 fixed appearances and 48 portable icons, with unchanged art reused.
- [Catalogue](catalogue.json), generated through the shared parser, covers 160 identities, 24 scenes, 97 recipes and 200 referenced runtime bitmaps. It records meanings, creation/use context and provenance.
- `tools/integrate.mjs` changes only artwork URLs and coordinates and asserts full parsed prose/game equivalence. `tools/rename-reused.mjs --dry-run` checks reuse naming without mutations.
- `tools/refresh-selection.py --prune` records current inputs and removes only unselected masters in this package and unused exports in this manuscript's `assets/survival/`. It preserves exact requests and selected mechanical dependencies.

All painting uses built-in imagegen; independent requests can run concurrently. Mechanical work only registers, masks, crops, resizes and composites generated pixels. The [fuel composite record](prompts/austere-fuel-air-composite-mechanical.json) preserves exact Air scrubber geometry across chapters. The [garden composition record](prompts/austere-garden-storm-tabs-r3-assembled.json) identifies the small generated attachment patches. Separate handoff snippets document production proposals; they do not override `layout.json`.

## Recorded v12 export commands

These describe the original pipeline, using Python with Pillow, NumPy and OpenCV. They are historical commands with v12 write targets; follow the adaptation requirement above before using their implementation for new work:

```sh
python3 projects/mars-study/production/v12/survival/tools/export.py
node projects/mars-study/production/v12/survival/tools/integrate.mjs
node projects/mars-study/production/v12/survival/tools/catalogue.mjs --write
python3 projects/mars-study/production/v12/survival/tools/refresh-selection.py
```

The exporter accepts quoted chapter titles for partial regeneration. Fire must precede Metal because their unchanged receiver geometry shares registration. Full exports refresh portable icons and discard obsolete metadata. `tools/proof.py` generates disposable playing-size scene and portable proofs under ignored `runs/mars-survival/`; all-declarations panels can contain mutually exclusive states, so legal combinations determine progression.

## Review and verification

The [current record](../emergency-revision/README.md#artwork-and-browser-outcome--4-november-2026) links final reviews and browser results. The main browser run completed all 24 chapters, decoded all 200 referenced bitmaps, and checked selected assemblies and reloads at 320px and 390px widths. Both gas-transfer orders also passed. Eighty engine branch continuations cover alternate construction orders. Full exhaustive fixed-state lint still reaches its 20,000-state bound; these witnesses do not remove that limit.

Independent reviews distinguish actual austerity, continuity and mask findings from interpretation limits. Exact gas identity and invisible fill state rely on ordinary names/readings; individual gas-service fittings need not have invented distinguishing hardware. These are AI visual judgments and emulated-browser checks, not human recognition, enjoyment or native-touch evidence. The [icon guide](../../../../../docs/icon-guide.md) owns the review method.

Earlier [cave audit](cave-hab-continuity.md), science notes, handoffs and reviews retain their dated scope. The preceding [materials](../materials/README.md) and [fixed-item](../fixed-items/README.md) passes remain source libraries; do not run historical manuscript-rewrite tools on this revision. Requested contact-sheet deliverables remain under `contact-sheets/`; verification captures and detailed output are disposable scratch.
