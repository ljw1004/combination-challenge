# Mars v12 material artwork

This records the preceding material artwork pass for [Mars v12](../../../mars-v12/mars.md), now a source library for the current [survival artwork pipeline](../survival/README.md). Its counts and verification below describe the earlier revision. The [design brief](../../../mars-v12/design-brief.md) owns current intent; the [icon guide](../../../../../docs/icon-guide.md) owns the reusable method. Do not run historical manuscript migrations over the current story.

## Selected artwork

Nineteen generated masters supply 16 chapter backgrounds, 64 registered fixed appearances, nine portable icons and two independent propellant-hose overlays. Unchanged artwork is reused. All runtime bitmap references live beside the manuscript; no placeholder remains. The last catalogue refresh contains 224 identities and 280 distinct bitmap references, after the concurrent removal of the unfired-blank preparation step.

- [Physical briefs](subject-briefs.json) describe the changed families and the distinctions each picture must carry.
- [Catalogue](catalogue.json) covers current identities, their chapter declarations, recipes, appearances and provenance. Names and relationships come from the shared story parser; refresh it after manuscript edits.
- `sources/` retains only selected masters. `prompts/` retains their exact executed imagegen requests, including original reference paths. Superseded paintings and temporary reference crops have been discarded; those paths document the original calls, not retained dependencies for export.
- [Layout](tools/layout.py) selects source cells and authors extraction outlines, holes, hose strokes, opaque replacement regions and portable display dimensions. [Registration](registration.json) records actual transforms, bounds, dimensions and scene coordinates. These are authoring geometry, not verification dumps.
- [Artwork metadata](artwork.json) is generated. [Reuse metadata](reuse-artwork.json) preserves the preceding artwork selection for unchanged objects; it contains no story rules or prose.

All painting and painted-content corrections used built-in imagegen. Independent requests ran concurrently in batches; dependent repairs followed inspection of their source. Export tools only register, mask, crop, resize and composite generated pixels. Source alpha is preserved for portable silhouettes. Quiet foreground extensions use existing painted ground. Fixed objects are extracted from their actual scenes; tightly registered opaque regions erase an earlier painted state only where necessary. Compound overlays share the base canvas exactly.

The selected revisions show a broad rock bearing beneath the damaged lander, solid ceramic berth/bed supports, a dry basin before watering, three descending crop drains, a separate freshwater feed, a genuinely raised potato collar, and completed farm protection retained at harvest. The press has rollers; the electric refining furnace remains separate from the solar retort. The retort moves into the previously built bolted frame. Ground preparation, ceramic footing, steel brace and controlled load transfer remain distinct lander states.

## Reproduce

From the repository root, using an ignored environment with Pillow, NumPy and OpenCV:

```sh
runs/mars-v12-fixed/.venv/bin/python projects/mars-study/production/v12/materials/tools/export.py
node projects/mars-study/production/v12/materials/tools/integrate.mjs
node projects/mars-study/production/v12/materials/tools/catalogue.mjs
```

Wait for export before integration. Stable chapter IDs restrict image repairs, for example `export.py ch10 ch11 ch12`; IDs are not necessarily current play positions. Integration replaces only image URLs and fixed coordinates in the existing manuscript. It checks both raw text preservation outside those fields and the shared parser's complete prose/game projection. `--dry-run` writes a scratch preview. It never restores an earlier story snapshot.

For disposable visual proofs:

```sh
runs/mars-v12-fixed/.venv/bin/python projects/mars-study/production/v12/materials/tools/proof.py
node projects/mars-study/production/v12/fixed-items/tools/capture-scene-proofs.mjs
```

The second command requires the local Vite server and uses shared application artwork rendering. It reads the current manuscript without rewriting it. These are inspection tools, not legal-route tests. Their inputs, outputs and contact sheets belong under `runs/` and are removed after the outcome is recorded.

## Reviews and verification

- [Source direction](../../../art-review/2026.11.03_22.39.48/report.md): 13 source atlases; prompted collar, harvest and retort-route repairs.
- [Unaided interpretation](../../../art-review/2026.11.03_22.58.30/report.md): nine unnamed portable depictions; object families generally legible, exact material/function and powered state often uncertain.
- [Integrated artwork review](../../../art-review/2026.11.03_23.04.29/report.md): all 16 changed chapter families and nine portable icons; prompted a wider reactor crop and clearer intermediate farm feed.
- [Focused final review](../../../art-review/2026.11.03_23.19.16/report.md): corrected farm and reactor exports; no blocking defect, with minor visual crowding retained around the reactor controls and press.
- [Verification outcome](verification.md): browser route segments, narrow arrivals, alternate orders, decoding, registration and shared checks, with their limits.

These are fresh AI visual reviews and informed implementation checks. They do not establish human recognition speed, enjoyment, engineering qualification or exhaustive branch safety. Exact chemistry and some connection states rely on the game's existing names and readings; no recognition rate or contextual recovery result is claimed.
