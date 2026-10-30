import {createState,apply,goals,complete,RECIPES} from './logical-ideas-history-lives.ts';
import type {State,Action} from './logical-ideas-history-lives.ts';
import {mkdirSync,writeFileSync} from 'node:fs';
export function witness(condition:'normal'|'complete'='normal',reunion=false){let s=createState(condition);const steps:{action:Action;message:string;goals:ReturnType<typeof goals>}[]=[];const act=(a:Action)=>{const r=apply(s,a);if(!r.accepted)throw Error(JSON.stringify(a)+' '+r.message);s=r.state;steps.push({action:a,message:r.message,goals:r.goals});};
 act({a:'iona',b:'roof-weather',context:{operation:'enact'}});
 if(!s.known.includes('kinship'))act({a:'copyable-minds',b:'adoption'});
 act({a:'kinship',b:'iona'});const child=s.forks[0].child;
 act({a:child,b:'ensemble',context:{operation:'travel'}});
 act({a:child,b:'shadow-score',context:{operation:'learn'}});
 act({a:child,b:'performance',context:{operation:'enact'}});
 if(reunion){if(!s.known.includes('reunion'))act({a:'kinship',b:'restorative-practice'});act({a:'reunion',b:child,context:{recipient:'iona'}});}else act({a:child,b:'iona',context:{operation:'teach'}});
 act({a:'iona',b:'performance',context:{operation:'enact'}});
 act({a:'executor',b:'care-suite',context:{operation:'enact'}});
 return {state:s,steps,moves:s.moves,complete:complete(s)};
}
export function machineWitness(){let s=createState();const steps:Action[]=[];const go=(a:Action)=>{const r=apply(s,a);if(!r.accepted)throw Error(r.message);s=r.state;steps.push(a);};
 for(const id of ['enduring-witnesses','succession','apprentices','unowned']){const r=RECIPES.find(r=>r.id===id)!;go({a:r.a,b:r.b});}
 go({a:'apprentices',b:'executor'});go({a:'unowned',b:'executor'});go({a:'executor',b:'care-suite',context:{operation:'enact'}});
 const outsider=apply(s,{a:'executor',b:'performance',context:{operation:'enact'}});
 return {state:s,steps,moves:s.moves,complete:complete(s),outOfMandate:outsider.message};
}
export function allIdeas(){let s=createState();for(const r of RECIPES){const out=apply(s,{a:r.a,b:r.b});if(!out.accepted)throw Error(out.message);s=out.state;}return s;}
if(process.argv[1]?.endsWith('ideas-history-lives-screen.ts')){const results={ordinary:witness(),complete:witness('complete'),reunion:witness('normal',true),machine:machineWitness(),allIdeas:{moves:allIdeas().moves,goals:goals(allIdeas())}};mkdirSync('results/ideas-history-lives-screen',{recursive:true});writeFileSync('results/ideas-history-lives-screen/witnesses.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(Object.fromEntries(Object.entries(results).map(([k,v])=>[k,{moves:v.moves,...('complete'in v?{complete:v.complete}:{}),...('goals'in v?{goals:v.goals}:{})}])),null,2));}
