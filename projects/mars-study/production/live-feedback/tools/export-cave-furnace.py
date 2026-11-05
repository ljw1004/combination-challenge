#!/usr/bin/env python3
"""Composite selected existing art with registered masks; never edit references.

Requires Pillow and NumPy. Output must be scratch under runs/ or the dedicated
stories/mars/assets/live-feedback directory. No manuscript changes. Selected
painted content was made with built-in imagegen; this script only masks, crops,
resizes and composites those existing pixels. Proofs are disposable.
"""
import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[5]
PACKAGE = ROOT / 'projects/mars-study/production/live-feedback'


def opened(path, mode='RGBA'):
    with Image.open(ROOT / path) as image:
        return image.convert(mode)


def export(output, proofs=None):
    layout = json.loads((PACKAGE / 'cave-furnace-layout.json').read_text())
    canvas = tuple(layout['canvas'])
    layers = {}
    for key, spec in layout['layers'].items():
        image = opened(spec['source'])
        size = tuple(round(n * spec['scale']) for n in image.size)
        image = image.resize(size, Image.Resampling.LANCZOS)
        layer = Image.new('RGBA', canvas)
        layer.paste(image, tuple(spec['origin']))
        mask = opened(spec['mask'], 'L')
        if spec.get('bottomFade'):
            # Mechanical mask repair only: fade inside an irregular ground
            # boundary instead of ending the selected texture on a ruler line.
            edge = spec['bottomFade']
            points = np.asarray(edge['points'], dtype=float)
            boundary = np.interp(np.arange(canvas[0]), points[:, 0], points[:, 1])
            fade = np.clip((boundary[None, :] - np.arange(canvas[1])[:, None]) / edge['width'], 0, 1)
            mask = Image.fromarray(np.rint(np.asarray(mask).astype(float) * fade).astype('uint8'))
        layer.putalpha(mask)
        layers[key] = layer
    backgrounds = {}
    outputs = []
    for family in layout['families']:
        spec = family['background']
        if 'fromFamily' in spec:
            background = backgrounds[spec['fromFamily']].copy()
            for key in spec.get('layers', []):
                background.alpha_composite(layers[key])
        else:
            original = opened(spec['source'], 'RGB').crop(tuple(spec['bounds']))
            original = original.resize((canvas[0], round(original.height * canvas[0] / original.width)), Image.Resampling.LANCZOS)
            background = opened(spec['extension'], 'RGB').resize(canvas, Image.Resampling.LANCZOS)
            start, end = spec['blendY']
            background.paste(original.crop((0, 0, canvas[0], start)), (0, 0))
            box = (0, start, canvas[0], end)
            old = np.asarray(original.crop(box)).astype(float)
            new = np.asarray(background.crop(box)).astype(float)
            alpha = np.linspace(0, 1, end - start)[:, None, None]
            background.paste(Image.fromarray(np.rint(old * (1 - alpha) + new * alpha).astype('uint8')), (0, start))
            background = background.convert('RGBA')
        prefix = family['prefix']
        backgrounds[prefix] = background
        path = output / f'{prefix}.webp'
        background.convert('RGB').save(path, lossless=True, method=6)
        outputs.append(str(path.relative_to(ROOT)))
        sheet = Image.new('RGB', (390 * len(family['states']), 884), '#ddd') if proofs else None
        for index, (ident, keys) in enumerate(family['states'].items()):
            layer = Image.new('RGBA', canvas)
            for key in keys:
                layer.alpha_composite(layers[key])
            cropped = layer.crop(tuple(family['crop']))
            cropped = cropped.resize((cropped.width * 2, cropped.height * 2), Image.Resampling.LANCZOS)
            path = output / f'{prefix}-{ident}.png'
            cropped.save(path, optimize=True)
            outputs.append(str(path.relative_to(ROOT)))
            if proofs:
                composite = background.copy()
                composite.alpha_composite(layer)
                composite.convert('RGB').save(proofs / f'{prefix}-{ident}.png')
                sheet.paste(composite.resize((390, 844), Image.Resampling.LANCZOS), (390 * index, 40))
                ImageDraw.Draw(sheet).text((390 * index + 8, 10), ident, fill='#111')
        if sheet:
            sheet.save(proofs / f'{prefix}-sheet.png')
    for item in layout['portables']:
        image = opened(item['source'])
        visible = image.getchannel('A').point(lambda value: 255 if value >= 8 else 0).getbbox()
        image = image.crop(visible)
        scale = item['visiblePixels'] / max(image.size)
        size = tuple(max(4, round(n * scale / 4) * 4) for n in image.size)
        image = image.resize(size, Image.Resampling.LANCZOS)
        result = Image.new('RGBA', (size[0] + 16, size[1] + 16))
        result.paste(image, (8, 8))
        path = output / (item['id'] + '.png')
        result.save(path, optimize=True)
        outputs.append(str(path.relative_to(ROOT)))
    return outputs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=Path('runs/mars-live-feedback/seams/export'))
    parser.add_argument('--proofs', type=Path)
    args = parser.parse_args()
    output = (ROOT / args.output).resolve()
    if not (output.is_relative_to(ROOT / 'runs') or output == ROOT / 'stories/mars/assets/live-feedback'):
        parser.error('Output must be scratch or the dedicated live-feedback asset directory')
    proofs = (ROOT / args.proofs).resolve() if args.proofs else None
    if proofs and not proofs.is_relative_to(ROOT / 'runs'):
        parser.error('Proofs must be disposable files under runs/')
    output.mkdir(parents=True, exist_ok=True)
    if proofs:
        proofs.mkdir(parents=True, exist_ok=True)
    for path in export(output, proofs):
        print(path)


if __name__ == '__main__':
    main()
