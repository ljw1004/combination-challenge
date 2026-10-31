import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import * as M from './baseline/engine/model.ts';
import {validateContentLifecycles,validateConstructionContinuity} from './baseline/schema/lifecycle.ts';
import type {Scenario,Action,Recipe} from './baseline/schema/scenario.ts';
const observed:any={scope:'Current behavior characterization, NOT corrected runtime assertions',synthetic:{},actual:{}};
const lifecycle=(...roles:[string,'retain'|'incorporate'|'transform'][])=>Object.fromEntries(roles.map(([k,role])=>[k,{role,reason:'Explicit test lifecycle: '+role}]));
function scenario(id:string,items:string[],initialItems:string[],recipes:Recipe[],goal:string):Scenario{return {schemaVersion:1,id,title:id,premise:'Synthetic minimal lifecycle repro',items:items.map(id=>({id,label:id})),initialItems,recipes,locations:[],stages:[{id:'one',title:'one',speaker:'Tester',motivation:'Observe tangible results',area:{id:'here',label:'here',travelText:'Start here'},objectives:[{id:'goal-one',text:'Make '+goal,kind:'create',item:goal}]}]};}
function step(s:Scenario,g:M.Game,a:Action){const r=M.applyAction(s,g,a);assert(r.accepted,r.message);return r;}
function summary(g:M.Game){return g.state.tokens.map(t=>({id:t.id,area:t.area,slots:t.slots,components:t.components??[],incorporated:t.incorporated}));}

test('two-action bread repro: unused alternate recipe becoming unavailable triggers OLD picnic incorporation',()=>{
 const s=scenario('bread-repro',['bread','basket','picnic','fruit','porridge','compote','feast'],['bread','basket','fruit','porridge','compote'],[
 {id:'pack',a:'bread',b:'basket',out:'picnic',lifecycle:lifecycle(['bread','incorporate'],['basket','transform'])},
 {id:'cold',a:'bread',b:'fruit',out:'feast',lifecycle:lifecycle(['bread','incorporate'],['fruit','incorporate'])},
 {id:'warm',a:'porridge',b:'compote',out:'feast',lifecycle:lifecycle(['porridge','incorporate'],['compote','incorporate'])}], 'feast');
 assert.deepEqual(validateContentLifecycles([s]),[]);
 let g=step(s,M.createGame(s),{type:'combine',a:'bread',b:'basket'}).game;assert(M.token(g.state,'bread'));const before=structuredClone(g);
 const r=step(s,g,{type:'combine',a:'porridge',b:'compote'});assert(!M.token(r.game.state,'bread'));assert(M.token(r.game.state,'picnic')!.incorporated.includes('bread'));assert(!M.token(r.game.state,'feast')!.incorporated.includes('bread'));assert.deepEqual(M.undo(r.game).game.state.tokens,before.state.tokens);
 observed.synthetic.bread={actions:r.game.events.map(e=>e.action),retired:r.retired,before:summary(before),after:summary(r.game),undoRestoresTokens:true};
});

test('current retain cannot protect millstone from OLD mill incorporation',()=>{
 const s=scenario('mill-repro',['stone','gearing','mill','seeds','oil'],['stone','gearing','seeds'],[
 {id:'build-mill',a:'gearing',b:'stone',out:'mill',lifecycle:lifecycle(['stone','incorporate'],['gearing','transform'])},
 {id:'oil',a:'seeds',b:'stone',out:'oil',lifecycle:lifecycle(['seeds','transform'],['stone','retain'])}], 'oil');
 let g=step(s,M.createGame(s),{type:'combine',a:'gearing',b:'stone'}).game;assert(M.token(g.state,'stone'));const r=step(s,g,{type:'combine',a:'seeds',b:'stone'});
 assert(!M.token(r.game.state,'stone'));assert(M.token(r.game.state,'mill')!.incorporated.includes('stone'));
 observed.synthetic.mill={actions:r.game.events.map(e=>e.action),retired:r.retired,after:summary(r.game)};
});

test('stage advance, without a combination, can retire the finished object left in an old area',()=>{
 const s=scenario('stage-repro',['a','b','c'],['a','b'],[{id:'c',a:'a',b:'b',out:'c',lifecycle:lifecycle(['a','incorporate'],['b','retain'])}],'a');
 s.stages.push({...structuredClone(s.stages[0]),id:'two',area:{id:'there',label:'there',travelText:'Go there'},objectives:[{id:'goal-two',text:'Have c',kind:'create',item:'c'}]});
 let g=step(s,M.createGame(s),{type:'combine',a:'a',b:'b'}).game;assert(M.token(g.state,'a'));assert(M.gold(s,g.state).items.includes('a'));const r=step(s,g,{type:'advance'});assert(!M.token(r.game.state,'a'));assert(r.retired?.includes('a'));
 observed.synthetic.advance={actions:r.game.events.map(e=>e.action),retired:r.retired,transfers:r.game.events.at(-1)!.transfers,after:summary(r.game)};
});

test('preservation is incorrectly delayed for a reusable fitted source; restore adds the missing visible parts',()=>{
 const s=scenario('preserve-repro',['chassis','wheel','paint','sensor','upgrade','scan'],['chassis','wheel','paint','sensor'],[
 {id:'wheel',a:'wheel',b:'chassis',install:{target:'chassis',slot:'wheel',component:'wheel'},lifecycle:lifecycle(['wheel','incorporate'],['chassis','retain'])},
 {id:'upgrade',a:'chassis',b:'paint',out:'upgrade',preserve:['chassis'],lifecycle:lifecycle(['chassis','transform'],['paint','incorporate'])},
 {id:'scan',a:'chassis',b:'sensor',out:'scan',lifecycle:lifecycle(['chassis','retain'],['sensor','retain'])}],'scan');
 s.items.find(x=>x.id==='chassis')!.slots=[{id:'wheel',accepts:['wheel']}];
 assert.deepEqual(M.validateScenario(s),[]);assert.deepEqual(validateContentLifecycles([s]),[]);assert.deepEqual(validateConstructionContinuity([s]),[]);
 let g=step(s,M.createGame(s),{type:'combine',a:'wheel',b:'chassis'}).game;g=step(s,g,{type:'combine',a:'chassis',b:'paint'}).game;
 assert(M.token(g.state,'chassis'));assert.equal(M.token(g.state,'upgrade')!.components,undefined);assert.deepEqual(M.playerView(s,g).things.find(x=>x.id==='upgrade')!.components,[]);
 const loaded=M.restore(s,JSON.stringify(g));assert.deepEqual(M.token(loaded.state,'upgrade')!.components,['wheel']);assert(M.token(loaded.state,'chassis'));
 const after=step(s,g,{type:'combine',a:'chassis',b:'sensor'});assert(!M.token(after.game.state,'chassis'));assert.deepEqual(M.token(after.game.state,'upgrade')!.components,['wheel']);
 observed.synthetic.preserve={actions:g.events.map(e=>e.action),beforeReload:summary(g),afterReload:summary(loaded),afterFinalUnrelatedUse:summary(after.game),validatorsPass:true};
});

test('retained compound installation hides descendant parts until later retirement; restore does not repair this install',()=>{
 const s=scenario('install-preserve-repro',['chassis','module','battery','sensor','scan'],['chassis','module','battery','sensor'],[
 {id:'battery',a:'battery',b:'module',install:{target:'module',slot:'battery',component:'battery'},lifecycle:lifecycle(['battery','incorporate'],['module','retain'])},
 {id:'install-module',a:'module',b:'chassis',install:{target:'chassis',slot:'module',component:'module'},preserve:['module'],lifecycle:lifecycle(['module','incorporate'],['chassis','retain'])},
 {id:'scan',a:'module',b:'sensor',out:'scan',lifecycle:lifecycle(['module','retain'],['sensor','retain'])}],'scan');
 s.items.find(x=>x.id==='module')!.slots=[{id:'battery',accepts:['battery']}];s.items.find(x=>x.id==='chassis')!.slots=[{id:'module',accepts:['module']}];
 assert.deepEqual(M.validateScenario(s),[]);assert.deepEqual(validateConstructionContinuity([s]),[]);
 let g=step(s,M.createGame(s),{type:'combine',a:'battery',b:'module'}).game;g=step(s,g,{type:'combine',a:'module',b:'chassis'}).game;
 assert(M.token(g.state,'module'));assert.equal(M.token(g.state,'chassis')!.slots.module,'module');assert.equal(M.token(g.state,'chassis')!.components,undefined);
 const loaded=M.restore(s,JSON.stringify(g));assert.equal(M.token(loaded.state,'chassis')!.components,undefined);
 const after=step(s,g,{type:'combine',a:'module',b:'sensor'});assert(!M.token(after.game.state,'module'));assert.deepEqual(M.token(after.game.state,'chassis')!.components,['module','battery']);
 observed.synthetic.installPreserve={actions:g.events.map(e=>e.action),beforeReload:summary(g),afterReload:summary(loaded),afterFinalUnrelatedUse:summary(after.game)};
});

test('actual Mars optional radio installation omits its fitted stand while loose radio remains needed',async()=>{
 const {scenarios}=await import('/workspace/shared/combination-fork-recovery-20261028/experiments/tangible-campaign/ui/scenarios.ts');
 const s=scenarios.find(s=>s.id==='mars-cargo-revision-v2')!;
 const ev=JSON.parse(readFileSync('/workspace/shared/combination-fork-recovery-20261028/experiments/tangible-campaign/evidence/'+s.id+'-route-evidence.json','utf8'));
 const index=ev.actionsLog.findIndex((a:any)=>a.type==='combine'&&[a.a,a.b].includes('antenna-stand'));
 assert(index>=0);let g=M.replay(s,ev.actionsLog.slice(0,index+1));
 const radio=structuredClone(M.token(g.state,'long-range-radio'))!;assert.equal(radio.slots.stand,'antenna-stand');
 const area=M.token(g.state,'rover')!.area;g=step(s,g,{type:'visit',area,carry:['long-range-radio']}).game;
 const r=step(s,g,{type:'combine',a:'long-range-radio',b:'rover'});assert.equal(r.recipe,'rover-5-survey-rover');assert(M.token(r.game.state,'long-range-radio'));assert.equal(M.token(r.game.state,'rover')!.slots.radio,'long-range-radio');assert(!M.token(r.game.state,'rover')!.components?.includes('antenna-stand'));
 const loaded=M.restore(s,JSON.stringify(r.game));assert(!M.token(loaded.state,'rover')!.components?.includes('antenna-stand'));
 observed.actual.marsRadio={prefixActions:index+1,extraActions:r.game.events.slice(index+1).map(e=>e.action),radioBefore:radio,roverAfter:M.token(r.game.state,'rover'),radioAfter:M.token(r.game.state,'long-range-radio'),roverView:M.playerView(s,r.game).things.find(x=>x.id==='rover'),reloadAddsStand:false};
});

test('actual frozen v7 oil and feast events independently replay; ownership proves deferred absorption, not current recipe',async()=>{
 const root='/workspace/shared/combination-campaign-research-20261028/elements/candidates/v7/frozen';
 const s:Scenario=JSON.parse(readFileSync(root+'/scenarios/elements-v7.json','utf8'));
 const session=JSON.parse(readFileSync(root+'/sessions/elements_gathering_v7_a/session.json','utf8'));
 // Replays current reviewed engine for comparison, and frozen evidence engine separately.
 const frozen=await import(root+'/engine/model.ts');let g=M.createGame(s),fg=frozen.createGame(s);const events=[];
 for(const e of session.game.events){
  assert.notEqual(e.action.type,'undo');const before=g;const r=M.applyAction(s,g,e.action);const fr=frozen.applyAction(s,fg,e.action);assert.equal(r.accepted,e.accepted);assert.deepEqual(r.game.state,fr.game.state);g=r.game;fg=fr.game;
  if(['oil','feast-from-warm-meal'].includes(r.recipe??'')){
   const id=r.recipe==='oil'?'millstone':'bread',old=M.token(before.state,id);assert(old);assert(!M.token(g.state,id));const owners=g.state.tokens.filter(t=>t.incorporated.includes(id));
   events.push({seq:e.seq,recipe:r.recipe,action:e.action,sourceBefore:old,retired:r.retired,ownersAfter:owners,currentRecipe:s.recipes.find(x=>x.id===r.recipe),previousAuthoredRecipes:before.state.recipesUsed.map(id=>s.recipes.find(x=>x.id===id)!).filter(x=>x.lifecycle?.[id]?.role==='incorporate')});
  }
 }
 assert.deepEqual(g,session.game);assert.equal(events.length,2);observed.actual.frozenV7={scenario:s.id,exactFullReplay:true,reviewedAndFrozenEnginesMatch:true,events,report:session.playerReport};
});

test('write characterization evidence',()=>{writeFileSync(new URL('./repro-results.json',import.meta.url),JSON.stringify(observed,null,2)+'\n');});
