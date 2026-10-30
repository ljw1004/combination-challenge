"""Read-only cache validation. Never rewrites observations or re-blesses changed bytes."""
from pathlib import Path
import hashlib
import json
from PIL import Image

ROOT = Path(__file__).resolve().parent
records = sorted((ROOT / 'metadata').glob('*.verified.json'))
assert len(records) == 2, 'Expected exactly two approved corrective assets'
for record in records:
    data = json.loads(record.read_text())
    assert data['status'] == 'VERIFIED_PIXELS'
    assert data['explicitNegatives'] and data['unresolvedAmbiguities'] and data['features']
    for key in ['asset', 'sourceImage', 'intendedPrompt']:
        info = data[key]
        path = ROOT / info['path']
        assert hashlib.sha256(path.read_bytes()).hexdigest() == info['sha256'], f'{record.name}: {key} changed; renewed inspection required'
        assert path.stat().st_size == info['bytes']
        if key != 'intendedPrompt':
            with Image.open(path) as im:
                assert (im.width, im.height, im.mode) == (info['width'], info['height'], info['mode'])
                assert abs(im.width / im.height - 390 / 844) < 0.001
    original = data['sourceRelation']['sourceArtBefore']
    assert hashlib.sha256((ROOT / original['path']).read_bytes()).hexdigest() == original['sha256']
    runtime = ROOT / 'runtime' / 'public' / data['sourceRelation']['proposedRuntimeAsset'].lstrip('/')
    assert hashlib.sha256(runtime.read_bytes()).hexdigest() == data['asset']['sha256']
    for feature in data['features']:
        r = feature['region']
        assert all(0 <= r[k] <= 1 for k in ['x', 'y', 'width', 'height'])
        assert r['x'] + r['width'] <= 1.000001 and r['y'] + r['height'] <= 1.000001
    print(f"PASS {record.name}: final asset, original PNG, prompt, preserved predecessor, runtime alias, dimensions, feature regions")
print('PASS metadata cache records match their exact assets; integrated UI/browser QA not claimed.')
