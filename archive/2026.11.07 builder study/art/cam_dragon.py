"""Dimensioned cam dragon, independent of story rendering or Blender on import.

World coordinates are metres, z up, x across wings; all revolute axes run along y.
The front is negative y. ``solve_pose`` is analytic, not a rigid-body simulation.
The return spring alone changes shape/length; rigid meshes only translate/rotate.
``build_model`` imports Blender lazily; callers own scene setup and output paths.
"""
from dataclasses import dataclass, asdict
import math


@dataclass(frozen=True)
class Dimensions:
    base_width: float = .240
    base_depth: float = .150
    base_thickness: float = .012
    shaft_z: float = .058
    shaft_radius: float = .003
    bearing_bore: float = .0033
    bearing_y: float = .047
    bearing_thickness: float = .008
    cam_radius: float = .027
    eccentricity: float = .010
    cam_thickness: float = .006
    oval_major: float = .037
    oval_minor: float = .017
    foot_width: float = .050
    foot_depth: float = .014
    foot_thickness: float = .003
    stem_width: float = .004
    guide_bore: float = .0046
    guide_bottom: float = .124
    guide_top: float = .142
    eye_above_foot: float = .090
    spring_collar_above_foot: float = .080
    spring_fixed_z: float = .120
    spring_free_span: float = .028
    spring_wire_radius: float = .000125
    hinge_x: float = .030
    hinge_z: float = .222
    drive_radius: float = .025
    rod_length: float = .055
    rod_radius: float = .0023
    pivot_radius: float = .0015
    pivot_bore: float = .0017
    wing_thickness: float = .002
    body_y: float = .030
    body_thickness: float = .002
    right_wing_y: float = .010
    left_wing_y: float = .002
    right_rod_y: float = -.006
    left_rod_y: float = -.014
    rod_thickness: float = .003
    wing_angle_offset: float = math.pi/3


DIMS = Dimensions()
VARIANTS = ("eccentric", "two_lobe")
VIEW={"location":(.55,-.85,.48),"target":(0,0,.150),"scale":.42}
FRAME=["cd-base","cd-bearing-frames","cd-shaft","cd-cam"]
STATES={"cd-base":FRAME[:1],"cd-bearings":FRAME[:2],"cd-crank-frame":FRAME[:3],
        "cd-cam-frame":FRAME,"cd-guided-follower":["cd-guide","cd-follower"],
        "cd-jointed-dragon":["cd-cutouts","cd-hinge-pins"]}
STATES["cd-lifter"]=FRAME+["cd-guide","cd-follower"]
STATES["cd-lost-contact"]=STATES["cd-lifter"]+["cd-crank-key"]
STATES["cd-sprung-lifter"]=STATES["cd-lifter"]+["cd-return-spring"]
STATES["cd-working-lifter"]=STATES["cd-sprung-lifter"]+["cd-crank-key"]
STATES["cd-mounted-dragon"]=STATES["cd-working-lifter"]+STATES["cd-jointed-dragon"]
STATES["cd-linked-dragon"]=STATES["cd-mounted-dragon"]+["cd-linkage"]
STATES["cd-first-wave"]=STATES["cd-linked-dragon"]
STATES["cd-double-wave"]=STATES["cd-first-wave"]+["cd-double-cam"]
STATES["crank-dragon"]=STATES["cd-double-wave"]


def _cut(obj, cutter, operation="DIFFERENCE"):
    """Apply an actual bore/flat before either object acquires a transformed parent."""
    import bpy
    import bmesh
    for mesh_object in [obj,cutter]:
        bm=bmesh.new();bm.from_mesh(mesh_object.data)
        bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(mesh_object.data);bm.free()
    bpy.context.view_layer.objects.active=obj
    mod=obj.modifiers.new("functional clearance", "BOOLEAN");mod.operation=operation;mod.object=cutter
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(cutter,do_unlink=True)


def _clip(name, center, inner, outer, depth, gap=2.2):
    from scene_parts import annulus
    obj=annulus(name,(0,0,0),outer,inner,depth,"teal",gap=gap)
    obj.location=center;obj.rotation_euler.y=-math.pi/2
    return obj


def cam_support(theta, variant="eccentric", d=DIMS):
    """Exact support/contact against a horizontal flat-bottomed follower."""
    if variant == "eccentric":
        return d.cam_radius+d.eccentricity*math.sin(theta), d.eccentricity*math.cos(theta)
    if variant == "two_lobe":
        a, b = d.oval_major, d.oval_minor
        h = math.hypot(a*math.sin(theta), b*math.cos(theta))
        return h, (a*a-b*b)*math.sin(theta)*math.cos(theta)/h
    raise ValueError(f"Unknown cam {variant!r}; expected one of {VARIANTS}")


def solve_pose(theta, variant="eccentric", d=DIMS, follower_height=None):
    support, contact_x = cam_support(theta, variant, d)
    foot = d.shaft_z+support if follower_height is None else follower_height
    eye_z = foot+d.eye_above_foot
    dx, dz = -d.hinge_x, eye_z-d.hinge_z
    distance = math.hypot(dx, dz)
    cosine = (d.drive_radius**2+distance**2-d.rod_length**2)/(2*d.drive_radius*distance)
    if not -1 <= cosine <= 1:
        raise ValueError("The fixed-length linkage cannot reach this pose")
    # Select the outer/downward crank branch continuously; no per-frame switching.
    alpha = math.atan2(dz, dx)+math.acos(cosine)
    qx = d.hinge_x+d.drive_radius*math.cos(alpha)
    qz = d.hinge_z+d.drive_radius*math.sin(alpha)
    rods = {}
    for side, sign, y in [("right", 1, d.right_rod_y), ("left", -1, d.left_rod_y)]:
        p, q = (0, y, eye_z), (sign*qx, y, qz)
        rods[side] = {"follower_pivot": p, "wing_pivot": q,
                      "hinge": (sign*d.hinge_x, y, d.hinge_z)}
    return {"theta": theta, "variant": variant, "foot_z": foot,
            "eye_z": eye_z, "contact": (contact_x, 0, d.shaft_z+support),
            "follower_gap":foot-(d.shaft_z+support),
            "crank_angle": alpha, "wing_angle": alpha+d.wing_angle_offset,
            "spring_span": foot+d.spring_collar_above_foot-d.spring_fixed_z,
            "rods": rods}


def proof(samples=1440, d=DIMS):
    """Kinematic invariants and named clearances, not a general collision solver."""
    output = {"units": "metres and degrees", "dimensions": asdict(d), "variants": {}}
    for variant in VARIANTS:
        poses = [solve_pose(i*2*math.pi/samples, variant, d) for i in range(samples)]
        profile_vertices=[]
        for j in range(256):
            a=2*math.pi*j/256
            r=(d.eccentricity*math.cos(a)+math.sqrt(d.cam_radius**2-d.eccentricity**2*math.sin(a)**2)
               if variant=="eccentric" else 1/math.hypot(math.cos(a)/d.oval_major,math.sin(a)/d.oval_minor))
            profile_vertices.append((r*math.cos(a),r*math.sin(a)))
        faceting_gaps=[]
        for p in poses:
            theta=p["theta"]
            polygon_top=max(x*math.sin(theta)+z*math.cos(theta) for x,z in profile_vertices)
            faceting_gaps.append(p["foot_z"]-d.shaft_z-polygon_top)
        errors, crank_errors, rod_angles, transmission, contacts, heights = [], [], [], [], [], []
        relative_joint_angles=[]
        for p in poses:
            contacts.append(abs(p["contact"][0]))
            heights.append(p["foot_z"])
            for r in p["rods"].values():
                a, b, h = r["follower_pivot"], r["wing_pivot"], r["hinge"]
                errors.append(abs(math.dist(a, b)-d.rod_length))
                crank_errors.append(abs(math.dist(b, h)-d.drive_radius))
                rod_angles.append(math.degrees(math.atan2(b[2]-a[2], abs(b[0]-a[0]))))
                relative_joint_angles.append(rod_angles[-1]-math.degrees(p["wing_angle"]))
                dot = sum((a[i]-b[i])*(h[i]-b[i]) for i in range(3))
                angle = math.degrees(math.acos(max(-1,min(1,dot/d.rod_length/d.drive_radius))))
                transmission.append(min(angle, 180-angle))
        wing_angles = [math.degrees(p["wing_angle"]) for p in poses]
        spring = [p["spring_span"] for p in poses]
        rises = sum(heights[i] > heights[i-1] and heights[i] >= heights[(i+1)%samples]
                    for i in range(samples))
        output["variants"][variant] = {
            "sample_count": samples, "rises_per_turn": rises,
            "foot_z_range": [min(heights), max(heights)],
            "wing_angle_degrees": [min(wing_angles), max(wing_angles)],
            "rod_angle_degrees": [min(rod_angles), max(rod_angles)],
            "wing_joint_angle_degrees_relative_to_wing": [min(relative_joint_angles),max(relative_joint_angles)],
            "minimum_transmission_angle_degrees": min(transmission),
            "max_rod_length_error": max(errors), "max_crank_radius_error": max(crank_errors),
            "minimum_contact_to_foot_edge": d.foot_width/2-max(contacts),
            "minimum_cam_to_base": d.shaft_z-max(d.cam_radius+d.eccentricity,d.oval_major)-d.base_thickness,
            "bearing_radial_clearance": d.bearing_bore-d.shaft_radius,
            "guide_side_clearance": (d.guide_bore-d.stem_width)/2,
            "joint_radial_clearance": d.pivot_bore-d.pivot_radius,
            "minimum_collar_to_guide_top": min(heights)+d.spring_collar_above_foot-.002-d.guide_top,
            "minimum_wing_card_to_body_face": d.body_y-d.body_thickness/2-max(d.right_wing_y,d.left_wing_y)-d.wing_thickness/2,
            "minimum_rod_layer_face_gap": abs(d.right_rod_y-d.left_rod_y)-d.rod_thickness,
            "minimum_follower_eye_to_right_link_face": abs(d.right_rod_y)-.0025-d.rod_thickness/2,
            "minimum_cam_to_guide_support_depth_gap": .013-d.cam_thickness/2,
            "minimum_full_guide_engagement": d.guide_top-d.guide_bottom,
            "maximum_faceted_cam_to_analytic_contact_gap": max(faceting_gaps),
            "spring_span_range": [min(spring), max(spring)],
            "spring_extension_range": [min(spring)-d.spring_free_span,max(spring)-d.spring_free_span],
        }
        checked=output["variants"][variant]
        if checked["rises_per_turn"] != (1 if variant=="eccentric" else 2):
            raise AssertionError("Unexpected number of wing rises")
        if max(errors+crank_errors)>1e-12:
            raise AssertionError("A rigid linkage changed length")
        if any(value<=0 for key,value in checked.items() if key.startswith("minimum_") or key.endswith("_clearance")):
            raise AssertionError("A named clearance or motion margin closed")
    output["intentional_contacts"] = [
        "Cam and follower sole have tangent line contact across their overlapping y thickness.",
        "Split cam hub grips shaft; body tabs seat on base; screws seat against mounting faces.",
        "Pivot pins bear on eye bores under load; bearing/guide clearance is nominal unloaded clearance.",
        "Spring end hooks are attached to fixed bracket and moving collar eyes.",
    ]
    output["limits"] = [
        "Analytic quasi-static geometry, not measured force/friction, structural, fatigue or speed validation.",
        "Named planar/layer clearances are checked; this is not an exhaustive mesh collision certificate.",
        "Spring depicts 7–27 mm extension from a 28 mm free end-to-end span; a real compatible spring must be selected.",
        "Card stiffness, hinge wear, fastener preload and fabrication tolerances beyond nominal clearances are untested.",
        "Split hubs/collars are shown with released nominal bore clearance; their small elastic clamping deflection and threaded fastener engagement are not simulated. D-drive and retaining-clip geometry is explicit, but load capacity and clip preload are untested.",
        "The solid cam has a closed bore: exchange requires releasing the shaft end collar/cap and partially withdrawing the stationary shaft. Opening its clamp alone is insufficient.",
        "256-segment cam mesh approximates the analytic profile; the maximum sampled faceting gap is reported separately.",
    ]
    return output


def build_model(variant="eccentric", d=DIMS, include_handle=False):
    """Add an assembly to the active Blender scene; return its poseable handles."""
    import bpy
    from scene_parts import box, cylinder, bore, profile, annulus, empty, parent_local, stroke

    root = empty("CAM DRAGON — metres / z up")
    root["dimensions_m"] = str(asdict(d))
    static = empty("fixed structure")
    static.parent = root
    def fixed(obj):
        obj.parent = static
        return obj
    base = fixed(box("birch base — 240 x 150 x 12 mm", (0, 0, d.base_thickness/2),
                     (d.base_width, d.base_depth, d.base_thickness), bevel=.001))
    for x in [-.101, .101]:
        for y in [-.056, .056]:
            bore(base, (x,y,.006), .003, .02, "Z")
    for y in [-d.bearing_y, d.bearing_y]:
        fixed(box("bearing frame mounting foot",(0,y,.016),(.044,.024,.008),"teal",.0005))
        for x in [-.017,.017]:
            fixed(box("bearing frame side strut",(x,y,.0365),(.008,.008,.033),"teal",.0004))
        bearing = fixed(box("bearing frame / real shaft bore", (0,y,.062), (.044,.008,.018), "teal", .0005))
        bore(bearing, (0,y,d.shaft_z), d.bearing_bore, .02)
        for x in [-.015,.015]:
            fixed(cylinder("captive bearing foot screw", (x,y-.008,.0215), .0022,.003,"ink", "Z"))
            fixed(cylinder("captive bearing screw shank", (x,y-.008,.013), .0014,.014,"ink", "Z"))
    shaft = empty("rotating shaft, cam and handle", (0,0,d.shaft_z)); shaft.parent = root
    shaft_mesh=cylinder("straight 6 mm shaft", (0,-.007,0), d.shaft_radius,.154,"ink")
    _cut(shaft_mesh,box("temporary shaft D flat",(.006,-.079,0),(.008,.012,.020)))
    bore(shaft_mesh,(0,-.080,0),.00065,.020,"Z")
    bore(shaft_mesh,(0,.069,0),.0015,.012,"Y")
    parent_local(shaft_mesh,shaft)
    for y in [-.054,.054]:
        collar=annulus("shaft retaining collar",(0,y,0),.006,.0032,.004,"teal",gap=.18)
        bore(collar,(.004,y,0),.00075,.015,"Z")
        bore(collar,(.004,y,.004),.001,.0028,"Z")
        parent_local(collar,shaft)
        collar["service_role"]="rear_collar" if y>0 else "front_collar"
        screw=parent_local(cylinder("shaft retaining collar clamp screw",(.0040,y,0),.0007,.0052,"ink","Z"),shaft)
        screw["service_role"]=collar["service_role"]
        head=parent_local(cylinder("shaft retaining collar recessed head",(.0040,y,.0030),.0009,.0008,"ink","Z"),shaft)
        head["service_role"]=collar["service_role"]
    # C-shaped housing captures the released rear collar without rubbing in operation.
    fixed(annulus("bearing frame rear collar cradle",(0,.054,d.shaft_z),.008,.0061,.006,"teal",gap=1.6))
    for y in [.0511,.0569]:
        fixed(annulus("bearing frame collar axial stop",(0,y,d.shaft_z),.008,.0035,.0006,"teal",gap=1.6))
    # A removable cap retained by an axial captive screw into the prepared shaft end.
    for obj in [annulus("capped far shaft sleeve",(0,.068,0),.005,.0031,.004,"teal"),
                annulus("capped far shaft end washer",(0,.071,0),.005,.0016,.002,"teal"),
                cylinder("capped far shaft captive screw",(0,.069,0),.0015,.008,"ink"),
                cylinder("capped far shaft thumb head",(0,.073,0),.0025,.002,"ink")]:
        parent_local(obj,shaft);obj["service_role"]="end_cap"
    fixed(box("shaft cap parking foot",(.080,.038,.014),(.016,.012,.004),"birch"))
    fixed(box("shaft cap parking post",(.080,.033,.018),(.006,.003,.008),"teal"))
    fixed(annulus("shaft cap parking peg",(.080,.036,.022),.0028,.0017,.008,"teal"))
    # Cam faces are an annular mesh: the shaft hole is genuinely empty.
    n=256; pts=[]
    for i in range(n):
        a=2*math.pi*i/n
        if variant=="eccentric":
            radius=d.eccentricity*math.cos(a)+math.sqrt(d.cam_radius**2-d.eccentricity**2*math.sin(a)**2)
        elif variant=="two_lobe":
            radius=1/math.hypot(math.cos(a)/d.oval_major,math.sin(a)/d.oval_minor)
        else:
            raise ValueError(variant)
        pts.append((radius*math.cos(a),radius*math.sin(a)))
    verts=[(x,y,z) for y in [-d.cam_thickness/2,d.cam_thickness/2] for x,z in pts]
    verts += [(.0032*math.cos(2*math.pi*i/n),y,.0032*math.sin(2*math.pi*i/n))
              for y in [-d.cam_thickness/2,d.cam_thickness/2] for i in range(n)]
    faces=[]
    for i in range(n):
        j=(i+1)%n
        faces += [(i,j,2*n+j,2*n+i),(n+i,3*n+i,3*n+j,n+j),
                  (i,n+i,n+j,j),(2*n+i,2*n+j,3*n+j,3*n+i)]
    from scene_parts import finish
    mesh=bpy.data.meshes.new("dimensioned cam mesh"); mesh.from_pydata(verts,[],faces);mesh.update()
    cam=bpy.data.objects.new(variant+" cam / 6 mm plate",mesh);bpy.context.collection.objects.link(cam)
    finish(cam,cam.name,"orange");parent_local(cam,shaft)
    def hub_parts(prefix,parent):
        hub=annulus(prefix+" body",(0,-.008,0),.009,.0031,.010,"orange",gap=.16)
        bore(hub,(.0065,-.008,0),.0011,.020,"Z")
        items=[hub,cylinder(prefix+" clamp screw",(.0065,-.008,0),.001,.014,"ink","Z"),
               cylinder(prefix+" clamp head",(.0065,-.008,.007),.0015,.0015,"ink","Z")]
        for obj in items:parent_local(obj,parent)
        return items
    hub_parts("quick-change split hub",shaft)
    if variant=="two_lobe":
        parked=cam.copy();parked.data=cam.data.copy();bpy.context.collection.objects.link(parked)
        parked.name="parked original eccentric cam";parked.parent=static;parked.location=(0,0,0);parked.rotation_euler=(0,0,0)
        for i in range(2*n):
            a=2*math.pi*(i % n)/n
            r=d.eccentricity*math.cos(a)+math.sqrt(d.cam_radius**2-d.eccentricity**2*math.sin(a)**2)
            parked.data.vertices[i].co.x=r*math.cos(a);parked.data.vertices[i].co.z=r*math.sin(a)
        hub_parts("parked original split hub",static)
        fixed(box("cam parking clip floor",(-.074,.022,.0165),(.018,.015,.009),"birch"))
        for y in [.016,.028]:
            fixed(box("cam parking clip lip",(-.074,y,.0255),(.018,.003,.009),"teal"))
    # Removable hand crank is outside the front bearing and rotates rigidly.
    parent_local(box("removable crank arm",(.014,-.090,0),(.032,.006,.009),"orange",.001),shaft)
    socket=cylinder("crank socket / true D bore",(0,-.083,0),.006,.013,"orange")
    start=math.acos(.0021/.0031)
    d_points=[(.0031*math.cos(start+(2*math.pi-2*start)*i/96),.0031*math.sin(start+(2*math.pi-2*start)*i/96)) for i in range(97)]
    _cut(socket,profile("temporary D socket cutter",d_points,.017,-.083))
    bore(socket,(0,-.080,0),.00065,.020,"Z")
    parent_local(socket,shaft)
    parent_local(stroke("crank retaining clip",[(0,-.080,-.0068),(0,-.080,.007),(.001,-.080,.0085),
                         (.004,-.080,.009),(.007,-.080,.007),(.0065,-.080,0),(.007,-.080,-.004),(.0058,-.080,-.0058)],.0005,"ink"),shaft)
    parent_local(cylinder("hand grip",(.029,-.106,0),.005,.026,"teal"),shaft)
    for y in [-.040,-.022]:
        fixed(box("handle parking clip foot",(.104,y,.015),(.014,.008,.006),"teal"))
        fixed(_clip("handle parking clip",(.104,y,.025),.0053,.007,.004))
    # Guide is supported behind the cam. Its front wall is a removable snap
    # cover: open side admits the rod laterally, so neither the broad foot nor
    # the spring collar has to pass through the 4.6 mm square bore.
    guide_foot=fixed(box("guide support foot",(-.026,.019,.016),(.028,.024,.008),"birch"))
    for x in [-.036,-.016]:
        bore(guide_foot,(x,.020,.016),.0015,.020,"Z")
        fixed(cylinder("guide mounting screw shank",(x,.020,.012),.0014,.018,"ink","Z"))
        fixed(cylinder("guide mounting screw head",(x,.020,.02125),.0021,.0025,"ink","Z"))
    fixed(box("guide upright",(-.026,.019,.074),(.010,.012,.116),"birch"))
    fixed(box("guide cross arm",(-.014,.019,.133),(.034,.012,.008),"teal"))
    fixed(box("guide forward bridge",(0,.010,.133),(.010,.025,.008),"teal"))
    b=d.guide_bore/2; outer=.005; height=d.guide_top-d.guide_bottom
    guide_z=(d.guide_top+d.guide_bottom)/2
    guide_walls=[]
    for sign in [-1,1]:
        wall=box("square guide side wall",(sign*(b+outer)/2,0,guide_z),(outer-b,.010,height),"teal")
        # Each side-wall pocket is 1.3 mm deep; 1.4 mm of wall remains between
        # the snap and the rod bore. No clip floats beside a smooth receiver.
        _cut(wall,box("guide snap receiving pocket",(sign*.00495,.0018,guide_z),(.0025,.0030,.0036)))
        guide_walls.append(fixed(wall))
    guide_walls.append(fixed(box("square guide back wall",(0,(b+outer)/2,guide_z),(2*b,outer-b,height),"teal")))
    guide_cover=empty("guide removable cover group");guide_cover.parent=static
    cover=box("guide removable front cover",(0,-(b+outer)/2,guide_z),(2*b,outer-b,height),"teal")
    # Fuse the bore wall, front spine, two flexible arms and inward hooks into
    # one connected cover. Its exposed side arms flex outward during release;
    # the parked still shows that relaxed cover 14 mm in front of the guide.
    _cut(cover,box("guide cover front spine",(0,-.0060,guide_z),(.014,.0020,height)),"UNION")
    for sign in [-1,1]:
        _cut(cover,box("guide cover spring arm",(sign*.0058,-.00165,guide_z),(.0012,.0093,.0028)),"UNION")
        _cut(cover,box("guide cover retaining hook",(sign*.0051,.0018,guide_z),(.0018,.0022,.0028)),"UNION")
    cover.parent=guide_cover
    # The bridge stops behind the bore, so it cannot block the follower.
    bridge=bpy.data.objects.get("guide forward bridge")
    bridge.location.y=.0125;bridge.dimensions.y=.015
    # Leave the frontal rod-insertion corridor open below the guide, too. The
    # anchor and its support retain their positions; only unused left overhang
    # is removed from this stationary bracket.
    fixed(box("fixed spring bracket",(.012,-.010,d.spring_fixed_z),(.012,.006,.004),"teal"))
    fixed(box("spring bracket support",(.012,.004,d.spring_fixed_z),(.006,.028,.004),"teal"))
    fixed(box("spring bracket vertical connection",(.012,.016,.126),(.006,.006,.016),"teal"))
    fixed(box("spring bracket to guide bridge",(.007,.016,.133),(.016,.006,.004),"teal"))
    fixed(cylinder("fixed spring anchor pin",(.014,-.012,d.spring_fixed_z),.0008,.008,"ink"))
    fixed(cylinder("fixed spring anchor cap",(.014,-.0165,d.spring_fixed_z),.0018,.001,"ink"))
    follower=empty("rigid guided follower"); follower.parent=root
    parent_local(box("50 mm flat follower foot",(0,0,d.foot_thickness/2),(d.foot_width,d.foot_depth,d.foot_thickness),"orange",.0003),follower)
    stem=box("square follower stem",(0,0,(d.foot_thickness+d.eye_above_foot)/2),
                     (d.stem_width,d.stem_width,d.eye_above_foot-d.foot_thickness),"orange")
    bore(stem,(0,0,d.eye_above_foot),d.pivot_bore,.020)
    bore(stem,(0,0,.04775),.0009,.020)
    parent_local(stem,follower)
    eye=parent_local(cylinder("follower connection eye",(0,0,d.eye_above_foot),.0045,.005,"orange"),follower)
    bore(eye,(0,0,d.eye_above_foot),d.pivot_bore,.02)
    parent_local(cylinder("shared pin with independent link eyes",(0,-.0075,d.eye_above_foot),d.pivot_radius,.025,"ink"),follower)
    parent_local(cylinder("follower pin front cap",(0,-.021,d.eye_above_foot),.0026,.002,"ink"),follower)
    parent_local(cylinder("follower pin rear cap",(0,.004,d.eye_above_foot),.0026,.002,"ink"),follower)
    parent_local(annulus("follower-eye spacer",(0,-.0035,d.eye_above_foot),.0027,d.pivot_bore,.0015,"ink"),follower)
    parent_local(annulus("independent rod-eye separator",(0,-.010,d.eye_above_foot),.0027,d.pivot_bore,.004,"ink"),follower)
    parent_local(annulus("follower-eye outer spacer",(0,-.01775,d.eye_above_foot),.0027,d.pivot_bore,.0035,"ink"),follower)
    parent_local(box("moving spring collar",(.006,-.004,d.spring_collar_above_foot),(.020,.012,.004),"orange"),follower)
    parent_local(cylinder("moving spring anchor pin",(.014,-.012,d.spring_collar_above_foot),.0008,.008,"ink"),follower)
    parent_local(cylinder("moving spring anchor cap",(.014,-.0165,d.spring_collar_above_foot),.0018,.001,"ink"),follower)
    keeper=empty("guide service keeper pin",(.086,.055,.016));keeper.parent=root
    parent_local(cylinder("guide keeper pin shank",(0,0,0),.00075,.016,"ink"),keeper)
    parent_local(cylinder("guide keeper pin head",(0,-.009,0),.002,.002,"orange"),keeper)
    fixed(_clip("guide keeper parking clip",(.086,.055,.016),.0009,.002,.004))
    fixed(box("guide keeper clip foot",(.086,.055,.013),(.006,.006,.002),"teal"))
    # Two separated leg tabs leave the shaft and both cam profiles unobstructed.
    body_points=[(-.062,.012),(-.060,.174),(-.041,.193),(-.041,.213),
                 (-.035,.237),(-.016,.248),(-.009,.275),(-.016,.296),(-.002,.291),
                 (.007,.309),(.013,.295),(.042,.292),(.054,.280),(.046,.264),
                 (.021,.263),(.020,.241),(.037,.229),(.043,.208),(.041,.193),
                 (.060,.174),(.062,.012),(.046,.012),(.045,.159),(.028,.183),
                 (-.027,.183),(-.045,.159),(-.046,.012)]
    body=fixed(profile("fixed stiff-card dragon body and base tabs",body_points,d.body_thickness,d.body_y,"teal"))
    for x in [-d.hinge_x,d.hinge_x]:
        bore(body,(x,d.body_y,d.hinge_z),d.pivot_bore,.01)
    tail=fixed(profile("fixed decorative card tail",[(.037,.195),(.068,.191),(.087,.203),(.089,.223),
                         (.098,.214),(.101,.198),(.093,.184),(.076,.178),(.037,.187)],.002,.033,"teal"))
    bore(tail,(.040,.033,.191),d.pivot_bore,.01)
    bore(body,(.040,d.body_y,.191),d.pivot_bore,.01)
    fixed(cylinder("tail attachment pin",(.040,.0315,.191),d.pivot_radius,.011,"ink"))
    fixed(cylinder("tail attachment broad head",(.040,.0275,.191),.003,.002,"ink"))
    fixed(cylinder("tail attachment rear retainer",(.040,.0355,.191),.003,.002,"ink"))
    fixed(annulus("tail attachment spacing washer",(.040,.0315,.191),.003,d.pivot_bore,.0006,"birch"))
    for i,(x,z) in enumerate([(-.010,.285),(-.011,.272),(-.015,.259),(-.022,.247)]):
        fixed(profile("folded paper scale "+str(i),[(x,z-.004),(x-.010,z+.002),(x,z+.007)],.0005,d.body_y-.0015,"orange"))
    # Add visible fold feet where the prepared tabs attach to the base.
    for x in [-.054,.054]:
        fixed(box("folded card foot",(x,.021,.013),(.016,.018,.002),"teal"))
        fixed(cylinder("body-tab captive screw",(x,.020,.015),.0022,.002,"ink","Z"))
        fixed(cylinder("body-tab captive screw shank",(x,.020,.010),.0014,.010,"ink","Z"))
    # Printed facial features are marked as graphics, not mechanical hardware.
    for x in [.015,.028]:
        fixed(annulus("graphic spectacles",(x,d.body_y-.0013,.280),.006,.0051,.0002,"ink",samples=48))
        fixed(cylinder("graphic pupil",(x+.001,d.body_y-.0016,.280),.0012,.0002,"ink"))
    fixed(stroke("graphic spectacles bridge",[(.020,d.body_y-.0014,.280),(.023,d.body_y-.0014,.280)],.0005))
    fixed(stroke("graphic mouth",[(.031,d.body_y-.0014,.271),(.039,d.body_y-.0014,.270),(.044,d.body_y-.0014,.273)],.0006))
    wings={};rods={}
    for side,sign,wy,ry in [("right",1,d.right_wing_y,d.right_rod_y),("left",-1,d.left_wing_y,d.left_rod_y)]:
        hinge=(sign*d.hinge_x,wy,d.hinge_z)
        fixed(cylinder(side+" fixed wing hinge pin",(hinge[0],(d.body_y+wy)/2,d.hinge_z),d.pivot_radius,d.body_y-wy+.008,"ink"))
        fixed(cylinder(side+" hinge cap rear",(hinge[0],d.body_y+.003,d.hinge_z),.003,.002,"ink"))
        fixed(annulus(side+" prepared hinge spacer",(hinge[0],(d.body_y+wy)/2,d.hinge_z),.0037,d.pivot_bore,d.body_y-wy-.003,"birch"))
        wing=empty(side+" rigid wing",hinge);wing.parent=root
        # Root crank tab is part of the same rigid card cut-out; hole is 25 mm from hinge.
        a=-d.wing_angle_offset;qx=d.drive_radius*math.cos(a);qz=d.drive_radius*math.sin(a)
        local=[(-.005,-.005),(.004,-.007),(qx-.005,qz-.005),(qx+.005,qz-.005),
               (qx+.006,qz+.006),(.032,.008),(.047,.003),(.059,.022),(.076,.017),
               (.094,.039),(.110,.036),(.120,.064),(.071,.054),(.025,.031),(-.005,.006)]
        card=profile(side+" 2 mm card wing",[(sign*x,z) for x,z in local],d.wing_thickness,0,"orange")
        bore(card,(0,0,0),d.pivot_bore,.02)
        bore(card,(sign*qx,0,qz),d.pivot_bore,.02)
        parent_local(card,wing)
        # Drive pin bridges to that rod's plane; the two rods never share a rigid V.
        parent_local(cylinder(side+" wing drive pin",(sign*qx,(ry-wy)/2,qz),d.pivot_radius,wy-ry+.007,"ink"),wing)
        parent_local(cylinder(side+" wing drive pin front cap",(sign*qx,ry-wy-.003,qz),.0028,.002,"ink"),wing)
        parent_local(cylinder(side+" wing drive pin rear cap",(sign*qx,.0025,qz),.0028,.002,"ink"),wing)
        parent_local(annulus(side+" drive spacer",(sign*qx,(ry-wy)/2,qz),.0032,d.pivot_bore,wy-ry-.004,"birch"),wing)
        parent_local(cylinder(side+" hinge cap front",(0,-.003,0),.003,.002,"ink"),wing)
        # Graphic wing ribs rotate with the rigid wing.
        for tip in [(sign*.120,.064),(sign*.094,.039),(sign*.059,.022)]:
            parent_local(stroke(side+" graphic wing rib",[(0,-.00125,0),(tip[0],-.00125,tip[1])],.00045),wing)
        wings[side]=wing
        rod=empty(side+" independent 55 mm connecting rod");rod.parent=root
        # Capsule construction, with real holes in each eye. A long axis along local z.
        parent_local(box(side+" link web",(0,0,d.rod_length/2),(.0046,d.rod_thickness,d.rod_length),"birch"),rod)
        for z in [0,d.rod_length]:
            eye=parent_local(cylinder(side+" link pivot eye",(0,0,z),.004,d.rod_thickness,"birch"),rod)
            bore(eye,(0,0,z),d.pivot_bore,.02)
            # The link web must also be bored where it lies behind the eye.
            web=bpy.data.objects.get(side+" link web")
            bore(web,(0,0,z),d.pivot_bore,.02)
        rods[side]=rod
    spring=stroke("elastic return spring",[(.014,-.010,.12),(.014,-.010,.15)],d.spring_wire_radius,"ink");spring.parent=root
    from construction import special_material,surface
    spring_surface=special_material("dragon matte spring wire",(.001,.004,.009),roughness=1.)
    spring_surface.node_tree.nodes.get("Principled BSDF").inputs["Specular IOR Level"].default_value=0
    surface(spring,spring_surface)
    # Catalog tags name the actual supplied package, independently of scene names.
    parts={}
    for obj in root.children_recursive:
        if obj.type not in {"MESH","CURVE"}:continue
        name=obj.name
        if name.startswith(("birch base","body-tab captive","handle parking")):part_id="cd-base"
        elif name.startswith(("bearing frame","captive bearing")):part_id="cd-bearing-frames"
        elif name.startswith(("straight 6","shaft retaining","capped far","shaft cap parking")):part_id="cd-shaft"
        elif name.startswith(("parked original",)):part_id="cd-cam"
        elif name.startswith((variant+" cam","quick-change","captive split-hub")):
            part_id="cd-double-cam" if variant=="two_lobe" else "cd-cam"
        elif name.startswith("cam parking clip"):part_id="cd-double-cam"
        elif name.startswith(("removable crank","crank socket","crank retaining","hand grip")):part_id="cd-crank-key"
        elif name.startswith(("guide ","square guide","fixed spring","spring bracket")):part_id="cd-guide"
        elif name.startswith(("50 mm flat","square follower","follower connection","moving spring")):part_id="cd-follower"
        elif name.startswith(("shared pin","follower pin","follower-eye","independent rod-eye")):part_id="cd-linkage"
        elif name.startswith("elastic return"):part_id="cd-return-spring"
        elif name.startswith("folded paper scale"):part_id="cd-cutouts"
        elif any(word in name for word in ["fixed wing hinge","prepared hinge spacer","hinge cap","tail attachment"]):part_id="cd-hinge-pins"
        elif any(word in name for word in ["link web","link pivot eye","wing drive pin","drive spacer"]):part_id="cd-linkage"
        elif name.startswith(("fixed stiff-card","folded card foot","fixed decorative","graphic ")) or "card wing" in name or "graphic wing" in name:part_id="cd-cutouts"
        else:raise ValueError("Untagged physical object: "+name)
        obj["part_id"]=part_id;obj["family"]="cam-dragon"
        parts.setdefault(part_id,[]).append(obj)
        if part_id=="cd-crank-key":obj["storage_with"]="cd-base"
    model={"root":root,"shaft":shaft,"follower":follower,"wings":wings,"rods":rods,
           "spring":spring,"variant":variant,"dimensions":d,"static":static,"parts":parts,"keeper":keeper,
           "handle_state":"fitted" if include_handle else "parked","view":dict(VIEW),
           "guide_cover":guide_cover,"guide_walls":guide_walls}
    # Separate rigid carriers support actual assembly/removal without mesh edits.
    for key,objects,origin in [
        ("handle",parts["cd-crank-key"],(0,0,d.shaft_z)),
        ("end_cap",[o for o in parts["cd-shaft"] if o.get("service_role")=="end_cap"],(0,0,d.shaft_z)),
        ("rear_collar",[o for o in parts["cd-shaft"] if o.get("service_role")=="rear_collar"],(0,0,d.shaft_z)),
        ("working_cam",[o for o in parts["cd-double-cam" if variant=="two_lobe" else "cd-cam"] if not o.name.startswith("cam parking")],(0,0,d.shaft_z)),
    ]:
        carrier=empty(key+" rigid carrier",origin);carrier.parent=root
        for obj in objects:obj.parent=carrier
        model[key]=carrier
    if variant=="two_lobe":
        carrier=empty("original cam rigid carrier",(-.074,.022,.058));carrier.parent=root;carrier.rotation_euler.y=math.pi/2
        for obj in parts["cd-cam"]:obj.parent=carrier
        model["original_cam"]=carrier
        clip=empty("cam parking clip carrier",(-.074,.022,0));clip.parent=root
        for obj in parts["cd-double-cam"]:
            if obj.name.startswith("cam parking"):
                obj.parent=clip;obj.location.x+=.074;obj.location.y-=.022
        model["cam_clip"]=clip
    apply_pose(model,0)
    return model


def apply_pose(model, theta, follower_height=None):
    """Only rigid transforms change; spring polyline is the single elastic part."""
    from mathutils import Vector
    p=solve_pose(theta,model["variant"],model["dimensions"],follower_height);d=model["dimensions"]
    set_guide_cover(model,False)
    model["shaft"].location=(0,0,d.shaft_z)
    for key in ["working_cam","end_cap","rear_collar"]:model[key].location=(0,0,d.shaft_z)
    model["keeper"].location=(.086,.055,.016)
    if "original_cam" in model:
        model["original_cam"].location=(-.074,.022,.058);model["original_cam"].rotation_euler=(0,math.pi/2,0)
        model["cam_clip"].location=(-.074,.022,0)
    model["shaft"].rotation_euler=(0,-theta,0)
    model["follower"].location=(0,0,p["foot_z"])
    for side,sign in [("right",1),("left",-1)]:
        model["wings"][side].rotation_euler.y=-sign*p["wing_angle"]
        a=Vector(p["rods"][side]["follower_pivot"]);b=Vector(p["rods"][side]["wing_pivot"])
        model["rods"][side].location=a
        model["rods"][side].rotation_euler=(0,math.atan2(b.x-a.x,b.z-a.z),0)
    for key in ["working_cam","end_cap","rear_collar"]:model[key].rotation_euler=(0,-theta,0)
    if model["handle_state"]=="fitted":
        model["handle"].location=(0,0,d.shaft_z);model["handle"].rotation_euler=(0,-theta,0)
    else:
        model["handle"].location=(.075,.075,.025);model["handle"].rotation_euler=(0,0,0)
    z0=d.spring_fixed_z;z1=p["foot_z"]+d.spring_collar_above_foot
    # Closed spring hooks wrap the two 0.8 mm anchor pins. Only this wire is elastic.
    points=[]
    for i in range(33):
        a=math.pi/2+2*math.pi*i/32
        points.append((.014+.00145*math.cos(a),-.0145,z0+.00145*math.sin(a)))
    turns=8;steps=128
    # The helix changes pitch and radius, preserving wire centreline length.
    coil_span=z1-z0-.008
    free_coil_span=d.spring_free_span-.008
    wire_length=math.hypot(2*math.pi*turns*.0025,free_coil_span)
    coil_radius=math.sqrt(wire_length**2-coil_span**2)/(2*math.pi*turns)
    # Route both leads above/below their bracket before they approach the coil.
    points.append((.014,-.0145,z0+.004))
    for i in range(steps+1):
        t=i/steps;a=2*math.pi*turns*t
        points.append((.014+coil_radius*math.sin(a),-.010+coil_radius*math.cos(a),z0+.004+coil_span*t))
    points.append((.014,-.0145,z1-.004))
    for i in range(33):
        a=-math.pi/2+2*math.pi*i/32
        points.append((.014+.00145*math.cos(a),-.0145,z1+.00145*math.sin(a)))
    curve=model["spring"].data
    curve.splines.clear();spline=curve.splines.new("POLY");spline.points.add(len(points)-1)
    for vertex,co in zip(spline.points,points):vertex.co=(*co,1)
    return p


def set_guide_cover(model, opened=False):
    """Move the entire removable cover, including its integral snap arms.

    Open is a supported, separated assembly still, not a motion trajectory:
    the maker first flexes the exposed arms out of their side-wall pockets.
    """
    model["guide_cover"].location=(0,-.014 if opened else 0,0)
    model["guide_cover"].rotation_euler=(0,0,0)
    model["guide_cover_open"]=bool(opened)


def set_state(model, identity):
    """Select an exact construction identity, resetting prior service/pose state.

    Use the eccentric factory through the first-wave state and the two-lobe
    factory for the exchanged cam, double wave and finished dragon. A variant
    mismatch is rejected instead of illustrating the wrong physical cam.
    """
    from construction import set_visible_parts
    if identity not in STATES and identity not in model["parts"]:
        raise ValueError("Unknown dragon identity: "+identity)
    needs_double=identity in {"cd-double-cam","cd-double-wave","crank-dragon"}
    if (needs_double and model["variant"]!="two_lobe") or (not needs_double and model["variant"]=="two_lobe" and identity in STATES and identity not in model["parts"]):
        raise ValueError("Dragon identity requires a different cam factory: "+identity)
    ids=STATES.get(identity,[identity])
    model["handle_state"]="parked" if identity=="crank-dragon" else "fitted"
    apply_pose(model,.6)
    set_guide_cover(model,identity=="cd-guide")
    set_visible_parts(model,ids)
    model["identity"]=identity
    return model


SERVICE_STEPS=("before_swap","follower_supported","cam_supported","cap_removed","cap_parked",
               "shaft_withdrawn","original_parked","replacement_aligned","shaft_reinserted",
               "cap_refitted","load_transferred","after_swap")


def set_service_state(model, step):
    """Place the same retained parts in explicit, stopped maintenance states.

    These are assembly stills, not a physics simulation or motion interpolation.
    Manual support is declared where the maker actually has to hold a loose part.
    """
    if model["variant"]!="two_lobe":raise ValueError("Service sequence includes both cams")
    index=SERVICE_STEPS.index(step);d=model["dimensions"]
    model["handle_state"]="fitted" if index==0 else "parked"
    # Under load the 0.9 mm keeper bore settles 0.15 mm onto the 0.75 mm pin.
    supported_height=.095-(.0009-.00075) if 2<=index<=9 else None
    apply_pose(model,math.pi/2,follower_height=supported_height)
    if step=="after_swap":return {"step":step,"manual_support":[],"description":"Keeper and crank parked; both cams retained."}
    model["original_cam"].location=(0,0,d.shaft_z)
    model["original_cam"].rotation_euler=(0,-math.pi/2,0)
    # The incoming cam lies flat, hub up, on an empty part of the actual base.
    model["working_cam"].location=(.079,-.035,.015)
    model["working_cam"].rotation_euler=(-math.pi/2,0,math.pi/2)
    notes=[]
    if index>=1:model["keeper"].location=(0,0,.14275)
    if index>=2:
        for key in ["shaft","rear_collar","end_cap"]:model[key].rotation_euler=(0,0,0)
        model["original_cam"].rotation_euler=(0,math.pi/2,0)
        model["cam_clip"].location=(0,0,0)
    if index==3:
        model["end_cap"].location=(0,.018,d.shaft_z)
        notes.append("Maker holds the fully unscrewed cap clear of the shaft before placing it on its peg.")
    elif index>=4:model["end_cap"].location=(.080,-.030,.022)
    if 5<=index<8:model["shaft"].location.y=-.090
    if index>=6:
        model["original_cam"].location=(-.074,.022,.058)
        model["cam_clip"].location=(-.074,.022,0)
    if index>=7:
        model["working_cam"].location=(0,0,d.shaft_z);model["working_cam"].rotation_euler=(0,0,0)
    if index==7:notes.append("Maker holds the replacement cam by its rim until the shaft enters its hub.")
    if index>=9:model["end_cap"].location=(0,0,d.shaft_z)
    if index>=10:
        for key in ["shaft","rear_collar","end_cap","working_cam"]:model[key].rotation_euler=(0,-math.pi/2,0)
    descriptions={
        "before_swap":"Original cam at maximum lift; replacement rests flat on base.",
        "follower_supported":"Insert keeper while the cam still carries the follower; park the removable crank.",
        "cam_supported":"Release hub and rear collar at accessible angle, turn released original cam low, and slide its clip beneath it.",
        "cap_removed":"Unscrew and withdraw the end cap 18 mm; the collar remains captured by its bearing cradle.",
        "cap_parked":"Cap and captive screw retained on their parking peg.",
        "shaft_withdrawn":"Pull shaft forward 90 mm. Front bearing still supports it; cam rests on the clip.",
        "original_parked":"Move the supported original cam and its clip together to their parking place.",
        "replacement_aligned":"Align the replacement by hand; keeper holds follower 19.85 mm above its low profile.",
        "shaft_reinserted":"Slide shaft through hub, captured collar and rear bearing; secure hub and collar.",
        "cap_refitted":"Refit captive-screw end cap; both shaft stops are restored.",
        "load_transferred":"Turn new cam to full lift, transferring the follower load from keeper to cam before removing keeper.",
    }
    return {"step":step,"manual_support":notes,"description":descriptions[step],
            "shaft_withdrawal_m":.090 if 5<=index<8 else 0,
            "shaft_to_old_hub_axial_clearance_m":.007 if 5<=index<8 else None,
            "front_bearing_engagement_m":.008,
            "released_collar_maximum_radial_settle_m":.0001,
            "remaining_shaft_insertion_radial_margin_m":.0001,
            "follower_supported_by":"cam" if index in [0,1,10] else "keeper pin"}


def verify_blender_model(model, samples=144):
    """Cross-check rendered rigid transforms against the independent analytic pose."""
    import bpy
    from mathutils import Vector
    d=model["dimensions"]; errors=[]; length_errors=[];axis_errors=[];bore_axis_dots=[];plate_depths=[]
    bounds_min=[math.inf]*3;bounds_max=[-math.inf]*3
    a=-d.wing_angle_offset
    for i in range(samples):
        p=apply_pose(model,2*math.pi*i/samples)
        bpy.context.view_layer.update()
        for objects in model["parts"].values():
            for obj in objects:
                if obj.hide_render:continue
                for corner in obj.bound_box:
                    v=obj.matrix_world @ Vector(corner)
                    for axis in range(3):
                        bounds_min[axis]=min(bounds_min[axis],v[axis])
                        bounds_max[axis]=max(bounds_max[axis],v[axis])
        for side,sign in [("right",1),("left",-1)]:
            rod=model["rods"][side]
            start=rod.matrix_world @ Vector((0,0,0))
            end=rod.matrix_world @ Vector((0,0,d.rod_length))
            target_start=Vector(p["rods"][side]["follower_pivot"])
            target_end=Vector(p["rods"][side]["wing_pivot"])
            errors += [(start-target_start).length,(end-target_end).length]
            length_errors.append(abs((end-start).length-d.rod_length))
            wing_end=model["wings"][side].matrix_world @ Vector((sign*d.drive_radius*math.cos(a),0,d.drive_radius*math.sin(a)))
            axis_errors.append(math.hypot(wing_end.x-end.x,wing_end.z-end.z))
            bore_axis=(rod.matrix_world.to_3x3() @ Vector((0,1,0))).normalized()
            pin_axis=(model["wings"][side].matrix_world.to_3x3() @ Vector((0,1,0))).normalized()
            bore_axis_dots.append(abs(bore_axis.dot(pin_axis)))
            for obj in rod.children:
                if obj.type=="MESH":
                    ys=[(obj.matrix_world@v.co).y for v in obj.data.vertices]
                    plate_depths.append(max(ys)-min(ys))
    result={"sample_count":samples,"max_rendered_joint_position_error":max(errors),
            "max_rendered_rod_length_error":max(length_errors),"max_wing_link_axis_position_error":max(axis_errors),
            "minimum_actual_bore_pin_axis_dot":min(bore_axis_dots),"maximum_actual_rod_plate_depth":max(plate_depths),
            "swept_visible_bounds_min":bounds_min,"swept_visible_bounds_max":bounds_max,
            "mesh_tag_counts":{key:len(values) for key,values in model["parts"].items()},
            "precision_note":"Blender stores mesh transforms in float32; analytic proof uses Python doubles."}
    if max(errors+length_errors+axis_errors)>1e-6:raise AssertionError(result)
    if min(bore_axis_dots)<.999999 or max(plate_depths)>d.rod_thickness+1e-7:raise AssertionError(result)
    return result
