/** Independent 2026-10-27 latest-policy QA. Model/width arithmetic, not browser pixels. */
import test from 'node:test';import assert from 'node:assert/strict';
import * as I from '../src/history-ideas-model.ts';import * as M from '../src/mars-expedition-model.ts';import * as E from '../src/elements-discovery-model.ts';
const random=(seed:number)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32};
test('Ideas: completed situated witness stays; optional review remains selectable and needed placed tools travel',()=>{
 let s=I.checkpoint(1,375);const journal=structuredClone(I.thing(s,'journal')!);assert(I.active(s,journal));
 let r=I.step(s,{type:'advance'});assert(r.accepted);assert.deepEqual(I.thing(r.state,'journal'),journal);assert(I.witness(r.state,I.thing(r.state,'journal')!));assert(I.visibleThings(r.state).some(t=>t.id==='journal'));assert(I.partners(r.state,'journal').includes('doubt'));assert(I.step(r.state,{type:'combine',a:'journal',b:'doubt'}).accepted);
 s=I.checkpoint(1,375);s=I.step(s,{type:'place',id:'memory',location:'library'}).state;s=I.step(s,{type:'combine',a:'press',b:'observation'}).state;s=I.step(s,{type:'combine',a:'atlas',b:'method'}).state;s=I.step(s,{type:'place',id:'encyclopedia',location:'library'}).state;
 // The library has one occupant; synthetic saved placement at an already encountered site exercises located required tool.
 I.thing(s,'memory')!.location='library';const oldY=I.thing(s,'memory')!.y;r=I.step(s,{type:'advance'});assert(r.accepted);assert(!I.thing(r.state,'memory')!.location);assert(I.thing(r.state,'memory')!.y>oldY);assert.equal(I.visibleThings(r.state).length,s.things.length);
});
test('Ideas: all 4 tide variants remain discoverable with every surviving object visible',()=>{
 for(const width of [320,375]){let s=I.checkpoint(2,width);for(let n=0;n<50;n++){const candidates=s.things.flatMap(t=>I.partners(s,t.id).map(b=>({a:t.id,b})));if(!candidates.length)break;const c=candidates[0];const before=s;const r=I.step(s,{type:'combine',...c});assert(r.accepted);s=r.state;for(const t of before.things)assert.deepEqual(I.thing(s,t.id),t);}
 for(const id of ['tide-movement-10','tide-movement-2','tide-pressure-10','tide-pressure-2'])assert(I.thing(s,id));assert.equal(I.visibleThings(s).length,s.things.length);
 const l=I.boardLayout(s,width);for(const p of l.positions.values())assert(p.x>=67&&p.x+67<=width);for(const p of l.locations)assert(p.x>=74&&p.x+74<=width);
 }
});
test('Mars: prior actual condition witnesses remain gold after advancement',()=>{
 const p=M.debugJump('expedition');const witnesses=M.goalWitnesses(p.state).tokens;
 for(const kind of ['habitat-patch','propagator']){const t=p.state.tokens.find(t=>t.kind===kind);if(t)assert(witnesses.has(t.id),`${kind} lost actual completed-condition gold`);}
});
test('Mars: every canonical survivor remains visible in all checkpoints; save and undo exact',()=>{
 for(const id of ['home','expedition','observations','complete']){const p=M.debugJump(id);assert.deepEqual(M.visibleTokens(p.state),p.state.tokens);assert.deepEqual(M.restore(JSON.stringify(p)),p);const t=p.state.tokens.find(t=>!t.location)!;const q=M.apply(p,{type:'place',token:t.id,location:null,x:18,y:25});assert.deepEqual(M.undo(q).state,p.state);}
});
test('Elements: 30 shuffled closures preserve tangible old objects and all 41 outputs, undo exact',()=>{
 for(let seed=1;seed<=30;seed++){const rng=random(seed);let p=E.fresh();let advances=0;
 for(let n=0;n<50;n++){const s=p.state;const candidates=E.RECIPES.filter(r=>!E.token(s,r.out)&&E.token(s,r.a)&&E.token(s,r.b)&&(!r.at||s.revealed.includes(r.at)));
 if(E.stepNamed(s,{type:'advance'}).accepted&&(rng()<.35||!candidates.length)){const old=structuredClone(s);p=E.apply(p,{type:'advance'});assert.deepEqual(E.undo(p).state,old);advances++;continue;}
 if(!candidates.length)break;const recipe=candidates[Math.floor(rng()*candidates.length)];if(recipe.at)p=E.apply(p,{type:'place',token:recipe.b,location:recipe.at});const before=structuredClone(p.state);const r=E.stepNamed(p.state,{type:'combine',a:recipe.a,b:recipe.b});assert(r.accepted,r.message);p=E.apply(p,{type:'combine',a:recipe.a,b:recipe.b});assert.deepEqual(E.undo(p).state,before);for(const t of before.tokens)assert.deepEqual(E.token(p.state,t.id),t,'creation must not move a surviving old object');}
 assert.equal(p.state.tokens.length,45);assert.equal(advances,3);assert.equal(new Set(p.state.tokens.map(t=>t.id)).size,45);assert.deepEqual(E.restore(JSON.stringify(p)).state,p.state);
 }
});
test('Elements: transition moves forward, preserves carried relative positions and left-behind coordinates',()=>{
 let p=E.debugJump('comfort');const s=structuredClone(p.state); // complete current level via window + basket
 for(const [a,b]of E.ROUTE.slice(12,18))p=E.apply(p,{type:'combine',a,b});const before=p.state;assert(E.goalStates(before).every(g=>g.current));const r=E.stepNamed(before,{type:'advance'});assert(r.accepted);const after=r.state;
 assert((after.areaTop??0)>(before.areaTop??0));const carried=E.activeTokens(after).map(t=>t.id);for(const a of carried)for(const b of carried){const old=E.token(before,a)!.y-E.token(before,b)!.y,now=E.token(after,a)!.y-E.token(after,b)!.y;assert(Math.abs(now-old)<=Math.abs(old)*.081+1e-7,'Relative arrangement should change by at most gentle uniform compression');}for(const t of before.tokens.filter(t=>!carried.includes(t.id)))assert.deepEqual(E.token(after,t.id),t);assert(after.tokens.length>=s.tokens.length);
});

import * as Core from '../experiments/mars-remote-next/model.ts';
const rng=random;
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
 assert.deepEqual([...covered].sort(),Core.recipes.map(r=>r.id).sort(),'Each authored alternative exercised at least once');
});
test('Mars: chapter travel cannot introduce vertical overlaps between previously separated carried cards',()=>{
 let p=M.fresh();const id=(kind:string)=>p.state.tokens.find(t=>t.kind===kind)!.id;
 const act=(a:M.Action)=>{const r=M.stepNamed(p.state,a);assert(r.accepted,r.message);p=M.apply(p,a);};const c=(a:string,b:string)=>act(b.startsWith('place:')?{type:'use-location',token:id(a),location:b.slice(6)}:{type:'combine',a:id(a),b:id(b)});const place=(kind:string,location:string)=>act({type:'place',token:id(kind),location});
 const advance=()=>{const before=p.state;act({type:'advance'});const after=p.state,carried=M.carryTokens(before,after.level);const point=(s:M.State,t:M.Token)=>t.location?s.places[t.location]:t;
 for(const a of carried)for(const b of carried){if(a.id===b.id)continue;const oldA=point(before,a),oldB=point(before,b),newA=M.token(after,a.id)!,newB=M.token(after,b.id)!;const half=(M.tokenSize(a).height+M.tokenSize(b).height)/2;if(Math.abs(oldA.y-oldB.y)>=half)assert(Math.abs(newA.y-newB.y)>=half-1e-7,`New overlap ${a.kind}/${b.kind}`);}
 };
 c('broken-radio','cable');c('solar-panel','battery');c('solar-charger','radio');place('solar-radio','contact-ridge');advance();place('canister','glacier');c('heater','canister');c('meltwater-canister','water-filter');c('seeds','planting-tray');c('water-canister','seed-tray');c('watered-seed-tray','place:warm-habitat');c('sprouted-tray','clear-cover');c('habitat-fabric','sealant');advance();c('solar-radio','dish');c('frame','wheels');c('motor','rover');c('solar-charger','rover');place('map','overlook');c('binoculars','map');advance();assert(M.visibleTokens(p.state).some(t=>t.kind==='rover'));c('long-range-radio','rover');
});
