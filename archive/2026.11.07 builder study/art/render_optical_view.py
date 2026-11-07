"""Still eye view through the actual mirror triangle, using path-traced reflections."""
import argparse,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy
import scene_parts as S
import optical_toys as O
p=argparse.ArgumentParser();p.add_argument('--output',required=True);p.add_argument('--resolution',type=int,default=1000);p.add_argument('--samples',type=int,default=96)
a=p.parse_args(sys.argv[sys.argv.index('--')+1:])
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=S.configure_render(a.resolution);scene.cycles.samples=a.samples;scene.view_settings.exposure=-.1;scene.render.threads_mode='FIXED';scene.render.threads=2
scene.cycles.max_bounces=48;scene.cycles.glossy_bounces=40;scene.cycles.transmission_bounces=12
m=O.build_kaleidoscope()
# The eye is just inside the eyecap; object geometry and chip positions are unchanged.
data=bpy.data.cameras.new('eye at eyepiece');data.type='PERSP';data.lens=28;data.sensor_width=32;data.clip_start=.0005
cam=bpy.data.objects.new('eye at eyepiece',data);bpy.context.collection.objects.link(cam);cam.location=(0,.094,0);S.look_at(cam,(0,-.12,0));scene.camera=cam
for obj in list(bpy.data.objects):
 if obj.type=='LIGHT':bpy.data.objects.remove(obj,do_unlink=True)
data=bpy.data.lights.new('broad lantern face','AREA');data.energy=10;data.shape='DISK';data.size=.12
lamp=bpy.data.objects.new('broad lantern face',data);bpy.context.collection.objects.link(lamp);lamp.location=(0,-.18,0);S.look_at(lamp,(0,0,0))
scene.render.film_transparent=False;scene.world.color=(.03,.03,.03)
scene.render.filepath=a.output;bpy.ops.render.render(write_still=True)
