import type {Action,Scenario} from '../../schema/campaign.ts';

/** Applied only to the unpublished persistent-location successor. Never mutate
 * the return-cargo predecessor: its old recipes, routes and saves remain exact. */
export function streamlineMarsObservations(s:Scenario):void {
 const retired=new Set(['scale-card','specimen-rack','core-rack','scaled-core','scaled-gravel-view']);
 const removedRecipes=new Set(['outcrop-12-core-rack','outcrop-13-scaled-core','contrast-scale']);
 s.items=s.items.filter(i=>!retired.has(i.id));
 s.recipes=s.recipes.filter(r=>!removedRecipes.has(r.id));
 const core=s.recipes.find(r=>r.id==='outcrop-14-core-profile')!;
 core.a='ice-core';
 core.description='Photograph the visible layers in the actual ice core. The photograph records their order, not calibrated dimensions, a shared age with another site, or evidence of life.';
 core.lifecycle={
  'ice-core':{role:'retain',reason:'Photographing the ice core does not consume the specimen; it stays at the outcrop unless deliberately moved.'},
  camera:{role:'retain',reason:'The camera records the core and remains available for other photographs.'},
 };
 // A supported camera retains the ordinary camera's useful photographic role.
 s.recipes.push({...structuredClone(core),id:'outcrop-core-photograph-field-camera',b:'field-camera',lifecycle:{
  'ice-core':structuredClone(core.lifecycle['ice-core']),
  'field-camera':{role:'retain',reason:'The camera on its tripod can photograph the core without losing its support or other uses.'},
 }});
 const pair=s.recipes.find(r=>r.id==='contrast-pair')!;
 pair.b='gravel-view';
 pair.description='Compare the two photographs: the gravel is rounded and embedded in rock, while a ripple pattern alone does not establish what formed it. No calibrated pebble dimensions are claimed.';
 delete pair.lifecycle!['scaled-gravel-view'];
 pair.lifecycle!['gravel-view']={role:'retain',reason:'The original gravel photograph stays available alongside the comparison; comparing pictures does not alter or scale it.'};
 const item=(id:string)=>s.items.find(i=>i.id===id)!;
 Object.assign(item('core-profile'),{label:'Core layer photograph',description:core.description});
 item('ripple-view').label='Ripple photograph';
 item('gravel-view').label='Gravel photograph';
 item('paired-terrain-views').label='Paired terrain photographs';
 // Keep the same earlier evidence identity and its two later narrative payoffs.
 const comparison=s.recipes.find(r=>r.id==='buried-story-11-layer-interpretation')!;
 comparison.description='The earlier photograph records layers in ice; the basin core records sediment at another site. Here, grain sizes differ between layers. Comparing these records does not establish a shared age or cause.';
 Object.assign(item('layer-interpretation'),{label:'Fine–coarse–fine layers',description:comparison.description});
 item('basin-field-record').reading!.text=item('basin-field-record').reading!.text.replace('saved ice profile','saved ice-core photograph');
 s.recipes.find(r=>r.id==='departure-6-complete-field-archive')!.description='Keep the earlier core layer photograph with the basin observations and the archived crew portrait.';
 for(const r of s.recipes)if(r.lifecycle?.['core-profile'])r.lifecycle['core-profile'].reason='The core layer photograph remains a reference for comparing sites and for the return archive.';
 const outcrop=s.chapters.find(c=>c.id==='outcrop')!;
 outcrop.objectives.find(o=>o.item==='core-profile')!.text='Photograph core layers';
 outcrop.entryCue!.text=`${outcrop.location.travelText}\n\nThe ice preserves its layers. I will photograph what is visible and keep it separate from what I only suspect.`;
 outcrop.motivation=outcrop.entryCue!.text;
 const contrast=s.chapters.find(c=>c.id==='contrast')!;
 contrast.objectives.unshift({id:'contrast-photographs',kind:'create',item:'paired-terrain-views',text:'Compare basin photographs',intermediate:true});
 const saved=contrast.objectives.find(o=>o.id==='contrast-sleeved-comparison')!;
 saved.text='Save basin comparison';saved.after=['contrast-photographs'];
 // No obsolete supply, hidden carry requirement or checkpoint may recreate a
 // removed processing stage. Filtering here affects this clone alone.
 s.initialItems=s.initialItems.filter(i=>!retired.has(i));
 for(const location of s.locationPlan!.locations)for(const batch of location.stockBatches){
  batch.items=batch.items.filter(i=>!retired.has(i));
  if(batch.id==='outcrop-cache@M03')batch.narrative='The cargo sled holds the scoop, jar, core tube and labels, with the handling enclosure and glove ports packed beside them.';
 }
 for(const visit of s.locationPlan!.visits)if(visit.carry)visit.carry=visit.carry.filter(i=>!retired.has(i));
 const rewrite=(a:Action):Action[]=>{
  if(a.type==='combine'){
   if([a.a,a.b].some(i=>i==='scale-card'||i==='specimen-rack'))return [];
   const replace=(i:string)=>i==='scaled-core'?'ice-core':i==='scaled-gravel-view'?'gravel-view':i;
   return [{...a,a:replace(a.a),b:replace(a.b)}];
  }
  return [a];
 };
 for(const c of s.chapters){if(c.carry)c.carry=c.carry.filter(i=>!retired.has(i));if(c.travel)c.travel.carry=c.travel.carry.filter(i=>!retired.has(i));}
 s.checkpoints=s.checkpoints?.map(c=>({...c,actions:c.actions.flatMap(rewrite)}));
 s.notes!.push('The unpublished location successor removes the scale-card and rack-mounting processing stages. Photograph the actual ice core, compare the existing gravel and ripple photographs directly, and preserve the evidence without claiming calibrated dimensions or life. All historical worlds remain unchanged.');
}
