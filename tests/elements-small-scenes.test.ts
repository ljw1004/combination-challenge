import {readSiteSourceForRootTests,writeRootTestOutput} from '../scripts/site-source-test-context.ts';
const readFileSync=readSiteSourceForRootTests;
import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync as originalReadFileSync} from 'node:fs';
import type {Action,Scenario} from '../experiments/tangible-campaign/schema/campaign.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import {toLegacyGame} from '../experiments/tangible-campaign/compatibility/v1.ts';
import {scenario as s} from '../experiments/tangible-campaign/ui/stories/elements-small-scenes.ts';
import {scenario as merged} from '../experiments/tangible-campaign/ui/stories/elements-locations.ts';
import {scenario as prior} from '../experiments/tangible-campaign/ui/stories/elements-house-and-craft.ts';
import {applyMilestones} from '../experiments/tangible-campaign/ui/current-campaign.ts';
import {locationHarness} from '../experiments/tangible-campaign/ui/location-controller-harness.ts';
const route=s.checkpoints!.find(c=>c.id==='complete')!.actions;
const withoutMetrics=({metrics,...state}:M.State)=>state;
const local=(g:M.Game)=>g.state.tokens.filter(t=>t.location===g.state.storyLocation);
const act=(g:M.Game,a:Action)=>{const r=M.applyAction(s,g,a);assert.ok(r.accepted,JSON.stringify(a)+': '+r.message);return r.game;};
const chapterEnd=(chapter:number)=>{let g=M.createGame(s,375);for(const a of route){if(g.state.chapter===chapter&&a.type==='advance')return g;g=act(g,a);}throw Error('Missing chapter');};

test('opening successor keeps old world, recipes, goals, stock and save identities intact',()=>{
 assert.equal(merged.id,'elements-river-locations-v2');assert.notEqual(s.id,merged.id);
 assert.deepEqual(s.recipes,merged.recipes);assert.deepEqual(s.items,merged.items);assert.deepEqual(s.hotspots,merged.hotspots);
 assert.deepEqual(s.chapters.map(c=>[c.id,c.objectives,c.onAlreadyComplete]),merged.chapters.map(c=>[c.id,c.objectives,c.onAlreadyComplete]));
 assert.deepEqual(s.locationPlan!.locations.flatMap(l=>l.stockBatches),merged.locationPlan!.locations.flatMap(l=>l.stockBatches));
 assert.deepEqual(s.chapters[3].entryCue!.text,'The brook divides the clearing. A bridge and cart would be easier.');
 assert.equal(s.locationPlan!.locations.length,11);
 for(const id of ['E01-orchard-edge','E01-home-site','E01-stream-bank']){const l=s.locationPlan!.locations.find(l=>l.id===id)!;assert.deepEqual(l.stockBatches,[]);assert.deepEqual(l.hotspots,[]);assert(readFileSync(new URL('../public'+l.background.asset,import.meta.url)).length>1000);}
 for(const old of [prior,merged]){const g=M.createGame(old);assert.deepEqual(M.restore(old,JSON.stringify(toLegacyGame(g))),g);assert.throws(()=>M.restore(s,JSON.stringify(g)),/Invalid campaign save/);}
 assert.deepEqual(M.validateScenario(s),[]);
});

for(const width of [320,375,390])for(const mode of ['combine','drop','reverse-ordinary-drop'])test(`full Elements canonical route ${width}/${mode}: ownership, no new carry overlap, save and Undo`,()=>{
 let g=M.createGame(s,width);
 for(const source of route){
  // A catalyst is directional: the receiver must be placed at its hotspot.
  // Hotspots are fixed targets, never draggable operands. Preserve those legal
  // directions while exercising the other direction of every ordinary pair.
  const reverse=source.type==='combine'&&mode==='reverse-ordinary-drop'&&!source.a.startsWith('@')&&!source.b.startsWith('@')&&!s.recipes.some(r=>r.at&&[r.a,r.b].includes(source.a)&&[r.a,r.b].includes(source.b));
  const a:Action=source.type==='combine'&&mode!=='combine'?{type:'drop',item:reverse?source.b:source.a,target:reverse?source.a:source.b}:source;
  const before=g;g=act(g,a);
  if(a.type==='advance'){
   assert.deepEqual(withoutMetrics(M.undo(g).game.state),withoutMetrics(before.state));
   assert.deepEqual(M.restore(s,JSON.stringify(toLegacyGame(g))).state,g.state);
   const area=(a:M.Token,b:M.Token)=>Math.max(0,96-Math.abs(a.x-b.x))*Math.max(0,(M.tokenHeight(s,a)+M.tokenHeight(s,b))/2-Math.abs(a.y-b.y));
   for(const t of g.state.tokens.filter(t=>M.token(before.state,t.id)?.location!==t.location))for(const b of g.state.tokens.filter(b=>b.id!==t.id&&b.location===t.location&&M.token(before.state,b.id))){const a0=M.token(before.state,t.id)!,b0=M.token(before.state,b.id)!;assert(area(t,b)<=(a0.location===b0.location?area(a0,b0):0)+.01,`${t.id}/${b.id}: new carry overlap`);}
  }
  for(const t of g.state.tokens){assert(t.x>=48&&t.x<=g.state.width-48);assert(t.y-M.tokenHeight(s,t)/2>=0&&t.y+M.tokenHeight(s,t)/2<=844);}
 }
 assert(g.state.completed);assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);
});

test('first four authored working sets exactly restore pre-consolidation entry and peak cadence',()=>{
 const measure=(world:Scenario)=>{let g=M.createGame(world,375),rows:{entry:number;peak:number;items:string[]}[]=[];for(const a of route){if(g.state.chapter>3)break;const things=g.state.tokens.filter(t=>t.location===g.state.currentLocation);const row=rows[g.state.chapter]??=( {entry:things.length,peak:0,items:things.map(t=>t.kind).sort()} );row.peak=Math.max(row.peak,things.length);const r=M.applyAction(world,g,a);assert(r.accepted,r.message);g=r.game;}return rows;};
 const restored=measure(s);assert.deepEqual(restored,measure(applyMilestones(prior)));assert.deepEqual(restored.map(r=>[r.entry,r.peak]),[[4,7],[5,13],[6,15],[6,14]]);
 assert.deepEqual(restored[3].items,['cloth','fiber','stone','thread','water','wood']);
 assert.deepEqual(measure(merged).map(r=>[r.entry,r.peak]),[[4,7],[7,15],[15,24],[23,31]]);
 const g=act(chapterEnd(2),{type:'advance'});assert.equal(g.state.locations.length,4);
 for(const id of ['house','window'])assert.equal(M.token(g.state,id)!.location,'E01-home-site');
 for(const id of ['flatbread','juice'])assert.equal(M.token(g.state,id)!.location,'E01-orchard-edge');
 assert.equal(M.token(g.state,'brick')!.location,'E01-home-site');
 assert(!g.state.arrivalLayout?.active);assert.deepEqual(g.state.arrival!.supplies,[]);
});

test('early Handcart stays earned, uses state-sensitive carry and leaves its redundant ingredients behind',()=>{
 let g=chapterEnd(2);
 for(const a of [{type:'combine',a:'wood',b:'stone'},{type:'combine',a:'axe',b:'wood'},{type:'combine',a:'planks',b:'stone'},{type:'combine',a:'wheel',b:'wood'},{type:'combine',a:'planks',b:'axle'}] as Action[])g=act(g,a);
 const before=g;g=act(g,{type:'advance'});assert.equal(g.state.chapter,3);assert.equal(M.token(g.state,'handcart')!.location,'E01-stream-bank');
 assert.deepEqual(local(g).map(t=>t.kind).sort(),['cloth','fiber','handcart','planks','thread','water']);
 for(const id of ['stone','wood','axe','wheel'])assert.equal(M.token(g.state,id)!.location,'E01-home-site');
 assert(M.visibleObjectives(s,g.state).some(o=>o.item==='handcart'));
 assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);assert.deepEqual(withoutMetrics(M.undo(g).game.state),withoutMetrics(before.state));
 for(const a of [{type:'combine',a:'fiber',b:'thread'},{type:'combine',a:'planks',b:'rope'},{type:'combine',a:'fiber',b:'water'},{type:'combine',a:'pulp',b:'cloth'},{type:'combine',a:'footbridge',b:'paper'},{type:'advance'}] as Action[])g=act(g,a);
 assert.equal(g.state.chapter,4);
});

test('legitimate early crossing inventions skip the completed beat, preserving both panels and bridge policy',()=>{
 let g=chapterEnd(2);
 // Water remains at the orchard: deliberate retrieval, not a new source grant.
 g=act(g,{type:'relocate',item:'water',location:'E01-home-site',x:330,y:710});
 const actions:Action[]=[{type:'combine',a:'wood',b:'stone'},{type:'combine',a:'axe',b:'wood'},{type:'combine',a:'fiber',b:'thread'},{type:'combine',a:'planks',b:'rope'},{type:'combine',a:'planks',b:'stone'},{type:'combine',a:'wheel',b:'wood'},{type:'combine',a:'planks',b:'axle'},{type:'combine',a:'fiber',b:'water'},{type:'combine',a:'pulp',b:'cloth'},{type:'combine',a:'footbridge',b:'paper'}];
 for(const a of actions)g=act(g,a);
 const before=g;g=act(g,{type:'advance'});assert.equal(g.state.chapter,4);assert(g.state.skippedChapters?.includes('crossing'));
 assert(g.state.locations.some(l=>l.id==='E01-stream-bank'));assert.equal(M.currentEntryCue(s,g)!.sourceCaption,'Mill bend');
 assert.deepEqual(g.state.discovered,before.state.discovered);assert.equal(g.state.tokens.filter(t=>t.kind==='handcart').length,1);assert.equal(g.state.tokens.filter(t=>t.kind==='footbridge').length,1);
 assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);assert.deepEqual(withoutMetrics(M.undo(g).game.state),withoutMetrics(before.state));
});

test('both bridge-first and cart-first orders keep visible local ingredients and duplicate prevention',()=>{
 const bridge:Action[]=[{type:'combine',a:'fiber',b:'thread'},{type:'combine',a:'planks',b:'rope'}];
 const cart:Action[]=[{type:'combine',a:'planks',b:'stone'},{type:'combine',a:'wheel',b:'wood'},{type:'combine',a:'planks',b:'axle'}];
 for(const order of [[...bridge,...cart],[...cart,...bridge]])for(const reverse of [false,true]){
  let g=act(chapterEnd(2),{type:'advance'});
  for(const a of [{type:'combine',a:'wood',b:'stone'},{type:'combine',a:'axe',b:'wood'},...order,{type:'combine',a:'fiber',b:'water'},{type:'combine',a:'pulp',b:'cloth'},{type:'combine',a:'footbridge',b:'paper'}] as Action[]){const action=a.type==='combine'&&reverse?{...a,a:a.b,b:a.a}:a;g=act(g,action);}
  assert(M.chapterComplete(s,g.state));assert.equal(g.state.tokens.filter(t=>t.kind==='handcart').length,1);assert.equal(g.state.tokens.filter(t=>t.kind==='footbridge').length,1);
  assert.equal(M.applyAction(s,g,{type:'combine',a:'planks',b:'rope'}).accepted,false);assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);
 }
});

test('synthetic controller keeps all four owned panels and earlier creations in scrollback',()=>{
 const g=act(chapterEnd(2),{type:'advance'}),h=locationHarness(s,JSON.stringify({game:toLegacyGame(g),seen:[],tops:{}}),{width:375});
 for(const id of ['E01','E01-orchard-edge','E01-home-site','E01-stream-bank'])assert(h.app.innerHTML.includes(`data-background="${id}"`),id);
 for(const id of ['house','flatbread','juice','footbridge'])assert.equal(!!h.thing(id),!!M.token(g.state,id));
 assert.match(h.app.innerHTML,/height:3376px/);
 assert.equal(h.button('mission').dataset['cue-id'],s.chapters[3].entryCue!.id);
 assert(h.app.innerHTML.includes('The brook divides the clearing. A bridge and cart would be easier.'));
});

test('optional earlier experiments remain tangible but do not travel into the stream-bank clue set',()=>{
 let g=chapterEnd(1);
 for(const a of [{type:'combine',a:'stone',b:'water'},{type:'combine',a:'plant',b:'rain'},{type:'advance'}] as Action[])g=act(g,a);
 for(const a of route.slice(13,24))g=act(g,a);
 for(const a of [{type:'combine',a:'stone',b:'brick'},{type:'combine',a:'brick',b:'fire'}] as Action[])g=act(g,a);
 for(const id of ['hammer','flowers','arch','kiln'])assert(M.token(g.state,id));
 const before=g;g=act(g,{type:'advance'});
 assert.deepEqual(local(g).map(t=>t.kind).sort(),['cloth','fiber','stone','thread','water','wood']);
 for(const t of before.state.tokens.filter(t=>!local(g).some(c=>c.id===t.id)))assert.deepEqual(M.token(g.state,t.id),t);
});
