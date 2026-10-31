#!/usr/bin/env python3
"""Exact bounded live51 successor scope. Read local source; only write generated evidence."""
from pathlib import Path
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'results/arrival-content-20261028';OUT.mkdir(parents=True,exist_ok=True)
E=ROOT/'experiments/tangible-campaign/evidence/integration-20261028/arrival-content-20261028'
BASE=json.loads((E/'parent-source-inventory.json').read_text())
SEAL='experiments/tangible-campaign/integration/source-manifest.json'
EXCLUDED={'.git','node_modules','dist','results','__pycache__'}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def inventory(root):return {str(p.relative_to(root)):{'sha256':sha(p),'bytes':p.stat().st_size}for p in sorted(root.rglob('*'))if p.is_file()and not EXCLUDED.intersection(p.relative_to(root).parts)}
patch=json.loads((E/'accepted-arrival-manifest.json').read_text())
allowed={p:'Exact approved arrival patch; checked against accepted complete-file hash.' for p in patch['files']}
allowed.update({
 'README.md':'Replace obsolete homepage/interaction documentation with accurate current source, play, reproduction and limits.',
 'experiments/tangible-campaign/evidence/integration-20261028/source-inputs.json':'Append exact frozen inputs; point current Elements/Doctrine to accepted separate identities; prior entire manifest frozen.',
 'experiments/tangible-campaign/integration/reviewed-routes.ts':'Current Elements route reads exact accepted final checkpoint; other route witness data unchanged.',
 'experiments/tangible-campaign/reviews/lifecycle/audit.json':'All prior audit rows retained exact; add only new identities.',
 'experiments/tangible-campaign/ui/scenarios.ts':'Exactly six focuses; new Elements/Doctrine content, old direct routes/save identities retained, compact first-four-desks chooser text.',
 'tests/reviewed-campaign-integration.test.ts':'Include exact retained new predecessors; do not reapply historical crock-label delta already included by accepted candidate.',
 'tests/late-doctrine-content-integration.test.mjs':'Retain historical data/route assertions; explicit four-file approved arrival guard and current featured ID only.',
 'tests/late-elements-label-integration.test.mjs':'Historical label test uses its unchanged historical route, not successor route.',
 'tests/next-doctrine-checkpoint-integration.test.mjs':'Retain historical data/route assertions; explicit four-file approved arrival guard and current featured ID only.',
 'tests/next-purpose-checkpoint-integration.test.mjs':'Retain exact Purpose/source assertions; explicit four-file approved arrival guard only.',
 SEAL:'Final strict exact-set successor source seal; full original seal archived unchanged.'
})
actual=inventory(ROOT);errors=[];changed=[];removed=[]
assert BASE['baseCommit']=='51b6f9f5090c99174997793e49affff24fecd814'
assert sha(E/'parent-source-manifest.json')==BASE['sourceSealSha256']=='34e905e4f1898bdc0ee82ee0531d0607e2c4120d7128959f3a2a42a020eb1a90'
for p,old in BASE['files'].items():
 if p not in actual:removed.append(p);errors.append('Removed parent '+p)
 elif actual[p]!=old:
  changed.append({'path':p,'before':old,'after':actual[p],'reason':allowed.get(p)})
  if p not in allowed:errors.append('Unapproved change '+p)
for p,h in patch['files'].items():
 if actual.get(p,{}).get('sha256')!=h:errors.append('Accepted arrival file drift '+p)
if sha(E/'accepted-arrival.patch')!='2fd289bc514c01bea5ec1bbee23583bf1a3bd95bc9b406ff426de8031bad92de':errors.append('Arrival patch drift')
added=[{'path':p,**m}for p,m in actual.items()if p not in BASE['files']]
for r in added:
 p=r['path']
 if p.startswith('src/')or p.startswith('experiments/tangible-campaign/schema/')or(p.startswith('experiments/tangible-campaign/engine/')and p!='experiments/tangible-campaign/engine/arrival.test.ts'):errors.append('Unapproved implementation addition '+p)
 if p.startswith('experiments/tangible-campaign/ui/')and p not in ['experiments/tangible-campaign/ui/campaigns/'+x for x in ['elements-opening-wheel.ts','doctrine-compact-opening.ts','arrival-content-predecessors-20261028.ts']]:errors.append('Unapproved UI addition '+p)
source=json.loads((ROOT/'experiments/tangible-campaign/evidence/integration-20261028/source-inputs.json').read_text());prior=json.loads((E/'parent-source-inputs.json').read_text())
if source['inputs'][:len(prior['inputs'])]!=prior['inputs']:errors.append('Historical input metadata changed')
for r in source['inputs']:
 if sha(ROOT/r['snapshotPath'])!=r['sha256']:errors.append('Snapshot mismatch '+r['snapshotPath'])
audit=json.loads((ROOT/'experiments/tangible-campaign/reviews/lifecycle/audit.json').read_text());oldAudit=json.loads((E/'parent-lifecycle-audit.json').read_text());byKey={(x['world'],x['recipe']):x for x in audit['recipes']}
for r in oldAudit['recipes']:
 if byKey.get((r['world'],r['recipe']))!=r:errors.append('Old lifecycle row changed '+r['world']+':'+r['recipe'])
seal=json.loads((ROOT/SEAL).read_text());sealed=seal['baseCommit']==BASE['baseCommit']and seal['files']=={p:m for p,m in actual.items()if p!=SEAL}
if not sealed:errors.append('Exact source seal stale or wrong parent')
report={'baseCommit':BASE['baseCommit'],'sourceFileCount':len(actual),'changedParentFiles':changed,'addedFiles':added,'removedFiles':removed,'sourceSealedExact':sealed,'parentSourceSealSha256':BASE['sourceSealSha256'],'inputSnapshotsVerified':len(source['inputs']),'priorInputMetadataExact':len(prior['inputs']),'exactPriorAuditRows':len(oldAudit['recipes']),'acceptedArrivalFilesExact':len(patch['files']),'allOldCampaignModuleBytesExact':not any(r['path'].startswith('experiments/tangible-campaign/ui/campaigns/')for r in changed),'errors':errors,'actualCheckoutModified':False,'publicationPerformed':False}
(OUT/'exact-source-delta.json').write_text(json.dumps(report,indent=2)+'\n');(OUT/'source-inventory.json').write_text(json.dumps({'baseCommit':BASE['baseCommit'],'files':actual},indent=2)+'\n')
print(f"{len(changed)} changed, {len(added)} added, {len(removed)} removed; {len(source['inputs'])} inputs; {len(oldAudit['recipes'])} old audit rows exact; seal={sealed}.")
if errors:print('\n'.join(errors));sys.exit(1)
print('PASS exact authorized successor scope and history preservation.')
