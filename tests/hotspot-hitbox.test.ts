import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {lintStory} from '../src/lint/lint.ts';
import {lintPlacementGeometry} from '../src/lint/placement.ts';
import {hotspotCentre, hotspotHTML, hotspotRect} from '../src/web/hotspot-view.ts';

const source = `# Receiving geometry
## Work
background: ![room](room.svg)
**Goals**
- Charge -- Charged
**Hotspots**
- Panels (at 50%, 30%)
  - icon: ![panels with long cable](panels.svg)
  - hitbox: (at 25%, 30%) (size 20%, 12%)
  - place: Charged (at 25%, 30%)
**Items**
- Panels
- Battery
**Combinations**
- Charged
- Battery [transform] @ Panels -> Charged (tutorial)`;
const errors = (text:string) => lintStory(parseStory(text),{analysis:false}).filter(d=>d.severity==='error');

test('receiving geometry preserves artwork coordinates, recipes and declarations',()=>{
  const story=parseStory(source),h=story.hotspots['name:Panels'];
  assert.deepEqual(errors(source),[]);
  assert.equal(h.x,.5);assert.equal(h.y,.3);
  assert.deepEqual(h.hitbox&&[h.hitbox.x,h.hitbox.y,h.hitbox.width,h.hitbox.height],[.25,.3,.2,.12]);
  assert.deepEqual(hotspotCentre(h,0),{x:97.5,y:253.2});
  const html=hotspotHTML(h,0,{className:'hotspot-icon',style:'--icon-width:300px;--icon-height:100px;',html:''});
  assert.match(html,/left:97.5px;top:253.2px/);
  assert.match(html,/--hit-width:78px;--hit-height:101.28px/);
  assert.match(html,/--art-offset-x:97.5px;--art-offset-y:0px/);
  assert.equal(story.recipes.length,1);assert.equal(Object.keys(story.items).length,3);
});

test('hitbox errors are source-located and do not invent item identities',()=>{
  for(const [before,after,code] of [
    ['(size 20%, 12%)','(size 0%, 12%)','hitbox-position'],
    ['(at 25%, 30%) (size','(at 101%, 30%) (size','hitbox-position'],
    ['(size 20%, 12%)','(size twenty%, 12%)','hitbox-syntax'],
    ['(panels.svg)','(panels.svg) (circular)','hitbox-circular'],
    ['  - place: Charged','  - hitbox: (at 24%, 30%) (size 20%, 12%)\n  - place: Charged','conflicting-hitbox'],
  ]){
    const text=source.replace(before,after),diagnostic=errors(text).find(d=>d.code===code);
    assert(diagnostic,code);assert(text.slice(diagnostic.span.from,diagnostic.span.to).length>0);
  }
  const misplaced=source.replace('- Battery\n','- Battery\n  - hitbox: (at 25%, 30%) (size 20%, 12%)\n');
  assert(errors(misplaced).some(d=>d.code==='hitbox-context'));
  assert.equal(Object.keys(parseStory(misplaced).items).length,3);
});

test('receiving rectangle governs placements, minimum touch size and invalid-preview fallback',()=>{
  const story=parseStory(source),h=story.hotspots['name:Panels'];
  const measurement={id:h.id,chapter:0,width:78,height:101.28};
  assert.deepEqual(lintPlacementGeometry(story,[measurement]),[]);
  const outside=parseStory(source.replace('place: Charged (at 25%','place: Charged (at 50%'));
  assert.equal(lintPlacementGeometry(outside,[measurement])[0]?.code,'place-outside-hotspot');
  const rect=hotspotRect(h,0,{width:20,height:10});
  assert.equal(rect.width,44);assert.equal(rect.height,44);assert.equal(rect.x+rect.width/2,97.5);
  const invalid=parseStory(source.replace('(size 20%, 12%)','(size -1%, 12%)')).hotspots[h.id];
  assert.deepEqual(hotspotCentre(invalid,0),{x:195,y:253.2});
  assert(!hotspotHTML(invalid,0,{className:'hotspot-icon',style:'',html:''}).includes('hotspot-hitbox'));
  const circular=hotspotRect({...h,icon:undefined},0,{width:300,height:100,circular:true});
  assert.equal(circular.x+circular.width/2,195,'a circular fallback supplied by item artwork ignores invalid rectangle metadata');
});

test('circular compatibility uses effective artwork from the receiver chapter onward',()=>{
  const inherited=`# Evolving artwork
## Work
background: ![room](room.svg)
**Goals**
- Charge -- Charged
**Hotspots**
- \`panels\` (at 50%, 30%)
  - hitbox: (at 25%, 30%) (size 20%, 12%)
**Items**
- \`panels\` Panels
  - icon: ![default round panel](round.svg) (circular)
  - from chapter "Work" icon: ![rectangular panel](rect.svg)
- Battery
  - icon: ![battery](battery.svg)
- Charged
  - icon: ![charged battery](charged.svg)
**Combinations**
- Battery [transform] @ \`panels\` -> Charged (tutorial)`;
  assert.deepEqual(errors(inherited),[],'a default overridden before any receiver exists is never displayed');
  const earlier=inherited.replace('## Work','## Earlier\nEarlier equipment.\n## Work')
    .replace('  - from chapter "Work"','  - from chapter "Earlier" icon: ![earlier round panel](earlier.svg) (circular)\n  - from chapter "Work"');
  assert(!errors(earlier).some(d=>d.code==='hitbox-circular'),'earlier circular presentation is overridden before receiver appears');
  const current=inherited.replace('  - from chapter "Work" icon: ![rectangular panel](rect.svg)\n','');
  assert(errors(current).some(d=>d.code==='hitbox-circular'),'the effective default still rejects circular art');
  const later=inherited.replace('  - from chapter "Work" icon: ![rectangular panel](rect.svg)',
    '  - from chapter "Work" icon: ![rectangular panel](rect.svg)\n  - from chapter "Later" icon: ![later round panel](later.svg) (circular)')
    +'\n## Later\nThe earlier board remains visible.\n';
  assert(errors(later).some(d=>d.code==='hitbox-circular'),'future circular art also affects the surviving earlier receiver');
  const local=later.replace('- `panels` (at 50%, 30%)','- `panels` (at 50%, 30%)\n  - icon: ![local rectangle](local.svg)');
  assert(!errors(local).some(d=>d.code==='hitbox-circular'),'local hotspot art supersedes every item presentation');
});
