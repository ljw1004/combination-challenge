import json
from pathlib import Path
P=Path(__file__).resolve().parents[1]
groups=[]
def scene(ch,source,grid,regions,base=0,tail='crash-apron.webp',**extra):
 groups.append(dict(chapters=ch if isinstance(ch,list) else [ch],source=source,grid=grid,regions=regions,base=base,tail=tail,**extra))
def r(box,states,**kwargs):return dict(box=box,states=states,**kwargs)
scene(1,'01-landing-r5',[3,1],[r([0,.24,.425,.60],{'punctured-habitat-wall':0,'sealed-habitat-wall':1,'breathable-habitat':2}),r([.435,.145,1,.645],{'unstable-landing-support':0,'cribbed-landing-platform':1})])
scene(2,'02-outdoor-power-r2',[3,1],[r([.01,.37,.75,.70],{'station-power':2}),r([.70,.33,1,.68],{'atmospheric-processor':0,'working-atmospheric-processor':2}),r([.60,.005,.88,.35],{'radio-mount':0,'mounted-antenna':2})])
scene(3,'03-well-and-water-r2',[4,1],[r([.04,.27,.42,.58],{'surveyed-ice-bore':0,'sealed-melt-well':1}),r([.60,.24,.98,.58],{'water-processor':0},transparent=['water-processor']),r([.255,.435,.715,.54],{'connected-well-line':2,'insulated-water-line':3})])
scene(4,'04-cavern-clearing',[2,1],[r([.10,.27,.91,.69],{'surveyed-cavern-floor':0,'cleared-cavern-bay':1})],tail='cavern-infill.webp')
scene(5,'05-solar-furnace-open-ground',[3,1],[r([.03,.24,.62,.72],{'supported-reflector':1,'assembled-solar-furnace':2}),r([.68,.22,.97,.68],{'workshop-press':0},transparent=['workshop-press'])])
scene(6,'06-enclosure-r3',[3,2],[r([.025,.41,.34,.72],{'assembled-solar-furnace':0},transparent=['assembled-solar-furnace']),r([0,.08,1,.69],{'cleared-cavern-bay':0,'unpadded-cavern-floor':1,'protected-cavern-floor':2,'sealed-growing-room':3,'pressurized-growing-room':4,'lit-growing-room':5})],tail='cavern-infill.webp')
scene(7,'07-berth-r2',[2,2],[r([.18,.52,.64,.74],{'insulated-berth-frame':1,'uninsulated-berth':2,'cave-berth':3})],tail='growing-room-empty.webp')
scene(8,'08-growing-structure',[3,2],[r([0,.48,1,.85],{'growing-room-floor':0,'raised-bed-frames':1,'beds-with-unconnected-drains':2,'beds-with-loose-drain-hoses':3,'beds-with-unconnected-reservoir':4,'empty-growing-beds':5})],tail='growing-room-empty.webp')
scene(9,'09-root-medium',[3,1],[r([0,.52,1,.84],{'empty-growing-beds':0,'prepared-growing-beds':1}),r([.015,.41,.145,.59],{'water-processor':0},transparent=['water-processor']),r([.07,.45,.42,.76],{'irrigation-supply-line':2},polygon=[(.07,.45),(.15,.45),(.17,.52),(.155,.59),(.12,.62),(.10,.69),(.13,.735),(.39,.735),(.42,.76),(.08,.76),(.055,.68),(.055,.61),(.10,.55)])],tail='growing-room-empty.webp')
scene(10,'10-planting',[3,1],[r([0,.47,.335,.82],{'potato-growing-bay':0,'dark-potato-bay':1,'potato-bed':2}),r([.325,.43,.68,.65],{'soybean-growing-row':0,'soybean-row':2}),r([.71,.48,1,.82],{'dry-lettuce-shelf':0,'wicking-lettuce-bed':1,'lettuce-tray':2})],tail='growing-room-empty.webp')
scene(19,'19-industrial-site',[3,1],[r([.685,.50,.99,.70],{'fuel-fab-area':0,'fuel-fab-footing':1}),r([.015,.38,.675,.71],{'solar-array-footing':1,'industrial-solar-supply':2},transparent=['solar-array-footing'])],baseCopies=[{'state':1,'box':[.015,.50,.675,.71]}])
scene(30,'30-permanent-support-r2',[2,2],[r([.37,.11,.995,.75],{'cribbed-landing-platform':0,'prepared-support-ground':1,'replacement-landing-leg':2,'level-launch-platform':3})])
scene(11,'12-crop-support',[3,1],[r([.85,.40,1,.59],{'clean-preparation-sink':0},transparent=['clean-preparation-sink']),r([.675,.49,.97,.74],{'lettuce-tray':0},transparent=['lettuce-tray'])],tail='growing-room-empty.webp')
scene(12,'12-crop-support',[3,1],[r([.005,.42,.29,.74],{'potato-bed':0,'extended-potato-bed':1,'hilled-potato-bed':2}),r([.28,.36,.63,.59],{'soybean-row':0,'supported-soybean-row':2})],tail='growing-room-empty.webp')
scene(15,'15-rover-loading-open-ground',[2,1],[r([.14,.32,.72,.58],{'rover-cargo-mount':0},transparent=['rover-cargo-mount'])],places={'rover-cargo-mount':[{'id':'buffered-field-case','x':44,'y':18.3}]})
scene(16,'16-wash-crossing',[2,2],[r([.10,.29,1,.72],{'shallow-wash-crossing':0,'supported-traction-panels':1,'winch-ready-crossing':2}),r([.25,.12,.53,.35],{'rover-beyond-the-wash':3})])
scene(20,'20-electrolysis',[2,2],[r([.02,.40,.31,.72],{'processor-polishing-outlet':0},transparent=['processor-polishing-outlet']),r([.23,.37,1,.76],{'electrolyzer-stack':0,'unfed-electrolysis-rack':1,'fed-electrolyzer':2,'buffered-electrolysis-rack':3})])
scene(21,'21-retort-and-frame-open-ground',[3,1],[r([.60,.23,.86,.58],{'workshop-press':0},transparent=['workshop-press']),r([.10,.32,.67,.61],{'solar-retort-cradle':0,'hydrogen-fed-retort':1}),r([.81,.43,1,.63],{'fuel-fab-footing':0,'iron-process-frame':2})])
scene(22,'02-outdoor-power-r2',[3,1],[r([.77,.36,1,.62],{'atmospheric-carbon-dioxide-outlet':2},transparent=['atmospheric-carbon-dioxide-outlet'])],base=2)
scene(23,'23-retort-transfer-open-ground',[3,1],[r([.10,.32,.67,.65],{'hydrogen-fed-retort':0}),r([.71,.43,1,.68],{'iron-process-frame':1,'controlled-methane-reactor':2})],base=1)
scene(24,'24-reactor-services-open-ground',[3,2],[r([0,.13,1,.72],{'controlled-methane-reactor':0,'reactor-with-uncooled-separator':1,'purifying-methane-reactor':2,'water-recovering-methane-reactor':3,'purified-methane-supply':4})])
scene(25,'25-cryogenic-stores-open-ground',[3,2],[r([.38,.15,.97,.73],{'cryogenic-tanks':0,'refrigerated-cryogenic-tanks':1},slots={'refrigerated-cryogenic-tanks':[
 {'name':'Methane collected','accepts':'methane-feed-lead','state':4,'clip':[.38,.15,.675,.73]},
 {'name':'Oxygen collected','accepts':'oxygen-feed-lead','state':4,'clip':[.675,.15,.97,.73]}]}),r([.34,.30,.47,.57],{'purified-methane-supply':0},transparent=['purified-methane-supply']),r([.88,.39,1,.66],{'oxygen-service-outlet':0},transparent=['oxygen-service-outlet'])])
scene(26,'26-heat-store-r2',[3,2],[r([.04,.35,.31,.61],{'fresh-water-filling-tap':0},transparent=['fresh-water-filling-tap']),r([.60,.32,.74,.47],{'indoor-heat-recovery-connection':0},transparent=['indoor-heat-recovery-connection']),r([.24,.34,.745,.74],{'steel-tank-without-a-coil':1,'unfilled-uninsulated-tank':2,'unfilled-insulated-tank':3,'uninsulated-filled-tank':4,'unheated-water-tank':6,'warm-water-tank':5})],tail='growing-room-empty.webp',stateCopies=[{'base':0,'copies':[{'state':5,'box':[.24,.475,.61,.74]}]}])
scene(27,'27-service-selectors-r2',[2,1],[r([.22,.29,.41,.51],{'reserve-power-selector':0,'reserve-power-selected':1}),r([.455,.29,.65,.51],{'well-isolation-control':0,'well-isolated-and-drained':1}),r([.69,.29,.885,.51],{'fuel-plant-shutdown-control':0,'fuel-plant-shut-down':1})],tail='growing-room-empty.webp')
scene(28,'28-farm-storm',[3,1],[r([.035,.245,.96,.51],{'growing-room-service-rail':0,'screened-growing-area':1}),r([.275,.56,.655,.725],{'shared-nutrient-reservoir':0,'covered-nutrient-reservoir':1,'insulated-nutrient-reservoir':2})],tail='growing-room-empty.webp')
scene(29,'29-array-recovery',[3,1],[r([.01,.37,.77,.66],{'station-power':0,'cleaned-station-solar-array':1,'restored-power':2}),r([.68,.43,.765,.57],{'station-solar-inlet':0},transparent=['station-solar-inlet'])])
scene(31,'31-propellant-transfer-open-ground',[2,2],[r([0,.285,.99,.67],{'lander-propellant-service-connections':0},slots={'lander-propellant-service-connections':[
 {'name':'Methane tank filled','accepts':'methane-transfer-hose','state':1,'clip':[0,.285,.52,.67]},
 {'name':'Oxygen tank filled','accepts':'oxygen-transfer-hose','state':2,'clip':[.52,.285,.99,.67]}]}),r([0,.42,.12,.64],{'methane-transfer-outlet':0},transparent=['methane-transfer-outlet']),r([.87,.43,1,.65],{'oxygen-transfer-outlet':0},transparent=['oxygen-transfer-outlet'])])
scene(32,'05-solar-furnace-open-ground',[3,1],[r([.03,.24,.62,.72],{'assembled-solar-furnace':2},transparent=['assembled-solar-furnace'])],base=2)
scene(33,'33-harvest',[1,1],[r([.005,.40,.29,.74],{'potato-bed-ready-to-lift':0},transparent=['potato-bed-ready-to-lift']),r([.28,.36,.63,.59],{'soybean-row-ready-to-gather':0},transparent=['soybean-row-ready-to-gather']),r([.675,.49,.97,.74],{'lettuce-tray-ready-to-pick':0},transparent=['lettuce-tray-ready-to-pick'])],tail='growing-room-empty.webp')
scene(34,'34-interior-specimen-stow',[3,2],[r([.105,.16,.65,.45],{'water-source-core-cradle':0,'flight-stowed-source-core':1}),r([.105,.45,.65,.73],{'remote-band-core-cradle':0,'flight-stowed-remote-core':2}),r([.66,.31,.86,.55],{'flight-specimen-locker':0,'flight-stowed-membrane':3})],tail='flight-cabin.webp')
scene(35,'35-ascent-r2',[2,1],[r([0,.10,.79,.51],{'flight-console':0,'ascent-underway':1})],tail='growing-room-empty.webp')
# Keep bed surfaces independent of the separately installed water line.
waterline=next(g for g in groups if g['chapters']==[9])
waterline['regions'][0]['exclude']=[waterline['regions'][2]['polygon']]
groups.sort(key=lambda g:g['chapters'][0])
import runpy
runpy.run_path(str(P/'tools/trace-layout.py'))['apply_traces'](groups)
# Full-scene exports preserve one camera per state family.
(P/'scene-layout.json').write_text(json.dumps(groups,indent=2)+'\n')
