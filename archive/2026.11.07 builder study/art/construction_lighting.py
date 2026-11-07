"""Keep the full-height garden construction inside the diagram light rig.

Only the two studio area lights move. Scaling their positions, dimensions and
power together preserves their angular softness and nominal illumination.
Garden reward compositions have their own lighting and do not call this helper.
"""


def frame_lights(scene, projection_scale):
    factor = 4. if projection_scale > 2. else 1.
    for obj in scene.objects:
        if obj.type != "LIGHT" or obj.name.split(".")[0] not in {"large soft key", "soft fill"}:
            continue
        if "construction_light_position" not in obj:
            obj["construction_light_position"] = list(obj.location)
            obj["construction_light_power"] = obj.data.energy
            obj["construction_light_size"] = obj.data.size
        obj.location = tuple(factor*x for x in obj["construction_light_position"])
        obj.data.energy = factor*factor*obj["construction_light_power"]
        obj.data.size = factor*obj["construction_light_size"]
