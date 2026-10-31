// Restricted logical-player surface for a source-blind local assembly check.
import fs from 'node:fs';
import {scenario} from '../../ui/campaigns/elements-house-components.ts';
import * as M from '../../engine/model.ts';
import type {Action} from '../../schema/scenario.ts';
const root=new URL('./',import.meta.url),save=new URL('blind-player.save.json',root),log=new URL('blind-player.log.json',root);
let game=fs.existsSync(save)?M.restore(scenario,fs.readFileSync(save,'utf8')):M.checkpoint(scenario,'chapter-3');
const request=JSON.parse(process.argv[2]??'{"type":"view"}') as {type:string;item?:string};
let response:unknown;
if(request.type==='view')response=M.playerView(scenario,game);
else if(request.type==='select')response={item:M.playerView(scenario,game).things.find(t=>t.id===request.item),hints:M.partners(scenario,game.state,request.item!)};
else if(request.type==='undo'){const r=M.undo(game);game=r.game;response={accepted:r.accepted,message:r.message,view:M.playerView(scenario,game)};}
else {const r=M.applyAction(scenario,game,request as Action);game=r.game;response={accepted:r.accepted,message:r.message,view:M.playerView(scenario,game)};}
fs.writeFileSync(save,JSON.stringify(game));const entries=fs.existsSync(log)?JSON.parse(fs.readFileSync(log,'utf8')):[];entries.push({request,response});fs.writeFileSync(log,JSON.stringify(entries,null,2)+'\n');
console.log(JSON.stringify(response,null,2));
