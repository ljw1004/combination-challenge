import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from './engine/model.ts';
import type {Action, Scenario} from './schema/scenario.ts';
import {scenarios} from './scenarios.ts';

const dir=import.meta.dirname;
const read=(p:string)=>JSON.parse(fs.readFileSync(path.join(dir,p),'utf8'));
const hash=(p:string)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest=read('manifest.json');
const active=manifest.active as {key:string;id:string;scenario:string;actions:string;source:string;route:string;routeField?:string;patch?:string;evidence:string}[];
const scenario=(key:string):Scenario=>read(active.find(x=>x.key===key)!.scenario);
const actions=(key:string):Action[]=>read(active.find(x=>x.key===key)!.actions);

test('Active list is the requested nine, without School or the old causal-label scenario',()=>{
  assert.deepEqual(active.map(x=>x.key),['mars','ideas','elements','food','theology','literature','restoration','shoreline','causation']);
  assert.deepEqual(scenarios,active.map(x=>read(x.scenario)));
  assert.equal(new Set(scenarios.map(s=>s.id)).size,9);
  assert.ok(!scenarios.some(s=>['chinese-thought','causation'].includes(s.id)));
  assert.equal(scenarios.at(-1)!.id,'causation-purpose-v4');
});

test('Canonical engine/schema match explicit source provenance and original frozen versions remain unchanged',()=>{
  const root=manifest.sourceRoot;
  for(const file of ['engine/model.ts','engine/cli.ts','engine/player.ts','schema/scenario.ts'])
    assert.equal(hash(path.join(dir,file)),manifest.sourceSha256[manifest.engineFiles[file]]);
  // This check is additional in the source workspace. The release remains
  // independently replayable after packaging where the original root is absent.
  if(fs.existsSync(root))for(const [p,h] of Object.entries(manifest.sourceSha256))assert.equal(hash(path.join(root,p)),h,p);
});

test('Content diffs contain only completions, earned checkpoints, Mars relay removal and two Ideas carry repairs',()=>{
  if(!fs.existsSync(manifest.sourceRoot))return;
  for(const row of active){
    const original:Scenario=JSON.parse(fs.readFileSync(path.join(manifest.sourceRoot,row.source),'utf8'));
    const expected=structuredClone(original);
    if(row.patch||row.key==='causation'){
      const patch=read(`patches/${row.patch??'causation'}-completion.json`);
      assert.deepEqual(Object.keys(patch).sort(),expected.stages.map(s=>s.id).sort());
      for(const stage of expected.stages)stage.completionText=patch[stage.id];
    }
    if(row.key==='mars'){
      expected.stages.find(s=>s.id==='relay')!.objectives=expected.stages.find(s=>s.id==='relay')!.objectives.filter(o=>o.id!=='relay-goal-1');
      for(const [id,retire] of Object.entries(read('patches/mars-repair-retirements.json')))expected.recipes.find(r=>r.id===id)!.retire=retire as any;
    }
    if(row.key==='ideas')for(const id of ['anatomy','inference'])delete expected.stages.find(s=>s.id===id)!.carry;
    const actual=scenario(row.key);delete actual.checkpoints;delete expected.checkpoints;
    assert.deepEqual(actual,expected,row.key);
    const raw=JSON.parse(fs.readFileSync(path.join(manifest.sourceRoot,row.route),'utf8'));
    let witness:Action[]=row.routeField?raw[row.routeField]:raw;
    if(row.key==='mars')witness=witness.filter(a=>!(a.type==='place'&&a.item==='relay'&&a.location==='relay-knoll'));
    assert.deepEqual(actions(row.key),witness,row.key+' exact witness');
  }
});

for(const [name,stageId] of [['field-note','anatomy'],['hypothesis','inference']] as const)test(`Ideas: optional ${name} can be omitted early, constructed at ${stageId}, and the whole journey finishes`,()=>{
  const s=scenario('ideas'),route:Action[]=read(`routes/ideas-delayed-${name}.json`),evidence=read(`evidence/ideas-delayed-${name}.json`);
  const arrival=M.replay(s,route.slice(0,evidence.arrival.actionPrefixLength));
  assert.equal(s.stages[arrival.state.stage].id,stageId);
  assert.equal(arrival.state.discovered.includes(name),false,'Skipped optional intermediate was not silently created');
  assert.ok(!Object.hasOwn(s.stages[arrival.state.stage],'carry'));
  const action=route[evidence.arrival.actionPrefixLength];
  assert.deepEqual(action,evidence.insertedConstruction);
  assert.equal(M.applyAction(s,arrival,action).created,name);
  for(const width of [320,360,600]){
    const finished=M.replay(s,route,width);
    assert.equal(finished.state.completed,true);assert.equal(finished.state.metrics.visits,0);
    assert.equal(finished.state.metrics.combinations,evidence.combinations);
  }
  // Restore the original restrictive override to prove the exact original
  // failure is a regression witness rather than merely an extra happy path.
  const broken=structuredClone(s),removed=read('evidence/ideas-current-goal-carry-repair.json').removedExplicitCarry;
  broken.stages.find(st=>st.id===stageId)!.carry=removed[stageId];
  let g=M.createGame(broken);let failure:any;
  for(const a of read(`evidence/ideas-omit-${name}-original-witness.json`) as Action[]){const r=M.applyAction(broken,g,a);if(!r.accepted){failure={stage:broken.stages[g.state.stage].id,action:a};break;}g=r.game;}
  assert.equal(failure?.stage,stageId);
  assert.deepEqual(failure?.action,read(`evidence/ideas-omit-${name}-original-failure.json`).failed.action);
});

test('Ideas: conditional carry does not add obsolete ingredients to the canonical Anatomy or Inference scene',()=>{
  const s=scenario('ideas'),original=structuredClone(s),removed=read('evidence/ideas-current-goal-carry-repair.json').removedExplicitCarry;
  for(const id of ['anatomy','inference'])original.stages.find(st=>st.id===id)!.carry=removed[id];
  for(const id of ['anatomy','inference']){
    const i=s.stages.findIndex(st=>st.id===id),prefix=s.checkpoints![i].actions;
    const before=M.playerView(original,M.replay(original,prefix)).things.map(t=>t.id).sort();
    const after=M.playerView(s,M.replay(s,prefix)).things.map(t=>t.id).sort();
    assert.deepEqual(after,before,id+' no extra canonical-route clutter');
  }
});

test('Ideas: both optional intermediates may be skipped together and later constructed only when their scenes need them',()=>{
  const s=scenario('ideas'),route:Action[]=read('routes/ideas-delayed-both.json'),evidence=read('evidence/ideas-delayed-both.json');
  for(const arrival of evidence.arrivals){
    const g=M.replay(s,route.slice(0,arrival.actionPrefixLength));
    assert.equal(s.stages[g.state.stage].id,arrival.stageId);assert.equal(g.state.discovered.includes(arrival.item),false);
    assert.equal(M.applyAction(s,g,arrival.construction).created,arrival.item);
  }
  for(const width of [320,360,600]){const g=M.replay(s,route,width);assert.equal(g.state.completed,true);assert.equal(g.state.metrics.visits,0);assert.equal(g.state.metrics.combinations,evidence.combinations);}
});

for(const row of active)for(const width of [320,360,600])test(`${row.key}: full exact replay, every checkpoint, gestures and endings at width ${width}`,()=>{
  const s=scenario(row.key),route=actions(row.key),evidence=read(row.evidence);
  assert.deepEqual(M.validateScenario(s),[]);
  assert.ok(s.stages.every(st=>st.completionText?.trim()));
  assert.equal(s.checkpoints!.length,s.stages.length+1);
  assert.equal(new Set(s.checkpoints!.map(c=>c.id)).size,s.checkpoints!.length);
  assert.deepEqual(evidence.actionsLog,route);
  let g=M.createGame(s,width);
  const starts=new Map<number,{stage:number;state:M.State;events:M.Event[]}>();
  starts.set(0,{stage:0,state:g.state,events:g.events});
  let completions=0;
  for(let i=0;i<route.length;i++){
    const a=route[i],before=g;
    const visibleBefore=M.playerView(s,before);
    assert.equal(visibleBefore.completionText,M.stageComplete(s,before.state)?s.stages[before.state.stage].completionText:null);
    if(a.type==='combine')assert.deepEqual(M.dropAction(s,g.state,a.a,a.b),a,`Action ${i+1}: combine must be the same browser gesture`);
    if(a.type==='place'&&a.location)assert.deepEqual(M.dropAction(s,g.state,a.item,'@'+a.location),a,`Action ${i+1}: authored place must not secretly resolve to a new recipe`);
    if(a.type==='advance'){
      assert.ok(M.stageComplete(s,g.state));
      assert.equal(visibleBefore.nextAction,before.state.stage===s.stages.length-1?'Finish this journey':'Continue · '+s.stages[before.state.stage+1].title);
    }
    const r=M.applyAction(s,g,a);assert.ok(r.accepted,`Action ${i+1}: ${r.message}`);g=r.game;
    assert.equal(g.events.at(-1)!.accepted,true);
    assert.equal(new Set(g.state.tokens.map(t=>t.id)).size,g.state.tokens.length);
    assert.equal(new Set(g.state.discovered).size,g.state.discovered.length);
    const view=M.playerView(s,g);
    assert.equal(view.completionText,M.stageComplete(s,g.state)?s.stages[g.state.stage].completionText:null);
    if(a.type!=='advance'&&!M.stageComplete(s,before.state)&&M.stageComplete(s,g.state)){
      completions++;assert.ok(r.message.endsWith(s.stages[g.state.stage].completionText!));
    }
    if(g.state.stage!==before.state.stage)starts.set(i+1,{stage:g.state.stage,state:g.state,events:g.events});
    if(g.state.completed){assert.equal(i,route.length-1);assert.equal(r.message,s.stages.at(-1)!.completionText);}
  }
  assert.equal(g.state.completed,true);assert.equal(M.playerView(s,g).nextAction,null);
  assert.equal(starts.size,s.stages.length);assert.equal(completions,s.stages.length);
  assert.equal(g.state.metrics.attempts,route.length);assert.equal(g.state.metrics.accepted,route.length);
  assert.equal(g.state.metrics.combinations,evidence.combinations);
  assert.equal(g.state.metrics.advances,s.stages.length);
  assert.deepEqual(g.state.metrics,evidence.metrics);
  starts.set(route.length,{stage:s.stages.length-1,state:g.state,events:g.events});
  for(let i=0;i<s.checkpoints!.length;i++){
    const cp=s.checkpoints![i],done=i===s.stages.length;
    assert.equal(cp.id,done?'complete':`chapter-${i+1}`);
    assert.deepEqual(cp.actions,route.slice(0,cp.actions.length),`${cp.id}: exact action prefix`);
    const boundary=starts.get(cp.actions.length);assert.ok(boundary,`${cp.id}: must be at first entry to a scene or after the actual Finish action`);
    assert.equal(boundary.stage,done?s.stages.length-1:i);
    const got=M.checkpoint(s,cp.id,width);
    assert.deepEqual(got.state,boundary.state,cp.id+' exact state');
    assert.deepEqual(got.events,boundary.events,cp.id+' exact accepted event history');
    assert.equal(got.state.completed,done);
    if(width===360){
      assert.deepEqual(M.restore(s,JSON.stringify(got)),got,cp.id+' valid save roundtrip');
      assert.equal(crypto.createHash('sha256').update(JSON.stringify(got.state)).digest('hex'),evidence.checkpoints[i].stateSha256);
    }
  }
  assert.equal(M.applyAction(s,g,{type:'advance'}).accepted,false,'Finish cannot be repeated');
});

for(const row of active)test(`${row.key}: every required placement can be reversed, removing its completion and blocking advance`,()=>{
  const s=scenario(row.key),route=actions(row.key);let g=M.createGame(s);let tested=0;
  for(const a of route){
    if(a.type==='advance')for(const goal of M.objectiveStates(s,g.state).filter(o=>o.kind==='place')){
      let reversed=g;
      for(const id of goal.witnesses){
        const t=M.token(reversed.state,id)!;
        if(t.area!==reversed.state.currentArea){const visit=M.applyAction(s,reversed,{type:'visit',area:t.area});assert.ok(visit.accepted,visit.message);reversed=visit.game;}
        const move=M.applyAction(s,reversed,{type:'move',item:id,x:t.x+8,y:t.y+8});assert.ok(move.accepted,move.message);reversed=move.game;
      }
      assert.equal(M.objectiveStates(s,reversed.state).find(o=>o.id===goal.id)!.satisfied,false);
      assert.equal(M.playerView(s,reversed).completionText,null);
      assert.equal(M.playerView(s,reversed).nextAction,null);
      assert.equal(M.applyAction(s,reversed,{type:'advance'}).accepted,false);
      const undone=M.undo(reversed);assert.ok(undone.accepted);
      assert.equal(M.playerView(s,undone.game).completionText,s.stages[g.state.stage].completionText);
      tested++;
    }
    const r=M.applyAction(s,g,a);assert.ok(r.accepted,r.message);g=r.game;
  }
  assert.equal(tested,s.stages.reduce((n,st)=>n+st.objectives.filter(o=>o.kind==='place').length,0));
});

test('Mars relay has one earned route goal, retains the actual knoll transmission, and requires no repeat placement',()=>{
  const s=scenario('mars'),route=actions('mars'),stage=s.stages.find(st=>st.id==='relay')!;
  assert.deepEqual(stage.objectives.map(o=>o.id),['relay-goal-0']);
  assert.equal(stage.objectives[0].item,'rescue-route');
  assert.equal(route.filter(a=>a.type==='place'&&a.item==='relay'&&a.location==='relay-knoll').length,0);
  const n=route.findIndex(a=>a.type==='combine'&&a.a==='relay'&&a.b==='@relay-knoll');assert.ok(n>=0);
  let g=M.replay(s,route.slice(0,n));assert.equal(M.stageComplete(s,g.state),false);
  assert.ok(M.capabilities(s,M.token(g.state,'relay')!).includes('orbiter-relay'));
  let r=M.applyAction(s,g,route[n]);assert.ok(r.accepted);assert.equal(r.created,'distress-recording');g=r.game;
  assert.equal(M.stageComplete(s,g.state),false);
  r=M.applyAction(s,g,route[n+1]);assert.ok(r.accepted);assert.equal(r.created,'rescue-route');g=r.game;
  assert.equal(M.stageComplete(s,g.state),true);
  assert.equal(M.token(g.state,'relay')!.location,null,'No redundant physical placement was injected');
  assert.equal(M.playerView(s,g).completionText,stage.completionText);
});

test('Mars explicit sole-use repairs incorporate the original object, retain provenance, and Undo restores the exact body',()=>{
  const s=scenario('mars'),route=actions('mars'),evidence=read('evidence/mars-replay.json');
  const patch=read('patches/mars-repair-retirements.json') as Record<string,{item:string;reason:string}[]>;
  for(const [id,retire] of Object.entries(patch)){
    const step=evidence.steps.find((x:any)=>x.recipe===id);assert.ok(step,id+' must be exercised by the canonical route');
    const before=M.replay(s,route.slice(0,step.number-1));
    const result=M.applyAction(s,before,route[step.number-1]);assert.ok(result.accepted,result.message);assert.ok(result.created);
    for(const old of retire){
      const original=M.token(before.state,old.item);assert.ok(original);
      assert.ok(result.retired?.includes(old.item),id+' retired event evidence');
      assert.equal(M.token(result.game.state,old.item),undefined,id+' no duplicate old body');
      assert.ok(result.game.state.discovered.includes(old.item),id+' discovery history retained');
      assert.ok(M.token(result.game.state,result.created!)!.incorporated.includes(old.item),id+' incorporation provenance');
      const undone=M.undo(result.game);assert.ok(undone.accepted);
      assert.deepEqual(M.token(undone.game.state,old.item),original,id+' exact original body restored');
      assert.equal(M.token(undone.game.state,result.created!),undefined);
      const again=M.applyAction(s,undone.game,route[step.number-1]);assert.ok(again.accepted);
      assert.equal(again.game.state.metrics.combinations,result.game.state.metrics.combinations,id+' Undo/rebuild cannot inflate unique combinations');
    }
    assert.deepEqual(M.restore(s,JSON.stringify(result.game)),result.game);
  }
});

test('Causation endings are earned by the suitable deployment, not a plan, unused boat, or broad ferry at the reed mouth',()=>{
  const s=scenario('causation'),route=actions('causation');
  const placeIndices=route.flatMap((a,i)=>a.type==='place'?[i]:[]);assert.equal(placeIndices.length,2);
  for(const n of placeIndices){const g=M.replay(s,route.slice(0,n));assert.equal(M.stageComplete(s,g.state),false);assert.equal(M.playerView(s,g).completionText,null);}
  let g=M.checkpoint(s,'chapter-2');
  assert.deepEqual(M.playerView(s,g).things.map(t=>t.id).sort(),['adze','caulking-brush','cord','poles','timber'].sort());
  for(const a of [{type:'visit',area:'yard'},{type:'visit',area:'reeds',carry:['ferry']},{type:'place',item:'ferry',location:'reed-mouth'}] as Action[]){const r=M.applyAction(s,g,a);assert.ok(r.accepted,r.message);g=r.game;}
  assert.equal(M.stageComplete(s,g.state),false);assert.equal(M.playerView(s,g).completionText,null);
  assert.match(s.stages[0].completionText!,/miller.*loaded cart across/i);
  assert.match(s.stages[1].completionText!,/brings the fisher safely back/i);
  assert.equal(M.checkpoint(s,'complete').state.completed,true);
});
