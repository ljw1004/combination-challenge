"""Creator checks for the repaired pawl, motor fasteners and guide closure.

Run in Blender. Evaluates actual meshes and state resets; optional selected still
renders go to ignored scratch. This is not an independent or force validation.
"""
import argparse, hashlib, json, math, sys
from pathlib import Path

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import cam_dragon as D
import lifting_crane as C
import wave_machine as W
import scene_parts as S

p=argparse.ArgumentParser()
p.add_argument('--output',type=Path,default=HERE.parents[2]/'runs/builder-study/new-mechanism-proof')
p.add_argument('--render',action='store_true')
args=p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
args.output.mkdir(parents=True,exist_ok=True)
result={'creator_check':True,'source_sha256':{f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in [HERE/(m.__name__+'.py') for m in [C,W,D]]+[HERE/'scene_parts.py',HERE/'construction.py',Path(__file__)]}}


def reset():
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)


def components(obj):
    graph={v.index:set() for v in obj.data.vertices}
    for e in obj.data.edges:
        a,b=e.vertices;graph[a].add(b);graph[b].add(a)
    count=0;remaining=set(graph)
    while remaining:
        count+=1;todo=[remaining.pop()]
        while todo:
            for n in graph[todo.pop()]&remaining:remaining.remove(n);todo.append(n)
    return count


def tree(obj):
    deps=bpy.context.evaluated_depsgraph_get();ev=obj.evaluated_get(deps);mesh=ev.to_mesh()
    b=BVHTree.FromPolygons([ev.matrix_world@v.co for v in mesh.vertices],[list(f.vertices) for f in mesh.polygons])
    ev.to_mesh_clear();return b


def inside_depth(obj,world):
    p=obj.matrix_world.inverted()@world
    hit,q,n,index=obj.closest_point_on_mesh(p)
    return max(0,-(p-q).dot(n)) if hit else 0


def samples(obj):
    # A Boolean n-gon's averaged vertex centre can lie in its receiving hole.
    # Tessellated triangle centroids are actual material surface samples.
    obj.data.calc_loop_triangles()
    return [obj.matrix_world@v.co for v in obj.data.vertices]+[
        obj.matrix_world@(sum((obj.data.vertices[i].co for i in f.vertices),Vector())/3)
        for f in obj.data.loop_triangles]


def penetration(a,b):
    return max([inside_depth(b,q) for q in samples(a)]+[inside_depth(a,q) for q in samples(b)]+[0])


def fingerprint(model):
    bpy.context.view_layer.update();rows=[]
    for part,objects in sorted(model['parts'].items()):
        for obj in objects:
            row=[obj.name,obj.hide_render,[round(v,8) for r in obj.matrix_world for v in r]]
            if obj.type=='CURVE':row.append([[round(v,8) for v in q.co] for spline in obj.data.splines for q in spline.points])
            rows.append(row)
    return hashlib.sha256(json.dumps(rows,sort_keys=True).encode()).hexdigest()


def order_check(module,model,states):
    expected={}
    for state in states:module.set_state(model,state);expected[state]=fingerprint(model)
    errors=[]
    for state in list(reversed(states))+states[::2]+states[1::2]:
        module.set_state(model,state)
        if fingerprint(model)!=expected[state]:errors.append(state)
    return errors,expected


def render(name,view):
    if not args.render:return
    scene=S.configure_render(760);scene.cycles.samples=20
    scene.render.threads_mode='FIXED';scene.render.threads=4
    scene.camera=S.camera(name,**view)
    scene.render.filepath=str(args.output/(name+'.png'));bpy.ops.render.render(write_still=True)
    # configure_render adds lights; remove them before the next selected view.
    for obj in list(bpy.data.objects):
        if obj.type in {'LIGHT','CAMERA'}:bpy.data.objects.remove(obj,do_unlink=True)


reset();m=C.build_model();C.set_state(m,'lifting-crane');bpy.context.view_layer.update()
pawl=next(o for o in m['parts']['lc-pawl'] if o.name=='rigid pawl and release lever')
result['crane']={'pawl_connected_components':components(pawl),'state_reset_errors':order_check(C,m,list(dict.fromkeys(list(C.STATES)+list(m['parts']))))[0]}
C.set_state(m,'lifting-crane')
render('crane-pawl',{'location':(.10,-.50,.26),'target':(.018,-.054,.190),'scale':.105})
render('crane-complete',C.VIEW)
C.set_state(m,'lift-supported-module')
result['crane']['sling_state_visible_parts']=[k for k,v in m['parts'].items() if any(not o.hide_render for o in v)]
render('crane-empty-sling',C.VIEW)

reset();m=W.build_model();W.set_state(m,'wm-motor-frame');bpy.context.view_layer.update()
cradle=next(o for o in m['parts']['wm-mounted-motor'] if o.name=='motor cradle')
seat=next(o for o in m['parts']['wm-mounted-motor'] if o.name=='concave motor saddle')
heads=[o for o in m['parts']['wm-mounted-motor'] if o.name.startswith('motor captive mounting screw retained head')]
rows=[]
for head in heads:
    center=head.matrix_world.translation
    rows.append({'head':head.name,'head_to_cradle_penetration_m':penetration(head,cradle),'head_to_saddle_penetration_m':penetration(head,seat),
                 'bottom_z_m':min(q.z for q in samples(head)),'counterbore_radial_clearance_m':.0033-.003,
                 'cradle_land_thickness_m':.001,'underside_nut_z_span_m':[.003,.006]})
result['wave']={'motor_heads':rows,'state_reset_errors':order_check(W,m,list(dict.fromkeys(list(W.STATES)+list(m['parts']))))[0]}
W.set_state(m,'wm-motor-frame')
render('wave-motor-counterbores',{'location':(-.42,-.24,.31),'target':(-.295,-.030,.030),'scale':.105})
render('wave-motor-underside',{'location':(-.40,-.22,-.22),'target':(-.295,-.030,.020),'scale':.105})
W.set_state(m,'wave-machine');render('wave-complete',W.VIEW)

result['dragon']={}
for variant in D.VARIANTS:
    reset();m=D.build_model(variant)
    states=list(m['parts'])+[k for k in D.STATES if (k in {'cd-double-wave','crank-dragon'})==(variant=='two_lobe')]
    states=list(dict.fromkeys(states));errors,expected=order_check(D,m,states)
    service_errors=[]
    if variant=='two_lobe':
        for step in D.SERVICE_STEPS:
            D.set_service_state(m,step)
            for state in states:
                D.set_state(m,state)
                if fingerprint(m)!=expected[state]:service_errors.append([step,state])
                D.set_service_state(m,step)
    D.apply_pose(m,.6);bpy.context.view_layer.update()
    cover=next(o for o in m['parts']['cd-guide'] if o.name=='guide removable front cover')
    closed_pen=max(penetration(cover,wall) for wall in m['guide_walls'])
    follower=[o for o in m['parts']['cd-follower'] if o.type=='MESH']
    guide=[o for o in m['parts']['cd-guide'] if o.type=='MESH']
    operating=[]
    for i in range(73):
        D.apply_pose(m,2*math.pi*i/72);bpy.context.view_layer.update()
        ct=tree(cover)
        for ob in follower:
            if ct.overlap(tree(ob)):operating.append([i,ob.name])
    D.apply_pose(m,.6);D.set_guide_cover(m,True);insertion=[]
    # Maker holds the rod in the 10 mm space in front of the open guide. Foot
    # and collar straddle it vertically, then the stem slides laterally in.
    for i in range(41):
        m['follower'].location.y=-.010*(1-i/40);bpy.context.view_layer.update()
        for ob in follower:
            ot=tree(ob)
            for fixed in guide:
                if ot.overlap(tree(fixed)):insertion.append([i,ob.name,fixed.name])
    result['dragon'][variant]={'cover_connected_components':components(cover),'closed_cover_maximum_sampled_wall_penetration_m':closed_pen,
        'guide_side_clearance_m':(D.DIMS.guide_bore-D.DIMS.stem_width)/2,'snap_hook_retention_depth_m':.0008,
        'snap_arm_to_outer_wall_clearance_m':.0002,'snap_hook_to_pocket_edge_clearance_m':.0004,
        'operating_cover_intersections':operating,'lateral_follower_insertion_intersections':insertion,
        'state_reset_errors':errors,'service_to_state_reset_errors':service_errors,
        'insertion_samples':41,'operating_samples':73}
    if variant=='eccentric':
        D.set_state(m,'cd-guided-follower');render('dragon-guide-closed',{'location':(.10,-.22,.19),'target':(0,0,.134),'scale':.075})
        D.set_state(m,'cd-guide');render('dragon-guide-open',{'location':(.10,-.22,.19),'target':(0,-.004,.134),'scale':.075})
        D.set_state(m,'cd-guided-follower');D.set_guide_cover(m,True);m['follower'].location.y=-.010
        render('dragon-guide-insertion',{'location':(.10,-.22,.19),'target':(0,-.004,.134),'scale':.075})
    else:
        D.set_state(m,'crank-dragon');render('dragon-complete',D.VIEW)

result['pass']=(result['crane']['pawl_connected_components']==1 and not result['crane']['state_reset_errors'] and not result['wave']['state_reset_errors']
    and all(max(r['head_to_cradle_penetration_m'],r['head_to_saddle_penetration_m'])<1e-7 for r in result['wave']['motor_heads'])
    and all(r['cover_connected_components']==1 and r['closed_cover_maximum_sampled_wall_penetration_m']<1e-7
        and not any(r[k] for k in ['operating_cover_intersections','lateral_follower_insertion_intersections','state_reset_errors','service_to_state_reset_errors']) for r in result['dragon'].values()))
result['limits']='Creator checks of sampled geometry and reset signatures. Snap elastic deflection, fastener preload, threads, strength and manufactured tolerances are not simulated. Cover detachment requires manually flexing the exposed arms; separated poses are stills, not animation.'
(args.output/'interface-check.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
if not result['pass']:raise RuntimeError('Mechanism interface creator check failed')
