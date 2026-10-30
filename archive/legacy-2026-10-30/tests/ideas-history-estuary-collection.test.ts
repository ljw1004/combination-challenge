import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,step,endpoints,PROCESSES,type State,type Action} from '../experiments/logical-ideas-history-estuary.ts';
import {wholeRoute} from '../experiments/ideas-history-estuary-routes.ts';
import {trajectoriesEqual as same,affine} from '../experiments/ideas-history-estuary-signals.ts';
const advance=(s:State,actions:Action[])=>actions.reduce(step,s);
for(const mode of ['normal','complete','direct'] as const)test(`${mode} entire connected collection has six actual endpoints and honest ledger`,()=>{
 const r=wholeRoute(mode);assert(Object.values(r.projects).every(Boolean));assert.equal(r.selections,r.actions.length);assert.equal(r.automaticDeliveries,2);assert.deepEqual(advance(initial(mode==='complete'?'complete':'normal'),r.actions),r.state);
 assert.equal(r.selections,{normal:30,complete:22,direct:26}[mode]);
});
test('initial complete knowledge is not actual lives, performances or delivery',()=>{assert(Object.values(endpoints(initial('complete'))).every(x=>!x));});
test('instruction and learned invocation are different; teaching enables actual replay and live execution',()=>{
 let s=initial();s=step(s,{type:'method',id:'reverse',method:{kind:'following',mode:'bound',interface:'reversed',name:'Reverse'}});
 s=step(s,{type:'run',actor:'Mara',process:'A',interface:'reversed',method:'reverse'});const e=s.episodes['episode-1']!;
 assert.throws(()=>step(s,{type:'recall',actor:'House',score:e.score,channel:'angle'}),/not retained/);
 assert.throws(()=>step(s,{type:'follow',actor:'House',process:'D',interface:'reversed',method:'reverse'}),/not retained/);
 s=step(s,{type:'teach',teacher:'Mara',learner:'House',episode:e.id});
 s=step(s,{type:'recall',actor:'House',score:e.score,channel:'angle'});
 s=step(s,{type:'follow',actor:'House',process:'D',interface:'reversed',method:'reverse'});
 assert(same(s.episodes['episode-2']!.trajectory,PROCESSES.A));assert(same(s.episodes['episode-3']!.trajectory,PROCESSES.D));
 assert.deepEqual(s.actors.House!.history,['episode-2','episode-3']);
});
test('pressure output and angular controller command are separate exact ports',()=>{
 let s=initial('complete');s=step(s,{type:'run',actor:'Ilen',process:'C',interface:'pressure',method:'universal'});
 const e=s.episodes['episode-1']!;assert(same(e.commands!,PROCESSES.C));assert(same(e.outputs.pressure!,affine(PROCESSES.C,[1,90])));assert.equal(e.outputs.angle,undefined);
 assert.throws(()=>step(s,{type:'perform',actor:'Ilen',score:'baseline',channel:'angle'}),/port/);
});
test('queued invitation can arrive at start of same festival, after succession, never before',()=>{
 const r=wholeRoute('complete');const cutoff=r.actions.findIndex(a=>a.type==='succeed');
 let s=advance(initial('complete'),r.actions.slice(0,cutoff+1));
 assert.equal(s.messages['invite-far']!.received,undefined);assert(!s.actors.Distant!.scores.includes('canon'));
 s=step(s,{type:'festival',messages:['invite-local','invite-far']});
 assert.equal(s.messages['invite-local']!.recipient,'House');assert.equal(s.messages['invite-far']!.received,s.selections);
 const es=Object.values(s.episodes).filter(e=>e.selection===s.selections);assert.equal(es.length,2);assert(es.some(e=>e.actor==='House'));assert(es.some(e=>e.actor==='Distant'));
});
test('invalid activity is transactional: cannot deliver, tick, count or mutate input',()=>{
 const r=wholeRoute('complete');const cutoff=r.actions.findIndex(a=>a.type==='succeed');const s=advance(initial('complete'),r.actions.slice(0,cutoff+1)),before=structuredClone(s);
 assert.throws(()=>step(s,{type:'festival',messages:['invite-local','missing']}));assert.deepEqual(s,before);
 assert.throws(()=>step(s,{type:'perform',actor:'Ilen',score:'canon',channel:'angle'}));assert.deepEqual(s,before);
});
test('remote instruction cannot silently bypass transmission',()=>{
 let s=initial();s=step(s,{type:'literal',id:'new',name:'new',trajectory:PROCESSES.A,channels:['angle']});
 const queued=step(s,{type:'perform',actor:'Distant',score:'new',channel:'angle'});assert.equal(queued.epoch,s.epoch);assert.equal(Object.values(queued.messages)[0]!.target,'Distant');assert(!queued.actors.Distant!.scores.includes('new'));
 s=step(s,{type:'send',id:'letter',score:'new',role:'Far',invitation:false});
 // Performance itself may legally cause due delivery before trying to execute.
 s=step(s,{type:'perform',actor:'Distant',score:'new',channel:'angle'});assert.equal(s.messages.letter!.recipient,'Distant');
});
test('a different ID and refined knots do not make an already retained D replay novel',()=>{
 const r=wholeRoute('complete'),cut=r.actions.findIndex(a=>a.type==='teach'&&a.teacher==='House');
 let s=advance(initial('complete'),r.actions.slice(0,cut));
 const refined=structuredClone(PROCESSES.D);refined.splice(1,0,{t:[1,2],v:[45,1]});
 s=step(s,{type:'literal',id:'prior-D',name:'Public literal D',trajectory:refined,channels:['angle']});s=step(s,{type:'perform',actor:'Mara',score:'prior-D',channel:'angle'});
 s=advance(s,r.actions.slice(cut));assert.equal(s.lessons.at(-1)!.novel,false);assert.equal(endpoints(s).reciprocalSchool,false);
});
test('universal following alone does not grant absent-input D replay; successor lesson does',()=>{
 const r=wholeRoute('complete'),cut=r.actions.findIndex(a=>a.type==='teach'&&a.teacher==='House');
 let s=advance(initial('complete'),r.actions.slice(0,cut));const e=Object.values(s.episodes).at(-1)!;
 assert(s.actors.Mara!.methods.includes('universal'));assert.throws(()=>step(s,{type:'recall',actor:'Mara',score:e.score,channel:'angle'}),/not retained/);
 s=step(s,r.actions[cut]!);s=step(s,{type:'recall',actor:'Mara',score:e.score,channel:'angle'});assert(endpoints(s).reciprocalSchool);
});
test('direct literal authoring is usable but cannot invent source experience',()=>{
 let s=initial();s=step(s,{type:'literal',id:'literal',name:'A',trajectory:PROCESSES.A,channels:['angle','pressure']});s=step(s,{type:'ensemble',score:'literal',angle:'Sori',pressure:'Ilen'});
 assert.equal(endpoints(s).sharedPerformance,false);assert.equal(Object.values(s.episodes).length,2);assert(same(s.episodes['episode-1']!.trajectory,PROCESSES.A));
});
test('fork shares actual prefix without fabricating a second occurrence; reunion retains distinct lives',()=>{
 const r=wholeRoute('normal'),cut=r.actions.findIndex(a=>a.type==='reunion');let s=advance(initial(),r.actions.slice(0,cut));
 const family=s.families[0]!;assert.deepEqual(family.prefix,['episode-1','episode-2']);assert.equal(s.episodes['episode-1']!.actor,'Mara');const before=structuredClone(s.actors);
 s=step(s,r.actions[cut]!);assert.deepEqual(s.actors.Mara!.history,before.Mara!.history);assert.deepEqual(s.actors.Traveller!.history,before.Traveller!.history);assert.equal(endpoints(s).divergentLives,false);
 s=advance(s,r.actions.slice(cut+1,cut+3));assert.equal(endpoints(s).divergentLives,true);
});
test('distant baseline must actually continue, not merely remain in repertoire',()=>{
 const r=wholeRoute('complete');const s=advance(initial('complete'),r.actions.slice(0,-1));assert(s.actors.Distant!.scores.includes('baseline'));assert.equal(endpoints(s).distantLocalLives,false);assert.equal(endpoints(r.state).distantLocalLives,true);
});
test('public view is detached from retained state and public process constants',async()=>{
 const {view}=await import('../experiments/logical-ideas-history-estuary.ts');const s=initial(),v=view(s);v.actors.Mara!.methods.push('fabricated');v.processes.A[0]!.v[0]=50;assert.deepEqual(s.actors.Mara!.methods,['identity']);assert.equal(PROCESSES.A[0]!.v[0],0);
});
