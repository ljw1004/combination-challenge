"""Original dimensioned periscope and kaleidoscope; no scene side effects.

The 300 mm periscope has parallel 45-degree mirrors and opposite windows.
The kaleidoscope uses three inward-facing 40 x 180 mm mirrors, a loose
colour chamber and a translucent front. These are optical layouts, not
measured optical performance or manufacturing drawings.
"""
import math


def check_optics():
    # Reflection in either parallel mirror: incoming -Y -> -Z -> -Y.
    n = (0., -2**-.5, 2**-.5)
    def reflect(v):
        dot = sum(x*y for x,y in zip(v,n))
        return tuple(v[i]-2*dot*n[i] for i in range(3))
    first = reflect((0,-1,0))
    second = reflect(first)
    return {"periscope_first_ray": first, "periscope_exit_ray": second,
            "mirror_separation_m": .240, "mirror_angle_degrees":45,
            "kaleidoscope_cross_section_degrees":[60,60,60],
            "mirror_width_m":.040,"mirror_length_m":.180,
            "limits":"Ideal ray directions only; no measured light loss, image quality or manufactured fit."}


def build_periscope(folded=True):
    import bpy
    import scene_parts as S
    from construction import Assembly, surface, special_material
    a = Assembly("periscope")
    mirror = special_material("unbreakable mirror", (.78,.86,.88), metallic=1, roughness=.006)
    panels = []
    # Four 60 mm panels share full-height score lines. Window cutouts are
    # actual absent faces, not dark rectangles pretending to be openings.
    corners = [(-.03,-.03),(.03,-.03),(.03,.03),(-.03,.03)]
    for i in range(4):
        hinge = a.add("pe-net", S.empty("tube panel hinge "+str(i)))
        hinge.location=(*corners[i],0)
        hinge.rotation_euler.z=i*math.pi/2
        panels.append(hinge)
        for z0,z1 in ([(.060,.300)] if i==0 else [(0,.240)] if i==2 else [(0,.300)]):
            a.box("pe-net", "scored card panel", (.030,0,(z0+z1)/2), (.060,.0015,z1-z0),"card",hinge)
            a.box("pe-lining", "matte inner lining", (.030,.0009,(z0+z1)/2),(.058,.00025,z1-z0-.002),"ink",hinge)
        # Narrow margins retain rigidity around each true window.
        if i in (0,2):
            z = .03 if i==0 else .27
            for x in (.0025,.0575):
                a.box("pe-net","window side margin",(x,0,z),(.005,.0015,.060),"card",hinge)
        a.line("pe-net","long score",[(0,-.0009,0),(0,-.0009,.300)],.00035,"ink",hinge)
    for z in (.03,.27):
        part = "pe-lower-mirror" if z < .1 else "pe-upper-mirror"
        obj=a.box(part,"parallel reflecting plate",(0,0,z),(.049,.070,.0012),"paper")
        obj.rotation_euler.x=math.pi/4
        surface(obj,mirror)
        for x in (-.026,.026):
            # Clips sit outside the clear central optical corridor.
            clip=a.box(part,"mirror edge retaining clip",(x,0,z),(.003,.074,.004),"teal")
            clip.rotation_euler.x=math.pi/4
            # The prepared ledge joins the retaining clip to the card wall.
            ledge=a.box("pe-net","prepared mirror ledge",(math.copysign(.029,x),0,z),(.003,.074,.004),"card")
            ledge.rotation_euler.x=math.pi/4
            import bpy
            bpy.context.view_layer.update()
            matrix=ledge.matrix_world.copy()
            ledge.parent=panels[1 if x>0 else 3]
            ledge.matrix_world=matrix
    for y,z in ((-.034,.03),(.034,.27)):
        # Four short sleeve walls leave the 45 x 45 mm view unobstructed.
        for x in (-.025,.025):
            a.box("pe-baffles","window shade side",(x,y,z),(.003,.017,.050),"ink")
        for zz in (z-.025,z+.025):
            a.box("pe-baffles","window shade edge",(0,y,zz),(.050,.017,.003),"ink")
    # End plates are scored extensions of the supplied net.
    for z in (.001,.299):
        a.box("pe-net","tube end flap",(0,0,z),(.060,.060,.0015),"card")
    tabs=[]
    for name,n in (("long seam fastening tab",3),("lower end fastening tab",3),("upper end fastening tab",3)):
        mesh=bpy.data.meshes.new(name);mesh.from_pydata([(0,0,0)]*(n*2),[],[(i*2,i*2+1,i*2+3,i*2+2) for i in range(n-1)]);mesh.update()
        obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj);obj.data.materials.append(S.material("card"))
        solid=obj.modifiers.new("fastening tab thickness","SOLIDIFY");solid.thickness=.0005;solid.offset=0
        tabs.append(a.add("pe-net",obj))
    adhesive=[a.box("pe-net","prepared seam adhesive",(0,0,0),(.005,.000225,.296),"orange")]
    adhesive += [a.box("pe-net","prepared end-tab adhesive",(0,0,0),(.000225,.044,.008),"orange") for _ in range(2)]
    model=a.result(panels=panels,corners=corners,folded=folded,tabs=tabs,adhesive=adhesive,
                   view={"location":(.55,-.85,.50),"target":(0,0,.15),"scale":.46})
    set_periscope_fold(model,folded)
    return model


def set_periscope_fold(model,folded):
    for i,hinge in enumerate(model["panels"]):
        hinge.location = (*model["corners"][i],0) if folded else (-.12+.06*i,0,0)
        hinge.rotation_euler.z = i*math.pi/2 if folded else 0
    # Loose end flaps are represented at their scored edge in the flat view.
    ends=[o for o in model["parts"]["pe-net"] if o.name.startswith("tube end flap")]
    for i,o in enumerate(ends):
        if folded:
            o.location=(0,0,.001 if i==0 else .299);o.rotation_euler=(0,0,0)
        else:
            o.location=(-.09,0,-.03 if i==0 else .33);o.rotation_euler=(math.pi/2,0,0)
    if folded:
        paths=[[[(-.030,-.030,z),(-.030,-.0285,z),(-.025,-.0285,z)] for z in (.002,.298)]]
        for top in (False,True):
            z=.299 if top else .001;direction=-1 if top else 1
            paths.append([[(.030,y,z),(.0285,y,z+direction*.001),(.0285,y,z+direction*.009)] for y in (-.022,.022)])
        model["adhesive"][0].location=(-.0275,-.0288625,.150)
        for i,o in enumerate(model["adhesive"][1:]):o.location=(.0288625,0,.294 if i else .006);o.rotation_euler=(0,0,0)
    else:
        paths=[[[ (.120+d,0,z) for d in (0,.0015,.0065)] for z in (.002,.298)]]
        for top in (False,True):
            z=.33 if top else -.03
            paths.append([[(-.060+d,0,zz) for d in (0,math.hypot(.0015,.001),math.hypot(.0015,.001)+.008)] for zz in (z-.022,z+.022)])
        model["adhesive"][0].location=(.124,.0003625,.150)
        for i,o in enumerate(model["adhesive"][1:]):
            o.location=(-.0542,.0003625,.33 if i else -.03);o.rotation_euler=(math.pi/2,0,math.pi/2)
    for obj,edges in zip(model["tabs"],paths):
        for i in range(3):
            obj.data.vertices[i*2].co=edges[0][i];obj.data.vertices[i*2+1].co=edges[1][i]
    model["folded"]=folded


def build_kaleidoscope(triangle=True):
    import scene_parts as S
    from construction import Assembly, surface, special_material
    a=Assembly("kaleidoscope")
    mirror=special_material("kaleidoscope mirror",(.78,.86,.88),metallic=1,roughness=.003)
    clear=special_material("clear chamber",(.86,.95,.95),roughness=.08,transmission=.85)
    milky=special_material("light diffuser",(.92,.93,.84),roughness=.65,transmission=.20)
    vertices=[(0,.040/math.sqrt(3)),(-.020,-.020/math.sqrt(3)),(.020,-.020/math.sqrt(3))]
    strips=[]
    for i in range(3):
        p,q=vertices[i],vertices[(i+1)%3]
        obj=a.box("ka-strips","long reflecting strip",(0,0,0),(.040,.180,.001),"paper")
        surface(obj,mirror);strips.append(obj)
    # Three separate external tape seams; nothing on the reflecting faces.
    for i,(x,z) in enumerate(vertices):
        seam=a.box("ka-tape","outside binding seam",(x,0,z),(.006,.176,.00035),"orange")
        seam.rotation_euler.y=-i*2*math.pi/3
    outer=S.annulus("protective card tube",(0,0,0),.030,.0275,.190,"card")
    a.add("ka-tube",outer)
    eyecap=S.annulus("fitted dark eyecap",(0,.096,0),.030,.004,.003,"ink")
    a.add("ka-tube",eyecap)
    # Flat pads touch the three outward mirror faces; they do not float around
    # the triangle or intrude into its reflecting aperture.
    for y in (-.075,.075):
        for i in range(3):
            p,q=vertices[i],vertices[(i+1)%3]
            x,z=(p[0]+q[0])/2,(p[1]+q[1])/2
            r=math.hypot(x,z)
            inner=r+.0005
            thickness=.0272-inner
            pad=a.box("ka-tube","padded mirror support",(x/r*(inner+thickness/2),y,z/r*(inner+thickness/2)),(.012,.008,thickness),"teal")
            pad.rotation_euler.y=math.atan2(x,z)
    # Fixed neck enters the tube; a collar turns between two retaining flanges.
    a.add("ka-tube",S.annulus("fixed front neck",(0,-.099,0),.0274,.0245,.014,"teal"))
    a.add("ka-tube",S.annulus("factory bonded neck sleeve",(0,-.0935,0),.0275,.0274,.003,"orange"))
    for y in (-.092,-.1025):a.add("ka-tube",S.annulus("fixed collar retaining flange",(0,y,0),.0295,.0245,.002,"teal"))
    a.add("ka-tube",S.annulus("rotating collar rear bearing",(0,-.09825,0),.032,.0276,.0055,"teal"))
    for y,depth,inner in ((-.1015,.001,.0305),(-.1025,.001,.0310),(-.1035,.001,.0305)):
        a.add("ka-tube",S.annulus("rotating collar snap groove",(0,y,0),.032,inner,depth,"teal"))
    a.add("ka-cell",S.annulus("cell connecting neck",(0,-.10625,0),.0303,.0297,.0095,"orange"))
    a.add("ka-cell",S.annulus("cell retaining snap bead",(0,-.1025,0),.0308,.0297,.0008,"orange"))
    a.add("ka-cell",S.annulus("colour cell rim",(0,-.1145,0),.030,.026,.013,"orange"))
    for y in (-.108,-.121):
        surface(a.cylinder("ka-cell","clear cell wall",(0,y,0),.026,.0007,"paper","Y"),clear)
    for i in range(3):
        t=i*math.tau/3
        foot=a.box("ka-cell","clear lid snap foot",(.0267*math.cos(t),-.1206,.0267*math.sin(t)),(.0008,.002,.002),"orange");foot.rotation_euler.y=-t
        tip=a.box("ka-cell","clear lid retaining lip",(.0262*math.cos(t),-.12165,.0262*math.sin(t)),(.0018,.0006,.002),"orange");tip.rotation_euler.y=-t
    a.add("ka-cell",S.annulus("diffuser receiving bead",(0,-.11975,0),.03035,.0299,.0008,"orange"))
    for y,depth,inner in ((-.118925,.00065,.0301),(-.11975,.001,.03045),(-.122425,.00435,.0301)):
        a.add("ka-diffuser",S.annulus("diffuser snap skirt",(0,y,0),.0308,inner,depth,"paper"))
    surface(a.cylinder("ka-diffuser","milky light cover",(0,-.1246,0),.0308,.001,"paper","Y"),milky)
    # Recognisable pieces occupy less than half the chamber area and depth.
    tri=S.profile("green translucent triangle",[(-.014,-.004),(-.003,-.004),(-.010,.010)],.002,-.1135,"teal")
    a.add("ka-chips",tri)
    crescent=[]
    for j in range(25):
        t=-math.pi/2+math.pi*j/24
        crescent.append((.008+.009*math.cos(t),.008*math.sin(t)))
    for j in range(24,-1,-1):
        t=-math.pi/2+math.pi*j/24
        crescent.append((.008+.004*math.cos(t),.008*math.sin(t)))
    a.add("ka-chips",S.profile("orange crescent",crescent,.002,-.1155,"orange"))
    a.cylinder("ka-chips","small blue chip",(.002,-.1135,-.014),.004,.002,"teal","Y")
    for obj in a.parts["ka-chips"]:
        color=(.10,.80,.16) if "triangle" in obj.name else (1.,.65,.08) if "crescent" in obj.name else (.025,.30,.95)
        mat=special_material("translucent "+obj.name,color,roughness=.3,transmission=0.)
        # Thin coloured plastic scatters light through its broad faces. An
        # ideal diffuse-transmission sheet keeps the colours visible without
        # pretending that these pieces emit their own light.
        nodes=mat.node_tree.nodes;links=mat.node_tree.links
        diffuse=nodes.new('ShaderNodeBsdfDiffuse');diffuse.inputs['Color'].default_value=(*color,1)
        translucent=nodes.new('ShaderNodeBsdfTranslucent');translucent.inputs['Color'].default_value=(*color,1)
        mix=nodes.new('ShaderNodeMixShader');mix.inputs[0].default_value=.65
        links.new(diffuse.outputs[0],mix.inputs[1]);links.new(translucent.outputs[0],mix.inputs[2])
        links.new(mix.outputs[0],nodes.get('Material Output').inputs['Surface'])
        surface(obj,mat)
    model=a.result(strips=strips,vertices=vertices,triangle=triangle,
                   view={"location":(.36,.52,.30),"target":(0,-.01,0),"scale":.26})
    set_kaleidoscope_triangle(model,triangle)
    return model


def set_kaleidoscope_triangle(model,triangle):
    for i,obj in enumerate(model["strips"]):
        if triangle:
            p,q=model["vertices"][i],model["vertices"][(i+1)%3]
            obj.location=((p[0]+q[0])/2,0,(p[1]+q[1])/2)
            obj.rotation_euler.y=-math.atan2(q[1]-p[1],q[0]-p[0])
        else:
            obj.location=((i-1)*.043,0,0);obj.rotation_euler=(0,0,0)
    model["triangle"]=triangle


def stage(model,item):
    """Use parser-derived ancestry, plus the explicit flexible-sheet states."""
    from construction import set_visible_parts
    set_visible_parts(model,item["materials"])
    if "panels" in model:
        set_periscope_fold(model,item["id"] not in {"pe-net","pe-lined","pe-lining"})
    if "strips" in model:
        set_kaleidoscope_triangle(model,item["id"] != "ka-strips")
        for obj in model["parts"]["ka-cell"]:
            if obj.name.startswith("clear cell wall") and obj.location.y < -.115:
                if "closed_y" not in obj:obj["closed_y"]=obj.location.y
                obj.location.y=obj["closed_y"]-(.018 if item["id"]=="ka-cell" else 0)


if __name__=="__main__":
    import json
    print(json.dumps(check_optics(),indent=2))
