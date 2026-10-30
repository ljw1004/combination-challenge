#!/usr/bin/env python3
"""Verify exact content-only successor scope over the current-live inventory; no Git or remote writes."""
from pathlib import Path
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'results/content-next-playtest-20261028';OUT.mkdir(parents=True,exist_ok=True)
E=ROOT/'experiments/tangible-campaign/evidence/integration-20261028/next-playtest-20261028'
BASE=json.loads((E/'parent-source-inventory.json').read_text())
EXCLUDED={'.git','node_modules','dist','results','__pycache__'}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def inventory(root):return {str(p.relative_to(root)):{'sha256':sha(p),'bytes':p.stat().st_size} for p in sorted(root.rglob('*')) if p.is_file() and not EXCLUDED.intersection(p.relative_to(root).parts)}
allowed={
 'experiments/tangible-campaign/reviews/lifecycle/lifecycle.test.ts':'Recognize accepted copy-workroom Purpose identity in the unchanged six-focus/no-exemption catalogue check; retain every lifecycle assertion.',
 'experiments/tangible-campaign/ui/scenarios.ts':'Feature only accepted exact successor modules, preserve former direct routes, and apply recorded chooser-only presentation data.',
 'experiments/tangible-campaign/evidence/integration-20261028/source-inputs.json':'Append frozen exact inputs and current-live provenance; feature accepted candidate source identities.',
 'experiments/tangible-campaign/integration/reviewed-routes.ts':'Point source-aware integration replay at exact candidate route witness; recognize authoredActions data without runtime remapping.',
 'experiments/tangible-campaign/reviews/lifecycle/audit.json':'Add all accepted successor lifecycle rows without modifying or removing any old row; all scenarios remain validated.',
 'experiments/tangible-campaign/integration/source-manifest.json':'Final exact source-set seal after the accepted scope and checks finish.',
 'tests/reviewed-campaign-integration.test.ts':'Include retained human-checkpoint predecessors in catalogue cardinality and current exact-source assertions.',
 'tests/late-doctrine-content-integration.test.mjs':'Retarget only featured-selection assertion; preserve all ten-desk historical source, gameplay, checkpoint and read assertions.',
 'tests/morning-content-integration.test.ts':'Resolve preserved historical Purpose by its original scenario ID after new feature selection; retain historical exactness assertions.'
}
actual=inventory(ROOT);changed=[];removed=[];errors=[]
for p,old in BASE['files'].items():
 if p not in actual:removed.append(p);errors.append('Removed parent source '+p)
 elif actual[p]!=old:
  changed.append({'path':p,'before':old,'after':actual[p],'reason':allowed.get(p)})
  if p not in allowed:errors.append('Unapproved changed parent source '+p)
added=[{'path':p,**m} for p,m in actual.items() if p not in BASE['files']]
for row in added:
 p=row['path']
 if p.startswith('src/') or p.startswith('experiments/tangible-campaign/engine/') or p.startswith('experiments/tangible-campaign/schema/') or (p.startswith('experiments/tangible-campaign/ui/') and not p.startswith('experiments/tangible-campaign/ui/campaigns/')):errors.append('Forbidden implementation addition '+p)
source=json.loads((ROOT/'experiments/tangible-campaign/evidence/integration-20261028/source-inputs.json').read_text())
for row in source['inputs']:
 if sha(ROOT/row['snapshotPath'])!=row['sha256']:errors.append('Input snapshot hash '+row['snapshotPath'])
prior=json.loads((E/'parent-source-inputs.json').read_text())
if source['inputs'][:len(prior['inputs'])]!=prior['inputs']:errors.append('Prior source input metadata changed')
audit=json.loads((ROOT/'experiments/tangible-campaign/reviews/lifecycle/audit.json').read_text());oldAudit=json.loads((E/'parent-lifecycle-audit.json').read_text())
byKey={(x['world'],x['recipe']):x for x in audit['recipes']}
for old in oldAudit['recipes']:
 if byKey.get((old['world'],old['recipe']))!=old:errors.append('Prior audit row changed '+old['world']+':'+old['recipe'])
sealPath='experiments/tangible-campaign/integration/source-manifest.json';seal=json.loads((ROOT/sealPath).read_text());sealed=seal['files']=={p:m for p,m in actual.items() if p!=sealPath}
report={'baseCommit':BASE['baseCommit'],'sourceFileCount':len(actual),'changedParentFiles':changed,'addedFiles':added,'removedFiles':removed,'allInputHashesMatch':not any(e.startswith('Input snapshot')for e in errors),'exactPriorAuditRows':len(oldAudit['recipes']),'sourceSealedExact':sealed,'errors':errors,'deploymentPerformed':False,'limits':'Exact local source/input/audit scope only; not Git, publication, browser/UI or fresh-player evidence.'}
(OUT/'exact-source-delta.json').write_text(json.dumps(report,indent=2)+'\n');(OUT/'source-inventory.json').write_text(json.dumps({'baseCommit':BASE['baseCommit'],'files':actual},indent=2)+'\n')
print(f'Parent delta: {len(changed)} existing changed, {len(added)} added, {len(removed)} removed; {len(source["inputs"])} input snapshots checked; source sealed exact: {sealed}.')
if errors:print('\n'.join(errors));sys.exit(1)
print('PASS: exact current-live source scope; prior input metadata and lifecycle rows unchanged. Final seal is separately required.')
