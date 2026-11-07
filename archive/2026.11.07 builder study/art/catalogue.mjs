#!/usr/bin/env node
// Production meaning catalogue, derived from the shared parser rather than a second story parser.
import {writeFileSync} from 'node:fs';
import {loadStory} from '../../../src/story/load.ts';
const [input,output]=process.argv.slice(2);
if(!input||!output)throw new Error('Usage: node art/catalogue.mjs STORY OUTPUT.json');
const {story,hash}=loadStory(input);
const short=id=>id.replace(/^id:/,'');
const producers=new Map();
for(const recipe of story.recipes){
 if(recipe.installation)continue;
 const id=recipe.result.id;
 const alternatives=producers.get(id)??[];
 alternatives.push(recipe);producers.set(id,alternatives);
}
const memo=new Map();
const merge=sources=>({materials:[...new Set(sources.flatMap(x=>x.materials))].sort(),
 states:[...new Set(sources.flatMap(x=>x.states))]});
function ancestry(ref,visiting=new Set()){
 const {id,slots=[]}=typeof ref==='string'?{id:ref}:ref;
 const key=id+'['+[...slots].sort().join(',')+']';
 if(memo.has(key))return memo.get(key);
 if(visiting.has(key))throw new Error(`Cyclic artwork ancestry: ${key}`);
 const next=new Set([...visiting,key]),recipes=producers.get(id);
 const variants=recipes?.map(recipe=>{
  const contributors=[recipe.a,recipe.b,recipe.at].filter(x=>x&&x.fate!=='preserve');
  const value=merge(contributors.map(x=>ancestry(x.ref,next)));
  value.states.push(short(id));return value;
 })??[{materials:[short(id)],states:[]}];
 // Alternate test orders may converge only when the fitted materials agree.
 // Never union incompatible constructions into an imaginary combined machine.
 if(variants.some(v=>JSON.stringify(v.materials)!==JSON.stringify(variants[0].materials)))
  throw new Error(`Alternative constructions need explicit distinct art: ${id}`);
 const value=merge([...variants,...slots.map(slot=>ancestry(slot,next))]);
 memo.set(key,value);return value;
}
const aliases={pinwheel:'pw','wind-racer':'wr','pinball-table':'pb','crank-dragon':'cd',
 periscope:'pe',kaleidoscope:'ka','lifting-crane':'lc','wave-machine':'wm',
 'pneumatic-grabber':'air','animation-drum':'film','guarded-rover':'rover',
 'drawing-rover':'rover','shadow-theatre':'theatre','balanced-lift':'lift',
 'lift-supported-module':'lc','lift-crane-sling':'lc'};
const catalogue={story:input,storyHash:hash,units:'metres',
 note:'Material ancestry records authored incorporation. Model factories explicitly handle folding, removed test fixtures, cam replacement, temporary tools and scene apparatus; this ancestry alone is not a physical proof.',
 chapters:story.chapters.map((c,i)=>({number:i+1,id:short(c.id),title:c.name,hotspots:c.hotspots.map(short)})),
 items:Object.values(story.items).map(item=>{
  const id=short(item.id),recipes=producers.get(item.id);
  return {id,name:item.name,family:aliases[id]??id.split('-')[0],primitive:!recipes,
   line:item.source.line,descriptions:item.wonders.map(w=>w.encyclopedia||w.popup),...ancestry(item.id),
   slots:item.slots.map(slot=>({accepts:short(slot.accepts),...ancestry(slot.accepts)})),
   ...(recipes?{recipes:recipes.map(recipe=>({inputs:[recipe.a,recipe.b,recipe.at].filter(Boolean).map(x=>({id:short(x.ref.id),slots:x.ref.slots.map(short),fate:x.fate})),line:recipe.source.line}))}:{})};
 })};
writeFileSync(output,JSON.stringify(catalogue,null,2)+'\n');
console.log(`${catalogue.items.length} artwork identities; ${catalogue.items.filter(i=>i.primitive).length} supplied parts/tool groups.`);
