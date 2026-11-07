"""Register the support designed in a complete scene; preserve other pixels.

Run from the repo root with Pillow/NumPy. The Chapter19 final fixed image keeps
the existing centre (479.5,626 scene px), while its taller canvas includes the
fitted structural saddle. Chapter20 reuses precisely the same support pixels.
"""
from pathlib import Path
import hashlib,json
from PIL import Image,ImageDraw,ImageFilter

P=Path(__file__).resolve().parent
ROOT=P.parents[4]
OUT=ROOT/'stories/mars/assets/live-feedback/lander-support-fit'
RUN=ROOT/'runs/mars-lander-support-fit'
OUT.mkdir(parents=True,exist_ok=True);RUN.mkdir(parents=True,exist_ok=True)
def read(path):return Image.open(path).convert('RGBA')
def square(name):return read(P/'sources'/name).resize((780,780),Image.Resampling.LANCZOS)
def mask(poly,feather=2):
 m=Image.new('L',(780,1688));ImageDraw.Draw(m).polygon(poly,fill=255)
 return m.filter(ImageFilter.GaussianBlur(feather)) if feather else m
def apply(base,edit,poly,feather=2):
 layer=Image.new('RGBA',base.size);layer.alpha_composite(edit,(0,0));layer.putalpha(mask(poly,feather));return Image.alpha_composite(base,layer)
def save_scene(im,name):im.save(OUT/(name+'.webp'),lossless=True,method=6)

old_ports=ROOT/'stories/mars/assets/live-feedback/fuel/lander-ports-scene.webp'
old_repair=ROOT/'stories/mars/assets/live-feedback/fuel/lander-repair-scene.webp'
ports=read(old_ports);repair=read(old_repair)
support=square('whole-lander-support.png')
support_poly=[(420,546),(520,545),(548,566),(552,593),(528,611),(535,624),
              (540,677),(407,679),(407,631),(433,615),(435,590),(420,580)]
ports=apply(ports,support,support_poly,2)
save_scene(ports,'lander-ports-scene')

# Port markings exist before the repair; only their existing local regions change.
label_boxes=[(277,390,311,419),(545,402,583,434)]
for x1,y1,x2,y2 in label_boxes:
 repair=apply(repair,read(old_ports),[(x1,y1),(x2,y1),(x2,y2),(x1,y2)],1)
save_scene(repair,'lander-repair-scene')

# The old full repair rectangle erases all temporary bricks and the catch.
# Outside it, only the new saddle/support footprint is painted; all other
# pixels are transparent so the earlier terrain and original vehicle survive.
common=(343,520,616,732)
final=Image.new('RGBA',ports.size)
final.alpha_composite(ports.crop((343,573,616,679)),(343,573))
local=ports.copy();local.putalpha(mask(support_poly,2));final.alpha_composite(local)
final.crop(common).resize((546,424),Image.Resampling.LANCZOS).save(OUT/'lander-permanent-leg.png',optimize=True)

crash_path=ROOT/'stories/mars/assets/survival/scenes/crash-landing.webp'
crash=read(crash_path);crash_edit=square('crash-labels.png')
crash_labels=[(450,374,476,399),(652,384,684,414)]
for x1,y1,x2,y2 in crash_labels:
 crash=apply(crash,crash_edit,[(x1,y1),(x2,y1),(x2,y2),(x1,y2)],1)
save_scene(crash,'crash-landing')

departure_path=ROOT/'stories/mars/assets/survival/scenes/the-end.webp'
departure=read(departure_path)
departure_poly=[(443,637),(515,637),(535,662),(542,700),(443,705),(435,677)]
departure_labels=[(390,315,423,350),(614,356,653,391)]
if (P/'sources/departure-support.png').exists():
 departure=apply(departure,square('departure-support.png'),departure_poly,2)
if (P/'sources/departure-labels.png').exists():
 edit=square('departure-labels.png')
 for x1,y1,x2,y2 in departure_labels:
  departure=apply(departure,edit,[(x1,y1),(x2,y1),(x2,y2),(x1,y2)],1)
save_scene(departure,'the-end')

record={'scenePixels':[780,1688], 'generatedSourceNormalization':[780,780],
 'repairMaskScenePolygon':support_poly, 'repairMaskFeatherPixels':2,
 'finalFixedCanvasSceneBounds':common,'finalFixedCanvasPixels':[546,424],
 'finalFixedCentreScenePixels':[479.5,626],
 'finalFixedCentrePercent':[61.47435897435897,37.08530805687204],
 'clearedTemporaryBlockRegion':[343,573,616,679],
 'earlierRepairLabelBoxes':label_boxes,'crashLabelBoxes':crash_labels,
 'departureMaskScenePolygon':departure_poly,
 'departureLabelBoxes':departure_labels,'labelMaskFeatherPixels':1,
 'inputHashes':{str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [old_ports,old_repair,crash_path,departure_path]},
 'method':'Use local masks from complete imagegen scenes, restoring every pixel outside them from the accepted runtime scene. Later transfer state shares exact support pixels. No drawing, image tint, hardware generation or structural simulation is performed by this exporter.'}
(P/'geometry.json').write_text(json.dumps(record,indent=2)+'\n')

for name,im in [('ports',ports),('crash',crash),('ending',departure)]:
 im.resize((390,844),Image.Resampling.LANCZOS).save(RUN/(name+'-proof.png'))
completed=repair.copy();piece=read(OUT/'lander-permanent-leg.png').resize((273,212),Image.Resampling.LANCZOS);completed.alpha_composite(piece,(343,520))
completed.resize((390,844),Image.Resampling.LANCZOS).save(RUN/'repair-proof.png')
completed.crop((395,525,550,680)).resize((620,620)).save(RUN/'registered-support-detail.png')
print('Exported repair, transfer, crash-label and departure variants with fixed registration.')
