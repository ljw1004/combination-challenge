/** Source-exposed construction witnesses, never fresh player evidence or minima. */
import {initial,step,endpoints,PROCESSES,type State,type Action} from './logical-ideas-history-estuary.ts';
export function wholeRoute(mode:'normal'|'complete'|'direct'='normal'){
 let s=initial(mode==='complete'?'complete':'normal');const actions:Action[]=[];
 const act=(a:Action)=>{s=step(s,a);actions.push(a);return s;};
 const last=()=>Object.values(s.episodes).at(-1)!.id;
 const run=(actor:string,process:'A'|'B'|'C'|'D'|'Tide',method='identity',inter:'normal'|'pressure'|'reversed'='normal')=>{act({type:'run',actor,process,method,interface:inter});return last();};
 const sweep=run('Mara','A'),tide=run('Mara','Tide');
 if(mode!=='complete'){
  if(mode==='normal'){
   act({type:'method',id:'tempo',method:{kind:'render',name:'Tempo Lens',factor:[1,5],channels:['angle']}});
   act({type:'transform',id:'borrowed',source:tide,method:'tempo',name:'Borrowed Tide'});
   act({type:'method',id:'loom',method:{kind:'render',name:'Sensory Loom',factor:1,channels:['pressure']}});
   act({type:'transform',id:'touch',source:'borrowed',method:'loom',name:'Tidal Touch'});
  }else{
   act({type:'method',id:'tactileTide',method:{kind:'render',name:'Direct time and channel function',factor:[1,5],channels:['pressure']}});
   act({type:'transform',id:'touch',source:tide,method:'tactileTide',name:'Direct tide instruction'});
  }
 }else act({type:'transform',id:'touch',source:tide,method:'tactileTide',name:'Tidal Touch'});
 act({type:'perform',actor:'Ilen',score:'touch',channel:'pressure'});
 act({type:'fork',actor:'Mara',child:'Traveller',name:'Mara at the inlet'});
 if(mode!=='complete'){
  if(mode==='normal'){
   act({type:'method',id:'reverse',method:{kind:'following',name:'Reversed Tracker',mode:'bound',interface:'reversed'}});
   act({type:'method',id:'pressure',method:{kind:'following',name:'Pressure Guide',mode:'bound',interface:'pressure'}});
  }else act({type:'method',id:'universal',method:{kind:'following',name:'Direct inverse instruction',mode:'universal'}});
 }
 const reverse=mode==='normal'?'reverse':'universal',pressure=mode==='normal'?'pressure':'universal';
 const local=run('Mara','A',reverse,'reversed'),journey=run('Traveller','B',pressure,'pressure');
 if(mode==='direct'){
  act({type:'teach',teacher:'Mara',learner:'Traveller',episode:local});
  act({type:'teach',teacher:'Traveller',learner:'Mara',episode:journey});
 }else act({type:'reunion',a:'Mara',b:'Traveller',episodeA:local,episodeB:journey});
 act({type:'recall',actor:'Mara',score:s.episodes[journey]!.score,channel:'angle'});
 act({type:'recall',actor:'Traveller',score:s.episodes[local]!.score,channel:'angle'});
 // Stronger normal witness: transferred controllers operate a genuinely later input too.
 if(mode==='normal'){act({type:'follow',actor:'Mara',process:'C',method:pressure,interface:'pressure'});act({type:'follow',actor:'Traveller',process:'C',method:reverse,interface:'reversed'});}
 run('Ilen','C',pressure,'pressure');
 if(mode!=='complete')act({type:'method',id:'duet',method:{kind:'render',name:'Dual-channel Canon',factor:1,channels:['angle','pressure']}});
 act({type:'transform',id:'canon',source:sweep,method:'duet',name:'Beacon Duet Score'});
 act({type:'ensemble',score:'canon',angle:'Sori',pressure:'Ilen'});
 act({type:'teach',teacher:'Mara',learner:'House',episode:local});
 act({type:'send',id:'invite-local',score:'canon',role:'Local',invitation:true});
 act({type:'send',id:'invite-far',score:'canon',role:'Far',invitation:true});
 act({type:'succeed',role:'Local',successor:'House'});
 const later=run('House','D',reverse,'reversed');
 act({type:'teach',teacher:'House',learner:'Mara',episode:later});
 act({type:'recall',actor:'Mara',score:s.episodes[later]!.score,channel:'angle'});
 act({type:'festival',messages:['invite-local','invite-far']});
 act({type:'perform',actor:'Distant',score:'baseline',channel:'angle'});
 return {mode,actions,state:s,projects:endpoints(s),selections:s.selections,automaticDeliveries:s.ledger.flatMap(x=>x.automatic).length};
}
if(process.argv[1]?.endsWith('ideas-history-estuary-routes.ts'))console.log(JSON.stringify(['normal','complete','direct'].map(mode=>{const r=wholeRoute(mode as 'normal'|'complete'|'direct');return {mode,selections:r.selections,automaticDeliveries:r.automaticDeliveries,projects:r.projects};}),null,2));
