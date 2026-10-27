# Source-aware scheduling diagnostic, NOT an authored story or legal engine proof.
import json,pathlib,random
p=pathlib.Path(__file__).parent;s=json.loads((p/'local-records-scenario.json').read_text());recipes={r['out']:r for r in s['recipes']};initial=set(s['initialItems']);stages=s['stages'];origin={l:st['id'] for st in stages for l in st.get('locations',[])}
def closure(k):
 if k in initial or k.startswith('@'):return set()
 r=recipes[k];return {k}|closure(r['a'])|closure(r['b'])
cl={st['id']:set().union(*(closure(o['item']) for o in st['objectives'])) for st in stages}
req={st['id']:{origin[l] for k in cl[st['id']] for l in ([recipes[k]['at']] if recipes[k].get('at') else [])+([recipes[k]['b'][1:]] if recipes[k]['b'].startswith('@') else [])} for st in stages}
goals={st['id']:{o['item'] for o in st['objectives']} for st in stages}
def score(order):
 seen=set(initial);live=set(initial);done=set();peak=4;area=[]
 for n,st in enumerate(order):
  if not req[st]<=done|{st}:return 1000,[]
  made=cl[st]-seen;seen|=made;live|=made;peak=max(peak,len(live));area.append(len(live));done.add(st)
  future=set().union(*(goals[x] for x in order[n+1:])) if n+1<len(order) else set()
  for r in s['recipes']:
   if r['out'] not in seen:future|={r['a'],r['b']}
  live&=future
 return peak,area
base=[x['id'] for x in stages];best=base[:];bestscore=score(best);random.seed(27)
for _ in range(30000):
 trial=best[:];a,b=random.sample(range(6,len(base)-1),2);trial[a],trial[b]=trial[b],trial[a];sc=score(trial)
 if sc[0]<bestscore[0] or sc[0]==bestscore[0] and sum(sc[1])<sum(bestscore[1]):best,bestscore=trial,sc
result={'warning':'Not an authored narrative or engine replay; source-aware scheduling diagnostic only','baseline':score(base),'best':bestscore,'order':best}
(p/'order-experiment.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
