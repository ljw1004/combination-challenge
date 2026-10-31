"""Identity/checkpoint-only successor; preserve the already reviewed research candidate."""
from pathlib import Path
import json,hashlib,copy,shutil
P=Path(__file__).resolve().parent
B=P.parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
base=B/'doctrine-optional-continuation-v1-candidate.json'
assert sha(base)=='a53a4284db53573ea6d272b0d6524d83d1dd25c52e638185afb40459d04cc5de'
assert json.loads((B/'final-copy-integrity.json').read_text())['finalSha256']==sha(base)
original={str(f.relative_to(B)):sha(f) for f in B.rglob('*') if f.is_file() and P not in f.parents}
s=json.loads(base.read_text());old=copy.deepcopy(s)
assert len(s['checkpoints'])==12
assert s['checkpoints'][8]['id']=='complete'
assert s['checkpoints'][8]['actions']==s['checkpoints'][9]['actions']
s['id']='doctrine-optional-continuation-marburg-trent-research-v2-checkpoint-clarity'
s['checkpoints'][8]['id']='chapter-9'
s['checkpoints'][8]['label']='9. What can both sides sign?'
del s['checkpoints'][9]
s['checkpoints'][9]['id']='chapter-10'
s['checkpoints'][9]['label']='10. What does a gift make possible?'
s['checkpoints'][10]['id']='complete'
s['checkpoints'][10]['label']='Complete extended journey'
assert len({x['id'] for x in s['checkpoints']})==11
for k in old:
 if k not in ['id','checkpoints']:assert s[k]==old[k],k
assert s['checkpoints'][:8]==old['checkpoints'][:8]
for new_i,old_i in [(8,8),(9,10),(10,11)]:assert s['checkpoints'][new_i]['actions']==old['checkpoints'][old_i]['actions']
ops=[dict(op='replace',path='/id',before=old['id'],value=s['id']),dict(op='replace',path='/checkpoints/8/id',before='complete',value='chapter-9'),dict(op='replace',path='/checkpoints/8/label',before='Complete journey',value=s['checkpoints'][8]['label']),dict(op='remove',path='/checkpoints/9',before=old['checkpoints'][9]),dict(op='replace',path='/checkpoints/9/id',before='later-trent-entry',value='chapter-10'),dict(op='replace',path='/checkpoints/9/label',before='Optional Trent entry',value=s['checkpoints'][9]['label']),dict(op='replace',path='/checkpoints/10/id',before='later-complete',value='complete'),dict(op='replace',path='/checkpoints/10/label',before='Optional continuation complete',value=s['checkpoints'][10]['label'])]
# Apply the written operation ledger to verify that it describes the complete exact diff.
t=copy.deepcopy(old)
for op in ops:
 parts=op['path'].strip('/').split('/');owner=t
 for key in parts[:-1]:owner=owner[int(key)] if isinstance(owner,list) else owner[key]
 key=int(parts[-1]) if isinstance(owner,list) else parts[-1]
 assert owner[key]==op['before']
 if op['op']=='remove':del owner[key]
 else:owner[key]=op['value']
assert t==s
m=json.loads((B/'authoring-manifest.json').read_text());m.update(candidateId=s['id'],previousCandidateSha256=sha(base),sourceRevision='v2 identity/checkpoint-only clarification; no story, graph, source, reading, route, or runtime change',checkpointSemantics='chapter-9 is the earned Marburg entry; chapter-10 is the earned Trent entry; complete denotes the finished extended journey. Duplicate Marburg alias removed; every retained checkpoint action array is unchanged.')
for name,obj in [('doctrine-optional-continuation-v2-candidate.json',s),('authoring-manifest.json',m),('exact-diff.json',ops),('original-preservation.json',dict(files=original))]: (P/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
shutil.copytree(B/'runtime',P/'runtime',dirs_exist_ok=True)
for rel,digest in original.items():assert sha(B/rel)==digest,rel
print(json.dumps(dict(candidate=s['id'],sha256=sha(P/'doctrine-optional-continuation-v2-candidate.json'),checkpoints=[dict(id=x['id'],label=x['label'],actions=len(x['actions'])) for x in s['checkpoints']]),ensure_ascii=False))
