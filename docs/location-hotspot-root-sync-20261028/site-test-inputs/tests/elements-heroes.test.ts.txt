// Source/headless evidence only; not a native browser or delight claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {Action} from '../experiments/tangible-campaign/schema/scenario.ts';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import {scenario as raw} from '../experiments/tangible-campaign/ui/campaigns/elements-house-and-craft.ts';
import {applyMilestones,campaignMilestones} from '../experiments/tangible-campaign/ui/campaign-milestones.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
const s=applyMilestones(raw);
const ids=['plant','wheel','grain-mill','iron','sailboat','printed-invitations','microscope','soap','clock'];
const indices=[5,27,37,64,74,112,132,161,182];
const actionIndices=[6,30,41,74,85,129,152,186,211];
const evidence=JSON.parse(readFileSync(new URL('../experiments/tangible-campaign/evidence/'+s.id+'-route-evidence.json',import.meta.url),'utf8'));
const actions:Action[]=evidence.actionsLog;
const selection=JSON.parse(readFileSync(new URL('../experiments/tangible-campaign/reviews/elements-heroes-v2/selection.json',import.meta.url),'utf8'));
const restore=(g:M.Game,compact=false)=>M.restore(s,compact?JSON.stringify(decodeSave(encodeSave({game:g,tops:{},seen:[]})).game):JSON.stringify(g));
function apply(g:M.Game,a:Action){const r=M.applyAction(s,g,a);assert(r.accepted,JSON.stringify(a));return r.game;}
function drain(g:M.Game){const seen:string[]=[];for(let m=M.pendingMilestone(s,g);m;m=M.pendingMilestone(s,g)){seen.push(m.id);g=M.acknowledgeMilestone(s,g,m.id);}return {g,seen};}

test('expanded Elements pins nine meaningful actual outputs distributed through the197-combination route',()=>{
 assert.deepEqual(s.milestones!.map(m=>m.item),ids);assert.deepEqual(s.milestones!.map(m=>m.when),ids.map(()=>'created'));
 assert.deepEqual(selection.milestones.map((m:any)=>m.combinationIndex),indices);
 assert.deepEqual(selection.milestones.map((m:any)=>m.actionIndex),actionIndices);
 assert.deepEqual(selection.milestones.map(({id,item,title,text}:any)=>({id,item,title,text})),s.milestones!.map(({id,item,title,text})=>({id,item,title,text})));
 assert.equal(selection.canonicalCombinations,197);assert.equal(selection.chapters,s.stages.length);
 for(const [i,m]of s.milestones!.entries()){
  assert.equal(m.id,'elements-'+ids[i]);assert(!m.text.includes('—'));assert(m.text.split(/\s+/).length<=30);
  const it=s.items.find(x=>x.id===m.item)!;assert(it);assert.equal(it.slots?.filter(x=>x.required).length??0,0,'do not celebrate unfinished slot shells');
  assert(s.recipes.some(r=>r.out===m.item));
  // Frozen selection counts predate the exact printed-invitations/mailboat alias.
  const acceptedAddedUses:Record<string,number>={'sailboat':1,'printed-invitations':1};
  assert.equal(selection.milestones[i].directRecipeUses+(acceptedAddedUses[m.item]??0),s.recipes.filter(r=>r.a===m.item||r.b===m.item).length);
 }
 assert(indices.every((n,i)=>!i||n-indices[i-1]>=10));assert(indices.at(-1)!>=180);
 assert.deepEqual(Object.keys(campaignMilestones).sort(),['elements-house-and-craft-v1','mars-connected-survival-v4-return-cargo-research']);
 assert.equal(campaignMilestones['mars-connected-survival-v4-return-cargo-research'].length,3);
 assert(!s.milestones!.some(m=>['juice','house','feast-table','river-atlas'].includes(m.item)));
});

test('canonical route earns all nine at exact creation indices; each hero also accepts reversed operands',()=>{
 {
  let g=M.createGame(s),combination=0;const earned:{id:string,combination:number,action:number}[]=[];
  for(const [i,original]of actions.entries()){
   const a=original;
   if(a.type==='combine')combination++;
   const before=g;g=apply(g,a);
   for(const event of g.state.milestones??[])if(!before.state.milestones?.some(m=>m.id===event.id)){
    const def=s.milestones!.find(m=>m.id===event.id)!;assert.equal(g.events.at(-1)!.created,def.item);assert(M.token(g.state,def.item));
    assert.equal(a.type,'combine');if(a.type==='combine'){const reversed=apply(before,{...a,a:a.b,b:a.a});assert(reversed.state.milestones!.some(m=>m.id===event.id));assert(M.token(reversed.state,def.item));}
    earned.push({id:event.id,combination,action:i+1});
   }
  }
  assert(g.state.completed);assert.equal(combination,197);
  assert.deepEqual(earned,ids.map((id,i)=>({id:'elements-'+id,combination:indices[i],action:actionIndices[i]})));
  assert.deepEqual(drain(g).seen,ids.map(id=>'elements-'+id));
 }
});

test('queued nine rewards survive JSON/compact save in order; acknowledgements never repeat',()=>{
 const completed=M.replay(s,actions);
 for(const compact of [false,true]){
  let g=restore(completed,compact);const seen:string[]=[];
  while(M.pendingMilestone(s,g)){
   const id=M.pendingMilestone(s,g)!.id;seen.push(id);g=M.acknowledgeMilestone(s,g,id);g=restore(g,compact);
   assert.equal(M.acknowledgeMilestone(s,g,id),g,'stale acknowledgement does not eat the next reward');
  }
  assert.deepEqual(seen,ids.map(id=>'elements-'+id));assert.equal(M.pendingMilestone(s,restore(g,compact)),null);
 }
});

test('each actual hero has honest Undo/reset semantics, not chapter-bound reward delivery',()=>{
 let g=M.createGame(s);
 for(const a of actions){
  g=apply(g,a);const pending=M.pendingMilestone(s,g);if(!pending)continue;
  const undone=M.undo(g).game;assert.equal(M.pendingMilestone(s,undone),null);
  const reearned=apply(undone,a);assert.equal(M.pendingMilestone(s,reearned)!.id,pending.id);
  g=M.acknowledgeMilestone(s,g,pending.id);
  const replayed=apply(M.undo(g).game,a);assert.equal(M.pendingMilestone(s,replayed),null);
  assert(replayed.milestonesSeen?.includes(pending.id));
 }
 assert.equal(g.milestonesSeen!.length,9);assert.equal(M.pendingMilestone(s,M.createGame(s)),null);
});

test('upgrading Plant-only or metadata-free saves creates no retroactive backlog and future heroes still fire',()=>{
 for(const plantOnly of [false,true]){
  const old={...raw,...plantOnly?{milestones:[s.milestones![0]]}:{}};
  for(const [i,n]of actionIndices.entries()){
   let oldGame=M.replay(old,actions.slice(0,n));
   if(plantOnly&&M.pendingMilestone(old,oldGame))oldGame=M.acknowledgeMilestone(old,oldGame,'elements-plant');
   for(const compact of [false,true]){
    let g=restore(oldGame,compact);assert.equal(M.pendingMilestone(s,g),null,`no backlog after historical ${ids[i]}`);
    assert.deepEqual(g.state.discovered,oldGame.state.discovered);
    if(i+1<actionIndices.length){
     for(const a of actions.slice(n,actionIndices[i+1]))g=apply(g,a);
     assert.equal(M.pendingMilestone(s,g)!.id,'elements-'+ids[i+1]);
    }
   }
  }
 }
 const pendingPlant=M.replay({...raw,milestones:[s.milestones![0]]},actions.slice(0,actionIndices[2]));
 assert.deepEqual(drain(restore(pendingPlant,true)).seen,['elements-plant'],'existing pending Plant survives, new historical wheel/mill do not appear');
});

test('all current Elements debug checkpoints stay historical after expanded metadata and compact restore',()=>{
 for(const cp of s.checkpoints??[]){const g=M.checkpoint(s,cp.id);assert.equal(M.pendingMilestone(s,g),null,cp.id);assert.equal(M.pendingMilestone(s,restore(g,true)),null,cp.id);}
});
