"""Additive copy/reading successor of the checkpoint-corrected research candidate."""
from pathlib import Path
import json,hashlib,copy,shutil
P=Path(__file__).resolve().parent
B=P.parent/'revision-2-checkpoint-clarity'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
base=B/'doctrine-optional-continuation-v2-candidate.json'
assert sha(base)=='88486ae97659ed04adb4ef599ba6ce16ff23b4e340942f10f8c78563c2969f73'
original={str(f.relative_to(B)):sha(f) for f in B.rglob('*') if f.is_file()}
s=json.loads(base.read_text());old=copy.deepcopy(s)
s['id']='doctrine-ten-desks-v3-content-clarity'
s['premise']='Across ten manuscript desks, build and question arguments about evil, freedom, bodies and grace. Carry earlier arguments into new disputes, and discover what shared words and premises leave unresolved. A completed argument reconstructs a historical position; it does not prove a belief.'
next(i for i in s['items'] if i['id']=='later-presence-boundary')['label']='Luther and Zwingli retain bread; bodily presence divides them'
it=next(i for i in s['items'] if i['id']=='later-validity')
it['reading']=dict(text=it['description'],attribution='Attributed paraphrase — Luther, Large Catechism, Part V, §§16–18 and 33–37 (1529), Bente/Dau 1921 translation. Sacramental identity and benefit received through faith are distinguished.')
s['stages'][-1]['completionText']='The comparison is built, not the dispute settled: Luther and the council both reject purchasing the initial gift, while assigning later works different roles.'
def diff(a,b,path=''):
 if a==b:return []
 if isinstance(a,dict) and isinstance(b,dict):return sum((diff(a.get(k),b.get(k),path+'/'+k) for k in sorted(set(a)|set(b))),[])
 if isinstance(a,list) and isinstance(b,list) and len(a)==len(b):return sum((diff(x,y,path+'/'+str(i)) for i,(x,y) in enumerate(zip(a,b))),[])
 return [dict(path=path,before=a,after=b)]
d=diff(old,s)
i1=next(i for i,x in enumerate(s['items']) if x['id']=='later-presence-boundary');i2=next(i for i,x in enumerate(s['items']) if x['id']=='later-validity')
assert {x['path'] for x in d}=={'/id','/premise',f'/items/{i1}/label',f'/items/{i2}/reading','/stages/9/completionText'}
assert s['recipes']==old['recipes'];assert s['checkpoints']==old['checkpoints'];assert s['stages'][:9]==old['stages'][:9]
m=json.loads((B/'authoring-manifest.json').read_text());m.update(candidateId=s['id'],previousCandidateSha256=sha(base),sourceRevision='v3 content clarity only: explicit disputants, existing description exposed as an attributed optional reading, ten-desk premise, non-verdict ending; all routes/checkpoints/choices unchanged')
for name,obj in [('doctrine-ten-desks-v3-candidate.json',s),('authoring-manifest.json',m),('exact-diff.json',d),('v2-preservation.json',dict(files=original))]: (P/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
shutil.copytree(B/'runtime',P/'runtime',dirs_exist_ok=True)
for rel,digest in original.items():assert sha(B/rel)==digest,rel
print(json.dumps(dict(candidate=s['id'],sha256=sha(P/'doctrine-ten-desks-v3-candidate.json'),diffPaths=[x['path'] for x in d]),ensure_ascii=False))
