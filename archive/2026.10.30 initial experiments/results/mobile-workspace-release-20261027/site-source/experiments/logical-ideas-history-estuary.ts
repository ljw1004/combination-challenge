/** Estuary 1: speculative finite signal/life collection. No UI or real cognition claim. */
import { makeTrajectory, validateTrajectory, rescale, affine, trajectoriesEqual as same, runFollowing, eq, type Trajectory, type RationalInput, type InterfaceId } from './ideas-history-estuary-signals.ts';
export const VERSION='estuary-collection-1';
export const PROCESSES = {
 A:makeTrajectory([[0,0],[1,45],[2,90],[3,45],[4,0]]),
 B:makeTrajectory([[0,0],[2,90],[3,30],[5,60]]),
 C:makeTrajectory([[0,90],[1,30],[3,60],[4,0]]),
 Tide:makeTrajectory([[0,0],[5,90],[15,90],[20,0]]),
 D:makeTrajectory([[0,0],[1,90],[2,0],[4,90],[6,0]]),
};
export type Process=keyof typeof PROCESSES;
export type Channel='angle'|'pressure';
export type Method={name:string; kind:'following';mode:'identity'|'bound'|'universal';interface?:InterfaceId}|{name:string;kind:'render';factor:RationalInput;channels:Channel[]};
export type Score={id:string;name:string;trajectory:Trajectory;channels:Channel[];sources:string[]};
export type Actor={id:string;name:string;ports:Channel[];remote:boolean;history:string[];scores:string[];methods:string[];alive:boolean};
export type Episode={id:string;actor:string;epoch:number;selection:number;kind:'run'|'replay';process?:Process;interface?:InterfaceId;method?:string;score:string;sourceEpisodes:string[];trajectory:Trajectory;outputs:Partial<Record<Channel,Trajectory>>;commands?:Trajectory;group?:string;role?:string;message?:string};
export type School={id:string;holder:string;mailbox:string[]};
export type Message={id:string;score:string;role?:string;target?:string;sent:number;due:number;received?:number;recipient?:string;invitation:boolean};
export type Lesson={teacher:string;learner:string;episode:string;score:string;selection:number;novel:boolean};
export type State={version:string;catalogue:'normal'|'complete';epoch:number;selections:number;actors:Record<string,Actor>;methods:Record<string,Method>;scores:Record<string,Score>;episodes:Record<string,Episode>;schools:Record<string,School>;messages:Record<string,Message>;families:{a:string;b:string;prefix:string[];selection:number}[];successions:{role:string;former:string;successor:string;selection:number}[];lessons:Lesson[];ledger:{selection:number;action:Action;automatic:string[]}[]};
export type Action=
 |{type:'method';id:string;method:Method}
 |{type:'literal';id:string;name:string;trajectory:Trajectory;channels:Channel[]}
 |{type:'transform';id:string;source:string;method:string;name:string}
 |{type:'run';actor:string;process:Process;method:string;interface:InterfaceId}
 |{type:'perform'|'recall';actor:string;score:string;channel:Channel}
 |{type:'follow';actor:string;process:Process;method:string;interface:InterfaceId}
 |{type:'fork';actor:string;child:string;name:string}
 |{type:'reunion';a:string;b:string;episodeA:string;episodeB:string}
 |{type:'teach';teacher:string;learner:string;episode:string}
 |{type:'ensemble';score:string;angle:string;pressure:string}
 |{type:'send';id:string;score:string;role?:string;actor?:string;invitation:boolean}
 |{type:'succeed';role:string;successor:string}
 |{type:'festival';messages:[string,string]};
const copy=<T>(v:T):T=>structuredClone(v);
function need<T>(v:T|undefined,what:string):T {if(v===undefined)throw Error(what);return v;}
function channels(cs:Channel[]):Channel[]{if(!Array.isArray(cs)||!cs.length||cs.some(c=>c!=='angle'&&c!=='pressure')||new Set(cs).size!==cs.length)throw Error('Invalid output channels');return [...cs];}
export function initial(catalogue:'normal'|'complete'='normal'):State{
 const actor=(id:string,ports:Channel[],methods:string[]=[],remote=false):Actor=>({id,name:id,ports,remote,history:[],scores:[],methods,alive:true});
 const s:State={version:VERSION,catalogue,epoch:0,selections:0,actors:{Mara:actor('Mara',['angle'],['identity']),Ilen:actor('Ilen',['pressure']),Sori:actor('Sori',['angle']),House:actor('House',['angle','pressure']),Distant:actor('Distant',['angle','pressure'],['identity'],true)},methods:{identity:{name:'Following',kind:'following',mode:'identity'}},scores:{},episodes:{},schools:{Local:{id:'Local',holder:'Mara',mailbox:[]},Far:{id:'Far',holder:'Distant',mailbox:[]}},messages:{},families:[],successions:[],lessons:[],ledger:[]};
 s.scores.baseline={id:'baseline',name:'Inlet local walk',trajectory:copy(PROCESSES.B),channels:['angle'],sources:[]};s.actors.Distant!.scores.push('baseline');
 if(catalogue==='complete')Object.assign(s.methods,{universal:{name:'Public Interface Adapter',kind:'following',mode:'universal'},tactileTide:{name:'Whole Tide Loom',kind:'render',factor:[1,5],channels:['pressure']},duet:{name:'Beacon Duet',kind:'render',factor:1,channels:['angle','pressure']}});
 return s;
}
/** One accepted selection. Transactional: errors never advance time, deliver, or count. */
export function step(input:State,action:Action):State{
 if(input.version!==VERSION)throw Error('Version mismatch');
 const s=copy(input), a=copy(action);s.selections++;const automatic:string[]=[];
 const actor=(id:string)=>need(s.actors[id],'Unknown actor');
 const score=(id:string)=>need(s.scores[id],'Unknown score');
 const episode=(id:string)=>need(s.episodes[id],'Unknown episode');
 const unique=(id:string)=>{if(!id||s.scores[id]||s.methods[id]||s.actors[id]||s.messages[id]||s.episodes[id])throw Error('ID already used or empty');};
 const fresh=(prefix:string)=>{let n=1;while(s.scores[`${prefix}-${n}`]||s.methods[`${prefix}-${n}`]||s.actors[`${prefix}-${n}`]||s.messages[`${prefix}-${n}`]||s.episodes[`${prefix}-${n}`])n++;return `${prefix}-${n}`;};
 const retain=(who:Actor,id:string)=>{if(!who.scores.includes(id))who.scores.push(id);};
 const advance=()=>{s.epoch++;for(const m of Object.values(s.messages))if(m.received===undefined&&m.due<=s.epoch){const school=m.role?need(s.schools[m.role],'Unknown school'):undefined;m.recipient=school?school.holder:need(m.target,'Missing personal destination');m.received=s.selections;school?.mailbox.push(m.id);retain(actor(m.recipient),m.score);automatic.push(`deliver ${m.id} to ${m.recipient}`);}};
 const enact=(who:Actor,sc:Score,cs:Channel[],extra:Partial<Episode>={})=>{
  if(!who.alive||!cs.length||cs.some(c=>!who.ports.includes(c)||!sc.channels.includes(c)))throw Error('Incompatible performance output port');
  if(who.remote&&extra.kind!=='run'&&!who.scores.includes(sc.id))throw Error('Distant instruction requires delivery');
  const id=fresh('episode');
  const outputs:Episode['outputs']={};for(const c of cs)outputs[c]=affine(sc.trajectory,c==='pressure'?[1,90]:1);
  const e:Episode={id,actor:who.id,epoch:s.epoch,selection:s.selections,kind:'replay',score:sc.id,sourceEpisodes:[...sc.sources],trajectory:copy(sc.trajectory),outputs,...extra};
  s.episodes[id]=e;who.history.push(id);retain(who,sc.id);return e;
 };
 const teach=(teacher:Actor,learner:Actor,e:Episode)=>{
  if(learner.remote)throw Error('Distant teaching requires delivered instruction');
  if(!teacher.history.includes(e.id))throw Error('Teacher did not live this episode');
  const sc=score(e.score);if(!sc.channels.some(c=>learner.ports.includes(c)))throw Error('No compatible replay port');
  const novel=!learner.scores.some(id=>same(score(id).trajectory,sc.trajectory));
  retain(learner,sc.id);if(e.method&&!learner.methods.includes(e.method))learner.methods.push(e.method);
  s.lessons.push({teacher:teacher.id,learner:learner.id,episode:e.id,score:sc.id,selection:s.selections,novel});
 };
 switch(a.type){
 case 'method':{unique(a.id);const m=a.method;if(m.kind==='render'){rescale(PROCESSES.A,m.factor);channels(m.channels);}else if(m.kind==='following'){if(!['identity','bound','universal'].includes(m.mode))throw Error('Unknown mode');if(m.mode==='bound')runFollowing(PROCESSES.A,need(m.interface,'Missing binding'),'bound',m.interface);}else throw Error('Unknown method');s.methods[a.id]=copy(m);break;}
 case 'literal':unique(a.id);s.scores[a.id]={id:a.id,name:a.name,trajectory:validateTrajectory(a.trajectory),channels:channels(a.channels),sources:[]};break;
 case 'transform':{unique(a.id);const m=need(s.methods[a.method],'Unknown method');if(m.kind!=='render')throw Error('Render method required');const e=s.episodes[a.source];const sc=e?score(e.score):score(a.source);s.scores[a.id]={id:a.id,name:a.name,trajectory:rescale(sc.trajectory,m.factor),channels:channels(m.channels),sources:e?[e.id]:[...sc.sources]};break;}
 case 'follow':case 'run':{const who=actor(a.actor);if(a.type==='follow'&&!who.methods.includes(a.method))throw Error('Practice not retained');const m=need(s.methods[a.method],'Unknown practice');if(m.kind!=='following')throw Error('Following required');if(who.remote&&!who.methods.includes(a.method))throw Error('Distant practice not received');const result=runFollowing(need(PROCESSES[a.process],'Unknown process'),a.interface,m.mode,m.interface);advance();const id=fresh('run-score');s.scores[id]={id,name:`${who.name}: ${a.process}`,trajectory:result.actual,channels:[...who.ports],sources:[]};const e=enact(who,score(id),who.ports,{kind:'run',process:a.process,interface:a.interface,method:a.method,commands:result.commands});score(id).sources=[e.id];if(!who.methods.includes(a.method))who.methods.push(a.method);break;}
 case 'recall':case 'perform':{const who=actor(a.actor),sc=score(a.score);if(a.type==='recall'&&!who.scores.includes(a.score))throw Error('Replay not retained');if(a.type==='perform'&&who.remote&&!who.scores.includes(sc.id)&&!Object.values(s.messages).some(m=>m.score===sc.id&&m.received===undefined&&(m.target===who.id||(m.role&&s.schools[m.role]?.holder===who.id)))){if(!who.ports.includes(a.channel)||!sc.channels.includes(a.channel))throw Error('Incompatible performance output port');const id=fresh('instruction');s.messages[id]={id,score:sc.id,target:who.id,invitation:false,sent:s.selections,due:s.epoch+1};break;}advance();enact(who,sc,[a.channel]);break;}
 case 'fork':{unique(a.child);const who=actor(a.actor);if(who.remote||!who.history.length)throw Error('Fork needs local lived prefix');s.actors[a.child]={...copy(who),id:a.child,name:a.name};s.families.push({a:who.id,b:a.child,prefix:[...who.history],selection:s.selections});break;}
 case 'reunion':{const family=s.families.find(f=>f.a===a.a&&f.b===a.b||f.a===a.b&&f.b===a.a);if(!family)throw Error('Not a fork family');const ea=episode(a.episodeA),eb=episode(a.episodeB);if(ea.actor!==a.a||eb.actor!==a.b||ea.selection<=family.selection||eb.selection<=family.selection||same(ea.trajectory,eb.trajectory))throw Error('Actual divergent episodes required');teach(actor(a.a),actor(a.b),ea);teach(actor(a.b),actor(a.a),eb);break;}
 case 'teach':teach(actor(a.teacher),actor(a.learner),episode(a.episode));break;
 case 'ensemble':{const sc=score(a.score);if(a.angle===a.pressure)throw Error('Two simultaneous bodies required in this finite embodiment');advance();enact(actor(a.angle),sc,['angle'],{group:`ensemble-${s.selections}`});enact(actor(a.pressure),sc,['pressure'],{group:`ensemble-${s.selections}`});break;}
 case 'send':unique(a.id);score(a.score);if(!!a.role===!!a.actor)throw Error('Exactly one role or personal destination required');if(a.role)need(s.schools[a.role],'Unknown school');if(a.actor)actor(a.actor);if(a.invitation&&!a.role)throw Error('Festival invitations require school roles');s.messages[a.id]={id:a.id,score:a.score,...(a.role?{role:a.role}:{target:a.actor}),invitation:a.invitation,sent:s.selections,due:s.epoch+1};break;
 case 'succeed':{const school=need(s.schools[a.role],'Unknown school'),successor=actor(a.successor);if(school.holder===successor.id||!successor.methods.length||successor.remote)throw Error('Distinct locally capable successor required');s.successions.push({role:a.role,former:school.holder,successor:successor.id,selection:s.selections});school.holder=successor.id;break;}
 case 'festival':{if(a.messages[0]===a.messages[1])throw Error('Distinct invitations required');advance();const ms=a.messages.map(id=>need(s.messages[id],'Unknown invitation'));if(ms.some(m=>!m.invitation||!m.role||m.received===undefined)||ms[0]!.role===ms[1]!.role||ms[0]!.score!==ms[1]!.score)throw Error('Delivered matching invitations to distinct schools required');for(const m of ms){const who=actor(s.schools[m.role!]!.holder);if(m.recipient!==who.id)throw Error('Current holder has not received invitation');const sc=score(m.score);enact(who,sc,sc.channels.filter(c=>who.ports.includes(c)),{group:`festival-${s.selections}`,role:m.role,message:m.id});}break;}
 default:throw Error('Unknown action');
 }
 s.ledger.push({selection:s.selections,action:a,automatic});return s;
}
export function endpoints(s:State):Record<string,boolean>{
 const es=Object.values(s.episodes),sc=(id:string)=>s.scores[id]!;
 const outputMatches=(e:Episode,c:Channel,t:Trajectory)=>!!e.outputs[c]&&same(e.outputs[c]!,affine(t,c==='pressure'?[1,90]:1));
 const tide=es.some(e=>outputMatches(e,'pressure',rescale(PROCESSES.Tide,[1,5]))&&e.sourceEpisodes.some(id=>{const p=s.episodes[id];return p?.process==='Tide'&&p.actor!==e.actor&&same(p.trajectory,PROCESSES.Tide);}));
 const family=s.families.some(f=>s.actors[f.a]?.alive&&s.actors[f.b]?.alive&&f.prefix.length>0&&[f.a,f.b].every((id,i)=>{const other=i?f.a:f.b;return es.some(e=>e.actor===id&&e.selection>f.selection&&e.sourceEpisodes.some(source=>{const p=s.episodes[source];return p?.actor===other&&p.kind==='run'&&p.selection>f.selection&&p.selection<e.selection&&same(e.trajectory,p.trajectory);}) );})&&es.some(a=>a.actor===f.a&&a.kind==='run'&&a.selection>f.selection&&es.some(b=>b.actor===f.b&&b.kind==='run'&&b.selection>f.selection&&!same(a.trajectory,b.trajectory))));
 const duet=es.some(a=>a.group&&outputMatches(a,'angle',PROCESSES.A)&&es.some(b=>b.group===a.group&&a.actor!==b.actor&&outputMatches(b,'pressure',PROCESSES.A)&&a.sourceEpisodes.some(id=>b.sourceEpisodes.includes(id)&&s.episodes[id]?.process==='A')));
 const reciprocal=s.successions.some(h=>s.lessons.some(l=>l.teacher===h.successor&&l.learner===h.former&&l.novel&&l.selection>h.selection&&(s.episodes[l.episode]?.selection??-1)>h.selection&&s.episodes[l.episode]?.process==='D'&&same(s.episodes[l.episode]!.trajectory,PROCESSES.D)&&es.some(e=>e.actor===h.former&&e.kind==='replay'&&!e.role&&e.selection>l.selection&&e.sourceEpisodes.includes(l.episode)&&same(e.trajectory,PROCESSES.D))));
 const distant=Object.values(s.messages).some(m=>m.received!==undefined&&!!m.recipient&&s.actors[m.recipient]?.remote&&es.some(e=>e.actor===m.recipient&&e.selection>=m.received!&&e.score===m.score&&es.some(local=>!s.actors[local.actor]!.remote&&local.score===m.score&&local.selection<m.sent&&!!local.group&&es.some(part=>part.group===local.group&&part.actor!==local.actor&&!s.actors[part.actor]!.remote&&part.score===local.score))&&es.some(life=>life.actor===m.recipient&&!life.role&&life.selection>e.selection&&same(life.trajectory,PROCESSES.B))));
 const continuity=s.successions.some(h=>Object.values(s.messages).some(m=>m.invitation&&m.role===h.role&&m.sent<h.selection&&m.received!==undefined&&m.received>h.selection&&m.recipient===h.successor&&es.some(e=>e.actor===h.successor&&e.message===m.id&&e.selection>=m.received!)&&es.some(e=>e.actor===h.former&&!e.role&&e.selection>h.selection)));
 return {shortTide:tide,divergentLives:family,sharedPerformance:duet,reciprocalSchool:reciprocal,distantLocalLives:distant,roleContinuity:continuity};
}
export function view(s:State){return copy({version:s.version,epoch:s.epoch,selections:s.selections,projects:endpoints(s),actors:s.actors,methods:s.methods,scores:s.scores,episodes:s.episodes,schools:s.schools,messages:s.messages,families:s.families,successions:s.successions,lessons:s.lessons,processes:PROCESSES});}
