#!/usr/bin/env node
// One stateless JSON request in; one JSON response out. Never resumes a thread.
import {spawn} from 'node:child_process';
import {mkdtempSync,readFileSync,writeFileSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

export const CODEX = '/Users/ljw/.vscode/extensions/openai.chatgpt-26.1021.22027-darwin-arm64/bin/macos-aarch64/codex';
const object = properties => ({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const string = {type:'string'}, integer = {type:'integer'}, boolean = {type:'boolean'};
const array = items => ({type:'array',items});
const evidence = object({text:string,steps:array(integer)});
const detailChoice = {anyOf:[object({inspect:string}),object({combine:string,with:string})]};
const activeChildren=new Set();
for(const [signal,code] of [['SIGINT',130],['SIGTERM',143]])process.once(signal,()=>{
  for(const {child,directory} of activeChildren){child.kill('SIGKILL');rmSync(directory,{recursive:true,force:true});}
  process.exit(code);
});

function responseSchema(packet,role) {
  if (role === 'synthesis') return object({report:string});
  if (role === 'grader') return object({
    verdict:string,decisions:array(object({step:integer,meaningful:boolean,reason:string})),
    fun:object({meaningful:integer,total:integer,ratio:{type:['number','null']},explanation:string}),
    hook:object({score:packet.final ? {type:'string',enum:['high','medium','low']} : {type:'null'},reason:string,steps:array(integer)}),
    strongest:evidence,weakest:evidence,limits:string,
  });
  const reflection = packet.reflectionRequired ? {effect:string,reaction:string} : {};
  if (packet.request === 'final-report') return object({...reflection,step:integer,report:object({
    mostWorthwhile:evidence,leastWorthwhile:evidence,surprise:evidence,arbitrary:evidence,continue:evidence,
  })});
  const choice = packet.playStyle === 'fast' ? integer : detailChoice;
  const decision = object({...reflection,step:integer,reason:string,choice,expectation:string,
    alternatives:array(object({choice:packet.playStyle === 'fast' ? {type:['integer','string']} :
      {anyOf:[...detailChoice.anyOf,object({look:{const:true}})]},reason:string}))});
  if (!packet.adventure.lookAvailable) return decision;
  return {anyOf:[decision,object({step:integer,choice:packet.playStyle === 'fast' ? {const:'L'} : object({look:{const:true}})})]};
}

export async function codexReply(packet,{role='player',timeoutMs=300000}={}) {
  if (!existsSync(CODEX)) throw new Error(`Required Codex binary is missing: ${CODEX}`);
  const model = role === 'player' ? 'gpt-6.1-terra' : 'gpt-6-astra';
  const effort = role === 'player' ? 'medium' : 'high';
  const directory = mkdtempSync(join(tmpdir(),'builder-participant-'));
  const schemaPath = join(directory,'schema.json'),instructionsPath = join(directory,'instructions.txt');
  writeFileSync(schemaPath,JSON.stringify(object({response:responseSchema(packet,role)})));
  writeFileSync(instructionsPath,'You are an isolated research participant. Follow the assignment in the supplied JSON packet exactly. Use only that packet. Do not use tools, read files, consult other sources, or contact other agents. Return only the requested structured response in the response envelope.');
  const args = ['exec','--ignore-user-config','--ignore-rules','--ephemeral','--skip-git-repo-check',
    '--sandbox','read-only','--json','--color','never','--model',model,'--output-schema',schemaPath,
    '-c',`model_reasoning_effort=${effort}`,'-c','approval_policy="never"',
    '-c',`model_instructions_file=${JSON.stringify(instructionsPath)}`,
    '-c','project_doc_max_bytes=0','-c','skills.include_instructions=false','-c','skills.bundled.enabled=false',
    '-c','web_search="disabled"','-c','suppress_unstable_features_warning=true',
    '--enable','skip_host_skill_discovery',
    ...['shell_tool','apps','plugins','multi_agent','memories','hooks','image_generation','view_image',
      'browser_use','computer_use','goals','sleep_tool','skill_search','shell_snapshot'].flatMap(f=>['--disable',f]),'-'];
  // Keep existing authentication in place, but omit parent thread and plugin settings.
  const env = Object.fromEntries(Object.entries(process.env).filter(([key])=>
    ['HOME','PATH','USER','LOGNAME','TMPDIR','LANG','LC_ALL','CODEX_HOME','SSL_CERT_FILE','SSL_CERT_DIR',
      'HTTPS_PROXY','HTTP_PROXY','ALL_PROXY','NO_PROXY','https_proxy','http_proxy','all_proxy','no_proxy'].includes(key)));
  try {
    return await new Promise((resolve,reject)=>{
      const child=spawn(CODEX,args,{cwd:directory,env,stdio:['pipe','pipe','pipe']});
      const active={child,directory};activeChildren.add(active);
      let output='',failure;
      const fail=error=>{failure??=error;child.kill('SIGKILL');};
      const timer=setTimeout(()=>fail(new Error(`Codex ${role} timed out after ${timeoutMs/1000}s.`)),timeoutMs);
      child.stdout.on('data',chunk=>{output+=chunk;if(output.length>4000000)fail(new Error('Codex output exceeded 4 MB.'));});
      child.stderr.resume();
      child.stdin.on('error',fail);child.on('error',fail);
      child.on('close',code=>{
        activeChildren.delete(active);
        clearTimeout(timer);
        if(failure)return reject(failure);
        const events=output.trim().split('\n').filter(Boolean).map(line=>{try{return JSON.parse(line);}catch{return null;}}).filter(Boolean);
        const tools=events.filter(e=>e.type==='item.completed' && !['agent_message','reasoning'].includes(e.item?.type));
        if(tools.length)return reject(new Error('Participant attempted a tool call or emitted a forbidden item ('+
          tools.map(e=>e.item.type+(e.item.name?':'+e.item.name:'')).join(', ')+
          '); discard this assignment.'));
        if(code)return reject(new Error(`Codex ${role} exited ${code}. ${events.filter(e=>e.type==='error').map(e=>e.message).join(' ').slice(0,600)}`));
        const final=events.filter(e=>e.type==='item.completed' && e.item?.type==='agent_message').at(-1)?.item.text;
        try {resolve(JSON.parse(final).response);}catch {reject(new Error('Codex did not return the required JSON envelope.'));}
      });
      child.stdin.end(JSON.stringify(packet));
    });
  } finally {rmSync(directory,{recursive:true,force:true});}
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try {
    const input=[];for await (const part of process.stdin) input.push(part);
    const packet=JSON.parse(Buffer.concat(input).toString());
    const role=process.argv[2] ?? (packet.request ? 'player' : 'grader');
    console.log(JSON.stringify(await codexReply(packet,{role})));
  } catch(error) {console.error(error.message);process.exitCode=1;}
}
