"""Register only the generated fuel-selector removal over the original scene.

Requires Pillow and NumPy. All pixels outside the recorded local patch remain
the original decoded background pixels. Remaining controls are unchanged.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image

P = Path(__file__).resolve().parent
ROOT = P.parents[4]
OUT = ROOT/'stories/mars/assets/live-feedback/storm-controls'
RUN = ROOT/'runs/mars-storm-controls'
OUT.mkdir(parents=True, exist_ok=True)
RUN.mkdir(parents=True, exist_ok=True)
base_path = ROOT/'stories/mars/assets/survival/scenes/amber-noon.webp'
base = Image.open(base_path).convert('RGB')
master = Image.open(P/'two-controls-master.png').convert('RGB')
replacement = master.resize(base.size, Image.Resampling.LANCZOS)
box = (475, 228, 608, 433)
x0,y0,x1,y1 = box
yy,xx = np.mgrid[y0:y1,x0:x1]
distance = np.minimum.reduce([xx-x0, x1-1-xx, yy-y0, y1-1-yy])
alpha = np.clip(distance/8, 0, 1)
alpha = alpha*alpha*(3-2*alpha)
mask = Image.new('L', base.size)
mask.paste(Image.fromarray(np.rint(alpha*255).astype('uint8')), (x0,y0))
result = Image.composite(replacement, base, mask)
result.save(OUT/'amber-noon.webp', lossless=True, method=6)
original = np.asarray(base)
actual = np.asarray(Image.open(OUT/'amber-noon.webp').convert('RGB'))
changed = np.any(original != actual, axis=2)
permitted = np.asarray(mask) != 0
assert not np.any(changed & ~permitted), 'Pixels changed outside the local removal'
for left,top,right,bottom in [(185,230,310,435),(333,230,453,435)]:
    assert np.array_equal(original[top:bottom,left:right],actual[top:bottom,left:right])
(P/'geometry.json').write_text(json.dumps({
    'source': str(base_path.relative_to(ROOT)),
    'generated': 'two-controls-master.png', 'generatedSize': master.size,
    'runtime': str((OUT/'amber-noon.webp').relative_to(ROOT)),
    'runtimeSize': base.size, 'patchBounds': box,
    'mask': '8-pixel inside smoothstep feather; zero outside patch',
    'preservedExactly': ['left power selector and overlay registration',
                         'middle water selector and overlay registration',
                         'window, surrounding wall and floor outside patch'],
    'changedPixels': int(changed.sum()),
    'outsidePatchChangedPixels': int(np.count_nonzero(changed & ~permitted)),
},indent=2)+'\n')
result.resize((390,844),Image.Resampling.LANCZOS).save(RUN/'two-controls-proof.png')
result.crop((140,220,640,450)).resize((1000,460),Image.Resampling.LANCZOS).save(RUN/'plate-detail.png')
print('Exported removal patch; other control pixels unchanged.')
