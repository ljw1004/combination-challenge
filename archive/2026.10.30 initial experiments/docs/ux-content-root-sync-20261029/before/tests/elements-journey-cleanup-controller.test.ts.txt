import {readSiteSourceForRootTests,writeRootTestOutput} from '../scripts/site-source-test-context.ts';
const writeFileSync=writeRootTestOutput;
import test from 'node:test';import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync as originalWriteFileSync} from 'node:fs';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import type {Action} from '../experiments/tangible-campaign/schema/campaign.ts';
import {elements as s} from '../experiments/tangible-campaign/ui/stories/elements-journey-cleanup-v2.ts';
import {locationHarness} from '../experiments/tangible-campaign/ui/location-controller-harness.ts';
import {toLegacyGame,fromLegacyGame} from '../experiments/tangible-campaign/compatibility/v1.ts';
const dir=new URL('../results/elements-journey-cleanup-v2/',import.meta.url);mkdirSync(dir,{recursive:true});
const route=s.checkpoints!.find(c=>c.id==='complete')!.actions;
const pair=(a:string,b:string)=>[a,b].sort().join('|');
const recipe=(a:Action)=>a.type==='combine'?s.recipes.find(r=>pair(r.a,r.b)===pair(a.a,a.b)):undefined;
const index=(id:string)=>s.chapters.findIndex(c=>c.id===id);
const block=(id:string)=>{const at=s.checkpoints![index(id)].actions.length;const out:Action[]=[];for(const a of route.slice(at)){if(a.type==='advance')break;out.push(a);}return out;};
const earned=(id:string)=>M.checkpoint(s,`chapter-${index(id)+1}`,320);
const state=(h:ReturnType<typeof locationHarness>)=>fromLegacyGame(h.state());
const local=(g:M.Game)=>g.state.tokens.filter(t=>t.location===g.state.storyLocation);
function harness(g:M.Game){return locationHarness(s,JSON.stringify({game:toLegacyGame(g),seen:[],tops:{}}),{width:320,modernPointer:true});}
// All committed actions below go through actual controller pointer handlers.
// Direct model calls are only for labelled earned checkpoints / legal choices.
function settle(h:ReturnType<typeof locationHarness>,chapter:number){
 for(let n=0;n<100;n++){
  if(state(h).state.chapter!==chapter||state(h).state.completed)return;
  if(h.button('milestone')?.open){h.click(h.button('milestone-continue'));continue;}
  if(h.button('mission')?.open){h.click(h.button('close'));continue;}
  const timer=h.timers.find(t=>!t.ran&&!t.cancelled&&(t.ms===0||t.ms===700));if(timer){timer.fn();continue;}
  return;
 }throw Error('Unsettled finite controller timer/dialog queue');
}
function drop(h:ReturnType<typeof locationHarness>,a:Action){
 const source=a.type==='combine'?a.a:a.type==='place'?a.item:undefined;
 const target=a.type==='combine'?a.b:a.type==='place'?'@'+a.hotspot:undefined;
 assert(source&&target);const before=state(h),src=h.thing(source),dst=h.thing(target);assert(src,source);assert(dst,target);
 const board:any=h.doc.querySelector('.board');board.onpointerdown({target:src,button:0,clientX:60,clientY:100,pointerId:1,preventDefault(){}});
 assert(dst.classes.has('possible'),source+' highlights '+target);
 h.setHit(dst);board.onpointermove({clientX:210,clientY:250,pointerId:1});board.onpointerup({clientX:210,clientY:250,pointerId:1});
 const after=state(h);assert.equal(after.events.length,before.events.length+1);assert(after.events.at(-1)!.accepted,after.events.at(-1)!.message);assert.equal(after.events.at(-1)!.action.type,'drop');
 settle(h,before.state.chapter);return after;
}
function allowed(g:M.Game,a:Action){if(a.type==='combine')return M.partners(s,g.state,a.a).outgoing.includes(a.b);if(a.type==='place')return M.partners(s,g.state,a.item).placements.includes('@'+a.hotspot)||M.partners(s,g.state,a.item).settings.includes('@'+a.hotspot);return false;}

for(const id of ['workshop','letters','timekeeping','stars','gathering'])for(const mode of ['authored','random7','random29']as const)test(`actual controller ${id}/${mode}: pointer drops, visible highlights and automatic handoff`,()=>{
 const h=harness(earned(id));settle(h,index(id));let pending=block(id),n=mode==='random7'?7:29;const rows:any[]=[];let peak=local(state(h)).length;const arrival=peak;const arrivalLabels=local(state(h)).map(t=>s.items.find(i=>i.id===t.kind)!.label);const actions:Action[]=[];
 while(state(h).state.chapter===index(id)&&!state(h).state.completed){
  const legal=pending.map((a,i)=>({a,i})).filter(({a})=>allowed(state(h),a));assert(legal.length,id+' has legal planned action before automatic completion');n=(n*1664525+1013904223)>>>0;const selected=mode==='authored'?legal[0]:legal[n%legal.length];pending.splice(selected.i,1);actions.push(selected.a);const after=drop(h,selected.a);peak=Math.max(peak,local(after).length);rows.push({action:selected.a,localLabels:local(after).map(t=>s.items.find(i=>i.id===t.kind)!.label)});
 }
 const after=state(h);if(id==='gathering')assert(after.state.completed);else{assert.equal(after.state.chapter,index(id)+1);assert(h.button('mission').open,'next unfinished chapter has its real story beat');}
 assert.equal(after.events.at(-1)!.action.type,'advance','controller, not explicit test advance, ends the chapter');
 const loaded=harness(after);assert.equal(state(loaded).state.chapter,after.state.chapter);assert.deepEqual(state(loaded).state.tokens,after.state.tokens);
 writeFileSync(new URL(`controller-${id}-${mode}.json`,dir),JSON.stringify({evidenceLevel:'Synthetic DOM executing actual pointer handlers, normal highlights, creation timers and automatic handoff. Not native/browser/human evidence.',arrival,arrivalLabels,peak,actions,unperformedOptional:pending,hingePresent:!!M.token(after.state,'hinge'),rows},null,2));
});

test('goal-following workshop auto-handoff without optional Hinge, then local later construction and star auto-handoff',()=>{
 const h=harness(earned('workshop'));settle(h,index('workshop'));
 for(const a of block('workshop').filter(a=>recipe(a)?.id!=='hinge'))drop(h,a);
 let g=state(h);assert.equal(g.state.chapter,index('ferry'));assert(!M.token(g.state,'hinge'));assert(h.button('mission').open);
 // The intervening unchanged chapters are explicit logical replay setup, not
 // claimed controller evidence. Continue from the actual controller save.
 const from=s.checkpoints![index('ferry')].actions.length,to=s.checkpoints![index('stars')].actions.length;
 for(const a of route.slice(from,to)){const r=M.applyAction(s,g,a);assert(r.accepted,r.message);g=r.game;}
 assert.equal(g.state.chapter,index('stars'));assert(!M.token(g.state,'hinge'));for(const id of ['iron','nails'])assert.equal(M.token(g.state,id)!.location,g.state.currentLocation);
 const stars=harness(g);settle(stars,index('stars'));const arrival=local(state(stars)).map(t=>s.items.find(i=>i.id===t.kind)!.label);drop(stars,{type:'combine',a:'iron',b:'nails'});for(const a of block('stars'))drop(stars,a);assert.equal(state(stars).state.chapter,index('gallery'));assert(stars.button('mission').open);
 writeFileSync(new URL('controller-goals-only-no-hinge.json',dir),JSON.stringify({workshopAutoHandoff:true,starsAutoHandoff:true,starsArrival:arrival,limits:'Synthetic controller at workshop/stars, logical replay between. Unchanged recipe admits remote Hinge fabrication; this is not physically verified headland forging.'},null,2));
});
