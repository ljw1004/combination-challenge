from pathlib import Path
import json,hashlib,copy,difflib
P=Path(__file__).resolve().parent;PRIOR=P.parent/'plain-language-prototype-20261028';LIVE=Path('/workspace/shared/combination-fork-recovery-20261028')
basepath=PRIOR/'selective-candidate.json';base= json.loads(basepath.read_text());d=copy.deepcopy(base)
d['id']='doctrine-language-compact-local-20261028'
raw='''enchiridion-leaf|A healed wound does not move into another body
wound-notes|The body remains, but its health is damaged
cure-notes|The wound heals; the body regains health
broken-vessel|Still clay, but the cracked jar cannot hold water
human-choice|Imagine taking your friend’s share for your own comfort
lesser-good|Augustine: comfort is good; stealing a friend’s share is not
created-goodness|Genesis calls creation “very good”
evil-substance-objection|Is the wound an extra evil thing inside the body?
missing-health|The wound is lost health, not an extra thing
no-evil-substance|The wound is damage, not a separate evil thing
chosen-attachment|My comfort comes before my friend’s fair share
misdirected-will|The selfish choice is wrong; being injured is not
 evil-as-loss|Augustine: evil is damage within something good
augustine-account|Augustine: good things can suffer damage or be used wrongly
romans-leaf|Paul: “The good that I would I do not”
instruction-account|Pelagius, through Augustine: God gives ability and teaching
inward-grace|Augustine: God helps us love good, not just know it
infant-baptism|Augustine’s church baptizes babies for forgiveness
adams-fall|Augustine believes Adam’s sin affects later generations
command-not-cure|Augustine asks: is ability plus teaching enough?
grace-heals-will|Augustine: God helps us love and choose good
infant-question|Why forgive a baby before any deliberate wrongdoing?
inherited-condition|Augustine: infants need forgiveness for inherited sin
wounded-will|Augustine: human nature is damaged, not an evil thing
augustine-grace-answer|Augustine: God forgives sin and helps people choose good
two-trees|“A good tree cannot bring forth evil fruit”
material-world|Bodies suffer injury, decay and death. Why?
foreknowledge-question|Why create beings you know will go wrong?
watcher-analogy|An opponent: watching someone does not make them walk
evil-maker|Two Principles: harmful creation needs an opposing evil source
first-cause-challenge|Two Principles: the watcher did not make the walker
creation-disagreement|Augustine: damaged good. Two Principles: an opposing evil source
agency-and-origin|Blaming the choice leaves the maker’s responsibility open
knowing-not-causing|The opponent replies: watching does not force the walker
metaphysics-objection|Objection: why add God’s teaching if philosophy studies God?
salvation-end|Aquinas: life with God exceeds what reason alone can discover
known-destination|To direct our lives, we need to know our goal
reason-limits|Aquinas: studying God does not mean knowing everything
philosophical-inquiry|Can philosophy show the goal we should live towards?
reason-and-revelation|Aquinas: God must reveal the goal we cannot discover
reason-serving-theology|Aquinas: God’s teaching adds what reasoning cannot discover
nature-perfected|Both accounts: helped by God, people still choose or reason
fire-water|Aquinas: fire can work well yet harm water
aquinas-tree|Aquinas: the good tree means wanting and choosing rightly
aquinas-evil-answer|Aquinas: causing harm does not prove something is evil
aquinas-tree-answer|Aquinas: tree means choice. Two Principles: source of creation'''
labels={line.split('|',1)[0].strip():line.split('|',1)[1] for line in raw.splitlines()};assert len(labels)==46
# Paragraph breaks separate explanation from epistemic/historical limits; no new UI behavior.
breaks={
'enchiridion-leaf':'The example helps explain',
'lesser-good':'The example is ours',
'created-goodness':'Watching a wound heal',
'missing-health':'This does not mean',
'no-evil-substance':'So far, this answers',
'misdirected-will':'His account locates',
'evil-as-loss':'The wound illustrates',
'augustine-account':'This is his proposed account',
'romans-leaf':'The verse is from',
'instruction-account':'We hear Pelagius',
'inward-grace':'The person still wants',
'infant-baptism':'The question is how',
'adams-fall':'This is his religious account',
'command-not-cure':'This reconstructs his objection',
'grace-heals-will':'The person still does',
'infant-question':'The question does not accuse',
'inherited-condition':'The baptismal practice alone',
'wounded-will':'This is not the claim',
'augustine-grace-answer':'These are his connected claims',
 'two-trees':'That step is an interpretation',
 'material-world':'Observing harm raises',
 'foreknowledge-question':'This is the writer’s challenge',
 'watcher-analogy':'The writer will question',
 'evil-maker':'This is his interpretation',
 'first-cause-challenge':'The challenge alone',
 'creation-disagreement':'This is a comparison',
 'agency-and-origin':'The game brings',
 'knowing-not-causing':'But the observer',
 'metaphysics-objection':'This is an objection',
 'salvation-end':'That is a theological',
 'known-destination':'This explains why',
 'reason-limits':'We still need',
 'philosophical-inquiry':'That does not yet decide',
 'reason-and-revelation':'This answer depends',
 'reason-serving-theology':'Philosophy need not',
 'nature-perfected':'This comparison does not',
 'fire-water':'This is his example',
 'aquinas-tree':'Aquinas explicitly cites',
 'aquinas-evil-answer':'It does not solve',
 'aquinas-tree-answer':'Simply quoting the verse',
}
for i in d['items']:
 if i['id'] not in labels:continue
 i['label']=labels[i['id']]
 if 'reading' in i and i['id'] in breaks:
  old=i['reading']['text'];before=breaks[i['id']];assert before in old
  i['reading']['text']=old.replace(' '+before,'\n\n'+before,1)
  i['description']=i['reading']['text']
 if i['id']=='reason-serving-theology':i['reading']['attribution']='Reconstructed answer to an objection in Aquinas’s text — Summa I q.1 a.1, reply 2; not a recorded student conversation.'
stages={s['id']:s for s in d['stages']}
stages['augustine-grace']['motivation']='A person knows the good and still fails to do it. An infant is brought for forgiveness before making a choice. Augustine must answer both, without turning the human creature into something evil.'
next(o for o in stages['augustine-grace']['objectives'] if o['id']=='grace-infant-remission')['text']='Explain why Augustine thinks an infant needs forgiveness'
next(o for o in stages['two-principles']['objectives'] if o['id']=='opposed-maker-goal')['text']='Explain the argument for an evil source'
stages['aquinas-reason']['motivation']='An objection in Aquinas’s text asks why teaching believed to come from God is needed if philosophy already studies God. Meanwhile, the earlier argument for separate sources of good and evil faces a physical example and a rival reading of the good tree. Try Aquinas’s answers without treating the questions as settled.'
next(o for o in stages['aquinas-reason']['objectives'] if o['id']=='reason-answer')['text']='Explain why Aquinas thinks teaching from God is needed'
next(o for o in stages['aquinas-reason']['objectives'] if o['id']=='fire-answer')['text']='Test separate sources of good and evil against Aquinas’s fire example'
(P/'compact-candidate.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
(P/'authored-compact-labels.json').write_text(json.dumps(labels,ensure_ascii=False,indent=2)+'\n')
(P/'paragraph-breaks.json').write_text(json.dumps(breaks,ensure_ascii=False,indent=2)+'\n')
# Snapshot input bytes rather than overwrite any already reviewed predecessor.
(P/'selective-predecessor.json').write_bytes(basepath.read_bytes())
source=LIVE/'experiments/tangible-campaign/ui/campaigns/doctrine-images-cases.ts'
(P/'live51-doctrine-source.ts').write_bytes(source.read_bytes())
# A standalone proposed module and unified replacement patch. Not installed; root owns route/archive integration.
module="import type {Scenario} from '../../schema/scenario.ts';\n\n/** Plain-language opening; isolated successor. Logical and independent wording checks are not human UI evidence. */\nexport const scenario: Scenario = "+json.dumps(d,ensure_ascii=False,indent=2)+";\n"
(P/'doctrine-images-cases.ts').write_text(module)
diff=''.join(difflib.unified_diff(source.read_text().splitlines(True),module.splitlines(True),fromfile='a/experiments/tangible-campaign/ui/campaigns/doctrine-images-cases.ts',tofile='b/experiments/tangible-campaign/ui/campaigns/doctrine-images-cases.ts'))
(P/'doctrine-compact-against-live51.patch').write_text(diff)
manifest={str(f):hashlib.sha256(f.read_bytes()).hexdigest() for f in PRIOR.rglob('*') if f.is_file()}
manifest[str(source)]=hashlib.sha256(source.read_bytes()).hexdigest()
(P/'protected-inputs.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Candidate',hashlib.sha256((P/'compact-candidate.json').read_bytes()).hexdigest(),len(labels),'heads')
