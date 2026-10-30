import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {createState,preview,apply,offers,RECIPES,goals,solved} from '../../experiments/logical-ideas-history-futures.ts';
const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
const base='results/ideas-history-futures-pilot-review/';
const manifest=JSON.parse(readFileSync('results/ideas-history-futures-freeze/manifest.json','utf8'));
const files=manifest.files.map((f:any)=>{const current=hash(f.path),snapshot=hash('results/ideas-history-futures-freeze/snapshot/'+f.path);assert.equal(current,f.sha256);assert.equal(snapshot,f.sha256);return {path:f.path,current,snapshot,match:true};});
const capture=JSON.parse(readFileSync('results/ideas-history-futures-players/futures-pilot-a.json','utf8'));
const assignment=JSON.parse(readFileSync('results/ideas-history-futures-players/futures-pilot-a-assignment.json','utf8'));
assert.equal(hash('results/ideas-history-futures-freeze/manifest.json'),assignment.manifestSha256);
assert.equal(assignment.prompt,readFileSync('results/ideas-history-futures-freeze/public-assignment.txt','utf8').replace('init SESSION','init futures-pilot-a'));
const transitions=[];
for(const [index,e] of capture.events.entries())if(e.cmd==='combine'){
 const before=structuredClone(e.before),a=JSON.parse(e.argument),p=preview(before,a);assert.deepEqual(before,e.before);assert.deepEqual(p.state,e.after);assert.deepEqual(apply(before,a),p);
 assert(e.before.things.every((t:any)=>e.after.things.some((u:any)=>JSON.stringify(u)===JSON.stringify(t))));
 const w=structuredClone(e.before.world),v=structuredClone(e.after.world);w.events=[];v.events=[];
 transitions.push({index,action:a,created:p.created?.id??null,actorWorldChanged:JSON.stringify(w)!==JSON.stringify(v),responses:p.responses,goals:goals(p.state)});
}
const e4=capture.events[4];assert.equal(e4.before.world.actors.lio.task,'at home');assert.equal(e4.after.world.actors.lio.task,'joined the expedition');assert.deepEqual(e4.after.world.expedition,{members:['lio'],consent:'individual'});assert.equal(e4.after.world.authorities.garden,null);assert.equal(e4.after.world.identity,'shared');for(const id of ['mara','lio'])assert.equal(e4.after.world.actors[id].survey,'individual refusal');
const e6=capture.events[6];for(const id of ['mara','lio'])assert.deepEqual(e6.after.world.actors[id].memories,['distant-soil experience','irrigation experience','shared childhood']);assert.equal(e6.before.world.gardenRevision,'waiting for shared knowledge');assert.equal(e6.after.world.gardenRevision,'accepted');assert.equal(e6.after.world.keeper,'mara');assert.deepEqual(e6.before.world.expedition,e6.after.world.expedition);assert.deepEqual(e6.after.things.find((t:any)=>t.id==='garden-promise'),capture.events[0].after.things.find((t:any)=>t.id==='garden-promise'));
// Reviewer-only exhaustive traversal, not a player continuation. No external artifacts modified.
let seed=createState();function step(s:any,a:string,b:string){const p=apply(s,{a,b});assert(p.accepted);return p.state;}
for(const r of RECIPES)if(!seed.things.some(t=>t.id===r.id))seed=step(seed,r.a,r.b);
for(const mode of ['individual','joint']){seed=step(seed,'compact',mode+'-authority');for(const scope of ['garden','personal','all'])seed=step(seed,'template-'+mode,scope+'-scope');}
for(const scope of ['garden','personal','all'])seed=step(seed,'release-mandate',scope+'-scope');seed=step(seed,'promise-constellations','garden-promise');
const key=(s:any)=>JSON.stringify([s.world.identity,s.world.authorities,s.world.keeper,s.world.memoriesShared,s.world.merged]);
const queue=[seed],seen=new Set([key(seed)]);let accepted=0,refused=0,maxRepair=0;
for(let i=0;i<queue.length;i++){
 const s=queue[i],w=s.world;const own=(w.authorities.personal??(w.identity==='shared'?'joint':'individual'))==='individual';const common=(w.authorities.garden??(w.identity==='shared'?'joint':'individual'))==='joint';const shared=['mara','lio'].every(id=>['irrigation experience','distant-soil experience'].every(m=>w.actors[id].memories.includes(m)));
 assert.equal(w.gate,'open');assert(['mara','ibis'].includes(w.keeper));assert.equal(w.gardenRevision,!shared?'waiting for shared knowledge':common?'accepted':'waiting for authorized voice');assert.equal(w.actors.lio.survey,own?'individual refusal':'joint acceptance');assert.equal(w.actors.lio.task,own||w.keeper==='ibis'?'joined the expedition':'at home');
 for(const o of offers(s)){const a={a:o.a,b:o.b},before=structuredClone(s),p=preview(s,a);assert.deepEqual(p,apply(s,a));assert.deepEqual(p.state.world,preview(s,{a:a.b,b:a.a}).state.world);assert.deepEqual(s,before);if(!p.accepted){refused++;continue;}accepted++;const k=key(p.state);if(!seen.has(k)){seen.add(k);queue.push(p.state);}}
 let r=s;for(const a of ['reunion','covenant-individual-personal','covenant-joint-garden'])r=apply(r,{a,b:'family'}).state;assert(solved(r));maxRepair=Math.max(maxRepair,r.moves-s.moves);
}
assert.equal(queue.length,90);assert.equal(accepted,832);assert.equal(refused,2138);assert.equal(maxRepair,3);
writeFileSync(base+'verification.json',JSON.stringify({verified:true,manifestHash:assignment.manifestSha256,files,transitions,graph:{preparationCombines:seed.moves,states:queue.length,accepted,refused,maxRepair},limits:['No preview commands were requested by the player; exact preview verified counterfactually by reviewer.','Preview and apply share implementation; explicit actor/memory/authority assertions additionally check semantics.','Follow-up assignment file timestamp follows its captured report by 2.839 seconds; not independent prospective timing proof.']},null,2)+'\n');
console.log('All frozen current/snapshot hashes, assignment prompt, captured transitions, and 90-state repair verified.');
