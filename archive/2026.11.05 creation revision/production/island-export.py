# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow==13.0.0"]
# ///
"""Save the selected draft island scenery with explicit mechanical geometry.

This exports artwork only. It does not edit the manuscript or establish review.
Run with uv run projects/creation-study/production/island-export.py.
"""
from pathlib import Path
import hashlib
import json
from PIL import Image

here = Path(__file__).resolve().parent
repo = next(p for p in here.parents if (p / "package.json").is_file())
study = here.parent
requests = json.loads((here / "island-requests.json").read_text())
for call in requests["calls"]:
    source = repo / call["selectedOutput"]
    assert hashlib.sha256(source.read_bytes()).hexdigest() == call["outputSha256"], source

background_source = here / "masters/island-sea-01.png"
cutout_source = here / "masters/island-cutout-01.png"
background = Image.open(background_source).convert("RGB")
cutout = Image.open(cutout_source).convert("RGBA")
assert background.size == (853, 1844)
assert cutout.size == (853, 1843)

# Uniform full-height framing, removing less than one source pixel from each
# side. There is no independent horizontal/vertical stretching.
source_width = background.height * 780 / 1688
left = (background.width - source_width) / 2
background_box = (left, 0, left + source_width, background.height)
background_out = study / "assets/backgrounds/island-sea.webp"
background_out.parent.mkdir(parents=True, exist_ok=True)
background.resize((780, 1688), Image.Resampling.LANCZOS, box=background_box).save(
    background_out, format="WEBP", lossless=True, method=6
)

# Authored crop includes the complete island and narrow surf fringe, excluding
# distant alpha-one extraction noise. Generated alpha inside it is preserved.
# The 5:2 crop and output share their proportions exactly.
cutout_box = (185, 455, 735, 675)
sprite_out = study / "assets/hotspots/island-life.png"
sprite_out.parent.mkdir(parents=True, exist_ok=True)
cutout.resize((1000, 400), Image.Resampling.LANCZOS, box=cutout_box).save(sprite_out)

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

layout = {
    "status": "Draft saved after user paused artwork; independent review and browser integration pending.",
    "backgroundSource": str(background_source.relative_to(repo)),
    "backgroundSourceSha256": digest(background_source),
    "backgroundSourceSize": list(background.size),
    "backgroundSourceCrop": list(background_box),
    "backgroundRuntime": str(background_out.relative_to(repo)),
    "backgroundRuntimeSize": [780, 1688],
    "backgroundRuntimeSha256": digest(background_out),
    "cutoutSource": str(cutout_source.relative_to(repo)),
    "cutoutSourceSha256": digest(cutout_source),
    "cutoutSourceSize": list(cutout.size),
    "cutoutSourceCrop": list(cutout_box),
    "spriteRuntime": str(sprite_out.relative_to(repo)),
    "spriteRuntimeSize": [1000, 400],
    "spriteRuntimeSha256": digest(sprite_out),
    "referenceViewport": [390, 844],
    "suggestedCenterPercent": [54, 29],
    "suggestedDisplaySize": [250, 100],
    "suggestedDisplayBounds": [85.6, 194.76, 335.6, 294.76],
    "receiver": "Ordinary rectangular hotspot area; no circular marker or extra hitbox proposed.",
    "construction": "Island life appears only after Seasonal journeys + Volcanic island, then remains after Variation @ Island life.",
    "preservationLimits": "The generated cutout slightly changed and displaced the island relative to the complete state. Its authored crop and proposed position restore a usable composition; this is not pixel-identical extraction. Generated alpha is retained, including slightly nonopaque painted interiors. No scenery patch or opaque sea rectangle is introduced.",
}
(here / "island-layout.json").write_text(json.dumps(layout, indent=2) + "\n")
print(json.dumps({"saved": [str(background_out), str(sprite_out)], "status": "draft"}))
