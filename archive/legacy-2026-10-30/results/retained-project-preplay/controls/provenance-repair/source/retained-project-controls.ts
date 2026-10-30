import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {pathToFileURL} from 'node:url';
import * as E from './logical-retained-project.ts';
import {MATERIALS_RECIPES} from './retained-project-content.ts';
import type {Action,State,Part,CreateOptions} from './retained-project-types.ts';
const all=(p:Part):Part[]=>[p,...p.children.flatMap(c=>all(c.part))];
const hash=(x:unknown)=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
export function retainedProjectControl(options:CreateOptions={},savedUtility?:string){
 let s=E.createRetainedProject(options);const actions:Action[]=[],trace:unknown[]=[],boundaries:unknown[]=[];
 const board=()=>s.boards[0]!;const obj=(id:string)=>board().objects.find(o=>o.id===id||o.members?.some(m=>m.id===id))!;
 const act=(a:string,b:string,context?:Action['context'])=>{const action:Action={type:'combine',a,b,...context?{context}:{}};const before=s,forecast=E.previewRetainedProject(s,action);s=E.stepRetainedProject(s,action);assert.deepEqual(s,forecast.state);assert.ok(s.accepted,`${actions.length+1} ${JSON.stringify(action)}: ${s.response.join('; ')}`);actions.push(action);trace.push({index:actions.length,action,beforeHash:hash(before),afterHash:hash(s),response:s.response,goals:E.retainedProjectGoals(s).filter(g=>g.satisfied).map(g=>g.id)});return board().objects.at(-1)!.id;};
 const learn=(name:string):void=>{if(s.known.includes(name))return;const r=MATERIALS_RECIPES.find(r=>r.result===name);assert.ok(r,`Cannot infer transformation ${name}`);learn(r.a);learn(r.b);act(r.a,r.b);};
 const place=(name:string,at:string)=>{const old=new Set(board().objects.map(o=>o.id));if(!s.known.includes(name)){const r=MATERIALS_RECIPES.find(r=>r.result===name);assert.ok(r);learn(r.a);learn(r.b);act(r.a,r.b,{at});}else act(name,`place:${at}`);return board().objects.find(o=>!old.has(o.id))!.id;};
 const add=(a:string,name:string,operation?:'inside'|'outside',part?:string)=>{learn(name);act(a,name,{...operation?{operation}:{},...part?{part}:{}});};
 const move=(a:string,p:string)=>act(a,`place:${p}`);
 const event=(a:string,p:string,operation:'observe'|'transmit'|'sample'|'fit',part?:string)=>act(a,`place:${p}`,{operation,...part?{part}:{}});
 const pose=(a:string,operation:'aim'|'fold'|'close',direction?:'west'|'east',part?:string)=>act(a,a,{operation,...direction?{direction}:{},...part?{part}:{}});
 const join=(a:string,b:string,channel:'power'|'water'|'light')=>act(a,b,{operation:'connect',channel});
 const material=(a:string)=>all(obj(a).root).find(p=>p.kind==='material')!.id;
 const transform=(a:string,b:string,recipe:string,part?:string)=>{const old=new Set(board().objects.map(o=>o.id));act(a,b,{operation:'transform',recipe,...part?{part}:{}});return board().objects.find(o=>o.id===a||!old.has(o.id))!.id;};
 const initial=(key:string)=>board().objects.find(o=>o.initialKey===key||o.members?.some(m=>m.initialKey===key))!.id;
 const boundary=(phase:string)=>boundaries.push({phase,interventions:s.interventions,satisfied:E.retainedProjectGoals(s).filter(g=>g.satisfied).map(g=>g.id)});
 let utility=savedUtility;
 if(!utility){const u=place('cart','work-yard');for(const n of ['hinge','lens','record-plate','tube','solar-heater','lamp'])add(u,n);add(u,'solar-lead');const west=all(obj(u).root).filter(p=>p.kind==='solar-cell').at(-1)!;pose(u,'aim','west',west.id);utility=obj(u).design;}
 const utilityBuild=s.interventions;
 const equip=(a:string)=>add(a,utility!,'outside');
 const heater=place('solar-heater','survey-window');let glass=transform('sand',heater,'fuse');act(glass,initial('survey-camera'),{operation:'inside'});event(glass,'beacon','observe');equip(glass);
 const nursery=initial('nursery'),home=place('clear-cast','garden');act(home,nursery,{operation:'inside'});add(home,'camera','inside');add(home,'lamp','outside');const east=place('solar-lead','ridge'),west=place('solar-lead','ridge');pose(west,'aim','west');join(east,home,'power');join(west,home,'power');
 const clay=initial('working-clay');transform(clay,'place:filter-pad','wet-clay');transform(clay,'place:filter-pad','take-form');event(clay,'filter-pad','fit',material(clay));add(clay,'tube');join(clay,home,'water');event(home,'lookout','observe');event(home,'receiver','transmit');
 const diffuse=place('clear-cast','shade-bed');transform(diffuse,'mesh','frost');add(diffuse,'rootbed','inside');const mirror=place('reflective-shell','mirror-perch');pose(mirror,'aim','west');join(mirror,diffuse,'light');boundary('living survey and useful soft filter');
 equip(clay);const fire=place('solar-heater','filter-pad');transform(clay,fire,'fire',material(clay));const geometry=obj(clay).design;const replacement=place(geometry,'filter-pad');event(replacement,'filter-pad','fit',material(replacement));join(replacement,home,'water');const basin=place(geometry,'basin');transform(basin,'clear-film','line',material(basin));event(basin,'basin','fit',material(basin));transform(clay,'clear-film','line',material(clay));move(clay,'work-yard');
 move(glass,'press');act(glass,clay,{operation:'transmit'});
 const master=initial('mesh-master');const pulp=transform('fiber','place:casting-bay','pulp');transform(pulp,master,'sheet');equip(pulp);move(pulp,'press');transform(pulp,glass,'impress',material(pulp));move(pulp,'paper-slot');event(pulp,'paper-slot','fit',material(pulp));
 const openCopy=place('record-sheet','press');transform(openCopy,glass,'impress');const wet=place('record-sheet','press');transform(wet,glass,'impress');transform(wet,'clear-film','laminate');equip(wet);move(wet,'wet-gallery');
 add(master,'frame');add(master,'sample-tray','inside');equip(master);move(master,'table');event(master,'table','sample');move(master,'archive-bay');act(glass,master,{operation:'transmit'});boundary('retained records and working profiles');
 const relief=place('soft-clay','relief');transform(relief,'place:relief','take-form');const reliefHeat=place('solar-heater','relief');transform(relief,reliefHeat,'fire');transform(relief,'clear-film','line');equip(relief);move(relief,'wet-gallery');
 move(glass,'far-view');event(glass,'far-marker','observe');event(glass,'receiver','transmit');const dark=place('reflective-shell','far-view');act(dark,glass,{operation:'inside'});glass=dark;pose(glass,'fold');move(glass,'dock');pose(glass,'close');pose(clay,'fold');move(clay,'collection');pose(clay,'close');boundary('completed retained project');
 assert.ok(E.retainedProjectGoals(s).every(g=>g.satisfied),JSON.stringify(E.retainedProjectGoals(s).filter(g=>!g.satisfied),null,2));assert.equal(s.status,'complete');assert.deepEqual(E.replayRetainedProject(actions,options),s);
 return {evidence:'Source-exposed authored whole-project route; upper bound, not optimality or player experience.',options,utility,utilityBuild,actions,trace,boundaries,state:s,interventions:s.interventions,ledger:s.ledger,replayExact:true};
}
export function runRetainedProjectControls(directory:string){const paths=['experiments/logical-retained-project.ts','experiments/retained-project-types.ts','experiments/retained-project-content.ts','experiments/retained-project-transformations.ts','experiments/retained-project-controls.ts'];const hashes=Object.fromEntries(paths.map(p=>[p,createHash('sha256').update(readFileSync(p)).digest('hex')]));const ordinary=retainedProjectControl(),complete=retainedProjectControl({catalogue:'complete'}),saved=retainedProjectControl({catalogue:'complete',known:ordinary.state.known,designs:ordinary.state.designs},ordinary.utility);mkdirSync(directory,{recursive:true});for(const [name,data]of Object.entries({ordinary,complete,saved}))writeFileSync(`${directory}/${name}.json.gz`,gzipSync(JSON.stringify({hashes,...data}),{level:9}));const summary={evidence:ordinary.evidence,hashes,results:Object.entries({ordinary,complete,saved}).map(([name,r])=>({name,interventions:r.interventions,utilityBuild:r.utilityBuild,ledger:r.ledger,status:r.state.status,satisfied:E.retainedProjectGoals(r.state).filter(g=>g.satisfied).length,boundaries:r.boundaries,replayExact:true}))};writeFileSync(`${directory}/summary.json`,JSON.stringify(summary,null,2)+'\n');assert.ok(paths.every(p=>hashes[p]===createHash('sha256').update(readFileSync(p)).digest('hex')));return summary;}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(runRetainedProjectControls(process.argv[2]??'results/retained-project-preplay/controls/authored'),null,2));
