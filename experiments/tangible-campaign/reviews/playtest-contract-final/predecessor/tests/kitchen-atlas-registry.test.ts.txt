/** Current source/data/save integration contract. No native browser or layout claim. */
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
import {scenario as food} from '../experiments/tangible-campaign/ui/campaigns/food-kitchen-caravan.ts';
import {scenario as oldFood} from '../experiments/tangible-campaign/ui/campaigns/food.ts';
import {scenario as miniature} from '../experiments/tangible-campaign/ui/campaigns/atlas-miniature-research.ts';
import {scenario as atlas} from '../experiments/tangible-campaign/ui/campaigns/atlas.ts';
import {scenarios,featuredScenarioIds,presentationFor} from '../experiments/tangible-campaign/ui/scenarios.ts';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
import {auditRoute,routeActions} from '../experiments/tangible-campaign/integration/reviewed-routes.ts';
const root=new URL('../',import.meta.url),output=new URL('results/kitchen-atlas-20261028/registry/',root);fs.mkdirSync(output,{recursive:true});
const read=(p:string)=>JSON.parse(fs.readFileSync(new URL(p,root),'utf8')),sha=(p:string)=>createHash('sha256').update(fs.readFileSync(new URL(p,root))).digest('hex');
const sourceRoot='experiments/tangible-campaign/evidence/integration-20261028/sources/';
test('Food and optional Atlas are exact accepted data with separate save IDs; six focuses remain',()=>{
 assert.deepEqual(food,read(sourceRoot+'food-v6-ten-kitchens/scenario.json'));assert.equal(sha(sourceRoot+'food-v6-ten-kitchens/scenario.json'),'cafffa9f25754d3246c3ad4f2a212a7dd451c432c2927df92757ef1a3149b1c7');
 assert.deepEqual(miniature,read(sourceRoot+'optional-atlas-miniature/philosophy-miniature-v2/scenario.json'));assert.equal(sha(sourceRoot+'optional-atlas-miniature/philosophy-miniature-v2/scenario.json'),'31bd0d36bb083fe7e7d9a828f6373ec626377f3c276c042a3b50348526ca868b');
 assert.equal(featuredScenarioIds.length,6);assert(featuredScenarioIds.includes(food.id));assert(!featuredScenarioIds.includes(oldFood.id));assert(!featuredScenarioIds.includes(atlas.id));assert(!featuredScenarioIds.includes('atlas-connected-questions-v9-evidence-repair-research'));assert(scenarios.some(x=>x.id==='atlas-connected-questions-v9-evidence-repair-research'));assert(featuredScenarioIds.includes('atlas-intellectual-history-v1-research'));assert(!featuredScenarioIds.includes(miniature.id));assert.equal(new Set(scenarios.map(s=>s.id)).size,scenarios.length);
 for(const s of [oldFood,atlas])assert.equal(scenarios.find(x=>x.id===s.id),s);
 assert.match(presentationFor(miniature).title,/Optional experiment/);assert.match(presentationFor(food).premise,/supper and provisions/);
});
test('played Food and original Atlas remain byte-identical; every old save route still resolves',()=>{
 const parent=read('experiments/tangible-campaign/evidence/integration-20261028/kitchen-atlas-20261028/parent-source-inventory.json');
 for(const name of ['food.ts','atlas.ts']){const path='experiments/tangible-campaign/ui/campaigns/'+name;assert.equal(sha(path),parent.files[path].sha256);}
 const rows=[];
 for(const s of [food,oldFood,miniature,atlas]){const c=s.checkpoints!.at(-1)!,g=M.checkpoint(s,c.id);const packed=encodeSave({game:g,tops:{},seen:[]}),decoded=decodeSave(packed);assert.deepEqual(M.restore(s,JSON.stringify(decoded.game)),g);for(const other of [food,oldFood,miniature,atlas])if(other.id!==s.id)assert.throws(()=>M.restore(other,JSON.stringify(decoded.game)));rows.push({id:s.id,checkpoint:c.id,exactSaveRoundtrip:true,separateIdentity:true});}
 fs.writeFileSync(new URL('save-identities.json',output),JSON.stringify(rows,null,2)+'\n');
});
test('new Food route and optional Atlas route require earlier goal-connected creations',()=>{
 const rows=[];for(const [s,actions]of [[food,routeActions('food-v6-ten-kitchens/routes/plain-vinaigrette.json')],[miniature,read(sourceRoot+'optional-atlas-miniature/philosophy-miniature-v2/author-route.json').actionsLog]]as const){const r=auditRoute(s,actions);assert(r.game.state.completed);assert.deepEqual(r.missing,[]);rows.push({id:s.id,combinations:r.game.state.metrics.combinations,laterGoalConnected:r.rows.length-1,rows:r.rows});}fs.writeFileSync(new URL('goal-continuity.json',output),JSON.stringify(rows,null,2)+'\n');
});
