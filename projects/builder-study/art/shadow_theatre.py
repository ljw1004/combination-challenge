"""Canonical small star projector: metres, z up, audience along negative y.

Local box envelope is 180 x 130 x 130 mm. The y-axis input shaft is at z=.058;
the lens centre is (0,-.074,.116). Mount at (.245,0,.260) in flying_whale to
preserve the reviewed belt/lens interfaces. The upper-rim disc window is honest:
this projects drifting stars, not a magically centred image of the whole disc.

The supplied lamp module is a diffuse low-voltage LED panel; the source includes
its diffuser, holder and current-limiting resistor. The box includes a fixed
internal window. One convex lens forms a real inverted image. Projection proof
uses an ideal thin lens, not a claim of measured brightness or optical quality.
No scene, file or render side effects occur on import. Runtime animation is not
required: ``apply_pose`` supplies exact still poses from the same source model.
"""
from dataclasses import dataclass,asdict
import math


@dataclass(frozen=True)
class Dimensions:
    width:float=.180
    depth:float=.130
    height:float=.130
    wall:float=.002
    spindle_z:float=.058
    spindle_radius:float=.003
    spindle_front:float=-.169
    spindle_rear:float=.062
    bearing_radius:float=.0033
    disc_y:float=.025
    disc_radius:float=.0548
    disc_thickness:float=.0012
    window_y:float=.020
    window_z:float=.10808
    window_half_width:float=.006
    window_half_height:float=.004
    lens_y:float=-.074
    lens_z:float=.116
    lens_radius:float=.008
    lens_thickness:float=.003
    optical_slope:float=.080
    focus_travel:float=.006
    screen_y:float=-1.400
    led_y:float=.054
    led_z:float=.10576
    led_half_width:float=.011
    led_half_height:float=.006


DIMS=Dimensions()
PRIMITIVE_IDS=("theatre-box","theatre-foil","theatre-lamp","theatre-power",
               "theatre-card","theatre-punch","theatre-stars",
               "theatre-spindle","theatre-lens","theatre-slider","theatre-hood",
               "theatre-handwheel","theatre-cloth")
STATES={
    "theatre-box":{"theatre-box"},
    "theatre-lined":{"theatre-box","theatre-foil"},
    "theatre-lit-box":{"theatre-box","theatre-foil","theatre-lamp"},
    "theatre-powered-box":{"theatre-box","theatre-foil","theatre-lamp","theatre-power"},
    "theatre-power":{"theatre-power"},
    "theatre-shadow-wheel":{"theatre-stars","theatre-spindle"},
    "theatre-focus":{"theatre-lens","theatre-slider"},
}
STATES["theatre-wheel-box"]=STATES["theatre-powered-box"]|STATES["theatre-shadow-wheel"]
STATES["theatre-blurry"]=STATES["theatre-wheel-box"]
STATES["theatre-focus-box"]=STATES["theatre-blurry"]|STATES["theatre-focus"]
STATES["theatre-focus-ready"]=STATES["theatre-focus-box"]
STATES["theatre-hooded"]=STATES["theatre-focus-box"]|{"theatre-hood"}
STATES["shadow-theatre"]=STATES["theatre-hooded"]|{"theatre-handwheel"}
for _part in PRIMITIVE_IDS:STATES.setdefault(_part,{_part})


def star_holes():
    """Prepared punched pattern; the same coordinates cut mesh and form images."""
    return [{"radius":r,"angle":2*math.pi*j/36+phase,"outer":.00075,"inner":.00032}
            for r,phase in [(.046,0),(.049,.045),(.052,.090)] for j in range(36)]


def optical_basis(d=DIMS):
    norm=math.hypot(1,d.optical_slope)
    return (0,-1/norm,d.optical_slope/norm),(1,0,0),(0,d.optical_slope/norm,1/norm)


def optical_parameters(d=DIMS):
    axis,_,_=optical_basis(d)
    object_distance=(d.disc_y-d.lens_y)*math.hypot(1,d.optical_slope)
    image_distance=(d.lens_y-d.screen_y)*math.hypot(1,d.optical_slope)
    focal_length=1/(1/object_distance+1/image_distance)
    return {"object_distance_m":object_distance,"image_distance_m":image_distance,
            "focal_length_m":focal_length,"centre_magnification":-image_distance/object_distance,
            "optical_axis":axis,"lens_centre_m":(0,d.lens_y,d.lens_z)}


def projected_stars(theta,screen_y=None,focus_offset=0,d=DIMS):
    """Real inverted thin-lens images at a screen; includes aperture clipping.

    Return only holes completely within the fixed window. The projection of each
    corner is the chief ray through lens centre. Focus error reports the finite
    aperture blur estimate at that screen; no decorative light replaces a ray.
    Coordinates are theatre-local, so mount and flight translation apply normally.
    """
    if screen_y is None:screen_y=d.screen_y
    if abs(focus_offset)>d.focus_travel:raise ValueError("lens travel exceeded")
    axis,_,_=optical_basis(d)
    lens=(axis[0]*focus_offset,d.lens_y+axis[1]*focus_offset,d.lens_z+axis[2]*focus_offset)
    f=optical_parameters(d)["focal_length_m"]
    output=[]
    for index,hole in enumerate(star_holes()):
        angle=hole["angle"]+theta
        x=hole["radius"]*math.cos(angle);z=d.spindle_z+hole["radius"]*math.sin(angle)
        vertices=[]
        for j in range(10):
            a=angle+j*math.pi/5;r=hole["outer"] if j%2==0 else hole["inner"]
            vertices.append((x+r*math.cos(a),d.disc_y,z+r*math.sin(a)))
        # The baffle is slightly in front of the disc. Conservatively require
        # the complete physical hole to fit the window, not merely its centre.
        if not all(abs(v[0])<=d.window_half_width and abs(v[2]-d.window_z)<=d.window_half_height for v in vertices):continue
        projected=[];blur=[];source_needed=[]
        for v in vertices:
            s=-sum((v[i]-lens[i])*axis[i] for i in range(3))
            if s<=f:continue
            image_distance=1/(1/f-1/s)
            direction=tuple(lens[i]-v[i] for i in range(3))
            t=(screen_y-lens[1])/direction[1]
            point=tuple(lens[i]+t*direction[i] for i in range(3))
            axial_screen=sum((point[i]-lens[i])*axis[i] for i in range(3))
            blur.append(2*d.lens_radius*abs(axial_screen-image_distance)/image_distance)
            projected.append(point)
            # Backtrace the chief ray through the physical hole to the diffuse LED.
            u=(d.led_y-v[1])/(v[1]-lens[1])
            source_needed.append((v[0]+u*(v[0]-lens[0]),v[2]+u*(v[2]-lens[2])))
        illuminated=all(abs(p[0])<=d.led_half_width and abs(p[1]-d.led_z)<=d.led_half_height for p in source_needed)
        if illuminated and len(projected)==10:
            output.append({"hole_index":index,"polygon_m":projected,"max_blur_diameter_m":max(blur),
                           "mask_centre_m":(x,d.disc_y,z)})
    return output


def proof(samples=360,d=DIMS):
    optics=optical_parameters(d);counts=[];blur=[];bounds=[]
    for i in range(samples):
        stars=projected_stars(2*math.pi*i/samples,d=d)
        counts.append(len(stars))
        blur.extend(p["max_blur_diameter_m"] for p in stars)
        bounds.extend(v for p in stars for v in p["polygon_m"])
    return {"status":"Canonical prototype geometry; optical performance unmeasured", "dimensions":asdict(d),
            "optics":optics,"sample_count":samples,"punched_star_count":len(star_holes()),
            "fully_visible_stars_per_pose":[min(counts),max(counts)],
            "max_thin_lens_blur_diameter_at_screen_m":max(blur),
            "screen_image_bounds_m":[[min(v[i] for v in bounds) for i in range(3)],
                                      [max(v[i] for v in bounds) for i in range(3)]],
            "minimum_disc_to_box_floor_m":d.spindle_z-d.disc_radius-d.wall,
            "minimum_disc_to_baffle_m":d.disc_y-d.disc_thickness/2-(d.window_y+.001),
            "shaft_bearing_radial_clearance_m":d.bearing_radius-d.spindle_radius,
            "stage_ids":sorted(STATES),
            "required_manuscript_hardware":[
                "Prepared box includes the projection opening and internal window; the wheel shows a changing small patch, not its whole face.",
                "Lamp module includes a broad diffuse emitter, holder and current-limiting resistor. A naked point LED does not evenly illuminate this field.",
                "Spindle package includes two bushed supports, disc clamp and exposed shaft for detachable handle or later pulley.",
                "Switch both supplies off; disconnect/remove original lamp battery before connecting the compatible accessory supply.",
            ],
            "limits":["One ideal thin lens; focal length and curvature are nominal. Aberration, LED brightness, heat, power and real focus tolerance are unmeasured.",
                      "Chief-ray illumination and full-hole window clipping are checked; edge fragments are omitted from the proof image rather than invented.",
                      "Projection uses upper disc annulus. The complete sky does not rotate about its image centre.",
                      "Real optical materials and component sourcing remain to be selected; this is not a manufactured optical certification."]}


def d_socket(name,center,outer=.007,inner=.0031,flat=.0023,depth=.015,color="orange",samples=96):
    """Actual flat-sided y-axis socket for the prepared D shaft, also used by its pulley."""
    import bpy
    from scene_parts import finish
    count=samples;cx,cy,cz=center
    vertices=[]
    for y in [-depth/2,depth/2]:
        for outside in [True,False]:
            radius=outer if outside else inner
            for i in range(count):
                a=2*math.pi*i/count;x=radius*math.cos(a)
                vertices.append((cx+(x if outside else min(x,flat)),cy+y,cz+radius*math.sin(a)))
    faces=[]
    for i in range(count):
        j=(i+1)%count
        faces += [(i,j,count+j,count+i),(2*count+i,3*count+i,3*count+j,2*count+j),
                  (i,2*count+i,2*count+j,j),(count+i,count+j,3*count+j,3*count+i)]
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(vertices,[],faces);mesh.update()
    obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj)
    return finish(obj,name,color)


def build_model(state="shadow-theatre",include_battery=True,include_handle=True,d=DIMS):
    import bpy
    from scene_parts import box,cylinder,bore,empty,annulus,stroke,material
    root=empty("STAR THEATRE — canonical 180 x 130 x 130 mm body")
    root["dimensions_m"]=str(asdict(d));root["mechanism"]="single convex lens / upper-rim star window"
    parts={key:[] for key in PRIMITIVE_IDS};geometry=[]
    def tag(obj,part,parent=root):
        obj.parent=parent;obj["part_id"]=part;obj["family"]="shadow-theatre"
        parts[part].append(obj)
        if obj.type in {"MESH","CURVE"}:geometry.append(obj)
        return obj
    def boolean(obj,cutter,name):
        bpy.context.view_layer.objects.active=obj
        mod=obj.modifiers.new(name,"BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
        bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
    def mesh(name,vertices,faces,color):
        data=bpy.data.meshes.new(name);data.from_pydata(vertices,[],faces);data.update()
        obj=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(obj);obj.data.materials.append(material(color));return obj
    front=box("prepared front wall with two actual openings",(0,-.064,.065),(.180,.002,.130),"card")
    bore(front,(0,-.064,d.spindle_z),d.bearing_radius,.010,"Y")
    bore(front,(0,-.064,.1152),.012,.010,"Y")
    for x in [-.015,.015]:
        boolean(front,box("temporary focus rail wall passage",(x,-.064,.1122),(.0038,.010,.0058)),"real prepared rail passage")
        bore(front,(x,-.064,.104),.0011,.010,"Y")
    tag(front,"theatre-box")
    rear=box("rear wall and spindle support hole",(0,.064,.065),(.180,.002,.130),"card")
    bore(rear,(0,.064,d.spindle_z),d.bearing_radius,.010,"Y");tag(rear,"theatre-box")
    for name,pos,size in [("left box wall",(-.089,0,.065),(.002,.126,.130)),("right box wall",(.089,0,.065),(.002,.126,.130)),
                          ("box floor",(0,0,.001),(.176,.126,.002)),("removable box lid",(0,0,.129),(.176,.126,.002))]:
        tag(box(name,pos,size,"card"),"theatre-box")
    baffle=box("fixed black window in front of moving disc",(0,d.window_y,.065),(.176,.002,.126),"ink")
    boolean(baffle,box("temporary real projection window",(0,d.window_y,d.window_z),(2*d.window_half_width,.010,2*d.window_half_height)),"actual projection window")
    bore(baffle,(0,d.window_y,d.spindle_z),.0035,.010,"Y");tag(baffle,"theatre-box")
    for x in [-.060,.060]:
        for y in [-.045,.045]:
            bore(parts["theatre-box"][4],(x,y,.001),.003,.010,"Z")
            collar=cylinder("prepared mounting hole collar",(x,y,.003),.005,.002,"teal","Z")
            bore(collar,(x,y,.003),.0031,.010,"Z");tag(collar,"theatre-box")
    bore(parts["theatre-box"][4],(.069,.030,.001),.0036,.010,"Z")
    # Foil strips stop short of all wiring and never surround bare contacts.
    foil=material("paper").copy();foil.name="reflective foil / insulating clearance retained"
    shader=foil.node_tree.nodes["Principled BSDF"];shader.inputs["Metallic"].default_value=.85;shader.inputs["Roughness"].default_value=.25
    for name,pos,size in [("left reflective lining",(-.0877,.042,.070),(.0003,.036,.100)),
                          ("right reflective lining",(.0877,.042,.070),(.0003,.036,.100)),
                          ("upper reflective lining",(0,.044,.1277),(.150,.032,.0003))]:
        obj=tag(box(name,pos,size,"paper"),"theatre-foil");obj.data.materials.clear();obj.data.materials.append(foil)
    lamp=tag(empty("diffuse LED lamp package"),"theatre-lamp")
    tag(box("LED holder and insulated circuit board",(0,.059,d.led_z),(.031,.005,.019),"teal"),"theatre-lamp",lamp)
    for x in [-.010,.010]:tag(cylinder("lamp holder rear-wall mounting post",(x,.062,d.led_z),.002,.004,"teal","Y"),"theatre-lamp",lamp)
    emitter=tag(box("diffuse LED emitting face",(0,d.led_y+.002,d.led_z),(.022,.004,.012),"paper"),"theatre-lamp",lamp)
    glow=material("paper").copy();glow.name="cool LED diffuser emission"
    shader=glow.node_tree.nodes["Principled BSDF"];shader.inputs["Emission Color"].default_value=(1,.92,.70,1);shader.inputs["Emission Strength"].default_value=2.
    emitter.data.materials.clear();emitter.data.materials.append(glow)
    tag(box("current-limiting resistor on insulated board",(.020,.057,.099),(.007,.003,.003),"ink"),"theatre-lamp",lamp)
    tag(stroke("lamp insulated leads",[(.021,.057,.099),(.040,.051,.090),(.065,.050,.030)],.0008,"ink"),"theatre-lamp",lamp)
    # Side compartment holds the removable original battery, clear of wheel.
    battery=tag(box("removable compatible lamp battery pack",(.072,0,.027),(.025,.065,.045),"ink",.001),"theatre-power")
    battery["removable_original_battery"]=True
    connector=box("switched fused lamp lead connector with socket",(.069,.047,.030),(.013,.012,.014),"teal")
    bore(connector,(.069,.047,.030),.0032,.020,"Y");tag(connector,"theatre-power")
    tag(cylinder("lamp socket recessed contact",(.069,.051,.030),.0008,.003,"ink","Y"),"theatre-power")
    tag(cylinder("lamp lead switch slider",(.069,.039,.034),.004,.006,"orange","Y"),"theatre-power")
    tag(stroke("switched lead / disconnect before changing supplies",[(.072,.020,.040),(.068,.040,.040),(.069,.047,.030),(.065,.050,.030)],.0008),"theatre-power")
    spindle=tag(empty("rigid star spindle axis Y",(0,0,d.spindle_z)),"theatre-spindle")
    length=d.spindle_rear-d.spindle_front
    shaft=cylinder("6 mm continuous spindle with prepared input flat",(0,(d.spindle_front+d.spindle_rear)/2,0),d.spindle_radius,length,"ink","Y")
    boolean(shaft,box("temporary spindle flat cutter",(.004,-.157,0),(.0036,.024,.014)),"real prepared input flat")
    boolean(shaft,box("temporary disc seat flat cutter",(.004,.025,0),(.0036,.020,.014)),"real disc-driving flat")
    bore(shaft,(0,-.166,0),.0009,.014,"Z");tag(shaft,"theatre-spindle",spindle)
    for y in [-.059,.050]:
        support=box("prepared spindle bearing with genuine bore",(0,y,d.spindle_z),(.021,.010,.021),"teal")
        bore(support,(0,y,d.spindle_z),d.bearing_radius,.020,"Y");tag(support,"theatre-spindle")
        for x in [-.007,.007]:tag(cylinder("bearing mounting screw",(x,y,.048),.0012,.012,"ink","Z"),"theatre-spindle")
        tag(box("bearing support foot tied to box wall",(0,y if y<0 else .056,.043),(.025,.012 if y<0 else .018,.010),"teal"),"theatre-spindle")
    for y in [d.disc_y-.0021,d.disc_y+.0021]:
        collar=d_socket("flat-sided disc clamping collar",(0,y,0),outer=.008,depth=.003,color="teal")
        bore(collar,(.0052,y,0),.0011,.012,"X");tag(collar,"theatre-spindle",spindle)
        tag(cylinder("disc collar radial locking screw",(.0052,y,0),.001,.006,"ink","X"),"theatre-spindle",spindle)
    for y in [-.068,.057]:tag(annulus("shaft retaining collar",(0,y,0),.006,.003,.004,"orange"),"theatre-spindle",spindle)
    blank=d_socket("uncut black card disc with prepared D hole",(0,d.disc_y,0),outer=d.disc_radius,depth=d.disc_thickness,color="ink",samples=256)
    tag(blank,"theatre-card",spindle)
    stars=blank.copy();stars.data=blank.data.copy();stars.parent=None;stars.location.z=0;bpy.context.collection.objects.link(stars)
    stars.name="black card disc with actual punched star holes"
    cutter_vertices=[];cutter_faces=[]
    for hole in star_holes():
        cx=hole["radius"]*math.cos(hole["angle"]);cz=hole["radius"]*math.sin(hole["angle"])
        outline=[]
        for j in range(10):
            a=hole["angle"]+j*math.pi/5;r=hole["outer"] if j%2==0 else hole["inner"]
            outline.append((cx+r*math.cos(a),cz+r*math.sin(a)))
        base=len(cutter_vertices)
        cutter_vertices += [(x,y,z) for y in [d.disc_y-.005,d.disc_y+.005] for x,z in outline]
        cutter_faces += [tuple(base+j for j in range(10)),tuple(base+10+j for j in reversed(range(10)))]
        cutter_faces += [(base+j+10,base+(j+1)%10+10,base+(j+1)%10,base+j) for j in range(10)]
    boolean(stars,mesh("temporary prepared star punch cuts",cutter_vertices,cutter_faces,"ink"),"actual through-punched stars")
    tag(stars,"theatre-stars",spindle)
    punch=tag(box("standalone prepared star hole punch",(.110,0,.015),(.040,.035,.030),"teal",.003),"theatre-punch")
    tag(box("star punch press handle",(.110,-.005,.036),(.043,.038,.009),"orange",.002),"theatre-punch")
    # Real biconvex lens: n=1.49, symmetric curvature selected for nominal f.
    focus=tag(empty("lens focus slide along optical axis",(0,d.lens_y,d.lens_z)),"theatre-slider")
    focus.rotation_euler.x=-math.atan(d.optical_slope)
    f=optical_parameters(d)["focal_length_m"];R=2*(1.49-1)*f
    vertices=[];rings=10;segments=64
    for face in [-1,1]:
        for j in range(rings+1):
            r=d.lens_radius*j/rings;sag=R-math.sqrt(R*R-r*r)
            y=face*(d.lens_thickness/2-sag)
            for k in range(segments):
                a=2*math.pi*k/segments;vertices.append((r*math.cos(a),y,r*math.sin(a)))
    faces=[];offset=(rings+1)*segments
    for face in range(2):
        start=face*offset
        for j in range(rings):
            for k in range(segments):
                a=start+j*segments+k;b=start+j*segments+(k+1)%segments
                face_indices=(a,b,b+segments,a+segments)
                faces.append(tuple(reversed(face_indices)) if face==0 else face_indices)
    for k in range(segments):
        a=rings*segments+k;b=rings*segments+(k+1)%segments;faces.append((a,a+offset,b+offset,b))
    lens=tag(mesh("single convex projection lens",vertices,faces,"paper"),"theatre-lens",focus)
    glass=material("paper").copy();glass.name="nominal optical polymer IOR 1.49"
    shader=glass.node_tree.nodes["Principled BSDF"];shader.inputs["Transmission Weight"].default_value=1.;shader.inputs["IOR"].default_value=1.49;shader.inputs["Roughness"].default_value=.025
    lens.data.materials.clear();lens.data.materials.append(glass)
    tag(annulus("lens retaining ring with clear aperture",(0,0,0),.010,.0082,.005,"teal"),"theatre-slider",focus)
    tag(annulus("compliant lens edge retaining gasket",(0,0,0),.0083,.00795,.0022,"ink"),"theatre-slider",focus)
    rail_frame=empty("fixed focus guide axes",(0,d.lens_y,d.lens_z));rail_frame.parent=root
    rail_frame.rotation_euler.x=-math.atan(d.optical_slope)
    rails=[];cheeks=[]
    for x in [-.015,.015]:
        rails.append(tag(box("fixed lens slide rail",(x,.005,-.003),(.003,.040,.004),"teal"),"theatre-slider",rail_frame))
        cheek=box("lens cheek with through guide groove",(x,0,-.003),(.007,.012,.010),"orange")
        boolean(cheek,box("temporary true guide groove",(x,0,-.003),(.0036,.030,.0046)),"actual sliding guide clearance")
        cheeks.append(tag(cheek,"theatre-slider",focus))
        tag(box("lens holder cross bridge",(x/2,0,-.0075),(.016,.005,.003),"orange"),"theatre-slider",focus)
        tag(box("focus rail wall attachment foot",(x,-.0615,.104),(.009,.003,.004),"teal"),"theatre-slider")
        tag(box("focus rail rear cantilever arm",(x,-.056,.104),(.006,.012,.004),"teal"),"theatre-slider")
        tag(box("focus rail rear support post",(x,-.053,.1085),(.006,.006,.009),"teal"),"theatre-slider")
        tag(cylinder("focus rail mounting screw",(x,-.063,.104),.001,.010,"ink","Y"),"theatre-slider")
    hood=tag(annulus("dark hollow lens hood",(0,-.006,0),.0128,.0105,.010,"ink"),"theatre-hood",focus)
    wheel=tag(annulus("detachable star-wheel handle",(0,-.178,0),.023,.003,.005,"orange"),"theatre-handwheel",spindle)
    hub=d_socket("detachable flat-sided handwheel hub",(0,-.170,0))
    bore(hub,(0,-.166,0),.0009,.020,"Z");tag(hub,"theatre-handwheel",spindle)
    tag(cylinder("handwheel removable cross-pin clip",(0,-.166,0),.0008,.018,"ink","Z"),"theatre-handwheel",spindle)
    tag(stroke("handwheel captive retaining clip loop",[(0,-.166,.009),(.004,-.166,.013),(.006,-.166,.009),(0,-.166,.009)],.0007),"theatre-handwheel",spindle)
    tag(cylinder("handwheel grip",(.018,-.188,0),.003,.016,"teal","Y"),"theatre-handwheel",spindle)
    tag(box("hanging projection cloth",(0,d.screen_y,.740),(.900,.0015,1.500),"paper"),"theatre-cloth")
    model={"root":root,"parts":parts,"geometry":geometry,"spindle":spindle,"disc":stars,"blank_disc":blank,
           "lamp":lamp,"emitter":emitter,"lens":lens,"focus":focus,"hood":hood,"dimensions":d,"rails":rails,"cheeks":cheeks,
           "include_battery":include_battery,"include_handle":include_handle,"state":state}
    set_state(model,state);apply_pose(model,0)
    return model


def set_state(model,state):
    if state not in STATES:raise ValueError(f"Unknown theatre identity {state}")
    active=set(STATES[state])
    if not model["include_handle"]:active.discard("theatre-handwheel")
    for part,objects in model["parts"].items():
        for obj in objects:
            visible=part in active and (model["include_battery"] or not obj.get("removable_original_battery",False))
            obj.hide_render=not visible;obj.hide_viewport=not visible
    model["state"]=state;return active


def apply_pose(model,theta,focus_offset=0):
    if abs(focus_offset)>model["dimensions"].focus_travel:raise ValueError("lens travel exceeded")
    model["spindle"].rotation_euler.y=-theta
    d=model["dimensions"];axis,_,_=optical_basis(d)
    model["focus"].location=(0,d.lens_y+axis[1]*focus_offset,d.lens_z+axis[2]*focus_offset)
    return {"spindle_angle_radians":theta,"focus_offset_m":focus_offset,
            "projected_stars":projected_stars(theta,focus_offset=focus_offset,d=d)}


def verify_blender_model(model,samples=72):
    """Ray-check the real cut holes and opaque path over the full spindle turn."""
    import bpy
    from mathutils import Vector
    from mathutils.bvhtree import BVHTree
    d=model["dimensions"];original_state=model["state"]
    set_state(model,"shadow-theatre")
    apply_pose(model,0);bpy.context.view_layer.update()
    def bvh(obj):
        evaluated=obj.evaluated_get(bpy.context.evaluated_depsgraph_get());data=evaluated.to_mesh()
        vertices=[evaluated.matrix_world @ v.co for v in data.vertices]
        faces=[tuple(p.vertices) for p in data.polygons]
        evaluated.to_mesh_clear();return BVHTree.FromPolygons(vertices,faces,all_triangles=False)
    opaque=[]
    for obj in model["geometry"]:
        if obj.hide_render or obj==model["disc"] or obj["part_id"] in {"theatre-lens","theatre-lamp"}:continue
        if obj["part_id"] in {"theatre-spindle","theatre-handwheel"} and obj.parent==model["spindle"]:continue
        opaque.append((obj,bvh(obj)))
    blocked=set();filled_holes=[];rays=0;maximum_joint_error=0.
    for i in range(samples):
        theta=2*math.pi*i/samples;apply_pose(model,theta);bpy.context.view_layer.update()
        disc_bvh=bvh(model["disc"]);root=model["root"].matrix_world
        for hole in star_holes():
            angle=hole["angle"]+theta
            local=Vector((hole["radius"]*math.cos(angle),d.disc_y+.005,d.spindle_z+hole["radius"]*math.sin(angle)))
            origin=root @ local;direction=(root.to_3x3() @ Vector((0,-1,0))).normalized()
            if disc_bvh.ray_cast(origin,direction,.010)[0] is not None:filled_holes.append((i,hole["angle"]))
        for projected in projected_stars(theta,d=d):
            mask=Vector(projected["mask_centre_m"]);lens=Vector((0,d.lens_y,d.lens_z))
            factor=(d.led_y-mask.y)/(mask.y-lens.y)
            source=mask+(mask-lens)*factor
            origin=root @ source;target=root @ lens
            direction=(target-origin).normalized();distance=(target-origin).length
            for obj,tree in opaque+[(model["disc"],disc_bvh)]:
                if tree.ray_cast(origin+direction*.00001,direction,distance-.00002)[0] is not None:blocked.add(obj.name)
            rays+=1
        # A shaft axis is invariant even when the rigid star wheel turns.
        actual=model["spindle"].matrix_world @ Vector((0,d.spindle_front,0))
        expected=root @ Vector((0,d.spindle_front,d.spindle_z))
        maximum_joint_error=max(maximum_joint_error,(actual-expected).length)
    states={};original_flags=(model["include_battery"],model["include_handle"])
    model["include_battery"]=model["include_handle"]=True
    for identity in STATES:
        active=set_state(model,identity)
        visible=[obj for obj in model["geometry"] if not obj.hide_render]
        states[identity]={"active_part_ids":sorted(active),"physical_objects":len(visible)}
        if not visible:raise AssertionError("Empty theatre state: "+identity)
    model["include_battery"],model["include_handle"]=original_flags
    set_state(model,original_state);apply_pose(model,0)
    return {"sample_count":samples,"punched_hole_axis_tests":samples*len(star_holes()),
            "filled_hole_failures":filled_holes,"actual_mesh_optical_paths_checked":rays,
            "opaque_path_blockers":sorted(blocked),"max_input_axis_position_error_m":maximum_joint_error,
            "states":states,"passed":not filled_holes and not blocked and maximum_joint_error<1e-6,
            "limits":["Actual chief rays plus punched-hole centres are tested; finite lens aperture rays, aberrations and luminance remain unmeasured.",
                      "Rotating disc has 1.2 mm floor clearance and 3.4 mm baffle clearance analytically; this is not a manufactured tolerance approval."]}
