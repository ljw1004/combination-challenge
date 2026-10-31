import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as E from '../../engine-arrival-v6/engine/model.ts';
import type {Action,Scenario,Recipe} from '../../frozen/v5/schema/scenario.ts';
const root=new URL('../../',import.meta.url);
const scenarios=[['mars','integration/release-v1/scenarios/mars.json']] as const;
function generator(seed:number){return ()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};}
function legalRecipes(s:Scenario,g:E.Game):Recipe[]{
 const st=g.state,local=(id:string)=>id.startsWith('@')?st.places.some(t=>t.id===id.slice(1)&&t.area===st.currentArea):st.tokens.some(t=>t.id===id&&t.area===st.currentArea);
 return s.recipes.filter(r=>local(r.a)&&local(r.b)&&(!r.out||!st.discovered.includes(r.out))&&(!r.install||!st.recipesUsed.includes(r.id))&&(!r.at||local('@'+r.at))&&(r.requires??[]).every(q=>{const t=E.token(st,q.item);return t&&E.capabilities(s,t).includes(q.capability);}));
}
function apply(s:Scenario,g:E.Game,a:Action){const r=E.applyAction(s,g,a);assert.ok(r.accepted,JSON.stringify({a,message:r.message,stage:s.stages[g.state.stage].id}));return r.game;}
function goldCheck(s:Scenario,g:E.Game){const actual=E.gold(s,g.state),states=E.objectiveStates(s,g.state);assert.deepEqual(actual.items,[...new Set(states.flatMap(o=>o.witnesses))]);assert.deepEqual(actual.places,[...new Set(states.flatMap(o=>o.places))]);assert.equal(new Set(g.state.tokens.map(t=>t.id)).size,g.state.tokens.length);}
const results:any[]=[];
for(const [name,path] of scenarios){
 const s=JSON.parse(fs.readFileSync(new URL(path,root),'utf8')) as Scenario;
 if(name==='mars')s.stages.find(st=>st.id==='relay')!.objectives=s.stages.find(st=>st.id==='relay')!.objectives.filter(o=>o.id!=='relay-goal-1');
 assert.deepEqual(E.validateScenario(s),[]);
 const runs:any[]=[];
 for(const mode of ['immediate','optional-half','exhaustive'])for(let seed=1;seed<=60;seed++){
  const rand=generator(seed);let g=E.createGame(s),peak=0;const scenes:any[]=[];let stuck:any=null;let limit=2000;
  while(!g.state.completed&&limit--){
   goldCheck(s,g);peak=Math.max(peak,g.state.tokens.filter(t=>t.area===g.state.currentArea).length);
   // Prefer unsatisfied mission placements whenever their actual matching object exists.
   const goal=E.objectiveStates(s,g.state).find(o=>o.kind==='place'&&!o.satisfied&&g.state.tokens.some(t=>t.area===g.state.currentArea&&E.matches(s,t,o)));
   if(goal){const t=g.state.tokens.find(t=>t.area===g.state.currentArea&&E.matches(s,t,goal))!;g=apply(s,g,{type:'place',item:t.id,location:goal.location});continue;}
   const options=legalRecipes(s,g),complete=E.stageComplete(s,g.state);
   if(complete&&(mode==='immediate'||options.length===0||mode==='optional-half'&&rand()<.5)){
    scenes.push({stage:s.stages[g.state.stage].id,combinations:g.state.metrics.combinations});
    const before=g;g=apply(s,g,{type:'advance'});
    for(const x of g.events.at(-1)!.transfers??[]){const a=E.token(before.state,x.item)!,b=E.token(g.state,x.item)!;assert.equal(a.area,x.from);assert.equal(b.area,x.to);assert.deepEqual(a.slots,b.slots);assert.equal(b.location,null);}
    const moved=new Set((g.events.at(-1)!.transfers??[]).map(x=>x.item));const local=g.state.tokens.filter(t=>t.area===g.state.currentArea);
    const height=(t:E.Token)=>Math.max(44,26+(s.items.find(d=>d.id===t.kind)?.slots??[]).filter(sl=>sl.required||t.slots[sl.id]).length*20);
    for(const [j,t] of local.entries())for(const u of local.slice(j+1))if(moved.has(t.id)||moved.has(u.id))assert.ok(!(Math.abs(t.x-u.x)<.1&&Math.abs(t.y-u.y)+height(t)/2<=height(u)/2),`Arrival hid ${name}/${s.stages[g.state.stage].id}: ${t.id} under ${u.id}`);
    for(const prior of before.state.tokens.filter(t=>t.area===g.state.currentArea&&!moved.has(t.id))){const after=E.token(g.state,prior.id);if(after)assert.deepEqual(after,prior,'Stationary destination thing moved');}

    continue;
   }
   if(!options.length){stuck={stage:s.stages[g.state.stage].id,objectives:E.objectiveStates(s,g.state),actions:g.events.map(e=>e.action)};break;}
   const recipe=options[Math.floor(rand()*options.length)];let a=recipe.a,b=recipe.b;
   if(a.startsWith('@')||!b.startsWith('@')&&rand()<.5)[a,b]=[b,a];
   if(recipe.at){const target=E.token(g.state,b)!;if(target.location!==recipe.at)g=apply(s,g,{type:'place',item:b,location:recipe.at});}
   const old=g;g=apply(s,g,E.dropAction(s,g.state,a,b));
   assert.equal(g.events.at(-1)!.recipe,recipe.id);
   for(const o of E.objectiveStates(s,old.state).filter(o=>o.satisfied&&o.kind==='create'))assert.ok(E.objectiveStates(s,g.state).find(n=>n.id===o.id)!.satisfied,`Creation goal became unsatisfied: ${name} ${o.id}`);
  }
  assert.ok(limit>0,'Exceeded action limit');
  runs.push({mode,seed,completed:g.state.completed,combinations:g.state.metrics.combinations,peak,stuck});
  if(stuck){fs.writeFileSync(new URL(`./mars-repair-${name}-${mode}-${seed}-stuck.json`,import.meta.url),JSON.stringify(stuck,null,2));console.log('STUCK',name,mode,seed,stuck.stage);break;}
 }
 const fails=runs.filter(r=>!r.completed);results.push({name,runs:runs.length,completed:runs.length-fails.length,combinationsRange:[Math.min(...runs.map(r=>r.combinations)),Math.max(...runs.map(r=>r.combinations))],peakLocal:Math.max(...runs.map(r=>r.peak)),failures:fails});
 console.log(JSON.stringify(results.at(-1)));
}
fs.writeFileSync(new URL('./mars-repair-branch-audit-results.json',import.meta.url),JSON.stringify({engine:'engine-arrival-v6/engine/model.ts',scope:'Seeded source-aware legal-action exploration of integration scenarios; not fresh play or browser UI evidence. Known redundant Mars relay objective exclusion is applied idempotently.',results},null,2)+'\n');
assert.equal(results.flatMap(r=>r.failures).length,0);
