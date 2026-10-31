import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { storyIds, loadStory } from '../src/story/load.ts';
import { lintStoryImages } from '../src/lint/images.ts';

test('discovery and CLI loading support shared artwork and ambiguous short names', () => {
  const root = mkdtempSync(join(tmpdir(), 'combination-manuscripts-'));
  try {
    mkdirSync(join(root, 'shared/assets'), {recursive: true});
    mkdirSync(join(root, 'other'));
    writeFileSync(join(root, 'shared/assets/bg.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
    writeFileSync(join(root, 'shared/first.md'), '# First\n\n## Opening\n![scene](assets/bg.svg)');
    writeFileSync(join(root, 'shared/second.md'), '# Second\n\n## Opening\n![scene](assets/bg.svg)');
    assert.deepEqual(storyIds(root), ['shared/first.md', 'shared/second.md']);
    for (const name of ['first', 'second']) {
      const {story, markdown, path} = loadStory(name, root);
      assert.equal(path, `shared/${name}.md`);
      assert.deepEqual(lintStoryImages(story, markdown), []);
    }
    writeFileSync(join(root, 'other/first.md'), '# Other first\n\n## Opening');
    assert.throws(() => loadStory('first', root), /Ambiguous story first/);
    assert.equal(loadStory('shared/first.md', root).story.title, 'First');
    assert.equal(loadStory('other/first.md', root).story.title, 'Other first');
    assert.throws(() => loadStory('../outside.md', root), /Unknown story/);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
