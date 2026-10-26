/** Cheap challenge screening. Every policy has complete rules and full goal information.
 * These are independent abstract models, not browser players or enjoyment evidence.
 */
type Cell = [number,number];
type Shape = Cell[];
const rng=(seed:number)=>{let s=seed>>>0;return ()=>{s=(s+0x6d2b79f5)>>>0;let t=Math.imul(s^(s>>>15),1|s);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};};
const sum=(xs:number[])=>xs.reduce((a,b)=>a+b,0);
const norm=(s:Shape):Shape=>{const x=Math.min(...s.map(p=>p[0])),y=Math.min(...s.map(p=>p[1]));return s.map(p=>[p[0]-x,p[1]-y] as Cell).sort((a,b)=>a[1]-b[1]||a[0]-b[0]);};
const shapeKey=(s:Shape)=>norm(s).map(p=>p.join(',')).join(';');
function rotations(s:Shape):Shape[]{const seen=new Map<string,Shape>();let t=s;for(let i=0;i<4;i++){t=norm(t);seen.set(shapeKey(t),t);t=t.map(([x,y])=>[-y,x]);}return [...seen.values()];}
const canonical=(s:Shape):Shape=>rotations(s).sort((a,b)=>shapeKey(a).localeCompare(shapeKey(b)))[0];
const canonKey=(s:Shape)=>shapeKey(canonical(s));
const touches=(a:Shape,b:Shape)=>a.some(p=>b.some(q=>Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])===1));
const shift=(s:Shape,x:number,y:number):Shape=>s.map(p=>[p[0]+x,p[1]+y]);
const intersects=(a:Shape,b:Shape)=>{const cells=new Set(a.map(p=>p.join(',')));return b.some(p=>cells.has(p.join(',')));};
type Join = {pair:[number,number];output:Shape;key:string};
type JState = Shape[];
const harder=process.argv.includes('--hard');
const INITIAL:JState=harder?
  [[[0,0],[1,0],[0,1]],[[0,0],[1,0],[0,1]],[[0,0],[1,0]],[[0,0],[1,0]]]:
  [[[0,0],[1,0]],[[0,0],[1,0]],[[0,0],[1,0],[0,1]],[[0,0]]];
const stateKey=(s:JState)=>s.map(canonKey).sort().join('|');
const joinCache=new Map<string,Shape[]>();
function joins(a:Shape,b:Shape):Shape[]{
  const cacheKey=[canonKey(a),canonKey(b)].sort().join('|');const cached=joinCache.get(cacheKey);if(cached)return cached;
  const outputs=new Map<string,Shape>();
  for(const aa of rotations(a))for(const bb of rotations(b)){
    // Align one cell of B beside one cell of A. This covers every edge contact.
    for(const ac of aa)for(const bc of bb)for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){
      const moved=shift(bb,ac[0]+dx-bc[0],ac[1]+dy-bc[1]);if(intersects(aa,moved))continue;
      const out=canonical([...aa,...moved]);const width=Math.max(...out.map(p=>p[0]))+1,height=Math.max(...out.map(p=>p[1]))+1;
      if(width<=5&&height<=5)outputs.set(canonKey(out),out);
    }
  }
  const result=[...outputs.values()].sort((a,b)=>canonKey(a).localeCompare(canonKey(b)));joinCache.set(cacheKey,result);return result;
}
function jActions(s:JState):Join[]{
  const actions=new Map<string,Join>();
  for(let i=0;i<s.length;i++)for(let j=i+1;j<s.length;j++)for(const output of joins(s[i],s[j])){
    const a:Join={pair:[i,j],output,key:[canonKey(s[i]),canonKey(s[j])].sort().join('+')+'>'+canonKey(output)};
    const after=stateKey(jStep(s,a));if(!actions.has(after))actions.set(after,a);
  }return [...actions.values()];
}
function jStep(s:JState,a:Join):JState{return [...s.filter((_,i)=>!a.pair.includes(i)),a.output].map(canonical).sort((a,b)=>canonKey(a).localeCompare(canonKey(b)));}
type Placement={mask:number;shape:Shape};
function placements(piece:Shape,target:Shape):Placement[]{
  const cells=new Map(target.map((p,i)=>[p.join(','),i]));const result=new Map<number,Placement>();
  const width=Math.max(...target.map(p=>p[0]))+1,height=Math.max(...target.map(p=>p[1]))+1;
  for(const r of rotations(piece))for(let x=0;x<width;x++)for(let y=0;y<height;y++){
    const moved=shift(r,x,y);let mask=0,valid=true;
    for(const c of moved){const index=cells.get(c.join(','));if(index===undefined){valid=false;break;}mask|=1<<index;}
    if(valid)result.set(mask,{mask,shape:moved});
  }return [...result.values()];
}
function tiling(s:JState,target:Shape):Placement[]|null{
  const opts=s.map(p=>placements(p,target));if(opts.some(p=>p.length===0))return null;
  const order=s.map((_,i)=>i).sort((a,b)=>opts[a].length-opts[b].length);const answer:Placement[]=[];
  function visit(at:number,used:number):boolean{
    if(at===order.length)return true;
    const i=order[at];for(const p of opts[i])if(!(p.mask&used)){answer[i]=p;if(visit(at+1,used|p.mask))return true;}return false;
  }return visit(0,0)?answer:null;
}
function jPlanner(s:JState,target:Shape):Join|null{
  const solution=tiling(s,target);if(!solution)return null;
  for(let i=0;i<s.length;i++)for(let j=i+1;j<s.length;j++)if(touches(solution[i].shape,solution[j].shape)){
    const output=canonical([...solution[i].shape,...solution[j].shape]);return {pair:[i,j],output,key:[canonKey(s[i]),canonKey(s[j])].sort().join('+')+'>'+canonKey(output)};
  }return null;
}
function fitScore(shape:Shape,target:Shape):number{
  const exact=placements(shape,target);if(exact.length)return shape.length*10;
  let best=0;const cellSet=new Set(target.map(p=>p.join(',')));
  for(const r of rotations(shape))for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++)best=Math.max(best,shift(r,x,y).filter(p=>cellSet.has(p.join(','))).length);
  return best*10-(shape.length-best)*20;
}
type GeometryCase={id:string;target:Shape};
// Fixed stock, twelve different visible silhouettes. Generation constructs only
// connected shapes within5×5, then removes rotational duplicates. It does not
// filter cases by policy outcomes or alternative counts.
function geometryCases():GeometryCase[]{
  const cases=new Map<string,Shape>();
  for(let seed=1;cases.size<12&&seed<1000;seed++){
    const random=rng(seed);let s=INITIAL.map(canonical);
    while(s.length>1){const choices=jActions(s);s=jStep(s,choices[Math.floor(random()*choices.length)]);}
    cases.set(canonKey(s[0]),s[0]);
  }
  return [...cases.values()].map((target,i)=>({id:`join-${i+1}`,target}));
}
function jRun(c:GeometryCase,policy:'random'|'greedy'|'planner',opening?:Join){
  const random=rng(Number(c.id.split('-')[1])*811);let s=INITIAL.map(canonical);const actions:Join[]=[];let doomedAt:number|null=null;
  while(s.length>1){
    const legal=jActions(s);let a:Join|null=actions.length===0&&opening?opening:null;
    if(!a){
      if(policy==='random')a=legal[Math.floor(random()*legal.length)];
      if(policy==='greedy')a=legal.map(a=>({a,value:fitScore(a.output,c.target)})).sort((a,b)=>b.value-a.value)[0].a;
      if(policy==='planner')a=jPlanner(s,c.target);
    }
    if(!a)break;s=jStep(s,a);actions.push(a);if(doomedAt===null&&!tiling(s,c.target))doomedAt=actions.length;
  }
  return {case:c.id,policy,win:s.length===1&&canonKey(s[0])===canonKey(c.target),actions:actions.map(a=>({pair:a.pair,output:a.output,key:a.key})),doomedAt};
}

type Counts=Record<string,number>;
type Recipe={id:string;a:string;b:string;out:string};
const CRAFT:Recipe[]=[
  {id:'clay',a:'earth',b:'water',out:'clay'},
  {id:'brick',a:'clay',b:'heat',out:'brick'},
  {id:'glass',a:'sand',b:'heat',out:'glass'},
  {id:'steam',a:'water',b:'heat',out:'steam'},
  {id:'grove',a:'seed',b:'earth',out:'grove'},
  {id:'reeds',a:'seed',b:'water',out:'reeds'},
  {id:'basin',a:'stone',b:'earth',out:'basin'},
  {id:'channel',a:'stone',b:'water',out:'channel'},
  {id:'levee',a:'brick',b:'clay',out:'levee'},
  {id:'pump-glass',a:'glass',b:'steam',out:'pump'},
  {id:'pump-brick',a:'brick',b:'steam',out:'pump'},
];
const STOCK:Counts={earth:4,water:3,heat:2,stone:1,sand:1,seed:1};
const WATER:Counts={reeds:2,basin:2,channel:2,pump:4};
const COVER:Counts={grove:1,brick:2,levee:4};
type AllocationCase={id:string;water:number;cover:number};
const allocationCases:AllocationCase[]=[[2,1],[2,2],[2,3],[2,4],[3,1],[3,2],[3,3],[3,4],[4,1],[4,2],[4,4],[6,1]].map(([water,cover],i)=>({id:`allocate-${i+1}`,water,cover}));
const cKey=(s:Counts)=>Object.entries(s).filter(([,n])=>n>0).sort(([a],[b])=>a.localeCompare(b)).map(([id,n])=>`${id}:${n}`).join('|');
const cActions=(s:Counts)=>CRAFT.filter(r=>(s[r.a]??0)>0&&(s[r.b]??0)>0);
function cStep(s:Counts,r:Recipe):Counts{const n={...s};n[r.a]--;n[r.b]--;n[r.out]=(n[r.out]??0)+1;return n;}
const value=(s:Counts,values:Counts)=>sum(Object.entries(values).map(([id,n])=>(s[id]??0)*n));
const cWin=(s:Counts,c:AllocationCase)=>value(s,WATER)>=c.water&&value(s,COVER)>=c.cover;
function cSolve(initial:Counts,c:AllocationCase):Recipe[]|null{
  const queue:{s:Counts;path:Recipe[]}[]=[{s:initial,path:[]}];const seen=new Set([cKey(initial)]);
  for(let i=0;i<queue.length;i++){
    const {s,path}=queue[i];if(cWin(s,c))return path;
    for(const a of cActions(s)){const n=cStep(s,a),key=cKey(n);if(!seen.has(key)){seen.add(key);queue.push({s:n,path:[...path,a]});}}
  }return null;
}
function cSignature(s:Counts){
  return {capabilities:Object.fromEntries(Object.entries(s).filter(([id,n])=>n>0&&(WATER[id]||COVER[id])).sort(([a],[b])=>a.localeCompare(b))),unusedStock:Object.fromEntries(Object.keys(STOCK).sort().map(id=>[id,s[id]??0]))};
}
function cRun(c:AllocationCase,policy:'random'|'greedy'|'planner',opening?:Recipe){
  const random=rng(Number(c.id.split('-')[1])*127);let s={...STOCK};const actions:string[]=[];
  while(!cWin(s,c)){
    const legal=cActions(s);if(!legal.length)break;let a=actions.length===0&&opening?opening:null;
    if(!a&&policy==='random')a=legal[Math.floor(random()*legal.length)];
    if(!a&&policy==='greedy')a=legal.map(a=>{const n=cStep(s,a);return {a,value:Math.min(c.water,value(n,WATER))+Math.min(c.cover,value(n,COVER))};}).sort((a,b)=>b.value-a.value)[0].a;
    if(!a&&policy==='planner')a=cSolve(s,c)?.[0]??null;
    if(!a)break;s=cStep(s,a);actions.push(a.id);
  }
  return {case:c.id,policy,win:cWin(s,c),actions,final:cSignature(s)};
}
function cTerminals(c:AllocationCase){
  const queue=[{...STOCK}],seen=new Set([cKey(STOCK)]),endings=new Map<string,Counts>();
  for(let i=0;i<queue.length;i++){
    const s=queue[i];if(cWin(s,c)){endings.set(JSON.stringify(cSignature(s)),s);continue;}
    for(const a of cActions(s)){const n=cStep(s,a),key=cKey(n);if(!seen.has(key)){seen.add(key);queue.push(n);}}
  }return [...endings.values()];
}

const geometry=geometryCases();const jOpenings=jActions(INITIAL.map(canonical));
const geometryDetails=geometry.map(c=>{
  const openings=jOpenings.map(a=>({key:a.key,locallyFits:placements(a.output,c.target).length>0,viable:!!tiling(jStep(INITIAL.map(canonical),a),c.target)}));
  return {...c,openingCount:openings.length,viableOpeningShapes:openings.filter(a=>a.viable).length,locallyPlausibleDoomed:openings.filter(a=>a.locallyFits&&!a.viable).length,openings};
});
let geometryReversal:unknown=null;
let globalCompletionReversal:unknown=null;
for(let i=0;i<geometryDetails.length&&!geometryReversal;i++)for(let j=i+1;j<geometryDetails.length&&!geometryReversal;j++){
  const a=geometryDetails[i],b=geometryDetails[j];const first=a.openings.find(o=>o.viable&&!b.openings.find(p=>p.key===o.key)!.viable);const second=b.openings.find(o=>o.viable&&!a.openings.find(p=>p.key===o.key)!.viable);
  if(first&&second)geometryReversal={sameStock:INITIAL,contextA:{id:a.id,target:a.target,preferredOpening:first.key,rejectedOpening:second.key},contextB:{id:b.id,target:b.target,preferredOpening:second.key,rejectedOpening:first.key},meaning:'The visible target geometry reverses opening feasibility; this is not a preference/enjoyment rating.'};
}
for(let i=0;i<geometryDetails.length&&!globalCompletionReversal;i++)for(let j=i+1;j<geometryDetails.length&&!globalCompletionReversal;j++){
  const a=geometryDetails[i],b=geometryDetails[j];
  const first=a.openings.find(o=>o.viable&&o.locallyFits&&b.openings.find(p=>p.key===o.key)!.locallyFits&&!b.openings.find(p=>p.key===o.key)!.viable);
  const second=b.openings.find(o=>o.viable&&o.locallyFits&&a.openings.find(p=>p.key===o.key)!.locallyFits&&!a.openings.find(p=>p.key===o.key)!.viable);
  if(first&&second)globalCompletionReversal={sameStock:INITIAL,contextA:{id:a.id,target:a.target,winningOpening:first.key,doomedOpening:second.key},contextB:{id:b.id,target:b.target,winningOpening:second.key,doomedOpening:first.key},meaning:'Both joined shapes individually fit both visible targets. Only the ability to place the remaining pieces reverses; this tests global completion beyond immediate outline matching.'};
}
const geometryRuns=geometry.flatMap(c=>(['random','greedy','planner'] as const).map(p=>jRun(c,p)));
const universalOpeningCoverage=Math.max(...jOpenings.map(o=>geometryDetails.filter(c=>c.openings.find(x=>x.key===o.key)!.viable).length));

const allocationDetails=allocationCases.map(c=>{
  const best=cSolve(STOCK,c);const openings=cActions(STOCK).map(a=>{const rest=cSolve(cStep(STOCK,a),c);return {recipe:a.id,viable:rest!==null,totalFusions:rest?rest.length+1:null};});
  const terminals=cTerminals(c);
  const minimumTerminals=terminals.filter(s=>sum(Object.values(STOCK))-sum(Object.values(s))===best?.length);
  return {...c,minimumFusions:best?.length??null,minimumPlan:best?.map(a=>a.id)??null,viableOpenings:openings.filter(o=>o.viable).length,recoverableSuboptimalOpenings:openings.filter(o=>o.viable&&o.totalFusions!>best!.length).length,terminalCapabilityAndResourceSignatures:terminals.length,minimumFusionTerminalSignatures:minimumTerminals.length,openings};
});
let allocationReversal:unknown=null;
for(let i=0;i<allocationDetails.length&&!allocationReversal;i++)for(let j=i+1;j<allocationDetails.length&&!allocationReversal;j++){
  const a=allocationDetails[i],b=allocationDetails[j];const first=a.openings.find(o=>o.viable&&!b.openings.find(p=>p.recipe===o.recipe)!.viable);const second=b.openings.find(o=>o.viable&&!a.openings.find(p=>p.recipe===o.recipe)!.viable);
  if(first&&second)allocationReversal={sameStock:STOCK,contextA:{id:a.id,water:a.water,cover:a.cover,preferredOpening:first.recipe,rejectedOpening:second.recipe},contextB:{id:b.id,water:b.water,cover:b.cover,preferredOpening:second.recipe,rejectedOpening:first.recipe},meaning:'Competing visible needs reverse feasibility with exactly the same supplies and recipes. This is a coarse capability-budget model, not a world simulation.'};
}
const allocationRuns=allocationCases.flatMap(c=>(['random','greedy','planner'] as const).map(p=>cRun(c,p)));
const summaries=(runs:{policy:string;win:boolean;actions:unknown[]}[])=>['random','greedy','planner'].map(policy=>{const rs=runs.filter(r=>r.policy===policy);return {policy,n:rs.length,wins:rs.filter(r=>r.win).length,meanFusions:sum(rs.map(r=>r.actions.length))/rs.length};});
const result={experiment:harder?'challenge-screen-2-denser-stock':'challenge-screen-1',knowledge:'All rules, supplies, goals and every legal join/recipe are available. Policies have implementation access. Mechanical diagnostics only, not blind play or fun judgments.',
  geometry:{model:`Rigid polyomino fusion; rotations allowed; every edge-adjacent, non-overlapping join legal within5×5 bound. Goal silhouette uses all${sum(INITIAL.map(s=>s.length))} cells.`,initial:INITIAL,cases:geometryDetails,summary:summaries(geometryRuns),runs:geometryRuns,contextReversal:geometryReversal,globalCompletionReversal,bestSingleOpeningCoverage:{cases:universalOpeningCoverage,n:geometry.length},forwardRecovery:'A component that cannot tile the target cannot be unjoined by later fusions. Recovery requires Undo; do not call this forward recovery.',
    limits:['Targets generated from the fixed stock; twelve rotation-distinct connected shapes, no policy-outcome filtering.','Exact-cover planner is privileged; a complete tiling implies an edge-fusion continuation for a connected target.','Winning final outlines are necessarily identical; different interleavings are not counted as expressive outcomes.','A target may be a familiar jigsaw with one insight; enjoyment and visual obviousness need browser/human inspection.']},
  allocation:{model:'Finite consumable materials; explicit recipe hypergraph; visible water/cover capability requirements. No production timers.',initial:STOCK,recipes:CRAFT,waterValues:WATER,coverValues:COVER,cases:allocationDetails,summary:summaries(allocationRuns),runs:allocationRuns,contextReversal:allocationReversal,
    limits:['Capability values abstract away actual world effects. This can be a shopping-list puzzle rather than an engaging situation.','Terminal signatures group resulting capabilities and unused stock, not recipe order.','Some shortest solutions repeatedly make Clay; inspect physical repetition before retaining the economy.','Cases intentionally vary competing needs with fixed supplies; this is not a population or statistical sample.']},
  recommendation:'Prototype geometry-sensitive joining first. It puts the decision inside the protected gesture. Use exact previews and Undo; test whether a locally tempting join changes future fit. Keep finite allocation as a reserve; reject it if its planning is only a mandatory shopping list. Process maturation is sketched/rejected before implementation because the small version needs filler mixes or a forced bread chain.',
};
console.log(JSON.stringify(result,null,2));
export {};
