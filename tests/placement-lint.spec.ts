import {test, expect} from '@playwright/test';
import {mkdtempSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {parseStory} from '../src/story/parser.ts';
import {ArtworkBrowser} from '../src/lint/artwork-browser.ts';

test('CLI placement lint measures transparent, fractional, small, and text hotspot rectangles using the player CSS', async () => {
  const directory = mkdtempSync(join(tmpdir(),'combination-placement-'));
  const checker = new ArtworkBrowser();
  try {
    writeFileSync(join(directory,'room.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="780" height="1688"></svg>');
    writeFileSync(join(directory,'hit.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="321" height="320"></svg>');
    writeFileSync(join(directory,'tiny.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"></svg>');
    const story = (icon: string, x: number) => parseStory(`# Hit area
## Work
background: ![room](room.svg)
**Goals**
- Put A here -- A @ H
**Hotspots**
- H (center 390px, 844px)
${icon ? `  - icon: ![area](${icon})\n` : ''}  - place: A (center ${x*780/100}px, 844px)
**Items**
- H
- A`, {file:join(directory,'story.md')});
    // 321/4 = 80.25px wide; this point is inside its actual fractional edge.
    expect(await checker.lint(story('hit.svg',60.28))).toEqual([]);
    expect((await checker.lint(story('hit.svg',61))).map(d => d.code)).toEqual(['place-outside-hotspot']);
    // Tiny art retains the player's 44px minimum hit area.
    expect(await checker.lint(story('tiny.svg',55))).toEqual([]);
    expect((await checker.lint(story('tiny.svg',56))).map(d => d.code)).toEqual(['place-outside-hotspot']);
    expect(await checker.lint(story('',60))).toEqual([]);
    expect((await checker.lint(story('',70))).map(d => d.code)).toEqual(['place-outside-hotspot']);
    const repeated=parseStory('# Local art\n## First\nbackground: ![room](room.svg)\n**Items**\n- H\n  - icon: ![default](hit.svg)\n- A\n**Hotspots**\n- H (center 390px, 844px)\n  - place: A (center 468px, 844px)\n## Second\nbackground: ![room](room.svg)\n**Hotspots**\n- H (center 390px, 844px)\n  - icon: ![small](tiny.svg)\n  - place: A (center 468px, 844px)',{file:join(directory,'story.md')});
    const diagnostics=await checker.lint(repeated);
    expect(diagnostics.map(d=>d.code)).toEqual(['place-outside-hotspot']);
    expect(diagnostics[0].message).toContain('Second');
    // Conditional artwork must be checked at its own size, even before its
    // trigger has been created. The initial wider icon alone would pass.
    const conditional = story('hit.svg',60);
    const source = conditional.hotspots['name:H'].source;
    conditional.hotspots['name:H'].iconChanges = [{after:{id:'name:A',slots:[]},icon:{url:'tiny.svg',circular:false,source},source}];
    const conditionalDiagnostics = await checker.lint(conditional);
    expect(conditionalDiagnostics.map(d=>d.code)).toEqual(['place-outside-hotspot']);
    expect(conditionalDiagnostics[0].message).toContain('tiny.svg');
    // A wide scene has a shorter coordinate space; vertical placement lint
    // must use its natural aspect ratio, just like the visible receiver.
    writeFileSync(join(directory,'wide.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="768"></svg>');
    const wide=story('tiny.svg',50);
    wide.chapters[0].image='wide.svg';
    wide.hotspots['name:H'].x=512;wide.hotspots['name:H'].y=384;
    wide.hotspots['name:H'].placements![0].x=512;
    wide.hotspots['name:H'].placements![0].y=430.08;
    expect(await checker.lint(wide)).toEqual([]); // 17.55 units below centre, inside 22.
    wide.hotspots['name:H'].placements![0].y=460.8;
    expect((await checker.lint(wide)).map(d=>d.code)).toEqual(['place-outside-hotspot']);
  } finally { await checker.close(); rmSync(directory,{recursive:true,force:true}); }
});

test('CLI checks background-pixel bounds without placements and uses inherited background dimensions', async () => {
  const directory = mkdtempSync(join(tmpdir(),'combination-pixel-bounds-')), checker = new ArtworkBrowser();
  try {
    writeFileSync(join(directory,'room.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"></svg>');
    const text = `# Pixel bounds
## First
background: ![room](room.svg)
**Hotspots**
- H (center 640px, 360px)
  - hitbox: (center 320.5px, 180.25px) (size 640px, 360px)
**Items**
- H
## Inherited
**Items**
- A
  - icon: ![A](a.png) (center 600px, 300px)`;
    const story = (value = text) => parseStory(value,{file:join(directory,'story.md')});
    expect(await checker.lint(story())).toEqual([]); // x=600 is valid although the reference pane is only 390 CSS px.
    for (const [before,after,code] of [
      ['center 640px','center 640.01px','hotspot-position'],
      ['size 640px','size 641px','hitbox-position'],
      ['center 600px','center 641px','icon-position'],
    ]) expect((await checker.lint(story(text.replace(before,after)))).map(d => d.code)).toEqual([code]);
    const missing = await checker.lint(story(text.replace('room.svg','missing.svg')));
    expect(missing.length).toBeGreaterThan(0);
    expect(missing.every(d => d.code === 'coordinate-geometry')).toBe(true);
  } finally { await checker.close(); rmSync(directory,{recursive:true,force:true}); }
});
