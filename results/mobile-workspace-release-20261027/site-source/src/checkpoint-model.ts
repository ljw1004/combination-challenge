import {stepWorkingMaterials} from '../experiments/logical-working-materials.ts';
import {MATERIALS_RECIPES} from '../experiments/working-materials-content.ts';
import type {Action, Part, State} from '../experiments/working-materials-types.ts';
export const flatten = (p:Part):Part[] => [p,...p.children.flatMap(c=>flatten(c.part))];
export const pretty = (s:string) => s.replace(/[-_]/g,' ').replace(/^./,c=>c.toUpperCase());
export function composition(p:Part):string {const names=[...new Set(flatten(p).filter(p=>p.kind!=='assembly').map(p=>pretty(p.label)))];return names.slice(0,4).join(' + ')+(names.length>4?' +…':'');}
export function label(s:State,id:string):string {
 const o=s.boards.find(b=>b.id===s.map)?.objects.find(o=>o.id===id);
 if(o)return `${o.initialKey?pretty(o.initialKey):o.design.startsWith('assembly:')?composition(o.root):pretty(o.design)} · ${o.id.split(':')[1]}`;
 const d=s.designs.find(d=>d.id===id);return d?(d.id.startsWith('assembly:')?composition(d.root):pretty(d.label)):pretty(id.replace(/^place:/,''));
}
export function freshRecipePartners(s:State,id:string):string[]{return MATERIALS_RECIPES.filter(r=>!s.known.includes(r.result)&&s.known.includes(r.a)&&s.known.includes(r.b)&&(r.a===id||r.b===id)).map(r=>r.a===id?r.b:r.a);}
export function exactPreview(s:State,a:Action){const next=stepWorkingMaterials(s,a);return {next,accepted:next.accepted,learned:next.known.filter(k=>!s.known.includes(k)),responses:next.response};}
