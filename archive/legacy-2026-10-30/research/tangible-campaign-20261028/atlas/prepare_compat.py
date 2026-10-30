"""Disposable local overlay; never mutates recovered checkout or publishes."""
import json,shutil,os
from pathlib import Path
root=Path(__file__).parent;base=Path(os.environ.get('ATLAS_BASE_REPO','/workspace/shared/combination-fork-recovery-20261028'));work=root/'compat-worktree'
shutil.copytree(base,work,dirs_exist_ok=True,ignore=shutil.ignore_patterns('.git','node_modules','dist','qa-doctrine.ts','qa-doctrine.json','qa-doctrine.html'))
# Untracked parent Doctrine preview is outside this candidate and currently fails its own JSON cast.
for rel in ['qa-doctrine.html','experiments/tangible-campaign/ui/qa-doctrine.ts','experiments/tangible-campaign/ui/qa-doctrine.json']:
 if (work/rel).exists():(work/rel).unlink()
if not (work/'node_modules').exists():(work/'node_modules').symlink_to(base/'node_modules',target_is_directory=True)
s=json.load(open(root/'scenario.json'))
p=work/'experiments/tangible-campaign/ui/scenarios.ts';p.write_text(p.read_text()+'\n// Isolated research compatibility overlay; never published.\nscenarios.push('+json.dumps(s,ensure_ascii=False,indent=2)+');\n')
p=work/'experiments/tangible-campaign/reviews/lifecycle/audit.json';audit=json.load(open(p));old_count=len(audit['recipes'])
for rec in s['recipes']:
 life=rec['lifecycle'];audit['recipes'].append({'world':s['id'],'recipe':rec['id'],'inputs':rec['a']+' + '+rec['b'],'output':rec['out'],'incorporated':', '.join(sorted(k for k,v in life.items() if v['role']!='retain')) or '—','retained':', '.join(sorted(k for k,v in life.items() if v['role']=='retain')) or '—','lifecycles':life})
audit['counts'][s['id']]={'recipes':len(s['recipes']),'changed':sum(any(v['role']!='retain' for v in q['lifecycle'].values()) for q in s['recipes'])};p.write_text(json.dumps(audit,ensure_ascii=False,indent=2))
p=work/'experiments/tangible-campaign/reviews/lifecycle/lifecycle.test.ts';t=p.read_text().replace('active.length,9','active.length,10').replace('expected.length,735',f'expected.length,{old_count+len(s["recipes"])}');p.write_text(t)
e={'combinations':len(s['recipes']),'actionsLog':json.load(open(root/'author-route.json'))};(work/('experiments/tangible-campaign/evidence/'+s['id']+'-route-evidence.json')).write_text(json.dumps(e))
print('Isolated catalogue fixture:',10,old_count+len(s['recipes']))
