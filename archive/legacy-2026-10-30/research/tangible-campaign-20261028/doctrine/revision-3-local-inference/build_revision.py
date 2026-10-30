"""A separate revision; never changes frozen v2 bytes or its stopped session."""
from pathlib import Path
import json,copy,hashlib
r=Path(__file__).resolve().parent;old=r.parent
base=old/'doctrine-argument-desks-v2-candidate.json';s=json.loads(base.read_text());manifest=json.loads((old/'authoring-manifest.json').read_text())
s['id']='doctrine-argument-desks-v3-candidate'
first=manifest['chapters'][0]
old_recipe_ids=set(first['recipes'])
s['recipes']=[x for x in s['recipes'] if x['id'] not in old_recipe_ids]
s['items']=[x for x in s['items'] if x['id']!='genesis-leaf']
items={x['id']:x for x in s['items']}
def update(id,label,text,src,attribution=None):
 x=items[id];x.update(label=label,description=text,sources=src)
 if attribution:x['reading']={'text':text,'attribution':attribution}
 else:x.pop('reading',None)
update('created-goodness','“Behold, it was very good.”','Genesis 1:31 calls the creation good. This is the theological premise on the desk, not a conclusion proved by watching one wound heal.',['genesis'],'Short quotation — Genesis 1:31, King James Version (public domain); the distinction between premise and illustration is editorial.')
update('enchiridion-leaf','A healed wound does not move into another body','Augustine compares bodily wounds and vices of the soul: curing a defect does not send an evil substance somewhere else.',['aug-evil'],'Attributed paraphrase — Augustine, Enchiridion §11; a textual analogy, not an empirical demonstration of all theology.')
update('wound-notes','The flesh remains; its healthy order is damaged','Observation: the wounded body remains a living body, but it is injured.',[])
update('cure-notes','The wound heals; nothing evil leaves the patient','Observation: healing restores bodily integrity without transferring a separate wound to someone else.',[])
update('broken-vessel','The clay remains; the jar no longer holds water','Illustrative comparison: a crack removes a capacity without adding another kind of clay.',[])
update('human-choice','I take a friend’s share for my own comfort','Hypothetical case: a person knowingly takes what another person is owed. This is not a reported historical event.',[])
update('lesser-good','Loving a lesser good against a better one','Augustine distinguishes the goodness of something desired from the wrong ordering of a person’s desire.',['aug-evil'],'Attributed paraphrase — Augustine, Enchiridion §§23–27; application to the hypothetical case is editorial.')
update('evil-substance-objection','Is this wound an extra evil substance?','A local objection about the injured body, not yet a claim about every evil.',[])
update('missing-health','This wound is a loss, not an extra substance','A local case: damaged flesh remains, and healing need not move an evil substance elsewhere. This does not alone establish a universal account of evil.',['aug-evil'],'Attributed paraphrase and application — Augustine, Enchiridion §11; the jar is an editorial comparison.')
update('no-evil-substance','This injury needs no separate evil substance','The healed-wound case answers the local objection: the loss depends on the injured body. A wider theory still needs a wider premise.',['aug-evil'],'Attributed paraphrase and application — Augustine, Enchiridion §§11–12; local inference, not a universal proof.')
update('chosen-attachment','My comfort preferred at another person’s expense','The hypothetical choice puts a limited good above another person’s claim. The act’s ordering, not the existence of comfort or flesh, is at issue.',['aug-evil'],'Editorial application of Augustine’s account of wrongly directed willing, Enchiridion §§23–27.')
update('misdirected-will','The fault lies in choosing, not wounded flesh','The analogy distinguishes losses: flesh can lack health; a deliberate choice can lack right order. An injury is not itself a guilty act.',['aug-evil'],'Attributed paraphrase and comparison — Augustine, Enchiridion §§11, 23–27. The bodily analogy illustrates moral disorder rather than proving a person’s guilt.')
update('evil-as-loss','Evil, for Augustine, is damage to created good','Given the creation-good premise, Augustine interprets evils as defects within good natures. The wound illustrates this wider claim; one cure does not prove it.',['aug-evil','genesis'],'Attributed interpretation — Augustine, Enchiridion §§11–14, read alongside Genesis 1:31; distinguish premise, illustration and conclusion.')
update('augustine-account','Good flesh can suffer; a good will can stray','Augustine connects the local injury case with moral disorder under the premise of good creation. These remain different kinds of loss, not a verdict that suffering is guilt.',['aug-evil','genesis'],'Attributed synthesis — Augustine, Enchiridion §§11–14, 23–27. Completion reconstructs his position.')
retain='This source or established case remains available; a new interpretation does not erase its evidence.'
transform='This working question is revised into a more precise argument at the same position.'
def recipe(id,a,b,out,roles=('retain','retain')):
 return {'id':id,'a':a,'b':b,'out':out,'sources':items[out]['sources'],'lifecycle':{a:{'role':roles[0],'reason':retain if roles[0]=='retain' else transform},b:{'role':roles[1],'reason':retain if roles[1]=='retain' else transform}}}
rs=[
 recipe('missing-health','wound-notes','cure-notes','missing-health',('transform','retain')),
 recipe('missing-health-from-text','enchiridion-leaf','wound-notes','missing-health',('retain','transform')),
 recipe('missing-health-from-jar','broken-vessel','enchiridion-leaf','missing-health',('transform','retain')),
 recipe('no-evil-substance','missing-health','evil-substance-objection','no-evil-substance',('retain','transform')),
 recipe('chosen-attachment','human-choice','lesser-good','chosen-attachment',('transform','retain')),
 recipe('misdirected-will','chosen-attachment','missing-health','misdirected-will'),
 recipe('misdirected-will-from-text','chosen-attachment','enchiridion-leaf','misdirected-will'),
 recipe('misdirected-will-from-general-account','chosen-attachment','evil-as-loss','misdirected-will'),
 recipe('evil-as-loss','no-evil-substance','created-goodness','evil-as-loss'),
 recipe('evil-as-loss-from-local-case','missing-health','created-goodness','evil-as-loss'),
 recipe('augustine-account','evil-as-loss','misdirected-will','augustine-account'),
]
s['recipes']=rs+s['recipes']
# This earlier-created privation claim, not a raw Scripture card, now grounds the damaged-will inference.
rec=next(x for x in s['recipes'] if x['id']=='wounded-will');rec['a']='evil-as-loss';rec['lifecycle']['evil-as-loss']=rec['lifecycle'].pop('created-goodness')
for a in manifest['chapters'][1]['route']:
 if a.get('a')=='created-goodness' and a.get('b')=='adams-fall':a['a']='evil-as-loss'
newraw=['created-goodness','enchiridion-leaf','wound-notes','cure-notes','broken-vessel','human-choice','lesser-good','evil-substance-objection']
core=['missing-health','no-evil-substance','chosen-attachment','misdirected-will','evil-as-loss','augustine-account']
route=[{'type':'combine','a':next(x for x in rs if x['id']==id)['a'],'b':next(x for x in rs if x['id']==id)['b']} for id in core]
first.update(title='What does this wound tell us?',motivation='A wound heals. A friend is wronged. Neither case should disappear into a slogan. Begin with what each case shows; then ask how Augustine connects them to the claim that creation is good.',new=newraw,recipes=[x['id'] for x in rs],route=route,alternatives=[{'recipe':x['id'],'replacesOutput':x['out']} for x in rs if x['id'] not in core])
st=s['stages'][0];st.update(title=first['title'],motivation=first['motivation']);st['area'].update(label=first['title'],travelText=first['title']);st['caches'][0]['items']=newraw
st['objectives']=[
 {'id':'wound-local-goal','item':'no-evil-substance','text':'Answer the wound objection','kind':'create','intermediate':True},
 {'id':'choice-local-goal','item':'misdirected-will','text':'Explain the deliberate wrong','kind':'create','intermediate':True},
 {'id':'privation-wide-goal','item':'evil-as-loss','text':'Connect the case to creation','kind':'create','intermediate':True,'after':['wound-local-goal']},
 {'id':'augustine-synthesis-goal','item':'augustine-account','text':'State Augustine’s larger account','kind':'create','after':['privation-wide-goal','choice-local-goal']},
]
s['notes']=[n.replace('doctrine-argument-desks-v2-candidate','doctrine-argument-desks-v3-candidate') for n in s['notes']]
s['notes'] += ['Revision 3 responds to the preserved stopped simulated session fresh_doctrine_a. The Genesis statement is now a raw theological premise; later continuity audits must not count it as an earlier creation.','The local wound counterexample, analogy to moral disorder, and wider creation-based interpretation are distinct products. Source application and empirical observation are alternative ways to establish the local case; no exact-source-recitation sequence is required.']
actions=[];s['checkpoints']=[]
for n,st in enumerate(s['stages']):
 s['checkpoints'].append({'id':f'chapter-{n+1}','label':f'{n+1}. {st["title"]}','actions':copy.deepcopy(actions)})
 actions+=manifest['chapters'][n]['route']+[{'type':'advance'}]
s['checkpoints'].append({'id':'complete','label':'Complete journey','actions':actions})
manifest['authoredActions']=actions;manifest['previousCandidateSha256']=hashlib.sha256(base.read_bytes()).hexdigest();manifest['sourceRevision']='v3 separate opening-desk redesign; downstream key IDs preserved, chapter 2 one operand updated'
(r/'doctrine-argument-desks-v3-candidate.json').write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n')
(r/'authoring-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(len(s['recipes']),len(s['items']),len([a for a in actions if a['type']=='combine']))
