#!/usr/bin/env python3
"""Exact current batch successor. Approved implementation changes must match complete reviewed patch hashes."""
from pathlib import Path
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[3];OUT=ROOT/'results/kitchen-atlas-20261028';OUT.mkdir(parents=True,exist_ok=True)
E=ROOT/'experiments/tangible-campaign/evidence/integration-20261028/kitchen-atlas-20261028';BASE=json.loads((E/'parent-source-inventory.json').read_text());SEAL='experiments/tangible-campaign/integration/source-manifest.json';EXCLUDED={'.git','node_modules','dist','results','__pycache__'}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def inventory():return {str(p.relative_to(ROOT)):{'sha256':sha(p),'bytes':p.stat().st_size}for p in sorted(ROOT.rglob('*'))if p.is_file()and not EXCLUDED.intersection(p.relative_to(ROOT).parts)}
allowed={
 'README.md':'Accurate current game/entry/arrival presentation and limits; earlier bytes retained in parent inventory.',
 'DESIGN_PRINCIPLES.md':'Record current explicit user preferences for continuing kitchens/earned meal ending and accepted arrival UI only.',
 'experiments/tangible-campaign/evidence/integration-20261028/source-inputs.json':'Append exact accepted source snapshots and current Food provenance; historical metadata prefix exact.',
 'experiments/tangible-campaign/integration/reviewed-routes.ts':'Feature exact accepted Food author routes, retain older route witnesses unchanged.',
 'experiments/tangible-campaign/reviews/lifecycle/audit.json':'All old lifecycle rows exact; additive new scenario identities only.',
 'experiments/tangible-campaign/reviews/lifecycle/lifecycle.test.ts':'Recognize Kitchen Caravan as same Food focus with no validator exemption.',
 'experiments/tangible-campaign/ui/scenarios.ts':'Current Food, optional Atlas secondary entry, exact retained old worlds; exactly six focuses.',
 'tests/reviewed-campaign-integration.test.ts':'Explicit registry cardinality plus pinned accepted-event ancestry diagnostic for the two early-kitchen routes; all canonical and other alternative assertions retained.',
 'tests/arrival-doctrine-compact.test.mjs':'Pinned dividerY-only geometry comparison normalization with finite/bounded geometry checks; logical fields retained.',
 'tests/reviewed-copy-corrections.test.ts':'Resolve source-specific historical scenario by exact retained ID rather than new feature pointer.',
 'tests/campaign-refinement-branches.test.ts':'Historical branded Food branch tests remain tied to exact retained played v5.',
 'tests/arrival-combined-integration.test.ts':'Update explicit registry count; any implementation-parity adaptation must be pinned by accepted UI manifest.',
 SEAL:'Final exact source seal over217; original complete seal frozen unchanged.'}
ui=E/'accepted-ui-manifest.json';patch=json.loads(ui.read_text())if ui.exists()else None
decisionPath=E/'integration-decision.json';decision=json.loads(decisionPath.read_text())if decisionPath.exists()else {};adjustments=decision.get('approvedIntegrationAdjustments',{})
if patch:allowed.update({p:'Exact accepted grouped-arrival implementation successor.'for p in patch['files']})
actual=inventory();errors=[];changed=[];removed=[]
assert BASE['baseCommit']=='217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c';assert sha(E/'parent-source-manifest.json')==BASE['sourceSealSha256']=='6fe9b6d16507c264be9c818ef25b6c69e5f9796f18b6dcb87af80e7c588e307d'
for p,m in BASE['files'].items():
 if p not in actual:removed.append(p);errors.append('Removed parent source '+p)
 elif actual[p]!=m:
  changed.append({'path':p,'before':m,'after':actual[p],'reason':allowed.get(p)})
  if p not in allowed:errors.append('Unapproved source change '+p)
if patch:
 for p,h in patch['files'].items():
  expected=adjustments.get(p,{}).get('afterSha256',h)
  if p in adjustments and adjustments[p].get('authorSha256')!=h:errors.append('UI adjustment predecessor mismatch '+p)
  if actual.get(p,{}).get('sha256')!=expected:errors.append('Reviewed UI source drift '+p)
for p,row in decision.get('diagnosticTestSuccessors',{}).items():
 if BASE['files'][p]['sha256']!=row['parentSha256']:errors.append('Diagnostic test parent mismatch '+p)
 if actual.get(p,{}).get('sha256')!=row['afterSha256']:errors.append('Diagnostic test successor drift '+p)
elementsManifest=E/'accepted-elements-final-manifest.json'
if elementsManifest.exists():
 for row in json.loads(elementsManifest.read_text())['files']:
  p=row['path'];replacement=decision.get('elementsAuthorArtifactSuccessors',{}).get(p)
  if replacement:
   if replacement['authorSha256']!=row['sha256']or sha(ROOT/replacement['originalSnapshotPath'])!=row['sha256']:errors.append('Elements author artifact history changed '+p)
   expected=replacement['afterSha256']
  else:expected=row['sha256']
  if actual.get(p,{}).get('sha256')!=expected:errors.append('Elements accepted artifact drift '+p)
added=[{'path':p,**m}for p,m in actual.items()if p not in BASE['files']]
for r in added:
 p=r['path']
 if p.startswith('experiments/tangible-campaign/ui/'):
  expected=decision.get('acceptedModules',{}).get(p)
  if expected is None and (patch is None or p not in patch['files']):errors.append('Unapproved UI/module addition '+p)
  elif expected is not None and actual[p]['sha256']!=expected:errors.append('Accepted module hash drift '+p)
 if p.startswith('src/')or p.startswith('experiments/tangible-campaign/schema/')or(p.startswith('experiments/tangible-campaign/engine/')and(patch is None or p not in patch['files'])):errors.append('Unapproved implementation addition '+p)
source=json.loads((ROOT/'experiments/tangible-campaign/evidence/integration-20261028/source-inputs.json').read_text());prior=json.loads((E/'parent-source-inputs.json').read_text());assert source['inputs'][:len(prior['inputs'])]==prior['inputs']
for row in source['inputs']:
 if sha(ROOT/row['snapshotPath'])!=row['sha256']:errors.append('Snapshot mismatch '+row['snapshotPath'])
audit=json.loads((ROOT/'experiments/tangible-campaign/reviews/lifecycle/audit.json').read_text());old=json.loads((E/'parent-lifecycle-audit.json').read_text());byKey={(r['world'],r['recipe']):r for r in audit['recipes']}
for r in old['recipes']:
 if byKey.get((r['world'],r['recipe']))!=r:errors.append('Old audit row changed '+r['world']+':'+r['recipe'])
seal=json.loads((ROOT/SEAL).read_text());sealed=seal['baseCommit']==BASE['baseCommit']and seal['files']=={p:m for p,m in actual.items()if p!=SEAL}
if not sealed:errors.append('Source not final sealed')
resolved=decision.get('readyForSealing')is True
if not resolved:errors.append('Pending author/UI/inclusion decision; packaging blocked')
report={'baseCommit':BASE['baseCommit'],'sourceFileCount':len(actual),'changedParentFiles':changed,'addedFiles':added,'removedFiles':removed,'sourceSealedExact':sealed,'priorInputMetadataExact':len(prior['inputs']),'inputSnapshotsVerified':len(source['inputs']),'exactPriorAuditRows':len(old['recipes']),'allOldCampaignModulesExact':not any(r['path'].startswith('experiments/tangible-campaign/ui/campaigns/')for r in changed),'decisionsResolved':resolved,'errors':errors,'publicationPerformed':False}
(OUT/'exact-source-delta.json').write_text(json.dumps(report,indent=2)+'\n');(OUT/'source-inventory.json').write_text(json.dumps({'baseCommit':BASE['baseCommit'],'files':actual},indent=2)+'\n');print(f'{len(changed)} changes, {len(added)} additions, {len(removed)} removals; sealed={sealed}, decisions resolved={resolved}')
if errors:print('\n'.join(errors));sys.exit(1)
print('PASS exact approved scope, inputs and history.')
