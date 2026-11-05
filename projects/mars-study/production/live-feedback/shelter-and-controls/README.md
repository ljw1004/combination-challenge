# Shelter before ceramics and compact controls

4 November 2026. Applies the user's shelter-order and austerity corrections to the live [Mars story](../../../../../stories/mars/mars.md). The [brief](../../../../../stories/mars/design-brief.md) owns current intent.

Earth is now Chapter 4, before Fire in Chapter 5. Shovelling prepares the tent footprint; the folded insulated hab rests directly on it, then receives air and lights. There is no brick-pad item, step or visible base. The later ceramic berth and crop beds remain. The existing cave-family exporter removes the independent pad layer from all three tent states; a narrow generated contact patch removes a brick lip embedded in the collapsed tent itself.

Chapter 14 uses the whole water cell as the H₂ receiver after its first fill. After the second fill, the O₂ receiver covers the right half and takes priority there. This changes only authored hitbox geometry. Chapter 15 carries a clear pale CH₄ on the main converter body throughout fitting. Chapter 16 has a compact backing plate around its two existing selectors, with the unused right extension removed.

## Selected material and reproduction

The three exact built-in imagegen requests are [collapsed hem](collapsed-hem.request.json), [compact panel](compact-panel.request.json) and [CH₄ lettering](ch4-label.request.json). Selected masters are in `sources/`; `references/` retains the necessary exact edit inputs. Rejected candidates and review proofs remain disposable scratch, not production assets.

[export-controls.py](export-controls.py) registers generated pixels through the masks and placements in [geometry.json](geometry.json). It creates the collapsed-contact mask, restores wall where the redundant panel extension was, and extracts only the pale generated lettering onto the original reactor. Neither working selector nor reactor hardware is repainted. The cave [layout](../cave-furnace-layout.json) places the hem patch after the collapsed-tent layer; all original scene centres and canvases remain fixed.

From the repository root, with Pillow and NumPy:

```sh
python projects/mars-study/production/live-feedback/shelter-and-controls/export-controls.py
python projects/mars-study/production/live-feedback/tools/export-cave-furnace.py \
  --output runs/mars-shelter-export \
  --proofs runs/mars-shelter-proofs
```

Promote only the three `earth-*-growing-room.png` tent states from that cave export when reproducing this revision. The controls exporter writes the current `storm-controls/amber-noon.webp` and `fuel/reactor-base.png` runtime files. Earlier storm/fuel exporters describe their preceding artwork and would overwrite these refinements; this exporter owns the replacements. The cave exporter now accepts an explicit source size for the registered contact patch, retaining uniform scaling as its default.

A separate audit inspected 72 unique assets across seven cave-related chapters and later exterior appearances. Only the three shelter states needed pad removal; later masonry belongs to the retained berth and beds. The closing exterior has no exposed brick course. [The consolidated review](../../../art-review/2026.11.04_21.21.20/report.md) records current browser and technical outcomes and their limits.
