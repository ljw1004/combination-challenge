/** Named binary logical adapter. Separate from frozen substrate and any UI. */
import {initial,step,endpoints,PROCESSES,type State,type Action,type Process,type Channel} from './logical-ideas-history-estuary.ts';
import type {InterfaceId} from './ideas-history-estuary-signals.ts';
export type Piece={id:string;name:string;kind:'person'|'site'|'tool'|'episode'|'score'|'roads'|'school'|'mailbox'|'invitation'|'duo';ref?:string;process?:Process;interface?:InterfaceId;method?:string;angle?:string;pressure?:string;description:string};
export type Gesture={left:string;right:string};
export type World={version:'estuary-binary-1';engine:State;pieces:Record<string,Piece>;gestures:{input:Gesture;commands:Action[];results:string[];automatic:string[]}[]};
const clone=<T>(x:T):T=>structuredClone(x);
export function start():World{
 const engine=initial('complete');
 // Authored starting capabilities: not hidden player commands or earned discoveries.
 Object.assign(engine.methods,{tempo:{name:'Fivefold Lens',kind:'render',factor:[1,5],channels:['angle']},loom:{name:'Touch Loom',kind:'render',factor:1,channels:['pressure']},reverse:{name:'Mirror Following',kind:'following',mode:'bound',interface:'reversed'},pressure:{name:'Pressure Following',kind:'following',mode:'bound',interface:'pressure'}});
 const w:World={version:'estuary-binary-1',engine,pieces:{},gestures:[]};
 const add=(p:Piece)=>w.pieces[p.id]=p;
 for(const [id,name,process,inter,method] of [
 ['watchhouse','Watchhouse','A','normal','identity'],['tidepool','Long Tide Pool','Tide','normal','identity'],['mirror-quay','Mirror Quay','A','reversed','reverse'],['pilgrim-inlet','Pilgrim Inlet','B','pressure','pressure'],['lantern-marsh','Lantern Marsh','C','pressure','pressure'],['mirror-marsh','Mirror Marsh','C','reversed','reverse'],['storm-archive','Storm Archive','D','reversed','reverse']]) add({id:id!,name:name!,kind:'site',process:process as Process,interface:inter as InterfaceId,method,description:`Lives ${process} through ${inter} sensing/movement using ${method}; retains the actual practice.`});
 for(const [id,name,method] of [['fivefold-lens','Fivefold Lens','tempo'],['touch-loom','Touch Loom','loom'],['beacon-canon','Beacon Canon','duet'],['whole-tide-loom','Whole Tide Loom','tactileTide']])add({id:id!,name:name!,kind:'tool',method,description:`Reusable disclosed transform: ${JSON.stringify(engine.methods[method!])}`});
 add({id:'two-roads',name:'Two Roads',kind:'roads',description:'A willing local person continues as two relatives sharing their actual lived prefix.'});
 add({id:'beacon-pair',name:'Beacon Pair',kind:'duo',angle:'Sori',pressure:'Ilen',description:'Sori moves the beacon; Ilen voices its pressure. These are two actual named roles.'});
 for(const role of ['Local','Far']){add({id:`school:${role}`,name:`${role} School`,kind:'school',ref:role,description:'Place a capable local person here to transfer request routing; former teacher continues.'});add({id:`mailbox:${role}`,name:`${role} Invitation Mailbox`,kind:'mailbox',ref:role,description:'A score placed here invites whoever holds this school when the letter arrives next activity.'});}
 sync(w);return w;
}
function sync(w:World){
 for(const a of Object.values(w.engine.actors))w.pieces[`person:${a.id}`]={id:`person:${a.id}`,name:a.name,kind:'person',ref:a.id,description:`${a.remote?'Distant':'Local'} living person; outputs ${a.ports.join(', ')}. Dual-channel solo defaults to angle.`};
 for(const e of Object.values(w.engine.episodes))w.pieces[`episode:${e.id}`]={id:`episode:${e.id}`,name:`${w.engine.actors[e.actor]!.name}'s ${e.process??'remembered'} experience ${e.id}`,kind:'episode',ref:e.id,description:`Actual ${e.kind} at epoch ${e.epoch}; source and practice inspectable.`};
 for(const s of Object.values(w.engine.scores))w.pieces[`score:${s.id}`]={id:`score:${s.id}`,name:s.name,kind:'score',ref:s.id,description:`${s.channels.join('/')} score; exact trajectory and actual ancestry inspectable.`};
 for(const m of Object.values(w.engine.messages))if(m.invitation)w.pieces[`invitation:${m.id}`]={id:`invitation:${m.id}`,name:`${m.role} invitation: ${w.engine.scores[m.score]!.name}`,kind:'invitation',ref:m.id,description:m.received===undefined?'In flight; delivered before next activity.':`Received by ${m.recipient}.`};
}
export function combine(input:World,g:Gesture):World{
 if(input.version!=='estuary-binary-1'||Object.keys(g).some(k=>k!=='left'&&k!=='right'))throw Error('Exactly two piece operands required');
 const w=clone(input),a=w.pieces[g.left],b=w.pieces[g.right];if(!a||!b||a.id===b.id)throw Error('Two distinct known pieces required');
 const before=new Set(Object.keys(w.pieces));const commands:Action[]=[];
 const act=(x:Action)=>{w.engine=step(w.engine,x);commands.push(x);};
 const pair=(x:Piece['kind'],y:Piece['kind']):[Piece,Piece]|undefined=>a.kind===x&&b.kind===y?[a,b]:b.kind===x&&a.kind===y?[b,a]:undefined;
 const fresh=(prefix:string)=>`${prefix}-gesture-${w.gestures.length+1}`;
 const port=(actor:string,score:string):Channel=>{const cs=w.engine.scores[score]!.channels.filter(c=>w.engine.actors[actor]!.ports.includes(c));if(!cs.length)throw Error('No compatible embodied output');return cs.includes('angle')?'angle':cs[0]!;};
 let p;
 if(p=pair('person','site'))act({type:'run',actor:p[0].ref!,process:p[1].process!,method:p[1].method!,interface:p[1].interface!});
 else if((p=pair('episode','tool'))||(p=pair('score','tool')))act({type:'transform',id:fresh('score'),source:p[0].ref!,method:p[1].method!,name:`${p[1].name} of ${p[0].name}`});
 else if(p=pair('person','score'))act({type:'perform',actor:p[0].ref!,score:p[1].ref!,channel:port(p[0].ref!,p[1].ref!)});
 else if(p=pair('person','episode')){const who=p[0].ref!,e=w.engine.episodes[p[1].ref!]!;if(!w.engine.actors[who]!.remote&&e.actor!==who)act({type:'teach',teacher:e.actor,learner:who,episode:e.id});act({type:'perform',actor:who,score:e.score,channel:port(who,e.score)});}
 else if(p=pair('person','roads'))act({type:'fork',actor:p[0].ref!,child:fresh('relative'),name:`${p[0].name} of the Other Road`});
 else if(p=pair('episode','episode')){const ea=w.engine.episodes[p[0].ref!]!,eb=w.engine.episodes[p[1].ref!]!;act({type:'reunion',a:ea.actor,b:eb.actor,episodeA:ea.id,episodeB:eb.id});act({type:'recall',actor:ea.actor,score:eb.score,channel:port(ea.actor,eb.score)});act({type:'recall',actor:eb.actor,score:ea.score,channel:port(eb.actor,ea.score)});}
 else if(p=pair('score','duo'))act({type:'ensemble',score:p[0].ref!,angle:p[1].angle!,pressure:p[1].pressure!});
 else if(p=pair('person','person')){const x=w.engine.actors[p[0].ref!]!,y=w.engine.actors[p[1].ref!]!;const possibilities=[[x,y],[y,x]].filter(([u,v])=>u!.ports.includes('angle')&&v!.ports.includes('pressure'));if(possibilities.length!==1)throw Error('Duo needs unambiguous angle and pressure roles');const [u,v]=possibilities[0]!;if(u!.remote||v!.remote)throw Error('Local duo requires co-present people');const id=fresh('duo');w.pieces[id]={id,name:`${u!.name} & ${v!.name}`,kind:'duo',angle:u!.id,pressure:v!.id,description:`${u!.name} on angle, ${v!.name} on pressure.`};}
 else if(p=pair('score','mailbox'))act({type:'send',id:fresh('invitation'),score:p[0].ref!,role:p[1].ref!,invitation:true});
 else if(p=pair('person','school'))act({type:'succeed',role:p[1].ref!,successor:p[0].ref!});
 else if(p=pair('invitation','invitation'))act({type:'festival',messages:[p[0].ref!,p[1].ref!]});
 else throw Error('No disclosed combination for these pieces');
 sync(w);w.gestures.push({input:clone(g),commands,results:Object.keys(w.pieces).filter(id=>!before.has(id)),automatic:w.engine.ledger.slice(input.engine.ledger.length).flatMap(l=>l.automatic)});return w;
}
/** Developer verification only: exposes future results, not normal discovery hints. */
export function preview(w:World,g:Gesture){try{const next=combine(w,g);const consequence=next.gestures.at(-1)!;return {legal:true as const,consequence,resultPieces:consequence.results.map(id=>inspect(next,id)),newEpisodes:Object.values(next.engine.episodes).filter(e=>!w.engine.episodes[e.id]),actors:clone(next.engine.actors),schools:clone(next.engine.schools),messages:clone(next.engine.messages),projects:endpoints(next.engine)};}catch(e){return {legal:false as const,reason:(e as Error).message};}}
/** Normal discovery: compatible partners only, without future result names/trajectories. */
export function compatible(w:World,id:string){if(!w.pieces[id])throw Error('Unknown piece');return Object.keys(w.pieces).filter(other=>other!==id&&preview(w,{left:id,right:other}).legal).map(other=>({other,name:w.pieces[other]!.name}));}
export function inspect(w:World,id:string){const p=w.pieces[id];if(!p)throw Error('Unknown piece');return clone({piece:p,process:p.process?PROCESSES[p.process]:undefined,actor:p.kind==='person'?w.engine.actors[p.ref!]:undefined,episode:p.kind==='episode'?w.engine.episodes[p.ref!]:undefined,score:p.kind==='score'?w.engine.scores[p.ref!]:undefined,method:p.method?w.engine.methods[p.method]:undefined,school:p.kind==='school'||p.kind==='mailbox'?w.engine.schools[p.ref!]:undefined,message:p.kind==='invitation'?w.engine.messages[p.ref!]:undefined});}
/** Reconstruct from actual binary inputs and reject tampered results/causal command ledgers. */
export function replay(record:World):World{
 let w=start();for(const entry of record.gestures)w=combine(w,entry.input);
 if(JSON.stringify(w)!==JSON.stringify(record))throw Error('Binary capture does not replay exactly');return w;
}
