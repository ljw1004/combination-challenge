"""Small associative grace experiment. Frozen v3 and its trials are read-only inputs."""
from pathlib import Path
import json,copy,hashlib
r=Path(__file__).resolve().parent;old=r.parent/'revision-3-local-inference'
base=old/'doctrine-argument-desks-v3-candidate.json';s=json.loads(base.read_text());m=json.loads((old/'authoring-manifest.json').read_text())
s['id']='doctrine-argument-desks-v4-grace-experiment';ch=m['chapters'][1];oldrs=set(ch['recipes']);s['recipes']=[x for x in s['recipes'] if x['id'] not in oldrs]
remove={'commands','pelagius-quotation','baptism-leaf','divided-will','need-of-grace'}
s['items']=[x for x in s['items'] if x['id'] not in remove];items={x['id']:x for x in s['items']}
def update(id,label,text,src,attr):
 x=items.get(id)
 if x is None:x={'id':id};s['items'].append(x);items[id]=x
 x.update(label=label,description=text,sources=src,reading={'text':text,'attribution':attr})
update('instruction-account','God gives capacity; law and example guide our choices','Pelagius, as quoted by Augustine, credits God with our capacity for good. Teaching and Christ’s example assist choice; Augustine disputes whether this sufficiently explains willing and doing.',['aug-grace'],'Attributed paraphrase — Pelagius as quoted by Augustine, On the Grace of Christ I.2–5. This is a disputed account, mediated by its critic.')
update('inward-grace','God kindles love within the human will','Augustine describes divine assistance as the inspiration of love, not merely the disclosure of a duty.',['aug-grace'],'Attributed paraphrase — Augustine, On the Grace of Christ I.3, 7.')
update('infant-baptism','Infants too are baptized for the remission of sins','Augustine reports baptism for infants as well as adults, and treats its language of remission seriously.',['aug-evil'],'Attributed paraphrase — Augustine, Enchiridion §§43–44; a reported Christian practice and its meaning in this text.')
update('adams-fall','Adam’s first sin passes to the human family','Augustine takes Adam’s first transgression to affect descendants, not only its original agent.',['aug-evil'],'Attributed paraphrase — Augustine, Enchiridion §§26–27, 45; a theological premise, not a biological finding.')
update('command-not-cure','Against instruction alone: knowing is not yet doing','The proposal values capacity and instruction. Paul’s frustrated willing exposes what that account has not yet explained: how help reaches action.',['aug-grace','romans'],'Editorial reconstruction of Augustine’s objection — On the Grace of Christ I.3–7, 43; Romans 7:19.')
update('grace-heals-will','Augustine’s reply: love moves the will beyond instruction','Love supplies the inward assistance missing from instruction alone. Augustine still assigns willing and acting to the person; aid is not a substitute actor.',['aug-grace'],'Attributed synthesis — Augustine, On the Grace of Christ I.3, 6–7. The manuscript reconstructs his answer.')
update('infant-question','What can baptism forgive before a child can choose?','Our earlier account located personal wrongdoing in choice. Infant remission therefore raises a different question, not an accusation that the infant chose wrongly.',['aug-evil'],'Editorial comparison — Augustine, Enchiridion §§23–27, 43–44. The question distinguishes personal acts from a claimed inherited condition.')
update('inherited-condition','Augustine: infants share Adam’s sin, not his personal act','Given the Adam premise, Augustine interprets infant remission as addressing inherited sin. The rite alone does not establish that premise.',['aug-evil'],'Attributed inference — Augustine, Enchiridion §§43–45; this is Augustine’s reading of the practice.')
update('wounded-will','Inherited damage is not an evil human substance','The inherited-condition claim must fit Augustine’s earlier account of evil: human nature remains good as a nature, though he considers it damaged.',['aug-evil'],'Editorial comparison of attributed claims — Augustine, Enchiridion §§11–14, 26–27, 43–45.')
update('augustine-grace-answer','Augustine’s grace argument: aid without an evil human nature','The two arguments concern different problems: inward help for action, and an inherited condition distinguished from personal wrongdoing. Augustine holds both without making human nature an evil substance.',['aug-grace','aug-evil'],'Attributed synthesis — Augustine, On the Grace of Christ I.3–7; Enchiridion §§11–14, 26–27, 43–45. This is a reconstructed position, not a verdict on the dispute.')
reasons={'retain':'This earlier argument remains available for later comparison; using it does not erase it.','incorporate':'This source leaf is bound into the new manuscript and remains visible among its preserved references.','transform':'This working manuscript is revised into a more specific inference at the same desk position; its bound leaves remain visible.'}
def recipe(id,a,b,out,roles,preserve=()):
 x={'id':id,'a':a,'b':b,'out':out,'sources':items[out]['sources'],'lifecycle':{k:{'role':role,'reason':reasons[role]} for k,role in zip((a,b),roles)}}
 if preserve:x['preserve']=list(preserve)
 return x
rs=[
 recipe('command-not-cure','instruction-account','romans-leaf','command-not-cure',('incorporate','incorporate'),('instruction-account','romans-leaf')),
 recipe('grace-heals-will','command-not-cure','inward-grace','grace-heals-will',('transform','incorporate'),('command-not-cure','inward-grace')),
 recipe('infant-question','misdirected-will','infant-baptism','infant-question',('retain','incorporate'),('infant-baptism',)),
 recipe('inherited-condition','infant-question','adams-fall','inherited-condition',('transform','incorporate'),('infant-question','adams-fall')),
 recipe('wounded-will','inherited-condition','evil-as-loss','wounded-will',('transform','retain'),('inherited-condition',)),
 recipe('augustine-grace-answer','grace-heals-will','wounded-will','augustine-grace-answer',('incorporate','transform'),('grace-heals-will','wounded-will')),
]
# A created compound carried into subsequent desks must keep its leaves if it is later consumed.
s['recipes']=s['recipes'][:11]+rs+s['recipes'][11:]
rs.append(recipe('inherited-condition-direct','infant-baptism','adams-fall','inherited-condition',('incorporate','incorporate'),('infant-baptism','adams-fall')))
s['recipes'].append(rs[-1])
raw=['romans-leaf','instruction-account','inward-grace','infant-baptism','adams-fall']
route=[{'type':'combine','a':x['a'],'b':x['b']} for x in rs[:6]]
ch.update(new=raw,recipes=[x['id'] for x in rs],route=route,alternatives=[{'recipe':'inherited-condition-direct','replacesRecipes':['infant-question','inherited-condition']}],motivation='A person knows the good and still fails to do it. An infant is brought for remission before making a choice. Augustine must answer both, without turning the human creature into something evil.')
st=s['stages'][1];st['motivation']=ch['motivation'];st['caches'][0]['items']=raw
st['objectives']=[
 {'id':'grace-instruction-objection','kind':'create','item':'command-not-cure','text':'Test instruction alone','intermediate':True},
 {'id':'grace-infant-remission','kind':'create','item':'inherited-condition','text':'Explain an infant’s remission','intermediate':True},
 {'id':'grace-inward-help','kind':'create','item':'grace-heals-will','text':'Explain help through love','intermediate':True,'after':['grace-instruction-objection']},
 {'id':'grace-human-nature','kind':'create','item':'wounded-will','text':'Reconcile damage with good nature','intermediate':True,'after':['grace-infant-remission']},
 {'id':'grace-final-manuscript','kind':'create','item':'augustine-grace-answer','text':'State Augustine’s two-part answer','after':['grace-inward-help','grace-human-nature']},
]
# Preserve newly bound grace manuscript whenever later recipes transform/incorporate it.
for rec in s['recipes']:
 for k,life in rec['lifecycle'].items():
  if k=='grace-heals-will' and life['role']!='retain':rec['preserve']=list(dict.fromkeys(rec.get('preserve',[])+[k]))
actions=[];s['checkpoints']=[]
for n,stage in enumerate(s['stages']):
 s['checkpoints'].append({'id':f'chapter-{n+1}','label':f'{n+1}. {stage["title"]}','actions':copy.deepcopy(actions)})
 actions+=m['chapters'][n]['route']+[{'type':'advance'}]
s['checkpoints'].append({'id':'complete','label':'Complete journey','actions':actions})
s['notes']=[n.replace('doctrine-argument-desks-v3-candidate',s['id']) for n in s['notes']]+['Revision 4 is a small desk-2 experiment after stopped fresh_doctrine_c, not an eight-desk playability endorsement. Direct source premises replace wrappers; named arguments preserve bound leaves. No new slot or location mechanics.']
m['authoredActions']=actions;m['previousCandidateSha256']=hashlib.sha256(base.read_bytes()).hexdigest();m['sourceRevision']='v4 isolated associative grace experiment; v3 and all original sessions preserved'
(r/'doctrine-argument-desks-v4-candidate.json').write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n');(r/'authoring-manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
print({'recipes':len(s['recipes']),'items':len(s['items']),'core':sum(a['type']=='combine' for a in actions),'candidateSha256':hashlib.sha256((r/'doctrine-argument-desks-v4-candidate.json').read_bytes()).hexdigest()})
