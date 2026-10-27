import type {Action, Item, Objective, Recipe, Scenario, Stage} from '../schema/scenario.ts';
export type Point={x:number;y:number};
export type Token=Point&{id:string;kind:string;area:string;location:string|null;slots:Record<string,string>;incorporated:string[]};
export type Place=Point&{id:string;area:string};
export type Area={id:string;label:string;enteredAtStage:number};
export type Metrics={attempts:number;accepted:number;combinations:number;creations:number;installations:number;moves:number;placements:number;advances:number;visits:number};
export type State={stage:number;currentArea:string;areas:Area[];places:Place[];tokens:Token[];discovered:string[];recipesUsed:string[];openedCaches:string[];width:number;metrics:Metrics;completed:boolean};
export type Event={seq:number;action:Action|{type:'undo'};accepted:boolean;message:string;stage:number;recipe?:string;created?:string;installed?:boolean;retired?:string[];transfers?:{item:string;from:string;to:string}[]};
export type Game={version:1;scenarioId:string;state:State;history:State[];events:Event[]};
export type Result={accepted:boolean;game:Game;message:string;created?:string;updated?:string;recipe?:string;origin?:Point;retired?:string[]};
const clone=<T>(x:T):T=>structuredClone(x);
const ZERO:Metrics={attempts:0,accepted:0,combinations:0,creations:0,installations:0,moves:0,placements:0,advances:0,visits:0};
export const item=(s:Scenario,id:string)=>s.items.find(x=>x.id===id);
export const token=(s:State,id:string)=>s.tokens.find(x=>x.id===id);
const place=(s:State,id:string)=>s.places.find(x=>x.id===id);
const unique=(a:string[])=>new Set(a).size===a.length;
export function validateScenario(s:Scenario):string[]{
 const errors:string[]=[];const bad=(m:string)=>errors.push(m);
 if(!s||s.schemaVersion!==1||!s.id||!s.title||!s.premise)return ['Scenario header/schemaVersion missing'];
 for(const key of ['items','locations','initialItems','recipes','stages'] as const)if(!Array.isArray(s[key]))return [`${key} must be array`];
 for(const key of ['items','locations','recipes','stages'] as const)if(!unique(s[key].map(x=>x.id)))bad(`Duplicate ${key} id`);
 const kinds=new Set(s.items.map(x=>x.id)),locs=new Set(s.locations.map(x=>x.id));
 if([...kinds].some(x=>locs.has(x)))bad('Item and location ids must be disjoint');
 const operand=(x:string)=>x?.startsWith('@')?locs.has(x.slice(1)):kinds.has(x);
 const pairKeys=new Set<string>();
 if(!s.stages.length)bad('No stages');if(!unique(s.initialItems))bad('Duplicate starting item');
 for(const id of s.initialItems)if(!kinds.has(id))bad(`Unknown initial item ${id}`);
 for(const x of s.items){if(!x.label)bad(`Missing item label ${x.id}`);if(x.slots){if(!unique(x.slots.map(y=>y.id)))bad(`Duplicate slot ${x.id}`);for(const slot of x.slots){if(!slot.accepts.length||slot.accepts.some(k=>!kinds.has(k)))bad(`Unknown/empty slot accepts ${x.id}.${slot.id}`);}}}
 for(const r of s.recipes){
  if(!operand(r.a)||!operand(r.b)||r.a===r.b||r.a.startsWith('@')&&r.b.startsWith('@'))bad(`Invalid operands ${r.id}`);
  if(!!r.out===!!r.install)bad(`Exactly one out/install required ${r.id}`);
  if(r.out&&!kinds.has(r.out))bad(`Unknown output ${r.id}`);
  if(r.out===r.a||r.out===r.b)bad(`Unchanged creation ${r.id}`);
  if(r.at&&!locs.has(r.at))bad(`Unknown catalyst ${r.id}`);
  const key=[r.a,r.b].sort().join('|')+'|'+(r.at??'');if(pairKeys.has(key))bad(`Ambiguous pair/setting ${r.id}`);pairKeys.add(key);
  if(r.install){const ins=r.install,def=item(s,ins.target)?.slots?.find(x=>x.id===ins.slot);if(![r.a,r.b].includes(ins.target)||![r.a,r.b].includes(ins.component)||!def?.accepts.includes(ins.component))bad(`Invalid installation ${r.id}`);}
  for(const req of r.requires??[])if(![r.a,r.b].includes(req.item)||!req.capability)bad(`Readiness must describe an operand ${r.id}`);
  for(const ret of r.retire??[])if(![r.a,r.b].includes(ret.item)||!ret.reason?.trim())bad(`Unjustified retirement ${r.id}`);
 }
 const objectives=new Set<string>(),cacheIds=new Set<string>(),revealed=new Set<string>();
 for(const st of s.stages){
  if(!st.id||!st.title||!st.speaker||!st.motivation||!st.area?.id||!st.area.label||!st.area.travelText)bad(`Missing stage narrative ${st.id}`);
  if(!Array.isArray(st.objectives)||!st.objectives.length)bad(`Empty objectives ${st.id}`);
  for(const l of st.locations??[]){if(!locs.has(l))bad(`Unknown stage location ${l}`);if(revealed.has(l))bad(`Location revealed twice ${l}; old places cannot teleport`);revealed.add(l);}
  for(const c of st.caches??[]){if(!c.id||cacheIds.has(c.id))bad(`Duplicate/missing cache ${c.id}`);cacheIds.add(c.id);if(!c.label||!c.narrative||!c.items.length)bad(`Unmotivated/empty cache ${c.id}`);for(const k of c.items)if(!kinds.has(k))bad(`Unknown cache item ${k}`);}
  for(const k of st.carry??[])if(!kinds.has(k))bad(`Unknown carry item ${k}`);
  for(const location of new Set((st.objectives??[]).filter(o=>o.kind==='place').map(o=>o.location))){const goals=st.objectives.filter(o=>o.kind==='place'&&o.location===location);if(goals.length>1&&!s.items.some(it=>goals.every(o=>o.item?o.item===it.id:[...(it.capabilities??[]),...(it.slots??[]).flatMap(sl=>[...(sl.capabilities??[]),...Object.values(sl.grants??{}).flat()])].includes(o.capability!))))bad(`Objectives require an unreadable pile at ${location}`);}
  for(const o of st.objectives??[]){if(objectives.has(o.id))bad(`Duplicate objective ${o.id}`);objectives.add(o.id);if(!o.text||!['create','place'].includes(o.kind)||!!o.item===!!o.capability)bad(`Invalid objective ${o.id}`);if(o.item&&!kinds.has(o.item))bad(`Unknown goal item ${o.id}`);if(o.kind==='place'&&(!o.location||!locs.has(o.location)))bad(`Invalid placement goal ${o.id}`);if(o.kind==='place'&&!revealed.has(o.location!))bad(`Placement goal before location reveal ${o.id}`);}
 }
 for(const c of s.checkpoints??[])if(!c.id||!Array.isArray(c.actions))bad('Invalid checkpoint');
 return errors;
}
function assertScenario(s:Scenario){const errors=validateScenario(s);if(errors.length)throw Error(errors.join('\n'));}
export function functional(s:Scenario,t:Token){return (item(s,t.kind)?.slots??[]).filter(x=>x.required).every(x=>!!t.slots[x.id]);}
export function capabilities(s:Scenario,t:Token):string[]{
 if(!functional(s,t))return [];
 const def=item(s,t.kind)!;
 return [...new Set([...(def.capabilities??[]),...(def.slots??[]).filter(x=>!!t.slots[x.id]).flatMap(x=>[...(x.capabilities??[]),...(x.grants?.[t.slots[x.id]]??[])])])];
}
export function matches(s:Scenario,t:Token,o:Objective){return o.item?t.kind===o.item:capabilities(s,t).includes(o.capability!);}
export function objectiveStates(s:Scenario,state:State){return s.stages[state.stage].objectives.map(o=>{const witnesses=state.tokens.filter(t=>matches(s,t,o)&&(o.kind==='create'||t.location===o.location));return {...o,satisfied:witnesses.length>0,witnesses:witnesses.map(x=>x.id),places:o.kind==='place'&&witnesses.length?[o.location!]:[]};});}
export function gold(s:Scenario,state:State){return {items:[...new Set(objectiveStates(s,state).flatMap(o=>o.witnesses))],places:[...new Set(objectiveStates(s,state).flatMap(o=>o.places))]};}
export const stageComplete=(s:Scenario,state:State)=>objectiveStates(s,state).every(o=>o.satisfied);
const size=(s:Scenario,t:Token)=>({w:96,h:Math.max(44,26+(item(s,t.kind)?.slots??[]).filter(x=>x.required||t.slots[x.id]).length*20)});
function occupied(s:Scenario,state:State,area:string){return [...state.tokens.filter(t=>t.area===area).map(t=>({...t,...size(s,t)})),...state.places.filter(p=>p.area===area).map(p=>({...p,w:106,h:82}))];}
function overlap(a:Point,w:number,h:number,b:Point&{w:number;h:number}){return Math.max(0,(w+b.w)/2-Math.abs(a.x-b.x))*Math.max(0,(h+b.h)/2-Math.abs(a.y-b.y));}
function adjacent(s:Scenario,state:State,near:Point,area:string,out:Token,targetSize:{w:number;h:number}):Point{
 const {w,h}=size(s,out),dx=(w+targetSize.w)/2+2,dy=(h+targetSize.h)/2+2;
 const candidates=[[dx,dy],[-dx,dy],[dx,-dy],[-dx,-dy],[0,dy],[dx,0],[-dx,0],[0,-dy]].map(([x,y])=>({x:Math.max(w/2+4,Math.min(state.width-w/2-4,near.x+x)),y:Math.max(h/2+30,near.y+y)}));
 const used=occupied(s,state,area);return candidates.map((p,i)=>({p,i,cost:used.reduce((a,b)=>a+overlap(p,w,h,b),0)})).sort((a,b)=>a.cost-b.cost||a.i-b.i)[0].p;
}
function supplyPosition(s:Scenario,state:State,area:string):Point{
 const cols=Math.max(1,Math.floor((state.width-8)/100));const used=occupied(s,state,area);
 for(let row=0;row<1000;row++)for(let col=0;col<cols;col++){const p={x:52+col*100,y:56+row*50};if(used.every(o=>overlap(p,96,44,o)===0))return p;}throw Error('Supply layout exhausted');
}
function addItem(s:Scenario,state:State,kind:string,area:string){if(state.discovered.includes(kind))return;state.tokens.push({id:kind,kind,area,location:null,slots:{},incorporated:[],...supplyPosition(s,state,area)});state.discovered.push(kind);}
function needed(s:Scenario,state:State,t:Token,excluding?:string):boolean{
 if(s.recipes.some(r=>r.id!==excluding&&!state.recipesUsed.includes(r.id)&&(!r.out||!state.discovered.includes(r.out))&&[r.a,r.b].includes(t.kind)))return true;
 return s.stages.slice(state.stage).some(st=>st.objectives.some(o=>matches(s,t,o)&&!state.tokens.some(x=>x.id!==t.id&&matches(s,x,o)&&(o.kind==='create'||x.location===o.location))));
}
/** Stage-local packing intent. Includes alternative prerequisite routes, never future goals. */
export function sceneCarry(s:Scenario,state:State,st:Stage):string[]{
 if(st.carry)return [...new Set(st.carry)];
 const want=new Set<string>();
 const need=(kind:string,forceConstruction=false)=>{if(want.has(kind))return;want.add(kind);const def=item(s,kind),existing=token(state,kind);
  if(existing){if(forceConstruction||!functional(s,existing))for(const slot of def?.slots??[])if(slot.required&&!existing.slots[slot.id])for(const k of slot.accepts)need(k);return;}
  for(const r of s.recipes.filter(r=>r.out===kind)){for(const k of [r.a,r.b])if(!k.startsWith('@'))need(k);for(const q of r.requires??[])needCapability(q.capability,q.item);}
  for(const slot of def?.slots??[])if(slot.required)for(const k of slot.accepts)need(k);
 };
 const needCapability=(cap:string,only?:string)=>{for(const def of s.items.filter(it=>!only||it.id===only)){const slots=(def.slots??[]).filter(sl=>(sl.capabilities??[]).includes(cap)||Object.values(sl.grants??{}).some(c=>c.includes(cap)));if(!(def.capabilities??[]).includes(cap)&&!slots.length)continue;need(def.id,true);const existing=token(state,def.id);for(const slot of slots)if(!existing?.slots[slot.id]||!capabilities(s,existing).includes(cap)){const accepted=Object.entries(slot.grants??{}).filter(([,caps])=>caps.includes(cap)).map(([k])=>k);for(const k of accepted.length?accepted:slot.accepts)need(k);}}};
 for(const o of st.objectives)if(o.item)need(o.item);else needCapability(o.capability!);
 return [...want];
}
function enterStage(s:Scenario,state:State,first=false){
 const st=s.stages[state.stage],area=st.area.id,existing=state.areas.find(x=>x.id===area);
 if(!existing)state.areas.push({id:area,label:st.area.label,enteredAtStage:state.stage});
 const wanted=first?[]:sceneCarry(s,state,st),carried=state.tokens.filter(t=>wanted.includes(t.kind)&&t.area!==area);
 const transfers=carried.map(t=>({item:t.id,from:t.area,to:area}));
 for(const from of new Set(carried.map(t=>t.area))){const group=carried.filter(t=>t.area===from),minY=Math.min(...group.map(t=>t.y));for(const t of group){t.area=area;t.location=null;t.y=56+t.y-minY;}}
 state.currentArea=area;
 for(const id of st.locations??[]){if(state.places.some(p=>p.id===id))continue;const pos=supplyPosition(s,state,area);state.places.push({id,area,x:pos.x,y:pos.y+25});}
 for(const c of st.caches??[])if(!state.openedCaches.includes(c.id)){for(const k of c.items)addItem(s,state,k,area);state.openedCaches.push(c.id);}
 if(first)for(const k of s.initialItems)addItem(s,state,k,area);
 return transfers;
}
export function createGame(s:Scenario,width=360):Game{
 assertScenario(s);const state:State={stage:0,currentArea:s.stages[0].area.id,areas:[],places:[],tokens:[],discovered:[],recipesUsed:[],openedCaches:[],width:Math.max(320,Math.min(600,width)),metrics:clone(ZERO),completed:false};enterStage(s,state,true);return {version:1,scenarioId:s.id,state,history:[],events:[]};
}
function resolveRecipe(s:Scenario,state:State,a:Token,b:Token|Place,isPlace:boolean):Recipe|undefined{
 const bk=isPlace?'@'+b.id:(b as Token).kind;
 const candidates=s.recipes.filter(r=>(r.requires??[]).every(req=>{const t=token(state,req.item);return !!t&&capabilities(s,t).includes(req.capability);})&&((r.a===a.kind&&r.b===bk)||(r.b===a.kind&&r.a===bk))&&(!r.at||!isPlace&&(b as Token).location===r.at));
 return candidates.sort((x,y)=>Number(!!y.at)-Number(!!x.at)).find(r=>r.out?!state.discovered.includes(r.out):!state.recipesUsed.includes(r.id));
}
/** Resolve the same drag gesture for browser and logical player surfaces. */
export function dropAction(s:Scenario,state:State,a:string,b:string):Action{
 if(!b.startsWith('@'))return {type:'combine',a,b};
 const source=token(state,a),target=place(state,b.slice(1));
 if(source&&target&&source.area===state.currentArea&&target.area===state.currentArea&&resolveRecipe(s,state,source,target,true))return {type:'combine',a,b};
 return {type:'place',item:a,location:b.slice(1)};
}
function errorResult(g:Game,a:Action,message:string):Result{
 const game=clone(g);game.state.metrics.attempts++;game.events.push({seq:game.events.length+1,action:a,accepted:false,message,stage:game.state.stage});game.state.metrics=cumulativeMetrics(game.events);return {accepted:false,game,message};
}
export function applyAction(s:Scenario,g:Game,a:Action):Result{
 if(g.scenarioId!==s.id)throw Error('Scenario/save mismatch');
 const state=clone(g.state);let message='',created:string|undefined,updated:string|undefined,recipe:string|undefined,origin:Point|undefined;const retired:string[]=[];let transfers:{item:string;from:string;to:string}[]=[];
 try{
  if(a.type==='advance'){
   if(!stageComplete(s,state))throw Error('Finish the current objectives before moving on.');
   if(state.stage===s.stages.length-1){if(state.completed)throw Error('This journey is already complete.');state.completed=true;message=s.stages[state.stage].completionText??'Journey complete.';}else {state.stage++;transfers=enterStage(s,state);message=s.stages[state.stage].area.travelText+(transfers.length?' We collect the things needed for this scene along the way.':'');}state.metrics.advances++;
  }else if(a.type==='visit'){
   if(!state.areas.some(x=>x.id===a.area))throw Error('That area has not been reached.');
   const take=(a.carry??[]).map(id=>token(state,id));if(take.some(t=>!t||t.area!==state.currentArea))throw Error('Carry only things physically in your current area.');
   const minY=take.length?Math.min(...take.map(t=>t!.y)):0;if(a.area!==state.currentArea)for(const t of take){t!.area=a.area;t!.location=null;t!.y=56+t!.y-minY;}state.currentArea=a.area;state.metrics.visits++;message=`Travelled to ${state.areas.find(x=>x.id===a.area)!.label}.`;
  }else{
   const id=a.type==='combine'?a.a:a.item,first=token(state,id);if(!first||first.area!==state.currentArea)throw Error('Choose a thing in this area.');
   if(a.type==='move'||a.type==='place'){
    if(a.type==='place'&&a.location){const p=place(state,a.location);if(!p||p.area!==state.currentArea)throw Error('That place is not in this area.');Object.assign(first,{x:p.x,y:p.y+16,location:p.id});state.metrics.placements++;message='Placed.';}
    else {if(!Number.isFinite(a.x)||!Number.isFinite(a.y))throw Error('Supply finite x and y coordinates for an ordinary move.');first.x=Math.max(52,Math.min(state.width-52,a.x!));first.y=Math.max(30,a.y!);first.location=null;state.metrics.moves++;message='Moved.';}
   }else if(a.type==='combine'){
    const isPlace=a.b.startsWith('@'),second=isPlace?place(state,a.b.slice(1)):token(state,a.b);if(!second||second.area!==state.currentArea||first.id===second.id)throw Error('Choose another thing or place in this area.');
    const r=resolveRecipe(s,state,first,second,isPlace);if(!r){const hints=partners(s,state,first.id),incoming=hints.directions.find(h=>h.source===second.id&&h.target===first.id&&h.location),advice=hints.settingHelp.find(h=>h.source===first.id&&h.target===second.id);throw Error(incoming?incoming.text+' Only the receiving thing needs to be placed there.':advice?.text??'No new combination here.');}recipe=r.id;origin={x:second.x,y:second.y};
    if(r.install){const target=token(state,r.install.target),component=token(state,r.install.component);if(!target||!component)throw Error('Both component and construction must be available.');if(target.slots[r.install.slot]===component.kind)throw Error('That component is already fitted.');target.slots[r.install.slot]=component.kind;updated=target.id;state.metrics.installations++;message=`${item(s,component.kind)!.label} fitted to ${item(s,target.kind)!.label}.`;if(!needed(s,state,component,r.id)){target.incorporated.push(component.kind);state.tokens=state.tokens.filter(t=>t.id!==component.id);retired.push(component.id);}}
    else {const out:Token={id:r.out!,kind:r.out!,area:state.currentArea,location:null,slots:{},incorporated:[],x:0,y:0};Object.assign(out,adjacent(s,state,origin,state.currentArea,out,isPlace?{w:106,h:82}:size(s,second as Token)));state.tokens.push(out);state.discovered.push(out.kind);created=out.kind;state.metrics.creations++;message=`${item(s,out.kind)!.label}. ${r.description??item(s,out.kind)?.description??''}`.trim();
     for(const ret of r.retire??[]){const t=token(state,ret.item);if(t&&!needed(s,state,t,r.id)){out.incorporated.push(t.kind,...t.incorporated);state.tokens=state.tokens.filter(x=>x.id!==t.id);retired.push(t.id);}}
    }
    state.recipesUsed.push(r.id);state.metrics.combinations++;
   }
  }
  if(a.type!=='advance'&&state.stage===g.state.stage&&!stageComplete(s,g.state)&&stageComplete(s,state)&&s.stages[state.stage].completionText)message+=' '+s.stages[state.stage].completionText;
  state.metrics.attempts++;state.metrics.accepted++;
  const event:Event={seq:g.events.length+1,action:clone(a),accepted:true,message,stage:state.stage,...recipe?{recipe}:{},...created?{created}:{},...updated?{installed:true}:{},...retired.length?{retired}:{},...transfers.length?{transfers}:{}};
  const game:Game={...g,state,history:[...g.history,g.state].slice(-100),events:[...g.events,event]};game.state.metrics=cumulativeMetrics(game.events);return {accepted:true,game,message,created,updated,recipe,origin,retired};
 }catch(e){return errorResult(g,a,(e as Error).message);}
}
export function undo(g:Game):Result{if(!g.history.length)return {accepted:false,game:g,message:'Nothing to undo.'};const game={...g,state:clone(g.history.at(-1)!),history:g.history.slice(0,-1),events:[...g.events,{seq:g.events.length+1,action:{type:'undo'} as const,accepted:true,message:'Undone.',stage:g.history.at(-1)!.stage}]};game.state.metrics=cumulativeMetrics(game.events);return {accepted:true,game,message:'Undone.'};}
export function partners(s:Scenario,state:State,id:string){
 const empty={message:'No new combinations with things currently in this area' as string|null,partners:[] as string[],outgoing:[] as string[],incoming:[] as string[],settings:[] as string[],directions:[] as {source:string;target:string;location?:string;text:string}[],settingHelp:[] as {source:string;target:string;location:string;text:string}[]};
 const t=token(state,id);if(!t||t.area!==state.currentArea)return empty;
 const things=state.tokens.filter(x=>x.area===state.currentArea&&x.id!==id),places=state.places.filter(x=>x.area===state.currentArea);
 const label=(id:string)=>id.startsWith('@')?s.locations.find(x=>x.id===id.slice(1))!.label:item(s,id)!.label;
 const legal=(a:Token,b:Token|Place,isPlace:boolean)=>{const r=resolveRecipe(s,state,a,b,isPlace);return r&&(!r.install||token(state,r.install.target)?.slots[r.install.slot]!==r.install.component)?r:undefined;};
 for(const target of [...things,...places]){const isPlace=places.includes(target as Place),r=legal(t,target,isPlace);if(r){const targetId=isPlace?'@'+target.id:target.id;empty.outgoing.push(targetId);empty.directions.push({source:id,target:targetId,...r.at?{location:r.at}:{},text:`Bring ${label(id)} onto ${label(targetId)}${r.at?' here':''}.`});}}
 for(const source of things){const r=legal(source,t,false);if(r){empty.incoming.push(source.id);if(!empty.directions.some(d=>d.source===source.id&&d.target===id))empty.directions.push({source:source.id,target:id,...r.at?{location:r.at}:{},text:`Bring ${label(source.id)} onto ${label(id)}${r.at?' here':''}.`});}}
 for(const r of s.recipes){if(!r.at||![r.a,r.b].includes(t.kind)||state.recipesUsed.includes(r.id)||r.out&&state.discovered.includes(r.out)||!(r.requires??[]).every(q=>{const x=token(state,q.item);return !!x&&capabilities(s,x).includes(q.capability);}))continue;
  const p=places.find(x=>x.id===r.at),other=things.find(x=>[r.a,r.b].includes(x.kind));if(!p||!other)continue;
  for(const [source,target] of [[other,t],[t,other]])if(target.location!==r.at){empty.settingHelp.push({source:source.id,target:target.id,location:r.at,text:`Place ${label(target.id)} at ${label('@'+r.at)}, then bring ${label(source.id)} onto ${label(target.id)}. Only the receiving thing needs to be placed there.`});}
  if(!empty.settings.includes('@'+r.at))empty.settings.push('@'+r.at);
 }
 empty.partners=empty.outgoing;if(empty.outgoing.length||empty.incoming.length||empty.settingHelp.length)empty.message=null;return empty;
}
export function playerView(s:Scenario,g:Game){
 const state=g.state,st=s.stages[state.stage],marks=gold(s,state);
 return {scenario:{id:s.id,title:s.title,premise:s.premise},stage:{number:state.stage+1,title:st.title,speaker:st.speaker,motivation:st.motivation,travelText:st.area.travelText},area:state.areas.find(a=>a.id===state.currentArea),areas:state.areas.map(a=>({id:a.id,label:a.label,current:a.id===state.currentArea,thingCount:state.tokens.filter(t=>t.area===a.id).length})),objectives:objectiveStates(s,state).map(({id,text,satisfied})=>({id,text,satisfied})),canAdvance:stageComplete(s,state)&&!state.completed,nextAction:stageComplete(s,state)&&!state.completed?(state.stage===s.stages.length-1?'Finish this journey':'Continue · '+s.stages[state.stage+1].title):null,completionText:stageComplete(s,state)?st.completionText??null:null,completed:state.completed,
  things:state.tokens.filter(t=>t.area===state.currentArea).map(t=>{const def=item(s,t.kind)!;return {id:t.id,label:def.label,description:def.description??'',x:t.x,y:t.y,location:t.location,gold:marks.items.includes(t.id),slots:(def.slots??[]).filter(sl=>sl.required||t.slots[sl.id]).map((sl,index)=>({id:'slot'+(index+1),filled:!!t.slots[sl.id],label:t.slots[sl.id]?item(s,t.slots[sl.id])!.label:null})),functional:functional(s,t)};}),
  locations:state.places.filter(p=>p.area===state.currentArea).map(p=>({...p,label:s.locations.find(l=>l.id===p.id)!.label,description:s.locations.find(l=>l.id===p.id)!.description??'',gold:marks.places.includes(p.id)})),cacheNarrative:(st.caches??[]).map(c=>({label:c.label,narrative:c.narrative})),metrics:state.metrics};
}
export function replay(s:Scenario,actions:Action[],width=360){let g=createGame(s,width);for(let i=0;i<actions.length;i++){const r=applyAction(s,g,actions[i]);if(!r.accepted)throw Error(`Replay action ${i+1}: ${r.message}`);g=r.game;}return g;}
export function checkpoint(s:Scenario,id:string,width=360){const c=s.checkpoints?.find(x=>x.id===id);if(!c)throw Error('Unknown checkpoint');return replay(s,c.actions,width);}
export function restore(s:Scenario,raw:string):Game{
 const g=JSON.parse(raw) as Game;
 const validState=(st:State):boolean=>{
  if(!st||!Number.isInteger(st.stage)||!s.stages[st.stage]||!Number.isFinite(st.width)||st.width<320||st.width>600||typeof st.completed!=='boolean'||!Array.isArray(st.areas)||!Array.isArray(st.places)||!Array.isArray(st.tokens)||!Array.isArray(st.discovered)||!Array.isArray(st.recipesUsed)||!Array.isArray(st.openedCaches)||!st.metrics)return false;
  const areaIds=st.areas.map(a=>a.id),placeIds=st.places.map(p=>p.id);
  if(!unique(areaIds)||!areaIds.includes(st.currentArea)||!unique(placeIds)||!unique(st.tokens.map(t=>t.id))||!unique(st.discovered)||!unique(st.recipesUsed)||!unique(st.openedCaches))return false;
  if(st.areas.some(a=>!s.stages.slice(0,st.stage+1).some(x=>x.area.id===a.id))||st.places.some(p=>!s.locations.some(x=>x.id===p.id)||!areaIds.includes(p.area)||!Number.isFinite(p.x)||!Number.isFinite(p.y)))return false;
  if(st.discovered.some(k=>!item(s,k))||st.recipesUsed.some(id=>!s.recipes.some(r=>r.id===id))||st.openedCaches.some(id=>!s.stages.slice(0,st.stage+1).some(x=>x.caches?.some(c=>c.id===id))))return false;
  if(Object.values(st.metrics).some(n=>!Number.isInteger(n)||n<0))return false;
  return st.tokens.every(t=>{const def=item(s,t.kind);if(!def||t.id!==t.kind||!st.discovered.includes(t.kind)||!areaIds.includes(t.area)||!Number.isFinite(t.x)||!Number.isFinite(t.y)||!t.slots||Array.isArray(t.slots)||!Array.isArray(t.incorporated)||t.incorporated.some(k=>!st.discovered.includes(k)))return false;
   if(t.location!==null&&!st.places.some(p=>p.id===t.location&&p.area===t.area))return false;
   return Object.entries(t.slots).every(([id,k])=>def.slots?.some(slot=>slot.id===id&&slot.accepts.includes(k))&&st.discovered.includes(k));
  });
 };
 if(g?.version!==1||g.scenarioId!==s.id||!validState(g.state)||!Array.isArray(g.events)||!Array.isArray(g.history)||!g.history.every(validState)||!g.events.every((e,i)=>e.seq===i+1&&typeof e.accepted==='boolean'&&e.action&&typeof e.message==='string'&&!!s.stages[e.stage]&&(!e.recipe||s.recipes.some(r=>r.id===e.recipe))&&(!e.created||!!item(s,e.created))))throw Error('Invalid campaign save');
 return g;
}
/** Presentation resize is not a counted game decision. Keep relative order. */
export function resizeGame(g:Game,width:number):Game{
 const w=Math.max(320,Math.min(600,width));if(!Number.isFinite(w))throw Error('Invalid board width');
 const resize=(st:State)=>{const old=st.width;for(const t of st.tokens)t.x=52+(t.x-52)*(w-104)/(old-104);for(const p of st.places)p.x=52+(p.x-52)*(w-104)/(old-104);st.width=w;};
 const out=clone(g);resize(out.state);out.history.forEach(resize);return out;
}

/** Lifetime effort is not erased by Undo; repeated reconstruction never inflates unique combinations. */
export function cumulativeMetrics(events:Event[]):Metrics{
 const accepted=events.filter(e=>e.accepted);return {attempts:events.length,accepted:accepted.length,combinations:new Set(accepted.flatMap(e=>e.recipe?[e.recipe]:[])).size,creations:new Set(accepted.flatMap(e=>e.created?[e.created]:[])).size,installations:new Set(accepted.filter(e=>e.installed).map(e=>e.recipe)).size,moves:accepted.filter(e=>e.action.type==='move'||e.action.type==='place'&&!e.action.location).length,placements:accepted.filter(e=>e.action.type==='place'&&e.action.location).length,advances:accepted.filter(e=>e.action.type==='advance').length,visits:accepted.filter(e=>e.action.type==='visit').length};
}
