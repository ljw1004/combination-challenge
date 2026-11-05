"""Resize the existing portable screen to the scale of its two ingredients."""
from pathlib import Path
import json
from PIL import Image
P=Path(__file__).resolve().parent
ROOT=P.parents[4]
source=ROOT/'stories/mars/assets/items/farm-thermal-screen.png'
target=ROOT/'stories/mars/assets/live-feedback/farm-thermal-screen.png'
im=Image.open(source).convert('RGBA');bounds=im.getbbox()
im=im.crop(bounds);im.thumbnail((240,232),Image.Resampling.LANCZOS)
out=Image.new('RGBA',(256,248));out.alpha_composite(im,((256-im.width)//2,(248-im.height)//2))
out.save(target,optimize=True)
(P/'geometry.json').write_text(json.dumps({'source':str(source.relative_to(ROOT)),'crop':bounds,'runtime':str(target.relative_to(ROOT)),'runtimePixels':[256,248],'displayPixels':[64,62],'comparison':'Fabric62x47; reflective insulation74x52; installed wall artwork unchanged'},indent=2)+'\n')
