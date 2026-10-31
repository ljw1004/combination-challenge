#!/usr/bin/env python3
"""Strict complete-source successor over the sealed 141 batch; never publishes or infers a Git parent."""
from pathlib import Path
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[3];OUT=ROOT/'results/milestone-atlas-20261028';OUT.mkdir(parents=True,exist_ok=True)
E=ROOT/'experiments/tangible-campaign/evidence/integration-20261028/milestone-atlas-20261028';SEAL='experiments/tangible-campaign/integration/source-manifest.json';DECISION=str((E/'integration-decision.json').relative_to(ROOT));EXCLUDED={'.git','node_modules','dist','results','__pycache__'}
def meta(p):b=p.read_bytes();return {'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b)}
actual={str(p.relative_to(ROOT)):meta(p)for p in sorted(ROOT.rglob('*'))if p.is_file()and not EXCLUDED.intersection(p.relative_to(ROOT).parts)}
base=json.loads((E/'parent-source-inventory.json').read_text());decision=json.loads((E/'integration-decision.json').read_text());seal=json.loads((ROOT/SEAL).read_text());errors=[]
assert meta(E/'parent-source-manifest.json')['sha256']==base['sourceSealSha256']=='141353c215738e7df4ffccbf9154610573175d667f2252a79ac93a02b2e37caa'
assert len(base['files'])==938
changed=[p for p in base['files']if p in actual and actual[p]!=base['files'][p]and p!=SEAL];removed=sorted(base['files'].keys()-actual.keys());added=sorted(actual.keys()-base['files'].keys())
if removed:errors.append('Removed parent source '+str(removed))
if set(changed)!=set(decision['changedParentFiles']):errors.append('Unapproved/missing inherited changes')
if set(added)!=(set(decision['addedFiles'])|{DECISION}):errors.append('Unexpected/missing additions')
for p,m in {**decision['changedParentFiles'],**decision['addedFiles']}.items():
 if actual.get(p)!=m:errors.append('Exact approved source mismatch '+p)
for p,m in base['files'].items():
 if p.startswith('experiments/tangible-campaign/ui/campaigns/')and actual.get(p)!=m:errors.append('Historical campaign rewritten '+p)
author=json.loads((E/'milestone-author-delivery-manifest.json').read_text());successor=json.loads((ROOT/'experiments/tangible-campaign/reviews/milestone-atlas/source-successors.json').read_text())
for p,row in successor['files'].items():
 if meta(ROOT/row['authorSnapshotPath'])['sha256']!=row['beforeSha256']:errors.append('Author predecessor snapshot mismatch '+p)
 if actual.get(p,{}).get('sha256')!=row['afterSha256']:errors.append('Integration successor drift '+p)
for p,row in author['changed'].items():
 if p==SEAL:continue
 if base['files'][p]['sha256']!=row['beforeSha256']:errors.append('Milestone base mismatch '+p)
 next=successor['files'].get(p)
 if next and next['beforeSha256']!=row['afterSha256']:errors.append('Milestone author chain mismatch '+p)
 if actual.get(p,{}).get('sha256')!=(next['afterSha256']if next else row['afterSha256']):errors.append('Milestone accepted source drift '+p)
for p,h in author['added'].items():
 next=successor['files'].get(p)
 if next and next['beforeSha256']!=h:errors.append('Added author chain mismatch '+p)
 if actual.get(p,{}).get('sha256')!=(next['afterSha256']if next else h):errors.append('Milestone accepted addition drift '+p)
source=json.loads((ROOT/'experiments/tangible-campaign/evidence/integration-20261028/source-inputs.json').read_text());old=json.loads((E/'parent-source-inputs.json').read_text());assert source['inputs'][:len(old['inputs'])]==old['inputs']
for row in source['inputs']:
 if meta(ROOT/row['snapshotPath'])['sha256']!=row['sha256']:errors.append('Input snapshot drift '+row['snapshotPath'])
audit=json.loads((ROOT/'experiments/tangible-campaign/reviews/lifecycle/audit.json').read_text());prior=json.loads((E/'parent-lifecycle-audit.json').read_text());lookup={(r['world'],r['recipe']):r for r in audit['recipes']}
for row in prior['recipes']:
 if lookup.get((row['world'],row['recipe']))!=row:errors.append('Old lifecycle row drift '+row['world']+':'+row['recipe'])
sealed=seal.get('baseCommit')is None and seal.get('parentSourceSealSha256')==base['sourceSealSha256']and seal['files']=={p:m for p,m in actual.items()if p!=SEAL}
if not sealed:errors.append('Final exact source seal/parent-source identity mismatch')
report={'parentSourceSealSha256':base['sourceSealSha256'],'publicationParentCommit':None,'gitParentBinding':'Supplied separately by sole publisher in package/handoff, never inferred','sourceSealSha256':actual[SEAL]['sha256'],'sourceFileCount':len(actual),'changedParentFiles':changed+[SEAL],'addedFiles':added,'removedFiles':removed,'priorAuditRowsExact':len(prior['recipes']),'addedAuditRows':len(audit['recipes'])-len(prior['recipes']),'inputSnapshotsVerified':len(source['inputs']),'allHistoricalCampaignModulesExact':True,'sourceSealedExact':sealed,'errors':errors,'publicationPerformed':False}
(OUT/'exact-source-delta.json').write_text(json.dumps(report,indent=2)+'\n');(OUT/'source-inventory.json').write_text(json.dumps({'parentSourceSealSha256':base['sourceSealSha256'],'sourceSealSha256':actual[SEAL]['sha256'],'files':actual},indent=2)+'\n')
print(f'{len(changed)+1} parent changes, {len(added)} additions, {len(removed)} removals; sealed={sealed}; {len(prior["recipes"])} prior audit rows exact')
if errors:print('\n'.join(errors));sys.exit(1)
print('PASS exact approved source, snapshots, author successor chains and historical modules.')
