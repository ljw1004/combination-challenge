import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
import {createState,observe,preview,apply,next,offers,BOARDS} from './logical-ideas-history-provenance.ts';
import type {State} from './logical-ideas-history-provenance.ts';
const [id]=process.argv.slice(2);if(!id||!/^[a-zA-Z0-9_-]+$/.test(id))throw new Error('Simple session id required.');
const path=`results/ideas-history-provenance-players/${id}.json`,raw=readFileSync(path,'utf8'),capture=JSON.parse(raw);
const hash=(x:unknown)=>createHash('sha256').update(JSON.stringify(x)).digest('hex');const clean=(x:unknown)=>JSON.parse(JSON.stringify(x));
assert.equal(capture.sourceHash,createHash('sha256').update(readFileSync(new URL('./logical-ideas-history-provenance.ts',import.meta.url))).digest('hex'));
let state:State=createState(),finished=false;const counts={acceptedCombines:0,duplicates:0,invalidAttempts:0,inspections:0,navigation:0,reports:0,administrative:0};const boardCounts:Record<string,number>={};const reports:unknown[]=[];const boundaries:unknown[]=[];
for(const [index,e] of capture.events.entries()){
 assert.deepEqual(e.before,state,`before state at ${index}`);assert.equal(e.beforeHash,hash(state));let expected:unknown;
 try{
 if(e.cmd==='init'||e.cmd==='view')expected=observe(state);
 else if(e.cmd==='offers')expected=offers(state,e.argument??undefined);
 else if(e.cmd==='preview')expected=preview(state,JSON.parse(e.argument));
 else if(e.cmd==='act'){if(finished)throw new Error('Session is finished.');const r=apply(state,JSON.parse(e.argument));state=r.state;expected={accepted:r.accepted,reason:r.reason,observation:observe(state)};if(r.accepted){counts.acceptedCombines++;boardCounts[BOARDS[state.board].id]=(boardCounts[BOARDS[state.board].id]??0)+1;}else counts.duplicates++;}
 else if(e.cmd==='next'){if(finished)throw new Error('Session is finished.');boundaries.push({index,board:BOARDS[state.board].id,observation:observe(state)});state=next(state);expected=observe(state);}
 else if(e.cmd==='report'||e.cmd==='checkpoint'){expected={recorded:JSON.parse(e.argument)};reports.push({index,type:e.cmd,board:BOARDS[state.board].id,report:JSON.parse(e.argument)});}
 else if(e.cmd==='finish'){finished=true;expected={finished:true,observation:observe(state)};}
 else throw new Error('Commands: init/view ID; offers ID [IDEA]; preview/act ID JSON; next ID; report/checkpoint ID JSON; finish ID.');
 }catch(error){expected={error:error instanceof Error?error.message:String(error)};counts.invalidAttempts++;}
 assert.deepEqual(e.output,clean(expected),`delivered output at ${index}`);assert.deepEqual(e.after,state,`after state at ${index}`);assert.equal(e.afterHash,hash(state));
 if(['view','offers','preview'].includes(e.cmd))counts.inspections++;else if(e.cmd==='next')counts.navigation++;else if(['report','checkpoint'].includes(e.cmd))counts.reports++;else if(['init','finish'].includes(e.cmd))counts.administrative++;
}
assert.deepEqual(capture.state,state);assert.equal(capture.finished,finished);assert.equal(state.moves,counts.acceptedCombines);
console.log(JSON.stringify({id,verified:true,captureSha256:createHash('sha256').update(raw).digest('hex'),sourceSha256:capture.sourceHash,events:capture.events.length,finished,counts,boardCounts,final:observe(state),boundaries,reports},null,2));
