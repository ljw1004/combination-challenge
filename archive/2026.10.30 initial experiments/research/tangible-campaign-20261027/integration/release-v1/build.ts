import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import type {Action, Scenario} from '../../frozen/v5/schema/scenario.ts';

// This builder writes only into its own new integration directory. Original
// sources, including all frozen trials, are read-only inputs.
const dir = import.meta.dirname;
const root = path.resolve(dir, '../..');
const engineSource=JSON.parse(fs.readFileSync(path.join(dir,'engine-source.json'),'utf8')) as {name:string;files:Record<string,string>;testImportRelocations?:Record<string,[string,string][]>};
const read = (p:string) => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const sha = (p:string) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write = (p:string, value:unknown) => {
  const target=path.join(dir,p); fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,JSON.stringify(value,null,2)+'\n');
};
type Input={key:string;kind:'campaign'|'mini';source:string;route:string;routeField?:string;patch?:string};
const inputs:Input[] = [
  {key:'mars',kind:'campaign',source:'mars/story-expansion/scenario.json',route:'mars/story-expansion/results/goal-route.json',routeField:'actions',patch:'mars'},
  {key:'ideas',kind:'campaign',source:'ideas/revision-v6/scenario.json',route:'ideas/revision-v6/goal-route.json',patch:'ideas'},
  {key:'elements',kind:'campaign',source:'elements/revision-v5/scenario.json',route:'elements/revision-v5/solution-actions.json',patch:'elements'},
  ...['food','theology','literature','restoration','shoreline'].map(key=>({key,kind:'mini' as const,source:`new-worlds/presentation-v5/${key}.json`,route:`new-worlds/presentation-v5/${key}-route-evidence.json`,routeField:'actionsLog'})),
  {key:'causation',kind:'mini',source:'new-worlds/causation-rethink-v4/causation.json',route:'new-worlds/causation-rethink-v4/route-evidence.json',routeField:'actions'}
];
const frozenFiles = fs.readdirSync(path.join(root,'frozen'),{recursive:true,withFileTypes:true}).filter(e=>e.isFile()).map(e=>path.relative(root,path.join(e.parentPath,e.name))).sort();
const sourcePaths = [...new Set([
  ...frozenFiles,
  'docs/CONTENT-CONTRACT.md','docs/ENGINE-HARNESS.md',
  'engine/fixture.ts','engine/model.test.ts',
  ...Object.values(engineSource.files),
  ...inputs.flatMap(x=>[x.source,x.route,...x.patch?[`integration/release-v1/patches/${x.patch}-completion.json`]:[]]),
  'new-worlds/presentation-v5/README.md','new-worlds/causation-rethink-v4/README.md',
  'new-worlds/chinese-thought.json',
  'integration/release-v1/patches/mars-repair-retirements.json',
  ...['field-note','hypothesis'].flatMap(name=>[`reviews/integration-audit/ideas-omit-${name}-route.json`,`reviews/integration-audit/ideas-omit-${name}-failure.json`])
])].sort();
const sourceSha256=Object.fromEntries(sourcePaths.map(p=>[p,sha(path.join(root,p))]));
for(const version of ['v1','v2','v3','v4','v5']){
  const m=read(`frozen/${version}/manifest.json`);
  for(const [p,hash] of Object.entries(m.sha256))assert.equal(sha(path.join(root,'frozen',version,p)),hash,`Frozen ${version}/${p} differs from its original manifest`);
}
for(const [file,source] of Object.entries(engineSource.files)){
  const dest=path.join(dir,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,source),dest);
}
for(const [file,replacements] of Object.entries(engineSource.testImportRelocations??{})){
  const target=path.join(dir,file);let source=fs.readFileSync(target,'utf8');
  for(const [from,to] of replacements){assert.ok(source.includes(from),`Missing documented test import ${from}`);source=source.replaceAll(from,to);}
  fs.writeFileSync(target,source);
}
const {createGame,applyAction,checkpoint,playerView,objectiveStates,validateScenario}=await import('./engine/model.ts');

const causationCopy={
  'cart-crossing':'The broad ferry carries the miller and the loaded cart across the creek. Its width and capacity answered this job; beyond the reeds, someone now needs a different boat.',
  'reed-rescue':'The narrow skiff passes through the reeds and brings the fisher safely back. The same timber and tools served two different purposes: room for the loaded cart, and a way through the narrow passage. Both journeys are complete.'
};
write('patches/causation-completion.json',causationCopy);
const scenarios:Scenario[]=[];
const active:any[]=[];
const reports:any[]=[];
for(const input of inputs){
  const s:Scenario=read(input.source);
  const rawRoute=read(input.route);
  let actions:Action[]=structuredClone(input.routeField?rawRoute[input.routeField]:rawRoute);
  assert.ok(Array.isArray(actions));
  const changes:string[]=[];
  if(input.patch || input.key==='causation'){
    const patch=input.patch?read(`integration/release-v1/patches/${input.patch}-completion.json`):causationCopy;
    assert.deepEqual(Object.keys(patch).sort(),s.stages.map(st=>st.id).sort(),`${input.key}: completion patch must match every stage, with no extras`);
    for(const st of s.stages){assert.ok(typeof patch[st.id]==='string'&&patch[st.id].trim());st.completionText=patch[st.id];}
    changes.push('completionText applied by exact stage ID, without changing eligibility');
  }
  if(input.key==='mars'){
    const stage=s.stages.find(st=>st.id==='relay')!;
    const removed=stage.objectives.filter(o=>o.id==='relay-goal-1');
    assert.equal(removed.length,1);assert.equal(removed[0].kind,'place');assert.equal(removed[0].location,'relay-knoll');assert.equal(removed[0].capability,'orbiter-relay');
    stage.objectives=stage.objectives.filter(o=>o.id!=='relay-goal-1');
    assert.deepEqual(stage.objectives.map(o=>o.id),['relay-goal-0']);assert.equal(stage.objectives[0].item,'rescue-route');
    const indices=actions.flatMap((a,i)=>a.type==='place'&&a.item==='relay'&&a.location==='relay-knoll'?[i]:[]);
    assert.equal(indices.length,1);
    write('evidence/mars-redundant-placement-removal.json',{sourceActionIndexZeroBased:indices[0],sourceActionNumberOneBased:indices[0]+1,removedObjective:removed[0],removedAction:actions[indices[0]],preservedObjective:stage.objectives[0],reason:'Rescue-route already requires the capable relay to receive the distress recording at relay-knoll. The later ordinary placement repeated that contact instead of adding a distinct consequence.'});
    actions=actions.filter((_,i)=>i!==indices[0]);
    changes.push('Removed relay-goal-1 and only its one redundant place relay -> relay-knoll action; retained relay-goal-0 and the working-relay transmission recipe');
    const retirements=read('integration/release-v1/patches/mars-repair-retirements.json');
    const proofs:any[]=[];
    for(const [recipeId,retire] of Object.entries(retirements)){
      const recipe=s.recipes.find(r=>r.id===recipeId);assert.ok(recipe,recipeId);assert.ok(!recipe.retire?.length,recipeId+' already has retirement');
      recipe.retire=retire as NonNullable<typeof recipe.retire>;
      for(const ret of recipe.retire){
        assert.ok([recipe.a,recipe.b].includes(ret.item));
        const consumers=s.recipes.filter(r=>[r.a,r.b].includes(ret.item)).map(r=>r.id),definition=s.items.find(it=>it.id===ret.item)!;
        const goals=s.stages.flatMap(st=>st.objectives.filter(o=>o.item===ret.item||o.capability&&(definition.capabilities??[]).includes(o.capability)).map(o=>({stage:st.id,objective:o.id})));
        assert.equal(consumers.length,1,ret.item+' is not a sole-use repair base');assert.deepEqual(goals,[],ret.item+' has another objective');assert.ok(!definition.slots?.length,ret.item+' requires separate construction-capability analysis');
        proofs.push({recipe:recipeId,originalItem:ret.item,originalDescription:definition.description,output:recipe.out,recipeDescription:recipe.description,soleConsumerRecipes:consumers,matchingObjectiveUses:goals,incorporationReason:ret.reason});
      }
    }
    write('evidence/mars-repair-incorporation-proof.json',{scope:'Eight explicitly authored sole-use physical repair bases only. Components/tools and multiple-use crawler/towing alternatives are untouched; no generic terminal-item disposal.',repairs:proofs});
    changes.push(`Explicit incorporation for ${Object.keys(retirements).length} sole-use physical repair bases; original identities persist in discovery/incorporation provenance, never broad terminal-item culling`);
  }
  if(input.key==='ideas'){
    const removed=Object.fromEntries(['anatomy','inference'].map(id=>{const st=s.stages.find(x=>x.id===id)!;assert.ok(st.carry);const carry=st.carry;delete st.carry;return [id,carry];}));
    write('evidence/ideas-current-goal-carry-repair.json',{removedExplicitCarry:removed,reason:'Field note and Hypothesis can legitimately be skipped in Ask. Default current-goal dependency traversal brings the raw operands only when the later required intermediate is absent, stopping at an existing intermediate otherwise. No unseen item is spawned and no optional first-scene creation becomes a required quota.'});
    changes.push('Removed only Anatomy and Inference explicit carry overrides to use existing conditional current-goal prerequisite closure, repairing the optional Field note/Hypothesis branches without carrying obsolete raw operands on the canonical route');
  }
  assert.ok(s.stages.every(st=>st.completionText?.trim()),`${input.key}: every scene needs truthful completion copy`);
  delete s.checkpoints;
  assert.deepEqual(validateScenario(s),[]);
  let g=createGame(s);
  const checkpoints:NonNullable<Scenario['checkpoints']>=[];
  const boundaries:any[]=[];
  const steps:any[]=[];
  let maxVisible=playerView(s,g).things.length;
  const addStart=(prefixLength:number)=>{
    const st=s.stages[g.state.stage];
    const id=`chapter-${g.state.stage+1}`;
    checkpoints.push({id,label:`${g.state.stage+1}. ${st.title}`,actions:structuredClone(actions.slice(0,prefixLength))});
    boundaries.push({checkpoint:id,stageIndex:g.state.stage,stageId:st.id,actionPrefixLength:prefixLength,completed:g.state.completed,stateSha256:crypto.createHash('sha256').update(JSON.stringify(g.state)).digest('hex')});
  };
  addStart(0);
  for(let i=0;i<actions.length;i++){
    const before=g.state.stage;
    const r=applyAction(s,g,actions[i]);
    assert.ok(r.accepted,`${input.key} action ${i+1}: ${JSON.stringify(actions[i])}: ${r.message}`);
    g=r.game;maxVisible=Math.max(maxVisible,playerView(s,g).things.length);
    steps.push({number:i+1,stageBefore:s.stages[before].id,stageAfter:s.stages[g.state.stage].id,action:actions[i],accepted:r.accepted,message:r.message,...r.recipe?{recipe:r.recipe}:{},...g.events.at(-1)?.transfers?{transfers:g.events.at(-1)!.transfers}:{},completed:g.state.completed});
    if(g.state.stage!==before)addStart(i+1);
    if(g.state.completed)assert.equal(i,actions.length-1,`${input.key}: witness contains actions after finishing`);
  }
  assert.equal(g.state.completed,true,`${input.key}: route must actually finish, not merely satisfy the final objectives`);
  assert.equal(checkpoints.length,s.stages.length);
  checkpoints.push({id:'complete',label:'Complete ending',actions:structuredClone(actions)});
  boundaries.push({checkpoint:'complete',stageIndex:g.state.stage,stageId:s.stages[g.state.stage].id,actionPrefixLength:actions.length,completed:true,stateSha256:crypto.createHash('sha256').update(JSON.stringify(g.state)).digest('hex')});
  s.checkpoints=checkpoints;
  for(const c of checkpoints){const replayed=checkpoint(s,c.id);assert.equal(replayed.state.completed,c.id==='complete');}
  const report={key:input.key,scenario:s.id,title:s.title,stages:s.stages.length,checkpoints:checkpoints.length,actions:actions.length,combinations:g.state.metrics.combinations,metrics:g.state.metrics,recipesTotal:s.recipes.length,maxVisibleItems:maxVisible,completed:true,validation:validateScenario(s),finalObjectives:objectiveStates(s,g.state),ending:playerView(s,g).completionText,limits:'Author-aware structural replay only. Not source-blind playtesting, browser/UI verification, historical or scientific re-verification, or evidence of fun.'};
  write(`scenarios/${input.key}.json`,s);write(`routes/${input.key}.json`,actions);
  write(`evidence/${input.key}-replay.json`,{...report,actionsLog:actions,checkpoints:boundaries,steps});
  active.push({...input,id:s.id,title:s.title,scenario:`scenarios/${input.key}.json`,actions:`routes/${input.key}.json`,evidence:`evidence/${input.key}-replay.json`,changes:[...changes,'Regenerated all scene-start and complete-ending checkpoints from exact legal action prefixes']});
  reports.push(report);scenarios.push(s);
}
// Preserve the independently found failing witnesses and provide complete legal
// delayed-construction routes for the integration repair, without visits/spawns.
const ideas=scenarios.find(s=>s.id==='atlas-of-questions-v6')!;
for(const [name,stageId,construction] of [
  ['field-note','anatomy',{type:'combine',a:'observation',b:'notebook'}],
  ['hypothesis','inference',{type:'combine',a:'observation',b:'question'}]
] as const){
  const sourceRoute=`reviews/integration-audit/ideas-omit-${name}-route.json`;
  const original:Action[]=read(sourceRoute);
  write(`evidence/ideas-omit-${name}-original-witness.json`,original);
  write(`evidence/ideas-omit-${name}-original-failure.json`,read(`reviews/integration-audit/ideas-omit-${name}-failure.json`));
  const route:Action[]=[];let g=createGame(ideas),inserted=false;let arrival:any;
  for(const a of original){
    if(!inserted&&ideas.stages[g.state.stage].id===stageId){
      arrival={stageId,actionPrefixLength:route.length,localItems:playerView(ideas,g).things.map(t=>t.id),discovered:g.state.discovered};
      assert.ok(!g.state.discovered.includes(name));
      const r=applyAction(ideas,g,construction);assert.ok(r.accepted,r.message);assert.equal(r.created,name);g=r.game;route.push(construction);inserted=true;
    }
    const r=applyAction(ideas,g,a);assert.ok(r.accepted,r.message);g=r.game;route.push(a);
  }
  assert.ok(inserted&&g.state.completed);assert.equal(g.state.metrics.visits,0);
  write(`routes/ideas-delayed-${name}.json`,route);
  write(`evidence/ideas-delayed-${name}.json`,{scenario:ideas.id,sourceRoute,delayedItem:name,constructionStage:stageId,arrival,insertedConstruction:construction,completed:true,actionsLog:route,combinations:g.state.metrics.combinations,metrics:g.state.metrics});
}
{
  const original:Action[]=read('reviews/integration-audit/ideas-omit-field-note-route.json');
  const witness=original.filter(a=>!(a.type==='combine'&&[a.a,a.b].includes('observation')&&[a.a,a.b].includes('question')));
  const route:Action[]=[];let g=createGame(ideas);const inserted=new Set<string>();const arrivals:any[]=[];
  for(const a of witness){
    const stageId=ideas.stages[g.state.stage].id;
    const name=stageId==='anatomy'?'field-note':stageId==='inference'?'hypothesis':null;
    if(name&&!inserted.has(name)){
      assert.ok(!g.state.discovered.includes(name));
      const construction:Action={type:'combine',a:'observation',b:name==='field-note'?'notebook':'question'};
      arrivals.push({stageId,item:name,actionPrefixLength:route.length,construction});
      const r=applyAction(ideas,g,construction);assert.ok(r.accepted,r.message);assert.equal(r.created,name);g=r.game;route.push(construction);inserted.add(name);
    }
    const r=applyAction(ideas,g,a);assert.ok(r.accepted,r.message);g=r.game;route.push(a);
  }
  assert.equal(inserted.size,2);assert.ok(g.state.completed);assert.equal(g.state.metrics.visits,0);
  write('routes/ideas-delayed-both.json',route);
  write('evidence/ideas-delayed-both.json',{scenario:ideas.id,derivedFrom:'reviews/integration-audit/ideas-omit-field-note-route.json',additionalOmission:{type:'combine',a:'observation',b:'question'},arrivals,completed:true,actionsLog:route,combinations:g.state.metrics.combinations,metrics:g.state.metrics});
}
fs.writeFileSync(path.join(dir,'scenarios.ts'),`// Generated by build.ts. Debug checkpoints are exact action prefixes, not injected state.\nimport type {Scenario} from './schema/scenario.ts';\nexport const scenarios: Scenario[] = ${JSON.stringify(scenarios,null,2)};\n`);
write('active-scenarios.json',active);
write('evidence/replay-summary.json',reports);
for(const [p,hash] of Object.entries(sourceSha256))assert.equal(sha(path.join(root,p)),hash,`Source changed while building: ${p}`);
const manifest={version:'release-v1',generatedAt:new Date().toISOString(),canonicalEngine:engineSource.name,engineFiles:engineSource.files,testImportRelocations:engineSource.testImportRelocations??{},node:process.version,active,excluded:[{id:'chinese-thought',title:'School by the Well',source:'new-worlds/chinese-thought.json',reason:'Excluded from the active list; all originals and frozen comparisons preserved.'}],sourceRoot:root,sourceSha256,frozenOriginalsVerified:['v1','v2','v3','v4','v5'],sourcePreservationVerified:true,limits:['No GitHub write','No Site write','No new source-blind playtest or browser QA implied'],totals:{scenarios:reports.length,stages:reports.reduce((n,r)=>n+r.stages,0),checkpoints:reports.reduce((n,r)=>n+r.checkpoints,0),actions:reports.reduce((n,r)=>n+r.actions,0),combinations:reports.reduce((n,r)=>n+r.metrics.combinations,0)},bundleSha256:{} as Record<string,string>};
// A separate seal step after tests captures the final report and all source files.
write('manifest.json',manifest);
console.log(JSON.stringify({totals:manifest.totals,replays:reports.map(r=>({key:r.key,stages:r.stages,checkpoints:r.checkpoints,actions:r.actions,combinations:r.metrics.combinations,completed:r.completed})),sourcePreservationVerified:true},null,2));
