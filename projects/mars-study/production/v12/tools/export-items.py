"""Deterministic atlas extraction and physical sizing for the v12 artwork.

Uses the established alpha-preserving extractor; never regenerates paintings.
Source selection and bounds remain in production, proofs stay in ignored runs/.
"""
import argparse
import sys
sys.dont_write_bytecode = True
import importlib.util
import json
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[5]
PROD = ROOT / 'projects/mars-study/production/v12'
STORY = ROOT / 'projects/mars-study/mars-v12'
spec = importlib.util.spec_from_file_location('atlas', PROD.parent / 'tools/export-atlases.py')
atlas = importlib.util.module_from_spec(spec)
spec.loader.exec_module(atlas)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('groups', nargs='*')
    parser.add_argument('--proofs', action='store_true')
    args = parser.parse_args()
    catalogue = json.loads((PROD / 'catalogue.json').read_text())
    groups = json.loads((PROD / 'atlas-groups.json').read_text())
    appearances = catalogue.get('variants', [])
    if isinstance(appearances, dict): appearances = list(appearances.values())
    items = catalogue['items'] + appearances
    overrides_file = PROD / 'source-overrides.json'
    overrides = json.loads(overrides_file.read_text()) if overrides_file.exists() else {}
    record_file = PROD / 'extraction.json'
    records = json.loads(record_file.read_text()) if record_file.exists() else {}
    sources = {}
    count = 0
    for item in items:
        src = overrides.get(item['id'], item['source'])
        if src['kind'] == 'assembly': continue
        if args.groups and src.get('group', item['source'].get('group')) not in args.groups: continue
        if src['kind'] == 'reuse':
            source = ROOT / src['path']
            image = Image.open(source).convert('RGBA')
            box = image.getchannel('A').point(lambda a:255 if a > 2 else 0).getbbox()
            cut = image.crop(box)
        else:
            group = next(g for g in groups if g['id'] == src['group'])
            source = PROD / 'atlases' / src.get('filename', f"{group['id']}.png")
            if not source.exists(): continue
            columns, rows = src.get('columns', group['columns']), src.get('rows', group['rows'])
            key = (str(source), columns, rows)
            if key not in sources:
                sources[key] = atlas.atlas_objects(Image.open(source), columns, rows, src.get('componentThreshold',24))
            found = sources[key][src['cell']-1]
            if not found: raise ValueError(f"Empty cell: {item['name']}")
            cut, box, _ = found
        icon = atlas.frame(cut, item['visibleLongEdgePx'])
        # Whole reference pixels without changing the measured drawing size.
        padded = Image.new('RGBA', ((icon.width+3)//4*4, (icon.height+3)//4*4))
        padded.alpha_composite(icon)
        icon = padded
        target = STORY / item['asset']
        target.parent.mkdir(parents=True, exist_ok=True)
        icon.save(target, optimize=True)
        records[item['id']] = dict(source=str(source.relative_to(ROOT)), crop=box, asset=item['asset'], intrinsicDimensions=list(icon.size), visibleLongEdgePx=item['visibleLongEdgePx'], sourceSelection=src)
        count += 1
    record_file.write_text(json.dumps(records, indent=2)+'\n')
    if args.proofs:
        out = ROOT / 'runs/mars-v12/proofs'
        out.mkdir(parents=True, exist_ok=True)
        by_id = {i['id']:i for i in items}
        for group in groups:
            if args.groups and group['id'] not in args.groups: continue
            for ground, color in [('light','#e8e4d7'),('dark','#23303b'),('ochre','#b47852')]:
                proof = Image.new('RGB',(1000,1000),color)
                draw = ImageDraw.Draw(proof)
                for n,id in enumerate(group['items']):
                    item = by_id.get(id)
                    if not item or not (STORY/item['asset']).exists(): continue
                    im=Image.open(STORY/item['asset']).convert('RGBA')
                    im=im.resize((round(im.width/4),round(im.height/4)),Image.Resampling.LANCZOS)
                    x=n%4*250+(250-im.width)//2;y=n//4*250+(220-im.height)//2
                    proof.paste(im,(x,y),im)
                    draw.text((n%4*250+5,n//4*250+225),item['name'][:39],fill='#f5f1e6' if ground=='dark' else '#18252c')
                proof.save(out/f"{group['id']}-{ground}.jpg",quality=94)
    print(f'{count} icons exported; {len(records)} extraction records')

if __name__ == '__main__': main()
