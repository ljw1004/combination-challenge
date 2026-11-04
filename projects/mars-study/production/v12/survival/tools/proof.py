"""Disposable playing-size proofs; never retained production artwork."""
from pathlib import Path
from PIL import Image, ImageDraw
import json
P=Path(__file__).resolve().parents[1];ROOT=P.parents[4];STORY=ROOT/'projects/mars-study/mars-v12'
OUT=ROOT/'runs/mars-survival/proofs';OUT.mkdir(parents=True,exist_ok=True)
a=json.loads((P/'artwork.json').read_text());r=json.loads((P/'registration.json').read_text())
for rec in r['scenes']:
 ch=rec['chapter'];meta=a['chapters'][ch];bg=Image.open(STORY/meta['image']).convert('RGBA').resize((390,844));frame=rec['cells'][0];frameHeight=390*(frame[3]-frame[1])/(frame[2]-frame[0]);height=min(550,max(round(frameHeight)+20,max((round(v['bounds'][3]/2)+35 for v in rec['regions']),default=0)))
 panels=[('background',bg.copy())];allim=bg.copy()
 for x in rec['regions']:
  ident=x['id'];m=meta['fixed'][ident];im=Image.open(STORY/m['icon']);im=im.resize((im.width//4,im.height//4));pos=(round(m['x']*3.9-im.width/2),round(m['y']*8.44-im.height/2));comp=bg.copy();comp.alpha_composite(im,pos);allim.alpha_composite(im,pos);panels.append((ident,comp))
  for accepts,path in a['items'].get(ident,{}).get('slots',{}).items():
   overlay=Image.open(STORY/path);overlay=overlay.resize(im.size);slot=comp.copy();slot.alpha_composite(overlay,pos);allim.alpha_composite(overlay,pos);panels.append((accepts,slot))
 panels.append(('all declared appearances',allim));cols=min(3,len(panels));rows=(len(panels)+cols-1)//cols;sheet=Image.new('RGB',(390*cols,(height+23)*rows),'#eeeeee');d=ImageDraw.Draw(sheet)
 for i,(name,im) in enumerate(panels):
  x,y=i%cols*390,i//cols*(height+23);sheet.paste(im.crop((0,0,390,height)),(x,y+23));d.text((x+5,y+4),name,fill='black')
 sheet.save(OUT/f'{ch}.jpg',quality=92)
# Each portable at its intended size on light, dark and Martian grounds.
for rec in r['portables']:
 ident=rec['id'];im=Image.open(STORY/a['items'][ident]['icon']);im=im.resize((im.width//4,im.height//4));w=max(120,im.width+20);h=max(100,im.height+20);sheet=Image.new('RGB',(w*3,h))
 for i,col in enumerate(['#faf6ed','#232a31','#b7774e']):
  panel=Image.new('RGBA',(w,h),col);panel.alpha_composite(im,((w-im.width)//2,(h-im.height)//2));sheet.paste(panel,(i*w,0))
 sheet.save(OUT/f'{ident}.png')
print('Scratch proofs:',OUT)
