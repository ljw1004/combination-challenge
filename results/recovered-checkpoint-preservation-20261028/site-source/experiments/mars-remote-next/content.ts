/** Named, portable Mars content. No generic assemblies or accumulated place recipes. */
export type NamedCapability='working-radio'|'solar-radio'|'long-range-radio'|'stored-water'|'protected-growth'|'solar-travel'|'pressure-repair'|'greenhouse'|'workbench'|'lit-workbench'|'heat'|'solar-heat'|'solar-light'|'orbiter-contact'|'route-map'|'sample-record'|'stored-sample'|'annotated-route';
export interface NamedConcept {id:string;label:string;description:string;capabilities:NamedCapability[]}
export interface NamedRecipe {id:string;a:string;b:string;result:string;at?:string;description:string;retire?:string[];retirementReason?:string;incorporate?:string[];incorporationReason?:string}
export interface NamedLocation {id:string;label:string;x:number;y:number;description:string}
export interface NamedGoal {id:string;title:string;requirement:string;kind:'discover'|'place'|'function';concept:string;requires?:NamedCapability[];capability?:NamedCapability;location?:string;requiredLocations:string[];supplies:string[]}
export interface NamedLevel {id:string;label:string;intro:string;supplies:string[];locations:string[];goals:string[]}
export type NamedWitnessAction={type:'select';level:string}|{type:'combine';a:string;b:string;at?:string}|{type:'place';concept:string;location:string|null};
const c=(id:string,label:string,description:string,capabilities:NamedCapability[]=[]):NamedConcept=>({id,label,description,capabilities});
export const NAMED_CONCEPTS:NamedConcept[]=[
 c('broken-radio','Broken radio','A recognizable radio with a damaged detachable lead.'),
 c('cable','Cable','An intact electrical lead.'),c('solar-panel','Solar panel','A salvaged collector.'),c('battery','Battery','A power-storage component for a solar charger.'),
 c('heater','Heater','A portable heater, useful for warmth and melting ice.',['heat']),c('water-filter','Water filter','A complete filter for the game’s meltwater; this abstract result is not real water-safety advice.'),c('canister','Empty canister','A portable water container.'),
 c('seeds','Seeds','Seeds for the planting tray.'),c('planting-tray','Planting tray','A tray already containing growing medium.'),c('clear-cover','Clear cover','A transparent protective cover.'),
 c('frame','Frame','A rigid support.'),c('wheels','Wheels','A set of wheels.'),c('motor','Motor','A salvaged drive motor.'),c('dish','Dish antenna','An antenna for a longer-range radio.'),
 c('habitat-fabric','Habitat fabric','A tough flexible repair sheet.'),c('sealant','Sealant','A sealing material.'),c('toolkit','Toolkit','Portable workshop tools.'),c('lamp','Lamp','A portable electric lamp.'),
 c('radio','Radio','A repaired working radio.',['working-radio']),c('solar-charger','Solar charger','A panel and battery made into a charging unit.'),c('solar-radio','Solar radio','A radio with an internal solar supply wired for communication, not the Rover drive bus.',['working-radio', 'solar-radio','orbiter-contact']),
 c('meltwater-canister','Meltwater canister','A canister of unfiltered glacier meltwater, collected at the source.'),
 c('meltwater','Meltwater','Portable water obtained from the glacier; it is not bound to the glacier.'),c('filtered-water','Filtered water','Meltwater processed by the available filter.'),c('water-canister','Water canister','A closed canister keeps usable water protected from dust and evaporation; its function is storage, not merely portability.',['stored-water']),
 c('seed-tray','Seed tray','Seeds planted in a prepared tray.'),c('watered-seed-tray','Watered seed tray','A planted tray supplied with water.'),c('sprouted-tray','Sprouted tray','A tray germinated in the warm habitat, now portable.'),c('propagator','Propagator','A sprouted tray protected by a clear cover.',['protected-growth']),
 c('rover','Rover','A wheeled chassis with drive-motor and traction-charger interfaces. Its optional radio interface accepts working, solar or long-range modules; a radio’s internal supply does not power the drive bus.'),
 c('long-range-radio','Long-range radio','A solar radio fitted with a dish antenna.',['working-radio', 'solar-radio', 'long-range-radio','orbiter-contact']),c('pressure-patch','Pressure patch','A repair sheet sealed into a portable pressure patch.',['pressure-repair']),
 c('cold-frame','Cold frame','A rigid frame with a transparent growing cover.'),c('greenhouse','Greenhouse','A covered growing frame containing a propagating tray.',['protected-growth', 'greenhouse']),
 c('workbench','Workbench','A frame supporting the toolkit.',['workbench']),c('solar-lamp','Solar lamp','A lamp supplied by a solar charger.',['solar-light']),c('lit-workbench','Lit workbench','A workbench with its own solar-powered task lamp.',['workbench', 'lit-workbench']),
 c('solar-heater','Solar heater','A heater supplied by a solar charger.',['heat', 'solar-heat']),c('heated-propagator','Heated propagator','A propagator with its own heater.',['protected-growth']),c('heated-greenhouse','Heated greenhouse','A greenhouse with its own solar heater.',['protected-growth', 'greenhouse'])
];
const r=(id:string,a:string,b:string,result:string,description:string,at?:string):NamedRecipe=>({id,a,b,result,description,...(at?{at}:{})});
export const NAMED_RECIPES:NamedRecipe[]=[
 {...r('repair-radio','broken-radio','cable','radio','Reconnect the intact replacement lead to the radio; no special setting is needed.'),retire:['broken-radio'],retirementReason:'The repaired radio supersedes this obsolete broken-radio instance. No other authored recipe or goal needs it. Cable remains an ordinary reusable thing; absence of later recipes alone is not a retirement rule.'},
 r('charger','solar-panel','battery','solar-charger','Combine a collector and battery into a charger.'),
 {...r('solar-radio','solar-charger','radio','solar-radio','Give the repaired radio its own power supply.'),retire:['radio'],incorporate:['solar-charger']},
 r('melt','heater','place:glacier','meltwater','The glacier is an operand: heating it creates portable meltwater, not a placed heater.'),
 r('filter','meltwater','water-filter','filtered-water','Filter the meltwater.'),r('fill','filtered-water','canister','water-canister','Fill a portable canister.'),
 r('plant','seeds','planting-tray','seed-tray','Plant the prepared tray.'),
 r('water','water-canister','seed-tray','watered-seed-tray','Outside a warm growing context this produces a watered tray.'),
 r('germinate-context','water-canister','seed-tray','sprouted-tray','The warm habitat provides the germination setting. No prior placement or accumulated ingredients are required.','warm-habitat'),
 r('germinate-place','watered-seed-tray','place:warm-habitat','sprouted-tray','Bring a watered tray to the warm habitat to produce a portable sprouted tray.'),
 r('propagator','sprouted-tray','clear-cover','propagator','Protect the sprouted tray with a clear cover.'),
 {...r('rover','frame','wheels','rover','Make a wheeled Rover chassis with spaces for useful parts.'),incorporate:['wheels'],incorporationReason:'Wheels become part of the Rover chassis; no other implemented construction needs an outside copy. Frame stays reusable.'},
 {...r('long-range','solar-radio','dish','long-range-radio','Fit a dish antenna to the solar radio.'),retire:['solar-radio'],incorporate:['dish']},
 r('patch','habitat-fabric','sealant','pressure-patch','Seal the repair sheet into a portable pressure patch.'),
 r('cold-frame','frame','clear-cover','cold-frame','Make a covered growing frame.'),r('greenhouse','cold-frame','sprouted-tray','greenhouse','Give the covered frame a living growing tray.'),
 {...r('greenhouse-alternative','frame','propagator','greenhouse','Expand the protected propagator into a larger growing frame.'),retire:['propagator']},
 {...r('greenhouse-heated-alternative','frame','heated-propagator','heated-greenhouse','Expand the heated propagator without losing its protected growing function.'),retire:['heated-propagator']},
 r('workbench','frame','toolkit','workbench','Make a supported workbench.'),r('solar-lamp','solar-charger','lamp','solar-lamp','Give the lamp its own charger.'),{...r('lit-workbench','workbench','solar-lamp','lit-workbench','Light the workbench with its own task lamp.'),retire:['workbench'],incorporate:['solar-lamp']},
 r('solar-heater','solar-charger','heater','solar-heater','Give the heater its own charger.'),{...r('heated-propagator','propagator','heater','heated-propagator','Make a heated propagator.'),retire:['propagator'],incorporate:['heater']},{...r('heated-greenhouse','greenhouse','solar-heater','heated-greenhouse','Make a self-heated greenhouse.'),retire:['greenhouse'],incorporate:['solar-heater']},
 {...r('collect-at-source','heater','canister','meltwater-canister','Glacier ice supplies the water; heat it straight into the canister. Away from the ice these two things cannot collect water.','glacier'),incorporate:['canister']},
 {...r('filter-canister','meltwater-canister','water-filter','water-canister','Filter the collected meltwater in its canister; the filter remains a reusable tool.'),retire:['meltwater-canister']}
];
export const NAMED_LOCATIONS:NamedLocation[]=[
 {id:'contact-ridge',label:'Contact ridge',x:900,y:180,description:'The ridge clears the lander’s radio shadow. Position solar-powered radio equipment here to contact the orbiter; moving it away remains free.'},
 {id:'glacier',label:'Glacier',x:180,y:480,description:'The source of water. Heat the ice directly, or combine Heater with a canister here to catch the meltwater at its source.'},
 {id:'warm-habitat',label:'Warm habitat',x:540,y:480,description:'A warm work area where watered seedlings can germinate. Growing objects remain portable.'}
];
export const NAMED_GOALS:NamedGoal[]=[
 {id:'radio',title:'Reconnect',requirement:'Repair a working radio.',kind:'function',concept:'radio',requires:['working-radio'],requiredLocations:[],supplies:[]},
 {id:'contact',title:'Be found',requirement:'Send a sustained powered radio or directed optical signal from the ridge, clear of the lander’s shadow.',kind:'place',concept:'solar-radio',capability:'orbiter-contact',location:'contact-ridge',requiredLocations:['contact-ridge'],supplies:[]},
 {id:'home',title:'Make a living foothold',requirement:'Make a closed water store protected from dust, protected living growth and a pressure repair for the habitat. Choose the order and the equipment.',kind:'function',concept:'propagator',requires:['stored-water','protected-growth','pressure-repair'],requiredLocations:['glacier','warm-habitat'],supplies:[]},
 {id:'independence',title:'Prepare a useful expedition',requirement:'Prepare solar travel, distant radio contact and a route map. The route map can come from supported photography or binocular observations at the overlook.',kind:'function',concept:'rover',requires:['solar-travel','long-range-radio','route-map'],requiredLocations:['overlook'],supplies:[]}
];
export const NAMED_LEVELS:NamedLevel[]=[
 {id:'contact',label:'1 · Be found',intro:'All the salvage is here. First reconnect the broken radio, then get a powered signal above the lander’s shadow.',supplies:[],locations:['contact-ridge'],goals:['radio','contact']},
 {id:'home',label:'2 · A living foothold',intro:'Make this a place you can live: water, protected growth and a habitat repair. You choose what to work on next.',supplies:[],locations:['glacier','warm-habitat'],goals:['home']},
 {id:'independence',label:'3 · The expedition',intro:'Prepare transport, distant contact and a usable route. Extra home equipment is optional; there is no delivery list.',supplies:[],locations:[],goals:['independence']}
];
// Larger continuation: same world and initial manifest, not a mission reset or automatic supply cache.
NAMED_CONCEPTS.push(
 c('camera','Camera','A salvaged camera; ordinary close photographs need no magic apparatus.'),
 c('tripod','Tripod','A stable support for optical equipment.'),c('map','Map','A terrain sheet ready for actual observations.'),c('binoculars','Binoculars','A handheld view of distant route features.'),
 c('lens','Lens','An optical lens.'),c('tube','Tube','A rigid optical tube.'),c('scoop','Scoop','A reusable sample scoop.'),c('sample-jar','Sample jar','A transparent sealable jar for returned material.'),
 c('sealed-box','Windowed box','A sealed windowed enclosure with glove ports.'),c('gloves','Gloves','Gloves matching the box ports.'),c('foil','Reflective foil','A reflective sheet for directed light.'),
 c('lantern','Lantern','A battery-powered portable light, not yet a directed long-distance signal.'),c('reflector','Reflector','A supported foil reflector directs light.'),c('signal-lamp','Signal lamp','A lamp with a reflector directs a visible signal.'),c('signal-beacon','Signal beacon','A supported directed optical signal visible to the orbiter from the open ridge.',['orbiter-contact']),
 c('field-camera','Field camera','A camera on a stable tripod.'),c('panorama','Panorama','A recognizable wide view of the expedition route.'),c('survey-map','Survey map','A terrain sheet marked with observed route features, not a guarantee of passability.',['route-map']),
 c('telescope','Telescope','A lens aligned in an optical tube.'),c('field-telescope','Field telescope','A telescope on a stable support.'),c('telescope-camera','Telescope camera','A camera attached to supported long-range optics.'),c('cliff-photograph','Cliff photograph','A distant cliff image, not a geological diagnosis.'),c('annotated-survey-map','Annotated survey map','The original route map enriched by a distant cliff observation.',['route-map','annotated-route']),
 c('ice-sample','Ice sample','A collected piece of ice; record it and seal it for return.'),c('sealed-ice-sample','Sealed ice sample','The collected specimen protected in a transparent sealed jar. It can still be photographed.',['stored-sample']),c('ice-photograph','Ice photograph','A record of the collected specimen, not proof of its composition.',['sample-record']),
 c('glovebox','Glovebox','A windowed enclosure with sealed gloves for contained handling.'),c('illuminated-glovebox','Illuminated glovebox','A lit enclosure for contained inspection.'),c('imaging-glovebox','Imaging glovebox','A lit glovebox equipped with a camera; useful if you prefer contained photography. Ordinary close photography remains legal.')
);
NAMED_RECIPES.push(
 {...r('lantern','battery','lamp','lantern','Connect portable light and battery.'),incorporate:['battery','lamp']},
 r('reflector','foil','frame','reflector','Support a reflective foil sheet.'),
 {...r('signal-lamp','lantern','reflector','signal-lamp','Direct the lamp’s light into a visible signal.'),retire:['lantern'],incorporate:['reflector']},
 {...r('beacon','signal-lamp','tripod','signal-beacon','Support the directed signal for sustained visibility.'),retire:['signal-lamp'],incorporate:['tripod']},
 {...r('field-camera','camera','tripod','field-camera','Support a camera for a panorama.'),incorporate:['camera','tripod']},
 r('panorama','field-camera','place:overlook','panorama','Photograph the visible route from this overlook.'),
 {...r('survey-photo','panorama','map','survey-map','Mark observed features onto the terrain sheet.'),retire:['map']},
 {...r('survey-binocular','binoculars','map','survey-map','Observe the route from the overlook and mark the sheet. The viewpoint supplies actual visible terrain.','overlook'),retire:['map']},
 {...r('telescope','lens','tube','telescope','Align the optical tube.'),incorporate:['lens','tube']},
 {...r('field-telescope','telescope','tripod','field-telescope','Stabilize the telescope.'),retire:['telescope'],incorporate:['tripod']},
 {...r('telescope-camera','field-telescope','camera','telescope-camera','Attach a camera to the stable optics.'),retire:['field-telescope'],incorporate:['camera']},
 r('cliff-photo','telescope-camera','place:distant-lookout','cliff-photograph','The distant lookout exposes the cliff face to the long-range optics.'),
 {...r('annotate','cliff-photograph','survey-map','annotated-survey-map','Add the cliff observation to the existing usable route map.'),retire:['survey-map']},
 r('sample','scoop','place:glacier','ice-sample','Collect the specimen with a reusable scoop.'),
 r('outcrop-sample','scoop','place:lookout-ice','ice-sample','Collect a specimen from the exposed ice beside the expedition lookout.'),
 {...r('seal-sample','ice-sample','sample-jar','sealed-ice-sample','Seal the actual specimen, not a second duplicate sample.'),retire:['ice-sample'],incorporate:['sample-jar']},
 r('sample-photo','ice-sample','camera','ice-photograph','Record a close view with the camera.'),r('sealed-sample-photo','sealed-ice-sample','camera','ice-photograph','Photograph the specimen through its transparent jar.'),
 {...r('glovebox','sealed-box','gloves','glovebox','Fit the sealed gloves to the existing ports.'),incorporate:['sealed-box','gloves']},
 {...r('light-glovebox','glovebox','lamp','illuminated-glovebox','Light the contained work area.'),retire:['glovebox'],incorporate:['lamp']},
 {...r('imaging-glovebox','illuminated-glovebox','camera','imaging-glovebox','Attach a camera to the lit enclosure.'),retire:['illuminated-glovebox'],incorporate:['camera']},
 r('contained-photo','ice-sample','imaging-glovebox','ice-photograph','Record the specimen using the enclosure’s camera.'),r('contained-sealed-photo','sealed-ice-sample','imaging-glovebox','ice-photograph','Record the sealed specimen inside the enclosure.')
);
NAMED_LOCATIONS.push(
 {id:'lookout-ice',label:'Lookout ice outcrop',x:180,y:1080,description:'A fresh ice exposure beside the distant lookout. Collect a local specimen with the scoop; the earlier glacier remains back by the habitat.'},
 {id:'overlook',label:'Route overlook',x:180,y:780,description:'A vantage onto the actual expedition route: supported panorama or binocular observation can inform a map.'},
 {id:'distant-lookout',label:'Distant lookout',x:900,y:780,description:'The cliff face is visible from here. Long-range optics produce a portable observation; there is no photograph delivery slot.'}
);
NAMED_GOALS.push({id:'observations',title:'Return something worth studying',requirement:'Seal a collected ice specimen, record its appearance and enrich the route map with a distant cliff observation. A transparent jar does not prevent photography; contained photography is optional.',kind:'function',concept:'annotated-survey-map',requires:['stored-sample','sample-record','annotated-route'],requiredLocations:['distant-lookout','lookout-ice'],supplies:[]});
NAMED_LEVELS.push({id:'observations',label:'4 · Useful observations',intro:'Bring back a protected specimen and an inspectable record, plus a new view of the distant cliff on your route map. The observations are the payoff; no apparatus or photograph needs parking.',supplies:[],locations:['distant-lookout','lookout-ice'],goals:['observations']});
export const NAMED_STARTING_SUPPLIES=NAMED_CONCEPTS.filter(c=>c.id!=='cart'&&!NAMED_RECIPES.some(r=>r.result===c.id)).map(c=>c.id);
export type RoverSlot='wheels'|'engine'|'charger'|'radio';
/** Slots are physical interfaces, not generic bags or exact-old-kind gates. */
export const ROVER_SLOTS:{id:RoverSlot;label:string;accepts:string[];required:boolean}[]=[
 {id:'wheels',label:'Wheels',accepts:['wheels'],required:true},
 {id:'engine',label:'Motor',accepts:['motor'],required:true},
 {id:'charger',label:'Solar charger',accepts:['solar-charger'],required:true},
 {id:'radio',label:'Radio module',accepts:['radio','solar-radio','long-range-radio'],required:false}
];

// These are actual physical assemblies/evolutions, not a general garbage-collection rule.
const evolved:Record<string,string[]>={water:['seed-tray'],'germinate-context':['seed-tray'],'germinate-place':['watered-seed-tray'],propagator:['sprouted-tray'],greenhouse:['cold-frame','sprouted-tray']};
const modules:Record<string,string[]>={charger:['solar-panel','battery'],'solar-lamp':['solar-charger','lamp'],'solar-heater':['solar-charger'],fill:['canister'],propagator:['clear-cover']};
for(const recipe of NAMED_RECIPES){
 if(evolved[recipe.id])recipe.retire=evolved[recipe.id];
 if(modules[recipe.id])recipe.incorporate=modules[recipe.id];

 if(recipe.retire)recipe.retirementReason='An explicit evolved predecessor is physically replaced; enhanced functions and compatible recipes are preserved.';
 if(recipe.incorporate)recipe.incorporationReason='This physical module becomes part of the output. Keep an outside representative only while another authored use remains.';
}
