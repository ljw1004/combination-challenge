import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { WORKSHOP_RECIPES, WORKSHOP_MAPS } from './mars-workshop-content.ts';
import { createMarsWorkshop, stepMarsWorkshop, selectMarsWorkshop, observeMarsWorkshop, marsWorkshopGoals, marsWorkshopWorld, previewMarsWorkshop, replayMarsWorkshop } from './logical-mars-workshop.ts';
import type { Action, Assembly, CreateOptions, State } from './mars-workshop-types.ts';
export interface Witness { name:string; options:CreateOptions; actions:({type:'select';map:string}|Action)[]; state:State; checkpoints:unknown[] }
export function workshopWitness(name='ordinary',options:CreateOptions={},order=WORKSHOP_MAPS.map(m=>m.id),reuseFrom?:State):Witness {
 let s=createMarsWorkshop(options);const actions:Witness['actions']=[],checkpoints:unknown[]=[];
 const run=(a:Action)=>{const expected=previewMarsWorkshop(s,a);const next=stepMarsWorkshop(s,a);if(JSON.stringify(expected.state)!==JSON.stringify(next))throw Error('Preview mismatch');if(!next.accepted)throw Error(`${s.map} ${JSON.stringify(a)}: ${next.response.join('; ')}`);s=next;actions.push(a);return s.boards.find(b=>b.id===s.map)!.objects;};
 const learn=(id:string):void=>{if(s.known.includes(id))return;const r=WORKSHOP_RECIPES.find(r=>r.result===id);if(!r)throw Error(`Cannot learn ${id}`);learn(r.a);learn(r.b);run({type:'combine',a:r.a,b:r.b});};
 const place=(id:string,p:string)=>{learn(id);const before=new Set(s.boards.find(b=>b.id===s.map)!.objects.map(o=>o.id));return run({type:'combine',a:id,b:`place:${p}`}).find(o=>!before.has(o.id))!.id;};
 const obj=(id:string)=>s.boards.find(b=>b.id===s.map)!.objects.find(o=>o.id===id)!;
 const add=(id:string,concept:string,operation?:'inside'|'outside')=>{learn(concept);run({type:'combine',a:id,b:concept,...(operation?{context:{operation}}:{})});return id;};
 const join=(a:string,b:string,channel:'power'|'water'|'light')=>run({type:'combine',a,b,context:{operation:'connect',channel}});
 const self=(id:string,operation:'fold'|'close'|'aim',direction?:'west'|'east')=>run({type:'combine',a:id,b:id,context:{operation,...(direction?{direction}:{})}});
 const event=(id:string,p:string,operation:'observe'|'transmit'|'sample'|'span')=>run({type:'combine',a:id,b:`place:${p}`,context:{operation}});
 const move=(id:string,p:string,at?:string)=>run({type:'combine',a:id,b:`place:${p}`,...(at?{context:{at}}:{})});
 const reuse=(p:string,fromPlace=p):string|undefined=>{const donor=reuseFrom?.boards.find(b=>b.id===s.map)?.objects.find(o=>o.place===fromPlace&&s.designs.some(d=>d.id===o.design));return donor?place(donor.design,p):undefined;};
 const lightGarden=(p:string)=>reuse(p)??add(place('greenhouse',p),'lamp');
 const waterSource=(p:string)=>{const id=reuse(p);if(id)return id;return add(place('solar-heater',p),'tube');};
 const dualPower=(target:string,eastPlace:string,westPlace=eastPlace)=>{const east=place('solar-lead',eastPlace),west=place('solar-lead',westPlace);self(west,'aim','west');join(east,target,'power');join(west,target,'power');};
 const mobileCamera=(p:string)=>{const saved=reuse(p,'alcove');if(saved)return saved;const id=place('clear-shell',p);add(id,'camera','inside');add(id,'wheels');return id;};
 for(const map of order){s=selectMarsWorkshop(s,map);actions.push({type:'select',map});
  if(map==='landing'){
   const garden=lightGarden('bed');const water=waterSource('ice');join(water,garden,'power');join(water,garden,'water');
   const camera=place('camera','signal-perch');event(camera,'bed','observe');event(camera,'receiver','transmit');
  } else if(map==='ice'){
   const garden=lightGarden('bed'),water=waterSource('clean-ice');join(water,garden,'power');join(water,garden,'water');
   const dry=place('sample-tray','table');event(dry,'table','sample');const dark=place('sample-case','alcove');event(dark,'alcove','sample');
  } else if(map==='twin'){
   const garden=lightGarden('bed');dualPower(garden,'east-ridge','west-ridge');const camera=mobileCamera('west-view');event(camera,'landmark','observe');move(camera,'east-view');event(camera,'landmark','observe');move(camera,'alcove');
  } else if(map==='arch'){
   const garden=s.boards.find(b=>b.id===map)!.objects.find(o=>o.initialKey==='garden')!.id;add(garden,'wheels');add(garden,'hinge');self(garden,'fold');move(garden,'destination');self(garden,'close');
   const carrier=place('cart','gap-west');add(carrier,'hinge');event(carrier,'gap-east','span');const spare=place('frame','gap-west');event(spare,'gap-east','span');self(carrier,'fold');run({type:'combine',a:carrier,b:'place:gap-east',context:{via:['lower-west','lower-east']}});
  } else if(map==='dust'){
   const warm=reuse('warm-room')??add(place('sample-case','warm-room'),'heater');dualPower(warm,'ridge');place('greenhouse','bed');place('sample-case','cool-room');
   const savedSample=reuse('specimen-site','sample-alcove');const sample=savedSample??place('sample-case','specimen-site');event(sample,'specimen-site','sample');if(!savedSample)add(sample,'wheels');move(sample,'sample-alcove');const camera=place('camera','window');event(camera,'landmark','observe');
  } else if(map==='return'){
   const originals=s.boards.find(b=>b.id===map)!.objects.filter(o=>o.initialKey?.startsWith('original-'));const relay=place('camera','junction');for(const o of originals){add(o.id,'lens');run({type:'combine',a:o.id,b:relay,context:{operation:'transmit'}});}event(relay,'receiver','transmit');
   const camera=s.boards.find(b=>b.id===map)!.objects.find(o=>o.initialKey==='stranded-camera')!.id;add(camera,'cart');move(camera,'dock');event(camera,'receiver','transmit');
  }
  const goals=marsWorkshopGoals(s);checkpoints.push({map,interventions:s.interventions,goals,objects:s.boards.find(b=>b.id===map)!.objects.map(o=>({id:o.id,design:o.design,place:o.place}))});if(!goals.every(g=>g.achieved))throw Error(`${map} incomplete: ${JSON.stringify(goals)}`);
 }
 if(JSON.stringify(replayMarsWorkshop(actions,options))!==JSON.stringify(s))throw Error('Witness replay mismatch');
 return {name,options,actions,state:s,checkpoints};
}

export function workshopUniversalAttack() {
 let s=createMarsWorkshop({catalogue:'complete'});const actions:unknown[]=[];const exposures:unknown[]=[];
 const apply=(a:Action)=>{const before=s;const next=stepMarsWorkshop(s,a);actions.push({action:a,accepted:next.accepted,response:next.response});if(next.accepted)s=next;return {before,next};};
 apply({type:'combine',a:'greenhouse',b:'solar-lamp'});let prefab=s.boards[0].objects.at(-1)!;
 for(const part of ['solar-heater','wheels','hinge','tube'])apply({type:'combine',a:prefab.id,b:part});
 const litWarmCart=s.boards[0].objects.find(o=>o.id===prefab.id)!.design;
 for(const part of ['camera','sample-tray'])apply({type:'combine',a:prefab.id,b:part,context:{operation:'inside'}});
 const universal=s.boards[0].objects.find(o=>o.id===prefab.id)!.design;const firstSuccess:Record<string,number>={};
 for(const map of WORKSHOP_MAPS){s=selectMarsWorkshop(s,map.id);actions.push({select:map.id});for(const p of map.places){const result=apply({type:'combine',a:universal,b:`place:${p.id}`});const goals=marsWorkshopGoals(s);for(const g of goals)if(g.achieved&&firstSuccess[`${map.id}/${g.id}`]===undefined)firstSuccess[`${map.id}/${g.id}`]=s.interventions;exposures.push({map:map.id,place:p.id,accepted:result.next.accepted,interventions:s.interventions,goals:goals.map(g=>({id:g.id,current:g.current,achieved:g.achieved,checks:g.checks}))});}}
 return {evidence:'Privileged universal-prefab placement attack, not a player or exhaustive impossibility proof.',litWarmCart,universal,actions,exposures,firstSuccess,finalInterventions:s.interventions,goals:s.boards.flatMap(b=>marsWorkshopGoals(s,b.id)),state:s};
}
export function workshopBuildAllAttack() {
 let s=createMarsWorkshop();const actions:unknown[]=[];const firstSuccess:Record<string,number>={};const snapshots:unknown[]=[];
 const apply=(a:Action)=>{const next=stepMarsWorkshop(s,a);actions.push({action:a,accepted:next.accepted,response:next.response});if(next.accepted)s=next;for(const g of marsWorkshopGoals(s))if(g.achieved&&firstSuccess[`${s.map}/${g.id}`]===undefined)firstSuccess[`${s.map}/${g.id}`]=s.interventions;};
 for(const r of WORKSHOP_RECIPES)if(!s.known.includes(r.result))apply({type:'combine',a:r.a,b:r.b});
 const targets:Record<string,string>={landing:'bed',ice:'bed',twin:'bed',arch:'destination',dust:'bed',return:'junction'};
 const designs=[...s.known];for(const map of WORKSHOP_MAPS){s=selectMarsWorkshop(s,map.id);actions.push({select:map.id});for(const design of designs)apply({type:'combine',a:design,b:`place:${targets[map.id]}`});snapshots.push({map:map.id,interventions:s.interventions,goals:marsWorkshopGoals(s),world:marsWorkshopWorld(s)});}
 return {evidence:'Build every canonical design, then copy each once at a fixed focal anchor on each map. Explicit deliberately goal-insensitive policy, not all placements or an impossibility proof. No interfaces, observed records or site contacts are invented by copying.',actions,firstSuccess,snapshots,finalInterventions:s.interventions,state:s};
}

export function workshopSaturationAttack(witness:Witness) {
 let s=selectMarsWorkshop(witness.state,'landing');const garden=s.boards.find(b=>b.id==='landing')!.objects.find(o=>o.place==='bed')!;const before={goals:marsWorkshopGoals(s),world:marsWorkshopWorld(s)};
 s=stepMarsWorkshop(s,{type:'combine',a:garden.id,b:'foil'});return {evidence:'One explicit counterexample to monotone add-everything success; not proof all saturation policies fail.',action:{type:'combine',a:garden.id,b:'foil'},accepted:s.accepted,before,after:{goals:marsWorkshopGoals(s),world:marsWorkshopWorld(s)},state:s};
}

export function runWorkshopScreen(directory='results/mars-workshop-preplay'){
 mkdirSync(directory,{recursive:true});const ordinary=workshopWitness();const complete=workshopWitness('complete',{catalogue:'complete'});const carryover=workshopWitness('assembly-reuse',{catalogue:'complete',known:ordinary.state.known,designs:ordinary.state.designs},WORKSHOP_MAPS.map(m=>m.id),ordinary.state);const alternate=workshopWitness('alternate-order',{},[...WORKSHOP_MAPS.map(m=>m.id)].reverse());
 const hashes=Object.fromEntries(['experiments/logical-mars-workshop.ts','experiments/mars-workshop-content.ts','experiments/mars-workshop-types.ts','experiments/mars-workshop-screen.ts'].map(p=>[p,createHash('sha256').update(readFileSync(p)).digest('hex')]));
 const universal=workshopUniversalAttack(),saturation=workshopSaturationAttack(ordinary),buildAll=workshopBuildAllAttack();writeFileSync(`${directory}/build-all-copy-all.json`,JSON.stringify(buildAll,null,2)+'\n');writeFileSync(`${directory}/universal-prefab.json`,JSON.stringify(universal,null,2)+'\n');writeFileSync(`${directory}/saturation.json`,JSON.stringify(saturation,null,2)+'\n');
 const witnesses=[ordinary,complete,carryover,alternate];for(const w of witnesses)writeFileSync(`${directory}/${w.name}.json`,JSON.stringify({evidence:'mechanical authored witness; not player or enjoyment evidence',hashes,...w,observation:observeMarsWorkshop(w.state)},null,2)+'\n');
 const summary={version:ordinary.state.version,hashes,evidence:'Mechanical full-campaign feasibility, best found upper bounds, not shortest proofs or fun findings.',witnesses:witnesses.map(w=>({name:w.name,interventions:w.state.interventions,ledger:w.state.ledger,achieved:w.state.boards.flatMap(b=>marsWorkshopGoals(w.state,b.id)).filter(g=>g.achieved).length,status:w.state.status})),coverage:{changedRole:['Landing actual solar heater supplies released local water and electrical power to a distinct garden.', 'Arch actual cart spans a gap, then folds and travels intact while another frame keeps the crossing.'],familiarEnactment:['The same greenhouse design encloses working roots on landing, ice, twin and dust boards.', 'One actual protected camera records the landmark from west-view, then east-view.'],evidence:'Trace/property coverage only; not player experience or proof every intervention was strategic.'},attacks:{buildAll:{acceptedInterventions:buildAll.finalInterventions,firstSuccess:buildAll.firstSuccess},universal:{acceptedInterventions:universal.finalInterventions,firstSuccess:universal.firstSuccess,goalsAchieved:universal.goals.filter(g=>g.achieved).length},saturation:{accepted:saturation.accepted,gardenCurrentAfter:saturation.after.goals.find(g=>g.id==='garden')?.current,previousAchievementRetained:saturation.after.goals.find(g=>g.id==='garden')?.achieved}},lengthFinding:'Actual measured fluent route; target is not an action gate. A shorter legal completion is retained.'};writeFileSync(`${directory}/summary.json`,JSON.stringify(summary,null,2)+'\n');return summary;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(runWorkshopScreen(process.argv[2]),null,2));
