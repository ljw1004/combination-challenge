/** Independent semantic audit. Model-level evidence, not native-browser hit-testing.
 * 2026-10-27: visibility is now all tangible survivors. Previous hiding-policy source
 * and unmodified failing run are preserved under results/mobile-retention-independent-pre-tangibility-*.
 * Future-use/recipe/alternative tests remain; obsolete disappear assertions now check
 * carry membership AND tangible survival, not a collection/archive UI.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../src/mars-expedition-model.ts';
import * as E from '../src/elements-discovery-model.ts';
import * as I from '../src/history-ideas-model.ts';
import * as Core from '../experiments/mars-remote-next/model.ts';
const rng=(seed:number)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
test('independent Mars: optional rover radio remains actually selectable after expedition goal',()=>{
 let s=M.debugJump('expedition').state;
 const id=(k:string)=>s.tokens.find(t=>t.kind===k)!.id;
 const act=(a:M.Action)=>{const r=M.stepNamed(s,a);assert(r.accepted,r.message);s=r.state};
 const c=(a:string,b:string)=>act({type:'combine',a:id(a),b:id(b)});
 c('solar-radio','dish');c('frame','wheels');c('motor','rover');c('solar-charger','rover');act({type:'place',token:id('map'),location:'overlook'});c('binoculars','map');
 assert(M.goalStates(s).every(g=>g.current));
 assert(M.visibleTokens(s).some(t=>t.kind==='rover'),'Optional radio target must remain visible');
 c('long-range-radio','rover');assert.equal(s.tokens.find(t=>t.kind==='rover')!.slots!.radio,'long-range-radio');
});
test('independent Elements: all 41 authored outputs remain reachable using active operands in 50 shuffled discovery orders',()=>{
 for(let seed=1;seed<=50;seed++){
  const random=rng(seed);let p=E.fresh();let count=0;
  while(count<E.RECIPES.length){
   const s=p.state,before=JSON.stringify(s),active=new Set(E.activeTokens(s).map(t=>t.id));
   assert.equal(JSON.stringify(s),before,'Projection cannot mutate canonical tokens or goal status');
   const candidates=E.RECIPES.filter(r=>!E.token(s,r.out)&&E.token(s,r.a)&&E.token(s,r.b)&&(!r.at||s.revealed.includes(r.at)));
   for(const r of candidates){assert(active.has(r.a),`seed ${seed}: hidden ${r.a} before ${r.out}`);assert(active.has(r.b),`seed ${seed}: hidden ${r.b} before ${r.out}`);}
   if(!candidates.length){const r=E.stepNamed(s,{type:'advance'});assert(r.accepted,`seed ${seed}: stuck after ${count}`);p=E.apply(p,{type:'advance'});continue;}
   const recipe=candidates[Math.floor(random()*candidates.length)];
   if(recipe.at)p=E.apply(p,{type:'place',token:recipe.b,location:recipe.at});
   const previous=p.state;const action:E.Action={type:'combine',a:recipe.a,b:recipe.b};const r=E.stepNamed(previous,action);assert(r.accepted,r.message);p=E.apply(p,action);count++;
   assert.deepEqual(E.undo(p).state,previous,'Undo restores both canonical and active board');
   assert.equal(new Set(p.state.tokens.map(t=>t.kind)).size,p.state.tokens.length);
   assert(!E.stepNamed(p.state,action).accepted,'No duplicate output');
  }
  while(p.state.level<3){const r=E.stepNamed(p.state,{type:'advance'});assert(r.accepted);p=E.apply(p,{type:'advance'});}
  assert.equal(E.activeTokens(p.state).length,0,'Everything done: no false retention');
  for(let i=0;i<4;i++)assert(E.goalStates(p.state,i).every(g=>g.current&&g.achieved));
 }
});
test('independent Ideas: every available canonical recipe/translation has active operands across shuffled full closure',()=>{
 for(let seed=1;seed<=50;seed++){
  const random=rng(seed);let s=I.fresh();
  for(let n=0;n<60;n++){
   const before=JSON.stringify(s),active=new Set(I.activeThings(s).map(t=>t.id));assert.equal(JSON.stringify(s),before);
   const candidates:I.Action[]=[];
   for(const a of s.things)for(const b of I.partners(s,a.id)){
    assert(active.has(a.id),`hidden source ${a.id}`);if(!b.startsWith('place:'))assert(active.has(b),`hidden target ${b}`);
    candidates.push({type:'combine',a:a.id,b});
   }
   if(!I.current(s,1)&&s.chapter>=1){const t=s.things.find(t=>['journal','encyclopedia'].includes(t.kind));if(t)candidates.push({type:'place',id:t.id,location:'library'});}
   if(!I.current(s,2)&&s.chapter===2&&I.thing(s,'tide-pressure-2'))candidates.push({type:'place',id:'tide-pressure-2',location:'listening'});
   if(s.chapter<2&&I.current(s))candidates.push({type:'advance'});
   if(!candidates.length)break;
   const a=candidates[Math.floor(random()*candidates.length)],r=I.step(s,a);assert(r.accepted,r.message);s=r.state;
   if(a.type==='combine')assert(!I.step(s,a).accepted,'Duplicate output rejected');
  }
  assert([0,1,2].every(i=>I.current(s,i)),`seed ${seed} failed final goals`);
  assert.equal(I.activeThings(s).length,0,'All ideas and all tide variants done: no false retention');
  assert.equal(new Set(s.things.map(t=>t.id)).size,s.things.length);
 }
});
test('independent Mars: caches have exact 9/12/8/0 nonoverlapping grants; undo/replay never duplicates',()=>{
 assert.deepEqual(M.caches.map(c=>c.items.length),[9,12,8,0]);assert.deepEqual(M.caches.flatMap(c=>c.items).sort(),[...Core.supplies].sort());
 for(const name of ['home','expedition','observations']){
  const p=M.debugJump(name),before=JSON.stringify(p.state);M.visibleTokens(p.state);assert.equal(JSON.stringify(p.state),before);
  const fresh=M.restore(JSON.stringify(p));assert.deepEqual(fresh.state,p.state);
  assert.equal(new Set(p.state.tokens.map(t=>t.kind)).size,p.state.tokens.length);
 }
 let p=M.fresh();const a=p.state.tokens.find(t=>t.kind==='broken-radio')!,b=p.state.tokens.find(t=>t.kind==='cable')!;const initial=structuredClone(p.state);
 p=M.apply(p,{type:'combine',a:a.id,b:b.id});assert(!M.carryTokens(p.state).some(t=>t.id===b.id));assert(M.visibleTokens(p.state).some(t=>t.id===b.id),'Spent survivor remains tangible');p=M.undo(p);assert.deepEqual(p.state,initial);assert(M.visibleTokens(p.state).some(t=>t.id===b.id));
});
test('independent Mars: all legal recipe operands and slot targets stay active through 100 shuffled full expeditions',()=>{
 const covered=new Set<string>();
 for(let seed=1;seed<=100;seed++){
  const random=rng(seed);let s=M.createNamed();
  for(let n=0;n<100;n++){
   const active=new Set(M.visibleTokens(s).map(t=>t.id));const candidates:{actions:M.Action[];recipe?:string}[]=[];
   for(const recipe of Core.recipes){
    const a=s.tokens.find(t=>t.kind===recipe.a),b=s.tokens.find(t=>t.kind===recipe.b);if(!a||(!b&&!recipe.b.startsWith('place:')))continue;
    let base=s;const actions:M.Action[]=[];
    if(recipe.at){if(!s.revealed.includes(recipe.at)||!b)continue;const place:M.Action={type:'place',token:b.id,location:recipe.at};const p=M.stepNamed(s,place);if(!p.accepted)continue;base=p.state;actions.push(place);}
    const action:M.Action=b?{type:'combine',a:a.id,b:b.id}:{type:'use-location',token:a.id,location:recipe.b.slice(6)};
    const r=M.stepNamed(base,action);if(!r.accepted||r.recipe!==recipe.id)continue;
    assert(active.has(a.id),`seed ${seed}: hidden ${a.kind} for ${recipe.id}`);if(b)assert(active.has(b.id),`seed ${seed}: hidden ${b.kind} for ${recipe.id}`);
    actions.push(action);candidates.push({actions,recipe:recipe.id});
   }
   const rover=s.tokens.find(t=>t.kind==='rover');
   if(rover)for(const part of s.tokens){const action:M.Action={type:'combine',a:part.id,b:rover.id};if(!M.stepNamed(s,action).accepted)continue;assert(active.has(part.id),`slot source hidden ${part.kind}`);assert(active.has(rover.id),'slot target hidden');candidates.push({actions:[action]});}
   for(const goal of Core.goals.filter(g=>g.kind==='place'&&!s.achieved.includes(g.id)&&s.revealed.includes(g.location!))){
    for(const t of s.tokens.filter(t=>goal.capability?M.hasCapability(t,goal.capability):t.kind===goal.concept)){assert(active.has(t.id));candidates.push({actions:[{type:'place',token:t.id,location:goal.location!}]});}
   }
   if(M.stepNamed(s,{type:'advance'}).accepted)candidates.push({actions:[{type:'advance'}]});
   if(!candidates.length)break;
   const chosen=candidates[Math.floor(random()*candidates.length)];
   for(const a of chosen.actions){const before=JSON.stringify(s),r=M.stepNamed(s,a);assert(r.accepted,r.message);assert.equal(JSON.stringify(s),before,'Step is non-destructive');s=r.state;}
   if(chosen.recipe)covered.add(chosen.recipe);
   assert.equal(new Set(s.tokens.map(t=>t.kind)).size,s.tokens.length);
  }
  assert.equal(s.level,3,`seed ${seed}: advance deadlock`);assert(Core.goals.every(g=>s.achieved.includes(g.id)),`seed ${seed}: unmet goals`);
 }
 // The later outcrop shares Ice sample with earlier sampling. Exercise it
 // explicitly before sampling, without weakening all-alternative coverage.
 const late=M.debugJump('observations').state,scoop=late.tokens.find(t=>t.kind==='scoop')!;
 const sample=M.stepNamed(late,{type:'use-location',token:scoop.id,location:'lookout-ice'});
 assert(sample.accepted,sample.message);assert.equal(sample.recipe,'outcrop-sample');covered.add(sample.recipe!);
 assert.deepEqual([...covered].sort(),Core.recipes.map(r=>r.id).sort(),'Each authored alternative exercised at least once');
});
test('independent Mars: placing a spent piece cannot falsely mark it for carry',()=>{
 let s=M.createNamed();const a=s.tokens.find(t=>t.kind==='broken-radio')!,b=s.tokens.find(t=>t.kind==='cable')!;
 // Repair reveals ridge; retained canonical cable can be positioned there in restored/older saves.
 s=M.stepNamed(s,{type:'combine',a:a.id,b:b.id}).state;s=M.stepNamed(s,{type:'place',token:b.id,location:'contact-ridge'}).state;
 assert(s.tokens.some(t=>t.id===b.id&&t.location==='contact-ridge'));assert(!M.carryTokens(s).some(t=>t.id===b.id));assert(M.visibleTokens(s).some(t=>t.id===b.id),'Placing spent survivor never makes it disappear');
});
test('independent Mars: permanently retired alternative operands remain tangible but are not carried for impossible alternatives',()=>{
 let s=M.debugJump('complete').state;
 for(let n=0;n<100;n++){
  let next:M.State|undefined;
  for(const recipe of Core.recipes){
   const a=s.tokens.find(t=>t.kind===recipe.a),b=s.tokens.find(t=>t.kind===recipe.b);if(!a||(!b&&!recipe.b.startsWith('place:')))continue;
   let base=s;if(recipe.at&&b){const placed=M.stepNamed(s,{type:'place',token:b.id,location:recipe.at});if(!placed.accepted)continue;base=placed.state;}
   const r=M.stepNamed(base,b?{type:'combine',a:a.id,b:b.id}:{type:'use-location',token:a.id,location:recipe.b.slice(6)});
   if(r.accepted){next=r.state;break;}
  }
  if(!next)break;s=next;
 }
 assert(s.retired.includes('propagator'));assert(!s.known.includes('heated-propagator'));
 assert(!M.carryTokens(s).some(t=>t.kind==='heater'),'Heater has no future use once propagator is permanently retired');assert.deepEqual(M.visibleTokens(s),s.tokens,'Finished surviving pieces remain physically on board');
 assert(Core.goals.every(g=>s.achieved.includes(g.id)));
});
test('independent Mars: undo and replay cache arrival yields identical exact state, not duplicate supplies',()=>{
 let p=M.fresh();const act=(a:M.Action)=>p=M.apply(p,a),id=(k:string)=>p.state.tokens.find(t=>t.kind===k)!.id;
 for(const [a,b]of [['broken-radio','cable'],['solar-panel','battery'],['solar-charger','radio']])act({type:'combine',a:id(a),b:id(b)});
 act({type:'place',token:id('solar-radio'),location:'contact-ridge'});const before=structuredClone(p.state);act({type:'advance'});const first=structuredClone(p.state);
 assert.equal(first.tokens.length-before.tokens.length,12);p=M.undo(p);assert.deepEqual(p.state,before);act({type:'advance'});assert.deepEqual(p.state,first);
 assert.equal(new Set(p.state.known).size,p.state.known.length);assert.equal(new Set(p.state.tokens.map(t=>t.id)).size,p.state.tokens.length);
});
