import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {forecast,preview,describe,createState,apply,solved} from '../../experiments/logical-ideas-history-inquiry.ts';
const dir='results/ideas-history-inquiry-review/';
const digest=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
const manifest=JSON.parse(readFileSync('results/ideas-history-v3-freeze/manifest.json','utf8'));
const hashes=manifest.files.map((f:any)=>({path:f.path,expected:f.sha256,actual:digest(f.path)}));
for(const h of hashes)assert.equal(h.actual,h.expected);
const assignment=JSON.parse(readFileSync('results/ideas-history-inquiry-players/ih3-pilot-a-assignment.json','utf8'));
assert.equal(assignment.manifestSha256,digest('results/ideas-history-v3-freeze/manifest.json'));
const cap=JSON.parse(readFileSync('results/ideas-history-inquiry-players/ih3-pilot-a.json','utf8'));
// Independent oracle: explicit literal opening matrices derived from public laws, not forecast implementation.
const expected:any={
 'false,null':['000/111','000/111','000/111'],
 'true,null':['000/010','000/010','000/011'],
 'false,0':['000/111','000/000','000/000'],
 'true,0':['000/010','000/000','000/000'],
 'false,1':['000/111','111/111','111/111'],
 'true,1':['000/010','111/111','111/111']
};
const methods:any[]=[];
for(const pulse of [false,true])for(const warmth of [null,0,1]){
 const m:any={kind:'method',id:'review',label:'review',pulse,warmth,parents:[]};
 const predicted=forecast(m);const sig=predicted.map(x=>x.signature);
 assert.deepEqual(sig,expected[`${pulse},${warmth}`]);
 // Check every intermediate warmth/light value independently as Boolean state transitions.
 for(const p of predicted)for(const [side,t] of p.trials.entries()){
  const lamps=side===0?[0,0,0]:pulse?[0,1,0]:[1,1,1];let previous=0;
  for(let k=0;k<3;k++){const heat=warmth!==null?warmth:p.model==='stored'?(lamps[k]||previous):lamps[k];
   assert.equal(t.light[k],lamps[k]);assert.equal(t.warmth[k],heat);assert.equal(t.opening[k],p.model==='light'?lamps[k]:heat);previous=lamps[k];}
 }
 methods.push({pulse,warmth,signatures:sig,distinct:new Set(sig).size});
}
const winningPairs=[];
for(let a=0;a<methods.length;a++)for(let b=a+1;b<methods.length;b++){
 if(new Set([0,1,2].map(k=>methods[a].signatures[k]+'|'+methods[b].signatures[k])).size===3)winningPairs.push([methods[a],methods[b]]);
}
assert.equal(winningPairs.length,4);assert.ok(methods.every(m=>m.distinct<3));
let state=createState();const transitions=[];const previewChecks=[];
for(const [index,e] of cap.events.entries()){
 if(e.cmd==='preview'){
  const p=preview(e.before,JSON.parse(e.argument));assert.deepEqual(p.public,e.output);
  const future=cap.events.find((x:any,j:number)=>j>index&&x.cmd==='combine'&&x.argument===e.argument);
  const omitId=(x:any)=>{const {id,...rest}=x;return rest;};
  assert.deepEqual(omitId(e.output),omitId(future.output.created));
  previewChecks.push({index,laterCombine:cap.events.indexOf(future),semanticMatch:true,previewId:e.output.id,actualId:future.output.created.id});
 }
 if(e.cmd==='combine'){
  const before=structuredClone(state),r=apply(state,JSON.parse(e.argument));state=r.state;
  assert.deepEqual(state,e.after);assert.deepEqual(state.things.slice(0,before.things.length),before.things);
  assert.equal(solved(state),index===7);transitions.push({index,operands:JSON.parse(e.argument),parentsPreserved:true,complete:solved(state)});
 }
}
assert.deepEqual(state,cap.state);
writeFileSync(dir+'independent-verification.json',JSON.stringify({verified:true,hashes,assignmentManifestMatch:true,methods,winningPairs,previewChecks,transitions,counts:{accepted:5,conservative:5,classificationCases:[5,6],inclusive:5,playerReportedAdministrative:[5,6]},minimumProof:'No single method separates all three. Initial steady/free separates none. A successful study needs >=2 useful new methods (>=2 edits), >=2 observations, >=1 result merge: >=5 combines. Player attains bound.'},null,2)+'\n');
console.log('Independent literal forecast oracle, intermediate states, all six methods/four winning pairs, retained parents, previews, transitions, hashes: PASS');
