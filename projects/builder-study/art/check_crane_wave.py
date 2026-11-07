"""Creator probes of actual evaluated receiving holes and moving meshes.

Reports surface intersections for inspection. An explicit intended-contact list
is not a general collision or containment certificate.
"""
import argparse,hashlib,json,math,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import lifting_crane as L
import wave_machine as W
p=argparse.ArgumentParser();p.add_argument('--samples',type=int,default=24);args=p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])

def bvh(obj):
    deps=bpy.context.evaluated_depsgraph_get();ev=obj.evaluated_get(deps);mesh=ev.to_mesh()
    vs=[ev.matrix_world@v.co for v in mesh.vertices];ps=[tuple(p.vertices) for p in mesh.polygons]
    result=BVHTree.FromPolygons(vs,ps);ev.to_mesh_clear();return result

def owner(obj,groups):
    p=obj
    while p:
        if p in groups:return p.name
        p=p.parent
    return 'fixed'

for family,module in [('crane',L),('wave',W)]:
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 model=module.build_model();meshes=[o for v in model['parts'].values() for o in v if o.type=='MESH']
 groups=[model[k] for k in (['drum','pulley','pawl'] if family=='crane' else ['motor','driver','swivel'])]
 overlaps={};blocked=[];max_scale_error=0;ratchet_penetration=0
 for i in range(args.samples):
  if family=='crane':module.apply_pose(model,module.DIMS.maximum_lift*i/max(1,args.samples-1))
  else:module.apply_pose(model,2*math.pi*i/args.samples)
  bpy.context.view_layer.update()
  for ob,c,axis,length in model['bore_checks']:
   unit=Vector({'X':(1,0,0),'Y':(0,1,0),'Z':(0,0,1)}[axis]);c=Vector(c)
   # Cutter construction and bores share the parent's coordinate system.
   parent=ob.parent.matrix_world if ob.parent else __import__('mathutils').Matrix.Identity(4)
   inv=ob.matrix_world.inverted();origin=inv@(parent@(c-unit*length/2));direction=(inv.to_3x3()@parent.to_3x3()@unit).normalized()
   hit=ob.ray_cast(origin,direction,distance=length)[0]
   if hit:blocked.append({'phase':i,'object':ob.name,'axis':axis})
  if family=='crane':
   body=next(o for o in meshes if o.name=='rigid pawl and release lever')
   wheel=next(o for o in meshes if o.name=='24 asymmetric ratchet teeth')
   inv=body.matrix_world.inverted()
   for v in wheel.data.vertices:
    q=inv@(wheel.matrix_world@v.co)
    if abs(q.x)<.0231 and abs(q.z)<.0018:
     ratchet_penetration=max(ratchet_penetration,min(.0231-abs(q.x),.0018-abs(q.z)))
  trees={o:bvh(o) for o in meshes}
  for j,a in enumerate(meshes):
   groupA=owner(a,groups)
   max_scale_error=max(max_scale_error,max(abs(x-1) for x in a.matrix_world.to_scale()))
   for b in meshes[j+1:]:
    groupB=owner(b,groups)
    if groupA==groupB:continue
    if trees[a].overlap(trees[b]):overlaps.setdefault(a.name+' | '+b.name,[]).append(i)
 tip_check=None
 if family=='crane':
  lengths=[]
  for tilt in [0,1.5]:
   module.apply_pose(model,.015,tip_degrees=tilt);bpy.context.view_layer.update()
   points=[model['rope'].matrix_world@Vector(p.co[:3]) for p in model['rope'].data.splines[0].points]
   lengths.append(sum((b-a).length for a,b in zip(points,points[1:])))
  delta=points[-1]-points[-2]
  tip_check={'free_leg_horizontal_error_m':math.hypot(delta.x,delta.y),'sampled_polyline_length_change_m':lengths[1]-lengths[0],
             'continuous_length_note':'Outgoing arc shortens R*tilt; vertical drop lengthens by exactly R*tilt.'}
 state_errors=[]
 for identity in list(module.STATES)+list(model['parts'])+list(reversed(module.STATES)):
  module.set_state(model,identity)
  expected=set(module.STATES.get(identity,[identity]))
  if identity in ['lc-tipping','lc-pawl-tipping']:expected.add('lc-test-load')
  if identity=='wave-machine':expected.add('wm-pick')
  actual={part for part,objects in model['parts'].items() if any(not o.hide_render for o in objects)}
  if expected!=actual:state_errors.append({'identity':identity,'expected':sorted(expected),'actual':sorted(actual)})
 intended={
  '24 asymmetric ratchet teeth | rigid pawl and release lever':'Intentional pawl-to-tooth contact; evaluated vertex penetration is separately bounded.',
  '24 asymmetric ratchet teeth | rounded tooth contact nose':'Intentional rounded pawl nose contact.',
  'enclosed low voltage motor | motor output shaft':'Shaft enters supplied enclosed motor; motor internals are a declared module.'}
 unexpected={k:v for k,v in overlaps.items() if k not in intended}
 result={'creator_check':True,'low_tipping_rope_check':tip_check,'state_filter_errors':state_errors,'maximum_sampled_ratchet_vertex_penetration_m':ratchet_penetration,
         'named_intended_contacts':{k:intended[k] for k in overlaps if k in intended},'unexpected_moving_surface_intersections':unexpected,
         'targeted_checks_pass':not blocked and not unexpected and not state_errors and ratchet_penetration<.000002,'samples':args.samples,'actual_receiving_bore_checks_per_pose':len(model['bore_checks']),
         'blocked_bores':blocked,'maximum_rigid_scale_error':max_scale_error,'moving_surface_intersections':overlaps,
         'limits':'Surface triangle intersections omit containment and within-rigid-group pairs; no force or full swept-volume certificate.',
         'source_sha256':{f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in [HERE/(module.__name__+'.py'),HERE/'scene_parts.py',HERE/'construction.py',Path(__file__)]}}
 out=HERE.parents[2]/'runs'/'builder-study'/f'{family}-pilot';out.mkdir(parents=True,exist_ok=True)
 (out/'mesh-check.json').write_text(json.dumps(result,indent=2)+'\n')
 print(family,'blocked',len(blocked),'intersections',list(overlaps))
