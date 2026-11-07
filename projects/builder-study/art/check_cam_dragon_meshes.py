"""Implementation checks after the independent review; not an independent review.

Checks evaluated mesh surfaces, actual bore axes, and complete spring centreline
clearance. BVH intersection does not detect every possible solid containment.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import sys

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))


def segment_box_distance(a,b,lo,hi):
    delta=[b[i]-a[i] for i in range(3)];cuts={0.,1.}
    for i in range(3):
        if abs(delta[i])>1e-15:
            for bound in [lo[i],hi[i]]:
                t=(bound-a[i])/delta[i]
                if 0<t<1:cuts.add(t)
    cuts=sorted(cuts);best=math.inf
    def squared(t):
        return sum(max(lo[i]-a[i]-t*delta[i],0,a[i]+t*delta[i]-hi[i])**2 for i in range(3))
    for start,end in zip(cuts,cuts[1:]):
        middle=(start+end)/2;terms=[]
        for i in range(3):
            p=a[i]+middle*delta[i]
            if p<lo[i]:terms.append((a[i]-lo[i],delta[i]))
            elif p>hi[i]:terms.append((a[i]-hi[i],delta[i]))
        denominator=sum(v*v for _,v in terms)
        optimum=max(start,min(end,-sum(u*v for u,v in terms)/denominator)) if denominator else middle
        best=min(best,squared(start),squared(end),squared(optimum))
    return math.sqrt(best)


def check_model(model,samples=72,service=True):
    import bpy
    from mathutils import Vector
    from mathutils.bvhtree import BVHTree
    from cam_dragon import apply_pose,set_service_state,SERVICE_STEPS
    def group(obj):
        while obj.parent and obj.parent!=model["root"]:obj=obj.parent
        return obj.name
    objects=[o for o in model["root"].children_recursive if o.type in {"MESH","CURVE"} and "graphic" not in o.name]
    intersections={};spring_clearances=[];axis_dots=[];service_states=[];blocked_eye_bores=[];bore_radii=[]
    states=[("phase-"+str(i),lambda i=i:apply_pose(model,2*math.pi*i/samples)) for i in range(samples)]
    if service and model["variant"]=="two_lobe":
        states += [(step,lambda step=step:set_service_state(model,step)) for step in SERVICE_STEPS]
    for label,apply in states:
        info=apply()
        if label in SERVICE_STEPS:service_states.append(info)
        bpy.context.view_layer.update();deps=bpy.context.evaluated_depsgraph_get();geometry={}
        for obj in objects:
            evaluated=obj.evaluated_get(deps);mesh=evaluated.to_mesh()
            vertices=[obj.matrix_world@v.co for v in mesh.vertices]
            polygons=[tuple(p.vertices) for p in mesh.polygons]
            lo=[min(v[i] for v in vertices) for i in range(3)]
            hi=[max(v[i] for v in vertices) for i in range(3)]
            geometry[obj.name]=(BVHTree.FromPolygons(vertices,polygons),lo,hi)
            evaluated.to_mesh_clear()
        for i,a in enumerate(objects):
            for b in objects[i+1:]:
                if group(a)==group(b):continue
                av,al,ah=geometry[a.name];bv,bl,bh=geometry[b.name]
                if any(ah[k]<bl[k]-1e-8 or bh[k]<al[k]-1e-8 for k in range(3)):continue
                overlaps=av.overlap(bv)
                if overlaps:
                    key=" | ".join(sorted([a.name,b.name]));entry=intersections.setdefault(key,{"states":[],"maximum_face_pairs":0})
                    entry["states"].append(label);entry["maximum_face_pairs"]=max(entry["maximum_face_pairs"],len(overlaps))
        points=[model["spring"].matrix_world@Vector(p.co[:3]) for p in model["spring"].data.splines[0].points]
        for name in ["fixed spring bracket","moving spring collar"]:
            _,lo,hi=geometry[name]
            spring_clearances.append(min(segment_box_distance(a,b,lo,hi) for a,b in zip(points,points[1:]))-model["dimensions"].spring_wire_radius)
        for side in ["left","right"]:
            eyes=[o for o in model["rods"][side].children if "pivot eye" in o.name]
            pin=next(o for o in model["wings"][side].children if o.name==side+" wing drive pin")
            pin_axis=(pin.matrix_world.to_3x3()@Vector((0,0,1))).normalized()
            for eye in eyes:
                actual_eye_axis=(eye.matrix_world.to_3x3()@Vector((0,0,1))).normalized()
                axis_dots.append(abs(actual_eye_axis.dot(pin_axis)))
                center=eye.matrix_world.translation
                hit=geometry[eye.name][0].ray_cast(center-actual_eye_axis*.010,actual_eye_axis,.020)
                if hit[0] is not None:blocked_eye_bores.append({"state":label,"eye":eye.name})
                radii=[]
                for vertex in eye.data.vertices:
                    delta=eye.matrix_world@vertex.co-center
                    radii.append((delta-actual_eye_axis*delta.dot(actual_eye_axis)).length)
                bore_radii.append(min(radii))
    expected={
        "birch base — 240 x 150 x 12 mm | cam parking clip floor":"Clip is seated on the base.",
        "cam parking clip floor | parked original eccentric cam":"Cam's low rim rests on its clip floor.",
        "capped far shaft captive screw | straight 6 mm shaft":"Simplified captive screw/tapped shaft-end mating surfaces; threads are not modeled.",
        "capped far shaft end washer | straight 6 mm shaft":"Cap end washer seats against shaft end.",
        "left fixed wing hinge pin | left hinge cap front":"Retaining head is a fixed end of the pin.",
        "right fixed wing hinge pin | right hinge cap front":"Retaining head is a fixed end of the pin.",
        "50 mm flat follower foot | two_lobe cam / 6 mm plate":"Intentional cam/follower tangent contact.",
        "50 mm flat follower foot | eccentric cam / 6 mm plate":"Intentional cam/follower tangent contact.",
        "birch base — 240 x 150 x 12 mm | two_lobe cam / 6 mm plate":"Incoming cam rests flat on base during service.",
        "50 mm flat follower foot | parked original eccentric cam":"Original cam/follower tangent contact before swap.",
        "guide keeper pin shank | square guide front/back wall":"Keeper rests on the guide top during service.",
        "guide keeper pin shank | square guide front/back wall.001":"Keeper rests on the guide top during service.",
        "guide keeper pin shank | square follower stem":"Stem bore settles onto keeper pin under return-spring load.",
        "capped far shaft end washer | shaft cap parking peg":"Cap washer seats against parking-peg end.",
    }
    unexpected={key:value for key,value in intersections.items() if key not in expected}
    result={"variant":model["variant"],"normal_phase_samples":samples,"service_stills":service_states,
            "minimum_actual_eye_pin_axis_dot":min(axis_dots),
            "blocked_eye_bores":blocked_eye_bores,"minimum_actual_eye_bore_radius":min(bore_radii),
            "minimum_eye_bore_to_pin_radial_clearance":min(bore_radii)-model["dimensions"].pivot_radius,
            "minimum_spring_wire_to_bracket_or_collar":min(spring_clearances),
            "cross_assembly_surface_intersections":intersections,
            "intentional_contact_explanations":{key:expected[key] for key in intersections if key in expected},
            "unexpected_cross_assembly_intersections":unexpected,
            "method_limits":["Creator implementation check, not independent acceptance.",
                             "Evaluated mesh triangle-surface BVH; no exhaustive containment or continuous-sweep certificate.",
                             "Spring clearance uses every polyline lead/hook/coil segment and modeled wire radius against bracket/collar boxes.",
                             "Maintenance stills declare manual support; no removal animation or force simulation."]}
    result["targeted_repair_checks_pass"]=not unexpected and not blocked_eye_bores and min(axis_dots)>.999999 and min(spring_clearances)>.001
    return result


def source_hashes():
    return {str(p.name):hashlib.sha256(p.read_bytes()).hexdigest() for p in
            [HERE/"cam_dragon.py",HERE/"scene_parts.py",HERE/"render_cam_dragon_proof.py",HERE/"contact_cam_dragon.py",Path(__file__).resolve()]}


def main():
    import bpy
    from cam_dragon import build_model,VARIANTS
    argv=sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else []
    parser=argparse.ArgumentParser();parser.add_argument("--samples",type=int,default=72)
    parser.add_argument("--variant",choices=[*VARIANTS,"both"],default="both")
    parser.add_argument("--output",type=Path,default=HERE.parents[2]/"runs/builder-study/3d-pilot-v2")
    args=parser.parse_args(argv);args.output.mkdir(parents=True,exist_ok=True)
    for variant in VARIANTS if args.variant=="both" else [args.variant]:
        bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
        model=build_model(variant,include_handle=True)
        result=check_model(model,args.samples)
        result["source_sha256"]=source_hashes()
        (args.output/(variant+"-repair-check.json")).write_text(json.dumps(result,indent=2)+"\n")
        print(variant,"axis",result["minimum_actual_eye_pin_axis_dot"],"spring mm",result["minimum_spring_wire_to_bracket_or_collar"]*1000)
        print(json.dumps(result["cross_assembly_surface_intersections"],indent=2))


if __name__=="__main__":main()
