from pathlib import Path
import subprocess,json,shutil,tempfile,hashlib
r=Path('/workspace/shared/combination-campaign-research-20261028/longitudinal-play')
p=next(p for p in json.loads((r/'packet-index.json').read_text())['packets'] if p['packet'].startswith('atlas'))
testroot=Path(tempfile.mkdtemp(prefix='longitudinal-integrity-'))
rows=[]
for n,target in enumerate(['scenario.json','engine/model.ts','schema/scenario.ts','schema/lifecycle.ts','surface.mjs','play.mjs','manifest.json']):
 d=testroot/f'case-{n}'/p['packet'];d.parent.mkdir();shutil.copytree(p['path'],d)
 f=d/target;f.chmod(0o644);f.write_bytes(f.read_bytes()+b'\n// integrity smoke mutation\n' if f.suffix!='.json' else f.read_bytes()+b' ')
 cp=subprocess.run(['node',str(d/'play.mjs'),p['manifestSha256'],'tamper-smoke','start'],capture_output=True,text=True)
 assert cp.returncode==2,(target,cp.stdout,cp.stderr)
 out=json.loads(cp.stdout);assert 'hash mismatch' in out['protocolError'],out
 assert not list((d.parent/'sessions').rglob('session.json'))
 rows.append({'tampered':target,'passed':True,'result':out})
# A wrong externally supplied pin cannot load the scenario/runtime.
cp=subprocess.run(['node',p['path']+'/play.mjs','0'*64,'wrong-pin-smoke','start'],capture_output=True,text=True)
assert cp.returncode==2 and 'Pinned manifest hash mismatch' in cp.stdout
rows.append({'tampered':'external pin','passed':True})
# The trusted frozen runtime is byte-for-byte the recorded Git commit, not merely working tree provenance.
for f in ['engine/model.ts','schema/scenario.ts','schema/lifecycle.ts']:
 data=subprocess.check_output(['git','-C','/workspace/shared/combination-fork-recovery-20261028','show','61a9b4ee8c6235bff07f97eb16d713ec6125c81e:experiments/tangible-campaign/'+f])
 assert data==(Path(p['path'])/f).read_bytes()
 rows.append({'commitByteEquality':f,'passed':True,'sha256':hashlib.sha256(data).hexdigest()})
(r/'evidence'/'integrity-smoke.json').write_text(json.dumps({'temporaryFaultInjectionRoot':str(testroot),'allPassed':True,'checks':rows},indent=2)+'\n')
print(json.dumps(rows,indent=2))
