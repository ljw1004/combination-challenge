"""Dimensioned belt-driven string-wave machine; metres, z up, cord along x.

The driver is a real eccentric with a free swivel, never a sliding cord through
an axle. Flexible cord length is conserved by solving the spring endpoint.
Wave shapes are prescribed illustrations of driven/standing/plucked modes, not
solutions of a measured string's force equation. No sound level or motor rating
is inferred from this geometry. The rigid bridge has separate parked/engaged poses.
"""
from dataclasses import dataclass,asdict
import math

@dataclass(frozen=True)
class Dimensions:
    base_length: float=.650
    base_depth: float=.180
    base_top: float=.018
    cord_start: float=-.212
    cord_length: float=.442
    driver_x: float=-.263
    driver_z: float=.140
    eccentricity: float=.004
    driver_radius: float=.028
    motor_radius: float=.010
    motor_y: float=-.030
    motor_z: float=.065
    cord_radius: float=.00045
    spring_anchor: float=.271
    spring_free_span: float=.026
    bridge_top: float=.146
    soundbox_top: float=.098

DIMS=Dimensions()
VIEW={"location":(.9,-1.25,.9),"target":(0,0,.078),"scale":.78}
VIEWS={"three-quarter":VIEW,"side":{"location":(0,-2,.22),"target":(0,0,.090),"scale":.76},
       "drive":{"location":(-.92,-.75,.50),"target":(-.225,0,.105),"scale":.31}}
CHAIN=["wm-base","wm-mounted-motor","wm-driver","wm-belt","wm-cord","wm-spring","wm-guard","wm-controller"]
STATES={k:CHAIN[:i+1] for i,k in enumerate(["wm-base","wm-motor-frame","wm-driver-frame","wm-belt-frame","wm-cord-frame","wm-tensioned","wm-guarded","wm-running"])}
STATES["wm-marked"]=CHAIN+["wm-rider"]
STATES["wm-looping"]=STATES["wm-marked"]
STATES["wm-bridged"]=STATES["wm-marked"]+["wm-bridge"]
STATES["wave-machine"]=STATES["wm-bridged"]


def belt_path(d=DIMS,n=64):
    """Exact external common tangents and minor/major wrap arcs in the y/z plane."""
    A=(d.motor_y,d.motor_z);B=(0,d.driver_z);r=d.motor_radius;R=d.driver_radius
    dy,dz=B[0]-A[0],B[1]-A[1];distance=math.hypot(dy,dz)
    heading=math.atan2(dz,dy);alpha=math.acos((r-R)/distance)
    upper=heading+alpha;lower=heading-alpha
    points=[]
    # Clockwise arc around small pulley away from the large pulley.
    sweep=(lower-upper)%(2*math.pi)
    for i in range(n+1):
        angle=upper+sweep*i/n
        points.append((d.driver_x,A[0]+r*math.cos(angle),A[1]+r*math.sin(angle)))
    # Next big-wheel contact is on the lower tangent.
    points.append((d.driver_x,B[0]+R*math.cos(lower),B[1]+R*math.sin(lower)))
    big_sweep=(upper-lower)%(2*math.pi)
    for i in range(1,n+1):
        angle=lower+big_sweep*i/n
        points.append((d.driver_x,B[0]+R*math.cos(angle),B[1]+R*math.sin(angle)))
    points.append(points[0])
    return points


def _length(points):return sum(math.dist(a,b) for a,b in zip(points,points[1:]))


def _at_length(points,fraction):
    remaining=_length(points)*fraction
    for a,b in zip(points,points[1:]):
        length=math.dist(a,b)
        if remaining<=length:return tuple(a[i]+remaining/length*(b[i]-a[i]) for i in range(3))
        remaining-=length
    return points[-1]


def solve_pose(theta=0,mode="standing",bridge_x=.095,amplitude=.014,anchor=None,d=DIMS,n=240):
    if mode not in {"standing","travelling","stopped","plucked","loose","bridged","idle"}:raise ValueError(mode)
    if not -.015<=bridge_x<=.170:raise ValueError("Bridge must remain on soundbox top")
    anchor=d.spring_anchor if anchor is None else anchor
    if not .264<=anchor<=.272:raise ValueError("Tension screw outside marked geometric travel")
    if mode in {"stopped","plucked"}:theta=math.pi/2
    y0=d.eccentricity*math.cos(theta);z0=d.driver_z+d.eccentricity*math.sin(theta)
    def candidate(end):
        pts=[]
        bridge_u=(bridge_x-d.cord_start)/(end-d.cord_start)
        for i in range(n+1):
            u=i/n;x=d.cord_start+(end-d.cord_start)*u
            y=y0*(1-u);z=z0*(1-u)+d.driver_z*u
            if mode in {"standing","travelling"}:
                wave=math.sin(2*math.pi*u)*math.sin(theta) if mode=="standing" else math.sin(4*math.pi*u-theta)*math.sin(math.pi*u)
                z+=amplitude*wave
            elif mode=="loose":
                z=z0*(1-u)+(d.soundbox_top+d.cord_radius)*u-.025*math.sin(math.pi*u)
                if -.050<=x<=.230:z=max(z,d.soundbox_top+d.cord_radius)
            elif mode in {"stopped","plucked","bridged"}:
                if u<=bridge_u:
                    q=u/bridge_u;y=y0*(1-q);z=z0*(1-q)+d.bridge_top*q
                    if mode=="plucked":z+=amplitude*(2*q if q<.5 else 2*(1-q))
                    if mode=="bridged":z+=.005*math.sin(math.pi*q)*math.sin(3*theta)
                else:
                    q=(u-bridge_u)/(1-bridge_u);y=0;z=d.bridge_top*(1-q)+d.driver_z*q
            pts.append((x,y,z))
        # Insert exact bridge contact in the material curve, even off sample grid.
        if mode in {"stopped","plucked","bridged"}:
            j=int(bridge_u*n)+1;pts.insert(j,(bridge_x,0,d.bridge_top))
        return pts
    lo,hi=.200,.256
    for _ in range(60):
        end=(lo+hi)/2
        if _length(candidate(end))>d.cord_length:hi=end
        else:lo=end
    points=candidate((lo+hi)/2)
    end=points[-1];span=anchor-end[0]
    return {"theta":theta,"mode":mode,"cord_points":points,"cord_length":_length(points),
            "swivel":points[0],"spring_start":end,"spring_end":(anchor,0,d.driver_z),
            "spring_span":span,"spring_extension":span-d.spring_free_span,
            "rider":_at_length(points,.42),"bridge_x":bridge_x,
            "bridge_engaged":mode in {"stopped","plucked","bridged"},
            "motor_angle":theta*d.driver_radius/d.motor_radius,"driver_angle":theta,
            "powered":mode in {"standing","travelling","bridged"}}


def spring_points(start,end,n=160):
    span=end[0]-start[0];points=[]
    # Closed hook in XZ threads the cord's XY end loop.
    for i in range(33):
        a=2*math.pi*i/32
        points.append((start[0]-.001+.0025*math.cos(a),0,start[2]+.0025*math.sin(a)))
    for i in range(n+1):
        t=i/n;a=2*math.pi*12*t
        points.append((start[0]+.005+(span-.010)*t,.0023*math.sin(a),start[2]+.0023*math.cos(a)))
    # The far XY hook passes through the Y-axis anchor eye without crossing it.
    points.append((end[0]-.005,0,end[2]))
    for i in range(33):
        a=math.pi+2*math.pi*i/32
        points.append((end[0]-.0025+.0025*math.cos(a),.0025*math.sin(a),end[2]))
    return points


def proof(samples=96,d=DIMS):
    poses=[solve_pose(2*math.pi*i/samples,mode,d=d) for mode in ["standing","travelling"] for i in range(samples)]
    poses += [solve_pose(mode=mode,bridge_x=x,amplitude=a,d=d) for mode in ["stopped","plucked"] for x in [-.015,.095,.170] for a in [0,.006]]
    return {"dimensions":asdict(d),"samples":len(poses),"max_cord_length_error_m":max(abs(p["cord_length"]-d.cord_length) for p in poses),
            "spring_span_range_m":[min(p["spring_span"] for p in poses),max(p["spring_span"] for p in poses)],
            "minimum_spring_extension_m":min(p["spring_extension"] for p in poses),
            "minimum_cord_soundbox_top_clearance_m":min(q[2]-d.cord_radius-d.soundbox_top for p in poses for q in p["cord_points"] if -.05<q[0]<.23),
            "driver_shaft_bore_radial_clearance_m":.00025,"swivel_radial_clearance_m":.0002,
            "driver_to_motor_speed_ratio":d.motor_radius/d.driver_radius,
            "guard_cord_opening_radial_clearance_m":.012-d.eccentricity-.003,
            "bridge_v_notch_side_slope":1.25,"bridge_roof_fall_per_x":1.5,"bridge_cord_cross_section_tangent_clearance_m":0,"rider_material_fraction":.42,"modes":["standing","travelling","bridged","stopped","plucked","loose","idle"],
            "limitations":["Prescribed curve modes and amplitude, not measured resonance, frequencies, wave speed or sound output.",
               "Cord has fixed sampled arc length; spring takes up endpoint motion. Elastic extension of nylon is omitted.",
               "Spring force/rate, motor torque/current, belt traction and acoustic coupling are unmeasured.",
               "Transparent guard has real openings and fixed clearances; this is no accessibility or child-safety certification.",
               "Stopped/plucked poses lock drive phase for illustration; actual motor detent/friction is not specified."]}


def _cut(obj,cutter):
    import bpy,bmesh
    cutter.parent=obj.parent
    for ob in [obj,cutter]:
        bm=bmesh.new();bm.from_mesh(ob.data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(ob.data);bm.free()
    bpy.context.view_layer.objects.active=obj;m=obj.modifiers.new("actual receiving hole","BOOLEAN");m.operation="DIFFERENCE";m.object=cutter
    bpy.ops.object.modifier_apply(modifier=m.name);bpy.data.objects.remove(cutter,do_unlink=True)


def build_model(d=DIMS):
    import bpy
    import scene_parts as S
    from construction import Assembly,special_material,surface
    a=Assembly("dimensioned string wave machine");bore_checks=[]
    def box(part,name,c,s,color="birch",parent=None):return a.box(part,name,c,s,color,parent)
    def cyl(part,name,c,r,l,color="ink",axis="X",parent=None):return a.cylinder(part,name,c,r,l,color,axis,parent)
    def line(part,name,pts,r=.0006,color="ink",parent=None):return a.line(part,name,pts,r,color,parent)
    def bore(obj,c,r,l,axis="X"):
        bore_checks.append((obj,c,axis,l))
        _cut(obj,S.cylinder("receiving bore",c,r,l,axis=axis))
    def screw(part,name,c):
        cyl(part,name+" shank",c,.0015,.014,"ink","Z");cyl(part,name+" retained head",(c[0],c[1],c[2]+.007),.003,.002,"ink","Z")
    base=box("wm-base","long board",(0,0,.012),(d.base_length,d.base_depth,.012))
    for x in [-.290,.290]:
        for y in [-.066,.066]:box("wm-base","supplied soft foot pad",(x,y,.003),(.030,.030,.006),"ink")
    # Hollow resonator: actual air cavity and thin soundboard with an open sound hole.
    box("wm-base","soundbox bottom",(.090,0,.020),(.280,.080,.004))
    for y in [-.038,.038]:box("wm-base","soundbox side",(.090,y,.060),(.280,.004,.076))
    for x in [-.048,.228]:box("wm-base","soundbox end",(x,0,.060),(.004,.072,.076))
    soundboard=box("wm-base","thin resonant soundboard",(.090,0,.097),(.280,.080,.002),"card")
    bore(soundboard,(.180,.022,.097),.010,.010,"Z")
    for x in [-.040,.220]:
        for y in [-.046,.046]:box("wm-base","soundbox base retaining clip",(x,y,.022),(.018,.014,.008),"teal")
    # Real driver shaft bearing on supplied post; hole and retaining heads visible.
    post=box("wm-base","driver end post",(-.286,0,.081),(.016,.023,.126),"birch")
    bore(post,(-.286,0,d.driver_z),.00325,.030)
    endpost=box("wm-base","adjustable anchor post",(.286,0,.084),(.014,.027,.132))
    bore(endpost,(.286,0,d.driver_z),.0023,.030)
    for x in [-.286,.286]:screw("wm-base","end post captive base screw",(x,0,.024))
    # Tension screw with actual thread surrogate, captive shoulder and closed eye.
    anchor=cyl("wm-base","captive adjustment screw",(.295,0,d.driver_z),.002,.040)
    knob=cyl("wm-base","tension adjusting knob",(.316,0,d.driver_z),.006,.008,"orange")
    _cut(knob,S.box("prepared key socket",(.318,0,d.driver_z),(.010,.0032,.0032)))
    # Enlarged end eye and knob retain the screw on either side of the post.
    for x in [.278,.294]:
        nut=cyl("wm-base","fixed threaded post insert",(x,0,d.driver_z),.004,.002,"ink")
        bore(nut,(x,0,d.driver_z),.00205,.010)
    anchor_eye=a.add("wm-base",S.annulus("anchor closed eye",(.271,0,d.driver_z),.004,.002,.002,"teal"))
    # Motor body, isolators, keyed cradle foot screws, retaining strap and plug.
    motorbody=cyl("wm-mounted-motor","enclosed low voltage motor",(-.295,d.motor_y,d.motor_z),.016,.040,"ink")
    cradle=box("wm-mounted-motor","motor cradle",(-.295,d.motor_y,.034),(.048,.040,.008),"teal")
    seat=box("wm-mounted-motor","concave motor saddle",(-.295,d.motor_y,.048),(.042,.036,.020),"teal")
    bore(seat,(-.295,d.motor_y,d.motor_z),.016,.060)
    for x in [-.310,-.280]:
        for y in [d.motor_y-.014,d.motor_y+.014]:
            pad=box("wm-mounted-motor","soft isolation mount",(x,y,.024),(.009,.009,.012),"ink")
            bore(base,(x,y,.012),.0017,.030,"Z");bore(cradle,(x,y,.034),.0017,.025,"Z");bore(pad,(x,y,.024),.0017,.022,"Z");screw("wm-mounted-motor","motor captive mounting screw",(x,y,.025))
    line("wm-mounted-motor","fitted motor retaining strap",[(-.295,d.motor_y-.019,.035),(-.295,d.motor_y-.019,.068),(-.295,d.motor_y,.083),(-.295,d.motor_y+.019,.068),(-.295,d.motor_y+.019,.035)],.002,"teal")
    motor=S.empty("motor shaft axis X");motor.parent=a.root;motor.location=(-.263,d.motor_y,d.motor_z)
    cyl("wm-mounted-motor","motor output shaft",(-.009,0,0),.0015,.024,"ink","X",motor)
    motorpulley=cyl("wm-mounted-motor","motor pulley groove floor",(0,0,0),d.motor_radius-.0007,.006,"orange","X",motor)
    bore(motorpulley,(0,0,0),.0015,.012)
    for x in [-.004,.004]:cyl("wm-mounted-motor","motor pulley retaining flange",(x,0,0),d.motor_radius+.002,.002,"orange","X",motor)
    driver=S.empty("driver wheel about X");driver.parent=a.root;driver.location=(d.driver_x,0,d.driver_z)
    cyl("wm-driver","driver bearing shaft",(-.015,0,0),.003,.047,"ink","X",driver)
    for x in [-.040,.004]:cyl("wm-driver","driver captive shaft head",(x,0,0),.005,.002,"ink","X",driver)
    for x,r,width in [(0,d.driver_radius-.0007,.006),(-.004,d.driver_radius+.002,.002),(.004,d.driver_radius+.002,.002)]:
        wheel=cyl("wm-driver","driver pulley",(x,0,0),r,width,"teal","X",driver)
        bore(wheel,(x,0,0),.003,.015)
    peg=cyl("wm-driver","captive eccentric swivel peg",(.022,d.eccentricity,0),.0012,.034,"ink","X",driver)
    for x in [.008,.040]:cyl("wm-driver","swivel peg retained shoulder",(x,d.eccentricity,0),.002,.002,"ink","X",driver)
    swivel=S.empty("free swivel translates without following shaft spin");swivel.parent=a.root
    collar=cyl("wm-driver","free swivel sleeve",(-.011,0,0),.003,.006,"orange","X",swivel)
    bore(collar,(-.011,0,0),.0014,.014)
    eye=a.add("wm-driver",S.annulus("swivel cord eye",(0,0,0),.003,.0014,.002,"orange"),swivel)
    # Short connector does not occupy either sleeve or eye bore.
    box("wm-driver","swivel eye bridge",(-.006,0,-.0035),(.008,.002,.0015),"orange",swivel)
    belt=line("wm-belt","continuous soft drive belt",belt_path(d),.0007,"ink")
    p=solve_pose(d=d)
    cord=line("wm-cord","fixed-length nylon cord",p["cord_points"],d.cord_radius,"orange")
    spring=line("wm-spring","extension spring with closed end links",spring_points(p["spring_start"],p["spring_end"]),.00022,"ink")
    # Actual cord loop geometry is supplied with the cord; end hooks travel with it.
    loops=[]
    for label in ["driver","spring"]:
        loop=line("wm-cord",label+" prepared cord loop",[(-.0035+.0035*math.cos(t),.0035*math.sin(t),0) for t in [2*math.pi*i/32 for i in range(33)]],.00035,"orange")
        loops.append(loop)
    # Transparent walls, genuine circular cord opening and electrical slot.
    glass=special_material("wave guard clear polycarbonate",(.57,.78,.82),roughness=.10,transmission=.88)
    guards=[]
    walls=[("front",(-.232,-.012,.103),(.002,.110,.152)),("back",(-.322,-.012,.103),(.002,.110,.152)),
           ("top",(-.277,-.012,.179),(.092,.110,.002)),("left",(-.277,-.067,.103),(.092,.002,.152)),
           ("right",(-.277,.043,.103),(.092,.002,.152))]
    for label,c,size in walls:
        wall=box("wm-guard","clear guard "+label,c,size,"paper")
        if label=="front":
            bore(wall,(-.232,0,d.driver_z),.012,.015)
            _cut(wall,S.box("plug slot",(-.232,-.040,.040),(.015,.018,.014)))
        surface(wall,glass);guards.append(wall)
    for x in [-.315,-.239]:
        for y in [-.065,.041]:box("wm-guard","snap mounting foot",(x,y,.024),(.012,.007,.012),"teal")
    controller=box("wm-controller","battery and speed controller",(-.137,.055,.036),(.092,.052,.036),"teal")
    switch=box("wm-controller","off on switch",(-.160,.055,.058),(.014,.018,.007),"ink")
    dial=cyl("wm-controller","speed dial",(-.115,.055,.059),.010,.009,"orange","Z")
    line("wm-controller","insulated controller lead",[(-.184,.043,.035),(-.210,.035,.030),(-.223,-.040,.040)],.0015,"ink")
    box("wm-controller","keyed electrical plug",(-.225,-.040,.040),(.014,.014,.010),"orange")
    line("wm-mounted-motor","motor insulated lead",[(-.315,d.motor_y,.065),(-.313,-.052,.040),(-.239,-.040,.040)],.0013,"ink")
    for x in [-.175,-.105]:box("wm-controller","controller retaining clip",(x,.055,.023),(.010,.058,.012),"ink")
    # Bridge is cut with a real groove; its foot contacts the soundboard when used.
    bridge=S.empty("removable bridge");bridge.parent=a.root
    # A pitched ridge with an actual V-notch supports one cord contact point.
    # The roof falls away in x, so the outgoing sloping cord does not tunnel
    # through a long flat groove. V faces are tangent to the cord's cross-section.
    xs=[-.007,0,.007];ys=[-.0275,-.0012,0,.0012,.0275];slope=1.25
    valley=.048-d.cord_radius*math.sqrt(1+slope*slope)
    verts=[(x,y,0) for x in xs for y in ys]
    verts += [(x,y,valley+min(abs(y),.0012)*slope-1.5*abs(x)) for x in xs for y in ys]
    faces=[]
    for i in range(2):
        for j in range(4):
            k=i*5+j;faces.extend([(k,k+1,k+6,k+5),(15+k,20+k,21+k,16+k)])
    boundary=[0,1,2,3,4,9,14,13,12,11,10,5]
    for u,v in zip(boundary,boundary[1:]+boundary[:1]):faces.append((u,u+15,v+15,v))
    mesh=bpy.data.meshes.new("bridge receiving notch");mesh.from_pydata(verts,[],faces);mesh.update()
    body=bpy.data.objects.new("pitched bridge with open V notch",mesh);bpy.context.collection.objects.link(body)
    body.data.materials.append(S.material("card"));a.add("wm-bridge",body,bridge)
    for y in [-.020,.020]:box("wm-bridge","bridge foot",(0,y,.001),(.020,.012,.002),"card",bridge)
    rider=S.empty("paper rider at fixed cord material fraction");rider.parent=a.root
    line("wm-rider","loose soft rider clip",[(0,.002*math.cos(t),.002*math.sin(t)) for t in [2*math.pi*i/32 for i in range(33)]],.0003,"teal",rider)
    box("wm-rider","folded paper flag",(0,.002,.007),(.010,.0003,.012),"paper",rider)
    # Supplied base clips park bridge and pick; neither intersects the resonator.
    box("wm-base","bridge parking cradle floor",(-.050,.066,.020),(.065,.024,.004),"teal")
    for x in [-.081,-.019]:box("wm-base","bridge parking clip jaw",(x,.066,.028),(.005,.024,.016),"teal")
    pick=S.empty("pick parked on base");pick.parent=a.root
    pickobj=a.add("wm-pick",S.profile("broad soft plectrum",[(-.012,0),(.012,0),(.008,.024),(-.008,.024)],.001,0,"orange"),pick)
    pick.location=(.240,.064,.021);pick.rotation_euler.x=math.pi/2
    for x in [.229,.251]:box("wm-base","pick parking clip",(x,.053,.022),(.007,.018,.008),"teal")
    # The tension key is a separate preserved tool, never an invisible fitted part.
    key=box("wm-tension-key","blunt key square shaft",(.310,.065,.025),(.025,.0028,.0028),"ink")
    box("wm-tension-key","tension key cross handle",(.323,.065,.025),(.005,.025,.006),"orange")
    result=a.result(switch=switch,bore_checks=bore_checks,cord=cord,spring=spring,cord_loops=loops,driver=driver,motor=motor,swivel=swivel,bridge=bridge,rider=rider,guard=guards,
                    pick=pick,tension_key=key,anchor_eye=anchor_eye,tension_screw=anchor,tension_knob=knob,view=VIEW,views=VIEWS,dimensions=d)
    apply_pose(result,0);set_state(result,"wave-machine")
    return result


def _replace_curve(obj,points):
    # Counts differ for bridge insertion. Rebuild only flexible spline data.
    spline=obj.data.splines[0]
    if len(spline.points)!=len(points):
        obj.data.splines.remove(spline);spline=obj.data.splines.new("POLY");spline.points.add(len(points)-1)
    for p,co in zip(spline.points,points):p.co=(*co,1)


def apply_pose(model,theta=0,mode="standing",bridge_x=.095,amplitude=.014,anchor=None):
    import bpy
    d=model["dimensions"];p=solve_pose(theta,mode,bridge_x,amplitude,anchor=anchor,d=d)
    model["driver"].rotation_euler.x=p["driver_angle"]
    model["motor"].rotation_euler.x=p["motor_angle"]
    model["swivel"].location=(p["swivel"][0]-.007,p["swivel"][1],p["swivel"][2])
    _replace_curve(model["cord"],p["cord_points"])
    _replace_curve(model["spring"],spring_points(p["spring_start"],p["spring_end"]))
    for ob,co in zip(model["cord_loops"],[p["swivel"],p["spring_start"]]):ob.location=co
    model["rider"].location=p["rider"]
    offset=p["spring_end"][0]-d.spring_anchor
    model["anchor_eye"].location.x=offset
    model["tension_screw"].location.x=.295+offset
    model["tension_knob"].location.x=.316+offset
    bridge=model["bridge"]
    if p["bridge_engaged"]:bridge.location=(bridge_x,0,d.soundbox_top);bridge.rotation_euler=(0,0,0)
    else:bridge.location=(-.050,.066,.022);bridge.rotation_euler=(0,0,math.pi/2)
    model["switch"].location.x=-.157 if p["powered"] else -.163
    bpy.context.view_layer.update();model["pose"]=p
    return p


def set_state(model,identity):
    from construction import set_visible_parts
    if identity not in STATES and identity not in model["parts"]:raise ValueError("Unknown wave identity: "+identity)
    ids=STATES.get(identity,[identity])
    # Pick is a preserved tool. It is shown parked only in final complete use view.
    if identity=="wave-machine":ids=ids+["wm-pick"]
    set_visible_parts(model,ids)
    mode={"wm-cord-frame":"loose","wm-tensioned":"idle","wm-guarded":"idle","wm-running":"travelling","wm-marked":"travelling","wm-bridged":"stopped","wave-machine":"standing","wm-looping":"standing"}.get(identity,"idle")
    apply_pose(model,math.pi/2,mode)
    model["identity"]=identity
    return model
