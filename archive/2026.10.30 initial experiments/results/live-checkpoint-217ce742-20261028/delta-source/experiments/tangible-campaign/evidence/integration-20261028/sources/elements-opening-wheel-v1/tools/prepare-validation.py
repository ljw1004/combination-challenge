from pathlib import Path
import shutil,json
r=Path(__file__).resolve().parents[1]; live=Path('/workspace/shared/combination-fork-recovery-20261028'); w=r/'validation-copy'
shutil.copytree(live,w,ignore=lambda directory,names: set(names)&{'.git','dist','results','.openai'} if Path(directory)==live else set(),dirs_exist_ok=False,symlinks=True)
base=w/'experiments/tangible-campaign';shutil.copyfile(r/'elements-opening-candidate.ts',base/'ui/campaigns/elements-opening-candidate.ts')
p=base/'ui/scenarios.ts';s=p.read_text();s="import {scenario as elementsOpeningCandidate} from './campaigns/elements-opening-candidate.ts';\n"+s;s=s.replace('...integratedScenarios];','...integratedScenarios, elementsOpeningCandidate];');p.write_text(s)
s=json.loads((r/'scenario.json').read_text());e={'scope':'Local opening candidate author-aware route witness; not source-blind or human evidence.','scenario':s['id'],'actionsLog':s['checkpoints'][-1]['actions'],'combinations':sum(a['type']=='combine' for a in s['checkpoints'][-1]['actions'])};(base/'evidence'/f"{s['id']}-route-evidence.json").write_text(json.dumps(e,indent=2)+'\n')
print(w)
auditpath=base/'reviews/lifecycle/audit.json';audit=json.loads(auditpath.read_text());old=json.loads((r/'baseline.scenario.json').read_text())
rows=[json.loads(json.dumps(row)) for row in audit['recipes'] if row['world']==old['id']]
for row in rows:
 row['world']=s['id']
 recipe=next(recipe for recipe in s['recipes'] if recipe['id']==row['recipe'])
 row['inputs']=recipe['a']+' + '+recipe['b'];row['lifecycles']=recipe['lifecycle'];row['retained']=', '.join(sorted(k for k,v in recipe['lifecycle'].items() if v['role']=='retain')) or '—'
audit['recipes']+=rows;audit['counts'][s['id']]={'recipes':len(s['recipes'])};audit['activeScenarios']+=1;audit['activeRecipes']+=len(s['recipes']);auditpath.write_text(json.dumps(audit,indent=2)+'\n')
