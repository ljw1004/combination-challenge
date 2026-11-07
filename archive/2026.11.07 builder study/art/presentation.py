"""Strict adapters from story identities to canonical geometry.

Geometry modules own their parts. These adapters choose construction poses and
views; they never stretch a part to fit an illustration.
"""
import math

GARDEN_VIEW={"location":(2.58,-4.,2.6),"target":(.28,-.22,.75),"scale":3.4}


def normalize(model,name):
    import bpy
    import scene_parts as S
    if "parts" not in model:
        model["parts"]={}
        for obj in model["objects"]:model["parts"].setdefault(obj["part_id"],[]).append(obj)
    if "root" not in model:
        root=S.empty(name)
        for obj in model.get("objects",[]):
            if obj.parent is None:obj.parent=root
        model["root"]=root
    return model


def factory_key(item):
    from hand_tools import TOOL_IDS
    from loose_props import PROP_IDS
    if item["id"] in TOOL_IDS:return "tool:"+item["id"]
    if item["id"] in PROP_IDS:return "prop:"+item["id"]
    family=item["family"]
    if family=="cd":return "cd:double" if item["id"] in {"cd-double-cam","cd-double-wave","crank-dragon"} else "cd:single"
    if family in {"whale","fair","flight"}:return "whale"
    return family


def build(key):
    if key.startswith("tool:"):
        import hand_tools as T
        model=T.build_model(key.split(":",1)[1])
        model["view"]["scale"]=.32
        return model
    if key.startswith("prop:"):
        import loose_props as P
        model=P.build_model(key.split(":",1)[1])
        if key=="prop:wr-starting-gate":model["view"]["scale"]=.53
        if key in {"prop:air-test-block","prop:air-fruit-game"}:
            # Literal gripping objects use the grabber's projection. The
            # exporter pads small drawings for selection without magnification.
            target=model["view"]["target"]
            model["view"]={"location":tuple(x+d for x,d in zip(target,(.331,-.58,.635))),"target":target,"scale":.57}
        return model
    if key=="pw":
        import wind_toys as W
        return W.build_pinwheel()
    if key=="wr":
        import wind_toys as W
        return W.build_racer()
    if key=="pe":
        import optical_toys as O
        return O.build_periscope()
    if key=="ka":
        import optical_toys as O
        return O.build_kaleidoscope()
    if key.startswith("cd:"):
        import cam_dragon as D
        model=D.build_model("two_lobe" if key.endswith("double") else "eccentric",include_handle=True)
        model["view"]={"location":(.55,-.85,.48),"target":(0,0,.150),"scale":.42}
        return model
    if key=="air":
        import pneumatic_grabber as G
        model=normalize(G.build_model(),"canonical pneumatic grabber")
        model["view"]={"location":(.18,-.58,.66),"target":(-.151,0,.025),"scale":.57}
        return model
    if key=="film":
        import picture_drum as D
        return D.build_model()
    modules={"pb":"pinball_table","rover":"drawing_rover","lc":"lifting_crane","wm":"wave_machine",
             "theatre":"shadow_theatre","lift":"lift_module","whale":"flying_whale"}
    if key not in modules:raise ValueError("Unimplemented artwork family: "+key)
    module=__import__(modules[key])
    model=module.build_model()
    model["stage_module"]=module
    if key=="rover":
        import rover_presentation
        rover_presentation.apply_materials(model)
    if key=="theatre":
        import theatre_presentation
        theatre_presentation.apply_materials(model)
    if key=="lc":
        import crane_workbench
        crane_workbench.build(model)
    if key=="whale":
        import loose_props as L
        import scene_parts as S
        import whale_graphics
        import whale_workbench  # Bind the pose helper before render source hashes.
        whale_graphics.apply(model)
        import theatre_presentation
        theatre_presentation.apply_materials(model["theatre"])
        wrapper=S.empty("garden presentation root")
        model["root"].parent=wrapper;model["ground_root"].parent=wrapper
        model["presentation_root"]=wrapper
        model["external_models"]={}
        registrations={}
        for identity,placement in model["external_placements"].items():
            prop=L.build_model(identity)
            prop["root"].parent=placement["parent"];prop["root"].location=placement["location"]
            model["external_models"][identity]=prop
            registrations[identity]=[prop["root"],*[o for group in prop["parts"].values() for o in group]]
        module.register_parts(model,registrations)
    return normalize(model,key)


def stage(model,item,key):
    import bpy
    from construction import set_visible_parts
    ident=item["id"]
    if key.startswith(("tool:","prop:")):return model["view"]
    if key=="lc":
        import crane_workbench
        return crane_workbench.stage(model,ident)
    if "stage_module" in model:
        v=model["stage_module"].set_state(model,ident)
        view=v if isinstance(v,dict) and "location" in v else model["view"]
        if key=="theatre":
            import theatre_presentation
            view=theatre_presentation.stage(model,ident) or view
        if key=="rover":
            import rover_presentation
            view=rover_presentation.stage(model,ident)
        if key=="wm" and ident=="wm-cord":
            # Look down on the actual prepared loops instead of collapsing
            # their XY planes into the low assembly view. Scale stays shared.
            view={"location":(0,-.2,1.6),"target":(0,0,.14),"scale":view["scale"]}
        if key=="wm" and ident=="wm-belt":
            # The belt lies in YZ; its loose view should show that loop's face.
            view={"location":(.8,-.35,.45),"target":(-.263,-.015,.10),"scale":view["scale"]}
        if key=="lift":
            import lift_presentation
            lift_presentation.stage(model,ident)
            view={**view,"scale":view["scale"]*1.22}
        if key=="whale":
            import whale_workbench
            whale_workbench.stage(model,ident)
            if view["scale"]>2:view=dict(GARDEN_VIEW)
        return view
    if key=="film":
        import picture_drum as D
        return D.set_state(model,ident)
    allowed=set(item["materials"])
    unknown=allowed-set(model["parts"])
    if unknown:raise ValueError(f"{ident}: model lacks supplied parts {sorted(unknown)}")
    set_visible_parts(model,allowed)
    if key=="pw":
        import wind_toys as W
        W.set_pinwheel_state(model,ident not in {"pw-paper","pw-cut-paper"},ident!="pw-paper")
        # State preparation may toggle paper meshes; still respect ownership.
        for part,objects in model["parts"].items():
            if part not in allowed:
                for obj in objects:obj.hide_render=True
    elif key=="wr":
        import wind_toys as W
        W.apply_racer_pose(model,0)
        model["root"].rotation_euler.z=-.25 if ident in {"wr-aimed","wind-racer"} else 0
    elif key in {"pe","ka"}:
        import optical_toys as O
        O.stage(model,item)
        if key=="pe" and ident in {"pe-net","pe-lined","pe-lining"}:
            return {"location":(.0,.8,.43),"target":(0,0,.15),"scale":.46}
    elif key.startswith("cd:"):
        import cam_dragon as D
        D.set_state(model,ident)
        if ident=="cd-lost-contact":
            # A hung follower remains at its actual maximum lift while the
            # eccentric falls, exposing the resulting 20 mm contact gap.
            held=D.solve_pose(math.pi/2,model["variant"],model["dimensions"])["foot_z"]
            D.apply_pose(model,3*math.pi/2,follower_height=held)
        elif ident in {"cd-sprung-lifter","cd-working-lifter","cd-first-wave"}:
            D.apply_pose(model,3*math.pi/2)
    elif key=="air":
        import pneumatic_grabber as G
        # Selected operating stills show a real near-closed stroke, including
        # the corresponding output and hand-syringe plunger translations.
        closing=ident in {"air-hand-grabber","air-squeezing","air-padded","air-routed","pneumatic-grabber"}
        G.apply_pose(model,model["dimensions"].travel*.88 if closing else 0)
    bpy.context.view_layer.update()
    return model["view"]
