"""Build only in a disposable copy of the already-frozen v2 compatibility fixture."""
from pathlib import Path
import json,shutil
R=Path(__file__).parent;B=R.parent/'revision-v2-concrete-opening/compat-worktree';W=R/'compat-worktree'
shutil.copytree(B,W,dirs_exist_ok=True,ignore=shutil.ignore_patterns('.git','node_modules','dist'))
if not (W/'node_modules').exists():(W/'node_modules').symlink_to((B/'node_modules').resolve(),target_is_directory=True)
s=json.loads((R/'scenario.json').read_text());old=json.loads((R/'base-v2.json').read_text())
rel=Path('experiments/tangible-campaign/ui/scenarios.ts');text=(B/rel).read_text();marker='\n// Isolated research compatibility overlay; never published.\n'
assert marker in text;text=text.split(marker)[0]+marker+'scenarios.push('+json.dumps(s,ensure_ascii=False,indent=2)+');\n';(W/rel).write_text(text)
rel=Path('experiments/tangible-campaign/reviews/lifecycle/audit.json');audit=json.loads((B/rel).read_text());audit['recipes']=[x for x in audit['recipes'] if x['world']!=old['id']];audit['counts'].pop(old['id'],None)
for q in s['recipes']:
 life=q['lifecycle'];audit['recipes'].append({'world':s['id'],'recipe':q['id'],'inputs':q['a']+' + '+q['b'],'output':q['out'],'incorporated':', '.join(sorted(k for k,v in life.items() if v['role']!='retain')) or '—','retained':', '.join(sorted(k for k,v in life.items() if v['role']=='retain')) or '—','lifecycles':life})
audit['counts'][s['id']]={'recipes':len(s['recipes']),'changed':sum(any(v['role']!='retain' for v in q['lifecycle'].values()) for q in s['recipes'])};(W/rel).write_text(json.dumps(audit,ensure_ascii=False,indent=2))
rel=Path('experiments/tangible-campaign/reviews/lifecycle/lifecycle.test.ts');(W/rel).write_text((B/rel).read_text().replace('expected.length,993',f'expected.length,{len(audit["recipes"])}'))
actions=json.loads((R/'author-route.json').read_text());(W/f'experiments/tangible-campaign/evidence/{s["id"]}-route-evidence.json').write_text(json.dumps({'combinations':sum(a['type']=='combine' for a in actions),'actionsLog':actions}))
for p in (R/'frozen-runtime').rglob('*'):
 if p.is_file():shutil.copy2(p,W/'experiments/tangible-campaign'/p.relative_to(R/'frozen-runtime'))
print(json.dumps({'fixture':'frozen v2 pre-event-local baseline, candidate replaced locally','activeWorlds':10,'activeRecipes':len(audit['recipes'])}))
