/** Source-aware regression audit, not a second fresh-player trial. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {applyAction,checkpoint,dropAction,stageComplete,token} from '../../engine/model.ts';
import type {Scenario} from '../../schema/scenario.ts';

const root=new URL('../../',import.meta.url);
const read=(p:string)=>readFileSync(new URL(p,root),'utf8');
const s:Scenario=JSON.parse(read('scenario.json'));
const expected='6ab0bd320f9d286c3ce44fe07706a5d740cf15abb036f6408032253c98db1ba4';

test('Newly made, unplaced roux accepts milk or broth directly in both drag directions',()=>{
 assert.equal(createHash('sha256').update(read('scenario.json')).digest('hex'),expected);
 assert.equal(read('scenario.json'),read('fresh-pastry-v1/scenario.json'));
 assert.equal(s.recipes.find(r=>r.id==='white-roux')!.at,'saucepan');
 for(const id of ['bechamel','veloute'])assert.equal(s.recipes.find(r=>r.id===id)!.at,undefined);
 for(const width of [320,360,600])for(const reverseRoux of [false,true])for(const reverseSauce of [false,true])for(const liquid of ['milk','broth']){
  let g=checkpoint(s,'sauce',width);
  const unheated=applyAction(s,g,dropAction(s,g.state,'flour','butter'));
  assert(!unheated.accepted,'Making roux must still distinguish the hot saucepan from the cold bench');
  const source=reverseRoux?'butter':'flour',target=reverseRoux?'flour':'butter';
  const placed=applyAction(s,g,dropAction(s,g.state,target,'@saucepan'));assert(placed.accepted);g=placed.game;
  const cooked=applyAction(s,g,dropAction(s,g.state,source,target));assert(cooked.accepted);assert.equal(cooked.recipe,'white-roux');g=cooked.game;
  assert.equal(token(g.state,'white-roux')!.location,null,'The test must exercise newly spawned, unplaced roux');
  const sauce=applyAction(s,g,dropAction(s,g.state,reverseSauce?'white-roux':liquid,reverseSauce?liquid:'white-roux'));
  assert(sauce.accepted,sauce.message);assert.equal(sauce.recipe,liquid==='milk'?'bechamel':'veloute');
  assert.equal(sauce.game.state.metrics.placements-g.state.metrics.placements,0);
 }
});

test('The frozen fresh-player gesture sequence still completes with only its extra roux placement omitted',()=>{
 const doc=JSON.parse(read('fresh-pastry-v1/pilots/sessions/fresh_pastry_a.json'));
 let g=checkpoint(s,'pastry',360),dropped=0,attempts=0,rejected=0;
 for(const event of doc.interactions){
  if(event.command!=='drop')continue;
  const [a,b]=event.args;
  if(a==='white-roux'&&b==='@saucepan'){dropped++;continue;}
  const result=applyAction(s,g,dropAction(s,g.state,a,b));attempts++;if(!result.accepted)rejected++;g=result.game;
  if(result.accepted&&stageComplete(s,g.state)){const next=applyAction(s,g,{type:'advance'});assert(next.accepted);g=next.game;}
 }
 assert.equal(dropped,1);assert.equal(attempts,22);assert.equal(rejected,1);
 assert.equal(g.state.stage,8);assert(g.state.discovered.includes('veloute'));
 assert.deepEqual(g.state.discovered,doc.game.state.discovered);
 assert.deepEqual(g.state.recipesUsed,doc.game.state.recipesUsed);
});
