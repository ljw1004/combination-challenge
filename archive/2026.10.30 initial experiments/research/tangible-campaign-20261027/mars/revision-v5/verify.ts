import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import * as E from '../../frozen/v4/engine/model.ts';
const bytes=fs.readFileSync(new URL('./scenario.json',import.meta.url),'utf8'),s=JSON.parse(bytes);assert.deepEqual(E.validateScenario(s),[]);const results=[];
for(const [name,key] of [['goal-route','actions'],['tow-route','actions'],['beacon-route','actions'],['closure','events']]){
 const actions=JSON.parse(fs.readFileSync(new URL(`./results/${name}.json`,import.meta.url),'utf8'))[key];let g=E.createGame(s),peak=0;const scenes:any[]=[];let start=0;const catalystTests:string[]=[];let identityChecks=0,provenanceChecks=0;
 for(const a of actions){const before=g.state;
  if(a.type==='combine'){
   const at=s.recipes.find((r:any)=>r.at&&r.a===a.a&&r.b===a.b);
   if(at){const wrong=structuredClone(g);wrong.state.tokens.find((t:any)=>t.id===a.b)!.location=null;assert.equal(E.applyAction(s,wrong,a).accepted,false,'Catalyst is not an arbitrary decorative place');catalystTests.push(at.id);}
  }
  const result=E.applyAction(s,g,a);assert.ok(result.accepted,`${name}: ${result.message}`);g=result.game;
  assert.equal(new Set(g.state.tokens.map(t=>t.kind)).size,g.state.tokens.length);
  const event=g.events.at(-1)!;
  if(event.installed){const r=s.recipes.find((r:any)=>r.id===event.recipe);const old=before.tokens.find(t=>t.kind===r.install.target)!,now=g.state.tokens.find(t=>t.kind===r.install.target)!;assert.equal(now.id,old.id);identityChecks++;}
  for(const t of event.transfers??[]){const old=before.tokens.find(x=>x.id===t.item)!,now=g.state.tokens.find(x=>x.id===t.item)!;assert.ok(old&&now);assert.equal(old.area,t.from);assert.equal(now.area,t.to);assert.deepEqual(old.slots,now.slots);provenanceChecks++;}
  for(const place of before.places)assert.deepEqual(g.state.places.find(x=>x.id===place.id),place);
  peak=Math.max(peak,g.state.tokens.filter(t=>t.area===g.state.currentArea).length);
  if(a.type==='advance'){const st=before.stage;scenes.push({id:s.stages[st].id,combinations:before.metrics.combinations-start,localEnd:before.tokens.filter(t=>t.area===before.currentArea).length});start=before.metrics.combinations;}
 }
 assert.ok(g.state.completed);assert.equal(g.state.metrics.visits,0);assert.equal(g.state.metrics.combinations,g.state.metrics.creations+g.state.metrics.installations);assert.equal(catalystTests.length,3);
 results.push({name,metrics:g.state.metrics,peakLocal:peak,catalystTests,identityChecks,provenanceChecks,scenes});
}
const out={scenarioSHA256:crypto.createHash('sha256').update(bytes).digest('hex'),engine:'frozen/v4',evidenceKind:'author-informed mechanical witnesses, not fresh-player evaluation',catalogue:s.recipes.length,results};fs.writeFileSync(new URL('./results/verification.json',import.meta.url),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));
