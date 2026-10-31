import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {scenario as s} from '../../ui/stories/atlas-civilization-reviewed.ts';
import {addedChapterRecipes,connectionLedger,condensations} from '../../ui/stories/atlas-civilization.ts';
import {atlasLocations as base} from '../../ui/stories/intellectual-locations.ts';
import * as M from '../../engine/campaign.ts';import * as L from '../../schema/lifecycle.ts';import {toLegacyScenario} from '../../compatibility/v1.ts';
const dir=new URL('./',import.meta.url);const save=(n:string,x:unknown)=>fs.writeFileSync(new URL(n,dir),JSON.stringify(x,null,2)+'\n');
assert.deepEqual(M.validateScenario(s),[]);const old=toLegacyScenario(s);for(const f of [L.validateContentLifecycles,L.validateObjectiveFlow,L.validateConstructionContinuity])assert.deepEqual(f([old]),[]);
const checks:string[]=['schema','explicit input lifecycle','objective progression','construction continuity'];
const checkedRecipes=new Set<string>();
const recipes=new Map(s.recipes.map(r=>[r.id,r]));
const candidates=(g:M.Game)=>s.recipes.filter(r=>!r.out||!g.state.discovered.includes(r.out)).flatMap(r=>{
 const operand=(id:string)=>id.startsWith('@')?g.state.hotspots.some(h=>'@'+h.id===id&&h.location===g.state.currentLocation)?id:null:g.state.tokens.find(t=>t.kind===id&&t.location===g.state.currentLocation)?.id;
 const a=operand(r.a),b=operand(r.b);return a&&b?[{r,a,b}]:[];
});
const substantive=(g:M.Game)=>{const {metrics,...state}=g.state;return state;};
const changed=(r:any)=>r.id.startsWith('civ-')||r.out==='unfinished-common-world';
function run(seed:number,reverse:boolean,deep:boolean){
 let g=M.createGame(s),actions:any[]=[],chapters:any[]=[],recipeSeen=new Set<string>(),checksCount=0,guard=0;
 const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
 while(!g.state.completed){
  if(++guard>60)throw Error('Chapter guard');const chapter=s.chapters[g.state.chapter];
  const report:any={id:chapter.id,entryCount:g.state.tokens.filter(t=>t.location===g.state.currentLocation).length,stock:(g.state.arrival?.supplies??[]).filter(x=>g.state.tokens.some(t=>t.kind===x.item&&t.location===g.state.currentLocation)).map(x=>x.item),entryThings:g.state.tokens.filter(t=>t.location===g.state.currentLocation).map(t=>({id:t.kind,label:s.items.find(i=>i.id===t.kind)!.label})),carried:g.state.arrival?.carried.map(x=>x.item)??[],created:[],peak:0};
  while(true){const options=candidates(g);if(!options.length)break;let pick=deep?options[0]:options[Math.floor(rand()*options.length)];
   // Prefer the alternative consent route in reverse trial, without changing the graph.
   if(reverse){const alt=options.find(x=>x.r.id==='civ-make-rights-through-consent');if(alt)pick=alt;}
   const {r}=pick;const a=reverse&&!pick.b.startsWith('@')?pick.b:pick.a,b=a===pick.a?pick.b:pick.a;const action:any={type:'combine',a,b};
   const result=M.applyAction(s,g,action);assert.equal(result.accepted,true,r.id+': '+result.message);
   if(changed(r)&&deep){const hints=M.partners(s,g.state,a);assert.ok([...hints.partners,...hints.incoming,...hints.settings].includes(b),r.id+' highlight');
    if(!b.startsWith('@'))assert.equal(M.applyAction(s,g,{type:'combine',a:b,b:a}).accepted,true,r.id+' reverse');
    assert.deepEqual(M.restore(s,JSON.stringify(result.game)),result.game,r.id+' restore');
    const undone=M.undo(result.game).game;assert.deepEqual(substantive(undone),substantive(g),r.id+' undo');
    assert.deepEqual(substantive(M.applyAction(s,undone,action).game),substantive(result.game),r.id+' reapply');
    const dupe=M.applyAction(s,result.game,action);assert.equal(dupe.accepted,false,r.id+' duplicate');checksCount++;checkedRecipes.add(r.id);
   }
   g=result.game;actions.push(action);recipeSeen.add(r.id);report.created.push(r.out);report.peak=Math.max(report.peak,g.state.tokens.filter(t=>t.location===g.state.currentLocation).length);
  }
  assert.equal(M.chapterComplete(s,g.state),true,chapter.id+' cannot finish '+JSON.stringify(M.objectiveStates(s,g.state).filter(o=>!o.satisfied)));
  report.peak=Math.max(report.entryCount,report.peak);chapters.push(report);const before=g.state.chapter;
  const next=M.applyAction(s,g,{type:'advance'});assert.equal(next.accepted,true,chapter.id+' advance');g=next.game;actions.push({type:'advance'});if(!g.state.completed)assert.ok(g.state.chapter>before);
 }
 return {complete:g.state.completed,combinations:g.state.metrics.combinations,checksCount,actions,chapters,recipeSeen:[...recipeSeen],state:g.state};
}
const canonical=run(42,false,true);console.log('Canonical',canonical.combinations,canonical.chapters.length,canonical.checksCount);
const alternate=run(12345,true,true);console.log('Alternate',alternate.combinations,alternate.chapters.length);
const randomized=run(20261029,false,false);console.log('Randomized',randomized.combinations,randomized.chapters.length);
const allseen=new Set([...canonical.recipeSeen,...alternate.recipeSeen]);for(const ids of Object.values(addedChapterRecipes))for(const id of ids)assert.ok(allseen.has(id),id+' not exercised');assert.ok(allseen.has('civ-make-rights-through-consent'));
for(const c of condensations){assert.ok(allseen.has(c.replace));for(const id of c.retire)assert.ok(!s.recipes.some(r=>r.id===id));}
const symbolic=[];
for(const chapterId of ['civic-rule','law-status','consent-rule','freedom-empire']){
 const c=s.chapters.find(c=>c.id===chapterId)!,entry=canonical.chapters.find(c=>c.id===chapterId)!;
 const rr=addedChapterRecipes[chapterId].map(id=>recipes.get(id)!);assert.ok(rr.every(r=>Object.values(r.lifecycle!).every(x=>x.role==='retain')));
 const start=new Set<string>(entry.entryThings.map((i:any)=>i.id));
 const key=(a:Set<string>)=>[...a].sort().join('|');const queue=[start],seen=new Set([key(start)]),edges:any[]=[];let terminals=0;
 const complete=(a:Set<string>)=>c.objectives.every(o=>a.has(o.item!));
 for(let i=0;i<queue.length;i++){const st=queue[i];let legal=0;if(complete(st))terminals++;
  for(const r of rr)if(st.has(r.a)&&st.has(r.b)&&!st.has(r.out!)){legal++;const n=new Set(st);n.add(r.out!);edges.push([key(st),key(n)]);if(!seen.has(key(n))){seen.add(key(n));queue.push(n);}}
  assert.ok(legal||complete(st),chapterId+' symbolic deadlock');
 }
 const without=new Set([...start].filter(id=>!entry.carried.includes(id)));let progress=true;while(progress){progress=false;for(const r of rr)if(without.has(r.a)&&without.has(r.b)&&!without.has(r.out!)){without.add(r.out!);progress=true;}}
 assert.equal(complete(without),false,chapterId+' can finish without earlier creations');
 symbolic.push({chapter:chapterId,reachableStates:seen.size,transitions:edges.length,goalStates:terminals,deadlocks:0,removingEarlierCreationsBlocksCompletion:true,scope:'Exact monotone symbolic graph of the new desk, alongside separately recorded engine checks; no UI evidence.'});
}
save('new-desk-state-space.json',symbolic);
for(const r of s.recipes.filter(changed))assert.ok(checkedRecipes.has(r.id),r.id+' missing deep engine check');
const chronology=connectionLedger.map(row=>{const here=s.chapters.findIndex(c=>c.id===row.chapter);const index=canonical.chapters.findIndex(c=>c.created.includes(row.earlier));assert.ok(index>=0&&index<here,row.earlier+' was not made earlier for '+row.chapter);return {...row,createdIn:canonical.chapters[index].id};});
checks.push('whole world completes in canonical, reverse/alternative and randomized legal orders; entered/skipped chapter counts are recorded separately','every added recipe and both rights alternatives exercised across routes','all changed recipes: normal highlight, both directions, duplicate prevention, exact save/restore, Undo/reapply','all declared chapter links use genuinely earlier-created ideas','all six condensed gates absent and four replacement operations exercised');
save('canonical-route.json',{scenarioId:s.id,actions:canonical.actions});save('reverse-route.json',{scenarioId:s.id,actions:alternate.actions});save('chapter-density.json',canonical.chapters);save('connections.json',chronology);save('condensations.json',condensations);save('scenario.json',s);
const sha=(x:string)=>crypto.createHash('sha256').update(x).digest('hex');
const preservation=['experiments/tangible-campaign/ui/campaigns/atlas.ts','experiments/tangible-campaign/ui/stories/atlas-intellectual-history.ts','experiments/tangible-campaign/ui/stories/intellectual-locations.ts','experiments/tangible-campaign/ui/current-scenarios.ts'].map(path=>{const local=fs.readFileSync(new URL('../../../../'+path,import.meta.url),'utf8');const frozen=JSON.parse(fs.readFileSync(new URL('preserved-base-manifest.json',dir),'utf8')).find((r:any)=>r.path===path);assert.equal(sha(local),frozen.sha256,path);return {path,sha256:sha(local),unchanged:true};});save('preservation.json',preservation);
const changes={items:{added:s.items.filter(i=>!base.items.some(b=>b.id===i.id)).map(i=>i.id),retired:base.items.filter(i=>!s.items.some(b=>b.id===i.id)).map(i=>i.id),modified:s.items.filter(i=>base.items.some(b=>b.id===i.id)&&JSON.stringify(i)!==JSON.stringify(base.items.find(b=>b.id===i.id))).map(i=>({id:i.id,before:base.items.find(b=>b.id===i.id),after:i}))},recipes:{added:s.recipes.filter(i=>!base.recipes.some(b=>b.id===i.id)),retired:base.recipes.filter(i=>!s.recipes.some(b=>b.id===i.id)),modified:s.recipes.filter(i=>base.recipes.some(b=>b.id===i.id)&&JSON.stringify(i)!==JSON.stringify(base.recipes.find(b=>b.id===i.id))).map(i=>({before:base.recipes.find(b=>b.id===i.id),after:i}))}};save('field-delta.json',changes);save('complete-field-delta.json',Object.fromEntries((Object.keys(s) as (keyof typeof s)[]).filter(k=>JSON.stringify(s[k])!==JSON.stringify(base[k])).map(k=>[k,{before:base[k],after:s[k]}])));save('operation-review.json',s.recipes.filter(changed).map(r=>({id:r.id,inputs:[r.a,r.b].map(id=>({id,label:s.items.find(i=>i.id===id)?.label??id})),output:s.items.find(i=>i.id===r.out),sources:(r.sources??[]).map(id=>s.sources!.find(x=>x.id===id))})));
save('names-tasks-review.json',s.chapters.filter(c=>['civic-rule','law-status','consent-rule','freedom-empire','perspective','longitude','relativity'].includes(c.id)).map(c=>({chapter:c.id,title:c.title,date:c.entryCue?.sourceCaption,tasks:c.objectives.map(o=>o.text),things:canonical.chapters.find(r=>r.id===c.id)?.entryThings??[],alreadyCompleteOnEntry:!canonical.chapters.some(r=>r.id===c.id)})));
const report={scenarioId:s.id,scenarioSha256:sha(JSON.stringify(s)),counts:{chapters:s.chapters.length,recipes:s.recipes.length,items:s.items.length},checks,changedRecipeChecks:checkedRecipes.size,routes:[{name:'canonical',combinations:canonical.combinations,enteredChapters:canonical.chapters.length,skippedChapters:canonical.state.skippedChapters??[],completed:true},{name:'reverse/alternative',combinations:alternate.combinations,enteredChapters:alternate.chapters.length,skippedChapters:alternate.state.skippedChapters??[],completed:true},{name:'randomized',combinations:randomized.combinations,enteredChapters:randomized.chapters.length,skippedChapters:randomized.state.skippedChapters??[],completed:true}],newDesks:canonical.chapters.filter(c=>['civic-rule','law-status','consent-rule','freedom-empire'].includes(c.id)),limits:['Author-operated engine tests, not recipe-blind player evidence.','No browser/native/phone interaction or human enjoyment test.','Full aggregate and production build intentionally reserved for integrator.','Four new desk artworks are not yet authored; research candidate is not registered or published.']};save('verification.json',report);console.log(JSON.stringify(report,null,2));
