"""Create selected 64px icon proofs; no image content is painted or modified."""
from pathlib import Path
from PIL import Image, ImageDraw
import json,sys
p=Path(sys.argv[1] if len(sys.argv)>1 else 'projects/cyberpunk-study')
c=json.loads((p/'production/catalogue.json').read_text())
out=p/'production/icons/contact-sheets';out.mkdir(parents=True,exist_ok=True)
for b in c['batches']:
 if len(sys.argv)>2 and b['id'] not in sys.argv[2:]:continue
 sheet=Image.new('RGB',(768,512),'#e5dcc7');draw=ImageDraw.Draw(sheet)
 for cell in b['cells']:
  name=cell['drawing_id']
  if not name:continue
  i=cell['cell']-1;x=(i%4)*192;y=(i//4)*128
  icon=Image.open(p/f'assets/icons/{name}.png').convert('RGBA').resize((64,64),Image.Resampling.LANCZOS)
  for j,bg in enumerate(['#e5dcc7','#211c35','#455c5c']):
   draw.rectangle((x+j*64,y+8,x+j*64+63,y+87),fill=bg);sheet.paste(icon,(x+j*64,y+16),icon)
  draw.text((x+3,y+98),name,fill='#211c35')
 sheet.save(out/f"{b['id']}-contact.png")
print('Created selected contact sheets at 64px on cream/navy/teal.')
