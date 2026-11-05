import type {Diagnostic, Story} from '../story/types.ts';
import type {State} from '../engine/types.ts';
import {act, chapterComplete, matches, newGame} from '../engine/game.ts';
import {activeHotspots, isFixed, presentHotspots, recipeIngredients} from '../engine/fixed-items.ts';
import {analyzeContinuation, indexStory} from '../engine/analysis.ts';
import {canonicalState, localTransitions} from './opportunity-state.ts';
import {hotspotCountDiagnostics} from './hotspot-count.ts';

export const MAX_FIXED_STATES=20000;

export function dynamicHotspotChapter(story:Story,chapter:number):boolean{
  const ids=new Set(activeHotspots(story,chapter)), primitives=indexStory(story).primitives;
  return [...ids].some(id=>!primitives.has(id)) || story.recipes.some(r=>recipeIngredients(r).some(i=>ids.has(i.ref.id)&&i.fate!=='preserve'));
}

export function fixedCarryDiagnostics(story:Story,state:State):Diagnostic[]{
  const stranded=new Set(Object.values(state.tokens).filter(token=>token.status==='available'&&token.chapter!==state.chapter&&isFixed(story,token)).map(token=>token.id));
  if(!stranded.size)return [];
  const continuation=analyzeContinuation(story,state);
  if(continuation.possible)return [];
  const producers=indexStory(story).producers;
  return continuation.blockers.flatMap(({chapter,goal,supply})=>{
    const dependencies=new Set<string>();
    const visit=(id:string)=>{
      if(dependencies.has(id))return;dependencies.add(id);
      for(const recipe of producers.get(id)??[])for(const input of recipeIngredients(recipe)){
        visit(input.ref.id);input.ref.slots.forEach(visit);
      }
    };
    if(goal)for(const condition of goal.conditions){visit(condition.item.id);condition.item.slots.forEach(visit);if(condition.hotspot)visit(condition.hotspot);}
    if(supply)visit(supply.id);
    const missing=[...stranded].filter(id=>dependencies.has(id));
    if(!missing.length)return [];
    const source=goal?.source??story.chapters[chapter].source;
    return [{severity:'error',stage:'deep',code:'fixed-carry',source,span:source.span??{from:0,to:0},
      message:`Chapter-arrival analysis in “${story.chapters[state.chapter].name}” leaves ${missing.map(id=>story.items[id].name).join(', ')} fixed on an earlier board and blocks ${goal?`goal “${goal.text}”`:'a required supply'}. Require its useful result before leaving, or explicitly list the surviving fixed item under Hotspots where it is needed.`} satisfies Diagnostic];
  });
}

/** Exact, bounded logical exploration for the stronger fixed-retirement contract.
 * It keeps actual histories separate; pessimistically merged opportunity states
 * must never be reported as witnesses of a retirement error.
 */
export function fixedItemDiagnostics(story:Story):Diagnostic[]{
  const retiring=story.recipes.filter(r=>recipeIngredients(r).some(i=>i.fate!=='preserve'&&story.chapters.some(c=>c.hotspots.includes(i.ref.id))));
  const dynamic=story.chapters.map((_,i)=>dynamicHotspotChapter(story,i));
  if(!retiring.length&&!dynamic.some(Boolean))return [];
  const diagnostics:Diagnostic[]=[], found=new Set<string>(), seen=new Set<string>(), queue:{state:State;arrival:boolean}[]=[];
  const counts=story.chapters.map(()=>0);
  const enqueue=(input:State,arrival=false)=>{
    const state=canonicalState(input);
    const key=JSON.stringify([state.chapter,state.completed,[...state.achieved].sort(),[...state.excluded].sort(),state.visited,
      Object.values(state.tokens).sort((a,b)=>a.id.localeCompare(b.id)).map(t=>[t.id,t.status,t.chapter,t.hotspot,[...t.slots].sort()])]);
    if(seen.has(key))return;
    if(seen.size>=MAX_FIXED_STATES)throw new Error('fixed-state-limit');
    seen.add(key);queue.push({state,arrival});
  };
  try{
    enqueue(newGame(story),true);
    for(let index=0;index<queue.length;index++){
      const {state,arrival}=queue[index], chapter=state.chapter;
      for(const visited of state.visited)counts[visited]=Math.max(counts[visited],presentHotspots(story,state,visited).length);
      if(state.completed)continue;
      if(arrival){
        for(const diagnostic of fixedCarryDiagnostics(story,state)){
          const key=diagnostic.code+':'+diagnostic.source.line;
          if(!found.has(key)){found.add(key);diagnostics.push(diagnostic);}
        }
      }
      for(const transition of localTransitions(story,state,story.recipes,undefined,true)){
        for(const input of recipeIngredients(transition.recipe)){
          if(input.fate==='preserve'||input.ref.id===transition.recipe.result.id||!isFixed(story,state.tokens[input.ref.id]))continue;
          if(transition.state.tokens[input.ref.id]?.status!=='available')continue;
          const key=transition.recipe.id+'\0'+input.ref.id;
          if(found.has(key))continue;found.add(key);
          const source=transition.recipe.source, item=story.items[input.ref.id],fixedChapter=state.tokens[input.ref.id].chapter;
          diagnostics.push({severity:'error',stage:'deep',code:'fixed-retirement',source,span:source.span??{from:0,to:0},
            message:`${item.name} is fixed in “${story.chapters[fixedChapter].name}”, but this executable combination must preserve it to retain a continuation. Its [${input.fate}] annotation cannot be honored.`,
            related:[{...story.chapters[chapter].source,span:story.chapters[chapter].source.span??{from:0,to:0},message:'A reachable execution while this chapter is current retains the fixed ingredient.'}]});
        }
        enqueue(transition.state);
      }
      // Earlier movable resources can be retrieved; fixed installations cannot.
      for(const token of Object.values(state.tokens))if(token.status==='available'&&token.chapter!==chapter&&!isFixed(story,token)){
        enqueue(act(story,state,{type:'move',item:token.id,chapter,x:0,y:0}));
      }
      for(const c of story.chapters)for(const goal of c.goals)if(!state.achieved.includes(goal.id))for(const condition of goal.conditions){
        if(!condition.hotspot)continue;
        const target=state.tokens[condition.hotspot];
        if(!target||!presentHotspots(story,state,target.chapter).includes(condition.hotspot))continue;
        const token=state.tokens[condition.item.id];
        if(!matches(token,condition.item)||isFixed(story,token)||token.hotspot===condition.hotspot)continue;
        enqueue(act(story,state,{type:'move',item:token.id,chapter:target.chapter,x:0,y:0,hotspot:condition.hotspot}));
      }
      if(chapterComplete(story,state))enqueue(act(story,state,{type:'advance'}),true);
    }
  }catch(error){
    if(!(error instanceof Error)||error.message!=='fixed-state-limit')throw error;
    const source=story.source;
    return [...diagnostics,{severity:'warning',stage:'deep',code:'fixed-analysis-limit',source,span:source.span??{from:0,to:0},
      message:`Fixed-item verification exceeded its ${MAX_FIXED_STATES}-state limit. Arrival checks, retirement safety and peak hotspot counts were not fully verified.`}];
  }
  for(let chapter=0;chapter<dynamic.length;chapter++)if(dynamic[chapter]){
    diagnostics.push(...hotspotCountDiagnostics(story,chapter,counts[chapter]).filter(d=>d.code!=='duplicate-hotspot-acknowledgment').map(d=>({...d,stage:'deep' as const})));
  }
  return diagnostics;
}
