"""First composition proof: canonical pinwheel and racer in their garden."""
import sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy
import scene_parts as S
import garden as G
import wind_toys as W
out=HERE.parents[2]/"runs"/"builder-study"/"reward-pilot";out.mkdir(parents=True,exist_ok=True)
for identity in ("pinwheel","wind-racer"):
    bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
    scene=S.configure_render(1280);scene.render.resolution_y=900;scene.cycles.samples=48;scene.render.threads_mode="FIXED";scene.render.threads=4
    if identity=="pinwheel":
        G.build(bench=True)
        model=W.build_pinwheel();model["root"].location=(.07,-.1,.69)
        G.plant(.07,-.077,.630,foliage=False)
        G.plant(-.24,.18,.630,height=.26,seed=31)
        scene.camera=S.camera("pinwheel in a breeze",(.70,-1.3,1.13),(.03,-.02,.83),.78)
    else:
        G.build(bench=False);G.chalk_lane();G.watering_can(.60,-.31)
        model=W.build_racer();model["root"].location=(-.14,-.35,.008)
        scene.camera=S.camera("racer towards the watering can",(.85,-1.5,.78),(.05,-.27,.17),1.16)
    scene.render.filepath=str(out/(identity+".png"));bpy.ops.render.render(write_still=True)
print("Garden reward composition pilot",out)
