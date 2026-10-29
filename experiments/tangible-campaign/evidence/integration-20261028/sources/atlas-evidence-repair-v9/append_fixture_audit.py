from pathlib import Path
import json
P=Path(__file__).resolve().parent
s=json.loads((P/'scenario.json').read_text());p=P/'compat-worktree/experiments/tangible-campaign/reviews/lifecycle/audit.json';x=json.loads(p.read_text())
assert s['id'] not in x['counts'],'Refuse duplicate candidate audit rows'
x['activeScenarios']+=1;x['activeRecipes']+=len(s['recipes']);x['counts'][s['id']]={'recipes':len(s['recipes'])}
for r in s['recipes']:
 incorporated=sorted(k for k,v in r['lifecycle'].items() if v['role'] in ['transform','incorporate'])
 retained=sorted(k for k,v in r['lifecycle'].items() if v['role']=='retain')
 x['recipes'].append({'world':s['id'],'recipe':r['id'],'inputs':r['a']+' + '+r['b'],'output':r['out'],'incorporated':', '.join(incorporated) or '—','retained':', '.join(retained) or '—','lifecycles':r['lifecycle']})
p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
print('Appended candidate lifecycle audit rows in isolated fixture; original audit unchanged.')
