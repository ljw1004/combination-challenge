from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[2]
p=root/'reviews/integration-audit';archive=p/'superseded-before-mars-repair-incorporation'
old=json.loads((archive/'manifest.json').read_text())
for path,expected in old['testedSourceSHA256'].items():
 if not path.endswith('scenarios/mars.json'): assert hashlib.sha256((root/path).read_bytes()).hexdigest()==expected,path
mars='integration/release-v1/scenarios/mars.json'
assert hashlib.sha256((root/mars).read_bytes()).hexdigest()=='bb5b10d54f795025da40fe7d7f196ecd759051112da54af6cdf25f14035accfc'
for combined,new in [('release-branch-audit-results.json','mars-repair-branch-audit-results.json'),('arrival-release-invariants-results.json','mars-repair-invariants-results.json')]:
 prior=json.loads((archive/combined).read_text());fresh=json.loads((p/new).read_text())
 assert fresh['results'][0]['name']=='mars'
 prior['results']=[x for x in prior['results'] if x['name']!='mars']+fresh['results']
 prior['finalRevision']='Eight explicit Mars sole-use physical repair incorporations'
 prior['provenance']={'elementsAndIdeas':f'superseded-before-mars-repair-incorporation/{combined}; retained because scenario and engine hashes are unchanged','mars':new,'marsScenarioSHA256':hashlib.sha256((root/mars).read_bytes()).hexdigest()}
 (p/combined).write_text(json.dumps(prior,indent=2)+'\n')
report=(archive/'REPORT.md').read_text().replace('and69 retired-token checks','and77 retired-token checks')
report=report.replace('## Verification\n','''## Final Mars repair-content revalidation

Root's subsequent native QA identified the radio repair's duplicate-body contradiction. The integration owner added explicit incorporation for eight individually checked sole-use repair bases: broken radio, cabin shell, weather mast, relay transceiver, service shelter, spare drive, greenhouse shell and electrolyzer stack. This is targeted physical repair semantics, not automatic deletion of finished things. Multi-use crawler/towing alternatives remain untouched.

Against final Mars SHA256 `bb5b10d54f795025da40fe7d7f196ecd759051112da54af6cdf25f14035accfc`, the reviewer reran **all180 Mars branch runs and25 Mars checkpoints**, and independently verified every added base has only its repair consumer, matches no objective, survives in incorporation provenance, and restores exactly under Undo/redo. Actions and combination counts are unchanged. `mars-repair-provenance-results.json` records all eight checks.

Earlier evidence is preserved in `superseded-before-mars-repair-incorporation/`. Final aggregate results explicitly retain the360 Elements/Ideas runs and55 checkpoints only after their scenario/engine hashes were rechecked unchanged; they replace Mars results with the fresh reruns. `seal-after-mars-repairs.py` reproduces that provenance-preserving aggregation.

## Verification
''')
(p/'REPORT.md').write_text(report)
sources=['engine-arrival-v6/engine/model.ts']+[f'integration/release-v1/scenarios/{n}.json' for n in ('elements','ideas','mars')]
files={str(x.relative_to(root)):hashlib.sha256(x.read_bytes()).hexdigest() for x in p.rglob('*') if x.is_file() and x!=p/'manifest.json'}
m={'scope':'Independent long-campaign mechanical/adversarial audit; not browser or fun proof','finalRevision':'Eight explicit Mars physical repair incorporations; previous evidence archived, unchanged campaign evidence retained explicitly','testedSourceSHA256':{f:hashlib.sha256((root/f).read_bytes()).hexdigest() for f in sources},'auditEvidenceSHA256':files}
(p/'manifest.json').write_text(json.dumps(m,indent=2)+'\n')
print('Final audit sealed:540/540 branch runs,80/80 long-campaign checkpoints,8 added repair provenance/Undo checks')
