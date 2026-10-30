import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import * as M from '../../engine/model.ts';
import type {Action,Scenario} from '../../schema/scenario.ts';
import {scenario as atlas} from '../../ui/campaigns/atlas-intellectual-history.ts';
import {scenario as divinity} from '../../ui/campaigns/divinity-disputed-questions.ts';
import {scenario as light} from '../../ui/campaigns/divinity-light-text-workshop.ts';
import {scenario as purpose} from '../../ui/campaigns/purpose-copy-workroom.ts';
import {scenario as food} from '../../ui/campaigns/food-kitchen-caravan.ts';
import {scenario as elements} from '../../ui/campaigns/elements-house-and-craft.ts';
const read=(path:string)=>JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8'));
const rows=[];
for(const [name,s] of [['atlas-intellectual-history',atlas],['divinity-disputed-questions',divinity],['divinity-light-text-workshop',light],['purpose-copy-workroom',purpose],['food-kitchen-caravan',food],['elements-house-and-craft',elements]] as [string,Scenario][]){
 const old:Scenario=read('./predecessor/'+name+'.scenario.json');
 const route:Action[]=read(s===atlas?'../../evidence/intellectual-worlds-20261028/atlas-author-route.json':'../../evidence/'+s.id+'-route-evidence.json').actionsLog;
 let a=M.createGame(old),b=M.createGame(s);let handoffs=0;
 for(const action of route){
  const before=M.applyAction(old,a,action),after=M.applyAction(s,b,action);assert(before.accepted&&after.accepted);a=before.game;b=after.game;
  if(action.type==='advance'){const local=(g:M.Game)=>g.state.tokens.filter(t=>t.area===g.state.currentArea).map(t=>t.kind).sort();assert.deepEqual(local(b),local(a),s.id+'/'+s.stages[b.state.stage].id);handoffs++;}
  a.history=[];b.history=[];
 }
 assert(a.state.completed&&b.state.completed);rows.push({world:s.id,handoffs,changedLocalItemSets:0});
}
writeFileSync(new URL('./evidence/canonical-arrivals.json',import.meta.url),JSON.stringify({status:'PASS',scope:'Canonical logical local inventory sets at every chapter advance; not visual layout',rows},null,2)+'\n');
console.log('PASS canonical local arrival inventory: all six worlds unchanged');
