"""Disposable exterior recognition/fit sheet inputs for supplied tools."""
import sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import bpy
import scene_parts as S
import hand_tools as T
out=HERE.parents[2]/"runs"/"builder-study"/"tools-pilot"
out.mkdir(parents=True,exist_ok=True)
for identity in sorted(T.TOOL_IDS):
    bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
    scene=S.configure_render(480);scene.render.threads_mode="FIXED";scene.render.threads=4;scene.cycles.samples=16
    model=T.build_model(identity);v=model["view"]
    scene.camera=S.camera("tool camera",v["location"],v["target"],v["scale"])
    scene.render.filepath=str(out/(identity+".png"));bpy.ops.render.render(write_still=True)
print("Supplied tools rendered",out)
