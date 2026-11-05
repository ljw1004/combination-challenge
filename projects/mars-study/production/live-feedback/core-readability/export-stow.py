"""Register horizontal cores inside the original four-place mission cold rack.

Requires Pillow and NumPy. Uses the selected complete cabin painting and previously
generated core artwork; the foreground lips and straps are extracted from the
same background so samples sit inside their existing holders.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

P = Path(__file__).resolve().parent
ROOT = P.parents[4]
OUT = ROOT/'stories/mars/assets/live-feedback/core-readability'
RUN = ROOT/'runs/mars-core-readability/stow-revision'
OUT.mkdir(parents=True,exist_ok=True)
RUN.mkdir(parents=True,exist_ok=True)
master = Image.open(P/'four-sample-rack.png').convert('RGBA')
scene = master.resize((780,1688),Image.Resampling.LANCZOS)
scene.convert('RGB').save(OUT/'the-things-we-take.webp',lossless=True,method=6)

slots = [
    {'name':'source','bounds':[134,278,356,376],'centre':[245,327],
     'core':'insulated-source-core.png','coreCentre':[245,326],
     'foreground':[
         [(139,318),(151,318),(154,332),(160,342),(171,350),(184,355),(312,355),(323,352),(333,343),(338,332),(340,318),(351,318),(353,366),(139,366)],
         [(320,309),(327,307),(339,310),(334,315),(328,326),(319,344),(312,354),(290,354),(298,342),(306,326),(314,313)],
     ]},
    {'name':'remote','bounds':[375,278,597,376],'centre':[486,327],
     'core':'remote-horizontal.png','coreCentre':[486,326],
     'foreground':[
         [(381,318),(393,318),(396,332),(403,341),(414,350),(427,355),(542,355),(553,350),(563,340),(567,328),(569,318),(581,318),(581,366),(380,366)],
         [(555,309),(562,307),(574,310),(569,315),(563,326),(554,344),(547,354),(525,354),(533,342),(541,326),(549,313)],
     ]},
]
records=[]
layers={}
for slot in slots:
    core=Image.open(OUT/slot['core']).convert('RGBA').resize((192,100),Image.Resampling.LANCZOS)
    layer=Image.new('RGBA',scene.size)
    x,y=slot['coreCentre'];layer.alpha_composite(core,(x-96,y-50))
    mask=Image.new('L',scene.size);d=ImageDraw.Draw(mask)
    d.polygon(slot['foreground'][0],fill=255)
    strap=Image.new('L',scene.size)
    ImageDraw.Draw(strap).polygon(slot['foreground'][1],fill=255)
    pixels=np.asarray(scene).astype('int16')
    teal=Image.fromarray(((pixels[:,:,1]-pixels[:,:,0]>2)*255).astype('uint8'))
    strap=ImageChops.darker(strap,teal).filter(ImageFilter.MaxFilter(3))
    mask=ImageChops.lighter(mask,strap)
    mask=mask.filter(ImageFilter.GaussianBlur(.35))
    front=scene.copy();front.putalpha(mask);layer.alpha_composite(front)
    crop=layer.crop(slot['bounds'])
    runtime=crop.resize((crop.width*2,crop.height*2),Image.Resampling.LANCZOS)
    runtime.save(OUT/('stowed-'+slot['name']+'-core.png'),optimize=True)
    layers[slot['name']]=layer
    records.append({**slot,'runtimeSize':runtime.size,
                    'positionPercent':[x/780*100,327/1688*100],
                    'displaySize':[runtime.width/4,runtime.height/4],
                    'fixedResultAndTargetUseSameCentre':True})
Image.new('RGBA',(444,196)).save(OUT/'core-cradle-target.png',optimize=True)
(P/'stow-geometry.json').write_text(json.dumps({
    'source':'four-sample-rack.png','runtimeScene':'the-things-we-take.webp',
    'sceneSize':[780,1688],'compartment':'one four-place mission cold rack, 2x2 horizontal holders',
    'activeSlots':'upper left source, upper right remote; lower two remain visibly empty decoration',
    'sharedTarget':'core-cradle-target.png','slots':records,
},indent=2)+'\n')
for names in [[],['source'],['remote'],['source','remote']]:
    proof=scene.copy()
    for name in names:proof.alpha_composite(layers[name])
    key='-'.join(names) or 'empty'
    proof.resize((390,844),Image.Resampling.LANCZOS).convert('RGB').save(RUN/(key+'-proof.png'))
    proof.crop((90,220,625,510)).resize((1070,580),Image.Resampling.LANCZOS).convert('RGB').save(RUN/(key+'-rack.png'))
print('Exported one four-place rack and two independent occupied states.')
