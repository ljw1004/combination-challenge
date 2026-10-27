"""Explicit two-scene design and authored witnesses; no UI, player or timing model."""
import json,pathlib,copy,hashlib
ROOT=pathlib.Path('results/mars-named-two-mission-candidate');OUT=pathlib.Path('results/mars-named-scenario-boundary-candidate')
D=json.loads((ROOT/'candidate.json').read_text());R=copy.deepcopy(D['recipes']);homeGoals=D['objectives'][:15]
for a,b,c in [('solar-lamp','glovebox','illuminated-glovebox'),('lantern','glovebox','illuminated-glovebox'),('field-camera','illuminated-glovebox','imaging-glovebox'),('field-camera','telescope','telescope-camera'),('cliff-photograph','map','annotated-survey-map')]:R.append(dict(a=a,b=b,result=c))
def C(a,b):return dict(type='combine',a=a,b=b)
def P(a,p):return dict(type='place',a=a,place=p)
def goal(id,title,accept,location,mode,supplies,places):return dict(id=id,title=title,accepts=[accept],location=location,mode=mode,supplies=supplies,requiredLocations=places,conditionalLocations=[])
G=[goal('ice-haul','Bring a sled to the icy approach','sled','ice-route','current',['skis'],['ice-route']),goal('field-shelter','Shelter the field stop','insulated-tent','cold-camp','current',['insulation'],['cold-camp']),goal('close-view','Return a contained close photograph of the ice','ice-photograph','image-archive','current',['sealed-box','gloves','scoop'],['glacier','image-archive']),goal('specimen','Store a sealed specimen for comparison','sealed-ice-sample','sample-store','current',['sample-jar'],['sample-store']),goal('distant-view','Photograph the cliff beyond the fissure','cliff-photograph',None,'milestone',['lens','tube'],['distant-lookout']),goal('field-chart','Leave a photograph-annotated field map','annotated-survey-map','field-map-table','current',[],['field-map-table'])]
def truth(g,t):return any(k in t and (g['location'] is None or t[k]==g['location']) for k in g['accepts'])
def act(a,local,other,revealed,retired):
 assert a['a'] in local,a
 if a['type']=='place':
  assert a['place'] in revealed
  for k,p in local.items():
   if p==a['place']:local[k]=None
  local[a['a']]=a['place'];return None
 bp=a['b'].startswith('place:');assert (a['b'][6:] in revealed if bp else a['b'] in local)
 context=None if bp else local[a['b']]
 matches=[r for r in R if sorted([r['a'],r['b']])==sorted([a['a'],a['b']])]
 rr=next((r for r in matches if r.get('at')==context and context is not None),None) or next((r for r in matches if r.get('at') is None),None)
 assert rr,(a,context)
 assert rr['result'] not in local and rr['result'] not in other and rr['result'] not in retired,('global novelty',a)
 local[a['a']]=None
 for k in rr.get('retire',[]):del local[k];retired.add(k)
 local[rr['result']]=None;return rr['result']
def home_replay(route):
 local={k:None for k in route['startingIntactThings']};revealed=set();retired=set();seen=set()
 for g in homeGoals:
  for k in g['supplies']:
   if k not in local and k not in retired and not(k=='broken-radio' and 'radio' in local):local[k]=None
  revealed.update(g['requiredLocations'])
  for gg in homeGoals[:homeGoals.index(g)+1]:
   for cond in gg['conditionalLocations']:
    if cond['when'] in local:revealed.update(cond['locations'])
  for t in [x for x in route['trace'] if x['objective']==g['id']]:
   # Optional location reveals can be caused by this very action.
   act(t['action'],local,{},revealed,retired)
   for gg in homeGoals[:homeGoals.index(g)+1]:
    for cond in gg['conditionalLocations']:
     if cond['when'] in local:revealed.update(cond['locations'])
   if truth(g,local):seen.add(g['id'])
  assert truth(g,local) or g['id'] in seen,g['id']
 assert all(truth(g,local) for g in homeGoals if g['mode']=='current')
 return local,revealed,retired
ALL=[]
for name in ['normal','optical-first','simple-tool','generous']:
 route=json.loads((ROOT/(name+'-route.json')).read_text());home,homePlaces,retired=home_replay(route);snapshot=copy.deepcopy(home)
 light='solar-lamp' if 'solar-lamp' in home else 'lantern'
 camera='field-camera' if 'field-camera' in home else 'camera'
 loadout=['frame','habitat-fabric',light,camera,'map']+([] if camera=='field-camera' else ['tripod'])
 transfer=[];field={}
 for k in loadout:
  assert k in home;transfer.append(dict(kind=k,fromLocation=home[k],toScene='ice-field',toLocation=None));field[k]=None;del home[k]
 assert all(truth(g,home) for g in homeGoals if g['mode']=='current'),('loan regressed home',name)
 # No creation at transfer: historical snapshot is not another active board.
 assert not set(home)&set(field)
 plans=[[C('frame','skis'),P('sled','ice-route')],[C('frame','habitat-fabric'),C('shelter-tent','insulation'),P('insulated-tent','cold-camp')],[C('sealed-box','gloves'),C(light,'glovebox'),C(camera,'illuminated-glovebox'),C('scoop','place:glacier'),C('ice-sample','imaging-glovebox'),P('ice-photograph','image-archive')],[C('ice-sample','sample-jar'),P('sealed-ice-sample','sample-store')],[C('lens','tube')]+([C('field-camera','telescope')] if camera=='field-camera' else [C('telescope','tripod'),C('field-telescope','camera')])+[C('telescope-camera','place:distant-lookout')],[C('cliff-photograph','map'),P('annotated-survey-map','field-map-table')]]
 revealed=set();trace=[];loads=[];known=set(snapshot)|retired;introduced=[];seen=set()
 for g,actions in zip(G,plans):
  introduced.append(g);revealed.update(g['requiredLocations'])
  for k in g['supplies']:
   assert k not in home and k not in field and k not in retired,('supply duplication',k)
   field[k]=None
  def load():return dict(things=len(field),loose=sum(x is None for x in field.values()),locations=len(revealed))
  start=load()
  for a in actions:
   out=act(a,field,home,revealed,retired)
   assert not set(home)&set(field)
   for gg in introduced:
    if truth(gg,field):seen.add(gg['id'])
   trace.append(dict(index=len(trace)+1,objective=g['id'],action=a,result=out,previouslyKnownResult=out in known if out else None,currentlyTrue=[gg['id'] for gg in introduced if truth(gg,field)]))
  assert g['id'] in seen
  loads.append(dict(objective=g['id'],start=start,end=load()))
 assert all(truth(g,field) for g in G if g['mode']=='current')
 counts={k:sum(t['action']['type']==k for t in trace) for k in ['combine','place']}
 evidence=dict(condition=name,completedHomeSnapshot=snapshot,homeRevealedLocations=sorted(homePlaces),transferManifest=transfer,activeHomeTokens=home,activeFieldTokens=field,homeCurrentGoalsAfterTransfer=[dict(id=g['id'],satisfied=truth(g,home)) for g in homeGoals if g['mode']=='current'],fieldCurrentGoals=[dict(id=g['id'],satisfied=truth(g,field)) for g in G if g['mode']=='current'],retiredKinds=sorted(retired),knownAtDeparture=sorted(known),counts=counts,totalFreshFieldSelections=len(trace),transferSelectionsExcluded=len(transfer),scenarioEntrySelectionsExcluded=1,previouslyKnownOutputsReconstructed=sum(t['previouslyKnownResult'] is True for t in trace),workspaceLoads=loads,trace=trace)
 (OUT/(name+'-route.json')).write_text(json.dumps(evidence,indent=2)+'\n');ALL.append(evidence)
S=dict(status='Separate-scene design-only, no implementation or fresh play',sourceManifestSHA256=hashlib.sha256((ROOT/'publication-manifest.json').read_bytes()).hexdigest(),recipes=R,fieldObjectives=G,fieldPlaces={k:D['locations'][k] for g in G for k in g['requiredLocations']},boundaryContract=['Completed home snapshot is historical evidence, not a second active token set.','Named transfers remove actual tokens from active home and place them loose in field; no duplication.','Player sees and confirms individually named equipment, not a generic kit.','Active home remains separately accessible; it is not secretly discarded.','Field board reveals only its own places and supplies; known recipe knowledge is retained across scenes.','Global result novelty spans both active scenes. A stored home result cannot be recreated remotely.','Transfers and entering a scenario are disclosed separately from fresh combine/place actions.','No claim that total selections equal interesting decisions or a 200-decision campaign.'],summary=[dict(condition=x['condition'],startingFieldThings=len(x['transferManifest']),freshFieldSelections=x['totalFreshFieldSelections'],counts=x['counts'],finalFieldLoad=x['workspaceLoads'][-1]['end'],reconstructedKnownResults=x['previouslyKnownOutputsReconstructed']) for x in ALL])
(OUT/'candidate.json').write_text(json.dumps(S,indent=2)+'\n');print(json.dumps(S['summary'],indent=2))
