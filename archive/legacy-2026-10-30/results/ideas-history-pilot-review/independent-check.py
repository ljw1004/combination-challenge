"""Independent capture arithmetic: no engine import; verifies used operation laws."""
import json, hashlib, collections
from pathlib import Path
p=json.load(open('results/ideas-history-provenance-players/ih2-pilot-a.json'))
norm=lambda d:{k:sorted({tuple(sorted(set(p))) for p in ps}) for k,ps in sorted(d.items()) if ps}
accepted=[]; boundaries=[]
for index,e in enumerate(p['events']):
 if e['cmd']!='act':continue
 a=json.loads(e['argument']); before=e['before']; after=e['after']; obs=e['output']['observation']; ideas={i['id']:i for i in before['ideas']}; x=ideas[a['a']]; out={}
 if a['op']=='translate':
  bridge=next(b for b in obs['correspondences'] if b['id']==a['b'])
  for u,v in bridge['pairs']:
   if u in x['claims']:out.setdefault(v,[]).extend(x['claims'][u])
 else:
  y=ideas[a['b']]
  if a['op']=='apply':out={k:ps for k,ps in x['claims'].items() if k in y['claims']}
  elif a['op']=='collect':
   for k in x['claims'].keys() | y['claims'].keys():out[k]=x['claims'].get(k,[])+y['claims'].get(k,[])
  elif a['op']=='compare':
   for k in x['claims'].keys() & y['claims'].keys():
    for q in x['claims'][k]:
     for r in y['claims'][k]:
      if not set(q)&set(r) and len({obs['roots'][z]['subject'] for z in q+r})==1:out.setdefault(k,[]).append(q+r)
  else:raise AssertionError(a)
 assert norm(out)==norm(after['ideas'][-1]['claims']),index
 assert after['ideas'][:-1]==before['ideas'],index
 assert after['moves']==before['moves']+1,index
 assert after['ideas'][-1]['parents']==[a['a'],a['b']],index
 flags=[]
 for goal in obs['goals']:
  def matches(i):
   if i['kind']!='account' or i['domain']!=goal['domain'] or set(i['claims'])!=set(goal['members']):return False
   def proof_ok(q):
    if goal['support']=='any':return bool(q)
    if goal['support']=='faithful':return len(q)==1 and obs['roots'][q[0]]['origin']==goal['original']
    return len(set(q))>=2 and len({obs['roots'][z]['subject'] for z in q})==1
   return all(any(proof_ok(q) for q in i['claims'][k]) for k in goal['members'])
  actual=any(matches(i) for i in after['ideas']);assert actual==goal['satisfied'],index;flags.append(actual)
 accepted.append(index)
 if all(flags):boundaries.append(index)
# The one requested preview is followed immediately by its same-state action.
pv=p['events'][8]; act=p['events'][9]
assert pv['cmd']=='preview' and pv['argument']==act['argument']
assert pv['before']==act['before'] and pv['output']['idea']==act['after']['ideas'][-1]
assert [g['satisfied'] for g in pv['output']['goals']]==[g['satisfied'] for g in act['output']['observation']['goals']]
manifest=Path('results/ideas-history-v2-freeze/manifest.json');m=json.loads(manifest.read_text());a=json.load(open('results/ideas-history-provenance-players/ih2-pilot-a-assignment.json'))
assert hashlib.sha256(manifest.read_bytes()).hexdigest()==a['manifestSha256']
for f in m['files']:assert hashlib.sha256(Path(f['path']).read_bytes()).hexdigest()==f['sha256']
result={'verified':True,'method':'Independent Python implementation of every actually used operation and goal predicates; no engine import','acceptedIndices':accepted,'firstBoardSuccessIndices':boundaries,'explicitPreviewIndex':8,'previewMatchesCommitIndex':9,'manifestAndAll13FilesMatch':True,'captureSha256':hashlib.sha256(Path('results/ideas-history-provenance-players/ih2-pilot-a.json').read_bytes()).hexdigest(),'cmdCounts':dict(collections.Counter(e['cmd'] for e in p['events']))}
print(json.dumps(result,indent=2))
