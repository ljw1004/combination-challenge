"""Independent level collection: authored gesture replay, not engine, search or play."""
import json, pathlib, copy
ROOT=pathlib.Path('results'); OUT=ROOT/'mars-named-independent-levels-candidate'
old=json.loads((ROOT/'mars-named-two-mission-candidate/candidate.json').read_text())
bound=json.loads((ROOT/'mars-named-scenario-boundary-candidate/candidate.json').read_text())
R=bound['recipes']; locations=old['locations']; base=set(old['baseThings'])
def C(a,b):return dict(type='combine',a=a,b=b)
def P(a,p):return dict(type='place',a=a,place=p)
def goal(id,title,accept,place,supplies,places,mode='current'):
 return dict(id=id,title=title,accepts=accept,location=place,supplies=supplies,places=places,mode=mode)
def oldg(id,supplies=None):
 g=copy.deepcopy(next(g for g in old['objectives'] if g['id']==id));g['places']=g.pop('requiredLocations');g.pop('conditionalLocations');
 if supplies is not None:g['supplies']=supplies
 return g
normal=json.loads((ROOT/'mars-named-two-mission-candidate/normal-route.json').read_text())
simple=json.loads((ROOT/'mars-named-two-mission-candidate/simple-tool-route.json').read_text())
def route(source,id):return [t['action'] for t in source['trace'] if t['objective']==id]
L=[]
def level(id,title,initial,goals,routes):L.append(dict(id=id,title=title,initial=initial,goals=goals,routes=routes))
level('contact','Restore contact with the orbiter',['broken-radio','cable'],[oldg('repair',[]),oldg('contact',['solar-panel','battery','lamp','foil','frame','tripod'])],{
 'ordinary':[route(normal,'repair'),route(normal,'contact')],
 'simple':[route(normal,'repair'),route(normal,'contact')],
 'optical':[[C('broken-radio','cable')],[C('battery','lamp'),C('foil','frame'),C('lantern','reflector'),C('signal-lamp','tripod'),P('signal-beacon','contact-ridge')]]})
level('water','Make usable water and a field pump',['heater','canister'],[oldg('water',['water-filter','dark-basin','clear-cover']),oldg('field-water',['hand-pump'])],{
 'ordinary':[route(normal,'water'),route(normal,'field-water')], 'simple':[route(normal,'water'),route(normal,'field-water')],
 'distillation':[[C('heater','place:glacier'),C('dark-basin','clear-cover'),P('solar-still','sunny-ledge'),C('meltwater','solar-still'),C('distilled-water','canister'),P('water-canister','water-point')],route(normal,'field-water')]})
# Sunny ledge openly present when water objective arrives, no hidden conditional reveal.
L[-1]['goals'][0]['places'].append('sunny-ledge')
level('shelter','Protect first growth, seal a habitat, and light a workbench',['water-canister','frame','battery','lamp'],[oldg('growth',['seeds','planting-tray','clear-cover']),oldg('patch'),oldg('work',['toolkit','solar-panel'])],{
 'ordinary':[route(normal,'growth'),route(normal,'patch'),[C('frame','toolkit'),C('solar-panel','battery'),C('solar-charger','lamp'),C('workbench','solar-lamp'),P('lit-workbench','workshop')]],
 'simple':[route(normal,'growth'),route(normal,'patch'),[C('frame','toolkit'),C('battery','lamp'),C('workbench','lantern'),P('lit-workbench','workshop')]]})
level('travel','Prepare transport, a survey map, and a relay',['frame','solar-charger','radio','tripod'],[oldg('mobility',['wheels','motor']),oldg('survey',['camera','map','binoculars']),oldg('relay',['dish'])],{
 'ordinary':[route(normal,'mobility'),route(normal,'survey'),[C('solar-charger','radio')]+route(normal,'relay')],
 'simple':[route(simple,'mobility'),route(simple,'survey'),[C('solar-charger','radio')]+route(simple,'relay')]})
level('garden','Establish a garden, harvest, and prepare a meal',['propagator','water-canister','frame','sprouted-tray'],[oldg('garden',['greenhouse-frame','clear-cover']),oldg('irrigation',['hose','valve','hand-pump']),oldg('harvest'),oldg('meal',['foil','dark-cooking-pot'])],{
 'ordinary':[route(normal,'garden'),route(normal,'irrigation'),route(normal,'harvest'),route(normal,'meal')],
 'simple':[route(normal,'garden'),route(simple,'irrigation'),route(normal,'harvest'),route(simple,'meal')]})
L[-1]['goals'][-1]['places'].append('sunny-ledge')
L[-1]['goals'][-1]['mode']='milestone' # A meal prepared is an achievement, not indefinite uneaten food.
level('ice','Photograph glacier ice and the distant cliff',['frame','habitat-fabric','solar-lamp','field-camera','map'],[
 oldg('ice-haul'),oldg('camp-shelter'),
 goal('ice-image','Return a contained close photograph',['ice-photograph'],'image-archive',['sealed-box','gloves','scoop'],['glacier','image-archive']),
 oldg('ice-specimen'),oldg('cliff-view'),
 goal('field-chart','Leave a photograph-annotated map',['annotated-survey-map'],'field-map-table',[],['field-map-table'])],{
 'ordinary':[route(normal,'ice-haul'),route(normal,'camp-shelter'),[C('sealed-box','gloves'),C('glovebox','solar-lamp'),C('field-camera','illuminated-glovebox'),C('scoop','place:glacier'),C('ice-sample','imaging-glovebox'),P('ice-photograph','image-archive')],route(normal,'ice-specimen'),[C('lens','tube'),C('field-camera','telescope'),C('telescope-camera','place:distant-lookout')],[C('cliff-photograph','map'),P('annotated-survey-map','field-map-table')]]})
L[-1]['routes']['simple']=copy.deepcopy(L[-1]['routes']['ordinary'])
# All choices share declared starts and staged supplies; alternate solutions never count as extra duration.
D=dict(status='Independent saved levels; design/replay only, no player evidence',recipes=R,locations=locations,levels=L,semantics=[
 'Each level is a separately authored board, not travel to another part of one conserved world.',
 'Completion and learned recipe knowledge persist; tokens and goal truth belong to their level.',
 'Starts are individually named, including intact inventions; no transfer or retrieval is required.',
 'One token of each kind per board; a known recipe may create a kind absent from this board.',
 'Ordinary inputs persist. Only broken radio explicitly retires when evolved to radio.',
 'Target B actual location selects contextual recipe before novelty; A moves loose, B stays.',
 'A+place yields portable result. Placement displaces old occupant; current goals regress.',
 'After completion the final board and completion record are saved, never secretly discarded.' ])
def replay(level,variant,known):
 tokens=dict.fromkeys(level['initial']);ever=set(tokens);retired=set();places=set();history=set();introduced=[];trace=[];loads=[];counts=dict(combine=0,place=0);rebuilt=[]
 def truth(g):return any(k in tokens and (g['location'] is None or tokens[k]==g['location']) for k in g['accepts'])
 def load():return dict(things=len(tokens),loose=sum(p is None for p in tokens.values()),places=len(places),occupied=sum(p is not None for p in tokens.values()))
 for g,actions in zip(level['goals'],level['routes'][variant]):
  introduced.append(g);places.update(g['places'])
  for k in g['supplies']:
   assert k in base,(level['id'],'undeclared output grant',k)
   if k not in retired:tokens.setdefault(k,None);ever.add(k)
  start=load()
  for a in actions:
   before=dict(tokens);assert a['a'] in tokens,a
   if a['type']=='place':
    assert a['place'] in places
    for k,v in list(tokens.items()):
     if v==a['place']:tokens[k]=None
    tokens[a['a']]=a['place'];detail=dict(displaced=[k for k,v in before.items() if v==a['place'] and k!=a['a']])
   else:
    bp=a['b'].startswith('place:');assert a['b'][6:] in places if bp else a['b'] in tokens
    context=None if bp else tokens[a['b']]
    matches=[r for r in R if sorted([r['a'],r['b']])==sorted([a['a'],a['b']])]
    r=next((r for r in matches if context is not None and r.get('at')==context),None) or next((r for r in matches if 'at' not in r),None)
    assert r,(level['id'],a,context);assert r['result'] not in tokens,(level['id'],'duplicate',a)
    if a.get('at'):assert a['at']==context
    tokens[a['a']]=None
    for k in r.get('retire',[]):tokens.pop(k);retired.add(k)
    tokens[r['result']]=None;ever.add(r['result'])
    if r['result'] in known:rebuilt.append(r['result'])
    detail=dict(result=r['result'],targetContext=context,retired=r.get('retire',[]))
   counts[a['type']]+=1
   history.update(g['id'] for g in introduced if truth(g))
   trace.append(dict(index=len(trace)+1,goal=g['id'],action=a,consequence=detail,tokens=dict(tokens),load=load(),current=[g['id'] for g in introduced if truth(g)],completed=sorted(history)))
  assert g['id'] in history,(level['id'],'incomplete',g['id'])
  loads.append(dict(goal=g['id'],start=start,end=load()))
 assert all(truth(g) for g in introduced if g['mode']=='current')
 known.update(t['consequence']['result'] for t in trace if 'result' in t['consequence'])
 return dict(level=level['id'],variant=variant,startingThings=level['initial'],counts=counts,total=sum(counts.values()),reconstructedKnownOutputs=rebuilt,loads=loads,trace=trace,savedCompletion=sorted(history),savedBoard=tokens,finalLoad=load())
summary={}
for variant in ['ordinary','simple']:
 known=set();runs=[replay(l,variant,known) for l in L]
 (OUT/(variant+'-collection-route.json')).write_text(json.dumps(runs,indent=2)+'\n')
 summary[variant]=dict(totalOperations=sum(x['total'] for x in runs),combines=sum(x['counts']['combine'] for x in runs),placements=sum(x['counts']['place'] for x in runs),levels=[{k:x[k] for k in ['level','total','counts','finalLoad','reconstructedKnownOutputs']} for x in runs],distinctConstructedOutputs=len(known),maxBoardThings=max(x['finalLoad']['things'] for x in runs))
for l in L:
 for variant in l['routes']:
  if variant not in ['ordinary','simple']:(OUT/(l['id']+'-'+variant+'-route.json')).write_text(json.dumps(replay(l,variant,set()),indent=2)+'\n')
(OUT/'candidate.json').write_text(json.dumps(D,indent=2)+'\n');(OUT/'audit-summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2))
