"""Extract generated silhouettes and register them on one unchanged landscape.
Pillow only. Generated pixel crops, extraction masks and resizing; no painting.
Run from any working directory. Disposable proof images go under runs/.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
P=Path(__file__).resolve().parent
ROOT=P.parents[4]
RUN=ROOT/'runs/mars-gully-revision'
OUT=ROOT/'stories/mars/assets/live-feedback/gully-revision'
RUN.mkdir(parents=True,exist_ok=True)
OUT.mkdir(parents=True,exist_ok=True)
SIZE=(780,1688)
CANVAS=(240,80,700,800)
def source(n): return Image.open(P/'sources'/(n+'-gully.png')).convert('RGBA').resize(SIZE,Image.Resampling.LANCZOS)
def cut(im,poly,holes=(),soften=.4):
 m=Image.new('L',SIZE); d=ImageDraw.Draw(m);d.polygon(poly,fill=255)
 for h in holes:d.polygon(h,fill=0)
 if soften:m=m.filter(ImageFilter.GaussianBlur(soften))
 out=im.copy();out.putalpha(m);return out
base=source('central'); rig=source('rigged'); arr=source('reached')
winch_poly=[(352,325),(354,316),(360,313),(361,292),(365,287),(377,286),(386,288),(390,286),(400,287),(407,289),(417,292),(419,314),(427,315),(429,326),(417,331),(399,333),(355,330)]
sling_poly=[(417,294),(439,292),(457,288),(470,283),(478,279),(481,281),(483,290),(481,299),(473,306),(458,311),(441,315),(419,317)]
winch=Image.new('RGBA',SIZE);winch.alpha_composite(cut(rig,winch_poly));winch.alpha_composite(cut(rig,sling_poly))
rope_points=[(383,301),(380,320),(383,335),(386,345),(393,355),(402,365),(419,375),(436,385),(447,395),(447,405),(435,415),(412,425),(379,435),(347,445),(320,455),(303,465),(294,475),(292,485),(294,495),(303,505),(320,515),(342,525),(368,535),(394,545),(417,555),(435,565),(444,575),(444,585),(438,595),(421,605),(392,615),(356,625),(322,635),(296,645),(281,655),(274,665),(273,675),(279,685),(292,695),(311,705),(332,715),(350,725)]
# Manually registered extraction corridor follows the generated cable. Its
# pixels, highlights, irregular edges and shadows are from the source image.
m=Image.new('L',SIZE);d=ImageDraw.Draw(m);d.line(rope_points,fill=255,width=9,joint='curve')
d.polygon([(342,721),(350,720),(359,725),(361,731),(368,735),(368,743),(360,749),(348,749),(341,745),(339,740),(342,735),(347,735),(349,739),(357,738),(354,733),(347,732)],fill=255)
rope=rig.copy();rope.putalpha(m.filter(ImageFilter.GaussianBlur(.3)))
rover_poly=[(482,211),(484,202),(488,199),(488,189),(494,187),(499,187),(500,178),(504,175),(521,175),(526,177),(528,182),(529,184),(533,184),(537,188),(536,193),(543,197),(549,197),(552,202),(554,214),(550,221),(543,224),(538,221),(533,226),(525,229),(519,227),(515,221),(506,217),(501,223),(493,225),(487,220)]
rover=cut(arr,rover_poly,holes=[[(505,180),(519,180),(520,185),(505,185)]])
shadow=cut(arr,[(482,216),(494,217),(507,214),(522,218),(539,214),(553,215),(558,222),(548,229),(528,233),(507,231),(489,228),(480,224)],soften=2)
rigged=Image.new('RGBA',SIZE);rigged.alpha_composite(rope);rigged.alpha_composite(winch)
reached=Image.new('RGBA',SIZE);reached.alpha_composite(winch);reached.alpha_composite(shadow);reached.alpha_composite(rover)
for n,layer in [('before',None),('rigged',rigged),('reached',reached)]:
 im=base.copy()
 if layer:im.alpha_composite(layer)
 im.convert('RGB').save(RUN/(n+'-780.png'))
 small=im.resize((390,844),Image.Resampling.LANCZOS);small.save(RUN/(n+'-390.png'))
 small.crop((35,0,355,844)).save(RUN/(n+'-320.png'))
 if layer:
  runtime_name='rigged-winch' if n=='rigged' else 'reached-rover-and-ice'
  layer.crop(CANVAS).resize((920,1440),Image.Resampling.LANCZOS).save(OUT/(runtime_name+'.png'),optimize=True)

base.convert('RGB').save(OUT/'central-gully.webp',lossless=True)
Image.new('RGBA',(240,180)).save(OUT/'central-bedrock-hit.png')
