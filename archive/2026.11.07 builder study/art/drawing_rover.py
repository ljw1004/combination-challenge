"""Canonical radio drawing rover. Metres, +x forward, +z up.

Two original factory-enclosed gearmotor modules drive independent retained
wheels. Five separately accessible underside mounts support any installation
order. Compound overlays use a direct underside orthographic camera and the
same unshifted geometry/canvas. Motor interiors and electrical performance are
not simulated. Pen lift is an eccentric cam against a guided rigid follower.
"""
from dataclasses import dataclass,asdict
import math

@dataclass(frozen=True)
class Dimensions:
    deck_length: float=.220
    deck_width: float=.180
    deck_thickness: float=.008
    deck_bottom: float=.052
    wheel_radius: float=.035
    wheel_width: float=.016
    wheel_track: float=.210
    axle_x: float=-.035
    caster_x: float=.080
    caster_radius: float=.012
    pen_lift: float=.008
    cam_radius: float=.010
    cam_eccentric: float=.004
    jig_clearance: float=.018
DIMS=Dimensions()
PEN_MAX=math.pi+.12
VIEW={'location':(.45,-.56,.52),'target':(0,0,.045),'scale':.36}
COMPOUND_VIEW={'location':(0,0,1.2),'target':(0,0,.080),'scale':.300}
VIEWS={'assembly':VIEW,'compound':COMPOUND_VIEW,
       'side':{'location':(.0,-.7,.08),'target':(0,0,.060),'scale':.30},
       'pen':{'location':(.20,-.32,.25),'target':(-.025,0,.070),'scale':.19},
       'drawing':{'location':(.58,-.75,.85),'target':(.025,-.045,.035),'scale':.79}}
SLOTS=('rover-caster','rover-drive-pair','rover-pack','rover-switch','rover-radio')
SUPPLIES=('rover-deck','rover-caster','rover-gearmotors','rover-wheels','rover-pack','rover-switch','rover-radio','rover-covers','rover-remote','rover-remote-cells','rover-pen','rover-pen-clip','rover-paper')
MACHINE=['rover-deck','rover-caster','rover-gearmotors','rover-wheels','rover-pack','rover-switch','rover-radio','rover-covers']
STATES={'rover-drive-pair':['rover-gearmotors','rover-wheels'],
        'guarded-rover':MACHINE,'rover-tested':MACHINE,
        'rover-powered-remote':['rover-remote','rover-remote-cells'],
        'rover-pen-mount':['rover-pen','rover-pen-clip'],
        'rover-pen-deck':MACHINE+['rover-pen','rover-pen-clip']}
for _id in ('rover-looping','rover-trimmed','drawing-rover'):STATES[_id]=STATES['rover-pen-deck']+['rover-paper']
# Each convex footprint includes its parked connector and captive mount heads.
SLOT_FOOTPRINTS={'rover-caster':(.061,.099,-.020,.020),
                 'rover-drive-pair':(-.070,.003,-.119,.119),
                 'rover-pack':(-.002,.058,-.071,-.017),
                 'rover-switch':(-.099,-.062,-.023,.023),
                 'rover-radio':(-.0035,.052,.014,.066)}


def solve_pen(angle=0,d=DIMS):
    if not 0<=angle<=PEN_MAX:raise ValueError('Pen lever stops bound angle to 0..pi+0.12; raised stop is over centre')
    lift=d.cam_eccentric*(1-math.cos(angle))
    return {'angle':angle,'lift':lift,'cam_center':(-.015-d.cam_eccentric*math.sin(angle),0,.075-d.cam_eccentric*math.cos(angle)),
            'follower_bottom':.081+lift,'pen_tip':lift}


def integrate_drive(commands,d=DIMS):
    """Exact constant-wheel-speed arcs. Commands are left/right radians, pen down.

    Trace coordinates describe the pen at the wheel-axle midpoint. A pen-up
    command moves the chassis but creates no stroke; it never joins two drawings.
    """
    x,y,yaw=d.axle_x,0.,0.;left=right=0.;strokes=[];stroke=[];poses=[]
    for dl,dr,down in commands:
        distance=d.wheel_radius*(dl+dr)/2;turn=d.wheel_radius*(dr-dl)/d.wheel_track
        n=max(2,int(abs(distance)/.003)+int(abs(turn)/.03))
        start=(x,y,yaw)
        if not down and stroke:strokes.append(stroke);stroke=[]
        for i in range(n+1):
            t=i/n
            if abs(turn)<1e-10:xx=x+distance*t*math.cos(yaw);yy=y+distance*t*math.sin(yaw)
            else:
                radius=distance/turn;xx=x+radius*(math.sin(yaw+t*turn)-math.sin(yaw));yy=y-radius*(math.cos(yaw+t*turn)-math.cos(yaw))
            if down:stroke.append((xx,yy,.00065))
            poses.append((xx,yy,yaw+t*turn,left+dl*t,right+dr*t,down))
        x,y,yaw=poses[-1][:3];left+=dl;right+=dr
    if stroke:strokes.append(stroke)
    return {'axle':(x,y),'yaw':yaw,'wheel_angles':(left,right),'strokes':strokes,'poses':poses}

def drawing_commands(stage='drawing-rover'):
    # An original whale outline. Every segment is realised by wheel turns and
    # translations; pen-up repositioning is represented by actual separate moves.
    outline=[(-.035,0),(-.080,.050),(-.160,.030),(-.120,.100),(-.160,.170),(-.070,.140),(.050,.160),(.160,.130),(.205,.070),(.180,.015),(.090,-.015),(-.035,0)]
    commands=[(3.4,3.8,True)]
    if stage=='rover-looping':return commands
    initial=integrate_drive(commands);x,y=initial['axle'];yaw=initial['yaw']
    paths=[([(-.150,-.095)],False),([(.050,-.095)],True)]
    if stage!='rover-trimmed':paths += [([outline[0]],False),(outline,True),([(-.035,0),(.150,.075)],False),
           ([(.150+.005*math.sin(t),.080-.005*math.cos(t)) for t in [i*2*math.pi/48 for i in range(49)]],True),
           ([(.150,.075),(.240,-.180)],False)]
    for path,down in paths:
        for xx,yy in path:
            dx,dy=xx-x,yy-y;dist=math.hypot(dx,dy)
            if dist<1e-9:continue
            target=math.atan2(dy,dx);turn=(target-yaw+math.pi)%(2*math.pi)-math.pi
            delta=turn*DIMS.wheel_track/(2*DIMS.wheel_radius)
            if abs(delta)>1e-9:commands.append((-delta,delta,down))
            commands.append((dist/DIMS.wheel_radius,dist/DIMS.wheel_radius,down));x,y,yaw=xx,yy,target
    return commands

DRAW_COMMANDS=drawing_commands()

def check_motion(samples=181,d=DIMS):
    ps=[solve_pen(PEN_MAX*i/(samples-1),d) for i in range(samples)]
    path=integrate_drive(DRAW_COMMANDS,d)
    return {'dimensions':asdict(d),'samples':samples,'wheel_ground_error_m':d.wheel_radius-d.wheel_radius,
            'caster_ground_error_m':d.caster_radius-d.caster_radius,'raised_pen_clearance_m':ps[-1]['pen_tip'],'peak_lift_m':d.pen_lift,
            'cam_follower_contact_error_m':max(abs(p['cam_center'][2]+d.cam_radius-p['follower_bottom']) for p in ps),
            'pen_bore_radial_clearance_m':.0047-.004,'wheel_guard_axial_gap_m':.001,
            'test_stop_wheel_ground_clearance_m':d.jig_clearance,'shaft_bearing_radial_clearance_m':.0002,
            'trace_strokes':len(path['strokes']),'pen_up_commands_create_trace':False,
            'compound_slots':list(SLOTS),'slot_masks':32,
            'limits':['Prescribed no-slip wheel kinematics; motor torque, traction, battery/driver compatibility and radio operation unmeasured.',
                      'Pen motion solves ideal frictionless cam contact; spring pressure, writing friction and ink not simulated.',
                      'Factory gearbox interiors are enclosed purchased modules, not fabricated during the story.',
                      'Independent slot geometry and masks are checked; no physical durability certification.']}


def _normals(obj):
    import bmesh
    bm=bmesh.new();bm.from_mesh(obj.data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(obj.data);bm.free();return obj


def _cut(obj,cutter):
    import bpy
    # Preserve the inward normals of existing closed cavities between cuts.
    # Recalculating disconnected cavity shells here fills the caster cup again.
    cutter.parent=obj.parent;_normals(cutter);bpy.context.view_layer.objects.active=obj
    m=obj.modifiers.new('actual receiving opening','BOOLEAN');m.operation='DIFFERENCE';m.object=cutter
    bpy.ops.object.modifier_apply(modifier=m.name);bpy.data.objects.remove(cutter,do_unlink=True)


def wire_length(points):
    return sum(math.dist(a,b) for a,b in zip(points,points[1:]))


def parked_coil(before,center,after,length,pitch=.002):
    """Store the actual connected lead length in one separated helical turn.

    Solve the radius against the same polyline arc length used by Blender;
    the vertical pitch keeps the beginning/end and outgoing tails apart.
    """
    def path(radius):
        return [*before,*[(center[0]+radius*math.cos(-2*math.pi*i/128),
                          center[1]+radius*math.sin(-2*math.pi*i/128),
                          center[2]-pitch*i/128) for i in range(129)],*after]
    lo,hi=.002,.015
    if not wire_length(path(lo))<=length<=wire_length(path(hi)):
        raise ValueError('Lead length cannot be stored in the allotted coil envelope')
    for _ in range(48):
        mid=(lo+hi)/2
        if wire_length(path(mid))<length:lo=mid
        else:hi=mid
    return path((lo+hi)/2)


def build_model(d=DIMS):
    import bpy
    import scene_parts as S
    from construction import Assembly,special_material,surface
    a=Assembly('canonical drawing rover');vehicle=S.empty('rigid rover chassis');vehicle.parent=a.root
    holes=[];factory=[];props={};wires=[];wheel_groups=[];mount_points={};mount_interfaces=[];guard_parts=[];cable_exits=[];guard_snap_fingers=[]
    def add(part,obj,parent=vehicle):return a.add(part,obj,parent)
    def box(part,name,c,s,col='birch',parent=vehicle):return add(part,S.box(name,c,s,col),parent)
    def cyl(part,name,c,r,l,col='ink',axis='Z',parent=vehicle):return add(part,S.cylinder(name,c,r,l,col,axis),parent)
    def line(part,name,p,r=.0007,col='ink',parent=vehicle):return add(part,S.stroke(name,p,r,col),parent)
    def bore(ob,c,r,l,axis='Z'):
        _cut(ob,S.cylinder('temporary bore',c,r,l,'ink',axis));holes.append((ob,c,axis,l))
    def ball(part,name,c,r,col,parent=vehicle):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=40,ring_count=20,radius=r,location=c);return add(part,S.finish(bpy.context.object,name,col),parent)
    deck=box('rover-deck','birch rover deck',(0,0,.056),(.220,.180,.008))
    # Real pen and trim access holes; switch has a rectangular receiving opening.
    bore(deck,(d.axle_x,0,.056),.0047,.025);bore(deck,(.034,.040,.056),.004,.025)
    _cut(deck,S.box('switch lever aperture',(-.080,0,.056),(.020,.010,.025),'ink'))
    def mount(part,name,x,y,foot):
        bore(deck,(x,y,.056),.0018,.025);bore(foot,(x,y,.051),.0018,.025)
        cyl(part,name+' captive mounting screw',(x,y,.052),.0015,.018)
        cyl(part,name+' retained screw head',(x,y,.061),.003,.002)
        bottom=foot.location.z+min(v.co.z for v in foot.data.vertices)
        cyl(part,name+' captive nut',(x,y,bottom-.0015),.003,.003)
        mount_points.setdefault(part,[]).append((x,y,.052));mount_interfaces.append((foot,deck,(x+.004,y,.052)))
    # Two closed gearmotor exteriors, with factory joint faces and actual shaft bearings.
    for side in (-1,1):
        y=side*.060
        gearbox=box('rover-gearmotors','factory sealed reduction gearbox',(d.axle_x,y,.035),(.048,.032,.028),'teal')
        seam=box('rover-gearmotors','gearcase gasket seam',(d.axle_x,y,.035),(.0484,.0008,.0284),'ink')
        # Motor can is a vertical inset cylinder enclosed by gearbox shell, visibly closed.
        motor=cyl('rover-gearmotors','factory motor end cap',(d.axle_x-.009,y,.020),.010,.004,'ink')
        foot=box('rover-gearmotors','integral motor mounting flange',(d.axle_x-.001,y,.0505),(.060,.056,.003),'teal')
        for yy in (side*.037,side*.083):mount('rover-gearmotors','motor mount',d.axle_x,yy,foot)
        bore(gearbox,(d.axle_x,side*.076,.035),.0032,.050,'Y')
        holes[-1]=(gearbox,(d.axle_x,side*.076,.035),'Y',.040) # socket reach, excluding its blind end wall
        rotor=add('rover-gearmotors',S.empty('left wheel axle' if side<0 else 'right wheel axle'));rotor.location=(d.axle_x,0,.035);wheel_groups.append(rotor)
        shaft=cyl('rover-gearmotors','D-flat output shaft',(0,side*.092,0),.003,.040,'ink','Y',rotor)
        _cut(shaft,S.box('D flat tool',(.0031,side*.092,0),(.002,.050,.010),'ink'))
        bore(shaft,(0,side*.110,0),.0012,.018,'Y')
        holes[-1]=(shaft,(0,side*.113,0),'Y',.010) # open threaded reach, excluding blind end
        for yy in (side*.074,side*.080):
            collar=cyl('rover-gearmotors','factory output bearing collar',(d.axle_x,yy,.035),.005,.002,'ink','Y');bore(collar,(d.axle_x,yy,.035),.0032,.012,'Y')
        wheel=cyl('rover-wheels','rubber drive tyre',(0,side*.105,0),d.wheel_radius,d.wheel_width,'ink','Y',rotor)
        hub=cyl('rover-wheels','wheel keyed hub',(0,side*.105,0),.015,.019,'orange','Y',rotor)
        cutter=S.cylinder('D keyed bore',(0,side*.105,0),.0032,.040,'ink','Y');_cut(cutter,S.box('D bore flat',(.0033,side*.105,0),(.002,.045,.012),'ink'))
        for target in (wheel,hub):
            duplicate=cutter.copy();duplicate.data=cutter.data.copy();bpy.context.collection.objects.link(duplicate);_cut(target,duplicate)
        bpy.data.objects.remove(cutter,do_unlink=True)
        cyl('rover-wheels','wheel retaining screw',(0,side*.110,0),.001,.012,'ink','Y',rotor)
        cyl('rover-wheels','wheel retaining head',(0,side*.116,0),.004,.002,'teal','Y',rotor)
        add('rover-wheels',S.annulus('wheel retaining washer',(0,side*.11475,0),.004,.0012,.0005,'ink'),rotor)
        for j in range(8):
            ang=2*math.pi*j/8
            spoke=box('rover-wheels','wheel hub spoke',(.022*math.cos(ang),side*.114,.022*math.sin(ang)),(.016,.0015,.004),'orange',rotor);spoke.rotation_euler.y=-ang
        # Supplying a complete wire/plug at each gearbox is explicit; parked until guarded.
        exit_y=y+side*.006;start=(-.011,exit_y,.034)
        socket_y=.025 if side<0 else .052;turn_y=.016 if side<0 else .020
        # Leave the guard first, then approach the exposed plug back along
        # the socket's x axis. A diagonal through its sleeve wall cannot fit.
        route_z=.043 if side<0 else .047
        connected=[start,(-.003,exit_y,.034),(-.003,exit_y,route_z),(-.003,turn_y,route_z),
                   (-.00475,turn_y,route_z),(-.00475,socket_y,route_z),
                   (-.00475,socket_y,.041),(-.001,socket_y,.041)]
        park=parked_coil([start,(-.009,exit_y,.034),(-.008,exit_y,.014)],(-.029,exit_y,.014),
                         [(-.0085,exit_y,.010),(-.0085,side*.035,.024)],wire_length(connected),pitch=.0018)
        w=line('rover-gearmotors','motor lead',park,.0007,'orange');plug=box('rover-gearmotors','keyed motor lead plug',park[-1],(.006,.005,.004),'ink');wires.append((w,plug,park,connected))
        # Protective shell has real hollow cavity, shaft throat and captive clip pegs.
        cover=box('rover-covers','removable gear guard shell',(d.axle_x,y,.0345),(.058,.044,.035),'paper')
        _cut(cover,S.box('guard internal cavity',(d.axle_x,y,.037),(.0544,.0404,.038),'ink'))
        _cut(cover,S.box('guard open flange seat',(d.axle_x,y,.053),(.064,.058,.0082),'ink'))
        bore(cover,(-.0069,exit_y,.034),.0026,.010,'X')
        # The guard is fitted after the leads are connected. An open-top
        # channel and split grommet admit the wire without unplugging it.
        _cut(cover,S.box('guard cable installation channel',(-.0069,exit_y,.043),(.004,.0024,.018),'ink'))
        grommet=add('rover-covers',S.annulus('guard cable exit grommet',(0,0,0),.0026,.0011,.0018,'ink'))
        grommet.rotation_euler.z=math.pi/2;grommet.location=(-.0069,exit_y,.034)
        _cut(grommet,S.box('grommet open installation slit',(-.0069,exit_y,.037),(.004,.0016,.006),'ink'))
        grommet['attachment']='Factory-bonded split soft grommet; cable enters through its upper slit while the cover is raised into place'
        cable_exits.append((w,cover,grommet))
        for yy in (side*.037,side*.083):_cut(cover,S.cylinder('guard mounting-nut access',(d.axle_x,yy,.048),.0032,.016,'ink','Z'))
        bore(cover,(d.axle_x,side*.082,.035),.0052,.060,'Y')
        # The wheels and their shafts are already fitted when the guards
        # rise from below. Open both sidewalls above the collar-sized bore;
        # a closed circular hole would obstruct that installation route.
        _cut(cover,S.box('open upper shaft and collar installation path',(d.axle_x,y,.050),(.0104,.060,.030),'ink'))
        throat=add('rover-covers',S.annulus('stationary shaft guard throat',(d.axle_x,side*.08825,.035),.006,.0035,.0125,'paper'))
        _cut(throat,S.box('open upper shaft throat',(d.axle_x,side*.08825,.043),(.007,.016,.016),'ink'))
        throat['installation']='Open upper U throat rises around the retained wheel shaft; sealed gearbox stays covered below and on both sides'
        for x in (-.063,-.0085):
            cyl('rover-covers','guard captive snap pin root',(x,y,.047),.0012,.004,'orange')
            # A real central split lets the two flexible fingers bend inward;
            # tapered tips compress on entry and square shoulders retain them.
            for sign in (-1,1):
                profile=[(.0005,.0488),(.0012,.0488),(.0012,.0522),(.0017,.0522),(.0017,.0526),(.0012,.0532),(.0005,.0532)]
                finger=add('rover-covers',S.profile('split flexible guard snap finger',[(x+sign*xx,z) for xx,z in profile],.001,y,'orange','orange'))
                _normals(finger);finger['elastic_part']=True
                guard_snap_fingers.append((finger,sign,tuple(v.co.copy() for v in finger.data.vertices)))
            bore(foot,(x,y,.0505),.0014,.012)
            _cut(deck,S.cylinder('prepared snap head recess',(x,y,.0535),.0019,.003,'ink','Z'))
        guard_parts.extend([cover,throat]);factory.extend([(foot,gearbox),(gearbox,motor)])
    # Free ball caster, retained by a hollow lower lip; no steering kingpin needed.
    caster_ball=ball('rover-caster','freely rolling caster ball',(.080,0,.012),.012,'orange')
    housing=ball('rover-caster','caster ball retaining cup',(.080,0,.012),.015,'teal')
    cutter=ball('rover-caster','temporary caster cavity',(.080,0,.012),.0125,'ink');a.parts['rover-caster'].remove(cutter);_cut(housing,cutter)
    _cut(housing,S.box('open caster underside',(.080,0,-.012),(.060,.060,.038),'ink'))
    # opening plane z7 mm; ball remains positively retained above an 11.8 mm bore.
    ring=add('rover-caster',S.annulus('caster retaining lip',(0,0,0),.014,.0118,.002,'teal'));ring.rotation_euler.x=math.pi/2;ring.location=(.080,0,.008)
    cyl('rover-caster','factory caster neck',(.080,0,.038),.007,.026,'teal')
    foot=box('rover-caster','caster mounting flange',(.080,0,.0505),(.036,.036,.003),'teal')
    for y in (-.013,.013):mount('rover-caster','caster mount',.080,y,foot)
    # Battery and receiver mount by captive screws, not by floating labels.
    pack=box('rover-pack','closed low-voltage battery holder',(.028,-.044,.036),(.054,.036,.024),'teal')
    lid=box('rover-pack','battery holder captive hatch',(.028,-.044,.0235),(.049,.032,.001),'ink')
    foot=box('rover-pack','battery holder mount flange',(.028,-.044,.050),(.060,.054,.004),'teal')
    for y in (-.067,-.021):mount('rover-pack','battery mount',.028,y,foot)
    start=(.028,-.026,.040);connected=[start,(.028,-.024,.040),(.034,-.024,.040),(.034,-.012,.046),(-.011,-.012,.046),(-.066,-.006,.042)]
    park=parked_coil([start,(.028,-.024,.040),(.034,-.024,.020)],(.028,-.044,.020),[(.048,-.044,.018),(.048,-.024,.018),(.048,-.022,.032)],wire_length(connected))
    w=line('rover-pack','battery keyed supply lead',park,.0008,'orange');plug=box('rover-pack','battery keyed plug',park[-1],(.006,.005,.004),'ink');wires.append((w,plug,park,connected))
    switch=box('rover-switch','closed fused off-switch harness',(-.080,0,.041),(.030,.027,.016),'orange')
    _cut(switch,S.box('keyed battery socket',(-.066,-.006,.042),(.008,.0054,.0044),'ink'))
    foot=box('rover-switch','switch mounting flange',(-.080,0,.0505),(.036,.046,.003),'orange')
    for y in (-.019,.019):mount('rover-switch','switch mount',-.080,y,foot)
    switch_handle=box('rover-switch','top-accessible off switch',(-.084,0,.059),(.009,.007,.012),'ink')
    cyl('rover-switch','sealed fuse inspection plug',(-.080,0,.032),.004,.002,'ink')
    start=(-.065,0,.041);connected=[start,(-.063,0,.041),(-.055,.010,.045),(-.011,.010,.047),(-.008,.034,.047),(-.006,.034,.041),(-.002,.034,.041)]
    # Store the rotated loose plug below the case, with room for its full
    # rigid body; the coil radius absorbs the tail change at equal length.
    park=parked_coil([start,(-.063,0,.041),(-.063,0,.0285)],(-.080,0,.0285),[(-.063,0,.0265),(-.065,.012,.0295)],wire_length(connected))
    w=line('rover-switch','fused receiver supply lead',park,.0008,'ink');plug=box('rover-switch','receiver supply keyed plug',park[-1],(.006,.005,.004),'orange');wires.append((w,plug,park,connected))
    radio=box('rover-radio','closed radio receiver and dual motor driver',(.024,.040,.039),(.048,.034,.018),'teal')
    foot=box('rover-radio','receiver mounting flange',(.024,.040,.050),(.054,.052,.004),'teal')
    for y in (.019,.061):mount('rover-radio','receiver mount',.024,y,foot)
    bore(foot,(.034,.040,.050),.0038,.012)
    # Actual top access through the deck to a recessed slotted trim screw.
    cyl('rover-radio','recessed trim well',(.034,.040,.049),.0037,.004,'ink')
    trim=cyl('rover-radio','speed trim screw',(.034,.040,.0513),.0032,.001,'orange')
    _cut(trim,S.box('trim screwdriver slot',(.034,.040,.0518),(.0052,.0014,.0012),'ink'))
    line('rover-radio','factory insulated antenna',[(.045,.054,.035),(.050,.060,.035),(.050,.060,.049)],.0006,'ink')
    for c in [(-.0005,.025,.041),(-.0005,.034,.041),(-.0005,.052,.041)]:
        socket=box('rover-radio','keyed receiver socket',c,(.006,.007,.006),'ink')
        _cut(socket,S.box('open keyed socket sleeve',c,(.010,.0054,.0044),'ink'))
        _cut(radio,S.box('receiver plug recess',(.0005,c[1],c[2]),(.005,.0054,.0044),'ink'))
    # Guided pen carriage: an eccentric disk raises a follower by exactly 8 mm.
    pen_mount=add('rover-pen-clip',S.empty('sliding pen carriage'))
    cam=add('rover-pen-clip',S.empty('pen lift eccentric shaft'));cam.location=(-.015,0,.075)
    disk=cyl('rover-pen-clip','eccentric lift cam',(0,0,-.004),.010,.004,'orange','Y',cam)
    bore(disk,(0,0,0),.0022,.020,'Y')
    cyl('rover-pen-clip','lift cam shaft',(0,0,0),.002,.056,'ink','Y',cam)
    for y in (-.016,.016):cyl('rover-pen-clip','lift shaft retaining collar',(0,y,0),.004,.002,'ink','Y',cam)
    # Positive key in shaft and eccentric disk transfers hand torque.
    box('rover-pen-clip','cam shaft drive key',(.002,0,0),(.002,.006,.002),'ink',cam)
    _cut(disk,S.box('cam key slot',(.002,0,0),(.0023,.012,.0023),'ink'))
    arm=box('rover-pen-clip','hand lift lever',(-.014,.026,0),(.030,.005,.004),'orange',cam)
    cyl('rover-pen-clip','rounded lift lever tip',(-.030,.026,0),.004,.006,'orange','Y',cam)
    for y in (-.012,.012):
        bracket=box('rover-pen-clip','lift lever shaft bracket',(-.015,y,.070),(.010,.004,.020),'teal')
        bore(bracket,(-.015,y,.075),.0022,.016,'Y')
        # integral wide foot and captive prepared screw through the deck
        foot=box('rover-pen-clip','lift bracket mounting foot',(-.019,y,.0615),(.020,.008,.003),'teal')
        bore(deck,(-.025,y,.056),.0017,.020);bore(foot,(-.025,y,.0615),.0017,.020)
        cyl('rover-pen-clip','pen module captive mount',(-.025,y,.058),.0014,.014,'ink')
        cyl('rover-pen-clip','pen mount captive nut',(-.025,y,.051),.0026,.002,'ink')
        cyl('rover-pen-clip','pen mount screw head',(-.025,y,.064),.0026,.002,'ink')
    for angle in (0,PEN_MAX):
        # Flat stop tops touch the rounded lever end; raised stop is past dead centre.
        x=-.015-.030*math.cos(angle);z=.075+.030*math.sin(angle)-.004
        cyl('rover-pen-clip','manual lever end stop',(x,.026,(z+.063)/2),.004,z-.063,'teal')
        box('rover-pen-clip','end stop bonded foot',(x,.026,.0615),(.010,.010,.003),'teal')
    for y in (-.010,.010):
        cyl('rover-pen-clip','carriage guide rod',(-.048,y,.084),.0015,.048,'ink')
        cyl('rover-pen-clip','guide rod captive top stop',(-.048,y,.109),.003,.002,'ink')
        foot=box('rover-pen-clip','guide factory mounting foot',(-.051,y,.062),(.014,.008,.004),'teal')
        bore(foot,(-.048,y,.062),.0015,.008) # factory press-fit guide socket
        bore(deck,(-.054,y,.056),.0017,.020);bore(foot,(-.054,y,.062),.0017,.020)
        cyl('rover-pen-clip','guide captive mount',(-.054,y,.057),.0014,.014,'ink')
        cyl('rover-pen-clip','guide mount lower head',(-.054,y,.051),.0026,.002,'ink')
        cyl('rover-pen-clip','guide mount upper head',(-.054,y,.065),.0026,.002,'ink')
    carriage=box('rover-pen-clip','guided pen carriage bridge',(-.041,0,.091),(.020,.026,.006),'teal',pen_mount)
    for y in (-.010,.010):bore(carriage,(-.048,y,.091),.0017,.020)
    bore(carriage,(-.035,0,.091),.0042,.020)
    clip=add('rover-pen-clip',S.annulus('spring pen C clip',(0,0,0),.006,.004,.012,'orange',gap=.45),pen_mount);clip.rotation_euler.x=math.pi/2;clip.location=(-.035,0,.091)
    follower=box('rover-pen-clip','lift cam follower shoe',(-.016,0,.083),(.038,.012,.004),'teal',pen_mount)
    web=box('rover-pen-clip','follower to carriage web',(-.0295,0,.086),(.008,.012,.010),'teal',pen_mount)
    for ob in (follower,web):bore(ob,(-.035,0,.086),.0042,.030)
    for z,parent in ((.0945,pen_mount),(.1075,vehicle)):
        seat=add('rover-pen-clip',S.annulus('pen spring seat',(0,0,0),.004,.0017,.001,'teal'),parent);seat.rotation_euler.x=math.pi/2;seat.location=(-.048,-.010,z)
    # Spring presses follower toward cam; actual elastic wire runs outside pen envelope.
    pressure=line('rover-pen-clip','pen carriage return spring',[(-.048,-.010,.105),(-.048,-.010,.097)],.0003,'orange')
    pen=cyl('rover-pen','felt-tip pen barrel',(-.035,0,.060),.004,.110,'teal','Z',pen_mount)
    cyl('rover-pen','pen end cap',(-.035,0,.118),.0045,.006,'ink','Z',pen_mount)
    bpy.ops.mesh.primitive_cone_add(vertices=32,radius1=.0006,radius2=.004,depth=.005,location=(-.035,0,.0025))
    nib=add('rover-pen',S.finish(bpy.context.object,'conical felt nib','teal'),pen_mount)
    # Over-centre manual stop holds the raised pose; no remote pen actuator.
    # Test apparatus belongs to the supplied deck, and is explicitly removed for drawing.
    jig=S.empty('reversible test jig');jig.parent=a.root;props['jig']=[]
    for x in (-.092,.095):
        for y in (-.076,.076):
            ob=S.box('test stop pillar',(x,y,.034),(.016,.016,.068),'birch');ob.parent=jig;ob['part_id']='rover-deck';props['jig'].append(ob)
            ob=S.box('soft jig pad',(x,y,.069),(.017,.017,.002),'orange');ob.parent=jig;ob['part_id']='rover-deck';props['jig'].append(ob)
    for x in (-.092,.095):
        ob=S.box('jig foot',(x,0,.006),(.034,.190,.012),'birch');ob.parent=jig;ob['part_id']='rover-deck';props['jig'].append(ob)
    # Remote and separately supplied cells. Hatch opens for loose-cell presentation.
    remote_root=add('rover-remote',S.empty('separate hand remote'),a.root);remote_root.location=(.235,-.170,0)
    shell=box('rover-remote','radio hand remote',(0,0,.020),(.090,.065,.040),'teal',remote_root)
    _cut(shell,S.box('remote battery compartment',(0,0,.008),(.047,.037,.025),'ink'))
    hatch=box('rover-remote','removable remote battery cover',(0,0,-.0015),(.050,.040,.003),'ink',remote_root)
    for x in (-.023,.023):
        cyl('rover-remote','independent wheel thumb control',(x,0,.044),.010,.008,'orange','Z',remote_root)
    for y in (-.009,.009):
        cyl('rover-remote-cells','matching remote cell',(0,y,.009),.0065,.044,'orange','X',remote_root)
        cyl('rover-remote-cells','cell positive terminal',(.023,y,.009),.0025,.002,'ink','X',remote_root)
    # Paper is a roll in supply, an unrolled sheet and literal no-slip traces in use.
    paper_root=add('rover-paper',S.empty('paper roll and test sheet'),a.root)
    roll=cyl('rover-paper','test paper roll',(.285,0,.020),.020,.420,'paper','Y',paper_root)
    bore(roll,(.285,0,.020),.007,.440,'Y')
    sheet=box('rover-paper','unrolled patio paper',(0,0,.0002),(.550,.420,.0004),'paper',paper_root)
    traces=[]
    for i,pts in enumerate(integrate_drive(DRAW_COMMANDS,d)['strokes']):traces.append(line('rover-paper','actual pen-down trace '+str(i),pts,.0006,'teal',paper_root))
    # Readable invitation ink is a deliberately hand-written final addition.
    cu=bpy.data.curves.new('invitation text','FONT');cu.body='YOU ARE INVITED';cu.size=.018;cu.align_x='CENTER'
    tx=bpy.data.objects.new('hand-written invitation',cu);bpy.context.collection.objects.link(tx);cu.materials.append(S.material('teal'));tx.location=(.025,.075,.0005);add('rover-paper',tx,paper_root)
    # Separate trim tool remains reusable. No physical tool is consumed into rover.
    from hand_tools import build_model as tool_model
    tool=tool_model('rover-trim-driver');tool['root'].parent=a.root;tool['root'].location=(.200,.160,0)
    for part,obs in tool['parts'].items():a.parts.setdefault(part,[]).extend(obs)
    model=a.result(vehicle=vehicle,deck=deck,wheels=wheel_groups,cam=cam,carriage=pen_mount,pressure=pressure,
                   wires=wires,cable_exits=cable_exits,trim_screw=trim,props=props,jig=jig,bore_checks=holes,mount_points=mount_points,mount_interfaces=mount_interfaces,guard_parts=guard_parts,
                   guard_snap_fingers=guard_snap_fingers,guard_home={ob:ob.location.copy() for ob in a.parts['rover-covers']},
                   factory_joints=factory,switch_handle=switch_handle,view=dict(VIEW),compound_view=dict(COMPOUND_VIEW),dimensions=d,
                   remote_root=remote_root,hatch=hatch,paper_root=paper_root,roll=roll,sheet=sheet,traces=traces,
                   invitation=tx,tool=tool,pen_nib=nib,caster_ball=caster_ball)
    for obs in props.values():a.parts['rover-deck'].extend(obs)
    model['compound_groups']={'owner':tuple(a.parts['rover-deck']),
                              'slots':{slot:tuple(o for pid in STATES.get(slot,[slot]) for o in a.parts[pid]) for slot in SLOTS}}
    model['rigid']=[o for os in a.parts.values() for o in os if o.type=='MESH'];set_state(model,'drawing-rover');return model


def apply_pose(model,wheel_angles=(0,0),pen_angle=0,axle_xy=None,yaw=0,raised=False,upside_down=False,paper=False):
    import bpy
    d=model['dimensions'];p=solve_pen(pen_angle,d)
    for ob,angle in zip(model['wheels'],wheel_angles):ob.rotation_euler.y=-angle
    model['cam'].rotation_euler.y=pen_angle;model['carriage'].location.z=p['lift']
    # Pressure spring is elastic; all guide rods/carriage/cam/pen stay rigid.
    pts=[];low=.0953+p['lift'];high=.1067
    for i in range(121):
        t=2*math.pi*5*i/120;pts.append((-.048+.0024*math.cos(t),-.010+.0024*math.sin(t),low+(high-low)*i/120))
    curve=model['pressure'].data;curve.splines.clear();sp=curve.splines.new('POLY');sp.points.add(len(pts)-1)
    for co,point in zip(pts,sp.points):point.co=(*co,1)
    v=model['vehicle'];v.rotation_euler=(math.pi if upside_down else 0,0,yaw)
    axle_xy=axle_xy or (d.axle_x,0)
    v.location=(axle_xy[0]-d.axle_x*math.cos(yaw),axle_xy[1]-d.axle_x*math.sin(yaw),.130 if upside_down else (d.jig_clearance if raised else .0004 if paper else 0))
    bpy.context.view_layer.update();return p


def _wire_state(model,connected):
    from mathutils import Vector
    for ob,plug,park,live in model['wires']:
        pts=live if connected else park;curve=ob.data;curve.splines.clear();sp=curve.splines.new('POLY');sp.points.add(len(pts)-1)
        for co,point in zip(pts,sp.points):point.co=(*co,1)
        plug.location=pts[-1]
        # The cable entry belongs to the rigid keyed plug. Rotate the loose
        # plug with its final cable segment; a reroute cannot move that entry
        # to another face. The seated connector retains its socket alignment.
        plug.rotation_mode='QUATERNION'
        plug.rotation_quaternion=(Vector(live[-2])-Vector(live[-1])).rotation_difference(Vector(pts[-2])-Vector(pts[-1]))


def pose_guard_installation(model,offset=0):
    """Quasistatic upward insertion, with explicit flexible snap fingers.

    This is a geometric access pose, not a force/material simulation. All
    shell, throat, grommet and pin-root meshes translate rigidly. Only the
    supplied split fingers bend, at most 0.45 mm inward per finger. Ordinary
    state selection always restores their unloaded installed shape.
    """
    import bpy
    if offset>0 or offset<-.060:raise ValueError('Guard insertion offset must be -60..0 mm')
    compression=.00045*max(0,min(1,(offset+.0042)/.0006)) if offset<-.0002 else 0
    for ob,home in model['guard_home'].items():ob.location=home;ob.location.z+=offset
    for ob,sign,rest in model['guard_snap_fingers']:
        for vertex,co in zip(ob.data.vertices,rest):
            vertex.co=co;vertex.co.x-=sign*compression*max(0,min(1,(co.z-.049)/.0032))
        ob.data.update()
    bpy.context.view_layer.update();return compression


def set_state(model,item_id,slots=None,context=True,**pose):
    """Reset every geometry/presentation state, independent of previous identity.

    A filled compound can be passed as slots=[...] or as literal
    rover-deck[rover-caster,rover-drive-pair]. Slot overlays are selected through
    set_overlay(); they never move or recenter the supplied geometry.
    """
    import bpy
    from construction import set_visible_parts
    pose_guard_installation(model)
    if '[' in item_id:
        base,rest=item_id.split('[',1)
        if not rest.endswith(']'):raise ValueError('Malformed compound identity')
        slots=[s.strip().strip('`') for s in rest[:-1].split(',') if s.strip()];item_id=base
    if slots is not None and item_id!='rover-deck':raise ValueError('Only rover-deck is a compound')
    if item_id not in STATES and item_id not in SUPPLIES and item_id!='rover-trim-driver':raise ValueError('Unsupported rover identity '+item_id)
    selected=tuple(slots or ())
    if any(s not in SLOTS for s in selected):raise ValueError('Unknown rover slot')
    if len(selected)!=len(set(selected)):raise ValueError('Duplicate rover slot')
    for objects in model['parts'].values():
        for ob in objects:ob.is_holdout=False
    ids=list(STATES.get(item_id,[item_id]))
    if item_id=='rover-deck':
        for slot in selected:ids.extend(STATES.get(slot,[slot]))
    set_visible_parts(model,ids)
    compound=item_id=='rover-deck';assembled=item_id in {'guarded-rover','rover-tested','rover-pen-deck','rover-looping','rover-trimmed','drawing-rover'}
    drawing=item_id in {'rover-looping','rover-trimmed','drawing-rover'}
    for obs in model['props'].values():
        for ob in obs:ob.hide_render=not (compound or (assembled and not drawing));ob.hide_set(ob.hide_render)
    _wire_state(model,assembled)
    model['switch_handle'].location.x=-.076 if item_id in {'rover-tested','rover-looping','rover-trimmed','drawing-rover'} else -.084
    model['hatch'].location.z=-.0015 if item_id=='rover-powered-remote' else -.026
    model['remote_root'].location=(0,0,0) if item_id.startswith('rover-remote') or item_id=='rover-powered-remote' else (.235,-.170,0)
    model['tool']['root'].location=(0,0,0) if item_id=='rover-trim-driver' else (.200,.160,0)
    model['roll'].hide_render=not (item_id=='rover-paper' or drawing);model['roll'].hide_set(model['roll'].hide_render)
    model['sheet'].hide_render=not drawing;model['sheet'].hide_set(not drawing)
    for trace in model['traces']:trace.hide_render=not drawing;trace.hide_set(not drawing)
    model['invitation'].hide_render=item_id!='drawing-rover';model['invitation'].hide_set(model['invitation'].hide_render)
    # The drawing states use measured arc geometry; source controls can render any sample.
    travel=integrate_drive(drawing_commands(item_id) if drawing else DRAW_COMMANDS)
    for i,ob in enumerate(model['traces']):
        pts=travel['strokes'][i] if i<len(travel['strokes']) else []
        ob.hide_render=not (drawing and pts);ob.hide_set(ob.hide_render)
        if pts:
            curve=ob.data;curve.splines.clear();sp=curve.splines.new('POLY');sp.points.add(len(pts)-1)
            for co,point in zip(pts,sp.points):point.co=(*co,1)
    params={'upside_down':compound,'raised':assembled and not drawing,'paper':drawing and item_id!='drawing-rover'}
    if drawing:params.update(wheel_angles=travel['wheel_angles'],axle_xy=travel['axle'],yaw=travel['yaw'],pen_angle=PEN_MAX if item_id=='drawing-rover' else 0)
    params.update(pose);apply_pose(model,**params)
    for obs in model['props'].values():
        for ob in obs:
            ob.hide_render=not (params['upside_down'] or params['raised']);ob.hide_set(ob.hide_render)
    if not context:
        for ob in model['parts'].get('rover-paper',[]):ob.hide_render=True;ob.hide_set(True)
        for obs in model['props'].values():
            for ob in obs:ob.hide_render=True;ob.hide_set(True)
    model['view']=dict(COMPOUND_VIEW if compound else VIEWS['drawing'] if drawing else model['tool']['view'] if item_id=='rover-trim-driver' else VIEW)
    if item_id=='rover-paper':model['view']=dict(VIEWS['drawing'])
    if item_id in {'rover-remote','rover-remote-cells','rover-powered-remote'}:model['view']={'location':(.15,-.2,.2),'target':(0,0,.015),'scale':.15}
    model['state']=item_id;model['slots']=selected;model['compound_view']=dict(COMPOUND_VIEW)
    model['overlay_slot']=None
    bpy.context.view_layer.update();return model


def set_overlay(model,slot):
    """Render one full-canvas slot, using the owner as a transparent occluder.

    Render set_state(model,'rover-deck') once for the base. For each slot call
    this function and render with model['compound_view'], unchanged resolution,
    transparent film and Cycles. Owner holdouts mask far-side screw heads and
    jig-hidden portions. Other slots have disjoint projected footprints, so the
    five resulting PNGs may be composited in any order without changing shape.
    set_state clears every holdout before selecting any subsequent identity.
    """
    if slot not in SLOTS:raise ValueError('Unknown compound slot '+slot)
    set_state(model,'rover-deck',slots=[slot])
    keep=set(STATES.get(slot,[slot]))
    for part,objects in model['parts'].items():
        for ob in objects:
            ob.hide_render=part not in keep and part!='rover-deck';ob.hide_set(ob.hide_render)
            ob.is_holdout=part=='rover-deck'
    model['overlay_slot']=slot
    return model

if __name__=='__main__':
    import json
    print(json.dumps(check_motion(),indent=2))
