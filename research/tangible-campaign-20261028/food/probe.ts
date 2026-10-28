import {readFileSync} from 'node:fs';
import {validateScenario,replay} from './engine/model.ts';
import {validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from './schema/lifecycle.ts';
const s=JSON.parse(readFileSync(new URL('./scenario.json',import.meta.url),'utf8'));
console.log([...validateScenario(s),...validateContentLifecycles([s]),...validateObjectiveFlow([s]),...validateConstructionContinuity([s])]);
for(const name of ['canonical','all-recipes','reverse-ready']){
 try{const g=replay(s,JSON.parse(readFileSync(new URL('./routes/'+name+'.json',import.meta.url),'utf8')));console.log(name,g.state.completed,g.state.metrics)}catch(e){console.error(name,(e as Error).message)}
}
