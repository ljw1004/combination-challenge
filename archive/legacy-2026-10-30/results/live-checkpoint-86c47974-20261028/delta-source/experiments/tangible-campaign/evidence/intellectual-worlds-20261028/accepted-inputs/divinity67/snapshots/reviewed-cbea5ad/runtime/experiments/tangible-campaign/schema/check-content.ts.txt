import {applyMilestones,campaignMilestones} from '../ui/campaign-milestones.ts';
import {scenarios} from '../ui/scenarios.ts';
import {validateScenario} from '../engine/model.ts';
import {archivedScenarioIds,validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from './lifecycle.ts';
const errors=[...Object.keys(campaignMilestones).filter(id=>!scenarios.some(s=>s.id===id)).map(id=>`Unknown milestone campaign ${id}`),...scenarios.flatMap(s=>validateScenario(applyMilestones(s)).map(e=>`${s.id} / ${e}`)),...validateContentLifecycles(scenarios),...validateObjectiveFlow(scenarios),...validateConstructionContinuity(scenarios)];
if(errors.length){console.error('Recipe content validation failed:\n'+errors.map(e=>'  '+e).join('\n'));process.exitCode=1;}
else console.log(`Recipe content validated: ${scenarios.filter(s=>!archivedScenarioIds.has(s.id)).reduce((n,s)=>n+s.recipes.length,0)} active recipes have explicit input lifecycles.`);
