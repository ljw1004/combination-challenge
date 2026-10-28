"""Seal only a verified final candidate; preserve earlier revisions separately."""
import hashlib,json,pathlib,re,subprocess
P=pathlib.Path(__file__).parent
sha=lambda f:hashlib.sha256((P/f).read_bytes()).hexdigest()
s=json.loads((P/'scenario.json').read_text());v=json.loads((P/'evidence/verification.json').read_text())
assert sha('scenario.json')==v['scenarioSha256'],'Evidence is stale for the scenario'
assert len(v['replays'])==15 and all(r['completed'] for r in v['replays'])
for file,n in [('evidence/tests.tap',94),('evidence/integration-tests.tap',127)]:
 t=(P/file).read_text();assert re.findall(r'^# pass (\d+)$',t,re.M)[-1]==str(n);assert re.findall(r'^# fail (\d+)$',t,re.M)[-1]=='0'
for stage,k in [('sugar','fruit-syrup'),('custard','vanilla-custard'),('precision','sifted-flour')]:
 st=next(x for x in s['stages'] if x['id']==stage);o=next(x for x in st['objectives'] if x['item']==k);assert not o.get('intermediate') and not o.get('after');assert all(o['id'] not in x.get('after',[]) for x in st['objectives'])
for f in json.loads((P/'evidence/protected-inputs.json').read_text()):assert hashlib.sha256(pathlib.Path(f['path']).read_bytes()).hexdigest()==f['sha256']
before=sha('scenario.json');subprocess.run(['python','author.py'],cwd=P,check=True,capture_output=True);assert sha('scenario.json')==before
files=['scenario.json','author.py','authored-counts.json','dependency-plan.json','dependency-graph.json','README.md','campaign.test.ts','verify.ts','pilot-player.ts','smoke-pilots.py','seal.py','docs/DEPENDENCY-PLAN.md','docs/CHAPTER-MAP.md','docs/SOURCES-AND-LIMITS.md','docs/CRITICAL-REVIEW.md','routes/canonical.json','routes/all-recipes.json','routes/reverse-ready.json','routes/reverse-directions.json','routes/early-discovery.json','evidence/verification.json','evidence/tests.tap','evidence/typecheck.log','evidence/integration-build.log','evidence/integration-tests.tap','evidence/lifecycle-audit-rows.json','evidence/runtime-provenance.json','evidence/protected-inputs.json','evidence/pilot-cli-smoke.json','pilots/PLAYER-INSTRUCTIONS.txt','pilots/FACILITATOR.md']
manifest={'candidate':s['id'],'status':'isolated executable candidate; independent preparation goals; not deployed','scenarioSha256':before,'recipeDefinitions':197,'canonicalCombinations':185,'stages':20,'deterministicAuthoring':True,'previousRevision':'revisions/pre-export-goal-fix/','baselineSourceCommit':'3d3dbf36c7be473b30e09384f8a279b2fa2d9918','runtimeSnapshot':'evidence/runtime-provenance.json','checks':{'focusedAndEngineTests':94,'fullFixtureTangibleTests':127,'routeWidthReplays':15,'checkpoints':21,'strictTypecheck':'pass','fullFixtureBuild':'pass; Vite size warning','humanFun':'not tested','browserTouch':'not tested'},'files':[{'path':f,'sha256':sha(f),'bytes':(P/f).stat().st_size} for f in files]}
(P/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print('Sealed',before)
