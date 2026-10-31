import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createField,stepField,fieldAvailability,observeField,previewField} from '../experiments/logical-field.ts';
import type {Action} from '../experiments/logical-confluence.ts';
test('wet ground enables a place combination and the same pair can transform a different target type',()=>{
  let state=createField();
  assert.equal(fieldAvailability(state,{a:'seed',b:'water',at:'marsh'}).length,0);
  state=stepField(state,{type:'combine',a:'earth',b:'water',at:'spring-marsh'});
  assert.equal(fieldAvailability(state,{a:'seed',b:'water',at:'marsh'}).length,1);
  const weir=stepField(state,{type:'combine',a:'stone',b:'water',at:'marsh'});
  const conduit=stepField(state,{type:'combine',a:'stone',b:'water',at:'spring-marsh'});
  assert.equal(weir.world.places.find(p=>p.id==='marsh')!.form,'weir');
  assert.equal(conduit.world.links.find(l=>l.id==='spring-marsh')!.form,'conduit');
});
test('private exact and public fragment accounts stay distinguishable by origin',()=>{
  const run=JSON.parse(readFileSync('results/logical-players/fun-confluence-long-1.json','utf8'));
  const state=(run.decisions.map((d:{action:Action})=>d.action) as Action[]).reduce(stepField,createField());
  const hollow=observeField(state).board.places.find(p=>p.id==='hollow')!;
  assert.equal(hollow.flooded,false);
  assert.equal(hollow.origins.find(o=>o.id==='bell')!.exact,true);
  assert.equal(hollow.origins.find(o=>o.id==='bell')!.public,false);
  assert.equal(hollow.origins.find(o=>o.id==='maker')!.public,true);
  assert.equal(hollow.origins.find(o=>o.id==='maker')!.exact,false);
});
test('preview exposes persistent configuration and actor changes without mutating the board',()=>{
  const state=createField(),before=structuredClone(state),action:Action={type:'combine',a:'seed',b:'water',at:'orchard'};
  const preview=previewField(state,action);
  assert.deepEqual(state,before);
  assert.deepEqual(preview,observeField(stepField(state,action)));
  assert.equal(preview.response.places.find(p=>p.id==='orchard')!.after.form,'grove');
  assert.equal('questions' in preview,false);
  assert.equal('chapter' in preview,false);
});
