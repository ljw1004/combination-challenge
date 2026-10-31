import test from 'node:test';
import assert from 'node:assert/strict';
import { RECIPES } from '../src/data.ts';
import { canonical } from '../src/joinery-model.ts';
import {
  blendConstellation, captureConstellation, constellationHash, createConstellation,
  moveConstellation, previewConstellation, replayConstellation, restoreLayout,
  rotateConstellation, selectConstellationGoal,
} from '../src/constellation-model.ts';

const at={x:560,y:300};
test('a fusion introduces one concept, retaining both ingredients and their positions',()=>{
  const original=createConstellation(),snapshot=structuredClone(original);
  const made=blendConstellation(original,'soil','water',at);
  assert.deepEqual(original,snapshot);
  assert.equal(made.nodes.length,7);
  assert.deepEqual(made.nodes.find(node=>node.id==='soil'),original.nodes.find(node=>node.id==='soil'));
  assert.deepEqual(made.nodes.find(node=>node.id==='water'),original.nodes.find(node=>node.id==='water'));
  const clay=made.nodes.find(node=>node.id==='clay')!;
  assert.ok(Math.hypot(clay.x-at.x,clay.y-at.y)<400);
  assert.ok(made.nodes.filter(node=>node.id!=='clay').every(node=>Math.hypot(node.x-clay.x,node.y-clay.y)>=136));
  const reeds=blendConstellation(made,'water','seed',at);
  assert.ok(reeds.nodes.some(node=>node.id==='reeds'));
  assert.ok(reeds.nodes.some(node=>node.id==='water'));
});

test('completed pairs stop inviting discovery and repeating them makes no duplicate or reward',()=>{
  const initial=createConstellation();
  const preview=previewConstellation(initial,'soil','water');
  assert.equal(preview.valid,true);assert.equal(preview.novel,true);assert.equal(preview.used,false);
  const made=blendConstellation(initial,'soil','water',at);
  const after=previewConstellation(made,'water','soil');
  assert.equal(after.valid,true);assert.equal(after.novel,false);assert.equal(after.used,true);
  const repeated=blendConstellation(made,'water','soil',{x:-200,y:800});
  assert.deepEqual(repeated.nodes,made.nodes);assert.deepEqual(repeated.links,made.links);
  assert.equal(repeated.mixes,made.mixes);
});

test('an alternate route to a known output records a relationship without duplicating it',()=>{
  let state=createConstellation();
  state=blendConstellation(state,'soil','water',at);
  state=blendConstellation(state,'clay','heat',at);
  state=blendConstellation(state,'stone','water',at);
  const preview=previewConstellation(state,'brick','water');
  assert.equal(preview.valid,true);assert.equal(preview.novel,false);assert.equal(preview.used,false);
  const connected=blendConstellation(state,'brick','water',at);
  assert.equal(connected.nodes.length,state.nodes.length);
  assert.equal(connected.nodes.filter(node=>node.id==='channel').length,1);
  assert.equal(connected.links.at(-1)?.out,'channel');
});

test('all disclosed alchemy paths remain available without spending the six origins',()=>{
  let state=createConstellation();
  for(const recipe of RECIPES){
    const preview=previewConstellation(state,...recipe.inputs);
    assert.ok(preview.valid,recipe.id);
    if(preview.valid)assert.equal(preview.result.id,recipe.output);
    state=blendConstellation(state,...recipe.inputs,at);
  }
  assert.equal(state.nodes.length,16);assert.equal(state.links.length,15);
  for(const node of createConstellation().nodes)assert.deepEqual(state.nodes.find(known=>known.id===node.id),node);
});

test('the same two forms produce different, fully previewed concepts through their contact geometry',()=>{
  const initial=createConstellation('forms');
  const a=previewConstellation(initial,'bar-a','bar-b',{x:2,y:0});
  const b=previewConstellation(initial,'bar-a','bar-b',{x:1,y:1});
  assert.ok(a.valid);assert.ok(b.valid);
  if(!a.valid||!b.valid)return;
  assert.notEqual(canonical(a.result.cells!),canonical(b.result.cells!));
  const first=blendConstellation(initial,'bar-a','bar-b',at,a.offset);
  assert.deepEqual(first.nodes.find(node=>node.id===a.result.id)?.cells,a.result.cells);
  const secondPreview=previewConstellation(first,'bar-a','bar-b',b.offset);
  assert.equal(secondPreview.novel,true);assert.equal(secondPreview.used,false);
  const second=blendConstellation(first,'bar-a','bar-b',at,b.offset);
  assert.equal(second.nodes.length,6);
  assert.deepEqual(second.nodes.slice(0,4),initial.nodes);
  assert.equal(second.completed.length,2);
});

test('form rotations retain color provenance and deduplicate an already established shape',()=>{
  let state=createConstellation('forms');
  state=blendConstellation(state,'bar-a','bar-b',at,{x:2,y:0});
  const id=state.nodes.at(-1)!.id;
  const before=structuredClone(state.nodes.at(-1)!);
  const turned=rotateConstellation(state,id);
  const form=turned.nodes.find(node=>node.id===id)!;
  assert.equal(canonical(form.cells!),canonical(before.cells!));
  assert.deepEqual([...form.cellColors!].sort(),[...before.cellColors!].sort());
  let rotatedParents=rotateConstellation(rotateConstellation(state,'bar-a'),'bar-b');
  const candidates=[{x:0,y:2},{x:0,y:-1},{x:1,y:0},{x:0,y:-2}];
  const same=candidates.map(offset=>({offset,preview:previewConstellation(rotatedParents,'bar-a','bar-b',offset)})).find(({preview})=>preview.valid&&preview.result.id===id);
  assert.ok(same,'rotated parents can reproduce the same canonical shape');
  rotatedParents=blendConstellation(rotatedParents,'bar-a','bar-b',at,same!.offset);
  assert.equal(rotatedParents.nodes.length,state.nodes.length);
});

test('discovery is inexhaustible and the canvas has no old forty-piece ceiling',()=>{
  let state=rotateConstellation(createConstellation('forms'),'bar-a');
  let source='bar-a';
  for(let i=0;i<43;i++){
    const preview=previewConstellation(state,source,'bar-b',{x:2,y:0});
    assert.ok(preview.valid);assert.equal(preview.novel,true);
    if(!preview.valid)throw new Error('Expected an edge contact.');
    state=blendConstellation(state,source,'bar-b',{x:2000+i*3000,y:300},{x:2,y:0});
    source=preview.result.id;
  }
  assert.equal(state.nodes.length,47);
  assert.equal(state.nodes.find(node=>node.id===source)?.cells?.length,88);
  assert.ok(state.nodes.some(node=>node.id==='bar-a'));assert.ok(state.nodes.some(node=>node.id==='bar-b'));
  const moved=moveConstellation(state,'bar-b',-1_000_000,1_000_000);
  assert.deepEqual({x:moved.nodes[1].x,y:moved.nodes[1].y},{x:-1_000_000,y:1_000_000});
});

test('undo restores handling while every discovered concept and connection stays established',()=>{
  const original=createConstellation();
  const moved=moveConstellation(original,'soil',-300,700);
  const discovered=blendConstellation(moved,'soil','water',at);
  const restored=restoreLayout(discovered,original);
  assert.deepEqual(restored.nodes.find(node=>node.id==='soil'),original.nodes.find(node=>node.id==='soil'));
  assert.deepEqual(restored.nodes.find(node=>node.id==='clay'),discovered.nodes.find(node=>node.id==='clay'));
  assert.deepEqual(restored.links,discovered.links);assert.deepEqual(restored.completed,discovered.completed);
  assert.equal(restored.mixes,discovered.mixes);
});

test('the illustrative research sketch composes checking and experimentation without pretending prediction is causation',()=>{
  let state=createConstellation('ideas');
  for(const [a,b]of [['ai','mathematics'],['ai','genome'],['mathematics','logic'],['genome','experiment'],['proof-search','formal-verification'],['regulatory-model','perturbation-test']])state=blendConstellation(state,a,b,at);
  assert.equal(state.nodes.length,11);
  assert.ok(state.nodes.find(node=>node.id==='regulatory-model')?.description.includes('does not establish causation'));
  assert.ok(state.nodes.some(node=>node.id==='checked-proof'));assert.ok(state.nodes.some(node=>node.id==='tested-model'));
  assert.equal(state.goal,undefined);
});

test('capture replays exact semantic and handling actions, and rejects altered evidence',()=>{
  const actions=[
    {type:'move' as const,id:'bar-b',x:450,y:300},
    {type:'rotate' as const,id:'corner-a'},
    {type:'blend' as const,a:'bar-a',b:'bar-b',at,offset:{x:0,y:-2}},
    {type:'goal' as const,id:'the-key'},
  ];
  const run=captureConstellation(actions,'forms');
  const replayed=replayConstellation(run);
  assert.equal(constellationHash(replayed),run.decisions.at(-1)?.after);
  const tampered=structuredClone(run);tampered.decisions[0].after='fabricated';
  assert.throws(()=>replayConstellation(tampered),/diverged after action 0/);
  const level=selectConstellationGoal(createConstellation('forms'),'the-crossing');
  assert.equal(level.goal?.id,'the-crossing');
});

test('illegal or nonfinite contacts are rejected without changing the universe',()=>{
  const state=createConstellation('forms'),snapshot=structuredClone(state);
  assert.equal(previewConstellation(state,'bar-a','bar-b',{x:0,y:0}).valid,false);
  assert.equal(previewConstellation(state,'bar-a','bar-a').valid,false);
  assert.equal(previewConstellation(state,'bar-a','bar-b',{x:.5,y:0}).valid,false);
  assert.throws(()=>blendConstellation(state,'bar-a','bar-b',at,{x:0,y:0}),/cannot overlap/);
  assert.throws(()=>moveConstellation(state,'bar-a',Infinity,0),/finite/);
  assert.deepEqual(state,snapshot);
});
