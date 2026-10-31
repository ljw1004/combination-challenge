import json,hashlib
from pathlib import Path
p=Path(__file__).parent
s=json.loads((p/'scenario.json').read_text())
r=json.loads((p/'results/goal-route.json').read_text())
s['id']='mars-weather-relay-rescue-v2';s['title']='Mars: The Voice Beyond the Ridge'
s['stages']=s['stages'][:7]
ids={st['id'] for st in s['stages']}
s['recipes']=[x for x in s['recipes'] if any(x['id'].startswith(i+'-') for i in ids)]
s['locations']=[loc for loc in s['locations'] if any(loc['id'] in st['locations'] for st in s['stages'])]
a=[];advances=0
for action in r['actions']:
 a.append(action)
 if action['type']=='advance':advances+=1
 if advances==4:break
s['checkpoints']=[dict(id='weather-start',label='The outcrop observations are complete; the weather is changing',actions=a)]
s['notes']=['Frozen fresh-play slice. Earlier chapters are included only to establish a legal checkpoint through ordinary actions. No later story is included.','Three new chapters: weather observation, relay contact, rescue. This is not a full-length game or proof of fun.']
(p/'slice-v2.json').write_text(json.dumps(s,indent=2)+'\n')
files=[p/'slice-v2.json',p.parent/'engine/model.ts',p.parent/'engine/cli.ts',p.parent/'schema/scenario.ts']
(p/'results/slice-v2-manifest.json').write_text(json.dumps({str(f):hashlib.sha256(f.read_bytes()).hexdigest() for f in files},indent=2)+'\n')
