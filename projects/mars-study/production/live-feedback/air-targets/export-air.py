"""Restore the complete already-painted scrubber lead, without new painting.

The former compound canvas began at scene x=591 and cut off the return loop.
Expand both chapter presentations identically and extract the missing cable
from the selected original scene master. Run at the repository root with Pillow.
"""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFilter

P = Path(__file__).resolve().parent
ROOT = P.parents[4]
OUT = ROOT / 'stories/mars/assets/live-feedback/air-targets'
RUN = ROOT / 'runs/mars-air-targets'
OUT.mkdir(parents=True, exist_ok=True)
RUN.mkdir(parents=True, exist_ok=True)
OLD = ROOT / 'stories/mars/assets/survival'
SOURCE = ROOT / 'projects/mars-study/production/v12/survival/sources/outdoor-power.png'

# Existing scrubber geometry was [591,294,776,493] in the 780x1688 scene.
# All exported pixels remain at twice scene resolution (four times game size).
box = (548, 294, 776, 493)
size = ((box[2]-box[0])*2, (box[3]-box[1])*2)
offset = ((591-box[0])*2, 0)
for name, filename in [('scrubber-base', 'air-habitat-scrubber.png'),
                       ('fuel-scrubber-base', 'fuel-from-air-and-water-habitat-scrubber.png')]:
    out = Image.new('RGBA', size)
    out.alpha_composite(Image.open(OLD/'items'/filename).convert('RGBA'), offset)
    out.save(OUT/(name+'.png'), optimize=True)

master = Image.open(SOURCE).convert('RGBA')
cell = master.crop((0,512,512,1024)).resize((1560,1560), Image.Resampling.LANCZOS)
poly = [(559,371),(571,375),(572,398),(574,415),(577,425),
        (584,430),(592,431),(602,428),(613,420),(621,416),
        (628,416),(635,420),(632,430),(624,431),(615,434),
        (605,442),(593,447),(580,442),(571,436),(566,426),
        (563,412),(562,393)]
mask = Image.new('L', cell.size)
draw = ImageDraw.Draw(mask)
draw.polygon([(x*2,y*2) for x,y in poly], fill=255)
# The independently fitted scrubber lead includes its own plugged service end.
# This is needed even when it is installed before the solar lead.
port = [(550,350),(580,350),(580,385),(556,385)]
draw.polygon([(x*2,y*2) for x,y in port], fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(1))
cell.putalpha(mask)
overlay = Image.new('RGBA', size)
overlay.alpha_composite(Image.open(OLD/'overlays/habitat-scrubber-power-cable.png').convert('RGBA'), offset)
overlay.alpha_composite(cell.crop(tuple(v*2 for v in box)))
overlay.save(OUT/'scrubber-connected.png', optimize=True)

metadata = {
    'source': str(SOURCE.relative_to(ROOT)), 'sourceCell': [0,512,512,1024],
    'canvasSceneBounds': box, 'runtimeSize': size,
    'artCentrePercent': [((box[0]+box[2])/2)/780*100, ((box[1]+box[3])/2)/1688*100],
    'scrubberHitboxSceneBounds': [598,300,774,483],
    'solarHitboxSceneBounds': [8,302,307,496],
    'missingCableMaskScenePolygon': poly,
    'servicePlugMaskScenePolygon': port,
    'method': 'Pad existing base and overlay identically; extract missing cable from the selected generated master; no painted edits.',
}
(P/'geometry.json').write_text(json.dumps(metadata, indent=2)+'\n')

for solar in [False, True]:
    for plugged in [False, True]:
        bg = Image.open(OLD/'scenes/air.webp').convert('RGBA')
        array = Image.open(OLD/'items'/('air-station-power.png' if solar else 'air-deployed-solar-array.png')).convert('RGBA')
        bg.alpha_composite(array.resize((585,281),Image.Resampling.LANCZOS),(4,226))
        base = Image.open(OUT/'scrubber-base.png').convert('RGBA')
        if plugged: base.alpha_composite(overlay)
        bg.alpha_composite(base.resize((228,199),Image.Resampling.LANCZOS),(548,294))
        bg.resize((390,844),Image.Resampling.LANCZOS).save(RUN/f'air-{int(solar)}-{int(plugged)}.png')
print('Exported complete scrubber cable and registered chapter bases.')
