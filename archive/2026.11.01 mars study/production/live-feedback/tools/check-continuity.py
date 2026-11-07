#!/usr/bin/env python3
"""Read-only comparison of explicitly protected pixels in registered legal states.

Requires Pillow and NumPy. Paths in the JSON manifest are relative to --root
(default: the current directory). Each check needs id, scope, legal_transition,
before/after {background, layers}, and protected_regions [{id, reason, polygon}].
Layers have path, centre [x,y] in canvas pixels, and scale (default 1).
The manifest supplies canvas [width,height] and optional tolerance (default 10)
and max_changed_fraction (default .02). Polygons use that same registered canvas.

This checks only declared unchanged regions, not whole-image colour statistics.
It cannot certify physical identity, masks, legal gameplay, or visual quality.
The author must justify each region and transition; inspect any flagged proof.
No artwork is changed. Optional proof/report output must be under root/runs/.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import sys

import numpy as np
from PIL import Image, ImageDraw


def input_image(root, relative, versions):
    path = (root / relative).resolve()
    versions[relative] = hashlib.sha256(path.read_bytes()).hexdigest()
    with Image.open(path) as opened:
        return opened.convert('RGBA')


def composite(root, spec, canvas, versions):
    result = input_image(root, spec['background'], versions)
    if result.size != canvas:
        raise ValueError(f"Background {spec['background']} must match canvas {canvas}")
    for layer in spec.get('layers', []):
        image = input_image(root, layer['path'], versions)
        scale = layer.get('scale', 1)
        if scale <= 0:
            raise ValueError('Layer scale must be positive')
        size = tuple(max(1, round(n * scale)) for n in image.size)
        if image.size != size:
            image = image.resize(size, Image.Resampling.LANCZOS)
        x, y = layer['centre']
        result.alpha_composite(image, (round(x - size[0] / 2), round(y - size[1] / 2)))
    if result.getchannel('A').getextrema() != (255, 255):
        raise ValueError('Registered composites must be opaque')
    return result.convert('RGB')


def scratch_path(root, supplied):
    path = (root / supplied).resolve()
    if not path.is_relative_to(root / 'runs'):
        raise ValueError('Diagnostic output must be in the disposable runs/ directory')
    return path


def inspect(root, manifest, proof_dir=None):
    canvas = tuple(manifest['canvas'])
    reports = []
    for index, check in enumerate(manifest['checks']):
        if not check.get('scope') or not check.get('legal_transition'):
            raise ValueError('Each check needs explicit scope and a legal_transition description')
        versions = {}
        before = composite(root, check['before'], canvas, versions)
        after = composite(root, check['after'], canvas, versions)
        a, b = np.asarray(before).astype(np.int16), np.asarray(after).astype(np.int16)
        delta = np.abs(b - a).max(axis=2)
        regions = []
        coverage = np.zeros((canvas[1], canvas[0]), dtype=bool)
        for region in check['protected_regions']:
            if not region.get('reason') or len(region['polygon']) < 3:
                raise ValueError('Protected regions need a reason and a polygon')
            mask = Image.new('1', canvas)
            ImageDraw.Draw(mask).polygon([tuple(p) for p in region['polygon']], fill=1)
            selected = np.asarray(mask, dtype=bool)
            if not selected.any():
                raise ValueError('Protected region is empty: ' + region['id'])
            coverage |= selected
            tolerance = region.get('tolerance', manifest.get('tolerance', 10))
            permitted = region.get('max_changed_fraction', manifest.get('max_changed_fraction', .02))
            changed = delta[selected] > tolerance
            fraction = float(changed.mean())
            rgb_shift = np.median((b - a)[selected], axis=0).tolist()
            # Direction helps diagnose colour drift; pass/fail is based on RGB only.
            ah = np.asarray(before.convert('HSV'))[:, :, 1].astype(np.int16)
            bh = np.asarray(after.convert('HSV'))[:, :, 1].astype(np.int16)
            regions.append({'id': region['id'], 'reason': region['reason'],
                            'polygon': region['polygon'], 'pixels': int(selected.sum()),
                            'tolerance_rgb_0_255': tolerance, 'max_changed_fraction': permitted,
                            'changed_fraction': round(fraction, 5),
                            'median_rgb_shift': rgb_shift,
                            'median_saturation_shift_0_255': float(np.median((bh-ah)[selected])),
                            'p95_max_channel_delta': float(np.percentile(delta[selected], 95)),
                            'status': 'FLAG' if fraction > permitted else 'PASS'})
        if not regions:
            raise ValueError('At least one explicitly protected region is required')
        report = {'id': check['id'], 'scope': check['scope'],
                  'legal_transition': check['legal_transition'], 'canvas': list(canvas),
                  'input_sha256': versions, 'regions': regions,
                  'status': 'FLAG' if any(r['status'] == 'FLAG' for r in regions) else 'PASS'}
        if proof_dir:
            name = f"{index + 1:02d}-" + re.sub(r'[^A-Za-z0-9_-]', '-', check['id'])
            # Registered before/after plus amplified difference, restricted to scope.
            heat = np.full_like(np.asarray(before), 28)
            heat[coverage] = np.clip(delta[coverage, None] * 6, 0, 255).astype(np.uint8)
            heat = Image.fromarray(heat)
            draw = ImageDraw.Draw(heat)
            for region in check['protected_regions']:
                points = [tuple(p) for p in region['polygon']]
                draw.line(points + points[:1], fill=(255, 0, 255), width=2)
            before.save(proof_dir / f'{name}-before.png')
            after.save(proof_dir / f'{name}-after.png')
            heat.save(proof_dir / f'{name}-protected-difference.png')
        reports.append(report)
    return {'method': 'Explicit protected regions in registered composites; flags require visual review.',
            'limits': 'No certification of physical identity, legal gameplay, or unprotected pixels.',
            'checks': reports}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('manifest', type=Path)
    parser.add_argument('--root', type=Path, default=Path.cwd())
    parser.add_argument('--proof-dir')
    parser.add_argument('--report')
    args = parser.parse_args()
    root = args.root.resolve()
    proof_dir = scratch_path(root, args.proof_dir) if args.proof_dir else None
    report_path = scratch_path(root, args.report) if args.report else None
    if proof_dir:
        proof_dir.mkdir(parents=True, exist_ok=True)
    result = inspect(root, json.loads(args.manifest.read_text()), proof_dir)
    if report_path:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(result, indent=2) + '\n')
    for check in result['checks']:
        for region in check['regions']:
            print(f"{region['status']} {check['id']}/{region['id']}: "
                  f"{region['changed_fraction']:.1%} protected pixels changed; "
                  f"median RGB shift {region['median_rgb_shift']}")
    return 1 if any(c['status'] == 'FLAG' for c in result['checks']) else 0


if __name__ == '__main__':
    sys.exit(main())
