import test from 'node:test';
import assert from 'node:assert/strict';
import { BOARDS, createState, preview, apply, goalSatisfied, solved } from '../experiments/logical-ideas-history-provenance.ts';
import type { State, Action, Goal } from '../experiments/logical-ideas-history-provenance.ts';
const at=(n:number):State=>({...createState(),board:n,ideas:structuredClone(BOARDS[n].ideas)});
function take(s:State,op:Action['op'],a:string,b:string){const action={op,a,b};const p=preview(s,action);const r=apply(s,action);return {state:r.state,id:p.existing??p.idea.id,idea:p.idea};}

test('review: self and copied observations do not corroborate',()=>{
 const s=at(1);assert.deepEqual(preview(s,{op:'compare',a:'field',b:'field'}).idea.claims,{});
 assert.deepEqual(preview(s,{op:'compare',a:'field',b:'copy'}).idea.claims,{});
});
test('review: collection keeps alternatives, explicit comparison builds joined support',()=>{
 let s=at(1);const collect=take(s,'collect','field','garden');s=collect.state;
 const exact={...BOARDS[1].goals[0],members:['ash','glass','reed','salt','stone']};
 assert.equal(goalSatisfied(s,exact),false);
 assert.deepEqual(s.ideas.find(i=>i.id===collect.id)!.claims.reed,[['field-reed'],['garden-reed']]);
 const compared=take(s,'compare','field','garden');assert.equal(solved(compared.state),true);
 assert.deepEqual(compared.idea.claims.reed,[['field-reed','garden-reed']]);
});
test('review: overlapping compound proofs cannot be compared as independent',()=>{
 const first=take(at(1),'compare','field','garden');
 assert.deepEqual(preview(first.state,{op:'compare',a:first.id,b:'field'}).idea.claims,{});
 assert.deepEqual(preview(first.state,{op:'compare',a:first.id,b:first.id}).idea.claims,{});
});
test('review: goal support branches and scope typing are distinct',()=>{
 let s=at(0);assert.equal(solved(s),false);
 const good=take(s,'apply','notebook','observations');s=good.state;
 assert.equal(solved(s),true);
 const g=BOARDS[0].goals[0];assert.equal(goalSatisfied(s,{...g,support:'any'}),true);
 assert.equal(goalSatisfied(s,{...g,support:'independent'}),false);
 assert.equal(goalSatisfied(s,{...g,original:'editor'}),false);
 const onlyScopes={...s,ideas:s.ideas.filter(i=>i.kind==='scope')};
 assert.equal(goalSatisfied(onlyScopes,{...g,support:'any'}),false);
});
test('review: equal membership with different evidence remains distinct',()=>{
 const s=at(1);const compared=take(s,'compare','field','garden');
 const collected=take(compared.state,'collect','field','garden');
 const custom=structuredClone(collected.state);custom.ideas.push({id:'common',label:'common scope',kind:'scope',domain:'claim',claims:{reed:[[]],stone:[[]],glass:[[]]},expression:'common',parents:[]});
 const filtered=preview(custom,{op:'apply',a:collected.id,b:'common'});
 assert.equal(filtered.existing,null);
 assert.deepEqual(Object.keys(filtered.idea.claims),Object.keys(compared.idea.claims));
 assert.notDeepEqual(filtered.idea.claims,compared.idea.claims);
});
test('review: translation retains roots and cannot forge same-subject agreement',()=>{
 let s=at(2);const left=take(s,'translate','structure','vocabulary');s=left.state;
 const right=take(s,'translate','growth','vocabulary');s=right.state;
 assert.deepEqual(preview(s,{op:'compare',a:left.id,b:left.id}).idea.claims,{});
 const late=take(s,'compare',left.id,right.id);
 assert.deepEqual(Object.keys(late.idea.claims),['thin']);
 const early=take(at(2),'compare','structure','growth');
 const thenTranslate=take(early.state,'translate',early.id,'vocabulary');
 assert.deepEqual(late.idea.claims,thenTranslate.idea.claims);
});
test('review: clinic correspondence must allow genuine collection/practice comparison',()=>{
 const s=at(3);const translated=take(s,'translate','collection','catalogue');
 const compared=take(translated.state,'compare',translated.id,'practice');
 const core=take(compared.state,'apply',compared.id,'core');
 assert.equal(goalSatisfied(core.state,BOARDS[3].goals[0]),true,
  'Public subject correspondence must reconcile specimen IDs with observation names without creating new roots.');
});
test('review: preview exactly predicts accepted transition and leaves parents intact',()=>{
 const s=at(1),action:Action={op:'compare',a:'field',b:'garden'};
 const p=preview(s,action),r=apply(s,action);assert.equal(r.accepted,true);
 assert.deepEqual(r.state.ideas.at(-1),p.idea);
 assert.deepEqual(r.state.ideas.slice(0,s.ideas.length),s.ideas);
 assert.equal(r.state.moves,s.moves+1);
});
test('review: combining every account by collection is not universal certification',()=>{
 for(let n=1;n<BOARDS.length;n++){
  let s=at(n);const accounts=s.ideas.filter(i=>i.kind==='account');
  for(const domain of [...new Set(accounts.map(i=>i.domain))]){
   const compatible=accounts.filter(i=>i.domain===domain);let id=compatible[0].id;
   for(const next of compatible.slice(1)){const x=take(s,'collect',id,next.id);s=x.state;id=x.id;}
  }
  for(const g of BOARDS[n].goals.filter(g=>g.support==='independent'))assert.equal(goalSatisfied(s,g),false);
 }
});
test('review: aggregate self-comparison legitimately combines disjoint alternatives',()=>{
 let s=at(5);let aggregate=take(s,'collect','field','garden');s=aggregate.state;
 aggregate=take(s,'collect',aggregate.id,'bench');s=aggregate.state;
 const maximal=take(s,'compare',aggregate.id,aggregate.id);s=maximal.state;
 assert.deepEqual(Object.keys(maximal.idea.claims),['ash','clay','glass','reed','salt','stone']);
 const structural=take(s,'apply',maximal.id,'structure');s=structural.state;
 assert.equal(goalSatisfied(s,BOARDS[5].goals[1]),true);
 const portable=take(s,'apply',maximal.id,'portable');s=portable.state;
 const teaching=take(s,'translate',portable.id,'lessons');s=teaching.state;
 assert.equal(goalSatisfied(s,BOARDS[5].goals[2]),true);
 assert.equal(goalSatisfied(s,BOARDS[5].goals[0]),false);
 const faithful=take(s,'apply','field','portable');
 assert.equal(solved(faithful.state),true);
 assert.equal(faithful.state.moves,7);
});
