import test from 'node:test';
import assert from 'node:assert/strict';
import {start,applyGesture,friendlyName,describePiece,checkpointWorld,CHECKPOINTS,isLocation,compatible} from '../src/estuary-play-model.ts';
import {endpoints} from '../experiments/ideas-history-estuary-v2-goals.ts';
import {replay} from '../experiments/ideas-history-estuary-binary.ts';
test('UI gesture preserves source, records actual pieces, and explains people and experiences',()=>{
 const old=start(),saved=JSON.stringify(old);const r=applyGesture(old,'person:Mara','watchhouse');
 assert.equal(JSON.stringify(old),saved);assert.equal(r.world.gestures.length,1);assert.equal(r.created.length,2);
 assert.match(r.feedback.join(' '),/Mara lived Sweep/);assert.equal(r.world.pieces['person:Mara']!.kind,'person');
 assert.match(friendlyName(r.world,r.created.find(id=>id.startsWith('episode:'))!),/Mara’s Sweep/);
 assert.match(describePiece(r.world,'person:Mara'),/1 lived memories/);
});
test('friendly labels and descriptions contain no raw generated IDs or JSON dumps across full route',()=>{
 const w=checkpointWorld('complete');for(const p of Object.values(w.pieces)){
  const text=friendlyName(w,p.id)+' '+describePiece(w,p.id);assert.doesNotMatch(text,/episode-\d|run-score-\d|gesture-\d|\{"/);
 }
});
test('all checkpoints are exact real replays and complete route satisfies unchanged v2 contracts',()=>{
 for(const c of CHECKPOINTS){const w=checkpointWorld(c.key);assert.equal(w.gestures.length,c.count);assert.deepEqual(replay(w),w);}
 assert.ok(Object.values(endpoints(checkpointWorld('complete').engine)).every(Boolean));
 assert.throws(()=>checkpointWorld('fake'));
});
test('only actual places, schools and mailboxes are locations; hints expose partners not outputs',()=>{
 const w=start();for(const p of Object.values(w.pieces))assert.equal(isLocation(p),['site','school','mailbox'].includes(p.kind));
 const hints=compatible(w,'person:Mara');assert.ok(hints.some(p=>p.other==='watchhouse'));assert.deepEqual(Object.keys(hints[0]!).sort(),['name','other']);
});
test('invalid combinations are transactional and school delivery feedback names actual recipients',()=>{
 const w=start();assert.throws(()=>applyGesture(w,'watchhouse','tidepool'));assert.equal(w.gestures.length,0);
 const h=checkpointWorld('handover');const result=applyGesture(h,'person:House','storm-archive');
 assert.match(result.feedback.join(' '),/Delivery reached House/);assert.match(result.feedback.join(' '),/Delivery reached Distant/);
});
