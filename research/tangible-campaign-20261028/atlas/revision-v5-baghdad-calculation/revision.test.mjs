import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import crypto from'node:crypto';
import {M,L}from'./runtime.mjs';import {s,chapters,act,route,ready}from'./evaluate.mjs';import {visibleView,execute}from'./strict-surface.mjs';
const base=JSON.parse(fs.readFileSync(new URL('base-v4-scenario.json',import.meta.url))),bc=JSON.parse(fs.readFileSync(new URL('base-v4-chapters.json',import.meta.url))),c=chapters[3],localItems=new Set([...bc[3].created,...bc[3].supplies]),localRecipes=new Set(bc[3].recipes);
const item=id=>s.items.find(i=>i.id===id),visible=id=>item(id).label+'\n'+(item(id).reading?.text??''),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function enter(){let g=M.createGame(s);for(const a of JSON.parse(fs.readFileSync(new URL('author-route.json',import.meta.url)))){if(g.state.stage===3)return g;g=act(g,a);}throw Error('No arrival');}
const combine=(g,a,b)=>act(g,{type:'combine',a,b});
function authored(g,ids=c.recipes){for(const id of ids){const q=s.recipes.find(q=>q.id===id);g=combine(g,q.a,q.b);}return g;}
test('schema, event-local lifecycles, objective progression and construction continuity validate',()=>assert.deepEqual([...M.validateScenario(s),...L.validateContentLifecycles([s]),...L.validateObjectiveFlow([s]),...L.validateConstructionContinuity([s])],[]));
test('v4, strict longitudinal packet, all47 stopped commands and prior evidence remain unchanged',()=>{for(const[p,h]of Object.entries(JSON.parse(fs.readFileSync(new URL('preserved-evidence-manifest.json',import.meta.url)))))assert.equal(hash(p),h,p);});
test('only chapter4 local content changes; all28 other stages/items/recipes and inherited inputs remain exact',()=>{
 for(const i of base.items)if(!localItems.has(i.id))assert.deepEqual(item(i.id),i,i.id);
 for(const q of base.recipes)if(!localRecipes.has(q.id))assert.deepEqual(s.recipes.find(x=>x.id===q.id),q,q.id);
 for(let n=0;n<base.stages.length;n++)if(n!==3){assert.deepEqual(s.stages[n],base.stages[n]);assert.deepEqual(chapters[n],bc[n]);}
 assert.equal(s.items.length,base.items.length-1);assert.equal(s.recipes.length,base.recipes.length-1);assert.ok(!item('balanced-operation'));assert.equal(c.recipes.length,8);
});
test('all14 local things expose actual attributed readings; outputs show claims or calculation results',()=>{
 for(const id of [...c.created,...c.supplies]){assert.ok(item(id).reading?.text.length>30,id);assert.match(item(id).reading.attribution,/Invented|Authored|Modern/);}
 for(const[id,part]of[['compared-witness','AC≠BC'],['arabic-proof','AC=BC'],['decimal-procedure','13−7=6'],['written-equation','x²+6x=40'],['completed-square','(x+3)²=x²+6x+9'],['square-construction','40+9=49'],['checked-solution','16+24=40'],['algebra-method','second side y=2']])assert.ok(item(id).label.includes(part),id);
});
test('primary context distinguishes invented positive-length plots and copied error from historical wording',()=>{
 assert.match(item('algebra-method').reading.attribution,/not a historical quotation/);assert.match(item('algebra-method').reading.attribution,/ten roots equal to thirty-nine/);assert.match(item('syriac-witness').reading.attribution,/not a surviving/);assert.match(visible('algebra-method'),/positive lengths, not every signed or complex root/);
 assert.ok(s.sources.some(x=>x.id==='khwarizmi-square-primary'));assert.ok(s.sources.some(x=>x.id==='euclid-common-notions'));
});
test('invented copied conclusion really disagrees with the inherited triangle, and the repair preserves the rejected line',()=>{
 assert.match(visible('syriac-witness'),/AC=AB and BC=AB/);assert.match(visible('syriac-witness'),/AC≠BC/);assert.match(visible('compared-witness'),/Those equalities give AC=BC/);assert.match(visible('arabic-proof'),/margin preserves the rejected AC≠BC/);
 const q=s.recipes.find(x=>x.id==='make-compared-witness');assert.equal(q.a,'proof-roll');assert.equal(q.b,'syriac-witness');
});
test('numeric examples independently give40→49→4→40 and20→36→2→20',()=>{
 const problem=visible('merchant-account');assert.match(problem,/two 3-wide strips = 40/);assert.match(problem,/two 4-wide = 20/);assert.match(problem,/width 3 and length x has total area 40/);assert.match(problem,/width 4 and length y has total area 20/);
 const cases=[{b:6,c:40,side:4,total:49,outer:7,check:[16,24]},{b:8,c:20,side:2,total:36,outer:6,check:[4,16]}];
 for(const v of cases){const half=v.b/2,corner=half*half,total=v.c+corner,outer=Math.sqrt(total),side=outer-half;assert.equal(total,v.total);assert.equal(outer,v.outer);assert.equal(side,v.side);assert.deepEqual([side*side,v.b*side],v.check);assert.equal(side*side+v.b*side,v.c);}
 for(const needle of['40+9=49','x=7−3=4'])assert.ok(visible('square-construction').includes(needle));
 for(const needle of['20+16=36','√36=6','y=6−4=2','4+16=20'])assert.ok(visible('algebra-method').includes(needle));
 for(let b=1;b<=12;b++)for(let x=1;x<=12;x++){const c=x*x+b*x;assert.ok(Math.abs(Math.sqrt(c+(b/2)**2)-b/2-x)<1e-10);}
});
test('decimal reuse keeps actual earlier month values and distinguishes40 from4',()=>{
 assert.match(visible('decimal-procedure'),/13−7=6/);assert.match(visible('decimal-procedure'),/7\+6=13/);assert.match(visible('decimal-procedure'),/40 is four tens and zero units, not four/);assert.equal(13-7,6);
 const q=s.recipes.find(x=>x.id==='make-decimal-procedure');assert.deepEqual([q.a,q.b],['indian-numerals','reckoning-table']);
});
test('raw strips plus corner works immediately in either direction without proof or decimal prerequisites',()=>{
 for(const reverse of[false,true]){let g=enter();const old=M.token(g.state,'square-strips'),pos={x:old.x,y:old.y};g=combine(g,reverse?'corner-square':'square-strips',reverse?'square-strips':'corner-square');const out=M.token(g.state,'completed-square');assert.ok(out);assert.deepEqual({x:out.x,y:out.y},pos);assert.ok(out.components.includes('corner-square'));assert.ok(!M.token(g.state,'arabic-proof'));assert.ok(!M.token(g.state,'decimal-procedure'));assert.ok(!M.token(g.state,'corner-square'));}
});
test('translation may be first or last, but final transfer actually needs repaired equality and checked first plot',()=>{
 const math=['make-decimal-procedure','make-written-equation','make-completed-square','make-square-construction','make-checked-solution'],proof=['make-compared-witness','make-arabic-proof'];
 for(const ids of[[...proof,...math],[...math,...proof]]){let g=authored(enter(),ids);assert.ok(!M.stageComplete(s,g.state));g=authored(g,['make-algebra-method']);assert.ok(M.stageComplete(s,g.state));assert.ok(M.token(g.state,'algebra-method').components.includes('corner-square'));}
 for(const remove of['proof-roll','reckoning-table']){let g=enter();g.state.tokens=g.state.tokens.filter(t=>t.id!==remove);while(ready(g).length){const q=ready(g)[0];g=combine(g,q.a,q.b);}assert.ok(!M.stageComplete(s,g.state),remove);assert.ok(!M.token(g.state,'algebra-method'));}
});
test('progressive goals reward the repaired meaning and checked side, then reveal the genuine transfer question',()=>{
 let g=enter();assert.deepEqual(M.playerView(s,g).objectives.map(o=>o.item??o.id).length,2);
 g=authored(g,['make-compared-witness','make-arabic-proof']);let v=visibleView(M,s,g);assert.ok(!v.objectives.some(o=>o.text==='Restore the equality proof'));assert.ok(!M.token(g.state,'arabic-proof').gold);
 g=authored(g,['make-decimal-procedure','make-written-equation','make-completed-square','make-square-construction','make-checked-solution']);v=visibleView(M,s,g);assert.deepEqual(v.objectives.map(o=>o.text),['Solve both plots with one rule']);assert.ok(!v.things.find(t=>t.id==='checked-solution').gold);
 g=authored(g,['make-algebra-method']);assert.ok(M.stageComplete(s,g.state));
});
test('strict logical surface exposes labels and deliberate readings, never generic descriptions',()=>{
 let g=enter();const poisoned=structuredClone(s);for(const i of poisoned.items)i.description='AUTHOR_ONLY_SENTINEL';for(const q of poisoned.recipes)q.description='AUTHOR_ONLY_SENTINEL';let v=visibleView(M,poisoned,g);assert.ok(!JSON.stringify(v).includes('AUTHOR_ONLY_SENTINEL'));
 const out=execute(M,poisoned,g,'drop',['square-strips','corner-square']);assert.ok(out.response.accepted);assert.ok(!JSON.stringify({response:out.response,view:out.view}).includes('AUTHOR_ONLY_SENTINEL'));const read=execute(M,poisoned,out.game,'read',['completed-square']);assert.match(read.response.reading.text,/x²\+6x\+9/);
});
test('all later chapters still require two genuinely earlier-created outputs, including alternate producers',()=>{
 const producers=new Map();for(const q of s.recipes){if(!producers.has(q.out))producers.set(q.out,[]);producers.get(q.out).push(q);}
 for(let st=1;st<chapters.length;st++){const earlier=new Set(chapters.slice(0,st).flatMap(c=>c.created)),memo=new Map();function must(id){if(earlier.has(id))return new Set([id]);if(memo.has(id))return memo.get(id);const paths=(producers.get(id)??[]).map(q=>new Set([...must(q.a),...must(q.b)]));const out=paths.length?new Set([...paths[0]].filter(x=>paths.every(p=>p.has(x)))):new Set();memo.set(id,out);return out;}assert.ok(new Set(s.stages[st].objectives.flatMap(o=>[...must(o.item)])).size>=2,chapters[st].id);}
});
test('fifty full author-known randomized routes, reverse drags and all downstream contracts finish',()=>{for(let n=1;n<=50;n++){const r=route(n,n%2===0);assert.ok(r.game.state.completed);assert.ok(r.game.state.metrics.combinations>=257&&r.game.state.metrics.combinations<=260);}});

test('all reachable projected chapter4 states are completable, including reversed drags',()=>{
 const key=g=>JSON.stringify({made:g.state.discovered.filter(x=>c.created.includes(x)).sort(),tokens:g.state.tokens.filter(t=>t.area===g.state.currentArea).map(t=>({id:t.id,parts:[...(t.components??[])].sort(),inc:[...t.incorporated].sort()})).sort((a,b)=>a.id.localeCompare(b.id))});
 const queue=[enter()],seen=new Map([[key(queue[0]),0]]),edges=[],terminal=new Set();let transitions=0;
 for(let n=0;n<queue.length;n++){const g=queue[n];edges[n]=[];if(M.stageComplete(s,g.state)){terminal.add(n);continue;}const choices=ready(g);assert.ok(choices.length,'Dead end at '+key(g));for(const q of choices)for(const reverse of[false,true]){const out=combine(g,reverse?q.b:q.a,reverse?q.a:q.b),k=key(out);if(!seen.has(k)){seen.set(k,queue.length);queue.push(out);}edges[n].push(seen.get(k));transitions++;}}
 const reaches=new Set(terminal);let changed=true;while(changed){changed=false;for(let n=0;n<queue.length;n++)if(!reaches.has(n)&&edges[n].some(x=>reaches.has(x))){reaches.add(n);changed=true;}}
 assert.equal(reaches.size,queue.length);fs.writeFileSync(new URL('chapter4-state-graph.json',import.meta.url),JSON.stringify({scope:'Author-known logical projection excludes positions/history but includes discovered creations, live objects and components; not discovery play',states:queue.length,transitions,terminalStates:terminal.size,allReachCompletion:true},null,2)+'\n');
});
