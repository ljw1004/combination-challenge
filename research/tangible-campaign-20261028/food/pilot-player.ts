/** Restricted player surface. Player instructions do not expose recipes, routes, or author notes. */
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {checkpoint,applyAction,dropAction,playerView,partners,restore,stageComplete,undo} from './engine/model.ts';
import type {Scenario,Action} from './schema/scenario.ts';
const s:Scenario=JSON.parse(readFileSync(new URL('./scenario.json',import.meta.url),'utf8'));
const segments:Record<string,{start:string;stopBefore:number;title:string}>={
 'pastry-supper':{start:'pastry',stopBefore:8,title:'The market pastry stall and supper'},
 'cake-travel':{start:'precision',stopBefore:20,title:'The station bakery'},
 'orchard-inn':{start:'orchard',stopBefore:4,title:'Harvest lunch and the rainy inn'}
};
const [command,session,...args]=process.argv.slice(2);
if(!session||!/^[a-zA-Z0-9_-]+$/.test(session))throw Error('Use a simple session name.');
const file=new URL('./pilots/sessions/'+session+'.json',import.meta.url);
let doc:any;
if(command==='init'){
 if(existsSync(file))throw Error('Session already exists; use a new name to preserve evidence.');
 const part=segments[args[0]];if(!part)throw Error('Choose pastry-supper, cake-travel, or orchard-inn.');
 doc={segment:args[0],sourceAware:null,participantType:'unset',game:checkpoint(s,part.start,360),playerActions:[],interactions:[],startActionCount:s.checkpoints!.find(c=>c.id===part.start)!.actions.length};
}else{doc=JSON.parse(readFileSync(file,'utf8'));doc.game=restore(s,JSON.stringify(doc.game));}
doc.interactions??=[];doc.interactions.push({command,args});
const part=segments[doc.segment];
const finished=()=>doc.game.state.completed||doc.game.state.stage>=part.stopBefore;
if(command==='drop'||command==='undo'){
 if(finished())throw Error('This pilot segment has ended. Preserve the session for review.');
 let result;
 if(command==='undo'){
  if(doc.game.events.at(-1)?.action.type==='advance'){const transition=undo(doc.game);if(transition.accepted)doc.game=transition.game;}
  result=undo(doc.game);doc.playerActions.push({action:{type:'undo'},accepted:result.accepted});
 }
 else{
 const a=dropAction(s,doc.game.state,args[0],args[1]);result=applyAction(s,doc.game,a);doc.playerActions.push({action:a,accepted:result.accepted,recipe:result.recipe??null});
 }
 doc.game=result.game;
 if(command==='drop'&&result.accepted&&stageComplete(s,doc.game.state)){
  const advanced=applyAction(s,doc.game,{type:'advance'});if(!advanced.accepted)throw Error(advanced.message);doc.game=advanced.game;
 }
 console.log(JSON.stringify({accepted:result.accepted,message:result.accepted?(result.created?s.items.find(i=>i.id===result.created)?.label:result.updated?'Filled tool':null):result.message}));
}else if(command==='hint'){
 console.log(JSON.stringify(partners(s,doc.game.state,args[0]),null,2));
}else if(command==='inspect'){
 const v=playerView(s,doc.game);const obj=[...v.things,...v.locations].find(x=>x.id===args[0].replace(/^@/,''));
 if(!obj)throw Error('Choose a thing or place currently visible.');console.log(JSON.stringify(obj,null,2));
}else if(!['init','view'].includes(command))throw Error('Commands: init, view, hint, inspect, drop, undo.');
writeFileSync(file,JSON.stringify(doc,null,2)+'\n');
if(!['hint','inspect'].includes(command))console.log(JSON.stringify(finished()?{pilotEnded:true,segment:part.title,completedJourney:doc.game.state.completed,playerActions:doc.playerActions.length}:{pilot:part.title,...playerView(s,doc.game)},null,2));
