"""Geometry-only theatre check; scratch JSON/.blend, no production rendering.

python3 projects/builder-study/art/check_shadow_theatre.py --numeric-only
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup \
  --python projects/builder-study/art/check_shadow_theatre.py
"""
import argparse
import json
from pathlib import Path
import sys

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
from shadow_theatre import proof


def main():
    argv=sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else sys.argv[1:]
    parser=argparse.ArgumentParser();parser.add_argument("--numeric-only",action="store_true")
    parser.add_argument("--samples",type=int,default=72)
    parser.add_argument("--output",type=Path,default=HERE.parents[2]/"runs"/"builder-study"/"theatre-pilot")
    args=parser.parse_args(argv);args.output.mkdir(parents=True,exist_ok=True)
    report=proof();(args.output/"optical-proof.json").write_text(json.dumps(report,indent=2)+"\n")
    if args.numeric_only:return
    import bpy
    from shadow_theatre import build_model,verify_blender_model
    bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
    model=build_model();result=verify_blender_model(model,args.samples)
    (args.output/"mesh-proof.json").write_text(json.dumps(result,indent=2)+"\n")
    bpy.ops.wm.save_as_mainfile(filepath=str(args.output/"shadow-theatre.blend"))
    print(json.dumps(result,indent=2))
    if not result["passed"]:raise RuntimeError("Theatre geometry or optical-path check failed")


if __name__=="__main__":main()
