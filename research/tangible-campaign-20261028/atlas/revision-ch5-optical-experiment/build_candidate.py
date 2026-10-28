"""Bounded chapter-5 content candidate; no base writes, no engine/UI edits."""
import copy, hashlib, json, pathlib, shutil
ROOT=pathlib.Path(__file__).resolve().parent
BASE=ROOT.parent/'revision-v5-baghdad-calculation'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def write(name,obj): (ROOT/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
assert sha(BASE/'scenario.json')=='af8f8f4a01fc854bbe3a21868883cf1bab175164528e491b01b8b6d1b78268c8'
s=json.loads((BASE/'scenario.json').read_text()); chapters=json.loads((BASE/'chapters.json').read_text())
original=copy.deepcopy(s); original_chapters=copy.deepcopy(chapters)
items={i['id']:i for i in s['items']}; recipes={r['id']:r for r in s['recipes']}
primary='optics-lamps-primary'
attribution='Authored two-lamp teaching adaptation in modern diagram notation, not a surviving experimental notebook or historical quotation. Based on Ibn al-Haytham, Optics I.6 §§85–87, A. I. Sabra translation (1989), pp.90–91.'
def edit(id,label,text=None,description=None,source=True):
 i=items[id];i['label']=label
 if text: i['reading']={'text':text,'attribution':attribution}
 if description: i['description']=description
 elif text: i['description']=text
 if source and primary not in i['sources']:i['sources'].append(primary)
edit('lamp','Two lamps H/L + movable cover',
 'Two lamps can shine at the same time. Their fixed marks are H and L on the positions card. A separate opaque cover can screen either lamp before its light reaches the opening; it does not cover the opening or a patch on the receiving screen. The comparison record supplies the trial observations: this game is not a live light simulation.')
edit('source-positions','H above O; L below O; screen beyond O',
 'Side view of the authored setup: both lamps are left of the small aperture O; a white receiving screen is on the right, in the dark room. H is one unit above O, L one unit below. The lamps are equally far left of O, and the screen is that same horizontal distance to its right. Units are arbitrary. Keep both lamps, O and the screen fixed; change only which lamp is covered. Light travels through uniform air, and the two receiving patches can be distinguished.')
edit('camera-obscura','Camera obscura: doorway top appears below',None,
 'The dark-room camera forms an inverted courtyard image: the upper doorway appears below and the lower paving above. The same opening and receiving screen can then be used with the two fixed lamps. This is a familiar construction, not an exclusive-inventor claim.',False)
edit('ray-diagram','Equal steps: H → lower; L → upper',
 'Use the corrected proof’s discipline: preserve equal relations rather than trust a sketch. Assume a straight light path in uniform air. Along one straight line, equal horizontal runs have equal vertical changes. H→O drops one unit; the equally long run beyond O drops one more, reaching the lower screen mark (−1). L→O rises one unit; continuing equally far rises one more, reaching the upper mark (+1). Thus H→lower and L→upper. The earlier equality reasoning helps work out this consequence; the old triangle proof does not establish the physical straight-path assumption. A ray is a drawn path, not a luminous thread.')
edit('crossed-rays','Crossing paths invert the courtyard image',
 'The straight path from the doorway’s top crosses the aperture and reaches the lower part of the screen; the path from the paving reaches the upper part. This agrees with the inverted camera image. In the marked lamp setup the same geometry gives H→lower and L→upper. Paths cross at O, but a crossing drawn on paper alone does not show whether the light contributions remain separable. Covering just one lamp can test that claim.')
edit('predicted-spots','Cover H → lower patch should vanish',
 'Prediction before consulting the trial: both lamps uncovered should give two patches, H at the lower mark and L at the upper. If each contribution continues independently through O, covering H should remove only the lower patch and leave the upper one. Uncover H: both return. Cover L instead: only the upper patch should vanish, leaving the lower one. The geometry tells us which patch belongs to which lamp; selective removal tests whether crossing makes their contributions inseparable.')
edit('comparison-record','H covered: lower gone; L covered: upper gone',
 'Supplied observations for the authored trial, with lamps, aperture and receiving screen fixed:\nBoth uncovered: upper and lower patches present.\nH covered: lower patch absent; upper remains.\nH uncovered again: both present.\nL covered: upper patch absent; lower remains.\nL uncovered again: both present.\nEach disappearance matches the prediction. The record changes one cover condition at a time and includes restoration; it is not a claim that merely moving one lamp tested two simultaneous light contributions.')
edit('optical-model','Crossing preserves H/lower and L/upper',
 'Geometry predicted H→lower and L→upper; the supplied trial removed just the corresponding patch whenever H or L was screened, and restored it when uncovered. Therefore, in this aperture arrangement crossing did not destroy source-to-patch correspondence. This counts against an inseparable-mixture account in which separate contributions could not emerge after meeting at O. The same straight-path representation explains the courtyard image’s inversion. Keep the distinction between a represented path, the supplied observation, and the supported conclusion; this is not a proof of every claim about light or sight.')
edit('optical-question','Light path explained; eye sensing still open',
 'The earlier dark-Moon case showed why an observation can support a prediction without selecting a unique complete account. Here the selective-cover test supports separate light paths through the opening; it can reject the stated inseparable-mixture consequence. But a receiving screen does not sense. This trial does not decide how an eye senses light, what structures do the sensing, or how perception occurs: rival eye accounts could agree on every patch in this record. Do not turn success on light propagation into a complete theory of vision.')
# Make the physical and mathematical dependencies real, without adding steps.
# The diagram uses the actual positions; the prediction applies it to the lamps;
# observation uses the built aperture/screen apparatus, not merely a second lamp token.
for rid,a,b in [
 ('make-ray-diagram','source-positions','arabic-proof'),
 ('make-predicted-spots','ray-diagram','lamp'),
 ('make-comparison-record','predicted-spots','camera-obscura')]:
 r=recipes[rid];r['a']=a;r['b']=b
 r['lifecycle']={a:{'role':'retain','reason':'The diagram, evidence or reusable setup is consulted, not used up.'},b:{'role':'retain','reason':'The diagram, evidence or reusable setup remains available for comparison and later work.'}}
for rid in chapters[4]['recipes']:
 r=recipes[rid]
 if r['out'] in ['camera-obscura','ray-diagram','crossed-rays','predicted-spots','comparison-record','optical-model','optical-question']:
  r['description']=items[r['out']]['description']
  if r['out']!='camera-obscura':r['sources'].append(primary)
stage=s['stages'][4]
stage['motivation']='A doorway appears upside down in the dark room. H and L send light through one opening: if their paths cross, do their lights become an inseparable mixture? Work out which patch should vanish when one lamp is covered, then compare the supplied trial.'
for goal,text in zip(stage['objectives'],['Form the inverted courtyard image','Test whether crossing erases lamp identity','Separate light paths from eye sensing']):goal['text']=text
s['sources'].append({'id':primary,'title':'Ibn al-Haytham, Optics I.6 §§85–87; A. I. Sabra translation (1989), pp.90–91','url':'https://resources.warburg.sas.ac.uk/pdf/ffh360b2205460.pdf#page=50','note':'Primary multiple-lamp aperture and selective-screening case: the corresponding patch disappears and returns; crossing does not make the contributions inseparable. H/L labels, equal distances and unit offsets are an authored two-lamp adaptation. This case alone does not establish a complete account of eye sensing.'})
chapters[4]['sources'].append(primary)
# Every patch names an entity ID and pins its complete before-value, so disjoint
# chapter authors can compose without array-index drift or silently overwriting.
ops=[]
for collection in ['items','recipes','stages','sources']:
 old={x['id']:x for x in original[collection]}
 for x in s[collection]:
  before=old.get(x['id'])
  if before!=x: ops.append({'file':'scenario.json','collection':collection,'id':x['id'],'op':'add' if before is None else 'replace','before':before,'after':x})
for before,after in zip(original_chapters,chapters):
 if before!=after:ops.append({'file':'chapters.json','collection':'$root','id':after['id'],'op':'replace','before':before,'after':after})
patch={'format':'id-addressed-json-patch/v1','baseFiles':{f:sha(BASE/f) for f in ['scenario.json','chapters.json','connections.json']},'scope':'Only chapter5 cairo: existing local items/recipes/stage text, its source list, and one new chapter-local primary source. No ID removal, no engine/UI change.','operations':ops}
write('scenario.json',s);write('chapters.json',chapters);write('patch.id-addressed.json',patch)
for name in ['connections.json','runtime.mjs','runtime-manifest.json','strict-surface.mjs']:
 shutil.copy2(BASE/name,ROOT/name)
shutil.copytree(BASE/'frozen-runtime',ROOT/'frozen-runtime',dirs_exist_ok=True)
write('base-hashes.json',{str(BASE/f):sha(BASE/f) for f in ['scenario.json','chapters.json','connections.json','author-route.json','manifest.json']})
write('case-values.json',{'kind':'Authored two-lamp geometric-optics teaching adaptation, not historical measured data or a live simulation','aperture':[0,0],'sourcePlaneX':-1,'screenPlaneX':1,'sources':{'H':[-1,1],'L':[-1,-1]},'predictedScreenY':{'H':-1,'L':1},'observations':[{'cover':None,'upper':True,'lower':True},{'cover':'H','upper':True,'lower':False},{'cover':None,'upper':True,'lower':True},{'cover':'L','upper':False,'lower':True},{'cover':None,'upper':True,'lower':True}]})
write('primary-verification.json',{'url':'https://resources.warburg.sas.ac.uk/pdf/ffh360b2205460.pdf#page=50','title':'The Optics of Ibn al-Haytham, Books I–III, A. I. Sabra, Warburg Institute, 1989','location':'Book I, chapter6, §§85–87, printed pp.90–91; one-based PDF page50','verifiedBy':'Read actual primary PDF text using pdftotext -f 50 -l 50 -layout; title/publication inspected on PDF page1. Preserved audit download independently inspected.','localSource':'/tmp/atlas-optics-primary-sabra.pdf','sha256':sha(pathlib.Path('/tmp/atlas-optics-primary-sabra.pdf')),'webStatus':'web.open rejected 23,654,985-byte PDF as content-too-large; readable preserved local PDF resolved this access limit.','supported':'Several lamps face one opening; separate patches correspond to each lamp. Screening a lamp removes its patch; uncovering restores it. The author argues against inseparable mixing when paths meet at the aperture.','authoredAdaptation':'Exactly two lamps H/L, unit heights and equal source/screen distances, modern labels and the supplied observation table.','boundary':'The cited text proceeds to a historical account of eye sensing; the game does not claim this lamp arrangement independently establishes that account or a modern retinal theory.'})
print(json.dumps({'scenarioSha256':sha(ROOT/'scenario.json'),'operations':len(ops),'output':str(ROOT)},indent=2))
