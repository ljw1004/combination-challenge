"""Canonical marble pinball table; metres, z up, player at negative y.

The table's fixed terrain, receiving slots and fasteners are real geometry.
Launcher and flippers have finite mechanical stops. Elastic spring/return loops
may change shape; every rigid part only rotates/translates. Ball paths show
geometric access and gravitational potential, not a contact/dynamics simulation.
"""
from dataclasses import dataclass, asdict
import math

@dataclass(frozen=True)
class Dimensions:
    width: float=.380
    length: float=.600
    board: float=.010
    slope: float=math.radians(5)
    crossfall: float=math.radians(-1.2)
    marble_radius: float=.011
    launcher_x: float=.166
    launcher_z: float=.014
    launcher_gentle: float=.012
    launcher_long: float=.022
    flipper_x: float=.135
    flipper_y: float=-.160
    flipper_length: float=.112
    flipper_min: float=-.45
    flipper_max: float=.50
DIMS=Dimensions()
VIEW={"location":(.78,-1.05,.95),"target":(0,-.015,.085),"scale":.83}
VIEWS={"assembly":VIEW,"top":{"location":(0,-.02,1.6),"target":(0,-.02,.08),"scale":.83},
       "underside":{"location":(.65,-.9,-.65),"target":(0,-.025,.085),"scale":.83},
       "launcher":{"location":(.50,-.65,.32),"target":(.166,-.28,.065),"scale":.26}}
SUPPLIES=['pb-tray','pb-rails','pb-wedge','pb-plunger-tube','pb-spring','pb-marble','pb-shim','pb-pivot-plate','pb-flipper-blades','pb-targets']
STATES={'pb-railed':SUPPLIES[:2], 'pb-sloped':SUPPLIES[:3], 'pb-launcher':['pb-plunger-tube','pb-spring'],
        'pb-launcher-table':SUPPLIES[:5], 'pb-deadspot':SUPPLIES[:5], 'pb-return-table':SUPPLIES[:5]+['pb-shim'],
        'pb-flippers':['pb-pivot-plate','pb-flipper-blades']}
STATES['pb-flipper-table']=STATES['pb-return-table']+['pb-pivot-plate','pb-flipper-blades']
for _id in ('pb-target-table','pb-short-launch','pb-tuned','pinball-table'):STATES[_id]=STATES['pb-flipper-table']+['pb-targets']


def terrain(x,y):
    # The shallow pocket's long axis follows its diagonal route past the lip.
    # Removing crossfall makes this whole axis downhill, rather than merely
    # lowering one endpoint while leaving a finite-marble local minimum.
    ux,uy=13/math.sqrt(185),-4/math.sqrt(185)
    dx,dy=x+.145,y+.200
    along=ux*dx+uy*dy;across=-uy*dx+ux*dy
    return -.0015*math.exp(-(along/.070)**2-(across/.012)**2)


def solve_pose(pull=0,flippers=(0,0),long=False,d=DIMS):
    limit=d.launcher_long if long else d.launcher_gentle
    if not 0<=pull<=limit+1e-10:raise ValueError('Pull outside selected captive stop')
    if any(not 0<=v<=1 for v in flippers):raise ValueError('Flipper fractions must be 0..1')
    return {'pull':pull,'limit':limit,'spring_length':.054-pull,
            'angles':[(d.flipper_min+(d.flipper_max-d.flipper_min)*q)*(1 if i==0 else -1) for i,q in enumerate(flippers)]}


def check_motion(samples=201,d=DIMS):
    poses=[solve_pose(d.launcher_long*i/(samples-1),(i/(samples-1),1-i/(samples-1)),True,d) for i in range(samples)]
    pocket=(-.145,-.200);exit=(-.080,-.220)
    def height(p,cross):
        x,y=p;z=terrain(x,y)
        return (y*math.sin(d.slope)+z*math.cos(d.slope))*math.cos(cross)-x*math.sin(cross)
    restoring=[]
    for pose in poses:
        for side,angle in zip((-1,1),pose['angles']):
            x,y=side*.026*math.cos(angle),side*.026*math.sin(angle)
            fx,fy=side*.010-x,.046-y;length=math.hypot(fx,fy)
            torque=(x*fy-y*fx)/length
            restoring.append(side*torque)
    return {'minimum_return_loop_restoring_moment_arm_m':min(restoring),'dimensions':asdict(d),'samples':samples,'spring_minimum_turn_gap_m':min((p['spring_length']-.0012)/10-.0012 for p in poses),
            'launcher_piston_radial_clearance_m':.010-.0095,'shaft_radial_clearance_m':.0032-.003,
            'flipper_pivot_radial_clearance_m':.0043-.004,'flipper_board_clearance_m':.001,
            'marble_diameter_m':2*d.marble_radius,'launch_lane_clear_width_m':.027,
            'pocket_to_exit_height_before_shim_m':height(exit,d.crossfall)-height(pocket,d.crossfall),
            'pocket_to_exit_height_after_shim_m':height(exit,0)-height(pocket,0),
            'shim_left_lift_m':.360*abs(math.tan(d.crossfall)),
            'limits':['Ideal geometric travel; no spring force, restitution, friction or marble trajectory claim.',
                      'Pocket check compares the actual terrain at two points, not a guaranteed dynamic return.',
                      'Prepared push-fit feet, captive fasteners and bonded modules require manufacturing validation.']}


def _normals(obj):
    import bmesh
    bm=bmesh.new();bm.from_mesh(obj.data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(obj.data);bm.free()
    return obj


def _xy(name,points,z,height,color='birch'):
    import bpy
    import scene_parts as S
    n=len(points);vs=[(x,y,h) for h in (z-height/2,z+height/2) for x,y in points]
    fs=[tuple(reversed(range(n))),tuple(range(n,2*n))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
    me=bpy.data.meshes.new(name);me.from_pydata(vs,[],fs);me.update();ob=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(ob)
    return _normals(S.finish(ob,name,color))


def _cut(obj,cutter):
    import bpy
    cutter.parent=obj.parent;_normals(cutter)
    bpy.context.view_layer.objects.active=obj;m=obj.modifiers.new('actual prepared opening','BOOLEAN');m.operation='DIFFERENCE';m.object=cutter
    bpy.ops.object.modifier_apply(modifier=m.name);bpy.data.objects.remove(cutter,do_unlink=True)


def build_model(d=DIMS):
    import bpy
    import scene_parts as S
    from construction import Assembly,surface,special_material
    a=Assembly('canonical pinball table');table=S.empty('rigid table tilted onto its wedge');table.parent=a.root
    holes=[];mounts=[];props={};rigid=[]
    def add(part,obj,parent=table):return a.add(part,obj,parent)
    def box(part,name,c,s,col='birch',parent=table):return add(part,S.box(name,c,s,col),parent)
    def cyl(part,name,c,r,l,col='ink',axis='Z',parent=table):return add(part,S.cylinder(name,c,r,l,col,axis),parent)
    def line(part,name,p,r=.001,col='ink',parent=table):return add(part,S.stroke(name,p,r,col),parent)
    def bore(ob,c,r,length,axis='Z'):
        cutter=S.cylinder('temporary receiving cutter',c,r,length,'ink',axis);_cut(ob,cutter);holes.append((ob,c,axis,length))
    def bolt(part,name,x,y,low,high,r=.002):
        cyl(part,name+' captive shaft',(x,y,(low+high)/2),r,high-low)
        for z in (low-.001,high+.001):cyl(part,name+' retaining shoulder',(x,y,z),r*1.7,.002)
    # One fixed heightfield tray: the corner depression is part of the plywood shape.
    # Resolve the diagonal depression at 2 mm locally: coarse non-planar quads
    # can introduce false uphill facets even when the analytic drain is clear.
    xs=sorted(set([round(-d.width/2+d.width*i/64,9) for i in range(65)]+[round(-.180+i*.002,9) for i in range(59)]))
    ys=sorted(set([round(-d.length/2+d.length*j/96,9) for j in range(97)]+[round(-.240+j*.002,9) for j in range(41)]))
    nx,ny=len(xs)-1,len(ys)-1;verts=[]
    for y in ys:
        for x in xs:verts.append((x,y,terrain(x,y)))
    n=len(verts);verts += [(x,y,-d.board) for x,y,z in verts]
    faces=[]
    for j in range(ny):
        for i in range(nx):
            k=j*(nx+1)+i;faces += [(k,k+1,k+nx+2,k+nx+1),(n+k,n+k+nx+1,n+k+nx+2,n+k+1)]
    perimeter=list(range(nx+1))+[j*(nx+1)+nx for j in range(1,ny+1)]+[ny*(nx+1)+i for i in range(nx-1,-1,-1)]+[j*(nx+1) for j in range(ny-1,0,-1)]
    faces += [(p,perimeter[(i+1)%len(perimeter)],perimeter[(i+1)%len(perimeter)]+n,p+n) for i,p in enumerate(perimeter)]
    me=bpy.data.meshes.new('fixed shallow tray terrain');me.from_pydata(verts,[],faces);me.update();ob=bpy.data.objects.new('plywood tray with actual corner pocket',me);bpy.context.collection.objects.link(ob)
    board=add('pb-tray',_normals(S.finish(ob,ob.name,'birch')))
    for x in (-.166,.166):
        ob=box('pb-tray','carrying-handle side cheek',(x,0,-.025),(.012,.130,.030))
        _cut(ob,S.box('rounded handle opening',(x,0,-.025),(.030,.090,.016),'ink'))
        for y in (-.058,.058):box('pb-tray','factory-bonded cheek tab',(x,y,-.012),(.012,.014,.010))
        ob['attachment']='Factory-bonded cheek with two full-width contact tabs to tray underside'
    rail_tabs=[]
    def rail(name,points,feet=True,height=.030):
        width=.004;left=[];right=[]
        for i,p in enumerate(points):
            q=points[max(0,i-1)];r=points[min(len(points)-1,i+1)];dx,dy=r[0]-q[0],r[1]-q[1];l=math.hypot(dx,dy)
            left.append((p[0]-dy/l*width,p[1]+dx/l*width));right.append((p[0]+dy/l*width,p[1]-dx/l*width))
        obj=add('pb-rails',_xy(name,left+right[::-1],height/2,height,'teal'))
        if feet:
            for idx in sorted(set([0,len(points)//2,len(points)-1])):
                x,y=points[idx];size=(.005,.005,.008)
                tab=box('pb-rails',name+' integral push-fit foot',(x,y,-.004),size,'teal');rail_tabs.append(tab)
                _cut(board,S.box('receiving rail mortise',(x,y,-.005),(.0053,.0053,.014),'ink'))
        return obj
    left_rail=rail('left retaining rail',[(-.185,y) for y in (-.26,-.12,.08,.23)])
    rail('right retaining rail',[(.185,y) for y in (-.26,-.12,.08,.23)])
    rail('curved top rail',[(.185*math.cos(t),.23+.062*math.sin(t)) for t in [i*math.pi/40 for i in range(41)]])
    rail('launch-lane divider',[(.150,-.183),(.150,-.05),(.150,.15),(.149,.20),(.142,.228),(.125,.247)])
    rail('left curved inward return lip',[(-.181,-.184),(-.177,-.218),(-.161,-.245),(-.133,-.263),(-.097,-.276),(-.060,-.293)])
    rail('right inward return lip',[(.144,-.245),(.130,-.270),(.065,-.287),(.029,-.296)])
    apron=box('pb-rails','catch apron',(0,-.323,-.003),(.132,.065,.006),'teal');bore(apron,(0,-.327,-.003),.015,.020)
    cup=add('pb-rails',S.annulus('marble storage cup wall',(0,0,0),.018,.015,.026,'orange'));cup.rotation_euler.x=math.pi/2;cup.location=(0,-.327,-.013)
    cyl('pb-rails','storage cup closed floor',(0,-.327,-.027),.018,.003,'orange')
    for x in (-.060,.060):box('pb-rails','apron push-fit bridge',(x,-.290,-.004),(.008,.022,.008),'teal');_cut(board,S.box('apron mortise',(x,-.291,-.005),(.0083,.0223,.014),'ink'))
    for x in (-.065,.065):box('pb-rails','catch apron side rim',(x,-.324,.010),(.004,.064,.020),'teal')
    box('pb-rails','catch apron end rim',(0,-.353,.010),(.130,.004,.020),'teal')
    # Bench datum: front underside is 64 mm above the bench. Wedge rises rear.
    wedge=add('pb-wedge',_xy('broad clipped support wedge',[(-.160,.200),(.160,.200),(.160,.285),(-.160,.285)],-.020,.020,'birch'))
    # Replace prism top with exact sloped top in world coordinates in apply_pose.
    wedge['role']='Support below far end, contact plane follows tray underside; fixed construction geometry'
    # Locator tongues prevent sliding; separate bent spring clips hook over
    # the rear edge so the support stays attached when the tray is carried.
    wedge_clips=[]
    for x in (-.147,.147):
        box('pb-wedge','wedge locating tongue',(x,.245,-.011),(.016,.025,.006),'teal')
        _cut(board,S.box('wedge clip socket',(x,.245,-.008),(.0163,.0253,.0045),'ink'))
        box('pb-wedge','rear clip bonded lower arm',(x,.292,-.0106),(.012,.024,.0012),'teal')
        box('pb-wedge','rear clip outside spring bend',(x,.3034,-.005),(.012,.0012,.0124),'teal')
        wedge_clips.append(box('pb-wedge','rear clip retaining upper lip',(x,.298,.0006),(.012,.012,.0012),'teal'))
    shim=box('pb-shim','levelling shim under left front corner',(-.175,-.260,-.015),(.028,.055,.00733),'orange')
    box('pb-shim','shim captive edge clip',(-.187,-.260,.010),(.004,.030,.020),'teal',a.root)
    # Enclosed launcher barrel and captive soft piston.
    barrel=add('pb-plunger-tube',S.annulus('closed spring enclosure',(d.launcher_x,-.251,d.launcher_z),.013,.010,.068,'teal'))
    rear=cyl('pb-plunger-tube','removable rear bearing cap',(d.launcher_x,-.283,d.launcher_z),.013,.004,'teal','Y');bore(rear,(d.launcher_x,-.283,d.launcher_z),.0032,.012,'Y')
    front=cyl('pb-plunger-tube','front captive piston stop',(d.launcher_x,-.219,d.launcher_z),.013,.004,'teal','Y');bore(front,(d.launcher_x,-.219,d.launcher_z),.0073,.012,'Y')
    for y in (-.268,-.235):
        foot=box('pb-plunger-tube','launcher mounting foot',(.161,y,.002),(.026,.012,.004),'teal')
        bracket=box('pb-plunger-tube','factory-bonded barrel bracket',(.159,y,.007),(.008,.012,.006),'teal')
        _cut(bracket,S.cylinder('barrel bracket clear bore',(d.launcher_x,y,d.launcher_z),.0101,.016,'ink','Y'))
        for ob in (board,foot):bore(ob,(.151,y,0),.0022,.040)
        bolt('pb-plunger-tube','launcher captive mount',.151,y,-.011,.004)
    pull=add('pb-plunger-tube',S.empty('rigid captive plunger'))
    cyl('pb-plunger-tube','plunger shaft',(d.launcher_x,-.286,d.launcher_z),.003,.126,'ink','Y',pull)
    cyl('pb-plunger-tube','captive piston',(d.launcher_x,-.224,d.launcher_z),.0095,.006,'orange','Y',pull)
    cyl('pb-plunger-tube','soft striking tip',(d.launcher_x,-.219,d.launcher_z),.007,.008,'orange','Y',pull)
    handle=cyl('pb-plunger-tube','removable pull handle',(d.launcher_x,-.348,d.launcher_z),.003,.067,'orange','X',pull)
    # The pull handle meets this adjustable stop; screw stays captive in its marked slot.
    guide=box('pb-plunger-tube','adjustable-stop guide rail',(.200,-.361,.003),(.010,.066,.006),'teal')
    _cut(guide,S.box('stop adjustment slot',(.200,-.365,.003),(.0033,.025,.020),'ink'))
    for y in (-.366,-.376):line('pb-plunger-tube','marked travel limit',[(.195,y,.0065),(.205,y,.0065)],.0007,'paper')
    box('pb-plunger-tube','stop guide factory bracket',(.190,-.330,.003),(.030,.010,.006),'teal')
    box('pb-plunger-tube','barrel to stop guide spine',(.180,-.299,.003),(.012,.064,.006),'teal')
    stop=add('pb-plunger-tube',S.empty('captive adjustable pull stop'))
    block=box('pb-plunger-tube','travel stop block',(.200,-.354,.014),(.010,.006,.016),'orange',stop)
    bore(block,(.200,-.354,.014),.0017,.030)
    screw=cyl('pb-plunger-tube','captive stop clamp screw',(.200,-.354,.0095),.0015,.027,'ink','Z',stop)
    head=cyl('pb-plunger-tube','stop screw head',(.200,-.354,.023),.003,.002,'ink','Z',stop)
    _cut(head,S.box('stop screwdriver slot',(.200,-.354,.0235),(.0052,.0014,.0012),'ink'))
    nut=box('pb-plunger-tube','sliding square clamp nut',(.200,-.354,-.002),(.006,.006,.004),'ink',stop)
    bore(nut,(.200,-.354,-.002),.0015,.008)
    screw['interface']='Standard M3 clamp thread, represented at nominal diameter; continuous shank and head'
    nut['interface']='M3 threaded square nut, restrained against rotation and loss by the closed guide channel'
    box('pb-plunger-tube','stop nut captive channel floor',(.200,-.361,-.0047),(.010,.066,.001),'teal')
    for x in (.1959,.2041):box('pb-plunger-tube','stop nut captive channel side',(x,-.361,-.0026),(.0018,.066,.0052),'teal')
    spring=line('pb-spring','enclosed low-force compression spring',[(0,0,0),(0,0,.01)],.0006,'ink')
    # Under-table retained flipper shafts, direct finger levers and end stops.
    plate=box('pb-pivot-plate','under-table pivot plate',(0,-.168,-.020),(.320,.145,.004),'teal')
    for x in (-.090,.090):
        for y in (-.225,-.105):
            spacer=cyl('pb-pivot-plate','mount standoff',(x,y,-.014),.005,.008,'teal')
            for ob in (board,plate,spacer):bore(ob,(x,y,-.010),.0022,.060)
            bolt('pb-pivot-plate','plate captive mounting screw',x,y,-.023,.001)
    flips=[];bands=[];stops=[]
    for side in (-1,1):
        x=side*d.flipper_x;sign=1 if side==-1 else -1
        for ob in (board,plate):bore(ob,(x,d.flipper_y,0),.0043,.070)
        rotor=add('pb-pivot-plate',S.empty(('left' if side==-1 else 'right')+' flipper spindle'));rotor.location=(x,d.flipper_y,0);flips.append(rotor)
        cyl('pb-pivot-plate','retained rotating pivot post',(0,0,-.006),.004,.050,'ink','Z',rotor)
        for z in (-.032,.012):cyl('pb-pivot-plate','pivot retaining shoulder',(0,0,z),.007,.002,'ink','Z',rotor)
        cyl('pb-pivot-plate','rotating lower thrust collar',(0,0,.0005),.006,.001,'ink','Z',rotor)
        cyl('pb-pivot-plate','under-plate thrust collar',(0,0,-.0226),.006,.001,'ink','Z',rotor)
        lever=box('pb-pivot-plate','short direct finger arm',(-side*.019,0,-.026),(.038,.012,.005),'orange',rotor)
        # Local blade points +x on left, -x on right; short arm points outward.
        lever.location.x=side*.019
        cyl('pb-pivot-plate','finger button',(side*.043,0,-.027),.009,.010,'orange','Z',rotor)
        box('pb-pivot-plate','finger button neck',(side*.039,0,-.026),(.014,.012,.005),'orange',rotor)
        points=[(0,-.009),(-side*.105,-.007),(-side*.112,0),(-side*.105,.007),(0,.009)]
        blade=add('pb-flipper-blades',_xy('long rounded marble paddle',points,.006,.010,'orange'),rotor);bore(blade,(0,0,.006),.00415,.030)
        # Key provides torque transfer instead of relying on an unmodelled round friction fit.
        box('pb-pivot-plate','pivot drive key',(-side*.004,0,.007),(.004,.003,.010),'ink',rotor)
        _cut(blade,S.box('keyed blade socket',(-side*.004,0,.007),(.0043,.0033,.020),'ink'))
        for q in (0,1):
            ang=(d.flipper_min+(d.flipper_max-d.flipper_min)*q)*sign
            ex=side*math.cos(ang);ey=side*math.sin(ang);nx=-ey;ny=ex
            direction=(-1 if q==0 else 1)*sign
            c=(x+.026*ex+direction*.009*nx,d.flipper_y+.026*ey+direction*.009*ny,-.026)
            stops.append(cyl('pb-pivot-plate','physical flipper travel stop',c,.003,.012,'ink'))
        fixed=(x+side*.010,d.flipper_y+.046,-.026)
        cyl('pb-pivot-plate','fixed return-loop anchor',fixed,.002,.010,'ink')
        cyl('pb-pivot-plate','moving return-loop anchor',(side*.026,0,-.030),.002,.006,'ink','Z',rotor)
        bands.append((line('pb-pivot-plate','soft return loop',[fixed,fixed],.001,'orange'),fixed,side,rotor))
    # Arches attach by integral pegs into the prepared board. All clear the 22 mm ball.
    targets=[]
    for i,(x,y) in enumerate([(-.060,-.015),(.040,.100),(-.045,.218)]):
        for xx in (x-.027,x+.027):
            box('pb-targets','arch upright',(xx,y,.022),(.006,.009,.044),'teal')
            cyl('pb-targets','arch integral foot',(xx,y,-.004),.0025,.008,'teal')
            bore(board,(xx,y,-.005),.0027,.016)
        box('pb-targets','arch crossbar',(x,y,.045),(.060,.009,.006),'teal')
        for j in range(i+1):cyl('pb-targets','arch shot marking',(x+(j-i/2)*.008,y-.005,.046),.0025,.001,'orange','Y')
        targets.append((x,y))
    # Edge scoreboard rail and manually indexed wheel, factory supplied as part of targets.
    box('pb-targets','score edge rail',(-.187,.08,.042),(.010,.105,.014),'birch')
    for y in (.04,.12):
        clip=box('pb-targets','score rail captive clip',(-.185,y,.029),(.014,.012,.020),'teal')
        _cut(clip,S.box('rail clip open receiving channel',(-.185,y,.023),(.0084,.014,.014),'ink'))
        for side in (-1,1):
            box('pb-targets','score clip spring retaining toe',(-.185+side*.0042,y,.0215),(.0016,.012,.002),'teal')
            _cut(left_rail,S.box('prepared score clip retaining groove',(-.185+side*.0037,y,.0215),(.0014,.0123,.0023),'ink'))
    tower=box('pb-targets','score axle bearing tower',(-.1875,.08,.057),(.011,.014,.032),'teal')
    bore(tower,(-.1875,.08,.062),.0022,.025,'X')
    score=cyl('pb-targets','manual numbered score wheel',(-.202,.08,.062),.024,.008,'orange','X')
    bore(score,(-.202,.08,.062),.0022,.030,'X')
    cyl('pb-targets','score wheel retained axle',(-.195,.08,.062),.002,.030,'ink','X')
    for x in (-.207,-.197):cyl('pb-targets','score wheel retaining collar',(x,.08,.062),.0035,.002,'ink','X')
    for x in (-.194,-.181):cyl('pb-targets','score axle captive shoulder',(x,.08,.062),.0035,.002,'ink','X')
    for i in range(10):
        t=2*math.pi*i/10;line('pb-targets','score index mark',[(-.2065,.08+.017*math.cos(t),.062+.017*math.sin(t)),(-.2065,.08+.022*math.cos(t),.062+.022*math.sin(t))],.0006,'ink')
        cu=bpy.data.curves.new('score number','FONT');cu.body=str(i);cu.size=.006;cu.align_x='CENTER';cu.align_y='CENTER'
        tx=bpy.data.objects.new('actual score numeral '+str(i),cu);bpy.context.collection.objects.link(tx);cu.materials.append(S.material('ink'));tx.location=(-.2065,.08+.013*math.cos(t),.062+.013*math.sin(t));tx.rotation_euler=(math.pi/2,0,-math.pi/2);add('pb-targets',tx)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=16,radius=d.marble_radius,location=(0,-.327,-.0145))
    marble=add('pb-marble',S.finish(bpy.context.object,'large game marble','orange'))
    for x in (-.204,.204):
        for y in (-.22,.22):
            tab=box('pb-tray','prepared bench-clamp side tab',(x,y,-.005),(.032,.030,.010),'birch')
            tab['attachment']='Factory-bonded 2 mm overlap with plywood edge; clamp grip remains outside rail footprint'
    # Prepared clips are temporary apparatus, explicitly removed from finished toy.
    jig=S.empty('temporary bench mounting apparatus');jig.parent=a.root;props['bench-clips']=[]
    for x in (-.230,.230):
        for y in (-.22,.22):
            ob=S.box('bench clamp foot',(x,y,.010),(.040,.045,.020),'ink');ob.parent=jig;ob['part_id']='pb-tray';props['bench-clips'].append(ob)
            ob=S.cylinder('bench clamp upright',(x,y,.078),.003,.136,'ink','Z');ob.parent=jig;ob['part_id']='pb-tray';props['bench-clips'].append(ob)
    for x in (-.230,.230):
        for y in (-.22,.22):
            for z in (-.012,.002):
                ob=S.box('bench clamp swivel pad',(math.copysign(.213,x),y,z),(.024,.018,.004),'ink');ob.parent=table;ob['part_id']='pb-tray';props['bench-clips'].append(ob)
            ob=S.box('bench clamp outer jaw',(x,y,-.005),(.006,.018,.018),'teal');ob.parent=table;ob['part_id']='pb-tray';props['bench-clips'].append(ob)
    from hand_tools import build_model as tool_model
    tool=tool_model('work-screwdriver');tool['root'].parent=a.root;tool['root'].location=(.29,-.28,0)
    for part,obs in tool['parts'].items():a.parts.setdefault(part,[]).extend(obs)
    model=a.result(service_parts=(rear,handle),wedge_clips=wedge_clips,stop_hardware=(block,screw,head,nut,guide),tool=tool,compound_view=dict(VIEW),table=table,board=board,pull=pull,stop=stop,spring=spring,flippers=flips,bands=bands,marble=marble,
                   wedge=wedge,shim=shim,jig=jig,props=props,bore_checks=holes,view=dict(VIEW),dimensions=d,rigid=rigid,targets=targets)
    # Three broad members make one supplied U-shaped wedge. Its original
    # slight crossfall has an actual flat bench-facing base; adding the shim
    # lifts the left corner about the right-hand support line.
    wedge_members=[(wedge,(-.185,.185,.240,.285))]
    for side in (-1,1):
        ob=box('pb-wedge','wedge side support',(0,0,0),(.01,.01,.01),'birch')
        wedge_members.append((ob,(side*.175-.010,side*.175+.010,-.285,.240)))
    base_z=.074+.300*math.sin(d.slope)
    for ob,(xmin,xmax,ymin,ymax) in wedge_members:
        vs=[]
        for zside in (0,1):
            for x,y in [(xmin,ymin),(xmax,ymin),(xmax,ymax),(xmin,ymax)]:
                z=-.010 if zside else (math.sin(d.crossfall)*x-math.cos(d.crossfall)*math.sin(d.slope)*y-base_z)/(math.cos(d.crossfall)*math.cos(d.slope))
                vs.append((x,y,z))
        ob.data.clear_geometry();ob.data.from_pydata(vs,[],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]);ob.data.update();_normals(ob);ob.location=(0,0,0)
    for ob,rect in wedge_members[1:]:
        _cut(ob,S.box('finger-button access window',((rect[0]+rect[1])/2,-.160,-.026),(.045,.170,.028),'ink'))
        _cut(ob,S.box('carrying-handle receiving clearance',((rect[0]+rect[1])/2,0,-.033),(.045,.142,.050),'ink'))
    # Supplied shim clip has a retaining lip and a real recess in the wedge side.
    box('pb-shim','shim clip retaining lip',(-.184,-.260,.020),(.008,.028,.002),'teal',a.root)
    level_z=base_z/math.cos(d.crossfall)-.185*math.tan(d.crossfall)
    yy,zz=-.260,.020-level_z
    cutter=S.box('prepared shim-clip recess',(-.183,math.cos(d.slope)*yy+math.sin(d.slope)*zz,-math.sin(d.slope)*yy+math.cos(d.slope)*zz),(.008,.030,.004),'ink');cutter.rotation_euler.x=-d.slope
    _cut(wedge_members[1][0],cutter)
    model['wedge_members']=[ob for ob,rect in wedge_members]
    # The shim has a flat underside and a tapered top matching the lifted wedge.
    shim.parent=a.root;shim.location=(0,0,0);vs=[]
    for top in (0,1):
        for x,y in [(-.189,-.286),(-.161,-.286),(-.161,-.231),(-.189,-.231)]:
            vs.append((x,y,(-.185*math.tan(d.crossfall)+math.tan(d.crossfall)*x) if top else 0))
    shim.data.clear_geometry();shim.data.from_pydata(vs,[],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]);shim.data.update();_normals(shim)
    # All temporary fixtures retain their supplied tray identity in the parts map.
    for obs in props.values():a.parts['pb-tray'].extend(obs)
    model['rigid']=[o for os in a.parts.values() for o in os if o.type=='MESH']
    set_state(model,'pinball-table');return model


def apply_pose(model,pull=0,flippers=(0,0),long=False):
    from mathutils import Vector
    import bpy
    d=model['dimensions'];p=solve_pose(pull,flippers,long,d)
    model['pull'].location.y=-pull;model['stop'].location.y=-p['limit']
    points=[]
    for i in range(401):
        t=2*math.pi*10*i/400;points.append((d.launcher_x+.0055*math.cos(t),-.2804+(p['spring_length']-.0012)*i/400,d.launcher_z+.0055*math.sin(t)))
    curve=model['spring'].data;curve.splines.clear();sp=curve.splines.new('POLY');sp.points.add(len(points)-1)
    for co,pt in zip(points,sp.points):pt.co=(*co,1)
    for rotor,angle in zip(model['flippers'],p['angles']):rotor.rotation_euler.z=angle
    for ob,fixed,side,rotor in model['bands']:
        angle=rotor.rotation_euler.z;moving=(rotor.location.x+side*.026*math.cos(angle),rotor.location.y+side*.026*math.sin(angle),-.030)
        dx,dy=moving[0]-fixed[0],moving[1]-fixed[1];l=math.hypot(dx,dy);ux,uy=dx/l,dy/l;nx,ny=-uy,ux;r=.003
        # Semicircular ends wrap outside each 2 mm anchor; the 1 mm elastic
        # cord touches the pin rather than crossing through its centre.
        pts=[(fixed[0]+r*nx,fixed[1]+r*ny,fixed[2])]
        for i in range(21):
            t=math.pi*i/20;pts.append((moving[0]+r*(nx*math.cos(t)+ux*math.sin(t)),moving[1]+r*(ny*math.cos(t)+uy*math.sin(t)),moving[2]))
        for i in range(21):
            t=math.pi*i/20;pts.append((fixed[0]-r*(nx*math.cos(t)+ux*math.sin(t)),fixed[1]-r*(ny*math.cos(t)+uy*math.sin(t)),fixed[2]))
        sp=ob.data.splines[0];sp.points.add(max(0,len(pts)-len(sp.points)))
        for co,pt in zip(pts,sp.points):pt.co=(*co,1)
    bpy.context.view_layer.update();return p


def marble_support_height(model,x,y):
    """Seat the finite-radius marble against the actual immutable tray mesh."""
    from mathutils import Vector
    from mathutils.bvhtree import BVHTree
    if 'marble_support_tree' not in model:
        board=model['board'];mesh=board.data
        model['marble_support_tree']=BVHTree.FromPolygons([board.matrix_local@v.co for v in mesh.vertices],[tuple(f.vertices) for f in mesh.polygons])
    low=.006;high=.014;tree=model['marble_support_tree']
    for _ in range(23):
        middle=(low+high)/2
        if tree.find_nearest(Vector((x,y,middle)))[3]<model['dimensions'].marble_radius:low=middle
        else:high=middle
    return high


def set_state(model,item_id,service_open=False,**pose):
    from construction import set_visible_parts
    import bpy
    if item_id not in STATES and item_id not in SUPPLIES and item_id!='work-screwdriver':raise ValueError('Unsupported pinball identity '+item_id)
    ids=STATES.get(item_id,[item_id]);set_visible_parts(model,ids)
    assembled='pb-tray' in ids;sloped='pb-wedge' in ids;level='pb-shim' in ids
    d=model['dimensions'];model['table'].rotation_euler=(d.slope if sloped else 0,d.crossfall if sloped and not level else 0,0)
    base_z=.074+.300*math.sin(d.slope)
    model['table'].location.z=(base_z/math.cos(d.crossfall)-.185*math.tan(d.crossfall) if level else base_z) if sloped else .074
    for os in model['props'].values():
        for ob in os:ob.hide_render=not (assembled and item_id!='pinball-table');ob.hide_set(ob.hide_render)
    show_ball=item_id in {'pb-marble','pb-deadspot','pb-return-table','pb-short-launch','pinball-table'}
    model['marble'].hide_render=not show_ball;model['marble'].hide_set(not show_ball)
    if item_id=='pb-deadspot':model['marble'].location=(-.1366,-.207,marble_support_height(model,-.1366,-.207))
    elif item_id=='pb-short-launch':model['marble'].location=(.07,-.075,d.marble_radius)
    else:model['marble'].location=(0,-.327,-.0145)
    rear,handle=model['service_parts'];rear.location.y=-.398 if service_open else -.283;handle.location.y=-.425 if service_open else -.348
    rear['attachment']='Removable factory threaded rear bearing cap; opened with pull handle removed to slide spring over rod; closed for all operating states'
    handle['attachment']='Removable captive-clamp handle on plunger rod; refitted for operation'
    long=item_id in {'pb-tuned','pinball-table'}
    apply_pose(model,long=long,**pose);model['tool']['root'].location=(0,0,0) if item_id=='work-screwdriver' else (.29,-.28,0);model['view']=dict(model['tool']['view'] if item_id=='work-screwdriver' else VIEW);model['state']=item_id
    bpy.context.view_layer.update();return model

if __name__=='__main__':
    import json
    print(json.dumps(check_motion(),indent=2))
