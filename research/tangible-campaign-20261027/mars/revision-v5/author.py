from pathlib import Path
import json
p=Path(__file__).parent;s=json.loads((p.parent/'scenario.json').read_text());pilot=json.loads((p.parent/'revision-v4/scenario.json').read_text())
s['id']='mars-a-light-that-answers-v5';s['stages'][:7]=pilot['stages'];early=tuple(st['id']+'-' for st in pilot['stages']);s['recipes']=[r for r in s['recipes'] if not r['id'].startswith(early)]+pilot['recipes'];items={i['id']:i for i in s['items']};items.update({i['id']:i for i in pilot['items'] if i['id'] in {x for r in pilot['recipes'] for x in [r['a'],r['b'],r.get('out')]}})
# Explicitly take the revised composite definitions; irrelevant late definitions in
# the isolated pilot must not overwrite subsequent edits.
for k in ['weather-station','relay']:items[k]=next(i for i in pilot['items'] if i['id']==k)
rec=s['recipes'];stages={st['id']:st for st in s['stages']}
def remove(*ids):rec[:]=[r for r in rec if r['id'] not in ids]
def remove_output(*outs):rec[:]=[r for r in rec if r.get('out') not in outs]
def supplied(stage,kind,label,description):
 items[kind]={'id':kind,'label':label,'description':description};stages[stage]['caches'][0]['items'].append(kind)
def item(k,label,description,**kw):items[k]={'id':k,'label':label,'description':description,**kw}
def recipe(id,a,b,out,description,**kw):rec.append(dict(id=id,a=a,b=b,out=out,description=description,**kw))
def keep_ids(stage,ids):rec[:]=[r for r in rec if not r['id'].startswith(stage+'-') or r['id'] in ids]
# Waterworks: complete qualified treatment and circulation appliances, not an
# invented water-safety conclusion from a conductivity reading.
keep_ids('waterworks',{'waterworks-3-heated-melter','waterworks-4-collected-water','waterworks-9-water-reserve','waterworks-12-camp-water-system'})
supplied('waterworks','ice-melter','Ice melter','The site’s enclosed ice-melting unit, complete with heat exchanger, awaiting its compatible heater.')
supplied('waterworks','treatment-skid','Treatment skid','The site’s intact enclosed process-water treatment appliance, used according to its mission program. No improvised treatment chemistry is required.')
supplied('waterworks','monitored-tank','Monitored tank','An insulated process-water tank with its level monitor already fitted.')
supplied('waterworks','circulation-pump','Circulation pump','An intact circulation pump with its manifold fitted, ready for the site return hose.')
recipe('waterworks-treatment','collected-water','treatment-skid','process-water','Run collected meltwater through the qualified process-water skid. This is water for the enclosed growing loop, not an unsupported drinking-water safety claim.')
recipe('waterworks-loop','circulation-pump','return-hose','circulating-water-loop','Attach the matched return hose to the complete circulation pump.')
for r in rec:
 if r['id']=='waterworks-9-water-reserve':r['b']='process-water';r['description']='Fill the monitored process-water tank from the treatment skid.'
item('process-water','Process water','Treated water for the enclosed mission growing system, not a claim that unknown water is safe to drink.')
stages['waterworks']['motivation']='The recovered crew know the ice-processing site. Its treatment skid is intact. Bring the water loop back into service so we can settle at camp and grow something again.'
stages['waterworks']['caches'][0]['narrative']='This is an existing ice-processing pilot site. Its enclosed melter, treatment skid, monitored tank and circulation pump were stored as working appliances. The disconnected return hose is still here.'
# Greenhouse identity remains stable as meaningful components go inside it.
keep_ids('garden',{'garden-5-irrigation-line','garden-6-watered-potatoes','garden-8-powered-grow-light','garden-14-warm-potatoes'})
recipe('garden-bed','growing-bed','prepared-substrate','planting-bed','Fill the complete growing tray with the brought mission substrate.')
recipe('garden-plant','planting-bed','seed-potato','planted-potatoes','Plant the stored seed potatoes in their prepared bed.')
recipe('garden-repair','greenhouse-shell','pressure-patch','greenhouse','Repair the documented damaged panel seam in the otherwise intact greenhouse.')
item('greenhouse','Greenhouse','The same enclosed greenhouse throughout: it needs its growing bed, compatible light and circulation fan.',capabilities=['growing-environment'],slots=[{'id':'bed','accepts':['watered-potatoes'],'required':True,'capabilities':['planted-greenhouse']},{'id':'light','accepts':['powered-grow-light'],'required':True},{'id':'air','accepts':['circulation-fan'],'required':True}])
for slot,part in [('bed','watered-potatoes'),('light','powered-grow-light'),('air','circulation-fan')]:rec.append(dict(id='garden-install-'+slot,a='greenhouse',b=part,install=dict(target='greenhouse',slot=slot,component=part),description='Fit the '+items.get(part,{}).get('label',part)+' to the same greenhouse.'))
recipe('garden-harvest','greenhouse','harvest-basket','potato-harvest','After a narrated growing interval, gather the crop from the restored greenhouse.',requires=[{'item':'greenhouse','capability':'growing-environment'}])
item('planting-bed','Planting bed','A complete growing tray filled with brought mission substrate.')
supplied('garden','growing-bed','Growing bed','A complete growing tray and rack, stored together rather than rebuilt from separate hardware.')
stages['garden']['objectives']=[{'id':'garden-meal','kind':'create','item':'warm-potatoes','text':'Grow the potatoes and share a warm meal.'}]
stages['garden']['caches'][0]['narrative']='The camp greenhouse is mostly intact. Its growing tray, fan, light, brought substrate and seed potatoes were stored here for a later planting. A damaged seam needs the existing patch kit.'
# Workshop: an intact guarded machine; wheel replacement has a later terrain job.
keep_ids('workshop',{'workshop-3-machined-axle','workshop-7-wheel-module','workshop-8-padded-carrier','workshop-9-sample-carrier','workshop-10-mounting-bracket','workshop-11-mounted-sample-carrier','workshop-12-field-crawler','workshop-13-science-crawler'})
supplied('workshop','guarded-machine','Guarded machine tool','The camp’s intact programmed machine tool with its controller and protective enclosure already fitted; it uses stored designs, not improvised precision machining.')
supplied('workshop','replacement-wheel','Replacement wheel','A complete replacement wheel, awaiting the axle module needed by the recovered crawler.')
# Scout is complete flight hardware. Only rotor assembly and battery were removed
# for storage; its navigation, controller and legs are not repeated construction.
keep_ids('traverse',{'traverse-0-rotorcraft-frame','traverse-4-powered-scout','traverse-6-scout-panorama','traverse-7-terrain-model','traverse-8-traverse-map','traverse-11-marked-traverse','traverse-12-traverse-ready-crawler'})
items['scout']['slots']=[sl for sl in items['scout']['slots'] if sl['id']=='battery']
items['scout']['description']='A purpose-built Mars reconnaissance aircraft, with navigation camera, controller and legs already fitted. Its rotor assembly and battery were removed for transport.'
stages['traverse']['caches'][0]['narrative']='The geology depot holds a stored Mars scout. Its delicate rotor assembly and battery were packed separately; its flight electronics, camera and legs are already fitted. A route tablet and hazard marker are also here.'
# A ready drill and microscope avoid repeating tool construction before geology.
remove('buried-story-0-core-drill','buried-story-4-lit-microscope')
supplied('buried-story','core-drill','Core drill','The field team’s complete coring tool. A fresh liner keeps this sample separate from earlier work.')
supplied('buried-story','lit-microscope','Illuminated microscope','An intact field microscope with its own lighting, ready to examine prepared samples.')
# Oxygen service has an actual downstream physical use, not a certificate gate.
keep_ids('oxygen',{'oxygen-2-controlled-electrolyzer','oxygen-3-oxygen-generator'})
items['oxygen-plant']['slots']=[sl for sl in items['oxygen-plant']['slots'] if sl['id']=='intake']
items['oxygen-plant']['description']='The qualified mission oxygen plant. Its reactor, product conditioning, safety sensors and buffer are intact; its stored controller and filtered intake need reconnecting.'
supplied('oxygen','filtered-intake','Filtered intake','A complete mission intake module with compressor and dust separation already fitted.')
supplied('oxygen','flight-oxygen-module','Flight oxygen module','The ascent vehicle’s qualified storage module, serviced only through the depot’s enclosed loading equipment.')
recipe('oxygen-service','oxygen-plant','flight-oxygen-module','oxygen-service-module','Use the qualified depot loading equipment to service the ascent module from the working plant. Process settings and handling operations remain outside the game.',at='ascent-plant',requires=[{'item':'oxygen-plant','capability':'oxygen-production'}])
item('oxygen-service-module','Serviced oxygen module','The original qualified ascent storage module serviced by the depot equipment, ready for its designed vehicle connection.')
stages['oxygen']['objectives']=[{'id':'oxygen-service','kind':'create','item':'oxygen-service-module','text':'Restore the plant and service the ascent vehicle’s oxygen module.'}]
# Cabin has intact manufactured modules; tests diagnose readiness, not tokens
# manufacturing one certificate from the previous certificate.
keep_ids('ascent',{'ascent-0-sealed-ascent-cabin','ascent-1-dockable-cabin','ascent-3-ventilated-ascent-cabin','ascent-9-operable-ascent-cabin','ascent-12-crewed-ascent-cabin','ascent-13-cabin-test-record'})
supplied('ascent','flight-console','Flight console','The tested replacement avionics rack, computer, navigation unit and display supplied as a ready module.')
supplied('ascent','suited-flight-seat','Flight seat','The complete flight restraint and suit-connection seat, removed only for storage.')
for sl in items['ascent-cabin']['slots']:
 if sl['id']=='air':sl['accepts']=['oxygen-service-module']
for r in rec:
 if r['id']=='ascent-3-ventilated-ascent-cabin':r['b']='oxygen-service-module';r['install']['component']='oxygen-service-module';r['description']='Connect the serviced oxygen module through the cabin’s qualified life-support interface.'
# Timing tools are existing instruments; the observations and inference remain.
remove('rendezvous-0-disciplined-clock','rendezvous-1-timed-receiver','rendezvous-3-star-tracker')
supplied('rendezvous','disciplined-clock','Reference clock','A working mission clock with synchronization electronics already fitted.')
supplied('rendezvous','timed-receiver','Timing receiver','A complete beacon-timing receiver with its cable attached.')
supplied('rendezvous','star-tracker','Star tracker','The complete optical tracker with the stored star catalogue, awaiting alignment against its field reference.')
# Departure: one sample capsule, not four renamed copies. Slot identity helps
# show that specimens and their record go inside one recognizable object.
keep_ids('departure',{'departure-0-cushioned-capsule','departure-4-archival-recorder','departure-5-geology-archive','departure-6-complete-field-archive','departure-8-camp-handover-beacon','departure-10-secured-cart','departure-11-specimen-cart'})
item('cushioned-capsule','Return capsule','The same protected return capsule. Its specimen compartments and record pouch keep the scientific evidence together.',capabilities=['return-sample-set'],slots=[{'id':'ice','accepts':['catalogued-ice-sample'],'required':True},{'id':'sediment','accepts':['retained-sediment'],'required':True},{'id':'record','accepts':['complete-field-archive'],'required':True}])
for slot,part in [('ice','catalogued-ice-sample'),('sediment','retained-sediment'),('record','complete-field-archive')]:rec.append(dict(id='departure-pack-'+slot,a='cushioned-capsule',b=part,install=dict(target='cushioned-capsule',slot=slot,component=part),description='Pack the '+items[part]['label'].lower()+' into its compartment in the return capsule.'))
for r in rec:
 if r['id']=='departure-11-specimen-cart':r['b']='cushioned-capsule';r['requires']=[{'item':'cushioned-capsule','capability':'return-sample-set'}]
# Two modest new camp/route projects plus one actual controlled-setting experiment.
def stage(id,title,speaker,motivation,area,stock,goals,locations=[]):
 st=dict(id=id,title=title,speaker=speaker,motivation=motivation,area=dict(id='area-'+id,label=area,travelText='We collect the known equipment needed for this work and move to '+area.lower()+'. Earlier work stays where we left it.'),locations=locations,caches=[dict(id=id+'-cache',label=area+' stores',narrative='The existing '+area.lower()+' has the following stored mission equipment; these are not a new delivery.',items=stock)],objectives=[dict(id=id+'-'+k,kind='create',item=k,text=text) for k,text in goals]);stages[id]=st;return st
# A human camp beat: useful furniture, a clear lit workspace and a message home.
for k,l,d in [('bench-legs','Bench legs','The camp bench’s folding legs, stored under its worktop.'),('worktop','Worktop','A salvaged solid worktop sized for the camp bench legs.'),('lamp-bracket','Lamp bracket','A movable bracket for the portable solar lamp.'),('solar-lamp','Solar lamp','An intact portable lamp with its own charging panel, stored in the crew’s camp equipment.'),('message-camera','Message camera','The crew’s working camera and microphone, ready to record a short message.'),('antenna-stand','Antenna stand','A stable portable support for the long-range radio.')]:item(k,l,d)
recipe('camp-bench','worktop','bench-legs','workbench','Fit the stored legs to their worktop, making a shared workbench.')
recipe('camp-lamp','solar-lamp','lamp-bracket','bench-lamp','Fit the movable lamp bracket to the existing portable lamp.')
recipe('camp-light','workbench','bench-lamp','lit-workbench','Mount the lamp at the workbench so the crew can work together after dark.')
recipe('camp-message','message-camera','provisioned-refuge','crew-message','Record the sheltered crew’s message for their families.')
items['long-range-radio']['slots']=[{'id':'stand','accepts':['antenna-stand'],'required':False,'capabilities':['camp-contact']}]
rec.append(dict(id='camp-radio',a='long-range-radio',b='antenna-stand',install=dict(target='long-range-radio',slot='stand',component='antenna-stand'),description='Set the same long-range radio on its portable contact stand.'))
recipe('camp-send','crew-message','long-range-radio','message-home','Send the crew’s recorded message during the narrated contact interval.',requires=[{'item':'long-range-radio','capability':'camp-contact'}])
for k,l,d in [('workbench','Workbench','A shared bench assembled from the camp furniture.'),('bench-lamp','Bench lamp','The portable lamp on its adjustable bracket.'),('lit-workbench','Lit workbench','The crew’s shared illuminated workbench, ready for later equipment preparation.'),('crew-message','Crew message','A personal recording from the rescued crew, not a report card or abstract morale resource.'),('camp-radio','Camp radio','The existing long-range radio on its contact stand.'),('message-home','Message home','The crew’s recorded message sent home; a tangible recording of reaching other people again.')]:item(k,l,d)
camp=stage('camp','A place to work, a voice home','Survey crew','We can do more than wait here now. Give us a lit place to work, and let our families hear our voices.','Recovery camp',['bench-legs','worktop','lamp-bracket','solar-lamp','message-camera','antenna-stand'],[('lit-workbench','Make a shared lit workbench.'),('message-home','Send the crew’s recorded message home.')])
# Night experiment: probe + sample requires the real controlled chamber, then
# use the observed heat loss to fit a tangible insulating screen.
for k,l,d in [('wall-coupon','Wall sample','A spare piece of the habitat wall assembly, intended for the field thermal test.'),('temperature-logger','Temperature logger','A ready temperature recorder that can capture a cooling trace.'),('thermal-blanket','Thermal blanket','A mission insulating blanket that can be fitted to the measured wall dimensions.'),('clip-frame','Clip frame','The rigid reusable frame for the cabin’s removable thermal screen.'),('sleeping-cabin','Sleeping cabin','The existing insulated sleeping compartment, with an exposed service wall that loses heat overnight.'),('wall-template','Wall template','The original measured template for the cabin’s removable wall screen.')]:item(k,l,d)
s['locations'].append(dict(id='thermal-chamber',label='Thermal chamber',description='The camp’s enclosed qualification chamber provides a controlled cooling cycle for the wall sample; exposed outdoor readings would mix changing wind and sunlight.'))
recipe('night-trace','temperature-logger','wall-coupon','cooling-trace','Run the wall sample through the chamber’s stored cooling cycle and keep the recorded trace.',at='thermal-chamber')
item('insulation-swatch','Insulation swatch','A spare test swatch of the mission blanket material, kept with the wall coupon.')
recipe('night-insulate','wall-coupon','insulation-swatch','insulated-coupon','Wrap the test wall coupon with the mission insulation swatch for a comparison under the same chamber cycle.')
recipe('night-insulated-trace','temperature-logger','insulated-coupon','insulated-cooling-trace','Repeat the same stored cooling cycle with the insulated wall sample.',at='thermal-chamber')
recipe('night-compare','cooling-trace','insulated-cooling-trace','insulation-comparison','Compare the bare and insulated sample traces from the same controlled cycle.')
recipe('night-pattern','insulation-comparison','wall-template','screen-pattern','Use the tested insulation material with the existing measured wall template to plan the removable screen.')
item('insulated-coupon','Insulated wall sample','The original test coupon wrapped in the insulation swatch for a controlled comparison.')
item('insulated-cooling-trace','Insulated cooling trace','The recorded cooling cycle of the wrapped coupon, comparable with the bare sample trace.')
item('insulation-comparison','Insulation comparison','The two controlled traces show the insulating treatment reducing heat loss under the tested cycle.')
recipe('night-fit','screen-pattern','thermal-blanket','fitted-blanket','Fit the blanket to the measured screen pattern.')
recipe('night-screen','fitted-blanket','clip-frame','thermal-screen','Secure the fitted insulating blanket in the removable screen frame.')
recipe('night-cabin','thermal-screen','sleeping-cabin','screened-cabin','Fit the thermal screen over the cabin’s exposed service wall.')
for k,l,d in [('cooling-trace','Cooling trace','Measured heat loss during the controlled chamber cycle, not a claim that one reading predicts every Martian night.'),('screen-pattern','Screen pattern','The wall template marked for the measured heat-loss area.'),('fitted-blanket','Fitted blanket','The mission blanket fitted to the removable wall screen.'),('thermal-screen','Thermal screen','A framed insulating screen for the exposed service wall.'),('screened-cabin','Screened cabin','The original sleeping cabin with its removable thermal screen fitted.')]:item(k,l,d)
night=stage('night','The long night','Camp engineer','That service wall is losing heat overnight. Use the test chamber to understand it, then fit a screen so everyone can sleep comfortably.','Camp thermal workshop',['wall-coupon','temperature-logger','thermal-blanket','clip-frame','sleeping-cabin','wall-template','insulation-swatch'],[('screened-cabin','Fit a thermal screen to the sleeping cabin.')],['thermal-chamber'])
# The scout route earns a local ground check and an actual wheel retrofit.
for k,l,d in [('ground-probe','Ground probe','A ready field penetration instrument for comparing the nearby surface layers.'),('route-overlay','Route overlay','A transparent overlay for marking the scout terrain model.'),('crossing-marker','Crossing marker','A visible marker for the selected approach across the shallow eroded channel.')]:item(k,l,d)
s['locations'].append(dict(id='channel-approach',label='Channel approach',description='The shallow channel’s exposed approach has a soft cover over firmer ground. It needs a local survey, not an invented bridge over a canyon.'))
recipe('crossing-profile','ground-probe','@channel-approach','ground-profile','Use the field probe to compare the near-surface layers at the approach; detailed testing and interpretation are abstracted.')
recipe('crossing-route','ground-profile','terrain-model','firm-ground-route','Match the ground observations to the scout terrain model to identify a supported approach.')
recipe('crossing-overlay','firm-ground-route','route-overlay','crossing-map','Mark the chosen approach on the route overlay.')
recipe('crossing-marker','crossing-map','crossing-marker','marked-crossing','Place the marker according to the mapped approach, yielding a marked route for the crawler.')
for k,l,d in [('ground-profile','Ground profile','A local record of the surface layers observed at the channel approach.'),('firm-ground-route','Firm-ground route','The approach chosen from ground observations and the scout model, not a guarantee for unexplored terrain.'),('crossing-map','Crossing map','The terrain overlay marked with the selected approach.'),('marked-crossing','Marked crossing','The surveyed approach with its visible marker in place.')]:item(k,l,d)
cross=stage('crossing','The route is not the ground','Field engineer','The scout found the channel, but it cannot tell us how the surface will carry the crawler. Check the approach and fit the replacement wheel before we take the cabin across.','Shallow channel',['ground-probe','route-overlay','crossing-marker'],[('marked-crossing','Survey and mark the supported channel approach.')],['channel-approach'])
stages['workshop']['objectives'].append(dict(id='workshop-wheel',kind='create',capability='crawler-wheel',text='Fit the replacement wheel module for the coming traverse.'))
cross['objectives'].append(dict(id='crossing-wheel',kind='place',capability='crawler-wheel',location='channel-approach',text='Bring the wheel-equipped crawler to the surveyed channel approach.'))
cross['motivation']='The scout found the channel, but it cannot tell us how the surface will carry the crawler. Check and mark the approach, then bring our wheel-equipped crawler to it.'
# Insert stages without replacing permanent geography or retconning earlier areas.
ordered=[]
for st in s['stages']:
 ordered.append(st)
 if st['id']=='rescue':ordered.extend([camp,night])
 if st['id']=='traverse':ordered.append(cross)
s['stages']=ordered
# Filter each cache to real current/future ingredient references; ready objects
# intentionally supplied above replace their old disassembled stock.
used={x for r in rec for x in [r['a'],r['b']] if not x.startswith('@')}
for st in s['stages']:
 st.pop('carry',None)
 for cache in st.get('caches',[]):cache['items']=list(dict.fromkeys(k for k in cache['items'] if k in used))
s['items']=list(items.values());s['recipes']=rec;s.pop('checkpoints',None)
s['notes']=['Unreleased v5 whole-campaign candidate, not fresh-play validated. Incorporates the reviewed lighter v4 Weather/Relay/Rescue content.','Ready engineered equipment replaces preparation ladders. No steps were added solely to refill a count target.','Three new local episodes: camp cooperation/contact, controlled thermal investigation, and checking a scout route on the ground.','Current-scene packing only. Manufactured mission equipment and qualified processes are fictional abstractions, not survival or engineering instructions.']
s['sources'].extend([dict(id='thermal-tests',title='NASA thermal testing',url='https://s3vi.ndc.nasa.gov/ssri-kb/topics/59/',note='Controlled thermal testing of spacecraft and subsystems grounds the test-chamber setting; this fictional field comparison is not a qualification procedure.'),dict(id='terrain',title='JPL rover navigation',url='https://robotics.jpl.nasa.gov/what-we-do/flight-projects/mars-science-laboratory/surface-system-software-and-rover-navigation/',note='Terrain assessment and route selection matter for mobility. The field ground-probe interpretation remains a simplified fictional crewed-mission technique.')])
(p/'scenario.json').write_text(json.dumps(s,indent=2)+'\n')
print(len(rec),'recipes',len(s['stages']),'stages')
