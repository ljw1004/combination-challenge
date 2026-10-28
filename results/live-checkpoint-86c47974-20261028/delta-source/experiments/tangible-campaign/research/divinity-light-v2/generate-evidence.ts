import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {scenario as s} from '../../ui/campaigns/divinity-light-text-workshop.ts';
import * as M from '../../engine/model.ts';
import type {Action} from '../../schema/scenario.ts';
const plan=JSON.parse(readFileSync(new URL('./route-plan.json',import.meta.url),'utf8'));
const actions:Action[]=[],checkpoints:NonNullable<typeof s.checkpoints>=[],rows=[];
let game=M.createGame(s);
assert.deepEqual(M.validateScenario(s),[]);
for(let i=0;i<s.stages.length;i++){
 assert.equal(game.state.stage,i);
 checkpoints.push({id:'desk-'+(i+1),label:s.stages[i].title,actions:structuredClone(actions)});
 const before=game.state.metrics.combinations;
 for(const id of plan.stageRecipes[i]){
  const recipe=s.recipes.find(r=>r.id===id)!;assert(recipe,id);
  const a:Action={type:'combine',a:recipe.a,b:recipe.b};
  const p=M.partners(s,game.state,recipe.a);
  assert(p.directions.some(d=>d.source===recipe.a&&d.target===recipe.b),id+' should be a normal public highlight');
  const r=M.applyAction(s,game,a);assert(r.accepted,id+': '+r.message);game=r.game;actions.push(a);
 }
 assert(M.stageComplete(s,game.state),s.stages[i].id+' missing goal');
 const carried=M.arrivalView(s,game.state)?.carried.map(x=>x.id)??[];
 rows.push({stage:s.stages[i].id,recipes:game.state.metrics.combinations-before,carried,complete:true});
 const a:Action={type:'advance'},r=M.applyAction(s,game,a);assert(r.accepted,r.message);game=r.game;actions.push(a);
}
assert(game.state.completed);
checkpoints.push({id:'complete',label:'Finished guide',actions:structuredClone(actions)});
const module=new URL('../../ui/campaigns/divinity-light-text-workshop.ts',import.meta.url);
let text=readFileSync(module,'utf8');
const marker='\n// Authored deterministic chapter checkpoints; generated from the route plan.\n';
text=text.split(marker)[0].trimEnd()+marker+'scenario.checkpoints = '+JSON.stringify(checkpoints,null,2)+';\n';
writeFileSync(module,text);
const hash=(path:string)=>createHash('sha256').update(readFileSync(new URL(path,import.meta.url))).digest('hex');
const report={scenarioId:s.id,scope:'Headless logical evidence only; no browser/native UI or human learning claim',completed:true,combinations:game.state.metrics.combinations,chapters:s.stages.length,actionsLog:actions,chaptersLog:rows,sourceHashes:{scenario:hash('../../ui/campaigns/divinity-light-text-workshop.ts'),engine:hash('../../engine/model.ts'),schema:hash('../../schema/scenario.ts')}};
writeFileSync(new URL('../../evidence/'+s.id+'-route-evidence.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({completed:true,combinations:game.state.metrics.combinations,chapters:rows.length,checkpoints:checkpoints.length,sourceHashes:report.sourceHashes},null,2));
