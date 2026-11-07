"""Two truthful c23 teaching views, separate from canonical whale construction.

Call stage after flying_whale.set_state for every identity. The selected low
nose-dip is a rigid pose with managed real slack, not a force or cable simulation.
The trim detail changes only the camera; it removes or replaces no geometry.
"""
import math

LOW_CONTROL_STATES = frozenset({'whale-nose-down', 'whale-trimmed', 'whale-hovering-low', 'whale-low-tested'})
AFFECTED_STATES = LOW_CONTROL_STATES
TEST_HEIGHT = .060
MAX_LOW_HEIGHT = .100
NOSE_DOWN_DEGREES = -4.
CONTROL_MOVING_POINTS = 6
CONTROL_TURN_SLICE = slice(8, 25)
SHORT_CLIP = (.200, .195, .244)
SHORT_ANCHOR = (.200, .420, .047)
SHORT_LENGTH = math.dist((.200, .195, .344), SHORT_ANCHOR)
# Same real supported assembly, observed from its service side. The returned
# inset specification is optional renderer metadata, never a replacement toy.
TRIM_DETAIL_VIEW = {'location': (.36, .70, .37),
                    'target': (.080, .135, .171), 'scale': .32}
NOSE_DETAIL_VIEW = {'location': (0., -2.2, .245),
                    'target': (0., 0., .245), 'scale': 1.25}
TRIM_INSET = {'label': 'Hatch detail',
              'rect_fraction': (.04, .035, .43, .36),
              'view': TRIM_DETAIL_VIEW}


def rigid_point(point, height, pitch_degrees):
    x, y, z = point
    a = math.radians(pitch_degrees); c, s = math.cos(a), math.sin(a)
    return (c*x+s*z, y, -s*x+c*z+height)


def _ground_line(kind, moving_count, turn_slice, ground_x, height, pitch_degrees, exit_point):
    import flying_whale as W
    original = W.ground_line_points(kind, 0., exit_point)
    points = list(original)
    points[:moving_count] = [rigid_point(p, height, pitch_degrees)
                            for p in original[:moving_count]]
    # Lay the existing ground leg left of the short-tether ballast, leaving
    # both endpoints and the attached prefix unchanged in their local frames.
    for i in [moving_count, moving_count+1]:
        _, y, z = points[i]
        points[i] = (ground_x, y, z)
    length = lambda route: sum(math.dist(a,b) for a,b in zip(route,route[1:]))
    shift = (length(original)-length(points))/2
    points[turn_slice] = [(x+shift, y, z) for x, y, z in original[turn_slice]]
    return points


def control_points(height, pitch_degrees, exit_point=None):
    """Rigid attached prefix and the same U loop, clear of the short anchor."""
    return _ground_line('lift', CONTROL_MOVING_POINTS, CONTROL_TURN_SLICE,
                        .110, height, pitch_degrees, exit_point)


def stop_points(height=0., pitch_degrees=0., exit_point=None):
    """The low-tested stop cord also passes left of that same short anchor."""
    return _ground_line('stop', 2, slice(4, 21), .080,
                        height, pitch_degrees, exit_point)


def short_tether_points(height, pitch_degrees):
    """Same clip and fixed anchor; the existing ground bend stores the spare line."""
    start = rigid_point(SHORT_CLIP, height, pitch_degrees)
    if math.dist(start, SHORT_ANCHOR) > SHORT_LENGTH+1e-10:
        raise ValueError('Nose-dip pose exceeds the original short tether')
    lo, hi = 0., SHORT_LENGTH
    for _ in range(64):
        mid = (lo+hi)/2
        bend = (SHORT_ANCHOR[0]+mid, SHORT_ANCHOR[1], SHORT_ANCHOR[2])
        if math.dist(start, bend)+math.dist(bend, SHORT_ANCHOR) > SHORT_LENGTH:
            hi = mid
        else:
            lo = mid
    return [start, (SHORT_ANCHOR[0]+lo, SHORT_ANCHOR[1], SHORT_ANCHOR[2]), SHORT_ANCHOR]


def apply_low_pose(model, height=TEST_HEIGHT, pitch_degrees=NOSE_DOWN_DEGREES):
    """Checked route: rise level to 60 mm, then pitch the whole whale up to −4°."""
    import bpy
    import flying_whale as W
    if not 0. <= height <= MAX_LOW_HEIGHT or not NOSE_DOWN_DEGREES <= pitch_degrees <= 0.:
        raise ValueError('Outside the low teaching-pose range')
    if pitch_degrees and abs(height-TEST_HEIGHT) > 1e-10:
        raise ValueError('First raise the level whale clear of its cradle')
    root = model['root']
    root.location = (0., 0., height)
    root.rotation_euler = (0., math.radians(pitch_degrees), 0.)
    lead = control_points(height, pitch_degrees, model['control_exit'])
    tether = short_tether_points(height, pitch_degrees)
    W._set_polyline(model['control_lead'], lead)
    W._set_polyline(model['short_tether'], tether)
    bpy.context.view_layer.update()
    model['whale_workbench_pose'] = {
        'height_m': height, 'pitch_degrees': pitch_degrees,
        'control_length_m': sum(math.dist(a,b) for a,b in zip(lead,lead[1:])),
        'short_tether_length_m': sum(math.dist(a,b) for a,b in zip(tether,tether[1:])),
        'instruction': 'Selected low nose-dip before Jo lowers the whale, cuts power and opens the service hatch.'}
    return model['whale_workbench_pose']


def detail_view(identity):
    """A true opposite-side close view of the supported, open service hatch."""
    if identity == 'whale-trimmed':
        return {**TRIM_INSET, 'view': dict(TRIM_DETAIL_VIEW)}
    if identity == 'whale-nose-down':
        return {'label': 'Nose-dip detail', 'rect_fraction': (.04, .035, .92, .40),
                'resolution': (1200, 480), 'view': dict(NOSE_DETAIL_VIEW)}
    return None


def stage(model, identity):
    """Reset on every state, after the canonical state/visibility setter."""
    import bpy
    import flying_whale as W
    if model['state'] != identity:
        raise ValueError('Call flying_whale.set_state before whale_workbench.stage')
    # The canonical setter already restores all line geometry, height, trim,
    # hatch and visibility. It does not own this helper's extra root rotation.
    model['root'].rotation_euler = (0., 0., 0.)
    model['root'].location.x = model['root'].location.y = 0.
    model['whale_workbench_pose'] = None
    model['whale_service_detail'] = detail_view(identity)
    if identity == 'whale-nose-down':
        apply_low_pose(model)
    elif identity in LOW_CONTROL_STATES:
        W._set_polyline(model['control_lead'], control_points(model['root'].location.z, 0., model['control_exit']))
    if identity == 'whale-low-tested':
        W._set_polyline(model['stop_cord'], stop_points(0., 0., model['control_exit']))
    bpy.context.view_layer.update()
    return model['view']
