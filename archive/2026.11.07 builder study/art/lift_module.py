"""Canonical original lift module and its later whale extension kit.

Metres, z up. Root origin is the underside of the removable slotted tray.
The compact transported module is 440 x 306 x 166 mm, including its lower
frame below that origin. A 170 mm height reservation is appropriate. Original
123 mm supports never scale: the whale kit inserts four 366 mm struts below
them. Moving the same counterweight from front to rear slot is a cold,
supported reconfiguration, not an invisible change to the weight or tray.

No scene/file effects on import. build_model(...,include_stand=False) leaves
root at zero for crane or whale parenting. Supplied electrical internals and
the fictional world-up tile force remain declared modules, not certification.
"""
import math

COMPACT_INTERFACE={
    "origin":"tray underside", "footprint_m":[.440,.306],
    "z_range_m":[-.006,.160], "reserved_height_m":.170,
    "original_support_length_m":.123,"extension_length_m":.366,
    "sling_eyes_m":[[-.075,0,.152],[.075,0,.152]],"sling_eye_bore_radius_m":.004,
    "sling_eye_outer_radius_m":.008,"suggested_sling_rise_m":.140,
    "lift_point_m":[0,0,.135],"assumed_mass_kg":.985,
}
EXTENSION=.366
TRAY_ORIGIN_IN_WHALE=(0,0,.119)
TRACKS={"front":-.082,"rear":.082}
COUNTERWEIGHT_OFFSET_Y=.028
TRIM_RANGE=(-.185,.125)
# Only this interval is reachable through the installed whale service opening.
# Wider reconfiguration takes place with the supported module outside its skin.
INSTALLED_HANDLE_RANGE=(0.,.098)
PRIMITIVES={"lift-base","lift-posts","lift-tether","lift-tile","lift-pack","lift-switch",
            "lift-cradle","lift-weight","lift-tray","lift-offset-load","lift-slider",
            "lift-control","lift-stop","whale-module-mount","flight-trim-handle"}
STATES={key:{key} for key in PRIMITIVES}
STATES.update({
    "lift-tethered-base":{"lift-base","lift-tether"},
    "lift-guided-base":{"lift-base","lift-tether","lift-posts"},
    "lift-switched-pack":{"lift-pack","lift-switch"},
    "lift-cradled-tile":{"lift-tile","lift-cradle"},
})
STATES["lift-ready"]=STATES["lift-guided-base"]|STATES["lift-cradled-tile"]
STATES["lift-rising"]=STATES["lift-ready"]|STATES["lift-switched-pack"]
STATES["lift-load-tested"]=STATES["lift-rising"]|{"lift-weight"}
STATES["lift-tray-test"]=STATES["lift-load-tested"]|{"lift-tray"}
STATES["lift-tilting-test"]=STATES["lift-tray-test"]|{"lift-offset-load"}
STATES["lift-balanced-test"]=STATES["lift-tilting-test"]|{"lift-slider"}
STATES["lift-variable-test"]=(STATES["lift-balanced-test"]-{"lift-switch"})|{"lift-control"}
STATES["lift-stop-test"]=STATES["lift-variable-test"]|{"lift-stop"}
STATES["balanced-lift"]={"lift-tile","lift-cradle","lift-pack","lift-tray","lift-slider","lift-control","lift-stop"}


def compact_mass_proof():
    parts=[("tile and upper cradle",.130,(0,0,.126)),
           ("tray, original supports, lower frame and holders",.320,(0,0,.026)),
           ("tile battery",.250,(0,.03545,.057)),
           ("controller, stop and harness",.035,(0,.1325,.066)),
           ("counterweight in front slot",.250,(0,-.054,.021))]
    mass=sum(p[1] for p in parts)
    cg=tuple(sum(m*p[i] for _,m,p in parts)/mass for i in range(3))
    return {"mass_kg":mass,"cg_m":cg,"lift_above_cg_m":.135-cg[2],
            "parts":[{"name":n,"mass_kg":m,"cg_m":p} for n,m,p in parts],
            "limit":"Explicit static toy mass assumptions; not structural, crane-capacity, electrical or lift certification."}


def build_model(state="balanced-lift",configuration="compact",include_stand=True):
    import bpy
    from mathutils import Vector
    from scene_parts import box,cylinder,bore,annulus,empty,stroke,rod,material
    if configuration not in {"compact","extended"}:raise ValueError(configuration)
    extension=EXTENSION if configuration=="extended" else 0.
    root=empty("LIFT MODULE — tray underside origin")
    assembly=empty("COMPLETE LIFT FAMILY — module and removable stationary stand")
    root.parent=assembly
    root["compact_interface_m"]=str(COMPACT_INTERFACE)
    upper=empty("original upper cradle and unchanged 123 mm supports",(0,0,extension));upper.parent=root
    stand=empty("STATIONARY lift test stand");stand.parent=assembly
    parts={key:[] for key in PRIMITIVES};geometry=[];attachments=[]
    def tag(obj,part,parent=root,role=""):
        obj.parent=parent;obj["part_id"]=part;obj["family"]="lift-module"
        if role:obj["mechanical_role"]=role
        parts[part].append(obj)
        if obj.type in {"MESH","CURVE"}:geometry.append(obj)
        return obj
    def cut(obj,cutter,name):
        bpy.context.view_layer.objects.active=obj;mod=obj.modifiers.new(name,"BOOLEAN")
        mod.operation="DIFFERENCE";mod.object=cutter;bpy.ops.object.modifier_apply(modifier=mod.name)
        bpy.data.objects.remove(cutter,do_unlink=True)
    def ring_z(name,pos,outer,inner,depth,color="teal",part="lift-cradle",parent=root):
        obj=annulus(name,(0,0,0),outer,inner,depth,color)
        obj.rotation_euler.x=math.pi/2;obj.location=pos
        return tag(obj,part,parent)
    # Original lower frame supports the battery holder before the tray is added.
    lower_frame=[]
    for x in [-.105,.105]:
        beam=box("original lower support crossbar",(x,0,-.003),(.012,.306,.006))
        for y in TRACKS.values():
            cut(beam,box("temporary captive shoe passage",(x,y,-.0013),(.020,.016,.0046)),"actual captive-shoe passage")
        lower_frame.append(tag(beam,"lift-cradle",role="lower-frame"))
    for y in [-.145,.145]:lower_frame.append(tag(box("original lower frame side rail",(0,y,-.003),(.218,.012,.006)),"lift-cradle",role="lower-frame"))
    # Original short supports are translated as rigid pieces in the extended state.
    supports=[];extensions=[]
    for x in [-.105,.105]:
        tag(box("upper cradle end crossbar",(x,0,.120),(.012,.306,.020)),"lift-cradle",upper)
        for y in [-.145,.145]:
            support=cylinder("original 123 mm rigid hanging support",(x,y,.0585),.0025,.123,"birch","Z")
            bore(support,(x,y,.005),.0009,.012,"X")
            supports.append(tag(support,"lift-cradle",upper,role="original-short-support"))
            if extension:
                ext=cylinder("supplied 366 mm extension strut",(x,y,.180),.0025,.366,"birch","Z")
                bore(ext,(x,y,.355),.0009,.012,"X");extensions.append(tag(ext,"whale-module-mount",role="extension-strut"))
                ring_z("locked support extension sleeve",(x,y,.363),.0045,.0026,.030,part="whale-module-mount")
                for z in [.355,.371]:
                    tag(cylinder("sleeve transverse retaining pin",(x,y,z),.0008,.012,"ink","X"),"whale-module-mount")
            ring_z("lower-frame rod foot collar",(x,y,.001),.005,.0025,.008)
    for y in [-.095,.095]:tag(box("upper padded cradle rail",(0,y,.120),(.218,.015,.020),"teal"),"lift-cradle",upper)
    for x in [-.075,.075]:
        for y in [-.075,.075]:
            tag(box("tile seating block",(x,y,.118),(.025,.025,.014),"teal"),"lift-cradle",upper)
            tag(box("compressed tile seating felt",(x,y,.126),(.025,.025,.002),"paper"),"lift-cradle",upper)
        tag(stroke("original tile top retaining strap",[(x,-.095,.120),(x,-.085,.145),(x,.085,.145),(x,.095,.120)],.002,"ink"),"lift-cradle",upper)
        eye=annulus("closed original lifting eye",(x,0,.152),.008,.004,.004,"teal")
        tag(eye,"lift-cradle",upper)
        outer_x=math.copysign(.105,x)
        tag(box("lifting eye outside-tile support post",(outer_x,0,.137),(.014,.014,.014),"teal"),"lift-cradle",upper)
        tag(box("lifting eye bridge above tile",((x+outer_x)/2,0,.145),(.044,.014,.002),"teal"),"lift-cradle",upper)
    tile=tag(box("fictional upward-force tile",(0,0,.135),(.170,.170,.016),"teal",.003),"lift-tile",upper)
    violet=material("teal").copy();violet.name="lift module violet tile"
    violet.diffuse_color=(.36,.16,.65,1);violet.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value=(.36,.16,.65,1)
    tile.data.materials.clear();tile.data.materials.append(violet)
    # Real tray slots serve both tracks and clear the already-installed pack holder.
    tray=box("original 3 mm slotted plywood tray",(0,0,.0015),(.440,.300,.003),"teal")
    for y in [-.082,0,.082]:cut(tray,box("temporary trim slot",(0,y,.0015),(.390,.008,.020)),"real longitudinal tray slot")
    for y in [.015,.055]:cut(tray,box("temporary battery holder beam relief",(0,y,.0015),(.221,.008,.020)),"battery holder beam relief")
    for x in [-.105,.105]:
        for y in [-.145,.145]:bore(tray,(x,y,.0015),.0032,.020,"Z")
    tag(tray,"lift-tray",role="tray")
    for x in [-.219,.161]:
        for y in TRACKS.values():tag(box("captive shoe travel stop",(x,y+.028,.013),(.002,.040,.020),"teal"),"lift-tray",role="trim-stop")
    # Battery has a continuous bearing shelf, four posts and a closed strap loop.
    for y in [.015,.055]:tag(box("battery holder frame bridge",(0,y,.0025),(.218,.007,.005),"teal"),"lift-pack",role="battery-support")
    for x in [-.048,.048]:
        for y in [.015,.055]:tag(rod("battery shelf post",(x,y,.005),(x,y,.0315),.003,"teal"),"lift-pack",role="battery-support")
    shelf=tag(box("continuous battery bearing shelf",(0,.03545,.0335),(.120,.070,.004),"teal"),"lift-pack",role="battery-shelf")
    battery=tag(box("enclosed original tile battery",(0,.03545,.057),(.112,.060,.043),"ink",.002),"lift-pack",role="battery")
    for x in [-.045,.045]:
        y0=.00345;y1=.06745
        tag(stroke("closed battery retaining strap",[(x,y0,.0295),(x,y0,.0805),(x,y1,.0805),(x,y1,.0295),(x,y0,.0295)],.002,"teal"),"lift-pack")
    # Rear-overhanging controller shelf is bolted to posts ahead of the trim route.
    for x in [-.024,.024]:
        for y in [.045,.060]:tag(rod("controller shelf front post",(x,y,.003),(x,y,.044),.003,"teal"),"lift-control",role="controller-support")
    tag(box("controller cantilever shelf",(0,.0975,.046),(.065,.105,.004),"teal"),"lift-control",role="controller-support")
    controller=tag(box("current controller declared module",(0,.1325,.066),(.060,.025,.036),"ink",.002),"lift-control",role="controller")
    bore(controller,(.023,.140,.075),.0022,.025,"Y")
    tag(annulus("controller remote lead socket",(.023,.146,.075),.0038,.0022,.004,"teal"),"lift-control")
    tag(cylinder("controller adjustment dial",(0,.149,.066),.008,.008,"orange","Y"),"lift-control")
    tag(box("latched stop declared module",(.180,.1405,.085),(.025,.025,.025),"ink"),"lift-stop",role="stop")
    tag(box("stop module bearing bracket",(.180,.135,.037),(.030,.030,.071),"teal"),"lift-stop",role="stop-support")
    # A captive T shoe passes through the actual slot and relieved frame crossings.
    slider=tag(empty("unchanged removable counterweight and captive shoe"),"lift-slider")
    weight=tag(box("250 g aluminium counterweight",(0,.028,.021),(.065,.040,.035),"ink"),"lift-slider",slider,role="moving-weight")
    for y in [.010,.046]:bore(weight,(0,y,.021),.0022,.012,"Y")
    foot=box("counterweight clamping foot",(0,.020,.0065),(.050,.056,.003),"teal")
    bore(foot,(0,0,.0065),.0017,.020,"Z");tag(foot,"lift-slider",slider,role="moving-clamp")
    tag(box("captive under-tray T shoe",(0,0,-.0015),(.014,.014,.003),"teal"),"lift-slider",slider,role="moving-shoe")
    tag(cylinder("captive trim screw",(0,0,.00475),.0015,.0155,"ink","Z"),"lift-slider",slider,role="moving-clamp")
    ring_z("trim screw washer",(0,0,.009),.005,.0017,.002,"ink","lift-slider",slider)
    tag(cylinder("trim screw finger head",(0,0,.0125),.004,.005,"orange","Z"),"lift-slider",slider,role="moving-clamp")
    handle_carrier=empty("removable trim handle insertion pose");handle_carrier.parent=slider
    handle=tag(cylinder("same removable trim handle",(0,.100,.021),.002,.120,"ink","Y"),"flight-trim-handle",handle_carrier,role="moving-handle")
    # Original tests use concrete loads; both are left with the stand on removal.
    tag(box("original hanging test weight",(0,-.060,.060),(.030,.030,.030),"orange"),"lift-weight")
    tag(stroke("test weight hook",[(0,-.095,.120),(0,-.060,.115),(0,-.060,.075)],.0012,"ink"),"lift-weight")
    tag(box("off-centre tray test block",(.170,-.040,.023),(.040,.040,.040),"orange"),"lift-offset-load")
    switch=tag(box("spring-return original test switch",(.200,-.080,.018),(.040,.030,.030),"teal"),"lift-switch")
    tag(cylinder("hold-to-lift button",(.200,-.080,.038),.008,.010,"orange","Z"),"lift-switch")
    tag(stroke("replaceable switched pack lead",[(0,.005,.057),(.160,-.080,.035),(.200,-.080,.025)],.0012),"lift-switch")
    tag(stroke("test switch to tile lead",[(.200,-.080,.025),(.105,-.145,.060),(.105,-.145,.120),(.075,-.075,.135)],.0012),"lift-switch")
    tag(stroke("battery output to controller input",[(0,.06545,.057),(0,.078,.065),(0,.120,.066)],.0012),"lift-control")
    tag(stroke("controller harness beside support lower pigtail",[(.023,.1325,.084),(.040,.1325,.090),(.114,.1325,.090),(.114,.145,.090),(.114,.145,.095)],.0012),"lift-control")
    tag(stroke("unchanged upper tile pigtail",[(.114,.145,.095+extension),(.114,.145,.145+extension),(.090,.090,.145+extension),(.085,.075,.135+extension)],.0012),"lift-control")
    if extension:
        tag(stroke("supplied 366 mm harness extension alongside strut",[(.114,.145,.095),(.114,.145,.095+extension)],.0012),"whale-module-mount")
        for z in [.0975,.0925+extension]:
            ring_z("harness extension insulated inline connector",(.114,.145,z),.0024,.0013,.005,"teal","whale-module-mount")
    tethers=[];stand_geometry=[]
    if include_stand:
        root.location.z=.032
        stand_geometry.append(tag(box("padded lift test stand base",(0,0,.010),(.520,.380,.020),"teal"),"lift-base",stand))
        for x in [-.105,.105]:
            for y in [-.120,.120]:stand_geometry.append(tag(box("stand landing felt",(x,y,.023),(.035,.035,.006),"paper"),"lift-base",stand))
        for x in [-.245,.245]:
            for y in [-.175,.175]:
                stand_geometry.append(tag(cylinder("loose-clearance guide post",(x,y,.160),.004,.280,"birch","Z"),"lift-posts",stand))
                stand_geometry.append(tag(cylinder("guide-post captive wingnut",(x,y,.306),.008,.008,"orange","Z"),"lift-posts",stand))
        for y in [-.175,.175]:
            crossbar=box("removable guide crossbar",(0,y,-.002),(.490,.010,.006),"teal")
            for x in [-.245,.245]:bore(crossbar,(x,y,-.002),.0065,.030,"Z")
            tag(crossbar,"lift-posts")
            for x in [-.105,.105]:
                tag(box("guide crossbar removable frame clamp",(x,(y+math.copysign(.145,y))/2,-.002),(.016,.038,.008),"teal"),"lift-posts")
            for x in [-.245,.245]:
                ring_z("loose sliding post guide",(x,y,.001),.008,.0065,.012,part="lift-posts")
        tag(annulus("stand tether anchor",(0,-.150,.026),.006,.003,.004,"orange"),"lift-tether",stand)
        tag(annulus("module short tether frame clip",(0,-.145,-.003),.006,.003,.004,"orange"),"lift-tether")
        tether=tag(stroke("original short stand tether",[(0,-.150,.026),(0,-.145,.029)],.0011),"lift-tether",stand)
        tethers.append(tether)
    model={"root":assembly,"module_root":root,"upper":upper,"stand_root":stand,"parts":parts,"geometry":geometry,
           "slider":slider,"weight":weight,"trim_handle":handle,"handle_carrier":handle_carrier,
           "tray":tray,"battery":battery,"battery_shelf":shelf,"controller":controller,
           "supports":supports,"extensions":extensions,"lower_frame":lower_frame,
           "configuration":configuration,"include_stand":include_stand,"tethers":tethers,
           "state":state,"view":{"location":(.7,-1,.55),"target":(0,0,.10),"scale":.57}}
    set_state(model,state)
    return model


def set_state(model,state):
    if state not in STATES:raise ValueError("Unknown lift identity: "+state)
    active=set(STATES[state])
    if model["configuration"]=="extended" and "lift-cradle" in active:active.add("whale-module-mount")
    for part,objects in model["parts"].items():
        for obj in objects:obj.hide_render=part not in active;obj.hide_viewport=part not in active
    model["state"]=state
    apply_pose(model,lift=.100 if state in {"lift-rising","lift-load-tested"} else 0,
               counterweight_x=-.10 if state in {"lift-balanced-test","lift-variable-test","lift-stop-test"} else 0,
               show_handle=state=="flight-trim-handle")
    return active


def apply_pose(model,lift=0.,counterweight_x=0.,show_handle=False):
    if not TRIM_RANGE[0]<=counterweight_x<=TRIM_RANGE[1]:raise ValueError("Counterweight is outside its physical travel")
    if not 0<=lift<=.100:raise ValueError("Original short tether limits stand lift to 100 mm")
    track="rear" if model["configuration"]=="extended" else "front"
    model["slider"].location=(counterweight_x,TRACKS[track],0)
    model["handle_carrier"].location=(0,.056 if track=="front" else 0,0)
    model["handle_carrier"].rotation_euler.z=math.pi if track=="front" else 0
    model["trim_handle"].hide_render=not show_handle;model["trim_handle"].hide_viewport=not show_handle
    if model["include_stand"]:
        model["module_root"].location.z=.032+lift
        for obj in model["tethers"]:
            # Low managed slack: the centre bend lies on the padded base until taut.
            start=(0,-.145,.029+lift);end=(0,-.150,.026)
            length=math.dist((0,-.145,.129),end)
            lo,hi=0.,length
            for _ in range(60):
                middle=(lo+hi)/2;point=(middle,-.15,.026)
                if math.dist(start,point)+math.dist(point,end)>length:hi=middle
                else:lo=middle
            points=[start,(lo,-.15,.026),end]
            obj.data.splines.clear();spline=obj.data.splines.new("POLY");spline.points.add(2)
            for p,co in zip(spline.points,points):p.co=(*co,1)
    return {"track":track,"counterweight_x_m":counterweight_x,"lift_m":lift}
