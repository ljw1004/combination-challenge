"""Rebuild disposable full-size whale layout proofs under ignored runs/.

python3 projects/builder-study/art/render_flying_whale_proof.py --numeric-only
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup \
  --python projects/builder-study/art/render_flying_whale_proof.py -- --resolution 900
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import sys

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
from flying_whale import layout_proof


def main():
    argv=sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else sys.argv[1:]
    parser=argparse.ArgumentParser()
    parser.add_argument("--output",type=Path,default=HERE.parents[2]/"runs"/"builder-study"/"whale-pilot")
    parser.add_argument("--resolution",type=int,default=900)
    parser.add_argument("--samples",type=int,default=144)
    parser.add_argument("--numeric-only",action="store_true")
    parser.add_argument("--skip-renders",action="store_true")
    args=parser.parse_args(argv);args.output.mkdir(parents=True,exist_ok=True)
    def source_hashes():
        return {name:hashlib.sha256((HERE/name).read_bytes()).hexdigest()
                for name in ["flying_whale.py","shadow_theatre.py","cam_dragon.py","scene_parts.py"]}
    original_hashes=source_hashes()
    report=layout_proof();(args.output/"layout-proof.json").write_text(json.dumps(report,indent=2)+"\n")
    print(json.dumps({k:report[k] for k in ["loaded_trimmed_mass_kg","loaded_trimmed_cg_m","loaded_lift_above_cg_m","loaded_counterweight_x_m","tether_length_max_error_m"]},indent=2))
    if args.numeric_only:return
    import bpy
    from flying_whale import build_model,apply_pose,verify_blender_model
    from scene_parts import camera,configure_render,look_at
    bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
    scene=configure_render(args.resolution)
    scene.cycles.samples=20
    for obj in [obj for obj in bpy.data.objects if obj.type=="LIGHT"]:
        obj.location*=3;obj.data.energy*=5;obj.data.size*=3;look_at(obj,(0,0,.34))
    model=build_model(show_optical_path=True)
    mesh=verify_blender_model(model,args.samples)
    mesh["source_sha256"]=original_hashes
    mesh["sources_unchanged_during_check"]=original_hashes==source_hashes()
    mesh["passed"]=mesh["passed"] and mesh["sources_unchanged_during_check"]
    (args.output/"mesh-proof.json").write_text(json.dumps(mesh,indent=2)+"\n")
    print(json.dumps(mesh,indent=2))
    views={"front":((0,-2,.34),(0,0,.34),1.17),
           "three-quarter":((1.2,-2.1,1.10),(0,0,.31),1.25),
           "rear-service":((.8,1.8,.80),(0,0,.31),1.21),
           "end":((-2,0,.34),(0,0,.34),.80),
           "top":((0,-.001,2),(0,0,.25),1.16),
           "full-height":((1.9,-3.1,1.95),(0,0,.83),2.35)}
    cameras={name:camera(name,*v) for name,v in views.items()}
    if not args.skip_renders:
        for name in views:
            apply_pose(model,math.pi/2,1 if name=="full-height" else 0,90 if name=="rear-service" else 0)
            scene.camera=cameras[name];scene.render.filepath=str(args.output/(name+".png"));bpy.ops.render.render(write_still=True)
        # A separate cutaway preserves every physical component; it only hides skin
        # for this proof view and restores it before saving the canonical scene.
        for obj in model["skin"]+model["parts"]["whale-hatch"]+model["drive_cover"]:obj.hide_render=True
        apply_pose(model,0,0);scene.camera=cameras["three-quarter"]
        scene.render.filepath=str(args.output/"service-and-drive-cutaway.png");bpy.ops.render.render(write_still=True)
        for obj in model["skin"]+model["parts"]["whale-hatch"]+model["drive_cover"]:obj.hide_render=False
        for i in range(8):
            apply_pose(model,2*math.pi*i/8,0);scene.camera=cameras["front"]
            scene.render.filepath=str(args.output/f"motion-{i:02d}.png");bpy.ops.render.render(write_still=True)
    apply_pose(model,0,0);scene.camera=cameras["three-quarter"]
    bpy.ops.wm.save_as_mainfile(filepath=str(args.output/"flying-whale-layout.blend"))
    if not mesh["passed"]:raise RuntimeError("Whale geometry proof has unresolved failures; see mesh-proof.json")


if __name__=="__main__":main()
