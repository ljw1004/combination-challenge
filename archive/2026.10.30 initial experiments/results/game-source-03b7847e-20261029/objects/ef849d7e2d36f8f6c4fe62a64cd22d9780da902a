import type {Action,Recipe,Scenario} from '../../schema/campaign.ts';
import {scenario as survival} from './mars-field-scenes.ts';

/** Isolated OPTIONAL fiction. Never mutate the current survival world or its saves. */
export const scenario:Scenario=structuredClone(survival);
const s=scenario;
s.id='mars-creature-field-scenes-v3';
s.title='Mars: The Creature in the Ice · Optional story';
s.premise='An optional fictional Mars journey: rescue the crew, investigate an ice core and bring an extraordinary specimen home. This imagined creature is not a report of real Martian life.';
const item=(id:string)=>s.items.find(i=>i.id===id)!;
const recipe=(id:string)=>s.recipes.find(r=>r.id===id)!;
const chapter=(id:string)=>s.chapters.find(c=>c.id===id)!;
const cue=(id:string,text:string)=>{const c=chapter(id);c.entryCue!.text=text;c.motivation=text;};
for(const c of s.chapters){c.entryCue!.id=c.entryCue!.id.replace(survival.id,s.id);if(c.travel)c.travel.entryCue.id=c.travel.entryCue.id.replace(survival.id,s.id);}

// The specimen is physically the ice and its original mission sampling tube.
// Qualified cold protection is supplied equipment, not another construction task.
Object.assign(item('core-tube'),{label:'Sealed core tube',description:'The mission sampling tube includes a clear sealed liner and a powered protective sleeve. Its matched expedition and return-cargo connections keep a collected core protected without opening it.'});
Object.assign(item('ice-core'),{description:'The original ice core inside its sealed sampling tube and protective sleeve. We keep this specimen with the expedition for examination at the field laboratory.'});
const collect=recipe('outcrop-11-ice-core');
collect.description='Take a short core into the mission tube and close its seal. The protected core stays with us for the field laboratory.';
collect.lifecycle={'core-tube':{role:'incorporate',exclusive:true,reason:'The one mission sampling tube now contains this actual ice core. Its sealed liner and protective sleeve stay visibly with the specimen; no empty duplicate tube remains.'}};
collect.preserve=['core-tube'];
for(const l of s.locationPlan!.locations)for(const b of l.stockBatches)if(b.items.includes('core-tube'))b.narrative='At the outcrop, the sampling case holds the scoop and sealed core tube, with the handling enclosure and glove ports packed beside them. The core tube has its own mission protective sleeve.';

s.items.push({id:'creature-core',label:'Creature in ice',description:'The same sealed ice core from the outcrop. Close inspection reveals a small articulated creature inside it; the core and its protective tube have not been opened or replaced. A fictional discovery: its age, origin and viability are not established.'});
const inspect=(id:string,instrument:string):Recipe=>({id,a:'ice-core',b:instrument,out:'creature-core',description:'Through the sealed tube, the small shape resolves into a curled body with jointed limbs. The creature remains inside the original protected core.',lifecycle:{'ice-core':{role:'transform',exclusive:true,reason:'This is the same physical core, now recognised as containing a creature. Its tube, protection and position survive; it is not a new evidence token or another specimen.'},[instrument]:{role:'retain',reason:'The existing illuminated instrument reveals detail through the sealed tube and remains available for the other field observations.'}},preserve:['ice-core']});
s.recipes.push(inspect('ice-creature-microscope','lit-microscope'),inspect('ice-creature-glovebox','illuminated-glovebox'));
// The meaning of the specimen can change before its layer photograph is made.
// The photograph remains one record, regardless of discovery order/camera choice.
for(const [id,camera]of [['creature-core-photograph','camera'],['creature-core-field-photograph','field-camera']] as const)s.recipes.push({id,a:'creature-core',b:camera,out:'core-profile',description:'Photograph the layers in the same sealed core without consuming the creature or its tube.',lifecycle:{'creature-core':{role:'retain',reason:'Photographing the specimen leaves the original core and its creature intact for return.'},[camera]:{role:'retain',reason:'The existing camera remains available after making the photograph.'}}});

// Continue one explicitly kept scientific load through real journeys, not an
// old-object grant when the laboratory chapter begins. Normal visit work stays
// state-sensitive; carryAlong only adds this single specimen in either state.
const afterOutcrop=s.locationPlan!.visits.findIndex(v=>v.chapterIds.includes('outcrop'));
for(const v of s.locationPlan!.visits.slice(afterOutcrop+1))v.carryAlong=['ice-core','creature-core'];
chapter('rescue').travel!.carry.push('ice-core','creature-core');
cue('outcrop','Exposed ice interrupts the route. I will keep a sealed core with our equipment so we can examine it properly at the field laboratory.');
chapter('outcrop').completionText='The sealed core and its layer photograph are secure; the cliff has given our map more detail.';
for(const id of ['outcrop-14-core-profile','outcrop-core-photograph-field-camera'])recipe(id).lifecycle!['ice-core'].reason='Photographing leaves the original sealed core intact; it continues with the expedition for field-laboratory examination and return.';
cue('camp','Everyone is warm and fed. Our equipment and the protected core are here too. I can make us a place to work—and let our families hear us.');
cue('buried-story','The field microscope is ready. I can examine the ice core we kept from the outcrop, then record what this basin has preserved.');
const lab=chapter('buried-story');
lab.objectives.unshift({id:'lab-examine-ice-core',kind:'create',item:'creature-core',text:'Examine ice core',intermediate:true});
lab.objectives.find(o=>o.id==='buried-story-goal-0')!.after!.push('lab-examine-ice-core');
lab.completionText='The little creature stays inside its sealed core. We have kept the basin observations too. I want to bring both home.';
cue('depot-way','We have a crew to bring home, and something extraordinary in our core. The old depot route may lead us to a ship.');

// Replace the ordinary ice jar in the EXISTING return conveyance. Do not add a
// duplicate capsule or make a generic life-proof product.
const capsule=item('cushioned-capsule');
capsule.slots!.find(sl=>sl.id==='ice')!.accepts=['creature-core'];
capsule.description='The same protected return capsule. Its matched ice-core bay keeps the original sealed tube protected beside the separately contained sediment and field records.';
item('return-capsule').description='The mission return capsule at the ascent depot has a matched protected ice-core bay and separate compartments for the other specimens and records.';
const pack=recipe('departure-pack-ice');
pack.b='creature-core';pack.install!.component='creature-core';
pack.description='Fit the original sealed creature-bearing core into the return capsule’s matched bay. The same specimen is now aboard the return load.';
pack.lifecycle={'cushioned-capsule':{role:'retain',reason:'The existing return capsule receives the real specimen, without being replaced.'},'creature-core':{role:'incorporate',reason:'The actual creature-bearing ice core moves into the capsule; its sealed sampling tube remains part of that same return cargo.'}};pack.preserve=['creature-core'];
chapter('departure').objectives.find(o=>o.id==='departure-goal-1')!.text='Prepare the core for return';
cue('departure','Our crew is ready to leave. I want the creature’s sealed core aboard, the portrait saved, and this camp useful to whoever follows us.');
chapter('departure').completionText='The creature’s core, our records and the crew portrait are ready for the journey. The handover beacon will guide whoever comes next.';
cue('homebound','We have the rendezvous. Bring everyone—and that sealed core—home. We will be waiting at the hatch.');
chapter('homebound').objectives[0].text='Bring crew and core to the orbiter';
chapter('homebound').completionText='We’re through the orbiter’s hatch together. In the docked ship, the little creature is still inside its sealed core, beside our records and the picture from our table. The light that answered us has become our way home.';
chapter('homebound').onAlreadyComplete={mode:'bridge',text:'We are through the orbiter’s hatch together. The creature’s sealed core and our crew portrait are coming home too.'};
s.milestones!.push({id:'mars-ice-creature',item:'creature-core',when:'created',title:'A creature in the ice',text:'A small, jointed body. Still inside our sealed core.',eyebrow:'A discovery',artwork:{src:'assets/discoveries/mars-ice-creature.png',alt:'A small curled creature with jointed limbs, embedded inside the expedition’s sealed ice core. Fictional game illustration.',width:1123,height:1401}});

// Canonical discovery belongs to the actual chapter-17 laboratory investigation.
// The early glovebox route is equally legal and has its own complete test route.
s.checkpoints=s.checkpoints!.map(c=>({...c,actions:c.actions.flatMap(a=>{
 const result:Action[]=[a.type==='combine'&&[a.a,a.b].includes('cushioned-capsule')&&[a.a,a.b].includes('catalogued-ice-sample')?{...a,a:a.a==='catalogued-ice-sample'?'creature-core':a.a,b:a.b==='catalogued-ice-sample'?'creature-core':a.b}:a];
 if(a.type==='combine'&&[a.a,a.b].includes('supported-core')&&[a.a,a.b].includes('lit-microscope'))result.push({type:'combine',a:'ice-core',b:'lit-microscope'});
 return result;
})}));
// Content-only successor: the creature replaces the ordinary return specimen.
// Do not leave a separate mandatory jar/catalogue/photo errand with no later use.
// The scoop stays: it still collects the later geological gravel chip.
const obsoleteItems=new Set(['transparent-jar','sample-labels','ice-sample','sealed-ice-sample','catalogued-ice-sample','ice-photograph','ice-return-capsule']);
const obsoleteRecipes=new Set(['outcrop-0-ice-sample','outcrop-1-sealed-ice-sample','outcrop-2-catalogued-ice-sample','outcrop-3-ice-photograph']);
const pair=(a:string,b:string)=>[a,b].sort().join('|');
const obsoletePairs=new Set(s.recipes.filter(r=>obsoleteRecipes.has(r.id)).map(r=>pair(r.a,r.b)));
s.items=s.items.filter(i=>!obsoleteItems.has(i.id));
s.recipes=s.recipes.filter(r=>!obsoleteRecipes.has(r.id));
chapter('outcrop').objectives=chapter('outcrop').objectives.filter(o=>!['outcrop-goal-0','outcrop-goal-1'].includes(o.id));
for(const l of s.locationPlan!.locations)for(const b of l.stockBatches)b.items=b.items.filter(id=>!obsoleteItems.has(id));
for(const c of s.checkpoints!)c.actions=c.actions.filter(a=>a.type!=='combine'||!obsoletePairs.has(pair(a.a,a.b)));
item('sleeved-comparison').reading!.text=item('sleeved-comparison').reading!.text.replace('We have not established an age or detected life.','The layers preserve a sequence of events; their age remains unknown.');

s.notes=[...(s.notes??[]),'OPTIONAL isolated fiction, not current canon. The late packing-light reveal was rejected. Discovery occurs during laboratory investigation and uses the existing creation milestone. The creature is the original ice core, with its one sealed tube continuously transported and preserved into the return vehicle. No microbial proof, biological-safety claim or real Mars creature is implied.'];

// Coordinated Mars-only authenticity repair; exact input is pinned in review evidence.
// Grain images supply layer order; the spectrum contributes its inconclusive
// result. A second site's photograph contributes nothing to this observation.
s.recipes=s.recipes.filter(r=>r.id!=='buried-story-11-layer-interpretation');
s.items=s.items.filter(i=>i.id!=='layer-interpretation');
const sediment='The basin grain images show a coarse band between two fine layers. Its mineral spectrum remains inconclusive: neither age nor transport agent is established.';
Object.assign(item('sediment-comparison'),{label:'Fine–coarse–fine; spectrum inconclusive',description:sediment,reading:{text:sediment,attribution:'Fictional expedition observations; not a real mission measurement.'}});
recipe('buried-story-10-sediment-comparison').description=sediment;
const basinRecord=recipe('buried-story-12-basin-field-record');
if(basinRecord.a==='layer-interpretation')basinRecord.a='sediment-comparison';if(basinRecord.b==='layer-interpretation')basinRecord.b='sediment-comparison';delete basinRecord.lifecycle!['layer-interpretation'];basinRecord.lifecycle!['sediment-comparison']={role:'retain',reason:'The two basin observations are recorded together with the specimen identity; this does not use another site’s ice photograph.'};
item('basin-field-record').reading!.text='At this core site, a coarse band separates two fine-grained layers. The mineral spectrum remains inconclusive. The specimen log connects these observations to the retained sediment. Age and transport agent remain unresolved; nearby exposures may help test a water-transport explanation.';
recipe('departure-6-complete-field-archive').lifecycle!['core-profile'].reason='The earlier ice-core photograph remains a separately identified record in the return archive.';
const rewriteMars=(a:Action):Action[]=>{
 if(a.type==='combine'&&pair(a.a,a.b)===pair('sediment-comparison','core-profile'))return [];
 if(a.type==='combine')return [{...a,a:a.a==='layer-interpretation'?'sediment-comparison':a.a,b:a.b==='layer-interpretation'?'sediment-comparison':a.b}];return[a];
};
for(const c of s.checkpoints??[])c.actions=c.actions.flatMap(rewriteMars);
// Only the archive still needs the ice photograph. Do not haul it to the basin.
for(const v of s.locationPlan!.visits)if(v.carry&&v.chapterIds.includes('buried-story'))v.carry=v.carry.filter(i=>i!=='core-profile'&&i!=='layer-interpretation');
s.notes!.push('Separate authenticity candidate: remove the unrelated ice-photo gate from the basin observation while retaining that photograph and its return-archive use. Mounted-lamp identity repair is deliberately deferred pending a complete two-use state design.');

