/** Independent latest-policy regression checks. Pure model/static CSS, not native browser evidence. */
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import * as I from '../src/history-ideas-model.ts';import * as E from '../src/elements-discovery-model.ts';import * as M from '../src/mars-expedition-model.ts';
test('All three boards declare centered bounded desktop width without widening mobile',()=>{
 for(const name of ['mars-expedition','history-ideas','elements-discovery']){const css=readFileSync(new URL(`../src/${name}.css`,import.meta.url),'utf8');assert.match(css,/max-width:\s*600px/);assert.match(css,/margin-inline:\s*auto/);}
 for(const width of [320,375,600,1440])assert.equal(I.boardLayout(I.fitBoard(I.fresh(),width),width).width,Math.min(600,width));
});
test('Ideas gold requires current placement and clears/reverses without hiding artifacts',()=>{
 let s=I.checkpoint(0,375);assert(I.witness(s,I.thing(s,'method')!));s=I.step(s,{type:'advance'}).state;assert(!I.witness(s,I.thing(s,'method')!));
 for(const [a,b]of I.routes.publication)s=I.step(s,{type:'combine',a,b}).state;
 assert(!I.witness(s,I.thing(s,'journal')!));assert(!I.placeWitness(s,'library'));
 s=I.step(s,{type:'place',id:'journal',location:'library'}).state;assert(I.witness(s,I.thing(s,'journal')!));assert(I.placeWitness(s,'library'));
 const lifted=I.step(s,{type:'place',id:'journal',x:180,y:300}).state;assert(!I.witness(lifted,I.thing(lifted,'journal')!));assert(!I.placeWitness(lifted,'library'));
 const next=I.step(s,{type:'advance'}).state;assert(!I.witness(next,I.thing(next,'journal')!));assert(!I.placeWitness(next,'library'));assert.deepEqual(I.thing(next,'journal'),I.thing(s,'journal'));assert.equal(I.visibleThings(next).length,next.things.length);
});
test('Mars placement gold waits for Contact ridge and does not leak to next chapter',()=>{
 let p=M.fresh();const id=(kind:string)=>p.state.tokens.find(t=>t.kind===kind)!.id;
 for(const [a,b]of [['broken-radio','cable'],['battery','lamp'],['foil','frame'],['lantern','reflector'],['signal-lamp','tripod']])p=M.apply(p,{type:'combine',a:id(a),b:id(b)});
 const radio=id('signal-beacon');assert(!M.goalWitnesses(p.state).tokens.has(radio));assert(!M.goalWitnesses(p.state).places.has('contact-ridge'));
 p=M.apply(p,{type:'place',token:radio,location:'contact-ridge'});assert(M.goalWitnesses(p.state).tokens.has(radio));assert(M.goalWitnesses(p.state).places.has('contact-ridge'));
 const lifted=M.apply(p,{type:'place',token:radio,location:null,x:18,y:20});assert(!M.goalWitnesses(lifted.state).tokens.has(radio));assert.deepEqual(M.undo(lifted).state,p.state);
 const before=structuredClone(p.state);p=M.apply(p,{type:'advance'});assert(!M.goalWitnesses(p.state).tokens.has(radio));assert(!M.goalWitnesses(p.state).places.has('contact-ridge'));assert.deepEqual(M.restore(JSON.stringify(p)).state,p.state);assert.deepEqual(M.undo(p).state,before);assert.equal(M.visibleTokens(p.state).length,p.state.tokens.length);
});
test('Elements gold does not leak across chapters and honors completed current subobjectives, not their precursors',()=>{
 let p=E.fresh();for(const [a,b]of E.ROUTE.slice(0,4))p=E.apply(p,{type:'combine',a,b});assert.deepEqual([...E.victoryWitnesses(p.state)].sort(),['bowl','brick']);p=E.apply(p,{type:'advance'});assert.equal(E.victoryWitnesses(p.state).size,0);assert(E.token(p.state,'bowl'));assert(E.token(p.state,'brick'));
 p=E.debugJump('comfort');for(const [a,b]of E.ROUTE.slice(12,16))p=E.apply(p,{type:'combine',a,b});assert(E.token(p.state,'window'));assert.deepEqual([...E.victoryWitnesses(p.state)],['window']);assert(!E.victoryWitnesses(p.state).has('glass'));
 for(const [a,b]of E.ROUTE.slice(16,18))p=E.apply(p,{type:'combine',a,b});assert.deepEqual([...E.victoryWitnesses(p.state)].sort(),['basket','window']);const before=structuredClone(p.state);p=E.apply(p,{type:'advance'});assert.equal(E.victoryWitnesses(p.state).size,0);assert.deepEqual(E.undo(p).state,before);assert.deepEqual(E.restore(JSON.stringify(p)),p);assert.equal(p.state.tokens.length,before.tokens.length);
});
test('Crowded births remain immediately local; source/target objects and canonical discovery survive',()=>{
 for(const width of [320,375,600]){
  let i=I.fitBoard(I.fresh(),width);for(const t of i.things){t.x=width/2;t.y=200;}const ir=I.step(i,{type:'combine',a:'observation',b:'number'});assert(ir.accepted);const it=I.thing(ir.state,'measurement')!;assert(Math.abs(it.x-width/2)<=138&&Math.abs(it.y-200)<=74);for(const t of i.things)assert.deepEqual(I.thing(ir.state,t.id),t);
  const e=E.fresh();for(const t of e.state.tokens){t.x=50;t.y=20;}const er=E.stepNamed(e.state,{type:'combine',a:'earth',b:'water',boardWidth:width});assert(er.accepted);const et=E.token(er.state,'clay')!;assert(Math.abs(et.x-50)*width/100<=112.01&&Math.abs(et.y-20)*10<=38.01);for(const t of e.state.tokens)assert.deepEqual(E.token(er.state,t.id),t);assert(!E.stepNamed(er.state,{type:'combine',a:'earth',b:'water'}).accepted);
 }
 const m=M.fresh();for(const t of m.state.tokens){t.x=18;t.y=20;}const a=m.state.tokens.find(t=>t.kind==='broken-radio')!,b=m.state.tokens.find(t=>t.kind==='cable')!,r=M.stepNamed(m.state,{type:'combine',a:a.id,b:b.id});assert(r.accepted);const t=r.state.tokens.find(t=>t.kind==='radio')!;assert(Math.abs(t.x-b.x)<=11&&Math.abs(t.y-b.y)<=4.6);assert.deepEqual(M.token(r.state,b.id),b);
});
test('Mars birth remains adjacent in actual desktop and mobile pixels, not just normalized model coordinates',()=>{
 for(const width of [320,375,600]){
 const s=M.createNamed(),a=s.tokens.find(t=>t.kind==='broken-radio')!,b=s.tokens.find(t=>t.kind==='cable')!;
 for(const t of s.tokens){t.x=18;t.y=20;}
 const r=M.stepNamed(s,{type:'combine',a:a.id,b:b.id,boardWidth:width});assert(r.accepted);const out=r.state.tokens.find(t=>t.kind==='radio')!;
 const dx=Math.abs(out.x-b.x)*width/36,dy=Math.abs(out.y-b.y)*10;
 assert(dx<=100&&dy<=46,`At ${width}: birth ${dx},${dy}px from fixed96x44px target`);
 assert(Math.max(dx/96,dy/44)>=.9,'Not completely stacked on target');
 }
});
test('Mars observations provide local sampling while the earlier Glacier remains fixed',()=>{
 const before=M.debugJump('expedition').state,after=M.debugJump('observations').state;
 assert.deepEqual(after.places.glacier,before.places.glacier);assert(after.revealed.includes('lookout-ice'));assert(after.places['lookout-ice'].y>=M.areaTop(after));
 const scoop=after.tokens.find(t=>t.kind==='scoop')!;const r=M.stepNamed(after,{type:'use-location',token:scoop.id,location:'lookout-ice',boardWidth:375});assert(r.accepted);assert.equal(r.recipe,'outcrop-sample');assert(r.state.tokens.some(t=>t.kind==='ice-sample'));assert.deepEqual(r.state.places.glacier,after.places.glacier);
});
