/** Final merged-source replay of author Solar probes, plus reviewed asymmetric branch challenges.
 * Genuine LIVE86 prefixes reconstructed by exact inverse ledgers; no native/human claim. */
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {scenario as actual} from '../experiments/tangible-campaign/ui/campaigns/mars-return-cargo.ts';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import {validateContentLifecycles,validateConstructionContinuity,validateObjectiveFlow} from '../experiments/tangible-campaign/schema/lifecycle.ts';
import {beforeReviewedGraphAmendments} from '../experiments/tangible-campaign/integration/reviewed-graph-amendments.ts';
import {beforeRetainedAnomalies} from '../experiments/tangible-campaign/integration/retained-anomaly-successor.ts';
import {beforeSolarLampContinuity} from '../experiments/tangible-campaign/integration/solar-lamp-continuity.ts';
import {beforeMarsNaturalOrders} from '../experiments/tangible-campaign/integration/mars-natural-orders.ts';
import {currentMarsRouteActions} from '../experiments/tangible-campaign/integration/current-mars-route-actions.ts';
test('Solar continuity: actual final source, six real old-light continuations and asymmetric future signaling branches',()=>{
const base=beforeMarsNaturalOrders(beforeSolarLampContinuity(beforeRetainedAnomalies(beforeReviewedGraphAmendments(actual))));
const candidate=actual,route=JSON.parse(readFileSync(new URL('../experiments/tangible-campaign/evidence/'+base.id+'-route-evidence.json',import.meta.url),'utf8')).actionsLog;
const c=(a,b)=>({type:'combine',a,b}),amended=currentMarsRouteActions(route),report={appliedSourceContract:'actual final imported scenario, no substituted candidate'};
const step=(s,g,a)=>{const r=M.applyAction(s,g,a);assert(r.accepted,JSON.stringify(a)+': '+r.message);return r.game;};
const checks=[...M.validateScenario(candidate),...validateContentLifecycles([candidate]),...validateConstructionContinuity([candidate]),...validateObjectiveFlow([candidate])];assert.deepEqual(checks,[]);report.schemaAndLifecycle='pass';
let g=M.replay(candidate,amended);assert(g.state.completed);report.fullRoute={completed:g.state.completed,combinations:g.state.metrics.combinations,actions:amended.length};
const beacon=[c('broken-radio','cable'),c('reflective-foil','support-frame'),c('lamp','battery'),c('lantern','reflector'),c('signal-lamp','tripod'),{type:'place',item:'signal-beacon',location:'contact-ridge'},{type:'advance'}];
let stage=0,firstHabitat=true;
for(const raw of amended){const a=structuredClone(raw);if(stage>0){if(stage===1&&firstHabitat){beacon.push(c('solar-panel','battery'));firstHabitat=false;}if(stage===1&&a.type==='place'&&a.location==='refuge-contact-mast')a.item='signal-beacon';if(stage===7&&a.type==='combine'&&a.a==='solar-radio')beacon.push(c('radio','solar-charger'));beacon.push(a);}if(a.type==='advance')stage++;}
g=M.replay(candidate,beacon);assert(g.state.completed);report.freshBeaconFirstCompletes='pass';
for(const cp of candidate.checkpoints)assert(M.checkpoint(candidate,cp.id));report.checkpoints=candidate.checkpoints.length;
g=M.checkpoint(candidate,'chapter-8');assert(!M.token(g.state,'solar-lamp'));assert.equal(M.token(g.state,'lamp').area,'area-camp');assert.equal(M.token(g.state,'solar-charger').area,'area-camp');assert(g.state.arrival.carried.some(x=>x.item==='lamp'));assert(!g.state.arrival.supplies.some(x=>x.item==='lamp'||x.item==='solar-lamp'||x.item==='solar-charger'));report.campRealPartsCarry='pass';
for(const reverse of [false,true]){let q=step(candidate,g,c(reverse?'solar-charger':'lamp',reverse?'lamp':'solar-charger'));assert(M.token(q.state,'solar-lamp'));assert(M.token(q.state,'solar-charger'));assert.deepEqual(M.undo(q).game.state.tokens,g.state.tokens);assert.deepEqual(M.restore(candidate,JSON.stringify(q)).state.tokens,q.state.tokens);}report.reverseUndoRestore='pass';
const early=route.flatMap(a=>a.type==='combine'&&[a.a,a.b].includes('solar-lamp')?[a]:a.type==='combine'&&[a.a,a.b].includes('solar-panel')?[a,c('lamp','solar-charger')]:[a]);
g=M.replay(candidate,early);assert(g.state.completed);assert.equal(g.events.filter(e=>e.created==='solar-lamp').length,1);assert.equal(g.events.find(e=>e.created==='solar-lamp').stage,0);report.earlyCreationCompletes='pass';
const oldCamp=M.checkpoint(base,'chapter-8'),restored=M.restore(candidate,JSON.stringify(oldCamp));assert.deepEqual(restored.state.tokens,oldCamp.state.tokens);assert(M.token(restored.state,'solar-lamp'));report.oldCampFinishedLampPreserved='pass';
// Make the old inventory exhaust its two original Lamp uses in the reverse order:
// inspect the glovebox first, then build the beacon, before arriving at camp.
g=M.checkpoint(base,'chapter-4');
g=step(base,g,c('windowed-box','glove-ports'));
g=step(base,g,{type:'visit',area:'area-signal',carry:[]});
g=step(base,g,{type:'visit',area:'area-outcrop',carry:['lamp']});
g=step(base,g,c('glovebox','lamp'));
g=step(base,g,{type:'visit',area:'area-habitat',carry:['lamp','tripod']});
g=step(base,g,{type:'visit',area:'area-rover',carry:['lamp','battery','tripod']});
g=step(base,g,{type:'visit',area:'area-signal',carry:['lamp','battery','tripod','support-frame']});
g=step(base,g,c('lamp','battery'));assert(!M.token(g.state,'lamp'));
g=step(base,g,c('reflective-foil','support-frame'));
g=step(base,g,c('lantern','reflector'));
g=step(base,g,c('signal-lamp','tripod'));
g=step(base,g,{type:'visit',area:'area-outcrop',carry:['tripod']});
const oldPreCamp=structuredClone(g);
g=M.restore(candidate,JSON.stringify(g));
for(const a of route.slice(base.checkpoints.find(cp=>cp.id==='chapter-4').actions.length)){if(candidate.stages[g.state.stage].id==='camp')break;g=step(candidate,g,a);}
assert(!M.token(g.state,'lamp'));assert(!M.token(g.state,'solar-lamp'));assert(M.token(g.state,'signal-beacon'));report.oldConsumedLampSave={restores:true,lampAbsent:true,beaconPresent:true};
const stageActions=id=>{let n=0;return route.filter(a=>{const here=base.stages[n].id===id;if(a.type==='advance')n++;return here&&a.type!=='advance';});};
report.oldPoweredLightVariants=[];
for(const light of ['lantern','signal-lamp','signal-beacon'])for(const reverse of [false,true]){
 // Each old state is an actually accepted prefix of the above old-save witness.
 let old=structuredClone(oldPreCamp);
 while(old.state.discovered.includes('signal-beacon')&&light!=='signal-beacon')old=M.undo(old).game;
 if(light==='lantern')while(old.state.discovered.includes('signal-lamp'))old=M.undo(old).game;
 if(old.state.currentArea!=='area-outcrop')old=step(base,old,{type:'visit',area:'area-outcrop',carry:M.token(old.state,'tripod')?.area===old.state.currentArea?['tripod']:[]});
 // Advance old LIVE86 rules only to rescue, then restore before its camp delivery.
 for(const a of route.slice(base.checkpoints.find(cp=>cp.id==='chapter-4').actions.length)){if(base.stages[old.state.stage].id==='rescue'&&M.stageComplete(base,old.state))break;old=step(base,old,a);}
 assert(!M.token(old.state,'lamp'));assert(M.token(old.state,light));
 let q=M.restore(candidate,JSON.stringify(old));q=step(candidate,q,{type:'advance'});assert.equal(q.state.stage,7);assert(!M.token(q.state,'solar-lamp'));assert.equal(M.token(q.state,light).area,'area-camp');
 assert(!q.state.arrival.carried.some(x=>['battery','reflective-foil','support-frame','tripod'].includes(x.item)));
 q=step(candidate,q,c('worktop','bench-legs'));
 const before=q,a=light==='signal-beacon'?c(reverse?'signal-beacon':'workbench',reverse?'workbench':'signal-beacon'):c(reverse?'lamp-bracket':light,reverse?light:'lamp-bracket');
 if(light==='lantern'){
  // Actual camp state, not injected pieces: the signal upgrade keeps a bench alternative.
  let branch=step(candidate,before,{type:'visit',area:M.token(before.state,'reflector').area,carry:['lantern']});
  branch=step(candidate,branch,c(reverse?'reflector':'lantern',reverse?'lantern':'reflector'));
  assert(!M.token(branch.state,'lantern'));assert(M.token(branch.state,'signal-lamp'));
  branch=step(candidate,branch,{type:'visit',area:'area-camp',carry:['signal-lamp']});
  branch=step(candidate,branch,c('signal-lamp','lamp-bracket'));assert(M.token(branch.state,'bench-lamp'));
 }
 q=step(candidate,q,a);assert.deepEqual(M.undo(q).game.state.tokens,before.state.tokens);assert.deepEqual(M.restore(candidate,JSON.stringify(q)).state.tokens,q.state.tokens);
 if(light!=='signal-beacon'){assert(M.token(q.state,'bench-lamp').components.includes(light));q=step(candidate,q,c('workbench','bench-lamp'));}
 assert(M.token(q.state,'lit-workbench').components.includes(light));
 assert.equal(M.applyAction(candidate,q,a).accepted,false);
 if(light==='lantern'){
  // Bench construction must not destroy the independent not-yet-made beacon route.
  assert(M.token(q.state,'lantern'));assert(!q.state.discovered.includes('signal-beacon'));
  let branch=step(candidate,q,{type:'visit',area:M.token(q.state,'reflector').area,carry:['lantern']});
  branch=step(candidate,branch,c('lantern','reflector'));assert(!M.token(branch.state,'lantern'));
  branch=step(candidate,branch,{type:'visit',area:M.token(branch.state,'tripod').area,carry:['signal-lamp']});
  branch=step(candidate,branch,c('signal-lamp','tripod'));assert(M.token(branch.state,'signal-beacon'));assert(M.token(branch.state,'lit-workbench'));
 }
 for(const a of stageActions('camp').filter(a=>!(a.type==='combine'&&(['worktop','solar-lamp','bench-lamp'].includes(a.a)||a.b==='bench-lamp'))))q=step(candidate,q,a);
 assert(M.stageComplete(candidate,q.state));q=step(candidate,q,{type:'advance'});
 for(const a of route.slice(base.checkpoints.find(cp=>cp.id==='chapter-9').actions.length)){q=step(candidate,q,a);}
 assert(q.state.completed);const bench=M.token(q.state,'lit-workbench');assert.equal(bench.slots.machine,'guarded-machine');assert(bench.components.includes(light));
 report.oldPoweredLightVariants.push({light,reverse,completed:true,preservedLight:true,retainedOutside:!!M.token(q.state,light)});
}
mkdirSync(new URL('../results/playtest-repairs-20261028/',import.meta.url),{recursive:true});writeFileSync(new URL('../results/playtest-repairs-20261028/solar-lamp-current-probe.json',import.meta.url),JSON.stringify(report,null,2)+'\n');

});
