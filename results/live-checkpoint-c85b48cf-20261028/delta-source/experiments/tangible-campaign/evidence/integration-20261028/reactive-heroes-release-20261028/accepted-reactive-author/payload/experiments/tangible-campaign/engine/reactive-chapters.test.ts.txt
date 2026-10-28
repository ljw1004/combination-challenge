// Headless logical transition evidence; no browser/native or human-playtest claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as M from './model.ts';
import type {Action,Scenario,Stage} from '../schema/scenario.ts';
import {getPlayableScenario} from '../ui/campaign-milestones.ts';
import {scenarios} from '../ui/scenarios.ts';
import {decodeSave,encodeSave} from '../ui/save-codec.ts';
const scene=(id:string,area='hall',extra:Partial<Stage>={}):Stage=>({id,title:id,speaker:'Host',motivation:'A real task remains.',area:{id:area,label:area,travelText:'We arrive.'},onAlreadyComplete:{mode:'skip'},objectives:[{id:id+'-goal',kind:'create',item:'beacon',text:'Make beacon'}],...extra});
function world():Scenario{return {schemaVersion:1,id:'reactive-fixture',title:'A continuing journey',premise:'Use what you made.',items:['lamp','battery','beacon','cloth','thread','spare','meal'].map(id=>({id,label:id})),locations:[{id:'ridge',label:'Ridge'},{id:'bench',label:'Bench'}],initialItems:['lamp','battery'],recipes:[{id:'beacon',a:'lamp',b:'battery',out:'beacon'},{id:'meal',a:'cloth',b:'thread',out:'meal'}],stages:[
 scene('build','camp'),
 scene('prepared','workroom',{locations:['bench'],carry:['beacon','lamp','battery'],caches:[{id:'cloth-cache',label:'Workroom shelf',narrative:'There is cloth on the shelf.',items:['cloth']}]}),
 scene('news','workroom',{onAlreadyComplete:{mode:'bridge',text:'The crew have answered.'},caches:[{id:'thread-cache',label:'Workroom drawer',narrative:'Thread and a spare are here.',items:['thread','spare']}]}),
 scene('welcome','hall',{locations:['ridge'],carry:['beacon','cloth','lamp'],onAlreadyComplete:{mode:'bridge',text:'The visitors have arrived.'}}),
 scene('serve','hall',{objectives:[{id:'one',kind:'create',item:'beacon',text:'Make beacon'},{id:'two',kind:'create',item:'cloth',text:'Find cloth'},{id:'three',kind:'create',item:'meal',text:'Prepare meal'}]}),
 scene('finish','hall',{objectives:[{id:'place',kind:'place',item:'meal',location:'ridge',text:'Deliver meal'}],completionText:'Everyone is fed.'})
 ]};}
const act=(s:Scenario,g:M.Game,a:Action)=>{const r=M.applyAction(s,g,a);assert(r.accepted,r.message);return r.game;};
const built=(s=world())=>act(s,M.createGame(s),{type:'combine',a:'lamp',b:'battery'});
const arrived=(s=world())=>act(s,built(s),{type:'advance'});

test('one real handoff silently cascades completed entries; partial 2/3 goals remain visible and satisfied',()=>{
 const s=world(),before=built(s),g=act(s,before,{type:'advance'});
 assert.equal(g.state.stage,4);assert.deepEqual(g.state.skippedChapters,['prepared','news','welcome']);
 assert.deepEqual(M.playerView(s,g).objectives.map(o=>o.satisfied),[true,true,false]);assert.equal(g.state.metrics.combinations,1);assert.equal(g.state.metrics.advances,1);
 assert.deepEqual(g.events.at(-1)!.skippedChapters,['prepared','news','welcome']);assert.equal(g.events.filter(e=>e.action.type==='combine').length,1);
 assert.deepEqual(M.pendingChapterBridges(s,g).map(b=>b.text),['The crew have answered.','The visitors have arrived.']);
 assert.deepEqual(M.resolveChapterEntry(s,g),g);assert.equal(before.state.stage,0);
});
test('skipped caches and locations stay real, preserve original provenance, and never become old during the cascade',()=>{
 const s=world(),g=arrived(s),a=g.state.arrival!;
 assert.deepEqual(g.state.openedCaches,['cloth-cache','thread-cache']);assert.deepEqual(g.state.places.map(p=>p.id),['bench','ridge']);
 assert.equal(a.supplies.find(x=>x.item==='cloth')!.sourceStage,1);assert.equal(a.supplies.find(x=>x.item==='thread')!.sourceStage,2);
 assert.equal(M.arrivalView(s,g.state)!.supplies.find(x=>x.id==='cloth')!.source,'Workroom shelf');
 for(const id of ['cloth','thread','spare'])assert.equal(M.arrivalCue(g.state,id),'new');
 assert(!a.carried.some(x=>['cloth','thread','spare'].includes(x.item)));assert(!a.here.some(x=>['cloth','thread','spare'].includes(x)));
 const divisions=M.arrivalDivisions(g.state);assert.deepEqual(new Set(divisions.map(d=>d.area)),new Set(['hall','workroom']));
 for(const d of divisions){for(const t of g.state.tokens.filter(t=>t.area===d.area)){const isNew=a.supplies.some(x=>x.item===t.id);assert(isNew?t.y>d.dividerY:t.y<d.dividerY,t.id+' is on its real arrival side');}}
 assert.equal(g.state.tokens.filter(t=>t.id==='cloth').length,1);assert.equal(g.state.discovered.filter(id=>id==='cloth').length,1);
});
test('pending bridges, provenance and multiple dividers roundtrip losslessly; acknowledgment is ordered, once per run, and undo-safe',()=>{
 const s=world();let g=arrived(s);const packed=encodeSave({game:g,tops:{},seen:[]});g=M.restore(s,JSON.stringify(decodeSave(packed).game));
 assert.equal(M.pendingChapterBridges(s,g).length,2);assert.equal(M.arrivalDivisions(g.state).length,2);assert.equal(M.arrivalCue(g.state,'cloth'),'new');
 const pendingUndo=M.undo(g).game;assert.equal(pendingUndo.state.stage,0);assert.equal(M.pendingChapterBridges(s,pendingUndo).length,0);assert(!pendingUndo.state.openedCaches.length);
 g=M.acknowledgeChapterBridges(s,g,['news','welcome','unknown']);assert.equal(M.pendingChapterBridges(s,g).length,0);assert.equal(M.acknowledgeChapterBridges(s,g,['news']),g);
 g=M.restore(s,JSON.stringify(g));g=act(s,M.undo(g).game,{type:'advance'});assert.equal(M.pendingChapterBridges(s,g).length,0);assert.equal(g.state.tokens.filter(t=>t.id==='cloth').length,1);
 assert.equal(M.pendingChapterBridges(s,arrived(s)).length,2); // reset/new run
});
test('a committed crossing in a skipped earlier area dismisses only its divider; undo restores both',()=>{
 const s=world();let g=arrived(s);g=act(s,g,{type:'visit',area:'workroom'});const old=M.arrivalDivisions(g.state).find(d=>d.area==='workroom')!;
 g=act(s,g,{type:'move',item:'spare',x:52,y:old.dividerY-35});assert.equal(M.arrivalDivisions(g.state).find(d=>d.area==='workroom')!.active,false);assert(M.arrivalDivisions(g.state).find(d=>d.area==='hall')!.active);
 assert(M.arrivalDivisions(M.undo(g).game.state).every(d=>d.active));
});
test('normal chapter completion is not an already-earned entry; explicit legacy saves are not destructively reclassified',()=>{
 const s=world(),g=built(s);assert.equal(g.state.chapterEntry!.alreadyComplete,false);assert.equal(M.resolveChapterEntry(s,g),g);assert.equal(M.restore(s,JSON.stringify(g)).state.stage,0);
 const old=structuredClone(g);delete old.state.chapterEntry;assert.deepEqual(M.restore(s,JSON.stringify(old)),old);
 const legacy=world();for(const st of legacy.stages)delete st.onAlreadyComplete;const ready=act(legacy,built(legacy),{type:'advance'});assert.equal(ready.state.stage,1);assert(M.playerView(legacy,ready).canAdvance);
});
test('startup with all goals already satisfied reaches an honest ending and keeps ending bridges once',()=>{
 const s=world();s.initialItems.push('beacon');s.stages=[scene('opening','camp',{onAlreadyComplete:{mode:'bridge',text:'The crew have answered.'}}),scene('ending','camp',{onAlreadyComplete:{mode:'bridge',text:'The journey has ended.'},completionText:'A prepared ending.'})];
 let g=M.createGame(s);assert(g.state.completed);assert.equal(g.events.length,0);assert.equal(g.state.metrics.combinations,0);assert.deepEqual(M.playerView(s,g).objectives,[]);assert.equal(M.pendingChapterBridges(s,g).length,2);
 const rejected=M.applyAction(s,g,{type:'advance'});assert(!rejected.accepted);assert.equal(M.pendingChapterBridges(s,rejected.game).length,2);
 g=M.acknowledgeChapterBridges(s,g,['opening','ending']);assert(!M.pendingChapterBridges(s,M.restore(s,JSON.stringify(g))).length);
});
test('pending invention queue survives a cascade without extra achievements, while acknowledgments survive undo',()=>{
 const s=world();s.milestones=[{id:'beacon-made',item:'beacon',when:'created',title:'A light',text:'We can be seen.'},{id:'light-made',item:'beacon',when:'created',title:'A second earned reward',text:'A separate test event.'}];let g=arrived(s);
 assert.equal(g.state.stage,4);assert.deepEqual(g.state.milestones?.map(m=>m.id),['beacon-made','light-made']);
 g=M.restore(s,JSON.stringify(g));assert.equal(M.pendingMilestone(s,g)!.id,'beacon-made');g=M.acknowledgeMilestone(s,g,'beacon-made');assert.equal(M.pendingMilestone(s,g)!.id,'light-made');g=M.acknowledgeMilestone(s,g,'light-made');assert.equal(M.pendingMilestone(s,g),null);
 g=act(s,M.undo(g).game,{type:'advance'});assert.equal(M.pendingMilestone(s,g),null);assert.equal(M.pendingChapterBridges(s,g).length,2);
});
test('prepared checkpoints retain real replay facts and do not present bridges or inventions as newly earned',()=>{
 const s=world();s.checkpoints=[{id:'serve',label:'Serve',actions:[{type:'combine',a:'lamp',b:'battery'},{type:'advance'}]}];const g=M.checkpoint(s,'serve');assert.equal(g.state.stage,4);assert.equal(M.pendingChapterBridges(s,g).length,0);assert.equal(g.state.metrics.combinations,1);
});
test('actual Kitchen future-first route skips exactly nine completed chapters, with the final trolley still placed for real',()=>{
 const raw=scenarios.find(s=>s.id==='kitchen-caravan-v6')!,s=getPlayableScenario(raw.id,scenarios)!;
 const route:Action[]=JSON.parse(readFileSync(new URL('../evidence/integration-20261028/sources/food-v6-ten-kitchens/routes/early-kitchen-reverse.json',import.meta.url),'utf8'));
 let legacy=M.createGame(raw),g=M.createGame(s),omitted=0,placementWitness=false;
 for(const a of route){const before=legacy.state.stage;legacy=act(raw,legacy,a);if(a.type==='advance'&&before<g.state.stage){omitted++;continue;}
  if(g.state.stage===19&&a.type==='place'){assert(!M.stageComplete(s,g.state));assert(!g.state.completed);placementWitness=true;}
  g=act(s,g,a);
 }
 assert.equal(omitted,9);assert.deepEqual(g.state.skippedChapters,['orchard','salads','pastry','sugar','custard','sponge','quickbread','meringue','precision']);assert(placementWitness);assert(g.state.completed);assert.equal(g.state.metrics.combinations,187);assert.equal(g.state.metrics.combinations,legacy.state.metrics.combinations);
 assert.equal(g.events.filter(e=>e.recipe).length,legacy.events.filter(e=>e.recipe).length);assert.equal(M.token(g.state,'supper-trolley')!.location,'dining-car');assert.equal(M.token(legacy.state,'supper-trolley')!.location,'dining-car');
});
test('actual Mars important relay beat bridges, while an already working rover needs no repair recital',()=>{
 const s=getPlayableScenario('mars-connected-survival-v4-return-cargo-research',scenarios)!;
 assert.deepEqual(s.stages.find(st=>st.id==='rover')!.onAlreadyComplete,{mode:'skip'});const relay=s.stages.find(st=>st.id==='relay')!;assert.equal(relay.onAlreadyComplete!.mode,'bridge');
 // The metadata is consumed by the same model operation, not a UI-only text rule.
 const mini=world();mini.stages[1].onAlreadyComplete=relay.onAlreadyComplete;let g=arrived(mini);assert.equal(M.pendingChapterBridges(mini,g)[0].text,(relay.onAlreadyComplete as {text:string}).text);assert(!M.pendingChapterBridges(mini,g)[0].text.includes('collect'));
});

test('already fulfilled placements are not undone by chapter carry, including a partial chapter',()=>{
 for(const partial of [false,true]){const s=world();s.stages=[scene('build','camp',{locations:['ridge']}),scene('old-placement','hall',{objectives:[{id:'already-placed',kind:'place',item:'beacon',location:'ridge',text:'Place beacon'},...(partial?[{id:'still-needed',kind:'create' as const,item:'meal',text:'Prepare meal'}]:[])]}),scene('unfinished','hall',{objectives:[{id:'meal',kind:'create',item:'meal',text:'Prepare meal'}]})];
  let g=built(s);g=act(s,g,{type:'place',item:'beacon',location:'ridge'});g=act(s,g,{type:'advance'});
  assert.equal(g.state.stage,partial?1:2);assert.equal(M.token(g.state,'beacon')!.location,'ridge');assert.equal(M.token(g.state,'beacon')!.area,'camp');if(partial)assert.deepEqual(M.playerView(s,g).objectives.map(o=>o.satisfied),[true,false]);
 }
});
test('new-to-new creation in a skipped retained area stays below that area’s new-items divider',()=>{
 const s=world();s.items.push({id:'extra',label:'Extra'},{id:'parcel',label:'Parcel'});s.stages[2].caches![0].items.push('extra');s.recipes.push({id:'parcel',a:'spare',b:'extra',out:'parcel'});
 let g=arrived(s);g=act(s,g,{type:'visit',area:'workroom'});const before=M.arrivalDivisions(g.state).find(d=>d.area==='workroom')!;g=act(s,g,{type:'combine',a:'spare',b:'extra'});
 assert(M.token(g.state,'parcel')!.y-M.tokenHeight(s,M.token(g.state,'parcel')!)/2>=before.dividerY+26);assert(M.arrivalDivisions(g.state).find(d=>d.area==='workroom')!.active);
});

test('a vacated skipped area does not retain an empty new-items separator',()=>{
 const s=world();s.initialItems=['beacon'];s.stages=[scene('opening','camp'),scene('delivery','camp',{caches:[{id:'fresh',label:'Fresh cloth',narrative:'A delivery.',items:['cloth']}]}),scene('unfinished','hall',{objectives:[{id:'make-meal',kind:'create',item:'meal',text:'Prepare meal'}]})];s.recipes=[{id:'meal',a:'beacon',b:'cloth',out:'meal'}];
 const g=M.createGame(s);assert.equal(g.state.stage,2);assert.equal(g.state.tokens.filter(t=>t.area==='camp').length,0);assert.deepEqual(M.arrivalDivisions(g.state).map(d=>d.area),['hall']);assert.equal(M.arrivalCue(g.state,'cloth'),'new');
});
test('authoring rejects malformed skip/bridge metadata and restore drops damaged optional story metadata without losing real progress',()=>{
 for(const policy of [{mode:'bridge',text:''},{mode:'unknown'},{mode:'bridge'}]){const s=world();s.stages[1].onAlreadyComplete=policy as any;assert(M.validateScenario(s).some(e=>e.includes('already-complete policy')));}
 const s=world(),g=arrived(s);(g as any).bridgesSeen='bad';(g.state as any).skippedChapters='bad';(g.state as any).chapterEntry={stage:100,alreadyComplete:true};(g.state as any).arrivalLayouts='bad';const r=M.restore(s,JSON.stringify(g));assert.equal(r.state.stage,4);assert(M.token(r.state,'cloth'));assert.equal(r.state.metrics.combinations,1);
});

test('a skipped round trip A to B to A preserves cache provenance and divider through reload',()=>{
 const s=world();s.initialItems=['beacon'];s.stages=[scene('opening','camp'),scene('delivery','hall',{caches:[{id:'fresh',label:'Fresh cloth',narrative:'A delivery.',items:['cloth']}]}),scene('unfinished','camp',{objectives:[{id:'make-meal',kind:'create',item:'meal',text:'Prepare meal'}]})];s.recipes=[{id:'meal',a:'beacon',b:'cloth',out:'meal'}];
 const g=M.createGame(s);assert.equal(g.state.stage,2);assert(g.state.arrival!.here.includes('beacon'));assert(!g.state.arrival!.carried.some(x=>x.from==='camp'));const restored=M.restore(s,JSON.stringify(g));assert.deepEqual(restored.state.arrival,g.state.arrival);assert.deepEqual(M.arrivalDivisions(restored.state),M.arrivalDivisions(g.state));assert.equal(M.arrivalCue(restored.state,'cloth'),'new');
});
