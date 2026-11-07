"""Export supplied transparent images at deliberate inventory size.

Preserve imagegen's alpha. Mechanical crops remove other sheet cells and unused
margin; no chroma key, redrawing or synthesized isolated scene objects.
"""
import json
from pathlib import Path
from PIL import Image
P=Path(__file__).resolve().parents[1]
STORY=P.parents[4]/'projects/mars-study/mars-v12'
OUT=STORY/'assets/fixed/items'
manifest=json.loads((P/'manuscript-manifest.json').read_text())
art={'items':{}}
record=[]
for req in json.loads((P/'portable-requests.json').read_text()):
 slug=req['source']
 slug={'item-solar-power-lead':'item-habitat-power-lead','item-retort-states':'item-retort-states-r2','item-methane-transfer-hose':'item-methane-transfer-hose-r2'}.get(slug,slug)
 source=P/'sources'/f'{slug}.png';im=Image.open(source).convert('RGBA');cols,rows=req['grid']
 for state,ident in enumerate(req['ids']):
  x,y=state%cols,state//cols
  bounds=(round(x*im.width/cols),round(y*im.height/rows),round((x+1)*im.width/cols),round((y+1)*im.height/rows))
  if slug=='item-retort-states-r2':bounds=(bounds[0],round(im.height*.14),bounds[2],bounds[3])
  cell=im.crop(bounds)
  visible=cell.getchannel('A').point(lambda x:255 if x>24 else 0).getbbox()
  pad=10
  vb=(max(0,visible[0]-pad),max(0,visible[1]-pad),min(cell.width,visible[2]+pad),min(cell.height,visible[3]+pad))
  cell=cell.crop(vb)
  width=100 if ident=='buffered-field-case' else req['displayWidth']
  cell=cell.resize((width*4,round(cell.height*width*4/cell.width)),Image.Resampling.LANCZOS)
  path=OUT/f'{ident}.png';cell.save(path,optimize=True)
  art['items'][ident]={'icon':str(path.relative_to(STORY))}
  record.append(dict(id=ident,source=str(source.relative_to(P)),cellBounds=bounds,alphaBounds=vb,iconPixels=cell.size))
art['items']['unconnected-materials-retort']={'icon':art['items']['disconnected-materials-retort']['icon']}
art['items']['expedition-rover']['position']={'x':50,'y':54}
# Steel is a compact stock symbol, not a vehicle-sized loose construction.
old=STORY/'assets/items/steel.png'
im=Image.open(old).convert('RGBA');im=im.resize((176,round(im.height*176/im.width)),Image.Resampling.LANCZOS)
im.save(OUT/'steel-stock.png',optimize=True)
art['items']['steel']={'icon':'assets/fixed/items/steel-stock.png'}
record.append(dict(id='steel',source=str(old.relative_to(STORY)),iconPixels=im.size))
# Chapter-dependent maturity/weather, separate from a chapter's camera crop.
# Opaque scene crops for these global views are exported alongside fixed views.
for ident,ch in [('potato-bed',12),('soybean-row',12),('lettuce-tray',11),('station-power',29)]:
 art['items'].setdefault(ident,{})['presentations']=[{'chapter':ch,'icon':f'assets/fixed/items/global-ch{ch:02d}-{ident}.png'}]
(P/'artwork-extra.json').write_text(json.dumps(art,indent=2)+'\n')
(P/'portable-exports.json').write_text(json.dumps(record,indent=2)+'\n')
print('Exported',len(record),'portable appearances')
