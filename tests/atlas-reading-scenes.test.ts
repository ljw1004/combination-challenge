import {readSiteSourceForRootTests,writeRootTestOutput} from '../scripts/site-source-test-context.ts';
const readFileSync=readSiteSourceForRootTests;
import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync as originalReadFileSync} from 'node:fs';
import type {Action,Scenario} from '../experiments/tangible-campaign/schema/campaign.ts';
import * as M from '../experiments/tangible-campaign/engine/campaign.ts';
import {toLegacyGame} from '../experiments/tangible-campaign/compatibility/v1.ts';
import {scenario as s,atlasReadingSplits} from '../experiments/tangible-campaign/ui/stories/atlas-reading-scenes.ts';
import {atlasLocations as merged} from '../experiments/tangible-campaign/ui/stories/intellectual-locations.ts';
import {scenario as prior} from '../experiments/tangible-campaign/ui/stories/atlas-intellectual-history.ts';
import {locationHarness} from '../experiments/tangible-campaign/ui/location-controller-harness.ts';
const route:Action[]=JSON.parse(readFileSync(new URL('../experiments/tangible-campaign/evidence/intellectual-worlds-20261028/atlas-author-route.json',import.meta.url),'utf8')).actionsLog.map((a:any)=>a.type==='place'?{type:'place',item:a.item,hotspot:a.location}:a);
const step=(g:M.Game,a:Action)=>{const r=M.applyAction(s,g,a);assert(r.accepted,JSON.stringify(a)+' '+r.message);return r.game;};
const local=(g:M.Game)=>g.state.tokens.filter(t=>t.location===(g.state.storyLocation??g.state.currentLocation));
const noMetrics=({metrics,...rest}:M.State)=>rest;
const measure=(world:Scenario)=>{let g=M.createGame(world,375);const rows:{entry:number;peak:number;items:string[]}[]=[];for(const a of route){const things=local(g),row=rows[g.state.chapter]??={entry:things.length,peak:0,items:things.map(t=>t.kind).sort()};row.peak=Math.max(row.peak,things.length);const r=M.applyAction(world,g,a);assert(r.accepted,r.message);g=r.game;}assert(g.state.completed);return rows;};
test('thirty distinct desks preserve exact source groups, recipe/goal semantics and old-world saves',()=>{
 assert.equal(s.id,'atlas-reading-scenes-v3');assert.deepEqual(s.recipes,merged.recipes);assert.deepEqual(s.items,merged.items);assert.deepEqual(s.hotspots,merged.hotspots);assert.deepEqual(s.chapters.map(c=>[c.id,c.objectives,c.onAlreadyComplete]),merged.chapters.map(c=>[c.id,c.objectives,c.onAlreadyComplete]));
 assert.deepEqual(s.locationPlan!.locations.flatMap(l=>l.stockBatches.flatMap(b=>b.items)).sort(),merged.locationPlan!.locations.flatMap(l=>l.stockBatches.flatMap(b=>b.items)).sort());assert.equal(s.locationPlan!.locations.length,30);
 for(const [i,l]of s.locationPlan!.locations.entries()){assert(readFileSync(new URL('../public'+l.background.asset,import.meta.url)).length>1000);assert.equal(l.background.stableKey,l.id);assert.deepEqual(l.stockBatches,prior.chapters[i].caches);assert.deepEqual(s.locationPlan!.visits[i].carry,prior.chapters[i].carry);assert.equal(s.chapters[i].entryCue!.mode,'arrival-and-beat');assert(s.chapters[i].entryCue!.text.endsWith(merged.chapters[i].entryCue!.text));assert.equal(s.chapters[i].entryCue!.sourceCaption,merged.chapters[i].entryCue!.sourceCaption);}
 assert.deepEqual(s.locationPlan!.locations.flatMap(l=>l.hotspots).sort(),merged.locationPlan!.locations.flatMap(l=>l.hotspots).sort());assert.deepEqual(M.validateScenario(s),[]);
 for(const old of [prior,merged]){const g=M.createGame(old);assert.deepEqual(M.restore(old,JSON.stringify(toLegacyGame(g))),g);assert.throws(()=>M.restore(s,JSON.stringify(g)),/Invalid campaign save/);}
});
test('normal route exactly restores the old entry items and peaks, not an all-passage union',()=>{assert.deepEqual(measure(s),measure(prior));assert.equal(Math.max(...measure(s).map(r=>r.entry)),17);assert.equal(Math.max(...measure(s).map(r=>r.peak)),29);assert.equal(Math.max(...measure(merged).map(r=>r.peak)),44);});
for(const width of [320,375,390])for(const mode of ['combine','drop','reverse-drop'])test(`Atlas ${width}/${mode}: full route, panel ownership, no increased carry overlap, save and Undo`,()=>{
 let g=M.createGame(s,width);for(const source of route){const a:Action=source.type==='combine'&&mode!=='combine'?{type:'drop',item:mode==='reverse-drop'&&!source.b.startsWith('@')?source.b:source.a,target:mode==='reverse-drop'&&!source.b.startsWith('@')?source.a:source.b}:source;const before=g;g=step(g,a);
  if(a.type==='advance'){for(const t of before.state.tokens){assert(M.token(g.state,t.id));if(M.token(g.state,t.id)!.location===t.location)assert.deepEqual(M.token(g.state,t.id),t);}assert.deepEqual(noMetrics(M.undo(g).game.state),noMetrics(before.state));assert.deepEqual(M.restore(s,JSON.stringify(toLegacyGame(g))).state,g.state);
   const area=(a:M.Token,b:M.Token)=>Math.max(0,96-Math.abs(a.x-b.x))*Math.max(0,(M.tokenHeight(s,a)+M.tokenHeight(s,b))/2-Math.abs(a.y-b.y));for(const t of g.state.tokens.filter(t=>M.token(before.state,t.id)&&M.token(before.state,t.id)!.location!==t.location))for(const b of g.state.tokens.filter(b=>b.id!==t.id&&b.location===t.location&&M.token(before.state,b.id))){const a0=M.token(before.state,t.id)!,b0=M.token(before.state,b.id)!;assert(area(t,b)<=(a0.location===b0.location?area(a0,b0):0)+.01);}}
  for(const t of g.state.tokens){assert(t.x>=48&&t.x<=g.state.width-48);assert(t.y-M.tokenHeight(s,t)/2>=0&&t.y+M.tokenHeight(s,t)/2<=844);}
 }assert(g.state.completed);assert.equal(g.state.locations.length,30);
});
test('all earned checkpoints and thirty-panel scrollback preserve surviving earlier arguments',()=>{for(const c of s.checkpoints!){const g=M.replay(s,c.actions,375);assert.deepEqual(M.restore(s,JSON.stringify(g)).state,g.state);}const g=M.replay(s,route,375),h=locationHarness(s,JSON.stringify({game:toLegacyGame(g),seen:[],tops:{}}),{width:375});for(const l of s.locationPlan!.locations)assert(h.app.innerHTML.includes(`data-background="${l.id}"`));for(const t of g.state.tokens)assert(h.thing(t.id));assert.match(h.app.innerHTML,/height:25320px/);});
test('four alternative legal preparation orders preserve all thirty desks and conclusions',()=>{const blocks:Action[][]=[[]];for(const a of route){if(a.type==='advance')blocks.push([]);else blocks.at(-1)!.push(a);}blocks.pop();for(const seed of [1,7,29,101]){let n=seed,g=M.createGame(s,375);const rand=()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;};for(const actions of blocks){let pending=[...actions];while(pending.length){const start=Math.floor(rand()*pending.length);let chosen=-1,next:M.Game|undefined;for(let i=0;i<pending.length;i++){const index=(start+i)%pending.length,r=M.applyAction(s,g,pending[index]);if(r.accepted){chosen=index;next=r.game;break;}}assert(chosen>=0);pending.splice(chosen,1);g=next!;}g=step(g,{type:'advance'});}assert(g.state.completed);assert.equal(g.state.locations.length,30);}});
