import fs from 'node:fs';
import crypto from 'node:crypto';
const root='/workspace/shared/combination-campaign-research-20261028/atlas/revision-v2-concrete-opening/';
const {M}=await import(root+'runtime.mjs');
const scenarioText=fs.readFileSync(root+'scenario.json','utf8');
const s=JSON.parse(scenarioText), route=JSON.parse(fs.readFileSync(root+'author-route.json'));
const selected=new Set(['anatomy','circulation','longitude','future-observatory','future-memory','future-city']);
let g=M.createGame(s), snapshots=[], checked=0, longitudeStart;
for(const a of route){
 const stage=s.stages[g.state.stage];
 if(stage.id==='longitude'&&!longitudeStart)longitudeStart=structuredClone(g);
 const r=M.applyAction(s,g,a);if(!r.accepted)throw Error(JSON.stringify({checked,a,message:r.message}));g=r.game;checked++;
 if(selected.has(stage.id)&&a.type!=='advance'){
  const v=M.playerView(s,g); snapshots.push({stage:stage.id,action:a,created:r.created,goals:v.objectives,things:v.things.map(t=>({id:t.id,label:t.label,reading:t.reading??null,components:t.components}))});
 }
}
let branch=longitudeStart,lunar=[];
for(const a of [{type:'combine',a:'lunar-distance',b:'predictive-sky-record'},{type:'combine',a:'observed-sky-angle',b:'nautical-table'}]){
 const r=M.applyAction(s,branch,a);lunar.push({action:a,accepted:r.accepted,created:r.created});branch=r.game;
}
const evidence={kind:'author-aware mechanical replay, not discovery play',scenarioSha256:crypto.createHash('sha256').update(scenarioText).digest('hex'),actions:checked,completed:g.state.completed,combinations:g.state.metrics.combinations,lunarWithoutLocalTime:{actions:lunar,localNoonUsed:branch.state.recipesUsed.filter(id=>s.recipes.find(r=>r.id===id)?.a==='local-noon'||s.recipes.find(r=>r.id===id)?.b==='local-noon')},snapshots};
fs.writeFileSync('/workspace/shared/combination-campaign-research-20261028/atlas-independent-review/later-author-replay.json',JSON.stringify(evidence,null,2));console.log(JSON.stringify({...evidence,snapshots:evidence.snapshots.length},null,2));
