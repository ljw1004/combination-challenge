import fs from 'node:fs';import {createGame,applyAction} from '../../engine/model.ts';
const dir=import.meta.dirname,s=JSON.parse(fs.readFileSync(dir+'/food.json','utf8')),route=JSON.parse(fs.readFileSync(dir+'/food-route-evidence.json','utf8'));let g=createGame(s),events=[],checks=[];
function act(a){const r=applyAction(s,g,a);if(!r.accepted)throw Error(JSON.stringify(a)+r.message);g=r.game;events.push({action:a,message:r.message,stage:g.state.stage});}
for(const a of route.actionsLog){
 if(a.type==='advance'&&g.state.stage===1){
  for(const pair of [['fruit','yogurt'],['yogurt','fruit']]){const r=applyAction(s,g,{type:'combine',a:pair[0],b:pair[1]});if(!r.accepted)throw Error('Fruit yogurt rejected '+pair);checks.push({name:'fruit yogurt orientation '+pair.join('+'),passed:true});}
  act({type:'combine',a:'fruit',b:'yogurt'});
 }
 act(a);
 if(a.type==='advance'&&g.state.stage===1){const here=g.state.tokens.filter(t=>t.area===g.state.currentArea).map(t=>t.kind);if(!here.includes('fruit')||here.includes('millstone')||here.includes('press'))throw Error('Dairy packing failed');checks.push({name:'Dairy packs optional fruit but leaves irrelevant hearth tools',passed:true,visible:here});}
 if(a.type==='combine'&&g.state.stage===2&&g.state.discovered.includes('butter')&&!g.state.discovered.includes('bread-and-butter')){
  for(const pair of [['bread','butter'],['butter','bread']]){const r=applyAction(s,g,{type:'combine',a:pair[0],b:pair[1]});if(!r.accepted)throw Error('Bread/butter rejected '+pair);checks.push({name:'bread and butter orientation '+pair.join('+'),passed:true});}
  act({type:'combine',a:'bread',b:'butter'});
 }
}
if(!g.state.completed)throw Error('Optional branch route incomplete');
fs.writeFileSync(dir+'/food-optional-evidence.json',JSON.stringify({completed:true,checks,metrics:g.state.metrics,events,limits:'Author-aware engine tests, not a new blind or human playtest.'},null,2)+'\n');console.log('Food optional branches pass both orientations; final game completes.');
