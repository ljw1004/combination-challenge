import {readSiteSourceForRootTests,writeRootTestOutput} from '../scripts/site-source-test-context.ts';
const writeFileSync=writeRootTestOutput;
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync as originalWriteFileSync} from 'node:fs';
import type {Action} from '../experiments/tangible-campaign/schema/campaign.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import {elements as before} from '../experiments/tangible-campaign/ui/stories/elements-waterworks-v1.ts';
import {withElementsBasketContinuity} from '../experiments/tangible-campaign/ui/stories/elements-basket-continuity-v1.ts';
import {toLegacyScenario,toLegacyGame} from '../experiments/tangible-campaign/compatibility/v1.ts';
import {validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from '../experiments/tangible-campaign/schema/lifecycle.ts';
import {validateLifecycleGraph} from '../experiments/tangible-campaign/schema/lifecycle-graph.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
const beforeJSON=JSON.stringify(before),s=withElementsBasketContinuity(before);
const dir=new URL('../results/elements-basket-continuity-v1/',import.meta.url);mkdirSync(dir,{recursive:true});
const write=(name:string,x:unknown)=>writeFileSync(new URL(name+'.json',dir),JSON.stringify(x,null,2)+'\n');
const route=s.checkpoints!.find(c=>c.id==='complete')!.actions;
const pair=(a:string,b:string)=>[a,b].sort().join('|');
const recipe=(a:Action)=>a.type==='combine'?s.recipes.find(r=>pair(r.a,r.b)===pair(a.a,a.b)):undefined;
const index=(id:string)=>s.chapters.findIndex(c=>c.id===id);
const local=(g:M.Game)=>g.state.tokens.filter(t=>t.location===g.state.storyLocation);
const names=(g:M.Game)=>local(g).map(t=>t.kind);
const noMetrics=({metrics,...other}:M.State)=>other;
function step(g:M.Game,a:Action){const r=M.applyAction(s,g,a);assert(r.accepted,`${s.chapters[g.state.chapter].id}: ${JSON.stringify(a)} ${r.message}`);return r.game;}
function durable(g:M.Game){assert.deepEqual(M.restore(s,JSON.stringify(g)),g);assert.deepEqual(M.restore(s,JSON.stringify(toLegacyGame(g))),g);assert.deepEqual(M.restore(s,JSON.stringify(decodeSave(encodeSave({game:toLegacyGame(g),seen:[],tops:{}})).game)),g);}
function checkpoint(id:string,width=320){return M.checkpoint(s,`chapter-${index(id)+1}`,width);}
function block(id:string){const start=s.checkpoints![index(id)].actions.length;const tail=route.slice(start);return tail.slice(0,tail.findIndex(a=>a.type==='advance'));}
function assertFixed(g:M.Game){if(g.state.discovered.includes('kiln')){const kiln=M.token(g.state,'kiln');if(kiln)assert.equal(kiln.location,'E05');}assert.equal(g.state.tokens.length,new Set(g.state.tokens.map(t=>t.id)).size);}

test('additive helper keeps predecessor exact; changed pair is unique, recognizable, and complete lifecycle graph is clean',()=>{
 assert.equal(JSON.stringify(before),beforeJSON);assert.notEqual(s.id,before.id);
 assert.deepEqual(M.validateScenario(s),[]);const l=toLegacyScenario(s);for(const f of [validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity,validateLifecycleGraph])assert.deepEqual(f([l]),[]);
 assert.deepEqual(s.recipes.filter(r=>pair(r.a,r.b)===pair('fiber','rope')).map(r=>r.id),['basket']);assert.equal(s.items.some(i=>i.id==='cord'),false);
 assert.deepEqual(s.recipes.find(r=>r.id==='picnic-basket'),before.recipes.find(r=>r.id==='picnic-basket'));
 assert.deepEqual(s.recipes.filter(r=>[r.a,r.b].includes('basket')).map(r=>r.id),['picnic-basket']);
 assert.deepEqual(s.recipes.filter(r=>[r.a,r.b].includes('bowl')).map(r=>r.id),['jar','glazed-bowl']);
 assert.deepEqual(s.recipes.filter(r=>JSON.stringify(r)!==JSON.stringify(before.recipes.find(x=>x.id===r.id))).map(r=>r.id),['basket','glazed-bowl']);
 assert.equal(s.items.length,before.items.length);assert.equal(s.recipes.length,before.recipes.length);assert.deepEqual(s.initialItems,before.initialItems);assert.deepEqual(s.locationPlan!.locations,before.locationPlan!.locations);assert.deepEqual(s.hotspots,before.hotspots);
 assert.deepEqual(s.locationPlan!.locations.flatMap(l=>l.stockBatches.flatMap(b=>b.items)),['earth','water','air','fire']);
 assert.deepEqual(s.recipes.find(r=>r.id==='water-lifting-wheel'),before.recipes.find(r=>r.id==='water-lifting-wheel'));
 for(const cp of s.checkpoints!)assert.deepEqual(cp.actions,route.slice(0,cp.actions.length));
 write('graph-delta',{basket:s.recipes.find(r=>r.id==='basket'),bowlConsumers:s.recipes.filter(r=>[r.a,r.b].includes('bowl')),charcoalConsumers:s.recipes.filter(r=>[r.a,r.b].includes('charcoal')),goals:s.chapters.map(c=>({id:c.id,location:c.location.id,objectives:c.objectives})),noNewRecipes:true,noNewStock:true,predecessorUnchanged:true});
});
for(const[mode,width]of [['combine',390],['drop',320],['reverse',375]]as const)test(`full route ${mode}/${width}: local availability, both directions, resident kiln, lifecycle, goals, saves and Undo`,()=>{
 let g=M.createGame(s,width);const density:any[]=[],witnesses:any[]=[];
 for(const[n,a]of route.entries()){
  const list=names(g),row=density[g.state.chapter]??={chapter:s.chapters[g.state.chapter].id,arrival:list,peak:list};if(list.length>row.peak.length)row.peak=list;
  const old=g,r=recipe(a);if(a.type==='combine'){for(const id of[a.a,a.b])if(!id.startsWith('@'))assert.equal(M.token(g.state,id)?.location,g.state.currentLocation,`${n}/${id}`);assert(M.partners(s,g.state,a.a).outgoing.includes(a.b));}
  const reverse=mode==='reverse'&&a.type==='combine'&&!a.a.startsWith('@')&&!a.b.startsWith('@')&&!r?.at;
  if(reverse&&a.type==='combine')assert(M.partners(s,g.state,a.b).outgoing.includes(a.a));
  g=step(g,a.type==='combine'&&mode!=='combine'?{type:'drop',item:reverse?a.b:a.a,target:reverse?a.a:a.b}:a);assertFixed(g);
  for(const t of g.state.tokens){assert(t.x>=48&&t.x<=g.state.width-48);assert(t.y-M.tokenHeight(s,t)/2>=0&&t.y+M.tokenHeight(s,t)/2<=844);}
  if(a.type==='advance'){assert.deepEqual(old.state.tokens.map(t=>t.id).sort(),g.state.tokens.map(t=>t.id).sort());assert.deepEqual(noMetrics(M.undo(g).game.state),noMetrics(old.state));durable(g);}
  if(r&&['basket','picnic-basket','bowl','jar','glazed-bowl','charcoal','ink'].includes(r.id)){
   assert.deepEqual(noMetrics(M.undo(g).game.state),noMetrics(old.state));durable(g);assert.equal(M.applyAction(s,g,a).accepted,false);witnesses.push({recipe:r.id,before:M.playerView(s,old),after:M.playerView(s,g)});
  }
  if(r?.id==='basket'){assert(M.token(g.state,'rope'));assert(M.token(g.state,'fiber'));assert(!M.token(g.state,'bowl'));}
  if(r?.id==='picnic-basket'){assert(!M.token(g.state,'basket'));assert(M.token(g.state,'picnic-basket'));assert(M.chapterComplete(s,g.state));}
 }
 assert(g.state.completed);durable(g);write(mode+'-'+width,{completed:true,actions:route.length,density,witnesses,evidenceLevel:'Logical engine; not native/browser/human comprehension.'});
});
test('bread and basket preparations are independent; packed-bread goal is true only after packing',()=>{
 for(const basketFirst of [true,false]){let g=checkpoint('bakery');const acts=block('bakery'),basket=acts.find(a=>recipe(a)?.id==='basket')!,rest=acts.filter(a=>recipe(a)?.id!=='basket'&&recipe(a)?.id!=='picnic-basket');
  assert.deepEqual(M.visibleObjectives(s,g.state).map(o=>o.text),['Bake bread']);assert(!M.token(g.state,'bowl'));if(basketFirst)g=step(g,basket);for(const a of rest)g=step(g,a);if(!basketFirst)g=step(g,basket);
  assert.deepEqual(M.visibleObjectives(s,g.state).map(o=>[o.text,o.satisfied]),[['Pack a picnic basket',false]]);assert(!M.chapterComplete(s,g.state));g=step(g,{type:'combine',a:'bread',b:'basket'});assert(M.chapterComplete(s,g.state));assert(!M.gold(s,g.state).items.includes('bread'));durable(g);
 }
});
test('optional early basket at crossing is carried as the real result; no hidden fiber/rope/bowl supplies at bakery',()=>{
 let g=M.createGame(s,320),made=false;for(const a of route){if(recipe(a)?.id==='basket')continue;g=step(g,a);if(!made&&recipe(a)?.id==='rope'){g=step(g,{type:'combine',a:'fiber',b:'rope'});made=true;durable(g);}if(a.type==='advance'&&s.chapters[g.state.chapter].id==='bakery'){assert(names(g).includes('basket'));assert(!names(g).includes('fiber'));assert(!names(g).includes('rope'));assert(!names(g).includes('bowl'));}}
 assert(g.state.completed);write('early-basket',{completed:true,earlierExistingResultCarried:true});
});
for(const preparation of ['charcoal-before-forge','charcoal-after-forge','ink-before-letters'])test(`optional ${preparation}: preparation skips return; fixed kiln never travels; all downstream routes complete`,()=>{
 let g=M.createGame(s,320),prepared=false;const transfer:any[]=[];let expected=0;
 for(const a of route){
  const expectedChapter=s.chapters[expected].id;
  if(expectedChapter==='ink-charcoal'){if(a.type==='advance')expected++;continue;}
  if(a.type==='combine'&&recipe(a)?.id==='ink'&&preparation==='ink-before-letters')continue;
  g=step(g,a);assertFixed(g);transfer.push(...(g.events.at(-1)?.transfers??[]));
  if(!prepared&&recipe(a)?.id===(preparation==='charcoal-before-forge'?'kiln':'forge')){g=step(g,{type:'combine',a:'wood',b:'kiln'});if(preparation==='ink-before-letters')g=step(g,{type:'combine',a:'charcoal',b:'water'});prepared=true;durable(g);}
  if(a.type==='advance'){expected++;if(expectedChapter==='weavers'){assert(g.state.skippedChapters?.includes('ink-charcoal'));assert.equal(s.chapters[g.state.chapter].id,'letters');assert.equal(g.state.storyLocation,'E06-letter-morning');assert(!names(g).includes('kiln'));assert(!names(g).includes('wood'));}}
 }
 assert(g.state.completed);assert(!transfer.some(t=>t.item==='kiln'));durable(g);write(preparation,{completed:true,prepared:true,skips:g.state.skippedChapters,transfers:transfer});
});
test('goal-only quarry departure does not require charcoal; explicit later return supplies the missing preparation without teleporting the kiln',()=>{
 let g=checkpoint('workshop');for(const a of block('workshop'))g=step(g,a);assert(M.chapterComplete(s,g.state));assert(!g.state.discovered.includes('charcoal'));g=step(g,{type:'advance'});assert.equal(s.chapters[g.state.chapter].id,'ferry');
 g=checkpoint('ink-charcoal');assert.equal(g.state.storyLocation,'E05');assert.equal(M.token(g.state,'kiln')?.location,'E05');assert.equal(M.token(g.state,'wood')?.location,'E05');assert.deepEqual(g.state.arrival?.carried.map(x=>x.item),['wood']);assert(!M.chapterComplete(s,g.state));g=step(g,{type:'combine',a:'wood',b:'kiln'});assert(M.chapterComplete(s,g.state));g=step(g,{type:'advance'});assert.equal(g.state.storyLocation,'E06-letter-morning');assert.equal(M.token(g.state,'kiln')?.location,'E05');assert.equal(M.token(g.state,'charcoal')?.location,'E06-letter-morning');durable(g);write('goal-only-kiln',{missingPreparationExplicitlyReturned:true,onlyTimberImportedAtQuarry:true,portableCharcoalAtLanding:true});
});
test('all arrivals at 320/375/390 introduce no overlaps and preserve existing destination residents exactly',()=>{
 const overlap=(a:M.Token,b:M.Token)=>Math.max(0,96-Math.abs(a.x-b.x))*Math.max(0,(M.tokenHeight(s,a)+M.tokenHeight(s,b))/2-Math.abs(a.y-b.y));
 const evidence:any[]=[];
 for(const width of [320,375,390]){let g=M.createGame(s,width),checked=0;for(const a of route){const old=g;g=step(g,a);if(a.type!=='advance')continue;const dest=g.state.storyLocation!,oldById=new Map(old.state.tokens.map(t=>[t.id,t]));
   for(const t of g.state.tokens.filter(t=>t.location===dest)){const prior=oldById.get(t.id);if(prior?.location===dest)assert.deepEqual(t,prior,`${width}/${s.chapters[g.state.chapter].id}/${t.id}: settled resident moved`);}
   const arrived=g.state.tokens.filter(t=>t.location===dest);for(let i=0;i<arrived.length;i++)for(let j=i+1;j<arrived.length;j++){const x=arrived[i],y=arrived[j],px=oldById.get(x.id),py=oldById.get(y.id),previous=px&&py&&px.location===py.location?overlap(px,py):0;assert(overlap(x,y)<=previous+.001,`${width}/${s.chapters[g.state.chapter].id}/${x.id}+${y.id}`);checked++;}
  }evidence.push({width,checkedPairs:checked,noNewOverlaps:true,destinationResidentsUnchanged:true});}
 write('arrival-integrity',evidence);
});
