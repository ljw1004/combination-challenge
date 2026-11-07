"""Strict adapters from story identities to canonical geometry.

Geometry modules own their parts. These adapters choose construction poses and
views; they never stretch a part to fit an illustration.
"""
import math


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
    return normalize(model,key)


def stage(model,item,key):
    import bpy
    from construction import set_visible_parts
    ident=item["id"]
    if key.startswith(("tool:","prop:")):return model["view"]
    if "stage_module" in model:
        v=model["stage_module"].set_state(model,ident)
        return v if isinstance(v,dict) and "location" in v else model["view"]
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
    elif key in {"pe","ka"}:
        import optical_toys as O
        O.stage(model,item)
        if key=="pe" and ident in {"pe-net","pe-lined","pe-lining"}:
            return {"location":(.0,.8,.43),"target":(0,0,.15),"scale":.46}
    elif key.startswith("cd:"):
        import cam_dragon as D
        model["handle_state"]="parked" if ident=="crank-dragon" else "fitted"
        D.apply_pose(model,.6)
        # The detachable guide cover is shown open while supplied separately.
        for obj in model["parts"]["cd-guide"]:
            if obj.name.startswith("square guide front/back wall") and obj.location.y<0:
                if "closed_y" not in obj:obj["closed_y"]=obj.location.y
                obj.location.y=obj["closed_y"]-(.014 if ident=="cd-guide" else 0)
        if ident in {"cd-lost-contact","cd-working-lifter","cd-first-wave","cd-double-wave","crank-dragon"}:
            for obj in model["parts"]["cd-crank-key"]:obj.hide_render=False
    elif key=="air":
        import pneumatic_grabber as G
        G.apply_pose(model,model["dimensions"].travel*.25 if ident in {"air-hand-grabber","air-squeezing","pneumatic-grabber"} else 0)
    bpy.context.view_layer.update()
    return model["view"]
