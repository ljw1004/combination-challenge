/** Browser presentation only. Frozen Estuary mechanics and v2 contracts are imported unchanged. */
import {start,combine,compatible,type World,type Piece,type Gesture} from '../experiments/ideas-history-estuary-binary.ts';
import {progress} from '../experiments/ideas-history-estuary-v2-goals.ts';
export {start,compatible};
export type {World,Piece,Gesture};
const processNames:Record<string,string>={A:'Sweep',B:'Journey',C:'Marsh Rhythm',D:'Storm Pattern',Tide:'Long Tide'};
const channels=(xs:string[])=>xs.map(x=>x==='angle'?'movement':'pressure').join(' and ');
const actorName=(w:World,id:string)=>w.engine.actors[id]?.name??'Someone';
export const isLocation=(p:Piece)=>['site','school','mailbox'].includes(p.kind);
export function friendlyName(w:World,id:string):string {
 const p=w.pieces[id];if(!p)return 'Unknown piece';
 if(p.kind==='episode'){
  const e=w.engine.episodes[p.ref!]!;
  const n=Object.values(w.engine.episodes).filter(x=>x.actor===e.actor).findIndex(x=>x.id===e.id)+1;
  return `${actorName(w,e.actor)}’s ${e.process?processNames[e.process]:'replay'} · memory ${n}`;
 }
 if(p.kind==='score'){
  const e=Object.values(w.engine.episodes).find(e=>e.score===p.ref&&e.kind==='run');
  if(e)return `${actorName(w,e.actor)}’s ${processNames[e.process!]} score`;
  for(const g of w.gestures){const c=g.commands.find(c=>c.type==='transform'&&c.id===p.ref);if(c?.type==='transform'){
   const source=w.pieces[`episode:${c.source}`]?`episode:${c.source}`:`score:${c.source}`;
   const name=friendlyName(w,source).replace(/ · memory \d+$/,'');
   const prefix:Record<string,string>={tempo:'Shortened',loom:'Tactile',duet:'Movement & pressure',tactileTide:'Short tactile'};
   return `${prefix[c.method]??'Rendered'} ${name.replace(/ score$/,'')} score`;
  }}
 }
 if(p.kind==='invitation'){
  const m=w.engine.messages[p.ref!]!;
  return `${m.role} invitation · ${friendlyName(w,`score:${m.score}`)}`;
 }
 return p.name;
}
export function describePiece(w:World,id:string):string {
 const p=w.pieces[id];if(!p)return 'This piece is not present.';
 const e=p.kind==='episode'?w.engine.episodes[p.ref!]:undefined;
 if(e){
  const ancestry=e.sourceEpisodes.map(s=>w.engine.episodes[s]).filter(Boolean).map(s=>`${actorName(w,s!.actor)}’s ${s!.process?processNames[s!.process]:'replayed'} experience`);
  return `${actorName(w,e.actor)} ${e.kind==='run'?'lived this firsthand':'actually replayed this'} through ${channels(Object.keys(e.outputs))}. ${e.process?`The experience was ${processNames[e.process]}. `:''}${ancestry.length?`It carries lived ancestry from ${[...new Set(ancestry)].join(', ')}. `:''}${e.group?'This happened together with another person. ':''}This memory remains available; its owner continues to live.`;
 }
 if(p.kind==='person'){
  const a=w.engine.actors[p.ref!]!;const role=Object.values(w.engine.schools).filter(s=>s.holder===a.id).map(s=>s.id);
  return `${a.remote?'A distant':'A local'} person who expresses ${channels(a.ports)}. ${role.length?`Currently holds the ${role.join(' and ')} School role. `:''}${a.history.length} lived memories and ${a.scores.length} retained scores. Experiences and capabilities are not used up.${a.ports.length>1?' Solo dual-channel scores use movement; a single-channel score uses its own channel.':''}`;
 }
 if(p.kind==='score'){
  const s=w.engine.scores[p.ref!]!;return `An expressible pattern for ${channels(s.channels)}. ${s.sources.length?`Made from ${s.sources.map(e=>friendlyName(w,`episode:${e}`)).join('; ')}.`:'This is an existing score without lived source ancestry.'} It remains available after use.`;
 }
 if(p.kind==='site')return `${p.name} is a place to live ${processNames[p.process!]}. ${p.interface==='pressure'?'Its practice senses through pressure.':p.interface==='reversed'?'Its local practice follows through reversed movement.':'Its practice follows directly through movement.'} A visit creates a real experience and retains the practice.`;
 if(p.kind==='school')return `${p.name} is a continuing role, currently held by ${actorName(w,w.engine.schools[p.ref!]!.holder)}. A handover changes who receives role invitations; the former holder remains a person with their own life.`;
 if(p.kind==='mailbox')return `A destination for score invitations to the ${p.ref} School. Invitations arrive at the next activity, addressed to whoever holds the role then. Sending and handover alone do not advance activity.`;
 if(p.kind==='invitation'){
  const m=w.engine.messages[p.ref!]!;return `An invitation for ${friendlyName(w,`score:${m.score}`)}. ${m.received===undefined?'It is in flight, awaiting the next activity.':`It has arrived with ${actorName(w,m.recipient!)}.`}`;
 }
 if(p.kind==='tool')return ({tempo:'A reusable lens that shortens a pattern to one fifth of its duration, expressed through movement.',loom:'A reusable loom that renders the same pattern through pressure.',duet:'A reusable method that gives a pattern both movement and pressure expressions.',tactileTide:'A reusable method that shortens a pattern to one fifth of its duration and expresses it through pressure.'} as Record<string,string>)[p.method!]??'A reusable method.';
 if(p.kind==='duo')return `${actorName(w,p.angle!)} expresses movement and ${actorName(w,p.pressure!)} expresses pressure. They remain distinct people when they perform together.`;
 if(p.kind==='roads')return 'A continuing relative shares the person’s actual lived past. Both people remain present, able to live different futures.';
 return p.description;
}
export function applyGesture(before:World,left:string,right:string):{world:World;feedback:string[];created:string[]} {
 const world=combine(before,{left,right}),g=world.gestures.at(-1)!;const feedback:string[]=[];
 for(const e of Object.values(world.engine.episodes).filter(e=>!before.engine.episodes[e.id]))feedback.push(`${actorName(world,e.actor)} ${e.kind==='run'?`lived ${processNames[e.process!]}`:'replayed a lived pattern'} through ${channels(Object.keys(e.outputs))}${e.group?' together with another person':''}.`);
 for(const f of world.engine.families.slice(before.engine.families.length))feedback.push(`${actorName(world,f.b)} continues alongside ${actorName(world,f.a)}, sharing their lived past.`);
 for(const h of world.engine.successions.slice(before.engine.successions.length))feedback.push(`${actorName(world,h.successor)} now holds ${h.role} School; ${actorName(world,h.former)} continues personally.`);
 for(const m of Object.values(world.engine.messages)){
  if(!before.engine.messages[m.id])feedback.push(`${m.invitation?'An invitation':'Personal instruction'} was sent ${m.role?`to ${m.role} School`:`to ${actorName(world,m.target!)}`}.`);
  if(m.received!==undefined&&before.engine.messages[m.id]?.received===undefined)feedback.push(`Delivery reached ${actorName(world,m.recipient!)}; the score is now retained.`);
 }
 for(const id of g.results.filter(id=>world.pieces[id]!.kind==='score'&&!Object.values(world.engine.episodes).some(e=>e.score===world.pieces[id]!.ref&&e.kind==='run')))feedback.push(`Created ${friendlyName(world,id)}.`);
 for(const id of g.results.filter(id=>world.pieces[id]!.kind==='duo'))feedback.push(`Formed ${friendlyName(world,id)} as a reusable pair.`);
 const old=progress(before.engine),next=progress(world.engine);
 for(const key of Object.keys(next) as (keyof typeof next)[])if(next[key].complete&&!old[key].complete)feedback.push(next[key].reason);
 return {world,feedback:feedback.length?feedback:['Their relationship changed; both pieces remain available.'],created:g.results};
}
/** Source-exposed debug checkpoints: real replayed gestures, never player/fun evidence. */
function route():Gesture[]{
 let w=start();const act=(left:string,right:string)=>{w=combine(w,{left,right});};
 const last=(kind:Piece['kind'])=>w.gestures.at(-1)!.results.find(id=>w.pieces[id]!.kind===kind)!;
 act('person:Mara','watchhouse');const sweep=last('episode');
 act('person:Mara','tidepool');const tide=last('episode');
 act(tide,'fivefold-lens');act(last('score'),'touch-loom');act('person:Ilen',last('score'));
 act('person:Mara','two-roads');const relative=last('person');
 act('person:Mara','mirror-quay');const local=last('episode');
 act(relative,'pilgrim-inlet');act(local,last('episode'));
 act('person:Mara','lantern-marsh');act(relative,'mirror-marsh');
 act(sweep,'beacon-canon');const canon=last('score');act(canon,'beacon-pair');
 act(local,'person:House');act(canon,'mailbox:Local');const invitation=last('invitation');
 act(canon,'mailbox:Far');const far=last('invitation');act('person:House','school:Local');
 act('person:House','storm-archive');act(last('episode'),'person:Mara');act(invitation,far);act('person:Distant','score:baseline');
 return w.gestures.map(g=>g.input);
}
export const CHECKPOINTS=[{key:'start',label:'Fresh start',count:0},{key:'tactile',label:'After a tactile memory',count:5},{key:'relatives',label:'After relatives exchange experiences',count:9},{key:'handover',label:'After school handover',count:17},{key:'complete',label:'Whole authored route (debug)',count:21}];
export function checkpointWorld(key:string):World {const checkpoint=CHECKPOINTS.find(c=>c.key===key);if(!checkpoint)throw Error('Unknown checkpoint');let w=start();for(const g of route().slice(0,checkpoint.count))w=combine(w,g);return w;}
