// Reusable checks for the current Mars v12 revision; transient output belongs under runs/.
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {chromium,expect,type Page,type Locator} from '@playwright/test';
import {parseStory} from '../../../../../../src/story/parser.ts';
import {checkpoint} from '../../../../../../src/debug/checkpoint.ts';
import {act,newGame,recipeFor,replay,chapterComplete} from '../../../../../../src/engine/game.ts';
import {isFixed,presentHotspots,hotspotDefinition} from '../../../../../../src/engine/fixed-items.ts';
import type {State,Action} from '../../../../../../src/engine/types.ts';

const args=new Set(process.argv.slice(2)),run=args.has('--run'),transfers=args.has('--transfer-orders');
const inspectArgs=[...args].filter(arg=>arg.startsWith('--inspect-chapter='));
assert(inspectArgs.length<=1,'Use one --inspect-chapter=N argument.');
const inspect= args.has('--inspect')||inspectArgs.length>0;
const inspectNumber=inspectArgs.length?Number(inspectArgs[0].slice('--inspect-chapter='.length)):1;
assert([run,inspect,transfers].filter(Boolean).length<=1,'Choose --run, --inspect[-chapter=N], or --transfer-orders.');
const origin=process.env.MARS_TEST_ORIGIN??'http://127.0.0.1:5173';
const manuscriptPath='projects/mars-study/mars-v12/mars.md';
const documentURL=new URL(manuscriptPath+'',origin+'/').href;
const playerURL=origin+'/combinations.html?story='+manuscriptPath;
const sha=(data:string|Buffer)=>createHash('sha256').update(data).digest('hex');
const markdown=readFileSync(manuscriptPath,'utf8'),manuscriptHash=sha(markdown);
const story=parseStory(markdown,{id:documentURL,file:documentURL});
assert(!inspect||(Number.isInteger(inspectNumber)&&inspectNumber>=1&&inspectNumber<=story.chapters.length),'--inspect-chapter=N uses a 1-based chapter number in this manuscript.');
function chapterIndex(reference:string){const matches=story.chapters.flatMap((chapter,index)=>chapter.name===reference||chapter.id===reference||chapter.id==='id:'+reference?[index]:[]);assert.equal(matches.length,1,'Missing or ambiguous chapter '+reference);return matches[0];}
const chapters={air:chapterIndex('Air'),cave:chapterIndex('cave-shelter'),farm:chapterIndex('One room for roots'),crossing:chapterIndex('Across the gully'),slab:chapterIndex('Something whole'),metal:chapterIndex('Metal from the red ground'),gases:chapterIndex('Two gases from water'),fuel:chapterIndex('Fuel from air and water'),repair:chapterIndex('lander-repair'),transfer:chapterIndex('Fuel for the return'),supper:chapterIndex('Supper from the garden')};
const farmSlots=['seed-potatoes','soybean-seeds','lettuce-seeds','foil-backed-cloth'];
function milestoneChecks(state:State):[string,boolean][]{
 const token=(id:string)=>state.tokens['id:'+id],available=(id:string)=>token(id)?.status==='available',at=(chapter:number)=>state.chapter===chapter;
 const fuelSlots=token('fuel-assembly')?.slots.length??0;
 return [
  ['air-battery',at(chapters.air)&&available('charged-reserve-battery')],
  ['inflated-unlit-cave',at(chapters.cave)&&available('pressurized-growing-room')&&!token('lit-growing-room')],
  ['four-independent-farm-slots',at(chapters.farm)&&farmSlots.every(id=>token('irrigated-growing-beds')?.slots.includes('id:'+id))],
  ['crossed-ice-before-core',at(chapters.crossing)&&available('reached-ice-bank')&&!token('remote-ice-core')],
  ['prepared-ice-slab',at(chapters.slab)&&available('sectioned-ice-core')&&!token('examined-ice-core')],
  ['adapted-powered-furnace',at(chapters.metal)&&available('powered-reduction-furnace')&&!token('iron-stock')],
  ['both-portable-water-gases',at(chapters.gases)&&available('hydrogen-cylinder')&&available('oxygen-cylinder')],
  ['fuel-one-slot',at(chapters.fuel)&&fuelSlots===1],
  ['fuel-two-slots',at(chapters.fuel)&&fuelSlots===2],
  ['side-blocking-before-rock-removal',at(chapters.repair)&&available('ceramic-landing-footing')&&!token('clear-support-gap')],
  ['clear-gap-before-iron',at(chapters.repair)&&available('clear-support-gap')&&!token('level-launch-platform')],
  ['basket-potato-load',at(chapters.supper)&&available('harvested-potatoes')&&!token('supper-lettuce')],
  ['basket-lettuce-load',at(chapters.supper)&&available('supper-lettuce')&&!token('soybeans-on-fabric')],
  ['basket-soybean-load',at(chapters.supper)&&available('harvested-potatoes')&&available('soybeans-on-fabric')&&available('supper-lettuce')],
  ['washed-soybeans',at(chapters.supper)&&available('prepared-soybeans')&&!token('potatoes-and-soybeans')],
  ['cooked-stew-before-lettuce',at(chapters.supper)&&available('potatoes-and-soybeans')&&!token('stew-and-lettuce-supper')],
 ];
}
const witness=checkpoint(story,story.chapters.length);
// The dependency planner may batch combinations before queued discoveries. A real
// browser must read each modal first, so replay the same recipe witness with its
// readings dismissed immediately, using the unchanged shared engine.
let planned=newGame(story);
for(const action of witness.actions){
 if(action.type==='dismiss')continue;
 while(planned.pending.length)planned=act(story,planned,{type:'dismiss'});
 planned=act(story,planned,action);
}
while(planned.pending.length)planned=act(story,planned,{type:'dismiss'});
assert(planned.completed,'Prepared route does not reach the ending.');
assert.deepEqual(replay(story,planned.actions),planned,'Prepared route does not replay.');
const plannedMilestones=new Set<string>();let milestoneState=newGame(story);
for(const action of planned.actions){milestoneState=act(story,milestoneState,action);if(!milestoneState.pending.length)for(const [label,yes]of milestoneChecks(milestoneState))if(yes)plannedMilestones.add(label);}
const requiredMilestones=milestoneChecks(newGame(story)).map(([label])=>label);
assert.deepEqual([...plannedMilestones].sort(),[...requiredMilestones].sort(),'Prepared route misses a required current-graph milestone.');
const outputRoot=resolve('runs/mars-feedback/browser-checks');mkdirSync(outputRoot,{recursive:true});
const slug=(x:string)=>x.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const summary:any={started:new Date().toISOString(),mode:transfers?'transfer-orders':run?'full-route':inspect?'chapter-arrival-inspection':'prepare',manuscriptHash,chapters:story.chapters.length,recipes:story.recipes.length,inspectionChapter:inspect?inspectNumber:undefined,plannedActions:planned.actions.reduce((a:any,b)=>(a[b.type]=(a[b.type]??0)+1,a),{}),plannedMilestones:[...plannedMilestones],arrivals:[],milestones:[],actions:[],assets:{},errors:[],limits:['Logical replay ignores browser-owned pixel coordinates; reload checks cover those pixels separately.','The main route checks one legal planting order and retained overlays; the emergency branch verifier checks all 24 planting/cover orders.','Browser modes are actual-browser witnesses, not exhaustive action-order or human enjoyment tests. Prepare mode runs no browser.']};
summary.inputAssets=Object.fromEntries([...markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s[^)]*)?\)/g)].map(match=>{const url=new URL(match[1],documentURL);if(url.origin!==origin)return [url.href,'external'];const path=resolve('.'+decodeURIComponent(url.pathname));return [path,sha(readFileSync(path))];}));
writeFileSync(outputRoot+'/plan.json',JSON.stringify({manuscriptHash,chapterTitles:story.chapters.map(c=>c.name),actions:planned.actions},null,2));
if(!run&&!inspect&&!transfers){const prepared={...summary,ready:true,message:'Prepared only. Use --run or --transfer-orders after exports are ready. --inspect-chapter=N uses the mobile checkpoint picker and captures that arrival at 320 and 390 pixels; --inspect selects chapter 1.'};writeFileSync(outputRoot+'/prepare-outcome.json',JSON.stringify(prepared,null,2));console.log(JSON.stringify({ready:true,mode:prepared.mode,chapters:prepared.chapters,recipes:prepared.recipes,plannedActions:prepared.plannedActions,plannedMilestones:prepared.plannedMilestones,message:prepared.message},null,2));process.exit(0);}

// Logical identity/lifecycle are engine-owned. The browser separately lays out and persists pixels.
function logical(s:State){return {storyId:s.storyId,chapter:s.chapter,completed:s.completed,visited:s.visited,achieved:[...s.achieved].sort(),excluded:[...s.excluded].sort(),seen:[...s.seen].sort(),pending:s.pending.map(n=>({key:n.key,kind:n.kind,item:n.item,markdown:n.markdown})),tokens:Object.values(s.tokens).sort((a,b)=>a.id.localeCompare(b.id)).map(t=>({id:t.id,status:t.status,chapter:t.chapter,hotspot:t.hotspot,slots:[...t.slots].sort(),fixedPosition:t.fixedPosition,firstSeen:t.firstSeen}))};}
const key='combination-progress-v2:'+encodeURIComponent(documentURL);
const browser=await chromium.launch({headless:!args.has('--headed')});
const context=await browser.newContext({viewport:{width:320,height:740},hasTouch:true,deviceScaleFactor:1});
const page=await context.newPage();page.setDefaultTimeout(15000);
const pageErrors:string[]=[],badImages:string[]=[],assetTasks:Promise<void>[]=[];
page.on('pageerror',e=>pageErrors.push(e.message));
page.on('requestfailed',r=>{if(r.resourceType()==='image')badImages.push(r.url()+': '+r.failure()?.errorText);});
page.on('response',r=>{if(r.request().resourceType()==='image')assetTasks.push((async()=>{if(r.status()===304){summary.cacheRevalidations=(summary.cacheRevalidations??0)+1;return;}if(!r.ok()){badImages.push(r.url()+': HTTP '+r.status());return;}const hash=sha(await r.body());const old=summary.assets[r.url()];if(old&&old!==hash)summary.errors.push('Asset changed within run: '+r.url());summary.assets[r.url()]=hash;})().catch(e=>{badImages.push(r.url()+': '+e.message);}));});
let expected=newGame(story),currentActionIndex=-1;
async function saved():Promise<State>{const value=await page.evaluate(k=>localStorage.getItem(k),key);assert(value,'Missing saved progress');return JSON.parse(value!).state;}
async function waitSavedActions(n:number){await expect.poll(async()=>{try{return(await saved()).actions.length;}catch{return -1;}},{timeout:20000}).toBe(n);}
async function compare(label:string){const actual=await saved();assert.deepEqual(logical(actual),logical(expected),label+' logical engine state');assert.equal(actual.actions.length,expected.actions.length,label+' action count');assert(pageErrors.length===0,'Browser exceptions: '+pageErrors.join('; '));return actual;}
function objectLocator(id:string,state=expected){const t=state.tokens[id];assert(t,id+' token absent');const panel=page.locator(`.chapter-panel[data-chapter="${t.chapter}"]`);return panel.locator(isFixed(story,t)?`[data-hotspot="${id}"]`:`[data-item="${id}"]`);}
async function imagesDecoded(chapter:number){await expect(page.locator(`.chapter-panel[data-chapter="${chapter}"]`)).toBeVisible({timeout:30000});const images=page.locator(`.scene-panel[data-chapter="${chapter}"] img,.chapter-panel[data-chapter="${chapter}"] img,dialog[open] .reading-text img`);await expect.poll(()=>images.evaluateAll(xs=>xs.length>0&&xs.every(x=>{const i=x as HTMLImageElement;return i.complete&&i.naturalWidth>0;})),{timeout:20000}).toBe(true);}
async function settledMotion(){await page.locator('.chapter-panel').evaluateAll(es=>Promise.all(es.flatMap(e=>e.getAnimations({subtree:true})).filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));}
async function sceneMetrics(label:string){await imagesDecoded(expected.chapter);await settledMotion();const metrics=await page.evaluate(c=>{
 const panel=document.querySelector<HTMLElement>(`.chapter-panel[data-chapter="${c}"]`)!;const bounds=panel.getBoundingClientRect();
 const rect=(r:DOMRect)=>({x:r.x,y:r.y,width:r.width,height:r.height});
 const elements=[...panel.querySelectorAll<HTMLElement>('[data-item],[data-hotspot]')].map(e=>{const r=e.getBoundingClientRect();const clip={left:Math.max(0,-r.left),right:Math.max(0,r.right-innerWidth),top:Math.max(0,-r.top),bottom:Math.max(0,r.bottom-innerHeight)};const image=e.querySelector<HTMLImageElement>('.item-icon');const slots=[...e.querySelectorAll<HTMLImageElement>('.slot-icon')];return {id:e.dataset.item??e.dataset.hotspot,fixed:!!e.dataset.hotspot,rect:rect(r),clip,source:image?.currentSrc,natural:image?[image.naturalWidth,image.naturalHeight]:undefined,slotSources:slots.map(i=>i.currentSrc),slotDimensions:slots.map(i=>[i.naturalWidth,i.naturalHeight]),insidePanel:r.left>=bounds.left-1&&r.right<=bounds.right+1&&r.top>=bounds.top-1&&r.bottom<=bounds.bottom+1};});
 return {viewport:{width:innerWidth,height:innerHeight},panel:rect(bounds),documentFits:document.documentElement.scrollWidth<=innerWidth,goals:[...document.querySelectorAll('.objective-line')].map(e=>e.textContent),elements};
 },expected.chapter);
 assert(metrics.documentFits,label+' horizontal document overflow');
 for(const e of metrics.elements){assert(e.rect.width>0&&e.rect.height>0,label+' zero size '+e.id);if(!e.fixed){assert(e.insidePanel,label+' movable outside panel '+e.id);assert(Object.values(e.clip).every(n=>n<=1),label+' movable viewport clipping '+e.id+' '+JSON.stringify(e.clip));}for(const dims of e.slotDimensions)assert.deepEqual(dims,e.natural,label+' compound overlay extent differs '+e.id);}
 assert(presentHotspots(story,expected,expected.chapter).length<=3,label+' >3 fixed targets');
 const png=outputRoot+'/'+slug(label)+'.png';await page.screenshot({path:png});
 return {label,chapter:expected.chapter+1,title:story.chapters[expected.chapter].name,...metrics,screenshot:png};
}
async function stableRects(){await settledMotion();return page.locator(`.chapter-panel[data-chapter="${expected.chapter}"] [data-item],.chapter-panel[data-chapter="${expected.chapter}"] [data-hotspot]`).evaluateAll(es=>Object.fromEntries(es.map(e=>{const el=e as HTMLElement,r=e.getBoundingClientRect();return [el.dataset.item??el.dataset.hotspot,{x:r.x,y:r.y,width:r.width,height:r.height}];})));}
async function checkReload(label:string){await imagesDecoded(expected.chapter);const before=await saved(),rects=await stableRects();await page.reload({waitUntil:'networkidle'});await imagesDecoded(expected.chapter);const after=await compare('reload '+label);assert.deepEqual(after.actions,before.actions,'reload action history changed');const next=await stableRects();writeFileSync(outputRoot+'/reload-'+label+'-rects.json',JSON.stringify({before:rects,after:next},null,2));assert.deepEqual(Object.keys(next).sort(),Object.keys(rects).sort(),'reload objects changed');for(const id of Object.keys(rects))for(const k of ['x','y','width','height'])assert(Math.abs((rects as any)[id][k]-(next as any)[id][k])<1,'reload geometry changed '+label+' '+id+' '+k);summary.milestones.push(await sceneMetrics('reload-'+label));}
async function resizeInspect(label:string){await page.setViewportSize({width:390,height:844});await expect.poll(()=>page.locator('.chapter-panel').last().evaluate(e=>Math.round(e.getBoundingClientRect().width))).toBe(390);await imagesDecoded(expected.chapter);summary.milestones.push(await sceneMetrics('390-'+label));await compare('390 resize '+label);await page.setViewportSize({width:320,height:740});await expect.poll(()=>page.locator('.chapter-panel').last().evaluate(e=>Math.round(e.getBoundingClientRect().width))).toBe(320);await imagesDecoded(expected.chapter);await compare('320 restore '+label);}
async function pickupPoint(locator:Locator,id:string){await expect(locator).toBeVisible();const points=await locator.evaluate((e,requested)=>{const r=e.getBoundingClientRect(),points=[];for(const [fx,fy]of [[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75],[.1,.5],[.9,.5],[.5,.1],[.5,.9]]){const x=r.left+r.width*fx,y=r.top+r.height*fy;if(x<1||x>innerWidth-1||y<1||y>innerHeight-1)continue;const top=document.elementFromPoint(x,y)?.closest<HTMLElement>('[data-item],[data-hotspot]');if(top&&(top.dataset.item??top.dataset.hotspot)===requested)points.push({x,y});}return points;},id);assert(points.length,'No exposed pickup point for '+id);return points[0];}
async function targetPoints(locator:Locator){await expect(locator).toBeVisible();return locator.evaluate(e=>{const r=e.getBoundingClientRect(),circle=e.classList.contains('hotspot-circular')||e.classList.contains('icon-circular');return [[.5,.5],[.3,.5],[.7,.5],[.5,.3],[.5,.7],...(circle?[]:[[.2,.2],[.8,.2],[.2,.8],[.8,.8]])].map(([fx,fy])=>({x:r.left+r.width*fx,y:r.top+r.height*fy})).filter(p=>p.x>=1&&p.x<innerWidth-1&&p.y>=1&&p.y<innerHeight-1);});}
async function drag(action:Extract<Action,{type:'combine'}>){const targetId=action.b??action.hotspot!;assert(targetId,'combine needs receiver');const source=objectLocator(action.a),target=objectLocator(targetId);const start=await pickupPoint(source,action.a),points=await targetPoints(target);assert(points.length,'No visible receiver point '+targetId);await page.mouse.move(start.x,start.y);await page.mouse.down();let chosen:any;
 for(const point of points){await page.mouse.move(point.x,point.y,{steps:8});await page.waitForTimeout(40);if(await target.evaluate(e=>e.classList.contains('will-create'))){chosen=point;break;}}
 if(!chosen){await page.mouse.up();throw new Error('Pointer drag found no creation target for '+action.a+' -> '+targetId);}
 await page.mouse.up();return {source:action.a,target:targetId,pickup:start,drop:chosen};}
const milestones=new Set<string>();
const reloadMilestones=new Set(['air-battery','four-independent-farm-slots','both-portable-water-gases','fuel-two-slots','basket-soybean-load','washed-soybeans']);
const singleWidthMilestones=new Set(['fuel-one-slot','basket-potato-load','basket-lettuce-load','cooked-stew-before-lettuce']);
async function afterAction(){
 // Inspect the board after its discovery has closed, not behind the reading dialog.
 if(expected.pending.length)return;
 for(const [label,yes]of milestoneChecks(expected))if(yes&&!milestones.has(label)){
  milestones.add(label);
  if(label==='basket-soybean-load'){await settledMotion();for(const id of ['id:harvested-potatoes','id:soybeans-on-fabric','id:supper-lettuce'])await pickupPoint(objectLocator(id),id);}
  if(label==='washed-soybeans')assert.notEqual(expected.tokens['id:soybeans-on-fabric']?.status,'available','Raw soybean load survives mandatory washing');
  if(label==='four-independent-farm-slots')assert.equal(expected.tokens['id:irrigated-growing-beds'].slots.length,farmSlots.length,'Independent crop/cover fittings were lost');
  if(label==='both-portable-water-gases')for(const gas of ['hydrogen','oxygen'])assert(!isFixed(story,expected.tokens['id:'+gas+'-cylinder']),gas+' cylinder must remain portable');
  if(label==='air-battery'){
   // Normal free placement is valid. Only enforce a connector position if the
   // current manuscript actually supplies placement metadata for this result.
   const place=hotspotDefinition(story,expected.chapter,'id:station-power')?.placements?.find(p=>p.item.id==='id:charged-reserve-battery');
   if(place){const image=await page.locator(`.scene-panel[data-chapter="${expected.chapter}"] .scene-art`).boundingBox(),battery=await objectLocator('id:charged-reserve-battery').boundingBox();assert(image&&battery);assert(Math.abs((battery.x+battery.width/2)-(image.x+image.width*place.x))<2&&Math.abs((battery.y+battery.height/2)-(image.y+image.height*place.y))<2,'Battery is not at its authored connector position');}
  }
  if(reloadMilestones.has(label))await checkReload(label);else summary.milestones.push(await sceneMetrics(label));
  if(!singleWidthMilestones.has(label))await resizeInspect(label);
 }
}
async function perform(action:Action,label:string){
 currentActionIndex=summary.actions.length;const before=await compare('before '+label);let gesture:any;
 if(action.type==='dismiss'){const notice=expected.pending[0];assert(notice);await page.getByRole('button',{name:notice.kind==='chapter'?'Begin':'Continue',exact:true}).click();}
 else if(action.type==='combine'){assert.equal(expected.pending.length,0);assert(recipeFor(story,expected,action));gesture=await drag(action);}
 else throw new Error('Unsupported targeted action');
 await waitSavedActions(before.actions.length+1);const actual=(await saved()).actions.at(-1)!;assert.equal(actual.type,action.type);
 if(action.type==='combine'&&actual.type==='combine')assert.equal(recipeFor(story,expected,actual)?.id,recipeFor(story,expected,action)?.id);
 expected=act(story,expected,actual);await compare(label);summary.actions.push({label,type:actual.type,gesture});
}
async function jumpToChapter(index:number,label:string){
 await page.getByRole('button',{name:'Toggle debug panel',exact:true}).click();
 await page.locator('.mobile-debug-chapters').getByRole('button',{name:`${index+1}. ${story.chapters[index].name}`,exact:true}).click();
 // Mirror the documented checkpoint UI's dismissal of prior discoveries in the
 // expected model only. Browser state is produced solely by the UI above.
 expected=checkpoint(story,index);
 expected.seen.push(...expected.pending.filter(notice=>notice.kind==='wonder').map(notice=>notice.key));
 expected.pending=expected.pending.filter(notice=>notice.kind==='chapter');
 assert.equal(expected.chapter,index,'Checkpoint skipped requested arrival');
 await waitSavedActions(expected.actions.length);await imagesDecoded(index);await compare(label+' checkpoint');
 while(expected.pending.length)await perform({type:'dismiss'},label+' Begin');
}
try{
 const response=await page.request.get(documentURL);assert(response.ok(),'Manuscript HTTP unavailable');assert.equal(sha(await response.text()),manuscriptHash,'Served story differs from disk');
 await page.goto(playerURL,{waitUntil:'networkidle'});await expect(page.getByRole('button',{name:'Start',exact:true})).toBeVisible();
 assert.equal(await page.locator('[data-item],[data-hotspot]').count(),0,'Cover exposes game objects');
 await page.getByRole('button',{name:'Start',exact:true}).click();await waitSavedActions(0);await compare('Start');
 if(inspect){
  summary.setup='Existing mobile authoring checkpoint UI; no state or storage injection. Only the requested chapter arrival is inspected.';
  await perform({type:'dismiss'},'initial Begin');
  await jumpToChapter(inspectNumber-1,'inspect chapter '+inspectNumber);
  const label='inspect-arrival-'+String(inspectNumber).padStart(2,'0');
  summary.arrivals.push(await sceneMetrics('320-'+label));await resizeInspect(label);
  summary.pass=true;
 }
 else if(transfers){
  summary.setup='Existing mobile authoring checkpoint UI; no state or storage injection. Each order exercises four gestures: hose plus each actual carried gas cylinder, then each prepared cylinder at its matching lander port.';
  summary.cases=[];
  await perform({type:'dismiss'},'initial Begin');
  for(const order of [['methane','oxygen'],['oxygen','methane']]){
   const label=order.join('-then-');
   await jumpToChapter(chapters.transfer,label);
   summary.arrivals.push(await sceneMetrics(label+'-arrival'));await resizeInspect(label+'-arrival');
   for(const gas of order){
    const cylinder=expected.tokens['id:'+gas+'-cylinder'];assert(cylinder?.status==='available'&&!isFixed(story,cylinder),'Earlier '+gas+' cylinder is not available to carry');
    await perform({type:'combine',a:'id:hose',b:'id:'+gas+'-cylinder'},label+'-'+gas+'-hose');
    while(expected.pending.length)await perform({type:'dismiss'},label+'-'+gas+' hose reading');
    const prepared=expected.tokens['id:'+gas+'-transfer-cylinder'];assert(prepared?.status==='available'&&!isFixed(story,prepared),'Prepared '+gas+' cylinder is not portable');
    summary.milestones.push(await sceneMetrics(label+'-'+gas+'-prepared-cylinder'));
    assert(!recipeFor(story,expected,{type:'combine',a:prepared.id,hotspot:'id:lander-'+(gas==='oxygen'?'methane':'oxygen')+'-port',chapter:expected.chapter}),'Gas can transfer into the wrong tank');
    await perform({type:'combine',a:prepared.id,hotspot:'id:lander-'+gas+'-port',chapter:expected.chapter},label+'-'+gas+'-transfer');
    while(expected.pending.length)await perform({type:'dismiss'},label+'-'+gas+' reading');
    await checkReload(label+'-'+gas);await resizeInspect(label+'-'+gas);
   }
   assert(chapterComplete(story,expected),'Transfer chapter did not complete');await expect(page.getByRole('button',{name:'Continue story',exact:true})).toBeVisible();
   const final=await saved();assert.deepEqual(logical(replay(story,final.actions)),logical(final),'Targeted transfer saved replay differs');
   summary.cases.push({order,completed:true,logicalSavedReplay:true,actions:final.actions.length});
  }
  summary.pass=true;
 }
 else{
  let lastArrival=-1;
  for(const [i,action]of planned.actions.entries()){
   currentActionIndex=i;
   assert.equal(sha(readFileSync(manuscriptPath)),manuscriptHash,'Manuscript changed during run');
   if(expected.chapter!==lastArrival&&expected.pending.length===0){summary.arrivals.push(await sceneMetrics('arrival-'+String(expected.chapter+1).padStart(2,'0')));lastArrival=expected.chapter;console.log('Arrival',expected.chapter+1,story.chapters[expected.chapter].name);}
   const before=await compare('before '+i);let gesture:any;
   if(action.type==='dismiss'){
    const notice=expected.pending[0];assert(notice,'Planner dismiss without reading');const dialog=page.locator('.game-dialog-layer dialog[open]');await expect(dialog).toBeVisible();await imagesDecoded(expected.chapter);const control=page.getByRole('button',{name:notice.kind==='chapter'?'Begin':'Continue',exact:true});await expect(control).toBeVisible();assert.equal(await dialog.getByRole('button').count(),1,'Automatic reading has unexpected controls');await control.click();
   }else if(action.type==='advance'){
    assert(chapterComplete(story,expected),'Unfinished goals before Next');await expect(page.getByRole('button',{name:'Continue story',exact:true})).toBeVisible();await page.getByRole('button',{name:'Continue story',exact:true}).click();
   }else if(action.type==='combine'){
    assert(expected.pending.length===0,'Combination under unread popup');assert(recipeFor(story,expected,action),'Planner combination unavailable');gesture=await drag(action);
   }else throw new Error('Unexpected planned move; add real pointer implementation before running it');
   await waitSavedActions(before.actions.length+1);const after=await saved(),actualAction=after.actions.at(-1)!;
   assert.equal(actualAction.type,action.type,'Browser committed different action kind');
   if(action.type==='combine'&&actualAction.type==='combine'){assert.equal(recipeFor(story,expected,actualAction)?.id,recipeFor(story,expected,action)?.id,'Browser committed different recipe');}
   expected=act(story,expected,actualAction);await compare('after '+i);summary.actions.push({index:i,chapter:expected.chapter+1,type:actualAction.type,gesture});
   if(expected.pending.length===0&&expected.chapter!==lastArrival){summary.arrivals.push(await sceneMetrics('arrival-'+String(expected.chapter+1).padStart(2,'0')));lastArrival=expected.chapter;console.log('Arrival',expected.chapter+1,story.chapters[expected.chapter].name);}
   await afterAction();
  }
  // The terminal arrival is completed while its final authored reading still awaits Begin.
  while(expected.pending.length){const notice=expected.pending[0];await page.getByRole('button',{name:notice.kind==='chapter'?'Begin':'Continue',exact:true}).click();expected=act(story,expected,{type:'dismiss'});await waitSavedActions(expected.actions.length);await compare('terminal reading');}
  if(expected.chapter!==lastArrival)summary.arrivals.push(await sceneMetrics('arrival-'+String(expected.chapter+1).padStart(2,'0')));
  assert(expected.completed,'Full route not complete');assert.equal(summary.arrivals.length,story.chapters.length,'Not every chapter arrival inspected');
  assert.deepEqual([...milestones].sort(),[...plannedMilestones].sort(),'A required current-graph browser milestone was not inspected');
  const final=await saved();assert.deepEqual(logical(replay(story,final.actions)),logical(final),'Final saved replay differs');await checkReload('final-completion');
  summary.final={completed:final.completed,actions:final.actions.length,logicalSavedReplay:true};summary.pass=true;
 }
 await Promise.all(assetTasks);assert.equal(sha(readFileSync(manuscriptPath)),manuscriptHash,'Manuscript changed during run');
 // Verify the actual image bytes fetched during this run still match the local exports.
 for(const [path,hash]of Object.entries(summary.inputAssets))if(hash!=='external')assert.equal(sha(readFileSync(path)),hash,'Referenced export changed during run: '+path);
 for(const [url,hash]of Object.entries(summary.assets)){const u=new URL(url);if(u.origin!==origin)continue;const path=resolve('.'+decodeURIComponent(u.pathname));assert.equal(sha(readFileSync(path)),hash,'Export changed during run: '+u.pathname);}
 assert(!badImages.length,'Broken image requests: '+badImages.join('; '));assert(!summary.errors.length,summary.errors.join('; '));
}catch(error){summary.pass=false;summary.failure={actionIndex:currentActionIndex,chapter:expected.chapter+1,title:story.chapters[expected.chapter]?.name,message:(error as Error).message,stack:(error as Error).stack};try{await page.screenshot({path:outputRoot+'/failure.png'});writeFileSync(outputRoot+'/failure-state.json',JSON.stringify(await saved(),null,2));}catch{}console.error(summary.failure);process.exitCode=1;
}finally{summary.ended=new Date().toISOString();summary.pageErrors=pageErrors;summary.badImages=badImages;writeFileSync(outputRoot+'/'+(transfers?'transfer-outcome.json':run?'route-outcome.json':'inspection-outcome.json'),JSON.stringify(summary,null,2));await browser.close();}
console.log(JSON.stringify({pass:summary.pass,mode:summary.mode,chaptersInspected:summary.arrivals.length,milestones:summary.milestones.map((m:any)=>m.label),imagesChecked:Object.keys(summary.assets).length,failure:summary.failure},null,2));
