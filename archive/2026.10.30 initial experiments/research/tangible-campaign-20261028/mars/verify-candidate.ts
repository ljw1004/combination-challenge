import {readFileSync,writeFileSync} from 'node:fs';
import * as M from './worktree/experiments/tangible-campaign/engine/model.ts';
import {auditRoute} from '../continuity/audit.ts';
import type {Action,Scenario} from './worktree/experiments/tangible-campaign/schema/scenario.ts';
const s=JSON.parse(readFileSync(new URL('./candidate.scenario.json',import.meta.url),'utf8')) as Scenario;
const actions=JSON.parse(readFileSync(new URL('./candidate.actions.json',import.meta.url),'utf8')) as Action[];
const combine=(a:string,b:string):Action=>({type:'combine',a,b});
const beacon:Action[]=[combine('broken-radio','cable'),combine('reflective-foil','support-frame'),combine('lamp','battery'),combine('lantern','reflector'),combine('signal-lamp','tripod'),{type:'place',item:'signal-beacon',location:'contact-ridge'},{type:'advance'}];
let stage=0;for(const a0 of actions){const a=structuredClone(a0);if(stage>0){if(stage===1&&a.type==='place'&&a.location==='refuge-contact-mast')a.item='signal-beacon';if(stage===1&&beacon.at(-1)?.type==='advance')beacon.push(combine('solar-panel','battery'));if(stage===7&&a.type==='combine'&&a.a==='solar-radio')beacon.push(combine('radio','solar-charger'));beacon.push(a);}if(a.type==='advance')stage++;}
const tow:Action[]=[];stage=0;for(const a0 of actions){const a=structuredClone(a0);if(stage===6&&a.type==='combine'&&['spare-drive','serviced-drive','replacement-drive'].includes(a.a)){if(a.a==='spare-drive')tow.push(combine('recovery-rope','tow-eye'),combine('tow-line','rover'),combine('rover','damaged-crawler'));continue;}if(stage===6&&a.type==='combine'&&a.a==='crawler'&&a.b==='rest-refuge')a.a='towed-crawler';if(stage===13&&tow.at(-1)?.type==='advance')tow.push(combine('spare-drive','toolkit'),combine('serviced-drive','drive-coupling'),combine('replacement-drive','towed-crawler'));tow.push(a);if(a.type==='advance')stage++;}
const routes={authored:actions,beacon, tow};
const report:any={scenario:s.id,routes:{}};
for(const [name,route]of Object.entries(routes)){
 const g=M.replay(s,route);const audit=auditRoute(s,route);if(!g.state.completed||audit.missing.length)throw Error(name+': '+JSON.stringify(audit));
 report.routes[name]={completed:g.state.completed,actions:route.length,combinations:g.state.metrics.combinations,continuity:audit};
 writeFileSync(new URL('./'+name+'.actions.json',import.meta.url),JSON.stringify(route,null,2)+'\n');
 if(name==='authored'){
  const evidence={scenario:s.id,title:s.title,stages:s.stages.length,actions:route.length,actionsLog:route,combinations:g.state.metrics.combinations,metrics:g.state.metrics,recipesTotal:s.recipes.length,completed:g.state.completed,validation:[],ending:s.stages.at(-1)?.completionText};
  writeFileSync(new URL('./worktree/experiments/tangible-campaign/evidence/'+s.id+'-route-evidence.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');
  writeFileSync(new URL('./candidate-route-evidence.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');
 }
}
writeFileSync(new URL('./verification.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
