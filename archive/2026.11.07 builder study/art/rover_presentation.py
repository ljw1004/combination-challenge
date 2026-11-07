"""Readable, physically routed rover test stills around the frozen hardware.

Call stage after drawing_rover.set_state. The two test runs last longer at the
same original wheel-speed ratios; all repositioning is genuine pen-up travel.
The final whale/invitation trajectory is untouched. No animation is exported.
"""
import math
import drawing_rover as R

TEST_STATES = {'rover-looping', 'rover-trimmed'}
DRAWING_STATES = TEST_STATES | {'drawing-rover'}
PAPER_STATES = DRAWING_STATES | {'rover-paper'}
VIEW = {'location': (-.020, -.48, .93), 'target': (-.020, 0, .025), 'scale': .87}
REWARD_VIEW = {'location': (-.025, -.65, 1.30), 'target': (-.025, 0, .055), 'scale': .96}
PAPER_LENGTH = .700
PAPER_RIGHT_EDGE = .275
TEST_START = (-.270, -.070)
STRAIGHT_START = (-.270, -.095)
PARK_AXLE = (-.240, .078)
UNTRIMMED_TURNS = (10.2, 11.4)
STRAIGHT_DISTANCE = .380


def motion_commands(identity):
    """Actual wheel radians, with False marking every lifted-pen movement.

    Back into each start so the caster stays on the paper. After each run,
    turn and drive to the same inspection parking spot, then face forwards.
    """
    if identity not in DRAWING_STATES:
        raise ValueError('Only drawing identities have extended runs')
    commands = []

    def turn_to(angle):
        current = R.integrate_drive(commands)['yaw']
        turn = (angle-current+math.pi) % (2*math.pi)-math.pi
        wheel = turn*R.DIMS.wheel_track/(2*R.DIMS.wheel_radius)
        if abs(wheel) > 1e-12:
            commands.append((-wheel, wheel, False))

    def go_to(point, reverse=False):
        current = R.integrate_drive(commands)['axle']
        dx, dy = point[0]-current[0], point[1]-current[1]
        distance = math.hypot(dx, dy)
        heading = math.atan2(dy, dx)+(math.pi if reverse else 0)
        turn_to(heading)
        wheel = (-distance if reverse else distance)/R.DIMS.wheel_radius
        commands.append((wheel, wheel, False))

    def park():
        go_to(PARK_AXLE)
        turn_to(0)

    go_to(TEST_START, reverse=True)
    turn_to(0)
    commands.append((*UNTRIMMED_TURNS, True))
    park()
    if identity != 'rover-looping':
        go_to(STRAIGHT_START, reverse=True)
        turn_to(0)
        wheel = STRAIGHT_DISTANCE/R.DIMS.wheel_radius
        commands.append((wheel, wheel, True))
        park()
    if identity == 'drawing-rover':
        # Retain both long trial marks. Rejoin the original drawing phase at
        # its exact start pose, with the pen raised throughout the transfer.
        original_test = R.drawing_commands('rover-trimmed')
        join = R.integrate_drive(original_test)
        go_to(join['axle'])
        turn_to(join['yaw'])
        commands.extend(R.DRAW_COMMANDS[len(original_test):])
    return commands


def ink_material():
    """The same pen ink for test traces, lettering and the later fair banner."""
    from construction import special_material
    ink = special_material('rover dark teal pen ink', (.0001, .0014, .0018), roughness=1.)
    shader = ink.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Specular IOR Level'].default_value = 0
    return ink


def apply_materials(model):
    """Dark teal ink, with unchanged curve radii and letter geometry."""
    if model.get('rover_ink_material'):
        return
    from construction import surface
    ink = ink_material()
    for obj in [*model['traces'], model['invitation'], model['pen_nib']]:
        surface(obj, ink)
    model['rover_ink_material'] = ink


def stage(model, identity):
    """Presentation after canonical reset; returns a stationary paper view.

    The same 420 mm wide roll supplies a 700 mm length, instead of the source
    model's 550 mm length. Its diameter and width remain unchanged. Only the
    paper sheet's unrolled X extent changes, leftward from its fixed roll.
    The final drawing's paper edge and rover ground contacts stay intact. Hardware stays
    rigid, and test wheel/pen poses come from the actual command endpoint.
    """
    import bpy
    apply_materials(model)
    model['sheet'].scale.x = PAPER_LENGTH/.550
    model['sheet'].location.x = PAPER_RIGHT_EDGE-PAPER_LENGTH/2
    model['rover_presentation_motion'] = None
    if identity in DRAWING_STATES:
        commands = motion_commands(identity)
        travel = R.integrate_drive(commands)
        for i, obj in enumerate(model['traces']):
            points = travel['strokes'][i] if i < len(travel['strokes']) else []
            obj.hide_render = not bool(points)
            obj.hide_set(obj.hide_render)
            # Canonical whale/eye splines remain byte-for-byte intact. The
            # joined command path reaches those same art points naturally.
            if points and not (identity == 'drawing-rover' and i >= 2):
                curve = obj.data
                curve.splines.clear()
                spline = curve.splines.new('POLY')
                spline.points.add(len(points)-1)
                for co, point in zip(points, spline.points):
                    point.co = (*co, 1)
        R.apply_pose(model, wheel_angles=travel['wheel_angles'],
                     axle_xy=travel['axle'], yaw=travel['yaw'],
                     pen_angle=R.PEN_MAX, paper=identity in TEST_STATES)
        model['rover_presentation_motion'] = {'commands': commands, **travel}
    if identity in PAPER_STATES:
        model['view'] = dict(VIEW)
    bpy.context.view_layer.update()
    return model['view']
