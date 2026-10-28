#!/usr/bin/env python3
"""Exact final source and direct deployment delta, with separate immutable authoring ancestry."""
from pathlib import Path
import json,hashlib,sys
R=Path(__file__).resolve().parents[3];E=R/'experiments/tangible-campaign/evidence/integration-20261028/reactive-heroes-release-20261028';O=R/'results/reactive-heroes-release-20261028';O.mkdir(parents=True,exist_ok=True);S='experiments/tangible-campaign/integration/source-manifest.json';D=str((E/'integration-decision.json').relative_to(R));X={'.git','node_modules','dist','results','__pycache__'}
def meta(p):b=p.read_bytes();return {'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b)}
a={str(p.relative_to(R)):meta(p)for p in sorted(R.rglob('*'))if p.is_file()and not X.intersection(p.relative_to(R).parts)}
b=json.loads((E/'authoring-parent-source-inventory.json').read_text());deploy=json.loads((E/'deployment-parent-source-inventory.json').read_text());d=json.loads((E/'integration-decision.json').read_text());seal=json.loads((R/S).read_text());errors=[]
assert meta(E/'authoring-parent-source-manifest.json')['sha256']==b['sourceSealSha256']=='565a8ada87cf543ab5fb07d82d9860e546d5151324bf2085a36f194d268bf0d6';assert len(b['files'])==1021
assert meta(E/'deployment-parent-source-manifest.json')['sha256']==deploy['sourceSealSha256']=='6fe9b6d16507c264be9c818ef25b6c69e5f9796f18b6dcb87af80e7c588e307d';assert deploy['baseCommit']=='217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c';assert len(deploy['files'])==750
changed={p:m for p,m in a.items()if p in b['files']and m!=b['files'][p]and p!=S};added={p:m for p,m in a.items()if p not in b['files']and p!=D};removed=sorted(b['files'].keys()-a.keys())
if changed!=d['changedAuthoringFiles']:errors.append('Exact approved authoring changes mismatch')
if added!=d['addedFiles']:errors.append('Unexpected/missing/changed additions')
if removed:errors.append('Removed authoring source '+str(removed))
for p,m in b['files'].items():
 if p.startswith('experiments/tangible-campaign/ui/campaigns/')or p.endswith('/source-successors.json')or(p.startswith('experiments/tangible-campaign/evidence/')and p.endswith('-route-evidence.json')):
  if a.get(p)!=m:errors.append('Historical module/manifest/route evidence changed '+p)
for author in d['acceptedAuthors']:
 for row in author['snapshots']:
  if meta(R/row['snapshotPath'])!={'sha256':row['sha256'],'bytes':row['bytes']}:errors.append('Accepted author snapshot drift '+row['snapshotPath'])
 for row in author['implementation']:
  if a.get(row['path'],{}).get('sha256')!=row['integratedSha256']:errors.append('Author or documented merge implementation drift '+row['path'])
  if row['authorAfterSha256']!=row['integratedSha256']and not row.get('mergeReason'):errors.append('Undocumented author merge '+row['path'])
successor=json.loads((R/'experiments/tangible-campaign/reviews/reactive-heroes/source-successors.json').read_text())
for p,row in successor['files'].items():
 if b['files'][p]['sha256']!=row['beforeSha256']or meta(R/row['predecessorSnapshotPath'])['sha256']!=row['beforeSha256']:errors.append('Final chain predecessor mismatch '+p)
 if a[p]['sha256']!=row['afterSha256']:errors.append('Final chain source drift '+p)
source=json.loads((R/'experiments/tangible-campaign/evidence/integration-20261028/source-inputs.json').read_text())
for row in source['inputs']:
 if meta(R/row['snapshotPath'])['sha256']!=row['sha256']:errors.append('Historical accepted snapshot changed '+row['snapshotPath'])
if a['experiments/tangible-campaign/reviews/lifecycle/audit.json']!=b['files']['experiments/tangible-campaign/reviews/lifecycle/audit.json']:errors.append('Lifecycle audit changed despite unchanged graph')
sealed=seal['baseCommit']==deploy['baseCommit']and seal['deploymentParentSourceSealSha256']==deploy['sourceSealSha256']and seal['authoringParentSourceSealSha256']==b['sourceSealSha256']and seal['files']=={p:m for p,m in a.items()if p!=S}
if not sealed:errors.append('Final complete source seal or parent binding mismatch')
deployRemoved=sorted(deploy['files'].keys()-a.keys());deployChanged=[p for p in deploy['files']if p in a and a[p]!=deploy['files'][p]];deployAdded=sorted(a.keys()-deploy['files'].keys())
if deployRemoved:errors.append('Removed deployment source '+str(deployRemoved))
report={'baseCommit':deploy['baseCommit'],'deploymentParentSourceSealSha256':deploy['sourceSealSha256'],'authoringParentSourceSealSha256':b['sourceSealSha256'],'sourceSealSha256':a[S]['sha256'],'sourceFileCount':len(a),'authoringDelta':{'changed':sorted(changed)+[S],'added':sorted(added)+[D],'removed':removed},'deploymentDelta':{'changed':deployChanged,'added':deployAdded,'removed':deployRemoved},'sourceSealedExact':sealed,'historicalCampaignsManifestsRoutesAndAuditExact':True,'errors':errors,'publicationPerformed':False}
(O/'exact-source-delta.json').write_text(json.dumps(report,indent=2)+'\n');(O/'source-inventory.json').write_text(json.dumps({'baseCommit':deploy['baseCommit'],'sourceSealSha256':a[S]['sha256'],'files':a},indent=2)+'\n');print(f'{len(a)} source files; direct217 delta {len(deployChanged)} changed + {len(deployAdded)} added, {len(deployRemoved)} removed; sealed={sealed}')
if errors:print('\n'.join(errors));sys.exit(1)
print('PASS exact final source, author patches/merges, complete historical preservation and direct217 deployment scope.')
