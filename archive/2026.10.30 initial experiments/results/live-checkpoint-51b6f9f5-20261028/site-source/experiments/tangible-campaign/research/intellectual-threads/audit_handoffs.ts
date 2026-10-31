/** Report what the existing game actually transfers and reuses, before redesign. */
import{readFileSync,writeFileSync}from'node:fs';
import{scenarios}from'../../ui/scenarios.ts';
import*as M from'../../engine/model.ts';
type Handoff={world:string;from:string;to:string;from_title:string;to_title:string;existing_travel_text:string;generic_travel_text:boolean;transferred_items:string[];transferred_items_used_in_next_challenge:string[];immediate_previous_goal_items_used:string[];note:string};
const rows:Handoff[]=[];
for(const id of ['atlas-of-questions-v8-transmission-actions','food']){
 const s=scenarios.find(s=>s.id===id)!,evidence=JSON.parse(readFileSync(new URL('../../evidence/'+id+'-route-evidence.json',import.meta.url),'utf8'));
 const perStage:{actions:any[];transfers:{item:string;from:string;to:string}[]}[]=s.stages.map(()=>({actions:[],transfers:[]}));let g=M.createGame(s);
 for(const a of evidence.actionsLog){const index=g.state.stage;perStage[index].actions.push(a);const r=M.applyAction(s,g,a);if(!r.accepted)throw Error(r.message);g=r.game;if(a.type==='advance'&&g.state.stage!==index)perStage[g.state.stage].transfers=g.events.at(-1)!.transfers??[];}
 for(let i=1;i<s.stages.length;i++){
  const stage=s.stages[i],prior=s.stages[i-1];
  const used=new Set(perStage[i].actions.flatMap((a:any)=>a.type==='combine'?[a.a,a.b]:a.type==='place'?[a.item]:[]));
  const priorGoals=prior.objectives.flatMap(o=>o.item?[o.item]:[]);
  rows.push({world:id,from:prior.id,to:stage.id,from_title:prior.title,to_title:stage.title,existing_travel_text:stage.area.travelText,generic_travel_text:/We collect the tools this collection needs|We are taking the useful things with us/.test(stage.area.travelText),transferred_items:perStage[i].transfers.map(t=>t.item),transferred_items_used_in_next_challenge:perStage[i].transfers.filter(t=>used.has(t.item)).map(t=>t.item),immediate_previous_goal_items_used:priorGoals.filter(k=>used.has(k)),note:'Direct item use is one form of continuity. An evidenced idea/problem can also bridge a transition; neither a shared tool nor a travel sentence alone proves intellectual influence.'});
 }
}
const counts=Object.fromEntries([...new Set(rows.map(r=>r.world))].map(id=>{const a=rows.filter(r=>r.world===id);return[id,{transitions:a.length,generic_travel_text:a.filter(r=>r.generic_travel_text).length,previous_goal_item_reused:a.filter(r=>r.immediate_previous_goal_items_used.length).length,earlier_item_transferred_and_used:a.filter(r=>r.transferred_items_used_in_next_challenge.length).length}];}));
writeFileSync(new URL('./thread-audit.json',import.meta.url),JSON.stringify({source_commit:'3eba9ca5213b49035593be1a2d846a4a17d7d074',counts,transitions:rows},null,2)+'\n');console.log(counts);
