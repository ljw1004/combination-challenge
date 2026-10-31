import {test} from 'node:test';
import assert from 'node:assert/strict';
import {BOARDS,VERSION,createState,preview,apply,next,solved,goalSatisfied,offers} from '../experiments/logical-ideas-history-provenance.ts';
import type {State,Action} from '../experiments/logical-ideas-history-provenance.ts';
const board=(n:number):State=>({...createState(),board:n,ideas:structuredClone(BOARDS[n].ideas)});
const act=(s:State,op:Action['op'],a:string,b:string)=>{const p=preview(s,{op,a,b}),r=apply(s,{op,a,b});assert.equal(r.accepted,true);assert.deepEqual(r.state.ideas.at(-1),p.idea);return r.state;};
test('all starts are unsolved; there is no stock or hidden record',()=>{for(let i=0;i<BOARDS.length;i++)assert.equal(solved(board(i)),false);assert.equal(createState().version,VERSION);});
test('a copied account is useful for transmission',()=>{let s=act(board(0),'apply','copy','observations');assert(solved(s));assert.deepEqual(s.ideas.find(i=>i.id==='copy'),BOARDS[0].ideas[1]);});
test('copies and collection cannot fake independent comparison',()=>{const s=board(1);assert.deepEqual(preview(s,{op:'compare',a:'field',b:'copy'}).idea.claims,{});const c=preview(s,{op:'collect',a:'field',b:'garden'}).idea;assert(c.claims.reed.every(p=>p.length===1));assert(!goalSatisfied({...s,ideas:[c]},{label:'test',domain:'claim',members:Object.keys(c.claims),support:'independent'}));});
test('independent matching sources work',()=>{assert(solved(act(board(1),'compare','field','garden')));});
test('translation does not turn distinct original specimens into agreement',()=>{let s=board(2);s=act(s,'translate','structure','vocabulary');s=act(s,'translate','growth','vocabulary');const p=preview(s,{op:'compare',a:'i4',b:'i5'});assert.deepEqual(Object.keys(p.idea.claims),['thin']);assert(solved(act(s,'compare','i4','i5')));});
test('comparison before translation reaches the same honest result in fewer actions',()=>{let s=act(board(2),'compare','structure','growth');s=act(s,'translate','i4','vocabulary');assert(solved(s));});
test('full constructive witness uses public combines with accurate previews',()=>{
 let s=createState();const witnesses:Action[][]=[
 [{op:'apply',a:'copy',b:'observations'}],
 [{op:'compare',a:'field',b:'garden'}],
 [{op:'compare',a:'structure',b:'growth'},{op:'translate',a:'i4',b:'vocabulary'}],
 [{op:'translate',a:'collection',b:'catalogue'},{op:'compare',a:'i7',b:'practice'},{op:'apply',a:'i8',b:'core'},{op:'apply',a:'collection',b:'intact'},{op:'translate',a:'i10',b:'catalogue'},{op:'apply',a:'i11',b:'mineral'}],
 [{op:'collect',a:'north',b:'south'},{op:'apply',a:'i7',b:'stone'},{op:'compare',a:'north',b:'south'},{op:'compare',a:'north',b:'east'},{op:'collect',a:'i9',b:'i10'}],
 [{op:'apply',a:'field',b:'portable'},{op:'compare',a:'field',b:'bench'},{op:'apply',a:'i9',b:'structure'},{op:'compare',a:'garden',b:'bench'},{op:'collect',a:'i10',b:'i11'},{op:'compare',a:'field',b:'garden'},{op:'apply',a:'i13',b:'living'},{op:'translate',a:'i14',b:'lessons'},{op:'apply',a:'i9',b:'portable'},{op:'translate',a:'i16',b:'lessons'},{op:'collect',a:'i15',b:'i17'}]
 ];
 for(let i=0;i<witnesses.length;i++){for(const a of witnesses[i])s=act(s,a.op,a.a,a.b);assert(solved(s),BOARDS[i].id);if(i<witnesses.length-1)s=next(s);}assert.equal(s.moves,26);
});
test('all offered actions are legal and all exact existing results remain disclosed',()=>{const s=board(1);for(const o of offers(s))assert.deepEqual(o, {action:o.action,...preview(s,o.action)});});
test('bad typed pairs and unknown operations cannot change state',()=>{const s=board(1),copy=structuredClone(s);assert.throws(()=>preview(s,{op:'both',a:'field',b:'garden'}));assert.deepEqual(s,copy);});
