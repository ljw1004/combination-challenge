import json
from pathlib import Path
p=Path(__file__).parent;d=json.loads((p/'draft.json').read_text());have=set();made=[];missing=[];counts=[]
for s in d['stages']:
 have.update(s['cache']);have.update('place:'+x for x in s['locations'])
 todo=s['recipes'].copy()
 while True:
  ready=[r for r in todo if r['a'] in have and r['b'] in have]
  if not ready:break
  for r in ready:have.add(r['result']);made.append(r['result']);todo.remove(r)
 missing += [(s['id'],r) for r in todo]
 counts.append([s['id'],len(s['recipes']),len(todo)])
print('UNREACHABLE',json.dumps(missing,indent=2));print('COUNTS',counts)
# Shortest backward union over chosen recipe branches (greedy union, not optimal).
have=set();required=set();routes=[]
allrecipes={}
for s in d['stages']:
 for r in s['recipes']:allrecipes.setdefault(r['result'],[]).append(r)
for s in d['stages']:
 have.update(s['cache']);have.update('place:'+x for x in s['locations'])
 def solve(item,seen=None):
  if item in have:return []
  seen=(seen or set())|{item};candidates=[]
  for r in allrecipes.get(item,[]):
   if r['a'] in seen or r['b'] in seen:continue
   left=solve(r['a'],seen);right=solve(r['b'],seen)
   if left is None or right is None:continue
   uniq={x['result']:x for x in left+right+[r]};candidates.append(list(uniq.values()))
  return min(candidates,key=len) if candidates else None
 out=[]
 for goal in s['goals']:
  item=goal.split('@')[0].replace('place:','')
  route=solve(item)
  if route is None: print('NO GOAL',s['id'],goal);continue
  for r in route:
   if r['result'] not in have:out.append(r);have.add(r['result']);required.add(r['result'])
 routes.append(dict(stage=s['id'],count=len(out),actions=out))
print('GOAL ROUTE',len(required),[(r['stage'],r['count'])for r in routes])
(p/'results/draft-audit.json').write_text(json.dumps(dict(reachable=len(made),unreachable=missing,authoredRecipes=sum(len(s['recipes']) for s in d['stages']),goalRouteCount=len(required),routes=routes),indent=2)+'\n')
