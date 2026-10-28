from pathlib import Path
import json,hashlib,sys
root=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
for row in json.loads((root/'protected-inputs.json').read_text()):assert sha(Path(row['path']))==row['sha256'],row['path']
manifest=json.loads((root/'manifest.json').read_text())
assert sha(root/'scenario.json')==manifest['scenarioSha256']
for f in ['tests.exit','handoff-tests.exit','typecheck.exit','verification.exit']:assert (root/'evidence'/f).read_text().strip()=='0',f
files={str(p.relative_to(root)):sha(p) for p in sorted(root.rglob('*')) if p.is_file() and p.name not in ['artifact-seal.json','SHA256SUMS']}
seal=root/'artifact-seal.json'
if '--check' in sys.argv:
 data=json.loads(seal.read_text());assert data['files']==files,'Candidate artifact files changed';print(f"PASS: {len(files)} artifact files and {manifest['protectedFileCount']} protected inputs verified")
else:
 data={'format':1,'status':'isolated logical candidate; not integrated/published/deployed','scenarioSha256':manifest['scenarioSha256'],'files':files}
 seal.write_text(json.dumps(data,indent=2)+'\n')
 (root/'SHA256SUMS').write_text(''.join(f'{h}  {p}\n' for p,h in files.items())+f'{sha(seal)}  artifact-seal.json\n')
 print(json.dumps({'files':len(files),'sealSha256':sha(seal),'scenarioSha256':manifest['scenarioSha256']},indent=2))
