/** Assert that illustration metadata has not altered the established campaign. */
import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {parseStory} from '../../src/story/parser.ts';
import {newGame} from '../../src/engine/game.ts';
import {lintStoryImages} from '../../src/lint/images.ts';

const read=(id:string)=>{const file=`stories/${id}/story.md`,text=readFileSync(file,'utf8');return {text,story:parseStory(text,{file})};};
const original=read('elements'),edition=read('elements-icons');
const clean=(value:unknown):unknown=>Array.isArray(value)?value.map(clean):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([key])=>!['source','goalsSource','icon','x','y'].includes(key)).map(([key,val])=>[key,clean(val)])):value;
const items=(s:typeof original.story)=>Object.values(s.items).sort((a,b)=>a.id.localeCompare(b.id)).map(clean);
assert.deepEqual(items(edition.story),items(original.story));
assert.deepEqual(clean(edition.story.recipes),clean(original.story.recipes));
assert.deepEqual(clean(edition.story.hotspots),clean(original.story.hotspots));
const produced=new Set(original.story.recipes.filter(r=>!r.installation).map(r=>r.result.id));
const chapters=(s:typeof original.story)=>s.chapters.map(({image,items,...chapter})=>({...clean(chapter) as object,supplies:[...new Set(items.filter(i=>!produced.has(i.id)).map(i=>i.id))].sort()}));
assert.deepEqual(chapters(edition.story),chapters(original.story));
assert.deepEqual(Object.keys(newGame(edition.story).tokens).sort(),Object.keys(newGame(original.story).tokens).sort());
assert.deepEqual(edition.story.diagnostics,[]);
assert(Object.values(edition.story.items).every(i=>i.icon));
assert(Object.values(edition.story.hotspots).every(h=>h.icon&&h.x!==undefined&&h.y!==undefined));
assert.deepEqual(lintStoryImages(edition.story,edition.text),[]);
for(const item of Object.values(edition.story.items))for(const slot of item.slots)assert(slot.icon&&existsSync(`stories/elements-icons/${slot.icon.url}`));
console.log('Illustrated edition preserves every item, wonder, recipe, goal, supply and chapter; all artwork paths exist.');
