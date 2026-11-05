"""Mechanical atlas extraction; never paints or invents image content.

uv run --with pillow python production/export-atlases.py --masters DIR --output DIR
Last available non-null manifest occurrence wins before extraction. Missing
masters are allowed during production; --complete requires every planned master
and identity. --dry-run checks runtime files/cache without writing anything.
"""
import argparse
import json
import hashlib
from pathlib import Path
from production_paths import repo_root, runtime_assets
from PIL import Image, ImageChops, ImageDraw

HERE = Path(__file__).resolve().parent
ROOT = repo_root(HERE)
parser = argparse.ArgumentParser()
parser.add_argument('--masters', type=Path, default=HERE/'masters')
parser.add_argument('--output', type=Path, help='Export directory; defaults to runs/creation-art/exports, or runtime icons for --dry-run')
parser.add_argument('--proofs', type=Path)
parser.add_argument('--complete', action='store_true')
parser.add_argument('--dry-run', action='store_true', help='Read sources and verify cache/output hashes without creating files')
args = parser.parse_args()
args.output = args.output or (runtime_assets(HERE)/'icons' if args.dry_run else ROOT/'runs/creation-art/exports')
catalogue = json.loads((HERE/'visual-catalogue.json').read_text())
by_name = {e['name']: e for e in catalogue['entries']}
plan = json.loads((HERE/'atlas-plan.json').read_text())
if not args.dry_run:
    args.output.mkdir(parents=True, exist_ok=True)
metadata = {}
previous_path = args.output/'extraction.json'
cache_path = previous_path if previous_path.exists() else HERE/'selected-extraction.json'
previous = json.loads(cache_path.read_text()) if cache_path.exists() else {}
pending_outputs = []
available = []
winners = {}
for atlas in plan['icons']:
    source = args.masters/(atlas['id']+'.png')
    if source.exists():
        available.append(atlas)
        for name in atlas['names']:
            if name is not None:
                winners[name] = atlas['id']
    elif args.complete:
        raise FileNotFoundError(source)

def write_webp(icon, path):
    temporary = path.with_suffix('.webp.tmp')
    icon.save(temporary, format='WEBP', quality=94, method=4)
    temporary.replace(path)

def opaque_span(image, axis, fixed, expected, minimum, low, high):
    # Restrict detection to its authored cell. A single alpha scan can connect
    # neighboring painted rims or split a textured interior; average a narrow
    # band and bridge only tiny gaps, never borrow a neighboring token's span.
    cross_length = image.height if axis == 'x' else image.width
    band = range(max(0, fixed-4), min(cross_length, fixed+5))
    visible = []
    for j in range(low, high):
        alpha = sum(image.getpixel((j, k) if axis == 'x' else (k, j))[3] for k in band)/len(band)
        visible.append(alpha > 128)
    for j in range(1, len(visible)-1):
        if not visible[j] and visible[j-1] and any(visible[j+1:j+4]):
            visible[j] = True
    spans = []
    start = None
    for offset, present in enumerate(visible+[False]):
        j = low+offset
        if present and start is None:
            start = j
        if not present and start is not None:
            if j-start > minimum:
                spans.append((start, j))
            start = None
    if not spans:
        raise ValueError(f'No opaque token span on {axis}={fixed}')
    return min(spans, key=lambda s: abs((s[0]+s[1])/2-expected))

def circle_export(image, bounds, size):
    icon = image.crop(bounds).resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new('L', (size*4, size*4))
    ImageDraw.Draw(mask).ellipse((3, 3, size*4-4, size*4-4), fill=255)
    mask = mask.resize((size, size), Image.Resampling.LANCZOS)
    icon.putalpha(ImageChops.multiply(icon.getchannel('A'), mask))
    return icon

for atlas in available:
    path = args.masters/(atlas['id']+'.png')
    source_hash = hashlib.sha256(path.read_bytes()).hexdigest()
    image = Image.open(path).convert('RGBA')
    cols, rows = atlas['grid']
    assert len(atlas['names']) == cols*rows
    for i, name in enumerate(atlas['names']):
        if name is None or winners[name] != atlas['id']:
            continue
        e = by_name[name]
        cx, cy = (i%cols+.5)*image.width/cols, (i//cols+.5)*image.height/rows
        x0, x1 = opaque_span(image, 'x', int(cy), cx, image.width/cols*.45, round(i%cols*image.width/cols), round((i%cols+1)*image.width/cols))
        y0, y1 = opaque_span(image, 'y', int(cx), cy, image.height/rows*.45, round(i//cols*image.height/rows), round((i//cols+1)*image.height/rows))
        bounds = [x0, y0, x1, y1]
        if 'bounds' in atlas and name in atlas['bounds']:
            bounds = atlas['bounds'][name]
        assert .85 <= (bounds[2]-bounds[0])/(bounds[3]-bounds[1]) <= 1.18, f'{name}: non-circular extraction {bounds}'
        target = args.output/(e['slug']+'.webp')
        old = previous.get(name, {})
        current = old.get('master') == path.name and old.get('bounds') == bounds and old.get('exportVersion') == 3 and old.get('sourceSha256') == source_hash
        outputs = [(target, 256)]
        if e['fixedIn']:
            outputs.append((args.output/('fixed-'+e['slug']+'.webp'), 384))
        for target, size in outputs:
            valid = current and target.exists() and old.get('outputs', {}).get(target.name) == hashlib.sha256(target.read_bytes()).hexdigest()
            if not valid:
                pending_outputs.append(str(target))
                if not args.dry_run:
                    write_webp(circle_export(image, bounds, size), target)
        metadata[name] = dict(master=path.name, sourceSha256=source_hash, bounds=bounds, size=[256,256], fixedSize=[384,384] if e['fixedIn'] else None, exportVersion=3,
                              outputs={target.name:hashlib.sha256(target.read_bytes()).hexdigest() for target,_size in outputs if target.exists()},
                              operation='cell-bounded crop; LANCZOS resize; original alpha multiplied by 4x-antialiased inscribed ellipse; WebP quality94 method4')

# Proofs are assembled only after every winner is exported. Their named cells
# show the final selection, which may come from a later replacement atlas.
if args.proofs and not args.dry_run:
    for atlas in available:
        cols, rows = atlas['grid']
        args.proofs.mkdir(parents=True, exist_ok=True)
        for label, ground, ink in [('light','#f3eddf','#172437'),('dark','#102039','#f3eddf')]:
            sheet=Image.new('RGB',(cols*180,rows*110),ground)
            draw=ImageDraw.Draw(sheet)
            for i,name in enumerate(atlas['names']):
                if name is None:
                    continue
                icon=Image.open(args.output/(by_name[name]['slug']+'.webp')).resize((64,64),Image.Resampling.LANCZOS)
                x,y=i%cols*180,i//cols*110
                sheet.paste(icon,(x+58,y+8),icon)
                draw.text((x+7,y+82),name,fill=ink)
            sheet.save(args.proofs/(atlas['id']+'-'+label+'.png'))

if args.complete:
    assert set(metadata) == set(by_name), f'Missing: {set(by_name)-set(metadata)}'
if args.dry_run:
    print(json.dumps({'mode':'read-only', 'identities':len(metadata), 'fixedPresentations':sum(bool(by_name[n]['fixedIn']) for n in metadata), 'output':str(args.output), 'cache':str(cache_path), 'wouldExport':pending_outputs},indent=2))
    if pending_outputs:
        raise SystemExit('Output/cache mismatch: export required for the listed files.')
else:
    (args.output/'extraction.json').write_text(json.dumps(metadata,indent=2)+'\n')
    print(f'Exported {len(metadata)} identities, including {sum(bool(by_name[n]["fixedIn"]) for n in metadata)} fixed presentations.')
