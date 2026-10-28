/** Independent read-only replay of the closed one-DROP gate trial. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const output=import.meta.dirname, root=path.dirname(output), dir=path.join(root,'causation/third-job'), observed=new Map();
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function bytes(file){const p=path.resolve(dir,file),b=fs.readFileSync(p),h=sha(b);if(observed.has(p))assert.equal(observed.get(p),h,'Input changed during read');observed.set(p,h);return b;}
const read=p=>JSON.parse(bytes(p)),clean=x=>JSON.parse(JSON.stringify(x)),eq=(a,b,label)=>assert.deepEqual(clean(a),clean(b),label);
function hashes(map){for(const[file,expected]of Object.entries(map))assert.equal(sha(bytes(file)),expected,file);}
const manifest=read('manifest.json');hashes(manifest.sha256);
const saved=read('sessions/fresh-gate-challenge.json'),baselineDoc=read('sessions/fresh-gate-challenge.json.baseline.json'),logs=bytes('sessions/fresh-gate-challenge.json.transcript.jsonl').toString('utf8').trim().split('\n').map(JSON.parse),spec=read('third-job-checkpoint.json');
hashes(baselineDoc.hashes);assert.equal(baselineDoc.node,process.version);assert.equal(baselineDoc.start.kind,'earned-checkpoint');eq(baselineDoc.start,{kind:'earned-checkpoint',...spec});
const s=read('pilot.json'),{pilot}=await import(pathToFileURL(path.join(dir,'pilot.ts'))),M=await import(pathToFileURL(path.join(dir,'../runtime/engine/model.ts')));
eq(pilot,s,'JSON and imported TypeScript scenario parity');assert.equal(saved.scenarioId,s.id);assert.equal(baselineDoc.scenarioId,s.id);
let baseline=M.createGame(s,baselineDoc.setup.width);
for(const a of spec.earnedPrefix){const r=M.applyAction(s,baseline,a);assert(r.accepted);baseline=r.game;}
eq(baseline,M.checkpoint(s,spec.checkpointId,baselineDoc.setup.width),'explicit earned prefix equals model checkpoint');eq(baseline.events,saved.events.slice(0,baseline.events.length),'saved prefix is authored setup');eq(M.playerView(s,baseline),baselineDoc.initialView,'pinned initial view');assert.equal(baseline.events.length,8);assert.equal(baseline.state.completed,false);
let full=M.createGame(s,saved.state.width);
for(const[i,e]of saved.events.entries()){const r=e.action.type==='undo'?M.undo(full):M.applyAction(s,full,e.action);assert.equal(r.accepted,e.accepted,`event ${i+1}`);full=r.game;}
eq(full,saved,'full saved game including state/history/events');
assert.deepEqual(logs.map(l=>l.command),['new','drop']);let g=baseline;const freshCommands=[];
for(const[index,log]of logs.entries()){
 eq(log.hashes,baselineDoc.hashes,'transcript source pins');eq(log.beforeView,M.playerView(s,g),`before view ${index}`);const eventCount=g.events.length;let feedback,resolvedAction=null;
 if(log.command==='new'){assert.equal(log.input,null);g=baseline;}
 else {const input=JSON.parse(log.input);eq(input,{source:'rope',target:'@gate'});resolvedAction=M.dropAction(s,g.state,input.source,input.target);eq(resolvedAction,{type:'place',item:'rope',location:'gate'},'DROP resolves to placement, not combination');const r=M.applyAction(s,g,resolvedAction);g=r.game;feedback={accepted:r.accepted,created:r.created??null};if(r.accepted&&M.stageComplete(s,g.state)&&!g.state.completed)g=M.applyAction(s,g,{type:'advance'}).game;freshCommands.push({command:log.command,input,resolvedAction,feedback});}
 eq(log.resolvedAction,resolvedAction);eq(log.result,{feedback,view:M.playerView(s,g)},`result ${index}`);eq(log.engineEvents,g.events.slice(eventCount),`emitted events ${index}`);
}
eq(g,saved,'command replay final full game');assert.equal(g.state.completed,true);assert.equal(g.state.metrics.attempts,10);assert.equal(g.state.metrics.accepted,10);assert.equal(g.state.metrics.advances,3);
const freshMetrics=Object.fromEntries(Object.entries(g.state.metrics).map(([k,v])=>[k,v-baseline.state.metrics[k]]));
eq(freshMetrics,{attempts:2,accepted:2,combinations:0,creations:0,installations:0,moves:0,placements:1,advances:1,visits:0});
for(const[p,h]of observed)assert.equal(sha(fs.readFileSync(p)),h,'Observed original input changed: '+p);
const result={verifiedAt:new Date().toISOString(),nodeVersion:process.version,session:'fresh-gate-challenge',scenarioId:s.id,exactFullEventReplay:true,exactCommandTranscriptReplay:true,earnedCheckpointReproduced:true,scenarioTsJsonParity:true,manifestFilesVerified:Object.keys(manifest.sha256).length,sessionPinnedFilesVerified:Object.keys(baselineDoc.hashes).length,baselineMetrics:baseline.state.metrics,terminalMetrics:g.state.metrics,freshMetrics,freshCommands,freshPlayerDropCount:1,helpRequests:0,rejections:0,completed:true,authoredEventsExcluded:baseline.events.length,authoredRouteId:spec.sourceV2Route,checkpointId:spec.checkpointId,initialVisibleSignposts:{motivation:baselineDoc.initialView.stage.motivation,rope:baselineDoc.initialView.things.find(t=>t.id==='rope')?.description,gate:baselineDoc.initialView.locations.find(t=>t.id==='gate')?.description},visibleCompletionText:M.playerView(s,g).completionText,limits:['One source-blind-requested simulated logical checkpoint trial, not human/browser evidence or fresh whole-journey play.','Only the rope placement route was exercised; basket/counterweight alternatives, rejected actions and help quality were not tested.','The earned baseline was explicitly constructed by the author and contains eight events. None count as fresh player actions.','The visible rope and gate descriptions strongly signpost tying the raised gate; one correct DROP does not establish meaningful choice, difficulty, or enjoyment.','Baseline and every command pin eight source/runtime files; all current manifest hashes pass. The manifest, baseline and transcript are local records, not tamper-proof chronology or proof that source was never viewed.','Recorded sourceCommit/runtimeBaseCommit is metadata only; this verification did not verify Git commit ancestry.','Logical playerView may reveal more description than browser, as its setup metadata warns.'],originalInputs:Object.fromEntries([...observed].map(([p,h])=>[path.relative(root,p),h])),allObservedOriginalBytesUnchanged:true};
fs.writeFileSync(path.join(output,'gate-challenge-result.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({session:result.session,exactFullEventReplay:true,exactCommandTranscriptReplay:true,manifestFilesVerified:result.manifestFilesVerified,sessionPinnedFilesVerified:result.sessionPinnedFilesVerified,authoredEventsExcluded:8,freshPlayerDrops:1,freshMetrics,completed:true,originalInputCount:observed.size},null,2));
