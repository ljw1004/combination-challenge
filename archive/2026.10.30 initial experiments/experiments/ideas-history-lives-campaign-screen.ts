import {createState,apply,goals,complete,RECIPES} from './logical-ideas-history-lives-campaign.ts';
import type {Action} from './logical-ideas-history-lives-campaign.ts';
import {mkdirSync,writeFileSync} from 'node:fs';
export function campaignWitness(condition:'normal'|'complete'='normal',useReunion=false,useWitness=false){let s=createState(condition);const steps:{action:Action;message:string;goals:ReturnType<typeof goals>}[]=[];const act=(a:Action)=>{const r=apply(s,a);if(!r.accepted)throw Error(JSON.stringify(a)+' '+r.message);s=r.state;steps.push({action:a,message:r.message,goals:r.goals});};const discover=(id:string)=>{if(!s.known.includes(id)){const r=RECIPES.find(r=>r.id===id)!;act({a:r.a,b:r.b});}};
 act({a:'iona',b:'care-suite',context:{operation:'enact'}});discover('kinship');act({a:'kinship',b:'iona'});const child=s.forks[0].child;
 act({a:child,b:'ensemble',context:{operation:'travel'}});act({a:child,b:'shadow-score',context:{operation:'learn'}});act({a:child,b:'performance',context:{operation:'enact'}});
 if(useReunion){discover('reunion');act({a:'reunion',b:child,context:{recipient:'iona',method:'shadow-score'}});}else act({a:child,b:'iona',context:{operation:'teach',method:'shadow-score'}});
 act({a:'iona',b:'performance',context:{operation:'enact'}});
 for(const id of ['enduring-witnesses','succession','apprentices','unowned'])discover(id);
 act({a:'apprentices',b:'executor'});act({a:'unowned',b:'executor',context:{domains:['house','weather','score']}});
 act({a:'house-role',b:'executor',context:{operation:'succeed'}});
 if(useWitness)act({a:'enduring-witnesses',b:'iona',context:{recipient:'executor',method:'shadow-score'}});else act({a:'iona',b:'executor',context:{operation:'teach',method:'shadow-score'}});
 act({a:'executor',b:'performance',context:{operation:'enact'}});act({a:'executor',b:'care-suite',context:{operation:'enact'}});
 return {state:s,steps,moves:s.moves,complete:complete(s)};
}
if(process.argv[1]?.endsWith('ideas-history-lives-campaign-screen.ts')){const results={normal:campaignWitness(),complete:campaignWitness('complete'),reunionAndWitness:campaignWitness('normal',true,true)};mkdirSync('results/ideas-history-lives-campaign-screen',{recursive:true});writeFileSync('results/ideas-history-lives-campaign-screen/witnesses.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(Object.fromEntries(Object.entries(results).map(([k,v])=>[k,{moves:v.moves,complete:v.complete,goals:goals(v.state)}])),null,2));}
