/** New public consequence contracts; old substrate and all captures remain unchanged. */
import {endpoints as original,initial,type State,type Episode} from './logical-ideas-history-estuary.ts';
import {affine,trajectoriesEqual as same} from './ideas-history-estuary-signals.ts';
export const OBJECTIVES={
 shortTide:'Let someone experience another person’s Long Tide in a shorter, tactile form.',
 divergentLives:'Let two continuing relatives diverge, then each actually experience something lived by the other.',
 sharedPerformance:'Let distinct people express one actual Sweep together through movement and pressure.',
 reciprocalSchool:'After a school handover, let the successor live a new firsthand occurrence and the former holder replay that experience. A familiar trajectory counts: new provenance is not necessarily a new skill.',
 distantLocalLives:'Let an actually shared local score travel and be performed far away without losing the distant person’s prior repertoire. Retained capabilities already preserve it; no demonstration replay is required.',
 roleContinuity:'Let an invitation sent before handover reach the successor, who enacts its score, while the former holder continues personally. Solo or joint enactment both count.'
};
export function progress(s:State){
 const es=Object.values(s.episodes),ms=Object.values(s.messages),old=original(s);
 const reciprocalWitness=s.successions.flatMap(h=>es.filter(e=>e.actor===h.successor&&e.kind==='run'&&e.selection>h.selection).map(e=>({h,e,replay:es.find(r=>r.actor===h.former&&r.selection>e.selection&&r.sourceEpisodes.includes(e.id)&&same(r.trajectory,e.trajectory))}))).find(x=>x.replay);
 const hasLater=s.successions.some(h=>es.some(e=>e.actor===h.successor&&e.kind==='run'&&e.selection>h.selection));
 // Same score or an unchanged source-derived rendition, through an invited
 // output channel. Trajectory ancestry alone cannot turn angle into pressure.
 const enacts=(e:Episode,score:string)=>{
  const invited=s.scores[score]!;
  return same(e.trajectory,invited.trajectory)&&invited.channels.some(c=>e.outputs[c]&&same(e.outputs[c]!,affine(invited.trajectory,c==='pressure'?[1,90]:1)))&&(e.score===score||(invited.sources.length>0&&invited.sources.every(id=>e.sourceEpisodes.includes(id))));
 };
 const jointLocal=(score:string,before:number)=>es.some(e=>enacts(e,score)&&e.selection<before&&!s.actors[e.actor]!.remote&&e.group&&es.some(p=>p.group===e.group&&p.actor!==e.actor&&!s.actors[p.actor]!.remote&&enacts(p,score)));
 const remoteMessages=ms.filter(m=>m.recipient&&s.actors[m.recipient]?.remote&&m.received!==undefined&&jointLocal(m.score,m.sent));
 const remoteWitness=remoteMessages.map(m=>{
  const person=s.actors[m.recipient!]!;
  const prior=[...new Set([...(initial().actors[person.id]?.scores??[]),...es.filter(e=>e.actor===person.id&&e.selection<m.received!).map(e=>e.score),...ms.filter(x=>x.recipient===person.id&&x.received!==undefined&&x.received<m.received!).map(x=>x.score)])];
  return {m,prior,enacted:es.some(e=>e.actor===person.id&&enacts(e,m.score)&&e.selection>=m.received!),retained:prior.every(id=>person.scores.includes(id))};
 }).find(x=>x.enacted&&x.retained);
 const routed=s.successions.flatMap(h=>ms.filter(m=>m.invitation&&m.role===h.role&&m.sent<h.selection&&m.received!==undefined&&m.received>h.selection&&m.recipient===h.successor).map(m=>({h,m})));
 const roleWitness=routed.find(({h,m})=>es.some(e=>e.actor===h.successor&&e.selection>=m.received!&&enacts(e,m.score))&&es.some(e=>e.actor===h.former&&!e.role&&e.selection>h.selection));
 return {
 shortTide:{complete:old.shortTide!,reason:old.shortTide?'Another person enacted the shortened tactile Tide from lived ancestry.':'No shortened tactile enactment of another person’s lived Tide yet.'},
 divergentLives:{complete:old.divergentLives!,reason:old.divergentLives?'Both relatives lived different continuations and replayed one another’s experiences.':'Needs a shared lived prefix, different later lives, and actual replay in both directions.'},
 sharedPerformance:{complete:old.sharedPerformance!,reason:old.sharedPerformance?'Two people jointly expressed a lived Sweep in movement and pressure.':'No joint movement-and-pressure enactment of an actual Sweep yet.'},
 reciprocalSchool:{complete:!!reciprocalWitness,reason:reciprocalWitness?'The former holder replayed the successor’s later firsthand occurrence; its trajectory may already be familiar.':hasLater?'The successor has a later firsthand occurrence; the former holder has not replayed it.':s.successions.length?'No successor firsthand occurrence after handover yet.':'No school handover yet.'},
 distantLocalLives:{complete:!!remoteWitness,reason:remoteWitness?`The shared score was enacted remotely; ${remoteWitness.prior.length} prior retained score capability/capabilities remain available, without a proof replay.`:remoteMessages.length?'The shared score arrived; no remote enactment with prior repertoire retained yet.':'No locally shared score has arrived at a distant person yet.'},
 roleContinuity:{complete:!!roleWitness,reason:roleWitness?'The invitation reached the successor and its score was enacted; the former holder continued personally.':routed.length?'The invitation reached the successor; its enactment and the former holder’s personal continuation are not both recorded yet.':'No pre-handover invitation has reached its successor yet.'}
 };
}
export function endpoints(s:State):Record<string,boolean>{return Object.fromEntries(Object.entries(progress(s)).map(([key,value])=>[key,value.complete]));}
