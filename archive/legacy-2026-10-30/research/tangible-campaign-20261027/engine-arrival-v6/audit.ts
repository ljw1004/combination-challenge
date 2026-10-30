import fs from 'node:fs';import assert from 'node:assert/strict';
import * as E from './engine/model.ts';import * as Old from '../frozen/v5/engine/model.ts';
import type {Scenario,Action} from './schema/scenario.ts';import type {State,Game} from './engine/model.ts';
const root=new URL('../integration/release-v1/',import.meta.url);
const read=(p:string)=>JSON.parse(fs.readFileSync(new URL(p,root),'utf8'));
const box=(s:Scenario,t:any)=>({...t,w:96,h:Math.max(44,26+(s.items.find(i=>i.id===t.kind)?.slots??[]).filter(sl=>sl.required||t.slots[sl.id]).length*20)});
function measure(s:Scenario,st:State){const things=st.tokens.filter(t=>t.area===st.currentArea).map(t=>box(s,t)),places=st.places.filter(p=>p.area===st.currentArea).map(p=>({...p,w:106,h:82})),all=[...things,...places];const hiding:any[]=[];
 for(const [i,t] of things.entries())for(const u of all)if(t.id!==u.id&&Math.abs(t.x-u.x)+t.w/2<=u.w/2+.001&&Math.abs(t.y-u.y)+t.h/2<=u.h/2+.001)hiding.push({hidden:t.id,cover:u.id});
 return {count:things.length,bottom:Math.max(0,...all.map(t=>t.y+t.h/2)),hiding};}
const sansMetrics=(st:State)=>({...st,metrics:{}});const results:any[]=[];
for(const name of ['elements','mars','ideas','causation','food','literature','restoration','shoreline','theology'])for(const width of [320,375,600]){
 const s:Scenario=read('scenarios/'+name+'.json'),actions:Action[]=read('routes/'+name+'.json');let g=E.createGame(s,width),old=Old.createGame(s,width);const stages:any[]=[];
 for(const [i,a] of actions.entries()){
  const before=g;const r=E.applyAction(s,g,a),o=Old.applyAction(s,old,a);assert.ok(r.accepted,`${name} ${i}: ${r.message}`);assert.ok(o.accepted);g=r.game;old=o.game;
  assert.deepEqual(g.state.tokens.map(({x,y,...t})=>t),old.state.tokens.map(({x,y,...t})=>t));assert.deepEqual(g.state.metrics,old.state.metrics);
  if(a.type==='advance'&&!g.state.completed){const now=measure(s,g.state),then=measure(s,old.state);const arrived=new Set(g.events.at(-1)?.transfers?.map(t=>t.item));const hiddenArrival=now.hiding.filter(p=>arrived.has(p.hidden)||arrived.has(p.cover));assert.deepEqual(hiddenArrival,[],`${name} ${width} stage ${g.state.stage} arrival hidden`);
   for(const t of before.state.tokens){const after=E.token(g.state,t.id)!;if(t.area===after.area)assert.deepEqual(after,t);}for(const p of before.state.places)assert.deepEqual(g.state.places.find(x=>x.id===p.id),p);
   const sourceGroups=[...new Set(before.state.tokens.filter(t=>arrived.has(t.id)).map(t=>t.area))].map(area=>before.state.tokens.filter(t=>arrived.has(t.id)&&t.area===area));const groupShapes=sourceGroups.map(ts=>({from:ts[0].area,count:ts.length,rigid:ts.every(t=>{const first=ts[0],a=E.token(g.state,t.id)!,b=E.token(g.state,first.id)!;return Math.abs((a.x-b.x)-(t.x-first.x))<.001&&Math.abs((a.y-b.y)-(t.y-first.y))<.001;})}));
   assert.deepEqual(sansMetrics(E.undo(g).game.state),sansMetrics(before.state));assert.deepEqual(E.applyAction(s,before,a).game,g);stages.push({stage:s.stages[g.state.stage].id,action:i+1,groupShapes,...now,hiddenArrival,beforeBottom:then.bottom,beforeHiding:then.hiding});
  }
 }
 assert.ok(g.state.completed);assert.deepEqual(E.restore(s,JSON.stringify(g)),g);assert.deepEqual(E.replay(s,actions,width),g);
 for(const c of s.checkpoints??[])assert.deepEqual(E.checkpoint(s,c.id,width),E.replay(s,c.actions,width));
 const row={name,width,stages,maxBottom:Math.max(...stages.map(s=>s.bottom)),meanBottom:stages.reduce((n,s)=>n+s.bottom,0)/stages.length,beforeMaxBottom:Math.max(...stages.map(s=>s.beforeBottom)),arrivalHiding:stages.flatMap(s=>s.hiddenArrival).length};results.push(row);console.log(name,width,'max',row.maxBottom,'old',row.beforeMaxBottom,'hide',row.arrivalHiding);
}
fs.writeFileSync(new URL('./evidence/route-layout.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
