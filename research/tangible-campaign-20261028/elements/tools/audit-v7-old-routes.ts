import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
import * as M from '../frozen/engine/model.ts';import {validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from '../frozen/schema/lifecycle.ts';import type {Action,Scenario} from '../frozen/schema/scenario.ts';
const root=new URL('../',import.meta.url),s:Scenario=JSON.parse(fs.readFileSync(new URL('candidates/v7/scenario.json',root),'utf8'));
const route:Action[]=JSON.parse(fs.readFileSync(new URL('frozen/scenarios/elements-v6.json',root),'utf8')).checkpoints.find(c=>c.id==='complete').actions;
const evidence=JSON.parse(fs.readFileSync('/workspace/shared/combination-fork-recovery-20261028/experiments/tangible-campaign/evidence/elements-observation-revision-v6-route-evidence.json','utf8'));
assert.deepEqual(route,evidence.actionsLog);
assert.deepEqual([...M.validateScenario(s),...validateContentLifecycles([s]),...validateObjectiveFlow([s]),...validateConstructionContinuity([s])],[]);
function run(actions:Action[],name:string){let g=M.createGame(s);const created=new Map<string,number>();const rows=s.stages.map((st,i)=>({number:i+1,id:st.id,title:st.title,combinations:0,creations:0,priorCreatedInputs:new Set<string>(),inputOrigins:[] as {item:string,chapter:number}[],actions:[] as object[]}));for(const a of actions){const stage=g.state.stage;const r=M.applyAction(s,g,a);assert(r.accepted,`${name} chapter ${stage+1} ${JSON.stringify(a)}: ${r.message}`);if(a.type==='combine'){rows[stage].combinations++;for(const k of [a.a,a.b])if(created.has(k)&&created.get(k)!<stage)rows[stage].priorCreatedInputs.add(k);}if(r.created){created.set(r.created,stage);rows[stage].creations++;}rows[stage].actions.push({action:a,recipe:r.recipe,created:r.created,retired:r.retired});g=r.game;g.history=[];}assert(g.state.completed,name+' not completed');for(const row of rows.slice(1))assert(row.priorCreatedInputs.size,`${name} continuity missing: ${row.id}`);return {name,metrics:g.state.metrics,finalState:g.state,chapters:rows.map(r=>({...r,priorCreatedInputs:[...r.priorCreatedInputs],inputOrigins:[...r.priorCreatedInputs].map(k=>({item:k,chapter:created.get(k)!+1}))}))};}
const baseline=run(route,'authored baseline');
const ids=(actions:Action[])=>actions.map(a=>a.type==='combine'?s.recipes.find(r=>[r.a,r.b].includes(a.a)&&[r.a,r.b].includes(a.b))?.id:undefined);
const swap=(actions:Action[],remove:string[],replacement:Action[])=>{const recipeIds=ids(actions);let inserted=false;const output=actions.flatMap((a,i)=>{if(!recipeIds[i]||!remove.includes(recipeIds[i]!))return [a];if(!inserted){inserted=true;return replacement;}return []});assert(inserted,`Missing swap ${remove}`);return output;};
const combine=(a:string,b:string):Action=>({type:'combine',a,b});
const alternatives:any[]=[];
for(let juice=0;juice<2;juice++)for(let wheel=0;wheel<2;wheel++)for(let slide=0;slide<2;slide++)for(let herbarium=0;herbarium<2;herbarium++)for(let weather=0;weather<3;weather++)for(let feast=0;feast<2;feast++){
 let actions=route;
 if(juice)actions=swap(actions,['juice'],[combine('fruit','stone')]);
 if(wheel)actions=swap(actions,['waterwheel'],[combine('water','wheel')]);
 if(slide)actions=swap(actions,['glass-slide','pond-slide'],[combine('pond-water','glass')]);
 if(herbarium)actions=swap(actions,['pressed-specimen','herbarium'],[combine('plant','bound-book')]);
 if(weather===1)actions=swap(actions,['rain-record','weather-record'],[combine('windsock','paper'),combine('wind-record','rain-gauge')]);
 if(weather===2)actions=swap(actions,['rain-record','weather-record'],[combine('paper','rain-gauge'),combine('windsock','paper'),combine('wind-record','rain-record')]);
 if(feast)actions=swap(actions,['feast-from-warm-meal'],[combine('bread','fruit')]);
 const name=`juice${juice}-wheel${wheel}-slide${slide}-herbarium${herbarium}-weather${weather}-feast${feast}`;
 const r=run(actions,name);alternatives.push({name,metrics:r.metrics,connectedChapters:r.chapters.slice(1).filter(x=>x.priorCreatedInputs.length).length});
}
fs.writeFileSync(new URL('reports/v7-old-routes-audit.json',root),JSON.stringify({at:new Date().toISOString(),scope:'Author-aware exact authored-route replay and authored-alternative Cartesian product. State history backups removed between actions for efficiency; not blind play or human-fun evidence.',baseline,alternatives,optionalNotTested:['brush','brine','salt','hourglass']},null,2)+'\n');
console.log(JSON.stringify({baseline:baseline.metrics,chapters:baseline.chapters.map(r=>({number:r.number,title:r.title,combinations:r.combinations,priorCreatedInputs:r.priorCreatedInputs})),alternativeRoutes:alternatives.length},null,2));
