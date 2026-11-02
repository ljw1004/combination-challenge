"""Export selected scene paintings and registered transparent hotspot regions.

Run from anywhere with Python and Pillow. Artwork is cropped, never stretched.
This is deterministic framing and encoding; all revised paintings use ImageGen.
"""
from pathlib import Path
import json

from PIL import Image, ImageOps

HERE = Path(__file__).resolve().parent
ROOT = next(p for p in HERE.parents if (p / 'stories/mars/mars.md').is_file())
MANIFEST = HERE.parent / 'scene-manifest.json'


def main():
    data = json.loads(MANIFEST.read_text())
    for scene in data['scenes']:
        source = (MANIFEST.parent / scene['source']).resolve()
        target = ROOT / 'stories/mars' / scene['background']
        target.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as artwork:
            # Match the player's centered, top-aligned cover framing exactly.
            framed = ImageOps.fit(artwork.convert('RGB'), (780, 1688),
                                 method=Image.Resampling.LANCZOS,
                                 centering=(0.5, 0.0))
            framed.save(target, quality=90, method=6)
        for hotspot in scene['hotspots']:
            target = ROOT / 'stories/mars' / hotspot['icon']
            target.parent.mkdir(parents=True, exist_ok=True)
            # The runtime displays icon pixels at one quarter size.
            Image.new('RGBA', (hotspot['width'] * 4, hotspot['height'] * 4),
                      (0, 0, 0, 0)).save(target, optimize=True)
    print(f"Exported {len(data['scenes'])} scenes and "
          f"{sum(len(s['hotspots']) for s in data['scenes'])} hotspot regions")


if __name__ == '__main__':
    main()
