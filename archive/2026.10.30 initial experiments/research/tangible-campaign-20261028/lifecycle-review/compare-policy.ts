import assert from 'node:assert/strict';import {readFileSync,writeFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import * as O from './implementation-baseline/engine/model.ts';import * as N from './integration/experiments/tangible-campaign/engine/model.ts';
import {scenarios} from './integration/experiments/tangible-campaign/ui/scenarios.ts';import type {Scenario,Action} from './integration/experiments/tangible-campaign/schema/scenario.ts';
const root='/workspace/shared/combination-campaign-research-20261028/';const json=(p:string)=>JSON.parse(readFileSync(root+p,'utf8'));
const jobs:{label:string;s:Scenario;actions:Action[];candidate?:boolean;alternative?:boolean}[]=scenarios.map(s=>({label:s.id,s,actions:JSON.parse(readFileSync(new URL('./integration/experiments/tangible-campaign/evidence/'+s.id+'-route-evidence.json',import.meta.url),'utf8')).actionsLog}));
const add=(label:string,file:string,actions:Action[],alternative=false)=>jobs.push({label,s:json(file),actions,candidate:true,alternative});
add('Elements v7','elements/candidates/v7/scenario.json',json('elements/candidates/v7/elements-gathering-refinement-v7-route-evidence.json').actionsLog);
add('Mars v4','mars/revision-v4/candidate.scenario.json',json('mars/revision-v4/candidate-route-evidence.json').actionsLog);
for(const f of ['tow','beacon','tow-old-alias'])add('Mars v4 '+f,'mars/revision-v4/candidate.scenario.json',json('mars/revision-v4/'+f+'.actions.json'),true);
add('Atlas candidate','atlas/scenario.json',json('atlas/author-route.json'));
add('Food candidate','food/scenario.json',json('food/scenario.json').checkpoints.find((c:any)=>c.id==='complete').actions);
add('Causation candidate','causation/pilot.json',json('causation/route-evidence.json').actionsLog);
add('Doctrine v3','doctrine/revision-3-local-inference/doctrine-argument-desks-v3-candidate.json',json('doctrine/revision-3-local-inference/route-evidence.json').actionsLog);
for(const [i,alt] of json('doctrine/revision-3-local-inference/alternative-route-evidence.json').entries())add('Doctrine v3 alternative '+(i+1),'doctrine/revision-3-local-inference/doctrine-argument-desks-v3-candidate.json',alt.actionsLog,true);
const rows:any[]=[],issues:any[]=[];
for(const job of jobs)for(const width of job.alternative?[360]:job.candidate||['mars-cargo-revision-v2','elements-observation-revision-v6'].includes(job.s.id)?[320,360,375]:[360]){
 const {s,actions}=job;let old=O.createGame(s,width),now=N.createGame(s,width),maxExtra=0,maxTotalExtra=0,maxHeightDelta=0,changedTransfers=0,changedPositions=0,maxExtraAt:any,stages:Record<string,any>={};
 for(let i=0;i<actions.length;i++){
  const ro=O.applyAction(s,old,actions[i]),rn=N.applyAction(s,now,actions[i]);if(!ro.accepted||!rn.accepted){issues.push({label:job.label,width,i,action:actions[i],old:ro.message,new:rn.message});break;}old=ro.game;now=rn.game;
  assert.deepEqual(now.state.discovered,old.state.discovered);assert.deepEqual(now.state.recipesUsed,old.state.recipesUsed);assert.equal(now.state.stage,old.state.stage);assert.deepEqual(now.state.metrics,old.state.metrics);
  const area=now.state.currentArea,ot=old.state.tokens.filter(t=>t.area===area),nt=now.state.tokens.filter(t=>t.area===area),extra=nt.filter(t=>!ot.some(o=>o.id===t.id)).map(t=>t.id);
  const oldHeight=Math.max(0,...ot.map(t=>t.y+O.tokenHeight(s,t)/2)),newHeight=Math.max(0,...nt.map(t=>t.y+N.tokenHeight(s,t)/2));
  const sid=s.stages[now.state.stage].id,st=stages[sid]??={oldPeak:0,newPeak:0,maxExtra:0,maxHeightDelta:0,arrivalExtra:[],extraKinds:[]};
  st.oldPeak=Math.max(st.oldPeak,ot.length);st.newPeak=Math.max(st.newPeak,nt.length);st.maxExtra=Math.max(st.maxExtra,extra.length);st.maxHeightDelta=Math.max(st.maxHeightDelta,newHeight-oldHeight);st.extraKinds=[...new Set([...st.extraKinds,...extra])];if(actions[i].type==='advance')st.arrivalExtra=extra;
  maxTotalExtra=Math.max(maxTotalExtra,now.state.tokens.length-old.state.tokens.length);maxHeightDelta=Math.max(maxHeightDelta,newHeight-oldHeight);if(extra.length>maxExtra){maxExtra=extra.length;maxExtraAt={action:i+1,stage:sid,oldCount:ot.length,newCount:nt.length,extra};}
  if(JSON.stringify(ro.game.events.at(-1)?.transfers??[])!==JSON.stringify(rn.game.events.at(-1)?.transfers??[]))changedTransfers++;
  if(nt.some(t=>{const o=ot.find(x=>x.id===t.id);return o&&(o.x!==t.x||o.y!==t.y);}))changedPositions++;
 }
 if(old.state.completed!==now.state.completed)issues.push({label:job.label,width,completionMismatch:true});
 assert.deepEqual(N.restore(s,JSON.stringify(now)),now);
 rows.push({label:job.label,scenario:s.id,width,candidate:!!job.candidate,alternative:!!job.alternative,actions:actions.length,completed:now.state.completed,combinations:now.state.metrics.combinations,maxExtraCurrentArea:maxExtra,maxExtraAt,maxExtraGlobal:maxTotalExtra,maxHeightDelta,changedTransferActions:changedTransfers,actionsWithCommonTokenPositionDifferences:changedPositions,extraFinalTokens:now.state.tokens.filter(t=>!old.state.tokens.some(x=>x.id===t.id)).map(t=>({id:t.id,area:t.area})),stageClutter:stages});
}
// Source-blind trial is historical evidence: replay its actions, not its old physical state hash.
const session=json('elements/candidates/v7/frozen/sessions/elements_gathering_v7_a/session.json');const s=json('elements/candidates/v7/frozen/scenarios/elements-v7.json');let g=N.createGame(s);const deltas=[];
for(const e of session.game.events){const r=N.applyAction(s,g,e.action);assert.equal(r.accepted,e.accepted);g=r.game;if(['oil','feast-from-warm-meal'].includes(r.recipe??''))deltas.push({seq:e.seq,recipe:r.recipe,retired:r.retired,millstonePresent:!!N.token(g.state,'millstone'),breadPresent:!!N.token(g.state,'bread')});}
assert.deepEqual(g.state.metrics,session.game.state.metrics);assert.equal(g.state.stage,session.game.state.stage);assert.equal(g.state.completed,session.game.state.completed);assert.deepEqual(N.restore(s,JSON.stringify(g)),g);
writeFileSync(new URL('./corrected-route-clutter.json',import.meta.url),JSON.stringify({rows,issues,frozenV7:{events:g.events.length,acceptedPatternsMatch:true,metricsMatch:true,deltas}},null,2)+'\n');
console.log(JSON.stringify({runs:rows.length,issues,primaryRows:rows.filter(r=>r.width===360&&!r.alternative).map(({stageClutter,extraFinalTokens,...r})=>({...r,extraFinalTokens:extraFinalTokens.length})),frozenV7:{events:g.events.length,deltas}},null,2));assert.deepEqual(issues,[]);
