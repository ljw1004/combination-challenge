/** Coordinator evidence validation only; never substitutes synthetic actions for play. */
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {validateSession,ASSIGNMENT,type Session} from './ideas-history-estuary-v2-player.ts';
import {progress} from './ideas-history-estuary-v2-goals.ts';
const dir='results/ideas-history-estuary-v2-players/fresh-v2';
const bytes=fs.readFileSync(`${dir}/session.json`),s=JSON.parse(bytes.toString()) as Session;
validateSession(s);assert.equal(s.finished,true);assert.equal(s.assignment,ASSIGNMENT);
assert.deepEqual(JSON.parse(fs.readFileSync(`${dir}/initial-output.json`,'utf8')),s.records[0]!.output);
const sha=(b:Buffer)=>createHash('sha256').update(b).digest('hex');
const metadata=JSON.parse(fs.readFileSync(`${dir}/metadata.json`,'utf8'));
assert.equal(sha(fs.readFileSync(`${dir}/exact-player-prompt.txt`)),metadata.promptSha256);
const manifest=JSON.parse(fs.readFileSync('results/ideas-history-estuary-v2-development/publication-manifest.json','utf8'));
for(const f of manifest.executingSources)assert.equal(sha(fs.readFileSync(f.path)),f.sha256);
assert.equal(s.publication,'c822ad2ece1700f90d5e7c99c76017a1dc08a632');
const counts={gestures:s.world.gestures.length,substrateCommands:s.world.engine.selections,automaticDeliveries:s.world.gestures.flatMap(g=>g.automatic).length,queries:s.records.filter(r=>r.status==='query').length,rejections:s.records.filter(r=>r.status==='rejected').length,finishes:s.records.filter(r=>r.status==='finish').length};
assert.equal(counts.finishes,1);assert.equal(s.records.filter(r=>r.status==='accepted').length,counts.gestures);
const summary={label:'Actual finished v2 agent session; replay validation, not human-fun/UI evidence',sessionSha256:sha(bytes),publication:s.publication,sourceHashes:s.sourceHashes,counts,progress:progress(s.world.engine),finish:s.records.find(r=>r.status==='finish'),commandTypes:[...new Set(s.records.map(r=>r.command))],exposureBoundary:'Assignment/command journal only; not OS telemetry. See separate player exposure self-report.'};
assert.deepEqual(fs.readFileSync(`${dir}/session.json`),bytes);
fs.mkdirSync('results/ideas-history-estuary-v2-fresh-audit',{recursive:true});fs.writeFileSync('results/ideas-history-estuary-v2-fresh-audit/audit.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary,null,2));
