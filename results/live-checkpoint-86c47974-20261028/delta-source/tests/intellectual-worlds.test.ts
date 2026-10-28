// Integrated source/model checks only: not browser, native UI, human learning or enjoyment evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import type {Action,Scenario} from '../experiments/tangible-campaign/schema/scenario.ts';
import {validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from '../experiments/tangible-campaign/schema/lifecycle.ts';
import {applyMilestones,getPlayableScenario,campaignMilestones} from '../experiments/tangible-campaign/ui/campaign-milestones.ts';
import {scenarios,integratedScenarios,featuredScenarioIds,presentationFor} from '../experiments/tangible-campaign/ui/scenarios.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
import {scenario as atlas} from '../experiments/tangible-campaign/ui/campaigns/atlas-intellectual-history.ts';
import {scenario as divinity} from '../experiments/tangible-campaign/ui/campaigns/divinity-disputed-questions.ts';
import {scenario as light} from '../experiments/tangible-campaign/ui/campaigns/divinity-light-text-workshop.ts';
import {scenario as originalAtlas} from '../experiments/tangible-campaign/ui/campaigns/atlas.ts';
import {scenario as repairedAtlas} from '../experiments/tangible-campaign/ui/campaigns/atlas-evidence-repair.ts';
import {scenario as compactDivinity} from '../experiments/tangible-campaign/ui/campaigns/doctrine-compact-opening.ts';

const read=(path:string)=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const atlasRoute:Action[]=read('experiments/tangible-campaign/evidence/intellectual-worlds-20261028/atlas-author-route.json').actionsLog;
const lightRoute:Action[]=read('experiments/tangible-campaign/evidence/'+light.id+'-route-evidence.json').actionsLog;
const rows:{source:Scenario;actions:Action[];combinations:number;chapters:number;checkpoints:number}[]=[
 {source:atlas,actions:atlasRoute,combinations:260,chapters:30,checkpoints:6},
 {source:divinity,actions:divinity.checkpoints!.find(cp=>cp.id==='complete')!.actions,combinations:73,chapters:14,checkpoints:15},
 {source:light,actions:lightRoute,combinations:28,chapters:4,checkpoints:5},
];
const atlasMilestones=['milestone-critical-edition','milestone-strict-ptolemy-challenged','milestone-age-still-open','milestone-branching-descent','milestone-earth-age-measured','milestone-industrial-lead-footprint','milestone-unfinished-common-world'];
const restored=(s:Scenario,g:M.Game,compact=false)=>M.restore(s,compact?JSON.stringify(decodeSave(encodeSave({game:g,tops:{[g.state.currentArea]:0},seen:[]})).game):JSON.stringify(g));
const stateWithoutMetrics=({metrics,...state}:M.State)=>state;
function accepted(s:Scenario,g:M.Game,a:Action){const result=M.applyAction(s,g,a);assert(result.accepted,`${s.id} / ${JSON.stringify(a)} / ${result.message}`);return result.game;}

// This is a current-catalogue contract, separate from frozen route evidence for predecessors.
test('six current featured worlds use the new Atlas and deep Divinity; Light and every old world retain distinct routes',()=>{
 assert.deepEqual(featuredScenarioIds,[
  'mars-connected-survival-v4-return-cargo-research',atlas.id,'elements-house-and-craft-v1',
  'kitchen-caravan-v6','copy-workroom-two-commissions-v1',divinity.id,
 ]);
 assert.deepEqual(integratedScenarios.map(s=>s.id),featuredScenarioIds);
 assert.equal(new Set(scenarios.map(s=>s.id)).size,scenarios.length);
 for(const raw of [atlas,divinity,light,originalAtlas,repairedAtlas,compactDivinity])assert.equal(scenarios.find(s=>s.id===raw.id),raw,raw.id);
 for(const raw of [light,originalAtlas,repairedAtlas,compactDivinity])assert(!featuredScenarioIds.includes(raw.id));
 assert.match(presentationFor(light).title+' '+presentationFor(light).premise,/optional|experiment/i);
 assert.match(presentationFor(originalAtlas).title,/snapshot/i);
 for(const current of [atlas,divinity,light]){
  const game=M.createGame(getPlayableScenario(current.id,scenarios)!);
  for(const other of [originalAtlas,repairedAtlas,compactDivinity,...[atlas,divinity,light].filter(x=>x!==current)])assert.throws(()=>M.restore(other,JSON.stringify(game)),/Invalid campaign save/);
 }
});

test('UI and logical entry share directly authored policies and Atlas rewards without mutating raw worlds',()=>{
 for(const {source,chapters,checkpoints} of rows){
  const before=JSON.stringify(source),playable=getPlayableScenario(source.id,scenarios)!;
  assert(playable);assert.deepEqual(playable,applyMilestones(source));assert.equal(JSON.stringify(source),before);
  assert.equal(playable.recipes,source.recipes);assert.equal(playable.items,source.items);assert.equal(playable.stages,source.stages);
  assert.equal(playable.stages.length,chapters);assert.equal(playable.checkpoints!.length,checkpoints);
  for(const st of playable.stages){assert(st.onAlreadyComplete,`${source.id}/${st.id}`);assert(['skip','bridge'].includes(st.onAlreadyComplete.mode));if(st.onAlreadyComplete.mode==='bridge'){assert(st.onAlreadyComplete.text.trim());assert(st.onAlreadyComplete.text.split(/\s+/).length<=60);}}
  for(const errors of [M.validateScenario(playable),validateContentLifecycles([playable]),validateObjectiveFlow([playable]),validateConstructionContinuity([playable])])assert.deepEqual(errors,[],source.id);
 }
 assert.deepEqual(atlas.milestones!.map(m=>m.id),atlasMilestones);
 assert.equal(divinity.milestones,undefined);assert.equal(light.milestones,undefined);
 assert.equal(campaignMilestones['elements-house-and-craft-v1'].length,9);
 assert.equal(campaignMilestones['mars-connected-survival-v4-return-cargo-research'].length,3);
 assert.deepEqual(Object.keys(campaignMilestones).sort(),['elements-house-and-craft-v1','mars-connected-survival-v4-return-cargo-research']);
 assert.equal(integratedScenarios.reduce((n,s)=>n+(applyMilestones(s).milestones?.length??0),0),19);
 assert.equal(getPlayableScenario('not-a-world',scenarios),undefined);
});

for(const {source,actions,combinations} of rows){
 const s=applyMilestones(source);
 test(`${s.id}: integrated canonical route completes at three widths with exact JSON/compact progress`,()=>{
  for(const width of [320,375,600]){
   const g=M.replay(s,actions,width);assert(g.state.completed);assert.equal(g.state.stage,s.stages.length-1);assert.equal(g.state.metrics.combinations,combinations);
   assert.deepEqual(restored(s,g),g);assert.deepEqual(restored(s,g,true),g);
   if(!s.milestones?.length){assert.equal(M.pendingMilestone(s,g),null);assert.deepEqual(g.state.milestones??[],[]);}
   const settled=M.resolveChapterEntry(s,g);assert.equal(settled,g);assert.equal(M.applyAction(s,g,{type:'advance'}).accepted,false);
  }
 });
 test(`${s.id}: every prepared checkpoint restores at three widths without historical hero or bridge backlog`,()=>{
  for(const cp of s.checkpoints!)for(const width of [320,375,600]){
   const g=M.checkpoint(s,cp.id,width);assert.deepEqual(restored(s,g),g);assert.deepEqual(restored(s,g,true),g);
   assert.equal(M.pendingMilestone(s,g),null);assert.deepEqual(M.pendingChapterBridges(s,g),[]);
   assert.equal(g.state.metrics.combinations,cp.actions.filter(a=>a.type==='combine').length);
   assert.deepEqual(g.milestonesSeen??[],g.state.milestones?.map(m=>m.id)??[]);
  }
 });
 test(`${s.id}: every canonical action has normal affordances and Undo restores actual tangible sources`,()=>{
  let g=M.createGame(s,375);let undoCount=0,partialCount=0;const partialStages=new Set<number>();
  for(const a of actions){
   const before=g;
   if(a.type==='combine'){
    const serialized=JSON.stringify(before);const hints=M.partners(s,before.state,a.a);
    assert(hints.directions.some(d=>d.source===a.a&&d.target===a.b),JSON.stringify(a));
    assert(hints.directions.every(d=>!('out' in d)));M.playerView(s,before);assert.equal(JSON.stringify(before),serialized,'ordinary view/highlight is read-only');
   }
   g=accepted(s,g,a);const undone=M.undo(g);assert(undone.accepted);
   assert.deepEqual(stateWithoutMetrics(undone.game.state),stateWithoutMetrics(before.state));
   const redone=accepted(s,undone.game,a);assert.deepEqual(stateWithoutMetrics(redone.state),stateWithoutMetrics(g.state));undoCount++;
   const objectives=M.objectiveStates(s,g.state);
   if(!g.state.completed&&objectives.some(o=>o.satisfied)&&objectives.some(o=>!o.satisfied)&&!partialStages.has(g.state.stage)){
    partialStages.add(g.state.stage);partialCount++;
    assert.equal(M.resolveChapterEntry(s,g),g,'partial work is not skipped');
    assert.deepEqual(M.playerView(s,restored(s,g,true)).objectives,M.playerView(s,g).objectives);
   }
  }
  assert.equal(undoCount,actions.length);assert(partialCount>0,'actual route exposes retained partial credit');assert(g.state.completed);
 });
 test(`${s.id}: earned bridge reentry skips only completed work and preserves pending reward facts`,()=>{
  let g=M.createGame(s,375),bridges=0;
  for(const a of actions){
   g=accepted(s,g,a);const st=s.stages[g.state.stage];
   if(a.type==='advance'||st.onAlreadyComplete?.mode!=='bridge'||!M.stageComplete(s,g.state))continue;
   // Diagnostic reentry fixture from a real earned route prefix, not a reader save or fabricated recipe.
   const fixture=structuredClone(g);fixture.state.chapterEntry={stage:fixture.state.stage,alreadyComplete:true};
   const before=structuredClone(fixture.state),resolved=M.resolveChapterEntry(s,fixture);
   assert(resolved.state.completed||resolved.state.stage>before.stage);assert(resolved.state.skippedChapters!.includes(st.id));
   assert.deepEqual(resolved.state.recipesUsed,before.recipesUsed);assert.deepEqual(resolved.state.discovered.filter(id=>!before.discovered.includes(id)).sort(),resolved.state.tokens.filter(t=>!before.discovered.includes(t.kind)).map(t=>t.kind).sort());
   assert.deepEqual(resolved.state.metrics,before.metrics);assert.deepEqual(resolved.state.milestones,before.milestones);
   assert(M.pendingChapterBridges(s,resolved).some(b=>b.id===st.id&&b.text===(st.onAlreadyComplete as {mode:'bridge';text:string}).text));
   assert.deepEqual(restored(s,resolved,true),resolved);
   const ack=M.acknowledgeChapterBridges(s,resolved,M.pendingChapterBridges(s,resolved).map(b=>b.id));assert.deepEqual(M.pendingChapterBridges(s,ack),[]);assert.deepEqual(restored(s,ack),ack);bridges++;
  }
  assert(bridges>0,'each new world has an explicitly authored bridge witness');
 });
}

test('Atlas seven rewards are actual creations, survive queued compact saves and never repeat after acknowledged Undo/reearn',()=>{
 const s=getPlayableScenario(atlas.id,scenarios)!;let g=M.createGame(s,375);const earned:string[]=[];
 for(const a of atlasRoute){
  const before=g;g=accepted(s,g,a);
  const fresh=(g.state.milestones??[]).filter(m=>!before.state.milestones?.some(old=>old.id===m.id));
  for(const m of fresh){
   earned.push(m.id);const definition=s.milestones!.find(d=>d.id===m.id)!;assert.equal(a.type,'combine');assert.equal(g.events.at(-1)!.created,definition.item);assert(M.token(g.state,definition.item));
   assert.equal(M.pendingMilestone(s,g)!.id,m.id);assert.equal(M.pendingMilestone(s,restored(s,g,true))!.id,m.id);
   const undone=M.undo(g);assert(undone.accepted);assert(!undone.game.state.milestones?.some(old=>old.id===m.id));
   g=M.acknowledgeMilestone(s,g,m.id);const afterAckUndo=M.undo(g);assert(afterAckUndo.accepted);const again=accepted(s,afterAckUndo.game,a);
   assert(again.state.milestones?.some(old=>old.id===m.id));assert.equal(M.pendingMilestone(s,again),null);assert.deepEqual(restored(s,g),g);
  }
 }
 assert(g.state.completed);assert.deepEqual(earned,atlasMilestones);assert.equal(M.pendingMilestone(s,g),null);
 const queued=M.replay(s,atlasRoute,375);assert.deepEqual(queued.state.milestones!.map(m=>m.id),atlasMilestones);
 let loaded=restored(s,queued,true);for(const id of atlasMilestones){assert.equal(M.pendingMilestone(s,loaded)!.id,id);loaded=M.acknowledgeMilestone(s,loaded,id);}assert.equal(M.pendingMilestone(s,loaded),null);
 // A pre-reward save has no facts to replay: never infer a retroactive popup from discovered objects.
 const historical=structuredClone(queued);delete historical.milestonesSeen;for(const state of [historical.state,...historical.history])delete state.milestones;
 assert.equal(M.pendingMilestone(s,restored(s,historical)),null);assert.equal(M.pendingMilestone(s,restored(s,historical,true)),null);
});
