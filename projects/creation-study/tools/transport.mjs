import {spawn,execFileSync} from 'node:child_process';
import {mkdirSync,mkdtempSync,readFileSync,writeFileSync,existsSync,symlinkSync,rmSync,readdirSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {homedir} from 'node:os';
import {randomUUID,createHash} from 'node:crypto';
import {validateSchema} from './protocol.mjs';

const prescribedCli='/Users/ljw/.vscode/extensions/openai.chatgpt-26.1021.22027-darwin-arm64/bin/macos-aarch64/codex';
export function discoverCli() {
  if(existsSync(prescribedCli)) return prescribedCli;
  const extensions='/Users/ljw/.vscode/extensions';
  const candidates=readdirSync(extensions).filter(name=>/^openai\.chatgpt-[\d.]+-darwin-arm64$/.test(name))
    .sort((a,b)=>b.localeCompare(a,undefined,{numeric:true})).map(name=>join(extensions,name,'bin/macos-aarch64/codex'));
  const found=candidates.find(existsSync);
  if(!found) throw new Error('The prescribed VS Code Codex CLI is missing. Install the extension; the binary on PATH is not used.');
  process.stderr.write(`The extension version changed. Using ${found}; update the machine instruction to this path.\n`);
  return found;
}
export const CLI=discoverCli();
export const ISOLATION_INSTRUCTIONS='Use only the supplied assignment and public records. Do not use tools or external sources. Return only the requested JSON response. Do not access files, memories, other participants, or prior assignments.';
export const disabledFeatures=['apps','plugins','remote_plugin','plugin_sharing','recommended_plugins','memories','external_agent_memory_import','shell_tool','shell_snapshot','unified_exec','view_image','multi_agent','multi_agent_v2','code_mode','code_mode_host','code_mode_only','computer_use','browser_use','browser_use_external','browser_use_full_cdp_access','in_app_browser','image_generation','artifact','goals','sleep_tool','skill_search','skill_mcp_dependency_install','hooks','tool_suggest','workspace_dependencies','unbounded_connection_retries','enable_request_compression'];
export function isolationArgs() {
  return ['--no-daemon','-c','model_provider="campaign_https"','-c','model_providers.campaign_https={name="OpenAI",wire_api="responses",requires_openai_auth=true,supports_websockets=false,request_max_retries=0,stream_max_retries=0}','-c',`model_catalog_json=${JSON.stringify(join(import.meta.dirname,'tool-free-models.json'))}`,'-c','suppress_unstable_features_warning=true','-c','approval_policy="never"','-c','instructions=""','-c','skills.include_instructions=false','-c','tools.experimental_request_user_input.enabled=false','-c','tools.update_plan.enabled=false','-c','include_environment_context=false','-c','include_permissions_instructions=false','-c','include_collaboration_mode_instructions=false','-c','include_apps_instructions=false','-c','project_doc_max_bytes=0','-c','project_doc_fallback_filenames=[]','-c','web_search="disabled"','-c','mcp_servers={}','-c','apps._default.enabled=false','-c',`developer_instructions=${JSON.stringify(ISOLATION_INSTRUCTIONS)}`,...disabledFeatures.flatMap(f=>['--disable',f]),'--enable','skip_host_skill_discovery'];
}
export function execArgs({model,effort,cwd,schemaPath,outputPath,extra=[]}) {
  return [...isolationArgs(),...extra,'exec','--ephemeral','--ignore-user-config','--ignore-rules','--skip-git-repo-check','--strict-config','--sandbox','read-only','--cd',cwd,'--model',model,'-c',`model_reasoning_effort="${effort}"`,'--json','--color','never','--output-schema',schemaPath,'--output-last-message',outputPath,'-'];
}
export class ContaminationError extends Error {constructor(message){super(message);this.name='ContaminationError';}}
export function isTransportDiagnostic(event) {
  return (event.type==='item.completed'&&event.item?.type==='error'&&/^Falling back from WebSockets to HTTPS transport\./.test(event.item.message??''))
    ||(event.type==='error'&&/^Reconnecting\.\.\. [1-9]\d*\/[1-9]\d* \(.+\)$/.test(event.message??''));
}
export function auditEvents(stdout) {
  const events=[];
  for(const line of stdout.split('\n').filter(l=>l.trim())) {
    let event;
    try {event=JSON.parse(line);} catch {throw new ContaminationError('Non-JSON CLI event output: tool audit cannot be completed');}
    if(['item.started','item.updated','item.completed'].includes(event.type)) {
      if(!['reasoning','agent_message'].includes(event.item?.type)&&!isTransportDiagnostic(event)) throw new ContaminationError(`Disallowed item event: ${event.item?.type}`);
    } else if(!['thread.started','turn.started','turn.completed','turn.failed','error'].includes(event.type)) throw new ContaminationError(`Unknown CLI event: ${event.type}`);
    events.push(event);
  }
  return events;
}
export class RequestPool {
  constructor(limit=12){this.limit=limit;this.active=0;this.maxActive=0;this.queue=[];this.completed=0;}
  run(task){return new Promise((resolve,reject)=>{this.queue.push({task,resolve,reject});this.pump();});}
  pump(){while(this.active<this.limit&&this.queue.length){const work=this.queue.shift();this.active++;this.maxActive=Math.max(this.maxActive,this.active);Promise.resolve().then(work.task).then(work.resolve,work.reject).finally(()=>{this.active--;this.completed++;this.pump();});}}
}
function runChild(args,prompt,timeoutMs) {
  return new Promise((resolve,reject)=>{
    const cwd=args[args.indexOf('--cd')+1];
    if(!cwd||!args.includes('--cd')) throw new Error('Isolated CLI requires an explicit empty working directory');
    // --ignore-user-config does not suppress global AGENTS.md. A fresh child-only
    // Codex home retains access to the existing credential file, and nothing else.
    const isolatedAuthHome=mkdtempSync(join(dirname(cwd),'cli-home-'));
    const credentialFile=join(process.env.CODEX_HOME??join(homedir(),'.codex'),'auth.json');
    if(existsSync(credentialFile)) symlinkSync(credentialFile,join(isolatedAuthHome,'auth.json'));
    const env={...process.env,CODEX_HOME:isolatedAuthHome};
    for(const name of ['CODEX_THREAD_ID','CODEX_INTERNAL_ORIGINATOR_OVERRIDE','CODEX_SANDBOX','CODEX_SANDBOX_NETWORK_DISABLED']) delete env[name];
    const child=spawn(CLI,args,{stdio:['pipe','pipe','pipe'],env,cwd});
    let stdout='',stderr='',timedOut=false,overflow=false;
    const timer=setTimeout(()=>{timedOut=true;child.kill('SIGKILL');},timeoutMs);
    child.stdout.on('data',chunk=>{stdout+=chunk;if(stdout.length>16_000_000){overflow=true;child.kill('SIGKILL');}});
    child.stderr.on('data',chunk=>{stderr+=chunk;if(stderr.length>2_000_000){overflow=true;child.kill('SIGKILL');}});
    child.on('error',error=>{clearTimeout(timer);rmSync(isolatedAuthHome,{recursive:true,force:true});reject(error);});
    child.on('close',(code,signal)=>{clearTimeout(timer);rmSync(isolatedAuthHome,{recursive:true,force:true});resolve({code,signal,stdout,stderr,timedOut,overflow});});
    child.stdin.on('error',()=>{});child.stdin.end(prompt);
  });
}
const transient=/429|502|503|504|rate.limit|too many requests|overload|temporar|timed? ?out|timeout|connection (?:reset|closed|refused)|ECONNRESET|ETIMEDOUT|stream (?:disconnect|closed)|error sending request|transport error|unexpected EOF|server error/i;
export function transientFailure(result){return result.timedOut||transient.test(result.stderr+'\n'+result.stdout);}
export function failureMessage(result) {
  // CLI warnings on stderr must not hide the structured failure on stdout:
  // shared pacing needs the actual HTTP 429, not an unrelated model warning.
  return [result.stderr,result.stdout].filter(Boolean).join('\n').slice(-2000)||`CLI exit ${result.code}`;
}
export class CliTransport {
  constructor({scratch,pool,timeoutMs=300000,maxAttempts=3,onEvent=()=>{}}){this.scratch=scratch;this.pool=pool;this.timeoutMs=timeoutMs;this.maxAttempts=maxAttempts;this.onEvent=onEvent;this.audit=[];mkdirSync(scratch,{recursive:true});}
  async ask({assignment,phase,packet,schema,model,effort,envelope=false}) {
    const requestId=randomUUID(),folder=join(this.scratch,`${assignment}-${phase}-${requestId}`),cwd=join(folder,'empty');
    mkdirSync(cwd,{recursive:true});
    const prompt=`This is a fresh isolated ${phase} request within assignment ${assignment}. You have no other assignment. The packet is your only evidence. ${envelope?'Transport envelope only: put your exact canonical response under the single key "response"; the envelope is removed before gameplay validation.':'Return the JSON shape requested by the schema.'}\n\n${JSON.stringify(packet)}`;
    writeFileSync(join(folder,'packet.json'),JSON.stringify(packet,null,2)+'\n');
    const schemaPath=join(folder,'schema.json');writeFileSync(schemaPath,JSON.stringify(schema));
    for(let attempt=1;attempt<=this.maxAttempts;attempt++) {
      const outputPath=join(folder,`attempt${attempt}-response.json`),args=execArgs({model,effort,cwd,schemaPath,outputPath});
      const started=Date.now();
      const result=await this.pool.run(()=>runChild(args,prompt,this.timeoutMs));
      writeFileSync(join(folder,`attempt${attempt}-events.jsonl`),result.stdout);
      writeFileSync(join(folder,`attempt${attempt}-stderr.txt`),result.stderr);
      const metadata={assignment,phase,requestId,attempt,model,effort,elapsedMs:Date.now()-started,code:result.code,timedOut:result.timedOut};
      let events;
      try {events=auditEvents(result.stdout);} catch(error){this.audit.push({...metadata,contaminated:error.message});this.onEvent({...metadata,contaminated:error.message});throw error;}
      const completion=events.find(e=>e.type==='turn.completed'),completed=!!completion;
      const failed=events.some(e=>['error','turn.failed'].includes(e.type)&&!isTransportDiagnostic(e));
      metadata.transportDiagnostics=events.filter(isTransportDiagnostic).map(e=>e.message??e.item.message);
      metadata.internalTransportRetries=(result.stderr.match(/stream disconnected - retrying sampling request/g)??[]).length;
      const threadIds=events.filter(e=>e.type==='thread.started').map(e=>e.thread_id);
      if(threadIds.length>1) throw new ContaminationError('Multiple CLI threads in one request');
      if(result.overflow) throw new Error('Transport output exceeded its audit cap');
      if(result.code===0&&completed&&!failed&&existsSync(outputPath)) {
        const raw=readFileSync(outputPath,'utf8');
        const value=JSON.parse(raw);validateSchema(value,schema);
        this.audit.push({...metadata,threadId:threadIds[0],toolEvents:0,usage:completion.usage??null,accepted:true});
        this.onEvent({...metadata,toolEvents:0,usage:completion.usage??null,accepted:true});
        return {value:envelope?value.response:value,raw:envelope?JSON.stringify(value.response,null,2):raw,requestId};
      }
      const retry=attempt<this.maxAttempts&&transientFailure(result);
      const error=failureMessage(result);
      this.audit.push({...metadata,toolEvents:0,retry,error});this.onEvent({...metadata,retry,error});
      if(!retry) throw new Error(`CLI request ${assignment}/${phase} failed after ${attempt} attempt(s): ${error}`);
      await new Promise(resolve=>setTimeout(resolve,Math.min(5000,1000*2**(attempt-1))));
    }
    throw new Error('Unreachable transport attempts');
  }
}
export function cliIdentity(){return {path:CLI,version:execFileSync(CLI,['--version'],{encoding:'utf8'}).trim(),sha256:createHash('sha256').update(readFileSync(CLI)).digest('hex')};}
export {runChild};
