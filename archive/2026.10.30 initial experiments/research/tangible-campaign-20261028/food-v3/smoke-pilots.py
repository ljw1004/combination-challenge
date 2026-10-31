import json,pathlib,subprocess
P=pathlib.Path(__file__).parent
s=json.loads((P/'scenario.json').read_text());route=json.loads((P/'routes/canonical.json').read_text());checks={c['id']:c for c in s['checkpoints']}
segments=[('pastry-supper','pastry','sugar'),('cake-travel','precision','complete'),('orchard-inn','orchard','salads'),('provisions-to-train','cannery','complete'),('custard-chocolate','custard','quickbread')]
out=[]
for name,start,stop in segments:
 session='author_smoke_'+name.replace('-','_')+'_food_v3'
 path=P/'pilots/sessions'/f'{session}.json'
 if path.exists():raise RuntimeError('Preserve evidence: '+str(path)+' already exists')
 def run(*args):
  r=subprocess.run(['node','pilot-player.ts',*args],cwd=P,capture_output=True,text=True)
  if r.returncode:raise RuntimeError(r.stderr)
  return r.stdout
 run('init',session,name)
 initialState=json.loads(path.read_text())['game']['state']
 actions=route[len(checks[start]['actions']):len(checks[stop]['actions'])]
 first=next(a for a in actions if a['type']=='combine')
 # Check interrupted making, not just a happy route.
 if actions[0]['type']=='combine':
  run('drop',session,first['a'],first['b']);run('undo',session)
  d=json.loads(path.read_text());assert {k:v for k,v in d['game']['state'].items() if k!='metrics'}=={k:v for k,v in initialState.items() if k!='metrics'}
 for a in actions:
  if a['type']=='advance':continue
  if a['type']=='combine':run('drop',session,a['a'],a['b'])
  elif a['type']=='place':run('drop',session,a['item'],'@'+a['location'])
 d=json.loads(path.read_text());d['sourceAware']=True;d['participantType']='source-aware-author-cli-smoke';path.write_text(json.dumps(d,indent=2)+'\n')
 assert all(a['accepted'] for a in d['playerActions'])
 expected=19 if stop=='complete' else next(i for i,st in enumerate(s['stages']) if st['id']==stop)
 assert d['game']['state']['stage']==expected
 assert d['game']['state']['completed']==(stop=='complete')
 out.append({'segment':name,'session':session,'sourceAware':True,'humanParticipant':False,'endedAtStage':expected+1,'completedJourney':d['game']['state']['completed'],'acceptedPlayerActions':len(d['playerActions'])})
(P/'evidence/pilot-cli-smoke.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
