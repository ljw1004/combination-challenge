import {campaignMilestones} from '../ui/campaign-milestones.ts';
import {toLegacyScenario} from '../compatibility/v1.ts';
import {applyMilestones} from '../ui/current-campaign.ts';
import {scenarios,integratedScenarios,optionalIntellectualScenarios} from '../ui/current-scenarios.ts';
import {validateLifecycleGraph} from './lifecycle-graph.ts';
import {validateScenario} from '../engine/campaign.ts';
import {archivedScenarioIds,validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from './lifecycle.ts';
const legacy=scenarios.map(toLegacyScenario);
const errors=[...Object.keys(campaignMilestones).filter(id=>!scenarios.some(s=>s.id===id)).map(id=>`Unknown milestone campaign ${id}`),...scenarios.flatMap(s=>validateScenario(applyMilestones(s)).map(e=>`${s.id} / ${e}`)),...validateContentLifecycles(legacy),...validateObjectiveFlow(legacy),...validateConstructionContinuity(legacy),...validateLifecycleGraph([...integratedScenarios,...optionalIntellectualScenarios].map(toLegacyScenario))];
if(errors.length){console.error('Recipe content validation failed:\n'+errors.map(e=>'  '+e).join('\n'));process.exitCode=1;}
else console.log(`Recipe content validated: ${scenarios.filter(s=>!archivedScenarioIds.has(s.id)).reduce((n,s)=>n+s.recipes.length,0)} active recipes have explicit input lifecycles; current-world graph warnings require specific review reasons.`);
