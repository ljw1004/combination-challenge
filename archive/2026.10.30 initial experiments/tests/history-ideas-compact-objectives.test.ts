import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import * as M from '../src/history-ideas-model.ts';
test('desktop uses the same centered 600px worktable as Mars; model coordinates agree with CSS',()=>{
 const css=readFileSync(new URL('../src/history-ideas.css',import.meta.url),'utf8');assert.match(css,/\.board\{max-width:600px;margin-inline:auto\}/);
 for(const width of [320,375,600,1280,1920]){const s=M.fitBoard(M.fresh(),width),layout=M.boardLayout(s,width);assert.equal(layout.width,Math.min(width,600));assert.equal(s.boardWidth,layout.width);for(const p of layout.positions.values())assert(p.x>=67&&p.x+67<=layout.width);}
});
test('gold requires the actual current objective, including placement; previous goals lose gold without disappearing',()=>{
 let s=M.checkpoint(0,375);assert(M.witness(s,M.thing(s,'method')!));s=M.step(s,{type:'advance'}).state;assert(!M.witness(s,M.thing(s,'method')!));assert(!M.placeWitness(s,'library'));
 for(const [a,b]of M.routes.publication)s=M.step(s,{type:'combine',a,b}).state;
 assert(!M.witness(s,M.thing(s,'journal')!));assert(!M.placeWitness(s,'library'));
 s=M.step(s,{type:'place',id:'journal',location:'library'}).state;assert(M.witness(s,M.thing(s,'journal')!));assert(M.placeWitness(s,'library'));
 s=M.step(s,{type:'advance'}).state;assert(M.thing(s,'journal'));assert(!M.witness(s,M.thing(s,'journal')!));assert(!M.placeWitness(s,'library'));
 s=M.checkpoint(2,375);assert(M.witness(s,M.thing(s,'tide-pressure-2')!));assert(M.placeWitness(s,'listening'));
 s=M.step(s,{type:'place',id:'tide-pressure-2',x:100,y:500}).state;assert(!M.witness(s,M.thing(s,'tide-pressure-2')!));assert(!M.placeWitness(s,'listening'));
});
test('birth chooses immediately adjacent clear space, or nearby overlap rather than a remote free slot',()=>{
 const empty:M.State={things:[],chapter:0,achieved:[],actions:0,boardWidth:600};
 const target={x:300,y:200},p=M.nearbyBirth(empty,target);assert.deepEqual(p,{x:436,y:246});
 const crowded=structuredClone(empty);for(let x=70;x<=530;x+=30)for(let y=80;y<=320;y+=20)crowded.things.push({id:`${x}/${y}`,kind:'number',x,y});
 const q=M.nearbyBirth(crowded,target);assert(Math.abs(q.x-target.x)<=136);assert(Math.abs(q.y-target.y)<=46);assert(Math.abs(q.x-target.x)>=134||Math.abs(q.y-target.y)>=44,'birth lies against an edge of the target, not over its center');
 for(const width of [320,375,600,1920]){let s=M.fitBoard(M.fresh(),width);for(const [a,b]of M.routes.inquiry){const before=structuredClone(M.thing(s,a)),r=M.step(s,{type:'combine',a,b});assert(r.accepted);const t=M.thing(r.state,r.created!)!;assert(Math.abs(t.x-r.origin!.x)<=137);assert(Math.abs(t.y-r.origin!.y)<=46);assert.deepEqual(M.thing(r.state,a),before);s=r.state;}}
});

test('birth and animation originate at the rendered center of a placed operand',()=>{
 const s=M.checkpoint(1,375),target=M.boardLayout(s,375).positions.get('journal')!;
 const result=M.step(s,{type:'combine',a:'doubt',b:'journal'});assert(result.accepted);assert.deepEqual(result.origin,target);
 const created=M.thing(result.state,'review')!;assert(Math.abs(created.x-target.x)<=136);assert(Math.abs(created.y-target.y)<=46);assert.deepEqual(M.thing(result.state,'journal'),M.thing(s,'journal'));
});
