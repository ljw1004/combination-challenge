"""Ready-made game props, with literal dimensions and shared reward-scene forms."""
import math

PROP_IDS={"wr-starting-gate","air-test-block","air-fruit-game","flight-level",
          "flight-screen-stand","fair-rover-paper","fair-written-banner","fair-start-key"}


def build_model(identity):
    import bpy
    import scene_parts as S
    from construction import Assembly,ring_z,surface,special_material
    if identity not in PROP_IDS:raise ValueError("Unsupported prop "+identity)
    a=Assembly(identity)
    view={"location":(.5,-.75,.6),"target":(0,0,.05),"scale":.25}
    if identity=="wr-starting-gate":
        for y in (-.15,.15):
            a.box(identity,"broad arch foot",(0,y,.008),(.120,.060,.016),"birch")
            post=a.box(identity,"slotted gate upright",(0,y,.183),(.025,.030,.350),"teal")
            cutter=S.box("temporary upright channel",(0,y-math.copysign(.006,y),.172),(.008,.020,.300))
            bpy.context.view_layer.objects.active=post
            mod=post.modifiers.new("open bar guide channel","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
            bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
        a.box(identity,"arch crosspiece",(0,0,.350),(.025,.330,.016),"teal")
        slider=a.add(identity,S.empty("hand-lifted starting bar"));slider.location.z=.045
        a.box(identity,"retained gate bar",(0,0,0),(.006,.290,.010),"orange",slider)
        handle=ring_z(a,identity,"bar hand loop",(0,0,.065),.014,.010,.004,"orange")
        handle.parent=slider;handle.location=(0,0,.020);handle.rotation_euler=(0,0,math.pi/2)
        # A short stem joins the handle ring directly to the bar.
        a.line(identity,"hand loop stem",[(0,0,.004),(0,0,.010)],.003,"orange",slider)
        view={"location":(.58,-.75,.5),"target":(0,0,.175),"scale":.44}
        return a.result(view=view,bar=slider,bar_range=(.045,.310))
    if identity=="air-test-block":
        a.box(identity,"light wooden test block",(0,0,.010),(.024,.020,.020),"birch")
        view["target"]=(0,0,.01);view["scale"]=.055
    elif identity=="air-fruit-game":
        # The orange is the same 24 mm sphere used by the reviewed grip test.
        for name,location,radius,color in [("sponge orange",(-.040,0,.012),.012,"orange"),("sponge pear",(-.012,.020,.013),.013,"teal")]:
            bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=16,radius=radius,location=location)
            a.add(identity,S.finish(bpy.context.object,name,color))
        bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=16,radius=.008,location=(-.012,.020,.027))
        a.add(identity,S.finish(bpy.context.object,"pear narrow top","teal"))
        a.line(identity,"soft pear stalk",[(-.012,.020,.032),(-.010,.020,.039)],.0015,"birch")
        ring_z(a,identity,"collecting cup wall",(.030,0,.019),.027,.024,.035,"teal")
        a.cylinder(identity,"collecting cup bottom",(.030,0,.0025),.026,.003,"teal")
        view["target"]=(0,0,.015);view["scale"]=.13
    elif identity=="flight-level":
        body=a.box(identity,"small spirit level body",(0,0,.009),(.085,.022,.018),"teal")
        cutter=S.box("temporary vial window",(0,0,.009),(.040,.030,.009))
        bpy.context.view_layer.objects.active=body
        mod=body.modifiers.new("clear vial window","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
        bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
        glass=special_material("level vial",(.8,.95,.72),roughness=.1,transmission=.6)
        vial=a.cylinder(identity,"enclosed level vial",(0,0,.009),.0042,.049,"paper","X");surface(vial,glass)
        a.cylinder(identity,"central air bubble",(0,-.0001,.009),.003,.007,"paper","X")
        for x in (-.006,.006):
            ring=a.add(identity,S.annulus("bubble centring mark",(0,0,0),.0045,.0042,.0007,"ink"));ring.rotation_euler.z=math.pi/2;ring.location=(x,0,.009)
        view["target"]=(0,0,.009);view["scale"]=.115
    elif identity=="flight-screen-stand":
        # Two square telescoping posts, with retaining collars and captive pins.
        # Cloth spans 900 x 1500 mm; bottom 250 mm, top 1750 mm in the garden.
        for x in (-.480,.480):
            a.box(identity,"screen stand foot",(x,0,.018),(.200,.500,.036),"teal")
            sleeve=a.box(identity,"hollow lower post",(x,0,.495),(.032,.032,.954),"birch")
            cutter=S.box("post channel",(x,0,.510),(.022,.022,1.00))
            bpy.context.view_layer.objects.active=sleeve
            mod=sleeve.modifiers.new("telescoping post channel","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
            bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
            stem=a.box(identity,"upper sliding post",(x,0,1.260),(.020,.020,1.080),"birch")
            for z in (.780,.860,.940):S.bore(stem,(x,0,z),.0032,.040,"Y")
            S.bore(sleeve,(x,0,.940),.0032,.050,"Y")
            a.cylinder(identity,"captive height pin",(x,0,.940),.003,.044,"ink","Y")
            for z in (.250,1.750):
                a.line(identity,"cloth clip bracket",[(x,0,z),(math.copysign(.450,x),0,z)],.005,"teal")
                for y in (-.002,.002):
                    a.box(identity,"cloth clamping jaw",(math.copysign(.450,x),y,z),(.022,.002,.018),"orange")
                    a.box(identity,"soft cloth gripping pad",(math.copysign(.450,x),math.copysign(.000875,y),z),(.020,.00025,.016),"teal")
        a.box(identity,"top linking bar",(0,0,1.780),(.980,.022,.020),"teal")
        view={"location":(2.1,-3.4,2.1),"target":(0,0,.9),"scale":2.05}
    elif identity in {"fair-rover-paper","fair-written-banner"}:
        a.box(identity,"long cream banner",(0,0,.100),(.600,.001,.120),"paper")
        for x in (-.300,.300):
            ring=a.add(identity,S.annulus("banner hanging clip",(x,0,.160),.008,.006,.006,"teal",gap=1.5))
            a.box(identity,"banner clip jaw",(x,-.002,.153),(.012,.004,.014),"teal")
        if identity=="fair-written-banner":
            # Original geometry makes the loop border and lettering sharp at any size.
            for z in (.052,.148):
                a.line(identity,"rover loop border",[(x,-.001,z+.005*math.sin(x*130)) for x in [-.27+i*.54/360 for i in range(361)]],.001,"orange")
            curve=bpy.data.curves.new("hand lettered welcome","FONT");curve.body="WELCOME";curve.align_x="CENTER";curve.size=.066;curve.extrude=.0001
            text=bpy.data.objects.new("WELCOME",curve);bpy.context.collection.objects.link(text)
            text.rotation_euler.x=math.pi/2;text.location=(0,-.001,.080);text.data.materials.append(S.material("ink"))
            bpy.context.view_layer.objects.active=text;text.select_set(True);bpy.ops.object.convert(target="MESH");text=bpy.context.object;text.select_set(False);a.add(identity,text)
        view={"location":(.1,-1.,.35),"target":(0,0,.10),"scale":.68}
    elif identity=="fair-start-key":
        ring_z(a,identity,"removable key bow",(0,0,0),.014,.007,.004,"orange")
        a.box(identity,"key shaft",(0,.027,0),(.005,.035,.003),"ink")
        a.box(identity,"key ward",(.003,.040,0),(.009,.006,.003),"ink")
        view["target"]=(0,.015,0);view["scale"]=.075
    return a.result(view=view)
