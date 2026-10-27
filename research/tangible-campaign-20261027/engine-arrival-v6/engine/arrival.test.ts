import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import * as E from './model.ts';import * as Old from '../../frozen/v5/engine/model.ts';
import type {Scenario,Action} from '../schema/scenario.ts';import type {Game,State,Token} from './model.ts';
const fixture:Scenario={schemaVersion:1,id:'arrival',title:'Arrival',premise:'Layout-only regression fixture',items:['a','b','c','d','e'].map(id=>({id,label:id})),initialItems:['a','b','c','d','e'],locations:[{id:'home-place',label:'Home place'}],recipes:[],stages:[
 {id:'home',title:'Home',speaker:'Tester',motivation:'Hold a',area:{id:'home',label:'Home',travelText:'Home'},locations:['home-place'],objectives:[{id:'home-goal',kind:'create',item:'a',text:'Hold a'}]},
 {id:'away',title:'Away',speaker:'Tester',motivation:'Hold a',area:{id:'away',label:'Away',travelText:'Away'},carry:['a','b'],objectives:[{id:'away-goal',kind:'create',item:'a',text:'Hold a'}]},
 {id:'return',title:'Return',speaker:'Tester',motivation:'Hold a',area:{id:'home',label:'Home',travelText:'Home'},carry:['a','b'],objectives:[{id:'return-goal',kind:'create',item:'a',text:'Hold a'}]}
]};
const act=(s:Scenario,g:Game,a:Action)=>{const r=E.applyAction(s,g,a);assert.ok(r.accepted,r.message);return r.game;};
const height=(s:Scenario,t:Token)=>Math.max(44,26+(s.items.find(i=>i.id===t.kind)?.slots??[]).filter(sl=>sl.required||t.slots[sl.id]).length*20);
function clearArrivals(s:Scenario,state:State,ids:string[]){const boxes=[...state.tokens.filter(t=>t.area===state.currentArea).map(t=>({...t,w:96,h:height(s,t)})),...state.places.filter(t=>t.area===state.currentArea).map(t=>({...t,w:106,h:82}))];for(const t of boxes.filter(t=>ids.includes(t.id)))for(const o of boxes.filter(o=>o.id!==t.id))assert.ok(!(Math.abs(t.x-o.x)+t.w/2<=o.w/2&&Math.abs(t.y-o.y)+t.h/2<=o.h/2),`${t.id} hidden by ${o.id}`);}
const stableState=(s:State)=>({...s,metrics:{}});
for(const width of [320,375,600]){
 test(`Advance into an occupied old area changes only arriving positions at ${width}`,()=>{
  let g=E.createGame(fixture,width);g=act(fixture,g,{type:'advance'});g=act(fixture,g,{type:'move',item:'a',x:52,y:56});g=act(fixture,g,{type:'move',item:'b',x:152,y:56});const before=g;
  const oldTokens=g.state.tokens.filter(t=>t.area==='home'),places=structuredClone(g.state.places);g=act(fixture,g,{type:'advance'});
  for(const t of oldTokens)assert.deepEqual(E.token(g.state,t.id),t);assert.deepEqual(g.state.places,places);clearArrivals(fixture,g.state,['a','b']);
  assert.deepEqual(g.state.tokens.map(t=>t.id),before.state.tokens.map(t=>t.id));assert.deepEqual(g.events.at(-1)?.transfers,[{item:'a',from:'away',to:'home'},{item:'b',from:'away',to:'home'}]);
  assert.deepEqual(stableState(E.undo(g).game.state),stableState(before.state));assert.deepEqual(E.restore(fixture,JSON.stringify(g)),g);assert.deepEqual(act(fixture,before,{type:'advance'}),g);
 });
 test(`Manual visit uses the same arrival layout without moving old items at ${width}`,()=>{
  let g=act(fixture,E.createGame(fixture,width),{type:'advance'});g=act(fixture,g,{type:'move',item:'a',x:52,y:56});g=act(fixture,g,{type:'move',item:'b',x:152,y:56});const before=g;
  const g2=act(fixture,g,{type:'advance'});g=act(fixture,g,{type:'visit',area:'home',carry:['a','b']});
  assert.deepEqual(g.state.tokens,g2.state.tokens);assert.deepEqual(g.state.places,before.state.places);clearArrivals(fixture,g.state,['a','b']);
  for(const t of before.state.tokens.filter(t=>t.area==='home'))assert.deepEqual(E.token(g.state,t.id),t);
  assert.deepEqual(stableState(E.undo(g).game.state),stableState(before.state));
  const again=act(fixture,g,{type:'visit',area:'home',carry:['a','b']});assert.deepEqual(again.state.tokens,g.state.tokens);
 });
 test(`A source group's rigid shape and partial birth overlap survive simple travel at ${width}`,()=>{
  let g=E.createGame(fixture,width);for(const a of [{type:'move',item:'a',x:52,y:200},{type:'move',item:'b',x:90,y:230}] as Action[])g=act(fixture,g,a);
  const before=g.state.tokens.map(t=>({...t}));g=act(fixture,g,{type:'advance'});const a=E.token(g.state,'a')!,b=E.token(g.state,'b')!;assert.equal(a.x-b.x,-38);assert.equal(a.y-b.y,-30);assert.equal(a.y,56);
  for(const t of before.filter(t=>!['a','b'].includes(t.id)))assert.deepEqual(E.token(g.state,t.id),t);
 });
 test(`Fully coincident same-source arrivals are minimally separated at ${width}`,()=>{
  let g=E.createGame(fixture,width);for(const item of ['a','b'])g=act(fixture,g,{type:'move',item,x:152,y:300});g=act(fixture,g,{type:'advance'});clearArrivals(fixture,g.state,['a','b']);
  assert.deepEqual({x:E.token(g.state,'a')!.x,y:E.token(g.state,'a')!.y},{x:152,y:56});assert.ok(Math.max(...g.state.tokens.filter(t=>t.area==='away').map(t=>t.y))<=102);
 });
}
for(const [world,id,names] of [['elements','chapter-6',['bowl','flour','fiber']],['mars','chapter-9',['field-camera','bearing-map','crew-message']],['mars','chapter-13',['sprouted-tray','field-camera','greenhouse']],['ideas','chapter-21',['held-out-observations','accessible-appeal']]] as const)for(const width of [320,375,600])test(`${world} ${id} arrival regression and compactness ${width}`,()=>{
 const s:Scenario=JSON.parse(fs.readFileSync(new URL(`../../integration/release-v1/scenarios/${world}.json`,import.meta.url),'utf8'));const g=E.checkpoint(s,id,width),ids=g.events.at(-1)?.transfers?.map(t=>t.item)??[];clearArrivals(s,g.state,ids);
 assert.ok(g.state.tokens.filter(t=>t.area===g.state.currentArea).every(t=>t.x>=52&&t.x<=width-52&&t.y+height(s,t)/2<=400));
 const old=Old.checkpoint(s,id,width);assert.deepEqual(g.state.tokens.map(({x,y,...t})=>t),old.state.tokens.map(({x,y,...t})=>t));
 // All original named tokens remain present, even where their human labels differ from IDs.
 for(const name of names)if(old.state.tokens.some(t=>t.id===name))assert.ok(g.state.tokens.some(t=>t.id===name));
 assert.deepEqual(g,E.replay(s,s.checkpoints!.find(c=>c.id===id)!.actions,width));
});
