"""Rebuild disposable geometry proofs.

python3 projects/builder-study/art/render_cam_dragon_proof.py --numeric-only
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup \
  --python projects/builder-study/art/render_cam_dragon_proof.py -- --resolution 640

All proof output defaults to ignored runs/builder-study/3d-pilot-v2. The .blend is an
editable candidate, not an accepted production master. No animation interpolates
rigid meshes: each rendered phase is set from the analytic linkage solution.
"""
import argparse
import json
import math
from pathlib import Path
import sys

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
from cam_dragon import proof, VARIANTS


def main():
    argv=sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else sys.argv[1:]
    parser=argparse.ArgumentParser()
    parser.add_argument("--output",type=Path,default=HERE.parents[2]/"runs"/"builder-study"/"3d-pilot-v2")
    parser.add_argument("--resolution",type=int,default=640)
    parser.add_argument("--numeric-only",action="store_true")
    parser.add_argument("--phases",type=int,default=12)
    parser.add_argument("--variant",choices=[*VARIANTS,"both"],default="both")
    args=parser.parse_args(argv)
    args.output.mkdir(parents=True,exist_ok=True)
    report=proof()
    (args.output/"kinematic-proof.json").write_text(json.dumps(report,indent=2)+"\n")
    print(json.dumps(report["variants"],indent=2))
    if args.numeric_only:return
    import bpy
    from cam_dragon import build_model,apply_pose,verify_blender_model,set_service_state,SERVICE_STEPS
    from check_cam_dragon_meshes import source_hashes
    from scene_parts import camera,configure_render
    for variant in VARIANTS if args.variant=="both" else [args.variant]:
        bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
        scene=configure_render(args.resolution)
        scene.render.threads_mode="FIXED";scene.render.threads=4
        model=build_model(variant,include_handle=True)
        mesh_proof=verify_blender_model(model)
        (args.output/f"{variant}-mesh-proof.json").write_text(json.dumps(mesh_proof,indent=2)+"\n")
        cameras={
            "front":camera("front orthographic",(0,-1,.165),(0,0,.165),.38),
            "three_quarter":camera("instructional three quarter",(.48,-.9,.48),(0,0,.16),.40),
            "side":camera("right side orthographic",(1,0,.16),(0,0,.16),.38),
            "rear":camera("rear orthographic",(0,1,.165),(0,0,.165),.38),
        }
        for i in range(args.phases):
            angle=2*math.pi*i/args.phases
            apply_pose(model,angle)
            scene.camera=cameras["front"]
            scene.render.filepath=str(args.output/f"{variant}-phase-{i:02d}.png")
            bpy.ops.render.render(write_still=True)
        for view in ["three_quarter","side","rear"]:
            apply_pose(model,math.pi/2)
            scene.camera=cameras[view]
            scene.render.filepath=str(args.output/f"{variant}-{view}.png")
            bpy.ops.render.render(write_still=True)
        scene.camera=cameras["three_quarter"]
        bpy.ops.wm.save_as_mainfile(filepath=str(args.output/f"cam-dragon-{variant}.blend"))
        (args.output/f"{variant}-part-map.json").write_text(json.dumps(
            {part:[{"name":obj.name,"storage_with":obj.get("storage_with")} for obj in objects]
             for part,objects in model["parts"].items()},indent=2)+"\n")
        if variant=="two_lobe":
            scene.camera=camera("stopped cam service overview",(.62,-.9,.53),(0,-.035,.165),.48)
            service=[]
            for i,step in enumerate(SERVICE_STEPS):
                service.append(set_service_state(model,step))
                scene.render.filepath=str(args.output/f"service-{i:02d}-{step}.png")
                bpy.ops.render.render(write_still=True)
            (args.output/"service-sequence.json").write_text(json.dumps(service,indent=2)+"\n")
            bpy.ops.wm.save_as_mainfile(filepath=str(args.output/"cam-dragon-parked.blend"))
            # An explicitly exploded still makes the actual D bore and retaining clip inspectable.
            model["handle_state"]="fitted";apply_pose(model,0)
            model["handle"].location.y=-.020
            for obj in model["parts"]["cd-crank-key"]:
                if obj.name=="crank retaining clip":obj.location.z=.018
            scene.camera=camera("D socket and removable retaining clip",(.20,-.4,.16),(0,-.092,.058),.13)
            scene.render.filepath=str(args.output/"drive-coupling-exploded-detail.png")
            bpy.ops.render.render(write_still=True)
    (args.output/"source-sha256.json").write_text(json.dumps(source_hashes(),indent=2)+"\n")
    print("Proof output:",args.output)


if __name__=="__main__":main()
