/** One composition entry for current UI and logical playtesters. Immutable
 * milestone/bridge policy tables remain in their original source modules. */
import type {Scenario} from '../schema/campaign.ts';
import {campaignChapterPolicies} from './campaign-reactivity.ts';
import {campaignMilestones} from './campaign-milestones.ts';
export function applyChapterPolicies(s:Scenario):Scenario {
 const policies=campaignChapterPolicies[s.id];if(!policies)return s;
 return {...s,chapters:s.chapters.map(chapter=>{
  const policy=chapter.onAlreadyComplete??policies[chapter.id];
  if(!policy)throw Error(`Missing already-complete chapter policy: ${s.id}/${chapter.id}`);
  return {...chapter,onAlreadyComplete:{...policy}};
 })};
}
export function applyMilestones(s:Scenario):Scenario {
 const composed=applyChapterPolicies(s),milestones=s.milestones??campaignMilestones[s.id];
 return milestones?{...composed,milestones}:composed;
}
export const getPlayableScenario=(id:string,catalogue:readonly Scenario[]):Scenario|undefined=>{const s=catalogue.find(s=>s.id===id);return s?applyMilestones(s):undefined;};
