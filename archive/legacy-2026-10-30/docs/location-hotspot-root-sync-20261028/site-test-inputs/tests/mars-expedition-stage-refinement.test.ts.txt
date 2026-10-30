import test from 'node:test';import assert from 'node:assert/strict';
import * as M from '../src/mars-expedition-model.ts';
test('Gold marks a completed placement only, and expires when the next stage begins',()=>{
 let p=M.fresh();const id=(kind:string)=>p.state.tokens.find(t=>t.kind===kind)!.id;const c=(a:string,b:string)=>{p=M.apply(p,{type:'combine',a:id(a),b:id(b)});};
 c('broken-radio','cable');c('battery','lamp');c('foil','frame');c('lantern','reflector');c('signal-lamp','tripod');const radio=id('signal-beacon');
 assert(!M.goalWitnesses(p.state).tokens.has(radio));assert.equal(M.goalWitnesses(p.state).places.size,0);
 p=M.apply(p,{type:'place',token:radio,location:'contact-ridge'});assert(M.goalWitnesses(p.state).tokens.has(radio));assert(M.goalWitnesses(p.state).places.has('contact-ridge'));
 p=M.apply(p,{type:'advance'});assert(!M.goalWitnesses(p.state).tokens.has(radio));assert(!M.goalWitnesses(p.state).places.has('contact-ridge'));
});
test('Final local outcrop produces specimen without moving or revisiting the original glacier',()=>{
 const s=M.debugJump('observations').state;assert(s.places.glacier.y<M.areaTop(s));assert(s.places['lookout-ice'].y>=M.areaTop(s));
 const r=M.stepNamed(s,{type:'use-location',token:s.tokens.find(t=>t.kind==='scoop')!.id,location:'lookout-ice'});assert(r.accepted&&r.created);assert.deepEqual(r.state.places.glacier,s.places.glacier);
 const t=M.token(r.state,r.created!)!;assert(t.y>=M.areaTop(s));assert(Math.hypot(t.x-s.places['lookout-ice'].x,t.y-s.places['lookout-ice'].y)<15);
});
test('Crowded creation chooses a bounded adjacent overlap rather than a far empty cell',()=>{
 const s=M.createNamed(),a=s.tokens.find(t=>t.kind==='broken-radio')!,b=s.tokens.find(t=>t.kind==='cable')!;b.x=18;b.y=30;
 s.tokens.filter(t=>t!==a&&t!==b).forEach((t,i)=>{t.x=7+(i%3)*11;t.y=25+Math.floor(i/3)*4.4;});
 const r=M.stepNamed(s,{type:'combine',a:a.id,b:b.id});assert(r.accepted&&r.created);const made=M.token(r.state,r.created!)!;
 assert(Math.abs(made.x-b.x)<=11);assert(Math.abs(made.y-b.y)<=4.6);assert.deepEqual(M.token(r.state,b.id),b);
});
test('Birth offsets stay touching in actual pixels on phone and capped desktop',()=>{
 for(const width of [320,375,600]){const s=M.createNamed(),a=s.tokens.find(t=>t.kind==='broken-radio')!,b=s.tokens.find(t=>t.kind==='cable')!;b.x=18;b.y=40;const r=M.stepNamed(s,{type:'combine',a:a.id,b:b.id,boardWidth:width}),t=M.token(r.state,r.created!)!;const dx=Math.abs(t.x-b.x)/36*width,dy=Math.abs(t.y-b.y)*10;assert(dx<=99&&dy<=46);assert(dx>=95||dy>=44);}
});
