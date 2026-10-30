import {test} from 'node:test';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const path=process.env.BASELINE_ADAPTER;
test('read-only live baseline adapter: cache and future-use contract',{skip:!path},async()=>{
 const B=await import(pathToFileURL(path!).href);
 assert.deepEqual(B.caches.map((c:any)=>c.items.length),[9,12,8,0]);
 assert.equal(B.createNamed().tokens.length,9);
 for(const id of ['home','expedition','observations','complete']){
  const s=B.debugJump(id).state, before=JSON.stringify(s),visible=B.visibleTokens(s);
  assert.equal(JSON.stringify(s),before);
  if(id==='home')for(const k of ['frame','toolkit','tripod','battery'])assert(visible.some((t:any)=>t.kind===k),'Future baseline use hidden: '+k);
  for(const token of s.tokens)for(const p of B.compatibility(s,token.id))if(p.outgoing){assert(visible.some((t:any)=>t.id===token.id),'Active source hidden');if(!p.id.startsWith('place:'))assert(visible.some((t:any)=>t.id===p.id),'Active target hidden');}
 }
});
