import {chromium} from 'playwright';
import {mkdir,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';

const root = process.cwd();
const original=await readFile(resolve(root,'stories/settlement/assets/backgrounds/01.webp'));
if(createHash('sha256').update(original).digest('hex')!=='cb3d1c1ddba2111ee1ebf1bdd60d45e82966e55f8a0eb8e5b4c36b30f1aa546e') {
  throw new Error('Historical comparison requires the untreated Settlement checkout and its matching local server (af3c6754). Do not fade the promoted artwork again.');
}
const creamComparison = process.argv.includes('--cream');
const out = resolve(root, 'archive/2026.11.06 settlement study', creamComparison ? 'cream-fade' : '.');
await mkdir(out, {recursive:true});

const variants = creamComparison ? [
  {id:'original', title:'Original', detail:'Current artwork · no fade', filter:'none', wash:0, label:'A'},
  {id:'fainter', title:'C · 35% cream', detail:'The original C sample', filter:'none', wash:0.35, label:'C'},
  {id:'lighter', title:'Weaker C · 22% cream', detail:'Same warm cream, a lighter fade', filter:'none', wash:0.22, label:'C−'},
] : [
  {id:'original', title:'Original', detail:'Current artwork', filter:'none', wash:0},
  {id:'softer', title:'Softer colour', detail:'Less saturation and contrast', filter:'saturate(0.55) contrast(0.82) brightness(1.12)', wash:0},
  {id:'fainter', title:'Fainter', detail:'35% warm cream veil', filter:'none', wash:0.35},
  {id:'blurred', title:'Gentle blur', detail:'1.5px blur; original colour', filter:'blur(1.5px)', wash:0},
  {id:'mixed', title:'Gentle mix', detail:'Softer colour + 18% veil + 0.6px blur', filter:'saturate(0.7) contrast(0.9) brightness(1.06) blur(0.6px)', wash:0.18},
];
const sheetWidth = 80 + variants.length * 390 + (variants.length - 1) * 14;
const chapters = [
  {number:1, title:'Four beginnings', description:'The opening: four elements, with Water in the river.'},
  {number:16, title:'News before the boats', description:'The middle: seven carried materials and tools at the landing.'},
];
const browser = await chromium.launch();
const context = await browser.newContext({viewport:{width:390,height:844}, deviceScaleFactor:2, reducedMotion:'reduce'});
const page = await context.newPage();
const errors=[];
page.on('pageerror', error=>errors.push(error.message));
await page.addInitScript(()=>{
  const url = new URL('stories/settlement/settlement.md',location.origin).href;
  localStorage.setItem(`combination-tutorial-v1:${encodeURIComponent(url)}`, JSON.stringify({dragDone:true,hotspotDone:true,goalsDone:true}));
});
await page.goto('http://127.0.0.1:5173/make-something.html?story=stories/settlement/settlement.md');
await page.getByRole('button',{name:'Start',exact:true}).click();
await page.getByRole('button',{name:'Begin',exact:true}).click();
const style = await page.addStyleTag({content:'/* Comparison-only scenery treatments. */'});
const captures=[];
for (const chapter of chapters) {
  if(chapter.number!==1) {
    await page.getByRole('button',{name:'Toggle debug panel'}).click();
    await page.locator('.mobile-debug-chapters button').filter({hasText:`${chapter.number}. ${chapter.title}`}).click();
    await page.getByRole('button',{name:'Begin',exact:true}).click();
  }
  await page.mouse.move(0,0);
  await page.waitForFunction(()=>[...document.querySelectorAll('.scene-art,.chapter-panel img')].every(img=>img.complete&&img.naturalWidth>0));
  await page.waitForTimeout(300);
  const panel = page.locator('.chapter-panel').last();
  if(Number(await panel.getAttribute('data-chapter'))!==chapter.number-1) throw new Error('Wrong chapter');
  await style.evaluate(el=>{el.textContent='/* Original rendering. */';});
  const original=await page.screenshot({animations:'disabled'});
  let foreground;
  for(const variant of variants) {
    await style.evaluate((el,v)=>{el.textContent=`
      .scene-panel { background: #f5e6c9; }
      .scene-art { filter: ${v.filter}; }
      .scene-panel::after { content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none; background: rgba(255,250,240,${v.wash}); }
    `;},variant);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const png=await page.screenshot({animations:'disabled'});
    if(variant.id==='original'&&!png.equals(original))throw new Error('Original comparison differs from untreated game');
    captures.push({chapter:chapter.number,variant:variant.id,png:png.toString('base64')});
    // With scenery hidden, every treatment must render the identical foreground.
    const hide = await page.addStyleTag({content:'.scene-layer { visibility:hidden !important; }'});
    const current=await page.screenshot({animations:'disabled'});
    if(foreground&&!current.equals(foreground))throw new Error(`Foreground changed: ${chapter.number}/${variant.id}`);
    foreground=current;
    await hide.evaluate(el=>el.remove());
  }
  console.log(`Captured chapter ${chapter.number}; foreground identical in all ${variants.length} variants.`);
}
if(errors.length) throw new Error(errors.join('\n'));

const escape = s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const css=`
  *{box-sizing:border-box} html,body{margin:0} body{width:${sheetWidth}px;background:#f2eee6;color:#302e26;font-family:Arial,Helvetica,sans-serif;padding:42px 40px 30px}
  header{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin-bottom:29px}
  h1{font-family:Georgia,serif;font-weight:400;font-size:42px;line-height:1.1;margin:0 0 10px}
  header p{font-size:18px;color:#696253;margin:0;line-height:1.45} .meta{font-size:13px;text-transform:uppercase;letter-spacing:1.5px;text-align:right;line-height:1.8;color:#77705f}
  section+section{margin-top:30px} h2{font-size:23px;font-weight:500;margin:0 0 8px} h2 span{color:#8a7d62;font-size:14px;text-transform:uppercase;letter-spacing:1.6px;margin-right:14px} .intro{font-size:16px;color:#696253;margin:0 0 18px}
  .grid{display:grid;grid-template-columns:repeat(${variants.length},390px);gap:14px} figure{margin:0;min-width:0} figcaption{height:65px;padding:0 2px} h3{font-size:20px;font-weight:500;margin:0 0 7px} h3 b{display:inline-grid;place-items:center;width:23px;height:23px;font-size:12px;border:1px solid #bbb3a2;border-radius:50%;margin-right:9px;vertical-align:2px;font-weight:400} figcaption p{font-size:13px;color:#776f61;margin:0} figure img{display:block;width:390px;height:844px;box-shadow:0 0 0 1px #564b3526}
  footer{font-size:14px;color:#766e60;border-top:1px solid #d7d0c2;padding-top:16px;margin-top:24px;display:flex;justify-content:space-between}
`;
function content(selected){
  return `<!doctype html><html><meta charset="utf-8"><title>Settlement — background comparisons</title><style>${css}</style><body>
    <header><div><h1>Settlement · ${creamComparison ? 'How much cream?' : 'Let the scenery recede?'}</h1><p>${creamComparison ? 'Original, C at 35%, and a lighter 22% fade. Same icons and positions.' : 'Same scene, same icons, same positions. Five background treatments to compare.'}</p></div><div class="meta">Visual study · 6 November 2026<br>390 × 844 phone view · captured at 2×</div></header>
    ${selected.map(ch=>`<section id="chapter-${ch.number}"><h2><span>Chapter ${String(ch.number).padStart(2,'0')}</span>${escape(ch.title)}</h2><p class="intro">${escape(ch.description)}</p><div class="grid">${variants.map((v,i)=>`<figure><figcaption><h3><b>${v.label ?? String.fromCharCode(65+i)}</b>${v.title}</h3><p>${v.detail}</p></figcaption><img alt="${escape(ch.title)} — ${escape(v.title)}" src="data:image/png;base64,${captures.find(c=>c.chapter===ch.number&&c.variant===v.id).png}"></figure>`).join('')}</div></section>`).join('')}
    <footer><span>Only scenery changes; icons, goals and controls keep their original rendering.</span><span>Comparison samples · no treatment adopted</span></footer></body></html>`;
}
const sheet=await browser.newPage({viewport:{width:sheetWidth,height:1000},deviceScaleFactor:2});
for(const [name,selected] of [['contact-sheet',chapters],['chapter-01',chapters.slice(0,1)],['chapter-16',chapters.slice(1)]]){
  await sheet.setContent(content(selected),{waitUntil:'load'});
  await sheet.evaluate(()=>Promise.all([...document.images].map(img=>img.decode())));
  if(name==='contact-sheet') await sheet.screenshot({path:resolve(out,`${name}.png`),fullPage:true});
  await sheet.screenshot({path:resolve(out,`${name}.jpg`),quality:93,fullPage:true});
  console.log(`Wrote ${name}`);
}
await browser.close();
