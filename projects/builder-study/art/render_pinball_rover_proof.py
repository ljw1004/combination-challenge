"""Disposable transparent still proofs from the exact canonical model geometry."""
import argparse,json,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy
import scene_parts as S
import pinball_table as P
import drawing_rover as R
p=argparse.ArgumentParser();p.add_argument('--out',default='runs/builder-study/pinball-rover-pilot');p.add_argument('--family',choices=['all','pinball','rover'],default='all');p.add_argument('--quick',action='store_true');p.add_argument('--resolution',type=int,default=600);args=p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
out=Path(args.out);out.mkdir(parents=True,exist_ok=True);manifest=[]
if args.family!='all' and (out/'render-manifest.json').exists():manifest=[r for r in json.loads((out/'render-manifest.json').read_text()) if r['family']!=args.family]
for family,mod in [('pinball',P),('rover',R)]:
 if args.family not in ('all',family):continue
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 scene=S.configure_render(args.resolution);scene.render.threads_mode='FIXED';scene.render.threads=4;scene.cycles.samples=12;scene.view_settings.exposure=-1.8
 m=mod.build_model()
 def render(label,view=None):
  v=view or m['view'];camera=S.camera('proof camera',v['location'],v['target'],v['scale']);scene.camera=camera
  path=out/f'{family}-{label}.png';scene.render.filepath=str(path);bpy.ops.render.render(write_still=True);bpy.data.objects.remove(camera,do_unlink=True)
  manifest.append({'family':family,'label':label,'file':path.name,'view':v})
 if family=='pinball':
  mod.set_state(m,'pinball-table');render('complete')
  if not args.quick:
   render('underside',mod.VIEWS['underside']);render('top',mod.VIEWS['top'])
   for q in (0,.5,1):mod.apply_pose(m,mod.DIMS.launcher_long*q,(q,q),True);render('travel-'+str(q),mod.VIEWS['top'])
   for state in list(mod.SUPPLIES)+list(mod.STATES)+['work-screwdriver']:
    mod.set_state(m,state);render(state)
   mod.set_state(m,'pb-plunger-tube',service_open=True);render('spring-service-access',mod.VIEWS['launcher'])
   mod.set_state(m,'pb-tuned',pull=.022);render('launcher-pulled',mod.VIEWS['launcher'])
   mod.set_state(m,'pinball-table')
 else:
  mod.set_state(m,'drawing-rover');render('complete')
  if not args.quick:
   mod.set_state(m,'rover-deck',slots=mod.SLOTS);render('all-slots')
   for slot in mod.SLOTS:mod.set_overlay(m,slot);render('overlay-'+slot,mod.COMPOUND_VIEW)
   for state in list(mod.SUPPLIES)+list(mod.STATES)+['rover-trim-driver']:
    mod.set_state(m,state);render(state)
   for angle,label in [(0,'down'),(mod.PEN_MAX/2,'mid'),(mod.PEN_MAX,'up')]:
    mod.set_state(m,'rover-pen-deck',raised=False,pen_angle=angle);render('pen-'+label,mod.VIEWS['pen'])
   mod.set_state(m,'rover-tested');render('test-stops',mod.VIEWS['side'])
   mod.set_state(m,'rover-deck',slots=mod.SLOTS)
 # Selected editable scratch model with a real camera, no animation timeline.
 v=m['view'];scene.camera=S.camera('inspection camera',v['location'],v['target'],v['scale'])
 bpy.ops.wm.save_as_mainfile(filepath=str(out/f'{family}.blend'))
(out/'render-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Still proof output:',out)
