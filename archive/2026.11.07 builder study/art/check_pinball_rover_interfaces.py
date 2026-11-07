"""Focused author checks for finite-marble drainage and five reviewed interfaces.

Run with Blender --background --python this_file -- --out SCRATCH_DIRECTORY.
No physical force, friction, tolerance or thread-manufacturing certification.
"""
import argparse, hashlib, heapq, json, math, sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
import bpy, bmesh
from mathutils import Matrix, Vector
from mathutils.bvhtree import BVHTree
import pinball_table as P
import drawing_rover as R
parser=argparse.ArgumentParser();parser.add_argument('--out',default='runs/builder-study/pinball-rover-repairs')
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
out=Path(args.out);out.mkdir(parents=True,exist_ok=True)


def geometry(ob,frame=None):
    ev=ob.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh()
    mat=ev.matrix_world if frame is None else frame@ev.matrix_world
    vs=[mat@v.co for v in me.vertices];fs=[tuple(f.vertices) for f in me.polygons]
    ev.to_mesh_clear();return vs,fs


def tree(objects,frame=None):
    vs=[];fs=[]
    for ob in objects:
        vv,ff=geometry(ob,frame);offset=len(vs);vs.extend(vv);fs.extend(tuple(offset+i for i in f) for f in ff)
    return BVHTree.FromPolygons(vs,fs)


def volume(a,b):
    temp=[]
    for original in (a,b):
        vs,fs=geometry(original);me=bpy.data.meshes.new('interface volume');me.from_pydata(vs,[],fs);me.update()
        ob=bpy.data.objects.new('interface volume',me);bpy.context.collection.objects.link(ob);temp.append(ob)
    a,b=temp;bpy.context.view_layer.objects.active=a
    mod=a.modifiers.new('interface overlap','BOOLEAN');mod.operation='INTERSECT';mod.solver='EXACT';mod.object=b
    bpy.ops.object.modifier_apply(modifier=mod.name);bm=bmesh.new();bm.from_mesh(a.data);result=abs(bm.calc_volume(signed=True));bm.free()
    for ob in temp:bpy.data.objects.remove(ob,do_unlink=True)
    return result


def inside(t,p):
    direction=Vector((.37,.53,.77)).normalized();count=0;origin=p.copy()
    for _ in range(64):
        hit=t.ray_cast(origin,direction,2)
        if hit[0] is None:return bool(count%2)
        count+=1;origin=hit[0]+direction*1e-7
    raise RuntimeError('Ray parity did not terminate')


def reset():
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)


reset();m=P.build_model();P.set_state(m,'pb-return-table');board=m['board'];frame=m['table'].matrix_world.inverted()
board_tree=tree([board],frame);rail_tree=tree([o for o in m['parts']['pb-rails'] if o.type=='MESH'],frame)
ux,uy=13/math.sqrt(185),-4/math.sqrt(185)
mesh=board.data;mesh.calc_loop_triangles();slopes=[]
for face in mesh.loop_triangles:
    a,b,c=[board.matrix_local@mesh.vertices[i].co for i in face.vertices];n=(b-a).cross(c-a)
    if n.z>1e-10:slopes.append(uy*math.sin(P.DIMS.slope)-(ux*n.x+uy*n.y)/n.z*math.cos(P.DIMS.slope))


def support(x,y):
    low=.006;high=.014
    for _ in range(23):
        middle=(low+high)/2
        if board_tree.find_nearest(Vector((x,y,middle)))[3]<P.DIMS.marble_radius:low=middle
        else:high=middle
    return high


step=.0002;xs=[-.165+i*step for i in range(326)];ys=[-.220+j*step for j in range(176)]
z=[[support(x,y) for y in ys] for x in xs]
free=[[rail_tree.find_nearest(Vector((x,y,z[i][j])))[3]>=P.DIMS.marble_radius-1e-7 for j,y in enumerate(ys)] for i,x in enumerate(xs)]
neighbors=[(-1,0),(1,0),(0,-1),(0,1),(-1,-1),(-1,1),(1,-1),(1,1)]
pocket={}
for cross,label in [(P.DIMS.crossfall,'before_shim'),(0,'after_shim')]:
    heights=[[(y*math.sin(P.DIMS.slope)+z[i][j]*math.cos(P.DIMS.slope))*math.cos(cross)-x*math.sin(cross) for j,y in enumerate(ys)] for i,x in enumerate(xs)]
    minima=[]
    for i in range(1,len(xs)-1):
        for j in range(1,len(ys)-1):
            ns=[heights[i+di][j+dj] for di,dj in neighbors if free[i+di][j+dj]]
            if free[i][j] and ns and heights[i][j]<min(ns)-2e-9:minima.append((i,j))
    entries=[]
    for start in minima:
        base=heights[start[0]][start[1]];best={start:base};queue=[(base,start)];barrier=None
        while queue:
            cost,(i,j)=heapq.heappop(queue)
            if cost!=best[(i,j)]:continue
            if i in (0,len(xs)-1) or j in (0,len(ys)-1):barrier=cost-base;break
            for di,dj in neighbors:
                ij=(i+di,j+dj)
                if not free[ij[0]][ij[1]]:continue
                value=max(cost,heights[ij[0]][ij[1]])
                if value<best.get(ij,math.inf):best[ij]=value;heapq.heappush(queue,(value,ij))
        entries.append({'center_local_m':[xs[start[0]],ys[start[1]],z[start[0]][start[1]]],'minimum_escape_rise_m':barrier})
    pocket[label]=entries
pocket.update(grid_step_m=step,grid_centres=len(xs)*len(ys),free_centres=sum(sum(row) for row in free),maximum_top_triangle_drain_slope=max(slopes))
print('Finite sphere pocket:',pocket,flush=True)

P.set_state(m,'pinball-table');clips=[]
for clip in m['wedge_clips']:
    resting=volume(clip,board);clip.location.z-=.001;bpy.context.view_layer.update();withdrawn=volume(clip,board)
    clip.location.z+=.001;bpy.context.view_layer.update();clips.append({'rest_volume_m3':resting,'withdrawal_1mm_blocked_volume_m3':withdrawn})
stop=[]
for long in (False,True):
    P.apply_pose(m,long=long);block,screw,head,nut,guide=m['stop_hardware']
    row={'long_setting':long,'shaft_block_volume_m3':volume(screw,block),'shaft_guide_volume_m3':volume(screw,guide),'shaft_head_join_volume_m3':volume(screw,head)}
    floor=next(o for o in m['parts']['pb-plunger-tube'] if o.name.startswith('stop nut captive channel floor'))
    walls=[o for o in m['parts']['pb-plunger-tube'] if o.name.startswith('stop nut captive channel side')]
    row['nut_rest_volume_m3']=sum(volume(nut,o) for o in [floor,*walls])
    nut.location.z-=.0003;bpy.context.view_layer.update();row['nut_drop_0_3mm_blocked_volume_m3']=volume(nut,floor);nut.location.z+=.0003
    nut.rotation_euler.z=.2;bpy.context.view_layer.update();row['nut_rotation_blocked_volume_m3']=sum(volume(nut,o) for o in walls);nut.rotation_euler.z=0;bpy.context.view_layer.update()
    tool=m['tool'];driver_tip=next(o for o in tool['parts']['work-screwdriver'] if o.name.startswith('flat screwdriver tip'))
    tool['root'].matrix_world=m['table'].matrix_world@Matrix.Translation((.200,-.354-(P.DIMS.launcher_long if long else P.DIMS.launcher_gentle),.11695))@Matrix.Rotation(math.pi,4,'X')
    bpy.context.view_layer.update();row['supplied_driver_tip_head_volume_m3']=volume(driver_tip,head)
    stop.append(row)

reset();m=R.build_model();R.set_state(m,'rover-tested',context=False,raised=False)
wire_results=[]
for wire,cover,grommet in m['cable_exits']:
    solids=[tree([cover]),tree([grommet])];points=[wire.matrix_world@Vector(p.co[:3]) for p in wire.data.splines[0].points]
    clearance=math.inf;embedded=0
    for a,b in zip(points,points[1:]):
        count=max(2,math.ceil((b-a).length/.0002))
        for i in range(count+1):
            p=a.lerp(b,i/count)
            for t in solids:
                clearance=min(clearance,t.find_nearest(p)[3]-wire.data.bevel_depth)
                embedded+=inside(t,p)
    installed=(cover.location.z,grommet.location.z);entry_clearance=math.inf;entry_embedded=0
    # The connected lead enters the open channel and split grommet as the
    # supplied cover is raised from below its motor into its fitted position.
    probe=m['vehicle'].matrix_world@grommet.location
    for i in range(51):
        cover.location.z=installed[0]-.015*i/50;grommet.location.z=installed[1]-.015*i/50;bpy.context.view_layer.update()
        for ob in (cover,grommet):
            t=tree([ob]);entry_clearance=min(entry_clearance,t.find_nearest(probe)[3]-wire.data.bevel_depth);entry_embedded+=inside(t,probe)
    cover.location.z,grommet.location.z=installed;bpy.context.view_layer.update()
    wire_results.append({'minimum_wire_surface_clearance_m':clearance,'embedded_centre_samples':embedded,
                         'cover_installation_samples':51,'installation_surface_clearance_m':entry_clearance,'installation_embedded_centres':entry_embedded})
# Place the unchanged supplied screwdriver with its actual tip in the screw.
tool=m['tool'];tip=next(o for o in tool['parts']['rover-trim-driver'] if o.name.startswith('flat screwdriver tip'))
tool['root'].matrix_world=m['vehicle'].matrix_world@Matrix.Translation((.034,.040,.17525))@Matrix.Rotation(math.pi,4,'X')
bpy.context.view_layer.update();trim={'tip_slot_volume_m3':volume(tip,m['trim_screw']),'tip_deck_volume_m3':volume(tip,m['deck'])}
tool_meshes=[o for o in tool['parts']['rover-trim-driver'] if o.type=='MESH']
targets=[o for o in m['rigid'] if not o.hide_render and o.get('part_id')!='rover-trim-driver']
target_trees={o:tree([o]) for o in targets};tool_overlaps={}
for ob in tool_meshes:
    t=tree([ob])
    for other,other_tree in target_trees.items():
        if t.overlap(other_tree):tool_overlaps[ob.name+' | '+other.name]=volume(ob,other)
trim['complete_tool_machine_intersections_m3']=tool_overlaps
trim['actual_tip_size_m']=list(tip.dimensions)
trim['engagement_m']=.0518-min((m['vehicle'].matrix_world.inverted()@v).z for v in geometry(tip)[0])
tool['root'].matrix_world=m['vehicle'].matrix_world@Matrix.Translation((.034,.040,.17525))@Matrix.Rotation(.1,4,'Z')@Matrix.Rotation(math.pi,4,'X')
bpy.context.view_layer.update();trim['relative_turn_0_1rad_contacts_slot_volume_m3']=volume(tip,m['trim_screw'])
failures=[]
if pocket['after_shim'] or pocket['maximum_top_triangle_drain_slope']>=0:failures.append('residual pocket minimum or uphill top facet')
if not any(p['minimum_escape_rise_m'] and p['minimum_escape_rise_m']>1e-6 for p in pocket['before_shim']):failures.append('missing original corner-trap demonstration')
if any(c['rest_volume_m3']>1e-10 or c['withdrawal_1mm_blocked_volume_m3']<1e-9 for c in clips):failures.append('wedge capture')
for row in stop:
    if max(row['shaft_block_volume_m3'],row['shaft_guide_volume_m3'],row['nut_rest_volume_m3'],row['supplied_driver_tip_head_volume_m3'])>1e-10 or min(row['shaft_head_join_volume_m3'],row['nut_drop_0_3mm_blocked_volume_m3'],row['nut_rotation_blocked_volume_m3'])<1e-10:failures.append('stop fastener')
if any(min(r['minimum_wire_surface_clearance_m'],r['installation_surface_clearance_m'])<-.000001 or r['embedded_centre_samples'] or r['installation_embedded_centres'] for r in wire_results):failures.append('guard cable route')
if max([trim['tip_slot_volume_m3'],trim['tip_deck_volume_m3'],*tool_overlaps.values()])>1e-10 or trim['engagement_m']<.0004 or trim['relative_turn_0_1rad_contacts_slot_volume_m3']<1e-12:failures.append('trim driver fit/torque')
result={'author_check':True,'source_sha256':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [HERE/'pinball_table.py',HERE/'drawing_rover.py',HERE/'hand_tools.py',Path(__file__)]},'finite_marble':pocket,'wedge_capture':clips,'stop_fastener':stop,'motor_guard_wires':wire_results,'trim_driver':trim,'failures':failures,'limits':['Static ideal sphere support and sampled clearances, not launched-marble dynamics or friction.','Standard clamp threads are represented at nominal diameter; no helical-thread manufacture or clamp-force validation.','No material, motor, electrical or child-use certification.']}
(out/'interface-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2),flush=True)
if failures:raise SystemExit('FAILED: '+', '.join(failures))
