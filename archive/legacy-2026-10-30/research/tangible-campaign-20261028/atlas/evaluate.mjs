import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {M,L,engineRoot} from './runtime.mjs';
const root=fileURLToPath(new URL('.',import.meta.url));
const s=JSON.parse(readFileSync(root+'scenario.json','utf8'));
const chapters=JSON.parse(readFileSync(root+'chapters.json','utf8'));
const errors=[...M.validateScenario(s),...L.validateContentLifecycles([s]),...L.validateObjectiveFlow([s]),...L.validateConstructionContinuity([s])];
if(errors.length)throw Error(errors.join('\n'));
const producers=new Map(s.recipes.map(r=>[r.out,r]));
const needed=new Set();
function need(x){if(needed.has(x))return;needed.add(x);const r=producers.get(x);if(r){need(r.a);need(r.b);}}
for(const st of s.stages)for(const o of st.objectives)need(o.item);
let g=M.createGame(s),made=new Map(),rows=[],actions=[],peak=0,transfers=[];
function act(a){const before=g;const result=M.applyAction(s,g,a);if(!result.accepted)throw Error(JSON.stringify({a,message:result.message,stage:s.stages[g.state.stage].id}));g=result.game;actions.push(a);peak=Math.max(peak,g.state.tokens.filter(t=>t.area===g.state.currentArea).length);for(const t of g.events.at(-1)?.transfers??[]){const old=before.state.tokens.find(q=>q.id===t.item);if(!old)throw Error('Conjured transfer '+t.item);transfers.push({...t,stage:g.state.stage});}return result;}
for(let i=0;i<s.stages.length;i++){
 const st=s.stages[i],ch=chapters[i],used=new Set(),startTokens=g.state.tokens.filter(t=>t.area===g.state.currentArea).length;let stagePeak=startTokens,count=0;
 for(const id of ch.recipes){const r=s.recipes.find(r=>r.id===id);if(!needed.has(r.out))continue;
  for(const x of [r.a,r.b])if(made.has(x)&&made.get(x)<i)used.add(x);
  if(r.at)act({type:'place',item:r.b,location:r.at});
  const result=act({type:'combine',a:r.a,b:r.b});made.set(result.created,i);count++;stagePeak=Math.max(stagePeak,g.state.tokens.filter(t=>t.area===g.state.currentArea).length);
 }
 if(!M.stageComplete(s,g.state))throw Error('Unfinished '+st.id);
 rows.push({chapter:st.id,year:ch.era,combinations:count,earlierCreatedUsed:[...used],arrivalTokens:startTokens,peakTokens:stagePeak});act({type:'advance'});
}
const report={scenario:s.id,kind:'Author-generated logical-engine replay; not browser, independent discovery, or human fun evidence',enginePath:engineRoot+'/engine/model.ts',completed:g.state.completed,recipes:s.recipes.length,requiredCombinations:rows.reduce((n,x)=>n+x.combinations,0),optionalRecipes:s.recipes.filter(r=>!needed.has(r.out)).map(r=>r.id),chapters:rows,missing:rows.slice(1).filter(x=>!x.earlierCreatedUsed.length),peakLocalTokens:peak,placements:actions.filter(a=>a.type==='place').length,transferCount:transfers.length,nonAdjacentTransfers:transfers.filter(t=>s.stages.findIndex(st=>st.area.id===t.from)!==t.stage-1).length,validationErrors:errors};
writeFileSync(root+'evaluation.json',JSON.stringify(report,null,2)+'\n');writeFileSync(root+'author-route.json',JSON.stringify(actions,null,2)+'\n');writeFileSync(root+'transfer-evidence.json',JSON.stringify(transfers,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
