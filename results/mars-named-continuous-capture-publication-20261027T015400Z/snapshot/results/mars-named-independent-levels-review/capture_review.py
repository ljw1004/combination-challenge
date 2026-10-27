"""Independent exact-capture checks. Operator-only fixtures; not player material."""
import pathlib,json,tempfile,subprocess,sys,importlib.util,hashlib
sys.dont_write_bytecode=True
R=pathlib.Path('results');P=R/'mars-named-continuous-capture-supplement';O=R/'mars-named-independent-levels-review'
s=importlib.util.spec_from_file_location('capture_under_review',P/'capture.py');c=importlib.util.module_from_spec(s);s.loader.exec_module(c);H=c.find_host()
s=importlib.util.spec_from_file_location('frozen_under_review',H);h=importlib.util.module_from_spec(s);s.loader.exec_module(h)
checks=[]
def recs(d):return [json.loads(x) for x in (pathlib.Path(d)/'transcript.jsonl').read_text().splitlines()]
def rawcall(d,raw):
 before=(pathlib.Path(d)/'state.json');before=hashlib.sha256(before.read_bytes()).hexdigest() if before.exists() else None
 r=c.capture(d,raw);rr=recs(d)[-1];assert rr['requestText']==raw;assert rr['stdout'].encode()==r.stdout;assert rr['stderr'].encode()==r.stderr;assert rr['exitCode']==r.returncode;assert rr['stateBeforeSHA256']==before;assert rr['startedUTC']<=rr['finishedUTC'];return r
with tempfile.TemporaryDirectory() as d:
 game=h.Game();commands=[{'op':'help'},{'op':'view'},{'op':'knowledge'},{'op':'partners','a':'broken-radio'},{'op':'next'},{'op':'combine','a':'unknown','b':'cable'}]
 route=json.loads((R/'mars-named-two-mission-candidate/normal-route.json').read_text())
 commands += [{'op':t['action']['type'],**{k:v for k,v in t['action'].items() if k not in ('type','at')}} for t in route['trace']]
 commands += [{'op':'next'},{'op':'view'},{'op':'knowledge'},{'op':'saved','level':'continuous-world'},{'op':'next'}]
 for cmd in commands:
  raw='  '+json.dumps(cmd,ensure_ascii=False)+'  ';r=rawcall(d,raw);assert r.returncode==0 and r.stderr==b'';assert json.loads(r.stdout)==game.command(cmd)
 records=recs(d);assert len(records)==len(commands);assert json.loads((pathlib.Path(d)/'state.json').read_text())==game.state;assert game.state['finished']
 for i,rr in enumerate(records):
  if i:assert rr['stateBeforeSHA256']==records[i-1]['stateAfterSHA256']
 assert all(records[i]['stateBeforeSHA256']==records[i]['stateAfterSHA256'] for i in [4,5,len(records)-1])
 wholeCount=len(records);checks.append('ordinary full 83-action route plus all queries/rejections/finish captured exactly, state parity')
with tempfile.TemporaryDirectory() as d1,tempfile.TemporaryDirectory() as d2:
 for raw in ['{bad','null','[]','{"op":"help"}','{ "op": "view", "extra": "Ω" }','{"op":"combine","a":"broken-radio","b":"cable"}']:
  a=rawcall(d1,raw);b=subprocess.run([sys.executable,str(H),'--state',str(pathlib.Path(d2)/'state.json'),'--command',raw],capture_output=True);assert (a.stdout,a.stderr,a.returncode)==(b.stdout,b.stderr,b.returncode)
  p1=pathlib.Path(d1)/'state.json';p2=pathlib.Path(d2)/'state.json';assert p1.exists()==p2.exists()
  if p1.exists():assert p1.read_bytes()==p2.read_bytes()
 checks.append('direct frozen CLI byte parity for malformed/nonobject/unicode rejection/query/mutation')
with tempfile.TemporaryDirectory() as d:
 (pathlib.Path(d)/'state.json').write_text('{corrupt')
 r=rawcall(d,'{"op":"view"}');assert r.returncode!=0 and b'Traceback' in r.stderr;assert recs(d)[0]['stateBeforeSHA256']==recs(d)[0]['stateAfterSHA256']
 checks.append('actual frozen-host nonzero/traceback stderr captured exactly with unchanged corrupt state')
with tempfile.TemporaryDirectory() as d:
 request='{"op":"help"}\n{bad\n{"op":"next"}\n'
 r=subprocess.run([sys.executable,str(P/'capture.py'),'--run-dir',d],input=request.encode(),capture_output=True);rr=recs(d);assert len(rr)==3;assert [x['requestText'] for x in rr]==request.splitlines();assert r.stdout==''.join(x['stdout'] for x in rr).encode();assert r.stderr==b'';assert r.returncode==0
 checks.append('stdin one-command-per-line captures every request and forwards normal stdout exactly')
with tempfile.TemporaryDirectory() as d:
 (pathlib.Path(d)/'state.json').write_text('{corrupt')
 r=subprocess.run([sys.executable,str(P/'capture.py'),'--run-dir',d,'--command','{"op":"view"}'],capture_output=True)
 rr=recs(d)[0];assert r.returncode!=0;assert 'Traceback' in rr['stderr'];assert b'Traceback' not in r.stdout+r.stderr;assert b'harness.py' not in r.stdout+r.stderr;assert not json.loads(r.stdout)['ok']
 checks.append('fatal raw stderr retained privately; player output contains generic error only, no source traceback')
with tempfile.TemporaryDirectory() as d:
 blocker=pathlib.Path(d)/'not-a-directory';blocker.write_text('operator setup failure fixture')
 r=subprocess.run([sys.executable,str(P/'capture.py'),'--run-dir',str(blocker),'--command','{"op":"view"}'],capture_output=True)
 assert r.returncode==2;assert not json.loads(r.stdout)['ok'];assert b'Traceback' not in r.stdout+r.stderr;assert r.stderr==b'';assert blocker.read_text()=='operator setup failure fixture'
 checks.append('infrastructure exception catches invalid run directory with generic source-free notice and no mutation')
assignment=R/'mars-named-continuous-harness-publication-20261027T014800Z/snapshot/results/mars-named-continuous-play-protocol/assignment.md'
assert (P/'player-prompt.md').read_text().startswith(assignment.read_text().rstrip())
checks.append('player prompt preserves frozen assignment verbatim before operator entry-point instructions')
result=dict(status='PASS',checks=checks,wholeControlRequests=wholeCount,hostSHA256=hashlib.sha256(H.read_bytes()).hexdigest(),launcherSHA256=hashlib.sha256((P/'capture.py').read_bytes()).hexdigest())
(O/'capture-review-results.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
