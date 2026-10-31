import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {locationHarness} from '../experiments/tangible-campaign/ui/location-controller-harness.ts';
import {reconcileLocationDom} from '../experiments/tangible-campaign/ui/location-dom.ts';
import {syntheticDocument} from '../experiments/tangible-campaign/ui/synthetic-dom.ts';
import {fixture} from './location-story-model.test.ts';
import {fromLegacyGame} from '../experiments/tangible-campaign/compatibility/v1.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
type Harness=ReturnType<typeof locationHarness>;
const scene=(h:Harness,id='A')=>h.doc.querySelectorAll('.location-scene').find((e:any)=>e.dataset.location===id);
const tick=(h:Harness)=>h.timers.filter(t=>t.ms===700).at(-1)?.fn();
const drag=(h:Harness,id:string,target:string|null,pointer=1)=>{const board=h.doc.querySelector('.board');board.onpointerdown({target:h.thing(id),button:0,clientX:52,clientY:100,pointerId:pointer,preventDefault(){}});h.setHit(target?h.thing(target):null);board.onpointermove({clientX:210,clientY:220,pointerId:pointer});board.onpointerup({clientX:210,clientY:220,pointerId:pointer});h.flush();};
test('scene, decoded-image identity, viewport, focus and input owner survive repeated selection, drag-combine and Undo',()=>{
 const h=locationHarness(fixture());h.click(h.button('close'));
 const viewport=h.doc.querySelector('.viewport'),board=h.doc.querySelector('.board'),a=scene(h),img=a.querySelector('img'),thing=h.thing('a');
 viewport.scrollTop=120;thing.focus();
 for(let n=0;n<8;n++){
  h.click(h.thing('a'));assert.equal(h.doc.activeElement,thing);h.click(h.thing('a'));
  drag(h,'a','b',n+1);assert(h.thing('c'));h.click(h.button('undo'));assert(!h.thing('c'));
  assert.equal(scene(h),a);assert.equal(a.querySelector('img'),img);assert.equal(h.doc.querySelector('.viewport'),viewport);assert.equal(h.doc.querySelector('.board'),board);
  assert.equal(img.connectionBreaks,0);assert.equal(a.connectionBreaks,0);assert.equal(img.srcWrites,1);assert.equal(img.getAttribute('loading'),'eager');assert.equal(img.getAttribute('decoding'),'async');
  assert.equal(viewport.scrollTop,120);
  for(const event of ['touchstart','touchmove','touchend','touchcancel'])assert.equal(board.listeners[event].length,1,`${event} is attached once`);
 }
});
test('sustained edge scrolling has one timer owner; pointerup, cancel, lost capture, blur and resize release it',()=>{
 for(const ending of ['up','cancel','capture','blur','resize']){
  const h=locationHarness(fixture());h.click(h.button('close'));const board=h.doc.querySelector('.board'),img=scene(h).querySelector('img');
  const pending=()=>h.timers.filter(t=>t.ms===16&&!t.ran&&!t.cancelled);
  board.onpointerdown({target:h.thing('kept'),button:0,clientX:210,clientY:220,pointerId:9,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:210,clientY:490,pointerId:9});
  for(let frame=0;frame<30;frame++){assert.equal(pending().length,1);pending()[0].fn();assert.equal(img.connectionBreaks,0);}
  assert(h.doc.querySelector('.viewport').scrollTop>0);
  board.onpointerup({clientX:210,clientY:490,pointerId:8});assert.equal(pending().length,1,'another pointer does not cancel the owner');
  if(ending==='up')board.onpointerup({clientX:210,clientY:490,pointerId:9});
  else if(ending==='cancel')board.onpointercancel({pointerId:9});
  else if(ending==='capture')board.onlostpointercapture({pointerId:9});
  else h.windowEvents[ending]();
  assert.equal(pending().length,0,ending+' clears the autoscroll owner');assert.equal(board.capturedPointers.size,0,ending+' releases pointer capture');const after=h.state();
  for(const timer of h.timers.filter(t=>t.ms===16&&t.cancelled))timer.fn();
  board.onpointerup({clientX:210,clientY:490,pointerId:9});assert.deepEqual(h.state(),after,'stale up and canceled frames do not act');
  for(const event of ['touchstart','touchmove','touchend','touchcancel'])assert.equal(board.listeners[event].length,1);
  assert.equal(img.connectionBreaks,0);
 }
});
test('same-place beats, source updates, new locations, visits, Undo and reset reconcile only actual scene additions/removals',()=>{
 const s=fixture(),h=locationHarness(s);h.click(h.button('close'));const a=scene(h),img=a.querySelector('img');
 for(const [left,right] of [['a','b'],['c','d'],['e','record']]){drag(h,left,right);tick(h);assert(h.button('mission').open);h.click(h.button('close'));assert.equal(scene(h),a);assert.equal(img.connectionBreaks,0);}
 const b=scene(h,'B'),bimg=b.querySelector('img');assert(b);assert.equal(h.doc.querySelectorAll('.location-scene').length,2);
 for(const id of ['A','B','A','B']){h.click(h.button('debug-toggle'));h.button('travel').onchange({target:{value:id}});assert.equal(scene(h),a);assert.equal(scene(h,'B'),b);assert.equal(img.connectionBreaks,0);assert.equal(bimg.connectionBreaks,0);}
 h.click(h.button('undo'));assert.equal(scene(h),a);assert.equal(img.srcWrites,1);
 h.click(h.button('reset'));assert.equal(scene(h),a);assert.equal(img.connectionBreaks,0);assert.equal(scene(h,'B'),undefined);assert.equal(bimg.isConnected,false);
 assert.equal(h.doc.querySelectorAll('.location-scene').length,1);assert.equal(fromLegacyGame(h.state()).state.chapter,0);
});
test('ordinary story dialog has exactly one prose block, a native keyboard dismissal and no duplicate goals/decorations',()=>{
 const s=fixture(),h=locationHarness(s),d=h.button('mission'),markup=d.innerHTML;
 assert(d.open);assert.equal(d.getAttribute('aria-label'),'Story');assert.equal(d.getAttribute('aria-describedby'),'mission-text');assert.equal(h.doc.activeElement,h.button('close'));
 assert.equal(d.querySelectorAll('button').length,1);assert.equal(d.querySelectorAll('span').length,1);assert(d.textContent.includes(s.chapters[0].entryCue!.text));
 for(const forbidden of ['<h1','<ul','<li','speaker','source-caption','Start over','Understood','Chapter 1','Make c'])assert(!markup.includes(forbidden),forbidden);
 assert(h.button('purpose').textContent.includes('Make c'));let prevented=false;d.oncancel({preventDefault(){prevented=true;}});assert(prevented);assert(!d.open);assert.equal(h.doc.activeElement,h.button('purpose'));
 h.click(h.button('purpose'));assert.equal(h.button('mission'),d);assert(d.open);h.click(h.button('close'));assert(!d.open);
});
test('stable dialogs keep ownership/focus and deferred handoffs, while the scene survives reading and save status changes',()=>{
 const s=fixture();s.items.find(i=>i.id==='kept')!.reading={text:'An old source remains available.',attribution:'Fixture source.'};
 const h=locationHarness(s,undefined,{deferSave:true});h.click(h.button('close'));const img=scene(h).querySelector('img');h.click(h.thing('kept'));h.click(h.button('read-source'));const reader=h.button('source-reader');assert(reader.open);assert(!h.button('mission').open);
 const focused=h.doc.activeElement;h.emitSaveStatus('error','Save test failure.');assert.equal(h.button('source-reader'),reader);assert(reader.open);assert.equal(h.doc.activeElement,focused);assert.equal(img.connectionBreaks,0);
 h.click(h.button('reader-close'));assert.equal(h.button('source-reader'),null);assert.equal(h.doc.activeElement,h.button('read-source'));
 h.click(h.thing('kept'));drag(h,'a','b');h.click(h.button('debug-toggle'));const debug=h.button('debug-dialog');tick(h);assert(debug.open);assert.equal(fromLegacyGame(h.state()).state.chapter,0);h.click(h.button('debug-close'));h.flush();assert.equal(fromLegacyGame(h.state()).state.chapter,1);assert(h.button('mission').open);assert(!debug.open);assert.equal(img.connectionBreaks,0);
});
test('plain cards preserve completed ending controls and separate earned invention celebrations',()=>{
 const s=fixture();s.chapters=[s.chapters[0]];s.locationPlan!.visits=[{...s.locationPlan!.visits[0],chapterIds:['one']}];s.milestones=[{id:'c-hero',item:'c',title:'A real invention',text:'A useful new possibility.',when:'created'}];
 const h=locationHarness(s);h.click(h.button('close'));drag(h,'a','b');tick(h);assert(h.button('milestone').open);assert(h.button('milestone-continue'));assert.equal(h.button('mission').open,false);h.click(h.button('milestone-continue'));h.flush();assert(fromLegacyGame(h.state()).state.completed);assert(h.button('mission').open);assert(h.button('mission-title'));assert(h.button('modal-reset'));assert.equal(h.button('close').textContent,'Explore your creations');
});
test('navigation flushes save before changing worlds; renderer never reuses another world asset accidentally',async()=>{
 const h=locationHarness(fixture(),undefined,{deferFlush:true});h.click(h.button('close'));const img=scene(h).querySelector('img');h.click(h.button('debug-toggle'));const leaving=h.button('go-chooser').onclick({preventDefault(){}});assert.equal(h.navigated.length,0);assert.equal(img.connectionBreaks,0);h.resolveFlush();await leaving;assert.deepEqual(h.navigated,['campaign.html']);
 const {app}=syntheticDocument();const markup=(world:string)=>`<div class="location-scene" data-location="same-id" data-background="${world}"><img src="/${world}.webp" alt=""></div>`;
 reconcileLocationDom(app as unknown as HTMLElement,markup('first'));const first=app.querySelector('img')!;reconcileLocationDom(app as unknown as HTMLElement,markup('second'));assert.equal(app.querySelector('img')!.getAttribute('src'),'/second.webp');assert.equal(first.srcWrites,2);
});
test('source contract: image retention is connected patching, eager paint and stronger artwork, not a flash-hiding overlay',()=>{
 const read=(p:string)=>readFileSync(new URL('../experiments/tangible-campaign/ui/'+p,import.meta.url),'utf8');
 assert.match(read('campaign-main.ts'),/reconcileLocationDom\(app,markup\)/);assert(!read('campaign-main.ts').includes('loading="lazy"'));assert.match(read('location-dom.ts'),/if \(node !== cursor\) target.insertBefore/);assert.match(read('location-dom.ts'),/e.getAttribute\(attr.name\) !== attr.value/);
 const css=read('campaign.css');assert.match(css,/opacity:\.94;filter:saturate\(1\.08\)/);assert.match(css,/\.fixed-locations \.thing\{background:#fffaf0/);assert(!/flash|loading-overlay/.test(css));
});
