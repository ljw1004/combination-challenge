import fs from 'node:fs';import assert from 'node:assert/strict';import * as E from '../../frozen/v5/engine/model.ts';
const root=new URL('../../',import.meta.url);const s=JSON.parse(fs.readFileSync(new URL('ideas/revision-v6/scenario.json',root),'utf8'));
const routes=JSON.parse(fs.readFileSync(new URL('ideas/revision-v6/alternative-routes.json',root),'utf8'));
const route=routes.find((r:any)=>r.choices.hypothesis==='ask-11'&&r.choices['testable-question']==='ask-12').actions;
const same=(a:any,x:string,y:string)=>a.type==='combine'&&[a.a,a.b].includes(x)&&[a.a,a.b].includes(y);
const results=[];
for(const [name,omitted,later,inject] of [['field-note',['observation','notebook'],'anatomy',{type:'combine',a:'observation',b:'notebook'}],['hypothesis',['observation','question'],'inference',{type:'combine',a:'observation',b:'question'}]] as const){
 const witness=route.filter((a:any)=>!same(a,omitted[0],omitted[1]));fs.writeFileSync(new URL(`./ideas-omit-${name}-route.json`,import.meta.url),JSON.stringify(witness,null,2)+'\n');
 let g=E.createGame(s);let failed:any;
 for(const [i,a] of witness.entries()){const r=E.applyAction(s,g,a);if(!r.accepted){failed={index:i,action:a,message:r.message,stage:s.stages[g.state.stage].id,local:g.state.tokens.filter(t=>t.area===g.state.currentArea).map(t=>t.id),remaining:E.objectiveStates(s,g.state).filter(o=>!o.satisfied)};break;}g=r.game;}
 assert.equal(failed.stage,later);assert.ok(!E.token(g.state,name));
 const evidence={variant:name,failed,localHints:g.state.tokens.filter(t=>t.area===g.state.currentArea).map(t=>({item:t.id,...E.partners(s,g.state,t.id)}))};
 fs.writeFileSync(new URL(`./ideas-omit-${name}-failure.json`,import.meta.url),JSON.stringify(evidence,null,2)+'\n');
 const patched=structuredClone(s);delete patched.stages.find((st:any)=>st.id===later).carry;let p=E.createGame(patched);let inserted=false;
 for(const a of witness){if(!inserted&&patched.stages[p.state.stage].id===later){const r=E.applyAction(patched,p,inject);assert.ok(r.accepted);p=r.game;inserted=true;}const r=E.applyAction(patched,p,a);assert.ok(r.accepted,`${name}: ${r.message}`);p=r.game;}
 assert.ok(p.state.completed);results.push({variant:name,originalFailsAt:failed.stage,failedAction:failed.action,patchedCompleted:p.state.completed,fix:'Remove only '+later+' explicit carry and create missing prerequisite there using existing grammar',patchedMetrics:p.state.metrics});
}
fs.writeFileSync(new URL('./optional-prerequisite-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
