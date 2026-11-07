"""Export the two selected microscope fields without recolouring or reframing."""
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
OUT = ROOT / 'stories/mars/assets/live-feedback/microscopy'
OUT.mkdir(parents=True, exist_ok=True)
for name in ('filter-sediment', 'whole-in-ice'):
    with Image.open(HERE / f'{name}.png') as image:
        image.convert('RGB').save(OUT / f'{name}.webp', lossless=True, method=6)
