import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { MATERIALS_RECIPES, MATERIALS_MAPS } from './working-materials-content.ts';
import { createWorkingMaterials, stepWorkingMaterials, selectWorkingMaterials, observeWorkingMaterials, workingMaterialsGoals, workingMaterialsWorld, previewWorkingMaterials, replayWorkingMaterials } from './logical-working-materials.ts';
import type { Action, Assembly, CreateOptions, State, Part } from './working-materials-types.ts';
const digest=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const allParts=(p:Part):Part[]=>[p,...p.children.flatMap(c=>allParts(c.part))];
export interface Witness { name:string; options:CreateOptions; actions:({type:'select';map:string}|Action)[]; state:State; checkpoints:unknown[]; transitions:{index:number;action:Action;beforeHash:string;afterHash:string;previewExact:boolean;response:string[];goals:{map:string;id:string;current:boolean;satisfied:boolean;achieved:boolean}[]}[] }
export function materialsWitness(name='ordinary',options:CreateOptions={},order=MATERIALS_MAPS.map(m=>m.id),reuseFrom?:State):Witness {
 let s=createWorkingMaterials(options);const actions:Witness['actions']=[],checkpoints:unknown[]=[],transitions:Witness['transitions']=[];
 const run=(a:Action)=>{const beforeHash=digest(s);const expected=previewWorkingMaterials(s,a);const next=stepWorkingMaterials(s,a);if(JSON.stringify(expected.state)!==JSON.stringify(next))throw Error('Preview mismatch');if(!next.accepted)throw Error(`${s.map} ${JSON.stringify(a)}: ${next.response.join('; ')}`);s=next;actions.push(a);transitions.push({index:s.interventions,action:structuredClone(a),beforeHash,afterHash:digest(s),previewExact:true,response:structuredClone(s.response),goals:workingMaterialsGoals(s).map(g=>({map:s.map,id:g.id,current:g.current,satisfied:g.satisfied,achieved:g.achieved}))});return s.boards.find(b=>b.id===s.map)!.objects;};
 const learn=(id:string):void=>{if(s.known.includes(id))return;const r=MATERIALS_RECIPES.find(r=>r.result===id);if(!r)throw Error(`Cannot learn ${id}`);learn(r.a);learn(r.b);run({type:'combine',a:r.a,b:r.b});};
 const place=(id:string,p:string)=>{let r:typeof MATERIALS_RECIPES[number]|undefined;if(!s.known.includes(id)){r=MATERIALS_RECIPES.find(r=>r.result===id);if(!r)throw Error(`Cannot build unknown material ${id} without its real context`);learn(r.a);learn(r.b);}const before=new Set(s.boards.find(b=>b.id===s.map)!.objects.map(o=>o.id));if(r)run({type:'combine',a:r.a,b:r.b,context:{at:p}});else run({type:'combine',a:id,b:`place:${p}`});return s.boards.find(b=>b.id===s.map)!.objects.find(o=>!before.has(o.id))!.id;};
 const obj=(id:string)=>s.boards.find(b=>b.id===s.map)!.objects.find(o=>o.id===id)!;
 const add=(id:string,concept:string,operation?:'inside'|'outside')=>{learn(concept);run({type:'combine',a:id,b:concept,...(operation?{context:{operation}}:{})});return id;};
 const join=(a:string,b:string,channel:'power'|'water'|'light')=>run({type:'combine',a,b,context:{operation:'connect',channel}});
 const self=(id:string,operation:'fold'|'close'|'aim',direction?:'west'|'east')=>run({type:'combine',a:id,b:id,context:{operation,...(direction?{direction}:{})}});
 const event=(id:string,p:string,operation:'observe'|'transmit'|'sample'|'span')=>run({type:'combine',a:id,b:`place:${p}`,context:{operation}});
 const transform=(a:string,b:string,recipe?:string,part?:string,toolPart?:string)=>{const before=new Set(s.boards.find(b=>b.id===s.map)!.objects.map(o=>o.id));run({type:'combine',a,b,context:{operation:'transform',...(recipe?{recipe}:{}),...(part?{part}:{}),...(toolPart?{toolPart}:{})}});return s.boards.find(b=>b.id===s.map)!.objects.find(o=>o.id===a||!before.has(o.id))!.id;};
 const ensureMaterial=(id:string,waterPlace:string,heatPlace=waterPlace):string|undefined=>{if(s.known.includes(id))return;if(id==='soft-clay')return transform('clay',`place:${waterPlace}`,'wet-clay');if(id==='clear-cast'){const heat=place('solar-heater',heatPlace);return transform('sand',heat,'fuse');}if(id==='pulp')return transform('fiber',`place:${waterPlace}`,'pulp');if(id==='record-sheet'){const pulp=ensureMaterial('pulp',waterPlace)??place('pulp',waterPlace);return transform(pulp,'mesh','sheet');}throw Error(`Missing explicit contextual learning plan for ${id}`);};
 const fit=(id:string,p:string,part?:string)=>run({type:'combine',a:id,b:`place:${p}`,context:{operation:'fit',...(part?{part}:{})}});
 const initial=(key:string)=>s.boards.find(b=>b.id===s.map)!.objects.find(o=>o.initialKey===key||o.members?.some(m=>m.initialKey===key))!.id;
 const materialPart=(id:string,label?:string)=>allParts(obj(id).root).find(p=>p.kind==='material'&&(!label||p.label===label))!.id;
 const move=(id:string,p:string,at?:string)=>run({type:'combine',a:id,b:`place:${p}`,...(at?{context:{at}}:{})});
 const donor=(map:string,p:string,predicate:(o:Assembly)=>boolean=()=>true)=>reuseFrom?.boards.find(b=>b.id===map)?.objects.find(o=>o.place===p&&s.designs.some(d=>d.id===o.design)&&predicate(o));
 const reuse=(p:string,fromPlace=p):string|undefined=>{const donor=reuseFrom?.boards.find(b=>b.id===s.map)?.objects.find(o=>o.place===fromPlace&&s.designs.some(d=>d.id===o.design));return donor?place(donor.design,p):undefined;};
 const lightGarden=(p:string)=>reuse(p)??add(place('greenhouse',p),'lamp');
 const waterSource=(p:string)=>{const id=reuse(p);if(id)return id;return add(place('solar-heater',p),'tube');};
 const dualPower=(target:string,eastPlace:string,westPlace=eastPlace)=>{const eastDonor=donor(s.map,eastPlace,o=>o.root.facing==='east'&&allParts(o.root).some(p=>p.kind==='solar-cell'));const westDonor=donor(s.map,westPlace,o=>o.root.facing==='west'&&allParts(o.root).some(p=>p.kind==='solar-cell'));const east=place(eastDonor?.design??'solar-lead',eastPlace),west=place(westDonor?.design??'solar-lead',westPlace);if(!westDonor)self(west,'aim','west');join(east,target,'power');join(west,target,'power');};
 const mobileCamera=(p:string)=>{const saved=reuse(p,'alcove');if(saved)return saved;const id=place('clear-shell',p);add(id,'camera','inside');add(id,'wheels');return id;};
 for(const map of order){s=selectWorkingMaterials(s,map);actions.push({type:'select',map});
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
  } else if(map==='optics'){
   const instrumentDonor=donor('optics','wet-station');
   const heater=instrumentDonor||s.known.includes('clear-cast')?undefined:place('solar-heater','survey-window');
   const cast=instrumentDonor?place(instrumentDonor.design,'survey-window'):s.known.includes('clear-cast')?place('clear-cast','survey-window'):transform('sand',heater!,'fuse');
   if(!instrumentDonor)add(cast,'frame');run({type:'combine',a:cast,b:initial('survey-camera'),context:{operation:'inside'}});event(cast,'beacon','observe');
   if(!instrumentDonor){add(cast,'clear-film');add(cast,'wheels');}move(cast,'wet-station');
   const gardenDonor=donor('optics','shade-bed',o=>allParts(o.root).some(p=>p.kind==='seed'));
   const garden=place(gardenDonor?.design??'greenhouse','shade-bed');
   if(!gardenDonor){if(!s.known.includes('diffuser')){const diffuser=transform(place('clear-cast','shade-bed'),'mesh','frost');run({type:'combine',a:garden,b:diffuser});}else add(garden,'diffuser');}
   const reflectorDonor=donor('optics','mirror-perch');const reflector=place(reflectorDonor?.design??'reflective-shell','mirror-perch');if(!reflectorDonor)self(reflector,'aim','west');join(reflector,garden,'light');
  } else if(map==='forms'){
   const clay=initial('original-clay');transform(clay,'place:spring','wet-clay');const carriage=donor('arch','gap-east',o=>allParts(o.root).some(p=>p.kind==='wheels'));add(clay,carriage?.design??'cart');move(clay,'opening');transform(clay,'place:opening','take-form');fit(clay,'opening',materialPart(clay));
   const heater=place('solar-heater','opening');transform(clay,heater,'fire',materialPart(clay));move(clay,'drain');fit(clay,'drain',materialPart(clay));
   const shapedDesign=obj(clay).design;
   const basinDonor=donor('forms','basin');const basin=place(basinDonor?.design??shapedDesign,'basin');if(!basinDonor)transform(basin,'clear-film','line',materialPart(basin));fit(basin,'basin',materialPart(basin));
   const drain=place(shapedDesign,'drain');fit(drain,'drain',materialPart(drain));
   if(!carriage)add(clay,'hinge');self(clay,'fold');run({type:'combine',a:clay,b:'place:collection',context:{via:['low-mouth','low-exit']}});
   const sheetDonor=donor('forms','paper-slot'),master=initial('mesh-master');let sheetDesign=sheetDonor?.design;if(!sheetDesign){if(!s.known.includes('pulp'))transform('fiber','place:spring','pulp');const pulp=place('pulp','casting-bay');transform(pulp,master,'sheet');sheetDesign=obj(pulp).design;}const fittedSheet=place(sheetDesign,'paper-slot');fit(fittedSheet,'paper-slot',materialPart(fittedSheet));add(master,'cart');move(master,'tool-rack');
  } else if(map==='archive'){
   ensureMaterial('record-sheet','bench');ensureMaterial('soft-clay','bench');
   const a=initial('archive-a'),b=initial('archive-b');
   const openDonor=donor('archive','press');const wet=place(openDonor?.design??'record-sheet','vault-a');transform(wet,a,'impress');transform(wet,'clear-film','laminate',materialPart(wet));if(!openDonor)add(wet,'cart');move(wet,'wet-exhibit');add(wet,'lens');event(wet,'receiver','transmit');
   const open=place(openDonor?.design??'record-sheet','vault-a');transform(open,a,'impress');if(!openDonor)add(open,'cart');move(open,'press');
   const blank=initial('blank-support'),mobileCameraDonor=donor('return','dock');if(mobileCameraDonor)add(blank,mobileCameraDonor.design);add(b,'lens');run({type:'combine',a:b,b:blank,context:{operation:'transmit'}});if(!mobileCameraDonor)add(blank,'lens');event(blank,'receiver','transmit');if(!mobileCameraDonor)add(blank,'cart');move(blank,'registry');
   const relief=place('soft-clay','relief');transform(relief,'place:relief','take-form');fit(relief,'relief',materialPart(relief));const heater=place('solar-heater','relief');transform(relief,heater,'fire');transform(relief,'clear-film','line');add(relief,'cart');move(relief,'relief-display');
  } else if(map==='outpost'){
   ensureMaterial('clear-cast','dirty-spring','opening');ensureMaterial('soft-clay','dirty-spring','opening');
   const nurseryDonor=donor('outpost','bed');let nursery=initial('nursery');if(nurseryDonor){const host=place(nurseryDonor.design,'opening');run({type:'combine',a:host,b:nursery,context:{operation:'inside'}});nursery=host;}else add(nursery,'wheels');move(nursery,'bed');if(!nurseryDonor){add(nursery,'clear-cast');add(nursery,'camera','inside');add(nursery,'lamp');}dualPower(nursery,'ridge');
   const source=place('tube','dirty-spring'),filter=place('filtered-passage','filter-pad');join(source,filter,'water');join(filter,nursery,'water');
   const specimen=place('sample-tray','table');event(specimen,'table','sample');event(nursery,'lookout','observe');
   const original=initial('original-survey');add(original,'lens');run({type:'combine',a:original,b:nursery,context:{operation:'transmit'}});event(nursery,'receiver','transmit');
   const carrier=place('soft-clay','opening');transform(carrier,'place:opening','take-form');fit(carrier,'opening',materialPart(carrier));const heater=place('solar-heater','opening');transform(carrier,heater,'fire');const carrierDonor=donor('outpost','arrival');add(carrier,carrierDonor?.design??'camera');run({type:'combine',a:original,b:carrier,context:{operation:'transmit'}});if(!carrierDonor){add(carrier,'cart');add(carrier,'hinge');}self(carrier,'fold');run({type:'combine',a:carrier,b:'place:arrival',context:{via:['low-west','low-east']}});
  }
  const goals=workingMaterialsGoals(s);checkpoints.push({map,interventions:s.interventions,goals,objects:s.boards.find(b=>b.id===map)!.objects.map(o=>({id:o.id,design:o.design,place:o.place}))});if(!goals.every(g=>g.satisfied))throw Error(`${map} incomplete: ${JSON.stringify(goals)}`);
 }
 if(JSON.stringify(replayWorkingMaterials(actions,options))!==JSON.stringify(s))throw Error('Witness replay mismatch');
 return {name,options,actions,state:s,checkpoints,transitions};
}

export function materialsUniversalAttack() {
 let s=createWorkingMaterials({catalogue:'complete'});const actions:unknown[]=[],exposures:unknown[]=[];
 const apply=(a:Action)=>{const next=stepWorkingMaterials(s,a);actions.push({action:a,accepted:next.accepted,response:next.response});if(next.accepted)s=next;return next;};
 const place=(design:string)=>{const ids=new Set(s.boards[0].objects.map(o=>o.id));apply({type:'combine',a:design,b:'place:camp'});return s.boards[0].objects.find(o=>!ids.has(o.id))!.id;};
 const add=(a:string,b:string,operation?:'inside'|'outside')=>apply({type:'combine',a,b,...(operation?{context:{operation}}:{})});
 const observatory=place('greenhouse');add(observatory,'clear-cast');add(observatory,'camera','inside');add(observatory,'solar-lamp','outside');
 const diffuseGarden=place('greenhouse');add(diffuseGarden,'diffuser');
 const prefab=place('cart');add(prefab,observatory);add(prefab,diffuseGarden);
 for(const p of ['solar-heater','tube','hinge','record-sheet','fired-form','foil'])add(prefab,p,'outside');
 const west=place('solar-lead');apply({type:'combine',a:west,b:west,context:{operation:'aim',direction:'west'}});add(prefab,west,'outside');
 apply({type:'combine',a:prefab,b:prefab,context:{operation:'fold'}});
 const universal=s.boards[0].objects.find(o=>o.id===prefab)!.design;const firstSuccess:Record<string,number>={};
 for(const map of MATERIALS_MAPS){s=selectWorkingMaterials(s,map.id);actions.push({select:map.id});for(const p of map.places){const result=apply({type:'combine',a:universal,b:`place:${p.id}`});const goals=workingMaterialsGoals(s);for(const g of goals)if(g.satisfied&&firstSuccess[`${map.id}/${g.id}`]===undefined)firstSuccess[`${map.id}/${g.id}`]=s.interventions;exposures.push({map:map.id,place:p.id,accepted:result.accepted,interventions:s.interventions,goals:goals.map(g=>({id:g.id,current:g.current,satisfied:g.satisfied,achieved:g.achieved,checks:g.checks}))});}}
 return {evidence:'Privileged two-facet universal-prefab placement policy: separate clear observatory and diffuse garden, dual-direction panels, mobility and material surfaces. Copies at every anchor but no fitted external links, actual identity transfer, new optical events, impressions or fits. This one failed policy is NOT an impossibility proof; full successful whole-assembly carryover witness is the stronger reuse result.',universal,actions,exposures,firstSuccess,finalInterventions:s.interventions,goals:s.boards.flatMap(b=>workingMaterialsGoals(s,b.id)),state:s};
}

export function materialsBuildAllAttack() {
 let s=createWorkingMaterials({catalogue:'complete'});const actions:unknown[]=[];const firstSuccess:Record<string,number>={};const snapshots:unknown[]=[];
 const apply=(a:Action)=>{const next=stepWorkingMaterials(s,a);actions.push({action:a,accepted:next.accepted,response:next.response});if(next.accepted)s=next;for(const g of workingMaterialsGoals(s))if(g.achieved&&firstSuccess[`${s.map}/${g.id}`]===undefined)firstSuccess[`${s.map}/${g.id}`]=s.interventions;};
 const targets:Record<string,string>={landing:'bed',ice:'bed',twin:'bed',arch:'destination',dust:'bed',return:'junction',optics:'shade-bed',forms:'drain',archive:'wet-exhibit',outpost:'bed'};
 const designs=[...s.known];for(const map of MATERIALS_MAPS){s=selectWorkingMaterials(s,map.id);actions.push({select:map.id});for(const design of designs)apply({type:'combine',a:design,b:`place:${targets[map.id]}`});snapshots.push({map:map.id,interventions:s.interventions,goals:workingMaterialsGoals(s),world:workingMaterialsWorld(s)});}
 return {evidence:'Start with every assembly and transformed capability known, then copy each once at a fixed focal anchor on each map. Explicit deliberately goal-insensitive policy, not all placements or an impossibility proof. No interfaces, observed records, material impression/fit/copy events or site contacts are invented by copying.',actions,firstSuccess,snapshots,finalInterventions:s.interventions,state:s};
}

export function materialsSaturationAttack(witness:Witness) {
 let s=selectWorkingMaterials(witness.state,'landing');const garden=s.boards.find(b=>b.id==='landing')!.objects.find(o=>o.place==='bed')!;const before={goals:workingMaterialsGoals(s),world:workingMaterialsWorld(s)};
 s=stepWorkingMaterials(s,{type:'combine',a:garden.id,b:'foil'});return {evidence:'One explicit counterexample to monotone add-everything success; not proof all saturation policies fail.',action:{type:'combine',a:garden.id,b:'foil'},accepted:s.accepted,before,after:{goals:workingMaterialsGoals(s),world:workingMaterialsWorld(s)},state:s};
}

export function materialsPropertyCuts(witness:Witness) {
 const cases:{name:string;reason:string;expectedCurrentFailures:string[];verified:true;before:unknown;after:unknown;state:State}[]=[];
 const cut=(name:string,map:string,reason:string,mutate:(s:State)=>void)=>{const expectedCurrentFailures:Record<string,string[]>={'live-source-cut':['garden'],'diffuse-property-cut':['diffuse-growth'],'form-contact-cut':['open-and-lined'],'actual-copy-event-cut':['weatherproof-copy','open-copy'],'porous-filter-cut':['wet-and-dry']};const expected=expectedCurrentFailures[name]!;const before=selectWorkingMaterials(witness.state,map),after=structuredClone(before);mutate(after);after.status=after.boards.every(b=>workingMaterialsGoals(after,b.id).every(g=>g.satisfied))?'complete':'playing';if(expected.some(id=>!workingMaterialsGoals(before).find(g=>g.id===id)?.current||workingMaterialsGoals(after).find(g=>g.id===id)?.current))throw Error(`${name} did not make exactly the claimed current service fail`);cases.push({name,reason,expectedCurrentFailures:expected,verified:true,before:{goals:workingMaterialsGoals(before),world:workingMaterialsWorld(before)},after:{goals:workingMaterialsGoals(after),world:workingMaterialsWorld(after)},state:after});};
 cut('live-source-cut','landing','Remove actual solar-cell leaves while retaining every label, learned design and prior goal achievement. Historical provenance is not a live source.',s=>{for(const o of s.boards.find(b=>b.id===s.map)!.objects)for(const p of allParts(o.root))if(p.kind==='solar-cell'){p.kind='sand';p.label='cut-source';}});
 cut('diffuse-property-cut','optics','Change only active diffuser optical property to clear while retaining object labels, water interfaces, power/light source and growth. The diffuse purpose must fail, not the ordinary growing capability.',s=>{for(const o of s.boards.find(b=>b.id===s.map)!.objects.filter(o=>o.place==='shade-bed'))for(const p of allParts(o.root))if(p.surface?.optical==='diffuse')p.surface.optical='clear';});
 cut('form-contact-cut','forms','Change only the drain surface contact edges; copied names, rigidity, earlier fit record and other map work remain. Current matching-profile service must fail.',s=>{for(const o of s.boards.find(b=>b.id===s.map)!.objects.filter(o=>o.place==='drain'))for(const p of allParts(o.root))if(p.kind==='material'&&p.form)p.form.edges=['south','west'];});
 cut('actual-copy-event-cut','archive','Remove actual material copy events but leave surface traits, names, optical record list and received historical messages. Actual physical-copy goals must fail; a label or received original cannot replace a local event.',s=>{for(const o of s.boards.find(b=>b.id===s.map)!.objects.filter(o=>['press','wet-exhibit'].includes(o.place)))for(const p of allParts(o.root))p.events=(p.events??[]).filter(e=>e.kind!=='copy');});
 cut('porous-filter-cut','outpost','Change the actual filter mesh surface permeability to watertight while retaining its mesh label and history. The property-qualified outgoing porous service must fail.',s=>{for(const o of s.boards.find(b=>b.id===s.map)!.objects.filter(o=>o.place==='filter-pad'))for(const p of allParts(o.root))if(p.surface?.permeability==='porous')p.surface.permeability='watertight';});
 return {evidence:'Privileged single-mechanism diagnostic state cuts, NOT legal gameplay actions or player evidence. These distinguish current predicates and live properties from historical achievements, labels and immutable provenance.',cases};
}

export function runMaterialsScreen(directory='results/working-materials-preplay'){
 const sourcePaths=['experiments/logical-working-materials.ts','experiments/working-materials-content.ts','experiments/working-materials-types.ts','experiments/working-materials-transformations.ts','experiments/working-materials-screen.ts'];
 const sourceHashes=()=>Object.fromEntries(sourcePaths.map(p=>[p,createHash('sha256').update(readFileSync(p)).digest('hex')]));const hashes=sourceHashes();
 mkdirSync(directory,{recursive:true});const ordinary=materialsWitness();const complete=materialsWitness('complete',{catalogue:'complete'});const carryover=materialsWitness('assembly-reuse',{catalogue:'complete',known:ordinary.state.known,designs:ordinary.state.designs},MATERIALS_MAPS.map(m=>m.id),ordinary.state);const alternate=materialsWitness('alternate-order',{},[...MATERIALS_MAPS.map(m=>m.id)].reverse());
 const universal=materialsUniversalAttack(),saturation=materialsSaturationAttack(ordinary),buildAll=materialsBuildAllAttack(),cuts=materialsPropertyCuts(ordinary);if(JSON.stringify(hashes)!==JSON.stringify(sourceHashes()))throw Error('Sources changed during full-screen execution; no mixed-source evidence written.');writeFileSync(`${directory}/property-cuts.json`,JSON.stringify(cuts,null,2)+'\n');writeFileSync(`${directory}/complete-catalogue-copy-all.json`,JSON.stringify(buildAll,null,2)+'\n');writeFileSync(`${directory}/universal-prefab.json`,JSON.stringify(universal,null,2)+'\n');writeFileSync(`${directory}/saturation.json`,JSON.stringify(saturation,null,2)+'\n');
 const witnesses=[ordinary,complete,carryover,alternate];for(const w of witnesses)writeFileSync(`${directory}/${w.name}.json`,JSON.stringify({evidence:'mechanical authored witness; not player or enjoyment evidence',hashes,...w,observation:observeWorkingMaterials(w.state)},null,2)+'\n');
 const summary={version:ordinary.state.version,hashes,evidence:'Mechanical full-campaign feasibility, best found upper bounds, not shortest proofs or fun findings.',witnesses:witnesses.map(w=>({name:w.name,interventions:w.state.interventions,ledger:w.state.ledger,satisfied:w.state.boards.flatMap(b=>workingMaterialsGoals(w.state,b.id)).filter(g=>g.satisfied).length, historicallyAchieved:w.state.boards.flatMap(b=>workingMaterialsGoals(w.state,b.id)).filter(g=>g.achieved).length, perMap:w.state.boards.map(b=>({map:b.id,interventions:w.transitions.filter(t=>t.goals[0]?.map===b.id).length,satisfied:workingMaterialsGoals(w.state,b.id).filter(g=>g.satisfied).length,current:workingMaterialsGoals(w.state,b.id).filter(g=>g.current).length})),status:w.state.status})),coverage:{changedRole:['Landing actual solar heater supplies released local water and electrical power to a distinct garden.', 'Arch actual cart spans a gap, then folds and travels intact while another frame keeps the crossing.','Forms actual clay is soft-impressed and fitted, fired without losing its event, and carried home while copied profiles maintain services.','Optics actual survey camera observes through its actual rigid clear boundary, then reaches wet station under a flexible boundary.','Archive has two genuine copies from one retained original: durable watertight public display versus exposed temporary contact copy.'],familiarEnactment:['The same greenhouse design encloses working roots on landing, ice, twin and dust boards.', 'One actual protected camera records the landmark from west-view, then east-view.'],evidence:'Trace/property coverage only; not player experience or proof every intervention was strategic.'},propertyCuts:cuts.cases.map(c=>({name:c.name,expectedCurrentFailures:c.expectedCurrentFailures,verified:c.verified})),attacks:{buildAll:{acceptedInterventions:buildAll.finalInterventions,firstSuccess:buildAll.firstSuccess},universal:{acceptedInterventions:universal.finalInterventions,firstSuccess:universal.firstSuccess,goalsAchieved:universal.goals.filter(g=>g.satisfied).length},saturation:{accepted:saturation.accepted,gardenCurrentAfter:saturation.after.goals.find(g=>g.id==='garden')?.current,previousAchievementRetained:saturation.after.goals.find(g=>g.id==='garden')?.achieved}},lengthFinding:'Actual measured fluent route; target is not an action gate. A shorter legal completion is retained.'};writeFileSync(`${directory}/summary.json`,JSON.stringify(summary,null,2)+'\n');return summary;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(runMaterialsScreen(process.argv[2]),null,2));
