import fs from 'node:fs';import {createGame,applyAction} from '../../engine/model.ts';
const p=import.meta.dirname,s=JSON.parse(fs.readFileSync(`${p}/scenario.json`,'utf8')),base=JSON.parse(fs.readFileSync(`${p}/baseline-v5.json`,'utf8')),actions=JSON.parse(fs.readFileSync(`${p}/goal-route.json`,'utf8'));
if(JSON.stringify(s.items.find((i:any)=>i.id==='experimental-protocol'))!==JSON.stringify(base.items.find((i:any)=>i.id==='experimental-protocol')))throw Error('Imported protocol redefined');
let g=createGame(s);const incorporated:any[]=[];let imported=false,fieldCombinations=0;
for(const a of actions){const before=g.state;const r=applyAction(s,g,a);if(!r.accepted)throw Error(r.message);g=r.game;
 if(a.type==='advance'&&s.stages[g.state.stage].id==='fields'){const original=before.tokens.find(t=>t.kind==='experimental-protocol'),now=g.state.tokens.find(t=>t.kind==='experimental-protocol');if(!original||!now||original.id!==now.id||now.area!=='area-fields')throw Error('Protocol not physically recollected');imported=true;}
 if(r.recipe?.startsWith('fields-')){fieldCombinations++;const recipe=s.recipes.find((q:any)=>q.id===r.recipe),out=g.state.tokens.find(t=>t.id===r.created);for(const id of r.retired??[]){if(!recipe.retire?.some((q:any)=>q.item===id&&q.reason)||!out?.incorporated.includes(id))throw Error('Missing incorporation provenance');incorporated.push({recipe:r.recipe,item:id,into:r.created});}}
}
if(fieldCombinations!==10||!imported||!g.state.completed)throw Error('Field route incomplete');
const exhibit=g.state.tokens.find(t=>t.kind==='field-explained-exhibit');if(!exhibit||!incorporated.every(r=>exhibit.incorporated.includes(r.item)))throw Error('Exhibit lost transitive record provenance');
const report={passed:true,scope:'Author-route import identity and justified conceptual sheet incorporation, not human play',fieldCombinations,originalProtocolRecollected:imported,incorporated,finalExhibitIncludes:exhibit.incorporated};fs.writeFileSync(`${p}/module-provenance-evidence.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,fieldCombinations,incorporatedCount:incorporated.length}));
