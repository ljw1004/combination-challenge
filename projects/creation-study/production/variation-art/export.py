# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow==13.0.0"]
# ///
"""Mechanically export the generated pencil emblem and self-contained SVG markers."""
from pathlib import Path
import base64
import hashlib
import json

import PIL
from PIL import Image, ImageOps

HERE = Path(__file__).resolve().parent
SOURCE_SHA = "61222f6a5812685bb3eba8a93d67fd062b723edbd3759eb6c530f1df6f6e3428"
source_path = HERE / "source.png"
assert hashlib.sha256(source_path.read_bytes()).hexdigest() == SOURCE_SHA
source = Image.open(source_path)
assert source.mode == "RGBA" and source.size == (2172, 724)
outputs = []
fitted = ImageOps.contain(source, (256, 256), Image.Resampling.LANCZOS)
icon = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
padding = [(256 - fitted.width) // 2, (256 - fitted.height) // 2]
icon.paste(fitted, tuple(padding))
icon_path = HERE / "variation-emblem.png"
icon.save(icon_path)
outputs.append({
    "path": "variation-emblem.png",
    "dimensions": [256, 256],
    "reference_display_dimensions": [64, 64],
    "sha256": hashlib.sha256(icon_path.read_bytes()).hexdigest(),
})
data_url = "data:image/png;base64," + base64.b64encode(icon_path.read_bytes()).decode()
plan = json.loads((HERE / "placement.json").read_text())
for scene in plan["scenes"]:
    width, height = scene["svg_display_dimensions"]
    size = scene["emblem_display_size"]
    x = width / 2 + (scene["emblem_centre_percent"][0] - scene["centre_percent"][0]) * 3.9 - size / 2
    y = height / 2 + (scene["emblem_centre_percent"][1] - scene["centre_percent"][1]) * 8.44 - size / 2
    assert 0 <= x and x + size <= width and 0 <= y and y + size <= height
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{width * 4}" height="{height * 4}" viewBox="0 0 {width} {height}"><title>Variation: {scene["habitat"]}</title><image x="{x:.2f}" y="{y:.2f}" width="{size}" height="{size}" href="{data_url}"/></svg>\n'
    path = HERE / scene["hotspot_artwork"]
    path.write_text(svg)
    outputs.append({
        "path": scene["hotspot_artwork"],
        "dimensions": [width * 4, height * 4],
        "reference_display_dimensions": [width, height],
        "emblem_box": [round(x, 2), round(y, 2), size, size],
        "embedded_png_sha256": outputs[0]["sha256"],
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    })
record = {
    "source": "source.png",
    "source_sha256": SOURCE_SHA,
    "source_dimensions": list(source.size),
    "pillow": PIL.__version__,
    "operation": "RGBA LANCZOS proportional fit with transparent padding; whole source; no crop, backing, frame, alpha threshold or colour change. SVGs embed the identical generated emblem with no perimeter contour.",
    "fitted_dimensions": list(fitted.size),
    "transparent_padding_offset": padding,
    "outputs": outputs,
}
(HERE / "exports.json").write_text(json.dumps(record, indent=2) + "\n")
print(json.dumps(record, indent=2))
