/** Resonance garden: a small deterministic spatial/process experiment. No prose engine. */
import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

export const RESONANCE_VERSION='resonance-1';
export const RESONANCE_SCENARIOS=['shared-garden'];
export const DIRECTIONS=['north','east','south','west'] as const;
export type Direction=typeof DIRECTIONS[number];
export type Polarity='+'|'-';
export type PlaceId='A1'|'B1'|'C1'|'D1'|'A2'|'B2'|'C2'|'D2'|'A3'|'B3'|'C3'|'D3';
export interface Place {id:PlaceId;x:number;y:number;form:'soil'|'conductor'|'stone'|'diode'|'echo';ports:Direction[];scar:Direction[];gate?:Direction;recovery:0|1}
export interface Pulse {at:PlaceId;polarity:Polarity;ingress:Direction[];toward?:Direction}
export interface EchoFront {at:PlaceId;polarity:Polarity;toward:Direction}
interface SavedPlace {x:number;y:number;ports:Direction[];recovery:0|1}
interface SavedPulse {x:number;y:number;polarity:Polarity;ingress:Direction[]}
export interface Form {id:string;period:number;entry:Direction;cells:SavedPlace[];phases:{recovery:(0|1)[];pulses:SavedPulse[];echoes:{x:number;y:number;polarity:Polarity;toward:Direction}[]}[]}
export interface Action {type:'combine'|'wait'|'finish';a?:string;b?:string;at?:string;ports?:Direction[];toward?:Direction;phase?:number;beats?:number;intention?:string}
export interface Event {kind:string;beat:number;at?:PlaceId;polarity?:Polarity;from?:Direction[];detail?:string}
export interface State {version:string;scenarioId:string;seed:number;beat:number;places:Place[];pulses:Pulse[];echoes:EchoFront[];known:Form[];response:Event[];actions:Action[];status:'playing'|'won';ending?:string}
interface Cycle {places:PlaceId[];period:number;states:State[]}
const delta:Record<Direction,[number,number]>={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
const clone=<T>(x:T):T=>structuredClone(x);
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const pair=(a:string,b:string)=>[a,b].sort().join('+');
const ordered=(dirs:Direction[])=>DIRECTIONS.filter(d=>dirs.includes(d));
const opposite=(d:Direction)=>DIRECTIONS[(DIRECTIONS.indexOf(d)+2)%4];
const rotate=(d:Direction,n:number)=>DIRECTIONS[(DIRECTIONS.indexOf(d)+n)%4];
const at=(s:State,id:string)=>s.places.find(p=>p.id===id);
const neighbor=(s:State,p:Place,d:Direction)=>{const [dx,dy]=delta[d];return s.places.find(q=>q.x===p.x+dx&&q.y===p.y+dy);};
const conducting=(p:Place)=>['conductor','diode','echo'].includes(p.form);
const linked=(s:State,p:Place,d:Direction)=>{const q=neighbor(s,p,d);return !!q&&conducting(p)&&conducting(q)&&p.ports.includes(d)&&q.ports.includes(opposite(d));};
const event=(s:State,kind:string,at?:PlaceId,extra:Partial<Event>={})=>s.response.push({kind,beat:s.beat,at,...extra});
function dynamicKey(s:State,ids?:PlaceId[]){return JSON.stringify({places:s.places.filter(p=>!ids||ids.includes(p.id)).map(p=>({id:p.id,form:p.form,ports:p.ports,scar:p.scar,gate:p.gate,recovery:p.recovery})),pulses:s.pulses.filter(p=>!ids||ids.includes(p.at)),echoes:s.echoes.filter(p=>!ids||ids.includes(p.at))});}

/** One simultaneous beat. Edits happen before this; old excited/refractory cells reject arrivals. */
function beat(s:State,emit=true){
  const incoming=new Map<PlaceId,{polarity:Polarity;from:Direction}[]>(),occupied=new Set(s.pulses.map(p=>p.at));
  const report=(kind:string,id:PlaceId,extra:Partial<Event>={})=>{if(emit)event(s,kind,id,extra);};
  s.beat++;
  const due=s.echoes;s.echoes=[];
  const send=(p:Place,polarity:Polarity,d:Direction)=>{
    if(!linked(s,p,d))return;const q=neighbor(s,p,d)!,from=opposite(d);
    if(q.form==='diode'&&q.gate!==from){report('diode-reject',q.id,{from:[from],polarity});return;}
    if(occupied.has(q.id)||q.recovery){report('recovery-reject',q.id,{from:[from],polarity});return;}
    const arrivals=incoming.get(q.id)??[];arrivals.push({polarity,from});incoming.set(q.id,arrivals);
  };
  for(const pulse of s.pulses){
    const p=at(s,pulse.at)!;if(!conducting(p))continue;
    const exits=pulse.toward?[pulse.toward]:p.ports.filter(d=>!pulse.ingress.includes(d));
    for(const d of ordered(exits))send(p,pulse.polarity,d);
    if(p.form==='echo'&&p.gate){s.echoes.push({at:p.id,polarity:pulse.polarity,toward:p.gate});report('echo-scheduled',p.id,{polarity:pulse.polarity,from:[p.gate]});}
  }
  for(const front of due){const p=at(s,front.at)!;if(conducting(p)){send(p,front.polarity,front.toward);report('echo-return',p.id,{polarity:front.polarity,from:[front.toward]});}}
  s.echoes.sort((a,b)=>a.at.localeCompare(b.at));
  for(const p of s.places)p.recovery=occupied.has(p.id)?1:0;
  s.pulses=[];
  for(const p of s.places){
    const arrivals=incoming.get(p.id);if(!arrivals?.length)continue;
    const from=ordered(arrivals.map(a=>a.from));
    if(new Set(arrivals.map(a=>a.polarity)).size>1){report('annihilation',p.id,{from});continue;}
    p.scar=from;const polarity=arrivals[0].polarity;
    s.pulses.push({at:p.id,polarity,ingress:from});report(from.length>1?'coalescence':'passage',p.id,{from,polarity});
  }
  s.pulses.sort((a,b)=>a.at.localeCompare(b.at));
}
function components(s:State):PlaceId[][]{
  const remaining=new Set(s.places.filter(conducting).map(p=>p.id)),result:PlaceId[][]=[];
  while(remaining.size){const first=remaining.values().next().value!,queue=[first],ids:PlaceId[]=[];remaining.delete(first);
    for(const id of queue){ids.push(id);const p=at(s,id)!;for(const d of DIRECTIONS)if(linked(s,p,d)){const q=neighbor(s,p,d)!;if(remaining.delete(q.id))queue.push(q.id);}}
    result.push(ids.sort());
  }return result;
}
/** Exact bounded recurrence witness, not a score or a promise about interesting play. */
export function resonanceCycles(s:State,horizon=24):Cycle[]{
  const result:Cycle[]=[];
  for(const ids of components(s)){
    if(!s.pulses.some(p=>ids.includes(p.at))&&!s.echoes.some(p=>ids.includes(p.at)))continue;
    const future=clone(s),initial=dynamicKey(s,ids),states=[clone(s)];future.response=[];
    for(let t=1;t<=horizon;t++){
      beat(future,false);
      if(dynamicKey(future,ids)===initial){result.push({places:ids,period:t,states});break;}
      states.push(clone(future));
      if(!future.pulses.some(p=>ids.includes(p.at))&&!future.echoes.some(p=>ids.includes(p.at)))break;
    }
  }return result;
}
const hash=(value:string)=>{let n=2166136261;for(const c of value){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return (n>>>0).toString(16);};
function recordForms(s:State){
  for(const cycle of resonanceCycles(s)){
    const cells=s.places.filter(p=>cycle.places.includes(p.id)),minX=Math.min(...cells.map(p=>p.x)),minY=Math.min(...cells.map(p=>p.y));
    const anchor=cells.find(p=>p.x===minX&&p.y===minY);if(!anchor||anchor.scar.length!==1)continue;
    const saved=cells.map(p=>({x:p.x-minX,y:p.y-minY,ports:[...p.ports],recovery:p.recovery}));
    const phases=cycle.states.map(state=>({recovery:cells.map(p=>at(state,p.id)!.recovery),pulses:state.pulses.filter(p=>cycle.places.includes(p.at)).map(p=>({x:at(state,p.at)!.x-minX,y:at(state,p.at)!.y-minY,polarity:p.polarity,ingress:[...p.ingress]})),echoes:state.echoes.filter(p=>cycle.places.includes(p.at)).map(p=>({x:at(state,p.at)!.x-minX,y:at(state,p.at)!.y-minY,polarity:p.polarity,toward:p.toward}))}));
    // The same geometry/cyclic process is one capability regardless of which phase was first seen.
    const canonical=[...phases.map(p=>JSON.stringify(p))].sort()[0],start=phases.findIndex(p=>JSON.stringify(p)===canonical),orderedPhases=[...phases.slice(start),...phases.slice(0,start)];
    const body={period:cycle.period,entry:anchor.scar[0],cells:saved.map(p=>({...p,recovery:0 as const})),phases:orderedPhases};
    const id=`form-${hash(JSON.stringify(body))}`;
    if(!s.known.some(f=>f.id===id)){s.known.push({...body,id});event(s,'recurring-form',undefined,{detail:`${id}: period ${cycle.period}; ${cycle.places.join(',')}`});}
  }
}
function mapForm(s:State,form:Form,p:Place){
  if(p.scar.length!==1)return undefined;
  const turns=(DIRECTIONS.indexOf(p.scar[0])-DIRECTIONS.indexOf(form.entry)+4)%4;
  const point=(x:number,y:number)=>{for(let n=0;n<turns;n++)[x,y]=[-y,x];return {x:p.x+x,y:p.y+y};};
  const cells=form.cells.map(c=>{const pos=point(c.x,c.y);return {saved:c,place:s.places.find(q=>q.x===pos.x&&q.y===pos.y)};});
  return {turns,point,cells};
}
function unsupported(s:State,a:Action):string|undefined{
  if(s.version!==RESONANCE_VERSION||s.status!=='playing')return 'This version of the garden is not playing.';
  if(a.type==='wait')return Number.isSafeInteger(a.beats??1)&&(a.beats??1)>0&&(a.beats??1)<=24?undefined:'Wait batches are 1–24 beats; repeat freely. This is not a total allowance.';
  if(a.type==='finish')return initialAim(s)?undefined:'Keep the original four-place rhythm and establish a separate six-place rhythm on the east.';
  if(a.type!=='combine'||typeof a.a!=='string'||typeof a.b!=='string'||typeof a.at!=='string')return 'Combine A+B at a displayed place.';
  const p=at(s,a.at);if(!p)return 'Unknown place.';const key=pair(a.a,a.b);
  if(key===pair('earth','water')){
    if(!Array.isArray(a.ports)||!a.ports.length||a.ports.some(d=>!DIRECTIONS.includes(d))||new Set(a.ports).size!==a.ports.length)return 'Choose a nonempty set of distinct public compass ports.';
    if(a.ports.some(d=>!neighbor(s,p,d)))return 'Every chosen port must face an on-board place.';
    return p.form==='conductor'&&same(ordered(a.ports),p.ports)?'That conductor already has these ports.':undefined;
  }
  if(key===pair('earth','fire'))return p.form==='stone'?'This place is already stone.':undefined;
  if(key===pair('memory','stone')||key===pair('memory','water')){
    if(p.scar.length!==1)return 'A single successful ingress must have scarred this place. Tied arrivals leave an ambiguous scar.';
    const form=key===pair('memory','stone')?'diode':'echo';return p.form===form&&p.gate===p.scar[0]?'This directed form already follows that scar.':undefined;
  }
  if(key===pair('air','fire')||key===pair('air','water')){
    if(!conducting(p)||p.recovery||s.pulses.some(pulse=>pulse.at===p.id))return 'Injection needs a resting conducting place.';
    return a.toward&&DIRECTIONS.includes(a.toward)&&linked(s,p,a.toward)?undefined:'Choose a currently connected exit for the injected front.';
  }
  const form=s.known.find(f=>f.id===a.a||f.id===a.b),other=form?.id===a.a?a.b:a.a;
  if(form&&other==='memory'){
    const mapped=mapForm(s,form,p);if(!mapped)return 'A unique local scar supplies the remembered form’s orientation.';
    if(!Number.isInteger(a.phase??0)||(a.phase??0)<0||(a.phase??0)>=form.period)return 'Choose a displayed phase from 0 through period−1.';
    if(mapped.cells.some(c=>!c.place||c.place.form==='stone'||c.saved.ports.some(d=>!neighbor(s,c.place!,rotate(d,mapped.turns)))))return 'The entire rotated remembered footprint must fit on-board without stone.';
    return undefined;
  }
  return 'This pair has no public recipe. Inspect resonanceRules() and resonanceActions().';
}
export function createResonance(scenarioId='shared-garden',seed=0):State{
  if(!RESONANCE_SCENARIOS.includes(scenarioId))throw new Error('Unknown Resonance garden scenario.');
  const places=Array.from({length:12},(_,i):Place=>({id:`${'ABCD'[i%4]}${Math.floor(i/4)+1}` as PlaceId,x:i%4,y:Math.floor(i/4),form:'soil',ports:[],scar:[],recovery:0}));
  const s:State={version:RESONANCE_VERSION,scenarioId,seed,beat:0,places,pulses:[{at:'A1',polarity:'+',ingress:['south']}],echoes:[],known:[],response:[],actions:[],status:'playing'};
  const initial:Record<string,{ports:Direction[];scar:Direction}>={A1:{ports:['east','south'],scar:'south'},B1:{ports:['south','west'],scar:'west'},B2:{ports:['north','west'],scar:'north'},A2:{ports:['north','east'],scar:'east'}};
  for(const [id,value]of Object.entries(initial)){const p=at(s,id)!;p.form='conductor';p.ports=ordered(value.ports);p.scar=[value.scar];}
  at(s,'A2')!.recovery=1;recordForms(s);s.response=[];return s;
}
export function resonanceActions(s:State):Action[]{
  if(s.status!=='playing')return [];
  const result:Action[]=[];const offer=(a:Action)=>{if(!unsupported(s,a))result.push(a);};
  for(const p of s.places){
    const dirs=DIRECTIONS.filter(d=>neighbor(s,p,d));
    for(let bits=1;bits<1<<dirs.length;bits++)offer({type:'combine',a:'earth',b:'water',at:p.id,ports:dirs.filter((_,i)=>bits&(1<<i))});
    for(const [a,b]of [['earth','fire'],['memory','stone'],['memory','water']])offer({type:'combine',a,b,at:p.id});
    for(const [a,b]of [['air','fire'],['air','water']])for(const toward of dirs)offer({type:'combine',a,b,at:p.id,toward});
    for(const form of s.known)for(let phase=0;phase<form.period;phase++)offer({type:'combine',a:form.id,b:'memory',at:p.id,phase});
  }
  result.push({type:'wait',beats:1});offer({type:'finish'});return result;
}
export function resonanceAvailability(s:State,focus:{a?:string;b?:string;item?:string;at?:string}={}){
  return resonanceActions(s).filter(a=>a.type==='combine'&&(!focus.at||a.at===focus.at)&&(!focus.item||a.a===focus.item||a.b===focus.item)&&(!focus.a||a.a===focus.a||a.b===focus.a)&&(!focus.b||a.a===focus.b||a.b===focus.b));
}
export function stepResonance(s:State,a:Action):State{
  const error=unsupported(s,a);if(error)throw new Error(error);
  const n=clone(s);n.response=[];n.actions.push(clone(a));
  if(a.type==='finish'){n.status='won';n.ending='Two independent recurring forms; further coupling was optional.';return n;}
  if(a.type==='wait'){for(let i=0;i<(a.beats??1);i++)beat(n);recordForms(n);return n;}
  const p=at(n,a.at!)!,key=pair(a.a!,a.b!);
  if(key===pair('earth','water')){p.form='conductor';p.ports=ordered(a.ports!);delete p.gate;}
  else if(key===pair('earth','fire')){p.form='stone';p.ports=[];p.recovery=0;delete p.gate;n.pulses=n.pulses.filter(pulse=>pulse.at!==p.id);n.echoes=n.echoes.filter(front=>front.at!==p.id);}
  else if(key===pair('memory','stone')||key===pair('memory','water')){p.form=key===pair('memory','stone')?'diode':'echo';p.gate=p.scar[0];p.ports=ordered([...p.ports,p.gate]);}
  else if(key===pair('air','fire')||key===pair('air','water'))n.pulses.push({at:p.id,polarity:key===pair('air','fire')?'+':'-',ingress:[],toward:a.toward});
  else{
    const form=n.known.find(f=>f.id===a.a||f.id===a.b)!,mapped=mapForm(n,form,p)!,phase=form.phases[a.phase??0];
    for(const {saved,place}of mapped.cells){if(place!.form==='soil')place!.form='conductor';place!.ports=ordered([...place!.ports,...saved.ports.map(d=>rotate(d,mapped.turns))]);}
    const newPulses=phase.pulses.map(saved=>{const pos=mapped.point(saved.x,saved.y),place=n.places.find(p=>p.x===pos.x&&p.y===pos.y)!;return {at:place.id,polarity:saved.polarity,ingress:saved.ingress.map(d=>rotate(d,mapped.turns))};});
    // Superpose simultaneous fronts at occupied cells. Refractory destination terrain still rejects a planted front.
    for(const incoming of newPulses){const q=at(n,incoming.at)!;if(q.recovery){event(n,'recovery-reject',q.id,{polarity:incoming.polarity});continue;}
      const current=n.pulses.find(p=>p.at===incoming.at);
      if(current&&current.polarity!==incoming.polarity){n.pulses=n.pulses.filter(pulse=>pulse!==current);event(n,'annihilation',q.id);}
      else if(current)current.ingress=ordered([...current.ingress,...incoming.ingress]);else n.pulses.push(incoming);
    }
    for(const saved of phase.echoes){const pos=mapped.point(saved.x,saved.y),place=n.places.find(p=>p.x===pos.x&&p.y===pos.y)!;n.echoes.push({at:place.id,polarity:saved.polarity,toward:rotate(saved.toward,mapped.turns)});}
    event(n,'form-combination',p.id,{detail:`${form.id}, phase ${a.phase??0}, rotated ${mapped.turns} quarter-turns; local terrain/history retained.`});
  }
  event(n,'combine',p.id,{detail:`${a.a}+${a.b}`});beat(n);recordForms(n);return n;
}
function initialAim(s:State){
  const cycles=resonanceCycles(s),left=['A1','B1','A2','B2'],right=['C1','D1','C2','D2','C3','D3'];
  return cycles.some(c=>c.period===4&&same([...c.places].sort(),left.sort()))&&cycles.some(c=>c.period===6&&same([...c.places].sort(),right.sort()));
}
export function resonanceKey(s:State){return JSON.stringify({version:s.version,places:s.places,pulses:s.pulses,echoes:s.echoes,known:s.known,status:s.status});}
export function resonanceOutcome(s:State){const cycles=resonanceCycles(s);return {status:s.status,terminal:s.status==='won',semanticKey:resonanceKey(s),objectives:[{id:'two-independent-rhythms',value:initialAim(s)?1:0,direction:'higher' as const}],properties:{initialAim:initialAim(s),cycles:cycles.map(c=>({places:c.places,period:c.period})),moving:s.pulses.map(p=>p.at),scarred:s.places.filter(p=>p.scar.length).map(p=>p.id),forms:s.known.map(f=>f.id)}};}
export function resonanceRules(){return {
  version:RESONANCE_VERSION,board:'A1 B1 C1 D1 / A2 B2 C2 D2 / A3 B3 C3 D3. Only reciprocal cardinal ports form edges.',
  aim:'Preserve the existing west four-place recurring form and create a separate east six-place recurring form. That quiet ending is valid. Coupling, recoloring, echoes and remembered-form combinations are optional experiments, not extra required goals.',
  time:'Each combination edits its place before one simultaneous beat. Wait advances freely; batches are 1–24 beats with unlimited reuse. One beat is causal phase, not a time allowance. Finishing advances no beat. No finite ingredients, inventories or quotas exist.',
  propagation:'Each active front emits along its place’s reciprocal connected ports except all ingress sides. Injection chooses one exit for its first beat. Equal-polarity simultaneous arrivals coalesce. Opposite polarities annihilate all arrivals at that cell. Neither event spends a capability.',
  recovery:'An excited cell emits, becomes refractory for the following beat, then rests. Old excited and refractory destinations reject arrivals. Refractory rejection takes precedence over arrival collision. Rebuilding a conductor/diode/echo preserves excitation and recovery; stone erases both.',
  scar:'Successful arrivals replace the scar with their set of ingress sides. A simultaneous same-polarity tie records all sides and cannot orient a new diode/echo. Annihilation and rejected arrivals leave the older scar unchanged. A later unique arrival resolves a tie. Scars persist through idle time and rebuilding, including stone.',
  directed:'A diode admits only arrivals from its frozen gate side; its exits still follow normal ports. Echo accepts normally, emits its normal exits, then sends an additional front toward its frozen gate one beat later. This delayed return can reach a recovered predecessor. An already scheduled return persists if the future terrain mode changes; stone cancels it, and the present ports must still connect. The gate comes from the unique scar when built; later scars do not swivel it. These recipes add that gate port and retain all other ports.',
  recipes:[{a:'earth',b:'water',at:'Any place',result:'Conductor with chosen on-board ports. This replaces diode/echo mode, preserving past and moving fronts.'},{a:'earth',b:'fire',at:'Any non-stone place',result:'Stone; close ports, erase local front/recovery, retain scar.'},{a:'air',b:'fire',at:'Resting conducting place with chosen connected exit',result:'Inject + through that exit.'},{a:'air',b:'water',at:'Resting conducting place with chosen connected exit',result:'Inject − through that exit.'},{a:'memory',b:'stone',at:'Unique directional scar',result:'Diode oriented by the actual past of this place.'},{a:'memory',b:'water',at:'Unique directional scar',result:'Echo oriented by the actual past of this place.'},{a:'known form ID',b:'memory',at:'Unique directional scar; rotated footprint fits without stone',result:'Superpose that form’s routing and chosen pulse phase. Local scar rotates its entry to match; local terrain mode/recovery and actual scars persist. Add ports, fill soil with conductor, and collide copied fronts locally. Remembered period is not guaranteed in a changed environment.'}],
  forms:'An actually current conducting component must return to the exact same terrain/scars/fronts/delayed-returns/recovery within 24 beats with a live front; future transient recurrence is not counted. Its bounding top-left cell must exist and have a unique scar. The recognized form stores routing and all pulse/delayed-return phases, not destination history or terrain immunity. Phase indices remain canonical. Known forms persist after destruction and can be reused indefinitely. The 24-beat recurrence screen is a public recognition limit of this slice, not a world duration limit.',
  discoverability:'resonanceActions lists every current combination, port choice and remembered phase; resonanceAvailability can focus either ingredient or place. Every single-action preview is exact, deterministic and immutable. resonanceCycles exposes current exact recurrence witnesses; this is not hidden-state inference.',
  scope:'12 places, deterministic process toy, no authored narrative or opponent. A finite construction witness is not evidence of appetite or a 30–40-minute game.'};}
export function observeResonance(s:State){const cycles=resonanceCycles(s),actions=resonanceActions(s);return {version:s.version,scenario:s.scenarioId,status:s.status,beat:s.beat,
  aim:resonanceRules().aim,initialAimMet:initialAim(s),board:s.places.map(p=>({...p,state:s.pulses.some(pulse=>pulse.at===p.id)?'excited':p.recovery?'refractory':'resting',front:s.pulses.find(pulse=>pulse.at===p.id),delayedReturns:s.echoes.filter(front=>front.at===p.id)})),
  recurring:cycles.map(c=>({places:c.places,period:c.period})),capabilities:['earth','water','air','fire','stone','memory',...s.known.map(f=>f.id)],forms:s.known,
  response:s.response,legalActions:actions,placeAvailability:s.places.map(p=>({at:p.id,combinations:actions.filter(a=>a.at===p.id)})),
  actionSchema:{type:'combine | wait | finish',a:'ingredient/form ID',b:'ingredient/form ID',at:'place ID',ports:'Earth+Water: array of compass directions',toward:'Air+Fire/Air+Water: connected exit',phase:'Form+Memory: 0 through period−1',beats:'Wait:1–24, freely repeatable'},
  inspect:'All recipes and transitions are public. Preview shows exact immediate state; waiting can change phase without spending a supply. Finishing at a quiet independent settlement is valid.'};}
export function previewResonance(s:State,a:Action){return observeResonance(stepResonance(s,a));}
export function replayResonance(actions:Action[],scenario='shared-garden',seed=0){return actions.reduce(stepResonance,createResonance(scenario,seed));}
export function resonanceQuietChain(polarity:Polarity='+'):Action[]{return [
  ...([['C1',['east','south']],['D1',['south','west']],['D2',['north','south']],['D3',['north','west']],['C3',['north','east']],['C2',['north','south']]] as [PlaceId,Direction[]][]).map(([at,ports]):Action=>({type:'combine',a:'earth',b:'water',at,ports})),
  {type:'combine',a:'air',b:polarity==='+'?'fire':'water',at:'C1',toward:'east'},
  {type:'wait',beats:6},
];}
export function screenResonance(){
  const base=createResonance(),chain=resonanceQuietChain('-'),quiet=replayResonance(chain),before=clone(base);previewResonance(base,chain[0]);
  const couplings=[];
  for(let phase=0;phase<12;phase++){
    let s=quiet;if(phase)s=stepResonance(s,{type:'wait',beats:phase});
    for(const action of [{type:'combine',a:'earth',b:'water',at:'B2',ports:['north','east','west']},{type:'combine',a:'earth',b:'water',at:'C2',ports:['north','south','west']}] as Action[])s=stepResonance(s,action);
    const joined=s,succeeding=stepResonance(s,{type:'wait',beats:12});
    couplings.push({phase,joinedFronts:joined.pulses,trace:succeeding.response,outcome:resonanceOutcome(succeeding)});
  }
  let expand=base,copies=base,guards=quiet;const copyId=base.known[0].id;
  for(const p of base.places){
    const ports=DIRECTIONS.filter(d=>neighbor(expand,at(expand,p.id)!,d)),action:Action={type:'combine',a:'earth',b:'water',at:p.id,ports};
    if(!unsupported(expand,action))expand=stepResonance(expand,action);
    const copy=resonanceAvailability(copies,{a:copyId,b:'memory',at:p.id}).find(a=>a.phase===0);if(copy)copies=stepResonance(copies,copy);
    const guard=resonanceAvailability(guards,{a:'memory',b:'stone',at:p.id})[0];if(guard)guards=stepResonance(guards,guard);
  }
  const policyScreen={alwaysExpand:resonanceOutcome(expand).properties,copyStartingFormWhereEligible:resonanceOutcome(copies).properties,allDirectedSafeguardsAfterQuiet:resonanceOutcome(guards).properties,
    interpretation:'All directed safeguards preserve the quiet settlement. That is an actual shortcut for a player satisfied with independence, not a failed policy. The model supplies no mechanical obligation or proven desire to couple.'};
  return {version:RESONANCE_VERSION,scenario:'shared-garden',initial:resonanceOutcome(base),chain,quiet:resonanceOutcome(quiet),finish:stepResonance(quiet,{type:'finish'}).status,purePreview:same(before,base),replayExact:same(quiet,replayResonance(chain)),couplings,policyScreen,
    interpretation:['This is a mechanical chain, not a player appetite report.','Quiet independent closure is a supported result. Coupling changes phase/contact but has no extra compulsory reward.','The first target is a short route construction; whether remembered forms and connected rhythms are worth pursuing remains untested.']};}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=screenResonance();mkdirSync('results',{recursive:true});writeFileSync('results/logical-resonance-screen.json',JSON.stringify(result,null,2));console.log(JSON.stringify({version:result.version,purePreview:result.purePreview,replayExact:result.replayExact,quiet:result.quiet.properties,finish:result.finish,annihilationPhases:result.couplings.filter(c=>c.trace.some(e=>e.kind==='annihilation')).map(c=>c.phase)},null,2));}
