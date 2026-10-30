import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),index=JSON.parse(readFileSync(new URL('packet-index.json',root)));
const results=[];const sha=x=>createHash('sha256').update(x).digest('hex');
for(const p of index.packets.filter(x=>process.argv.slice(2).includes(x.packet))){
 const sid='smoke-preparation-final-01',calls=[];
 const call=(op,args=[],expect,code=0)=>{const argv=[p.path+'/play.mjs',p.manifestSha256,sid,op,...args,...expect?['--expect',expect]:[]];const r=spawnSync(process.execPath,argv,{encoding:'utf8'});assert.equal(r.status,code,r.stderr+'\n'+r.stdout);const out=JSON.parse(r.stdout);calls.push({op,args,expect,exit:r.status,output:out});return out;};
 const start=call('start');assert.equal(start.view.stage.number,1);assert.equal(start.view.successfulCombinations,0);assert(!JSON.stringify(start).includes('"description"'));assert(!JSON.stringify(start).includes('"recipes"'));assert(!JSON.stringify(start).includes('"reading":'));
 const first=start.view.things[0].id;
 call('drop',[first,first],undefined,2);
 const rejected=call('drop',[first,first],'Source-aware smoke: self-drop must reject, not play evidence.');assert.equal(rejected.accepted,false);
 const highlighted=call('highlight',[first],'Source-aware smoke: inspect highlight surface, not play evidence.');assert(Array.isArray(highlighted.highlighted));assert(!JSON.stringify(highlighted).includes('"directions":'));
 const readable=start.view.things.find(t=>t.readable);
 if(readable){const before=readFileSync(new URL(`sessions/${p.packet}/${sid}/session.json`,root));const read=call('read',[readable.id],'Source-aware smoke: intentional reading must not mutate game progress.');assert(read.reading.text&&read.reading.attribution);assert.equal(read.progressChanged,false);assert.deepEqual(JSON.parse(before).game,JSON.parse(readFileSync(new URL(`sessions/${p.packet}/${sid}/session.json`,root))).game);}
 const scenario=JSON.parse(readFileSync(p.path+'/scenario.json'));
 const route=p.packet.startsWith('atlas')?JSON.parse(readFileSync(new URL('../atlas/revision-v4-methods-and-agreement/author-route.json',root))):scenario.checkpoints.find(c=>c.actions.length).actions;
 let last=start,advances=0;
 for(const a of route){
  if(a.type==='advance')break;
  let op,args;
  if(a.type==='combine'){op='drop';args=[a.a,a.b];}
  else if(a.type==='place'){op='place';args=[a.item,'@'+a.location];}
  else if(a.type==='move'){op='move';args=[a.item,String(a.x),String(a.y)];}
  else if(a.type==='visit'){op='visit';args=[a.area,(a.carry??[]).join(',')];}
  else throw Error('unsupported authored smoke action '+a.type);
  last=call(op,args,'Source-aware fixture smoke using authored first-stage action; NOT player reasoning or trial evidence.');assert.equal(last.accepted,true);advances+=last.automaticTransitions.length;
  if(last.view.stage.number>1)break;
 }
 assert(last.view.stage.number>1,'Expected first-stage automatic advancement');assert(advances>0);
 const undone=call('undo',[],'Source-aware smoke: undo the automatic handoff to its completed previous stage.');assert.equal(undone.accepted,true);assert.equal(undone.view.stage.number,1);
 const mission=call('mission');assert.equal(mission.view.stage.number,2,'Mission opening must mirror UI advancement after undo');
 call('note',['Source-aware preparation smoke only; exclude the entire session from source-blind metrics.']);const stopped=call('stop',['Preparation smoke completed; not a simulated player decision.']);assert.equal(stopped.stopped,true);
 call('drop',[first,first],'Source-aware smoke: stopped sessions must reject gameplay.',2);
 const sess=JSON.parse(readFileSync(new URL(`sessions/${p.packet}/${sid}/session.json`,root)));assert.equal(sess.status,'stopped');
 const receipts=readFileSync(new URL(`sessions/${p.packet}/${sid}/receipts.jsonl`,root),'utf8').trim().split('\n').map(JSON.parse);
 let prior=null;for(const r of receipts){assert.equal(r.previousReceiptSha256,prior);prior=sha(JSON.stringify(r));const bytes=readFileSync(new URL(`sessions/${p.packet}/${sid}/${r.auditFile}`,root));assert.equal(sha(bytes),r.auditSha256);const audit=JSON.parse(gunzipSync(bytes));assert(audit.verification.files['engine/model.ts']);assert(audit.rawView);for(const event of audit.engineResults){assert(event.result.game&&event.rawView&&event.action);}}
 const result={packet:p.packet,passed:true,commands:calls.length,firstStageAutoAdvanced:true,missionAfterUndo:true,expectationRequired:true,rejectionsPreserved:true,stoppingEnforced:true,fullCompressedAuditVerified:true,readTested:!!readable,scope:'source-aware preparer smoke; not source-blind trial, human evidence, or browser testing'};
 writeFileSync(new URL(`evidence/${p.packet}-smoke.json`,root),JSON.stringify({result,calls},null,2)+'\n');results.push(result);
}
writeFileSync(new URL('evidence/cue-experiment-logical-smoke-summary.json',root),JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
