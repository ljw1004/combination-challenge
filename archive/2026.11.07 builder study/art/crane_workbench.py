"""Presentation-only crane bench and retained, adjustable hold-down clips.

The canonical toy owns every supplied part. This separate stage owns workshop
fixtures, is never entered into the material-ancestry map, and disappears for
loose parts and released toys. All dimensions are metres.
"""
import math

ASSEMBLY_STATES = {
    "lc-base", "lc-mast", "lc-braced", "lc-boom-frame", "lc-stayed",
    "lc-pulley-frame", "lc-wide-frame", "lc-winch-frame", "lc-rigged",
    "lc-tipping", "lc-pawl-rigged", "lc-pawl-tipping",
    "lc-ballasted-unproven", "lc-pawl-ballasted-unproven", "lc-balanced",
    "lc-ratchet-frame",
}
LOW_TESTS = {"lc-tipping", "lc-pawl-tipping", "lc-balanced", "lc-ratchet-frame"}
UNFOOTED = {"lc-base", "lc-mast", "lc-braced", "lc-boom-frame", "lc-stayed", "lc-pulley-frame"}


def build(model):
    import bpy
    import scene_parts as S
    from construction import special_material, surface

    root = S.empty("crane workshop stage, separate from supplied toy parts")
    objects = []

    def add(obj, parent=root):
        obj.parent = parent
        obj["presentation_fixture"] = True
        objects.append(obj)
        return obj

    def bore(obj, center, radius, length):
        cutter = S.cylinder("bench fixture receiving bore", center, radius, length, axis="Z")
        cutter.parent = obj.parent
        bpy.context.view_layer.objects.active = obj
        modifier = obj.modifiers.new("actual fixture receiving hole", "BOOLEAN")
        modifier.operation = "DIFFERENCE"
        modifier.object = cutter
        bpy.ops.object.modifier_apply(modifier=modifier.name)
        bpy.data.objects.remove(cutter, do_unlink=True)

    # A literal, flat bench fragment supplies a receiving plane for the base
    # and both feet. It ends before the hanging load, keeping the gap legible.
    bench = add(S.box("crane bench top", (-.080, 0, -.020), (.680, .460, .040), "card"))
    surface(bench, special_material("crane_bench", (.69, .66, .59)))
    # The unfooted base sits flat at z=0. Shallow relief bores clear the
    # supplied mast and brace screw tips, protruding 1 mm and 2 mm respectively.
    for y in [-.055, .055]:
        bore(bench, (-.120, y, -.001), .003, .004)
        for x in [-.244, -.206]:
            bore(bench, (x, y, -.0015), .003, .005)

    clips = []
    for side in [-1, 1]:
        x, y = -.345, side*.095
        foot = add(S.box("bench clip fixed mounting foot", (x, y, .004), (.040, .038, .008), "ink"))
        bore(foot, (x, y, .004), .0032, .020)
        bore(bench, (x, y, -.006), .0032, .024)
        add(S.cylinder("bench clip retained threaded post", (x, y, .043), .003, .114, "ink", "Z"))
        # The post screws into the bench's prepared hole. A bottom collar
        # seats on the mounting foot; the upper cap keeps the moving arm on it.
        add(S.cylinder("bench clip post foot collar", (x, y, .0095), .006, .003, "teal", "Z"))
        add(S.cylinder("bench clip post retaining cap", (x, y, .1015), .006, .003, "orange", "Z"))
        arm = S.empty("bench clip adjustable swing arm")
        arm.parent = root
        arm.location = (x, y, .044)
        # 92 mm reach puts the pad on the exposed rear corners of the base,
        # between the central ballast/brace mounts and the outer foot rails.
        bar = add(S.box("bench clip rigid arm", (.046, 0, 0), (.112, .022, .008), "teal"), arm)
        bore(bar, (0, 0, 0), .0033, .020)
        bore(bar, (.092, 0, 0), .0022, .020)
        for z in [-.006, .006]:
            ring = add(S.annulus("bench clip bored adjustment collar", (0, 0, 0), .007, .0032, .004, "ink"), arm)
            ring.rotation_euler.x = math.pi/2
            ring.location.z = z
        add(S.box("bench clip turning handle", (0, 0, .010), (.028, .008, .004), "orange"), arm)
        # A real screw through the arm seats on a broad captive pressure pad.
        add(S.cylinder("bench clip pressure screw", (.092, 0, -.003), .002, .022, "ink", "Z"), arm)
        add(S.cylinder("bench clip pressure screw head", (.092, 0, .009), .004, .002, "orange", "Z"), arm)
        pad = add(S.box("bench clip pressure pad", (.092, 0, -.012), (.026, .026, .004), "ink"), arm)
        clips.append({"arm": arm, "pad": pad, "side": side})

    model["workbench"] = {"root": root, "objects": objects, "bench": bench, "clips": clips}
    # The bench extends beyond the old toy-only left boundary. Keep one camera
    # direction and projection for every crane identity, including loose parts.
    model["view"] = {"location": (1.385, -2.0, 1.25),
                     "target": (.015, 0, .320), "scale": 1.08}
    return model["workbench"]


def stage(model, identity):
    """Reset every fixture/pose state, including after a test or loose view."""
    import bpy
    import lifting_crane as C

    if "workbench" not in model:
        build(model)
    bench = model["workbench"]
    visible = identity in ASSEMBLY_STATES
    testing = identity in LOW_TESTS
    unfooted = identity in UNFOOTED
    C.set_state(model, identity, include_test=testing)
    model["root"].location = (0, 0, -.010 if unfooted else 0)
    model["root"].rotation_euler = (0, 0, 0)
    if testing:
        # The existing solver keeps the braced frame rigid, conserves cord
        # length, and keeps the suspended weight vertical as the frame tips.
        C.apply_pose(model, .015, tip_degrees=3 if "tipping" in identity else 0)
    for obj in bench["objects"]:
        obj.hide_render = not visible
        obj.hide_set(not visible)
    for clip in bench["clips"]:
        arm = clip["arm"]
        arm.location.z = .044 - (.010 if unfooted else 0) + (.030 if testing else 0)
        arm.rotation_euler = (0, 0, clip["side"]*math.radians(115) if testing else 0)
    model["workbench_state"] = {"visible": visible, "released": testing,
                                "unfooted": unfooted, "identity": identity}
    bpy.context.view_layer.update()
    return model["view"]
