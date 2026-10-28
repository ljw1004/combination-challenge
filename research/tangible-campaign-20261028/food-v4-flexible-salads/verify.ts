import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import type {Action,Scenario} from './schema/scenario.ts';
import type {Game} from './engine/model.ts';
import {applyAction,checkpoint,createGame,dropAction,playerView,restore,stageComplete,token,undo,validateScenario} from './engine/model.ts';
import {validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from './schema/lifecycle.ts';
export const json=(p:string)=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
export const s:Scenario=json('./scenario.json');
export const base:Scenario=json('../narrative-review-20261028/food-copy-correction/scenario.json');
export const sha=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
export const readRoute=(name:string):Action[]=>{const r=json('./routes/'+name+'.json');return Array.isArray(r)?r:r.actions;};
export const validations=()=>[...validateScenario(s),...validateContentLifecycles([s]),...validateObjectiveFlow([s]),...validateConstructionContinuity([s])];
export function act(g:Game,a:Action):Game {const r=applyAction(s,g,a);assert(r.accepted,JSON.stringify(a)+': '+r.message);return r.game;}
export function reversed(actions:Action[]):Action[]{
 let g=createGame(s);const out:Action[]=[];
 for(const a of actions){const rr=applyAction(s,g,a);assert(rr.accepted,rr.message);g=rr.game;
  if(a.type==='place')continue;
  if(a.type!=='combine'||a.b.startsWith('@')){out.push(a);continue;}
  const r=s.recipes.find(r=>r.id===rr.recipe)!;
  if(r.at)out.push({type:'place',item:a.a,location:r.at});
  out.push({type:'combine',a:a.b,b:a.a});
 }return out;
}
export function earlyPlain():Action[]{
 const actions:Action[]=[];let inserted=false;
 for(const a of readRoute('plain-vinaigrette')){
  if(a.type==='combine'&&a.a==='flatbread'&&a.b==='roast-bean-stew'){
   actions.push({type:'visit',area:'orchard-area'},{type:'visit',area:'soup-area',carry:['vinaigrette']},{type:'combine',a:'roast-roots',b:'vinaigrette'});inserted=true;
  }
  if(a.type==='combine'&&a.a==='roast-roots'&&a.b==='vinaigrette')continue;
  actions.push(a);
 }
 assert(inserted);return actions;
}
export function routeSet():Record<string,Action[]>{
 const routes:Record<string,Action[]>={};
 for(const n of ['canonical','all-recipes','reverse-ready','reverse-directions','early-discovery','early-opening'])routes['preserved-v3/'+n]=readRoute('preserved-v3/'+n);
 for(const n of ['plain-vinaigrette','direct-mustard','catalogue-plain-vinaigrette','catalogue-direct-mustard'])routes[n]=readRoute(n);
 routes['plain-vinaigrette-reversed']=reversed(routes['plain-vinaigrette']);
 routes['direct-mustard-reversed']=reversed(routes['direct-mustard']);
 routes['early-plain-vinaigrette']=earlyPlain();
 return routes;
}
export function witness(name:string,actions:Action[],width:number){
 let g=createGame(s,width),baseline=name.startsWith('preserved-v3/')?createGame(base,width):null;
 let retainChecks=0,undoChecks=0,restoreChecks=0,legacyExactChecks=0,eventLocalChecks=0;
 const scenes:any[]=[];
 const observe=()=>{
  const made=new Set(s.recipes.filter(r=>g.state.recipesUsed.includes(r.id)&&r.out).map(r=>r.out!));
  scenes.push({id:s.stages[g.state.stage].id,stage:g.state.stage,arrivalVisible:playerView(s,g).things.length,priorCreationsPresent:playerView(s,g).things.filter(t=>made.has(t.id)).map(t=>t.id),actualEarlierCreationsUsed:[] as string[],openedCaches:[...g.state.openedCaches]});
 };observe();
 for(let i=0;i<actions.length;i++){
  const before=g,a=actions[i],r=applyAction(s,g,a);assert(r.accepted,`${name}@${width} action ${i}: ${r.message}`);g=r.game;
  if(baseline){const br=applyAction(base,baseline,a);assert(br.accepted);baseline=br.game;assert.deepEqual(g.state,baseline.state);assert.deepEqual(g.events,baseline.events);legacyExactChecks++;}
  if(a.type==='combine'){
   const recipe=s.recipes.find(x=>x.id===r.recipe)!;
   const row=scenes.at(-1)!;
   for(const id of [recipe.a,recipe.b])if(row.priorCreationsPresent.includes(id)&&!row.actualEarlierCreationsUsed.includes(id))row.actualEarlierCreationsUsed.push(id);
   for(const [id,life] of Object.entries(recipe.lifecycle??{}))if(life.role==='retain'){if(recipe.install?.target===id){const after=token(g.state,id)!,prior=token(before.state,id)!;assert.equal(after.id,prior.id);assert.equal(after.kind,prior.kind);assert.equal(after.area,prior.area);assert.equal(after.slots[recipe.install.slot],recipe.install.component);}else assert.deepEqual(token(g.state,id),token(before.state,id));retainChecks++;}
   for(const old of before.state.tokens)if(!g.state.tokens.some(t=>t.id===old.id)){assert(r.retired?.includes(old.id));assert(['incorporate','transform'].includes(recipe.lifecycle?.[old.kind]?.role??''));eventLocalChecks++;}
   for(const id of r.retired??[])assert(['incorporate','transform'].includes(recipe.lifecycle?.[id]?.role??''));
  }else if(a.type!=='advance')assert.deepEqual(g.state.tokens.map(t=>t.id).sort(),before.state.tokens.map(t=>t.id).sort());
  if(a.type==='advance'){
   assert(stageComplete(s,before.state));
   for(const old of before.state.tokens)assert(token(g.state,old.id),'Advance must never retire an old thing');
   if(!g.state.completed){
    const st=s.stages[g.state.stage];
    for(const id of st.carry??[]){const t=token(before.state,id);if(t){assert.equal(token(g.state,id)!.area,g.state.currentArea);assert.equal(token(g.state,id)!.kind,t.kind);}}
    observe();
   }
  }
  assert.deepEqual({...undo(g).game.state,metrics:undefined},{...before.state,metrics:undefined});undoChecks++;
  assert.deepEqual(restore(s,JSON.stringify(g)).state,g.state);restoreChecks++;
 }
 assert(g.state.completed);assert.equal(scenes.length,20);
 for(const row of scenes.slice(1))assert(row.actualEarlierCreationsUsed.length>0,`No actual earlier creation used in ${row.id}`);
 return {name,width,completed:true,metrics:g.state.metrics,recipeIds:g.state.recipesUsed,scenes,retainChecks,undoChecks,restoreChecks,legacyExactChecks,eventLocalChecks};
}
export function focused(reverse:boolean,width:number){
 const results=[];
 for(const id of ['root-salad-vinaigrette','mustard-dressing-direct']){
  const rec=s.recipes.find(r=>r.id===id)!,g=checkpoint(s,'salads',width),a=reverse?rec.b:rec.a,b=reverse?rec.a:rec.b;
  const beforeBase=checkpoint(base,'salads',width);assert(!applyAction(base,beforeBase,dropAction(base,beforeBase.state,a,b)).accepted);
  const r=applyAction(s,g,dropAction(s,g.state,a,b));assert(r.accepted,r.message);assert.equal(r.recipe,id);assert.equal(r.created,rec.out);assert.deepEqual(r.retired,[]);
  assert.equal(r.game.state.metrics.combinations,g.state.metrics.combinations+1);
  for(const input of [rec.a,rec.b])assert.deepEqual(token(r.game.state,input),token(g.state,input));
  assert(!token(r.game.state,'mustard-paste'));assert.equal(token(r.game.state,rec.out!)!.location,null);
  assert.deepEqual({...undo(r.game).game.state,metrics:undefined},{...g.state,metrics:undefined});
  assert.deepEqual(restore(s,JSON.stringify(r.game)).state,r.game.state);
  const repeat=applyAction(s,r.game,dropAction(s,r.game.state,b,a));assert(!repeat.accepted);assert.equal(repeat.game.state.metrics.combinations,r.game.state.metrics.combinations);
  results.push({id,reverse,width,output:rec.out,accepted:true,retainedInputs:[rec.a,rec.b],repeatAccepted:false});
 }return results;
}
export function replayStoppedIntent(){
 const session=json('../longitudinal-play/sessions/food-v3-copyfix-packet-v1/food-long-01/session.json');
 let g=createGame(s),old=createGame(base);let beforeSalad:Game|undefined;
 // Reconstruct the real pre-attempt state from its events; never migrate or edit the frozen save.
 for(const e of session.game.events){
  if(e.action.type==='combine'&&e.action.a==='vinaigrette'&&e.action.b==='roast-roots'){beforeSalad=g;break;}
  const r=applyAction(s,g,e.action);const br=applyAction(base,old,e.action);assert.equal(r.accepted,e.accepted);assert.equal(br.accepted,e.accepted);g=r.game;old=br.game;assert.deepEqual(g.state,old.state);
 }
 assert(beforeSalad);assert.equal(beforeSalad.state.metrics.combinations,35);assert.equal(beforeSalad.state.stage,4);
 const rows=[];
 for(const [a,b] of [['vinaigrette','roast-roots'],['ground-mustard','vinaigrette']]){const r=applyAction(s,beforeSalad,dropAction(s,beforeSalad.state,a,b));assert(r.accepted);rows.push({a,b,accepted:r.accepted,recipe:r.recipe,created:r.created});}
 return {classification:'Source-aware counterfactual replay from the frozen player’s reconstructed pre-attempt state; not a new source-blind trial or a claim they would continue.',priorCombinations:35,attempts:rows};
}
export function verify(){
 assert.deepEqual(validations(),[]);
 const protectedRows=json('./protected-inputs.json');for(const f of protectedRows)assert.equal(sha(f.path),f.sha256,f.path);
 const manifest=json('./manifest.json');for(const r of manifest.runtime){assert.equal(sha(new URL(r.path,import.meta.url).pathname),r.sha256);assert.equal(sha(r.source),r.sha256);}
 const routes=routeSet();const replays=Object.entries(routes).flatMap(([name,actions])=>[320,360,600].map(w=>witness(name,actions,w)));
 const union=new Set(replays.flatMap(r=>r.recipeIds));assert.equal(union.size,s.recipes.length);
 const focusedResults=[320,360,600].flatMap(w=>[false,true].flatMap(r=>focused(r,w)));
 const checkpointRows=s.checkpoints!.map(c=>{assert.deepEqual(c.actions,readRoute('preserved-v3/canonical').slice(0,c.actions.length));for(const w of [320,360,600])assert.deepEqual(checkpoint(s,c.id,w).state,checkpoint(base,c.id,w).state);return {id:c.id,exactLegacyCanonicalPrefix:true,widths:[320,360,600]};});
 const result={scenarioSha256:sha(new URL('./scenario.json',import.meta.url).pathname),sourceAware:true,humanFunValidated:false,browserOrUITestingPerformed:false,validationErrors:[],protectedFilesVerified:protectedRows.length,runtimeFilesUnchanged:manifest.runtime.length,catalogueAlternatives:s.recipes.length,catalogueUnionExercised:union.size,uniqueOutputs:new Set(s.recipes.filter(r=>r.out).map(r=>r.out)).size,replays,focused:focusedResults,checkpoints:checkpointRows,frozenPlayerIntentReplay:replayStoppedIntent()};
 writeFileSync(new URL('./evidence/verification.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
 for(const name of ['plain-vinaigrette-reversed','direct-mustard-reversed','early-plain-vinaigrette'])writeFileSync(new URL('./routes/'+name+'.json',import.meta.url),JSON.stringify(routes[name],null,2)+'\n');
 console.log(JSON.stringify({replays:replays.length,focused:focusedResults.length,checkpoints:checkpointRows.length,protectedFiles:protectedRows.length,allAlternativesExercised:union.size,byRoute:Object.fromEntries(replays.filter(r=>r.width===360).map(r=>[r.name,{combinations:r.metrics.combinations,creations:r.metrics.creations,installations:r.metrics.installations,placements:r.metrics.placements,visits:r.metrics.visits}]))},null,2));return result;
}
if(process.argv[1]?.endsWith('/verify.ts'))verify();
