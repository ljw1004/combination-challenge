"""Register full-scene states, extract fixed patches, and author their exact geometry.

Only crops, registration, sizing and compositing are performed here. All painted
content comes from retained imagegen masters. Ordinary portrait foregrounds are
copied from the existing story plates, with a colour-matched feathered join.
"""
import json, math, sys
from pathlib import Path
import cv2
import numpy as np
from PIL import Image
P=Path(__file__).resolve().parents[1]
ROOT=P.parents[4]
STORY=ROOT/'projects/mars-study/mars-v12'
OUT=STORY/'assets/fixed'
for sub in ['scenes','items','overlays']: (OUT/sub).mkdir(exist_ok=True)
W,H=780,1688
LAYOUT=json.loads((P/'scene-layout.json').read_text())
art={'items':{},'chapters':{}}
meta={'canvas':[W,H],'display':[390,844],'iconScale':4,'scenes':[]}
selected={int(n) for n in sys.argv[1:]}
if selected:
 art=json.loads((P/'artwork.json').read_text())
 meta=json.loads((P/'registration.json').read_text())
 meta['scenes']=[s for s in meta['scenes'] if s['chapter'] not in selected]
 for n in selected:art['chapters'].pop(str(n),None)
manifest=json.loads((P/'manuscript-manifest.json').read_text())
# Preserve unchanged transparent targets for the science scenes.
for k,it in manifest['items'].items():
 old=STORY/'assets/hotspots'/f'{k}.png'
 if old.exists() and not any(k in r['states'] for g in LAYOUT for r in g['regions']):art['items'][k]={'icon':str(old.relative_to(STORY))}

def box_pixels(box,size):
 return tuple(round(v*size[i%2]) for i,v in enumerate(box))

def aligned(image,base,mask):
 a,b=np.array(image),np.array(base)
 sift=cv2.SIFT_create(nfeatures=6000)
 k1,d1=sift.detectAndCompute(cv2.cvtColor(a,cv2.COLOR_RGB2GRAY),mask)
 k2,d2=sift.detectAndCompute(cv2.cvtColor(b,cv2.COLOR_RGB2GRAY),mask)
 info={'matrix':[[1,0,0],[0,1,0]],'inliers':0}
 if d1 is None or d2 is None:return image,info
 matches=cv2.BFMatcher().knnMatch(d1,d2,k=2)
 good=[m for pair in matches if len(pair)==2 for m,n in [pair] if m.distance<.72*n.distance]
 if len(good)<6:return image,info
 src=np.float32([k1[m.queryIdx].pt for m in good]);dst=np.float32([k2[m.trainIdx].pt for m in good])
 M,inliers=cv2.estimateAffinePartial2D(src,dst,method=cv2.RANSAC,ransacReprojThreshold=3)
 if M is None:return image,info
 scale=math.sqrt(M[0,0]**2+M[0,1]**2)
 if not .93<scale<1.07 or max(abs(M[0,2]),abs(M[1,2]))>60:return image,info
 warped=cv2.warpAffine(a,M,image.size,flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_REFLECT)
 info={'matrix':M.tolist(),'inliers':int(inliers.sum()),'matches':len(good)}
 return Image.fromarray(warped),info

def background(frame,tail_name):
 # Preserve physical objects at their uniform source scale. Only the empty
 # foreground is extended; never stretch a building or installed object.
 tail=Image.open(STORY/'assets/backgrounds'/tail_name).convert('RGB').resize((W,H))
 start=min(frame.height-80,H-80)
 needed=H-start
 floor=tail.crop((0,900,W,H)).resize((W,needed),Image.Resampling.LANCZOS)
 a=np.asarray(frame).astype(float);b=np.asarray(floor).astype(float)
 offset=np.mean(a[start:start+60],axis=(0,1))-np.mean(b[:60],axis=(0,1))
 b=np.clip(b+offset,0,255)
 result=Image.new('RGB',(W,H));result.paste(Image.fromarray(b.astype('uint8')),(0,start));result.paste(frame,(0,0))
 overlap=min(80,frame.height-start)
 if overlap>0:
  alpha=np.linspace(0,1,overlap)[:,None,None]
  blend=a[start:start+overlap]*(1-alpha)+b[:overlap]*alpha
  result.paste(Image.fromarray(blend.astype('uint8')),(0,start))
 return result,{'foregroundSource':'assets/backgrounds/'+tail_name,'sourceBounds':[0,900,W,H],'joinY':start,'feather':overlap,'colourOffset':offset.tolist()}

def patch(im,box,path,transparent=False,polygon=None,exclude=None,clip=None,trace=None):
 bounds=box_pixels(box,im.size);c=im.crop(bounds).convert('RGBA')
 if transparent:c.putalpha(0)
 else:
  h,w=c.height,c.width
  yy,xx=np.mgrid[:h,:w]
  alpha=np.clip(np.minimum.reduce([xx,yy,w-1-xx,h-1-yy])/4,0,1)*255
  if polygon:
   pm=np.zeros((h,w),np.uint8)
   pts=np.array([[round(x*im.width-bounds[0]),round(y*im.height-bounds[1])] for x,y in polygon],np.int32)
   cv2.fillPoly(pm,[pts],255);alpha=np.minimum(alpha,pm)
  if trace:
   pm=np.zeros((h,w),np.uint8)
   for outline in trace:
    pts=np.array([[round(x*im.width-bounds[0]),round(y*im.height-bounds[1])] for x,y in outline],np.int32)
    cv2.fillPoly(pm,[pts],255)
   alpha=np.minimum(alpha,pm)
  for hole in exclude or []:
   pts=np.array([[round(x*im.width-bounds[0]),round(y*im.height-bounds[1])] for x,y in hole],np.int32)
   cv2.fillPoly(alpha,[pts],0)
  if clip:
   cx1,cy1,cx2,cy2=box_pixels(clip,im.size)
   keep=np.zeros((h,w),np.uint8)
   keep[max(0,cy1-bounds[1]):max(0,cy2-bounds[1]),max(0,cx1-bounds[0]):max(0,cx2-bounds[0])]=255
   alpha=np.minimum(alpha,keep)
  c.putalpha(Image.fromarray(alpha.astype('uint8')))
 # The background is 2x reference size; icon files are 4x.
 c=c.resize((c.width*2,c.height*2),Image.Resampling.LANCZOS)
 c.save(path,optimize=True)
 return bounds,c.size

for group in LAYOUT:
 if selected and not selected.intersection(group['chapters']):continue
 slug=group['source'];src=P/'sources'/f'{slug}.png'
 if not src.exists():continue
 raw=Image.open(src).convert('RGB');cols,rows=group['grid'];frames=[];boundslist=[]
 for n in range(cols*rows):
  x,y=n%cols,n//cols
  bounds=(round(raw.width*x/cols)+3,round(raw.height*y/rows)+3,round(raw.width*(x+1)/cols)-3,round(raw.height*(y+1)/rows)-3)
  cell=raw.crop(bounds);height=round((raw.height/rows-6)*W/(raw.width/cols-6));cell=cell.resize((W,height),Image.Resampling.LANCZOS)
  frames.append(cell);boundslist.append(bounds)
 base=frames[group.get('base',0)]
 mask=np.full((base.height,base.width),255,np.uint8)
 for region in group['regions']:
  x1,y1,x2,y2=box_pixels(region['box'],base.size);mask[max(0,y1-8):min(base.height,y2+8),max(0,x1-8):min(W,x2+8)]=0
 registered=[];registrations=[]
 for n,f in enumerate(frames):
  if n==group.get('base',0):im,reg=f,{'matrix':[[1,0,0],[0,1,0]],'inliers':0}
  else:im,reg=aligned(f,base,mask)
  registered.append(im);registrations.append(reg)
 for virtual in group.get('stateCopies',[]):
  im=registered[virtual['base']].copy()
  for comp in virtual['copies']:
   bounds=box_pixels(comp['box'],base.size);im.paste(registered[comp['state']].crop(bounds),bounds[:2])
  registered.append(im)
 for ch in group['chapters']:
  cmeta=art['chapters'].setdefault(str(ch),{'fixed':{}})
  bg,bgmeta=background(base,group.get('tail','crash-apron.webp'))
  for comp in group.get('baseCopies',[]):
   bounds=box_pixels(comp['box'],base.size);bg.paste(registered[comp['state']].crop(bounds),bounds[:2])
  bgname=f'ch{ch:02d}-{slug}.webp';bg.save(OUT/'scenes'/bgname,quality=94,method=6)
  cmeta['image']='assets/fixed/scenes/'+bgname
  scenemeta={'chapter':ch,'source':str(src.relative_to(P)),'sourceSize':raw.size,'cells':boundslist,'registration':registrations,'foreground':bgmeta,'regions':[]}
  for region in group['regions']:
   for ident,state in region['states'].items():
    if ident not in manifest['chapters'][ch-1]['fixed']:continue
    box=region['box'];path=OUT/'items'/f'ch{ch:02d}-{ident}.png'
    trace=region.get('traces',{}).get(ident,region.get('trace'))
    bounds,size=patch(registered[state],box,path,ident in region.get('transparent',[]),region.get('polygon'),region.get('exclude'),trace=trace)
    x=(bounds[0]+bounds[2])/2/W*100;y=(bounds[1]+bounds[3])/2/H*100
    icon=str(path.relative_to(STORY));cmeta['fixed'][ident]={'x':round(x,5),'y':round(y,5),'icon':icon}
    # A first-appearance default plus per-chapter fixed view. Global art changes
    # are recorded separately when growth or weather changes the same identity.
    art['items'].setdefault(ident,{}).setdefault('icon',icon)
    if (ident,ch) in [('potato-bed',12),('soybean-row',12),('lettuce-tray',11),('station-power',29)]:
     patch(registered[state],box,OUT/'items'/f'global-ch{ch:02d}-{ident}.png')
    if ident in region.get('slots',{}):
     slots=[]
     for slot in region['slots'][ident]:
      opath=OUT/'overlays'/f"{ident}-{slot['accepts']}.png"
      patch(registered[slot['state']],box,opath,clip=slot['clip'])
      slots.append(dict(name=slot['name'],accepts=slot['accepts'],icon=str(opath.relative_to(STORY))))
     art['items'][ident]['slots']=slots
    scenemeta['regions'].append({'id':ident,'state':state,'bounds':bounds,'iconPixels':size,'centre':[x,y],'trace':trace,'exclude':region.get('exclude')})
  meta['scenes'].append(scenemeta)
  if group.get('places'):cmeta['places']=group['places']
  scenemeta['stateCopies']=group.get('stateCopies',[])
# Portable objects and explicit global appearance changes are generated separately.
extra=P/'artwork-extra.json'
if extra.exists():
 for k,v in json.loads(extra.read_text()).get('items',{}).items():art['items'].setdefault(k,{}).update(v)
meta['scenes'].sort(key=lambda s:s['chapter'])
(P/'artwork.json').write_text(json.dumps(art,indent=2)+'\n')
(P/'registration.json').write_text(json.dumps(meta,indent=2)+'\n')
print('Exported',len(meta['scenes']),'chapter views,',sum(len(s['regions']) for s in meta['scenes']),'fixed appearances')
