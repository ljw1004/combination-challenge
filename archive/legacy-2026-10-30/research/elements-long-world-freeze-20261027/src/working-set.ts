/** View projection only. No recipe or canonical state is changed by changing work places. */
import * as m from './elements-discovery-model.ts';
export const PLACES=['hearth','garden','workshop','shore','study','courtyard'] as const;
export type Place=typeof PLACES[number];
const groups:Record<Place,string[]>={
hearth:['clay','bowl','glazed-bowl','flour','dough','flatbread','juice','starter','risen-dough','bread','cider','vinegar','feast','jam','fruit-tart','salad','campfire','oil-lamp','soap'],
garden:['rain','plant','wood','grain','fruit','orchard','field','potted-plant','terrarium','greenhouse','trellis','flowers','seeds','seedbed','dye','cold-frame','ash','lye','oil','sprouts','garden','climbing-garden','well','irrigated-field','farm'],
workshop:['stone','sand','brick','glass','charcoal','torch','kiln','glaze','fiber','thread','cloth','rope','basket','ore','metal','axe','planks','blade','saw','hammer','nails','crate','wheel','pulley','crane','cushion','bucket','waterwheel','mill','sawmill','windmill','oil-wick','oilcloth','dyed-cloth','embroidery'],
shore:['sail','raft','sailboat','net','fishing-raft','fishing-boat','houseboat','river-picnic','picnic-basket','dock','footbridge','bridge','ferry','cargo-ferry','covered-landing','lighthouse','mailboat'],
study:['paper','drawing','book','library','lens','telescope','observatory','ink','letter','picture-book','music-book','star-chart','herbarium','rain-gauge','windsock','pressed-flowers','greeting-card','colored-paper','star-atlas','botanical-display','bookshelf','display-case','children-library'],
courtyard:['window','house','lantern','tent','pottery-workshop','curtains','swing','flute','drum','kite','cradle','hourglass','floor','cart','arch','courtyard','public-garden','bench','tower','bell','belfry','banner','signpost','puppet','puppet-theatre','wind-chimes','whistle','painting','gallery','courtyard-theatre','signal-tower','cargo-cart','awning']};
export const owner=(out:string):Place=>{const p=PLACES.find(p=>groups[p].includes(out));if(!p)throw Error('Unassigned output '+out);return p;};
export function legalRecipes(s:m.State){const k=new Set(s.tokens.map(t=>t.kind));return m.RECIPES.filter(r=>!k.has(r.out)&&k.has(r.a)&&k.has(r.b)&&(!r.at||s.revealed.includes(r.at)));}
/** Known prerequisite frontier across ALL alternatives, stopping at already known subassemblies. */
export function frontier(s:m.State,targets:string[]){const known=new Set(s.tokens.map(t=>t.kind)),visible=new Set<string>(),seen=new Set<string>();function visit(out:string){if(known.has(out)){visible.add(out);return;}if(seen.has(out))return;seen.add(out);for(const r of m.RECIPES.filter(r=>r.out===out)){visit(r.a);visit(r.b);}}for(const t of targets)if(!known.has(t))visit(t);return visible;}
export function goalBench(s:m.State){const goals=m.goalStates(s).filter(g=>!g.current);const targets=m.concepts.filter(c=>goals.some(g=>g.requires.some(cap=>m.hasCapability({kind:c.id},cap)))).map(c=>c.id);return frontier(s,targets);}
export function placeBench(s:m.State,p:Place){return frontier(s,groups[p]);}
/** Selecting an on-bench item brings every currently legal known partner, irrespective of place. */
export function selectedBench(s:m.State,base:Set<string>,selected:string){if(!base.has(selected))throw Error('Select a visible item');const shown=new Set(base);for(const r of legalRecipes(s))if(r.a===selected||r.b===selected){shown.add(r.a);shown.add(r.b);}return shown;}
