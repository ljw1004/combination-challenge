import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {stepLiving,livingPhysicalKey} from '../experiments/logical-living-works.ts';
import {createLiving3,stepLiving3,living3Goal,living3Actions,living3Rules,observeLiving3,previewLiving3,living3Witness,screenLiving3,replayLiving3} from '../experiments/logical-living-works-3.ts';

test('V1 and V2 stay byte-for-byte frozen; V3 begins all-known with explicit asynchronous schedules and no work',()=>{
 for(const [file,expected]of [['logical-living-works.ts','8647032f9697c901b11302223cc327a370596be3fc6695ec7b74d84bbd83d6d2'],['logical-living-works-2.ts','a3da674164943462dd01431fba6655a632afe43dbe66343978a2db4a0a6f4696']])assert.equal(createHash('sha256').update(readFileSync(new URL(`../experiments/${file}`,import.meta.url))).digest('hex'),expected);
 const s=createLiving3();assert.equal(s.base.known.length,24);assert.deepEqual(s.base.actions,[]);assert.deepEqual(s.base.works,[]);assert.deepEqual(s.base.cells.find(c=>c.id==='A2')!.sourceSchedule,[2,2,0,0]);assert.deepEqual(s.base.cells.find(c=>c.id==='E2')!.sourceSchedule,[0,0,2,2]);assert.equal(s.base.tick,0);assert.equal(living3Goal(s).achieved,false);
});

test('direct routing preserves originals and walking but fails continuous combined identity delivery',()=>{
 const w=living3Witness('direct');assert.equal(w.goal.achieved,false);assert.equal(w.goal.checks.originalsThroughoutCycle,true);assert.equal(w.goal.checks.dryConnectionThroughoutCycle,true);assert.equal(w.goal.checks.continuousCombinedFragments,false);assert.equal(w.goal.cycle!.period,4);assert.deepEqual(w.goal.cycle!.samples.map(s=>s.squareFragment).sort(),[1,1,2,2]);
});

test('broadcast and genuine recirculation both supply every required phase, with no Beacon label requirement',()=>{
 for(const kind of ['broadcast','circulation'] as const){const w=living3Witness(kind);assert.equal(w.goal.achieved,true);assert.equal(w.goal.cycle!.period,4);assert.ok(w.goal.cycle!.samples.every(s=>s.A===1&&s.B===2&&s.squareFragment===3&&s.squareExact===0&&s.squareWater>0&&!!s.dryPath));assert.ok(w.goal.cycle!.samples.some(s=>!s.sourceAOn));assert.ok(w.goal.cycle!.samples.some(s=>!s.sourceBOn));assert.equal(livingPhysicalKey(stepLiving3(w.state,{type:'wait',beats:4}).base),livingPhysicalKey(w.state.base));}
 assert.equal(living3Witness('circulation').state.base.cells.some(c=>c.beacon),false);
});

test('cutting a real storage return breaks continuous delivery without erasing the retained original',()=>{
 const s=living3Witness('circulation').state,cut=stepLiving3(s,{type:'combine',a:'channel',b:'B2',ports:['east']});assert.equal(cut.cycle,null);const later=stepLiving3(cut,{type:'wait',beats:24});assert.equal(later.base.cells.find(c=>c.id==='B1')!.memory,1);assert.equal(living3Goal(later).achieved,false);assert.equal(living3Goal(later).checks.originalsThroughoutCycle,true);
});

test('batched waits inspect every cycle phase, not a favorable endpoint',()=>{
 let s=stepLiving3(living3Witness('broadcast').state,{type:'combine',a:'archive',b:'B1'});s=stepLiving3(s,{type:'wait',beats:24});assert.ok(s.cycle!.samples.some(f=>f.squareFragment===3));assert.ok(s.cycle!.samples.some(f=>f.squareFragment!==3));
 for(let i=0;i<4&&s.base.field.C2.fragment!==3;i++)s=stepLiving3(s,{type:'wait'});
 assert.equal(s.base.field.C2.fragment,3);assert.equal(living3Goal(s).achieved,false);assert.equal(s.base.actions.at(-1)!.type,'wait');
});

test('wrapper sampling and batched-command bookkeeping leave the underlying V1 dynamics exact',()=>{
 let wrapper=createLiving3(),base=structuredClone(wrapper.base);for(const action of living3Witness('broadcast').actions){base=stepLiving(base,action);wrapper=stepLiving3(wrapper,action);assert.deepEqual(wrapper.base,base);}assert.equal(living3Goal(wrapper).achieved,true);
 const before=wrapper.base.actions.length,batched=stepLiving3(wrapper,{type:'wait',beats:24});assert.equal(batched.base.actions.length,before+1);assert.equal(batched.base.tick,wrapper.base.tick+24);
});

test('all 1366 legal forecasts preserve inputs and match exact observations; every witness replays',()=>{
 const screen=screenLiving3();assert.equal(screen.validation.forecasts,1366);assert.equal(screen.validation.inputPreserved,true);assert.equal(screen.validation.replaysExact,true);assert.equal(screen.validation.cycleReplaysExact,true);
 for(const kind of ['direct','broadcast','circulation'] as const){const w=living3Witness(kind);assert.deepEqual(replayLiving3(w.actions),w.state);}
 const s=createLiving3(),before=structuredClone(s),action={type:'combine' as const,a:'archive',b:'B1'};assert.deepEqual(previewLiving3(s,action),{legal:true,...observeLiving3(stepLiving3(s,action))});assert.deepEqual(s,before);
});

test('public onboarding supplies goal/input laws, not player findings or a preferred architecture; early finish is valid',()=>{
 const s=createLiving3(),publicText=JSON.stringify({rules:living3Rules(),view:observeLiving3(s)});assert.doesNotMatch(publicText,/prior player|previous players|experienced player|fresh player|candidatepositive|positive witness|negative witness|successful construction/i);assert.match(publicText,/Any valid construction|Any legal architecture/);assert.equal(stepLiving3(s,{type:'finish'}).base.status,'ended');assert.ok(!living3Actions(s).some(a=>a.type==='next'));assert.throws(()=>stepLiving3(s,{type:'next'}),/no next/);
});
