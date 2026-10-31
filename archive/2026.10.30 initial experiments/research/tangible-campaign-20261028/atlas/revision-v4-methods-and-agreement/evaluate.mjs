import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {M,L} from './runtime.mjs';
export const s=JSON.parse(fs.readFileSync(new URL('scenario.json',import.meta.url))),chapters=JSON.parse(fs.readFileSync(new URL('chapters.json',import.meta.url)));
export const root=import.meta.dirname;
export const act=(g,a)=>{const r=M.applyAction(s,g,a);assert.equal(r.accepted,true,`${r.message}: ${JSON.stringify(a)}`);return r.game;};
const recipes=new Map(s.recipes.map(r=>[r.id,r]));
export const localRecipes=(st)=>chapters[st].recipes.map(id=>recipes.get(id));
export const ready=(g)=>localRecipes(g.state.stage).filter(r=>!g.state.discovered.includes(r.out)&&[r.a,r.b].every(x=>g.state.tokens.some(t=>t.id===x&&t.area===g.state.currentArea)));
export function route(seed=1,reverse=false){let rand=seed,g=M.createGame(s),actions=[],rows=[];const random=()=>{rand=(Math.imul(rand,1664525)+1013904223)>>>0;return rand/2**32;};for(let st=0;st<s.stages.length;st++){
 const used=new Set(),earlier=new Set(chapters.slice(0,st).flatMap(c=>c.created));let n=0,peak=g.state.tokens.filter(t=>t.area===g.state.currentArea).length;
 while(!M.stageComplete(s,g.state)){
  const choices=ready(g);assert.ok(choices.length,`Deadlock at ${s.stages[st].id}`);const r=choices[Math.floor(random()*choices.length)];for(const x of[r.a,r.b])if(earlier.has(x))used.add(x);
  const flip=reverse||random()<.5,a=flip?r.b:r.a,b=flip?r.a:r.b;
  if(r.at){const action={type:'place',item:b,location:r.at};actions.push(action);g=act(g,action);}
  const action={type:'combine',a,b};actions.push(action);g=act(g,action);n++;peak=Math.max(peak,g.state.tokens.filter(t=>t.area===g.state.currentArea).length);
 }
 rows.push({chapter:s.stages[st].id,combinations:n,earlierCreatedUsed:[...used],peakLocalTokens:peak});actions.push({type:'advance'});g=act(g,{type:'advance'});
 }assert.equal(g.state.completed,true);return {game:g,actions,rows};}

if(process.argv[1]===import.meta.filename){
 const errors=[...M.validateScenario(s),...L.validateContentLifecycles([s]),...L.validateObjectiveFlow([s]),...L.validateConstructionContinuity([s])];assert.deepEqual(errors,[]);
 const runs=Array.from({length:50},(_,i)=>route(i+1,i%2===0)),picked=runs.find(r=>r.game.state.metrics.combinations===258)??runs[0];
 const affected=['longitude','future-city'];
 const report={kind:'Author-known logical diagnostics, not independent discovery, browser layout or human enjoyment',scenario:s.id,validationErrors:errors,recipes:s.recipes.length,randomizedFullRoutes:50,combinationRange:[Math.min(...runs.map(r=>r.game.state.metrics.combinations)),Math.max(...runs.map(r=>r.game.state.metrics.combinations))],chapterRows:picked.rows,peakLocalTokens:Math.max(...runs.flatMap(r=>r.rows.map(c=>c.peakLocalTokens))),affectedOutputReadings:chapters.filter(c=>affected.includes(c.id)).map(c=>({chapter:c.id,recipes:c.recipes.length,created:c.created.length,readings:c.created.filter(id=>s.items.find(i=>i.id===id).reading).length})),runtime:'Same frozen pre-event-local runtime as v3; v4 is a separate new packet, not a mutation of any trial.'};
 fs.writeFileSync(root+'/evaluation.json',JSON.stringify(report,null,2)+'\n');fs.writeFileSync(root+'/author-route.json',JSON.stringify(picked.actions,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}
