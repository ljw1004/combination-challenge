"""Seal a verified new candidate without touching its predecessor or source repository."""
from pathlib import Path
import hashlib,json,re,subprocess,tempfile,shutil
P=Path(__file__).parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
for f in json.loads((P/'evidence/protected-v1.json').read_text())+json.loads((P/'evidence/protected-v2.json').read_text())+json.loads((P/'evidence/protected-inputs.json').read_text()):assert sha(Path(f['path']))==f['sha256'],f['path']
s=json.loads((P/'scenario.json').read_text());v=json.loads((P/'evidence/verification.json').read_text())
assert sha(P/'scenario.json')==v['scenarioSha256'];assert len(v['replays'])==18 and all(r['completed'] for r in v['replays'])
assert len(s['recipes'])==195 and len(s['stages'])==20
for f,n in [('tests.tap',114),('integration-tests.tap',139)]:
 t=(P/'evidence'/f).read_text();assert re.findall(r'^# pass (\d+)$',t,re.M)[-1]==str(n);assert re.findall(r'^# fail (\d+)$',t,re.M)[-1]=='0'
assert 'BUILD_EXIT=0' in (P/'evidence/integration-build.log').read_text();assert 'PASS:' in (P/'evidence/typecheck.log').read_text()
assert len(json.loads((P/'evidence/pilot-cli-smoke.json').read_text()))==5
with tempfile.TemporaryDirectory(prefix='food-v3-repro-') as d:
 q=Path(d);shutil.copy2(P/'author.py',q/'author.py');(q/'routes').mkdir();(q/'evidence').mkdir()
 subprocess.run(['python',str(q/'author.py')],check=True,capture_output=True)
 for f in q.rglob('*'):
  if f.is_file():assert sha(f)==sha(P/f.relative_to(q)),str(f)
pilot=['scenario.json','pilot-player.ts','play.mjs','engine/model.ts','schema/scenario.ts','schema/lifecycle.ts','pilots/PLAYER-INSTRUCTIONS.txt']
(P/'pilot-manifest.json').write_text(json.dumps({f:sha(P/f) for f in pilot},indent=2)+'\n')
files=[]
for f in sorted(P.rglob('*')):
 if f.is_file() and f.name!='manifest.json' and f.relative_to(P).parts[:2]!=('pilots','sessions') and f.name!='commands.jsonl':files.append({'path':str(f.relative_to(P)),'sha256':sha(f),'bytes':f.stat().st_size})
manifest={'candidate':s['id'],'status':'tiny v3 portability revision; verified and isolated; not deployed','scenarioSha256':v['scenarioSha256'],'previousCandidate':'../food-v2/','previousV2FilesUnchanged':len(json.loads((P/'evidence/protected-v2.json').read_text())),'originalV1FilesUnchanged':125,'canonicalCombinations':180,'recipeDefinitions':195,'optionalRecipes':15,'stages':20,'baselineRuntimeCommit':'61a9b4e','deterministicAuthoring':True,'checks':{'candidateRuntimeRevisionTests':114,'fullFixtureTangibleTests':139,'routeWidthReplays':18,'checkpoints':21,'strictTypecheck':'pass','fullFixtureBuild':'pass; Vite size warning','sourceAwareCliSmokeSegments':5,'freshV2Trial':'retained at ../food-v2/; not relabelled as v3','freshV3Trial':'not run','humanFun':'not tested','browserTouch':'not tested'},'files':files}
(P/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print(json.dumps({k:v for k,v in manifest.items() if k!='files'},indent=2))
