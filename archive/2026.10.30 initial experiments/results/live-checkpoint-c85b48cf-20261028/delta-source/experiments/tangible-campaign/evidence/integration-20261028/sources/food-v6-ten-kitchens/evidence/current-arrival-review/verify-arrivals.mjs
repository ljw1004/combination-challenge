import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// Independent checker: no imports from the candidate's own verification scripts.
// All writes are confined to this script's directory; the two engines are loaded read-only.
const out = path.dirname(new URL(import.meta.url).pathname);
const candidate = '/workspace/shared/combination-campaign-research-20261028/food-v6-ten-kitchens';
const checkout = '/workspace/shared/combination-fork-recovery-20261028';
const paths = {
  scenario: path.join(candidate, 'scenario.json'),
  baseline: path.join(candidate, 'engine/model.ts'),
  current: path.join(checkout, 'experiments/tangible-campaign/engine/model.ts'),
};
const startedAt = new Date().toISOString();
const shaBytes = x => createHash('sha256').update(x).digest('hex');
const shaFile = p => shaBytes(fs.readFileSync(p));
const head = () => execFileSync('git', ['-C', checkout, 'rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
const walk = d => fs.readdirSync(d, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(d,e.name)) : [path.join(d,e.name)]).sort();
const routePaths = walk(path.join(candidate,'routes')).filter(p => p.endsWith('.json'));
const inputPaths = [...new Set([
  ...Object.values(paths), ...routePaths,
  ...walk(path.join(candidate, 'schema')).filter(p => p.endsWith('.ts')),
  ...walk(path.join(checkout,'experiments/tangible-campaign/schema')).filter(p => p.endsWith('.ts')),
])];
const inputManifest = inputPaths.map(p => ({path:p, sha256:shaFile(p)}));
const metadata = {
  startedAt, node:process.version, liveHeadBefore:head(),
  requestedObservedHead:'217ce7428e8e95ea0c1bc18e7747ecdbf68c1b5c',
  scenario:{path:paths.scenario,sha256:shaFile(paths.scenario)},
  engines:{baseline:{path:paths.baseline,sha256:shaFile(paths.baseline)},current:{path:paths.current,sha256:shaFile(paths.current)}},
};
const scenario = JSON.parse(fs.readFileSync(paths.scenario,'utf8'));
const baseline = await import(pathToFileURL(paths.baseline));
const current = await import(pathToFileURL(paths.current));
const withoutArrival = state => {const {arrival,...physical}=state; return physical;};
const stripGame = game => ({...game,state:withoutArrival(game.state),history:game.history.map(withoutArrival)});
const sorted = a => a.map(x=>JSON.stringify(x)).sort();
const checkSet = (a,b,label) => {assert.equal(new Set(a.map(x=>JSON.stringify(x))).size,a.length,`${label}: duplicates`);assert.deepEqual(sorted(a),sorted(b),label);};
const rows = [], failures = [];
let context = {};
function checkArrival(before,after,first=false) {
  const stage=scenario.stages[after.stage], area=stage.area.id;
  const beforeDiscovered = new Set(before?.discovered??[]);
  const addedIds = after.discovered.filter(id=>!beforeDiscovered.has(id));
  const initialIds = first ? new Set(scenario.initialItems) : new Set();
  const newIds = addedIds.filter(id=>!initialIds.has(id));
  const cacheRows = newIds.map(id=>{
    const caches=(stage.caches??[]).filter(c=>!(before?.openedCaches??[]).includes(c.id)&&c.items.includes(id));
    assert.equal(caches.length,1,`actual newly discovered ${id} must have one newly opened cache`);
    assert(after.openedCaches.includes(caches[0].id));
    const t=after.tokens.find(t=>t.id===id);assert(t&&t.area===area,`new supply ${id} must physically exist at destination`);
    return {item:id,cache:caches[0].id};
  });
  const physicalTransfers=(before?.tokens??[]).flatMap(t=>{
    const target=after.tokens.find(x=>x.id===t.id);
    assert(target,`advance unexpectedly removed ${t.id}`);
    return target.area!==t.area?[{item:t.id,from:t.area,to:target.area}]:[];
  });
  for(const t of physicalTransfers)assert.equal(t.to,area,'transfer destination');
  const carried=physicalTransfers.map(({item,from})=>({item,from}));
  const here=(before?.tokens??[]).filter(t=>t.area===area).map(t=>t.id);
  if(first)here.push(...addedIds.filter(id=>initialIds.has(id)));
  const expected={stage:after.stage,area,supplies:cacheRows,carried,here};
  assert(after.arrival,'arrival snapshot exists');
  assert.equal(after.arrival.stage,after.stage);assert.equal(after.arrival.area,area);
  checkSet(after.arrival.supplies,cacheRows,'supplies equal actual new cache discoveries');
  checkSet(after.arrival.carried,carried,'carried equal actual physical transfers');
  checkSet(after.arrival.here,here,'here equal actual already-present things');
  checkSet([...after.arrival.supplies.map(x=>x.item),...after.arrival.carried.map(x=>x.item),...after.arrival.here], [...newIds,...carried.map(x=>x.item),...here], 'disjoint provenance');
  const view=current.arrivalView(scenario,after);assert(view,'arrival view exists');
  checkSet(view.supplies.map(x=>x.id),newIds,'arrival view supplies');
  checkSet(view.carried.map(x=>x.id),carried.map(x=>x.item),'arrival view carried');
  checkSet(view.here.map(x=>x.id),here,'arrival view here');
  return {expected,physicalTransfers};
}
function checkCues(state,expected) {
  // Expected cues are derived from observed physical/discovery deltas, not the engine snapshot.
  for(const def of scenario.items){
    const t=state.tokens.find(t=>t.id===def.id);
    const expectedCue=(!t||t.area!==expected.area)?null:expected.supplies.some(x=>x.item===def.id)?'new':expected.carried.some(x=>x.item===def.id)?'carried':null;
    assert.equal(current.arrivalCue(state,def.id),expectedCue,`cue ${def.id}`);
  }
}
assert.equal(routePaths.length,16,'expected recursive route count');
assert.deepEqual(current.validateScenario(scenario),[],'current engine scenario validation');
assert.deepEqual(baseline.validateScenario(scenario),[],'baseline engine scenario validation');
for(const file of routePaths)for(const width of [320,360,600]) {
  const route=path.relative(path.join(candidate,'routes'),file),actions=JSON.parse(fs.readFileSync(file,'utf8'));
  context={route,width,actionIndex:null,action:null,phase:'initialization'};
  const row={route,width,routeSha256:shaFile(file),expectedActions:actions.length,acceptedActions:0,physicalStateComparisons:0,complete:false,advances:0,chapterTransitions:0,sameWorkstationTransitions:0,workstationChanges:0,currentSaveChecks:0,baselineSaveChecks:0,oldSaveCompatibilityChecks:0,newSupplies:0,carriedEntries:0,cueStateChecks:0,transitions:[]};
  try {
    let a=baseline.createGame(scenario,width),b=current.createGame(scenario,width);
    assert.deepEqual(stripGame(b),a,'initial full game parity');row.physicalStateComparisons++;
    let observed=checkArrival(null,b.state,true);row.initialArrival=structuredClone(b.state.arrival);
    checkCues(b.state,observed.expected);row.cueStateChecks++;
    for(let i=0;i<actions.length;i++){
      const action=actions[i];context={route,width,actionIndex:i+1,action,phase:'action replay'};
      const before=b.state;
      const ar=baseline.applyAction(scenario,a,action),br=current.applyAction(scenario,b,action);
      assert(ar.accepted,`baseline rejected: ${ar.message}`);assert(br.accepted,`current rejected: ${br.message}`);
      a=ar.game;b=br.game;row.acceptedActions++;
      assert.deepEqual(withoutArrival(b.state),a.state,'physical state parity after action');row.physicalStateComparisons++;
      assert.deepEqual(b.events.at(-1),a.events.at(-1),'event parity after action');
      if(action.type==='advance'){
        row.advances++;context.phase='advance provenance';
        if(before.stage!==b.state.stage){
          row.chapterTransitions++;observed=checkArrival(before,b.state);
          assert.deepEqual(b.events.at(-1).transfers??[],observed.physicalTransfers,'event transfers equal actual area changes');
          const sameWorkstation=scenario.stages[before.stage].area.id===scenario.stages[b.state.stage].area.id;
          const transition={actionIndex:i+1,fromStage:before.stage,toStage:b.state.stage,fromArea:before.currentArea,toArea:b.state.currentArea,sameWorkstation,arrival:structuredClone(b.state.arrival),actualNewDiscoveryIds:b.state.discovered.filter(id=>!before.discovered.includes(id)),actualPhysicalTransfers:observed.physicalTransfers};
          if(sameWorkstation){
            row.sameWorkstationTransitions++;
            assert.equal(b.state.currentArea,before.currentArea,'same-workstation stage destination/current-area continuity');
            assert.equal(JSON.stringify(b.state.tokens),JSON.stringify(before.tokens),'same-workstation token array byte identity');
            for(const key of ['places','areas','discovered','openedCaches'])assert.equal(JSON.stringify(b.state[key]),JSON.stringify(before[key]),`same-workstation ${key} identity`);
            assert.deepEqual(b.state.arrival.supplies,[],'same-workstation no new supplies');assert.deepEqual(b.state.arrival.carried,[],'same-workstation no carried items');
            for(const t of b.state.tokens)assert.equal(current.arrivalCue(b.state,t.id),null,'same-workstation no new/carried cues');
            transition.tokenArraySha256Before=shaBytes(JSON.stringify(before.tokens));transition.tokenArraySha256After=shaBytes(JSON.stringify(b.state.tokens));
          }else row.workstationChanges++;
          row.newSupplies+=observed.expected.supplies.length;row.carriedEntries+=observed.expected.carried.length;
          row.transitions.push(transition);
        }else {
          assert(b.state.completed,'non-transition advance must finish journey');
          assert.deepEqual(b.state.arrival,before.arrival,'completion preserves chapter arrival');
        }
        context.phase='save restore after advance';
        assert.deepEqual(current.restore(scenario,JSON.stringify(b)),b,'current exact save round trip');row.currentSaveChecks++;
        assert.deepEqual(baseline.restore(scenario,JSON.stringify(a)),a,'baseline exact save round trip');row.baselineSaveChecks++;
        assert.deepEqual(current.restore(scenario,JSON.stringify(a)),a,'baseline saves load unchanged in current engine');row.oldSaveCompatibilityChecks++;
        assert.deepEqual(stripGame(b),a,'all current/history state + events parity at advance');
      }else assert.deepEqual(b.state.arrival,observed.expected,'non-advance arrival snapshot remains stable');
      context.phase='cue truth after action';checkCues(b.state,observed.expected);row.cueStateChecks++;
    }
    context.phase='final completion';assert(a.state.completed&&b.state.completed,'both engines complete');assert.equal(b.state.areas.length,10);assert.equal(row.advances,20);assert.equal(row.chapterTransitions,19);assert.equal(row.sameWorkstationTransitions,10);assert.equal(row.workstationChanges,9);
    assert.deepEqual(stripGame(b),a,'final entire save physical/history/event parity');
    row.complete=true;row.finalPhysicalStateSha256=shaBytes(JSON.stringify(withoutArrival(b.state)));row.finalMetrics=b.state.metrics;
  }catch(error){row.failure={...context,message:error.message,stack:error.stack};failures.push(row.failure);}
  rows.push(row);console.log(`${row.complete?'PASS':'FAIL'} ${route}@${width} ${row.acceptedActions}/${row.expectedActions} actions`);
}
const changedInputs=inputManifest.filter(x=>shaFile(x.path)!==x.sha256);
const liveHeadAfter=head();
if(changedInputs.length)failures.push({phase:'input immutability',message:'One or more source inputs changed during verification',changedInputs});
if(liveHeadAfter!==metadata.liveHeadBefore)failures.push({phase:'HEAD immutability',message:'Live HEAD changed during verification',before:metadata.liveHeadBefore,after:liveHeadAfter});
const sum=k=>rows.reduce((n,x)=>n+x[k],0);
const result={
  status:failures.length?'FAIL':'PASS',...metadata,finishedAt:new Date().toISOString(),liveHeadAfter,
  scenarioId:scenario.id,scenarioTitle:scenario.title,scenarioCounts:{items:scenario.items.length,recipes:scenario.recipes.length,stages:scenario.stages.length,workstations:new Set(scenario.stages.map(s=>s.area.id)).size},
  totals:{routeVariants:routePaths.length,widths:[320,360,600],routeWidthRuns:rows.length,completedRuns:rows.filter(x=>x.complete).length,actionsAcrossEnginesPerRun:2,acceptedActionsPerEngine:sum('acceptedActions'),acceptedActionsAcrossBothEngines:2*sum('acceptedActions'),physicalStateComparisons:sum('physicalStateComparisons'),advanceActions:sum('advances'),chapterTransitions:sum('chapterTransitions'),sameWorkstationTransitions:sum('sameWorkstationTransitions'),workstationChanges:sum('workstationChanges'),currentSaveChecks:sum('currentSaveChecks'),baselineSaveChecks:sum('baselineSaveChecks'),oldSaveCompatibilityChecks:sum('oldSaveCompatibilityChecks'),actualNewSupplyEntries:sum('newSupplies'),actualCarriedEntries:sum('carriedEntries'),cueStateChecks:sum('cueStateChecks')},
  method:['Independent script imports the current and frozen baseline engines directly, not existing candidate tests or validators.', 'Compare every initial and post-action state after stripping only optional arrival metadata; compare event equality after every action and entire save/history equality after every advance and at completion.', 'Derive new supplies from actual discovered deltas with unique newly-opened cache provenance, and carried entries from actual before/after token area changes.', 'Verify all item cue outputs against independently observed chapter-entry deltas after every action.', 'Same-workstation chapter handoffs require identical JSON token-array bytes, unchanged physical containers, and empty supply/carried snapshots and cues.', 'Round-trip both engines and load baseline saves in current engine after every advance, including final completion.'],
  limits:['Source-only deterministic runtime replay at widths 320, 360, 600; no browser/UI tests, no UI-readability inference, no human playtest.', 'No full application build, deployment, or integration verification; this remains a local isolated candidate.', 'Route coverage is exactly the 16 supplied JSON route variants; no exhaustive arbitrary-action/undo/resizing/fuzz or corrupted-save tests.', 'Script writes evidence only under its own review directory; no source edits, git mutations, or publication.'],
  inputFilesUnchanged:changedInputs.length===0,liveHeadUnchanged:liveHeadAfter===metadata.liveHeadBefore,inputManifest,failures,runs:rows
};
fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(result,null,2)+'\n');
const shortRows=rows.map(({transitions,initialArrival,...r})=>r);
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({...result,inputManifest:undefined,runs:shortRows},null,2)+'\n');
console.log(JSON.stringify({status:result.status,totals:result.totals,failures},null,2));
if(failures.length)process.exitCode=1;
