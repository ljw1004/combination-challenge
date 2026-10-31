import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {applyAction,checkpoint,playerView,stageComplete,token} from '../food/engine/model.ts';
import type {Scenario,Action} from '../food/schema/scenario.ts';
const s:Scenario=JSON.parse(readFileSync(new URL('../food/scenario.json',import.meta.url),'utf8'));
const plan=JSON.parse(readFileSync(new URL('../food/dependency-plan.json',import.meta.url),'utf8'));
const route:Action[]=JSON.parse(readFileSync(new URL('../food/routes/canonical.json',import.meta.url),'utf8'));
const supplied=[...s.initialItems,...s.stages.flatMap(st=>(st.caches??[]).flatMap(c=>c.items))];
const outputs=new Set(s.recipes.flatMap(r=>r.out?[r.out]:[]));
assert.deepEqual(supplied.filter(x=>outputs.has(x)),[]);
assert(plan.slice(1).every((p:any)=>p.requiredCreatedImports.length));
let g=checkpoint(s,'cannery');const start=s.checkpoints!.find(x=>x.id==='cannery')!.actions.length;
const end=s.checkpoints!.find(x=>x.id==='precision')!.actions.length;
const containers:any[]=[];
for(const a of route.slice(start,end-1)){
 const rr=applyAction(s,g,a);assert(rr.accepted,rr.message);g=rr.game;
 containers.push({recipe:rr.recipe??null,fruitJarPresent:!!token(g.state,'processed-fruit-jar'),stewTinPresent:!!token(g.state,'processed-stew-tin')});
}
assert(stageComplete(s,g.state));
assert(!token(g.state,'processed-fruit-jar'));
assert(!token(g.state,'processed-stew-tin'));
const canneryExit={currentStage:s.stages[g.state.stage].id,complete:stageComplete(s,g.state),things:playerView(s,g).things.map(x=>x.id),containers};
// Source-aware recovery demonstration: optional cheese straws remain recoverable after normal pastry handoff.
g=checkpoint(s,'sauce');
const recovery:Action[]=[{type:'visit',area:'pastry-area',carry:['grated-cheese']},{type:'combine',a:'laminated-dough',b:'grated-cheese'},{type:'combine',a:'cheese-straw-dough',b:'@pastry-oven'}];
const recovered:any[]=[];
for(const a of recovery){const rr=applyAction(s,g,a);assert(rr.accepted,rr.message);g=rr.game;recovered.push({action:a,accepted:rr.accepted,recipe:rr.recipe??null});}
assert(token(g.state,'cheese-straws'));
console.log(JSON.stringify({sourceAware:true,candidate:s.id,ingredientOutputCacheViolations:[],laterChaptersReusingActualCreations:plan.length-1,canneryExit,optionalCheeseStrawsRecovery:recovered,notProven:['human fun','UI readability','source-blind optional rediscovery','whole-journey pacing']},null,2));
