// Synthetic DOM/controller evidence. No native layout or touch claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
import * as M from '../engine/model.ts';
import type {Scenario} from '../schema/scenario.ts';
import {decodeSave,encodeSave,type SaveEnvelope} from './save-codec.ts';
const fixture:Scenario={schemaVersion:1,id:'fixture',title:'A small journey',premise:'Make a beacon.',items:[{id:'lamp',label:'Lamp'},{id:'battery',label:'Battery'},{id:'beacon',label:'Beacon'}],locations:[{id:'ridge',label:'Ridge'}],initialItems:['lamp','battery'],recipes:[{id:'beacon',a:'lamp',b:'battery',out:'beacon'}],stages:[{id:'build',title:'Build',speaker:'Control',motivation:'Make a beacon.',completionText:'The beacon shines. The climb can begin.',area:{id:'camp',label:'Camp',travelText:'We landed.'},objectives:[{id:'make',text:'Make a beacon.',kind:'create',item:'beacon'}]},{id:'signal',title:'Signal',speaker:'Control',motivation:'Put it on the ridge.',completionText:'Your light reaches the valley. Everyone returns safely.',area:{id:'hill',label:'Hill',travelText:'Bring the beacon up the hill.'},locations:['ridge'],objectives:[{id:'put',text:'Put the beacon on the ridge.',kind:'place',item:'beacon',location:'ridge'}]}]};
function harness(world=fixture,initialSaved?:string,options:{worlds?:Scenario[];search?:string;modernPointer?:boolean;deferSave?:boolean;deferFlush?:boolean}={}){
 let els:any[]=[],hit:any=null;const navigated:string[]=[];const flushWaiters:(()=>void)[]=[];const windowEvents:Record<string,Function>={};const saved=new Map<string,string>();const key='tangible-campaign-v1:'+world.id;if(initialSaved)saved.set(key,initialSaved);const timers:{fn:()=>void,ms:number}[]=[];
 let latest:SaveEnvelope|undefined=initialSaved?(()=>{try{return decodeSave(initialSaved);}catch{return undefined;}})():undefined,saveCallback:Function=()=>{},saveStatus={state:'idle',revision:0,savedRevision:0,message:''},retries=0,lifecycleInstalled=false;
 const matches=(e:any,q:string)=>q.split(',').some(q=>q.startsWith('#')?e.id===q.slice(1):q.startsWith('.')?e.classList.contains(q.slice(1)):(()=>{const m=/^\[data-([\w-]+)(?:="([^"]*)")?\]$/.exec(q);return !!m&&m[1]in e.dataset&&(m[2]===undefined||e.dataset[m[1]]===m[2]);})());
 class El{listeners:Record<string,Function[]>={};id='';dataset:Record<string,string>={};attrs:Record<string,string>={};parentElement:any=null;children:any[]=[];value='';style:any={};hidden=false;open=false;textContent='';isConnected=true;clientWidth=360;clientHeight=500;scrollTop=0;scrollLeft=0;_html='';classes=new Set<string>();classList={add:(...xs:string[])=>xs.forEach(x=>this.classes.add(x)),remove:(...xs:string[])=>xs.forEach(x=>this.classes.delete(x)),contains:(x:string)=>this.classes.has(x)};
  set innerHTML(html:string){this._html=html;els.forEach(e=>e.isConnected=false);els=[];const stack:any[]=[this];for(const m of html.matchAll(/<\/?([\w-]+)\b[^>]*>/g)){const raw=m[0],tag=m[1];if(raw.startsWith('</')){if(stack.length>1)stack.pop();continue;}const e=new El();for(const a of raw.matchAll(/([\w-]+)="([^"]*)"/g))e.attrs[a[1]]=a[2];e.id=e.attrs.id??'';e.hidden=/\shidden(?:\s|>)/.test(raw);e.classes=new Set((e.attrs.class??'').split(/\s+/).filter(Boolean));for(const [k,v]of Object.entries(e.attrs))if(k.startsWith('data-'))e.dataset[k.slice(5)]=v;e.parentElement=stack.at(-1);e.parentElement.children.push(e);els.push(e);if(!['br','input','meta','link'].includes(tag))stack.push(e);}}
  get innerHTML(){return this._html;}get href(){return this.attrs.href;}showModal(){this.open=true;}closest(q:string):any{return matches(this,q)?this:this.parentElement?.closest(q)??null;}getBoundingClientRect(){return {left:0,top:0,right:360,bottom:500,width:360,height:500};}setPointerCapture(){}addEventListener(type:string,fn:Function){(this.listeners[type]??=[]).push(fn);}
 }
 const app=new El();const doc={querySelector:(q:string)=>q==='#app'?app:els.find(e=>matches(e,q))??null,querySelectorAll:(q:string)=>els.filter(e=>matches(e,q)),getElementById:(id:string)=>els.find(e=>e.id===id)??null,elementFromPoint:()=>hit};
 const emitSaveStatus=(state:string,message:string)=>{saveStatus={...saveStatus,state,message};saveCallback(saveStatus);};
 const flushSave=()=>{if(latest){saved.set(key,JSON.stringify(latest));saveStatus.savedRevision=saveStatus.revision;emitSaveStatus('saved','Progress saved.');}};
 // Deliberate adapter double. Real worker ordering, lifecycle and quota behavior
 // belong to save-autosave's separate suite; this checks the controller contract.
 const createAutosave=({onStatus}:{onStatus:Function})=>{saveCallback=onStatus;return {enqueue:(value:SaveEnvelope|(()=>SaveEnvelope))=>{latest=structuredClone(typeof value==='function'?value():value);saveStatus.revision++;emitSaveStatus('saving','Saving progress…');if(!options.deferSave)flushSave();},getStatus:()=>saveStatus,retry:()=>{retries++;emitSaveStatus('saving','Saving progress…');},flush:async()=>{if(saveStatus.state==='error')throw Error(saveStatus.message);if(options.deferFlush)await new Promise<void>(resolve=>flushWaiters.push(resolve));flushSave();},flushSync:()=>{flushSave();return true;},dispose(){}};};
 const ctx={addEventListener:(name:string,fn:Function)=>windowEvents[name]=fn,window:{},M,decodeSave,createAutosave,installSaveLifecycle:()=>{lifecycleInstalled=true;return ()=>{};},scenarios:options.worlds??[world],document:doc,location:{search:options.search??'?world='+world.id,assign:(href:string)=>navigated.push(href)},URLSearchParams,innerWidth:360,structuredClone,confirm:()=>true,localStorage:{getItem:(k:string)=>saved.get(k)??null,setItem:(k:string,v:string)=>saved.set(k,v)},setTimeout:(fn:()=>void,ms:number)=>{const t={fn,ms};timers.push(t);return t;},clearTimeout:(t:{fn:()=>void})=>{t.fn=()=>{};},...(options.modernPointer?{PointerEvent:class{}}:{})};
 const code=stripTypeScriptTypes(readFileSync(new URL('./campaign-main.ts',import.meta.url),'utf8').replace(/^import .*;\n/gm,''));vm.runInNewContext(code,ctx);
 const button=(id:string)=>doc.getElementById(id);const thing=(id:string)=>els.find(e=>e.dataset.target===id);const click=(e:any)=>{assert(e);e.onclick?.({target:e,stopPropagation(){}});};const state=()=>structuredClone(latest!.game) as M.Game;
 return {navigated,resolveFlush:()=>flushWaiters.splice(0).forEach(fn=>fn()),windowEvents,saved,app,doc,button,thing,click,state,timers,key,emitSaveStatus,flushSave,retries:()=>retries,lifecycleInstalled:()=>lifecycleInstalled,setHit:(e:any)=>hit=e,flush:()=>timers.filter(t=>t.ms===0).forEach(t=>t.fn())};
}
test('click creation, advance modal, exact placement gold, undo and reset',()=>{const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));assert.equal(h.state().state.metrics.combinations,1);assert(h.thing('beacon').classes.has('goal-met'));assert(h.thing('lamp'));h.click(h.button('next'));assert(h.button('mission').open);assert(!h.thing('beacon').classes.has('goal-met'));h.click(h.button('close'));h.click(h.thing('beacon'));h.click(h.thing('@ridge'));assert(h.thing('beacon').classes.has('goal-met'));assert(h.thing('@ridge').classes.has('goal-met'));h.click(h.button('undo'));assert(!h.thing('beacon').classes.has('goal-met'));h.click(h.button('reset'));assert(h.button('mission').open);assert(!h.thing('beacon'));});
test('drag creation leaves source at origin and ordinary drop uses release position',()=>{const h=harness();h.click(h.button('close'));const origin=structuredClone(h.state().state.tokens.find(t=>t.id==='lamp'));let board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});h.setHit(h.thing('battery'));board.onpointermove({clientX:152,clientY:56,pointerId:1});board.onpointerup({clientX:152,clientY:56,pointerId:1});assert.deepEqual(h.state().state.tokens.find(t=>t.id==='lamp'),origin);assert(h.thing('beacon'));h.flush();board=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:2,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:200,clientY:300,pointerId:2});board.onpointerup({clientX:200,clientY:300,pointerId:2});assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.x,200);assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.y,300);});
test('cancelled drag and mission interruption do not combine',()=>{const h=harness();h.click(h.button('close'));const before=h.state().state;const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});h.setHit(h.thing('battery'));board.onpointermove({clientX:152,clientY:56,pointerId:1});board.onpointercancel({pointerId:1});assert.deepEqual(h.state().state,before);h.click(h.button('purpose'));assert(h.button('mission').open);h.click(h.button('modal-reset'));assert.equal(h.state().state.metrics.combinations,0);});

test('REGRESSION: unrelated pointerup must not finish active drag',()=>{const h=harness();h.click(h.button('close'));const before=h.state().state;const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:220,clientY:300,pointerId:1});board.onpointerup({clientX:100,clientY:100,pointerId:2});assert.deepEqual(h.state().state,before);});
test('lost capture cancels drag without a move; stale up does nothing',()=>{const h=harness();h.click(h.button('close'));const before=h.state().state;const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});board.onpointermove({clientX:220,clientY:300,pointerId:1});board.onlostpointercapture({pointerId:1});h.setHit(h.thing('battery'));board.onpointerup({clientX:152,clientY:56,pointerId:1});assert.deepEqual(h.state().state,before);});
test('saved stage roundtrip and undo preserves prior places',()=>{const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.click(h.button('next'));h.click(h.button('close'));const before=h.state();const loaded=harness(fixture,h.saved.get('tangible-campaign-v1:fixture'));assert.deepEqual(loaded.state(),before);loaded.click(loaded.button('undo'));assert.equal(loaded.state().state.stage,0);assert(!loaded.thing('@ridge'));assert(loaded.thing('lamp'));});
test('incoming catalyst hints identify receiving object without output spoiler',()=>{const world=structuredClone(fixture);world.stages[0].locations=['ridge'];world.stages[1].locations=[];world.recipes[0].at='ridge';const h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('@ridge'));h.thing('lamp').onmouseenter();const info:any=h.doc.querySelector('#inspection');assert.match(info.textContent,/Bring Battery onto Lamp here/);assert(!info.textContent.includes('Beacon'));h.click(h.thing('battery'));h.click(h.thing('lamp'));assert(h.thing('beacon'));});
test('second pointer cannot adopt drag or cancel first pointer',()=>{const h=harness();h.click(h.button('close'));const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});board.onpointerdown({target:h.thing('battery'),button:0,clientX:152,clientY:56,pointerId:2,preventDefault(){}});board.onpointercancel({pointerId:2});board.onlostpointercapture({pointerId:2});h.setHit(null);board.onpointermove({clientX:220,clientY:300,pointerId:1});board.onpointerup({clientX:220,clientY:300,pointerId:1});assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.x,220);assert.equal(h.state().state.tokens.find(t=>t.id==='battery')!.x,152);});
test('legacy fallback ignores second finger and commits only owned touch',()=>{const h=harness();h.click(h.button('close'));const board:any=h.doc.querySelector('.board');const touch=(identifier:number,clientX=52,clientY=56)=>({identifier,clientX,clientY});const fire=(name:string,args:any)=>board.listeners[name][0]({preventDefault(){},...args});fire('touchstart',{target:h.thing('lamp'),changedTouches:[touch(1)]});fire('touchstart',{target:h.thing('battery'),changedTouches:[touch(2)]});fire('touchcancel',{changedTouches:[touch(2)]});fire('touchmove',{touches:[touch(1,220,300),touch(2)]});fire('touchend',{changedTouches:[touch(2)]});assert.equal(h.state().state.metrics.moves,0);h.setHit(null);fire('touchend',{changedTouches:[touch(1,220,300)]});assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.x,220);});
test('resize and blur interrupt drag without committing transient coordinates',()=>{for(const event of ['resize','blur']){const h=harness();h.click(h.button('close'));const before=h.state().state;const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});board.onpointermove({clientX:220,clientY:300,pointerId:1});h.windowEvents[event]();h.setHit(null);board.onpointerup({clientX:220,clientY:300,pointerId:1});assert.deepEqual(h.state().state,before);}});
test('ordinary drop into prior area changes actual area with same unique ID and fixed area tops',()=>{const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.click(h.button('next'));h.click(h.button('close'));const saved=JSON.parse(h.saved.get('tangible-campaign-v1:fixture')!);const top=saved.tops.hill;const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('beacon'),button:0,clientX:52,clientY:top+56,pointerId:1,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:220,clientY:100,pointerId:1});board.onpointerup({clientX:220,clientY:100,pointerId:1});const g=h.state();assert.equal(g.state.tokens.find(t=>t.id==='beacon')!.area,'camp');assert.equal(g.state.tokens.find(t=>t.id==='beacon')!.y,100);assert.equal(g.state.tokens.filter(t=>t.id==='beacon').length,1);assert.equal(g.state.currentArea,'camp');assert.deepEqual(JSON.parse(h.saved.get('tangible-campaign-v1:fixture')!).tops,saved.tops);});
test('checkpoint interruption cancels drag and opens replayed-stage mission',()=>{const world=structuredClone(fixture);world.checkpoints=[{id:'hill',label:'Hill',actions:[{type:'combine',a:'lamp',b:'battery'},{type:'advance'}]}];const h=harness(world);h.click(h.button('close'));const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('lamp'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});board.onpointermove({clientX:220,clientY:300,pointerId:1});h.button('jump')!.onchange({target:{value:'hill'}});h.setHit(null);board.onpointerup({clientX:220,clientY:300,pointerId:1});assert.equal(h.state().state.stage,1);assert(h.button('mission')!.open);assert.equal(h.state().state.metrics.moves,0);assert.equal(h.state().state.tokens.find(t=>t.id==='beacon')!.area,'hill');});

test('location gesture uses the shared resolver: new recipe first, then ordinary placement',()=>{
 const world=structuredClone(fixture);world.stages[0].locations=['ridge'];world.stages[1].locations=[];world.recipes[0].b='@ridge';
 const h=harness(world);h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('@ridge'));
 assert.equal(h.state().events.at(-1)!.action.type,'combine');assert(h.thing('beacon'));
 h.click(h.thing('lamp'));h.click(h.thing('@ridge'));
 assert.deepEqual(h.state().events.at(-1)!.action,{type:'place',item:'lamp',location:'ridge'});
 assert.equal(h.state().state.tokens.find(t=>t.id==='lamp')!.location,'ridge');
});
test('fulfilled chapter replaces stale mission with durable closure and named next action; undo clears it',()=>{
 const h=harness();assert(!h.app.innerHTML.includes(fixture.stages[0].completionText!));h.click(h.button('close'));
 h.click(h.thing('lamp'));h.click(h.thing('battery'));
 assert.match(h.app.innerHTML,/Continue · Signal/);assert(h.app.innerHTML.includes(fixture.stages[0].completionText!));
 h.timers.filter(t=>t.ms===4500).forEach(t=>t.fn());assert(h.doc.querySelector('.completion-story'));
 h.click(h.button('purpose'));assert(h.button('mission').open);assert.match(h.app.innerHTML,/Chapter complete · Build/);
 assert(!h.doc.querySelector('.motivation'));assert(h.button('modal-next'));
 h.click(h.button('close'));h.click(h.button('undo'));
 assert(!h.button('next'));assert(!h.doc.querySelector('.completion-story'));assert(h.doc.querySelector('.motivation'));
});
test('finish opens readable ending, ending survives close/reload, and undo restores Finish',()=>{
 const h=harness();h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.click(h.button('next'));h.click(h.button('close'));
 h.click(h.thing('beacon'));h.click(h.thing('@ridge'));assert.match(h.app.innerHTML,/Finish this journey/);
 assert(h.app.innerHTML.includes(fixture.stages[1].completionText!));h.click(h.button('next'));
 assert(h.state().state.completed);assert(h.button('mission').open);assert(!h.button('next'));assert(!h.button('modal-next'));
 assert.match(h.app.innerHTML,/>Ending<\/button>/);assert.match(h.app.innerHTML,/Explore your creations/);assert(!h.doc.querySelector('.motivation'));
 h.click(h.button('close'));assert(h.doc.querySelector('.completion-story'));const loaded=harness(fixture,h.saved.get(h.key));
 assert(loaded.app.innerHTML.includes(fixture.stages[1].completionText!));loaded.click(loaded.button('purpose'));assert(loaded.button('mission').open);
 loaded.click(loaded.button('close'));loaded.click(loaded.button('undo'));assert(!loaded.state().state.completed);assert(loaded.button('next'));assert.match(loaded.app.innerHTML,/Finish this journey/);
});
test('moving an exact-placement objective away removes premature ending before Finish',()=>{
 const world=structuredClone(fixture);world.initialItems=['beacon'];world.stages=[world.stages[1]];const h=harness(world);h.click(h.button('close'));h.click(h.thing('beacon'));h.click(h.thing('@ridge'));assert(h.button('next'));
 const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('beacon'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:200,clientY:300,pointerId:1});board.onpointerup({clientX:200,clientY:300,pointerId:1});
 assert(!h.button('next'));assert(!h.doc.querySelector('.completion-story'));h.click(h.button('purpose'));assert(h.doc.querySelector('.motivation'));
});
test('checkpoint DEBUG marker stays outside menu, restores from compact save and clears only on reset',()=>{
 const world=structuredClone(fixture);world.checkpoints=[{id:'hill',label:'Hill checkpoint',actions:[{type:'combine',a:'lamp',b:'battery'},{type:'advance'}]}];
 const h=harness(world);h.button('jump').onchange({target:{value:'hill'}});const marker=h.doc.querySelector('.debug-marker');assert(marker);assert(marker.parentElement.classes.has('toolbar'));
 assert.match(h.app.innerHTML,/DEBUG · Hill checkpoint/);h.click(h.button('close'));h.click(h.button('undo'));assert(h.doc.querySelector('.debug-marker'));
 const raw=encodeSave(decodeSave(h.saved.get(h.key)!));const loaded=harness(world,raw);assert.match(loaded.app.innerHTML,/DEBUG · Hill checkpoint/);
 loaded.click(loaded.button('reset'));assert(!loaded.doc.querySelector('.debug-marker'));assert.equal(decodeSave(loaded.saved.get(loaded.key)!).debugName,undefined);
});
test('active chooser hides archived school and causation, preserving direct archived routes',()=>{
 const oldBoat={...structuredClone(fixture),id:'causation',title:'Why This Boat?'},oldSchool={...structuredClone(fixture),id:'chinese-thought',title:'The School by the Well'},newBoat={...structuredClone(fixture),id:'causation-purpose-v4',title:'The rebuilt boatyard'},worlds=[fixture,oldBoat,oldSchool,newBoat];
 const h=harness(fixture,undefined,{worlds,search:''});assert.match(h.app.innerHTML,/A small journey/);assert(!h.app.innerHTML.includes(oldBoat.title));assert(!h.app.innerHTML.includes(oldSchool.title));assert(h.app.innerHTML.includes(newBoat.title));
 for(const world of [oldBoat,oldSchool]){const route=harness(world,undefined,{worlds});assert(route.button('mission').open);assert(route.app.innerHTML.includes(world.title));route.click(route.button('close'));assert.equal(route.state().scenarioId,world.id);}
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
 const css=readFileSync(new URL('./campaign.css',import.meta.url),'utf8');assert.match(css,/\.chooser\{flex:1;min-height:0;[^}]*overflow-y:auto/);assert.match(css,/\.progress\{max-height:28dvh;overflow-y:auto/);assert.match(css,/#inspection\{[^}]*max-height:min\(16dvh,96px\);overflow-y:auto/);assert.match(css,/\.footer-actions\{display:flex/);
});
test('in-app navigation awaits durable save and stays on the current journey after failure',async()=>{
 const h=harness(fixture,undefined,{deferSave:true});h.click(h.button('close'));
 h.emitSaveStatus('error','Progress is not saved.');let prevented=false;
 await h.button('go-chooser').onclick({preventDefault(){prevented=true;}});assert(prevented);assert.deepEqual(h.navigated,[]);assert.match(h.doc.querySelector('.feedback').textContent,/not saved/);
 h.click(h.button('retry-save'));await h.button('go-chooser').onclick({preventDefault(){}});assert.deepEqual(h.navigated,['campaign.html']);assert(h.saved.has(h.key));
});
test('newer navigation wins and reset cancels an outstanding save-before-navigation request',async()=>{
 const h=harness(fixture,undefined,{deferFlush:true});h.click(h.button('close'));
 const first=h.button('go-chooser').onclick({preventDefault(){}}),second=h.button('go-original').onclick({preventDefault(){}});h.resolveFlush();await Promise.all([first,second]);assert.deepEqual(h.navigated,['index.html']);
 const pending=h.button('go-chooser').onclick({preventDefault(){}});h.click(h.button('reset'));h.resolveFlush();await pending;assert.deepEqual(h.navigated,['index.html']);assert(h.button('mission').open);
});
test('after Finish, moved creations retain the recorded ending without claiming current placement',()=>{
 const world=structuredClone(fixture);world.initialItems=['beacon'];world.stages=[world.stages[1]];const h=harness(world);h.click(h.button('close'));h.click(h.thing('beacon'));h.click(h.thing('@ridge'));h.click(h.button('next'));h.click(h.button('close'));
 const board:any=h.doc.querySelector('.board');board.onpointerdown({target:h.thing('beacon'),button:0,clientX:52,clientY:56,pointerId:1,preventDefault(){}});h.setHit(null);board.onpointermove({clientX:200,clientY:300,pointerId:1});board.onpointerup({clientX:200,clientY:300,pointerId:1});
 assert(h.state().state.completed);assert(!h.thing('beacon').classes.has('goal-met'));assert(!h.button('next'));assert.match(h.app.innerHTML,/At journey’s end:/);assert(h.app.innerHTML.includes(world.stages[0].completionText!));assert(!h.doc.querySelector('.motivation'));
});
test('opening mission shows initial cache narrative but no transition; later stage shows actual travel',()=>{
 const world=structuredClone(fixture);world.stages[0].area.travelText='We collect useful things from places already visited.';
 world.initialItems=['battery'];world.stages[0].caches=[{id:'initial-store',label:'Supplies at camp',narrative:'The landing pack is already beside you.',items:['lamp']}];
 const h=harness(world);assert(h.button('mission').open);assert(!h.app.innerHTML.includes(world.stages[0].area.travelText));assert(h.app.innerHTML.includes('Supplies at camp'));assert(h.app.innerHTML.includes('The landing pack is already beside you.'));
 h.click(h.button('close'));h.click(h.thing('lamp'));h.click(h.thing('battery'));h.click(h.button('next'));
 assert(h.button('mission').open);assert(h.app.innerHTML.includes(world.stages[1].area.travelText));
});
