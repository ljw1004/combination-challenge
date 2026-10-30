import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';import assert from 'node:assert/strict';
const root='/workspace/shared/riverside-workshop-probe-v2',sha=b=>crypto.createHash('sha256').update(b).digest('hex'),pin=fs.readFileSync(path.join(root,'MANIFEST-SHA256.txt'),'utf8').trim();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));assert.equal(sha(fs.readFileSync(path.join(root,'manifest.json'))),pin);
const evidence=[];
function run(packet,seal,session,op,...args){const r=spawnSync(process.execPath,[path.join(packet,'play.mjs'),seal,session,op,...args],{encoding:'utf8'});let out;try{out=JSON.parse(r.stdout);}catch{throw Error(r.stderr+'\n'+r.stdout);}evidence.push({packet,session,op,args,status:r.status,output:out});return {status:r.status,out};}
for(const [session,moves] of [
 ['author-smoke-normal',[['blank','mallet'],['basin','@wash'],['basin','hanger'],['mallet','gong'],['gong','@gate']]],
 ['author-smoke-preplaced',[['blank','@wash'],['mallet','blank'],['basin','@gate'],['hanger','basin'],['gong','mallet']]]
]){
 assert.equal(run(root,pin,session,'start').status,0);
 for(const pair of moves){const r=run(root,pin,session,'drop',...pair);assert.equal(r.status,0);assert(r.out.accepted);}
 const end=run(root,pin,session,'view');assert(end.out.view.completed);assert.equal(end.out.view.successfulCombinations,3);
 assert.equal(run(root,pin,session,'drop','gong','@gate').status,2,'terminal trial cannot continue manipulation');
 assert.equal(run(root,pin,session,'note','Source-aware author smoke, not an independent fresh trial.').status,0);
 assert.equal(run(root,pin,session,'start').status,2,'no reset of existing session');
}
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'bell-freeze-test-'));for(const f of ['manifest.json',...Object.keys(manifest.files)]){const target=path.join(tmp,f);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,f),target);}
fs.appendFileSync(path.join(tmp,'scenario.json'),' ');const tamper=run(tmp,pin,'author-smoke-tampered','start');assert.equal(tamper.status,2);assert.match(tamper.out.protocolError,/Frozen file hash mismatch/);
const wrong=run(root,'0'.repeat(64),'author-smoke-wrong-pin','start');assert.equal(wrong.status,2);assert.match(wrong.out.protocolError,/Pinned manifest hash mismatch/);
for(const [f,expected] of Object.entries(manifest.files))assert.equal(sha(fs.readFileSync(path.join(root,f))),expected);
fs.writeFileSync(new URL('./evidence/cli-author-smoke-v2.json',import.meta.url),JSON.stringify({kind:'source-aware author runner smoke; NOT independent player evidence',manifestPin:pin,canonicalDrops:5,fullSmokes:2,allPassed:true,commands:evidence},null,2)+'\n');console.log(JSON.stringify({allPassed:true,fullSmokes:2,commands:evidence.length,pin}));
