"""Twelve-frame picture drum, with arc-length paper and actual viewing slots.

Still geometry only. Slit timing is represented by dimensions; perception,
card stiffness and bearing friction are not simulated.
"""
import math

RADIUS=.09
FRAMES=12
PITCH=math.tau*RADIUS/FRAMES
WALL_BOTTOM=.043
WALL_TOP=.143
FISH_OUTLINE=[(-.011,.001),(-.017,.007),(-.015,-.006),(-.011,-.001),(-.005,-.004),(.006,-.005),(.013,0),(.006,.006),(-.005,.005)]


def fish_pose(frame):
    # Four key poses: emerging, crest, diving, ripples. Last meets first.
    heights=[.010,.020,.027,.030,.027,.020,.010,.002,-.008,-.012,-.010,.002]
    angles=[.9,.6,.3,0.,-.3,-.6,-.9,-1.1,-1.2,-1.2,1.2,1.1]
    return heights[frame],angles[frame]


def paper_point(u,z,wrapped=True,radius=RADIUS):
    if not wrapped:return (u-math.pi*radius,0,z)
    t=u/radius
    return radius*math.sin(t),-radius*math.cos(t),z


def build_model():
    import bpy
    import scene_parts as S
    from construction import Assembly,ring_z
    a=Assembly("twelve-frame picture drum")
    rotor=a.add("film-bearing",S.empty("turning platform and paper drum"))
    base=a.cylinder("film-base","broad wooden foot",(0,0,.009),.065,.012,"birch")
    S.bore(base,(0,0,.009),.003,.030,"Z")
    for i in range(3):
        t=i*math.tau/3
        a.cylinder("film-base","soft table pad",(.045*math.cos(t),.045*math.sin(t),.0015),.009,.003,"teal")
    a.cylinder("film-bearing","fixed upright spindle",(0,0,.021),.003,.036,"ink")
    ring_z(a,"film-bearing","fixed shoulder washer",(0,0,.016),.008,.003,.002,"paper")
    sleeve=ring_z(a,"film-bearing","turning sleeve bearing",(0,0,.027),.006,.0033,.020,"teal")
    sleeve.parent=rotor
    platform=a.cylinder("film-bearing","rotating support platform",(0,0,.035),.022,.004,"teal",parent=rotor)
    S.bore(platform,(0,0,.035),.0033,.020,"Z")
    spigot=ring_z(a,"film-bearing","floor socket spigot",(0,0,.0385),.0098,.0048,.003,"teal")
    spigot.parent=rotor
    a.cylinder("film-bearing","spindle retaining cap",(0,0,.040),.0045,.002,"ink")
    floor=a.cylinder("film-floor","tab-slotted round floor",(0,0,.040),.0904,.006,"birch",parent=rotor)
    # Blind underside socket accepts both spigot and fixed cap, with clearance.
    cutter=S.cylinder("floor socket cutter",(0,0,.0355),.010,.012,"ink","Z")
    bpy.context.view_layer.objects.active=floor
    mod=floor.modifiers.new("blind mounting socket","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
    bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
    for i in range(FRAMES):
        t=(i+.5)*math.tau/FRAMES
        cutter=S.box("tab slot cutter",(.087*math.sin(t),-.087*math.cos(t),.040),(.0044,.0012,.012))
        cutter.rotation_euler.z=t
        bpy.context.view_layer.objects.active=floor
        mod=floor.modifiers.new("actual floor tab slot","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
        bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
    return a.result(rotor=rotor,generated=[],view={"location":(.40,-.70,.48),"target":(0,0,.075),"scale":.245},
                    flat_view={"location":(.02,-1.,.30),"target":(0,0,.08),"scale":.65})


def _paper_surface(model,part,name,coordinates,faces,color="ink"):
    import bpy
    import scene_parts as S
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(coordinates,[],faces);mesh.update()
    obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj)
    obj.parent=model["rotor"];obj["part_id"]=part;obj.data.materials.append(S.material(color))
    thickness=obj.modifiers.new("real card thickness","SOLIDIFY");thickness.thickness=.0005;thickness.offset=0
    model["parts"].setdefault(part,[]).append(obj);model["generated"].append(obj)
    return obj


def _strip_patch(model,part,name,u0,u1,z0,z1,wrapped,color="ink",radius=RADIUS):
    n=max(1,int((u1-u0)/.003));verts=[]
    for z in (z0,z1):
        verts.extend(paper_point(u0+(u1-u0)*i/n,z,wrapped,radius) for i in range(n+1))
    faces=[(i,i+1,n+i+2,n+i+1) for i in range(n)]
    return _paper_surface(model,part,name,verts,faces,color)


def set_state(model,identity):
    import bpy
    import scene_parts as S
    from construction import set_visible_parts
    for obj in model["generated"]:
        model["parts"][obj["part_id"]].remove(obj);bpy.data.objects.remove(obj,do_unlink=True)
    model["generated"]=[]
    wall_states={"film-wall","film-slotted","film-cylinder","film-shell","film-turning-drum","film-loaded-drum","animation-drum"}
    strip_states={"film-blank-strip","film-key-poses","film-drawn-strip","film-coloured-strip","film-loaded-drum","animation-drum"}
    wrapped=identity not in {"film-wall","film-slotted","film-blank-strip","film-key-poses","film-drawn-strip","film-coloured-strip"}
    cut=identity!="film-wall"
    if identity in wall_states:
        _strip_patch(model,"film-wall","continuous lower drum wall",0,math.tau*RADIUS,WALL_BOTTOM,WALL_TOP-.040,wrapped)
        for i in range(FRAMES):
            lo=i*PITCH+(.0015 if cut else 0);hi=(i+1)*PITCH-(.0015 if cut else 0)
            _strip_patch(model,"film-wall","wall between viewing slits",lo,hi,WALL_TOP-.040,WALL_TOP,wrapped)
            if not cut:
                for u in (i*PITCH-.0015,i*PITCH+.0015):
                    if 0<=u<=math.tau*RADIUS:
                        obj=S.stroke("printed slit boundary",[paper_point(u,z,False) for z in (WALL_TOP-.040,WALL_TOP)],.00035,"paper")
                        obj.location.y=-.0004;obj.parent=model["rotor"];obj["part_id"]="film-wall"
                        model["parts"].setdefault("film-wall",[]).append(obj);model["generated"].append(obj)
            # Tabs bend inward, down through the floor, then under it.
            u=(i+.5)*PITCH
            if wrapped:
                t=u/RADIUS;verts=[]
                for radius,z in ((.09,WALL_BOTTOM),(.087,WALL_BOTTOM),(.087,.0365),(.083,.0365)):
                    for d in (-.002,.002):
                        verts.append((radius*math.sin(t)+d*math.cos(t),-radius*math.cos(t)+d*math.sin(t),z))
                _paper_surface(model,"film-wall","folded retaining floor tab",verts,[(0,1,3,2),(2,3,5,4),(4,5,7,6)])
            else:
                _strip_patch(model,"film-wall","flat prepared floor tab",u-.002,u+.002,WALL_BOTTOM-.0135,WALL_BOTTOM,False)
        if not cut:
            obj=S.stroke("printed slit stopping line",[paper_point(u,WALL_TOP-.040,False) for u in (0,math.tau*RADIUS)],.00035,"paper")
            obj.location.y=-.0004;obj.parent=model["rotor"];obj["part_id"]="film-wall"
            model["parts"]["film-wall"].append(obj);model["generated"].append(obj)
        if wrapped:
            _strip_patch(model,"film-joining-tape","outside seam tape",-.006,.006,WALL_BOTTOM,WALL_TOP-.040,True,"teal",RADIUS+.0006)
    if identity in strip_states:
        radius=.0892;length=math.tau*radius
        _strip_patch(model,"film-blank-strip","picture strip paper",0,length,WALL_BOTTOM+.001,WALL_BOTTOM+.052,wrapped,"paper",radius)
        if wrapped:
            # A 0.6 mm inward crease followed by 7.4 mm of arc preserves the
            # 8 mm tab length and puts the overlap inside the existing strip.
            path=[(0,-radius),(0,-(radius-.0006))]
            for j in range(1,17):
                t=.0074*j/16/(radius-.0006)
                path.append(((radius-.0006)*math.sin(t),-(radius-.0006)*math.cos(t)))
            verts=[(x,y,z) for z in (WALL_BOTTOM+.001,WALL_BOTTOM+.052) for x,y in path]
            n=len(path)
            _paper_surface(model,"film-blank-strip","inward picture strip overlap",verts,[(i,i+1,n+i+1,n+i) for i in range(n-1)],"paper")
        else:
            _strip_patch(model,"film-blank-strip","picture strip overlap tab",length,length+.008,WALL_BOTTOM+.001,WALL_BOTTOM+.052,False,"paper",radius)
        # Each frame faces into the drum. Printed line and fish lie on the inner face.
        for i in range(FRAMES):
            u=(i+.5)*length/FRAMES
            key=identity!="film-blank-strip" and (identity!="film-key-poses" or i in (0,3,6,9))
            def ink_line(name,uv,color,width):
                coords=[paper_point(x,z,wrapped,radius-.0004) for x,z in uv]
                obj=S.stroke(name,coords,width,color);obj.parent=model["rotor"]
                if not wrapped:obj.location.y=-.0004
                obj["part_id"]="film-blank-strip";model["parts"].setdefault("film-blank-strip",[]).append(obj);model["generated"].append(obj)
            ink_line("blue waterline",[(u-length/FRAMES/2+.001,WALL_BOTTOM+.014),(u+length/FRAMES/2-.001,WALL_BOTTOM+.014)],"teal",.00035)
            ink_line("printed frame boundary",[(i*length/FRAMES,WALL_BOTTOM+.001),(i*length/FRAMES,WALL_BOTTOM+.052)],"card",.0002)
            if key:
                if i in (8,9,10):
                    for j in (-1,0,1):
                        ink_line("spreading splash ripple",[(u+x,WALL_BOTTOM+.014+j*.003+.001*math.cos(x*800)) for x in [-.012,-.008,-.004,0,.004,.008,.012]],"teal",.00045)
                    continue
                h,angle=fish_pose(i)
                fish=FISH_OUTLINE+[FISH_OUTLINE[0]]
                uv=[(u+x*math.cos(angle)-z*math.sin(angle),WALL_BOTTOM+.014+h+x*math.sin(angle)+z*math.cos(angle)) for x,z in fish]
                ink_line("same fish in frame "+str(i+1),uv,"orange" if identity in {"film-coloured-strip","film-loaded-drum","animation-drum"} else "ink",.0007)
                ink_line("fish eye",[(u+.008*math.cos(angle),WALL_BOTTOM+.014+h+.008*math.sin(angle)),(u+.008*math.cos(angle)+.0002,WALL_BOTTOM+.014+h+.008*math.sin(angle))],"ink",.0008)
    supplied={
        "film-wall":{"film-wall"},"film-slotted":{"film-wall"},
        "film-cylinder":{"film-wall","film-joining-tape"},"film-shell":{"film-wall","film-joining-tape","film-floor"},
        "film-turntable":{"film-base","film-bearing"},"film-floor":{"film-floor"},"film-base":{"film-base"},"film-bearing":{"film-bearing"},
        "film-joining-tape":{"film-joining-tape"},
    }
    if identity in {"film-turning-drum","film-loaded-drum","animation-drum"}:
        ids={"film-wall","film-joining-tape","film-floor","film-base","film-bearing"}
        if identity!="film-turning-drum":ids.add("film-blank-strip")
    elif identity in strip_states:ids={"film-blank-strip"}
    elif identity in supplied:ids=supplied[identity]
    else:raise ValueError("Unknown picture drum identity: "+identity)
    if identity=="film-joining-tape":
        _strip_patch(model,"film-joining-tape","loose joining tape",math.pi*RADIUS,math.pi*RADIUS+.012,.045,.105,False,"teal")
    set_visible_parts(model,ids)
    return model["view"] if wrapped else model["flat_view"]


def apply_pose(model,angle=0.):
    model["rotor"].rotation_euler.z=angle


def dimensions():
    return {"wall_radius_m":RADIUS,"frames":FRAMES,"slit_width_m":.003,"wall_height_m":.100,
            "picture_strip_top_m":WALL_BOTTOM+.052,"slit_bottom_m":WALL_TOP-.040,
            "spindle_radius_m":.003,"bearing_bore_m":.0033,"tab_width_m":.004,"slot_width_m":.0044,
            "limits":"Geometry only; no friction, stiffness or perceptual test."}
