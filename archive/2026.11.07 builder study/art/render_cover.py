"""Original garden-workbench cover, keeping all canonical objects at scale one."""
import argparse,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy
import scene_parts as S
import garden as G
import wind_toys as W
import hand_tools as T
p=argparse.ArgumentParser();p.add_argument('--output',required=True);a=p.parse_args(sys.argv[sys.argv.index('--')+1:])
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=S.configure_render(780);scene.render.resolution_y=1688;scene.cycles.samples=48;scene.render.threads_mode='FIXED';scene.render.threads=2
G.build(bench=True)
m=W.build_pinwheel();m['root'].location=(.05,.09,.69);G.plant(.05,.113,.63,foliage=False)
G.plant(-.25,.20,.63,height=.34,seed=31)
fan=T.build_model('work-hand-fan');fan['root'].location=(-.19,-.18,.635);fan['root'].rotation_euler.z=-.4
scissors=T.build_model('work-scissors');scissors['root'].location=(.20,-.12,.635);scissors['root'].rotation_euler.z=-.35
note=S.box('Jo invitation',(.02,-.25,.632),(.19,.12,.001),'paper');note.rotation_euler.z=.12
curve=bpy.data.curves.new('invitation lettering','FONT');curve.body='Can I have\na go?';curve.align_x='CENTER';curve.size=.018;curve.space_line=1.2
text=bpy.data.objects.new('invitation lettering',curve);bpy.context.collection.objects.link(text);text.data.materials.append(S.material('ink'));text.location=(.02,-.245,.633);text.rotation_euler.z=.12
scene.camera=S.camera('invitation on the garden bench',(.65,-1.35,1.34),(.015,.0,.69),1.35)
scene.render.filepath=a.output;bpy.ops.render.render(write_still=True)
