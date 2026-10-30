from pathlib import Path
import json, hashlib, copy, difflib
ROOT=Path(__file__).resolve().parent
BASE=ROOT.parent/'revision-v5-baghdad-calculation/scenario.json'
EXPECTED='af8f8f4a01fc854bbe3a21868883cf1bab175164528e491b01b8b6d1b78268c8'
raw=BASE.read_bytes(); assert hashlib.sha256(raw).hexdigest()==EXPECTED
base=json.loads(raw); s=copy.deepcopy(base)
ITEMS={i['id']:i for i in s['items']}; RECIPES={r['id']:r for r in s['recipes']}
ATTR='Authored modern-unit teaching reconstruction with rounded quantities and stated idealizations; not Newton’s recorded measurements or a historical quotation.'
PRIMARY='newton-moon-test-primary'
rows={
'position-times':(
 'Drop positions: 0, 4.90, 19.60 m at 0, 1, 2 s',
 'Supplied teaching record: a body released from rest falls approximately 0 m, 4.90 m and 19.60 m after 0 s, 1 s and 2 s. Downward displacement is positive. Treat near-surface acceleration as constant over this short drop and neglect air resistance. These rounded values are an idealized dossier, not a transcription of Newton’s experiments.'),
'direction-diagram':(
 'Fall: downward; Moon: velocity keeps turning',
 'Velocity includes direction as well as speed. The fall record is straight downward. In the circular approximation for the Moon, speed stays constant but the velocity turns; acceleration points inward toward Earth. Acceleration is change of velocity per unit time, not distance fallen.'),
'fall-record':(
 'Surface fall: ≈4.90 m in 1 s from rest',
 'The supplied near-surface record gives approximately 4.90 m of downward displacement in 1 s after release from rest. Ignore air resistance and use constant local acceleration. This is a displacement in metres, not an acceleration in metres per second squared; it will be compared with the Moon’s departure from its tangent over the same 1 s.'),
'mass-comparison':(
 '1 kg and 2 kg: same idealized fall',
 'For this teaching comparison, a 1 kg body and a 2 kg body have the same acceleration in an idealized free fall without air resistance. In modern notation net force F = ma. Thus equal accelerations do not mean equal forces on unequal masses.'),
'orbit-distances':(
 'Moon: ≈60 Earth radii; ≈27.3-day circuit',
 'Independent supplied orbital inputs, not values fitted from the 4.90 m fall: Earth radius R ≈ 6.37 million m; lunar distance r ≈ 60R ≈ 382.2 million m; orbital period T ≈ 27.3 days ≈ 2,358,720 s. Under a circular, fixed-Earth, short-time approximation, the geometric construction gives an inward departure from the initial tangent of about 1.36 mm in 1 s. Ignore eccentricity, solar perturbations and Earth’s motion about the Earth–Moon barycentre. These are rounded teaching inputs, not Newton’s exact historical numbers.'),
'force-rule':(
 'Candidate: inward acceleration ∝ 1/r²',
 'Proposed Earth-centred rule: a(r) = a(R) × (R/r)², with r measured from Earth’s centre and R its radius. This is a rule for acceleration; force on a test body is F = ma. For the same short time Δt, displacement from an initially tangent straight path is approximately d = ½a(Δt)². A body released from rest falls the same distance under the same constant acceleration. The rule is a candidate to compare with independently supplied orbit data.'),
'motion-differences':(
 'Successive 1 s averages: 4.90 → 14.70 m/s',
 'Reuse the algebra method with quantities and units attached: (4.90−0) m ÷ 1 s = 4.90 m/s; (19.60−4.90) m ÷ 1 s = 14.70 m/s. These are average downward velocities over successive intervals, not the endpoint speeds. Under the stated constant-acceleration assumption, they equal the velocities at the interval midpoints, 0.5 s and 1.5 s.'),
'acceleration-record':(
 'Fall: a≈9.80 m/s²; turning also accelerates',
 'The interval midpoints are 1 s apart, so the constant downward acceleration is (14.70−4.90) m/s ÷ 1 s = 9.80 m/s². That is not the 4.90 m distance fallen in the first second. The direction diagram adds the orbital point: a Moon moving at steady speed still accelerates because its velocity turns.'),
'force-comparison':(
 '1 kg: 9.80 N; 2 kg: 19.60 N; same a',
 'Using F = ma with the calculated acceleration: 1 kg × 9.80 m/s² = 9.80 N, while 2 kg × 9.80 m/s² = 19.60 N. Divide each force by its own mass to recover the same 9.80 m/s². Compare accelerations, not raw forces, when relating these unequal bodies to the Moon.'),
'orbital-geometry':(
 'Circle + tangent: d≈2π²r(Δt/T)²',
 'Carry forward two mathematical habits: state the geometric premises, and compare a calculated position with a recorded one. For a circular orbit of radius r and period T, an elapsed time Δt turns through θ = 2πΔt/T. The inward distance from the initial tangent is r(1−cos θ), approximately rθ²/2 for this very short interval; hence d ≈ 2π²r(Δt/T)². This supplied modern construction extends the earlier geometry; Euclid’s triangle proof alone did not establish orbital dynamics. The tangent is straight continuation at the initial velocity, not the distance remaining to Earth.'),
'orbit-model':(
 'Same short time: d(r)/d(R)≈(R/r)²',
 'Join the circular construction to the candidate acceleration rule. Since d ≈ ½a(Δt)², equal short time intervals cancel from the ratio: d(r)/d(R) ≈ a(r)/a(R) = (R/r)². Thus orbital departure and a fall from rest can be compared without confusing displacement with acceleration. The orbital construction supplies a separate value to check; the distance law does not manufacture that observation.'),
'cross-orbit-check':(
 'Moon: ≈1.36 mm in 1 s; rule gives 1/3600',
 'Insert the supplied lunar radius and period into the circular construction: 2π² × 382,200,000 m × (1 s / 2,358,720 s)² ≈ 0.001356 m, or 1.36 mm of inward departure in 1 s. Separately, r ≈ 60R makes the candidate ratio 1/60² = 1/3600. The terrestrial branch must now supply the surface fall for comparison. This is one Moon-distance check, not a claim to have tested several planetary orbits.'),
 'terrestrial-account':(
 '1 s from rest: ½×9.80×1² = 4.90 m',
 'The force-to-mass calculation gives a ≈ 9.80 m/s². From rest with constant acceleration, d = ½at² = ½ × 9.80 m/s² × (1 s)² = 4.90 m, matching the supplied fall record. This restates the terrestrial dossier consistently; it is not an additional independent experiment. Keep the same 1 s interval for the comparison with lunar departure.'),
'shared-motion-account':(
 '4.90 m ÷ 60² ≈ 1.36 mm: matches Moon',
 'Scale the terrestrial displacement by the candidate inverse-square ratio: 4.90 m ÷ 60² = 0.001361… m ≈ 1.36 mm in 1 s. The separate orbit calculation gave 0.001356… m ≈ 1.36 mm in 1 s: agreement at the stated rounding, not exact equality. Equivalently, 9.80 m/s² ÷ 3600 ≈ 0.00272 m/s². Keeping surface acceleration unchanged at the lunar distance would instead predict 4.90 m in 1 s, about 3600 times too much. This comparison supports one quantitative account of the two motions under the stated idealizations.'),
'scope-of-law':(
 'Earth and Moon fit; gravity’s cause stays open',
 'The fall and lunar departure agree with the proposed inverse-square scaling at this precision. That is an achievement, not a demonstration of gravity’s ultimate physical cause. One rounded comparison also does not uniquely fix every possible distance law or test every orbit. Newton’s later General Scholium separates the successful gravitational account from an established cause. No numerical vortex theory has been tested in this exercise, and mathematical agreement does not compel a particular theology.'),
'mathematical-treatise':(
 'Earth → Moon: 4.90 m ÷ 3600 ≈ 1.36 mm',
 'The checked account preserves a calculable claim: over the same 1 s, a 4.90 m surface fall divided by 60² agrees, at the supplied precision, with the Moon’s separately orbit-derived 1.36 mm inward departure. Algebra kept operations and units consistent; geometry turned radius and period into departure from a tangent; the earlier sky caution limits the inference. The circular, short-time, fixed-Earth and negligible-resistance idealizations remain attached. This supports shared gravitational scaling, not a measured exact equality, a proof of every orbit, or gravity’s ultimate cause.')
}
for id,(label,text) in rows.items():
 o=ITEMS[id];o['label']=label;o['description']=text;o['reading']={'text':text,'attribution':ATTR}
 o['sources']=list(dict.fromkeys(o.get('sources',[])+[PRIMARY]))
 if 'make-'+id in RECIPES:
  r=RECIPES['make-'+id];r['description']=text;r['sources']=list(dict.fromkeys(r.get('sources',[])+[PRIMARY]))
st=next(x for x in s['stages'] if x['id']=='motion')
st['motivation']='A surface body falls about 4.90 m in 1 s; the Moon departs from its tangent by about 1.36 mm in the same time. Can the proposed inverse-square rule connect them at a distance of about 60 Earth radii? Keep the calculation distinct from gravity’s ultimate cause.'
st['caches'][0]['narrative']='An authored, rounded modern-unit Moon-test dossier: a near-surface drop and a separate orbital record. The idealizations and quantities are not Newton’s exact measurements.'
st['objectives'][0]['text']='Check 4.90 m ÷ 60² against the Moon’s 1.36 mm'
s['sources'].append({'id':PRIMARY,'title':'Isaac Newton, Principia, Book III, Proposition IV and scholium (primary text; printed pp. 391–393)','url':'https://sites.pitt.edu/~jdnorton/teaching/2682_confirmation/2010/Principia_fragments/Principia_Bk3_to_Prop_15.pdf#page=9','note':'The historical Moon test supplies the comparison structure. This chapter’s rounded modern-unit figures, one-second normalization and circular short-time calculation are authored teaching adaptations, not quoted historical measurements.'})

def dump(o):return json.dumps(o,ensure_ascii=False,indent=2)+'\n'
new=dump(s);(ROOT/'scenario.json').write_text(new)
ops=[];rfc=[]
for col in ['items','recipes','stages','sources']:
 old={o['id']:o for o in base[col]};now={o['id']:o for o in s[col]}
 for i,o in enumerate(s[col]):
  id=o['id']
  if id not in old:
   ops.append({'op':'add','collection':col,'id':id,'value':o})
   rfc.append({'op':'add','path':f'/{col}/-','value':o})
  elif o!=old[id]:
   for field in o:
    if o[field]!=old[id].get(field):
     p={'op':'replace' if field in old[id] else 'add','collection':col,'id':id,'field':field,'value':o[field]}
     if field in old[id]:p['before']=old[id][field]
     ops.append(p)
     rfc.append({'op':'test','path':f'/{col}/{i}/id','value':id})
     if field in old[id]:rfc.append({'op':'test','path':f'/{col}/{i}/{field}','value':old[id][field]})
     rfc.append({'op':p['op'],'path':f'/{col}/{i}/{field}','value':o[field]})
patch={'format':'id-addressed-scenario-field-patch-v1','basePath':str(BASE),'baseSha256':EXPECTED,'candidateSha256':hashlib.sha256(new.encode()).hexdigest(),'scope':'Chapter 14 motion content only. Apply by collection + id; verify before values. No graph, lifecycle, input, carry, objective identity, or engine change.','operations':ops}
(ROOT/'motion-id-patch.json').write_text(dump(patch));(ROOT/'motion-rfc6902-patch.json').write_text(dump(rfc))
(ROOT/'scenario.diff').write_text(''.join(difflib.unified_diff(raw.decode().splitlines(True),new.splitlines(True),fromfile='v5/scenario.json',tofile='motion-only/scenario.json')))
visible={'stage':{k:st[k] for k in ['id','title','motivation','objectives']},'items':[{'id':id,'label':ITEMS[id]['label'],'reading':ITEMS[id]['reading']} for id in rows]}
(ROOT/'visible-motion-surface.json').write_text(dump(visible))
(ROOT/'author-routes.json').write_text(dump({'routes':[
 {'name':'terrestrial-first','recipes':['make-motion-differences','make-acceleration-record','make-force-comparison','make-terrestrial-account','make-orbital-geometry','make-orbit-model','make-cross-orbit-check','make-shared-motion-account','make-scope-of-law','make-mathematical-treatise']},
 {'name':'lunar-first','recipes':['make-orbital-geometry','make-orbit-model','make-cross-orbit-check','make-motion-differences','make-acceleration-record','make-force-comparison','make-terrestrial-account','make-shared-motion-account','make-scope-of-law','make-mathematical-treatise']}],
 'branches':{'terrestrial':['position-times + algebra-method → motion-differences','motion-differences + direction-diagram → acceleration-record','acceleration-record + mass-comparison → force-comparison','fall-record + force-comparison → terrestrial-account'],'lunar':['orbital-table + geometrical-proof → orbital-geometry','orbital-geometry + force-rule → orbit-model','orbit-model + orbit-distances → cross-orbit-check'],'join':['terrestrial-account + cross-orbit-check → shared-motion-account','shared-motion-account + bounded-sky-claim → scope-of-law','scope-of-law + checked-edition → mathematical-treatise']},'readingRequiredByEngine':False,'graphUnchanged':True}))
print(patch['candidateSha256'],len(ops),'ID-addressed operations')
