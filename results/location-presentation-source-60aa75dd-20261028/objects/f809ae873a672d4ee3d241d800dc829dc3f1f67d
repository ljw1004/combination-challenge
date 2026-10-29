#!/usr/bin/env python3
"""Verify this local milestone-only successor against the complete preceding sealed batch."""
from pathlib import Path
import hashlib,json,subprocess,sys
ROOT=Path(__file__).resolve().parents[3]
REVIEW=ROOT/'experiments/tangible-campaign/reviews/milestones'
SEAL='experiments/tangible-campaign/integration/source-manifest.json'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
parent=REVIEW/'parent-source-manifest.json'
manifest=json.loads((REVIEW/'source-successors.json').read_text())
assert sha(parent)==manifest['baseSealSha256']=='141353c215738e7df4ffccbf9154610573175d667f2252a79ac93a02b2e37caa'
base=json.loads(parent.read_text())['files']
files={str(p.relative_to(ROOT)):p for p in ROOT.rglob('*') if p.is_file() and not {'.git','node_modules','dist','results','__pycache__'}.intersection(p.relative_to(ROOT).parts)}
errors=[]
for path,row in base.items():
 if path not in files:errors.append('Missing inherited file '+path);continue
 change=manifest['files'].get(path)
 if change and change['beforeSha256']!=row['sha256']:errors.append('Incorrect predecessor '+path)
 expected=change['afterSha256'] if change else row['sha256']
 if sha(files[path])!=expected:errors.append('Unreviewed inherited change '+path)
added=set(files)-set(base)-{SEAL}
expected_added=set(manifest['addedFiles'])|{
 'experiments/tangible-campaign/reviews/milestones/README.md',
 'experiments/tangible-campaign/reviews/milestones/source-successors.json',
 'experiments/tangible-campaign/reviews/milestones/parent-source-manifest.json',
 'experiments/tangible-campaign/integration/verify-milestone-delta.py',
}
if added!=expected_added:errors.append('Unexpected or missing additions '+str(sorted(added^expected_added)))
for path,expected in manifest['addedFiles'].items():
 if path not in files or sha(files[path])!=expected:errors.append('Added source hash mismatch '+path)
if errors:print('\n'.join(errors));sys.exit(1)
subprocess.run([sys.executable,str(ROOT/'experiments/tangible-campaign/integration/verify-manifest.py')],check=True)
print(f'PASS milestone-only successor: {len(manifest["files"])} modified inherited files, {len(added)} explicit additions; all other {len(base)-len(manifest["files"])} inherited files exact. No publication performed.')
