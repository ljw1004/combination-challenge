"""Enumerate every producer choice in this small alternative-route DAG; no length padding."""
import json,pathlib,itertools,collections
P=pathlib.Path(__file__).parent;s=json.loads((P/'scenario.json').read_text());rs=s['recipes'];byid={r['id']:r for r in rs};prods=collections.defaultdict(list)
for r in rs:prods[r['out']].append(r)
alts={k:v for k,v in prods.items() if len(v)>1};base={k:v[0] for k,v in prods.items()};candidates=[]
for choices in itertools.product(*alts.values()):
 selected={**base,**dict(zip(alts,choices))};needed=set()
 def deps(i,trail=()):
  if i not in selected:return
  if i in trail:raise ValueError('cycle')
  r=selected[i]
  if r['id'] in needed:return
  deps(r['a'],trail+(i,));deps(r['b'],trail+(i,));needed.add(r['id'])
 for st in s['stages']:
  for ob in st['objectives']:deps(ob['item'])
 candidates.append((len(needed),needed,{k:selected[k]['id'] for k in alts}))
best=min(candidates,key=lambda c:(c[0],sorted(c[1])));needed=best[1];have=set(s['initialItems']);seen=set();actions=[];rows=[]
for n,st in enumerate(s['stages']):
 have.update(i for c in st['caches'] for i in c['items'])
 remaining={rid for rid in needed if rid.startswith(st['id']+'-')};before=len(seen)
 while remaining:
  ready=[byid[rid] for rid in sorted(remaining) if {byid[rid]['a'],byid[rid]['b']}<=have]
  assert ready,(st['id'],remaining)
  for r in ready:
   if r.get('at'):actions.append({'type':'place','item':r['b'],'location':r['at']})
   actions.append({'type':'combine','a':r['a'],'b':r['b']});have.add(r['out']);seen.add(r['id']);remaining.remove(r['id'])
 assert all(o['item'] in have for o in st['objectives']),st['id']
 rows.append({'stage':st['id'],'requiredCombinationsHere':len(seen)-before})
 actions.append({'type':'advance'})
assert seen==needed
out={'recipes':len(rs),'uniqueOutputs':len(prods),'producerAssignmentsEnumerated':len(candidates),'minimumRequiredCombinations':best[0],'selectedAlternatives':best[2],'perAssignmentCounts':[{'count':c[0],'alternatives':c[2]} for c in candidates],'stages':rows,'scope':'Exact minimum prerequisite-union size across all32producer assignments in this acyclic unique-discovery scenario. Author replay separately checks executable ordering/packing. Recipe count includes alternative routes to existing outputs; never treat all recipes as extra player creations.'}
(P/'evaluation.json').write_text(json.dumps(out,indent=2)+'\n');(P/'goal-route.json').write_text(json.dumps(actions,indent=2)+'\n');print(json.dumps({k:v for k,v in out.items() if k not in ['perAssignmentCounts','stages']},indent=2))
# Retain every equivalent route for engine verification, not just the chosen witness.
routes=[]
for count,need,choices in candidates:
 have=set(s['initialItems']);acts=[]
 for st in s['stages']:
  have.update(i for c in st['caches'] for i in c['items']);left={rid for rid in need if rid.startswith(st['id']+'-')}
  while left:
   ready=[byid[rid] for rid in sorted(left) if {byid[rid]['a'],byid[rid]['b']}<=have]
   assert ready
   for r in ready:
    if r.get('at'):acts.append({'type':'place','item':r['b'],'location':r['at']})
    acts.append({'type':'combine','a':r['a'],'b':r['b']});have.add(r['out']);left.remove(r['id'])
  acts.append({'type':'advance'})
 routes.append({'expectedCombinations':count,'choices':choices,'actions':acts})
(P/'alternative-routes.json').write_text(json.dumps(routes,indent=2)+'\n')
