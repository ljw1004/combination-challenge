import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pilot} from './pilot.ts';
import {applyAction,createGame,playerView} from './runtime/engine/model.ts';
import type {Action} from './runtime/schema/scenario.ts';
const actions:Action[]=JSON.parse(readFileSync(new URL('./route.json',import.meta.url),'utf8'));
let game=createGame(pilot),maxThings=game.state.tokens.length;
const prefixes=[{actions:0,view:playerView(pilot,game)}];
for(const [i,a] of actions.entries()){
 const r=applyAction(pilot,game,a);if(!r.accepted)throw Error(`${i+1}: ${r.message}`);game=r.game;
 const view=playerView(pilot,game);maxThings=Math.max(maxThings,view.things.length);prefixes.push({actions:i+1,view});
}
const hash=(f:string)=>createHash('sha256').update(readFileSync(new URL(f,import.meta.url))).digest('hex');
writeFileSync(new URL('./route-evidence.json',import.meta.url),JSON.stringify({kind:'source-aware author witness; not a source-blind or human playtest',sourceCommit:'3d3dbf36c7be473b30e09384f8a279b2fa2d9918',scenarioId:pilot.id,hashes:Object.fromEntries(['pilot.json','pilot.ts','route.json','runtime/engine/model.ts','runtime/schema/scenario.ts','runtime/schema/lifecycle.ts'].map(f=>[f,hash(f)])),actionsLog:actions,combinations:game.state.metrics.combinations,metrics:game.state.metrics,maxVisibleThings:maxThings,completed:game.state.completed,events:game.events,prefixes},null,2)+'\n');
console.log(JSON.stringify({completed:game.state.completed,combinations:game.state.metrics.combinations,maxVisibleThings:maxThings}));
