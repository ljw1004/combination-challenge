import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {parseStory} from '../src/story/parser.ts';
import {lintStory} from '../src/lint/lint.ts';
import {lintStoryImages} from '../src/lint/images.ts';
import {newGame} from '../src/engine/game.ts';

const manuscript = (body: string) => `# Icon workshop\n## Start\n![room](https://example.com/room.webp)\n\n${body}`;
const iconErrors = (text: string) => lintStory(parseStory(text), {analysis: false}).filter(diagnostic => diagnostic.code.includes('icon'));

test('item icons and aligned slot overlays retain source spans without creating references or wonders', () => {
  const markdown = manuscript([
    '**Items**',
    '- House (compound)',
    '  - icon: ![base](assets/house.png)',
    '  - slot: opening, accepts "Glass, clear", icon: ![overlay](assets/window.png)',
    '  - unnamed slot: accepts Mat, icon: ![overlay](https://example.com/mat.png?size=224,224)',
    '',
    '  A shelter with room for two fittings.',
    '- "Glass, clear"',
    '  - icon: ![glass](assets/glass.png) (circular)',
    '- Mat',
    '  - icon: ![mat](assets/mat.png)',
  ].join('\n')).replaceAll('\n', '\r\n');
  const story = parseStory(markdown, {file: 'workshop/story.md'}), house = story.items['name:House'];
  assert.deepEqual(Object.keys(story.items).sort(), ['name:Glass, clear', 'name:House', 'name:Mat']);
  assert.equal(house.icon?.url, 'assets/house.png');
  assert.equal(house.icon?.circular, false);
  assert.equal(story.items['name:Glass, clear'].icon?.circular, true);
  assert.equal(house.slots[0].accepts, 'name:Glass, clear');
  assert.equal(house.slots[0].icon?.url, 'assets/window.png');
  assert.equal(house.slots[1].icon?.url, 'https://example.com/mat.png?size=224,224');
  assert.deepEqual(house.wonders.map(wonder => wonder.markdown), ['A shelter with room for two fittings.']);
  assert.deepEqual(story.recipes.map(recipe => recipe.installation), ['name:Glass, clear', 'name:Mat']);
  for (const icon of [house.icon!, ...house.slots.map(slot => slot.icon!)]) {
    assert.equal(icon.source.file, 'workshop/story.md');
    assert.equal(markdown.slice(icon.source.span!.from, icon.source.span!.to).startsWith('icon:'), true);
  }
  assert.deepEqual(iconErrors(markdown), []);
});

test('one item or slot icon requires icons on all global identities and slots, including implicit references', () => {
  const base = manuscript('**Items**\n- House (compound)\n  - unnamed slot: accepts Window\n  - unnamed slot: accepts Mat\n**Combinations**\n- House [preserve] + Tool [preserve] -> Home');
  assert.deepEqual(iconErrors(base), [], 'ordinary text stories keep their existing syntax');
  const slotOnly = base.replace('accepts Window', 'accepts Window, icon: ![overlay](window.png)');
  const missing = iconErrors(slotOnly);
  assert.equal(missing.filter(error => error.code === 'missing-item-icon').length, 5);
  assert.equal(missing.filter(error => error.code === 'missing-slot-icon').length, 1);
  assert(missing.some(error => error.message.startsWith('Home needs an icon')));
  assert(missing.some(error => error.message.startsWith('Tool needs an icon')));
  const itemOnly = base.replace('- House (compound)', '- House (compound)\n  - icon: ![base](house.png)');
  assert.equal(iconErrors(itemOnly).filter(error => error.code === 'missing-slot-icon').length, 2);
});

test('slot icon punctuation preserves accepted item names containing an unquoted comma', () => {
  const story = parseStory(manuscript('**Items**\n- Frame (compound)\n  - unnamed slot: accepts Glass,clear, icon: ![fitted](glass.png)\n- Glass,clear'));
  assert.equal(story.items['name:Frame'].slots[0].accepts, 'name:Glass,clear');
  assert.deepEqual(Object.keys(story.items).sort(), ['name:Frame', 'name:Glass,clear']);
});

test('malformed, misplaced and conflicting icon declarations are diagnostics rather than extra items', () => {
  const markdown = manuscript([
    '**Items**', '- Earth',
    '  - icon: ![earth](earth.png) (circular)',
    '  - icon: ![same metadata](earth.png) (circular)',
    '  - icon: ![different](planet.png)',
    '- Air', '  - icon: air.png',
    '- icon: ![orphan](orphan.png)',
    '**Combinations**', '- Earth [preserve] + Air [preserve] -> Dust',
    '  - icon: ![nested result](dust.png)',
  ].join('\n'));
  const story = parseStory(markdown), codes = story.diagnostics.map(diagnostic => diagnostic.code);
  assert.deepEqual(Object.keys(story.items).sort(), ['name:Air', 'name:Dust', 'name:Earth']);
  assert.equal(story.items['name:Earth'].icon?.url, 'earth.png');
  assert.equal(story.items['name:Dust'].icon, undefined);
  assert.equal(codes.filter(code => code === 'conflicting-icon').length, 1);
  assert.equal(codes.filter(code => code === 'icon-syntax').length, 1);
  assert.equal(codes.filter(code => code === 'icon-placement').length, 2);
  for (const diagnostic of story.diagnostics) assert(markdown.slice(diagnostic.span.from, diagnostic.span.to).startsWith('icon:'));
});

test('declaring icons preserves primitive introduction chapters and derived metadata semantics', () => {
  const markdown = manuscript([
    '**Goals**', '- Build -- Result', '**Items**',
    '- Earth', '  - icon: ![earth](earth.png)',
    '- Tool', '  - icon: ![tool](tool.png)',
    '- Result', '  - icon: ![result](result.png)',
    '**Combinations**', '- Earth [preserve] + Tool [preserve] -> Result',
    '## Later', '![room](https://example.com/room.webp)', '**Items**',
    '- Water', '  - icon: ![water](water.png)',
  ].join('\n'));
  const story = parseStory(markdown), state = newGame(story);
  assert.deepEqual(Object.keys(state.tokens).sort(), ['name:Earth', 'name:Tool']);
  assert.deepEqual(story.chapters[1].items.map(item => item.id), ['name:Water']);
  assert.deepEqual(iconErrors(markdown), []);
});

test('CLI artwork lint checks item and slot icon files relative to the manuscript', () => {
  const folder = mkdtempSync(join(tmpdir(), 'combination-icons-'));
  try {
    const markdown = manuscript([
      '> NOTE: ![unused](author-note.png)', '**Items**',
      '- House (compound)', '  - icon: ![house](house.png)',
      '  - unnamed slot: accepts Window, icon: ![fitted](window-overlay.png)',
      '- Window', '  - icon: ![window](https://example.com/window.png)',
    ].join('\n')).replaceAll('\n', '\r\n');
    const story = parseStory(markdown, {file: join(folder, 'story.md')});
    let diagnostics = lintStoryImages(story, markdown);
    assert.deepEqual(diagnostics.map(diagnostic => markdown.slice(diagnostic.span.from, diagnostic.span.to)), ['house.png', 'window-overlay.png']);
    assert(diagnostics.every(diagnostic => diagnostic.code === 'missing-image' && diagnostic.severity === 'error'));
    writeFileSync(join(folder, 'house.png'), 'existing base');
    writeFileSync(join(folder, 'window-overlay.png'), 'existing overlay');
    diagnostics = lintStoryImages(story, markdown);
    assert.deepEqual(diagnostics, []);
  } finally { rmSync(folder, {recursive: true, force: true}); }
});

test('hotspot artwork retains coordinates and contextual recipes without introducing item icons', () => {
  const text = manuscript(`**Goals**
- Shape it -- Bowl
**Hotspots**
- Kiln yard (at 78%, 65%)
  - icon: ![yard](yard.png)
  - Clay [transform] + Fire [preserve] -> Bowl
> NOTE: Hotspot centre is on the right firing ground.
**Items**
- Clay
- Fire
## Return
![yard](https://example.com/yard.webp)
**Hotspots**
- Kiln yard (at 78%, 65%)
  - icon: ![same yard](yard.png)
  - icon: ![conflicting](other.png)
`);
  const story = parseStory(text), hotspot = story.hotspots['name:Kiln yard'];
  assert.deepEqual(Object.keys(story.items).sort(), ['name:Bowl', 'name:Clay', 'name:Fire']);
  assert.equal(hotspot.x, .78); assert.equal(hotspot.y, .65);
  assert.equal(hotspot.icon?.url, 'yard.png');
  assert.equal(story.recipes.length, 1);
  assert.equal(story.recipes[0].hotspot, hotspot.id);
  assert.deepEqual(iconErrors(text).map(d => d.code), ['conflicting-icon']);
  assert.deepEqual(Object.keys(newGame(story).tokens).sort(), ['name:Clay', 'name:Fire']);
  const missing = lintStoryImages(story, text).filter(d => d.code === 'missing-image');
  assert(missing.length > 0);
  assert(missing.every(d => text.slice(d.span.from, d.span.to) === 'yard.png'));
});

test('primitive icon centres accept either marker order and preserve authoritative metadata', () => {
  const text = manuscript(`**Items**
- Air
  - icon: ![air](air.png) (at 70%, 80%) (circular)
  - icon: ![same](air.png) (circular) (at 70%, 80%)
- House (compound)
  - icon: ![house](house.png) (at 20.5%, 30%)
  - unnamed slot: accepts Window, icon: ![fitted](fitted.png)
- Window
  - icon: ![window](window.png)
`).replaceAll('\n', '\r\n');
  const story = parseStory(text), icon = story.items['name:Air'].icon!;
  assert.deepEqual(icon.position, {x:.7,y:.8}); assert.equal(icon.circular,true);
  assert.equal(text.slice(icon.source.span!.from,icon.source.span!.to),'icon: ![air](air.png) (at 70%, 80%) (circular)');
  assert.deepEqual(iconErrors(text),[], 'implicit installation does not make a compound derived');
  const conflict=text.replace('![same](air.png) (circular) (at 70%, 80%)','![same](air.png) (at 71%, 80%) (circular)');
  assert.deepEqual(iconErrors(conflict).map(d=>d.code),['conflicting-icon']);
  assert.deepEqual(parseStory(conflict).items['name:Air'].icon?.position,{x:.7,y:.8});
});

test('icon starting positions reject derived identities even when their producer appears later', () => {
  const text=manuscript(`**Items**
- Steam
  - icon: ![steam](steam.png) (at 70%, 80%)
- Water
  - icon: ![water](water.png)
- Fire
  - icon: ![fire](fire.png)
## Later
![place](https://example.com/room.webp)
**Combinations**
- Water [preserve] + Fire [preserve] -> Steam
`);
  const errors=iconErrors(text);
  assert.deepEqual(errors.map(d=>d.code),['derived-icon-position']);
  assert(text.slice(errors[0].span.from,errors[0].span.to).startsWith('icon: ![steam]'));
});

test('icon start coordinates validate ranges, duplicate markers and placement context', () => {
  for(const suffix of ['(at -1%, 20%)','(at 20%, 101%)'])assert.deepEqual(iconErrors(manuscript(`**Items**\n- Air\n  - icon: ![air](air.png) ${suffix}`)).map(d=>d.code),['icon-position']);
  for(const suffix of ['(at 20, 30%)','(at NaN%, 20%)','(circular) (circular)','(at 20%, 30%) (at 20%, 30%)','(square)'])assert(iconErrors(manuscript(`**Items**\n- Air\n  - icon: ![air](air.png) ${suffix}`)).some(d=>d.code==='icon-syntax'));
  const text=manuscript(`**Hotspots**
- Shore (at 70%, 80%)
  - icon: ![shore](shore.png) (at 20%, 30%)
**Items**
- House (compound)
  - icon: ![house](house.png)
  - unnamed slot: accepts Window, icon: ![fitted](fitted.png) (at 20%, 30%)
- Window
  - icon: ![window](window.png)
`);
  assert.deepEqual(iconErrors(text).map(d=>d.code),['icon-position','icon-position']);
});
