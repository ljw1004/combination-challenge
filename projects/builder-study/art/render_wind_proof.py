"""Disposable flat/folded/assembled stills from the shared wind-toy geometry."""
import json
import sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import bpy
import scene_parts as S
import wind_toys as W
from construction import set_visible_parts
out=HERE.parents[2]/"runs"/"builder-study"/"wind-pilot"
out.mkdir(parents=True,exist_ok=True)
(out/"geometry-check.json").write_text(json.dumps(W.check_wind_toys(),indent=2)+"\n")
for family in ("pinwheel","racer"):
 bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
 scene=S.configure_render(640);scene.render.threads_mode="FIXED";scene.render.threads=4
 scene.cycles.samples=16
 model=W.build_pinwheel() if family=="pinwheel" else W.build_racer()
 v=model["view"];scene.camera=S.camera("family camera",v["location"],v["target"],v["scale"])
 if family=="pinwheel":
  cases=[("uncut",["pw-paper"],False,False),("cut",["pw-paper"],False,True),
         ("folded",["pw-paper","pw-hub"],True,True),
         ("axle",["pw-paper","pw-hub","pw-axle"],True,True),
         ("complete",["pw-paper","pw-hub","pw-axle","pw-handle"],True,True)]
 else:
  cases=[("chassis",["wr-chassis"],False,False),
         ("bearings",["wr-chassis","wr-bearings"],False,False),
         ("rolling",["wr-chassis","wr-bearings","wr-wheelset"],False,False),
         ("complete",["wr-chassis","wr-bearings","wr-wheelset","wr-mast","wr-sailcloth"],False,False)]
 for label,parts,folded,cut in cases:
  set_visible_parts(model,parts)
  if family=="pinwheel":W.set_pinwheel_state(model,folded,cut)
  scene.render.filepath=str(out/f"{family}-{label}.png");bpy.ops.render.render(write_still=True)
 bpy.ops.wm.save_as_mainfile(filepath=str(out/f"{family}.blend"))
print("Wind toy prototype complete",out)
