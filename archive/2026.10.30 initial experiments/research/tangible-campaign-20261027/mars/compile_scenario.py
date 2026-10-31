from pathlib import Path
import json,re
P=Path(__file__).parent
d=json.loads((P/'draft.json').read_text())
# Preserve v1 for the narrative review. The playable candidate removes count-padding.
# Canonical composite identity: each listed evolutionary name becomes a slot operation.
groups={
 'rover':dict(base='rover-chassis',cap='solar-travel',slots=[('motorized-rover','drive','drive-unit',True),('solar-rover','traction-power','solar-charger',True),('survey-rover','radio','long-range-radio',False),('belted-rover','restraint','seat-harness',False),('recovery-rover','recovery','tow-line',False)]),
 'weather-station':dict(base='wind-direction-mast',cap='weather-observing',slots=[('anemometer-mast','wind-speed','cup-rotor',True),('wind-station','logger','sensor-logger',True),('weather-station','temperature','shielded-thermometer',True),('instrumented-weather-station','pressure','barometer',True),('autonomous-weather-station','power','solar-charger',True)]),
 'relay':dict(base='working-transceiver',cap='orbiter-relay',slots=[('filtered-transceiver','filter','bandpass-filter',True),('wired-relay','feedline','insulated-feedline',True),('directional-relay','antenna','relay-antenna',True),('powered-relay','power','relay-charger',True),('tuned-relay','meter','signal-meter',True),('scheduled-relay','schedule','timer-module',True)]),
 'crawler':dict(base='repaired-crawler',cap='crawler-mobile',slots=[('field-crawler','wheel','wheel-module',False),('science-crawler','sample-carrier','mounted-sample-carrier',False),('sounding-crawler','radar','radar-head',False),('rough-ground-crawler','suspension','suspension-damper',False),('traverse-ready-crawler','route','marked-traverse',False)]),
 'scout':dict(base='rotorcraft-frame',cap='scout-flight',slots=[('controlled-scout','controller','flight-controller',True),('navigating-scout','navigation','navigation-camera',True),('landing-scout','legs','landing-legs',True),('powered-scout','battery','scout-battery',True),('rechargeable-scout','charger','solar-charger',True)]),
 'oxygen-plant':dict(base='controlled-electrolyzer',cap='oxygen-production',slots=[('oxygen-generator','intake','filtered-intake',True),('monitored-generator','sensor','oxygen-sensor',True),('conditioned-generator','conditioning','oxygen-conditioner',True),('oxygen-plant','buffer','connected-buffer',True),('inspectable-oxygen-plant','inspection','inspection-port',True)]),
 'ascent-cabin':dict(base='sealed-ascent-cabin',cap='ascent-cabin-ready',slots=[('dockable-cabin','dock','docking-ring',True),('ventilated-ascent-cabin','air','cabin-circulator',True),('operable-ascent-cabin','avionics','flight-console',True),('crewed-ascent-cabin','seat','suited-flight-seat',True)]),
}
alias={};install={};bases={}
for target,g in groups.items():
 alias[g['base']]=target;bases[g['base']]=target
 for old,slot,part,required in g['slots']:
  alias[old]=target;install[old]=(target,slot,part)
# Narrative people are not draggable ingredients.
alias.update({'sheltered-crew':'occupied-refuge','rested-crew':'provisioned-refuge'})
# Remove redundant certificate chains and tokenized crew accounting.
remove={'verified-oxygen-plant','accounted-crew','ready-crew','cabin-acceptance','systems-acceptance','flight-clearance','boarded-ascent-vehicle','cleared-ascent-vehicle'}
# Replace the end with physical cargo + vehicle + actual recovered flight plan.
rewrite={
 'flight-ready-vehicle':('loaded-ascent-vehicle','rendezvous-program'),
 'ascending-vehicle':('flight-ready-vehicle','launch-key'),
 'reunited-crew':('docked-vehicle','place:orbital-hatch'),
}
alias['reunited-crew']='returned-capsule'
# Explicit conceptual upgrades only. Tools/instruments remain reusable.
upgrade_results=set('radio solar-radio long-range-radio sealed-panel vestibule anchored-vestibule insulated-vestibule watered-seed-tray sprouted-tray propagator bearing-map catalogued-ice-sample telescope-camera annotated-map sensor-logger protected-controller weather-route-map insulated-feedline relay-powerpack relay-charger rescue-route sealed-refuge warm-refuge rest-refuge soup-flask replacement-drive occupied-refuge provisioned-refuge intake-pump heated-melter clarified-water treated-water checked-water monitored-tank water-reserve distribution-pump circulating-water-loop camp-water-system prepared-bed-medium fed-growing-bed planted-potatoes watered-potatoes ventilated-greenhouse controlled-greenhouse greenhouse-crop growing-potatoes guarded-machine bearing-hub wheel-rim replacement-wheel wheel-module padded-carrier sample-carrier mounted-sample-carrier traverse-map marked-traverse lined-core-drill supported-core calibrated-spectrometer retained-sediment sediment-comparison layer-interpretation basin-field-record filtered-intake regulated-buffer connected-buffer wired-avionics navigation-rack flight-console suited-flight-seat disciplined-clock timed-receiver timing-station aligned-star-tracker ground-reference ranging-link agreed-rendezvous cushioned-capsule ice-return-capsule mixed-specimen-capsule sealed-return-capsule geology-archive complete-field-archive documented-return-capsule secured-cart specimen-cart loaded-capsule-dock loaded-ascent-vehicle flight-ready-vehicle ascending-vehicle docked-vehicle returned-capsule'.split())
# Many outputs are apparatus; retire the prior apparatus, never an unrelated tool.
no_retire_first={'soup-flask','replacement-drive','camp-water-system','bearing-hub','mounted-sample-carrier','lined-core-drill','supported-core','calibrated-spectrometer','regulated-buffer','suited-flight-seat','timing-station','ground-reference','agreed-rendezvous','specimen-cart','loaded-capsule-dock','returned-capsule','occupied-refuge','provisioned-refuge'}
def ID(x):return '@'+x[6:] if x.startswith('place:') else alias.get(x,x)
def label(x):return ' '.join(w.capitalize() if i==0 else w for i,w in enumerate(x.split('-')))
recipes=[];items={};locations={}; stages=[];rawsupplies=set();derived={r['result'] for s in d['stages'] for r in s['recipes']}
for si,s in enumerate(d['stages']):
 for x in s['cache']:items.setdefault(ID(x),dict(id=ID(x),label=label(x),description=f'Recovered {label(x).lower()} from {s["title"].lower()}.'));rawsupplies.add(ID(x))
 for x in s['locations']:locations[x]=dict(id=x,label=label(x),description=f'A fixed place encountered during {s["title"].lower()}.')
 for ri,r in enumerate(s['recipes']):
  out=r['result']
  if out in remove:continue
  a,b=rewrite.get(out,(r['a'],r['b']));a=('damaged-ascent-cabin' if out=='sealed-ascent-cabin' and a=='ascent-cabin' else ID(a));b=ID(b)
  rr=dict(id=f'{s["id"]}-{ri}-{out}',a=a,b=b,description=r['description'])
  if out in install:
   target,slot,component=install[out];rr.update(a=target,b=ID(component),install=dict(target=target,slot=slot,component=ID(component)))
  else:
   oid=ID(out);rr['out']=oid;items.setdefault(oid,dict(id=oid,label=label(oid),description=r['description']))
   if out in upgrade_results and out not in no_retire_first and not a.startswith('@') and a in {ID(x) for x in derived} and a!=oid:
    rr['retire']=[dict(item=a,reason=f'The existing {label(a).lower()} is incorporated or upgraded into the {label(oid).lower()}, not discarded because it is finished.')]
  recipes.append(rr)
 # Positive in-character invitations; scientific disclaimers remain recipe evidence.
 motivation=s['motivation'].replace('Visibility is falling, not because a wall of wind will throw the rover over. Dust is cutting the light.','Dust is cutting the light and obscuring the route.').replace('The radar shows a boundary, not a buried city.','The radar shows a buried boundary.').replace('Recommission the certified modules; do not improvise a rocket in a kitchen.','Bring the recovered plant back into service.').replace('The ascent system is a recovered flight vehicle, not a collection of improvised parts.','The recovered ascent vehicle is waiting.').replace('We have its cabin tests, oxygen test and agreed rendezvous.','We have the cabin tests and agreed rendezvous.')
 objectives=[]
 for gi,goal in enumerate(s['goals']):
  if goal in remove:continue
  if goal.startswith('place:'):
   kind,loc=goal[6:].split('@');obj=dict(kind='place',location=loc,item=ID(kind),text=f'Place the {label(ID(kind)).lower()} on {label(loc)}.')
  elif goal in alias and goal in install:
   target,slot,component=install[goal];obj=dict(kind='create',capability=f'{target}-{slot}',text=f'Equip the {label(target).lower()} with its {label(component).lower()}.')
  else:obj=dict(kind='create',item=ID(goal),text=f'Make the {label(ID(goal)).lower()}.')
  obj['id']=f'{s["id"]}-goal-{gi}';objectives.append(obj)
 if s['id']=='signal':objectives[1]={'id':'signal-contact','text':'Place a powered radio or directed optical beacon on Contact ridge.','kind':'place','capability':'orbiter-contact','location':'contact-ridge'}
 if s['id']=='rover':objectives.insert(0,{'id':'rover-powered','text':'Make the Rover drive under solar power.','kind':'create','capability':'solar-travel'})
 if s['id']=='oxygen':objectives=[{'id':'oxygen-tested','text':'Run the restored oxygen plant and keep its production record.','kind':'create','item':'oxygen-production-record'}]
 if s['id']=='departure':objectives=[o for o in objectives if o.get('item')!='ready-crew']
 if s['id']=='homebound':objectives=[{'id':'homebound-return','text':'Bring the ascent capsule to the orbiter hatch with the returned specimens.','kind':'create','item':'returned-capsule'}]
 st=dict(id=s['id'],title=s['title'],speaker=s['speaker'],motivation=motivation,area=dict(id='area-'+s['id'],label=s['title'],travelText=f'We take the useful equipment onward to {s["title"].lower()}, leaving the earlier work where it stands.'),locations=s['locations'],objectives=objectives)
 if si>0:st['caches']=[dict(id=s['id']+'-cache',label=s['title']+' stores',narrative=f'The expedition reaches the previously placed mission stores at {s["title"].lower()}. These include the following recovered equipment, not freshly delivered ingredients.',items=[ID(x) for x in s['cache']])]
 stages.append(st)
# Repairing a towed crawler remains legal later; the short rescue route cannot close the workshop.
recipes.append(dict(id='repair-towed-crawler',a='replacement-drive',b='towed-crawler',out='crawler',description='Replace the disabled crawler drive after bringing its intact cabin to shelter.'))
for target,g in groups.items():
 item=items.setdefault(target,dict(id=target,label=label(target)))
 item['capabilities']=[g['cap']]
 item['slots']=[dict(id=slot,accepts=[ID(part)],required=req,capabilities=[f'{target}-{slot}']+(['long-range-contact']if part=='long-range-radio' else []))for old,slot,part,req in g['slots']]
for r in recipes:
 if 'install' not in r:
  guards=[dict(item=x,capability=groups[x]['cap']) for x in [r['a'],r['b']] if x in groups]
  if guards:r['requires']=guards
for x in ['radio','solar-radio','long-range-radio']:
 items[x]['capabilities']=items[x].get('capabilities',[])+['working-radio']
stages[0]['objectives'][0]={'id':'radio-repair','text':'Repair a working radio.','kind':'create','capability':'working-radio'}
for x in ['solar-radio','signal-beacon','long-range-radio']:
 items[x]['capabilities']=items[x].get('capabilities',[])+['orbiter-contact']
items['damaged-ascent-cabin']={'id':'damaged-ascent-cabin','label':'Ascent cabin shell','description':'The intact cabin shell with a damaged replaceable hatch seal.'}
for st in stages:
 for cache in st.get('caches',[]):cache['items']=['damaged-ascent-cabin' if x=='ascent-cabin' else x for x in cache['items']]
used_locations={x[1:] for r in recipes for x in [r['a'],r['b']] if x.startswith('@')}|{o['location'] for st in stages for o in st['objectives'] if 'location'in o}
locations={k:v for k,v in locations.items() if k in used_locations}
for st in stages:st['locations']=[x for x in st['locations'] if x in used_locations]
# Capture the conceptual origin of unknown input kinds for validator diagnostics rather than silently granting them.
for r in recipes:
 for x in [r['a'],r['b']]:
  if not x.startswith('@') and x not in items:items[x]=dict(id=x,label=label(x),caveat='Unresolved authoring reference; validator must reject if not produced.')
scenario=dict(schemaVersion=1,id='mars-light-that-answers-v2',title='Mars: A Light That Answers',premise='A damaged landing strands a small expedition. Recovery becomes a rescue, then a return journey carrying people and evidence. This is an engineering story with recovered qualified systems, not real survival instructions.',items=list(items.values()),locations=list(locations.values()),initialItems=d['stages'][0]['cache'],recipes=recipes,stages=stages,sources=[
 dict(id='dust',title='The Fact and Fiction of Martian Dust Storms',url='https://www.nasa.gov/solar-system/the-fact-and-fiction-of-martian-dust-storms/',note='Dust reduces sunlight and adheres to equipment; Mars winds are not Earth-hurricane force at the same speed.'),
 dict(id='moxie',title='Mars Oxygen In-Situ Resource Utilization Experiment',url='https://www.nasa.gov/space-technology-mission-directorate/tdm/mars-oxygen-in-situ-resource-utilization-experiment-moxie/',note='A demonstrated engineered process, not an improvised household chemical combination.'),
 dict(id='ice',title='Where Should Future Astronauts Land on Mars? Follow the Water',url='https://www.nasa.gov/centers-and-facilities/jpl/where-should-future-astronauts-land-on-mars-follow-the-water/',note='Near-surface ice is a candidate resource; accessibility varies.'),
 dict(id='ingenuity',title='Ingenuity mission',url='https://www.jpl.nasa.gov/missions/ingenuity/',note='Thin atmosphere demands purpose-built flight hardware; recovered scout modules are fictional mission equipment.')
],notes=['UNRELEASED candidate: no claim of fun, scientific certification, complete lifecycle correctness or 200-combination playthrough yet.','Time for crop growth, weather observation and flight is compressed by narrative transitions. No physical quantities, finite-resource optimization or emergency chemistry procedures.','All three location roles remain available; this first version uses primarily operand and placement roles. Further catalyst refinement and cache narrative review required.','Stage counts and recipe counts are catalog measures, not a proof of player engagement.'])
(P/'scenario.json').write_text(json.dumps(scenario,indent=2)+'\n')
print(len(items),'items',len(recipes),'recipes',len(stages),'stages',sum('install'in r for r in recipes),'installations')
# Authored travel packing: leave optional earlier projects tangible in their places,
# rather than carrying every unused ingredient for every abandoned branch forever.
# Include all future scene operands (not merely one solver's chosen branch).
recipe_stage={r['id']:next((i for i,st in enumerate(stages) if r['id'].startswith(st['id']+'-')),9) for r in recipes}
recipe_stage['repair-towed-crawler']=9
for i,st in enumerate(stages):
 if i==0:continue
 future=[r for r in recipes if recipe_stage[r['id']]>=i]
 carry={x for r in future for x in (r['a'],r['b']) if not x.startswith('@')}
 # The repair drive can still be made at the workshop if towing was chosen.
 if i<=2:carry.update(['solar-panel','battery'])
 if i<=14:carry.update(['radio','solar-radio','solar-charger','dish-antenna'])
 if i<=9:carry.update(['spare-drive','drive-coupling','serviced-drive','replacement-drive','towed-crawler','toolkit'])
 for later in stages[i:]:
  for obj in later['objectives']:
   if 'item'in obj:carry.add(obj['item'])
   if 'capability'in obj:
    for item in items.values():
     if obj['capability'] in item.get('capabilities',[]) or any(obj['capability'] in slot.get('capabilities',[]) for slot in item.get('slots',[])):carry.add(item['id'])
 st['carry']=sorted(carry)
(P/'scenario.json').write_text(json.dumps(scenario,indent=2)+'\n')

for r in recipes:
 if r.get('out')=='towed-crawler':r['requires']=[{'item':'rover','capability':'rover-recovery'}]
(P/'scenario.json').write_text(json.dumps(scenario,indent=2)+'\n')

# Named durable places and cache provenance for the first new playable slice.
scene_details={
 'weather':('Weather station apron','The mapped instrument apron is a short drive from the outcrop. We take the field kit and leave the sampling bench where it stands.','Weather-station service cabinet','The weather station was mothballed before our arrival. Its instruments were packed in the adjacent service cabinet against dust; the mast and logger remain here. The cabinet also holds a brush and spare enclosure materials.'),
 'relay':('Northern relay knoll','The observations give us a route to the relay knoll. Bring the map, radio parts and portable power; the weather station keeps recording behind us.','Relay maintenance cabinet','This was a maintained relay site, not a fresh delivery. Its transceiver, antenna hardware and spares are still in the locked-down cabinet. We bring the missing dish and solar panel from our own equipment.'),
 'rescue':('Survey service refuge','The voice and map lead to the service refuge beside the disabled crawler. Bring the rover and recovery kit; the working relay stays on its knoll.','Survey refuge and crawler stores','The survey crew sheltered beside their disabled crawler. Their field shelter, bedding and food are intact but unprepared. A drive module and towing gear were carried for vehicle failures like this one.')}
for st in stages:
 if st['id'] in scene_details:
  place,travel,cachelabel,story=scene_details[st['id']];st['area']['label']=place;st['area']['travelText']=travel
  st['caches'][0]['label']=cachelabel;st['caches'][0]['narrative']=story
(P/'scenario.json').write_text(json.dumps(scenario,indent=2)+'\n')
for st in stages:
 if st['id']=='rescue':st['objectives'][0]['text']='Get the crew into shelter and give them a hot meal.'
 if st['id']=='relay':
  for o in st['objectives']:
   if o['kind']=='place':
    o.pop('item',None);o['capability']='orbiter-relay';o['text']='Bring the working relay onto the knoll and establish contact.'
(P/'scenario.json').write_text(json.dumps(scenario,indent=2)+'\n')
# v3: pack only the current scene's goals and alternative prerequisite routes.
# The engine computes this from actual existing intermediates, so static ancestor
# lists cannot drag along redundant precursors or tomorrow's ingredients.
for st in stages:st.pop('carry',None)
scenario['id']='mars-light-that-answers-v3'
scenario['notes'].append('Engine v3 current-scene packing moves actual known objects from visited areas with provenance; no all-future carry and no manual retrieval errands.')
(P/'scenario.json').write_text(json.dumps(scenario,indent=2)+'\n')
