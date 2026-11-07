"""Render strict same-scale construction masters, grouped to reuse geometry.

Blender ... --python render_catalogue.py -- --catalogue FILE --output DIR
Optional --families pw,wr or --ids comma,separated. Masters remain disposable
until reviewed and selected; export_catalogue.py prepares runtime assets.
"""
import argparse
import hashlib
import json
import sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import bpy
import scene_parts as S
import presentation as P
from construction import bounds_world

parser=argparse.ArgumentParser()
parser.add_argument("--catalogue",required=True)
parser.add_argument("--output",required=True)
parser.add_argument("--families",default="")
parser.add_argument("--ids",default="")
args=parser.parse_args(sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else [])
catalogue=json.loads(Path(args.catalogue).read_text())
out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
families=set(args.families.split(",")) if args.families else None
ids=set(args.ids.split(",")) if args.ids else None
groups={}
for item in catalogue["items"]:
    if families and item["family"] not in families:continue
    if ids and item["id"] not in ids:continue
    groups.setdefault(P.factory_key(item),[]).append(item)
records=[]
for key,items in groups.items():
    bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
    resolution=1200 if key=="whale" else 960
    scene=S.configure_render(resolution);scene.render.threads_mode="FIXED";scene.render.threads=4;scene.cycles.samples=24
    model=P.build(key)
    for item in items:
        v=P.stage(model,item,key)
        scene.camera=S.camera("construction camera",v["location"],v["target"],v["scale"])
        bpy.context.view_layer.update()
        visible=[o for objects in model["parts"].values() for o in objects if not o.hide_render and o.type in {"MESH","CURVE","FONT"}]
        if not visible:raise RuntimeError("No geometry for "+item["id"])
        filepath=out/(item["id"]+".png")
        scene.render.filepath=str(filepath);bpy.ops.render.render(write_still=True)
        records.append({"id":item["id"],"family":item["family"],"primitive":item["primitive"],"key":key,
                        "resolution":resolution,"view":v,"bounds":bounds_world(visible),"objects":len(visible),"parts":sorted({o["part_id"] for o in visible})})
        print("RENDERED",item["id"],flush=True)
    # Selected model source can be regenerated from the canonical Python files.
batch=hashlib.sha256("\n".join(sorted(r["id"] for r in records)).encode()).hexdigest()[:12]
(out/("manifest-"+batch+".json")).write_text(json.dumps({"storyHash":catalogue["storyHash"],"images":records},indent=2)+"\n")
print("Rendered",len(records),"strict artwork identities",flush=True)
