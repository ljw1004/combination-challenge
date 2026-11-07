"""Mechanical crop/mask export of existing artwork and the selected imagegen edit.

Run from the repository root with: uv run --with pillow --with numpy python
projects/mars-study/production/live-feedback/garden/export-garden.py
Does not paint scene content or modify any preserved v12 file.
"""
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[5]
P = Path(__file__).resolve().parent
OLD = ROOT / 'stories/mars/assets/survival'
OUT = ROOT / 'stories/mars/assets/live-feedback/garden'
RUN = ROOT / 'runs/mars-live-feedback/garden'
OUT.mkdir(parents=True, exist_ok=True)
RUN.mkdir(parents=True, exist_ok=True)
records = {'canvas': [780, 1688], 'reference': [390, 844], 'artScale': 4,
           'operation': 'Existing RGBA pixels cropped without repainting; selected generated storm pixels retained only inside traced cover/cord masks.', 'assets': {}, 'stormMasks': {}}

def save(im, name, box, **more):
    path = OUT / (name + '.png')
    im.save(path, optimize=True)
    x1, y1, x2, y2 = box
    records['assets'][name] = {'path': str(path.relative_to(ROOT / 'stories/mars')),
        'sceneBounds': box, 'pixels': list(im.size),
        'centrePercent': [round((x1+x2)/2/780*100,5), round((y1+y2)/2/1688*100,5)],
        'displayAt390': [im.width/4, im.height/4], **more}
    return im

# These disjoint vertical partitions exactly reconstruct the existing complete
# group. Shared feed pipe segments meet when their individual drippers are fitted.
# y=398 is above the first nontransparent pixel in the installed group.
bed_boxes = {'potato': [2,398,268,679], 'soybean': [268,398,550,536], 'lettuce': [550,398,780,679]}
group_box = [2,367,780,679]
states = {'ceramic': 'ceramic-bed-walls', 'fabric': 'lined-growing-beds',
          'medium': 'prepared-growing-beds', 'dripped': 'irrigated-growing-beds'}
slots = {'potato': 'seed-potatoes', 'soybean': 'soybean-seeds', 'lettuce': 'lettuce-seeds'}
def group_crop(im, box):
    return im.crop(((box[0]-2)*2,(box[1]-367)*2,(box[2]-2)*2,(box[3]-367)*2))

# The existing shared feed header becomes original room service plumbing.
# Only each bed's emitter branch is installed by its own drip action.
header_poly=[(143,398),(433,398),(433,413),(599,413),(624,428),(626,470),(607,473),(607,443),(596,437),(425,437),(423,452),(302,452),(280,435),(259,421),(143,421)]
header_mask=Image.new('L',(1556,624),0)
ImageDraw.Draw(header_mask).polygon([((x-2)*2,(y-367)*2) for x,y in header_poly],fill=255)
dripped_group=Image.open(OLD/'items/one-room-for-roots-irrigated-growing-beds.png').convert('RGBA')
# Select the actual pipe silhouette inside the broad allocation area. The source
# group's old extraction includes tan room pixels around these lines; those must
# not become a ribbon over the unchanged sink and floor.
header_paths=[
    ([(151,419),(153,415),(157,411),(164,409),(258,409),(270,410),(279,413),(287,418),(294,425),(300,433),(307,440),(315,443),(393,443),(400,444),(406,442),(411,437),(412,429),(411,410)],6),
    ([(414,410),(415,421),(419,425),(426,426),(590,426),(600,428),(608,433),(613,440),(615,447),(615,463)],6),
    ([(411,401),(411,408)],7),
    ([(404,406),(419,406)],10),
]
pipe_mask=Image.new('L',(1556,624),0);pd=ImageDraw.Draw(pipe_mask)
for points,width in header_paths:
    pts=[((x-2)*2,(y-367)*2) for x,y in points]
    pd.line(pts,fill=255,width=width*2,joint='curve')
    for x,y in pts:pd.ellipse((x-width,y-width,x+width,y+width),fill=255)
pipe_mask=pipe_mask.filter(ImageFilter.GaussianBlur(.5))
header=dripped_group.copy()
header.putalpha(Image.fromarray(np.minimum(np.asarray(header.getchannel('A')),np.minimum(np.asarray(header_mask),np.asarray(pipe_mask)))))
background=Image.open(OLD/'scenes/one-room-for-roots.webp').convert('RGBA')
background.alpha_composite(header.resize((778,312),Image.Resampling.LANCZOS),(2,367))
background.convert('RGB').save(OUT/'construction-with-service-header.webp',lossless=True,method=6)
def without_header(im):
    im=im.copy()
    im.putalpha(Image.fromarray(np.minimum(np.asarray(im.getchannel('A')),255-np.asarray(header_mask))))
    return im

planted_proofs = {}
for crop, box in bed_boxes.items():
    dims = ((box[2]-box[0])*2,(box[3]-box[1])*2)
    save(Image.new('RGBA',dims), crop+'-floor', box, source='Transparent receiving area over existing empty-room background.')
    for state, source in states.items():
        path = OLD / 'items' / ('one-room-for-roots-'+source+'.png')
        pixels=Image.open(path).convert('RGBA')
        if state=='dripped':pixels=without_header(pixels)
        save(group_crop(pixels,box),crop+'-'+state,box,source=str(path.relative_to(ROOT)))
    base = without_header(dripped_group)
    overlay = Image.open(OLD/'overlays'/('irrigated-growing-beds-'+slots[crop]+'.png')).convert('RGBA')
    save(group_crop(overlay,box),crop+'-seed-overlay',box,source=str((OLD/'overlays'/('irrigated-growing-beds-'+slots[crop]+'.png')).relative_to(ROOT)))
    base.alpha_composite(overlay)
    planted_proofs[crop] = group_crop(base,box)

potato_box=bed_boxes['potato']
foil=Image.open(OLD/'overlays/irrigated-growing-beds-foil-backed-cloth.png').convert('RGBA')
save(group_crop(foil,potato_box),'potato-foil-overlay',potato_box,source='Existing independent loose foil-backed potato-medium cover. Declare before seed overlay so shoots remain visible in either installation order.')

# Chapter 21 keeps the complete mature background byte-for-byte. Only the
# receiving geometry changes: three crop regions and no active sink.
harvest_boxes={'potato':[4,307,284,704], 'soybean':[292,381,555,535], 'lettuce':[572,470,775,694]}
for crop,box in harvest_boxes.items():
    save(Image.new('RGBA',((box[2]-box[0])*2,(box[3]-box[1])*2)),crop+'-harvest-target',box,
         source='Transparent receiver over assets/survival/scenes/supper-from-the-garden.webp; background and visible sink remain unchanged.')

# Mask selection only. All visible new pixels come from image_gen; lines below
# trace generated cords and cloth, not new painted strokes.
generated=Image.open(P/'storm-low-covers-master.png').convert('RGB').resize((780,780),Image.Resampling.LANCZOS)
original=Image.open(OLD/'scenes/keep-the-roots-alive.webp').convert('RGB').crop((0,0,780,780))
cloth={
 'potato': [[4,603],[0,580],[0,457],[8,410],[23,378],[40,349],[64,326],[88,302],[102,308],[130,307],[138,302],[160,320],[185,336],[215,351],[225,375],[236,416],[251,452],[260,467],[274,475],[270,493],[250,518],[226,559],[205,590],[191,603],[162,598],[142,591],[123,580],[110,575],[96,577],[83,586],[61,597],[24,602]],
 'soybean': [[278,501],[283,480],[289,453],[296,427],[307,414],[330,408],[350,403],[374,394],[390,401],[413,404],[441,402],[470,397],[490,408],[513,415],[528,421],[537,449],[544,475],[553,494],[552,507],[525,509],[497,507],[470,509],[445,506],[417,503],[393,495],[380,481],[365,492],[340,498],[315,507],[293,508]],
 'lettuce': [[557,504],[564,489],[577,476],[592,467],[620,466],[640,465],[659,459],[678,474],[697,486],[717,498],[733,524],[748,553],[765,583],[774,601],[769,608],[749,606],[732,602],[717,599],[699,585],[686,578],[673,583],[656,591],[638,604],[620,610],[600,604],[584,584],[574,559],[567,538]]}
cords={
 'potato': [[[79,138],[91,303]],[[79,138],[26,414]],[[142,179],[138,303]],[[142,179],[216,351]],[[182,204],[184,335]],[[182,204],[216,351]]],
 'soybean': [[[342,205],[309,419]],[[342,205],[374,395]],[[413,205],[374,395]],[[413,205],[470,398]],[[470,398],[527,421]]],
 'lettuce': [[[610,199],[592,468]],[[610,199],[659,462]],[[681,169],[659,462]],[[681,169],[717,498]]]}
storm_boxes={'potato':[0,132,278,612], 'soybean':[278,196,556,540], 'lettuce':[556,164,780,614]}
allmask=Image.new('L',(780,780),0)
arr=np.asarray(original).astype(float)
r,g,b=arr[:,:,0],arr[:,:,1],arr[:,:,2]
old_green=(g>r*.82)&(g>b*1.18)&(g>70)
ga=np.asarray(generated).astype(float)
# Select the painted dark cords within broad traced corridors. Their actual
# curves need not coincide with a mathematically straight mask line.
new_dark=(ga.mean(axis=2)<arr.mean(axis=2)-12)&(ga[:,:,0]<170)&(ga[:,:,1]<150)
leaf_regions={'potato':[0,305,275,520], 'soybean':[292,385,550,490], 'lettuce':[568,466,772,590]}
for crop,poly in cloth.items():
    mask=Image.new('L',(780,780),0);draw=ImageDraw.Draw(mask)
    draw.polygon([tuple(p) for p in poly],fill=255)
    if crop=='potato':
        # Trace the complete old potato silhouette as well, so yellow leaf tips
        # outside the new cloth are replaced with the generated surrounding pixels.
        draw.polygon([(0,449),(6,407),(24,382),(39,351),(52,346),(53,327),(62,311),(79,315),(90,321),(111,319),(125,339),(152,337),(174,343),(193,354),(208,354),(226,367),(231,380),(246,385),(248,397),(259,405),(251,416),(245,425),(234,436),(244,452),(225,469),(205,476),(180,496),(153,507),(70,510),(0,475)],fill=255)
    corridor=Image.new('L',(780,780),0);cd=ImageDraw.Draw(corridor)
    for line in cords[crop]:cd.line([tuple(p) for p in line],fill=255,width=30,joint='curve')
    cord_mask=Image.fromarray(((np.asarray(corridor)>0)&new_dark).astype('uint8')*255).filter(ImageFilter.MaxFilter(3))
    mask=Image.fromarray(np.maximum(np.asarray(mask),np.asarray(cord_mask)))
    # Remove old leaf tips protruding outside the new cover silhouettes.
    x1,y1,x2,y2=leaf_regions[crop]
    keep=np.zeros((780,780),bool);keep[y1:y2,x1:x2]=old_green[y1:y2,x1:x2]
    leaves=Image.fromarray(keep.astype('uint8')*255).filter(ImageFilter.MaxFilter(3))
    mask=Image.fromarray(np.maximum(np.asarray(mask),np.asarray(leaves)))
    mask=mask.filter(ImageFilter.GaussianBlur(.45))
    allmask=Image.fromarray(np.maximum(np.asarray(allmask),np.asarray(mask)))
    box=storm_boxes[crop]
    records['stormMasks'][crop] = {'source':'storm-low-covers-master.png','sceneBounds':box,
        'mask':{'cloth':poly,'cords':cords[crop],'cordCorridorWidthAt780':30,'cordSelection':'new dark generated pixels within corridor; 1 pixel dilation','oldLeafRemovalRegion':leaf_regions[crop],'featherAt780':.45}}

storm_box=[0,132,780,614]
layer=generated.convert('RGBA');layer.putalpha(allmask)
save(layer.crop(storm_box).resize((1560,964),Image.Resampling.LANCZOS),'storm-covered-crops',storm_box,
     source='storm-low-covers-master.png; union of the three recorded cloth/cord masks.')
save(Image.new('RGBA',(1560,964)),'storm-cover-target',storm_box,source='Transparent receiving canvas matching combined low-cover result.')
allmask.save(RUN/'storm-selection-mask.png')
proof=original.convert('RGBA');proof.alpha_composite(layer);proof.save(RUN/'storm-covered-proof.png')

# Concise reproducible metadata; disposable visual proofs stay under runs/.
records['constructionBackground']='assets/live-feedback/garden/construction-with-service-header.webp'
records['constructionHeader']={'source':'assets/survival/items/one-room-for-roots-irrigated-growing-beds.png','allocationTrace':header_poly,'pipeSilhouettePaths':header_paths,'featherAtArt4x':.5,'premise':'Existing shared service header; each bed action fits its individual branch. Broad source-background ribbons excluded. All pixels outside its alpha remain unchanged.'}
records['harvestBackground']='assets/survival/scenes/supper-from-the-garden.webp'
records['stormBackground']='assets/survival/scenes/keep-the-roots-alive.webp'
records['layerOrder']='For storm, render entrance wall screen first and crop covers afterward. Potato foil overlay precedes potato seed overlay.'
(P/'geometry.json').write_text(json.dumps(records,indent=2)+'\n')

for state in ['ceramic','fabric','medium','dripped','planted']:
    im=background.copy()
    for crop,box in bed_boxes.items():
        source=planted_proofs[crop] if state=='planted' else Image.open(OUT/(crop+'-'+state+'.png'))
        icon=source.resize((box[2]-box[0],box[3]-box[1]),Image.Resampling.LANCZOS)
        im.alpha_composite(icon,(box[0],box[1]))
    im.crop((0,0,780,844)).resize((390,422),Image.Resampling.LANCZOS).save(RUN/('proof-'+state+'.png'))
print('Exported',len(records['assets']),'assets; geometry.json owns bounds and centres.')
