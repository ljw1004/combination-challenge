"""Register the selected side-profile core family and compact four-place rack.

Pillow and NumPy required. Only crops, alpha cleanup, uniform scaling, masks and
compositing are mechanical; all changed visual content comes from imagegen.
"""
from pathlib import Path
import json
from collections import deque
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

P = Path(__file__).resolve().parent
ROOT = P.parents[4]
OUT = ROOT / 'stories/mars/assets/live-feedback/compact-sample-rack'
RUN = ROOT / 'runs/mars-compact-sample-rack'
OUT.mkdir(parents=True, exist_ok=True)
RUN.mkdir(parents=True, exist_ok=True)

atlas = Image.open(P/'side-on-cores.png').convert('RGBA')
rows = [('cut-source-core', (0,0,1717,310)),
        ('insulated-source-core', (0,310,1717,605)),
        ('remote-ice-core', (0,605,1717,916))]
parts = {}
records = []
for name, box in rows:
    im = atlas.crop(box)
    alpha = im.getchannel('A')
    # Remove detached transparency-edge specks. The central ice cylinder is the
    # sole intended connected component; two-pixel dilation retains its AA edge.
    a = np.asarray(alpha)
    eligible = a > 80
    seed = (im.height//2, im.width//2)
    seen = np.zeros_like(eligible)
    q = deque([seed]); seen[seed] = True
    while q:
        y,x = q.popleft()
        for yy,xx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1)):
            if 0 <= yy < im.height and 0 <= xx < im.width and eligible[yy,xx] and not seen[yy,xx]:
                seen[yy,xx] = True; q.append((yy,xx))
    support = Image.fromarray((seen*255).astype('uint8')).filter(ImageFilter.MaxFilter(5))
    im.putalpha(ImageChops.darker(alpha,support))
    bounds = im.getbbox(); im = im.crop(bounds)
    parts[name] = im
    records.append({'name':name,'atlasRow':box,'rowLocalBounds':bounds})

# All three profiles have the same generated width. A single scale preserves
# their physical diameter; adding insulation can only slightly widen the body.
scale = 368 / max(p.width for p in parts.values())
for row in records:
    name = row['name']; im = parts[name]
    resized = im.resize(tuple(round(v*scale) for v in im.size),Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA',(384,128))
    origin = ((384-resized.width)//2,(128-resized.height)//2)
    canvas.alpha_composite(resized,origin)
    canvas.save(OUT/(name+'.png'),optimize=True)
    row.update({'uniformScale':scale,'runtimeSize':[384,128],
                'displaySize':[96,32],'placedAt':origin,
                'orientation':'orthographic longitudinal profile; horizontal; no end face'})

old_master = P.parent/'core-readability/four-sample-rack.png'
original = Image.open(old_master).convert('RGBA').resize((780,1688),Image.Resampling.LANCZOS)
selected = Image.open(P/'cabin-compact-rack.png').convert('RGBA').resize(original.size,Image.Resampling.LANCZOS)
# Limit the edit to the rear wall panel. Everything outside it, including cabin
# floor, chair, lights, right-side instruments and left piping, stays pixel exact.
mask = Image.new('L',original.size)
ImageDraw.Draw(mask).rectangle((79,116,654,582),fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(4))
protect = Image.new('L',original.size)
ImageDraw.Draw(protect).rectangle((554,127,643,203),fill=255)
protect = protect.filter(ImageFilter.GaussianBlur(3))
mask = ImageChops.subtract(mask,protect)
scene = Image.composite(selected,original,mask)
scene.convert('RGB').save(OUT/'the-things-we-take.webp',lossless=True,method=6)

# One scene rectangle supplies the entire compound's target, and every slot
# overlay uses this identical rectangle/canvas/centre. The base remains painted
# into the background; its PNG only defines one complete receiving area.
rack_bounds = (173,301,569,435)
rack_centre = ((rack_bounds[0]+rack_bounds[2])/2,(rack_bounds[1]+rack_bounds[3])/2)
runtime_size = ((rack_bounds[2]-rack_bounds[0])*2,(rack_bounds[3]-rack_bounds[1])*2)
Image.new('RGBA',runtime_size).save(OUT/'sample-rack-target.png',optimize=True)
slots = [
    {'name':'source','portable':'insulated-source-core','left':194,'bottom':348,
     'strapBounds':(270,319,285,359)},
    {'name':'remote','portable':'remote-ice-core','left':384,'bottom':348,
     'strapBounds':(461,319,477,359)},
]
layers = {}
for slot in slots:
    im = parts[slot['portable']]
    fitted = im.resize((168,round(im.height*168/im.width)),Image.Resampling.LANCZOS)
    origin = (slot['left'],slot['bottom']-fitted.height)
    layer = Image.new('RGBA',scene.size); layer.alpha_composite(fitted,origin)
    # Extract the pre-existing retaining strap in front of the inserted core.
    strap_mask=Image.new('L',scene.size)
    ImageDraw.Draw(strap_mask).rectangle(slot['strapBounds'],fill=255)
    pixels=np.asarray(scene).astype('int16')
    teal=Image.fromarray(((pixels[:,:,1]-pixels[:,:,0]>2)*255).astype('uint8'))
    strap_mask=ImageChops.darker(strap_mask,teal).filter(ImageFilter.GaussianBlur(.25))
    strap=scene.copy();strap.putalpha(strap_mask);layer.alpha_composite(strap)
    layer.crop(rack_bounds).resize(runtime_size,Image.Resampling.LANCZOS).save(OUT/('stowed-'+slot['name']+'-core.png'),optimize=True)
    layers[slot['name']]=layer
    slot.update({'coreSceneOrigin':origin,'coreSceneSize':list(fitted.size),
                 'runtimeFile':'stowed-'+slot['name']+'-core.png'})

data={
    'selectedCoreMaster':'side-on-cores.png','selectedCabinMaster':'cabin-compact-rack.png',
    'preservedCabinSource':str(old_master.relative_to(ROOT)),
    'sceneSize':[780,1688],'rearWallMaskBounds':[79,116,654,582],
    'maskGaussianBlur':4,'protectedVentBounds':[554,127,643,203],
    'rackSceneBounds':rack_bounds,'rackSceneCentre':rack_centre,
    'rackPositionPercent':[rack_centre[0]/780*100,rack_centre[1]/1688*100],
    'rackRuntimeSize':runtime_size,'rackDisplaySize':[v/4 for v in runtime_size],
    'base':'sample-rack-target.png','sameCanvasForBaseAndEveryOverlay':True,
    'arrangement':'2x2 compact slots; upper left local, upper right remote; lower two remain empty',
    'portableFamily':records,'slotOverlays':slots,
}
(P/'geometry.json').write_text(json.dumps(data,indent=2)+'\n')

for names in [[],['source'],['remote'],['source','remote']]:
    proof=scene.copy()
    for name in names:proof.alpha_composite(layers[name])
    key='-'.join(names) or 'empty'
    proof.resize((390,844),Image.Resampling.LANCZOS).convert('RGB').save(RUN/(key+'-proof.png'))
    proof.crop((160,290,585,450)).resize((1275,480),Image.Resampling.LANCZOS).convert('RGB').save(RUN/(key+'-rack.png'))

lab=Image.open(ROOT/'stories/mars/assets/live-feedback/local-core-laboratory.webp').convert('RGBA').resize((390,844),Image.Resampling.LANCZOS)
for i,name in enumerate(parts):
    im=Image.open(OUT/(name+'.png')).resize((96,32),Image.Resampling.LANCZOS)
    lab.alpha_composite(im,(147,330+i*95))
lab.convert('RGB').save(RUN/'portable-family-proof.png')
print(json.dumps({'runtimeSize':runtime_size,'centrePercent':data['rackPositionPercent'],'exports':len(list(OUT.iterdir()))}))
