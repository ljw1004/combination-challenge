import {beforeReviewedGraphAmendments} from '../experiments/tangible-campaign/integration/reviewed-graph-amendments.ts';
import {beforeRetainedAnomalies} from '../experiments/tangible-campaign/integration/retained-anomaly-successor.ts';
import {expectedSourceHashAfterMarsNaturalOrders} from '../experiments/tangible-campaign/integration/mars-natural-orders-source-guard.ts';
import {applyIntuitiveAlternatives,beforeIntuitiveAlternatives} from '../experiments/tangible-campaign/integration/intuitive-story-alternatives.ts';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {scenario as s} from '../experiments/tangible-campaign/ui/campaigns/divinity-light-text-workshop.ts';
import {scenario as broad} from '../experiments/tangible-campaign/ui/campaigns/divinity-light-guide.ts';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import {validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from '../experiments/tangible-campaign/schema/lifecycle.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
import type {Action} from '../experiments/tangible-campaign/schema/scenario.ts';
const E=JSON.parse(readFileSync(new URL('../experiments/tangible-campaign/evidence/'+s.id+'-route-evidence.json',import.meta.url),'utf8'));
const P=JSON.parse(readFileSync(new URL('../experiments/tangible-campaign/research/divinity-light-v2/route-plan.json',import.meta.url),'utf8'));
const play=(g:M.Game,a:Action)=>{const r=M.applyAction(s,g,a);assert(r.accepted,r.message);return r.game;};
const rt=(g:M.Game)=>M.restore(s,JSON.stringify(decodeSave(encodeSave({game:g,tops:{},seen:[]})).game));
const text=(id:string)=>s.items.find(i=>i.id===id)!.reading!.text;
test('new four-desk module is bounded and does not rewrite the frozen broad diagnostic',()=>{
 assert.notEqual(s.id,broad.id);assert.equal(s.stages.length,4);assert.equal(beforeIntuitiveAlternatives(beforeRetainedAnomalies(beforeReviewedGraphAmendments(s))).recipes.length,28);assert.equal(s.recipes.length,29);assert.equal(s.items.length,47);
 assert.equal(createHash('sha256').update(readFileSync(new URL('../experiments/tangible-campaign/ui/campaigns/divinity-light-guide.ts',import.meta.url))).digest('hex'),'8ac7a5d52066a939e078d22456b78cb08597ca8cbec880974cfbfb611b91f6bd');
});
test('schema, source references, lifecycles, constructions and gold progression validate',()=>{
 for(const errors of [M.validateScenario(s),validateContentLifecycles([s]),validateObjectiveFlow([s]),validateConstructionContinuity([s])])assert.deepEqual(errors,[]);
 const sources=new Set(s.sources!.map(x=>x.id));for(const i of s.items)for(const id of i.sources??[])assert(sources.has(id),id);
 assert.equal(s.recipes.filter(r=>r.b.startsWith('@')).length,1);assert.equal(s.recipes.filter(r=>r.install).length,4);
});
test('canonical route and five checkpoints preserve all actual panel slots',()=>{
 const g=M.replay(s,E.actionsLog);assert(g.state.completed);assert.equal(g.state.metrics.combinations,28);
 const exhibit=M.token(g.state,'exhibit-folio')!;assert(M.functional(s,exhibit));assert.equal(Object.keys(exhibit.slots).length,4);
 assert.equal(M.capabilities(s,exhibit)[0],'complete-exhibit');assert(M.token(g.state,'printed-passage'));
 assert.equal(s.checkpoints!.length,5);for(const cp of s.checkpoints!){const game=M.checkpoint(s,cp.id);assert.deepEqual(rt(game),game);}
 const hash=createHash('sha256').update(readFileSync(new URL('../experiments/tangible-campaign/ui/campaigns/divinity-light-text-workshop.ts',import.meta.url))).digest('hex');assert.equal(hash,expectedSourceHashAfterMarsNaturalOrders('experiments/tangible-campaign/ui/campaigns/divinity-light-text-workshop.ts',E.sourceHashes.scenario));
});
test('thirty normal-highlight ordering variants finish without source/solution inspection',()=>{
 for(let seed=1;seed<=30;seed++){let g=M.createGame(s),rng=seed,steps=0;
  while(!g.state.completed&&steps++<100){
   if(M.stageComplete(s,g.state)){g=play(g,{type:'advance'});continue;}
   const directions=g.state.tokens.filter(t=>t.area===g.state.currentArea).flatMap(t=>M.partners(s,g.state,t.id).directions);
   assert(directions.length,'no public move at '+s.stages[g.state.stage].id);rng=(Math.imul(rng,1664525)+1013904223)>>>0;
   const d=directions[rng%directions.length];g=play(g,{type:'combine',a:d.source,b:d.target});if(steps%6===0)g=rt(g);
  }assert(g.state.completed,'seed '+seed);const comparisonMade=g.state.recipesUsed.includes('dl2-compassion-care');assert.equal(g.state.metrics.combinations,comparisonMade?28:27,'Only the exact direct Mark alternative may omit the earlier compassion comparison');assert(M.functional(s,M.token(g.state,'exhibit-folio')!));
 }
});
test('each later desk meaningfully uses an actual earlier created panel',()=>{
 const made=new Set<string>();for(let i=0;i<s.stages.length;i++){
  const rs=P.stageRecipes[i].map((id:string)=>s.recipes.find(r=>r.id===id)!);
  if(i){const old=rs.flatMap((r:any)=>[r.a,r.b]).filter((id:string)=>made.has(id));assert(old.length);for(const id of old)assert(s.stages[i].carry!.includes(id),id);}
  for(const r of rs)if(r.out)made.add(r.out);
 }
});
test('repeated gestures and complaints are supplied as passages, not preprinted interpretations',()=>{
 assert.match(text('father-runs'),/far off.*father saw him.*ran/);assert.match(text('father-outside'),/came out and begged/);
 const gestures=s.recipes.find(r=>r.out==='father-both')!;assert.deepEqual([gestures.a,gestures.b],['father-runs','father-outside']);
 const echo=s.recipes.find(r=>r.out==='complaint-echo')!;assert.deepEqual([echo.a,echo.b],['opening-complaint','older-complaint']);
 assert(!text('opening-complaint').includes('older brother'));assert(!text('older-complaint').includes('opening'));
 assert.match(text('critics-invited'),/may invite/);assert.match(text('open-door-reading'),/unstated/);
});
test('Jewish setting and miracle testimony are explicit without belief grading',()=>{
 assert.match(text('law-answer'),/Both speakers are Jewish/);assert.match(text('stranger-command'),/Jewish Scripture/);
 assert.match(text('two-passers'),/does not tell us their motives/);assert.match(text('community-note'),/Jesus is Jewish/);
 assert.match(text('mark-feeding'),/everyone eats and is filled/);assert.match(text('mark-feeding'),/Twelve baskets/);assert.match(text('mark-feeding'),/extraordinary/);
 assert.match(text('john-feeding'),/as much as they want/);assert.match(text('passover-memory'),/liberation from slavery/);
 assert.match(s.items.find(i=>i.id==='john-feeding')!.reading!.attribution,/A sign is an event/);
 assert.match(text('bread-panel'),/Catholic teaching treats the Gospels as testimony about Jesus/);
 assert.match(text('bread-panel'),/historical testimony/);
});
test('the printed page reproduces an actual supplied passage rather than a method notebook',()=>{
 const r=s.recipes.find(r=>r.out==='proof-sheet')!;assert.equal(r.a,'samaritan-leaf');assert.equal(r.b,'proof-paper');
 assert(s.stages[3].carry!.includes('samaritan-leaf'));assert.match(text('proof-sheet'),/repeats the exact classroom paraphrase/);
 assert.match(text('samaritan-leaf'),/promises to cover further costs/);assert.match(text('proof-sheet'),/promises to cover further costs/);assert(text('proof-sheet').startsWith(text('samaritan-leaf')));assert(text('printed-passage').startsWith(text('samaritan-leaf')));
 assert.match(text('headline-draft'),/invented modern exhibition draft/);assert.match(text('history-panel'),/not proof.*caused Luther/);
});
test('readings stay optional, short, attributed and free of hidden recipe instructions',()=>{
 for(const i of s.items){assert.equal(i.description,undefined);if(!i.reading)continue;assert(i.reading.attribution);assert(i.reading.text.split(/\s+/).length<=90,i.id);
 assert(!/combine |drag |tap |click |bring .* onto|unlock /i.test(i.reading.text),i.id);assert(M.itemLabelLayout(i)?.length);}
 const g=M.createGame(s),copy=JSON.stringify(g);M.playerView(s,g);assert.equal(JSON.stringify(g),copy);
});
test('every canonical step roundtrips and Undo restores the sources and fitted components',()=>{
 let g=M.createGame(s);for(const a of E.actionsLog){const before=g;g=play(g,a);assert.deepEqual(rt(g),g);const u=M.undo(g);assert(u.accepted);assert.deepEqual(u.game.state.tokens,before.state.tokens);assert.deepEqual(u.game.state.discovered,before.state.discovered);}
});
test('partial final goals remain checked and final earned entry bridges without extra combinations',()=>{
 let g=M.checkpoint(s,'desk-4');for(const id of ['dl2-proof-sheet','dl2-printed-passage']){const r=s.recipes.find(r=>r.id===id)!;g=play(g,{type:'combine',a:r.a,b:r.b});}
 const partial=M.playerView(s,g).objectives;assert(partial.some(o=>o.id==='print-source'&&o.satisfied));assert(partial.some(o=>!o.satisfied));assert.deepEqual(M.playerView(s,rt(g)).objectives,partial);
 const completed=M.replay(s,E.actionsLog);completed.state.completed=false;completed.state.chapterEntry={stage:3,alreadyComplete:true};completed.bridgesSeen=[];
 const metrics=structuredClone(completed.state.metrics),resolved=M.resolveChapterEntry(s,completed);assert(resolved.state.completed);assert.deepEqual(resolved.state.metrics,metrics);assert.equal(M.pendingChapterBridges(s,resolved).length,1);
 assert.deepEqual(rt(resolved),resolved);
});
