/** Read-only original inputs; outputs only this review's ledger/summary.
 * Run at repository root: node results/mars-workshop-play-review/verify.mjs
 * Requires Node >=22.18. No replay commands are sent to the append-only CLI.
 */
import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
import {createMarsWorkshop, stepMarsWorkshop, selectMarsWorkshop, observeMarsWorkshop,
  inspectMarsWorkshop, catalogueMarsWorkshop, partnersMarsWorkshop, marsWorkshopGoals,
  marsWorkshopWorld, previewMarsWorkshop} from '../../experiments/logical-mars-workshop.ts';
import {WORKSHOP_PUBLIC_INTERFACE, verifyWorkshopCapture} from '../../experiments/mars-workshop-play.ts';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const out=resolve(root,'results/mars-workshop-play-review');
const sourceCommit='fa5e1aadad08abeacbbdc02e64733c0ea9f6a8d2';
const capturePath='results/mars-workshop-players/fun-workshop-v1-full-pilot-1.jsonl';
const promptPath='results/mars-workshop-prompts/fun-workshop-v1-full-pilot-1.json';
const freezePath='results/mars-workshop-preplay/pilot-freeze.json';
const bytes=p=>readFileSync(resolve(root,p));
const sha=b=>createHash('sha256').update(b).digest('hex');
const digest=x=>sha(JSON.stringify(x));
const json=p=>JSON.parse(bytes(p));
const capture=bytes(capturePath), captureSha=sha(capture);
assert.equal(captureSha,'cba06d1df14297244aae36c255bd5b116ffc77a9a67e9aa291f8aaf3e3de5d96');
assert.equal(capture.at(-1),10,'Complete final JSONL record');
const events=capture.toString().trimEnd().split('\n').map(JSON.parse);
assert.equal(events.length,90);
const metadata=events[0].metadata, prompt=json(promptPath), freeze=json(freezePath);
assert.deepEqual(metadata.supplied,prompt);
assert.equal(sha(bytes(promptPath)),'25c1f7e4f972cf8865de2ae0b60c82a04867be0aab089349c5b7d57e19bd8894');
const freezeChecks=Object.entries(freeze.sourceHashes).map(([path,expected])=>{
  const actual=sha(bytes(path));assert.equal(actual,expected,`Frozen file ${path}`);return {path,sha256:actual};
});
const publication=json('results/mars-workshop-play-review/publication-evidence.json');
assert.equal(publication.commit,sourceCommit);assert.equal(publication.tree,'537f0a7480640203865b568e32969f2567651c33');
assert.equal(publication.remoteTreeTruncated,false);assert.equal(publication.entries.length,16);
assert(Date.parse(publication.commitDate)<Date.parse(events[0].at));
for(const entry of publication.entries){const body=bytes(entry.path);const gitBlob=createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${body.length}\0`),body])).digest('hex');assert.equal(gitBlob,entry.sha,`Published blob ${entry.path}`);assert.equal(body.length,entry.size);}
const names={engine:'experiments/logical-mars-workshop.ts',content:'experiments/mars-workshop-content.ts',types:'experiments/mars-workshop-types.ts',adapter:'experiments/mars-workshop-play.ts',evaluationProtocol:'docs/long-play-evaluation-protocol.md',campaignProposal:'docs/full-length-campaign-proposal.md'};
for(const [name,path] of Object.entries(names))assert.equal(metadata.sourceHashes[name],sha(bytes(path)));
assert.equal(metadata.actor,'player');assert.deepEqual(metadata.setup.options,{catalogue:'ordinary'});
assert.equal(metadata.supplied.participant.id,'/root/play_workshop_full_diagnostic');
assert(Date.parse(freeze.at)<Date.parse(events[0].at));
let state=createMarsWorkshop(metadata.setup.options),finished=false,n=0,prevTime=0;
assert.equal(digest(state),metadata.setup.initialStateHash);
assert.equal(state.version,metadata.engineVersion);
assert.equal(state.map,metadata.setup.initialMap);
assert.deepEqual(state.boards.map(b=>b.id),metadata.setup.offeredMaps);
const initial=structuredClone(state),states=[],ledger=[],milestones=[],goalChanges=[],reports=[],copies=[],newDesigns=[];
const counts={gameAttempts:0,acceptedCombines:0,acceptedPlayerCombines:0,acceptedOperatorCombines:0,rejectedGameAttempts:0,queries:0,navigation:0,undoCommands:0,successfulUndos:0,reporting:0,administrative:0,invalidCommands:0,automaticBeats:0};
const subtypes={}, perMap={};
const allGoals=s=>s.boards.flatMap(b=>marsWorkshopGoals(s,b.id));
const conciseGoals=s=>allGoals(s).map(g=>({id:`${g.map}/${g.id}`,achieved:g.achieved,current:g.current,firstIntervention:g.firstIntervention}));
function semantic(a,s){
 const op=a.context?.operation;
 if(op==='observe'||op==='transmit'||op==='sample'||op==='span'||op==='connect')return op;
 if(['aim','fold','open','close'].includes(op))return op;
 if(a.a.startsWith('place:')||a.b.startsWith('place:'))return [a.a,a.b].some(x=>x.startsWith('o:'))?'travel':'design-placement';
 if(s.known.includes(a.a)&&s.known.includes(a.b))return 'synthesis';
 return 'actual-attachment';
}
for(const e of events){
 assert.equal(e.seq,ledger.length); const {eventHash,...unsigned}=e;
 assert.equal(eventHash,digest(unsigned),`eventHash ${e.seq}`);
 assert.equal(e.previousEventHash,e.seq?events[e.seq-1].eventHash:null);
 assert.equal(e.beforeHash,e.seq?digest(state):null);
 assert.equal(e.actor,'player');assert(e.arguments.every(a=>!a.startsWith('--actor=')));
 const time=Date.parse(e.at);assert(Number.isFinite(time)&&time>=prevTime);prevTime=time;
 const before=state,beforeGoals=conciseGoals(before),beforeN=n;let output,kind,accepted,action,category=null,subtype=null;
 if(e.command==='init'){
   assert.equal(e.seq,0);assert.deepEqual(e.arguments.slice(0,1),['ordinary']);
   assert.deepEqual(JSON.parse(e.arguments[1]),prompt);
   output={observation:observeMarsWorkshop(state),interface:WORKSHOP_PUBLIC_INTERFACE};kind='init';counts.administrative++;
 }else if(e.command==='combine'){
   assert.equal(finished,false);action=JSON.parse(e.arguments[0]);subtype=semantic(action,before);
   state=stepMarsWorkshop(before,action);assert.equal(state.accepted,true);accepted=true;kind='gameplay';n++;
   output={accepted:state.accepted,response:state.response,observation:observeMarsWorkshop(state)};
   const changed=Object.keys(state.ledger).filter(k=>state.ledger[k]!==before.ledger[k]);assert.equal(changed.length,1);category=changed[0];assert.equal(state.ledger[category]-before.ledger[category],1);
   assert.equal(state.interventions-before.interventions,1);
   counts.gameAttempts++;counts.acceptedCombines++;counts.acceptedPlayerCombines++;
   subtypes[subtype]=(subtypes[subtype]??0)+1;perMap[state.map]=(perMap[state.map]??0)+1;
   if(subtype==='design-placement'){
      const created=state.boards.find(b=>b.id===state.map).objects.filter(o=>!before.boards.find(b=>b.id===state.map).objects.some(p=>p.id===o.id));
      assert.equal(created.length,1);assert.equal(created[0].records.length,0);assert.equal(created[0].samples.length,0);assert.equal(created[0].history.spanned.length,0);
      copies.push({seq:e.seq,intervention:n,map:state.map,design:created[0].design,object:created[0].id,place:created[0].place,emptyRecords:true,emptySamples:true});
   }
   for(const design of state.designs.filter(d=>!before.designs.some(x=>x.id===d.id)))newDesigns.push({seq:e.seq,intervention:n,map:state.map,design:design.id,rootDigest:digest(design.root)});
 }else if(e.command==='select'){
   assert.equal(finished,false);state=selectMarsWorkshop(before,e.arguments[0]);output=observeMarsWorkshop(state);kind='navigation';counts.navigation++;
 }else if(e.command==='view'||e.command==='inspect'||e.command==='catalogue'||e.command==='partners'){
   output=e.command==='view'?observeMarsWorkshop(state):e.command==='catalogue'?catalogueMarsWorkshop(state):e.command==='partners'?partnersMarsWorkshop(state,e.arguments[0]):e.arguments[0]==='cli'?WORKSHOP_PUBLIC_INTERFACE:inspectMarsWorkshop(state,e.arguments[0]);
   kind='query';counts.queries++;
 }else if(e.command==='checkpoint'||e.command==='report'){
   const report=JSON.parse(e.arguments[0]);reports.push({seq:e.seq,at:e.at,intervention:n,distinctGoals:beforeGoals.filter(g=>g.achieved).length,...report});output={recorded:true};kind='reporting';counts.reporting++;
 }else if(e.command==='finish'){
   assert.equal(e.arguments.length,0);finished=true;output={finished:true,outcome:state.status==='complete'?'completed':'early-stop',report:null,observation:observeMarsWorkshop(state)};kind='finish';counts.administrative++;
 }else throw Error(`Unexpected unreviewed command ${e.seq}: ${e.command}`);
 assert.equal(e.kind,kind);assert.equal(e.accepted,accepted);assert.equal(e.undoneEventSeq,undefined);
 assert.equal(e.afterHash,digest(state),`afterHash ${e.seq}`);assert.equal(e.finished,finished);
 assert.equal(e.delivered,JSON.stringify(output,null,2)+'\n',`exact delivered bytes ${e.seq}`);
 const goals=conciseGoals(state),newlyAchieved=goals.filter(g=>g.achieved&&!beforeGoals.find(p=>p.id===g.id).achieved);
 for(const g of newlyAchieved)milestones.push({seq:e.seq,intervention:n,at:e.at,...g});
 const changed=goals.filter(g=>g.current!==beforeGoals.find(p=>p.id===g.id).current);
 for(const g of changed)goalChanges.push({seq:e.seq,intervention:n,id:g.id,from:beforeGoals.find(p=>p.id===g.id).current,to:g.current,achieved:g.achieved});
 ledger.push({seq:e.seq,at:e.at,map:state.map,command:e.command,kind,actor:e.actor,intervention:n,category,subtype,
   ...(action?{action}:e.command==='init'?{}:{arguments:e.arguments}),response:state!==before||e.command==='init'?state.response:[],newGoals:newlyAchieved.map(g=>g.id),
   currentGoals:goals.filter(g=>g.current).length,historicalGoals:goals.filter(g=>g.achieved).length,
   selectedIntervention:n>beforeN,correctionContext:[41,43].includes(e.seq)?'alcove actual protection':[60,61,62,63].includes(e.seq)?'post-span low-route correction':null,
   beforeHash:e.beforeHash,afterHash:e.afterHash,deliveredBytes:Buffer.byteLength(e.delivered)});
 states.push(state);
}
const builtin=verifyWorkshopCapture(events),{state:builtinState,...builtinPublic}=builtin;
assert.deepEqual(state,builtinState);assert.deepEqual(counts,builtin.counts);
assert.deepEqual(builtinPublic,json('results/mars-workshop-players/fun-workshop-v1-full-pilot-1.verify.json'));
assert.equal(n,65);assert.equal(state.status,'complete');assert(finished);assert(allGoals(state).every(g=>g.current&&g.achieved));
assert.deepEqual(state.ledger,{synthesis:8,contextual:32,reconfiguration:5,travel:8,observation:12});
assert.deepEqual(reports.map(r=>[r.seq,r.intervention,r.distinctGoals]),[[10,6,1],[44,31,6],[88,65,12]]);
const checkpointQuestion='What are you trying to do now? Since the last check, what, if anything, was worth doing, and what felt routine or unnecessary?';
assert(reports.slice(0,2).every(r=>r.question===checkpointQuestion));
assert.equal(reports[2].question,'How was the experience as a whole? What would you keep, shorten, remove or change, if anything? What led you to stop here?');
assert.equal(milestones[0].seq,9);assert.equal(milestones[5].seq,43);assert.equal(milestones.at(-1).seq,87);
const board=(s,id)=>s.boards.find(b=>b.id===id),object=(s,map,id)=>board(s,map).objects.find(o=>o.id===id);
const goal=(s,map,id)=>marsWorkshopGoals(s,map).find(g=>g.id===id);
const rowFlags=(s,map,id)=>marsWorkshopWorld(s,map).rows.map(r=>({row:r.id,...Object.fromEntries(['growing','enclosed','dustProtected','darkProtected','warm','water','waterSources','power','light'].map(k=>[k,r.objects.find(o=>o.id===id)?.[k]]))}));
// Every actual record from both viewpoints survives the real containment merge.
const camera=object(states[38],'twin','o:102'),holder=object(states[43],'twin','o:115');
assert.equal(camera.records.length,4);assert.deepEqual(holder.records,camera.records);assert(holder.members.some(m=>m.id==='o:102'));
assert(!goal(states[38],'twin','viewpoints').current);assert(!goal(states[41],'twin','viewpoints').current);assert(goal(states[43],'twin','viewpoints').current);
assert(rowFlags(states[39],'twin','o:102').every(r=>r.dustProtected===false));
assert(rowFlags(states[43],'twin','o:115').every(r=>r.dustProtected===true));
// The source requires dust-protected containment, not specifically a sealed enclosure.
const meshActions=[{type:'combine',a:'frame',b:'mesh',context:{at:'alcove'}},{type:'combine',a:'o:115',b:'o:102',context:{operation:'inside'}}];
let meshAlternative=states[38];const meshTrace=[];
for(const action of meshActions){const next=stepMarsWorkshop(meshAlternative,action);assert(next.accepted);meshTrace.push({action,beforeHash:digest(meshAlternative),afterHash:digest(next),response:next.response});meshAlternative=next;}
assert(goal(meshAlternative,'twin','viewpoints').current);assert(rowFlags(meshAlternative,'twin','o:115').every(r=>r.dustProtected&&!r.enclosed));
const archBefore=object(states[55],'arch','o:1'),archFinal=object(state,'arch','o:1');
assert.equal(archBefore.initialKey,'garden');assert(archBefore.history.places.includes('low-west')&&archBefore.history.places.includes('low-east'));
assert(!archBefore.history.afterSpanPlaces.includes('low-west'));assert(!goal(states[55],'arch','deploy-recover').current);
assert(goal(states[55],'arch','carry').current);assert(!goal(states[60],'arch','carry').current);assert(goal(states[60],'arch','carry').achieved);
assert(goal(states[62],'arch','deploy-recover').current);assert(!goal(states[62],'arch','carry').current);assert(goal(states[63],'arch','carry').current);
assert.equal(archFinal.id,object(initial,'arch','o:1').id);assert.equal(archFinal.root.id,object(initial,'arch','o:1').root.id);
// Diagnostic alternative, not original play: plan the required post-span low traversal before first delivery.
const alternativeActions=[{type:'combine',a:'o:1',b:'o:1',context:{operation:'fold'}},{type:'combine',a:'o:1',b:'place:destination',context:{via:['low-west']}},{type:'combine',a:'o:1',b:'o:1',context:{operation:'close'}}];
let alternative=states[54];const alternativeTrace=[];
for(const action of alternativeActions){const p=previewMarsWorkshop(alternative,action),next=stepMarsWorkshop(alternative,action);assert(next.accepted);assert.deepEqual(p.state,next);alternativeTrace.push({action,beforeHash:digest(alternative),afterHash:digest(next),response:next.response,goals:marsWorkshopGoals(next,'arch')});alternative=next;}
assert(marsWorkshopGoals(alternative,'arch').every(g=>g.current));
const ret=board(state,'return');
for(const [id,site] of [['o:8','original-a'],['o:16','original-b']]){
 const first=object(initial,'return',id),last=object(state,'return',id);assert.equal(first.root.id,last.root.id);assert.equal(last.place,site);assert.deepEqual(first.records,last.records);assert(rowFlags(state,'return',id).every(r=>r.dustProtected));
 assert(first.records.every(r=>object(state,'return','o:176').records.some(t=>digest(t)===digest(r))&&ret.received.some(t=>digest(t)===digest(r))));
}
const strandedInitial=object(initial,'return','o:24'),strandedFinal=object(state,'return','o:24');
assert.equal(strandedFinal.place,'dock');assert.equal(strandedFinal.root.id,strandedInitial.root.id);assert.deepEqual(strandedFinal.records,strandedInitial.records);assert(strandedInitial.records.every(r=>ret.received.some(t=>digest(t)===digest(r))));
assert.deepEqual(object(states[74],'dust','o:156').samples,['specimen-site']);assert.deepEqual(object(states[75],'dust','o:156').samples,['specimen-site']);
const initialKnown=initial.known;
const relevantDisclosure={
 alcove:{mapAndGoalEvent:26,place:JSON.parse(events[26].delivered).map.places.find(p=>p.id==='alcove'),goal:JSON.parse(events[26].delivered).goals.find(g=>g.id==='viewpoints'),generalLaw:JSON.parse(events[26].delivered).laws.find(l=>l.startsWith('Clear enclosing')),inspectionEvent:39,pre:rowFlags(states[38],'twin','o:102'),post:rowFlags(states[43],'twin','o:115'),records:holder.records,members:holder.members,correctionCombines:[41,43],inspectionQueries:[39,40,42],meshAlternative:{kind:'reviewer-only counterfactual, not original play',branchAfterSeq:38,actions:meshTrace,rows:rowFlags(meshAlternative,'twin','o:115'),goal:goal(meshAlternative,'twin','viewpoints')}},
 arch:{mapAndGoalEvent:46,goal:JSON.parse(events[46].delivered).goals.find(g=>g.id==='deploy-recover'),inspectionEvent:59,historyAtFirstDelivery:archBefore.history,historyAtFinalDelivery:archFinal.history,correctionCombines:[60,61,62,63],navigationInterlude:[56,58,64],alternative:{kind:'reviewer-only source-informed counterfactual, not player evidence or optimality proof',branchAfterSeq:54,actions:alternativeTrace,archInterventions:11,playedArchInterventions:13}},
 identities:{initial:initial.boards.flatMap(b=>b.objects.map(o=>({map:b.id,id:o.id,initialKey:o.initialKey,root:o.root.id,place:o.place,records:o.records}))),twinHolder:{id:holder.id,members:holder.members,records:holder.records},returnFinal:ret.objects.map(o=>({id:o.id,initialKey:o.initialKey,root:o.root.id,place:o.place,records:o.records})),returnReceived:ret.received,dustSample:object(state,'dust','o:156').samples},
 sourceEffects:{landingGarden:rowFlags(state,'landing','o:33'),iceGarden:rowFlags(state,'ice','o:63'),twinGarden:rowFlags(state,'twin','o:85'),dustWarmRoom:rowFlags(state,'dust','o:130'),dustGarden:rowFlags(state,'dust','o:123')}
};
const summary={reviewSchema:'mars-workshop-play-review-1',reviewDate:'2026-10-26',reviewer:'/root/review_workshop_full_pilot',sourcePublication:{commit:sourceCommit,tree:publication.tree,commitDate:publication.commitDate,all16SelectedPublishedBlobsMatch:true,evidence:'results/mars-workshop-play-review/publication-evidence.json'},
 capture:{path:capturePath,sha256:captureSha,events:events.length,headHash:events.at(-1).eventHash,initialStateHash:digest(initial),finalStateHash:digest(state),exactDeliveredReplay:true,independentReplayAndBuiltInAgree:true,parentVerifyFileMatches:true},
 freeze:{path:freezePath,at:freeze.at,all13ManifestFilesMatch:freezeChecks.length===13,checks:freezeChecks,promptPath,promptSha256:sha(bytes(promptPath)),promptExactMatch:true},
 participant:metadata.supplied.participant,exposureHistory:metadata.supplied.exposureHistory,condition:metadata.supplied.condition,runtime:metadata.runtime,
 timing:{init:events[0].at,firstGoal:events[9].at,sixthGoal:events[43].at,allGoals:events[87].at,finalReport:events[88].at,finish:events[89].at,elapsedCaptureMilliseconds:Date.parse(events[89].at)-Date.parse(events[0].at),elapsedToCampaignCompletionMilliseconds:Date.parse(events[87].at)-Date.parse(events[0].at),meaning:'capture wall-clock interval, not human play duration or active thinking time'},
 counts,engineLedger:state.ledger,subtypes,perMap,selectedGameplayInterventions:{supported:65,inclusive:65,disputed:[],explanation:'Each accepted combine changes in-world state and was player selected. In-world corrective actions retained and flagged; no operator repair, automatic row/record multiplication, navigation, query, report, or finish is counted.'},
 milestoneEvents:milestones,currentGoalChanges:goalChanges,finalGoals:conciseGoals(state),initialKnown,newDesigns,designPlacements:copies,reports,followUpQuestions:[],
 deliveredBytes:events.reduce((n,e)=>n+Buffer.byteLength(e.delivered),0),queryBreakdown:Object.fromEntries(['inspect','catalogue','partners','view','preview'].map(c=>[c,events.filter(e=>e.command===c).length])),
 relevantDisclosure,limits:['No human enjoyment, motivation or duration measurement','One diagnostic agent, not replicated qualification','Exact model identifier unavailable in capture','Freshness is supplied metadata, not a capture-enforced filesystem audit','Capture retains CLI stdout before any external filtering; exact filtered display is not recorded','Saved remote tree evidence confirms exact commit membership; no GitHub receipt time or independently signed publication timestamp is available','No all-space optimality or exhaustive mechanics result'],
 qualification:{targetRange:[180,240],meetsScale:false,replicated:false}}
writeFileSync(resolve(out,'ledger.jsonl'),ledger.map(x=>JSON.stringify(x)).join('\n')+'\n');
writeFileSync(resolve(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
writeFileSync(resolve(out,'diagnostic-alternative.json'),JSON.stringify(relevantDisclosure.arch.alternative,null,2)+'\n');
assert.equal(sha(bytes(capturePath)),captureSha,'Capture unchanged by verifier');
for(const c of freezeChecks)assert.equal(sha(bytes(c.path)),c.sha256,'Frozen file unchanged by verifier');
console.log(JSON.stringify({verified:true,events:events.length,combines:n,ledger:state.ledger,perMap,allGoalsCurrent:true,summary:'results/mars-workshop-play-review/summary.json',ledgerPath:'results/mars-workshop-play-review/ledger.jsonl'},null,2));
