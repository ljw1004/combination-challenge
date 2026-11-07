"""Creator mesh/contact check for the compact lift's selected test tilt.

Blender --background --factory-startup --python THIS_FILE -- --output SCRATCH
Finite geometry evidence only; independent review remains separate.
"""
import argparse,json,math,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import lift_module as L
import lift_presentation as V
import scene_parts as S
p=argparse.ArgumentParser();p.add_argument('--output',required=True)
a=p.parse_args(sys.argv[sys.argv.index('--')+1:]);out=Path(a.output);out.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
m=L.build_model();L.set_state(m,'lift-tilting-test');V.stage(m,'lift-tilting-test')
def under(obj,parent):
    while obj:
        if obj==parent:return True
        obj=obj.parent
    return False
def shape(obj):
    ev=obj.evaluated_get(bpy.context.evaluated_depsgraph_get());mesh=ev.to_mesh();mesh.calc_loop_triangles()
    verts=[ev.matrix_world@v.co for v in mesh.vertices];faces=[tuple(t.vertices) for t in mesh.loop_triangles]
    ev.to_mesh_clear()
    return (BVHTree.FromPolygons(verts,faces,all_triangles=True),[(min(v[k] for v in verts),max(v[k] for v in verts)) for k in range(3)])
def overlaps(a,b):return all(a[k][0]<b[k][1]-1e-9 and b[k][0]<a[k][1]-1e-9 for k in range(3))
fixed=[o for objects in m['parts'].values() for o in objects if o.type=='MESH' and not o.hide_render and under(o,m['stand_root'])]
moving=[o for objects in m['parts'].values() for o in objects if o.type=='MESH' and not o.hide_render and under(o,m['module_root'])]
fixed_shapes={o.name:shape(o) for o in fixed};hits=[]
for step in range(41):
    angle=V.TEST_TILT_DEGREES*step/40;m['module_root'].rotation_euler.y=math.radians(angle);bpy.context.view_layer.update()
    for obj in moving:
        tree,bounds=shape(obj)
        for name,(other,box) in fixed_shapes.items():
            if overlaps(bounds,box) and tree.overlap(other):hits.append({'angle':angle,'moving':obj.name,'fixed':name})
reset=[];lengths=[]
for identity in list(L.STATES)+list(reversed(L.STATES)):
    L.set_state(m,identity);V.stage(m,identity)
    expected=V.TEST_TILT_DEGREES if identity=='lift-tilting-test' else 0.
    if abs(m['presentation_pose']['tilt_degrees']-expected)>1e-5:reset.append(identity)
    lengths.append(m['presentation_pose']['tether_length_m'])
result={'sampled_tilts':41,'moving_meshes':len(moving),'stationary_meshes':len(fixed),'unintended_surface_intersections':hits,'state_reset_failures':reset,'tether_length_range_m':[min(lengths),max(lengths)],'limit':'Selected poses and mesh surfaces; no continuous proof, tolerances, forces or manufacture.'}
(out/'outcome.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result),flush=True)
if hits or reset:raise RuntimeError('Lift presentation contact/reset check failed')
