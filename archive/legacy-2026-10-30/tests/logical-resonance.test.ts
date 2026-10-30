import test from 'node:test';
import assert from 'node:assert/strict';
import {createResonance,stepResonance,previewResonance,observeResonance,resonanceAvailability,resonanceCycles,resonanceKey,resonanceOutcome,resonanceQuietChain,replayResonance,screenResonance} from '../experiments/logical-resonance.ts';
import type {State,PlaceId,Direction,Polarity} from '../experiments/logical-resonance.ts';
const place=(s:State,id:PlaceId)=>s.places.find(p=>p.id===id)!;
function crossing(left:Polarity='+',right:Polarity='+'){
  const s=createResonance();s.pulses=[];s.echoes=[];s.known=[];
  for(const p of s.places){p.form='soil';p.ports=[];p.scar=[];p.recovery=0;delete p.gate;}
  for(const [id,ports]of [['A2',['east']],['B2',['north','east','south','west']],['C2',['west']],['B1',['south']],['B3',['north']]] as [PlaceId,Direction[]][]){place(s,id).form='conductor';place(s,id).ports=ports;}
  s.pulses=[{at:'A2',polarity:left,ingress:['west']},{at:'C2',polarity:right,ingress:['east']}];return s;
}
test('the existing four-place creation keeps its exact phase and one reusable capability after complete cycles',()=>{
  const s=createResonance(),after=stepResonance(s,{type:'wait',beats:12});
  assert.equal(resonanceCycles(s)[0].period,4);
  assert.equal(resonanceKey(after),resonanceKey(s));
  assert.equal(after.known.length,1);
});
test('a concrete short construction reaches a valid quiet ending without elective coupling',()=>{
  const s=replayResonance(resonanceQuietChain('-'));
  assert.equal(resonanceOutcome(s).properties.initialAim,true);
  assert.deepEqual(resonanceCycles(s).map(c=>c.period),[4,6]);
  assert.equal(stepResonance(s,{type:'finish'}).status,'won');
  assert.throws(()=>stepResonance(createResonance(),{type:'finish'}),/six-place/);
});
test('preview is immutable and exact; ingredient and place discovery agree',()=>{
  const s=createResonance(),before=structuredClone(s),a=resonanceQuietChain()[0];
  assert.deepEqual(previewResonance(s,a),observeResonance(stepResonance(s,a)));
  assert.deepEqual(s,before);
  assert.equal(resonanceAvailability(s,{a:'memory',b:'stone',at:'A3'}).length,0);
  assert.equal(resonanceAvailability(s,{item:'memory',at:'B2'}).filter(a=>a.b==='stone').length,1);
});
test('same-polarity ties leave an ambiguous catalyst; cancellation preserves the older directional scar',()=>{
  let s=crossing();s=stepResonance(s,{type:'wait'});
  assert.deepEqual(place(s,'B2').scar,['east','west']);
  assert.equal(s.pulses.length,1);
  assert.throws(()=>stepResonance(s,{type:'combine',a:'memory',b:'stone',at:'B2'}),/single successful ingress/);
  let opposite=crossing('+','-');place(opposite,'B2').scar=['north'];opposite=stepResonance(opposite,{type:'wait'});
  assert.deepEqual(place(opposite,'B2').scar,['north']);
  assert.equal(opposite.pulses.length,0);
  assert.equal(opposite.response.some(e=>e.kind==='annihilation'),true);
});
test('refractory rejection happens before collision, and a new local diode rejects the other direction',()=>{
  let s=crossing('+','-');place(s,'B2').recovery=1;place(s,'B2').scar=['north'];s=stepResonance(s,{type:'wait'});
  assert.equal(s.response.filter(e=>e.kind==='recovery-reject').length,2);
  assert.equal(s.response.some(e=>e.kind==='annihilation'),false);
  assert.deepEqual(place(s,'B2').scar,['north']);
  let diode=crossing();place(diode,'B2').scar=['west'];
  diode=stepResonance(diode,{type:'combine',a:'memory',b:'stone',at:'B2'});
  assert.equal(place(diode,'B2').gate,'west');
  assert.deepEqual(diode.pulses.find(p=>p.at==='B2')!.ingress,['west']);
  assert.equal(diode.response.some(e=>e.kind==='diode-reject'&&e.from?.[0]==='east'),true);
});
test('echo keeps its built direction and delays the return until its predecessor has recovered',()=>{
  let s=crossing();s.pulses=[s.pulses[0]];place(s,'B2').scar=['west'];
  s=stepResonance(s,{type:'combine',a:'memory',b:'water',at:'B2'});
  assert.equal(place(s,'B2').gate,'west');
  s=stepResonance(s,{type:'wait'});
  assert.equal(s.echoes.length,1);
  assert.equal(s.pulses.some(p=>p.at==='A2'),false);
  s=stepResonance(s,{type:'wait'});
  assert.equal(s.pulses.some(p=>p.at==='A2'),true);
  assert.equal(s.response.some(e=>e.kind==='echo-return'),true);
  let other=crossing();other.pulses=[{at:'B1',polarity:'+',ingress:['north']}];place(other,'B2').scar=['west'];
  other=stepResonance(other,{type:'combine',a:'memory',b:'water',at:'B2'});
  assert.deepEqual(place(other,'B2').scar,['north']);
  assert.equal(place(other,'B2').gate,'west');
});
test('a real passage supplies a whole-form catalyst, orientation and footprint; remembering does not invent local history',()=>{
  let s=createResonance();const form=s.known[0].id;
  assert.equal(resonanceAvailability(s,{a:form,b:'memory',at:'B3'}).length,0);
  s=stepResonance(s,{type:'combine',a:'earth',b:'water',at:'B3',ports:['north']});
  s=stepResonance(s,{type:'combine',a:'earth',b:'water',at:'B2',ports:['north','south','west']});
  s=stepResonance(s,{type:'wait'});
  assert.deepEqual(place(s,'B3').scar,['north']);
  const action=resonanceAvailability(s,{a:form,b:'memory',at:'B3'})[0];assert.ok(action);
  s=stepResonance(s,action);
  assert.equal(place(s,'A3').form,'conductor');
  assert.deepEqual(place(s,'A3').scar,['north','east']);
  assert.deepEqual(s.response.find(e=>e.kind==='coalescence'&&e.at==='A3')!.from,place(s,'A3').scar);
  assert.equal(s.response.some(e=>e.kind==='form-combination'&&e.detail?.includes('rotated 2')),true);
  assert.equal(s.known.some(f=>f.id===form),true);
});
test('phase changes interference without a scarce waiting allowance; replay and preview screens remain exact',()=>{
  const screen=screenResonance();
  assert.equal(screen.purePreview,true);assert.equal(screen.replayExact,true);assert.equal(screen.finish,'won');
  assert.equal(screen.couplings.find(c=>c.phase===0)!.trace.some(e=>e.kind==='annihilation'),true);
  assert.equal(screen.couplings.find(c=>c.phase===3)!.trace.some(e=>e.kind==='annihilation'),false);
});
