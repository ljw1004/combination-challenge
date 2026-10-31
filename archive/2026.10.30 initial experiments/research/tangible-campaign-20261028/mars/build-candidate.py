"""Build isolated Mars candidate from the immutable recovered fork. No remote writes."""
import copy, json, pathlib, hashlib
ROOT=pathlib.Path(__file__).resolve().parent
BASE=pathlib.Path('/workspace/shared/combination-fork-recovery-20261028')
TARGET=ROOT/'worktree'
p=BASE/'experiments/tangible-campaign/ui/scenarios.ts'
worlds=json.loads(p.read_text().split('= ',1)[1].strip().rstrip(';'))
old=next(s for s in worlds if s['id']=='mars-cargo-revision-v2')
s=copy.deepcopy(old);s['id']='mars-connected-survival-v3'
I={i['id']:i for i in s['items']};R={r['id']:r for r in s['recipes']};S={st['id']:st for st in s['stages']}
def life(role,reason):return dict(role=role,reason=reason)
# The opening choices both become the refuge's visible contact, without a forced charger route.
s['locations'].append(dict(id='refuge-contact-mast',label='Refuge signal mast',description='The intact exterior mast above the inner cabin has a clear orbiter sightline. A powered radio or beacon here marks the refuge for the rescue search, rather than leaving the only signal at the crash ridge.'))
S['habitat']['locations'].append('refuge-contact-mast')
S['habitat']['carry']=['solar-radio','signal-beacon','long-range-radio','solar-charger','solar-panel','battery']
# The charger powers the fixed enclosed melt head, and is therefore created before Rover even on beacon-first play.
next(l for l in s['locations'] if l['id']=='sheltered-ice')['description']='A small enclosed melt head is already fitted at this sheltered ice lens. Its matched low-volume electric feed accepts the solar charger; no open pool or improvised pressure vessel is involved.'
r=R['habitat-0-meltwater'];r['a']='solar-charger';r['description']='Connect our recovered solar charger to the small fixed enclosed melt head. Over the narrated collection interval it provides the batch for the habitat canister.';r['lifecycle']={'solar-charger':life('retain','The existing charger powers the fixed melt head during collection and remains intact for the rover and later instruments.')}
I['solar-charger']['description']='The solar charging unit assembled after landing. Its matched outputs can supply the fixed low-volume melt head, rover traction module and field instruments at different times.'
S['habitat']['objectives'].append(dict(id='habitat-contact',kind='place',capability='orbiter-contact',location='refuge-contact-mast',text='Mark refuge for rescue'))
S['habitat']['motivation']='The inner cabin survived, but the landing tore its vestibule. Make the entry weather-tight, store water, and protect a living tray. Move our signal to the cabin’s clear-sky mast: the missing survey crew need a refuge to aim for, not just our crash site.'
S['habitat']['completionText']='The entry is weather-tight, the water is stored, and the little tray has a sheltered home. Our signal now marks a refuge, not a crash site.'
# Repair the very refuge the player prepared, on its existing camp ground.
S['night']['area']=dict(id='area-camp',label='Recovery camp',travelText='We return to the refuge where we sheltered the crew. Its exposed service wall is losing heat; the camp’s thermal chamber and screen kit are nearby.')
S['night']['motivation']='The refuge we repaired kept the recovered crew safe, but its exposed service wall loses heat overnight. Compare the wall samples in the chamber, then fit a screen to the same refuge so everyone can sleep comfortably.'
S['night']['caches'][0]['items'].remove('sleeping-cabin')
S['night']['caches'][0]['narrative']='The camp’s service cabinet holds the refuge wall sample, its measured template and the removable screen kit. The refuge and its prepared bed are the ones we already restored.'
S['night']['objectives'][0]['text']='Insulate our refuge'
S['night']['completionText']='The chamber comparison gave us a reason to fit this screen. The refuge still holds the bed we made for the rescued crew; now its exposed service wall is covered too.'
I['wall-coupon']['description']='A spare piece of the recovered refuge’s wall assembly, supplied for the camp thermal chamber.'
I['wall-template']['description']='The measured template for the recovered refuge’s removable service-wall screen.'
I['screened-cabin']['label']='Insulated refuge'
I['screened-cabin']['description']='The same refuge that sheltered the recovered crew, with its prepared bed and removable thermal screen still visible.'
r=R['night-cabin'];r['b']='provisioned-refuge';r['description']='Fit the removable screen over the exposed service wall of the refuge we repaired for the recovered crew.'
r['lifecycle']={'thermal-screen':life('incorporate','The completed removable screen is fitted to the refuge and remains visible as its component.'),'provisioned-refuge':life('transform','The already repaired, furnished refuge becomes the insulated refuge in the same position; it is not replaced by a new cabin.')};r['preserve']=['thermal-screen','provisioned-refuge']
# The newly connected transformation must visibly preserve the familiar bed and screen, not collapse them.
for rid,keep in {'rescue-2-prepared-bed':['bedding'],'rescue-3-rest-refuge':['prepared-bed','warm-refuge'],'rescue-12-sheltered-crew':['rest-refuge'],'rescue-13-sheltered-crew':['rest-refuge'],'rescue-14-rested-crew':['occupied-refuge'],'night-screen':['fitted-blanket','clip-frame']}.items():R[rid]['preserve']=keep
# A small portion of the already contained water primes this specified non-self-priming loop.
I['circulation-pump']['description']='The intact process-loop pump was drained for storage. Its enclosed fill port accepts our water canister after the matched return hose is connected.'
I['circulating-water-loop']['label']='Dry water loop'
I['circulating-water-loop']['description']='The same drained pump with its return hose connected. Its enclosed priming port needs a small portion of our stored water before the loop can circulate the tank supply.'
I['water-canister']['description']='The sealed canister filled at the landing habitat. Water remains after tending the small seed tray; its compatible closed outlet can also supply the process loop’s priming port.'
s['items'].append(dict(id='primed-water-loop',label='Primed water loop',description='The assembled process loop with its enclosed priming reservoir filled from our landing-habitat canister; its pump and return hose remain fitted.'))
s['recipes'].append(dict(id='waterworks-prime',a='water-canister',b='circulating-water-loop',out='primed-water-loop',description='Use a small portion of the water saved at the landing habitat to fill this loop’s enclosed priming reservoir. The canister remains a water container, not a pump component.',preserve=['circulating-water-loop'],lifecycle={'water-canister':life('retain','Only a small portion of its stored water enters the priming reservoir; the canister and remaining water stay available.'),'circulating-water-loop':life('transform','The same assembled pump and return hose become the primed loop in place; no second apparatus is created.')}))
R['waterworks-loop']['preserve']=['return-hose']
r=R['waterworks-12-camp-water-system'];r['a']='primed-water-loop';r['lifecycle'].pop('circulating-water-loop');r['lifecycle']['primed-water-loop']=life('transform','The primed pump and fitted return hose become the working camp loop, retaining the entire assembly.');r['preserve']=['primed-water-loop']
S['waterworks']['motivation']='The recovered crew know the ice-processing site. Its treatment skid is intact, but the circulation pump was drained for storage. Our saved water can prime it; the restored loop can then support the camp greenhouse.'
# The previously restored shuttle docks the heavy flight module; it is not sacrificed or stripped.
I['flight-oxygen-module']['description']='The heavy, qualified ascent oxygen module on its transport cradle. The depot cargo shuttle’s standard platform matches this cradle and the loading bay’s transfer rails.'
s['items'].append(dict(id='docked-oxygen-module',label='Docked oxygen module',description='The original ascent oxygen module transferred from its transport cradle onto the plant’s enclosed loading interface by our restored cargo shuttle.'))
s['recipes'].append(dict(id='oxygen-dock-module',a='depot-cargo-shuttle',b='flight-oxygen-module',out='docked-oxygen-module',at='ascent-plant',description='Use the restored cargo shuttle’s matched platform to transfer the heavy module onto the loading bay’s designed interface. The shuttle is free again for our specimens.',preserve=['flight-oxygen-module'],lifecycle={'depot-cargo-shuttle':life('retain','The existing fitted cargo shuttle transports and transfers the module, then remains intact for the specimen journey.'),'flight-oxygen-module':life('transform','The same storage module changes from its transport-cradle state to its docked loading state at the bay.')}))
r=R['oxygen-service'];r['b']='docked-oxygen-module';r['lifecycle'].pop('flight-oxygen-module');r['lifecycle']['docked-oxygen-module']=life('transform','The original docked storage module is serviced through its qualified interface, preserving its identity and location.');r['preserve']=['docked-oxygen-module']
S['oxygen']['motivation']='The ascent depot was built to make oxygen here. Restore its stored intake and controls, then use the cargo shuttle we brought along the service route to dock the heavy flight module at the loading bay.'
S['oxygen']['completionText']='The hauler we restored has brought the heavy module onto its proper interface, and the depot plant has serviced it. The module now has a real place in the waiting vehicle; the hauler is free for our specimens.'
# Preserve the created recovered body when the existing tow-first repair route is chosen.
R['repair-towed-crawler']['preserve']=['towed-crawler','replacement-drive']
# Build the exact route and checkpoints without editing the archived scenario or its evidence.
e=json.loads((BASE/f'experiments/tangible-campaign/evidence/{old["id"]}-route-evidence.json').read_text())
actions=[];stage=0
for a in e['actionsLog']:
 a=copy.deepcopy(a)
 if stage==1 and a['type']=='combine' and a['a']=='heater' and a['b']=='@sheltered-ice':a['a']='solar-charger'
 if stage==1 and a['type']=='advance':actions.append(dict(type='place',item='solar-radio',location='refuge-contact-mast'))
 if a['type']=='combine' and set([a['a'],a['b']])==set(['thermal-screen','sleeping-cabin']):a['b']='provisioned-refuge'
 if a['type']=='combine' and set([a['a'],a['b']])==set(['circulating-water-loop','water-reserve']):
  actions.append(dict(type='combine',a='water-canister',b='circulating-water-loop'));a['a']='primed-water-loop';a['b']='water-reserve'
 if a['type']=='combine' and set([a['a'],a['b']])==set(['oxygen-plant','flight-oxygen-module']):
  actions.append(dict(type='combine',a='depot-cargo-shuttle',b='flight-oxygen-module'));a['a']='oxygen-plant';a['b']='docked-oxygen-module'
 actions.append(a)
 if a['type']=='advance':stage+=1
s['checkpoints']=[];prefix=[];stage=0
for a in actions:
 if not prefix or prefix[-1]['type']=='advance':
  st=s['stages'][stage];s['checkpoints'].append(dict(id=f'chapter-{stage+1}',label=f'{stage+1}. {st["title"]}',actions=copy.deepcopy(prefix)))
 prefix.append(a)
 if a['type']=='advance':stage+=1
s['checkpoints'].append(dict(id='complete',label='Complete ending',actions=copy.deepcopy(prefix)))
s['sources'].append(dict(id='pump-priming',title='Grundfos: starting a drained pump after standing still',url='https://www.grundfos.com/solutions/support/faq/how-can-i-start-the-pump-after-standing-still-',note='Supports the limited idea that a drained pump may need filling before use. The closed Mars process-loop fittings and compatible stored water are fictional; this is not a commissioning procedure.'))
s['notes']=['Isolated connected-survival candidate built from recovered Site v26 / mars-cargo-revision-v2. Not human-playtested or published.','Four narrow connections plus the shared melt-head power chain needed by the beacon-first alternative: refuge contact placement; insulate the previously restored refuge; prime the loop with saved water; dock the oxygen module with the restored hauler.','The required route grows by two purpose-bearing combinations, from 198 to 200; no count-restoring filler. Existing single survival arc and rescue alternatives retained.','Old scenario, save identity and route evidence remain byte-for-byte unchanged. New campaign identity prevents accidental save migration.','Qualified fictional mission systems remain abstractions. Candidate requires source-blind evaluation, particularly whether moving refuge contact feels worthwhile rather than repetitive.']
(ROOT/'candidate.scenario.json').write_text(json.dumps(s,indent=2,ensure_ascii=False)+'\n')
(ROOT/'candidate.actions.json').write_text(json.dumps(actions,indent=2,ensure_ascii=False)+'\n')
(ROOT/'baseline-manifest.json').write_text(json.dumps(dict(source=str(BASE),scenario=old['id'],scenarioSha256=hashlib.sha256(json.dumps(old,sort_keys=True).encode()).hexdigest(),sourceFileSha256=hashlib.sha256(p.read_bytes()).hexdigest(),candidate=s['id'],baselineCombinations=e['combinations'],baselineRecipes=len(old['recipes'])),indent=2)+'\n')
worlds.append(s)
(TARGET/'experiments/tangible-campaign/ui/scenarios.ts').write_text("import type {Scenario} from '../schema/scenario.ts';\nexport const scenarios: Scenario[] = "+json.dumps(worlds,indent=2,ensure_ascii=False)+';\n')
print(s['id'],len(s['recipes']),'recipes;',len(actions),'actions')
# Extend, never overwrite, the historical lifecycle audit. Avoid fixed catalogue-size assertions.
ap=TARGET/'experiments/tangible-campaign/reviews/lifecycle/audit.json'
audit=json.loads((BASE/'experiments/tangible-campaign/reviews/lifecycle/audit.json').read_text())
changed=sum(1 for r in s['recipes'] if r not in old['recipes'])
audit['counts'][s['id']]={'recipes':len(s['recipes']),'changed':changed,'note':'Isolated candidate; inherited declarations plus narrow reviewed edits. Not fresh-play evidence.'}
for r in s['recipes']:
 audit['recipes'].append(dict(world=s['id'],recipe=r['id'],inputs=r['a']+' + '+r['b'],output=r.get('out') or 'install '+r['install']['component']+' in '+r['install']['target'],incorporated=r['install']['component'] if r.get('install') else ', '.join(sorted(k for k,v in r['lifecycle'].items() if v['role'] in ['transform','incorporate'])) or '—',retained=', '.join(sorted(k for k,v in r['lifecycle'].items() if v['role']=='retain')) or '—',lifecycles=r['lifecycle']))
ap.write_text(json.dumps(audit,indent=2,ensure_ascii=False)+'\n')
tp=TARGET/'experiments/tangible-campaign/reviews/lifecycle/lifecycle.test.ts'
t=tp.read_text().replace('assert.equal(active.length,9)','assert.equal(active.length,Object.keys(audit.counts).length)').replace('assert.equal(expected.length,735)','assert.equal(expected.length,Object.values(audit.counts).reduce((n:number,row:any)=>n+row.recipes,0))')
tp.write_text(t)
