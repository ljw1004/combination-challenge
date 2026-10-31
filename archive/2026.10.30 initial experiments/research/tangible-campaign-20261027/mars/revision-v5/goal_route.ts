import fs from 'node:fs';
import * as E from '../../frozen/v4/engine/model.ts';
import type {Scenario,Action} from '../../schema/scenario.ts';
const s=JSON.parse(fs.readFileSync(new URL('./scenario.json',import.meta.url),'utf8')) as Scenario;
// Variant planning removes one rescue option only; resulting actions are separately replayed on the unmodified scenario.
if(process.env.MARS_FORCE_TOW)s.recipes=s.recipes.filter(r=>r.id!=='rescue-12-sheltered-crew');
if(process.env.MARS_FORCE_BEACON){const o=s.stages[0].objectives[1];delete o.capability;o.item='signal-beacon';}
type Plan={g:E.Game,a:Action[]};
function action(p:Plan,a:Action):Plan|null{const r=E.applyAction(s,p.g,a);return r.accepted?{g:r.game,a:[...p.a,a]}:null;}
function live(p:Plan,k:string){return p.g.state.tokens.find(t=>t.kind===k&&t.area===p.g.state.currentArea);}
function ready(p:Plan,k:string,cap:string,trail:Set<string>):Plan|null{
 let q=ensure(p,k,trail);if(!q)return null;let t=live(q,k)!;if(E.capabilities(s,t).includes(cap))return q;
 const def=s.items.find(x=>x.id===k)!;
 const needed=(def.slots??[]).filter(sl=>sl.required||sl.capabilities?.includes(cap));
 if(!needed.length)return null;
 for(const sl of needed){if(t.slots[sl.id])continue;let best:Plan|null=null;
  for(const r of s.recipes.filter(r=>r.install?.target===k&&r.install.slot===sl.id)){
   let a=ensure(q,r.install!.component,new Set(trail));if(!a)continue;
   const target=live(a,k),comp=live(a,r.install!.component);if(!target||!comp)continue;
   a=action(a,{type:'combine',a:comp.id,b:target.id});if(a&&(!best||a.a.length<best.a.length))best=a;
  }
  if(!best)return null;q=best;t=live(q,k)!;
 }
 return E.capabilities(s,t).includes(cap)?q:null;
}
function ensure(p:Plan,k:string,trail=new Set<string>()):Plan|null{
 if(k.startsWith('@'))return p.g.state.places.some(x=>x.id===k.slice(1)&&x.area===p.g.state.currentArea)?p:null;
 if(live(p,k))return p;if(trail.has(k))return null;trail=new Set(trail).add(k);let best:Plan|null=null;
 for(const r of s.recipes.filter(r=>r.out===k)){
  let q=ensure(p,r.a,trail);if(!q)continue;q=ensure(q,r.b,trail);if(!q)continue;
  for(const req of r.requires??[]){q=ready(q,req.item,req.capability,trail);if(!q)break;}if(!q)continue;
  if(r.at){const target=live(q,r.b);if(!target)continue;q=action(q,{type:'place',item:target.id,location:r.at});if(!q)continue;}
  const a=r.a.startsWith('@')?r.a:live(q,r.a)?.id,b=r.b.startsWith('@')?r.b:live(q,r.b)?.id;if(!a||!b)continue;
  q=action(q,{type:'combine',a,b});if(q&&(!best||q.a.length<best.a.length))best=q;
 }
 return best;
}
function goal(p:Plan,o:any):Plan|null{
 let candidates:Plan[]=[];
 if(o.item){const q=ensure(p,o.item);if(q)candidates.push(q);}
 else for(const it of s.items.filter(it=>(it.capabilities??[]).includes(o.capability)||(it.slots??[]).some(sl=>sl.capabilities?.includes(o.capability)))){const q=ready(p,it.id,o.capability,new Set());if(q)candidates.push(q);}
 candidates=candidates.map(q=>{if(o.kind!=='place')return q;const t=q.g.state.tokens.find(t=>t.area===q.g.state.currentArea&&E.matches(s,t,o));if(!t)return null;return t.location===o.location?q:action(q,{type:'place',item:t.id,location:o.location});}).filter(Boolean) as Plan[];
 return candidates.sort((a,b)=>a.a.length-b.a.length)[0]??null;
}
let p:Plan={g:E.createGame(s),a:[]};const stages:any[]=[];let stuck:any=null;
for(let i=0;i<s.stages.length;i++){
 const st=s.stages[i];for(const o of st.objectives){const q=goal(p,o);if(!q){stuck={stage:st.id,goal:o,local:p.g.state.tokens.filter(t=>t.area===p.g.state.currentArea).map(t=>t.kind)};break;}p=q;}if(stuck)break;
 if(!E.stageComplete(s,p.g.state)){stuck={stage:st.id,remaining:E.objectiveStates(s,p.g.state)};break;}
 stages.push({id:st.id,combinations:p.g.state.metrics.combinations,items:p.g.state.tokens.filter(t=>t.area===p.g.state.currentArea).length});
 const q=action(p,{type:'advance'});if(!q)throw Error('advance failed');p=q;
}
console.log(JSON.stringify({completed:p.g.state.completed,metrics:p.g.state.metrics,stuck,stages},null,2));
fs.writeFileSync(new URL(process.env.MARS_FORCE_TOW?'./results/tow-route.json':process.env.MARS_FORCE_BEACON?'./results/beacon-route.json':'./results/goal-route.json',import.meta.url),JSON.stringify({completed:p.g.state.completed,metrics:p.g.state.metrics,stuck,stages,actions:p.a},null,2));
