import {reconcileLocationDom} from './location-dom.ts';
import {syntheticDocument} from './synthetic-dom.ts';
import * as Current from '../engine/campaign.ts';
import {fromLegacyScenario,toLegacyGame} from '../compatibility/v1.ts';
import {applyMilestones as currentMilestones} from '../ui/current-campaign.ts';
import {presentationFor as currentPresentation} from '../ui/current-scenarios.ts';
import {applyMilestones} from './campaign-milestones.ts';
import {archivedScenarioIds} from '../schema/lifecycle.ts';
import {featuredScenarioIds,presentationFor} from '../ui/scenarios.ts';
// Synthetic DOM/controller evidence. No native layout or touch claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
import * as M from '../engine/model.ts';
import type {Scenario} from '../schema/scenario.ts';
import type {Scenario as CurrentScenario} from '../schema/campaign.ts';
import {decodeSave,encodeSave,type SaveEnvelope} from './save-codec.ts';
import {scenarios as campaignScenarios} from './scenarios.ts';
const fixture:Scenario={schemaVersion:1,id:'fixture',title:'A small journey',premise:'Make a beacon.',items:[{id:'lamp',label:'Lamp'},{id:'battery',label:'Battery'},{id:'beacon',label:'Beacon'}],locations:[{id:'ridge',label:'Ridge'}],initialItems:['lamp','battery'],recipes:[{id:'beacon',a:'lamp',b:'battery',out:'beacon'}],stages:[{id:'build',title:'Build',speaker:'Control',motivation:'Make a beacon.',completionText:'The beacon shines. The climb can begin.',area:{id:'camp',label:'Camp',travelText:'We landed.'},objectives:[{id:'make',text:'Make a beacon.',kind:'create',item:'beacon'}]},{id:'signal',title:'Signal',speaker:'Control',motivation:'Put it on the ridge.',completionText:'Your light reaches the valley. Everyone returns safely.',area:{id:'hill',label:'Hill',travelText:'Bring the beacon up the hill.'},locations:['ridge'],objectives:[{id:'put',text:'Put the beacon on the ridge.',kind:'place',item:'beacon',location:'ridge'}]}]};
export function locationHarness(world:Scenario|CurrentScenario=fixture,initialSaved?:string,options:{worlds?:(Scenario|CurrentScenario)[];search?:string;width?:number;modernPointer?:boolean;deferSave?:boolean;deferFlush?:boolean}={}){
 let els:any[]=[],hit:any=null;const navigated:string[]=[];const flushWaiters:(()=>void)[]=[];const windowEvents:Record<string,Function>={};const saved=new Map<string,string>();const key='tangible-campaign-v1:'+world.id;if(initialSaved)saved.set(key,initialSaved);const timers:{fn:()=>void,ms:number,ran?:boolean,cancelled?:boolean}[]=[];
 let latest:SaveEnvelope|undefined=initialSaved?(()=>{try{return decodeSave(initialSaved);}catch{return undefined;}})():undefined,saveCallback:Function=()=>{},saveStatus={state:'idle',revision:0,savedRevision:0,message:''},retries=0,lifecycleInstalled=false;
 const {app,doc}=syntheticDocument(options.width??360);doc.elementFromPoint=()=>hit;
 const emitSaveStatus=(state:string,message:string)=>{saveStatus={...saveStatus,state,message};saveCallback(saveStatus);};
 const flushSave=()=>{if(latest){saved.set(key,JSON.stringify(latest));saveStatus.savedRevision=saveStatus.revision;emitSaveStatus('saved','Progress saved.');}};
 // Deliberate adapter double. Real worker ordering, lifecycle and quota behavior
 // belong to save-autosave's separate suite; this checks the controller contract.
 const createAutosave=({onStatus}:{onStatus:Function})=>{saveCallback=onStatus;return {enqueue:(value:SaveEnvelope|(()=>SaveEnvelope))=>{latest=structuredClone(typeof value==='function'?value():value);saveStatus.revision++;emitSaveStatus('saving','Saving progress…');if(!options.deferSave)flushSave();},getStatus:()=>saveStatus,retry:()=>{retries++;emitSaveStatus('saving','Saving progress…');},flush:async()=>{if(saveStatus.state==='error')throw Error(saveStatus.message);if(options.deferFlush)await new Promise<void>(resolve=>flushWaiters.push(resolve));flushSave();},flushSync:()=>{flushSave();return true;},dispose(){}};};
 const ctx={reconcileLocationDom,applyMilestones:currentMilestones,toLegacyGame,archivedScenarioIds,featuredScenarioIds,presentationFor:currentPresentation,addEventListener:(name:string,fn:Function)=>windowEvents[name]=fn,window:{},M:Current,decodeSave,createAutosave,installSaveLifecycle:()=>{lifecycleInstalled=true;return ()=>{};},scenarios:(options.worlds??[world]).map(s=>s.schemaVersion===1?fromLegacyScenario(s):s),document:doc,location:{search:options.search??'?world='+world.id,assign:(href:string)=>navigated.push(href)},URLSearchParams,innerWidth:options.width??360,structuredClone,confirm:()=>true,localStorage:{getItem:(k:string)=>saved.get(k)??null,setItem:(k:string,v:string)=>saved.set(k,v)},setTimeout:(fn:()=>void,ms:number)=>{const t={fn:()=>{},ms,ran:false,cancelled:false};t.fn=()=>{t.ran=true;fn();};timers.push(t);return t;},clearTimeout:(t:{fn:()=>void,cancelled?:boolean})=>{t.cancelled=true;t.fn=()=>{};},...(options.modernPointer?{PointerEvent:class{}}:{})};
 const code=stripTypeScriptTypes(readFileSync(new URL('./campaign-main.ts',import.meta.url),'utf8').replace(/^import .*;\n/gm,''));vm.runInNewContext(code,ctx);
 const button=(id:string)=>doc.getElementById(id);const thing=(id:string)=>doc.querySelectorAll('[data-target]').find((e:any)=>e.dataset.target===id);const click=(e:any)=>{assert(e);e.onclick?.({target:e,stopPropagation(){}});};const state=()=>structuredClone(latest!.game) as M.Game;
 return {navigated,resolveFlush:()=>flushWaiters.splice(0).forEach(fn=>fn()),windowEvents,saved,app,doc,button,thing,click,state,timers,key,emitSaveStatus,flushSave,retries:()=>retries,lifecycleInstalled:()=>lifecycleInstalled,setHit:(e:any)=>hit=e,flush:()=>timers.filter(t=>t.ms===0).forEach(t=>t.fn())};
}
