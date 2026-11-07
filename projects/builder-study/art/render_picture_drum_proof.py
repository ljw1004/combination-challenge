"""Disposable construction-state evidence for the picture drum."""
import json
import sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import bpy
import scene_parts as S
import picture_drum as D
out=HERE.parents[2]/"runs"/"builder-study"/"drum-pilot"
out.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
scene=S.configure_render(720);scene.render.threads_mode="FIXED";scene.render.threads=4;scene.cycles.samples=16
model=D.build_model()
for state in ("film-wall","film-slotted","film-cylinder","film-floor","film-shell","film-turntable","film-turning-drum","film-key-poses","film-coloured-strip","animation-drum"):
    v=D.set_state(model,state)
    scene.camera=S.camera("state camera",v["location"],v["target"],v["scale"])
    scene.render.filepath=str(out/(state+".png"));bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(out/"picture-drum.blend"))
(out/"dimensions.json").write_text(json.dumps(D.dimensions(),indent=2)+"\n")
print("Picture-drum states rendered",out)
