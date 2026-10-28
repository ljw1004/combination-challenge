/** Independent geometric/property checks. Headless only; no native layout claim. */
import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import type {Scenario} from '../experiments/tangible-campaign/schema/scenario.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
import {groupedArrivalPlan} from '../experiments/tangible-campaign/engine/arrival-layout.ts';

const world=():Scenario=>({schemaVersion:1,id:'independent-grouped-arrival',title:'Grouped arrival test',premise:'Preserve the arranged workspace.',
 items:[...['a','b','c','d','e','f','fresh','second','out','mixed'].map(id=>({id,label:id})),
  {id:'tall',label:'An observation with enough words to occupy several visible lines'}],
 locations:[{id:'desk',label:'Desk'}],initialItems:['a','b','c','d','e','f','tall'],
 recipes:[{id:'new-pair',a:'fresh',b:'second',out:'out'},{id:'mixed-pair',a:'a',b:'fresh',out:'mixed'}],
 stages:[
  {id:'before',title:'Before',speaker:'Test',motivation:'Arrange.',area:{id:'room',label:'Room',travelText:'Stay.'},locations:['desk'],objectives:[{id:'first',text:'Have a',kind:'create',item:'a'}]},
  {id:'arrival',title:'Arrival',speaker:'Test',motivation:'Use the delivery.',area:{id:'room',label:'Room',travelText:'Stay.'},caches:[{id:'delivery',label:'Delivery',narrative:'Two new things.',items:['a','fresh','second']}],objectives:[{id:'next',text:'Make out',kind:'create',item:'out'}]},
  {id:'same',title:'Same room',speaker:'Test',motivation:'Keep working.',area:{id:'room',label:'Room',travelText:'Stay.'},caches:[],objectives:[{id:'last',text:'Make mixed',kind:'create',item:'mixed'}]},
 ]});
type Box={id:string;x:number;y:number;w:number;h:number};
const boxes=(s:Scenario,g:M.Game):Box[]=>[
 ...g.state.tokens.map(t=>({id:t.id,x:t.x,y:t.y,w:96,h:M.tokenHeight(s,t)})),
 ...g.state.places.map(p=>({id:'@'+p.id,x:p.x,y:p.y,w:106,h:82})),
];
const overlap=(a:Box,b:Box)=>Math.min(a.x+a.w/2,b.x+b.w/2)>Math.max(a.x-a.w/2,b.x-b.w/2)+1e-7&&Math.min(a.y+a.h/2,b.y+b.h/2)>Math.max(a.y-a.h/2,b.y-b.h/2)+1e-7;
const identities=(g:M.Game)=>g.state.tokens.map(({x,y,...rest})=>rest);
const next=(s:Scenario,g:M.Game)=>{const result=M.applyAction(s,g,{type:'advance'});assert(result.accepted,result.message);return result.game;};
const layout=(g:M.Game)=>(g.state as M.State&{arrivalLayout?:{stage:number;area:string;dividerY:number;active:boolean}}).arrivalLayout;
const active=(g:M.Game)=>!!layout(g)&&layout(g)!.active;

test('independent: 180 adversarial boards preserve old x/order, identities and every previously disjoint pair',()=>{
 let seed=0x51a7;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
 for(const width of [320,375,600])for(let trial=0;trial<60;trial++){
  const s=world(),g=M.createGame(s,width);
  // Deliberately include partial overlaps, uneven horizontal arrangements,
  // long text, large whitespace, and places, not just a regular tile grid.
  for(const t of g.state.tokens){t.x=52+rand()*(width-104);t.y=80+rand()*1800;}
  g.state.places[0].x=52+rand()*(width-104);g.state.places[0].y=90+rand()*1800;
  const before=boxes(s,g),out=next(s,g),after=boxes(s,out),old=after.filter(b=>before.some(p=>p.id===b.id));
  assert.equal(old.length,before.length);assert.deepEqual(identities(out).slice(0,g.state.tokens.length),identities(g));
  for(const a of before){const n=old.find(b=>b.id===a.id)!;assert.equal(n.x,a.x);assert.equal(n.h,a.h);assert(n.y<=a.y+1e-7,`unexpected downward displacement ${a.id}`);}
  for(let i=0;i<before.length;i++)for(let j=i+1;j<before.length;j++){
   const a=before[i],b=before[j],na=old.find(x=>x.id===a.id)!,nb=old.find(x=>x.id===b.id)!;
   if(!overlap(a,b))assert(!overlap(na,nb),`new overlap width=${width} trial=${trial}: ${a.id}, ${b.id}`);
   if(a.y<b.y)assert(na.y<nb.y,`reordered centers ${a.id}, ${b.id}`);
  }
  const supplies=after.filter(b=>['fresh','second'].includes(b.id));
  for(const n of supplies)for(const o of old)assert(n.y-n.h/2>o.y+o.h/2,'new group must start below every old token and location');
  assert(!overlap(supplies[0],supplies[1]));assert(active(out));
 }
});

test('independent: compact old arrangements are byte-for-byte stationary and location associations survive grouping',()=>{
 const s=world(),g=M.createGame(s,600);g.state.tokens.forEach((t,i)=>{t.x=52+100*(i%5);t.y=60+100*Math.floor(i/5);});
 g.state.places[0].x=452;g.state.places[0].y=60;
 const a=M.token(g.state,'a')!;a.x=452;a.y=76;a.location='desk';
 const before=structuredClone(g.state),out=next(s,g);
 assert.deepEqual(out.state.tokens.filter(t=>before.tokens.some(o=>o.id===t.id)),before.tokens);
 assert.deepEqual(out.state.places,before.places);assert.equal(M.token(out.state,'a')!.location,'desk');assert(active(out));
});

test('independent: no new cache and only-new entry never invent an empty old band',()=>{
 const s=world(),g=M.createGame(s);s.stages[1].caches=[{id:'duplicate',label:'Already known',narrative:'Nothing arrives.',items:['a','b']}];
 const same=next(s,g);assert.deepEqual(same.state.tokens,g.state.tokens);assert.deepEqual(same.state.places,g.state.places);assert(!active(same));
 const only=world();only.initialItems=[];only.stages=[{...only.stages[1],id:'only',locations:['desk']}];const justNew=M.createGame(only);
 assert.deepEqual(justNew.state.arrival!.supplies.map(x=>x.item),['a','fresh','second']);assert(!active(justNew));assert.equal(justNew.state.places.length,1);
});

test('independent: crossing uses accepted action; rejection is a snapback, undo and compact reload preserve its state',()=>{
 const s=world(),g=next(s,M.createGame(s));assert(active(g));
 const invalid=M.applyAction(s,g,{type:'combine',a:'b',b:'fresh'});assert(!invalid.accepted);assert(active(invalid.game));
 assert.deepEqual(invalid.game.state.tokens,g.state.tokens);
 const accepted=M.applyAction(s,g,{type:'combine',a:'a',b:'fresh'});assert(accepted.accepted);assert(!active(accepted.game));
 assert.deepEqual(M.undo(accepted.game).game.state.tokens,g.state.tokens);assert(active(M.undo(accepted.game).game));
 const restored=M.restore(s,JSON.stringify(decodeSave(encodeSave({game:accepted.game,tops:{room:0},seen:[0,1]})).game));assert.deepEqual(restored,accepted.game);assert(!active(restored));
 const resized=M.resizeGame(g,600);assert.deepEqual(layout(resized),layout(g));assert(active(resized));
});

test('independent: every shrinkable empty gap loses the same proportion and dense occupied bands never shrink',()=>{
 const old=[{id:'a',x:52,y:120,w:96,h:44},{id:'b',x:152,y:400,w:96,h:44},{id:'c',x:52,y:850,w:96,h:44}],supplies=[{id:'fresh',x:52,y:56,w:96,h:44}];
 const original=structuredClone({old,supplies}),plan=groupedArrivalPlan(old,supplies,320)!;
 assert.deepEqual({old,supplies},original,'planner must not mutate its inputs');
 const compression=[(old[0].y-plan.positions.get('a')!.y)/(old[0].y-22-34)];
 for(let i=1;i<old.length;i++){
  const beforeGap=old[i].y-old[i-1].y-44,afterGap=plan.positions.get(old[i].id)!.y-plan.positions.get(old[i-1].id)!.y-44;
  assert(afterGap>=10-1e-7);compression.push((beforeGap-afterGap)/(beforeGap-10));
 }
 for(const ratio of compression)assert(Math.abs(ratio-compression[0])<1e-9,'all reducible whitespace must shrink proportionally');
 assert(Math.abs(plan.positions.get('fresh')!.y+22+12-500)<1e-7,'compression stops exactly at the soft budget when enough empty space exists');
 const dense=[{id:'huge',x:52,y:334,w:96,h:600}],densePlan=groupedArrivalPlan(dense,supplies,320)!;
 assert.equal(densePlan.compressedBy,0);assert.equal(densePlan.positions.get('huge')!.y,334);assert(densePlan.positions.get('fresh')!.y+22>500,'irreducible occupied height must scroll, not overlap or clip');
 assert.notEqual(plan.dividerY,250);assert.notEqual(densePlan.dividerY,250,'divider is not a fixed half-screen partition');
});

test('independent: final move and placement crossings dismiss once; unchanged same-side moves do not',()=>{
 const s=world(),g=next(s,M.createGame(s)),line=layout(g)!.dividerY;
 const within=M.applyAction(s,g,{type:'move',item:'fresh',x:252,y:line+50});assert(within.accepted);assert(active(within.game));
 const up=M.applyAction(s,within.game,{type:'move',item:'fresh',x:252,y:line-50});assert(up.accepted);assert(!active(up.game));
 assert(active(M.undo(up.game).game));
 const down=M.applyAction(s,g,{type:'move',item:'a',x:252,y:line+50});assert(down.accepted);assert(!active(down.game));
 const placed=M.applyAction(s,g,{type:'place',item:'fresh',location:'desk'});assert(placed.accepted);assert(!active(placed.game));
 const malformed=structuredClone(g);(malformed.state as any).arrivalLayout={stage:0,area:'elsewhere',dividerY:-3,active:'yes'};
 const restored=M.restore(s,JSON.stringify(malformed));assert(!layout(restored));assert.deepEqual(restored.state.tokens,g.state.tokens);
 const legacy=structuredClone(g);delete legacy.state.arrivalLayout;const loaded=M.restore(s,JSON.stringify(legacy));assert(!layout(loaded));assert.deepEqual(loaded.state.tokens,g.state.tokens);
});

const oldPairWorld=()=>{const s=world();s.initialItems=['a','b'];s.locations=[];s.stages[0].locations=[];s.stages[1].caches![0].items=['fresh'];s.recipes.push({id:'old-pair',a:'a',b:'b',out:'out'});return s;};
test('independent: a same-side old creation uses free upper space, never falsely enters the new-items band',()=>{
 const s=oldPairWorld(),g=next(s,M.createGame(s)),oldLine=layout(g)!.dividerY;
 const result=M.applyAction(s,g,{type:'combine',a:'a',b:'b'});assert(result.accepted);const out=M.token(result.game.state,'out')!;
 assert(active(result.game),'same-side creation must not dismiss the divider');
 assert.equal(layout(result.game)!.dividerY,oldLine,'available old-side birth space needs no relocation');
 assert.deepEqual({x:out.x,y:out.y},{x:250,y:56});assert(out.y+M.tokenHeight(s,out)/2<oldLine);
 assert.deepEqual(M.token(result.game.state,'fresh'),M.token(g.state,'fresh'));
});

test('independent: a taller old transformation keeps its exact spot and pushes only divider/new band by the needed clearance',()=>{
 const s=oldPairWorld();s.recipes=s.recipes.filter(r=>r.id!=='mixed-pair');s.items.find(t=>t.id==='out')!.label='The older arranged object has become a much taller observation with several additional lines of text and details preserved for deliberate reading';
 s.recipes.find(r=>r.id==='old-pair')!.lifecycle={a:{role:'transform',reason:'The old object changes state.'},b:{role:'retain',reason:'The tool remains.'}};
 const before=M.createGame(s);M.token(before.state,'a')!.y=200;M.token(before.state,'b')!.y=200;const g=next(s,before),line=layout(g)!.dividerY,source=M.token(g.state,'a')!,newBefore=M.token(g.state,'fresh')!;
 const result=M.applyAction(s,g,{type:'combine',a:'a',b:'b'});assert(result.accepted);const out=M.token(result.game.state,'out')!,newAfter=M.token(result.game.state,'fresh')!,newLine=layout(result.game)!.dividerY;
 assert(active(result.game));assert.equal(M.token(result.game.state,'a'),undefined);assert.deepEqual({x:out.x,y:out.y},{x:source.x,y:source.y});
 assert.equal(newLine,out.y+M.tokenHeight(s,out)/2+20);assert(newLine>line);assert.equal(newAfter.y-newBefore.y,newLine-line);assert.equal(newAfter.x,newBefore.x);
 assert.deepEqual(M.token(result.game.state,'b'),M.token(g.state,'b'));assert(newAfter.y-M.tokenHeight(s,newAfter)/2>newLine);
 const undone=M.undo(result.game).game;assert.deepEqual(undone.state.tokens,g.state.tokens);assert.deepEqual(layout(undone),layout(g));
});

// Implementation-owner regressions added after the independent review.
test('review follow-up: a full upper row grows its segment instead of overlapping an existing object',()=>{
 const s=world();s.initialItems=['a','b','c'];s.stages[0].locations=[];s.stages[1].caches![0].items=['fresh'];s.recipes.push({id:'old-pair',a:'a',b:'b',out:'out'});
 const g=M.createGame(s,320);g.state.tokens.forEach((t,i)=>{t.x=52+i*100;t.y=56;});const entered=next(s,g),line=layout(entered)!.dividerY;
 const made=M.applyAction(s,entered,{type:'combine',a:'a',b:'b'});assert(made.accepted);assert(active(made.game));const out=boxes(s,made.game).find(x=>x.id==='out')!;
 for(const old of boxes(s,made.game).filter(x=>['a','b','c','fresh'].includes(x.id)))assert(!overlap(out,old),'crowded birth must not create a new overlap with '+old.id);
 assert(layout(made.game)!.dividerY>line);assert(out.y+out.h/2<=layout(made.game)!.dividerY-20+1e-7);
});

test('review follow-up: tall lower transformations retain exact position without speculative future whitespace or a false crossing',()=>{
 const s=world();s.initialItems=['a'];s.stages[0].locations=[];s.recipes=[{id:'grow',a:'fresh',b:'second',out:'out',lifecycle:{fresh:{role:'transform',reason:'Fresh becomes the tall observation.'},second:{role:'retain',reason:'Reusable reference.'}}}];
 s.items.find(x=>x.id==='out')!.label='A very long observation with enough words to occupy many more visible lines than its small original input';
 s.stages[2].objectives=[{id:'stay',text:'Have out',kind:'create',item:'out'}];
 const entered=next(s,M.createGame(s)),fresh=structuredClone(M.token(entered.state,'fresh')!),line=layout(entered)!.dividerY;
 assert.equal(fresh.y-M.tokenHeight(s,fresh)/2,line+26,'actual new input size alone sets the gap');
 const made=M.applyAction(s,entered,{type:'combine',a:'fresh',b:'second'});assert(made.accepted);assert(active(made.game));const out=M.token(made.game.state,'out')!;
 assert.equal(out.x,fresh.x);assert.equal(out.y,fresh.y);assert.equal(layout(made.game)!.dividerY,line);
 // Birth growth may overlap. It is not a user cross-group move, so neither
 // relocate the exact replacement nor silently dismiss the separator.
 assert(out.y-M.tokenHeight(s,out)/2<line);assert.deepEqual(M.undo(made.game).game.state.tokens,entered.state.tokens);
});
