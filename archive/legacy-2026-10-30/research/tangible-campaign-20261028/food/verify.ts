import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import type {Action,Scenario} from './schema/scenario.ts';
import {applyAction,checkpoint,createGame,gold,playerView,replay,restore,stageComplete,token,undo,validateScenario,visibleObjectives} from './engine/model.ts';
import {validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from './schema/lifecycle.ts';
export const s:Scenario=JSON.parse(readFileSync(new URL('./scenario.json',import.meta.url),'utf8'));
export const plans=JSON.parse(readFileSync(new URL('./dependency-plan.json',import.meta.url),'utf8'));
export const readRoute=(name:string):Action[]=>JSON.parse(readFileSync(new URL('./routes/'+name+'.json',import.meta.url),'utf8'));
export const validations=()=>[...validateScenario(s),...validateContentLifecycles([s]),...validateObjectiveFlow([s]),...validateConstructionContinuity([s])];
export function reverseDirections(actions:Action[]):Action[]{
 let g=createGame(s);const out:Action[]=[];
 for(const a of actions){
  const rr=applyAction(s,g,a);assert(rr.accepted);g=rr.game;
  if(a.type==='place')continue;
  if(a.type!=='combine'||a.b.startsWith('@')){out.push(a);continue;}
  const r=s.recipes.find(r=>r.id===rr.recipe)!;
  if(r.at)out.push({type:'place',item:a.a,location:r.at});
  out.push({type:'combine',a:a.b,b:a.a});
 }
 return out;
}
export function earlyDiscoveries():{actions:Action[];early:string[]}{
 let g=createGame(s);const actions:Action[]=[],early:string[]=[];
 const chapterOf=new Map<string,number>(plans.flatMap((p:any,i:number)=>[...p.requiredRecipes,...p.optionalRecipes].map((id:string)=>[id,i])));
 const act=(a:Action)=>{const rr=applyAction(s,g,a);assert(rr.accepted,rr.message);g=rr.game;actions.push(a);};
 for(let i=0;i<s.stages.length;i++){
  // A curious player may fetch a real retained supply from a visited kitchen.
  // This exercises genuine visit/carry, never injected inventory or future caches.
  const fetch=s.stages[i].id==='noodles'?'milk':s.stages[i].id==='choux'?'sugar':null;
  if(fetch){const t=token(g.state,fetch)!;const home=g.state.currentArea;if(t.area!==home){act({type:'visit',area:t.area});act({type:'visit',area:home,carry:[fetch]});}}
  let changed=true;
  while(changed){changed=false;
   for(const r of s.recipes){
    if((chapterOf.get(r.id)??-1)<=i||g.state.recipesUsed.includes(r.id)||r.out&&g.state.discovered.includes(r.out))continue;
    if(r.a.startsWith('@')||r.b.startsWith('@'))continue;
    if(![r.a,r.b].every(id=>token(g.state,id)?.area===g.state.currentArea))continue;
    if(r.at&&!g.state.places.some(p=>p.id===r.at&&p.area===g.state.currentArea))continue;
    if(r.requires?.length)continue;
    if(r.at)act({type:'place',item:r.b,location:r.at});
    const rr=applyAction(s,g,{type:'combine',a:r.a,b:r.b});
    if(rr.accepted){g=rr.game;actions.push({type:'combine',a:r.a,b:r.b});early.push(r.id);changed=true;}
   }
  }
  const begin=s.checkpoints![i].actions.length,end=s.checkpoints![i+1].actions.length;
  const chunk=readRoute('canonical').slice(begin,end);
  for(const a of chunk){
   if(a.type==='place')continue;
   if(a.type==='advance'){assert(stageComplete(s,g.state));act(a);continue;}
   if(a.type!=='combine')throw Error('Unexpected canonical gesture');
   const candidates=s.recipes.filter(r=>r.a===a.a&&r.b===a.b);
   const r=candidates.find(r=>chapterOf.get(r.id)===i)!;assert(r);
   if(r.out&&g.state.discovered.includes(r.out)||g.state.recipesUsed.includes(r.id))continue;
   if(r.at)act({type:'place',item:r.b,location:r.at});
   act(a);
  }
 }
 assert(g.state.completed);return {actions,early};
}
export function witness(actions:Action[],width:number){
 let g=createGame(s,width);let exactReplacements=0,retainedInputs=0,undoChecks=0,restoreChecks=0,allFinalBeforeAdvance=true;
 const scenes=new Map<number,any>();const actualImports:any[]=[];
 const observe=(arrival=false)=>{const v=playerView(s,g);let row=scenes.get(g.state.stage)??{id:s.stages[g.state.stage].id,arrival:v.things.length,max:0,locations:v.locations.length,maxVisibleGoals:0};row.max=Math.max(row.max,v.things.length);row.maxVisibleGoals=Math.max(row.maxVisibleGoals,v.objectives.length);scenes.set(g.state.stage,row);if(arrival&&g.state.stage){const imported=plans[g.state.stage].requiredCreatedImports;for(const k of imported)assert(v.things.some(x=>x.id===k),`Missing actual creation ${k} entering ${row.id}`);actualImports.push({stage:row.id,createdImports:imported});}};
 observe(true);
 for(let i=0;i<actions.length;i++){
  const a=actions[i],before=g,rr=applyAction(s,g,a);assert(rr.accepted,`action ${i+1}: ${rr.message}`);g=rr.game;
  if(a.type==='combine'){
   const r=s.recipes.find(r=>r.id===rr.recipe)!;
   for(const [id,l] of Object.entries(r.lifecycle??{})){
    const was=token(before.state,id)!;if(l.role==='retain'){assert(token(g.state,id),`Retained ${id} vanished`);retainedInputs++;}
    if(l.role==='transform'&&rr.retired?.includes(id)){
     const out=token(g.state,r.out!)!;
     if(a.b.startsWith('@')){const loc:{x:number;y:number}=before.state.places.find(p=>p.id===a.b.slice(1))!;assert.equal(out.x,loc.x);assert.equal(out.y,loc.y+16);}
     else{assert.equal(out.x,was.x);assert.equal(out.y,was.y);}
     exactReplacements++;
    }
   }
   if(stageComplete(s,g.state)&&actions[i+1]?.type!=='advance')allFinalBeforeAdvance=false;
  }
  const u=undo(g);assert(u.accepted);const actual={...u.game.state,metrics:undefined},expected={...before.state,metrics:undefined};assert.deepEqual(actual,expected);undoChecks++;
  const restored=restore(s,JSON.stringify(g));assert.deepEqual(restored.state,g.state);restoreChecks++;
  observe(a.type==='advance'&&!g.state.completed);
  for(const o of s.stages[g.state.stage].objectives.filter(x=>x.intermediate&&g.state.discovered.includes(x.item!))){assert(!visibleObjectives(s,g.state).some(x=>x.id===o.id));assert(!gold(s,g.state).items.includes(o.item!));}
 }
 assert(g.state.completed);assert(allFinalBeforeAdvance,'Route postpones advance after its final cue');
 return {width,completed:g.state.completed,metrics:g.state.metrics,recipeIds:g.state.recipesUsed,scenes:[...scenes.values()],actualImports,exactReplacements,retainedInputs,undoChecks,restoreChecks,allFinalBeforeAdvance};
}
export function generateEvidence(){
 assert.deepEqual(validations(),[]);
 const ahead=earlyDiscoveries();
 const routes:Record<string,Action[]>={'early-discovery':ahead.actions,canonical:readRoute('canonical'),'all-recipes':readRoute('all-recipes'),'reverse-ready':readRoute('reverse-ready'),'reverse-directions':reverseDirections(readRoute('all-recipes'))};
 const replays=Object.entries(routes).flatMap(([name,actions])=>[320,360,600].map(width=>({name,...witness(actions,width)})));
 const checkpoints=(s.checkpoints??[]).map(c=>{for(const width of [320,360,600]){const g=checkpoint(s,c.id,width);assert.deepEqual(c.actions,readRoute('canonical').slice(0,c.actions.length));assert.equal(g.state.stage,c.id==='complete'?s.stages.length-1:s.stages.findIndex(st=>st.id===c.id));}return {id:c.id,actions:c.actions.length,exactCanonicalPrefix:true,widths:[320,360,600]};});
 const sha=(path:string)=>createHash('sha256').update(readFileSync(path)).digest('hex');
 const source='/workspace/shared/combination-fork-recovery-20261028/experiments/tangible-campaign/';
 const provenance=JSON.parse(readFileSync(new URL('./evidence/runtime-provenance.json',import.meta.url),'utf8'));
 const runtime=['engine/model.ts','engine/model.test.ts','engine/fixture.ts','schema/scenario.ts','schema/lifecycle.ts'].map(f=>{const current=sha(new URL(f,import.meta.url).pathname),upstream=sha(source+f);assert.equal(current,provenance.files[f]);return {path:f,sha256:current,sourceAtCaptureIdentical:true,currentUpstreamIdentical:current===upstream};});
 const report={candidate:s.id,baselineSourceCommit:'3d3dbf36c7be473b30e09384f8a279b2fa2d9918',sourceWorkingExtension:'parent reading-card metadata and token height',sourceAware:true,humanFunValidated:false,browserOrTouchValidated:false,foodSafetyValidated:false,scenarioSha256:sha(new URL('./scenario.json',import.meta.url).pathname),runtime,recipes:s.recipes.length,stages:s.stages.length,validations:[],replays,checkpoints};
 writeFileSync(new URL('./routes/early-discovery.json',import.meta.url),JSON.stringify(ahead,null,2)+'\n');
 writeFileSync(new URL('./evidence/verification.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
 writeFileSync(new URL('./routes/reverse-directions.json',import.meta.url),JSON.stringify(routes['reverse-directions'],null,2)+'\n');
 console.log(JSON.stringify({recipes:s.recipes.length,stages:s.stages.length,replays:replays.length,canonicalCombinations:replays.find(r=>r.name==='canonical')!.metrics.combinations,checkpoints:checkpoints.length,checks:replays.reduce((n,r)=>n+r.undoChecks+r.restoreChecks,0)},null,2));
 return report;
}
if(process.argv[1]?.endsWith('/verify.ts'))generateEvidence();
