from pathlib import Path
import subprocess,shutil,json
P=Path(__file__).resolve().parent;live=Path('/workspace/shared/combination-fork-recovery-20261028');dst=P/'compat-worktree'
assert not dst.exists(),'Refuse to merge into an existing fixture'
dst.mkdir()
for name in subprocess.check_output(['git','-C',str(live),'ls-files'],text=True).splitlines():
 src=live/name
 if not src.is_file():continue
 to=dst/name;to.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,to)
(dst/'node_modules').symlink_to(live/'node_modules',target_is_directory=True)
module=(P/'atlas-evidence-repair.ts').read_text().replace("'./frozen-runtime/schema/scenario.ts'","'../../schema/scenario.ts'")
(dst/'experiments/tangible-campaign/ui/campaigns/atlas-evidence-repair.ts').write_text(module)
p=dst/'experiments/tangible-campaign/ui/scenarios.ts';t=p.read_text();t="import {scenario as evidenceRepairCandidate} from './campaigns/atlas-evidence-repair.ts';\n"+t;t=t.replace('...integratedScenarios];','...integratedScenarios, evidenceRepairCandidate];');p.write_text(t)
s=json.loads((P/'scenario.json').read_text());actions=json.loads((P/'author-route.json').read_text());evidence={'scenario':s['id'],'actionsLog':actions,'combinations':sum(x['type']=='combine' for x in actions)}
(dst/f"experiments/tangible-campaign/evidence/{s['id']}-route-evidence.json").write_text(json.dumps(evidence,indent=2)+'\n')
print('Prepared isolated compile/regression fixture; original module and featured list retained.')

subprocess.run(['python',str(P/'append_fixture_audit.py')],check=True)
subprocess.run(['python',str(P/'extend_fixture_registry_expectations.py')],check=True)
