"""Author's full guard-installation and connected-lead interface checks.

Run with Blender --background --python this_file -- --out SCRATCH_DIRECTORY.
All target meshes are evaluated independently of the model's clearance claims.
"""
import argparse, hashlib, json, math, sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy, bmesh
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import drawing_rover as R
parser=argparse.ArgumentParser();parser.add_argument('--out',default='runs/builder-study/rover-last-repairs');parser.add_argument('--step-mm',type=float,default=.2);parser.add_argument('--skip-guard',action='store_true')
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
source_paths=[HERE/'drawing_rover.py',Path(__file__)];source_hashes={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in source_paths}
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
m=R.build_model();R.set_state(m,'rover-pen-deck',context=False,raised=False)

def geometry(ob):
    ev=ob.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh()
    vs=[ev.matrix_world@v.co for v in me.vertices];fs=[tuple(f.vertices) for f in me.polygons]
    ev.to_mesh_clear();return vs,fs

def cache(ob):
    vs,fs=geometry(ob);me=bpy.data.meshes.new('evaluated interface copy');me.from_pydata(vs,[],fs);me.update()
    if ob.type=='CURVE':
        # Flat end caps close the evaluated cable tube for valid solid Booleans.
        bm=bmesh.new();bm.from_mesh(me);bmesh.ops.holes_fill(bm,edges=[e for e in bm.edges if e.is_boundary],sides=0)
        bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(me);bm.free()
    cp=bpy.data.objects.new('evaluated interface copy',me);bpy.context.collection.objects.link(cp)
    return {'object':cp,'tree':BVHTree.FromPolygons([v.co.copy() for v in me.vertices],[tuple(f.vertices) for f in me.polygons]),'bounds':[(min(v[i] for v in vs),max(v[i] for v in vs)) for i in range(3)]}

def broad(a,b,dz=0):
    return all(a[i][0]+(dz if i==2 else 0)<b[i][1]-1e-9 and a[i][1]+(dz if i==2 else 0)>b[i][0]+1e-9 for i in range(3))

def volume(a,b,dz=0):
    ob=a['object'];ob.location.z=dz
    mod=ob.modifiers.new('exact interface intersection','BOOLEAN');mod.operation='INTERSECT';mod.solver='EXACT';mod.object=b['object']
    ev=ob.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh();bm=bmesh.new();bm.from_mesh(me);v=abs(bm.calc_volume(signed=True));bm.free();ev.to_mesh_clear()
    ob.modifiers.remove(mod);ob.location.z=0
    return v

def inside(tree,p):
    direction=Vector((.37,.53,.77)).normalized();count=0;origin=p.copy()
    for _ in range(100):
        hit=tree.ray_cast(origin,direction,2)
        if hit[0] is None:return bool(count%2)
        count+=1;origin=hit[0]+direction*1e-7
    raise RuntimeError('Unresolved point/solid parity')

guards=[o for o in m['parts']['rover-covers'] if o.type=='MESH']
targets=[o for os in m['parts'].values() for o in os if o.type in {'MESH','CURVE'} and not o.hide_render and o not in guards]
cached={o:cache(o) for o in guards+targets}
count=round(.060/(args.step_mm/1000));hits={};tested=0;guard_count=len(guards);neighbor_count=len(targets)
for i in ([] if args.skip_guard else range(count+1)):
    dz=-.060+i*.060/count
    R.pose_guard_installation(m,dz)
    for guard in guards:
        old=cached[guard]['object'];oldmesh=old.data;bpy.data.objects.remove(old,do_unlink=True);bpy.data.meshes.remove(oldmesh)
        cached[guard]=cache(guard);a=cached[guard]
        for target in targets:
            b=cached[target]
            if not broad(a['bounds'],b['bounds']):continue
            tested+=1;v=volume(a,b)
            if v>1e-12:
                key=guard.name+' | '+target.name
                item=hits.setdefault(key,{'maximum_volume_m3':0,'worst_offset_m':dz,'first_offset_m':dz,'last_offset_m':dz,'samples':0})
                item['last_offset_m']=dz;item['samples']+=1
                if v>item['maximum_volume_m3']:item['maximum_volume_m3']=v;item['worst_offset_m']=dz
    if i%50==0:print('Guard sweep',i,'/',count,'intersection pairs',len(hits),flush=True)
R.pose_guard_installation(m)

# Every point of each complete lead is checked, including receiver approaches.
# The factory termination and the supplied plug intentionally contain their
# cable ends; their volumes are recorded separately, not silently discarded.
wire_results=[];plug_results=[]
def inspect_plug(index,mode):
    wire,plug,park,live=m['wires'][index]
    points=[wire.matrix_world@Vector(p.co[:3]) for p in wire.data.splines[0].points]
    direction=(points[-1]-points[-2]).normalized();pc=cached[plug]
    hit=pc['tree'].ray_cast(points[-2],direction,(points[-1]-points[-2]).length)
    if hit[0] is None:raise AssertionError('Cable does not enter its plug: '+plug.name)
    inverse=plug.matrix_world.inverted()
    result={'plug':plug.name,'mode':mode,'local_entry_m':list(inverse@hit[0]),
            'local_entry_direction':list((inverse.to_3x3()@direction).normalized()),
            'local_entry_normal':list((plug.matrix_world.to_3x3().transposed()@hit[1]).normalized()),
            'rotation_quaternion':list(plug.rotation_quaternion),'intersections':{}}
    for other in targets+guards:
        if other in {plug,wire} or not broad(pc['bounds'],cached[other]['bounds']):continue
        value=volume(pc,cached[other])
        if value>1e-12:result['intersections'][other.name]=value
    plug_results.append(result);print('Plug',index,result,flush=True)

def inspect_wire(index,mode):
    wire,plug,park,live=m['wires'][index]
    wc=cache(wire);points=[wire.matrix_world@Vector(p.co[:3]) for p in wire.data.splines[0].points]
    factory_names=[['factory sealed reduction gearbox','gearcase gasket seam'],['factory sealed reduction gearbox.001','gearcase gasket seam.001'],['closed low-voltage battery holder'],['closed fused off-switch harness']][index]
    result={'wire':wire.name,'mode':mode,'parked_length_m':R.wire_length(park),'connected_length_m':R.wire_length(live),'intentional_terminations':{},'intersections':{},'minimum_clearance_m':math.inf,'nearest_object':None,'samples':0}
    for other in targets+guards:
        if other==wire:continue
        if not broad(wc['bounds'],cached[other]['bounds']):continue
        value=volume(wc,cached[other])
        own_case=other.name in factory_names
        if other==plug:
            if value>1e-12:result['intentional_terminations'][other.name]=value
        elif value>1e-12:result['intersections'][other.name]=value
    excluded={wire};travelled=0;length=R.wire_length(points)
    for a,b in zip(points,points[1:]):
        n=max(1,math.ceil((b-a).length/.0001))
        for j in range(n+1):
            p=a.lerp(b,j/n);result['samples']+=1
            for other in targets+guards:
                if other in excluded:continue
                along=travelled+(b-a).length*j/n
                # A finite-radius center probe overreaches a flat cable end;
                # actual capped-mesh Booleans still check the factory joint.
                if other.name in factory_names and along<2*wire.data.bevel_depth:continue
                if other==plug and length-along<.004:continue
                bounds=cached[other]['bounds']
                bound_distance=math.sqrt(sum(max(lo-p[k],p[k]-hi,0)**2 for k,(lo,hi) in enumerate(bounds)))
                if bound_distance-wire.data.bevel_depth>result['minimum_clearance_m']:continue
                tree=cached[other]['tree'];nearest=tree.find_nearest(p);distance=nearest[3]
                gap=(-distance if inside(tree,p) else distance)-wire.data.bevel_depth
                if gap<result['minimum_clearance_m']:result['minimum_clearance_m']=gap;result['nearest_object']=other.name
        travelled+=(b-a).length
    wire_results.append(result);print('Wire',index,result,flush=True)
    cp=wc['object'];mesh=cp.data;bpy.data.objects.remove(cp,do_unlink=True);bpy.data.meshes.remove(mesh)
for mode in ('connected','parked'):
    if mode=='parked':
        for entry in cached.values():
            cp=entry['object'];mesh=cp.data;bpy.data.objects.remove(cp,do_unlink=True);bpy.data.meshes.remove(mesh)
        R.set_state(m,'rover-deck',slots=R.SLOTS,context=False,upside_down=False)
        guards=[];targets=[o for os in m['parts'].values() for o in os if o.type in {'MESH','CURVE'} and not o.hide_render]
        cached={o:cache(o) for o in targets}
    for index in range(4):inspect_wire(index,mode);inspect_plug(index,mode)

plug_continuity=[]
for i in range(4):
    live,park=plug_results[i],plug_results[i+4]
    plug_continuity.append({'plug':live['plug'],
        'entry_position_error_m':math.dist(live['local_entry_m'],park['local_entry_m']),
        'entry_direction_error':math.dist(live['local_entry_direction'],park['local_entry_direction']),
        'entry_normal_error':math.dist(live['local_entry_normal'],park['local_entry_normal'])})

assert source_hashes=={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in source_paths},'Source changed during check'
result={'author_check':True,'source_sha256':source_hashes,
        'guard_parts':guard_count,'fixed_neighbor_solids':neighbor_count,'guard_offsets':0 if args.skip_guard else count+1,'offset_range_m':[-.060,0],
        'offset_step_m':.060/count,'maximum_inward_finger_flex_m':.00045,'exact_guard_neighbor_tests':tested,'guard_intersections':hits,'all_leads':wire_results,
        'all_plugs':plug_results,'plug_attachment_continuity':plug_continuity,
        'limits':'Sampled exact solid intersections and 0.1 mm finite-radius cable-center probes; no material or electrical validation.'}
(out/'installation-check.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2),flush=True)
if hits or any(w['intersections'] or w['minimum_clearance_m']<-.000001 or abs(w['parked_length_m']-w['connected_length_m'])>1e-9 for w in wire_results):raise SystemExit('Interface check failed; see installation-check.json')
if any(p['intersections'] for p in plug_results) or any(p['entry_position_error_m']>1e-7 or p['entry_direction_error']>1e-6 or p['entry_normal_error']>1e-6 for p in plug_continuity):raise SystemExit('Plug contact/continuity check failed; see installation-check.json')
