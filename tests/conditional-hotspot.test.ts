import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStory} from '../src/story/parser.ts';
import {StoryLanguageDocument} from '../src/story/language-service.ts';
import {lintStory} from '../src/lint/lint.ts';
import {lintStoryImages} from '../src/lint/images.ts';
import {act, newGame, replay} from '../src/engine/game.ts';
import {hasCreated, hotspotPresentation} from '../src/engine/presentation.ts';
import {changedHotspotArtwork, currentArtwork, lookaheadArtwork, placementArtwork, resultArtwork} from '../src/web/artwork-plan.ts';
import {reconcileLiveStory} from '../src/web/live-story.ts';
import {conditionalWorld} from './fixtures/conditional-hotspot.ts';

const impact = {type: 'combine', a: 'id:asteroid', hotspot: 'id:world'} as const;
const illuminate = {type: 'combine', a: 'id:sun', hotspot: 'id:world'} as const;
const consumeMoon = {type: 'combine', a: 'id:moon', b: 'id:sun'} as const;
const errors = (text: string) => lintStory(parseStory(text), {analysis: false}).filter(d => d.severity === 'error');

test('conditional hotspot artwork follows authored order and retained discoveries without changing gameplay', () => {
  const story = parseStory(conditionalWorld), plain = parseStory(conditionalWorld.replace(/^.*icon after creating.*\n/gm, ''));
  assert.deepEqual(errors(conditionalWorld), []);
  let state = newGame(story), ordinary = newGame(plain);
  const icon = () => hotspotPresentation(story, state, 0, 'id:world').icon?.url;
  assert.equal(icon(), 'before.svg');
  for (const action of [illuminate, impact, consumeMoon]) {
    state = act(story, state, action); ordinary = act(plain, ordinary, action);
    assert.deepEqual(state, ordinary, 'appearance references do not add supplies, goals or engine actions');
    assert.equal(icon(), 'lit.svg', 'the last authored satisfied rule wins even if Moon is made later');
  }
  assert.equal(state.tokens['id:moon'].status, 'consume');
  assert.equal(hotspotPresentation(story, replay(story,state.actions), 0,'id:world').icon?.url, 'lit.svg');
  assert.equal(hotspotPresentation(story, newGame(story), 0,'id:world').icon?.url, 'before.svg');
});

test('hotspot rules inherit with a scene, remain local to its presentation and support fallback artwork', () => {
  const story = parseStory(conditionalWorld);
  let state = act(story, newGame(story), impact);
  state = act(story,state,consumeMoon);
  assert.equal(hotspotPresentation(story,state,0,'id:world').icon?.url,'impact.svg');
  assert.equal(hotspotPresentation(story,state,1,'id:world').icon?.url,'impact.svg');
  assert.equal(hotspotPresentation(story,state,2,'id:world').icon?.url,'revisited.svg');
  const fallback = parseStory(conditionalWorld.replace('  - icon: ![before](before.svg)\n',''));
  assert.equal(hotspotPresentation(fallback,newGame(fallback),0,'id:world').icon?.url,'default.svg');
  const edited = parseStory(conditionalWorld.replace('impact.svg','edited.svg'));
  const live = reconcileLiveStory(story,edited,state);
  assert.equal(hotspotPresentation(edited,live.state,0,'id:world').icon?.url,'edited.svg');
  assert.equal(live.state.tokens['id:moon'].status,'consume');
});

test('creation references include supplies, fitted parts and qualified compounds after retirement', () => {
  const story = parseStory('# Fittings\n## Work\n**Goals**\n- Finish -- Result\n**Items**\n- Owner (compound)\n  - slot: Part, accepts Part\n- Part\n- Tool\n- Result\n**Combinations**\n- Owner[Part] [consume] + Tool [preserve] -> Result');
  let state = newGame(story);
  assert(hasCreated(state,{id:'name:Part',slots:[]}));
  assert(!hasCreated(state,{id:'name:Owner',slots:['name:Part']}));
  state = act(story,state,{type:'combine',a:'name:Part',b:'name:Owner'});
  state = act(story,state,{type:'combine',a:'name:Owner',b:'name:Tool'});
  assert(hasCreated(state,{id:'name:Owner',slots:['name:Part']}));
  assert(hasCreated(state,{id:'name:Part',slots:[]}));
  const wrapped = parseStory('# Wrapped\n## Work\n**Goals**\n- Finish -- Owner[Part]\n**Items**\n- A\n- B\n- Owner (compound)\n  - slot: Part, accepts Part\n- Part\n**Combinations**\n- A + B -> Owner[Part]');
  const built = act(wrapped,newGame(wrapped),{type:'combine',a:'name:A',b:'name:B'});
  assert(hasCreated(built,{id:'name:Part',slots:[]}));
});

test('conditional references have exact editor spans and do not invent supplies or declarations', () => {
  const text = conditionalWorld.replace('after creating `moon`:', 'after creating "Moon: child":').replace('- `moon` Moon', '- "Moon: child"').replaceAll('`moon`','"Moon: child"').replaceAll('\n','\r\n');
  const document = new StoryLanguageDocument(text), position = text.indexOf('"Moon: child":') + 2;
  assert.deepEqual(errors(text), []);
  const reference = document.referenceAt(position)!;
  assert.equal(reference.role,'appearance');
  assert.equal(text.slice(reference.source.span.from,reference.source.span.to),'Moon: child');
  assert(document.definition(position).length);
  assert(document.semanticTokens().some(t=>t.range.from===reference.source.span.from));
  const missing = conditionalWorld.replace('after creating `moon`:', 'after creating `missing`:');
  assert(errors(missing).some(d=>d.code==='undeclared-id' && missing.slice(d.span.from,d.span.to)==='`missing`'));
  assert.equal(parseStory(missing).items['id:missing'],undefined);
  assert.equal(newGame(parseStory(missing)).tokens['id:missing'],undefined);
});

test('conditional icon lint rejects misplaced, malformed and unordered directives and checks assets and hitboxes', () => {
  const line = '  - icon after creating `moon`: ![after impact](impact.svg)';
  const cases: [string,string][] = [
    [conditionalWorld.replace(line,'  - icon after creating : ![after impact](impact.svg)'), 'conditional-icon-syntax'],
    [conditionalWorld.replace(line,line+'\n    - Nested'), 'conditional-icon-syntax'],
    [conditionalWorld.replace(line,'  - icon after creating `moon` Named: ![after impact](impact.svg)'), 'conditional-icon-syntax'],
    [conditionalWorld.replace(line,'  - icon after creating `moon`: ![after impact](impact.svg) (center 195px, 422px)'), 'icon-position'],
    [conditionalWorld.replace('  - icon: ![before](before.svg)\n','').replace(line,line+'\n  - icon: ![before](before.svg)'), 'hotspot-icon-order'],
    [conditionalWorld.replace('  - icon: ![before](before.svg)\n','').replace(line,line+'\n- `world`\n  - icon: ![before](before.svg)'), 'hotspot-icon-order'],
    [conditionalWorld.replace('  - icon: ![world](default.svg)','  - icon: ![world](default.svg)\n'+line), 'conditional-icon-context'],
    [conditionalWorld.replace(line,line.trimStart()), 'conditional-icon-context'],
    [conditionalWorld.replace(line,line+'\n  - hitbox: (center 195px, 253.2px) (size 78px, 168.8px)'), 'hitbox-circular'],
    [conditionalWorld.replace('after creating `moon`:', 'after creating `moon`[`sun`]:'), 'unknown-slot'],
  ];
  for (const [text,code] of cases) assert(errors(text).some(d=>d.code===code), `${code}: ${errors(text).map(d=>d.code)}`);
  const story = parseStory(conditionalWorld);
  assert(lintStoryImages(story,conditionalWorld).some(d=>conditionalWorld.slice(d.span.from,d.span.to)==='impact.svg'));
});

test('artwork planning includes imminent hotspot changes and every declared placement variant', () => {
  const story = parseStory(conditionalWorld), before = newGame(story);
  assert(!currentArtwork(story,before).includes('impact.svg'));
  assert(resultArtwork(story,before,impact).includes('impact.svg'));
  assert(lookaheadArtwork(story,before,true).includes('impact.svg'));
  const after = act(story,before,impact);
  assert(currentArtwork(story,after).includes('impact.svg'));
  assert(resultArtwork(story,after,illuminate).includes('lit.svg'));
  const placement = parseStory(conditionalWorld.replace('  - icon: ![before](before.svg)','  - place: `sun` (center 195px, 253.2px)\n  - icon: ![before](before.svg)'));
  assert.deepEqual(placementArtwork(placement),['space.svg','before.svg','impact.svg','lit.svg']);
});

test('later supplies prepare conditional artwork on an earlier fixed board', () => {
  const story = parseStory('# Later discovery\n## First\nbackground: ![scene](first.svg)\n**Items**\n- H\n**Hotspots**\n- H\n  - icon: ![before](before.svg)\n  - icon after creating Later: ![after](after.svg)\n## Second\nbackground: ![scene](second.svg)\n**Items**\n- Later');
  const before = newGame(story), after = act(story,before,{type:'advance'});
  assert.equal(before.tokens['name:Later'],undefined);
  assert.equal(after.tokens['name:H'].chapter,0);
  assert.deepEqual(changedHotspotArtwork(story,before,after),['after.svg']);
});
