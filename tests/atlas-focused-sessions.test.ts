import assert from 'node:assert/strict';
import test from 'node:test';
import {scenario as s,atlasSessionMapping} from '../experiments/tangible-campaign/ui/stories/atlas-focused-sessions.ts';
import {atlas as before} from '../experiments/tangible-campaign/ui/stories/authenticity-repairs-v1.ts';
import {atlasFocusedRoute,atlasFocusedLunarOnlyRoute} from '../experiments/tangible-campaign/ui/stories/atlas-focused-session-route.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import {toLegacyGame} from '../experiments/tangible-campaign/compatibility/v1.ts';
const allStock=(world:typeof s)=>world.locationPlan!.locations.flatMap(l=>l.stockBatches.flatMap(b=>b.items)).sort();
const semantics=({description,caveat,...recipe}:typeof s.recipes[number])=>recipe;
test('Atlas focused successor preserves graph, identities, stock, original goals and shared art',()=>{
 assert.equal(s.id,'atlas-focused-sessions-v6');assert.equal(s.chapters.length,85);assert.equal(s.items.length,530);assert.equal(s.recipes.length,283);
 assert.deepEqual(s.recipes.map(semantics),before.recipes.map(semantics));assert.deepEqual(s.items.map(i=>i.id),before.items.map(i=>i.id));assert.deepEqual(allStock(s),allStock(before));assert.deepEqual(M.validateScenario(s),[]);
 const oldGoals=before.chapters.flatMap(c=>c.objectives);for(const old of oldGoals)assert.equal(s.chapters.flatMap(c=>c.objectives).find(o=>o.id===old.id)?.item,old.item);
 for(const row of atlasSessionMapping){const chapter=s.chapters.find(c=>c.id===row.id)!,old=before.chapters.find(c=>c.id===row.from)!,location=s.locationPlan!.locations.find(l=>l.id===chapter.location.id)!,oldLocation=before.locationPlan!.locations.find(l=>l.id===old.location.id)!;assert.equal(location.background.asset,oldLocation.background.asset);if(row.session>1){assert.equal(chapter.entryCue?.contextHeading,undefined);assert.equal(chapter.entryCue?.sourceCaption,undefined);assert.match(chapter.entryCue!.text,/^(It is evening\.|The next morning, work resumes\.|Later that day, work resumes\.)/);}}
});
test('Atlas full drag route: 85 manual engine advances, intact residents, partial/skip fixtures, save and Undo',()=>{
 let g=M.createGame(s,375),completeFixtures=0,partialFixtures=0;const madeAt=new Map<string,number>(),links=new Set<number>();
 for(const action of atlasFocusedRoute){const old=g,chapter=old.state.chapter;
  if(action.type==='advance'){
   // Explicit semantic fixture: work is earned by real actions, then only the
   // entry-complete flag is varied. This is NOT a naturally observed skip route.
   assert(M.chapterComplete(s,g.state));const fixture={...g,state:{...g.state,chapterEntry:{chapter,alreadyComplete:true}}},resolved=M.resolveChapterEntry(s,fixture);
   assert(resolved.state.skippedChapters?.includes(s.chapters[chapter].id));assert.deepEqual(resolved.state.recipesUsed,g.state.recipesUsed);assert.equal(resolved.state.metrics.creations,g.state.metrics.creations);completeFixtures++;
  }
  const result=M.applyAction(s,g,action);assert(result.accepted,result.message);g=result.game;
  if(action.type==='drop'){
   assert.equal(g.state.chapter,chapter,'combination must not act as a next arrow');
   const recipe=s.recipes.find(r=>r.id===result.recipe)!;for(const operand of[recipe.a,recipe.b])if(madeAt.has(operand)&&madeAt.get(operand)!<chapter)links.add(chapter);madeAt.set(recipe.out!,chapter);
   if(!M.chapterComplete(s,g.state)){const fixture={...g,state:{...g.state,chapterEntry:{chapter,alreadyComplete:true}}};assert.equal(M.resolveChapterEntry(s,fixture),fixture);partialFixtures++;}
  }
  if(action.type==='advance'){
   for(const oldToken of old.state.tokens){const token=M.token(g.state,oldToken.id);assert(token);if(token.location===oldToken.location)assert.deepEqual(token,oldToken);}
   const {metrics:_,...expected}=old.state,{metrics:__,...actual}=M.undo(g).game.state;assert.deepEqual(actual,expected);
   if(!g.state.completed){const location=s.locationPlan!.locations.find(l=>l.id===g.state.currentLocation)!;for(const stock of location.stockBatches.flatMap(b=>b.items))assert(M.token(g.state,stock),'whole source set must be present on arrival');}
  }
 }
 assert(g.state.completed);assert.equal(g.state.metrics.combinations,278);assert.equal(g.state.metrics.advances,85);assert.equal(completeFixtures,85);assert(partialFixtures>100);assert.equal(links.size,84);
 assert.deepEqual(M.restore(s,JSON.stringify(toLegacyGame(g))),g);
});
test('Atlas lunar-only route keeps optional time-longitude unmade, old sources available and all sessions complete',()=>{
 const g=M.replay(s,atlasFocusedLunarOnlyRoute,375);assert(g.state.completed);assert.equal(g.state.metrics.combinations,277);assert(!g.state.discovered.includes('time-longitude'));
 const earlier=s.chapters.find(c=>c.id==='longitude')!.location.id;assert.equal(M.token(g.state,'local-noon')?.location,earlier);assert(M.token(g.state,'reference-timekeeper'));assert(g.state.discovered.includes('lunar-longitude'));assert(g.state.discovered.includes('provisioned-route'));
 const old=M.createGame(before);assert.deepEqual(M.restore(before,JSON.stringify(toLegacyGame(old))),old);assert.throws(()=>M.restore(s,JSON.stringify(old)),/Invalid campaign save/);
});
