import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import * as M from './runtime/engine/model.ts';import * as L from './runtime/schema/lifecycle.ts';
const root=new URL('.',import.meta.url),read=f=>JSON.parse(fs.readFileSync(new URL(f,root),'utf8')),write=(f,o)=>fs.writeFileSync(new URL(f,root),JSON.stringify(o,null,2)+'\n'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(new URL(f,root))).digest('hex');
const s=read('doctrine-optional-continuation-v2-candidate.json'),prior=read('../doctrine-optional-continuation-v1-candidate.json'),m=read('authoring-manifest.json'),priorM=read('../authoring-manifest.json');
test('reviewed a53 candidate and all reports unchanged; v10 separately preserved',()=>{
 assert.equal(sha('../doctrine-optional-continuation-v1-candidate.json'),'a53a4284db53573ea6d272b0d6524d83d1dd25c52e638185afb40459d04cc5de');
 for(const [file,digest] of Object.entries(read('original-preservation.json').files))assert.equal(sha('../'+file),digest,file);
 assert.equal(sha('../../revision-10-ceremony-clarity/doctrine-argument-desks-v10-candidate.json'),'3a00d3b8c220590c3411d132059d6bf41740f947a503a2cf582421e531034f8e');
 const v10=read('../../revision-10-ceremony-clarity/doctrine-argument-desks-v10-candidate.json');assert(M.checkpoint(v10,'complete').state.completed);
});
test('exact operation ledger changes only scenario identity and checkpoint metadata/list',()=>{
 const expected=structuredClone(prior);for(const op of read('exact-diff.json')){assert(op.path==='/id'||op.path.startsWith('/checkpoints/'));const keys=op.path.slice(1).split('/');let owner=expected;for(const k of keys.slice(0,-1))owner=owner[k];const k=keys.at(-1);assert.deepEqual(owner[k],op.before);if(op.op==='remove')owner.splice(Number(k),1);else owner[k]=op.value;}
 assert.deepEqual(s,expected);for(const k of Object.keys(prior).filter(k=>!['id','checkpoints'].includes(k)))assert.deepEqual(s[k],prior[k],k);
 assert.deepEqual(m.authoredActions,priorM.authoredActions);assert.deepEqual(s.checkpoints.slice(0,8),prior.checkpoints.slice(0,8));
 assert.deepEqual(s.checkpoints[8].actions,prior.checkpoints[8].actions);assert.deepEqual(s.checkpoints[9].actions,prior.checkpoints[10].actions);assert.deepEqual(s.checkpoints[10].actions,prior.checkpoints[11].actions);
 // All three final-copy corrections survive unchanged.
 const get=(o,p)=>p.slice(1).split('/').reduce((a,k)=>a[k],o);for(const c of read('../final-copy-integrity.json').exactCopyChanges)assert.equal(get(s,c.path),c.after);
});
test('schema/lifecycle flow pass; supplied existing61a9 runtime remains byte-identical',()=>{
 assert.deepEqual(M.validateScenario(s),[]);for(const f of [L.validateContentLifecycles,L.validateObjectiveFlow,L.validateConstructionContinuity])assert.deepEqual(f([s]),[]);
 for(const f of ['engine/model.ts','schema/scenario.ts','schema/lifecycle.ts'])assert.equal(sha('runtime/'+f),sha('../runtime/'+f));
 assert.equal(new Set(s.checkpoints.map(c=>c.id)).size,11);assert.equal(s.checkpoints.length,11);
});
test('all eleven checkpoints earned by exact authored route prefix, both widths and directions',()=>{
 const rows=[];for(const [i,cp] of s.checkpoints.entries()){
  assert.deepEqual(cp.actions,m.authoredActions.slice(0,cp.actions.length));const previous=prior.checkpoints[i<9?i:i+1];
  for(const width of [320,600])for(const reversed of [false,true]){const actions=cp.actions.map(a=>a.type==='combine'&&reversed?{...a,a:a.b,b:a.a}:a),g=M.replay(s,actions,width),old=M.replay(prior,actions,width);assert.deepEqual(g.state,old.state);assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);
   assert.equal(g.state.completed,cp.id==='complete');assert.equal(g.state.stage,Math.min(i,9));assert.deepEqual(cp.actions,previous.actions);rows.push({checkpoint:cp.id,label:cp.label,actions:actions.length,width,reversed,stage:g.state.stage,completed:g.state.completed,combinations:g.state.metrics.combinations});
  }
 }
 assert.equal(M.checkpoint(s,'chapter-9').state.stage,8);assert.equal(M.checkpoint(s,'chapter-10').state.stage,9);assert(M.checkpoint(s,'complete').state.completed);assert.equal(M.checkpoint(s,'complete').state.metrics.combinations,52);
 write('checkpoint-replay-evidence.json',{kind:'Authored logical checkpoint replay; not fresh play or UI evidence',checkpointCount:11,replays:44,allExactRoutePrefixes:true,allRetainedActionArraysUnchanged:true,results:rows});
});
test('completion label has a completed state, not a next desk; obsolete aliases absent',()=>{
 assert.deepEqual(s.checkpoints.map(c=>c.id),Array.from({length:10},(_,i)=>'chapter-'+(i+1)).concat(['complete']));
 const last=s.checkpoints.at(-1);assert.equal(last.label,'Complete extended journey');assert.equal(M.checkpoint(s,last.id).state.completed,true);
 for(const alias of ['later-marburg-entry','later-trent-entry','later-complete'])assert.throws(()=>M.checkpoint(s,alias));
});
