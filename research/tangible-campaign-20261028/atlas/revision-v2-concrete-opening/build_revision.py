"""Scoped content experiment; never writes the v1 candidate, trial or runtime."""
from pathlib import Path
import json, copy, hashlib
R=Path(__file__).parent
B=json.loads((R/'base-v1.json').read_text()); S=copy.deepcopy(B)
C=json.loads((R.parent/'chapters.json').read_text())
old_ids={x for c in C[:3] for x in c['created']+c['supplies']}
old_recipes={x for c in C[:3] for x in c['recipes']}
S['items']=[x for x in S['items'] if x['id'] not in old_ids]
S['recipes']=[r for r in S['recipes'] if r['id'] not in old_recipes]
S['id']='atlas-connected-questions-v2-concrete-opening-research'
S['notes'].append('Scoped opening revision after negative blind trial: specific cases, terminal results, and limited evidence-order alternatives. No claim of improved enjoyment until a new trial.')
newitems=[];newrecipes=[];newchapters=[];newstages=[];current=None
def start(n,title,motivation):
 global current
 c=copy.deepcopy(C[n]); c.update(title=title,created=[],supplies=[],recipes=[],earlier=[],goals=[])
 st=copy.deepcopy(B['stages'][n]);st.update(title=title,motivation=motivation,carry=[],objectives=[])
 st['caches'][0]['items']=c['supplies'];current=(c,st);newchapters.append(c);newstages.append(st)
def item(id,label,description,reading=None):
 x={'id':id,'label':label,'description':description,'sources':current[0]['sources']}
 if reading:x['reading']={'text':reading,'attribution':'Authored teaching reconstruction; not a historical quotation.'}
 newitems.append(x)
def supply(id,label,description,reading=None):
 item(id,label,description,reading);current[0]['supplies'].append(id)
def recipe(a,b,out,label=None,description='',transform=None,reading=None,suffix=''):
 if label is not None:item(out,label,description,reading);current[0]['created'].append(out)
 r={'id':'make-'+out+suffix,'a':a,'b':b,'out':out,'description':description,'sources':current[0]['sources'],
 'lifecycle':{x:{'role':'transform' if x==transform else 'retain','reason':'This inscribed surface becomes the resulting record at its own position.' if x==transform else 'This evidence, argument or tool remains a distinct usable reference.'} for x in [a,b]}}
 newrecipes.append(r);current[0]['recipes'].append(r['id']);return r
def goal(id,text,after=None,intermediate=False):
 o={'id':current[0]['id']+'-'+id,'text':text,'kind':'create','item':id}
 if after:o['after']=[current[0]['id']+'-'+after]
 if intermediate:o['intermediate']=True
 current[1]['objectives'].append(o);current[0]['goals'].append(id)

start(0,'The next eclipse watch','The king wants the eclipse report. The watchers need a date to return. A clouded night and an unattended night must not become “nothing happened.”')
supply('clay','Blank tablet for a dated sky report','A blank writing surface.')
supply('stylus','Reed stylus','A reusable writing tool.')
supply('month-counts','Lunar month counts: 1, 7, 13','The counts refer to elapsed lunar months, not repeating month names.', 'For this small invented exercise, number consecutive lunar months 1, 2, 3, and so on. The three entries of interest are in months 1, 7 and 13. These are teaching numbers, not dates transcribed from an ancient tablet.')
supply('night-records','Month 13: eclipse seen; 14: clouded; 15: missed','A particular dated observation dossier.', 'At the full Moon of month 13 an eclipse was seen. Cloud hid the Moon during the relevant watch in month 14. Nobody attended the watch in month 15. The last two entries do not record an uneclipsed Moon.')
supply('older-eclipses','Earlier eclipses: months 1 and 7','Earlier reports of seen lunar eclipses.', 'Both earlier reports describe a seen eclipse. This schematic six-month sample makes subtraction and recurrence visible; it is not a reconstruction of a complete Babylonian prediction algorithm. Actual eclipse opportunities are not a guarantee of a locally visible eclipse.')
supply('next-dates','Future full Moons: months 16, 17, 18, 19','A calendar strip on which a further watch can be marked.')
supply('omen-text','For the king: an eclipse threatens his reign','A fictional omen interpretation, not a physical cause of darkening.', 'This invented omen wording stands for divinatory interpretation. Celestial records and political or religious meaning could coexist in Mesopotamian scholarship. The observer can report what was seen without erasing the interpreter’s concern.')
recipe('clay','stylus','marked-tablet','Ruled tablet for a dated sky report','The writing surface is ruled for entries.',transform='clay')
recipe('marked-tablet','night-records','sky-record','Dated eclipse tablet','The tablet carries the particular observation and the two gaps.',transform='marked-tablet',reading='Month 13: an eclipse was seen. Month 14: the sky was clouded. Month 15: the watch was missed. These are three different records, not three claims that the Moon was uneclipsed.')
recipe('month-counts','stylus','reckoning-table','Month reckoning: 7−1=6; 13−7=6','A numerical reference for the two intervals. The reference survives its astronomical use.')
recipe('sky-record','older-eclipses','matched-records','Seen eclipses: months 1, 7 and 13','The present tablet is placed alongside the two earlier reports.')
recipe('matched-records','reckoning-table','cycle-table','Eclipse watches recur six months apart','The three dated reports support a six-month watching pattern in this schematic case.',reading='The observed entries are separated by six months. This is a reason to appoint another watch, not a claim that every sixth full Moon must produce a visible eclipse. Babylonian eclipse prediction was more elaborate than this exercise.')
recipe('older-eclipses','reckoning-table','earlier-interval','Earlier pair: six months between eclipses','The subtraction is first applied to the two old reports.')
recipe('earlier-interval','sky-record','cycle-table',description='The present month-13 eclipse adds another six-month interval to the older pair.',suffix='-old-pair-first')
recipe('cycle-table','next-dates','watch-calendar','Watch the full Moon in month 19','The next six-month opportunity is marked on the future calendar.')
recipe('sky-record','omen-text','paired-record','King’s report: the eclipse and its omen','The report brings the observed event and its proposed significance to the king; neither is silently substituted for the other.',reading='The tablet reports a seen eclipse in month 13, followed by a clouded watch and a missed watch. The accompanying interpretation warns the king. The report contains both statements without presenting the interpretation as the observation.')
goal('watch-calendar','Mark the next eclipse watch');goal('paired-record','Prepare the king’s report')

start(1,'A dark Moon, two explanations','One speaker says every darkening comes from a cover. Another points to a dying lamp. Meanwhile two accounts of the Moon predict the same next eclipse.')
current[0]['sources']=['aristotle','aristotle-eclipse','greek-transmission']
supply('cause-claim','Every darkening is caused by a cover','A sweeping premise offered by a fictional speaker.', 'The speaker’s universal claim ranges over all darkenings, not only eclipses. It can be put into a valid inference even if that sweeping premise is false. Aristotle’s eclipse discussions supply the setting, not these invented words.')
supply('inference-form','Every A is B; this is A; so this is B','A compact modern rendering of a deductive pattern.', 'This form preserves the conclusion if the premises hold. It does not establish the premises. The letters are modern teaching shorthand for a family of ancient deductive arguments.')
supply('new-case','An uncovered lamp darkens as its oil runs out','A particular case in which darkening occurs without a covering body.')
supply('rival-cause','Earth screens the light—or the Moon itself changes','Two teaching accounts with an agreed eclipse prediction.', 'Aristotle, Posterior Analytics II.8, contrasts possible explanations involving Earth as a screen, lunar rotation, or extinction while discussing the search for a cause. These two simplified speakers and their identical forecast are invented; no real ancient astronomer is credited with this toy predictive model.')
supply('next-watch','Month 19: the Moon darkens; no cause is seen','The observed outcome at the appointed watch.', 'The new watcher records a darkening at the predicted watch. This outcome alone is shared by the two teaching accounts. It neither establishes that all darkening involves a cover nor chooses between those accounts.')
recipe('cause-claim','sky-record','stated-premises','The Moon darkened; every darkening supposedly has a cover','The observed particular and the speaker’s universal premise are now side by side.')
recipe('stated-premises','inference-form','valid-argument','If those premises hold, the Moon had a cover','The inference is valid; its universal premise remains an assertive, challengeable claim.',reading='The form is: every A is B; this is A; therefore this is B. Here A is darkening and B is being caused by a cover. A valid form does not make the speaker’s universal premise true. The same distinction between premises and entailment can be reused with mathematical statements.')
recipe('cause-claim','inference-form','covering-rule','Under that premise, any darkening implies a cover','The rule is arranged before a particular recorded case is supplied.')
recipe('covering-rule','sky-record','valid-argument',description='The recorded lunar darkening instantiates the arranged rule; the conclusion has the same conditional standing.',suffix='-rule-first')
recipe('cause-claim','new-case','counterexample','One uncovered lamp breaks the “every darkening” claim','The single case defeats this universal premise, not all accounts of eclipses.',reading='The lamp darkens without being covered. Thus it contradicts the claim that every darkening is caused by a cover. The reusable argument is that one genuine contrary case defeats an unrestricted universal statement; it need not defeat a narrower claim.')
recipe('rival-cause','watch-calendar','rival-prediction','Both accounts predict a dark Moon in month 19','The rival accounts make the same prediction at the calendar’s appointed watch.')
recipe('rival-prediction','next-watch','underdetermined-case','One observed dark Moon fits both rival accounts','This observation answers the shared prediction; the accounts are still distinct.',reading='Both teaching accounts predicted this same darkening, and it occurred. The observation therefore does not select one account over the other. Another observation could do more if their predictions differ. This case can later help distinguish a successful representation from a uniquely established cause.')
goal('valid-argument','Reconstruct the covering argument');goal('counterexample','Break the “every darkening” claim');goal('underdetermined-case','Compare the eclipse predictions')

start(2,'Make three equal sides','The triangle must have equal sides, not merely look convincing. Two copies disagree over its vertex, and a second sketch claims equality despite lengths 5, 5 and 6.')
supply('straightedge','Straightedge','A reusable tool for joining the constructed points.')
supply('compass','Compass set to length AB','Draws circles with the given segment as radius.')
supply('segment','Segment AB: construct three equal sides','The given side of the desired equilateral triangle.')
supply('circle-definition','Every radius of a circle has the same length','A mathematical premise rather than a ruler measurement.', 'The points of a circle have equal distance from its centre. In the construction, one circle is centred at A with radius AB; the other is centred at B with radius BA. The notation is a compact teaching rendering of Euclid I.1.')
supply('same-length','Lengths equal to AB are equal to each other','The equality premise needed to connect the two circles.')
supply('copy-a','Copy A: circles meet at C; join AC and BC','An invented textual witness with a consistent vertex name.', 'This teaching witness names the intersection C and tells the reader to join AC and BC. It leaves the justification incomplete. It is not an actual ancient manuscript.')
supply('copy-b','Copy B: circles meet at D; join AC and BC','An invented copy with a particular inconsistent vertex name.', 'This teaching witness names the intersection D but then tells the reader to join AC and BC, without defining C. The conflict is a copying problem. Nothing here asserts that renaming all occurrences consistently from C to D would be a geometric error.')
supply('unequal-sketch','“Every equal-looking triangle is equilateral”: sides 5, 5, 6','A claim attached to a sketch with explicitly unequal side lengths.')
recipe('segment','compass','two-circles','Circles centred at A and B, both with radius AB','The two circles provide an intersection C in the Euclidean plane.')
recipe('two-circles','straightedge','triangle-diagram','Triangle ABC: join A and B to the circle intersection','The sides have been drawn from the actual construction.')
recipe('triangle-diagram','circle-definition','equal-radii','AC=AB in one circle; BC=AB in the other','The construction, not the sketch’s apparent proportions, warrants these equalities.')
recipe('equal-radii','same-length','triangle-premises','AC=AB and BC=AB; equal to one length means equal','The equalities and the equality premise are assembled.')
recipe('triangle-premises','valid-argument','geometrical-proof','AC=AB=BC: the constructed triangle has three equal sides','The mathematical conclusion follows from the specified premises.',reading='Each circle has radius AB. Thus AC equals AB, and BC equals AB. Since both equal AB, all three sides are equal. This reconstructs the core of Euclid I.1 in the Euclidean plane, not a claim that every later foundation of geometry leaves its assumptions unchallenged.')
recipe('unequal-sketch','counterexample','proof-conditions','The 5–5–6 triangle defeats “equal-looking means equilateral”','A genuine contrary case overturns the sketch’s universal claim, not the circle construction.')
recipe('copy-a','copy-b','variant-table','One copy says C; the other leaves C undefined','The exact disagreement remains visible.')
recipe('variant-table','triangle-diagram','critical-text','C restored at the intersection; the D reading is recorded','The construction supplies the missing referent without concealing the rival reading.',reading='At the circles’ intersection the edited teaching text uses C, so its instructions to draw AC and BC have a defined endpoint. The alternate D reading is recorded alongside the repair. Consistently renaming the point would also preserve the geometry; this particular copy had not done so.')
recipe('critical-text','geometrical-proof','proof-roll','Triangle proof: three equal sides, vertex C restored','The completed roll contains the construction, its proof, and the particular repaired reading.')
goal('proof-conditions','Expose the unequal sketch');goal('proof-roll','Complete the triangle proof')

S['items']=newitems+S['items'];S['recipes']=newrecipes+S['recipes'];S['stages']=newstages+S['stages'][3:]
C=newchapters+C[3:]
# A removed abstract artifact is not silently retained as an invisible prerequisite.
remaps=[]
for r in S['recipes'][len(newrecipes):]:
 for side in ['a','b']:
  if r[side]=='open-question':
   r[side]='underdetermined-case';r['lifecycle']['underdetermined-case']=r['lifecycle'].pop('open-question')
   remaps.append({'recipe':r['id'],'from':'open-question','to':'underdetermined-case','reason':'The actual rival-explanation case supplies the distinction between one successful account and a uniquely settled account.'})
S['sources'].append({'id':'aristotle-eclipse','title':'Aristotle, Posterior Analytics II.2 and II.8','url':'https://classics.mit.edu/Aristotle/posterior.2.ii.html','note':'Primary text distinguishes the observed eclipse from inquiry into its cause, including Earth screening, rotation or extinction. The game dialogue and identical predictions are invented.'})
owners={x:c['id'] for c in C for x in c['created']}; positions={c['id']:i for i,c in enumerate(C)}
rs={r['id']:r for r in S['recipes']};edges=[]
oldedges=json.loads((R.parent/'connections.json').read_text())
for c,st in zip(C,S['stages']):
 local=[rs[id] for id in c['recipes']]
 st['carry']=sorted({x for r in local for x in [r['a'],r['b']] if not x.startswith('@')}|set(c['goals']))
 c['earlier']=sorted({x for r in local for x in [r['a'],r['b']] if x in owners and positions[owners[x]]<positions[c['id']]})
 for r in local:
  for x in [r['a'],r['b']]:
   if x not in c['earlier']:continue
   old=next((e for e in oldedges if e['to']==c['id'] and e['item']==x and e['recipe']==r['id']),None)
   edges.append(old or {'from':owners[x],'to':c['id'],'item':x,'recipe':r['id'],'relation':'pedagogical_reuse','sources':c['sources'],'claim':'The player-created case or argument performs real work here; no direct historical transmission of these invented objects is asserted.'})
for name,val in [('scenario.json',S),('chapters.json',C),('connections.json',edges),('downstream-remaps.json',remaps)]:
 (R/name).write_text(json.dumps(val,ensure_ascii=False,indent=2)+'\n')
pilot=copy.deepcopy(S);pilot['id']='atlas-connected-opening-v2-research';pilot['stages']=pilot['stages'][:3]
ids={x for c in C[:3] for x in c['created']+c['supplies']};rids={x for c in C[:3] for x in c['recipes']}
pilot['items']=[x for x in pilot['items'] if x['id'] in ids];pilot['recipes']=[r for r in pilot['recipes'] if r['id'] in rids];pilot['locations']=[]
(R/'opening-arc.json').write_text(json.dumps(pilot,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'chapters':len(C),'recipes':len(S['recipes']),'openingRecipes':len(newrecipes),'remaps':remaps},indent=2))
