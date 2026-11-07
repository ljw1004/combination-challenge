"""Build isolated handoff from generated pixels; never touch shared manifests/assets."""
from pathlib import Path
import copy, hashlib, json
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps
P=Path(__file__).resolve().parents[1]
ROOT=P.parents[4]
W=780
LAYOUT=json.loads((P/'layout.json').read_text())
REG=json.loads((P/'registration.json').read_text())
AIR=next(s for s in LAYOUT['scenes'] if s['chapters']==['Air'])
AR=next(s for s in REG['scenes'] if s['chapter']=='Air')
PROPOSAL=json.loads((P/'austere-fuel-layout-proposal.json').read_text())
SCRUB=copy.deepcopy(next(r for r in AIR['regions'] if 'habitat-scrubber' in r['states']))
OUT=P/'sources'
RUN=ROOT/'runs/mars-emergency-art/fuel-isolated'
RUN.mkdir(parents=True,exist_ok=True)
def bounds(box,size):return tuple(round(v*size[i%2]) for i,v in enumerate(box))
def mask(size,spec):
 m=Image.new('L',size,0);d=ImageDraw.Draw(m)
 def pts(p):return [(round(x*size[0]),round(y*size[1])) for x,y in p]
 if spec.get('opaque'):d.rectangle(bounds(spec['opaque'],size),fill=255)
 for p in spec.get('trace',[]):d.polygon(pts(p),fill=255)
 for p,width in spec.get('strokes',[]):
  q=pts(p);w=max(1,round(width*size[0]));d.line(q,fill=255,width=w,joint='curve')
  for x,y in [q[0],q[-1]]:d.ellipse((x-w/2,y-w/2,x+w/2,y+w/2),fill=255)
 for p in spec.get('holes',[]):d.polygon(pts(p),fill=0)
 if spec.get('feather'):m=m.filter(ImageFilter.GaussianBlur(spec['feather']))
 return m
def layer(frame,spec):
 x=frame.convert('RGBA');x.putalpha(mask(x.size,spec));return x
def cells(path,grid):
 im=Image.open(path).convert('RGB');gx,gy=grid;out=[]
 for n in range(gx*gy):
  x,y=n%gx,n//gx
  b=(round(im.width*x/gx)+3,round(im.height*y/gy)+3,round(im.width*(x+1)/gx)-3,round(im.height*(y+1)/gy)-3)
  out.append(im.crop(b).resize((W,W),Image.Resampling.LANCZOS))
 return out
def atlas(frames,path):
 # Exporter's mandated 3px cell inset removes this padding exactly.
 c=Image.new('RGB',((W+6)*len(frames),W+6))
 for i,f in enumerate(frames):c.paste(ImageOps.expand(f.convert('RGB'),3),(i*(W+6),0))
 c.save(path)
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
air=cells(P/'sources'/f"{AIR['source']}.png",AIR['grid'])
for i,rec in enumerate(AR['registration']):
 if i:air[i]=Image.fromarray(cv2.warpAffine(np.asarray(air[i]),np.array(rec['matrix'],dtype=float),air[i].size,flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_REFLECT))
# Whole completed Air frame avoids seams around its existing lamp/antenna.
# Restore the exact unpowered scrubber silhouette; its global slot supplies power.
base=air[4].convert('RGBA')
base.alpha_composite(layer(air[0],SCRUB['states']['habitat-scrubber']))
# Reuse the same generated ceramic offcut twice at the physical reactor contacts.
fuel=cells(P/'sources/austere-fuel-stages-r3.png',[2,1])[1]
rest_spec={'trace':[[[.326,.725],[.338,.72],[.392,.723],[.396,.743],[.392,.787],[.379,.795],[.334,.795],[.326,.785]]],'feather':.35}
left=layer(fuel,rest_spec)
right=Image.new('RGBA',(W,W));right.alpha_composite(left,(round(.229*W),0))
base.alpha_composite(left);base.alpha_composite(right)
slots=copy.deepcopy(PROPOSAL['regions'][0]['slots'])
# Parent requested a common full-canvas compound. No opaque ground patches.
for slot in slots:slot['cell']=1
# Upper power tail will sit behind the independently rendered Air scrubber.
complete=base.copy()
for slot in slots:complete.alpha_composite(layer(fuel,slot))
# This is the exact existing Air object, keeping the service-cord occlusion valid.
complete.alpha_composite(layer(air[0],SCRUB['states']['habitat-scrubber']))
atlas([base,complete],OUT/'austere-fuel-air-composite.png')
atlas([air[0],air[3]],OUT/'austere-air-service-reference.png')
# Base and powered internals reuse original Air canvas, masks and pre-registered pixels.
SCRUB['states']['habitat-scrubber']['cell']=2
SCRUB['slots'][0]['cell']=3
scene={
 'chapters':['Fuel from air and water'],'source':'austere-fuel-air-composite','grid':[2,1],
 'base':0,'no_align':[1,2,3],
 'extra':[{'source':'austere-air-service-reference.png','grid':[2,1]}],
 'regions':[{'box':[0,0,1,1],'states':{'fuel-assembly':{'cell':0}},'slots':slots},SCRUB]
}
# All body identities use their actual opaque shell; no fake full/empty difference.
portables=[]
gases=[('hydrogen','hydrogen-valve'),('oxygen','oxygen-valve'),('carbon-dioxide','carbon-dioxide-fitting'),('methane','methane-fitting')]
for i,(gas,valve) in enumerate(gases):
 b=[i/4,0,(i+1)/4,.5]
 for ident in ['empty-'+gas+'-cylinder',gas+'-cylinder']:
  portables.append({'id':ident,'source':'austere-gas-canisters-r2.png','bounds':b,'display':112})
 portables.append({'id':valve,'source':'austere-gas-canisters-r2.png','bounds':[i/4,.5,(i+1)/4,1],'display':62})
for i,gas in enumerate(['oxygen','methane']):
 portables.append({'id':gas+'-transfer-cylinder','source':'austere-transfer-canisters.png','bounds':[i/2,0,(i+1)/2,1],'display':124})
result={'scenes':[scene],'portables':portables}
(P/'austere-fuel-integration-snippet.json').write_text(json.dumps(result,indent=2)+'\n')
# Verify exported repeat against CURRENT canonical Air file at exact pixels/canvas.
shared=layer(air[3],SCRUB['slots'][0]).crop(bounds(SCRUB['box'],(W,W)))
shared=shared.resize((shared.width*2,shared.height*2),Image.Resampling.LANCZOS)
canonical=Image.open(ROOT/'projects/mars-study/mars-v12/assets/survival/overlays/habitat-scrubber-power-cable.png').convert('RGBA')
exact=shared.size==canonical.size and np.array_equal(np.asarray(shared),np.asarray(canonical))
base_shared=layer(air[0],SCRUB['states']['habitat-scrubber']).crop(bounds(SCRUB['box'],(W,W)))
base_shared=base_shared.resize((base_shared.width*2,base_shared.height*2),Image.Resampling.LANCZOS)
canonical_base=Image.open(ROOT/'projects/mars-study/mars-v12/assets/survival/items/air-habitat-scrubber.png').convert('RGBA')
base_exact=base_shared.size==canonical_base.size and np.array_equal(np.asarray(base_shared),np.asarray(canonical_base))
# Enumerate all independent fitting subsets for informed visual inspection.
proof=Image.new('RGB',(4*390,4*420),'#e4ddd2')
for n in range(16):
 im=base.copy()
 for i,s in enumerate(slots):
  if n&(1<<i):im.alpha_composite(layer(fuel,s))
 im.alpha_composite(layer(air[0],SCRUB['states']['habitat-scrubber']))
 im.alpha_composite(layer(air[3],SCRUB['slots'][0]))
 proof.paste(im.convert('RGB').resize((390,390),Image.Resampling.LANCZOS),((n%4)*390,(n//4)*420))
 ImageDraw.Draw(proof).text(((n%4)*390+8,(n//4)*420+397),' + '.join(s['accepts'] for i,s in enumerate(slots) if n&(1<<i)) or 'empty',fill='#29231f')
proof.save(RUN/'independent-fittings.jpg',quality=91)
complete.alpha_composite(layer(air[3],SCRUB['slots'][0]))
complete.save(RUN/'complete.png')
provenance={'method':'Mechanical crop, resize, existing Air registration, alpha masking and generated-pixel composite only. No painting or image synthesis.',
 'script':'tools/build-austere-fuel-handoff.py','source_inputs':{},'outputs':{},
 'air_base_exact_pixels':bool(base_exact),'air_power_overlay_exact_pixels':bool(exact),
 'air_canvas':list(canonical.size),'air_region_box':SCRUB['box'],
 'rest_method':'Existing generated left ceramic offcut duplicated 0.229 source-cell width to right, same ground/height in both base and assembled states; front product pipe can occlude its top.',
 'review':'16 legal subsets rendered for author inspection, not fresh player/browser verification. Global Air geometry is explicitly preserved.'}
for f in ['outdoor-power.png','austere-fuel-stages-r3.png']:provenance['source_inputs'][f]=digest(OUT/f)
for f in ['austere-fuel-air-composite.png','austere-air-service-reference.png']:provenance['outputs'][f]=digest(OUT/f)
(P/'prompts/austere-fuel-air-composite-mechanical.json').write_text(json.dumps(provenance,indent=2)+'\n')
print(json.dumps({'air_base_exact':bool(base_exact),'air_power_overlay_exact':bool(exact),'portables':len(portables),'scene':'austere-fuel-integration-snippet.json','proof':str(RUN/'independent-fittings.jpg')}))
if not (exact and base_exact):raise SystemExit('Canonical Air comparison failed; do not hand off as exact reuse.')
