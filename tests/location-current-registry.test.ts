import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {scenarios,featuredScenarioIds,integratedScenarios,optionalIntellectualScenarios,locationSuccessorScenarios,presentationFor} from '../experiments/tangible-campaign/ui/current-scenarios.ts';
import * as before from '../experiments/tangible-campaign/ui/pre-location-scenarios.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';import {toLegacyGame,fromLegacyScenario,toLegacyScenario} from '../experiments/tangible-campaign/compatibility/v1.ts';
import {applyMilestones} from '../experiments/tangible-campaign/ui/current-campaign.ts';import {locationHarness} from '../experiments/tangible-campaign/ui/location-controller-harness.ts';
import {expectedSourceHashAfterMarsObservationStreamline} from '../experiments/tangible-campaign/integration/mars-observation-source-guard.ts';
const root=new URL('../',import.meta.url);
// Exact Site provenance reads use explicit archives where root app/docs intentionally differ. Runtime assertions remain active root.
const sourcePaths=JSON.parse(readFileSync(new URL('docs/location-hotspot-root-sync-20261028/test-context-map.json',root),'utf8')).siteSourceInputPathBySitePath;

test('six featured location successors include Copy; Light stays optional; all40 old objects remain exact',()=>{
 assert.deepEqual(featuredScenarioIds,['mars-persistent-locations-v5','atlas-intellectual-history-locations-v2','elements-river-locations-v2','kitchen-caravan-stations-v7','copy-workroom-locations-v2','divinity-disputed-questions-locations-v3']);assert.deepEqual(integratedScenarios.map(s=>s.id),featuredScenarioIds);assert.equal(scenarios.length,47);assert.equal(new Set(scenarios.map(s=>s.id)).size,47);assert.equal(optionalIntellectualScenarios.length,1);assert.match(optionalIntellectualScenarios[0].id,/light/);
 for(const old of before.scenarios){assert.equal(scenarios.find(s=>s.id===old.id),old);assert.deepEqual(fromLegacyScenario(toLegacyScenario(old)),old);const g=M.createGame(applyMilestones(old));assert.equal(M.restore(old,JSON.stringify(toLegacyGame(g))).scenarioId,old.id);}
 for(const old of [...before.integratedScenarios,...before.optionalIntellectualScenarios])assert.match(presentationFor(old).title,/^Snapshot:/);
 assert.match(readFileSync(new URL('campaign-start.html',root),'utf8'),/campaign.html\?world=mars-persistent-locations-v5/);
});
test('all seven current worlds validate, preserve v1 save envelopes under distinct keys and have one authored cue per chapter',()=>{
 for(const s of locationSuccessorScenarios){assert.deepEqual(M.validateScenario(s),[]);assert(s.chapters.every(c=>c.entryCue&&c.onAlreadyComplete));const g=M.createGame(s);assert.deepEqual(M.restore(s,JSON.stringify(toLegacyGame(g))),g);const h=locationHarness(s);assert.equal(h.key,'tangible-campaign-v1:'+s.id);assert.equal(h.button('mission').dataset['cue-id'],M.currentEntryCue(s,g)?.id);}
 const old=M.createGame(before.integratedScenarios[0]);assert.throws(()=>M.restore(integratedScenarios[0],JSON.stringify(toLegacyGame(old))),/Invalid campaign save/);
});
test('every current location binds exactly one of71 selected runtime artwork files with verified manifest hashes',()=>{
 const manifest=JSON.parse(readFileSync(new URL('experiments/tangible-campaign/reviews/location-presentation/art-manifest.json',root),'utf8'));const rows=manifest.locations??manifest.assets;assert(rows);const used=new Set<string>();
 for(const s of locationSuccessorScenarios)for(const l of s.locationPlan!.locations){assert(l.background.asset);used.add(l.background.asset!);const row=rows.find((x:any)=>x.locationId===l.id||x.id===l.id);assert(row,l.id);assert.equal(row.assetPath,l.background.asset);const data=readFileSync(new URL('public'+l.background.asset,root));const hash=createHash('sha256').update(data).digest('hex');assert.equal(hash,row.assetSha256,l.id);}
 assert.equal(used.size,71);
});
test('source successor chain preserves exact predecessor test/runtime bytes, rather than rewriting old evidence',()=>{
 const manifest=JSON.parse(readFileSync(new URL('experiments/tangible-campaign/reviews/location-presentation/source-successors.json',root),'utf8'));
 for(const [path,row]of Object.entries<any>(manifest.files)){const sha=(p:string)=>createHash('sha256').update(readFileSync(new URL(sourcePaths[p]??p,root))).digest('hex');assert.equal(sha(row.predecessorSnapshotPath),row.beforeSha256,path+' predecessor');assert.equal(sha(path),expectedSourceHashAfterMarsObservationStreamline(path,row.afterSha256),path+' successor');}
});
test('actual current chooser shows the six successor links and keeps snapshots below them',()=>{
 const h=locationHarness(integratedScenarios[0],undefined,{worlds:scenarios,search:''});const html=h.app.innerHTML,collapsed=html.indexOf('<details');assert(collapsed>0);const featured=[...html.slice(0,collapsed).matchAll(/href="\?world=([^"]+)"/g)].map(m=>decodeURIComponent(m[1]));assert.deepEqual(featured,featuredScenarioIds);for(const old of before.integratedScenarios)assert(html.slice(collapsed).includes('?world='+old.id));assert.match(html,/Snapshot:/);assert(html.includes(optionalIntellectualScenarios[0].id));
});
