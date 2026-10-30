import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const baseline=process.env.CAMPAIGN_BASELINE??'/workspace/shared/combination-fork-recovery-20261028';
const M=await import(path.join(baseline,'experiments/tangible-campaign/engine/model.ts'));
const L=await import(path.join(baseline,'experiments/tangible-campaign/schema/lifecycle.ts'));
const s=JSON.parse(fs.readFileSync(path.join(here,'doctrine-argument-desks-v2-candidate.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(here,'authoring-manifest.json'),'utf8'));
const old=JSON.parse(fs.readFileSync(manifest.baseline,'utf8'));
const valid=()=>[...M.validateScenario(s),...L.validateContentLifecycles([s]),...L.validateObjectiveFlow([s]),...L.validateConstructionContinuity([s])];
function run(actions,{reverse=false,width=360}={}){
 let g=M.createGame(s,width),counts=[{chapter:1,arriving:g.state.tokens.filter(t=>t.area===g.state.currentArea).length,peak:0,usedEarlier:new Set()}];
 const born=new Map(g.state.tokens.map(t=>[t.kind,0]));
 for(const raw of actions){
  const a=reverse&&raw.type==='combine'?{...raw,a:raw.b,b:raw.a}:raw;
  const stage=g.state.stage;
  const r=M.applyAction(s,g,a);assert(r.accepted,JSON.stringify({stage:stage+1,a,message:r.message}));
  if(a.type==='combine'){
   for(const id of [a.a,a.b])if((born.get(id)??Infinity)<stage&&s.recipes.some(x=>x.out===id))counts[stage].usedEarlier.add(id);
   if(r.created)born.set(r.created,stage);
  }
  g=r.game;
  if(g.state.stage!==stage){for(const t of g.state.tokens)if(!born.has(t.kind))born.set(t.kind,g.state.stage);counts.push({chapter:g.state.stage+1,arriving:g.state.tokens.filter(t=>t.area===g.state.currentArea).length,peak:0,usedEarlier:new Set()});}
  counts[g.state.stage].peak=Math.max(counts[g.state.stage].peak,g.state.tokens.filter(t=>t.area===g.state.currentArea).length);
 }
 return {g,counts:counts.map(c=>({...c,usedEarlier:[...c.usedEarlier]}))};
}
test('latest scenario/lifecycle/objective/component schema',()=>assert.deepEqual(valid(),[]));
test('authored route, all checkpoints, new identity, meaningful reuse',()=>{
 const {g,counts}=run(manifest.authoredActions);assert(g.state.completed);assert.notEqual(s.id,old.id);assert.equal(g.state.metrics.combinations,63);
 for(const c of s.checkpoints)assert(M.checkpoint(s,c.id));
 for(const c of counts.slice(1))assert(c.usedEarlier.length>=2,JSON.stringify(c));
 assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);
 fs.writeFileSync(path.join(here,'route-evidence.json'),JSON.stringify({scenarioId:s.id,validationErrors:valid(),combinations:g.state.metrics.combinations,completed:g.state.completed,counts,actionsLog:manifest.authoredActions},null,2)+'\n');
});
test('reversed drags and narrow/wide boards preserve completion',()=>{for(const width of [320,600])assert(run(manifest.authoredActions,{reverse:true,width}).g.state.completed)});
test('alternate evidence routes retain continuity, not just retained inventory',()=>{
 const variants=[];
 const alts=s.recipes.filter(r=>r.id.includes('-alt-'));
 for(let mask=1;mask<(1<<alts.length);mask++){
  const selected=alts.filter((_,i)=>mask&(1<<i));
  const actions=manifest.authoredActions.map(a=>{if(a.type!=='combine')return a;const core=s.recipes.find(r=>r.a===a.a&&r.b===a.b);const alt=selected.find(r=>r.out===core?.out);return alt?{type:'combine',a:alt.a,b:alt.b}:a;});
  const {g,counts}=run(actions);assert(g.state.completed);for(const c of counts.slice(1))assert(c.usedEarlier.length>=2);variants.push({alternatives:selected.map(r=>r.id),combinations:g.state.metrics.combinations,completed:g.state.completed,counts});
 }
 fs.writeFileSync(path.join(here,'alternative-route-evidence.json'),JSON.stringify(variants,null,2)+'\n');
});
test('branch-order permutations cannot lose the route or an already achieved intermediate',()=>{
 let count=0;
 for(let seed=1;seed<=40;seed++){
  let x=seed;const rand=()=>((x=(x*1664525+1013904223)>>>0)/2**32);
  let g=M.createGame(s);
  for(let stage=0;stage<s.stages.length;stage++){
   const remaining=manifest.chapters[stage].route.map(x=>({...x}));
   while(remaining.length){
    const possible=remaining.map((a,i)=>({a,i,r:M.applyAction(s,g,a)})).filter(x=>x.r.accepted);
    assert(possible.length,`dead end seed ${seed} chapter ${stage+1}`);
    const chosen=possible[Math.floor(rand()*possible.length)];
    const before=g;g=chosen.r.game;remaining.splice(chosen.i,1);
    const undone=M.undo(g);assert(undone.accepted);assert.deepEqual(undone.game.state.discovered,before.state.discovered);assert.deepEqual(M.objectiveStates(s,undone.game.state),M.objectiveStates(s,before.state));
   }
   assert(M.stageComplete(s,g.state));g=M.applyAction(s,g,{type:'advance'}).game;
  }
  assert(g.state.completed);count++;
 }
 assert.equal(count,40);
});
test('excerpt attribution, sources, progressive terse goals, no unsupported faction winner',()=>{
 const sourceIds=new Set(s.sources.map(x=>x.id));
 for(const i of s.items)for(const id of i.sources??[])assert(sourceIds.has(id),`${i.id} missing ${id}`);
 for(const r of s.recipes){assert.equal(Object.keys(r.lifecycle).length,2);for(const id of r.sources??[])assert(sourceIds.has(id));}
 for(const st of s.stages){assert(st.objectives.some(x=>x.intermediate));for(const o of st.objectives)assert(o.text.length<40);}
 assert(s.items.find(i=>i.id==='pelagius-quotation').reading.attribution.includes('as quoted'));
 assert(s.items.find(i=>i.id==='two-origins').description.includes('not a universal'));
 assert(!JSON.stringify(s).includes('Protestant'));
});
test('preserved bound manuscript leaves remain recognisable through later work',()=>{
 const g=M.checkpoint(s,'chapter-3');const grace=g.state.tokens.find(t=>t.kind==='grace-heals-will');
 assert(grace.components.includes('inherited-condition'));
 const g2=M.checkpoint(s,'chapter-7');const instrument=g2.state.tokens.find(t=>t.kind==='instrument-of-grace');assert(instrument.components.includes('instrument-analogy'));
});
test('visible quotations have attributed readings and whole-source excerpt accounting',()=>{
 const ledger=JSON.parse(fs.readFileSync(path.join(here,'quote-ledger.json'),'utf8'));
 for(const q of ledger.cards){const it=s.items.find(i=>i.id===q.item);assert(it.reading.text);assert(it.reading.attribution.includes('quotation'));assert(it.label.split(/\s+/).length>=5);assert(it.label.split(/\s+/).length<=12);}
 assert(ledger.cards.find(x=>x.source==='liberty').totalOccurrenceWords<=25);
 for(const it of s.items.filter(i=>i.reading)){assert.equal(typeof it.reading.text,'string');assert.equal(typeof it.reading.attribution,'string');assert(!/combine .* with|drag .* onto|bring .* onto/i.test(it.reading.text));}
});
