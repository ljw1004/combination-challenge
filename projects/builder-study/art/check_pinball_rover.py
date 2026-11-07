"""Creator's sampled actual-mesh checks for pinball and rover; raw output is scratch."""
import argparse,hashlib,json,math,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import pinball_table as P
import drawing_rover as R
p=argparse.ArgumentParser();p.add_argument('--samples',type=int,default=41);p.add_argument('--out',default='runs/builder-study/pinball-rover-pilot');args=p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
out=Path(args.out);out.mkdir(parents=True,exist_ok=True)

def geometry(obj):
    ev=obj.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh()
    vs=[ev.matrix_world@v.co for v in me.vertices];fs=[tuple(p.vertices) for p in me.polygons];ev.to_mesh_clear();return vs,fs

def tree(obj):
    vs,fs=geometry(obj);return BVHTree.FromPolygons(vs,fs)

def root_of(ob,roots):
    while ob:
        if ob in roots:return ob
        ob=ob.parent
    return None

def intersection_volume(a,b):
    import bmesh
    temporary=[]
    for original in (a,b):
        vs,fs=geometry(original);mesh=bpy.data.meshes.new('temporary volume probe');mesh.from_pydata(vs,[],fs);mesh.update()
        ob=bpy.data.objects.new('temporary volume probe',mesh);bpy.context.collection.objects.link(ob);temporary.append(ob)
    first,second=temporary;bpy.context.view_layer.objects.active=first
    modifier=first.modifiers.new('actual solid contact intersection','BOOLEAN');modifier.operation='INTERSECT';modifier.solver='EXACT';modifier.object=second
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    bm=bmesh.new();bm.from_mesh(first.data);volume=abs(bm.calc_volume(signed=True));bm.free()
    for ob in temporary:bpy.data.objects.remove(ob,do_unlink=True)
    return volume

def ray_world(ob,origin,direction,length):
    inv=ob.matrix_world.inverted();hit,point,normal,index=ob.ray_cast(inv@Vector(origin),(inv.to_3x3()@Vector(direction)).normalized(),distance=length)
    return ob.matrix_world@point if hit else None

def visible(model):return sorted(o.name for obs in model['parts'].values() for o in obs if not o.hide_render)

def mesh_fingerprint(model):return {o.name:([tuple(v.co) for v in o.data.vertices],[tuple(f.vertices) for f in o.data.polygons]) for o in model['rigid']}

for family,mod in [('pinball',P),('rover',R)]:
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    m=mod.build_model();initial=mesh_fingerprint(m);states=list(mod.SUPPLIES)+list(mod.STATES)+(['work-screwdriver'] if family=='pinball' else ['rover-trim-driver'])
    expected={};state_errors=[]
    for s in states:mod.set_state(m,s);expected[s]=visible(m)
    for s in reversed(states):
        mod.set_state(m,s)
        if visible(m)!=expected[s]:state_errors.append(s)
    mask_errors=[];overlay_geometry={}
    if family=='rover':
        for mask in range(32):
            selected=[s for i,s in enumerate(R.SLOTS) if mask>>i&1];R.set_state(m,'rover-deck',slots=selected)
            actual={pid for pid,obs in m['parts'].items() if any(not o.hide_render for o in obs)}
            wanted={'rover-deck'}
            for s in selected:wanted.update(R.STATES.get(s,[s]))
            if actual!=wanted:mask_errors.append({'mask':mask,'actual':sorted(actual),'expected':sorted(wanted)})
        for slot in R.SLOTS:
            R.set_overlay(m,slot);overlay_geometry[slot]={o.name:[list(v) for v in geometry(o)[0]] for obs in m['parts'].values() for o in obs if o.type=='MESH' and not o.hide_render}
        R.set_state(m,'rover-deck',slots=R.SLOTS)
        overlay_error=max(math.dist(v,list(w)) for group in overlay_geometry.values() for name,vs in group.items() for v,w in zip(vs,geometry(bpy.data.objects[name])[0]))
    else:overlay_error=None
    mod.set_state(m,'pinball-table' if family=='pinball' else 'rover-pen-deck')
    if family=='rover':R.apply_pose(m)
    roots=[m['pull'],*m['flippers']] if family=='pinball' else [*m['wheels'],m['cam'],m['carriage']]
    moving=[o for o in m['rigid'] if root_of(o,roots)]
    fixed=[o for o in m['rigid'] if not root_of(o,roots) and o.get('part_id') not in {'pb-marble','work-screwdriver','rover-remote','rover-remote-cells','rover-trim-driver','rover-paper'}]
    fixedtrees={o:tree(o) for o in fixed};overlaps={};bore_errors=[];min_ground=1e3;maxscale=0
    for i in range(args.samples):
        q=i/max(1,args.samples-1)
        if family=='pinball':mod.apply_pose(m,P.DIMS.launcher_long*q,(q,1-q),True)
        else:mod.apply_pose(m,wheel_angles=(2*math.pi*q,-2*math.pi*q),pen_angle=R.PEN_MAX*q)
        bpy.context.view_layer.update()
        for ob,c,axis,length in m['bore_checks']:
            # Bores and cutter definitions use the same parent-local coordinates.
            u=Vector({'X':(1,0,0),'Y':(0,1,0),'Z':(0,0,1)}[axis]);parent=ob.parent.matrix_world;inv=ob.matrix_world.inverted()
            origin=inv@(parent@(Vector(c)-u*length/2));direction=(inv.to_3x3()@parent.to_3x3()@u).normalized()
            if ob.ray_cast(origin,direction,distance=length)[0]:bore_errors.append({'sample':i,'object':ob.name})
        trees={o:tree(o) for o in moving}
        for ob,t in trees.items():
            maxscale=max(maxscale,max(abs(v-1) for v in ob.matrix_world.to_scale()))
            for other,ot in fixedtrees.items():
                if t.overlap(ot):overlaps.setdefault(ob.name+' | '+other.name,[]).append(i)
        for j,ob in enumerate(moving):
            for other in moving[j+1:]:
                if root_of(ob,roots)==root_of(other,roots):continue
                if trees[ob].overlap(trees[other]):overlaps.setdefault(ob.name+' | '+other.name,[]).append(i)
    final_fingerprint=mesh_fingerprint(m)
    rigid_changes=[name for name,data in initial.items() if final_fingerprint[name]!=data]
    contact_volumes={}
    for pair,indices in overlaps.items():
        i=indices[len(indices)//2];q=i/max(1,args.samples-1)
        if family=='pinball':mod.apply_pose(m,P.DIMS.launcher_long*q,(q,1-q),True)
        else:mod.apply_pose(m,wheel_angles=(2*math.pi*q,-2*math.pi*q),pen_angle=R.PEN_MAX*q)
        a,b=pair.split(' | ');contact_volumes[pair]=intersection_volume(bpy.data.objects[a],bpy.data.objects[b])
    contacts={};attachment_gaps=[];attachment_errors=[]
    if family=='rover':
        R.apply_pose(m)
        for foot,deck,point in m['mount_interfaces']:
            x,y,z=point;a=ray_world(foot,(x,y,z+.012),(0,0,-1),.025);b=ray_world(deck,(x,y,z-.012),(0,0,1),.025)
            if a is None or b is None:attachment_errors.append(foot.name)
            else:attachment_gaps.append((a-b).length)
        for key,obs in [('wheels',[o for o in m['rigid'] if 'rubber drive tyre' in o.name]),('caster',[m['caster_ball']]),('pen',[m['pen_nib']])]:
            contacts[key]=[min(v.z for v in geometry(ob)[0]) for ob in obs]
        R.apply_pose(m,pen_angle=R.PEN_MAX);contacts['raised_pen']=min(v.z for v in geometry(m['pen_nib'])[0])
    if family=='pinball':
        P.set_state(m,'pinball-table');bpy.context.view_layer.update()
        # Exact underside/foot contact planes at the corrected left support.
        a=ray_world(m['wedge_members'][1],(-.175,-.260,0),(0,0,1),.020)
        b=ray_world(m['shim'],(-.175,-.260,.020),(0,0,-1),.025)
        if a is None or b is None:attachment_errors.append('shim-to-wedge')
        else:attachment_gaps.append((a-b).length)
        contacts['corrected_wedge_min_z']=min(v.z for ob in m['wedge_members'] for v in geometry(ob)[0])
        P.set_state(m,'pb-sloped');contacts['unshimmed_wedge_min_z']=min(v.z for ob in m['wedge_members'] for v in geometry(ob)[0])
    result={'creator_check':True,'source_sha256':{f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in [HERE/(mod.__name__+'.py'),Path(__file__)]},
            'analytic':mod.check_motion(),'actual_mesh_samples':args.samples,'state_count':len(states),'state_reset_errors':state_errors,
            'slot_mask_errors':mask_errors,'overlay_world_vertex_error_m':overlay_error,'receiving_bores_per_pose':len(m['bore_checks']),
            'blocked_bore_rays':bore_errors,'rigid_mesh_changes':rigid_changes,'rigid_scale_error':maxscale,'actual_ground_contacts_m':contacts,
            'moving_surface_intersections':overlaps,'actual_intersection_volumes_m3':contact_volumes,
            'mount_face_probes':len(attachment_gaps),'maximum_mount_face_gap_m':max(attachment_gaps,default=0),'mount_face_errors':attachment_errors,
            'limits':'Sampled surface triangle overlaps and centreline bore rays. No continuous solid sweep, static attachment certification, material strength or motor/ball dynamics.'}
    (out/f'{family}-mesh-check.json').write_text(json.dumps(result,indent=2)+'\n')
    print(family, 'state-errors',state_errors,'bores-blocked',len(bore_errors),'rigid-changes',rigid_changes,'overlaps',list(overlaps),flush=True)
