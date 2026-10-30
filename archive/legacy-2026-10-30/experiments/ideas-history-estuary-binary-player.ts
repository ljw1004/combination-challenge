/** Restricted logical player wrapper: no developer preview, routes or source commands. */
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';
import {start,combine,compatible,inspect,type World} from './ideas-history-estuary-binary.ts';
import {endpoints} from './logical-ideas-history-estuary.ts';
export const ASSIGNMENT=`Explore the Estuary of Continuing Lives: a small speculative world of people, experiences, transforming tools and schools. Make whatever interests you across its six connected possibilities. You may pursue all, some or none, in any order; use any available shortcuts. This is not a speed test, minimum-action contest or request to reach a target number of actions. Stop whenever you have enough to assess it.
Use only this player wrapper and its help, state, objectives, inspect, partners, combine and finish commands. Do not read implementation files, developer previews, authored routes, tests or other players' records. Compatible-partner hints reveal existing things you can join, not the result's name before you combine. Existing things and their behavior are inspectable. Combinations preserve conceptual access; nothing is a finite stock. This is a logical pair interface, not a physical drag-and-drop UI or simulated ecology. Supplied places offer their disclosed local practices. A person with two output ports uses angle for dual-channel solo scores. Distant instructions travel and arrive before a later real activity, not on a wait click. Some single encounters cause multiple performances or automatic deliveries; those are not extra player choices.
You need not explain every action. At finish, say what you made, what you enjoyed or disliked, anything you still wanted to do, and why you stopped. Distinguish interface friction from interest in the consequences. Your account is evidence about this session, not a request to praise the game.`;
export const OBJECTIVES={
 shortTide:'Let someone experience another person’s Long Tide in a shorter, tactile form.',
 divergentLives:'Let two continuing relatives diverge, then each actually experience something lived by the other.',
 sharedPerformance:'Let distinct people express one actual Sweep together through movement and pressure.',
 reciprocalSchool:'Let a school’s successor learn a genuinely later experience, then teach it back to the continuing former teacher.',
 distantLocalLives:'Let an actually shared local score travel and be performed far away, while the distant person also continues their own local life.',
 roleContinuity:'Let an invitation follow a school role through succession, while the former holder continues their own activity.'
};
export function current(w:World){return {version:w.version,epoch:w.engine.epoch,counts:{gestures:w.gestures.length,substrateCommands:w.engine.selections,automaticDeliveries:w.gestures.flatMap(g=>g.automatic).length},projects:endpoints(w.engine),pieces:Object.values(w.pieces),people:w.engine.actors,schools:w.engine.schools,messages:w.engine.messages};}
export type RecordEntry={sequence:number;command:string;args:string[];status:'accepted'|'rejected'|'query'|'init'|'finish';output?:unknown;error?:string;gesture?:{left:string;right:string};automatic?:string[]};
export type Session={format:'estuary-binary-player-1';assignment:string;publication:string;sourceHashes:Record<string,string>;world:World;finished:boolean;records:RecordEntry[]};
function hashes(){const here=path.dirname(fileURLToPath(import.meta.url));return Object.fromEntries(['ideas-history-estuary-binary-player.ts','ideas-history-estuary-binary.ts','logical-ideas-history-estuary.ts','ideas-history-estuary-signals.ts'].map(file=>[file,createHash('sha256').update(fs.readFileSync(path.join(here,file))).digest('hex')]));}
export function initialize(publication:string):Session{if(!publication.trim())throw Error('Coordinator must record a publication revision');const world=start(),output={assignment:ASSIGNMENT,objectives:OBJECTIVES,state:current(world)};return {format:'estuary-binary-player-1',assignment:ASSIGNMENT,publication,sourceHashes:hashes(),world,finished:false,records:[{sequence:0,command:'init',args:[publication],status:'init',output}]};}
/** All command outputs are player-safe; capture includes rejected requests without changing the world. */
export function dispatch(input:Session,command:string,args:string[]):{session:Session;output:unknown;ok:boolean}{
 const s=structuredClone(input);const entry:RecordEntry={sequence:s.records.length,command,args:[...args],status:'query'};let output:unknown;
 const known=(id:string)=>{if(!Object.hasOwn(s.world.pieces,id))throw Error('Unknown existing piece');};
 const arity=(min:number,max=min)=>{if(args.length<min||args.length>max)throw Error('Wrong number of arguments; use help');};
 try{
  if(command==='state'){arity(0);output=current(s.world);}
  else if(command==='objectives'){arity(0);output={descriptions:OBJECTIVES,current:endpoints(s.world.engine)};}
  else if(command==='inspect'){arity(1);known(args[0]!);output=inspect(s.world,args[0]!);}
  else if(command==='partners'){arity(1);known(args[0]!);output={piece:args[0],partners:compatible(s.world,args[0]!)};}
  else if(command==='help'){arity(0);output=HELP;}
  else if(command==='combine'){
   arity(2,3);known(args[0]!);known(args[1]!);if(s.finished)throw Error('Session finished; further combinations are closed');const gesture={left:args[0]!,right:args[1]!};const next=combine(s.world,gesture),event=next.gestures.at(-1)!;
   s.world=next;entry.status='accepted';entry.gesture=gesture;entry.automatic=[...event.automatic];output={created:event.results.map(id=>inspect(next,id)),automatic:[...event.automatic],state:current(next)};
  }else if(command==='finish'){arity(1);if(s.finished)throw Error('Already finished');s.finished=true;entry.status='finish';output={assessment:args[0],counts:current(s.world).counts,projects:endpoints(s.world.engine)};}
  else throw Error('Unknown command; use help');
  entry.output=structuredClone(output);s.records.push(entry);return {session:s,output,ok:true};
 }catch(e){entry.status='rejected';entry.error=(e as Error).message;s.records.push(entry);return {session:s,output:{error:entry.error},ok:false};}
}
/** Reconstruct the full session journal, including rejected/query/finish outputs and exposure. */
export function validateSession(s:Session):void{
 if(s.format!=='estuary-binary-player-1')throw Error('Session format mismatch');
 if(JSON.stringify(s.sourceHashes)!==JSON.stringify(hashes()))throw Error('Source changed since initialization; preserve this session and use a newly verified version');
 let reconstructed=initialize(s.publication);
 for(const entry of s.records.slice(1))reconstructed=dispatch(reconstructed,entry.command,entry.args).session;
 if(JSON.stringify(reconstructed)!==JSON.stringify(s))throw Error('Session journal does not replay exactly; capture or finish state changed');
}
export const HELP=`Estuary binary player commands (logical pieces, not a physical UI):
init SESSION PUBLICATION_REVISION  [coordinator setup; records exact assignment]
state SESSION
objectives SESSION
inspect SESSION EXISTING_PIECE_ID
partners SESSION EXISTING_PIECE_ID
combine SESSION LEFT_PIECE_ID RIGHT_PIECE_ID [optional note]
finish SESSION "assessment and reason for stopping"
help SESSION
No preview, source, route, arbitrary JSON action, wait, or setup-parameter command exists.
Queries/rejections are recorded but are not gestures. After finish, read-only queries remain available; combinations and repeated finish are rejected.`;
function save(file:string,s:Session){const temp=`${file}.tmp`;fs.writeFileSync(temp,JSON.stringify(s,null,2)+'\n');fs.renameSync(temp,file);}
export function main(argv:string[]){const [command,session,...args]=argv;if(!command||(command==='help'&&!session)){console.log(HELP);return;}
 if(!session||! /^[a-zA-Z0-9_-]+$/.test(session))throw Error('Use a simple session name');
 const dir=path.resolve('results/ideas-history-estuary-binary-players',session),file=path.join(dir,'session.json');
 if(command==='init'){if(args.length!==1)throw Error('Init requires one publication revision');const s=initialize(args[0]!);fs.mkdirSync(dir,{recursive:false});save(file,s);console.log(JSON.stringify(s.records[0]!.output,null,2));return;}
 const lock=path.join(dir,'.lock');const fd=fs.openSync(lock,'wx');
 try{const s=JSON.parse(fs.readFileSync(file,'utf8')) as Session;validateSession(s);const result=dispatch(s,command,args);save(file,result.session);console.log(JSON.stringify(result.output,null,2));if(!result.ok)process.exitCode=1;}finally{fs.closeSync(fd);fs.unlinkSync(lock);}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{const base=path.resolve('results/ideas-history-estuary-binary-players');if(process.argv[2]==='init')fs.mkdirSync(base,{recursive:true});main(process.argv.slice(2));}catch(e){console.error((e as Error).message);process.exitCode=1;}}
