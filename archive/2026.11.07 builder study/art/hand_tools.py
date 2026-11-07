"""Original workshop tool geometry, in metres; supplied finished tools.

The images show exteriors of ordinary bought modules. They do not imply that
scissors or electrical components were fabricated by a story combination.
"""
import math

TOOL_IDS={"work-scissors","work-hand-fan","work-screwdriver","work-lantern",
          "pe-folder","pe-hat","ka-former","ka-tape","film-pencil",
          "film-fish-stencil","film-colours","rover-trim-driver"}


def build_model(item_id):
    import bpy
    import scene_parts as S
    from construction import Assembly, ring_z, surface, special_material
    if item_id not in TOOL_IDS:raise ValueError("No tool model for "+item_id)
    a=Assembly(item_id)
    metal=special_material("tool steel",(.45,.53,.56),metallic=.75,roughness=.30)
    view={"location":(.35,-.55,.6),"target":(0,0,.015),"scale":.23}
    if item_id=="work-scissors":
        arms=[]
        # Each complete blade/handle is rigid and rotates about the same Z pin.
        for side in (-1,1):
            arm=a.add(item_id,S.empty("scissor blade hinge"));arms.append(arm)
            arm.rotation_euler.z=side*.40;arm.location.z=.003+side*.0009
            points=[(0,-.004),(.063,-.0035),(.069,-.001),(.069,.001),(.064,.004),(.010,.009),(-.050,.008),(-.052,.001)]
            blade=S.profile("rounded steel scissor blade",points,.0016,0,"ink")
            blade.rotation_euler.x=math.pi/2
            S.bore(blade,(0,0,0),.0022,.02,"Z")
            a.add(item_id,surface(blade,metal),arm)
            # The broad steel blade root already surrounds its actual bore;
            # a coplanar duplicate washer would produce false striped facets.
            handle=S.annulus("soft finger ring",(0,0,0),.022,.015,.007,"orange")
            handle.rotation_euler.x=math.pi/2;handle.location=(-.060,0,0);handle.scale.y=.82
            a.add(item_id,handle,arm)
        a.cylinder(item_id,"scissor pivot pin",(0,0,.003),.002,.007,"ink")
        for z in (-.001,.007):a.cylinder(item_id,"retaining head",(0,0,z),.004,.001,"teal")
        view["scale"]=.16
    elif item_id in {"work-screwdriver","rover-trim-driver"}:
        short=item_id=="work-screwdriver"
        length=.055 if short else .085
        a.cylinder(item_id,"gripped driver handle",(0,0,.018),.012,.036,"teal")
        surface(a.cylinder(item_id,"steel driver shaft",(0,0,.036+length/2),.002,length,"ink"),metal)
        tip=a.box(item_id,"flat screwdriver tip",(0,0,.036+length),(.0048,.0011,.006),"ink");surface(tip,metal)
        for angle in range(6):
            t=angle*math.pi/3
            a.line(item_id,"handle grip rib",[(.012*math.cos(t),.012*math.sin(t),z) for z in (.004,.032)],.0006,"ink")
        view["target"]=(0,0,.055);view["scale"]=.15
    elif item_id=="work-hand-fan":
        # Alternating ridges are actual accordion folds in one paper sector.
        radius=.13;start=-math.pi*.40;end=math.pi*.40;n=20
        verts=[]
        for r in (.025,radius):
            for j in range(n+1):
                t=start+(end-start)*j/n
                verts.append((r*math.sin(t),r*math.cos(t),.004*(j%2)))
        faces=[(j,j+1,n+2+j,n+1+j) for j in range(n)]
        mesh=bpy.data.meshes.new("accordion paper");mesh.from_pydata(verts,[],faces);mesh.update()
        obj=bpy.data.objects.new("folded fan leaf",mesh);bpy.context.collection.objects.link(obj)
        obj.data.materials.append(S.material("orange"));a.add(item_id,obj)
        for j in range(0,n+1,2):
            t=start+(end-start)*j/n
            a.line(item_id,"wooden fan rib",[(0,0,.002),(.125*math.sin(t),.125*math.cos(t),.002)],.0014,"birch")
        a.cylinder(item_id,"fan hinge rivet",(0,0,.003),.004,.009,"teal")
        a.box(item_id,"fan grip",(0,-.022,.004),(.012,.045,.009),"birch")
        view["target"]=(0,.055,0);view["scale"]=.28
    elif item_id=="work-lantern":
        a.box(item_id,"enclosed lantern body",(0,0,.038),(.085,.055,.076),"teal")
        mat=special_material("lantern milky face",(.97,.94,.76),roughness=.8)
        shader=mat.node_tree.nodes.get("Principled BSDF");shader.inputs["Emission Color"].default_value=(1.,.85,.35,1);shader.inputs["Emission Strength"].default_value=.7
        face=a.box(item_id,"diffused light face",(0,-.029,.039),(.072,.003,.063),"paper");surface(face,mat)
        a.box(item_id,"battery hatch",(0,.028,.031),(.058,.002,.044),"ink")
        a.box(item_id,"lantern on off switch",(.023,0,.078),(.015,.009,.005),"orange")
        for x in (-.030,.030):a.line(item_id,"handle side",[(x,0,.074),(x,0,.106)],.003,"ink")
        a.line(item_id,"carrying handle",[(-.030,0,.106),(.030,0,.106)],.003,"ink")
        view["target"]=(0,0,.05);view["scale"]=.15
    elif item_id=="pe-folder":
        obj=S.profile("rounded crease folder",[(-.065,0),(-.061,.008),(.045,.009),(.068,.002),(.070,0),(.068,-.002),(.045,-.009),(-.061,-.008)],.006,0,"paper")
        a.add(item_id,obj);view["scale"]=.18
    elif item_id=="pe-hat":
        brim=a.cylinder(item_id,"broad hat brim",(0,0,.008),.11,.004,"card")
        brim.scale.y=.85
        bpy.ops.mesh.primitive_cone_add(vertices=64,radius1=.064,radius2=.047,depth=.065,location=(0,0,.041))
        a.add(item_id,S.finish(bpy.context.object,"hat crown","card"))
        band=ring_z(a,item_id,"bright hat stripe",(0,0,.022),.062,.059,.017,"orange")
        view["target"]=(0,0,.025);view["scale"]=.27
    elif item_id=="ka-former":
        points=[(0,.039/math.sqrt(3)),(-.0195,-.0195/math.sqrt(3)),(.0195,-.0195/math.sqrt(3))]
        a.add(item_id,S.profile("triangular folding former",points,.060,0,"teal"));view["scale"]=.10
    elif item_id=="ka-tape":
        a.add(item_id,S.annulus("binding tape roll",(0,0,0),.023,.010,.015,"orange"))
        a.box(item_id,"ready tape end",(.025,0,-.016),(.034,.014,.0005),"orange");view["scale"]=.09
    elif item_id in {"film-pencil","film-colours"}:
        colors=["ink"] if item_id=="film-pencil" else ["orange","teal","paper"]
        for j,color in enumerate(colors):
            x=(j-(len(colors)-1)/2)*.012
            a.cylinder(item_id,"pencil body",(x,0,.066),.0035,.120,color)
            bpy.ops.mesh.primitive_cone_add(vertices=6,radius1=0,radius2=.0035,depth=.012,location=(x,0,0))
            a.add(item_id,S.finish(bpy.context.object,"sharpened wooden pencil","birch"))
            a.cylinder(item_id,"graphite or colour point",(x,0,-.006),.0005,.003,color)
            if item_id=="film-pencil":a.cylinder(item_id,"soft eraser",(x,0,.132),.0035,.010,"orange")
        view["target"]=(0,0,.065);view["scale"]=.17
    elif item_id=="film-fish-stencil":
        from picture_drum import FISH_OUTLINE
        plate=a.box(item_id,"reusable fish stencil",(0,0,0),(.045,.002,.030),"teal")
        fish=FISH_OUTLINE
        cutter=S.profile("temporary fish opening",fish,.01,0,"ink")
        import bmesh
        bm=bmesh.new();bm.from_mesh(cutter.data)
        bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(cutter.data);bm.free()
        bpy.context.view_layer.objects.active=plate
        mod=plate.modifiers.new("actual stencil opening","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
        bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
        view["location"]=(.08,-.2,.1);view["scale"]=.10
    return a.result(view=view)
