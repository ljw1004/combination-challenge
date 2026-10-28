#!/usr/bin/env python3
"""Check isolated successor scope against exact live-parent inventory; write local evidence only."""
from pathlib import Path
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'results/content-late-20261028';OUT.mkdir(parents=True,exist_ok=True)
E=ROOT/'experiments/tangible-campaign/evidence/integration-20261028/late-revision-20261028'
BASE=json.loads((E/'parent-source-inventory.json').read_text())
EXCLUDED={'.git','node_modules','dist','results','__pycache__'}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def inventory(root):return {str(p.relative_to(root)):{'sha256':sha(p),'bytes':p.stat().st_size} for p in sorted(root.rglob('*')) if p.is_file() and not any(x in EXCLUDED for x in p.relative_to(root).parts)}
allowed={
 'experiments/tangible-campaign/reviews/lifecycle/lifecycle.test.ts':'Replace obsolete fixed active counts with exact current nonarchived catalogue/audit invariants and six featured-focus inclusion checks; preserve all lifecycle checks.',
 'experiments/tangible-campaign/ui/campaigns/elements.ts':'Exact approved Sealed crock to Lidded crock label only; unchanged scenario/save identity.',
 'tests/reviewed-campaign-integration.test.ts':'Apply exact Elements and Mars archive-label overrides; recognize approved Mars source already contains live carrier strings.',
 'experiments/tangible-campaign/evidence/integration-20261028/source-inputs.json':'Append exact input snapshots and point featured Doctrine and Mars at approved exact candidates.',
 'experiments/tangible-campaign/integration/generate-evidence.ts':'Optional campaign selection and per-campaign parent provenance for current replay.',
 'experiments/tangible-campaign/integration/reviewed-routes.ts':'Use approved Doctrine author witness and five corrected Mars route files without runtime remapping.',
 'experiments/tangible-campaign/integration/verify-manifest.py':'Accept explicit parent commit when sealing successor.',
 'experiments/tangible-campaign/integration/source-manifest.json':'Final exact source seal after approved scope and completed checks.',
 'experiments/tangible-campaign/reviews/lifecycle/audit.json':'Add approved lifecycle declarations; preserve prior row membership/data with display-only incorporation sorting.',
 'experiments/tangible-campaign/ui/campaigns/predecessors-20261028.ts':'Register unchanged old Doctrine v10 and Mars readable-fields direct route/save identities.',
 'experiments/tangible-campaign/ui/scenarios.ts':'Feature approved new Doctrine and Mars modules; preserve other registry data.',
 'tests/morning-content-integration.test.ts':'Target historical Doctrine and Mars preservation assertions at retained predecessors; invert exact Elements label for frozen historical comparison.'
}
actual=inventory(ROOT);changed=[];removed=[];errors=[]
for p,old in BASE['files'].items():
 if p not in actual:removed.append(p);errors.append('Removed parent source '+p)
 elif actual[p]!=old:
  changed.append({'path':p,'before':old,'after':actual[p],'reason':allowed.get(p)})
  if p not in allowed:errors.append('Unapproved changed parent source '+p)
added=[{'path':p,**m} for p,m in actual.items() if p not in BASE['files']]
source=json.loads((ROOT/'experiments/tangible-campaign/evidence/integration-20261028/source-inputs.json').read_text())
for row in source['inputs']:
 if sha(ROOT/row['snapshotPath'])!=row['sha256']:errors.append('Input snapshot hash '+row['snapshotPath'])
sealPath='experiments/tangible-campaign/integration/source-manifest.json'
seal=json.loads((ROOT/sealPath).read_text())
sourceSealed=seal['files']=={p:m for p,m in actual.items() if p!=sealPath}
report={'baseCommit':BASE['baseCommit'],'sourceFileCount':len(actual),'changedParentFiles':changed,'addedFiles':added,'removedFiles':removed,'allInputHashesMatch':not any(e.startswith('Input snapshot') for e in errors),'errors':errors,'sourceSealedExact':sourceSealed,'deploymentPerformed':False,'limits':'Local source scope/hash verification only; not publication, deployment, browser or UI evidence.'}
(OUT/'exact-source-delta.json').write_text(json.dumps(report,indent=2)+'\n')
(OUT/'source-inventory.json').write_text(json.dumps({'baseCommit':BASE['baseCommit'],'files':actual},indent=2)+'\n')
print(f'Parent delta: {len(changed)} existing changed, {len(added)} added, {len(removed)} removed; {len(source["inputs"])} input snapshots checked.')
if errors:print('\n'.join(errors));sys.exit(1)
print('PASS: all existing-source changes are scoped, source input hashes match; deployment seal status is separately tracked.')
