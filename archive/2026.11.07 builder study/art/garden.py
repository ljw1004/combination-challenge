"""A single original miniature garden shared by the finished-toy scenes.

The moving inventions come from their canonical factories. This module supplies
only surroundings: a pale fence, terracotta pots, a bench and chalk garden lane.
"""
import math
import random


def material(name,color):
    from construction import special_material
    return special_material("garden "+name,color,roughness=.9)


def paint(obj,name,color):
    from construction import surface
    return surface(obj,material(name,color))


def plant(x,y,z=.0,height=.36,seed=1,foliage=True):
    import bpy
    import scene_parts as S
    rng=random.Random(seed)
    bpy.ops.mesh.primitive_cone_add(vertices=40,radius1=.070,radius2=.090,depth=.130,location=(x,y,z+.065))
    paint(bpy.context.object,"terracotta",(.57,.21,.10))
    paint(S.cylinder("pot earth",(x,y,z+.129),.079,.008,"ink","Z"),"soil",(.12,.075,.035))
    if not foliage:return
    for branch in range(6):
        t=branch*math.tau/6+rng.random()*.2
        end=(x+.07*math.cos(t),y+.07*math.sin(t),z+.16+rng.random()*(height-.16))
        paint(S.rod("plant stem",(x,y,z+.12),end,.0025,"teal"),"leaf",(.16,.33,.13))
        for k in range(3):
            bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,radius=1,location=(end[0]+.018*math.cos(t+k),end[1]+.018*math.sin(t+k),end[2]-.04*k))
            o=bpy.context.object;o.scale=(.044,.018,.009);o.rotation_euler=(.2,k*.3,t+k)
            paint(o,"leaf "+str(k),(.20+.025*k,.39+.025*k,.16))


def build(bench=True,evening=False,extent=4):
    import bpy
    import scene_parts as S
    grass=(.20,.30,.20) if evening else (.36,.48,.25)
    paint(S.box("one garden lawn",(0,.4,-.025),(extent,extent,.05),"teal"),"grass dusk" if evening else "grass",grass)
    paint(S.box("pale garden path",(0,-.35,.003),(2.7,.58,.008),"paper"),"sand",(.70,.67,.48))
    # Same straight fence and orange gate frame recur in every reward scene.
    for i in range(31):
        x=-1.5+i*.10
        paint(S.box("fence picket",(x,1.10,.46),(.073,.025,.88),"paper",bevel=.008),"fence",(.72,.76,.62))
    for z in (.19,.65):paint(S.box("fence rail",(0,1.125,z),(3.2,.040,.055),"paper"),"fence",(.72,.76,.62))
    for x in (-1.45,1.45):
        paint(S.box("garden gate post",(x,1.08,.51),(.075,.075,1.02),"orange"),"gate",(.53,.25,.12))
    for x,y,h,seed in [(-.75,.63,.48,4),(.80,.70,.41,8),(-1.05,.10,.32,12),(.92,.00,.52,19)]:plant(x,y,height=h,seed=seed)
    if bench:
        for x in (-.48,.48):
            for y in (-.25,.25):S.box("workbench leg",(x,y,.295),(.065,.065,.590),"birch")
        for i in range(5):
            S.box("bench top board",(0,-.32+i*.16,.610),(1.22,.154,.040),"birch",bevel=.003)
        for x in (-.46,.46):S.box("bench apron",(x,0,.55),(.035,.69,.10),"birch")
    scene=bpy.context.scene
    scene.world.use_nodes=True
    world=scene.world.node_tree.nodes.get("Background")
    world.inputs["Color"].default_value=(.32,.42,.57,1) if evening else (.74,.83,.89,1)
    world.inputs["Strength"].default_value=.24 if evening else .40
    for obj in list(bpy.data.objects):
        if obj.type=="LIGHT":bpy.data.objects.remove(obj,do_unlink=True)
    for name,location,power,size,color in [
        ("late garden sun",(-2,-3,4),350 if evening else 500,3.0,(1.,.72,.44)),
        ("open sky fill",(2,.4,3),140,4.0,(.68,.82,1.))]:
        data=bpy.data.lights.new(name,"AREA");data.energy=power;data.shape="DISK";data.size=size;data.color=color
        obj=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(obj);obj.location=location;S.look_at(obj,(0,0,.6))
    scene.render.film_transparent=False
    scene.view_settings.view_transform="AgX";scene.view_settings.look="AgX - Medium High Contrast";scene.view_settings.exposure=-.4
    return {"bench_top":.630}


def watering_can(x=.43,y=-.35):
    import scene_parts as S
    body=S.annulus("hollow watering can body",(0,0,0),.085,.080,.20,"teal")
    body.rotation_euler.x=math.pi/2;body.location=(x,y,.11);paint(body,"can",(.09,.34,.36))
    paint(S.cylinder("watering can bottom",(x,y,.012),.084,.004,"teal","Z"),"can",(.09,.34,.36))
    paint(S.rod("watering can spout",(x-.07,y,.065),(x-.20,y,.24),.018,"teal"),"can",(.09,.34,.36))
    paint(S.cylinder("watering rose",(x-.20,y,.24),.034,.012,"teal","Z"),"can",(.09,.34,.36))
    handle=S.annulus("watering can handle",(0,0,0),.080,.066,.012,"teal",gap=2.2)
    handle.rotation_euler.y=math.pi;handle.location=(x+.10,y,.13)
    paint(handle,"can",(.09,.34,.36))


def chalk_lane():
    import scene_parts as S
    for y in (-.45,-.25):S.stroke("chalk race lane",[(x,y,.008) for x in (-1.2,.9)],.002,"paper")
    for x in (-.65,.55):S.stroke("chalk start or finish",[(x,y,.008) for y in (-.47,-.23)],.003,"paper")


def apple_tree(x,y,seed=1):
    """Recurring screen supports; trunks are clear below the canopy."""
    import bpy
    import scene_parts as S
    rng=random.Random(seed)
    paint(S.cylinder("apple tree trunk",(x,y,1.20),.043,2.40,"birch","Z"),"apple bark",(.30,.16,.075))
    for k in range(6):
        theta=k*math.tau/6
        end=(x+.29*math.cos(theta),y+.29*math.sin(theta),2.45+rng.uniform(-.12,.16))
        paint(S.rod("apple branch",(x,y,2.05),end,.019,"birch"),"apple bark",(.30,.16,.075))
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2,radius=.31,location=end)
        leaf=bpy.context.object;leaf.scale=(1.,.85,.72)
        paint(leaf,"apple canopy "+str(k%3),(.18+.025*(k%3),.34+.025*(k%3),.10))
        for j in range(2):
            bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,radius=.027,location=(end[0]+rng.uniform(-.16,.16),end[1]-.22,end[2]-.12+j*.07))
            paint(bpy.context.object,"apple",(.67,.12,.055))


def cloth_ties(corners,tree_y=-1.45):
    import scene_parts as S
    for corner,x in zip(corners,(-.80,.80)):
        z=corner[2]
        S.stroke("cloth corner tie",[corner,(x,tree_y+.043,z)],.0012,"ink")
        S.stroke("cloth tie around trunk",[(x+.044*math.sin(a),tree_y+.044*math.cos(a),z) for a in [math.tau*i/32 for i in range(33)]],.0012,"ink")
