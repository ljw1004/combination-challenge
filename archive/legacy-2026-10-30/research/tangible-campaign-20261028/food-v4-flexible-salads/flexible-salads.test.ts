import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {s,base,json,sha,readRoute,routeSet,witness,focused,validations,replayStoppedIntent,act} from './verify.ts';
import {applyAction,checkpoint,dropAction,gold,restore,stageComplete,token} from './engine/model.ts';

test('Scenario, lifecycle, final-objective and construction contracts remain valid',()=>assert.deepEqual(validations(),[]));
test('Exactly two routes to existing outputs, plus provenance/identity; no scene, supply, goal, cache, item or original recipe change',()=>{
 assert.notEqual(s.id,base.id);assert.equal(s.recipes.length,base.recipes.length+2);assert.deepEqual(s.recipes.slice(0,base.recipes.length),base.recipes);
 for(const k of ['schemaVersion','title','premise','items','locations','initialItems','stages','checkpoints'] as const)assert.deepEqual(s[k],base[k]);
 assert.deepEqual(s.sources!.slice(0,base.sources!.length),base.sources);assert.equal(s.sources!.length,base.sources!.length+2);assert.deepEqual(s.notes!.slice(1),base.notes!.slice(1));
 for(const r of s.recipes.slice(base.recipes.length))assert(base.recipes.some(old=>old.out===r.out));
});
test('All frozen inputs and copied runtime bytes retain their recorded hashes',()=>{
 for(const f of json('./protected-inputs.json'))assert.equal(sha(f.path),f.sha256,f.path);
 const m=json('./manifest.json');assert.equal(sha(m.base),m.baseSha256);assert.equal(sha(new URL('./scenario.json',import.meta.url).pathname),m.scenarioSha256);
 for(const r of m.runtime){assert.equal(sha(new URL(r.path,import.meta.url).pathname),r.sha256);assert.equal(sha(r.source),r.sha256);}
});
test('Recipe alternatives are counted honestly: two new joins, zero new outcomes, no pretend 197-step goal route',()=>{
 const outputs=(world:typeof s)=>new Set(world.recipes.flatMap(r=>r.out?[r.out]:[]));assert.deepEqual(outputs(s),outputs(base));assert.equal(outputs(s).size,194);
 assert.equal(readRoute('plain-vinaigrette').filter(a=>a.type==='combine').length,178);assert.equal(readRoute('direct-mustard').filter(a=>a.type==='combine').length,179);assert.equal(readRoute('preserved-v3/canonical').filter(a=>a.type==='combine').length,180);
});
test('Every original route file is preserved byte-for-byte, including early discovery and optional coverage',()=>{
 for(const n of ['canonical','all-recipes','reverse-ready','reverse-directions','early-discovery','early-opening'])assert.equal(readFileSync(new URL('./routes/preserved-v3/'+n+'.json',import.meta.url),'utf8'),readFileSync(new URL('../food-v3/routes/'+n+'.json',import.meta.url),'utf8'));
});
test('Caches never conjure outputs and all new recipes have both-input retention with plain-language portion reasons',()=>{
 const made=new Set(s.recipes.flatMap(r=>r.out?[r.out]:[]));for(const st of s.stages)for(const c of st.caches??[])for(const id of c.items)assert(!made.has(id));
 for(const r of s.recipes.slice(base.recipes.length)){assert(!r.at&&!r.requires&&!r.retire&&!r.install);assert.deepEqual(Object.keys(r.lifecycle!).sort(),[r.a,r.b].sort());for(const l of Object.values(r.lifecycle!)){assert.equal(l.role,'retain');assert(l.reason.includes('portion'));}}
});
test('New source ledger is explicit about simplification and does not upgrade the old corpus’s evidence',()=>{
 const old=json('../food-v3/source-attribution.json'),ledger=json('./source-attribution.json');assert.deepEqual(ledger.slice(0,old.length),old);assert.equal(ledger.length,s.recipes.length);
 const ids=new Set(s.sources!.map(x=>x.id));for(const r of s.recipes){const row=ledger.find((x:any)=>x.recipe===r.id);assert(row);assert.deepEqual(r.sources??[],row.methodSources);for(const id of [...row.methodSources,...row.contextSources])assert(ids.has(id));}
 for(const r of s.recipes.slice(base.recipes.length)){assert(r.caveat!.includes('simplification'));assert(r.caveat!.includes('compressed'));}
});
for(const width of [320,360,600])for(const reverse of [false,true])test(`Both alternative drags @ ${width}, reversed=${reverse}: existing outputs, no placement/paste prerequisite, stable stocks, save/undo, no duplicate inflation`,()=>{focused(reverse,width);});
for(const [name,actions] of Object.entries(routeSet()))test(`${name}: full source-aware route, real earlier-created inputs, event-local retirement, undo/restore`,()=>{witness(name,actions,360);});
test('Plain salad leaves mustard preparation optional and does not satisfy unrelated salad goals',()=>{
 let g=checkpoint(s,'salads');g=act(g,{type:'combine',a:'vinaigrette',b:'roast-roots'});assert(!stageComplete(s,g.state));assert(gold(s,g.state).items.includes('root-salad'));assert(!token(g.state,'mustard-paste'));assert(!token(g.state,'mustard-dressing'));
 g=act(g,{type:'combine',a:'ground-mustard',b:'vinaigrette'});assert(token(g.state,'mustard-dressing'));assert(!token(g.state,'mustard-paste'));assert(!stageComplete(s,g.state));
});
test('Existing paste-first route still works; alternate output cannot be re-created to inflate counts',()=>{
 let g=checkpoint(s,'salads');for(const [a,b] of [['ground-mustard','cider-vinegar'],['mustard-paste','vinaigrette'],['roast-roots','mustard-dressing']])g=act(g,{type:'combine',a,b});
 for(const [a,b] of [['ground-mustard','vinaigrette'],['roast-roots','vinaigrette']]){const r=applyAction(s,g,dropAction(s,g.state,a,b));assert(!r.accepted);assert.equal(r.game.state.metrics.combinations,g.state.metrics.combinations);}
});
test('No permission for all plausible pairs, and remote physical ingredients remain unavailable',()=>{
 const g=checkpoint(s,'salads');for(const [a,b] of [['roast-roots','cider-vinegar'],['ground-mustard','roast-roots'],['cucumber','vinaigrette']])assert(!applyAction(s,g,dropAction(s,g.state,a,b)).accepted);
 const away=act(g,{type:'visit',area:'soup-area'});assert(!applyAction(s,away,dropAction(s,away.state,'roast-roots','vinaigrette')).accepted);
});
test('The later noodle chapter uses the same retained roast-root batch, not a respawn or salad replacement',()=>{
 let g=checkpoint(s,'salads');for(const a of readRoute('plain-vinaigrette').slice(readRoute('preserved-v3/canonical').findIndex(a=>a.type==='combine'&&a.a==='ground-mustard'))){
  const r=applyAction(s,g,a);assert(r.accepted,r.message);g=r.game;if(g.state.stage===5)break;
 }
 assert.equal(g.state.stage,5);assert.equal(token(g.state,'roast-roots')!.area,'noodles-area');assert(g.state.recipesUsed.includes('roast-roots'));assert(!g.state.recipesUsed.includes('mustard-paste'));
 const r=applyAction(s,g,dropAction(s,g.state,'roast-roots','strained-yogurt'));assert(r.accepted);assert.equal(r.recipe,'root-filling');assert(token(r.game.state,'roast-roots'));
});
test('The player’s exact two rejected intentions now work in its reconstructed pre-attempt inventory; frozen session stays stopped',()=>{
 const report=replayStoppedIntent();assert.equal(report.priorCombinations,35);assert.equal(report.attempts.length,2);const original=json('../longitudinal-play/sessions/food-v3-copyfix-packet-v1/food-long-01/session.json');assert.equal(original.status,'stopped');assert(!original.game.state.completed);
});
