"""Six bounded later-case revisions. v2 opening and trial evidence are read-only."""
from pathlib import Path
import json,copy
R=Path(__file__).parent;P=R.parent/'revision-v2-concrete-opening'
B=json.loads((R/'base-v2.json').read_text());S=copy.deepcopy(B)
C=json.loads((P/'chapters.json').read_text());oldedges=json.loads((P/'connections.json').read_text())
I={x['id']:x for x in S['items']};Q={x['id']:x for x in S['recipes']};CH={x['id']:x for x in C};ST={x['id']:x for x in S['stages']}
changed=['anatomy','circulation','longitude','future-observatory','future-memory','future-city']
S['id']='atlas-connected-questions-v3-observation-payoffs-research'
S['notes'].append('Bounded six-chapter observation/payoff revision. All numerical navigation and physiological dossiers are fictional teaching cases, not real operational or clinical data. Futures remain fiction.')
H='Authored historical teaching case, not an original quotation or an actual specimen record.'
N='Fictional voyage day 20, in an imagined 1768 voyage. All sights share one instant on day 20. Modern midnight-based 00–24-hour notation is used; values are invented, not an ephemeris for a real calendar date or usable navigation data.'
F='Explicit speculative fiction, not an existing capability or a biological construction protocol.'
def content(id,label,text=None,attribution=H):
 x=I[id];x['label']=label
 if text:x['reading']={'text':text,'attribution':attribution}
 else:x.pop('reading',None)
 return x
def additem(ch,id,label,text=None,attribution=H):
 x={'id':id,'label':label,'description':label,'sources':CH[ch]['sources']};I[id]=x;S['items'].append(x);content(id,label,text,attribution);return x
def supply(ch,id,label,text,attribution=H):additem(ch,id,label,text,attribution);CH[ch]['supplies'].append(id);ST[ch]['caches'][0]['items'].append(id)
def remove_recipe(ch,id):
 q=Q.pop(id);S['recipes'].remove(q);CH[ch]['recipes'].remove(id)
 if not any(r.get('out')==q['out'] for r in S['recipes']):CH[ch]['created'].remove(q['out']);S['items'].remove(I.pop(q['out']))
def recipe(ch,a,b,out,label,text=None,attribution=H,transform=None,incorporate=None,preserve=None,at=None):
 additem(ch,out,label,text,attribution);CH[ch]['created'].append(out)
 q={'id':'make-'+out,'a':a,'b':b,'out':out,'description':label,'sources':CH[ch]['sources'],'lifecycle':{x:{'role':'transform' if x==transform else 'incorporate' if x==incorporate else 'retain','reason':'The same assembly changes state at its own position.' if x==transform else 'This fitted part remains inside the visible assembly.' if x==incorporate else 'This observation, source or reusable tool remains available.'} for x in[a,b]}}
 if preserve:q['preserve']=preserve
 if at:q['at']=at
 S['recipes'].append(q);Q[q['id']]=q;CH[ch]['recipes'].append(q['id']);return q
def rewire(id,a,b,description):
 q=Q[id];q.update(a=a,b=b,description=description,lifecycle={x:{'role':'retain','reason':'The evidence or reference is consulted without being consumed.'} for x in[a,b]});q.pop('preserve',None)

# The observation is inspectable, and the inherited editing method has an actual application.
content('galenic-drawing','Older two-part lower-jaw claim','The teaching plate preserves a claim that the human lower jaw has two separate bones. Gysel’s historical study contrasts Vesalius’s earlier two-bone account with the united mandible in the Fabrica. The fictional specimen comparison below concerns an adult human, not the upper jaw or all anatomical claims.')
content('adult-jaw','Adult human mandible: one continuous bone across the chin','The fictional adult human specimen is a continuous lower-jaw bone. Its midline is united, not two independently movable halves. This supplied observation is not a claim about every developmental stage or species.')
content('specimen-label','Specimen J: adult human; intact midline','Teaching collection J is an adult human mandible. The record identifies the midline as intact rather than a repaired break; the specimen is fictional.')
content('documented-jaw','Specimen J: adult mandible, one united midline','Record J: adult human; continuous lower-jaw arch; united midline. The source and scope now travel with the observation.')
content('anatomical-discrepancy','Older claim: two bones; adult specimen J: one','The teaching comparison has two entries: inherited two-bone account; observed continuous adult mandible. The disagreement concerns this anatomical claim, not the authority of every older statement.')
content('bounded-correction','This adult mandible contradicts the two-separate-bones claim','An intact adult lower jaw with a united midline is a contrary case to the claim that adult human lower jaws consist of two separate bones. The observation does not test unrelated claims in the inherited work.')
content('anatomical-drawing','Frontal jaw outline: the bone continues across the chin','The plate’s frontal outline continues across the midline. Its key distinguishes the observed continuous arch from the old division into two separate halves. This is a textual teaching plate; no actual specimen image is supplied.')
content('dissection-record','Record J: continuity at the chin, not a fracture','The supplied inspection note describes intact continuity across the adult midline. It contains no dissection procedure. The old two-bone claim is listed separately from what this specimen shows.')
content('labeled-anatomy','Plate J labels the continuous adult midline','Caption: J, adult human mandible, frontal view. The chin label points to continuous bone; the accompanying note records the intact midline.')
content('corrected-plate','Corrected plate: one continuous adult lower jaw','The plate and caption now state the correction: this adult lower jaw is one continuous bone, not two separate halves. The older claim remains identifiable in the comparison record.')
content('anatomy-print-block','Woodblock: continuous jaw and midline caption','The printing block reproduces the continuous outline and its specimen-J caption. The supplied block is a teaching object, not a reconstruction of a particular surviving block.')
content('printed-anatomy','Printed plate: adult jaw united at the chin','The printed page reproduces the corrected outline, the adult-human specimen identification, and the observation of continuity. More copies spread this particular claim; print alone does not make it true.')
content('anatomical-commentary','Lower-jaw edition: old “two bones”; observed “one continuous bone”','Edition J keeps two columns. Inherited account: two separate lower-jaw bones. Specimen J: adult human, continuous bone across the chin. Editorial correction: use the specimen-supported account here and retain the displaced wording in the record. This applies the earlier practice of preserving a variant while repairing a claim; the old C/D triangle proof contributes no anatomical observation.')
Q['make-anatomical-commentary']['description']='The edition explicitly prints the inherited two-bone claim beside the observed continuous adult jaw, instead of treating an old mathematical correction as a badge.'
ST['anatomy']['objectives'][0]['text']='Publish the adult lower-jaw correction'

# Quantity alone is not enough: the rival one-way model now has an explicit replenishment bound.
content('heart-estimate','Teaching estimate: 5 mL passes per beat', 'Use an invented conservative estimate of 5 mL per beat. It is neither Harvey’s exact number nor a clinical measurement.',H)
content('beat-count','60 beats/minute for 30 minutes','The fictional count is 60 beats per minute for 30 minutes: 1,800 beats. This is a historical arithmetic exercise, not a health assessment.')
content('blood-stock','One-way model: 5 L stock + at most 1 L new','The rival teaching model begins with 5 L and allows at most 1 L of newly supplied blood during this same half-hour. If blood leaves the system after passing, at most 6 L is available for passage. The replenishment bound is an explicit invented premise, not a physiological fact.')
content('per-beat-account','Each beat passes about 5 mL','The arithmetic record assigns the same approximate unit to each beat. Repeated passage will be a volume accumulated over time, not the amount present at a single instant.')
content('throughput-estimate','5 × 60 × 30 = 9,000 mL passed','In this exercise, 5 mL/beat × 60 beats/minute × 30 minutes = 9,000 mL, or 9 L, passed through. That total does not imply 9 L is present at once.')
content('replacement-problem','9 L passed; the one-way model supplies at most 6 L','The proposed one-way supply is 5 L initially plus at most 1 L added, totaling 6 L. The estimated 9 L passage exceeds that by 3 L. This defeats the stated one-way model under its premises, not every conceivable replacement mechanism.')
content('valve-record','Vein valves admit flow toward the heart, oppose reversal','The supplied vessel sheet records observed vein valves opening toward the heart and opposing reverse movement. A separate entry describes outward arterial delivery. This sheet supplies the vascular evidence; the earlier jaw edition is an example of how observed anatomy and inherited claims are recorded, not a vessel map.')
content('directed-vessels','Vessel sheet: arteries outward; veins toward the heart','The new edition separates the supplied vessel observations from the proposed route: arterial delivery runs outward; the recorded venous valves favor return toward the heart. It follows the jaw edition’s comparison format without importing jaws into the circulatory anatomy.')
Q['make-directed-vessels']['description']='The jaw edition contributes a comparison format; the supplied valve sheet supplies the vascular observation and direction.'
content('return-path','Proposed loop: heart → arteries → unseen link → veins','The supplied proposal connects outward arterial delivery to venous return. The connecting passage through the tissues is not directly seen in this 1628 setting. Later capillary observations are not placed in Harvey’s hands.')
content('circulation-route','Heart → arteries → unseen tissue link → veins → heart','The arrows return the same blood to the heart. The tissue connection is explicitly proposed rather than drawn as an observed vessel. This is a simplified representation of the route, not a complete anatomical map.')
remove_recipe('circulation','make-recirculation-account')
rewire('make-circulation-limits','circulation-route','replacement-problem','Repeated passage accounts for 9 L through a 5 L stock; the tissue connection is still a proposed link.')
content('circulation-limits','Same blood can pass again; the tissue link is unseen','A circuit permits the same stock to pass repeatedly, so 9 L of cumulative passage need not be 9 L of newly manufactured blood. The arrow from arteries to veins crosses a still-unseen tissue connection. The quantitative conflict and the visible return direction support the circuit without turning the proposed link into an observation.')
content('circulation-book','Circulation book: 9 L passed, return toward the heart','The book prints the calculation, the one-way supply premise, the venous direction, and the loop with its unobserved tissue link marked. Its argument is that the same blood returns and passes again. The quantities are fictional; Harvey’s primary argument also joined quantity, inadequate replenishment and venous return.')
ST['circulation']['objectives'][0]['text']='Publish the returning-blood argument'

# Longitude: a proper local/reference-time dependency in BOTH branches.
for id in list(CH['longitude']['recipes']):remove_recipe('longitude',id)
CH['longitude']['sources']=['longitude','longitude-lunar-si','almanac-history','almanac-time','rotation-eso']
ST['longitude']['motivation']='The uncorrected watch puts the ship beyond the chart’s hazard meridian. Does the Moon agree? Recover two longitudes, correct the watch’s rate, and mark the band the observations actually support.'
CH['longitude'].update(era='c. 1768 CE',start=1768,end=1768)
ST['longitude']['area']['label']='Atlantic teaching voyage · c. 1768 CE'
content('sea-clock','Reference clock: 14:06 mean time','At the common sighting instant the supplied clock reads 14:06 Greenwich mean time. Its voyage rate has not yet been applied. The fictional day’s mean time is two minutes ahead of apparent solar time.',N)
content('local-noon','Observed local noon: 12:00 apparent ±20 seconds','At this same sighting instant the Sun is on the ship’s local meridian: 12:00 apparent solar time, with a stipulated ±20-second bound. This is an independent local observation, not a longitude read from the almanac.',N)
content('lunar-distance','Moon–Sun distance: 45°20′ before clearing','A fictional supplied Moon–Sun observation at the same local-noon sighting. The measured distance is not yet the comparable geocentric centre-to-centre distance. This bounded exercise supplies the net clearing result separately rather than simulating the full altitude-based reduction.',N)
content('nautical-table','Apparent reference time: 12:00 → 44°29′; 15:00 → 45°59′','Fictional three-hour lunar table: Greenwich apparent time 12:00, distance 44°29′; 15:00, 45°59′. Linear interpolation is stipulated for this exercise: 90 arcminutes in 180 minutes of time, or 0.5 arcminute per minute. Early almanacs used apparent time; GMT is not backdated into this table. Modern civil-hour notation replaces the period’s astronomical-day notation here.',N)
content('rough-voyage','Voyage rate: +6 seconds/day for 20 days; ±20 seconds','Independent comparisons at known reference stations support an estimated gain of 6 seconds/day over this fictional 20-day leg. Applying that rate gives 120 seconds fast, with a stipulated total ±20-second residual bound. This is an independent clock-rate estimate, not a correction fitted to the lunar answer.',N)
content('chart','Chart hazard meridian: 30°45′ W','This fictional chart marks a hazard meridian at 30°45′ W along an already chosen route. This exercise estimates longitude only; it does not supply a complete latitude fix or real navigational advice.',N)
supply('longitude','equation-time','This day: apparent time = mean time −2 minutes','The fictional dated correction subtracts two minutes from mean time to obtain apparent solar time. Treat this supplied correction as exact within the exercise. Compare apparent with apparent; do not compare a mean clock reading directly with apparent local noon.',N)
supply('longitude','rotation-card','Earth’s turn: 360° in 24 hours','The longitude conversion is 15 degrees per hour of local/reference time difference, or 15 arcminutes per minute of time. If the reference meridian’s solar time is later than the ship’s, the ship is west of that meridian.',N)
supply('longitude','lunar-clearing','Supplied clearing result: add 10′; residual ±1′','The supplied result stands for the altitude-dependent parallax and refraction reduction, limb-to-centre and instrument corrections. Their stipulated net effect here is +10 arcminutes, with residual bound ±1 arcminute. The full spherical reduction is not modelled, and this fixed correction is not asserted to work for other observations.',N)
recipe('longitude','rotation-card','merchant-manual','time-angle-rule','1 hour = 15°; reference later means west','360° ÷ 24 hours = 15°/hour. One minute of time is 15 arcminutes of longitude. A later reference solar time means local noon arrived later at the ship, placing it west.',N)
recipe('longitude','sea-clock','equation-time','apparent-clock','Uncorrected apparent reference time: 14:04','14:06 mean − 2 minutes = 14:04 apparent. This conversion does not yet remove the clock’s voyage gain.',N)
recipe('longitude','apparent-clock','local-noon','time-difference','Reference 14:04 − local 12:00 = 2 h 04 m','The uncorrected reference solar time is 124 minutes later than local apparent noon. The local measurement is essential to this comparison.',N)
recipe('longitude','time-difference','time-angle-rule','clock-longitude','Uncorrected clock longitude: 31° W','124 minutes × 15 arcminutes/minute = 1,860 arcminutes = 31°. Reference time is later, so the sign is west. The voyage rate remains unapplied.',N)
recipe('longitude','sea-clock','rough-voyage','voyage-clock-record','Clock gained 120 seconds; residual bound ±20 seconds','6 seconds/day × 20 days = 120 seconds gained. The clock is fast, so the gain must be subtracted, not added. At 15 arcminutes per minute, two minutes is half a degree.',N,at='sea-trial')
recipe('longitude','voyage-clock-record','clock-longitude','corrected-clock-position','Rate-corrected clock: 30°30′ W ±10′','The sheet keeps the whole calculation: 14:06 mean − 2 minutes for apparent time − 2 minutes gained = 14:02 apparent reference time. Against local 12:00, that is 122 minutes × 15′ = 30°30′ W; equivalently subtract 30′ from the raw 31° W. Worst-case time bound combines ±20 seconds of clock residual and ±20 seconds of local noon: ±40 seconds, equivalent to ±10′ of longitude. Clock band: 30°20′–30°40′ W.',N)
recipe('longitude','nautical-table','predictive-sky-record','lunar-time-scale','Lunar time scale: 90′ in 180 minutes; 1′ means 2 minutes','The inherited practice of treating a sky table as a predictive relation is applied to these actual rows: 44°29′ at 12:00 and 45°59′ at 15:00 apparent reference time. The rise is 90′ in 180 minutes: 0.5′ per minute, or two minutes of time per arcminute. This is the stipulated linear scale against which the new observation is compared, not a local-time reading.',N)
recipe('longitude','lunar-distance','lunar-clearing','cleared-lunar-angle','Cleared Moon–Sun distance: 45°30′ ±1′','45°20′ + 10′ = 45°30′. The corrected observation can now be compared with the centre-to-centre distances in the reference table. The original measurement remains a separate source.',N)
recipe('longitude','cleared-lunar-angle','lunar-time-scale','lunar-reference-time','Lunar reference time: 14:02 apparent ±2 minutes','The distance is 61′ beyond the 12:00 entry. At 0.5′ per minute, that is 122 minutes after 12:00: 14:02 apparent reference time. A ±1′ distance bound gives ±2 minutes of reference time. This is not yet longitude.',N)
recipe('longitude','lunar-reference-time','local-noon','lunar-time-difference','Lunar reference 14:02 − local 12:00 = 2 h 02 m','The lunar reference time is compared with the independent local-noon observation at the same instant. Reference time is 122 minutes later. Worst-case time bound: 2 minutes + 20 seconds.',N)
recipe('longitude','lunar-time-difference','time-angle-rule','lunar-longitude','Lunar longitude: 30°30′ W ±35′','The completed sheet retains the chain: cleared distance 45°30′ interpolates to reference 14:02 apparent; the independent local sight is 12:00. Their difference is 122 minutes. 122 × 15′ = 1,830′ = 30°30′ W. The 2-minute-20-second time bound becomes ±35′. Lunar band: 29°55′–31°05′ W.',N)
recipe('longitude','corrected-clock-position','lunar-longitude','position-comparison','Both centres: 30°30′ W; clock band is narrower','Clock band 30°20′–30°40′ W lies inside lunar band 29°55′–31°05′ W. The lunar estimate independently checks the centre, though both estimates share the same local-noon measurement; their agreement is not two wholly independent error bars.',N)
recipe('longitude','position-comparison','chart','navigation-chart','Longitude band: 30°20′–30°40′ W, east of the hazard','Plot the clock-supported longitude band, with the wider lunar band recorded alongside it. On this fictional route the entire narrower band is east of 30°45′ W. The uncorrected 31° W point would have put the ship beyond that meridian. This result depends on the stipulated error bounds, not an assertion of historical instrument accuracy.',N)
ST['longitude']['objectives']=[{'id':'longitude-navigation-chart','text':'Mark the corrected longitude band','kind':'create','item':'navigation-chart'}]

# A fictional scientist actually selects a row, rejects a prediction, and changes its question.
content('growth-rivals','Model L: light makes glow; model N: fresh food makes glow','Two deliberately simple fictional models: L predicts glow exactly when light is on; N predicts glow exactly when fresh nutrient input is on. Both predict glow for light+food and darkness for neither. They disagree on light-only and food-only cases.',F)
content('trial-menu','Four trials: light+food, light only, food only, neither','The bounded menu contains four on/off condition pairs. These are observations in a fictional supplied chamber, not instructions for engineering or cultivating an organism.',F)
content('competing-growth-predictions','Food without light: L predicts dark; N predicts glow','The rival mechanisms have explicit contrary predictions in the dark-but-fed row. A mechanism account must answer that observation, not merely rename the colony’s light.',F)
content('experiment-lattice','Rows 11, 10, 01, 00: both, light, food, neither','The Boolean case record lists four rows. With L=light and N=fresh food: 11 → both models glow; 10 → light model glows, food model dark; 01 → light model dark, food model glows; 00 → both models dark.',F)
content('distinguishing-trial','Choose row 01: dark chamber, fresh food present','This row separates the two original accounts: model L predicts dark; model N predicts glow. The selection favors disagreement between predictions, not an impressive image.',F)
content('spectral-sensor','Sensor distinguishes colony glow from background','A fictional supplied sensor reports a colony region and an empty background region separately. It does not identify a biological mechanism by itself.',F)
content('metabolic-imager','Living-light imager: colony and empty-background channels','The fictional imager registers where light is coming from, using the inherited image-formation model. It distinguishes a colony region from a background channel; it does not read intention.',F)
content('instrumented-chamber','Chamber with colony and background light channels','The same observation chamber now contains the living-light imager. Its two channels remain visible components of the assembly.',F)
content('self-questioning-lab','Lab tests dark+fed: colony glows; L fails','The supplied fictional apparatus executes row 01 and records colony glow. That result contradicts the light-only model and fits the fresh-food model. It has selected a discriminating test and received a definite answer.',F)
content('surprising-bloom','Next record: dark, no fresh food—colony still glows','After fresh input stops, the colony still glows in darkness. Both original models predicted darkness in row 00. Earlier feeding or illumination might leave a stored resource; a sensor afterimage is another possible account. These are fictional observations, not real organism behavior.',F)
content('anomalous-growth','Row 00 glows: both original models fail','The dark, unfed result is not merely another success for the food model: that model predicted glow only with current fresh input. New candidates are stored colony energy and a sensor echo. Their predictions must now be separated.',F)
content('next-question','Next: image an empty bay—stored glow or sensor echo?','For scheduling only, assign the two candidates equal weight. Empty-bay test: stored colony energy predicts dark; sensor echo predicts glow. Either outcome leaves one candidate, so expected candidates remaining = ½×1 + ½×1 = 1. Repeating an ordinary illuminated colony leaves both candidates, expected 2. This borrows weighted-outcome reasoning; the equal weights are an invented selection assumption, not measured biological probabilities.',F)
content('learning-observatory','Observatory runs empty-bay test: dark, not sensor echo','The same fictional apparatus chooses and runs the next test. The empty bay stays dark, while the colony channel still glows. The stipulated sensor-echo account fails; the stored-resource account remains a candidate. The new capability is selecting a falsifiable next experiment from the observed failure, not becoming an oracle.',F)
ST['future-observatory']['objectives'][0]['text']='Run the dark-but-fed trial';ST['future-observatory']['objectives'][1]['text']='Let the observatory choose its next test'

# After exchanging viewpoints, the shared medium creates a NEW joint experience.
content('conflicting-memories','Mira: gate open; Tovan: gate barred','Mira recalls entering the courtyard through an open gate. Tovan recalls the same gathering from the alley: the gate barred, the voices unreachable. Both date their recollection to that gathering; their accounts conflict. The display preserves the incompatible claims rather than silently changing the date or deciding which is true.',F)
content('branching-recollection','Witness Mira: OPEN; witness Tovan: BARRED','The two witnesses occupy separate entries in the collation. Their exact gate claims remain attached to their names. The earlier C/D table contributes the act of keeping variants distinguishable, not an answer to which memory is true.',F)
content('revisitable-courtyard','Courtyard revisitable; unseen rooms remain reconstructed','The photographed courtyard supplies a spatial anchor. Areas outside its frame are marked as reconstructed, so moving through the scene does not turn invented detail into recovered history.',F)
content('layered-memory','Two paths: Mira enters; Tovan waits outside','A visitor can enter the open-gate recollection or remain in the barred-gate recollection. The conflict is experienced spatially and remains attributed to its witness.',F)
content('experience-code','Encode viewpoint, remembered words, feeling and gaps','The fictional format sends the position, remembered speech, affective tags and unknown regions as separate fields. It transmits an authored experience representation, not an entire person.',F)
content('shareable-perspective','Transmitted scene keeps speaker, viewpoint and unknowns','A receiver can distinguish whose recollection is being visited and which regions are missing. Reliable transmission preserves those distinctions; it does not establish the remembered event’s truth.',F)
content('memory-garden','Shared garden: enter either remembered gate','Several people can revisit both paths together. They can inspect conflicting memories but have not yet exchanged the felt positions of welcome and exclusion.',F)
content('viewpoint-exchange','Mira enters Tovan’s waiting; Tovan enters Mira’s welcome','The fictional interface exchanges first-person reconstructed positions. Mira experiences the inaccessible voices from the alley; Tovan experiences entering the welcoming courtyard. Their original recollections remain their own.',F)
content('reciprocal-memory','“I recall welcome; now I can inhabit your exclusion”','Mira still recalls the gate open, but can now inhabit Tovan’s experience of being left outside. Tovan can inhabit the welcome Mira recalls without adopting her gate claim as his own memory. The exchange changes what they can imagine doing together, not the verdict on the old event.',F)
content('we-name','Our new gathering: enter from courtyard AND alley','Mira and Tovan propose a new visit with two entrances, so neither path of arrival is subordinate to the other. This is an invitation for an event they will create together, not a vote declaring either old memory correct.',F)
remove_recipe('future-memory','make-collective-self-model');remove_recipe('future-memory','make-plural-identity')
recipe('future-memory','reciprocal-memory','we-name','joint-invitation','A shared invitation built from welcome and exclusion','The two contributors design a gathering reachable from both remembered positions. Neither could have authored this same invitation from their own recalled experience alone. A prospective “we” emerges through a shared act, not a declaration that they are literally one mind.',F)
q=Q['make-choral-memory'];q['b']='joint-invitation';q['lifecycle']['joint-invitation']=q['lifecycle'].pop('plural-identity')
content('choral-memory','Choral garden: “We arrived by two paths”','The fictional garden hosts the newly planned gathering and adds a joint episode: both participants arrive, one by each route. Its narrator can say “we arrived” while still distinguishing “I remember the old gate open” from “you remember it barred.” It now creates shared experience from incompatible memories instead of merely displaying or averaging them.',F)
# Keep topological author order while retaining original final assembly identity.
ids=CH['future-memory']['recipes'];ids.remove('make-joint-invitation');ids.insert(ids.index('make-choral-memory'),'make-joint-invitation')
ST['future-memory']['objectives'][1]['text']='Create a memory neither held alone'

# Food units are fictional accounting units, not an organism or engineering recipe.
content('symbiont-plan','Light partner stores food; recycling partner returns nutrients','The fictional partners have complementary roles: one captures light and stores food; the other returns nutrients from waste. Water, mineral and carbon inputs are supplied. This is a functional story, not an organism list or biotechnology specification.',F)
content('metabolic-partnership','Light capture + nutrient return form a living partnership','The proposed partners exchange resources rather than creating material from nothing. Food-unit counts below are fictional accounting units; no cultivation or genetic engineering instructions are supplied.',F)
content('living-wall','Living wall: 12 food units captured during daylight','The fictional installation produces 12 food units in the recorded daylight interval. Its productive surface contains the same visible living partners installed on the scaffold.',F)
content('water-loop-plan','Water ledger: 80 returned + 20 fresh = 100 input','Of each fictional 100 water units used, 80 return and 20 are lost. Twenty fresh units must enter to repeat the cycle. Recycling is not perfect closure.',F)
content('cycling-facade','Facade: 80 water units returned; 20 replaced','The same living surface now uses the stated water loop. The food output still depends on daylight and supplied material; the loop does not make it independent of its surroundings.',F)
content('day-night-record','12 units made; day takes 8, night needs 6 but gets 4','Recorded sequence: daylight production 12; immediate distribution 8; storage at sunset 4; night demand 6, short by 2. An alternative schedule would distribute 6 by day and retain 6 for night. Total output stays 12.',F)
content('adaptive-cycle','Test the schedule: 6 by day, 6 stored for night','The observatory compares a storage-loss account with early over-distribution. The recorded sunset balance shows only 4 stored after giving away 8. It selects a 6/6 distribution trial; the fictional trial ends with 6 available at night. No extra food has been created.',F)
content('responsive-district','District now distributes 6 by day and 6 at night','The living installation applies the tested schedule: of 12 food units, 6 are distributed during daylight and 6 retained for night. The former nighttime shortage was a scheduling consequence, not solved by inventing more production.',F)
content('downstream-shade','Winter wall: A gets 12; shaded district B gets 4','The fictional winter comparison is spatially unequal. Full wall deployment gives A 12 food units and leaves B 4. A folded winter position would give A 10 and B 7: one extra unit overall, but A gives up two units while B gains three. These are supplied fictional trial results, not a real energy model.',F)
content('unequal-city','Full wall: A12 + B4; folded winter wall: A10 + B7','The two observed trial configurations have totals 16 and 17. A higher total does not decide the choice by itself: one district loses while the other gains. The regional effect is not visible from A’s productive wall alone.',F)
content('inhabited-city-model','From A: less harvest; from B: daylight returns','The choral medium lets residents inhabit both positions: A loses two harvest units under folding; B regains daylight and gains three. The new shared view preserves the asymmetry rather than replacing both experiences with the total 17.',F)
content('seasonal-city-rule','Winter: fold the wall; A10 and B7, review each season','The agreed winter configuration folds the productive surface. A accepts a reduction from 12 to 10 while B rises from 4 to 7. Distribution is rescheduled within A’s smaller harvest, 5 by day and 5 at night. The agreement also specifies an equal-share fallback if a biological change makes the total inadequate; it is a revisable fictional arrangement, not a universal rule.',F)
content('metabolic-commons','Winter commons: folded wall; A5+5, B7','The same living installation adopts the winter position and allocation. A distributes 5 in daylight and stores 5 for night; B receives the restored-light harvest of 7. Governance has changed the actual panel position and food schedule, not merely certified the machine.',F)
content('symbiont-change','Recycling partner diverts 3 food units into its own repair','The fictional changed partner uses three units that previously became harvest. In the same winter configuration A’s usable harvest falls from 10 to 7; B remains at 7. The organisms are not fixed appliances. The event supplies the observed new balance, not a genetic recipe.',F)
q=Q['make-evolving-city'];q['out']='changed-city';q['id']='make-changed-city';Q.pop('make-evolving-city');Q[q['id']]=q
CH['future-city']['recipes'][-1]='make-changed-city';CH['future-city']['created'].remove('evolving-city');CH['future-city']['created'].append('changed-city')
old=I.pop('evolving-city');S['items'].remove(old)
additem('future-city','changed-city','Same city, new metabolism: harvest A7 + B7','The living partners remain installed, but repair now takes three units. Total harvest is 14 instead of 17; the earlier 10/7 promise cannot simply continue. The changed city retains its infrastructure and its recorded allocation problem.',F)
q['description']='The same city changes its ecological state; the harvest shortfall is visible before a response is chosen.'
recipe('future-city','changed-city','adaptive-cycle','evolving-city','Living city: repair continues; harvest shared 7 and 7','The observatory checks the new balance rather than blaming the old day/night schedule. The city keeps the partner’s repair running and activates the agreed equal-share fallback: 14 available units, seven for each district. A changes to 3 by day and 4 at night; B likewise receives seven. Output has not magically returned to 17. The living city survives as an institution that can alter its operation when its biology changes, with a real scarcity still to investigate.',F,transform='changed-city',preserve=['changed-city'])
ST['future-city']['objectives'][0]['text']='Fold the winter wall';ST['future-city']['objectives'][1]['text']='Adapt to the partner’s new metabolism'

# These are evolving working sheets, not one new loose certificate per operation.
# Original measurements, tools, tables and contrasting claims remain references.
working_sheets={
 'make-time-difference':'apparent-clock',
 'make-clock-longitude':'time-difference',
 'make-corrected-clock-position':'clock-longitude',
 'make-lunar-reference-time':'cleared-lunar-angle',
 'make-lunar-time-difference':'lunar-reference-time',
 'make-lunar-longitude':'lunar-time-difference',
 'make-bounded-correction':'anatomical-discrepancy',
 'make-labeled-anatomy':'anatomical-drawing',
 'make-corrected-plate':'labeled-anatomy',
 'make-anatomical-commentary':'printed-anatomy',
 'make-throughput-estimate':'per-beat-account',
 'make-replacement-problem':'throughput-estimate',
 'make-circulation-limits':'circulation-route',
}
for id,primary in working_sheets.items():
 Q[id]['lifecycle'][primary]={'role':'transform','reason':'This same working calculation or draft becomes the more developed result; its result text preserves the relevant earlier entries, while raw observations remain separate references.'}

sources=[
 {'id':'longitude-lunar-si','title':'Smithsonian: Observing the skies — lunar distances','url':'https://timeandnavigation.si.edu/navigating-at-sea/longitude-problem/observing-the-skies','note':'Lunar angle establishes reference time; longitude also requires local time.'},
 {'id':'almanac-history','title':'US Naval Observatory: History of the Nautical Almanac','url':'https://aa.usno.navy.mil/publications/na_history','note':'First data for 1767; mean-time change in 1834. Fictional rows are not copied ephemerides.'},
 {'id':'almanac-time','title':'Royal Observatory history: Nautical Almanac and associated publications','url':'https://www.royalobservatorygreenwich.org/articles.php?article=935','note':'Three-hour tables, clearing, local-time comparison, and apparent-to-mean change in 1834.'},
 {'id':'rotation-eso','title':'European Southern Observatory: Rotation of the Earth','url':'https://www.eso.org/public/outreach/eduoff/seaspace/navigation/navastro/navastro-5.html','note':'Time/longitude conversion and west/east sign; exercise error bounds are invented.'},
 {'id':'harvey-primary','title':'Harvey, chapters IX and XIV, translated primary excerpts','url':'https://bertie.ccsu.edu/naturesci/evolution/unit10background/HarveyNine.html','note':'Quantity, insufficient replacement and venous return belong together. Numerical dossier is invented.'},
]
S['sources']+=sources;CH['circulation']['sources'].append('harvey-primary')
# All amended output metadata describes the same concrete result the player can inspect.
for name in changed:
 for id in CH[name]['created']:
  for q in S['recipes']:
   if q.get('out')==id:q['description']=I[id]['reading']['text'] if I[id].get('reading') else I[id]['label']
 for id in CH[name]['created']+CH[name]['supplies']:I[id]['sources']=CH[name]['sources']
 for id in CH[name]['recipes']:Q[id]['sources']=CH[name]['sources']
owners={x:c['id'] for c in C for x in c['created']};positions={c['id']:i for i,c in enumerate(C)};edges=[]
for c,st in zip(C,S['stages']):
 local=[Q[id] for id in c['recipes']]
 st['carry']=sorted({x for q in local for x in[q['a'],q['b']] if not x.startswith('@')}|set(c['goals']))
 c['earlier']=sorted({x for q in local for x in[q['a'],q['b']] if x in owners and positions[owners[x]]<positions[c['id']]})
 for q in local:
  for x in[q['a'],q['b']]:
   if x not in c['earlier']:continue
   old=next((e for e in oldedges if e['to']==c['id'] and e['item']==x and e['recipe']==q['id']),None)
   edges.append(old or {'from':owners[x],'to':c['id'],'item':x,'recipe':q['id'],'relation':'speculative_synthesis' if c.get('speculative') else 'pedagogical_reuse','sources':c['sources'],'claim':'An earlier creation performs the stated comparison or calculation. The literal teaching object is not evidence of direct historical transmission; future applications are fiction.'})
for name,data in [('scenario.json',S),('chapters.json',C),('connections.json',edges)]: (R/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
# Machine-readable operands independently checked by tests, all reflected in visible dossiers.
cases={'longitude':{'localApparentMinutes':720,'localBoundSeconds':20,'clockMeanMinutes':846,'meanMinusApparentMinutes':2,'days':20,'gainSecondsPerDay':6,'clockResidualSeconds':20,'rawAngleMinutes':2720,'clearingMinutes':10,'angleBoundMinutes':1,'table':[[720,2669],[900,2759]],'hazardWestMinutes':1845},'circulation':{'mLPerBeat':5,'beatsPerMinute':60,'minutes':30,'stockL':5,'maxNewL':1},'futureCity':{'dayProduction':12,'oldDayDistribution':8,'nightDemand':6,'newDayDistribution':6,'winterFull':[12,4],'winterFolded':[10,7],'repairDiversion':3,'finalShares':[7,7]}}
(R/'case-values.json').write_text(json.dumps(cases,indent=2)+'\n')
print(json.dumps({'recipes':len(S['recipes']),'changedChapters':{x:len(CH[x]['recipes']) for x in changed}},indent=2))
