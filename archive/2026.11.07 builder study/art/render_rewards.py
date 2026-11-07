"""Finished inventions in one garden, using their unscaled canonical models.

Blender ... --python render_rewards.py -- --catalogue FILE --output DIR --ids a,b
The story uses these stills in completion readings, not as interactive scenery.
"""
import argparse,json,math,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy
import scene_parts as S
import presentation as P
import garden as G
import hand_tools as T
import loose_props as L
p=argparse.ArgumentParser();p.add_argument('--catalogue',required=True);p.add_argument('--output',required=True);p.add_argument('--ids',required=True);p.add_argument('--resolution',type=int,default=1280);p.add_argument('--samples',type=int,default=48)
a=p.parse_args(sys.argv[sys.argv.index('--')+1:]);out=Path(a.output);out.mkdir(parents=True,exist_ok=True)
c={i['id']:i for i in json.loads(Path(a.catalogue).read_text())['items']}

def tool(ident,position,angle=0):
 m=T.build_model(ident);m['root'].location=position;m['root'].rotation_euler.z=angle;return m

def prop(ident,position,angle=0):
 m=L.build_model(ident);m['root'].location=position;m['root'].rotation_euler.z=angle;return m

def projected_light(theatre,cloth,theta):
 """Draw only chief-ray polygons on the receiving cloth, at true scale.

 This is a diagram of the ideal thin-lens image, not a photometric simulation.
 The source masks, angle, world transforms and finite screen determine it.
 """
 from mathutils import Vector
 import shadow_theatre as T
 from construction import special_material,surface
 bpy.context.view_layer.update()
 world=theatre['root'].matrix_world;inv=world.inverted()
 screen_y=(inv @ cloth.matrix_world.translation).y
 local_bounds=[cloth.matrix_world @ Vector(p) for p in cloth.bound_box]
 xmin,xmax=min(p.x for p in local_bounds),max(p.x for p in local_bounds)
 zmin,zmax=min(p.z for p in local_bounds),max(p.z for p in local_bounds)
 mat=special_material('ideal projected warm light',(1.,.81,.33),roughness=1.)
 shader=mat.node_tree.nodes.get('Principled BSDF');shader.inputs['Emission Color'].default_value=(1.,.74,.25,1);shader.inputs['Emission Strength'].default_value=1.8
 points=[]
 for star in T.projected_stars(theta,screen_y=screen_y):
  poly=[world @ Vector(p) for p in star['polygon_m']]
  if not all(xmin<=p.x<=xmax and zmin<=p.z<=zmax for p in poly):continue
  # Light lies just on the projector-facing surface of the real cloth.
  for p in poly:p.y+=.0010
  mesh=bpy.data.meshes.new('projected punched star');mesh.from_pydata(poly,[],[tuple(range(len(poly)))]);mesh.update()
  obj=bpy.data.objects.new('actual projected star '+str(star['hole_index']),mesh);bpy.context.collection.objects.link(obj);surface(obj,mat);points.extend(poly)
 if not points:raise RuntimeError('The chosen phase projects no stars on the real cloth')
 return (min(p.x for p in points)+max(p.x for p in points))/2,cloth.matrix_world.translation.y,(min(p.z for p in points)+max(p.z for p in points))/2

for ident in a.ids.split(','):
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 scene=S.configure_render(a.resolution);scene.render.resolution_y=round(a.resolution*900/1280);scene.cycles.samples=a.samples;scene.render.threads_mode='FIXED';scene.render.threads=2
 garden_floor=ident in {'wind-racer','drawing-rover','fair-in-the-air'}
 G.build(bench=not garden_floor,evening=ident in {'shadow-theatre','fair-in-the-air'},extent=8 if ident in {'shadow-theatre','fair-in-the-air'} else 4)
 if ident=='balanced-lift':
  import lifting_crane as C
  m=C.build_model();C.set_state(m,'lift-supported-module');C.attach_module(m)
 else:
  key=P.factory_key(c[ident]);m=P.build(key);P.stage(m,c[ident],key)
 m.get('presentation_root',m['root']).location=(0,0,.630 if not garden_floor else .008)
 camera=(.85,-1.3,1.17);target=(0,0,.76);scale=.90
 if ident=='pinwheel':
  m['root'].location=(.07,-.10,.690);G.plant(.07,-.077,.630,foliage=False);G.plant(-.24,.18,.630,height=.26,seed=31)
  camera=(.70,-1.3,1.13);target=(.03,-.02,.83);scale=.78
 elif ident=='wind-racer':
  G.chalk_lane();G.watering_can(.60,-.31);m['root'].location=(-.14,-.35,.008)
  gate=prop('wr-starting-gate',(-.65,-.35,.008));gate['bar'].location.z=.310
  camera=(.85,-1.5,.78);target=(.05,-.27,.17);scale=1.16
 elif ident=='pinball-table':
  camera=(.95,-1.35,1.55);target=(0,0,.73);scale=.96
 elif ident=='crank-dragon':
  import cam_dragon as D
  m['handle_state']='fitted';D.apply_pose(m,.55)
  for o in m['parts']['cd-crank-key']:o.hide_render=False
  camera=(.65,-1.10,1.08);target=(0,0,.79);scale=.65
 elif ident=='periscope':
  # A tabletop screen provides a visible line-of-sight obstruction.
  S.box('garden game screen',(0,.16,.73),(.47,.012,.20),'teal')
  for x in (-.20,.20):S.box('screen foot',(x,.16,.640),(.055,.10,.020),'birch')
  # The hat rests on the recurring fence picket, at the actual sight line.
  tool('pe-hat',(0,1.10,.894))
  camera=(.65,-1.4,1.55);target=(0,.42,.84);scale=1.4
 elif ident=='kaleidoscope':
  m['root'].location=(-.09,0,.665)
  tool('work-lantern',(-.09,-.22,.630),math.pi)
  # Two ordinary table rests keep the round tube from rolling away.
  for y in (-.065,.060):
   S.box('small tube rest',(-.09,y,.640),(.085,.025,.020),'birch')
  camera=(.55,-.80,1.04);target=(-.05,-.06,.69);scale=.60
 elif ident=='lifting-crane':
  camera=(1.3,-1.7,1.65);target=(.12,0,.96);scale=1.18
 elif ident=='wave-machine':
  camera=(-.12,.75,.90);target=(0,0,.75);scale=.72
 elif ident=='pneumatic-grabber':
  import pneumatic_grabber as A
  A.apply_pose(m,.01115898)
  m['root'].location=(.14,-.05,.630)
  fruit=prop('air-fruit-game',(.23,.13,.630))
  # Use the reviewed orange contact centre, translated with the canonical beam.
  for obj in fruit['parts']['air-fruit-game']:
   if obj.name.startswith('sponge orange'):obj.location=(-.010,-.180,.027)
  # The orange now occupies the independently reviewed two-pad contact centre.
  camera=(.42,-.85,1.13);target=(-.02,.02,.69);scale=.67
 elif ident=='animation-drum':
  tool('work-lantern',(.22,.08,.630),-.35)
  camera=(.40,-.70,1.11);target=(.03,0,.705);scale=.50
 elif ident=='drawing-rover':
  # The supplied paper and true pen path are model-owned and selected by set_state.
  from rover_presentation import REWARD_VIEW
  camera=REWARD_VIEW['location'];target=REWARD_VIEW['target'];scale=REWARD_VIEW['scale']
 elif ident=='shadow-theatre':
  # This is the same supplied cloth, now actually tied between the apple trees.
  cloth=m['parts']['theatre-cloth'][0];cloth.hide_render=False;cloth.hide_viewport=False
  for x in (-.80,.80):G.apple_tree(x,-1.45,12 if x<0 else 23)
  bpy.context.view_layer.update()
  from mathutils import Vector
  corners=[cloth.matrix_world @ Vector(v) for v in cloth.bound_box]
  top=max(v.z for v in corners)
  G.cloth_ties([(-.45,-1.4,top),(.45,-1.4,top)])
  light_target=projected_light(m,cloth,0)
  camera=(.55,-.90,1.05);target=(0,-.03,.73);scale=.52
 elif ident=='balanced-lift':
  m['root'].location=(-.33,0,.630)
  camera=(1.1,-1.8,1.65);target=(.05,0,.98);scale=1.45
 elif ident=='fair-in-the-air':
  for x in (-.80,.80):G.apple_tree(x,-1.45,12 if x<0 else 23)
  light_target=projected_light(m['theatre'],m['parts']['theatre-cloth'][0],-m['theatre_spindle'].rotation_euler.y)
  camera=(-1.1,3.4,4.1);target=(.10,-.45,1.05);scale=3.7
 else:raise ValueError('No authored reward composition for '+ident)
 scene.camera=S.camera(ident+' garden view',camera,target,scale)
 scene.render.filepath=str(out/(ident+'.png'));bpy.ops.render.render(write_still=True)
 if ident in {'shadow-theatre','fair-in-the-air'}:
  scene.camera=S.camera('real screen detail',(light_target[0],light_target[1]+.50,light_target[2]),light_target,.18)
  scene.render.resolution_x=scene.render.resolution_y=min(600,a.resolution)
  scene.render.filepath=str(out/(ident+'-screen.png'));bpy.ops.render.render(write_still=True)
 if ident=='periscope':
  data=bpy.data.cameras.new('eye at lower window');data.type='PERSP';data.lens=65;data.sensor_width=36;data.clip_start=.001
  eye=bpy.data.objects.new('eye at lower window',data);bpy.context.collection.objects.link(eye);eye.location=(0,-.12,.660);S.look_at(eye,(0,0,.660));scene.camera=eye
  scene.render.resolution_x=scene.render.resolution_y=600;scene.cycles.samples=48;scene.cycles.glossy_bounces=8;scene.cycles.max_bounces=12
  scene.render.filepath=str(out/'periscope-eye.png');bpy.ops.render.render(write_still=True)
 print('REWARD',ident,flush=True)
