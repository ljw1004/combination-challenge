import{scenarios}from '../../ui/scenarios.ts';
import{archivedScenarioIds}from '../../schema/lifecycle.ts';
import*as M from '../../engine/model.ts';
import{readFileSync,writeFileSync}from'node:fs';
const all=[];
for(const s of scenarios.filter(s=>!archivedScenarioIds.has(s.id))){
 let g=M.createGame(s);const made=new Map(),used=s.stages.map(()=>new Set());
 const actions=JSON.parse(readFileSync(new URL('../../evidence/'+s.id+'-route-evidence.json',import.meta.url),'utf8')).actionsLog;
 for(const a of actions){const stage=g.state.stage;if(a.type==='combine')for(const id of[a.a,a.b])if(made.has(id)&&made.get(id)<stage)used[stage].add(id);const r=M.applyAction(s,g,a);if(!r.accepted)throw Error(r.message);g=r.game;if(r.created)made.set(r.created,stage);}
 for(let i=1;i<s.stages.length;i++){const row={world:s.id,stage:s.stages[i].id,used:[...used[i]]};all.push(row);if(!row.used.length)console.log('MISSING',s.id,s.stages[i].id);else if(['food','atlas-of-questions-v8-transmission-actions'].includes(s.id))console.log('CONNECTED',s.stages[i].id,row.used.join(','));}
}
writeFileSync(new URL('./created-thread-audit.json',import.meta.url),JSON.stringify(all,null,2));console.log('MISSING TOTAL',all.filter(r=>!r.used.length).length,'/',all.length);

if(all.some(r=>!r.used.length))process.exitCode=1;
