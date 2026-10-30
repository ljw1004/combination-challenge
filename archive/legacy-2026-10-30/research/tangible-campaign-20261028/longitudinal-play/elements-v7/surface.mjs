/** Source-blind logical adapter; the shipped model is copied without edits. */
export function visibleView(M,s,game){
 const raw=M.playerView(s,game);
 return {
  scenario:raw.scenario,
  stage:{number:raw.stage.number,title:raw.stage.title,speaker:raw.stage.speaker,motivation:raw.stage.motivation},
  area:raw.area,areas:raw.areas,objectives:raw.objectives,
  newSupplies:raw.cacheNarrative,
  things:raw.things.map(({id,label,x,y,location,gold,slots,components,reading})=>({id,label,x,y,location,gold,slots,components,readable:!!reading})),
  locations:raw.locations.map(({id,area,x,y,label,gold})=>({id:'@'+id,area,x,y,label,gold})),
  completed:raw.completed,
  ...(raw.completed?{ending:raw.completionText??[...game.events].reverse().find(e=>e.accepted&&e.action.type==='advance')?.message??'Journey complete.'}:{}),
  successfulCombinations:raw.metrics.combinations
 };
}
export function execute(M,s,initial,op,args){
 let game=initial;const engineResults=[],transitions=[];let response={};
 const apply=(action,automatic=false)=>{const result=action.type==='undo'?M.undo(game):M.applyAction(s,game,action);game=result.game;engineResults.push({action,automatic,result,rawView:M.playerView(s,game)});return result;};
 const getVisible=(id)=>game.state.tokens.find(t=>t.id===id&&t.area===game.state.currentArea);
 const requireCount=(min,max=min)=>{if(args.length<min||args.length>max)throw Error(`Command ${op} needs ${min}${max!==min?'–'+max:''} arguments.`);};
 switch(op){
  case 'start':case 'view':case 'mission':requireCount(0);break;
  case 'highlight':{
   requireCount(1);if(!getVisible(args[0]))throw Error('Select a thing currently in this area.');
   const p=M.partners(s,game.state,args[0]);const ids=[...new Set([...p.partners,...p.settings,...p.incoming])];
   const view=visibleView(M,s,game);response={selection:args[0],highlighted:ids.map(id=>({id,label:[...view.things,...view.locations].find(x=>x.id===id)?.label??id})),highlightMeaning:'These existing tiles light up on selection. No output preview or recipe directions are supplied.'};break;
  }
  case 'read':{
   requireCount(1);const t=getVisible(args[0]);if(!t)throw Error('Read a source currently in this area.');const def=M.item(s,t.kind);
   if(!def.reading)throw Error('This tile has no authored Read source. Generic descriptions are not readings.');
   response={reading:{id:t.id,label:def.label,...def.reading},progressChanged:false};break;
  }
  case 'drop':case 'place':{
   requireCount(2);const target=op==='place'&&!args[1].startsWith('@')?'@'+args[1]:args[1];
   const action=M.dropAction(s,game.state,args[0],target);const r=apply(action);response={accepted:r.accepted,gesture:{source:args[0],target},resolvedAction:action,...(!r.accepted?{visibleOutcome:'No visible change.'}:{})};break;
  }
  case 'move':{
   requireCount(3);const r=apply({type:'move',item:args[0],x:Number(args[1]),y:Number(args[2])});response={accepted:r.accepted,...(!r.accepted?{visibleOutcome:'No visible change.'}:{})};break;
  }
  case 'visit':{
   requireCount(1,2);const carry=args[1]?args[1].split(',').filter(Boolean):[];const r=apply({type:'visit',area:args[0],carry});response={accepted:r.accepted,...(!r.accepted?{visibleOutcome:'No visible change.'}:{})};break;
  }
  case 'undo':{requireCount(0);const r=apply({type:'undo'});response={accepted:r.accepted};break;}
  case 'note':requireCount(1);response={note:args[0]};break;
  case 'stop':requireCount(1);response={stopped:true,reason:args[0]};break;
  default:throw Error('Unknown command. Use start, view, mission, highlight, read, drop, place, move, visit, undo, note, or stop. No reset, checkpoint, route or manual advance command exists.');
 }
 // Equivalent settled UI: the 700 ms creation cue and mission acknowledgement are elided.
 // Undo does not schedule an advance in the shipped UI; reading is deliberate, read-and-close.
 const trigger=engineResults.at(-1);
 if(trigger?.result.accepted&&op!=='undo'&&!M.stageComplete(s,initial.state)&&M.stageComplete(s,game.state)){
  let guard=0;
  while(M.stageComplete(s,game.state)&&!game.state.completed){
   if(++guard>s.stages.length+1)throw Error('Automatic advancement did not settle.');
   const before=visibleView(M,s,game);const r=apply({type:'advance'},true);
   if(!r.accepted)throw Error('Automatic stage advancement was rejected.');
   transitions.push({completedStage:before.stage.number,visibleFinalCreation:before,next:visibleView(M,s,game)});
  }
 }
 return {game,engineResults,response,transitions,view:visibleView(M,s,game),rawView:M.playerView(s,game)};
}
