import {readFileSync,writeFileSync} from 'node:fs';
import * as M from './worktree/experiments/tangible-campaign/engine/model.ts';
import {auditRoute} from '../../continuity/audit.ts';
import {validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from './worktree/experiments/tangible-campaign/schema/lifecycle.ts';
import type {Scenario,Action} from './worktree/experiments/tangible-campaign/schema/scenario.ts';
const s=JSON.parse(readFileSync(new URL('./candidate.scenario.json',import.meta.url),'utf8')) as Scenario;
const errors=[...M.validateScenario(s),...validateContentLifecycles([s]),...validateObjectiveFlow([s]),...validateConstructionContinuity([s])];if(errors.length)throw Error(errors.join('\n'));
const report:any={scenario:s.id,routes:{}};
for(const name of ['authored','beacon','tow','tow-old-alias']){
 const actions=JSON.parse(readFileSync(new URL('./'+name+'.actions.json',import.meta.url),'utf8')) as Action[];const g=M.replay(s,actions),audit=auditRoute(s,actions);if(!g.state.completed||audit.missing.length)throw Error(name+': '+JSON.stringify(audit));report.routes[name]={completed:g.state.completed,combinations:g.state.metrics.combinations,continuity:audit};
 if(name==='authored'){const e={scenario:s.id,title:s.title,actions:actions.length,actionsLog:actions,combinations:g.state.metrics.combinations,metrics:g.state.metrics,recipesTotal:s.recipes.length,completed:g.state.completed,validation:errors};for(const file of ['./candidate-route-evidence.json','./worktree/experiments/tangible-campaign/evidence/'+s.id+'-route-evidence.json'])writeFileSync(new URL(file,import.meta.url),JSON.stringify(e,null,2)+'\n');}
}
writeFileSync(new URL('./verification.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(Object.entries(report.routes).map(([name,r]:any)=>({name,combinations:r.combinations,missing:r.continuity.missing})));
