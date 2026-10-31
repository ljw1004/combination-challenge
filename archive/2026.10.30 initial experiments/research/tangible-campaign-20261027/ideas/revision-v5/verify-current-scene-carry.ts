import fs from 'node:fs';import {createGame,applyAction} from '../../engine/model.ts';
const p=import.meta.dirname,s=JSON.parse(fs.readFileSync(`${p}/scenario.json`,'utf8')),actions=JSON.parse(fs.readFileSync(`${p}/goal-route.json`,'utf8'));
let g=createGame(s);const transfers:any[]=[];
for(const a of actions){const before=structuredClone(g.state);const r=applyAction(s,g,a);if(!r.accepted)throw Error(r.message);g=r.game;
 if(a.type==='advance'&&!g.state.completed){const st=s.stages[g.state.stage],allow=new Set(st.carry);for(const old of before.tokens){const now=g.state.tokens.find(t=>t.id===old.id);if(!now)throw Error('Existing token lost');if(now.kind!==old.kind)throw Error('Existing token mutated kind');if(now.area!==old.area){if(!allow.has(old.kind))throw Error('Unrequested carry');transfers.push({item:old.id,from:old.area,to:now.area,recollectedFromEarlierArea:old.area!==before.currentArea});}else if(allow.has(old.kind)&&old.area!==g.state.currentArea)throw Error('Requested existing token not gathered');}
 const ids=g.state.tokens.map(t=>t.id);if(new Set(ids).size!==ids.length)throw Error('Cloned token');
 }}
const report={passed:true,scope:'Author-route token identity and scene packing audit, not UI QA',completed:g.state.completed,totalTransfers:transfers.length,recollectionsFromEarlierAreas:transfers.filter(t=>t.recollectedFromEarlierArea).length,transfers};fs.writeFileSync(`${p}/current-scene-carry-evidence.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,transfers:transfers.filter(t=>t.recollectedFromEarlierArea).slice(0,5)},null,2));
