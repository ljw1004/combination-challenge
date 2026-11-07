"""Pinwheel and wind-racer geometry with supplied-part ownership, in metres.

Each folded pinwheel blade uses a developable cylindrical bend followed by a
flat tip. Its material coordinate is arc length: paper is bent, not stretched
to make its punched hole reach the hub. Mesh tessellation is an approximation
to that continuous surface. Airflow, paper stiffness and rolling losses are
not simulated.
"""
import math

PAPER_HALF=.080
WEB_HALF=.012
HOLE=(.074,.066)
BEND_LENGTH=.012


def bend_parameters(height):
    a=math.hypot(*HOLE)
    def candidate(angle):
        radius=BEND_LENGTH/angle
        c=(-radius*math.sin(angle)-(a-BEND_LENGTH)*math.cos(angle))/(1-math.cos(angle))
        z=radius*(1-math.cos(angle))+(a-c-BEND_LENGTH)*math.sin(angle)
        return c,z
    lo,hi=2.6,math.pi
    for _ in range(70):
        mid=(lo+hi)/2
        if candidate(mid)[1]>height:lo=mid
        else:hi=mid
    angle=(lo+hi)/2;c,z=candidate(angle)
    return c,angle,BEND_LENGTH/angle


def folded_point(x,y,height=.012,folded=True):
    if not folded:return x,y,0.
    a=math.hypot(*HOLE);nx,ny=HOLE[0]/a,HOLE[1]/a
    u=x*nx+y*ny;v=-x*ny+y*nx
    c,angle,r=bend_parameters(height);d=u-c
    if d<=0:new_u,z=u,0.
    elif d<BEND_LENGTH:new_u,z=c+r*math.sin(d/r),r*(1-math.cos(d/r))
    else:new_u,z=c+r*math.sin(angle)+(d-BEND_LENGTH)*math.cos(angle),r*(1-math.cos(angle))+(d-BEND_LENGTH)*math.sin(angle)
    return new_u*nx-v*ny,new_u*ny+v*nx,z


def check_wind_toys():
    errors=[math.dist(folded_point(*HOLE,h), (0,0,h)) for h in [.012+i*.00035 for i in range(4)]]
    return {"paper_square_m":.160,"corner_hole_target_error_m":max(errors),
            "continuous_bend":"Arc-length cylinder joined tangentially to flat paper; no change of material length.",
            "racer_wheel_radius_m":.030,"axle_radius_m":.003,
            "radial_bearing_clearance_m":.0002,"wheel_inner_face_to_bearing_end_m":.004,
            "limits":"Ideal geometry. Paper elastic recovery, wind torque, axle friction and traction unmeasured."}


def build_pinwheel(folded=True,cut=True):
    import bpy
    import scene_parts as S
    from construction import Assembly, special_material
    a=Assembly("paper pinwheel")
    rotor=a.add("pw-paper",S.empty("rotor about its axle"))
    rotor.location=(0,0,.180);rotor.rotation_euler.x=math.pi/2
    paper=[]
    def mesh_object(name,verts,faces):
        mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
        obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj)
        obj.data.materials.append(S.material("orange"));a.add("pw-paper",obj,rotor)
        for polygon in mesh.polygons:polygon.use_smooth=True
        obj.modifiers.new("triangulate curved paper before cutting","TRIANGULATE")
        solid=obj.modifiers.new("paper thickness","SOLIDIFY");solid.thickness=.00025;solid.offset=0
        return obj
    # Mesh each of the four diagonal-cut trapezoids in material coordinates.
    for blade in range(4):
        verts=[];faces=[];uv=[];n=40
        for i in range(n+1):
            x=WEB_HALF+(PAPER_HALF-WEB_HALF)*i/n
            for j in range(n+1):
                y=(2*j/n-1)*x
                uv.append((x,y));verts.append((x,y,0))
        for i in range(n):
            for j in range(n):
                k=i*(n+1)+j;faces.append((k,k+n+1,k+n+2,k+1))
        obj=mesh_object("cut paper blade "+str(blade+1),verts,faces)
        obj.rotation_euler.z=blade*math.pi/2
        obj["material_coordinates"]=True
        paper.append((obj,uv,.012+blade*.00035))
    core=a.box("pw-paper","uncut central paper web",(0,0,0),(.024,.024,.00025),"orange",rotor)
    # An uncut square is a separate presentation of the same supplied sheet.
    uncut=a.box("pw-paper","uncut paper square",(0,0,0),(.160,.160,.00025),"orange",rotor)
    # Hole cutters follow the material tip and are live Boolean modifiers,
    # so the same literal hole survives flat and folded presentations.
    cutters=[]
    for i,(obj,uv,h) in enumerate(paper):
        cutter=S.cylinder("paper corner hole cutter",(0,0,0),.0032,.035,"ink","Z",48)
        cutter.parent=rotor;cutter.hide_render=True;cutter.display_type="WIRE"
        mod=obj.modifiers.new("prepared corner hole","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
        cutters.append(cutter)
    # Central web and original sheet holes are through the real paper.
    for obj in (core,uncut):
        cutter=S.cylinder("central paper hole cutter",(0,0,0),.0032,.040,"ink","Z",48)
        cutter.parent=rotor;cutter.hide_render=True;cutter.display_type="WIRE"
        mod=obj.modifiers.new("prepared centre hole","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
    for i in range(4):
        t=i*math.pi/2;x,y=HOLE
        cx,cy=x*math.cos(t)-y*math.sin(t),x*math.sin(t)+y*math.cos(t)
        cutter=S.cylinder("uncut corner hole cutter",(cx,cy,0),.0032,.040,"ink","Z",48)
        cutter.parent=rotor;cutter.hide_render=True;cutter.display_type="WIRE"
        mod=uncut.modifiers.new("prepared corner hole","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
    for i in range(4):
        t=i*math.pi/2
        pts=[(v*math.cos(t)-v*math.sin(t),v*math.sin(t)+v*math.cos(t),.0003) for v in (WEB_HALF,PAPER_HALF)]
        a.line("pw-paper","printed diagonal stopping line",pts,.0004,"ink",rotor)
    hub=S.annulus("hollow corner gathering hub",(0,0,0),.003,.0017,.014,"teal")
    hub.rotation_euler.x=math.pi/2;hub.location=(0,0,.0065);a.add("pw-hub",hub,rotor)
    flange=a.cylinder("pw-hub","hub flange",(0,0,-.001),.0075,.0015,"teal","Z",rotor)
    # Live bore through flange; axle remains free within the rotating hub.
    cutter=S.cylinder("hub flange bore cutter",(0,0,-.001),.0017,.01,"ink","Z")
    cutter.parent=rotor;cutter.hide_render=True
    mod=flange.modifiers.new("hub axle bore","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
    a.cylinder("pw-axle","blunt fixed axle",(0,0,-.006),.0015,.048,"ink","Z",rotor)
    a.cylinder("pw-axle","broad loose retaining cap",(0,0,.0165),.006,.002,"teal","Z",rotor)
    rear=S.annulus("rear push-on axle retainer",(0,0,0),.004,.00145,.003,"teal")
    rear.rotation_euler.x=math.pi/2;rear.location=(0,0,-.029);a.add("pw-axle",rear,rotor)
    for z in (-.003,-.012):
        washer=S.annulus("smooth spacing washer",(0,0,0),.006,.0017,.001,"paper")
        washer.rotation_euler.x=math.pi/2;washer.location=(0,0,z);a.add("pw-axle",washer,rotor)
    handle=a.box("pw-handle","wooden handle",(0,.023,.096),(.015,.009,.184),"birch")
    clip=a.box("pw-handle","prepared axle clip",(0,.017,.180),(.014,.008,.010),"teal")
    S.bore(handle,(0,.023,.180),.0017,.030,"Y")
    S.bore(clip,(0,.017,.180),.0017,.030,"Y")
    for z in (.012,.024):
        # Mounting holes later match the racer chassis, without resizing.
        handle=a.parts["pw-handle"][0]
        S.bore(handle,(0,.023,z),.0017,.020,"Y")
    model=a.result(rotor=rotor,paper=paper,core=core,uncut=uncut,cutters=cutters,
                   view={"location":(.38,-.80,.45),"target":(0,0,.135),"scale":.32})
    set_pinwheel_state(model,folded,cut)
    return model


def set_pinwheel_state(model,folded=True,cut=True):
    for i,(obj,uv,h) in enumerate(model["paper"]):
        for vertex,(x,y) in zip(obj.data.vertices,uv):vertex.co=folded_point(x,y,h,folded)
        obj.hide_render=not cut
        # The cutting axis is normal to the local flat tip after folding.
        p=folded_point(*HOLE,h,folded);angle=i*math.pi/2
        cutter=model["cutters"][i]
        cutter.location=(p[0]*math.cos(angle)-p[1]*math.sin(angle),p[0]*math.sin(angle)+p[1]*math.cos(angle),p[2])
        if folded:
            n=math.hypot(*HOLE);nx,ny=HOLE[0]/n,HOLE[1]/n
            _,theta,_=bend_parameters(h)
            # For the folded tip normal, sin(theta) lies opposite bend direction.
            from mathutils import Vector
            normal=Vector((-nx*math.sin(theta),-ny*math.sin(theta),math.cos(theta)))
            normal.rotate(__import__('mathutils').Matrix.Rotation(angle,3,'Z'))
            cutter.rotation_euler=normal.to_track_quat('Z','Y').to_euler()
        else:cutter.rotation_euler=(0,0,0)
    model["core"].hide_render=not cut;model["uncut"].hide_render=cut
    for o in model["parts"]["pw-paper"]:
        if o.name.startswith("printed diagonal"):o.hide_render=folded


def build_racer():
    import bpy
    import scene_parts as S
    from construction import Assembly, special_material
    a=Assembly("wind racer")
    chassis=a.box("wr-chassis","prepared chassis",(0,0,.045),(.220,.110,.008),"birch")
    S.bore(chassis,(0,0,.045),.0042,.020,"Z")
    for x in (-.006,.006):S.bore(chassis,(x,.035,.045),.0017,.020,"Z")
    axles=[]
    for x in (-.075,.075):
        a.add("wr-bearings",S.annulus("smooth axle bearing",(x,0,.030),.006,.0032,.130,"teal"))
        for y in (-.042,.042):
            clip=S.annulus("push-fit bearing saddle",(0,0,0),.009,.006,.016,"teal",gap=1.3)
            clip.location=(x,y,.030);clip.rotation_euler.y=math.pi/2;a.add("wr-bearings",clip)
            a.box("wr-bearings","saddle shoulder",(x,y,.0395),(.013,.016,.003),"teal")
            cutter=S.box("prepared saddle slot",(x,y,.045),(.0084,.0104,.020))
            bpy.context.view_layer.objects.active=chassis
            mod=chassis.modifiers.new("actual saddle receiving slot","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
            bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
            # Twin resilient legs and upper barbs belong to each ready-made clip.
            for sign in (-1,1):
                a.box("wr-bearings","saddle snap leg",(x+sign*.003,y,.046),(.002,.009,.012),"teal")
                a.box("wr-bearings","saddle retaining barb",(x+sign*.0042,y,.0505),(.003,.009,.002),"teal")
        axle=a.add("wr-wheelset",S.empty("rolling axle"));axle.location=(x,0,.030);axles.append(axle)
        a.cylinder("wr-wheelset","wheel axle",(0,0,0),.003,.172,"ink","Y",axle)
        for y in (-.075,.075):
            wheel=a.cylinder("wr-wheelset","light rigid wheel",(0,y,0),.030,.012,"orange","Y",axle)
            a.cylinder("wr-wheelset","axle cap",(0,math.copysign(.084,y),0),.005,.003,"teal","Y",axle)
            a.cylinder("wr-wheelset","spacing collar",(0,math.copysign(.067,y),0),.0045,.003,"ink","Y",axle)
            a.line("wr-wheelset","wheel rotation index",[(.006,y-math.copysign(.0065,y),0),(.024,y-math.copysign(.0065,y),0)],.001,"ink",axle)
    a.cylinder("wr-mast","mast",(0,0,.166),.004,.228,"birch")
    a.cylinder("wr-mast","prepared foot stem",(0,0,.047),.0039,.006,"teal")
    a.cylinder("wr-mast","mast seating collar",(0,0,.050),.007,.002,"teal")
    from construction import ring_z
    ring_z(a,"wr-mast","mast foot socket",(0,0,.0545),.007,.0041,.007,"teal")
    ring_z(a,"wr-mast","factory bonded socket lining",(0,0,.055),.0041,.004,.006,"paper")
    for x in (-.0028,.0028):
        a.box("wr-mast","split locking foot arm",(x,0,.038),(.0016,.004,.018),"teal")
        a.box("wr-mast","foot retaining barb",(math.copysign(.004,x),0,.0375),(.0024,.004,.003),"teal")
    a.cylinder("wr-mast","sail crossbar",(0,0,.180),.003,.140,"birch","Y")
    a.box("wr-mast","crossbar lashing block",(0,0,.180),(.011,.012,.012),"teal")
    for y in (-.0685,.0685):
        a.add("wr-mast",S.annulus("removable sail loop retaining clip",(0,y,.180),.0047,.0029,.003,"orange",gap=.8))
    ring_z(a,"wr-mast","mast tip loop retaining clip",(0,0,.2785),.006,.0039,.003,"orange")
    # Explicit cloth triangle in the YZ plane, normal to the useful breeze.
    import bpy
    mesh=bpy.data.meshes.new("triangular sail");mesh.from_pydata([(.0036,-.060,.180),(.0036,.060,.180),(.0046,0,.276)],[],[(0,1,2)]);mesh.update()
    sail=bpy.data.objects.new("light sailcloth",mesh);bpy.context.collection.objects.link(sail);sail.data.materials.append(special_material("woven blue sail",(.22,.55,.65),roughness=.9));a.add("wr-sailcloth",sail)
    for y in (-.060,.060):
        a.line("wr-sailcloth","reinforced crossbar loop",[(.0036*math.cos(t*math.tau/48),y,.180+.0036*math.sin(t*math.tau/48)) for t in range(49)],.0006,"orange")
    a.line("wr-sailcloth","reinforced mast loop",[(.0046*math.cos(t*math.tau/48),.0046*math.sin(t*math.tau/48),.276) for t in range(49)],.0006,"orange")
    return a.result(axles=axles,view={"location":(.55,-.80,.48),"target":(0,0,.135),"scale":.36})


def apply_racer_pose(model,distance=0.):
    model["root"].location.x=distance
    for axle in model["axles"]:axle.rotation_euler.y=distance/.030


if __name__=="__main__":
    import json
    print(json.dumps(check_wind_toys(),indent=2))
