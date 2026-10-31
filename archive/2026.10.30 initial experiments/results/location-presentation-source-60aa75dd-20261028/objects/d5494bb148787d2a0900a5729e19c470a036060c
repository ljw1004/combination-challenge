/** Headless integrated runtime parity and exact accepted-content boundaries; no browser. */
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
// Historical exact-position claim is retained against its sealed live217 runtime.
// Current grouped-arrival rules have separate strict logical parity + geometry tests.
import * as M from '../experiments/tangible-campaign/reviews/grouped-arrivals/predecessor/engine/model.ts';
import * as Prior from '../experiments/tangible-campaign/evidence/integration-20261028/sources/doctrine/continuation-research-20261028/revision-2-checkpoint-clarity/runtime/engine/model.ts';
import {scenarios,featuredScenarioIds,integratedScenarios,presentationFor} from '../experiments/tangible-campaign/ui/scenarios.ts';
import {scenario as elementsBefore} from '../experiments/tangible-campaign/ui/campaigns/elements.ts';
import {scenario as doctrineBefore} from '../experiments/tangible-campaign/ui/campaigns/doctrine-images-cases.ts';
import {scenario as atlas} from '../experiments/tangible-campaign/ui/campaigns/atlas.ts';
import {routeSpecs,routeActions,scenarioFor,auditRoute,digest} from '../experiments/tangible-campaign/integration/reviewed-routes.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
const root=new URL('../',import.meta.url),output=new URL('results/arrival-content-20261028/combined/',root);mkdirSync(output,{recursive:true});
const read=(p:string)=>JSON.parse(readFileSync(new URL(p,root),'utf8'));
const parent=read('experiments/tangible-campaign/evidence/integration-20261028/arrival-content-20261028/parent-source-inventory.json');
const withoutArrival=(g:M.Game)=>{const copy=structuredClone(g);for(const st of [...copy.history,copy.state])delete st.arrival;return copy;};
test('exactly six current focuses, two exact prior routes/saves, original Atlas untouched and visible',()=>{
 assert.equal(featuredScenarioIds.length,6);assert.equal(new Set(scenarios.map(s=>s.id)).size,37);
 for(const s of [elementsBefore,doctrineBefore]){assert.equal(scenarios.find(x=>x.id===s.id),s);assert(!featuredScenarioIds.includes(s.id));const g=M.checkpoint(s,s.checkpoints!.at(-1)!.id);assert.deepEqual(M.restore(s,JSON.stringify(g)),g);}
 assert(featuredScenarioIds.includes('elements-house-and-craft-v1'));assert(!featuredScenarioIds.includes('elements-opening-wheel-v1-research'));assert(scenarios.some(s=>s.id==='elements-opening-wheel-v1-research'));assert(featuredScenarioIds.includes('doctrine-language-compact-local-20261028'));assert(!featuredScenarioIds.includes(atlas.id));assert(featuredScenarioIds.includes('atlas-connected-questions-v9-evidence-repair-research'));assert.equal(scenarios.find(s=>s.id===atlas.id),atlas);
 const atlasPath='experiments/tangible-campaign/ui/campaigns/atlas.ts';assert.equal(digest(readFileSync(new URL(atlasPath,root))),parent.files[atlasPath].sha256);
 const doctrine=scenarioFor('doctrine');assert.match(presentationFor(doctrine).premise,/opening four desks/);assert.match(presentationFor(doctrine).premise,/twelve-desk/);
 assert.equal(scenarios.filter(s=>s.id.startsWith('copy-workroom-')).length,1);
 for(const p of ['elements.ts','doctrine-images-cases.ts','atlas.ts','food.ts','mars-return-cargo.ts','purpose-copy-workroom.ts']){const path='experiments/tangible-campaign/ui/campaigns/'+p;assert.equal(digest(readFileSync(new URL(path,root))),parent.files[path].sha256,p);}
});
test('historical live217 baseline preserves exact pre-arrival physical state/event/history; old saves remain playable',()=>{
 const rows=[];let actions=0;
 for(const spec of routeSpecs){const s=scenarioFor(spec.key);let current=M.createGame(s),prior=Prior.createGame(s);assert.deepEqual(withoutArrival(current),prior);let entries=1;
  for(const action of routeActions(spec.source)){const old=Prior.applyAction(s,prior,action),now=M.applyAction(s,current,action);assert(old.accepted);assert(now.accepted);current=now.game;prior=old.game;assert.deepEqual(withoutArrival(current),prior,`${s.id}: ${JSON.stringify(action)}`);actions++;
   if(action.type==='advance'&&!current.state.completed){entries++;const a=current.state.arrival!;assert.equal(a.stage,current.state.stage);assert.deepEqual(a.carried.map(x=>({item:x.item,from:x.from,to:a.area})),now.game.events.at(-1)!.transfers??[]);for(const x of a.supplies){assert(!old.game.history.at(-1)!.discovered.includes(x.item));assert.equal(M.arrivalCue(current.state,x.item),'new');}for(const x of a.carried)assert.equal(M.arrivalCue(current.state,x.item),'carried');}
  }
  assert(current.state.completed);assert.deepEqual(M.restore(s,JSON.stringify(prior)),prior,'old save must not fabricate arrivals');const packed=encodeSave({game:current,tops:{},seen:[]});assert.deepEqual(M.restore(s,JSON.stringify(decodeSave(packed).game)),current);rows.push({scenario:s.id,acceptedActions:routeActions(spec.source).length,entries,physicalStateEventsHistoryExactExceptArrival:true,legacySaveRetainsProgressWithoutInventedMetadata:true});
 }
 writeFileSync(new URL('runtime-parity.json',output),JSON.stringify({oldRuntimeSha256:digest(readFileSync(new URL('experiments/tangible-campaign/evidence/integration-20261028/sources/doctrine/continuation-research-20261028/revision-2-checkpoint-clarity/runtime/engine/model.ts',root))),actions,results:rows},null,2)+'\n');
});
test('new featured chapters still depend on previous creations; no graph/content changes elsewhere',()=>{
 for(const key of ['elements','doctrine']){const spec=routeSpecs.find(s=>s.key===key)!,s=scenarioFor(key),r=auditRoute(s,routeActions(spec.source));assert.deepEqual(r.missing,[]);assert(r.game.state.completed);assert.equal(r.game.state.metrics.combinations,key==='elements'?197:61);}
 assert.equal(integratedScenarios.length,6);
});
