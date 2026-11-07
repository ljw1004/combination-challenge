"""Printed cheek marks on the supplied whale skin, projected onto its real mesh.

These are surface artwork only. No mechanical dimension or motion is changed.
Both sides carry the same face so a garden view can show either side of the toy.
"""
import math


def apply(model):
    import bpy
    from mathutils import Vector
    from mathutils.bvhtree import BVHTree
    import scene_parts as S
    bpy.context.view_layer.update()
    inverse=model['root'].matrix_world.inverted()
    vertices=[];faces=[]
    for obj in model['parts']['whale-skin']:
        if not obj.name.startswith('rib-conforming lower skin panel'):continue
        offset=len(vertices);matrix=inverse @ obj.matrix_world
        vertices.extend(matrix @ v.co for v in obj.data.vertices)
        faces.extend(tuple(offset+i for i in f.vertices) for f in obj.data.polygons)
    skin=BVHTree.FromPolygons(vertices,faces)
    for obj in list(model['parts']['whale-skin']):
        if obj.name.startswith(('printed whale eye','printed whale smile')):
            model['parts']['whale-skin'].remove(obj);bpy.data.objects.remove(obj,do_unlink=True)
    def point(x,z,side):
        p,normal,_,_=skin.ray_cast(Vector((x,side*.4,z)),Vector((0,-side,0)),.6)
        if p is None:raise ValueError('Printed whale mark misses supplied skin')
        return p+Vector((0,side*.0005,0))
    def tag(obj):
        obj.parent=model['root'];obj['part_id']='whale-skin';obj['surface_print']=True
        model['parts']['whale-skin'].append(obj)
    def disc(name,x,z,rx,rz,side,color):
        v=[point(x,z,side)]+[point(x+rx*math.cos(t),z+rz*math.sin(t),side) for t in [math.tau*j/48 for j in range(48)]]
        if color=='paper':v=[p+Vector((0,side*.0002,0)) for p in v]
        mesh=bpy.data.meshes.new(name);mesh.from_pydata(v,[],[(0,j+1,(j+1)%48+1) for j in range(48)]);mesh.update()
        obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj);obj.data.materials.append(S.material(color));tag(obj)
    for side in (-1,1):
        disc('printed whale eye',-.385,.155,.011,.009,side,'ink')
        disc('printed eye glint',-.389,.159,.002,.002,side,'paper')
        points=[point(-.425+.060*u,.122-.010*math.sin(math.pi*u)+.004*u,side) for u in [j/24 for j in range(25)]]
        tag(S.stroke('printed whale smile',points,.0013,'ink'))
