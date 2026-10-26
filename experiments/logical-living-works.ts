import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

export const LIVING_VERSION='living-works-1';
export const LIVING_SCENARIOS=['sequence','prebuilt','reverse'];
export type LevelId='crossing'|'alternation'|'publication';
export type Direction='north'|'east'|'south'|'west';
export interface Recipe {a:string;b:string;out:string;mode:'concept'|'loop'|'delay'|'feedback';effect:string}
export const LIVING_PRIMITIVES=['earth','water','air','heat','seed','memory'];
export const LIVING_RECIPES:Recipe[]=[
 {a:'earth',b:'heat',out:'stone',mode:'concept',effect:'Hard walking surface; flow passes unchanged.'},
 {a:'earth',b:'water',out:'clay',mode:'concept',effect:'Moldable surface; strong water floods it.'},
 {a:'clay',b:'heat',out:'ceramic',mode:'concept',effect:'Hard fired surface, no roots.'},
 {a:'ceramic',b:'water',out:'channel',mode:'concept',effect:'Construct chosen cardinal outgoing ports at a place.'},
 {a:'channel',b:'stone',out:'aqueduct',mode:'concept',effect:'Carry flow on chosen ports and provide an elevated dry walk.'},
 {a:'seed',b:'water',out:'rootbed',mode:'concept',effect:'Root soil/clay, soften water, fragment exact marks and emit seeds.'},
 {a:'rootbed',b:'earth',out:'grove',mode:'concept',effect:'A rooted living place; roots and descendants use the same water law.'},
 {a:'grove',b:'stone',out:'timber',mode:'concept',effect:'A walking structure safe in gentle water, but not strong water.'},
 {a:'timber',b:'water',out:'float',mode:'concept',effect:'A visible sensor of water at its actual place.'},
 {a:'timber',b:'stone',out:'gate',mode:'concept',effect:'A physical gate with one or two selected outlet ports.'},
 {a:'gate',b:'float',out:'valve',mode:'concept',effect:'Select dry/wet outlet from an adjacent actual float; its water changes operation.'},
 {a:'channel',b:'channel',out:'loop',mode:'loop',effect:'Join an explicitly chosen closed cardinal path into actual connected channels.'},
 {a:'channel',b:'loop',out:'delay',mode:'delay',effect:'Open the last edge of an existing loop; input crosses every retained route cell before reaching its output.'},
 {a:'valve',b:'delay',out:'feedback-valve',mode:'feedback',effect:'Combine the delay output float with its adjacent entry valve, using actual travel as feedback.'},
 {a:'clay',b:'memory',out:'imprint',mode:'concept',effect:'An unfired exact-record surface; strong water still floods it.'},
 {a:'imprint',b:'heat',out:'archive',mode:'concept',effect:'A hard exact-record surface; retains actual incoming identities.'},
 {a:'archive',b:'air',out:'beacon',mode:'concept',effect:'An archive that republishes its own retained identities, never invented originals.'},
 {a:'beacon',b:'rootbed',out:'interpreter',mode:'concept',effect:'A rooted living transmitter: exact inputs become fragments, not retained exact copies.'}
];
export const LIVING_CONCEPTS=[...LIVING_PRIMITIVES,...LIVING_RECIPES.map(r=>r.out)];
export interface Cell {id:string;x:number;y:number;material:'soil'|'stone'|'clay'|'ceramic'|'timber';ports:Direction[];rooted:boolean;grove:boolean;elevated:boolean;recording:boolean;memory:number;beacon:boolean;float:boolean;gate:boolean;valve:{control:string;wetPort:Direction;dryPort:Direction}|null;source:number;sourceSchedule:number[]}
export interface Field {water:number;exact:number;fragment:number;seeds:boolean;flooded:boolean;outlets:Direction[]}
export interface Work {id:string;kind:'loop'|'delay'|'feedback-valve';path:string[]}
export interface Sample {tick:number;upperWet:boolean;lowerWet:boolean;upperFlooded:boolean;lowerFlooded:boolean}
export interface Cycle {startTick:number;endTick:number;period:number;boundary:string;samples:Sample[]}
export interface Action {type:'combine'|'wait'|'next'|'finish';a?:string;b?:string;at?:string;ports?:Direction[];control?:string;path?:string[];beats?:number;intention?:string}
export interface Event {kind:string;at?:string;before?:unknown;after?:unknown}
export interface Completed {level:LevelId;goal:unknown;knownOnEntry:string[];knownOnExit:string[];actions:number;tick:number}
export interface State {version:string;scenarioId:string;order:LevelId[];levelIndex:number;known:string[];knownOnEntry:string[];cells:Cell[];field:Record<string,Field>;works:Work[];tick:number;totalTicks:number;sinceEdit:number;recent:Sample[];orbit:{tick:number;key:string;sample:Sample}[];cycle:Cycle|null;completed:Completed[];levelActionStart:number;status:'playing'|'ended';actions:Action[];events:Event[]}
const dirs:Direction[]=['north','east','south','west'];
const vector:Record<Direction,{x:number;y:number}>={north:{x:0,y:-1},east:{x:1,y:0},south:{x:0,y:1},west:{x:-1,y:0}};
const clone=<T>(x:T):T=>structuredClone(x);
const pair=(a:string,b:string)=>[a,b].sort().join('+');
const cell=(s:State,id:string)=>s.cells.find(c=>c.id===id);
const level=(s:State)=>s.order[s.levelIndex];
const mark=(n:number)=>[n&1?'A':'',n&2?'B':''].filter(Boolean).join('+')||'-';
const empty=():Field=>({water:0,exact:0,fragment:0,seeds:false,flooded:false,outlets:[]});
function neighbor(s:State,c:Cell,d:Direction){const v=vector[d];return s.cells.find(n=>n.x===c.x+v.x&&n.y===c.y+v.y);}
function heading(a:Cell,b:Cell):Direction|undefined{return dirs.find(d=>a.x+vector[d].x===b.x&&a.y+vector[d].y===b.y);}
function portsReason(s:State,c:Cell,ports:Direction[]|undefined){if(!ports||ports.length>4||new Set(ports).size!==ports.length||ports.some(p=>!dirs.includes(p)))return 'Provide distinct ports chosen from north/east/south/west; [] means closed.';if(ports.some(p=>!neighbor(s,c,p)))return 'Every selected port must meet an actual cardinal neighbor.';}
function add(to:Field,from:Field){to.water=Math.max(to.water,from.water);to.exact|=from.exact;to.fragment|=from.fragment;to.seeds||=from.seeds;}
function path(s:State,from:string,to:string){if(!s.field[from]||s.field[from].flooded)return null;const queue=[{at:from,path:[from]}],seen=new Set<string>();for(const q of queue){if(seen.has(q.at))continue;seen.add(q.at);if(q.at===to)return q.path;for(const n of s.cells.filter(n=>!!heading(cell(s,q.at)!,n)&&!s.field[n.id].flooded).sort((a,b)=>a.id.localeCompare(b.id)))queue.push({at:n.id,path:[...q.path,n.id]});}return null;}
function makeCell(id:string):Cell{return {id,x:id.charCodeAt(0)-65,y:Number(id.slice(1))-1,material:'soil',ports:[],rooted:false,grove:false,elevated:false,recording:false,memory:0,beacon:false,float:false,gate:false,valve:null,source:0,sourceSchedule:[2]};}
function setup(s:State){
 const id=level(s);s.cells=[];s.field={};s.works=[];s.tick=0;s.sinceEdit=0;s.recent=[];s.orbit=[];s.cycle=null;s.knownOnEntry=[...s.known];s.levelActionStart=s.actions.length;
 const ids=id==='crossing'?['B1','D1','A2','B2','C2','D2','E2','B3','D3']:id==='alternation'?['C1','D1','A2','B2','C2','D2','E2','A3','B3','C3','D3','E3','A4','B4','C4','D4','E4','C5','D5']:['B1','D1','A2','B2','C2','D2','E2','B3','D3'];
 s.cells=ids.map(makeCell);
 const set=(id:string,change:Partial<Cell>)=>Object.assign(cell(s,id)!,change);
 if(id==='crossing'){
  set('A2',{material:'stone'});set('E2',{material:'stone'});
  set('B1',{material:'stone',source:1,ports:['south']});set('D1',{material:'stone',source:2,ports:['south']});
  set('B2',{ports:['south']});set('D2',{ports:['south']});set('B3',{grove:true});set('D3',{grove:true});
 }else if(id==='alternation'){
  set('A3',{material:'stone',source:1,ports:['east']});set('B3',{ports:['east']});set('C3',{ports:['north','south']});set('C2',{grove:true});set('C4',{grove:true});
 }else{
  set('A2',{material:'stone',source:1,ports:['east']});set('E2',{material:'stone',source:2,ports:['west']});set('B2',{material:'clay',ports:['north']});set('D2',{material:'clay',ports:['north']});set('B1',{material:'clay'});set('D1',{material:'clay'});set('C2',{material:'stone'});
 }
 for(const c of s.cells)s.field[c.id]=empty();
 // Initial water is supplied by the disclosed sources, not player construction or recipe knowledge.
 for(let i=0;i<4;i++)tick(s,false);s.tick=0;s.totalTicks=0;s.sinceEdit=0;s.recent=[];s.orbit=[];s.cycle=null;s.events=[];
}
function tick(s:State,record=true){
 const incoming=Object.fromEntries(s.cells.map(c=>[c.id,empty()]));
 for(const c of s.cells){if(c.source){const water=c.sourceSchedule[s.tick%c.sourceSchedule.length];incoming[c.id].water=Math.max(incoming[c.id].water,water);if(water)incoming[c.id].exact|=c.source;}for(const d of s.field[c.id].outlets){const n=neighbor(s,c,d);if(n)add(incoming[n.id],s.field[c.id]);}}
 const next:Record<string,Field>={};const roots:Cell[]=[];const memories:{c:Cell;value:number}[]=[];
 for(const c of s.cells){const f={...incoming[c.id],outlets:[...c.ports]};
  if(c.rooted&&f.water){f.water=1;f.fragment|=f.exact;f.exact=0;f.seeds=true;}
  if(c.recording&&(c.memory|f.exact)!==c.memory)memories.push({c,value:c.memory|f.exact});
  if(c.beacon&&c.memory){f.water=2;f.exact|=c.memory;}
  if(c.valve){const wet=s.field[c.valve.control].water>0;f.outlets=[wet?c.valve.wetPort:c.valve.dryPort];}
  else if(c.gate)f.outlets=[];
  f.flooded=f.water===2&&!c.elevated&&!c.rooted&&!['stone','ceramic'].includes(c.material);
  if(c.material==='soil'&&!c.rooted&&f.water===1&&f.seeds)roots.push(c);
  next[c.id]=f;
 }
 s.field=next;for(const {c,value}of memories){s.events.push({kind:'record',at:c.id,before:mark(c.memory),after:mark(value)});c.memory=value;}
 for(const c of roots){c.rooted=true;s.events.push({kind:'descendant',at:c.id});}
 s.tick++;s.totalTicks++;s.sinceEdit++;
 if(record&&level(s)==='alternation'){
  const sample:Sample={tick:s.tick,upperWet:s.field.C2.water>0,lowerWet:s.field.C4.water>0,upperFlooded:s.field.C2.flooded,lowerFlooded:s.field.C4.flooded};s.recent.push(sample);s.recent=s.recent.slice(-24);
  if(!s.cycle){const key=livingPhysicalKey(s),prior=s.orbit.findIndex(x=>x.key===key);if(prior>=0){const start=s.orbit[prior];s.cycle={startTick:start.tick,endTick:s.tick,period:s.tick-start.tick,boundary:key,samples:[...s.orbit.slice(prior+1).map(x=>x.sample),sample]};}else{s.orbit.push({tick:s.tick,key,sample});if(s.orbit.length>256)s.orbit.shift();}}
 }

}
export function createLiving(scenario='sequence',_seed=0):State{
 if(!LIVING_SCENARIOS.includes(scenario))throw new Error('Use sequence, prebuilt or reverse.');
 const s:State={version:LIVING_VERSION,scenarioId:scenario,order:scenario==='reverse'?['publication','alternation','crossing']:['crossing','alternation','publication'],levelIndex:0,known:scenario==='prebuilt'?[...LIVING_CONCEPTS]:[...LIVING_PRIMITIVES],knownOnEntry:[],cells:[],field:{},works:[],tick:0,totalTicks:0,sinceEdit:0,recent:[],orbit:[],cycle:null,completed:[],levelActionStart:0,status:'playing',actions:[],events:[]};setup(s);return s;
}
export function livingGoal(s:State){
 if(level(s)==='crossing'){
  const crossing=path(s,'A2','E2'),groves=['B3','D3'].map(at=>({at,water:s.field[at].water,rooted:cell(s,at)!.rooted,grove:cell(s,at)!.grove}));
  return {id:'crossing',achieved:!!crossing&&groves.every(g=>g.water>0&&g.rooted&&g.grove),dryPath:crossing,groves,statement:'Connect A2 to E2 by an unflooded walk while both rivers still water their rooted living groves at B3/D3.'};
 }
 if(level(s)==='alternation'){
  const samples=s.cycle?.samples??[],labels=samples.map(x=>x.upperWet&&x.lowerWet?'both':x.upperWet?'upper':x.lowerWet?'lower':'none');const runs:string[]=[];for(const x of labels)if(x!=='none'&&runs.at(-1)!==x)runs.push(x);
  const achieved=!!s.cycle&&samples.every(x=>!(x.upperWet&&x.lowerWet)&&!x.upperFlooded&&!x.lowerFlooded)&&runs.includes('upper')&&runs.includes('lower')&&runs.every(x=>x==='upper'||x==='lower')&&['C2','C4'].every(id=>cell(s,id)!.grove&&cell(s,id)!.rooted);
  return {id:'alternation',achieved,untouchedBeats:s.sinceEdit,cycle:s.cycle,phaseRuns:runs,statement:'Reach an exact repeating physical state whose entire cycle waters C2/C4 in nonoverlapping alternating phases, with both groves living/rooted and never flooded. The repeated state includes all fields, outlet selections, roots, records and source phases. World edits invalidate this cycle proof.'};
 }
 const originals={B1:cell(s,'B1')!.memory,D1:cell(s,'D1')!.memory},square=s.field.C2,dryPath=path(s,'A2','E2');
 return {id:'publication',achieved:originals.B1===1&&originals.D1===2&&(square.fragment&3)===3&&square.exact===0&&!!dryPath,originals:{B1:mark(originals.B1),D1:mark(originals.D1)},square:{exact:mark(square.exact),fragment:mark(square.fragment)},dryPath,statement:'At completion (not an all-history invariant), make exact A-only/B-only originals at B1/D1; deliver combined A+B fragments but no exact identities at C2; retain an unflooded walk from A2 to E2.'};
}
function loopReason(s:State,path:string[]|undefined){if(!path||path.length<4||new Set(path).size!==path.length||path.some(id=>!cell(s,id)))return 'Choose at least four distinct actual places in a closed cardinal cycle.';for(let i=0;i<path.length;i++)if(!heading(cell(s,path[i])!,cell(s,path[(i+1)%path.length])!))return 'Consecutive path cells, including last→first, must be cardinal neighbors.';}
function intactWork(s:State,w:Work){for(let i=0;i<w.path.length-(w.kind==='loop'?0:1);i++){const from=cell(s,w.path[i])!,to=cell(s,w.path[(i+1)%w.path.length])!,d=heading(from,to);if(!d||!from.ports.includes(d)||from.gate||from.valve)return false;}return true;}
const worldTools=['earth','stone','clay','ceramic','channel','aqueduct','rootbed','grove','timber','float','gate','valve','imprint','archive','beacon','interpreter'];
function installReason(s:State,tool:string,c:Cell,a:Action){
 if(!worldTools.includes(tool))return 'This concept participates in recipes, not a direct place combination.';
 if(['rootbed','grove','interpreter'].includes(tool)&&!['soil','clay'].includes(c.material))return 'Living forms require unfired soil or clay.';
 if(['channel','aqueduct','gate','valve'].includes(tool)){const invalid=portsReason(s,c,a.ports);if(invalid)return invalid;}
 if(tool==='valve'){if(a.ports?.length!==2)return 'Valve ports are [dry outlet, wet outlet], two distinct actual directions.';if(!a.control||!cell(s,a.control)||!heading(c,cell(s,a.control)!))return 'Valve control must be an actual adjacent float position; this combination installs that float.';}
}
export function livingReason(s:State,a:Action):string|undefined{
 if(s.version!==LIVING_VERSION||s.status!=='playing')return 'This campaign is not playing.';
 if(a.type==='finish')return;
 if(a.type==='wait')return a.beats!==undefined&&(!Number.isInteger(a.beats)||a.beats<1||a.beats>24)?'Wait beats must be an integer from 1 to 24; this is a recording batch, not a budget.':undefined;
 if(a.type==='next')return !livingGoal(s).achieved?'Complete the current explicit goal before next.':s.levelIndex===s.order.length-1?'This is the last board; finish when ready.':undefined;
 if(a.type!=='combine'||!a.a||!a.b)return 'Combine two named capabilities or a capability with an actual place/work.';
 const recipe=LIVING_RECIPES.find(r=>pair(r.a,r.b)===pair(a.a!,a.b!));
 if(recipe){if(!s.known.includes(a.a)||!s.known.includes(a.b))return 'Both input capabilities must already have been made; their recipes are public.';
  if(recipe.mode==='loop')return loopReason(s,a.path);
  if(recipe.mode==='delay'||recipe.mode==='feedback'){const work=s.works.find(w=>w.id===a.at);if(!work||work.kind!==(recipe.mode==='delay'?'loop':'delay'))return `Combine at an actual ${recipe.mode==='delay'?'loop':'delay'} work ID.`;if(!intactWork(s,work))return 'This saved work no longer has its actual ungated route; rebuild the real connections first.';if(recipe.mode==='feedback'){const first=cell(s,work.path[0])!,next=heading(first,cell(s,work.path[1])!)!,last=cell(s,work.path.at(-1)!)!;if(!heading(first,last))return 'The actual delay output must border its entry for the float linkage.';if(!a.ports||a.ports.length!==1||a.ports[0]===next||!neighbor(s,first,a.ports[0]))return 'Give one alternative actual output direction different from the delay inlet.';}return;}
  if(a.at){const c=cell(s,a.at);if(!c)return 'Use an actual place for an in-place combination.';return installReason(s,recipe.out,c,a);}
  return s.known.includes(recipe.out)?'This concept is already known; reuse it or combine at an actual place.':undefined;
 }
 const tool=s.known.includes(a.a)?a.a:s.known.includes(a.b)?a.b:null,target=tool===a.a?a.b:a.a;if(!tool)return 'One input must be a known capability.';
 if(tool==='loop'){if(!cell(s,target)||!a.path||a.path[0]!==target)return 'Combine Loop with its actual first path cell; an unknown or unrelated anchor is not an operand.';return loopReason(s,a.path);}
 const c=cell(s,target);if(!c)return 'The other operand must be an actual cell ID, or use a disclosed recipe.';return installReason(s,tool,c,a);
}
function install(s:State,tool:string,c:Cell,a:Action){const before=clone(c);
 if(['earth','stone','clay','ceramic','timber'].includes(tool)){c.material=tool==='earth'?'soil':tool as Cell['material'];c.rooted=false;c.grove=false;c.recording=false;c.memory=0;c.beacon=false;c.elevated=false;}
 if(tool==='channel'||tool==='aqueduct'||tool==='gate'||tool==='valve'){c.ports=[...a.ports!];c.gate=tool==='gate';c.valve=null;if(tool==='aqueduct')c.elevated=true;}
 if(['rootbed','grove','interpreter'].includes(tool)){c.rooted=true;if(tool==='grove')c.grove=true;if(tool==='interpreter'){c.recording=false;c.memory=0;c.beacon=false;}}
 if(tool==='float')c.float=true;
 if(tool==='valve'){const control=cell(s,a.control!)!;control.float=true;c.valve={control:control.id,dryPort:a.ports![0],wetPort:a.ports![1]};}
 if(['imprint','archive','beacon'].includes(tool)){c.material=tool==='imprint'?'clay':'ceramic';c.rooted=false;c.recording=true;c.beacon=tool==='beacon';}
 s.events.push({kind:'place-combination',at:c.id,before,after:clone(c)});
}
function loop(s:State,ids:string[]){for(let i=0;i<ids.length;i++){const c=cell(s,ids[i])!;c.ports=[heading(c,cell(s,ids[(i+1)%ids.length])!)!];c.gate=false;c.valve=null;}const work:Work={id:`w${s.works.length+1}`,kind:'loop',path:[...ids]};s.works.push(work);s.events.push({kind:'whole-loop',after:clone(work)});return work;}
export function stepLiving(state:State,a:Action):State{
 const invalid=livingReason(state,a);if(invalid)throw new Error(invalid);const s=clone(state);s.events=[];s.actions.push(clone(a));
 if(a.type==='finish'){s.status='ended';return s;}
 if(a.type==='next'){s.completed.push({level:level(s),goal:livingGoal(s),knownOnEntry:[...s.knownOnEntry],knownOnExit:[...s.known],actions:s.actions.length-s.levelActionStart-1,tick:s.tick});s.levelIndex++;const total=s.totalTicks;setup(s);s.totalTicks=total;s.events=[{kind:'next-level',after:level(s)}];return s;}
 let edited=false;
 if(a.type==='combine'){
  const r=LIVING_RECIPES.find(r=>pair(r.a,r.b)===pair(a.a!,a.b!));
  if(r){if(!s.known.includes(r.out)){s.known.push(r.out);s.events.push({kind:'concept-combination',before:[r.a,r.b],after:r.out});}
   if(r.mode==='loop'){loop(s,a.path!);edited=true;}
   else if(r.mode==='delay'){const previous=s.works.find(w=>w.id===a.at)!,last=cell(s,previous.path.at(-1)!)!;last.ports=[];const work:Work={id:`w${s.works.length+1}`,kind:'delay',path:[...previous.path]};s.works.push(work);s.events.push({kind:'open-loop-as-delay',before:clone(previous),after:clone(work)});edited=true;}
   else if(r.mode==='feedback'){const prior=s.works.find(w=>w.id===a.at)!,first=cell(s,prior.path[0])!,last=cell(s,prior.path.at(-1)!)!;const dry=heading(first,cell(s,prior.path[1])!)!;install(s,'valve',first,{...a,ports:[dry,a.ports![0]],control:last.id});const work:Work={id:`w${s.works.length+1}`,kind:'feedback-valve',path:[...prior.path]};s.works.push(work);s.events.push({kind:'feedback-composition',before:clone(prior),after:clone(work)});edited=true;}
   else if(a.at){install(s,r.out,cell(s,a.at)!,a);edited=true;}
  }else{const tool=s.known.includes(a.a!)?a.a!:a.b!,target=tool===a.a?a.b!:a.a!;if(tool==='loop'){loop(s,a.path!);}else install(s,tool,cell(s,target)!,a);edited=true;}
 }
 if(edited){s.sinceEdit=0;s.recent=[];s.orbit=[];s.cycle=null;}
 for(let i=0;i<(a.type==='wait'?a.beats??1:1);i++)tick(s);
 return s;
}
export function livingActions(s:State):Action[]{
 if(s.status!=='playing')return [];const result:Action[]=[{type:'wait'},{type:'wait',beats:12},{type:'finish'}];if(!livingReason(s,{type:'next'}))result.push({type:'next'});
 for(const r of LIVING_RECIPES.filter(r=>r.mode==='concept')){const a:Action={type:'combine',a:r.a,b:r.b};if(!livingReason(s,a))result.push(a);}
 for(const c of s.cells){for(const tool of s.known.filter(k=>worldTools.includes(k))){
  if(['channel','aqueduct','gate'].includes(tool)){const possible=dirs.filter(d=>neighbor(s,c,d));for(let mask=0;mask<1<<possible.length;mask++){const a:Action={type:'combine',a:tool,b:c.id,ports:possible.filter((_,i)=>mask&(1<<i))};if(!livingReason(s,a))result.push(a);}}
  else if(tool==='valve'){const possible=dirs.filter(d=>neighbor(s,c,d));for(const dry of possible)for(const wet of possible)if(dry!==wet)for(const control of s.cells.filter(n=>!!heading(c,n))){const a:Action={type:'combine',a:tool,b:c.id,ports:[dry,wet],control:control.id};if(!livingReason(s,a))result.push(a);}}
  else{const a:Action={type:'combine',a:tool,b:c.id};if(!livingReason(s,a))result.push(a);}
 }}
 // Enumerate small actual loop witnesses; arbitrary longer closed paths remain inspectable via the public path predicate.
 if(s.known.includes('channel'))for(const c of s.cells){const east=neighbor(s,c,'east'),south=neighbor(s,c,'south'),corner=east&&neighbor(s,east,'south');if(east&&south&&corner){const a:Action={type:'combine',a:'channel',b:'channel',path:[c.id,east.id,corner.id,south.id]};if(!livingReason(s,a))result.push(a);}}
 for(const w of s.works){if(w.kind==='loop'&&s.known.includes('channel')&&s.known.includes('loop')){const a:Action={type:'combine',a:'channel',b:'loop',at:w.id};if(!livingReason(s,a))result.push(a);}if(w.kind==='delay'&&s.known.includes('valve')&&s.known.includes('delay'))for(const d of dirs){const a:Action={type:'combine',a:'valve',b:'delay',at:w.id,ports:[d]};if(!livingReason(s,a))result.push(a);}}
 return result;
}
export function livingOutcome(s:State){const goal=livingGoal(s);return {terminal:s.status==='ended',goal:goal.achieved,objectives:[{id:goal.id,value:goal.achieved?1:0,direction:'higher' as const}],properties:{level:level(s),completedLevels:s.completed.map(c=>c.level),currentGoal:goal,knownCount:s.known.length,conceptCount:LIVING_CONCEPTS.length,known:s.known,allThreeComplete:s.completed.length===2&&goal.achieved}};}
export function livingPhysicalKey(s:State){return JSON.stringify({cells:s.cells,field:s.field,sourcePhases:s.cells.filter(c=>c.source).map(c=>({id:c.id,phase:s.tick%c.sourceSchedule.length}))});}
export function livingKey(s:State){return JSON.stringify({level:level(s),known:s.known,cells:s.cells,field:s.field,works:s.works,phase:s.tick%2,cycle:s.cycle?{period:s.cycle.period,boundary:s.cycle.boundary,samples:s.cycle.samples.map(({tick:_,...r})=>r)}:null,completed:s.completed,status:s.status});}
export function statusLiving(s:State){return s.status;}
export function observeLiving(s:State){return {version:s.version,scenario:s.scenarioId,status:s.status,level:level(s),levelNumber:s.levelIndex+1,order:s.order,tick:s.tick,totalTicks:s.totalTicks,known:s.known,knownOnEntry:s.knownOnEntry,ontology:{implementedConcepts:LIVING_CONCEPTS.length,concepts:LIVING_CONCEPTS,recipes:LIVING_RECIPES.map(r=>({...r,known:s.known.includes(r.out),inputsReady:s.known.includes(r.a)&&s.known.includes(r.b)}))},board:s.cells.map(c=>({...c,at:c.id,memory:mark(c.memory),source:mark(c.source),field:{...s.field[c.id],exact:mark(s.field[c.id].exact),fragment:mark(s.field[c.id].fragment)}})),works:s.works.map(w=>({...w,actualConnections:w.path.slice(0,-1).map((id,i)=>({from:id,to:w.path[i+1],installed:cell(s,id)!.ports.includes(heading(cell(s,id)!,cell(s,w.path[i+1])!)!),currentlyConducting:s.field[id].outlets.includes(heading(cell(s,id)!,cell(s,w.path[i+1])!)!)}))})),goal:livingGoal(s),completed:s.completed,events:s.events,actionSchema:{type:'combine | wait | next | finish',a:'known capability',b:'known capability, or actual cell ID',at:'optional place for recipe-and-install; actual work ID for delay/feedback',ports:'ordered directions; valve [dry,wet], feedback [wet alternative]',control:'adjacent actual float cell for valve; float is physically installed there',path:'closed cardinal loop, distinct actual cells, >=4; known Loop + place requires place = path[0]',beats:'wait only, 1..24'},inspect:'All recipes, including unbuilt descendants, are public. actions lists recipe steps, direct place arrangements and elementary loops; longer closed paths use the same public path predicate and exact preview. Next is level navigation, not a combination. All levels are finite explicit challenges; no authored narrative or self-renewal requirement.'};}
export function previewLiving(s:State,a:Action){try{return {legal:true,...observeLiving(stepLiving(s,a))};}catch(error){return {legal:false,reason:(error as Error).message};}}
export function livingRules(){return {
 version:LIVING_VERSION,concepts:LIVING_CONCEPTS,recipes:LIVING_RECIPES,
 creation:'Combine two known capabilities to make their disclosed result. Inputs remain. With at:cell, a placeable result is made directly there as part of that same physical combination. Otherwise it becomes an inexhaustible known design. Combine a known design with an actual cell ID to install it; no desired-output goal command exists. Recipes and unbuilt descendants are visible from the start. Known designs persist across next; material boards do not.',
 places:'Only displayed cells exist; absent coordinates are gaps. All actual cardinal neighbors are public. Direct tool+place creates material/components: Earth/Stone/Clay/Ceramic/Timber replace material and clear old roots/records; Channel changes actual ports; Aqueduct also supplies an elevated walk; Rootbed/Grove/Interpreter require unfired soil/clay and install roots; Imprint/Archive/Beacon install exact recording, with Archive/Beacon ceramic; Float installs a sensor. A plain Gate is closed. Replacing a recording surface with material physically erases its record, enabling recovery without finite costs. Rooted and fired forms cannot coincide.',
 flow:'One actual edge per beat, same rule in every board. Sources have public identity/schedules. Current source emissions and previous fields travelling along their previous resolved outlets merge by MAX pressure and UNION exact/fragments/seeds. Pressure is not a stored inventory. Roots make water gentle1, exact marks become fragments, and seeds travel. Gentle seeded soil grows roots. Exact-record surfaces retain current exact arrivals by union. A Beacon republishes its own retained record, not a recipe teacher\'s identity. Closed paths can recirculate actual packets; there is no reset-empty fixed-point settlement in this model.',
 walking:'Any actual cardinal connection is walkable if both cells are unflooded. Strong2 floods unfired, unelevated, unrooted soil/clay/timber. Rooted, stone/ceramic and aqueduct surfaces remain dry to walk; gentle water is traversable. River/grove goal evidence reads actual water and roots, not unlocked recipe labels.',
 valves:'A Valve+place combination installs a gate at that actual place and a float at the selected adjacent control cell. Ordered ports are [dry outlet, wet outlet]. Previous-beat water at the actual float selects which port carries the current gate output; the other closes. It responds to the world, not a desired watering goal. Cutting or diverting the float\'s supply changes its operation. Plain gates block their outlets.',
 wholeRoutes:'Channel+Channel with path constructs a closed cardinal route from at least four actual distinct cells. That is Loop, not a duration token. Channel+Loop at its work ID opens the final return edge, preserving the actual long path as a Delay. Valve+Delay at its work ID installs the entry valve and a float at the adjacent final cell; dry sends along that path, wet sends through the explicitly chosen alternative port. Flow travels every path edge before feedback reaches the entry. Reusing a known Loop combines it with the actual first path cell, never an unknown token. Work descriptors always point to actual editable cells; editing a route can break the old work. Delay/feedback composition requires those actual ungated route connections still exist. No hidden checkmark substitutes for those connections.',
 time:'A combine advances one beat. Wait advances 1..24 actual beats as a recording convenience; never a supply/deadline. World edits clear the alternation observation window. Alternation succeeds only after an actual exact repeated physical state; its entire cycle must satisfy the goal. Up to 256 prior physical states are retained to detect a cycle; a longer unseen period remains unverified, never declared successful from a prefix. Finish is always valid, even without success. Next is legal only after the current goal and moves to the next explicit board while retaining all known concepts; it is counted separately from combinations.',
 goals:{crossing:'Dry A2↔E2 route plus wet, rooted living B3/D3 groves.',alternation:'An actually observed full repeated physical-state cycle: both groves living/rooted; no simultaneous watering or flooding anywhere in that cycle; both groves have wet phases.',publication:'Terminal condition, not invariant over all past events: B1 exact record A only; D1 B only; C2 currently receives A+B fragments and no exact identities; dry A2↔E2 walk. Erasing/rebuilding a contaminated surface is permitted and visible.'},
 scenarios:'sequence starts with six primitives, order crossing→alternation→publication. prebuilt has the SAME order with all 24 designs known. reverse has the reversed order and the normal six primitives. These separately vary prior capability and order; the physical worlds and recipe graph are unchanged. Neither condition is an enjoyment measure.'
};}
export function replayLiving(actions:Action[],scenario='sequence'){return actions.reduce(stepLiving,createLiving(scenario));}
export const livingCrossingChain=():Action[]=>[{type:'combine',a:'seed',b:'water',at:'B2'},{type:'combine',a:'rootbed',b:'D2'},{type:'wait',beats:4}];
export function livingBoardWitness(input:State,method:'whole'|'manual'='whole'){
 let s=clone(input);const actions:Action[]=[];
 const apply=(a:Action)=>{actions.push(a);s=stepLiving(s,a);};
 const ensure=(id:string)=>{if(s.known.includes(id))return;const r=LIVING_RECIPES.find(r=>r.out===id);if(!r||r.mode!=='concept')throw new Error(`Witness needs a physical route to make ${id}.`);ensure(r.a);ensure(r.b);apply({type:'combine',a:r.a,b:r.b});};
 if(level(s)==='crossing'){
  if(s.known.includes('rootbed'))apply({type:'combine',a:'rootbed',b:'B2'});else apply({type:'combine',a:'seed',b:'water',at:'B2'});
  apply({type:'combine',a:'rootbed',b:'D2'});apply({type:'wait',beats:4});
 }else if(level(s)==='alternation'){
  ensure('valve');ensure('channel');ensure('rootbed');
  apply({type:'combine',a:'rootbed',b:'C2'});apply({type:'combine',a:'rootbed',b:'C4'});
  if(method==='whole'){
   apply({type:'combine',a:'channel',b:'channel',path:['C3','C2','D2','D3']});const loop=s.works.at(-1)!.id;
   apply({type:'combine',a:'channel',b:'loop',at:loop});const delay=s.works.at(-1)!.id;
   apply({type:'combine',a:'valve',b:'delay',at:delay,ports:['south']});
  }else{
   apply({type:'combine',a:'valve',b:'C3',ports:['north','south'],control:'D3'});
   apply({type:'combine',a:'channel',b:'C2',ports:['east']});apply({type:'combine',a:'channel',b:'D2',ports:['south']});
  }
  apply({type:'wait',beats:24});
 }else{
  ensure('archive');ensure('channel');ensure('rootbed');
  apply({type:'combine',a:'archive',b:'B1'});apply({type:'combine',a:'archive',b:'D1'});
  apply({type:'combine',a:'rootbed',b:'B2'});apply({type:'combine',a:'rootbed',b:'D2'});
  apply({type:'combine',a:'channel',b:'B2',ports:['east']});apply({type:'combine',a:'channel',b:'D2',ports:['west']});apply({type:'wait',beats:4});
 }
 return {actions,state:s,goal:livingGoal(s)};
}
export function livingCampaignWitness(scenario='sequence',method:'whole'|'manual'='whole'){
 let s=createLiving(scenario);const actions:Action[]=[],levels:{id:LevelId;actions:Action[];goal:unknown;knownOnEntry:string[];knownOnExit:string[]}[]=[];
 for(let i=0;i<3;i++){const knownOnEntry=[...s.known],w=livingBoardWitness(s,method);s=w.state;actions.push(...w.actions);if(!w.goal.achieved)throw new Error(`Witness did not complete ${level(s)}.`);levels.push({id:level(s),actions:w.actions,goal:w.goal,knownOnEntry,knownOnExit:[...s.known]});if(i<2){const next:Action={type:'next'};actions.push(next);s=stepLiving(s,next);}}
 return {actions,state:s,levels};
}
export function screenLiving(){
 const campaigns=['sequence','prebuilt','reverse'].map(scenario=>{const w=livingCampaignWitness(scenario);return {scenario,actions:w.actions,counts:{combines:w.actions.filter(a=>a.type==='combine').length,waitCommands:w.actions.filter(a=>a.type==='wait').length,waitBeats:w.actions.filter(a=>a.type==='wait').reduce((n,a)=>n+(a.beats??1),0),next:w.actions.filter(a=>a.type==='next').length},levels:w.levels,final:observeLiving(w.state),replayExact:JSON.stringify(replayLiving(w.actions,scenario))===JSON.stringify(w.state)};});
 const first=livingBoardWitness(createLiving()),secondStart=stepLiving(first.state,{type:'next'}),second=livingBoardWitness(secondStart),thirdStart=stepLiving(second.state,{type:'next'}),third=livingBoardWitness(thirdStart);
 const states=[createLiving(),first.state,secondStart,second.state,thirdStart,third.state];let forecasts=0;
 for(const s of states){const before=JSON.stringify(s);for(const a of livingActions(s)){const preview=previewLiving(s,a),next=stepLiving(s,a);if(JSON.stringify(preview)!==JSON.stringify({legal:true,...observeLiving(next)}))throw new Error('Living forecast mismatch');forecasts++;}if(JSON.stringify(s)!==before)throw new Error('Living input mutated');}
 const afterPeriod=stepLiving(second.state,{type:'wait',beats:second.state.cycle!.period});
 return {version:LIVING_VERSION,access:'privileged authored mechanical witnesses, not player experience',implementedConcepts:LIVING_CONCEPTS.length,campaigns,manualAlternation:livingBoardWitness(secondStart,'manual').goal,cycleReplayedExactly:livingPhysicalKey(afterPeriod)===livingPhysicalKey(second.state),validation:{forecasts,inputPreserved:true,replaysExact:campaigns.every(c=>c.replayExact)},limits:['The first board is a two-combine tutorial, not a long or difficult level.','Catalogue breadth does not require every branch in these witnesses.','All capabilities prebuilt is a legitimate control; success is not an automatic failure of the design.','Publication exclusion is a final-state requirement, not an invariant over all earlier transmission.']};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=screenLiving();mkdirSync('results',{recursive:true});writeFileSync('results/logical-living-works-screen.json',JSON.stringify(result,null,2));console.log(JSON.stringify({version:result.version,concepts:result.implementedConcepts,campaigns:result.campaigns.map(c=>({scenario:c.scenario,counts:c.counts,goals:c.levels.map(l=>({id:l.id,achieved:(l.goal as {achieved:boolean}).achieved})),known:c.final.known.length})),cycleReplayedExactly:result.cycleReplayedExactly,validation:result.validation},null,2));}
