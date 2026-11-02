# Export Cook’s Pen drawings

Add `--preview` to render into ignored scratch space without changing installed files or saved authoring geometry.

From the repository root, run `node projects/cookbook-study/cookbook/production/tools/export-items.mjs --batch=01-grain-and-everyday-tools` for a changed ordinary batch, or omit `--batch` for the whole set. `--force` remeasures source contours. This exporter writes the installed item/slot PNGs and authoring geometry, so review the diff and the game afterward.

`framing.mjs` and `renderer.html` crop the intact transparent raster through native SVG. `framing-overrides.json` supplies purposeful contour corrections; `source-overrides.json` maps repaired subjects. Keep display sizes from the catalogue and the current UX contract. A trolley fitting is a small registered cargo layer, not a standalone icon.

All generated inspection sheets and trolley combinations go to ignored `runs/cookbook-verification/`; they are disposable after recording the result. Historical coloured apparatus and old page grounds are outside this exporter. Use the page/station builder for current backgrounds.
