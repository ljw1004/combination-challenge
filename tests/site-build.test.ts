import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { build, createServer, type InlineConfig } from 'vite';
import { sitePages } from '../src/build/site.ts';

// Exercise a real root build on a disposable repository, including its second build.
test('root builds preserve sources, retire only owned bundles and serve fresh development templates', async () => {
  mkdirSync('runs', {recursive: true});
  const root = mkdtempSync(resolve('runs/site-build-'));
  const write = (path: string, text: string) => writeFileSync(join(root, path), text);
  const read = (path: string) => readFileSync(join(root, path), 'utf8');
  const config: InlineConfig = {
    configFile: false, root, cacheDir: join(root, '.vite'), base: './', appType: 'mpa', publicDir: false, logLevel: 'silent',
    plugins: [sitePages()],
    build: { outDir: '.', emptyOutDir: false, rolldownOptions: {input: {
      index: join(root, 'index-dev.html'), 'make-something': join(root, 'make-something-dev.html'),
    }} },
  };
  const runBuild = () => build({...config, plugins: [sitePages()]});
  let server: Awaited<ReturnType<typeof createServer>> | undefined;
  try {
    mkdirSync(join(root, 'stories/shared/assets'), {recursive: true});
    mkdirSync(join(root, 'assets'));
    write('stories/shared/story.md', '# First title\n\nbackground: ![start](assets/start.svg)\n\n![cover](assets/cover.svg)\n\n## Workshop\n');
    write('stories/shared/design-brief.md', '# Excluded brief\n');
    write('stories/shared/assets/cover.svg', '<svg xmlns="http://www.w3.org/2000/svg"/>');
    const index = '<!doctype html><div id="app"><!-- story-catalogue --></div><script type="module" src="/catalogue.js"></script>';
    const player = '<!doctype html><body data-catalogue="./index.html"><div>Player template</div><script type="module" src="/player.js"></script></body>';
    write('index-dev.html', index); write('make-something-dev.html', player);
    write('catalogue.js', 'document.body.dataset.catalogue = "one";');
    write('player.js', 'document.body.dataset.player = "one";');
    write('keep.txt', 'unrelated root file'); write('assets/keep.js', 'unrelated asset');
    await runBuild();
    assert.match(read('index.html'), /First title/);
    assert.match(read('index.html'), /href="make-something.html\?story=stories\/shared\/story.md"/);
    assert.match(read('index.html'), /src="stories\/shared\/assets\/cover.svg"/);
    assert.doesNotMatch(read('index.html'), /background:|start\.svg/);
    assert.doesNotMatch(read('index.html'), /Excluded brief|stories.json|\/catalogue.js|story-catalogue/);
    assert.doesNotMatch(read('make-something.html'), /\/player.js/);
    assert.equal(existsSync(join(root, 'dist')), false);
    assert.equal(existsSync(join(root, 'stories.json')), false);
    assert.equal(existsSync(join(root, 'combinations.html')), false);
    assert.equal(existsSync(join(root, 'shared')), false);
    const oldFiles: string[] = JSON.parse(read('assets/build-files.json'));
    assert(oldFiles.length > 0);
    write('player.js', 'document.body.dataset.player = "two";');
    await runBuild();
    const newFiles: string[] = JSON.parse(read('assets/build-files.json'));
    const retired = oldFiles.filter(file => !newFiles.includes(file));
    assert(retired.length > 0);
    for (const file of retired) assert.equal(existsSync(join(root, file)), false);
    for (const file of newFiles) assert(existsSync(join(root, file)));
    assert.equal(read('assets/keep.js'), 'unrelated asset');
    assert.equal(read('keep.txt'), 'unrelated root file');
    assert.equal(read('index-dev.html'), index);
    assert.equal(read('make-something-dev.html'), player);
    assert.equal(read('stories/shared/assets/cover.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
    await assert.rejects(build({...config, plugins: [sitePages()], build: {...config.build, emptyOutDir: true}}), /repository must never be emptied/);
    await assert.rejects(build({...config, plugins: [sitePages()], build: {...config.build, outDir: '..', emptyOutDir: true}}), /repository must never be emptied/);
    const builtPlayer = read('make-something.html');
    write('player.js', 'import "./does-not-exist.js";');
    await assert.rejects(runBuild());
    assert.equal(read('make-something.html'), builtPlayer);
    for (const file of newFiles) assert(existsSync(join(root, file)));
    write('player.js', 'document.body.dataset.player = "three";');
    write('stories/shared/story.md', '# Updated title\n\n![cover](assets/cover.svg)\n\n## Workshop\n');
    write('make-something-dev.html', player.replace('Player template', 'Fresh player template'));
    server = await createServer({...config, plugins: [sitePages()], server: {host: '127.0.0.1', port: 0}});
    await server.listen();
    const base = server.resolvedUrls!.local[0];
    for (const path of ['', 'index.html', 'index-dev.html']) {
      const html = await (await fetch(new URL(path, base))).text();
      assert.match(html, /Updated title/);
      assert.match(html, /@vite\/client/);
      assert.doesNotMatch(html, /First title/);
    }
    for (const path of ['make-something.html', 'make-something-dev.html', 'stories/shared/make-something.html']) {
      assert.match(await (await fetch(new URL(path, base))).text(), /Fresh player template/);
    }
    assert.match(await (await fetch(new URL('stories/shared/story.md', base))).text(), /Updated title/);
    assert.equal((await fetch(new URL('stories/shared/missing.md', base))).status, 404);
    assert.equal((await fetch(new URL('stories.json', base))).status, 404);
    for (const path of ['combinations.html', 'combinations-dev.html', 'stories/shared/combinations.html']) {
      assert.equal((await fetch(new URL(path, base))).status, 404);
    }
    assert.match(read('index.html'), /First title/); // Dev must not rewrite the committed build.
  } finally {
    await server?.close();
    rmSync(root, {recursive: true, force: true});
  }
});
