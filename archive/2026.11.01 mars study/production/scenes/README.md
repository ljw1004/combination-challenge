# Mars scene artwork

The scene package contains 27 backgrounds and 24 transparent hotspot regions. Thirteen paintings were revised with the built-in ImageGen tool; fourteen existing paintings were retained and framed for the same 390 × 844 scene. The adopted workflow is in the [icon guide](../../../../docs/icon-guide.md); story metadata follows the [format specification](../../../../docs/story-format-spec.md).

The landscape supplies the visible hotspot artwork. Fixed shelves, receiving foundations, geological exposures and service interfaces give each target a physical role. Broad quiet ground or flooring leaves room for the larger rover and assembled equipment icons. The established cream industrial structures, weathered metal and warm Mars terrain are retained, with restrained teal, blue and mustard fittings informed by the [selected equipment reference](../../inspiration/02-multiple-accents.png).

## Artwork and registration

[scene-manifest.json](../scene-manifest.json) records every chapter background, its selected source, the previous background, and each hotspot's physical feature and hit area. Coordinates are percentages of the final framed image; widths and heights are display pixels at 390 × 844. All hotspot PNGs are fully transparent and four times their intended display dimensions.

Selected revised PNG masters live here. [originals/](originals/) preserves all 27 earlier background files, formerly shipped directly from `stories/mars/assets/`. [scene-requests.json](scene-requests.json) contains eleven edit requests and their original Mars background filenames, now found in that source directory. These used the original background as the edit target; the first nine also supplied the selected equipment reference. The other two requests retained their original landscape as the sole input. [thermal-test-bay.prompt.txt](thermal-test-bay.prompt.txt), [habitat-entrance.prompt.txt](habitat-entrance.prompt.txt), and [habitat-entrance-mast.prompt.txt](habitat-entrance-mast.prompt.txt) record the remaining work and entrance refinement. The final entrance places the mast directly on the receiving platform's service foundation, making their connection explicit.

Revised scenes provide a reachable contact ledge, germination shelf, empty weather-station foundation, fixed freight sled, thermal chamber, nursery shelf, accessible layered bank, distinct ripple and conglomerate exposures, depot marker line, oxygen service interface and cabin test pad. Stranded-crawler and depot backgrounds remove painted vehicles that would duplicate movable icons. The entrance is composed around a connected signal platform and melt vessel. Other scenes already supplied suitable physical features and working space.

## Export

With Pillow available, run from the repository root:

```sh
runs/mars-artwork/.venv/bin/python 'projects/mars-study/production/scenes/export-scenes.py'
```

The script uses the manifest's sources, crops them with centered horizontal and top vertical alignment, and exports 780 × 1688 WebP backgrounds to `stories/mars/assets/expedition/backgrounds/`. It also writes the transparent hit regions to `stories/mars/assets/expedition/hotspots/`. It does not draw or alter the paintings. Retained source paths refer to the archived original backgrounds; preserve those files for repeatable export.

## Verification outcome

All 27 framed backgrounds and 24 registered regions were inspected at their 390 × 844 display framing. Mechanical checks found the expected dimensions, fully transparent region pixels, existing source files, exact coverage of the manuscript's hotspot names, no intersecting regions within a chapter, and all target rectangles inside the centered 320-pixel crop. Contact-sheet overlays and detailed check output were disposable scratch under `runs/mars-artwork/scenes/`.

This is source-aware artwork review, not a blind recognition or player-enjoyment result. Browser interaction and final movable-item placement are checked with the integrated story.
