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
