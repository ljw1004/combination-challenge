"""Creator audit: exact state coverage, nonempty art and camera containment.

Checks presentation only; independent geometry and visual reviews are separate.
"""
import argparse,json,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
import scene_parts as S
import presentation as P
p=argparse.ArgumentParser();p.add_argument('--catalogue',required=True);p.add_argument('--output',required=True);p.add_argument('--families',default='')
a=p.parse_args(sys.argv[sys.argv.index('--')+1:]);c=json.loads(Path(a.catalogue).read_text());groups={};families=set(a.families.split(',')) if a.families else None
for item in c['items']:
 if families and item['family'] not in families:continue
 groups.setdefault(P.factory_key(item),[]).append(item)
rows=[];failures=[]
for key,items in groups.items():
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False);scene=S.configure_render(960)
 try:m=P.build(key)
 except Exception as e:
  failures.append({'key':key,'stage':'build','error':str(e)});continue
 for item in items:
  try:
   v=P.stage(m,item,key);cam=S.camera('audit camera',v['location'],v['target'],v['scale']);scene.camera=cam;bpy.context.view_layer.update()
   objects=list(dict.fromkeys(o for group in m['parts'].values() for o in group if not o.hide_render and o.type in {'MESH','CURVE','FONT'}))
   if not objects:raise ValueError('No visible physical objects')
   coords=[world_to_camera_view(scene,cam,o.matrix_world@Vector(corner)) for o in objects for corner in o.bound_box]
   b=[min(q.x for q in coords),min(q.y for q in coords),max(q.x for q in coords),max(q.y for q in coords)]
   row={'id':item['id'],'key':key,'objects':len(objects),'projectedBounds':b,'view':v};rows.append(row)
   if min(b[0],b[1],1-b[2],1-b[3])<.002:failures.append({'id':item['id'],'stage':'framing','bounds':b})
   bpy.data.objects.remove(cam,do_unlink=True)
  except Exception as e:failures.append({'id':item['id'],'stage':'select','error':str(e)})
Path(a.output).write_text(json.dumps({'storyHash':c['storyHash'],'checked':len(rows),'failures':failures,'states':rows},indent=2)+'\n')
print(json.dumps({'checked':len(rows),'failures':failures}),flush=True)
