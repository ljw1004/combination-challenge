import fs from 'node:fs';
import {createGame,applyAction} from '../../engine/model.ts';
const p='/workspace/shared/combination-campaign-research-20261027/ideas/revision-v6';
const s=JSON.parse(fs.readFileSync(p+'/scenario.json','utf8'));
const actions=JSON.parse(fs.readFileSync(p+'/goal-route.json','utf8'));
let g=createGame(s), protocolID=null, fieldCount=0, retirements=[];
for(const action of actions){
 const before=g.state; const result=applyAction(s,g,action);if(!result.accepted)throw Error('Rejected '+JSON.stringify(action));g=result.game;
 const protocol=g.state.tokens.find(t=>t.kind==='experimental-protocol');
 if(protocol){if(protocolID&&protocolID!==protocol.id)throw Error('Protocol replaced'); protocolID=protocol.id;}
 if(result.recipe?.startsWith('fields-')){
 fieldCount++;if(!protocol||protocol.area!=='area-fields')throw Error('Missing actual protocol in field collection');
 const recipe=s.recipes.find(r=>r.id===result.recipe);const out=g.state.tokens.find(t=>t.id===result.created);
 for(const entry of recipe.retire??[]){
  if(![recipe.a,recipe.b].includes(entry.item))throw Error('Retired nonoperand');
  if(entry.item==='experimental-protocol')throw Error('Protocol consumed');
  if(!out.incorporated.includes(entry.item))throw Error('Missing incorporation');
  if(g.state.tokens.some(t=>t.kind===entry.item))throw Error('Retired sheet left live');
  retirements.push(entry.item);
 }
 }
}
const exhibit=g.state.tokens.find(t=>t.kind==='field-explained-exhibit');
if(!exhibit||!retirements.every(x=>exhibit.incorporated.includes(x)))throw Error('Missing transitive sheet');
if(!g.state.completed||fieldCount!==10)throw Error('Incomplete');
console.log(JSON.stringify({completed:g.state.completed,fieldCount,protocolID,retiredSheets:retirements.length,finalIncorporationCount:exhibit.incorporated.length,protocolStillPresent:g.state.tokens.some(t=>t.id===protocolID)},null,2));
