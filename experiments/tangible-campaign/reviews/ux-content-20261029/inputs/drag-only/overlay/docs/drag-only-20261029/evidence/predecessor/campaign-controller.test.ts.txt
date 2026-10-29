import * as Current from '../engine/campaign.ts';
import {fromLegacyScenario,toLegacyGame} from '../compatibility/v1.ts';
import {applyMilestones as currentMilestones} from '../ui/current-campaign.ts';
import {presentationFor as currentPresentation} from '../ui/pre-location-scenarios.ts';
import {applyMilestones} from './campaign-milestones.ts';
import {archivedScenarioIds} from '../schema/lifecycle.ts';
import {featuredScenarioIds,presentationFor} from '../ui/pre-location-scenarios-v1.ts';
// Synthetic DOM/controller evidence. No native layout or touch claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
import * as M from '../engine/model.ts';
import type {Scenario} from '../schema/scenario.ts';
import {decodeSave,encodeSave,type SaveEnvelope} from './save-codec.ts';
import {scenarios as campaignScenarios} from './pre-location-scenarios-v1.ts';
const fixture:Scenario={schemaVersion:1,id:'fixture',title:'A small journey',premise:'Make a beacon.',items:[{id:'lamp',label:'Lamp'},{id:'battery',label:'Battery'},{id:'beacon',label:'Beacon'}],locations:[{id:'ridge',label:'Ridge'}],initialItems:['lamp','battery'],recipes:[{id:'beacon',a:'lamp',b:'battery',out:'beacon'}],stages:[{id:'build',title:'Build',speaker:'Control',motivation:'Make a beacon.',completionText:'The beacon shines. The climb can begin.',area:{id:'camp',label:'Camp',travelText:'We landed.'},objectives:[{id:'make',text:'Make a beacon.',kind:'create',item:'beacon'}]},{id:'signal',title:'Signal',speaker:'Control',motivation:'Put it on the ridge.',completionText:'Your light reaches the valley. Everyone returns safely.',area:{id:'hill',label:'Hill',travelText:'Bring the beacon up the hill.'},locations:['ridge'],objectives:[{id:'put',text:'Put the beacon on the ridge.',kind:'place',item:'beacon',location:'ridge'}]}]};
function harness(world=fixture,initialSaved?:string,options:{worlds?:Scenario[];search?:string;width?:number;modernPointer?:boolean;deferSave?:boolean;deferFlush?:boolean}={}){
 let els:any[]=[],hit:any=null;const navigated:string[]=[];const flushWaiters:(()=>void)[]=[];const windowEvents:Record<string,Function>={};const saved=new Map<string,string>();const key='tangible-campaign-v1:'+world.id;if(initialSaved)saved.set(key,initialSaved);const timers:{fn:()=>void,ms:number}[]=[];
 let latest:SaveEnvelope|undefined=initialSaved?(()=>{try{return decodeSave(initialSaved);}catch{return undefined;}})():undefined,saveCallback:Function=()=>{},saveStatus={state:'idle',revision:0,savedRevision:0,message:''},retries=0,lifecycleInstalled=false;
 const matches=(e:any,q:string)=>q.split(',').some(q=>q.startsWith('#')?e.id===q.slice(1):q.startsWith('.')?e.classList.contains(q.slice(1)):(()=>{const m=/^\[data-([\w-]+)(?:="([^"]*)")?\]$/.exec(q);return !!m&&m[1]in e.dataset&&(m[2]===undefined||e.dataset[m[1]]===m[2]);})());
 class El{listeners:Record<string,Function[]>={};id='';dataset:Record<string,string>={};attrs:Record<string,string>={};parentElement:any=null;children:any[]=[];value='';style:any={};hidden=false;open=false;textContent='';isConnected=true;clientWidth=options.width??360;clientHeight=500;scrollTop=0;scrollLeft=0;_html='';classes=new Set<string>();classList={add:(...xs:string[])=>xs.forEach(x=>this.classes.add(x)),remove:(...xs:string[])=>xs.forEach(x=>this.classes.delete(x)),contains:(x:string)=>this.classes.has(x)};
  set innerHTML(html:string){this._html=html;els.forEach(e=>e.isConnected=false);els=[];const stack:any[]=[this];for(const m of html.matchAll(/<\/?([\w-]+)\b[^>]*>/g)){const raw=m[0],tag=m[1];if(raw.startsWith('</')){if(stack.length>1)stack.pop();continue;}const e=new El();for(const a of raw.matchAll(/([\w-]+)="([^"]*)"/g))e.attrs[a[1]]=a[2];e.id=e.attrs.id??'';e.hidden=/\shidden(?:\s|>)/.test(raw);e.classes=new Set((e.attrs.class??'').split(/\s+/).filter(Boolean));for(const [k,v]of Object.entries(e.attrs))if(k.startsWith('data-'))e.dataset[k.slice(5)]=v;e.parentElement=stack.at(-1);e.parentElement.children.push(e);els.push(e);if(!raw.endsWith('/>')&&!['br','input','meta','link'].includes(tag))stack.push(e);}}
  setAttribute(name:string,value:string){this.attrs[name]=value;}focus(){doc.activeElement=this;}get innerHTML(){return this._html;}get href(){return this.attrs.href;}showModal(){this.open=true;}closest(q:string):any{return matches(this,q)?this:this.parentElement?.closest(q)??null;}getBoundingClientRect(){return {left:0,top:0,right:this.clientWidth,bottom:500,width:this.clientWidth,height:500};}setPointerCapture(){}addEventListener(type:string,fn:Function){(this.listeners[type]??=[]).push(fn);}
 }
 const app=new El();const doc={activeElement:null as any,querySelector:(q:string)=>q==='#app'?app:els.find(e=>matches(e,q))??null,querySelectorAll:(q:string)=>els.filter(e=>matches(e,q)),getElementById:(id:string)=>els.find(e=>e.id===id)??null,elementFromPoint:()=>hit};
 const emitSaveStatus=(state:string,message:string)=>{saveStatus={...saveStatus,state,message};saveCallback(saveStatus);};
 const flushSave=()=>{if(latest){saved.set(key,JSON.stringify(latest));saveStatus.savedRevision=saveStatus.revision;emitSaveStatus('saved','Progress saved.');}};
 // Deliberate adapter double. Real worker ordering, lifecycle and quota behavior
 // belong to save-autosave's separate suite; this checks the controller contract.
 const createAutosave=({onStatus}:{onStatus:Function})=>{saveCallback=onStatus;return {enqueue:(value:SaveEnvelope|(()=>SaveEnvelope))=>{latest=structuredClone(typeof value==='function'?value():value);saveStatus.revision++;emitSaveStatus('saving','Saving progress…');if(!options.deferSave)flushSave();},getStatus:()=>saveStatus,retry:()=>{retries++;emitSaveStatus('saving','Saving progress…');},flush:async()=>{if(saveStatus.state==='error')throw Error(saveStatus.message);if(options.deferFlush)await new Promise<void>(resolve=>flushWaiters.push(resolve));flushSave();},flushSync:()=>{flushSave();return true;},dispose(){}};};
 const ctx={applyMilestones:currentMilestones,toLegacyGame,archivedScenarioIds,featuredScenarioIds,presentationFor:currentPresentation,addEventListener:(name:string,fn:Function)=>windowEvents[name]=fn,window:{},M:Current,decodeSave,createAutosave,installSaveLifecycle:()=>{lifecycleInstalled=true;return ()=>{};},scenarios:(options.worlds??[world]).map(fromLegacyScenario),document:doc,location:{search:options.search??'?world='+world.id,assign:(href:string)=>navigated.push(href)},URLSearchParams,innerWidth:options.width??360,structuredClone,confirm:()=>true,localStorage:{getItem:(k:string)=>saved.get(k)??null,setItem:(k:string,v:string)=>saved.set(k,v)},setTimeout:(fn:()=>void,ms:number)=>{const t={fn,ms};timers.push(t);return t;},clearTimeout:(t:{fn:()=>void})=>{t.fn=()=>{};},...(options.modernPointer?{PointerEvent:class{}}:{})};
 const code=stripTypeScriptTypes(readFileSync(new URL('./campaign-main.ts',import.meta.url),'utf8').replace(/^import .*;\n/gm,''));vm.runInNewContext(code,ctx);
 const button=(id:string)=>doc.getElementById(id);const thing=(id:string)=>els.find(e=>e.dataset.target===id);const click=(e:any)=>{assert(e);e.onclick?.({target:e,stopPropagation(){}});};const state=()=>structuredClone(latest!.game) as M.Game;
 return {navigated,resolveFlush:()=>flushWaiters.splice(0).forEach(fn=>fn()),windowEvents,saved,app,doc,button,thing,click,state,timers,key,emitSaveStatus,flushSave,retries:()=>retries,lifecycleInstalled:()=>lifecycleInstalled,setHit:(e:any)=>hit=e,flush:()=>timers.filter(t=>t.ms===0).forEach(t=>t.fn())};
}
test('click creation, advance modal, exact placement gold, undo and reset',()=>{const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));assert.equal(h.state().state.metrics.combinations,1);assert(h.thing('beacon').classes.has('goal-met'));assert(h.thing('lamp'));h.timers.filter(t=>t.ms===700).at(-1)?.fn();assert(h.button('mission').open);assert(!h.thing('beacon').classes.has('goal-met'));h.click(h.button('close'));h.click(h.thing('beacon'));h.click(h.thing('@ridge'));assert(h.thing('beacon').classes.has('goal-met'));assert(h.thing('@ridge').classes.has('goal-met'));h.click(h.button('undo'));assert(!h.thing('beacon').classes.has('goal-met'));h.click(h.button('reset'));assert(h.button('mission').open);assert(!h.thing('beacon'));});
test('drag creation leaves source at origin and ordinary drop uses release position',()=>{const h=harness();h.click(h.button('close'));const origin=structuredClone(h.state().state.tokens.find(t=>t.id==='lamp'));let board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});h.setHit(h.thing('battery'));board.onpointermove({clientX:152,clientY:56,pointerId:1});board.onpointerup({clientX:152,clientY:56,pointerId:1});assert.deepEqual(h.state().state.tokens.find(t=>t.id==='lamp'),origin);assert(h.thing('beacon'));h.flush();board=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:2,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:200,clientY:300,pointerId:2});board.onpointerup({clientX:200,clientY:300,pointerId:2});assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.x,200);assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.y,300);});
test('cancelled drag and mission interruption do not combine',()=>{const h=harness();h.click(h.button('close'));const before=h.state().state;const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});h.setHit(h.thing('battery'));board.onpointermove({clientX:152,clientY:56,pointerId:1});board.onpointercancel({pointerId:1});assert.deepEqual(h.state().state,before);h.click(h.button('purpose'));assert(h.button('mission').open);h.click(h.button('modal-reset'));assert.equal(h.state().state.metrics.combinations,0);});

test('REGRESSION: unrelated pointerup must not finish active drag',()=>{const h=harness();h.click(h.button('close'));const before=h.state().state;const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:220,clientY:300,pointerId:1});board.onpointerup({clientX:100,clientY:100,pointerId:2});assert.deepEqual(h.state().state,before);});
test('lost capture cancels drag without a move; stale up does nothing',()=>{const h=harness();h.click(h.button('close'));const before=h.state().state;const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});board.onpointermove({clientX:220,clientY:300,pointerId:1});board.onlostpointercapture({pointerId:1});h.setHit(h.thing('battery'));board.onpointerup({clientX:152,clientY:56,pointerId:1});assert.deepEqual(h.state().state,before);});
test('saved stage roundtrip and undo preserves prior places',()=>{const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.timers.filter(t=>t.ms===700).at(-1)?.fn();h.click(h.button('close'));const before=h.state();const loaded=harness(fixture,h.saved.get('tangible-campaign-v1:fixture'));assert.deepEqual(loaded.state(),before);loaded.click(loaded.button('undo'));assert.equal(loaded.state().state.stage,0);assert(!loaded.thing('@ridge'));assert(loaded.thing('lamp'));});
test('incoming catalyst highlights receiver without explanatory text',()=>{const world=structuredClone(fixture);world.stages[0].locations=['ridge'];world.stages[1].locations=[];world.recipes[0].at='ridge';const h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('@ridge'));h.thing('lamp').onmouseenter();assert(!h.doc.querySelector('#inspection'));assert(h.thing('battery').classes.has('possible'));h.click(h.thing('battery'));h.click(h.thing('lamp'));assert(h.thing('beacon'));});
test('second pointer cannot adopt drag or cancel first pointer',()=>{const h=harness();h.click(h.button('close'));const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});board.onpointerdown({target:h.thing('battery'),button:0,clientX:152,clientY:56,pointerId:2,preventDefault(){}});board.onpointercancel({pointerId:2});board.onlostpointercapture({pointerId:2});h.setHit(null);board.onpointermove({clientX:220,clientY:300,pointerId:1});board.onpointerup({clientX:220,clientY:300,pointerId:1});assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.x,220);assert.equal(h.state().state.tokens.find(t=>t.id==='battery')!.x,152);});
test('legacy fallback ignores second finger and commits only owned touch',()=>{const h=harness();h.click(h.button('close'));const board:any=h.doc.querySelector('.board');const touch=(identifier:number,clientX=52,clientY=56)=>({identifier,clientX,clientY});const fire=(name:string,args:any)=>board.listeners[name][0]({preventDefault(){},...args});fire('touchstart',{target:h.thing('lamp'),changedTouches:[touch(1)]});fire('touchstart',{target:h.thing('battery'),changedTouches:[touch(2)]});fire('touchcancel',{changedTouches:[touch(2)]});fire('touchmove',{touches:[touch(1,220,300),touch(2)]});fire('touchend',{changedTouches:[touch(2)]});assert.equal(h.state().state.metrics.moves,0);h.setHit(null);fire('touchend',{changedTouches:[touch(1,220,300)]});assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.x,220);});
test('resize and blur interrupt drag without committing transient coordinates',()=>{for(const event of ['resize','blur']){const h=harness();h.click(h.button('close'));const before=h.state().state;const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});board.onpointermove({clientX:220,clientY:300,pointerId:1});h.windowEvents[event]();h.setHit(null);board.onpointerup({clientX:220,clientY:300,pointerId:1});assert.deepEqual(h.state().state,before);}});
test('ordinary no-growth drop into prior area changes actual area with same unique ID and fixed area tops',()=>{const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.timers.filter(t=>t.ms===700).at(-1)?.fn();h.click(h.button('close'));const saved=JSON.parse(h.saved.get('tangible-campaign-v1:fixture')!);const top=saved.tops.hill;const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('beacon'),button:0,clientX:52,clientY:top+56,pointerId:1,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:220,clientY:56,pointerId:1});board.onpointerup({clientX:220,clientY:56,pointerId:1});const g=h.state();assert.equal(g.state.tokens.find(t=>t.id==='beacon')!.area,'camp');assert.equal(g.state.tokens.find(t=>t.id==='beacon')!.y,56);assert.equal(g.state.tokens.filter(t=>t.id==='beacon').length,1);assert.equal(g.state.currentArea,'camp');assert.deepEqual(JSON.parse(h.saved.get('tangible-campaign-v1:fixture')!).tops,saved.tops);});
test('checkpoint interruption cancels drag and opens replayed-stage mission',()=>{const world=structuredClone(fixture);world.checkpoints=[{id:'hill',label:'Hill',actions:[{type:'combine',a:'lamp',b:'battery'},{type:'advance'}]}];const h=harness(world);h.click(h.button('close'));const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});board.onpointermove({clientX:220,clientY:300,pointerId:1});h.button('jump')!.onchange({target:{value:'hill'}});h.setHit(null);board.onpointerup({clientX:220,clientY:300,pointerId:1});assert.equal(h.state().state.stage,1);assert(h.button('mission')!.open);assert.equal(h.state().state.metrics.moves,0);assert.equal(h.state().state.tokens.find(t=>t.id==='beacon')!.area,'hill');});

test('location gesture uses the shared resolver: new recipe first, then ordinary placement',()=>{
 const world=structuredClone(fixture);world.stages[0].locations=['ridge'];world.stages[1].locations=[];world.recipes[0].b='@ridge';
 const h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('@ridge'));
 assert.equal(h.state().events.at(-1)!.action.type,'combine');assert(h.thing('beacon'));
 h.click(h.thing('lamp'));h.click(h.thing('@ridge'));
 assert.deepEqual(h.state().events.at(-1)!.action,{type:'place',item:'lamp',location:'ridge'});
 assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.location,'ridge');
});
test('completing a chapter shows the next challenge directly, and undo restores the earlier challenge',()=>{
 const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));
 assert(!h.button('mission').open);h.timers.filter(t=>t.ms===700).at(-1)?.fn();
 assert.equal(h.state().state.stage,1);assert(h.button('mission').open);assert(h.doc.querySelector('.motivation'));assert(!h.doc.querySelector('.completion-story'));assert(!h.button('modal-next'));
 assert(!h.app.innerHTML.includes(fixture.stages[0].completionText!));assert(h.app.innerHTML.includes(fixture.stages[1].motivation));
 h.click(h.button('close'));h.click(h.button('undo'));assert.equal(h.state().state.stage,0);assert.equal(h.state().state.completed,false);
});
test('final challenge automatically finishes and shows its ending once; reload and undo work',()=>{
 const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.timers.filter(t=>t.ms===700).at(-1)?.fn();h.click(h.button('close'));
 h.click(h.thing('beacon'));h.click(h.thing('@ridge'));h.timers.filter(t=>t.ms===700).at(-1)?.fn();
 assert(h.state().state.completed);assert(h.button('mission').open);assert(!h.button('modal-next'));assert(h.app.innerHTML.includes(fixture.stages[1].completionText!));
 h.click(h.button('close'));const loaded=harness(fixture,h.saved.get(h.key));assert(loaded.state().state.completed);assert(!loaded.button('mission').open);
 loaded.click(loaded.button('purpose'));assert(loaded.button('mission').open);loaded.click(loaded.button('close'));loaded.click(loaded.button('undo'));assert(!loaded.state().state.completed);
});
test('moving an exact-placement objective away removes premature ending before Finish',()=>{
 const world=structuredClone(fixture);world.initialItems=['beacon'];world.stages=[world.stages[1]];const h=harness(world);h.click(h.button('close'));h.click(h.thing('beacon'));h.click(h.thing('@ridge'));assert(!h.button('next'));assert(h.button('modal-next'));
 const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('beacon'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:200,clientY:300,pointerId:1});board.onpointerup({clientX:200,clientY:300,pointerId:1});
 assert(!h.button('next'));assert(!h.doc.querySelector('.completion-story'));h.click(h.button('purpose'));assert(h.doc.querySelector('.motivation'));
});
test('checkpoint DEBUG marker lives in popup, restores from compact save and clears only on reset',()=>{
 const world=structuredClone(fixture);world.checkpoints=[{id:'hill',label:'Hill checkpoint',actions:[{type:'combine',a:'lamp',b:'battery'},{type:'advance'}]}];
 const h=harness(world);h.button('jump').onchange({target:{value:'hill'}});const marker=h.doc.querySelector('.debug-marker');assert(marker);assert.equal(marker.parentElement.id,'debug-dialog');assert.equal(h.button('debug-toggle').dataset.debug,'true');
 assert.match(h.app.innerHTML,/DEBUG · Hill checkpoint/);h.click(h.button('close'));h.click(h.button('undo'));assert(h.doc.querySelector('.debug-marker'));
 const raw=encodeSave(decodeSave(h.saved.get(h.key)!));const loaded=harness(world,raw);assert.match(loaded.app.innerHTML,/DEBUG · Hill checkpoint/);
 loaded.click(loaded.button('reset'));assert(!loaded.doc.querySelector('.debug-marker'));assert.equal(decodeSave(loaded.saved.get(loaded.key)!).debugName,undefined);
});
test('active chooser hides archived school and causation, preserving direct archived routes',()=>{
 const oldBoat={...structuredClone(fixture),id:'causation',title:'Why This Boat?'},oldSchool={...structuredClone(fixture),id:'chinese-thought',title:'The School by the Well'},newBoat={...structuredClone(fixture),id:'current-test-workshop',title:'The rebuilt boatyard'},worlds=[fixture,oldBoat,oldSchool,newBoat];
 const h=harness(fixture,undefined,{worlds,search:''});assert.match(h.app.innerHTML,/A small journey/);assert(!h.app.innerHTML.includes(oldBoat.title));assert(!h.app.innerHTML.includes(oldSchool.title));assert(h.app.innerHTML.includes(newBoat.title));
 for(const world of [oldBoat,oldSchool]){const route=harness(world,undefined,{worlds});assert(route.button('mission').open);assert(route.app.innerHTML.includes(world.title));route.click(route.button('close'));assert.equal(route.state().scenarioId,world.id);}
});
test('previous full campaigns remain playable directly but are unlisted in the active chooser',()=>{
 const archived=[...archivedScenarioIds].map((id,i)=>({...structuredClone(fixture),id,title:'Archived full campaign '+i}));
 const worlds=[fixture,...archived];const menu=harness(fixture,undefined,{worlds,search:''});
 for(const world of archived){assert(!menu.app.innerHTML.includes(world.title));const direct=harness(world,undefined,{worlds});assert(direct.button('mission').open);direct.click(direct.button('close'));assert.equal(direct.state().scenarioId,world.id);}
});
test('modern pointer ownership ignores compatibility Touch Events',()=>{
 const h=harness(fixture,undefined,{modernPointer:true});h.click(h.button('close'));const board:any=h.doc.querySelector('.board');
 board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});
 board.listeners.touchstart[0]({target:h.thing('battery'),changedTouches:[{identifier:2,clientX:152,clientY:56}],preventDefault(){}});
 board.listeners.touchend[0]({changedTouches:[{identifier:2,clientX:152,clientY:56}],preventDefault(){}});
 h.setHit(null);board.onpointermove({clientX:220,clientY:300,pointerId:1});board.onpointerup({clientX:220,clientY:300,pointerId:1});
 assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.x,220);assert.equal(h.state().state.metrics.moves,1);
});
test('async save status is truthful and updates without cancelling drag; failures expose retry',()=>{
 const h=harness(fixture,undefined,{deferSave:true});assert(h.lifecycleInstalled());h.click(h.button('close'));
 assert.equal(h.saved.has(h.key),false);assert.equal(h.button('save-status').textContent,'Saving progress…');assert(h.button('retry-save').hidden);
 const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});board.onpointermove({clientX:220,clientY:300,pointerId:1});
 h.emitSaveStatus('error','Progress is not saved. Storage is full.');assert.equal(h.doc.querySelector('.board'),board);assert(!h.button('retry-save').hidden);assert.match(h.button('save-status').textContent,/not saved/);
 h.setHit(null);board.onpointerup({clientX:220,clientY:300,pointerId:1});assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.x,220);
 h.emitSaveStatus('error','Progress is not saved. Storage is full.');h.click(h.button('retry-save'));assert.equal(h.retries(),1);assert.equal(h.button('save-status').textContent,'Saving progress…');
 h.flushSave();assert.equal(h.button('save-status').textContent,'Progress saved.');assert(h.button('retry-save').hidden);assert.equal(decodeSave(h.saved.get(h.key)!).game instanceof Object,true);
});
test('invalid save is reported without crashing and reset starts a playable new journey',()=>{
 const h=harness(fixture,'not a valid save');assert(h.button('mission').open);assert.match(h.button('save-status').textContent,/could not be loaded/);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));assert(h.thing('beacon'));h.click(h.button('reset'));assert(h.thing('lamp'));assert(!h.thing('beacon'));
});
test('small-screen scroll containment is explicit in CSS (not native layout evidence)',()=>{
 const css=readFileSync(new URL('./campaign.css',import.meta.url),'utf8');assert.match(css,/\.chooser\{height:100%;min-height:0;[^}]*overflow-y:auto/);assert.match(css,/\.objectives\{[^}]*max-height:min\(20dvh,140px\);overflow-y:auto/);assert.match(css,/#app\{height:100dvh;position:relative;overflow:hidden/);assert.match(css,/\.viewport\{position:absolute;inset:0;/);assert.match(css,/\.hud-stack\{position:absolute;[^}]*top:/);assert.match(css,/\.debug-toggle\{[^}]*width:44px;height:44px/);assert.match(css,/dialog button,dialog select\{min-height:44px/);assert(!css.includes('.footer{'));assert(!css.includes('.toolbar{'));
});
test('in-app navigation awaits durable save and stays on the current journey after failure',async()=>{
 const h=harness(fixture,undefined,{deferSave:true});h.click(h.button('close'));
 h.emitSaveStatus('error','Progress is not saved.');let prevented=false;
 await h.button('go-chooser').onclick({preventDefault(){prevented=true;}});assert(prevented);assert.deepEqual(h.navigated,[]);assert.match(h.doc.querySelector('.feedback').textContent,/not saved/);
 h.click(h.button('retry-save'));await h.button('go-chooser').onclick({preventDefault(){}});assert.deepEqual(h.navigated,['campaign.html']);assert(h.saved.has(h.key));
});
test('newer navigation wins and reset cancels an outstanding save-before-navigation request',async()=>{
 const h=harness(fixture,undefined,{deferFlush:true});h.click(h.button('close'));
 const first=h.button('go-chooser').onclick({preventDefault(){}}),second=h.button('go-original').onclick({preventDefault(){}});h.resolveFlush();await Promise.all([first,second]);assert.deepEqual(h.navigated,['mars-expedition.html']);
 const pending=h.button('go-chooser').onclick({preventDefault(){}});h.click(h.button('reset'));h.resolveFlush();await pending;assert.deepEqual(h.navigated,['mars-expedition.html']);assert(h.button('mission').open);
});
test('after Finish, moved creations retain the recorded ending without claiming current placement',()=>{
 const world=structuredClone(fixture);world.initialItems=['beacon'];world.stages=[world.stages[1]];const h=harness(world);h.click(h.button('close'));h.click(h.thing('beacon'));h.click(h.thing('@ridge'));h.timers.filter(t=>t.ms===700).at(-1)?.fn();h.click(h.button('close'));
 const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('beacon'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:200,clientY:300,pointerId:1});board.onpointerup({clientX:200,clientY:300,pointerId:1});
 assert(h.state().state.completed);assert(!h.thing('beacon').classes.has('goal-met'));assert(!h.button('next'));assert.match(h.app.innerHTML,/At journey’s end:/);assert(h.app.innerHTML.includes(world.stages[0].completionText!));assert(!h.doc.querySelector('.motivation'));
});
test('mission presents the challenge and local context without carried-item narration',()=>{
 const world=structuredClone(fixture);world.stages[0].area.travelText='We collect useful things from places already visited.';
 world.initialItems=['battery'];world.stages[0].caches=[{id:'initial-store',label:'Supplies at camp',narrative:'The landing pack is already beside you.',items:['lamp']}];
 const h=harness(world);assert(h.button('mission').open);assert(!h.app.innerHTML.includes(world.stages[0].area.travelText));assert(h.app.innerHTML.includes('Supplies at camp'));assert(h.app.innerHTML.includes('The landing pack is already beside you.'));
 h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.timers.filter(t=>t.ms===700).at(-1)?.fn();
 assert(h.button('mission').open);assert(!h.app.innerHTML.includes(world.stages[1].area.travelText));assert(h.app.innerHTML.includes(world.stages[1].motivation));
});

test('objective card opens current description; dismissal preserves scroll and restores trigger focus',()=>{
 const h=harness();h.click(h.button('close'));const v:any=h.doc.querySelector('.viewport');v.scrollTop=137;
 assert(!h.doc.querySelector('.toolbar'));assert(!h.doc.querySelector('.footer'));assert(!h.doc.querySelector('.progress'));
 assert.equal(h.button('purpose').attrs['aria-haspopup'],'dialog');
 h.click(h.button('purpose'));assert(h.button('mission').open);assert(h.doc.querySelector('.motivation'));assert(h.app.innerHTML.includes(fixture.stages[0].motivation));
 let prevented=false;h.button('mission').oncancel({preventDefault(){prevented=true;}});
 assert(prevented);assert(!h.button('mission').open);assert.equal((h.doc.querySelector('.viewport') as any).scrollTop,137);assert.equal(h.doc.activeElement,h.button('purpose'));
 h.click(h.button('purpose'));const mission=h.button('mission');mission.onclick({target:mission,clientX:100,clientY:100});assert(h.button('mission').open);
 mission.onclick({target:mission,clientX:400,clientY:100});assert(!h.button('mission').open);
});
test('chapter completion lets birth finish, then opens only the next challenge with no acknowledgement',()=>{
 const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));
 assert(h.thing('beacon').classes.has('born'));assert(!h.button('mission').open);assert.equal(h.state().state.stage,0);
 h.timers.filter(t=>t.ms===700).at(-1)?.fn();assert.equal(h.state().state.stage,1);assert(h.button('mission').open);assert(h.doc.querySelector('.motivation'));assert(!h.doc.querySelector('.completion-story'));assert(!h.button('modal-next'));
 assert(h.app.innerHTML.includes(fixture.stages[1].motivation));assert(!h.app.innerHTML.includes(fixture.stages[0].completionText!));
});
test('bug popup groups controls, survives repeated undo, and dismisses by close, Escape and backdrop',()=>{
 const h=harness();h.click(h.button('close'));const v:any=h.doc.querySelector('.viewport');v.scrollTop=94;const before=h.state();
 for(const dismiss of ['button','escape','backdrop']){
  h.click(h.button('debug-toggle'));assert(h.button('debug-dialog').open);assert(!h.button('mission').open);assert.equal(h.button('debug-toggle').attrs['aria-expanded'],'true');
  for(const id of ['undo','reset','current','travel','jump','go-chooser','go-original','save-status'])assert(h.button(id).closest('#debug-dialog'));
  if(dismiss==='button')h.click(h.button('debug-close'));
  if(dismiss==='escape')h.button('debug-dialog').oncancel({preventDefault(){}});
  if(dismiss==='backdrop'){const d=h.button('debug-dialog');d.onclick({target:d,clientX:-1,clientY:20});}
  assert(!h.button('debug-dialog').open);assert.equal(h.button('debug-toggle').attrs['aria-expanded'],'false');assert.equal(h.doc.activeElement,h.button('debug-toggle'));assert.equal((h.doc.querySelector('.viewport') as any).scrollTop,94);assert.deepEqual(h.state(),before);
 }
 h.click(h.thing('lamp'));h.click(h.thing('battery'));h.click(h.button('debug-toggle'));h.click(h.button('undo'));assert(h.button('debug-dialog').open);assert(!h.thing('beacon'));h.click(h.button('undo'));assert(h.button('debug-dialog').open);
});
test('opening overlays cancels active pointer and legacy touch gestures without stale drop',()=>{
 for(const mode of ['pointer','touch'])for(const overlay of ['purpose','debug-toggle']){
  const h=harness();h.click(h.button('close'));const before=h.state().state,board:any=h.doc.querySelector('.board');
  if(mode==='pointer'){board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});board.onpointermove({clientX:220,clientY:300,pointerId:1});}
  else{board.listeners.touchstart[0]({target:h.thing('lamp'),changedTouches:[{identifier:1,clientX:52,clientY:56}],preventDefault(){}});board.listeners.touchmove[0]({touches:[{identifier:1,clientX:220,clientY:300}],preventDefault(){}});}
  assert(h.app.classes.has('is-dragging'));h.click(h.button(overlay));assert(!h.app.classes.has('is-dragging'));h.setHit(h.thing('battery'));
  if(mode==='pointer')board.onpointerup({clientX:152,clientY:56,pointerId:1});else board.listeners.touchend[0]({changedTouches:[{identifier:1,clientX:152,clientY:56}],preventDefault(){}});
  assert.deepEqual(h.state().state,before);assert(h.button(overlay==='purpose'?'mission':'debug-dialog').open);
 }
});
test('save failures remain actionable outside closed debug; status updates preserve the open popup',()=>{
 const h=harness(fixture,undefined,{deferSave:true});h.click(h.button('close'));assert(h.button('save-alert').hidden);
 h.emitSaveStatus('error','Progress is not saved. Storage is full.');assert(!h.button('save-alert').hidden);assert(!h.button('debug-dialog').open);assert.equal(h.button('debug-toggle').dataset.saveError,'true');
 h.click(h.button('save-alert'));const d=h.button('debug-dialog');assert(d.open);assert(!h.button('retry-save').hidden);h.click(h.button('retry-save'));assert.equal(h.button('debug-dialog'),d);assert(d.open);
 h.flushSave();assert(h.button('save-alert').hidden);assert.equal(h.button('debug-toggle').dataset.saveError,'false');assert.equal(h.button('debug-dialog'),d);assert.equal(h.button('save-status').textContent,'Progress saved.');
});
test('earlier-area and current-area controls close popup without losing selection or save state',()=>{
 const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.timers.filter(t=>t.ms===700).at(-1)?.fn();h.click(h.button('close'));
 h.click(h.thing('beacon'));h.click(h.button('debug-toggle'));h.button('travel').onchange({target:{value:'camp'}});
 assert(!h.button('debug-dialog').open);assert.equal(h.state().state.currentArea,'camp');assert.equal(h.state().state.tokens.find(t=>t.id==='beacon')!.area,'camp');assert(h.thing('beacon').classes.has('selected'));
 const tops=decodeSave(h.saved.get(h.key)!).tops;(h.doc.querySelector('.viewport') as any).scrollTop=200;h.click(h.button('debug-toggle'));h.click(h.button('current'));
 assert(!h.button('debug-dialog').open);assert.equal((h.doc.querySelector('.viewport') as any).scrollTop,tops.camp);assert.equal((decodeSave(h.saved.get(h.key)!).game as M.Game).state.currentArea,'camp');
});
test('selection and ordinary actions use visual feedback without explanatory bubbles',()=>{
 const world=structuredClone(fixture);world.items[0].description='A portable lamp.';const h=harness(world);h.click(h.button('close'));
 h.click(h.thing('lamp'));assert(h.thing('lamp').classes.has('selected'));assert(!h.doc.querySelector('.inspection-overlay'));assert(!h.app.innerHTML.includes('A portable lamp.'));assert(!h.doc.querySelector('.objective-caption'));
 h.click(h.thing('lamp'));assert(!h.thing('lamp').classes.has('selected'));
 h.click(h.thing('lamp'));h.click(h.thing('battery'));assert(h.thing('beacon'));assert(h.doc.querySelector('.feedback').hidden);
});

test('automatic completion popup is cancelled by undo or reset and does not reopen after dismissal',()=>{
 for(const interrupt of ['undo','reset']){
  const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));
  const show=h.timers.filter(t=>t.ms===700).at(-1)!;h.click(h.button(interrupt));if(interrupt==='reset')h.click(h.button('close'));
  show.fn();assert(!h.button('mission').open);assert(!h.thing('beacon'));
 }
 const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));
 const show=h.timers.filter(t=>t.ms===700).at(-1)!;show.fn();assert(h.button('mission').open);
 h.click(h.button('close'));show.fn();assert(!h.button('mission').open);assert(!h.button('next'));
});

test('resuming a ready challenge preserves its current acknowledgement before the next task',()=>{
 const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));
 const loaded=harness(fixture,h.saved.get(h.key));assert.equal(loaded.state().state.stage,0);assert(loaded.button('mission').open);assert(loaded.doc.querySelector('.completion-story'));loaded.click(loaded.button('modal-next'));assert.equal(loaded.state().state.stage,1);assert(loaded.app.innerHTML.includes(fixture.stages[1].motivation));
});

test('six selected journeys are prominent; undeveloped sketches are secondary and remain playable',()=>{
 const ids=featuredScenarioIds;
 const worlds=[...ids.map((id,i)=>({...structuredClone(fixture),id,title:'Priority '+i})),{...structuredClone(fixture),id:'literature',title:'Literature sketch'},{...structuredClone(fixture),id:'restoration',title:'Restoration sketch'},{...structuredClone(fixture),id:'shoreline',title:'Shoreline sketch'}];
 const h=harness(fixture,undefined,{worlds,search:''});const html=h.app.innerHTML;const secondary=html.indexOf('<details class="secondary-journeys">');assert(secondary>0);assert.match(html,/Earlier versions and experiments/);
 for(const id of ids){const at=html.indexOf('?world='+id);assert(at>=0&&at<secondary);}
 for(const world of worlds.filter(s=>!ids.includes(s.id))){assert(html.indexOf('?world='+world.id)>secondary);const direct=harness(world,undefined,{worlds});assert(direct.button('mission').open);direct.click(direct.button('close'));assert.equal(direct.state().scenarioId,world.id);}
 assert(!h.doc.querySelector('.secondary-journeys')?.attrs.open);
});

const readingFixture=()=>{
 const world=structuredClone(fixture);
 world.items[0].label='The good that I would I do not';
 world.items[0].description='Combine this source with Battery to reveal Beacon.';
 world.items[0].reading={text:'For the good that I would I do not:\nbut the evil which I would not, that I do.',attribution:'Romans 7:19 · King James Version'};
 return world;
};
test('readable metadata is optional, validated, copied into the player view, and never inferred from descriptions',()=>{
 const world=readingFixture();const game=M.createGame(world),view=M.playerView(world,game);
 assert.deepEqual(view.things.find(t=>t.id==='lamp')!.reading,world.items[0].reading);
 assert(!('reading' in view.things.find(t=>t.id==='battery')!));
 view.things[0].reading!.text='Changed outside the engine';assert.notEqual(world.items[0].reading!.text,view.things[0].reading!.text);
 assert.deepEqual(M.validateScenario(world),[]);
 for(const reading of [null,{}, {text:'',attribution:'Romans'}, {text:'Passage',attribution:' '}, {text:5,attribution:'Romans'}]){
  const invalid=structuredClone(world);(invalid.items[0] as any).reading=reading;
  assert(M.validateScenario(invalid).includes('Reading needs text and attribution lamp'));
 }
 const ordinary=harness();ordinary.click(ordinary.button('close'));ordinary.click(ordinary.thing('lamp'));
 assert(!ordinary.button('read-source'));assert(!ordinary.button('source-reader'));assert(!ordinary.doc.querySelector('.source-marker'));
});
test('source reading is deliberate, single-instance, and preserves selection, scroll, history and focus on every dismissal',()=>{
 const world=readingFixture(),h=harness(world);h.click(h.button('close'));
 (h.doc.querySelector('.viewport') as any).scrollTop=137;const before=h.state(),saved=h.saved.get(h.key);
 assert.equal(h.doc.querySelectorAll('.source-marker').length,1);assert(h.thing('lamp').classes.has('thing'));
 assert.match(h.thing('lamp').attrs['aria-label'],/readable source/);
 h.click(h.thing('lamp'));assert(h.thing('lamp').classes.has('selected'));assert(!h.button('source-reader'));
 assert(!h.app.innerHTML.includes(world.items[0].reading!.text));assert(!h.app.innerHTML.includes(world.items[0].description!));
 assert.equal(h.doc.activeElement,h.button('read-source'));assert.equal(h.button('read-source').attrs['aria-haspopup'],'dialog');assert.equal(h.button('read-source').attrs['aria-controls'],'source-reader');
 assert(!h.button('read-source').closest('.board'));assert(!h.button('read-source').dataset.target);
 for(const dismiss of ['button','escape','backdrop']){
  h.click(h.button('read-source'));const d=h.button('source-reader');assert(d.open);assert.equal(h.doc.querySelectorAll('#source-reader').length,1);
  assert.equal(h.doc.activeElement,h.button('reader-close'));assert(h.app.innerHTML.includes(world.items[0].reading!.text));assert(h.app.innerHTML.includes(world.items[0].reading!.attribution));
  assert(!h.button('read-source'));assert(h.doc.querySelector('.feedback').hidden);
  assert(!h.app.innerHTML.includes(world.items[0].description!));assert.equal((h.doc.querySelector('.viewport') as any).scrollTop,137);
  d.onclick({target:d,clientX:100,clientY:100});assert(h.button('source-reader').open);
  if(dismiss==='button')h.click(h.button('reader-close'));
  if(dismiss==='escape'){let prevented=false;d.oncancel({preventDefault(){prevented=true;}});assert(prevented);}
  if(dismiss==='backdrop')d.onclick({target:d,clientX:-1,clientY:20});
  assert(!h.button('source-reader'));assert(!h.app.innerHTML.includes(world.items[0].reading!.text));assert(h.thing('lamp').classes.has('selected'));
  assert.equal(h.doc.activeElement,h.button('read-source'));assert.equal((h.doc.querySelector('.viewport') as any).scrollTop,137);assert.deepEqual(h.state(),before);assert.equal(h.saved.get(h.key),saved);
 }
 h.click(h.thing('lamp'));assert(!h.button('read-source'));assert(!h.button('source-reader'));
});
test('reader escapes labels, passage text and attribution instead of injecting markup or links',()=>{
 const world=readingFixture();world.items[0].label='<img id="bad-label"> & "source"';world.items[0].reading={text:'<script id="bad-text">evil()</script> & "words"',attribution:'<a id="bad-credit" href="javascript:evil()">Author\'s text</a>'};
 const h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.button('read-source'));
 for(const id of ['bad-label','bad-text','bad-credit'])assert(!h.button(id));
 assert.match(h.app.innerHTML,/&lt;script id=&quot;bad-text&quot;&gt;evil\(\)&lt;\/script&gt; &amp; &quot;words&quot;/);
 assert.match(h.app.innerHTML,/Author&#39;s text&lt;\/a&gt;/);assert(!h.app.innerHTML.includes(world.items[0].description!));
});
test('reading a source in an older area is observational for clicks and touch-sized pointer taps',()=>{
 for(const pointer of [false,true]){
  const world=readingFixture(),h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.timers.filter(t=>t.ms===700).at(-1)!.fn();h.click(h.button('close'));
  assert.equal(h.state().state.currentArea,'hill');assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.area,'camp');
  const before=h.state(),saved=h.saved.get(h.key);
  if(pointer){const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:4,preventDefault(){}});board.onpointerup({clientX:52,clientY:56,pointerId:4});}
  else h.click(h.thing('lamp'));
  h.click(h.button('read-source'));h.click(h.button('reader-close'));
  assert.deepEqual(h.state(),before);assert.equal(h.saved.get(h.key),saved);assert(h.thing('lamp').classes.has('selected'));
  // Reading did not activate/carry the old source, but a deliberate move still can.
  h.flush();h.click(h.button('debug-toggle'));h.button('travel').onchange({target:{value:'hill'}});
  assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.area,'hill');
 }
});
test('source marker and selection do not steal pointer or legacy-touch drags or synthesize a reading action',()=>{
 for(const mode of ['pointer','touch']){
  const world=readingFixture(),h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));
  const read=h.button('read-source'),board:any=h.doc.querySelector('.board'),marker=h.doc.querySelector('.source-marker');
  if(mode==='pointer'){board.onpointerdown({target:marker,button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});board.onpointermove({clientX:152,clientY:56,pointerId:1});}
  else{board.listeners.touchstart[0]({target:marker,changedTouches:[{identifier:1,clientX:52,clientY:56}],preventDefault(){}});board.listeners.touchmove[0]({touches:[{identifier:1,clientX:152,clientY:56}],preventDefault(){}});}
  assert(h.app.classes.has('is-dragging'));h.click(read);assert(!h.button('source-reader'));h.setHit(h.thing('battery'));
  if(mode==='pointer')board.onpointerup({clientX:152,clientY:56,pointerId:1});else board.listeners.touchend[0]({changedTouches:[{identifier:1,clientX:152,clientY:56}],preventDefault(){}});
  assert(h.thing('beacon'));assert.equal(h.state().state.metrics.combinations,1);assert(!h.button('source-reader'));assert(!h.button('read-source'));
 }
 const world=readingFixture(),h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));const before=h.state(),board:any=h.doc.querySelector('.board');
 board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});board.onpointermove({clientX:220,clientY:300,pointerId:1});board.onpointercancel({pointerId:1});
 h.click(h.button('read-source'));assert(h.button('source-reader').open);h.setHit(h.thing('battery'));board.onpointerup({clientX:152,clientY:56,pointerId:1});assert.deepEqual(h.state(),before);
});
test('reader is transient across reset, checkpoints, other overlays and saved navigation',async()=>{
 const world=readingFixture();world.checkpoints=[{id:'hill',label:'Hill',actions:[{type:'combine',a:'lamp',b:'battery'},{type:'advance'}]}];
 for(const interrupt of ['reset','checkpoint','purpose','debug']){
  const h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.button('read-source'));
  if(interrupt==='reset')h.click(h.button('reset'));
  if(interrupt==='checkpoint')h.button('jump').onchange({target:{value:'hill'}});
  if(interrupt==='purpose')h.click(h.button('purpose'));
  if(interrupt==='debug')h.click(h.button('debug-toggle'));
  assert(!h.button('source-reader'));assert(!h.app.innerHTML.includes(world.items[0].reading!.text));assert(!h.button('read-source'));
  assert(h.button(interrupt==='debug'?'debug-dialog':'mission').open);
 }
 const h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.button('read-source'));h.click(h.button('reader-close'));h.click(h.button('debug-toggle'));
 await h.button('go-chooser').onclick({preventDefault(){}});assert.deepEqual(h.navigated,['campaign.html']);
 const restored=harness(world,h.saved.get(h.key));assert(!restored.button('source-reader'));assert(!restored.button('read-source'));
});
test('source reading defers but never loses automatic next-stage or final completion, including reopen before queued handoff',()=>{
 for(const final of [false,true]){
  const world=readingFixture();world.items[2].reading={text:'The beacon now shines.',attribution:'A field note'};if(final)world.stages=[world.stages[0]];
  const h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.click(h.thing('beacon'));h.click(h.button('read-source'));
  const before=h.state(),show=h.timers.filter(t=>t.ms===700).at(-1)!;show.fn();assert(h.button('source-reader').open);assert(!h.button('mission').open);assert.deepEqual(h.state(),before);
  h.click(h.button('reader-close'));h.click(h.button('read-source'));h.flush();assert(h.button('source-reader').open);assert.deepEqual(h.state(),before);
  h.button('source-reader').oncancel({preventDefault(){}});h.flush();assert(!h.button('source-reader'));assert(!h.button('read-source'));assert(h.button('mission').open);
  assert.equal(h.state().state.stage,final?0:1);assert.equal(h.state().state.completed,final);
  h.click(h.button('close'));show.fn();h.flush();assert(!h.button('mission').open);assert(!h.button('source-reader'));
 }
});
test('reading completion handoff cannot survive undo, reset, checkpoint or a placement goal being undone',()=>{
 for(const interrupt of ['undo','reset','checkpoint']){
  const world=readingFixture();world.checkpoints=[{id:'start',label:'Beginning',actions:[]}];
  const h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.click(h.thing('lamp'));h.click(h.button('read-source'));
  const show=h.timers.filter(t=>t.ms===700).at(-1)!;show.fn();h.click(h.button('reader-close'));
  if(interrupt==='checkpoint')h.button('jump').onchange({target:{value:'start'}});else h.click(h.button(interrupt));
  if(h.button('mission').open)h.click(h.button('close'));h.flush();show.fn();assert(!h.button('mission').open);assert(!h.button('source-reader'));assert(!h.thing('beacon'));assert.equal(h.state().state.stage,0);
 }
 const world=readingFixture(),h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.timers.filter(t=>t.ms===700).at(-1)!.fn();h.click(h.button('close'));h.click(h.thing('beacon'));h.click(h.thing('@ridge'));h.click(h.thing('lamp'));h.click(h.button('read-source'));h.timers.filter(t=>t.ms===700).at(-1)!.fn();h.click(h.button('reader-close'));h.click(h.button('undo'));h.flush();assert(!h.state().state.completed);assert(!h.button('mission').open);
});
test('text-heavy source tiles use engine-sized label lines at 320/375px without initial overlap',()=>{
 const world=readingFixture();world.initialItems=['lamp','battery','beacon'];world.stages[0].objectives=[{id:'place',text:'Place the beacon',kind:'place',item:'beacon',location:'ridge'}];world.stages[0].locations=['ridge'];world.stages[1].locations=[];
 world.items[1].label='For by grace are ye saved through faith';world.items[1].reading={text:'A longer fragment.',attribution:'Ephesians 2:8 · King James Version'};
 world.items[2].label='The good that I would I do not but evil remains';world.items[2].reading={text:'A longer fragment.',attribution:'A twelve-word draft label'};
 for(const width of [320,375]){
  const g=M.createGame(world,width);
  for(const t of g.state.tokens){const def=M.item(world,t.kind)!,lines=M.itemLabelLines(def.label);assert(lines.length>=3);assert.equal(M.tokenHeight(world,t),22+lines.length*14);assert(t.x-48>=0&&t.x+48<=width);
   for(const other of g.state.tokens.filter(o=>o.id!==t.id))assert(Math.abs(t.x-other.x)>=96||Math.abs(t.y-other.y)>=(M.tokenHeight(world,t)+M.tokenHeight(world,other))/2);
  }
 }
 const h=harness(world);h.click(h.button('close'));for(const t of h.state().state.tokens){assert(h.thing(t.id).classes.has('thing'));assert(h.thing(t.id).classes.has('reading-thing'));assert.match(h.thing(t.id).attrs.style,new RegExp('min-height:'+M.tokenHeight(world,t)+'px'));}
 const css=readFileSync(new URL('./campaign.css',import.meta.url),'utf8');assert.match(css,/\.read-source\{[^}]*min-height:44px/);assert.match(css,/\.reader-heading button\{[^}]*min-width:44px/);assert.match(css,/\.text-thing\{[^}]*line-height:14px/);assert.match(css,/\.is-dragging \.read-source\{visibility:hidden;pointer-events:none\}/);
});

test('long observations use matching text height at 320/375px without acquiring source affordances',()=>{
 const world=structuredClone(fixture);world.items[0].label='The wound heals; nothing evil leaves the patient';world.items[1].label='I take a friend’s share for my own comfort';
 world.items.push({id:'ink',label:'Ink'});world.initialItems.push('ink');
 for(const width of [320,375]){
  const h=harness(world,undefined,{width});h.click(h.button('close'));const g=h.state();assert.equal(g.state.width,width);
  assert(!h.doc.querySelector('.source-marker'));assert(!h.doc.querySelector('.reading-thing'));assert(!h.button('source-reader'));
  for(const id of ['lamp','battery']){
   const def=M.item(world,id)!,lines=M.itemLabelLayout(def)!,t=M.token(g.state,id)!;assert.equal(lines.length,4);assert.equal(lines.join(' '),def.label);assert.equal(M.tokenHeight(world,t),66);
   assert(h.thing(id).classes.has('thing'));assert(h.thing(id).classes.has('text-thing'));assert(!h.thing(id).classes.has('reading-thing'));assert.match(h.thing(id).attrs.style,/min-height:66px/);assert(!h.thing(id).attrs['aria-label'].includes('readable source'));
   assert(t.x-48>=0&&t.x+48<=width);for(const other of g.state.tokens.filter(o=>o.id!==t.id))assert(Math.abs(t.x-other.x)>=96||Math.abs(t.y-other.y)>=(M.tokenHeight(world,t)+M.tokenHeight(world,other))/2);
   h.click(h.thing(id));assert(!h.button('read-source'));assert(!h.button('source-reader'));h.click(h.thing(id));
  }
  assert.equal(h.doc.querySelectorAll('.item-label-line').length,8);assert.equal(M.itemLabelLayout(M.item(world,'ink')!),null);assert.equal(M.tokenHeight(world,M.token(g.state,'ink')!),44);assert(!h.thing('ink').classes.has('text-thing'));
  h.click(h.thing('lamp'));h.click(h.thing('battery'));assert(h.thing('beacon'));assert(!h.button('read-source'));assert.equal(h.state().state.metrics.combinations,1);
 }
});
test('all existing campaign long names use the shared height and fresh 320/375px supplies remain separated',()=>{
 let changed=0;
 for(const world of campaignScenarios){
  for(const def of world.items){const lines=M.itemLabelLayout(def);if(!def.reading&&lines){changed++;assert(lines.length>2);const t:M.Token={id:def.id,kind:def.id,area:'test',location:null,slots:{},incorporated:[],x:0,y:0};const slots=(def.slots??[]).filter(s=>s.required).length;assert.equal(M.tokenHeight(world,t),10+lines.length*14+slots*21);}}
  for(const width of [320,375]){
   const g=M.createGame(world,width);
   for(const t of g.state.tokens){assert(t.x-48>=0&&t.x+48<=width);for(const other of g.state.tokens.filter(o=>o.id!==t.id&&o.area===t.area))assert(Math.abs(t.x-other.x)>=96||Math.abs(t.y-other.y)>=(M.tokenHeight(world,t)+M.tokenHeight(world,other))/2,`${world.id}: ${t.id} overlaps ${other.id} at ${width}px`);}
  }
 }
 assert(changed>0); // Audit is deliberately content-driven, not pinned to today's corpus count.
});

test('integrated chooser has exactly six ordered focuses, explicitly short workshop, and the complete eligible secondary catalogue',()=>{
 const h=harness(fixture,undefined,{worlds:campaignScenarios,search:''}),html=h.app.innerHTML;
 const collapsed=html.indexOf('<details class="secondary-journeys">');assert(collapsed>0);assert(!html.includes('<details open'));assert.match(html,/Earlier versions and experiments/);
 const links=[...html.slice(0,collapsed).matchAll(/href="\?world=([^"]+)"/g)].map(m=>decodeURIComponent(m[1]));assert.deepEqual(links,featuredScenarioIds);assert.equal(links.length,6);
 assert.match(html,/Why This Boat\? · Purpose workshop/);assert.match(html,/Short research prototype/);assert.match(html,/not a full game/);
 const secondary=[...html.slice(collapsed,html.indexOf('</details>')).matchAll(/href="\?world=([^"]+)"/g)].map(m=>decodeURIComponent(m[1]));const eligible=campaignScenarios.filter(s=>!archivedScenarioIds.has(s.id)&&!featuredScenarioIds.includes(s.id)).map(s=>s.id);assert.deepEqual(secondary,eligible);assert.equal(new Set(secondary).size,secondary.length);for(const id of ['literature','restoration','shoreline'])assert(secondary.includes(id));
 for(const id of archivedScenarioIds)assert(!html.includes('?world='+id+'"'),id);
 const quarry=campaignScenarios.find(s=>s.id==='causation-fitting-forms-probe-v2')!;assert.equal(quarry.title,'The Quarry Workshop');const direct=harness(quarry);assert.match(direct.app.innerHTML,/The Quarry Workshop/);
});
test('all actual historical routes still open their original save identity after chooser replacement',()=>{
 for(const world of campaignScenarios.filter(s=>archivedScenarioIds.has(s.id))){const h=harness(world);h.click(h.button('close'));assert.equal(h.key,'tangible-campaign-v1:'+world.id);assert.equal(h.state().scenarioId,world.id);const loaded=harness(world,h.saved.get(h.key));assert.deepEqual(loaded.state(),h.state());}
});

test('Atlas UI selects every earned checkpoint at 320/375/600 without skipping its unfinished scene',()=>{
 const atlas=campaignScenarios.find(s=>s.id==='atlas-connected-questions-v4-methods-and-agreement-research')!;assert.equal(atlas.checkpoints?.length,30);
 for(const width of [320,375,600])for(const [index,cp]of atlas.checkpoints!.entries()){
  const h=harness(atlas,undefined,{width});h.button('jump').onchange({target:{value:cp.id}});const expected=M.checkpoint(atlas,cp.id,width);
  assert.deepEqual(h.state(),expected);assert.equal(h.state().state.stage,Math.min(index,28));assert(h.button('mission').open);assert.match(h.app.innerHTML,/DEBUG ·/);
  if(cp.id!=='complete')assert(!M.stageComplete(atlas,h.state().state),cp.id+' must begin unfinished');else assert(h.state().state.completed);
  h.click(h.button('close'));for(const timer of h.timers.filter(t=>t.ms===700))timer.fn();assert.equal(h.state().state.stage,expected.state.stage);assert.equal(h.state().state.completed,expected.state.completed);
 }
});

const arrivalFixture=()=>{
 const world=structuredClone(fixture);world.items.push({id:'cloth',label:'Cloth'},{id:'packed',label:'Packed beacon'});
 world.recipes.push({id:'pack',a:'beacon',b:'cloth',out:'packed'});
 world.stages[1].caches=[{id:'hill-shelf',label:'Hill shelf',narrative:'A cloth waits beside the path.',items:['lamp','beacon','cloth']}];
 world.stages[1].carry=['beacon'];world.stages[1].objectives=[{id:'pack',text:'Pack the beacon',kind:'create',item:'packed'}];
 world.stages.push({id:'finish',title:'Signal from here',speaker:'Control',motivation:'Stay on the hill.',area:{id:'hill',label:'Hill',travelText:'Stay here.'},carry:[],caches:[],objectives:[{id:'final-place',text:'Place the packed beacon',kind:'place',item:'packed',location:'ridge'}]});
 world.checkpoints=[{id:'arrival',label:'Hill arrival',actions:[{type:'combine',a:'lamp',b:'battery'},{type:'advance'}]}];
 return world;
};
const arrivalHarness=()=>{const world=arrivalFixture(),h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.timers.filter(t=>t.ms===700).at(-1)?.fn();h.click(h.button('close'));return {world,h};};
const divider=(h:ReturnType<typeof harness>)=>h.doc.querySelector('.arrival-divider');
function arrivalDrag(h:ReturnType<typeof harness>,id:string,y:number,hit:any=null){
 const g=h.state(),t=M.token(g.state,id)!,tops=decodeSave(h.saved.get(h.key)!).tops,board:any=h.doc.querySelector('.board');
 board.onpointerdown({target:h.thing(id),button:0,clientX:t.x,clientY:tops[t.area]+t.y,pointerId:7,preventDefault(){}});h.setHit(hit);
 board.onpointermove({clientX:t.x+6,clientY:tops[t.area]+y,pointerId:7});return {board,release:()=>board.onpointerup({clientX:t.x+6,clientY:tops[t.area]+y,pointerId:7})};
}
test('mixed arrivals use a dotted new-items separator, never New/Carried badges or lists',()=>{
 const {h}=arrivalHarness(),g=h.state(),d=g.state.arrivalLayout!;assert(d.active);assert(divider(h));
 assert.equal(divider(h).attrs.role,'separator');assert.equal(divider(h).attrs['aria-label'],'New items');assert(!divider(h).dataset.target);
 assert(!h.doc.querySelector('.arrival-badge'));assert(!h.doc.querySelector('.arrival-details'));assert(!/Carried|New supply this chapter/.test(h.app.innerHTML));
 assert(M.token(g.state,'beacon')!.y+M.tokenHeight(arrivalFixture(),M.token(g.state,'beacon')!)/2<d.dividerY);
 assert(M.token(g.state,'cloth')!.y-M.tokenHeight(arrivalFixture(),M.token(g.state,'cloth')!)/2>d.dividerY);
 assert(g.state.places.find(p=>p.id==='ridge')!.y+41<d.dividerY);assert(!h.thing('@ridge').dataset.arrival);
 assert.equal(h.thing('beacon').attrs['aria-label'],'Beacon');assert(!h.thing('cloth').classes.has('born'));assert(!h.thing('cloth').classes.has('goal-met'));assert(!h.app.innerHTML.includes('Packed beacon'));
 const css=readFileSync(new URL('./campaign.css',import.meta.url),'utf8');assert.match(css,/\.arrival-divider\{[^}]*border-top:1px dotted[^}]*pointer-events:none/);
});
test('selection, same-side placement, dialogs, scroll, resize and compact reload preserve division',()=>{
 const {world,h}=arrivalHarness();h.click(h.thing('cloth'));h.click(h.thing('cloth'));
 const d=h.state().state.arrivalLayout!,drag=arrivalDrag(h,'cloth',d.dividerY+90);assert(divider(h));drag.release();h.flush();assert(divider(h));
 h.click(h.button('debug-toggle'));h.click(h.button('debug-close'));const viewport:any=h.doc.querySelector('.viewport');viewport.scrollTop=123;
 h.click(h.button('purpose'));h.click(h.button('close'));assert.equal((h.doc.querySelector('.viewport') as any).scrollTop,123);
 h.windowEvents.resize();assert(divider(h));const before=h.state(),loaded=harness(world,encodeSave(decodeSave(h.saved.get(h.key)!)));
 assert(divider(loaded));assert.deepEqual(loaded.state(),before);assert(!loaded.thing('cloth').classes.has('born'));
});
test('the first committed move across either side removes the line; transient crossing and undo are exact',()=>{
 for(const id of ['cloth','beacon']){const {h}=arrivalHarness(),before=h.state(),d=before.state.arrivalLayout!;
  const crossing=arrivalDrag(h,id,id==='cloth'?d.dividerY-30:d.dividerY+50);assert(divider(h));assert.equal(h.state().state.arrivalLayout!.active,true);crossing.release();assert(!divider(h));assert.equal(h.state().state.arrivalLayout!.active,false);
  h.click(h.button('undo'));assert(divider(h));assert.deepEqual(h.state().state.tokens,before.state.tokens);
 }
});
test('accepted cross-group click combinations and location placements mix groups even when a tool snaps back',()=>{
 const {h}=arrivalHarness(),origin=structuredClone(M.token(h.state().state,'beacon'));
 h.click(h.thing('beacon'));assert(divider(h));h.click(h.thing('cloth'));assert(!divider(h));assert.deepEqual(M.token(h.state().state,'beacon'),origin);assert(h.thing('packed').classes.has('born'));
 h.click(h.button('undo'));assert(divider(h));h.click(h.thing('cloth'));h.click(h.thing('@ridge'));assert(!divider(h));assert.equal(M.token(h.state().state,'cloth')!.location,'ridge');
});
test('rejected cross-group drops snap back without removing the divider',()=>{
 const world=arrivalFixture();world.items.push({id:'stone',label:'Stone'});world.initialItems.push('stone');world.stages[1].carry!.push('stone');
 const g=M.checkpoint(world,'arrival'),h=harness(world,encodeSave({game:g,tops:{camp:0,hill:400},seen:[0,1]}));
 const original=structuredClone(M.token(g.state,'cloth'));const move=arrivalDrag(h,'cloth',M.token(g.state,'stone')!.y,h.thing('stone'));move.release();assert(divider(h));assert.equal(h.state().events.at(-1)!.accepted,false);assert.deepEqual(M.token(h.state().state,'cloth'),original);
});
test('cancelled, interrupted and unowned pointer gestures cannot remove the divider',()=>{
 for(const cancel of ['cancel','lost','resize','blur','foreign']){const {h}=arrivalHarness(),before=h.state();const gesture=arrivalDrag(h,'cloth',before.state.arrivalLayout!.dividerY-20);
  if(cancel==='cancel')gesture.board.onpointercancel({pointerId:7});else if(cancel==='lost')gesture.board.onlostpointercapture({pointerId:7});else if(cancel==='foreign'){gesture.board.onpointerup({clientX:60,clientY:420,pointerId:8});gesture.board.onpointercancel({pointerId:7});}else h.windowEvents[cancel]();
  gesture.release();assert(divider(h),cancel);assert.deepEqual(h.state(),before,cancel);
 }
});
test('owned legacy touch crossings dismiss once, while a second finger and cancellation do not',()=>{
 const {h}=arrivalHarness(),g=h.state(),t=M.token(g.state,'cloth')!,top=decodeSave(h.saved.get(h.key)!).tops.hill,board:any=h.doc.querySelector('.board');
 const touch=(identifier:number,y:number)=>({identifier,clientX:t.x,clientY:top+y});const fire=(name:string,args:any)=>board.listeners[name][0]({preventDefault(){},...args});
 fire('touchstart',{target:h.thing('cloth'),changedTouches:[touch(1,t.y)]});fire('touchmove',{touches:[touch(1,g.state.arrivalLayout!.dividerY-30)]});fire('touchend',{changedTouches:[touch(2,0)]});assert(divider(h));
 h.setHit(null);fire('touchend',{changedTouches:[touch(1,g.state.arrivalLayout!.dividerY-30)]});assert(!divider(h));assert.equal(h.state().state.metrics.moves,1);
});
test('same-kitchen no-delivery chapter leaves every object in place; undo restores the right mixing state',()=>{
 const {h}=arrivalHarness();h.click(h.thing('beacon'));h.click(h.thing('cloth'));const before=h.state();assert(!divider(h));
 h.timers.filter(t=>t.ms===700).at(-1)?.fn();assert.equal(h.state().state.stage,2);assert(!divider(h));assert.deepEqual(h.state().state.tokens,before.state.tokens);assert.deepEqual(h.state().state.places,before.state.places);
 h.click(h.button('undo'));assert.equal(h.state().state.stage,1);assert(!divider(h));h.click(h.button('undo'));assert(divider(h));
});
test('old saves remain unmoved without invented division, checkpoints/reset retain exact current grammar',()=>{
 const world=arrivalFixture(),g=M.checkpoint(world,'arrival');for(const st of [...g.history,g.state])delete st.arrivalLayout;
 const h=harness(world,encodeSave({game:g,tops:{camp:0,hill:400},seen:[0,1]}));assert.deepEqual(h.state(),g);assert(!divider(h));assert(!h.doc.querySelector('.arrival-badge'));
 h.button('jump').onchange({target:{value:'arrival'}});assert(divider(h));assert(!h.thing('cloth').classes.has('born'));
 h.click(h.button('reset'));assert(!divider(h));assert(!h.thing('cloth'));assert(h.thing('lamp'));
});
test('new readable supplies preserve reading, selection, scroll and divider state',()=>{
 const world=arrivalFixture();world.items.find(t=>t.id==='cloth')!.reading={text:'The cloth is woven at home.',attribution:'Field record'};
 const g=M.checkpoint(world,'arrival'),h=harness(world,encodeSave({game:g,tops:{camp:0,hill:400},seen:[0,1]}));h.click(h.thing('cloth'));const before=h.state();
 assert(h.button('read-source'));h.click(h.button('read-source'));assert(h.button('source-reader').open);assert(divider(h));h.click(h.button('reader-close'));assert(h.thing('cloth').classes.has('selected'));assert(divider(h));assert.deepEqual(h.state(),before);
});

test('successive already-earned chapters each keep a visible acknowledgement and never recurse',()=>{
 const world=structuredClone(fixture),earned=(id:string)=>({...structuredClone(world.stages[0]),id,title:'Earned '+id,completionText:'Earned story '+id,objectives:[{id:'earned-'+id,text:'Keep the made beacon',kind:'create' as const,item:'beacon'}]});
 world.stages=[world.stages[0],earned('one'),earned('two'),world.stages[1]];
 const h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.timers.filter(t=>t.ms===700).at(-1)!.fn();
 assert.equal(h.state().state.stage,1);assert(h.button('mission').open);assert(h.button('modal-next'));assert(h.app.innerHTML.includes('Earned story one'));
 for(const t of h.timers.filter(t=>t.ms===700||t.ms===0))t.fn();assert.equal(h.state().state.stage,1);
 h.click(h.button('modal-next'));assert.equal(h.state().state.stage,2);assert(h.button('mission').open);assert(h.app.innerHTML.includes('Earned story two'));
 h.click(h.button('close'));h.click(h.button('purpose'));assert.equal(h.state().state.stage,2);assert(h.button('mission').open);
 h.click(h.button('modal-next'));assert.equal(h.state().state.stage,3);assert(h.button('mission').open);assert(h.doc.querySelector('.motivation'));assert(!h.state().state.completed);
});
test('reload and reopening an already-earned task retain its own dialog until Continue',()=>{
 const world=structuredClone(fixture);world.stages.splice(1,0,{...structuredClone(world.stages[0]),id:'earned',title:'Already earned',objectives:[{id:'earned-goal',text:'Keep the earlier beacon',kind:'create',item:'beacon'}],completionText:'The earlier beacon already supplies this task.'});
 const g=M.replay(world,[{type:'combine',a:'lamp',b:'battery'},{type:'advance'}]);
 for(const seen of [[0],[0,1]]){const h=harness(world,encodeSave({game:g,tops:{camp:0},seen}));assert.equal(h.state().state.stage,1);assert(h.button('mission').open);assert(h.button('modal-next'));assert(h.app.innerHTML.includes('The earlier beacon already supplies this task.'));h.click(h.button('close'));h.click(h.button('purpose'));assert.equal(h.state().state.stage,1);h.click(h.button('modal-next'));assert.equal(h.state().state.stage,2);}
});
test('already-earned final task requires its acknowledgement and records the ending only once',()=>{
 const world=structuredClone(fixture);world.stages=[world.stages[0],{...structuredClone(world.stages[0]),id:'earned-ending',title:'The final prepared task',objectives:[{id:'ending-goal',text:'Keep the earlier beacon',kind:'create',item:'beacon'}],completionText:'The prepared light completes the journey.'}];
 const h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.timers.filter(t=>t.ms===700).at(-1)!.fn();assert.equal(h.state().state.stage,1);assert(!h.state().state.completed);assert(h.button('modal-next'));
 h.click(h.button('modal-next'));assert(h.state().state.completed);assert(!h.button('modal-next'));const events=h.state().events.length;for(const t of h.timers.filter(t=>t.ms===700||t.ms===0))t.fn();assert.equal(h.state().events.length,events);h.click(h.button('close'));const loaded=harness(world,h.saved.get(h.key));assert(loaded.state().state.completed);assert.equal(loaded.state().events.length,events);assert(!loaded.button('mission').open);
});
test('actual Kitchen future-first orchard task skips directly to unfinished soup on ready reload',()=>{
 const world=campaignScenarios.find(s=>s.id==='kitchen-caravan-v6')!,actions=JSON.parse(readFileSync(new URL('../evidence/integration-20261028/sources/food-v6-ten-kitchens/routes/early-kitchen-reverse.json',import.meta.url),'utf8'));
 const orchard=world.stages.findIndex(st=>st.id==='orchard');let g=M.createGame(world);for(const a of actions){if(a.type==='advance'&&g.state.stage===orchard-1)break;g=M.applyAction(world,g,a).game;}assert.equal(g.state.stage,orchard-1);assert(M.stageComplete(world,g.state));
 const h=harness(world,encodeSave({game:g,tops:Object.fromEntries(g.state.areas.map((a,i)=>[a.id,i*600])),seen:[g.state.stage]}));
 assert.equal(world.stages[h.state().state.stage].id,'soup');assert(h.button('mission').open);assert(!h.button('modal-next'));assert(h.app.innerHTML.includes(world.stages[orchard+1].motivation));assert(!h.app.innerHTML.includes('Chapter complete'));assert.deepEqual(h.state().state.skippedChapters,['orchard']);
 const count=h.state().events.length;for(const t of h.timers)t.fn();assert.equal(h.state().events.length,count);
});

// Milestone flow is tested with the existing synthetic DOM adapter, never a native browser.
function milestoneWorld(partial=false){
 const world=structuredClone(fixture);world.milestones=[{id:'beacon-made',item:'beacon',when:'created',title:'The valley can see us',text:'One light reaches beyond our camp.'}];
 if(partial){world.stages[0].locations=['ridge'];world.stages[1].locations=[];world.stages[0].objectives.push({id:'first-place',kind:'place',item:'beacon',location:'ridge',text:'Place beacon'});}
 return world;
}
function makeMilestone(h:ReturnType<typeof harness>){h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));}
function finishCreationCue(h:ReturnType<typeof harness>){h.timers.filter(t=>t.ms===700).at(-1)!.fn();}
test('milestone: tangible creation appears first, then full-screen reward before next chapter',()=>{
 const h=harness(milestoneWorld());makeMilestone(h);assert(h.thing('beacon'));assert(!h.button('milestone'));assert.equal(h.state().state.stage,0);
 finishCreationCue(h);assert(h.button('milestone').open);assert(!h.button('mission').open);assert.equal(h.doc.activeElement.id,'milestone-continue');assert.equal(h.button('milestone').attrs['aria-labelledby'],'milestone-title');assert.equal(h.button('milestone').attrs['aria-describedby'],'milestone-text');
 h.click(h.button('milestone-continue'));assert(!h.button('milestone'));assert.equal(h.doc.activeElement.dataset.target,'beacon');assert.deepEqual(h.state().milestonesSeen,['beacon-made']);h.flush();assert.equal(h.state().state.stage,1);assert(h.button('mission').open);assert(h.app.innerHTML.includes(fixture.stages[1].motivation));assert(h.thing('beacon'));
});
test('milestone: pending survives compact reload, acknowledgement prevents repeat on reload',()=>{
 const world=milestoneWorld(true),h=harness(world);makeMilestone(h);const before=h.state();const reloaded=harness(world,encodeSave(decodeSave(h.saved.get(h.key)!)));assert(reloaded.button('milestone').open);assert.deepEqual(reloaded.state(),before);
 reloaded.click(reloaded.button('milestone-continue'));reloaded.flush();assert.equal(reloaded.state().state.stage,0);const acknowledged=harness(world,reloaded.saved.get(reloaded.key));assert(!acknowledged.button('milestone'));assert(!acknowledged.button('mission').open);assert(acknowledged.thing('beacon'));
});
test('milestone: intentional reading preserves selection and scroll, then reward resumes before chapter',()=>{
 const world=milestoneWorld();world.items.find(i=>i.id==='beacon')!.reading={text:'A source to read.',attribution:'A fictional source.'};const h=harness(world);makeMilestone(h);h.click(h.thing('beacon'));h.doc.querySelector('.viewport').scrollTop=73;h.click(h.button('read-source'));finishCreationCue(h);assert(h.button('source-reader').open);assert(!h.button('milestone'));
 h.click(h.button('reader-close'));assert.equal(h.doc.querySelector('.viewport').scrollTop,73);assert(h.thing('beacon').classes.has('selected'));h.flush();assert(h.button('milestone').open);assert.equal(h.state().state.stage,0);h.click(h.button('milestone-continue'));h.flush();assert.equal(h.state().state.stage,1);assert(h.button('mission').open);
});
test('milestone: debug pauses reward; Undo cancels the unearned reward without a stale timer',()=>{
 const h=harness(milestoneWorld());makeMilestone(h);h.click(h.button('debug-toggle'));finishCreationCue(h);assert(h.button('debug-dialog').open);assert(!h.button('milestone'));h.click(h.button('undo'));h.click(h.button('debug-close'));h.flush();finishCreationCue(h);assert(!h.button('milestone'));assert(!h.thing('beacon'));assert.equal(h.state().state.stage,0);
 h.click(h.thing('lamp'));h.click(h.thing('battery'));finishCreationCue(h);assert(h.button('milestone').open);
});
test('milestone: current challenge interruption retains its handoff instead of stranding the reward',()=>{
 const h=harness(milestoneWorld(true));makeMilestone(h);h.click(h.button('purpose'));finishCreationCue(h);assert(h.button('mission').open);assert(!h.button('milestone'));h.click(h.button('close'));h.flush();assert(h.button('milestone').open);h.click(h.button('milestone-continue'));h.flush();assert.equal(h.state().state.stage,0);assert(h.thing('beacon'));
});
test('milestone: a rejected or unrelated action during the creation cue cannot lose the reward',()=>{
 for(const rejected of [true,false]){const h=harness(milestoneWorld(true));makeMilestone(h);if(rejected){h.click(h.thing('lamp'));h.click(h.thing('battery'));}else{const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:220,clientY:300,pointerId:1});board.onpointerup({clientX:220,clientY:300,pointerId:1});}finishCreationCue(h);assert(h.button('milestone').open);assert.equal(h.state().state.milestones!.length,1);}
});
test('milestone: active drag delays reward, cancellation resumes without committing',()=>{
 const h=harness(milestoneWorld(true));makeMilestone(h);const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});board.onpointermove({clientX:200,clientY:250,pointerId:1});finishCreationCue(h);assert(!h.button('milestone'));board.onpointercancel({pointerId:1});h.flush();assert(h.button('milestone').open);assert.equal(h.state().state.metrics.moves,0);
});
test('milestone: Escape is an accessible Continue, resize does not duplicate acknowledgement',()=>{
 const h=harness(milestoneWorld(true));makeMilestone(h);finishCreationCue(h);h.windowEvents.resize();assert(h.button('milestone').open);let prevented=false;h.button('milestone').oncancel({preventDefault(){prevented=true;}});assert(prevented);h.flush();assert(!h.button('milestone'));assert.deepEqual(h.state().milestonesSeen,['beacon-made']);h.windowEvents.resize();assert(!h.button('milestone'));
});
test('milestone: undo and redo after acknowledgement do not celebrate twice; reset starts a new run',()=>{
 const h=harness(milestoneWorld(true));makeMilestone(h);finishCreationCue(h);h.click(h.button('milestone-continue'));h.flush();h.click(h.button('debug-toggle'));h.click(h.button('undo'));h.click(h.button('debug-close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));assert(!h.button('milestone'));assert.equal(M.pendingMilestone(milestoneWorld(true),h.state()),null);
 h.click(h.button('reset'));makeMilestone(h);finishCreationCue(h);assert(h.button('milestone').open);assert.equal(h.state().milestonesSeen,undefined);
});
test('milestone: checkpoint replacement clears pending reward and marks replayed inventions as historical',()=>{
 const world=milestoneWorld();world.checkpoints=[{id:'hill',label:'Hill',actions:[{type:'combine',a:'lamp',b:'battery'},{type:'advance'}]}];const h=harness(world);makeMilestone(h);h.click(h.button('debug-toggle'));finishCreationCue(h);h.button('jump').onchange({target:{value:'hill'}});finishCreationCue(h);h.flush();assert(!h.button('milestone'));assert(h.button('mission').open);assert.equal(h.state().state.stage,1);assert.deepEqual(h.state().milestonesSeen,['beacon-made']);assert.match(h.app.innerHTML,/DEBUG · Hill/);
});
test('milestone: simultaneous rewards queue in authored order, with the chapter after the last Continue',()=>{
 const world=milestoneWorld();world.milestones!.push({...world.milestones![0],id:'another-pivotal-meaning',title:'Another meaning'});const h=harness(world);makeMilestone(h);finishCreationCue(h);assert(h.app.innerHTML.includes('The valley can see us'));h.click(h.button('milestone-continue'));h.flush();assert(h.button('milestone').open);assert(h.app.innerHTML.includes('Another meaning'));assert.equal(h.state().state.stage,0);h.click(h.button('milestone-continue'));h.flush();assert(!h.button('milestone'));assert.equal(h.state().state.stage,1);assert(h.button('mission').open);
});
test('milestone: cancelled pointer and rejected combination never invent an achievement',()=>{
 const h=harness(milestoneWorld());h.click(h.button('close'));const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});h.setHit(h.thing('battery'));board.onpointermove({clientX:152,clientY:56,pointerId:1});board.onpointercancel({pointerId:1});assert.equal(h.state().state.milestones,undefined);assert(!h.button('milestone'));assert(!h.thing('beacon'));
});
test('milestone: reward styles occupy viewport, allow overflow, respect reduced motion and never lock Continue behind animation',()=>{
 const css=readFileSync(new URL('./campaign.css',import.meta.url),'utf8');assert.match(css,/#milestone\{[^}]*inset:0[^}]*height:100dvh[^}]*overflow:auto/s);assert.match(css,/@media\(prefers-reduced-motion:reduce\)\{\.milestone-object,\.milestone-component\{animation:none\}/);const h=harness(milestoneWorld(true));makeMilestone(h);finishCreationCue(h);assert(!('disabled' in h.button('milestone-continue').attrs));
});
test('milestone: review regression, held stationary pointer resumes deferred reward on release',()=>{
 const h=harness(milestoneWorld());makeMilestone(h);const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:7,preventDefault(){}});finishCreationCue(h);assert(!h.button('milestone'));board.onpointerup({clientX:52,clientY:56,pointerId:7});h.flush();assert(h.button('milestone').open);h.click(h.button('milestone-continue'));h.flush();assert.equal(h.state().state.stage,1);assert(h.button('mission').open);
});
test('milestone: review regression, Undo of a later move preserves the earned pending reward',()=>{
 const h=harness(milestoneWorld());makeMilestone(h);const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:7,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:200,clientY:280,pointerId:7});board.onpointerup({clientX:200,clientY:280,pointerId:7});h.click(h.button('debug-toggle'));finishCreationCue(h);h.click(h.button('undo'));assert(M.pendingMilestone(milestoneWorld(),h.state()));h.click(h.button('debug-close'));h.flush();assert(h.button('milestone').open);h.click(h.button('milestone-continue'));h.flush();assert.equal(h.state().state.stage,1);assert(h.button('mission').open);
});
test('milestone: stale Continue or cancel cannot acknowledge the next queued reward',()=>{
 const world=milestoneWorld();world.milestones!.push({...world.milestones![0],id:'second',title:'Second'});const h=harness(world);makeMilestone(h);finishCreationCue(h);const oldButton=h.button('milestone-continue'),oldDialog=h.button('milestone');h.click(oldButton);h.flush();assert(h.button('milestone').open);h.click(oldButton);oldDialog.oncancel({preventDefault(){}});assert(h.button('milestone').open);assert.deepEqual(h.state().milestonesSeen,['beacon-made']);assert.equal(h.state().state.stage,0);
});

test('milestone: actual UI decorates active Mars and housecraft before restore and event creation',()=>{
 for(const [id,item]of [['mars-connected-survival-v4-return-cargo-research','rover'],['elements-house-and-craft-v1','plant']]){
  const world=campaignScenarios.find(s=>s.id===id)!;assert(world);assert.equal(world.milestones,undefined);const runtime=applyMilestones(world),reward=runtime.milestones!.find(m=>m.item===item)!;
  const route=JSON.parse(readFileSync(new URL('../evidence/'+id+'-route-evidence.json',import.meta.url),'utf8')).actionsLog;
  let g=M.createGame(runtime);for(const a of route){const next=M.applyAction(runtime,g,a).game;if(next.state.milestones?.some(m=>m.id===reward.id)&&!g.state.milestones?.some(m=>m.id===reward.id)){
    const h=harness(world,encodeSave({game:g,tops:{},seen:[g.state.stage]}));if(h.button('mission').open)h.click(h.button('close'));h.click(h.thing(a.a));h.click(h.thing(a.b));finishCreationCue(h);assert(h.button('milestone').open);assert(h.app.innerHTML.includes(reward.title));assert(h.thing(item));break;
   }g=next;
  }
 }
});
test('milestone: Continue cannot consume the acknowledgement of an already-earned next chapter',()=>{
 const world=milestoneWorld();world.stages.splice(1,0,{...structuredClone(world.stages[0]),id:'ready-after-reward',title:'The prepared chapter',completionText:'This chapter remembers the earlier invention.',objectives:[{id:'reward-next-goal',text:'Keep the beacon',kind:'create',item:'beacon'}]});
 const h=harness(world);makeMilestone(h);finishCreationCue(h);const rewardButton=h.button('milestone-continue');h.click(rewardButton);h.flush();assert.equal(h.state().state.stage,1);assert(h.button('mission').open);assert(h.button('modal-next'));assert(h.app.innerHTML.includes('This chapter remembers the earlier invention.'));
 for(const timer of h.timers.filter(t=>t.ms===700||t.ms===0))timer.fn();h.click(rewardButton);assert.equal(h.state().state.stage,1);
 h.click(h.button('close'));h.click(h.button('purpose'));assert.equal(h.state().state.stage,1);assert(h.button('mission').open);h.click(h.button('modal-next'));assert.equal(h.state().state.stage,2);assert(h.doc.querySelector('.motivation'));
});
test('milestone: pending reward reload then ready-chapter reload preserves both separate acknowledgements',()=>{
 const world=milestoneWorld();world.stages.splice(1,0,{...structuredClone(world.stages[0]),id:'ready-after-reward',title:'Prepared task',objectives:[{id:'prepared-goal',text:'Keep the beacon',kind:'create',item:'beacon'}]});
 const h=harness(world);makeMilestone(h);const pending=harness(world,h.saved.get(h.key));assert(pending.button('milestone').open);assert.equal(pending.state().state.stage,0);pending.click(pending.button('milestone-continue'));pending.flush();assert.equal(pending.state().state.stage,1);assert(pending.button('mission').open);
 pending.click(pending.button('close'));const ready=harness(world,pending.saved.get(pending.key));assert.equal(ready.state().state.stage,1);assert(!ready.button('milestone'));assert(ready.button('mission').open);ready.click(ready.button('purpose'));assert.equal(ready.state().state.stage,1);ready.click(ready.button('modal-next'));assert.equal(ready.state().state.stage,2);
});
test('milestone: static handoff review keeps objective clicks read-only and removes recursive chapter skipping',()=>{
 const code=readFileSync(new URL('./campaign-main.ts',import.meta.url),'utf8');const open=code.slice(code.indexOf('function openMission()'),code.indexOf('function closeModal('));assert(!open.includes('commit('));assert(!open.includes("type:'advance'"));assert(!code.includes("if(a.type==='advance'&&M.playerView(s,game).canAdvance)"));assert(code.includes('if(M.playerView(s,game).canAdvance)modal=true;render();'));
});

function reactiveWorld(withMilestone=false){
 const world=structuredClone(fixture);for(const st of world.stages)st.onAlreadyComplete={mode:'skip'};
 const earned=(id:string,policy:NonNullable<Scenario['stages'][number]['onAlreadyComplete']>)=>({...structuredClone(world.stages[0]),id,title:'Never show '+id,motivation:'Obsolete task '+id,onAlreadyComplete:policy,objectives:[{id:id+'-goal',text:'Keep the beacon '+id,kind:'create' as const,item:'beacon'}]});
 world.stages.splice(1,0,earned('answered',{mode:'bridge',text:'The crew have answered.'}),earned('mechanics',{mode:'skip'}),earned('arrived',{mode:'bridge',text:'Our friends have arrived.'}));
 if(withMilestone)world.milestones=[{id:'beacon-made',item:'beacon',when:'created',title:'A light',text:'We can be seen.'},{id:'signal-made',item:'beacon',when:'created',title:'A signal',text:'A second independently queued test reward.'}];
 return world;
}
test('reactive controller cascades skips, prefixes ordered bridges once, and preserves reload/undo/reset',()=>{
 const world=reactiveWorld(),h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));assert.equal(h.state().state.stage,0);finishCreationCue(h);
 assert.equal(h.state().state.stage,4);assert(h.button('mission').open);assert(!h.button('modal-next'));assert(!h.app.innerHTML.includes('Never show'));assert(!h.app.innerHTML.includes('Keep the beacon'));
 assert(h.app.innerHTML.indexOf('The crew have answered.')<h.app.innerHTML.indexOf('Our friends have arrived.'));assert(h.app.innerHTML.indexOf('Our friends have arrived.')<h.app.innerHTML.indexOf(world.stages[4].motivation));
 const pending=harness(world,h.saved.get(h.key));assert(pending.button('mission').open);assert(pending.app.innerHTML.includes('The crew have answered.'));pending.click(pending.button('close'));const closed=pending.button('close');pending.click(closed);
 assert.equal(M.pendingChapterBridges(world,pending.state()).length,0);pending.click(pending.button('purpose'));assert(!pending.app.innerHTML.includes('The crew have answered.'));pending.click(pending.button('close'));
 const resumed=harness(world,pending.saved.get(pending.key));assert(!resumed.button('mission').open);assert.equal(M.pendingChapterBridges(world,resumed.state()).length,0);
 resumed.click(resumed.button('undo'));assert.equal(resumed.state().state.stage,0);resumed.click(resumed.button('purpose'));resumed.click(resumed.button('modal-next'));assert.equal(resumed.state().state.stage,4);assert(!resumed.app.innerHTML.includes('The crew have answered.'));
 resumed.click(resumed.button('reset'));assert.equal(resumed.state().state.stage,0);assert.deepEqual(resumed.state().bridgesSeen,undefined);
});
test('reactive partial chapter shows two fulfilled goals and its one real remaining placement',()=>{
 const world=structuredClone(fixture);for(const st of world.stages)st.onAlreadyComplete={mode:'skip'};world.stages[1].objectives.unshift({id:'have-beacon',kind:'create',item:'beacon',text:'Make beacon'},{id:'have-lamp',kind:'create',item:'lamp',text:'Have lamp'});
 const h=harness(world);makeMilestone(h);finishCreationCue(h);assert.equal(h.state().state.stage,1);assert(h.button('mission').open);assert.deepEqual(M.playerView(world,h.state()).objectives.map(g=>g.satisfied),[true,true,false]);assert(!h.button('modal-next'));assert(h.app.innerHTML.includes('✓ Make beacon'));assert(h.app.innerHTML.includes('✓ Have lamp'));
});
test('reactive ready save resumes its normal handoff; normal completion is not reported as a skipped chapter',()=>{
 const world=reactiveWorld(),g=M.applyAction(world,M.createGame(world),{type:'combine',a:'lamp',b:'battery'}).game;
 assert.equal(g.state.chapterEntry!.alreadyComplete,false);const h=harness(world,encodeSave({game:g,tops:{camp:0},seen:[0]}));assert.equal(h.state().state.stage,4);assert(!h.state().state.skippedChapters?.includes('build'));assert(h.button('mission').open);assert(!h.app.innerHTML.includes('Chapter complete'));
});
test('reactive pending milestones finish in queue order before the cascade and next narrative',()=>{
 const world=reactiveWorld(true),h=harness(world);makeMilestone(h);finishCreationCue(h);assert.equal(h.state().state.stage,0);assert(h.button('milestone').open);const stale=h.button('milestone-continue');
 h.click(stale);h.flush();assert.equal(M.pendingMilestone(world,h.state())!.id,'signal-made');assert(h.button('milestone').open);h.click(stale);assert.equal(M.pendingMilestone(world,h.state())!.id,'signal-made');
 h.click(h.button('milestone-continue'));h.flush();assert.equal(h.state().state.stage,4);assert(!h.button('milestone'));assert(h.button('mission').open);assert(h.app.innerHTML.includes('The crew have answered.'));assert.equal(M.pendingMilestone(world,h.state()),null);
});
test('headless-cascaded save with pending rewards returns to the unseen next narrative after rewards, not a blank board',()=>{
 const world=reactiveWorld(true);let g=M.applyAction(world,M.createGame(world),{type:'combine',a:'lamp',b:'battery'}).game;g=M.applyAction(world,g,{type:'advance'}).game;
 const h=harness(world,encodeSave({game:g,tops:{camp:0,hill:400},seen:[0]}));assert(h.button('milestone').open);h.click(h.button('milestone-continue'));h.flush();h.click(h.button('milestone-continue'));h.flush();assert(h.button('mission').open);assert(h.app.innerHTML.includes('The crew have answered.'));assert.equal(h.state().state.stage,4);
});
test('all remaining reactive entries complete: show ending bridges once, no skipped objectives or invented combinations',()=>{
 const world=reactiveWorld();world.stages.pop();world.stages.at(-1)!.completionText='Our preparations are complete.';
 const h=harness(world);makeMilestone(h);finishCreationCue(h);assert(h.state().state.completed);assert.equal(h.state().state.metrics.combinations,1);assert(h.button('mission').open);assert(!h.button('modal-next'));assert(!h.app.innerHTML.includes('Keep the beacon'));assert(h.app.innerHTML.includes('Your earlier work has already brought this journey to its end.'));assert(h.app.innerHTML.includes('Our friends have arrived.'));
 const count=h.state().events.length;h.click(h.button('close'));const loaded=harness(world,h.saved.get(h.key));assert(!loaded.button('mission').open);loaded.click(loaded.button('purpose'));assert(!loaded.app.innerHTML.includes('Our friends have arrived.'));assert.equal(loaded.state().events.length,count);
});
test('reactive debug checkpoint bridges are historical and no stale mission button can act on the next chapter',()=>{
 const world=reactiveWorld();world.checkpoints=[{id:'hill',label:'Prepared hill',actions:[{type:'combine',a:'lamp',b:'battery'},{type:'advance'}]}];const h=harness(world);const staleClose=h.button('close');h.button('jump').onchange({target:{value:'hill'}});assert.equal(h.state().state.stage,4);assert(h.button('mission').open);assert(!h.app.innerHTML.includes('The crew have answered.'));assert.equal(M.pendingChapterBridges(world,h.state()).length,0);h.click(staleClose);assert(h.button('mission').open);
});

// Regression coverage for the two screenshot reports. These are synthetic
// controller events; they do not assert native Safari layout/touch behavior.
function placementInspectionWorld(){const s=structuredClone(fixture);s.initialItems=['beacon','lamp'];s.stages=[s.stages[1]];return s;}
function pointer(h:ReturnType<typeof harness>,id:string,pointerId=41){const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing(id),button:0,pointerType:'touch',clientX:80,clientY:120,pointerId,preventDefault(){}});return board;}
function possible(h:ReturnType<typeof harness>,id:string){return h.thing(id).classes.has('possible');}

test('location press: held touch shows goal destination before movement, keeps hints during drag and distinguishes imminent placement',()=>{
 const h=harness(placementInspectionWorld(),undefined,{modernPointer:true});h.click(h.button('close'));const before=h.state(),board=pointer(h,'beacon');
 assert(possible(h,'beacon'));assert(possible(h,'@ridge'));assert(h.thing('beacon').classes.has('pressed'));assert.deepEqual(h.state(),before);
 h.setHit(null);board.onpointermove({clientX:190,clientY:200,pointerId:41});assert(possible(h,'@ridge'));assert(!h.thing('@ridge').classes.has('will-place'));
 h.setHit(h.thing('@ridge'));board.onpointermove({clientX:80,clientY:300,pointerId:41});assert(possible(h,'@ridge'));assert(h.thing('@ridge').classes.has('will-place'));assert(!h.thing('@ridge').classes.has('will-create'));
 board.onpointerup({clientX:80,clientY:300,pointerId:41});assert(h.thing('@ridge').classes.has('goal-met'));assert.equal(h.state().state.metrics.combinations,0);assert.equal(h.state().state.metrics.creations,0);
 assert(!h.thing('beacon').classes.has('pressed'));assert(!h.thing('@ridge').classes.has('will-place'));
 pointer(h,'beacon',42);assert(!possible(h,'@ridge'));h.doc.querySelector('.board').onpointercancel({pointerId:42});h.click(h.button('undo'));
 pointer(h,'beacon',43);assert(possible(h,'@ridge'));h.click(h.button('reset'));assert(!h.thing('beacon').classes.has('pressed'));assert(!possible(h,'@ridge'));h.click(h.button('close'));pointer(h,'beacon',44);assert(possible(h,'@ridge'));
});

test('location press: pointer, hover, focus and click inspect reciprocal partners without moving a location',()=>{
 const h=harness(placementInspectionWorld(),undefined,{modernPointer:true});h.click(h.button('close'));const before=h.state();
 h.thing('@ridge').onmouseenter();assert(possible(h,'beacon'));h.thing('@ridge').onmouseleave();assert(!possible(h,'beacon'));
 h.thing('@ridge').onfocus();assert(possible(h,'beacon'));h.thing('@ridge').onblur();assert(!possible(h,'beacon'));
 let prevented=false;const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('@ridge'),button:0,pointerType:'touch',clientX:80,clientY:120,pointerId:51,preventDefault(){prevented=true;}});
 assert.equal(prevented,false,'location keeps native pan-y available');assert(possible(h,'beacon'));assert(h.thing('@ridge').classes.has('pressed'));
 board.onpointercancel({pointerId:52});assert(h.thing('@ridge').classes.has('pressed'),'second finger does not own press');
 board.onpointerup({clientX:80,clientY:120,pointerId:51});assert(possible(h,'beacon'));assert(h.thing('@ridge').classes.has('selected'));assert(!h.thing('@ridge').classes.has('pressed'));assert.deepEqual(h.state(),before);
 h.flush();h.click(h.thing('beacon'));assert(possible(h,'@ridge'));assert(h.thing('beacon').classes.has('selected'));assert(!h.thing('@ridge').classes.has('selected'));
});

test('location press: scroll intent, capture loss, cancel, blur, resize and reset clear transient state without committing',()=>{
 for(const interruption of ['scroll','lost','cancel','blur','resize','reset']){
  const h=harness(placementInspectionWorld(),undefined,{modernPointer:true});h.click(h.button('close'));const before=h.state(),board=pointer(h,'@ridge',61),old=h.thing('@ridge');
  if(interruption==='scroll'){board.onpointermove({clientX:80,clientY:200,pointerId:61});assert(!possible(h,'beacon'));assert(!old.classes.has('dragging'));assert(!h.app.classes.has('is-dragging'));board.onpointerup({clientX:80,clientY:200,pointerId:61});}
  else if(interruption==='lost')board.onlostpointercapture({pointerId:61});else if(interruption==='cancel')board.onpointercancel({pointerId:61});else if(interruption==='reset')h.click(h.button('reset'));else h.windowEvents[interruption]();
  assert(!h.thing('@ridge').classes.has('pressed'));assert(!possible(h,'beacon'));assert(!h.thing('@ridge').classes.has('selected'));
  board.onpointerup({clientX:80,clientY:200,pointerId:61});if(interruption!=='reset')assert.deepEqual(h.state(),before);else assert.equal(h.state().state.metrics.placements,0);
 }
});

test('location press: legacy Touch Events expose immediate hints, preserve location scrolling and ignore unrelated fingers',()=>{
 const h=harness(placementInspectionWorld());h.click(h.button('close'));let board:any=h.doc.querySelector('.board');const touch=(identifier:number,y=120)=>({identifier,clientX:80,clientY:y});const fire=(name:string,args:any)=>{let prevented=false;board.listeners[name][0]({preventDefault(){prevented=true;},...args});return prevented;};
 assert(fire('touchstart',{target:h.thing('beacon'),changedTouches:[touch(1)]}));assert(possible(h,'@ridge'));fire('touchcancel',{changedTouches:[touch(2)]});assert(possible(h,'@ridge'));fire('touchcancel',{changedTouches:[touch(1)]});assert(!possible(h,'@ridge'));
 board=h.doc.querySelector('.board');assert(!fire('touchstart',{target:h.thing('@ridge'),changedTouches:[touch(3)]}));assert(possible(h,'beacon'));
 assert(!fire('touchmove',{touches:[touch(3,200)]}));assert(!possible(h,'beacon'));fire('touchend',{changedTouches:[touch(3,200)]});assert.equal(h.state().state.metrics.moves,0);assert.equal(h.state().state.metrics.placements,0);
 board=h.doc.querySelector('.board');fire('touchstart',{target:h.thing('@ridge'),changedTouches:[touch(4)]});fire('touchend',{changedTouches:[touch(4)]});assert(possible(h,'beacon'));assert(h.thing('@ridge').classes.has('selected'));
});

test('location press: recipe operand/catalyst reciprocity has no output previews and consumed discoveries disappear',()=>{
 for(const catalyst of [false,true]){
  const s=structuredClone(fixture);s.stages[0].locations=['ridge'];s.stages[1].locations=[];if(catalyst)s.recipes[0].at='ridge';else s.recipes[0].b='@ridge';
  const h=harness(s);h.click(h.button('close'));const board=pointer(h,'@ridge');assert(possible(h,'lamp'));assert.equal(possible(h,'battery'),catalyst);assert(!h.thing('beacon'));board.onpointercancel({pointerId:41});
  if(catalyst){h.click(h.thing('lamp'));h.click(h.thing('@ridge'));h.click(h.thing('battery'));h.click(h.thing('lamp'));}else{h.click(h.thing('lamp'));h.click(h.thing('@ridge'));}
  assert(h.thing('beacon'));pointer(h,'@ridge');assert(!possible(h,'lamp'));assert(!possible(h,'battery'));assert.equal(h.state().state.metrics.combinations,1);
 }
});

test('location birth: controller gives inside-location creation cue, source returns unchanged, output stays portable and repeat cannot create twice',()=>{
 const s=structuredClone(fixture);s.stages[0].locations=['ridge'];s.stages[1].locations=[];s.recipes[0].b='@ridge';const h=harness(s);h.click(h.button('close'));const source=structuredClone(M.token(h.state().state,'lamp')),p=structuredClone(h.state().state.places[0]);
 let board=pointer(h,'lamp');h.setHit(h.thing('@ridge'));board.onpointermove({clientX:p.x,clientY:p.y,pointerId:41});assert(h.thing('@ridge').classes.has('will-create'));assert(!h.thing('@ridge').classes.has('will-place'));board.onpointerup({clientX:p.x,clientY:p.y,pointerId:41});
 const out=M.token(h.state().state,'beacon')!;assert.deepEqual(M.token(h.state().state,'lamp'),source);assert.equal(out.x,p.x);assert.equal(out.y,p.y+16);assert.equal(out.location,null);assert(h.thing('beacon').classes.has('born'));assert.match(h.thing('beacon').attrs.style,/--birth-y:-16px/);
 h.flush();board=pointer(h,'beacon',42);h.setHit(null);board.onpointermove({clientX:220,clientY:420,pointerId:42});board.onpointerup({clientX:220,clientY:420,pointerId:42});assert.equal(M.token(h.state().state,'beacon')!.y,420);assert.equal(M.token(h.state().state,'beacon')!.location,null);
 h.flush();h.click(h.thing('lamp'));h.click(h.thing('@ridge'));assert.equal(h.state().state.metrics.combinations,1);assert.equal(h.state().state.tokens.filter(t=>t.id==='beacon').length,1);assert(!h.thing('beacon').classes.has('born'));
});

test('location press: actual screenshot chapter responds to Solar radio touch and Refuge signal mast touch before any movement',()=>{
 const s=campaignScenarios.find(s=>s.id===featuredScenarioIds[0])!,actions=s.checkpoints!.find(c=>c.id==='complete')!.actions,index=actions.findIndex(a=>a.type==='place'&&a.item==='solar-radio'&&a.location==='refuge-contact-mast');assert(index>=0);const g=M.replay(s,actions.slice(0,index));const h=harness(s,encodeSave({game:g,tops:{},seen:[g.state.stage]}),{modernPointer:true});
 assert(h.app.innerHTML.includes('Somewhere to come back to'));const before=h.state();let board=pointer(h,'solar-radio');assert(possible(h,'@refuge-contact-mast'));board.onpointercancel({pointerId:41});assert(!possible(h,'@refuge-contact-mast'));
 board=pointer(h,'@refuge-contact-mast',42);assert(possible(h,'solar-radio'));board.onpointercancel({pointerId:42});assert.deepEqual(h.state(),before);
});

// Extents below are measured from the actual rendered controller plus model
// token sizes, not a copied ensureTops implementation or a native-layout claim.
function assertSeparatedAreaTops(h:ReturnType<typeof harness>,s:Scenario){
 const g=h.state(),tops=decodeSave(h.saved.get(h.key)!).tops;
 const ordered=[...g.state.areas].sort((a,b)=>tops[a.id]-tops[b.id]);
 const bottom=(id:string)=>Math.max(80,...g.state.tokens.filter(t=>t.area===id).map(t=>t.y+M.tokenHeight(s,t)/2+12),...g.state.places.filter(p=>p.area===id).map(p=>p.y+50));
 for(let i=1;i<ordered.length;i++)assert(tops[ordered[i].id]>=tops[ordered[i-1].id]+bottom(ordered[i-1].id)+55,`${ordered[i-1].id} overlaps ${ordered[i].id}`);
 const domTop=(e:any)=>Number(/(?:^|;)top:([\d.]+)px/.exec(e.attrs.style)![1]);
 for(const t of g.state.tokens)assert.equal(domTop(h.thing(t.id)),tops[t.area]+t.y);
 for(const p of g.state.places)assert.equal(domTop(h.thing('@'+p.id)),tops[p.area]+p.y);
 const active=M.arrivalDivisions(g.state).find(d=>d.active&&d.stage===g.state.stage);
 if(active){assert.equal(domTop(divider(h)),tops[active.area]+active.dividerY);for(const a of ordered.filter(a=>a.id!==active.area)){
  const first=tops[a.id],last=first+bottom(a.id),activeTop=tops[active.area],activeBottom=activeTop+bottom(active.area);
  assert(last<activeTop||first>activeBottom,`${a.id} intrudes into the active arrival area`);
 }}
 return tops;
}
function controllerRoute(h:ReturnType<typeof harness>,actions:NonNullable<Scenario['checkpoints']>[number]['actions']){
 if(h.button('mission')?.open)h.click(h.button('close'));
 for(const a of actions){
  if(a.type==='combine'){h.click(h.thing(a.a));h.click(h.thing(a.b));}
  else if(a.type==='place'){h.click(h.thing(a.item));h.click(h.thing('@'+a.location));}
  else if(a.type==='advance'){
   const before=h.state().state.stage;h.timers.filter(t=>t.ms===700).at(-1)?.fn();
   for(let n=0;n<10&&h.button('milestone')?.open;n++){h.click(h.button('milestone-continue'));h.flush();}
   assert(h.state().state.stage>before||h.state().state.completed,'controller must advance after its cue/reward');
   if(h.button('mission')?.open)h.click(h.button('close'));
  }else assert.fail('Unexpected canonical controller action '+a.type);
  assert(h.state().events.at(-1)?.accepted,'controller route action rejected: '+JSON.stringify(a));
 }
}
test('area growth: actual Mars chapter10 fresh controller, reload and Undo stay separated at 320/375/600',()=>{
 const raw=campaignScenarios.find(s=>s.id===featuredScenarioIds[0])!,s=applyMilestones(raw),actions=s.checkpoints!.find(c=>c.id==='chapter-10')!.actions;
 for(const width of [320,375,600]){
  const h=harness(raw,undefined,{width});controllerRoute(h,actions);assert.equal(s.stages[h.state().state.stage].id,'night');
  assertSeparatedAreaTops(h,s);const final=h.state(),expected=M.replay(s,actions,width);
  assert.deepEqual(final.state.tokens,expected.state.tokens);assert.deepEqual(final.state.places,expected.state.places);assert.deepEqual(final.state.arrivalLayout,expected.state.arrivalLayout);
  const tops=decodeSave(h.saved.get(h.key)!).tops,loaded=harness(raw,encodeSave(decodeSave(h.saved.get(h.key)!)),{width});
  assert.deepEqual(loaded.state(),final);assert.deepEqual(assertSeparatedAreaTops(loaded,s),tops);
  const undone=M.undo(final).game;loaded.click(loaded.button('undo'));assert.deepEqual(loaded.state(),undone);assert.deepEqual(assertSeparatedAreaTops(loaded,s),tops);
  loaded.click(loaded.button('purpose'));loaded.click(loaded.button('modal-next'));assert.equal(s.stages[loaded.state().state.stage].id,'night');
  assert.deepEqual(assertSeparatedAreaTops(loaded,s),tops,'returning to the same extent must not push twice');
 }
});
test('area growth: old saved Mars tops repair only presentation, preserving tokens, history and active divider',()=>{
 const raw=campaignScenarios.find(s=>s.id===featuredScenarioIds[0])!,s=applyMilestones(raw);
 // Actual old LIVE86 chapter10 envelope values from the read-only reproduction.
 const stale={'area-signal':0,'area-habitat':345,'area-rover':882,'area-outcrop':1265,'area-weather':1820,'area-relay':2257,'area-rescue':2554,'area-camp':3051,'area-cargo-return':3339.5};
 for(const width of [320,375,600]){
  const g=M.checkpoint(s,'chapter-10',width),h=harness(raw,encodeSave({game:g,tops:stale,seen:[g.state.stage]}),{width});
  assert.deepEqual(h.state(),g);const tops=assertSeparatedAreaTops(h,s);assert(tops['area-cargo-return']>stale['area-cargo-return']);
  for(const [id,top]of Object.entries(stale))assert(tops[id]>=top);
  const before=h.state();h.click(h.button('purpose'));h.click(h.button('close'));h.windowEvents.resize();assert.deepEqual(h.state(),before);assert.deepEqual(assertSeparatedAreaTops(h,s),tops);
 }
});
test('area growth: downstream scroll anchor shifts once after new DOM, gaps/order remain stable without growth',()=>{
 const world=structuredClone(fixture);world.items.push(...Array.from({length:12},(_,i)=>({id:'supply-'+i,label:'Supply '+i})));
 world.stages.push({...structuredClone(world.stages[0]),id:'revisit',title:'Return to camp',caches:[{id:'new-camp',label:'New supplies',narrative:'Supplies await.',items:world.items.slice(3).map(t=>t.id)}],objectives:[{id:'later',kind:'place',item:'beacon',location:'ridge',text:'Keep the beacon on the ridge.'}]});
 const h=harness(world);controllerRoute(h,[{type:'combine',a:'lamp',b:'battery'},{type:'advance'}]);h.click(h.thing('beacon'));h.click(h.thing('@ridge'));
 const old=decodeSave(h.saved.get(h.key)!).tops,viewport:any=h.doc.querySelector('.viewport');viewport.scrollTop=old.hill+37;
 h.timers.filter(t=>t.ms===700).at(-1)!.fn();const next=decodeSave(h.saved.get(h.key)!).tops;assert(next.hill>old.hill);assert.equal(h.doc.querySelector('.viewport').scrollTop,next.hill+37);
 assertSeparatedAreaTops(h,world);h.click(h.button('purpose'));assert.equal(h.doc.querySelector('.viewport').scrollTop,next.hill+37);assert.deepEqual(decodeSave(h.saved.get(h.key)!).tops,next);
 h.click(h.button('undo'));assert.equal(h.doc.querySelector('.viewport').scrollTop,next.hill+37);assert.deepEqual(assertSeparatedAreaTops(h,world),next);
});

// Conditional names are projection-only: the same physical DOM tile is dragged,
// and names agree with its accessible label before/after creation and Undo.
test('conditional item labels agree on tile text, accessibility, dragging, reload and Undo',()=>{
 const world=structuredClone(fixture);Object.assign(world.items[0],{label:'Cabin · crew aboard',labelAfterCreated:{item:'beacon',label:'Cabin'}});
 const h=harness(world);h.click(h.button('close'));
 assert.equal(h.thing('lamp').attrs['aria-label'],'Cabin · crew aboard');assert.match(h.app.innerHTML,/crew aboard/);
 const board:any=h.doc.querySelector('.board'),tile=h.thing('lamp');
 board.onpointerdown({target:tile,button:0,clientX:52,clientY:56,pointerId:14,preventDefault(){}});
 board.onpointermove({clientX:90,clientY:140,pointerId:14});assert.equal(tile.attrs['aria-label'],'Cabin · crew aboard');
 board.onpointercancel({pointerId:14});h.click(h.thing('lamp'));h.click(h.thing('battery'));
 assert.equal(h.thing('lamp').attrs['aria-label'],'Cabin');assert(!h.app.innerHTML.includes('crew aboard'));
 const loaded=harness(world,h.saved.get(h.key));assert.equal(loaded.thing('lamp').attrs['aria-label'],'Cabin');
 h.click(h.button('undo'));assert.equal(h.thing('lamp').attrs['aria-label'],'Cabin · crew aboard');
});
test('conditional labels reserve the larger footprint without changing token coordinates or revealing future text',()=>{
 const world=structuredClone(fixture);Object.assign(world.items[0],{label:'Cabin',labelAfterCreated:{item:'beacon',label:'The crew have safely reached the sheltered cabin'}});
 const initial=M.createGame(world),t=M.token(initial.state,'lamp')!,height=M.tokenHeight(world,t);
 assert(height>=10+M.itemLabelLines(world.items[0].labelAfterCreated!.label).length*14);
 const h=harness(world);h.click(h.button('close'));assert(!h.app.innerHTML.includes('safely reached'));h.click(h.thing('lamp'));h.click(h.thing('battery'));
 const after=M.token(h.state().state,'lamp')!;assert.equal(M.tokenHeight(world,after),height);assert.deepEqual([after.x,after.y],[t.x,t.y]);
 assert.equal(h.thing('lamp').attrs['aria-label'],'The crew have safely reached the sheltered cabin');
});
