// Explicit author-generated setup for a source-blind later-case trial.
// No inventory is invented: the real earlier route is replayed to the chapter boundary.
import fs from 'node:fs';import crypto from 'node:crypto';import {M} from './runtime.mjs';import {currentProvenance} from './provenance.mjs';
const root=import.meta.dirname,[session,chapter]=process.argv.slice(2);
const provenance=currentProvenance(root);
if(!/^[a-z0-9_-]+$/i.test(session??''))throw Error('Use a new simple session name.');
const file=`${root}/sessions/${session}.json`;if(fs.existsSync(file))throw Error('Existing session is immutable; choose a new name.');
const scenarioBytes=fs.readFileSync(root+'/scenario.json'),s=JSON.parse(scenarioBytes),route=JSON.parse(fs.readFileSync(root+'/author-route.json'));
if(!s.stages.some(st=>st.id===chapter))throw Error('Unknown chapter.');
let g=M.createGame(s),actions=0;for(const a of route){if(s.stages[g.state.stage].id===chapter)break;const r=M.applyAction(s,g,a);if(!r.accepted)throw Error(r.message);g=r.game;actions++;}
if(s.stages[g.state.stage].id!==chapter||M.stageComplete(s,g.state))throw Error('No clean arrival found.');
const seed={kind:'Author-generated earlier route, NOT fresh discovery; no cached invented prerequisites',chapter,actions,baselineMetrics:g.state.metrics,scenarioSha256:crypto.createHash('sha256').update(scenarioBytes).digest('hex')};
fs.writeFileSync(file,JSON.stringify({startedAt:new Date().toISOString(),status:'running',seed,provenance,game:g},null,2));
fs.writeFileSync(`${root}/sessions/${session}.jsonl`,JSON.stringify({at:new Date().toISOString(),cmd:'author-seed',seed,provenance})+'\n');
console.log(JSON.stringify({session,seed,provenance,next:`node play.mjs ${session} look`},null,2));
