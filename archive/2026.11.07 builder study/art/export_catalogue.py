"""Deterministic alpha export; fixed constructions keep their camera canvas.

Run with a Python environment containing Pillow. Geometry masters are unchanged.
Standalone tiny fittings receive a documented readability floor; fitted parts
and every hotspot retain the canonical family projection.
"""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont

parser=argparse.ArgumentParser()
parser.add_argument("--catalogue",required=True)
parser.add_argument("--masters",required=True)
parser.add_argument("--output",required=True)
args=parser.parse_args()
catalogue=json.loads(Path(args.catalogue).read_text())
masters=Path(args.masters);out=Path(args.output)
for folder in ("items","hotspots","overlays"):(out/folder).mkdir(parents=True,exist_ok=True)
hotspots={ident for chapter in catalogue["chapters"] for ident in chapter["hotspots"]}
flat_strips={"film-blank-strip","film-key-poses","film-drawn-strip","film-coloured-strip"}
banner_pair={"fair-rover-paper","fair-written-banner"}
shared_boxes={}
for group in (flat_strips,banner_pair):
    group_box=None
    for ident in group:
        source=masters/(ident+".png")
        if not source.exists():continue
        visible=Image.open(source).convert("RGBA").getchannel("A").point(lambda n:255 if n>8 else 0).getbbox()
        if visible:
            group_box=visible if group_box is None else (min(group_box[0],visible[0]),min(group_box[1],visible[1]),max(group_box[2],visible[2]),max(group_box[3],visible[3]))
    for ident in group:shared_boxes[ident]=group_box
records=[]
for item in catalogue["items"]:
    source=masters/(item["id"]+".png")
    if not source.exists():raise FileNotFoundError(source)
    im=Image.open(source).convert("RGBA")
    # Threshold avoids isolated denoising pixels inflating transparent margins.
    alpha=im.getchannel("A");box=alpha.point(lambda n:255 if n>8 else 0).getbbox()
    if box is None:raise ValueError("Invisible identity: "+item["id"])
    if min(box[0],box[1],im.width-box[2],im.height-box[3])<2:
        raise ValueError("Geometry touches the master edge: "+item["id"])
    detail_inputs=[]
    if item["id"] in {"whale-nose-down","whale-trimmed"}:
        # The service camera is an honest second view. Its labeled frame lives
        # in unused canvas space; the registered main assembly stays unchanged.
        detail_path=masters/(item["id"]+"-detail.png")
        metadata_path=masters/(item["id"]+"-detail.json")
        detail=Image.open(detail_path).convert("RGBA")
        metadata=json.loads(metadata_path.read_text())
        x,y,w,h=[round(v*n) for v,n in zip(metadata["rect_fraction"],(im.width,im.height,im.width,im.height))]
        panel=Image.new("RGBA",(w,h),"#faf5e5")
        detail.thumbnail((w-24,h-68),Image.Resampling.LANCZOS)
        panel.alpha_composite(detail,((w-detail.width)//2,12))
        draw=ImageDraw.Draw(panel)
        font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',40)
        if draw.textlength(metadata["label"],font=font)>w-24:raise ValueError("Service detail label does not fit")
        draw.text((12,h-52),metadata["label"],font=font,fill="#294849")
        draw.rounded_rectangle((0,0,w-1,h-1),radius=12,outline="#587b7c",width=3)
        im.alpha_composite(panel,(x,y))
        box=im.getchannel("A").point(lambda n:255 if n>8 else 0).getbbox()
        detail_inputs=[{"name":p.name,"sha256":hashlib.sha256(p.read_bytes()).hexdigest()} for p in (detail_path,metadata_path)]
    if item["id"] in shared_boxes:box=shared_boxes[item["id"]]
    box=(max(0,box[0]-8),max(0,box[1]-8),min(im.width,box[2]+8),min(im.height,box[3]+8))
    crop=im.crop(box)
    factor=1.
    padding=(0,0)
    if item["slots"]:
        crop=im.copy();box=(0,0,im.width,im.height)
        for slot in item["slots"]:
            overlay_name=item["id"]+"--"+slot["accepts"]
            overlay=Image.open(masters/(overlay_name+".png")).convert("RGBA")
            if overlay.size!=im.size:raise ValueError("Overlay canvas mismatch: "+overlay_name)
            if not overlay.getchannel("A").getbbox():raise ValueError("Empty overlay: "+overlay_name)
            overlay.save(out/"overlays"/(overlay_name+".webp"),lossless=True,method=4)
    else:
        longest=max(crop.size)
        if item["id"] in {"air-test-block","air-fruit-game"}:
            # This literal test object must fit the jaws visually. Preserve its
            # family projection and supply a selectable canvas around it.
            canvas=Image.new("RGBA",(max(176,crop.width),max(176,crop.height)))
            padding=((canvas.width-crop.width)//2,(canvas.height-crop.height)//2)
            canvas.paste(crop,padding);crop=canvas
        elif item["id"] in banner_pair:
            # Writing on the supplied sheet cannot change its physical scale.
            factor=min(1.,720/longest)
        elif item["id"] not in flat_strips:
            if longest<176:factor=176/longest
            if item["primitive"] and longest>720:factor=720/longest
        if factor!=1:crop=crop.resize(tuple(round(x*factor) for x in crop.size),Image.Resampling.LANCZOS)
    dest=out/"items"/(item["id"]+".webp")
    crop.save(dest,lossless=True,method=4)
    if item["id"] in hotspots:im.save(out/"hotspots"/(item["id"]+".webp"),lossless=True,method=4)
    if item["id"]=="whale-running-fair":
        variant=Image.open(masters/"whale-running-fair-garden.png").convert("RGBA")
        b=variant.getchannel("A").point(lambda n:255 if n>8 else 0).getbbox()
        if variant.size!=im.size or not b or min(b[0],b[1],variant.width-b[2],variant.height-b[3])<2:
            raise ValueError("Invalid garden construction variant")
        variant.save(out/"hotspots"/"whale-running-fair-garden.webp",lossless=True,method=4)
    records.append({"id":item["id"],"masterSha256":hashlib.sha256(source.read_bytes()).hexdigest(),
                    "crop":box,"standaloneScale":factor,"paddingPixels":padding,"itemPixels":crop.size,
                    "hotspotPixels":im.size if item["id"] in hotspots else None,
                    "detailInputs":detail_inputs,
                    "outputSha256":hashlib.sha256(dest.read_bytes()).hexdigest()})
(out.parent/"export-manifest.json").write_text(json.dumps({"storyHash":catalogue["storyHash"],
    "policy":"Native family projection for fitted parts/hotspots. Alpha crop for standalone items; 44 CSS px minimum longest dimension, 180 CSS px maximum primitive longest dimension at the 390px viewport. The literal grabber test block and fruit game keep native scale inside minimum selectable canvases; all four flat picture-strip states share one native-scale crop. The blank/written invitation banner pair shares its own crop and scale. Compound owners retain full overlay canvas.",
    "images":records},indent=2)+"\n")
print("Exported",len(records),"items and",sum(r["hotspotPixels"] is not None for r in records),"fixed-state icons")
