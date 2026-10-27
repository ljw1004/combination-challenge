"""Independent JSON-only replay. Does not import the candidate builder."""
import json, pathlib, hashlib, collections
root=pathlib.Path('results/mars-named-two-mission-candidate')
out=pathlib.Path('results/mars-named-two-mission-review')
d=json.loads((root/'candidate.json').read_text())
outputs={r['result'] for r in d['recipes']}
assert set(d['baseThings']).isdisjoint(outputs)
assert len({(frozenset([r['a'],r['b']]),r.get('at')) for r in d['recipes']})==len(d['recipes'])
results=[]
load_reference=json.loads((root/"workspace-load-audit.json").read_text())
for fn in ['normal-route.json','optical-first-route.json','generous-route.json','simple-tool-route.json']:
 q=json.loads((root/fn).read_text()); board={x:None for x in q['startingIntactThings']}; introduced=[]; places=set(); history=set(); retired=set(); used=set(); counts=collections.Counter(); loads=[]
 def truth(g):return any(k in board and (g['location'] is None or board[k]==g['location']) for k in g['accepts'])
 def refresh():
  for g in introduced:
   for c in g['conditionalLocations']:
    if c['when'] in board:places.update(c['locations'])
   if truth(g):history.add(g['id'])
 def load():return dict(things=len(board),loose=sum(p is None for p in board.values()),revealedLocations=len(places),occupiedLocations=len(set(p for p in board.values() if p)))
 for g in d['objectives']:
  introduced.append(g); places.update(g['requiredLocations'])
  for k in g['supplies']:
   assert k in d['baseThings']
   if k not in retired and not (k=='broken-radio' and 'radio' in board):board.setdefault(k,None)
  refresh(); start_load=load()
  for t in [x for x in q['trace'] if x['objective']==g['id']]:
   a=t['action']; assert a['a'] in board; counts[a['type']]+=1; used.add(a['a'])
   if a['type']=='place':
    assert a['place'] in places
    for k in board:
     if board[k]==a['place']:board[k]=None
    board[a['a']]=a['place']
   else:
    b=a['b']; used.add(b)
    if b.startswith('place:'):assert b[6:] in places; context=None
    else:assert b in board; context=board[b]
    if 'at' in a:assert a['at']==context
    pair=frozenset([a['a'],b]); matches=[r for r in d['recipes'] if frozenset([r['a'],r['b']])==pair and (r.get('at') is None or r.get('at')==context)]
    matches.sort(key=lambda r:r.get('at') is not None,reverse=True); assert matches
    r=matches[0]; assert r['result'] not in board
    board[a['a']]=None
    for old in r.get('retire',[]):assert old=='broken-radio'; del board[old]; retired.add(old)
    board[r['result']]=None; used.add(r['result'])
    assert r['result']==t['consequence']['result']
   assert len([p for p in board.values() if p])==len(set(p for p in board.values() if p))
   refresh()
   assert sorted(t['currentlyTrue'])==sorted(x['id'] for x in introduced if truth(x))
   assert sorted(t['historicallyCompleted'])==sorted(history)
  assert g['id'] in history
  loads.append(dict(objective=g['id'],start=start_load,end=load()))
 assert loads==load_reference[q['condition']]
 assert loads==q['workspaceLoads']
 assert board==q['finalTokens']; assert counts==q['counts']
 assert all(truth(g) for g in d['objectives'] if g['mode']=='current')
 results.append(dict(route=fn,workspaceLoads=loads,counts=dict(counts),total=sum(counts.values()),currentEndpoints=sum(g['mode']=='current' and truth(g) for g in d['objectives']),finalTokenCount=len(board),looseTokenCount=sum(p is None for p in board.values()),retired=sorted(retired),usedKinds=sorted(k for k in used if not k.startswith('place:'))))
used=set().union(*(set(x['usedKinds']) for x in results))
reachable=set(k for g in d['objectives'] for k in g['supplies']); locs=set(k for g in d['objectives'] for k in g['requiredLocations'])
for g in d['objectives']:
 for c in g['conditionalLocations']:locs.update(c['locations'])
while True:
 old=set(reachable)
 for r in d['recipes']:
  if all((k[6:] in locs if k.startswith('place:') else k in reachable) for k in [r['a'],r['b']]) and (r.get('at') is None or r['at'] in locs):reachable.add(r['result'])
 if old==reachable:break
report=dict(status='Independent JSON replay passes; semantic risks remain, no play or duration evidence',routes=results,routeUnionUsedKinds=len(used),routeUnionUnusedKinds=sorted(set(d['allKinds'])-used),optimisticProgressiveSupplyUnreachableKinds=sorted(set(d['allKinds'])-reachable),sourceHashes={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in root.glob('*') if p.is_file()})
(out/'replay.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['routes','sourceHashes']},indent=2))
print([(x['route'],x['total'],x['currentEndpoints'],x['finalTokenCount'],x['looseTokenCount']) for x in results])
