import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import * as E from '../engine/model.ts';
import * as FrozenV2 from '../frozen/v2/engine/model.ts';
import type {Scenario,Action} from '../schema/scenario.ts';
const file=new URL('./scenario.json',import.meta.url),bytes=fs.readFileSync(file,'utf8'),s=JSON.parse(bytes) as Scenario;
assert.deepEqual(E.validateScenario(s),[]);
const results:any[]=[];
for(const [name,key] of [['goal-route','actions'],['tow-route','actions'],['beacon-route','actions'],['closure','events']]){
 const data=JSON.parse(fs.readFileSync(new URL(`./results/${name}.json`,import.meta.url),'utf8'));
 let g=E.createGame(s),peak=0,transitions=0;const packing:any[]=[];
 for(const [index,a] of (data[key] as Action[]).entries()){
  const before=g.state;
  if(a.type==='combine'&&a.a==='rover'&&a.b==='damaged-crawler'){
   const rover=before.tokens.find(x=>x.kind==='rover')!;
   assert.ok(E.capabilities(s,rover).includes('rover-recovery'),'Tow must use the installed recovery line');
  }
  const r=E.applyAction(s,g,a);assert.ok(r.accepted,`${name} action ${index}: ${r.message}`);g=r.game;
  assert.equal(new Set(g.state.tokens.map(x=>x.kind)).size,g.state.tokens.length,'One tangible token per item kind');
  peak=Math.max(peak,g.state.tokens.filter(x=>x.area===g.state.currentArea).length);
  if(a.type==='advance'){
   transitions++;
   assert.deepEqual(before.tokens.map(x=>x.id).sort(),g.state.tokens.map(x=>x.id).filter(id=>before.tokens.some(t=>t.id===id)).sort(),'Travel never deletes old things');
   const event=g.events.at(-1)!;
   for(const transfer of event.transfers??[]){
    const old=before.tokens.find(t=>t.id===transfer.item)!;const now=g.state.tokens.find(t=>t.id===transfer.item)!;
    assert.ok(old&&now,'Packing cannot manufacture a token');
    assert.equal(old.area,transfer.from);assert.equal(now.area,transfer.to);
    assert.ok(before.areas.some(area=>area.id===transfer.from),'Only known visited places can supply things');
    assert.equal(now.kind,old.kind);assert.deepEqual(now.slots,old.slots);assert.deepEqual(now.incorporated,old.incorporated);
   }
   for(const old of before.tokens){const now=g.state.tokens.find(t=>t.id===old.id)!;if(old.area!==now.area)assert.ok(event.transfers?.some(t=>t.item===old.id),'Every packed object has provenance');}
   packing.push({stage:s.stages[g.state.stage].id,transfers:event.transfers??[],local:g.state.tokens.filter(t=>t.area===g.state.currentArea).length});
   for(const old of before.places)assert.deepEqual(g.state.places.find(x=>x.id===old.id),old,'Places never follow the player');
  }
 }
 assert.ok(g.state.completed,`${name} completes`);
 assert.equal(g.state.metrics.visits,0,'No accidental old-stage retreat required in these witness routes');
 assert.equal(g.state.metrics.combinations,g.state.metrics.creations+g.state.metrics.installations);
 assert.equal(new Set(g.state.openedCaches).size,g.state.openedCaches.length);
 results.push({name,metrics:g.state.metrics,peakLocal:peak,transitions,packing,passed:true});
}
const slice=JSON.parse(fs.readFileSync(new URL('./slice-v2.json',import.meta.url),'utf8')) as Scenario;
assert.deepEqual(E.validateScenario(slice),[]);
const checkpoint=FrozenV2.checkpoint(slice,'weather-start');assert.equal(slice.stages[checkpoint.state.stage].id,'weather');
const record={scenarioSHA256:crypto.createHash('sha256').update(bytes).digest('hex'),checks:['schema','repair route replay','tow route replay on unmodified scenario','optical beacon route replay','closure replay','tow capability','unique tangible kinds','travel preserves things and fixed places','every packed object has visited-source provenance and unchanged identity/components','no mandatory backtracking in witnessed routes','counts exclude navigation','cache uniqueness','slice legal checkpoint'],results};
fs.writeFileSync(new URL('./results/verification.json',import.meta.url),JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify(record,null,2));
