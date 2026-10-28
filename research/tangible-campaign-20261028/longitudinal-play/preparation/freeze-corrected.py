"""Run only after parent approval: NAME CORRECTED_SCENARIO EXPECTED_SHA CORRECTION_MANIFEST ORIGINAL_V2_PACKET."""
from pathlib import Path
import sys,json,hashlib,shutil,re,datetime
name,source,expected,correction_manifest,original_name=sys.argv[1:]
root=Path(__file__).resolve().parent.parent
p=root/name;original=root/original_name;source=Path(source);correction_manifest=Path(correction_manifest)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(source)==expected, 'Approved scenario hash mismatch'
assert not p.exists(),'Never overwrite a frozen packet'
m=json.loads(correction_manifest.read_text());assert m['candidateSha256']==expected;assert m['sourceSha256']==sha(original/'scenario.json');files=m.get('files',{})
if isinstance(files,list):files={x['path']:x['sha256'] for x in files}
verified=[]
for relative,h in files.items():
 if isinstance(h,dict):h=h.get('sha256')
 if not isinstance(h,str) or not re.fullmatch('[0-9a-f]{64}',h):continue
 target=correction_manifest.parent/relative
 assert target.is_file() and sha(target)==h, str(target)
 verified.append({'path':relative,'sha256':h})
old=json.loads((original/'scenario.json').read_text());new=json.loads(source.read_text())
def differences(a,b,path=''):
 if type(a)!=type(b):return [{'path':path,'before':a,'after':b}]
 if isinstance(a,dict):
  assert a.keys()==b.keys(),f'Copy-only correction changed keys at {path}'
  return [d for k in a for d in differences(a[k],b[k],path+'.'+k)]
 if isinstance(a,list):
  assert len(a)==len(b),f'Copy-only correction changed list length at {path}'
  return [d for i,(x,y) in enumerate(zip(a,b)) for d in differences(x,y,f'{path}[{i}]')]
 return [] if a==b else [{'path':path,'before':a,'after':b}]
diffs=differences(old,new)
assert diffs,'Expected a distinct approved copy correction'
allowed=re.compile(r'^(?:\.stages\[\d+\]\.(?:motivation|completionText|area\.travelText|caches\[\d+\]\.(?:narrative|label))|\.(?:items|locations)\[\d+\]\.description)$')
assert all(allowed.fullmatch(d['path']) and isinstance(d['before'],str) and isinstance(d['after'],str) for d in diffs),diffs
p.mkdir()
for f in ['engine/model.ts','schema/lifecycle.ts','schema/scenario.ts','play.mjs','surface.mjs','original-manifest.json']:
 (p/f).parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(original/f,p/f)
shutil.copyfile(source,p/'scenario.json');shutil.copyfile(correction_manifest,p/'correction-manifest.json')
provenance=json.loads((original/'provenance.json').read_text())
provenance.update({'packet':name,'sourceScenario':str(source),'scenarioSha256':expected,'correctedFromPacket':str(original),'correctedFromScenarioSha256':sha(original/'scenario.json'),'correctionManifest':str(correction_manifest),'correctionManifestSha256':sha(correction_manifest),'correctionManifestFilesVerified':verified,'copyOnlyChanges':diffs,'recipesRoutesSchemaRuntimeUnchanged':True,'approval':'Parent supplied this exact expected corrected-candidate SHA before freeze.','createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat()})
(p/'provenance.json').write_text(json.dumps(provenance,indent=2)+'\n')
manifest={'format':1,'packet':name,'runtimeCommit':provenance['runtimeCommit'],'files':{str(f.relative_to(p)):sha(f) for f in sorted(p.rglob('*')) if f.is_file()}}
(p/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');seal=sha(p/'manifest.json')
oldseal=sha(original/'manifest.json');task=(original/'PLAYER_TASK.md').read_text().replace(str(original),str(p)).replace(oldseal,seal).replace(original_name,name)
(p/'PLAYER_TASK.md').write_text(task)
for f in p.rglob('*'):
 if f.is_file():f.chmod(0o444)
for d in sorted([q for q in p.rglob('*') if q.is_dir()],reverse=True):d.chmod(0o555)
p.chmod(0o555)
entry={'packet':name,'path':str(p),'playerTask':str(p/'PLAYER_TASK.md'),'playerTaskSha256':sha(p/'PLAYER_TASK.md'),'manifestSha256':seal,'scenarioSha256':expected,'runtimeSha256':sha(p/'engine/model.ts'),'harnessSha256':{'play.mjs':sha(p/'play.mjs'),'surface.mjs':sha(p/'surface.mjs')},'copyOnlyChangedPaths':[d['path'] for d in diffs],'status':'frozen-awaiting-logical-smoke'}
i=json.loads((root/'packet-index.json').read_text());i['packets'].append(entry);(root/'packet-index.json').write_text(json.dumps(i,indent=2)+'\n')
(root/'evidence'/f'{name}-freeze.json').write_text(json.dumps(entry,indent=2)+'\n');print(json.dumps(entry,indent=2))
