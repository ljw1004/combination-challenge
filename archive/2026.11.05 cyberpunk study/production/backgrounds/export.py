"""Export selected opaque background paintings without altering their content.

Run with: uv run --with pillow python projects/cyberpunk-study/production/backgrounds/export.py
All transforms use one scale factor after an explicit phone-aspect crop.
"""
from pathlib import Path
import json

from PIL import Image

HERE = Path(__file__).resolve().parent
DESTINATION = HERE.parent.parent / "assets" / "scenes"
SIZE = (780, 1688)


def main():
    DESTINATION.mkdir(parents=True, exist_ok=True)
    geometry = {}
    for source in sorted((HERE / "masters").glob("*.png")):
        with Image.open(source) as image:
            width, height = image.size
            if width / height > SIZE[0] / SIZE[1]:
                crop_width = round(height * SIZE[0] / SIZE[1])
                left = (width - crop_width) // 2
                bounds = (left, 0, left + crop_width, height)
            else:
                crop_height = round(width * SIZE[1] / SIZE[0])
                top = (height - crop_height) // 2
                bounds = (0, top, width, top + crop_height)
            # The accepted market crop has a one-pixel left bias.
            if source.stem == "market-night" and image.size == (977, 1610):
                bounds = (116, 0, 860, 1610)
            output = DESTINATION / f"{source.stem}.webp"
            image.crop(bounds).resize(SIZE, Image.Resampling.LANCZOS).convert("RGB").save(
                output, quality=92, method=6
            )
            geometry[source.stem] = {
                "master": f"masters/{source.name}",
                "source_dimensions": [width, height],
                "crop_bounds_ltrb": list(bounds),
                "output": f"../../assets/scenes/{output.name}",
                "output_dimensions": list(SIZE),
                "mode": "RGB",
                "resampling": "Lanczos",
                "webp_quality": 92,
                "webp_method": 6,
            }
    (HERE / "geometry.json").write_text(json.dumps(geometry, indent=2) + "\n")
    print(f"Exported {len(geometry)} backgrounds to {DESTINATION}")


if __name__ == "__main__":
    main()
