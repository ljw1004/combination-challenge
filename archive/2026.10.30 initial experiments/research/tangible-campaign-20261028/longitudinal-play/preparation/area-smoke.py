from pathlib import Path
import json,subprocess
r=Path(__file__).resolve().parent.parent
p=next(x for x in json.loads((r/'packet-index.json').read_text())['packets'] if x['packet']=='mars-v4-copyfix-packet-v1')
sid='smoke-preparation-area-01';calls=[]
def call(op,*args):
 expected=[] if op in ['start','view','stop'] else ['--expect','Source-aware adapter smoke, not trial evidence: verify current-area movement and carrying.']
 cp=subprocess.run(['node',p['path']+'/play.mjs',p['manifestSha256'],sid,op,*args,*expected],capture_output=True,text=True)
 assert cp.returncode==0,cp.stdout
 out=json.loads(cp.stdout);calls.append(out);return out
v=call('start');oldarea=v['view']['area']['id']
s=json.loads((Path(p['path'])/'scenario.json').read_text())
for a in s['checkpoints'][1]['actions']:
 if a['type']=='advance':break
 if a['type']=='combine':v=call('drop',a['a'],a['b'])
 elif a['type']=='place':v=call('place',a['item'],'@'+a['location'])
 assert v['accepted']
area=v['view']['area']['id'];assert area!=oldarea
item=v['view']['things'][0]['id'];v=call('move',item,'100','100');assert v['accepted'];assert next(t for t in v['view']['things'] if t['id']==item)['location'] is None
v=call('visit',oldarea,item);assert v['accepted'];assert v['view']['area']['id']==oldarea;assert item in [t['id'] for t in v['view']['things']]
v=call('visit',area,item);assert v['accepted'];assert v['view']['area']['id']==area;assert item in [t['id'] for t in v['view']['things']]
v=call('visit','not-a-reached-area');assert not v['accepted'];assert v['view']['area']['id']==area
call('stop','Source-aware movement/carry smoke complete; not a player stopping decision.')
(r/'evidence'/'area-smoke.json').write_text(json.dumps({'passed':True,'packet':p['packet'],'verified':['ordinary move clears placement','visit earlier reached area with single current item','return with same physical item','unreached-area rejection preserved'],'scope':'source-aware logical smoke only; not browser or player evidence','calls':calls},indent=2)+'\n')
print('Move, bidirectional area visit/carry, and unreached-area rejection passed.')
