import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

export const FACULTIES_VERSION='faculties-1';
export const FACULTIES_SCENARIOS=['workshop'];
export type Route='east'|'south'|'split'|'closed';
export interface Cell {id:string;x:number;y:number;terrain:'stone'|'soil'|'clay';route:Route;fired:boolean;rooted:boolean;memory:number;beacon:boolean;lastBranch:'east'|'south'|null}
export interface Field {water:number;exact:number;fragment:number;seeds:boolean;publicExact:number;publicFragment:number;flooded:boolean}
export interface Physical {a:string;b:string;at:string;toward?:Route}
export interface Trace {id:string;recipe:Physical;before:Cell;after:Cell;fieldBefore:Field;time:number;actor:'player'|'maker';parents:string[];taughtBy?:string}
export interface Faculty {id:string;type:'atom'|'pair';trace?:string;a?:string;b?:string;site?:string;provenance:string[]}
export interface Frame {faculty:string;phase:number;mode?:Route;branch?:string}
export interface Walker {id:'blue'|'amber';at:string;home:string;carried:number;mode:'seek'|'return'|'nest';returned:boolean}
export interface Maker {at:string;faculty:string|null;binding:{dx:number;dy:number}|null;stack:Frame[];paused:boolean;response:string}
export interface Action {type:'combine'|'wait'|'finish';a?:string;b?:string;at?:string;toward?:Route;intention?:string}
export interface Event {kind:string;at?:string;actor?:string;before?:unknown;after?:unknown;trace?:string}
export interface State {version:string;scenarioId:string;cells:Cell[];field:Record<string,Field>;walkers:Walker[];maker:Maker;traces:Trace[];faculties:Faculty[];time:number;status:'playing'|'ended';events:Event[];actions:Action[]}
const clone=<T>(x:T):T=>structuredClone(x);
const pair=(a:string,b:string)=>[a,b].sort().join('+');
const cell=(s:State,id:string)=>s.cells.find(c=>c.id===id);
const hard=(c:Cell)=>c.terrain==='stone'||c.fired;
const empty=():Field=>({water:0,exact:0,fragment:0,seeds:false,publicExact:0,publicFragment:0,flooded:false});
const mask=(n:number)=>[n&1?'A':'',n&2?'B':''].filter(Boolean).join('+')||'-';
function outlets(s:State,c:Cell){return s.cells.filter(n=>(c.route==='east'||c.route==='split')&&n.x===c.x+1&&n.y===c.y||(c.route==='south'||c.route==='split')&&n.x===c.x&&n.y===c.y+1);}
function fields(s:State){
 const incoming=Object.fromEntries(s.cells.map(c=>[c.id,empty()])),result:Record<string,Field>={};
 incoming.A1.water=2;incoming.A1.exact=cell(s,'A1')!.memory;incoming.A3.water=2;incoming.A3.exact=cell(s,'A3')!.memory;
 for(const c of s.cells){
  const f={...incoming[c.id]};if(c.rooted){f.water=Math.min(f.water,1);f.fragment|=f.exact;f.exact=0;f.seeds=true;}
  if(c.beacon&&(f.exact||f.fragment||s.walkers.some(w=>w.at===c.id))){f.publicExact=f.exact|c.memory;f.publicFragment=f.fragment;f.exact|=c.memory;if(f.publicExact)f.water=2;}
  f.flooded=f.water===2&&!hard(c)&&!c.rooted;result[c.id]=f;
  for(const target of outlets(s,c)){const n=incoming[target.id];n.water=Math.max(n.water,f.water);n.exact|=f.exact;n.fragment|=f.fragment;n.seeds||=f.seeds;}
 }
 return result;
}
function settleFields(s:State){
 // Acyclic water can alter downstream eligibility within the same world beat.
 for(let k=0;k<s.cells.length;k++){
  s.field=fields(s);let changed=false;
  for(const c of s.cells){const f=s.field[c.id];if(hard(c)&&f.exact&&(c.memory|f.exact)!==c.memory){const before=c.memory;c.memory|=f.exact;s.events.push({kind:'imprint',at:c.id,before:mask(before),after:mask(c.memory)});changed=true;}if(c.terrain==='soil'&&!c.rooted&&f.water===1&&f.seeds){c.rooted=true;s.events.push({kind:'descendant',at:c.id});changed=true;}}
  if(!changed)break;
 }
 s.field=fields(s);
}
function neighbors(s:State,id:string){const c=cell(s,id)!;return s.cells.filter(n=>Math.abs(n.x-c.x)+Math.abs(n.y-c.y)===1&&!s.field[n.id].flooded).map(c=>c.id);}
function path(s:State,from:string,targets:string[]){const queue=[{at:from,path:[from]}],seen=new Set<string>();for(const item of queue){if(seen.has(item.at))continue;seen.add(item.at);if(targets.includes(item.at))return item.path;for(const n of neighbors(s,item.at))queue.push({at:n,path:[...item.path,n]});}return null;}
function physicalReason(s:State,p:Physical):string|undefined {
 const c=cell(s,p.at);if(!c)return 'Place is outside the board.';const f=s.field[c.id],k=pair(p.a,p.b);
 if(k===pair('earth','water')){
  if(!p.toward||!['east','south','split','closed'].includes(p.toward))return 'Specify east, south, split or closed.';
  if(c.route===p.toward)return 'This route already exists.';
  if((p.toward==='east'||p.toward==='split')&&c.x===4||(p.toward==='south'||p.toward==='split')&&c.y===2)return 'That route leaves the board.';return;
 }
 if(k===pair('seed','water'))return !c.rooted&&!hard(c)&&f.water>0?undefined:'Needs unrooted wet soil or unfired clay.';
 if(k===pair('heat','earth'))return c.terrain==='clay'&&!c.fired?undefined:'Needs unfired clay.';
 if(k===pair('air','voice'))return !c.beacon&&!!(c.memory|f.exact|f.fragment)?undefined:'Needs a nonbroadcasting local mark.';
 if(k===pair('stone','air'))return c.beacon?undefined:'Needs a broadcast to hood.';
 if(k===pair('heat','voice')){if(!c.memory)return 'Needs a local retained mark.';const n=clone(s);cell(n,p.at)!.memory=0;settleFields(n);return JSON.stringify(n.cells)===JSON.stringify(s.cells)&&JSON.stringify(n.field)===JSON.stringify(s.field)?'Continuing arrivals immediately restore this record; no lasting effect.':undefined;}
 if(k===pair('heat','water')){if(!c.rooted)return 'Needs living roots to dry.';const n=clone(s);cell(n,p.at)!.rooted=false;settleFields(n);return JSON.stringify(n.cells)===JSON.stringify(s.cells)&&JSON.stringify(n.field)===JSON.stringify(s.field)?'Continuing seeds immediately restore these roots; no lasting effect.':undefined;}
 return 'Absent from the complete public physical laws.';
}
function physical(s:State,p:Physical,actor:'player'|'maker',parents:string[]=[],taughtBy?:string){
 const c=cell(s,p.at)!,before=clone(c),fieldBefore=clone(s.field[p.at]),k=pair(p.a,p.b);
 if(k===pair('earth','water'))c.route=p.toward!;
 else if(k===pair('seed','water'))c.rooted=true;
 else if(k===pair('heat','earth')){c.fired=true;c.rooted=false;}
 else if(k===pair('air','voice'))c.beacon=true;
 else if(k===pair('stone','air'))c.beacon=false;
 else if(k===pair('heat','voice'))c.memory=0;
 else if(k===pair('heat','water'))c.rooted=false;
 settleFields(s);
 const signature=JSON.stringify({recipe:p,before,after:c,fieldBefore,actor,parents:[...new Set(parents)].sort(),taughtBy});const prior=s.traces.find(t=>JSON.stringify({recipe:t.recipe,before:t.before,after:t.after,fieldBefore:t.fieldBefore,actor:t.actor,parents:t.parents,taughtBy:t.taughtBy})===signature);const id=prior?.id||`t${s.traces.length+1}`;if(!prior)s.traces.push({id,recipe:clone(p),before,after:clone(c),fieldBefore,time:s.time,actor,parents:[...new Set(parents)].sort(),taughtBy});s.events.push({kind:'physical-combine',at:p.at,actor,trace:id,before,after:clone(c)});return id;
}
function faculty(s:State,id:string){return s.faculties.find(f=>f.id===id);}
function leaves(s:State,id:string):Trace[]{const f=faculty(s,id)!;if(f.type==='atom')return [s.traces.find(t=>t.id===f.trace)!];return [...leaves(s,f.a!),...leaves(s,f.b!)];}
function bound(s:State,t:Trace,b:{dx:number;dy:number}):Physical|null {const c=cell(s,t.recipe.at)!,target=s.cells.find(n=>n.x===c.x+b.dx&&n.y===c.y+b.dy);return target?{...t.recipe,at:target.id}:null;}
function hasEnabled(s:State,id:string,b:{dx:number;dy:number}){return leaves(s,id).some(t=>{const p=bound(s,t,b);return p&&!physicalReason(s,p);});}
function access(s:State,target:string){const c=cell(s,target)!;return s.cells.filter(n=>Math.abs(n.x-c.x)+Math.abs(n.y-c.y)<=1&&!s.field[n.id].flooded).map(c=>c.id);}
export function facultyBindings(s:State,id:string){
 if(!faculty(s,id))return [];
 const ts=leaves(s,id),result:{dx:number;dy:number;targets:{trace:string;at:string;guard:string|null}[];distance:number}[]=[];
 for(let dy=-2;dy<=2;dy++)for(let dx=-4;dx<=4;dx++){
  const b={dx,dy},ps=ts.map(t=>bound(s,t,b));if(ps.some(p=>!p))continue;
  let links=true;
  for(let i=0;i<ts.length;i++)for(let j=0;j<ts.length;j++){
   if(i===j)continue;const from=ts[i].before,to=ts[j].before;
   const actual=(from.route==='east'||from.route==='split')&&to.x===from.x+1&&to.y===from.y||(from.route==='south'||from.route==='split')&&to.x===from.x&&to.y===from.y+1;
   if(actual&&!outlets(s,cell(s,ps[i]!.at)!).some(c=>c.id===ps[j]!.at))links=false;
  }
  if(!links)continue;
  const enabled=ps.filter((p):p is Physical=>!!p&&!physicalReason(s,p));if(!enabled.length)continue;
  const distances=enabled.map(p=>path(s,s.maker.at,access(s,p.at))?.length).filter((n):n is number=>n!==undefined).map(n=>n-1);if(!distances.length)continue;
  result.push({dx,dy,targets:ts.map((t,i)=>({trace:t.id,at:ps[i]!.at,guard:physicalReason(s,ps[i]!)||null})),distance:Math.min(...distances)});
 }
 return result.sort((a,b)=>a.distance-b.distance||a.dy-b.dy||a.dx-b.dx);
}
function makerTick(s:State){
 const m=s.maker;if(m.paused||!m.faculty){m.response=m.paused?'paused':'no installed faculty';return;}
 if(!m.binding){const b=facultyBindings(s,m.faculty)[0];if(!b){m.response='rests: no reachable compatible footprint has an enabled operation';return;}m.binding={dx:b.dx,dy:b.dy};m.stack=[{faculty:m.faculty,phase:0}];s.events.push({kind:'bind',actor:'maker',after:b});}
 const boundFrame=m.binding;
 const controlSeen=new Set<string>();
 while(true){
  const controlKey=JSON.stringify(m.stack);if(controlSeen.has(controlKey)){m.response='rests: control returned without an enabled physical step';return;}controlSeen.add(controlKey);
  const frame=m.stack.at(-1);if(!frame){m.binding=null;m.response='procedure complete; next beat considers a new footprint';return;}
  const f=faculty(s,frame.faculty)!;
  if(f.type==='atom'){
   const t=s.traces.find(t=>t.id===f.trace)!,p=bound(s,t,boundFrame)!;const reason=physicalReason(s,p);
   if(reason){s.events.push({kind:'guard-skip',at:p.at,actor:'maker',after:reason});m.stack.pop();continue;}
   const c=cell(s,p.at)!,here=cell(s,m.at)!;
   if(Math.abs(c.x-here.x)+Math.abs(c.y-here.y)>1){const route=path(s,m.at,access(s,p.at));if(!route||route.length<2){m.response=`blocked: no dry approach to ${p.at}`;return;}const before=m.at;m.at=route[1];m.response=`walk toward ${p.at}`;s.events.push({kind:'maker-walk',at:m.at,before,after:m.at});return;}
   physical(s,p,'maker',t.parents.length?t.parents:[t.id],t.id);
   for(const parent of m.stack.slice(0,-1)){const pf=faculty(s,parent.faculty)!;if(parent.mode==='split'&&parent.branch){const site=cell(s,pf.site!)!;site.lastBranch=parent.branch===pf.a?'east':'south';}}
   m.stack.pop();m.response=`${p.a}+${p.b} at ${p.at}, from ${t.id}`;return;
  }
  const site=cell(s,f.site!)!;
  if(frame.phase===0){frame.mode=site.route;
   if(site.route==='split'){
    const preferred=site.lastBranch==='east'?[f.b!,f.a!]:[f.a!,f.b!];const selected=preferred.find(id=>hasEnabled(s,id,boundFrame));if(!selected){m.stack.pop();continue;}frame.branch=selected;frame.phase=1;m.stack.push({faculty:selected,phase:0});continue;
   }
   if(site.route==='closed'&&s.field[site.id].water===0){m.response=`feedback waits: basin ${site.id} is dry`;return;}
   if(site.route==='closed'&&!hasEnabled(s,f.id,boundFrame)){m.stack.pop();continue;}
   frame.phase=1;m.stack.push({faculty:site.route==='south'?f.b!:f.a!,phase:0});continue;
  }
  if(frame.mode==='split'){m.stack.pop();continue;}
  if(frame.phase===1){frame.phase=2;m.stack.push({faculty:frame.mode==='south'?f.a!:f.b!,phase:0});continue;}
  if(frame.mode==='closed'&&site.route==='closed'&&s.field[site.id].water>0&&hasEnabled(s,f.id,boundFrame)){frame.phase=0;continue;}
  m.stack.pop();
 }
}
function walkersTick(s:State){
 for(const w of s.walkers){
  let targets:string[]=[];
  if(w.mode==='seek')targets=s.cells.filter(c=>s.field[c.id].publicExact&(w.id==='blue'?2:1)).map(c=>c.id);
  else if(w.mode==='return')targets=[w.home];
  else targets=s.cells.filter(c=>c.id!==w.home&&c.memory===3&&!s.field[c.id].publicExact&&!s.field[c.id].publicFragment).map(c=>c.id);
  const p=path(s,w.at,targets);if(!p)continue;
  if(p.length>1){const before=w.at;w.at=p[1];s.events.push({kind:'walker-move',at:w.at,actor:w.id,before,after:w.at});}
  else if(w.mode==='seek'){w.carried|=cell(s,w.at)!.memory|s.field[w.at].publicExact;w.mode='return';s.events.push({kind:'walker-learn',at:w.at,actor:w.id,after:mask(w.carried)});}
  else if(w.mode==='return'){cell(s,w.home)!.memory|=w.carried;w.mode='nest';w.returned=true;s.events.push({kind:'walker-return',at:w.at,actor:w.id,after:mask(w.carried)});}
 }
}
export function createFaculties(scenario='workshop',_seed=0):State {
 if(!FACULTIES_SCENARIOS.includes(scenario))throw new Error('Unknown workshop.');
 const s:State={version:FACULTIES_VERSION,scenarioId:scenario,cells:[],field:{},walkers:[{id:'blue',at:'A1',home:'A1',carried:1,mode:'seek',returned:false},{id:'amber',at:'E3',home:'E3',carried:2,mode:'seek',returned:false}],maker:{at:'A3',faculty:null,binding:null,stack:[],paused:false,response:'no installed faculty'},traces:[],faculties:[],time:0,status:'playing',events:[],actions:[]};
 for(let y=0;y<3;y++)for(let x=0;x<5;x++){
  const id=`${String.fromCharCode(65+x)}${y+1}`,terrain:Cell['terrain']=x===0||x===4?'stone':x===2&&y!==1?'clay':'soil';
  s.cells.push({id,x,y,terrain,route:x===4?'closed':id==='B2'?'split':'east',fired:false,rooted:false,memory:id==='A1'?1:id==='A3'||id==='E3'?2:0,beacon:false,lastBranch:null});
 }
 settleFields(s);s.events=[];return s;
}
function reason(s:State,a:Action):string|undefined {
 if(s.status!=='playing')return 'This world has been left.';
 if(a.type==='wait'||a.type==='finish')return;
 if(a.type!=='combine'||!a.a||!a.b||!a.at)return 'Combine two things at an actual place.';
 const c=cell(s,a.at);if(!c)return 'Unknown place.';
 const trace=s.traces.find(t=>t.id===a.a||t.id===a.b),other=trace?(a.a===trace.id?a.b:a.a):null;
 if(trace&&other==='memory'){
  if(a.at!==s.maker.at)return 'Trace+Memory is combined at the maker avatar.';
  return s.faculties.some(f=>f.type==='atom'&&f.trace===trace.id)?'This trace is already a learned faculty.':undefined;
 }
 const fa=faculty(s,a.a),fb=faculty(s,a.b);
 if(fa&&fb)return s.faculties.some(f=>f.type==='pair'&&f.a===fa.id&&f.b===fb.id&&f.site===a.at)?'This pair already exists at this live site.':undefined;
 const f=fa||fb,otherF=f?(a.a===f.id?a.b:a.a):null;
 if(f&&otherF==='maker')return a.at!==s.maker.at?'Combine with the actual maker position.':s.maker.faculty===f.id&&!s.maker.paused?'This faculty is already installed.':undefined;
 if(pair(a.a,a.b)===pair('maker','stone'))return a.at!==s.maker.at?'Combine at the actual maker position.':s.maker.paused?'Maker is already paused.':undefined;
 return physicalReason(s,{a:a.a,b:a.b,at:a.at,toward:a.toward});
}
export function stepFaculties(state:State,a:Action):State {
 const invalid=reason(state,a);if(invalid)throw new Error(invalid);
 const s=clone(state);s.events=[];s.actions.push(clone(a));if(a.type==='finish'){s.status='ended';return s;}
 if(a.type==='combine'){
  const t=s.traces.find(t=>t.id===a.a||t.id===a.b),fa=faculty(s,a.a!),fb=faculty(s,a.b!);
  if(t&&(a.a==='memory'||a.b==='memory')){const f:Faculty={id:`f${s.faculties.length+1}`,type:'atom',trace:t.id,provenance:[t.id,...t.parents]};s.faculties.push(f);s.events.push({kind:'teach',at:a.at,actor:'maker',after:f});}
  else if(fa&&fb){const f:Faculty={id:`f${s.faculties.length+1}`,type:'pair',a:fa.id,b:fb.id,site:a.at,provenance:[...new Set([...fa.provenance,...fb.provenance])]};s.faculties.push(f);s.events.push({kind:'compose',at:a.at,after:f});}
  else if((fa||fb)&&(a.a==='maker'||a.b==='maker')){s.maker.faculty=(fa||fb)!.id;s.maker.binding=null;s.maker.stack=[];s.maker.paused=false;s.events.push({kind:'install',at:a.at,after:s.maker.faculty});}
  else if(pair(a.a!,a.b!)===pair('maker','stone')){s.maker.paused=true;s.events.push({kind:'pause',at:a.at});}
  else physical(s,{a:a.a!,b:a.b!,at:a.at!,toward:a.toward},'player');
 }
 settleFields(s);makerTick(s);settleFields(s);walkersTick(s);settleFields(s);s.time++;return s;
}
export function facultiesActions(s:State):Action[]{
 if(s.status!=='playing')return [];
 const result:Action[]=[{type:'wait'},{type:'finish'}];
 for(const c of s.cells){for(const toward of ['east','south','split','closed'] as Route[]){const a:Action={type:'combine',a:'earth',b:'water',at:c.id,toward};if(!reason(s,a))result.push(a);}for(const [a,b]of [['seed','water'],['heat','earth'],['air','voice'],['stone','air'],['heat','voice'],['heat','water']]){const action:Action={type:'combine',a,b,at:c.id};if(!reason(s,action))result.push(action);}for(const a of s.faculties)for(const b of s.faculties){const action:Action={type:'combine',a:a.id,b:b.id,at:c.id};if(!reason(s,action))result.push(action);}}
 for(const t of s.traces){const a:Action={type:'combine',a:t.id,b:'memory',at:s.maker.at};if(!reason(s,a))result.push(a);}
 for(const f of s.faculties){const a:Action={type:'combine',a:f.id,b:'maker',at:s.maker.at};if(!reason(s,a))result.push(a);}
 const pause:Action={type:'combine',a:'stone',b:'maker',at:s.maker.at};if(!reason(s,pause))result.push(pause);return result;
}
export function statusFaculties(s:State){return s.status;}
export function compatibleFacultiesPlaces(s:State,a:string,b:string){return facultiesActions(s).filter(x=>x.type==='combine'&&pair(x.a!,x.b!)===pair(a,b));}
export function facultiesKey(s:State){return JSON.stringify({cells:s.cells,walkers:s.walkers,maker:{...s.maker,response:undefined},faculties:s.faculties,traces:s.traces.map(t=>({...t,time:undefined})),status:s.status});}
export function facultiesOutcome(s:State){
 const transferred=s.traces.filter(t=>t.actor==='maker'&&t.parents.some(id=>s.traces.find(p=>p.id===id)?.recipe.at!==t.recipe.at));
 return {terminal:s.status==='ended',goal:transferred.length>0,objectives:[{id:'actual-trace-transferred',value:transferred.length,direction:'higher' as const}],properties:{roots:s.cells.filter(c=>c.rooted).map(c=>c.id),records:s.cells.filter(c=>c.memory).map(c=>({at:c.id,mark:mask(c.memory)})),broadcasts:s.cells.filter(c=>c.beacon).map(c=>c.id),returned:s.walkers.filter(w=>w.returned).map(w=>w.id)}};
}
export function previewFaculties(s:State,a:Action){try{const n=stepFaculties(s,a);return {legal:true,time:n.time,cellChanges:n.cells.filter((c,i)=>JSON.stringify(c)!==JSON.stringify(s.cells[i])).map(c=>({at:c.id,before:s.cells.find(x=>x.id===c.id),after:c})),fieldChanges:s.cells.filter(c=>JSON.stringify(s.field[c.id])!==JSON.stringify(n.field[c.id])).map(c=>({at:c.id,before:s.field[c.id],after:n.field[c.id]})),maker:n.maker,walkers:n.walkers,newTraces:n.traces.slice(s.traces.length),newFaculties:n.faculties.slice(s.faculties.length),events:n.events,outcome:facultiesOutcome(n)};}catch(error){return {legal:false,reason:(error as Error).message};}}
export function observeFaculties(s:State){return {version:s.version,scenario:s.scenarioId,time:s.time,status:s.status,board:s.cells.map(c=>({at:c.id,terrain:c.fired?'fired':c.terrain,route:c.route,roots:c.rooted,imprint:mask(c.memory),beacon:c.beacon,lastBranch:c.lastBranch,water:s.field[c.id].water,exact:mask(s.field[c.id].exact),fragment:mask(s.field[c.id].fragment),flooded:s.field[c.id].flooded})),maker:s.maker,avatars:s.walkers,faculties:s.faculties,traces:s.traces.map(t=>({id:t.id,recipe:t.recipe,actor:t.actor,parents:t.parents,taughtBy:t.taughtBy,sourceState:{route:t.before.route,terrain:t.before.terrain,roots:t.before.rooted,memory:mask(t.before.memory),water:t.fieldBefore.water,exact:mask(t.fieldBefore.exact),fragment:mask(t.fieldBefore.fragment)}})),bindings:s.maker.faculty?facultyBindings(s,s.maker.faculty):[],response:s.events,goal:'Teach an enacted operation, physically compose a faculty, and let its effects meet another place. Further agency, records and living routes are optional projects.',outcome:facultiesOutcome(s)};}
export function facultiesRules(){return {
 physical:'Same inexhaustible physical effects as Imprints: Seed+Water roots wet soil/unfired clay; Heat+Earth fires clay, removes roots, and captures exact arrivals; Air+Voice broadcasts local retained/arriving marks; Stone+Air hoods it; Heat+Voice erases a record; Heat+Water dries roots. Erasure/drying immediately restored by continuing arrivals is ineligible; Earth+Water changes the actual route. Full preconditions are returned for every binding and invalid preview.',
 flow:'A1/A3 supply strong water carrying their actual retained A/B identities. Water and marks follow east/south routes. Roots soften strong flow, fragment exact arrivals and emit seeds. Gentle seeded arrivals grow soil descendants. Hard/fired surfaces retain exact arriving identities. Active beacons republish their own retained exact marks, even when current arrivals are fragments, causing strong local flow. No copied trace supplies source memory to its destination.',
 teaching:'A physical combination produces a public trace tN with actual recipe, source before/after and provenance. Trace+Memory at the maker teaches fN. Teaching supplies the recipe and its demonstrated position, not the resulting terrain or record. A learned faculty+Maker at its actual place installs it; Stone+Maker pauses. Both are physical combination actions, never finished-output goal commands.',
 composition:'Combine two learned faculties at any actual place. Its live route is read at entry: east runs A then B; south runs B then A; split chooses an enabled branch, preferring the branch not last successfully enacted at this place; closed repeats A then B only while this basin is wet. Dry closed basins wait. A channel skips ineligible primitives; a fork tests current primitive guards. A completed procedure considers another binding next beat; a live basin repeats its bound footprint while something can change. A successful physical action updates active fork sites; walks do not, and an innermost use wins if a site is nested. Changing this real route changes subsequent control. Node mode is retained for its current pass.',
 binding:'Translate the demonstrated footprint without rotation. All leaves must stay on-board; demonstrated direct east/south flow links between leaves must exist at the destination. At least one primitive guard must hold and be reachable by a dry approach. Choose the nearest eligible footprint from maker position; ties dy then dx. Execution uses actual destination guards, memories and arrivals, reevaluated before each primitive. A maker works at its own or a cardinal neighboring place and otherwise walks one dry cardinal edge per beat; path ties follow row-major order. Ineligible primitives skip. An unreachable current primitive waits, without selecting a new finished goal.',
 time:'Player combination, then at most one maker walk/physical combination, then one step per walker. Flow/imprints/descendants settle between physical operations. Wait is free; there is no deadline, action allowance, material stock or mandatory maintenance. Finish is always available.',
 walkers:'Blue/amber seek a public exact other identity, return it home, then seek a quiet shared A+B record. They use actual dry routes. Their records and positions are world state, not recipe keys.',
 inspect:'facultiesActions supplies complete finite choices; facultyBindings supplies every legal footprint with primitive guards. Exact previews include world config/history, maker runtime, walkers, new traces and provenance. The rule catalogue is public from the beginning.'
 };}
export function replayFaculties(actions:Action[]){return actions.reduce(stepFaculties,createFaculties());}
function taughtPrelude(){
 const actions:Action[]=[{type:'combine',a:'seed',b:'water',at:'B1'},{type:'combine',a:'heat',b:'earth',at:'C1'},{type:'combine',a:'air',b:'voice',at:'C1'},{type:'combine',a:'t1',b:'memory',at:'A3'},{type:'combine',a:'t2',b:'memory',at:'A3'},{type:'combine',a:'t3',b:'memory',at:'A3'}];
 return {actions,state:replayFaculties(actions)};
}
export function screenFaculties(){
 const prelude=taughtPrelude();
 const run=(order:'fire-first'|'root-first')=>{
  const actions=[...prelude.actions];let s=clone(prelude.state);
  const plan:Action[]=order==='fire-first'?[{type:'combine',a:'f2',b:'f3',at:'A2'},{type:'combine',a:'f4',b:'f1',at:'A2'}]:[{type:'combine',a:'f1',b:'f2',at:'A2'},{type:'combine',a:'f4',b:'f3',at:'A2'}];
  plan.push({type:'combine',a:'f5',b:'maker',at:'A3'});
  for(const a of plan){actions.push(a);s=stepFaculties(s,a);}
  const frames:unknown[]=[];
  for(let beat=0;beat<14;beat++){frames.push({time:s.time,maker:clone(s.maker),events:clone(s.events),C3:clone(cell(s,'C3')),D3:clone(cell(s,'D3')),C3flow:clone(s.field.C3),D3flow:clone(s.field.D3)});const a:Action={type:'wait'};actions.push(a);s=stepFaculties(s,a);}
  return {order,actions,frames,state:s,outcome:facultiesOutcome(s),summary:{C3record:mask(cell(s,'C3')!.memory),C3fired:cell(s,'C3')!.fired,B3rooted:cell(s,'B3')!.rooted,C3broadcast:cell(s,'C3')!.beacon,C3water:s.field.C3.water,D3roots:cell(s,'D3')!.rooted,D3water:s.field.D3.water,D3flooded:s.field.D3.flooded,maker:s.maker.response}};
 };
 return {version:FACULTIES_VERSION,kind:'executable causal-chain screen, not player enjoyment evidence',hypothesis:'The same actual faculties preserve relative operations while destination history and intermediate arrivals determine the world result.',prelude,fireFirst:run('fire-first'),rootFirst:run('root-first')};
}

export function broadcastTransferWitness(retain:boolean){
 const actions:Action[]=[];let s=createFaculties();
 const act=(a:Action)=>{actions.push(a);s=stepFaculties(s,a);};
 act({type:'combine',a:'seed',b:'water',at:'B1'});act({type:'combine',a:'heat',b:'earth',at:'C1'});act({type:'combine',a:'air',b:'voice',at:'C1'});act({type:'combine',a:'t3',b:'memory',at:'A3'});
 act({type:'combine',a:'earth',b:'water',at:'C3',toward:'closed'});
 const fire:Action={type:'combine',a:'heat',b:'earth',at:'C3'},root:Action={type:'combine',a:'seed',b:'water',at:'B3'};
 for(const a of retain?[fire,root]:[root,fire])act(a);
 for(const at of ['A1','A3','B3'])act({type:'combine',a:'air',b:'voice',at});
 const before=clone(s);act({type:'combine',a:'f1',b:'maker',at:s.maker.at});
 for(let i=0;i<10&&!s.events.some(e=>e.kind==='physical-combine'&&e.actor==='maker'&&e.at==='C3');i++)act({type:'wait'});
 const makerTrace=s.traces.find(t=>t.actor==='maker'&&t.recipe.at==='C3'&&pair(t.recipe.a,t.recipe.b)===pair('air','voice'));
 if(!makerTrace)throw new Error('The public nearest binding did not reach recipient C3.');
 act({type:'combine',a:'stone',b:'maker',at:s.maker.at});act({type:'combine',a:'earth',b:'water',at:'C3',toward:'east'});
 return {retain,actions,before,broadcastTrace:makerTrace,state:s,summary:{C3record:mask(cell(s,'C3')!.memory),C3water:s.field.C3.water,C3publicExact:mask(s.field.C3.publicExact),D3water:s.field.D3.water,D3roots:cell(s,'D3')!.rooted,D3flooded:s.field.D3.flooded,transferredFrom:makerTrace.parents}};
}
export function attackFaculties(){
 const runs=['gardening','fire-everywhere','isolation'].map(name=>{
  let s=createFaculties();const actions:Action[]=[];const act=(a:Action)=>{actions.push(a);s=stepFaculties(s,a);};
  if(name==='fire-everywhere')act({type:'combine',a:'heat',b:'earth',at:'C1'});else act({type:'combine',a:'seed',b:'water',at:'B1'});
  act({type:'combine',a:'t1',b:'memory',at:'A3'});
  if(name==='isolation'){act({type:'combine',a:'earth',b:'water',at:'A1',toward:'closed'});act({type:'combine',a:'earth',b:'water',at:'A3',toward:'closed'});}
  act({type:'combine',a:'f1',b:'maker',at:'A3'});
  const seen=new Map<string,number>();let repeat:number|null=null;
  for(let i=0;i<32;i++){act({type:'wait'});const key=facultiesKey(s);if(seen.has(key)&&repeat===null)repeat=i+1;seen.set(key,i);}
  return {name,actions,repeatAfterWaits:repeat,state:s,summary:{...facultiesOutcome(s).properties,livingClay:s.cells.filter(c=>c.terrain==='clay'&&c.rooted).map(c=>c.id),firedClay:s.cells.filter(c=>c.fired).map(c=>c.id),maker:s.maker.response,transferred:facultiesOutcome(s).goal}};
 });
 return {runs,interpretation:'Gardening and firing alone should honestly reach finite saturation. Firing excludes living clay irreversibly; gardening does not preserve the same local exact clay record. Isolation is a valid rest state and disables a flow-dependent faculty. None of these probes establishes long-horizon purpose.'};
}
export function contextFacultiesWitness(){
 let s=createFaculties();const actions:Action[]=[];const act=(a:Action)=>{actions.push(a);s=stepFaculties(s,a);};
 act({type:'combine',a:'seed',b:'water',at:'B1'});act({type:'combine',a:'heat',b:'earth',at:'C1'});act({type:'combine',a:'air',b:'voice',at:'C1'});act({type:'combine',a:'stone',b:'air',at:'C1'});
 act({type:'combine',a:'t3',b:'memory',at:'A3'});act({type:'combine',a:'t4',b:'memory',at:'A3'});
 act({type:'combine',a:'earth',b:'water',at:'E1',toward:'south'});
 act({type:'combine',a:'f1',b:'f2',at:'E2'});act({type:'combine',a:'f3',b:'maker',at:'A3'});
 const wet:unknown[]=[];for(let i=0;i<6;i++){wet.push({time:s.time,maker:clone(s.maker),events:clone(s.events),A3beacon:cell(s,'A3')!.beacon});act({type:'wait'});}
 act({type:'combine',a:'earth',b:'water',at:'E1',toward:'closed'});
 const dry:unknown[]=[];for(let i=0;i<4;i++){dry.push({time:s.time,maker:clone(s.maker),events:clone(s.events),A3beacon:cell(s,'A3')!.beacon});act({type:'wait'});}
 const dried=clone(s);act({type:'combine',a:'earth',b:'water',at:'E1',toward:'south'});act({type:'wait'});
 return {actions,wet,dry,driedState:dried,rewetState:s,summary:{wetBasinRepeatedPhysicalActs:wet.filter((x:any)=>x.events.some((e:Event)=>e.actor==='maker'&&e.kind==='physical-combine')).length,dryBasinWait:dried.maker.response,rewetResponse:s.maker.response}};
}
export function forkHistoryWitness(prefer:'east'|'south'){
 let s=createFaculties();const actions:Action[]=[];const act=(a:Action)=>{actions.push(a);s=stepFaculties(s,a);};
 for(const [a,b,at]of [['seed','water','B1'],['heat','earth','C1'],['air','voice','C1'],['stone','air','C1']])act({type:'combine',a,b,at});
 for(let i=1;i<=4;i++)act({type:'combine',a:`t${i}`,b:'memory',at:'A3'});
 act({type:'combine',a:prefer==='east'?'f3':'f4',b:prefer==='east'?'f4':'f3',at:'B2'});act({type:'combine',a:'f5',b:'maker',at:'A3'});
 act({type:'combine',a:'stone',b:'maker',at:s.maker.at});
 const seeded=clone(s);
 act({type:'combine',a:'f1',b:'f2',at:'B2'});act({type:'combine',a:'f6',b:'maker',at:s.maker.at});
 for(let i=0;i<10&&!s.traces.some(t=>t.actor==='maker'&&t.parents.some(p=>p==='t1'||p==='t2'));i++)act({type:'wait'});
 const first=s.traces.find(t=>t.actor==='maker'&&t.parents.some(p=>p==='t1'||p==='t2'));
 if(!first)throw new Error('Fork failed to execute its selected guarded branch.');
 return {prefer,actions,seeded,state:s,first,summary:{actualLastBranchBefore:cell(seeded,'B2')!.lastBranch,firstRecipe:first.recipe,firstSource:first.parents,C3record:mask(cell(s,'C3')!.memory),B3rooted:cell(s,'B3')!.rooted}};
}
export function verifyFaculties(){
 const insist=(ok:unknown,msg:string)=>{if(!ok)throw new Error(msg);};
 const screen=screenFaculties(),transfer={retained:broadcastTransferWitness(true),neverRetained:broadcastTransferWitness(false)},context=contextFacultiesWitness(),fork={afterEast:forkHistoryWitness('east'),afterSouth:forkHistoryWitness('south')};
 insist(screen.fireFirst.summary.C3record==='B'&&screen.rootFirst.summary.C3record==='-','order must change actual retained destination record');
 insist(screen.fireFirst.summary.D3flooded&&!screen.rootFirst.summary.D3flooded,'order must change downstream habitat');
 insist(transfer.retained.summary.C3publicExact==='B'&&transfer.neverRetained.summary.C3publicExact==='-','same taught broadcast must read local recipient history');
 insist(transfer.retained.summary.D3flooded&&!transfer.neverRetained.summary.D3flooded&&transfer.neverRetained.summary.D3roots,'local history must alter connected neighbor');
 insist(transfer.retained.broadcastTrace.before.memory===2&&transfer.neverRetained.broadcastTrace.before.memory===0,'transferred operation must not overwrite recipient past');
 insist(context.summary.wetBasinRepeatedPhysicalActs>=4&&context.summary.dryBasinWait.includes('dry'),'actual basin water must control feedback');
 insist(pair(fork.afterEast.first.recipe.a,fork.afterEast.first.recipe.b)===pair('heat','earth')&&pair(fork.afterSouth.first.recipe.a,fork.afterSouth.first.recipe.b)===pair('seed','water'),'same fork faculty must read actual previous branch');
 const observedStates=[createFaculties(),taughtPrelude().state,screen.fireFirst.state,context.driedState];let checked=0;
 for(const s of observedStates){const unchanged=JSON.stringify(s);for(const a of facultiesActions(s)){
  const p=previewFaculties(s,a),n=stepFaculties(s,a);insist(p.legal,'listed legal action was rejected');insist(JSON.stringify(s)===unchanged,'preview or step mutated input');
  if(p.legal){const cells=clone(s.cells),field=clone(s.field);for(const c of p.cellChanges!)cells[cells.findIndex(x=>x.id===c.at)]=c.after;for(const f of p.fieldChanges!)field[f.at]=f.after;
   insist(JSON.stringify(cells)===JSON.stringify(n.cells)&&JSON.stringify(field)===JSON.stringify(n.field),'full world/history forecast mismatch');insist(JSON.stringify(p.maker)===JSON.stringify(n.maker)&&JSON.stringify(p.walkers)===JSON.stringify(n.walkers),'actor forecast mismatch');
   insist(JSON.stringify([...s.traces,...p.newTraces!])===JSON.stringify(n.traces)&&JSON.stringify([...s.faculties,...p.newFaculties!])===JSON.stringify(n.faculties),'trace/provenance or faculty forecast mismatch');
   insist(n.events.filter(e=>e.kind==='physical-combine'&&e.actor==='maker').length<=1,'more than one maker physical action in a beat');
  }checked++;
 }}
 for(const run of [screen.fireFirst,screen.rootFirst,transfer.retained,transfer.neverRetained,context,fork.afterEast,fork.afterSouth]){
  const replay=replayFaculties(run.actions),end='state' in run?run.state:run.rewetState;insist(facultiesKey(replay)===facultiesKey(end),'saved action chain replay mismatch');
 }
 return {version:FACULTIES_VERSION,checkedLegalActions:checked,observedStates:observedStates.length,pureExactPreviews:true,replayExact:true,oneMakerAtomicActionPerBeat:true,orderChangesLocalHistory:true,transferredBroadcastUsesLocalHistory:true,basinUsesActualFlow:true,forkUsesActualLastBranch:true,screen,transfer,context,fork};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const integrity=verifyFaculties(),attacks=attackFaculties();mkdirSync('results',{recursive:true});
 for(const [file,value]of Object.entries({'screen':integrity.screen,'transfer':integrity.transfer,'context':integrity.context,'fork':integrity.fork,'attacks':attacks,'integrity':integrity}))writeFileSync(`results/logical-faculties-${file}.json`,JSON.stringify(value,null,2));
 console.log(JSON.stringify({...integrity,screen:undefined,transfer:undefined,context:undefined,fork:undefined},null,2));
}
