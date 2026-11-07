"""Small Blender-only construction helpers; lengths are metres, world is z-up.

No scene reset or rendering happens on import. Other story families may import
these primitives without acquiring the dragon model or a particular camera.
"""
import math
import re

import bpy
from mathutils import Vector


PALETTE = {
    "birch": (0.73, 0.51, 0.28, 1),
    "card": (0.86, 0.69, 0.43, 1),
    "teal": (0.035, 0.42, 0.43, 1),
    "orange": (0.95, 0.27, 0.065, 1),
    "ink": (0.025, 0.075, 0.14, 1),
    "paper": (0.98, 0.91, 0.70, 1),
}


def material(name):
    existing = bpy.data.materials.get("workshop_" + name)
    if existing:
        return existing
    mat = bpy.data.materials.new("workshop_" + name)
    mat.diffuse_color = PALETTE[name]
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = PALETTE[name]
    shader.inputs["Roughness"].default_value = 0.8
    return mat


def finish(obj, name, color, bevel=0):
    obj.name = name
    obj["part_id"] = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    obj.data.materials.append(material(color))
    if bevel:
        mod = obj.modifiers.new("small real edge radius", "BEVEL")
        mod.width = bevel
        mod.segments = 2
    return obj


def box(name, center, size, color="birch", bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=center)
    obj = bpy.context.object
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, color, bevel)


def cylinder(name, center, radius, depth, color="ink", axis="Y", vertices=64):
    rotation = {"X": (0, math.pi/2, 0), "Y": (math.pi/2, 0, 0), "Z": (0, 0, 0)}[axis]
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth,
                                      location=center, rotation=rotation)
    return finish(bpy.context.object, name, color)


def bore(obj, center, radius, length, axis="Y"):
    cutter = cylinder("temporary bore", center, radius, length, axis=axis)
    bpy.context.view_layer.objects.active = obj
    modifier = obj.modifiers.new("actual through hole", "BOOLEAN")
    modifier.operation = "DIFFERENCE"
    modifier.object = cutter
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    bpy.data.objects.remove(cutter, do_unlink=True)


def profile(name, points, thickness, y=0, color="card", edge="ink"):
    """Extrude an x,z polygon along y, preserving all supplied dimensions."""
    n = len(points)
    verts = [(x, y-thickness/2, z) for x, z in points]
    verts += [(x, y+thickness/2, z) for x, z in points]
    faces = [tuple(reversed(range(n))), tuple(range(n, 2*n))]
    faces += [(i, (i+1) % n, (i+1) % n+n, i+n) for i in range(n)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj["part_id"] = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    obj.data.materials.append(material(color))
    obj.data.materials.append(material(edge))
    for face in obj.data.polygons:
        if face.index >= 2:
            face.material_index = 1
    return obj


def annulus(name, center, outer, inner, depth, color="orange", samples=128, gap=0):
    """A true y-axis annulus; optional missing angular sector forms a split."""
    cx, cy, cz = center
    angles = [gap/2+(2*math.pi-gap)*i/samples for i in range(samples+1)]
    verts = [(cx+r*math.cos(a), cy+y, cz+r*math.sin(a))
             for y in [-depth/2, depth/2] for r in [outer, inner] for a in angles]
    n = samples+1
    faces = []
    for i in range(samples):
        j = i+1
        faces += [(i, j, n+j, n+i), (2*n+i, 3*n+i, 3*n+j, 2*n+j),
                  (i, 2*n+i, 2*n+j, j), (n+i, n+j, 3*n+j, 3*n+i)]
    faces += [(0, n, 3*n, 2*n), (samples, 2*n+samples, 3*n+samples, n+samples)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return finish(obj, name, color)


def parent_local(obj, parent):
    """Construction coordinates become local coordinates, without compensation."""
    obj.parent = parent
    return obj


def empty(name, location=(0, 0, 0)):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj["part_id"] = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return obj


def stroke(name, points, radius=0.00055, color="ink"):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 1
    curve.bevel_depth = radius
    curve.bevel_resolution = 1
    spline = curve.splines.new("POLY")
    spline.points.add(len(points)-1)
    for p, co in zip(spline.points, points):
        p.co = (*co, 1)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material(color))
    obj["part_id"] = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return obj


def rod(name, start, end, radius=.002, color="ink"):
    """Create one fixed-length cylinder between supplied endpoints."""
    a, b = Vector(start), Vector(end)
    obj = cylinder(name, (a+b)/2, radius, (b-a).length, color, "Z")
    obj.rotation_euler = (b-a).to_track_quat("Z", "Y").to_euler()
    return obj


def look_at(obj, target):
    obj.rotation_euler = (Vector(target)-obj.location).to_track_quat("-Z", "Y").to_euler()
    return obj


def camera(name, location, target, scale=0.39):
    data = bpy.data.cameras.new(name)
    data.type = "ORTHO"
    data.ortho_scale = scale
    data.clip_start = 0.001
    data.clip_end = 10
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    look_at(obj, target)
    return obj


def configure_render(resolution=800):
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 1
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 24
    scene.cycles.use_denoising = True
    scene.render.resolution_x = scene.render.resolution_y = resolution
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.exposure = -0.8
    scene.world.color = (0.4, 0.4, 0.4)
    for name, location, power, size in [
        ("large soft key", (-0.5, -0.6, 0.8), 28, 0.7),
        ("soft fill", (0.4, 0.2, 0.5), 16, 0.5),
    ]:
        data = bpy.data.lights.new(name, "AREA")
        data.energy = power
        data.shape = "DISK"
        data.size = size
        obj = bpy.data.objects.new(name, data)
        bpy.context.collection.objects.link(obj)
        obj.location = location
        obj.rotation_euler = (Vector((0, 0, 0.15))-obj.location).to_track_quat("-Z", "Y").to_euler()
    return scene
