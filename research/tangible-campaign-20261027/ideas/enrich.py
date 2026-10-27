"""Authored explanation cards, source gaps, and sparse real setting constraints."""
def enrich(s):
 s['sources'] += [
 {'id':'optics-object','title':'Science Museum Group: Camera Obscura','url':'https://collection.sciencemuseumgroup.org.uk/objects/co2035/camera-obscura','note':'Historical portable camera obscura object. Does not establish every recipe or an exclusive inventor.'},
 {'id':'optics-manuscript','title':'Cambridge Peterhouse MS209: Alhacen De Aspectibus','url':'https://medieval.lib.cam.ac.uk/catalogue/Peterhouse/MS-PETERHOUSE-00209','note':'A manuscript witness to the circulation of Ibn al-Haytham’s optical work. Optical recipes are modern demonstrations, not a transcription of this manuscript.'},
 {'id':'nist','title':'NIST AI RMF Core','url':'https://airc.nist.gov/airmf-resources/airmf/5-sec-core/','note':'Model validation, generalization limits and ongoing evaluation. A checklist is not a guarantee of trustworthiness.'},
 {'id':'alexandria','title':'Francesca Schironi: Textual Scholarship in Alexandria and Beyond','url':'https://sites.lsa.umich.edu/schironi/wp-content/uploads/sites/259/2024/10/43_Textual-Scholarship-in-Alexandria-.pdf','note':'Scholar-authored research on textual practices. Modern apparatus and translation terms in this game are not all ancient Alexandrian inventions.'},
 {'id':'capillaries','title':'American Physiological Society: history of the capillary wall','url':'https://journals.physiology.org/doi/full/10.1152/ajpheart.00704.2007','note':'Malpighi’s microscopic observations came after Harvey; the chapter juxtaposes distinct generations, not one experiment.'}]
 for st in s['stages']:
  if st['id']=='models':st['motivation']='A useful model can still mislead the people it affects. Describe its limits in a model card, then build an audited service that accepts challenges.'
  if st['id']=='anatomy':st['motivation']='These inherited diagrams deserve comparison, not automatic contempt. Make an anatomical atlas and an annotated correction supported by repeated observation.'
  if st['id']=='photo':st['motivation']='A beautiful image is not yet a durable record. Make a print edition from a stable negative, and an annotated visual archive others can inspect.'
  if st['id']=='commons':st['motivation']='The canal has several users, each with real needs. Create a monitoring agreement and connect it to a nested agreement with neighboring authorities.'
  if st['id']=='chance':
   st['motivation']='The match is first to three wins; the score is two to one when play must stop. Each round was fair and independent. Divide the four-coin stake fairly, then make a revised risk estimate for the archive.'
   st['area']['label']='The archive’s correspondence table'
   st['area']['travelText']='We carry our tools to a reading table holding letters about games, wagers and uncertain evidence.'
  if st['id']=='argument':st['motivation']='Two speakers sound equally certain. Give our audience a valid argument and a counterexample to a mistaken general claim.'
  if st['id']=='optics':st['locations']=['dark-room']
  if st['id']=='longitude':st['locations']=['trial-deck']
 s['locations']=[{'id':'dark-room','label':'Dark room','description':'A room that excludes stray light so a small aperture can project an observable image.'},{'id':'trial-deck','label':'Trial ship','description':'A sea trial subjects a timekeeper to motion and changing conditions. A successful trial is evidence, not a guarantee for every voyage.','sources':['longitude']}]
 for r in s['recipes']:
  if r['id'].startswith('models-'):r['sources']=['nist']
  if r['id'].startswith('optics-'):r['sources']=['optics-object','optics-manuscript']
  if r['id'].startswith('texts-'):r['sources']=['alexandria']
  if r['id'] in ('circulation-09','circulation-10'):r['sources']=['capillaries'];r['caveat']='Later microscopic evidence is combined retrospectively with Harvey’s earlier work. Harvey did not observe these capillaries.'
  if r['id']=='optics-05':r['at']='dark-room'
  if r['id']=='longitude-04':r['a'],r['b']=r['b'],r['a'];r['at']='trial-deck'
 explanations={
 'probability':'For equally likely outcomes, compare the favorable cases with all possible cases. The result depends on which outcomes your model treats as equally likely.',
 'sample-space':'A list of possible outcomes under the agreed rules. For the next two fair rounds there are four equally likely winner sequences; an early finish can make the second result irrelevant.',
 'expected-value':'Weight each possible payout by its probability, then add. This is a fair-value calculation under the model, not a promise about what any single play will pay.',
 'frequency-table':'Count how often each outcome occurred. Observed frequencies can test a probability model, but a short run need not match it exactly.',
 'empirical-distribution':'The relative frequencies describe this set of observations. They are evidence about a process, not automatic proof of its future probabilities.',
 'risk-table':'Keep each loss beside its likelihood. Two prospects with the same average can still have very different worst cases.',
 'conditional-probability':'Restrict attention to the outcomes compatible with the condition, then compare within that smaller space. P(A given B) need not equal P(B given A).',
 'revised-risk-estimate':'Evidence changes the estimated likelihoods, not necessarily the available outcomes or what people value. A revised estimate can still be wrong.',
 'scaled-architectural-view':'Measured proportions connect the imagined view to the courtyard plan. It can guide comparison without claiming a painted view is a complete survey.',
 'observational-sketch':'The projected scene offers a reference for contours and light. The artist still chooses what to emphasize, simplify or depart from.',
 'paint':'Pigment supplies color; a binder holds it together and attaches it to a surface. Different media afford different marks.',
 'tonal-study':'Light and dark masses are considered before detail. They can make space legible even without polished color.',
 'spatial-painting':'Tonal relationships and perspective now work together. Neither is a universal requirement for successful art.',
 'occlusion-study':'A form hiding part of another suggests which is nearer; this depth cue need not use a vanishing point.',
 'light-ray':'A ray is a model of a path along which light travels, not a solid thread.',
 'shadow':'The barrier blocks some paths from the source; the unlit region records its shape.',
 'narrow-beam':'An aperture selects a small bundle of light paths.',
 'projected-spot':'The screen makes the arriving light visible at a definite place.',
 'inverted-image':'Rays from the top and bottom of the scene cross at the aperture. The projected image is inverted.',
 'camera-obscura':'An enclosed dark space with a small opening forms an image of an outside scene. The model can be a room or a portable box.',
 'refraction-model':'A model of how light changes direction across materials. This simplified card omits the full angle-dependent law.',
 'focused-image':'A suitably arranged lens brings rays from scene points to corresponding points on a screen.',
 'optical-experiment':'The arrangement can be repeated and varied. A convincing image is evidence to investigate, not an automatic verdict on every theory of vision.',
 'image-forming-model':'This model connects light paths to positions in an image. It does not attempt to model perception in the brain.',
 'vanishing-point':'In this construction, a family of parallel lines receding from the picture plane converges at a point.',
 'perspective-grid':'A geometric guide to constructing depth from a chosen viewpoint; not the only legitimate way to depict space.',
 'perspective-drawing':'The plan is projected into a view from one chosen eye position.',
 'courtyard-painting':'Geometry, overlapping forms and tonal relationships work together to suggest a courtyard. Different painting traditions may choose different aims.',
 'fair-stake-division':'At two wins to one in a first-to-three match, the leader wins with probability 1/2 + (1/2 × 1/2) = 3/4. Divide four coins as three and one, not in the score ratio two to one. This assumes fair independent rounds and unchanged rules.',
 'updated-odds':'Prior odds multiplied by a likelihood ratio produce posterior odds. The assumptions behind the evidence model still need scrutiny.',
 'tested-chronometer':'The timekeeper has faced a sea trial. Accuracy, durability, affordability and replication remain separate questions.',
 'lunar-distance-fix':'The Moon’s changing apparent position and tables provide a reference-time estimate. This does not require carrying a perfect clock, but demands observations and calculation.',
 'cross-checked-position':'Two methods can disagree usefully: compare their assumptions and errors rather than declaring one universally obsolete.',
 'geological-history':'The sequence includes deposition, deformation, erosion and renewed deposition. Missing rock can be evidence of missing time.',
 'natural-experiment-comparison':'Households served by different companies can be compared while sharing much of their neighborhood. It is not random assignment; remaining differences still matter.',
 'information-measure':'An uncertainty-related quantity over possible symbols. It does not certify the message’s truth or importance.',
 }
 for r in s['recipes']:
  if r.get('out') in explanations:r['description']=explanations[r['out']]
 for i in s['items']:
  if i['id'] in explanations:i['description']=explanations[i['id']]
 s['notes'] += ['Independent narrative review rejected the original220 quota-shaped bank; current bank is a pruned candidate, not a certified full game.','Exact goal prerequisite route currently192 combinations, below the requested200–300 full-game target. Do not count optional recipes as mandatory play.','Optics→Perspective and Chance are the recommended first fresh-play slices.','Source gaps remain in introductory logic, general inference, comparative-history specifics and speculative design.']
 # Incoming scene takes only its own known useful things, including its local optional
 # experiments. Engine v3 gathers the same physical tokens from earlier accessible
 # areas, preserving provenance; it never grants/clones unseen tools.
 for st in s['stages']:
  local=[r for r in s['recipes'] if r['id'].startswith(st['id']+'-')]
  st['carry']=sorted({i for r in local for i in (r['a'],r['b']) if not i.startswith('@')} | {o['item'] for o in st['objectives'] if o.get('item')})
  st['area']['travelText']='We collect the tools this collection needs from the places we have already visited. Everything else stays where we left it.'
 return s
