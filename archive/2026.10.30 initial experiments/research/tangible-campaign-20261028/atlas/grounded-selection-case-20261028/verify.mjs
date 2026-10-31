import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {M,L} from '../revision-v5-baghdad-calculation/runtime.mjs';
import {visibleView,execute} from '../revision-v5-baghdad-calculation/strict-surface.mjs';
const root=import.meta.dirname,baseRoot=root+'/../revision-v5-baghdad-calculation';
const read=p=>JSON.parse(fs.readFileSync(p)),base=read(baseRoot+'/scenario.json'),s=read(root+'/scenario.json'),chapters=read(baseRoot+'/chapters.json'),c=chapters[21];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const item=id=>s.items.find(x=>x.id===id),surface=id=>item(id).label+'\n'+(item(id).reading?.text??'');
const results=[];function check(name,fn){fn();results.push({name,status:'PASS'});console.log('PASS '+name);}
const recipes=new Map(s.recipes.map(x=>[x.id,x]));
const act=(g,a)=>{const r=M.applyAction(s,g,a);assert.ok(r.accepted,`${r.message}: ${JSON.stringify(a)}`);return r.game;};
const combine=(g,r,reverse=false)=>act(g,{type:'combine',a:reverse?r.b:r.a,b:reverse?r.a:r.b});
const ready=g=>chapters[g.state.stage].recipes.map(id=>recipes.get(id)).filter(r=>!g.state.discovered.includes(r.out)&&[r.a,r.b].every(id=>g.state.tokens.some(t=>t.id===id&&t.area===g.state.currentArea)));
const enter=()=>{let g=M.createGame(s);for(const a of read(baseRoot+'/author-route.json')){if(g.state.stage===21)return g;g=act(g,a);}throw Error('No clean arrival');};
check('Exact supplied base hash and unchanged candidate IDs/counts',()=>{assert.equal(hash(baseRoot+'/scenario.json'),'af8f8f4a01fc854bbe3a21868883cf1bab175164528e491b01b8b6d1b78268c8');for(const k of ['items','recipes','stages'])assert.deepEqual(s[k].map(x=>x.id),base[k].map(x=>x.id));assert.equal(s.sources.length,base.sources.length+2);});
check('Schema, lifecycle, objective flow, construction continuity',()=>assert.deepEqual([...M.validateScenario(s),...L.validateContentLifecycles([s]),...L.validateObjectiveFlow([s]),...L.validateConstructionContinuity([s])],[]));
check('Only chapter 22 local item/recipe prose, stage presentation and two added sources differ',()=>{
 const localItems=new Set([...c.created,...c.supplies]),localRecipes=new Set(c.recipes);
 for(const i of base.items)if(!localItems.has(i.id))assert.deepEqual(item(i.id),i,i.id);
 for(const r of base.recipes){const x=recipes.get(r.id);if(!localRecipes.has(r.id))assert.deepEqual(x,r,r.id);for(const k of new Set([...Object.keys(x),...Object.keys(r)]))if(!['description','sources'].includes(k))assert.deepEqual(x[k],r[k],`${r.id}.${k}`);}
 for(let n=0;n<base.stages.length;n++){if(n!==21)assert.deepEqual(s.stages[n],base.stages[n]);else {const a=structuredClone(s.stages[n]),b=structuredClone(base.stages[n]);delete a.motivation;delete b.motivation;delete a.caches[0].narrative;delete b.caches[0].narrative;delete a.objectives[0].text;delete b.objectives[0].text;assert.deepEqual(a,b);}}
 assert.deepEqual(s.sources.slice(0,base.sources.length),base.sources);
 for(const k of Object.keys(base))if(!['items','recipes','stages','sources'].includes(k))assert.deepEqual(s[k],base[k]);
});
check('Separate coherent cohorts, equal births, unequal recruitment and 25-point change',()=>{
 const v=read(root+'/case-values.json'),P=v.parents,F=P.fasterPairs,S=P.slowerPairs,n=P.adultsPerPair,B=v.birthsPerPair,R=v.recruitsPerPair,E=v.expected;
 assert.equal(F*n,E.parentsFaster);assert.equal(S*n,E.parentsSlower);assert.equal(F*B,E.birthsFaster);assert.equal(S*B,E.birthsSlower);assert.equal(F*R.faster,E.recruitsFaster);assert.equal(S*R.slower,E.recruitsSlower);
 const before=F*n/(F*n+S*n),after=F*R.faster/(F*R.faster+S*R.slower);assert.equal(before,.5);assert.equal(after,.75);assert.equal((after-before)*100,25);assert.equal(F*n+S*n,F*R.faster+S*R.slower);
 assert.match(surface('offspring-record'),/Each pup is counted once/);assert.match(surface('generation-series'),/No original adults/);assert.match(surface('inheritance-record'),/Stipulate/);assert.match(surface('inheritance-record'),/not inferred from photographs or from resemblance alone/);
 for(const [id,text]of [['population-change','10/20 = 50%'],['population-change','15/20 = 75%'],['differential-reproduction','Birth output is equal: 4 pups'],['testable-evolution-case','random sampling (drift)'],['selection-account','More births alone and more time alone are insufficient']])assert.ok(surface(id).includes(text),`${id}:${text}`);
});
check('Visible text exposes the counterclaim, independence and contributions of earlier ideas',()=>{
 for(const [id,re]of [['wallace-essay',/domestic varieties tending to revert/],['wallace-essay',/independently/],['extended-geological-time',/time alone selects nothing/],['struggle-condition',/Excess offspring supplies a constraint/],['testable-evolution-case',/water investigation/],['descent-book',/moral or policy rule/]])assert.match(surface(id),re);
 assert.ok(s.sources.some(x=>x.id==='darwin-origin-wolves-primary'));assert.ok(s.sources.some(x=>x.id==='wallace-varieties-primary'));
});
check('Actual entry is replayed through chapters 1–21; supplied earlier items are not invented',()=>{const g=enter();for(const id of c.earlier)assert.ok(M.token(g.state,id),id);for(const id of c.created)assert.ok(!M.token(g.state,id),id);assert.equal(g.state.stage,21);});
const branchOrders=[
 ['make-extended-geological-time','make-struggle-condition','make-documented-variation','make-heritable-variation'],
 ['make-documented-variation','make-heritable-variation','make-struggle-condition','make-extended-geological-time'],
 ['make-struggle-condition','make-documented-variation','make-extended-geological-time','make-heritable-variation']
];
const tail=['make-differential-reproduction','make-population-change','make-selection-account','make-parallel-contributions','make-testable-evolution-case','make-descent-book'];
check('Three branch orders, both drag directions, unchanged later advance',()=>{for(const order of branchOrders)for(const reverse of[false,true]){let g=enter();for(const id of[...order,...tail])g=combine(g,recipes.get(id),reverse);assert.ok(M.stageComplete(s,g.state));for(const id of c.created)assert.ok(M.token(g.state,id),id);g=act(g,{type:'advance'});assert.equal(g.state.stage,22);}});
check('Omitting any earlier contribution prevents the terminal argument, without changing the graph',()=>{for(const missing of c.earlier){let g=enter();g.state.tokens=g.state.tokens.filter(t=>t.id!==missing);while(ready(g).length)g=combine(g,ready(g)[0]);assert.ok(!M.stageComplete(s,g.state),missing);assert.ok(!M.token(g.state,'descent-book'));}});
check('Highlight is available and non-mutating; readings do not expose generic descriptions',()=>{
 let g=enter(),before=structuredClone(g);const h=execute(M,s,g,'highlight',['variation-specimens']);assert.ok(h.response.highlighted.some(x=>x.id==='photographic-archive'));assert.deepEqual(h.game,before);
 const poisoned=structuredClone(s);for(const x of poisoned.items)x.description='PRIVATE_DESCRIPTION_SENTINEL';for(const x of poisoned.recipes)x.description='PRIVATE_DESCRIPTION_SENTINEL';assert.ok(!JSON.stringify(visibleView(M,poisoned,g)).includes('PRIVATE_DESCRIPTION_SENTINEL'));
 const rd=execute(M,poisoned,g,'read',['inheritance-record']);assert.match(rd.response.reading.text,/Stipulate/);assert.deepEqual(rd.game,g);assert.ok(!JSON.stringify(rd.response).includes('PRIVATE_DESCRIPTION_SENTINEL'));
});
let graph;
check('Every projected reachable chapter 22 state completes, including reverse combinations',()=>{
 const key=g=>JSON.stringify({made:g.state.discovered.filter(id=>c.created.includes(id)).sort(),tokens:g.state.tokens.filter(t=>t.area===g.state.currentArea).map(t=>({id:t.id,parts:[...(t.components??[])].sort(),inc:[...(t.incorporated??[])].sort()})).sort((a,b)=>a.id.localeCompare(b.id))});
 const q=[enter()],seen=new Map([[key(q[0]),0]]),edges=[],terminal=new Set();let transitions=0;
 for(let n=0;n<q.length;n++){const g=q[n];edges[n]=[];if(M.stageComplete(s,g.state)){terminal.add(n);continue;}const choices=ready(g);assert.ok(choices.length);for(const r of choices)for(const reverse of[false,true]){const out=combine(g,r,reverse),k=key(out);if(!seen.has(k)){seen.set(k,q.length);q.push(out);}edges[n].push(seen.get(k));transitions++;}}
 const reachable=new Set(terminal);let changed=true;while(changed){changed=false;for(let n=0;n<q.length;n++)if(!reachable.has(n)&&edges[n].some(k=>reachable.has(k))){reachable.add(n);changed=true;}}
 assert.equal(reachable.size,q.length);graph={states:q.length,transitions,terminalStates:terminal.size,allReachCompletion:true};
});
const routes=[];
check('Twenty full author-known randomized routes preserve all downstream completion contracts',()=>{
 for(let seed=1;seed<=20;seed++){let rseed=seed,g=M.createGame(s);const random=()=>{rseed=(Math.imul(rseed,1664525)+1013904223)>>>0;return rseed/2**32;};for(let st=0;st<s.stages.length;st++){while(!M.stageComplete(s,g.state)){const choices=ready(g);assert.ok(choices.length,`deadlock ${st}`);const r=choices[Math.floor(random()*choices.length)],reverse=random()<.5;if(r.at)g=act(g,{type:'place',item:reverse?r.a:r.b,location:r.at});g=combine(g,r,reverse);}g=act(g,{type:'advance'});}assert.ok(g.state.completed);routes.push({seed,combinations:g.state.metrics.combinations,completed:g.state.completed});}
});
const report={kind:'Author-known logical/content diagnostics only; not source-blind gameplay, browser/UI QA, fun or retention evidence',baseSha256:hash(baseRoot+'/scenario.json'),candidateSha256:hash(root+'/scenario.json'),checks:results,projectedChapter22Graph:graph,fullRoutes:routes,untested:['UI/browser/layout','reader discoverability','fresh-player voluntary continuation','human enjoyment/learning outcomes'],highlightPolicy:'Normal highlight exploration is intended gameplay; no penalty or enjoyment metric is inferred from its use.'};
fs.writeFileSync(root+'/verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({checks:results.length,graph,routes:routes.length,hash:report.candidateSha256},null,2));
