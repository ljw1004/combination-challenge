import assert from 'node:assert/strict';
import test from 'node:test';
import {applyMilestones} from '../experiments/tangible-campaign/ui/current-campaign.ts';
import {scenario as marsPrevious} from '../experiments/tangible-campaign/ui/stories/mars-return-cargo.ts';
import {scenario as elementsPrevious} from '../experiments/tangible-campaign/ui/stories/elements-house-and-craft.ts';
import {scenario as kitchenPrevious} from '../experiments/tangible-campaign/ui/stories/food-kitchen-caravan.ts';
import {scenario as copyPrevious} from '../experiments/tangible-campaign/ui/stories/purpose-copy-workroom.ts';
import {scenario as mars} from '../experiments/tangible-campaign/ui/stories/mars-locations.ts';
import {scenario as elements} from '../experiments/tangible-campaign/ui/stories/elements-locations.ts';
import {scenario as kitchen} from '../experiments/tangible-campaign/ui/stories/kitchen-locations.ts';
import {scenario as copy} from '../experiments/tangible-campaign/ui/stories/copy-workroom-locations.ts';

const cases=[{s:mars,b:marsPrevious,locations:18},{s:elements,b:elementsPrevious,locations:8},{s:kitchen,b:kitchenPrevious,locations:10},{s:copy,b:copyPrevious,locations:2}];
for(const {s,b,locations} of cases){
 test(`${s.id}: new identity preserves chapter goals, skip/bridge policy and milestones`,()=>{
  assert.notEqual(s.id,b.id);const composed=structuredClone(applyMilestones(b));
  // Only the unpublished Mars observation overlay refines these goal labels and
  // exposes its existing photograph comparison as an intermediate objective.
  if(s===mars){
   composed.chapters.find(c=>c.id==='outcrop')!.objectives.find(o=>o.item==='core-profile')!.text='Photograph core layers';
   const contrast=composed.chapters.find(c=>c.id==='contrast')!;
   contrast.objectives.unshift({id:'contrast-photographs',kind:'create',item:'paired-terrain-views',text:'Compare basin photographs',intermediate:true});
   Object.assign(contrast.objectives.find(o=>o.id==='contrast-sleeved-comparison')!,{text:'Save basin comparison',after:['contrast-photographs']});
  }
  assert.deepEqual(s.chapters.map(c=>[c.id,c.title,c.objectives,c.onAlreadyComplete]),composed.chapters.map(c=>[c.id,c.title,c.objectives,c.onAlreadyComplete]));
  assert.deepEqual(s.milestones,composed.milestones);
  assert.equal(s.locationPlan!.locations.length,locations);assert.deepEqual(s.locationPlan!.panel,{width:390,height:844});
 });
 test(`${s.id}: all ordinary stock has one real first-arrival location`,()=>{
  const original=b.initialItems.concat(b.chapters.flatMap(c=>(c.caches??[]).flatMap(c=>c.items))).filter(i=>s!==mars||!['loose-gravel-chip','orbital-cabin','scale-card','specimen-rack'].includes(i));
  const stock=s.locationPlan!.locations.flatMap(l=>l.stockBatches.flatMap(b=>b.items));
  assert.equal(new Set(stock).size,stock.length);assert.deepEqual([...stock].sort(),original.sort());assert.deepEqual(s.initialItems,[]);
  for(const c of s.chapters){assert.equal(c.caches,undefined);assert.equal(c.hotspots,undefined);assert.equal(c.carry,undefined);}
  const hotspots=s.locationPlan!.locations.flatMap(l=>l.hotspots);assert.equal(new Set(hotspots).size,hotspots.length);assert.deepEqual([...hotspots].sort(),s.hotspots.map(h=>h.id).sort());
 });
 test(`${s.id}: every real beat has one short cue, stable setting and complete visit binding`,()=>{
  const seen=new Set<string>();
  for(const c of s.chapters){
   assert.ok(c.entryCue);assert.ok(!seen.has(c.entryCue!.id));seen.add(c.entryCue!.id);
   assert.ok(c.entryCue!.text.split(/\s+/).length<=85,`${c.id}: popup too long`);
   const visit=s.locationPlan!.visits.find(v=>v.id===c.visitId)!;assert.ok(visit);assert.ok(visit.chapterIds.includes(c.id));assert.equal(visit.locationId,c.location.id);
   const location=s.locationPlan!.locations.find(l=>l.id===c.location.id)!;assert.equal(location.background.stableKey,c.location.id);assert.equal(location.background.asset,`/assets/locations/${c.location.id}.webp`);
  }
  assert.equal(s.locationPlan!.visits.flatMap(v=>v.chapterIds).length,s.chapters.length);
 });
}
test('non-Mars successors are geography/presentation overlays, not silent recipe rewrites',()=>{
 for(const {s,b} of cases.filter(x=>x.s!==mars))assert.deepEqual(s.recipes,b.recipes);
 assert.equal(elements.hotspots.find(h=>h.id==='quarry')!.label,'Iron quarry');
});
test('copy workshop chest exists with first workroom stock, not second commission',()=>{
 const workroom=copy.locationPlan!.locations.find(l=>l.id==='P02')!;assert.ok(workroom.hotspots.includes('printer-chest'));
 assert.equal(copy.chapters[1].location.id,copy.chapters[2].location.id);assert.equal(copy.chapters[2].entryCue!.mode,'beat');
 assert.deepEqual(copy.locationPlan!.visits[1].carry,['master','papers']);
});
test('Mars travel is earned by either recovery path and the actual ascent',()=>{
 const rescue=mars.chapters.find(c=>c.id==='rescue')!.travel!,home=mars.chapters.find(c=>c.id==='homebound')!.travel!;
 assert.deepEqual(rescue.afterCreated,['crawler','towed-crawler']);assert.equal(rescue.locationId,'M08');assert.equal(mars.chapters.find(c=>c.id==='camp')!.entryCue!.mode,'beat');
 assert.deepEqual(home.afterCreated,['ascending-vehicle']);assert.deepEqual(home.carry,['ascending-vehicle']);assert.equal(home.locationId,'M18');
 const pad=mars.locationPlan!.locations.find(l=>l.id==='M16')!,orbit=mars.locationPlan!.locations.find(l=>l.id==='M18')!;
 assert.ok(!pad.hotspots.includes('orbital-hatch'));assert.deepEqual(orbit.hotspots,['orbital-cabin','orbital-hatch']);assert.ok(!mars.items.some(i=>i.id==='orbital-cabin'));
 assert.equal(mars.recipes.find(r=>r.id==='homebound-12-docked-vehicle')!.b,'@orbital-cabin');
});
test('Mars sample provenance is an actual scoop action; three fiddly observation actions are removed',()=>{
 const collect=mars.recipes.find(r=>r.id==='collect-gravel-chip')!;assert.equal(collect.a,'sample-scoop');assert.equal(collect.b,'@gravel-window');assert.equal(collect.out,'loose-gravel-chip');assert.equal(collect.lifecycle!['sample-scoop'].role,'retain');
 const full=mars.checkpoints!.find(c=>c.id==='complete')!.actions;assert.equal(full.length,marsPrevious.checkpoints!.find(c=>c.id==='complete')!.actions.length+1-3);
 assert.equal(full.filter(a=>a.type==='combine'&&a.a==='sample-scoop'&&a.b==='@gravel-window').length,1);
 assert.ok(full.some(a=>a.type==='combine'&&a.a==='ascending-vehicle'&&a.b==='@orbital-cabin'));
});
