import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {evaluate} from '../src/playtest/evaluate.ts';
import type {Session} from '../src/playtest/session.ts';

test('agent protocol, frozen source and evaluator work end to end without a model subscription',()=>{
  const folder=mkdtempSync(join(tmpdir(),'combination-runner-test-'));
  try{
    const agent=join(folder,'agent.mjs');
    // Protocol fixture, deliberately not presented as an AI playtest.
    writeFileSync(agent,`let text='';for await(const chunk of process.stdin)text+=chunk;const q=JSON.parse(text);if(q.observation.partners.some(p=>'result' in p))throw Error('Output leak');console.log(JSON.stringify(q.history.length?{stop:true,report:{reason:'Protocol fixture complete',criteria:{construction:{assessment:'supported',explanation:'Synthetic fixture only',events:[999]}}}}:{action:{type:'dismiss'}}));`);
    const env={...process.env,COMBINATION_RUNS_DIR:join(folder,'runs')};
    execFileSync(process.execPath,['src/playtest/run-ai.ts','--story','mars','--session','protocol','--model','protocol-fixture','--agent',JSON.stringify([process.execPath,agent])],{cwd:resolve(import.meta.dirname,'..'),env,stdio:'pipe'});
    execFileSync(process.execPath,['src/playtest/evaluate-cli.ts','protocol'],{cwd:resolve(import.meta.dirname,'..'),env,stdio:'pipe'});
    const report=JSON.parse(readFileSync(join(folder,'runs/protocol/evaluation.json'),'utf8'));assert.equal(report.replayVerified,true);assert.equal(report.mechanics.combinations,0);assert.equal(report.experienceProfile.find((p:{id:string})=>p.id==='construction').assessment,'unknown');assert.equal(report.outcome,'stopped');
  }finally{rmSync(folder,{recursive:true,force:true});}
});
