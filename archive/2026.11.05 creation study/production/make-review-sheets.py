"""Disposable named proofs and pre-keyed blind samples from selected exports."""
import argparse, json, random, hashlib
from pathlib import Path
from production_paths import repo_root, runtime_assets
from PIL import Image, ImageDraw

HERE=Path(__file__).resolve().parent
ROOT=repo_root(HERE)
ART=runtime_assets(HERE)
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output',type=Path,default=ROOT/'runs/creation-art/final-review')
parser.add_argument('--dry-run',action='store_true',help='Check inputs and report scratch destination without writing proofs')
args=parser.parse_args()
OUT=args.output.resolve()
if not OUT.is_relative_to(ROOT/'runs'):
    raise SystemExit('Review sheets and answer keys are disposable; output must be under repository runs/.')
catalogue=json.loads((HERE/'visual-catalogue.json').read_text())
entries=catalogue['entries'];by_name={e['name']:e for e in entries}
if args.dry_run:
    required=[ART/'backgrounds/bare-coast.webp',*[ART/'icons'/(e['slug']+'.webp') for e in entries]]
    missing=[str(path) for path in required if not path.is_file()]
    print(json.dumps({'mode':'read-only','identities':len(entries),'assets':str(ART),'scratchOutput':str(OUT),'missing':missing},indent=2))
    raise SystemExit(1 if missing else 0)
OUT.mkdir(parents=True,exist_ok=True)
background=Image.open(ART/'backgrounds/bare-coast.webp').convert('RGB').resize((390,844),Image.Resampling.LANCZOS)

for start in range(0,len(entries),20):
    batch=entries[start:start+20];cols=5;rows=(len(batch)+4)//5
    for ground,colour in [('light','#f3eddf'),('dark','#102039'),('scene','#c4d4d6')]:
        sheet=Image.new('RGB',(900,rows*110),colour);draw=ImageDraw.Draw(sheet)
        for i,e in enumerate(batch):
            x,y=i%cols*180,i//cols*110
            if ground=='scene':
                sheet.paste(background.crop((110,420,290,530)),(x,y))
            icon=Image.open(ART/'icons'/(e['slug']+'.webp')).resize((64,64),Image.Resampling.LANCZOS)
            sheet.paste(icon,(x+58,y+8),icon)
            draw.text((x+6,y+82),e['name'],fill='#f3eddf' if ground=='dark' else '#172437')
        sheet.save(OUT/f'all-{start//20+1:02}-{ground}.png')

samples={
 'natural':['Earth','Light','Gravity','Dense cloud','First star','Galaxy','Magma ocean','Iron core','Magnetic field','First rain','Rivers','Trench','Living cell','Dividing cells','Partnered cells','Membranes','Oxygen','Cell colonies','Multicellular life','Arthropods','Insects','Birds','Bats','Whales'],
 'states':['Great browsers','Last tracks','Fossil footprints','Fallen forest','Renewing forest','Pioneer woodland','Green shoots','Varied survivors','Cold-adapted populations','Surviving lineages','Social group','Attention','Memory','Learned path','Call','Shared warning','Language','Calendar','Lunar rhythm','Spring-tide prediction','Observed spring tide','Song','Remembered song','Changed song']
}
for k,(label,names) in enumerate(samples.items()):
    random.Random(5262+k).shuffle(names)
    sheet=Image.new('RGB',(720,424),'#d8d1bf');draw=ImageDraw.Draw(sheet);key={}
    for i,name in enumerate(names):
        e=by_name[name];token=f'{"N" if k==0 else "S"}{i+1:02}';x,y=i%6*120,i//6*106
        icon=Image.open(ART/'icons'/(e['slug']+'.webp')).resize((64,64),Image.Resampling.LANCZOS)
        sheet.paste(icon,(x+28,y+10),icon);draw.text((x+47,y+82),token,fill='#20282d')
        key[token]={'name':name,**e['recognition']}
    sheet.save(OUT/f'blind-{label}.png')
    (OUT/f'blind-{label}-key.json').write_text(json.dumps(key,indent=2)+'\n')
    (OUT/f'blind-{label}-binding.json').write_text(json.dumps({'sha256':hashlib.sha256((OUT/f'blind-{label}.png').read_bytes()).hexdigest(),'condition':'shuffled unnamed sheet;64px;normal names and readings withheld until separate context stage;untimed model trial'},indent=2)+'\n')
print('Created disposable proofs for 206 identities and two pre-keyed 24-token blind samples under runs/.')
