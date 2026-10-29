import assert from 'node:assert/strict';
import test from 'node:test';
import type {Action,Scenario} from '../experiments/tangible-campaign/schema/campaign.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import {scenario as mars} from '../experiments/tangible-campaign/ui/stories/mars-locations.ts';
import {scenario as elements} from '../experiments/tangible-campaign/ui/stories/elements-locations.ts';
import {scenario as kitchen} from '../experiments/tangible-campaign/ui/stories/kitchen-locations.ts';
import {scenario as copy} from '../experiments/tangible-campaign/ui/stories/copy-workroom-locations.ts';
const copyRoute:Action[]=copy.checkpoints!.at(-1)!.actions.concat([{type:'combine',a:'master',b:'@window'},{type:'combine',a:'reverse',b:'stock'},{type:'place',item:'block-reflected',hotspot:'printer-chest'},{type:'advance'}]);
const withoutMetrics=(state:M.State)=>{const {metrics,...rest}=state;return rest;};
const route=(s:Scenario)=>s===copy?copyRoute:s.checkpoints!.find(c=>c.id==='complete')!.actions;
for(const s of [copy,elements,kitchen,mars])for(const width of [320,375,390,600])test(`${s.id} ${width}: complete route; stationary beats/returns; durable state and bounded tokens`,()=>{
 let g=M.createGame(s,width);assert.equal(g.state.width,Math.min(390,width));
 for(const [i,action] of route(s).entries()){
  const before=structuredClone(g.state),r=M.applyAction(s,g,action);assert.equal(r.accepted,true,`action ${i+1}: ${r.message}`);g=r.game;
  if(action.type==='advance'&&before.chapter!==g.state.chapter){
   if(before.storyLocation===g.state.storyLocation){assert.deepEqual(g.state.tokens,before.tokens,'same-place tokens');assert.deepEqual(g.state.hotspots,before.hotspots,'same-place hotspots');}
   else{for(const prior of before.tokens.filter(t=>t.location===g.state.storyLocation))assert.deepEqual(M.token(g.state,prior.id),prior,'return resident');for(const prior of before.hotspots.filter(t=>t.location===g.state.storyLocation))assert.deepEqual(g.state.hotspots.find(t=>t.id===prior.id),prior,'return hotspot');}
   assert.deepEqual(withoutMetrics(M.undo(g).game.state),withoutMetrics(before),'Undo entry');assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state,'restore entry');
  }
  if(action.type==='advance'){
   const area=(a:M.Token,b:M.Token)=>Math.max(0,96-Math.abs(a.x-b.x))*Math.max(0,(M.tokenHeight(s,a)+M.tokenHeight(s,b))/2-Math.abs(a.y-b.y));
   for(const t of g.state.tokens.filter(t=>M.token(before,t.id)&&M.token(before,t.id)!.location!==t.location))for(const b of g.state.tokens.filter(b=>b.id!==t.id&&b.location===t.location&&M.token(before,b.id))){const a0=M.token(before,t.id)!,b0=M.token(before,b.id)!;assert(area(t,b)<=(a0.location===b0.location?area(a0,b0):0)+.01,`arrival must not add overlap: action ${i+1} ${t.id}/${b.id}`);}
  }
  for(const t of g.state.tokens){assert.ok(t.x>=48&&t.x<=g.state.width-48,`${t.id} horizontal bounds`);assert.ok(t.y-M.tokenHeight(s,t)/2>=0&&t.y+M.tokenHeight(s,t)/2<=844,`${t.id} vertical bounds`);}
 }
 assert.equal(g.state.completed,true);
});
test('copy commissions may be completed ahead without re-grant, re-layout or new popup',()=>{
 let g=M.replay(copy,copy.checkpoints![0].actions);
 const actions:Action[]=[{type:'combine',a:'master',b:'@window'},{type:'combine',a:'reverse',b:'stock'},{type:'place',item:'block-reflected',hotspot:'printer-chest'},{type:'combine',a:'master',b:'stock'},{type:'place',item:'block-readable',hotspot:'display-frame'}];
 for(const a of actions){const r=M.applyAction(copy,g,a);assert.ok(r.accepted,r.message);g=r.game;}
 const before=structuredClone(g.state),r=M.applyAction(copy,g,{type:'advance'});assert.ok(r.accepted,r.message);g=r.game;assert.ok(g.state.completed);assert.ok(g.state.skippedChapters!.includes('printer-commission'));assert.equal(M.currentEntryCue(copy,g),null);assert.deepEqual(g.state.tokens,before.tokens);assert.deepEqual(g.state.hotspots,before.hotspots);assert.deepEqual(g.state.openedCaches,before.openedCaches);
});
test('both crawler recovery paths reach the same camp once, with stock and optional repair kit',()=>{
 const all=route(mars),start=all.findIndex(a=>a.type==='combine'&&a.a==='spare-drive'&&a.b==='toolkit');
 assert(start>=0);assert.deepEqual(all.slice(start,start+3),[{type:'combine',a:'spare-drive',b:'toolkit'},{type:'combine',a:'serviced-drive',b:'drive-coupling'},{type:'combine',a:'replacement-drive',b:'damaged-crawler'}]);
 const alternate:Action[]=all.slice(0,start).concat([{type:'combine',a:'recovery-rope',b:'tow-eye'},{type:'combine',a:'rover',b:'tow-line'},{type:'combine',a:'rover',b:'damaged-crawler'}],all.slice(start+3).flatMap(a=>{
  if(a.type==='combine'&&a.a==='crawler'&&a.b==='rest-refuge')return [{...a,a:'towed-crawler'},{type:'combine',a:'spare-drive',b:'toolkit'},{type:'combine',a:'serviced-drive',b:'drive-coupling'},{type:'combine',a:'replacement-drive',b:'towed-crawler'}] as Action[];
  return [a];
 }));
 for(const width of [320,375,390]){const g=M.replay(mars,alternate,width);assert.ok(g.state.completed);assert.equal(g.state.locations.filter(l=>l.id==='M08').length,1);assert.equal(g.state.enteredTravels!.filter(id=>id==='crawler-to-recovery-camp').length,1);assert.equal(g.state.enteredTravels!.filter(id=>id==='ascent-to-orbital-rendezvous').length,1);assert.deepEqual(M.restore(mars,JSON.stringify(g)).state,g.state);}
});
test('mid-chapter camp/orbit arrivals save, Undo and acknowledgement keep the event together',()=>{
 let g=M.createGame(mars,375);for(const a of route(mars)){const before=g,r=M.applyAction(mars,g,a);assert.ok(r.accepted,r.message);g=r.game;if(g.state.enteredTravels?.length!==before.state.enteredTravels?.length){assert.deepEqual(M.restore(mars,JSON.stringify(g)).state,g.state);assert.deepEqual(withoutMetrics(M.undo(g).game.state),withoutMetrics(before.state));const cue=M.pendingEntryCue(mars,g)!;assert.ok(cue);assert.equal(M.pendingEntryCue(mars,M.acknowledgeEntryCue(mars,g,cue.id)),null);}}
});
test('voluntary storage relocation does not import the object on the next same-place beat',()=>{
 let g=M.replay(copy,copy.checkpoints![0].actions);const paper=M.token(g.state,'papers')!;
 let r=M.applyAction(copy,g,{type:'relocate',item:paper.id,location:'P01',x:230,y:400});assert.ok(r.accepted,r.message);g=r.game;const stored=structuredClone(M.token(g.state,paper.id));assert.equal(stored!.location,'P01');assert.deepEqual(M.undo(g).game.state.tokens.find(t=>t.id===paper.id),paper);assert.deepEqual(M.restore(copy,JSON.stringify(g)).state,g.state);
 for(const a of [{type:'visit',location:'P02',carry:[]},{type:'combine',a:'master',b:'stock'},{type:'place',item:'block-readable',hotspot:'display-frame'},{type:'advance'}] as Action[]){r=M.applyAction(copy,g,a);assert.ok(r.accepted,r.message);g=r.game;}
 assert.equal(g.state.chapter,2);assert.deepEqual(M.token(g.state,'papers'),stored);
});
for(const s of [copy,elements,kitchen,mars])test(`${s.id}: full UI-equivalent atomic drop route`,()=>{
 const actions=route(s).map(a=>a.type==='combine'?{type:'drop' as const,item:a.a,target:a.b}:a);
 const g=M.replay(s,actions,375);assert.ok(g.state.completed);assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);
 assert.equal(g.state.metrics.combinations,new Set(g.events.flatMap(e=>e.recipe?[e.recipe]:[])).size);
});
