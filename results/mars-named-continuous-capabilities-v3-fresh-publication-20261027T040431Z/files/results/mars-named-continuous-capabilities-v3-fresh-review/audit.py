"""Independent post-play audit. Replays into a fresh temporary directory only."""
import pathlib,json,hashlib,subprocess,tempfile,sys,collections,importlib.util
ROOT=pathlib.Path(__file__).resolve().parents[2]
P=ROOT/'results/mars-named-continuous-capabilities-v3-publication-20261027T033924Z'
E=ROOT/'results/mars-named-continuous-capabilities-v3-fresh-play'
O=pathlib.Path(__file__).resolve().parent
sha=lambda b:hashlib.sha256(b).hexdigest()
manifest=json.loads((P/'manifest.json').read_text())
for e in manifest['entries']:
 b=(ROOT/e['snapshotPath']).read_bytes();assert len(b)==e['bytes'] and sha(b)==e['sha256'];assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==e['gitBlobSHA1']
assert (E/'exact-prompt.md').read_bytes()==(P/'PLAYER-ASSIGNMENT.md').read_bytes()
identity=json.loads((E/'identity.json').read_text());assert sha((E/'exact-prompt.md').read_bytes())==identity['promptSHA256'];assert identity['forkTurns']=='none'
host=P/'files/results/mars-named-continuous-capabilities-v3/harness.py'
records=[json.loads(x) for x in (E/'transcript.jsonl').read_text().splitlines()]
initial=json.loads(records[0]['stdout']);assert (E/'initial-response.json').read_text()==records[0]['stdout']
ops=collections.Counter();accepted=collections.Counter();failures=[];compact=[]
with tempfile.TemporaryDirectory(prefix='independent-mars-fresh-audit-') as tmp:
 state=pathlib.Path(tmp)/'state.json'
 for index,r in enumerate(records,1):
  assert r['startedUTC']<=r['finishedUTC'];assert r['exitCode']==0
  if index>1:assert records[index-2]['finishedUTC']<=r['startedUTC']
  priorState=json.loads(state.read_text()) if state.exists() else None
  before=sha(state.read_bytes()) if state.exists() else None
  assert before==r['stateBeforeSHA256'],index
  run=subprocess.run([sys.executable,str(host),'--state',str(state),'--command',r['requestText']],capture_output=True,env={'PYTHONDONTWRITEBYTECODE':'1'})
  assert run.returncode==r['exitCode'] and run.stdout.decode()==r['stdout'] and run.stderr.decode()==r['stderr'],index
  after=sha(state.read_bytes()) if state.exists() else None;assert after==r['stateAfterSHA256'],index
  cmd=json.loads(r['requestText']);assert cmd==r['requestJSON'];ops[cmd['op']]+=1
  out=json.loads(r['stdout'])
  if out['ok']:accepted[cmd['op']]+=1
  else:failures.append(dict(index=index,command=cmd,error=out['error']));assert before==after
  if cmd['op']=='combine' and out['ok']:
   afterState=json.loads(state.read_text())
   for kind,token in priorState['board']['tokens'].items():
    if kind in afterState['board']['tokens']:assert token['at']==afterState['board']['tokens'][kind]['at'],(index,kind)
  if cmd['op'] in ['help','view','partners','knowledge'] and priorState is not None:assert before==after
  compact.append(dict(index=index,command=cmd,ok=out['ok'],consequence=out.get('consequence'),error=out.get('error'),partners=out.get('partners'),objectives=[dict(id=x['id'],current=x['current'],achieved=x['achieved']) for x in out.get('view',{}).get('objectives',[])]))
 assert state.read_bytes()==(E/'state.json').read_bytes()
 s=json.loads(state.read_text());assert s['finished'] and len(s['board']['completed'])==26 and s['board']['introduced']==26
 assert s['counts']==dict(combine=52,place=37)
 assert records[-1]['requestJSON']=={'op':'next'}
 spec=importlib.util.spec_from_file_location('audited_final_host',host);h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
 game=h.Game(state=s);assert game.complete();assert len(game.view()['objectives'])==26
 assert all(x['achieved'] for x in game.view()['objectives']);assert all(game._truth(g) for g in game._level()['goals'] if g['mode']=='current')
rawRun=pathlib.Path(identity['runDirectory'])
for f in ['state.json','transcript.jsonl']:assert (rawRun/f).read_bytes()==(E/f).read_bytes()
result=dict(status='PASS',records=len(records),operationCounts=dict(ops),acceptedOperationCounts=dict(accepted),acceptedGestures=accepted['combine']+accepted['place'],rejections=failures,finished=s['finished'],objectives=26,currentGoals=sum(g['mode']=='current' for g in game._level()['goals']),milestones=sum(g['mode']=='milestone' for g in game._level()['goals']),outsideThings=len(s['board']['tokens']),places=len(s['board']['places']),checks=['published snapshot manifest byte/SHA/Gitblob parity','exact neutral prompt and fork-none identity record','all records serial timestamps and state hash chain','every replay stdout/stderr byte and exit exactly equal','rejected state unchanged','all surviving things retain logical placement on all successful combines','queries leave established state unchanged','final state byte equality and all current goals true','original run and archived raw bytes unchanged'],hashes={str(p.relative_to(ROOT)):sha(p.read_bytes()) for p in [host,E/'transcript.jsonl',E/'state.json',E/'exact-prompt.md']},limits=['remote publication verified by root, not independently queried here','instruction-only isolation, no independent filesystem access audit','display filtering disclosed separately; raw capture unchanged','logical test only, no native scrolling/physical drag or human-fun inference'])
(O/'audit-results.json').write_text(json.dumps(result,indent=2)+'\n');(O/'indexed-trace.json').write_text(json.dumps(compact,indent=2)+'\n');print(json.dumps(result,indent=2))
