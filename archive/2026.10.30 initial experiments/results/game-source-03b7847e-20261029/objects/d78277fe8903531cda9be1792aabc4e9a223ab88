import type {Action,Recipe,Scenario} from '../../schema/campaign.ts';
import {scenario as elementsBefore} from './elements-river-scenes.ts';
import {scenario as marsBefore} from './mars-field-scenes.ts';
import {scenario as atlasBefore} from './atlas-civilization-locations.ts';

/** Review candidate only. No catalogue, predecessor or shared-runtime mutation. */
const successor=(before:Scenario,id:string):Scenario=>{const s=structuredClone(before);s.id=id;for(const c of s.chapters){if(c.entryCue)c.entryCue.id=`${id}:${c.id}:entry-v1`;if(c.travel)c.travel.entryCue.id=`${id}:${c.travel.id}:entry-v1`;}return s;};
const item=(s:Scenario,id:string)=>s.items.find(i=>i.id===id)!;
const recipe=(s:Scenario,id:string)=>s.recipes.find(r=>r.id===id)!;
const pair=(a:string,b:string)=>[a,b].sort().join('|');
const retained=(reason:string)=>({role:'retain' as const,reason});
const incorporated=(reason:string)=>({role:'incorporate' as const,reason});
const transformed=(reason:string)=>({role:'transform' as const,reason});
function replaceOperand(r:Recipe,old:string,next:string,reason:string){if(r.a===old)r.a=next;if(r.b===old)r.b=next;const role=r.lifecycle![old].role;delete r.lifecycle![old];r.lifecycle![next]={role,reason};}

export const mars=successor(marsBefore,'mars-evidence-repairs-v7');
// Grain images supply layer order; the spectrum contributes its inconclusive
// result. A second site's photograph contributes nothing to this observation.
mars.recipes=mars.recipes.filter(r=>r.id!=='buried-story-11-layer-interpretation');
mars.items=mars.items.filter(i=>i.id!=='layer-interpretation');
const sediment='The basin grain images show a coarse band between two fine layers. Its mineral spectrum remains inconclusive: neither age nor transport agent is established.';
Object.assign(item(mars,'sediment-comparison'),{label:'Fine–coarse–fine; spectrum inconclusive',description:sediment,reading:{text:sediment,attribution:'Fictional expedition observations; not a real mission measurement.'}});
recipe(mars,'buried-story-10-sediment-comparison').description=sediment;
replaceOperand(recipe(mars,'buried-story-12-basin-field-record'),'layer-interpretation','sediment-comparison','The two basin observations are recorded together with the specimen identity; this does not use another site’s ice photograph.');
item(mars,'basin-field-record').reading!.text='At this core site, a coarse band separates two fine-grained layers. The mineral spectrum remains inconclusive. The specimen log connects these observations to the retained sediment. Age and transport agent remain unresolved; nearby exposures may help test a water-transport explanation.';
recipe(mars,'departure-6-complete-field-archive').lifecycle!['core-profile'].reason='The earlier ice-core photograph remains a separately identified record in the return archive.';
const rewriteMars=(a:Action):Action[]=>{
 if(a.type==='combine'&&pair(a.a,a.b)===pair('sediment-comparison','core-profile'))return [];
 if(a.type==='combine')return [{...a,a:a.a==='layer-interpretation'?'sediment-comparison':a.a,b:a.b==='layer-interpretation'?'sediment-comparison':a.b}];return[a];
};
for(const c of mars.checkpoints??[])c.actions=c.actions.flatMap(rewriteMars);
// Only the archive still needs the ice photograph. Do not haul it to the basin.
for(const v of mars.locationPlan!.visits)if(v.carry&&v.chapterIds.includes('buried-story'))v.carry=v.carry.filter(i=>i!=='core-profile'&&i!=='layer-interpretation');
mars.notes!.push('Separate authenticity candidate: remove the unrelated ice-photo gate from the basin observation while retaining that photograph and its return-archive use. Mounted-lamp identity repair is deliberately deferred pending a complete two-use state design.');

export const atlas=successor(atlasBefore,'atlas-selection-repairs-v5');
const conjunction='Offspring differ in heritable ways, and more are produced than the available resources can support. These premises alone do not establish which differences leave more descendants. That requires the next reproductive-outcome comparison. Darwin and Wallace’s use of population pressure is reconstructed here, not turned into a moral rule for human society.';
Object.assign(item(atlas,'struggle-for-existence'),{label:'Heritably varied offspring face limited resources',description:conjunction,reading:{...item(atlas,'struggle-for-existence').reading!,text:conjunction}});
recipe(atlas,'make-struggle-for-existence').description=conjunction;
atlas.notes!.push('Separate authenticity candidate: the selection bridge explicitly preserves both scarcity and inherited variation. Differential reproductive outcomes remain a separate next premise; no new cards or steps.');

export const elements=successor(elementsBefore,'elements-material-repairs-v5');
// The four-primitives, self-built world is preserved: no new stock or machinery
// hotspot. The press is a useful construction, not a grinding/filtering checklist.
Object.assign(item(elements,'seeds'),{label:'Oil-bearing seeds',description:'Oil-bearing seeds selected from the mature garden harvest; some are kept for planting and some can be pressed.'});
recipe(elements,'seeds').description='Select oil-bearing seeds from mature garden fruit and seedpods, keeping seed for another planting as well as pressing.';
elements.items.push({id:'seed-press',label:'Weighted seed press',description:'A wooden lever and draining bed use a heavy millstone as the weight. Crushing and pressing express oil from suitable seeds.',sources:['fao-oil-extraction']});
elements.recipes.push({id:'seed-press',a:'millstone',b:'planks',out:'seed-press',description:'Build a wooden lever and draining bed, using the heavy millstone as its pressing weight.',caveat:'Ordinary joinery and a seed-holding press bed are compressed into this construction. It is a hand-powered batch press, not the loose grinding stone acting alone.',sources:['fao-oil-extraction'],lifecycle:{millstone:incorporated('The heavy stone loads the wooden press; the grain mill may still need a separate millstone from the shared craft supply.'),planks:incorporated('Boards form the lever, frame and draining bed; other board-built objects use separate lengths from the stock.')}});
const oil=recipe(elements,'oil');replaceOperand(oil,'millstone','seed-press','The completed press crushes and expresses oil and remains usable equipment.');oil.lifecycle!['seed-press'].role='retain';oil.description='The weighted press crushes suitable oil-bearing seeds and expresses their oil into its collecting bed.';oil.sources=['fao-oil-extraction'];
Object.assign(item(elements,'wick'),{label:'Oil-soaked fiber wick',description:'A bundle of absorbent fibers charged with oil, ready to carry a small flame.'});
const torch=recipe(elements,'torch');replaceOperand(torch,'charcoal','wick','An oil-soaked fiber bundle is secured around the wooden head, supplying the portable flame rather than loose charcoal.');torch.description='Secure the oil-soaked fiber bundle around the end of the wooden support to make a small portable torch.';torch.caveat='Binding and ignition are ordinary assembly/use abstractions; this is not a burn-duration or safety claim.';
item(elements,'torch').label='Oil-wick torch';item(elements,'torch').description='An oil-soaked fiber head secured to a wooden support; a small portable flame, not loose charcoal balanced on timber.';
// Forming is useful for dry shaping. The existing kiln-and-glaze action, rather
// than a new firing chore, supplies the finished vessel for all wet consumers.
Object.assign(item(elements,'bowl'),{label:'Formed clay bowl',description:'A shaped, dried but unfired clay bowl. It is a dry forming surface, not a water-ready vessel.'});
recipe(elements,'bowl').description='Hand-shape the clay on the turning wooden disc and let the form stiffen for dry shaping work.';recipe(elements,'bowl').caveat='Hand shaping and drying are compressed; firing is not implied. Liquid service uses the later glazed, fired bowl.';
const glazed=recipe(elements,'glazed-bowl');glazed.description='At the kiln, coat and fire the formed bowl to make a water-ready glazed vessel.';glazed.lifecycle!['bowl']=transformed('The formed clay vessel is glazed and fired; a dry form remains only for distinct shaping work still needed.');
item(elements,'glazed-bowl').label='Fired glazed bowl';

const wetIds=['paint','pond-water','brine','oil-lamp'];
for(const id of wetIds)replaceOperand(recipe(elements,id),'bowl','glazed-bowl','The fired, glazed bowl supplies the liquid-holding vessel; an unfired clay form is not used for wet service.');
// This valid stronger-vessel route already exists; retire only the unfired one.
elements.recipes=elements.recipes.filter(r=>r.id!=='washstand');
// Basket and jar shaping necessarily precede kiln access; those outputs already
// exist before a fired bowl is available. No unreachable alternative is added.

for(const c of elements.chapters)for(const o of c.objectives)if(o.item==='glazed-bowl')o.text='Fire and glaze the bowl';
// The clear existing bottle permits a visible level comparison. No litres or
// millimetres of rainfall are claimed for its arbitrary neck/body geometry.
const measuring=recipe(elements,'measuring-jar');replaceOperand(measuring,'jar','glass-bottle','The clear glass vessel becomes the marked collector; its shape is not changed or silently replaced.');measuring.description='Mark a comparison strip on paper and fix it beside the clear bottle, leaving its water level visible.';
Object.assign(item(elements,'measuring-jar'),{label:'Clear collector with level marks',description:'A clear bottle beside a marked paper strip: the marks compare repeat fills of this same collector, not calibrated rainfall depth.',reading:{text:'Read the water level through the uncovered glass beside the marked strip. Compare this same vessel over equal collection intervals, emptying it between readings. Its narrow mouth and shaped body mean the marks are not millimetres of rainfall or equal-volume graduations.',attribution:'Authored relative-comparison instrument, not a calibrated meteorological rain gauge.'}});
Object.assign(item(elements,'rain-gauge'),{label:'Collected rain level',description:'Rain collected in the clear marked bottle, ready to compare with another equal-duration collection in the same vessel.'});
recipe(elements,'rain-gauge').description='Set the open marked collector in the rain for a collection interval and read its visible fill level.';
for(const c of elements.chapters)for(const o of c.objectives)if(o.item==='rain-gauge')o.text='Compare collected rain';
const mill=elements.chapters.find(c=>c.id==='mill')!;
mill.objectives.push({id:'mill-seed-oil',kind:'create',item:'oil',text:'Press seed oil'});
mill.entryCue!.text='At the bend, the stream keeps doing work whether anyone watches or not. Grinding can help with grain; pressing the garden’s oil-bearing seeds can give us fuel for light.';mill.motivation=mill.entryCue!.text;
elements.sources!.push({id:'fao-oil-extraction',title:'FAO: Principles of oil extraction',url:'https://www.fao.org/4/X5043E/x5043E03.htm',note:'Distinguishes crushing from expression; the authored press supplies pressure and drainage, without an industrial refining chain.'},{id:'metoffice-rain-reading',title:'Met Office: Make your own rain gauge',url:'https://weather.metoffice.gov.uk/learn-about/met-office-for-schools/other-content/other-resources/weather-station/rain-gauge',note:'Supports a transparent vessel with a visible external scale. This candidate deliberately claims only relative fill levels, not calibrated rainfall depth.'});
measuring.sources=['metoffice-rain-reading'];
const wetPairs=new Map(wetIds.map(id=>{const before=recipe(elementsBefore,id);return[pair(before.a,before.b),id];}));
function rewriteElements(actions:Action[]):Action[]{let chapter=0;const out:Action[]=[];for(const a of actions){
 if(a.type==='combine'){
  const p=pair(a.a,a.b);
  // Build the press and make the oil-wick head at the first lighting use. The
  // charcoal work moves to its first real use: ink at the message landing.
  if(p===pair('wood','kiln')&&elements.chapters[chapter]?.id==='harbour')continue;
  if(p===pair('charcoal','water'))out.push({type:'combine',a:'wood',b:'kiln'});
  if(p===pair('charcoal','wood')){out.push({type:'combine',a:'fiber',b:'oil'},{type:'combine',a:'wick',b:'wood'});continue;}
  if(p===pair('plant','fruit')&&elements.chapters[chapter]?.id==='garden')continue;
  if(p===pair('seeds','millstone'))continue;
  if(p===pair('fiber','oil')&&elements.chapters[chapter]?.id==='lanterns')continue;
  if(p===pair('jar','paper')){out.push({type:'combine',a:'glass',b:'air'},{type:'combine',a:'glass-bottle',b:'paper'});continue;}
  if(wetPairs.has(p)||p===pair('bowl','table')){out.push({...a,a:a.a==='bowl'?'glazed-bowl':a.a,b:a.b==='bowl'?'glazed-bowl':a.b});continue;}
 }
 if(a.type==='advance'&&elements.chapters[chapter]?.id==='mill')out.push({type:'combine',a:'plant',b:'fruit'},{type:'combine',a:'millstone',b:'planks'},{type:'combine',a:'seeds',b:'seed-press'});
 out.push(a);if(a.type==='advance')chapter++;
}return out;}
for(const c of elements.checkpoints??[])c.actions=rewriteElements(c.actions);
elements.notes!.push('Separate authenticity review candidate: a player-built weighted press, visible oilseeds and oil-wick torch; distinguish formed clay from the already-existing fired glazed bowl; use clear glass and honest relative rain levels. Four opening primitives, every location and stock batch stay unchanged. No checklist, calibration or new delivery.');
export const authenticitySuccessors=[mars,atlas,elements];
