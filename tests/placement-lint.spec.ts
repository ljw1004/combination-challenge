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
- H (at 50%, 50%)
${icon ? `  - icon: ![area](${icon})\n` : ''}  - place: A (at ${x}%, 50%)
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
    const repeated=parseStory('# Local art\n## First\nbackground: ![room](room.svg)\n**Items**\n- H\n  - icon: ![default](hit.svg)\n- A\n**Hotspots**\n- H (at 50%, 50%)\n  - place: A (at 60%, 50%)\n## Second\nbackground: ![room](room.svg)\n**Hotspots**\n- H (at 50%, 50%)\n  - icon: ![small](tiny.svg)\n  - place: A (at 60%, 50%)',{file:join(directory,'story.md')});
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
    wide.hotspots['name:H'].placements![0].y=.56;
    expect(await checker.lint(wide)).toEqual([]); // 17.55 units below centre, inside 22.
    wide.hotspots['name:H'].placements![0].y=.6;
    expect((await checker.lint(wide)).map(d=>d.code)).toEqual(['place-outside-hotspot']);
  } finally { await checker.close(); rmSync(directory,{recursive:true,force:true}); }
});
