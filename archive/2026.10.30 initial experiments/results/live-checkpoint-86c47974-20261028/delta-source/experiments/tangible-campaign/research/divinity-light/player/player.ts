/** Neutral normal-player CLI. Intentionally no recipe, solution, checkpoint, or hidden-description command. */
import {readFileSync,writeFileSync,appendFileSync,existsSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {scenario as s} from '../../../ui/campaigns/divinity-light-guide.ts';
import * as M from '../../../engine/model.ts';
import type {Action} from '../../../schema/scenario.ts';
const [save,command='view',...args]=process.argv.slice(2);
if(!save)throw Error('Use: node player.ts SAVE_PATH view|select ITEM|read ITEM|combine ITEM ITEM|undo|visit AREA [ITEM...]');
const alias=(id:string)=>'i'+(s.items.findIndex(i=>i.id===id)+1);
const actual=(name:string)=>s.items[Number(name.replace(/^i/,''))-1]?.id;
const label=(id:string)=>s.items.find(i=>i.id===id)?.label??s.locations.find(l=>l.id===id.replace(/^@/,''))?.label??id;
let game=existsSync(save)?M.restore(s,readFileSync(save,'utf8')):M.createGame(s);
const before=JSON.stringify(game);
const view=()=>{const v=M.playerView(s,game);return {title:v.scenario.title,...!game.events.length?{premise:v.scenario.premise}:{},desk:v.stage.title,speaker:v.stage.speaker,story:v.stage.motivation,goals:v.objectives,things:v.things.map(t=>({key:alias(t.id),label:t.label,readable:!!t.reading,finished:t.gold})),places:game.state.places.filter(p=>p.area===game.state.currentArea).map(p=>({key:'@'+p.id,label:label(p.id)})),areas:v.areas,complete:v.completed,...v.completed?{ending:s.stages.at(-1)!.completionText}:{}};};
const output:any={};
const get=(name:string)=>{const id=actual(name);if(!id||!game.state.discovered.includes(id))throw Error('That item is not known in this run.');return id;};
if(command==='view')Object.assign(output,view());
else if(command==='select'){
 const id=get(args[0]),p=M.partners(s,game.state,id);
 Object.assign(output,{selected:{key:alias(id),label:label(id)},partners:p.outgoing.map(id=>({key:id.startsWith('@')?id:alias(id),label:label(id)})),incoming:p.incoming.map(id=>({key:alias(id),label:label(id)})),note:p.message});
}else if(command==='read'){
 const id=get(args[0]),reading=M.item(s,id)!.reading;
 Object.assign(output,{item:{key:alias(id),label:label(id)},reading:reading??'This item has no longer source reading.'});
}else{
 let action:Action|undefined;
 if(command==='combine')action={type:'combine',a:get(args[0]),b:args[1].startsWith('@')?args[1]:get(args[1])};
 if(command==='visit')action={type:'visit',area:args[0],carry:args.slice(1).map(get)};
 if(command==='advance')action={type:'advance'};
 if(command==='undo'){const r=M.undo(game);game=r.game;output.accepted=r.accepted;}
 else if(action){const r=M.applyAction(s,game,action);game=r.game;output.accepted=r.accepted;if(r.created)output.created={key:alias(r.created),label:label(r.created)};if(!r.accepted)output.note=r.message;}
 else throw Error('Supported commands: view, select, read, combine, undo, visit.');
 if(command!=='undo'&&output.accepted){while(M.stageComplete(s,game.state)&&!game.state.completed){const r=M.applyAction(s,game,{type:'advance'});if(!r.accepted)break;game=r.game;}}
 const bridges=M.pendingChapterBridges(s,game);if(bridges.length){output.storyBridges=bridges.map(b=>b.text);game=M.acknowledgeChapterBridges(s,game,bridges.map(b=>b.id));}
 output.view=view();
}
mkdirSync(dirname(save),{recursive:true});if(before!==JSON.stringify(game)||!existsSync(save))writeFileSync(save,JSON.stringify(game));
appendFileSync(save+'.journal.jsonl',JSON.stringify({time:new Date().toISOString(),command,args,output})+'\n');
console.log(JSON.stringify(output,null,2));
