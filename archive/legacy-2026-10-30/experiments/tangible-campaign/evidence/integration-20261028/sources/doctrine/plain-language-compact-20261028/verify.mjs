import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
import * as M from '/workspace/shared/combination-fork-recovery-20261028/experiments/tangible-campaign/engine/model.ts';
import * as L from '/workspace/shared/combination-fork-recovery-20261028/experiments/tangible-campaign/schema/lifecycle.ts';
import {scenario as live} from '/workspace/shared/combination-fork-recovery-20261028/experiments/tangible-campaign/ui/campaigns/doctrine-images-cases.ts';
import {execute} from '../images-dispute-research-20261028/candidate-v2-copy1/pinned-surface.mjs';
const P=new URL('.',import.meta.url),read=f=>JSON.parse(fs.readFileSync(new URL(f,P),'utf8')),write=(f,x)=>fs.writeFileSync(new URL(f,P),JSON.stringify(x,null,2)+'\n');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const s=read('compact-candidate.json'),prior=read('selective-predecessor.json'),original=JSON.parse(fs.readFileSync(new URL('../plain-language-prototype-20261028/snapshot/original-candidate.json',P),'utf8')),labels=read('authored-compact-labels.json');
assert.deepEqual(live,original,'live51 content must be the original control');
const textProjection=d=>{const x=structuredClone(d);delete x.id;for(const i of x.items){delete i.label;delete i.description;if(i.reading){delete i.reading.text;delete i.reading.attribution;}}for(const st of x.stages){delete st.motivation;for(const o of st.objectives)delete o.text;}return x;};
assert.deepEqual(textProjection(s),textProjection(original));assert.deepEqual(textProjection(s),textProjection(prior));
const diff=(a,b,p='')=>{if(JSON.stringify(a)===JSON.stringify(b))return [];if(!a||!b||typeof a!=='object'||typeof b!=='object')return [p];return [...new Set([...Object.keys(a),...Object.keys(b)])].flatMap(k=>diff(a[k],b[k],p+'/'+k));};
const allowed=new Set(['/id','/stages/1/motivation','/stages/1/objectives/1/text','/stages/2/objectives/0/text','/stages/3/motivation','/stages/3/objectives/0/text','/stages/3/objectives/1/text']);
for(const [n,i]of s.items.entries())if(labels[i.id])for(const suffix of ['label','description','reading/text','reading/attribution'])allowed.add('/items/'+n+'/'+suffix);
const diffs=diff(original,s);assert(diffs.every(p=>allowed.has(p)),diffs.filter(p=>!allowed.has(p)).join('\n'));
assert.deepEqual(s.items.map(i=>!!i.reading),original.items.map(i=>!!i.reading),'Read availability unchanged');
assert.deepEqual(M.validateScenario(s),[]);for(const f of [L.validateContentLifecycles,L.validateObjectiveFlow,L.validateConstructionContinuity])assert.deepEqual(f([s]),[]);
const noPosition=x=>Array.isArray(x)?x.map(noPosition):x&&typeof x==='object'?Object.fromEntries(Object.entries(x).filter(([k])=>!['x','y'].includes(k)).map(([k,v])=>[k,noPosition(v)])):x;
const mechanics=g=>({state:noPosition(g.state),history:noPosition(g.history),events:g.events.map(({message,...e})=>e)});
const partnerIds=p=>({...p,message:undefined,directions:p.directions.map(({text,...x})=>x),settingHelp:undefined});
const goalState=(d,g)=>M.objectiveStates(d,g.state).map(({text,...o})=>o);
let results=[];
for(const cp of s.checkpoints)for(const width of [320,600])for(const reversed of [false,true]){
 const actions=cp.actions.map(a=>reversed&&a.type==='combine'?{...a,a:a.b,b:a.a}:a),g=M.replay(s,actions,width);
 assert.deepEqual(M.restore(s,JSON.stringify(g)),g);
 const visible=g.state.tokens.filter(t=>t.area===g.state.currentArea);let readCount=0;
 for(const t of visible)if(M.item(s,t.kind).reading){const before=JSON.stringify(g),r=execute(M,s,g,'read',[t.id]);assert.equal(JSON.stringify(r.game),before);assert.equal(r.response.progressChanged,false);readCount++;}
 for(const [reference,d]of [['original-live51',original],['selective-predecessor',prior]]){
  const old=M.replay(d,actions,width);assert.deepEqual(mechanics(g),mechanics(old));assert.deepEqual(goalState(s,g),goalState(d,old));
  for(const t of visible)assert.deepEqual(partnerIds(M.partners(s,g.state,t.id)),partnerIds(M.partners(d,old.state,t.id)));
  results.push({reference,checkpoint:cp.id,width,reversed,mechanicsEqual:true,goalFlowEqual:true,partnerIdsEqual:true,restoreExact:true,nonmutatingReads:readCount,combinations:g.state.metrics.combinations,completed:g.state.completed});
 }
}
assert.equal(M.checkpoint(s,'complete').state.metrics.combinations,61);
// Preserve the actual module import contract while comparing its exported data without writing live.
const proposed=fs.readFileSync(new URL('doctrine-images-cases.ts',P),'utf8');assert.deepEqual(JSON.parse(proposed.slice(proposed.indexOf('= {')+2).trim().replace(/;\s*$/,'')),s);
const metrics=d=>d.items.filter(i=>labels[i.id]).map(i=>({id:i.id,label:i.label,words:i.label.trim().split(/\s+/).length,lines:M.itemLabelLines(i.label).length,baseHeight:M.tokenHeight(d,{kind:i.id,slots:{},components:[]})}));
const dimensions={original:metrics(original),selective:metrics(prior),compact:metrics(s)};
assert(Math.max(...dimensions.compact.map(i=>i.lines))<=7,'agreed compact working bound');assert(Math.max(...dimensions.compact.map(i=>i.words))<=12);
const summary=x=>({count:x.length,meanWords:Number((x.reduce((n,i)=>n+i.words,0)/x.length).toFixed(1)),maxWords:Math.max(...x.map(i=>i.words)),maxLines:Math.max(...x.map(i=>i.lines)),maxBaseHeight:Math.max(...x.map(i=>i.baseHeight))});
const protectedInputs=read('protected-inputs.json');for(const [path,h]of Object.entries(protectedInputs))assert.equal(hash(fs.readFileSync(path)),h,path);
write('text-field-differences.json',{fromOriginal:diffs,fromSelective:diff(prior,s)});
write('computed-label-evidence.json',{runtime:'actual live51 model functions, not browser/UI testing',tileWidth:96,lineMeasure:84,summary:Object.fromEntries(Object.entries(dimensions).map(([k,v])=>[k,summary(v)])),dimensions,componentClipping:'Existing 18px nowrap component-row CSS not changed; no claim component labels are fully visible.'});
write('logical-evidence.json',{status:'pass',sourceCommit:'51b6f9f5090c99174997793e49affff24fecd814',candidateSha256:hash(fs.readFileSync(new URL('compact-candidate.json',P))),fullGraphExact:true,totalDesks:12,recipeDefinitions:110,canonicalCombinations:61,pairedCheckpointComparisons:results.length,readAvailabilityUnchanged:true,protectedInputsUnchanged:Object.keys(protectedInputs).length,results});
console.log(JSON.stringify({status:'pass',pairedCheckpointComparisons:results.length,fullGraphExact:true,dimensions:Object.fromEntries(Object.entries(dimensions).map(([k,v])=>[k,summary(v)])),protectedInputsUnchanged:Object.keys(protectedInputs).length},null,2));
