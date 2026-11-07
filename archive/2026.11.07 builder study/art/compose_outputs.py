"""Deterministic delivery composition from canonical Blender renders.

No painting or inferred machinery: optical insets are actual rendered eye views.
"""
import argparse,json,hashlib
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
p=argparse.ArgumentParser();p.add_argument('--renders',required=True);p.add_argument('--project',required=True);p.add_argument('--partial',action='store_true');p.add_argument('--ids',default='')
a=p.parse_args();src=Path(a.renders);project=Path(a.project);assets=project/'assets';(assets/'rewards').mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',44)
records=[]
cover=Image.open(src/'cover.png').convert('RGB');cover.save(assets/'cover.webp',lossless=True,method=4)
records.append({'output':'assets/cover.webp','sourceSha256':hashlib.sha256((src/'cover.png').read_bytes()).hexdigest(),'pixels':cover.size,'sha256':hashlib.sha256((assets/'cover.webp').read_bytes()).hexdigest()})
master=src/'masters'/'pinwheel.png';im=Image.open(master).convert('RGBA');b=im.getchannel('A').getbbox();side=max(b[2]-b[0],int((b[3]-b[1])*.72));cx=(b[0]+b[2])/2
box=(round(cx-side/2)-12,b[1]-12,round(cx+side/2)+12,b[1]+side+12);crop=im.crop(box);crop.thumbnail((460,460),Image.Resampling.LANCZOS)
icon=Image.new('RGB',(512,512),'#faf5e5');icon.paste(crop,((512-crop.width)//2,(512-crop.height)//2),crop);icon.save(project/'icon.png',optimize=True)
records.append({'output':'icon.png','sourceSha256':hashlib.sha256(master.read_bytes()).hexdigest(),'crop':box})
rewards=['pinwheel','wind-racer','pinball-table','crank-dragon','periscope','kaleidoscope','lifting-crane','wave-machine','pneumatic-grabber','animation-drum','drawing-rover','shadow-theatre','balanced-lift','fair-in-the-air']
if a.ids:rewards=[ident for ident in rewards if ident in a.ids.split(',')]
for ident in rewards:
 source=src/'rewards'/(ident+'.png')
 if not source.exists():
  if a.partial:continue
  raise FileNotFoundError(source)
 im=Image.open(source).convert('RGB');inputs=[source]
 if ident in {'periscope','kaleidoscope'}:
  eye=src/'rewards'/'periscope-eye.png' if ident=='periscope' else src/'kaleidoscope-eye-final.png'
  if not eye.exists():
   if a.partial:continue
   raise FileNotFoundError(eye)
  inputs.append(eye);inset=Image.open(eye).convert('RGB')
  if ident=='kaleidoscope':
   # The optical effect earns half the page. Both complete views remain visible.
   garden=im.copy();garden.thumbnail((600,600),Image.Resampling.LANCZOS)
   im=Image.new('RGB',(1280,900),'#faf5e5');inset.thumbnail((600,600),Image.Resampling.LANCZOS)
   im.paste(inset,(20,130));im.paste(garden,(660,130+(600-garden.height)//2));draw=ImageDraw.Draw(im)
   draw.text((30,755),'Mirror view',font=font,fill='#294849');draw.text((670,755),'On the garden table',font=font,fill='#294849')
  else:
   inset.thumbnail((300,300),Image.Resampling.LANCZOS);x=28;y=28
   draw=ImageDraw.Draw(im);draw.rounded_rectangle((x-8,y-8,x+308,y+366),radius=12,fill='#faf5e5',outline='#587b7c',width=2)
   im.paste(inset,(x,y));draw.text((x+9,y+308),'Lower window',font=font,fill='#294849')
 if ident in {'shadow-theatre','fair-in-the-air'}:
  eye=src/'rewards'/(ident+'-screen.png')
  if not eye.exists():
   if a.partial:continue
   raise FileNotFoundError(eye)
  inputs.append(eye);inset=Image.open(eye).convert('RGB');inset.thumbnail((300,300),Image.Resampling.LANCZOS)
  x=im.width-344;y=28;draw=ImageDraw.Draw(im)
  draw.rounded_rectangle((x-8,y-8,x+308,y+366),radius=12,fill='#faf5e5',outline='#587b7c',width=2)
  im.paste(inset,(x,y));draw.text((x+9,y+308),'Screen detail',font=font,fill='#294849')
 target=assets/'rewards'/(ident+'.webp');im.save(target,lossless=True,method=4)
 records.append({'output':str(target.relative_to(project)),'inputs':[{'name':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for f in inputs],'pixels':im.size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()})
(project/'scene-export-manifest.json').write_text(json.dumps(records,indent=2)+'\n')
print('Composed',len(records)-2,'reward stills, cover and catalogue icon')
