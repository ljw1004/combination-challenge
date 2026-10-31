import {test, expect} from '@playwright/test';
import {mkdtempSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {parseStory} from '../src/story/parser.ts';
import {PlacementBrowser} from '../src/lint/placement-browser.ts';

test('CLI placement lint measures transparent, fractional, small, and text hotspot rectangles using the player CSS', async () => {
  const directory = mkdtempSync(join(tmpdir(),'combination-placement-'));
  const checker = new PlacementBrowser();
  try {
    writeFileSync(join(directory,'hit.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="321" height="320"></svg>');
    writeFileSync(join(directory,'tiny.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"></svg>');
    const story = (icon: string, x: number) => parseStory(`# Hit area
## Work
![room](room.svg)
**Goals**
- Put A here -- A @ H
**Hotspots**
- H (at 50%, 50%)
${icon ? `  - icon: ![area](${icon})\n` : ''}  - place: A (at ${x}%, 50%)
**Items**
- A`, {file:join(directory,'story.md')});
    // 321/4 = 80.25px wide; this point is inside its actual fractional edge.
    expect(await checker.lint(story('hit.svg',60.28))).toEqual([]);
    expect((await checker.lint(story('hit.svg',61))).map(d => d.code)).toEqual(['place-outside-hotspot']);
    // Tiny art retains the player's 44px minimum hit area.
    expect(await checker.lint(story('tiny.svg',55))).toEqual([]);
    expect((await checker.lint(story('tiny.svg',56))).map(d => d.code)).toEqual(['place-outside-hotspot']);
    expect(await checker.lint(story('',60))).toEqual([]);
    expect((await checker.lint(story('',70))).map(d => d.code)).toEqual(['place-outside-hotspot']);
  } finally { await checker.close(); rmSync(directory,{recursive:true,force:true}); }
});
