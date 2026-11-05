"""Mechanical extraction, registration and reuse of selected generated art.
Run at repository root with Pillow and NumPy. Painting changes use recorded imagegen requests.
Coordinates below use the existing 780-wide scene, runtime icons twice those scene pixels.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image,ImageDraw,ImageFilter
P=Path('projects/mars-study/production/live-feedback/fuel');D=Path('stories/mars/assets/live-feedback/fuel');D.mkdir(exist_ok=True)
S=Path('stories/mars/assets/survival');Q=Path('runs/mars-live-feedback/fuel');Q.mkdir(parents=True,exist_ok=True)
records=[]
def read(path):return Image.open(path).convert('RGBA')
def square(name):return read(P/(name+'.png')).resize((780,780),Image.Resampling.LANCZOS)
def solid_bbox(im):return im.getchannel('A').point(lambda a:255 if a>32 else 0).getbbox()
def save(im,name):
 if name.endswith('.webp'):im.save(D/name,lossless=True,method=6)
 else:im.save(D/name)
def selected(im,polygon,feather=0):
 m=Image.new('L',im.size);ImageDraw.Draw(m).polygon(polygon,fill=255)
 if feather:m=m.filter(ImageFilter.GaussianBlur(feather))
 out=im.copy();out.putalpha(m);return out
# The same gas body, valve, dimensions and mark survive filling and later fitting.
s=read(P/'gas-family.png')
for i,name in enumerate(['empty','h2','o2','co2','ch4']):
 cell=(i*s.width//5,0,(i+1)*s.width//5,s.height);im=s.crop(cell);bounds=solid_bbox(im);im=im.crop(bounds);im.thumbnail((152,460),Image.Resampling.LANCZOS)
 out=Image.new('RGBA',(im.width+16,476));out.alpha_composite(im,((out.width-im.width)//2,8));save(out,'tank-'+name+'.png')
 records.append(dict(name='tank-'+name,source='gas-family.png',cell=cell,bounds=bounds,runtime=list(out.size),display=[v/4 for v in out.size]))
# Cell and service insert extracted from real generated alpha. Common canvas keeps physical position.
s=read(P/'cell-sprites.png');split=round(s.width*.65)
for name,region,size in [('cell',(0,0,split,s.height),(440,336)),('cell-insert',(split,0,s.width,s.height),(208,200))]:
 im=s.crop(region);bounds=solid_bbox(im);im=im.crop(bounds);im.thumbnail((size[0]-16,size[1]-16),Image.Resampling.LANCZOS);out=Image.new('RGBA',size);out.alpha_composite(im,((size[0]-im.width)//2,(size[1]-im.height)//2))
 if name=='cell':
  small=out
  records.append(dict(name=name,source='cell-sprites.png',cell=region,bounds=bounds,extraction_pixels=size,runtime=[600,480],runtime_files=['cell-empty.png','cell-hydrogen.png']))
  # The right receiver repeats only its exact pixels; it adds no surrounding ground.
  crop=out.crop((276,52,440,276));save(crop,'cell-oxygen-outlet.png')
 else:
  save(out,name+'.png');records.append(dict(name=name,source='cell-sprites.png',cell=region,bounds=bounds,runtime=size))
# The receiving canvas includes the existing working rock, giving produced tanks room beside the vessel.
padded=Image.new('RGBA',(600,480));padded.alpha_composite(small,(80,72))
for name in ['cell-empty','cell-hydrogen']:save(padded,name+'.png')
# Remove the obsolete case/display with the selected bare-ground edit, preserve distant scene exactly.
bg=read(S/'scenes/two-gases-from-water.webp');edit=square('water-ground');mask=[(95,310),(460,310),(480,490),(738,490),(738,665),(650,710),(100,700)]
bg.alpha_composite(selected(edit,mask,12));save(bg,'water-scene.webp')
# Reuse the same central chamber and original ceramic contacts. New side tanks/hoses are independent overlays.
bg=read(S/'scenes/fuel-from-air-and-water.webp');save(bg,'fuel-scene.webp')
region=(10,430,770,720);base=Image.new('RGBA',(780,780));old=read(S/'overlays/fuel-assembly-iron-stock.png').resize((764,225),Image.Resampling.LANCZOS);base.alpha_composite(old,(12,432))
def region_export(full,name,box=region):save(full.crop(box).resize(((box[2]-box[0])*2,(box[3]-box[1])*2),Image.Resampling.LANCZOS),name+'.png')
region_export(base,'reactor-base')
connected=square('reactor-connected')
def hose(image,points,width=12):
 # Broad tracing corridor plus grey-material segmentation; no rectangular soil patch.
 m=Image.new('L',image.size);ImageDraw.Draw(m).line(points,fill=255,width=width,joint='curve');a=np.asarray(image);rgb=a[:,:,:3].astype(int);neutral=(rgb.max(2)-rgb.min(2)<48)&(rgb[:,:,0]<163)
 alpha=np.minimum(np.array(m),np.where(neutral,255,0).astype('uint8'));out=image.copy();out.putalpha(Image.fromarray(alpha));return out
for name,x,pts in [('h2',87,[(126,481),(139,487),(151,501),(165,519),(179,526),(190,523),(202,516),(215,515)]),('co2',643,[(519,515),(541,523),(566,531),(591,529),(616,516),(638,496),(658,484),(677,481)])]:
 layer=Image.new('RGBA',(780,780));t=read(D/('tank-'+name+'.png'));t=t.resize((t.width//2,t.height//2),Image.Resampling.LANCZOS);layer.alpha_composite(t,(x,469));layer.alpha_composite(hose(connected,pts));region_export(layer,'reactor-'+name)
power=Image.new('RGBA',(780,780));power.alpha_composite(read(S/'overlays/fuel-assembly-power-cable.png').resize((764,225),Image.Resampling.LANCZOS),(12,432));region_export(power,'reactor-power')
records.append(dict(name='reactor',scene_bounds=region,centre=[390,575],runtime=[1520,580],source='reactor-connected.png',preserved_chamber='assets/survival/overlays/fuel-assembly-iron-stock.png'))
# Permanent leg: erase the catch/temporary blocking only inside the repair site.
lander=read(S/'scenes/the-leg-that-stays.webp');repair=square('lander-no-bricks')
footmask=[(451,577),(460,568),(513,570),(526,590),(531,657),(517,674),(449,672),(438,653),(440,617)]
patch=selected(repair,footmask,5);lander.alpha_composite(patch)
# Same full-size local patch as the existing repair states, to erase the old rock.
repairbox=(343,573,616,679);region_export(lander,'lander-permanent-leg',repairbox)
# Labels and tiny connectors are local edits to the same registered cabin.
labelled=square('lander-labelled')
for box in [(239,390,310,432),(518,404,588,450)]:
 x1,y1,x2,y2=box;lander.alpha_composite(selected(labelled,[(x1,y1),(x2,y1),(x2,y2),(x1,y2)],2))
save(lander,'lander-ports-scene.webp')
transfer=square('lander-transfer')
for name,x,box,pts in [('o2',66,(60,392,310,716),[(100,483),(112,480),(139,489),(165,494),(193,485),(218,465),(242,432),(258,416)]),('ch4',610,(516,414,688,716),[(536,434),(560,456),(589,483),(616,498),(646,501),(676,490),(703,480),(719,483)])]:
 layer=Image.new('RGBA',(780,780));t=read(D/('tank-'+name+'.png'));t=t.resize((t.width//2,t.height//2),Image.Resampling.LANCZOS);layer.alpha_composite(t,(x,470));h=hose(transfer,pts,16)
 if name=='ch4':
  h=h.crop((525,414,735,516)).resize((125,102),Image.Resampling.LANCZOS);layer.alpha_composite(h,(529,414))
 else:layer.alpha_composite(h)
 region_export(layer,'transfer-'+name,box)
 # A transparent receiving area starts at the labelled port; completed art shares its centre.
 region_export(Image.new('RGBA',(780,780)),'port-'+name,box)
 records.append(dict(name='transfer-'+name,scene_bounds=box,centre=[(box[0]+box[2])/2,(box[1]+box[3])/2],runtime=[(box[2]-box[0])*2,(box[3]-box[1])*2]))
# Both existing cold cradles receive the two original wrapped cores. No third specimen.
for name in ['local','remote']:
 canvas=Image.new('RGBA',(600,280));im=read(Path('stories/mars/assets/live-feedback')/(name+'-core-insulated.png'));canvas.alpha_composite(im,((600-im.width)//2,54));save(canvas,'stowed-'+name+'-core.png')
save(Image.new('RGBA',(600,280)),'core-cradle-target.png')
save(read(S/'scenes/the-leg-that-stays.webp'),'lander-repair-scene.webp')
# Optional selected foreground extensions are composited with original upper pixels restored.
for name,cut in [('water-scene',710),('fuel-scene',710),('lander-ports-scene',720),('lander-repair-scene',720)]:
 ext=P/('lander-ports-scene-extension.png' if name=='lander-repair-scene' else name+'-extension.png')
 if ext.exists():
  original=read(D/(name+'.webp'));generated=read(ext).resize(original.size,Image.Resampling.LANCZOS);m=Image.new('L',original.size);arr=np.zeros((1688,780),dtype=np.uint8);arr[cut:cut+100,:]=np.linspace(0,255,100,dtype=np.uint8)[:,None];arr[cut+100:,:]=255;generated.putalpha(Image.fromarray(arr));original.alpha_composite(generated);save(original,name+'.webp')
# Proofs at actual display size.
water=read(D/'water-scene.webp');cell=read(D/'cell-empty.png').resize((300,240));water.alpha_composite(cell,(146,431));water.resize((390,844)).save(Q/'water-proof.png')
fuel=read(D/'fuel-scene.webp')
for name in ['base','power','h2','co2']:
 im=read(D/('reactor-'+name+'.png')).resize((760,290));fuel.alpha_composite(im,(10,430))
fuel.resize((390,844)).save(Q/'reactor-proof.png')
proof=read(D/'lander-ports-scene.webp')
for name,box in [('o2',(60,392,310,716)),('ch4',(516,414,688,716))]:
 im=read(D/('transfer-'+name+'.png'));proof.alpha_composite(im.resize((im.width//2,im.height//2)),box[:2])
proof.resize((390,844)).save(Q/'transfer-proof.png')
(P/'geometry.json').write_text(json.dumps({'scene':[780,1688],'icon_scale':4,'records':records},indent=2)+'\n')
