/** Restricted player interface. Players are instructed to use this CLI only. Isolation is instruction-based. */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { CONCEPTS, RECIPES } from '../src/data.ts';
import { actionLabel, branch, createState, legalActions, newRun, observe, preview, record, replay, settledForecast } from '../src/engine.ts';
import type { Action, Annotation, Run } from '../src/engine.ts';
const [command,id,...args]=process.argv.slice(2);
process.on('uncaughtException',error=>{console.error(error.message);process.exit(1);});
const usage='Commands: init ID SCENARIO SEED RULES annotated|action-only normal|reverse; view ID; act ID \'JSON_ACTION\' [\'JSON_ANNOTATION\']; preview ID \'JSON_ACTION\'; finish ID (only after a zero-damage remaining forecast). Rows/columns are zero-based. No source access is required.';
if(!id||!/^[a-zA-Z0-9_-]+$/.test(id)){console.log(usage);process.exit(command?1:0);}
mkdirSync('results/players',{recursive:true});const path=`results/players/${id}.json`;
if(command==='init'){
  const [scenario='headwaters',seed='1',rules='rooted',condition='annotated',offerOrder='normal',exposure='fresh']=args;
  const s=createState(scenario,Number(seed),rules);const run=newRun(s,id,`${exposure} agent; ${condition}; instruction-based isolation; model inherited gpt-6.1-sol`);
  run.offerOrder=offerOrder==='reverse'?'reverse':'normal';run.model='gpt-6.1-sol (inherited)';
  try{readFileSync(path);throw new Error('Session already exists; use a different ID.');}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
  writeFileSync(path,JSON.stringify(run,null,2));
}else if(!['view','act','preview','branch','finish'].includes(command))throw new Error(usage);
let run=JSON.parse(readFileSync(path,'utf8')) as Run;let s=replay(run);
const order=run.offerOrder??'normal';
const displayed=legalActions(s);if(order==='reverse')displayed.reverse();
if(command==='finish'){
  if(!settledForecast(s).settled)throw new Error('The remaining forecast still causes damage; choose another action.');
  while(s.status==='playing'){const r=record(s,run,{type:'wait'},undefined,'forecast');s=r.state;run=r.run;}
  writeFileSync(path,JSON.stringify(run,null,2));console.log(JSON.stringify({resolvedRemainingForecast:true,allPulsesRecorded:true}));
}
if(command==='act'||command==='preview'){
  const raw=args[0];const a:Action=/^\d+$/.test(raw)?displayed[Number(raw)]:JSON.parse(raw);
  if(!a)throw new Error('Choose a displayed action index or JSON action.');
  if(command==='preview'){const p=preview(s,a);console.log(JSON.stringify({action:a,damage:p.damage,events:p.events,flow:p.flow},null,2));process.exit(0);}
  const annotation=args[1]&&!args[1].startsWith('--')?JSON.parse(args[1]) as Annotation:undefined;
  const result=record(s,run,a,annotation);s=result.state;run=result.run;writeFileSync(path,JSON.stringify(run,null,2));
  console.log(JSON.stringify({response:result.transition.events,damage:result.transition.damage}));
}
if(command==='branch'){
  const b=branch(run,Number(args[0]));s=b.state;run=b.run;writeFileSync(path,JSON.stringify(run,null,2));
}
const observation=observe(s);
if(order==='reverse'){observation.offers.reverse();observation.known.reverse();}
const actions=legalActions(s);if(order==='reverse')actions.reverse();
console.log(JSON.stringify({...observation,legalActions:undefined,actionOrder:order,actions:args.includes('--actions')?actions.map((a,index)=>({index,label:actionLabel(a),action:a})):undefined,legalActionCount:actions.length,finishForecast:settledForecast(s).settled?{command:`node experiments/play.ts finish ${id}`,pulses:settledForecast(s).pulses,description:'The entire remaining forecast causes zero damage. Optionally resolve and record every pulse now.'}:undefined,usage,actionSyntax:{discover:{type:'discover',recipe:'a displayed offer id',at:{row:0,col:0}},deploy:{type:'deploy',concept:'a known deployable id',at:{row:0,col:0}},wait:{type:'wait'}},notes:['One action advances one pulse. Known concepts persist. No resources or crafting chains must be rebuilt.','Positions: row 0 north, 1 middle, 2 south/outlet. Column 0 is upstream, 2 nearest assets. Bedrock cannot be built on.','Water resolves column 0 to 2, north to south in each column. Diversions enter the next lane at the same column.','Heat/steam do not replace structures. New groves mature on their first pulse.','Exact one-turn preview is available with preview ID followed by a quoted JSON action. No multi-turn exploration during a blind run.','For discover, omit at to learn without placing; separate rules always require omitting at.','The full forecast and all legal novel recipes are public. View --actions if numbered legal actions are needed.'],lastChoice:run.decisions.at(-1)?.action},null,2));
