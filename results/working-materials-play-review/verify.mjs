import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {createWorkingMaterials,stepWorkingMaterials,selectWorkingMaterials,workingMaterialsGoals,workingMaterialsWorld,previewWorkingMaterials} from '../../experiments/logical-working-materials.ts';
import {verifyMaterialsCapture} from '../../experiments/working-materials-play.ts';
const out='results/working-materials-play-review/',cp='results/working-materials-players/fun-materials-v2-a-1.jsonl',fp='results/working-materials-preplay/pilot-freeze.json',pp='results/working-materials-prompts/fun-materials-v2-a-1.json';
const bytes=p=>readFileSync(p),sha=b=>createHash('sha256').update(b).digest('hex'),hash=o=>sha(JSON.stringify(o)),json=p=>JSON.parse(bytes(p)),write=(p,x)=>writeFileSync(out+p,JSON.stringify(x,null,2)+'\n');
const capture=bytes(cp), captureHash=sha(capture);assert.equal(capture.at(-1),10);
const es=capture.toString().trimEnd().split('\n').map(JSON.parse),meta=es[0].metadata,freeze=json(fp),prompt=json(pp),publication=json('results/working-materials-preplay/publication-confirmation.json');
assert.deepEqual(meta.supplied,prompt);
const freezeChecks=Object.entries(freeze.sourceAndPackageHashes).map(([path,x])=>{assert.equal(sha(bytes(path)),x.sha256,path);assert.equal(bytes(path).length,x.bytes);return {path,...x};});
const pm='results/working-materials-preplay/publication-manifest.json';assert.equal(sha(bytes(pm)),publication.manifestSHA256);
for(const x of json(pm).files){assert.equal(sha(bytes(x.path)),x.sha256,x.path);assert.equal(bytes(x.path).length,x.bytes);}
assert(Date.parse(freeze.createdAt)<Date.parse(publication.recordedAt));assert(Date.parse(publication.recordedAt)<Date.parse(es[0].at));
let s=createWorkingMaterials(meta.setup.options);const initial=structuredClone(s);assert.equal(hash(s),freeze.initialStateHash);assert.equal(hash(s),meta.setup.initialStateHash);
const goals=s=>s.boards.flatMap(b=>workingMaterialsGoals(s,b.id)).map(g=>({map:g.map,id:g.id,mode:g.mode??'current',current:g.current,achieved:g.achieved,satisfied:g.satisfied,firstIntervention:g.firstIntervention}));
const counts={gameAttempts:0,acceptedCombines:0,acceptedPlayerCombines:0,acceptedOperatorCombines:0,rejectedGameAttempts:0,queries:0,navigation:0,undoCommands:0,successfulUndos:0,reporting:0,administrative:0,invalidCommands:0,automaticBeats:0};
const ledger=[],states=[],milestones=[],goalChanges=[],reports=[],perMap={},types={},copies=[],designs=[];let finished=false;
for(const e of es){
 const before=s,bg=goals(s);assert.equal(e.seq,ledger.length);const {eventHash,...unsigned}=e;assert.equal(hash(unsigned),eventHash);assert.equal(e.previousEventHash,e.seq?es[e.seq-1].eventHash:null);assert.equal(e.beforeHash,e.seq?hash(s):null);assert.equal(e.actor,'player');assert(e.arguments.every(a=>!a.startsWith('--actor=')));if(e.seq)assert(Date.parse(e.at)>=Date.parse(es[e.seq-1].at));
 let action=null,category=null;
 if(e.command==='combine'){
  counts.gameAttempts++;action=JSON.parse(e.arguments[0]);s=stepWorkingMaterials(s,action);assert.equal(e.accepted,s.accepted);assert.deepEqual(previewWorkingMaterials(before,action).state,s);
  if(s.accepted){counts.acceptedCombines++;counts.acceptedPlayerCombines++;perMap[s.map]=(perMap[s.map]??0)+1;const diff=Object.keys(s.ledger).filter(k=>s.ledger[k]!==before.ledger[k]);assert.equal(diff.length,1);category=diff[0];assert.equal(s.ledger[category]-before.ledger[category],1);types[category]=(types[category]??0)+1;assert.equal(s.interventions,before.interventions+1);
   for(const d of s.designs.filter(d=>!before.designs.some(x=>x.id===d.id)))designs.push({seq:e.seq,map:s.map,id:d.id,root:d.root});
   if(before.known.includes(action.a)&&action.b.startsWith('place:')){const o=s.boards.find(b=>b.id===s.map).objects.find(o=>!before.boards.find(b=>b.id===s.map).objects.some(x=>x.id===o.id));assert(o);assert.equal(o.records.length,0);assert.equal(o.samples.length,0);copies.push({seq:e.seq,design:action.a,object:o.id,root:o.root,map:s.map});}
  }else counts.rejectedGameAttempts++;
 }else if(e.command==='select'){counts.navigation++;s=selectWorkingMaterials(s,e.arguments[0]);}
 else if(['view','inspect','goals','campaign','catalogue','partners','preview'].includes(e.command))counts.queries++;
 else if(['checkpoint','report'].includes(e.command)){counts.reporting++;reports.push({seq:e.seq,at:e.at,interventions:s.interventions,report:JSON.parse(e.arguments[0])});}
 else if(e.command==='init')counts.administrative++;
 else if(e.command==='finish'){counts.administrative++;finished=true;}
 else throw Error('Unreviewed command '+e.command);
 assert.equal(hash(s),e.afterHash);assert.equal(e.finished,finished);if(e.evidence.state)assert.equal(hash(e.evidence.state),hash(s));
 const gs=goals(s),newGoals=gs.filter(g=>g.achieved&&!bg.find(x=>x.map===g.map&&x.id===g.id).achieved);
 for(const g of newGoals)milestones.push({seq:e.seq,interventions:s.interventions,...g});
 for(const g of gs){const old=bg.find(x=>x.map===g.map&&x.id===g.id);if(old.current!==g.current)goalChanges.push({seq:e.seq,interventions:s.interventions,map:g.map,id:g.id,from:old.current,to:g.current});}
 ledger.push({seq:e.seq,at:e.at,actor:e.actor,command:e.command,kind:e.kind,map:s.map,arguments:e.arguments,action,accepted:e.accepted,category,selectedGameplayInterventions:counts.acceptedCombines,response:s!==before?s.response:[],newGoals,current:gs.filter(g=>g.current).length,achieved:gs.filter(g=>g.achieved).length,satisfied:gs.filter(g=>g.satisfied).length,beforeHash:e.beforeHash,afterHash:e.afterHash,eventHash:e.eventHash,deliveredBytes:Buffer.byteLength(e.delivered)});states.push(s);
}
const builtin=verifyMaterialsCapture(es);assert.deepEqual(builtin.state,s);assert.deepEqual(builtin.counts,counts);assert.equal(counts.acceptedCombines,46);assert.equal(counts.rejectedGameAttempts,5);assert.equal(s.status,'playing');assert.equal(goals(s).filter(g=>g.satisfied).length,8);
const obj=(state,map,id)=>state.boards.find(b=>b.id===map).objects.find(o=>o.id===id);
const rowFlags=(state,map,id)=>workingMaterialsWorld(state,map).rows.map(r=>({row:r.id,object:r.objects.find(o=>o.id===id)}));
const causal={
 landing:{beforeAim:rowFlags(states[15],'landing','o:89'),afterWholeAim:rowFlags(states[18],'landing','o:89'),afterSolarPartAim:rowFlags(states[19],'landing','o:89'),gardenFinal:rowFlags(states[20],'landing','o:72')},
 reuse:{sourceHeater:obj(states[14],'landing','o:83'),copiedHeater:obj(states[28],'ice','o:103'),sourceGarden:obj(states[34],'ice','o:110'),copiedGarden:obj(states[39],'twin','o:131')},
 twin:{atWest:obj(states[49],'twin','o:151'),atEast:obj(states[51],'twin','o:151'),atAlcove:obj(states[52],'twin','o:151'),gardenOneSupply:rowFlags(states[45],'twin','o:131'),gardenTwoSupplies:rowFlags(states[46],'twin','o:131')},
 arch:{initial:obj(initial,'arch','o:1'),firstSpan:obj(states[60],'arch','o:1'),recovered:obj(states[64],'arch','o:1'),finalSpans:s.boards.find(b=>b.id==='arch').spans,remainingSupport:obj(states[65],'arch','o:166')}
};
assert.equal(causal.reuse.copiedHeater.design,'assembly:1');assert.equal(causal.reuse.copiedGarden.design,'assembly:4');assert.notEqual(causal.reuse.sourceHeater.root.id,causal.reuse.copiedHeater.root.id);
assert.equal(causal.twin.atWest.records.length,2);assert.equal(causal.twin.atEast.records.length,4);assert.deepEqual(causal.twin.atEast.records,causal.twin.atAlcove.records);
assert.equal(causal.arch.initial.root.id,causal.arch.recovered.root.id);assert.equal(causal.arch.recovered.place,'destination');assert(causal.arch.recovered.history.afterSpanPlaces.includes('lower-west'));assert(causal.arch.recovered.history.afterSpanPlaces.includes('lower-east'));assert(causal.arch.finalSpans.some(x=>x.object==='o:166'));
const controlChecks=[];
for(const name of ['ordinary','complete','saved']){
 const path=`results/working-materials-independent/lens-refresh-2026-10-26/campaign/${name}.json.gz`,x=JSON.parse(gunzipSync(bytes(path)));let z=createWorkingMaterials(x.options);let n=0;for(const a of x.actions){if(a.type==='select')z=selectWorkingMaterials(z,a.map);else{const next=stepWorkingMaterials(z,a);assert(next.accepted);assert.deepEqual(previewWorkingMaterials(z,a).state,next);z=next;n++;}}assert.equal(hash(z),hash(x.state));assert.equal(z.status,'complete');assert(goals(z).every(g=>g.satisfied));controlChecks.push({name,path,sha256:sha(bytes(path)),interventions:n,constructionInterventions:x.constructionInterventions,options:x.options,goalsSatisfied:30,exactReplay:true,evidence:x.evidence});
}
writeFileSync(out+'ledger.jsonl',ledger.map(x=>JSON.stringify(x)).join('\n')+'\n');write('reports.json',reports);write('causal-audit.json',causal);write('control-replay.json',controlChecks);
write('summary.json',{reviewer:'/root/evaluate_working_materials_campaign/review_a',date:'2026-10-26',capture:{path:cp,sha256:captureHash,bytes:capture.length,events:es.length,headHash:es.at(-1).eventHash,initialStateHash:hash(initial),finalStateHash:hash(s),independentStateReplay:true,builtinExactDeliveredAndEvidenceReplay:true,finished,status:s.status},freeze:{path:fp,sha256:sha(bytes(fp)),checks:freezeChecks,promptExact:true,promptSHA256:sha(bytes(pp)),publication,publicationManifestExact:true,publicationEvidenceLimit:'Parent publisher confirmation verified against local exact manifest; no independent remote connector check by this reviewer.'},participant:meta.supplied.participant,exposureHistory:meta.supplied.exposureHistory,runtime:meta.runtime,timing:{init:es[0].at,finish:es.at(-1).at,elapsedMilliseconds:Date.parse(es.at(-1).at)-Date.parse(es[0].at),meaning:'Capture wall time, not human duration'},counts,perMap,engineLedger:s.ledger,selectedGameplayInterventions:{supported:46,inclusive:46,disputed:[],excludedRejected:[6,7,8,9,16],reason:'All accepted combines independently chosen in-world construction, connections, corrections, record events or journeys. No demotion for routine or prior planning. No automatic internals, query, navigation or reporting counted.'},queryBreakdown:Object.fromEntries(['goals','catalogue','inspect','partners','preview','view','campaign'].map(c=>[c,es.filter(e=>e.command===c).length])),milestones,goalChanges,finalGoals:goals(s),designs,copies,reports,controlChecks,deliveredBytes:es.reduce((n,e)=>n+Buffer.byteLength(e.delivered),0),qualification:{target:[180,240],meetsScale:false,campaignComplete:false,chosenEarlyStop:true,technicalInterruption:false,replicated:false,gate:'Suspend B/C; pacing failure worth investigating, not proof of compulsory padding or whole-campaign shortcut.'}});
assert.equal(sha(bytes(cp)),captureHash);for(const x of freezeChecks)assert.equal(sha(bytes(x.path)),x.sha256);console.log(JSON.stringify({verified:true,counts,perMap,milestones,goalChanges,controlChecks:controlChecks.map(({name,interventions})=>({name,interventions}))},null,2));
