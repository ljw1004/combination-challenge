/** Independent, read-only replay of closed Doctrine v9 q/r trials. Separate from prior evidence. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const out=import.meta.dirname, root=path.dirname(out), observed=new Map(), reports=[];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function bytes(p){const b=fs.readFileSync(p);const h=sha(b);if(observed.has(p))assert.equal(observed.get(p),h,`Changed during verification: ${p}`);observed.set(p,h);return b;}
const read=p=>JSON.parse(bytes(p));
const lines=p=>bytes(p).toString('utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const clean=x=>JSON.parse(JSON.stringify(x));
const eq=(a,b,label)=>assert.deepEqual(clean(a),clean(b),label);
function verifyHashes(folder,manifest){return Object.entries(manifest).map(([p,h])=>{assert.equal(sha(bytes(path.join(folder,p))),h,p);return p;});}
function replay(M,s,saved){let g=M.createGame(s,saved.state.width);for(const [i,e] of saved.events.entries()){const r=e.action.type==='undo'?M.undo(g):M.applyAction(s,g,e.action);assert.equal(r.accepted,e.accepted,`event ${i} acceptance`);g=r.game;}eq(g,saved,'full event replay including state/history/events');return g;}
function metrics(g,base){return Object.fromEntries(Object.entries(g.state.metrics).map(([k,v])=>[k,v-(base[k]??0)]));}
function counts(logs){return Object.fromEntries([...new Set(logs.map(e=>e.cmd))].map(k=>[k,logs.filter(e=>e.cmd===k).length]));}
function doctrineView(M,s,g){const v=M.playerView(s,g);return {scenario:v.scenario,stage:v.stage,objectives:v.objectives,completed:v.completed,things:v.things.map(t=>({id:t.id,label:t.label,gold:t.gold,components:t.components,readable:!!s.items.find(i=>i.id===t.id)?.reading})),areas:v.areas};}
function atlasView(M,s,g){const v=M.playerView(s,g);return {scenario:v.scenario,stage:{number:v.stage.number,title:v.stage.title,speaker:v.stage.speaker,motivation:v.stage.motivation},goals:v.objectives,completed:v.completed,things:v.things.map(t=>({id:t.id,label:t.label,readable:!!t.reading,location:t.location,slots:t.slots,components:t.components})),places:v.locations.map(l=>({id:'@'+l.id,label:l.label}))};}
function rejectedEntry(M,s,g,e,r){
 const label=id=>s.items.find(i=>i.id===id)?.label??s.locations.find(i=>'@'+i.id===id)?.label??id;
 const operands=e.args.map(id=>{const t=g.state.tokens.find(t=>t.id===id);return {id,label:label(id),availableHere:!!t&&t.area===g.state.currentArea,kind:t?.kind,location:t?.location,components:t?M.componentLabels(s,t):[]};});
 const kinds=operands.map(x=>x.kind??x.id);
 const matchingRecipes=s.recipes.filter(x=>(x.a===kinds[0]&&x.b===kinds[1])||(x.a===kinds[1]&&x.b===kinds[0])).map(x=>({id:x.id,a:x.a,b:x.b,out:x.out,at:x.at??null,alreadyDiscovered:g.state.discovered.includes(x.out),alreadyUsed:g.state.recipesUsed.includes(x.id),requires:x.requires??[]}));
 return {command:e.cmd,args:e.args,labels:e.args.map(label),stage:g.state.stage+1,message:e.result.message??null,modelMessage:r.message,operands,matchingRecipes,firstOperandHints:M.partners(s,g.state,e.args[0])};
}
for(const [folder,names] of [['doctrine/revision-9-derived-premises',['q','r']]]){
 const dir=path.join(root,folder),sealBytes=bytes(path.join(dir,'pilot-integrity.json')),seal=JSON.parse(sealBytes),verified=verifyHashes(dir,seal.files);
 assert.equal(process.version,seal.nodeVersion);const candidate=verified.find(p=>/^doctrine.*-candidate.json$/.test(p)),s=read(path.join(dir,candidate)),M=await import(pathToFileURL(path.join(dir,'runtime/engine/model.ts')));
 for(const suffix of names){const name='fresh_doctrine_'+suffix,p=path.join(dir,'sessions',name),meta=read(path.join(p,'session.json')),saved=read(path.join(p,'game.json')),baselineBytes=bytes(path.join(p,'authored-baseline.json')),baseline=JSON.parse(baselineBytes),logs=lines(path.join(p,'events.jsonl'));
  assert.notEqual(meta.status,'running');assert.equal(meta.nodeVersion,process.version);assert.equal(meta.candidateSha256,sha(bytes(path.join(dir,candidate))));assert.equal(meta.pilotSha256,sha(sealBytes));assert.equal(meta.baseline.stateSha256,sha(baselineBytes));eq(baseline,M.checkpoint(s,meta.baseline.checkpoint),'authored checkpoint reproduced');assert.equal(meta.baseline.events,baseline.events.length);eq(meta.baseline.metrics,baseline.state.metrics,'baseline metrics');eq(saved.events.slice(0,baseline.events.length),baseline.events,'saved event prefix is authored baseline');
  replay(M,s,saved);let g=baseline;const rejections=[],acceptedCreations=[];
  for(const [i,e] of logs.entries()){let result;const label=id=>s.items.find(x=>x.id===id)?.label??id;
   if(e.cmd==='look')result=doctrineView(M,s,g);
   else if(e.cmd==='read'){const t=g.state.tokens.find(t=>t.id===e.args[0]&&t.area===g.state.currentArea),it=t&&s.items.find(i=>i.id===t.kind);result=it?.reading?{id:it.id,label:it.label,...it.reading,sources:it.sources.map(id=>{const x=s.sources.find(x=>x.id===id);return {title:x.title,url:x.url};})}:{error:'No readable manuscript by that ID on this desk.'};}
   else if(e.cmd==='partners'){const p=M.partners(s,g.state,e.args[0]);result={for:e.args[0],partners:p.partners.map(id=>({id,label:label(id)}))};}
   else if(e.cmd==='combine'||e.cmd==='undo'){const a=e.cmd==='undo'?{type:'undo'}:{type:'combine',a:e.args[0],b:e.args[1]},r=e.cmd==='undo'?M.undo(g):M.applyAction(s,g,a);if(!r.accepted)rejections.push(rejectedEntry(M,s,g,e,r));if(r.created)acceptedCreations.push({args:e.args,recipe:r.recipe,created:r.created,label:label(r.created)});g=r.game;const transitions=[];if(r.accepted&&e.cmd==='combine')while(M.stageComplete(s,g.state)&&!g.state.completed){const adv=M.applyAction(s,g,{type:'advance'});if(!adv.accepted)break;g=adv.game;transitions.push({stage:g.state.stage+1,completed:g.state.completed});}result={accepted:r.accepted,...!r.accepted?{message:r.message}:{},...r.created?{created:{id:r.created,label:label(r.created)}}:{},transitions,view:doctrineView(M,s,g)};}
   else if(e.cmd==='stop'){result={recorded:'stopped',stage:g.state.stage+1,attempts:g.state.metrics.attempts};assert.equal(meta.reason,e.args.join(' ')||'No reason supplied');}else throw Error('Unknown doctrine command '+e.cmd);
   eq(result,e.result,`${name} log ${i} result`);assert.equal(g.state.stage+1,e.stage,`${name} log ${i} stage`);
  }
  eq(g,saved,'command log replay final game');const r={name,folder,kind:meta.kind,exactEventReplay:true,exactCommandLogReplay:true,verifiedFrozenFileCount:verified.length,manifestSha256:sha(sealBytes),baselineEvents:baseline.events.length,baselineVerified:true,freshMetrics:metrics(g,baseline.state.metrics),commands:counts(logs),rejections,acceptedCreations,startStage:baseline.state.stage+1,endStage:g.state.stage+1,endStageId:s.stages[g.state.stage].id,completed:g.state.completed,status:meta.status,reason:meta.reason};reports.push(r);console.log(JSON.stringify({name,exactReplay:true,metrics:r.freshMetrics,commands:r.commands,endStage:r.endStage,status:r.status}));
 }
}

const dir=path.join(root,'doctrine/revision-9-derived-premises'),old=read(path.join(dir,'baseline-v8-candidate.json')),s=read(path.join(dir,'doctrine-argument-desks-v9-candidate.json'));
const addedRecipes=s.recipes.filter(r=>!old.recipes.some(x=>x.id===r.id));assert.equal(addedRecipes.length,2);
const q=reports.find(r=>r.name==='fresh_doctrine_q'),r=reports.find(r=>r.name==='fresh_doctrine_r');
assert.equal(q.commands.combine,5);assert.equal(q.commands.partners,1);assert.equal(q.rejections.length,1);assert.equal(r.commands.combine,6);assert.equal(r.commands.partners??0,0);assert.equal(r.rejections.length,0);
const repairedEdgeUses=[{session:q.name,...q.acceptedCreations.find(x=>x.recipe==='embodied-from-apostolic-claim')},{session:r.name,...r.acceptedCreations.find(x=>x.recipe==='bodily-work-from-free-service')}];
assert.equal(repairedEdgeUses[0].created,'embodied-spiritual-rite');assert.equal(repairedEdgeUses[1].created,'body-not-discarded');eq(repairedEdgeUses[1].args,['body-discipline','free-service']);
for(const use of repairedEdgeUses)assert(!old.recipes.some(x=>(x.a===use.args[0]&&x.b===use.args[1])||(x.b===use.args[0]&&x.a===use.args[1])),'Repaired unordered pair absent in frozen v8');
eq(q.rejections[0].args,['ritual-leaf','acts-hands']);assert.equal(q.rejections[0].matchingRecipes.length,0);assert(q.rejections[0].operands.every(o=>o.availableHere));
for(const[p,h]of observed)assert.equal(sha(fs.readFileSync(p)),h,`Original changed during verification: ${p}`);
const results={verifiedAt:new Date().toISOString(),nodeVersion:process.version,method:'Independent full-event reconstruction and separate command-log reconstruction from independently regenerated authored checkpoints; full saved state/history/events and every logged result/view checked.',reports,addedRecipes,repairedEdgeUses,rejectedPremises:q.rejections[0].args.map(id=>s.items.find(i=>i.id===id)),missingConcreteRubric:s.items.find(i=>i.id==='gospel-and-hands'),limits:['Two source-blind-requested simulated checkpoint trials, not human or browser evidence.','65 authored baseline events excluded; no fresh full-campaign claim.','Local manifests and session hashes verify present consistency, not tamper-proof chronology, independent authorship or proof of source blindness.','Read counts and completion do not establish comprehension or fun.','Q needed one hint after an earlier different pair; its repaired derived-premise edge was not the pair displayed by that hint. R used the repaired edge without hints, in reverse operand order.','The two-scriptural-premise rejection does not itself justify adding an edge claiming a fact about the Lyon ritual without its concrete rubric.'],originalInputs:Object.fromEntries([...observed].map(([p,h])=>[path.relative(root,p),h])),allObservedOriginalBytesUnchanged:true};
fs.writeFileSync(path.join(out,'v9-doctrine-results.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({repairedEdgeUses,originalInputCount:observed.size,allObservedOriginalBytesUnchanged:true},null,2));
