"""Independent reconstruction from serialized contract; never imports candidate builder."""
import json,pathlib,copy
P=pathlib.Path('results/mars-named-independent-levels-candidate');O=pathlib.Path('results/mars-named-independent-levels-review')
d=json.loads((P/'candidate.json').read_text());recipes=d['recipes'];outputs={r['result'] for r in recipes};kinds={k for r in recipes for k in [r['a'],r['b'],r['result']] if not k.startswith('place:')}
assert len({(tuple(sorted([r['a'],r['b']])),r.get('at')) for r in recipes})==len(recipes)
assert {k for r in recipes for k in r.get('retire',[])}=={'broken-radio'}
def apply(tokens,places,a):
 t=dict(tokens); assert a['a'] in t
 if a['type']=='place':
  assert a['place'] in places
  for k,v in t.items():
   if v==a['place']:t[k]=None
  t[a['a']]=a['place'];return t,dict(displaced=[k for k,v in tokens.items() if v==a['place'] and k!=a['a']])
 assert a['type']=='combine'
 target=a['b'];isplace=target.startswith('place:')
 assert target[6:] in places if isplace else target in t
 context=None if isplace else t[target]
 found=[r for r in recipes if {r['a'],r['b']}=={a['a'],target}]
 contextual=[r for r in found if 'at' in r and r['at']==context]
 plain=[r for r in found if 'at' not in r]
 rr=(contextual or plain);assert len(rr)==1
 r=rr[0];assert r['result'] not in t
 if 'at' in a:assert a['at']==context
 t[a['a']]=None
 for k in r.get('retire',[]):del t[k]
 t[r['result']]=None
 return t,dict(result=r['result'],targetContext=context,retired=r.get('retire',[]))
def load(t,p):return dict(things=len(t),loose=sum(v is None for v in t.values()),places=len(p),occupied=sum(v is not None for v in t.values()))
def truth(g,t):return any(k in t and (g['location'] is None or t[k]==g['location']) for k in g['accepts'])
def replay(l,variant,evidence,known):
 t=dict.fromkeys(l['initial']);assert len(t)==len(l['initial']);assert set(t)<=kinds
 p=set();retired=set();history=set();introduced=[];i=0;rebuilt=[];peak=0;startloads=[]
 assert len(l['goals'])==len(l['routes'][variant])
 for gi,(g,acts) in enumerate(zip(l['goals'],l['routes'][variant])):
  introduced.append(g);p.update(g['places']);assert p<=set(d['locations'])
  assert g['location'] is None or g['location'] in p
  assert not set(g['supplies'])&outputs
  for k in g['supplies']:
   assert k in kinds
   if k not in retired:t.setdefault(k,None)
  start=load(t,p);startloads.append(start);peak=max(peak,len(t));assert start==evidence['loads'][gi]['start']
  for a in acts:
   t,consequence=apply(t,p,a);retired.update(consequence.get('retired',[]));peak=max(peak,len(t))
   occupied=[v for v in t.values() if v is not None];assert len(occupied)==len(set(occupied))
   history|={g['id'] for g in introduced if truth(g,t)}
   expected=evidence['trace'][i];assert expected['action']==a;assert expected['tokens']==t;assert expected['consequence']==consequence;assert expected['load']==load(t,p);assert expected['completed']==sorted(history)
   assert expected['current']==[g['id'] for g in introduced if truth(g,t)]
   if consequence.get('result') in known:rebuilt.append(consequence['result'])
   i+=1
  assert g['id'] in history;assert evidence['loads'][gi]['end']==load(t,p)
 assert i==evidence['total']==len(evidence['trace']);assert all(truth(g,t) for g in introduced if g['mode']=='current')
 assert evidence['savedBoard']==t and evidence['savedCompletion']==sorted(history)
 assert evidence['reconstructedKnownOutputs']==rebuilt
 counts={k:sum(x['action']['type']==k for x in evidence['trace']) for k in ['combine','place']};assert counts==evidence['counts']
 known.update(x['consequence']['result'] for x in evidence['trace'] if 'result' in x['consequence'])
 return dict(level=l['id'],variant=variant,operations=i,counts=counts,declaredStartingThings=len(l['initial']),firstObjectiveThings=startloads[0]['things'],peakThings=peak,finalLoad=load(t,p),reconstructedKnownOutputs=rebuilt)
result={}
for variant in ['ordinary','simple']:
 evidence=json.loads((P/(variant+'-collection-route.json')).read_text());known=set();runs=[replay(l,variant,e,known) for l,e in zip(d['levels'],evidence)];assert len(evidence)==len(d['levels'])==6
 result[variant]=dict(levels=runs,total=sum(r['operations'] for r in runs),peakThings=max(r['peakThings'] for r in runs),distinctConstructedOutputs=len(known))
 assert result[variant]['total']=={'ordinary':70,'simple':62}[variant]
for lid,var in [('contact','optical'),('water','distillation')]:
 l=next(l for l in d['levels'] if l['id']==lid);result[lid+'-'+var]=replay(l,var,json.loads((P/(lid+'-'+var+'-route.json')).read_text()),set())
# Contract probes, not tests of a deployed game: exact context wins even if result exists.
t={'water-canister':None,'seed-tray':'warm-habitat','sprouted-tray':None};before=dict(t)
try:apply(t,{'warm-habitat'},{'type':'combine','a':'water-canister','b':'seed-tray'})
except AssertionError:pass
else:raise AssertionError('contextual duplicate incorrectly falls through')
assert t==before
# Reverse contextual crop orientation works but moves garden away, so its placement regresses.
t={'greenhouse':'growing-court','growing-potato-planter':None}
t,_=apply(t,{'growing-court'},{'type':'place','a':'growing-potato-planter','place':'growing-court'});assert t['greenhouse'] is None
t,c=apply(t,{'growing-court'},{'type':'combine','a':'greenhouse','b':'growing-potato-planter'});assert c['result']=='potato-harvest' and t['greenhouse'] is None and t['growing-potato-planter']=='growing-court' and t['potato-harvest'] is None
# Place operand never occupies or accumulates the place.
t,c=apply({'heater':None},{'glacier'},{'type':'combine','a':'heater','b':'place:glacier'});assert t=={'heater':None,'meltwater':None}
result['contractProbes']=['context priority before novelty/rejected duplicate nonmutation','reverse contextual target and truthful source movement','placement displacement','location operand portable output']
result['status']='PASS independent JSON reconstruction; no game implementation/player/fun claim'
(O/'replay.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
