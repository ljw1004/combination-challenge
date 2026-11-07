"""Shared ownership and presentation helpers for canonical workshop assemblies.

Geometry uses metres. A part's supply identity belongs to every one of its
objects, including concealed fasteners. These helpers do not reset the scene.
"""
import math
import bpy
from mathutils import Vector
import scene_parts as S


class Assembly:
    def __init__(self, name):
        self.root = S.empty(name)
        self.parts = {}

    def add(self, part, obj, parent=None):
        obj["part_id"] = part
        obj["assembly"] = self.root.name
        obj.parent = parent or self.root
        self.parts.setdefault(part, []).append(obj)
        return obj

    def box(self, part, name, center, size, color="birch", parent=None):
        return self.add(part, S.box(name, center, size, color), parent)

    def cylinder(self, part, name, center, radius, depth, color="ink", axis="Z", parent=None):
        return self.add(part, S.cylinder(name, center, radius, depth, color, axis), parent)

    def line(self, part, name, points, radius=.0006, color="ink", parent=None):
        return self.add(part, S.stroke(name, points, radius, color), parent)

    def result(self, **extra):
        return {"root": self.root, "parts": self.parts, **extra}


def set_visible_parts(model, ids):
    allowed = set(ids)
    for part, objects in model["parts"].items():
        for obj in objects:
            obj.hide_render = part not in allowed
            obj.hide_set(part not in allowed)


def special_material(name, color, metallic=0., roughness=.6, transmission=0.):
    key = "builder_"+name
    mat = bpy.data.materials.get(key)
    if mat:
        return mat
    mat = bpy.data.materials.new(key)
    mat.use_nodes = True
    mat.diffuse_color = (*color, 1)
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Transmission Weight"].default_value = transmission
    return mat


def surface(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    return obj


def orient_normal(obj, direction, axis="Z"):
    obj.rotation_euler = Vector(direction).to_track_quat(axis, "Y" if axis != "Y" else "Z").to_euler()
    return obj


def bolt(a, part, name, center, radius=.0015, depth=.008, axis="Z", parent=None):
    a.cylinder(part, name+" shank", center, radius, depth, "ink", axis, parent)
    direction = {"X": (1,0,0), "Y": (0,1,0), "Z": (0,0,1)}[axis]
    head = tuple(center[i]+direction[i]*depth/2 for i in range(3))
    a.cylinder(part, name+" head", head, radius*1.7, radius*.8, "ink", axis, parent)


def ring_z(a, part, name, center, outer, inner, thickness, color="teal"):
    obj = S.annulus(name, (0,0,0), outer, inner, thickness, color)
    obj.rotation_euler.x = math.pi/2
    obj.location = center
    return a.add(part, obj)


def bounds_world(objects):
    points = [obj.matrix_world @ Vector(corner) for obj in objects if obj.type in {"MESH","CURVE"}
              and not obj.hide_render for corner in obj.bound_box]
    if not points:
        raise ValueError("A rendered identity has no visible geometry")
    return [[min(p[i] for p in points), max(p[i] for p in points)] for i in range(3)]
