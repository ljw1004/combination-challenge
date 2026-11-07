#!/usr/bin/env python3
"""Extract labelled atlas components without cutting silhouettes at nominal cells.

Run with the isolated production environment described in README.md. Source alpha
is retained. Connected-component ownership only separates neighbouring objects;
it does not repaint, remove backgrounds, or regenerate the supplied artwork.
"""
from pathlib import Path
import argparse
import json

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[4]
PRODUCTION = Path(__file__).resolve().parents[1]
SCRATCH = ROOT / 'runs/mars-artwork'


def atlas_objects(image, columns, rows, component_threshold=24):
    pixels = np.array(image.convert('RGBA'))
    alpha = pixels[:, :, 3]
    labels, count = ndimage.label(alpha > component_threshold)
    if not count:
        raise ValueError('No visible alpha in atlas')
    bounds = ndimage.find_objects(labels)
    sizes = np.bincount(labels.ravel())
    centers = []
    for component in range(1, count + 1):
        sy, sx = bounds[component - 1]
        centers.append(((sx.start + sx.stop) / 2, (sy.start + sy.stop) / 2))
    cell_w, cell_h = image.width / columns, image.height / rows
    ownership = np.zeros(count + 1, dtype=np.int16)
    for component, (x, y) in enumerate(centers, 1):
        col = min(columns - 1, max(0, int(x / cell_w)))
        row = min(rows - 1, max(0, int(y / cell_h)))
        ownership[component] = row * columns + col + 1
    # Assign low-alpha edge pixels to their nearest substantial connected region.
    # This keeps the generated transparency, including translucent glass and halos.
    indices = ndimage.distance_transform_edt(labels == 0, return_distances=False, return_indices=True)
    nearest_labels = labels[tuple(indices)]
    owners = ownership[nearest_labels]
    results = []
    for cell in range(columns * rows):
        selected = pixels.copy()
        selected[:, :, 3][owners != cell + 1] = 0
        significant = (selected[:, :, 3] > 2)
        ys, xs = np.where(significant)
        if not len(xs):
            results.append(None)
            continue
        box = (max(0, int(xs.min()) - 2), max(0, int(ys.min()) - 2), min(image.width, int(xs.max()) + 3), min(image.height, int(ys.max()) + 3))
        cutout = Image.fromarray(selected).crop(box)
        results.append((cutout, box, [int(component) for component in range(1, count + 1) if ownership[component] == cell + 1 and sizes[component] >= 8]))
    return results


def frame(cutout, visible_px, padding_px=3):
    alpha = cutout.getchannel('A')
    bbox = alpha.point(lambda a: 255 if a > 24 else 0).getbbox()
    if not bbox:
        raise ValueError('Empty object')
    # Scale the physical object, not its transparent padding or very faint edge.
    ratio = visible_px * 4 / max(bbox[2] - bbox[0], bbox[3] - bbox[1])
    resized = cutout.resize((max(1, round(cutout.width * ratio)), max(1, round(cutout.height * ratio))), Image.Resampling.LANCZOS)
    padding = padding_px * 4
    out = Image.new('RGBA', (resized.width + padding * 2, resized.height + padding * 2))
    out.alpha_composite(resized, (padding, padding))
    return out


def contact_sheet(group, items, background, suffix):
    columns, rows = group['columns'], group['rows']
    cell_w, cell_h = 260, 270
    canvas = Image.new('RGB', (columns * cell_w, rows * cell_h), background)
    draw = ImageDraw.Draw(canvas)
    for index, item in enumerate(items):
        source = ROOT / 'stories/mars' / item['asset']
        if not source.exists():
            continue
        icon = Image.open(source).convert('RGBA')
        icon = icon.resize((round(icon.width / 4), round(icon.height / 4)), Image.Resampling.LANCZOS)
        x = index % columns * cell_w + (cell_w - icon.width) // 2
        y = index // columns * cell_h + (cell_h - 45 - icon.height) // 2
        canvas.paste(icon, (x, y), icon)
        text = item['name']
        draw.text((index % columns * cell_w + 8, (index // columns + 1) * cell_h - 28), text, fill='#18252c' if suffix != 'dark' else '#efeee7')
    SCRATCH.mkdir(parents=True, exist_ok=True)
    canvas.save(SCRATCH / f"{group['id']}-{suffix}.jpg", quality=94)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('groups', nargs='*', help='Atlas IDs, or all available sources when omitted')
    parser.add_argument('--proofs', action='store_true')
    args = parser.parse_args()
    catalogue = json.loads((PRODUCTION / 'catalogue.json').read_text())
    by_name = {item['name']: item for item in catalogue['items']}
    groups = json.loads((PRODUCTION / 'atlas-groups.json').read_text())
    overrides_path = PRODUCTION / 'source-overrides.json'
    overrides = json.loads(overrides_path.read_text()).get('items', {}) if overrides_path.exists() else {}
    unknown = set(overrides) - {item['id'] for item in catalogue['items'] if item['owner'] == 'ordinary'}
    if unknown:
        raise ValueError(f'Unknown or assembly-owned source overrides: {sorted(unknown)}')
    record_path = PRODUCTION / 'extraction.json'
    records = json.loads(record_path.read_text()) if record_path.exists() else {}
    exported = 0
    override_atlases = {}
    for group in groups:
        if args.groups and group['id'] not in args.groups:
            continue
        source = PRODUCTION / 'atlases' / f"{group['id']}.png"
        if not source.exists():
            continue
        image = Image.open(source)
        objects = atlas_objects(image, group['columns'], group['rows'])
        group_items = []
        for index, name in enumerate(group['names']):
            item = by_name[name]
            group_items.append(item)
            override = overrides.get(item['id'])
            selected_source = source
            if override:
                selected_source = ROOT / override['source']
                repaired = Image.open(selected_source).convert('RGBA')
                if 'grid' in override:
                    grid = override['grid']
                    threshold = grid.get('componentThreshold', 24)
                    key = (str(selected_source), grid['columns'], grid['rows'], threshold)
                    if key not in override_atlases:
                        override_atlases[key] = atlas_objects(repaired, grid['columns'], grid['rows'], threshold)
                    extracted = override_atlases[key][grid['cell'] - 1]
                    if extracted is None:
                        raise ValueError(f'Empty override atlas cell for {name}')
                    cutout, box, components = extracted
                    if 'crop' in override:
                        selected_box = override['crop']
                        cutout = cutout.crop((selected_box[0] - box[0], selected_box[1] - box[1], selected_box[2] - box[0], selected_box[3] - box[1]))
                        box = selected_box
                else:
                    box = override.get('crop')
                    if box is None:
                        box = repaired.getchannel('A').point(lambda a: 255 if a > 2 else 0).getbbox()
                        if box is None:
                            raise ValueError(f'Empty override artwork for {name}')
                        box = (max(0, box[0] - 2), max(0, box[1] - 2), min(repaired.width, box[2] + 2), min(repaired.height, box[3] + 2))
                    cutout, components = repaired.crop(box), []
            else:
                if objects[index] is None:
                    raise ValueError(f"Missing occupied atlas cell {index + 1} for {name}")
                cutout, box, components = objects[index]
            icon = frame(cutout, item['visibleLongEdgePx'])
            output = ROOT / 'stories/mars' / item['asset']
            output.parent.mkdir(parents=True, exist_ok=True)
            icon.save(output, optimize=True)
            records[item['id']] = {'name': name, 'source': str(selected_source.relative_to(ROOT)), 'cell': override.get('grid', {}).get('cell') if override else index + 1, 'crop': box, 'components': components, 'method': 'source-override-v1' if override else 'alpha-connected-regions-v1', 'asset': item['asset'], 'intrinsicDimensions': list(icon.size), 'visibleLongEdgePx': item['visibleLongEdgePx']}
            exported += 1
        if args.proofs:
            for color, suffix in [('#e8e4d7', 'light'), ('#23303b', 'dark'), ('#b47852', 'ochre')]:
                contact_sheet(group, group_items, color, suffix)
        print(f"{group['id']}: {len(group['names'])} icons")
    record_path.write_text(json.dumps(records, indent=2) + '\n')
    print(f'{exported} ordinary item icons exported')


if __name__ == '__main__':
    main()
