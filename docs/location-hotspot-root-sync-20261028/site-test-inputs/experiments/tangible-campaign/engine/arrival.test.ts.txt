import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from './model.ts';
import {decodeSave,encodeSave} from '../ui/save-codec.ts';
import type {Action,Scenario} from '../schema/scenario.ts';

const fixture:Scenario={schemaVersion:1,id:'arrivals',title:'A kitchen journey',premise:'Keep what you make.',
 items:['grain','water','dough','bowl','bread','herbs','meal'].map(id=>({id,label:id})),locations:[],initialItems:['grain','water'],
 recipes:[{id:'mix',a:'grain',b:'water',out:'dough'},{id:'bake',a:'dough',b:'bowl',out:'bread'},{id:'serve',a:'bread',b:'herbs',out:'meal'}],
 stages:[
  {id:'mix',title:'Mix',speaker:'Cook',motivation:'Mix.',area:{id:'camp',label:'Camp',travelText:'Start.'},objectives:[{id:'mix',text:'Mix dough',kind:'create',item:'dough'}]},
  {id:'bake',title:'Bake',speaker:'Cook',motivation:'Bake.',area:{id:'kitchen',label:'Kitchen',travelText:'Arrive.'},carry:['dough'],caches:[{id:'shelf',label:'Kitchen shelf',narrative:'The tools and herbs are here.',items:['water','dough','bowl','herbs']}],objectives:[{id:'bake',text:'Bake bread',kind:'create',item:'bread'}]},
  {id:'serve',title:'Serve',speaker:'Cook',motivation:'Stay here.',area:{id:'kitchen',label:'Kitchen',travelText:'Keep cooking.'},carry:[],caches:[],objectives:[{id:'serve',text:'Serve meal',kind:'create',item:'meal'}]},
 ]};
const arriveActions:Action[]=[{type:'combine',a:'grain',b:'water'},{type:'advance'}];
const atKitchen=()=>M.replay(fixture,arriveActions);
test('entry records actual new cache additions, carried creations and starting things separately',()=>{
 const initial=M.createGame(fixture);assert.deepEqual(initial.state.arrival?.here,['grain','water']);assert.equal(M.arrivalCue(initial.state,'grain'),null);
 const g=atKitchen();assert.deepEqual(g.state.arrival,{stage:1,area:'kitchen',supplies:[{item:'bowl',cache:'shelf'},{item:'herbs',cache:'shelf'}],carried:[{item:'dough',from:'camp'}],here:[]});
 assert.equal(M.arrivalCue(g.state,'bowl'),'new');assert.equal(M.arrivalCue(g.state,'dough'),'carried');assert.equal(M.arrivalCue(g.state,'water'),null);
 assert.equal(M.token(g.state,'water')?.area,'camp');assert.equal(g.state.tokens.filter(t=>t.kind==='dough').length,1);
 const view=M.arrivalView(fixture,g.state)!;assert.deepEqual(view.supplies.map(x=>[x.label,x.source]),[['bowl','Kitchen shelf'],['herbs','Kitchen shelf']]);assert.equal(view.carried[0].from,'Camp');
 assert(!JSON.stringify(view).includes('bread'));assert(!JSON.stringify(view).includes('meal'));
});
test('successful play does not erase unseen supply cues; creations are never supply arrivals',()=>{
 let g=atKitchen();const manifest=structuredClone(g.state.arrival);
 g=M.applyAction(fixture,g,{type:'move',item:'bowl',x:250,y:300}).game;
 assert.equal(M.arrivalCue(g.state,'herbs'),'new');assert.deepEqual(g.state.arrival,manifest);
 g=M.applyAction(fixture,g,{type:'combine',a:'dough',b:'bowl'}).game;
 assert.equal(M.arrivalCue(g.state,'bread'),null);assert.deepEqual(g.state.arrival,manifest);
 const undone=M.undo(g).game;assert.equal(M.arrivalCue(undone.state,'bread'),null);assert.equal(M.arrivalCue(undone.state,'dough'),'carried');
});
test('a chapter in the same kitchen neither re-grants supplies nor relocates existing things',()=>{
 const g=M.applyAction(fixture,atKitchen(),{type:'combine',a:'dough',b:'bowl'}).game;
 const next=M.applyAction(fixture,g,{type:'advance'}).game;
 assert.deepEqual(next.state.tokens,g.state.tokens);assert.deepEqual(next.state.places,g.state.places);
 assert.deepEqual(next.state.arrival?.supplies,[]);assert.deepEqual(next.state.arrival?.carried,[]);
 for(const t of next.state.tokens)assert.equal(M.arrivalCue(next.state,t.id),null);
 assert.deepEqual(next.state.arrival?.here,g.state.tokens.filter(t=>t.area==='kitchen').map(t=>t.id));
 assert.deepEqual(M.undo(next).game.state.arrival,g.state.arrival);
});
test('a genuine same-area cache distinguishes additions from things already here',()=>{
 const s=structuredClone(fixture);s.stages[2].caches=[{id:'late-shelf',label:'Later shelf',narrative:'A later delivery.',items:['herbs','meal']}];
 const g=M.replay(s,[...arriveActions,{type:'combine',a:'dough',b:'bowl'},{type:'advance'}]);
 assert.deepEqual(g.state.arrival?.supplies,[{item:'meal',cache:'late-shelf'}]);assert.equal(M.arrivalCue(g.state,'herbs'),null);assert.equal(M.arrivalCue(g.state,'meal'),'new');
});
test('visits and debug checkpoints cannot turn existing supplies or creations into fresh arrivals',()=>{
 const s=structuredClone(fixture);s.checkpoints=[{id:'ready',label:'Ready',actions:arriveActions}];
 const checkpoint=M.checkpoint(s,'ready');assert.deepEqual(checkpoint.state.arrival,atKitchen().state.arrival);
 const absent=M.applyAction(s,checkpoint,{type:'visit',area:'camp',carry:['dough']}).game;
 assert.equal(M.arrivalCue(absent.state,'dough'),null);assert.equal(M.arrivalCue(absent.state,'water'),null);
 const returned=M.applyAction(s,absent,{type:'visit',area:'kitchen',carry:['dough','water']}).game;
 assert.equal(M.arrivalCue(returned.state,'dough'),'carried');assert.equal(M.arrivalCue(returned.state,'water'),null);assert.deepEqual(returned.state.arrival,checkpoint.state.arrival);
});
test('compact save, bounded undo and restoration preserve exact arrival provenance',()=>{
 let g=atKitchen();const manifest=structuredClone(g.state.arrival);
 for(let i=0;i<105;i++)g=M.applyAction(fixture,g,{type:'move',item:'bowl',x:70+i%200,y:300}).game;
 assert.equal(g.history.length,100);const raw=encodeSave({game:g,tops:{camp:0,kitchen:400},seen:[0,1]});
 const restored=M.restore(fixture,JSON.stringify(decodeSave(raw).game));assert.deepEqual(restored,g);assert.deepEqual(restored.state.arrival,manifest);
 assert.equal(M.arrivalCue(restored.state,'bowl'),'new');assert.equal(M.arrivalCue(M.undo(restored).game.state,'dough'),'carried');
});
test('old or damaged arrival metadata never resets progress or invents provenance from history',()=>{
 const old=atKitchen();for(const st of [...old.history,old.state]){delete st.arrival;delete st.arrivalLayout;}
 const restored=M.restore(fixture,JSON.stringify(old));assert.deepEqual(restored,old);assert.equal(M.arrivalView(fixture,restored.state),null);assert.equal(M.arrivalCue(restored.state,'bowl'),null);
 assert.deepEqual(M.undo(restored).game.state.tokens,old.history.at(-1)!.tokens);
 for(const invalid of [null,{}, {stage:0,area:'camp',supplies:[],carried:[],here:[]}, {stage:1,area:'kitchen',supplies:[{item:'meal',cache:'shelf'}],carried:[],here:[]}]){
  const bad=structuredClone(old);(bad.state as any).arrival=invalid;assert.deepEqual(M.restore(fixture,JSON.stringify(bad)),old);
 }
 const next=M.replay(fixture,[...arriveActions,{type:'combine',a:'dough',b:'bowl'}]);delete next.state.arrival;
 assert.equal(M.applyAction(fixture,next,{type:'advance'}).game.state.arrival?.stage,2);
});
