import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

export const IMPRINT_VERSION='imprints-1';
export const IMPRINT_SCENARIOS=['board'];
export type CellId='A1'|'B1'|'C1'|'A2'|'B2'|'C2'|'A3'|'B3'|'C3';
type Route='east'|'south'|'split'|'closed';
export interface Cell {id:CellId;x:number;y:number;terrain:'stone'|'soil'|'clay';route:Route;fired:boolean;rooted:boolean;memory:number;beacon:boolean}
export interface Field {water:number;exact:number;fragment:number;seeds:boolean;publicExact:number;publicFragment:number;flooded:boolean}
export interface Walker {id:'blue'|'amber';at:CellId;home:CellId;carried:number;mode:'seek'|'return'|'nest';returned:boolean;target?:CellId}
export interface Action {type:'combine'|'finish';a?:string;b?:string;at?:CellId;toward?:Route;intention?:string}
export interface State {version:string;scenarioId:string;cells:Cell[];field:Record<CellId,Field>;walkers:Walker[];time:number;response:{kind:string;at:CellId;walker?:string;before?:unknown;after?:unknown}[];actions:Action[];status:'playing'|'won'}
const ids:CellId[]=['A1','B1','C1','A2','B2','C2','A3','B3','C3'];
const clone=<T>(x:T):T=>structuredClone(x);
const pair=(a:string,b:string)=>[a,b].sort().join('+');
const cell=(s:State,id:CellId)=>s.cells.find(c=>c.id===id)!;
const mask=(n:number)=>[n&1?'A':'',n&2?'B':''].filter(Boolean).join('+')||'—';
const stone=(c:Cell)=>c.terrain==='stone'||c.fired;
const empty=():Field=>({water:0,exact:0,fragment:0,seeds:false,publicExact:0,publicFragment:0,flooded:false});
function outlets(s:State,c:Cell):CellId[]{return s.cells.filter(n=>(c.route==='east'||c.route==='split')&&n.x===c.x+1&&n.y===c.y||(c.route==='south'||c.route==='split')&&n.x===c.x&&n.y===c.y+1).map(c=>c.id);}
function fields(s:State){
  const incoming=Object.fromEntries(ids.map(id=>[id,empty()])) as Record<CellId,Field>,result={} as Record<CellId,Field>;
  incoming.A1.water=2;incoming.A1.exact=cell(s,'A1').memory;
  for(const c of s.cells){
    const f={...incoming[c.id]};
    if(c.rooted){f.water=Math.min(f.water,1);f.fragment|=f.exact;f.exact=0;f.seeds=true;}
    if(c.beacon&&(f.exact||f.fragment||s.walkers.some(w=>w.at===c.id))){
      f.publicExact=f.exact|c.memory;f.publicFragment=f.fragment;
      f.exact|=c.memory;
      if(f.publicExact)f.water=2;
    }
    f.flooded=f.water===2&&!stone(c)&&!c.rooted;result[c.id]=f;
    for(const target of outlets(s,c)){const next=incoming[target];next.water=Math.max(next.water,f.water);next.exact|=f.exact;next.fragment|=f.fragment;next.seeds||=f.seeds;}
  }
  return result;
}
function neighbors(s:State,id:CellId){const c=cell(s,id);return s.cells.filter(n=>Math.abs(c.x-n.x)+Math.abs(c.y-n.y)===1&&!s.field[n.id].flooded).map(c=>c.id);}
function pathTo(s:State,from:CellId,targets:CellId[]):CellId[]|null {
  const queue=[{at:from,path:[from]}],seen=new Set<CellId>();
  for(const item of queue){if(seen.has(item.at))continue;seen.add(item.at);if(targets.includes(item.at))return item.path;for(const n of neighbors(s,item.at))queue.push({at:n,path:[...item.path,n]});}
  return null;
}
function dynamics(s:State){
  const seen=new Set<string>();
  for(let turn=0;turn<64;turn++){
    s.field=fields(s);let changed=false;
    for(const c of s.cells){
      const f=s.field[c.id];
      if(stone(c)&&f.exact&&(c.memory|f.exact)!==c.memory){const before=c.memory;c.memory|=f.exact;s.response.push({kind:'imprint',at:c.id,before:mask(before),after:mask(c.memory)});changed=true;}
      if(c.terrain==='soil'&&!c.rooted&&f.water===1&&f.seeds){c.rooted=true;s.response.push({kind:'descendant',at:c.id});changed=true;}
    }
    s.field=fields(s);
    for(const w of s.walkers){
      const other=w.id==='blue'?2:1;
      if(w.mode==='seek'){
        const targets=s.cells.filter(c=>!!(s.field[c.id].publicExact&other)).map(c=>c.id),path=pathTo(s,w.at,targets);w.target=path?.at(-1);
        if(path&&path.length===1){w.carried|=cell(s,w.at).memory|s.field[w.at].publicExact;w.mode='return';s.response.push({kind:'learn',at:w.at,walker:w.id,after:mask(w.carried)});changed=true;}
        else if(path){const before=w.at;w.at=path[1];s.response.push({kind:'move',at:w.at,walker:w.id,before,after:w.at});changed=true;}
      }else if(w.mode==='return'){
        const path=pathTo(s,w.at,[w.home]);w.target=w.home;
        if(path&&path.length===1){const c=cell(s,w.home);c.memory|=w.carried;w.returned=true;w.mode='nest';s.response.push({kind:'return-imprint',at:w.at,walker:w.id,after:mask(c.memory)});changed=true;}
        else if(path){const before=w.at;w.at=path[1];s.response.push({kind:'move',at:w.at,walker:w.id,before,after:w.at});changed=true;}
      }else{
        const targets=s.cells.filter(c=>c.id!==w.home&&c.memory===3&&!s.field[c.id].publicExact&&!s.field[c.id].publicFragment).map(c=>c.id),path=pathTo(s,w.at,targets);w.target=path?.at(-1);
        if(path&&path.length>1){const before=w.at;w.at=path[1];s.response.push({kind:'nest-move',at:w.at,walker:w.id,before,after:w.at});changed=true;}
      }
    }
    const key=JSON.stringify([s.cells,s.walkers]);
    if(!changed||seen.has(key))break;seen.add(key);s.time++;
  }
  s.field=fields(s);s.response=s.response.slice(-24);
}
export function createImprints(id='board',_seed=0):State {
  if(!IMPRINT_SCENARIOS.includes(id))throw new Error('Unknown board.');
  const terrains:Cell['terrain'][]=['stone','soil','clay','soil','stone','soil','clay','soil','stone'];
  const s:State={version:IMPRINT_VERSION,scenarioId:id,cells:ids.map((id,i)=>({id,x:i%3,y:Math.floor(i/3),terrain:terrains[i],route:i===0?'split':i%3<2?'east':Math.floor(i/3)<2?'south':'closed',fired:false,rooted:false,memory:i===0?1:0,beacon:false})),field:{} as State['field'],walkers:[{id:'blue',at:'A1',home:'A1',carried:1,mode:'seek',returned:false},{id:'amber',at:'C3',home:'C3',carried:2,mode:'seek',returned:false}],time:0,response:[],actions:[],status:'playing'};
  dynamics(s);s.response=[];return s;
}
function supported(s:State,a:Action):string|undefined {
  if(a.type==='finish')return s.walkers.every(w=>w.returned)?undefined:'Both walkers have not yet brought the other mark home.';
  if(a.type!=='combine'||!a.a||!a.b||!a.at)return 'Use A+B at a named cell.';
  const c=cell(s,a.at);if(!c)return 'Unknown cell.';const f=s.field[c.id],k=pair(a.a,a.b);
  if(k===pair('earth','water')){
    if(!a.toward||!['east','south','split','closed'].includes(a.toward))return 'Specify toward: east, south, split or closed.';
    if(a.toward===c.route)return 'This route already exists.';
    if(a.toward==='east'&&c.x===2||a.toward==='south'&&c.y===2||a.toward==='split'&&(c.x===2||c.y===2))return 'The chosen route leaves the board.';
    return undefined;
  }
  if(k===pair('seed','water'))return !c.rooted&&!stone(c)&&f.water>0?undefined:'Needs wet soil or unfired wet clay without reeds.';
  if(k===pair('heat','earth'))return c.terrain==='clay'&&!c.fired?undefined:'Only unfired clay is this catalyst.';
  if(k===pair('stone','voice')){const marks=f.exact|s.walkers.filter(w=>w.at===c.id).reduce((m,w)=>m|w.carried,0);return stone(c)&&!!(marks&~c.memory)?undefined:'Needs a stone/fired surface and an exact local mark not already recorded.';}
  if(k===pair('air','voice'))return !c.beacon&&!!(c.memory|f.exact|f.fragment)?undefined:'Needs an existing local mark; this cell is not already broadcasting.';
  if(k===pair('stone','air'))return c.beacon?undefined:'Needs a broadcasting place to hood.';
  if(k===pair('heat','voice'))return c.memory>0?undefined:'Needs an existing imprint to erase.';
  if(k===pair('heat','water'))return c.rooted?undefined:'Needs rooted reeds to dry away.';
  return 'The complete public combination law does not include this pair.';
}
export function imprintsActions(s:State):Action[]{
  if(s.status!=='playing')return [];
  const result:Action[]=[];
  for(const c of s.cells){
    for(const toward of ['east','south','split','closed'] as Route[]){const a:Action={type:'combine',a:'earth',b:'water',at:c.id,toward};if(!supported(s,a))result.push(a);}
    for(const [a,b]of [['seed','water'],['heat','earth'],['stone','voice'],['air','voice'],['stone','air'],['heat','voice'],['heat','water']]){const action:Action={type:'combine',a,b,at:c.id};if(!supported(s,action))result.push(action);}
  }
  if(!supported(s,{type:'finish'}))result.push({type:'finish'});
  return result.filter(action=>{try{stepImprints(s,action);return true;}catch{return false;}});
}
export function stepImprints(s:State,a:Action):State {
  if(s.version!==IMPRINT_VERSION||s.status!=='playing')throw new Error('This board is not playing.');const invalid=supported(s,a);if(invalid)throw new Error(invalid);
  const n=clone(s);n.actions.push(clone(a));n.response=[];
  if(a.type==='finish'){n.status='won';return n;}
  const c=cell(n,a.at!),k=pair(a.a!,a.b!),before={...c};
  if(k===pair('earth','water'))c.route=a.toward!;
  else if(k===pair('seed','water'))c.rooted=true;
  else if(k===pair('heat','earth')){c.fired=true;c.rooted=false;}
  else if(k===pair('stone','voice'))c.memory|=s.field[c.id].exact|s.walkers.filter(w=>w.at===c.id).reduce((m,w)=>m|w.carried,0);
  else if(k===pair('air','voice'))c.beacon=true;
  else if(k===pair('stone','air'))c.beacon=false;
  else if(k===pair('heat','voice'))c.memory=0;
  else if(k===pair('heat','water'))c.rooted=false;
  n.response.push({kind:'combine',at:c.id,before,after:{...c}});dynamics(n);
  if(imprintsKey(n)===imprintsKey(s))throw new Error('The current arriving flow immediately restores the same board. This combination has no lasting effect here.');
  return n;
}
export function imprintsKey(s:State){return JSON.stringify({cells:s.cells,walkers:s.walkers,status:s.status});}
export function imprintsRules(){return {version:IMPRINT_VERSION,
  board:'A1 B1 C1 / A2 B2 C2 / A3 B3 C3. Water and carried marks follow east/south routes. Walkers use all dry cardinal neighbors. Stone and fired clay remain passable in strong water; unfired clay and unrooted soil flood.',
  flow:'A1 is a permanent strong-water source. Strength is pressure, not a conserved or stockpiled ingredient quantity. Branches can carry the same pressure. Exact and fragment marks travel with flow.',
  reeds:'A rooted place softens water to gentle, turns incoming exact marks into fragments and emits seeds. Seeds reaching unrooted soil with gentle water establish a descendant automatically. Strong arriving water prevents a new descendant, but planted reeds can soften it.',
  memory:'Stone and fired clay automatically retain exact arriving marks. Those imprints remain when a route closes or a later input is fragmentary. Stored identity is a world property, not a finite ingredient.',
  broadcast:'A broadcasting place activates when a current mark or walker is present. It republishes retained exact imprints even when the activating mark is only a fragment. Public exact marks create strong local flow; public fragments do not. Reeds run before retained memory is republished.',
  walkers:'Blue seeks a public exact B; amber seeks public exact A. Each walks by a shortest dry cardinal route, reads the other mark, returns home and imprints what it carried. Then it seeks a quiet A+B record away from its own home. If no route exists it rests. If its current nest becomes public it seeks another quiet record.',
  combinations:[
    {a:'earth',b:'water',place:'Any cell with an on-board outgoing direction',result:'Set toward east, south, split or closed.'},
    {a:'seed',b:'water',place:'Wet soil or unfired wet clay',result:'Establish reeds at this place.'},
    {a:'heat',b:'earth',place:'Unfired clay',result:'Fire it into a dry imprint-retaining surface; remove its roots.'},
    {a:'stone',b:'voice',place:'Stone/fired surface with an unrecorded exact arrival or a local walker holding a mark',result:'Imprint those exact identities.'},
    {a:'air',b:'voice',place:'A cell with a retained or arriving mark',result:'Make it broadcast; the place’s retained history determines what is emitted.'},
    {a:'stone',b:'air',place:'A broadcasting cell',result:'Hood the broadcast without erasing the record.'},
    {a:'heat',b:'voice',place:'A cell with an imprint',result:'Erase that imprint. A continuing exact arrival can immediately restore it; a combination with no lasting effect is omitted.'},
    {a:'heat',b:'water',place:'Rooted reeds',result:'Dry away roots, changing how the next arrival is treated. Continuing seeds and gentle water can regrow them; a combination with no lasting effect is omitted.'},
  ],
  time:'Each player change lets flow, imprints, descendants and walkers respond until they rest. The trace records arrival order and deposits. There is no player-time allowance, damage tick, waiting chore or supply count. Time is causal history rather than a spent action currency.',
  goal:'Bring the two marks into one another’s knowledge. Once both walkers have returned you may finish, or pursue quiet shared records, living routes or another self-chosen construction. No mandatory optional checklist exists.'};}
export function previewImprints(s:State,a:Action){const n=stepImprints(s,a);return {cellChanges:n.cells.filter((c,i)=>JSON.stringify(c)!==JSON.stringify(s.cells[i])),fieldChanges:ids.filter(id=>JSON.stringify(s.field[id])!==JSON.stringify(n.field[id])).map(id=>({at:id,before:s.field[id],after:n.field[id]})),walkers:n.walkers,autonomousTrace:n.response,time:n.time,status:n.status};}
export function compatibleImprintPlaces(s:State,a:string,b:string){return ids.map(at=>({at,terrain:cell(s,at).terrain,available:imprintsActions(s).filter(action=>action.at===at&&action.a&&pair(action.a,action.b!)===pair(a,b))})).filter(p=>p.available.length);}
export function observeImprints(s:State){return {version:s.version,scenario:s.scenarioId,status:s.status,time:s.time,goal:'Let each walker encounter the other mark and bring it home. Further constructions are optional.',
  board:s.cells.map(c=>({at:c.id,terrain:c.fired?'fired':c.terrain,route:c.route,reeds:c.rooted,imprint:mask(c.memory),beacon:c.beacon,water:s.field[c.id].water===2?'strong':s.field[c.id].water===1?'gentle':'dry',exact:mask(s.field[c.id].exact),fragment:mask(s.field[c.id].fragment),flooded:s.field[c.id].flooded})),
  avatars:s.walkers.map(w=>({...w,carried:mask(w.carried)})),response:s.response,
  actionSchema:{type:'combine',a:'item',b:'item',at:'cell ID',toward:'Earth+Water only: east/south/split/closed'},
  legalActions:imprintsActions(s),placeAvailability:ids.map(at=>({at,pairs:imprintsActions(s).filter(a=>a.at===at).map(a=>({a:a.a,b:a.b,toward:a.toward}))})),
  inspect:'imprintsRules() lists every place catalyst and effect; compatibleImprintPlaces(state,A,B) supplies the terrain highlights. Exact preview includes configs, imprints, fields, avatar purposes and autonomous movement.'};}
export function imprintsOutcome(s:State){return {status:s.status,terminal:s.status==='won',semanticKey:imprintsKey(s),objectives:[{id:'returned-with-both',value:s.walkers.filter(w=>w.returned&&w.carried===3).length,direction:'higher' as const}],properties:{sharedRecords:s.cells.filter(c=>c.memory===3).map(c=>c.id),quietShared:s.cells.filter(c=>c.memory===3&&!s.field[c.id].publicExact&&!s.field[c.id].publicFragment).map(c=>c.id),living:s.cells.filter(c=>c.rooted).map(c=>c.id),flooded:ids.filter(id=>s.field[id].flooded)}};}
export function replayImprints(actions:Action[]){return actions.reduce(stepImprints,createImprints());}
export function screenImprints(){
  const base=createImprints();let s=base;
  const route:Action={type:'combine',a:'earth',b:'water',at:'A1',toward:'east'},fire:Action={type:'combine',a:'heat',b:'earth',at:'C1'},broadcast:Action={type:'combine',a:'air',b:'voice',at:'C1'},root:Action={type:'combine',a:'seed',b:'water',at:'B1'};
  const chain:Action[]=[route,fire,broadcast,root];
  const states=chain.map(action=>{s=stepImprints(s,action);return {action,board:observeImprints(s).board,trace:s.response};});
  const rootFirst=replayImprints([route,root,fire,broadcast]);
  const erased=stepImprints(s,{type:'combine',a:'heat',b:'voice',at:'C1'});
  const goalChain:Action[]=[route,{type:'combine',a:'air',b:'voice',at:'A1'},{type:'combine',a:'air',b:'voice',at:'C3'}];
  const shared=replayImprints(goalChain);
  const before=clone(base);previewImprints(base,chain[0]);
  return {version:IMPRINT_VERSION,hypothesis:'A retained imprint and a place-dependent process can make a later fragment reactivate an exact public mark, changing flow and autonomous paths without an authored scene.',chain:states,
    contrastingHistory:{sameFiredBroadcastingC1:cell(s,'C1').fired&&cell(rootFirst,'C1').fired&&cell(s,'C1').beacon&&cell(rootFirst,'C1').beacon,sameRootedUpstreamB1:cell(s,'B1').rooted&&cell(rootFirst,'B1').rooted,
      imprintFirst:{cache:mask(cell(s,'C1').memory),downstreamWater:s.field.C2.water,downstreamRoots:cell(s,'C2').rooted,avatars:s.walkers},rootFirst:{cache:mask(cell(rootFirst,'C1').memory),downstreamWater:rootFirst.field.C2.water,downstreamRoots:cell(rootFirst,'C2').rooted,avatars:rootFirst.walkers}},
    erasingOnlyLocalCopy:{C1:mask(cell(erased,'C1').memory),originalA1:mask(cell(erased,'A1').memory),C2water:erased.field.C2.water,C2roots:cell(erased,'C2').rooted},
    initialAimWitness:{actions:goalChain,walkers:shared.walkers,canFinish:imprintsActions(shared).some(a=>a.type==='finish')},
    purePreview:JSON.stringify(before)===JSON.stringify(base),replayExact:JSON.stringify(replayImprints(chain))===JSON.stringify(s),notes:['This is a small primitive experiment, not an achieved180–240-opportunity game.','The initial shared-knowledge aim has a short three-operation witness; its challenge is not established. Further purposes must earn elective interest.','The chain is a mechanical witness, not an agent interest report.','Places are catalytic conditions and are never consumed. Mark identities and history are world state, not inventory.']};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=screenImprints();mkdirSync('results',{recursive:true});writeFileSync('results/logical-imprints-screen.json',JSON.stringify(result,null,2));console.log(JSON.stringify({version:result.version,purePreview:result.purePreview,replayExact:result.replayExact},null,2));}
