/** Logical player surface. It never reveals the recipe table or future scenes. */
import {appendFileSync,readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pilot} from './pilot.ts';
import {applyAction,createGame,partners,playerView,restore,stageComplete,undo} from './runtime/engine/model.ts';
import type {Action} from './runtime/schema/scenario.ts';

const [session='session.json',command='view',json]=process.argv.slice(2);
const path=resolve(session);
mkdirSync(resolve(path,'..'),{recursive:true});
const sourceFiles=['pilot.json','pilot.ts','route.json','play.ts','runtime/engine/model.ts','runtime/schema/scenario.ts','runtime/schema/lifecycle.ts'];
const hashes=Object.fromEntries(sourceFiles.map(f=>[f,createHash('sha256').update(readFileSync(new URL(f,import.meta.url))).digest('hex')]));
const baselinePath=path+'.baseline.json',transcriptPath=path+'.transcript.jsonl';
if(command==='new'||!existsSync(path)){
 writeFileSync(baselinePath,JSON.stringify({createdAt:new Date().toISOString(),node:process.version,scenarioId:pilot.id,sourceCommit:'3d3dbf36c7be473b30e09384f8a279b2fa2d9918',hashes,setup:{width:360,sourceBlind:true,automaticAdvance:true,gameplayExplanationToasts:false,partnerHelpAvailable:true},initialView:playerView(pilot,createGame(pilot))},null,2)+'\n');
}else{
 const frozen=JSON.parse(readFileSync(baselinePath,'utf8'));
 if(JSON.stringify(frozen.hashes)!==JSON.stringify(hashes))throw Error('Source changed since session setup. Start a new versioned session; do not mix evidence.');
}
let g=command==='new'||!existsSync(path)?createGame(pilot):restore(pilot,readFileSync(path,'utf8'));
const beforeView=playerView(pilot,g),beforeEventCount=g.events.length;
let feedback:unknown;
if(command==='act'){
 const r=applyAction(pilot,g,JSON.parse(json) as Action);g=r.game;
 // Browser design hides gameplay explanation toasts. Logical test mirrors this.
 feedback={accepted:r.accepted,created:r.created??null};
 // Logical equivalent of the existing browser's automatic chapter transition.
 if(r.accepted&&stageComplete(pilot,g.state)&&!g.state.completed)g=applyAction(pilot,g,{type:'advance'}).game;
}else if(command==='undo'){
 const r=undo(g);g=r.game;feedback={accepted:r.accepted};
}else if(command==='partners'){
 feedback=partners(pilot,g.state,json);
}else if(!['new','view'].includes(command))throw Error('Use new, view, act JSON, undo, or partners ITEM_ID');
writeFileSync(path,JSON.stringify(g,null,2)+'\n');
const output={feedback,view:playerView(pilot,g)};
appendFileSync(transcriptPath,JSON.stringify({at:new Date().toISOString(),command,input:json??null,beforeView,result:output,engineEvents:g.events.slice(beforeEventCount),hashes})+'\n');
console.log(JSON.stringify(output,null,2));
