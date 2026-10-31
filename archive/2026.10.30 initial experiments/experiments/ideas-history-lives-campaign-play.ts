import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {createState,observe,offers,preview,apply,LAWS,RECIPES,EVENTS,complete,goals} from './logical-ideas-history-lives-campaign.ts';
import type {State} from './logical-ideas-history-lives-campaign.ts';

export const DIR='results/ideas-history-lives-campaign-players';
export const hash=(x:unknown)=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const clean=<T>(x:T):T=>JSON.parse(JSON.stringify(x));
export function sourceHashes(){return Object.fromEntries(['logical-ideas-history-lives-campaign.ts','ideas-history-lives-campaign-play.ts'].map(name=>[name,createHash('sha256').update(readFileSync(new URL('./'+name,import.meta.url))).digest('hex')]));}
export type Metadata={condition:'normal'|'complete';participant:unknown;publicPrompt:string;exposureHistory:unknown;[key:string]:unknown};
export type Event={index:number;at:string;cmd:string;argument:string|null;before:State;after:State;beforeHash:string;afterHash:string;initializedBefore:boolean;initializedAfter:boolean;finishedBefore:boolean;finishedAfter:boolean;metadataBefore:Metadata|null;metadataAfter:Metadata|null;runtimeSources:Record<string,string>;output:unknown;previousEventHash:string|null;eventHash:string};
export type Session={schema:1;id:string;sourceHashes:Record<string,string>;metadata:Metadata|null;initialized:boolean;finished:boolean;state:State;events:Event[]};
export function freshSession(id:string,sources=sourceHashes()):Session{return {schema:1,id,sourceHashes:sources,metadata:null,initialized:false,finished:false,state:createState(),events:[]};}
function parseMetadata(arg:string|null):Metadata{
 const m=JSON.parse(arg??'null');
 if(!m||typeof m!=='object'||Array.isArray(m))throw Error('Init needs an exact metadata JSON object.');
 if(!['normal','complete'].includes(m.condition))throw Error('Metadata condition must be normal or complete.');
 if(!m.participant||typeof m.participant!=='object'||typeof m.participant.id!=='string'||typeof m.participant.kind!=='string')throw Error('Metadata participant needs id and kind.');
 if(typeof m.publicPrompt!=='string'||!m.publicPrompt.length||!Object.hasOwn(m,'exposureHistory'))throw Error('Metadata needs exact publicPrompt and exposureHistory.');
 return m;
}
function inspectPublic(state:State,id:string|null){
 if(!id||id==='all')return {...observe(state),laws:LAWS,recipes:RECIPES,events:EVENTS,offers:offers(state)};
 const sections:Record<string,unknown>={laws:LAWS,recipes:RECIPES,events:EVENTS,methods:state.methods,actors:state.actors,episodes:state.episodes,forks:state.forks,transfers:state.transfers,roles:state.roles,requests:state.requests,goals:goals(state),state,offers:offers(state)};
 if(Object.hasOwn(sections,id))return sections[id];
 const item=[...state.actors,...state.methods,...state.episodes,...RECIPES].find(x=>x.id===id);
 if(!item)throw Error('Unknown inspection target '+id);return item;
}
function actionOutput(before:State,p:ReturnType<typeof apply>){
 const changed=<T>(old:T[],next:T[])=>next.filter((x,i)=>JSON.stringify(x)!==JSON.stringify(old[i]));
 return {accepted:p.accepted,message:p.message,moves:p.state.moves,complete:complete(p.state),goals:p.goals,changes:p.accepted?{
 known:p.state.known.filter(x=>!before.known.includes(x)),actors:changed(before.actors,p.state.actors),methods:changed(before.methods,p.state.methods),
 devices:JSON.stringify(before.devices)!==JSON.stringify(p.state.devices)?p.state.devices:undefined,
 keeper:before.keeper!==p.state.keeper?p.state.keeper:undefined,
 episodes:p.state.episodes.slice(before.episodes.length),forks:p.state.forks.slice(before.forks.length),transfers:p.state.transfers.slice(before.transfers.length),roles:p.state.roles.slice(before.roles.length),requests:p.state.requests.slice(before.requests.length)
 }:undefined};
}
/** Exact public transition used for capture/replay; verification is not an independent semantic oracle. */
export function dispatch(s:Session,cmd:string,arg:string|null,runtimeSources=sourceHashes(),verifiedPrefix=false):unknown{
 try{
  if(JSON.stringify(runtimeSources)!==JSON.stringify(s.sourceHashes))throw Error('Source changed since session started.');
  if(cmd==='invalid-invocation')throw Error('Pass one quoted JSON argument or one inspection target; full rejected argv is captured.');
  if(cmd==='init'){
   if(s.initialized)throw Error('Session already initialized.');
   const metadata=parseMetadata(arg);s.metadata=structuredClone(metadata);s.state=createState(metadata.condition);s.initialized=true;
   return clean({...observe(s.state),metadata:s.metadata,sourceHashes:s.sourceHashes,laws:LAWS,recipes:RECIPES,events:EVENTS,offers:offers(s.state)});
  }
  if(!s.initialized)throw Error('Session needs a valid init before other commands.');
  if(cmd==='view')return observe(s.state);
  if(cmd==='inspect')return inspectPublic(s.state,arg);
  if(cmd==='offers')return offers(s.state);
  if(cmd==='preview'||cmd==='combine'){
   if(cmd==='combine'&&s.finished)throw Error('Session finished.');
   const before=s.state;const p=(cmd==='preview'?preview:apply)(before,JSON.parse(arg??'null'));
   if(cmd==='combine')s.state=p.state;
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
 const counts={acceptedCombines:0,refusedCombines:0,errors:0,queries:0,reports:0,administrative:0};
 for(const [i,e] of capture.events.entries()){
  const {eventHash,...body}=e;assert.equal(eventHash,hash(body),`event hash ${i}`);assert.equal(e.index,i);assert.ok(typeof e.at==='string'&&Number.isFinite(Date.parse(e.at)),`timestamp ${i}`);
  const output=append(replay,e.cmd,e.argument,e.runtimeSources,e.at,true);
  assert.deepEqual(replay.events[i],e,`replay event ${i}`);
  const out=output as {accepted?:boolean;error?:string};
  if(e.cmd==='combine'){if(out.accepted)counts.acceptedCombines++;else counts.refusedCombines++;}
  if(out.error)counts.errors++;
  if(['view','inspect','offers','preview','verify'].includes(e.cmd))counts.queries++;
  if(e.cmd==='report')counts.reports++;
  if(['init','finish'].includes(e.cmd))counts.administrative++;
 }
 assert.deepEqual(replay,capture,'Final envelope/state/metadata differs from replay.');
 assert.equal(capture.state.moves,counts.acceptedCombines);
 return {id:capture.id,verified:true,events:capture.events.length,counts,metadata:capture.metadata,sourceHashes:capture.sourceHashes,finished:capture.finished,complete:complete(capture.state),final:observe(capture.state),notice:'Replay is capture verification, not lived player evidence or independent semantic validation.'};
}
function main(){
 const [cmd,id,...args]=process.argv.slice(2);
 if(!id||!/^[a-zA-Z0-9_-]+$/.test(id))throw Error('Simple session ID required.');
 const path=`${DIR}/${id}.json`;let s:Session;
 if(existsSync(path))s=JSON.parse(readFileSync(path,'utf8'));
 else {if(cmd!=='init')throw Error('Session does not exist; initialize it first.');mkdirSync(DIR,{recursive:true});s=freshSession(id);}
 const output=args.length>1?append(s,'invalid-invocation',JSON.stringify({cmd,args})):append(s,cmd,args[0]??null);writeFileSync(path,JSON.stringify(s,null,2)+'\n');console.log(JSON.stringify(output,null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main();
