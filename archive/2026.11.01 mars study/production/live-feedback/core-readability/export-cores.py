"""Extract matching ice-core states from the selected generated pair.

Run with Pillow. This only removes negligible exterior alpha, crops, uniformly
resizes and registers existing artwork; it does not paint specimen details.
"""
from pathlib import Path
import json
from PIL import Image, ImageChops, ImageFilter

P = Path(__file__).resolve().parent
ROOT = P.parents[4]
OUT = ROOT / 'stories/mars/assets/live-feedback/core-readability'
RUN = ROOT / 'runs/mars-core-readability'
OUT.mkdir(parents=True, exist_ok=True)
RUN.mkdir(parents=True, exist_ok=True)
source = Image.open(P / 'core-pair.png').convert('RGBA')
rows = [
    ('cut-source-core', (0, 0, 1536, 512), 11.471771553815294),
    ('insulated-source-core', (0, 512, 1536, 1024), 11.057042799514587),
]
extracted = []
for name, box, angle in rows:
    crop = source.crop(box)
    alpha = crop.getchannel('A')
    support = alpha.point(lambda v: 255 if v > 32 else 0).filter(ImageFilter.MaxFilter(5))
    crop.putalpha(ImageChops.darker(alpha, support))
    bounds = crop.getbbox()
    rotated = crop.crop(bounds).rotate(angle, Image.Resampling.BICUBIC, expand=True)
    rotated = rotated.crop(rotated.getbbox())
    extracted.append((name, box, bounds, rotated, angle))

# One scale for both states keeps the ice core the same physical size: wrapping
# can increase the silhouette slightly but cannot shrink or rotate its contents.
scale = min(368 / max(row[3].width for row in extracted),
            184 / max(row[3].height for row in extracted))
records = []
for name, box, bounds, im, angle in extracted:
    size = tuple(round(v * scale) for v in im.size)
    im = im.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (384, 200))
    origin = ((384 - im.width) // 2, (200 - im.height) // 2)
    canvas.alpha_composite(im, origin)
    canvas.save(OUT / (name + '.png'), optimize=True)
    records.append({'runtime': name + '.png', 'sourceRow': box,
                    'rowLocalBounds': bounds, 'scale': scale,
                    'pixelSize': [384, 200], 'displaySize': [96, 50],
                    'placedAt': origin, 'counterclockwiseRotationDegrees': angle,
                    'orientation': 'horizontal long axis, right cut face visible'})

remote = ROOT / 'stories/mars/assets/survival/items/remote-ice-core.png'
im = Image.open(remote).convert('RGBA')
alpha = im.getchannel('A')
support = alpha.point(lambda v: 255 if v > 32 else 0).filter(ImageFilter.MaxFilter(5))
im.putalpha(ImageChops.darker(alpha, support))
remote_angle = 12.5129351300005
im = im.rotate(remote_angle, Image.Resampling.BICUBIC, expand=True)
im = im.crop(im.getbbox())
im.thumbnail((368, 184), Image.Resampling.LANCZOS)
canvas = Image.new('RGBA', (384, 200))
origin = ((384-im.width)//2, (200-im.height)//2)
canvas.alpha_composite(im, origin)
canvas.save(OUT/'remote-horizontal.png', optimize=True)
records.append({'runtime': 'remote-horizontal.png', 'input': str(remote.relative_to(ROOT)),
                'counterclockwiseRotationDegrees': remote_angle,
                'pixelSize': [384,200], 'displaySize': [96,50], 'placedAt': origin,
                'orientation': 'horizontal long axis, right cut face visible'})

(P / 'geometry.json').write_text(json.dumps({
    'selectedSource': 'core-pair.png',
    'operation': 'alpha support threshold32 with2px preservation; crop; rotate measured cylinder axes horizontal; same local-pair uniform scale; centre on common canvas',
    'remoteCore': str(remote.relative_to(ROOT)),
    'remoteDecision': 'Rotate the existing visibly icy specimen with continuous brown mineral band to the same horizontal axis; original source remains unchanged.',
    'assets': records,
}, indent=2) + '\n')

# Temporary producer proofs on actual chapter background at reference play size.
lab = Image.open(ROOT / 'stories/mars/assets/live-feedback/local-core-laboratory.webp').convert('RGBA').resize((390, 844), Image.Resampling.LANCZOS)
for name, path in [('cut', OUT / 'cut-source-core.png'),
                   ('insulated', OUT / 'insulated-source-core.png'),
                   ('remote', OUT/'remote-horizontal.png')]:
    im = Image.open(path).convert('RGBA')
    im = im.resize((im.width//4, im.height//4), Image.Resampling.LANCZOS)
    proof = lab.copy()
    proof.alpha_composite(im, ((390-im.width)//2, 415))
    proof.convert('RGB').save(RUN / (name + '-lab.png'))
print('Exported three horizontal portable core appearances.')
