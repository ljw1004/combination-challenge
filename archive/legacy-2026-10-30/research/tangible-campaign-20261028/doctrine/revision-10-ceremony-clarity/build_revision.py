"""Copy-only clarity correction: two exact strings, new identity and revision note."""
from pathlib import Path
import json,hashlib
p=Path(__file__).resolve().parent;baseline=p/'baseline-v9-candidate.json';s=json.loads(baseline.read_text());m=json.loads((p/'baseline-v9-manifest.json').read_text());s['id']='doctrine-argument-desks-v10-ceremony-clarity'
next(o for o in s['stages'][4]['objectives'] if o['id']=='lyon-authority')['text']='Compare Lyon’s own ceremony with the apostolic account'
next(i for i in s['items'] if i['id']=='gospel-and-hands')['label']='In Lyon’s rite, book and hands touch the candidate'
s['notes'].append('Revision 10 changes only the Lyon comparison objective and the bodily-rubric label to distinguish the actual ceremony from the cited apostolic account. No recipe, inference, source, reading or required route changed; no new fresh trial or UI test is claimed.')
m.update(previousCandidateSha256=hashlib.sha256(baseline.read_bytes()).hexdigest(),sourceRevision='v10 copy-only: Lyon comparison objective and bodily-rubric label; all graph and action data unchanged')
for name,obj in [('doctrine-argument-desks-v10-candidate.json',s),('authoring-manifest.json',m)]: (p/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
