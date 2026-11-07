"""Canonical hand crane. Metres; +x reaches over the load, +z is up.

Rigid parts only rotate/translate. Rope storage is an explicit single-layer helix
on a cylindrical drum. Ratchet pose is solved against the actual tooth polygon.
Masses below are declared design assumptions, not measured ratings. No structural,
friction, spring-force or child-use validation is claimed.
"""
from dataclasses import dataclass, asdict
import math

@dataclass(frozen=True)
class Dimensions:
    base_x: float=.400
    base_y: float=.300
    base_z: float=.020
    base_cx: float=-.070
    mast_x: float=-.120
    mast_top: float=.660
    hinge_z: float=.440
    tip_x: float=.500
    tip_z: float=.600
    support_front: float=.200
    support_rear: float=-.300
    winch_x: float=-.025
    drum_z: float=.165
    drum_radius: float=.025
    rope_radius: float=.00065
    rope_pitch: float=.0020
    pulley_radius: float=.023
    shaft_radius: float=.004
    bearing_bore: float=.0043
    maximum_lift: float=.360

DIMS=Dimensions()
VIEW={"location":(1.45,-2.0,1.25),"target":(.080,0,.320),"scale":1.02}
VIEWS={"three-quarter":VIEW,"side":{"location":(.08,-3,.32),"target":(.08,0,.32),"scale":1.02},
       "rear":{"location":(-2.5,-1.4,1.05),"target":(.08,0,.32),"scale":1.02}}
FRAME=["lc-base","lc-uprights","lc-braces","lc-boom","lc-stay","lc-pulley-wheel","lc-clevis","lc-feet"]
STATES={"lc-base":FRAME[:1],"lc-mast":FRAME[:2],"lc-braced":FRAME[:3],"lc-boom-frame":FRAME[:4],
        "lc-stayed":FRAME[:5],"lc-pulley-block":["lc-pulley-wheel","lc-clevis"],
        "lc-pulley-frame":FRAME[:7],"lc-wide-frame":FRAME,
        "lc-winch":["lc-drum","lc-crank-wheel"],
        "lc-winch-frame":FRAME+["lc-drum","lc-crank-wheel"],
        "lc-rigged":FRAME+["lc-drum","lc-crank-wheel","lc-rope"]}
STATES["lc-tipping"]=STATES["lc-rigged"]
STATES["lc-pawl-rigged"]=STATES["lc-rigged"]+["lc-pawl"]
STATES["lc-pawl-tipping"]=STATES["lc-pawl-rigged"]
STATES["lc-balanced"]=STATES["lc-rigged"]+["lc-ballast"]
STATES["lc-ratchet-frame"]=STATES["lc-balanced"]+["lc-pawl"]
STATES["lc-ballasted-unproven"]=STATES["lc-balanced"]
STATES["lc-pawl-ballasted-unproven"]=STATES["lc-ratchet-frame"]
STATES["lifting-crane"]=STATES["lc-ratchet-frame"]+["lc-basket"]
STATES["lift-supported-module"]=STATES["lc-ratchet-frame"]+["lift-crane-sling"]


def tooth_polygon(theta=0):
    points=[]
    for i in range(24):
        for fraction,r in [(0,.029),(.90,.034),(.90,.029)]:
            a=(i+fraction)*2*math.pi/24+theta
            points.append((r*math.cos(a),r*math.sin(a)))
    return points


def _segment_distance(p,a,b):
    d=[b[i]-a[i] for i in range(2)];den=sum(x*x for x in d)
    t=max(0,min(1,sum((p[i]-a[i])*d[i] for i in range(2))/den))
    return math.dist(p,[a[i]+t*d[i] for i in range(2)])


def _outside_distance(p,polygon):
    inside=False;x,z=p
    for a,b in zip(polygon,polygon[1:]+polygon[:1]):
        if (a[1]>z)!=(b[1]>z) and x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0]:inside=not inside
    result=min(_segment_distance(p,a,b) for a,b in zip(polygon,polygon[1:]+polygon[:1]))
    return -result if inside else result


def pawl_clearance(angle,theta):
    polygon=tooth_polygon(theta);q=(.047,.026);tip=(q[0]+.030*math.cos(angle),q[1]+.030*math.sin(angle))
    distances=[_outside_distance(q,polygon),_outside_distance(tip,polygon)]
    for a,b in zip(polygon,polygon[1:]+polygon[:1]):
        distances.extend([_segment_distance(a,q,tip),_segment_distance(b,q,tip)])
    return min(distances)-.0018


def pawl_angle(theta, released=False):
    if released:return -1.15
    polygon=tooth_polygon(theta);lo,hi=-2.8,-1.65
    for _ in range(55):
        a=(lo+hi)/2;p=(.047+.030*math.cos(a),.026+.030*math.sin(a))
        if pawl_clearance(a,theta)<0:lo=a
        else:hi=a
    return (lo+hi)/2


def rope_pose(lift=0,d=DIMS):
    """Geometric rope length conserved including changing fleet-angle lead length."""
    if not -1e-12<=lift<=d.maximum_lift+1e-12:raise ValueError("Lift outside model's 0–360 mm range")
    lift=max(0,min(d.maximum_lift,lift))
    r=d.drum_radius+d.rope_radius;R=d.pulley_radius
    D=(d.winch_x,d.drum_z);P=(d.tip_x,d.tip_z)
    dx,dz=P[0]-D[0],P[1]-D[1];distance=math.hypot(dx,dz)
    phi=math.atan2(dz,dx)+math.acos((r-R)/distance)
    normal=(math.cos(phi),math.sin(phi))
    def data(wind):
        stored=4*math.pi+wind;y=-.014+d.rope_pitch*stored/(2*math.pi)
        a=(D[0]+r*normal[0],y,D[1]+r*normal[1])
        b=(P[0]+R*normal[0],0,P[1]+R*normal[1])
        return stored,y,a,b,math.dist(a,b)
    initial=data(0);helix_r=math.hypot(r,d.rope_pitch/(2*math.pi))
    lo,hi=0,d.maximum_lift/helix_r+.02
    for _ in range(60):
        mid=(lo+hi)/2;v=data(mid)
        taken=mid*helix_r+v[4]-initial[4]
        if taken<lift:lo=mid
        else:hi=mid
    wind=(lo+hi)/2;stored,y,a,b,lead=data(wind)
    points=[]
    for i in range(241):
        t=stored*i/240;angle=phi-stored+t
        points.append((D[0]+r*math.cos(angle),-.014+d.rope_pitch*t/(2*math.pi),D[1]+r*math.sin(angle)))
    points.append(b)
    for i in range(1,65):
        angle=phi*(1-i/64)
        points.append((P[0]+R*math.cos(angle),0,P[1]+R*math.sin(angle)))
    hook_z=.160+lift
    points.append((P[0]+R,0,hook_z+.018))
    return {"points":points,"wind_angle":wind,"wheel_angle":-wind,"lead_length":lead,
            "hook":(P[0]+R,0,hook_z),"stored_helix_length":stored*helix_r,
            "rope_length":stored*helix_r+lead+R*phi+(P[1]-hook_z-.018),
            "fleet_angle":math.atan2(abs(y),math.hypot(dx,dz)),"drum_exit_y":y}


# Specified assumptions let the two demonstrations have opposite static signs.
# These are not inferred from the render colours or implied material densities.
ASSUMED_MASSES=[("base",.35,-.070),("mast, braces, pins",.35,-.120),
                ("boom, pulley and stay",.13,.190),("feet",.12,-.050),("winch",.16,-.025)]

def balance(load_mass,ballast=True,d=DIMS):
    rows=ASSUMED_MASSES+([("rear ballast",1.20,-.220)] if ballast else [])
    restoring=sum(m*(d.support_front-x) for _,m,x in rows)
    overturning=load_mass*(d.tip_x+d.pulley_radius-d.support_front)
    return {"load_kg_assumed":load_mass,"ballast_fitted":ballast,
            "restoring_kg_m":restoring,"overturning_kg_m":overturning,
            "net_restoring_Nm":9.81*(restoring-overturning),
            "combined_cg_x":(sum(m*x for _,m,x in rows)+load_mass*(d.tip_x+d.pulley_radius))/(sum(m for _,m,x in rows)+load_mass)}


def proof(samples=97,d=DIMS):
    poses=[rope_pose(d.maximum_lift*i/(samples-1),d) for i in range(samples)]
    contacts=[];reverse_angles=[]
    for p in poses:
        a=pawl_angle(p["wheel_angle"]);tip=(.047+.030*math.cos(a),.026+.030*math.sin(a))
        contacts.append(pawl_clearance(a,p["wheel_angle"]))
        reverse_angles.append(next((j*.1 for j in range(1,151) if pawl_clearance(a,p["wheel_angle"]+math.radians(j*.1))<-.000001),None))
    A=(d.mast_x,d.hinge_z);B=(d.tip_x-.085,d.tip_z)
    rope_clearances=[]
    for p in poses:
        U=(p["points"][240][0],p["points"][240][2]);V=(p["points"][241][0],p["points"][241][2])
        distance=min(_segment_distance(A,U,V),_segment_distance(B,U,V),_segment_distance(U,A,B),_segment_distance(V,A,B))
        rope_clearances.append(distance-.020-d.rope_radius)
    return {"minimum_rope_lead_to_conservative_20mm_boom_envelope_m":min(rope_clearances),"pulley_fork_axial_clearance_m":.010,"drum_flange_to_bearing_face_clearance_m":.004,"dimensions":asdict(d),"samples":samples,"maximum_rope_length_error_m":max(p["rope_length"] for p in poses)-min(p["rope_length"] for p in poses),
            "maximum_pawl_contact_error_m":max(abs(v) for v in contacts),"fixed_pawl_reverse_probe_deg_null_at_crest":reverse_angles,"ratchet_pitch_deg":15,"ratchet_probe_note":"At a tooth crest the fixed-pawl probe can be null: the bias spring must let the pawl close before the reverse tooth face catches. Spring force and holding capacity are not simulated.",
            "shaft_bearing_radial_clearance_m":d.bearing_bore-d.shaft_radius,
            "pulley_axle_radial_clearance_m":.00025,"maximum_fleet_angle_deg":max(p["fleet_angle"] for p in poses)*180/math.pi,
            "drum_helix_turn_pitch_minus_rope_diameter_m":d.rope_pitch-2*d.rope_radius,
            "test_without_ballast":balance(1.00,False,d),"test_with_ballast":balance(1.00,True,d),
            "assumed_mass_table_kg_and_x_m":ASSUMED_MASSES,
            "module_interface":{"maximum_transport_envelope_m":[.440,.306,.170],"hook_xy_m":[d.tip_x+d.pulley_radius,0],
                "hook_working_z_m":[.160,.520],"tip_underside_z_m":d.tip_z-.029,
                "sling_eye_positions_relative_tray_underside_m":[[-.075,0,.152],[.075,0,.152]],"sling_rise_m":.140,"tray_underside_at_max_hook_m":.210,"transported_mass_kg_assumed":.985,"module_balance":balance(.985,True,d),"hook_datum":"Hook centre; lower hook wire centre is18mm below; inner load-contact surface is16.6mm below",
                "warning":"Only compact c18 module; later whale extension struts absent. Assumed ballast stability is not a load rating."},
            "limitations":["Static moments use specified assumed masses; not weighed parts or a rated crane.","Tip pose is a prescribed 1.5 degree supported low demonstration, not free dynamics.",
                "No rope friction, ratchet strength, pawl spring rate, clamp force or material strength is simulated.","Rope mesh is a sampled helix; algebraic length uses the continuous curve."]}


def _cut(obj,cutter,operation="DIFFERENCE"):
    import bpy,bmesh
    cutter.parent=obj.parent
    for x in (obj,cutter):
        bm=bmesh.new();bm.from_mesh(x.data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(x.data);bm.free()
    bpy.context.view_layer.objects.active=obj;m=obj.modifiers.new("prepared receiving opening","BOOLEAN");m.operation=operation;m.object=cutter
    bpy.ops.object.modifier_apply(modifier=m.name);bpy.data.objects.remove(cutter,do_unlink=True)


def build_model(d=DIMS):
    import bpy
    import scene_parts as S
    from construction import Assembly
    a=Assembly("dimensioned lifting crane");bore_checks=[]
    assembly=S.empty("crane rigid frame tipping group");assembly.parent=a.root
    def add(part,obj,parent=assembly):return a.add(part,obj,parent)
    def box(part,name,c,s,color="birch",parent=assembly):return add(part,S.box(name,c,s,color),parent)
    def cyl(part,name,c,r,l,color="ink",axis="Y",parent=assembly):return add(part,S.cylinder(name,c,r,l,color,axis),parent)
    def line(part,name,p,r=.001,color="ink",parent=assembly):return add(part,S.stroke(name,p,r,color),parent)
    def bar(part,name,p,q,w,color="birch",parent=assembly):return add(part,S.rod(name,p,q,w,color),parent)
    def bore(obj,c,r,length,axis="Y"):
        bore_checks.append((obj,c,axis,length))
        _cut(obj,S.cylinder("receiving bore cutter",c,r,length,axis=axis))
    def pin(part,name,c,r=.0025,depth=.035):
        cyl(part,name+" shank",c,r,depth)
        for sign in [-1,1]:cyl(part,name+" retained head",(c[0],c[1]+sign*(depth/2+.001),c[2]),r*1.6,.002,"teal")
    def screw(part,name,c,depth=.026):
        cyl(part,name+" shank",c,.002,depth,axis="Z");cyl(part,name+" captive head",(c[0],c[1],c[2]+depth/2),.004,.003,"ink","Z")
    base=box("lc-base","base board with receiving sockets",(d.base_cx,0,.020),(d.base_x,d.base_y,d.base_z))
    # Feet bottom is the ground plane; hinges rotate around vertical bolts.
    for y in [-.135,.135]:
        # Each 12 mm rail seats in a real 2 mm underside rebate. The nominal
        # contact ceiling stays at z=12 mm; 0.2 mm side clearance leaves the
        # existing rail positions, ground plane and captive fasteners intact.
        _cut(base,S.box("prepared underside foot rail rebate",(d.base_cx,y,.009),(d.base_x+.002,.0304,.006)))
        foot=box("lc-feet","folding broad outrigger",(-.050,y,.006),(.500,.030,.012),"teal")
        for x in [-.210,.070]:
            bore(base,(x,y,.02),.0033,.06,"Z");bore(foot,(x,y,.006),.0033,.03,"Z")
            screw("lc-feet","captive foot pivot" if x<0 else "locking foot clip pin",(x,y,.017),.030)
    for y in [-.055,.055]:
        _cut(base,S.box("prepared mast socket",(d.mast_x,y,.027),(.0226,.0226,.030)))
        upright=box("lc-uprights","upright in prepared base socket",(d.mast_x,y,(.020+d.mast_top)/2),(.022,.022,d.mast_top-.020))
        screw("lc-uprights","mast captive mounting screw",(d.mast_x,y,.024),.030)
        lower=(-.225,y,.037);upper=(d.mast_x,y,.66*d.mast_top)
        bore(upright,upper,.0028,.035,"Y")
        foot=box("lc-braces","brace base mounting foot",(lower[0],y,.034),(.050,.028,.008),"teal")
        for x in [lower[0]-.019,lower[0]+.019]:
            bore(foot,(x,y,.034),.0023,.020,"Z");bore(base,(x,y,.020),.0023,.035,"Z");screw("lc-braces","brace captive base screw",(x,y,.023),.030)
        length=math.dist(lower,upper)
        brace=S.empty("rigid brace with parallel pin eyes");brace.parent=assembly;brace.location=lower;brace.rotation_euler.y=math.atan2(upper[0]-lower[0],upper[2]-lower[2])
        box("lc-braces","diagonal mast brace",(0,0,length/2),(.012,.006,length-.016),"birch",brace)
        for z in [0,length]:
            eye=add("lc-braces",S.annulus("brace end eye",(0,0,z),.008,.0028,.006,"teal"),brace)
        for c in [lower,upper]:
            bracket=box("lc-braces","brace end saddle",c,(.024,.025,.018),"teal")
            bore(bracket,c,.0028,.05,"Y");pin("lc-braces","brace captive cross pin",c,depth=.034)
    cross=box("lc-uprights","top crosspiece",(d.mast_x,0,d.mast_top-.012),(.024,.136,.024))
    box("lc-uprights","boom hinge lower crosspiece",(d.mast_x,0,d.hinge_z-.032),(.034,.132,.020),"teal")
    for y in [-.026,.026]:
        root_hinge=box("lc-uprights","boom root fork cheek",(d.mast_x,y,d.hinge_z-.009),(.034,.008,.045),"teal")
        bore(root_hinge,(d.mast_x,y,d.hinge_z),.0033,.018,"Y")
    # A real hinge is bored through end block; hollow beam skins retain fixed length.
    boom_end_x=d.tip_x-.085
    L=math.hypot(boom_end_x-d.mast_x,d.tip_z-d.hinge_z)
    boom=S.empty("fixed-length hollow boom");boom.parent=assembly;boom.location=(d.mast_x,0,d.hinge_z);boom.rotation_euler.y=-math.atan2(d.tip_z-d.hinge_z,boom_end_x-d.mast_x)
    for y in [-.013,.013]:
        web=box("lc-boom","hollow boom side web",(L/2,y,0),(L,.003,.026),"card",boom)
        for x in [0,L]:bore(web,(x,y,0),.0033,.012,"Y")
    for z in [-.0115,.0115]:box("lc-boom","hollow boom flange",(L/2,0,z),(L,.023,.003),"card",boom)
    for x in [0,L]:
        end=box("lc-boom","boom end bearing block",(x,0,0),(.026,.023,.020),"teal",boom)
        bore(end,(x,0,0),.0033,.05,"Y")
    pin("lc-boom","broad root hinge",(d.mast_x,0,d.hinge_z),.003,.104)
    # Hole in support eyes; fixed hooks visibly pass through them.
    for c,part in [((d.mast_x,0,d.mast_top+.012),"lc-uprights"),((d.tip_x-.085,0,d.tip_z+.013),"lc-boom")]:
        eye=add(part,S.annulus("support stay receiving eye",c,.008,.004,.004,"teal"))
        box(part,"stay eye mounting foot",(c[0],0,c[2]-.010),(.014,.018,.008),"teal")
    stayA=(d.mast_x,0,d.mast_top+.012);stayB=(d.tip_x-.085,0,d.tip_z+.013)
    line("lc-stay","fixed length support stay",[(stayA[0],-.006,stayA[2]),(stayB[0],-.006,stayB[2])],.0012)
    for c in [stayA,stayB]:
        # Captive hook crossbar through the receiving eye, with closed wire return.
        line("lc-stay","captive closed stay hook",[(c[0],-.005,c[2]),(c[0],.005,c[2]),(c[0]+.004,.006,c[2]+.004),(c[0]+.004,-.006,c[2]+.004),(c[0],-.005,c[2])],.0009)
    pulley=S.empty("tip pulley rotating Y");pulley.parent=assembly;pulley.location=(d.tip_x,0,d.tip_z)
    for y in [-.018,.018]:
        cheek=add("lc-clevis",S.profile("tip fork cheek",[(d.tip_x-.099,d.tip_z-.012),(d.tip_x+.010,d.tip_z-.012),(d.tip_x+.012,d.tip_z+.012),(d.tip_x-.099,d.tip_z+.012)],.004,y,"teal"))
        for x in [d.tip_x,d.tip_x-.085]:bore(cheek,(x,y,d.tip_z),.00325,.012,"Y")
    pin("lc-clevis","fork mounting pin through boom end socket",(d.tip_x-.085,0,d.tip_z),.003,.044)
    pin("lc-clevis","pulley captive axle",(d.tip_x,0,d.tip_z),.003,.044)
    # Central groove floor plus two retaining flanges, each genuinely bored.
    for y,r,width in [(0,d.pulley_radius-d.rope_radius,.006),(-.0045,.029,.003),(.0045,.029,.003)]:
        add("lc-pulley-wheel",S.annulus("grooved wheel",(0,y,0),r,.00325,width,"orange"),pulley)
    # Winch bracket feet include real base receiving holes.
    for y in [-.032,.032]:
        # Fuse each upright into its foot, overlapping by 4 mm. The bearing
        # support is one connected solid from the shaft bore to the base seat.
        bearing=box("lc-drum","drum bearing bracket",(d.winch_x,y,.1315),(.040,.010,.183),"teal")
        _cut(bearing,S.box("integral winch mounting foot",(d.winch_x,y,.037),(.064,.024,.014)),"UNION")
        bore(bearing,(d.winch_x,y,d.drum_z),d.bearing_bore,.03,"Y")
        for x in [d.winch_x-.027,d.winch_x+.027]:
            # Heads seat at z=44 mm and clear the upright by 3 mm; the nuts
            # bear beneath the base at z=10 mm. Both shank passages are real.
            bore(base,(x,y,.02),.0023,.05,"Z");bore(bearing,(x,y,.037),.0023,.04,"Z")
            screw("lc-drum","winch mounting screw",(x,y,.02625),.0385)
            nut=cyl("lc-drum","winch mounting underside nut",(x,y,.0085),.004,.003,"ink","Z")
            bore(nut,(x,y,.0085),.0021,.008,"Z")
    drum=S.empty("winch shaft Y");drum.parent=assembly;drum.location=(d.winch_x,0,d.drum_z)
    barrel=cyl("lc-drum","drum barrel",(0,0,0),d.drum_radius,.040,"birch","Y",drum)
    for y in [-.0215,.0215]:cyl("lc-drum","drum retaining flange",(0,y,0),.032,.003,"teal","Y",drum)
    cyl("lc-drum","round bearing shaft",(0,-.004,0),d.shaft_radius,.084,"ink","Y",drum)
    torque_end=box("lc-drum","square torque end",(0,-.06125,0),(.008,.0445,.008),"ink",drum)
    # The ratchet/crank stack is clamped between this integral rear shoulder
    # and a front washer. The screw enters a real blind shaft-end receiving bore.
    _cut(torque_end,S.cylinder("integral ratchet rear shoulder",(0,-.0495,0),.009,.003,axis="Y"),"UNION")
    _cut(torque_end,S.cylinder("blind shaft end screw bore",(0,-.079,0),.0021,.014,axis="Y"))
    # Probe the open bore before its intentional blind bottom at y=-72 mm.
    bore_checks.append((torque_end,(0,-.07925,0),"Y",.0135))
    anchor_point=rope_pose(0,d)["points"][0]
    anchor_angle=math.atan2(anchor_point[2]-d.drum_z,anchor_point[0]-d.winch_x)
    # Put the stud 3 mm behind the winding start, clear of the wound cord.
    # Its loop remains between the drum flanges; its fixed tail approaches the
    # outer side of the loop instead of beginning on the stud axis.
    anchor_y=-.017
    radial=lambda r:(r*math.cos(anchor_angle),anchor_y,r*math.sin(anchor_angle))
    _cut(barrel,S.rod("prepared radial anchor stud socket",radial(.020),radial(.029),.00125))
    bar("lc-drum","rope anchor stud",radial(.021),radial(.032),.0012,"ink",drum)
    bar("lc-drum","rope anchor stud retained head",radial(.032),radial(.033),.003,"teal",drum)
    # The supplied cord's closed anchor loop surrounds the stud, underneath its
    # retained head. This fixed tail/loop length is additional to rope_pose's
    # wound/lead/arc/drop length and remains constant at every winding phase.
    loop=[]
    for i in range(49):
        t=2*math.pi*i/48
        loop.append((.030*math.cos(anchor_angle)-.0021*math.sin(t)*math.sin(anchor_angle),
                     anchor_y+.0021*math.cos(t),
                     .030*math.sin(anchor_angle)+.0021*math.sin(t)*math.cos(anchor_angle)))
    line("lc-rope","closed cord anchor loop and fixed tail",[(anchor_point[0]-d.winch_x,-.014,anchor_point[2]-d.drum_z)]+loop,d.rope_radius,"orange",drum)
    wheel=add("lc-crank-wheel",S.profile("24 asymmetric ratchet teeth",tooth_polygon(),.006,-.054,"orange"),drum)
    _cut(wheel,S.box("actual square socket",(0,-.054,0),(.0083,.020,.0083)))
    crank=box("lc-crank-wheel","long hand crank",(.034,-.080,0),(.080,.007,.014),"teal",drum)
    _cut(crank,S.box("crank square socket",(0,-.080,0),(.0083,.020,.0083)))
    spacer=cyl("lc-crank-wheel","square-bored crank to ratchet spacer",(0,-.06675,0),.009,.0195,"teal","Y",drum)
    _cut(spacer,S.box("spacer square receiving bore",(0,-.06675,0),(.0083,.030,.0083)))
    add("lc-crank-wheel",S.annulus("crank shaft end retaining washer",(0,-.0845,0),.0075,.0022,.002,"teal"),drum)
    cyl("lc-crank-wheel","captive shaft end screw shank",(0,-.0795,0),.002,.013,"ink","Y",drum)
    cyl("lc-crank-wheel","captive shaft end screw head",(0,-.087,0),.0045,.003,"ink","Y",drum)
    # The grip pin passes through the crank plate, with an actual receiving
    # bore and rear retaining head. Sleeves close the axial gaps around the
    # free-turning grip without merging it into the pin.
    bore(crank,(.068,-.080,0),.0028,.020,"Y")
    cyl("lc-crank-wheel","free turning hand grip pin",(.068,-.0965,0),.0025,.043,"ink","Y",drum)
    grip=cyl("lc-crank-wheel","free turning hand grip",(.068,-.102,0),.008,.027,"orange","Y",drum)
    bore(grip,(.068,-.102,0),.0028,.040,"Y")
    for y in [-.119,-.0755]:cyl("lc-crank-wheel","grip retaining head",(.068,y,0),.004,.002,"ink","Y",drum)
    # 0.2 mm running end-clearance on each side leaves the grip free to turn.
    for y,depth in [(-.11685,.0023),(-.0859,.0048)]:
        add("lc-crank-wheel",S.annulus("hand grip axial spacing sleeve",(.068,y,0),.0045,.0028,depth,"teal"),drum)
    pawl_pivot=(d.winch_x+.047,-.054,d.drum_z+.026)
    mount=box("lc-pawl","pawl mounting bracket",(pawl_pivot[0],-.038,pawl_pivot[2]),(.016,.022,.050),"teal")
    # One continuous molded support reaches the base. Its two mounting holes
    # sit alongside the upright, leaving their head seats and driver access open.
    _cut(mount,S.box("pawl support stem",(pawl_pivot[0],-.027,.1325),(.013,.013,.185)),"UNION")
    _cut(mount,S.box("pawl support mounting foot",(.026,-.022,.036),(.034,.026,.012)),"UNION")
    bore(mount,(pawl_pivot[0],-.038,pawl_pivot[2]),.00225,.060,"Y")
    pin("lc-pawl","pawl retained pivot",(pawl_pivot[0],-.0383,pawl_pivot[2]),.002,.0356)
    for y in [-.027,-.017]:
        bore(mount,(.036,y,.036),.0023,.030,"Z")
        bore(base,(.036,y,.020),.0023,.040,"Z")
        screw("lc-pawl","pawl bracket base screw",(.036,y,.02525),.0365)
        nut=cyl("lc-pawl","pawl bracket underside nut",(.036,y,.0085),.004,.003,"ink","Z")
        bore(nut,(.036,y,.0085),.0021,.008,"Z")
    pawl=S.empty("pawl follows ratchet teeth");pawl.parent=assembly;pawl.location=pawl_pivot
    # A widened pivot boss leaves material around the 4.5 mm bore. The old
    # constant 3.6 mm arm was severed by that hole. Keep the contact envelope
    # unchanged: a 1.8 mm nose on the same 30 mm lever, now one continuous mesh.
    outline=[(-.018,-.0018),(-.006,-.0018),(-.0035,-.0045),(.0035,-.0045),(.006,-.0018),(.030,-.0018)]
    outline += [(.030+.0018*math.cos(t),.0018*math.sin(t)) for t in [-math.pi/2+math.pi*i/24 for i in range(1,25)]]
    outline += [(.006,.0018),(.0035,.0045),(-.0035,.0045),(-.006,.0018),(-.018,.0018)]
    pawl_bar=add("lc-pawl",S.profile("rigid pawl and release lever",outline,.004,0,"ink"),pawl)
    bore(pawl_bar,(0,0,0),.00225,.020,"Y")
    cyl("lc-pawl","torsion spring fixed anchor peg",(pawl_pivot[0]+.007,-.054,pawl_pivot[2]-.011),.0008,.012,"ink")
    cyl("lc-pawl","torsion spring fixed anchor retained head",(pawl_pivot[0]+.007,-.0605,pawl_pivot[2]-.011),.0017,.001,"teal")
    spring=line("lc-pawl","light pawl torsion spring",pawl_spring_points(-2.0,d),.00030)
    # Low ballast is positively retained to the base edge, not a floating block.
    box("lc-ballast","rear ballast block",(-.220,0,.060),(.090,.105,.060),"ink")
    line("lc-ballast","captive ballast clip",[(-.266,-.045,.015),(-.270,-.045,.091),(-.175,-.045,.091),(-.175,-.045,.030)],.002,"orange")
    rope=line("lc-rope","single continuous lifting cord",rope_pose(0,d)["points"],d.rope_radius,"orange")
    hook=S.empty("closed lifting hook");hook.parent=a.root
    # Hook consists of a closed oval wire, and a spring gate at its side.
    line("lc-rope","closed snap hook",[(.010*math.sin(t),0,.018*math.cos(t)) for t in [2*math.pi*i/64 for i in range(65)]],.0014,"ink",hook)
    line("lc-rope","snap gate",[(.009,0,-.005),(.009,0,.007)],.0015,"teal",hook)
    basket=S.empty("basket suspended from closed hook");basket.parent=a.root
    box("lc-basket","basket bottom",(0,0,-.085),(.110,.090,.006),"card",basket)
    for y in [-.044,.044]:box("lc-basket","basket long side",(0,y,-.067),(.110,.004,.036),"card",basket)
    for x in [-.053,.053]:box("lc-basket","basket end",(x,0,-.067),(.004,.084,.036),"card",basket)
    line("lc-basket","basket lifting loop",[(-.050,0,-.051),(-.023,0,-.012),(0,0,-.016),(.023,0,-.012),(.050,0,-.051)],.002,"teal",basket)
    for x,y in [(-.025,-.019),(.024,.020),(.022,-.021)]:box("lc-basket","light play block",(x,y,-.071),(.026,.026,.023),"orange",basket)
    weight=S.empty("padded test weight");weight.parent=a.root
    box("lc-test-load","padded test weight",(0,0,-.045),(.105,.090,.055),"teal",weight)
    line("lc-test-load","closed weight lifting loop",[(.018*math.sin(t),0,-.012+.020*math.cos(t)) for t in [2*math.pi*i/48 for i in range(49)]],.002,"ink",weight)
    sling=S.empty("c18 detachable four-leg sling");sling.parent=a.root
    line("lift-crane-sling","closed central sling eye",[(0,-.005,-.0157),(0,.005,-.0157),(0,.005,-.038),(0,-.005,-.038),(0,-.005,-.0157)],.0009,"teal",sling)
    for x in [-.075,.075]:
        line("lift-crane-sling","short module sling leg",[(0,0,-.038),(x,0,-.144)],.0015,"ink",sling)
        line("lift-crane-sling","closed sling end link",[(x,-.004,-.1548),(x,.004,-.1548),(x,.004,-.144),(x,-.004,-.144),(x,-.004,-.1548)],.0008,"teal",sling)
    result=a.result(bore_checks=bore_checks,frame=assembly,drum=drum,pulley=pulley,pawl=pawl,pawl_spring=spring,rope=rope,hook=hook,basket=basket,test_weight=weight,sling=sling,view=VIEW,views=VIEWS,dimensions=d)
    apply_pose(result,.12);set_state(result,"lifting-crane")
    return result


def pawl_spring_points(angle,d=DIMS):
    x,z=d.winch_x+.047,d.drum_z+.026
    # Closed terminal eye surrounds the fixed peg below its retaining head.
    # The outgoing leg leaves radially toward the coil, clear of the peg.
    start=math.atan2(.011,-.0035)
    points=[(x+.007+.0012*math.cos(start+2*math.pi*i/32),-.0595,z-.011+.0012*math.sin(start+2*math.pi*i/32)) for i in range(33)]
    points.append((x+.0035,-.0595,z))
    for i in range(97):
        t=i/96;a=8*math.pi*t
        points.append((x+.0035*math.cos(a),-.0595-.003*t,z+.0035*math.sin(a)))
    points.extend([(x-.014*math.cos(angle),-.0625,z-.014*math.sin(angle)),
                   (x-.014*math.cos(angle),-.0563,z-.014*math.sin(angle))])
    return points


def apply_pose(model,lift=.12,released=False,tip_degrees=0):
    import bpy
    from mathutils import Vector
    d=model["dimensions"];p=rope_pose(lift,d)
    frame=model["frame"];angle=math.radians(tip_degrees)
    frame.rotation_euler.y=angle
    pivot=Vector((d.support_front,0,0));frame.location=pivot-frame.rotation_euler.to_matrix()@pivot
    model["drum"].rotation_euler.y=p["wind_angle"]
    model["pulley"].rotation_euler.y=lift/d.pulley_radius
    a=pawl_angle(p["wheel_angle"],released)
    model["pawl"].rotation_euler.y=-a
    for point,co in zip(model["pawl_spring"].data.splines[0].points,pawl_spring_points(a,d)):point.co=(*co,1)
    for point,co in zip(model["rope"].data.splines[0].points,p["points"]):point.co=(*co,1)
    bpy.context.view_layer.update()
    # Gravity keeps the free leg vertical while the rigid crane tips. Its last
    # pulley contact shifts around the circular rim; pay the exact arc change
    # into the drop so neither the flexible cord nor a rigid part is stretched.
    pulley_center=frame.matrix_local@Vector((d.tip_x,0,d.tip_z))
    outlet=pulley_center+Vector((d.pulley_radius,0,0))
    drop=d.tip_z-p["hook"][2]+d.pulley_radius*angle
    hook=outlet-Vector((0,0,drop))
    phi=math.atan2(p["points"][241][2]-d.tip_z,p["points"][241][0]-d.tip_x)
    for i in range(1,65):
        t=phi+(angle-phi)*i/64
        model["rope"].data.splines[0].points[241+i].co=(d.tip_x+d.pulley_radius*math.cos(t),0,d.tip_z+d.pulley_radius*math.sin(t),1)
    endpoint=frame.matrix_local.inverted()@(hook+Vector((0,0,.018)))
    model["rope"].data.splines[0].points[-1].co=(*endpoint,1)
    # Load stays vertical in world while rigid frame undergoes supported low tilt.
    for key in ["hook","basket","test_weight","sling"]:model[key].location=hook
    if "payload" in model:model["payload"]["root"].location=hook+Vector((0,0,-.310))
    model["pose"]=dict(p,released=released,tip_degrees=tip_degrees,actual_hook_in_root=list(hook))
    return model["pose"]


def set_state(model,identity,include_test=False):
    from construction import set_visible_parts
    if identity not in STATES and identity not in model["parts"]:raise ValueError("Unknown crane identity: "+identity)
    parts=STATES.get(identity,[identity])
    if include_test or identity in ["lc-tipping","lc-pawl-tipping"]:parts=parts+["lc-test-load"]
    set_visible_parts(model,parts)
    apply_pose(model,.015 if "tipping" in identity else .12,tip_degrees=1.5 if "tipping" in identity else 0)
    model["identity"]=identity
    return model


def attach_module(model):
    """Optional c18 reward composition. Literal sling-preparation state stays empty.

    Compact module's tray underside is310mm below hook-centre datum:18mm to
    hook wire centre,140mm nominal rise,152mm module-eye height.
    Actual wire-surface contacts are16.6mm below hook centre and3.2mm above
    module-eye centre; the closed wire links seat on those prepared bores. Never scale it.
    Calling set_state afterward hides this optional load along with other parts.
    """
    set_state(model,"lift-supported-module")
    if "payload" not in model:
        from lift_module import build_model as build_lift
        payload=build_lift(state="balanced-lift",configuration="compact",include_stand=False)
        payload["root"].parent=model["root"];model["payload"]=payload
        model["payload_visible"]=[obj for objects in payload["parts"].values() for obj in objects if not obj.hide_render]
        for part,objects in payload["parts"].items():model["parts"].setdefault(part,[]).extend(objects)
    else:payload=model["payload"]
    # The lift factory owns which original parts survive compact transport.
    for obj in model["payload_visible"]:obj.hide_render=False;obj.hide_set(False)
    apply_pose(model,model["dimensions"].maximum_lift)
    return payload
