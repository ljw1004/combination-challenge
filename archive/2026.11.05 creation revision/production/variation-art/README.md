# Variation: pencil DNA emblem

The [active brief](../../../../stories/creation/design-brief.md) owns the visual direction; the [habitat plan](../variation-habitats.md) records recipe roles and scientific boundaries. Cookbook's pencil location outlines inform the distinction between scenery receivers and inventory icons.

The first Variation is a standard 64px circular icon: a large compact horizontal graphite helix on cream. Later appearances use a smaller unframed horizontal helix beside four painted habitats. The landscape is the receiver; ordinary hover/selection feedback supplies its boundary. DNA is modern shorthand for inherited differences, not a solved origin-of-life reconstruction or a claim that environments deliberately produce needed mutations. The island reading distinguishes inherited differences from learned song traditions.

## Sources and exports

[provenance.json](provenance.json) binds every exact generation/edit request, input relationship and source hash. The selected transparent annotation is [source.png](source.png), produced by horizontal-orientation and line-only edits. Earlier retained inputs explain that generation chain. The inventory source is [cream-icon-source.png](cream-icon-source.png), generated from the annotation with [cream-icon-request.txt](cream-icon-request.txt): a more compact helix and opaque cream ground.

The inventory icon uses the main [icon plan](../icon-plan.json) and `export-icons.py`, with its standard deterministic frame and 256×256 output at `assets/icons/variation.webp`. It remains ordinary-size, not a large milestone icon.

Run `uv run projects/creation-study/production/variation-art/export.py` to export habitat annotations. Pillow 13.0.0 fits the complete 2172×724 RGBA source into 256×85, then adds transparent vertical padding to 256×256. It preserves generated colours and alpha. The four runtime SVGs embed that identical [variation-emblem.png](variation-emblem.png) as a self-contained data URL, each in a 64×64 display box. Most of that box is transparent: the visible horizontal mark is approximately 56×13px. No enclosing circle, backing or perimeter contour is added to habitats.

[placement.json](placement.json) owns receiving rectangles and emblem positions; [exports.json](exports.json) records dimensions and every output hash.

| Scene | Receiver centre / size | Emblem centre |
| --- | --- | --- |
| c13 marine shallows |25%,39% /43%×17% |25%,39% |
| c14 woodland margin |70%,39% /45%×17% |70%,39% |
| c18 rocky coastal habitat |76%,27% /40%×18% |80%,25% |
| c22 vegetated foothills |23%,31% /34%×14% |31.5%,34% |

The coastal receiver covers actual right-hand rock rather than the sea channel. The foothill emblem sits on a lighter patch for contrast and stays visible when ice advances. Current artwork/gesture review outcomes are retained in the production integration notes; disposable captures and full reviewer responses stay under ignored `runs/`.
