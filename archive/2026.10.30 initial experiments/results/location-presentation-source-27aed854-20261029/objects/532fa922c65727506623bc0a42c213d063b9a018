import type {Action} from '../../schema/campaign.ts';
import {scenario as previous} from './mars-return-cargo.ts';
import {physicalLocationSuccessor} from './physical-location-plan.ts';
import {streamlineMarsObservations} from './mars-observation-chains.ts';
/** Eighteen real places. Rescue and ascent contain earned internal travel, not chapter resets. */
export const scenario=physicalLocationSuccessor(previous,'mars','mars-persistent-locations-v5');
const location=(id:string)=>scenario.locationPlan!.locations.find(l=>l.id===id)!;
const chapter=(id:string)=>scenario.chapters.find(c=>c.id===id)!;
// Batch provenance must describe the real source, not its former chapter grant.
const provenance:Record<string,[string,string]>={
 'outcrop-cache@M03':['Expedition sampling equipment','The cargo sled already holds the scoop, jar, core tube, labels and scale card, with the handling enclosure, glove ports and specimen rack packed beside them.'],
 'rescue-cache@M07':['Crawler recovery equipment','The crew wait in the intact crawler cabin. Its service compartment holds the spare drive and towing equipment.'],
 'cargo-return-cache@M07':['Crew belongings','Protective furniture padding and the crew’s picture roll are aboard the crawler, ready to come with the crew to camp.'],
 'rescue-cache@M08':['Refuge stores','The service refuge has bedding, a folding bed, soup and an insulated flask. The shelter needs preparation before the recovered crew can settle inside.'],
 'night-cache@M08':['Camp thermal equipment','The camp service station already holds the wall sample, measured template and removable screen kit. Its thermal chamber is part of the same camp.'],
 'crossing-cache@M12':['Channel survey kit','The field station holds the ground probe, map overlay and crossing marker for the coming channel survey.'],
 'buried-story-cache@M12':['Basin field equipment','The field station stores the core drill and liner, sample cradle, vial and log, with the microscope, spectrometer, calibration target and balance for the basin work.'],
 'contrast-cache@M12':['Geology comparison kit','The field station’s comparison kit contains the board, two-cell case, impression sheet and document sleeve. A chip from the gravel ledge must still be collected there.'],
 'departure-cache@M16':['Return-cargo and handover equipment','The ascent depot holds the return-cargo protection, archive materials and camp-handover equipment, ready to take back for the final packing.'],
 'homebound-cache@M16':['Ascent equipment','The qualified ascent stage, receiver latch, cargo adapter, telemetry recorder and launch key wait at the depot. The orbiter remains at the remote rendezvous.'],
};
for(const location of scenario.locationPlan!.locations)for(const batch of location.stockBatches){const revised=provenance[batch.id];if(revised){batch.label=revised[0];batch.narrative=revised[1];}}


// The old destination tile was present at the surface. The successor uses the
// existing hotspot-operand grammar at the actual earned orbital destination.
scenario.items=scenario.items.filter(i=>i.id!=='orbital-cabin');
scenario.hotspots.push({id:'orbital-cabin',label:'Waiting orbital cabin',description:'The orbiter’s docking interface is here in orbit. It becomes reachable only after the supervised ascent reaches the agreed rendezvous.'});
location('M16').hotspots=location('M16').hotspots.filter(h=>h!=='orbital-hatch');
location('M18').hotspots=['orbital-cabin','orbital-hatch'];
const docking=scenario.recipes.find(r=>r.id==='homebound-12-docked-vehicle')!;
docking.b='@orbital-cabin';delete docking.lifecycle!['orbital-cabin'];
docking.description='At the agreed orbital rendezvous, the ascending vehicle docks with the waiting cabin. Its actual specimen cargo stays fitted.';

// This specimen is earned from the visible ledge, never handed out with a chapter.
scenario.recipes.push({id:'collect-gravel-chip',a:'sample-scoop',b:'@gravel-window',out:'loose-gravel-chip',description:'Use the scoop to lift an already loose chip from the gravel ledge, keeping this source separate from the core.',lifecycle:{'sample-scoop':{role:'retain',reason:'The existing field scoop collects the loose chip and remains reusable.'}}});

const campCarry=[
 'crawler','towed-crawler','rover','toolkit','recovery-rope','tow-eye','spare-drive','drive-coupling','serviced-drive','replacement-drive','tow-line',
 'pressure-patch','heater','lamp','solar-charger','solar-lamp','lantern','signal-lamp','signal-beacon','bench-lamp','workbench','lit-workbench',
 'radio','solar-radio','dish-antenna','long-range-radio','crew-message','message-home','provisioned-refuge','occupied-refuge','rest-refuge',
 'soup-flask','warm-soup','prepared-soup','insulated-flask','folding-bed','bedding','service-shelter','sealed-refuge','warm-refuge','prepared-bed',
 'crew-table-portrait','message-camera','shared-supper','personal-table','picture-roll','mess-table','recovered-mess-crate','padded-recovery-sling','sled-padding',
 'insulation-comparison','cooling-trace','temperature-logger','wall-coupon','insulated-cooling-trace','insulated-coupon','insulation-swatch',
 'screened-cabin','thermal-screen','fitted-blanket','wall-template','thermal-blanket','clip-frame',
];
chapter('rescue').travel={id:'crawler-to-recovery-camp',afterCreated:['crawler','towed-crawler'],locationId:'M08',carry:campCarry,entryCue:{id:`${scenario.id}:crawler-to-recovery-camp:entry-v1`,mode:'arrival-and-beat',format:'silent-title-card',voice:'Expedition journal',sourceCaption:'Recovery camp',text:`${location('M08').travelText}\n\nThe crew and their belongings are with us. I can prepare the refuge now, then make this a place to recover.`}};
// The internal arrival has already introduced camp and all ordinary camp stock.
chapter('camp').entryCue!.mode='beat';
chapter('camp').entryCue!.text='Everyone is warm and fed. I can finally make us a place to work—and let our families hear us.';
chapter('camp').motivation=chapter('camp').entryCue!.text;
chapter('homebound').travel={id:'ascent-to-orbital-rendezvous',afterCreated:['ascending-vehicle'],locationId:'M18',carry:['ascending-vehicle'],entryCue:{id:`${scenario.id}:ascent-to-orbital-rendezvous:entry-v1`,mode:'arrival-and-beat',format:'radio',voice:'Orbital control',sourceCaption:'Orbital rendezvous',text:'The surface falls away. At the agreed rendezvous, the waiting orbiter is finally in front of us.\n\nWe have you in sight. Bring your ship alongside; the hatch is waiting.'}};

// Preserve every old checkpoint as an old-world route. Only these new-world
// routes add the actual sample collection and address the real orbital hotspot.
scenario.checkpoints=scenario.checkpoints?.map(checkpoint=>({...checkpoint,actions:checkpoint.actions.flatMap(action=>{
 const out:Action[]=[];
 if(action.type==='combine'&&[action.a,action.b].includes('loose-gravel-chip'))out.push({type:'combine',a:'sample-scoop',b:'@gravel-window'});
 out.push(action.type==='combine'&&action.b==='orbital-cabin'?{...action,b:'@orbital-cabin'}:action);
 return out;
})}));
scenario.notes!.push('The two genuine within-chapter journeys are earned by either repaired/towed crawler recovery and by the actual ascent creation. The orbital destination is a hotspot, not a surface inventory grant. Loose gravel is collected with the existing scoop. Other recipe families and objective metadata are retained.');
streamlineMarsObservations(scenario);
