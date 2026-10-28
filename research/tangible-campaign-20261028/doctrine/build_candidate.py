"""Reproducible isolated candidate; never edits the recovered scenario registry."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
OLD=Path('/workspace/shared/combination-fork-recovery-evidence-20261028/doctrine-grace-and-matter-v1.json')
old=json.loads(OLD.read_text())
s={'schemaVersion':1,'id':'doctrine-argument-desks-v2-candidate','title':'Doctrine: Grace and Matter','premise':'Across eight desks, build and question arguments about evil, freedom, bodies and grace. Manuscripts answer other manuscripts; agreement is not the same as victory. A completed argument reconstructs its author’s position, not a proof of belief.','items':[],'locations':[],'initialItems':[],'recipes':[],'stages':[],'sources':old['sources'].copy(),'notes':old['notes'][:5],'checkpoints':[]}
for src in s['sources']:
 if src['id']=='ritual':
  src.update(url='https://www.rialto.unina.it/prose_religiose_cat/cathar-ritual/',title='Occitan ritual, Lyon PA 36, Marvyn Roy Harris critical edition (Rialto)',note='Use sections IV and VI for spiritual baptism and bodily actions. This is not the Book of Two Principles; dating and the New Testament translation’s attribution require separate treatment.')
 if src['id']=='aug-evil':src['title']='Augustine, Enchiridion §§9–15, 23–27, 42–52'
s['sources'] += [
 {'id':'matthew-tree','title':'Matthew 7:18, King James Version','url':'https://www.biblegateway.com/passage/?search=Matthew%207%3A18&version=KJV','note':'Public-domain translation supplies the visible biblical quotation; the medieval treatise’s interpretation is separately attributed.'},
 {'id':'two-principles-full','title':'Book of Two Principles I.8–10, III.1–2 and V.1–6, translated primary text','url':'https://gnosis.org/library/cathar-two-principles.htm','note':'Online transcription based on Wakefield and Evans, with editor changes; primary text located through the search index because direct fetch failed. Use the actual argument, not the archive’s triumphalist introduction. I.9 gives the watcher analogy and I.10 its reply; V exposes disagreement among dualist groups.'},
 {'id':'genesis','title':'Genesis 1:31, King James Version','url':'https://www.biblegateway.com/passage/?search=Genesis%201%3A31&version=KJV','note':'Brief excerpt from the creation account; not an independent demonstration of the theological claim.'},
 {'id':'romans','title':'Romans 7:19, King James Version','url':'https://www.biblegateway.com/passage/?search=Romans%207%3A19&version=KJV','note':'Short excerpt about willing and doing. Augustine’s reading is an interpretation, not the only reading of Romans.'},
 {'id':'aristotle','title':'Aristotle, Nicomachean Ethics I.1, 1094a, Rackham translation','url':'https://scaife.perseus.org/library/urn%3Acts%3AgreekLit%3Atlg0086.tlg010.perseus-eng2/','note':'Ends and goods. The candidate compares this excerpt with Summa I q.1; it does not claim this passage alone caused Aquinas’s position.'},
 {'id':'summa-evil','title':'Aquinas, Summa I q.49 aa.1–3','url':'https://www.newadvent.org/summa/1049.htm','note':'Actual objections, Augustine citations, two principles, good nature and defective agency. No evidence here that Aquinas was answering this surviving Italian treatise.'},
 {'id':'ritual-catalogue','title':'CNRS IRHT, Initiale: Lyon BM PA 36','url':'https://initiale.irht.cnrs.fr/codex/2627','note':'Catalogue has a different dating/provenance from Harris’s foreword and notes Cathar/Waldensian attribution questions. Do not collapse manuscript, translation and ritual into one secure date.'},
 {'id':'ritual-study','title':'Harris and Peytavie, The Occitan New Testament in Lyon PA 36: a Cathar or Waldensian translation? (2006)','url':'https://www.persee.fr/doc/heres_0758-3737_2006_num_44_1_2088','note':'Scholarly attribution problem, not evidence that every text in this manuscript has the same origin.'},
]
items={}; routes=[]; meta=[]; current=None

def I(id,label,description,src=(),kind='reference'):
 assert id not in items,id
 row={'id':id,'label':label,'description':description,'sources':list(src)}
 items[id]=row;s['items'].append(row)
 if current is not None and kind!='creation':current['new'].append(id)
 return id

def C(id,label,description,src=()):return I(id,label,description,src,'creation')
def R(a,b,out,roles=('retain','transform'),preserve=(),alt=False,reason=None):
 assert a in items and b in items and out in items,(a,b,out)
 rid=out+('-alt-'+str(sum(r['out']==out for r in s['recipes'])) if alt else '')
 explanations={
  'retain':'This cited text or established argument remains available for comparison; making a new reading does not destroy it.',
  'transform':'This working question or manuscript is revised into the more specific argument at the same desk position.',
  'incorporate':'This manuscript leaf is bound into the combined argument, not erased or discredited.'}
 r={'id':rid,'a':a,'b':b,'out':out,'sources':items[out]['sources'],'lifecycle':{a:{'role':roles[0],'reason':explanations[roles[0]]},b:{'role':roles[1],'reason':explanations[roles[1]]}}}
 if preserve:r['preserve']=list(preserve)
 if reason:r['caveat']=reason
 s['recipes'].append(r); current['recipes'].append(rid)
 if not alt:current['route'].append({'type':'combine','a':a,'b':b})
 else:current['alternatives'].append({'recipe':rid,'replacesOutput':out})

def start(id,title,speaker,motivation):
 global current
 current={'id':id,'title':title,'speaker':speaker,'motivation':motivation,'new':[],'recipes':[],'route':[],'alternatives':[]}

def end(goals,carry=None):
 st={'id':current['id'],'title':current['title'],'speaker':current['speaker'],'motivation':current['motivation'],'area':{'id':current['id']+'-desk','label':current['title'],'travelText':current['title']},'caches':[{'id':current['id']+'-sources','label':'On the desk','narrative':'Texts, observations and working questions.','items':current['new']}],'objectives':[]}
 for n,(id,text) in enumerate(goals):
  g={'id':current['id']+'-'+id+'-goal','kind':'create','item':id,'text':text}
  if n<len(goals)-1:g['intermediate']=True
  if n:g['after']=[st['objectives'][n-1]['id']]
  st['objectives'].append(g)
 if carry is not None:st['carry']=carry
 s['stages'].append(st);routes.append(current['route']+[{'type':'advance'}]);meta.append(current)

# 1: two independent working branches, plus a rival explanation.
start('augustine-evil','What makes a wound evil?','Augustine’s handbook · North Africa, c. 421','A reader wants a short account of faith. The desk holds a creation text, a healing observation and a choice made badly. Can one account explain both a damaged body and a guilty will?')
I('genesis-leaf','Genesis 1:31','Genesis: God surveys creation: “behold, it was very good” (KJV). How can damage belong to a good creation?',['genesis'])
I('enchiridion-leaf','Enchiridion §§11–12','Augustine calls disease a loss of health, not a substance travelling out of the patient.',['aug-evil'])
I('wound-notes','A wounded body','Observation: living flesh remains, but its integrity is damaged. What exactly is the evil here?')
I('cure-notes','After the wound heals','Observation: health returns. No separate thing called the wound has moved to another patient.')
I('broken-vessel','A cracked water jar','Comparison: clay remains while the jar loses its capacity to hold water. Is the crack another kind of clay?')
I('human-choice','A deliberate choice','A person knowingly turns from a better good. A mere accident will not explain moral responsibility.',['aug-evil'])
I('lesser-good','A lesser good preferred','Augustine’s question: the object desired can be good, yet the order of loving it can be wrong.',['aug-evil'])
I('evil-substance-objection','A rival substance?','Working objection: perhaps evil is a thing opposed to good, rather than damage within a good thing.')
C('created-goodness','Created goodness','Augustine’s premise: a nature has goodness insofar as it exists; created does not mean incorruptible.',['aug-evil','genesis'])
C('missing-health','Loss, not another thing','Working manuscript: the damage depends on something that can be damaged; healing need not relocate an evil substance.',['aug-evil'])
C('evil-as-loss','Evil as loss','Augustine’s privation account: evil damages a good nature. The pain is real, not dismissed as imaginary.',['aug-evil'])
C('chosen-attachment','A wrongly ordered choice','Working manuscript: choosing a lesser good against a better one differs from having an evil kind of body.',['aug-evil'])
C('misdirected-will','Misdirected will','Augustine locates moral fault in the direction of willing, not in an independently evil substance.',['aug-evil'])
C('no-evil-substance','Reply to the rival substance','Augustine’s reply: damage requires a good subject. Making evil a second substance leaves that dependence unexplained.',['aug-evil'])
C('augustine-account','Augustine’s account of evil','Two claims remain distinct: a body can lose integrity; a will can turn wrongly. Neither makes evil a rival substance.',['aug-evil'])
R('genesis-leaf','enchiridion-leaf','created-goodness',('retain','retain'))
R('wound-notes','cure-notes','missing-health',('transform','retain'))
R('broken-vessel','enchiridion-leaf','missing-health',('transform','retain'),alt=True)
R('created-goodness','missing-health','evil-as-loss')
R('human-choice','lesser-good','chosen-attachment',('transform','retain'))
R('evil-as-loss','chosen-attachment','misdirected-will')
R('evil-as-loss','evil-substance-objection','no-evil-substance')
R('misdirected-will','no-evil-substance','augustine-account',('retain','retain'))
end([('evil-as-loss','Explain the damage'),('misdirected-will','Explain the wrong choice'),('augustine-account','Answer the rival account')])

# 2: law/example, inherited condition, and inner assistance are separate branches.
start('augustine-grace','Can knowing the good be enough?','Augustine’s grace controversy · early fifth century','A command tells someone what to do. Yet willing and doing come apart, and infants are brought for baptism. Augustine must say what help he thinks is missing—not merely rename instruction as grace.')
I('romans-leaf','Romans 7:19','Paul: “the good that I would I do not” (KJV). Willing and doing come apart.',['romans'])
I('commands','Command and example','A command identifies a good act; an example shows it. Both can assist without deciding what makes someone actually will it.',['aug-grace'])
I('pelagius-quotation','Pelagius, as quoted','Augustine quotes Pelagius distinguishing capacity, willing and doing. Capacity is God’s gift; how does help reach the other two? On Grace of Christ I.5.',['aug-grace'])
I('adams-fall','Adam’s fall','Augustine reads humanity’s condition through Adam, not simply through a list of each individual’s mistakes.',['aug-evil'])
I('infant-baptism','An infant at the font','Pastoral question: why baptize someone who has not yet performed a deliberate wrong?',['aug-evil'])
I('baptism-leaf','Enchiridion §§43, 52','Augustine argues from infant baptism to a condition inherited before personal acts. The rite and the inference are distinct.',['aug-evil'])
I('inward-grace','On Grace of Christ I.3','Augustine asks for more than teaching: inward help in willing and acting through love.',['aug-grace'])
C('divided-will','Willing without doing','The earlier account of misdirection now faces an agent who approves the good but fails to perform it.',['romans','aug-grace'])
C('instruction-account','Help through instruction','A serious proposal: created capacity, commands and Christ’s example are gifts helping moral action.',['aug-grace'])
C('command-not-cure','A command is not a cure','Augustine’s objection: showing the good does not yet explain the inward assistance needed to do it.',['aug-grace'])
C('wounded-will','Wounded will','Augustine links the still-created-good nature with a damaged condition after Adam. Nature is not an evil substance.',['aug-evil'])
C('inherited-condition','Before personal wrongdoing','Augustine’s baptism argument distinguishes inherited sin from a child’s own deliberate actions.',['aug-evil'])
C('need-of-grace','An inherited wound needs help','Working manuscript joins the damaged-will claim with Augustine’s reading of infant baptism.',['aug-evil','aug-grace'])
C('grace-heals-will','Grace heals the will','Augustine’s answer: divine assistance reaches willing and doing, rather than merely supplying information.',['aug-grace'])
C('augustine-grace-answer','Augustine’s grace argument','Teaching remains valuable; Augustine argues that inward aid is additionally necessary. The disputed account of inherited sin remains visible.',['aug-grace','aug-evil'])
R('misdirected-will','romans-leaf','divided-will',('retain','retain'))
R('commands','pelagius-quotation','instruction-account',('retain','retain'))
R('divided-will','instruction-account','command-not-cure',('retain','retain'))
R('created-goodness','adams-fall','wounded-will')
R('infant-baptism','baptism-leaf','inherited-condition',('transform','retain'))
R('wounded-will','inherited-condition','need-of-grace',('transform','incorporate'),('inherited-condition',))
R('need-of-grace','inward-grace','grace-heals-will',('transform','retain'),('need-of-grace',))
R('grace-heals-will','command-not-cure','augustine-grace-answer',('retain','retain'))
end([('command-not-cure','Test instruction alone'),('grace-heals-will','Explain inward help'),('augustine-grace-answer','State Augustine’s answer')])

# 3: the rival must have its own scriptural and causal argument.
start('two-principles','Can one good cause account for evil?','Book of Two Principles · northern Italy, thirteenth century','A different Christian writer disputes a single first principle. Read the argument’s biblical images and causal challenge against the account already made; do not explain disagreement away by calling bodies unreal.')
I('dualist-treatise','Book of Two Principles','This particular Italian writer argues for opposed first principles. Sections 1–2 and 13 supply scriptural and causal reasoning.',['two-principles'])
I('two-trees','Matthew’s two trees','Matthew 7:18 (KJV): “A good tree cannot bring forth evil fruit”. The treatise reads this as a claim about origins.',['matthew-tree','two-principles'])
I('material-world','A world that harms','Observation: bodies undergo injury, decay and death. The writer asks how destructive effects fit an entirely good first principle.',['two-principles'])
I('foreknowledge-question','Foreknowledge and responsibility','If a creator knowingly makes an agent who will fail, does blaming only the agent settle the first cause’s responsibility?',['two-principles'])
I('watcher-analogy','A watcher at a window','Two Principles I.9 reports an opponent’s analogy: observing a walker does not make the walker move. Foreknowledge need not compel.',['two-principles-full'])
C('knowing-not-causing','Knowing is not causing','The reported reply distinguishes another’s knowledge from the will’s agency. The writer then disputes whether a creator is merely an observer.',['two-principles-full'])
C('two-origins','Two first principles','The treatise reads opposed fruits as evidence for opposed origins; this is its inference, not a universal Cathar creed.',['two-principles'])
C('evil-maker','An evil maker','In this radical-dualist account, corruptible creation is attributed to an evil principle rather than the good Father.',['two-principles'])
C('cause-and-permission','Cause, permission and blame','The privation manuscript now faces a harder question: can allowing a foreknown failure leave a good creator blameless?',['two-principles','aug-evil'])
C('first-cause-challenge','The first-cause challenge','This writer presses beyond an isolated wrong choice to responsibility for the conditions under which it occurs.',['two-principles'])
C('augustine-reply','Nature is not its misuse','Augustine’s earlier distinction supplies a reply: a creature’s goodness and its wrongly directed act are different claims.',['aug-evil'])
C('dualist-case','The dualist manuscript','Two strands of this writer’s case: opposed effects and responsibility for their origin. Neither is merely distaste for bodies.',['two-principles'])
C('creation-disagreement','Two accounts of creation','The manuscripts disagree about what a good cause can produce or permit. Their arguments survive side by side.',['aug-evil','two-principles'])
R('dualist-treatise','two-trees','two-origins',('retain','retain'))
R('two-origins','material-world','evil-maker')
R('evil-as-loss','foreknowledge-question','cause-and-permission')
R('misdirected-will','watcher-analogy','knowing-not-causing',('retain','retain'))
R('knowing-not-causing','cause-and-permission','first-cause-challenge')
R('created-goodness','misdirected-will','augustine-reply',('retain','retain'))
R('evil-maker','first-cause-challenge','dualist-case',('retain','retain'))
R('dualist-case','augustine-reply','creation-disagreement',('retain','retain'))
end([('first-cause-challenge','Press the causal objection'),('dualist-case','Reconstruct the rival case'),('creation-disagreement','Locate the disagreement')])

# 4: genuine cross-fertilisation, with direct Augustine citations in Aquinas.
start('aquinas-reason','What can reason contribute?','Aquinas’s disputation desk · thirteenth century','Students have philosophical arguments as well as revealed texts. A doctrine of grace must explain why reasoning is worth doing, where its reach ends, and how to answer a real objection about evil.')
I('summa-page','Summa I.1, reply 8.2','Aquinas: “grace does not destroy nature but perfects it”. Natural reason can serve theology.',['summa-doctrine'])
I('aristotle-leaf','Aristotle on ends','Nicomachean Ethics I.1 calls the good “That at which all things aim” (Rackham). Ask what inquiry is directed toward.',['aristotle'])
I('reason-observation','An argument from effects','Working example: reasoning from observed effects can explain something without yet disclosing every end of human life.',['summa-doctrine'])
I('metaphysics-objection','The student’s objection','Summa I.1 objection: philosophy already studies being and even God. Why would another kind of teaching be needed?',['summa-doctrine'])
I('salvation-end','An end beyond present sight','Aquinas argues that an end exceeding reason’s reach must be disclosed if people are to direct their lives toward it.',['summa-doctrine'])
I('revelation-leaf','A revealed teaching','Summa I.1: revelation addresses truths beyond unaided reason; it does not make every argument dispensable.',['summa-doctrine'])
I('summa-evil-leaf','Summa I.49 objections','Aquinas considers the good tree, defective agency and two first principles. He explicitly cites Augustine.',['summa-evil'])
C('nature-perfected','Nature perfected','For Aquinas, grace completes rather than abolishes natural powers; the earlier healing argument becomes a question about reason too.',['summa-doctrine','aug-grace'])
C('philosophical-inquiry','What inquiry can reach','Working manuscript: reasoning has its own questions, evidence and ends. Recognizing these does not settle whether revelation is needed.',['aristotle','summa-doctrine'])
C('reason-limits','The limits of reason','Aquinas distinguishes reason’s genuine reach from the further end he thinks necessary for salvation.',['summa-doctrine'])
C('reason-and-revelation','Reason with revelation','Aquinas’s account assigns reasoning and revealed teaching different, cooperating roles rather than making either redundant.',['summa-doctrine'])
C('reason-serving-theology','Reason serving theology','Aquinas uses natural reasoning to clarify and answer objections without claiming it proves every article of faith.',['summa-doctrine'])
C('aquinas-evil-answer','Aquinas’s answer on evil','Aquinas separates a good nature from defective action and rejects a supreme evil principle. The earlier objection is answered, not forgotten.',['summa-evil'])
C('summa-disputation','A reasoned disputation','The method and an actual disputed question now belong together. Aquinas’s answer is one historically situated argument.',['summa-doctrine','summa-evil'])
R('grace-heals-will','summa-page','nature-perfected',('retain','retain'))
R('aristotle-leaf','reason-observation','philosophical-inquiry')
R('metaphysics-objection','reason-observation','philosophical-inquiry',('retain','transform'),alt=True)
R('philosophical-inquiry','salvation-end','reason-limits',('transform','retain'))
R('reason-limits','revelation-leaf','reason-and-revelation',('transform','retain'))
R('nature-perfected','reason-and-revelation','reason-serving-theology')
R('creation-disagreement','summa-evil-leaf','aquinas-evil-answer',('retain','retain'),reason='Comparison of arguments, not evidence that Aquinas read the Book of Two Principles.')
R('reason-serving-theology','aquinas-evil-answer','summa-disputation',('retain','retain'))
end([('reason-and-revelation','Find reason’s scope'),('aquinas-evil-answer','Answer an actual objection'),('summa-disputation','Complete the disputation')])

# 5: ritual is a separate primary witness, not an illustrative appendix to the treatise.
start('ritual','What can reach the spirit?','The Lyon ritual · a separate medieval witness','A community’s ritual tells a candidate how to receive spiritual baptism. Set this text beside the earlier dispute over matter: the book, the hands and the promises must all be accounted for.')
I('washing-water','Washing water','A bodily washing can clean skin. The earlier dispute about the world raises a further question about spiritual cleansing.')
I('ritual-leaf','Lyon ritual, section IV','The ritual distinguishes John’s water baptism from baptism of the Spirit, citing Gospel and apostolic passages.',['ritual'])
I('gospel-and-hands','Book and hands','The rite uses a Gospel book and laying on of hands. Calling it spiritual does not mean that nothing bodily occurs.',['ritual'])
I('acts-hands','Acts 8 in the ritual','Section IV cites Peter and John laying hands on the Samaritans as scriptural precedent for receiving the Spirit.',['ritual'])
I('ritual-promise','The candidate’s undertaking','The candidate undertakes a continuing Christian discipline; the consolamentum is not presented as a moment of detached speculation.',['ritual'])
I('body-book-observation','A visible, bodily ceremony','Observation from the rubric: people speak, kneel and handle a book. What role can these actions have?',['ritual'])
C('water-question','Can water save?','The earlier evil-maker argument sharpens a question about material rites; this does not establish the ritual writer’s exact cosmology.',['two-principles','ritual'])
C('baptism-distinction','Water and Spirit distinguished','This ritual reads scriptural contrasts as grounds for its spiritual baptism, not as a denial of every bodily action.',['ritual'])
C('apostolic-pattern','A claimed apostolic pattern','The ritual links its book and hands to an apostolic precedent. This is the community’s claim of continuity.',['ritual'])
C('spiritual-baptism','Spiritual baptism','The consolamentum joins a claimed gift of the Spirit with Gospel, hands and the candidate’s commitment.',['ritual'])
C('bodily-action-question','What does the body contribute?','The nature-and-grace manuscript makes the visible ceremony a sharper comparison: bodily participation need not imply bodily power alone.',['summa-doctrine','ritual'])
C('embodied-spiritual-rite','A spiritual rite with bodies','Working observation: the rite distinguishes spiritual efficacy from washing, yet still gives bodies, voices and a book roles.',['ritual'])
C('ritual-account','The ritual’s own account','The scriptural distinction and visible ceremony are kept together. This witness is not reduced to the Italian treatise.',['ritual'])
R('evil-maker','washing-water','water-question')
R('water-question','ritual-leaf','baptism-distinction',('transform','retain'))
R('gospel-and-hands','acts-hands','apostolic-pattern',('retain','retain'))
R('apostolic-pattern','ritual-promise','spiritual-baptism',('transform','retain'))
R('nature-perfected','body-book-observation','bodily-action-question')
R('spiritual-baptism','bodily-action-question','embodied-spiritual-rite',('retain','retain'))
R('baptism-distinction','embodied-spiritual-rite','ritual-account',('retain','retain'))
end([('spiritual-baptism','Read the rite’s claim'),('embodied-spiritual-rite','Account for the bodies'),('ritual-account','Explain the ritual’s bodily actions')])

# 6: an instrument analogy is distinguishable from the claim it illustrates.
start('aquinas-sacrament','Can matter convey grace?','Back at Aquinas’s desk · thirteenth century','Water washes; words signify; a tool acts through its user. Can these facts clarify a sacrament without turning matter into independent magic? The Eucharistic question adds another difficulty: appearances remain.')
I('water-and-word','Water and word','Summa III.60: Aquinas cites Augustine on a sensible element joined with words. A washing is not specified by water alone.',['summa-sign'])
I('summa-sign-leaf','Summa III.60','The sacramental sign points beyond itself. Words determine what the sensible action signifies.',['summa-sign'])
I('saw','A carpenter’s saw','A saw can cut, but it does not decide to build a chest. Aquinas uses a working tool to explain instrumental agency.',['summa-grace'])
I('craftsperson','The maker’s intention','The craftsperson directs the tool toward a work beyond the tool’s independent power. This is an analogy, not evidence that a sacrament works.',['summa-grace'])
I('bread-and-wine','Bread and wine','The Eucharistic question: how could a substantial change be asserted when colour, taste and other appearances persist?',['summa-eucharist'])
I('appearance-notes','The appearances remain','Sensory report: the familiar appearances of bread and wine are still present. What would that observation establish—or fail to establish?',['summa-eucharist'])
I('eucharist-leaf','Summa III.75','Aquinas distinguishes substance from accidents in his account of Eucharistic change. He does not describe an ordinary visible alteration.',['summa-eucharist'])
C('sensible-sign','A sensible sign','The nature-and-grace account now meets a bodily sign that can point beyond its immediate physical effect.',['summa-sign','summa-doctrine'])
C('sign-with-words','The action specified','For Aquinas, element and words together make the sacramental sign determinate.',['summa-sign'])
C('instrument-analogy','An instrument’s agency','The saw acts really, but under another agent’s direction. The example distinguishes instrumental from independent power.',['summa-grace'])
C('instrument-of-grace','Instrument of grace','Aquinas attributes grace principally to God and instrumentally to the sacrament; matter has no autonomous store of saving power.',['summa-grace'])
C('sacramental-disagreement','Two accounts of mediation','The ritual and Aquinas both use bodily actions but differ about what they signify and how grace is conveyed.',['ritual','summa-grace'])
C('sensible-appearances','A report of what is sensed','The observed appearances are a question for Aquinas’s account, not an empirical proof of the asserted change.',['summa-eucharist'])
C('substance-and-appearance','Substance and appearance','Aquinas explains transubstantiation as substantial change with sensible accidents remaining. This is his theological account.',['summa-eucharist'])
C('aquinas-sacramental-account','Aquinas’s sacramental account','Instrumental agency and Eucharistic change are distinct arguments. The competing ritual remains a comparison, not a defeated prop.',['summa-grace','summa-eucharist','ritual'])
R('nature-perfected','water-and-word','sensible-sign')
R('sensible-sign','summa-sign-leaf','sign-with-words',('transform','retain'))
R('saw','craftsperson','instrument-analogy',('retain','retain'))
R('sign-with-words','instrument-analogy','instrument-of-grace',('transform','incorporate'),('instrument-analogy',))
R('spiritual-baptism','instrument-of-grace','sacramental-disagreement',('retain','retain'))
R('bread-and-wine','appearance-notes','sensible-appearances',('retain','transform'))
R('sensible-appearances','eucharist-leaf','substance-and-appearance',('transform','retain'))
R('sacramental-disagreement','substance-and-appearance','aquinas-sacramental-account',('retain','retain'))
end([('instrument-of-grace','Explain instrumental action'),('substance-and-appearance','Distinguish what changes'),('aquinas-sacramental-account','Compare the material claims')])

# 7: practical stakes arise from theses 43–46, not a modern invented sales caricature.
start('luther-1517','What can a letter promise?','Luther · Wittenberg, 1517','A household has limited money; a needy neighbour is nearby. Claims about indulgences compete for attention with repentance and care. What does a letter actually remit, and what should a preacher promise?')
I('indulgence-letter','An indulgence letter','The distinction at issue is remission of penalties, not a legitimate purchase of forgiveness of guilt.',['theses'])
I('coin-claim','The claim reported in Thesis 27','Luther attacks a promise tying a soul’s release to money arriving. Read it as his report of a claim, not every Catholic’s doctrine.',['theses'])
I('theses-penalties','Theses 5, 6 and 34','Luther distinguishes ecclesiastical penalties, divine forgiveness and a minister’s declaration.',['theses'])
I('repentance','Thesis 1: repentance','The opening thesis concerns an entire changed life, not a single transaction.',['theses'])
I('household-need','A household’s limited coins','The case behind Thesis 46: money needed to maintain a household cannot simply be treated as surplus.',['theses'])
I('neighbour-1517','A needy neighbour','A practical alternative use of the same money. The doctrinal dispute changes what the household does.',['theses'])
I('theses-mercy','Theses 43–46','Luther privileges care for poor people and household needs over buying indulgences.',['theses'])
I('papal-declaration','Theses 38 and 49','In 1517 Luther still defends a role for papal remission while warning against misplaced trust.',['theses'])
C('guilt-and-penalty','Guilt is not a penalty','The earlier instrument-of-grace account helps distinguish a sign or ministry from ownership of divine forgiveness.',['theses','summa-grace'])
C('sales-promise','An excessive promise','The reported coin claim promises an effect beyond a carefully limited remission of ecclesiastical penalties.',['theses'])
C('false-assurance','False assurance','Luther’s objection targets confidence in the letter as a guarantee of salvation.',['theses'])
C('repentant-life','A repentant life','Luther’s first thesis shifts attention from an isolated purchase to continuing repentance.',['theses'])
C('works-of-mercy','Mercy before purchase','A concrete priority: help the neighbour and maintain the household instead of treating every coin as indulgence money.',['theses'])
C('indulgence-critique','The assurance critique','A limited letter cannot replace a repentant life; the criticism is not simply that every rite is worthless.',['theses'])
C('pastoral-priorities','A preacher’s priorities','Repentance and practical care belong together in this 1517 argument.',['theses'])
C('limits-1517','What 1517 still allows','The critique does not yet erase every ecclesial ministry. The comparison with material mediation remains qualified.',['theses','summa-grace'])
C('wittenberg-disputation','The 1517 disputation','Promises, repentance and household choices now form a connected criticism, without turning 1517 into the whole later Reformation.',['theses'])
R('instrument-of-grace','indulgence-letter','guilt-and-penalty')
R('coin-claim','theses-penalties','sales-promise',('transform','retain'))
R('guilt-and-penalty','sales-promise','false-assurance',('retain','transform'))
R('repentance','theses-penalties','repentant-life',('transform','retain'))
R('neighbour-1517','theses-mercy','works-of-mercy',('transform','retain'))
R('household-need','theses-mercy','works-of-mercy',('transform','retain'),alt=True)
R('false-assurance','repentant-life','indulgence-critique',('transform','retain'))
R('works-of-mercy','indulgence-critique','pastoral-priorities',('retain','retain'))
R('sacramental-disagreement','papal-declaration','limits-1517',('retain','retain'))
R('pastoral-priorities','limits-1517','wittenberg-disputation',('retain','retain'))
end([('false-assurance','Test the letter’s promise'),('pastoral-priorities','Choose pastoral priorities'),('wittenberg-disputation','State the 1517 limits')])

# 8: free and bound are branches of a paradox, not opposite faction badges.
start('luther-1520','Free, and bound to serve','Luther · On Christian Liberty, 1520','A reader asks: if works do not purchase righteousness, why care for anyone? The old questions about inward help and bodily life return. Reconstruct both sides of Luther’s free-and-serving paradox.')
I('promise-of-christ','Christ’s promise','In On Christian Liberty, faith receives Christ’s promise rather than presenting works as a price.',['liberty'])
I('liberty-leaf','The free-and-serving paradox','Luther calls the Christian a “free lord of all” and a “dutiful servant of all”. How can both claims stand?',['liberty'])
I('commands-promises','Commands and promises','Luther distinguishes what a command requires from what the promise gives. These are different uses of the word.',['liberty'])
I('neighbour-in-need','The neighbour still needs help','A bodily need remains whether or not helping purchases righteousness. What motive for service survives?')
I('christ-servant','Christ as servant','Luther invokes Christ’s self-giving as a pattern for serving others without needing to purchase a benefit.',['liberty'])
I('body-discipline','The body’s continuing work','On Christian Liberty still discusses bodily discipline and useful labour. Its inner/outer distinction is not a second evil creator.',['liberty'])
C('receiving-not-earning','Receiving, not earning','The earlier need for grace becomes Luther’s question of how a person receives righteousness.',['aug-grace','liberty'])
C('justification-by-faith','Justification by faith','Luther argues that faith receives righteousness through Christ’s promise, not through a price paid in works.',['liberty'])
C('command-and-promise','Demand and gift distinguished','The repentant-life manuscript now meets a distinction between the command’s demand and the promise received in faith.',['liberty','theses'])
C('freedom-from-merit','Freedom from purchasing favour','Luther’s freedom concerns the basis of righteousness; it does not make a neighbour’s need disappear.',['liberty'])
C('service-pattern','Service without a bargain','Christ’s self-giving supplies Luther’s pattern for helping a neighbour without treating help as a transaction.',['liberty'])
C('free-service','Freely serving the neighbour','Faith frees service from purchasing justification; love gives service a recipient and purpose.',['liberty'])
C('works-after-faith','Works follow faith','The 1517 concern for care returns with a 1520 rationale: useful works follow the received gift.',['theses','liberty'])
C('body-not-discarded','Bodily life remains','Comparison with the earlier embodied rite keeps a distinction clear: inner faith need not mean no bodily practice or service.',['liberty','ritual'])
C('freedom-and-service','Luther’s two propositions','Free in relation to earning righteousness; bound through love to serve. This reconstructs Luther’s answer, not a verdict against the other desks.',['liberty'])
R('grace-heals-will','promise-of-christ','receiving-not-earning',('retain','retain'))
R('receiving-not-earning','liberty-leaf','justification-by-faith',('transform','retain'))
R('repentant-life','commands-promises','command-and-promise',('retain','retain'))
R('justification-by-faith','command-and-promise','freedom-from-merit')
R('neighbour-in-need','christ-servant','service-pattern',('transform','retain'))
R('freedom-from-merit','service-pattern','free-service',('transform','incorporate'),('service-pattern',))
R('pastoral-priorities','free-service','works-after-faith',('retain','retain'))
R('embodied-spiritual-rite','body-discipline','body-not-discarded',('retain','retain'),reason='Modern comparison of distinct arguments; no assertion of Cathar influence on Luther.')
R('works-after-faith','body-not-discarded','freedom-and-service',('retain','retain'))
end([('justification-by-faith','Explain the gift'),('free-service','Explain why serve'),('freedom-and-service','Resolve Luther’s paradox')])

s['notes'][0]='Quoted words are identified on manuscript readings; unquoted claims are attributed designer paraphrases or explicitly labelled editorial comparisons. Completion reconstructs an argument, not religious truth.'
s['notes'] += [
 'New candidate save identity: doctrine-argument-desks-v2-candidate. The v1 and original theology routes must remain unchanged and directly accessible.',
 'Multiple manuscript branches are required because they supply distinct premises or objections, not because a fixed count of cards must be collected. Alternative observations are substitutions, not choose-two-of-four locks.',
 'Short quoted text is attributed on cards. Unquoted wording is designer paraphrase. Observation and working-question cards are pedagogical constructions, not discovered historical documents.',
 'The opening historical date describes the Enchiridion; the second desk returns to the early-fifth-century grace controversy. The medieval desks explicitly cross-cut strands rather than asserting meetings or a universal Cathar creed.',
 'Aquinas I q.49 explicitly cites Augustine and includes the good-tree objection. Comparison to the Book of Two Principles is not proof of direct transmission.',
 'The Lyon ritual’s manuscript, the Occitan New Testament translation and the ritual’s textual origins cannot be assigned one uncontested date or authorship. Harris and the IRHT catalogue differ. The game avoids a spurious precise date.',
 'Neither all Catholic accounts nor all later Lutheran positions are represented. Trinity, Christology, saints, Trent and later confessional responses remain unimplemented; this candidate does not claim doctrinal completeness.',
 'Core route and alternative-route validation are mechanical evidence, not human evidence of enjoyment or evidence that a doctrine is true.'
]

# Reading is content, not an interaction tutorial. Normal item descriptions remain hidden.
source_names={x['id']:x['title'] for x in s['sources']}
for id in ['foreknowledge-question','cause-and-permission','first-cause-challenge','evil-maker','material-world']:
 items[id]['sources']=list(dict.fromkeys(items[id]['sources']+['two-principles-full']))
for r in s['recipes']:
 r['sources']=items[r['out']]['sources']
labels={
 'genesis-leaf':'“Behold, it was very good.”', 'enchiridion-leaf':'Disease is lost health, not another substance',
 'romans-leaf':'“The good that I would I do not.”', 'baptism-leaf':'Infants and inherited sin',
 'inward-grace':'Help in willing', 'summa-page':'“Grace does not destroy nature but perfects it.”',
 'aristotle-leaf':'“That at which all things aim.”', 'summa-evil-leaf':'Can good cause evil?',
 'ritual-leaf':'Water and Spirit', 'acts-hands':'Apostles lay on hands',
 'summa-sign-leaf':'Words specify a sign', 'eucharist-leaf':'Change beneath appearances',
 'theses-penalties':'Penalties, not guilt', 'repentance':'Repentance for a lifetime',
 'theses-mercy':'Help before purchase', 'papal-declaration':'A ministry still allowed',
 'liberty-leaf':'“Free lord of all”; “dutiful servant of all”', 'reason-limits':'The limits of reason',
 'two-trees':'“A good tree cannot bring forth evil fruit.”',
 'created-goodness':'Created good does not mean unable to fail',
 'evil-as-loss':'The wound is real; evil is not a substance',
 'misdirected-will':'A good nature can choose badly',
 'grace-heals-will':'Grace helps us will, not merely know',
 'evil-maker':'An evil maker for a world that harms',
 'instrument-of-grace':'An instrument of grace, not its independent owner',
 'justification-by-faith':'Faith receives what works cannot buy',
 'free-service':'Freed from earning, free to serve a neighbour',
 'coin-claim':'A coin releases a soul?', 'pelagius-quotation':'Capacity, willing, doing',
}
for id,label in labels.items():items[id]['label']=label
quotes={
 'genesis-leaf':'Short quotation — Genesis 1:31, King James Version (public domain). The surrounding question is editorial.',
 'romans-leaf':'Short quotation — Romans 7:19, King James Version (public domain). Augustine’s use of this tension is an interpretation.',
 'two-trees':'Short quotation — Matthew 7:18, King James Version (public domain); compare its use in Book of Two Principles I.2.',
 'summa-page':'Short quotation — Aquinas, Summa I q.1 a.8 reply 2, English Dominican translation.',
 'aristotle-leaf':'Short quotation — Aristotle, Nicomachean Ethics I.1, 1094a, H. Rackham translation.',
 'liberty-leaf':'Two short quotations — Luther, On Christian Liberty (1520), Lambert/Grimm translation, Hanover excerpt §3.',
}
comparisons={'divided-will','cause-and-permission','creation-disagreement','nature-perfected','summa-disputation','water-question','bodily-action-question','embodied-spiritual-rite','ritual-account','sacramental-disagreement','aquinas-sacramental-account','guilt-and-penalty','limits-1517','receiving-not-earning','command-and-promise','works-after-faith','body-not-discarded','freedom-and-service'}
for it in s['items']:
 if not it.get('sources'):continue
 attribution=quotes.get(it['id'])
 if not attribution:
  prefix='Editorial comparison of attributed arguments — ' if it['id'] in comparisons else 'Attributed paraphrase — '
  attribution=prefix+'; '.join(source_names[x] for x in it['sources'])
 if it['id']=='pelagius-quotation':attribution='Attributed paraphrase of Pelagius as quoted by Augustine, On the Grace of Christ I.5; not an independently surviving neutral transcript.'
 it['reading']={'text':it['description'],'attribution':attribution}
s['notes'].append('Reference readings require Item.reading and the intentional manuscript reader. The labels-only baseline cannot expose these excerpts; logical-player descriptions are not browser-equivalent evidence. Stable manuscript claims are retained when used as evidence for a new comparison; only genuinely revised working sheets transform.')
actions=[]
for n,st in enumerate(s['stages']):
 s['checkpoints'].append({'id':f'chapter-{n+1}','label':f'{n+1}. {st["title"]}','actions':list(actions)})
 actions+=routes[n]
s['checkpoints'].append({'id':'complete','label':'Complete journey','actions':actions})
(ROOT/'doctrine-argument-desks-v2-candidate.json').write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n')
(ROOT/'authoring-manifest.json').write_text(json.dumps({'baseline':str(OLD),'chapters':meta,'authoredActions':actions},ensure_ascii=False,indent=2)+'\n')
print(f'{len(s["stages"])} chapters, {len(s["recipes"])} recipes ({sum(len(m["route"]) for m in meta)} core), {len(s["items"])} items')
