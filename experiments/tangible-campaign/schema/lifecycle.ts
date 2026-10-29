import type {Recipe, Retirement, Scenario} from './scenario.ts';

/** Historical experiments may retain their old, explicitly grandfathered format. */
export const archivedScenarioIds=new Set(['theology','causation','chinese-thought','mars-story-expansion-candidate','atlas-of-questions-v6','elements-local-projects-v5','mars-cargo-revision-v2','atlas-of-questions-v8-transmission-actions','elements-observation-revision-v6','food','causation-purpose-v4','doctrine-grace-and-matter-v1']);

/** The declarations are the sole source of input lifetime; graph exhaustion alone is never permission to delete. */
export function incorporations(r:Recipe):Retirement[]{
 return r.lifecycle?Object.entries(r.lifecycle).filter(([,v])=>v.role==='transform'||v.role==='incorporate').map(([item,v])=>({item,reason:v.reason})):r.retire??[];
}
export function transformedInput(r:Recipe):string|undefined{
 return Object.entries(r.lifecycle??{}).find(([,v])=>v.role==='transform')?.[0];
}
export function validateRecipeLifecycle(r:Recipe,required=false):string[]{
 const errors:string[]=[],bad=(message:string)=>errors.push(`${r.id}: ${message}`);
 const inputs=[r.a,r.b].filter(id=>!id.startsWith('@'));
 if(!r.lifecycle){if(required)for(const id of inputs)bad(`unannotated input "${id}"; declare transform, incorporate, or retain with a reason`);return errors;}
 if(r.retire!==undefined)bad('use lifecycle declarations alone, not a second retire list');
 for(const id of inputs)if(!Object.hasOwn(r.lifecycle,id))bad(`unannotated input "${id}"; declare transform, incorporate, or retain with a reason`);
 for(const [id,v] of Object.entries(r.lifecycle)){
  if(!inputs.includes(id))bad(`lifecycle annotation "${id}" is not an object input`);
  if(!v||!['transform','incorporate','retain'].includes(v.role))bad(`invalid lifecycle role for "${id}"`);
  if(!v||typeof v.reason!=='string'||!v.reason.trim())bad(`explain the lifecycle of "${id}"`);
  if(v?.exclusive!==undefined&&(v.exclusive!==true||v.role==='retain'||!r.out))bad(`exclusive input "${id}" must transform or incorporate into a created result`);
 }
 if(Object.values(r.lifecycle).filter(v=>v?.role==='transform').length>1)bad('at most one input can be the transformed object');
 if(r.install){if(r.lifecycle[r.install.target]?.role!=='retain')bad('installation must retain the same construction');if(r.lifecycle[r.install.component]?.role!=='incorporate')bad('installation must incorporate its component');}
 return errors;
}
export function validateContentLifecycles(worlds:Scenario[]):string[]{
 return worlds.filter(s=>!archivedScenarioIds.has(s.id)).flatMap(s=>s.recipes.flatMap(r=>{
  const errors=validateRecipeLifecycle(r,true);
  return errors.map(error=>{
   const exhausted=[r.a,r.b].filter(id=>!id.startsWith('@')&&!r.lifecycle?.[id]&&!s.recipes.some(other=>other.id!==r.id&&[other.a,other.b].includes(id)));
   return `${s.id} / ${error}${exhausted.length?`; no other recipe uses ${exhausted.join(', ')} — possible unannotated transformation`:''}`;
  });
 }));
}

/** A final result must not simultaneously be a stepping stone to another listed goal. */
export function validateObjectiveFlow(worlds:Scenario[]):string[]{
 const errors:string[]=[];
 for(const s of worlds.filter(s=>!archivedScenarioIds.has(s.id))){
  const reaches=(start:string,target:string)=>{const seen=new Set([start]);for(const kind of seen)for(const r of s.recipes)if(r.out&&[r.a,r.b].includes(kind)){if(r.out===target)return true;seen.add(r.out);}return false;};
  for(const stage of s.stages){
   for(const goal of stage.objectives){
    if(goal.intermediate&&!stage.objectives.some(next=>next.after?.includes(goal.id)))errors.push(`${s.id} / ${stage.id}: intermediate ${goal.id} needs an explicit next goal`);
    for(const dep of goal.after??[])if(!stage.objectives.find(o=>o.id===dep)?.intermediate)errors.push(`${s.id} / ${stage.id}: reveal prerequisite ${dep} must be an intermediate step`);
   }
   if(stage.objectives.every(o=>o.intermediate))errors.push(`${s.id} / ${stage.id}: challenge needs a final objective`);
   for(const o of stage.objectives.filter(o=>!o.intermediate&&o.kind==='create'&&o.item)){
    const later=stage.objectives.find(other=>other!==o&&other.item&&reaches(o.item!,other.item));
    if(later)errors.push(`${s.id} / ${stage.id}: "${o.item}" feeds objective "${later.id}"; mark it intermediate so gold means finished`);
   }
  }
 }
 return errors;
}

/** A fitted construction may change its name, but never silently lose its parts. */
export function validateConstructionContinuity(worlds:Scenario[]):string[]{
 const errors:string[]=[];
 for(const s of worlds.filter(s=>!archivedScenarioIds.has(s.id))){
  const compounds=new Set(s.items.filter(i=>i.slots?.length).map(i=>i.id));
  let changed=true;while(changed){changed=false;for(const r of s.recipes)if(r.out&&incorporations(r).some(i=>compounds.has(i.item))&&!compounds.has(r.out)){compounds.add(r.out);changed=true;}}
  for(const r of s.recipes){
   const consumed=incorporations(r).map(x=>x.item);
   for(const k of r.preserve??[])if(!consumed.includes(k)||(!r.out&&!r.install))errors.push(`${s.id} / ${r.id}: preserve must name an incorporated or transformed input with an output`);
   for(const k of consumed.filter(k=>compounds.has(k)))if(!r.preserve?.includes(k))errors.push(`${s.id} / ${r.id}: compound ${k} needs explicit preserve; prefer installing into the existing construction`);
  }
 }
 return errors;
}
