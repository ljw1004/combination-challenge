import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import * as M from './engine/model.ts';
const root=import.meta.dirname,hash=(b:any)=>crypto.createHash('sha256').update(b).digest('hex');const report=[];
for(const id of ['mars_later_a','ideas_later_a','elements_later_a']){
 const d=path.join(root,'sessions',id),r=JSON.parse(fs.readFileSync(path.join(d,'session.json'),'utf8'));assert(r.closedAt);const b=fs.readFileSync(r.scenarioPath);assert.equal(hash(b),r.scenarioSHA256);for(const [p,h] of Object.entries(r.implementationSHA256))assert.equal(hash(fs.readFileSync(p)),h);
 const s=JSON.parse(b.toString()),baseline=M.checkpoint(s,r.debugCheckpoint),delta=Object.fromEntries(Object.entries(r.game.state.metrics).map(([k,v])=>[k,Number(v)-Number((baseline.state.metrics as any)[k])]));
 let g=M.createGame(s);for(const e of r.game.events){const result=M.applyAction(s,g,e.action);assert.equal(result.accepted,e.accepted);g=result.game;}assert.deepEqual(g,r.game);
 const commands=fs.readFileSync(path.join(d,'commands.jsonl'),'utf8').trim().split('\n').map(x=>JSON.parse(x));
 report.push({id,scenarioSHA256:r.scenarioSHA256,engineSHA256:r.engineSHA256,checkpoint:r.debugCheckpoint,baselineMetrics:baseline.state.metrics,freshMetrics:delta,hints:commands.filter(c=>c.command==='hint').length,closedAt:r.closedAt,outcome:r.outcome,completed:r.game.state.completed,currentStage:s.stages[g.state.stage].id,exactReplay:true,report:r.playerReport});
}
fs.writeFileSync(path.join(root,'closed-replay-report.json'),JSON.stringify({checkedAt:new Date().toISOString(),scope:'Targeted checkpoint-started logical play. Baseline authored actions excluded; not full campaign or human fun proof.',sessions:report},null,2)+'\n');console.log(JSON.stringify(report.map(({id,freshMetrics,hints,exactReplay})=>({id,freshMetrics,hints,exactReplay})),null,2));
