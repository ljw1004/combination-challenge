/** Public finite collection CLI. Queries/rejections/finish never count as game selections. */
import fs from 'node:fs';
import path from 'node:path';
import {initial,step,view,endpoints,VERSION,type State,type Action} from './logical-ideas-history-estuary.ts';
const [command,session,arg,note='']=process.argv.slice(2);
const help=`Estuary of Continuing Lives (${VERSION})
Speculative fiction: create six connected projects using public exact signal laws.
Read docs/ideas-history-estuary-public-guide.md for full laws and JSON grammar.
node experiments/ideas-history-estuary-play.ts init SESSION [normal|complete]
node experiments/ideas-history-estuary-play.ts view SESSION
node experiments/ideas-history-estuary-play.ts preview SESSION 'ACTION_JSON'
node experiments/ideas-history-estuary-play.ts act SESSION 'ACTION_JSON' 'optional reason'
node experiments/ideas-history-estuary-play.ts finish SESSION 'your assessment'
Queries and rejected commands are captured, not counted as accepted selections.
`;
if(command==='help'||!command){console.log(help);}else{
 if(!session||! /^[a-zA-Z0-9_-]+$/.test(session))throw Error('Use a simple session name');
 const dir=path.resolve('results/ideas-history-estuary-players',session),stateFile=path.join(dir,'state.json'),capture=path.join(dir,'capture.jsonl'),finished=path.join(dir,'finished.json');
 const record=(entry:unknown)=>fs.appendFileSync(capture,JSON.stringify({at:new Date().toISOString(),...entry as object})+'\n');
 if(command==='init'){
  if(fs.existsSync(dir))throw Error('Session already exists; never overwrite a capture');if(arg&&arg!=='normal'&&arg!=='complete')throw Error('Unknown catalogue');fs.mkdirSync(dir,{recursive:true});const s=initial(arg as 'normal'|'complete'|undefined);fs.writeFileSync(stateFile,JSON.stringify(s,null,2));const output=view(s);record({type:'init',version:VERSION,catalogue:s.catalogue,output});console.log(JSON.stringify(output,null,2));
 }else{
  const s=JSON.parse(fs.readFileSync(stateFile,'utf8')) as State;
  if(command==='view'){const output=view(s);record({type:'view',selection:s.selections,output});console.log(JSON.stringify(output,null,2));}
  else if(command==='preview'){
   try{const action=JSON.parse(arg??'null') as Action;const forecast=step(s,action);const output={hypothetical:true,acceptedSelection:s.selections,forecast:view(forecast),automatic:forecast.ledger.at(-1)!.automatic};record({type:'preview',action,selection:s.selections,output});console.log(JSON.stringify(output,null,2));}
   catch(error){const message=error instanceof Error?error.message:String(error);record({type:'preview',input:arg,selection:s.selections,error:message});console.error(message);process.exitCode=1;}
  }else if(command==='act'){
   try{if(fs.existsSync(finished))throw Error('Session finished; create a new session for further play');const action=JSON.parse(arg??'null') as Action;const next=step(s,action);const output=view(next);record({type:'accepted',action,note,selection:next.selections,automatic:next.ledger.at(-1)!.automatic,output});fs.writeFileSync(stateFile,JSON.stringify(next,null,2));console.log(JSON.stringify(output,null,2));}
   catch(error){const message=error instanceof Error?error.message:String(error);record({type:'rejected',input:arg,note,selection:s.selections,error:message});console.error(message);process.exitCode=1;}
  }else if(command==='finish'){if(fs.existsSync(finished)){record({type:'rejected-command',command,error:'Already finished'});throw Error('Already finished');}const report={type:'finish',report:arg??'',selection:s.selections,projects:endpoints(s)};record(report);fs.writeFileSync(finished,JSON.stringify(report,null,2));console.log(JSON.stringify({selections:s.selections,projects:endpoints(s)},null,2));}
  else {record({type:'rejected-command',command,error:'Unknown command'});throw Error('Unknown command; use help');}
 }
}
