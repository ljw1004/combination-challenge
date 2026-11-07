"""Mechanically extract selected generated sprites; never paint new content.

Run from the repository root with a Python containing Pillow, NumPy and SciPy.
Source alpha is preserved inside each object's component and two-pixel edge.
Only disconnected background debris is removed. All images use four source
pixels per reference display pixel, matching the existing Mars asset convention.
"""
from pathlib import Path
import json

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import label, binary_dilation

ROOT = Path(__file__).resolve().parents[4]
PRODUCTION = ROOT / 'projects/mars-study/production/live-feedback'
OUTPUT = ROOT / 'stories/mars/assets/live-feedback'
PROOFS = ROOT / 'runs/mars-live-feedback/water-samples'

# name, master, grid, zero-based cell, visible size, display canvas
POT = ((76, 58), (80, 62))
CORE = ((92, 46), (96, 50))
SPECS = [
    ('pot-empty', 'water-family.png', (3, 2), 0, *POT),
    ('pot-ice', 'water-family.png', (3, 2), 1, *POT),
    ('pot-meltwater', 'water-family.png', (3, 2), 2, *POT),
    ('pot-clean-water', 'water-family.png', (3, 2), 3, *POT),
    ('battery-heater-base', 'water-family.png', (3, 2), 4, (60, 46), (64, 50)),
    ('pot-filter-clogged', 'pot-filter-family.png', (2, 1), 1, (100, 80), (104, 84)),
    ('local-core-lined', 'slides-and-cores.png', (4, 2), 3, *CORE),
    ('local-core-insulated', 'slides-and-cores.png', (4, 2), 5, *CORE),
    ('remote-core-insulated', 'slides-and-cores.png', (4, 2), 6, *CORE),
    ('pot-potatoes', 'supper-pot-family.png', (2, 2), 0, *POT),
    ('pot-soybeans', 'supper-pot-family.png', (2, 2), 1, *POT),
    ('pot-cooked-stew', 'supper-pot-family.png', (2, 2), 2, *POT),
    ('pot-supper', 'supper-pot-family.png', (2, 2), 3, *POT),
]

OUTPUT.mkdir(parents=True, exist_ok=True)
PROOFS.mkdir(parents=True, exist_ok=True)
records = []
for name, master, (cols, rows), cell, ink_size, display in SPECS:
    source = PRODUCTION / 'sources' / master
    image = Image.open(source).convert('RGBA')
    col, row = cell % cols, cell // cols
    region = (col * image.width // cols, row * image.height // rows,
              (col + 1) * image.width // cols, (row + 1) * image.height // rows)
    pixels = np.array(image.crop(region))
    components, _ = label(pixels[:, :, 3] > 32)
    sizes = np.bincount(components.ravel())
    sizes[0] = 0
    ownership = components == int(sizes.argmax())
    # Preserve generated antialiasing near the main silhouette, while removing
    # separate faint background fragments. Preserve all internal alpha holes.
    ownership = binary_dilation(ownership, iterations=2)
    pixels[:, :, 3] = np.where(ownership, pixels[:, :, 3], 0)
    ys, xs = np.nonzero(pixels[:, :, 3])
    bounds = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    extracted = Image.fromarray(pixels).crop(bounds)
    rendered_size = tuple(value * 4 for value in ink_size)
    rendered = extracted.resize(rendered_size, Image.Resampling.LANCZOS)
    canvas_size = tuple(value * 4 for value in display)
    canvas = Image.new('RGBA', canvas_size)
    origin = ((canvas.width - rendered.width) // 2, (canvas.height - rendered.height) // 2)
    canvas.alpha_composite(rendered, origin)
    target = OUTPUT / f'{name}.png'
    canvas.save(target, optimize=True)
    records.append({
        'name': name, 'source': str(source.relative_to(ROOT)),
        'cell_zero_based': cell, 'source_cell_bounds': list(region),
        'source_object_bounds': [bounds[0] + region[0], bounds[1] + region[1],
                                 bounds[2] + region[0], bounds[3] + region[1]],
        'component_threshold': 32, 'edge_preservation_radius': 2,
        'runtime': str(target.relative_to(ROOT)), 'runtime_pixels': list(canvas_size),
        'recommended_display_pixels': list(display), 'visible_size_pixels': list(ink_size),
        'placement_on_runtime_canvas': list(origin),
        'transform': 'crop component; resize to recorded visible size; center with transparent padding',
        'alpha_extrema': list(canvas.getchannel('A').getextrema()),
    })

manifest = {
    'version': 1, 'generator': 'built-in image_gen',
    'brief': 'stories/mars/design-brief.md; latest user feedback overrides prior sample handling',
    'state': 'selected production assets; review outcome: ../../art-review/2026.11.04_18.55.58/report.md',
    'notes': [
        'Four selected source atlases retained before extraction.',
        'Water atlas cell 5 is unused: its filter support was superseded by pot-filter-family.png.',
        'The first slides/core sheet had a translucent white backdrop; the selected master is the alpha repair.',
        'Glass slide runtime assets are owned by export-glass-slides.py; unused atlas cells are not exported.',
        'Pot state images share one common display canvas and normalized visible dimensions; no content is painted by this exporter.',
        'Core labels are hand marks; the specimen ice remains in a thin liner under the soft foil/felt wrap.',
        'Portable images have no scene placement. Heater and filter target locations require root integration.',
        'Meal states were additionally generated from the selected pot reference to preserve vessel identity.',
    ],
    'assets': records,
}
(PRODUCTION / 'water-samples.geometry.json').write_text(json.dumps(manifest, indent=2) + '\n')

# Disposable producer proof only; this does not certify recognition or scene fit.
grounds = [('light', '#f5efe3'), ('dark', '#292824'), ('mars', '#b98963')]
for tag, color in grounds:
    sheet = Image.new('RGB', (720, 440), color)
    draw = ImageDraw.Draw(sheet)
    for i, rec in enumerate(records):
        icon = Image.open(ROOT / rec['runtime']).convert('RGBA').resize(
            tuple(rec['recommended_display_pixels']), Image.Resampling.LANCZOS)
        x, y = (i % 6) * 120 + (120 - icon.width) // 2, (i // 6) * 140 + 24
        sheet.paste(icon, (x, y), icon)
        draw.text(((i % 6) * 120 + 12, (i // 6) * 140 + 114), f'{i + 1:02d}',
                  fill='white' if tag == 'dark' else '#302820')
    sheet.save(PROOFS / f'display-proof-{tag}.png')
print(f'Exported {len(records)} assets and geometry manifest.')
