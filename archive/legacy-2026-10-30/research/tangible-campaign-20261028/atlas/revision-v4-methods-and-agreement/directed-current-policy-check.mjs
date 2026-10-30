// Read-only, directed patch regression; never imported by the frozen player.
import fs from'node:fs';import crypto from'node:crypto';import assert from'node:assert/strict';import {pathToFileURL}from'node:url';import {currentProvenance}from'./provenance.mjs';
const provenance=currentProvenance(import.meta.dirname),s=JSON.parse(fs.readFileSync('scenario.json')),actions=JSON.parse(fs.readFileSync('author-route.json'));
const base='/workspace/shared/combination-fork-recovery-20261028/experiments/tangible-campaign',paths=['engine/model.ts','schema/lifecycle.ts','schema/scenario.ts'];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(base+'/'+p)).digest('hex'),before=Object.fromEntries(paths.map(p=>[p,hash(p)]));const M=await import(pathToFileURL(base+'/engine/model.ts'));
function act(g,a){const r=M.applyAction(s,g,a);assert.equal(r.accepted,true,JSON.stringify(a)+': '+r.message);return r.game;}
function enter(id){let g=M.createGame(s);for(const a of actions){if(s.stages[g.state.stage].id===id)return g;g=act(g,a);}throw Error(id);}
const rows=[];
for(const mode of['ordinary','observe-then-ordinary','observe-then-alternative'])for(const reverse of[false,true]){
 let g=enter('longitude');const combine=(a,b)=>{g=act(g,{type:'combine',a:reverse?b:a,b:reverse?a:b});};
 for(const[a,b]of[['rotation-card','merchant-manual'],['sea-clock','equation-time'],['apparent-clock','local-noon'],['time-difference','time-angle-rule'],['lunar-distance','lunar-clearing'],['nautical-table','predictive-sky-record'],['cleared-lunar-angle','lunar-time-scale'],['lunar-reference-time','local-noon'],['lunar-time-difference','time-angle-rule']])combine(a,b);
 if(mode!=='ordinary'){combine('clock-longitude','lunar-longitude');for(const id of['clock-longitude','lunar-longitude','clock-moon-discrepancy'])assert.ok(M.token(g.state,id));assert.ok(!M.token(g.state,'corrected-clock-position'));}
 g=act(g,{type:'place',item:reverse?'sea-clock':'rough-voyage',location:'sea-trial'});combine('sea-clock','rough-voyage');combine('voyage-clock-record',mode==='observe-then-alternative'?'clock-moon-discrepancy':'clock-longitude');combine('corrected-clock-position','lunar-longitude');combine('position-comparison','chart');assert.ok(M.stageComplete(s,g.state));rows.push({mode,reverse,complete:true,lifecycleVersion:g.lifecycleVersion});
}
for(const reverse of[false,true]){let g=enter('future-city');
 const c=JSON.parse(fs.readFileSync('chapters.json')).find(c=>c.id==='future-city');for(const id of c.recipes){const q=s.recipes.find(q=>q.id===id);g=act(g,{type:'combine',a:reverse?q.b:q.a,b:reverse?q.a:q.b});}assert.ok(M.stageComplete(s,g.state));assert.ok(M.token(g.state,'evolving-city').components.includes('metabolic-partnership'));assert.ok(M.token(g.state,'seasonal-city-rule'));rows.push({case:'current-agreement city',reverse,complete:true,lifecycleVersion:g.lifecycleVersion});}
for(const p of paths)assert.equal(hash(p),before[p]);assert.deepEqual(currentProvenance(import.meta.dirname),provenance);
const report={scope:'Eight directed author-known event-local-policy branch checks; no player/discovery/UI claim',provenance,runtimeHashes:before,rows};fs.writeFileSync('directed-current-policy-check.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
