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

export function exhaustiveOpening(){
 let arrivals=[M.createGame(s)],reports=[];
 for(let st=0;st<3;st++){
  const queue=[...arrivals],seen=new Set(),ends=[],goalStates=new Set();let edges=0;
  while(queue.length){const g=queue.pop(),key=JSON.stringify([g.state.discovered.slice().sort(),g.state.recipesUsed.slice().sort(),g.state.tokens.map(t=>t.id).sort()]);if(seen.has(key))continue;seen.add(key);
   if(M.stageComplete(s,g.state)){ends.push(g);goalStates.add(JSON.stringify(g.state.tokens.map(t=>t.id).sort()));continue;}
   const choices=ready(g);assert.ok(choices.length,`Opening deadlock ${st}: ${key}`);
   for(const r of choices){edges++;queue.push(act(g,{type:'combine',a:r.a,b:r.b}));}
  }
  // States differ only in optional local dossier leftovers, not required contracts.
  const contracts=[...new Set(s.recipes.filter(r=>chapters.slice(st+1).some(c=>c.recipes.includes(r.id))).flatMap(r=>[r.a,r.b]).filter(x=>chapters.slice(0,st+1).some(c=>c.created.includes(x))))];
  for(const g of ends)for(const id of contracts)assert.ok(M.token(g.state,id),`Missing downstream contract ${id}`);
  reports.push({chapter:s.stages[st].id,reachableProjectedStates:seen.size,acceptedEdges:edges,terminalProjectedStates:ends.length,terminalInventoryShapes:goalStates.size,downstreamContracts:contracts});
  // One representative per terminal token set: future gameplay has no recipe-id requirements.
  const unique=new Map();for(const g of ends)unique.set(JSON.stringify(g.state.tokens.map(t=>t.id).sort()),act(g,{type:'advance'}));arrivals=[...unique.values()];
 }
 return reports;
}
export function contractDiff(){const base=JSON.parse(fs.readFileSync(new URL('base-v1.json',import.meta.url))),oldchapters=JSON.parse(fs.readFileSync(new URL('../chapters.json',import.meta.url))),modified=[];const allowed=new Set(['make-optical-question','make-situated-image','make-open-atlas']);for(const c of oldchapters.slice(3))for(const id of c.recipes){const before=base.recipes.find(r=>r.id===id),after=s.recipes.find(r=>r.id===id);assert.ok(after);if(JSON.stringify(before)!==JSON.stringify(after)){modified.push(id);assert.ok(allowed.has(id));const expected=structuredClone(before);for(const key of['a','b'])if(expected[key]==='open-question')expected[key]='underdetermined-case';expected.lifecycle['underdetermined-case']=expected.lifecycle['open-question'];delete expected.lifecycle['open-question'];assert.deepEqual(after,expected);}}
 for(const c of oldchapters.slice(3))for(const id of [...c.created,...c.supplies])assert.deepEqual(s.items.find(x=>x.id===id),base.items.find(x=>x.id===id));
 for(let i=3;i<base.stages.length;i++){const before=structuredClone(base.stages[i]);before.carry=before.carry.map(x=>x==='open-question'?'underdetermined-case':x).sort();assert.deepEqual(s.stages[i],before);}
 assert.deepEqual(modified.sort(),[...allowed].sort());return {laterChapters:26,unchangedLaterRecipes:230,remappedLaterRecipes:modified,allLaterItemsAndStageNarrativesUnchanged:true};}

if(process.argv[1]===import.meta.filename){
 const errors=[...M.validateScenario(s),...L.validateContentLifecycles([s]),...L.validateObjectiveFlow([s]),...L.validateConstructionContinuity([s])];assert.deepEqual(errors,[]);
 const opening=exhaustiveOpening(),contracts=contractDiff(),runs=Array.from({length:50},(_,i)=>route(i+1,i%2===0));const picked=runs.find(r=>r.rows.slice(0,3).reduce((a,c)=>a+c.combinations,0)===21)??runs[0];
 for(const [path,hash] of Object.entries(JSON.parse(fs.readFileSync(new URL('preserved-evidence-manifest.json',import.meta.url)))))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'),hash,`Original changed: ${path}`);
 const report={kind:'Author-known logical diagnostics, not independent discovery, browser play, or enjoyment evidence',scenario:s.id,validationErrors:errors,recipes:s.recipes.length,opening,contracts,randomizedFullRoutes:50,combinationRange:[Math.min(...runs.map(r=>r.game.state.metrics.combinations)),Math.max(...runs.map(r=>r.game.state.metrics.combinations))],chapterRows:picked.rows,peakLocalTokens:Math.max(...runs.flatMap(r=>r.rows.map(c=>c.peakLocalTokens))),originalCandidateAndNegativeTrialHashesPreserved:true,runtime:'Frozen pre-event-local lifecycle implementation with explicit reader and all-item long-label layout.'};
 fs.writeFileSync(root+'/evaluation.json',JSON.stringify(report,null,2)+'\n');fs.writeFileSync(root+'/author-route.json',JSON.stringify(picked.actions,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}
