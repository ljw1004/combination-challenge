import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {Scenario} from '../schema/scenario.ts';

/** Exact inverse for historical-source assertions, never used by the runtime or
 * save loader. Later independent successors must be stripped first if they
 * change one of these fields. No broad ignore-list or weakened comparison. */
const ledger=JSON.parse(readFileSync(new URL('../reviews/retained-anomalies/semantic-delta.json',import.meta.url),'utf8'));
export function beforeRetainedAnomalies(s:Scenario):Scenario{
 const before=structuredClone(s);
 for(const c of [...ledger.changes].reverse()){
  if(c.world!==s.id)continue;
  let owner:any=(before as any)[c.collection].find((entity:any)=>entity.id===c.id);
  assert(owner,`Missing reviewed entity ${c.world}/${c.collection}/${c.id}`);
  for(const key of c.path.slice(0,-1)){assert(owner[key],`Missing reviewed path ${c.id}/${c.path.join('/')}`);owner=owner[key];}
  const key=c.path.at(-1);
  assert.equal(Object.hasOwn(owner,key),c.afterPresent,`Reviewed successor field presence ${c.id}/${c.path.join('/')}`);
  if(c.afterPresent)assert.deepEqual(owner[key],c.after,`Exact reviewed successor ${c.id}/${c.path.join('/')}`);
  if(c.beforePresent)owner[key]=structuredClone(c.before);else delete owner[key];
 }
 return before;
}
export const retainedAnomalyLifecycleChanges=ledger.changes.filter((c:any)=>c.path[0]==='lifecycle');
