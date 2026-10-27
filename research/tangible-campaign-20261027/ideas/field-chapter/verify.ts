import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {validateScenario,createGame,applyAction,playerView,partners,stageComplete} from '../../frozen/v5/engine/model.ts';
const root=import.meta.dirname, s=JSON.parse(fs.readFileSync(`${root}/scenario.json`,'utf8')), m=JSON.parse(fs.readFileSync(`${root}/module.json`,'utf8'));
assert.deepEqual(validateScenario(s),[]);
const checks:any[]=[];
for(const reverse of [false,true]){
 let g=createGame(s),peak=g.state.tokens.length;assert.equal(playerView(s,g).completionText,null);
 assert.equal(applyAction(s,g,{type:'advance'}).accepted,false);
 for(const r of s.recipes){
  const h=JSON.stringify(partners(s,g.state,r.a));assert.ok(!h.includes(r.out));
  const a={type:'combine' as const,a:reverse?r.b:r.a,b:reverse?r.a:r.b};
  const q=applyAction(s,g,a);assert.ok(q.accepted,q.message);g=q.game;peak=Math.max(peak,g.state.tokens.length);
  assert.equal(applyAction(s,g,a).accepted,false);
 }
 assert.ok(stageComplete(s,g.state));assert.equal(playerView(s,g).completionText,s.stages[0].completionText);
 const q=applyAction(s,g,{type:'advance'});assert.ok(q.accepted);assert.ok(q.game.state.completed);
 checks.push({test:reverse?'reverse operands witness':'forward witness',passed:true,combinations:g.state.metrics.combinations,peakTokens:peak,finalTokens:g.state.tokens.length});
}
for(const omit of s.recipes){
 let g=createGame(s);for(const r of s.recipes.filter((r:any)=>r.id!==omit.id)){const q=applyAction(s,g,{type:'combine',a:r.a,b:r.b});if(q.accepted)g=q.game;}
 assert.ok(!stageComplete(s,g.state));assert.equal(applyAction(s,g,{type:'advance'}).accepted,false);
 checks.push({test:`omit ${omit.id}`,passed:true,goalUnreachable:true});
}
let initial=createGame(s);for(const [a,b] of [['field-bar-magnet','field-hand-generator'],['field-compass','field-switch-log'],['field-ring-replica','experimental-protocol']])assert.equal(applyAction(s,initial,{type:'combine',a,b}).accepted,false);
checks.push({test:'three tempting unsupported direct combinations rejected',passed:true});
for(const version of ['revision-v4/scenario-v4.1.json','revision-v5/scenario.json']){
 const base=JSON.parse(fs.readFileSync(`${root}/../${version}`,'utf8'));
 assert.deepEqual(base.items.find((x:any)=>x.id==='experimental-protocol'),s.items.find((x:any)=>x.id==='experimental-protocol'));
 base.items.push(...m.items);base.recipes.push(...m.recipes);base.sources.push(...m.sources);base.stages.splice(base.stages.findIndex((x:any)=>x.id==='signals'),0,...m.stages);
 assert.deepEqual(validateScenario(base),[]);assert.equal(new Set(base.sources.map((x:any)=>x.id)).size,base.sources.length);
 checks.push({test:`in-memory combined schema ${version}`,passed:true});
}
const sourceIds=new Set(s.sources.map((x:any)=>x.id));for(const x of [...s.items,...s.recipes])for(const id of x.sources??[])assert.ok(sourceIds.has(id));
const report={passed:true,scope:'Author-generated logical witnesses and negative checks with frozen/v5. No fresh-player, rendered UI, or full integrated campaign route test.',scenarioSha256:crypto.createHash('sha256').update(fs.readFileSync(`${root}/scenario.json`)).digest('hex'),checks};
fs.writeFileSync(`${root}/verification.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
