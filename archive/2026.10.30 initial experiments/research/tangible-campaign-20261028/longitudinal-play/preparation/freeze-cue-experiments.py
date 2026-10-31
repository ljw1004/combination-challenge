from pathlib import Path
import json,hashlib,shutil,datetime
r=Path(__file__).resolve().parent.parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
protected={str(f.relative_to(r)):sha(f) for d in r.iterdir() if d.is_dir() and d.name.startswith(('mars-','elements-')) for f in d.rglob('*') if f.is_file()}
for name in ['mars-v4-copyfix-packet-v1','elements-v7-copyfix-packet-v1']:
 for f in (r/'sessions'/name).rglob('*'):
  if f.is_file():protected[str(f.relative_to(r))]=sha(f)
(r/'evidence'/'cue-experiment-preservation-before.json').write_text(json.dumps(protected,indent=2)+'\n')
specs=[('mars-v4-cue-packet-v1','mars','mars-v4-copyfix-packet-v1','5b5c88eae671fdef517426ffba16aac826f5058413aac46f8f818c1d7285240c',2),('elements-v7-cue-packet-v1','elements','elements-v7-copyfix-packet-v1','abf039bf300981f38e796e905cef69556f3439c8ccba7f834edb16c500ec234d',1)]
index=json.loads((r/'packet-index.json').read_text())
for name,key,base_name,expected,stage in specs:
 source=r.parent/'longitudinal-cue-experiments'/key/'scenario.json';cm=source.parent/'manifest.json';base=r/base_name;p=r/name
 assert not p.exists(),'Never overwrite frozen packets'
 m=json.loads(cm.read_text());assert sha(source)==expected==m['candidateSha256'];assert sha(base/'scenario.json')==m['baseSha256']
 b=json.loads((base/'scenario.json').read_text());s=json.loads(source.read_text());check=json.loads(json.dumps(s));check['id']=b['id'];check['stages'][stage]['motivation']=b['stages'][stage]['motivation'];assert check==b,'Only ID and specified motivation may change'
 changes=[{'path':'/id','old':b['id'],'new':s['id']},{'path':f'/stages/{stage}/motivation','old':b['stages'][stage]['motivation'],'new':s['stages'][stage]['motivation']}];assert changes==m['changes'];assert b['id']!=s['id'];assert changes[1]['old']!=changes[1]['new']
 bm=json.loads((base/'manifest.json').read_text())
 for relative,h in bm['files'].items():assert sha(base/relative)==h
 p.mkdir()
 for relative in ['engine/model.ts','schema/scenario.ts','schema/lifecycle.ts','play.mjs','surface.mjs']:
  (p/relative).parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(base/relative,p/relative)
 shutil.copyfile(source,p/'scenario.json');shutil.copyfile(cm,p/'cue-manifest.json');shutil.copyfile(base/'manifest.json',p/'base-packet-manifest.json');shutil.copyfile(base/'provenance.json',p/'base-provenance.json')
 provenance={'packet':name,'sourceScenario':str(source),'scenarioSha256':expected,'cueManifest':str(cm),'cueManifestSha256':sha(cm),'basePacket':str(base),'basePacketManifestSha256':sha(base/'manifest.json'),'baseScenarioSha256':sha(base/'scenario.json'),'verifiedChanges':changes,'allOtherParsedContentExactlyUnchanged':True,'recipesObjectivesItemsLocationsCachesCheckpointsRoutesUnchanged':True,'runtimeCommit':bm['runtimeCommit'],'runtimeSchemaHarnessUnchangedFromBase':True,'scope':'Minimal narrative cue experiment, not a proven fix or human enjoyment improvement. No recipe alias, engine or UI changes.','freshStart':'Actual createGame stage 0; no checkpoint or authored baseline.','createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 (p/'provenance.json').write_text(json.dumps(provenance,indent=2)+'\n')
 manifest={'format':1,'packet':name,'runtimeCommit':bm['runtimeCommit'],'files':{str(f.relative_to(p)):sha(f) for f in sorted(p.rglob('*')) if f.is_file()}}
 (p/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');seal=sha(p/'manifest.json')
 task=(base/'PLAYER_TASK.md').read_text().replace(str(base),str(p)).replace(sha(base/'manifest.json'),seal).replace(base_name,name)
 (p/'PLAYER_TASK.md').write_text(task)
 for f in p.rglob('*'):
  if f.is_file():f.chmod(0o444)
 for d in sorted([d for d in p.rglob('*') if d.is_dir()],reverse=True):d.chmod(0o555)
 p.chmod(0o555)
 entry={'packet':name,'path':str(p),'playerTask':str(p/'PLAYER_TASK.md'),'playerTaskSha256':sha(p/'PLAYER_TASK.md'),'manifestSha256':seal,'scenarioSha256':expected,'runtimeSha256':sha(p/'engine/model.ts'),'harnessSha256':{f:sha(p/f) for f in ['play.mjs','surface.mjs']},'status':'frozen-awaiting-logical-smoke','scope':'Separate minimal narrative cue experiment; no proven-fix claim'}
 index['packets'].append(entry);(r/'evidence'/f'{name}-freeze.json').write_text(json.dumps(entry,indent=2)+'\n');print(json.dumps(entry,indent=2))
(r/'packet-index.json').write_text(json.dumps(index,indent=2)+'\n')
assert all(sha(r/f)==h for f,h in protected.items())
(r/'evidence'/'cue-experiment-preservation-after.json').write_text(json.dumps({'allPriorFilesUnchanged':True,'protectedFiles':len(protected)},indent=2)+'\n')
