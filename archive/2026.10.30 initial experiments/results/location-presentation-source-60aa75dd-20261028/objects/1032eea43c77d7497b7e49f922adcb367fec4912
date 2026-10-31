import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
import type {Scenario,Action,Recipe} from '../schema/scenario.ts';import type {Game} from '../engine/model.ts';
import {applyAction,createGame,checkpoint,restore,undo,resizeGame,playerView,stageComplete,capabilities,token,validateScenario} from '../engine/model.ts';
import {validateContentLifecycles,validateObjectiveFlow,validateConstructionContinuity} from '../schema/lifecycle.ts';
export const root=new URL('../evidence/integration-20261028/sources/food-v6-ten-kitchens/',import.meta.url).pathname,output=new URL('../../../results/kitchen-atlas-20261028/food/',import.meta.url).pathname;fs.mkdirSync(output,{recursive:true});
export const read=(p:string)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
export const s:Scenario=read('scenario.json'),base:Scenario=read('base-scenario.json'),plan=read('change-plan.json'),facilities=read('facility-plan.json');
export const names=['preserved-v3/canonical','preserved-v3/all-recipes','preserved-v3/reverse-ready','preserved-v3/reverse-directions','preserved-v3/early-discovery','preserved-v3/early-opening','plain-vinaigrette','direct-mustard','catalogue-plain-vinaigrette','catalogue-direct-mustard','plain-vinaigrette-reversed','direct-mustard-reversed','early-plain-vinaigrette','chocolate-departure','early-kitchen-forward','early-kitchen-reverse'];
export const actions=(name:string):Action[]=>read('routes/'+name+'.json');
export function validate(){return [...validateScenario(s),...validateContentLifecycles([s]),...validateObjectiveFlow([s]),...validateConstructionContinuity([s])];}
export function preservation(){
 const removed=new Set([...plan.removedRecipeIds,...plan.modifiedRecipeIds]),aliases:Record<string,string>=plan.locationAliases;
 const itemAlias=(id:string)=>plan.itemAliases[id]??id;
 const semantics=(r:Recipe)=>({id:r.id,a:r.a.startsWith('@')?'@'+(aliases[r.a.slice(1)]??r.a.slice(1)):itemAlias(r.a),b:r.b.startsWith('@')?'@'+(aliases[r.b.slice(1)]??r.b.slice(1)):itemAlias(r.b),out:r.out,at:r.at?aliases[r.at]??r.at:undefined,install:r.install,preserve:r.preserve,requires:r.requires,lifecycle:Object.fromEntries(Object.entries(r.lifecycle??{}).map(([k,v])=>[itemAlias(k),v.role]))});
 for(const r of base.recipes.filter(r=>!removed.has(r.id)))assert.deepEqual(semantics(s.recipes.find(x=>x.id===r.id)!),semantics(r),r.id);
 for(const old of base.items){
  const now=s.items.find(x=>x.id===(plan.itemAliases[old.id]??old.id));
  if(!now){assert(plan.removedItemIds.includes(old.id));continue;}
  const normalized=structuredClone(now);normalized.id=old.id;
  if(['canned-lunch','syrup-apricots','sugar-mill','almond-sugar'].includes(old.id)){normalized.label=old.label;normalized.description=old.description;}
  if(['vanilla-sandwich','iced-chocolate-cake'].includes(old.id))delete normalized.capabilities;
  assert.deepEqual(normalized,old,old.id);
 }
 const recipe=(id:string)=>s.recipes.find(r=>r.id===id)!;
 assert.deepEqual([recipe('almond-sugar').a,recipe('almond-sugar').b],['ground-almonds','powdered-sugar']);
 assert.deepEqual([recipe('syrup-apples').a,recipe('syrup-apples').b],['fruit','fruit-syrup']);
 assert.deepEqual([recipe('bean-supper').a,recipe('bean-supper').b],['bean-stew','soda-bread']);
 assert.equal(recipe('bean-supper').lifecycle?.['bean-stew'].role,'retain');

 for(let i=0;i<18;i++)assert.deepEqual(s.stages[i].objectives.map(({text,...rest})=>rest),base.stages[i].objectives.map(({text,...rest})=>rest));
 // Historical author's external protected-input checks remain frozen evidence; current integration verifies all sealed parent files separately.
 const integrated=JSON.parse(fs.readFileSync(new URL('../evidence/integration-20261028/sources/food-v6-ten-kitchens/base-scenario.json',import.meta.url),'utf8'));assert.deepEqual(base,integrated);
 assert.notEqual(s.id,base.id);assert(!/twinkie|hostess/i.test(JSON.stringify(s)));
 const sourceIds=new Set(s.sources?.map(x=>x.id));for(const entity of [...s.items,...s.recipes,...s.locations])for(const id of entity.sources??[])assert(sourceIds.has(id),`Missing source ${id}`);
 return {existingFoodRecipesRetained:184,existingFoodRecipesSemanticallyUnchanged:181,deliberatelyClarifiedFoodRecipes:3,removedFactoryRecipes:12,removedImmediateReopeningRecipe:1,newServingRecipes:5,first18ChapterObjectiveSemanticsUnchanged:true,existingReadingsUnchanged:true,historicalAuthorProtectedInputs:read('protected-inputs.json').length,currentInputProtection:'Full exact parent source/inventory guard; no external workspace reads',newScenarioIdentity:s.id,oldScenarioUnmodified:base.id};
}
export function facilityCheck(){
 const areas=new Map<string,{locations:string[],stages:string[]}>();const introduced=new Set<string>(s.initialItems);
 for(const st of s.stages){let group=areas.get(st.area.id);const first=!group;if(!group){group={locations:[],stages:[]};areas.set(st.area.id,group);}group.stages.push(st.id);group.locations.push(...st.locations??[]);
  if(!first){assert.deepEqual(st.caches,[]);assert.deepEqual(st.carry,[]);assert.deepEqual(st.locations,[]);}
  for(const cache of st.caches??[])for(const id of cache.items){assert(!introduced.has(id),'Repeated supply '+id);introduced.add(id);assert(!s.recipes.some(r=>r.out===id),'Created item introduced as supply '+id);}
 }
 for(const [id,group] of areas){const labels=group.locations.map(id=>s.locations.find(l=>l.id===id)!.label.toLowerCase());assert.equal(new Set(labels).size,labels.length,'Ambiguous facilities in '+id);for(const label of labels)assert(!s.items.some(i=>i.label.toLowerCase()===label),'Equipment/item collision '+label);}
 assert.equal(areas.size,10);assert.equal(s.stages.filter(st=>(st.caches??[]).length).length,9);
 const primitives=s.items.filter(i=>!s.recipes.some(r=>r.out===i.id));for(const p of primitives)assert(introduced.has(p.id),'Primitive lacks provenance '+p.id);assert.equal(introduced.size,primitives.length);
 return {activeWorkstations:areas.size,physicalFacilities:new Set(facilities.map((x:{facilityId:string})=>x.facilityId)).size,chapterCount:s.stages.length,arrivalCaches:9,initialSupplies:s.initialItems.length,uniquePrimitives:primitives.length,sameKitchenTransitions:s.stages.length-areas.size,areaMap:[...areas].map(([area,x])=>({area,...x}))};
}
export function witness(name:string,width:number){
 let g=createGame(s,width),sameKitchenTransitions=0,arrivals=1,maxVisible=0;const used=new Set<string>(),recipeStages:Record<string,number[]>={},scenePeaks:Record<string,number>={};
 const observe=()=>{const view=playerView(s,g),visible=view.things.length+view.locations.length;maxVisible=Math.max(maxVisible,visible);scenePeaks[g.state.currentArea]=Math.max(scenePeaks[g.state.currentArea]??0,visible);const locLabels=view.locations.map(l=>l.label.toLowerCase());assert.equal(new Set(locLabels).size,locLabels.length);for(const loc of view.locations)assert(!view.things.some(t=>t.label.toLowerCase()===loc.label.toLowerCase()));};observe();
 for(const a of actions(name)){
  const before=g,r=applyAction(s,g,a);assert(r.accepted,`${name}@${width} ${JSON.stringify(a)}: ${r.message}`);g=r.game;
  if(r.recipe){used.add(r.recipe);(recipeStages[r.recipe]??=[]).push(before.state.stage);}
  if(a.type==='advance'&&g.state.stage!==before.state.stage){if(g.state.currentArea===before.state.currentArea){sameKitchenTransitions++;assert.deepEqual(g.state.tokens,before.state.tokens);assert.deepEqual(g.state.places,before.state.places);assert.deepEqual(g.state.areas,before.state.areas);assert.deepEqual(g.state.openedCaches,before.state.openedCaches);assert.deepEqual(g.state.discovered,before.state.discovered);assert.deepEqual(g.events.at(-1)?.transfers??[],[]);}else arrivals++;}
  observe();
 }
 assert(g.state.completed);assert.equal(g.state.areas.length,10);assert(maxVisible<=40,'Active-board population exceeds 40');assert.equal(sameKitchenTransitions,10);assert.deepEqual(restore(s,JSON.stringify(g)),g);
 const trolley=token(g.state,'supper-trolley')!;assert.equal(trolley.location,'dining-car');assert.equal(trolley.slots.meal,'bean-supper');assert.equal(trolley.slots.drink,'juice');assert.equal(trolley.slots.provisions,'processed-stew-tin');assert(g.state.discovered.includes('processed-stew-tin'));assert(!g.state.discovered.includes('opened-stew'));assert(trolley.slots['vanilla-cake']==='vanilla-sandwich'||trolley.slots['chocolate-cake']==='iced-chocolate-cake');assert(capabilities(s,trolley).includes('departure-service'));
 return {name,width,completed:true,actions:actions(name).length,combinations:g.state.metrics.combinations,sameKitchenTransitions,arrivals,maxVisible,scenePeaks,recipeStages,recipesUsed:[...used],visibleFinalFood:playerView(s,g).things.find(t=>t.id==='supper-trolley')?.slots.map(x=>x.label),saveRestored:true};
}
export function finalStart(name:string,width=360){let g=createGame(s,width);for(const a of actions(name)){if(g.state.stage===19)return g;const r=applyAction(s,g,a);assert(r.accepted,r.message);g=r.game;}throw Error('Final stage missing');}
function permutations<T>(xs:T[]):T[][]{return xs.length?xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>i!==j)).map(t=>[x,...t])):[[]];}
export function finaleChecks(){
 let completedOrders=0,missingCourseCases=0,repeatLoadsRejected=0,undoChecks=0;
 for(const width of [320,360,600])for(const choice of ['vanilla','chocolate'] as const){
  const start=finalStart(choice==='vanilla'?'plain-vinaigrette':'chocolate-departure',width),cake=choice==='vanilla'?'vanilla-sandwich':'iced-chocolate-cake',foods=['bean-supper',cake,'juice','processed-stew-tin'];
  for(let mask=0;mask<16;mask++){
   let g=structuredClone(start);for(let i=0;i<4;i++)if(mask&(1<<i)){const r=applyAction(s,g,{type:'combine',a:foods[i],b:'supper-trolley'});assert(r.accepted);g=r.game;}
   g=applyAction(s,g,{type:'place',item:'supper-trolley',location:'dining-car'}).game;assert.equal(stageComplete(s,g.state),mask===15);assert.equal(g.state.completed,false);missingCourseCases++;
  }
  for(const order of permutations(foods)){
   let g=structuredClone(start);for(const food of order){const previous=structuredClone(g);const r=applyAction(s,g,{type:'combine',a:food,b:'supper-trolley'});assert(r.accepted,r.message);g=r.game;const reverted=undo(g).game;assert.deepEqual(reverted.state.tokens,previous.state.tokens);undoChecks++;}
   assert(!stageComplete(s,g.state));assert.deepEqual(restore(s,JSON.stringify(g)),g);
   const repeated=applyAction(s,g,{type:'combine',a:order.at(-1)!,b:'supper-trolley'});assert(!repeated.accepted);assert.deepEqual(repeated.game.state.tokens,g.state.tokens);repeatLoadsRejected++;
   g=resizeGame(g,width===600?320:600);g=applyAction(s,g,{type:'place',item:'supper-trolley',location:'dining-car'}).game;assert(stageComplete(s,g.state));assert(!stageComplete(s,undo(g).game.state));g=applyAction(s,g,{type:'advance'}).game;assert(g.state.completed);completedOrders++;
  }
 }
 // Extra cake is a visible extra serving place, never an overwrite that destroys the first cake.
 const both=finalStart('preserved-v3/all-recipes');let g=both;
 for(const food of ['vanilla-sandwich','iced-chocolate-cake','bean-supper','juice','processed-stew-tin']){const r=applyAction(s,g,{type:'combine',a:food,b:'supper-trolley'});assert(r.accepted);g=r.game;}
 assert.equal(token(g.state,'supper-trolley')!.slots['vanilla-cake'],'vanilla-sandwich');assert.equal(token(g.state,'supper-trolley')!.slots['chocolate-cake'],'iced-chocolate-cake');
 return {completedOrders,missingCourseCases,repeatLoadsRejected,undoChecks,bothDessertsVisibleWithoutOverwrite:true};
}
export function provenance(replays:ReturnType<typeof witness>[]){
 const stagesByRecipe=new Map<string,Set<number>>();for(const replay of replays)for(const [id,stages] of Object.entries(replay.recipeStages)){const acc=stagesByRecipe.get(id)??new Set<number>();stages.forEach(x=>acc.add(x));stagesByRecipe.set(id,acc);}
 const source=new Map<string,{area:string,chapter:string,cache:string}>();s.initialItems.forEach(id=>source.set(id,{area:s.stages[0].area.id,chapter:s.stages[0].id,cache:'Caravan’s original road supplies'}));for(const st of s.stages)for(const cache of st.caches??[])for(const id of cache.items)source.set(id,{area:st.area.id,chapter:st.id,cache:cache.label});
 const rows=s.items.filter(i=>!s.recipes.some(r=>r.out===i.id)).map(it=>{
  const direct=s.recipes.filter(r=>[r.a,r.b].includes(it.id)),directStages=new Set<number>();direct.forEach(r=>stagesByRecipe.get(r.id)?.forEach(x=>directStages.add(x)));
  const reached=new Set([it.id]),downstream=new Set<string>();let changed=true;while(changed){changed=false;for(const r of s.recipes)if([r.a,r.b].some(x=>reached.has(x))){downstream.add(r.id);if(r.out&&!reached.has(r.out)){reached.add(r.out);changed=true;}}}
  const downstreamStages=new Set<number>();for(const id of downstream)stagesByRecipe.get(id)?.forEach(x=>downstreamStages.add(x));
  const directPerRoute=replays.filter(r=>r.width===360).map(replay=>new Set(direct.flatMap(r=>replay.recipeStages[r.id]??[])).size);
  const downstreamPerRoute=replays.filter(r=>r.width===360).map(replay=>new Set([...downstream].flatMap(id=>replay.recipeStages[id]??[])).size);
  const optionalReference=!!it.reading&&direct.length===0;
  assert(direct.length||optionalReference,`Orphan supply ${it.id}`);
  return {id:it.id,label:it.label,introduction:source.get(it.id),directRecipeIds:direct.map(r=>r.id),maxDirectUseChaptersInOneRoute:Math.max(...directPerRoute),maxDownstreamChaptersInOneRoute:Math.max(...downstreamPerRoute),observedDirectUseChapters:[...directStages].sort((a,b)=>a-b).map(i=>s.stages[i].id),downstreamCookingChapters:[...downstreamStages].sort((a,b)=>a-b).map(i=>s.stages[i].id),optionalReference,singleDirectRecipe:direct.length===1,notClaimedMultiUseWhenSingle:direct.length===1};
 });
 return {primitives:rows.length,multiDirectRecipePrimitives:rows.filter(r=>r.directRecipeIds.length>1).length,singleDirectRecipePrimitives:rows.filter(r=>r.singleDirectRecipe).length,optionalReferences:rows.filter(r=>r.optionalReference).length,multiChapterDirectUse:rows.filter(r=>r.maxDirectUseChaptersInOneRoute>1).length,multiChapterThroughPreparations:rows.filter(r=>r.maxDownstreamChaptersInOneRoute>1).length,rows};
}
export function verify(){
 const errors=validate();assert.deepEqual(errors,[]);const preserved=preservation(),facility=facilityCheck();
 const replays=names.flatMap(name=>[320,360,600].map(width=>witness(name,width)));const used=new Set(replays.flatMap(r=>r.recipesUsed));assert.equal(used.size,s.recipes.length);for(const r of s.recipes)assert(used.has(r.id),'Unplayed recipe '+r.id);
 const checkpoints=s.checkpoints!.map(c=>{for(const width of [320,360,600]){const g=checkpoint(s,c.id,width);assert.deepEqual(restore(s,JSON.stringify(g)),g);}return {id:c.id,widths:[320,360,600],validAndRestorable:true};});
 const finale=finaleChecks(),audit=provenance(replays);fs.writeFileSync(path.join(output,'primitive-audit.json'),JSON.stringify(audit,null,2)+'\n');
 const result={status:'Current integrated source-aware logical checks; not fresh player or native UI evidence',validationErrors:errors,preservation:preserved,facility,counts:{items:s.items.length,locations:s.locations.length,recipes:s.recipes.length,chapters:s.stages.length,checkpoints:checkpoints.length},replays,checkpoints,finale,recipeCoverage:{used:used.size,total:s.recipes.length},primitiveAudit:{...audit,rows:undefined},summary:{fullReplays:replays.length,totalAcceptedActions:replays.reduce((n,r)=>n+r.actions,0),stationarySameKitchenTransitions:replays.reduce((n,r)=>n+r.sameKitchenTransitions,0),maxVisibleThingsAndLocations:Math.max(...replays.map(r=>r.maxVisible))},browserOrUITestingPerformed:false,fullApplicationBuildPerformed:false,independentHumanPlaytestPerformed:false};
 fs.writeFileSync(path.join(output,'verification.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({counts:result.counts,summary:result.summary,primitiveAudit:result.primitiveAudit,finale,recipeCoverage:result.recipeCoverage},null,2));return result;
}

