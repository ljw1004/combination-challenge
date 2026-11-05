"""Extract generated glass silhouettes; apply the user's exact 20% white backing.
No physical detail is painted by this finish: generated edges, frosted labels,
coverslip and sample remain unchanged over the uniformly translucent pane.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image,ImageDraw,ImageFilter
P=Path(__file__).resolve().parent;ROOT=P.parents[3]
OUT=ROOT/'stories/mars/assets/live-feedback';RUN=ROOT/'runs/mars-live-feedback/slide-revision';RUN.mkdir(parents=True,exist_ok=True)
s=Image.open(P/'sources/glass-slides.png').convert('RGBA')
polys=[[(245,213),(409,42),(421,42),(1268,324),(1278,337),(1118,518),(1099,530),(249,228)],[(245,692),(410,522),(422,521),(1269,805),(1278,819),(1117,1000),(1100,1009),(249,708)]]
records=[]
for name,poly in zip(['slide-empty','slide-prepared'],polys):
 m=Image.new('L',s.size);ImageDraw.Draw(m).polygon(poly,fill=255);m=m.filter(ImageFilter.GaussianBlur(.55))
 cut=s.copy();cut.putalpha(Image.fromarray(np.minimum(np.asarray(s.getchannel('A')),np.asarray(m))))
 backing=Image.new('RGBA',s.size,(237,239,239,0));backing.putalpha(m.point(lambda v:round(v*.2)));backing.alpha_composite(cut)
 bounds=m.getbbox();im=backing.crop(bounds);im.thumbnail((368,184),Image.Resampling.LANCZOS);out=Image.new('RGBA',(384,200));out.alpha_composite(im,((384-im.width)//2,(200-im.height)//2));out.save(OUT/(name+'.png'),optimize=True)
 records.append({'name':name,'source':'sources/glass-slides.png','polygon':poly,'crop':bounds,'paneBackingRGBA':[237,239,239,51],'runtime':[384,200],'display':[96,50],'use':'blank' if name=='slide-empty' else 'shared by water/ice prepared and examined slides; identities remain separate'})
 for label,color in [('light','#eee5d5'),('mars','#b76c40')]:
  scene=Image.new('RGBA',(180,120),color);scene.alpha_composite(out.resize((96,50),Image.Resampling.LANCZOS),(42,35));scene.convert('RGB').save(RUN/(name+'-'+label+'.png'))
(P/'glass-slides.geometry.json').write_text(json.dumps({'assets':records,'selection':'Physical-reference generation; extracted silhouettes with exact 20% grey-white pane backing requested by user. The blank has neither coverslip nor sample. Both prepared identities share one appearance.'},indent=2)+'\n')
