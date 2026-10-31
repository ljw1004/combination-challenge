/** Source-exposed witnesses only; never player or fun evidence. */
import {start,combine,type World} from './ideas-history-estuary-binary.ts';
import {endpoints} from './logical-ideas-history-estuary.ts';
export function binaryRoute(scenario:'woven'|'whole-tool'|'personal-teaching'='woven'){
 let w=start();const act=(left:string,right:string)=>{w=combine(w,{left,right});return w.gestures.at(-1)!;};
 const last=(kind:string)=>w.gestures.at(-1)!.results.find(id=>w.pieces[id]!.kind===kind)!;
 act('person:Mara','watchhouse');const sweep=last('episode');
 act('person:Mara','tidepool');const tide=last('episode');
 act(tide,scenario==='whole-tool'?'whole-tide-loom':'fivefold-lens');let touch=last('score');
 if(scenario!=='whole-tool'){act(touch,'touch-loom');touch=last('score');}
 act('person:Ilen',touch);
 act('person:Mara','two-roads');const relative=last('person');
 act('person:Mara','mirror-quay');const local=last('episode');
 act(relative,'pilgrim-inlet');const journey=last('episode');
 if(scenario==='personal-teaching'){act(relative,local);act('person:Mara',journey);}else act(local,journey);
 act('person:Mara','lantern-marsh');act(relative,'mirror-marsh');
 act(sweep,'beacon-canon');const canon=last('score');
 act(canon,'beacon-pair');
 act(local,'person:House');
 act(canon,'mailbox:Local');const localInvite=last('invitation');
 act(canon,'mailbox:Far');const farInvite=last('invitation');
 act('person:House','school:Local');
 act('person:House','storm-archive');const later=last('episode');
 act(later,'person:Mara');
 act(localInvite,farInvite);
 act('person:Distant','score:baseline');
 return {scenario,world:w,projects:endpoints(w.engine),gestures:w.gestures.length,substrateCommands:w.engine.selections,automaticDeliveries:w.gestures.flatMap(g=>g.automatic).length};
}
if(process.argv[1]?.endsWith('ideas-history-estuary-binary-routes.ts')) console.log(JSON.stringify(['woven','whole-tool','personal-teaching'].map(s=>{const r=binaryRoute(s as Parameters<typeof binaryRoute>[0]);return {...r,world:undefined};}),null,2));
