"""Render strict same-scale construction masters, grouped to reuse geometry.

Blender ... --python render_catalogue.py -- --catalogue FILE --output DIR
Optional --families pw,wr or --ids comma,separated. Masters remain disposable
until reviewed and selected; export_catalogue.py prepares runtime assets.
"""
import argparse
import hashlib
import json
import sys
from contextlib import nullcontext
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import bpy
import scene_parts as S
import presentation as P
from construction import bounds_world
from construction_lighting import frame_lights

parser=argparse.ArgumentParser()
parser.add_argument("--catalogue",required=True)
parser.add_argument("--output",required=True)
parser.add_argument("--families",default="")
parser.add_argument("--ids",default="")
parser.add_argument("--threads",type=int,default=2)
parser.add_argument("--garden-view",action="store_true")
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
    scene=S.configure_render(resolution);scene.render.threads_mode="FIXED";scene.render.threads=args.threads;scene.cycles.samples=24
    model=P.build(key)
    source_paths={Path(module.__file__).resolve() for module in tuple(sys.modules.values())
                  if getattr(module,"__file__",None) and Path(module.__file__).resolve().parent==HERE}
    source_paths.add(Path(__file__).resolve())
    source_hashes={str(path.relative_to(HERE)):hashlib.sha256(path.read_bytes()).hexdigest() for path in sorted(source_paths)}
    for item in items:
        v=P.stage(model,item,key)
        if args.garden_view:v=dict(P.GARDEN_VIEW)
        frame_lights(scene,v["scale"])
        scene.camera=S.camera("construction camera",v["location"],v["target"],v["scale"])
        bpy.context.view_layer.update()
        visible=[o for objects in model["parts"].values() for o in objects if not o.hide_render and o.type in {"MESH","CURVE","FONT"}]
        if not visible:raise RuntimeError("No geometry for "+item["id"])
        filepath=out/(item["id"]+".png")
        scene.render.filepath=str(filepath)
        # Transparent close-up optics need smooth sampled coverage. The
        # context restores all render settings before the next assembly.
        if key=="theatre":
            from theatre_presentation import inspection_render
            inspection=inspection_render(scene,item["id"])
        else:
            inspection=nullcontext()
        with inspection:bpy.ops.render.render(write_still=True)
        records.append({"id":item["id"],"family":item["family"],"primitive":item["primitive"],"key":key,
                        "resolution":resolution,"view":v,"bounds":bounds_world(visible),"objects":len(visible),"parts":sorted({o["part_id"] for o in visible}),"sourceHashes":source_hashes})
        print("RENDERED",item["id"],flush=True)
        detail=model.get("whale_service_detail")
        if detail:
            # A second actual camera supplies the labeled service inset. No
            # geometry is removed, resized or replaced for this inspection.
            dv=detail["view"]
            frame_lights(scene,dv["scale"])
            scene.camera=S.camera("service detail camera",dv["location"],dv["target"],dv["scale"])
            scene.render.filepath=str(out/(item["id"]+"-detail.png"))
            original_resolution=(scene.render.resolution_x,scene.render.resolution_y)
            scene.render.resolution_x,scene.render.resolution_y=detail.get("resolution",original_resolution)
            try:bpy.ops.render.render(write_still=True)
            finally:scene.render.resolution_x,scene.render.resolution_y=original_resolution
            (out/(item["id"]+"-detail.json")).write_text(json.dumps(detail,indent=2)+"\n")
            records.append({"id":item["id"]+"-detail","detailOf":item["id"],"view":dv,"sourceHashes":source_hashes})
            print("DETAIL",item["id"],flush=True)
        if item["id"]=="whale-running-fair" and not args.garden_view:
            # The next chapter starts with this same identity in the garden
            # framing shared by every subsequent ground/flight construction.
            garden=dict(P.GARDEN_VIEW)
            frame_lights(scene,garden["scale"])
            scene.camera=S.camera("garden construction camera",garden["location"],garden["target"],garden["scale"])
            scene.render.filepath=str(out/"whale-running-fair-garden.png")
            bpy.ops.render.render(write_still=True)
            records.append({"id":"whale-running-fair-garden","variantOf":item["id"],"key":key,"resolution":resolution,"view":garden,"sourceHashes":source_hashes})
            print("VARIANT whale-running-fair-garden",flush=True)
    for owner in [i for i in items if i["slots"]]:
        module=model["stage_module"]
        for slot in owner["slots"]:
            module.set_overlay(model,slot["accepts"])
            v=model["compound_view"]
            scene.camera=S.camera("compound overlay camera",v["location"],v["target"],v["scale"])
            overlay_id=owner["id"]+"--"+slot["accepts"]
            scene.render.filepath=str(out/(overlay_id+".png"));bpy.ops.render.render(write_still=True)
            records.append({"id":overlay_id,"owner":owner["id"],"slot":slot["accepts"],"key":key,"resolution":resolution,"view":v,"overlay":True,"sourceHashes":source_hashes})
            print("OVERLAY",overlay_id,flush=True)
    # Selected model source can be regenerated from the canonical Python files.
batch=hashlib.sha256("\n".join(sorted(r["id"] for r in records)).encode()).hexdigest()[:12]
(out/("manifest-"+batch+".json")).write_text(json.dumps({"storyHash":catalogue["storyHash"],"images":records},indent=2)+"\n")
print("Rendered",len(records),"artwork images, including compound overlays",flush=True)
