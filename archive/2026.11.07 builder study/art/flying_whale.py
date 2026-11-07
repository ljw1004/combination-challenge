"""Canonical still-art whale assembly; metres, z up, with physical interfaces.

Metres, z up; whale nose is -x and the audience is -y. The original dragon is
mounted without scaling, with its original y-axis shaft and every retained part.
Importing this module does not import Blender or change a scene. The theatre is
the canonical shadow_theatre model; electrical internals remain declared modules.
``build_model`` and ``apply_pose`` are reusable; ``layout_proof`` works in Python.

The one fictional force is a world-up force at LIFT_POINT. Static toy mass
assumptions estimate balance only: they do not validate lift capacity, strength,
stability in wind, batteries, descent control, anchor grip or a manufactured toy.
"""
from dataclasses import dataclass, asdict
import math

from cam_dragon import DIMS as DRAGON_DIMS


@dataclass(frozen=True)
class Dimensions:
    deck_top: float = .260
    deck_length: float = .720
    deck_width: float = .322
    spar_z: float = .669
    hull_half_width: float = .190
    keel_bottom: float = .055
    full_height: float = 1.000
    slider_min_x: float = -.185
    slider_max_x: float = .125
    small_pulley_radius: float = .012
    large_pulley_radius: float = .038
    belt_y: float = -.151
    dragon_x: float = -.185
    theatre_x: float = .245


DIMS = Dimensions()
DRAGON_MOUNT = (DIMS.dragon_x, 0., DIMS.deck_top)
THEATRE_INTERFACE = {
    "status": "Canonical shadow_theatre.py module; optical performance remains unmeasured",
    "envelope_min": (.155, -.065, .260),
    "envelope_max": (.335, .065, .390),
    "spindle_point": (.245, -.065, .318),
    "spindle_axis": (0., 1., 0.),
    "external_spindle_end": (.245, -.169, .318),
    "spindle_radius": .003,
    "lens_point": (.245, -.074, .376),
    "optical_axis": (0., -1., .08),
    "clear_optical_radius_at_lens": .008,
    "reserved_half_angle_radians": math.radians(5),
    "old_battery_and_hand_handle": "removed before mounting",
}
GUARD_INTERFACE = {
    "front_y_m": -.198, "rear_y_m": -.134,
    "installation_travel_m": .160, "screw_retraction_m": .016,
    "motor_housing_aperture_radius_m": .026,
    "instruction": "With power off, retract both captive screws 16 mm. Slide the complete rigid hood 160 mm rearward (+y), feeding the fixed ribs, braces, supports and deck lugs into their open rear channels. Seat the guide tubes against the lugs, then advance both screws.",
}
LIFT_POINT = (0., 0., .620)
TETHER_CLIPS = ((-.340, -.195, .244), (.340, -.195, .244), (.200, .195, .244))
GROUND_ANCHORS = ((-.850, -.4875, .047), (.850, -.4875, .047), (.500, .4875, .047))
SCREEN_INTERFACE = {
    "plane_y": -1.400,
    "x_range": (-.205, .695),
    "z_range": (1.275, 1.725),
    "grounded_beam_centre": (.245, -1.400, .48208),
    "full_height_beam_centre": (.245, -1.400, 1.48208),
    "instruction": "Set the 900 × 450 mm cloth around the intended full-height image; keep belt-linked theatre fixed.",
}

# Grams are deliberately estimates, not masses inferred from decorative meshes.
# The 380 g dragon includes its 240 x 150 x 12 mm birch base (~281 g at 650 kg/m3),
# both articulated links, all guides/fasteners and its parked original cam.
MASS_ASSUMPTIONS = (
    ("birch frame and braces", .420, (0., 0., .315), "structure"),
    ("paper skin, fixed fins and tail", .085, (.040, 0., .200), "structure"),
    ("3 mm plywood deck, crosspieces and brackets", .550, (.015, 0., .253), "structure"),
    ("complete original dragon, handle parked", .380, (-.185, .012, .335), "dragon"),
    ("theatre, old battery removed", .280, (.245, 0., .328), "theatre"),
    ("clutched motor and coupler", .110, (-.185, -.202, .318), "drive"),
    ("pulleys, belt and 1.5 mm clear guard", .210, (.030, -.151, .326), "drive"),
    ("tile and padded top cradle", .130, (0., 0., .611), "lift"),
    ("original short supports, lower frame, 3 mm tray and holders", .320, (0., 0., .145), "lift"),
    ("whale extension struts, sleeves and compression mount", .060, (0., 0., .480), "structure"),
    ("tile battery pack", .250, (0., .03545, .176), "lift"),
    ("accessory battery and fused divider", .120, (-.170, .06975, .193), "accessory"),
    ("controller, stop, harness and leads", .035, (0., .1325, .180), "lift"),
)
COUNTERWEIGHT_MASS = .250
COUNTERWEIGHT_Y = .110
COUNTERWEIGHT_Z = .140
RIB_STATIONS=((- .430,.075,.190),(-.340,.155,.300),(-.245,.178,.300),
              (-.050,.190,.300),(.080,.185,.300),(.200,.185,.300),(.340,.155,.300),(.430,.055,.175))
RIB_SEGMENTS=64
RIB_RADIUS=.0028


def rib_point(index,angle):
    """Rounded lower hull with room for the real tray, using fixed rib geometry."""
    x,ry,rz=RIB_STATIONS[index]
    signed=lambda value:math.copysign(abs(value)**.55,value)
    return (x,ry*signed(math.sin(angle)),.063+rz-rz*signed(math.cos(angle)))


def rib_surface(index,angle):
    """Point on an actual straight rib segment's outer surface, not an ideal oval."""
    step=2*math.pi/RIB_SEGMENTS;t=(angle%(2*math.pi))/step;i=int(t);f=t-i
    a=rib_point(index,i*step);b=rib_point(index,(i+1)*step)
    dy,dz=b[1]-a[1],b[2]-a[2];length=math.hypot(dy,dz)
    normal=(0,dz/length,-dy/length)
    return tuple(a[k]+f*(b[k]-a[k])+normal[k]*RIB_RADIUS for k in range(3))


def hull_surface(x,angle,side=1):
    if abs(angle)<1e-12:return (x,side*.006,.063)  # paper bonds to the exposed keel side
    angle=side*angle
    j=next((j for j in range(len(RIB_STATIONS)-1) if RIB_STATIONS[j][0]<=x<=RIB_STATIONS[j+1][0]),None)
    if j is None:raise ValueError("Outside ribbed hull")
    f=(x-RIB_STATIONS[j][0])/(RIB_STATIONS[j+1][0]-RIB_STATIONS[j][0])
    a=rib_surface(j,angle);b=rib_surface(j+1,angle)
    return tuple(a[k]+f*(b[k]-a[k]) for k in range(3))


def hull_at_z(x,z,side=1):
    lo,hi=0.,math.pi
    for _ in range(50):
        mid=(lo+hi)/2
        if hull_surface(x,mid,side)[2]<z:lo=mid
        else:hi=mid
    return hull_surface(x,(lo+hi)/2,side)


def mass_balance(configuration="loaded", trimmed=True):
    """A transparent lumped static estimate, including stage-specific trim need."""
    groups = {"structure", "lift"}
    if configuration in {"dragon", "loaded"}:
        groups.add("dragon")
    if configuration == "loaded":
        groups.update({"theatre", "drive", "accessory"})
    if configuration not in {"empty", "dragon", "loaded"}:
        raise ValueError(configuration)
    parts = [p for p in MASS_ASSUMPTIONS if p[3] in groups]
    moments = [sum(m*p[i] for _, m, p, _ in parts) for i in range(3)]
    mass = sum(p[1] for p in parts)+COUNTERWEIGHT_MASS
    required = (mass*LIFT_POINT[0]-moments[0])/COUNTERWEIGHT_MASS
    slider = required if trimmed else 0.
    moments = [moments[0]+COUNTERWEIGHT_MASS*slider,
               moments[1]+COUNTERWEIGHT_MASS*COUNTERWEIGHT_Y,
               moments[2]+COUNTERWEIGHT_MASS*COUNTERWEIGHT_Z]
    cg = tuple(v/mass for v in moments)
    return {"configuration": configuration, "trimmed": trimmed, "mass_kg": mass,
            "cg_m": cg, "slider_x_m": slider, "required_slider_x_m": required,
            "slider_within_travel": DIMS.slider_min_x <= required <= DIMS.slider_max_x,
            "lift_above_cg_m": LIFT_POINT[2]-cg[2],
            "horizontal_lift_to_cg_m": math.hypot(cg[0]-LIFT_POINT[0], cg[1]-LIFT_POINT[1]),
            "gravity_force_N": mass*9.81,
            "parts": [{"name": n, "mass_kg": m, "cg_m": p} for n,m,p,_ in parts]
                     +[{"name": "sliding counterweight", "mass_kg": COUNTERWEIGHT_MASS,
                        "cg_m": (slider, COUNTERWEIGHT_Y, COUNTERWEIGHT_Z)}]}


def belt_path(samples_per_arc=64):
    """Exact external tangencies for two parallel shafts, then faceted arcs."""
    a = (DIMS.dragon_x, .318)
    b = (DIMS.theatre_x, .318)
    r, R = DIMS.small_pulley_radius, DIMS.large_pulley_radius
    spacing = b[0]-a[0]
    angle = math.acos((r-R)/spacing)
    # Clockwise small outside arc, lower tangent, large outside arc, top tangent.
    points = []
    for i in range(samples_per_arc+1):
        t = angle+(2*math.pi-2*angle)*i/samples_per_arc
        points.append((a[0]+r*math.cos(t), DIMS.belt_y, a[1]+r*math.sin(t)))
    for i in range(samples_per_arc+1):
        t = -angle+2*angle*i/samples_per_arc
        points.append((b[0]+R*math.cos(t), DIMS.belt_y, b[1]+R*math.sin(t)))
    return points+[points[0]]


def tether_points(index, height):
    """Constant-length line with a low, anchor-height handling bend.

    This explicitly sketches Jo's managed slack, not unsupported cable dynamics.
    It never shortens the line to fake a taut lowered pose. At full height the
    two segments become one straight tensioned line.
    """
    clip = TETHER_CLIPS[index]
    start = (clip[0], clip[1], clip[2]+height)
    anchor = GROUND_ANCHORS[index]
    length = math.dist((clip[0], clip[1], clip[2]+DIMS.full_height), anchor)
    dx, dy = anchor[0]-start[0], anchor[1]-start[1]
    norm = math.hypot(dx, dy)
    normal = (-dy/norm, dx/norm)
    lo, hi = 0., length
    for _ in range(64):
        offset = (lo+hi)/2
        bend = (anchor[0]+normal[0]*offset, anchor[1]+normal[1]*offset, anchor[2])
        if math.dist(start,bend)+math.dist(bend,anchor) > length:
            hi = offset
        else:
            lo = offset
    bend = (anchor[0]+normal[0]*lo, anchor[1]+normal[1]*lo, anchor[2])
    return [start, bend, anchor]


def ground_line_points(kind,height,exit_point=None):
    """A fixed physical length, stored in separate open U loops on the ground.

    The loop bight moves outward as the whale lowers. This is a clear still
    arrangement made by Jo, with at least 200 mm spare loop at full height;
    it claims neither passive take-up nor a simulation of cable dynamics.
    """
    ex,ey,ez=exit_point or hull_at_z(.164,.186,1)
    if kind=="lift":
        moving=[(.023,.148,.194),(.023,.156,.194),(.070,.162,.208),(ex-.002,ey-.012,ez),(ex-.002,ey+.012,ez),(.162,.230,.176)]
        ground=(.162,.300,.008);lane=(.600,.620);return_x=.850;full_bight=.950
        tail=[(.850,.270,.008),(.550,.270,.008),(.550,.270,.040)]
    elif kind=="accessory":
        moving=[(-.170,-.060,.148),(-.170,-.076,.148),(-.170,-.076,.224),(.166,-.076,.224),(.166,.163,.224),(.166,.163,.186),(ex+.002,ey-.012,ez),(ex+.002,ey+.012,ez),(.166,.250,.176)]
        ground=(.146,.380,.008);lane=(.700,.720);return_x=.800;full_bight=1.050
        tail=[(.800,.625,.008),(.800,.610,.020),(.800,.590,.020),(.800,.575,.008),(.800,.400,.008),(.650,.400,.008),(.650,.400,.032)]
    elif kind=="stop":
        moving=[(.198,.1975,.187),(.198,.270,.162)]
        ground=(.130,.480,.008);lane=(.800,.820);return_x=.750;full_bight=1.100
        tail=[(.750,.725,.008),(.750,.710,.020),(.750,.690,.020),(.750,.675,.008),(.750,.625,.008),(.750,.610,.020),(.750,.590,.020),(.750,.575,.008),(.750,.500,.008),(.600,.500,.008),(.600,.500,.100)]
    else:raise ValueError(kind)
    raised=[(x,y,z+height) for x,y,z in moving]
    full=(moving[-1][0],moving[-1][1],moving[-1][2]+DIMS.full_height)
    bight=full_bight+(math.dist(full,ground)-math.dist(raised[-1],ground))/2
    radius=(lane[1]-lane[0])/2;centre=(lane[0]+lane[1])/2
    turn=[(bight+radius*math.sin(math.pi*i/16),centre-radius*math.cos(math.pi*i/16),.008) for i in range(17)]
    return raised+[ground,(ground[0],lane[0],.008)]+turn+[(return_x,lane[1],.008)]+tail


def layout_proof():
    """Named numeric constraints; mesh/sweep checks are separate and required."""
    configs = [mass_balance(c,t) for c in ("empty","dragon","loaded") for t in (False,True)]
    total = mass_balance()
    tether_errors = []
    for i in range(3):
        expected = math.dist(tether_points(i,DIMS.full_height)[0],GROUND_ANCHORS[i])
        for height in (0., .1, .25, .5, .75, 1.):
            p=tether_points(i,height)
            tether_errors.append(abs(sum(math.dist(a,b) for a,b in zip(p,p[1:]))-expected))
    # Radial ground anchor positions avoid a hidden yaw moment. Barycentric
    # weights place the resultant at the lift line, with positive cable tension.
    # One newton of additional vertical lift is an illustrative preload only.
    a,b,c=TETHER_CLIPS
    denominator=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
    w0=((b[1]-c[1])*(-c[0])+(c[0]-b[0])*(-c[1]))/denominator
    w1=((c[1]-a[1])*(-c[0])+(a[0]-c[0])*(-c[1]))/denominator
    weights=[w0,w1,1-w0-w1];forces=[];torques=[]
    for w,clip,anchor in zip(weights,TETHER_CLIPS,GROUND_ANCHORS):
        p=(clip[0],clip[1],clip[2]+DIMS.full_height)
        force=tuple((anchor[i]-p[i])*w/(p[2]-anchor[2]) for i in range(3))
        forces.append(force)
        torques.append((clip[1]*force[2]-clip[2]*force[1],
                        clip[2]*force[0]-clip[0]*force[2],
                        clip[0]*force[1]-clip[1]*force[0]))
    return {"status": "Canonical still geometry and explicit assumed static mass",
            "units": "metres, kilograms, newtons", "dimensions": asdict(DIMS),
            "dragon_mount": DRAGON_MOUNT, "dragon_scale": [1.,1.,1.],
            "theatre_interface": THEATRE_INTERFACE, "screen_interface": SCREEN_INTERFACE, "lift_point": LIFT_POINT,
            "mass_assumptions_and_configurations": configs,
            "loaded_trimmed_mass_kg": total["mass_kg"], "loaded_trimmed_cg_m": total["cg_m"],
            "loaded_lift_above_cg_m": total["lift_above_cg_m"],
            "loaded_counterweight_x_m": total["slider_x_m"],
            "minimum_tether_clip_to_dragon_base_z_m": DIMS.deck_top-max(c[2] for c in TETHER_CLIPS),
            "speed_ratio_theatre_per_dragon_turn": DIMS.small_pulley_radius/DIMS.large_pulley_radius,
            "pulley_assembly_access": {
                "instruction":"Slide the coupler 23 mm toward the dragon and off the motor output; introduce the small pulley in the exposed gap, slide it back onto its key, then reconnect the coupler.",
                "normal_coupler_y_range_m":[-.109,-.081],
                "parked_coupler_y_range_m":[-.086,-.058],
                "parked_coupler_to_original_retaining_collar_gap_m":.002,
                "exposed_motor_tip_to_parked_coupler_gap_m":.018,
                "small_pulley_axial_thickness_m":.008,
                "pulley_y_range_after_fitting_m":[-.155,-.147],
                "limit":"Captive radial screws release pressure shoes before the coupling slides; nominal fit, not manufacturing certification.",
            },
            "tether_length_max_error_m": max(tether_errors),
            "tether_lengths_m": [math.dist(tether_points(i,1)[0],GROUND_ANCHORS[i]) for i in range(3)],
            "illustrative_tether_equilibrium": {
                "extra_vertical_lift_N":1., "barycentric_weights":weights,
                "positive_tensions_N":[math.sqrt(sum(v*v for v in f)) for f in forces],
                "net_cable_force_N":[sum(f[i] for f in forces) for i in range(3)],
                "net_cable_moment_about_lift_line_Nm":[sum(t[i] for t in torques) for i in range(3)],
                "required_total_upward_force_N":total["gravity_force_N"]+1.,
                "limit":"Chosen positive 1 N preload demonstrates a possible static pose; it does not specify tile performance or anchor capacity.",
            },
            "manuscript_corrections_required": [
                "c20 skin must explicitly leave the fair deck open and a clear projector exit; an uninterrupted paper wrap hides the dragon and intercepts the beam.",
                "c20 upper spar and tile cradle must run above the unchanged dragon sweep (this layout uses spar z=.669 m), not just above the .260 m deck.",
                "c21 theatre bracket must preserve a parallel y-axis spindle and lens exit at the declared interface; a general tilt adjustment cannot arbitrarily tilt the spindle while c22 uses a simple parallel-shaft belt.",
                "Resolved in builder-v5: replace c24 aiming wedge with an adjustable screen stand. Tilting only the theatre breaks spindle alignment; this model keeps it fixed.",
            ],
            "limits": [
                "Lift capacity/current law is fictional and unspecified; estimated gravity force is not a battery or tile rating.",
                "A lift point above CG supplies a restoring moment under the stated world-up-force fiction; three taut separated cables constrain orientation but do not make a six-DOF rigid fixture.",
                "Ground anchors are separate; grip, mass sufficiency, tension and wind loading are unvalidated.",
                "Tether slack during descent is schematic low managed slack; Jo supports the handling bend, and no cable dynamics or controlled-descent model is claimed.",
                "Theatre has canonical rotating-disc and thin-lens geometry; motor internals, controller and batteries remain declared modules. None is manufactured validation or final artwork acceptance.",
                "Masses are declared lumped assumptions; changing the theatre or drive requires recalculating trim and clearances.",
                "Hatch access, belt tangencies, optical reservation and sampled dragon/frame separation are geometric checks, not physical certification.",
            ]}


def build_model(state="fair-in-the-air", include_ground=True, include_theatre=True, show_optical_path=False):
    """Build an unscaled reusable whale with separate moving and ground roots."""
    import bpy
    from mathutils import Vector
    from scene_parts import box, cylinder, bore, empty, rod, stroke, annulus, material
    from cam_dragon import build_model as build_dragon

    root=empty("FLYING WHALE — unchanged full-size attractions")
    root["evidence_limit"]="Author geometry; manufactured tolerances and load capacity unmeasured"
    root["dimensions_m"]=str(asdict(DIMS))
    ground=empty("STATIONARY ground cradle, anchors and managed lines")
    parts={}; collision=[]; skin=[]; attachments=[]; rib_meshes={}
    def tag(obj, part_id, parent=root, obstacle=False, unfinished=False):
        obj.parent=parent;obj["part_id"]=part_id;obj["family"]="flying-whale"
        obj["unfinished_placeholder"]=unfinished
        parts.setdefault(part_id,[]).append(obj)
        if obstacle:collision.append(obj)
        return obj
    def timber(name,a,b,r=.003,part="whale-ribs"):
        return tag(rod(name,a,b,r,"birch"),part,obstacle=True)
    def surface(name,verts,faces,color,part,parent=root,obstacle=False):
        mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
        obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj)
        obj.data.materials.append(material(color))
        return tag(obj,part,parent,obstacle)
    def panel_xy(name,xy,z,thickness,part,color="paper"):
        n=len(xy);v=[(x,y,z+dz) for dz in [-thickness/2,thickness/2] for x,y in xy]
        f=[tuple(reversed(range(n))),tuple(range(n,2*n))]
        f += [(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
        return surface(name,v,f,color,part,obstacle=True)

    keel=tag(box("long light whale keel",(0,0,.063),(.93,.012,.016),bevel=.001),"whale-keel",obstacle=True)
    for j,(x,ry,rz) in enumerate(RIB_STATIONS):
        for i in range(RIB_SEGMENTS):
            # The service opening interrupts this rib. Its load travels through
            # a rigid three-piece bypass tied to the real hatch surround below.
            if j==4 and 8<=i<14:continue
            a=rib_point(j,2*math.pi*i/RIB_SEGMENTS);b=rib_point(j,2*math.pi*(i+1)/RIB_SEGMENTS)
            rib_meshes[(j,i)]=timber(f"rib {j+1:02d} segment {i+1:02d}",a,b,RIB_RADIUS)
    bypass=[rib_point(4,8*2*math.pi/RIB_SEGMENTS),(.150,.197,.11506490455373647),
            (.150,.197,.24089009207041578),rib_point(4,14*2*math.pi/RIB_SEGMENTS)]
    for a,b in zip(bypass,bypass[1:]):timber("rib 05 rigid service-opening bypass",a,b,RIB_RADIUS)
    def site(x,k,side=1,offset=0.):
        j=next(j for j,p in enumerate(RIB_STATIONS) if abs(p[0]-x)<1e-8)
        angle=side*(k+.5)*2*math.pi/RIB_SEGMENTS
        index=int((angle%(2*math.pi))/(2*math.pi/RIB_SEGMENTS))
        a=Vector(rib_point(j,index*2*math.pi/RIB_SEGMENTS));b=Vector(rib_point(j,(index+1)*2*math.pi/RIB_SEGMENTS))
        tangent=(b-a).normalized();normal=Vector((0,tangent.z,-tangent.y))
        return (a+b)/2+normal*(RIB_RADIUS+offset),tangent,normal,rib_meshes[(j,index)]
    # Spar is above the full 330 mm dragon height, not across its base or cam.
    tag(box("upper spar above full dragon sweep",(0,0,DIMS.spar_z),(.730,.016,.012),bevel=.001),
        "whale-top-spar",obstacle=True)
    for x in [-.34,.34]:
        for side in [-1,1]:
            timber("upper spar diagonal knee",hull_at_z(x,.510,side),(x,0,DIMS.spar_z-.006),.003,"whale-top-spar")
    # Deck slats rest on exactly two transverse crosspieces tied to rib knees.
    for x,rx,ry in [(-.245,-.245,.178),(.245,.200,.170)]:
        tag(box("deck crosspiece",(x,0,.247),(.016,.354,.020)),"whale-deck",obstacle=True)
        for y in [-.168,.168]:
            timber("deck rib knee",hull_at_z(rx,.160,1 if y>0 else -1),(x,y,.241),.005,"whale-deck")
    deck_slats=[]
    for i in range(-5,6):
        y=i*.030
        slat=tag(box("3 mm plywood deck slat with actual mount bores",(0,y,.2585),(.720,.022,.003)),"whale-deck",obstacle=True)
        deck_slats.append(slat)
        if i in [-2,2]:
            for x in [DIMS.dragon_x-.101,DIMS.dragon_x+.101]:
                bore(slat,(x,math.copysign(.056,y),.2555),.0031,.02,"Z")
        if i in [-5,5]:
            for x in [-.105,.105]:bore(slat,(x,math.copysign(.145,y),.2585),.0032,.02,"Z")
        if i==1:bore(slat,(.314,.030,.2585),.0036,.020,"Z")
        if i==5:bore(slat,(.114,.145,.2585),.0020,.020,"Z")
        if i==-4:bore(slat,(-.270,-.120,.2585),.0036,.020,"Z")
    for side in [-1,1]:
        for a,b in [(-.34,-.05),(-.05,.20)]:
            for lower,upper_x in [(a,b),(b,a)]:
                ends=[]
                for x,k in [(lower,10),(upper_x,17)]:
                    point,tangent,normal,target=site(x,k,side,.0007)
                    centre=point-normal*(RIB_RADIUS+.0007)
                    wrap=[centre+normal*(.0035*math.cos(t))+Vector((.0035*math.sin(t),0,0)) for t in [2*math.pi*j/64 for j in range(65)]]
                    tag(stroke("brace loop tied around actual rib",wrap,.0007,"ink"),"whale-brace-cord")
                    attachments.append({"name":"brace loop to rib","point":tuple(point-normal*.0007),"target":target})
                    ends.append(point)
                start,end=ends;direction=(end-start).normalized();middle=start+(end-start)*.18
                tag(stroke("anchored diagonal brace cord",[start,middle-direction*.006],.0007,"ink"),"whale-brace-cord",obstacle=True)
                tag(stroke("anchored diagonal brace cord",[middle+direction*.006,end],.0007,"ink"),"whale-brace-cord",obstacle=True)
                tag(rod("inline brace tensioner",middle-direction*.008,middle+direction*.008,.003,"teal"),"whale-tensioners",obstacle=True)
    panel_xy("rigid split tail panels",[(.415,-.025),(.490,-.135),(.560,-.135),(.515,0),(.560,.135),(.490,.135),(.415,.025)],
             .200,.003,"whale-tail")
    timber("rigid tail root",(.405,0,.065),(.470,0,.200),.006,"whale-tail")
    paper=material("paper").copy();paper.name="whale conforming light blue paper"
    paper.diffuse_color=(.32,.69,.78,1)
    paper.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value=(.32,.69,.78,1)
    def paper_surface(name,vertices,faces,part="whale-skin"):
        obj=surface(name,vertices,faces,"paper",part,obstacle=True)
        obj.data.materials.clear();obj.data.materials.append(paper);skin.append(obj);return obj
    # Actual lofted panels meet every rib. The two openings remove real faces.
    step=2*math.pi/RIB_SEGMENTS
    theta_port=[math.acos(((.363-z)/.300)**(1/.55)) for z in [.198,.210]]
    theta_cable=[math.acos(((.363-z)/.300)**(1/.55)) for z in [.180,.192]]
    angles=sorted({j*step for j in range(15)}|set(theta_port)|set(theta_cable))
    xs=sorted({p[0] for p in RIB_STATIONS}|{-.03,.15,.158,.170,.174,.186})
    for side in [-1,1]:
        for xa,xb in zip(xs,xs[1:]):
            for ta,tb in zip(angles,angles[1:]):
                midx=(xa+xb)/2;midtheta=(ta+tb)/2
                if side==1 and -.03<midx<.15 and midtheta>8*step:continue
                if side==1 and .174<midx<.186 and theta_port[0]<midtheta<theta_port[1]:continue
                if side==1 and .158<midx<.170 and theta_cable[0]<midtheta<theta_cable[1]:continue
                paper_surface("rib-conforming lower skin panel",[hull_surface(xa,ta,side),hull_surface(xb,ta,side),hull_surface(xb,tb,side),hull_surface(xa,tb,side)],[(0,1,2,3)])
        # Prepared tabs wrap a finite strip of the actual rod surface.
        for j,(x,_,_) in enumerate(RIB_STATIONS):
            for k in [2,6,10,13]:
                if side==1 and -.03<x<.15 and k>=8:continue
                point,tangent,normal,target=site(x,k,side)
                centre=point-normal*RIB_RADIUS;vertices=[]
                for along in [-.006,.006]:
                    for q in range(9):
                        phi=-math.pi/4+q*math.pi/16
                        vertices.append(tuple(centre+tangent*along+normal*(RIB_RADIUS*math.cos(phi))+Vector((RIB_RADIUS*math.sin(phi),0,0))))
                faces=[(q,q+1,10+q,9+q) for q in range(8)]
                paper_surface("prepared paper tab wrapped onto rib",vertices,faces)
                attachments.append({"name":"skin tab to rib","point":tuple(point),"target":target})
        # Each fin has two real rib roots and a continuous stiffened leading edge.
        fore=hull_surface(-.245,10*step,side);aft=hull_surface(-.05,10*step,side)
        tip=(-.12,side*.315,fore[2]);rear_tip=(-.065,side*.285,fore[2])
        fin=paper_surface("fixed stiffened paper fin",[fore,aft,rear_tip,tip],[(0,1,2,3)])
        timber("fin leading-edge stiffener",fore,tip,.002,"whale-skin")
        timber("fin root stiffener joins two ribs",fore,aft,.002,"whale-skin")
        for point,j in [(fore,2),(aft,3)]:
            index=int(((side*10*step)%(2*math.pi))/step)
            attachments.append({"name":"fin root to rib","point":point,"target":rib_meshes[(j,index)]})
        # End panels close the nose and tail onto actual keel-supported tips.
        for end_x,tip_x,tip_z in [(-.43,-.465,.135),(.43,.465,.145)]:
            timber("paper hull end support",(tip_x,0,.063),(tip_x,0,tip_z),.003,"whale-keel")
            for ta,tb in zip(angles,angles[1:]):
                paper_surface("shaped whale end panel",[(tip_x,0,tip_z),hull_surface(end_x,ta,side),hull_surface(end_x,tb,side)],[(0,1,2)])
    # A fixed light surround joins the curved skin to a genuinely opening hatch.
    for x in [-.03,.15]:
        tag(box("fixed hatch side stile",(x,.197,.1775),(.008,.006,.133),"birch"),"whale-hatch",obstacle=True)
        for z in [.115,.240]:
            nearby=-.05 if x<0 else .20
            timber("hatch surround to rib bracket",hull_at_z(nearby,z,1),(x,.197,z),.003,"whale-hatch")
    for z in [.115,.240]:tag(box("fixed hatch top/bottom rail",(.06,.197,z),(.188,.006,.008),"birch"),"whale-hatch",obstacle=True)
    for ta,tb in zip([a for a in angles if a>=8*step],[a for a in angles if a>=8*step][1:]):
        for x in [-.03,.15]:
            a=hull_surface(x,ta,1);b=hull_surface(x,tb,1)
            paper_surface("service opening folded side return",[a,b,(x,.200,b[2]),(x,.200,a[2])],[(0,1,2,3)])
    for t in [8*step,14*step]:
        a=hull_surface(-.03,t,1);b=hull_surface(.15,t,1)
        paper_surface("service opening folded top/bottom return",[a,b,(.15,.200,b[2]),(-.03,.200,a[2])],[(0,1,2,3)])
    hatch=tag(empty("service hatch hinge axis X",(.06,.2015,.240)),"whale-hatch")
    hatch_panel=tag(box("opening service hatch",(0,0,-.0625),(.180,.0015,.125),"paper"),"whale-hatch",hatch)
    hatch_panel.data.materials.clear();hatch_panel.data.materials.append(paper)
    tag(cylinder("service hatch continuous hinge",(.06,.2015,.240),.003,.185,"teal","X"),"whale-hatch")
    tag(cylinder("service hatch latch pull",(0,.004,-.113),.004,.006,"orange","Y"),"whale-hatch",hatch)
    timber("fixed button bezel to real side rib",hull_at_z(.20,.204,1),(.190,.185,.204),.003,"whale-hatch")
    control_exit=hull_at_z(.164,.186,1)
    tag(annulus("prepared lift-control cable grommet beside hatch",control_exit,.009,.0045,.004,"teal"),"whale-skin")
    # Printed features follow the same skin surface; they do not add mechanisms.
    eye=[]
    for j in range(49):
        a=2*math.pi*j/48;point=hull_at_z(-.385+.005*math.cos(a),.155+.005*math.sin(a),-1)
        eye.append((point[0],point[1]-.0003,point[2]))
    tag(stroke("printed whale eye",eye,.0008,"ink"),"whale-skin")
    smile=[hull_at_z(x,z,-1) for x,z in [(-.425,.122),(-.395,.112),(-.365,.118)]]
    tag(stroke("printed whale smile",[(x,y-.0003,z) for x,y,z in smile],.001,"ink"),"whale-skin")

    from lift_module import build_model as build_lift, TRAY_ORIGIN_IN_WHALE
    lift=build_lift(configuration="extended",include_stand=False)
    lift["root"].parent=root;lift["root"].location=TRAY_ORIGIN_IN_WHALE
    for part,objects in lift["parts"].items():parts.setdefault(part,[]).extend(objects)
    collision.extend(obj for obj in lift["geometry"] if not obj.hide_render)
    slider=lift["slider"];trim_handle=lift["trim_handle"]
    # A rigid fork bears upward from the cradle onto the original upper spar,
    # leaving the original crane lifting eyes clear between the fork legs.
    for x in [-.105,.105]:
        for y in [-.075,.075]:
            tag(box("cradle-to-spar compression fork leg",(x,y,.635),(.008,.008,.040),"teal"),"whale-module-mount",obstacle=True)
        tag(box("compression fork crosshead",(x,0,.659),(.014,.166,.008),"teal"),"whale-module-mount",obstacle=True)
    for x in [-.075,.075]:
        tag(stroke("upper module retaining strap",[(x,-.097,.605),(x,-.097,.678),(x,.097,.678),(x,.097,.605)],.003,"ink"),"whale-module-mount")
    # Button and guide are part of the hatch's fixed surround; the final fitting
    # is the separate pushrod joining that exterior button to the module stop.
    tag(cylinder("exterior red stop button",(.180,.213,.204),.012,.012,"orange","Y"),"whale-hatch")
    tag(annulus("stop pushrod guide through fixed skin",(.180,.196,.204),.006,.0022,.020,"teal"),"whale-hatch")
    tag(annulus("fixed stop-button support flange",(.180,.185,.204),.010,.0022,.004,"teal"),"whale-hatch")
    tag(cylinder("actual stop pushrod",(.180,.18225,.204),.002,.0585,"ink","Y"),"whale-stop-extension")
    # Bearing, spring and lever occupy separate axial stations. The crank
    # reaches back to the unchanged button with a cross-pad above the bearing.
    pivot=(.198,.2225,.187)
    tag(rod("stop pivot support arm",(.180,.185,.194),(.180,.2225,.187),.003,"teal"),"flight-stop-cord")
    bearing=cylinder("stop lever bearing",(.180,.2225,.187),.005,.014,"teal","X")
    bore(bearing,(.180,.2225,.187),.0031,.025,"X");tag(bearing,"flight-stop-cord")
    tag(cylinder("stop lever pivot pin",(.185,.2225,.187),.0029,.034,"ink","X"),"flight-stop-cord")
    stop_lever=tag(empty("stop lever free outside bearing",pivot),"flight-stop-cord")
    tag(rod("stop lever button arm",(0,0,0),(0,0,.017),.003,"orange"),"flight-stop-cord",stop_lever)
    tag(rod("stop lever button contact cross-pad",(-.018,-.0005,.017),(0,-.0005,.017),.003,"orange"),"flight-stop-cord",stop_lever)
    tag(rod("stop lever inward cord arm",(0,0,0),(0,-.025,0),.003,"orange"),"flight-stop-cord",stop_lever)
    tag(rod("return spring fixed anchor bracket",(.180,.2225,.182),(.1885,.234,.180),.0015,"teal"),"flight-stop-cord")
    coil=[(.1885,.234,.180),(.1885,.2265,.187)]
    for i in range(97):
        t=i/96;angle=6*math.pi*t
        coil.append((.1885+.0048*t,.2225+.004*math.cos(angle),.187+.004*math.sin(angle)))
    coil.extend([(.195,.2265,.196),(.198,.2225,.196)])
    tag(stroke("stop lever torsion return spring with seated ends",coil,.0006),"flight-stop-cord")

    dragon=build_dragon("two_lobe",include_handle=False)
    dragon["root"].parent=root;dragon["root"].location=DRAGON_MOUNT
    dragon["root"]["mounted_as"]="crank-dragon"
    for obj in dragon["root"].children_recursive:obj["mounted_as"]="crank-dragon"
    # Canonical bench state parks the removable crank on the base. The later
    # manuscript explicitly leaves hand handles in the workshop; retain their
    # source geometry as inactive storage rather than silently altering the toy.
    for obj in dragon["parts"]["cd-crank-key"]:
        obj.hide_render=True;obj.hide_viewport=True;obj["story_storage"]="left in workshop before flight"
    # Original mounting bores, pin centres and unscaled original base are reused.
    for x in [DIMS.dragon_x-.101,DIMS.dragon_x+.101]:
        for y in [-.056,.056]:
            tag(cylinder("dragon captive locking pin",(x,y,.261),.0028,.024,"ink","Z"),"fair-dragon-bracket")
            tag(cylinder("dragon captive pin head",(x,y,.274),.005,.002,"teal","Z"),"fair-dragon-bracket")
    for y in [-.056,.056]:
        spreader=box("dragon mounting spreader with crosspiece relief",(DIMS.dragon_x,y,.252),(.230,.016,.010),"teal")
        cutter=box("temporary crosspiece relief",(-.245,y,.252),(.0162,.030,.030))
        bpy.context.view_layer.objects.active=spreader;mod=spreader.modifiers.new("actual crosspiece relief","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
        bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
        tag(spreader,"fair-dragon-bracket")

    from shadow_theatre import build_model as build_theatre
    theatre_model=build_theatre(include_battery=False,include_handle=False)
    theatre=theatre_model["root"];theatre.parent=root;theatre.location=(.245,0,.260)
    theatre["interface_m"]=str(THEATRE_INTERFACE);theatre["mounted_as"]="shadow-theatre"
    for obj in theatre.children_recursive:obj["mounted_as"]="shadow-theatre"
    parts["shadow-theatre"]=[theatre]+[obj for obj in theatre_model["geometry"] if obj not in theatre_model["parts"]["theatre-cloth"]]
    cloth=theatre_model["parts"]["theatre-cloth"][0];cloth.parent=ground;cloth.location=(.245,-1.4,1.5)
    parts["theatre-cloth"]=[cloth]
    parts["crank-dragon"]=[dragon["root"]]+list(dragon["root"].children_recursive)
    if not include_theatre:
        for obj in theatre_model["geometry"]:obj.hide_render=True;obj.hide_viewport=True
    spindle=theatre_model["spindle"]
    theatre_pins=[]
    for x in [.185,.305]:
        spreader=box("theatre mounting spreader with aligned bores",(x,0,.252),(.018,.145,.010),"teal")
        for y in [-.045,.045]:bore(spreader,(x,y,.252),.0031,.025,"Z")
        if x>.3:bore(spreader,(.314,.030,.252),.0036,.025,"Z")
        tag(spreader,"fair-theatre-bracket")
        for y in [-.045,.045]:
            pin=cylinder("theatre aligned captive locking pin",(x,y,.252),.0028,.026,"ink","Z")
            bore(pin,(x,y,.2444),.0007,.014,"Y");theatre_pins.append(tag(pin,"fair-theatre-bracket"))
            tag(cylinder("theatre locking pin seated head",(x,y,.266),.005,.004,"teal","Z"),"fair-theatre-bracket")
            washer=annulus("theatre locking pin lower washer",(0,0,0),.005,.0029,.002,"teal")
            washer.rotation_euler.x=math.pi/2;washer.location=(x,y,.246);tag(washer,"fair-theatre-bracket")
            tag(cylinder("theatre pin captive retaining clip",(x,y,.2444),.0006,.012,"orange","Y"),"fair-theatre-bracket")
    motor_bracket=tag(box("motor bracket with actual saddle",(-.185,-.202,.279),(.065,.080,.050),"teal"),"fair-mounted-motor",obstacle=True)
    bore(motor_bracket,(-.185,-.202,.318),.0253,.100,"Y")
    # This prepared top-open channel receives the unchanged attached lead as
    # the motor is lowered into its saddle; no connector must pass a blind bore.
    cutter=box("temporary open motor-lead receiving channel",(-.204,-.202,.310),(.040,.0044,.050))
    bpy.context.view_layer.objects.active=motor_bracket;mod=motor_bracket.modifiers.new("actual open motor-lead receiving channel","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
    bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
    tag(box("motor bracket deck attachment",(-.185,-.152,.250),(.065,.036,.014),"teal"),"fair-mounted-motor",obstacle=True)
    tag(cylinder("supplied enclosed slow gearmotor body",(-.185,-.202,.318),.025,.060,"teal","Y"),"fair-mounted-motor",unfinished=False)
    tag(cylinder("supplied enclosed coaxial slip clutch",(-.185,-.169,.318),.014,.009,"orange","Y"),"fair-mounted-motor",unfinished=False)
    motor_shaft=tag(empty("motor shaft — coaxial with original dragon",(-.185,0,.318)),"fair-mounted-motor")
    output_shaft=cylinder("keyed motor output with prepared flat tip",(0,-.139,0),.003,.070,"ink","Y")
    cutter=box("temporary motor tip flat",(.006,-.1125,0),(.008,.021,.020))
    bpy.context.view_layer.objects.active=output_shaft;mod=output_shaft.modifiers.new("actual motor tip flat","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
    bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
    tag(output_shaft,"fair-mounted-motor",motor_shaft)
    tag(box("motor shaft key",(.003,-.151,0),(.002,.008,.002),"ink"),"fair-mounted-motor",motor_shaft)
    coupler=tag(empty("flexible coupling assembly / service slide"),"fair-dragon-coupler",motor_shaft)
    clamp_carriers=[]
    tag(annulus("bonded flexible coupling tube",(0,-.095,0),.006,.0032,.012,"orange"),"fair-dragon-coupler",coupler)
    for y in [-.099,-.095,-.091]:tag(annulus("flexible tube reinforcing fold",(0,y,0),.0068,.0032,.0015,"orange"),"fair-dragon-coupler",coupler)
    for hub_y,shoe_y,length in [(-.105,-.1065,.004),(-.085,-.0825,.0025)]:
        hub=annulus("coupler retaining hub with releasable flat shoe",(0,hub_y,0),.008,.0032,.008,"teal")
        cutter=box("temporary flat pressure-shoe guide",(.0038,shoe_y,0),(.0036,length+.0002,.0027))
        bpy.context.view_layer.objects.active=hub;mod=hub.modifiers.new("actual pressure-shoe guide","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
        bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
        bore(hub,(.0063,shoe_y,0),.0013,.010,"X");tag(hub,"fair-dragon-coupler",coupler)
        carrier=empty("flat clamp shoe and captive screw");carrier.parent=coupler;clamp_carriers.append(carrier)
        tag(box("flat pressure shoe bears on actual shaft flat",(.003,shoe_y,0),(.002,length,.0025),"ink"),"fair-dragon-coupler",carrier)
        tag(cylinder("coupler captive clamp screw",(.0063,shoe_y,0),.0012,.005,"ink","X"),"fair-dragon-coupler",carrier)
        tag(cylinder("coupler clamp screw head",(.0093,shoe_y,0),.002,.001,"orange","X"),"fair-dragon-coupler",carrier)
    for parent,radius in [(motor_shaft,DIMS.small_pulley_radius),(spindle,DIMS.large_pulley_radius)]:
        if parent==spindle:
            from shadow_theatre import d_socket
            pulley=d_socket("theatre pulley with matching flat-sided bore",(0,DIMS.belt_y,0),outer=radius,depth=.008)
        else:
            pulley=annulus("motor pulley with keyed shaft bore",(0,DIMS.belt_y,0),radius,.003,.008,"orange")
            cutter=box("temporary pulley keyway",(.0035,DIMS.belt_y,0),(.002,.012,.0022))
            bpy.context.view_layer.objects.active=pulley;mod=pulley.modifiers.new("actual keyway","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
            bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
        tag(pulley,"fair-reduction",parent)
        tag(cylinder("pulley face index mark",(radius*.65,DIMS.belt_y-.0045,0),.0015,.0007,"ink","Y"),"fair-reduction",parent)
    coupler["service_note"]="Release both captive screws and draw flat shoes outward 1.3 mm before sliding 23 mm toward dragon; tighten both after restoring."
    # The theatre's keyed shoulder and a new clip/spacer trap the large pulley.
    from shadow_theatre import d_socket
    tag(d_socket("theatre pulley rear shoulder spacer",(0,-.146,0),outer=.006,depth=.002),"fair-reduction",spindle)
    tag(d_socket("theatre pulley forward retaining spacer",(0,-.16015,0),outer=.006,depth=.0103),"fair-reduction",spindle)
    tag(cylinder("theatre pulley replacement retaining pin",(0,-.166,0),.0008,.018,"ink","Z"),"fair-reduction",spindle)
    # Small keyed pulley is locked axially by a represented radial grub screw.
    tag(cylinder("motor pulley retaining grub screw",(.006,-.151,0),.001,.006,"ink","X"),"fair-reduction",motor_shaft)
    belt=tag(stroke("matching soft belt on external tangents",belt_path(),.0016,"ink"),"fair-reduction")
    # A connected five-panel hood receives the assembled machine by one
    # horizontal translation. Its front surrounds the stationary motor case;
    # the case fills that aperture while the belt remains behind the guard.
    # Every fixed member entering from the open rear has a receiving channel.
    import bmesh
    front_y=GUARD_INTERFACE["front_y_m"];rear_y=GUARD_INTERFACE["rear_y_m"]
    depth=rear_y-front_y;middle_y=(front_y+rear_y)/2
    guard_root=tag(empty("complete rigid guard installation carrier"),"fair-guard")
    clear=material("paper").copy();clear.name="clear removable drive cover"
    shader=clear.node_tree.nodes["Principled BSDF"]
    shader.inputs["Base Color"].default_value=(.50,.85,.90,1)
    shader.inputs["Transmission Weight"].default_value=.92;shader.inputs["Roughness"].default_value=.13
    cover=[]
    def guard_cut(plate,cutter,name):
        bpy.context.view_layer.objects.active=plate;mod=plate.modifiers.new(name,"BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
        bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
    def swept_round_clearance(name,a,b,radius,travel):
        # Convex hull of a round rod and its translated copy is the exact
        # translational clearance envelope of this faceted cylindrical cutter.
        a,b=Vector(a),Vector(b);axis=(b-a).normalized()
        u=axis.cross(Vector((0,1,0)))
        if u.length<1e-8:u=axis.cross(Vector((1,0,0)))
        u.normalize();v=axis.cross(u);bm=bmesh.new()
        for dy in [0.,travel]:
            for end in [a,b]:
                for i in range(32):
                    angle=math.tau*i/32
                    bm.verts.new(end+Vector((0,dy,0))+radius*(u*math.cos(angle)+v*math.sin(angle)))
        bmesh.ops.convex_hull(bm,input=list(bm.verts),use_existing_faces=False)
        mesh=bpy.data.meshes.new(name);bm.to_mesh(mesh);bm.free();mesh.update()
        cutter=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(cutter);return cutter
    for name,pos,size in [
        ("drive cover front",(.030,front_y,.318),(.535,.0015,.094)),
        ("drive cover top",(.030,middle_y,.365),(.535,depth,.0015)),
        ("drive cover bottom",(.030,middle_y,.271),(.535,depth,.0015)),
        ("drive cover motor end",(-.238,middle_y,.318),(.0015,depth,.094)),
        ("drive cover theatre end",(.298,middle_y,.318),(.0015,depth,.094)),
    ]:
        obj=tag(box(name,pos,size,"paper"),"fair-guard",guard_root)
        obj.data.materials.clear();obj.data.materials.append(clear);cover.append(obj)
    bore(cover[0],(-.185,front_y,.318),GUARD_INTERFACE["motor_housing_aperture_radius_m"],.012,"Y")
    bore(cover[0],(.245,front_y,.318),.010,.012,"Y")
    # The open lower-left relief receives the motor saddle and its attached
    # supply lead. Removing the entire corner leaves no unsupported tiny flap.
    for plate in cover:
        cutter=box("temporary saddle and motor-lead entry relief",(-.19675,middle_y,.270),(.0905,depth+.020,.072))
        guard_cut(plate,cutter,"actual open saddle and motor-lead entry")
    for cord in parts["whale-brace-cord"]:
        if not cord.name.startswith("anchored diagonal"):continue
        points=[Vector(p.co[:3]) for p in cord.data.splines[0].points]
        for plate in cover:
            lo=[min(p[i] for p in points)-.002 for i in range(3)]
            hi=[max(p[i] for p in points)+.002+(GUARD_INTERFACE["installation_travel_m"] if i==1 else 0) for i in range(3)]
            if not all(lo[i]<plate.location[i]+plate.dimensions[i]/2 and hi[i]>plate.location[i]-plate.dimensions[i]/2 for i in range(3)):continue
            cutter=swept_round_clearance("temporary complete brace receiving path",points[0],points[-1],.002,GUARD_INTERFACE["installation_travel_m"])
            guard_cut(plate,cutter,"actual rear-open brace receiving channel")
    # The top and bottom channels admit actual rib rods, as well as the two
    # forward lift extensions, throughout insertion rather than only at rest.
    for plate in [cover[2],cover[1]]:
        for x,ry,_ in RIB_STATIONS:
            if not -.2375<x<.2975:continue
            y0=-ry-RIB_RADIUS-.0008;y1=rear_y+.004
            cutter=box("temporary rib receiving channel",(x,(y0+y1)/2,plate.location.z),(.0074,y1-y0,.012))
            guard_cut(plate,cutter,"actual open rib receiving channel")
        for x in [-.105,.105]:
            bore(plate,(x,-.145,plate.location.z),.0032,.012,"Z")
            cutter=box("temporary open support receiving slot",(x,-.137,plate.location.z),(.0064,.016,.012))
            guard_cut(plate,cutter,"actual open strut receiving slot")
    guard_screw_carriers=[];guard_guides=[]
    for x in [-.12,.29]:
        lug=box("drive guard receiving deck lug",(x,-.156,.2715),(.014,.012,.023),"teal")
        bore(lug,(x,-.156,.275),.0019,.020,"Y");tag(lug,"fair-guard",obstacle=True)
        y0=-.1622;y1=rear_y+.004
        cutter=box("temporary rear-open guard lug passage",(x,(y0+y1)/2,.271),(.0144,y1-y0,.012))
        guard_cut(cover[2],cutter,"actual rear-open receiving-lug passage")
        bore(cover[0],(x,front_y,.275),.0021,.010,"Y")
        tube_front=front_y+.00075;tube_rear=-.162
        guide=tag(annulus("guard captive-screw guide and compression spacer",(x,(tube_front+tube_rear)/2,.275),.004,.0026,tube_rear-tube_front,"teal"),"fair-guard",guard_root)
        guard_guides.append(guide)
        carrier=tag(empty("guard captive screw retracting carrier"),"fair-guard",guard_root);guard_screw_carriers.append(carrier)
        shaft_front=front_y-.00075;shaft_rear=-.14875
        tag(cylinder("captive clear-cover screw",(x,(shaft_front+shaft_rear)/2,.275),.0018,shaft_rear-shaft_front,"ink","Y"),"fair-guard",carrier)
        tag(cylinder("clear-cover seated screw head",(x,front_y-.00175,.275),.0035,.002,"orange","Y"),"fair-guard",carrier)
        tag(annulus("clear-cover captive retaining collar",(x,front_y+.018,.275),.0024,.0018,.002,"ink"),"fair-guard",carrier)
    # Separate accessory pack has a bearing shelf and closed retention straps.
    for x in [-.205,-.135]:
        for y in [.045,.060]:
            tag(rod("accessory shelf post forward of trim lane",(x,y,.122),(x,y,.1695),.003,"teal"),"fair-power-divider")
    tag(box("accessory battery bearing shelf",(-.17,.06975,.1695),(.090,.074,.004),"teal"),"fair-power-divider")
    tag(box("enclosed accessory battery",(-.17,.06975,.193),(.080,.060,.043),"ink",.002),"fair-power-divider")
    for x in [-.195,-.145]:
        tag(stroke("closed accessory battery strap",[(x,.03775,.1655),(x,.03775,.2165),(x,.10175,.2165),(x,.10175,.1655),(x,.03775,.1655)],.002,"teal"),"fair-power-divider")
    tag(box("fused accessory divider bearing bracket",(-.17,-.040,.128),(.082,.040,.012),"teal"),"fair-power-divider")
    divider=box("two fused accessory outlets declared module",(-.17,-.040,.148),(.080,.035,.028),"teal")
    bore(divider,(-.17,-.055,.148),.0018,.015,"Y");tag(divider,"fair-power-divider")
    tag(annulus("accessory master control actual receiving socket",(-.17,-.060,.148),.0035,.0018,.005,"teal"),"fair-power-divider")
    for x in [-.195,-.145]:tag(cylinder("fused outlet",(x,-.059,.148),.004,.006,"ink","Y"),"fair-power-divider")
    tag(stroke("accessory pack to divider",[(-.17,.03975,.193),(-.17,-.020,.185),(-.17,-.0225,.148)],.0012,"ink"),"fair-power-divider")
    tag(box("wired-switch storage dock",(-.29,-.13,.1855),(.048,.034,.004),"teal"),"fair-power-divider")
    tag(rod("switch dock attached below deck",(-.315,-.13,.257),(-.315,-.13,.1855),.003,"teal"),"fair-power-divider")
    # Physical wired master control is temporarily retained after the test. It is
    # unplugged and replaced by the ground panel extension for the garden scene.
    switch_carrier=empty("wired accessory switch removable body");switch_carrier.parent=root
    accessory_switch=tag(box("wired accessory master switch",(-.29,-.13,.20),(.045,.030,.025),"teal"),"fair-accessory-switch",switch_carrier)
    tag(cylinder("accessory switch button",(-.29,-.13,.216),.007,.007,"orange","Z"),"fair-accessory-switch",switch_carrier)
    switch_lead=tag(stroke("wired accessory switch detachable lead",[(-.17,-.060,.148),(-.17,-.076,.148),(-.24,-.08,.16),(-.29,-.115,.20)],.0012,"ink"),"fair-accessory-switch")
    for name,points in [
        ("clipped motor output cable",[(-.195,-.059,.148),(-.270,-.120,.23),(-.270,-.120,.272),(-.270,-.202,.281),(-.185,-.202,.294)]),
        ("theatre lamp lead through prepared deck and floor bores",[(-.145,-.062,.148),(-.145,-.088,.148),(-.145,-.088,.224),(.314,-.088,.224),(.314,.030,.224),(.314,.030,.280),(.314,.030,.290),(.314,.041,.290)]),
    ]:tag(stroke(name,points,.0012,"ink"),"fair-power-divider")
    tag(cylinder("lamp matching plug into retained socket",(.314,.042,.290),.0028,.014,"ink","Y"),"fair-power-divider")
    tag(cylinder("lamp plug strain relief",(.314,.0325,.290),.0035,.005,"teal","Y"),"fair-power-divider")
    for x,y,z in [(-.270,-.120,.244),(.314,.030,.244)]:
        clip=annulus("cable through-hole retaining grommet",(0,0,0),.004,.0015,.004,"teal")
        clip.rotation_euler.x=math.pi/2;clip.location=(x,y,z);tag(clip,"fair-power-divider")
        tag(rod("grommet bearing arm to deck underside",(x+.009,y,.257),(x+.004,y,z),.002,"teal"),"fair-power-divider")

    tethers=[];lead=None;stop_cord=None;short_tether=None;remote_lead=None
    if include_ground:
        tag(box("broad padded emergency-test tray",(0,0,.016),(1.00,.48,.025),"teal",.01),"flight-mat",ground)
        for x in [-.31,.31]:
            tag(box("fixed cradle crossbar",(x,0,.036),(.035,.43,.025)),"flight-mat",ground)
            tag(box("thick felt keel landing pad",(x,0,.052),(.090,.100,.010),"paper"),"flight-mat",ground)
            for y in [-.20,.20]:
                tag(rod("fixed cradle curved-side support",(x,y,.04),(x,y*1.15,.09),.009,"birch"),"flight-mat",ground)
        for x in [-.30,.30]:
            tag(rod("banner support on stationary cradle",(x,-.20,.036),(x,-.380,.160),.004,"teal"),"flight-mat",ground)
            tag(annulus("cradle banner receiving eye",(x,-.380,.160),.006,.003,.004,"teal"),"flight-mat",ground)
        short_anchor=(.20,.42,.047);short_clip=(.20,.195,.244)
        tag(cylinder("low test separate weighted anchor",(.20,.42,.020),.07,.040,"ink","Z"),"flight-short-tether",ground)
        tag(annulus("low test ground anchor eye",short_anchor,.008,.004,.006,"orange"),"flight-short-tether",ground)
        tag(annulus("low test removable rib clip",short_clip,.006,.003,.006,"orange"),"flight-short-tether")
        tag(rod("low test clip rigid rib bracket",hull_at_z(.20,.244,1),short_clip,.004,"teal"),"flight-short-tether")
        short_tether=tag(stroke("100 mm rise limiting short tether",[short_clip,short_anchor],.0011,"ink"),"flight-short-tether",ground)
        for i,(anchor,clip) in enumerate(zip(GROUND_ANCHORS,TETHER_CLIPS)):
            tag(cylinder(f"separate weighted garden anchor {i+1}",(anchor[0],anchor[1],.020),.070,.040,"ink","Z"),"flight-long-tether",ground)
            tag(annulus(f"garden anchor eye {i+1}",anchor,.008,.004,.006,"orange"),"flight-long-tether",ground)
            tag(annulus(f"separated frame tether clip {i+1}",clip,.006,.003,.006,"orange"),"flight-long-tether")
            ry=[.155,.135,.170][i]
            frame_y=math.copysign(ry*math.sqrt(1-((clip[2]-.363)/.300)**2),clip[1])
            tag(rod(f"tether clip {i+1} rigid rib bracket",(clip[0],frame_y,clip[2]),clip,.004,"teal"),"flight-long-tether")
            tethers.append(tag(stroke(f"garden tether {i+1}: fixed length / managed slack",tether_points(i,0),.0011,"ink"),"flight-long-tether",ground))
        panel=tag(box("ground control panel — electrically separate supplies",(.65,.37,.060),(.16,.12,.065),"teal"),"flight-rehearsal-remote",ground)
        cutter=box("temporary enable key slot",(.653,.313,.060),(.014,.026,.004))
        bpy.context.view_layer.objects.active=panel;mod=panel.modifiers.new("actual ground control key slot","BOOLEAN");mod.operation="DIFFERENCE";mod.object=cutter
        bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cutter,do_unlink=True)
        bore(panel,(.65,.40,.030),.0018,.020,"Z")
        bore(panel,(.72,.40,.094),.0015,.014,"Z")
        bore(panel,(.573,.32,.055),.0015,.016,"X")
        for x in [.60,.70]:tag(cylinder("ground control knob",(x,.37,.0975),.012,.010,"orange","Z"),"flight-rehearsal-remote",ground)
        lead=tag(stroke("separate low voltage lift-control lead",[(0,.151,.185),(.5,.35,.01),(.65,.37,.08)],.002,"teal"),"flight-control-lead",ground)
        hand_control=box("long-lead lift hand control",(.55,.27,.055),(.060,.050,.040),"teal")
        bore(hand_control,(.55,.27,.038),.0022,.016,"Z");bore(hand_control,(.55,.292,.055),.0015,.014,"Y");tag(hand_control,"flight-control-lead",ground)
        tag(cylinder("lift hand control dial",(.55,.27,.080),.010,.010,"orange","Z"),"flight-control-lead",ground)
        remote_lead=tag(stroke("separate accessory extension to ground master",[(-.17,-.0575,.148),(.5,.3,.01),(.65,.40,.08)],.0015,"ink"),"flight-rehearsal-remote",ground)
        tag(stroke("panel lift-control patch lead",[(.55,.290,.055),(.55,.320,.055),(.574,.320,.055)],.0012,"teal"),"flight-rehearsal-remote",ground)
        tag(cylinder("stop cord hand grip",(.60,.50,.100),.005,.050,"orange","X"),"flight-stop-cord",ground)
        stop_cord=tag(stroke("separate reachable stop cord",[(.180,.1975,.187),(.3,.55,.01),(.6,.50,.10)],.0011,"orange"),"flight-stop-cord",ground)
    else:
        ground.hide_render=True;ground.hide_viewport=True
    beam=None
    if show_optical_path:
        lens=THEATRE_INTERFACE["lens_point"];axis=THEATRE_INTERFACE["optical_axis"]
        beam=tag(stroke("PROOF ONLY reserved optical axis",[lens,tuple(lens[j]+axis[j]*.65 for j in range(3))],.001,"orange"),"proof-optical-axis")
        beam["proof_only"]=True
    model={"root":root,"ground_root":ground,"dragon":dragon,"theatre":theatre_model,"theatre_root":theatre,
           "theatre_spindle":spindle,"motor_shaft":motor_shaft,"hatch":hatch,"slider":slider,"lift":lift,
           "parts":parts,"collision_obstacles":collision,"skin":skin,"drive_cover":cover,
           "guard_root":guard_root,"guard_screw_carriers":guard_screw_carriers,"guard_guides":guard_guides,"guard_interface":GUARD_INTERFACE,
           "tethers":tethers,"short_tether":short_tether,"remote_lead":remote_lead,"control_lead":lead,"stop_cord":stop_cord,"optical_axis":beam,"trim_handle":trim_handle,
           "dimensions":DIMS,"theatre_interface":THEATRE_INTERFACE,"attachment_checks":attachments,"rib_meshes":rib_meshes,"deck_slats":deck_slats,
           "control_exit":control_exit,"stop_lever":stop_lever,"switch_carrier":switch_carrier,"switch_lead":switch_lead,"coupler":coupler,"clamp_carriers":clamp_carriers,"theatre_pins":theatre_pins,
           "include_ground":include_ground,"include_theatre":include_theatre,"state":state,
           "view":{"location":(1.1,-2.0,1.0),"target":(0,0,.32),"scale":1.24},
           "external_placements":{
               "flight-screen-stand":{"parent":ground,"location":(.245,-1.4,0)},
               "fair-written-banner":{"parent":ground,"location":(0,-.380,0)},
               "flight-level":{"parent":root,"location":(0,.09,.260)},
               "fair-start-key":{"parent":ground,"location":(.65,.269,.060)},
           }}
    set_state(model,state)
    return model


def set_guard_installation(model,travel=0.,screw_retraction=0.):
    """Rigid +y insertion of the complete hood, then captive screw engagement.

    Start at travel=.160 and screw_retraction=.016. Reduce travel to zero,
    keeping both screws retracted; only then advance the screws to zero.
    """
    if not 0<=travel<=GUARD_INTERFACE["installation_travel_m"]:raise ValueError("Guard insertion travel exceeded")
    if not 0<=screw_retraction<=GUARD_INTERFACE["screw_retraction_m"]:raise ValueError("Captive screw travel exceeded")
    model["guard_root"].location.y=-travel
    for carrier in model["guard_screw_carriers"]:carrier.location.y=-screw_retraction
    return {"travel_m":travel,"screw_retraction_m":screw_retraction}


def _set_polyline(obj,points):
    curve=obj.data;curve.splines.clear();spline=curve.splines.new("POLY");spline.points.add(len(points)-1)
    for vertex,p in zip(spline.points,points):vertex.co=(*p,1)


def apply_pose(model, theta, height=0., hatch_degrees=0., trimmed=True):
    """Rigid toy motion plus explicitly elastic belt/spring/managed line state."""
    if not 0 <= height <= DIMS.full_height:raise ValueError("height must lie between cradle and full tether height")
    if not 0 <= hatch_degrees <= 110:raise ValueError("hatch travel is 0..110 degrees")
    from cam_dragon import apply_pose as pose_dragon
    model["root"].location.z=height
    p=pose_dragon(model["dragon"],theta)
    model["motor_shaft"].rotation_euler.y=-theta
    model["theatre_spindle"].rotation_euler.y=-theta*DIMS.small_pulley_radius/DIMS.large_pulley_radius
    model["hatch"].rotation_euler.x=math.radians(hatch_degrees)
    from lift_module import apply_pose as pose_lift
    pose_lift(model["lift"],counterweight_x=mass_balance("loaded",trimmed)["slider_x_m"],show_handle=hatch_degrees>=60)
    for i,obj in enumerate(model["tethers"]):_set_polyline(obj,tether_points(i,height))
    for key,kind in [("control_lead","lift"),("remote_lead","accessory"),("stop_cord","stop")]:
        if model[key]:
            _set_polyline(model[key],ground_line_points(kind,height,model["control_exit"]))
            model[key]["proof_limit"]="Fixed total length with visible laid-out ground slack; quasi-static arrangement, not cable dynamics."
    if model["short_tether"]:
        start=(.20,.195,.244+min(height,.1));end=(.20,.42,.047)
        length=math.dist((.20,.195,.344),end);lo,hi=0.,length
        for _ in range(60):
            mid=(lo+hi)/2;point=(.20+mid,.42,.047)
            if math.dist(start,point)+math.dist(point,end)>length:hi=mid
            else:lo=mid
        _set_polyline(model["short_tether"],[start,(.20+lo,.42,.047),end])
    return {"dragon":p,"height_m":height,"hatch_degrees":hatch_degrees,
            "theatre_angle":theta*DIMS.small_pulley_radius/DIMS.large_pulley_radius}


def verify_blender_model(model, samples=144):
    """Sample actual mounted geometry, incl. body, links, original cam and wing.

    Disjoint AABBs prove separation. Broadphase hits use triangle BVH intersection
    (no penetration-volume claim); report unresolved overlapping bounds separately.
    Coupler/shaft, mount pins/base bores and deck/base seats are intentional contacts.
    """
    import bpy
    from mathutils import Vector
    from mathutils.bvhtree import BVHTree
    dragon=model["dragon"]
    apply_pose(model,0,0);bpy.context.view_layer.update()
    deps=bpy.context.evaluated_depsgraph_get()
    def mesh_data(obj):
        evaluated=obj.evaluated_get(deps);mesh=evaluated.to_mesh()
        vertices=[evaluated.matrix_world @ v.co for v in mesh.vertices]
        polygons=[tuple(p.vertices) for p in mesh.polygons]
        evaluated.to_mesh_clear()
        bounds=([min(v[i] for v in vertices) for i in range(3)],
                [max(v[i] for v in vertices) for i in range(3)])
        return bounds,BVHTree.FromPolygons(vertices,polygons,all_triangles=False)
    theatre_parts=[obj for obj in model["theatre"]["geometry"] if not obj.hide_render]
    fixed=[(obj,*mesh_data(obj)) for obj in model["collision_obstacles"]+theatre_parts if not obj.hide_render]
    parts=[obj for obj in dragon["root"].children_recursive if obj.type in {"MESH","CURVE"} and not obj.hide_render]
    minimum=[float("inf")]*3;maximum=[-float("inf")]*3
    hits=set();broadphase=set();optical_hits=set();joint_errors=[]
    minimum_spar_gap=float("inf")
    for i in range(samples):
        apply_pose(model,2*math.pi*i/samples,0)
        bpy.context.view_layer.update();deps=bpy.context.evaluated_depsgraph_get()
        for obj in parts:
            bounds,bvh=mesh_data(obj)
            for axis in range(3):
                minimum[axis]=min(minimum[axis],bounds[0][axis]);maximum[axis]=max(maximum[axis],bounds[1][axis])
            minimum_spar_gap=min(minimum_spar_gap,DIMS.spar_z-.006-bounds[1][2])
            for obstacle,obounds,other in fixed:
                overlap=all(bounds[0][a] < obounds[1][a]-1e-6 and bounds[1][a] > obounds[0][a]+1e-6 for a in range(3))
                if overlap:
                    pair=(obj.name,obstacle.name);broadphase.add(pair)
                    if bvh.overlap(other):hits.add(pair)
            # Sample centre plus rim rays of the reserved five-degree cone.
            lens=Vector(THEATRE_INTERFACE["lens_point"])
            direction=Vector(THEATRE_INTERFACE["optical_axis"]).normalized()
            for j in range(9):
                a=2*math.pi*(j-1)/8
                offset=Vector((math.cos(a),0,math.sin(a))) if j else Vector((0,0,0))
                origin=lens+offset*THEATRE_INTERFACE["clear_optical_radius_at_lens"]
                ray=(direction+offset*math.tan(THEATRE_INTERFACE["reserved_half_angle_radians"])).normalized()
                if bvh.ray_cast(origin,ray,2.)[0] is not None:optical_hits.add(obj.name)
        # Pose correctness after parenting: both rigid link ends in root coordinates.
        from cam_dragon import solve_pose
        pose=solve_pose(2*math.pi*i/samples,"two_lobe")
        for side in ["left","right"]:
            rod=dragon["rods"][side]
            for point,key in [((0,0,0),"follower_pivot"),((0,0,DRAGON_DIMS.rod_length),"wing_pivot")]:
                actual=rod.matrix_world @ Vector(point)
                target=dragon["root"].matrix_world @ Vector(pose["rods"][side][key])
                joint_errors.append((actual-target).length)
    # Optical path also avoids the whale's fixed structure, paper and drive cover.
    static_optical_hits=[]
    lens=Vector(THEATRE_INTERFACE["lens_point"]);direction=Vector(THEATRE_INTERFACE["optical_axis"]).normalized()
    for obj,_,bvh in fixed+[(o,*mesh_data(o)) for o in model["drive_cover"]]:
        if obj.get("family")=="shadow-theatre":continue  # Internal source-to-lens path checked by its own proof.
        for j in range(9):
            a=2*math.pi*(j-1)/8;offset=Vector((math.cos(a),0,math.sin(a))) if j else Vector((0,0,0))
            origin=lens+offset*.008;ray=(direction+offset*math.tan(math.radians(5))).normalized()
            if bvh.ray_cast(origin,ray,2.)[0] is not None:static_optical_hits.append(obj.name);break
    from shadow_theatre import verify_blender_model as verify_theatre
    theatre_proof=verify_theatre(model["theatre"],72)
    result={"sample_count":samples,"mounted_dragon_world_bounds_m":[minimum,maximum],
            "mounted_dragon_scale":list(dragon["root"].scale),
            "minimum_upper_spar_to_full_dragon_height_m":minimum_spar_gap,
            "max_mounted_dragon_joint_error_m":max(joint_errors),
            "dragon_vs_whale_triangle_intersections":sorted(hits),
            "unresolved_broadphase_pairs":sorted(broadphase-hits),
            "dragon_optical_ray_hits":sorted(optical_hits),
            "fixed_structure_optical_ray_hits":sorted(set(static_optical_hits)),
            "mounted_theatre_proof":theatre_proof,
            "optical_check":"9 rays from lens rim/centre over 2 m; finite sampling, not full cone-solid proof",
            "hatch_opening_m":[.180,.125],
            "tether_limit":"All line vertices at/below clips z=.244+height, 16 mm below original dragon base; hull/ground slack crossings require visual review.",
            "intentional_contacts":["dragon base bottom and deck slat tops", "original mounting bores and captive pins", "shaft/coupler and keyed pulley fits", "module straps and mount pads"],
            "limits":["BVH checks triangle intersections; coplanar seats and solid containment need separate reasoning.",
                      "Checks are nominal geometry, not material-strength, electrical or manufactured-tolerance certification.",
                      "Full dragon cycle sampled uniformly, not continuous collision certification."]}
    apply_pose(model,0,0)
    if hits or optical_hits or static_optical_hits or not theatre_proof["passed"] or min(minimum_spar_gap,1e-6-max(joint_errors)) <= 0:
        result["passed"]=False
    else:result["passed"]=True
    return result


# Exact authored states. Temporary hand tools and removed test fixtures have an
# explicit custody policy; ancestry alone is not a complete assembly picture.
PRIMITIVES={"whale-keel","whale-ribs","whale-top-spar","whale-tail","whale-deck",
    "whale-brace-cord","whale-tensioners","whale-skin","whale-hatch","whale-module-mount",
    "whale-stop-extension","fair-dragon-bracket","fair-theatre-bracket","fair-power-divider",
    "fair-mounted-motor","fair-dragon-coupler","fair-reduction","fair-guard","fair-accessory-switch",
    "flight-short-tether","flight-mat","flight-control-lead","flight-trim-handle","flight-level",
    "flight-stop-cord","flight-long-tether","flight-screen-stand","flight-rehearsal-remote",
    "fair-written-banner","fair-start-key"}
EXTERNAL_IDS={"flight-level","flight-screen-stand","fair-written-banner","fair-start-key"}
STATES={part:{part} for part in PRIMITIVES}
STATES["whale-braces"]={"whale-brace-cord","whale-tensioners"}
STATES["whale-keel"]={"whale-keel"}
for previous,identity,addition in [
    ("whale-keel","whale-ribbed",{"whale-ribs"}),
    ("whale-ribbed","whale-spined",{"whale-top-spar"}),
    ("whale-spined","whale-tailed",{"whale-tail"}),
    ("whale-tailed","whale-decked",{"whale-deck"}),
    ("whale-decked","whale-braced-frame",STATES["whale-braces"]),
    ("whale-braced-frame","whale-mounted",{"whale-module-mount"}),
    ("whale-mounted","whale-lift-inside",{"lift-tile","lift-cradle","lift-pack","lift-tray","lift-slider","lift-control","lift-stop"}),
    ("whale-lift-inside","whale-skinned",{"whale-skin"}),
    ("whale-skinned","whale-hatched",{"whale-hatch"}),
    ("whale-hatched","whale-lift-fitted",{"whale-stop-extension"}),
    ("whale-lift-fitted","whale-dragon-seat",{"fair-dragon-bracket"}),
    ("whale-dragon-seat","whale-dragon-aboard",{"crank-dragon"}),
    ("whale-dragon-aboard","whale-theatre-seat",{"fair-theatre-bracket"}),
    ("whale-theatre-seat","whale-theatre-aboard",{"shadow-theatre"}),
    ("whale-theatre-aboard","whale-loaded",{"fair-power-divider"}),
    ("whale-loaded","whale-motor-fitted",{"fair-mounted-motor"}),
    ("whale-motor-fitted","whale-dragon-driven",{"fair-dragon-coupler"}),
    ("whale-dragon-driven","whale-theatre-driven",{"fair-reduction"}),
    ("whale-theatre-driven","whale-drive-guarded",{"fair-guard"}),
    ("whale-drive-guarded","whale-running-fair",{"fair-accessory-switch"}),
    ("whale-running-fair","whale-short-tethered",{"flight-short-tether"}),
    ("whale-short-tethered","whale-ready-low",{"flight-mat"}),
    ("whale-ready-low","whale-nose-down",{"flight-control-lead"}),
    ("whale-nose-down","whale-trimmed",set()),
    ("whale-trimmed","whale-hovering-low",set()),
    ("whale-hovering-low","whale-low-tested",{"flight-stop-cord"}),
    ("whale-low-tested","whale-garden-tethered",{"flight-long-tether"}),
    ("whale-garden-tethered","whale-aimed",{"flight-screen-stand"}),
    ("whale-aimed","whale-garden-ready",{"flight-rehearsal-remote"}),
    ("whale-garden-ready","fair-bannered",{"fair-written-banner"}),
    ("fair-bannered","fair-whale-alight",set()),
    ("fair-whale-alight","fair-in-the-air",set()),
]:STATES[identity]=STATES[previous]|addition
for identity in ["whale-garden-tethered","whale-aimed","whale-garden-ready","fair-bannered","fair-whale-alight","fair-in-the-air"]:
    STATES[identity].discard("flight-short-tether")
for identity in ["whale-garden-ready","fair-bannered","fair-whale-alight","fair-in-the-air"]:
    STATES[identity].add("fair-accessory-switch")

STATES["whale-hovering-low"].add("flight-level")
STATES["fair-in-the-air"].add("fair-start-key")
for _id in ["whale-aimed","whale-garden-ready","fair-bannered","fair-whale-alight","fair-in-the-air"]:STATES[_id].add("theatre-cloth")


def register_parts(model,part_objects):
    """Register supplied external prop roots/children without changing parents.

    Caller places screen stand at (.245,-1.4,0), banner at (0,-.380,0),
    level on the deck and the enable key at the ground control panel.
    Register the complete recursive object list to make visibility atomic.
    """
    for part,objects in part_objects.items():
        if part not in EXTERNAL_IDS:raise ValueError("Unsupported external whale prop: "+part)
        if not objects:raise ValueError("Cannot register empty prop: "+part)
        model["parts"][part]=list(dict.fromkeys(objects))
    set_state(model,model["state"])
    return model


def set_state(model,state):
    if state not in STATES:raise ValueError("Unknown whale identity: "+state)
    active=set(STATES[state])
    set_guard_installation(model)
    if state in EXTERNAL_IDS and state not in model["parts"]:
        raise ValueError("Register external prop before selecting: "+state)
    trimmed=state in {"whale-trimmed","whale-hovering-low","whale-low-tested","whale-garden-tethered","whale-aimed","whale-garden-ready","fair-bannered","fair-whale-alight","fair-in-the-air"}
    height=1. if state=="fair-in-the-air" else .1 if state=="whale-hovering-low" else 0.
    apply_pose(model,.6 if state in {"whale-running-fair","fair-whale-alight","fair-in-the-air"} else 0,
               height=height,hatch_degrees=95 if state in {"whale-trimmed","flight-trim-handle"} else 0,trimmed=trimmed)
    for part,objects in model["parts"].items():
        for obj in objects:
            visible=part in active
            if part.startswith("flight-") and not model["include_ground"] and part not in {"flight-trim-handle","flight-stop-cord"}:visible=False
            obj.hide_render=not visible;obj.hide_viewport=not visible
    # Original-size machines retain only explicitly removed original tools.
    if "crank-dragon" in active:
        for obj in model["dragon"]["parts"]["cd-crank-key"]:obj.hide_render=True;obj.hide_viewport=True
    if "shadow-theatre" in active and model["include_theatre"]:
        from shadow_theatre import set_state as theatre_state
        theatre_state(model["theatre"],"shadow-theatre")
        model["theatre_spindle"].rotation_euler.y=-.6*DIMS.small_pulley_radius/DIMS.large_pulley_radius if state in {"whale-running-fair","fair-whale-alight","fair-in-the-air"} else 0.
    if "shadow-theatre" not in active or not model["include_theatre"]:
        for obj in model["theatre"]["geometry"]:obj.hide_render=True;obj.hide_viewport=True
    if state=="whale-trimmed":
        for obj in model["parts"]["flight-trim-handle"]:obj.hide_render=False;obj.hide_viewport=False
    for obj in model["parts"].get("proof-optical-axis",[]):obj.hide_render=True;obj.hide_viewport=True
    garden="flight-rehearsal-remote" in active
    model["switch_carrier"].parent=model["ground_root"] if garden else model["root"]
    model["switch_carrier"].location=(.94,.50,-.095) if garden else (0,0,0)
    model["switch_lead"].parent=model["ground_root"] if garden else model["root"]
    _set_polyline(model["switch_lead"],[(.65,.385,.105),(.65,.392,.105),(.72,.392,.105),(.72,.40,.105),(.72,.40,.090)] if garden else [(-.17,-.060,.148),(-.17,-.076,.148),(-.24,-.08,.16),(-.29,-.115,.20)])
    for obj in model["parts"]["theatre-cloth"]:obj.hide_render="theatre-cloth" not in active;obj.hide_viewport=obj.hide_render
    model["state"]=state
    # Small families retain a useful close view. Garden props use a wide physical
    # scene; no part is rescaled to accommodate its distance from the whale.
    model["view"]={"location":(1.1,-2.,1.),"target":(0,0,.32),"scale":1.24}
    if "flight-long-tether" in active or "flight-short-tether" in active or state in {"flight-control-lead","flight-stop-cord","flight-rehearsal-remote"}:
        model["view"]={"location":(2.3,-4.,2.6),"target":(0,-.22,.75 if height else .36),"scale":3.4}
    return active
