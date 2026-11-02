#!/usr/bin/env python3
"""Check delivered geometry and coverage; do not retain verification captures."""
from pathlib import Path
import json
import sys
from PIL import Image

ROOT = Path(__file__).resolve().parents[4]
PRODUCTION = Path(__file__).resolve().parents[1]
catalogue = json.loads((PRODUCTION / 'catalogue.json').read_text())
issues = []
sizes = []
for item in catalogue['items']:
    path = ROOT / 'stories/mars' / item['asset']
    if not path.exists():
        issues.append(f"Missing item: {item['name']} ({item['asset']})")
        continue
    image = Image.open(path)
    if image.mode != 'RGBA':
        issues.append(f"Item lacks RGBA: {item['name']}")
        continue
    alpha = image.getchannel('A')
    box = alpha.point(lambda p: 255 if p > 24 else 0).getbbox()
    if not box:
        issues.append(f"Item is empty: {item['name']}")
        continue
    visible = max(box[2] - box[0], box[3] - box[1]) / 4
    sizes.append(visible)
    if visible < 59 or visible > 240:
        issues.append(f"Visible physical size outside bounds: {item['name']} ({visible:.1f}px)")
    if image.width / 4 > 250 or image.height / 4 > 250:
        issues.append(f"Excessive transparent canvas: {item['name']} ({image.width / 4:.1f}x{image.height / 4:.1f}px)")
    if item['owner'] == 'ordinary' and abs(visible - item['visibleLongEdgePx']) > 1:
        issues.append(f"Ordinary icon scale differs from catalogue: {item['name']} ({visible:.1f}px, expected {item['visibleLongEdgePx']})")
    if alpha.getextrema()[0] != 0:
        issues.append(f"Item has no transparent margin: {item['name']}")
print(f"Inspected {len(sizes)}/{len(catalogue['items'])} item icons; visible edges {min(sizes, default=0):.1f}–{max(sizes, default=0):.1f}px")
assembly_path = PRODUCTION / 'assemblies/manifest.json'
if assembly_path.exists():
    assemblies = json.loads(assembly_path.read_text())
    by_id = {item['id']: item for item in assemblies['items']}
    for slot in assemblies['slots']:
        owner = ROOT / 'stories/mars' / by_id[slot['owner']]['path']
        fitted = ROOT / 'stories/mars' / slot['path']
        if not fitted.exists():
            issues.append(f"Missing fitted layer: {slot['path']}")
            continue
        image = Image.open(fitted)
        if image.size != Image.open(owner).size:
            issues.append(f"Fitted layer extent differs from base: {slot['path']}")
        if image.mode != 'RGBA' or not image.getchannel('A').getbbox():
            issues.append(f"Fitted layer has no visible transparent artwork: {slot['path']}")
    print(f"Inspected {len(assemblies['slots'])} registered fitted layers")
scene_path = PRODUCTION / 'scene-manifest.json'
if scene_path.exists():
    scenes = json.loads(scene_path.read_text())
    expected = scenes['exportDimensions']
    hotspot_count = 0
    for scene in scenes['scenes']:
        path = ROOT / 'stories/mars' / scene['background']
        if not path.exists():
            issues.append(f"Missing background: {scene['background']}")
            continue
        if Image.open(path).size != (expected['width'], expected['height']):
            issues.append(f"Background framing differs from scene manifest: {scene['background']}")
        for hotspot in scene['hotspots']:
            hotspot_count += 1
            path = ROOT / 'stories/mars' / hotspot['icon']
            if not path.exists():
                issues.append(f"Missing landscape target: {hotspot['name']}")
                continue
            image = Image.open(path)
            if image.size != (hotspot['width'] * 4, hotspot['height'] * 4):
                issues.append(f"Landscape target extent differs from registration: {hotspot['name']}")
            if image.mode != 'RGBA' or image.getchannel('A').getbbox() is not None:
                issues.append(f"Landscape target must be fully transparent: {hotspot['name']}")
    print(f"Inspected {len(scenes['scenes'])} scenes and {hotspot_count} landscape targets")
if issues:
    print('\n'.join(issues))
    sys.exit(1)
print('Artwork coverage, alpha, framing, fitted geometry and physical-size checks pass.')
