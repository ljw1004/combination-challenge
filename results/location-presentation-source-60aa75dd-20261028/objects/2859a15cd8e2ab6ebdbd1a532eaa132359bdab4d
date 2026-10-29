// Current v10 runtime regressions retain the approved v9 inference behavior.
// The first test separately preserves the frozen historical v8-to-v9 review.
// Author-known semantic witnesses, not independent fresh or human play evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import type {Action} from '../experiments/tangible-campaign/schema/scenario.ts';
import {scenario as s} from '../experiments/tangible-campaign/ui/campaigns/doctrine.ts';
import {readSource} from '../experiments/tangible-campaign/integration/reviewed-routes.ts';
const root='doctrine/revision-9-derived-premises/',v8=readSource(root+'baseline-v8-candidate.json'),manifest=readSource(root+'authoring-manifest.json');
const action=(a:string,b:string):Action=>({type:'combine',a,b}),advance:Action={type:'advance'};
const step=(g:M.Game,a:Action)=>{const r=M.applyAction(s,g,a);assert(r.accepted,JSON.stringify(a)+': '+r.message);return r.game;};
const run=(g:M.Game,actions:Action[],reverse=false)=>{for(const a of actions)g=step(g,reverse&&a.type==='combine'?action(a.b,a.a):a);return g;};
const cp=(n:number,width=360)=>M.checkpoint(s,'chapter-'+n,width);
type Family={desk:number;leaves:string[];partials:Record<string,string[]>;out:string};
const families:Family[]=[
 {desk:4,leaves:['metaphysics-objection','salvation-end','known-destination'],partials:{'reason-limits':['metaphysics-objection','salvation-end'],'philosophical-inquiry':['metaphysics-objection','known-destination'],'reason-and-revelation':['salvation-end','known-destination']},out:'reason-serving-theology'},
 {desk:6,leaves:['god-gives-grace','water-and-word','instrument-analogy'],partials:{'sacramental-difficulty':['god-gives-grace','water-and-word'],'dependent-instrument':['god-gives-grace','instrument-analogy'],'borrowed-cleansing':['water-and-word','instrument-analogy']},out:'instrument-of-grace'},
 {desk:8,leaves:['promise-of-christ','neighbour-in-need','christ-servant'],partials:{'freedom-from-merit':['promise-of-christ','neighbour-in-need'],'received-and-given':['promise-of-christ','christ-servant'],'service-pattern':['neighbour-in-need','christ-servant']},out:'free-service'},
];
function localRoutes(f:Family):Action[][]{const routes:Action[][]=[];for(const [p,ls]of Object.entries(f.partials))routes.push([action(ls[0],ls[1]),action(p,f.leaves.find(l=>!ls.includes(l))!)]);const ids=Object.keys(f.partials);for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)for(const[a,b]of [[ids[i],ids[j]],[ids[j],ids[i]]])routes.push([action(f.partials[a][0],f.partials[a][1]),action(f.partials[b][0],f.partials[b][1]),action(a,b)]);return routes;}
test('Historical Doctrine v9 reviewed delta remains exact; current v10 retains all inference data',()=>{
 const current=s, v9=readSource(root+'doctrine-argument-desks-v9-candidate.json');
 for(const key of ['recipes','sources','checkpoints'])assert.deepEqual(current[key as keyof typeof current],v9[key]);
 const historical=v9 as typeof current;
 assert.deepEqual(historical.stages,v8.stages);assert.deepEqual(historical.sources,v8.sources);assert.deepEqual(historical.checkpoints,v8.checkpoints);assert.deepEqual(manifest.authoredActions,readSource(root+'baseline-v8-manifest.json').authoredActions);assert.equal(historical.recipes.length,88);assert.equal(historical.items.length,99);
 for(const r of v8.recipes)assert.deepEqual(historical.recipes.find(x=>x.id===r.id),r);assert.deepEqual(historical.recipes.slice(v8.recipes.length).map(r=>r.id),['embodied-from-apostolic-claim','bodily-work-from-free-service']);
 for(const before of v8.items){const actual=structuredClone(historical.items.find(i=>i.id===before.id)!);if(actual.id==='embodied-spiritual-rite'){assert.match(actual.description!,/^Calling the rite spiritual/);assert.equal(actual.reading!.text,actual.description);actual.description=before.description;actual.reading!.text=before.reading.text;}if(actual.id==='sacramental-disagreement'){assert.equal(actual.label,'Lyon claims apostolic continuity; Aquinas explains baptism’s borrowed power');actual.label=before.label;}assert.deepEqual(actual,before);}
});
test('Doctrine independent premise-set oracle accepts all27 meaningful two-premise unions, not arbitrary contained evidence',()=>{
 let checked=0;for(const f of families){const sets:Record<string,string[]>=Object.fromEntries([...f.leaves.map(l=>[l,[l]]),...Object.entries(f.partials)]),ids=Object.keys(sets);for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){const[a,b]=[ids[i],ids[j]],u=[...new Set([...sets[a],...sets[b]])].sort();if(u.length===sets[a].length||u.length===sets[b].length)continue;const out=u.length===3?f.out:Object.keys(f.partials).find(k=>JSON.stringify([...f.partials[k]].sort())===JSON.stringify(u));assert.equal(s.recipes.find(r=>r.a===a&&r.b===b||r.a===b&&r.b===a)?.out,out);checked++;}}assert.equal(checked,27);
});
test('Doctrine54 grouping/direction witnesses preserve exactly one copy of each premise, restore, and undo',()=>{
 let checked=0;for(const f of families)for(const local of localRoutes(f))for(const reverse of [false,true]){let g=cp(f.desk);if(f.desk===6)g=step(g,action('saw','craftsperson'));const before=run(g,local.slice(0,-1),reverse);g=run(before,local.slice(-1),reverse);const refs=M.token(g.state,f.out)!.components??[];assert.deepEqual(refs.filter(x=>f.leaves.includes(x)).sort(),[...f.leaves].sort());for(const id of f.leaves)assert.equal(refs.filter(x=>x===id).length,1);assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);assert.deepEqual({...M.undo(g).game.state,metrics:null},{...before.state,metrics:null});checked++;}assert.equal(checked,54);
});
for(const width of [320,375,502])for(const reverse of [false,true])test(`Doctrine derived spiritual premise keeps full references and earlier argument downstream; ${width}, reverse=${reverse}`,()=>{
 let g=run(cp(5,width),[action('gospel-and-hands','acts-hands')],reverse);const before=g;g=run(g,[action('spiritual-baptism','gospel-and-hands')],reverse);const refs=M.token(g.state,'embodied-spiritual-rite')!.components!;for(const id of ['gospel-and-hands','acts-hands','spiritual-baptism'])assert(refs.includes(id));assert.equal(refs.filter(x=>x==='gospel-and-hands').length,1);assert(M.token(g.state,'spiritual-baptism'));assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);assert.deepEqual({...M.undo(g).game.state,metrics:null},{...before.state,metrics:null});g=run(g,[action('creation-disagreement','embodied-spiritual-rite'),action('spiritual-baptism','ritual-promise'),advance,...manifest.chapters.slice(5).flatMap((c:any)=>[...c.route,advance])],reverse);assert(g.state.completed);
});
test('Doctrine all9 free-service groupings support bodily work in both directions with actual final gold',()=>{
 for(const local of localRoutes(families[2]))for(const reverse of [false,true]){let g=run(cp(8),local,reverse);g=run(g,[action('free-service','body-discipline')],reverse);const refs=M.token(g.state,'body-not-discarded')!.components!;for(const id of ['promise-of-christ','neighbour-in-need','christ-servant','body-discipline','free-service'])assert(refs.includes(id));assert.equal(refs.filter(x=>x==='promise-of-christ').length,1);g=run(g,[action('grace-heals-will','promise-of-christ'),action('repentant-life','promise-of-christ'),action('pastoral-priorities','free-service')],reverse);assert(M.stageComplete(s,g.state));const expected=M.visibleObjectives(s,g.state).filter(o=>!o.intermediate).flatMap(o=>o.witnesses);assert.deepEqual(M.gold(s,g.state).items,[...new Set(expected)]);assert(M.gold(s,g.state).items.includes('body-not-discarded'));assert(run(g,[advance]).state.completed);}
});
