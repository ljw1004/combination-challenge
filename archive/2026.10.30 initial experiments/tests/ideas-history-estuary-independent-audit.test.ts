/** Independent source-exposed mechanics audit; not player or fun evidence. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,step,endpoints,PROCESSES,type State,type Action} from '../experiments/logical-ideas-history-estuary.ts';
import {trajectoriesEqual as same} from '../experiments/ideas-history-estuary-signals.ts';
import {wholeRoute} from '../experiments/ideas-history-estuary-routes.ts';
const run=(actor:string,process:'A'|'B'|'C'|'D'|'Tide'='A'):Action=>({type:'run',actor,process,method:'identity',interface:'normal'});

test('audit: distant actor can execute its own retained baseline following practice',()=>{
 const before=initial();
 assert(before.actors.Distant!.methods.includes('identity'));
 const after=step(before,run('Distant','B'));
 assert.equal(after.actors.Distant!.history.length,1);
 assert(same(Object.values(after.episodes)[0]!.trajectory,PROCESSES.B));
});

test('audit: generated run score cannot overwrite a legal literal score or corrupt retained repertoire',()=>{
 let s=step(initial(),{type:'literal',id:'run-score-2',name:'Personal D replay',trajectory:PROCESSES.D,channels:['angle']});
 s=step(s,{type:'perform',actor:'Mara',score:'run-score-2',channel:'angle'});
 const oldEpisode=structuredClone(s.episodes['episode-1']);
 s=step(s,run('Sori','A'));
 assert(same(s.scores['run-score-2']!.trajectory,PROCESSES.D),'Sori run silently replaced Mara retained D with A');
 assert.deepEqual(s.episodes['episode-1'],oldEpisode);
 s=step(s,{type:'recall',actor:'Mara',score:'run-score-2',channel:'angle'});
 assert(same(Object.values(s.episodes).at(-1)!.trajectory,PROCESSES.D));
});

test('audit: applying a fresh distant score sends instruction rather than silently teaching or rejecting',()=>{
 let s=step(initial(),{type:'literal',id:'new-remote',name:'Direct B',trajectory:PROCESSES.B,channels:['angle']});
 s=step(s,{type:'perform',actor:'Distant',score:'new-remote',channel:'angle'});
 assert(!s.actors.Distant!.scores.includes('new-remote'),'cannot adopt before delivery');
 assert.equal(s.actors.Distant!.history.length,0);
 assert(Object.values(s.messages).some(m=>m.score==='new-remote'&&m.received===undefined));
});

test('audit: rejected festival cannot deliver messages, count selection, or mutate input',()=>{
 let s=step(initial(),{type:'literal',id:'x',name:'X',trajectory:PROCESSES.A,channels:['angle']});
 s=step(s,{type:'send',id:'mail',score:'x',role:'Far',invitation:true});
 const before=structuredClone(s);
 assert.throws(()=>step(s,{type:'festival',messages:['mail','missing']}));
 assert.deepEqual(s,before);
 assert.equal(s.messages.mail!.received,undefined);
});

test('audit: already-retained literal D blocks successor novelty even with another score ID',()=>{
 const r=wholeRoute('complete'); let s=initial('complete');
 s=step(s,{type:'literal',id:'prior-D',name:'Already known D',trajectory:PROCESSES.D,channels:['angle']});
 s=step(s,{type:'perform',actor:'Mara',score:'prior-D',channel:'angle'});
 // Remap generated references from parallel states rather than assuming ID allocation.
 let reference=initial('complete');const ids:Record<string,string>={};
 for(const a of r.actions){
   const mapped=structuredClone(a) as any;
   for(const k of ['source','episode','episodeA','episodeB','score']) if(ids[mapped[k]])mapped[k]=ids[mapped[k]];
   const oldReference=new Set(Object.keys(reference.episodes)),oldActual=new Set(Object.keys(s.episodes));
   reference=step(reference,a);s=step(s,mapped);
   const re=Object.values(reference.episodes).filter(e=>!oldReference.has(e.id));
   const ae=Object.values(s.episodes).filter(e=>!oldActual.has(e.id));
   re.forEach((e,i)=>{ids[e.id]=ae[i]!.id;if(e.kind==='run')ids[e.score]=ae[i]!.score;});
 }
 assert.equal(endpoints(s).reciprocalSchool,false);
});

test('audit: whole routes have six causal endpoints, counts exclude automatic delivery',()=>{
 for(const [mode,count] of [['normal',30],['complete',22],['direct',26]] as const){
 const r=wholeRoute(mode);
 assert(Object.values(r.projects).every(Boolean));assert.equal(r.selections,count);
 assert.equal(r.actions.length,count);assert.equal(r.state.ledger.length,count);
 assert.equal(r.automaticDeliveries,2);
 }
});

test('audit: shipping an unrelated solo score does not count as transmitting the actual local shared performance',()=>{
 let s=initial('complete');
 for(const a of wholeRoute('complete').actions)s=step(s,a.type==='send'?{...a,score:'run-score-2'}:a);
 assert.equal(endpoints(s).sharedPerformance,true);
 assert.equal(endpoints(s).distantLocalLives,false,'Solo Tide transmission was credited as shared Canon transmission');
});

test('audit: personal message stays personal while role invitation follows succession',()=>{
 let s=initial();s=step(s,run('House'));
 s=step(s,{type:'literal',id:'letter-score',name:'Letter',trajectory:PROCESSES.C,channels:['angle']});
 s=step(s,{type:'send',id:'person-mail',score:'letter-score',actor:'Mara',invitation:false});
 s=step(s,{type:'send',id:'role-mail',score:'letter-score',role:'Local',invitation:true});
 s=step(s,{type:'succeed',role:'Local',successor:'House'});
 assert(!s.actors.Mara!.scores.includes('letter-score'));assert(!s.actors.House!.scores.includes('letter-score'));
 s=step(s,run('Sori'));
 assert.equal(s.messages['person-mail']!.recipient,'Mara');assert.equal(s.messages['role-mail']!.recipient,'House');
 assert(s.actors.Mara!.scores.includes('letter-score'));assert(s.actors.House!.scores.includes('letter-score'));
 assert.deepEqual(s.schools.Local!.mailbox,['role-mail']);
});

test('audit: extra source fields on literal authorship cannot forge an observed sweep',()=>{
 let s=initial();s=step(s,run('Mara'));
 s=step(s,{type:'literal',id:'forged',name:'Forged',trajectory:PROCESSES.A,channels:['angle','pressure'],sources:['episode-1'],sourceEpisodes:['episode-1']} as Action);
 s=step(s,{type:'ensemble',score:'forged',angle:'Sori',pressure:'Ilen'});
 assert.deepEqual(s.scores.forged!.sources,[]);assert.equal(endpoints(s).sharedPerformance,false);
});

test('audit: direct personal transmission of an actually shared score is a valid distant alternative',()=>{
 const r=wholeRoute('complete');let s=initial('complete');
 for(const a of r.actions){if(a.type==='teach'&&a.learner==='House')break;s=step(s,a);}
 assert(endpoints(s).sharedPerformance);
 s=step(s,{type:'send',id:'personal-canon',score:'canon',actor:'Distant',invitation:false});
 s=step(s,{type:'perform',actor:'Distant',score:'canon',channel:'angle'});
 s=step(s,{type:'perform',actor:'Distant',score:'baseline',channel:'angle'});
 assert.equal(endpoints(s).distantLocalLives,true);
});

test('audit: distant continued baseline can be actual retained following, not only named baseline replay',()=>{
 const r=wholeRoute('complete');let s=initial('complete');
 for(const a of r.actions.slice(0,-1))s=step(s,a);
 s=step(s,{type:'follow',actor:'Distant',process:'B',method:'identity',interface:'normal'});
 assert(same(Object.values(s.episodes).at(-1)!.trajectory,s.scores.baseline!.trajectory));
 assert.equal(endpoints(s).distantLocalLives,true);
});
