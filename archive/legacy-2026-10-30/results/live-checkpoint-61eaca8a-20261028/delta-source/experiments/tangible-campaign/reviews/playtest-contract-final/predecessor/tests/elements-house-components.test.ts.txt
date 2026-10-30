// Logical model/source checks only. No browser, DOM or native interaction claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {scenario as s} from '../experiments/tangible-campaign/ui/campaigns/elements-house-components.ts';
import {scenario as old} from '../experiments/tangible-campaign/ui/campaigns/elements-opening-wheel.ts';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import * as L from '../experiments/tangible-campaign/schema/lifecycle.ts';
import type {Action, Scenario} from '../experiments/tangible-campaign/schema/scenario.ts';

const output = new URL('../results/elements-house-components-v1/', import.meta.url);
fs.mkdirSync(output, {recursive:true});
const c = (a:string,b:string):Action => ({type:'combine',a,b});
const route = s.checkpoints!.find(cp=>cp.id==='complete')!.actions;
const pair = (a:string,b:string) => [a,b].sort().join('|');
function act(g:M.Game,a:Action,world=s) {const r=M.applyAction(world,g,a);assert(r.accepted,`${JSON.stringify(a)}: ${r.message}`);return r;}
function run(actions:Action[],world=s,width=360) {
  let g=M.createGame(world,width);const createdAt=new Map<string,number>();
  const rows=world.stages.map(st=>({id:st.id,created:[] as string[],priorUsed:[] as string[],connected:[] as string[]}));
  let edges=new Map<string,Set<string>>();
  for(const a of actions) {
    const stage=g.state.stage,r=act(g,a,world);
    for(const t of g.state.tokens) if(!M.token(r.game.state,t.id)) assert(a.type==='combine'&&[a.a,a.b].includes(t.id),`unrelated removal of ${t.id}`);
    if(a.type==='combine') {
      const inputs=[a.a,a.b].filter(k=>!k.startsWith('@'));
      for(const k of inputs) if(createdAt.has(k)&&createdAt.get(k)!<stage) rows[stage].priorUsed.push(k);
      const out=r.created??r.updated;
      if(out){const deps=edges.get(out)??new Set<string>();for(const k of inputs)deps.add(k);edges.set(out,deps);}
      if(r.created){createdAt.set(r.created,stage);rows[stage].created.push(r.created);}
    }
    if(a.type==='advance') {
      const connected=new Set<string>(),visited=new Set<string>();
      const walk=(id:string)=>{if(visited.has(id))return;visited.add(id);for(const input of edges.get(id)??[]){if(createdAt.has(input)&&createdAt.get(input)!<stage)connected.add(input);if(input!==id)walk(input);}};
      for(const goal of M.objectiveStates(world,g.state))for(const id of goal.witnesses.length?goal.witnesses:goal.intermediate&&goal.item?[goal.item]:[])walk(id);
      rows[stage].connected=[...connected];edges=new Map();
    }
    g=r.game;g.history=[];
  }
  return {game:g,rows};
}
function swap(actions:Action[],a:string,b:string,replacement:Action[]) {let n=0;const result=actions.flatMap(x=>{if(x.type==='combine'&&pair(x.a,x.b)===pair(a,b)){n++;return replacement;}return [x];});assert.equal(n,1,`${a}+${b}`);return result;}
const shelterRoute = route.slice(s.checkpoints!.find(cp=>cp.id==='chapter-3')!.actions.length,s.checkpoints!.find(cp=>cp.id==='chapter-4')!.actions.length-1);
function shelterBeforeMat(){let g=M.checkpoint(s,'chapter-3');for(const a of shelterRoute.slice(0,-1))g=act(g,a).game;return g;}

test('isolated structural identity, exact predecessor and minimal content delta',()=>{
  assert.equal(s.id,'elements-house-components-v1');assert.notEqual(s.id,old.id);
  assert.deepEqual([...M.validateScenario(s),...L.validateContentLifecycles([s]),...L.validateObjectiveFlow([s]),...L.validateConstructionContinuity([s])],[]);
  assert.deepEqual(s.initialItems,old.initialItems);assert.deepEqual(s.locations,old.locations);
  assert.deepEqual(s.items.filter(i=>!['house','hearth'].includes(i.id)),old.items.filter(i=>i.id!=='house'));
  assert.deepEqual(s.recipes.slice(0,old.recipes.length),old.recipes);
  assert.deepEqual(s.stages.filter(st=>st.id!=='shelter'),old.stages.filter(st=>st.id!=='shelter'));
  assert(!old.items.some(i=>i.id==='hearth'));assert(!old.recipes.some(r=>pair(r.a,r.b)==='fire|stone'));
  assert.equal(s.recipes.filter(r=>pair(r.a,r.b)==='fire|stone').length,1);
  assert.equal(s.items.filter(i=>i.id==='hearth').length,1);
  assert(!s.recipes.some(r=>r.out&&[r.a,r.b].includes('house')),'no downstream House conversion loses fitted parts');
});

test('canonical full route keeps first ten and all 29 later chapters use earlier creations for actual goals',()=>{
  const {game,rows}=run(route);assert(game.state.completed);
  assert.deepEqual(rows.flatMap(r=>r.created).slice(0,10),['clay','stone','brick','rain','plant','grain','flour','dough','flatbread','fruit']);
  for(const row of rows.slice(1))assert(row.connected.length,`${row.id} lacks goal-connected earlier creation`);
  assert(rows[2].connected.includes('brick'));assert(rows[2].connected.includes('stone'));
  const house=M.token(game.state,'house')!;assert.equal(house.area,'area-shelter');assert.deepEqual(house.slots,{window:'window','sleeping-mat':'sleeping-mat'});
  assert(!M.token(game.state,'sleeping-mat'));assert(house.incorporated.includes('sleeping-mat'));
  fs.writeFileSync(new URL('canonical-route.json',output),JSON.stringify({scope:'Author-aware logical engine replay, not human or UI evidence.',completed:game.state.completed,metrics:game.state.metrics,rows,house},null,2)+'\n');
});

test('every checkpoint is an earned prefix, round-trips exactly, and predecessor saves remain separate',()=>{
  for(const cp of s.checkpoints!){assert.deepEqual(cp.actions,route.slice(0,cp.actions.length));const g=M.checkpoint(s,cp.id);assert.deepEqual(M.restore(s,JSON.stringify(g)),g);}
  for(const cp of old.checkpoints!){const g=M.checkpoint(old,cp.id);assert.deepEqual(M.restore(old,JSON.stringify(g)),g);assert.throws(()=>M.restore(s,JSON.stringify(g)));}
});

test('two blank slots, build-then-furnish goal, no gold or completion before both components',()=>{
  let g=M.checkpoint(s,'chapter-3');assert.deepEqual(M.visibleObjectives(s,g.state).map(o=>o.text),['Build a house']);
  for(const a of shelterRoute.slice(0,2))g=act(g,a).game;
  assert.deepEqual(M.visibleObjectives(s,g.state).map(o=>o.text),['Fit window and sleeping mat']);
  let view=M.playerView(s,g).things.find(t=>t.id==='house')!;
  assert.deepEqual(view.slots,[{id:'slot1',filled:false,label:null},{id:'slot2',filled:false,label:null}]);assert(!view.gold);assert(!view.functional);
  for(const a of shelterRoute.slice(2,-1))g=act(g,a).game;
  view=M.playerView(s,g).things.find(t=>t.id==='house')!;assert.deepEqual(view.slots.map(x=>x.label),['Window',null]);assert(!view.gold);assert(!M.stageComplete(s,g.state));
  assert(!M.applyAction(s,g,{type:'advance'}).accepted);
  const before=M.token(g.state,'house')!;g=act(g,c('sleeping-mat','house')).game;
  const house=M.token(g.state,'house')!;assert.equal(house.id,before.id);assert.equal(house.x,before.x);assert.equal(house.y,before.y);assert.equal(house.area,before.area);
  assert(M.stageComplete(s,g.state));assert(M.capabilities(s,house).includes('daylit-shelter'));assert(M.capabilities(s,house).includes('restful-shelter'));assert(M.gold(s,g.state).items.includes('house'));
});

test('window supply survives its fitting for future uses; mat physically incorporates; exact undo/save',()=>{
  let g=M.checkpoint(s,'chapter-3');for(const a of shelterRoute.slice(0,5))g=act(g,a).game;
  const outside=M.token(g.state,'window')!,base=M.token(g.state,'house')!;
  const fit=act(g,c('window','house'));assert.deepEqual(M.token(fit.game.state,'window'),outside);assert.equal(M.token(fit.game.state,'house')!.id,base.id);assert(!fit.retired?.includes('window'));
  for(const a of shelterRoute.slice(5,-1))g=act(g,a).game;
  const before=structuredClone(g),r=act(g,c('sleeping-mat','house'));assert.deepEqual(r.retired,['sleeping-mat']);assert(!M.token(r.game.state,'sleeping-mat'));
  assert.deepEqual(M.restore(s,JSON.stringify(r.game)),r.game);
  const undone=M.undo(r.game).game;assert.deepEqual({...undone.state,metrics:before.state.metrics},before.state);assert.deepEqual(undone.history,before.history);
  assert(M.token(undone.state,'sleeping-mat'));assert(!M.token(undone.state,'house')!.slots['sleeping-mat']);
  assert.deepEqual(act(undone,c('house','sleeping-mat')).game.state.tokens,r.game.state.tokens);
  assert(!M.applyAction(s,r.game,c('sleeping-mat','house')).accepted);
});

test('mat-first and window-first, either drag direction, optional Hearth all preserve the same House',()=>{
  for(const matFirst of [false,true])for(const reverse of [false,true])for(const warm of [false,true]) {
    const fit=(k:string)=>reverse?c('house',k):c(k,'house');
    let g=M.checkpoint(s,'chapter-3');
    for(const a of shelterRoute.filter(a=>a.type!=='combine'||![a.a,a.b].includes('house')))g=act(g,a).game;
    const before=structuredClone(M.token(g.state,'house')!);
    if(warm){assert(M.partners(s,g.state,'stone').partners.includes('fire'));g=act(g,c('stone','fire')).game;assert(M.token(g.state,'stone'));g=act(g,fit('hearth')).game;assert(!M.token(g.state,'hearth'));assert(M.token(g.state,'house')!.incorporated.includes('hearth'));}
    g=act(g,fit(matFirst?'sleeping-mat':'window')).game;assert(!M.stageComplete(s,g.state));assert(!M.gold(s,g.state).items.includes('house'));
    g=act(g,fit(matFirst?'window':'sleeping-mat')).game;assert(M.stageComplete(s,g.state));
    const h=M.token(g.state,'house')!;assert.equal(h.id,before.id);assert.equal(h.x,before.x);assert.equal(h.y,before.y);
    assert.deepEqual(M.playerView(s,g).things.find(t=>t.id==='house')!.slots.map(x=>x.label),warm?['Window','Sleeping mat','Hearth']:['Window','Sleeping mat']);
    const copy=structuredClone(h);g=act(g,{type:'advance'}).game;assert.deepEqual(M.token(g.state,'house'),copy);assert.deepEqual(M.restore(s,JSON.stringify(g)),g);
    for(const a of route.slice(s.checkpoints!.find(cp=>cp.id==='chapter-4')!.actions.length)){g=act(g,a).game;g.history=[];}assert(g.state.completed);assert.deepEqual(M.token(g.state,'house'),copy);
  }
});

test('Hearth is optional, can be made early without starving Stone, and survives travel until explicitly fitted',()=>{
  let g=M.createGame(s);for(const a of route.slice(0,2))g=act(g,a).game;g=act(g,c('stone','fire')).game;
  const hearth=structuredClone(M.token(g.state,'hearth')!);assert(M.token(g.state,'stone'));assert(M.token(g.state,'fire'));
  for(const a of route.slice(2)){g=act(g,a).game;g.history=[];}assert(g.state.completed);assert.deepEqual(M.token(g.state,'hearth'),hearth);assert(!M.token(g.state,'house')!.slots.hearth);
});

test('96 existing alternate families finish both cold and warm, forward and reversed: 384 full routes',()=>{
  const results=[];
  for(const juice of [false,true])for(const waterwheel of [false,true])for(const slide of [false,true])for(const herbarium of [false,true])for(const weather of [0,1,2])for(const feast of [false,true])for(const warm of [false,true])for(const reverse of [false,true]){
    let a=route;
    if(juice)a=swap(a,'fruit','water',[c('fruit','stone')]);
    if(waterwheel)a=swap(a,'planks','water',[c('water','wheel')]);
    if(slide){a=swap(a,'glass','planks',[]);a=swap(a,'pond-water','glass-slide',[c('pond-water','glass')]);}
    if(herbarium){a=swap(a,'plant','paper',[]);a=swap(a,'pressed-specimen','bound-book',[c('plant','bound-book')]);}
    if(weather===1){a=swap(a,'paper','rain-gauge',[c('windsock','paper')]);a=swap(a,'windsock','rain-record',[c('wind-record','rain-gauge')]);}
    if(weather===2){a=swap(a,'paper','rain-gauge',[c('paper','rain-gauge'),c('windsock','paper')]);a=swap(a,'windsock','rain-record',[c('wind-record','rain-record')]);}
    if(feast)a=swap(a,'porridge','compote',[c('bread','fruit')]);
    if(warm)a=swap(a,'sleeping-mat','house',[c('stone','fire'),c('hearth','house'),c('sleeping-mat','house')]);
    // Place-specific recipes are intentionally directional toward the placed receiver.
    if(reverse)a=a.map(x=>x.type==='combine'&&!x.b.startsWith('@')&&!s.recipes.some(r=>r.at&&pair(r.a,r.b)===pair(x.a,x.b))?c(x.b,x.a):x);
    const result=run(a);assert(result.game.state.completed);for(const row of result.rows.slice(1))assert(row.connected.length,row.id);
    results.push({juice,waterwheel,slide,herbarium,weather,feast,warm,reverse,completed:true});
  }
  assert.equal(results.length,384);fs.writeFileSync(new URL('alternate-routes.json',output),JSON.stringify({scope:'Author-aware logical full routes; not human or browser evidence.',results},null,2)+'\n');
});

test('House slot view uses the existing unlabelled grammar; runtime and stylesheet are not changed',()=>{
  const main=fs.readFileSync(new URL('../experiments/tangible-campaign/ui/campaign-main.ts',import.meta.url),'utf8');
  assert(main.includes(".filter(sl=>sl.required||t.slots[sl.id])"));
  assert(main.includes("t.slots[sl.id]?esc(M.item(s,t.slots[sl.id])!.label):''"));
  assert.equal(M.tokenHeight(s,M.token(shelterBeforeMat().state,'house')!),80);
});
