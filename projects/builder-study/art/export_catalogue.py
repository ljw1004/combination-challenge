"""Deterministic alpha export; fixed constructions keep their camera canvas.

Run with a Python environment containing Pillow. Geometry masters are unchanged.
Standalone tiny fittings receive a documented readability floor; fitted parts
and every hotspot retain the canonical family projection.
"""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image

parser=argparse.ArgumentParser()
parser.add_argument("--catalogue",required=True)
parser.add_argument("--masters",required=True)
parser.add_argument("--output",required=True)
args=parser.parse_args()
catalogue=json.loads(Path(args.catalogue).read_text())
masters=Path(args.masters);out=Path(args.output)
for folder in ("items","hotspots","overlays"):(out/folder).mkdir(parents=True,exist_ok=True)
hotspots={ident for chapter in catalogue["chapters"] for ident in chapter["hotspots"]}
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
    box=(max(0,box[0]-8),max(0,box[1]-8),min(im.width,box[2]+8),min(im.height,box[3]+8))
    crop=im.crop(box)
    factor=1.
    if item["slots"]:
        crop=im.copy();box=(0,0,im.width,im.height)
    else:
        longest=max(crop.size)
        if longest<128:factor=128/longest
        if item["primitive"] and longest>720:factor=720/longest
        if factor!=1:crop=crop.resize(tuple(round(x*factor) for x in crop.size),Image.Resampling.LANCZOS)
    dest=out/"items"/(item["id"]+".webp")
    crop.save(dest,lossless=True,method=6)
    if item["id"] in hotspots:im.save(out/"hotspots"/(item["id"]+".webp"),lossless=True,method=6)
    records.append({"id":item["id"],"masterSha256":hashlib.sha256(source.read_bytes()).hexdigest(),
                    "crop":box,"standaloneScale":factor,"itemPixels":crop.size,
                    "hotspotPixels":im.size if item["id"] in hotspots else None,
                    "outputSha256":hashlib.sha256(dest.read_bytes()).hexdigest()})
(out.parent/"export-manifest.json").write_text(json.dumps({"storyHash":catalogue["storyHash"],
    "policy":"Native family projection for fitted parts/hotspots. Alpha crop for standalone items; 32 CSS px minimum longest dimension, 180 CSS px maximum primitive longest dimension at the 390px viewport. Compound owners retain full overlay canvas.",
    "images":records},indent=2)+"\n")
print("Exported",len(records),"items and",len(hotspots),"fixed-state icons")
