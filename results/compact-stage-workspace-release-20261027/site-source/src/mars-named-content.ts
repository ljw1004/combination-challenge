/** Named, portable Mars content. No generic assemblies or accumulated place recipes. */
export type NamedCapability='working-radio'|'solar-radio'|'long-range-radio'|'stored-water'|'protected-growth'|'solar-travel'|'pressure-repair'|'greenhouse'|'workbench'|'lit-workbench'|'heat'|'solar-heat'|'solar-light';
export interface NamedConcept {id:string;label:string;description:string;capabilities:NamedCapability[]}
export interface NamedRecipe {id:string;a:string;b:string;result:string;at?:string;description:string;retire?:string[];retirementReason?:string;incorporate?:string[];incorporationReason?:string}
export interface NamedLocation {id:string;label:string;x:number;y:number;description:string}
export interface NamedGoal {id:string;title:string;requirement:string;kind:'discover'|'place';concept:string;capability?:NamedCapability;location?:string;requiredLocations:string[];supplies:string[]}
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
 c('radio','Radio','A repaired working radio.',['working-radio']),c('solar-charger','Solar charger','A panel and battery made into a charging unit.'),c('solar-radio','Solar radio','A radio supplied by its own solar charger.',['working-radio', 'solar-radio']),
 c('meltwater','Meltwater','Portable water obtained from the glacier; it is not bound to the glacier.'),c('filtered-water','Filtered water','Meltwater processed by the available filter.'),c('water-canister','Water canister','A filled portable container.',['stored-water']),
 c('seed-tray','Seed tray','Seeds planted in a prepared tray.'),c('watered-seed-tray','Watered seed tray','A planted tray supplied with water.'),c('sprouted-tray','Sprouted tray','A tray germinated in the warm habitat, now portable.'),c('propagator','Propagator','A sprouted tray protected by a clear cover.',['protected-growth']),
 c('cart','Cart','A frame carried on wheels.'),c('rover','Rover','A wheeled chassis with spaces for useful parts.'),
 c('long-range-radio','Long-range radio','A solar radio fitted with a dish antenna.',['working-radio', 'solar-radio', 'long-range-radio']),c('pressure-patch','Pressure patch','A repair sheet sealed under the repair bench’s clamping tools; it remains portable.',['pressure-repair']),
 c('cold-frame','Cold frame','A rigid frame with a transparent growing cover.'),c('greenhouse','Greenhouse','A covered growing frame containing a propagating tray.',['protected-growth', 'greenhouse']),
 c('workbench','Workbench','A frame supporting the toolkit.',['workbench']),c('solar-lamp','Solar lamp','A lamp supplied by a solar charger.',['solar-light']),c('lit-workbench','Lit workbench','A workbench with its own solar-powered task lamp.',['workbench', 'lit-workbench']),
 c('solar-heater','Solar heater','A heater supplied by a solar charger.',['heat', 'solar-heat']),c('heated-propagator','Heated propagator','A propagator with its own heater.',['protected-growth']),c('heated-greenhouse','Heated greenhouse','A greenhouse with its own solar heater.',['protected-growth', 'greenhouse'])
];
const r=(id:string,a:string,b:string,result:string,description:string,at?:string):NamedRecipe=>({id,a,b,result,description,...(at?{at}:{})});
export const NAMED_RECIPES:NamedRecipe[]=[
 {...r('repair-radio','broken-radio','cable','radio','Reconnect the intact replacement lead to the radio; no special setting is needed.'),retire:['broken-radio'],retirementReason:'The repaired radio supersedes this obsolete broken-radio instance. No other authored recipe or goal needs it. Cable remains an ordinary reusable thing; absence of later recipes alone is not a retirement rule.'},
 r('charger','solar-panel','battery','solar-charger','Combine a collector and battery into a charger.'),
 r('solar-radio','solar-charger','radio','solar-radio','Give the repaired radio its own power supply.'),
 r('melt','heater','place:glacier','meltwater','The glacier is an operand: heating it creates portable meltwater, not a placed heater.'),
 r('filter','meltwater','water-filter','filtered-water','Filter the meltwater.'),r('fill','filtered-water','canister','water-canister','Fill a portable canister.'),
 r('plant','seeds','planting-tray','seed-tray','Plant the prepared tray.'),
 r('water','water-canister','seed-tray','watered-seed-tray','Outside a warm growing context this produces a watered tray.'),
 r('germinate-context','water-canister','seed-tray','sprouted-tray','The warm habitat provides the germination setting. No prior placement or accumulated ingredients are required.','warm-habitat'),
 r('germinate-place','watered-seed-tray','place:warm-habitat','sprouted-tray','Bring a watered tray to the warm habitat to produce a portable sprouted tray.'),
 r('propagator','sprouted-tray','clear-cover','propagator','Protect the sprouted tray with a clear cover.'),
 {...r('rover','frame','wheels','rover','Make a wheeled Rover chassis with spaces for useful parts.'),incorporate:['wheels'],incorporationReason:'Wheels become part of the Rover chassis; no other implemented construction needs an outside copy. Frame stays reusable.'},r('rover-from-cart','cart','motor','rover','Make a Rover from a wheeled cart; its wheels are already installed.'),
 r('long-range','solar-radio','dish','long-range-radio','Fit a dish antenna to the solar radio.'),
 r('patch','habitat-fabric','sealant','pressure-patch','The repair bench provides clamping tools for a reliable sealed patch.','repair-bench'),
 r('cold-frame','frame','clear-cover','cold-frame','Make a covered growing frame.'),r('greenhouse','cold-frame','sprouted-tray','greenhouse','Give the covered frame a living growing tray.'),
 r('greenhouse-alternative','frame','propagator','greenhouse','Reuse the protected propagator in a larger growing frame.'),
 r('workbench','frame','toolkit','workbench','Make a supported workbench.'),r('solar-lamp','solar-charger','lamp','solar-lamp','Give the lamp its own charger.'),r('lit-workbench','workbench','solar-lamp','lit-workbench','Light the workbench with its own task lamp.'),
 r('solar-heater','solar-charger','heater','solar-heater','Give the heater its own charger.'),r('heated-propagator','propagator','heater','heated-propagator','Make a heated propagator.'),r('heated-greenhouse','greenhouse','solar-heater','heated-greenhouse','Make a self-heated greenhouse.')
];
export const NAMED_LOCATIONS:NamedLocation[]=[
 {id:'repair-bench',label:'Repair bench',x:180,y:180,description:'A clamping and repair station. Explicit catalyst for sealed patches; never a bag of accumulated ingredients.'},
 {id:'contact-ridge',label:'Contact ridge',x:900,y:180,description:'Place a working solar radio here to contact the orbiter. It can always be moved away.'},
 {id:'glacier',label:'Glacier',x:180,y:480,description:'Heater + this place produces portable meltwater. Other ordinary placements remain movable.'},
 {id:'water-store',label:'Habitat water point',x:900,y:480,description:'A useful destination for a portable water canister. Placement does not consume or bind it.'},
 {id:'warm-habitat',label:'Warm habitat',x:540,y:480,description:'A meaningful germination context. A watered tray combined with the place becomes a portable sprouted tray. Place a propagator here for the growing task.'},
 {id:'canyon-route',label:'Canyon approach',x:180,y:780,description:'Place a functional Rover here to prepare the next expedition; no simulated drive or hidden fuel accounting.'},
 {id:'relay-ridge',label:'Relay ridge',x:900,y:780,description:'A destination for the long-range radio.'},
 {id:'airlock',label:'Habitat airlock',x:540,y:180,description:'Place a pressure patch here. It remains an ordinary movable named item; moving it away removes current task satisfaction.'},
 {id:'garden-plot',label:'Growing court',x:540,y:780,description:'Place a greenhouse here to establish the growing court.'},
 {id:'workshop',label:'Workshop bay',x:540,y:1080,description:'Place a lit workbench here to finish the useful base workshop.'}
];
export const NAMED_GOALS:NamedGoal[]=[
 {id:'radio',title:'Reconnect the radio',requirement:'Make a working radio from the two things in front of you.',kind:'discover',concept:'radio',requiredLocations:[],supplies:['broken-radio','cable']},
 {id:'contact',title:'Contact the orbiter',requirement:'Place solar-powered radio equipment on the contact ridge: a solar radio, long-range radio, or Rover with radio and charger installed.',kind:'place',concept:'solar-radio',capability:'solar-radio',location:'contact-ridge',requiredLocations:['contact-ridge'],supplies:['solar-panel','battery','radio']},
 {id:'water',title:'Bring water home',requirement:'Place a water canister at the habitat water point.',kind:'place',concept:'water-canister',capability:'stored-water',location:'water-store',requiredLocations:['glacier','water-store'],supplies:['heater','water-filter','canister']},
 {id:'propagation',title:'Start growing',requirement:'Place protected living growth in the warm habitat: a propagator or greenhouse, heated or unheated.',kind:'place',concept:'propagator',capability:'protected-growth',location:'warm-habitat',requiredLocations:['warm-habitat'],supplies:['seeds','planting-tray','clear-cover','water-canister']},
 {id:'travel',title:'Prepare the expedition',requirement:'Place a functional Rover at the canyon approach. Explore compatible parts to make it ready to drive.',kind:'place',concept:'rover',capability:'solar-travel',location:'canyon-route',requiredLocations:['canyon-route'],supplies:['frame','wheels','motor','solar-charger']},
 {id:'relay',title:'Extend contact',requirement:'Place a long-range radio on the relay ridge.',kind:'place',concept:'long-range-radio',capability:'long-range-radio',location:'relay-ridge',requiredLocations:['relay-ridge'],supplies:['dish','solar-radio']},
 {id:'seal',title:'Repair the habitat',requirement:'Place a pressure patch at the airlock.',kind:'place',concept:'pressure-patch',capability:'pressure-repair',location:'airlock',requiredLocations:['repair-bench','airlock'],supplies:['habitat-fabric','sealant']},
 {id:'garden',title:'Make the growing court',requirement:'Place a greenhouse (heated or unheated) at the growing court.',kind:'place',concept:'greenhouse',capability:'greenhouse',location:'garden-plot',requiredLocations:['garden-plot'],supplies:['frame','propagator','clear-cover','sprouted-tray']},
 {id:'work',title:'Leave a useful workshop',requirement:'Place a lit workbench in the workshop bay.',kind:'place',concept:'lit-workbench',capability:'lit-workbench',location:'workshop',requiredLocations:['workshop'],supplies:['frame','toolkit','lamp','solar-charger']}
];
export const NAMED_LEVELS:NamedLevel[]=[
 {id:'contact',label:'1 · Be found',intro:'The radio’s lead is damaged. Reconnect it with the cable.',supplies:['broken-radio','cable','solar-panel','battery'],locations:['contact-ridge'],goals:['radio','contact']},
 {id:'water',label:'2 · Water and growth',intro:'Ice is nearby. Bring water home, then use the habitat’s warmth to start a protected growing tray.',supplies:['heater','water-filter','canister','seeds','planting-tray','clear-cover'],locations:['glacier','water-store','warm-habitat'],goals:['water','propagation']},
 {id:'travel',label:'3 · Reach farther',intro:'Reuse the power and radio ideas for an expedition and a more distant link.',supplies:['frame','wheels','motor','dish','solar-charger','solar-radio','radio'],locations:['canyon-route','relay-ridge'],goals:['travel','relay']},
 {id:'home',label:'4 · Make a home',intro:'Patch the habitat and reuse your growing tray in a greenhouse. The repair bench helps make a sealed patch; it never collects ingredients for you.',supplies:['habitat-fabric','sealant','frame','propagator','clear-cover','sprouted-tray'],locations:['repair-bench','airlock','garden-plot'],goals:['seal','garden']},
 {id:'work',label:'5 · A working base',intro:'Reuse the charger to light a proper workbench. Finish with a useful place to keep making things.',supplies:['frame','toolkit','lamp','solar-charger'],locations:['workshop'],goals:['work']}
];
export const NAMED_WITNESS:NamedWitnessAction[]=[
 {type:'select',level:'contact'}, {type:'combine',a:'broken-radio',b:'cable'}, {type:'combine',a:'solar-panel',b:'battery'}, {type:'combine',a:'solar-charger',b:'radio'}, {type:'place',concept:'solar-radio',location:'contact-ridge'},
 {type:'select',level:'water'}, {type:'combine',a:'heater',b:'place:glacier'}, {type:'combine',a:'meltwater',b:'water-filter'}, {type:'combine',a:'filtered-water',b:'canister'}, {type:'place',concept:'water-canister',location:'water-store'}, {type:'combine',a:'seeds',b:'planting-tray'}, {type:'combine',a:'seed-tray',b:'water-canister'}, {type:'combine',a:'watered-seed-tray',b:'place:warm-habitat'}, {type:'combine',a:'sprouted-tray',b:'clear-cover'}, {type:'place',concept:'propagator',location:'warm-habitat'},
 {type:'select',level:'travel'}, {type:'combine',a:'frame',b:'wheels'}, {type:'combine',a:'motor',b:'rover'}, {type:'combine',a:'solar-charger',b:'rover'}, {type:'place',concept:'rover',location:'canyon-route'}, {type:'combine',a:'dish',b:'solar-radio'}, {type:'place',concept:'long-range-radio',location:'relay-ridge'},
 {type:'select',level:'home'}, {type:'place',concept:'sealant',location:'repair-bench'}, {type:'combine',a:'habitat-fabric',b:'sealant',at:'repair-bench'}, {type:'place',concept:'pressure-patch',location:'airlock'}, {type:'combine',a:'frame',b:'propagator'}, {type:'place',concept:'greenhouse',location:'garden-plot'},
 {type:'select',level:'work'}, {type:'combine',a:'frame',b:'toolkit'}, {type:'combine',a:'solar-charger',b:'lamp'}, {type:'combine',a:'workbench',b:'solar-lamp'}, {type:'place',concept:'lit-workbench',location:'workshop'}
];

/** All stranded supplies exist from the beginning; objectives reveal places, never grant items. */
export const NAMED_STARTING_SUPPLIES=NAMED_CONCEPTS.filter(c=>c.id!=='cart'&&!NAMED_RECIPES.some(r=>r.result===c.id)).map(c=>c.id);
export type RoverSlot='wheels'|'engine'|'charger'|'radio';
export const ROVER_SLOTS:{id:RoverSlot;label:string;kind:string;required:boolean;reuseReason:string}[]=[
 {id:'wheels',label:'Wheels',kind:'wheels',required:true,reuseReason:'Legacy chassis can still receive missing wheels.'},
 {id:'engine',label:'Motor',kind:'motor',required:true,reuseReason:'A legacy Cart may still need a motor.'},
 {id:'charger',label:'Solar charger',kind:'solar-charger',required:true,reuseReason:'Solar radio, solar lamp and solar heater still use the charger.'},
 {id:'radio',label:'Radio',kind:'radio',required:false,reuseReason:'The solar-radio recipe still uses a working radio.'}
];
/** Static content audit only; model.hasFurtherUse checks whether these unique results remain unmade. */
export function hasAuthoredUse(kind:string):boolean{return NAMED_RECIPES.some(r=>r.a===kind||r.b===kind)||NAMED_GOALS.some(g=>g.concept===kind);}
