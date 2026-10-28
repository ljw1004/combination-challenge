import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {create,step,goals,hasCapability,satisfiesGoal,supplies} from '../../experiments/mars-remote-next/model.ts';
import type {Action} from '../../experiments/mars-remote-next/model.ts';
const reports=[];
for(const optical of [false,true])for(const binocular of [false,true])for(const sealFirst of [false,true])for(const contained of [false,true]){
 let s=create();const trace:Action[]=[];assert.equal(s.tokens.length,29);assert.deepEqual(s.tokens.map(t=>t.kind),supplies);
 const act=(a:Action)=>{const r=step(s,a);assert.ok(r.accepted,JSON.stringify({a,message:r.message,optical,binocular,sealFirst,contained}));s=r.state;trace.push(a);};
 const c=(a:string,b:string)=>act({type:'combine',a,b}),p=(kind:string,location:string)=>act({type:'place',kind,location}),advance=()=>act({type:'advance'});
 c('broken-radio','cable');
 if(optical){c('battery','lamp');c('foil','frame');c('lantern','reflector');c('signal-lamp','tripod');p('signal-beacon','contact-ridge');assert.ok(!s.tokens.some(t=>t.kind==='solar-charger'));}
 else {c('solar-panel','battery');c('solar-charger','radio');p('solar-radio','contact-ridge');}
 advance();c('heater','place:glacier');c('meltwater','water-filter');c('filtered-water','canister');c('seeds','planting-tray');p('seed-tray','warm-habitat');c('water-canister','seed-tray');c('sprouted-tray','clear-cover');c('habitat-fabric','sealant');advance();
 if(optical){c('solar-panel','battery');c('solar-charger','radio');}
 c('solar-radio','dish');c('frame','wheels');c('long-range-radio','rover');c('motor','rover');c('solar-charger','rover');
 const rover=s.tokens.find(t=>t.kind==='rover')!;assert.ok(hasCapability(rover,'long-range-radio'));assert.ok(hasCapability(rover,'solar-travel'));
 if(binocular){p('map','overlook');c('binoculars','map');}else {c('camera','tripod');c('field-camera','place:overlook');c('panorama','map');}
 assert.ok(!s.tokens.some(t=>t.kind==='map'));advance();
 c('scoop','place:glacier');if(sealFirst)c('ice-sample','sample-jar');
 if(contained){c('sealed-box','gloves');c('glovebox','lamp');c('illuminated-glovebox','camera');c(sealFirst?'sealed-ice-sample':'ice-sample','imaging-glovebox');}else c(sealFirst?'sealed-ice-sample':'ice-sample','camera');
 if(!sealFirst)c('ice-sample','sample-jar');
 c('lens','tube');c('telescope','tripod');c('field-telescope','camera');c('telescope-camera','place:distant-lookout');c('cliff-photograph','survey-map');
 assert.ok(!s.tokens.some(t=>t.kind==='survey-map'));assert.ok(s.tokens.some(t=>hasCapability(t,'route-map')));assert.ok(satisfiesGoal(s,goals.find(g=>g.id==='observations')!));assert.ok(goals.every(g=>s.achieved.includes(g.id)));assert.ok(s.tokens.some(t=>t.kind==='scoop'));assert.ok(s.tokens.some(t=>t.kind==='water-filter'));
 reports.push({optical,binocular,sealFirst,contained,actions:s.actions,trace,achieved:s.achieved,finalKinds:s.tokens.map(t=>t.kind)});
}
writeFileSync(new URL('./whole-route-results.json',import.meta.url),JSON.stringify(reports,null,2));console.log(`${reports.length} independently authored whole routes pass`);
