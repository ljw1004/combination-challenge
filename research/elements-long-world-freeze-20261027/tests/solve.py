from pathlib import Path
import json,numpy as np
from scipy.optimize import milp,Bounds,LinearConstraint
from scipy.sparse import lil_matrix
p=Path(__file__).resolve().parent.parent
g=json.loads((p/'results/graph.json').read_text());ids=[x['id'] for x in g['concepts']];recipes=g['recipes'];goals=g['goals'];caps=sorted({c for goal in goals for c in goal['requires']});n=len(ids)+len(recipes)+len(caps)
xi={x:i for i,x in enumerate(ids)};yi={i:len(ids)+i for i in range(len(recipes))};ci={c:len(ids)+len(recipes)+i for i,c in enumerate(caps)}
# Check all dependencies form a DAG, so integer recipe choices cannot self-support a cycle.
edges={x:set() for x in ids}
for r in recipes:edges[r['out']].update([r['a'],r['b']])
seen=set();vis=set()
def visit(x):
 if x in vis:raise Exception('cycle '+x)
 if x in seen:return
 vis.add(x)
 for y in edges[x]:visit(y)
 vis.remove(x);seen.add(x)
for x in ids:visit(x)
def solve(name,known,forced=[]):
 rows=[];lo=[];hi=[]
 def add(d,l=-np.inf,h=np.inf):rows.append(d);lo.append(l);hi.append(h)
 lb=np.zeros(n);ub=np.ones(n);obj=np.zeros(n)
 for x in ids:
  if x in known:lb[xi[x]]=1
  else:obj[xi[x]]=1
 for x in forced:lb[xi[x]]=1
 for x in ids:
  if x in known:continue
  d={xi[x]:1}
  for i,r in enumerate(recipes):
   if r['out']==x:d[yi[i]]=-1
  add(d,0,0)
 for i,r in enumerate(recipes):
  for arg in ['a','b']:add({yi[i]:1,xi[r[arg]]:-1},h=0)
  if r.get('at')=='shore':add({yi[i]:1,xi['raft']:-1,xi['sailboat']:-1},h=0)
 for c in caps:
  support=set(x for goal in goals for x in goal['support'].get(c,[]));add({ci[c]:1,**{xi[x]:-1 for x in support}},h=0)
 for goal in goals:add({ci[c]:1 for c in goal['requires']},l=goal.get('count',len(goal['requires'])))
 A=lil_matrix((len(rows),n))
 for j,row in enumerate(rows):
  for k,v in row.items():A[j,k]=v
 res=milp(obj,integrality=np.ones(n),bounds=Bounds(lb,ub),constraints=LinearConstraint(A.tocsr(),lo,hi),options={'time_limit':120,'mip_rel_gap':0})
 out={'name':name,'solverStatus':res.status,'message':res.message,'success':res.success,'minimumCreations':None if res.fun is None else round(res.fun),'lowerBound':getattr(res,'mip_dual_bound',None),'gap':getattr(res,'mip_gap',None),'known':known,'forcedEndingChoices':forced,'selectedOutputs':[] if res.x is None else [x for x in ids if res.x[xi[x]]>.5 and x not in known],'selectedRecipes':[] if res.x is None else [r for i,r in enumerate(recipes) if res.x[yi[i]]>.5 and r['out'] not in known]}
 (p/'results'/f'{name}.json').write_text(json.dumps(out,indent=2));print(name,out['minimumCreations'],out['lowerBound'],out['gap'],res.message)
solve('minimum-from-four',['earth','water','air','fire'])
solve('minimum-from-checkpoint',[t['kind'] for t in g['checkpoint']['tokens']])
solve('authored-richer-choices',['earth','water','air','fire'],['bridge','sawmill','cargo-ferry','signal-tower','gallery','mailboat','star-chart','climbing-garden','soap','covered-landing','children-library','botanical-display'])
