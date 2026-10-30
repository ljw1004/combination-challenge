import test from 'node:test';
import assert from 'node:assert/strict';
import {atlasLocations,divinityLocations,lightLocations} from '../experiments/tangible-campaign/ui/stories/intellectual-locations.ts';
import {atlasCueProse,divinityCueProse,withEssentialCueProse} from '../experiments/tangible-campaign/ui/stories/intellectual-cue-prose.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';

for(const [world,base,texts]of [['atlas',atlasLocations,atlasCueProse],['divinity',divinityLocations,divinityCueProse]] as const)test(`${world}: all essential context moves into short prose without touching gameplay or the input`,()=>{
 const snapshot=structuredClone(base),s=withEssentialCueProse(base,world);
 assert.deepEqual(base,snapshot);assert.equal(s.id,base.id);assert.deepEqual(s.locationPlan,base.locationPlan);assert.deepEqual(s.recipes,base.recipes);assert.deepEqual(s.items,base.items);
 assert.equal(Object.keys(texts).length,s.chapters.length);
 for(const ch of s.chapters){const old=base.chapters.find(c=>c.id===ch.id)!;
  assert.deepEqual(ch.objectives,old.objectives);assert.deepEqual(ch.onAlreadyComplete,old.onAlreadyComplete);assert.equal(ch.entryCue!.id,old.entryCue!.id);
  assert.equal(ch.entryCue!.sourceCaption,old.entryCue!.sourceCaption);assert.equal(ch.entryCue!.text,texts[ch.id]);assert.equal(ch.motivation,texts[ch.id]);
  assert(ch.entryCue!.text.split(/\s+/).length<=65,ch.id);
  // Every exact numerical date retained from the old attribution caption is
  // still visible in prose, including ranges and cited question numbers.
  for(const date of old.entryCue!.sourceCaption!.match(/\d+/g)??[])assert(ch.entryCue!.text.includes(date),`${ch.id}: lost ${date}`);
 }
 assert.deepEqual(M.validateScenario(s),[]);
 const g=M.createGame(base);assert.deepEqual(M.restore(s,JSON.stringify(g)),g,'presentation correction preserves an existing saved run');
});

test('parallel files and both speculative futures retain their essential boundaries',()=>{
 for(const id of ['exchange','progress-cost','invisible','experience','computing'])assert.match(atlasCueProse[id],/[Pp]arallel/);
 for(const id of ['future-laboratory','future-commons'])assert.match(atlasCueProse[id],/imagined next century—not a forecast/);
 assert.match(atlasCueProse['categories'],/intersecting/);assert.match(atlasCueProse['moving-earth-geology'],/return us to the age/);
 assert.match(divinityCueProse['opposed-origins'],/Book of Two Principles/);assert.match(divinityCueProse['hands-and-book'],/separate medieval manuscript witness/);
 assert.match(divinityCueProse['marburg-table'],/not part of one shared meeting/);assert.match(divinityCueProse['prayer-panel-fragment'],/invented fragment case/);
 assert(lightLocations.chapters.every(c=>c.entryCue!.sourceCaption==='At the text table'));
});
