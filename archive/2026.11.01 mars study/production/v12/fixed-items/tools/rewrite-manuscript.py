"""Build the approved fixed-item revision from the retained v12 source.

Run from the repository root. This authoring migration does not alter the engine.
Artwork/registration overrides live in artwork.json beside this tool's parent.
"""
import copy
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[6]
PROD = ROOT / 'projects/mars-study/production/v12/fixed-items'
STORY = ROOT / 'projects/mars-study/mars-v12'
source = PROD / 'source-mars.md'
parsed = json.loads(subprocess.check_output([
    'node', '--input-type=module', '-e',
    "import fs from 'node:fs'; import {parseStory} from './src/story/parser.ts'; "
    "process.stdout.write(JSON.stringify(parseStory(fs.readFileSync(process.argv[1],'utf8'),{file:process.argv[1]})));",
    str(source)], cwd=ROOT))

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

oldkeys = {i: i[3:] if i.startswith('id:') else slug(v['name']) for i, v in parsed['items'].items()}
items = {}
chapters = []
rawchapters = re.split(r'^## ', source.read_text(), flags=re.M)[1:]

def ref(r):
    return {'id': oldkeys[r['id']], 'slots': [oldkeys[s] for s in r.get('slots', [])]}

def ingredient(i):
    return {'ref': ref(i['ref']), 'fate': i['fate']}

def original_chapter(line):
    return max(n for n,c in enumerate(parsed['chapters']) if c['source']['line'] <= line) + 1

for old,i in parsed['items'].items():
    key = oldkeys[old]
    items[key] = dict(name=i['name'], chapter=original_chapter(i['source']['line']),
        icon=i.get('icon',{}).get('url'), compound=i['compound'],
        slots=[dict(name=s.get('name'), accepts=oldkeys[s['accepts']], icon=s.get('icon',{}).get('url')) for s in i['slots']],
        readings=[dict(text=w['markdown'], requires=[oldkeys[x] for x in w['requires']]) for w in i['wonders']],
        presentations=[dict(chapter=next(n+1 for n,c in enumerate(parsed['chapters']) if c['name']==p['chapter']['value']),
                            **({'name':p['name']} if 'name' in p else {}),
                            **({'icon':p['icon']['url']} if 'icon' in p else {})) for p in i['presentations']],
        exclusive=oldkeys.get(i.get('exclusiveWith')))

for n,c in enumerate(parsed['chapters'],1):
    raw = rawchapters[n-1]
    notes = '\n'.join(re.findall(r'^> NOTE:.*$',raw,re.M))
    chapters.append(dict(number=n,name=c['name'],intro=c['intro'],note=notes,
        image=c.get('image'),supplies=[oldkeys[r['id']] for r in c['items']],
        fixed={oldkeys[h]:dict(x=(c.get('hotspotDefinitions',{}).get(h,parsed['hotspots'][h]).get('x',.5))*100,
                              y=(c.get('hotspotDefinitions',{}).get(h,parsed['hotspots'][h]).get('y',.3))*100)
               for h in c['hotspots']},
        goals=[dict(text=g['text'],next=g['next'],operator=g['operator'],conditions=[dict(ref=ref(q['item']),
               **({'at':oldkeys[q['hotspot']]} if q.get('hotspot') else {})) for q in g['conditions']]) for g in c['goals']],
        recipes=[]))

for r in parsed['recipes']:
    if r.get('installation'): continue
    n=original_chapter(r['source']['line'])
    chapters[n-1]['recipes'].append(dict(a=ingredient(r['a']),
        **({'b':ingredient(r['b'])} if r.get('b') else {}),
        **({'at':ingredient(r['at'])} if r.get('at') else {}),result=ref(r['result'])))

def key(s):
    if s in items: return s
    matches=[k for k,v in items.items() if v['name']==s]
    if len(matches)!=1: raise ValueError(f'Ambiguous or missing item {s!r}: {matches}')
    return matches[0]

def new(name,ch,reading='',icon=None,identifier=None):
    k=identifier or slug(name)
    if k not in items:
        items[k]=dict(name=name,chapter=ch,icon=icon,compound=False,slots=[],readings=[],presentations=[],exclusive=None)
    if reading: items[k]['readings']=[dict(text=reading,requires=[])]
    return k

def note(ch,text): chapters[ch-1]['note']='> NOTE: '+text
def intro(ch,text): chapters[ch-1]['intro']=text
def read(name,text): items[key(name)]['readings']=[dict(text=text,requires=[])] if text else []
def rename(name,label): items[key(name)]['name']=label
def present(subject,ch,**p): items[key(subject)]['presentations'].append(dict(chapter=ch,**p))
def fixed(ch,*names):
    c=chapters[ch-1]; c['fixed']={key(s):c['fixed'].get(key(s),dict(x=50,y=32)) for s in names}
def supplies(ch,*names): chapters[ch-1]['supplies']=[key(s) for s in names]

def token(s):
    s=s.strip()
    m=re.match(r'^(.*?)\[([^\]]+)\]$',s)
    if m: return dict(id=key(m[1].strip()),slots=[key(t.strip()) for t in m[2].split(',')])
    return dict(id=key(s),slots=[])

def operand(s):
    m=re.search(r' \[(consume|transform|preserve)\]$',s)
    return dict(ref=token(s[:m.start()] if m else s),fate=m[1] if m else 'preserve')

def ops(ch,*lines):
    rs=[]
    for line in lines:
        lhs,rhs=line.split(' -> ')
        context=lhs.split(' @ '); pair=context[0].split(' + ')
        r=dict(a=operand(pair[0]),result=token(rhs))
        if len(pair)>1: r['b']=operand(pair[1])
        if len(context)>1: r['at']=operand(context[1])
        rs.append(r)
    chapters[ch-1]['recipes']=rs

def goals(ch,*specs):
    chapters[ch-1]['goals']=[dict(text=t,next=i>0,operator='and',conditions=[dict(ref=token(s)) for s in ([rs] if isinstance(rs,str) else rs)])
        for i,(t,rs) in enumerate(specs)]

def alias(old,newer):
    old,newer=key(old),key(newer)
    def walk(x):
        if isinstance(x,dict):
            for k,v in list(x.items()):
                if k in ('id','at','accepts','exclusive') and v==old: x[k]=newer
                elif k in ('slots','requires','supplies') and isinstance(v,list):
                    x[k]=[newer if q==old else q for q in v]
                elif k=='fixed' and old in v:
                    v[newer]=v.pop(old)
                else: walk(v)
        elif isinstance(x,list):
            for v in x: walk(v)
    walk(chapters)
    for it in items.values():
        for s in it['slots']:
            if s['accepts']==old: s['accepts']=newer
        if it['exclusive']==old: it['exclusive']=newer
    for c in chapters: c['supplies']=[newer if x==old else x for x in c['supplies']]

# Existing working surfaces become chapter views of the actual construction.
alias('Drinking water supply','Water processor')
present('Water processor',4,name='Drinking water supply')
alias('Cleared growing bay','Cleared cavern bay')
present('Cleared cavern bay',6,name='Cleared growing bay')
alias('Solar heating bay','Assembled solar furnace')
alias('Solar cooking connection','Assembled solar furnace')
present('Assembled solar furnace',6,name='Solar heating bay')
# The removable retort seat gets its own fixed identity in chapter 21; the furnace survives.
present('Assembled solar furnace',32,name='Solar cooking connection')

# 1. One damaged wall and one damaged support, replaced in the scene.
fixed(1,'Punctured habitat wall','Sealed habitat wall','Breathable habitat','Unstable landing support','Cribbed landing platform')
ops(1,'Pressure patch kit [consume] @ Punctured habitat wall [transform] -> Sealed habitat wall',
    'Breathing-gas supply [consume] @ Sealed habitat wall [transform] -> Breathable habitat',
    'Tool kit + Shipping braces [transform] -> Steel',
    'Steel [consume] @ Unstable landing support [transform] -> Cribbed landing platform')
note(1,'The same ascent cabin lands badly on open ground to the right and slightly in front of the rounded starter habitat. One foot catches a lone rock and its lower leg folds; there is no rubble mound under the vehicle. The engine plume throws loose debris toward the habitat, puncturing the side wall facing the landing site; the rounded damaged wall faces the landing point, while the entrance faces the viewer/left. A temporary crib takes the failed leg’s load and brings the intact cabin roughly upright. The later repair replaces that temporary support. The repair kit, tools and expendable braces are accessible from ground level. Qualified patching and ordinary lifting/cribbing are bundled; no pressure vessel or flight engine is fabricated. Material stocks represent quantities without accounting.')
read('Cribbed landing platform','The crib takes the broken leg’s load. The cabin is upright again, and I can board for the main supplies. Its tanks and engine mounts are intact.')

# 2. Outdoor array/processor/dish; the battery remains portable.
new('Reserve battery',2,'A removable module from the station’s battery and fuel-cell reserve.')
new('Charged reserve battery',2,'Charged and ready for its reserve bay. The complete station reserve, not this module alone, carries the essential loads.')
new('Solar power lead',2,'One end is connected to the array. This plug supplies the outdoor processor.')
new('Mounted antenna',2)
items['mounted-antenna']['readings']=copy.deepcopy(items['surface-radio']['readings'])
rename('station-power','Station solar array')
ops(2,'Steel [consume] + Delivered solar array [consume] -> station-power',
    'Reserve battery [transform] @ station-power -> Charged reserve battery',
    'Power cable [consume] @ station-power -> Solar power lead',
    'Solar power lead [consume] @ Atmospheric processor [transform] -> Working atmospheric processor',
    'Tool kit + Bent antenna [transform] -> Straightened antenna',
    'Straightened antenna [consume] @ Radio mount [transform] -> Mounted antenna')
goals(2,('Charge the reserve battery','Charged reserve battery'),('Start the outdoor air processor','Working atmospheric processor'),('Hear from Earth','Mounted antenna'))
supplies(2,'Delivered solar array','Reserve battery','Power cable','Atmospheric processor','Bent antenna')
fixed(2,'station-power','Atmospheric processor','Working atmospheric processor','Radio mount','Mounted antenna')
intro(2,'The cells survived the landing. I set the panels outside and repair the silent dish above the habitat.')
note(2,'The processor is an outdoor package with separate carbon-dioxide capture and oxygen-production branches. Its completed power lead visibly reaches the deployed array’s qualified outlet. The antenna is a dish and mount; receiver electronics remain inside the habitat. The portable battery is a removable module of the delivered battery/fuel-cell reserve, installed later. The main array supports the farm and baseline life support; later modules support industry. No live Earth reply directs the opening emergency.')

# 3. The bore, well and pipe remain on their actual route.
ops(3,'Heated extraction head [consume] @ Surveyed ice bore [transform] -> Sealed melt well',
    'Clean service hose [consume] @ Sealed melt well -> Connected well line',
    'Packing foil [consume] + Insulation felt [consume] -> Reflective insulation',
    'Reflective insulation [consume] @ Connected well line [transform] -> Insulated water line')
goals(3,('Bring water through treatment','Connected well line'),('Protect the exterior run','Insulated water line'))
fixed(3,'Surveyed ice bore','Sealed melt well','Water processor','Connected well line','Insulated water line')
read('Connected well line','Water reaches the habitat’s treatment inlet. The exposed run still needs insulation.')
note(3,'Installing the head retires the bare bore. The well survives when hose is laid to the existing processor; the resulting pipe has its own authored route. Insulation replaces that pipe along the same route. Supplied trace heating and controls remain part of the well service equipment. Later Drinking water supply is a working view of this same Water processor identity, commissioned by these goals, not a second tank or an orphan result.')

# 4–8. Building fixed structures in their actual positions.
fixed(4,'Surveyed cavern floor','Cleared cavern bay')
chapters[3]['recipes'][-1]['at']['fate']='transform'
fixed(5,'Workshop press','Supported reflector','Assembled solar furnace')
fixed(6,'Assembled solar furnace','Cleared cavern bay','Unpadded cavern floor','Protected cavern floor','Sealed growing room','Pressurized growing room','Lit growing room')
chapters[5]['recipes'][1]['at']['fate']='transform'
fixed(7,'Insulated berth frame','Uninsulated berth','Cave berth')
fixed(8,'Growing-room floor','Raised bed frames','Beds with unconnected drains','Beds with loose drain hoses','Beds with unconnected reservoir','Empty growing beds')
chapters[7]['recipes'][0]['at']['fate']='transform'

# 9. Medium changes the beds; the new water line is a separate fixed construction.
new('Prepared growing beds',9)
new('Irrigation supply line',9,'Fresh water feeds the existing reservoir. Its pump circulates solution through the three growing zones.')
ops(9,'Ceramic blocks [consume] @ Water processor -> Growing medium',
    'Growing medium [consume] @ Empty growing beds [transform] -> Prepared growing beds',
    'Clean service hose [consume] @ Water processor -> Irrigation supply line')
goals(9,('Fill the beds with clean porous medium','Prepared growing beds'),('Feed the shared water loop','Irrigation supply line'))
fixed(9,'Water processor','Empty growing beds','Prepared growing beds','Irrigation supply line')
note(9,'The fixed beds are the structure built in chapter 8. The hose supplies their existing reservoir from the fresh-water inlet; it does not replace the aerated return or add a pump. Supply connection and medium filling may happen in either order. The wash bench qualifies the fictional surveyed ceramic batch; untreated regolith is not suitable soil by default. Mineral nutrients and crop-compatible conditions belong to the delivered growing system. The thirty-square-metre farm supplies a dietary share, not complete nutritional independence.')

# 10–12. Three working zones, never three copied whole farms.
for name in ('Potato growing bay','Soybean growing row','Dry lettuce shelf'): new(name,10)
ops(10,'Packing foil [consume] + Clean cover fabric [consume] -> Foil-backed cloth',
    'Foil-backed cloth [consume] @ Potato growing bay [transform] -> Dark potato bay',
    'Seed potatoes [consume] @ Dark potato bay [transform] -> potato-bed',
    'Soybean seeds [consume] @ Soybean growing row [transform] -> soybean-row',
    'Clean cover fabric [consume] @ Dry lettuce shelf [transform] -> Wicking lettuce bed',
    'Lettuce seeds [consume] @ Wicking lettuce bed [transform] -> lettuce-tray')
fixed(10,'Potato growing bay','Dark potato bay','potato-bed','Soybean growing row','soybean-row','Dry lettuce shelf','Wicking lettuce bed','lettuce-tray')
note(10,'The three targets are existing zones of the completed chapter 9 beds. Each preparation or planting replaces only its own zone; the shared frame, reservoir and neighboring zones remain. Roots stay dark and leaves stay in the lamp light. The lettuce inlet lies below its shelf, so the supplied fabric draws water upward without another pump.')
rename('Clean preparation sink','Clean preparation basin')
fixed(11,'Clean preparation basin','lettuce-tray')
note(11,'This picking and first meal take place in the dry occupied alcove beside the actual farm. The ordinary clean bowl and utensils use fresh water from the service inlet upstream of the nutrient loop. The rooted lettuce stays in its bed; the basket, picked leaves and meal move. No second kitchen or relocated crop is supplied.')
fixed(12,'potato-bed','Extended potato bed','Hilled potato bed','soybean-row','Supported soybean row')
present('soybean-row',12,name='Unsupported soybean row')
present('lettuce-tray',11,name='Lettuce tray ready to pick')

# 15–16. The actual case is carried by the already present rover.
new('Expedition rover',16,'The delivered rover, with the refrigerated field case secured on its rear deck.')
new('Winch-ready crossing',16,'The portable winch is secured to the far-bank rock. Its line can pull along the supported wheel tracks.')
ops(16,'Steel [consume] + Cargo mesh [consume] -> Framed traction panels',
    'Framed traction panels [consume] @ Shallow wash crossing [transform] -> Supported traction panels',
    'Rover winch [consume] @ Supported traction panels [transform] -> Winch-ready crossing',
    'Expedition rover [transform] @ Winch-ready crossing -> Rover beyond the wash')
supplies(16,'Rover winch','Expedition rover')
fixed(16,'Shallow wash crossing','Supported traction panels','Winch-ready crossing','Rover beyond the wash')
note(16,'The same rover from chapter 15 starts on the near approach, carrying the actual refrigerated case. Its drag represents driving. The short panels lie lengthwise toward the distant ice and are supported by prepared ground, not suspended over a ravine. The supplied portable winch includes its own power module and padded anchor sling. Rig it at the far-bank rock; the panels do not anchor it. The final operation pays out the line, attaches it, crosses, releases and stows it. The crossing survives; only the rover changes into its distant fixed appearance. No live tether follows a drag. The return uses the same route.')
read('Rover winch','A portable powered recovery winch, with its matched line, padded anchor sling and integral power module.')

# 19–20. The industrial equipment is assembled on the prepared site.
new('Solar-array footing',19)
fixed(19,'Fuel-fab area','Fuel-fab footing','Solar-array footing','Industrial solar supply')
ops(19,'Working survey excavator @ Fuel-fab area [transform] -> Fuel-fab footing',
    'Spare solar modules [consume] @ Solar-array footing [transform] -> Industrial solar supply')
chapters[18]['note']+=' The delivered array has its own prepared mounting footing on the left. Installing modules replaces that fixed footing at the drop location. The separate equipment pad on the right is cleared for the process machinery and remains empty after the array is installed.'
fixed(20,'Processor polishing outlet','Electrolyzer stack','Unfed electrolysis rack','Fed electrolyzer','Buffered electrolysis rack')
ops(20,'Gas-control manifold [consume] @ Electrolyzer stack [transform] -> Unfed electrolysis rack',
    'Clean service hose [consume] @ Unfed electrolysis rack [transform] -> Fed electrolyzer',
    'Gas cylinders [consume] @ Fed electrolyzer [transform] -> Buffered electrolysis rack')
note(20,'The stack stands at its installed position, with power and cooling connected to the industrial services prepared in chapter 19. Its water inlet alone is unconnected. The hose visibly joins the processor’s polishing outlet. The completed rack has distinct dedicated hydrogen and oxygen receivers, separators and dryers. Gas cylinders denote compatible clean vessels, never one bottle copied between incompatible duties. Commissioning is bundled; both gases come from one water-splitting process.')
read('Gas-control manifold','Factory valve and control blocks with matching qualified service tails. Separate clean fittings serve each gas installation.')

# 21–24. One removable retort, then one stationary process installation.
new('Solar retort cradle',21,'The removable-vessel seat in the solar furnace already built outside the cave.')
fixed(21,'Workshop press','Solar retort cradle','Hydrogen-fed retort','Fuel-fab footing','Iron process frame')
chapters[20]['recipes'][2]['at']['ref']['id']=key('Solar retort cradle')
chapters[20]['recipes'][2]['at']['fate']='transform'
chapters[20]['recipes'][-1]['b']['fate']='transform'
new('Disconnected materials retort',23,'Cooled, isolated and released from the furnace cradle. The same supplied vessel travels in its handling carrier.')
ops(23,'Tool kit @ Hydrogen-fed retort [transform] -> Disconnected materials retort',
    'Sabatier catalyst cartridge [consume] + Disconnected materials retort [transform] -> Catalyzed retort',
    'Catalyzed retort [consume] @ Iron process frame [transform] -> Controlled methane reactor',
    'Compressed carbon dioxide @ Controlled methane reactor -> Unpurified methane test cylinder')
fixed(23,'Hydrogen-fed retort','Iron process frame','Controlled methane reactor')
note(23,'Only the supplied detachable retort vessel and carrier move. The furnace cradle stays. Its qualified gas connection is isolated and later reconnected at the fixed process frame; it is not stretched across the move. The mineral liner is exchanged for the clean compatible catalyst cartridge. Supplied controls handle heating, metering and cooling. This contained test precedes purification, recycle, storage and continuous production. Local iron supplies the frame, not the pressure vessel or catalyst.')
new('Cooling-panel sections',24,'Manageable metal panels carry qualified coolant tubing. Their installed area sheds the process heat.')
new('Reactor with uncooled separator',24)
ops(24,'Coolant tubing [consume] + Steel [consume] -> Cooling-panel sections',
    'Uncooled gas separator [consume] @ Controlled methane reactor [transform] -> Reactor with uncooled separator',
    'Cooling-panel sections [consume] @ Reactor with uncooled separator [transform] -> Purifying methane reactor',
    'Clean service hose [consume] @ Purifying methane reactor [transform] -> Water-recovering methane reactor',
    'Unpurified methane test cylinder [consume] @ Water-recovering methane reactor [transform] -> Purified methane supply')
fixed(24,'Controlled methane reactor','Reactor with uncooled separator','Purifying methane reactor','Water-recovering methane reactor','Purified methane supply')
note(24,'Fit the small imported separator first, then the locally made cooling-panel sections. A compact stock icon does not reduce the installed radiator area. Qualified coolant tubing remains separate from methane, recycled gas and drinking water. The existing workshop design supplies thermal contact and radiating area under the declared site/energy assumptions; thin-air convection is not the sole mechanism. Water returns to treatment only after separation and cooling exist. The actual reactor supplies continuous gas after the contained test.')

# 25. One compound with exactly two stores and two physical feed connections.
new('Methane feed lead',25,'The free receiver-end connection from the working methane purifier.')
new('Oxygen feed lead',25,'The oxygen-clean receiver-end connection from the electrolysis rack.')
bank=items[key('Refrigerated cryogenic tanks')]
bank['compound']=True
bank['slots']=[dict(name='Methane collected',accepts=key('Methane feed lead'),icon=None),dict(name='Oxygen collected',accepts=key('Oxygen feed lead'),icon=None)]
ops(25,'Cryogenic cooling units [consume] @ Cryogenic tanks [transform] -> Refrigerated cryogenic tanks',
    'Gas-control manifold [consume] @ Purified methane supply -> Methane feed lead',
    'Gas-control manifold [consume] @ Oxygen service outlet -> Oxygen feed lead')
goals(25,('Fit the refrigeration','Refrigerated cryogenic tanks'),('Collect both liquid propellants','Refrigerated cryogenic tanks[Methane feed lead, Oxygen feed lead]'))
fixed(25,'Cryogenic tanks','Refrigerated cryogenic tanks','Purified methane supply','Oxygen service outlet')
note(25,'The two actual factory vessels stay fixed. Each has its own refrigerator, keyed feed, vent and liquid path. The supplied common control wiring is installed with the refrigerators; no operation merges filled tanks. Each feed lead is already connected to its real source. Fitting it to the matching compound position includes the ordinary production interval and displays that tank’s level. Methane and oxygen remain separate. Qualified pressure/vacuum boundaries, cleanliness and capacity are supplied capabilities, not local fabrication or a validated current mission design.')

# 26. Both permitted filling/insulation orders stay in place.
new('Fresh-water filling tap',26,'The filling outlet in the dry service alcove, fed by the established drinking-water processor.')
new('Water filling hose',26,'The free filling end of the hose connected to the fresh-water outlet.')
new('Heat-recovery leads',26,'A matched supply-and-return pair from the indoor coolant service ports.')
ops(26,'Steel [consume] + Tool kit -> Steel tank without a coil',
    'Coolant tubing [consume] @ Steel tank without a coil [transform] -> Unfilled uninsulated tank',
    'Reflective insulation [consume] @ Unfilled uninsulated tank [transform] -> Unfilled insulated tank',
    'Clean service hose [consume] @ Fresh-water filling tap -> Water filling hose',
    'Water filling hose @ Unfilled insulated tank [transform] -> Unheated water tank',
    'Water filling hose @ Unfilled uninsulated tank [transform] -> Uninsulated filled tank',
    'Reflective insulation [consume] @ Uninsulated filled tank [transform] -> Unheated water tank',
    'Coolant tubing [consume] @ Indoor heat-recovery connection -> Heat-recovery leads',
    'Heat-recovery leads [consume] @ Unheated water tank [transform] -> Warm water tank')
fixed(26,'Fresh-water filling tap','Indoor heat-recovery connection','Steel tank without a coil','Unfilled uninsulated tank','Unfilled insulated tank','Uninsulated filled tank','Unheated water tank','Warm water tank')

# 27. Actual movable key, actual fixed controls; no machinery inside the panel.
new('Service key',27,'The removable operating key for the station’s service selectors. Turn the selector, then withdraw it for the next control.')
for name in ('Reserve power selector','Reserve power selected','Well isolation control','Well isolated and drained','Fuel-plant shutdown control','Fuel plant shut down'): new(name,27)
ops(27,'Service key @ Reserve power selector [transform] -> Reserve power selected',
    'Service key @ Well isolation control [transform] -> Well isolated and drained',
    'Service key @ Fuel-plant shutdown control [transform] -> Fuel plant shut down')
goals(27,('Put the station on reserve','Reserve power selected'),('Leave the exterior circuits safe',['Well isolated and drained','Fuel plant shut down']))
fixed(27,'Reserve power selector','Reserve power selected','Well isolation control','Well isolated and drained','Fuel-plant shutdown control','Fuel plant shut down')
supplies(27,'Service key')
read('Reserve power selected','The controllers keep power until their shutdown cycles finish. Air handling, reduced heat and laboratory cooling stay on the station reserve.')
read('Well isolated and drained','The well closes and drains into the raw-water receiver before its tracing switches off.')
read('Fuel plant shut down','The plant cools and isolates before power disconnects. The stores retain some liquid; separate outdoor vents release boil-off.')
note(27,'The panel is fixed scenery with three actual key-operated selectors. The supplied service key is inserted, turned and withdrawn in each operation; it remains movable and reusable. Well drainage and plant shutdown may finish in either order, retaining control power until complete. The charged battery module is installed in its bay within the existing battery/fuel-cell reserve, whose endurance covers the forecast at essential loads. High-temperature industrial and atmospheric processing stop; stored breathing gas, scrubbers and essential heating continue. Laboratory cooling is already on essential power. No machine is put inside the panel. All three completed selector states are required before proceeding.')

fixed(28,'Growing-room service rail','Screened growing area','Shared nutrient reservoir','Covered nutrient reservoir','Insulated nutrient reservoir')
chapters[27]['recipes'][1]['at']['fate']='transform'
chapters[27]['recipes'][2]['at']['fate']='transform'

# 29. Clean outdoors, reconnect an actual feeder, require the cleaned array.
new('Soft panel brush',29,'Fresh nonabrasive cloth wrapped around a smooth handle.')
new('Cleaned station solar array',29)
new('Station solar inlet',29)
new('Habitat power lead',29,'This feeder is attached to the habitat inlet. Its free plug belongs at the cleaned array.')
rename('restored-power','Station solar array')
ops(29,'Steel [consume] + Clean cover fabric [consume] -> Soft panel brush',
    'Soft panel brush @ station-power [transform] -> Cleaned station solar array',
    'Power cable [consume] @ Station solar inlet -> Habitat power lead',
    'Habitat power lead [consume] @ Cleaned station solar array [transform] -> restored-power')
goals(29,('Clean the outdoor panels','Cleaned station solar array'),('Restore the well and fuel plant','restored-power'))
fixed(29,'station-power','Cleaned station solar array','restored-power','Station solar inlet')
supplies(29)
note(29,'The same outdoor array is isolated and dusty. Cleaning changes it in place; the habitat feeder cannot reconnect until the cleaned-array state exists. Its other end is already at the actual habitat inlet. The controller then performs the established restart sequence: warming, checking and priming the well before reopening process feeds. Earlier shutdown goals are complete. The arrays are never carried inside, and no panel token is moved. The original array identity retires into the cleaned and restored states.')
read('restored-power','The lamps brighten. The controller warms, checks and primes the well before reopening the process feeds. The plant can replace the propellant lost during the storm.')
for control,label in [('Reserve power selected','Station power selector'),('Well isolated and drained','Well service control'),('Fuel plant shut down','Fuel-plant service control')]: present(control,30,name=label)

# 30. Replace the temporary support without moving a footing or a lander.
ops(30,'Working survey excavator @ Cribbed landing platform [transform] -> Prepared support ground',
    'Steel [consume] @ Prepared support ground [transform] -> Replacement landing leg',
    'Tool kit @ Replacement landing leg [transform] -> Level launch platform')
fixed(30,'Cribbed landing platform','Prepared support ground','Replacement landing leg','Level launch platform')
goals(30,('Build the permanent ground support','Replacement landing leg'),('Transfer the load onto the new support','Level launch platform'))
note(30,'The temporary crib has held the same cabin roughly upright since chapter 1. Grade the permanent footing clear of the loaded crib. Build the braced replacement in place from qualified salvaged steel and checked ceramic blocks, then use the supplied spacecraft service lifting equipment and normal fastening/load-transfer procedure. The tool kit is not an unexplained jack. The crib is replaced by the permanent support; the upper cabin, tanks and engine are unchanged. The whole fixed worksite changes in place. No mound of rocks lies beneath the lander. The lower stage and its repair stay on Mars.')
read('Level launch platform','The permanent support takes the load. I can remove the temporary crib. This leg will stay on Mars when the upper cabin leaves.')

# 31. Two physical transfer lines and two independent flight-tank connections.
new('Propellant transfer lines',31,'Two supplied insulated transfer lines, separately rated and keyed for methane and oxygen. They never share a liquid path.')
new('Methane transfer outlet',31)
new('Oxygen transfer outlet',31)
new('Methane transfer hose',31,'The store end is connected. This keyed coupling belongs at the lander’s methane port.')
new('Oxygen transfer hose',31,'The oxygen-clean store end is connected. This coupling belongs at the separate oxygen port.')
flight=items[key('Lander propellant service connections')]
flight['compound']=True
flight['slots']=[dict(name='Methane tank filled',accepts=key('Methane transfer hose'),icon=None),dict(name='Oxygen tank filled',accepts=key('Oxygen transfer hose'),icon=None)]
ops(31,'Propellant transfer lines [consume] @ Methane transfer outlet -> Methane transfer hose',
    'Propellant transfer lines [consume] @ Oxygen transfer outlet -> Oxygen transfer hose')
goals(31,('Fill both separate ascent tanks','Lander propellant service connections[Methane transfer hose, Oxygen transfer hose]'))
fixed(31,'Methane transfer outlet','Oxygen transfer outlet','Lander propellant service connections')
supplies(31,'Propellant transfer lines')
note(31,'These outlets belong to the actual two stores completed in chapter 25 and replenished after restart. Each supplied hose has a source end and a separately keyed spacecraft end. Installing either physical connector updates only its own fixed compound position and tank indication. Both are required. The habitat control panel remains indoors. Ordinary transfer isolation, disconnection and stowage are completed before the later boarding view; the spacecraft does not depart with hoses attached. The staged lander and its lower support remain the same vehicle. Rates and collection duration retain the declared future mission abstraction.')

# Mature harvest states are chapter supplies of the same physical crop beds.
# Separate readiness identities keep fresh supper harvesting distinct from the
# first lettuce meal; a generic reusable leaf stock would skip that operation.
fixed(32,'Assembled solar furnace')
fixed(33,'Potato bed ready to lift','Soybean row ready to gather','Lettuce tray ready to pick')
chapters[32]['note']+=' The three harvest targets are the mature states of the existing fixed crop beds, at the same positions. Readiness is supplied at this chapter boundary rather than pretending an early seedling is already harvestable. Supper lettuce is a fresh separate harvest, not leaves retained from chapter 11.'
for r in chapters[32]['recipes']:
    if r['result']['id']==key('Soaked soybeans'):
        r['a']=operand('Dry soybeans [transform]');r['b']=operand('Water filling hose');r.pop('at',None)
new('Water-source core cradle',34)
new('Remote-band core cradle',34)
new('Flight-stowed source core',34)
new('Flight-stowed remote core',34)
fixed(34,'Water-source core cradle','Flight-stowed source core','Remote-band core cradle','Flight-stowed remote core','Flight specimen locker','Flight-stowed membrane')
ops(34,'Stored source core [transform] @ Water-source core cradle [transform] -> Flight-stowed source core',
    'Case with an articulated body [transform] @ Remote-band core cradle [transform] -> Flight-stowed remote core',
    'First body on membrane [transform] @ Flight specimen locker [transform] -> Flight-stowed membrane')
goals(34,('Secure both cores on flight cooling',['Flight-stowed source core','Flight-stowed remote core']),('Secure the original membrane','Flight-stowed membrane'))
# The three existing specimens arrive in their qualified transfer containment;
# show their actual sealed liners/holder at this closer cabin view.
supplies(34,'Stored source core','Case with an articulated body','First body on membrane')
present('Stored source core',34,name='Water-source core',icon='assets/items/sealed-source-core.png')
present('Case with an articulated body',34,name='Remote-band core',icon='assets/items/sealed-band-core.png')
intro(34,'Rendezvous clearance. Inside the cabin, three empty places wait for the things we found.')
note(34,'Loading takes place inside the same ascent cabin used in chapter 35. Qualified cold-transfer containment bridges the laboratory-to-cabin move. Each whole core stays sealed with its surrounding ice and is transferred into its own assigned flight-refrigerated cradle; no open ice is warmed in cabin air. The source core and remote band core remain distinct. Their drag includes the ordinary contained transfer, fastening and cooling connection. The original fragmented membrane stays in its sealed holder in a separate small locker. All three may be secured in any order. Empty field-case/freezer/transfer hardware stays behind. There is no exterior hull-loading step or invented portable carrier to assemble.')
intro(35,'I take the pilot’s seat and close the hatch. The last command is mine.')
new('Ascent underway',35)
items['ascent-underway']['readings']=copy.deepcopy(items['rising-cabin']['readings'])
ops(35,'Arming plug [consume] @ Flight console [transform] -> Ascent underway')
goals(35,('Fit the arming plug and launch','Ascent underway'))
fixed(35,'Flight console','Ascent underway')

# Remove replaced supplies/declarations; references below still protect needed items.
removed=['Standing solar array','Charged essential reserve','Surface radio','Reserve charging connection',
    'Drinking water supply','Unwatered growing beds','Irrigated growing beds','Unfinished growing beds',
    'Anchored rover winch','Sound rock anchor','Hydrogen service outlet','Process cooling panel','Cooled separator module',
    'Tank of liquid methane','Tank of liquid oxygen','Running fuel fab','Station service panel',
    'Array cleaning bench','Root-medium wash bench','Lander support ground','Tilted lander','Fueled ascent tanks','Rising cabin',
    'Cold transfer bench','Refrigerated flight bay','Cores on flight cooling','Flight sample carrier','Conditioned flight carrier','Carrier with source core','Flight-packed cores']
removed_ids={key(x) for x in removed}
for c in chapters:
    c['supplies']=[i for i in c['supplies'] if i not in removed_ids]
    c['fixed']={i:d for i,d in c['fixed'].items() if i not in removed_ids}

# Canonical fixed receivers use @, including ordinary material-on-construction steps.
for c in chapters:
    for r in c['recipes']:
        if r.get('b') and not r.get('at'):
            af=r['a']['ref']['id'] in c['fixed'];bf=r['b']['ref']['id'] in c['fixed']
            if af and bf: raise ValueError(f"Two fixed ingredients remain in chapter {c['number']}: {r}")
            if af or bf:
                if af: r['a'],r['b']=r['b'],r['a']
                r['at']=r.pop('b')

used=set()
def use(r):
    used.add(r['id']);used.update(r.get('slots',[]))
for c in chapters:
    used.update(c['fixed']);used.update(c['supplies'])
    for g in c['goals']:
        for condition in g['conditions']: use(condition['ref'])
    for r in c['recipes']:
        use(r['result'])
        for operand_name in ('a','b','at'):
            if operand_name in r: use(r[operand_name]['ref'])
for i in list(used):
    for slot in items[i]['slots']: used.add(slot['accepts'])
if used & removed_ids: raise ValueError('References to removed items: '+str(used & removed_ids))
items={k:v for k,v in items.items() if k in used}

items[key('Dark potato bay')]['name']='Wrapped potato bed'
read('potato-bed','The seed pieces go below the medium. Leaves need the lamps; developing tubers stay buried.')
read('Cabin mattress','A thin inflatable sleeping pad from the lander, folded for stowage.')
rename('workshop-press','Materials press')
intro(5,'The mission came to test what this ground could become. The excavator has brought the first material to the press.')
read('Screened regolith','Even grain sizes give the press a consistent feedstock.')
read('Fuel-fab footing','I grade the ground and lay fired blocks beneath the equipment positions.')
# No unexplained workshop building: the machinery stands on its own outdoor feet.
for c in chapters:
    c['intro']=c['intro'].replace("workshop's local-propellant contingency",'local-propellant contingency')
    c['note']=c['note'].replace('modular workshop and life-support spares','modular materials equipment and life-support spares').replace("compact workshop's material cycles","compact machinery's material cycles").replace('existing workshop design','supplied equipment design')
chapters[4]['note']+=' The delivered outdoor-rated press and solar furnace stand on individual supports on Martian soil. No workshop, roof, tent, shelves or finished work building is supplied or constructed.'
for it in items.values():
    for r in it['readings']:
        r['text']=r['text'].replace('farm, cabin and workshop','farm, cabin and materials equipment')

items[key('First body on membrane')]['name']='Patterned fragments on membrane'
read('first-body-on-membrane','![Damaged fragments under magnification](assets/fixed/items/first-body-on-membrane.png)\n\nA curve repeats in two of the broken flakes. Melted, pumped, caught in a filter—nothing has come through whole. I seal the holder and send the images to Earth.')
chapters[17]['intro']='The new core is back in the laboratory. The intake fragments gave us only hints. Here the dark fleck still has its surroundings.'
read('Case with an articulated body','![The complete outline within untouched ice](assets/fixed/discoveries/intact-body-in-ice.png)\n\nI leave the focus there for a long time. Then I send the view to Earth. Both cores settle onto laboratory cooling; the first fragments remain sealed in their membrane holder.')
chapters[12]['note']=chapters[12]['note'].replace("The articulated ancient body is the story's extraordinary fictional premise. Morphology alone establishes neither age nor native origin.","The first view contains damaged ambiguous fragments, not a resolved organism. Heating, pumping and filtration have compromised their original arrangement. The later untouched core supplies the recognizable articulated outline; neither view establishes age, chemistry or native origin.")

# Default asset paths for newly authored images. No placeholder art is generated here.
for k,it in items.items():
    if not it['icon']: it['icon']=f'assets/fixed/items/{k}.png'
    for slot in it['slots']:
        if not slot['icon']: slot['icon']=f"assets/fixed/overlays/{k}-{slot['accepts']}.png"

art_file=PROD/'artwork.json'
if art_file.exists():
    art=json.loads(art_file.read_text())
    for k,metadata in art.get('items',{}).items():
        if k not in items:
            if k in removed_ids: continue
            raise ValueError(f'Unknown artwork item {k}')
        items[k].update({p:v for p,v in metadata.items() if p!='presentations'})
        items[k]['presentations']+=metadata.get('presentations',[])
    for ch,metadata in art.get('chapters',{}).items():
        c=chapters[int(ch)-1]
        if 'image' in metadata: c['image']=metadata['image']
        for k,d in metadata.get('fixed',{}).items():
            if k not in c['fixed']:
                if k in removed_ids: continue
                raise ValueError(f'Unknown fixed artwork {ch} {k}')
            c['fixed'][k].update(d)
        c['places']=metadata.get('places',{})

def rtext(r):
    return '`'+r['id']+'`'+('['+', '.join('`'+s+'`' for s in r['slots'])+']' if r.get('slots') else '')
def itext(i): return rtext(i['ref'])+' ['+i['fate']+']'
def recipe_text(r):
    s=itext(r['a'])
    if 'b' in r: s+=' + '+itext(r['b'])
    if 'at' in r: s+=' @ '+itext(r['at'])
    return s+' -> '+rtext(r['result'])

out=['# Mars: A Place That Can Endure','','A hard landing, a home beneath the rock, and a discovery worth bringing back.','',
    '> NOTE: Mars v12 fixed-item revision. Hotspots lists the items fixed in this chapter, including possible constructed states. A listed derived item appears only after its actual construction. Every identity is explicitly declared; references use stable IDs. Fixed receiver fates are authored beside the @ operand. Read design-brief.md and the fixed-item production record for physical continuity and scene registration.','']

for c in chapters:
    n=c['number'];out+=['## `ch%02d` %s'%(n,c['name']),'',f"![{c['name']}]({c['image']})",'']
    if c['intro']: out += [c['intro'],'']
    if c['note']: out += [c['note'],'']
    if c['goals']:
        out += ['**Goals**']
        if len(c['goals'])==3 and not all(g['next'] for g in c['goals'][1:]):
            out += ['- (three goals are a lot but okay here because each established crop zone has its own planting task)']
        for g in c['goals']:
            line='- '+('next: ' if g['next'] else '')+g['text']
            if len(g['conditions'])==1:
                q=g['conditions'][0];line+=' -- '+rtext(q['ref'])+(' @ `'+q['at']+'`' if q.get('at') else '')
                out.append(line)
            else:
                out.append(line)
                for j,q in enumerate(g['conditions']): out.append('  - '+('both: ' if j==0 else 'and: ')+rtext(q['ref']))
        out.append('')
    if c['fixed']:
        out += ['**Hotspots**']
        reasons={2:'the outdoor array, processor and dish each have a separate commissioning task',3:'the well, treatment inlet and connecting pipe occupy distinct places on one route',9:'the existing water inlet supplies a separately fixed pipe beside the growing beds',10:'the potato, soybean and lettuce zones each have their own planting task',21:'the press, furnace retort seat and process-frame footing are distinct outdoor installations',25:'two separate source outlets feed the two-vessel storage bank',26:'the tank receives water and coolant through separate existing service outlets',27:'one key operates three separate installed service selectors',31:'the two store outlets connect separately to the spacecraft service panel',33:'the three surviving crop zones are harvested in place',34:'each of the three actual specimens has its own assigned place inside the cabin'}
        if n in reasons: out.append('- (three hotspots are a lot but okay here because '+reasons[n]+')')
        for k,d in c['fixed'].items():
            out.append(f"- `{k}` (at {d['x']:g}%, {d['y']:g}%)")
            if d.get('icon'): out.append(f"  - icon: ![{items[k]['name']}]({d['icon']})")
            for place in c.get('places',{}).get(k,[]): out.append(f"  - place: `{place['id']}` (at {place['x']:g}%, {place['y']:g}%)")
        out.append('')
    declarations=[k for k,it in items.items() if it['chapter']==n]
    supplied=[k for k in dict.fromkeys(c['supplies']) if k not in declarations]
    if declarations or supplied:
        out += ['**Items**']
        for k in declarations:
            it=items[k];head=f"- `{k}` {it['name']}"
            if it['compound']: head+=' (compound)'
            if it.get('exclusive'): head+=' (exclusive with `'+it['exclusive']+'`)'
            out.append(head)
            pos=it.get('position');suffix=f" (at {pos['x']:g}%, {pos['y']:g}%)" if pos else ''
            out.append(f"  - icon: ![{it['name']}]({it['icon']}){suffix}")
            presentations={}
            for p in it['presentations']:
                presentations.setdefault(p['chapter'],{}).update({a:b for a,b in p.items() if a!='chapter'})
            for ch,p in sorted(presentations.items()):
                if 'name' in p: out.append(f"  - from chapter `ch{ch:02d}`: {p['name']}")
                if 'icon' in p: out.append(f"  - from chapter `ch{ch:02d}` icon: ![{p.get('name',it['name'])}]({p['icon']})")
            for slot in it['slots']:
                out.append(f"  - slot: {slot['name']}, accepts `{slot['accepts']}`, icon: ![{slot['name']}]({slot['icon']})")
            for w in it['readings']:
                out.append('')
                prefix='['+', '.join('`'+s+'`' for s in w['requires'])+'] ' if w['requires'] else ''
                out += ['  '+line if line else '' for line in (prefix+w['text']).splitlines()]
            out.append('')
        for k in supplied: out.append(f'- `{k}`')
        if supplied: out.append('')
    if c['recipes']:
        out += ['**Combinations**']
        for j,r in enumerate(c['recipes']): out.append('- '+recipe_text(r)+(' (tutorial)' if n==1 and j==0 else ''))
        out += ['','']

(STORY/'mars.md').write_text('\n'.join(out).rstrip()+'\n')
(PROD/'manuscript-manifest.json').write_text(json.dumps(dict(items=items,chapters=chapters),indent=2,ensure_ascii=False)+'\n')
print(f'Wrote {len(chapters)} chapters, {len(items)} declared identities, '+
      f"{sum(len(c['recipes']) for c in chapters)} explicit recipes; "+
      f"{sum(len(i['slots']) for i in items.values())} compound fittings.")
