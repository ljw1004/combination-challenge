import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

export const FRONTIER_VERSION='frontier-1';
export const FRONTIER_SCENARIOS=['crossings'];
export type Lineage='blue'|'amber';
export type Kind='root'|'flame'|'shell';
export type Direction='N'|'E'|'S'|'W';
export type Path='straight'|'left'|'right'|'fork';
export type Terrain='ground'|'water'|'stone';
export interface Cell {id:string;x:number;y:number;terrain:Terrain;owner:Lineage|null;kind:Kind|null;exits:Direction[];history:Direction[];contacts:Lineage[];closed:Direction[]}
export interface Tip {lineage:Lineage;at:string;heading:Direction;kind:Kind;path:Path}
export interface Event {kind:string;at:string;lineage?:Lineage;from?:string;before?:unknown;after?:unknown}
export interface Action {type:'combine'|'wait'|'finish';a?:string;b?:string;at?:string;toward?:Direction;intention?:string}
export interface State {version:string;scenarioId:string;width:number;height:number;cells:Cell[];tips:Tip[];time:number;status:'playing'|'ended';response:Event[];actions:Action[]}
const directions:Direction[]=['N','E','S','W'];
const kinds:Kind[]=['root','flame','shell'];
const paths:Path[]=['straight','left','right','fork'];
const clone=<T>(x:T):T=>structuredClone(x);
const pair=(a:string,b:string)=>[a,b].sort().join('+');
const cell=(s:State,id:string)=>s.cells.find(c=>c.id===id);
const turn=(d:Direction,n:number)=>directions[(directions.indexOf(d)+n+4)%4];
const opposite=(d:Direction)=>turn(d,2);
const sorted=(ds:Direction[])=>directions.filter(d=>ds.includes(d));
function neighbor(s:State,c:Cell,d:Direction){const x=c.x+(d==='E'?1:d==='W'?-1:0),y=c.y+(d==='S'?1:d==='N'?-1:0);return s.cells[y*s.width+x]?.x===x?s.cells[y*s.width+x]:undefined;}
function faculty(d:Direction,p:Path){return p==='fork'?sorted([turn(d,-1),turn(d,1)]):[turn(d,p==='left'?-1:p==='right'?1:0)];}
function stronger(a:Kind,b:Kind){return a!==b&&(a==='root'&&b==='shell'||a==='shell'&&b==='flame'||a==='flame'&&b==='root');}
function transformed(k:Kind,t:Terrain):Kind|null {return t==='stone'&&k!=='flame'?null:t==='water'&&k==='flame'?'shell':k;}
function spatiallyEligible(s:State,c:Cell){return c.owner==='blue'||!c.owner&&directions.some(d=>neighbor(s,c,d)?.owner==='blue');}
function trailEligible(s:State,c:Cell){return spatiallyEligible(s,c);}
function stamp(s:State,c:Cell,t:Tip,heading:Direction){
  c.owner=t.lineage;c.kind=t.kind;c.exits=faculty(heading,t.path);c.history=sorted([...c.history,heading]);
}
function tipKey(t:Tip){return `${t.lineage}:${t.at}:${t.heading}`;}
function addContact(s:State,c:Cell,headings:Direction[],lineages:Lineage[]){
 const before={history:c.history,contacts:c.contacts};c.history=sorted([...c.history,...headings]);c.contacts=[...new Set([...c.contacts,...lineages])].sort() as Lineage[];
 if(JSON.stringify(before)!==JSON.stringify({history:c.history,contacts:c.contacts}))s.response.push({kind:'scar',at:c.id,before,after:{history:c.history,contacts:c.contacts}});
}
function beat(s:State){
  const arrivals=new Map<string,{tip:Tip;from:string;heading:Direction}[]>(),rest:Tip[]=[];
  for(const t of s.tips){
    const c=cell(s,t.at)!;if(c.owner!==t.lineage)continue;
    const exits=c.exits.filter(d=>!c.closed.includes(d)&&d!==opposite(t.heading));let moved=false;
    for(const heading of exits){
      const to=neighbor(s,c,heading);if(!to||to.closed.includes(opposite(heading)))continue;
      const k=transformed(t.kind,to.terrain);if(!k)continue;
      const nextHeading=heading;
      const tip:Tip={...t,at:to.id,kind:k,heading:nextHeading};
      const list=arrivals.get(to.id)||[];list.push({tip,from:c.id,heading});arrivals.set(to.id,list);moved=true;
    }
    if(!moved)rest.push(t);
  }
  const next:Tip[]=[...rest];
  for(const [id,arriving] of arrivals){
    const c=cell(s,id)!;const lineages=[...new Set(arriving.map(a=>a.tip.lineage))];
    if(c.owner&&!lineages.includes(c.owner))lineages.push(c.owner);
    if(lineages.length>1)addContact(s,c,arriving.map(a=>a.heading),lineages);
    // Same-lineage arrivals share the persistent faculty already present there.
    // Against an opponent's trail, each arriving type must defeat its local type.
    const allowed=arriving.filter(a=>!c.owner||a.tip.lineage===c.owner||stronger(a.tip.kind,c.kind!));
    const owners=[...new Set(allowed.map(a=>a.tip.lineage))];
    let survivors=allowed;
    if(owners.length>1){
      survivors=allowed.filter(a=>allowed.filter(b=>b.tip.lineage!==a.tip.lineage).every(b=>stronger(a.tip.kind,b.tip.kind)));
    }
    if(!survivors.length){s.response.push({kind:'halt',at:id,after:arriving.map(a=>`${a.tip.lineage}:${a.tip.kind}`)});continue;}
    const owner=survivors[0].tip.lineage;
    survivors=survivors.filter(a=>a.tip.lineage===owner);
    const lead=survivors[0];
    if(c.owner!==owner){const before={owner:c.owner,kind:c.kind,exits:c.exits};stamp(s,c,lead.tip,c.terrain==='water'&&lead.tip.kind==='root'?turn(lead.tip.heading,-1):lead.tip.heading);s.response.push({kind:before.owner?'convert':'grow',at:id,lineage:owner,from:lead.from,before,after:{owner:c.owner,kind:c.kind,exits:c.exits}});}
    c.history=sorted([...c.history,...survivors.map(a=>a.heading)]);
    for(const a of survivors)next.push({...a.tip,kind:c.kind!,path:a.tip.path});
  }
  const unique=new Map<string,Tip>();for(const t of next)if(cell(s,t.at)?.owner===t.lineage)unique.set(tipKey(t),t);
  s.tips=[...unique.values()].sort((a,b)=>tipKey(a).localeCompare(tipKey(b)));s.time++;
}
export function createFrontier(scenario='crossings',_seed=0):State {
 if(!FRONTIER_SCENARIOS.includes(scenario))throw new Error('Unknown frontier scenario.');
 const width=11,height=9;
 const s:State={version:FRONTIER_VERSION,scenarioId:scenario,width,height,cells:[],tips:[],time:0,status:'playing',response:[],actions:[]};
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const terrain:Terrain=(x===5&&[0,1,3,5,7,8].includes(y))||(y===4&&[3,7].includes(x))?'stone':(x===4&&[1,2,3,5,6,7].includes(y))||(x===6&&[2,3,5,6].includes(y))?'water':'ground';
  s.cells.push({id:`${String.fromCharCode(65+x)}${y+1}`,x,y,terrain,owner:null,kind:null,exits:[],history:[],contacts:[],closed:[]});
 }
 for(const lineage of ['blue','amber'] as Lineage[]){
  const x=lineage==='blue'?1:9,heading:Direction=lineage==='blue'?'E':'W';
  for(let y=2;y<=6;y++){
   const c=s.cells[y*width+x];c.owner=lineage;c.kind=kinds[(y-2)%3];c.exits=[heading];c.history=[heading];
   if(y%2===0)s.tips.push({lineage,at:c.id,heading,kind:c.kind,path:'fork'});
  }
 }
 return s;
}
function supported(s:State,a:Action):string|undefined {
 if(s.status!=='playing')return 'This frontier has been left at rest.';
 if(a.type==='wait'||a.type==='finish')return undefined;
 if(a.type!=='combine'||!a.a||!a.b||!a.at)return 'Use A+B at a named place.';
 const c=cell(s,a.at);if(!c)return 'Unknown place.';
 if(!trailEligible(s,c))return 'Combine on blue trail, or unclaimed ground directly beside it.';
 const k=kinds.find(k=>a.a===k||a.b===k),p=paths.find(p=>a.a===p||a.b===p);
 if(k&&p){
  if(!a.toward||!directions.includes(a.toward))return 'Choose the heading of the incoming faculty.';
  if(c.terrain==='stone'&&k!=='flame')return 'Only Flame enters stone; use a compatible faculty or change terrain.';
  return undefined;
 }
 const key=pair(a.a,a.b);
 if(key===pair('memory','root'))return c.owner==='blue'&&c.history.length?undefined:'Memory needs a blue trail with a remembered heading.';
 if(key===pair('memory','shell'))return c.owner==='blue'&&c.history.some(d=>!c.closed.includes(d))?undefined:'Memory needs remembered blue-trail edges not already closed.';
 if(key===pair('memory','air'))return c.closed.length?undefined:'No closed remembered edges here.';
 if(key===pair('earth','water'))return c.terrain!=='water'?undefined:'Already water.';
 if(key===pair('earth','fire'))return c.terrain!=='stone'?undefined:'Already stone.';
 if(key===pair('earth','air'))return c.terrain!=='ground'?undefined:'Already ground.';
 return 'This pair is absent from the complete public rules.';
}
export function stepFrontier(state:State,a:Action):State {
 const error=supported(state,a);if(error)throw new Error(error);
 const s=clone(state);s.response=[];s.actions.push(clone(a));
 if(a.type==='finish'){s.status='ended';return s;}
 if(a.type==='combine'){
  const c=cell(s,a.at!)!,kind=kinds.find(k=>a.a===k||a.b===k),path=paths.find(p=>a.a===p||a.b===p),before=clone(c);
  if(kind&&path){
   const k=transformed(kind,c.terrain)!;stamp(s,c,{lineage:'blue',at:c.id,heading:a.toward!,kind:k,path},c.terrain==='water'&&k==='root'?turn(a.toward!,-1):a.toward!);
   s.tips=s.tips.filter(t=>t.at!==c.id||t.lineage!=='blue');s.tips.push({lineage:'blue',at:c.id,heading:a.toward!,kind:k,path});
  }else switch(pair(a.a!,a.b!)){
   case pair('memory','root'):
    c.kind='root';c.exits=[...c.history];s.tips=s.tips.filter(t=>t.at!==c.id||t.lineage!=='blue');s.tips.push(...c.exits.map(heading=>({lineage:'blue' as Lineage,at:c.id,heading,kind:'root' as Kind,path:'straight' as Path})));break;
   case pair('memory','shell'):c.closed=sorted([...c.closed,...c.history]);break;
   case pair('memory','air'):c.closed=[];break;
   case pair('earth','water'):c.terrain='water';break;
   case pair('earth','fire'):c.terrain='stone';break;
   case pair('earth','air'):c.terrain='ground';break;
  }
  s.response.push({kind:'combine',at:c.id,lineage:'blue',before,after:clone(c)});
 }
 beat(s);return s;
}
export function frontierActions(s:State):Action[]{
 if(s.status!=='playing')return [];
 const result:Action[]=[{type:'wait'},{type:'finish'}];
 for(const c of s.cells.filter(c=>spatiallyEligible(s,c))){
  for(const a of kinds)for(const b of paths)for(const toward of directions){const action:Action={type:'combine',a,b,at:c.id,toward};if(!supported(s,action))result.push(action);}
  for(const [a,b] of [['memory','root'],['memory','shell'],['memory','air'],['earth','water'],['earth','fire'],['earth','air']]){const action:Action={type:'combine',a,b,at:c.id};if(!supported(s,action))result.push(action);}
 }
 return result;
}
function connected(s:State,owner:Lineage){
 const home=owner==='blue'?'B5':'J5',start=cell(s,home);if(start?.owner!==owner)return [];
 const queue=[start],seen=new Set<string>();for(const c of queue){if(seen.has(c.id))continue;seen.add(c.id);for(const d of directions){const n=neighbor(s,c,d);if(n?.owner===owner&&!c.closed.includes(d)&&!n.closed.includes(opposite(d)))queue.push(n);}}
 return [...seen];
}
function livingCircuits(s:State,owner:Lineage){
 // Orientation matters: a two-cell bounce is not a living circuit.
 const graph=new Map<string,string[]>();
 for(const c of s.cells.filter(c=>c.owner===owner))for(const incoming of directions){
  const edges:string[]=[];
  for(const d of c.exits){
   const n=neighbor(s,c,d);if(d===opposite(incoming)||c.closed.includes(d)||!n||n.owner!==owner||n.closed.includes(opposite(d))||transformed(c.kind!,n.terrain)===null)continue;
   edges.push(`${n.id}:${d}`);
  }
  graph.set(`${c.id}:${incoming}`,edges);
 }
 let serial=0;const index=new Map<string,number>(),low=new Map<string,number>(),stack:string[]=[],stacked=new Set<string>(),components:string[][]=[];
 function visit(id:string){
  index.set(id,serial);low.set(id,serial++);stack.push(id);stacked.add(id);
  for(const n of graph.get(id)||[]){if(!index.has(n)){visit(n);low.set(id,Math.min(low.get(id)!,low.get(n)!));}else if(stacked.has(n))low.set(id,Math.min(low.get(id)!,index.get(n)!));}
  if(low.get(id)===index.get(id)){const members:string[]=[];let n:string;do{n=stack.pop()!;stacked.delete(n);members.push(n);}while(n!==id);if(members.length>1&&s.tips.some(t=>t.lineage===owner&&members.includes(`${t.at}:${t.heading}`)))components.push([...new Set(members.map(n=>n.split(':')[0]))].sort());}
 }
 for(const id of graph.keys())if(!index.has(id))visit(id);return components;
}
export function frontierOutcome(s:State){
 const blue=s.cells.filter(c=>c.owner==='blue'),amber=s.cells.filter(c=>c.owner==='amber'),linked=connected(s,'blue');
 const circuits=livingCircuits(s,'blue'),homeCircuit=circuits.find(component=>component.includes('B5'))||[],loop=circuits.length>0,goal=homeCircuit.some(id=>cell(s,id)!.x>=8);
 return {terminal:s.status==='ended',goal,dimensions:{blueReach:blue.length,amberReach:amber.length,blueTips:s.tips.filter(t=>t.lineage==='blue').length,amberTips:s.tips.filter(t=>t.lineage==='amber').length,contactPlaces:s.cells.filter(c=>c.contacts.length===2).length,connectedEasternReach:linked.filter(id=>cell(s,id)!.x>=8).length,livingCircuit:loop?1:0,homeCircuitEasternReach:homeCircuit.filter(id=>cell(s,id)!.x>=8).length},circuits,direction:{blueReach:'descriptive',amberReach:'descriptive',blueTips:'descriptive',amberTips:'descriptive',contactPlaces:'descriptive',connectedEasternReach:'higher (initial aim)',livingCircuit:'descriptive',homeCircuitEasternReach:'higher (initial aim)'},stopping:'Finish is always available. The initial invitation is one living directed blue circuit containing B5 and column I or farther; coexistence, conquest or quiet isolation are optional projects.'};
}
export function frontierKey(s:State){return JSON.stringify({cells:s.cells,tips:s.tips,status:s.status});}
export function previewFrontier(s:State,a:Action){
 try{
  const next=stepFrontier(s,a);return {legal:true,time:next.time,changes:next.cells.filter((c,i)=>JSON.stringify(c)!==JSON.stringify(s.cells[i])).map(c=>({at:c.id,before:s.cells.find(x=>x.id===c.id),after:c})),tips:{before:s.tips,after:next.tips},events:next.response,outcome:frontierOutcome(next)};
 }catch(error){return {legal:false,reason:(error as Error).message};}
}
export function frontierRules(){return {
 action:'A+B at P. Both concepts remain available. A combination changes its place then advances one autonomous beat. Wait advances a beat freely; finish leaves the current world. There is no turn limit or stock.',
 eligibility:'Blue trail or an unclaimed cardinal neighbor of blue trail. Enemy trail must be reached by actual growth, never overwritten remotely.',
 pairs:[{a:'Root | Flame | Shell',b:'Straight | Left | Right | Fork',place:'eligible; stone accepts Flame only',effect:'Install a typed persistent path and a tip with chosen heading. Fork splits left/right; it gives up the straight continuation. Visiting friendly trail uses its existing exits.'},{a:'Memory',b:'Root',place:'blue trail with history',effect:'Root continuation along every remembered movement heading. Closed edges remain closed.'},{a:'Memory',b:'Shell',place:'blue trail with open remembered headings',effect:'Close those edges to both lineages, in both directions. Other edges remain available.'},{a:'Memory',b:'Air',place:'closed edges',effect:'Reopen those edges; keep their history.'},{a:'Earth',b:'Water | Fire | Air',place:'eligible terrain',effect:'Water makes water; Fire makes stone; Air makes ground. Existing imprints, paths, scars and tips remain.'}],
 movement:'Every tip takes every exit of its current friendly trail except an immediate reversal onto the edge it just used. A tip with no traversable exit rests and can wake after terrain/edge changes. A tip that attempts hostile contact and loses or ties disappears; its old trail remains. Arrivals at friendly trail adopt its kind. Equal arrivals coalesce per lineage/place/heading. Opposing equal types halt. Root beats Shell; Shell beats Flame; Flame beats Root. A winning arrival converts the target trail and installs its own path. Three-way cyclic simultaneous opposition halts rather than choosing an order.',
 terrain:'Root creating a new trail on water turns that new faculty left; fixed friendly paths retain their exits. Flame entering water becomes Shell; Shell enters water unchanged. Stone admits only Flame. Direction for a new trail is its transformed heading.',
 history:'Every successful claim stores its movement heading. Hostile contact also stores arriving headings and both lineages even when no one wins. Neither converting terrain nor replacing a path erases history. Memory uses this actual past as a catalyst.',
 goal:frontierOutcome(createFrontier()).stopping
 };}
export function observeFrontier(s:State){
 const glyph=(c:Cell)=>c.owner?`${c.owner==='blue'?'b':'a'}${c.kind==='root'?'R':c.kind==='flame'?'F':'S'}`:c.terrain==='stone'?'##':c.terrain==='water'?'~~':'..';
 return {version:s.version,scenario:s.scenarioId,time:s.time,status:s.status,columns:'ABCDEFGHIJK',rows:Array.from({length:s.height},(_,y)=>({row:y+1,cells:s.cells.filter(c=>c.y===y).map(glyph).join(' ')})),legend:'b blue / a amber; R root F flame S shell; ## stone ~~ water .. ground. Terrain beneath occupied cells and all directional fields are listed below.',tips:s.tips,places:s.cells.filter(c=>c.owner||c.terrain!=='ground'||c.history.length).map(c=>clone(c)),availability:s.cells.filter(c=>spatiallyEligible(s,c)).map(c=>({at:c.id,terrain:c.terrain,faculties:c.terrain==='stone'?['flame']:kinds,memoryRoot:c.owner==='blue'&&c.history.length>0,memoryShell:c.owner==='blue'&&c.history.some(d=>!c.closed.includes(d)),reopen:c.closed.length>0})),changes:s.response,outcome:frontierOutcome(s)};
}
export function replayFrontier(actions:Action[]){let s=createFrontier();for(const a of actions)s=stepFrontier(s,a);return s;}

export function frontierPolicy(s:State,name:string):Action {
 if(name==='wait')return {type:'wait'};
 const legal=frontierActions(s).filter(a=>a.type==='combine');
 if(name==='isolation'){
  // Seal the home component's border with stone, then remembered edges.
  const border=s.cells.filter(c=>c.owner==='blue'&&directions.some(d=>neighbor(s,c,d)?.owner!=='blue'));
  const stone=border.filter(c=>c.terrain!=='stone').sort((a,b)=>Math.abs(a.x-1)+Math.abs(a.y-4)-Math.abs(b.x-1)-Math.abs(b.y-4))[0];
  if(stone)return {type:'combine',a:'earth',b:'fire',at:stone.id};
  const close=legal.find(a=>a.a==='memory'&&a.b==='shell');return close||{type:'wait'};
 }
 const fixed=kinds.find(k=>name===`all-${k}`),fork=name==='all-fork';
 const candidates:{action:Action;score:number}[]=[];
 for(const c of s.cells.filter(c=>c.owner==='blue'))for(const desired of directions){
  const target=neighbor(s,c,desired);if(!target||target.owner==='blue')continue;
  const distance=Math.abs(target.x-1)+Math.abs(target.y-4);
  for(const kind of fixed?[fixed]:kinds){
   const sourceKind=transformed(kind,c.terrain);if(!sourceKind)continue;
   const toward=fork?(sourceKind==='root'&&c.terrain==='water'?desired:turn(desired,1)):(sourceKind==='root'&&c.terrain==='water'?turn(desired,1):desired);
   const action:Action={type:'combine',a:kind,b:fork?'fork':'straight',at:c.id,toward};
   if(supported(s,action))continue;
   const arriving=transformed(sourceKind,target.terrain);
   const wins=!!arriving&&(!target.owner||stronger(arriving,target.kind!));
   const score=(wins?100:0)+(target.owner==='amber'?10:0)+(name==='nearest-counter'?-distance:target.x*2)-Math.abs(target.y-4)*0.01;
   candidates.push({action,score});
  }
  // The nearest-counter attack may remove a local stone/water obstacle first.
  // Other blanket policies retain their stated single-faculty restriction.
  if(name==='nearest-counter'&&c.terrain!=='ground')candidates.push({action:{type:'combine',a:'earth',b:'air',at:c.id},score:80-distance});
 }
 candidates.sort((a,b)=>b.score-a.score||JSON.stringify(a.action).localeCompare(JSON.stringify(b.action)));
 return candidates[0]?.action||{type:'wait'};
}

export function screenFrontier(){
 const names=['wait','all-root','all-flame','all-shell','all-fork','nearest-counter','isolation'];
 const policies=names.map(name=>{
  let s=createFrontier();const checkpoints:unknown[]=[],actions:Action[]=[],seen=new Map<string,number>();let firstGoal:number|null=null,repeatedAt:number|null=null;
  for(let turn=0;turn<80;turn++){
   const a=frontierPolicy(s,name);actions.push(a);s=stepFrontier(s,a);const o=frontierOutcome(s);if(o.goal&&firstGoal===null)firstGoal=turn+1;
   if([7,15,31,79].includes(turn))checkpoints.push({after:turn+1,...o});
   const k=frontierKey(s);if(seen.has(k)&&repeatedAt===null)repeatedAt=turn+1;seen.set(k,turn);
  }
  return {name,firstGoal,repeatedAt,checkpoints,final:frontierOutcome(s),actions,finalState:s};
 });
 return {version:FRONTIER_VERSION,kind:'deterministic law attacks, not player tests',policies};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const result=screenFrontier();mkdirSync('results',{recursive:true});writeFileSync('results/logical-frontier-screen.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result.policies.map(p=>({name:p.name,firstGoal:p.firstGoal,repeatedAt:p.repeatedAt,...p.final.dimensions})),null,2));
}
