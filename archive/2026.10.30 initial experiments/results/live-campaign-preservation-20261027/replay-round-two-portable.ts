/** Read-only replay of exact packed session bytes; historical absolute paths are mapped in memory. */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {gunzipSync} from 'node:zlib';
import * as M from '../../research/tangible-campaign-20261027/trials/round-two/engine/model.ts';
const repo=path.resolve(import.meta.dirname,'../..'),trial=path.join(repo,'research/tangible-campaign-20261027/trials/round-two');
const sha=(b:Uint8Array)=>crypto.createHash('sha256').update(b).digest('hex');
const packed=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,'packed-evidence-manifest.json'),'utf8')).files;
const expected=JSON.parse(fs.readFileSync(path.join(trial,'closed-replay-report.json'),'utf8'));
const frozen=JSON.parse(fs.readFileSync(path.join(trial,'manifest.json'),'utf8'));
for(const [p,h]of Object.entries(frozen))assert.equal(sha(fs.readFileSync(path.join(trial,p))),h);
const results=[];
for(const id of ['mars_later_a','ideas_later_a','elements_later_a']){
 const row=packed.find((x:any)=>x.originalRepositoryPath.endsWith('/'+id+'/session.json'));assert(row);
 const z=fs.readFileSync(path.join(repo,row.packedRepositoryPath));assert.equal(sha(z),row.packedSHA256);
 const bytes=gunzipSync(z);assert.equal(bytes.length,row.originalBytes);assert.equal(sha(bytes),row.originalSHA256);
 const r=JSON.parse(bytes.toString()),reference=expected.sessions.find((x:any)=>x.id===id);assert(r.closedAt);assert(reference?.exactReplay);
 const scenario=fs.readFileSync(path.join(trial,'scenarios',id.split('_')[0]+'.json'));assert.equal(sha(scenario),r.scenarioSHA256);
 for(const [old,h]of Object.entries(r.implementationSHA256)){
  const match=old.match(/\/(engine|schema)\/([^/]+)$/);assert(match,old);
  assert.equal(sha(fs.readFileSync(path.join(trial,match[1],match[2]))),h);
 }
 const s=JSON.parse(scenario.toString()),baseline=M.checkpoint(s,r.debugCheckpoint);assert(baseline);
 let g=M.createGame(s);for(const e of r.game.events){const a=M.applyAction(s,g,e.action);assert.equal(a.accepted,e.accepted);g=a.game;}assert.deepEqual(g,r.game);
 const delta=Object.fromEntries(Object.entries(r.game.state.metrics).map(([k,v])=>[k,Number(v)-Number((baseline.state.metrics as any)[k])]));assert.deepEqual(delta,reference.freshMetrics);
 assert.equal(r.outcome,reference.outcome);assert.equal(g.state.completed,reference.completed);
 results.push({id,exactReplay:true,originalBytesUnchanged:true,freshMetrics:delta,outcome:r.outcome,completed:g.state.completed});
}
console.log(JSON.stringify({scope:'Targeted later-checkpoint logical trials, not full campaigns or human-fun proof',sessions:results},null,2));
