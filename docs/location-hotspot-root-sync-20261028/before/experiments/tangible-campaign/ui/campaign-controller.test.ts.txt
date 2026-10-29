// Synthetic DOM/controller evidence. No native layout or touch claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
import * as M from '../engine/model.ts';
import type {Scenario} from '../schema/scenario.ts';
import {decodeSave,encodeSave,type SaveEnvelope} from './save-codec.ts';
import {scenarios as campaignScenarios} from './scenarios.ts';
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
 const ctx={addEventListener:(name:string,fn:Function)=>windowEvents[name]=fn,window:{},M,decodeSave,createAutosave,installSaveLifecycle:()=>{lifecycleInstalled=true;return ()=>{};},scenarios:options.worlds??[world],document:doc,location:{search:options.search??'?world='+world.id,assign:(href:string)=>navigated.push(href)},URLSearchParams,innerWidth:options.width??360,structuredClone,confirm:()=>true,localStorage:{getItem:(k:string)=>saved.get(k)??null,setItem:(k:string,v:string)=>saved.set(k,v)},setTimeout:(fn:()=>void,ms:number)=>{const t={fn,ms};timers.push(t);return t;},clearTimeout:(t:{fn:()=>void})=>{t.fn=()=>{};},...(options.modernPointer?{PointerEvent:class{}}:{})};
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
test('ordinary drop into prior area changes actual area with same unique ID and fixed area tops',()=>{const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.timers.filter(t=>t.ms===700).at(-1)?.fn();h.click(h.button('close'));const saved=JSON.parse(h.saved.get('tangible-campaign-v1:fixture')!);const top=saved.tops.hill;const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('beacon'),button:0,clientX:52,clientY:top+56,pointerId:1,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:220,clientY:100,pointerId:1});board.onpointerup({clientX:220,clientY:100,pointerId:1});const g=h.state();assert.equal(g.state.tokens.find(t=>t.id==='beacon')!.area,'camp');assert.equal(g.state.tokens.find(t=>t.id==='beacon')!.y,100);assert.equal(g.state.tokens.filter(t=>t.id==='beacon').length,1);assert.equal(g.state.currentArea,'camp');assert.deepEqual(JSON.parse(h.saved.get('tangible-campaign-v1:fixture')!).tops,saved.tops);});
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
 const oldBoat={...structuredClone(fixture),id:'causation',title:'Why This Boat?'},oldSchool={...structuredClone(fixture),id:'chinese-thought',title:'The School by the Well'},newBoat={...structuredClone(fixture),id:'causation-purpose-v4',title:'The rebuilt boatyard'},worlds=[fixture,oldBoat,oldSchool,newBoat];
 const h=harness(fixture,undefined,{worlds,search:''});assert.match(h.app.innerHTML,/A small journey/);assert(!h.app.innerHTML.includes(oldBoat.title));assert(!h.app.innerHTML.includes(oldSchool.title));assert(h.app.innerHTML.includes(newBoat.title));
 for(const world of [oldBoat,oldSchool]){const route=harness(world,undefined,{worlds});assert(route.button('mission').open);assert(route.app.innerHTML.includes(world.title));route.click(route.button('close'));assert.equal(route.state().scenarioId,world.id);}
});
test('previous full campaigns remain playable directly but are unlisted in the active chooser',()=>{
 const archived=['theology','mars-story-expansion-candidate','atlas-of-questions-v6','elements-local-projects-v5'].map((id,i)=>({...structuredClone(fixture),id,title:'Archived full campaign '+i}));
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

test('resuming a completed challenge opens the next challenge rather than its completion recap',()=>{
 const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));
 const loaded=harness(fixture,h.saved.get(h.key));assert.equal(loaded.state().state.stage,1);assert(loaded.button('mission').open);assert(!loaded.doc.querySelector('.completion-story'));assert(loaded.app.innerHTML.includes(fixture.stages[1].motivation));
});

test('six selected journeys are prominent; undeveloped sketches are secondary and remain playable',()=>{
 const ids=['mars-cargo-revision-v2','atlas-of-questions-v8-transmission-actions','elements-observation-revision-v6','food','causation-purpose-v4','doctrine-grace-and-matter-v1'];
 const worlds=[...ids.map((id,i)=>({...structuredClone(fixture),id,title:'Priority '+i})),{...structuredClone(fixture),id:'literature',title:'Literature sketch'},{...structuredClone(fixture),id:'restoration',title:'Restoration sketch'},{...structuredClone(fixture),id:'shoreline',title:'Shoreline sketch'}];
 const h=harness(fixture,undefined,{worlds,search:''});const html=h.app.innerHTML;const secondary=html.indexOf('<details class="secondary-journeys">');assert(secondary>0);assert.match(html,/not developed/);
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
