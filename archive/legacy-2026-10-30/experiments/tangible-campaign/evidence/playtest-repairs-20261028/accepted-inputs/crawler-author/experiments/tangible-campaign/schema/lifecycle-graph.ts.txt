import type {Recipe, Scenario} from './scenario.ts';

export type LifecycleGraphRule = 'conditional-retention' | 'retained-lineage';
export type LifecycleGraphWarning = {
  world:string; recipe:string; input:string; rule:LifecycleGraphRule;
  /** Scoped by the containing recipe and input; one conflict, not a wildcard. */
  id:string; conflict:string; path:string[]; message:string; reason?:string;
};
type Edge = {from:string;to:string;recipe:string};

/** Only author-declared transformation/incorporation is a lineage edge. Labels,
 * descriptions, terminal status and ordinary tool reuse are not evidence. */
function lineage(s:Scenario):Edge[]{
  return s.recipes.flatMap(r=>Object.entries(r.lifecycle??{}).flatMap(([input,l])=>{
    const out=r.out??r.install?.target;
    return out&&input!==out&&['transform','incorporate'].includes(l.role)
      ? [{from:input,to:out,recipe:r.id}] : [];
  }));
}
function path(edges:Edge[],from:string,to:string,excluding:string[]):string[]|undefined{
  if(from===to)return [];
  const seen=new Set([from]),queue:{item:string;route:string[]}[]=[{item:from,route:[]}];
  for(let i=0;i<queue.length;i++)for(const edge of edges){
    if(edge.from!==queue[i].item||excluding.includes(edge.recipe)||seen.has(edge.to))continue;
    const route=[...queue[i].route,edge.recipe];
    if(edge.to===to)return route;
    seen.add(edge.to);queue.push({item:edge.to,route});
  }
  return undefined;
}
function partner(r:Recipe,input:string){return r.a===input?r.b:r.b===input?r.a:undefined;}

/** Static *potential* conflicts, covering unplayed alternative orders too.
 * A warning requests review; it never removes an object or changes a save. */
export function lifecycleGraphWarnings(s:Scenario):LifecycleGraphWarning[]{
  const edges=lineage(s),warnings:LifecycleGraphWarning[]=[];
  const identityEdges=edges.filter(e=>s.recipes.find(x=>x.id===e.recipe)?.lifecycle?.[e.from]?.role==='transform');
  for(const r of s.recipes){
    const out=r.out??r.install?.target;
    if(!out)continue;
    for(const [input,l] of Object.entries(r.lifecycle??{})){
      if(input===out)continue; // An installation keeps the target construction itself.
      const add=(rule:LifecycleGraphRule,conflict:string,route:string[],message:string)=>{
        const id=`${rule}:${conflict}`;
        if(warnings.some(w=>w.recipe===r.id&&w.input===input&&w.id===id))return;
        const declared=Array.isArray(l.graphExceptions)?l.graphExceptions.find(e=>e?.warning===id)?.reason:undefined;
        const reason=typeof declared==='string'?declared:undefined;
        warnings.push({world:s.id,recipe:r.id,input,rule,id,conflict,path:route,message,...reason?{reason}: {}});
      };
      if(l.role==='retain'){
        for(const first of edges.filter(e=>e.from===input&&e.recipe!==r.id)){
          const rest=path(edges,first.to,out,[r.id]);
          if(rest!==undefined)add('retained-lineage',first.recipe,[first.recipe,...rest],
            `retains ${input}, but another declared transform/incorporate path puts that input into ${out}`);
        }
        continue;
      }
      if(l.exclusive)continue;
      for(const other of s.recipes){
        if(other.id===r.id||!other.out||other.out===out||partner(other,input)===undefined)continue;
        // The engine's needed() safeguard can retain this input while another
        // output is undiscovered. Here those outputs are not independent: one
        // already becomes/contains the other through declared lifecycle edges.
        const forward=path(edges,other.out,out,[r.id]);
        const backward=path(edges,out,other.out,[other.id]);
        if(other.lifecycle?.[input]?.role!=='retain'&&(forward!==undefined||backward!==undefined)){
          add('conditional-retention',other.id,[other.id,...(forward??backward!)],
            `${l.role} of ${input} can retain the predecessor for ${other.id}, although their outputs reconverge through declared lifecycle lineage`);
          continue;
        }
        // Two alternate states may reconverge only after further upgrades.
        // Restrict this diamond check to identity transformations: arbitrary
        // common later assemblies would conflate independent shared materials.
        if(l.role==='transform'&&other.lifecycle?.[input]?.role==='transform'){
          const common=s.items.map(i=>i.id).find(id=>
            path(identityEdges,out,id,[r.id,other.id])!==undefined&&
            path(identityEdges,other.out!,id,[r.id,other.id])!==undefined);
          if(common){
            add('conditional-retention',other.id,[other.id,
              ...path(identityEdges,out,common,[r.id,other.id])!,
              ...path(identityEdges,other.out,common,[r.id,other.id])!],
              `transform of ${input} can retain the predecessor for ${other.id}; both alternative states later transform into ${common}`);
            continue;
          }
        }
        // A successor can also perform exactly the old use with the same other
        // operand and output (e.g. repaired OR towed crawler brings crew in).
        for(const replacement of s.recipes.filter(next=>next.id!==r.id&&next.id!==other.id&&next.out===other.out)){
          const successor=[replacement.a,replacement.b].find(kind=>kind!==input&&
            partner(replacement,kind)===partner(other,input)&&
            path(identityEdges,out,kind,[r.id,other.id])!==undefined);
          if(!successor)continue;
          add('conditional-retention',other.id,[other.id,
            ...path(identityEdges,out,successor,[r.id,other.id])!,replacement.id],
            `${l.role} of ${input} can retain the predecessor for ${other.id}, but identity successor ${successor} has the equivalent ${replacement.id} use`);
          break;
        }
      }
    }
  }
  return warnings;
}

/** All unsuppressed review warnings fail the content build. A declaration must
 * identify one live warning on this exact input and explain that conflict. */
export function validateLifecycleGraph(worlds:Scenario[]):string[]{
  const errors:string[]=[];
  for(const s of worlds){
    const warnings=lifecycleGraphWarnings(s);
    for(const r of s.recipes)for(const [input,l] of Object.entries(r.lifecycle??{})){
      const prefix=`${s.id} / ${r.id} / ${input}`;
      if(l.graphExceptions!==undefined&&!Array.isArray(l.graphExceptions)){
        errors.push(`${prefix}: graphExceptions must list specific warnings and reasons`);continue;
      }
      const seen=new Set<string>();
      for(const exception of l.graphExceptions??[]){
        if(!exception||typeof exception.warning!=='string'||!warnings.some(w=>w.recipe===r.id&&w.input===input&&w.id===exception.warning))
          errors.push(`${prefix}: stale or unknown graph exception ${exception?.warning}; wildcard waivers are not allowed`);
        if(seen.has(exception?.warning))errors.push(`${prefix}: duplicate graph exception ${exception?.warning}`);
        seen.add(exception?.warning);
        if(typeof exception?.reason!=='string'||exception.reason.trim().length<24||exception.reason.trim()===l.reason?.trim())
          errors.push(`${prefix}: graph exception ${exception?.warning} needs a specific reason addressing this conflict, not the ordinary lifecycle reason`);
      }
    }
    for(const w of warnings)if(!w.reason?.trim())errors.push(
      `${w.world} / ${w.recipe} / ${w.input}: [${w.id}] ${w.message}; fix the lifecycle/route or declare graphExceptions [{warning:${JSON.stringify(w.id)},reason:...}] on this input`);
  }
  return errors;
}
