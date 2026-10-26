import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {createWorkingMaterials,stepWorkingMaterials,selectWorkingMaterials,workingMaterialsGoals,workingMaterialsWorld,previewWorkingMaterials} from '../../experiments/logical-working-materials.ts';
import {verifyMaterialsCapture} from '../../experiments/working-materials-play.ts';
const out='results/working-materials-early-transform-review/',cp='results/working-materials-players/fun-materials-v2-early-transform-1.jsonl',fp='results/working-materials-preplay/early-transform-freeze.json',pp='results/working-materials-prompts/fun-materials-v2-early-transform-1.json';
const bytes=p=>readFileSync(p),sha=b=>createHash('sha256').update(b).digest('hex'),hash=o=>sha(JSON.stringify(o)),json=p=>JSON.parse(bytes(p)),write=(p,x)=>writeFileSync(out+p,JSON.stringify(x,null,2)+'\n');
const capture=bytes(cp), captureHash=sha(capture);assert.equal(capture.at(-1),10);
const es=capture.toString().trimEnd().split('\n').map(JSON.parse),meta=es[0].metadata,freeze=json(fp),prompt=json(pp),publication=json('results/working-materials-preplay/early-transform-publication-confirmation.json');
assert.deepEqual(meta.supplied,prompt);
const freezeChecks=Object.entries(freeze.sourceAndPackageHashes).map(([path,x])=>{assert.equal(sha(bytes(path)),x.sha256,path);assert.equal(bytes(path).length,x.bytes);return {path,...x};});
const pm='results/working-materials-preplay/review-and-early-transform-publication-manifest.json';assert.equal(sha(bytes(pm)),publication.manifestSHA256);
for(const x of json(pm).files){assert.equal(sha(bytes(x.path)),x.sha256,x.path);assert.equal(bytes(x.path).length,x.bytes);}
assert(Date.parse(freeze.createdAt)<Date.parse(publication.recordedAt));assert(Date.parse(publication.recordedAt)<Date.parse(es[0].at));
let s=createWorkingMaterials(meta.setup.options);const initial=structuredClone(s);assert.equal(hash(s),freeze.defaultInitialStateHash);assert.equal(hash(s),meta.setup.initialStateHash);
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
const builtin=verifyMaterialsCapture(es);assert.deepEqual(builtin.state,s);assert.deepEqual(builtin.counts,counts);assert.equal(counts.acceptedCombines,39);assert.equal(counts.rejectedGameAttempts,3);assert.equal(s.status,'playing');assert.equal(goals(s).filter(g=>g.satisfied).length,9);
const obj=(state,map,id)=>state.boards.find(b=>b.id===map).objects.find(o=>o.id===id);
const rowFlags=(state,map,id)=>workingMaterialsWorld(state,map).rows.map(r=>({row:r.id,object:r.objects.find(o=>o.id===id)}));
assert.equal(hash(states[1]),freeze.selectedInitialStateHash);const assigned=g=>['optics','forms'].includes(g.map);assert(goals(s).filter(assigned).every(g=>g.satisfied));assert.equal(meta.supplied.participant.id,'/root/evaluate_working_materials_campaign/player_transform');
const {state:bs,...bv}=builtin;assert.deepEqual(bv,json('results/working-materials-preplay/early-transform-verification.json'));
const part=(o,id)=>{const walk=p=>p.id===id?p:(p.children??[]).map(x=>walk(x.part)).find(Boolean);return walk(o.root)};
const causal={optics:{initialCamera:obj(initial,'optics','o:29'),rigidClear:obj(states[11],'optics','o:82'),observation:obj(states[13],'optics','o:82'),travelled:obj(states[17],'optics','o:87'),diffuser:obj(states[20],'optics','o:92'),bareFoil:obj(states[22],'optics','o:103'),supportedFoil:obj(states[29],'optics','o:103'),beforeLinkRows:rowFlags(states[29],'optics','o:92'),afterLinkRows:rowFlags(states[30],'optics','o:92'),prematureGoals:goals(states[24]).filter(g=>g.map==='optics'),actualBoundaryGoals:goals(states[31]).filter(g=>g.map==='optics')},forms:{initialClay:obj(initial,'forms','o:33'),softTrial:obj(states[41],'forms','o:33'),fired:obj(states[43],'forms','o:33'),returned:obj(states[51],'forms','o:33'),openCopy:obj(states[52],'forms','o:127'),linedCopy:obj(states[54],'forms','o:133'),initialMaster:obj(initial,'forms','o:35'),sheet:obj(states[56],'forms','o:146'),returnedMaster:obj(states[58],'forms','o:35'),sheetCopy:obj(states[60],'forms','o:153')}};
assert.deepEqual(causal.optics.observation.records,causal.optics.travelled.records);assert(causal.optics.travelled.members.some(m=>m.id==='o:29'));
assert.equal(causal.forms.initialClay.root.id,'p:34');for(const key of ['softTrial','fired','returned'])assert(part(causal.forms[key],'p:34'));
assert.equal(causal.forms.returned.place,'collection');assert.equal(causal.forms.returnedMaster.place,'tool-rack');assert(part(causal.forms.returnedMaster,causal.forms.initialMaster.root.id));
assert(!causal.optics.prematureGoals.every(g=>g.satisfied));assert(causal.optics.actualBoundaryGoals.every(g=>g.satisfied));
// Serialized public outputs prove length/field coverage possible, not actual visual attention.
const displays=[2,3,5].map(seq=>({seq,command:es[seq].command,lines:es[seq].delivered.trimEnd().split('\n').length,bytes:Buffer.byteLength(es[seq].delivered),sha256:sha(es[seq].delivered)}));assert.equal(displays[1].lines,600);assert.equal(displays[2].lines,707);
const unusedFirstObjects=[['optics','o:95'],['forms','o:109'],['forms','o:143'],['forms','o:146']].map(([map,id])=>({map,object:obj(s,map,id)}));
const alternatives=[];
for(const [seq,action] of [[20,{type:'combine',a:'o:92',b:'o:95',context:{operation:'inside'}}],[38,{type:'combine',a:'o:33',b:'o:109'}],[56,{type:'combine',a:'o:143',b:'o:35',context:{operation:'transform',recipe:'sheet'}}]]){
 const before=states[seq-1],after=stepWorkingMaterials(before,action);assert.deepEqual(previewWorkingMaterials(before,action).state,after);alternatives.push({kind:'Reviewer-only source-exposed one-action counterfactual, not player evidence or a complete shorter route',branchBeforeSeq:seq,accepted:after.accepted,action,beforeHash:hash(before),afterHash:hash(after),response:after.response,objects:after.boards.find(b=>b.id===after.map).objects});
}
const open=part(causal.forms.openCopy,'p:129'),lined=part(causal.forms.linedCopy,'p:135');assert.deepEqual(open.form,lined.form);assert.equal(open.surface.permeability,'porous');assert.equal(lined.surface.permeability,'watertight');assert.deepEqual(part(causal.forms.softTrial,'p:34').events,part(causal.forms.fired,'p:34').events);
assert.equal(part(causal.forms.sheetCopy,'p:154').events.length,1);assert.notEqual(causal.forms.sheet.root.id,causal.forms.sheetCopy.root.id);
write('diagnostic-alternatives.json',alternatives);
const summary={reviewer:'/root/evaluate_working_materials_campaign/review_a',date:'2026-10-26',capture:{path:cp,sha256:captureHash,bytes:capture.length,events:es.length,headHash:es.at(-1).eventHash,initialStateHash:hash(initial),finalStateHash:hash(s),independentStateReplay:true,builtinExactDeliveredAndEvidenceReplay:true,parentVerificationExact:true,finished,status:s.status,adapterOutcome:JSON.parse(es.at(-1).delivered).outcome,assignedEndpointComplete:true},freeze:{path:fp,sha256:sha(bytes(fp)),checks:freezeChecks,promptExact:true,promptSHA256:sha(bytes(pp)),publication,publicationManifestExact:true,publicationEvidenceLimit:'Parent publisher confirmation verified against exact local manifest; no independent remote connector check by this reviewer.'},participant:meta.supplied.participant,exposureHistory:meta.supplied.exposureHistory,runtime:meta.runtime,timing:{init:es[0].at,finish:es.at(-1).at,elapsedMilliseconds:Date.parse(es.at(-1).at)-Date.parse(es[0].at),meaning:'Capture wall time, not human duration'},counts,perMap,engineLedger:s.ledger,selectedGameplayInterventions:{supported:39,inclusive:39,disputed:[],excludedRejected:[7,8,23],reason:'All accepted combines player-selected; redundant first design-making copies remain genuine chosen gameplay, not operator repair or exact no-op exhaustion.'},queryBreakdown:Object.fromEntries(['goals','catalogue','inspect','partners','preview','view','campaign'].map(c=>[c,es.filter(e=>e.command===c).length])),milestones,goalChanges,finalGoals:goals(s),designs,copies,reports,displays,unusedFirstObjects,deliveredBytes:es.reduce((n,e)=>n+Buffer.byteLength(e.delivered),0),qualification:{target:[180,240],meetsScale:false,fullCampaignComplete:false,assignedCollectionComplete:true,technicalInterruption:false,replicated:false,protocolDeviation:'Premature checkpoint seq24; explicit correction27; actual boundary checkpoint31. Earlier false success claim retained, not silently erased.'}};
writeFileSync(out+'ledger.jsonl',ledger.map(x=>JSON.stringify(x)).join('\n')+'\n');write('reports.json',reports);write('causal-audit.json',causal);write('summary.json',summary);
assert.equal(sha(bytes(cp)),captureHash);for(const x of freezeChecks)assert.equal(sha(bytes(x.path)),x.sha256);console.log(JSON.stringify({verified:true,counts,perMap,milestones,goalChanges,finalGoals:goals(s).filter(assigned),displays},null,2));
