import fs from 'node:fs';import * as E from '../../frozen/v5/engine/model.ts';
const root=new URL('../../',import.meta.url);let results:any[]=[];
for(const [name,sp,ap,key] of [['elements','elements/revision-v5/scenario.json','elements/revision-v5/solution-actions.json',''],['ideas','ideas/revision-v6/scenario.json','ideas/revision-v6/goal-route.json',''],['mars','mars/story-expansion/scenario.json','mars/story-expansion/results/goal-route.json','actions']]){
 const s=JSON.parse(fs.readFileSync(new URL(sp,root),'utf8'));let actions=JSON.parse(fs.readFileSync(new URL(ap,root),'utf8'));if(key)actions=actions[key];let g=E.createGame(s);const checks:any[]=[];
 for(const [i,a] of actions.entries()){
  const before=g;const r=E.applyAction(s,g,a);if(!r.accepted)throw Error(r.message);g=r.game;
  if(a.type==='advance'&&!g.state.completed){
   const local=g.state.tokens.filter(t=>t.area===g.state.currentArea);const hiding:any[]=[];
   for(const [j,t] of local.entries()){const h= Math.max(44,26+(s.items.find((d:any)=>d.id===t.kind).slots??[]).filter((sl:any)=>sl.required||t.slots[sl.id]).length*20);for(const u of local.slice(j+1)){const uh=Math.max(44,26+(s.items.find((d:any)=>d.id===u.kind).slots??[]).filter((sl:any)=>sl.required||u.slots[sl.id]).length*20);if(Math.abs(t.x-u.x)<.1&&Math.abs(t.y-u.y)+h/2<=uh/2)hiding.push({hidden:t.id,cover:u.id,x:t.x,y:t.y,from:E.token(before.state,t.id)?.area,coverFrom:E.token(before.state,u.id)?.area});}}
   if(hiding.length)checks.push({stage:s.stages[g.state.stage].id,actionIndex:i,hiding,transfers:g.events.at(-1)?.transfers});
  }
 }
 results.push({name,checks});
}
fs.writeFileSync(new URL('./carry-layout-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
