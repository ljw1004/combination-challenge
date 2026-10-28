import test from 'node:test';import assert from 'node:assert/strict';
import {s,readRoute,act} from './verify.ts';
import {checkpoint,token} from './engine/model.ts';
test('Skipped mustard preparations remain possible by revisiting their real stocks after salad handoff',()=>{
 let g=checkpoint(s,'salads');const begin=s.checkpoints!.find(c=>c.id==='salads')!.actions.length;
 for(const a of readRoute('plain-vinaigrette').slice(begin)){g=act(g,a);if(g.state.stage===5)break;}
 assert.equal(g.state.stage,5);assert(!token(g.state,'mustard-paste'));assert(!token(g.state,'mustard-dressing'));
 assert.equal(token(g.state,'ground-mustard')!.area,'salads-area');
 g=act(g,{type:'visit',area:'salads-area'});g=act(g,{type:'combine',a:'ground-mustard',b:'cider-vinegar'});g=act(g,{type:'combine',a:'mustard-paste',b:'vinaigrette'});
 assert(token(g.state,'mustard-paste'));assert(token(g.state,'mustard-dressing'));assert.equal(token(g.state,'roast-roots')!.area,'noodles-area');
 g=act(g,{type:'visit',area:'noodles-area'});assert.equal(g.state.stage,5);assert.equal(g.state.currentArea,'noodles-area');
});
