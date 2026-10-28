import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
import {M,L} from './runtime.mjs';import {s,chapters,act,route,ready} from './evaluate.mjs';import {visibleView,execute} from './strict-surface.mjs';
const root=import.meta.dirname,baseRoot=root+'/../revision-v5-baghdad-calculation';
const load=p=>JSON.parse(fs.readFileSync(p));const base=load(baseRoot+'/scenario.json'),bc=load(baseRoot+'/chapters.json'),c=chapters[4];
const item=id=>s.items.find(i=>i.id===id),recipe=id=>s.recipes.find(i=>i.id===id),visible=id=>item(id).label+'\n'+(item(id).reading?.text??''),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function enter(){let g=M.createGame(s);for(const a of load(baseRoot+'/author-route.json')){if(g.state.stage===4)return g;g=act(g,a);}throw Error('No chapter5 arrival');}
function take(g,id,reverse=false){const r=recipe(id),a=reverse?r.b:r.a,b=reverse?r.a:r.b;if(r.at)g=act(g,{type:'place',item:b,location:r.at});return act(g,{type:'combine',a,b});}
function authored(g,ids=c.recipes,reverse=false){for(const id of ids)g=take(g,id,reverse);return g;}
const making=['make-aperture-board','make-image-box','make-camera-obscura'],prediction=['make-ray-diagram','make-predicted-spots'];
test('schema, content lifecycles, objective flow and construction continuity pass unchanged runtime',()=>assert.deepEqual([...M.validateScenario(s),...L.validateContentLifecycles([s]),...L.validateObjectiveFlow([s]),...L.validateConstructionContinuity([s])],[]));
test('frozen v5 inputs and original immutable manifest remain byte-exact',()=>{for(const[p,h]of Object.entries(load(root+'/base-hashes.json')))assert.equal(sha(p),h,p);for(const[p,h]of Object.entries(load(baseRoot+'/manifest.json')))assert.equal(sha(baseRoot+'/'+p),h,p);});
test('only chapter5 local entities change; all IDs, inherited inputs and downstream contracts remain',()=>{
 const localItems=new Set([...bc[4].supplies,...bc[4].created]),localRecipes=new Set(bc[4].recipes);
 assert.deepEqual(s.items.map(i=>i.id),base.items.map(i=>i.id));assert.deepEqual(s.recipes.map(r=>r.id),base.recipes.map(r=>r.id));
 for(const i of base.items)if(!localItems.has(i.id))assert.deepEqual(item(i.id),i,i.id);
 for(const r of base.recipes)if(!localRecipes.has(r.id))assert.deepEqual(recipe(r.id),r,r.id);
 for(let n=0;n<29;n++)if(n!==4){assert.deepEqual(s.stages[n],base.stages[n]);assert.deepEqual(chapters[n],bc[n]);}
 for(const k of ['schemaVersion','id','title','premise','locations','initialItems','notes'])assert.deepEqual(s[k],base[k]);
 for(const source of base.sources)assert.deepEqual(s.sources.find(x=>x.id===source.id),source);
 assert.deepEqual(load(root+'/connections.json'),load(baseRoot+'/connections.json'));
 assert.deepEqual(c.created,bc[4].created);assert.deepEqual(c.supplies,bc[4].supplies);assert.deepEqual(c.recipes,bc[4].recipes);
 assert.equal(c.recipes.length,9);assert.deepEqual(s.stages[4].carry,base.stages[4].carry);
});
test('exact ID-addressed patch reproduces candidate and composes with unrelated item edits',()=>{
 const out=fs.mkdtempSync('/tmp/optics-patch-');execFileSync('python',[root+'/apply_patch.py','--base',baseRoot,'--output',out]);for(const name of ['scenario.json','chapters.json','connections.json'])assert.deepEqual(load(out+'/'+name),load(root+'/'+name));
 const disjoint=structuredClone(base);disjoint.items.find(x=>x.id==='force-rule').label='UNRELATED MOTION PATCH';fs.writeFileSync(out+'/scenario.json',JSON.stringify(disjoint));fs.copyFileSync(baseRoot+'/chapters.json',out+'/chapters.json');
 const result=fs.mkdtempSync('/tmp/optics-compose-');execFileSync('python',[root+'/apply_patch.py','--base',out,'--output',result,'--compose']);assert.equal(load(result+'/scenario.json').items.find(x=>x.id==='force-rule').label,'UNRELATED MOTION PATCH');
 disjoint.items.find(x=>x.id==='lamp').label='CONFLICT';fs.writeFileSync(out+'/scenario.json',JSON.stringify(disjoint));assert.throws(()=>execFileSync('python',[root+'/apply_patch.py','--base',out,'--output',result,'--compose'],{stdio:'pipe'}),/Command failed/);
});
test('source is primary and the adaptation is explicitly not historical measurements',()=>{
 const p=s.sources.find(x=>x.id==='optics-lamps-primary');assert.match(p.url,/ffh360b2205460.pdf#page=50/);assert.match(p.title,/I.6 §§85–87/);
 for(const id of ['lamp','source-positions','ray-diagram','crossed-rays','predicted-spots','comparison-record','optical-model','optical-question'])assert.match(item(id).reading.attribution,/Authored two-lamp teaching adaptation/);
 assert.match(visible('lamp'),/not a live light simulation/);assert.match(visible('source-positions'),/Units are arbitrary/);
});
test('actual source coordinates independently imply H→lower and L→upper',()=>{
 const v=load(root+'/case-values.json');for(const [name,[x,y]]of Object.entries(v.sources)){
  const slope=(v.aperture[1]-y)/(v.aperture[0]-x),screenY=v.aperture[1]+slope*(v.screenPlaneX-v.aperture[0]);assert.equal(screenY,v.predictedScreenY[name]);
 }
 assert.match(visible('source-positions'),/one unit above O, L one unit below/);assert.match(visible('source-positions'),/same horizontal distance/);
 assert.match(visible('ray-diagram'),/equal horizontal runs have equal vertical changes/);assert.match(visible('ray-diagram'),/H→O drops one unit/);assert.match(visible('ray-diagram'),/L→O rises one unit/);
 assert.match(visible('ray-diagram'),/old triangle proof does not establish the physical straight-path assumption/);
 assert.deepEqual([recipe('make-ray-diagram').a,recipe('make-ray-diagram').b],['source-positions','arabic-proof']);
});
test('prediction, observation, supported conclusion and eye limit are visible, not generic-description promises',()=>{
 assert.match(visible('predicted-spots'),/covering H should remove only the lower patch and leave the upper/);
 const v=load(root+'/case-values.json');assert.deepEqual(v.observations.map(x=>[x.cover,x.upper,x.lower]),[[null,true,true],['H',true,false],[null,true,true],['L',false,true],[null,true,true]]);
 for(const line of ['H covered: lower patch absent; upper remains','L covered: upper patch absent; lower remains','H uncovered again: both present','L uncovered again: both present'])assert.ok(visible('comparison-record').includes(line));
 assert.match(visible('optical-model'),/crossing did not destroy source-to-patch correspondence/);assert.match(visible('optical-model'),/inseparable-mixture account/);
 assert.match(visible('optical-question'),/receiving screen does not sense/);assert.match(visible('optical-question'),/rival eye accounts could agree on every patch/);
});
test('camera remains three comfortable construction combinations; normal highlighting exposes the dark-room setting',()=>{
 for(const reverse of [false,true]){let g=authored(enter(),making.slice(0,2),reverse);
  assert.equal(M.applyAction(s,g,{type:'combine',a:'image-box',b:'courtyard'}).accepted,false);
  const h=execute(M,s,g,'highlight',['image-box']);assert.ok(h.response.highlighted.some(x=>x.id==='@dark-room'));assert.equal(h.game.state.metrics.combinations,g.state.metrics.combinations);
  g=take(g,'make-camera-obscura',reverse);assert.ok(M.token(g.state,'camera-obscura'));assert.match(item('camera-obscura').label,/doorway top appears below/);
 }
});
test('making and prediction may be done in either order, then actual apparatus and prediction meet',()=>{
 for(const reverse of [false,true])for(const branch of [[...making,...prediction],[...prediction,...making]]){
  let g=authored(enter(),branch,reverse);assert.ok(!M.stageComplete(s,g.state));
  g=authored(g,['make-comparison-record','make-crossed-rays','make-optical-model','make-optical-question'],reverse);assert.ok(M.stageComplete(s,g.state));
 }
 let g=authored(enter(),prediction);assert.ok(!M.token(g.state,'camera-obscura'));assert.equal(M.applyAction(s,g,{type:'combine',a:'predicted-spots',b:'lamp'}).accepted,false);assert.ok(!M.token(g.state,'comparison-record'));
 assert.equal(recipe('make-comparison-record').b,'camera-obscura');
});
test('both inherited connections do real work and are required',()=>{
 for(const remove of ['arabic-proof','underdetermined-case']){let g=enter();g.state.tokens=g.state.tokens.filter(t=>t.id!==remove);while(ready(g).length){g=take(g,ready(g)[0].id);}assert.ok(!M.stageComplete(s,g.state),remove);assert.ok(!M.token(g.state,'optical-question'));if(remove==='arabic-proof')assert.ok(!M.token(g.state,'ray-diagram'));}
});
test('strict surface reveals only labels and authored readings, not hidden prose or recipe answers',()=>{
 const poisoned=structuredClone(s);for(const i of poisoned.items)i.description='AUTHOR_ONLY_SENTINEL';for(const r of poisoned.recipes)r.description='AUTHOR_ONLY_SENTINEL';
 let g=enter();assert.ok(!JSON.stringify(visibleView(M,poisoned,g)).includes('AUTHOR_ONLY_SENTINEL'));
 const r=execute(M,poisoned,g,'read',['source-positions']);assert.match(r.response.reading.text,/H is one unit above O/);assert.equal(r.response.progressChanged,false);
 g=authored(g,[...making,...prediction,'make-crossed-rays','make-comparison-record','make-optical-model']);
 const observed=execute(M,poisoned,g,'read',['comparison-record']);assert.match(observed.response.reading.text,/H covered: lower patch absent/);
 const done=execute(M,poisoned,g,'drop',['optical-model','underdetermined-case']);assert.equal(done.transitions.length,1);assert.ok(!JSON.stringify({view:done.view,response:done.response}).includes('AUTHOR_ONLY_SENTINEL'));
 assert.ok(done.transitions[0].visibleFinalCreation.things.some(x=>x.id==='optical-question'&&x.readable&&x.label==='Light path explained; eye sensing still open'));
 const back=execute(M,poisoned,done.game,'visit',['area-cairo']);assert.match(execute(M,poisoned,back.game,'read',['optical-question']).response.reading.text,/receiving screen does not sense/);
});
test('all projected chapter5 branch states reach completion in both drag directions',()=>{
 const key=g=>JSON.stringify({made:g.state.discovered.filter(x=>c.created.includes(x)).sort(),tokens:g.state.tokens.filter(t=>t.area===g.state.currentArea).map(t=>({id:t.id,parts:[...(t.components??[])].sort(),inc:[...t.incorporated].sort()})).sort((a,b)=>a.id.localeCompare(b.id))});
 const queue=[enter()],seen=new Map([[key(queue[0]),0]]),edges=[],terminal=new Set();let transitions=0;
 for(let n=0;n<queue.length;n++){const g=queue[n];edges[n]=[];if(M.stageComplete(s,g.state)){terminal.add(n);continue;}const choices=ready(g);assert.ok(choices.length,'Dead end');for(const r of choices)for(const reverse of [false,true]){const out=take(g,r.id,reverse),k=key(out);if(!seen.has(k)){seen.set(k,queue.length);queue.push(out);}edges[n].push(seen.get(k));transitions++;}}
 const reaches=new Set(terminal);let changed=true;while(changed){changed=false;for(let n=0;n<queue.length;n++)if(!reaches.has(n)&&edges[n].some(x=>reaches.has(x))){reaches.add(n);changed=true;}}
 assert.equal(reaches.size,queue.length);fs.writeFileSync(root+'/chapter5-state-graph.json',JSON.stringify({scope:'Author-known logical projection; discovered results, live objects, components. Spatial placement/history excluded; required dark-room placement included before each recipe edge. No discovery or enjoyment claim.',states:queue.length,directedRecipeTransitions:transitions,terminalStates:terminal.size,allReachCompletion:true},null,2)+'\n');
});
test('fifty randomized full-campaign author-known routes preserve every downstream contract',()=>{
 const rows=[];for(let seed=1;seed<=50;seed++){const r=route(seed,seed%2===0);assert.ok(r.game.state.completed);assert.equal(r.rows[4].combinations,9);rows.push({seed,combinations:r.game.state.metrics.combinations,opticsCombinations:r.rows[4].combinations});if(seed===1)fs.writeFileSync(root+'/author-route.json',JSON.stringify(r.actions,null,2)+'\n');}
 fs.writeFileSync(root+'/downstream-routes.json',JSON.stringify({scope:'Author-known logical regression, not fresh play',completedRoutes:50,rows,downstreamInputRecipes:['make-compared-optics','make-interpreted-shadows','make-switch-comparison','make-camera-exposure','make-metabolic-imager']},null,2)+'\n');
});
