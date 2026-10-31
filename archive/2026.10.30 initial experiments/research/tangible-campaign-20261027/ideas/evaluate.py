"""Exact prerequisite audit for the non-retiring unique-producer DAG. Not fun/UI testing."""
import json,pathlib
p=pathlib.Path(__file__).parent;s=json.loads((p/'scenario.json').read_text());rs=s['recipes'];prod={r['out']:r for r in rs}; assert len(prod)==len(rs)
def deps(i,out):
 if i not in prod:return
 r=prod[i]
 if r['id'] in out:return
 deps(r['a'],out);deps(r['b'],out);out.add(r['id'])
needed=set()
for st in s['stages']:
 for o in st['objectives']:deps(o['item'],needed)
seen=set();have=set(s['initialItems']);actions=[];rows=[];pending=set(needed);carry=set();peak=0
for n,st in enumerate(s['stages']):
 cache={i for c in st.get('caches',[]) for i in c['items']};have|=cache
 want=set()
 for o in st['objectives']:deps(o['item'],want)
 remain=want-seen;count=len(remain);local=set(carry)|cache
 while remain:
  ready=[r for r in rs if r['id'] in remain and {r['a'],r['b']}<=have]
  assert ready,('unreachable',st['id'],remain)
  for r in ready:
   if r.get('at'):actions.append({'type':'place','item':r['b'],'location':r['at']})
   have.add(r['out']);local.add(r['out']);seen.add(r['id']);remain.remove(r['id']);pending.discard(r['id']);actions.append({'type':'combine','a':r['a'],'b':r['b']})
 carry=set(s['stages'][n+1].get('carry',[])) & have if n+1<len(s['stages']) else set()
 peak=max(peak,len(local))
 rows.append({'stage':st['id'],'newPrimitives':len(cache),'requiredCombinationsHere':count,'goalRouteLocalItemsNoRetirement':len(local),'requiredCarryOut':len(carry),'reachable':all(o['item'] in have for o in st['objectives'])})
 actions.append({'type':'advance'})
result={'distinctRecipes':len(rs),'minimumSuccessfulCombinationsForAllStageGoals':len(needed),'optionalCombinations':len(rs)-len(needed),'itemKinds':len(s['items']),'peakGoalRouteLocalItemsNoRetirement':peak,'stages':rows,'scope':'Exact prerequisite count for unique-producer DAG. Local counts use authored incoming-scene carry allowlists and known item identities. Engine replay separately verifies actual transfers. Not evidence of fun or rendered mobile fit.'}
(p/'evaluation.json').write_text(json.dumps(result,indent=2)+'\n');(p/'goal-route.json').write_text(json.dumps(actions,indent=2)+'\n');print(json.dumps(result,indent=2))
