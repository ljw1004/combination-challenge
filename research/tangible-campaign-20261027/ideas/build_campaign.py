"""Authoring source. Recipes are playable conceptual models, never historical causal proofs."""
import json,re,pathlib
ROOT=pathlib.Path(__file__).parent
SOURCES=[
('hutton','Siccar Point: geological evidence and Hutton','https://iugs-geoheritage.org/geoheritage_sites/siccar-point/','Hutton used an unconformity to support an existing account of repeated geological processes; one scene does not establish every feature of his theory.'),
('vesalius','NLM: Andreas Vesalius','https://www.nlm.nih.gov/exhibition/historicalanatomies/vesalius_bio.html','The Fabrica both relied on and corrected Galen. This is not a rejection of every inherited account.'),
('harvey','OU primary-book exhibition: Harvey','https://galileo.ou.edu/exhibits/anatomical-exercises-dr-william-harvey.html','Harvey used quantitative, experimental, analogical and teleological arguments. Recipes isolate questions rather than reconstruct his whole reasoning.'),
('longitude','Royal Museums Greenwich: Harrison and longitude','https://www.rmg.co.uk/stories/time/harrisons-clocks-longitude-problem','Chronometers and lunar distances coexisted. Sea trials, cost and reproducibility matter alongside invention.'),
('perspective','National Gallery: perspective','https://www.nationalgallery.org.uk/paintings/glossary/perspective','Linear perspective is one historically specific representational practice, not the culmination of all painting.'),
('algebra','Oxford History of Science Museum: mathematics in Islamic cultures','https://www.mhs.ox.ac.uk/scienceislam/mathematics.html','Practical problems, inherited mathematics and original contributions cross languages and regions. No exclusive origin claim.'),
('probability','Pascal–Fermat correspondence, 1654','https://www.york.ac.uk/depts/maths/histstat/pascal.htm','The interrupted-game problem is a case study, not the first human reasoning about chance.'),
('newton','Cambridge: Newton Principia manuscript','https://cudl.lib.cam.ac.uk/view/MS-ROYALSOCIETY-00069/1','Mathematical recipes are modern teaching models; they do not assert the Principia was written in modern calculus notation. Newton and Leibniz developed calculus independently.'),
('darwin','Darwin: On the Origin of Species, first edition','https://darwin-online.org.uk/content/contentblock?basepage=1&hitpage=507&itemID=PC-Virginia-Francis-F373&viewtype=text','Historical primary text, not endorsement of every nineteenth-century claim; natural selection is not inevitable progress or a moral rule. Wallace is a parallel contributor.'),
('snow','UCLA: Snow’s grand experiment','https://epi-snow.ph.ucla.edu/Stream3_GrandExperiment_d.html','Compare water companies and denominators, not merely dots on a map. Observational comparisons have limitations.'),
('snow-myth','UCLA: Broad Street outbreak context','https://epi-snow.ph.ucla.edu/Stream2_BSPoutbreak_f.html','Do not claim a map alone revealed the cause, or pump-handle removal alone ended an already declining outbreak.'),
('photo','Metropolitan Museum: Talbot and photography','https://www.metmuseum.org/pt/essays/william-henry-fox-talbot-1800-1877-and-the-invention-of-photography','Several processes and contributors; a reproducible negative differs from a unique direct-positive image. No chemical procedure is taught.'),
('shannon','Shannon: A Mathematical Theory of Communication','https://www.essrl.wustl.edu/~jao/itrg/shannon.pdf','Information-theoretic quantities do not measure truth, significance or wisdom.'),
('ostrom','Elinor Ostrom: Beyond Markets and States','https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/lecture/','Institutional design is contextual; neither markets, states nor commons automatically solve every collective-action problem.'),
]
# Each line is two inputs -> a recognizable product. The last two named outputs are goals.
# New unproduced inputs are supplied by a contextual collection, never by an invisible level grant.
CHAPTERS=[
('ask','A claim worth testing','Archive keeper','Our atlas will travel further than any of us. Before we trust its pages, make a testable question and a repeatable experiment.','The traveling archive','Field notebooks, measuring tools and drafts from the archive’s teaching collection.',[], '''
Observation + Notebook = Field note
Field note + Comparison = Pattern
Pattern + Question = Hypothesis
Hypothesis + Prediction = Testable question
Measuring scale + Reference standard = Calibrated scale
Calibrated scale + Repeated readings = Measurement series
Measurement series + Notebook = Measurement record
Variable + Fixed conditions = Controlled comparison
Controlled comparison + Testable question = Experimental protocol
Experimental protocol + Measurement record = Repeatable experiment
''', ['Testable question','Repeatable experiment']),
('argument','Disagreement in the agora','Debate host','Two speakers sound equally certain. Give our audience a valid argument and a counterexample that exposes a mistaken generalization.','An Athenian teaching reconstruction','A rhetoric teacher’s example claims, diagrams and disputed cases.',[], '''
Claim + Reason = Argument
Argument + Stated assumptions = Explicit premises
Explicit premises + Inference rule = Valid argument
General claim + Contrary case = Counterexample
Word + Competing meanings = Ambiguity
Ambiguity + Context = Disambiguated term
Disambiguated term + Question = Precise question
Precise question + Explicit premises = Structured debate
Structured debate + Counterexample = Revised claim
Revised claim + Valid argument = Defensible conclusion
''',['Counterexample','Defensible conclusion']),
('texts','A book with several pasts','Alexandrian editor','Our copies disagree. Prepare a critical edition that preserves the disagreements, and a translation readers can question rather than blindly trust.','Alexandria’s imagined editorial workshop','The collection contains variant manuscripts, damaged leaves, a bilingual glossary and correspondence.',[], '''
Manuscript copy + Variant manuscript = Collation
Collation + Line numbers = Variant table
Variant table + Scribal patterns = Textual family
Textual family + Damaged passage = Reconstructed reading
Reconstructed reading + Uncertainty marks = Critical text
Critical text + Variant table = Critical edition
Foreign passage + Bilingual glossary = Draft translation
Draft translation + Context = Annotated translation
Annotated translation + Critical edition = Parallel edition
Parallel edition + Source attribution = Citable edition
''',['Critical edition','Citable edition']),
('algebra','A problem shared across languages','Mathematics teacher','Merchants need a fair account, not a mysterious rule. Produce a balanced ledger and a general solution they can use on the next transaction.','A manuscript workshop in Baghdad','Commercial examples, translated mathematical manuscripts, counting tools and geometric diagrams share one desk.',['algebra'], '''
Quantity + Place value = Numeral
Numeral + Counting board = Written calculation
Written calculation + Transaction record = Ledger
Ledger + Opposing entries = Balanced ledger
Unknown quantity + Equality = Equation
Equation + Equal operations = Equivalent equation
Equivalent equation + Inverse operation = Solved equation
Solved equation + Variable = General solution
Square diagram + Missing corner = Completing the square
Completing the square + General solution = Quadratic method
''',['Balanced ledger','Quadratic method']),
('optics','Does sight leave the eye?','Optics curator','Competing accounts of sight fill these shelves. Build an image-forming model and a repeatable optical experiment we can show visitors.','An optics workshop in Cairo','A reconstruction kit holds apertures, screens, lenses, ray diagrams and accounts of experiments.',[], '''
Light source + Straight path = Light ray
Light ray + Opaque barrier = Shadow
Light ray + Small aperture = Narrow beam
Narrow beam + Screen = Projected spot
Scene + Small aperture = Inverted image
Inverted image + Dark chamber = Camera obscura
Curved glass + Light ray = Refraction model
Refraction model + Screen = Focused image
Camera obscura + Experimental protocol = Optical experiment
Focused image + Light ray = Image-forming model
''',['Optical experiment','Image-forming model']),
('perspective','A painted space','Workshop apprentice','The patron wants a convincing courtyard, not a rule for every kind of art. Make a perspective drawing and a picture that uses light as well as geometry.','A Renaissance painting workshop','Survey sketches, pigments, frames, geometric construction aids and commissions surround a worktable.',['perspective'], '''
Eye point + Picture plane = Projection construction
Projection construction + Parallel lines = Vanishing point
Vanishing point + Horizon = Perspective grid
Perspective grid + Courtyard plan = Perspective drawing
Perspective drawing + Measured proportions = Scaled architectural view
Pigment + Binder = Paint
Paint + Light study = Tonal study
Tonal study + Perspective drawing = Spatial painting
Foreground form + Background form = Occlusion study
Occlusion study + Spatial painting = Courtyard painting
''',['Scaled architectural view','Courtyard painting']),
('anatomy','When the body contradicts the page','Anatomy curator','These inherited diagrams deserve careful comparison, not automatic contempt. Make an anatomical atlas and record one correction with its evidence.','A Padua anatomy collection','Historical plates, comparative specimens, drawing tools and observations from trained anatomists; this is an archive, not a dissection tutorial.',['vesalius'], '''
Anatomical observation + Field note = Anatomy record
Anatomy record + Drawing = Anatomical plate
Anatomical plate + Labels = Labeled anatomy
Labeled anatomy + Sequence = Anatomical atlas
Inherited diagram + Anatomy record = Anatomical discrepancy
Anatomical discrepancy + Species comparison = Comparative anatomy
Comparative anatomy + Repeated observation = Supported correction
Supported correction + Source attribution = Annotated correction
Anatomical atlas + Annotated correction = Revised anatomy edition
Revised anatomy edition + Critical edition = Evidence-indexed atlas
''',['Annotated correction','Evidence-indexed atlas']),
('circulation','How much blood would that require?','Medical historian','One explanation says blood is continually used up. Test its quantities against the observations, then assemble a circulation model.','A collection of Harvey’s questions','Recorded animal observations, valve diagrams, volume estimates and the competing explanations are laid out together.',['harvey'], '''
Heartbeat count + Stroke volume estimate = Flow estimate
Flow estimate + Time interval = Throughput estimate
Throughput estimate + Body volume estimate = Quantity contradiction
Valve drawing + Direction test = One-way valve model
One-way valve model + Vessel diagram = Directional vessel map
Directional vessel map + Heart diagram = Circulation model
Circulation model + Quantity contradiction = Recirculation argument
Recirculation argument + Recorded intervention = Tested circulation account
Microscope drawing + Fine vessel observation = Capillary evidence
Capillary evidence + Tested circulation account = Connected circulation diagram
''',['Recirculation argument','Connected circulation diagram']),
('motion','A changing world in numbers','Mathematics correspondent','A falling object and a wandering planet look unrelated. Build a motion model and a method for recovering distance from changing speed.','Correspondence between mathematical workshops','Measurements, geometric diagrams and competing seventeenth-century approaches arrive in the archive.',['newton'], '''
Position series + Time interval = Average velocity
Average velocity + Shrinking interval = Instantaneous velocity
Instantaneous velocity + Time interval = Acceleration
Curve + Secant line = Difference quotient
Difference quotient + Limit = Derivative
Derivative + Position series = Velocity function
Velocity function + Small time slices = Distance sum
Distance sum + Limit = Integral
Acceleration + Mass = Force model
Force model + Orbital observations = Orbital model
''',['Integral','Orbital model']),
('chance','The game stopped before the end','Letter writer','The players must divide their stake before anyone wins. Find a fair division, then make a risk table that explains more than a single lucky outcome.','A correspondence table in Toulouse and Paris','Dice records, unfinished games, payout schedules and copies of the Pascal–Fermat letters.',['probability'], '''
Possible outcomes + Equal likelihood = Sample space
Sample space + Favorable outcomes = Probability
Probability + Payout = Expected value
Expected value + Unfinished game = Fair stake division
Repeated trials + Outcome counts = Frequency table
Frequency table + Sample space = Empirical distribution
Empirical distribution + Loss amounts = Risk table
Conditional event + Sample space = Conditional probability
Conditional probability + Prior odds = Updated odds
Updated odds + Risk table = Revised risk estimate
''',['Fair stake division','Revised risk estimate']),
('longitude','A position that survives the voyage','Navigation examiner','The ship needs a position, and the next ship must be able to repeat it. Prepare both a clock-based fix and a lunar-distance fix; compare them at sea.','Greenwich and the ship’s chart table','Clockmaking parts, astronomical observations, trial logs and navigational tables form a joint test collection.',['longitude'], '''
Oscillator + Escapement = Clock movement
Clock movement + Temperature compensation = Compensated clock
Compensated clock + Motion-resistant mounting = Marine timekeeper
Marine timekeeper + Sea trial log = Tested chronometer
Local noon + Reference time = Time difference
Time difference + Earth rotation rate = Longitude estimate
Longitude estimate + Tested chronometer = Chronometer fix
Moon-star angle + Lunar tables = Reference sky time
Reference sky time + Local noon = Lunar-distance fix
Lunar-distance fix + Chronometer fix = Cross-checked position
''',['Tested chronometer','Cross-checked position']),
('rocks','The missing years between two rocks','Field geologist','The coast has kept a record with pages missing. Draw the sequence of events and make a deep-time explanation that fits what we can see.','Siccar Point field collection','Rock sketches, sediment samples, bedding measurements and competing interpretations from several visits.',['hutton'], '''
Sediment + Layer diagram = Sedimentary sequence
Sedimentary sequence + Tilted bedding = Deformation record
Deformation record + Eroded surface = Erosion interval
Erosion interval + Younger strata = Unconformity
Unconformity + Field note = Stratigraphic section
Stratigraphic section + Sequence = Relative chronology
Relative chronology + Slow process observation = Deep-time argument
Fossil assemblage + Stratigraphic section = Correlated strata
Correlated strata + Distant section = Regional sequence
Regional sequence + Deep-time argument = Geological history
''',['Stratigraphic section','Geological history']),
('species','Resemblance is not a ladder','Natural-history correspondent','The specimens vary, and islands have peculiar neighbors. Build an account of branching descent and an explanation of adaptation without a prearranged goal.','A natural-history exchange','Breeders’ records, island collections, fossil notes and Darwin–Wallace correspondence are compared, not treated as a single author’s revelation.',['darwin'], '''
Population + Variation record = Variable population
Variable population + Heritable differences = Heritable variation
Heritable variation + Unequal reproduction = Selection model
Selection model + Changing environment = Adaptation model
Related forms + Shared characters = Relationship hypothesis
Relationship hypothesis + Divergence = Branching descent
Island species + Geographic barriers = Isolation hypothesis
Isolation hypothesis + Branching descent = Biogeographic account
Fossil sequence + Branching descent = Historical descent evidence
Historical descent evidence + Adaptation model = Evolutionary explanation
''',['Biogeographic account','Evolutionary explanation']),
('water','Count the houses, not just the deaths','Public-health archivist','Two water supplies serve neighboring homes. Make a fair comparison and a defensible water-safety recommendation, without pretending one map proves everything.','A London investigation archive','Address records, water-company records, death registers and witnesses’ accounts; the archive includes evidence that complicates the famous pump story.',['snow','snow-myth'], '''
Death register + Street plan = Case map
Death register + Household counts = Mortality rates
Mortality rates + Water supplier records = Supplier comparison
Supplier comparison + Intermingled households = Natural-experiment comparison
Case map + Interview record = Exposure history
Exposure history + Water supplier records = Exposure classification
Exposure classification + Mortality rates = Exposure-risk estimate
Natural-experiment comparison + Exposure-risk estimate = Converging evidence
Converging evidence + Alternative explanations = Causal assessment
Causal assessment + Feasible intervention = Water-safety recommendation
''',['Natural-experiment comparison','Water-safety recommendation']),
('photo','An image others can examine','Photographic archivist','A beautiful image is not yet a durable record. Produce a stable photograph and copies that another observer can inspect.','A nineteenth-century photographic workshop','Historical process samples, negatives, optical instruments and preservation records; no chemical preparation instructions are provided.',['photo'], '''
Camera obscura + Light-sensitive surface = Latent photograph
Latent photograph + Development process = Visible photograph
Visible photograph + Fixing process = Stable photograph
Stable photograph + Paper negative process = Photographic negative
Photographic negative + Contact printing = Positive print
Positive print + Reproduction sequence = Print edition
Stable photograph + Scale marker = Measured photograph
Measured photograph + Time series = Photographic record
Photographic record + Critical edition = Annotated visual archive
Print edition + Annotated visual archive = Shareable visual evidence
''',['Stable photograph','Shareable visual evidence']),
('causes','Why did these histories diverge?','Comparative historian','A sweeping explanation is tempting. Build a comparison that tests rival explanations and an account that admits what the surviving evidence cannot settle.','A comparative-history reading room','Travel accounts, trade records, ecological reconstructions and histories written from conflicting standpoints. No single grand theory is supplied as the answer.',[], '''
Historical claim + Source attribution = Attributed claim
Attributed claim + Independent account = Corroborated account
Corroborated account + Missing voices = Source limitation
Trade records + Geographic map = Exchange network
Exchange network + Crop distribution = Material context
Material context + Institutional records = Comparative case
Comparative case + Rival explanation = Rival causal models
Rival causal models + Counterexample = Discriminating case
Discriminating case + Source limitation = Qualified explanation
Qualified explanation + Critical edition = Comparative history
''',['Discriminating case','Comparative history']),
('signals','Send a message through the noise','Communications engineer','The link is unreliable. Send a recoverable message, and keep its statistical information distinct from whether it is true.','A communications laboratory archive','Message samples, noisy channels, coding diagrams and Shannon’s paper.',['shannon'], '''
Alphabet + Symbol assignment = Codebook
Codebook + Message = Encoded message
Encoded message + Noise record = Corrupted transmission
Corrupted transmission + Redundant symbols = Error-detecting code
Error-detecting code + Correction rule = Error-correcting code
Encoded message + Error-correcting code = Recoverable message
Symbol frequencies + Probability = Information measure
Information measure + Codebook = Efficient code
Efficient code + Channel constraint = Compression scheme
Recoverable message + Compression scheme = Reliable communication scheme
''',['Recoverable message','Reliable communication scheme']),
('inference','A result that might not repeat','Research editor','A striking result has arrived. Make its uncertainty visible, then prepare a replication that could honestly fail.','A shared research archive','Study records, protocols, competing models and unsuccessful replications are preserved together.',[], '''
Measurement series + Variation estimate = Error bars
Error bars + Sample size = Precision estimate
Precision estimate + Sampling plan = Uncertainty statement
Hypothesis + Rival model = Model comparison
Model comparison + New observations = Predictive test
Predictive test + Held-out observations = Out-of-sample assessment
Experimental protocol + Public timestamp = Registered protocol
Registered protocol + Independent team = Replication protocol
Replication protocol + Uncertainty statement = Interpretable replication
Interpretable replication + Out-of-sample assessment = Robustness report
''',['Uncertainty statement','Robustness report']),
('commons','A resource without a single owner','Water-users’ secretary','The canal has several users, each with real needs. Build a workable agreement that can be monitored and revised when it fails.','A polycentric governance case collection','Locally authored rules, monitoring records, user testimony and comparative field studies—not a universal recipe for all societies.',['ostrom'], '''
Resource map + User testimony = User-resource map
User-resource map + Seasonal demand = Allocation problem
Allocation problem + Local deliberation = Allocation rule
Allocation rule + Observable indicators = Monitoring agreement
Monitoring agreement + Graduated response = Enforcement procedure
Enforcement procedure + Accessible appeal = Accountable procedure
Accountable procedure + Conflict mediation = Dispute-resolution process
Dispute-resolution process + Revision meeting = Revisable charter
Revisable charter + Neighboring authorities = Nested agreement
Nested agreement + Field evaluation = Tested governance arrangement
''',['Revisable charter','Tested governance arrangement']),
('models','A prediction is not a person','Model evaluator','A useful model can still mislead the people it affects. Build an evaluated predictor and a way to contest its use.','A present-day model evaluation workshop','Training records, deployment cases, error reports and affected people’s testimony; these are fictionalized research materials.',[], '''
Training examples + Learning rule = Trained predictor
Trained predictor + Held-out observations = Validation result
Validation result + Deployment cases = Generalization assessment
Generalization assessment + Subgroup errors = Disaggregated evaluation
Disaggregated evaluation + Documented limits = Model card
Model card + Human review = Reviewed prediction service
Reviewed prediction service + Accessible appeal = Contestable decision process
Contestable decision process + Outcome monitoring = Audited service
Audited service + Changed conditions = Drift assessment
Drift assessment + Revision meeting = Revised deployment plan
''',['Model card','Revised deployment plan']),
('future-memory','Who may remember for whom?','Future archive steward','Our city can preserve experiences across generations. Design a memory archive with consent, then make forgetting possible without erasing everyone else’s evidence.','Speculative: the intergenerational archive','Imagined preservation tools meet inherited archival practice and unresolved disputes over consent. These are proposals, not predicted inventions.',[], '''
Personal archive + Consent record = Consented memory collection
Consented memory collection + Access controls = Private memory archive
Private memory archive + Provenance record = Accountable memory archive
Accountable memory archive + Revocation mechanism = Revocable memory archive
Revocable memory archive + Shared evidence obligations = Retention agreement
Retention agreement + Independent review = Contested-record process
Annotated visual archive + Preservation emulation = Living historical collection
Living historical collection + Context annotation = Situated memory exhibit
Situated memory exhibit + Contested-record process = Governed memory commons
Governed memory commons + Revisable charter = Intergenerational archive charter
''',['Revocable memory archive','Intergenerational archive charter']),
('future-world','An experiment we cannot undo','Future assembly recorder','The planetary proposal promises a great deal. Before anyone authorizes it, make a reversible trial and a decision record that preserves dissent and stop conditions.','Speculative: a planetary assembly','Scenario models, ecological observations and proposals from several jurisdictions meet the archive you have assembled.',[], '''
Planetary proposal + Causal assessment = Intervention model
Intervention model + Uncertainty statement = Bounded forecast
Bounded forecast + Alternative scenarios = Scenario ensemble
Scenario ensemble + Affected-community testimony = Impact assessment
Impact assessment + Reversibility plan = Reversible trial design
Reversible trial design + Observable indicators = Stop-condition protocol
Stop-condition protocol + Nested agreement = Joint oversight agreement
Joint oversight agreement + Dissenting record = Plural decision record
Plural decision record + Registered protocol = Public trial charter
Public trial charter + Intergenerational archive charter = Living atlas of decisions
''',['Reversible trial design','Living atlas of decisions']),
]

from revisions import apply
CHAPTERS=apply(CHAPTERS)

def slug(s):return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
items={}; recipes=[]; stages=[]; produced=set(); available=set(); first_uses={}; output_stage={}; recipe_stage={}
def item(label,sources=None):
 i=slug(label)
 if i not in items:items[i]={'id':i,'label':label}
 if sources:items[i].setdefault('sources',sources)
 return i
for n,(sid,title,speaker,motivation,area,cache,src,block,goals) in enumerate(CHAPTERS):
 rows=[line.strip() for line in block.splitlines() if line.strip()]
 new=[]
 for j,line in enumerate(rows):
  inp,out=line.split(' = ');a,b=inp.split(' + ')
  ai,bi,oi=item(a),item(b),item(out,src)
  for v in (ai,bi):
   if v not in available:new.append(v);available.add(v);first_uses[v]=sid
  if oi in available:raise ValueError(('output already available',sid,out))
  available.add(oi);produced.add(oi);output_stage[oi]=sid
  rid=f'{sid}-{j+1:02}'
  recipes.append({'id':rid,'a':ai,'b':bi,'out':oi,'sources':src,'description':f'{out}: a playable abstraction using {a.lower()} and {b.lower()}.','caveat':'Conceptual teaching relationship, not a claim that these two inputs alone historically caused this development.'})
  recipe_stage[rid]=sid
 stages.append({'id':sid,'title':title,'speaker':speaker,'motivation':motivation,'area':{'id':f'area-{sid}','label':area,'travelText':'We are taking what we need with us. The earlier collection remains available behind us.' if n==1 else f'The atlas travels to {area.lower()}; earlier objects stay in their previous collections unless still useful.'},'caches':[{'id':f'collection-{sid}','label':f'{title}: collection','narrative':cache,'items':new}],'objectives':[{'id':f'{sid}-goal-{k+1}','text':f'Create {g.lower()}.','kind':'create','item':item(g)} for k,g in enumerate(goals)]})
scenario={'schemaVersion':1,'id':'atlas-of-questions','title':'Atlas of Questions','premise':'You are assembling a traveling atlas of how people make, challenge and share knowledge. Visit reconstructed workshops and documentary collections, then use their methods on openly speculative future problems. This is a thematic journey, not a claim that history followed one inevitable ladder. Historical people are not simulated speakers; all requests come from fictional curators.','items':list(items.values()),'locations':[],'initialItems':[],'recipes':recipes,'stages':stages,'sources':[{'id':i,'title':t,'url':u,'note':n} for i,t,u,n in SOURCES],'notes':['Research/content draft, not independently judged fun or live-site content.','Recipe count is in evaluation.json; rejected220 bank is not a completed-game claim.','All combinations express an authored teaching model, not necessary/sufficient historical causation.','Stages deliberately avoid arbitrary choose-N quotas. Goals identify actual products.','Current draft uses documentary areas rather than mechanical locations. Real catalyst trials are a planned revision, not faked by marking every workshop a catalyst.','No terminal item vanishes automatically. Retirement must be explicitly justified in a future revision; current draft retires nothing.','Sources support selected chapter facts, not every recipe. Chapters with no sources remain authenticity-review candidates.','Future chapters are speculative institution design, not predictions or claims of inevitable progress.']}
from enrich import enrich
scenario=enrich(scenario)
(ROOT/'scenario.json').write_text(json.dumps(scenario,indent=2)+'\n')
(ROOT/'author-map.json').write_text(json.dumps({'recipeStage':recipe_stage,'primitiveFirstUse':first_uses,'outputStage':output_stage},indent=2)+'\n')
print(f'{len(recipes)} recipes, {len(items)} item kinds, {len(stages)} stages, {len(first_uses)} contextual primitive supplies')
