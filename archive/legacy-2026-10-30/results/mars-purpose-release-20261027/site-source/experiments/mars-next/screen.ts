import assert from 'node:assert/strict';
import {create,step,hasCapability,goals,satisfiesGoal,recipes,supplies} from './model.ts';
import type {State,Action} from './model.ts';
const traces:{name:string;actions:Action[];final:State}[]=[];
function run(name:string,catalyst:boolean,heated:boolean,earlyRover:boolean){let s=create();const actions:Action[]=[];const act=(a:Action)=>{const r=step(s,a);assert(r.accepted,`${name}: ${JSON.stringify(a)}: ${r.message}`);if(a.type==='advance')assert.deepEqual(r.state.tokens,s.tokens,'advancing grants no items and resets no positions');s=r.state;actions.push(a);};const c=(a:string,b:string)=>act({type:'combine',a,b}),p=(kind:string,location:string|null)=>act({type:'place',kind,location});
 c('broken-radio','cable');c('solar-panel','battery');c('solar-charger','radio');assert(!s.tokens.some(t=>t.kind==='radio'));c('solar-radio','dish');assert(!s.tokens.some(t=>t.kind==='solar-radio'));assert(hasCapability(s.tokens.find(t=>t.kind==='long-range-radio')!,'solar-radio'));
 if(earlyRover){c('frame','wheels');c('long-range-radio','rover');c('motor','rover');c('solar-charger','rover');p('rover','contact-ridge');}else p('long-range-radio','contact-ridge');
 act({type:'advance'});
 if(catalyst){p('canister','glacier');c('heater','canister');c('meltwater-canister','water-filter');}else{c('heater','place:glacier');c('meltwater','water-filter');c('filtered-water','canister');}
 c('seeds','planting-tray');c('water-canister','seed-tray');c('watered-seed-tray','place:warm-habitat');c('sprouted-tray','clear-cover');c('habitat-fabric','sealant');
 act({type:'advance'});
 if(heated){c('propagator','heater');c('frame','heated-propagator');assert(!s.tokens.some(t=>t.kind==='heated-propagator'));}else{c('frame','propagator');assert(!s.tokens.some(t=>t.kind==='propagator'));}
 c('frame','toolkit');c('solar-charger','lamp');c('workbench','solar-lamp');assert(!s.tokens.some(t=>t.kind==='solar-lamp'||t.kind==='workbench'));assert(s.tokens.some(t=>t.kind==='solar-charger'),'future Rover and heater must retain charger');
 c('solar-charger','heater'); // its final other recipe use; future Rover slot must retain it
 if(!earlyRover){assert(s.tokens.some(t=>t.kind==='solar-charger'));c('frame','wheels');c('motor','rover');c('solar-charger','rover');c('long-range-radio','rover');}
 assert(!s.tokens.some(t=>t.kind==='solar-charger'),'charger absorbed once all real uses are satisfied');
 assert(goals.every(g=>s.achieved.includes(g.id)));assert(goals.filter(g=>g.kind==='function').every(g=>satisfiesGoal(s,g)));assert(s.tokens.some(t=>t.kind==='water-filter'),'filter is a tool');
 traces.push({name,actions,final:s});
}
for(const catalyst of [false,true])for(const heated of [false,true])for(const earlyRover of [false,true])run(`${catalyst?'source-catch':'loose-water'}-${heated?'heated':'plain'}-${earlyRover?'early-rover':'late-rover'}`,catalyst,heated,earlyRover);
const s=create();assert.equal(s.tokens.length,supplies.length);assert(!step(s,{type:'combine',a:'heater',b:'canister'}).accepted,'catalyst not valid away from source');assert(!step(s,{type:'combine',a:'heater',b:'canister',at:'glacier'}).accepted,'cannot spoof setting');assert(s.tokens.some(t=>t.kind==='cable'),'ordinary unused ingredient not blanket deleted');
console.log(JSON.stringify({scope:'Authored logical routes, not fresh play or fun evidence',recipes:recipes.length,starts:supplies.length,routes:traces},null,2));
