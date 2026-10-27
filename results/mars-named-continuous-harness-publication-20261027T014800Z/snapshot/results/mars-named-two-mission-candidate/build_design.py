"""Build/check a finite authored design sheet. Not a game engine, search policy or play."""
import json, pathlib, hashlib
OUT=pathlib.Path('results/mars-named-two-mission-candidate')
R=[]
def r(a,b,c,at=None,retire=None):
 d=dict(a=a,b=b,result=c)
 if at:d['at']=at
 if retire:d.update(retire=retire,retirementReason='Radio is the evolved successor of the obsolete broken radio; cable is not consumed.')
 R.append(d)
# Shared contact/power spine and genuine alternative signal inventions.
r('broken-radio','cable','radio',retire=['broken-radio'])
r('solar-panel','battery','solar-charger');r('solar-charger','radio','solar-radio');r('solar-radio','dish','long-range-radio');r('long-range-radio','tripod','relay-station')
r('battery','lamp','lantern');r('lantern','reflector','signal-lamp');r('signal-lamp','tripod','signal-beacon');r('solar-charger','lamp','solar-lamp');r('solar-charger','heater','solar-heater')
# Portable water and different actual named service tools.
r('heater','place:glacier','meltwater');r('scoop','place:glacier','ice-sample');r('heater','ice-sample','meltwater');r('meltwater','water-filter','filtered-water');r('filtered-water','canister','water-canister')
r('water-filter','hand-pump','filter-pump');r('hose','valve','watering-hose');r('water-canister','watering-hose','drip-irrigator');r('water-canister','hand-pump','garden-sprayer')
r('dark-basin','clear-cover','solar-still');r('meltwater','solar-still','distilled-water','sunny-ledge');r('distilled-water','canister','water-canister')
# Growing forms: tabletop and full-sized structures are no longer synonyms.
r('seeds','planting-tray','seed-tray');r('water-canister','seed-tray','watered-seed-tray');r('water-canister','seed-tray','sprouted-tray','warm-habitat');r('watered-seed-tray','place:warm-habitat','sprouted-tray')
r('sprouted-tray','clear-cover','propagator');r('propagator','heater','heated-propagator');r('frame','clear-cover','cold-frame');r('cold-frame','sprouted-tray','planted-cold-frame');r('greenhouse-frame','propagator','greenhouse');r('greenhouse','solar-heater','heated-greenhouse')
r('soil','compost','potting-mix');r('potting-mix','empty-planter','filled-planter');r('potatoes','filled-planter','potato-planter');r('potato-planter','water-canister','growing-potato-planter','warm-habitat')
r('growing-potato-planter','greenhouse','potato-harvest','growing-court');r('growing-potato-planter','planted-cold-frame','potato-harvest','growing-court');r('growing-potato-planter','heated-greenhouse','potato-harvest','growing-court')
# Repairs/protection are conventional devices, not arbitrary bags.
r('habitat-fabric','sealant','pressure-patch','repair-bench');r('frame','habitat-fabric','shelter-tent');r('shelter-tent','insulation','insulated-tent');r('blanket','foil','thermal-blanket');r('cloth','frame','windscreen');r('mesh','frame','dust-screen')
r('fan','air-filter','air-cleaner');r('fan','duct','ventilator');r('sealed-box','gloves','glovebox');r('glovebox','lamp','illuminated-glovebox')
# Movement, viewing and lifting.
r('frame','wheels','cart');r('cart','motor','rover');r('rover','solar-charger','solar-rover');r('solar-rover','radio','radio-rover');r('cart','water-canister','water-cart');r('frame','skis','sled');r('winch','rope','hoist');r('hoist','tripod','tripod-hoist');r('ramp','hinge','folding-ramp');r('solar-panel','hinge','folding-solar-panel')
r('camera','tripod','field-camera');r('field-camera','place:overlook','panorama');r('panorama','map','survey-map');r('binoculars','map','survey-map','overlook')
# Workshop and a properly bridged food ending.
r('frame','toolkit','workbench');r('workbench','solar-lamp','lit-workbench');r('workbench','lantern','lit-workbench');r('workbench','clamp','clamping-bench');r('lens','tube','telescope');r('telescope','tripod','field-telescope');r('lens','lamp','inspection-lamp');r('foil','frame','reflector');r('reflector','heater','radiant-heater');r('reflector','dark-cooking-pot','solar-cooker')
r('potato-harvest','solar-cooker','baked-potatoes','sunny-ledge');r('potatoes','solar-cooker','baked-potatoes','sunny-ledge');r('potato-harvest','water-canister','potato-soup','galley')
# Explicit portable findings: camera is present in both imaging apparatuses.
r('camera','illuminated-glovebox','imaging-glovebox')
r('ice-sample','imaging-glovebox','ice-photograph')
r('ice-sample','sample-jar','sealed-ice-sample')
r('field-telescope','camera','telescope-camera')
r('telescope-camera','place:distant-lookout','cliff-photograph')
r('cliff-photograph','survey-map','annotated-survey-map')
PLACES={
 'contact-ridge':'Orbiter contact point; radio or optical signaling can serve the first contact objective.',
 'glacier':'Heater+place makes portable meltwater; scoop+place makes a portable ice sample.',
 'water-point':'A movable delivery slot; earlier water delivery is a milestone, not a later lock.',
 'warm-habitat':'Warm germination setting. The actual target must be here for a contextual recipe; watered tray+place also produces a portable sprouted tray.',
 'repair-bench':'Clamping tools for a pressure patch, not an accumulated-components container.',
 'airlock':'Current pressure-patch placement.',
 'expedition-gate':'A firm route where a hand cart is a valid alternative to a motorized rover.',
 'overlook':'A useful vantage for a portable panorama or map comparison; no hidden earlier residence requirement.',
 'navigation-table':'Current survey-map placement.',
 'field-water':'A field equipment point for a filter pump, not a claim that an unmodeled water network has operated.',
 'loading-bay':'An existing overhead support permits a hoist; a tripod hoist is also useful without needing that support.',
 'workshop':'A work area needing a lit bench; a plain/clamping bench is not falsely treated as light.',
 'growing-court':'A cultivation/harvest episode setting, not a simulated timer. Actual target operand (growing planter or greenhouse/planted cold frame) must be here; the binary combination produces a portable harvest. Either orientation is legal; a dragged garden leaves its current placement.',
 'irrigation-point':'A useful watering-tool placement, accepting drip irrigator or filled garden sprayer.',
 'pantry':'Delivery of a harvest is a milestone; it can later move to cooking without sticky placement.',
 'sunny-ledge':'Actual solar heating context for still/cooker. Revealed only for a relevant objective when that apparatus is present, or for the solar meal option.',
 'galley':'A cooking space with a pot and hotplate: harvest+water canister here makes portable potato soup. Food can then be placed here, displacing the canister.',
 'relay-ridge':'Current long-range contact point.',
 'dusty-workroom':'Optional scenario site needing an air cleaner or ventilator as specified by its objective.',
 'inspection-nook':'Optional inspection objective; choose the actual device purpose before selecting accepted kinds.',
 'cold-camp':'Optional insulated-shelter objective.',
 'ice-route':'Optional sled-route objective.'
}
PLACES.update({
 'cold-camp':'A sheltered field living site; insulated tent is weather shelter, not a breathable Mars atmosphere simulation.',
 'ice-route':'An icy freight approach where skis, rather than the home route wheels, serve the disclosed task.',
 'rest-berth':'An existing sheltered berth needing a personal thermal blanket, not a substitute for the camp tent.',
 'dusty-workroom':'Existing enclosed sample workroom; cleaner filters airborne dust, ventilator is not an accepted substitute.',
 'air-exchange':'A separate existing duct opening for air exchange, not a second occupant of the dust-cleaner slot.',
 'inspection-nook':'Contained illuminated specimen photography with an actual camera-equipped glovebox.',
 'image-archive':'Portable photograph delivery; a scientific result here is an image, not an inferred discovery of life.',
 'sample-store':'Existing cold specimen store accepting a sealed sample jar, not a loose ice photograph.',
 'distant-lookout':'Vantage across a fissure; telescope camera produces a portable photograph of the opposite cliff.',
 'field-map-table':'Updated map for the next field team, distinct from the retained home navigation table.',
 'camp-approach':'Visual approach marker for returning travelers; optical beacon is distinct from long-range radio contact.'
})
G=[]
def g(id,title,accept,place,mode,supplies,locations,conditional=None):
 G.append(dict(id=id,title=title,accepts=accept,location=place,mode=mode,supplies=supplies,requiredLocations=locations,conditionalLocations=conditional or []))
g('repair','Reconnect the radio',['radio'],None,'milestone',['broken-radio','cable'],[])
g('contact','Contact the orbiter',['solar-radio','long-range-radio','signal-beacon'],'contact-ridge','milestone',['solar-panel','battery','radio','lamp','foil','frame','tripod'],['contact-ridge'])
g('water','Bring usable water home',['water-canister'],'water-point','milestone',['heater','water-filter','canister','dark-basin','clear-cover'],['glacier','water-point'],[dict(when='solar-still',locations=['sunny-ledge'])])
g('growth','Start protected growth',['propagator','heated-propagator'],'warm-habitat','milestone',['seeds','planting-tray','clear-cover','water-canister'],['warm-habitat'])
g('patch','Seal the habitat',['pressure-patch'],'airlock','current',['habitat-fabric','sealant'],['repair-bench','airlock'])
g('mobility','Prepare field transport',['cart','rover','solar-rover','radio-rover'],'expedition-gate','current',['frame','wheels','motor','solar-charger'],['expedition-gate'])
g('survey','Prepare a usable route map',['survey-map'],'navigation-table','current',['camera','tripod','map','binoculars'],['overlook','navigation-table'])
g('field-water','Equip the field water point',['filter-pump'],'field-water','current',['water-filter','hand-pump'],['field-water'])
g('lifting','Rig a lifting point',['hoist','tripod-hoist'],'loading-bay','current',['winch','rope','tripod'],['loading-bay'])
g('work','Light a real workbench',['lit-workbench'],'workshop','current',['frame','toolkit','lamp','solar-charger','battery'],['workshop'])
g('garden','Establish the growing court',['greenhouse','planted-cold-frame','heated-greenhouse'],'growing-court','current',['greenhouse-frame','propagator','frame','clear-cover','sprouted-tray'],['growing-court'])
g('irrigation','Equip useful watering',['drip-irrigator','garden-sprayer'],'irrigation-point','current',['hose','valve','water-canister','hand-pump'],['irrigation-point'])
g('harvest','Bring in a crop',['potato-harvest'],'pantry','milestone',['soil','compost','empty-planter','potatoes','water-canister'],['warm-habitat','growing-court','pantry'])
g('meal','Prepare a warm meal',['baked-potatoes','potato-soup'],'galley','current',['foil','frame','dark-cooking-pot','potato-harvest','water-canister'],['galley'],[dict(when='solar-cooker',locations=['sunny-ledge'])])
g('relay','Leave long-range contact ready',['long-range-radio','relay-station'],'relay-ridge','current',['solar-radio','dish','tripod'],['relay-ridge'])
# Mission 2 continues the same world; no token reset, implicit copy, or goal retirement.
g('ice-haul','Equip the icy approach',['sled'],'ice-route','current',['skis'],['ice-route'])
g('camp-shelter','Shelter the remote camp',['insulated-tent'],'cold-camp','current',['insulation'],['cold-camp'])
g('rest','Warm the sheltered resting berth',['thermal-blanket'],'rest-berth','current',['blanket'],['rest-berth'])
g('clean-air','Filter dust from the sample workroom',['air-cleaner'],'dusty-workroom','current',['fan','air-filter'],['dusty-workroom'])
g('ventilation','Ventilate the enclosed workroom',['ventilator'],'air-exchange','current',['duct'],['air-exchange'])
g('contained-imaging','Prepare contained specimen photography',['imaging-glovebox'],'inspection-nook','current',['sealed-box','gloves'],['inspection-nook'])
g('ice-image','Return a close photograph of glacier ice',['ice-photograph'],'image-archive','current',['scoop'],['glacier','image-archive'])
g('ice-specimen','Store a sealed ice specimen',['sealed-ice-sample'],'sample-store','current',['sample-jar'],['sample-store'])
g('cliff-view','Record the cliff beyond the fissure',['cliff-photograph'],None,'milestone',['lens','tube'],['distant-lookout'])
g('field-chart','Leave a photograph-annotated field map',['annotated-survey-map'],'field-map-table','current',[],['field-map-table'])
g('way-home','Mark the camp approach visibly',['signal-beacon'],'camp-approach','current',[],['camp-approach'])
# Routes are authored plans, not generated solutions.
def C(a,b,at=None):return dict(type='combine',a=a,b=b,**({'at':at} if at else {}))
def P(a,p):return dict(type='place',a=a,place=p)
normal=[
 [C('broken-radio','cable')],
 [C('solar-panel','battery'),C('solar-charger','radio'),P('solar-radio','contact-ridge')],
 [C('heater','place:glacier'),C('meltwater','water-filter'),C('filtered-water','canister'),P('water-canister','water-point')],
 [C('seeds','planting-tray'),C('seed-tray','water-canister'),C('watered-seed-tray','place:warm-habitat'),C('sprouted-tray','clear-cover'),P('propagator','warm-habitat')],
 [P('sealant','repair-bench'),C('habitat-fabric','sealant','repair-bench'),P('pressure-patch','airlock')],
 [C('frame','wheels'),C('cart','motor'),C('rover','solar-charger'),P('solar-rover','expedition-gate')],
 [C('camera','tripod'),C('field-camera','place:overlook'),C('panorama','map'),P('survey-map','navigation-table')],
 [C('water-filter','hand-pump'),P('filter-pump','field-water')],
 [C('winch','rope'),C('hoist','tripod'),P('tripod-hoist','loading-bay')],
 [C('frame','toolkit'),C('solar-charger','lamp'),C('workbench','solar-lamp'),P('lit-workbench','workshop')],
 [C('greenhouse-frame','propagator'),P('greenhouse','growing-court')],
 [C('hose','valve'),C('watering-hose','water-canister'),P('drip-irrigator','irrigation-point')],
 [C('soil','compost'),C('potting-mix','empty-planter'),C('potatoes','filled-planter'),P('water-canister','warm-habitat'),C('potato-planter','water-canister','warm-habitat'),C('growing-potato-planter','greenhouse','growing-court'),P('potato-harvest','pantry')],
 [C('foil','frame'),C('reflector','dark-cooking-pot'),P('solar-cooker','sunny-ledge'),C('potato-harvest','solar-cooker','sunny-ledge'),P('baked-potatoes','galley')],
 [C('dish','solar-radio'),C('long-range-radio','tripod'),P('relay-station','relay-ridge')]
]
generousInitial=['radio','solar-charger','solar-still','propagator','cold-frame','sprouted-tray','workbench','lantern','growing-potato-planter','filter-pump','hoist']
generous=[
 [],[C('solar-charger','radio'),P('solar-radio','contact-ridge')],
 [C('heater','place:glacier'),P('solar-still','sunny-ledge'),C('meltwater','solar-still','sunny-ledge'),C('distilled-water','canister'),P('water-canister','water-point')],
 [P('propagator','warm-habitat')],
 [P('sealant','repair-bench'),C('habitat-fabric','sealant','repair-bench'),P('pressure-patch','airlock')],
 [C('frame','wheels'),P('cart','expedition-gate')],
 [P('map','overlook'),C('binoculars','map','overlook'),P('survey-map','navigation-table')],
 [P('filter-pump','field-water')],[P('hoist','loading-bay')],
 [C('workbench','lantern'),P('lit-workbench','workshop')],
 [C('cold-frame','sprouted-tray'),P('planted-cold-frame','growing-court')],
 [C('hand-pump','water-canister'),P('garden-sprayer','irrigation-point')],
 [C('growing-potato-planter','planted-cold-frame','growing-court'),P('potato-harvest','pantry')],
 [P('water-canister','galley'),C('potato-harvest','water-canister','galley'),P('potato-soup','galley')],
 [C('dish','solar-radio'),P('long-range-radio','relay-ridge')]
]
# Identical later goals are actually traversed after each complete opening route.
remote=[
 [C('frame','skis'),P('sled','ice-route')],
 [C('frame','habitat-fabric'),C('shelter-tent','insulation'),P('insulated-tent','cold-camp')],
 [C('blanket','foil'),P('thermal-blanket','rest-berth')],
 [C('fan','air-filter'),P('air-cleaner','dusty-workroom')],
 [C('fan','duct'),P('ventilator','air-exchange')],
 [C('sealed-box','gloves'),C('glovebox','lamp'),C('camera','illuminated-glovebox'),P('imaging-glovebox','inspection-nook')],
 [C('scoop','place:glacier'),C('ice-sample','imaging-glovebox'),P('ice-photograph','image-archive')],
 [C('ice-sample','sample-jar'),P('sealed-ice-sample','sample-store')],
 [C('lens','tube'),C('telescope','tripod'),C('field-telescope','camera'),C('telescope-camera','place:distant-lookout')],
 [C('cliff-photograph','survey-map'),P('annotated-survey-map','field-map-table')],
 [C('battery','lamp'),C('lantern','reflector'),C('signal-lamp','tripod'),P('signal-beacon','camp-approach')]
]
normal+=remote
import copy
generousRemote=copy.deepcopy(remote)
generousRemote[-1]=[C('foil','frame'),C('lantern','reflector'),C('signal-lamp','tripod'),P('signal-beacon','camp-approach')]
generous+=generousRemote
outputs={r['result'] for r in R}
# Previously discovered outputs remain accessible, never arrive as new supplies.
for goal in G:goal['supplies']=[k for k in goal['supplies'] if k not in outputs]
kinds={k for r in R for k in [r['a'],r['b'],r['result']] if not k.startswith('place:')};base=sorted(kinds-outputs)
assert len({(tuple(sorted([r['a'],r['b']])),r.get('at')) for r in R})==len(R)
for rr in R:
 for old in rr.get('retire',[]):
  assert old in [rr['a'],rr['b']]
  assert not any(x is not rr and old in [x['a'],x['b']] for x in R)
  assert not any(old in x['accepts'] for x in G)
for goal in G:
 assert set(goal['supplies'])<=kinds
 assert set(goal['requiredLocations'])<=set(PLACES)
 if goal['location']:assert goal['location'] in goal['requiredLocations']
# Narrow consistency walk: no searching, no real physics, no actor/player interface.
def audit(name,initial,groups):
 tokens={x:None for x in initial};ever=set(initial);retired=set();revealed=set();introduced=[];seenGoals=set();trace=[];loads=[];counts={'combine':0,'place':0};active=None
 def reveal():
  for gg in introduced:
   for cond in gg['conditionalLocations']:
    if cond['when'] in tokens:revealed.update(cond['locations'])
 def truth(gg):return any(x in tokens and (gg['location'] is None or tokens[x]==gg['location']) for x in gg['accepts'])
 def milestones():
  for gg in introduced:
   if truth(gg):seenGoals.add(gg['id'])
 def give(kind):
  if kind in tokens:return
  if kind in retired:return
  if kind=='broken-radio' and 'radio' in tokens:return
  assert kind in base, f'{name}: illegal output grant {kind} at {active}'
  tokens[kind]=None;ever.add(kind)
 assert len(groups)==len(G),(name,"missing objective route groups")
 for gg,actions in zip(G,groups):
  active=gg['id'];introduced.append(gg);revealed.update(gg['requiredLocations'])
  for k in gg['supplies']:give(k)
  reveal();milestones()
  startLoad=dict(things=len(tokens),loose=sum(v is None for v in tokens.values()),revealedLocations=len(revealed),occupiedLocations=sum(v is not None for v in tokens.values()))
  for a in actions:
   before=dict(tokens)
   if a['type']=='place':
    assert a['a'] in tokens and a['place'] in revealed,(name,active,a)
    for k,p in list(tokens.items()):
     if p==a['place'] and k!=a['a']:tokens[k]=None
    tokens[a['a']]=a['place'];detail={'displaced':[k for k,p in before.items() if p==a['place'] and k!=a['a']]}
   else:
    assert a['a'] in tokens,(name,active,a)
    bp=a['b'].startswith('place:')
    assert (a['b'][6:] in revealed) if bp else (a['b'] in tokens),(name,active,a)
    context=None if bp else tokens[a['b']]
    assert not a.get('at') or a['at']==context,(name,'invalid context',a,context)
    matches=[rr for rr in R if sorted([rr['a'],rr['b']])==sorted([a['a'],a['b']])]
    rr=next((rr for rr in matches if rr.get('at')==context and context is not None),None) or next((rr for rr in matches if rr.get('at') is None),None)
    assert rr,(name,'no named recipe',a,context)
    assert rr['result'] not in tokens,(name,'duplicate result',a,rr['result'])
    tokens[a['a']]=None
    for old in rr.get('retire',[]):tokens.pop(old);retired.add(old)
    tokens[rr['result']]=None;ever.add(rr['result']);detail={'result':rr['result'],'targetContext':context,'retired':rr.get('retire',[])}
   counts[a['type']]+=1;reveal();milestones();trace.append(dict(index=len(trace)+1,objective=active,action=a,consequence=detail,currentlyTrue=[x['id'] for x in introduced if truth(x)],historicallyCompleted=sorted(seenGoals)))
  loads.append(dict(objective=active,start=startLoad,end=dict(things=len(tokens),loose=sum(v is None for v in tokens.values()),revealedLocations=len(revealed),occupiedLocations=sum(v is not None for v in tokens.values()))))
  assert gg['id'] in seenGoals,(name,'objective not completed',active)
 assert all(truth(gg) for gg in G if gg['mode']=='current'),(name,'current endpoint false')
 return dict(condition=name,workspaceLoads=loads,startingIntactThings=initial,counts=counts,totalSelections=sum(counts.values()),allMilestonesCompleted=True,currentEndpoint=[dict(id=gg['id'],satisfied=truth(gg)) for gg in G if gg['mode']=='current'],pastMilestoneCurrentTruth=[dict(id=gg['id'],current=truth(gg),historicallyCompleted=gg['id'] in seenGoals) for gg in G if gg['mode']=='milestone'],retired=sorted(retired),retainedKnowledge=sorted(ever),finalTokens=tokens,trace=trace)
A=audit('ordinary sparse progressive supplies',[],normal);B=audit('generous intact-salvage alternative',generousInitial,generous)
import copy
alternative=copy.deepcopy(normal)
alternative[1]=[C('battery','lamp'),C('foil','frame'),C('lantern','reflector'),C('signal-lamp','tripod'),P('signal-beacon','contact-ridge')]
alternative[5]=[C('solar-panel','battery')]+alternative[5]
alternative[14]=[C('solar-charger','radio')]+alternative[14]
alternative[13]=alternative[13][1:] # Reuse the optical signal's existing reflector.
alternative[-1]=[P('signal-beacon','camp-approach')] # Already made for optical contact; reuse, do not duplicate.
ALT=audit('ordinary optical-first alternative',[],alternative)
simple=copy.deepcopy(normal)
simple[5]=[C('frame','wheels'),P('cart','expedition-gate')]
simple[6]=[P('map','overlook'),C('binoculars','map','overlook'),P('survey-map','navigation-table')]
simple[8]=[C('winch','rope'),P('hoist','loading-bay')]
simple[11]=[C('hand-pump','water-canister'),P('garden-sprayer','irrigation-point')]
simple[13]=[P('water-canister','galley'),C('potato-harvest','water-canister','galley'),P('potato-soup','galley')]
simple[14]=[C('dish','solar-radio'),P('long-range-radio','relay-ridge')]
simple[-1]=[C('foil','frame')]+simple[-1] # Soup did not need the reflector; build it for the beacon.
SIMPLE=audit('ordinary sparse simple-tool alternative',[],simple)
D=dict(status='Design sheet and narrow authored-route consistency check, not an implemented game or fresh play',version='named-mars-two-mission-paper-1',missions=[dict(id='home',objectives=[g['id'] for g in G[:15]]),dict(id='remote-ice-camp',objectives=[g['id'] for g in G[15:]])],recipes=R,baseThings=base,allKinds=sorted(kinds),locations=PLACES,objectives=G,generousInitial=generousInitial,semantics=['One global token per kind; output exists => no creation.', 'Dragged A becomes loose; B stays unless explicit opted-in retirement.', 'Only broken radio retires; knowledge persists, ordinary inputs are not consumed.', 'Context comes from actual target B location, never a free override.', 'Location operand makes loose portable output.', 'Placement swaps existing occupant loose, never accumulates ingredients.', 'Supplies/places introduced per objective; conditional place reveal is explicitly item-and-objective bound.', 'Past milestone truth may regress; final current goals must all hold together.'])
for name,obj in [('candidate.json',D),('normal-route.json',A),('generous-route.json',B),('optical-first-route.json',ALT),('simple-tool-route.json',SIMPLE)]: (OUT/name).write_text(json.dumps(obj,indent=2)+'\n')
summary=dict(kind='Static authored-route validation only',recipes=len(R),namedKinds=len(kinds),baseThings=len(base),objectives=len(G),currentObjectives=sum(g['mode']=='current' for g in G),ordinary=A['counts'],ordinaryTotal=A['totalSelections'],generous=B['counts'],generousTotal=B['totalSelections'],opticalFirst=ALT['counts'],opticalFirstTotal=ALT['totalSelections'],excluded=['automatic objective/supply introduction','queries','navigation','implicit internals','retained knowledge','no fresh player or duration inference'],limitations=['Named semantics only, no implementation/interaction verification','Generous condition starts with11 declared intact advanced things; not equivalent to ordinary novice experience','Longer route is not optimum, quota, minimum or a demonstrated preference','Cultivation and cooking represent game episodes, not elapsed-time/real-survival simulation'])
summary['sparseSimple']=SIMPLE['counts'];summary['sparseSimpleTotal']=SIMPLE['totalSelections']
summary['missionBreakdown']={x['condition']:{m:{k:sum(t['action']['type']==k for t in x['trace'] if (t['objective'] in [g['id'] for g in G[:15]])==(m=='home')) for k in ['combine','place']} for m in ['home','remote-ice-camp']} for x in [A,B,ALT,SIMPLE]}
(OUT/'workspace-load-audit.json').write_text(json.dumps({x['condition']:x['workspaceLoads'] for x in [A,B,ALT,SIMPLE]},indent=2)+'\n')
(OUT/'audit-summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2))
