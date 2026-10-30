"""Prune quota-driven paperwork. Kept separately so the rejected first bank is auditable."""
REVISIONS={
'argument':('''Claim + Reason = Argument
Argument + Stated assumptions = Explicit premises
Explicit premises + Inference rule = Valid argument
General claim + Contrary case = Counterexample
Word + Competing meanings = Ambiguity
Ambiguity + Context = Disambiguated term
Disambiguated term + Question = Precise question''',['Valid argument','Counterexample']),
'anatomy':('''Anatomical observation + Field note = Anatomy record
Anatomy record + Drawing = Anatomical plate
Anatomical plate + Labels = Labeled anatomy
Labeled anatomy + Sequence = Anatomical atlas
Inherited diagram + Anatomy record = Anatomical discrepancy
Anatomical discrepancy + Species comparison = Comparative anatomy
Comparative anatomy + Repeated observation = Supported correction
Supported correction + Source attribution = Annotated correction''',['Anatomical atlas','Annotated correction']),
'photo':('''Camera obscura + Light-sensitive paper = Latent paper image
Latent paper image + Development process = Visible paper negative
Visible paper negative + Fixing process = Stable negative
Stable negative + Contact printing = Positive print
Positive print + Scale marker = Measured photograph
Measured photograph + Time series = Photographic record
Photographic record + Context annotation = Annotated visual archive
Stable negative + Reproduction sequence = Print edition''',['Print edition','Annotated visual archive']),
'commons':('''Resource map + User testimony = User-resource map
User-resource map + Seasonal demand = Allocation problem
Allocation problem + Local deliberation = Allocation rule
Allocation rule + Observable indicators = Monitoring agreement
Monitoring agreement + Accessible appeal = Accountable procedure
Accountable procedure + Revision meeting = Revisable charter
Revisable charter + Neighboring authorities = Nested agreement''',['Monitoring agreement','Nested agreement']),
'models':('''Training examples + Learning rule = Trained predictor
Trained predictor + Held-out observations = Validation result
Validation result + Deployment cases = Generalization assessment
Generalization assessment + Subgroup errors = Disaggregated evaluation
Disaggregated evaluation + Documented limits = Model card
Model card + Accessible appeal = Contestable decision process
Contestable decision process + Outcome monitoring = Audited service''',['Model card','Audited service']),
'future-memory':('''Personal archive + Consent record = Consented memory collection
Consented memory collection + Access controls = Private memory archive
Private memory archive + Revocation mechanism = Revocable memory archive
Annotated visual archive + Preservation emulation = Living historical collection
Living historical collection + Revocable memory archive = Governed memory commons
Governed memory commons + Revisable charter = Intergenerational archive charter''',['Revocable memory archive','Intergenerational archive charter']),
'future-world':('''Planetary proposal + Causal assessment = Intervention model
Intervention model + Uncertainty statement = Bounded forecast
Bounded forecast + Alternative scenarios = Scenario ensemble
Scenario ensemble + Reversibility plan = Reversible trial design
Reversible trial design + Observable indicators = Stop-condition protocol
Stop-condition protocol + Nested agreement = Joint oversight agreement
Joint oversight agreement + Dissenting record = Plural decision record
Plural decision record + Intergenerational archive charter = Living atlas of decisions''',['Reversible trial design','Living atlas of decisions'])
}
def apply(chapters):
 out=[]
 for c in chapters:
  c=list(c)
  if c[0] in REVISIONS:c[7],c[8]=REVISIONS[c[0]]
  if c[0]=='texts':
   c[7]=c[7].replace('Parallel edition + Source attribution = Citable edition\n','');c[8]=['Critical edition','Parallel edition']
  c[7]=c[7].replace('Instantaneous velocity + Time interval = Acceleration','Velocity change + Time interval = Acceleration').replace('Conditional probability + Prior odds = Updated odds','Likelihood ratio + Prior odds = Updated odds').replace('Inverted image + Dark chamber = Camera obscura','Inverted image + Enclosure plan = Camera obscura').replace('Eye point + Picture plane = Projection construction','Image-forming model + Picture plane = Projection construction').replace('Paint + Light study = Tonal study','Camera obscura + Light study = Observational sketch\nPaint + Observational sketch = Tonal study')
  out.append(tuple(c))
 return out
