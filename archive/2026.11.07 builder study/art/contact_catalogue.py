"""Disposable actual-size family sheets for informed continuity review."""
import argparse,json,math,hashlib
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
p=argparse.ArgumentParser();p.add_argument('--catalogue',required=True);p.add_argument('--assets',required=True);p.add_argument('--output',required=True)
a=p.parse_args();c=json.loads(Path(a.catalogue).read_text());assets=Path(a.assets);out=Path(a.output);out.mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',12)
hotspots={x for ch in c['chapters'] for x in ch['hotspots']};families={};records=[]
for i in c['items']:families.setdefault(i['family'],[]).append(i)
for family,items in families.items():
 items.sort(key=lambda i:(len(i['states']),i['line']))
 for batch in range(math.ceil(len(items)/12)):
  subset=items[batch*12:(batch+1)*12]
  sizes=[]
  for item in subset:
   source=assets/('hotspots' if item['id'] in hotspots else 'items')/(item['id']+'.webp')
   with Image.open(source) as candidate:sizes.append(tuple(round(v/4) for v in candidate.size))
  cell_width=max(252,max(s[0] for s in sizes)+16)
  cell_height=max(280,max(s[1] for s in sizes)+32)
  sheet=Image.new('RGB',(4*cell_width,3*cell_height),'#faf5e5');draw=ImageDraw.Draw(sheet)
  for n,item in enumerate(subset):
   source=assets/('hotspots' if item['id'] in hotspots else 'items')/(item['id']+'.webp')
   if not source.exists():raise FileNotFoundError(source)
   im=Image.open(source).convert('RGBA');size=tuple(round(v/4) for v in im.size);im=im.resize(size,Image.Resampling.LANCZOS)
   x=(n%4)*cell_width+(cell_width-im.width)//2;y=(n//4)*cell_height+24+(cell_height-24-im.height)//2
   sheet.paste(im,(x,y),im);draw.text(((n%4)*cell_width+8,(n//4)*cell_height+6),item['id'],font=font,fill='#263d3f')
   records.append({'id':item['id'],'image':str(source),'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'displayPixels':size,'sheet':f'{family}-{batch+1}.png'})
  sheet.save(out/f'{family}-{batch+1}.png')
(out/'inputs.json').write_text(json.dumps({'storyHash':c['storyHash'],'items':records},indent=2))
print('Prepared',len(records),'actual-size illustrations')
