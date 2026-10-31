"""Independent JSON-only two-scene replay. No candidate-builder imports."""
import json,pathlib,hashlib
root=pathlib.Path('results/mars-named-scenario-boundary-candidate');old=pathlib.Path('results/mars-named-two-mission-candidate');out=pathlib.Path('results/mars-named-scenario-boundary-review')
D=json.loads((root/'candidate.json').read_text());H=json.loads((old/'candidate.json').read_text());R=D['recipes'];outputs={r['result'] for r in R};base=set(H['allKinds'])-outputs
assert len({(frozenset([r['a'],r['b']]),r.get('at')) for r in R})==len(R)
manifest=json.loads((old/'publication-manifest.json').read_text())
for f in manifest['files']:
 p=pathlib.Path(f['path']);assert p.stat().st_size==f['bytes'] and hashlib.sha256(p.read_bytes()).hexdigest()==f['sha256'],f['path']
assert D['sourceManifestSHA256']==hashlib.sha256((old/'publication-manifest.json').read_bytes()).hexdigest()
def truth(g,b):return any(k in b and (g['location'] is None or b[k]==g['location']) for k in g['accepts'])
def act(a,b,places,other,retired):
 assert a['a'] in b
 if a['type']=='place':
  assert a['place'] in places
  for k in b:
   if b[k]==a['place']:b[k]=None
  b[a['a']]=a['place'];return None
 k=a['b'];context=None
 if k.startswith('place:'):assert k[6:] in places
 else:assert k in b;context=b[k]
 if 'at' in a:assert a['at']==context
 matches=[r for r in R if frozenset([r['a'],r['b']])==frozenset([a['a'],k]) and (r.get('at') is None or r.get('at')==context)]
 matches.sort(key=lambda r:r.get('at') is not None,reverse=True);assert matches;r=matches[0]
 assert r['result'] not in set(b)|set(other)|retired
 b[a['a']]=None
 for k in r.get('retire',[]):assert k=='broken-radio';del b[k];retired.add(k)
 b[r['result']]=None
 assert len([v for v in b.values() if v])==len(set(v for v in b.values() if v))
 return r['result']
checks=[]
for name in ['normal','optical-first','simple-tool','generous']:
 route=json.loads((root/(name+'-route.json')).read_text());source=json.loads((old/(name+'-route.json')).read_text());home={k:None for k in source['startingIntactThings']};places=set();retired=set();introduced=[];seen=set()
 def refresh():
  for g in introduced:
   for c in g['conditionalLocations']:
    if c['when'] in home:places.update(c['locations'])
   if truth(g,home):seen.add(g['id'])
 for g in H['objectives'][:15]:
  introduced.append(g);places.update(g['requiredLocations'])
  for k in g['supplies']:
   assert k in base
   if k not in retired and not(k=='broken-radio' and 'radio' in home):home.setdefault(k,None)
  refresh()
  for t in [t for t in source['trace'] if t['objective']==g['id']]:act(t['action'],home,places,{},retired);refresh()
  assert g['id'] in seen
 assert route['completedHomeSnapshot']==home
 assert route['homeRevealedLocations']==sorted(places)
 snapshot=dict(home);known=set(home)|retired;field={}
 for x in route['transferManifest']:
  k=x['kind'];assert k in home;assert home[k]==x['fromLocation'];assert x['toScene']=='ice-field' and x['toLocation'] is None
  field[k]=None;del home[k]
 assert not set(home)&set(field)
 assert set(home)|set(field)==set(snapshot)
 assert all(truth(g,home) for g in H['objectives'][:15] if g['mode']=='current')
 assert route['activeHomeTokens']==home
 assert route['knownAtDeparture']==sorted(known)
 places=set();introduced=[];seen=set();loads=[];results=[]
 def load():return dict(things=len(field),loose=sum(v is None for v in field.values()),locations=len(places))
 for g in D['fieldObjectives']:
  introduced.append(g);places.update(g['requiredLocations'])
  for k in g['supplies']:
   assert k in base and k not in set(home)|set(field)|retired;field[k]=None
  start=load()
  for t in [t for t in route['trace'] if t['objective']==g['id']]:
   result=act(t['action'],field,places,home,retired);assert result==t['result'];assert result not in known
   assert t['previouslyKnownResult']==(False if result else None)
   assert not set(home)&set(field)
   now=[gg['id'] for gg in introduced if truth(gg,field)];assert now==t['currentlyTrue'];seen.update(now);results.append(result)
  assert g['id'] in seen;loads.append(dict(objective=g['id'],start=start,end=load()))
 assert loads==route['workspaceLoads'];assert field==route['activeFieldTokens'];assert snapshot==route['completedHomeSnapshot'];assert retired==set(route['retiredKinds'])
 assert all(truth(g,field) for g in D['fieldObjectives'] if g['mode']=='current')
 assert route['counts']=={k:sum(t['action']['type']==k for t in route['trace']) for k in ['combine','place']}
 assert route['totalFreshFieldSelections']==len(route['trace']);assert route['previouslyKnownOutputsReconstructed']==0
 assert route['transferSelectionsExcluded']==len(route['transferManifest']);assert route['scenarioEntrySelectionsExcluded']==1
 checks.append(dict(condition=name,homeSnapshotThings=len(snapshot),activeHomeThings=len(home),transferredKinds=[x['kind'] for x in route['transferManifest']],freshFieldSelections=len(route['trace']),finalFieldLoad=load(),retainedHomeCurrentGoals=10,fieldCurrentGoals=5,allChecksPassed=True))
report=dict(status='Independent reconstruction passes all four routes; boundary/navigation remains a design contract, not implementation evidence',routes=checks,sourceHashes={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in root.glob('*') if p.is_file()})
(out/'replay.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(checks,indent=2))
