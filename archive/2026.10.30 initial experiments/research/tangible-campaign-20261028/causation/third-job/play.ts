/** Frozen player-only DROP surface. Never show recipe tables or future scenes. */
import {appendFileSync,readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pilot} from './pilot.ts';
import * as M from '../runtime/engine/model.ts';
import type {Action} from '../runtime/schema/scenario.ts';
const [session='sessions/session.json',command='view',json]=process.argv.slice(2),path=resolve(session);
mkdirSync(resolve(path,'..'),{recursive:true});
const startSpec=JSON.parse(readFileSync(new URL('./third-job-checkpoint.json',import.meta.url),'utf8'));
const startGame=()=>command==='new-full'?M.createGame(pilot):M.checkpoint(pilot,startSpec.checkpointId);
const sourceFiles=['pilot.json','pilot.ts','routes.json','third-job-checkpoint.json','play.ts','../runtime/engine/model.ts','../runtime/schema/scenario.ts','../runtime/schema/lifecycle.ts'];
const hashes=Object.fromEntries(sourceFiles.map(f=>[f,createHash('sha256').update(readFileSync(new URL(f,import.meta.url))).digest('hex')]));
if(command==='new'||command==='new-full'||!existsSync(path))writeFileSync(path+'.baseline.json',JSON.stringify({createdAt:new Date().toISOString(),node:process.version,scenarioId:pilot.id,sourceCommit:'3d3dbf36c7be473b30e09384f8a279b2fa2d9918',hashes,setup:{width:360,sourceBlindRequested:true,input:'DROP resolved by M.dropAction',automaticAdvance:true,gameplayExplanationToasts:false,partnerHelpAvailable:true,descriptionSurface:'logical playerView; may expose more description than browser'},start:command==='new-full'?{kind:'full-start'}:{kind:'earned-checkpoint',...startSpec},initialView:M.playerView(pilot,startGame())},null,2)+'\n');
else if(JSON.stringify(JSON.parse(readFileSync(path+'.baseline.json','utf8')).hashes)!==JSON.stringify(hashes))throw Error('Source changed since session setup. Use a new versioned session.');
let g=command==='new'||command==='new-full'||!existsSync(path)?startGame():M.restore(pilot,readFileSync(path,'utf8'));
const beforeView=M.playerView(pilot,g),beforeEventCount=g.events.length;
let feedback:unknown,resolvedAction:Action|undefined;
if(command==='drop'){
 const {source,target}=JSON.parse(json);resolvedAction=M.dropAction(pilot,g.state,source,target);
 const r=M.applyAction(pilot,g,resolvedAction);g=r.game;feedback={accepted:r.accepted,created:r.created??null};
 if(r.accepted&&M.stageComplete(pilot,g.state)&&!g.state.completed)g=M.applyAction(pilot,g,{type:'advance'}).game;
}else if(command==='undo'){const r=M.undo(g);g=r.game;feedback={accepted:r.accepted};}
else if(command==='partners')feedback=M.partners(pilot,g.state,json);
else if(command==='visit'){
 const {area,carry}=JSON.parse(json);resolvedAction={type:'visit',area,carry};const r=M.applyAction(pilot,g,resolvedAction);g=r.game;feedback={accepted:r.accepted};
}else if(!['new','new-full','view'].includes(command))throw Error('Use new (third-job checkpoint), new-full, view, drop JSON, partners ITEM_ID, undo, or visit JSON. Raw combine/place are not player commands.');
writeFileSync(path,JSON.stringify(g,null,2)+'\n');
const output={feedback,view:M.playerView(pilot,g)};
appendFileSync(path+'.transcript.jsonl',JSON.stringify({at:new Date().toISOString(),command,input:json??null,resolvedAction:resolvedAction??null,beforeView,result:output,engineEvents:g.events.slice(beforeEventCount),hashes})+'\n');
console.log(JSON.stringify(output,null,2));
