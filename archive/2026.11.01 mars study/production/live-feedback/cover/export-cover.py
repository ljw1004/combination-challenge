"""Export the selected intact-habitat cover at the story's standard scene size."""
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
with Image.open(HERE / 'before-crash.png') as image:
    image.convert('RGB').resize((780, 1688), Image.Resampling.LANCZOS).save(
        ROOT / 'stories/mars/assets/live-feedback/cover-before-crash.webp',
        lossless=True, method=6)
