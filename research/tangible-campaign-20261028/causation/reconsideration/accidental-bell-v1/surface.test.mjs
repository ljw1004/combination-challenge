import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import * as M from './engine/model.ts';import {execute,visibleView} from './surface.mjs';
const s=JSON.parse(fs.readFileSync(new URL('./scenario.json',import.meta.url))),route=JSON.parse(fs.readFileSync(new URL('./author-route.json',import.meta.url)));
const drop=(g,a,b)=>execute(M,s,g,'drop',[a,b]);
test('surface starts honestly and withholds descriptions, future story and recipes',()=>{
 const v=visibleView(M,s,M.createGame(s)),j=JSON.stringify(v);assert.equal(v.stage.number,1);assert.equal(v.things.length,2);
 assert(!j.includes('pierced rim'));assert(!j.includes('gust'));assert(!j.includes('recipe'));assert(!j.includes('description'));assert(!j.includes('visitor-call'));
});
test('normal five-drop session auto-advances and exposes incident in next mission, never as an explanation toast',()=>{
 let g=M.createGame(s),r;
 for(const [i,[a,b]] of [['blank','mallet'],['basin','@wash'],['basin','hanger'],['mallet','gong'],['gong','@gate']].entries()){
  r=drop(g,a,b);assert(r.response.accepted);g=r.game;
  if(i===1){assert.equal(r.view.stage.number,2);assert.match(r.view.stage.motivation,/gust rocks it against the iron latch/);assert(!JSON.stringify(r.view).includes(s.stages[0].completionText));assert.equal(r.transitions.length,1);}
 }
 assert(g.state.completed);assert.match(r.view.ending,/keeper comes out and opens the gate/);assert.equal(g.events.length,7);
});
test('highlight offers current partner labels, never output previews or recipe descriptions',()=>{
 const g=M.createGame(s),r=execute(M,s,g,'highlight',['blank']);assert.deepEqual(r.response.highlighted,[{id:'mallet',label:'Wooden mallet'}]);
 assert(!JSON.stringify(r.response).includes('basin'));assert.deepEqual(r.game,g);
});
test('generic descriptions cannot be smuggled through Read; no fake reading tile',()=>{
 assert(s.items.every(i=>!i.reading));const g=M.createGame(s);assert.throws(()=>execute(M,s,g,'read',['blank']),/no authored Read source/);assert.equal(g.events.length,0);
});
test('undo matches raw UI undo: automatic advance is undone alone, not silently two actions',()=>{
 let g=drop(M.createGame(s),'blank','mallet').game;g=drop(g,'basin','@wash').game;
 const r=execute(M,s,g,'undo',[]);assert.equal(r.game.state.stage,0);assert(M.stageComplete(s,r.game.state));assert.equal(r.transitions.length,0);
 const back=execute(M,s,r.game,'mission',[]);assert.equal(back.game.state.stage,1);
});
test('no route, reset or checkpoint command exists in player surface',()=>{
 for(const cmd of ['route','reset','checkpoint','advance'])assert.throws(()=>execute(M,s,M.createGame(s),cmd,[]),/Unknown command/);
});
test('note is observational; invalid pairs do not expose private recipe rationale',()=>{
 const g=M.createGame(s),n=execute(M,s,g,'note',['Trying the things on the bench.']);assert.deepEqual(n.game,g);
 let gate=M.replay(s,route.slice(0,3));const r=drop(gate,'basin','mallet');assert(!r.response.accepted);assert.equal(r.response.visibleOutcome,'No visible change.');assert(!('message' in r.response));
});
test('all supported sample widths, reversed pairs and placement-first sequences settle in five drops',()=>{
 for(const width of [320,360,600])for(const rev of [false,true])for(const early of [false,true]){
  let g=M.createGame(s,width);let moves=early?[['blank','@wash'],['blank','mallet'],['basin','@gate'],['basin','hanger'],['mallet','gong']]:[['blank','mallet'],['basin','@wash'],['basin','hanger'],['mallet','gong'],['gong','@gate']];
  for(let [a,b] of moves){if(rev&&!b.startsWith('@'))[a,b]=[b,a];const r=drop(g,a,b);assert(r.response.accepted);g=r.game;}
  assert(g.state.completed);assert.equal(g.state.metrics.combinations,3);assert.equal(g.state.metrics.placements,2);
 }
});
