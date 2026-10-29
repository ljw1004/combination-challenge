/** Headless content/engine checks; not human, browser, or native UI evidence. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {scenario as s} from '../experiments/tangible-campaign/ui/campaigns/divinity-light-guide.ts';
import {scenarios} from '../experiments/tangible-campaign/ui/scenarios.ts';
import {withDivinityLight,divinityLightIntegration} from '../experiments/tangible-campaign/research/divinity-light/integration.ts';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import {validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from '../experiments/tangible-campaign/schema/lifecycle.ts';
import {decodeSave,encodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
import type {Action} from '../experiments/tangible-campaign/schema/scenario.ts';
const evidence=JSON.parse(readFileSync(new URL('../experiments/tangible-campaign/evidence/'+s.id+'-route-evidence.json',import.meta.url),'utf8'));
const plan=JSON.parse(readFileSync(new URL('../experiments/tangible-campaign/research/divinity-light/route-plan.json',import.meta.url),'utf8'));
const roundtrip=(g:M.Game)=>M.restore(s,JSON.stringify(decodeSave(encodeSave({game:g,tops:{},seen:[]})).game));
const play=(g:M.Game,a:Action)=>{const r=M.applyAction(s,g,a);assert(r.accepted,JSON.stringify(a)+': '+r.message);return r.game;};

test('separate additive identity, bounded coverage, no mutation or replacement of deeper Divinity',()=>{
 const before=JSON.stringify(scenarios),catalog=withDivinityLight(scenarios);
 assert.equal(JSON.stringify(scenarios),before);assert.equal(catalog.length,scenarios.length+1);assert(!scenarios.some(x=>x.id===s.id));
 assert.equal(catalog.at(-1),s);assert.deepEqual(divinityLightIntegration.replaces,[]);assert.throws(()=>withDivinityLight(catalog));
 assert.equal(s.stages.length,8);assert.equal(s.recipes.length,45);assert.equal(s.items.length,84);assert.equal(s.milestones,undefined);
 assert.match(s.premise,/not school-approved/i);assert.match(s.premise,/not.*test of personal belief/i);
});
test('new candidate validates lifecycles, objective progression, source references, and preservation',()=>{
 assert.deepEqual(M.validateScenario(s),[]);assert.deepEqual(validateContentLifecycles([s]),[]);
 assert.deepEqual(validateObjectiveFlow([s]),[]);assert.deepEqual(validateConstructionContinuity([s]),[]);
 const ids=new Set(s.sources!.map(x=>x.id));
 for(const obj of [...s.items,...s.recipes,...s.locations])for(const source of obj.sources??[])assert(ids.has(source),source);
 for(const r of s.recipes)assert(r.lifecycle&&Object.keys(r.lifecycle).length===[r.a,r.b].filter(x=>!x.startsWith('@')).length);
 assert.equal(s.recipes.filter(r=>r.b.startsWith('@')).length,2);
});
test('canonical 45 combinations, eight desks, nine checkpoints and evidence pin agree',()=>{
 const game=M.replay(s,evidence.actionsLog);assert(game.state.completed);assert.equal(game.state.metrics.combinations,45);
 assert.equal(game.state.metrics.advances,8);assert.equal(game.state.recipesUsed.length,s.recipes.length);
 assert.equal(s.checkpoints!.length,9);for(const cp of s.checkpoints!){const g=M.checkpoint(s,cp.id);assert.deepEqual(roundtrip(g),g);}
 assert.equal(createHash('sha256').update(readFileSync(new URL('../experiments/tangible-campaign/ui/campaigns/divinity-light-guide.ts',import.meta.url))).digest('hex'),evidence.sourceHashes.scenario);
});
test('all canonical steps are exposed by normal public highlights without reading descriptions',()=>{
 let g=M.createGame(s);for(const a of evidence.actionsLog){
  if(a.type==='combine')assert(M.partners(s,g.state,a.a).directions.some(d=>d.source===a.a&&d.target===a.b),a.a+' + '+a.b);
  g=play(g,a);
 }
 assert(g.state.completed);
});
test('forty deterministic normal-highlight routes finish without an answer oracle or reading text',()=>{
 for(let seed=1;seed<=40;seed++){
  let g=M.createGame(s),n=0,rng=seed;
  while(!g.state.completed&&n++<150){
   if(M.stageComplete(s,g.state)){g=play(g,{type:'advance'});continue;}
   const moves=g.state.tokens.filter(t=>t.area===g.state.currentArea).flatMap(t=>M.partners(s,g.state,t.id).directions).map(d=>({type:'combine' as const,a:d.source,b:d.target}));
   assert(moves.length,'normal-highlight dead end at '+s.stages[g.state.stage].id+' seed '+seed);
   rng=(Math.imul(rng,1664525)+1013904223)>>>0;g=play(g,moves[rng%moves.length]);
   if(n%7===0)g=roundtrip(g);
  }
  assert(g.state.completed,'seed '+seed);assert.equal(g.state.metrics.combinations,45);
 }
});
test('earlier creations are actually used at every later desk, not merely carried',()=>{
 const prior=new Set<string>();
 for(let i=0;i<s.stages.length;i++){
  const rs=plan.stageRecipes[i].map((id:string)=>s.recipes.find(r=>r.id===id)!);
  if(i){const used=rs.flatMap((r:any)=>[r.a,r.b]).filter((id:string)=>prior.has(id));assert(used.length,'no prior creation used at '+s.stages[i].id);for(const id of used)assert(s.stages[i].carry?.includes(id),'actual earlier creation not carried '+id);}
  for(const r of rs)prior.add(r.out!);
 }
});
test('readable source text stays optional, short and attributed; no hidden recipe instructions',()=>{
 for(const item of s.items){assert.equal(item.description,undefined,'no hidden descriptions: '+item.id);if(!item.reading)continue;
  assert(item.reading.attribution.trim());assert(item.reading.text.split(/\s+/).length<=90,item.id+' reading too long');
  assert(!/combine |drag |tap |click |bring .* onto|unlock /i.test(item.reading.text),item.id+' contains recipe instructions');
  assert(M.itemLabelLayout(item)?.length);const fake={id:item.id,kind:item.id,area:'stories',location:null,x:60,y:60,slots:{},incorporated:[]};
  assert(M.tokenHeight(s,fake)>=44);
 }
 const g=M.createGame(s),before=JSON.stringify(g);M.playerView(s,g);assert.equal(JSON.stringify(g),before,'reading projection must not change play');
});
test('Jewish context, specific religious perspectives, Catholic framing and fictional cases are explicit',()=>{
 const text=(id:string)=>s.items.find(i=>i.id===id)!.reading!.text;
 assert.match(text('samaritan-context'),/Jesus is Jewish/);assert.match(text('jewish-world'),/living tradition/);assert.match(text('jewish-world'),/blame against Jews/);
 assert.match(text('shabbat-account'),/Orthodox/);assert.match(text('shabbat-account'),/different ways/);
 assert.match(s.items.find(i=>i.id==='ramadan-account')!.reading!.attribution,/not representative of every Muslim/);
 assert.match(text('similar-not-same'),/not interchangeable/);assert.match(text('similar-not-same'),/not a claim of direct historical borrowing/);
 assert.match(text('catholic-response'),/present-day Catholic explanation/);assert.match(text('examen-card'),/with God|Christian prayer/);
 for(const id of ['seed-diary','fictional-journal','club-options','club-effects','week-later','saturday-plan','meal-invitation','pantry-request','access-report','neighbors-voices','water-notes','water-costs'])assert.match(text(id),/Invented/i,id);
});
test('full route saves and Undo preserve actual tangible sources, conclusions and placement',()=>{
 let g=M.createGame(s);
 for(const a of evidence.actionsLog){
  const before=g,r=M.applyAction(s,g,a);assert(r.accepted,r.message);g=r.game;
  assert.deepEqual(roundtrip(g),g);
  const u=M.undo(g);assert(u.accepted);assert.deepEqual(u.game.state.tokens,before.state.tokens);assert.deepEqual(u.game.state.discovered,before.state.discovered);
  if(a.type==='combine'){
   const recipe=s.recipes.find(recipe=>recipe.id===r.recipe)!;
   for(const [id,lifecycle]of Object.entries(recipe.lifecycle!))if(lifecycle.role==='retain')assert(M.token(g.state,id),id+' reference vanished');
  }
 }
});
test('intermediate goals become successors and partial final goals remain visibly checked',()=>{
 let g=M.createGame(s);for(const id of plan.stageRecipes[0].slice(0,3)){
  const r=s.recipes.find(r=>r.id===id)!;g=play(g,{type:'combine',a:r.a,b:r.b});
 }
 const goals=M.playerView(s,g).objectives;assert(goals.some(x=>x.id==='stories-2'&&x.satisfied));assert(goals.some(x=>!x.satisfied));
 assert(!goals.some(x=>x.id==='stories-1'));assert(!M.gold(s,g.state).items.includes('neighbor-action'));
 assert(M.gold(s,g.state).items.includes('neighbor-care'));
 const restored=roundtrip(g);assert.deepEqual(M.playerView(s,restored).objectives,goals);
});
test('already-earned entry uses seven skip policies and one ending bridge, with real history retained',()=>{
 assert.equal(s.stages.filter(x=>x.onAlreadyComplete?.mode==='skip').length,7);assert.equal(s.stages.filter(x=>x.onAlreadyComplete?.mode==='bridge').length,1);
 const completed=M.replay(s,evidence.actionsLog),g=structuredClone(completed);
 // Entry-cascade fixture: actual earned tokens/history at a suspended already-complete entry.
 g.state.stage=0;g.state.currentArea=s.stages[0].area.id;g.state.completed=false;g.state.skippedChapters=[];g.state.chapterEntry={stage:0,alreadyComplete:true};g.bridgesSeen=[];
 const metrics=structuredClone(g.state.metrics),resolved=M.resolveChapterEntry(s,g);
 assert(resolved.state.completed);assert.deepEqual(resolved.state.skippedChapters,s.stages.map(st=>st.id));
 assert.deepEqual(resolved.state.metrics,metrics);assert.deepEqual(resolved.events,g.events);
 assert.equal(M.pendingChapterBridges(s,resolved).length,1);assert.equal(M.playerView(s,resolved).objectives.length,0);
 const acknowledged=M.acknowledgeChapterBridges(s,resolved,[s.stages.at(-1)!.id]);assert.equal(M.pendingChapterBridges(s,acknowledged).length,0);
 assert.deepEqual(M.resolveChapterEntry(s,acknowledged),acknowledged);assert.deepEqual(roundtrip(acknowledged),acknowledged);
});
