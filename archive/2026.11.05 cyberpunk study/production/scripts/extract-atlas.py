"""Mechanical registration/export of generated circular atlas art; no painting.

uv run --with pillow --with numpy python extract-atlas.py SOURCE NAMES_JSON OUT_DIR RECORD_JSON [COLS] [SIZE]
NAMES_JSON is an ordered list of drawing IDs (16 entries for a 4x4 atlas).
Circle fitting uses the cream rim to exclude generated exterior debris. Outputs
are centered 240px drawings on 256px RGBA canvases, with preserved source alpha.
Inspect all exports: a source without this rim convention needs explicit bounds.
"""
from pathlib import Path
import json, sys
import numpy as np
from PIL import Image

source, names_path, output, record_path = map(Path, sys.argv[1:5])
names = json.loads(names_path.read_text())
im = Image.open(source).convert('RGBA')
cols = int(sys.argv[5]) if len(sys.argv) > 5 else 4
size = int(sys.argv[6]) if len(sys.argv) > 6 else 256
drawing_size = round(size * .9375)
offset = (size-drawing_size)//2
rows = (len(names) + cols - 1) // cols
output.mkdir(parents=True, exist_ok=True)
records = []
for i, name in enumerate(names):
    if not name:
        continue
    w, h = im.size
    box = (round(i % cols*w/cols), round(i//cols*h/rows),
           round((i % cols+1)*w/cols), round((i//cols+1)*h/rows))
    cell = im.crop(box)
    a = np.array(cell)
    yy, xx = np.mgrid[:a.shape[0], :a.shape[1]]
    distance = np.hypot(xx-a.shape[1]/2, yy-a.shape[0]/2)
    r, g, b, alpha = a.transpose(2, 0, 1).astype(float)
    cream = ((r > 170) & (g > 150) & (b > 100) & (r-g < 65)
             & (g-b < 85) & (b/r.clip(1) > .5) & (alpha > 200)
             & (distance > a.shape[1]*.43))
    x, y = xx[cream], yy[cream]
    if len(x) < 50:
        raise ValueError(f'{name}: insufficient rim pixels; inspect source')
    fit = np.linalg.lstsq(np.column_stack((2*x, 2*y, np.ones(len(x)))), x*x+y*y, rcond=None)[0]
    cx, cy = fit[:2]
    radius = float(np.quantile(np.hypot(x-cx, y-cy), .96) + .5)
    if not .38*min(cell.size) < radius < .52*max(cell.size):
        raise ValueError(f'{name}: suspicious fitted radius {radius}; inspect source')
    d = np.hypot(xx-cx, yy-cy)
    matte = np.clip(radius+.5-d, 0, 1)
    a[:, :, 3] = (a[:, :, 3]*matte).astype('uint8')
    # Remove only out-of-palette keying debris in the outer five source pixels.
    spill = ((d > radius-5) & (((r > 130) & (g > 120) & (b < 90) & (g > r*.8))
             | ((r > g*1.7) & (b > g*1.35))))
    a[spill, 3] = 0
    clean = Image.fromarray(a)
    crop = (round(cx-radius-1), round(cy-radius-1), round(cx+radius+1), round(cy+radius+1))
    drawing = clean.crop(crop).resize((drawing_size, drawing_size), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (size, size))
    canvas.paste(drawing, (offset, offset))
    if name:
        canvas.save(output/f'{name}.png', optimize=True)
    records.append({'id': name, 'cell': box, 'circle': [float(cx), float(cy), radius],
                    'crop_in_cell': crop, 'drawing_size': [drawing_size, drawing_size], 'canvas': [size, size],
                    'offset': [offset, offset], 'perimeter_chroma_matte': True})
record_path.parent.mkdir(parents=True, exist_ok=True)
record_path.write_text(json.dumps({'source': str(source), 'dimensions': im.size, 'exports': records}, indent=2)+'\n')
print(f'Exported {sum(bool(n) for n in names)} circles from {source.name}')
