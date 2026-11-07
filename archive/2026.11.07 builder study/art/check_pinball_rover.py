"""Creator's sampled actual-mesh checks for pinball and rover; raw output is scratch."""
import argparse,hashlib,itertools,json,math,random,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;sys.path.insert(0,str(HERE))
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import pinball_table as P
import drawing_rover as R
p=argparse.ArgumentParser();p.add_argument('--samples',type=int,default=41);p.add_argument('--out',default='runs/builder-study/pinball-rover-pilot');p.add_argument('--family',choices=('both','pinball','rover'),default='both');args=p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
failed=[]

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

def presentation_fingerprint(model):
    """Include transforms, curves, hidden fixtures and holdouts in reset checks."""
    result={}
    for objects in model['parts'].values():
        for ob in objects:
            result[ob.name]={'matrix':[round(x,9) for row in ob.matrix_world for x in row],
                             'hidden':ob.hide_render,'holdout':ob.is_holdout}
            if ob.type=='CURVE':result[ob.name]['curves']=[[list(p.co) for p in s.points] for s in ob.data.splines]
    return {'objects':result,'view':model['view']}

def canvas_fit(model):
    from bpy_extras.object_utils import world_to_camera_view
    import scene_parts as S
    scene=bpy.context.scene;scene.render.resolution_x=scene.render.resolution_y=512
    view=model['view'];camera=S.camera('temporary canvas probe',view['location'],view['target'],view['scale'])
    bpy.context.view_layer.update();points=[]
    for objects in model['parts'].values():
        for ob in objects:
            if ob.hide_render or ob.type not in {'MESH','CURVE','FONT'}:continue
            points.extend(world_to_camera_view(scene,camera,ob.matrix_world@Vector(c)) for c in ob.bound_box)
    bpy.data.objects.remove(camera,do_unlink=True)
    return [min(p.x for p in points),max(p.x for p in points),min(p.y for p in points),max(p.y for p in points)] if points else []

def group_tree(objects):
    vertices=[];faces=[]
    for ob in objects:
        if ob.type not in {'MESH','CURVE'}:continue
        vs,fs=geometry(ob);offset=len(vertices);vertices.extend(vs);faces.extend(tuple(i+offset for i in f) for f in fs)
    return BVHTree.FromPolygons(vertices,faces)

def static_clearance(model,family):
    """Check detachable cross-part interfaces and selected internal bearings.

    Board contact planes and through-fasteners use the separate bore/face
    probes. Factory-bonded intersections within a supplied module are not
    mistaken for a detachable fit. The free caster and score wheel are checked
    against their own supplied housing, as are module nuts and enclosures.
    """
    objects=[o for o in model['rigid'] if not o.hide_render];trees={o:tree(o) for o in objects};volumes={}
    enclosure=('factory sealed reduction gearbox','closed low-voltage battery holder','closed fused off-switch harness','closed radio receiver and dual motor driver')
    for i,a in enumerate(objects):
        for b in objects[i+1:]:
            cross=a['part_id']!=b['part_id'] and not any(o.name.startswith(('plywood tray','birch rover deck')) for o in (a,b))
            bearing=any(o.name.startswith(('freely rolling caster ball','manual numbered score wheel')) for o in (a,b))
            fastener=any('captive nut' in o.name or 'captive mounting screw' in o.name for o in (a,b)) and any(o.name.startswith(enclosure) for o in (a,b))
            guide=any('guide captive mount' in o.name for o in (a,b)) and any('carriage guide rod' in o.name for o in (a,b))
            if (cross or bearing or fastener or guide) and trees[a].overlap(trees[b]):volumes[a.name+' | '+b.name]=intersection_volume(a,b)
    return volumes

def compound_check(model,resolution=240):
    """All 32 masks, all 120 installation orders, and owner/slot depth masks.

    This compares geometric coverage, independent of lighting or PNG filtering.
    Slots behind the owner must be cut out; front-facing slots cannot overlap
    one another if arbitrary image-stack order is to be physically valid.
    """
    baselines={};errors=[]
    for mask in range(32):
        selected=[s for i,s in enumerate(R.SLOTS) if mask>>i&1]
        R.set_state(model,'rover-deck',slots=selected);baselines[mask]=presentation_fingerprint(model)
    for order in itertools.permutations(R.SLOTS):
        R.set_state(model,'drawing-rover')
        for count in range(6):
            selected=order[:count];mask=sum(1<<R.SLOTS.index(s) for s in selected)
            R.set_state(model,'rover-deck',slots=selected)
            if presentation_fingerprint(model)!=baselines[mask]:errors.append([list(order),count])
    R.set_state(model,'rover-deck',slots=R.SLOTS)
    groups=model['compound_groups'];trees=[group_tree(groups['owner'])]+[group_tree(groups['slots'][s]) for s in R.SLOTS]
    front_counts=[0]*5;hidden_counts=[0]*5;ambiguous=0;mask_errors=[0]*32
    for iy in range(resolution):
        for ix in range(resolution):
            origin=Vector(((ix+.5)/resolution*.3-.15,(iy+.5)/resolution*.3-.15,1.2));depth=[]
            for t in trees:
                hit=t.ray_cast(origin,Vector((0,0,-1)),2);depth.append(hit[3] if hit[0] is not None else math.inf)
            front=[j for j in range(5) if depth[j+1]<depth[0]-1e-7]
            ambiguous+=len(front)>1
            for j in range(5):
                front_counts[j]+=j in front
                hidden_counts[j]+=math.isfinite(depth[j+1]) and depth[j+1]>depth[0]+1e-7
            for mask in range(32):
                selected=[j for j in range(5) if mask>>j&1]
                exact=min([0]+[j+1 for j in selected],key=lambda j:depth[j])
                painted=[j+1 for j in front if j in selected]
                if (painted[-1] if painted else 0)!=exact:mask_errors[mask]+=1
    # Explicitly probe top-side screw-head vertices, even where the same slot's
    # front flange already occludes them in the slot-only nearest-depth image.
    hidden_heads={}
    for slot in R.SLOTS:
        n=0
        for ob in groups['slots'][slot]:
            if 'retained screw head' not in ob.name:continue
            for v in geometry(ob)[0]:
                hit=trees[0].ray_cast(Vector((v.x,v.y,1.2)),Vector((0,0,-1)),2)
                n+=hit[0] is not None and hit[0].z>v.z+1e-7
        hidden_heads[slot]=n
        R.set_overlay(model,slot)
        if not all(o.is_holdout and not o.hide_render for o in groups['owner']):errors.append(['missing owner holdout',slot])
    return {'installation_orders':120,'mask_count':32,'installation_order_errors':errors,
            'depth_grid':resolution,'front_slot_overlap_pixels':ambiguous,
            'mask_depth_errors':mask_errors,'front_pixels':dict(zip(R.SLOTS,front_counts)),
            'owner_occluded_slot_pixels':dict(zip(R.SLOTS,hidden_counts)),
            'owner_occluded_screw_head_vertices':hidden_heads}

for family,mod in [('pinball',P),('rover',R)]:
    if args.family not in ('both',family):continue
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    m=mod.build_model();initial=mesh_fingerprint(m);states=list(mod.SUPPLIES)+list(mod.STATES)+(['work-screwdriver'] if family=='pinball' else ['rover-trim-driver'])
    expected={};state_errors=[];canvas_bounds={}
    for s in states:
        mod.set_state(m,s);expected[s]=presentation_fingerprint(m);canvas_bounds[s]=canvas_fit(m)
    shuffled=states.copy();random.Random(3489).shuffle(shuffled)
    for s in list(reversed(states))+shuffled:
        mod.set_state(m,s)
        if presentation_fingerprint(m)!=expected[s]:state_errors.append(s)
    mask_errors=[];overlay_geometry={}
    if family=='rover':
        for mask in range(32):
            selected=[s for i,s in enumerate(R.SLOTS) if mask>>i&1];R.set_state(m,'rover-deck',slots=selected)
            actual={pid for pid,obs in m['parts'].items() if any(not o.hide_render for o in obs)}
            wanted={'rover-deck'}
            for s in selected:wanted.update(R.STATES.get(s,[s]))
            if actual!=wanted:mask_errors.append({'mask':mask,'actual':sorted(actual),'expected':sorted(wanted)})
        for slot in R.SLOTS:
            R.set_overlay(m,slot);overlay_geometry[slot]={o.name:[list(v) for v in geometry(o)[0]] for obs in m['parts'].values() for o in obs if o.type=='MESH' and not o.hide_render and not o.is_holdout}
        R.set_state(m,'rover-deck',slots=R.SLOTS)
        overlay_error=max(math.dist(v,list(w)) for group in overlay_geometry.values() for name,vs in group.items() for v,w in zip(vs,geometry(bpy.data.objects[name])[0]))
        compound=compound_check(m)
    else:overlay_error=None;compound=None
    mod.set_state(m,'pinball-table' if family=='pinball' else 'rover-pen-deck')
    if family=='rover':R.apply_pose(m)
    roots=[m['pull'],*m['flippers']] if family=='pinball' else [*m['wheels'],m['cam'],m['carriage']]
    moving=[o for o in m['rigid'] if not o.hide_render and root_of(o,roots)]
    fixed=[o for o in m['rigid'] if not o.hide_render and not root_of(o,roots) and o.get('part_id') not in {'pb-marble','work-screwdriver','rover-remote','rover-remote-cells','rover-trim-driver','rover-paper'}]
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
    mod.set_state(m,'pinball-table' if family=='pinball' else 'rover-pen-deck')
    static_volumes=static_clearance(m,family)
    # 0.1 mm³ accommodates float-coordinate Boolean residue at coincident
    # contact planes; it is far below the corrected millimetre-scale collisions.
    tolerance=1e-10
    failures=[]
    for label,values in [('state reset',state_errors),('slot visibility',mask_errors),('blocked bore',bore_errors),('rigid deformation',rigid_changes),('mount face',attachment_errors)]:
        if values:failures.append(label)
    if any(v>tolerance for v in contact_volumes.values()):failures.append('moving solid interference')
    if any(v>tolerance for v in static_volumes.values()):failures.append('static solid interference')
    if compound and (compound['installation_order_errors'] or compound['front_slot_overlap_pixels'] or any(compound['mask_depth_errors'])):failures.append('compound order/depth')
    if max(attachment_gaps,default=0)>1e-6:failures.append('mount face gap')
    canvas_errors={s:v for s,v in canvas_bounds.items() if not v or min(v[0],v[2])<.01 or max(v[1],v[3])>.99}
    if canvas_errors:failures.append('canvas bounds')
    failed.extend(family+': '+reason for reason in failures)
    result={'creator_check':True,'source_sha256':{f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in [HERE/(mod.__name__+'.py'),Path(__file__)]},
            'analytic':mod.check_motion(),'actual_mesh_samples':args.samples,'state_count':len(states),'state_reset_errors':state_errors,
            'slot_mask_errors':mask_errors,'compound_compositing':compound,'overlay_world_vertex_error_m':overlay_error,'receiving_bores_per_pose':len(m['bore_checks']),
            'blocked_bore_rays':bore_errors,'rigid_mesh_changes':rigid_changes,'rigid_scale_error':maxscale,'actual_ground_contacts_m':contacts,
            'moving_surface_intersections':overlaps,'actual_intersection_volumes_m3':contact_volumes,
            'static_intersection_volumes_m3':static_volumes,'solid_volume_tolerance_m3':tolerance,'failures':failures,
            'canvas_bounds':canvas_bounds,'canvas_errors':canvas_errors,
            'mount_face_probes':len(attachment_gaps),'maximum_mount_face_gap_m':max(attachment_gaps,default=0),'mount_face_errors':attachment_errors,
            'limits':'Sampled surface triangle overlaps and centreline bore rays. No continuous solid sweep, static attachment certification, material strength or motor/ball dynamics.'}
    (out/f'{family}-mesh-check.json').write_text(json.dumps(result,indent=2)+'\n')
    print(family, 'state-errors',state_errors,'bores-blocked',len(bore_errors),'rigid-changes',rigid_changes,'overlaps',list(overlaps),flush=True)
if failed:raise SystemExit('FAILED: '+', '.join(failed))
