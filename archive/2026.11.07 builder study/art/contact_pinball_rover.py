"""Contact sheets for scratch still proofs; originals retain their camera projection."""
import argparse,json,textwrap
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
p=argparse.ArgumentParser();p.add_argument('--out',default='runs/builder-study/pinball-rover-pilot');a=p.parse_args();out=Path(a.out)
rows=json.loads((out/'render-manifest.json').read_text())
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',17)
small=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',13)
for family in ('pinball','rover'):
 selected=[r for r in rows if r['family']==family]
 labels=({'complete','underside','top','travel-0','travel-0.5','travel-1','launcher-pulled','spring-service-access','pb-deadspot','pb-return-table'} if family=='pinball' else {'complete','compound-base','all-slots','test-stops','pen-down','pen-mid','pen-up'}|{'overlay-'+x for x in ('rover-caster','rover-drive-pair','rover-pack','rover-switch','rover-radio')})
 for kind,rs in [('mechanism',[r for r in selected if r['label'] in labels]),('identities',selected)]:
  cols=3 if kind=='mechanism' else 4;cell=330 if kind=='mechanism' else 250;h=cell+42
  sheet=Image.new('RGB',(cols*cell,50+((len(rs)+cols-1)//cols)*h),(239,234,221));d=ImageDraw.Draw(sheet)
  d.text((12,10),family+' / '+kind+' — canonical source, still proof only',fill=(16,35,52),font=font)
  for i,r in enumerate(rs):
   x=(i%cols)*cell;y=50+(i//cols)*h;im=Image.open(out/r['file']).convert('RGBA');im.thumbnail((cell-10,cell-10))
   sheet.paste(im,(x+(cell-im.width)//2,y),im)
   for j,line in enumerate(textwrap.wrap(r['label'],30)):d.text((x+8,y+cell+j*16),line,fill=(16,35,52),font=small)
  sheet.save(out/f'{family}-{kind}-sheet.png')
base_path=out/'rover-compound-base.png'
if base_path.exists():
 slots=('rover-caster','rover-drive-pair','rover-pack','rover-switch','rover-radio')
 base=Image.open(base_path).convert('RGBA');overlays=[Image.open(out/('rover-overlay-'+s+'.png')).convert('RGBA') for s in slots]
 if any(im.size!=base.size for im in overlays):raise ValueError('Compound canvases must be identical')
 sheet=Image.new('RGB',(8*180,4*205),(239,234,221));draw=ImageDraw.Draw(sheet);errors=[]
 for mask in range(32):
  forward=base.copy();backward=base.copy()
  for i in range(5):
   if mask>>i&1:forward=Image.alpha_composite(forward,overlays[i])
  for i in reversed(range(5)):
   if mask>>i&1:backward=Image.alpha_composite(backward,overlays[i])
  if forward.tobytes()!=backward.tobytes():errors.append(mask)
  forward.thumbnail((180,180));x=(mask%8)*180;y=(mask//8)*205;sheet.paste(forward,(x,y),forward)
  draw.text((x+5,y+182),f'Slot mask {mask:02d}',fill=(16,35,52),font=small)
 sheet.save(out/'rover-32-composites.png')
 (out/'rover-png-compositing.json').write_text(json.dumps({'canvases':list(base.size),'masks':32,'reverse_order_byte_mismatches':errors},indent=2)+'\n')
print(out)
