import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {createLiving,stepLiving,livingPhysicalKey,LIVING_PRIMITIVES,LIVING_CONCEPTS} from '../experiments/logical-living-works.ts';
import {createLiving2,stepLiving2} from '../experiments/logical-living-works-2.ts';
import {createLiving3,stepLiving3} from '../experiments/logical-living-works-3.ts';
import {LIVING_ATLAS_LEVELS,createLivingAtlas,stepLivingAtlas,observeLivingAtlas,livingAtlasBase,livingAtlasGoal,livingAtlasOutcome,livingAtlasActions,livingAtlasRules,previewLivingAtlas,livingAtlasWitness,replayLivingAtlas,screenLivingAtlas} from '../experiments/logical-living-atlas.ts';
import type {Action,World} from '../experiments/logical-living-atlas.ts';
import type {Action as BaseAction} from '../experiments/logical-living-works.ts';

const frozen=[['logical-living-works.ts','8647032f9697c901b11302223cc327a370596be3fc6695ec7b74d84bbd83d6d2'],['logical-living-works-2.ts','a3da674164943462dd01431fba6655a632afe43dbe66343978a2db4a0a6f4696'],['logical-living-works-3.ts','7b8d1a520e90c95e940d2a714a260c1c802103687e3e8c1a98ce2b32905127c6']];
const physical=(world:World)=>livingPhysicalKey(world.kind==='base'?world.state:world.state.base);

test('all three imported sources remain frozen; five boards use clean provided initial worlds and six shared primitives',()=>{
 for(const [file,hash]of frozen)assert.equal(createHash('sha256').update(readFileSync(new URL(`../experiments/${file}`,import.meta.url))).digest('hex'),hash);
 const s=createLivingAtlas(),starts=[createLiving(),createLiving2().base,createLiving('reverse'),createLiving2().base,createLiving3().base];
 assert.deepEqual(s.known,LIVING_PRIMITIVES);assert.equal(s.active,'crossing');assert.equal(s.totalTicks,0);assert.deepEqual(s.actions,[]);
 for(const [i,id]of LIVING_ATLAS_LEVELS.entries()){
  const b=s.boards[id],base=livingAtlasBase(b);assert.equal(livingPhysicalKey(base),livingPhysicalKey(starts[i]));assert.deepEqual(base.known,LIVING_PRIMITIVES);assert.deepEqual(base.actions,[]);assert.deepEqual(base.works,[]);assert.equal(base.cells.some(c=>!!c.valve),false);assert.equal(base.tick,0);assert.equal(b.firstAchievement,null);
 }
 const view=observeLivingAtlas(s);assert.equal(view.goalCards.length,5);assert.ok(view.goalCards.every(c=>!c.completedEver&&!c.currentlyAchieved));assert.equal(view.orderIsRequired,false);assert.equal(view.ontology.implementedConcepts,24);assert.deepEqual(view.ontology.concepts,LIVING_CONCEPTS);
});

test('every goal is selectable before any completion; navigation advances neither board time nor physical state',()=>{
 let s=createLivingAtlas();const initial=structuredClone(s);for(const level of [...LIVING_ATLAS_LEVELS].reverse()){
  s=stepLivingAtlas(s,{type:'select-level',level});assert.equal(s.active,level);assert.equal(s.totalTicks,0);for(const id of LIVING_ATLAS_LEVELS){assert.equal(livingAtlasBase(s.boards[id]).tick,0);assert.equal(physical(s.boards[id].world),physical(initial.boards[id].world));}
 }
 assert.equal(s.actions.filter(a=>a.type==='select-level').length,5);assert.equal(s.actions.filter(a=>a.type==='combine').length,0);assert.throws(()=>stepLivingAtlas(s,{type:'next'} as unknown as Action),/not an Atlas action/);assert.throws(()=>stepLivingAtlas(s,{type:'select-level',level:'nonexistent'} as unknown as Action),/five displayed/);
 assert.equal(previewLivingAtlas(s,{type:'select-level',level:'slow-alternation'}).legal,true);
});

test('new knowledge carries globally without carrying components, and first-entry knowledge does not change on revisit',()=>{
 let s=stepLivingAtlas(createLivingAtlas(),{type:'combine',a:'seed',b:'water',at:'B2'});const crossing=structuredClone(s.boards.crossing),pubInitial=physical(s.boards.publication.world);
 s=stepLivingAtlas(s,{type:'select-level',level:'publication'});assert.equal(physical(s.boards.publication.world),pubInitial);assert.ok(livingAtlasBase(s.boards.publication).known.includes('rootbed'));assert.equal(livingAtlasBase(s.boards.publication).cells.some(c=>c.rooted),false);assert.deepEqual(s.boards.publication.knownOnFirstVisit,s.known);
 const entry=structuredClone(s.boards.publication.knownOnFirstVisit);s=stepLivingAtlas(s,{type:'combine',a:'earth',b:'heat'});assert.deepEqual(s.boards.crossing,crossing);
 s=stepLivingAtlas(s,{type:'select-level',level:'crossing'});assert.equal(physical(s.boards.crossing.world),physical(crossing.world));assert.ok(livingAtlasBase(s.boards.crossing).known.includes('stone'));assert.deepEqual(s.boards.crossing.knownOnFirstVisit,LIVING_PRIMITIVES);
 s=stepLivingAtlas(s,{type:'select-level',level:'publication'});assert.deepEqual(s.boards.publication.knownOnFirstVisit,entry);assert.deepEqual(livingAtlasBase(s.boards.publication).knownOnEntry,entry);
});

test('world arrangements, fields, records, works, cycle proofs and source phases are retained and fully paused while inactive',()=>{
 const complete=livingAtlasWitness().state;let s=stepLivingAtlas(complete,{type:'select-level',level:'crossing'});const inactive=Object.fromEntries(LIVING_ATLAS_LEVELS.filter(id=>id!=='crossing').map(id=>[id,structuredClone(s.boards[id])]));
 s=stepLivingAtlas(s,{type:'wait',beats:24});s=stepLivingAtlas(s,{type:'combine',a:'earth',b:'B2'});
 for(const id of LIVING_ATLAS_LEVELS.filter(id=>id!=='crossing'))assert.deepEqual(s.boards[id],inactive[id]);
 const before=structuredClone(s.boards['slow-alternation']);s=stepLivingAtlas(s,{type:'select-level',level:'slow-alternation'});assert.deepEqual(s.boards['slow-alternation'].world,before.world);assert.deepEqual(s.boards['slow-alternation'].firstAchievement,before.firstAchievement);assert.equal(livingAtlasGoal(s).achieved,true);
 assert.equal(livingAtlasBase(s.boards['slow-alternation']).works.length,3);assert.equal(livingAtlasBase(s.boards['intermittent-publication']).cells.find(c=>c.id==='B1')!.memory,1);
});

test('all five goals are achievable in offered and reversed order by legal combinations; every witness replays exactly',()=>{
 for(const order of [LIVING_ATLAS_LEVELS,[...LIVING_ATLAS_LEVELS].reverse()]){
  const w=livingAtlasWitness(order);assert.equal(w.levels.length,5);assert.ok(w.levels.every(l=>l.goal.achieved&&l.firstAchievement));assert.equal(livingAtlasOutcome(w.state).goal,true);assert.equal(livingAtlasOutcome(w.state).properties.allFiveCurrentlyAchieved,true);assert.deepEqual(replayLivingAtlas(w.actions),w.state);assert.equal(w.state.known.length,21);
 }
 assert.equal(livingAtlasWitness(LIVING_ATLAS_LEVELS,'broadcast').levels.at(-1)!.goal.achieved,true);
});

test('first certificates identify the exact earliest beat inside batched waits and reproduce the exact physical goal evidence',()=>{
 const w=livingAtlasWitness();for(const level of LIVING_ATLAS_LEVELS){
  const cert=w.state.boards[level].firstAchievement!;let s=replayLivingAtlas(w.actions.slice(0,cert.command-1));assert.equal(s.active,level);assert.equal(s.boards[level].firstAchievement,null);assert.equal(livingAtlasGoal(s).achieved,false);
  const action=w.actions[cert.command-1];for(let beat=1;beat<=cert.beatWithinCommand;beat++){
   s=stepLivingAtlas(s,action.type==='wait'?{type:'wait'}:action);assert.equal(livingAtlasGoal(s).achieved,beat===cert.beatWithinCommand);
  }
  assert.equal(livingAtlasBase(s.boards[level]).tick,cert.tick);assert.equal(s.totalTicks,cert.totalTicks);assert.equal(physical(s.boards[level].world),cert.physicalState);assert.deepEqual(livingAtlasGoal(s),cert.goal);assert.deepEqual(s.known,cert.known);
 }
 assert.equal(w.state.boards['slow-alternation'].firstAchievement!.beatWithinCommand,8);assert.equal(w.state.boards['intermittent-publication'].firstAchievement!.beatWithinCommand,5);
});

test('completed-ever survives a later destructive edit while current satisfaction correctly becomes false',()=>{
 let s=livingAtlasWitness().state;s=stepLivingAtlas(s,{type:'select-level',level:'crossing'});const cert=structuredClone(s.boards.crossing.firstAchievement);s=stepLivingAtlas(s,{type:'combine',a:'earth',b:'B2'});
 const card=observeLivingAtlas(s).goalCards.find(c=>c.id==='crossing')!;assert.equal(card.currentlyAchieved,false);assert.equal(card.completedEver,true);assert.equal(card.firstAchievement!.physicalStateSha256,createHash('sha256').update(cert!.physicalState).digest('hex'));assert.deepEqual(s.boards.crossing.firstAchievement,cert);assert.equal(livingAtlasOutcome(s).goal,true);assert.equal(observeLivingAtlas(s).campaign.allFiveCurrentlyAchieved,false);
 s=stepLivingAtlas(s,{type:'combine',a:'rootbed',b:'B2'});s=stepLivingAtlas(s,{type:'wait',beats:4});assert.equal(livingAtlasGoal(s).achieved,true);assert.deepEqual(s.boards.crossing.firstAchievement,cert);
});

test('every physical campaign command matches its frozen inner engine exactly, including full batched-wait bookkeeping',()=>{
 let s=createLivingAtlas();for(const action of livingAtlasWitness().actions){
  if(action.type==='select-level'){s=stepLivingAtlas(s,action);continue;}
  const id=s.active,w=s.boards[id].world;const expected:World=w.kind==='base'?{kind:'base',state:stepLiving(w.state,action as BaseAction)}:w.kind==='slow'?{kind:'slow',state:stepLiving2(w.state,action as BaseAction)}:{kind:'intermittent',state:stepLiving3(w.state,action as BaseAction)};
  const next=stepLivingAtlas(s,action);assert.deepEqual(next.boards[id].world,expected);for(const other of LIVING_ATLAS_LEVELS.filter(x=>x!==id))assert.deepEqual(next.boards[other],s.boards[other]);s=next;
 }
});

test('all enumerated exact forecasts preserve input; finish before any or after a subset is a valid stopping state',()=>{
 const result=screenLivingAtlas();assert.equal(result.validation.forecasts,2874);assert.equal(result.validation.replaysExact,true);assert.equal(result.validation.inputPreserved,true);
 for(const s of [createLivingAtlas(),livingAtlasWitness(['crossing']).state]){
  const before=structuredClone(s),end=stepLivingAtlas(s,{type:'finish'});assert.deepEqual(s,before);assert.equal(end.status,'ended');assert.equal(livingAtlasOutcome(end).terminal,true);assert.equal(end.totalTicks,s.totalTicks);assert.deepEqual(end.boards,s.boards);assert.deepEqual(livingAtlasActions(end),[]);assert.throws(()=>stepLivingAtlas(end,{type:'select-level',level:'publication'}),/not playing/);
 }
});

test('public rules and offered cards disclose carry, pause and goal scope without research findings or preferred solutions',()=>{
 const text=JSON.stringify({rules:livingAtlasRules(),view:observeLivingAtlas(createLivingAtlas())});assert.doesNotMatch(text,/prior player|previous players|experienced player|fresh player|positive witness|negative witness|successful construction|assigned condition|choice protocol/i);assert.match(text,/inactive/i);assert.match(text,/paused/i);assert.match(text,/six/i);assert.match(text,/completedEver/);assert.match(text,/select-level/);assert.doesNotMatch(text,/all 24 (designs|concepts) (are |already )?known/i);
});


test('known whole-route designs transfer without creating a route or work on a new board',()=>{
 let s=livingAtlasWitness(['crossing','alternation']).state;assert.ok(['loop','delay','feedback-valve'].every(id=>s.known.includes(id)));assert.equal(livingAtlasBase(s.boards.alternation).works.length,3);
 const before=physical(s.boards['slow-alternation'].world);s=stepLivingAtlas(s,{type:'select-level',level:'slow-alternation'});const base=livingAtlasBase(s.boards['slow-alternation']);assert.equal(physical(s.boards['slow-alternation'].world),before);assert.deepEqual(base.works,[]);assert.ok(base.known.includes('loop'));
 assert.equal(previewLivingAtlas(s,{type:'combine',a:'channel',b:'loop',at:'w1'}).legal,false);assert.equal(previewLivingAtlas(s,{type:'combine',a:'loop',b:'C3',path:['C3','C2','D2','D3']}).legal,true);
});

test('public certificate stamps are compact but identify the exact full certificate retained in saved state',()=>{
 const s=livingAtlasWitness().state,view=observeLivingAtlas(s);for(const card of view.goalCards){const full=s.boards[card.id].firstAchievement!,stamp=card.firstAchievement!;assert.equal(stamp.command,full.command);assert.equal(stamp.beatWithinCommand,full.beatWithinCommand);assert.equal(stamp.physicalStateSha256,createHash('sha256').update(full.physicalState).digest('hex'));assert.equal('physicalState' in stamp,false);assert.equal(stamp.goal.achieved,true);}
 assert.ok(JSON.stringify(view).length<25000);
});
