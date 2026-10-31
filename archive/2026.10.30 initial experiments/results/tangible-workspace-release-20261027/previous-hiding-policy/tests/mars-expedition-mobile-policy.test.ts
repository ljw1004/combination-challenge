import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../src/mars-expedition-model.ts';
import * as E from '../experiments/mars-remote-next/model.ts';

test('Every primitive belongs to exactly one physical salvage cache; final chapter supplies none',()=>{
 const items=M.caches.flatMap(c=>c.items);
 assert.equal(items.length,new Set(items).size);
 assert.deepEqual([...items].sort(),[...E.supplies].sort());
 assert.equal(M.caches[3].items.length,0);
 assert.equal(M.createNamed().known.length,9);
 for(const f of M.fixtures){const s=M.debugJump(f.id).state;assert.deepEqual(s.known.filter(k=>E.supplies.includes(k)).sort(),M.caches.slice(0,s.level+1).flatMap(c=>c.items).sort());}
});
test('All nine opening cards fit a 320px phone and 290px board without horizontal travel',()=>{
 const s=M.createNamed();assert.equal(M.worldSize(s).width,36);
 for(const t of M.visibleTokens(s)){const center=t.x/36*320;assert(center-44>=0);assert(center+44<=320);assert(t.y*10+30<=290);}
 assert(M.worldSize(s).height*10<=290);
});
test('Hiding is derived, lossless and future-aware rather than based on currently available partners',()=>{
 const s=M.createNamed();const frame=s.tokens.find(t=>t.kind==='frame')!;
 assert(!s.tokens.some(t=>t.kind==='wheels'));assert(M.visibleTokens(s).includes(frame),'future cargo partner preserves frame');
 const a=s.tokens.find(t=>t.kind==='broken-radio')!,b=s.tokens.find(t=>t.kind==='cable')!;
 const r=M.stepNamed(s,{type:'combine',a:a.id,b:b.id});assert(r.accepted);
 assert(r.state.tokens.some(t=>t.id===b.id),'spent cable remains canonical');assert(!M.visibleTokens(r.state).some(t=>t.id===b.id),'spent cable leaves active board');
 const before=JSON.stringify(r.state);M.visibleTokens(r.state);assert.equal(JSON.stringify(r.state),before);
});
test('Bounds ignore hidden/future things and permit only useful occupied extent',()=>{
 const s=M.createNamed();const cable=s.tokens.find(t=>t.kind==='cable')!,broken=s.tokens.find(t=>t.kind==='broken-radio')!;
 const r=M.stepNamed(s,{type:'combine',a:broken.id,b:cable.id});assert(r.accepted);
 const before=M.worldSize(r.state);r.state.tokens.find(t=>t.id===cable.id)!.y=100000;
 assert.deepEqual(M.worldSize(r.state),before);
 assert.equal(M.edgePan(-1000,200,{left:0,top:0,width:320,height:400}).x,0);
});
test('Completed checkpoints retain functional goals canonically even if their loose achievements are hidden',()=>{
 const s=M.debugJump('complete').state;
 assert(M.goalStates(s).every(g=>g.current&&g.achieved));
 assert(s.tokens.some(t=>t.kind==='annotated-survey-map'));
 assert(!M.visibleTokens(s).some(t=>t.kind==='annotated-survey-map'));
});
