#!/usr/bin/env python3
"""Exact local successor over LIVE86; no source mutation or remote writes."""
from pathlib import Path
import hashlib,json,sys
R=Path(__file__).resolve().parents[3];E=R/'experiments/tangible-campaign/evidence/playtest-repairs-20261028';O=R/'results/playtest-repairs-20261028';O.mkdir(parents=True,exist_ok=True)
S='experiments/tangible-campaign/integration/source-manifest.json';D=str((E/'integration-decision.json').relative_to(R));X={'.git','node_modules','dist','results','__pycache__'}
def meta(p):
 b=p.read_bytes();return {'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b)}
a={str(p.relative_to(R)):meta(p)for p in sorted(R.rglob('*'))if p.is_file()and not X.intersection(p.relative_to(R).parts)};b=json.loads((E/'baseline-source-inventory.json').read_text());d=json.loads((E/'integration-decision.json').read_text());seal=json.loads((R/S).read_text());errors=[]
assert meta(E/'parent-source-manifest.json')['sha256']=='ce7ecf3eb8c09460d046987cfaec969f0c7e72e902f5ffe07e6b0faa80acfefb';assert len(b)==1442
changed={p:m for p,m in a.items()if p in b and m!=b[p]and p!=S};added={p:m for p,m in a.items()if p not in b and p!=D};removed=sorted(b.keys()-a.keys())
if changed!=d['changedFiles']:errors.append('Exact approved changed files mismatch')
if added!=d['addedFiles']:errors.append('Exact approved added files mismatch')
if removed:errors.append('Removed source '+str(removed))
for p,m in b.items():
 if p.startswith('experiments/tangible-campaign/evidence/')or p.endswith('/source-successors.json')or p=='experiments/tangible-campaign/reviews/lifecycle/audit.json':
  if a.get(p)!=m:errors.append('Protected historical evidence changed '+p)
for p in ['experiments/tangible-campaign/ui/scenarios.ts','experiments/tangible-campaign/ui/campaign-milestones.ts','experiments/tangible-campaign/ui/campaign-reactivity.ts','experiments/tangible-campaign/ui/legacy-scenarios.ts']:
 if a[p]!=b[p]:errors.append('Preserved registry/policy changed '+p)
author=json.loads((E/'authoring-parent-source-inventory.json').read_text())
for p,v in json.loads((R/'experiments/tangible-campaign/reviews/playtest-repairs/source-successors.json').read_text())['files'].items():
 if author[p]['sha256']!=v['beforeSha256']or meta(R/v['predecessorSnapshotPath'])['sha256']!=v['beforeSha256']or a[p]['sha256']!=v['afterSha256']:errors.append('Exact sourcechain drift '+p)
for group in json.loads((E/'accepted-inputs.json').read_text()).values():
 for row in group['files']:
  if meta(R/row['snapshotPath'])!={'sha256':row['sha256'],'bytes':row['bytes']}:errors.append('Accepted input snapshot drift '+row['snapshotPath'])
sealed=seal['baseCommit']==d['baseCommit']=='86c479746909412d775873d5bb250868ed7bf2d0'and seal['parentSourceSealSha256']==b[S]['sha256']and seal['files']=={p:m for p,m in a.items()if p!=S}
if not sealed:errors.append('Source seal or parent mismatch')
report={'baseCommit':d['baseCommit'],'parentSourceSealSha256':b[S]['sha256'],'sourceSealSha256':a[S]['sha256'],'sourceFileCount':len(a),'sourceSealedExact':sealed,'changed':sorted(changed)+[S],'added':sorted(added)+[D],'removed':removed,'errors':errors,'publicationPerformed':False}
(O/'exact-source-delta.json').write_text(json.dumps(report,indent=2)+'\n');(O/'source-inventory.json').write_text(json.dumps({'baseCommit':d['baseCommit'],'sourceSealSha256':a[S]['sha256'],'files':a},indent=2)+'\n');print(f'{len(a)} source files; {len(changed)+1} changed, {len(added)+1} added, {len(removed)} removed; sealed={sealed}')
if errors:print('\n'.join(errors));sys.exit(1)
print('PASS exact LIVE86 successor; all historical artifacts/manifests/world IDs preserved.')
