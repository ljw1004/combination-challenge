"""Real low-travel test poses of the unchanged compact lift and loose guides.

The stand stays fixed. Only the complete rigid module and its flexible tether
move; this is a selected illustration pose, not a force simulation.
"""
import math

TEST_HEIGHT=.060
TEST_TILT_DEGREES=6.
FLOATING_STATES={'lift-tray-test','lift-tilting-test','lift-balanced-test','lift-variable-test'}


def stage(model,identity):
    import bpy
    from mathutils import Vector
    import lift_module as L
    root=model['module_root']
    root.rotation_euler=(0,0,0)
    if identity in FLOATING_STATES:
        L.apply_pose(model,lift=TEST_HEIGHT,counterweight_x=model['slider'].location.x)
        if identity=='lift-tilting-test':root.rotation_euler.y=math.radians(TEST_TILT_DEGREES)
    bpy.context.view_layer.update()
    # Keep the original tether length and the same physical eye centres.
    stand=model['stand_root']
    start=stand.matrix_world.inverted() @ root.matrix_world @ Vector((0,-.145,-.003))
    end=Vector((0,-.150,.026))
    length=math.dist((0,-.145,.129),end)
    if (start-end).length>length+1e-9:raise ValueError('Test pose exceeds the original short tether')
    lo,hi=0.,length
    for _ in range(60):
        mid=(lo+hi)/2;point=Vector((mid,-.150,.026))
        if (start-point).length+(point-end).length>length:hi=mid
        else:lo=mid
    points=[start,Vector((lo,-.150,.026)),end]
    for cord in model['tethers']:
        cord.data.splines.clear();spline=cord.data.splines.new('POLY');spline.points.add(2)
        for vertex,point in zip(spline.points,points):vertex.co=(*point,1)
    model['presentation_pose']={'height_m':root.location.z-.032,'tilt_degrees':math.degrees(root.rotation_euler.y),'tether_length_m':sum((b-a).length for a,b in zip(points,points[1:]))}
    return model['view']
