import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import * as M from './runtime/engine/model.ts';
import * as L from './runtime/schema/lifecycle.ts';
const root=new URL('.',import.meta.url),read=f=>JSON.parse(fs.readFileSync(new URL(f,root),'utf8')),write=(f,x)=>fs.writeFileSync(new URL(f,root),JSON.stringify(x,null,2)+'\n');
const s=read('doctrine-optional-continuation-v1-candidate.json'),m=read('authoring-manifest.json'),old=read('../revision-10-ceremony-clarity/doctrine-argument-desks-v10-candidate.json'),oldm=read('../revision-10-ceremony-clarity/authoring-manifest.json');
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(new URL(f,root))).digest('hex');
test('v10 file, immutable content prefixes and existing61a9 runtime are preserved',()=>{
 assert.equal(sha('../revision-10-ceremony-clarity/doctrine-argument-desks-v10-candidate.json'),'3a00d3b8c220590c3411d132059d6bf41740f947a503a2cf582421e531034f8e');
 assert.notEqual(s.id,old.id);for(const key of ['items','recipes','stages','sources','checkpoints','notes'])assert.deepEqual(s[key].slice(0,old[key].length),old[key],key);for(const key of ['locations','initialItems','schemaVersion','title'])assert.deepEqual(s[key],old[key],key);
 const runtime={};for(const path of ['engine/model.ts','schema/scenario.ts','schema/lifecycle.ts']){runtime[path]=sha('runtime/'+path);assert.equal(runtime[path],sha('../revision-10-ceremony-clarity/runtime/'+path));}
 write('preservation-evidence.json',{baselineSha256:m.baselineSha256,unchangedPrefixes:['items','recipes','stages','sources','checkpoints','notes'],runtimeSha256:runtime,caveat:'Original arrays unchanged; future recipe use may retain earned inputs longer in this extended candidate. No claim of identical layouts/token retirement.'});
});
test('schema, lifecycle, objective flow, continuity, references and new-ID isolation',()=>{
 assert.deepEqual(M.validateScenario(s),[]);for(const f of [L.validateContentLifecycles,L.validateObjectiveFlow,L.validateConstructionContinuity])assert.deepEqual(f([s]),[]);
 const sources=new Set(s.sources.map(x=>x.id));for(const x of [...s.items,...s.recipes])for(const src of x.sources??[])assert(sources.has(src),`${x.id}: unknown source ${src}`);
 assert.equal(s.stages.length,10);assert.equal(s.items.length-old.items.length,24);assert.equal(s.recipes.length-old.recipes.length,13);
 const oldIds=new Set(old.items.map(x=>x.id));for(const ch of m.continuationChapters){assert(ch.route.some(a=>oldIds.has(a.a)||oldIds.has(a.b)));assert(ch.new.every(id=>!oldIds.has(id)));}
});
test('v10 accepted outputs remain accepted, and no continuation source leaks early',()=>{
 let a=M.createGame(old),b=M.createGame(s);for(const action of oldm.authoredActions.slice(0,-1)){const x=M.applyAction(old,a,action),y=M.applyAction(s,b,action);assert(x.accepted&&y.accepted);assert.equal(x.created,y.created);a=x.game;b=y.game;assert(!b.state.discovered.some(x=>x.startsWith('later-')));}
 assert(M.stageComplete(old,a.state)&&M.stageComplete(s,b.state));
});
test('52-combination canonical routes, reverse drags, widths, save/restore and earned checkpoints',()=>{
 const results=[];for(const width of [320,600])for(const reverse of [false,true]){const actions=m.authoredActions.map(a=>a.type==='combine'&&reverse?{...a,a:a.b,b:a.a}:a);const g=M.replay(s,actions,width);assert(g.state.completed);assert.equal(g.state.metrics.combinations,52);assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);results.push({width,reverse,completed:true,combinations:g.state.metrics.combinations});}
 for(const cp of s.checkpoints)assert(M.checkpoint(s,cp.id));assert.equal(M.checkpoint(s,'complete').state.stage,8);assert(!M.checkpoint(s,'complete').state.completed);assert(M.checkpoint(s,'later-complete').state.completed);
 write('route-evidence.json',{evidenceKind:'Authored logical replay only; not UI, fresh-player or integration evidence',results,actions:m.authoredActions,checkpointSemanticChange:m.checkpointSemantics});
});
function signature(g,ids){return JSON.stringify({d:g.state.discovered.filter(x=>ids.has(x)).sort(),t:g.state.tokens.map(t=>[t.kind,t.area,[...(t.components??[])].sort(),[...t.incorporated].sort()]).sort((a,b)=>a[0].localeCompare(b[0]))});}
test('exhaust all local productive branch orders; every reachable state can still finish',()=>{
 const evidence=[];
 for(const [index,cp] of ['later-marburg-entry','later-trent-entry'].entries()){
  const ch=m.continuationChapters[index],initial=M.checkpoint(s,cp),startStage=initial.state.stage,localRecipes=s.recipes.filter(r=>m.newRecipes.includes(r.id)&&[r.a,r.b,r.out].some(x=>ch.new.includes(x)||ch.recipes.includes(r.id))),relevant=new Set(localRecipes.flatMap(r=>[r.a,r.b,r.out])),seen=new Map(),edges=[],recipeHits=new Set(),terminals=[];
  // Include every new recipe with currently available inputs. Since no new stage caches are opened,
  // later-desk recipes cannot leak into this search. No advance/visit/move actions are part of it.
  const queue=[initial];let cursor=0;
  while(cursor<queue.length){const g=queue[cursor++],key=signature(g,relevant);if(seen.has(key))continue;seen.set(key,g);assert.equal(g.state.stage,startStage);const successors=[];
   for(const r of s.recipes.filter(r=>[r.a,r.b].every(id=>g.state.tokens.some(t=>t.kind===id&&t.area===g.state.currentArea)))){const result=M.applyAction(s,g,{type:'combine',a:r.a,b:r.b});if(!result.accepted)continue;assert(m.newRecipes.includes(r.id),'Unexpected old productive local recipe '+r.id);recipeHits.add(r.id);const next=signature(result.game,relevant);successors.push(next);queue.push(result.game);edges.push([key,next]);}
   if(!successors.length){assert(M.stageComplete(s,g.state),'Dead end: '+key);terminals.push(key);}
  }
  const canFinish=new Set(terminals);let changed=true;while(changed){changed=false;for(const [from,to] of edges)if(canFinish.has(to)&&!canFinish.has(from)){canFinish.add(from);changed=true;}}
  for(const key of seen.keys())assert(canFinish.has(key),'Unfinishable reachable state');
  const expected=index===0?m.newRecipes.filter(x=>!x.startsWith('later-consent')&&!['later-response-unmerited','later-distinguish-growth','later-service-tree','later-compare-works'].includes(x)):['later-consent-from-earlier','later-consent-from-call','later-response-unmerited','later-distinguish-growth','later-service-tree','later-compare-works'];
  for(const id of expected)assert(recipeHits.has(id),'Uncovered '+id);
  evidence.push({chapter:ch.id,reachableStates:seen.size,productiveEdges:edges.length,terminalStates:terminals.length,allStatesCanFinish:true,recipesCovered:[...recipeHits].sort()});
 }
 write('branch-order-evidence.json',{scope:'All productive local combination orders from authored earned checkpoints; excludes arbitrary travel, placement and UI behavior',desks:evidence});
});
test('old creations really travel; new source caches do not mint replacements',()=>{
 const expected=[['later-marburg-entry',['substance-and-appearance','free-service']],['later-trent-entry',['grace-heals-will','free-service']]],rows=[];
 for(const [cp,ids] of expected){const g=M.checkpoint(s,cp),cached=s.stages[g.state.stage].caches.flatMap(c=>c.items);for(const id of ids){assert(!cached.includes(id));const t=g.state.tokens.find(t=>t.kind===id);assert(t);assert.equal(t.area,g.state.currentArea);assert(t.components?.length,'Expected preserved argument contents in '+id);assert(g.events.some(e=>e.created===id));}rows.push({checkpoint:cp,earnedAndCarried:ids});}
 write('continuity-evidence.json',rows);
});
test('failed mismatches do not create answers; undo and wrong-save identity remain safe',()=>{
 let g=M.checkpoint(s,'later-marburg-entry');const before=g.state.discovered;for(const [a,b] of [['later-ring','later-unbelieving-guest'],['later-ascension','later-spiritual-article']]){const r=M.applyAction(s,g,{type:'combine',a,b});assert(!r.accepted);assert.deepEqual(r.game.state.discovered,before);g=r.game;}
 const made=M.applyAction(s,g,{type:'combine',a:'later-ring',b:'later-institution'});assert(made.accepted);const undone=M.undo(made.game);assert(undone.accepted);assert.deepEqual(undone.game.state.discovered,g.state.discovered);assert(M.applyAction(s,undone.game,{type:'combine',a:'later-institution',b:'later-ring'}).accepted);
 assert.throws(()=>M.restore(s,JSON.stringify(M.createGame(old))));
});
