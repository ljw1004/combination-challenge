/** Current action witness adaptation only; immutable historical routes remain raw.
 * Solar continuity adds exactly one real construction before the first use of
 * the formerly supplied finished lamp. Crawler routes are not rewritten here:
 * duplicate-dependent tow-old-alias must remain a historical witness. */
import assert from 'node:assert/strict';
import type {Action} from '../schema/scenario.ts';
export function currentMarsRouteActions(source:readonly Action[]):Action[]{
 const actions=structuredClone(source) as Action[];
 const made=actions.flatMap((a,i)=>a.type==='combine'&&((a.a==='lamp'&&a.b==='solar-charger')||(a.b==='lamp'&&a.a==='solar-charger'))?[i]:[]);
 assert(made.length<=1,'A route must not construct its unique solar lamp twice');
 const use=actions.findIndex(a=>a.type==='combine'&&(a.a==='solar-lamp'||a.b==='solar-lamp')||a.type==='place'&&a.item==='solar-lamp');
 if(use<0)return actions;
 if(made.length){assert(made[0]<use,'Solar lamp construction must precede its use');return actions;}
 actions.splice(use,0,{type:'combine',a:'lamp',b:'solar-charger'});
 return actions;
}
