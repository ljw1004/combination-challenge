"""Disposable current-policy fixture: append this isolated candidate; no live/shared source edits."""
from pathlib import Path
import json,shutil,hashlib,subprocess
R=Path(__file__).parent;B=Path('/workspace/shared/combination-fork-recovery-20261028');W=R/'compat-worktree'
rel=Path('experiments/tangible-campaign/ui/scenarios.ts');original=(B/rel).read_bytes();head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=B,text=True).strip()
shutil.copytree(B,W,dirs_exist_ok=True,ignore=shutil.ignore_patterns('.git','node_modules','dist'))
if not (W/'node_modules').exists():(W/'node_modules').symlink_to((B/'node_modules').resolve(),target_is_directory=True)
s=json.loads((R/'scenario.json').read_text());(W/rel).write_text(original.decode()+'\n// Isolated research verification only; not published.\nscenarios.push('+json.dumps(s,ensure_ascii=False,indent=2)+');\n')
auditpath=Path('experiments/tangible-campaign/reviews/lifecycle/audit.json');audit=json.loads((B/auditpath).read_text());oldn=len(audit['recipes'])
for q in s['recipes']:
 life=q['lifecycle'];audit['recipes'].append({'world':s['id'],'recipe':q['id'],'inputs':q['a']+' + '+q['b'],'output':q['out'],'incorporated':', '.join(sorted(k for k,v in life.items() if v['role']!='retain')) or '—','retained':', '.join(sorted(k for k,v in life.items() if v['role']=='retain')) or '—','lifecycles':life})
audit['counts'][s['id']]={'recipes':len(s['recipes']),'changed':sum(any(v['role']!='retain' for v in q['lifecycle'].values())for q in s['recipes'])};(W/auditpath).write_text(json.dumps(audit,ensure_ascii=False,indent=2))
rel=Path('experiments/tangible-campaign/reviews/lifecycle/lifecycle.test.ts');text=(B/rel).read_text();assert f'expected.length,{oldn}' in text;(W/rel).write_text(text.replace(f'expected.length,{oldn}',f'expected.length,{len(audit["recipes"])}').replace('active.length,9',f'active.length,{len(audit["counts"])}'))
actions=json.loads((R/'author-route.json').read_text());(W/f'experiments/tangible-campaign/evidence/{s["id"]}-route-evidence.json').write_text(json.dumps({'combinations':sum(a['type']=='combine'for a in actions),'actionsLog':actions}))
# No edits: freeze the exact reviewed event-local bytes used in the strict stopped trial.
for p in (R/'frozen-runtime').rglob('*'):
 if p.is_file():
  target=W/'experiments/tangible-campaign'/p.relative_to(R/'frozen-runtime');assert p.read_bytes()==target.read_bytes(),str(target)
assert original==(B/'experiments/tangible-campaign/ui/scenarios.ts').read_bytes();assert head==subprocess.check_output(['git','rev-parse','HEAD'],cwd=B,text=True).strip()
print(json.dumps({'fixture':'current-policy source copy plus isolated v5 candidate','sourceCommit':head,'sourceRegistrySha256':hashlib.sha256(original).hexdigest(),'activeWorlds':len(audit['counts']),'activeRecipes':len(audit['recipes']),'trialRuntime':'exact strict longitudinal v4 event-local runtime; no engine/UI edits'}))
