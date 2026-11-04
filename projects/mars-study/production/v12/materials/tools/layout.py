"""Selected source cells and authored silhouettes in normalized cell coordinates.

Only polygons marked opaque erase a previously painted state. All additive
objects use outlines (and explicit holes/strokes); hit areas have empty masks.
The common family box controls registration, not the visible silhouette.
"""
def region(box, states, **kw):return dict(box=box,states=states,**kw)
def scene(chapters,source,grid,regions,**kw):return dict(chapters=chapters,source=source,grid=grid,regions=regions,**kw)
def state(cell,**kw):return dict(cell=cell,**kw)
INDOOR={'tail':'growing-room-empty.webp'}
SCENES=[]
SCENES.append(scene(['ch01'],'01-rock-landing-r2',[3,1],[
 region([0,.24,.43,.60],{'punctured-habitat-wall':0,'sealed-habitat-wall':state(1,opaque=[0,.24,.43,.60]),'breathable-habitat':state(2,opaque=[0,.24,.43,.60])}),
 region([.435,.145,1,.645],{'unstable-landing-support':0,'rock-supported-lander':state(1,opaque=[.435,.145,1,.645])})]))
furnace=[[(.031,.46),(.045,.405),(.085,.369),(.14,.348),(.2,.334),(.22,.327),(.23,.295),(.30,.293),(.326,.326),(.39,.337),(.445,.363),(.48,.40),(.49,.448),(.464,.493),(.47,.566),(.50,.592),(.50,.625),(.07,.65),(.052,.616),(.07,.582),(.066,.52)]]
SCENES.append(scene(['ch05'],'05-workshop-rollers',[3,1],[
 region([.025,.28,.51,.66],{'assembled-solar-furnace':state(2,trace=furnace)}),
 region([.67,.19,.99,.67],{'workshop-press':0})]))
SCENES.append(scene(['ch32'],'05-workshop-rollers',[3,1],[region([.025,.28,.51,.66],{'assembled-solar-furnace':2})],base=2))
berths={
 'insulated-ceramic-berth':state(1,trace=[[(.199,.609),(.246,.569),(.609,.568),(.64,.604),(.64,.681),(.199,.681)]]),
 'uninsulated-berth':state(2,trace=[[(.199,.606),(.226,.563),(.254,.55),(.605,.55),(.635,.582),(.644,.681),(.199,.681)]]),
 'cave-berth':state(3,trace=[[(.199,.606),(.224,.557),(.254,.542),(.605,.545),(.635,.577),(.644,.681),(.199,.681)]])}
SCENES.append(scene(['ch07'],'07-ceramic-berth',[2,2],[region([.19,.53,.66,.70],berths)],**INDOOR))
beds=[[(.005,.642),(.203,.510),(.335,.510),(.337,.664),(.226,.811),(.005,.811)],[(.338,.537),(.648,.537),(.677,.562),(.677,.662),(.338,.662)],[(.734,.572),(.828,.572),(.997,.665),(.997,.814),(.854,.814),(.734,.656)]]
loose=[([(.127,.738),(.121,.774),(.125,.808),(.135,.834),(.155,.855),(.185,.868),(.222,.875),(.285,.878)],.024),([(.518,.613),(.512,.646),(.500,.673),(.494,.687),(.497,.699),(.523,.710),(.556,.721),(.581,.738),(.590,.758)],.023),([(.907,.738),(.907,.790),(.902,.820),(.888,.844),(.862,.862),(.821,.873),(.780,.877),(.727,.877)],.024)]
joined=[([(.126,.741),(.164,.762),(.202,.770),(.25,.770),(.30,.764),(.34,.762),(.382,.774),(.433,.800),(.466,.813)],.023),([(.517,.613),(.514,.650),(.510,.690),(.499,.737),(.489,.780),(.480,.803)],.025),([(.906,.737),(.891,.753),(.86,.763),(.82,.769),(.77,.767),(.72,.764),(.67,.760),(.626,.765),(.579,.781),(.531,.803),(.502,.818)],.034),([(.480,.805),(.478,.865)],.040)]
basin4=[[(.305,.785),(.62,.785),(.647,.805),(.645,.878),(.315,.878),(.305,.85)],[(.628,.797),(.72,.797),(.73,.834),(.70,.849),(.632,.84)],[(.713,.784),(.76,.784),(.76,.802),(.784,.804),(.793,.879),(.708,.879),(.705,.849)]]
basin5=[[(.292,.844),(.630,.844),(.649,.862),(.645,.948),(.300,.948),(.289,.925)],[(.64,.858),(.731,.858),(.735,.916),(.705,.926),(.64,.915)],[(.715,.848),(.757,.848),(.76,.864),(.784,.866),(.793,.948),(.707,.948),(.700,.919)]]
SCENES.append(scene(['ch08'],'08-ceramic-beds-final',[3,2],[region([0,.50,1,.96],{
 'growing-room-floor':0,'ceramic-bed-walls':state(1,trace=beds),'beds-with-unconnected-drains':state(2,trace=beds),
 'beds-with-loose-drain-hoses':state(3,trace=beds,strokes=loose),'beds-with-unconnected-reservoir':state(4,trace=beds+basin4),
 'empty-growing-beds':state(5,trace=beds+basin5,strokes=joined)})],**INDOOR))
beds9=[[(.015,.666),(.218,.531),(.328,.531),(.328,.674),(.231,.817),(.015,.817)],[(.336,.533),(.65,.533),(.684,.57),(.684,.659),(.336,.659)],[(.719,.574),(.807,.573),(.99,.674),(.99,.817),(.816,.817),(.719,.683)]]
inlet=[([(.108,.464),(.12,.49),(.119,.52),(.104,.552),(.078,.578),(.048,.602),(.027,.632),(.016,.659),(.012,.72),(.012,.791),(.018,.821),(.04,.846),(.078,.870),(.115,.890),(.15,.897),(.22,.898),(.32,.898)],.024)]
# Existing empty basins/bed bodies are painted in the base. Filling replaces
# their exact surfaces; the independent inlet follows its own traced route.
SCENES.append(scene(['ch09'],'09-ceramic-root-medium',[3,1],[
 region([0,.52,1,.83],{'empty-growing-beds':0,'prepared-growing-beds':state(1,trace=beds9)}),
 region([.015,.42,.135,.57],{'water-processor':0}),
 region([.015,.44,.83,.95],{'irrigation-supply-line':state(2,strokes=inlet,trace=[[(.319,.835),(.646,.835),(.668,.854),(.668,.927),(.319,.927)]])})],**INDOOR))
left10=[[(.006,.665),(.195,.537),(.316,.538),(.318,.67),(.224,.805),(.006,.805)]]
back10=[[(.32,.525),(.646,.525),(.675,.558),(.675,.654),(.321,.654)]]
right10=[[(.721,.56),(.815,.559),(.995,.666),(.995,.803),(.823,.803),(.721,.669)]]
SCENES.append(scene(['ch10'],'10-continuous-farm-feed',[3,1],[
 region([0,.49,.325,.815],{'potato-growing-bay':0,'dark-potato-bay':state(1,trace=left10),'potato-bed':state(2,trace=left10,green=[[.01,.49,.32,.665]])}),
 region([.318,.47,.68,.66],{'soybean-growing-row':0,'soybean-row':state(2,trace=back10,green=[[.33,.47,.67,.56]])}),
 region([.715,.55,1,.815],{'dry-lettuce-shelf':0,'wicking-lettuce-bed':state(1,trace=right10),'lettuce-tray':state(2,trace=right10)})],**INDOOR))
SCENES.append(scene(['ch11'],'12-continuous-farm-feed',[3,1],[region([.86,.42,.995,.56],{'clean-preparation-sink':0}),region([.67,.50,.96,.76],{'lettuce-tray':state(0,presentation='ch11')})],**INDOOR))
SCENES.append(scene(['ch12'],'12-continuous-farm-feed',[3,1],[
 region([.015,.415,.30,.76],{'potato-bed':state(0,presentation='ch12'),'extended-potato-bed':state(1,opaque=[.015,.415,.30,.76]),'hilled-potato-bed':state(2,opaque=[.015,.415,.30,.76])}),
 region([.28,.39,.64,.625],{'soybean-row':state(0,presentation='ch12'),'supported-soybean-row':state(2,opaque=[.28,.39,.64,.625])})],**INDOOR))
SCENES.append(scene(['ch19'],'19-matching-process-frame',[2,2],[
 region([.58,.47,.995,.71],{'fuel-fab-area':0,'fuel-fab-footing':state(1,trace=[[(.606,.558),(.921,.558),(.984,.66),(.984,.688),(.605,.688)] ]),'steel-process-frame':state(3,trace=[[(.603,.556),(.645,.556),(.645,.473),(.666,.473),(.666,.466),(.905,.466),(.922,.481),(.922,.640),(.979,.640),(.984,.691),(.603,.691)]],holes=[[(.664,.506),(.875,.506),(.875,.595),(.862,.595),(.862,.608),(.685,.608),(.685,.595),(.664,.595)]])}),
 region([.03,.43,.57,.70],{'solar-array-footing':0,'industrial-solar-supply':state(2,trace=[[(.127,.447),(.521,.447),(.531,.479),(.539,.601),(.552,.622),(.56,.685),(.036,.685),(.036,.656),(.055,.608)]])})]))
SCENES.append(scene(['ch21'],'21-local-steel-workshop',[2,1],[
 region([0,.215,.465,.63],{'solar-retort-cradle':0,'hydrogen-fed-retort':state(1,opaque=[0,.215,.465,.63])}),
 region([.55,.10,.88,.42],{'refining-furnace':0}),region([.65,.405,.93,.925],{'workshop-press':0})]))
# Empty dish is the background so removing the retort reveals the proper seat.
SCENES.append(scene(['ch23'],'23-retort-gas-route',[3,1],[
 region([0,.31,.62,.64],{'hydrogen-fed-retort':state(0,opaque=[0,.31,.62,.64])}),
 region([.71,.43,1,.68],{'steel-process-frame':1,'controlled-methane-reactor':state(2,opaque=[.71,.43,1,.68])})],base=1))
# Curtain intentionally replaces the upper wall behind the existing plants;
# its lower contour follows the foliage and leaves the active beds untouched.
curtain=[[(.087,.25),(.884,.25),(.884,.48),(.816,.48),(.816,.50),(.64,.50),(.64,.424),(.61,.424),(.61,.43),(.30,.43),(.30,.45),(.27,.45),(.25,.44),(.20,.44),(.20,.45),(.11,.45),(.087,.46)]]
SCENES.append(scene(['ch28'],'28-separate-farm-feed',[3,1],[
 region([.08,.245,.89,.51],{'growing-room-service-rail':0,'screened-growing-area':state(1,trace=curtain)}),
 region([.25,.76,.70,.92],{'shared-nutrient-reservoir':0,'covered-nutrient-reservoir':state(1,trace=[[(.258,.793),(.285,.77),(.656,.77),(.692,.796),(.692,.913),(.258,.913)]]),'insulated-nutrient-reservoir':state(2,trace=[[(.253,.793),(.28,.766),(.66,.766),(.697,.796),(.697,.918),(.253,.918)]])})],**INDOOR))
SCENES.append(scene(['ch30'],'30-rock-to-steel-support',[3,2],[region([.335,.19,1,.74],{
 'rock-supported-lander':0,'prepared-support-ground':state(1,opaque=[.335,.19,1,.74]),'ceramic-landing-footing':state(2,opaque=[.335,.19,1,.74]),'replacement-landing-leg':state(3,opaque=[.335,.19,1,.74]),'level-launch-platform':state(4,opaque=[.335,.19,1,.74])})]))
# Separate hose silhouettes retain the shared full-width compound canvas.
left_hose=[([(.082,.536),(.12,.548),(.162,.571),(.20,.583),(.24,.586),(.28,.580),(.310,.562),(.335,.535),(.353,.502),(.370,.458),(.383,.416),(.400,.397)],.026),([(.399,.396),(.406,.381)],.043)]
right_hose=[([(.678,.390),(.698,.409),(.712,.440),(.726,.484),(.746,.527),(.770,.558),(.798,.577),(.827,.579),(.853,.568),(.879,.549),(.900,.532)],.030),([(.674,.386),(.684,.397)],.045)]
SCENES.append(scene(['ch31'],'31-ceramic-footing-continuity',[2,2],[
 region([0,.285,1,.70],{'lander-propellant-service-connections':0},slots=[{'accepts':'methane-transfer-hose','cell':1,'strokes':left_hose},{'accepts':'oxygen-transfer-hose','cell':2,'strokes':right_hose}]),
 region([0,.42,.12,.65],{'methane-transfer-outlet':0}),region([.87,.43,1,.65],{'oxygen-transfer-outlet':0})]))
SCENES.append(scene(['ch33'],'33-completed-farm-harvest',[1,1],[region([.01,.43,.28,.74],{'potato-bed-ready-to-lift':0}),region([.28,.40,.63,.615],{'soybean-row-ready-to-gather':0}),region([.67,.50,.96,.74],{'lettuce-tray-ready-to-pick':0})],**INDOOR))
PORTABLES=[
 {'id':'steel-pin','source':'item-steel-pin.png','display':56},
 {'id':'separator-electromagnet','source':'item-electromagnet.png','display':68},
 {'id':'carbon-and-flux','source':'portable-refining-materials.png','bounds':[0,0,1/3,1],'display':58},
 {'id':'iron-refining-charge','source':'portable-refining-materials.png','bounds':[1/3,0,2/3,1],'display':70},
 {'id':'steel-billet','source':'portable-refining-materials.png','bounds':[2/3,0,1,1],'display':60},
 {'id':'survey-excavator-without-a-hopper','source':'portable-folded-hopper.png','bounds':[0,0,.5,1],'display':210},
 {'id':'powered-excavator-without-a-hopper','source':'portable-folded-hopper.png','bounds':[.5,0,1,1],'display':210},
 {'id':'furnace-receiver','source':'item-furnace-receiver.png','display':96},
 # Same natural rock, traced out of the selected landing scene; not a new
 # independently imagined support with different contact surfaces.
 {'id':'rock','source':'01-rock-landing-r2.png','bounds':[.511,.54,.634,.634],'display':100,'trace':[[(.01,.48),(.04,.16),(.11,.02),(.61,.03),(.87,.13),(.99,.50),(.99,.82),(.86,.96),(.40,.98),(.09,.91)]]}
]
