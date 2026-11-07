"""Compose disposable still contact sheets; no new artwork or animation."""
import argparse,json
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
HERE=Path(__file__).resolve().parent
root=HERE.parents[2]/'runs'/'builder-study'
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',15)

def sheet(directory,name,files,columns=4,tile=330):
    rows=(len(files)+columns-1)//columns
    page=Image.new('RGB',(columns*tile,rows*(tile+30)),(237,233,220));draw=ImageDraw.Draw(page)
    for i,file in enumerate(files):
        im=Image.open(file).convert('RGBA');im.thumbnail((tile,tile))
        x=(i%columns)*tile+(tile-im.width)//2;y=(i//columns)*(tile+30)
        page.paste(im,(x,y+(tile-im.height)//2),im)
        label=file.stem.replace('state-','').replace('diagnostic-','').replace('motion-','phase ')
        draw.text(((i%columns)*tile+8,y+tile+5),label,font=font,fill=(22,48,61))
    page.save(directory/(name+'.png'))

for family in ['crane','wave']:
    directory=root/(family+'-pilot')
    sheet(directory,'motion-contact',sorted(directory.glob('motion-*.png')))
    sheet(directory,'state-contact',sorted(directory.glob('state-*.png')))
    files=sorted(directory.glob('diagnostic-*.png'))
    files+=sorted(directory.glob('controlled-*.png'))+sorted(directory.glob('plucked-*.png'))+sorted(directory.glob('stopped-*.png'))+sorted(directory.glob('bridge-powered-*.png'))+sorted(directory.glob('tension-*.png'))
    sheet(directory,'diagnostic-contact',files,columns=3)
    checks=[]
    for file in sorted(directory.glob('*.png')):
        if file.stem.endswith('contact'):continue
        im=Image.open(file).convert('RGBA');a=im.getchannel('A');bbox=a.getbbox()
        checks.append({'name':file.name,'alpha_range':a.getextrema(),'nonempty':bool(bbox),'unclipped':bool(bbox and bbox[0]>0 and bbox[1]>0 and bbox[2]<im.width and bbox[3]<im.height),'bounds':bbox,'intentional_detail_crop':file.name=='diagnostic-drive.png'})
    (directory/'still-alpha-check.json').write_text(json.dumps(checks,indent=2)+'\n')
