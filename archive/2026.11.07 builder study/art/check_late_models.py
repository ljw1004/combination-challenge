"""Author checks for canonical still whale, theatre and transported lift.

Blender --background --factory-startup --threads 4 --python this_file -- --output runs/...
Reports are disposable scratch. This does not replace fresh independent review.
"""
import argparse,hashlib,json,math,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import flying_whale as W
import shadow_theatre as T
import lift_module as L
import loose_props as P
import scene_parts as S
p=argparse.ArgumentParser();p.add_argument('--output',type=Path,required=True);p.add_argument('--render',action='store_true');p.add_argument('--samples',type=int,default=72)
a=p.parse_args(sys.argv[sys.argv.index('--')+1:]);a.output.mkdir(parents=True,exist_ok=True)
NAMES=['flying_whale.py','shadow_theatre.py','lift_module.py','cam_dragon.py','scene_parts.py','loose_props.py','check_late_models.py']
def hashes():return {n:hashlib.sha256((HERE/n).read_bytes()).hexdigest() for n in NAMES}
frozen=hashes()
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=S.configure_render(700);scene.cycles.samples=16;scene.render.threads_mode='FIXED';scene.render.threads=4
for light in [o for o in bpy.data.objects if o.type=='LIGHT']:
    light.location*=3;light.data.energy*=5;light.data.size*=3;S.look_at(light,(0,0,.34))
m=W.build_model()
for part,placement in m['external_placements'].items():
    prop=P.build_model(part);prop['root'].parent=placement['parent'];prop['root'].location=placement['location']
    W.register_parts(m,{part:[prop['root']]+list(prop['root'].children_recursive)})
def data(obj):
    e=obj.evaluated_get(bpy.context.evaluated_depsgraph_get());mesh=e.to_mesh()
    vs=[e.matrix_world@v.co for v in mesh.vertices];fs=[tuple(p.vertices) for p in mesh.polygons];e.to_mesh_clear()
    bounds=tuple(tuple(fn(v[i] for v in vs) for i in range(3)) for fn in (min,max))
    return bounds,BVHTree.FromPolygons(vs,fs,all_triangles=False)
mesh_cache={}
def cached_data(obj):
    if obj.name not in mesh_cache:mesh_cache[obj.name]=data(obj)
    return mesh_cache[obj.name]
def intersection(x,y):
    (a,b),bt=cached_data(x);(c,d),ct=cached_data(y)
    if not all(a[i]<d[i]-1e-7 and b[i]>c[i]+1e-7 for i in range(3)):return False
    return bool(bt.overlap(ct))
def signature():
    bpy.context.view_layer.update()
    return [(o.name,o.hide_render,o.parent.name if o.parent else None,tuple(round(v,7) for row in o.matrix_basis for v in row),
             tuple(tuple(round(v,7) for v in p.co) for sp in o.data.splines for p in sp.points) if o.type=='CURVE' else ())
            for o in bpy.data.objects if o.type in {'MESH','CURVE'}]
report={'author_check':True,'source_sha256':frozen,'limits':['Nominal mesh and pose checks; no physical manufacturing certification.','No animation deliverables; repeated poses are static verification samples.']}
# Every exact identity has visible geometry and repeatable arbitrary-order state.
first={};counts={}
for state in W.STATES:
    W.set_state(m,state);first[state]=signature();counts[state]=sum(not o.hide_render for o in bpy.data.objects if o.type in {'MESH','CURVE'})
fail=[]
for state in reversed(W.STATES):
    W.set_state(m,state)
    now=signature()
    if first[state]!=now:
        fail.append(state)
        if len(fail)==1:print("FIRST STATE DIFFERENCE",state,[(before,after) for before,after in zip(first[state],now) if before!=after][:2],flush=True)
report['whale_states']={'count':len(first),'empty':[k for k,v in counts.items() if not v],'order_dependent':fail}
print('Checked all exact whale states',report['whale_states'],flush=True)
W.set_state(m,'fair-in-the-air');W.apply_pose(m,0,height=0,hatch_degrees=95)
# Full front/rear-slot travel with the removable handle actually inserted.
lift=m['lift'];moving=[o for o in lift['geometry'] if o.get('mechanical_role','').startswith('moving-') and o.get('mechanical_role')!='moving-handle']
fixed=[o for o in lift['geometry'] if not o.hide_render and o not in moving and o.get('mechanical_role')!='moving-handle']
fixed += [o for part in ['fair-power-divider','whale-hatch','whale-ribs','whale-deck'] for o in m['parts'][part] if o.type in {'MESH','CURVE'} and not o.hide_render]
trim_hits=set()
for ob in moving+fixed:ob.hide_viewport=False
bpy.context.view_layer.update()
for i in range(32):
    x=L.TRIM_RANGE[0]+(L.TRIM_RANGE[1]-L.TRIM_RANGE[0])*i/31
    L.apply_pose(lift,counterweight_x=x,show_handle=True)
    bpy.context.view_layer.update()
    for ob in moving:mesh_cache.pop(ob.name,None)
    for ob in moving:
        for other in fixed:
            if intersection(ob,other):trim_hits.add((ob.name,other.name))
report['counterweight_32_pose_intersections']=sorted(trim_hits)
# Only the required loaded adjustment is made through the hatch. The tool is
# withdrawn for full-track cold reconfiguration while the module is outside.
handle_hits=set();handle=lift['trim_handle']
for i in range(25):
    x=W.mass_balance()['slider_x_m']*i/24
    L.apply_pose(lift,counterweight_x=x,show_handle=True);bpy.context.view_layer.update();mesh_cache.pop(handle.name,None)
    for other in fixed:
        if other==handle:continue
        if intersection(handle,other):handle_hits.add((handle.name,other.name))
report['required_trim_handle_intersections']=sorted(handle_hits)
report['required_trim_handle_x_range_m']=[0,W.mass_balance()['slider_x_m']]
print('Checked trim',trim_hits,handle_hits,flush=True)
L.apply_pose(lift,counterweight_x=W.mass_balance()['slider_x_m'])
attachment_distances=[]
for entry in m['attachment_checks']:
    _,tree=data(entry['target']);nearest=tree.find_nearest(Vector(entry['point']))
    attachment_distances.append({'name':entry['name'],'distance_m':nearest[3]})
report['attachment_checks']={'count':len(attachment_distances),'max_surface_gap_m':max(x['distance_m'] for x in attachment_distances)}
# Focus cheeks move through real wall openings and have grooved guide clearance.
t=m['theatre'];T.set_state(t,'shadow-theatre')
focus_meshes=[o for o in t['focus'].children_recursive if o.type in {'MESH','CURVE'}]
fixed_theatre=[o for o in t['geometry'] if o not in focus_meshes and o.type in {'MESH','CURVE'} and not o.hide_render and o['part_id'] in {'theatre-box','theatre-slider'}]
focus_hits=set();mesh_cache.clear()
for ob in focus_meshes+fixed_theatre:ob.hide_viewport=False
bpy.context.view_layer.update()
for offset in [-.006,0,.006]:
    T.apply_pose(t,0,offset);bpy.context.view_layer.update()
    for ob in focus_meshes:mesh_cache.pop(ob.name,None)
    for ob in focus_meshes:
        for other in fixed_theatre:
            if intersection(ob,other):focus_hits.add((ob.name,other.name,offset))
report['focus_travel_intersections']=sorted(focus_hits)
print('Checked focus',focus_hits,flush=True)
T.apply_pose(t,0);bpy.context.view_layer.update()
# Rays along actual mount pin axes must pass through real receiver openings.
mount=[]
floor=next(o for o in t['parts']['theatre-box'] if o.name.startswith('box floor'))
_,tree=data(floor)
for pin in m['theatre_pins']:
    point=pin.matrix_world.translation
    mount.append(tree.ray_cast(Vector((point.x,point.y,.250)),Vector((0,0,1)),.020)[0] is None)
report['four_theatre_pin_axes_open']=mount
report['whale_mesh']=W.verify_blender_model(m,a.samples)
W.set_state(m,'fair-in-the-air')
if a.render:
    for label,state,loc,target,scale,hatch in [
        ('whale-front','whale-running-fair',(0,-2,.34),(0,0,.34),1.17,0),
        ('whale-three-quarter','whale-running-fair',(1.2,-2.1,1.10),(0,0,.31),1.25,0),
        ('whale-service','whale-trimmed',(.8,1.8,.80),(0,0,.31),1.21,95),
        ('whale-complete-flight','fair-in-the-air',(2.5,-4,2.5),(.1,-.4,.9),3.1,0),
    ]:
        W.set_state(m,state)
        W.apply_pose(m,.6,1 if state=='fair-in-the-air' else 0,hatch)
        scene.camera=S.camera(label,loc,target,scale);scene.render.filepath=str(a.output/(label+'.png'));bpy.ops.render.render(write_still=True)
    W.set_state(m,'whale-loaded')
    for ob in m['skin']+m['parts']['whale-hatch']:ob.hide_render=True
    scene.camera=S.camera('cutaway',(.85,1.5,.6),(0,0,.35),1.10)
    scene.render.filepath=str(a.output/'whale-cutaway.png');bpy.ops.render.render(write_still=True)
W.set_state(m,'fair-in-the-air');bpy.ops.wm.save_as_mainfile(filepath=str(a.output/'final-whale.blend'))
# Standalone compact lift has all stand geometry under its returned root.
for o in list(bpy.data.objects):bpy.data.objects.remove(o,do_unlink=True)
compact=L.build_model();states={}
for state in L.STATES:
    L.set_state(compact,state);states[state]=[o.name for o in compact['geometry'] if not o.hide_render]
report['lift_empty_states']=[k for k,v in states.items() if not v and k!='whale-module-mount']
L.set_state(compact,'balanced-lift');bpy.context.view_layer.update()
vs=[o.matrix_world@Vector(v) for o in compact['geometry'] if not o.hide_render for v in o.bound_box]
report['compact_visible_bounds_m']=[[min(v[i] for v in vs) for i in range(3)],[max(v[i] for v in vs) for i in range(3)]]
report['compact_mass']=L.compact_mass_proof()
report['all_lift_geometry_under_root']=all(o in compact['root'].children_recursive for o in compact['geometry'])
if a.render:
    scene=S.configure_render(700);scene.cycles.samples=16
    for state in ['balanced-lift','lift-stop-test']:
        L.set_state(compact,state);scene.camera=S.camera(state,(.7,-1,.55),(0,0,.15),.62)
        scene.render.filepath=str(a.output/(state+'.png'));bpy.ops.render.render(write_still=True)
L.set_state(compact,'balanced-lift');bpy.ops.wm.save_as_mainfile(filepath=str(a.output/'final-compact-lift.blend'))
report['sources_unchanged']=frozen==hashes()
report['passed']=all([not fail,all(counts.values()),not trim_hits,not handle_hits,not focus_hits,all(mount),report['whale_mesh']['passed'],report['attachment_checks']['max_surface_gap_m']<.003,not report['lift_empty_states'],report['all_lift_geometry_under_root'],report['sources_unchanged']])
(a.output/'author-check.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in {'whale_mesh','source_sha256'}},indent=2),flush=True)
if not report['passed']:raise RuntimeError('Author geometry checks have unresolved failures')
