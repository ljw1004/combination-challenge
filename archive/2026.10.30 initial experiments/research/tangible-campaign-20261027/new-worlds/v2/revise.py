import json,pathlib,hashlib
P=pathlib.Path(__file__).parent; old=P.parent
names=['food','theology','causation','literature','chinese-thought','restoration','shoreline']
S={n:json.loads((old/(n+'.json')).read_text()) for n in names}
def descriptions(n,d):
 for it in S[n]['items']:
  if it['id'] in d:it['description']=d[it['id']]
def recipe(n,id,text):next(r for r in S[n]['recipes'] if r['id']==id)['description']=text
def label(n,id,text):next(i for i in S[n]['items'] if i['id']==id)['label']=text
# Describe what the player actually reads; all verse below is newly written for this game.
poems={
 'first-draft':'The train is gone. I listen to the station. I remember a goodbye.',
 'station-poem':'The rails hum after you have gone.\nThe empty platform keeps your name.',
 'enjambed-poem':'The rails hum after you\nhave gone. The empty platform\nkeeps your name.',
 'refrain-poem':'The rails hum after you\nhave gone. Stay a while.\nThe empty platform keeps your name.\nStay a while.',
 'revised-poem':'The rails hum after you\nhave gone. Stay a while.\nThe platform holds your name.\nStay a while.'}
descriptions('literature',{
 'station-sounds':'Wheels click over a joint; after the train leaves, a low note lingers in the rails.',
 'departure-board':'The last destination blinks away. One unlit row remains.',
 'sound-notes':'An observation: the rails keep humming after the train has gone.',
 'departure-sketch':'An empty platform, with one name written below it.',
 'memory':'Someone has gone. You find yourself asking them to stay.',
 'line-break':'Try ending the first line after “you”, before the sentence is finished.',
 'refrain':'Let “Stay a while” return twice: once addressed to the traveller, once to the memory.',
 'reading-aloud':'Reading aloud, the editor catches the long third line. Try “The platform holds your name.”',
 **poems,
 'type-form':'The revised poem is set in movable type, ready for ink.',
 'inked-form':'Ink touches the raised letters, ready to leave their mirror image on paper.',
 'printed-booklet':'The printer presses the poem onto sheets, then folds them into this little book.\n\n'+poems['revised-poem'],
 'chapbook':'Your station poem, stitched into a small book.\n\n'+poems['revised-poem']})
recipe('literature','enjambed-poem','The sentence now continues beyond “you” and “platform” across line endings. The change delays what follows; it need not be better.')
recipe('literature','refrain-poem','“Stay a while” returns, turning a request into a refrain.')
recipe('literature','revised-poem','The spoken test shortens the third line. This is one editorial choice, not the correct poem.')
recipe('literature','printed-booklet','The printer inks and presses the type onto sheets before folding the printed sheets. These workshop steps are compressed into this action.')
S['literature']['stages'][1]['motivation']='Try holding the sentence over a line ending, then let “Stay a while” return. Read each version; make the revised poem for our little press.'
S['literature']['sources'].append({'id':'enjambment-poets','title':'Academy of American Poets: Enjambment','url':'https://poets.org/glossary/enjambment','note':'Definition checked. All verse in this scenario is original, not drawn from the examples on this page.'})
# Specific contrasting claims, and a fictional difficult case rather than an empty counterexample.
descriptions('chinese-thought',{
 'well-account':'Imagine suddenly seeing a child about to fall into a well. Mencius asks about the immediate alarm and concern, apart from seeking a reward. Concern is not a guarantee of rescue.',
 'question-card':'Where might moral concern begin: a feeling already stirring in us, or conduct learned through practice?',
 'compassion-question':'Why feel concern for a child you do not know, before calculating any advantage?',
 'compassion-notes':'Concern can appear before calculation. Does it need cultivation to become dependable care?',
 'mencius-reading':'A Mencian reading: an incipient concern can be cultivated, like a sprout. A beginning is not finished virtue; practice still matters.',
 'ritual-text':'A Xunzian question: how do taught forms and deliberate practice shape conduct?',
 'practice-record':'A fictional pupil learns to wait, take turns and attend to others through repeated practice—not a claim that manners alone make a person good.',
 'music-example':'A shared musical practice asks each participant to listen and adjust to others.',
 'ritual-notes':'Practice can reshape habits rather than merely express whatever impulse arrives first.',
 'cultivation-reading':'A Xunzian reading: teachers, ritual and deliberate effort form better habits. Good conduct is cultivated, not secured by following every impulse.',
 'paired-readings':'Both accounts require cultivation. They differ over how to understand its beginnings and the role of learned forms.',
 'comparison-sheet':'Compare the source of concern, the work of practice, and what each account would say when conduct falls short.',
 'comparison-table':'Mencian emphasis: nurture beginnings of concern. Xunzian emphasis: form conduct through learned practice. Neither says improvement happens without effort.',
 'counterexample':'Our fictional pupil feels alarm at the well but freezes. Another has no strong feeling yet follows a practised rescue procedure. What does either case tell us about moral cultivation?',
 'open-question':'A feeling can fail to become action; trained conduct can occur without a strong feeling. Which account better explains what these pupils need next?',
 'teacher-response':'Our fictional teacher: do not declare a winner from two imagined cases. Ask what would make concern and considerate action more dependable over time.',
 'seminar-record':'The question remains open: what must be nurtured, what must be learned, and how would we tell? The comparison is preserved rather than blended into a third doctrine.',
 'school-manuscript':'Two accounts of cultivation, one difficult case. A sudden feeling and a learned action can come apart. The school leaves that tension visible for its next discussion.',
 'mourning-commentary':'In the Xunzi tradition, ritual gives grief a shaped expression. This does not claim every person or culture must grieve through the same forms.'})
S['chinese-thought']['stages'][0]['motivation']='Why might someone feel concern before thinking of a reward? Make a reading of the well story.'
S['chinese-thought']['stages'][2]['motivation']='One pupil feels alarm but freezes; another follows a practised rescue procedure without strong feeling. Preserve the difficult question in a school manuscript. We need not settle it today.'
S['chinese-thought']['sources'].append({'id':'mencius-context','title':'Stanford Encyclopedia of Philosophy: Mencius','url':'https://plato.stanford.edu/entries/mencius/','note':'Independent authenticity reviewer checked the 2A6 context; direct reader fetch failed during v2 editing. No historical rescue incident is asserted.'})
S['chinese-thought']['notes'].append('The freezing pupil and trained responder are original hypothetical examples, not examples attributed to Mencius or Xunzi. This comparison is intentionally selective, not a comprehensive account of either thinker.')
# The same map, already stable; no wet artifact enclosure implied.
S['restoration']['premise']='An original museum story: a conservator has already dried and stabilized a flood-damaged map. Document it, protect it, and tell its story without erasing the damage. Not instructions for treating a real collection.'
S['restoration']['stages'][0]['motivation']='Our conservator has dried and stabilized this map. Before we display it, make a record of its condition.'
descriptions('restoration',{
 'damaged-map':'The same dry, stabilized map will stay with us through housing and display. Its old water marks remain part of its history.',
 'map-measurements':'Dimensions recorded beside the supported map, without pressing a ruler onto its fragile surface.',
 'documented-map':'The map with its condition record. Recording the damage has not repaired or replaced it.',
 'supported-map':'The same map rests on a suitable rigid support, reducing the need to handle the sheet itself.',
 'housed-map':'The supported map has a protective enclosure. It was dry and stabilized before housing.',
 'archive-letter':'A fictional letter says its writer carried a map on this journey. It is a clue, not conclusive proof that this is that map.',
 'provenance-note':'The letter may connect this map with a journey. The note records that attribution and its uncertainty, not a proven chain of ownership.',
 'exhibition-label':'This flood-marked map may have travelled with the letter’s writer. The association remains uncertain.',
 'protected-display':'The same supported map is displayed under controlled low light; preservation does not make its past disappear.',
 'map-exhibit':'A map, its scars and an honestly qualified story. The label preserves uncertainty as well as provenance.'})
recipe('restoration','map-measurements','The conservator records dimensions beside the supported sheet without pressing the ruler onto its surface.')
# A bounded physical module stays the same sort of thing before and after placement.
label('shoreline','planted-edge','Planted coir module')
descriptions('shoreline',{'marsh-plugs':'Native marsh seedlings grown in nursery trays. Several weeks of nursery care pass in this fictional step.','coir-roll':'A bounded coir roll prepared for this sheltered-bank project.','planted-edge':'A small planted coir module that can be carried to the bank. It is not a portable shoreline.','seasonal-photos':'Photographs from a later season document what happened; the act of making a report does not establish that the intervention succeeded.','season-report':'A record for continued assessment, not a certificate that the shoreline is restored.'})
recipe('shoreline','marsh-plugs','Nursery time passes as the native seedlings establish. Biological growth is compressed, not instantaneous.')
recipe('shoreline','planted-edge','Nursery-grown marsh plugs are established in a bounded coir module. Placement installs that same module at the sheltered bank.')
S['shoreline']['stages'][1]['motivation']='Our survey supports native marsh plants here. Set the planted coir module at the Sheltered bank.'
S['shoreline']['stages'][1]['objectives'][0]['text']='Place the planted coir module at the Sheltered bank.'
S['shoreline']['notes']=[n for n in S['shoreline']['notes'] if 'portable model' not in n]
# Visible interpretive captions for the already sound minis.
descriptions('causation',{'material-exhibit':'Timber: what this boat is made from.','form-exhibit':'The hull’s organized structure: what makes these parts a boat of this kind. The drawn plan represents that form; it is not the entire explanation.','maker-exhibit':'The builder’s skilled making: the source of the boat’s coming-to-be.','purpose-exhibit':'Ferrying people across the water: the end for which this boat was made. A purpose explains its design; it does not physically push the timber.'})
for r in S['theology']['recipes']:
 if r.get('description'):descriptions('theology',{r['out']:r['description']})
label('food','lactic-culture','Yogurt starter')
label('food','twinkie','Twinkie-style snack cake')
S['food']['stages'][-1]['motivation']='Now a bakery wants its little sponge cake to travel. Make the filled, wrapped snack cake. Our last stop is a Twinkie-style cake, not a verdict that later food is better.'
S['food']['stages'][-1]['objectives'][0]['text']='Make the wrapped Twinkie-style snack cake.'
for src in S['food']['sources']:
 if src['id']=='humors':src['url']='https://www.nlm.nih.gov/exhibition/shakespeare-and-the-four-humors/index.html'
for n,s in S.items():
 s['notes'].append('Version2: item descriptions provide inspectable semantic content. Same recipe graph and checkpoints as v1; new text does not constitute human fun validation.')
 (P/(n+'.json')).write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n')
print('Wrote seven v2 copies; no original scenario modified.')
