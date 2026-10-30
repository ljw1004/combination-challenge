import fs from 'node:fs';import assert from 'node:assert/strict';import * as E from '../../integration/release-v1/engine/model.ts';
const root=new URL('../../integration/release-v1/',import.meta.url);const results=[];
for(const name of ['elements','ideas','mars']){
 const s=JSON.parse(fs.readFileSync(new URL(`scenarios/${name}.json`,root),'utf8')),route=JSON.parse(fs.readFileSync(new URL(`routes/${name}.json`,root),'utf8'));
 let g=E.createGame(s);const states=[g.state];let catalystChecks=0,placementChecks=0,installationChecks=0,retirementChecks=0;
 for(const a of route){
  if(a.type==='combine'){
   const incoming=s.recipes.find((r:any)=>r.at&&[r.a,r.b].includes(a.a)&&[r.a,r.b].includes(a.b));
   if(incoming){const bad=structuredClone(g);for(const t of bad.state.tokens)if(t.id===a.a||t.id===a.b)t.location=null;assert.equal(E.applyAction(s,bad,a).accepted,false);const onlyReceiver=structuredClone(bad);E.token(onlyReceiver.state,a.b)!.location=incoming.at;assert.ok(E.applyAction(s,onlyReceiver,a).accepted);catalystChecks++;}
  }
  const old=g,r=E.applyAction(s,g,a);assert.ok(r.accepted,r.message);g=r.game;states.push(g.state);
  if(r.retired?.length){for(const id of r.retired)assert.ok(!E.token(g.state,id));retirementChecks+=r.retired.length;}
  if(r.updated){const prior=E.token(old.state,r.updated)!,next=E.token(g.state,r.updated)!;assert.equal(prior.id,next.id);assert.equal(prior.area,next.area);assert.equal(prior.x,next.x);assert.equal(prior.y,next.y);installationChecks++;}
  for(const goal of E.objectiveStates(s,old.state).filter(o=>o.kind==='create'&&o.satisfied))if(old.state.stage===g.state.stage)assert.ok(E.objectiveStates(s,g.state).find(o=>o.id===goal.id)?.satisfied);
  // At satisfied mission placement, ordinary movement removes only that current relation and Undo restores it exactly.
  if(a.type==='place'&&s.stages[g.state.stage].objectives.some((o:any)=>o.kind==='place'&&o.location===a.location&&E.matches(s,E.token(g.state,a.item)!,o))){
   const before=structuredClone(g.state),moved=E.applyAction(s,g,{type:'move',item:a.item,x:120,y:200});assert.ok(moved.accepted);const relevant=E.objectiveStates(s,moved.game.state).filter(o=>o.kind==='place'&&o.location===a.location&&E.matches(s,E.token(g.state,a.item)!,o));assert.ok(relevant.every(o=>!o.satisfied));assert.ok(!E.gold(s,moved.game.state).places.includes(a.location));assert.equal(E.playerView(s,moved.game).canAdvance,false);assert.equal(E.playerView(s,moved.game).completionText,null);assert.deepEqual(E.undo(moved.game).game.state.tokens,before.tokens);placementChecks++;
  }
 }
 assert.ok(g.state.completed);let checkpointChecks=0;
 for(const cp of s.checkpoints??[]){assert.deepEqual(cp.actions,route.slice(0,cp.actions.length),`${name} ${cp.id} not a route prefix`);const actual=E.checkpoint(s,cp.id);assert.deepEqual(actual.state,states[cp.actions.length]);const restored=E.restore(s,JSON.stringify(actual));assert.deepEqual(restored,actual);if(cp.id!=='complete'){assert.equal(actual.state.completed,false);const index=Number(cp.id.split('-')[1])-1;assert.equal(actual.state.stage,index);const allowed=new Set(s.stages.slice(0,index+1).flatMap((st:any)=>(st.caches??[]).map((c:any)=>c.id)));assert.ok(actual.state.openedCaches.every(c=>allowed.has(c)));}checkpointChecks++;}
 results.push({name,completed:g.state.completed,checkpointChecks,catalystChecks,placementChecks,installationChecks,retirementChecks});console.log(JSON.stringify(results.at(-1)));
}
fs.writeFileSync(new URL('./release-invariants-results.json',import.meta.url),JSON.stringify({engine:'integration/release-v1/engine/model.ts',scope:'Independent route/checkpoint/physical placement invariants, not browser layout or fun',results},null,2)+'\n');
