import assert from 'node:assert/strict';
import {scenario as s,foodSessionPlan} from '../ui/stories/food-small-sessions-v1.ts';
import type {Action,Recipe} from '../schema/campaign.ts';
import * as M from '../engine/campaign.ts';
export type FoodReplayOptions={width?:number;seed?:number;mode?:'required'|'all'|'alternate';drop?:boolean;reverse?:boolean;verifyEach?:boolean};
const local=(g:M.Game)=>g.state.tokens.filter(t=>t.location===g.state.currentLocation);
export function replayFood(options:FoodReplayOptions={}){
 const {width=390,mode='all',drop=false,reverse=false,verifyEach=false}=options;let seed=options.seed??0;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 let g=M.createGame(s,width);const rows:{chapter:string;arrival:number;peak:number;hotspots:number;arrivalItems:string[];peakItems:string[]}[]=[],actions:Action[]=[],used:string[]=[],retirements:{recipe:string;retired:string[];retainedTransformedInput?:string}[]=[],arrivals:any[]=[];
 const step=(a:Action)=>{const before=g,r=M.applyAction(s,g,a);assert(r.accepted,`${mode}/${width}/${s.chapters[g.state.chapter].id}: ${JSON.stringify(a)} ${r.message}`);g=r.game;actions.push(a);if(r.recipe){used.push(r.recipe);const recipe=s.recipes.find(x=>x.id===r.recipe)!,primary=Object.entries(recipe.lifecycle??{}).find(([,l])=>l.role==='transform')?.[0];retirements.push({recipe:r.recipe,retired:r.retired??[],...(primary&&!(r.retired??[]).includes(primary)?{retainedTransformedInput:primary}:{})});}
  if(verifyEach){const undone=M.undo(g).game;assert.deepEqual(undone.state.tokens,before.state.tokens,'Undo restores exact source ownership and positions');assert.deepEqual(undone.state.hotspots,before.state.hotspots);}
  for(const t of g.state.tokens){assert(t.x>=48&&t.x<=g.state.width-48,`${t.id} horizontal bound`);assert(t.y-M.tokenHeight(s,t)/2>=0&&t.y+M.tokenHeight(s,t)/2<=844,`${t.id} vertical bound`);}
  const row=rows.at(-1);if(row&&a.type!=='advance'&&local(g).length>row.peak){row.peak=local(g).length;row.peakItems=local(g).map(t=>t.kind);}return r;};
 for(const plan of foodSessionPlan){assert.equal(s.chapters[g.state.chapter].id,plan.id);rows.push({chapter:plan.id,arrival:local(g).length,peak:local(g).length,hotspots:g.state.hotspots.filter(h=>h.location===g.state.currentLocation).length,arrivalItems:local(g).map(t=>t.kind),peakItems:local(g).map(t=>t.kind)});
  const chosen=new Set<string>();
  const need=(kind:string)=>{if(g.state.discovered.includes(kind))return;const candidates=plan.work.map(id=>s.recipes.find(r=>r.id===id)!).filter(r=>r.out===kind);assert(candidates.length,`No local preparation ${plan.id}/${kind}`);const r=mode==='alternate'?candidates.at(-1)!:candidates[0];for(const input of[r.a,r.b])if(!input.startsWith('@'))need(input);chosen.add(r.id);};
  if(mode==='all')for(const id of plan.work)chosen.add(id);else for(const o of s.chapters[g.state.chapter].objectives){if(o.item)need(o.item);else if(o.capability==='departure-dessert')need(mode==='alternate'?'iced-chocolate-cake':'vanilla-sandwich');else if(o.capability==='departure-service')for(const id of['load-supper-meal',mode==='alternate'?'load-chocolate-cake':'load-vanilla-cake','load-apple-juice','load-sealed-provisions'])chosen.add(id);}
  const pending=new Set<Recipe>(plan.work.filter(id=>chosen.has(id)).map(id=>s.recipes.find(r=>r.id===id)!));
  while(pending.size){for(const r of pending)if(r.out&&g.state.discovered.includes(r.out)||r.install&&M.token(g.state,r.install.target)?.slots[r.install.slot]===r.install.component)pending.delete(r);if(!pending.size)break;
   const tokens=new Set(local(g).map(t=>t.kind)),ready=[...pending].filter(r=>[r.a,r.b].every(id=>id.startsWith('@')||tokens.has(id)));assert(ready.length,`No ready recipe ${plan.id}: ${[...pending].map(r=>r.id)}`);
   const r=options.seed!==undefined?ready[Math.floor(random()*ready.length)]:mode==='alternate'||reverse?ready.at(-1)!:ready[0];let a=r.a,b=r.b;if(reverse&&!b.startsWith('@'))[a,b]=[b,a];
   if(r.at)step({type:'place',item:b,hotspot:r.at});assert(M.partners(s,g.state,a).outgoing.includes(b),`Normal legal highlight ${a} -> ${b}`);
   step(drop?{type:'drop',item:a,target:b}:{type:'combine',a,b});pending.delete(r);
  }
  if(plan.id==='trolley')step({type:'place',item:'supper-trolley',hotspot:'dining-car-trolley'});
  assert(M.chapterComplete(s,g.state),plan.id+' goals');assert.deepEqual(M.restore(s,JSON.stringify(g)),g,'Save restore before departure');
  const before=g;step({type:'advance'});
  if(!g.state.completed){
   const carried=new Set(g.events.at(-1)?.transfers?.map(t=>t.item));for(const t of before.state.tokens){const after=M.token(g.state,t.id);assert(after,'Travel cannot remove '+t.id);if(!carried.has(t.id))assert.deepEqual(after,t,'Earlier panel preserves leftover '+t.id);}
   for(const h of before.state.hotspots)assert.deepEqual(g.state.hotspots.find(p=>p.id===h.id),h,'Earlier hotspot never moves');
   const stocks=s.locationPlan!.locations.find(l=>l.id===g.state.currentLocation)!.stockBatches.flatMap(b=>b.items);for(const id of stocks)assert(M.token(g.state,id),'Ordinary stock present on entry '+id);
   arrivals.push({chapter:s.chapters[g.state.chapter].id,carried:[...carried],leftBehind:before.state.tokens.filter(t=>!carried.has(t.id)).map(t=>t.id),footprint:M.locationFootprint(s,g.state,g.state.currentLocation)});
  }
 }
 assert(g.state.completed);assert.deepEqual(M.restore(s,JSON.stringify(g)),g);return {options,rows,actions,used,retirements,arrivals,game:g};
}
