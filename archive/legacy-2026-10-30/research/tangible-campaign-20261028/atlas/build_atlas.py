"""New connected candidate; does not modify any existing game or engine."""
from pathlib import Path
import json, re
ROOT=Path(__file__).parent
registry={x['id']:x for x in json.load(open(ROOT/'source-registry.json'))}
registry.update({
 'lyell-darwin':{'id':'lyell-darwin','title':'Darwin Correspondence Project: Charles Lyell','url':'https://darwin-editorial.darwinproject.ac.uk/charles-lyell','note':'Documented geological influence with continuing disagreement, not blanket acceptance.'},
 'wallace-1858':{'id':'wallace-1858','title':'Darwin Correspondence Project: Writing Origin','url':'https://darwinproject.ac.uk/writing-origin','note':'Wallace’s independent 1858 work and joint presentation; not a single-contributor story.'},
 'ratdolt':{'id':'ratdolt','title':'Smithsonian Libraries: 1482 printed Latin Euclid','url':'https://library.si.edu/digital-library/book/preclarissimusl00eucl','note':'A specific printed geometric text and its Arabic–Latin lineage; no universal sole-transmission claim.'},
 'vesalius-print':{'id':'vesalius-print','title':'Becker Medical Library: Vesalius in Italy and the Fabrica','url':'https://beckerexhibits.wustl.edu/legacy-exhibits/vesalius/italy.html','note':'The production and printing of the 1543 Fabrica connected anatomical images, woodblocks and readers.'},
 'cuneiform':{'id':'cuneiform','title':'Eleanor Robson: Digital Corpus of Cuneiform Mathematical Texts','url':'https://oracc.museum.upenn.edu/dccmt/','note':'Scribal arithmetic and numerical records; game quantities are invented, not translated tablets.'},
 'aristotle':{'id':'aristotle','title':'Aristotle: Prior Analytics, translated primary text','url':'https://classics.mit.edu/Aristotle/prior.html','note':'Ancient syllogistic; modern symbolic notation and toy examples are explanatory reconstructions.'},
 'euclid':{'id':'euclid','title':'Euclid: Elements, David Joyce edition','url':'https://mathcs.clarku.edu/~djoyce/elements/','note':'Greek mathematical text in a modern explanatory edition. Diagram alone is not proof.'},
 'fibonacci':{'id':'fibonacci','title':'MacTutor: Leonardo Pisano Fibonacci','url':'https://mathshistory.st-andrews.ac.uk/Biographies/Fibonacci/','note':'Liber abaci (1202) and learning arithmetic in North Africa; not invention of Indian numerals.'},
 'kepler':{'id':'kepler','title':'Museo Galileo: Kepler, Ad Vitellionem paralipomena','url':'https://brunelleschi.imss.fi.it/genscheda.asp?appl=MAM&chiave=900026&lingua=ENG&xsl=sezione','note':'Kepler revises inherited optics; telescope observation alone did not uniquely prove heliocentrism.'},
 'boole':{'id':'boole','title':'George Boole: An Investigation of the Laws of Thought (1854)','url':'https://www.gutenberg.org/ebooks/15114','note':'Primary historical text; binary gate notation is a modern teaching representation.'},
 'malthus':{'id':'malthus','title':'Thomas Malthus: Essay on the Principle of Population, 1798','url':'https://www.econlib.org/library/Malthus/malPop.html','note':'The ratios are Malthus’s argumentative model, not a universal empirical law or moral instruction.'},
 'graunt':{'id':'graunt','title':'John Graunt: Natural and Political Observations on the Bills of Mortality, 1662','url':'https://wellcomecollection.org/works/sds578rr','note':'Primary text for population tabulation. Historical cause labels have uncertainty.'},
})
S={'schemaVersion':1,'id':'atlas-connected-questions-v1-research','title':'Atlas of Questions','premise':'Follow records, arguments and instruments as they are translated, challenged and put to new work—then combine them into explicitly speculative future laboratories, shared memories and living cities. Historical chapters are dated teaching reconstructions, not an inevitable march toward truth; the future inventions are fiction, not forecasts.','items':[],'locations':[],'initialItems':[],'recipes':[],'stages':[],'sources':[],'notes':['Research candidate, new identity; old campaign and saves remain untouched.','One chronological route with braided returns; no new UI and no carried-item explanatory paragraphs.','All recipe examples are authored teaching cases, not verbatim historical texts. Completing a model reconstructs a position, not proof of its universal truth.']}
items={}; chapter=[]; edges=[]; current=None

def item(id,label,desc,src=None):
 if id in items:return id
 x={'id':id,'label':label,'description':desc,'sources':src or current['sources']};items[id]=x;S['items'].append(x);return id

def start(id,title,era,start,end,area,motivation,sources,relation,claim):
 global current
 current={'id':id,'title':title,'era':era,'start':start,'end':end,'sources':sources,'relation':relation,'claim':claim,'created':[],'supplies':[],'recipes':[],'earlier':[],'goals':[]}
 chapter.append(current)
 S['stages'].append({'id':id,'title':title,'speaker':'Workshop keeper','motivation':motivation,'area':{'id':'area-'+id,'label':area+' · '+era,'travelText':area},'caches':[{'id':'cache-'+id,'label':'On the table','narrative':'A dated teaching reconstruction; the cases and quantities are invented.','items':current['supplies']}],'objectives':[],'carry':[]})

def supply(id,label,desc):
 if id in items:raise Exception('Duplicate supply '+id)
 item(id,label,desc);current['supplies'].append(id);return id

def r(a,b,out,label,desc,mode='R',at=None):
 # R: references/equipment survive. T: authored working draft changes identity.
 assert a in items and (b in items or b.startswith('@')),(a,b)
 assert out not in items, 'Duplicate output '+out
 item(out,label,desc)
 life={a:{'role':'transform' if mode=='T' else 'retain','reason':('This working object is revised into the result at its own position.' if mode=='T' else 'This source or reusable instrument remains available for comparison and later work.')}}
 if not b.startswith('@'):life[b]={'role':'retain','reason':'The reference, evidence or reusable tool is consulted, not used up.'}
 rec={'id':'make-'+out,'a':a,'b':b,'out':out,'description':desc,'sources':current['sources'],'lifecycle':life}
 if at:rec['at']=at
 S['recipes'].append(rec);current['recipes'].append(rec['id']);current['created'].append(out)
 for x in (a,b):
  prior=next((c for c in chapter[:-1] if x in c['created']),None)
  if prior:
   if x not in current['earlier']:current['earlier'].append(x)
   edges.append({'from':prior['id'],'to':current['id'],'item':x,'recipe':rec['id'],'relation':current['relation'],'sources':current['sources'],'claim':current['claim']})
 return out

def goal(id,text,after=None,intermediate=False):
 o={'id':current['id']+'-'+id,'text':text,'kind':'create','item':id}
 if intermediate:o['intermediate']=True
 if after:o['after']=[current['id']+'-'+after]
 S['stages'][-1]['objectives'].append(o);current['goals'].append(id)

def location(id,label,desc):
 S['locations'].append({'id':id,'label':label,'description':desc,'sources':current['sources']});S['stages'][-1].setdefault('locations',[]).append(id)

# 1. Numeracy, records, divination and prediction coexist before Athens.
start('records','A sky worth recording','c. 700–500 BCE',-700,-500,'Babylonian record room','A cloudy night has left a gap. Make an account another scribe can check, then mark when to watch the Moon again.',['cuneiform','babylon'],'opening','Numeracy, written observation and divinatory interpretation coexist; this is not modern controlled science.')
supply('clay','Clay tablet','A prepared writing surface for a short teaching account.')
supply('stylus','Reed stylus','A writing tool; making a mark does not establish that its content is true.')
supply('grain-count','Grain tally','The teaching store received 12 measures, then 18 measures.')
supply('units','Measure signs','The account must distinguish measures of grain from numbers of containers.')
supply('night-records','Night observations','Dated reports distinguish a seen event, an obscured sky and a missed watch.')
supply('date-signs','Date signs','Month and day labels attach a report to a time rather than a remembered story.')
supply('older-eclipses','Earlier eclipse reports','A small reconstructed series shows recurrent eclipse opportunities, not an eclipse at every opportunity.')
supply('omen-text','Omen interpretation','A separate inherited interpretation links a celestial sign to affairs on earth. Recording and divination were not mutually exclusive.')
r('clay','stylus','marked-tablet','Marked tablet','The surface now holds distinct marks. Their meaning still depends on units and context.','T')
r('marked-tablet','grain-count','number-account','Number account','12 + 18 gives 30 in this teaching account. Written calculation can be checked after the speaker leaves.','T')
r('number-account','units','reckoning-table','Reckoning table','The entry says 30 measures, not 30 jars. Explicit units make a numerical comparison meaningful.','T')
r('night-records','date-signs','sky-record','Dated sky record','Observation and missing observation remain distinct. A cloudy night is not evidence that nothing happened.')
r('sky-record','reckoning-table','interval-table','Interval table','Counting dated intervals makes recurrence inspectable; no cause has yet been established.')
r('interval-table','older-eclipses','cycle-table','Cycle table','Earlier reports support recurring eclipse opportunities. This simplified table is not a transcription of a Babylonian algorithm.')
r('cycle-table','sky-record','watch-calendar','Watching calendar','The calendar identifies a time to watch and leaves room for an event to be absent or hidden.')
r('sky-record','omen-text','paired-record','Record and interpretation','The recorded event and its omen interpretation remain distinguishable, without pretending ancient observers excluded religious meaning.')
goal('watch-calendar','Make a watching calendar');goal('paired-record','Separate report and interpretation')

# 2. Explicitly a comparison, not a fabricated Babylon-to-Aristotle manuscript claim.
start('argument','What does a prediction prove?','c. 400–330 BCE',-400,-330,'Greek argument workshop','Two speakers predict the same shadow but give different causes. Show what follows from each claim—and what the prediction cannot decide.',['aristotle','greek-transmission'],'methodological_comparison','The reconstructed dispute reuses earlier evidence; no claim is made that Aristotle read this fictional tablet.')
supply('cause-claim','Cause claim','Speaker A: every observed darkening is caused by a covering body. The form and the premise can be tested separately.')
supply('inference-form','Inference form','If every A is B, and this case is A, this case is B. The example is a modern explanatory rendering of deductive form.')
supply('rival-cause','Rival explanation','Speaker B predicts the same darkening from a different mechanism; matching one observation does not choose between them.')
supply('new-case','Contrary case','A dimming with no predicted covering challenges the sweeping word “every”; this is an invented counterexample.')
supply('meaning-note','Meaning note','The speakers alternate between “looks dark” and “is physically covered.” These are not identical descriptions.')
r('cause-claim','sky-record','stated-premises','Stated premises','The observed case is separated from the general causal claim. Neither can silently stand in for the other.')
r('stated-premises','inference-form','valid-argument','Valid argument','The conclusion follows if its premises hold. Validity alone does not establish the general premise.')
r('valid-argument','new-case','counterexample','Counterexample','The supplied case defeats the unrestricted claim. One failed claim does not prove every rival explanation.')
r('rival-cause','watch-calendar','rival-prediction','Rival prediction','Both accounts can match this predicted event. A successful prediction is evidence, not a unique causal verdict.')
r('rival-prediction','valid-argument','underdetermined-case','Unsettled cause','The same outcome follows from different accounts; more discriminating evidence is needed. This is a modern reconstruction of the problem.')
r('meaning-note','paired-record','distinguished-claims','Distinct claims','An event report, an interpretation and a proposed mechanism answer different questions. Distinguishing them is not banning any of them.')
r('counterexample','distinguished-claims','qualified-claim','Qualified claim','The revised claim says exactly which class of cases it covers, rather than retreating into an ambiguous word.')
r('qualified-claim','underdetermined-case','open-question','Open question','Which further observation would separate the rivals? The page ends with a real disagreement rather than a compulsory winner.')
goal('open-question','Frame the unresolved question')

start('alexandria','A diagram is not yet a proof','c. 300–150 BCE',-300,-150,'Alexandrian book workshop','A copied diagram has lost a line, and two manuscripts disagree. Restore a checkable proof without pretending the surviving copies agree.',['euclid','alexandria'],'adaptation_and_textual_practice','Greek deductive practice and Alexandrian textual comparison are reconstructed together; modern editorial notation is identified as such.')
supply('straightedge','Straightedge','Draws a straight line; it cannot by itself certify every geometric claim.')
supply('compass','Compass','Transfers a distance and draws a circle in the Euclidean construction.')
supply('segment','Line segment','A given segment AB. The task is to construct an equilateral triangle.')
supply('copy-a','Manuscript A','A teaching copy preserves the two-circle construction but omits a justification.')
supply('copy-b','Manuscript B','A second teaching copy has the justification and a conflicting label. Neither is an actual ancient quotation.')
supply('margin-marks','Editorial signs','Marks distinguish a disputed passage from a supplied reading; the exact notation is modern.')
r('segment','compass','two-circles','Two intersecting circles','Circles centered on A and B use AB as their radius. An intersection supplies a candidate third vertex.')
r('two-circles','straightedge','triangle-diagram','Triangle diagram','Joining the intersection to A and B makes a triangle. The drawing suggests equality; the definition of a circle warrants it.')
r('triangle-diagram','valid-argument','geometrical-proof','Geometrical proof','Each relevant side is a radius of a circle of the same radius. The equalities justify the construction rather than relying on appearance.')
r('geometrical-proof','counterexample','proof-conditions','Proof conditions','A skewed-looking sketch does not refute the definitions; a missing construction premise would. Separate drawing quality from the argument.')
r('copy-a','copy-b','variant-table','Variant table','The missing justification and conflicting label are kept side by side, not silently harmonized.')
r('variant-table','triangle-diagram','restored-diagram','Restored diagram','The geometric construction identifies the likely label while the alternative remains recorded.')
r('restored-diagram','margin-marks','marked-reading','Marked reading','The supplied label is visibly editorial. A plausible restoration is not an untouched original.','T')
r('marked-reading','proof-conditions','critical-text','Critical text','The text presents the proof with its conditions and marks the uncertain reading.','T')
r('critical-text','variant-table','proof-roll','Proof roll','Readers can examine both the geometric reasoning and the textual disagreement. This is a teaching roll, not an invention claim for modern critical editions.')
goal('proof-roll','Complete the proof roll')

start('baghdad','Three mathematical languages','c. 800–850 CE',800,850,'Abbasid manuscript workshop','A land problem reaches the workshop in different notations. Make a usable calculation and a geometric justification—not merely a fluent translation.',['greek-arabic','mathematics','algebra'],'documented_translation_and_synthesis','Greek works circulated through Syriac and Arabic; Indian arithmetic was another substantive input. Do not attribute every algorithm to a single institution or source.')
supply('syriac-witness','Syriac witness','A teaching witness helps compare a Greek mathematical passage with an Arabic rendering; routes differed by work and translator.')
supply('arabic-glossary','Arabic terminology','Candidate renderings of ratio, equality and figure need mathematical context, not just word substitution.')
supply('indian-numerals','Indian numeral treatise','A separate mathematical tradition supplies decimal positional calculation, including a place-holding zero. It is not derived here from Greek geometry.')
supply('merchant-account','Merchant account','A teaching payment has an unknown amount x plus 5 making 12. The notation x is modern.')
supply('square-strips','Square and strips','A diagram represents x² + 6x. A 3 by 3 corner would complete the larger square.')
supply('corner-square','Nine-unit corner','Adding the 3 by 3 corner also changes the other side of the equality.')
r('proof-roll','syriac-witness','compared-witness','Compared witness','The proof is checked across witnesses rather than credited to a single universal translation bureau.')
r('compared-witness','arabic-glossary','arabic-proof','Arabic proof','The translated geometric argument is intelligible and checkable; translation itself involves mathematical judgment.')
r('indian-numerals','reckoning-table','decimal-procedure','Decimal procedure','The same quantities can be calculated with positional digits. Zero preserves a vacant place; it is not a claim that one culture invented all arithmetic.')
r('merchant-account','decimal-procedure','written-equation','Written equation','The account becomes x + 5 = 12 in our modern notation; the unknown is constrained instead of guessed.')
r('written-equation','arabic-proof','balanced-operation','Balanced operation','Removing equal amounts from equal amounts preserves equality. Subtracting 5 on both sides gives x = 7.','T')
r('balanced-operation','merchant-account','checked-solution','Checked solution','Substitution gives 7 + 5 = 12. A reversible step and a check make the answer more than an unexplained rule.','T')
r('square-strips','arabic-proof','square-construction','Square construction','The strips are arranged geometrically. The gap shows why a correction term is needed.')
r('square-construction','corner-square','completed-square','Completed square','Adding 9 turns x² + 6x into (x + 3)². The same 9 must be added to the other side.','T')
r('completed-square','checked-solution','algebra-method','Algebra method','Numerical checking and geometrical justification now accompany a reusable method. Al-Khwarizmi’s work is a development, not passive storage of inherited texts.')
goal('decimal-procedure','Calculate with positional digits');goal('algebra-method','Make a checked algebra method')

start('cairo','Where does the light come from?','c. 1020 CE',1020,1020,'Cairo optics workshop','The bright doorway appears upside down inside the dark room. Make an image and a ray account that can survive moving the lamp.',['optics','optics-manuscript'],'documented_development','Ibn al-Haytham integrates mathematical reasoning with investigations of light and sight; this is not the invention of a universal scientific method.')
supply('lamp','Lamp','A movable source of light, not a physical ray.')
supply('opaque-board','Opaque board','Blocks light except where an aperture will be made.')
supply('aperture','Small aperture','Selects a narrow bundle of light paths.')
supply('screen','White screen','Makes arriving light visible. Stray illumination can wash out a faint projected image.')
supply('courtyard','Bright courtyard','The upper doorway and lower paving can be distinguished in an image.')
supply('source-positions','Lamp positions','Two marked source positions permit a deliberate comparison without changing the aperture.')
location('dark-room','Dark room','A context that makes a faint aperture image visible; place the receiving optical arrangement here.')
r('opaque-board','aperture','aperture-board','Aperture board','The board now admits a narrow set of paths instead of flooding the screen.','T')
r('aperture-board','screen','image-box','Image box','A screen faces the opening. The arrangement is still washed out unless the surrounding room is dark.','T')
r('image-box','courtyard','camera-obscura','Camera obscura','In darkness an inverted image appears: upper and lower paths cross at the aperture. This demonstration is not an exclusive-inventor claim.','T',at='dark-room')
r('lamp','arabic-proof','ray-diagram','Ray diagram','Straight lines model light propagation in a uniform medium; a ray is a representation, not a luminous thread.')
r('ray-diagram','camera-obscura','crossed-rays','Crossed rays','Tracing paths through the opening explains the image inversion geometrically.')
r('source-positions','ray-diagram','predicted-spots','Predicted spots','The diagram predicts where light from each marked position should reach the screen.')
r('predicted-spots','lamp','comparison-record','Comparison record','The lamp is moved between the specified positions and the observed spots are recorded. This is a deliberate test of this arrangement.')
r('comparison-record','crossed-rays','optical-model','Optical model','The same ray geometry accounts for the image and the moved-source observations. It does not settle all questions of vision.')
r('optical-model','open-question','optical-question','Optical question','Light reaching an eye still needs an account of image formation and perception. A successful aperture demonstration is not the entire theory of sight.')
goal('camera-obscura','Form the courtyard image',intermediate=True);goal('optical-model','Explain the image',after='camera-obscura');goal('optical-question','Keep the remaining question open')

start('latin','A reader can change the book','c. 1200–1300 CE',1200,1300,'Mediterranean translation workshop','A merchant needs the arithmetic in a new language; an optical reader needs a trustworthy diagram. Make both usable without erasing their sources.',['arabic-latin','fibonacci','optics-manuscript'],'documented_transmission','Latin readers encountered Arabic mathematics and optics. Fibonacci learned methods in North Africa; transmission included adaptation and original work.')
supply('latin-vocabulary','Latin vocabulary','Candidate terms for an arithmetic and an optical text; naming a concept does not yet preserve its relation to other terms.')
supply('market-problem','Market problem','Three cloth lengths cost 18 units. Calculate the cost of five equal lengths; these quantities are invented.')
supply('copied-optics','Optical manuscript copy','A teaching copy derived from the Arabic optical tradition. One ray is misplaced.')
supply('reader-objection','Reader objection','The copied drawing sends a ray through an opaque wall rather than the opening.')
supply('scribal-materials','Copying materials','A new copy can travel while the witness remains available.')
r('decimal-procedure','latin-vocabulary','latin-arithmetic','Latin arithmetic','The procedure is rendered for a new reader without claiming the numerals were invented in Italy.')
r('latin-arithmetic','market-problem','unit-price','Unit-price calculation','18 divided by 3 gives 6 per cloth length; five equal lengths cost 30. Units constrain the calculation.')
r('unit-price','algebra-method','merchant-manual','Merchant manual','The worked example and general reasoning serve a second account rather than requiring a new memorized answer.')
r('optical-model','copied-optics','compared-optics','Compared optical copy','The inherited model makes the displaced line detectable. A prestigious copy can still contain an error.')
r('compared-optics','reader-objection','corrected-optics','Corrected optical diagram','The ray is redrawn through the aperture and the correction is recorded.','T')
r('corrected-optics','critical-text','annotated-optics','Annotated optics','The reader can distinguish inherited text, diagram correction and unresolved interpretation.')
r('annotated-optics','latin-vocabulary','latin-optics','Latin optics','The Latin rendering carries the geometrical relationships, not merely a list of translated nouns.')
r('latin-optics','scribal-materials','circulating-optics','Circulating optical book','A new copy is prepared for further readers while the checked witness remains available.')
r('merchant-manual','scribal-materials','circulating-arithmetic','Circulating arithmetic book','Practical arithmetic becomes portable without making every future reader agree with every rule.')
goal('circulating-optics','Prepare the optical book');goal('circulating-arithmetic','Prepare the arithmetic book')

start('perspective','A courtyard on a panel','c. 1435 CE',1435,1435,'Florentine painting workshop','The patron wants the paving to recede convincingly from one viewing point. Construct that view, then show why a second viewpoint changes it.',['perspective','euclid'],'mathematical_application_not_exclusive_genealogy','Linear perspective applies geometry to representation; it is not all painting’s destination or a claim of a single direct inventor chain.')
supply('viewpoint','Fixed viewpoint','A chosen eye position; this construction will not preserve the same appearance from every place.')
supply('panel','Blank panel','A surface on which a three-dimensional scene will be represented.')
supply('paving-plan','Paving plan','Equal courtyard squares, not successively smaller real tiles.')
supply('pigments','Pigments','Materials for a painting, not a guarantee of truthful representation.')
supply('second-viewpoint','Second viewpoint','A position to one side of the intended viewing point.')
r('circulating-optics','viewpoint','visual-pyramid','Visual pyramid','Lines connect the fixed viewpoint to the scene. The image is a section through these lines.')
r('visual-pyramid','panel','picture-plane','Picture plane','The panel cuts the visual pyramid; changing its position changes the projected sizes.')
r('paving-plan','geometrical-proof','constructed-grid','Constructed grid','Equal floor intervals are projected by a geometric construction, not by making every drawn gap equal.')
r('constructed-grid','picture-plane','perspective-drawing','Perspective drawing','Receding edges meet consistently for this chosen view. The geometry makes a particular illusion possible.')
r('perspective-drawing','pigments','courtyard-painting','Courtyard painting','Pigment turns the construction into a recognizable courtyard; linear perspective remains one artistic choice.','T')
r('courtyard-painting','second-viewpoint','viewpoint-comparison','Viewpoint comparison','From the side the intended illusion changes. The painting is not a neutral view from nowhere.')
r('viewpoint-comparison','open-question','situated-image','Situated image','The record states who sees from where. A powerful representation has conditions and omissions.')
r('situated-image','courtyard-painting','illustration-method','Illustration method','The maker can now construct a view and document its viewpoint. Later explanatory images can use this discipline without imitating this style.')
goal('courtyard-painting','Paint the courtyard',intermediate=True);goal('illustration-method','Record the illustration method',after='courtyard-painting')

start('printing','Many copies, one hidden error','c. 1450–1500 CE',1450,1500,'European print workshop','The mathematical book is wanted in several towns. Print a small edition—and catch the swapped label before every copy repeats it.',['printing','alexandria','ratdolt'],'documented_medium_change','European printing is not the invention of printing: Asian block and type traditions are earlier and diverse. This chapter makes no unsupported single transfer chain.')
supply('type-case','Type case','Reusable movable letters for this European workshop. Earlier East Asian printing included different block and type practices.')
supply('printing-ink','Printing ink','Ink suited to the workshop’s printing surface.')
supply('paper-stock','Paper stock','Sheets for multiple impressions. Paper’s Eurasian history is longer than this scene.')
supply('press','Printing press','Applies even pressure. A machine can multiply an error as readily as a correct reading.')
supply('engraver','Engraving tools','A reusable set for cutting an illustrative block.')
supply('swapped-label','Swapped label','A proof sheet has interchanged A and B; the text alone is still fluent.')
r('circulating-arithmetic','type-case','set-page','Set arithmetic page','The book’s wording is composed into reusable type; the manuscript remains a reference.')
r('illustration-method','engraver','diagram-block','Diagram block','A reproducible diagram is cut with labels tied to the mathematical explanation.')
r('set-page','diagram-block','illustrated-form','Illustrated printing form','Text and diagram share a page, so a reader can inspect the correspondence.')
r('illustrated-form','printing-ink','inked-form','Inked form','The printing surface is prepared without consuming the source book.','T')
r('inked-form','press','proof-impression','Proof impression','A trial impression is examined before the edition is multiplied.')
r('proof-impression','swapped-label','detected-error','Detected print error','Comparing the figure with its explanation reveals a label swap that fluent prose alone conceals.')
r('detected-error','critical-text','corrected-proof','Corrected proof','The correction is recorded and applied to the working proof. Multiplication is not automatic reliability.','T')
r('corrected-proof','paper-stock','printed-quire','Printed quire','Several sheets reproduce the corrected page; copies can now travel farther than this single workshop.')
r('printed-quire','proof-roll','checked-edition','Checked edition','A printed mathematical edition retains an inspectable argument. Its authority still depends on checking, not merely on print.')
goal('checked-edition','Print the checked edition')

start('anatomy','The book and the body disagree','1543 CE',1543,1543,'Padua and Basel anatomy collection','An inherited jaw drawing and an adult human specimen disagree. Make a corrected plate that lets a distant reader inspect the reason.',['vesalius','jaw-study','vesalius-print'],'documented_critique_and_print','Vesalius relied on and corrected Galen; anatomical images and printing made corrections portable, not automatically infallible.')
supply('galenic-drawing','Inherited jaw drawing','A teaching drawing presents an older anatomical claim. Galen’s work is not reduced to one error.')
supply('adult-jaw','Adult jaw specimen','An adult human mandible in this teaching collection; development and individual variation matter.')
supply('specimen-label','Specimen label','Species, adulthood and provenance accompany the specimen; an unlabeled bone cannot support the same claim.')
supply('dissection-record','Dissection record','A supplied historical-teaching record of observation, not an instruction to perform a procedure.')
supply('anatomical-block','Anatomical woodblock','A prepared drawing can be transferred to a printing block.')
r('adult-jaw','specimen-label','documented-jaw','Documented jaw','The claim concerns this adult human specimen, not every animal or developmental stage.')
r('documented-jaw','galenic-drawing','anatomical-discrepancy','Anatomical discrepancy','The observed adult mandible does not match the inherited depiction; the scope of the mismatch is explicit.')
r('anatomical-discrepancy','counterexample','bounded-correction','Bounded correction','The evidence corrects this claim; it does not demonstrate that every inherited anatomical statement is false.')
r('documented-jaw','illustration-method','anatomical-drawing','Anatomical drawing','The drawing records the view and key structure rather than pretending to be a transparent substitute for the specimen.')
r('anatomical-drawing','dissection-record','labeled-anatomy','Labeled anatomy','The figure and record identify what was observed and where the label refers.')
r('labeled-anatomy','bounded-correction','corrected-plate','Corrected plate','The plate makes the anatomical correction and its evidential basis visible.')
r('corrected-plate','anatomical-block','anatomy-print-block','Anatomy print block','The corrected illustration becomes reproducible while its documented source remains available.')
r('anatomy-print-block','checked-edition','printed-anatomy','Printed anatomy','The printed page joins an inspectable image with a correction; distance no longer requires trusting an unsupported verbal report.')
r('printed-anatomy','critical-text','anatomical-commentary','Anatomical commentary','Inherited claims and new corrections remain distinguishable. Vesalius’s work is an engagement with the tradition, not a clean break from it.')
goal('anatomical-commentary','Publish the documented correction')

start('astronomy','An instrument changes the question','1604–1611 CE',1604,1611,'Kepler and Galileo collection','A magnified sky is full of unfamiliar shapes. Build a usable instrument record, then test which old sky claims the observations actually challenge.',['optics','kepler','newton'],'documented_transmission_and_revision','Kepler explicitly worked on inherited Latin optics; telescope practice and optical theory informed one another. A telescope was not a consequence of one book alone.')
supply('curved-lens','Curved lens','A supplied converging lens; this collection does not teach lens manufacturing.')
supply('lens-pair','Lens pair','A supplied compatible objective and eyepiece, with limitations in field and orientation.')
supply('optical-tube','Optical tube','Keeps the lenses aligned and the viewing distance repeatable.')
supply('moon-observations','Moon observations','A supplied sequence of changing bright and shadowed features, not a photograph.')
supply('venus-record','Venus phase record','A sequence of phases that challenges a simple Ptolemaic arrangement but does not by itself rule out every geocentric alternative.')
supply('tycho-table','Tycho’s position table','A supplied table stands for careful pre-telescopic measurements; instrument innovation did not make older observations worthless.')
r('circulating-optics','curved-lens','refracted-rays','Refracted rays','The inherited straight-ray geometry is extended to a lens that changes direction at its surfaces.')
r('refracted-rays','screen','focal-image','Focal image','A sharp image forms at a particular plane. Bringing an eye to any arbitrary point is not the same as understanding where the image forms.')
r('lens-pair','optical-tube','telescope','Telescope','The supplied lenses are aligned in a tube. Magnification brings new evidence and new interpretive hazards.')
r('telescope','focal-image','instrument-calibration','Instrument check','Known targets distinguish the instrument’s orientation and focus from features supposedly found in the sky.')
r('instrument-calibration','moon-observations','lunar-relief-record','Lunar relief record','Changing shadows support relief rather than a perfectly smooth surface; the argument uses light geometry as well as seeing.')
r('lunar-relief-record','ray-diagram','interpreted-shadows','Interpreted shadows','The direction of illumination connects a changing shadow to raised or depressed terrain.')
r('instrument-calibration','venus-record','phase-evidence','Phase evidence','The documented phases reject one simple arrangement, not every competing system of the world.')
r('phase-evidence','underdetermined-case','bounded-sky-claim','Bounded sky claim','An observation can eliminate a model without uniquely proving its favoured replacement.')
r('tycho-table','algebra-method','orbital-table','Orbital comparison table','Calculated positions are compared with observations. The table preserves discrepancies instead of hiding them in a perfect circle.')
r('orbital-table','cycle-table','predictive-sky-record','Predictive sky record','Old recurrence and newer positional models can both be checked against records; a stronger model must still answer inherited observations.')
goal('interpreted-shadows','Explain the lunar shadows');goal('bounded-sky-claim','Bound the phase claim');goal('predictive-sky-record','Check the sky predictions')

start('circulation','A quantity that will not balance','1628 CE',1628,1628,'Harvey’s anatomical collection','The heart seems to move more blood than a one-way supply can replace. Reconcile the quantities with the direction of the valves.',['harvey','vesalius'],'historical_methodological_synthesis','Harvey combines anatomical study, quantitative reasoning and experiments with analogical and teleological reasoning; later capillaries are not backdated.')
supply('heart-estimate','Heart-volume estimate','A deliberately rough teaching estimate: a small amount per beat, not a claim of precise modern measurement.')
supply('beat-count','Beat count','A supplied count over a recorded interval; estimates and variability remain visible.')
supply('blood-stock','Available blood estimate','The teaching body’s available blood is far smaller than the repeated one-way output would require.')
supply('valve-record','Valve observations','Supplied diagrams describe one-way action in valves; no invasive procedure is instructed.')
supply('return-path','Possible return path','A proposed route returns blood from the body toward the heart; some connections are not yet directly observed.')
r('heart-estimate','merchant-manual','per-beat-account','Per-beat account','The amount per beat is assigned units and kept explicitly approximate.')
r('per-beat-account','beat-count','throughput-estimate','Throughput estimate','Multiplying a conservative amount by repeated beats yields a large total flow, not a newly created store of blood.')
r('throughput-estimate','blood-stock','replacement-problem','Replacement problem','The one-way replacement account struggles to supply the inferred quantity. A numerical mismatch motivates a different route.')
r('anatomical-commentary','valve-record','directed-vessels','Directed-vessel record','The anatomical plate is read together with observations of valve direction, not simply accepted as a complete mechanism.')
r('directed-vessels','return-path','circulation-route','Circulation route','A return route makes repeated passage possible; the drawing marks what is proposed rather than directly seen.')
r('circulation-route','replacement-problem','recirculation-account','Recirculation account','The same blood can pass repeatedly, answering the quantity difficulty without demanding continuous replacement.')
r('recirculation-account','bounded-correction','circulation-limits','Circulation limits','A powerful account can leave an unobserved connection. This is not a claim that Harvey saw capillaries.')
r('circulation-limits','checked-edition','circulation-book','Circulation book','The quantity argument, anatomical observations and missing link can circulate together for criticism.')
goal('circulation-book','Publish the circulation book')

start('chance','Divide the interrupted game','1654 CE',1654,1654,'Pascal–Fermat correspondence table','A fair first-to-three game stops at 2–1 with four coins at stake. Divide the stake by the chances that remain, not just the score already won.',['probability'],'primary_correspondence_reconstruction','The historical correspondence develops competing methods for an older problem; the four-coin case is a transparent authored model.')
supply('score-state','Score: 2–1','A needs one more win; B needs two. Every remaining round is fair and independent in this toy model.')
supply('remaining-rounds','Two-round continuations','Record AA, AB, BA and BB, treating an already completed game consistently when padding to two rounds.')
supply('stake','Four-coin stake','The stake is divided by modelled chances of eventual victory, not by the 2:1 score ratio.')
supply('rival-method','Backward method','At a tied final situation each player has half the stake; work backward one fair round at a time.')
supply('unfair-coin','Biased-round notice','If rounds are not fair or independent, the equal weighting of continuations is no longer justified.')
r('score-state','remaining-rounds','continuation-tree','Continuation tree','AA, AB and BA end with A winning; only BB gives B the game under the stated stopping rule.')
r('continuation-tree','decimal-procedure','outcome-count','Outcome count','Three of four equally weighted continuations favor A. Padding must not double-count unequal routes.')
r('outcome-count','stake','fair-share','Fair share','The model allocates three coins to A and one to B. This is conditional on the stated game, not a universal meaning of fairness.')
r('rival-method','merchant-manual','backward-value','Backward value','Working backward through fair rounds yields the same expected stake without relying on the score ratio.')
r('backward-value','fair-share','reconciled-methods','Reconciled methods','Enumeration and backward reasoning agree on 3:1. Different methods can support the same answer rather than declaring one obsolete.')
r('continuation-tree','valid-argument','probability-model','Probability model','The model records its sample space and equal-weight assumptions. A bare fraction conceals those commitments.')
r('probability-model','unfair-coin','model-condition','Model condition','Unequal or dependent rounds alter the weights. The result must not be carried unchanged to a different game.')
r('reconciled-methods','model-condition','chance-letter','Chance letter','The settlement travels with both the reasoning and its limits, leaving a recipient able to object meaningfully.')
r('chance-letter','printed-quire','probability-table','Probability table','An inspectable table preserves the outcomes, assumptions and values for later quantitative questions.')
goal('probability-table','Settle the unfinished game')

start('population-table','Who is missing from the count?','1662 CE',1662,1662,'Graunt’s mortality-table collection','The city’s weekly bills contain repeated headings and uncertain causes. Make comparable counts without treating the labels as diagnoses.',['graunt','probability'],'historical_tabulation_and_reconstructed_application','Graunt uses bills of mortality to reason about populations; applying this exact toy probability table is a pedagogical comparison, not a documented debt to Pascal.')
supply('weekly-bills','Weekly mortality bills','An invented small dataset uses the form of published bills; categories may be inconsistent or uncertain.')
supply('category-key','Category key','Groups entries consistently while keeping uncertain cause labels distinct from reliable counts of deaths.')
supply('parish-totals','Parish totals','Parishes differ in size; a greater count does not automatically mean a greater individual risk.')
supply('population-estimates','Population estimates','Explicitly estimated numbers of people underlie a rate; they are not direct censuses.')
supply('repeated-years','Repeated yearly totals','A short authored series includes variation and a missing year.')
r('weekly-bills','checked-edition','comparable-bills','Comparable bills','Published entries are transcribed with dates and headings so that like is compared with like.')
r('comparable-bills','category-key','classified-counts','Classified counts','The totals use consistent categories while preserving ambiguous entries instead of inventing diagnoses.')
r('classified-counts','parish-totals','parish-table','Parish table','Counts by parish make unequal totals visible but do not yet measure risk.')
r('parish-table','population-estimates','population-rates','Population rates','Deaths are related to the population represented. The denominator is part of the claim and carries uncertainty.')
r('population-rates','repeated-years','rate-series','Rate series','Multiple years show fluctuation; the missing year is not silently filled with zero.')
r('rate-series','probability-table','variation-account','Variation account','Observed frequency is separated from a model’s ideal probability. A small series cannot settle an exact law.')
r('variation-account','counterexample','population-caveat','Population caveat','A changed category or population can defeat a tempting comparison. Numerical neatness does not remove source problems.')
r('population-caveat','parish-table','demographic-record','Demographic record','Counts, denominators and uncertain categories remain connected in a portable record.')
goal('demographic-record','Make the population comparison')

start('motion','One account of several motions','1687 CE',1687,1687,'Mathematical natural philosophy workshop','A planetary orbit and a falling body appear to be different problems. Make a mathematical account that answers both without claiming to know gravity’s ultimate cause.',['newton','euclid','newton'],'documented_mathematical_synthesis','Newton’s Principia unites mathematical treatments of terrestrial and celestial motion. Modern vectors below are teaching representations, not its original notation.')
supply('position-times','Timed positions','Equal time intervals and measured displacements from a supplied moving-body record.')
supply('direction-diagram','Direction diagram','Modern arrows distinguish a changing direction from a mere increase in speed.')
supply('fall-record','Falling-body record','An idealized low-resistance record; the model’s conditions are stated, not assumed to hold in every medium.')
supply('mass-comparison','Mass comparison','Two supplied test cases distinguish mass from velocity and force.')
supply('orbit-distances','Orbit distances','Distances and periods permit a check across more than one planetary path.')
supply('force-rule','Candidate force rule','A central inverse-square relation is proposed for the mathematical exercise; fitting is not an origin story.')
r('position-times','algebra-method','motion-differences','Motion differences','Displacement over equal times separates steady motion from changing motion.')
r('motion-differences','direction-diagram','acceleration-record','Acceleration record','A change of direction is also a change of velocity, even when speed stays constant.')
r('acceleration-record','mass-comparison','force-comparison','Force comparison','Force and acceleration are related with mass held explicit; the quantities are not interchangeable labels.')
r('orbital-table','geometrical-proof','orbital-geometry','Orbital geometry','The recorded orbit constrains a geometric account rather than being replaced by a decorative circle.')
r('orbital-geometry','force-rule','orbit-model','Orbit model','The proposed force is used to calculate orbital behavior, making consequences available for comparison.')
r('orbit-model','orbit-distances','cross-orbit-check','Cross-orbit check','More than one orbit tests the relation; reproducing a single chosen path would be weaker evidence.')
r('fall-record','force-comparison','terrestrial-account','Terrestrial account','The idealized fall is related to the same quantitative vocabulary, with resistance limits visible.')
r('terrestrial-account','cross-orbit-check','shared-motion-account','Shared motion account','One mathematical framework addresses terrestrial and celestial cases without making every physical mechanism known.')
r('shared-motion-account','bounded-sky-claim','scope-of-law','Scope of law','Predictive success is distinguished from an ultimate explanation of gravity. Mathematical laws do not compel a particular theology.')
r('scope-of-law','checked-edition','mathematical-treatise','Mathematical treatise','The account can be inspected, calculated from and criticized; publication does not make its conditions disappear.')
goal('mathematical-treatise','Unite the motion accounts')

start('longitude','Which position survives the voyage?','c. 1760–1770 CE',1760,1770,'Ship’s chart table','Two navigation methods disagree after a rough passage. Find a position that includes the disagreement instead of picking the prettier answer.',['longitude'],'historical_application_and_comparison','Timekeepers and lunar distances coexisted. This reconstruction applies earlier mathematical and optical work without a single-inventor victory story.')
supply('sea-clock','Marine timekeeper','A supplied instrument retaining a reference time; reliability must survive the voyage.')
supply('local-noon','Local-noon observation','A local solar time marker with its own observational uncertainty.')
supply('lunar-distance','Lunar-angle reading','An observed angular separation for a lunar-distance calculation; not a raw longitude.')
supply('nautical-table','Nautical tables','Supplied dated predictions and corrections for the lunar method.')
supply('rough-voyage','Rough-voyage trial','A supplied record of temperature changes, motion and comparison readings; no construction instructions.')
supply('chart','Sea chart','A representation with its own scale and survey limits.')
location('sea-trial','Sea trial','The timekeeper’s voyage performance cannot be established solely on a stable workshop table.')
r('sea-clock','local-noon','time-difference','Time difference','The difference between reference and local time becomes a longitude estimate only through a stated conversion.')
r('time-difference','merchant-manual','clock-longitude','Clock longitude','Earth’s rotation connects the time difference with an angular displacement; the clock’s uncertainty remains.')
r('lunar-distance','predictive-sky-record','observed-sky-angle','Checked sky angle','An inherited sky record helps identify what was measured; the observed angle is not confused with an uncorrected prediction.')
r('observed-sky-angle','nautical-table','lunar-longitude','Lunar longitude','Tables and corrections yield a second position estimate by a different method.')
r('sea-clock','rough-voyage','voyage-clock-record','Voyage clock record','The comparison records drift under voyage conditions rather than treating workshop accuracy as sea reliability.',at='sea-trial')
r('voyage-clock-record','clock-longitude','corrected-clock-position','Trial-qualified clock position','The estimated clock position is qualified using the recorded voyage behavior.')
r('corrected-clock-position','lunar-longitude','position-comparison','Position comparison','Agreement supports a working position; disagreement identifies an uncertainty that must remain visible.')
r('position-comparison','chart','navigation-chart','Checked navigation chart','The chart marks the position with an uncertainty range instead of a magically exact dot.')
goal('navigation-chart','Mark the checked ship position')

start('deep-time','A surface between two pasts','1788 CE',1788,1788,'Siccar Point field collection','The lower beds are tilted; the upper beds lie across them. Reconstruct the order of events without pretending a rock face gives an exact date.',['hutton','perspective'],'geological_reconstruction','Hutton’s unconformity supports repeated geological processes; it does not originate his entire theory or establish every timescale.')
supply('tilted-beds','Tilted lower beds','A supplied field drawing of the older inclined strata.')
supply('upper-beds','Overlying beds','A second drawing shows less tilted strata resting across the lower beds.')
supply('erosion-surface','Truncated surface','The lower layers end against a surface on which later material rests.')
supply('modern-deposits','Present-day deposits','A supplied comparison of sediment accumulation in contemporary environments; present examples do not fix all ancient rates.')
supply('uplift-evidence','Uplift evidence','The disposition of the layers requires changes in orientation and elevation before the later deposit.')
r('tilted-beds','illustration-method','lower-section','Lower-layer section','A scaled section preserves orientation so the viewer can check which lines are observed and which are inferred.')
r('lower-section','upper-beds','joined-section','Joined section','The two orientations are placed in one view; the boundary is not smoothed away.')
r('joined-section','erosion-surface','unconformity','Unconformity','The lower beds were laid down, tilted and truncated before the upper beds accumulated.')
r('unconformity','uplift-evidence','event-sequence','Event sequence','Deposition, deformation, erosion and renewed deposition have a relative order; exact dates are not supplied.')
r('event-sequence','modern-deposits','repeated-processes','Repeated-process account','Processes observable now help interpret the sequence, while rates and past circumstances remain open questions.')
r('repeated-processes','mathematical-treatise','timescale-question','Timescale question','A process model must have enough time for its sequence. This is not a calculation of Earth’s modern numerical age.')
r('timescale-question','counterexample','qualified-deep-time','Qualified deep-time argument','The evidence supports a long sequence, not every detail of one geological theory or an inevitable story of improvement.')
r('qualified-deep-time','joined-section','geological-record','Geological record','The claim travels with the actual section and its event ordering, ready for later readers to extend or dispute.')
goal('geological-record','Reconstruct the layered past')

start('population-pressure','A projection is not a destiny','1798 CE',1798,1798,'Political-economy reading table','A pamphlet compares rapidly multiplying people with slower-growing provisions. Reconstruct its argument, then separate the model from the policy conclusion.',['malthus','darwin'],'primary_argument_and_future_documented_reading','Malthus’s ratios are an argumentative model. Darwin later adapted population pressure; no endorsement of deprivation or hierarchy follows here.')
supply('growth-assumptions','Growth assumptions','A hypothetical population doubles at equal intervals while provisions increase by equal additions; these are assumptions, not universal observations.')
supply('provision-series','Provision series','An invented sequence rises 100, 200, 300, 400. Institutions, technology and distribution are omitted from this simple model.')
supply('starting-population','Starting population','The teaching series begins at 100; a doubling assumption produces 100, 200, 400, 800.')
supply('policy-claim','Policy claim','A writer claims the numerical model by itself dictates one policy. That conclusion needs ethical and institutional premises.')
r('starting-population','growth-assumptions','population-projection','Population projection','Repeated doubling creates the stated hypothetical sequence. It is a model consequence, not an observed fate.')
r('population-projection','decimal-procedure','growth-table','Growth table','A table makes the difference between repeated multiplication and repeated addition inspectable.')
r('growth-table','provision-series','pressure-model','Population-pressure model','Under these assumptions, demands eventually exceed provisions. Altering the assumptions or distribution can change the result.')
r('pressure-model','demographic-record','model-data-comparison','Model–record comparison','Observed populations and estimated rates are not interchangeable with a schematic growth argument.')
r('model-data-comparison','model-condition','conditional-pressure','Conditional pressure','The pressure claim is explicitly conditional. The table cannot settle which institutions or responses are just.')
r('policy-claim','valid-argument','policy-premises','Policy premises','A policy conclusion needs additional value judgments and empirical premises; it is not hidden inside multiplication.')
r('policy-premises','conditional-pressure','separated-conclusions','Separated conclusions','An explanatory population model and a political prescription are kept distinct.')
r('separated-conclusions','printed-quire','population-pamphlet','Population pamphlet','The argument is available for later readers to adapt, dispute or misuse; publication is not endorsement.')
goal('population-pamphlet','Publish the population argument')

start('fields','A needle moves—and then stops','1820–1831 CE',1820,1831,'Ørsted and Faraday collection','A nearby current turns a compass; a second circuit responds only when conditions change. Keep the still-needle result as carefully as the exciting one.',['field-oersted-object','field-oersted-observation','field-ring-object'],'documented_experimental_development','Ørsted and Faraday are distinct investigations, not one demonstration; the old comparison record is methodological reuse rather than direct personal influence.')
supply('magnetic-compass','Compass needle','A supplied instrument indicates direction; the needle’s motion is evidence, not the field itself.')
supply('wire-record','Current-wire observations','A safe supplied record compares positions above and below a current-carrying wire; no power construction is taught.')
supply('position-grid','Position grid','Marked locations allow repeated direction readings around the wire.')
supply('ring-record','Ring-coil observations','A supplied historical demonstration record: a second circuit responds briefly when the first is switched, not steadily throughout.')
supply('still-record','Steady-state record','The second circuit’s indication returns to zero while the first remains steady.')
supply('reversal-record','Reversal record','Opposite changes produce opposite brief responses; the sign is part of the evidence.')
r('magnetic-compass','wire-record','deflection-record','Needle deflection record','Direction differs above and below the wire. The effect cannot be represented as attraction toward the wire alone.')
r('deflection-record','position-grid','field-directions','Field directions','Directions at several positions form a spatial pattern; drawn lines represent it rather than being physical threads.')
r('field-directions','illustration-method','field-map','Field map','The map keeps orientation and viewpoint explicit so another reader can compare the pattern.')
r('ring-record','comparison-record','switch-comparison','Switch comparison','On and off changes are recorded separately from the interval between them; timing matters.')
r('switch-comparison','still-record','change-evidence','Change evidence','The null under steady conditions matters as much as the transient response. Mere presence is not enough in this setup.')
r('change-evidence','reversal-record','induction-pattern','Induction pattern','The response changes sign with the direction of change; the evidence constrains a causal model.')
r('induction-pattern','field-map','changing-field-model','Changing-field model','A changing magnetic situation connects the circuits without treating current as a substance leaking through the ring.')
r('changing-field-model','mathematical-treatise','field-question','Field question','The evidence opens a new mathematical problem. It does not claim Faraday already possessed Maxwell’s later equations.')
r('field-question','checked-edition','electromagnetic-record','Electromagnetic record','The map, transients and null remain inspectable together; later circuit designers inherit observations as well as useful effects.')
goal('electromagnetic-record','Record the change-dependent effect')

start('photography','Can the image outlast the light?','1839–1844 CE',1839,1844,'Talbot photographic collection','The courtyard image vanishes when the screen leaves the box. Make an image that can travel—and keep track of what the process loses.',['photo','optics-object'],'documented_instrument_adaptation','Camera obscura geometry and photosensitive processes converge; several photographic processes and inventors coexist. No chemical procedure is taught.')
supply('sensitive-sheet','Prepared sensitive sheet','A supplied historical-process teaching material; no chemical preparation or handling instructions are given.')
supply('exposure-record','Exposure record','The supplied image records conditions and a limited tonal response; a photograph is not every aspect of its subject.')
supply('fixed-process','Prepared fixing process','A museum demonstration package stands for stabilization; no chemistry recipe is supplied.')
supply('contact-sheet','Contact-copy material','A prepared surface for demonstrating reproduction from a negative.')
supply('caption-record','Caption record','Date, viewpoint and subject identification accompany the image; the caption itself can still be mistaken.')
r('camera-obscura','sensitive-sheet','camera-exposure','Camera exposure','The optical image reaches a sensitive surface rather than a temporary viewing screen.')
r('camera-exposure','exposure-record','latent-record','Exposed image record','A light-dependent record exists with limited tones and exposure conditions; it is not yet a durable finished image.','T')
r('latent-record','fixed-process','paper-negative','Stable paper negative','The prepared demonstration preserves a negative image. Its reversed tones permit another kind of copying.','T')
r('paper-negative','contact-sheet','positive-print','Positive print','A positive can be made from the negative; reproducibility differs from a unique direct-positive process.')
r('positive-print','situated-image','framed-photograph','Framed photograph','The image’s viewpoint, framing and exclusions are made explicit instead of treating the camera as a view from nowhere.')
r('framed-photograph','caption-record','documented-photograph','Documented photograph','The photograph travels with date and subject information. Neither detail nor a confident caption alone guarantees truth.','T')
r('documented-photograph','critical-text','visual-source-note','Visual source note','Source, process and interpretation are distinguished, just as an edited text distinguishes witness from conjecture.')
r('visual-source-note','paper-negative','photographic-archive','Photographic archive','A reproducible image and its source record remain connected, allowing a later reader to inspect both depiction and process.')
goal('photographic-archive','Preserve the reproducible image')

start('logic','An argument becomes a calculation','1854 CE',1854,1854,'Boole’s symbolic workshop','A rule permits entry when either of two conditions holds. Write it so that all four cases—not only the convenient one—can be checked.',['boole','aristotle','shannon'],'formal_extension_not_identity','Boole develops algebraic logic; the modern truth-table notation in this teaching task is not claimed as his exact original notation or a simple restatement of Aristotle.')
supply('binary-cases','Four condition cases','For A and B, inspect 00, 01, 10 and 11. The symbols represent two specified conditions, not the truth of every possible sentence.')
supply('either-rule','Either-condition rule','The rule allows A or B, including both; this is inclusive OR, not an ambiguous conversational “either.”')
supply('both-rule','Both-condition rule','A second rule requires A and B together.')
supply('not-rule','Negation rule','NOT A reverses whether condition A is satisfied.')
supply('compound-rule','Compound entry rule','Allow (A OR B) AND NOT C, where C means a blocking condition.')
r('valid-argument','algebra-method','symbolic-propositions','Symbolic propositions','Specified propositions can be represented and manipulated systematically, but the formalism does not supply their empirical truth.')
r('symbolic-propositions','binary-cases','case-table','Case table','All four combinations of A and B are explicit; a favored example cannot stand in for exhaustive checking.')
r('case-table','either-rule','or-table','OR table','Inclusive OR accepts 01, 10 and 11 and rejects 00.')
r('case-table','both-rule','and-table','AND table','AND accepts only 11; using a different operation changes the rule, not just its name.')
r('symbolic-propositions','not-rule','not-table','NOT table','Negation interchanges satisfied and unsatisfied within the stated two-valued model.')
r('or-table','and-table','combined-operations','Combined logical operations','Separate operations can be composed while retaining explicit cases rather than relying on verbal resemblance.')
r('combined-operations','compound-rule','entry-expression','Entry expression','The rule combines an inclusive permission with a block. Parentheses determine how operations are grouped.')
r('entry-expression','not-table','boolean-specification','Boolean specification','The complete table says when the rule permits entry. A specification can later be realized physically without proving the rule is morally justified.')
r('boolean-specification','counterexample','checked-logic','Checked logical specification','Trying every stated case reveals a mistaken grouping; the corrected specification preserves the intended relation.')
goal('checked-logic','Check every case of the rule')

start('water','The same street, different water','1854–1855 CE',1854,1855,'London water investigation','Neighbors use different water companies. Compare deaths by supply and by the number of households served; a dramatic map alone is not enough.',['snow','snow-myth'],'historical_evidence_linkage','Snow compared intermixed supplier populations. This is not random assignment, not a map epiphany, and not proof that removing a handle alone ended the outbreak.')
supply('death-list','Household death list','An invented teaching list links 11 deaths to addresses in one interval. These are not Snow’s historical counts.')
supply('supplier-receipts','Water-supplier receipts','Receipts and supplied observations identify the household’s company rather than guessing from the street alone.')
supply('served-households','Households served','In the invented teaching case A serves 100 households and B serves 300. These are not Snow’s historical counts.')
supply('district-plan','District plan','A spatial guide to households and water supply, not a self-explanatory cause map.')
supply('alternative-causes','Alternative explanations','Differences in population, housing and reporting could affect the comparison; neighboring customers reduce some concerns but not all.')
r('death-list','district-plan','addressed-deaths','Address-linked deaths','The mapped points preserve addresses and time window; visual clustering alone does not identify an exposure.')
r('addressed-deaths','supplier-receipts','supplier-linked-record','Exposure-linked record','Linking the invented addresses to supplier records assigns 8 deaths to A and 3 to B. Customers of both suppliers can share a street.')
r('supplier-linked-record','population-rates','comparison-design','Supplier comparison design','The inherited rate calculation is used to compare like time windows and explicitly defined exposure groups.')
r('comparison-design','served-households','supplier-rates','Supplier rates','In the invented case, 8/100 = 8% and 3/300 = 1%. The death count alone conceals the larger contrast after accounting for households served.')
r('supplier-rates','alternative-causes','causal-assessment','Causal assessment','The marked rate contrast supports a waterborne explanation while alternatives and classification limits remain open.')
r('causal-assessment','model-condition','bounded-water-claim','Bounded water claim','An observational comparison can be powerful without being randomized or proving every mechanism.')
r('bounded-water-claim','district-plan','annotated-water-map','Annotated water map','The map now refers to supplier evidence and denominators rather than claiming that dots alone establish the cause.')
r('annotated-water-map','demographic-record','water-evidence-report','Water evidence report','The spatial pattern, exposure records and rate calculation travel together so the inference can be challenged.')
r('water-evidence-report','critical-text','auditable-investigation','Auditable investigation','A reader can distinguish original records, missing information and the investigator’s inference. The pump-handle story is not the whole evidence.')
goal('auditable-investigation','Explain the water contrast')

start('species','Three books meet a living world','1858–1859 CE',1858,1859,'Darwin–Wallace natural-history collection','Variation, geological time and population pressure suggest a mechanism. Make the argument without turning survival into progress—or a moral command.',['darwin','lyell-darwin','wallace-1858'],'documented_reading_and_independent_contribution','Darwin’s documented Malthus reading and geological work join observations of variation. Wallace is an independent contributor; this is not a single-hero sequence.')
supply('lyell-volume','Lyell’s geological volume','A supplied 1830s text extends geological process reasoning; its author did not initially accept every conclusion Darwin drew.')
supply('variation-specimens','Variation specimens','A documented teaching collection shows differences within a population, not a ladder of inherently higher forms.')
supply('inheritance-record','Inheritance observations','Some differences recur across generations. This is not modern DNA knowledge or a complete theory of inheritance.')
supply('offspring-record','Offspring and survival record','Many offspring are produced; not all leave offspring of their own under limited conditions.')
supply('generation-series','Generation series','An authored population example records changing frequencies across generations, not a single individual transforming by effort.')
supply('wallace-essay','Wallace’s essay','A supplied 1858 dossier records independent reasoning toward natural selection and the joint presentation.')
r('geological-record','lyell-volume','extended-geological-time','Extended geological time','Repeated processes and a long history make room for cumulative change; Lyell’s influence does not mean he accepted every evolutionary conclusion.')
r('variation-specimens','photographic-archive','documented-variation','Documented variation','Images and labels preserve inspectable differences; photographs are one teaching documentation method, not a claim about Darwin’s exact specimen workflow.')
r('documented-variation','inheritance-record','heritable-variation','Heritable variation dossier','The argument needs transmissible differences, not just a catalogue of appearances.')
r('population-pamphlet','offspring-record','struggle-condition','Population constraint','A population argument is adapted to organisms: more offspring may be produced than reproduce successfully. It is not a moral endorsement of human deprivation.')
r('heritable-variation','struggle-condition','differential-reproduction','Differential reproduction','In the supplied environment, some inherited differences affect reproductive success; fitness is contextual, not a universal rank.')
r('differential-reproduction','generation-series','population-change','Population change','Across generations, frequencies can change. Individuals need not transform in order for populations to evolve.')
r('population-change','extended-geological-time','selection-account','Selection account','Small recurring differences can accumulate over long periods. No inevitable destination or global improvement is built into the mechanism.')
r('selection-account','wallace-essay','parallel-contributions','Parallel contributions','Darwin’s and Wallace’s lines of work meet; the record does not reduce Wallace to a footnote or duplicate ingredient.')
r('parallel-contributions','bounded-water-claim','testable-evolution-case','Bounded evolutionary argument','The case distinguishes evidence, mechanism and unresolved inheritance questions; a powerful theory still invites further tests.')
r('testable-evolution-case','checked-edition','descent-book','Descent book','The published argument can be extended and disputed. Biological explanation does not by itself prescribe social policy.')
goal('descent-book','Build the argument across generations')

start('microbes','The useful culture is not the whole mechanism','1860s–1897 CE',1860,1897,'Fermentation and cell-free chemistry collection','A brewer’s successful culture and a spoiled batch look alike to the eye. Compare them, then ask whether living cells must remain present for fermentation.',['fermentation','buchner'],'documented_practice_investigation_and_revision','Pasteur’s microbial work and Buchner’s 1897 cell-free work are distinct generations. The latter revises a mechanism without erasing practical microbial knowledge.')
supply('microscope','Microscope','A supplied instrument makes small structures inspectable; this is not a claim that a telescope simply became a microscope.')
supply('successful-culture','Successful fermentation culture','A supplied teaching specimen from a productive process; no cultivation procedure is provided.')
supply('spoiled-sample','Spoiled-batch sample','A paired teaching specimen, with process context kept separate from visible appearance.')
supply('batch-records','Matched batch records','Temperature, timing and ingredients are documented so a comparison is more than two unlabeled drops.')
supply('cell-free-extract','Cell-free yeast extract','A supplied 1897 demonstration record reports fermentation without intact living yeast cells; no preparation instructions.')
supply('fermentation-record','Extract fermentation record','The historical teaching record reports continuing conversion in the cell-free preparation.')
r('microscope','instrument-calibration','microscope-check','Microscope check','Focus and known structures are checked before interpreting an unfamiliar specimen.')
r('successful-culture','microscope-check','culture-observation','Culture observation','The observed small structures are recorded with instrument conditions; visibility alone does not establish a causal role.')
r('spoiled-sample','microscope-check','spoilage-observation','Spoilage observation','A contrasting observation is made with the same instrument discipline.')
r('culture-observation','spoilage-observation','microbial-comparison','Microbial comparison','The observations differ, but a causal claim still requires process context and further evidence.')
r('microbial-comparison','batch-records','microbial-account','Microbial account','The comparison connects organisms with successful and failed processes without pretending one image alone settles every mechanism.')
r('microbial-account','auditable-investigation','documented-process-case','Documented process case','Observations and batch evidence are kept linked; an industrial craft becomes an investigable problem.')
r('cell-free-extract','fermentation-record','cell-free-result','Cell-free result','The supplied evidence contradicts the claim that intact living cells are required at every moment of this fermentation.')
r('cell-free-result','documented-process-case','revised-mechanism','Revised fermentation mechanism','Soluble cellular machinery can act outside intact cells. Useful microbial control and the earlier observations are not thereby made worthless.')
r('revised-mechanism','circulation-limits','mechanism-with-limits','Mechanism with limits','A productive account can be revised when a missing component is investigated; the result is not a generic victory of “science over error.”')
goal('mechanism-with-limits','Revise the fermentation mechanism')

start('switching','A rule becomes a machine','1938 CE',1938,1938,'Relay logic workshop','The entry rule must work in hardware for every case. Use switches to realize the relation, then find a wiring that gives the same answer with less duplication.',['shannon','boole'],'documented_mathematical_application','Shannon’s 1938 paper applies propositional calculus to relay and switching circuits. This is genuine logic/electrical convergence, not Greek syllogism magically becoming electronics.')
supply('relay-unit','Relay unit','A supplied demonstration module has discrete open and closed states; no wiring or mains-power construction instructions are given.')
supply('series-layout','Series layout','A schematic path conducts only when both indicated contacts are closed.')
supply('parallel-layout','Parallel layout','A schematic path can conduct through either branch, including when both conduct.')
supply('reversing-contact','Reversing contact','A schematic contact represents the complement of one binary input.')
supply('duplicate-layout','Duplicated layout','An authored schematic repeats a branch unnecessarily; simplify without changing its case table.')
supply('fault-case','Fault case','One supplied case produces a forbidden output, showing why a convenient demonstration is insufficient.')
r('relay-unit','electromagnetic-record','binary-switch','Binary switch','The electromagnetic device is treated as a discrete switch within a specified operating model.')
r('binary-switch','series-layout','and-circuit','AND circuit','A series path realizes the conjunction of the two closed-contact conditions.')
r('binary-switch','parallel-layout','or-circuit','OR circuit','Parallel paths realize inclusive OR; the electrical arrangement matches the earlier logical cases.')
r('binary-switch','reversing-contact','not-circuit','NOT circuit','The supplied complementary contact realizes negation within the binary circuit model.')
r('checked-logic','and-circuit','specified-relay','Specified relay network','The earlier logical specification now constrains a physical schematic rather than remaining a notation exercise.')
r('specified-relay','or-circuit','permission-network','Permission network','The alternative input paths are incorporated into the specified logical relationship.','T')
r('permission-network','not-circuit','blocked-entry-network','Blocked-entry network','The blocking condition is represented explicitly; the network now implements the whole rule.','T')
r('blocked-entry-network','fault-case','tested-relay-network','Tested relay network','All cases, including the forbidden one, are checked against the Boolean specification.','T')
r('tested-relay-network','duplicate-layout','equivalent-circuit','Equivalent circuit','A simpler schematic is accepted only because it preserves the complete behavior, not because fewer parts automatically mean the same machine.')
goal('equivalent-circuit','Realize and simplify the rule')

start('communication','Send a message through an imperfect channel','1948 CE',1948,1948,'Shannon communication laboratory','Four symbols must cross a noisy channel. Save space at the sender, add protection where it is needed, and prove what the receiver can recover.',['shannon1948','repetition-mit','prefix-mit'],'documented_communication_theory_and_teaching_application','Source coding, channel coding and decoding are distinct operations. The toy channel corrects at most one flip per triplet; information quantity is not meaning or truth.')
supply('symbol-batch','Ten-symbol batch','A A A A A B B C C D: counts 5, 2, 2, 1. The message content is authored and its truth is irrelevant to code length.')
supply('prefix-codes','Prefix code table','A=0, B=10, C=110, D=111. No codeword begins with a complete shorter codeword.')
supply('fixed-code','Fixed-length table','A=00, B=01, C=10, D=11. Ten symbols need 20 bits with this table.')
supply('tripling-rule','Tripling rule','Send each bit three times. This costs three times as many channel bits and protects against at most one flip in each triplet.')
supply('channel-error','Toy channel errors','The teaching channel flips no more than one bit in each transmitted triplet. This is a stated bound, not a real-channel guarantee.')
supply('majority-rule','Majority decoder','Decode each triplet by its majority bit. The receiver must use the same boundaries and rule as the sender.')
r('symbol-batch','probability-table','source-counts','Source counts','Observed symbol counts give empirical weights. They measure this batch, not the importance of each symbol.')
r('source-counts','prefix-codes','variable-code-plan','Variable-length plan','The expected lengths for the batch are 5×1 + 2×2 + 2×3 + 1×3 = 18 bits.')
r('variable-code-plan','symbol-batch','packed-message','Packed message','The prefix table encodes this actual batch in 18 bits; the receiver still needs the same table.')
r('symbol-batch','fixed-code','fixed-message','Fixed-length message','The same ten symbols use 20 bits in the fixed-length representation.')
r('packed-message','fixed-message','compression-comparison','Compression comparison','This batch saves two bits with the supplied prefix code. A code can be worse for a different distribution.')
r('packed-message','tripling-rule','protected-transmission','Protected transmission','The 18 source-coded bits become 54 transmitted bits. Compression and error protection solve different problems.')
r('protected-transmission','channel-error','received-triplets','Received triplets','The channel changes the transmitted sequence; the receiver sees the damaged triplets, not the sender’s original bits.','T')
r('received-triplets','majority-rule','recovered-bits','Recovered bits','Majority recovers each bit under the stated one-flip-per-triplet bound. Two flips in a triplet could defeat it.','T')
r('recovered-bits','prefix-codes','decoded-message','Decoded message','The recovered bitstream is parsed with the prefix table and reconstructs the ten-symbol batch.','T')
r('decoded-message','equivalent-circuit','receiver-design','Receiver design','A logical receiver can carry out the decoding rule; successful reconstruction does not certify that a message is true or meaningful.')
r('receiver-design','compression-comparison','communication-account','Communication account','The account distinguishes source length, channel cost and successful recovery. No single “information” token replaces these different questions.')
goal('compression-comparison','Compare the two encodings',intermediate=True);goal('communication-account','Recover and account for the message',after='compression-comparison')

start('commons','A rule that can be changed','1990 CE',1990,1990,'Comparative commons workshop','Two communities share water differently. Build a locally workable agreement, and keep the evidence that would tell its users to revise it.',['ostrom'],'comparative_institutional_reconstruction','Ostrom’s work supports contextual, polycentric institutional analysis. Earlier evidence and logic tools are reused pedagogically; no Shannon-to-Ostrom intellectual lineage is asserted.')
supply('water-users','Water users','An invented group has upstream and downstream users with different needs and bargaining power.')
supply('resource-boundary','Resource boundary','The fictional irrigation system has defined access points and seasonal availability; boundaries can themselves be disputed.')
supply('withdrawal-record','Withdrawal record','An invented time series records withdrawals and shortfalls. Reporting can be incomplete or strategically distorted.')
supply('rule-proposal','Allocation proposal','A draft sets conditional allocations and a way to review them; it is not a universal optimum.')
supply('dispute-record','Downstream objection','The apparent average supply conceals a downstream shortfall during the dry interval.')
supply('neighbor-case','Neighboring community','A contrasting case has different infrastructure and enforcement relations. Copying its rule unchanged may fail.')
supply('revision-procedure','Revision procedure','Affected users can inspect the record, contest a decision and revise rules under an agreed process.')
r('water-users','resource-boundary','defined-commons','Defined commons','Users and resource boundaries are made explicit; naming a commons does not remove disagreement over membership.')
r('defined-commons','withdrawal-record','resource-account','Resource account','Access and withdrawals are linked to specific users and intervals, not reduced to one grand average.')
r('resource-account','auditable-investigation','monitoring-record','Monitoring record','The record keeps observations, gaps and interpretations distinguishable so users can contest the evidence.')
r('rule-proposal','checked-logic','explicit-allocation','Explicit allocation rule','Conditions are made unambiguous. Formal consistency cannot settle whose interests should have priority.')
r('explicit-allocation','monitoring-record','trial-agreement','Trial agreement','A locally specified rule is tested against the documented resource situation instead of assumed to work everywhere.')
r('trial-agreement','dispute-record','distribution-problem','Distribution problem','A successful average can conceal unequal burdens. The downstream objection changes what the agreement must address.')
r('distribution-problem','revision-procedure','revisable-agreement','Revisable agreement','Users have a way to contest and alter the rule; revision is part of the institution rather than evidence of total failure.')
r('revisable-agreement','neighbor-case','context-comparison','Context comparison','Contrasting institutions expose conditions of success and failure, not a ladder with one final design.')
r('context-comparison','open-question','open-atlas','Commons atlas','The atlas now holds an inspectable, revisable agreement. Records, models and arguments remain useful because their limits remain open to challenge.')
goal('open-atlas','Build the commons atlas')

# The following chapters are speculative fiction, not dated forecasts or current
# capability claims. Sources bound the inherited ideas; they do not validate the inventions.
registry['aegis']={'id':'aegis','title':'NASA/JPL: AEGIS autonomous science targeting','url':'https://ai.jpl.nasa.gov/public/projects/aegis/','note':'Actual bounded target-selection autonomy. It is not evidence that the fictional self-questioning laboratory exists.'}
registry['personal-identity']={'id':'personal-identity','title':'Stanford Encyclopedia of Philosophy: Personal Identity','url':'https://plato.stanford.edu/entries/identity-personal/','note':'Philosophical distinctions and thought experiments; not evidence for uploading, artificial consciousness or a settled identity criterion.'}

start('future-observatory','The observatory asks a second question','Speculative future I · undated',None,None,'A self-questioning observatory','A new colony of living light changes overnight. Build an observatory that chooses an experiment, sees its own prediction fail, and asks a better question.',['aegis','nist','fermentation'],'speculative_synthesis','The fictional platform extends bounded instrument autonomy into a constrained experimental loop. It is not a claim of current general scientific intelligence.')
current['speculative']=True
supply('growth-rivals','Light or nutrients?','Two fictional models predict the same ordinary growth but different responses when light and nutrients vary separately.')
supply('trial-menu','Light × nutrient trials','A bounded menu permits four non-destructive comparisons with measured light and nutrient conditions; no biological engineering instructions are given.')
supply('spectral-sensor','Spectral sensor','A fictional supplied sensor records changing light absorption; it does not read intention or directly prove metabolism.')
supply('sealed-chamber','Observation chamber','A supplied sealed observation bay for the fictional living-light specimens.')
supply('surprising-bloom','Bloom in the dark','The fictional observations contradict the current growth model: a darkened chamber blooms unexpectedly.')
r('mechanism-with-limits','growth-rivals','competing-growth-predictions','Competing growth predictions','The two accounts agree on ordinary cases but diverge under specified interventions. The instrument needs a discriminating question, not merely more images.')
r('checked-logic','trial-menu','experiment-lattice','Experiment lattice','The four permissible condition combinations are represented explicitly. This small search space makes the proposed autonomy inspectable.')
r('competing-growth-predictions','experiment-lattice','distinguishing-trial','Distinguishing trial','A comparison is chosen because the rival models predict different observations, not because it produces the largest quantity of data.')
r('optical-model','spectral-sensor','metabolic-imager','Living-light imager','Inherited optical geometry becomes a speculative instrument for following the colony’s changing spectral pattern. The image is evidence, not a complete mechanism.')
r('sealed-chamber','metabolic-imager','instrumented-chamber','Instrumented chamber','The bay gains an imager while retaining a recognizable chamber; the specimen can be observed under the stated trial conditions.','T')
r('instrumented-chamber','distinguishing-trial','self-questioning-lab','Self-questioning laboratory','The chamber can select and carry out one discriminating trial from its bounded menu. This is a fictional new capability, not an unrestricted claim of machine understanding.','T')
r('self-questioning-lab','surprising-bloom','anomalous-growth','Unexpected growth pattern','The dark bloom defeats the current prediction. The observatory preserves the failed model and the surprising evidence rather than silently declaring success.')
r('anomalous-growth','probability-table','next-question','A better next question','The anomalous case changes which remaining comparison is most informative. An invented selection policy ranks questions under a finite experimental budget.')
r('self-questioning-lab','next-question','learning-observatory','Learning observatory','The same apparatus now chooses its next falsifiable test in response to evidence. It can discover something surprising without becoming an oracle.','T')
goal('self-questioning-lab','Build the questioning laboratory',intermediate=True);goal('learning-observatory','Make a learning observatory',after='self-questioning-lab')

start('future-memory','A memory with several first persons','Speculative future II · undated',None,None,'The choral memory garden','Build a courtyard that several people can remember together. Let visitors exchange viewpoints without turning conflicting lives into one official past.',['personal-identity','alexandria','shannon1948'],'speculative_synthesis','Shared immersive memory is invented. Reproducing information or a first-person narrative does not by itself establish personal continuity, consciousness or moral status.')
current['speculative']=True
supply('immersive-surface','Immersive courtyard','A fictional spatial display can turn a documented image into an inhabitable reconstruction; unseen detail must be generated, not recovered by magic.')
supply('conflicting-memories','Gate open / gate barred','Two fictional witnesses remember incompatible events. Both accounts have gaps; neither is made automatically true by its vividness.')
supply('experience-code','Perspective encoding','A speculative representation links a scene to viewpoint, source, affective tags and gaps; it is not a complete encoding of a human mind.')
supply('viewpoint-exchange','Exchange viewpoints','A fictional interface lets each participant revisit the other’s reconstructed perspective while retaining the distinction between their sources.')
supply('we-name','A shared “we”','The participants propose a new collective identity for the shared archive. This need not make it the same individual as any contributor.')
r('photographic-archive','immersive-surface','revisitable-courtyard','Revisitable courtyard','The courtyard can be explored again, but reconstructed regions remain marked. A living spatial experience is not direct access to the vanished event.')
r('variant-table','conflicting-memories','branching-recollection','Branching recollection','The two gates remain alternative paths instead of being averaged into a confident false past.')
r('revisitable-courtyard','branching-recollection','layered-memory','Layered memory','A visitor can enter either recollection and see where it differs. Contradiction becomes part of the experience rather than an annotation hidden outside it.','T')
r('communication-account','experience-code','shareable-perspective','Shareable perspective','A perspective can be encoded and transmitted with its provenance and gaps. Perfect transfer of the code would not settle whether the experience itself has been transferred.')
r('layered-memory','shareable-perspective','memory-garden','Shared memory garden','Multiple contributors can inhabit a common reconstruction while each voice retains its own provenance. This is a fictional shared medium, not uploaded people.','T')
r('memory-garden','viewpoint-exchange','reciprocal-memory','Reciprocal memory','Participants can move between distinct perspectives. They gain access to another account without erasing the difference between remembering and learning a story.')
r('reciprocal-memory','we-name','collective-self-model','Collective self-model','The participants create a “we” with several sources and no single original. The model opens, rather than solves, the question of what kind of identity it is.')
r('collective-self-model','open-atlas','plural-identity','Plural identity','A revisable institution can recognize contributions and disagreements without declaring that the new collective is literally every person it remembers.')
r('memory-garden','plural-identity','choral-memory','Choral memory','The garden speaks in distinguishable voices and preserves competing paths. A new shared form of memory is created without crowning one seamless official self.','T')
goal('memory-garden','Grow the shared memory garden',intermediate=True);goal('choral-memory','Create a choral memory',after='memory-garden')

start('future-city','A city that lives by its agreements','Speculative future III · undated',None,None,'The metabolic city','Living walls feed a district—but their shade deprives the next neighborhood. Make the city learn and share, so its ecology and its rules can change together.',['fermentation','ostrom','nist'],'speculative_synthesis','The living infrastructure and integrated city are fictional. Actual fermentation and institutional research supply questions and constraints, not validation of a safe deployable biotechnology.')
current['speculative']=True
supply('symbiont-plan','Complementary living partners','An invented consortium pairs light capture with waste transformation. These are fictional functional roles, not organisms, sequences or cultivation instructions.')
supply('wall-scaffold','Living-wall scaffold','A supplied fictional structure holds the proposed living partners in an inspectable district installation.')
supply('water-loop-plan','Water and nutrient loop','A fictional flow plan makes inputs, outputs and losses explicit; recycling does not imply perfect closure or free energy.')
supply('day-night-record','Day / night resource flow','An authored sequence records changing light, storage, water and waste demands rather than assuming a constant average day.')
supply('downstream-shade','Food here, shade next door','The city’s productive wall reduces light for a neighboring district. Benefits and burdens are spatially unequal.')
supply('symbiont-change','A partner changes behavior','A fictional ecological change alters the wall’s output. Neither the biological community nor its social setting can be frozen forever.')
r('microbial-account','symbiont-plan','metabolic-partnership','Metabolic partnership','The hypothetical partners perform complementary transformations. The proposal remains an invented mechanism, not a construction protocol.')
r('wall-scaffold','metabolic-partnership','living-wall','Living wall','The scaffold becomes a productive living surface whose inputs and outputs can be observed. Its agency is not assumed to be a human kind.','T')
r('living-wall','water-loop-plan','cycling-facade','Cycling façade','The living surface joins a water and nutrient loop. Material losses remain part of the account rather than disappearing behind the word sustainable.','T')
r('learning-observatory','day-night-record','adaptive-cycle','Adaptive resource cycle','The observatory selects measurements that distinguish storage failure, changing demand and biological change; the city can investigate its own operation.')
r('cycling-facade','adaptive-cycle','responsive-district','Responsive district','The same living installation can adjust within the fictional tested operating range. The capability creates a new question about who receives its benefits.','T')
r('responsive-district','downstream-shade','unequal-city','Unequal city experience','The local success has a neighboring cost. More production in one place is not automatically a better collective outcome.')
r('choral-memory','unequal-city','inhabited-city-model','Inhabited city model','Residents can explore the district from competing positions, including those in shade. The shared model makes disagreement experiential rather than averaging it away.')
r('inhabited-city-model','revisable-agreement','seasonal-city-rule','Seasonal city rule','A proposed rule changes production and shading across seasons. Those affected can revise it as their experience and the ecology change.')
r('responsive-district','seasonal-city-rule','metabolic-commons','Metabolic commons','The living infrastructure and the shared rule operate as one revisable system; neither engineering nor governance is an afterthought.','T')
r('metabolic-commons','symbiont-change','evolving-city','Evolving city','The city responds to a changed living partner by reopening observation and allocation rather than pretending to be a finished utopia. Its capacity to ask again is part of what has been built.','T')
goal('metabolic-commons','Build the metabolic commons',intermediate=True);goal('evolving-city','Create an evolving city',after='metabolic-commons')


# A physical telescope really incorporates its supplied lens pair; the tube changes
# identity at its own position, and the fitted lenses stay visible on the assembly.
telescope_recipe=next(r for r in S['recipes'] if r['out']=='telescope')
telescope_recipe['lifecycle']={
 'lens-pair':{'role':'incorporate','reason':'The supplied lenses are fitted into this optical tube, not left as a second loose set.'},
 'optical-tube':{'role':'transform','reason':'This same tube becomes the aligned telescope at its own position.'}}
telescope_recipe['preserve']=['lens-pair']

# The invented assemblies keep their visible functional components through renaming.
for output,primary,component in [
 ('instrumented-chamber','sealed-chamber','metabolic-imager'),
 ('living-wall','wall-scaffold','metabolic-partnership')]:
 rec=next(r for r in S['recipes'] if r['out']==output)
 rec['lifecycle'][component]={'role':'incorporate','reason':'This component becomes part of the same visible assembly, not a duplicate loose item.'}
 rec['preserve']=[component]
for output,primary in [
 ('self-questioning-lab','instrumented-chamber'),('learning-observatory','self-questioning-lab'),
 ('cycling-facade','living-wall'),('responsive-district','cycling-facade'),
 ('metabolic-commons','responsive-district'),('evolving-city','metabolic-commons')]:
 next(r for r in S['recipes'] if r['out']==output)['preserve']=[primary]

# Essential distinctions live in visible labels, not only hidden descriptions.
visible_labels={
 'grain-count':'12 + 18 measures','units':'Grain, not jars','night-records':'Seen / clouded / missed','older-eclipses':'Earlier eclipse intervals',
 'cause-claim':'Every dimming = cover','rival-cause':'Same result, rival cause','new-case':'Dimming without cover','meaning-note':'Dark ≠ covered',
 'copy-a':'Copy A: missing reason','copy-b':'Copy B: wrong label','square-strips':'x² + 6x diagram','corner-square':'3 × 3 missing corner','merchant-account':'Unknown + 5 = 12',
 'reader-objection':'Ray crosses opaque wall','market-problem':'3 lengths cost 18','swapped-label':'A and B swapped','adult-jaw':'Adult human mandible',
 'galenic-drawing':'Older two-part jaw claim','venus-record':'Changing Venus phases','source-positions':'Two lamp positions','still-record':'Steady current: no pulse',
 'reversal-record':'Reverse change: − pulse','ring-record':'Switch change: brief pulse','growth-assumptions':'Double each interval','starting-population':'Population starts at 100','provision-series':'100, 200, 300, 400',
 'remaining-rounds':'AA / AB / BA / BB','unfair-coin':'Rounds may be biased','fair-share':'A: 3 coins · B: 1',
 'binary-cases':'00 / 01 / 10 / 11','either-rule':'A OR B (or both)','both-rule':'A AND B','not-rule':'NOT A','compound-rule':'(A OR B) AND NOT C',
 'or-table':'OR: 00 fails','and-table':'AND: only 11 passes','not-table':'NOT: 0 ↔ 1','symbol-batch':'AAAAABBCCD','prefix-codes':'A0 B10 C110 D111','fixed-code':'A00 B01 C10 D11',
 'source-counts':'A5 B2 C2 D1','packed-message':'18-bit packed message','fixed-message':'20-bit fixed message','tripling-rule':'Each bit × 3','protected-transmission':'54 transmitted bits',
 'channel-error':'≤1 flip per triplet','majority-rule':'Majority of each triplet','dispute-record':'Downstream runs dry',
 'death-list':'11 deaths, 11 addresses','supplier-linked-record':'Supply deaths: A8 B3','served-households':'Homes: A100 B300','supplier-rates':'Per 100 homes: A8 B1',
}
for id,label in visible_labels.items():items[id]['label']=label
# Deliberate source-reading content for the parent's optional manuscript reader.
# This is curated dossier text, not automatic exposure of generic descriptions,
# gameplay instructions, result previews, or attributed invented quotations.
dossiers={
 'grain-count':('The store received 12 measures of grain in the morning and 18 in the evening. The account concerns grain measures, not a count of jars.','Authored arithmetic dossier; inspired by cuneiform accounting, not a translated tablet.'),
 'night-records':('Watch 1: the event was seen. Watch 2: cloud hid the relevant part of the sky. Watch 3: no observer was present. “Not seen” has three different evidential meanings here.','Authored observational dossier, not a Babylonian quotation.'),
 'older-eclipses':('This deliberately simplified teaching series lists several recurring eclipse opportunities. Some events were seen; some were obscured. The intervals suggest another watch, but neither a clear sky nor an eclipse is guaranteed.','Authored schematic series; not an authentic Babylonian algorithm or calendar.'),
 'omen-text':('The same celestial event may appear in a record of what happened and in an interpretation of what it means for a ruler or city. Mesopotamian observation and divination were not mutually exclusive activities.','Historical paraphrase of the research scope in Rochberg; no ancient words quoted.'),
 'cause-claim':('Speaker A: “Every darkening is caused by a covering body. This is a darkening. Therefore a body is covering the light.” The observed case and the universal premise are different claims.','Fictional teaching speech, not Aristotle’s dialogue.'),
 'rival-cause':('Speaker B proposes a different mechanism but predicts the same darkening at the same time. Agreement with this one prediction will not distinguish the two mechanisms.','Authored logic case; not a historical claim that these speakers existed.'),
 'new-case':('A recorded dimming occurs when the proposed covering body is absent. If the record and classification are accepted, the unrestricted claim “every darkening is a covering” fails.','Authored counterexample, not an actual ancient observation.'),
 'copy-a':('Witness A names a segment AB, two circles centred on A and B, and their intersection C. It says the three sides are equal but omits the reason. The witness is invented.','Authored textual witness adapting the structure of Euclid, Elements I.1; not a quotation.'),
 'copy-b':('Witness B explains that the relevant sides are equal radii, but one copied label calls the intersection D rather than C. The disagreement must remain visible while an editor proposes a reading.','Authored textual witness, not a surviving ancient manuscript.'),
 'syriac-witness':('Some Greek scientific and philosophical works reached Arabic through Syriac intermediaries; other routes differed. A mathematical translation must preserve what a term does in a proof, not merely its dictionary equivalent.','Historical paraphrase; Greek Sources in Arabic and Islamic Philosophy, Stanford Encyclopedia of Philosophy.'),
 'indian-numerals':('In positional decimal notation the same digit has different values in 3, 30 and 300. A vacant position must be represented consistently. Indian arithmetic enters this workshop as an independent tradition, not an invention made from the Greek proof.','Modern demonstration within a historical reception setting; not an al-Khwarizmi quotation.'),
 'merchant-account':('An unknown amount, with five units added, equals twelve units. The modern shorthand is x + 5 = 12. Modern notation is used to make the teaching case compact, not credited to the ninth-century manuscript.','Authored algebra case, not a historical transcription.'),
 'square-strips':('A square of side x has area x². Two strips, each of width 3 and length x, add 6x. Their arrangement leaves a 3-by-3 corner. All lengths in this geometric case are positive.','Modern positive-magnitude illustration of square completion; not an unrestricted historical symbolic formula.'),
 'reader-objection':('The copied line passes through the opaque part of the wall. The model permits light through the opening, not through this wall. A fluent text can accompany an impossible copied diagram.','Authored manuscript-inspection dossier.'),
 'market-problem':('Three equal lengths of cloth cost eighteen units. A second customer asks for five lengths of the same cloth. The unit of comparison is one cloth length, not one purchase.','Authored merchant-arithmetic case, not a Liber abaci quotation.'),
 'swapped-label':('The trial page has exchanged the labels A and B while the adjacent explanation has not changed. Multiple identical copies would reproduce this disagreement more efficiently, not make it correct.','Authored printing-proof dossier.'),
 'galenic-drawing':('The teaching plate presents a two-part lower jaw. The comparison concerns an adult human mandible. Galen’s anatomical tradition contains much more than this disputed claim, and evidence from other animals is not automatically human evidence.','Historical teaching paraphrase informed by the Vesalius jaw study; not an authentic Galenic quotation.'),
 'venus-record':('The supplied sequence includes phases incompatible with a simple Ptolemaic Venus arrangement. Competing geoheliocentric arrangements could also account for them. One model can be rejected without all alternatives disappearing.','Historical teaching paraphrase; not a claim that this table is Galileo’s actual notebook.'),
 'tycho-table':('This table represents accurately recorded planetary positions made before the telescope. A later instrument does not make careful earlier observations valueless. A model must answer positional discrepancies as well as familiar periodic returns.','Historical teaching representation, not copied numerical data from Tycho.'),
 'heart-estimate':('For the arithmetic exercise only, assume a conservative 5 millilitres pass per beat. Treat it as an estimate with explicit units, not a modern measurement of typical cardiac output.','Invented historical-teaching quantity; not clinical information or Harvey’s exact measurement.'),
 'beat-count':('For this exercise use 60 beats per minute over 30 minutes. The point is to account for repeated passage over an interval, not to infer someone’s health from a heart rate.','Invented calculation input; not a medical reference range.'),
 'blood-stock':('The exercise compares the computed repeated throughput with an available stock of 5 litres. A cumulative flow and a quantity present at one moment are different kinds of measurement.','Invented calculation input; not Harvey’s exact estimate or individual medical advice.'),
 'return-path':('A proposed circuit returns blood toward the heart. Some connecting passages are not directly observed in this historical scene; later microscopic findings must not be retroactively placed in Harvey’s hands.','Historical teaching paraphrase, not a complete reconstruction of Harvey’s reasoning.'),
 'score-state':('A fair, independent-round game ends when either player reaches three wins. It stops at A=2, B=1. A needs one further win; B needs two. There are four coins in the stake.','Authored instance of the interrupted-game problem; not the exact numbers of a Pascal–Fermat letter.'),
 'rival-method':('Instead of listing every continuation, consider the values of the positions immediately before the game can end, and reason backward through a fair next round. The correspondence permits different successful methods and correction of misunderstandings.','Modern teaching paraphrase inspired by the 1654 correspondence; not a quotation.'),
 'weekly-bills':('These reconstructed bills distinguish dates, parish headings, burial counts and uncertain cause labels. The categories are not modern diagnoses; inconsistent headings must not silently become precise medical facts.','Authored dossier inspired by Graunt’s use of bills of mortality, not actual mortality data.'),
 'growth-assumptions':('The pamphlet’s schematic comparison assumes repeated doubling of population and equal additions to provisions. Those are premises of a model. Changing technology, institutions, distribution or reproductive patterns can change the argument’s application.','Teaching paraphrase of the 1798 population argument; not an empirical universal law.'),
 'policy-claim':('A writer says that the growth model by itself dictates one policy. To reach that policy, the writer must also supply judgments about rights, welfare, institutions and the available alternatives. Multiplication does not contain those judgments.','Fictional political-economy argument; not an attributed historical quotation.'),
 'ring-record':('The supplied record distinguishes the moment a first circuit changes, a steady interval, and the reverse change. The second circuit shows brief responses at the changes, not a steady response throughout.','Historical teaching account of Faraday’s ring-coil investigation; no apparatus-construction instructions.'),
 'exposure-record':('The image records one exposure, process and viewpoint. The material’s tonal response and the chosen frame omit information. A detailed photographic image is not the entire scene and does not authenticate its own caption.','Authored photographic-source dossier.'),
 'compound-rule':('Permit entry if A or B holds, including both, and C does not hold. The parentheses in (A OR B) AND NOT C determine which condition blocks the permission. Formal consistency does not establish that the entry policy is just.','Authored binary-logic case; modern notation, not Boole’s original wording.'),
 'supplier-receipts':('In this invented address dossier, supplier identification associates eight of the eleven affected households with A and three with B. Customers of both suppliers occur on the same streets. A street name alone does not identify supply.','Authored mini-dataset; these are not Snow’s historical counts.'),
 'served-households':('Company A serves 100 households; company B serves 300. The death records cover the same interval. These denominators belong to the invented exercise, not the original London investigation.','Authored mini-dataset; deaths per household are not a person-level risk estimate.'),
 'alternative-causes':('Supplier misclassification, reporting gaps, household differences and other exposures could affect the comparison. Intermixed customers reduce some spatial differences; they do not make assignment randomized.','Historical-method teaching note, not a contemporary health recommendation.'),
 'lyell-volume':('Darwin drew on Lyell’s geological work while reaching conclusions Lyell did not initially share. A book can make a new argument possible without its author agreeing with the result.','Historical paraphrase; University of Edinburgh and Darwin Correspondence Project accounts.'),
 'wallace-essay':('Wallace independently developed reasoning toward natural selection. The 1858 presentation brought his work together with Darwin’s. The history is not one discoverer plus an interchangeable confirmation slip.','Historical paraphrase; Darwin Correspondence Project. No essay text quoted.'),
 'cell-free-extract':('The 1897 evidence reports fermentation by a preparation without intact living yeast cells. It challenges the claim that intact living cells are required at each moment, not every earlier observation about useful microbial processes.','Paraphrase of Buchner’s reported result, not experimental preparation instructions.'),
 'prefix-codes':('The table is A=0, B=10, C=110, D=111. No complete codeword is the beginning of another. The receiver must know the same table and where the encoded sequence begins.','Authored source-coding example, not a quotation from Shannon.'),
 'tripling-rule':('Repeat each encoded bit three times. The model assumes at most one changed bit in any triplet. This introduces a transmission cost and a specific recoverability condition, not universal immunity to noise.','Authored channel-coding example; no claim that this is Shannon’s optimal code.'),
 'rule-proposal':('The fictional community proposes conditional allocations and a review process. Upstream and downstream users have different positions. A coherent rule is not automatically legitimate, and one successful local arrangement is not a universal institutional design.','Authored commons case, informed by Ostrom; not a legal instrument or quotation.'),
 'growth-rivals':('In this fiction, one model attributes a colony’s light pattern chiefly to illumination, another to available nutrients. They agree under ordinary conditions but diverge when those conditions vary separately. The platform has only a bounded menu of tests.','Speculative fiction. AEGIS supports bounded targeting autonomy, not the existence of this laboratory.'),
 'surprising-bloom':('In the fictional darkened chamber, the colony blooms when the current model predicts no bloom. The observation is retained with its conditions; the model is not silently rewritten so that it “always predicted” the result.','Speculative experimental event, not a report of an existing organism or device.'),
 'conflicting-memories':('One fictional contributor remembers the courtyard gate opening; another remembers it barred. Both accounts have gaps. The display can preserve both paths, but vividness does not resolve which event occurred.','Speculative memory-garden dossier; not real personal information.'),
 'we-name':('The participants propose a shared “we” for the memory garden. Its continuity as a collective, its relationship to each contributor, and any claim to personal identity are different questions. This fiction does not settle artificial consciousness or moral status.','Speculative identity proposal, informed by philosophical thought experiments; not a feasibility claim.'),
 'symbiont-plan':('The fictional city pairs complementary functions: capturing light, transforming waste and storing useful material. No organism, sequence, growth procedure or deployable engineering specification is supplied. Its possibility is assumed only within the story.','Speculative biological infrastructure; not validated biotechnology.'),
 'downstream-shade':('The living wall produces more food for its own district, but casts a longer shadow over neighboring growing surfaces. Higher total production and a fair distribution of benefits are not the same question.','Speculative civic-ecology case, not a real deployment claim.'),
}
for id,(text,attribution) in dossiers.items():items[id]['reading']={'text':text,'attribution':attribution}
(ROOT/'reading-inventory.json').write_text(json.dumps([{'item':id,'label':items[id]['label'],'attribution':a} for id,(t,a) in dossiers.items()],ensure_ascii=False,indent=2)+'\n')

# Relationship metadata is claim-specific, not a blanket causal story for every edge.
# Unlisted edges are honest re-use in a reconstruction, never inferred personal influence.
documented={
 ('alexandria','baghdad'):'Greek geometrical texts were translated and developed in Arabic, sometimes through Syriac witnesses.',
 ('baghdad','cairo'):'Greek/Arabic mathematical traditions informed Ibn al-Haytham’s geometrical optical investigations.',
 ('baghdad','latin'):'Arabic and Indian-derived arithmetic reached Latin readers, including Fibonacci’s North-African learning.',
 ('cairo','latin'):'Ibn al-Haytham’s optical work circulated as Latin De aspectibus around 1200.',
 ('alexandria','printing'):'Euclidean geometry reached printed Latin editions through manuscript and translation traditions.',
 ('latin','printing'):'Mathematical manuscripts were adapted to printed editions; a specific edition requires its own object evidence.',
 ('printing','anatomy'):'Vesalius’s anatomy joined illustrations, textual correction and printed dissemination.',
 ('anatomy','circulation'):'Harvey’s circulation argument worked within an anatomical tradition rather than beginning from isolated quantities.',
 ('latin','astronomy'):'Kepler explicitly revised the Latin optical tradition, including Witelo.',
 ('astronomy','motion'):'Newtonian celestial mechanics addressed astronomical observations and mathematically described orbits.',
 ('population-pressure','species'):'Darwin explicitly recalled the stimulus of reading Malthus alongside his existing natural-history observations.',
 ('deep-time','species'):'Geological process reasoning and Lyell’s work informed Darwin; disagreement remained.',
 ('logic','switching'):'Shannon’s 1938 paper explicitly applied propositional calculus to relay circuits.',
 ('fields','switching'):'Electromagnetic devices and switching engineering supplied the physical problem for logical circuit analysis.',
 ('cairo','photography'):'Photography combined camera-obscura image formation with photosensitive processes; this is not an exclusive-inventor claim.',
}
for e in edges:
 key=(e['from'],e['to'])
 if next(c for c in chapter if c['id']==e['to']).get('speculative'):
  e['relation']='speculative_synthesis';e['claim']='Fictional new capability built from these earlier creations; cited sources bound inherited ideas, not the feasibility of this invention.';e['confidence']='explicitly speculative, not a forecast or current-capability assertion'
 elif key in documented:
  e['relation']='documented_tradition_or_application';e['claim']=documented[key];e['confidence']='source supports the bounded historical connection, not literal survival of this teaching token'
 else:
  e['relation']='pedagogical_reuse';e['claim']='A previously created representation performs real work in this dated reconstruction; no direct historical debt between the named figures is asserted.';e['confidence']='gameplay dependency; not evidence of historical transmission'

# Deterministic scene-local carry: authored operands only, including alternatives.
# No item is carried merely because an even later scene might need it.
for c,st in zip(chapter,S['stages']):
 rs=[r for r in S['recipes'] if r['id'] in c['recipes']]
 st['carry']=sorted({x for r in rs for x in [r['a'],r['b']] if not x.startswith('@')}|set(c['goals']))
# Final goals which feed another local listed goal must be explicit intermediate goals.
# Authored objective sequences are refined by graph semantics, never user-visible carry narration.
for c,st in zip(chapter,S['stages']):
 for o in st['objectives']:
  reachable={o['item']}
  for rec in [r for r in S['recipes'] if r['id'] in c['recipes']]:
   if rec['a'] in reachable or rec['b'] in reachable:reachable.add(rec['out'])
  later=[z for z in st['objectives'] if z!=o and z['item'] in reachable]
  if later:
   o['intermediate']=True
   nearest=later[0]
   nearest.setdefault('after',[])
   if o['id'] not in nearest['after']:nearest['after'].append(o['id'])
used_sources={x for it in S['items'] for x in it.get('sources',[])}
assert used_sources <= registry.keys(),used_sources-registry.keys()
S['sources']=[registry[x] for x in sorted(used_sources)]
for name,value in [('scenario.json',S),('chapters.json',chapter),('connections.json',edges)]:
 (ROOT/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'chapters':len(chapter),'recipes':len(S['recipes']),'items':len(S['items']),'prior_created_uses':len(edges),'disconnected':[c['id'] for c in chapter[1:] if not c['earlier']]}))

# A fresh, self-contained opening slice; no invented checkpoint inventory.
pilot={**S,'id':'atlas-connected-opening-v1-research','stages':S['stages'][:5],'premise':'Opening slice: follow records, arguments and mathematical texts from a Babylonian teaching collection through Greek and Arabic investigations of light. These five chapters are dated reconstructions, not a universal origin story. Their numerical cases and dialogue are authored.'}
opening_items={x for c in chapter[:5] for x in c['created']+c['supplies']}
opening_recipes={x for c in chapter[:5] for x in c['recipes']}
pilot['items']=[i for i in S['items'] if i['id'] in opening_items]
pilot['recipes']=[r for r in S['recipes'] if r['id'] in opening_recipes]
pilot['locations']=[x for x in S['locations'] if x['id']=='dark-room']
(ROOT/'opening-arc.json').write_text(json.dumps(pilot,ensure_ascii=False,indent=2)+'\n')
