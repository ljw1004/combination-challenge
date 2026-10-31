from pathlib import Path
import json,copy,hashlib,subprocess,difflib
P=Path(__file__).resolve().parent
LIVE=Path('/workspace/shared/combination-fork-recovery-20261028')
BASE=Path('/workspace/shared/combination-campaign-research-20261028/atlas/revision-v7-grounded-connections')
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
# Record inputs before any candidate construction; never replace their bytes.
if not (P/'input-preservation.json').exists():
 files=[LIVE/f for f in subprocess.check_output(['git','-C',str(LIVE),'ls-files'],text=True).splitlines() if (LIVE/f).is_file()]
 files += [BASE/'scenario.json',BASE/'chapters.json',BASE/'connections.json',Path('/workspace/shared/combination-authenticity-audit-20261028/atlas.json')]
 write(P/'input-preservation.json',{'liveHead':subprocess.check_output(['git','-C',str(LIVE),'rev-parse','HEAD'],text=True).strip(),'sha256':{str(f):sha(f) for f in files}})
s=json.loads((P/'original-live217.json').read_text());original=copy.deepcopy(s)
s['id']='atlas-connected-questions-v9-evidence-repair-research'
I={x['id']:x for x in s['items']};R={x['id']:x for x in s['recipes']};S={x['id']:x for x in s['stages']}
def payload(id,label,text,attribution='Authored teaching reconstruction, not a historical quotation or surviving document.'):
 I[id]['label']=label;I[id]['description']=text;I[id]['reading']={'text':text,'attribution':attribution}
 for r in s['recipes']:
  if r['out']==id:r['description']=text
# One actual source, one corresponding figure, one consequential transcription error.
payload('proof-roll','Triangle proof: three equal sides, vertex C restored',
 'The roll identifies the two base endpoints as A and B and the chosen intersection of the two circles as C. Its instructions join A to C and B to C. Each circle has radius AB, so AC=AB and BC=AB; therefore AC=AB=BC. The edited copy uses C consistently and records its earlier D variant. This is the completed argument and corrected text, not a new construction to solve.')
for rid,old in [('make-set-page','circulating-arithmetic'),('make-diagram-block','illustration-method')]:
 r=R[rid];assert r['a']==old;r['a']='proof-roll';r['lifecycle']['proof-roll']=r['lifecycle'].pop(old)
 r['lifecycle']['proof-roll']['reason']='The same triangle roll supplies the printed text and drawing and remains the source witness for the final comparison.'
payload('set-page','Triangle type: join A to C and B to C',
 'The typeset page copies the triangle roll: A and B are the base endpoints; C is the chosen circle intersection; join AC and BC. The proof states AC=AB=BC. The roll stays beside the type as the source witness.')
payload('diagram-block','Triangle block: upper point D, not C',
 'The engraver copies the roll’s two circles and baseline AB, but cuts D at the chosen intersection where the roll has C. The drawing is the same triangle construction; its vertex label is a transcription error. No point C appears on this block.')
payload('illustrated-form','One triangle page; text C, block D',
 'The type and block describe the same triangle: the text asks for AC and BC, but the block marks that endpoint D and contains no C. The assembled page exposes a correspondence to check, not a successfully checked edition.')
payload('inked-form','Inked triangle form; C/D mismatch remains',
 'Ink is applied to the assembled triangle form. Its text still calls for C while its block labels the intersection D; preparing the printing surface has not repaired the mismatch.')
payload('proof-impression','Trial page: draw AC/BC; no point C',
 'The trial page reproduces the actual form: text “join AC and BC”; figure labels A, B and D. The upper point is D and no point C is printed. This is the proof sheet to inspect before producing the quire.')
payload('swapped-label','Label check: source C; printed D',
 'The proofreading slip records the actual triangle trial: the source’s intersection C is printed as D, while the instructions still say AC and BC. This is not a consistent renaming: the referenced endpoint C is absent. Swapping two symmetric base names would not by itself establish an error.',
 'Authored printing-proof dossier; this slip describes the supplied triangle proof sheet.')
payload('detected-error','Missing C: the trial’s D breaks the reference',
 'Compare the trial’s AC/BC instructions with its A/B/D figure. The text has no defined endpoint C. The slip identifies the single inconsistent vertex label, not a false geometric theorem or a harmless consistent renaming.')
payload('corrected-proof','Proof corrected: D → C; AC and BC now refer',
 'Use the earlier critical text, which restored C at the circle intersection, to correct this proof’s D label to C. Retain the old D reading in the correction record. The working proof now shows A, B, C beside instructions AC and BC; no geometric calculation is repeated.')
payload('printed-quire','Triangle quire: corrected C in every copy',
 'The quire reproduces the corrected triangle proof: A and B at the base, C at the chosen circle intersection, instructions AC and BC, and the conclusion AC=AB=BC. Its proofing record preserves the D → C correction and the source-to-copy comparison.')
payload('checked-edition','Checked triangle edition: source and copy agree',
 'Compare the quire with the same triangle roll that supplied its text and drawing: both use A/B/C, both join AC and BC, and both conclude AC=AB=BC. The D → C repair is recorded. This edition demonstrates a reusable source-to-copy publishing check: keep a source witness, compare wording and image references, record corrections, then verify the copies. Later books reuse that checking practice for their own new contents; they do not inherit the triangle’s conclusion as evidence.')
S['printing']['motivation']='Several towns want the triangle proof you already restored. Make a small edition, and catch a misprinted vertex before every copy repeats it. No new construction is needed.'
# State reference transfer at every direct later publication consumer. Numerical/content claims stay intact.
for r in s['recipes']:
 if r['id'] in {'make-checked-edition'}:continue
 if 'checked-edition' in [r['a'],r['b']] or ('printed-quire' in [r['a'],r['b']] and r['id']!='make-checked-edition'):
  old=r['description']
  prefix=('Reuse the triangle edition’s source-to-copy checking practice on this new material. ' if 'checked-edition' in [r['a'],r['b']] else 'Reuse the quire’s recorded layout and source-to-copy checking practice for this new text. ')
  r['description']=prefix+old
  out=I[r['out']]
  out['description']=prefix+out['description']
  if out.get('reading'):out['reading']['text']=prefix+out['reading']['text']
# Toy predictions are supplied in the input; residuals are supplied rather than a required calculation.
orbit_attribution='Invented, rounded position-check worksheet in modern notation, inspired by the historical use of careful pre-telescopic records. These are not Tycho’s measurements, Kepler’s tables, or a reconstruction of a historical orbital fit.'
payload('tycho-table','Teaching sky dossier: dated observations + candidate predictions',
 'Invented comparison dossier, not Tycho’s numerical records. All entries use the same angular origin and the same daily observing time.\nDate | elapsed days t | recorded direction | candidate direction\n1 January 1605 | 0 | 30.0° ± 0.1° | 30.0°\n11 January 1605 | 10 | 40.2° ± 0.1° | 40.0°\n21 January 1605 | 20 | 50.8° ± 0.1° | 50.0°\nThe proposed apparent-position rule is p = 30.0° + (1.0° per day) × t; its predictions are already shown. The residual means observed direction minus predicted direction, with the sign and degree unit retained. This is one deliberately simple uniform angular prediction, not a derivation of a planet’s physical orbit.',orbit_attribution)
payload('orbital-table','Prediction misses: 0.0°, +0.2°, +0.8°',
 'Keep each supplied date beside its observation and candidate prediction. The algebra method’s equal-quantity discipline gives residual e from predicted + e = observed: subtract the same predicted angle from both sides, so e = observed − predicted. No completing-square result is treated as an orbit.\nDate | observed | predicted | observed − predicted\n1 January 1605 | 30.0° ± 0.1° | 30.0° | 0.0°\n11 January 1605 | 40.2° ± 0.1° | 40.0° | +0.2°\n21 January 1605 | 50.8° ± 0.1° | 50.0° | +0.8°\nThe last two predictions lie outside the supplied ±0.1° observation intervals. This candidate fails these records at the stated tolerance. That does not by itself establish an ellipse, reject every circular model, identify a physical cause, or settle the arrangement of the cosmos. The differences are shown; no new calculation is required.',orbit_attribution)
# Existing continuation remains bounded, now anchored to the concrete retained example.
for id in ['predictive-sky-record']:
 prefix='The inherited 1605 teaching table retains predictions 30.0°, 40.0°, 50.0° beside observations 30.0°, 40.2°, 50.8° and residuals 0.0°, +0.2°, +0.8°. '
 I[id]['description']=prefix+I[id]['description'];I[id]['reading']['text']=prefix+I[id]['reading']['text'];R['make-'+id]['description']=I[id]['reading']['text']
S['astronomy']['caches'][0]['narrative']='A dated teaching reconstruction; the sky-check dossier supplies invented observations, an explicit candidate rule, and its predictions—not numerical transcriptions from Tycho.'
# Confirm the rule that is actually present; reserve the later wrong rival for switching.
logic_attribution='Authored three-input truth table in modern notation, not Boole’s original wording. It checks the supplied rule, not the justice of an entry policy.'
logic_rows='A B C | permission\n0 0 0 | 0\n0 0 1 | 0\n0 1 0 | 1\n0 1 1 | 0\n1 0 0 | 1\n1 0 1 | 0\n1 1 0 | 1\n1 1 1 | 0'
payload('boolean-specification','Eight cases: permit only 010, 100, 110',
 'For the supplied rule (A OR B) AND NOT C, OR includes both requests and C blocks either request. A/B alone have four cases; adding independent C gives eight.\n'+logic_rows+'\nThese eight outputs specify the already stated rule; no mistaken rival grouping has been supplied here.',logic_attribution)
payload('checked-logic','All eight cases agree; rule confirmed',
 'Apply the earlier counterexample discipline: a genuine disagreeing row would defeat the claim that this table implements (A OR B) AND NOT C. Check the complete supplied domain, not only a convenient permission case.\n'+logic_rows+'\nAll eight rows agree with the stated rule. In particular, 101 and 111 are blocked because C=1. The check confirms this already-correct specification; it does not repair an invented error. The uncovered lamp is the earlier example of the checking principle, not evidence about entry. A complete binary check does not decide whether the policy is just.',logic_attribution)
S['logic']['motivation']='Begin with four A/B cases, then add the blocking condition C. Check all eight cases of (A OR B) AND NOT C; confirmation matters even when the supplied rule is already correct.'
# Checkpoint identities remain, but replay the two revised recipes instead of their obsolete operands.
changed_checkpoint_actions=0
for c in s.get('checkpoints',[]):
 for a in c['actions']:
  if a.get('type')=='combine':
   for old,tool in [('circulating-arithmetic','type-case'),('illustration-method','engraver')]:
    if {a['a'],a['b']}=={old,tool}:
     a['a' if a['a']==old else 'b']='proof-roll';changed_checkpoint_actions+=1
chapters=json.loads((P/'original-chapters.json').read_text())
chapters[7]['earlier']=['critical-text','proof-roll']
write(P/'scenario.json',s);write(P/'chapters.json',chapters)
(P/'atlas-evidence-repair.ts').write_text("import type {Scenario} from './frozen-runtime/schema/scenario.ts';\n\n/** Isolated consistency-repair candidate; not a registered or published world. */\nexport const scenario: Scenario = "+json.dumps(s,ensure_ascii=False,indent=2)+";\n")
(P/'scenario.diff').write_text(''.join(difflib.unified_diff(json.dumps(original,ensure_ascii=False,indent=2).splitlines(True),json.dumps(s,ensure_ascii=False,indent=2).splitlines(True),fromfile='original-live217.json',tofile='scenario.json')))
changes={}
for key in ['items','recipes','stages']:
 prev={x['id']:x for x in original[key]};changes[key]=[{'id':x['id'],'fields':[k for k in x if x[k]!=prev[x['id']].get(k)]} for x in s[key] if x!=prev[x['id']]]
changes['graph']=[{'recipe':rid,'before':{k:next(r for r in original['recipes'] if r['id']==rid)[k] for k in ['a','b','out']},'after':{k:R[rid][k] for k in ['a','b','out']}} for rid in ['make-set-page','make-diagram-block']]
changes['checkpointActionsReplaced']=changed_checkpoint_actions
write(P/'bounded-delta.json',changes)
print(json.dumps({'id':s['id'],'sha256':sha(P/'scenario.json'),'changed':{k:len(changes[k]) for k in ['items','recipes','stages']},'checkpointActionsReplaced':changed_checkpoint_actions},indent=2))
