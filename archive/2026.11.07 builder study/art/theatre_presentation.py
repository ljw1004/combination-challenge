"""Registered theatre construction views and reusable material presentation.

Canonical optical geometry, holes, wiring and pose functions remain untouched.
The supplied push punch gets a real card-entry throat and printed shape mark.
Call stage after shadow_theatre.set_state. Embedded theatres need only
apply_materials: it changes no placement, visibility, light or mechanism state.
"""
import math
from contextlib import contextmanager

OPEN_STATES = {"theatre-box", "theatre-lined", "theatre-lit-box",
               "theatre-powered-box", "theatre-wheel-box"}
VIEW = {"location": (-.2784, -.2579, .9407),
        "target": (-.0784, .0021, .0407), "scale": .420}


@contextmanager
def inspection_render(scene, identity):
    """Denoise refractive coverage for only the two loose lens inspections.

    Use around bpy.ops.render.render. Restore the prior sampling, film, passes
    and compositor output even if rendering fails; assemblies use their normal
    settings. Alpha is denoised from the rendered geometry's normal/albedo
    passes, with no painted masks, reflections or replacement opacity.
    """
    if identity not in {"theatre-lens", "theatre-focus"}:
        yield
        return
    layer = scene.view_layers[0]
    saved = (scene.cycles.samples, scene.cycles.film_transparent_glass,
             scene.cycles.film_transparent_roughness, scene.use_nodes,
             layer.cycles.denoising_store_passes, layer.use_pass_normal)
    scene.use_nodes = True
    nodes, links = scene.node_tree.nodes, scene.node_tree.links
    outputs = [node for node in nodes if node.type == "COMPOSITE"]
    previous_outputs = [(node, node.use_alpha,
                         [(link.from_socket, link.to_socket) for socket in node.inputs for link in socket.links])
                        for node in outputs]
    added = []
    try:
        scene.cycles.samples = 64
        scene.cycles.film_transparent_glass = True
        scene.cycles.film_transparent_roughness = .1
        layer.cycles.denoising_store_passes = True
        layer.use_pass_normal = True
        render = nodes.new("CompositorNodeRLayers");added.append(render)
        render.layer = layer.name
        denoise = nodes.new("CompositorNodeDenoise");added.append(denoise)
        denoise.prefilter = "ACCURATE"
        alpha = nodes.new("CompositorNodeSetAlpha");added.append(alpha)
        alpha.mode = "REPLACE_ALPHA"
        if not outputs:
            output = nodes.new("CompositorNodeComposite");added.append(output)
            outputs.append(output)
        links.new(render.outputs["Alpha"], denoise.inputs["Image"])
        links.new(render.outputs["Normal"], denoise.inputs["Normal"])
        links.new(render.outputs["Denoising Albedo"], denoise.inputs["Albedo"])
        links.new(render.outputs["Image"], alpha.inputs["Image"])
        links.new(denoise.outputs["Image"], alpha.inputs["Alpha"])
        for output in outputs:
            for socket in output.inputs:
                for link in list(socket.links):
                    links.remove(link)
            output.use_alpha = True
            links.new(alpha.outputs["Image"], output.inputs["Image"])
        yield
    finally:
        for node in added:
            nodes.remove(node)
        for node, use_alpha, saved_links in previous_outputs:
            node.use_alpha = use_alpha
            for source, destination in saved_links:
                links.new(source, destination)
        (scene.cycles.samples, scene.cycles.film_transparent_glass,
         scene.cycles.film_transparent_roughness, scene.use_nodes,
         layer.cycles.denoising_store_passes, layer.use_pass_normal) = saved


def apply_materials(model):
    """One material treatment for loose, assembled and whale-mounted parts."""
    if model.get("theatre_presentation_materials"):
        return
    import bpy
    from construction import special_material, surface

    card = special_material("theatre_black_card", (.007, .011, .016), roughness=.92)
    for key in ["theatre-card", "theatre-stars"]:
        for obj in model["parts"][key]:
            surface(obj, card)
    foil = special_material("theatre_silver_foil", (.78, .82, .86), metallic=.82, roughness=.26)
    for obj in model["parts"]["theatre-foil"]:
        surface(obj, foil)
    cloth = special_material("theatre_white_cloth", (.94, .95, .96), roughness=.95)
    cloth.node_tree.nodes["Principled BSDF"].inputs["Sheen Weight"].default_value = .25
    for obj in model["parts"]["theatre-cloth"]:
        surface(obj, cloth)

    # A single clear dielectric retains actual refraction and reflections.
    # The two loose inspection exports also need transparent-glass film and
    # alpha denoising; color denoising alone leaves grain in glass coverage.
    glass = bpy.data.materials.get("theatre readable optical polymer")
    if glass is None:
        glass = bpy.data.materials.new("theatre readable optical polymer")
        glass.use_nodes = True
        nodes = glass.node_tree.nodes
        nodes.clear()
        output = nodes.new("ShaderNodeOutputMaterial")
        shader = nodes.new("ShaderNodeBsdfGlass")
        shader.inputs["Color"].default_value = (1., 1., 1., 1.)
        shader.inputs["Roughness"].default_value = .0
        shader.inputs["IOR"].default_value = 1.49
        glass.node_tree.links.new(shader.outputs[0], output.inputs["Surface"])
    edge = special_material("theatre_polished_lens_edge", (.19, .52, .70), roughness=.12, transmission=.35)
    lens = model["lens"]
    surface(lens, glass)
    lens.data.materials.append(edge)
    # These are the existing 64 cylindrical edge faces, not an added outline.
    for face in lens.data.polygons:
        face.material_index = int(face.index >= len(lens.data.polygons)-64)
        face.use_smooth = True
    # Shade each spherical cap smoothly without blending its normal into the
    # cylindrical edge. These are analytic normals for the existing surface;
    # vertices, faces, thickness and optical curvature remain canonical.
    from mathutils import Vector
    from shadow_theatre import optical_parameters
    radius = 2*(1.49-1)*optical_parameters(model["dimensions"])["focal_length_m"]
    cap_faces = (len(lens.data.polygons)-64)//2
    normals = []
    for face in lens.data.polygons:
        sign = -1 if face.index < cap_faces else 1
        for loop in face.loop_indices:
            point = lens.data.vertices[lens.data.loops[loop].vertex_index].co
            y = 0 if face.index >= 2*cap_faces else sign*math.sqrt(radius*radius-point.x*point.x-point.z*point.z)
            normals.append(Vector((point.x, y, point.z)).normalized())
    lens.data.normals_split_custom_set(normals)
    model["theatre_presentation_materials"] = True


def _prepare(model):
    import bpy
    import scene_parts as S

    if "theatre_presentation" in model:
        return model["theatre_presentation"]
    lid = next(o for o in model["parts"]["theatre-box"] if o.name.startswith("removable box lid"))
    upper = next(o for o in model["parts"]["theatre-foil"] if o.name.startswith("upper reflective lining"))
    saved = [(obj, obj.matrix_basis.copy()) for obj in [lid, upper]]
    data = bpy.data.lights.new("theatre loose-screen studio fill", "AREA")
    data.energy = 90
    data.shape = "DISK"
    data.size = 1.2
    light = bpy.data.objects.new(data.name, data)
    bpy.context.collection.objects.link(light)
    light.location = (-.30, -2.20, 1.00)
    S.look_at(light, (0, model["dimensions"].screen_y, .240))
    light.hide_render = True
    model["theatre_presentation"] = {"lid_parts": saved, "screen_light": light}
    return model["theatre_presentation"]


def _prepare_punch(model):
    """Expose the supplied push punch's actual card throat and shape mark."""
    if model.get("punch_presentation"):
        return
    import bpy
    import scene_parts as S
    body = next(o for o in model["parts"]["theatre-punch"]
                if o.name.startswith("standalone prepared star hole punch"))
    # A 2 mm throat receives the 1.2 mm card. The rear 9 mm of the case
    # remains a connected bridge; no extra object is inserted in an assembly.
    cutter = S.box("temporary punch card throat", (.110, -.008, .012),
                   (.032, .033, .002), "ink", 0)
    bpy.context.view_layer.objects.active = body
    mod = body.modifiers.new("real card entry", "BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.object = cutter
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(cutter, do_unlink=True)
    # Printed shape identification on the existing push button, not a fake
    # opening or a decorative replacement for the real disc perforations.
    points = []
    for j in range(10):
        t = math.pi/2+j*math.pi/5
        r = .008 if j%2 == 0 else .0036
        points.append((.110+r*math.cos(t), -.005+r*math.sin(t), .04055))
    mesh = bpy.data.meshes.new("star punch shape marking")
    mesh.from_pydata(points, [], [tuple(range(10))]);mesh.update()
    mark = bpy.data.objects.new("printed star on punch button", mesh)
    bpy.context.collection.objects.link(mark)
    mark.data.materials.append(S.material("ink"))
    mark.parent = model["root"];mark["part_id"] = "theatre-punch"
    model["parts"]["theatre-punch"].append(mark)
    model["geometry"].append(mark)
    model["punch_presentation"] = True


def stage(model, identity):
    """Reset lid and presentation light without changing canonical state."""
    import bpy
    from mathutils import Matrix

    apply_materials(model)
    if identity == "theatre-punch":
        _prepare_punch(model)
    state = _prepare(model)
    # The existing lid is 176 x 126 x 2 mm. It rests at z=0 beside the box;
    # turning its inside face upward also turns the bonded upper foil strip.
    transform = (Matrix.Translation((-.185, 0, .001))
                 @ Matrix.Rotation(math.pi, 4, "X")
                 @ Matrix.Translation((0, 0, -.129)))
    for obj, original in state["lid_parts"]:
        obj.matrix_basis = transform @ original if identity in OPEN_STATES else original.copy()
    state["screen_light"].hide_render = identity != "theatre-cloth"
    state["screen_light"].hide_viewport = identity != "theatre-cloth"
    bpy.context.view_layer.update()

    if identity == "theatre-cloth":
        return {"location": (.25, -3., .70), "target": (0, -1.4, .240), "scale": 1.05}
    if identity == "theatre-punch":
        return {"location": (.22, -.23, .15), "target": (.110, -.003, .020), "scale": .085}
    if identity in {"theatre-card", "theatre-stars", "theatre-shadow-wheel"}:
        # A 1.3125x inspection projection, shared by blank, punched disc and
        # spindle assembly, makes real holes read against transparent ground.
        # The fitted disc remains at canonical scale in the fixed family view.
        return {"location": (.04, -.60, .115), "target": (0, .025, .058), "scale": .320}
    if identity == "theatre-lens":
        # Resolve the transparent face before the ordinary loose-fitting
        # export floor; enlarging a 38px master would magnify sampling noise.
        # The lower view catches the existing studio lights in the real caps.
        return {"location": (.08, -.60, -.25), "target": (0, -.074, .116), "scale": .100}
    if identity in {"theatre-slider", "theatre-focus"}:
        # Matching 3.5x inspections expose the genuine glass reflections
        # after fitting, while the empty holder's aperture stays transparent.
        return {"location": (.08, -.60, -.25), "target": (0, -.074, .116), "scale": .120}
    return dict(VIEW)
