/** Current layout successor: no browser/UI claims, no rule-state exclusions. */
import test from 'node:test';import assert from 'node:assert/strict';
import * as M from '../experiments/tangible-campaign/engine/model.ts';
import * as Prior from '../experiments/tangible-campaign/reviews/grouped-arrivals/predecessor/engine/model.ts';
import {routeSpecs,routeActions,scenarioFor} from '../experiments/tangible-campaign/integration/reviewed-routes.ts';
import {encodeSave,decodeSave} from '../experiments/tangible-campaign/ui/save-codec.ts';
/** These are the ONLY newly authorised differences: x/y layout and its optional
 * separator state. IDs, areas, location associations, supplies, complete object
 * contents, goals, history, every action/event and all metrics remain exact. */
const withoutGeometry=(game:M.Game|Prior.Game)=>{
 const copy=structuredClone(game) as M.Game;
 for(const st of [...copy.history,copy.state]){delete st.arrivalLayout;for(const t of [...st.tokens,...st.places]){t.x=0;t.y=0;}}
 return copy;
};
for(const spec of routeSpecs)test('grouped-arrival current rule/event/history parity: '+spec.key,()=>{
 const s=scenarioFor(spec.key);let current=M.createGame(s),prior=Prior.createGame(s);assert.deepEqual(withoutGeometry(current),withoutGeometry(prior));
 for(const a of routeActions(spec.source)){
  const old=Prior.applyAction(s,prior,a),now=M.applyAction(s,current,a);assert.equal(now.accepted,old.accepted);assert(now.accepted,now.message);current=now.game;prior=old.game;
  assert.deepEqual(withoutGeometry(current),withoutGeometry(prior),s.id+': '+JSON.stringify(a));
  if(a.type==='advance'&&!current.state.completed&&!current.state.arrival!.supplies.length&&current.state.currentArea===current.history.at(-1)!.currentArea&&!current.events.at(-1)!.transfers?.length){
   assert.deepEqual(current.state.tokens,current.history.at(-1)!.tokens,'stationary no-delivery chapter must not reflow');assert.deepEqual(current.state.places.filter(p=>current.history.at(-1)!.places.some(old=>old.id===p.id)),current.history.at(-1)!.places,'existing places stay fixed; newly authored locations may appear');
  }
 }
 assert(current.state.completed);assert.deepEqual(M.restore(s,JSON.stringify(prior)),prior,'published saves load without rearrangement or invented divider');
 assert.deepEqual(M.restore(s,JSON.stringify(decodeSave(encodeSave({game:current,tops:{},seen:[]})).game)),current);
});
