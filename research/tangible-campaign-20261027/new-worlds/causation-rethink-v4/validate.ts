import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createGame,applyAction,dropAction,playerView,validateScenario,checkpoint,stageComplete,objectiveStates} from '../../frozen/v4/engine/model.ts';
const dir=import.meta.dirname,s=JSON.parse(fs.readFileSync(dir+'/causation.json','utf8'));
assert.deepEqual(validateScenario(s),[]);
let g=createGame(s),actions:any[]=[],trace:any[]=[],checkpoints:any[]=[];let maxVisible=0;
const record=()=>{const v=playerView(s,g);maxVisible=Math.max(maxVisible,v.things.length);return v;};
const cp=(id:string)=>{checkpoints.push({id,label:s.stages[g.state.stage].title,actions:structuredClone(actions)});trace.push({checkpoint:id,view:record()});};
const act=(a:any,gesture:any=null)=>{const r=applyAction(s,g,a);assert.ok(r.accepted,JSON.stringify({a,message:r.message}));g=r.game;actions.push(a);trace.push({gesture,action:a,message:r.message,transfers:g.events.at(-1)?.transfers,view:record()});};
const drop=(a:string,b:string)=>act(dropAction(s,g.state,a,b),{a,b});
cp('chapter-1');
for(const [a,b] of [['cord','cart'],['timber','broad-layout'],['adze','broad-frame'],['pitch','brush'],['caulking-brush','broad-hull'],['poles','sealed-ferry']])drop(a,b);
assert.equal(stageComplete(s,g.state),false,'An unused boat cannot fulfill the end');
const beforeUse=structuredClone(g);
drop('ferry','@landing');assert.equal(stageComplete(s,g.state),true,'Suitable deployment represents the compressed crossing');
assert.equal(stageComplete(s,g.state),true);act({type:'advance'});cp('chapter-2');
const packed=playerView(s,g).things.map(x=>x.id).sort();assert.deepEqual(packed,['adze','caulking-brush','cord','poles','timber'].sort());
for(const [a,b] of [['cord','@reed-mouth'],['timber','slim-layout'],['adze','slim-frame'],['caulking-brush','slim-hull'],['poles','sealed-skiff']])drop(a,b);
assert.equal(stageComplete(s,g.state),false);drop('skiff','@reed-mouth');assert.equal(stageComplete(s,g.state),true);act({type:'advance'});assert.equal(g.state.completed,true);
s.checkpoints=checkpoints;fs.writeFileSync(dir+'/causation.json',JSON.stringify(s,null,2)+'\n');for(const c of checkpoints){const replay=checkpoint(s,c.id);assert.equal(replay.state.stage,c.id==='chapter-1'?0:1);}
// Counterfactual legal travel: bring the completed ferry physically from its old area.
let wrong=checkpoint(s,'chapter-2');for(const a of [{type:'visit',area:'yard'},{type:'visit',area:'reeds',carry:['ferry']},{type:'place',item:'ferry',location:'reed-mouth'}]){const r=applyAction(s,wrong,a as any);assert.ok(r.accepted,r.message);wrong=r.game;}
const wrongDrop=dropAction(s,wrong.state,'ferry','@reed-mouth');assert.equal(wrongDrop.type,'place');assert.equal(stageComplete(s,applyAction(s,wrong,wrongDrop).game.state),false);
const bad=applyAction(s,wrong,{type:'combine',a:'ferry',b:'@reed-mouth'});assert.equal(bad.accepted,false);assert.equal(stageComplete(s,bad.game.state),false);
// A mere measured plan must not perform the trip; wood and work remain required.
const planOnly=applyAction(s,beforeUse,{type:'combine',a:'cart',b:'broad-layout'});assert.equal(planOnly.accepted,false);
const evidence={engine:'frozen/v4/engine/model.ts',validation:validateScenario(s),completed:g.state.completed,recipes:s.recipes.length,combinations:g.state.metrics.combinations,maxVisibleItems:maxVisible,packedScene2:packed,checks:['All 11 recipes traversed with v4 dropAction','Both legal checkpoints replay','No goal from built boat alone','Only the suitable boat at its exact mission location satisfies deployment','Only five current-scene things packed','Broad ferry legally retrieved and placed at reed mouth cannot rescue fisher','Plan alone cannot carry cart'],wrongBoat:{gestureResolution:wrongDrop,dropCompletesGoal:false,explicitCombineAccepted:bad.accepted,message:bad.message},limits:'Author-aware reachability and semantic assertion tests; not a fresh-player trial, visual UI test or evidence of enjoyment.',actions,trace};
fs.writeFileSync(dir+'/route-evidence.json',JSON.stringify(evidence,null,2)+'\n');
fs.writeFileSync(dir+'/pre-use-and-discoveries.json',JSON.stringify({initialView:trace[0].view,scene2View:trace.find(x=>x.checkpoint==='chapter-2').view,discoveries:trace.filter(x=>x.message).map(x=>({gesture:x.gesture,text:x.message}))},null,2)+'\n');
console.log(JSON.stringify({...evidence,trace:undefined,actions:undefined},null,2));
