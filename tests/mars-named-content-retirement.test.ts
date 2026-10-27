import test from 'node:test';import assert from 'node:assert/strict';
import {NAMED_RECIPES as R,NAMED_GOALS as G,NAMED_CONCEPTS as C} from '../src/mars-named-content.ts';
test('only broken-radio has an explicitly justified evolved-input retirement',()=>{
 const rows=R.filter(r=>r.retire?.length);assert.equal(rows.length,1);assert.equal(rows[0]!.id,'repair-radio');assert.deepEqual(rows[0]!.retire,['broken-radio']);assert(!rows[0]!.retire!.includes('cable'));
 for(const r of rows)for(const kind of r.retire!){assert([r.a,r.b].includes(kind));assert(C.some(c=>c.id===kind));assert(r.retirementReason?.trim());assert.equal(kind,'broken-radio');}
});
test('authored retired inputs have no other recipe, goal or later supply dependency',()=>{
 for(const r of R)for(const kind of r.retire??[]){assert(!R.some(other=>other.id!==r.id&&(other.a===kind||other.b===kind)),`${kind}: another recipe needs it`);assert(!G.some(g=>g.concept===kind),`${kind}: goal needs it`);const firstSuccessor=G.findIndex(g=>g.concept===r.result);assert(firstSuccessor>=0);assert(!G.slice(firstSuccessor+1).some(g=>g.supplies.includes(kind)),`${kind}: later objective supplies it`);}
 // No automatic retirement is inferred for other recipe leaves or everyday materials.
 assert(R.filter(r=>r.id!=='repair-radio').every(r=>!r.retire?.length));
});
