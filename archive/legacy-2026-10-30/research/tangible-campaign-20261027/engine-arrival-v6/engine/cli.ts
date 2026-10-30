#!/usr/bin/env node
/** Player surface. Content source is not a sandbox; blindness is protocol-based. */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {applyAction,checkpoint,createGame,dropAction,partners,playerView,restore,undo,validateScenario} from './model.ts';
import type {Game} from './model.ts';import type {Scenario,Action} from '../schema/scenario.ts';
const args=process.argv.slice(2),command=args.shift();
const root=path.resolve(import.meta.dirname,'..'),sessions=path.join(root,'sessions');
const enginePath=path.join(import.meta.dirname,'model.ts');
const implementationPaths=[enginePath,path.join(import.meta.dirname,'cli.ts'),path.join(root,'schema/scenario.ts'),path.join(import.meta.dirname,'player.ts')];
const hash=(x:string)=>crypto.createHash('sha256').update(x).digest('hex');
function emit(x:unknown){console.log(JSON.stringify(x,null,2));}
function safeId(id:string|undefined){if(!id||!/^[a-zA-Z0-9_-]{1,100}$/.test(id))throw Error('Session id must be alphanumeric, underscore or hyphen');return id;}
function load(id:string){const p=path.join(sessions,id,'session.json'),record=JSON.parse(fs.readFileSync(p,'utf8'));const bytes=fs.readFileSync(record.scenarioPath,'utf8');if(hash(bytes)!==record.scenarioSHA256)throw Error('Scenario changed during frozen play; start a new named session');if(hash(fs.readFileSync(enginePath,'utf8'))!==record.engineSHA256)throw Error('Engine changed during frozen play; start a new session');for(const [file,expected] of Object.entries(record.implementationSHA256??{}))if(hash(fs.readFileSync(file,'utf8'))!==expected)throw Error('Frozen implementation changed; start a new session');const s=JSON.parse(bytes) as Scenario;return {p,record,s,g:restore(s,JSON.stringify(record.game))};}
function save(p:string,record:any,g:Game){record.game=g;fs.writeFileSync(p,JSON.stringify(record,null,2)+'\n');}
try{
 if(command==='validate'){const s=JSON.parse(fs.readFileSync(args[0],'utf8'));const errors=validateScenario(s);emit({valid:!errors.length,errors});process.exitCode=errors.length?1:0;}
 else if(command==='init'){
  const id=safeId(args[0]),scenarioPath=path.resolve(args[1]??''),dir=path.join(sessions,id);if(fs.existsSync(dir))throw Error('Session already exists; use a new id rather than overwriting evidence');
  const bytes=fs.readFileSync(scenarioPath,'utf8'),s=JSON.parse(bytes) as Scenario,g=createGame(s),record={scenarioPath,scenarioSHA256:hash(bytes),engineSHA256:hash(fs.readFileSync(enginePath,'utf8')),implementationSHA256:Object.fromEntries(implementationPaths.map(p=>[p,hash(fs.readFileSync(p,'utf8'))])),createdAt:new Date().toISOString(),game:g};fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'session.json'),JSON.stringify(record,null,2)+'\n');fs.writeFileSync(path.join(dir,'commands.jsonl'),JSON.stringify({at:new Date().toISOString(),command:'init',args,output:playerView(s,g)})+'\n');emit(playerView(s,g));
 }else{
  const id=safeId(args.shift()),{p,record,s,g}=load(id);let output:unknown;if(record.closedAt&&!['view','hint'].includes(command??''))throw Error('Session is closed; retain its evidence and start a new id');
  if(command==='view')output=playerView(s,g);
  else if(command==='hint'){const selected=args[0];output={selected,...partners(s,g.state,selected)};}
  else if(command==='drop'){if(args.length!==2)throw Error('Use drop SESSION SOURCE TARGET');const action=dropAction(s,g.state,args[0],args[1]);const r=applyAction(s,g,action);save(p,record,r.game);output={gesture:{source:args[0],target:args[1]},resolvedAction:action,accepted:r.accepted,message:r.message,view:playerView(s,r.game)};}
  else if(command==='act'){const action=JSON.parse(args.join(' ')) as Action;const r=applyAction(s,g,action);save(p,record,r.game);output={accepted:r.accepted,message:r.message,view:playerView(s,r.game)};}
  else if(command==='undo'){const r=undo(g);save(p,record,r.game);output={accepted:r.accepted,message:r.message,view:playerView(s,r.game)};}
  else if(command==='checkpoint'){const next=checkpoint(s,args[0]);record.episodes??=[];record.episodes.push({reason:'checkpoint',game:g});save(p,record,next);record.debugCheckpoint=args[0];save(p,record,next);output={debug:true,view:playerView(s,next)};}
  else if(command==='reset'){const next=createGame(s);record.episodes??=[];record.episodes.push({reason:'reset',game:g});record.resets=(record.resets??0)+1;save(p,record,next);output={reset:true,view:playerView(s,next)};}
  else if(command==='finish'||command==='stop'){record.closedAt=new Date().toISOString();record.outcome=command;record.playerReport=args.join(' ');save(p,record,g);output={outcome:command,completed:g.state.completed,metrics:g.state.metrics};}
  else throw Error('Commands: validate FILE | init SESSION FILE | view SESSION | hint SESSION ITEM | drop SESSION SOURCE TARGET | act SESSION JSON | undo SESSION | checkpoint SESSION ID | reset SESSION | stop/finish SESSION REPORT');
  const capture={at:new Date().toISOString(),command,args,output};fs.appendFileSync(path.join(path.dirname(p),'commands.jsonl'),JSON.stringify(capture)+'\n');emit(output);
 }
}catch(e){console.error(JSON.stringify({error:(e as Error).message}));process.exitCode=1;}
