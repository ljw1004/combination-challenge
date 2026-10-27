import fs from 'node:fs';
import {validateScenario,createGame,applyAction,stageComplete,objectiveStates,capabilities,playerView} from '../engine/model.ts';
import type {Scenario,Action} from '../schema/scenario.ts';
const s=JSON.parse(fs.readFileSync(new URL('./scenario.json',import.meta.url),'utf8')) as Scenario;
const errors=validateScenario(s);if(errors.length){console.log(errors);process.exit(1)}
let g=createGame(s),events:any[]=[],stages:any[]=[],peak=0;
for(let n=0;n<1000;n++){
 const st=s.stages[g.state.stage];let changed=false;
 peak=Math.max(peak,g.state.tokens.filter(t=>t.area===g.state.currentArea).length);
 for(const recipe of s.recipes){
  if(g.state.recipesUsed.includes(recipe.id))continue;
  const a=recipe.a.startsWith('@')?recipe.a:g.state.tokens.find(t=>t.kind===recipe.a&&t.area===g.state.currentArea)?.id;
  const b=recipe.b.startsWith('@')?recipe.b:g.state.tokens.find(t=>t.kind===recipe.b&&t.area===g.state.currentArea)?.id;
  if(!a||!b)continue;
  const r=applyAction(s,g,{type:'combine',a,b});if(r.accepted){g=r.game;peak=Math.max(peak,g.state.tokens.filter(t=>t.area===g.state.currentArea).length);events.push({type:'combine',a,b});changed=true;}
 }
 for(const o of st.objectives.filter(o=>o.kind==='place')){
  const token=g.state.tokens.find(t=>t.area===g.state.currentArea&&(o.item?t.kind===o.item:capabilities(s,t).includes(o.capability!)));
  if(token&&token.location!==o.location){const action:Action={type:'place',item:token.id,location:o.location!};const r=applyAction(s,g,action);if(r.accepted){g=r.game;peak=Math.max(peak,g.state.tokens.filter(t=>t.area===g.state.currentArea).length);events.push(action);changed=true;}}
 }
 if(stageComplete(s,g.state)){
  stages.push({id:st.id,combinations:g.state.metrics.combinations,local:g.state.tokens.filter(t=>t.area===g.state.currentArea).length,objectives:objectiveStates(s,g.state)});
  const action:Action={type:'advance'};const r=applyAction(s,g,action);if(r.accepted){g=r.game;peak=Math.max(peak,g.state.tokens.filter(t=>t.area===g.state.currentArea).length);events.push(action);changed=true;}
  if(g.state.completed)break;
 }
 if(!changed){console.log('STUCK',st.id,objectiveStates(s,g.state).filter(o=>!o.satisfied));break;}
}
console.log('metrics',g.state.metrics,'completed',g.state.completed,'peakLocal',peak,'stages',stages.map(x=>[x.id,x.combinations,x.local]));
fs.writeFileSync(new URL('./results/closure.json',import.meta.url),JSON.stringify({errors,completed:g.state.completed,metrics:g.state.metrics,peakLocal:peak,stages,events,remaining:objectiveStates(s,g.state)},null,2));
