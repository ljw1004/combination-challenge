import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {createState,observe,catalogue,preview,apply,LAWS,RECIPES,TARGETS,currentViews,complete,goals} from './logical-ideas-history-live-host.ts';
import type {State} from './logical-ideas-history-live-host.ts';
import {geometry,partPose,inspectGeometricMaterials,partnersGeometricMaterials} from './geometric-materials-engine.ts';

export const DIR='results/ideas-history-live-host-players';
export const hash=(x:unknown)=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const clean=<T>(x:T):T=>JSON.parse(JSON.stringify(x));
export function sourceHashes(){return Object.fromEntries(['logical-ideas-history-live-host.ts','geometric-materials-live-view.ts','geometric-materials-engine.ts','geometric-materials-content.ts','geometric-materials-types.ts','geometric-materials-geometry.ts','ideas-history-live-host-play.ts'].map(name=>[name,createHash('sha256').update(readFileSync(new URL('./'+name,import.meta.url))).digest('hex')]));}
export type Metadata={condition:'normal'|'complete';participant:unknown;publicPrompt:string;exposureHistory:unknown;[key:string]:unknown};
export type Event={index:number;at:string;cmd:string;argument:string|null;before:State;after:State;beforeHash:string;afterHash:string;initializedBefore:boolean;initializedAfter:boolean;finishedBefore:boolean;finishedAfter:boolean;metadataBefore:Metadata|null;metadataAfter:Metadata|null;runtimeSources:Record<string,string>;output:unknown;previousEventHash:string|null;eventHash:string};
export type Session={schema:1;id:string;sourceHashes:Record<string,string>;metadata:Metadata|null;initialized:boolean;finished:boolean;state:State;events:Event[]};
export function freshSession(id:string,sources=sourceHashes()):Session{return {schema:1,id,sourceHashes:sources,metadata:null,initialized:false,finished:false,state:clean(createState()),events:[]};}
function parseMetadata(arg:string|null):Metadata{
 const m=JSON.parse(arg??'null');
 if(!m||typeof m!=='object'||Array.isArray(m))throw Error('Init needs an exact metadata JSON object.');
 if(!['normal','complete'].includes(m.condition))throw Error('Metadata condition must be normal or complete.');
 if(!m.participant||typeof m.participant!=='object'||typeof m.participant.id!=='string'||typeof m.participant.kind!=='string')throw Error('Metadata participant needs id and kind.');
 if(typeof m.publicPrompt!=='string'||!m.publicPrompt.length||!Object.hasOwn(m,'exposureHistory'))throw Error('Metadata needs exact publicPrompt and exposureHistory.');
 return m;
}
function publicOffers(state:State,id:string|null=null){
 const c=catalogue(state);
 return {operand:id,ideas:c.ideas.map(r=>({...r,available:state.known.includes(r.a)&&state.known.includes(r.b),known:state.known.includes(r.id)})),operations:c.operations,applications:c.applications,targets:c.targets,routines:state.routines,rules:state.rules,physical:partnersGeometricMaterials(state.physical,id??''),note:'Public operations and recipes are disclosed; preview gives exact current compatibility and consequences. No automatic plan is selected.'};
}
function inspectPublic(state:State,id:string|null){
 const observation=observe(state),c=catalogue(state);
 if(!id||id==='all')return {...observation,catalogue:c};
 const sections:Record<string,unknown>={laws:LAWS,recipes:RECIPES,targets:TARGETS,routines:state.routines,rules:state.rules,requests:state.requests,calibration:state.calibration,goals:goals(state),state,world:observation.world,physical:state.physical,objects:observation.world.objects,places:observation.world.map.places,designs:state.physical.designs,known:{ideas:state.known,physical:state.physical.known},catalogue:c,offers:publicOffers(state),liveViews:currentViews(state),actors:{learner:state.learner,civic:state.civic,keeper:state.keeper,creatorAway:state.creatorAway}};
 if(Object.hasOwn(sections,id))return sections[id];
 if(id==='host')return {id,learner:state.learner,civic:state.civic,keeper:state.keeper==='host',rules:state.rules};
 if(id==='creator')return {id,away:state.creatorAway,keeper:state.keeper==='creator'};
 if(id.startsWith('catalogue.')){
  let value:unknown=c;
  for(const key of id.slice(10).split('.')){if(!value||typeof value!=='object'||!Object.hasOwn(value,key))throw Error('Unknown catalogue section '+id);value=(value as Record<string,unknown>)[key];}
  return value;
 }
 const routine=state.routines.find(r=>r.id===id);if(routine)return routine;
 const target=TARGETS.find(t=>t.id===id||'target:'+t.id===id);if(target)return target;
 const idea=RECIPES.find(r=>r.id===id);if(idea)return {...idea,known:state.known.includes(id)};
 for(const board of state.physical.boards)for(const object of board.objects){
  if(object.id===id)return {...object,geometry:geometry(object),board:board.id};
  const part=object.parts.find(p=>p.id===id);if(part)return {...part,object:object.id,board:board.id,worldPose:partPose(object,part),geometry:geometry(object).filter(g=>g.part===part.id)};
 }
 return inspectGeometricMaterials(state.physical,id);
}
const equal=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
/** Append-only history fields are delivered as new entries, not repeated old logs. */
function changedFields(before:Record<string,unknown>,after:Record<string,unknown>){
 const out:Record<string,unknown>={};
 for(const key of new Set([...Object.keys(before),...Object.keys(after)])){
  if(equal(before[key],after[key]))continue;
  if(!Object.hasOwn(after,key)){out[key]={removed:true};continue;}
  const a=before[key],b=after[key];
  if(key==='parts'&&Array.isArray(a)&&Array.isArray(b))out[key]=entityDelta(a,b);
  else if(Array.isArray(a)&&Array.isArray(b)&&b.length>=a.length&&equal(a,b.slice(0,a.length)))out[key]={append:b.slice(a.length)};
  else out[key]=b;
 }
 return out;
}
function entityDelta(before:Array<{id:string}>,after:Array<{id:string}>){
 const old=new Map(before.map(x=>[x.id,x]));return {
 added:after.filter(x=>!old.has(x.id)),removed:before.filter(x=>!after.some(y=>y.id===x.id)).map(x=>x.id),
 changed:after.filter(x=>old.has(x.id)&&!equal(old.get(x.id),x)).map(x=>({id:x.id,fields:changedFields(old.get(x.id)! as unknown as Record<string,unknown>,x as unknown as Record<string,unknown>)}))
 };
}
function actionOutput(before:State,p:ReturnType<typeof apply>){
 const after=p.state;
 return {accepted:p.accepted,message:p.message,moves:after.moves,complete:complete(after),goals:p.goals,physicalManual:after.physicalManual,physicalAutomatic:after.physicalAutomatic,changes:p.accepted?{
 known:after.known.filter(x=>!before.known.includes(x)),actors:changedFields({learner:before.learner,civic:before.civic,keeper:before.keeper,creatorAway:before.creatorAway},{learner:after.learner,civic:after.civic,keeper:after.keeper,creatorAway:after.creatorAway}),
 calibration:!equal(before.calibration,after.calibration)?after.calibration:undefined,rules:!equal(before.rules,after.rules)?after.rules:undefined,
 routines:entityDelta(before.routines,after.routines),requests:after.requests.slice(before.requests.length),
 physical:{known:after.physical.known.filter(x=>!before.physical.known.includes(x)),designs:entityDelta(before.physical.designs,after.physical.designs),boards:entityDelta(before.physical.boards.map(b=>({...b,objects:undefined})),after.physical.boards.map(b=>({...b,objects:undefined}))),objects:entityDelta(before.physical.boards.flatMap(b=>b.objects),after.physical.boards.flatMap(b=>b.objects))},
 liveViews:!equal(currentViews(before),currentViews(after))?currentViews(after):undefined
 }:undefined};
}
/** Exact public transition used for capture/replay; verification is not an independent semantic oracle. */
export function dispatch(s:Session,cmd:string,arg:string|null,runtimeSources=sourceHashes(),verifiedPrefix=false):unknown{
 try{
  if(JSON.stringify(runtimeSources)!==JSON.stringify(s.sourceHashes))throw Error('Source changed since session started.');
  if(cmd==='invalid-invocation')throw Error('Pass one quoted JSON argument or one inspection target; full rejected argv is captured.');
  if(cmd==='init'){
   if(s.initialized)throw Error('Session already initialized.');
   const metadata=parseMetadata(arg);s.metadata=structuredClone(metadata);s.state=clean(createState(metadata.condition));s.initialized=true;
   return clean({...observe(s.state),metadata:s.metadata,sourceHashes:s.sourceHashes,catalogue:catalogue(s.state),offers:publicOffers(s.state)});
  }
  if(!s.initialized)throw Error('Session needs a valid init before other commands.');
  if(cmd==='view')return observe(s.state);
  if(cmd==='inspect')return inspectPublic(s.state,arg);
  if(cmd==='offers')return publicOffers(s.state,arg);
  if(cmd==='catalogue')return arg&&arg!=='all'?inspectPublic(s.state,'catalogue.'+arg):catalogue(s.state);
  if(cmd==='preview'||cmd==='combine'){
   if(cmd==='combine'&&s.finished)throw Error('Session finished.');
   const before=s.state;const p=(cmd==='preview'?preview:apply)(before,JSON.parse(arg??'null'));
   if(cmd==='combine')s.state=clean(p.state);
   return clean(actionOutput(before,p));
  }
  if(cmd==='report')return {recorded:JSON.parse(arg??'null')};
  if(cmd==='finish'){
   if(s.finished)throw Error('Session already finished.');
   const report=arg===null?undefined:JSON.parse(arg);s.finished=true;
   return clean({finished:true,report,observation:observe(s.state)});
  }
  if(cmd==='verify'){
   if(!verifiedPrefix)verifySession(s,runtimeSources);
   return {verified:true,events:s.events.length,prefixHash:hash(s.events),sourceHashes:s.sourceHashes,notice:'Deterministic replay verifies capture, not lived experience or independent engine semantics.'};
  }
  throw Error('Unknown command.');
 }catch(error){return {error:error instanceof Error?error.message:String(error)};}
}
export function append(s:Session,cmd:string,arg:string|null,runtimeSources=sourceHashes(),at=new Date().toISOString(),verifiedPrefix=false):unknown{
 const before=structuredClone(s.state),initializedBefore=s.initialized,finishedBefore=s.finished,metadataBefore=structuredClone(s.metadata);
 const output=clean(dispatch(s,cmd,arg,runtimeSources,verifiedPrefix));
 const body={index:s.events.length,at,cmd,argument:arg,before,after:structuredClone(s.state),beforeHash:hash(before),afterHash:hash(s.state),initializedBefore,initializedAfter:s.initialized,finishedBefore,finishedAfter:s.finished,metadataBefore,metadataAfter:structuredClone(s.metadata),runtimeSources:structuredClone(runtimeSources),output,previousEventHash:s.events.at(-1)?.eventHash??null};
 s.events.push({...body,eventHash:hash(body)});return output;
}
export function verifySession(capture:Session,currentSources=sourceHashes()){
 assert.equal(capture.schema,1);assert.deepEqual(capture.sourceHashes,currentSources,'Current engine/adapter differ from capture; replay needs the captured source version.');
 const replay=freshSession(capture.id,capture.sourceHashes);
 const counts={acceptedCombines:0,refusedCombines:0,errors:0,queries:0,reports:0,administrative:0,manualPhysicalTransitions:0,automaticPhysicalTransitions:0};
 for(const [i,e] of capture.events.entries()){
  const {eventHash,...body}=e;assert.equal(eventHash,hash(body),`event hash ${i}`);assert.equal(e.index,i);assert.ok(typeof e.at==='string'&&Number.isFinite(Date.parse(e.at)),`timestamp ${i}`);
  const output=append(replay,e.cmd,e.argument,e.runtimeSources,e.at,true);
  assert.deepEqual(replay.events[i],e,`replay event ${i}`);
  const out=output as {accepted?:boolean;error?:string};
  if(e.cmd==='combine'){if(out.accepted)counts.acceptedCombines++;else counts.refusedCombines++;}
  if(out.error)counts.errors++;
  if(['view','inspect','catalogue','offers','preview','verify'].includes(e.cmd))counts.queries++;
  if(e.cmd==='report')counts.reports++;
  if(['init','finish'].includes(e.cmd))counts.administrative++;
 }
 assert.deepEqual(replay,capture,'Final envelope/state/metadata differs from replay.');
 assert.equal(capture.state.moves,counts.acceptedCombines);
 counts.manualPhysicalTransitions=capture.state.physicalManual;counts.automaticPhysicalTransitions=capture.state.physicalAutomatic;
 return {id:capture.id,verified:true,events:capture.events.length,counts,metadata:capture.metadata,sourceHashes:capture.sourceHashes,finished:capture.finished,complete:complete(capture.state),final:observe(capture.state),notice:'Replay is capture verification, not lived player evidence or independent semantic validation.'};
}
function main(){
 const [cmd,id,...args]=process.argv.slice(2);
 if(!id||!/^[a-zA-Z0-9_-]+$/.test(id))throw Error('Simple session ID required.');
 const path=`${DIR}/${id}.json`;let s:Session;
 if(existsSync(path)){s=JSON.parse(readFileSync(path,'utf8'));if(s.id!==id)throw Error('Capture/session ID mismatch.');}
 else {if(cmd!=='init')throw Error('Session does not exist; initialize it first.');mkdirSync(DIR,{recursive:true});s=freshSession(id);}
 const output=args.length>1?append(s,'invalid-invocation',JSON.stringify({cmd,args})):append(s,cmd,args[0]??null);writeFileSync(path,JSON.stringify(s,null,2)+'\n');console.log(JSON.stringify(output,null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main();
