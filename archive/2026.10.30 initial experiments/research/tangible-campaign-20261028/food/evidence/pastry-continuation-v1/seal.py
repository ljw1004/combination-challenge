"""Seal the additive audit without modifying its candidate or frozen trial."""
import hashlib,json,pathlib,re
P=pathlib.Path(__file__).parent
root=P.parent.parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
protected=json.loads((P/'protected-before.json').read_text())['files']
for f in protected:assert sha(root/f['path'])==f['sha256'],f['path']
for name,n in [('tests.log',96),('focused-tests.tap',2)]:
 text=(P/name).read_text()
 assert re.findall(r'^(?:# |ℹ )pass (\d+)$',text,re.M)[-1]==str(n)
 assert re.findall(r'^(?:# |ℹ )fail (\d+)$',text,re.M)[-1]=='0'
v=json.loads((P/'verification.json').read_text())
assert len(v['replays'])==15 and all(r['completed'] for r in v['replays'])
assert v['scenarioSha256']==sha(root/'scenario.json')
assert 'PASS:' in (P/'typecheck.log').read_text()
files=[{'path':str(f.relative_to(P)),'sha256':sha(f),'bytes':f.stat().st_size} for f in sorted(P.iterdir()) if f.is_file() and f.name!='manifest.json']
manifest={'revision':'pastry-continuation-audit-v1','status':'verified additive evidence only; no content change','candidateSha256':v['scenarioSha256'],'preExistingFilesUnchanged':len(protected),'tests':96,'additionalRegressionTests':2,'continuationCases':24,'fullRouteWidthReplays':15,'strictTypecheck':'pass','counterfactualTrial':'same discoveries in 22 drops; source-aware replay, not new fresh trial','frozenTrial':'fresh-pastry-v1/pilots/sessions/fresh_pastry_a.json','files':files}
(P/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({k:v for k,v in manifest.items() if k!='files'},indent=2))
