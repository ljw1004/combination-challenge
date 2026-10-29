/** Logical, normal authored-route measurement, not exhaustive exploration or UI QA. */
import {readFileSync,writeFileSync} from 'node:fs';
import type {Action,Scenario} from '../../schema/campaign.ts';
import * as M from '../../engine/campaign.ts';
import {applyMilestones} from '../../ui/current-campaign.ts';
import * as before from '../../ui/pre-location-scenarios.ts';
import * as current from '../../ui/current-scenarios.ts';
import {scenario as opening} from '../../ui/stories/elements-small-scenes.ts';
const route=(s:Scenario):Action[]=>s.id.startsWith('atlas-')?JSON.parse(readFileSync(new URL('../../evidence/intellectual-worlds-20261028/atlas-author-route.json',import.meta.url),'utf8')).actionsLog.map((a:any)=>a.type==='place'?{...a,hotspot:a.location,location:undefined}:a):s.id.startsWith('copy-')?s.checkpoints!.at(-1)!.actions.concat([{type:'combine',a:'master',b:'@window'},{type:'combine',a:'reverse',b:'stock'},{type:'place',item:'block-reflected',hotspot:'printer-chest'},{type:'advance'}]):s.checkpoints!.at(-1)!.actions;
const measure=(source:Scenario)=>{
 const s=applyMilestones(source),actions=route(s);let g=M.createGame(s,375);
 const rows:{chapter:string;location:string;entry:number;peak:number;hotspots:number;entryItems:string[]}[]=[];
 for(const [index,a]of actions.entries()){
  const things=g.state.tokens.filter(t=>t.location===(g.state.storyLocation??g.state.currentLocation));
  const row=rows[g.state.chapter]??={chapter:s.chapters[g.state.chapter].id,location:g.state.storyLocation??g.state.currentLocation,entry:things.length,peak:0,hotspots:g.state.hotspots.filter(h=>h.location===g.state.currentLocation).length,entryItems:things.map(t=>t.kind)};
  row.peak=Math.max(row.peak,things.length);
  const r=M.applyAction(s,g,a);if(!r.accepted)throw Error(`${s.id} action ${index}: ${r.message}`);g=r.game;
 }
 return {id:s.id,completed:g.state.completed,actions:actions.length,rows};
};
const worlds=[...before.integratedScenarios,...before.optionalIntellectualScenarios,...current.integratedScenarios,...current.optionalIntellectualScenarios,opening].map(measure);
writeFileSync(new URL('./canonical-cadence.json',import.meta.url),JSON.stringify({measurement:'Current canonical engine; normal authored complete checkpoint route, not all available optional recipes. Surviving local thing tokens at entry and peak; hotspots reported separately. No browser/native/human validation.',worlds},null,2)+'\n');
console.log(worlds.map(w=>({id:w.id,completed:w.completed,chapters:w.rows.length,entryRange:[Math.min(...w.rows.map(r=>r.entry)),Math.max(...w.rows.map(r=>r.entry))],peak:Math.max(...w.rows.map(r=>r.peak))})));
