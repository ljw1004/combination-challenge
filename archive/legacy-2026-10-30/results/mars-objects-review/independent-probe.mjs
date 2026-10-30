import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createMarsObjects, legalMarsObjectsActions, marsObjectsWorld, observeMarsObjects, previewMarsObjects, replayMarsObjects, stepMarsObjects } from '../../experiments/logical-mars-objects.ts';
const join = (a,b) => ({type:'combine',a,b});
const hash = p => createHash('sha256').update(readFileSync(p)).digest('hex');
const files = ['experiments/logical-mars-objects.ts','docs/mars-objects-play-protocol.md'];
const initialHashes = Object.fromEntries(files.map(p=>[p,hash(p)]));
const report = { reviewedAt: new Date().toISOString(), evidence:'Independent privileged mechanical checks. No blind player or human enjoyment evidence.', hashes:initialHashes, checks:[], traces:[] };
function oracle(state) {
  const opaque = state.installations.some(a => a.shell?.layers.includes('reflective'));
  const lit = state.installations.filter(a => a.power?.lamp && a.power?.cable && !a.power?.sourceLayers.includes('reflective')).map(a=>a.id);
  const actual = marsObjectsWorld(state);
  assert.equal(actual.camp.enclosed,state.installations.some(a=>a.shell));
  assert.equal(actual.camp.illuminated,!opaque || lit.length>0);
  assert.equal(actual.camp.boundaryTransmits,!opaque);
  assert.deepEqual(actual.camp.interiorSources,[...(!opaque?['sun']:[]),...lit.map(id=>`lamp:${id}`)]);
  assert.equal(actual.observer.receiving,opaque || lit.length>0);
  assert.deepEqual(actual.observer.received.map(r=>r.source), opaque?['sun']:lit.map(id=>`lamp:${id}`));
  assert.equal(actual.rays.length,1+(opaque?0:4*lit.length));
  assert.equal(actual.rays[0].direction,opaque?'north':'east');
  assert.equal(state.status,state.scenarioId==='garden' ? (actual.camp.enclosed && actual.camp.illuminated ? 'won':'playing') : (state.observer.campLocated?'won':'playing'));
}
let previewChecks=0, lawStates=0;
let rng=91827;
const nextRandom=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng;};
for (const catalogue of ['ordinary','complete']) {
  for(let run=0;run<16;run++) {
    let garden=createMarsObjects('garden',{catalogue}), signal=createMarsObjects('signal',{catalogue});
    for(let step=0;step<12;step++) {
      const before=JSON.stringify(garden);
      const legal=legalMarsObjectsActions(garden);
      assert.deepEqual(legalMarsObjectsActions(signal),legal);
      for(const action of legal) {
        const actual=stepMarsObjects(garden,action), forecast=previewMarsObjects(garden,action);
        assert.equal(actual.accepted,true);
        assert.deepEqual(stepMarsObjects(garden,{...action,a:action.b,b:action.a}),actual);
        assert.deepEqual(forecast.installations,actual.installations);
        assert.deepEqual(forecast.world,marsObjectsWorld(actual));
        assert.equal(forecast.status,actual.status);
        oracle(actual); previewChecks++;
      }
      assert.equal(JSON.stringify(garden),before);
      const action=legal[nextRandom()%legal.length];
      garden=stepMarsObjects(garden,action);signal=stepMarsObjects(signal,action);
      assert.deepEqual(marsObjectsWorld(garden),marsObjectsWorld(signal));
      oracle(garden);oracle(signal);lawStates+=2;
    }
  }
}
report.checks.push({name:'Seeded legal branch screen with independent optical/enclosure oracle, goal independence, truthful previews, input purity and operand commutativity',passed:true,seed:91827,previewChecks,lawStates});
function trace(name,actions,scenario='garden',options={catalogue:'complete'}) {
  let state=createMarsObjects(scenario,options); const frames=[{action:null,state:structuredClone(state),world:marsObjectsWorld(state)}];
  for(const action of actions){state=stepMarsObjects(state,action);assert.equal(state.accepted,true);oracle(state);frames.push({action,state:structuredClone(state),world:marsObjectsWorld(state)});}
  assert.deepEqual(replayMarsObjects(actions,scenario,options),state);
  report.traces.push({name,scenario,options,actions,frames,exactReplay:true});return state;
}
const two=trace('Two independent exterior panels in nested opaque shells; each shade removes only one interior source',[
  join('lit-reflective-shell','world:camp'),join('lit-reflective-shell','world:camp'),
  join('reflective-cover','world:solar:1'),join('reflective-cover','world:solar:2')]);
const twoFrames=report.traces.at(-1).frames;
assert.deepEqual(twoFrames[2].world.camp.interiorSources,['lamp:1','lamp:2']);
assert.deepEqual(twoFrames[3].world.camp.interiorSources,['lamp:2']);
assert.equal(two.status,'playing');assert.equal(marsObjectsWorld(two).observer.receiving,true);
report.checks.push({name:'Independent source causality, opaque enclosure retained, sunlight still reflected after both lamps darken',passed:true});
const blueprint=trace('Modified installation remains shaded; a copied canonical blueprint does not inherit shading',[
 join('solar-lead','world:camp'),join('reflective-cover','world:solar:1'),join('lamp','world:lead:1'),join('solar-lamp','world:camp')]);
assert.equal(blueprint.installations[0].builtFrom,'solar-lead');
assert.deepEqual(blueprint.installations[0].power.sourceLayers,['reflective']);
assert.deepEqual(blueprint.installations[1].power.sourceLayers,[]);
assert.deepEqual(marsObjectsWorld(blueprint).camp.interiorSources,['sun','lamp:2']);
report.checks.push({name:'Blueprint reuse and in-world identity are distinct; modified physical constituents retained only in their actual installation',passed:true});
const erasedSignal=trace('Source cutoff stops current reception while observer remembers its first actual ray',[
 join('lit-clear-shell','world:camp'),join('reflective-cover','world:solar:1')],'signal');
assert.equal(marsObjectsWorld(erasedSignal).observer.receiving,false);assert.equal(erasedSignal.status,'won');
assert.deepEqual(erasedSignal.observer.firstReception,report.traces.at(-1).frames[1].state.observer.firstReception);
report.checks.push({name:'Persistent observer knowledge is earned by a real ray and not erased by current source cutoff',passed:true});
const initial=createMarsObjects('garden',{catalogue:'complete'});
const target=stepMarsObjects(initial,join('solar-lead','world:camp'));
const malformed=[null,[],{},'combine',true,Infinity,{type:'combine',a:'frame'},
 {type:'combine',a:'frame',b:'clear-sheet',at:'camp'},
 join('world:camp','world:camp'),join('reflective-cover','world:shell:1'),join('solar-lamp','world:solar:1'),
 join('lamp','world:lead:01'),join('lamp','world:lead:1:extra'),join('lamp','world:lead:999'),
 join('lamp','world:lead:__proto__'),join('reflective-cover','world:solar:constructor')];
for(const action of malformed){const saved=JSON.stringify(target),actual=stepMarsObjects(target,action);assert.equal(actual.accepted,false);const expected=structuredClone(target);expected.accepted=false;expected.response=actual.response;assert.deepEqual(actual,expected);assert.equal(JSON.stringify(target),saved);}
report.checks.push({name:'Malformed and mismatched world operand rejection without physical, knowledge, count or input changes',passed:true,cases:malformed.length});
const observed=observeMarsObjects(target);
observed.installations[0].power.sourceLayers.push('reflective');observed.known.push('lit-clear-shell');observed.world.observer.campLocated=true;
assert.equal(target.installations[0].power.sourceLayers.length,0);assert.equal(target.observer.campLocated,false);
report.checks.push({name:'Public observation does not expose mutable physical state references',passed:true});
const finalHashes=Object.fromEntries(files.map(p=>[p,hash(p)]));
report.stableFilesDuringProbe=JSON.stringify(initialHashes)===JSON.stringify(finalHashes);
report.finalHashes=finalHashes;
writeFileSync('results/mars-objects-review/independent-check.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({checks:report.checks,stableFilesDuringProbe:report.stableFilesDuringProbe,hashes:finalHashes},null,2));
