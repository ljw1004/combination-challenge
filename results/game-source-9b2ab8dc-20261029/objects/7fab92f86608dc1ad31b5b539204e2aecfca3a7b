/** Test route provider: all historical route files stay exact; current locations
 * use the same accepted complete routes as their full-width/runtime probes. */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import type {Action,Scenario} from '../schema/scenario.ts';
import {toLegacyAction} from '../compatibility/v1.ts';
import {scenarios as registeredScenarios} from '../ui/current-scenarios.ts';
import {elements as stagedWaterworks} from '../ui/stories/elements-waterworks-v1.ts';
import {atlasFocusedRoute} from '../ui/stories/atlas-focused-session-route.ts';
import {foodSmallSessionRoute} from '../ui/stories/food-small-sessions-route.ts';
import {currentMarsRouteActions} from './current-mars-route-actions.ts';
const sha=(x:string)=>createHash('sha256').update(x).digest('hex');
export function acceptedTestRoute(s:Scenario):{actions:Action[];source:Record<string,unknown>} {
 // Retained location snapshots still use their exact authored location route,
 // even when they are no longer featured. Pre-location historical files stay exact.
 const current=registeredScenarios.find(x=>x.id===s.id&&x.locationPlan)??(s.id===stagedWaterworks.id?stagedWaterworks:undefined);
 if(!current){
  const path='../evidence/'+s.id+'-route-evidence.json',raw=readFileSync(new URL(path,import.meta.url),'utf8'),actions=JSON.parse(raw).actionsLog as Action[];
  return {actions:s.id==='mars-connected-survival-v4-return-cargo-research'?currentMarsRouteActions(actions):actions,source:{kind:'unchanged-historical-route-file',scenarioId:s.id,path,sha256:sha(raw),existingSolarContinuityAdapter:s.id==='mars-connected-survival-v4-return-cargo-research'}};
 }
 if(current.id==='atlas-focused-sessions-v6')return {actions:atlasFocusedRoute.map(toLegacyAction),source:{kind:'accepted-focused-Atlas-full-route',scenarioId:s.id,module:'ui/stories/atlas-focused-session-route.ts',actionsSha256:sha(JSON.stringify(atlasFocusedRoute))}};
 if(current.id==='kitchen-caravan-small-sessions-v8')return {actions:foodSmallSessionRoute.map(toLegacyAction),source:{kind:'accepted-Food-small-session-route',scenarioId:s.id,module:'ui/stories/food-small-sessions-route.ts',actionsSha256:sha(JSON.stringify(foodSmallSessionRoute))}};
 if(['elements-basket-continuity-v10','mars-purposeful-fieldwork-v8'].includes(current.id)){
  const cp=current.checkpoints!.find(c=>c.id==='complete')!;
  return {actions:cp.actions.map(toLegacyAction),source:{kind:'accepted-playtest-successor-checkpoint',scenarioId:s.id,checkpoint:cp.id,checkpointSha256:sha(JSON.stringify(cp.actions)),compositionModule:'ui/stories/current-ux-content.ts'}};
 }
 if(current.id==='elements-waterworks-v9'){
  const cp=current.checkpoints!.find(c=>c.id==='complete')!;
  return {actions:cp.actions.map(toLegacyAction),source:{kind:'accepted-reviewed-Elements-waterworks-checkpoint',scenarioId:s.id,checkpoint:cp.id,checkpointSha256:sha(JSON.stringify(cp.actions)),authoredModule:'ui/stories/elements-waterworks-v1.ts',review:'reviews/waterworks-release-20261029/independent-review/REVIEW.md'}};
 }
 if(current.id==='elements-journey-cleanup-v8'){
  const cp=current.checkpoints!.find(c=>c.id==='complete')!;
  return {actions:cp.actions.map(toLegacyAction),source:{kind:'accepted-reviewed-Elements-journey-cleanup-checkpoint',scenarioId:s.id,checkpoint:cp.id,checkpointSha256:sha(JSON.stringify(cp.actions)),authoredModule:'ui/stories/elements-journey-cleanup-v2.ts',review:'reviews/journey-cleanup-release-20261029/independent-static-review.md'}};
 }
 if(['atlas-civilization-locations-v4','atlas-selection-repairs-v5'].includes(current.id)){
  const path='../research/atlas-civilization-reviewed-20261029/canonical-route.json',raw=readFileSync(new URL(path,import.meta.url),'utf8');
  return {actions:JSON.parse(raw).actions,source:{kind:'accepted-reviewed-Atlas-civilization-authored-route',scenarioId:s.id,authoredScenarioId:'atlas-civilization-connected-v2-reviewed-20261029',path,sha256:sha(raw)}};
 }
 if(['atlas-intellectual-history-locations-v2','atlas-reading-scenes-v3'].includes(current.id)){
  const path='../evidence/intellectual-worlds-20261028/atlas-author-route.json',raw=readFileSync(new URL(path,import.meta.url),'utf8');
  return {actions:JSON.parse(raw).actionsLog,source:{kind:'accepted-Atlas-authored-route',scenarioId:s.id,path,sha256:sha(raw)}};
 }
 if(current.id==='copy-workroom-locations-v2'){
  const cp=current.checkpoints!.at(-1)!;const completion:Action[]=[{type:'combine',a:'master',b:'@window'},{type:'combine',a:'reverse',b:'stock'},{type:'place',item:'block-reflected',location:'printer-chest'},{type:'advance'}];
  return {actions:cp.actions.map(toLegacyAction).concat(completion),source:{kind:'authored-checkpoint-plus-accepted-printer-completion',scenarioId:s.id,checkpoint:cp.id,checkpointSha256:sha(JSON.stringify(cp.actions)),completion,priorAcceptance:'reviews/location-presentation/probe.ts and physical-location-runtime.test.ts'}};
 }
 const cp=current.checkpoints?.find(c=>c.id==='complete');if(!cp)throw Error('Missing accepted complete checkpoint '+s.id);
 return {actions:cp.actions.map(toLegacyAction),source:{kind:'authored-complete-checkpoint',scenarioId:s.id,checkpoint:cp.id,checkpointSha256:sha(JSON.stringify(cp.actions))}};
}
