/** Logical geometry evidence only; no browser/touch/human visual assessment. */
import test from 'node:test';
import assert from 'node:assert/strict';
import type {Action,Scenario,ChapterEntryCue} from '../experiments/tangible-campaign/schema/campaign.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import {centeredSceneEntryPlan,firstSceneEntryPlan,sceneEntryCenter,type SceneEntryBox as Box} from '../experiments/tangible-campaign/engine/scene-entry-layout.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
const EPS=1e-5;
const overlap=(a:Box,b:Box)=>Math.max(0,Math.min(a.x+a.w/2,b.x+b.w/2)-Math.max(a.x-a.w/2,b.x-b.w/2))*Math.max(0,Math.min(a.y+a.h/2,b.y+b.h/2)-Math.max(a.y-a.h/2,b.y-b.h/2));
const boxes=(s:Scenario,g:M.Game,location=g.state.currentLocation):Box[]=>g.state.tokens.filter(t=>t.location===location).map(t=>({...t,w:96,h:M.tokenHeight(s,t)}));
const stateWithoutMetrics=(s:M.State)=>{const {metrics,...rest}=s;return rest;};
const cue=(id:string,mode:ChapterEntryCue['mode']='beat'):ChapterEntryCue=>({id,mode,format:'silent-title-card',voice:'Narrator',text:'The continuing work has a new purpose.'});
function fixture():Scenario{
 const items=['a','b','c','ready','d','new1','new2','finish','kept','record'].map(id=>({id,label:id==='d'?'One carefully recorded observation with a readable long label':id}));
 const locations=['A','B'].map(id=>({id,label:id,travelText:'Reach '+id,background:{stableKey:id,sceneBrief:'Fixed scenery.'},hotspots:['spot-'+id],stockBatches:[{id:'stock-'+id,label:'Stock',narrative:'All local stock is present.',items:id==='A'?['c']:['new1','new2']}]}));
 const recipe=(id:string,a:string,b:string,out:string)=>({id,a,b,out,lifecycle:{[a]:{role:'retain' as const,reason:'Retained for independent work.'},[b]:{role:'retain' as const,reason:'Retained for independent work.'}}});
 const chapters=['ready','d','finish','finish'].map((item,i)=>({id:'ch'+i,title:'Work '+i,speaker:'Narrator',motivation:'Work here.',location:locations[i===2?1:0],visitId:i<2?'A1':i===2?'B1':'A2',entryCue:cue('cue'+i,i===1?'beat':'arrival-and-beat'),onAlreadyComplete:{mode:'skip' as const},objectives:[{id:'goal'+i,text:'Make '+item,kind:i===3?'place' as const:'create' as const,item,...i===3?{hotspot:'spot-A'}:{}}]}));
 return {schemaVersion:2,id:'weighted-entry-fixture',title:'Working set',premise:'First entry is not a render rule.',items,hotspots:locations.map(l=>({id:l.hotspots[0],label:l.id+' furniture'})),initialItems:['a','b','kept'],recipes:[recipe('r1','a','b','ready'),recipe('r2','ready','c','d'),recipe('r3','d','new1','finish')],chapters,locationPlan:{entryLayout:'weighted-third',locations,visits:[{id:'A1',locationId:'A',chapterIds:['ch0','ch1']},{id:'B1',locationId:'B',chapterIds:['ch2'],carry:['a','ready','d']},{id:'A2',locationId:'A',chapterIds:['ch3'],carry:['finish']}],panel:{width:390,height:844}}};
}
const act=(s:Scenario,g:M.Game,a:Action)=>{const r=M.applyAction(s,g,a);assert(r.accepted,r.message);return r.game;};
for(const width of [320,375,390])test(`${width}: initial visible-item centroid is one third; new hotspots are lower, bounded and separate`,()=>{
 const s=fixture(),g=M.createGame(s,width),b=boxes(s,g),hotspot=g.state.hotspots[0],h={...hotspot,w:106,h:82};
 assert(Math.abs(sceneEntryCenter(b)-844/3)<EPS);assert(h.y>500);assert(b.every(t=>t.y+t.h/2+12<=h.y-h.h/2));assert(b.every(t=>overlap(t,h)<EPS));assert.deepEqual(M.locationFootprint(s,g.state,'A').outOfBounds,[]);
 const divider=g.state.arrivalLayout!.dividerY;assert(g.state.arrival!.here.every(id=>M.token(g.state,id)!.y+M.tokenHeight(s,M.token(g.state,id)!)/2<divider));assert(g.state.arrival!.supplies.every(x=>M.token(g.state,x.item)!.y-M.tokenHeight(s,M.token(g.state,x.item)!)/2>divider));
});
for(const width of [320,375,390])test(`${width}: sparse carried arrangement compresses proportionately, fresh stock remains below, scrollback is untouched`,()=>{
 const s=fixture();let g=M.createGame(s,width);g=act(s,g,{type:'combine',a:'a',b:'b'});g=act(s,g,{type:'advance'});g=act(s,g,{type:'combine',a:'ready',b:'c'});
 for(const [id,x,y]of [['a',65,100],['ready',170,340],['d',65,700]] as const)g=act(s,g,{type:'move',item:id,x,y});
 const before=structuredClone(g),old=boxes(s,g).filter(b=>['a','ready','d'].includes(b.id)),staying=before.state.tokens.filter(t=>!['a','ready','d'].includes(t.id));g=act(s,g,{type:'advance'});
 const after=boxes(s,g),carried=after.filter(b=>old.some(o=>o.id===b.id)),fresh=after.filter(b=>!old.some(o=>o.id===b.id));
 assert.equal(g.state.currentLocation,'B');assert(Math.abs(sceneEntryCenter(after)-844/3)<EPS);assert.deepEqual(g.state.tokens.filter(t=>t.location==='A'),staying);assert.deepEqual(g.state.hotspots.filter(h=>h.location==='A'),before.state.hotspots);
 for(const a of old)assert.equal(carried.find(b=>b.id===a.id)!.x,a.x);
 for(let i=0;i<old.length;i++)for(let j=i+1;j<old.length;j++)assert(overlap(carried[i],carried[j])<=overlap(old[i],old[j])+EPS);
 const sortedOld=[...old].sort((a,b)=>a.y-b.y),sortedCarried=[...carried].sort((a,b)=>a.y-b.y),ratios=[];
 for(let i=1;i<sortedOld.length;i++){const a=sortedOld[i-1],b=sortedOld[i],na=sortedCarried[i-1],nb=sortedCarried[i],gap=b.y-b.h/2-(a.y+a.h/2),next=nb.y-nb.h/2-(na.y+na.h/2);ratios.push((gap-next)/(gap-4));assert(next>=4-EPS);}
 assert(Math.abs(ratios[0]-ratios[1])<EPS);assert(ratios[0]>0);assert(fresh.every(n=>carried.every(o=>n.y-n.h/2>=o.y+o.h/2+28-EPS)));
 assert(g.state.arrivalLayout);assert.deepEqual(M.locationFootprint(s,g.state,'B').outOfBounds,[]);assert.deepEqual(M.locationFootprint(s,g.state,'B').overlapPairs,[]);
 assert.deepEqual(stateWithoutMetrics(M.undo(g).game.state),stateWithoutMetrics(before.state));assert.deepEqual(M.restore(s,JSON.stringify(g)),g);
 const wire=encodeSave({game:g,tops:{A:0,B:844},seen:[0,1,2]});assert(wire.startsWith('CCSP1:'));assert.deepEqual(M.restore(s,JSON.stringify(decodeSave(wire).game)),g);
});
for(const width of [320,375,390])test(`${width}: no recenter for creations, manual moves, same-place beats, resize, restore or return`,()=>{
 const s=fixture();let g=M.createGame(s,width),initial=structuredClone(g);g=act(s,g,{type:'move',item:'a',x:200,y:430});assert.equal(M.token(g.state,'a')!.y,430);const beforeBirth=structuredClone(g);g=act(s,g,{type:'combine',a:'a',b:'b'});
 for(const t of beforeBirth.state.tokens)assert.deepEqual(M.token(g.state,t.id),t);assert.deepEqual(g.state.hotspots,initial.state.hotspots);const born=M.token(g.state,'ready')!,receiver=M.token(g.state,'b')!;assert(Math.hypot(born.x-receiver.x,born.y-receiver.y)<180,'ordinary birth stays close to receiver');
 const settled=structuredClone(g);g=act(s,g,{type:'advance'});assert.deepEqual(g.state.tokens,settled.state.tokens);assert.deepEqual(g.state.hotspots,settled.state.hotspots);assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);
 const resized=M.resizeGame(g,390,s);assert.deepEqual(resized.state.tokens.map(t=>t.y),g.state.tokens.map(t=>t.y));assert.deepEqual(resized.state.hotspots.map(t=>t.y),g.state.hotspots.map(t=>t.y));assert.deepEqual(resized.state.arrivalLayout,g.state.arrivalLayout);
 g=act(s,g,{type:'combine',a:'ready',b:'c'});g=act(s,g,{type:'advance'});g=act(s,g,{type:'combine',a:'d',b:'new1'});const residents=structuredClone(g.state.tokens.filter(t=>t.location==='A')),hotspots=structuredClone(g.state.hotspots);g=act(s,g,{type:'advance'});assert.deepEqual(g.state.tokens.filter(t=>t.location==='A'&&t.id!=='finish'),residents);assert.deepEqual(g.state.hotspots,hotspots);
});
test('opt-in only: an older saved board is never retroactively centered or re-hotspotted',()=>{
 const old=fixture();delete old.locationPlan!.entryLayout;const g=M.createGame(old,375),s=fixture();assert(sceneEntryCenter(boxes(old,g))<200);assert(g.state.hotspots[0].y<200);assert.deepEqual(M.restore(s,JSON.stringify(g)),g);assert.deepEqual(M.resizeGame(g,375,s),g);
 assert.equal(M.validateScenario({...s,locationPlan:{...s.locationPlan!,entryLayout:'wrong' as 'weighted-third'}}).some(x=>x.includes('entry layout')),true);
});
test('context headings validate when present, including earned travel cues',()=>{
 const s=fixture();s.chapters[0].entryCue!.contextHeading='River workshop · 400 BCE';assert.deepEqual(M.validateScenario(s),[]);s.chapters[0].entryCue!.contextHeading=' ';assert(M.validateScenario(s).some(e=>e.includes('context heading')));
 s.chapters[0].entryCue!.contextHeading=undefined;s.chapters[1].travel={id:'trip',locationId:'B',afterCreated:['d'],carry:['d'],entryCue:{...cue('tripcue','arrival-and-beat'),contextHeading:' '}};assert(M.validateScenario(s).some(e=>e.includes('context heading')));
});
test('long-text area weight is not equal-token weight; reservations do not add visual mass',()=>{
 const b:Box[]=[{id:'a',x:52,y:100,w:96,h:44},{id:'source',x:152,y:240,w:96,h:156,reserveH:180}],p=centeredSceneEntryPlan(b,844)!;
 const out=b.map(b=>({...b,...p.positions.get(b.id)!}));assert(Math.abs(sceneEntryCenter(out)-844/3)<EPS);assert(Math.abs(out.reduce((s,b)=>s+b.y,0)/2-844/3)>10);assert(out.every(b=>b.y-(b.reserveH??b.h)/2>=34-EPS));
});
test('dense irreducible scenes clamp safely; impossible scenes decline rather than overlap or clip',()=>{
 const dense:Box[]=[{id:'tall',x:52,y:385,w:96,h:702}],p=centeredSceneEntryPlan(dense,844)!;assert(p.clamped);assert(p.centerY>844/3);assert.equal(p.positions.get('tall')!.y,385);assert.equal(dense[0].h,702);
 assert.equal(centeredSceneEntryPlan([{...dense[0],h:820}],844),null);
 const fixed=[{id:'@furniture',x:52,y:400,w:106,h:82}],q=centeredSceneEntryPlan([{id:'tile',x:52,y:120,w:96,h:600}],844,{fixed});assert.equal(q,null);
});
test('fixed furniture constrains movable centering and never moves; lower hotspot group retains internal geometry',()=>{
 const b:Box[]=[{id:'a',x:52,y:100,w:96,h:44},{id:'b',x:152,y:150,w:96,h:44}],f:Box[]=[{id:'@one',x:52,y:844/3,w:106,h:82}],copy=structuredClone(f),p=centeredSceneEntryPlan(b,844,{fixed:f})!;
 assert.deepEqual(f,copy);for(const box of b)assert.equal(overlap({...box,...p.positions.get(box.id)!},f[0]),0);assert(p.clamped);
 const group:Box[]=[{id:'@one',x:57,y:75,w:106,h:82},{id:'@two',x:252,y:165,w:106,h:82}],q=firstSceneEntryPlan(b,group,844)!;assert(q.hotspotsLowered);assert.equal(q.hotspotPositions.get('@two')!.y-q.hotspotPositions.get('@one')!.y,90);assert.deepEqual([...q.hotspotPositions.values()].map(p=>p.x),[57,252]);
});
test('360 seeded layouts: full sizes, ordering, divider and no-new-overlap property at narrow widths',()=>{
 let seed=0x52931;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
 for(const width of [320,375,390])for(let trial=0;trial<120;trial++){
  const b:Box[]=Array.from({length:4+trial%7},(_,i)=>({id:''+i,x:52+Math.floor(rand()*3)*Math.min(100,(width-104)/2),y:90+rand()*620,w:96,h:44+14*Math.floor(rand()*5)})),before=structuredClone(b),p=centeredSceneEntryPlan(b,844);assert.deepEqual(b,before);if(!p)continue;const out=b.map(b=>({...b,...p.positions.get(b.id)!}));
  for(let i=0;i<b.length;i++){assert.equal(out[i].x,b[i].x);assert.equal(out[i].h,b[i].h);assert(out[i].y-out[i].h/2>=34-EPS&&out[i].y+out[i].h/2<=832+EPS);for(let j=i+1;j<b.length;j++){assert(overlap(out[i],out[j])<=overlap(b[i],b[j])+EPS);if(b[i].y<b[j].y)assert(out[i].y<out[j].y+EPS);}}
 }
});
for(const width of [320,375,390])test(`${width}: earned physical travel gets first-entry layout once and is one save/Undo event`,()=>{
 const s=fixture();s.chapters[1].travel={id:'earned-trip',locationId:'B',afterCreated:['d'],carry:['d'],entryCue:cue('earned-cue','arrival-and-beat')};let g=M.createGame(s,width);g=act(s,g,{type:'combine',a:'a',b:'b'});g=act(s,g,{type:'advance'});const before=structuredClone(g);g=act(s,g,{type:'combine',a:'ready',b:'c'});
 assert.equal(g.state.storyLocation,'B');assert(Math.abs(sceneEntryCenter(boxes(s,g))-844/3)<EPS);assert(g.state.hotspots.find(h=>h.location==='B')!.y>500);assert.deepEqual(g.state.hotspots.filter(h=>h.location==='A'),before.state.hotspots);assert.deepEqual(stateWithoutMetrics(M.undo(g).game.state),stateWithoutMetrics(before.state));assert.deepEqual(M.restore(s,JSON.stringify(g)),g);
 const board=structuredClone(g.state);g=act(s,g,{type:'advance'});assert.deepEqual(g.state.tokens,board.tokens);assert.deepEqual(g.state.hotspots,board.hotspots);assert.equal(g.state.enteredTravels!.length,1);
});
test('rare source update leaves every old item/hotspot and its arrangement fixed',()=>{
 const s=fixture();s.chapters[1].entryCue=cue('cue1','source-update-and-beat');s.chapters[1].sourceUpdate={id:'record-arrival',label:'Record',narrative:'A record is delivered.',arrivalFact:'One record arrived.',items:['record']};let g=M.createGame(s,375);g=act(s,g,{type:'combine',a:'a',b:'b'});const before=structuredClone(g);g=act(s,g,{type:'advance'});
 assert.deepEqual(g.state.tokens.filter(t=>t.id!=='record'),before.state.tokens);assert.deepEqual(g.state.hotspots,before.state.hotspots);assert.equal(g.state.tokens.filter(t=>t.id==='record').length,1);assert.deepEqual(M.locationFootprint(s,g.state,'A').outOfBounds,[]);
});
test('hotspot-operand creation stays at the new lower furniture without recentering the board',()=>{
 const s=fixture();s.items.push({id:'artifact',label:'Artifact'});s.recipes.push({id:'r4',a:'c',b:'@spot-A',out:'artifact',lifecycle:{c:{role:'retain',reason:'The supply remains available.'}}});const before=M.createGame(s,375),g=act(s,before,{type:'drop',item:'c',target:'@spot-A'}),created=M.token(g.state,'artifact')!,spot=g.state.hotspots[0];
 assert.equal(created.x,spot.x);assert.equal(created.y,spot.y+16);assert.deepEqual(g.state.hotspots,before.state.hotspots);assert.deepEqual(g.state.tokens.filter(t=>t.id!=='artifact'),before.state.tokens);assert.equal(created.hotspot,null);assert.deepEqual(M.locationFootprint(s,g.state,'A').outOfBounds,[]);
});
