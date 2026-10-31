import test from 'node:test';
import assert from 'node:assert/strict';
import {start,combine,preview,compatible,inspect,type World} from '../experiments/ideas-history-estuary-binary.ts';
import {endpoints} from '../experiments/logical-ideas-history-estuary.ts';
const act=(w:World,a:string,b:string)=>combine(w,{left:a,right:b});
const newest=(w:World,kind:string)=>w.gestures.at(-1)!.results.find(id=>w.pieces[id]!.kind===kind)!;

test('independent binary route reaches six actual predicates without configuration fields',()=>{
 let w=start(); const go=(a:string,b:string)=>{w=act(w,a,b);return w;};
 go('person:Mara','watchhouse');const sweep=newest(w,'episode');
 go('person:Mara','tidepool');const tide=newest(w,'episode');
 go(tide,'whole-tide-loom');const touch=newest(w,'score');go(touch,'person:Ilen');
 go('person:Mara','two-roads');const relative=newest(w,'person');
 go('person:Mara','mirror-quay');const local=newest(w,'episode');
 go(relative,'pilgrim-inlet');const journey=newest(w,'episode');
 go(local,journey);assert.equal(w.gestures.at(-1)!.commands.length,3);
 go(sweep,'beacon-canon');const canon=newest(w,'score');go(canon,'beacon-pair');
 go(local,'person:House');assert.equal(w.gestures.at(-1)!.commands.length,2);
 go(canon,'mailbox:Local');const letterLocal=newest(w,'invitation');
 go(canon,'mailbox:Far');const letterFar=newest(w,'invitation');
 go('person:House','school:Local');
 go('person:House','storm-archive');const later=newest(w,'episode');
 go(later,'person:Mara');go(letterLocal,letterFar);go('person:Distant','score:baseline');
 assert.ok(Object.values(endpoints(w.engine)).every(Boolean));
 assert.equal(w.gestures.length,18);assert.equal(w.engine.selections,22);
 assert.equal(w.gestures.flatMap(g=>g.automatic).length,2);
 assert.ok(w.gestures.every(g=>Object.keys(g.input).sort().join(',')==='left,right'));
});

test('preview and compatible enumeration are detached and exactly predict accepted ledger',()=>{
 let w=act(start(),'person:Mara','tidepool');const e=newest(w,'episode');const before=JSON.stringify(w);
 const g={left:e,right:'whole-tide-loom'};const p=preview(w,g);assert.ok(p.legal);if(!p.legal)return;
 assert.deepEqual(p.consequence,combine(w,g).gestures.at(-1));
 const list=compatible(w,e);assert.ok(list.some(x=>x.other==='whole-tide-loom'));assert.equal(JSON.stringify(w),before);
 p.consequence.results.push('corrupt');assert.equal(JSON.stringify(w),before);
});

test('rejected combinations are atomic and do not count or deliver',()=>{
 let w=act(start(),'person:Mara','watchhouse');const e=newest(w,'episode');w=act(w,e,'beacon-canon');const sc=newest(w,'score');w=act(w,sc,'mailbox:Local');const before=JSON.stringify(w);
 assert.throws(()=>act(w,'person:House','school:Local'));assert.equal(JSON.stringify(w),before);
 assert.throws(()=>combine(w,{left:'person:Mara',right:'watchhouse',method:'reverse'} as never));assert.equal(JSON.stringify(w),before);
 assert.equal(preview(w,{left:'missing',right:'watchhouse'}).legal,false);
});

test('personal remote instruction queues without adoption; later activity delivers then replay enacts',()=>{
 let w=act(start(),'person:Mara','watchhouse');const e=newest(w,'episode'),sc=`score:${w.engine.episodes[w.pieces[e]!.ref!]!.score}`;
 const history=w.engine.actors.Distant!.history.length,epoch=w.engine.epoch;
 w=act(w,sc,'person:Distant');assert.equal(w.engine.epoch,epoch);assert.equal(w.engine.actors.Distant!.history.length,history);assert.ok(!w.engine.actors.Distant!.scores.includes(w.pieces[sc]!.ref!));
 const before=JSON.stringify(w);const p=preview(w,{left:'person:Mara',right:'watchhouse'});assert.ok(p.legal);assert.equal(JSON.stringify(w),before);
 w=act(w,'person:Mara','watchhouse');assert.ok(w.engine.actors.Distant!.scores.includes(w.pieces[sc]!.ref!));
 w=act(w,sc,'person:Distant');assert.equal(w.engine.actors.Distant!.history.length,history+1);
});

test('a custom duo binds actual people once and does not manufacture engine selections',()=>{
 let w=act(start(),'person:Sori','person:Ilen');const duo=newest(w,'duo');assert.equal(w.engine.selections,0);assert.equal(w.gestures.length,1);assert.equal(w.pieces[duo]!.angle,'Sori');assert.equal(w.pieces[duo]!.pressure,'Ilen');
 const reverse=act(start(),'person:Ilen','person:Sori');assert.deepEqual(w.pieces[duo],reverse.pieces[duo]);
 assert.throws(()=>act(start(),'person:House','person:Distant'));
});

test('episode teaching immediately replays actual source without invented ancestry',()=>{
 let w=act(start(),'person:Mara','mirror-quay');const e=newest(w,'episode');const source=w.pieces[e]!.ref!;
 w=act(w,e,'person:House');const out=w.engine.episodes[w.pieces[newest(w,'episode')]!.ref!]!;
 assert.ok(out.sourceEpisodes.includes(source));assert.equal(out.actor,'House');assert.ok(w.engine.actors.House!.methods.includes('reverse'));assert.equal(w.gestures.at(-1)!.commands.length,2);
 const read=inspect(w,e);read.episode!.sourceEpisodes.push('fake');assert.ok(!w.engine.episodes[source]!.sourceEpisodes.includes('fake'));
});

test('known concepts and places remain reusable, no depletion or stock',()=>{
 let w=start();const original=Object.keys(w.pieces);w=act(w,'person:Mara','watchhouse');w=act(w,'person:Mara','watchhouse');assert.ok(original.every(id=>w.pieces[id]));assert.equal(w.engine.actors.Mara!.history.length,2);
});

test('developer-only preview exposes future named results and actual output trajectories before commitment',()=>{
 const w=act(start(),'person:Mara','tidepool');const e=newest(w,'episode');const g={left:e,right:'whole-tide-loom'};const p=preview(w,g);assert.ok(p.legal);if(!p.legal)return;
 const next=combine(w,g);assert.deepEqual(p.resultPieces,p.consequence.results.map(id=>inspect(next,id)));assert.ok(p.resultPieces.some(x=>x.score?.channels.includes('pressure')));
 const run=preview(start(),{left:'person:Mara',right:'watchhouse'});assert.ok(run.legal);if(!run.legal)return;
 assert.equal(run.newEpisodes.length,1);assert.ok(run.newEpisodes[0]!.outputs.angle);assert.ok(inspect(start(),'watchhouse').process);
});


test('normal discovery exposes existing partner names only and preserves state',()=>{
 const w=act(start(),'person:Mara','tidepool'),e=newest(w,'episode'),before=JSON.stringify(w);
 const hints=compatible(w,e);assert.ok(hints.length>0);
 assert.deepEqual(hints,Object.keys(w.pieces).filter(id=>id!==e&&preview(w,{left:e,right:id}).legal).map(id=>({other:id,name:w.pieces[id]!.name})));
 for(const h of hints){assert.deepEqual(Object.keys(h).sort(),['name','other']);assert.equal(h.name,w.pieces[h.other]!.name);}
 hints[0]!.name='changed';assert.equal(JSON.stringify(w),before);assert.throws(()=>compatible(w,'unknown'));
});
