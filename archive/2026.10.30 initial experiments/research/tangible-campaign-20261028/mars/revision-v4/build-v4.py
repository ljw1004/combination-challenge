import copy,json,pathlib,hashlib
ROOT=pathlib.Path(__file__).resolve().parent
P=ROOT.parent; W=ROOT/'worktree'
old=json.load(open(P/'candidate.scenario.json'));s=copy.deepcopy(old);s['id']='mars-connected-survival-v4'
I={i['id']:i for i in s['items']};R={r['id']:r for r in s['recipes']};S={st['id']:st for st in s['stages']}
def life(role,reason):return dict(role=role,reason=reason)
# Display observations, not merely trace names. Values are explicitly fictional in evidence metadata.
I['cooling-trace'].update(label='Bare: 20 → 8°C',description='The bare wall sample began at 20°C and ended at 8°C after the chamber’s 20-minute cycle: a 12°C drop.',sources=['thermal-tests'],caveat='Illustrative fictional measurements for this game, not NASA test results.')
I['insulated-cooling-trace'].update(label='Wrapped: 20 → 16°C',description='The wrapped sample began at the same 20°C and ended at 16°C after the same 20-minute chamber cycle: a 4°C drop. The sample dimensions and logger position match the bare run.',sources=['thermal-tests'],caveat='Illustrative fictional measurements for this game, not NASA test results.')
I['insulation-comparison'].update(label='Wrapping slows cooling',description='The bare sample cooled by 12°C; the wrapped one by 4°C under the same cycle. The wrapping slowed this sample’s cooling; the comparison does not predict the whole refuge’s temperature.',sources=['thermal-tests'],caveat='A comparison of invented matched-condition readings, not a real material qualification.')
next(src for src in s['sources'] if src['id']=='thermal-tests')['note']+=' The v4 matched 20-minute example readings (20→8°C bare; 20→16°C wrapped) are invented for comparison, not taken from NASA or a qualification report.'
R['night-trace']['description']='Record the bare wall sample: 20°C at the start, 8°C after the 20-minute chamber cycle.'
R['night-insulated-trace']['description']='Repeat the same cycle from the same starting temperature with the wrapped sample: 20°C at the start, 16°C at the end.'
R['night-compare']['description']='The bare sample lost 12°C; the wrapped sample lost 4°C under the same conditions. This wrapping slowed the sample’s cooling.'
# The measured template does not require an experiment to turn magically into a blueprint.
s['recipes']=[r for r in s['recipes'] if r['id']!='night-pattern']
s['items']=[i for i in s['items'] if i['id']!='screen-pattern']
I['wall-template']['label']='Measured wall template'
I['wall-template']['description']='The existing full-size outline of the refuge’s removable service-wall screen, with its fixing points marked.'
r=R['night-fit'];r['a']='wall-template';r['description']='Cut the insulating blanket to the existing full-size wall outline, leaving its marked fixing points clear.';r['lifecycle'].pop('screen-pattern');r['lifecycle']['wall-template']=life('retain','The existing measured template guides the cut and remains intact; the cooling experiment does not manufacture its dimensions.')
S['night']['objectives'].insert(0,dict(id='night-compare-wall',kind='create',item='insulation-comparison',text='Compare wall cooling',intermediate=True))
S['night']['objectives'][1]['after']=['night-compare-wall']
# The previously created illuminated bench is the physical mount for the stored bench-top machine.
I['lit-workbench']['description']='The portable expedition workbench we assembled at camp, with its lamp still fitted. Its stiff mounting rails accept the guarded bench-top machine’s integral clamps.'
I['lit-workbench']['slots']=[dict(id='machine',accepts=['guarded-machine'],required=False,capabilities=['guarded-machining'])]
I['guarded-machine']['label']='Guarded bench-top machine'
I['guarded-machine']['description']='The stored programmed bench-top machine, with its controller, guard and captive mounting clamps intact. Its base must be secured on the matching workbench rails before the stored axle or bracket program can run.'
R['camp-light']['preserve']=['bench-lamp']
s['recipes'].append(dict(id='workshop-mount-machine',a='guarded-machine',b='lit-workbench',install=dict(target='lit-workbench',slot='machine',component='guarded-machine'),description='Secure the stored bench-top machine on the shared workbench’s mounting rails. Its guard stays closed during the stored programs; the lamp remains fitted beside it.',lifecycle={'lit-workbench':life('retain','This is the same portable, illuminated workbench created at camp; fitting the machine does not replace it or remove its lamp.'),'guarded-machine':life('incorporate','The machine stays visibly secured in the bench’s machine slot; there is no loose duplicate machine.')}))
for rid in ['workshop-3-machined-axle','workshop-10-mounting-bracket']:
 r=R[rid]
 for operand in ['a','b']:
  if r[operand]=='guarded-machine':r[operand]='lit-workbench'
 r['lifecycle'].pop('guarded-machine');r['lifecycle']['lit-workbench']=life('retain','The existing illuminated bench and its fitted guarded machine perform the stored operation; the whole workstation remains intact.')
 r['requires']=[dict(item='lit-workbench',capability='guarded-machining')]
S['workshop']['motivation']='Our shared workbench can do more than hold a lamp. The stored bench-top machine fits its mounting rails. Set it up, then make the replacement wheel and protected sample carrier for our recovered crawler.'
S['workshop']['area']['travelText']='Back in the camp machine-shop corner, we bring our portable lit workbench and recovered crawler to the stored machine and stock. The lamp comes with the bench; the refuge stays where we left it.'
S['workshop']['caches'][0]['narrative']='The camp machine-shop cabinet holds the guarded bench-top machine, stock, carrier parts and replacement wheel. Its captive base clamps match the rails on the shared workbench we assembled earlier.'
s['notes']=old['notes']+['v4 responds to the frozen source-blind Refuge/Night sessions: visible matched fictional thermal readings; comparison is an intermediate evidential goal, not a reagent that manufactures a cutting pattern.','A single earned machine-to-existing-bench installation closes the legal tow-old-alias Workshop gap without runtime changes. Required axle and bracket operations use that fitted earlier bench.','Original v3 and its negative/fresh sessions remain immutable. Source-blind action harness must resolve drop gestures with the same dropAction as the browser.']
def revise(actions):
 out=[];stage=0
 for raw in actions:
  a=copy.deepcopy(raw)
  if a['type']=='combine' and set([a['a'],a['b']])=={'insulation-comparison','wall-template'}:continue
  if a['type']=='combine' and 'screen-pattern' in [a['a'],a['b']]:
   for key in ['a','b']:
    if a[key]=='screen-pattern':a[key]='wall-template'
  if stage==13 and (not out or out[-1]['type']=='advance'):out.append(dict(type='combine',a='guarded-machine',b='lit-workbench'))
  if a['type']=='combine' and 'guarded-machine' in [a['a'],a['b']]:
   for key in ['a','b']:
    if a[key]=='guarded-machine':a[key]='lit-workbench'
  out.append(a)
  if a['type']=='advance':stage+=1
 return out
routes={name:revise(json.load(open(P/(name+'.actions.json')))) for name in ['authored','beacon','tow']}
routes['tow-old-alias']=copy.deepcopy(routes['tow'])
for a in routes['tow-old-alias']:
 if a['type']=='combine' and a['a']=='replacement-drive' and a['b']=='towed-crawler':a['b']='damaged-crawler'
actions=routes['authored'];s['checkpoints']=[];prefix=[];stage=0
for a in actions:
 if not prefix or prefix[-1]['type']=='advance':
  st=s['stages'][stage];s['checkpoints'].append(dict(id=f'chapter-{stage+1}',label=f'{stage+1}. {st["title"]}',actions=copy.deepcopy(prefix)))
 prefix.append(a)
 if a['type']=='advance':stage+=1
s['checkpoints'].append(dict(id='complete',label='Complete ending',actions=copy.deepcopy(prefix)))
(ROOT/'candidate.scenario.json').write_text(json.dumps(s,indent=2,ensure_ascii=False)+'\n')
for name,route in routes.items():(ROOT/(name+'.actions.json')).write_text(json.dumps(route,indent=2)+'\n')
worlds=json.loads((P/'worktree/experiments/tangible-campaign/ui/scenarios.ts').read_text().split('= ',1)[1].strip().rstrip(';'))
worlds.append(s);(W/'experiments/tangible-campaign/ui/scenarios.ts').write_text("import type {Scenario} from '../schema/scenario.ts';\nexport const scenarios: Scenario[] = "+json.dumps(worlds,indent=2,ensure_ascii=False)+';\n')
audit=json.load(open(P/'worktree/experiments/tangible-campaign/reviews/lifecycle/audit.json'));audit['counts'][s['id']]={'recipes':len(s['recipes']),'changed':sum(r not in old['recipes'] for r in s['recipes']),'note':'Unpublished v4 candidate; narrowed fresh-play response, not a claim of human validation.'}
for r in s['recipes']:
 audit['recipes'].append(dict(world=s['id'],recipe=r['id'],inputs=r['a']+' + '+r['b'],output=r.get('out') or 'install '+r['install']['component']+' in '+r['install']['target'],incorporated=r['install']['component'] if r.get('install') else ', '.join(sorted(k for k,v in r['lifecycle'].items() if v['role'] in ['transform','incorporate'])) or '—',retained=', '.join(sorted(k for k,v in r['lifecycle'].items() if v['role']=='retain')) or '—',lifecycles=r['lifecycle']))
(W/'experiments/tangible-campaign/reviews/lifecycle/audit.json').write_text(json.dumps(audit,indent=2,ensure_ascii=False)+'\n')
print(s['id'],len(s['recipes']),'recipes',len(actions),'main actions')
