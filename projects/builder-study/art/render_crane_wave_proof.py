"""Creator still/kinematic proofs; no animation and no independent acceptance."""
import argparse,hashlib,json,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy
import scene_parts as S
import lifting_crane as L
import wave_machine as W
from construction import bounds_world
p=argparse.ArgumentParser();p.add_argument('--family',choices=['crane','wave','both'],default='both');p.add_argument('--resolution',type=int,default=700);p.add_argument('--phases',type=int,default=12)
args=p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
for family,module in [('crane',L),('wave',W)]:
 if args.family not in [family,'both']:continue
 out=HERE.parents[2]/'runs'/'builder-study'/f'{family}-pilot';out.mkdir(parents=True,exist_ok=True)
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 scene=S.configure_render(args.resolution);scene.render.threads_mode='FIXED';scene.render.threads=4;scene.cycles.samples=16
 model=module.build_model()
 cameras={k:S.camera(k,v['location'],v['target'],v['scale']) for k,v in module.VIEWS.items()}
 proof=module.proof();proof['creator_check']=True
 (out/'kinematic-check.json').write_text(json.dumps(proof,indent=2)+'\n')
 (out/'part-map.json').write_text(json.dumps({k:[o.name for o in v] for k,v in model['parts'].items()},indent=2)+'\n')
 (out/'view-config.json').write_text(json.dumps(module.VIEWS,indent=2)+'\n')
 (out/'source-sha256.json').write_text(json.dumps({p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [HERE/module.__name__.replace('.','/').__add__('.py'),HERE/'scene_parts.py',HERE/'construction.py',Path(__file__)]},indent=2)+'\n')
 scene.camera=cameras['three-quarter']
 def render(name):
  scene.render.filepath=str(out/(name+'.png'));bpy.ops.render.render(write_still=True)
 cases=['lc-braced','lc-wide-frame','lc-rigged','lc-pawl-rigged','lc-tipping','lc-pawl-tipping','lc-balanced','lc-ballasted-unproven','lc-pawl-ballasted-unproven','lc-ratchet-frame','lifting-crane','lift-supported-module'] if family=='crane' else ['wm-base','wm-motor-frame','wm-driver-frame','wm-belt-frame','wm-cord-frame','wm-tensioned','wm-guarded','wm-running','wm-looping','wm-bridged','wave-machine']
 for case in cases:module.set_state(model,case);render('state-'+case)
 module.set_state(model,'lifting-crane' if family=='crane' else 'wave-machine')
 for i in range(args.phases):
  if family=='crane':module.apply_pose(model,module.DIMS.maximum_lift*i/max(1,args.phases-1))
  else:module.apply_pose(model,2*module.math.pi*i/args.phases,'standing')
  render('motion-'+str(i).zfill(2))
 for label,camera in cameras.items():
  scene.camera=camera
  if family=='crane':module.apply_pose(model,.16)
  else:module.apply_pose(model,module.math.pi/2,'standing')
  render('diagnostic-'+label)
 if family=='crane':
  scene.camera=cameras['three-quarter'];module.set_state(model,'lifting-crane');module.apply_pose(model,.12,released=True);render('controlled-lowering-pawl-released')
  module.apply_pose(model,.12)
 if family=='wave':
  scene.camera=cameras['three-quarter']
  for mode in ['stopped','plucked']:
   for label,x in [('long',-.015),('short',.170)]:module.apply_pose(model,0,mode,bridge_x=x,amplitude=.006);render(mode+'-'+label)
  module.apply_pose(model,0,'bridged');render('bridge-powered-contact')
  for label,anchor in [('low',.264),('high',.272)]:module.apply_pose(model,0,'standing',anchor=anchor);render('tension-'+label)
  module.apply_pose(model,0,'standing')
 scene.camera=cameras['three-quarter']
 bpy.context.view_layer.update()
 (out/'visible-bounds.json').write_text(json.dumps(bounds_world([o for v in model['parts'].values() for o in v]),indent=2)+'\n')
 bpy.ops.wm.save_as_mainfile(filepath=str(out/(family+'.blend')))
print('CRANE WAVE STILLS COMPLETE')
