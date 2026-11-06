/** Two minimal connectivity requests; no manuscript or reviewer assignment. */
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {rmSync} from 'node:fs';
import {CliTransport,RequestPool} from './transport.mjs';

const scratch=resolve(import.meta.dirname,'../../../runs/creation-pipeline-check/smoke-'+Date.now());
const transport=new CliTransport({scratch,pool:new RequestPool(2),maxAttempts:1,timeoutMs:60000});
const schema={type:'object',properties:{ready:{type:'boolean',enum:[true]}},required:['ready'],additionalProperties:false};
for(const [model,effort] of [['gpt-6.1-terra','medium'],['gpt-6-astra','high']]) {
  const {value}=await transport.ask({assignment:'creation-transport-smoke-'+model,phase:'transport-check',
    packet:{instructions:'This is only a connectivity check. Return ready true. Do not evaluate or play any story.'},schema,model,effort});
  assert.deepEqual(value,{ready:true});
  const audit=transport.audit.at(-1);
  console.log(JSON.stringify({model,effort,accepted:audit.accepted,toolEvents:audit.toolEvents,elapsedMs:audit.elapsedMs}));
}
rmSync(scratch,{recursive:true,force:true});
