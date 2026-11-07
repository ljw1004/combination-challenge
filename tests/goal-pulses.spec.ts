import {test,expect,type Page,type Locator} from '@playwright/test';

const room = "background: ![room](data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='390' height='844'%3E%3Crect width='390' height='844' fill='%23eee2cb'/%3E%3C/svg%3E)";
const manuscript = `# Attention
## Workshop
${room}
Make something useful.
**Goals**
- Finish the longer job -- D
- Make the quick part -- E
- next: Finish the quick job -- F
**Items**
- A
- B
- Tool
- C
- D
- E
- F
**Combinations**
- A [preserve] + B [preserve] -> C
- C [preserve] + Tool [preserve] -> D
- A [preserve] + Tool [preserve] -> E
- E [preserve] + Tool [preserve] -> F
## Next workshop
Keep making things.
**Goals**
- Make the last part -- Last
**Combinations**
- D [preserve] + F [preserve] -> Last
`;
interface Pulse {row: string; text: string; frames: Keyframe[]}
type TracedWindow = Window & {pulses: Pulse[]};
const pulses = (page: Page) => page.evaluate(() => (window as unknown as TracedWindow).pulses);
const tile = (page: Page,name: string) => page.locator(`[data-item="name:${name}"]`);
const row = (page: Page,index: number) => page.locator(`[data-goal-row="${index}"]`);
async function open(page: Page,text = manuscript,acknowledgeGoals = true) {
  await page.clock.install();
  await page.addInitScript(() => {
    (window as unknown as TracedWindow).pulses = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function(frames,options) {
      if (this.matches('[data-goal-row]')) (window as unknown as TracedWindow).pulses.push({row:this.getAttribute('data-goal-row')!,text:this.textContent!,frames:frames as Keyframe[]});
      return animate.call(this,frames,options);
    };
  });
  await page.route('**/goal-pulses/story.md',route => route.fulfill({contentType:'text/markdown',body:text}));
  await page.goto('/make-something.html?story=goal-pulses/story.md');
  await page.getByRole('button',{name:'Start',exact:true}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  if (acknowledgeGoals) await readGoals(page);
}
async function readGoals(page: Page) {
  const point = await page.getByRole('button',{name:'Read this chapter'}).evaluate(element => {
    const r = element.getBoundingClientRect();
    for (const x of [.1,.5,.9]) for (const y of [.1,.5,.9]) {
      const point = {x:r.x+r.width*x,y:r.y+r.height*y};
      if (element.contains(document.elementFromPoint(point.x,point.y))) return point;
    }
    throw new Error('No uncovered goals point');
  });
  await page.mouse.click(point.x,point.y);
  await page.getByRole('button',{name:'Close',exact:true}).click();
}
async function pickup(page: Page,count = 1) {
  for (let i = 0; i < count; i++) await tile(page,i % 2 ? 'B' : 'A').click();
}
async function drag(page: Page,source: Locator,target: Locator) {
  const a = (await source.boundingBox())!, b = (await target.boundingBox())!;
  await page.mouse.move(a.x+a.width/2,a.y+a.height/2); await page.mouse.down();
  await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:4}); await page.mouse.up();
}
async function settled(page: Page) {
  await expect.poll(() => page.locator('[data-goal-row]').evaluateAll(rows => rows.flatMap(r => r.getAnimations()).filter(a => a.id === 'goal-pulse').length)).toBe(0);
}

test('sixth pickup pulses immediately while held and rapid dragging cannot starve or interrupt it',async ({page}) => {
  await open(page);
  await pickup(page,5); expect(await pulses(page)).toEqual([]);
  const a = (await tile(page,'A').boundingBox())!;
  await page.mouse.move(a.x+a.width/2,a.y+a.height/2); await page.mouse.down();
  expect((await pulses(page)).map(p => p.row)).toEqual(['1']);
  const animation = await row(page,1).evaluate(element => {
    const animation = element.getAnimations().find(a => a.id === 'goal-pulse')!;
    animation.pause(); animation.currentTime = 176;
    return {matrix:getComputedStyle(element).transform,background:getComputedStyle(element).backgroundColor,iterations:animation.effect!.getTiming().iterations};
  });
  expect(animation.iterations).toBe(1); expect(animation.matrix).toContain('1.2');
  expect(animation.background).toBe('rgb(255, 210, 74)');
  await page.mouse.move(a.x+a.width/2+35,a.y+a.height/2+35,{steps:3});
  const dragged = await tile(page,'A').boundingBox();
  expect(await row(page,1).evaluate(el => el.getAnimations().some(a => a.id === 'goal-pulse'))).toBe(true);
  await row(page,1).evaluate(element => element.getAnimations().forEach(a => a.finish()));
  await settled(page);
  expect(await tile(page,'A').boundingBox()).toEqual(dragged);
  await expect(tile(page,'A')).toHaveClass(/dragging/);
  await page.mouse.up();
  await pickup(page,12);
  expect((await pulses(page)).length).toBe(3);
});

test('goal changes pulse their own row; opening goals resets the reminder and reload does not replay it',async ({page}) => {
  await open(page);
  await drag(page,tile(page,'A'),tile(page,'Tool'));
  await expect(row(page,1)).toContainText('Finish the quick job');
  await expect.poll(async () => (await pulses(page)).map(p => p.text)).toEqual([expect.stringContaining('Finish the quick job')]);
  await settled(page);
  await pickup(page,5); await readGoals(page);
  await pickup(page); await page.clock.runFor(750); expect((await pulses(page)).length).toBe(1);
  await pickup(page,5); await expect.poll(async () => (await pulses(page)).length).toBe(2);
  await page.reload(); await page.clock.runFor(800); expect(await pulses(page)).toEqual([]);
});

test('a changed goal pulses immediately alongside its wonder',async ({page}) => {
  await open(page,manuscript.replace('\n- E\n','\n- E\n\n  A useful discovery.\n\n'));
  await drag(page,tile(page,'A'),tile(page,'Tool'));
  await expect(page.getByRole('dialog')).toContainText('A useful discovery.');
  expect((await pulses(page)).map(p => p.text)).toEqual([expect.stringContaining('Finish the quick job')]);
  expect(await row(page,1).evaluate(el => el.getAnimations().some(a => a.id === 'goal-pulse'))).toBe(true);
});

test('a wonder suppresses reminders until the second subsequent pickup',async ({page}) => {
  await open(page,manuscript.replace('\n- C\n','\n- C\n\n  A useful discovery.\n\n'));
  await pickup(page,4);
  await drag(page,tile(page,'A'),tile(page,'B'));
  await expect(page.getByRole('dialog')).toContainText('A useful discovery.');
  expect(await pulses(page)).toEqual([]);
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  expect(await pulses(page)).toEqual([]);
  await pickup(page); expect(await pulses(page)).toEqual([]);
  const a = (await tile(page,'A').boundingBox())!;
  await page.mouse.move(a.x+10,a.y+10); await page.mouse.down();
  expect((await pulses(page)).length).toBe(1);
  await page.mouse.up();
});

test('a wonder immediately cancels a reminder that began on the same pickup',async ({page}) => {
  await open(page,manuscript.replace('\n- C\n','\n- C\n\n  A useful discovery.\n\n'));
  await pickup(page,5);
  const a = (await tile(page,'A').boundingBox())!, b = (await tile(page,'B').boundingBox())!;
  await page.mouse.move(a.x+a.width/2,a.y+a.height/2); await page.mouse.down();
  const active = await page.locator('[data-goal-row]').first().evaluateHandle(rows => {
    const animation = rows.parentElement!.getAnimations({subtree:true}).find(a => a.id === 'goal-pulse')!;
    animation.pause(); return animation;
  });
  await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:3}); await page.mouse.up();
  await expect(page.getByRole('dialog')).toContainText('A useful discovery.');
  expect(await active.evaluate(animation => animation.playState)).toBe('idle');
});

test('drag, paired hotspot and goals tutorials suppress both reminder and change pulses',async ({page}) => {
  const text = manuscript.replace('**Items**','**Hotspots**\n- Bench (center 195px, 430px)\n**Items**\n- Bench')
    .replace('-> C\n','-> C (tutorial)\n').replace('C [preserve] + Tool [preserve] -> D','C [preserve] + Tool [preserve] @ Bench -> D');
  await open(page,text,false);
  const cue = (kind: string) => page.locator(`.tutorial-overlay[data-tutorial="${kind}"]`);
  await expect(cue('drag')).toBeVisible();
  await pickup(page,6); await page.clock.runFor(750); expect(await pulses(page)).toEqual([]);
  await drag(page,tile(page,'A'),tile(page,'B'));
  await expect(cue('hotspot')).toBeVisible();
  await expect(page.locator('.tutorial-copy')).toHaveCount(2);
  await drag(page,tile(page,'A'),tile(page,'Tool'));
  await page.clock.runFor(750); expect(await pulses(page)).toEqual([]);
  await drag(page,tile(page,'C'),page.locator('[data-hotspot="name:Bench"]'));
  await drag(page,tile(page,'Tool'),tile(page,'C'));
  await expect(cue('goals')).toBeVisible();
  await pickup(page,6); await page.clock.runFor(750); expect(await pulses(page)).toEqual([]);
  await readGoals(page); await page.clock.runFor(750); expect(await pulses(page)).toEqual([]);
});

test('chapter completion replaces a reminder with a final pulse concurrent with the usable arrow',async ({page}) => {
  await open(page,manuscript.replace('- Make the quick part -- E\n- next: Finish the quick job -- F\n',''));
  await pickup(page,5);
  await drag(page,tile(page,'A'),tile(page,'B'));
  const active = await row(page,0).evaluateHandle(element => {
    const animation = element.getAnimations().find(a => a.id === 'goal-pulse')!;
    animation.pause(); return animation;
  });
  const before = (await row(page,0).boundingBox())!;
  await drag(page,tile(page,'C'),tile(page,'Tool'));
  expect(await active.evaluate(animation => animation.playState)).toBe('idle');
  expect((await pulses(page)).length).toBe(2);
  const final = await row(page,0).evaluateHandle(element => {
    const animation = element.getAnimations().find(a => a.id === 'goal-pulse')!;
    animation.pause(); animation.currentTime = 176; return animation;
  });
  const during = (await row(page,0).boundingBox())!;
  expect(during.x+during.width/2).toBeCloseTo(before.x+before.width/2,3);
  expect(during.y+during.height/2).toBeCloseTo(before.y+before.height/2,3);
  const arrow = page.getByRole('button',{name:'Continue story'});
  await expect(arrow).toBeEnabled();
  await expect(arrow).toHaveCSS('animation-delay','0s');
  await expect(page.locator('.goals-leaving')).toHaveCSS('pointer-events','none');
  const layers = await page.evaluate(() => ['.chapter-next','.goals-leaving','.board.fixed-locations'].map(selector => Number(getComputedStyle(document.querySelector(selector)!).zIndex)));
  expect(layers[0]).toBeLessThan(layers[1]); expect(layers[1]).toBeLessThan(layers[2]);
  const fade = await page.locator('.goals-leaving').evaluate(element => {
    const animation = element.getAnimations()[0]; animation.pause(); animation.currentTime = 400;
    const before = getComputedStyle(element).opacity, app = document.querySelector('#app')!;
    app.classList.add('is-dragging');
    const during = getComputedStyle(element).opacity; app.classList.remove('is-dragging');
    return {before,during};
  });
  expect(Number(fade.during)).toBeLessThan(1); expect(fade.during).toBe(fade.before);
  await arrow.click();
  expect(await final.evaluate(animation => animation.playState)).toBe('idle');
  await page.getByRole('button',{name:'Begin',exact:true}).click();
});

test('final wonders allow navigation immediately and a new chapter starts a fresh counter',async ({page}) => {
  const text = manuscript.replace('- Finish the longer job -- D\n','').replace('- next: Finish the quick job -- F\n','')
    .replace('\n- E\n','\n- E\n\n  A useful discovery.\n\n');
  await open(page,text);
  await pickup(page,4); await drag(page,tile(page,'A'),tile(page,'Tool'));
  await expect(page.getByRole('dialog')).toContainText('A useful discovery.');
  expect((await pulses(page)).length).toBe(1);
  await expect(page.locator('.chapter-next.entering')).toHaveCount(1);
  expect(await page.locator('.game-surface').evaluate((element: HTMLElement) => element.inert)).toBe(true);
  expect(await row(page,0).evaluate(element => element.getAnimations().some(a => a.id === 'goal-pulse'))).toBe(true);
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await page.getByRole('button',{name:'Continue story'}).click();
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  await pickup(page); await page.clock.runFor(750); expect((await pulses(page)).length).toBe(1);
  await pickup(page,5); await expect.poll(async () => (await pulses(page)).length).toBe(2);
});

test('reduced motion uses a brief stationary highlight',async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await open(page);
  await drag(page,tile(page,'A'),tile(page,'Tool'));
  await expect.poll(async () => (await pulses(page)).length).toBe(1);
  expect((await pulses(page))[0].frames.every(frame => !frame.transform)).toBe(true);
  await expect(row(page,1)).toHaveCSS('transform','none');
});

test('an unavailable ranking worker falls back to the visually highest goal',async ({page}) => {
  await page.addInitScript(() => Object.defineProperty(window,'Worker',{value:function() {throw new Error('Workers unavailable');}}));
  await open(page); await pickup(page,6);
  await expect.poll(async () => (await pulses(page)).map(p => p.row)).toEqual(['0']);
});

test('a different changed goal replaces the active pulse immediately',async ({page}) => {
  await open(page);
  await drag(page,tile(page,'A'),tile(page,'Tool'));
  const old = await row(page,1).evaluateHandle(element => {
    const animation = element.getAnimations().find(a => a.id === 'goal-pulse')!;
    animation.pause(); return animation;
  });
  await drag(page,tile(page,'A'),tile(page,'B'));
  expect(await old.evaluate(animation => animation.playState)).toBe('paused');
  await drag(page,tile(page,'C'),tile(page,'Tool'));
  expect(await old.evaluate(animation => animation.playState)).toBe('idle');
  expect((await pulses(page)).map(p => p.row)).toEqual(['1','0']);
  expect(await row(page,0).evaluate(element => element.getAnimations().some(a => a.id === 'goal-pulse'))).toBe(true);
});
