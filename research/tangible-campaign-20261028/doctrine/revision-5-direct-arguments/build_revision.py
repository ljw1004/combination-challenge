"""Desks 3 and 7 only. Frozen v4 and its closed trials are immutable inputs."""
from pathlib import Path
import json,copy,hashlib
r=Path(__file__).resolve().parent;old=r.parent/'revision-4-grace-inference';base=r/'baseline-v4-candidate.json';s=json.loads(base.read_text());m=json.loads((r/'baseline-v4-manifest.json').read_text());s['id']='doctrine-argument-desks-v5-direct-pilots'
removed_recipes={rid for n in (2,6) for rid in m['chapters'][n]['recipes']};s['recipes']=[x for x in s['recipes'] if x['id'] not in removed_recipes]
removed_items={'dualist-treatise','two-origins','cause-and-permission','augustine-reply','dualist-case','sales-promise','indulgence-critique','works-of-mercy','wittenberg-disputation'}
s['items']=[x for x in s['items'] if x['id'] not in removed_items];items={x['id']:x for x in s['items']}
def item(id,label,text,src,attribution):
 x=items.get(id)
 if x is None:x={'id':id};items[id]=x;s['items'].append(x)
 x.update(label=label,description=text,sources=src,reading={'text':text,'attribution':attribution})
P=['two-principles','two-principles-full'];A=['aug-evil'];T=['theses']
item('material-world','Bodies suffer injury, decay and death','These harms are the problem to explain, not themselves evidence of which kind of cause produced them.',P,'Observation and editorial framing of the question in Book of Two Principles I.1–2, 13.')
item('foreknowledge-question','The maker knew this creature would fail','The writer considers a creator who brings about the creature despite foreknowing its failure.',P,'Attributed paraphrase — Book of Two Principles I.8–10, 13; the premise belongs to the dispute.')
item('watcher-analogy','Watching a walker does not make the walker move','The treatise reports an opponent’s window-watcher analogy: knowing an action need not compel it. The author questions its application to a creator.',['two-principles-full'],'Attributed paraphrase — Book of Two Principles I.9–10; the watcher analogy is the reported opponent’s reply.')
item('evil-maker','This harmful creation needs an opposed maker, says the writer','Reading the tree image as a rule for origins, this writer attributes destructive creation to an opposed source. The observation alone does not establish that rule.',P+['matthew-tree'],'Attributed inference — Book of Two Principles I.1–2, 13; V.1–6. This radical-dualist account is not a universal Cathar creed.')
item('agency-and-origin','Blaming the choice leaves the maker’s responsibility open','An agent’s deliberate wrong does not by itself settle the responsibility of a maker who knowingly creates that agent.',P+A,'Editorial comparison — Book of Two Principles I.8–10 and Augustine, Enchiridion §§23–27. Distinct questions of responsibility remain.')
item('knowing-not-causing','The walker chooses; the watcher does not compel','The moral agent acts; the observer’s knowledge is not itself that agent’s choice. This reply does not yet describe a creator.',P+A,'Editorial application of the reported watcher reply — Book of Two Principles I.9; Augustine, Enchiridion §§23–27.')
item('first-cause-challenge','A maker does more than watch a creature fail','The watcher does not produce the walker. The treatise therefore contests whether non-compelling knowledge excuses a knowingly creating cause. This presses a question of responsibility, not a proof of two creators.',P,'Attributed argument — Book of Two Principles I.9–10; retain the distinction between the opponent’s analogy and the writer’s objection.')
item('creation-disagreement','Two Principles versus Augustine: opposed source or damaged good?','The Italian writer assigns destructive effects an opposed origin; Augustine calls evil a defect within good natures. Their disagreement concerns what evil is and what a cause explains.',P+A,'Editorial comparison of attributed arguments — Book of Two Principles I.1–2, 13 and Augustine, Enchiridion §§11–14; not a verdict or evidence of direct transmission.')
item('indulgence-letter','This letter remits an assigned ecclesiastical penance','A limited letter-case, framed in the terms Luther defends in 1517; not a transcription of a particular surviving certificate.',T,'Editorial case based on Luther, Ninety-Five Theses 5, 20, 34.')
item('coin-claim','A paid coin sends a soul out of purgatory?','This is the promise Luther attacks, not a claim attributed to every preacher or every Catholic.',T,'Attributed paraphrase — Luther, Ninety-Five Theses 27–28.')
item('theses-penalties','Remitting a penalty is not owning God’s forgiveness','Luther limits the penalties remitted and distinguishes divine forgiveness from a minister’s declaration.',T,'Attributed paraphrase — Luther, Ninety-Five Theses 5–6, 34. Thesis 6 also discusses reserved cases.')
item('guilt-and-penalty','This penalty-letter is not a purchase of divine forgiveness','Applying the distinction to this letter limits what its remission establishes.',T,'Editorial application of Luther, Ninety-Five Theses 5–6, 34; not a new historical document.')
item('false-assurance','A limited remission cannot guarantee the promised soul’s release','The reported guarantee exceeds the limited authority claimed for the letter.',T,'Attributed reconstruction of Luther’s objection — Ninety-Five Theses 20–28, 32, 34.')
item('repentance','Repentance concerns a whole life, not one transaction','Luther’s first thesis treats repentance as a continuing changed life.',T,'Attributed paraphrase — Luther, Ninety-Five Theses 1–3.')
item('repentant-life','A purchased letter cannot replace a lifetime of repentance','The excessive guarantee cannot stand in for the continuing life Luther demands.',T,'Attributed comparison — Luther, Ninety-Five Theses 1–3, 32–37; the limit on the letter does not dismiss every ministry.')
item('papal-declaration','Papal remission still deserves respect, Luther says in 1517','Luther retains a declarative role for papal remission rather than abolishing it.',T,'Attributed paraphrase — Luther, Ninety-Five Theses 6, 38; do not import his whole later position into 1517.')
item('limits-1517','Luther and Aquinas: a ministry need not own its power','Aquinas reserves principal grace-giving to God; Luther still allows a ministerial declaration. Neither claim makes its minister an independent owner of forgiveness. Sacraments and indulgences remain different claims.',T+['summa-grace'],'Editorial comparison — Luther, Ninety-Five Theses 6, 38; Aquinas, Summa III q.62 a.1. This is not a claim that indulgences are sacraments or that the two accounts coincide.')
item('household-need','The household needs its remaining money for food','A concrete necessity, not surplus money available for an indulgence.',T,'Editorial case based on Luther, Ninety-Five Theses 46.')
item('neighbour-1517','A nearby neighbour also lacks bread','Another person’s need competes with the proposed purchase.',T,'Editorial case based on Luther, Ninety-Five Theses 43–45.')
item('theses-mercy','Meet real needs before spending on indulgences','Luther prioritizes helping needy people and keeping what a household requires.',T,'Attributed paraphrase — Luther, Ninety-Five Theses 43–46.')
item('shared-needs','Two hungry households make this money more than spare change','Both cases identify necessities that the purchase would leave unmet.',T,'Editorial comparison of the household and neighbour cases in Luther, Ninety-Five Theses 43–46.')
item('household-priority','This family’s food money is not indulgence money','The rule about necessities applies to the household’s remaining funds.',T,'Editorial application — Luther, Ninety-Five Theses 46.')
item('neighbour-priority','Buying a letter would pass this hungry neighbour by','The mercy rule makes this purchase a concrete pastoral choice.',T,'Editorial application — Luther, Ninety-Five Theses 43–45.')
item('pastoral-priorities','Keep necessities for households and neighbours before buying indulgences','The cases put Luther’s priority into practice. They do not settle how scarce food should be divided between needy households.',T,'Attributed application — Luther, Ninety-Five Theses 43–46.')
reasons={'retain':'This argument remains available for another genuine comparison.','incorporate':'This premise is cited inside the new argument and remains visible among its preserved references.','transform':'This partial argument is revised at the same position; its cited premises remain visible.'}
def rec(id,a,b,out,roles=('incorporate','incorporate')):
 return {'id':id,'a':a,'b':b,'out':out,'sources':items[out]['sources'],'lifecycle':{k:{'role':v,'reason':reasons[v]} for k,v in zip((a,b),roles)},'preserve':[k for k,v in zip((a,b),roles) if v!='retain']}
r3=[
 rec('evil-maker','two-trees','material-world','evil-maker'),
 rec('creation-disagreement','evil-maker','evil-as-loss','creation-disagreement',('retain','retain')),
 rec('creator-not-watcher','watcher-analogy','foreknowledge-question','first-cause-challenge'),
 rec('agency-and-origin','foreknowledge-question','misdirected-will','agency-and-origin',('incorporate','retain')),
 rec('knowing-not-causing','watcher-analogy','misdirected-will','knowing-not-causing',('incorporate','retain')),
 rec('maker-after-agency','agency-and-origin','watcher-analogy','first-cause-challenge',('transform','incorporate')),
 rec('maker-after-watcher','knowing-not-causing','foreknowledge-question','first-cause-challenge',('transform','incorporate')),
 rec('maker-from-compared-partials','agency-and-origin','knowing-not-causing','first-cause-challenge',('transform','incorporate')),
]
r7=[
 rec('false-assurance-direct','indulgence-letter','coin-claim','false-assurance'),
 rec('guilt-and-penalty','indulgence-letter','theses-penalties','guilt-and-penalty'),
 rec('false-assurance-from-scope','guilt-and-penalty','coin-claim','false-assurance',('transform','incorporate')),
 rec('false-assurance-from-rule','coin-claim','theses-penalties','false-assurance'),
 rec('repentant-life','false-assurance','repentance','repentant-life',('transform','incorporate')),
 rec('limits-1517','instrument-of-grace','papal-declaration','limits-1517',('retain','incorporate')),
 rec('shared-needs','household-need','neighbour-1517','shared-needs'),
 rec('household-priority','household-need','theses-mercy','household-priority'),
 rec('neighbour-priority','neighbour-1517','theses-mercy','neighbour-priority'),
 rec('care-from-cases','shared-needs','theses-mercy','pastoral-priorities',('transform','incorporate')),
 rec('care-from-household','household-priority','neighbour-1517','pastoral-priorities',('transform','incorporate')),
 rec('care-from-neighbour','neighbour-priority','household-need','pastoral-priorities',('transform','incorporate')),
]
s['recipes']+=r3+r7
# Empty preserve lists are unnecessary; no source-stamp object is retained solely for attribution.
for x in s['recipes']:
 if x.get('preserve')==[]:del x['preserve']
def stage(n,raw,rs,core,objectives,motivation,variants):
 ch=m['chapters'][n];ch.update(new=raw,recipes=[x['id'] for x in rs],route=[{'type':'combine','a':next(x for x in rs if x['id']==id)['a'],'b':next(x for x in rs if x['id']==id)['b']} for id in core],alternatives=variants,motivation=motivation)
 st=s['stages'][n];st.update(motivation=motivation,objectives=objectives);st['caches'][0]['items']=raw
stage(2,['two-trees','material-world','foreknowledge-question','watcher-analogy'],r3,['evil-maker','creator-not-watcher','creation-disagreement'],[
 {'id':'opposed-maker-goal','kind':'create','item':'evil-maker','text':'Explain the opposed-maker argument','intermediate':True},
 {'id':'creator-watcher-goal','kind':'create','item':'first-cause-challenge','text':'Distinguish a creator from a watcher'},
 {'id':'two-principles-augustine-goal','kind':'create','item':'creation-disagreement','text':'Compare Two Principles with Augustine','after':['opposed-maker-goal']}],
 'This writer asks two hard questions: what source could produce a world that harms, and whether a maker can disclaim responsibility like a mere watcher. Augustine’s earlier account offers a different explanation of the same evils.',
 [{'route':['agency-and-origin','maker-after-agency']},{'route':['knowing-not-causing','maker-after-watcher']},{'route':['agency-and-origin','knowing-not-causing','maker-from-compared-partials']}])
stage(6,['indulgence-letter','coin-claim','theses-penalties','repentance','household-need','neighbour-1517','theses-mercy','papal-declaration'],r7,['false-assurance-direct','repentant-life','shared-needs','care-from-cases','limits-1517'],[
 {'id':'reported-guarantee-goal','kind':'create','item':'false-assurance','text':'Test the reported coin guarantee','intermediate':True},
 {'id':'care-before-purchase-goal','kind':'create','item':'pastoral-priorities','text':'Put necessities before indulgences'},
 {'id':'ministry-comparison-goal','kind':'create','item':'limits-1517','text':'Compare Luther’s ministry with Aquinas'},
 {'id':'letter-repentance-goal','kind':'create','item':'repentant-life','text':'Explain why a letter cannot replace repentance','after':['reported-guarantee-goal']}],
 'A reported sales promise competes with a lifetime of repentance and hungry households. Test what the letter can promise, put the money’s uses in order, and compare the ministry Luther still allows with Aquinas’s account of dependent agency.',
 [{'claim':['guilt-and-penalty','false-assurance-from-scope']},{'claim':['false-assurance-from-rule']},{'care':['household-priority','care-from-household']},{'care':['neighbour-priority','care-from-neighbour']}])
actions=[];s['checkpoints']=[]
for n,st in enumerate(s['stages']):
 s['checkpoints'].append({'id':f'chapter-{n+1}','label':f'{n+1}. {st["title"]}','actions':copy.deepcopy(actions)});actions+=m['chapters'][n]['route']+[{'type':'advance'}]
s['checkpoints'].append({'id':'complete','label':'Complete journey','actions':actions});m.update(authoredActions=actions,previousCandidateSha256=hashlib.sha256(base.read_bytes()).hexdigest(),sourceRevision='v5: executable desk 3 and 7 pilots only; remaining six desks have unchanged recipe/goal content')
s['notes'] += ['Revision 5 changes desks 3 and 7 only after stopped source-blind trials e/f. Distinct final arguments replace synthesis badges. Desks 4, 5, 6 and 8 remain known unfinished designs, not repaired by this candidate.']
(r/'doctrine-argument-desks-v5-candidate.json').write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n');(r/'authoring-manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
print({'items':len(s['items']),'recipes':len(s['recipes']),'core':sum(a['type']=='combine' for a in actions)})
