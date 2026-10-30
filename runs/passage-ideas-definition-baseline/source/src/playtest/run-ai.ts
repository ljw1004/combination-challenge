import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {loadStory} from '../story/load.ts';
import {createSession,step,saveSession} from './session.ts';
import type {Account} from './session.ts';
import {observe} from './observe.ts';
import type {PlayerAction} from './observe.ts';
import {experienceCriteria} from './evaluate.ts';
const args=process.argv.slice(2),value=(name:string)=>args[args.indexOf(name)+1];
interface Reply {action?:PlayerAction;account?:Account;stop?:boolean;report?:Record<string,unknown>}
const protocol='Return JSON with action (one player action), optional account {intention,expected,alternatives,experience,hypothesis}, or stop:true and report. Choose only from the player observation. Do not inspect story source, checkpoints, other trials or developer recipes. You may stop satisfied, bored or confused. Report concrete experiences and a falsifiable next experiment. Do not invent a dilemma for every combination or equate completion with enjoyment.';
async function ask(input:unknown,command:string[]|undefined,endpoint:string|undefined):Promise<Reply>{
  if(endpoint){const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',...(process.env.PLAYTEST_API_KEY?{Authorization:`Bearer ${process.env.PLAYTEST_API_KEY}`}:{})},body:JSON.stringify(input),signal:AbortSignal.timeout(60000)});if(!response.ok)throw new Error(`Agent endpoint returned HTTP ${response.status}.`);return await response.json() as Reply;}
  if(!command?.length)throw new Error('Provide --agent as a JSON command array, or --endpoint for a JSON agent service.');
  const cwd=mkdtempSync(join(tmpdir(),'combination-player-'));
  try{return await new Promise((resolve,reject)=>{
    const child=spawn(command[0],command.slice(1),{cwd,stdio:['pipe','pipe','pipe'],shell:false});let out='',err='';const timer=setTimeout(()=>{child.kill('SIGTERM');reject(new Error('Agent timed out after 60 seconds.'));},60000);
    child.stdout.on('data',chunk=>{out+=chunk;if(out.length>1000000){child.kill();reject(new Error('Agent response exceeded 1 MB.'));}});child.stderr.on('data',chunk=>{err+=chunk;});child.on('error',error=>{clearTimeout(timer);reject(error);});child.on('close',code=>{clearTimeout(timer);if(code)reject(new Error(`Agent process exited ${code}; stderr retained only by the process, not included in player evidence.`));else try{resolve(JSON.parse(out));}catch{reject(new Error('Agent must return one JSON object on stdout.'));}});child.stdin.end(JSON.stringify(input)+'\n');
  });}finally{rmSync(cwd,{recursive:true,force:true});}
}
try{
  if(!args.includes('--story')||!args.includes('--session')||(!args.includes('--agent')&&!args.includes('--endpoint')))throw new Error('Usage: npm run playtest -- --story mars --session trial-01 --model LABEL --agent \'["/absolute/agent","arg"]\' [--max-turns 300]. The agent receives player-only JSON on stdin and returns JSON. Alternatively use --endpoint URL.');
  const id=value('--story'),{story}=loadStory(id),session=createSession(value('--session'),id,{model:args.includes('--model')?value('--model'):'unspecified agent'}),max=args.includes('--max-turns')?Number(value('--max-turns')):300;
  if(!Number.isInteger(max)||max<1)throw new Error('--max-turns must be a positive integer.');
  const command=args.includes('--agent')?JSON.parse(value('--agent')):undefined,endpoint=args.includes('--endpoint')?value('--endpoint'):undefined;
  try{
    for(let turn=0;turn<max;turn++){
      const reply=await ask({protocol,criteria:experienceCriteria,reportFormat:'report.criteria maps criterion IDs to {assessment: supported|concerning|mixed|unknown, explanation: string, events: [actual sequence numbers]}; also report.nextExperiment and your stopping reason. Do not manufacture positive evidence.',assignment:session.assignment,observation:observe(story,session.state),history:session.entries.map(e=>({sequence:e.sequence,action:e.action,account:e.account,error:e.error})),recentResults:session.entries.slice(-4).map(e=>({sequence:e.sequence,result:e.after}))},command,endpoint);
      if(reply.stop){session.outcome=session.state.completed?'completed':'stopped';session.report=reply.report??{};break;}
      if(!reply.action)throw new Error('Agent response needs an action or stop:true.');
      const entry=step(session,story,reply.action,reply.account);console.log(JSON.stringify({turn:turn+1,action:reply.action.type,chapter:session.state.chapter,rejected:!!entry.error}));
      if(session.state.completed&&!session.state.pending.length){session.outcome='completed';session.report=reply.report;break;}
    }
    session.outcome??='budget';
    if(!session.report){const reflection=await ask({protocol:'The play session has ended. Return stop:true and report with criteria assessments (supported, concerning, mixed or unknown), explanations and cited event sequence numbers; include a stopping reason and nextExperiment. Do not infer human enjoyment.',criteria:experienceCriteria,outcome:session.outcome,history:session.entries.map(e=>({sequence:e.sequence,action:e.action,account:e.account,error:e.error})),observation:observe(story,session.state)},command,endpoint);session.report=reflection.report??{};}
    saveSession(session);console.log(JSON.stringify({session:session.id,outcome:session.outcome,turns:session.entries.length}));
  }catch(error){session.outcome='technical-interruption';saveSession(session);throw error;}
}catch(error){console.error((error as Error).message);process.exitCode=1;}
