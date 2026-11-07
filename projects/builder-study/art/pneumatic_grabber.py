"""Canonical dimensioned pneumatic grabber prototype (metres, z up).

The fixed beam runs along x; +x points towards the jaws. Positive y identifies
one jaw. All rigid parts retain their meshes; pivots rotate and the crosshead
translates. Dimensions and solve_pose are usable without Blender.

This is a geometry/kinematics prototype, not a validated build specification.
The input plunger is an explicitly illustrative pressure allowance, not a
pneumatic force simulation. Return-band strain is reported, not a material
claim. Tube centerline curvature is measured, not proof against real kinking.

    python3 pneumatic_grabber.py --check
    Blender --background --python pneumatic_grabber.py -- --render-dir runs/...

build_model(dims=Dimensions(), part_ids=None) returns a model dictionary;
apply_pose(model, stroke_metres) moves the same model. Every model object has a
manuscript supply part_id; set_visible_parts can expose partial assemblies.
"""
from dataclasses import dataclass, asdict
import argparse
import json
import math
from pathlib import Path
import sys


PART_IDS = frozenset({
    "air-beam", "air-jaws", "air-slider", "air-links", "air-output-syringe",
    "air-cradle", "air-return-band", "air-control-syringe", "air-tube",
    "air-grip-pads", "air-tube-clips",
})

COMPONENT_DESCRIPTION_UPDATES = {
    "air-cradle": "Two barrel cups with captive mounting fasteners, a soft strap factory-bonded into the rear cup, and a plunger-end clip. They hold the syringe in line with the slider, with the nozzle toward the handle and the plunger toward the jaws.",
    "air-return-band": "A soft elastic loop with prepared anchor hooks and a broad peel-and-stick foot for the fixed hook. It pulls the slider back, opening the jaws and returning the output plunger into its barrel.",
    "air-tube-clips": "Ready-made tube clips and a strapped hand-syringe holder on shaped peel-and-stick feet for the beam and handgrip. The clips hold the tube without flattening it; a loose loop leaves room to move the hand syringe.",
}

# Upper-jaw local plan. The lower jaw is its exact reflection. Both have a
# 40 mm rear pin and a rounded, inward-hooked front gripping end.
JAW_PROFILE = (
    (-.045, -.004), (-.043, -.007), (-.037, -.007), (-.012, -.008),
    (-.004, -.010), (.008, -.008), (.061, .005), (.075, .002),
    (.082, -.011), (.089, -.012), (.095, -.007), (.096, .001),
    (.090, .012), (.077, .020), (.063, .022), (.006, .010),
    (-.010, .009), (-.040, .007), (-.045, .004),
)
PAD_PROFILE = ((.077, -.014), (.091, -.014), (.091, -.010), (.077, -.010))


@dataclass(frozen=True)
class Dimensions:
    beam_back: float = -.400
    beam_front: float = .014
    beam_width: float = .028
    beam_thickness: float = .014
    pivot_half_spacing: float = .040
    rear_arm: float = .040
    link_length: float = .052
    slider_pin_half_spacing: float = .008
    open_angle: float = .200
    closed_angle: float = -.250
    jaw_z: float = .027
    jaw_thickness: float = .006
    link_z: float = .038
    link_thickness: float = .003
    link_rod_radius: float = .0018
    slider_z: float = .027
    slider_length: float = .018
    slider_width: float = .022
    guide_inner_half_width: float = .012
    syringe_axis_z: float = .048
    barrel_length: float = .068
    barrel_outer_radius: float = .010
    barrel_inner_radius: float = .008
    barrel_end_wall: float = .002
    piston_thickness: float = .003
    output_initial_chamber: float = .009
    output_thumb_offset: float = -.013
    output_initial_exposed_stem: float = .017
    control_barrel_back: float = -.344
    control_y: float = -.050
    control_initial_chamber: float = .049
    input_allowance_ratio: float = 1.20
    tube_outer_radius: float = .002
    tube_inner_radius: float = .00125
    nozzle_outer_radius: float = .00125
    nozzle_bore_radius: float = .00075
    tube_nozzle_overlap: float = .004
    band_anchor_x: float = -.135
    band_slider_offset: float = -.006
    band_y: float = .0295
    band_z: float = .020
    band_loop_radius: float = .00225

    def slider_x_at_angle(self, theta):
        dy = self.pivot_half_spacing-self.slider_pin_half_spacing-self.rear_arm*math.sin(theta)
        radicand = self.link_length**2-dy**2
        if radicand <= 0:
            raise ValueError("Jaw/link dimensions cannot reach the requested angle")
        return -self.rear_arm*math.cos(theta)-math.sqrt(radicand)

    @property
    def slider_open_x(self):
        return self.slider_x_at_angle(self.open_angle)

    @property
    def travel(self):
        return self.slider_x_at_angle(self.closed_angle)-self.slider_open_x

    @property
    def output_barrel_front(self):
        return self.slider_open_x+self.output_thumb_offset-self.output_initial_exposed_stem

    @property
    def output_barrel_back(self):
        return self.output_barrel_front-self.barrel_length

    @property
    def stem_length(self):
        return self.barrel_length-self.output_initial_chamber+self.output_initial_exposed_stem

    @property
    def control_initial_thumb(self):
        return self.control_barrel_back+self.control_initial_chamber+self.stem_length


@dataclass(frozen=True)
class Pose:
    stroke: float
    jaw_angle: float
    slider_x: float
    slider_pins: tuple
    jaw_pins: tuple
    jaw_pivots: tuple
    link_angles: tuple
    pad_polygons: tuple
    jaw_polygons: tuple
    pad_inner_gap: float
    output_piston_x: float
    output_thumb_x: float
    input_stroke: float
    control_piston_x: float
    control_thumb_x: float


def _transform(points, theta, pivot_y, sign=1):
    c, s = math.cos(theta), math.sin(theta)
    return tuple((x*c-y*s, sign*(pivot_y+x*s+y*c)) for x, y in points)


def solve_pose(stroke, dims=Dimensions()):
    """Solve output stroke in metres over the monotone, non-toggle branch."""
    d = dims
    if not -1e-10 <= stroke <= d.travel+1e-10:
        raise ValueError(f"Output stroke must be between 0 and {d.travel:.9f} m")
    stroke = min(d.travel, max(0.0, stroke))
    x = d.slider_open_x+stroke
    lo, hi = d.closed_angle, d.open_angle
    for _ in range(64):
        mid = (lo+hi)/2
        if d.slider_x_at_angle(mid) > x:
            lo = mid
        else:
            hi = mid
    theta = (lo+hi)/2
    pins, rear, pivots, angles, pads, jaws = [], [], [], [], [], []
    for sign in (1, -1):
        a = (x, sign*d.slider_pin_half_spacing, d.link_z)
        b = (-d.rear_arm*math.cos(theta), sign*(d.pivot_half_spacing-d.rear_arm*math.sin(theta)), d.link_z)
        pins.append(a)
        rear.append(b)
        pivots.append((0, sign*d.pivot_half_spacing, d.jaw_z))
        angles.append(math.atan2(b[1]-a[1], b[0]-a[0]))
        pads.append(_transform(PAD_PROFILE, theta, d.pivot_half_spacing, sign))
        jaws.append(_transform(JAW_PROFILE, theta, d.pivot_half_spacing, sign))
    input_stroke = d.input_allowance_ratio*stroke
    return Pose(stroke, theta, x, tuple(pins), tuple(rear), tuple(pivots),
                tuple(angles), tuple(pads), tuple(jaws),
                2*min(y for _, y in pads[0]),
                d.output_barrel_back+d.output_initial_chamber+stroke,
                x+d.output_thumb_offset, input_stroke,
                d.control_barrel_back+d.control_initial_chamber-input_stroke,
                d.control_initial_thumb-input_stroke)


def gripping_pose(radius=.012, center_x=.080, dims=Dimensions()):
    """A sphere touches both inner pad faces before the empty hard stop.

    This checks geometric contact only. It neither compresses a pad nor proves
    enough friction to lift the supplied lightweight pretend fruit.
    """
    d = dims
    def clearance(stroke):
        t = solve_pose(stroke, d).jaw_angle
        return d.pivot_half_spacing*math.cos(t)-.014+center_x*math.sin(t)
    if not clearance(d.travel) < radius < clearance(0):
        raise ValueError("Sphere is outside the available grip range")
    lo, hi = 0., d.travel
    for _ in range(64):
        mid = (lo+hi)/2
        if clearance(mid) > radius:
            lo = mid
        else:
            hi = mid
    pose = solve_pose((lo+hi)/2, d)
    contact_local_x = center_x*math.cos(pose.jaw_angle)-d.pivot_half_spacing*math.sin(pose.jaw_angle)
    assert .077 < contact_local_x < .091, "Contact must lie on the pad face, not beyond an endpoint"
    return pose, {"sphere_radius_m": radius, "sphere_center": [center_x, 0., d.jaw_z],
                  "stroke_m": pose.stroke, "pad_contact_local_x_m": contact_local_x,
                  "face_contact_error_m": abs(clearance(pose.stroke)-radius)}


def tube_segments(d=Dimensions()):
    z, out = d.syringe_axis_z, d.output_barrel_back-.008+d.tube_nozzle_overlap
    return (
        ((out, 0, z), (out-.017, 0, z), (-.207, .030, .038), (-.232, .030, .038)),
        ((-.232, .030, .038), (-.265, .030, .038), (-.325, .030, .038), (-.350, .030, .038)),
        ((-.350, .030, .038), (-.400, .030, .038), (-.400, -.050, .038), (-.375, -.050, .038)),
        ((-.375, -.050, .038), (-.364, -.050, .038), (-.360, -.050, z), (d.control_barrel_back-.008+d.tube_nozzle_overlap, -.050, z)),
    )


def _bezier(segment, t):
    u = 1-t
    return tuple(u**3*segment[0][i]+3*u*u*t*segment[1][i]+3*u*t*t*segment[2][i]+t**3*segment[3][i] for i in range(3))


def tube_points(d=Dimensions(), samples_per_curve=48):
    return tuple(_bezier(seg, i/samples_per_curve) for k, seg in enumerate(tube_segments(d))
                 for i in range(0 if k == 0 else 1, samples_per_curve+1))


def _distance(a, b):
    return math.sqrt(sum((x-y)**2 for x, y in zip(a, b)))


def _tube_min_radius(d):
    radii = []
    for p in tube_segments(d):
        for j in range(101):
            t, u = j/100, 1-j/100
            v = tuple(3*u*u*(p[1][i]-p[0][i])+6*u*t*(p[2][i]-p[1][i])+3*t*t*(p[3][i]-p[2][i]) for i in range(3))
            a = tuple(6*u*(p[2][i]-2*p[1][i]+p[0][i])+6*t*(p[3][i]-2*p[2][i]+p[1][i]) for i in range(3))
            cross = (v[1]*a[2]-v[2]*a[1], v[2]*a[0]-v[0]*a[2], v[0]*a[1]-v[1]*a[0])
            norm = math.sqrt(sum(x*x for x in cross))
            if norm > 1e-14:
                radii.append(sum(x*x for x in v)**1.5/norm)
    return min(radii)


def check_motion(d=Dimensions(), samples=501):
    """Analytic constraints plus sampled clearance quantities, not dynamics."""
    poses = [solve_pose(d.travel*i/(samples-1), d) for i in range(samples)]
    errors = [abs(_distance(a, b)-d.link_length) for p in poses for a, b in zip(p.slider_pins, p.jaw_pins)]
    derivatives = []
    for p in poses:
        t = p.jaw_angle
        dy = d.pivot_half_spacing-d.slider_pin_half_spacing-d.rear_arm*math.sin(t)
        derivatives.append(d.rear_arm*math.sin(t)-dy*d.rear_arm*math.cos(t)/math.sqrt(d.link_length**2-dy**2))
    assert max(errors) < 1e-12
    assert max(derivatives) < 0, "Toggle or reversal inside the proposed operating range"
    assert all(a.pad_inner_gap > b.pad_inner_gap for a, b in zip(poses, poses[1:]))
    assert min(p.pad_inner_gap for p in poses) > 0, "Opposing pads penetrate"
    # Every vertex stays on its own side of the centre plane. This proves
    # separation for the entire (possibly concave) planar jaw polygon.
    assert min(y for p in poses for _, y in p.jaw_polygons[0]) > 0
    output_front = d.output_barrel_front
    output_front_clearance = min(output_front-p.output_piston_x-d.piston_thickness/2 for p in poses)
    control_back_clearance = min(p.control_piston_x-d.control_barrel_back-d.piston_thickness/2 for p in poses)
    output_back_clearance = min(p.output_piston_x-d.output_barrel_back-d.barrel_end_wall-d.piston_thickness/2 for p in poses)
    control_front_clearance = min(d.control_barrel_back+d.barrel_length-p.control_piston_x-d.piston_thickness/2 for p in poses)
    control_back_clearance -= d.barrel_end_wall
    assert min(output_front_clearance, output_back_clearance, control_back_clearance, control_front_clearance) > .005
    guide_clearance = d.guide_inner_half_width-d.slider_width/2
    assert guide_clearance > 0
    # Fixed z separation of the rods, jaws, and beam excludes the remaining
    # broad plan overlaps except the intentionally connected pivot hardware.
    rod_jaw_clearance = d.link_z-max(d.link_thickness/2, d.link_rod_radius)-(d.jaw_z+d.jaw_thickness/2)
    assert rod_jaw_clearance > 0
    tube = tube_points(d)
    tube_length = sum(_distance(a, b) for a, b in zip(tube, tube[1:]))
    area = math.pi*d.barrel_inner_radius**2
    initial_air = area*(d.output_initial_chamber+d.control_initial_chamber)+math.pi*d.tube_inner_radius**2*tube_length
    end_air = initial_air+area*(poses[-1].stroke-poses[-1].input_stroke)
    report = {
        "status": "geometric checks passed; independent review still required",
        "samples_including_endpoints": samples,
        "dimensions_m": asdict(d),
        "output_stroke_mm": d.travel*1000,
        "jaw_rotation_degrees_open_closed": [math.degrees(p.jaw_angle) for p in (poses[0], poses[-1])],
        "link_pin_distance_mm": d.link_length*1000,
        "maximum_link_length_error_m": max(errors),
        "slider_dx_dtheta_range_m_per_radian": [min(derivatives), max(derivatives)],
        "pad_inner_gap_mm_open_mid_closed": [solve_pose(d.travel*f, d).pad_inner_gap*1000 for f in (0, .5, 1)],
        "minimum_jaw_centerplane_clearance_mm": 1000*min(y for p in poses for _, y in p.jaw_polygons[0]),
        "output_piston_to_barrel_mouth_clearance_mm": output_front_clearance*1000,
        "control_piston_to_closed_wall_clearance_mm": control_back_clearance*1000,
        "output_piston_to_closed_wall_clearance_mm": output_back_clearance*1000,
        "control_piston_to_barrel_mouth_clearance_mm": control_front_clearance*1000,
        "slider_side_clearance_mm": guide_clearance*1000,
        "link_layer_to_jaw_top_clearance_mm": rod_jaw_clearance*1000,
        "tube_centerline_length_mm": tube_length*1000,
        "sampled_tube_min_bend_radius_mm": _tube_min_radius(d)*1000,
        "tube_to_nozzle_overlap_mm": d.tube_nozzle_overlap*1000,
        "nominal_tube_id_and_nozzle_od_mm": [2*d.tube_inner_radius*1000, 2*d.nozzle_outer_radius*1000],
        "nominal_seal_radial_clearance_mm": 0,
        "return_loop_center_distance_mm_open_closed": [(p.slider_x+d.band_slider_offset-d.band_anchor_x)*1000 for p in (poses[0], poses[-1])],
        "illustrative_input_stroke_mm": poses[-1].input_stroke*1000,
        "grip_contact": gripping_pose(dims=d)[1],
        "ideal_isothermal_pressure_ratio_from_illustrative_travel": initial_air/end_air,
        "scope": [
            "Rigid linkage solved from pin centres; 501 default samples, monotone branch derivative checked.",
            "Jaw/pad centre-plane separation and syringe piston engagement checked over travel.",
            "Guide stops impose this operating travel; they do not claim the barrel itself bottoms out.",
            "Pure-math checks do not establish solid clearance; the evaluated hardware sweep is reported separately.",
            "Input travel is a 20% illustrative displacement allowance, not a force/friction solution.",
            "Tube has a continuous tangent route. Bend radius is sampled; real anti-kink capability untested.",
            "Elastic band is allowed to stretch; stiffness, preload, fatigue, grip force and return reliability unvalidated.",
            "Friction, manufacturing tolerances, air leakage, seals and real child operation are not validated.",
        ],
    }
    return report


def _tag(obj, part_id):
    obj["part_id"] = part_id
    return obj


def _prism_xy(parts, name, points, thickness, z, color, part_id, parent=None):
    """Use the shared extrusion primitive, then map its x/z plan into x/y."""
    obj = parts.profile(name, points, thickness, y=0, color=color)
    # Map mesh coordinates directly. Blender transform_apply acts on selected
    # objects, so it is inappropriate for an unselected construction mesh.
    # This axis swap is a reflection; reverse winding to preserve normals.
    obj.location.z = z
    for vertex in obj.data.vertices:
        old_y, old_z = vertex.co.y, vertex.co.z
        vertex.co.y, vertex.co.z = old_z, old_y
    # Mirrored polygons need consistent outward winding on both jaws/pads.
    import bmesh
    mesh = bmesh.new()
    mesh.from_mesh(obj.data)
    bmesh.ops.recalc_face_normals(mesh, faces=list(mesh.faces))
    if mesh.calc_volume(signed=True) < 0:
        bmesh.ops.reverse_faces(mesh, faces=list(mesh.faces))
    mesh.to_mesh(obj.data)
    mesh.free()
    obj.data.update()
    if parent:
        obj.parent = parent
    return _tag(obj, part_id)


def _tube_x(parts, name, x0, x1, y, z, outer, inner, color, part_id, parent=None):
    import bpy
    obj = parts.cylinder(name, ((x0+x1)/2, y, z), outer, x1-x0, color, "X")
    parts.bore(obj, ((x0+x1)/2, y, z), inner, x1-x0+.004, "X")
    _tag(obj, part_id)
    if parent:
        obj.parent = parent
    return obj


def build_model(dims=Dimensions(), part_ids=None):
    """Build once. No scene reset, cameras, or render side effects."""
    import bpy
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import scene_parts as p
    d = dims
    model = {"dimensions": d, "objects": [], "jaws": [], "links": [],
             "receiving_holes": [], "retainers": [], "guide_fasteners": [],
             "adhesive_mounts": [], "factory_face_bonds": [], "factory_embeds": []}
    before = set(bpy.data.objects)

    def box(name, center, size, color, pid, parent=None, bevel=.0005):
        o = _tag(p.box(name, center, size, color, bevel), pid)
        if parent:
            o.parent = parent
        return o

    def cyl(name, center, radius, depth, color, pid, axis="Z", parent=None):
        o = _tag(p.cylinder(name, center, radius, depth, color, axis), pid)
        if parent:
            o.parent = parent
        return o

    def root(name, pid):
        return _tag(p.empty(name), pid)

    def ring(name, center, outer, inner, thickness, color, pid, parent=None):
        o = cyl(name, center, outer, thickness, color, pid, parent=parent)
        p.bore(o, center, inner, thickness+.004, "Z")
        return o

    def receiving_hole(obj, x, y, z, radius, length, group):
        p.bore(obj, (x, y, z), radius, length, "Z")
        model["receiving_holes"].append((obj, x, y, radius, group))

    def lower_head(name, center, radius, depth, pid, receiver, hole_radius, parent=None):
        head = cyl(name, center, radius, depth, "ink", pid, parent=parent)
        model["retainers"].append((head, receiver, hole_radius, radius))
        return head

    def adhesive_mount(name, foot, receiver, x, y, lower_z, width, length, pid):
        pad = box(name, (x, y, lower_z+.0003), (width, length, .0006), "orange", pid, bevel=0)
        pad["attachment"] = "supplied peel-and-stick adhesive pad, fitted after the beam"
        foot["attachment"] = "prepared mounting foot with supplied adhesive backing"
        model["adhesive_mounts"].append((pad, foot, receiver))
        return pad

    def factory_face_bond(member, receiver, center, width, length):
        member["attachment"] = "factory-bonded to its supplied mounting foot"
        model["factory_face_bonds"].append((member, receiver, center, width, length))

    def factory_embed(member, receiver, point, envelope_radius):
        member["attachment"] = "factory-bonded insertion into the supplied receiver"
        model["factory_embeds"].append((member, receiver, point, envelope_radius))

    # Beam and drilled end bridge: a single family of supplied prepared parts.
    beam = box("grabber beam", ((d.beam_back+d.beam_front)/2, 0, d.beam_thickness/2),
        (d.beam_front-d.beam_back, d.beam_width, d.beam_thickness), "birch", "air-beam", bevel=0)
    handgrip = box("handgrip sleeve", (-.360, 0, .007), (.074, .038, .019), "teal", "air-beam", bevel=.003)
    bridge = box("prepared pivot bridge", (0, 0, .015), (.025, .098, .008), "birch", "air-beam", bevel=0)
    for sign in (1, -1):
        receiving_hole(bridge, 0, sign*d.pivot_half_spacing, .015, .0021, .016, "jaw pivot bridge")
        ring(f"jaw spacer {sign}", (0, sign*d.pivot_half_spacing, .0215), .004, .0021, .005, "teal", "air-jaws")
        cyl(f"captive jaw pivot {sign}", (0, sign*d.pivot_half_spacing, .022), .0015, .026, "ink", "air-jaws")
        lower_head(f"jaw pivot lower retaining head {sign}", (0, sign*d.pivot_half_spacing, .010),
                   .003, .002, "air-jaws", bridge, .0021)
        ring(f"jaw pivot washer {sign}", (0, sign*d.pivot_half_spacing, .032), .004, .0016, .002, "orange", "air-jaws")
        cyl(f"jaw pivot retaining head {sign}", (0, sign*d.pivot_half_spacing, .034), .0025, .002, "ink", "air-jaws")
        jaw = root(f"rigid jaw pivot root {sign}", "air-jaws")
        profile = tuple((x, sign*y) for x, y in JAW_PROFILE)
        obj = _prism_xy(p, f"crab jaw {sign}", profile, d.jaw_thickness, 0, "birch", "air-jaws", jaw)
        p.bore(obj, (0, 0, 0), .0021, .012, "Z")
        p.bore(obj, (-d.rear_arm, 0, 0), .0017, .012, "Z")
        lower_head(f"jaw link lower retaining head {sign}", (-d.rear_arm, 0, -.004),
                   .0025, .002, "air-links", obj, .0017, jaw)
        _prism_xy(p, f"soft grip pad {sign}", tuple((x, sign*y) for x, y in PAD_PROFILE), .008, 0, "teal", "air-grip-pads", jaw)
        # Rear pin stands through a real spacer to the upper rod layer.
        cyl(f"jaw link pin {sign}", (-d.rear_arm, 0, .006), .0015, .020, "ink", "air-links", parent=jaw)
        ring(f"jaw link spacer {sign}", (-d.rear_arm, 0, .006), .0031, .0016, .0055, "teal", "air-links", jaw)
        cyl(f"jaw link captive head {sign}", (-d.rear_arm, 0, .014), .0025, .002, "ink", "air-links", parent=jaw)
        model["jaws"].append(jaw)

    # Two straight guide walls capture a rectangular sliding carriage. End
    # blocks, supplied with the guide, stop the carriage at both solved limits.
    x0 = d.slider_open_x-d.slider_length/2
    x1 = d.slider_open_x+d.travel+d.slider_length/2
    bed = box("guide bed fixed to beam", ((x0+x1)/2, 0, .018),
        (x1-x0+.010, .032, .008), "teal", "air-slider", bevel=0)
    # Captive push clips pass through actual bed/beam bores. Their top flanges
    # sit in recesses below the sliding shoe; the lower flanges retain the
    # assembly below the beam. Snap insertion/material strain is not simulated.
    for sign in (1, -1):
        for x in (x0-.002, x1+.002):
            y = sign*.008
            receiving_hole(beam, x, y, .007, .00135, .025, "guide beam mount")
            receiving_hole(bed, x, y, .018, .00135, .014, "guide bed mount")
            p.bore(bed, (x, y, .022), .0021, .004, "Z")
            model["guide_fasteners"].append(cyl(f"guide captive clip shank {sign} {x}",
                (x, y, .00975), .0012, .0215, "ink", "air-slider"))
            model["guide_fasteners"].append(cyl(f"guide recessed clip flange {sign} {x}",
                (x, y, .02075), .00195, .0015, "ink", "air-slider"))
            model["guide_fasteners"].append(lower_head(f"guide lower retaining flange {sign} {x}",
                (x, y, -.001), .00195, .002, "air-slider", beam, .00135))
    for sign in (1, -1):
        box(f"straight guide wall {sign}", ((x0+x1)/2, sign*(d.guide_inner_half_width+.002), .025),
            (x1-x0+.010, .004, .016), "teal", "air-slider")
        box(f"guide capture lip {sign}", ((x0+x1)/2, sign*.012, .033),
            (x1-x0+.010, .004, .002), "teal", "air-slider")
    for x in (x0-.002, x1+.002):
        box(f"guide travel stop {x}", (x, 0, .029), (.004, .024, .008), "ink", "air-slider")
    slider = root("straight sliding crosshead", "air-slider")
    shoe = box("captured sliding shoe", (0, 0, d.slider_z), (d.slider_length, d.slider_width, .010), "orange", "air-slider", slider, bevel=0)
    crosshead = box("raised crosshead between guide lips", (0, 0, .033), (.010, .019, .006), "orange", "air-slider", slider, bevel=0)
    for sign in (1, -1):
        y = sign*d.slider_pin_half_spacing
        boss = cyl(f"crosshead bored pin boss {sign}", (0, y, .0352), .003, .002, "orange", "air-slider", parent=slider)
        for member in (shoe, crosshead, boss):
            receiving_hole(member, 0, y, .030, .0017, .030, "crosshead link pin")
        # The lower captive heads are recessed above the shoe's sliding face.
        p.bore(shoe, (0, y, .022), .0027, .005, "Z")
        lower_head(f"slider pin lower retaining head {sign}", (0, y, .0235), .0025, .002,
                   "air-links", shoe, .0017, slider)
        cyl(f"independent slider pin {sign}", (0, y, .033), .0015, .020, "ink", "air-links", parent=slider)
        cyl(f"slider pin captive head {sign}", (0, sign*d.slider_pin_half_spacing, .042), .0025, .002, "ink", "air-links", parent=slider)
        link = root(f"rigid link root {sign}", "air-links")
        cyl(f"fixed length link rod {sign}", (d.link_length/2, 0, 0), d.link_rod_radius, d.link_length-.007, "orange", "air-links", "X", link)
        for x in (0, d.link_length):
            ring(f"link eye {sign} {x}", (x, 0, 0), .0043, .0017, d.link_thickness, "orange", "air-links", link)
        model["links"].append(link)
    model["slider"] = slider

    # Matching syringe geometry. The transparent hollow barrel is a genuine
    # annulus with a closed nozzle-end face, not a solid dummy cylinder.
    glass = bpy.data.materials.get("grabber clear syringe") or bpy.data.materials.new("grabber clear syringe")
    glass.use_nodes = True
    shader = glass.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (.52, .86, .87, 1)
    shader.inputs["Roughness"].default_value = .16
    shader.inputs["Transmission Weight"].default_value = .75
    shader.inputs["IOR"].default_value = 1.45

    def syringe(name, back, y, pid, piston_initial, thumb_initial):
        front, z = back+d.barrel_length, d.syringe_axis_z
        barrel = _tube_x(p, name+" hollow barrel", back, front, y, z, d.barrel_outer_radius,
                         d.barrel_inner_radius, "teal", pid)
        barrel.data.materials.clear()
        barrel.data.materials.append(glass)
        # The 1.5 mm nozzle bore is open through the barrel end wall; its
        # 2.5 mm outside diameter matches the tube ID over a 4 mm overlap.
        base = cyl(name+" nozzle end wall", (back+d.barrel_end_wall/2, y, z), d.barrel_outer_radius, d.barrel_end_wall, "teal", pid, "X")
        p.bore(base, (back+.001, y, z), d.nozzle_bore_radius, .010, "X")
        _tube_x(p, name+" open push fit nozzle", back-.008, back, y, z, d.nozzle_outer_radius, d.nozzle_bore_radius, "orange", pid)
        flange = box(name+" finger flange", (front-.001, y, z), (.002, .031, .023), "teal", pid)
        p.bore(flange, (front-.001, y, z), d.barrel_inner_radius, .008, "X")
        for i in range(1, 7):
            mark = p.stroke(name+f" scale line {i}", [(back+.009*i, y-.0097, z-.002), (back+.009*i, y-.0097, z+.003)], .00035, "ink")
            _tag(mark, pid)
        if pid == "air-control-syringe":
            for offset in (-.0007, .0007):
                points = [(back+d.control_initial_chamber+offset,
                           y+.0102*math.cos(a), z+.0102*math.sin(a))
                          for a in (math.pi*i/32 for i in range(33))]
                mark = _tag(p.stroke("hand syringe start mark", points, .0004, "orange"), pid)
                mark["mark"] = "49 mm chamber starting position"
        moving = root(name+" rigid plunger", pid)
        # Seal OD nominally equals bore ID: ideal sliding contact, no claimed
        # leakage or friction model. Plunger root starts at the piston centre.
        # The full stem and thumb
        # flange move as one rigid assembly, without scaling their length.
        cyl(name+" piston seal", (0, y, z), d.barrel_inner_radius, d.piston_thickness, "ink", pid, "X", moving)
        cyl(name+" plunger stem", (d.stem_length/2, y, z), .0025, d.stem_length, "orange", pid, "X", moving)
        cyl(name+" broad thumb pad", (d.stem_length, y, z), .012, .003, "orange", pid, "X", moving)
        moving.location.x = piston_initial
        return moving

    op = solve_pose(0, d)
    model["output_plunger"] = syringe("output syringe", d.output_barrel_back, 0, "air-output-syringe", op.output_piston_x, op.output_thumb_x)
    model["control_plunger"] = syringe("hand syringe", d.control_barrel_back, d.control_y, "air-control-syringe", op.control_piston_x, op.control_thumb_x)

    # Output cradle cups and a soft strap are integral supplied hardware.
    cradle_cups = []
    for x in (d.output_barrel_back+.012, d.output_barrel_front-.012):
        cradle = box(f"output barrel support {x}", (x, 0, .030), (.010, .028, .032), "teal", "air-cradle", bevel=0)
        cradle_cups.append(cradle)
        p.bore(cradle, (x, 0, d.syringe_axis_z), .0102, .018, "X")
        for sign in (1, -1):
            receiving_hole(beam, x, sign*.012, .007, .0011, .025, "cradle beam mount")
            receiving_hole(cradle, x, sign*.012, .030, .0011, .040, "cradle support mount")
            cyl(f"cradle captive fastener shaft {x} {sign}", (x, sign*.012, .02275), .0009, .0475, "ink", "air-cradle")
            lower_head(f"cradle lower retaining head {x} {sign}", (x, sign*.012, -.001),
                       .0017, .002, "air-cradle", beam, .0011)
            cyl(f"cradle captive fastener {x} {sign}", (x, sign*.012, .0465), .0015, .002, "ink", "air-cradle")
    # Both strap ends are factory-bonded 6 mm into the rear cup, offset from
    # its captive mounting shafts. They do not terminate on the bare beam.
    strap_x = d.output_barrel_back+.012+.0033
    strap_points = [(strap_x, .0112, .040)]+[(strap_x, .0112*math.cos(a), d.syringe_axis_z+.0112*math.sin(a)) for a in [i*math.pi/32 for i in range(33)]]+[(strap_x, -.0112, .040)]
    output_strap = _tag(p.stroke("soft output barrel strap", strap_points, .0012, "orange"), "air-cradle")
    for point in (strap_points[0], strap_points[-1]):
        factory_embed(output_strap, cradle_cups[0], point, .0012)
    # Two opposed C lips capture the output thumb disk on the carriage.
    for sign in (1, -1):
        box(f"plunger end clip side {sign}", (d.output_thumb_offset, sign*.0135, .044), (.008, .002, .020), "teal", "air-cradle", slider)
        for dx in (-.0025, .0025):
            box(f"plunger end clip lip {sign} {dx}", (d.output_thumb_offset+dx, sign*.0105, d.syringe_axis_z), (.0015, .005, .012), "teal", "air-cradle", slider)
    box("plunger clip bridge to crosshead", (-.009, 0, .035), (.014, .029, .001), "teal", "air-cradle", slider)
    box("plunger clip central support", (-.003, 0, .032), (.004, .008, .006), "teal", "air-cradle", slider)

    # Return loop lies clear of the guide walls, on two prepared hook pins.
    for moving in (False, True):
        parent, x = (slider, d.band_slider_offset) if moving else (None, d.band_anchor_x)
        if moving:
            # The moving hook passes OVER the guide wall, with its drop well
            # outside it. Parenting alone must never stand in for a bracket.
            box("moving return hook central upright", (x, 0, .039), (.004, .006, .018), "teal", "air-return-band", slider)
            box("moving return hook overhead arm", (x, d.band_y/2, .047), (.006, d.band_y+.006, .004), "teal", "air-return-band", slider)
            box("moving return hook outside drop", (x, d.band_y, .0345), (.006, .006, .025), "teal", "air-return-band", slider)
        else:
            # A single moulded cantilever foot overlaps a broad adhesive pad
            # on the beam. Its outside edge clears the front cradle cup.
            foot_plan = ((-.155, -.008), (-.141, -.008), (-.141, .010),
                         (-.133, .010), (-.133, .033), (-.154, .033),
                         (-.154, .014), (-.155, .014))
            fixed_foot = _prism_xy(p, "fixed return anchor support", foot_plan, .0034, .0163,
                                   "teal", "air-return-band")
            adhesive_mount("fixed return anchor adhesive pad", fixed_foot, beam,
                           -.148, .003, .014, .012, .020, "air-return-band")
        hook = cyl(f"return anchor hook {moving}", (x, d.band_y, d.band_z), .0015, .008, "ink", "air-return-band", parent=parent)
        if not moving:
            factory_embed(hook, fixed_foot, (x, d.band_y, .0164), .0015)
        cyl(f"return anchor hook cap {moving}", (x, d.band_y, d.band_z+.004), .0028, .0015, "ink", "air-return-band", parent=parent)
    model["band"] = _tag(p.stroke("stretching light return loop", [(0, 0, 0), (.01, 0, 0)], .00075, "orange"), "air-return-band")

    # Hand syringe holder beside the grip. Its nozzle remains fixed in this
    # pilot; the service loop permits real handling but is not simulated.
    for index, x in enumerate((d.control_barrel_back+.012, d.control_barrel_back+.052)):
        # The rear foot fits the handgrip's higher top, the front foot the bare
        # beam. Neither intersects the receiving wood. Both cups stay at the
        # accepted barrel position and meet their factory-bonded feet at z=20.
        receiver, receiving_z = (handgrip, .0165) if index == 0 else (beam, .014)
        foot_bottom = receiving_z+.0006
        foot = box(f"hand holder outrigger {x}", (x, -.025, (foot_bottom+.020)/2),
                   (.012, .078, .020-foot_bottom), "birch", "air-tube-clips", bevel=0)
        adhesive_mount(f"hand holder adhesive pad {x}", foot, receiver,
                       x, 0, receiving_z, .010, .022, "air-tube-clips")
        holder = box(f"hand barrel holder {x}", (x, d.control_y, .033), (.009, .026, .026), "teal", "air-tube-clips", bevel=0)
        p.bore(holder, (x, d.control_y, d.syringe_axis_z), .0103, .015, "X")
        factory_face_bond(holder, foot, (x, d.control_y, .020), .009, .026)
        strap = [(x, d.control_y+.0112, .040)]+[
            (x, d.control_y+.0112*math.cos(a), d.syringe_axis_z+.0112*math.sin(a))
            for a in (math.pi*i/32 for i in range(33))]+[(x, d.control_y-.0112, .040)]
        retaining_strap = _tag(p.stroke(f"hand holder retaining strap {x}", strap, .001, "orange"), "air-tube-clips")
        for point in (strap[0], strap[-1]):
            factory_embed(retaining_strap, holder, point, .001)
    tube = _tag(p.stroke("continuous flexible air tube", tube_points(d), d.tube_outer_radius, "paper"), "air-tube")
    # This is a rendered outside envelope, not a fluid mesh. Keep the barrel
    # transparency material separate so the tube remains legible in proofs.
    tube["bore_diameter_m"] = 2*d.tube_inner_radius
    for x in (-.245, -.305):
        foot = box(f"tube clip outrigger {x}", (x, .011, .0183), (.012, .046, .0074),
                   "birch", "air-tube-clips", bevel=0)
        adhesive_mount(f"tube clip adhesive pad {x}", foot, beam,
                       x, 0, .014, .010, .022, "air-tube-clips")
        # Split C clip can be fitted after both tube ends are connected.
        clip = _tag(p.annulus(f"gentle tube clip {x}", (0, 0, 0), .0035, .0022,
                              .007, "teal", samples=48, gap=2*math.pi/3), "air-tube-clips")
        clip.rotation_euler = (0, -math.pi/2, math.pi/2)
        clip.location = (x, .030, .038)
        stem = box(f"tube clip stem {x}", (x, .030, .029), (.006, .004, .014), "teal", "air-tube-clips", bevel=0)
        factory_face_bond(stem, foot, (x, .030, .022), .006, .004)
        factory_embed(clip, stem, (x, .030, .035), .0005)
    model["objects"] = list(set(bpy.data.objects)-before)
    for obj in model["objects"]:
        assert obj.get("part_id") in PART_IDS, (obj.name, obj.get("part_id"))
    apply_pose(model, 0)
    set_visible_parts(model, PART_IDS if part_ids is None else part_ids)
    return model


def set_visible_parts(model, part_ids):
    """Filter by supplied IDs, independently of the mechanical root hierarchy."""
    allowed = set(part_ids)
    unknown = allowed-PART_IDS
    if unknown:
        raise ValueError(f"Unknown supply IDs: {sorted(unknown)}")
    for obj in model["objects"]:
        visible = obj["part_id"] in allowed
        obj.hide_render = not visible
        obj.hide_set(not visible)


def apply_pose(model, stroke):
    """Set transforms only for rigid members. Only the elastic band changes."""
    import bpy
    d = model["dimensions"]
    pose = solve_pose(stroke, d)
    model["slider"].location.x = pose.slider_x
    for i, sign in enumerate((1, -1)):
        jaw, link = model["jaws"][i], model["links"][i]
        jaw.location = pose.jaw_pivots[i]
        jaw.rotation_euler.z = sign*pose.jaw_angle
        link.location = pose.slider_pins[i]
        link.rotation_euler.z = pose.link_angles[i]
    model["output_plunger"].location.x = pose.output_piston_x
    model["control_plunger"].location.x = pose.control_piston_x
    band_points = []
    for x, start in ((pose.slider_x+d.band_slider_offset, -math.pi/2), (d.band_anchor_x, math.pi/2)):
        for i in range(17):
            a = start+i*math.pi/16
            band_points.append((x+d.band_loop_radius*math.cos(a), d.band_y+d.band_loop_radius*math.sin(a), d.band_z))
    band_points.append(band_points[0])
    curve = model["band"].data
    curve.splines.clear()
    spline = curve.splines.new("POLY")
    spline.points.add(len(band_points)-1)
    for point, xyz in zip(spline.points, band_points):
        point.co = (*xyz, 1)
    bpy.context.view_layer.update()
    model["pose"] = pose
    return pose


def check_blender_model(model, samples=51):
    """Check actual meshes/pin transforms agree with the pure-math solution."""
    from mathutils import Vector
    d = model["dimensions"]
    rigid = [o for o in model["objects"] if o.type == "MESH"]
    initial = {o.name: tuple(tuple(v.co) for v in o.data.vertices) for o in rigid}
    maximum_error = 0.
    for j in range(samples):
        pose = apply_pose(model, d.travel*j/(samples-1))
        for i, sign in enumerate((1, -1)):
            pad = next(o for o in model["objects"] if o.name == f"soft grip pad {sign}")
            actual = [tuple(pad.matrix_world @ v.co) for v in pad.data.vertices]
            for x, y in pose.pad_polygons[i]:
                for z in (d.jaw_z-.004, d.jaw_z+.004):
                    maximum_error = max(maximum_error, min(_distance((x, y, z), v) for v in actual))
            link = model["links"][i]
            for local, expected in (((0, 0, 0), pose.slider_pins[i]), ((d.link_length, 0, 0), pose.jaw_pins[i])):
                maximum_error = max(maximum_error, _distance(tuple(link.matrix_world @ Vector(local)), expected))
        for obj in rigid:
            assert tuple(tuple(v.co) for v in obj.data.vertices) == initial[obj.name], "Rigid mesh changed"
            assert all(abs(v-1) < 1e-8 for v in obj.scale), "Rigid mesh was scaled"
    assert maximum_error < 1e-7, maximum_error
    return {"actual_blender_pose_samples": samples, "maximum_mesh_or_joint_pose_error_m": maximum_error,
            "rigid_mesh_count": len(rigid), "rigid_meshes_unchanged": True}


def check_hardware(model, samples=101):
    """Sweep evaluated meshes, inspect receiving bores and lower retention.

    The sweep records every cross-group surface intersection for review. It
    additionally rejects volumetric clashes between the moving plunger clip
    and fixed guide, or between new lower retainers and fixed structure.
    Coplanar bearing/stop contact is distinct from a volume intersection.
    This is a sampled check, not continuous collision or strength proof.
    """
    import bpy
    import bmesh
    from mathutils import Matrix, Vector
    from mathutils.bvhtree import BVHTree

    d = model["dimensions"]
    objects = [o for o in model["objects"] if o.type in {"MESH", "CURVE"}]
    moving_roots = set(model["jaws"]+model["links"]+[
        model["slider"], model["output_plunger"], model["control_plunger"]])

    def group(obj):
        while obj.parent:
            obj = obj.parent
        return obj.name if obj in moving_roots else "fixed"

    groups = {o.name: group(o) for o in objects}

    def snapshot(obj):
        evaluated = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
        mesh = evaluated.to_mesh()
        vertices = [evaluated.matrix_world @ v.co for v in mesh.vertices]
        polygons = [tuple(face.vertices) for face in mesh.polygons]
        tree = BVHTree.FromPolygons(vertices, polygons, epsilon=0)
        bounds = [(min(v[i] for v in vertices), max(v[i] for v in vertices)) for i in range(3)]
        evaluated.to_mesh_clear()
        return {"tree": tree, "vertices": vertices, "bounds": bounds}

    def volume(obj):
        evaluated = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
        mesh = evaluated.to_mesh()
        bm = bmesh.new()
        bm.from_mesh(mesh)
        result = bm.calc_volume(signed=True)
        bm.free()
        evaluated.to_mesh_clear()
        return result

    def intersection_volume(a, b):
        clone = a.copy()
        clone.data = a.data.copy()
        bpy.context.collection.objects.link(clone)
        modifier = clone.modifiers.new("targeted evaluated hardware intersection", "BOOLEAN")
        modifier.operation = "INTERSECT"
        modifier.solver = "EXACT"
        modifier.object = b
        bpy.context.view_layer.update()
        result = abs(volume(clone))
        bpy.data.objects.remove(clone, do_unlink=True)
        return result

    fixed_guide = {o.name for o in objects if o["part_id"] == "air-slider" and groups[o.name] == "fixed"}
    fixed_structure = {o.name for o in objects if o["part_id"] in {"air-slider", "air-beam"} and groups[o.name] == "fixed"}
    clip_parts = {o.name for o in objects if o.name.startswith(("plunger end clip", "plunger clip"))}
    lower_moving_heads = {h.name for h, _, _, _ in model["retainers"] if groups[h.name] != "fixed"}
    guide_fasteners = {o.name for o in model["guide_fasteners"]}
    intersections, rejected, maximum_target_volume = {}, [], 0.
    for frame in range(samples):
        apply_pose(model, d.travel*frame/(samples-1))
        snapshots = {o.name: snapshot(o) for o in objects}
        for i, a in enumerate(objects):
            for b in objects[i+1:]:
                if groups[a.name] == groups[b.name]:
                    continue
                sa, sb = snapshots[a.name], snapshots[b.name]
                depths = [min(sa["bounds"][j][1], sb["bounds"][j][1])-max(sa["bounds"][j][0], sb["bounds"][j][0]) for j in range(3)]
                if min(depths) < -1e-7:
                    continue
                pairs = sa["tree"].overlap(sb["tree"])
                if not pairs:
                    continue
                key = " | ".join(sorted((a.name, b.name)))
                record = intersections.setdefault(key, {"first_sample": frame, "last_sample": frame, "samples": 0})
                record["last_sample"] = frame
                record["samples"] += 1
                names = {a.name, b.name}
                targeted = ((bool(names & clip_parts) and bool(names & fixed_guide)) or
                            (bool(names & lower_moving_heads) and bool(names & fixed_structure)) or
                            bool(names & guide_fasteners))
                if targeted and min(depths) > 1e-7:
                    amount = intersection_volume(a, b)
                    maximum_target_volume = max(maximum_target_volume, amount)
                    if amount > 1e-13:
                        rejected.append({"pair": key, "sample": frame, "intersection_mm3": amount*1e9})
        if frame % 25 == 0:
            print(f"Evaluated hardware sweep {frame}/{samples-1}", flush=True)
    assert not rejected, rejected

    apply_pose(model, 0)
    snapshots = {o.name: snapshot(o) for o in objects}
    hole_counts = {}
    for obj, x, y, radius, category in model["receiving_holes"]:
        basis = obj.parent.matrix_world if obj.parent else Matrix.Identity(4)
        origin = basis @ Vector((x, y, .120))
        hit = snapshots[obj.name]["tree"].ray_cast(origin, Vector((0, 0, -1)), .250)
        assert hit[0] is None, ("Receiving bore is blocked", obj.name, category, tuple(hit[0]))
        hole_counts[category] = hole_counts.get(category, 0)+1

    retention = []
    for head, receiver, hole_radius, outer_radius in model["retainers"]:
        center = head.matrix_world.translation
        direction = (head.parent.matrix_world.to_3x3() @ Vector((1, 0, 0))) if head.parent else Vector((1, 0, 0))
        origin = center+direction*((hole_radius+outer_radius)/2)+Vector((0, 0, -.100))
        hit = snapshots[receiver.name]["tree"].ray_cast(origin, Vector((0, 0, 1)), .250)
        assert hit[0] is not None, ("Retaining head has no receiving shoulder", head.name)
        top = snapshots[head.name]["bounds"][2][1]
        shoulder_error = abs(hit[0].z-top)
        assert shoulder_error < 1e-7, (head.name, shoulder_error)
        actual_radius = max(math.hypot(v.x-center.x, v.y-center.y) for v in snapshots[head.name]["vertices"])
        assert actual_radius > hole_radius+.0001
        retention.append({"head": head.name, "receiver": receiver.name,
                          "actual_outer_radius_mm": actual_radius*1000,
                          "shoulder_contact_error_m": shoulder_error})

    pad_volumes = {o.name: volume(o)*1e9 for o in objects if o["part_id"] == "air-grip-pads"}
    assert all(v > 0 for v in pad_volumes.values()), pad_volumes
    return {"evaluated_hardware_sweep_samples": samples,
            "targeted_hardware_clashes": rejected,
            "maximum_targeted_intersection_mm3": maximum_target_volume*1e9,
            "cross_group_surface_intersections_for_review": intersections,
            "receiving_holes_clear_by_individual_mesh_rays": hole_counts,
            "positive_lower_retention": retention,
            "pad_signed_volumes_mm3": pad_volumes,
            "hardware_scope": "Sampled evaluated surfaces; targeted solid intersections and receiving/retention rays. Contact pairs remain listed for fresh review; no continuous or manufacturing validation."}


def check_attachments(model):
    """Inspect actual adhesive faces, declared factory joins and nearby solids.

    These are dimensional attachment checks. They establish where the supplied
    backing and factory joints are, not adhesive/strap strength or durability.
    """
    import bpy
    from mathutils import Vector
    from mathutils.bvhtree import BVHTree

    def geometry(obj):
        evaluated = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
        mesh = evaluated.to_mesh()
        vertices = [evaluated.matrix_world @ v.co for v in mesh.vertices]
        tree = BVHTree.FromPolygons(vertices, [tuple(f.vertices) for f in mesh.polygons], epsilon=0)
        bounds = [(min(v[i] for v in vertices), max(v[i] for v in vertices)) for i in range(3)]
        evaluated.to_mesh_clear()
        return tree, vertices, bounds

    apply_pose(model, 0)
    shapes = {o.name: geometry(o) for o in model["objects"] if o.type in {"MESH", "CURVE"}}
    by_name = {o.name: o for o in model["objects"]}

    def height_at(obj, x, y, z, direction):
        hit = shapes[obj.name][0].ray_cast(Vector((x, y, z)), Vector((0, 0, direction)), .150)
        assert hit[0] is not None, ("Missing joint face", obj.name, x, y, z)
        return hit[0].z

    mount_results = []
    for pad, foot, receiver in model["adhesive_mounts"]:
        _, _, bounds = shapes[pad.name]
        errors = []
        for fx in (.1, .5, .9):
            for fy in (.1, .5, .9):
                x = bounds[0][0]+fx*(bounds[0][1]-bounds[0][0])
                y = bounds[1][0]+fy*(bounds[1][1]-bounds[1][0])
                receiver_top = height_at(receiver, x, y, bounds[2][0]+.020, -1)
                foot_bottom = height_at(foot, x, y, bounds[2][1]-.010, 1)
                errors.extend((abs(receiver_top-bounds[2][0]), abs(foot_bottom-bounds[2][1])))
        assert max(errors) < 1e-7, (pad.name, errors)
        assert pad["part_id"] == foot["part_id"] and pad["part_id"] != receiver["part_id"]
        mount_results.append({"supplied_part_id": pad["part_id"], "pad": pad.name,
                              "foot": foot.name, "receiver": receiver.name,
                              "footprint_mm2": (bounds[0][1]-bounds[0][0])*(bounds[1][1]-bounds[1][0])*1e6,
                              "backing_thickness_mm": (bounds[2][1]-bounds[2][0])*1000,
                              "maximum_face_gap_m": max(errors), "face_rays": len(errors)})

    face_results = []
    for member, receiver, center, width, length in model["factory_face_bonds"]:
        errors = []
        for fx in (-.4, 0, .4):
            for fy in (-.4, 0, .4):
                x, y = center[0]+fx*width, center[1]+fy*length
                lower_top = height_at(receiver, x, y, center[2]+.010, -1)
                upper_bottom = height_at(member, x, y, center[2]-.010, 1)
                errors.append(abs(lower_top-upper_bottom))
        assert max(errors) < 1e-7, (member.name, errors)
        face_results.append({"member": member.name, "factory_bonded_to": receiver.name,
                             "nominal_bond_area_mm2": width*length*1e6, "maximum_face_gap_m": max(errors)})

    embed_results = []
    for member, receiver, point, radius in model["factory_embeds"]:
        point = Vector(point)
        nearest = shapes[receiver.name][0].find_nearest(point)
        signed_distance = (point-nearest[0]).dot(nearest[1])
        assert signed_distance < -radius+1e-7, (member.name, receiver.name, signed_distance, radius)
        member_nearest = shapes[member.name][0].find_nearest(point)
        assert member_nearest[3] <= radius+1e-6, ("Joint point misses the supplied member", member.name, member_nearest[3])
        embed_results.append({"member": member.name, "factory_bonded_into": receiver.name,
                              "joint_point_m": list(point), "receiver_cover_mm": -signed_distance*1000,
                              "member_envelope_radius_mm": radius*1000})

    # Audit the altered fixed mounts against neighbouring independent parts.
    # Bonded pairs above are intentional contacts; these pairs must be clear.
    feet = [foot for _, foot, _ in model["adhesive_mounts"]]
    pairs = [(a, b) for i, a in enumerate(feet) for b in feet[i+1:]]
    fixed_foot = by_name["fixed return anchor support"]
    output_strap = by_name["soft output barrel strap"]
    for obj in model["objects"]:
        if obj.name.startswith("output barrel support"):
            pairs.append((fixed_foot, obj))
        if obj.name.startswith(("cradle captive fastener", "cradle lower retaining head")):
            pairs.append((output_strap, obj))
    pairs.append((fixed_foot, output_strap))
    clearances = []
    for a, b in pairs:
        ta, va, _ = shapes[a.name]
        tb, vb, _ = shapes[b.name]
        assert not ta.overlap(tb), ("New fixed-mount intersection", a.name, b.name)
        distance = min(min(tb.find_nearest(v)[3] for v in va), min(ta.find_nearest(v)[3] for v in vb))
        assert distance > .0001, (a.name, b.name, distance)
        clearances.append({"pair": [a.name, b.name], "nearest_sampled_surface_gap_mm": distance*1000})
    return {"adhesive_mounts": mount_results, "factory_face_bonds": face_results,
            "factory_embedded_joints": embed_results, "fixed_attachment_clearances": clearances,
            "component_description_updates": COMPONENT_DESCRIPTION_UPDATES,
            "attachment_scope": "Actual evaluated faces and embedded joint points, with targeted nearby-surface checks. Adhesive strength, peeling, creep, strap friction and manufactured durability are not validated."}


def render_attachment_proofs(output_dir, resolution=900):
    """Focused v3 fixed-mount views plus the existing full-range checks."""
    import bpy
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import scene_parts as p
    output = Path(output_dir)
    output.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    model = build_model()
    report = {**check_motion(model["dimensions"]), **check_blender_model(model),
              **check_hardware(model), **check_attachments(model)}
    (output/"attachment-check.json").write_text(json.dumps(report, indent=2)+"\n")
    scene = p.configure_render(resolution)
    scene.cycles.samples = 12
    scene.render.resolution_x = resolution
    scene.render.resolution_y = round(resolution*.70)
    underside_light_data = bpy.data.lights.new("attachment underside inspection light", "AREA")
    underside_light_data.energy = 0
    underside_light_data.shape = "DISK"
    underside_light_data.size = .35
    underside_light = bpy.data.objects.new("attachment underside inspection light", underside_light_data)
    bpy.context.collection.objects.link(underside_light)
    underside_light.location = (-.24, -.08, -.16)
    p.look_at(underside_light, (-.24, 0, .015))
    views = (
        ("assembly-overview", (.18, -.58, .66), (-.151, 0, .025), .570, PART_IDS),
        ("fixed-return-anchor", (-.10, .16, .16), (-.144, .014, .024), .110, PART_IDS),
        ("output-strap-attachment", (-.12, -.15, .14), (-.170, 0, .037), .120, PART_IDS),
        ("tube-mount-attachment", (-.24, .15, .14), (-.245, .012, .026), .110, PART_IDS),
        ("hand-holder-mounts", (-.29, -.17, .14), (-.315, -.022, .035), .175, PART_IDS),
        ("supplied-mounting-feet", (-.22, -.21, -.16), (-.245, 0, .022), .320, {"air-tube-clips", "air-return-band"}),
    )
    for label, location, target, scale, ids in views:
        set_visible_parts(model, ids)
        underside_light_data.energy = 4 if label == "supplied-mounting-feet" else 0
        if label == "supplied-mounting-feet":
            fixed_anchor_parts = {"fixed return anchor support", "fixed return anchor adhesive pad",
                                  "return anchor hook False", "return anchor hook cap False"}
            for obj in model["objects"]:
                if obj["part_id"] == "air-return-band" and obj.name not in fixed_anchor_parts:
                    obj.hide_render = True
        scene.camera = p.camera(label, location, target, scale)
        scene.render.filepath = str(output/f"{label}.png")
        bpy.ops.render.render(write_still=True)
    set_visible_parts(model, PART_IDS)
    return model


def make_attachment_sheet(directory):
    """Arrange the six existing focused stills; requires Pillow."""
    from PIL import Image, ImageDraw, ImageFont
    folder = Path(directory)
    font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 19)
    names = ("assembly-overview", "fixed-return-anchor", "output-strap-attachment",
             "tube-mount-attachment", "hand-holder-mounts", "supplied-mounting-feet")
    sheet = Image.new("RGB", (1500, 830), "#eef2ed")
    draw = ImageDraw.Draw(sheet)
    draw.text((15, 12), "Fixed attachments: fitted adhesive backing and declared factory joints; moving mechanism unchanged", font=font, fill="#173449")
    for i, name in enumerate(names):
        picture = Image.open(folder/f"{name}.png").convert("RGBA").resize((500, 350), Image.Resampling.LANCZOS)
        x, y = i%3*500, 45+i//3*390
        sheet.paste(picture, (x, y), picture)
        draw.text((x+12, y+352), name.replace("-", " "), font=font, fill="#173449")
    sheet.save(folder/"attachment-views.png")


def render_proofs(output_dir, resolution=1000, save_blend=False):
    import bpy
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import scene_parts as p
    output = Path(output_dir)
    output.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    model = build_model()
    d = model["dimensions"]
    mesh_report = check_blender_model(model)
    hardware_report = check_hardware(model)
    scene = p.configure_render(resolution)
    scene.cycles.samples = 12
    scene.render.resolution_x = resolution
    scene.render.resolution_y = round(resolution*.62)
    # One fixed family scale across all states and all views.
    target, scale = (-.151, 0, .025), .570
    cameras = {
        "three-quarter": p.camera("grabber three quarter", (.18, -.58, .66), target, scale),
        "top": p.camera("grabber top", (-.151, 0, .9), target, scale),
        "side": p.camera("grabber side", (-.151, -.9, .025), target, scale),
    }
    for label, fraction in (("open", 0), ("mid", .5), ("closed", 1)):
        pose = apply_pose(model, d.travel*fraction)
        for view, cam in cameras.items():
            scene.camera = cam
            scene.render.filepath = str(output/f"{label}-{view}.png")
            bpy.ops.render.render(write_still=True)
    grip, contact = gripping_pose(dims=d)
    apply_pose(model, grip.stroke)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=contact["sphere_radius_m"], location=contact["sphere_center"])
    fruit = _tag(p.finish(bpy.context.object, "proof lightweight sponge fruit", "orange"), "air-fruit-game")
    fruit["proof_prop"] = True
    for view, cam in cameras.items():
        scene.camera = cam
        scene.render.filepath = str(output/f"gripping-{view}.png")
        bpy.ops.render.render(write_still=True)
    fruit.hide_render = True
    fruit.hide_set(True)
    scene.camera = cameras["three-quarter"]
    for frame in range(9):
        apply_pose(model, d.travel*frame/8)
        scene.render.filepath = str(output/f"motion-{frame:02d}.png")
        bpy.ops.render.render(write_still=True)
    apply_pose(model, 0)
    detail = p.camera("grabber hardware detail", (.055, -.21, .19), (-.075, 0, .026), .235)
    underside = p.camera("grabber underside detail", (.055, -.21, -.17), (-.075, 0, .026), .235)
    for label, cam, ids in (
        ("hardware-detail", detail, PART_IDS),
        ("underside-retention", underside, PART_IDS),
        ("beam-receiving-holes", detail, {"air-beam"}),
        ("crosshead-receiving-holes", detail, {"air-beam", "air-jaws", "air-slider"}),
    ):
        set_visible_parts(model, ids)
        scene.camera = cam
        scene.render.filepath = str(output/f"{label}.png")
        bpy.ops.render.render(write_still=True)
    set_visible_parts(model, PART_IDS)
    apply_pose(model, d.travel)
    if save_blend:
        bpy.ops.wm.save_as_mainfile(filepath=str(output/"pneumatic-grabber-review.blend"))
    (output/"motion-check.json").write_text(json.dumps({**check_motion(d), **mesh_report, **hardware_report}, indent=2)+"\n")
    return model


def make_motion_sheets(directory):
    """Compose existing proof renders; run with ``uv run --with pillow``."""
    from PIL import Image, ImageDraw, ImageFont
    folder = Path(directory)
    font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
    cell, image_height, header = 500, 310, 46
    background = "#eef2ed"
    ink = "#173449"
    sheet = Image.new("RGB", (3*cell, header+4*(image_height+34)), background)
    draw = ImageDraw.Draw(sheet)
    draw.text((16, 12), "Grabber: same geometry and fixed 570 mm camera scale in every state", font=font, fill=ink)
    for row, state in enumerate(("open", "mid", "closed", "gripping")):
        for column, view in enumerate(("three-quarter", "top", "side")):
            picture = Image.open(folder/f"{state}-{view}.png").convert("RGBA").resize((cell, image_height), Image.Resampling.LANCZOS)
            x, y = column*cell, header+row*(image_height+34)
            sheet.paste(picture, (x, y), picture)
            draw.text((x+12, y+image_height+4), f"{state} / {view}", font=font, fill=ink)
    sheet.save(folder/"diagnostic-views.png")
    motion = Image.new("RGB", (3*cell, header+3*(image_height+34)), background)
    draw = ImageDraw.Draw(motion)
    draw.text((16, 12), "Output stroke: 0–15.75 mm; nine equal increments; rigid links stay 52 mm", font=font, fill=ink)
    for i in range(9):
        original = Image.open(folder/f"motion-{i:02d}.png").convert("RGBA")
        picture = original.resize((cell, image_height), Image.Resampling.LANCZOS)
        x, y = (i%3)*cell, header+(i//3)*(image_height+34)
        motion.paste(picture, (x, y), picture)
        draw.text((x+12, y+image_height+4), f"{Dimensions().travel*i/8*1000:.2f} mm output stroke", font=font, fill=ink)
    motion.save(folder/"motion-contact.png")


def main():
    argv = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else sys.argv[1:]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--render-dir")
    parser.add_argument("--attachments-dir", help="Focused attachment views and existing full-range checks")
    parser.add_argument("--attachment-sheet-dir", help="Compose the six existing attachment stills")
    parser.add_argument("--sheet-dir", help="Compose existing renders using Pillow")
    parser.add_argument("--resolution", type=int, default=1000)
    parser.add_argument("--save-blend", action="store_true", help="Scratch review copy only; no automatic production selection")
    args = parser.parse_args(argv)
    if args.check or not (args.render_dir or args.sheet_dir or args.attachments_dir or args.attachment_sheet_dir):
        print(json.dumps(check_motion(), indent=2))
    if args.render_dir:
        render_proofs(args.render_dir, args.resolution, args.save_blend)
    if args.sheet_dir:
        make_motion_sheets(args.sheet_dir)
    if args.attachments_dir:
        render_attachment_proofs(args.attachments_dir, args.resolution)
    if args.attachment_sheet_dir:
        make_attachment_sheet(args.attachment_sheet_dir)


if __name__ == "__main__":
    main()
