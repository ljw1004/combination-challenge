/** Validate artwork coverage for the canonical Settlement manuscript. */
import assert from 'node:assert/strict';
import {loadStory} from '../../src/story/load.ts';
import {lintStoryImages} from '../../src/lint/images.ts';

const {story,markdown}=loadStory('settlement');
assert.deepEqual(story.diagnostics,[]);
for(const item of Object.values(story.items)){
  assert(item.icon, `Missing icon for ${item.name}`);
  for(const slot of item.slots)assert(slot.icon, `Missing slot icon on ${item.name}`);
}
for(const hotspot of Object.values(story.hotspots)){
  assert(hotspot.icon&&hotspot.x!==undefined&&hotspot.y!==undefined, `Missing artwork or position for ${hotspot.name}`);
}
assert.deepEqual(lintStoryImages(story,markdown),[]);
console.log('Settlement has complete item, slot and hotspot artwork; all artwork paths exist.');
