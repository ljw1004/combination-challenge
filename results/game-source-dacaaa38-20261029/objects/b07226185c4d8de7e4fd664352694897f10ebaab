/** Run with F780_SOURCE pointing at the preserved source checkout. Normal route,
 * not exhaustive optional exploration and not visual/human-playtest evidence. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {scenario as prior} from '../../ui/stories/divinity-disputed-questions.ts';
import {scenario as candidate} from '../../ui/stories/divinity-reading-scenes.ts';
import {divinityLocations as merged} from '../../ui/stories/intellectual-locations.ts';
import {applyMilestones} from '../../ui/current-campaign.ts';
import {toLegacyScenario} from '../../compatibility/v1.ts';
import * as M from '../../engine/campaign.ts';
const root=process.env.F780_SOURCE;if(!root)throw Error('Set F780_SOURCE to the preserved pre-consolidation source checkout.');
const load=(path:string)=>import(pathToFileURL(root+'/experiments/tangible-campaign/'+path).href);
const {scenario:old}=await load('ui/campaigns/divinity-disputed-questions.ts'),{applyMilestones:oldApply}=await load('ui/campaign-milestones.ts'),oldM=await load('engine/model.ts');
const exact=oldApply(old);assert.deepEqual(toLegacyScenario(applyMilestones(prior)),exact);
const hash=(x:unknown)=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
function measure(s:any,engine:any,legacy=false){let g=engine.createGame(s,375);const rows:{chapter:string;entry:number;peak:number;items:string[]}[]=[];for(const a of s.checkpoints.at(-1).actions){const current=legacy?g.state.storyArea??g.state.currentArea:g.state.storyLocation??g.state.currentLocation,things=g.state.tokens.filter((t:any)=>(legacy?t.area:t.location)===current),index=g.state[legacy?'stage':'chapter'],row=rows[index]??={chapter:s[legacy?'stages':'chapters'][index].id,entry:things.length,peak:0,items:things.map((t:any)=>t.kind).sort()};row.peak=Math.max(row.peak,things.length);const r=engine.applyAction(s,g,a);assert(r.accepted,r.message);g=r.game;}return{id:s.id,completed:g.state.completed,rows};}
const worlds=[measure(exact,oldM,true),measure(prior,M),measure(merged,M),measure(candidate,M)];assert.deepEqual(worlds[0].rows,worlds[1].rows);assert.deepEqual(worlds[0].rows,worlds[3].rows);
const result={sourceSite:'f780990cdff4557aeb46dcbf7d0d622e9f6310e2',sourceSeal:'5fa645e9b527bdb5df228a681a8d9bf907e7c1e4a31523736e7186cd0aa30fe6',exactScenarioEqualAfterTerminologyConversion:true,scenarioSha256:hash(exact),routeSha256:hash(exact.checkpoints.at(-1).actions),routeActions:87,measurement:'Surviving local thing tokens on normal authored complete route. Old source replays in its actual old engine, plus retained predecessor, merged current and new desks in current engine. Not optional closure or visual/human playtest evidence.',worlds};
writeFileSync(new URL('./exact-canonical-cadence.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(worlds.map(w=>[w.id,w.completed,w.rows.map(r=>[r.entry,r.peak])]));
