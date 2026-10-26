import { BASE_CONCEPTS, BUILD_VERSION, CONCEPTS, DATA_VERSION, DEFAULT_RULES, RECIPES, RULES, SCENARIOS } from './data.ts';
import type { ConceptId, Pulse, Recipe, Rules } from './data.ts';

export type Position = {row:number; col:number};
export type Action = {type:'discover'; recipe:string; at?:Position} | {type:'deploy'; concept:ConceptId; at:Position} | {type:'wait'};
export interface Structure {concept:ConceptId; remaining:number|null; age:number;}
export interface Cell extends Position {blocked:boolean; structure:Structure|null;}
export interface State {schema:1; build:string; data:string; scenario:string; seed:number; rules:string; turn:number; known:ConceptId[]; health:[number,number]; cells:Cell[]; waves:Pulse[]; status:'playing'|'won'|'lost';}
export interface Event {kind:'discovery'|'placement'|'flow'|'damage'|'growth'|'destroyed'|'storage'|'weather'|'outcome'; text:string; at?:Position; amount?:number; concept?:ConceptId;}
export interface FlowCell extends Position {incoming:number; absorbed:number; diverted:number; outgoing:number; stored:number;}
export interface Transition {state:State; events:Event[]; flow:FlowCell[]; damage:[number,number];}
export interface Annotation {objective?:string; expectedDamage?:[number,number]; expectedEffect?:string; confidence?:number;}
export interface Decision {turn:number; before:string; offers:string[]; action:Action; input?:'player'|'forecast'; annotation?:Annotation; events:Event[]; after:string; damage:[number,number];}
export interface Run {schema:1; id:string; build:string; data:string; scenario:string; seed:number; rules:string; player:string; condition:string; offerOrder?:'normal'|'reverse'; model?:string; observationVersion?:string; actionBudget?:number; decisions:Decision[]; outcome:State['status'];}

export function rng(seed:number):()=>number { let s=seed>>>0; return ()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/4294967296;}; }
export function createState(scenario='headwaters',seed=1,rules=DEFAULT()):State {
  const spec=SCENARIOS.find(s=>s.id===scenario); if(!spec)throw new Error('Unknown scenario');
  if(!RULES[rules])throw new Error('Unknown rules');
  if(!Number.isSafeInteger(seed)||seed<0||seed>4294967295)throw new Error('Seed must be a uint32');
  const random=rng(seed); const waves=spec.waves.map(p=>[...p] as Pulse);
  // The whole forecast is public. Seeds move one unit between adjacent pulses, keeping total rainfall fixed.
  for(let row=0;row<2;row++){const i=1+Math.floor(random()*(waves.length-3));const j=i+1;if(waves[i][row]>0&&random()<0.8){waves[i][row]--;waves[j][row]++;}}
  return {schema:1,build:BUILD_VERSION,data:DATA_VERSION,scenario,seed,rules,turn:0,known:[...BASE_CONCEPTS],health:[...spec.health],cells:Array.from({length:9},(_,i)=>({row:Math.floor(i/3),col:i%3,blocked:spec.blocked.includes(`${Math.floor(i/3)},${i%3}`),structure:null})),waves,status:'playing'};
}
function DEFAULT(){return DEFAULT_RULES;}
export function rulesOf(s:State):Rules {return RULES[s.rules];}
export function conceptFor(s:State,id:ConceptId){
  const concept=CONCEPTS[id];return id==='reeds'&&!rulesOf(s).rootedReeds?{...concept,capacity:2,description:'Absorb 1 per pulse; 2 in total.',detail:'These shallow reeds wash away after absorbing 2. A pulse of 4 or more also uproots them after absorption.'}:concept;
}
export function availableRecipes(s:State):Recipe[]{return RECIPES.filter(r=>r.inputs.every(i=>s.known.includes(i))&&!s.known.includes(r.output));}
export function cellAt(s:State,p:Position):Cell|undefined{return s.cells.find(c=>c.row===p.row&&c.col===p.col);}
export function pulseAt(s:State,turn=s.turn):Pulse{return [...(s.waves[turn-rulesOf(s).grace]??[0,0,0])] as Pulse;}
export function horizon(s:State):number{return s.waves.length+rulesOf(s).grace;}
export function isDeployable(id:ConceptId):boolean{return CONCEPTS[id].effect!=='ingredient';}
export function actionError(s:State,a:Action):string|null {
  if(s.status!=='playing')return 'The encounter has ended.';
  if(!a||typeof a!=='object')return 'Invalid action.';
  if(a.type==='wait')return null;
  let concept:ConceptId;
  if(a.type==='discover'){
    const recipe=availableRecipes(s).find(r=>r.id===a.recipe);if(!recipe)return 'That recipe is not currently available.';
    concept=recipe.output;
    if(!a.at)return null;
    if(!rulesOf(s).discoverPlaces)return 'This rules version separates discovery and placement.';
  }else if(a.type==='deploy'){
    if(!s.known.includes(a.concept))return 'That concept has not been established.';
    concept=a.concept;
  }else return 'Unknown action type.';
  if(!isDeployable(concept))return 'This concept is an ingredient, not a deployment.';
  const at=a.at;if(!at||!Number.isInteger(at.row)||!Number.isInteger(at.col))return 'Choose a bank.';
  const cell=cellAt(s,at);if(!cell||cell.blocked)return 'Bedrock: choose another bank.';
  return null;
}
export function legalActions(s:State):Action[]{
  if(s.status!=='playing')return [];
  const cells=s.cells.filter(c=>!c.blocked).map(({row,col})=>({row,col}));
  const actions:Action[]=[];
  for(const recipe of availableRecipes(s)){
    actions.push({type:'discover',recipe:recipe.id});
    if(rulesOf(s).discoverPlaces&&isDeployable(recipe.output))for(const at of cells)actions.push({type:'discover',recipe:recipe.id,at});
  }
  for(const concept of s.known.filter(isDeployable))for(const at of cells)actions.push({type:'deploy',concept,at});
  actions.push({type:'wait'});return actions;
}
export function step(s:State,a:Action):Transition {
  const error=actionError(s,a);if(error)throw new Error(error);
  const next=structuredClone(s);const events:Event[]=[];const bursts=new Map<string,number>();
  let concept:ConceptId|undefined;
  if(a.type==='discover'){
    concept=RECIPES.find(r=>r.id===a.recipe)!.output;next.known.push(concept);
    events.push({kind:'discovery',text:`Established ${CONCEPTS[concept].name}. It stays available.`,concept});
  }else if(a.type==='deploy')concept=a.concept;
  if(a.type!=='wait'&&a.at&&concept){
    const cell=cellAt(next,a.at)!;const def=CONCEPTS[concept];
    if(def.effect==='evaporate'){
      let budget=def.power;
      if(cell.structure?.concept==='basin'){
        const used=CONCEPTS.basin.capacity!-(cell.structure.remaining??0);const emptied=Math.min(budget,used);
        cell.structure.remaining!+=emptied;budget-=emptied;
        if(emptied)events.push({kind:'storage',text:`${def.name} emptied ${emptied} stored water.`,at:a.at,amount:emptied,concept});
      }
      bursts.set(`${a.at.row},${a.at.col}`,budget);
      events.push({kind:'placement',text:`${def.name} can evaporate ${budget} incoming water here this pulse.`,at:a.at,concept});
    }else{
      const replaced=cell.structure;
      const remaining=concept==='reeds'&&!rulesOf(next).rootedReeds?2:def.capacity??null;
      cell.structure={concept,remaining,age:0};
      events.push({kind:'placement',text:`Placed ${def.name}${replaced?` in place of ${CONCEPTS[replaced.concept].name}`:''}.`,at:a.at,concept});
    }
  }
  const pulse=pulseAt(next);const streams=pulse.slice();const flow:FlowCell[]=[];
  events.push({kind:'weather',text:next.turn<rulesOf(next).grace?'Preparation: the rain has not arrived.':`Rain arrives: north ${pulse[0]}, middle ${pulse[1]}, south ${pulse[2]}.`});
  for(let col=0;col<3;col++)for(let row=0;row<3;row++){
    const cell=cellAt(next,{row,col})!;const incoming=streams[row];let water=incoming;let absorbed=0,diverted=0,stored=0;
    const burst=bursts.get(`${row},${col}`)??0;if(burst){const n=Math.min(water,burst);water-=n;absorbed+=n;if(n)events.push({kind:'flow',text:`Evaporated ${n} water.`,at:{row,col},amount:n});}
    const obj=cell.structure;
    if(obj){const def=CONCEPTS[obj.concept];
      if(def.effect==='grow'&&obj.age===0){events.push({kind:'growth',text:'The grove takes root. It absorbs water from the next pulse.',at:{row,col},concept:obj.concept});}
      else if(def.effect==='absorb'||def.effect==='grow'){
        const n=Math.min(water,def.power,obj.remaining??Infinity);water-=n;absorbed+=n;if(obj.remaining!==null)obj.remaining-=n;
        if(n)events.push({kind:'flow',text:`${def.name} absorbed ${n}.`,at:{row,col},amount:n,concept:obj.concept});
      }else if(def.effect==='store'){
        const n=Math.min(water,obj.remaining??0);water-=n;stored=n;obj.remaining!-=n;
        if(n)events.push({kind:'storage',text:`Basin stored ${n}; ${obj.remaining} space remains.`,at:{row,col},amount:n,concept:obj.concept});
      }else if(def.effect==='divert'||def.effect==='drain'){
        const n=Math.min(water,def.power);water-=n;diverted=n;
        if(def.effect==='divert'&&row<2)streams[row+1]+=n;
        if(n)events.push({kind:'flow',text:`${def.name} sent ${n} ${def.effect==='drain'||row===2?'to sea':'south'}.`,at:{row,col},amount:n,concept:obj.concept});
      }
      const uprooted=(obj.concept==='reeds'&&incoming>=4)||(obj.concept==='grove'&&obj.age>0&&incoming>=5)||(obj.concept==='levee'&&incoming>=5);
      const exhausted=obj.remaining===0&&def.effect!=='store';
      if(uprooted||exhausted){cell.structure=null;events.push({kind:'destroyed',text:`${def.name} ${uprooted?'was overwhelmed':'washed away'}. The concept stays known.`,at:{row,col},concept:obj.concept});}
      else obj.age++;
    }
    streams[row]=water;flow.push({row,col,incoming,absorbed,diverted,outgoing:water,stored});
  }
  const damage:[number,number]=[streams[0],streams[1]];
  for(let row=0;row<2;row++)if(damage[row]){next.health[row]-=damage[row];events.push({kind:'damage',text:`${SCENARIOS.find(x=>x.id===s.scenario)!.assetNames[row]} took ${damage[row]} flood damage.`,amount:damage[row]});}
  next.turn++;
  if(next.health.some(h=>h<=0)){next.status='lost';events.push({kind:'outcome',text:'A bank gave way. Branch from an earlier decision or try a different plan.'});}
  else if(next.turn>=horizon(next)){next.status='won';events.push({kind:'outcome',text:'The rain passes. Both places are standing.'});}
  return {state:next,events,flow,damage};
}
export function preview(s:State,a:Action={type:'wait'}):Transition{return step(s,a);}
/** Optional UI convenience. Every remaining pulse still resolves and is recorded. */
export function settledForecast(s:State):{settled:boolean;pulses:number;damage:[number,number]} {
  let t=s;let pulses=0;const damage:[number,number]=[0,0];
  while(t.status==='playing'){const next=step(t,{type:'wait'});damage[0]+=next.damage[0];damage[1]+=next.damage[1];t=next.state;pulses++;}
  return {settled:s.status==='playing'&&t.status==='won'&&damage[0]===0&&damage[1]===0,pulses,damage};
}
export function stateHash(s:State):string {const json=JSON.stringify(s);let h=2166136261;for(let i=0;i<json.length;i++){h^=json.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');}
export function newRun(s:State,player='human',condition='browser'):Run{return {schema:1,id:`${s.rules}-${s.scenario}-${s.seed}-${player}`,build:s.build,data:s.data,scenario:s.scenario,seed:s.seed,rules:s.rules,player,condition,offerOrder:'normal',observationVersion:'public-1',actionBudget:horizon(s),decisions:[],outcome:s.status};}
export function record(s:State,run:Run,a:Action,annotation?:Annotation,input:'player'|'forecast'='player'):{state:State;run:Run;transition:Transition}{
  const result=step(s,a);const offers=availableRecipes(s).map(r=>r.id);if(run.offerOrder==='reverse')offers.reverse();const decision:Decision={turn:s.turn,before:stateHash(s),offers,action:structuredClone(a),input,...(annotation?{annotation}:{}),events:result.events,after:stateHash(result.state),damage:result.damage};
  return {state:result.state,run:{...run,decisions:[...run.decisions,decision],outcome:result.state.status},transition:result};
}
export function replay(run:Run,until=run.decisions.length):State {
  if(run.schema!==1||run.build!==BUILD_VERSION||run.data!==DATA_VERSION)throw new Error('Replay version does not match this build.');
  if(!Array.isArray(run.decisions)||run.decisions.length>100)throw new Error('Invalid replay length.');
  if(!Number.isInteger(until)||until<0||until>run.decisions.length)throw new Error('Invalid replay position.');
  let s=createState(run.scenario,run.seed,run.rules);
  for(const d of run.decisions.slice(0,until)){
    if(d.input!==undefined&&!['player','forecast'].includes(d.input))throw new Error('Unknown replay input source.');
    if(d.input==='forecast'&&d.action.type!=='wait')throw new Error('Forecast resolution can only wait.');
    if(d.input==='forecast'&&!settledForecast(s).settled)throw new Error('Forecast resolution started before the remaining storm was safe.');
    if(d.turn!==s.turn)throw new Error('Replay turn index does not match.');
    if(d.before!==stateHash(s))throw new Error(`Replay diverged before turn ${s.turn}.`);
    const offers=availableRecipes(s).map(r=>r.id);if(run.offerOrder==='reverse')offers.reverse();
    if(JSON.stringify(d.offers)!==JSON.stringify(offers))throw new Error('Replay offers do not match.');
    const result=step(s,d.action);if(d.after!==stateHash(result.state))throw new Error(`Replay diverged after turn ${s.turn}.`);
    if(JSON.stringify(d.damage)!==JSON.stringify(result.damage)||JSON.stringify(d.events)!==JSON.stringify(result.events))throw new Error('Replay response does not match.');
    s=result.state;
  }if(until>=run.decisions.length&&run.outcome!==s.status)throw new Error('Replay outcome does not match.');return s;
}
export function branch(run:Run,turn:number):{state:State;run:Run}{
  if(!Number.isInteger(turn)||turn<0||turn>run.decisions.length)throw new Error('Invalid branch point.');
  const state=replay(run,turn);return {state,run:{...run,id:`${run.id}-branch-${turn}`,decisions:run.decisions.slice(0,turn),outcome:state.status}};
}
export function actionLabel(a:Action):string {
  if(a.type==='wait')return 'Let the water move';
  const name=a.type==='discover'?CONCEPTS[RECIPES.find(r=>r.id===a.recipe)!.output].name:CONCEPTS[a.concept].name;
  return `${a.type==='discover'?'Invent':'Place'} ${name}${a.at?` at ${['north','middle','south'][a.at.row]} ${a.at.col+1}`:''}`;
}
/** Public observations only. Future weather is intentionally public in the UI too. */
export function observe(s:State){const spec=SCENARIOS.find(x=>x.id===s.scenario)!;return {rules:RULES[s.rules],scenario:{id:spec.id,title:spec.title,description:spec.description,lesson:spec.lesson,assetNames:spec.assetNames},turn:s.turn,totalTurns:horizon(s),known:s.known.map(id=>conceptFor(s,id)),offers:availableRecipes(s).map(r=>({...r,result:conceptFor(s,r.output)})),health:s.health,cells:s.cells,forecast:s.waves.map((pulse,i)=>({turn:i+rulesOf(s).grace,pulse})),nextPulse:pulseAt(s),ifWait:s.status==='playing'?preview(s).damage:null,status:s.status,legalActions:legalActions(s)};}
