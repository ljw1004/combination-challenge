import assert from 'node:assert/strict';
import {create,step,goals,satisfiesGoal,recipes,supplies,hasCapability} from './model.ts';
import type {Action} from './model.ts';
const routes=[];
for(const optical of [false,true])for(const binocular of [false,true])for(const sealFirst of [false,true])for(const contained of [false,true]){
 let s=create();const actions:Action[]=[];const act=(a:Action)=>{const r=step(s,a);assert(r.accepted,`${JSON.stringify(a)}: ${r.message}`);if(a.type==='advance')assert.deepEqual(r.state.tokens,s.tokens);s=r.state;actions.push(a);};const c=(a:string,b:string)=>act({type:'combine',a,b}),p=(kind:string,location:string|null)=>act({type:'place',kind,location}),advance=()=>act({type:'advance'});
 c('broken-radio','cable');
 if(optical){c('battery','lamp');c('foil','frame');c('lantern','reflector');c('signal-lamp','tripod');p('signal-beacon','contact-ridge');}else{c('solar-panel','battery');c('solar-charger','radio');p('solar-radio','contact-ridge');}
 advance();p('canister','glacier');c('heater','canister');c('meltwater-canister','water-filter');c('seeds','planting-tray');c('water-canister','seed-tray');c('watered-seed-tray','place:warm-habitat');c('sprouted-tray','clear-cover');c('habitat-fabric','sealant');advance();
 if(optical){c('solar-panel','battery');c('solar-charger','radio');}
 c('solar-radio','dish');c('frame','wheels');c('motor','rover');c('solar-charger','rover');c('long-range-radio','rover');
 if(binocular){p('map','overlook');c('binoculars','map');}else{c('camera','tripod');c('field-camera','place:overlook');c('panorama','map');}
 advance();c('scoop','place:glacier');if(sealFirst)c('ice-sample','sample-jar');
 if(contained){c('sealed-box','gloves');c('glovebox','lamp');c('illuminated-glovebox','camera');c(sealFirst?'sealed-ice-sample':'ice-sample','imaging-glovebox');}else c(sealFirst?'sealed-ice-sample':'ice-sample','camera');
 if(!sealFirst)c('ice-sample','sample-jar');c('lens','tube');c('telescope','tripod');c('field-telescope','camera');c('telescope-camera','place:distant-lookout');c('cliff-photograph','survey-map');
 assert(goals.every(g=>s.achieved.includes(g.id)));assert(goals.filter(g=>g.kind==='function').every(g=>satisfiesGoal(s,g)));assert(!s.tokens.some(t=>t.kind==='survey-map'||t.kind==='ice-sample'));assert(s.tokens.some(t=>hasCapability(t,'route-map')));assert.equal(s.level,3);assert(s.tokens.some(t=>t.kind==='water-filter'));
 routes.push({name:[optical?'optical':'radio',binocular?'binocular':'panorama',sealFirst?'seal-first':'photo-first',contained?'contained':'ordinary-photo'].join('-'),operations:s.actions,actions,final:s});
}
console.log(JSON.stringify({scope:'Whole retained-world authored routes, not fresh player or human-fun evidence',starts:supplies.length,recipes:recipes.length,routes},null,2));
