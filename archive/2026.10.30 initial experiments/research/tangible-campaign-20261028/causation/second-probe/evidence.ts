import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pilot} from './pilot.ts';
import * as M from '../runtime/engine/model.ts';
import type {Action} from '../runtime/schema/scenario.ts';
const routes:Record<string,Action[]>=JSON.parse(readFileSync(new URL('./routes.json',import.meta.url),'utf8'));
const hash=(f:string)=>createHash('sha256').update(readFileSync(new URL(f,import.meta.url))).digest('hex');
const witnesses=Object.fromEntries(Object.entries(routes).map(([name,actions])=>{
 let game=M.createGame(pilot);const prefixes=[{actions:0,view:M.playerView(pilot,game)}];
 for(const [i,action] of actions.entries()){
  const r=M.applyAction(pilot,game,action);if(!r.accepted)throw Error(name+' '+(i+1)+' '+r.message);game=r.game;
  prefixes.push({actions:i+1,view:M.playerView(pilot,game)});
 }
 return [name,{actionsLog:actions,combinations:game.state.metrics.combinations,metrics:game.state.metrics,completed:game.state.completed,events:game.events,prefixes}];
}));
writeFileSync(new URL('./route-evidence.json',import.meta.url),JSON.stringify({kind:'source-aware author witnesses, not blind player or human evidence',sourceCommit:'3d3dbf36c7be473b30e09384f8a279b2fa2d9918',scenarioId:pilot.id,hashes:Object.fromEntries(['pilot.json','pilot.ts','routes.json','play.ts','../runtime/engine/model.ts','../runtime/schema/scenario.ts','../runtime/schema/lifecycle.ts'].map(f=>[f,hash(f)])),witnesses},null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(witnesses).map(([name,w])=>[name,{completed:w.completed,combinations:w.combinations}]))));
