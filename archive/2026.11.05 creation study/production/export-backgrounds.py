"""Deterministic equal-cell background extraction, with no stretching.

uv run --with pillow python projects/creation-study/production/export-backgrounds.py
Sources default to retained selected production masters; --masters can point to
generation scratch during production. The plan records exact logical cell and crop bounds.
"""
import argparse
import hashlib
import json
from pathlib import Path
from production_paths import repo_root, runtime_assets
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = repo_root(HERE)
PLAN = HERE / 'background-plan.json'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--masters', type=Path, default=HERE / 'masters')
parser.add_argument('--output', type=Path, default=runtime_assets(HERE) / 'backgrounds')
parser.add_argument('--allow-missing', action='store_true')
parser.add_argument('--dry-run', action='store_true', help='Check selected sources, geometry and runtime hashes without writing files')
args = parser.parse_args()
plan = json.loads(PLAN.read_text())
if not args.dry_run:
    args.output.mkdir(parents=True, exist_ok=True)
target = tuple(plan['export']['dimensions'])
ratio = target[0] / target[1]
missing = []
written = []
stale = []
selected_names = [name for source in plan['sources'] for name in source['names'] if name is not None]
assert len(selected_names) == len(set(selected_names)), 'Duplicate selected background identity'
assert set(selected_names) == set(plan['backgrounds']), 'Selected sources must cover the runtime backgrounds exactly'

def centered_bounds(cell):
    left, top, right, bottom = cell
    width, height = right-left, bottom-top
    crop_width = min(width, height*ratio)
    crop_height = crop_width/ratio
    x0 = left + (width-crop_width)/2
    y0 = top + (height-crop_height)/2
    return (x0, y0, x0+crop_width, y0+crop_height)

def save_webp(image, destination):
    temporary = destination.with_suffix('.webp.tmp')
    image.save(temporary, format='WEBP', quality=92, method=4)
    temporary.replace(destination)

for source in plan['sources']:
    path = args.masters / source['file']
    if not path.exists():
        missing.append(str(path))
        source['status'] = 'pending-source'
        continue
    with Image.open(path) as loaded:
        image = loaded.convert('RGB')
    cols, rows = source['grid']
    assert len(source['names']) == cols*rows
    recorded_source_hash = source.get('sourceSha256')
    source['sourceDimensions'] = list(image.size)
    source['sourceSha256'] = hashlib.sha256(path.read_bytes()).hexdigest()
    source['status'] = 'exported'
    for index, name in enumerate(source['names']):
        if name is None:
            # Retained source panel superseded by a separate selected master.
            continue
        x, y = index%cols, index//cols
        # Fractional cell boundaries preserve exactly equal logical cells even
        # when an atlas width is not divisible by three. Pillow's resize box
        # samples the centered crop directly, avoiding rounded unequal splits.
        cell = (x*image.width/cols, y*image.height/rows,
                (x+1)*image.width/cols, (y+1)*image.height/rows)
        crop = centered_bounds(cell)
        assert abs((crop[2]-crop[0])/(crop[3]-crop[1])-ratio) < 1e-9
        destination = args.output / f'{name}.webp'
        record = plan['backgrounds'][name]
        if args.dry_run:
            current = (recorded_source_hash == source['sourceSha256']
                       and record.get('source') == source['file']
                       and record.get('cropBounds') == list(crop)
                       and destination.exists()
                       and record.get('outputSha256') == hashlib.sha256(destination.read_bytes()).hexdigest())
            if current:
                with Image.open(destination) as output:
                    current = output.size == target
            if not current:
                stale.append(str(destination))
            written.append(name)
            if name == plan['catalogueThumbnail']['background']:
                thumb_path = args.output / plan['catalogueThumbnail']['file']
                thumb_current = (thumb_path.exists() and plan['catalogueThumbnail'].get('outputSha256') == hashlib.sha256(thumb_path.read_bytes()).hexdigest())
                if thumb_current:
                    with Image.open(thumb_path) as thumb:
                        thumb_current = list(thumb.size) == plan['catalogueThumbnail']['dimensions']
                if not thumb_current:
                    stale.append(str(thumb_path))
            continue
        exported = image.resize(target, resample=Image.Resampling.LANCZOS, box=crop)
        save_webp(exported, destination)
        record.update({
            'source': source['file'],
            'cellIndex': index,
            'cellBounds': list(cell),
            'cellDimensions': [cell[2]-cell[0], cell[3]-cell[1]],
            'cropBounds': list(crop),
            'cropBoundsWithinCell': [crop[0]-cell[0], crop[1]-cell[1],
                                     crop[2]-cell[0], crop[3]-cell[1]],
            'cropDimensions': [crop[2]-crop[0], crop[3]-crop[1]],
            'outputDimensions': list(target),
            'outputSha256': hashlib.sha256(destination.read_bytes()).hexdigest(),
            'status': 'exported',
        })
        written.append(name)
        if name == plan['catalogueThumbnail']['background']:
            size = tuple(plan['catalogueThumbnail']['dimensions'])
            thumb_crop = tuple(plan['catalogueThumbnail']['cropBoundsWithinBackground'])
            assert abs((thumb_crop[2]-thumb_crop[0])/(thumb_crop[3]-thumb_crop[1])-size[0]/size[1]) < 1e-9
            thumbnail = exported.resize(size, resample=Image.Resampling.LANCZOS, box=thumb_crop)
            thumb_path = args.output / plan['catalogueThumbnail']['file']
            save_webp(thumbnail, thumb_path)
            plan['catalogueThumbnail'].update({
                'status': 'exported',
                'outputSha256': hashlib.sha256(thumb_path.read_bytes()).hexdigest(),
            })
if not args.dry_run:
    PLAN.write_text(json.dumps(plan, indent=2)+'\n')
print(json.dumps({'mode': 'read-only' if args.dry_run else 'export', 'backgroundsChecked' if args.dry_run else 'backgroundsExported': len(written), 'dimensions': list(target),
                  'thumbnail': plan['catalogueThumbnail'].get('status', 'pending-source'),
                  'missingSources': missing, 'outputMismatches': stale}, indent=2))
if stale:
    raise SystemExit('Runtime background hashes or geometry do not match the selected plan.')
if missing and not args.allow_missing:
    raise SystemExit('Required background sources are still missing.')
