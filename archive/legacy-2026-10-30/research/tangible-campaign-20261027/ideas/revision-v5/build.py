import json,pathlib,copy
P=pathlib.Path(__file__).parent;s=json.loads((P/'baseline-v4.1.json').read_text());rs={r['id']:r for r in s['recipes']};its={i['id']:i for i in s['items']};sts={x['id']:x for x in s['stages']}
def describe(kind,text,label=None):
 its[kind]['description']=text
 if label:its[kind]['label']=label
 for r in s['recipes']:
  if r.get('out')==kind:r['description']=text
# One levy argument from initial claim through inference, and a different question about its fairness.
levy={
'claim':"The speaker says: ‘The levy takes ten coins from every household, so every household bears the same burden.’",
'reason':"The proposed justification is: ‘The amount is identical: ten coins per household.’",
'stated-assumptions':"Hidden premise: ‘Whenever households pay equal amounts, they bear equal burdens.’ Does this premise survive unequal incomes?",
'inference-rule':"Use this pattern on the levy: ‘If equal payments imply equal burdens, and these payments are equal, then these burdens are equal.’ Test the form separately from the first premise.",
'general-claim':"‘Every equal payment imposes an equal burden.’ This is exactly the levy argument's hidden premise, not a new claim.",
'contrary-case':"Mira has twenty coins for the month; Daro has two hundred. A ten-coin levy takes half of Mira's money but one twentieth of Daro's.",
'argument':"The levy argument connects an equal ten-coin charge to equal burden. The connection is now explicit enough to challenge without changing the subject.",
'explicit-premises':"Premise1: equal payments imply equal burdens. Premise2: each household pays ten coins. Conclusion: each household bears equal burden. The first premise is doing the disputed work.",
'valid-argument':"Given those two levy premises, the conclusion follows in this supplied conditional form. But valid form cannot rescue a false premise: equal coin amounts may not mean equal burdens.",
'counterexample':"Mira loses50% of her monthly money; Daro loses5%. Under a proportional-burden meaning, the equal-burden premise fails—even though the argument's conditional form was valid.",
'word':"‘Equal’ is the levy speaker's pivotal word. Equal amounts and equal burdens are not interchangeable.",
'competing-meanings':"‘Equal amount’ means ten coins each. ‘Equal proportional burden’ compares each payment with the household's money. Neither phrase alone settles what justice requires.",
'disambiguated-term':"The ten-coin levy establishes equal amounts, not equal proportional burdens. The clarified language keeps a moral disagreement from hiding inside one word.",
'precise-question':"Should this levy aim at equal amounts, equal shares of available money, or another principle? The argument about fairness can now begin without pretending the arithmetic settled it."}
for k,v in levy.items():describe(k,v)
# Ask about this levy claim, not the opening experiment's concrete pot question.
rs['argument-07']['b']='claim'
sts['argument']['motivation']="The levy speaker wants ten coins from every household. Mira has twenty coins for the month; Daro has two hundred. Show which part of the argument follows, and which claim their circumstances challenge."
sts['argument']['completionText']="Debate host: ‘We have not chosen a tax. We have learned why a sound inference can carry an unsound premise. Now the library needs that same care with words.’"
# Invented witnesses; never put fictional readings into an actual ancient text.
text={
'manuscript-copy':"Invented witness A: ‘At dusk, the keeper opened the gate for the travelers.’ The manuscript has a later marginal note: ‘opened = admitted’. These words are authored for this exercise, not an ancient quotation.",
'variant-manuscript':"Invented witness B: ‘At dusk, the keeper barred the gate for the travelers.’ Elsewhere B shares A's unusual doubled ‘the the’; a marginal note says a later scribe consulted another copy.",
'passage-lemma':"The identifying quotation is ‘At dusk, the keeper…’. It anchors the disputed passage without giving this reconstructed ancient commentary modern line numbers.",
'scribal-patterns':"A and B both repeat ‘the the’ in another sentence. That shared slip suggests a connection, but B's note about consulting a third copy warns against a simple family tree.",
'damaged-passage':"Invented witness C reads ‘At dusk, the keeper [gap] the gate for the travelers.’ Its following sentence says ‘They waited outside until morning’; that favors one reading but does not rule out every lost context.",
'uncertainty-marks':"Square brackets mark a supplied reading: ‘[barred?]’. The question mark remains visible; it is not part of the imaginary original manuscript.",
'foreign-passage':"Invented exercise passage: ‘The keeper kept the charge.’ Here ‘charge’ might mean a fee, a responsibility, or a person entrusted to the keeper. This is an English stand-in for a translation problem, not a claim about Greek vocabulary.",
'bilingual-glossary':"Exercise glossary: charge→fee; charge→duty; charge→person in someone's care. Several possible renderings remain; a word list cannot choose among them.",
'keeper-context':"For this translation exercise, the next sentence reads: ‘No coins changed hands; the child slept safely under the keeper's roof.’ Elsewhere, use a passage's own surrounding evidence rather than this particular sentence.",
'collation':"A says ‘opened’; B says ‘barred’; damaged C preserves a gap. The disagreement concerns an action with opposite consequences, not merely spelling.",
'variant-table':"Under the lemma ‘At dusk, the keeper…’, the alternatives remain side by side. A reader can see both the difference and the evidence used to discuss it.",
'textual-family':'PLACEHOLDER'}
# Complete separately to keep literal passages easy to audit.
text.pop('textual-family',None)
text['textual-family']="The shared doubled word suggests copying or a common source. But B consulted another copy: this modern curator's tentative family diagram must allow borrowing, not pretend every text has one clean parent."
text['reconstructed-reading']="C's ‘They waited outside until morning’ makes ‘barred’ a plausible restoration. A's contrary reading still exists, so the supplied word is a reasoned conjecture, not recovered certainty."
text['critical-text']="The edited passage reads ‘At dusk, the keeper [barred?] the gate for the travelers.’ Brackets and a question mark prevent the restoration from posing as untouched evidence."
text['critical-edition']="The edition prints the tentative reading and retains ‘opened’ from A in its notes. Another editor can disagree without losing sight of the surviving witnesses."
text['draft-translation']="The glossary initially allows ‘kept the fee’, ‘kept the duty’ or ‘kept the person in their care’. A fluent choice made now would still outrun the evidence."
text['annotated-translation']="No coins changed hands, and a child slept safely nearby. ‘Kept the person in their care’ best fits this invented context; the note records why ‘fee’ was rejected rather than pretending the dictionary had one answer."
text['parallel-edition']="The passage, alternatives and contextual translation are visible together. Readers can retrace why ‘barred’ remains tentative while the child—not a fee—is the better-supported sense of ‘charge’."
s['items'].append({'id':'keeper-context','label':'Keeper passage context','description':text['keeper-context']})
its['keeper-context']=s['items'][-1]
sts['texts']['caches'][0]['items'].append('keeper-context')
rs['texts-08']['b']='keeper-context'
for k,v in text.items():describe(k,v)
describe('foreign-passage',text['foreign-passage'],'Ambiguous exercise passage')
describe('bilingual-glossary',text['bilingual-glossary'],'Candidate translations')
sts['texts']['motivation']="One copy says the keeper opened the gate; another says barred. A damaged copy leaves a gap. Preserve an inspectable edition and translate a second ambiguous passage without concealing your reasons."
sts['texts']['completionText']="Editor: ‘We have not made disagreement disappear. We have made the readings and our choices inspectable. The next collection asks whether an unknown number can be handled with the same openness.’"
sts['texts']['caches'][0]['narrative']="A clearly labeled invented teaching dossier: three conflicting keeper passages, copying notes, a damaged line and an ambiguous sentence with contextual evidence. None is quoted from a real ancient source."
# Legitimate alternatives: the supplies already carry a concrete light/drying question.
describe('question',"Does the sunnier pot lose water faster because of its light exposure? The question suggests a possible explanation without establishing it.")
describe('prediction',"Under otherwise matched conditions, the more brightly lit pot should lose more water if the proposed explanation is right.")
for rid,a,b,out,desc in [
 ('ask-11','observation','question','hypothesis','The observed difference and the explicit light-exposure question suggest the same hypothesis as the longer note-and-pattern route. This is a candidate explanation, not proof.'),
 ('ask-12','question','prediction','testable-question','The explicit question and a prediction together specify a testable question. You need not manufacture an intermediate label before this connection is recognized.')]:
 s['recipes'].append({'id':rid,'a':a,'b':b,'out':out,'description':desc,'sources':[],'caveat':'Authored teaching example. Alternative route to the same unique discovery, not an extra mandatory creation.'})
sts['ask']['completionText']="Archive keeper: ‘Now someone else can try what we did—and disagree with the result. Bring that habit to the next debate; leave the pots here.’"
s['recipes'].append({'id':'texts-10','a':'foreign-passage','b':'keeper-context','out':'annotated-translation','description':text['annotated-translation'],'sources':['alexandria'],'caveat':'Invented modern translation exercise. The given ambiguity and context permit this shorter route; no dictionary step is artificially required.'})
# Recompute only current-scene allowlists. Existing supplied objects are unchanged.
for st in s['stages']:
 local=[r for r in s['recipes'] if r['id'].startswith(st['id']+'-')]
 st['carry']=sorted({x for r in local for x in(r['a'],r['b']) if not x.startswith('@')}|{o['item'] for o in st['objectives']})
s['id']='atlas-of-questions-v5';s['notes'].append('Revisionv5 keeps one levy example, provides invented manuscript evidence before synthesis, and recognizes two natural opening shortcuts. Route count is recomputed without protecting length.')
(P/'scenario.json').write_text(json.dumps(s,indent=2)+'\n')
