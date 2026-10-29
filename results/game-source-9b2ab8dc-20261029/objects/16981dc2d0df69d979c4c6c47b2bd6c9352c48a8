import assert from 'node:assert/strict';
import test from 'node:test';
import {scenario as focused} from '../experiments/tangible-campaign/ui/stories/atlas-focused-sessions.ts';
import {withPlainLanguage} from '../experiments/tangible-campaign/ui/stories/plain-language-content.ts';
import {withAtlasSeaTrialRecord} from '../experiments/tangible-campaign/ui/stories/atlas-sea-trial-record.ts';
import {atlasFocusedRoute,atlasFocusedLunarOnlyRoute} from '../experiments/tangible-campaign/ui/stories/atlas-focused-session-route.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import {toLegacyGame} from '../experiments/tangible-campaign/compatibility/v1.ts';
import type {Action} from '../experiments/tangible-campaign/schema/campaign.ts';
const before=withPlainLanguage(focused,'atlas'),s=withAtlasSeaTrialRecord(before);
const recipeGraph=(world:typeof s)=>world.recipes.map(({description,sources,...r})=>r);
const chapterGraph=(world:typeof s)=>world.chapters.map(c=>({...c,objectives:c.objectives.map(({text,...o})=>o)}));
const core=({metrics,...state}:M.State)=>state;
test('A12 correction is pure/idempotent metadata, with genuine attributed evidence and no graph/source losses',()=>{
 const snapshot=structuredClone(before);withAtlasSeaTrialRecord(before);assert.deepEqual(before,snapshot);assert.deepEqual(withAtlasSeaTrialRecord(s),s);
 assert.deepEqual(recipeGraph(s),recipeGraph(before));assert.deepEqual(chapterGraph(s),chapterGraph(before));assert.deepEqual(s.locationPlan,before.locationPlan);assert.deepEqual(s.checkpoints,before.checkpoints);assert.equal(s.items.length,before.items.length);assert.deepEqual(s.items.map(({label,description,reading,sources,...i})=>i),before.items.map(({label,description,reading,sources,...i})=>i));
 for(const source of before.sources!)assert.deepEqual(s.sources!.find(x=>x.id===source.id),source);assert.equal(s.sources!.length,before.sources!.length+2);
 assert.deepEqual(M.validateScenario(s),[]);const allSourceIds=new Set(s.sources!.map(x=>x.id));for(const content of[...s.items,...s.recipes,...s.hotspots])for(const id of content.sources??[])assert(allSourceIds.has(id),id);
 assert.equal(s.hotspots.find(h=>h.id==='longitude-sea')!.label,'H4 sea-trial report');assert.match(s.hotspots.find(h=>h.id==='longitude-sea')!.description!,/report on the desk, not a moving ship/);
 const output=s.items.find(i=>i.id==='sea-tested-clock')!;assert.equal(output.label,'Sea-tested reference time');assert.match(output.description!,/does not certify every clock/);assert.match(output.description!,/rather than sending this desk/);
 assert.match(s.recipes.find(r=>r.id==='make-tested-clock-longitude')!.description!,/not a live clock reading/);
 const milestone=s.milestones!.find(m=>m.item==='sea-tested-clock')!,old=before.milestones!.find(m=>m.item==='sea-tested-clock')!;assert.equal(milestone.title,output.label);assert.equal(milestone.text,output.description);assert.deepEqual({...milestone,title:old.title,text:old.text},old);
 const clockQuestion=s.chapters.flatMap(c=>c.objectives).find(o=>o.item==='sea-tested-clock')!;assert.equal(clockQuestion.text,'Can a clock keep reference time at sea?');
});
const testedRoute:Action[]=atlasFocusedRoute.filter(a=>!(a.type==='drop'&&a.item==='reference-timekeeper'&&a.target==='local-noon')).flatMap(a=>a.type==='drop'&&a.item==='reference-timekeeper'&&a.target==='@longitude-sea'?[a,{type:'drop' as const,item:'sea-tested-clock',target:'local-noon'}]:[a]).map(a=>a.type==='drop'&&!a.target.startsWith('@')?{...a,item:a.target,target:a.item}:a);
const overlap=(a:M.Token,b:M.Token)=>Math.max(0,96-Math.abs(a.x-b.x))*Math.max(0,(M.tokenHeight(s,a)+M.tokenHeight(s,b))/2-Math.abs(a.y-b.y));
for(const [name,width,route,count]of [['clock-method',375,atlasFocusedRoute,278],['lunar-only',320,atlasFocusedLunarOnlyRoute,277],['trial-evidence/reverse',390,testedRoute,278]]as const)test(`A12 complete ${name} route at ${width}: evidence use, unchanged alternatives, arrival geometry and saves`,()=>{
 let g=M.createGame(s,width),tested=false,usedEvidence=false;for(const a of route){const old=g,r=M.applyAction(s,g,a);assert(r.accepted,JSON.stringify(a)+': '+r.message);g=r.game;
  if(r.recipe==='make-sea-tested-clock'){
   tested=true;const hints=M.partners(s,old.state,'reference-timekeeper');assert(hints.partners.includes('@longitude-sea')||hints.incoming.includes('@longitude-sea'));
   assert.equal(g.state.chapter,old.state.chapter);assert.equal(M.token(g.state,'reference-timekeeper')!.location,old.state.currentLocation);assert.equal(M.token(g.state,'sea-tested-clock')!.hotspot,null);
   assert.equal(M.applyAction(s,g,{type:'combine',a:'reference-timekeeper',b:'@longitude-sea'}).accepted,false);assert.deepEqual(core(M.undo(g).game.state),core(old.state));assert.deepEqual(M.restore(s,JSON.stringify(toLegacyGame(g))),g);
  }
  if(r.recipe==='make-tested-clock-longitude')usedEvidence=true;
  if(a.type==='advance'){
   for(const t of old.state.tokens){const now=M.token(g.state,t.id)!;assert(now);if(now.location===t.location)assert.deepEqual(now,t);}
   for(const t of g.state.tokens.filter(t=>M.token(old.state,t.id)?.location!==t.location))for(const b of g.state.tokens.filter(b=>b.id!==t.id&&b.location===t.location)){const t0=M.token(old.state,t.id),b0=M.token(old.state,b.id),prior=t0&&b0&&t0.location===b0.location?overlap(t0,b0):0;assert(overlap(t,b)<=prior+.01,'new arrival overlap '+t.id+'/'+b.id);}
  }
 }
 assert(g.state.completed);assert.equal(g.state.metrics.combinations,count);assert.equal(g.state.metrics.advances,85);assert(tested);assert(g.state.discovered.includes('lunar-longitude'));assert(g.state.discovered.includes('provisioned-route'));
 if(name==='lunar-only')assert(!g.state.discovered.includes('time-longitude'));if(name==='trial-evidence/reverse')assert(usedEvidence);
});
