"""Export selected generated pixels; no painting or game-semantic changes.

Authoring geometry is in layout.json. SIFT registers the unchanged surroundings;
manual silhouettes/strokes retain whole objects and remove inter-object ground.
Opaque replacements are explicitly marked when an earlier painted state must be
removed. Source alpha is preserved for portable images.
"""
import json, math, re, sys
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from layout import SCENES, PORTABLES
P=Path(__file__).resolve().parents[1]; ROOT=P.parents[4]
STORY=ROOT/'projects/mars-study/mars-v12'; OUT=STORY/'assets/survival'
SCRATCH=ROOT/'runs/mars-survival/export'; SCRATCH.mkdir(parents=True,exist_ok=True)
for d in ['scenes','items','overlays']:(OUT/d).mkdir(parents=True,exist_ok=True)
W,H=780,1688
art={'items':{},'chapters':{}};records={'canvas':[W,H],'reference':[390,844],'scenes':[],'portables':[]}
selected=set(sys.argv[1:])
if selected:
 art=json.loads((P/'artwork.json').read_text());records=json.loads((P/'registration.json').read_text());records['scenes']=[x for x in records['scenes'] if x['chapter'] not in selected]

def bounds(box,size):return tuple(round(v*size[i%2]) for i,v in enumerate(box))
def align(im,base,mask):
 a,b=np.array(im),np.array(base);sift=cv2.SIFT_create(nfeatures=6000)
 k1,d1=sift.detectAndCompute(cv2.cvtColor(a,cv2.COLOR_RGB2GRAY),mask);k2,d2=sift.detectAndCompute(cv2.cvtColor(b,cv2.COLOR_RGB2GRAY),mask)
 info={'matrix':[[1,0,0],[0,1,0]],'inliers':0}
 if d1 is None or d2 is None:return im,info
 good=[m for pair in cv2.BFMatcher().knnMatch(d1,d2,k=2) if len(pair)==2 for m,n in [pair] if m.distance<.72*n.distance]
 if len(good)<6:return im,info
 M,ins=cv2.estimateAffinePartial2D(np.float32([k1[m.queryIdx].pt for m in good]),np.float32([k2[m.trainIdx].pt for m in good]),method=cv2.RANSAC,ransacReprojThreshold=3)
 if M is None or not .93<math.hypot(M[0,0],M[0,1])<1.07 or max(abs(M[0,2]),abs(M[1,2]))>60:return im,info
 return Image.fromarray(cv2.warpAffine(a,M,im.size,flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_REFLECT)),{'matrix':M.tolist(),'inliers':int(ins.sum()),'matches':len(good)}
def make_mask(size,spec):
 m=Image.new('L',size,0);d=ImageDraw.Draw(m)
 def points(p):return [(round(x*size[0]),round(y*size[1])) for x,y in p]
 if spec.get('opaque'):d.rectangle(bounds(spec['opaque'],size),fill=255)
 for p in spec.get('trace',[]):d.polygon(points(p),fill=255)
 for p,width in spec.get('strokes',[]):
  ps=points(p);w=max(1,round(width*size[0]));d.line(ps,fill=255,width=w,joint='curve')
  for x,y in [ps[0],ps[-1]]:d.ellipse((x-w/2,y-w/2,x+w/2,y+w/2),fill=255)
 for p in spec.get('holes',[]):d.polygon(points(p),fill=0)
 if spec.get('feather'):m=m.filter(ImageFilter.GaussianBlur(spec['feather']))
 return m

def background(frame,tail):
 result=Image.new('RGB',(W,H));result.paste(frame,(0,0))
 start=min(frame.height-70,H-80);height=H-start
 tailim=Image.open(STORY/'assets/backgrounds'/tail).convert('RGB').resize((W,H))
 floor=tailim.crop((0,900,W,H)).resize((W,height),Image.Resampling.LANCZOS)
 a=np.asarray(frame).astype(float);b=np.asarray(floor).astype(float)
 offset=a[start:start+60].mean(axis=(0,1))-b[:60].mean(axis=(0,1));b=np.clip(b+offset,0,255)
 result.paste(Image.fromarray(b.astype('uint8')),(0,start));result.paste(frame,(0,0))
 overlap=min(70,frame.height-start);alpha=np.linspace(0,1,overlap)[:,None,None]
 result.paste(Image.fromarray((a[start:start+overlap]*(1-alpha)+b[:overlap]*alpha).astype('uint8')),(0,start))
 return result,{'source':'assets/backgrounds/'+tail,'bounds':[0,900,W,H],'joinY':start,'feather':overlap,'colourOffset':offset.tolist()}

def cut(frame,box,spec,path):
 m=make_mask(frame.size,spec)
 if spec.get('green'):
  a=np.asarray(frame).astype(float);r,g,b=a[:,:,0],a[:,:,1],a[:,:,2]
  for rect in spec['green']:
   x1,y1,x2,y2=bounds(rect,frame.size);sub=((g>r*.92)&(g>b*1.15)&(r<185)&(g>38)).astype('uint8')*255
   temp=Image.new('L',frame.size,0);temp.paste(Image.fromarray(sub[y1:y2,x1:x2]),(x1,y1));m=Image.fromarray(np.maximum(np.array(m),np.array(temp)))
 c=frame.convert('RGBA');c.putalpha(m)
 if spec.get('layers'):
  c=Image.new('RGBA',frame.size)
  for layer in spec['layers']:
   pixels=registered[layer['cell']].convert('RGBA')
   pixels.putalpha(make_mask(frame.size,layer));c.alpha_composite(pixels)
 if spec.get('underlay'):
  u=registered[spec['underlay']['cell']].convert('RGBA');u.putalpha(make_mask(frame.size,spec['underlay']));u.alpha_composite(c);c=u
 bb=bounds(box,frame.size);c=c.crop(bb)
 c=c.resize((c.width*2,c.height*2),Image.Resampling.LANCZOS);c.save(path,optimize=True)
 return bb,c.size

for scene in SCENES:
 if selected and not selected.intersection(scene['chapters']):continue
 if not (P/'sources'/f"{scene['source']}.png").exists():raise FileNotFoundError(scene['source'])
 slug=scene['source'];raw=Image.open(P/'sources'/f'{slug}.png').convert('RGB');cols,rows=scene['grid'];frames=[];cells=[]
 for n in range(cols*rows):
  x,y=n%cols,n//cols;bb=(round(raw.width*x/cols)+3,round(raw.height*y/rows)+3,round(raw.width*(x+1)/cols)-3,round(raw.height*(y+1)/rows)-3)
  im=raw.crop(bb);im=im.resize((W,round(im.height*W/im.width)),Image.Resampling.LANCZOS);frames.append(im);cells.append(bb)
 for extra in scene.get('extra',[]):
  other=Image.open(P/'sources'/extra['source']).convert('RGB');cc,rr=extra['grid']
  for n in range(cc*rr):
   xx,yy=n%cc,n//cc;eb=(round(other.width*xx/cc)+3,round(other.height*yy/rr)+3,round(other.width*(xx+1)/cc)-3,round(other.height*(yy+1)/rr)-3)
   ei=other.crop(eb).resize(frames[0].size,Image.Resampling.LANCZOS);frames.append(ei);cells.append({'source':extra['source'],'bounds':eb})
 baseid=scene.get('base',0);base=frames[baseid];mask=np.full((base.height,base.width),255,np.uint8)
 for reg in scene['regions']:
  x1,y1,x2,y2=bounds(reg['box'],base.size);mask[max(0,y1-10):min(base.height,y2+10),max(0,x1-10):min(W,x2+10)]=0
 registered=[];alignments=[]
 shared=scene.get('registration_from')
 reference=next((r for r in records['scenes'] if shared and r['chapter']==shared['chapter']),None)
 if shared:
  if reference is None:raise ValueError('Export registration source first: '+shared['chapter'])
  if json.loads(json.dumps(cells[:shared['cells']]))!=json.loads(json.dumps(reference['cells'][:shared['cells']])):raise ValueError('Shared registration cells differ')
 for i,f in enumerate(frames):
  if shared and i<shared['cells']:
   rec=reference['registration'][i]
   im=Image.fromarray(cv2.warpAffine(np.asarray(f),np.array(rec['matrix'],dtype=float),f.size,flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_REFLECT))
  else:
   im,rec=(f,{'matrix':[[1,0,0],[0,1,0]],'inliers':0}) if i==baseid or i in scene.get('no_align',[]) else align(f,base,mask)
  registered.append(im);alignments.append(rec);im.resize((390,round(im.height/2))).save(SCRATCH/f'{slug}-{i}.png')
 for ch in scene['chapters']:
  if selected and ch not in selected:continue
  cmeta={'fixed':{}};art['chapters'][ch]=cmeta
  bg,tailrec=background(registered[baseid],scene.get('tail','crash-apron.webp'))
  for layer in scene.get('background_layers',[]):
   pixels=registered[layer['cell']].convert('RGBA');pixels.putalpha(make_mask(base.size,layer))
   bg.paste(pixels,(0,0),pixels)
  key=re.sub(r'[^a-z0-9]+','-',ch.lower()).strip('-')
  bgpath=OUT/'scenes'/f'{key}.webp';bg.save(bgpath,quality=94,method=6);cmeta['image']=str(bgpath.relative_to(STORY))
  rec={'chapter':ch,'source':'sources/'+slug+'.png','sourceSize':raw.size,'cells':cells,'registration':alignments,'foreground':tailrec,'backgroundLayers':scene.get('background_layers',[]),'regions':[]}
  if shared:rec['registrationFrom']=shared
  for reg in scene['regions']:
   for ident,st in reg['states'].items():
    state=st if isinstance(st,dict) else {'cell':st};index=state['cell'];spec={k:v for k,v in reg.items() if k not in ['states','box']};spec.update(state)
    path=OUT/'items'/f'{key}-{ident}.png';bb,size=cut(registered[index],reg['box'],spec,path)
    x=(bb[0]+bb[2])/2/W*100;y=(bb[1]+bb[3])/2/H*100
    icon=str(path.relative_to(STORY));cmeta['fixed'][ident]={'x':round(x,5),'y':round(y,5),'icon':icon};art['items'].setdefault(ident,{'icon':icon})
    if spec.get('presentation'):art['items'][ident].setdefault('presentations',{})[spec['presentation']]={'icon':icon}
    regionrec={'id':ident,'cell':index,'bounds':bb,'iconPixels':size,'centre':[x,y],'mask':spec}
    if 'slots' in reg:
     art['items'][ident]['slots']={}
     for slot in reg['slots']:
      sp=OUT/'overlays'/f"{ident}-{slot['accepts']}.png";cut(registered[slot['cell']],reg['box'],slot,sp)
      art['items'][ident]['slots'][slot['accepts']]=str(sp.relative_to(STORY))
    rec['regions'].append(regionrec)
  records['scenes'].append(rec)

for item in ([] if selected else PORTABLES):
 raw=Image.open(P/'sources'/item['source']).convert('RGBA');box=item.get('bounds',[0,0,1,1]);bb=bounds(box,raw.size);im=raw.crop(bb)
 if 'trace' in item:im.putalpha(make_mask(im.size,item))
 alpha=im.getchannel('A');visible=alpha.point(lambda x:255 if x>=8 else 0).getbbox()
 if not visible:raise ValueError('Empty '+item['id'])
 # Preserve soft edge alpha inside the padded visible bounds.
 visible=(max(0,visible[0]-3),max(0,visible[1]-3),min(im.width,visible[2]+3),min(im.height,visible[3]+3));im=im.crop(visible)
 scale=item['display']*4/max(im.size);dims=tuple(max(4,round(n*scale/4)*4) for n in im.size);im=im.resize(dims,Image.Resampling.LANCZOS)
 canvas=Image.new('RGBA',(dims[0]+16,dims[1]+16));canvas.paste(im,(8,8));path=OUT/'items'/f"{item['id']}.png";canvas.save(path,optimize=True)
 art['items'][item['id']]={'icon':str(path.relative_to(STORY))};records['portables'].append(dict(item,sourceBounds=bb,alphaBounds=visible,pixels=canvas.size))
records['scenes'].sort(key=lambda x:x['chapter'])
(P/'artwork.json').write_text(json.dumps(art,indent=2)+'\n');(P/'registration.json').write_text(json.dumps(records,indent=2)+'\n')
print(f"Exported {len(records['scenes'])} scenes, {sum(len(x['regions']) for x in records['scenes'])} fixed views, {len(PORTABLES)} portable icons")
