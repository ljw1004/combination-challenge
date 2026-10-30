// Self-contained current-engine adaptation of the archived 19 paired-content checks, plus integration preservation. No UI/browser/controller.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import {execute,visibleView} from '../experiments/tangible-campaign/evidence/integration-20261028/sources/causation/next-logic-reconsideration-20261028/paired-v1/surface.mjs';
import {validateContentLifecycles,validateConstructionContinuity,validateObjectiveFlow} from '../experiments/tangible-campaign/schema/lifecycle.ts';
const project=new URL('../',import.meta.url),packet=new URL('experiments/tangible-campaign/evidence/integration-20261028/sources/causation/next-logic-reconsideration-20261028/paired-v1/',project),output=new URL('results/content-next-playtest-20261028/purpose/',project);
mkdirSync(output,{recursive:true});
const parent=JSON.parse(readFileSync(new URL('experiments/tangible-campaign/evidence/integration-20261028/next-playtest-20261028/parent-source-inventory.json',project),'utf8'));
import {scenario as integrated} from '../experiments/tangible-campaign/ui/campaigns/purpose-copy-workroom.ts';
import {scenario as riverside} from '../experiments/tangible-campaign/ui/campaigns/purpose.ts';
import {scenarios,featuredScenarioIds,presentationFor} from '../experiments/tangible-campaign/ui/scenarios.ts';
import {auditRoute} from '../experiments/tangible-campaign/integration/reviewed-routes.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
const s=JSON.parse(readFileSync(new URL('./scenario.json',packet),'utf8'));
const a=JSON.parse(readFileSync(new URL('../candidate-v2/scenario-a.json',packet),'utf8'));
const route=JSON.parse(readFileSync(new URL('./author-route.json',packet),'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const act=(g,action)=>{const r=M.applyAction(s,g,action);assert(r.accepted,r.message);return r.game;};
const drop=(g,x,y)=>act(g,M.dropAction(s,g.state,x,y));
const opening=()=>M.checkpoint(s,'workroom-earned');
const arrival=()=>M.checkpoint(s,'printer-arrival-earned');
const make=(g,id)=>{
 if(M.token(g.state,id))return g;
 if(id==='block-readable')return drop(g,'master','stock');
 if(id==='reverse')return drop(g,'master','@window');
 if(id==='block-reflected')return drop(make(g,'reverse'),'reverse','stock');
 if(id==='proof-front')return drop(make(g,'block-reflected'),'block-reflected','papers');
 if(id==='proof-back')return drop(make(g,'block-readable'),'block-readable','papers');
 throw Error('No author construction for '+id);
};
const firstDelivery=g=>drop(make(g,'block-readable'),'block-readable','@display-frame');
const finish=g=>act(drop(make(g,'block-reflected'),'block-reflected','@printer-chest'),{type:'advance'});
const productiveStates=()=>{
 const q=[opening()],seen=new Set(),out=[];
 while(q.length){const g=q.shift(),key=[...g.state.recipesUsed].sort().join('|');if(seen.has(key))continue;seen.add(key);out.push(g);
  for(const r of s.recipes){if(g.state.recipesUsed.includes(r.id))continue;
   const x=M.token(g.state,r.a),y=r.b.startsWith('@')?g.state.places.find(p=>p.id===r.b.slice(1)):M.token(g.state,r.b);
   if(x?.area!==g.state.currentArea||y?.area!==g.state.currentArea)continue;
   q.push(act(g,{type:'combine',a:r.a,b:r.b}));
  }
 }
 return out;
};

test('paired content validates under unchanged schema, lifecycles, objectives and continuity',()=>{
 assert.deepEqual(M.validateScenario(s),[]);assert.deepEqual(validateContentLifecycles([s]),[]);
 assert.deepEqual(validateConstructionContinuity([s]),[]);assert.deepEqual(validateObjectiveFlow([s]),[]);
 assert.equal(s.stages.length,3);assert.equal(s.recipes.length,6);assert.equal(s.items.length,8);assert.equal(s.locations.length,4);
});
test('manufacturing rules, physical items/reading, stocks and opening are identical to matched v2',()=>{
 for(const field of ['items','recipes','initialItems'])assert.deepEqual(s[field],a[field],field);
 assert.deepEqual(s.stages[0],a.stages[0]);assert.deepEqual(s.stages[1].caches,a.stages[1].caches);
 assert.equal(s.stages[2].caches,undefined);assert(s.recipes.every(r=>!r.requires&&!r.at&&!r.install));
 assert.equal(s.locations.filter(l=>l.id==='window').length,1);
 assert.equal(s.stages[1].area.id,s.stages[2].area.id);
});
test('exact accepted source and pinned logical surface use unchanged current implementation bytes',()=>{
 assert.deepEqual(integrated,s);assert.equal(sha(readFileSync(new URL('scenario.json',packet))),'0603859bf3a0cda2974cb58346c3349651559752fb154ce2a001cb8c2f724a19');
 assert.equal(sha(readFileSync(new URL('surface.mjs',packet))),'86098df473650de49b8f9ec04a0bd46fe7846f9ca0fcc7025a97c976564da0c2');
 const checked=[];for(const [path,metadata]of Object.entries(parent.files)){
  if(!path.startsWith('src/')&&!/experiments\/tangible-campaign\/(engine|schema)\//.test(path)&&!(path.startsWith('experiments/tangible-campaign/ui/')&&!path.endsWith('/scenarios.ts')))continue;
  assert.equal(sha(readFileSync(new URL(path,project))),metadata.sha256,path);checked.push(path);
 }
 assert(checked.length>50);writeFileSync(new URL('protected-live-bytes.json',output),JSON.stringify({baseCommit:parent.baseCommit,checked,allExact:true},null,2)+'\n');
});
test('all parent frozen research snapshots remain byte-identical and no matched variant is added as a featured game',()=>{
 const protectedInputs=Object.entries(parent.files).filter(([p])=>p.startsWith('experiments/tangible-campaign/evidence/integration-20261028/sources/'));
 for(const [p,metadata]of protectedInputs)assert.equal(sha(readFileSync(new URL(p,project))),metadata.sha256,p);
 const b=JSON.parse(readFileSync(new URL('../candidate-v2/scenario-b.json',packet),'utf8'));
 for(const id of [a.id,b.id])assert(!scenarios.some(x=>x.id===id));
 assert.equal(featuredScenarioIds.length,6);assert(featuredScenarioIds.includes(s.id));assert(!featuredScenarioIds.includes(riverside.id));
});
test('actual beginning creates its master; paired packet is not a hidden earned checkpoint',()=>{
 const g=M.createGame(s),v=visibleView(M,s,g);assert.equal(g.events.length,0);assert.equal(g.state.stage,0);
 assert.deepEqual(v.things.map(t=>t.id),['papers']);assert.deepEqual(v.locations.map(p=>p.id),['@press']);
 assert(s.stages[0].motivation.includes('stays here in service'));assert(!s.initialItems.includes('master'));
});
test('both checkpoint entries are exact replay-earned prefixes, honestly labelled authored prior progress',()=>{
 assert.equal(s.checkpoints.length,2);
 for(const c of s.checkpoints){assert.match(c.label,/authored prior progress/);assert.deepEqual(M.checkpoint(s,c.id),M.replay(s,c.actions));}
 assert.deepEqual(s.checkpoints[0].actions,route.slice(0,2));assert.deepEqual(s.checkpoints[1].actions,route.slice(0,5));
 assert.equal(opening().state.metrics.combinations,1);assert.equal(arrival().state.metrics.combinations,2);
 assert.equal(opening().state.stage,1);assert.equal(arrival().state.stage,2);
 for(const g of [opening(),arrival()]){assert(g.events.some(e=>e.created==='master'&&e.stage===0));assert.equal(g.state.tokens.filter(t=>t.kind==='master').length,1);assert(!g.state.completed);}
});
test('later delivery chest is absent and unplaceable before its actual commission',()=>{
 let g=make(opening(),'block-reflected');assert(!g.state.places.some(p=>p.id==='printer-chest'));
 const r=M.applyAction(s,g,{type:'place',item:'block-reflected',location:'printer-chest'});assert(!r.accepted);
 assert.deepEqual(r.game.state.tokens,g.state.tokens);assert(!M.stageComplete(s,g.state));
 g=firstDelivery(g);g=act(g,{type:'advance'});assert(g.state.places.some(p=>p.id==='printer-chest'));
 assert(!M.stageComplete(s,g.state));assert.equal(M.token(g.state,'block-reflected').location,null);
});
test('all 12 productive first-commission states enter second brief incomplete and remain finishable',()=>{
 const states=productiveStates();assert.equal(states.length,12);const evidence=[];
 for(const state of states){
  const first=firstDelivery(state),beforeTokens=structuredClone(first.state.tokens),second=act(first,{type:'advance'});
  assert.equal(second.state.stage,2);assert(!second.state.completed);assert(!M.stageComplete(s,second.state));
  assert.deepEqual(second.state.tokens,beforeTokens);assert(second.state.places.some(p=>p.id==='window'));
  const complete=finish(second);assert(complete.state.completed);
  evidence.push({preDeliveryRecipes:state.state.recipesUsed,secondEntryCompleted:false,
   earlierReflectedBlockPresent:!!M.token(state.state,'block-reflected'),finished:true});
 }
 writeFileSync(new URL('first-to-second-coverage.json',output),JSON.stringify({evidenceClass:'source-aware exhaustive productive recipe-subset states, not all geometric moves/travel states',states:evidence},null,2)+'\n');
});
test('both blocks and proofs made early still require only one real second delivery, without automatic skipping',()=>{
 let g=make(make(opening(),'proof-front'),'proof-back');
 g=drop(g,'block-reflected','@display-frame'); // Worst case: both forms left at the earlier destination.
 const r=execute(M,s,g,'drop',['block-readable','@display-frame']);
 assert(r.response.accepted);assert.equal(r.transitions.length,1);assert.equal(r.game.state.stage,2);assert(!r.game.state.completed);
 assert(r.view.objectives.every(o=>!o.satisfied));assert.match(r.view.stage.motivation,/paper impressions/);
 assert.equal(M.token(r.game.state,'block-reflected').location,'display-frame');
 const combinations=r.game.state.metrics.combinations;
 const last=execute(M,s,r.game,'drop',['block-reflected','@printer-chest']);
 assert(last.game.state.completed);assert.equal(last.game.state.metrics.combinations,combinations);
 assert.equal(last.transitions.length,1);assert.equal(last.game.state.metrics.placements,r.game.state.metrics.placements+1);
});
test('wrong-for-use deliveries recover in both commissions without undo or replenishment',()=>{
 let g=make(opening(),'block-reflected');g=drop(g,'block-reflected','@display-frame');assert(!M.stageComplete(s,g.state));
 g=act(g,{type:'move',item:'block-reflected',x:60,y:250});g=firstDelivery(g);g=act(g,{type:'advance'});
 g=drop(g,'block-readable','@printer-chest');assert(!M.stageComplete(s,g.state));
 g=drop(g,'block-readable','@display-frame');g=finish(g);assert(g.state.completed);
 assert.equal(M.token(g.state,'block-readable').location,'display-frame');assert.equal(M.token(g.state,'block-reflected').location,'printer-chest');
 for(const id of ['master','stock','papers','block-readable','block-reflected'])assert(M.token(g.state,id));
});
test('proof sheets and old master cannot replace either requested wooden artifact',()=>{
 let g=make(make(opening(),'proof-front'),'proof-back');
 for(const id of ['master','proof-front','proof-back','reverse']){g=drop(g,id,'@display-frame');assert(!M.stageComplete(s,g.state));}
 g=firstDelivery(g);g=act(g,{type:'advance'});
 for(const id of ['master','proof-front','proof-back','reverse','block-readable']){g=drop(g,id,'@printer-chest');assert(!M.stageComplete(s,g.state));}
 assert(finish(g).state.completed);
});
test('six-drop full route has four physical combinations, two deliveries and three automatic advances',()=>{
 let g=M.createGame(s);const commands=[['papers','@press'],['master','stock'],['block-readable','@display-frame'],['master','@window'],['reverse','stock'],['block-reflected','@printer-chest']];
 const transcript=[];
 for(const args of commands){const run=execute(M,s,g,'drop',args);assert(run.response.accepted);g=run.game;transcript.push({args,transitions:run.transitions,view:run.view});}
 assert(g.state.completed);assert.equal(g.state.metrics.combinations,4);assert.equal(g.state.metrics.placements,2);assert.equal(g.state.metrics.advances,3);
 assert.equal(g.state.metrics.attempts,9);assert(!g.state.discovered.includes('proof-front'));assert(!g.state.discovered.includes('proof-back'));
 writeFileSync(new URL('author-route-evidence.json',output),JSON.stringify({evidenceClass:'source-aware author route, not a player session',drops:commands.length,transcript,game:g},null,2)+'\n');
});
test('actual earlier master and existing tools survive both handoffs without replacement or component magic',()=>{
 const g=M.replay(s,route);assert(g.events.some(e=>e.created==='master'&&e.stage===0));
 assert.equal(g.state.tokens.filter(t=>t.kind==='master').length,1);assert.equal(g.state.discovered.filter(k=>k==='master').length,1);
 assert.deepEqual(s.stages.slice(1).flatMap(st=>(st.caches??[]).flatMap(c=>c.items)),['stock']);
 for(const r of s.recipes)assert(Object.values(r.lifecycle).every(x=>x.role==='retain'));
 for(const id of ['master','papers','stock'])assert(M.token(g.state,id));
});
test('optional method Read is non-mutating before either commission and after speculative making',()=>{
 for(const original of [opening(),arrival(),make(make(opening(),'proof-front'),'proof-back')]){
  let g=original;
  for(let n=0;n<3;n++){const before=JSON.stringify(g),r=execute(M,s,g,'read',['stock']);assert.equal(JSON.stringify(r.game),before);assert.deepEqual(r.engineResults,[]);assert.deepEqual(r.transitions,[]);assert.equal(r.response.progressChanged,false);g=r.game;}
 }
});
test('both physical branches stay available after the first delivery; help does not reveal result capabilities',()=>{
 for(const g of [opening(),arrival()]){
  const p=M.partners(s,g.state,'master');assert(p.partners.includes('@window'));
  if(g.state.stage===1)assert(p.partners.includes('stock'));
  const r=execute(M,s,g,'highlight',['master']);assert(!JSON.stringify(r.response).includes('readable-impressions'));
 }
 const v=visibleView(M,s,arrival());assert(!Object.hasOwn(v.scenario,'id'));assert.equal(v.things.find(x=>x.id==='stock').readable,true);
});
test('ordinary save/restore and undo preserve both deliveries and the new-chest reveal boundary',()=>{
 for(let n=0;n<=route.length;n++){const g=M.replay(s,route.slice(0,n));assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);}
 const second=arrival(),u=M.undo(second);assert(u.accepted);assert.equal(u.game.state.stage,1);assert(M.stageComplete(s,u.game.state));assert(!u.game.state.places.some(p=>p.id==='printer-chest'));
 const resumed=execute(M,s,u.game,'mission',[]);assert.equal(resumed.game.state.stage,2);assert(!resumed.game.state.completed);assert(!M.stageComplete(s,resumed.game.state));
 const before=M.replay(s,route.slice(0,-2)),placed=drop(before,'block-reflected','@printer-chest'),undo=M.undo(placed);assert(undo.accepted);assert.deepEqual(undo.game.state.tokens,before.state.tokens);
});
test('logical widths and reversed item-input order keep the same outcomes',()=>{
 for(const width of [320,360,600])for(const reverse of [false,true]){
  const actions=route.map(x=>reverse&&x.type==='combine'&&!x.b.startsWith('@')?{...x,a:x.b,b:x.a}:x);
  assert(M.replay(s,actions,width).state.completed);
 }
});
test('earlier-area revisit preserves the real master and does not reinject an original matrix',()=>{
 let g=arrival();g=act(g,{type:'visit',area:'shop',carry:['master']});assert.equal(M.token(g.state,'master').area,'shop');
 assert(!M.token(g.state,'original-matrix'));g=act(g,{type:'visit',area:'workroom',carry:['master']});assert(finish(g).state.completed);
});
test('last-scene narration claims the new printing result, not continued location of every prior artifact',()=>{
 assert.equal(s.stages[2].completionText,a.stages[2]?.completionText??JSON.parse(readFileSync(new URL('../candidate-v2/scenario-b.json',packet),'utf8')).stages[1].completionText);
 assert(!/both.*(installed|delivered|remain)/i.test(s.stages[2].completionText));
 assert(s.notes.some(x=>x.includes('historical achievements')));
});

test('all later goals reuse earlier creations; actual save codec and old Riverside presentation/identity are retained',()=>{
 assert.equal(scenarios.find(x=>x.id===riverside.id),riverside);assert.equal(scenarios.find(x=>x.id===s.id),integrated);
 assert.deepEqual(presentationFor(riverside),{title:'Why This Boat? · The Riverside Workshop',premise:'Short research prototype · turn an accidental sound into a deliberate call signal.'});
 assert.deepEqual(presentationFor(integrated),{title:'Why This Boat? · The Copy Workroom',premise:'Short research experiment · make one master, then choose forms for a display and a printing commission.'});
 const audits=[];for(const width of [320,375,600]){const r=auditRoute(s,route,width);assert(r.game.state.completed);assert.equal(r.game.state.metrics.combinations,4);assert.equal(r.game.state.metrics.placements,2);assert.deepEqual(r.missing,[]);assert.equal(r.rows.length,3);audits.push({width,completed:true,combinations:4,placements:2,goalContinuity:r.rows});}
 const prior=M.checkpoint(riverside,'complete'),final=M.replay(s,route);assert(M.restore(riverside,JSON.stringify(prior)).state.completed);assert.throws(()=>M.restore(s,JSON.stringify(prior)),/Invalid campaign save/);assert.throws(()=>M.restore(riverside,JSON.stringify(final)),/Invalid campaign save/);
 const saves=[];for(const [scenario,game]of [[riverside,prior],[s,opening()],[s,arrival()],[s,final]]){
  const envelope={game,tops:{[game.state.currentArea]:0},seen:[game.state.stage]},encoded=encodeSave(envelope),decoded=decodeSave(encoded);assert.deepEqual(decoded,envelope);assert.deepEqual(M.restore(scenario,JSON.stringify(decoded.game)),game);saves.push({scenarioId:scenario.id,stage:game.state.stage,complete:game.state.completed,exactSaveCodecRoundtrip:true});
 }
 writeFileSync(new URL('integrated-route-save-continuity.json',output),JSON.stringify({baseCommit:parent.baseCommit,priorId:riverside.id,currentId:s.id,audits,saves,oldModuleSaveAndChooserExact:true,extraCheckpointsAdded:0,limits:'Source-aware actual-current logical integration; prior simulated reader is separate, not human fun, fresh UI or philosophical-success proof.'},null,2)+'\n');
});
