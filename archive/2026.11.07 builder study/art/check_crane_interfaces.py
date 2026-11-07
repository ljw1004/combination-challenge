"""Creator regression checks for the repaired crane joins and bearing supports.

Actual evaluated meshes; no other toy is built. Geometry/retention evidence does
not establish thread engagement, preload, material strength or a load rating.
"""
import argparse,hashlib,json,math,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy,bmesh
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import lifting_crane as C
import scene_parts as S

p=argparse.ArgumentParser();p.add_argument('--render',action='store_true');p.add_argument('--output',type=Path,default=HERE.parents[2]/'runs/builder-study/crane-interface-repair')
args=p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
args.output.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
m=C.build_model();C.apply_pose(m,0);bpy.context.view_layer.update()


def get(name):return bpy.data.objects[name]


def geometry(obj):
    ev=obj.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh()
    v=[ev.matrix_world@q.co for q in me.vertices];f=[tuple(q.vertices) for q in me.polygons]
    ev.to_mesh_clear();return v,f


def tree(obj):return BVHTree.FromPolygons(*geometry(obj))


def signed(obj,point):
    near,n,index,distance=tree(obj).find_nearest(Vector(point))
    return (Vector(point)-near).dot(n)


def overlap_volume(a,b):
    """Narrow-phase volume distinguishes actual intrusion from touching faces."""
    av,af=geometry(a);bv,bf=geometry(b)
    objects=[]
    for name,v,f in [('intersection A',av,af),('intersection B',bv,bf)]:
        me=bpy.data.meshes.new(name);me.from_pydata(v,[],f);me.update()
        ob=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(ob);objects.append(ob)
    aa,bb=objects;mod=aa.modifiers.new('actual overlap volume','BOOLEAN');mod.operation='INTERSECT';mod.object=bb
    bpy.context.view_layer.objects.active=aa;bpy.ops.object.modifier_apply(modifier=mod.name)
    bm=bmesh.new();bm.from_mesh(aa.data);volume=abs(bm.calc_volume());bm.free()
    for ob in objects:me=ob.data;bpy.data.objects.remove(ob,do_unlink=True);bpy.data.meshes.remove(me)
    return volume


def topology(obj):
    bm=bmesh.new();bm.from_mesh(obj.data);unseen=set(bm.verts);groups=0
    while unseen:
        groups+=1;todo=[unseen.pop()]
        while todo:
            v=todo.pop()
            for edge in v.link_edges:
                other=edge.other_vert(v)
                if other in unseen:unseen.remove(other);todo.append(other)
    r={'components':groups,'nonmanifold_edges':sum(not e.is_manifold for e in bm.edges)};bm.free();return r


def bounds(obj):
    v,_=geometry(obj);return [[min(q[i] for q in v),max(q[i] for q in v)] for i in range(3)]


def axis_ray(obj,origin,direction,length):
    hit=tree(obj).ray_cast(Vector(origin),Vector(direction),length)
    return list(hit[0]) if hit[0] is not None else None


def render(name,visible,location,target,scale):
    if not args.render:return
    for ob in bpy.context.scene.objects:
        if ob.type in {'MESH','CURVE'}:ob.hide_render=ob not in visible
    scene=S.configure_render(800);scene.cycles.samples=20;scene.render.threads_mode='FIXED';scene.render.threads=4
    scene.camera=S.camera(name,location,target,scale);scene.render.filepath=str(args.output/(name+'.png'));bpy.ops.render.render(write_still=True)
    for ob in list(bpy.data.objects):
        if ob.type in {'LIGHT','CAMERA'}:bpy.data.objects.remove(ob,do_unlink=True)


crank=get('long hand crank');shaft=get('square torque end');wheel=get('24 asymmetric ratchet teeth')
washer=get('crank shaft end retaining washer');spacer=get('square-bored crank to ratchet spacer')
head=get('captive shaft end screw head');shank=get('captive shaft end screw shank')
initial=crank.location.copy();pull=[]
for offset in [0,.0001,.0005,.001]:
    crank.location=initial+Vector((0,-offset,0));bpy.context.view_layer.update()
    pull.append({'forward_pull_m':offset,'washer_overlap_m3':overlap_volume(crank,washer)})
crank.location=initial;bpy.context.view_layer.update()
front_stop=overlap_volume(shaft,shank)
old=wheel.location.copy();wheel.location.y+=.0001;bpy.context.view_layer.update();rear_stop=overlap_volume(wheel,shaft);wheel.location=old;bpy.context.view_layer.update()
result={'creator_check':True,'source_sha256':{f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in [HERE/'lifting_crane.py',HERE/'scene_parts.py',HERE/'construction.py',Path(__file__)]},
 'crank':{'shaft_topology':topology(shaft),'forward_extraction_probe':pull,'wheel_0_1mm_rear_push_overlap_m3':rear_stop,
          'shaft_screw_overlap_volume_m3':front_stop,'washer_bounds_m':bounds(washer),'crank_bounds_m':bounds(crank),
          'spacer_bounds_m':bounds(spacer),'wheel_bounds_m':bounds(wheel),
          'head_washer_overlap_volume_m3':overlap_volume(head,washer),
          'blind_screw_bore_entry_ray':axis_ray(shaft,(-.025,-.090,.165),(0,1,0),.016),
          'blind_screw_bore_bottom_ray':axis_ray(shaft,(-.025,-.090,.165),(0,1,0),.025)}}
render('crank-retained-stack',[crank,shaft,wheel,washer,spacer,head,shank],(.105,-.32,.26),(-.025,-.067,.165),.115)

# The grip's bearing pin must actually cross the crank plate and be retained.
grip=get('free turning hand grip');grip_pin=get('free turning hand grip pin')
grip_heads=sorted([o for o in m['parts']['lc-crank-wheel'] if o.name.startswith('grip retaining head')],key=lambda o:o.location.y)
sleeves=sorted([o for o in m['parts']['lc-crank-wheel'] if o.name.startswith('hand grip axial spacing sleeve')],key=lambda o:bounds(o)[1][0])
grip_bounds=bounds(grip);sleeve_bounds=[bounds(o) for o in sleeves]
grip_stops=[];initial=grip.location.copy()
for direction,sleeve in [(-1,sleeves[0]),(1,sleeves[1])]:
    grip.location=initial+Vector((0,direction*.0003,0));bpy.context.view_layer.update()
    grip_stops.append(overlap_volume(grip,sleeve))
grip.location=initial;initial=grip_heads[-1].location.copy();grip_heads[-1].location.y-=.0001;bpy.context.view_layer.update()
rear_retention=overlap_volume(grip_heads[-1],crank);grip_heads[-1].location=initial;bpy.context.view_layer.update()
result['hand_grip']={'pin_to_crank_overlap_m3':overlap_volume(grip_pin,crank),'pin_to_grip_overlap_m3':overlap_volume(grip_pin,grip),
    'crank_pin_bore_axis_ray':axis_ray(crank,(.043,-.130,.165),(0,1,0),.080),
    'running_end_clearances_m':[grip_bounds[1][0]-sleeve_bounds[0][1][1],sleeve_bounds[1][1][0]-grip_bounds[1][1]],
    'grip_0_3mm_axial_stop_overlap_m3':grip_stops,'rear_head_0_1mm_forward_pull_overlap_m3':rear_retention,
    'seated_head_to_crank_overlap_m3':overlap_volume(grip_heads[-1],crank),
    'spacer_to_crank_overlap_m3':overlap_volume(sleeves[1],crank)}
render('crank-hand-grip-bearing',[crank,grip,grip_pin]+grip_heads+sleeves,(.14,-.25,.23),(.043,-.096,.165),.080)

stud=get('rope anchor stud');studhead=get('rope anchor stud retained head');tail=get('closed cord anchor loop and fixed tail');rope=get('single continuous lifting cord')
flanges=[o for o in m['parts']['lc-drum'] if o.name.startswith('drum retaining flange')]
anchor_rows=[]
for i in range(13):
    C.apply_pose(m,C.DIMS.maximum_lift*i/12);bpy.context.view_layer.update()
    row={'lift_m':C.DIMS.maximum_lift*i/12,'intersections':[]}
    for a in [tail,rope]:
        ta=tree(a)
        for b in [stud,studhead]+flanges:
            count=len(ta.overlap(tree(b)))
            if count:row['intersections'].append([a.name,b.name,count])
    # Actual curve vertices and segment midpoints, with the rope's tube radius.
    near=[];st=tree(stud)
    for a in [tail,rope]:
        points=[a.matrix_world@Vector(q.co[:3]) for q in a.data.splines[0].points]
        points += [(x+y)/2 for x,y in zip(points,points[1:])]
        near.extend(st.find_nearest(q)[3]-a.data.bevel_depth for q in points)
    row['minimum_sampled_wire_to_stud_surface_gap_m']=min(near);anchor_rows.append(row)
result['anchor']={'poses':anchor_rows,'minimum_sampled_wire_to_stud_surface_gap_m':min(r['minimum_sampled_wire_to_stud_surface_gap_m'] for r in anchor_rows)}
C.apply_pose(m,0);bpy.context.view_layer.update()
result['anchor']['barrel_stud_overlap_volume_m3']=overlap_volume(get('drum barrel'),stud)
render('anchor-routed-clear',[stud,studhead,tail,rope]+flanges,(-.12,-.12,.30),(-.043,-.016,.189),.036)
render('anchor-in-drum',[stud,studhead,tail,rope,get('drum barrel')]+flanges,(-.17,-.19,.32),(-.025,-.014,.18),.090)

mount=get('pawl mounting bracket');base=get('base board with receiving sockets')
pivots=[o for o in m['parts']['lc-pawl'] if o.name.startswith('pawl retained pivot')]
heads=[o for o in pivots if 'retained head' in o.name]
result['pawl_support']={'topology':topology(mount),'bounds_m':bounds(mount),'base_bounds_m':bounds(base),
 'mount_base_overlap_volume_m3':overlap_volume(mount,base),
 'pivot_head_mount_overlap_m3':[overlap_volume(o,mount) for o in heads],
 'pivot_head_y_bounds_m':[bounds(o)[1] for o in heads],
 'complete_pivot_bore_axis_ray':axis_ray(mount,(.022,-.070,.191),(0,1,0),.065),
 'foot_bottom_surface_ray':axis_ray(mount,(.026,-.022,.020),(0,0,1),.020),
 'seated_base_screws':[]}
baseheads=[o for o in m['parts']['lc-pawl'] if o.name.startswith('pawl bracket base screw captive head')]
basenuts=[o for o in m['parts']['lc-pawl'] if o.name.startswith('pawl bracket underside nut')]
for h,n in zip(baseheads,basenuts):
    x,y=h.matrix_world.translation[:2]
    result['pawl_support']['seated_base_screws'].append({'head_bottom_z_m':bounds(h)[2][0],
        'head_mount_overlap_volume_m3':overlap_volume(h,mount),'nut_top_z_m':bounds(n)[2][1],
        'nut_base_overlap_volume_m3':overlap_volume(n,base),
        'foot_top_seat_ray':axis_ray(mount,(x+.003,y,.055),(0,0,-1),.020),
        'foot_shank_bore_ray':axis_ray(mount,(x,y,.020),(0,0,1),.040),
        'base_shank_bore_ray':axis_ray(base,(x,y,0),(0,0,1),.050)})
support_objects=[o for o in m['parts']['lc-pawl'] if o.type in {'MESH','CURVE'}]
spring_peg=get('torsion spring fixed anchor peg');spring_head=get('torsion spring fixed anchor retained head')
spring_rows=[]
for i in range(13):
    C.apply_pose(m,C.DIMS.maximum_lift*i/12);bpy.context.view_layer.update()
    spring_tree=tree(m['pawl_spring'])
    spring_rows.append({'lift_m':C.DIMS.maximum_lift*i/12,'peg_surface_intersections':len(spring_tree.overlap(tree(spring_peg))),
        'head_surface_intersections':len(spring_tree.overlap(tree(spring_head)))})
result['pawl_support']['spring_eye_clearance_samples']=spring_rows
result['pawl_support']['spring_eye_radial_clearance_lower_bound_m']=.0012*math.cos(math.pi/32)-.0003-.0008
result['pawl_support']['spring_eye_to_retaining_head_gap_m']=.0002
C.apply_pose(m,0);bpy.context.view_layer.update()
render('pawl-pivot-reseated',support_objects,(.12,-.17,.24),(.022,-.036,.191),.062)
render('pawl-support-foot',support_objects+[base],(.13,-.16,.12),(.028,-.022,.045),.105)
render('pawl-support-path',support_objects+[base],(.15,-.24,.25),(.025,-.025,.122),.250)

# Trace both shaft bearings through a single connected upright/foot to the base.
bearings=[o for o in m['parts']['lc-drum'] if o.name.startswith('drum bearing bracket')]
winch_heads=[o for o in m['parts']['lc-drum'] if o.name.startswith('winch mounting screw captive head')]
winch_nuts=[o for o in m['parts']['lc-drum'] if o.name.startswith('winch mounting underside nut')]
result['winch_support']={'bearings':[],'screws':[],'support_pair_overlap_m3':[]}
for bearing in bearings:
    y=bearing.location.y
    result['winch_support']['bearings'].append({'name':bearing.name,'topology':topology(bearing),
        'base_overlap_volume_m3':overlap_volume(bearing,base),
        'foot_bottom_surface_ray':axis_ray(bearing,(C.DIMS.winch_x,y,.020),(0,0,1),.020),
        'bearing_axis_ray':axis_ray(bearing,(C.DIMS.winch_x,y-.020,C.DIMS.drum_z),(0,1,0),.040)})
for h,n in zip(winch_heads,winch_nuts):
    center=h.matrix_world.translation;x,y=center[:2];bearing=min(bearings,key=lambda ob:abs(ob.location.y-y))
    sign=1 if x>C.DIMS.winch_x else -1
    edge=center+Vector((-sign*.004,0,0));side=axis_ray(bearing,edge,(-sign,0,0),.010)
    result['winch_support']['screws'].append({'head_bottom_z_m':bounds(h)[2][0],
        'head_support_overlap_volume_m3':overlap_volume(h,bearing),'head_to_upright_side_gap_m':(Vector(side)-edge).length if side else None,
        'nut_top_z_m':bounds(n)[2][1],'nut_base_overlap_volume_m3':overlap_volume(n,base),
        'foot_top_seat_ray':axis_ray(bearing,(x+.003,y,.055),(0,0,-1),.020),
        'foot_shank_bore_ray':axis_ray(bearing,(x,y,.020),(0,0,1),.040),
        'base_shank_bore_ray':axis_ray(base,(x,y,0),(0,0,1),.050)})
supports=bearings+[mount]
for i,a in enumerate(supports):
    for b in supports[i+1:]:result['winch_support']['support_pair_overlap_m3'].append({'pair':[a.name,b.name],'volume_m3':overlap_volume(a,b)})
winch=[o for o in m['parts']['lc-drum'] if o.type in {'MESH','CURVE'}]+m['parts']['lc-crank-wheel']
render('winch-bearing-supports',winch+[base],(.13,-.24,.26),(-.025,-.004,.115),.255)
render('winch-foot-seats',bearings+winch_heads+winch_nuts+[base],(.11,-.19,.12),(-.025,0,.040),.155)
C.set_state(m,'lifting-crane');render('crane-complete',[o for v in m['parts'].values() for o in v if not o.hide_render],**{'location':C.VIEW['location'],'target':C.VIEW['target'],'scale':C.VIEW['scale']})

c=result['crank'];a=result['anchor'];s=result['pawl_support'];g=result['hand_grip']
result['pass']=(c['shaft_topology']=={'components':1,'nonmanifold_edges':0} and c['forward_extraction_probe'][0]['washer_overlap_m3']<1e-12
 and all(r['washer_overlap_m3']>1e-10 for r in c['forward_extraction_probe'][1:]) and c['wheel_0_1mm_rear_push_overlap_m3']>1e-10
 and c['shaft_screw_overlap_volume_m3']<1e-12 and c['blind_screw_bore_entry_ray'] is None and c['blind_screw_bore_bottom_ray'] is not None
 and not any(r['intersections'] for r in a['poses']) and a['minimum_sampled_wire_to_stud_surface_gap_m']>0 and a['barrel_stud_overlap_volume_m3']<1e-12
 and s['topology']=={'components':1,'nonmanifold_edges':0} and s['mount_base_overlap_volume_m3']<1e-12
 and max(s['pivot_head_mount_overlap_m3'])<1e-12 and s['complete_pivot_bore_axis_ray'] is None
 and not any(r['peg_surface_intersections'] or r['head_surface_intersections'] for r in s['spring_eye_clearance_samples'])
 and abs(s['foot_bottom_surface_ray'][2]-.030)<1e-7
 and all(r['head_mount_overlap_volume_m3']<1e-12 and r['nut_base_overlap_volume_m3']<1e-12
  and abs(r['head_bottom_z_m']-r['foot_top_seat_ray'][2])<1e-7 and abs(r['nut_top_z_m']-.010)<1e-7
  and r['foot_shank_bore_ray'] is None and r['base_shank_bore_ray'] is None for r in s['seated_base_screws'])
 and all(r['topology']=={'components':1,'nonmanifold_edges':0} and r['base_overlap_volume_m3']<1e-12
  and abs(r['foot_bottom_surface_ray'][2]-.030)<1e-7 and r['bearing_axis_ray'] is None for r in result['winch_support']['bearings'])
 and all(r['head_support_overlap_volume_m3']<1e-12 and r['head_to_upright_side_gap_m'] is not None and r['head_to_upright_side_gap_m']>.003-1e-7
  and abs(r['head_bottom_z_m']-r['foot_top_seat_ray'][2])<1e-7 and abs(r['nut_top_z_m']-.010)<1e-7
  and r['nut_base_overlap_volume_m3']<1e-12 and r['foot_shank_bore_ray'] is None and r['base_shank_bore_ray'] is None for r in result['winch_support']['screws'])
 and all(r['volume_m3']<1e-12 for r in result['winch_support']['support_pair_overlap_m3'])
 and g['pin_to_crank_overlap_m3']<1e-12 and g['pin_to_grip_overlap_m3']<1e-12 and g['crank_pin_bore_axis_ray'] is None
 and all(abs(gap-.0002)<1e-7 for gap in g['running_end_clearances_m']) and min(g['grip_0_3mm_axial_stop_overlap_m3'])>1e-10
 and g['rear_head_0_1mm_forward_pull_overlap_m3']>1e-10 and g['seated_head_to_crank_overlap_m3']<1e-12 and g['spacer_to_crank_overlap_m3']<1e-12)
result['limits']='Targeted creator geometry checks, not independent acceptance. Closed-loop/helix checks from the earlier candidate did not inspect the stud intrusion. No preload, thread engagement, spring force or strength validation.'
(args.output/'targeted-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
if not result['pass']:raise RuntimeError('Crane interface checks failed')
