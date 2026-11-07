"""Disposable construction views and ideal-ray checks for the optical toys."""
import json
import sys
from pathlib import Path

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import bpy
import optical_toys as O
import scene_parts as S
from construction import set_visible_parts

out=HERE.parents[2]/"runs"/"builder-study"/"optics-pilot"
out.mkdir(parents=True,exist_ok=True)
(out/"ideal-rays.json").write_text(json.dumps(O.check_optics(),indent=2)+"\n")
cases={
 "periscope":[("flat",["pe-net","pe-lining"],False),
              ("tube",["pe-net","pe-lining"],True),
              ("upper",["pe-net","pe-lining","pe-upper-mirror"],True),
              ("complete",["pe-net","pe-lining","pe-upper-mirror","pe-lower-mirror","pe-baffles"],True)],
 "kaleidoscope":[("strips",["ka-strips"],False),
                 ("triangle",["ka-strips","ka-tape"],True),
                 ("cell",["ka-cell","ka-chips"],True),
                 ("complete",["ka-strips","ka-tape","ka-tube","ka-cell","ka-chips","ka-diffuser"],True)]}
for family,variants in cases.items():
 bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
 scene=S.configure_render(640)
 scene.render.threads_mode="FIXED";scene.render.threads=4
 scene.cycles.samples=16
 model=O.build_periscope() if family=="periscope" else O.build_kaleidoscope()
 view=model["view"]
 scene.camera=S.camera("family camera",view["location"],view["target"],view["scale"])
 for label,parts,fold in variants:
  set_visible_parts(model,parts)
  if family=="periscope":O.set_periscope_fold(model,fold)
  else:O.set_kaleidoscope_triangle(model,fold)
  scene.render.filepath=str(out/f"{family}-{label}.png")
  bpy.ops.render.render(write_still=True)
 bpy.ops.wm.save_as_mainfile(filepath=str(out/f"{family}.blend"))
print("Optics prototype complete",out)
