import {createServer} from 'node:http';
import {mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
import {execArgs,runChild,ISOLATION_INSTRUCTIONS,auditEvents} from './transport.mjs';
const folder=resolve(import.meta.dirname,'../../../runs/cosmic-game/pipeline-check/isolation-fixture-'+Date.now());mkdirSync(join(folder,'empty'),{recursive:true});
const schemaPath=join(folder,'schema.json');writeFileSync(schemaPath,JSON.stringify({type:'object',properties:{fixture:{type:'boolean'}},required:['fixture'],additionalProperties:false}));
let captured=[];
const server=createServer((req,res)=>{let body='';req.on('data',x=>body+=x);req.on('end',()=>{
  try{captured.push({path:req.url,body:JSON.parse(body)});}catch{captured.push({path:req.url,body});}
  if(!req.url.endsWith('/responses')) {res.writeHead(400);res.end('{"error":{"message":"Local fixture only"}}');return;}
  const part={type:'output_text',text:'{"fixture":true}',annotations:[]};
  const item={type:'message',id:'msg_fixture',role:'assistant',status:'completed',content:[part]};
  const response={id:'resp_fixture',object:'response',created_at:0,model:JSON.parse(body).model,status:'completed',output:[item],usage:{input_tokens:1,output_tokens:1,total_tokens:2,input_tokens_details:{cached_tokens:0}}};
  const events=[{type:'response.created',response:{...response,status:'in_progress',output:[]}},{type:'response.output_item.added',output_index:0,item:{...item,status:'in_progress',content:[]}},{type:'response.output_text.delta',output_index:0,content_index:0,item_id:item.id,delta:part.text},{type:'response.output_item.done',output_index:0,item},{type:'response.completed',response}];
  res.writeHead(200,{'content-type':'text/event-stream'});res.end(events.map(e=>`event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join(''));
});});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port=server.address().port;
try {
  const extra=['-c','model_provider="local_fixture"','-c',`model_providers.local_fixture={ name="Local fixture", base_url="http://127.0.0.1:${port}/v1", wire_api="responses", requires_openai_auth=false, request_max_retries=0, stream_max_retries=0 }`];
  for(const [model,effort] of [['gpt-6.1-terra','medium'],['gpt-6-astra','high']]) {
  captured=[];
  const args=execArgs({model,effort,cwd:join(folder,'empty'),schemaPath,outputPath:join(folder,'response.json'),extra});
  const result=await runChild(args,'LOCAL_FIXTURE_INPUT_ONLY',30000);
  writeFileSync(join(folder,'result.json'),JSON.stringify(result,null,2));
  writeFileSync(join(folder,'captured.json'),JSON.stringify(captured,null,2));
  assert(captured.length>0,`No request captured. CLI said: ${result.stderr}`);
  const events=auditEvents(result.stdout);
  assert.equal(result.code,0,`Local provider round trip failed: ${result.stderr}`);
  assert(events.some(e=>e.type==='turn.completed'),'CLI did not accept fixture response');
  assert.deepEqual(JSON.parse(readFileSync(join(folder,'response.json'),'utf8')),{fixture:true});
  const request=captured.find(c=>c.path.includes('responses'))?.body;assert(request,'Missing Responses request');
  console.log(JSON.stringify({requests:captured.length,tools:request.tools?.map(t=>t.name??t.type),inputTypes:request.input?.map(i=>i.type),model:request.model}));
  assert.equal(request.tools?.length??0,0,'CLI must expose no tools');
  assert.equal(request.model,model);assert.equal(request.reasoning.effort,effort);
  assert.equal(request.instructions??'','');
  const machineInstructions='# AGENTS.md instructions\n\n<INSTRUCTIONS>\n'+readFileSync('/Users/ljw/.codex/AGENTS.md','utf8').trim()+'\n</INSTRUCTIONS>';
  assert.deepEqual(request.input.map(i=>({role:i.role,content:i.content.map(c=>c.text).join('\n')})),[
    {role:'developer',content:ISOLATION_INSTRUCTIONS},{role:'user',content:machineInstructions},{role:'user',content:'LOCAL_FIXTURE_INPUT_ONLY'},
  ],'Only neutral transport instructions, the inspected machine CLI-path guidance, and the assignment may enter the request');
  const input=JSON.stringify(request.input);
  for(const forbidden of ['<skills_instructions>','<memory','Story direction','Make Something Worthwhile']) assert(!input.includes(forbidden),`Unexpected inherited evidence: ${forbidden}`);
  console.log('PASS: local intercepted payload has no tools, project instructions, skills, memories, or story evidence. Machine CLI-path guidance is present. No inference was performed.');
  }
} finally {await new Promise(r=>server.close(r));}
rmSync(folder,{recursive:true,force:true});
