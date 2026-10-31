/** Full integrated constructive controls, not players, minima or enjoyment. */
import assert from 'node:assert/strict';import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';import {gzipSync,gunzipSync} from 'node:zlib';
import {fullCampaign} from './geometric-materials-controls.ts';
import {rotation} from './geometric-materials-geometry.ts';
import {createState,apply,preview,goals,complete,currentViews} from './logical-ideas-history-live-host.ts';
import type {State,Action} from './logical-ideas-history-live-host.ts';
import type {Assembly,Design} from './geometric-materials-types.ts';
export function witness(condition:'normal'|'complete'='normal',kind:'absolute'|'relative'|'human'|'static'='absolute',cheapStation=true){
 let s=createState(condition);const trace:{action:Action;message:string;accepted:boolean;after:State}[]=[];
 const doAction=(action:Action,expected=true)=>{const result=apply(s,action);assert.equal(result.accepted,expected,JSON.stringify({action,message:result.message}));assert.deepEqual(result,preview(s,action));s=result.state;trace.push({action,message:result.message,accepted:result.accepted,after:structuredClone(s)});return s;};
 const station:{action:import('./geometric-materials-types.ts').Action}[]=cheapStation?JSON.parse(readFileSync(new URL('./ideas-history-live-host-station-control.json',import.meta.url),'utf8')).actions.map((action:import('./geometric-materials-types.ts').Action)=>({action})):fullCampaign({catalogue:condition==='complete'?'complete':'ordinary'}).station.trace.filter(row=>row.after.map==='station');for(const row of station){const {type,...action}=row.action;doAction(action);}
 assert(goals(s).workingStation);const stationMoves=s.moves;const objects=()=>s.physical.boards[0]!.objects;const camera=()=>objects().find(o=>o.parts.some(p=>p.kind==='lens'))!;let instrument=camera().id;
 if(kind==='relative'){
  // Existing scientific camera remains the very same lens/plate subtree.
  doAction({a:'frame',b:'place:floor',context:{operation:'move',at:[2,1,0]}});const frame=objects().at(-1)!;
  doAction({a:frame.id,b:instrument,context:{operation:'attach',at:[2,1,0],parent:frame.parts[0]!.id,hinge:{pivot:[0,0,.5],axis:'z'}}});instrument=frame.id;
 }else doAction({a:instrument,b:'place:floor',context:{operation:'move',at:[2,1,0]}});
 const eastRoutine=s.routines.at(-1)!.id;
 doAction({a:instrument,b:'beacon',context:{operation:'calibrate'}});
 if(kind==='static'){
  doAction({a:'camera',b:'place:floor',context:{operation:'move',at:[-2,1,0],rotation:rotation('z',2)}});
  const views=currentViews(s);assert(views.some(v=>v.subject==='beacon'));assert(views.some(v=>v.subject==='west'));assert(!views.filter(v=>v.subject==='west').some(v=>v.center[0]===2));
  return {condition,kind,stationMoves,moves:s.moves,complete:complete(s),goals:goals(s),comparisonAtAnyCenters:views.some(v=>v.subject==='beacon')&&views.some(v=>v.subject==='west'),trace,state:s};
 }
 if(kind==='relative'){const lens=objects().find(o=>o.id===instrument)!.parts.find(p=>p.kind==='lens')!;doAction({a:instrument,b:'joint',context:{operation:'hinge',part:lens.id,quarter:2}});}else doAction({a:instrument,b:'place:floor',context:{operation:'move',at:[2,1,0],rotation:rotation('z',2)}});
 const westRoutine=s.routines.at(-1)!.id;
 if(kind==='human'){
  doAction({a:'view',b:'west',context:{operation:'request'}});doAction({a:instrument,b:'place:floor',context:{operation:'move',at:[2,1,0]}});doAction({a:'view',b:'beacon',context:{operation:'request'}});
  return {condition,kind,stationMoves,moves:s.moves,complete:complete(s),goals:goals(s),humanService:s.requests.every(r=>r.status==='served'),trace,state:s};
 }
 if(!s.known.includes('apprentices'))doAction({a:'adaptive-minds',b:'reciprocal-education'});doAction({a:'apprentices',b:'host'});
 if(kind==='relative')doAction({a:westRoutine,b:'host',context:{operation:'teach',targets:['beacon','west']}});
 else{doAction({a:eastRoutine,b:'host',context:{operation:'teach',targets:['beacon']}});doAction({a:westRoutine,b:'host',context:{operation:'teach',targets:['west']}});}
 doAction({a:'house-role',b:'host',context:{operation:'handover'}});if(!s.known.includes('unowned'))doAction({a:'apprentices',b:'succession-experience'});doAction({a:'unowned',b:'host'});doAction({a:'creator',b:'away',context:{operation:'travel'}});
 doAction({a:'view',b:'panorama',context:{operation:'session'}});
 assert(complete(s),JSON.stringify(goals(s)));return {condition,kind,stationMoves,moves:s.moves,complete:complete(s),goals:goals(s),trace,state:s};
}
if(process.argv[1]?.endsWith('ideas-history-live-host-screen.ts')){const rows={normal:witness(),complete:witness('complete'),relative:witness('normal','relative'),human:witness('normal','human'),static:witness('normal','static'),longerMaterialPolicy:witness('normal','absolute',false)};const dir='results/ideas-history-live-host-screen';mkdirSync(dir,{recursive:true});for(const [name,r]of Object.entries(rows)){const raw=JSON.stringify(r)+'\n',zip=gzipSync(raw);assert.equal(gunzipSync(zip).toString(),raw);writeFileSync(`${dir}/${name}.json.gz`,zip);}const summary=Object.fromEntries(Object.entries(rows).map(([k,r])=>[k,{stationMoves:r.stationMoves,moves:r.moves,complete:r.complete,physicalAutomatic:r.state.physicalAutomatic,comparisonAtAnyCenters:'comparisonAtAnyCenters'in r?r.comparisonAtAnyCenters:undefined,humanService:'humanService'in r?r.humanService:undefined}]));writeFileSync(`${dir}/summary.json`,JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary,null,2));}
