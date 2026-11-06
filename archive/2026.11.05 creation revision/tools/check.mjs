import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync,readdirSync,rmSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {workshop} from '../../../tests/fixtures/adventure.ts';
import {pacedArgs,startPaced} from './playtest.mjs';
import {validateSchema} from './protocol.mjs';
import {loadResume,resumeCampaign} from './resume.mjs';
import {failureMessage} from './transport.mjs';
import {PacedPool} from './pacing.mjs';
const rateFailure=failureMessage({stderr:'WARN: Unknown model metadata',stdout:'{"type":"turn.failed","error":{"message":"429 Too Many Requests"}}',code:1});
assert.match(rateFailure,/429/);
const ratePool=new PacedPool({limit:4});
if(/429|rate.limit|too many requests/i.test(rateFailure))ratePool.rateLimited();
assert.equal(ratePool.limit,3);
assert(ratePool.cooldownUntil>Date.now());
const root=resolve(import.meta.dirname,'../../../runs/creation-pipeline-check/fixture-'+Date.now());mkdirSync(root,{recursive:true});
const story=join(root,'story.md');writeFileSync(story,workshop);const digest=createHash('sha256').update(workshop).digest('hex');
const allIds=new Set();
for(const mode of ['fast','detailed']) {
  const project=join(root,mode);mkdirSync(project);const calls=[];let initialized;
  const transport={audit:[],async ask({assignment,phase,packet,schema,envelope}) {
    assert(initialized,'No request before durable cohort initialization');
    calls.push({assignment,phase});let value;const evidence=steps=>({text:'Fixture evidence.',steps});
    if(phase==='grade') {
      const steps=packet.turns.map(t=>t.reply.step);value={verdict:'Fixture grade.',decisions:steps.map(step=>({step,meaningful:false,reason:'Fixture reason.'})),fun:{meaningful:0,total:steps.length,ratio:steps.length?0:null,explanation:'Fixture counts.'},hook:{score:'medium',reason:'Fixture hook.',steps},strongest:evidence(steps),weakest:evidence(steps),limits:'Fixture only.'};
    } else if(phase==='synthesis')value={players:packet.records.map(r=>({player:r.player,actions:r.record.turns.map(t=>({step:t.reply.step,action:JSON.stringify(t.reply.choice),storyHookValue:true,reason:'Fixture evidence.'})),assessment:'Fixture assessment.',limits:'Fixture only.'})),comparisons:['All fixture players make the same deterministic construction; this tests report plumbing only.'],strongestMoments:['The fixture construction is completed.'],weakestMoments:['No weak moment simulated.'],limits:'Fixture only.'};
    else {
      const step=packet.adventure.step,reflection=packet.reflectionRequired?{effect:'Fixture effect.',reaction:'Fixture reaction.'}:{};
      if(phase==='final-report')value={...reflection,step,report:Object.fromEntries(['mostWorthwhile','leastWorthwhile','surprise','arbitrary','continue'].map(k=>[k,evidence(packet.history.map(h=>h.response.step))]))};
      else {const chapter=Number(/^c(\d+)/.exec(assignment)[1]),choice=mode==='fast'?packet.adventure.options.find(o=>typeof o.choice==='number').choice:chapter===1?[{inspect:'Tool'},{inspect:'Lid'},{inspect:'Shelf'}][step-1]:{inspect:'Label'};value={...reflection,step,reason:'Fixture reason.',choice,expectation:'Fixture expectation.',alternatives:[]};}
    }
    validateSchema(envelope?{response:value}:value,schema);return{value,raw:JSON.stringify(value,null,2)+'\n'};
  }};
  const{config,pacing}=pacedArgs([`--${mode}`,'--story',story,'--project',project,'--expect-story-sha',digest]);
  assert.equal(pacing.slots,4);assert.equal(pacing.minIntervalMs,2000);assert.equal(pacing.cooldownMs,30000);assert.equal(pacing.maxAttempts,8);
  const result=await startPaced(config,pacing,{transport,onEvent:event=>{
    if(event.event==='fresh-campaign-created') {
      initialized=event;
      const sessions=readdirSync(event.scratch).filter(f=>/^c\d+-p\d+-[a-z0-9]+\.json$/.test(f));assert.equal(sessions.length,9);
      for(const file of sessions){const s=JSON.parse(readFileSync(join(event.scratch,file),'utf8'));assert(!allIds.has(s.id));allIds.add(s.id);assert.equal(s.turns.length,0);assert(!s.final);assert.equal(s.playStyle,mode);}
      assert.equal(readdirSync(event.directory).filter(f=>f.endsWith('.json')).length,9);
    }
  }});
  assert(result.complete);assert(result.verification.verified);assert.equal(result.verification.completed,9);
  assert.equal(calls.filter(c=>c.phase==='grade').length,9);assert.equal(calls.filter(c=>c.phase==='synthesis').length,3);
  const count=calls.length;await resumeCampaign(await loadResume(result.scratch),{transport,onEvent:()=>{}});assert.equal(calls.length,count);
  console.log(JSON.stringify({mode,pass:true,newIndependentPlayers:9,requests:calls.length,allCheckpointsDurableBeforeFirstRequest:true,fullyCompleteResumeRequests:0}));
  rmSync(result.scratch,{recursive:true,force:true});
}
assert.throws(()=>pacedArgs(['--detailed','--preflight','--cooldown-ms','1000']));assert.throws(()=>pacedArgs(['--fast','--preflight','--max-attempts','3']));
console.log('PASS: fresh fast/detailed paced cohorts, canonical replay/grades/reports, durable pre-request checkpoints, distinct assignments, four-slot defaults, bounded retries, zero-request completed resume. No inference.');

rmSync(root,{recursive:true,force:true});
