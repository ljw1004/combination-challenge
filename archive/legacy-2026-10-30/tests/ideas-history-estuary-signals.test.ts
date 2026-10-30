import test from 'node:test';
import assert from 'node:assert/strict';
import {q,add,sub,mul,div,eq,cmp,makeTrajectory,rescale,affine,evaluate,trajectoriesEqual,prettyTrajectory,sense,invertSensing,runFollowing,INTERFACES} from '../experiments/ideas-history-estuary-signals.ts';
const sweep=()=>makeTrajectory([[0,0],[1,45],[2,90],[3,45],[4,0]]);
test('exact normalized rational operations, decimals and safe intermediate products',()=>{
  assert.deepEqual(q([6,-8]),[-3,4]); assert.deepEqual(q(67.5),[135,2]); assert.deepEqual(q(0.1),[1,10]);
  assert.deepEqual(add([1,3],[1,6]),[1,2]); assert.deepEqual(sub(1,[1,3]),[2,3]);
  assert.deepEqual(mul([2,3],[9,4]),[3,2]); assert.deepEqual(div([2,3],[4,9]),[3,2]);
  assert(eq([2,4],[1,2])); assert.equal(cmp([1,3],[1,2]),-1);
  assert(eq(mul([Number.MAX_SAFE_INTEGER,2],[2,Number.MAX_SAFE_INTEGER]),1));
});
test('exact interpolation, union-knot equality, affine outputs and positive time rescale',()=>{
  const x=makeTrajectory([[0,0],[3,90]]), refined=makeTrajectory([[0,0],[1,30],[3,90]]);
  assert.deepEqual(evaluate(x,[1,3]),[10,1]); assert(trajectoriesEqual(x,refined));
  assert(!trajectoriesEqual(x,makeTrajectory([[0,0],[1,[3000001,100000]],[3,90]])));
  assert.equal(prettyTrajectory(rescale(x,[1,3])),'(0,0),(1,90)');
  assert.equal(prettyTrajectory(affine(x,2,-100)),'(0,-100),(3,80)');
});
test('normal, pressure and reversed following use only invertible public maps',()=>{
  for(const id of ['normal','pressure','reversed'] as const) {
    assert(runFollowing(sweep(),id,'universal').tracked);
    assert(runFollowing(sweep(),id,'bound',id).tracked);
    assert(trajectoriesEqual(invertSensing(sense(sweep(),id),id),sweep()));
  }
  assert(runFollowing(sweep(),'normal','identity').tracked);
  assert(!runFollowing(sweep(),'pressure','identity').tracked);
  assert(!runFollowing(sweep(),'reversed','identity').tracked);
  assert(!runFollowing(sweep(),'pressure','bound','normal').tracked);
});
test('live follows present input, unlike replaying a stored earlier trajectory',()=>{
  const earlier=sweep(), live=makeTrajectory([[0,90],[1,30],[3,60],[4,0]]);
  const output=runFollowing(live,'pressure','universal').actual;
  assert(trajectoriesEqual(output,live)); assert(!trajectoriesEqual(output,earlier));
});
test('clipping inserts threshold crossings and cannot distinguish 67.5 from 90',()=>{
  const a=makeTrajectory([[0,67.5],[1,67.5]]), b=makeTrajectory([[0,90],[1,90]]);
  assert(trajectoriesEqual(sense(a,'clipped'),sense(b,'clipped')));
  assert.equal(prettyTrajectory(sense(makeTrajectory([[0,0],[2,90],[4,0]]),'clipped')),'(0,0),(1,1/2),(2,1/2),(3,1/2),(4,0)');
  assert.equal(INTERFACES.clipped.invertible,false);
  assert.throws(()=>invertSensing(sense(a,'clipped'),'clipped'),/noninvertible/);
  assert.throws(()=>runFollowing(a,'clipped','universal'),/noninvertible/);
  assert.throws(()=>runFollowing(a,'clipped','bound','clipped'),/noninvertible/);
  assert(!runFollowing(a,'clipped','identity').tracked);
});
test('all returned signals are independent, including rational arrays',()=>{
  const input=sweep(), output=runFollowing(input,'normal','identity');
  output.sensed[0]!.v[0]=12; output.commands[1]!.t[0]=15;
  assert.equal(input[0]!.v[0],0); assert.equal(output.actual[0]!.v[0],0);
  assert.equal(output.actual[1]!.t[0],1);
  const pair:[number,number]=[1,2]; const copy=q(pair); copy[0]=7; assert.equal(pair[0],1);
});
test('malformed rationals, domains and trajectories fail explicitly',()=>{
  for(const value of [NaN,Infinity,Number.MAX_SAFE_INTEGER+1,[1,0],[1.5,2],[1,2,3]] ) assert.throws(()=>q(value as never));
  assert.throws(()=>add(Number.MAX_SAFE_INTEGER,1)); assert.throws(()=>div(1,0));
  for(const knots of [[],[[1,0]],[[0,-1]],[[0,91]],[[0,0],[0,45]],[[0,0],[-1,45]],[[0]]]) assert.throws(()=>makeTrajectory(knots as never));
  assert.throws(()=>rescale(sweep(),0)); assert.throws(()=>rescale(sweep(),-1));
  assert.throws(()=>evaluate(sweep(),-1)); assert.throws(()=>evaluate(sweep(),5));
  assert.throws(()=>runFollowing(sweep(),'normal','bound'));
  assert.throws(()=>runFollowing(sweep(),'missing' as never,'identity'));
});
