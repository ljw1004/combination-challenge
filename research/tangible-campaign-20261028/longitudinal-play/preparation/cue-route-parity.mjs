import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),rows=[];
for(const name of ['mars-v4-cue-packet-v1','elements-v7-cue-packet-v1']){
 const dir=new URL(name+'/',root),p=JSON.parse(readFileSync(new URL('provenance.json',dir))),m=JSON.parse(readFileSync(new URL('manifest.json',dir)));
 const hash=x=>createHash('sha256').update(x).digest('hex');
 for(const [path,h] of Object.entries(m.files))assert.equal(hash(readFileSync(new URL(path,dir))),h);
 const M=await import(new URL('engine/model.ts',dir));
 const s=JSON.parse(readFileSync(new URL('scenario.json',dir))),base=JSON.parse(readFileSync(p.basePacket+'/scenario.json'));
 assert.deepEqual(M.validateScenario(s),[]);assert.deepEqual(s.checkpoints,base.checkpoints);assert.deepEqual(s.recipes,base.recipes);
 const route=s.checkpoints.find(c=>c.id==='complete').actions;
 const actual=M.replay(s,route,360),expected=M.replay(base,route,360);
 assert(actual.state.completed);assert.deepEqual(actual.state,expected.state);assert.deepEqual(actual.events,expected.events);
 const row={packet:name,passed:true,scenarioId:s.id,validationErrors:[],authoredActions:route.length,completed:actual.state.completed,identicalFinalStateAndEngineEventsToBase:true,metrics:actual.state.metrics,scope:'Source-aware author-route regression only, not player completion, engagement or human evidence'};
 rows.push(row);
}
writeFileSync(new URL('evidence/cue-experiment-route-parity.json',root),JSON.stringify(rows,null,2)+'\n');console.log(JSON.stringify(rows,null,2));
