import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,apply,preview,forecast,groups,solved,inspect,offers} from '../experiments/logical-ideas-history-inquiry.ts';
import type {Method,Result,State} from '../experiments/logical-ideas-history-inquiry.ts';
const methods:Method[]=[];
for(const pulse of [false,true])for(const warmth of [null,0,1] as const)methods.push({kind:'method',id:`m-${pulse}-${warmth}`,label:'enumerated method',pulse,warmth,parents:[]});
function result(ms:Method[]):Result{return {kind:'result',id:'r',label:'enumerated study',methods:ms,parents:[]};}
function step(s:State,a:string,b:string){const p=preview(s,{a,b}),out=apply(s,{a,b});assert(out.accepted);assert.deepEqual(out.state.things.at(-1),p.output);return out.state;}
test('review: every allowed single method fails even with every inspectable observable',()=>{
 for(const m of methods){assert(groups(result([m])).length<3);const f=forecast(m),full=f.map(p=>JSON.stringify(p.trials));assert(new Set(full).size<3,`richer observations unexpectedly solve ${m.id}`);}
});
test('review: exactly four unordered distinct method pairs distinguish the models',()=>{
 const winning:Method[][]=[];
 for(let i=0;i<methods.length;i++)for(let j=i+1;j<methods.length;j++)if(groups(result([methods[i],methods[j]])).length===3)winning.push([methods[i],methods[j]]);
 assert.equal(winning.length,4);
 for(const pair of winning){assert(pair.some(m=>m.pulse&&m.warmth===null));assert(pair.some(m=>m.warmth!==null));}
});
test('review: fixed pulse plus cool steady comparison solves in five selected combines',()=>{
 let s=createState();for(const [a,b] of [['lamp-test','pulse'],['i8','observe'],['lamp-test','cool'],['i10','observe'],['i9','i11']])s=step(s,a,b);
 assert(solved(s));assert.equal(s.moves,5);
});
test('review: all operations stay within the six-state method algebra; controls replace rather than accumulate',()=>{
 const starting=createState();
 for(const m of methods){const s={...starting,things:[...starting.things,m]};for(const control of ['pulse','steady','cool','warm','release']){
  const p=preview(s,{a:m.id,b:control});assert.equal(p.output.kind,'method');const q=p.output as Method;
  assert(methods.some(x=>x.pulse===q.pulse&&x.warmth===q.warmth));
  assert.equal(q.pulse,control==='pulse'?true:control==='steady'?false:m.pulse);
  assert.equal(q.warmth,control==='cool'?0:control==='warm'?1:control==='release'?null:m.warmth);
 }}
});
test('review: a pulse retains heat for exactly the documented previous-moment window',()=>{
 const m=methods.find(x=>x.pulse&&x.warmth===null)!;const f=forecast(m);assert.deepEqual(f.find(x=>x.model==='stored')!.trials[1].warmth,[0,1,1]);
 assert.deepEqual(f.find(x=>x.model==='light')!.trials[1].opening,[0,1,0]);
});
test('review: inspecting or previewing cannot create study objects or progress',()=>{
 const s=createState(),before=structuredClone(s);inspect(s,'lamp-test');inspect(s,'models');offers(s);preview(s,{a:'lamp-test',b:'pulse'});assert.deepEqual(s,before);assert(!solved(s));
});
test('review: exact predictions and groups are exposed for committed method and result',()=>{
 let s=step(createState(),'lamp-test','pulse');const m=s.things.at(-1) as Method;const view=inspect(s,m.id) as {forecasts:ReturnType<typeof forecast>};assert.deepEqual(view.forecasts,forecast(m));
 s=step(s,m.id,'observe');const r=s.things.at(-1) as Result;const rv=inspect(s,r.id) as {groups:ReturnType<typeof groups>;forecasts:{predictions:ReturnType<typeof forecast>}[]};assert.deepEqual(rv.groups,groups(r));assert.deepEqual(rv.forecasts[0].predictions,forecast(m));
});
test('review: parent methods and captured results survive all later method transformations',()=>{
 let s=step(createState(),'lamp-test','pulse');s=step(s,'i8','observe');const before=structuredClone(s.things);s=step(s,'i8','cool');assert.deepEqual(s.things.slice(0,before.length),before);
});
