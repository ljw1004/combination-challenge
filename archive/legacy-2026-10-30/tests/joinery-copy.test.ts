import test from 'node:test';
import assert from 'node:assert/strict';
import {createJoinery,joineryStep,undoJoinery} from '../src/joinery-model.ts';
test('an established complete form can be reused directly after undo without rebuilding its chain',()=>{
  const before=createJoinery();const made=joineryStep(before,{type:'join',source:{pieceId:'piece-2'},targetId:'piece-1',offset:{x:0,y:2},x:.3,y:.4});
  assert.equal(made.status,'won');const restored=undoJoinery(made,before);
  const form=restored.known.find(p=>p.id.startsWith('form-'))!;assert.ok(form);
  const copied=joineryStep(restored,{type:'take',stockId:form.id,x:.4,y:.4});
  assert.equal(copied.status,'won');assert.equal(copied.joins,0);assert.ok(copied.known.some(p=>p.id===form.id));
});
