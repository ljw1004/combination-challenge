/** Browser-only blind player bridge. Public screen + real mouse/key input; no model actions. */
import { createServer } from 'node:http';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';

const browser=await chromium.launch({headless:true});
type Experiment='hands'|'joinery'|'constellation';
const sessions=new Map<string,{context:BrowserContext;page:Page;commands:unknown[];experiment:Experiment}>();
const port=8788;
const server=createServer(async(req,res)=>{
  res.setHeader('Content-Type','application/json');
  try{
    if(req.method!=='POST')throw new Error('POST a public gesture command.');
    let body='';for await(const chunk of req){body+=chunk;if(body.length>20000)throw new Error('Command too large.');}
    const input=JSON.parse(body) as {session:string;command:string;args:unknown[];annotation?:unknown;mobile?:boolean;experiment?:Experiment;level?:string;mode?:string};
    if(!/^[a-z0-9_-]+$/.test(input.session))throw new Error('Use a simple session ID.');
    if(!['view','down','move','up','drag','click','key','wheel','finish'].includes(input.command))throw new Error('Unknown public gesture.');
    let session=sessions.get(input.session);
    if(!session){
      const experiment:Experiment=input.experiment==='constellation'?'constellation':input.experiment==='joinery'?'joinery':'hands';
      const context=await browser.newContext({viewport:input.mobile?{width:390,height:844}:{width:1200,height:800},hasTouch:!!input.mobile});
      const page=await context.newPage();const url=new URL('http://127.0.0.1:5173/');url.searchParams.set('experiment',experiment);if(input.level)url.searchParams.set('level',input.level);if(input.mode)url.searchParams.set('mode',input.mode);
      await page.goto(url.href);await page.waitForSelector(experiment==='constellation'?'[data-constellation-workspace]':experiment==='joinery'?'[data-joinery-workspace]':'[data-workspace]');
      session={context,page,commands:[],experiment};sessions.set(input.session,session);
    }
    const {page}=session;const nums=input.args.map(Number);
    const coord=(n:number)=>{if(!Number.isFinite(n)||n<0||n>4000)throw new Error('Invalid screen coordinate.');return n;};
    if(input.command==='down'){await page.mouse.move(coord(nums[0]),coord(nums[1]));await page.mouse.down();}
    if(input.command==='move')await page.mouse.move(coord(nums[0]),coord(nums[1]),{steps:12});
    if(input.command==='up')await page.mouse.up();
    if(input.command==='drag'){
      await page.mouse.move(coord(nums[0]),coord(nums[1]));await page.mouse.down();await page.mouse.move(coord(nums[2]),coord(nums[3]),{steps:16});await page.waitForTimeout(150);await page.mouse.up();
    }
    if(input.command==='click')await page.mouse.click(coord(nums[0]),coord(nums[1]));
    if(input.command==='key')await page.keyboard.press(String(input.args[0]));
    if(input.command==='wheel')await page.mouse.wheel(Number(input.args[0])||0,Number(input.args[1])||0);
    await page.waitForTimeout(input.command==='move'?100:450);
    const folder=`results/gesture-players/${input.session}`;mkdirSync(folder,{recursive:true});
    const index=session.commands.length;const path=`${folder}/screen-${String(index).padStart(2,'0')}.png`;
    await page.screenshot({path,fullPage:true});
    const visibleText=await page.locator('body').innerText();
    const controls=await page.locator('button:visible').evaluateAll(nodes=>nodes.flatMap(node=>{
      const rect=node.getBoundingClientRect();const css=getComputedStyle(node);
      if(!rect.width||!rect.height||css.visibility==='hidden'||css.display==='none')return [];
      return [{name:node.getAttribute('aria-label')||node.textContent?.trim(),x:Math.round(rect.x+rect.width/2),y:Math.round(rect.y+rect.height/2),disabled:(node as HTMLButtonElement).disabled}];
    }));
    session.commands.push({index,command:input.command,args:input.args,...(input.annotation?{annotation:input.annotation}:{}),screen:path,visibleText});
    writeFileSync(`${folder}/commands.json`,JSON.stringify({experiment:session.experiment,condition:'Fresh browser player; instruction-based isolation; actual pointer/keyboard gestures only',commands:session.commands},null,2));
    if(input.command==='finish'){
      const capture=await page.evaluate(mode=>{const w=window as unknown as Record<string,{exportRun:()=>string}>;return w[mode==='hands'?'combination':mode].exportRun();},session.experiment);
      writeFileSync(`${folder}/run.json`,capture);
      if(session.experiment!=='hands'){
        const all=await page.evaluate(mode=>{const w=window as unknown as Record<string,{exportAllRuns:()=>string}>;return w[mode].exportAllRuns();},session.experiment);
        writeFileSync(`${folder}/runs.json`,all);
      }
    }
    res.end(JSON.stringify({screen:`/Users/ljw/code/combination-challenge/${path}`,visibleText,controls,commandsUsed:session.commands.length},null,2));
  }catch(error){res.statusCode=400;res.end(JSON.stringify({error:error instanceof Error?error.message:String(error)}));}
});
server.listen(port,'127.0.0.1',()=>console.log(`Public gesture bridge ready at127.0.0.1:${port}`));
async function close(){server.close();await browser.close();process.exit(0);}
process.on('SIGINT',()=>void close());process.on('SIGTERM',()=>void close());
