// Reconstruct pages from retained paintings and authored station registration.
// All exports go to ignored scratch space; installation is deliberately explicit.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
import {pageFrame} from '../../../page-composition/tools/page-frame.mjs';
import {runDirectory} from '../../../tools/run-output.mjs';

const project=path.resolve(import.meta.dirname,'..');
const paintings=path.resolve(project,'../../page-composition');
const registration=JSON.parse(await fs.readFile(path.join(project,'registration.json'),'utf8'));
const plan=JSON.parse(await fs.readFile(path.join(paintings,'plan.json'),'utf8'));
const only=process.argv.find(a=>a.startsWith('--only='))?.slice(7);
const scenes=registration.chapters.filter(c=>!only||only===c.slug);
assert(scenes.length,'Unknown page theme');
const output=path.join(await runDirectory(),'rebuilt-pages');
await fs.mkdir(output,{recursive:true});
const data=async file=>'data:image/png;base64,'+(await fs.readFile(file)).toString('base64');
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:800,height:1700},deviceScaleFactor:1});
 const render=async (markup,file)=>{
  await page.setContent(`<style>html,body{margin:0;background:transparent}</style><svg xmlns="http://www.w3.org/2000/svg" width="780" height="1688" viewBox="0 0 390 844">${markup}</svg>`);
  await page.evaluate(()=>Promise.all([...document.querySelectorAll('image')].map(el=>new Promise((ok,no)=>{const im=new Image();im.onload=ok;im.onerror=no;im.src=el.getAttribute('href')}))));
  await page.locator('body > svg').screenshot({path:file});
 };
 for(const scene of scenes){
  const brief=plan.find(p=>p.slug===scene.slug);assert(brief);
  const ground=path.join(output,scene.slug+'-ground.png');
  await render(pageFrame(await data(path.join(paintings,'images',scene.slug+'.png')),brief.frameOffset??0),ground);
  const drawings=await Promise.all(scene.hotspots.map(async h=>`<svg x="${h.sourceX+h.clip.x*h.sourceScale}" y="${h.sourceY+h.clip.y*h.sourceScale}" width="${h.clip.width*h.sourceScale}" height="${h.clip.height*h.sourceScale}" viewBox="${h.clip.x} ${h.clip.y} ${h.clip.width} ${h.clip.height}" overflow="hidden" opacity="${h.opacity}"><image href="${await data(path.resolve(project,h.source))}" width="${h.sourceSize.width}" height="${h.sourceSize.height}"/></svg>`));
  const png=path.join(output,scene.slug+'.png');
  await render(`<image href="${await data(ground)}" width="390" height="844"/>${drawings.join('')}`,png);
  execFileSync('cwebp',['-q','94','-m','6','-quiet',png,'-o',path.join(output,scene.slug+'.webp')]);
 }
}finally{await browser.close();}
console.log(`${scenes.length} pages reconstructed in ${output}; installed artwork unchanged.`);
