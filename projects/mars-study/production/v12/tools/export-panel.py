"""Register generated illuminated lenses on the unchanged generated panel."""
import sys
sys.dont_write_bytecode = True
import importlib.util
import json
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[5]
PROD=ROOT/'projects/mars-study/production/v12'
STORY=ROOT/'projects/mars-study/mars-v12'
spec=importlib.util.spec_from_file_location('atlas',PROD.parent/'tools/export-atlases.py')
atlas=importlib.util.module_from_spec(spec);spec.loader.exec_module(atlas)
source=PROD/'atlases/11-service-panel.png'
objects=atlas.atlas_objects(Image.open(source),3,2)
cut,box,_=objects[0]
bbox=cut.getchannel('A').point(lambda a:255 if a>24 else 0).getbbox()
ratio=170*4/max(bbox[2]-bbox[0],bbox[3]-bbox[1])
base=atlas.frame(cut,170)
padded=Image.new('RGBA',((base.width+3)//4*4,(base.height+3)//4*4));padded.alpha_composite(base);base=padded
base_path='assets/items/station-service-panel.png'
(STORY/'assets/overlays').mkdir(parents=True,exist_ok=True)
base.save(STORY/base_path,optimize=True)
# Source-space indicator centres and outside-bezel sizes measured on the master.
registrations=[('reserve','name:Charged essential reserve',151,191,90,94),('well','name:Insulated water line',347,191,90,94),('fuel','name:Running fuel fab',151,401,90,94),('solar','id:restored-power',347,401,90,94)]
slots=[];layers=[]
for n,(slug,accepts,x,y,w,h) in enumerate(registrations):
    lamp,_,_=objects[n+1]
    lb=lamp.getchannel('A').point(lambda a:255 if a>2 else 0).getbbox();lamp=lamp.crop(lb)
    lamp=lamp.resize((round(w*ratio),round(h*ratio)),Image.Resampling.LANCZOS)
    layer=Image.new('RGBA',base.size)
    location=(round((x-box[0])*ratio+12-lamp.width/2),round((y-box[1])*ratio+12-lamp.height/2))
    layer.alpha_composite(lamp,location)
    asset=f'assets/overlays/panel-{slug}.png';layer.save(STORY/asset,optimize=True);layers.append(layer)
    slots.append(dict(owner='name:Station service panel',accepts=accepts,path=asset,sourceCell=n+2,sourceIndicatorCentre=[x,y],sourceIndicatorSize=[w,h],outputOrigin=list(location)))
manifest=dict(source=str(source.relative_to(ROOT)),sourceGrid=dict(columns=3,rows=2),baseCrop=box,baseScale=ratio,basePadding=12,items=[dict(id='name:Station service panel',path=base_path)],slots=slots,note='Each fitted layer illuminates one existing command-status indicator. Actual equipment is not installed inside the panel; symbols and switches remain visible.')
(PROD/'assembly-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
out=ROOT/'runs/mars-v12';out.mkdir(parents=True,exist_ok=True)
proof=Image.new('RGB',(800,840),'#bfa786');d=ImageDraw.Draw(proof)
for mask in range(16):
    im=base.copy()
    for n,layer in enumerate(layers):
        if mask&(1<<n):im.alpha_composite(layer)
    im=im.resize((im.width//4,im.height//4),Image.Resampling.LANCZOS)
    proof.paste(im,(mask%4*200+(200-im.width)//2,mask//4*210),im)
    d.text((mask%4*200+8,mask//4*210+190),f'{mask:04b}',fill='#222222')
proof.save(out/'panel-states.jpg',quality=94)
print('Panel base and four registered lenses exported; all16 fit states composed.')
