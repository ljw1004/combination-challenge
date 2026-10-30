import type {Action,Recipe,Scenario} from '../../schema/campaign.ts';

/** Content-only, composable successor patch. Call before broad editorial passes.
 * It never mutates its input, old saves, the catalogue, engine or controller. */
export function withMarsWaterAndVestibule(before:Scenario,id:string):Scenario{
 const s=structuredClone(before);s.id=id;
 const item=(id:string)=>{const found=s.items.find(i=>i.id===id);if(!found)throw Error(`Mars water/vestibule patch: missing item ${id}`);return found;};
 const recipe=(id:string)=>{const found=s.recipes.find(r=>r.id===id);if(!found)throw Error(`Mars water/vestibule patch: missing recipe ${id}`);return found;};
 const pair=(a:string,b:string)=>[a,b].sort().join('|');
 const removed=new Set(['empty-canister','water-canister']);
 const map=(id:string)=>id==='water-canister'?'filtered-water':id;
 const mapList=(ids:string[])=>[...new Set(ids.filter(i=>i!=='empty-canister').map(map))];
 for(const c of s.chapters){if(c.entryCue)c.entryCue.id=`${id}:${c.id}:entry-v1`;if(c.travel)c.travel.entryCue.id=`${id}:${c.travel.id}:entry-v1`;}
 // Portable water already exists before the empty-canister action. Keep that
 // abstraction consistent, rather than inventing another mandatory vessel.
 item('meltwater').label='Dirty water';item('meltwater').description='Water collected from the ice. It still needs filtering.';
 item('filtered-water').label='Water';item('filtered-water').description='The filtered water supply, ready for the seeds and the later pump loop.';
 s.items=s.items.filter(i=>!removed.has(i.id));
 s.recipes=s.recipes.filter(r=>r.id!=='habitat-2-water-canister');
 for(const r of s.recipes)if([r.a,r.b].includes('water-canister')){
  r.a=map(r.a);r.b=map(r.b);delete r.lifecycle!['water-canister'];
  r.lifecycle!['filtered-water']={role:'retain',reason:'Only part of the water supply is used. The remaining water stays available for planting and the later pump loop.'};
 }
 recipe('habitat-0-meltwater').description='Use the solar charger to power the melt station and collect dirty water from the ice.';
 recipe('habitat-meltwater-heater').description='Use the heater at the melt station to collect dirty water from the ice.';
 recipe('habitat-1-filtered-water').description='Filter the dirty water.';
 recipe('habitat-1-filtered-water').lifecycle!['meltwater']={role:'transform',exclusive:true,reason:'This same water is filtered; no separate dirty batch remains.'};
 recipe('habitat-4-watered-seed-tray').description='Water the seeds in their tray.';
 recipe('habitat-water-covered-tray').description='Lift the cover, water the seeds, and replace the same cover.';
 recipe('waterworks-prime').description='Fill the pump loop’s priming reservoir with some of the water brought from the habitat.';
 item('primed-water-loop').description='The same pump and return hose, with water in the priming reservoir.';
 item('circulating-water-loop').description='The pump and return hose are connected. The dry loop needs water before it can circulate the tank supply.';
 for(const c of s.chapters){
  if(c.carry)c.carry=mapList(c.carry);if(c.travel)c.travel.carry=mapList(c.travel.carry);
  for(const b of c.caches??[])b.items=mapList(b.items);
  for(const o of c.objectives)if(o.item==='water-canister'){o.item='filtered-water';o.text='Filter water';}
 }
 s.initialItems=mapList(s.initialItems);
 for(const l of s.locationPlan?.locations??[])for(const b of l.stockBatches)b.items=mapList(b.items);
 for(const v of s.locationPlan?.visits??[]){if(v.carry)v.carry=mapList(v.carry);if(v.carryAlong)v.carryAlong=mapList(v.carryAlong);}
 for(const c of s.checkpoints??[])c.actions=c.actions.flatMap((a):Action[]=>{
  if(a.type==='combine'&&pair(a.a,a.b)===pair('filtered-water','empty-canister'))return [];
  if(a.type==='combine')return [{...a,a:map(a.a),b:map(a.b)}];
  if(a.type==='drop')return [{...a,item:map(a.item),target:map(a.target)}];
  if(a.type==='place'||a.type==='move'||a.type==='relocate')return [{...a,item:map(a.item)}];
  if(a.type==='visit'&&a.carry)return [{...a,carry:mapList(a.carry)}];return [a];
 });
 const habitat=s.chapters.find(c=>c.id==='habitat')!;
 habitat.completionText='The entry is secure and insulated, the water is filtered, and the seedlings have a sheltered home. Our signal marks a refuge, not a crash site.';

 // Water can meet seeds before the tray. This is one optional preparation
 // order, not a new stock item or a hidden third-ingredient recipe.
 s.items.push({id:'wet-seeds',label:'Wet seeds',description:'The same seeds, moistened with water and ready for the planting tray. They have not sprouted.'});
 for(const input of ['seeds','planting-tray'])recipe('habitat-3-seed-tray').lifecycle![input].exclusive=true;
 recipe('habitat-3-seed-tray').lifecycle!['seeds'].reason='These seeds are planted in the one tray. They do not remain loose for an alternative watering order.';
 recipe('habitat-3-seed-tray').lifecycle!['planting-tray'].reason='The one planting tray now holds the seeds; there is no spare tray for another preparation order.';
 s.recipes.push({id:'habitat-wet-seeds',a:'filtered-water',b:'seeds',out:'wet-seeds',description:'Moisten the seeds before planting them.',lifecycle:{'filtered-water':{role:'retain',reason:'Some water moistens the seeds; the remaining supply is still available.'},seeds:{role:'transform',exclusive:true,reason:'These same seeds become wet, without creating a plant or a tray.'}}},
 {id:'habitat-plant-wet-seeds',a:'wet-seeds',b:'planting-tray',out:'watered-seed-tray',description:'Plant the wet seeds in the prepared tray.',lifecycle:{'wet-seeds':{role:'incorporate',exclusive:true,reason:'The same wet seeds are planted in this one tray; no loose duplicate remains.'},'planting-tray':{role:'transform',exclusive:true,reason:'The same planting tray now holds the moistened seeds, matching the plant-first route.'}}});

 // Either independent finishing job may come first. The additional state is
 // the actual wrapped-but-unsecured structure, never a second vestibule.
 s.items.push({id:'wrapped-vestibule',label:'Wrapped vestibule',description:'The vestibule has its insulating blanket. It still needs tie downs.'});
 item('anchored-vestibule').label='Secured vestibule';
 item('anchored-vestibule').description='The vestibule is tied down. It still needs its insulating blanket.';
 item('insulated-vestibule').label='Insulated vestibule';
 item('insulated-vestibule').description='The same vestibule, tied down and wrapped in its insulating blanket.';
 habitat.objectives.find(o=>o.item==='insulated-vestibule')!.text='Secure and insulate vestibule';
 const assemble=recipe('habitat-9-vestibule');assemble.preserve=['sealed-panel','hatch-frame'];
 for(const input of ['sealed-panel','hatch-frame'])assemble.lifecycle![input].exclusive=true;
 const finish=(r:Recipe,structure:string,part:string)=>{
  r.preserve=[structure,part];
  r.lifecycle={[structure]:{role:'transform',exclusive:true,reason:'This same vestibule is upgraded in place, preserving all previously fitted pieces. No earlier assembly remains.'},[part]:{role:'incorporate',exclusive:true,reason:'This one part is fitted to the vestibule; it is not spare stock for the alternative finishing order.'}};
 };
 const anchor=recipe('habitat-10-anchored-vestibule');finish(anchor,'vestibule','tie-downs');anchor.description='Secure the vestibule with the tie downs.';
 const insulate=recipe('habitat-11-insulated-vestibule');finish(insulate,'anchored-vestibule','insulating-blanket');insulate.description='Wrap the secured vestibule in the insulating blanket.';
 const wrap:Recipe={id:'habitat-wrap-vestibule',a:'vestibule',b:'insulating-blanket',out:'wrapped-vestibule',description:'Wrap the vestibule in its insulating blanket. The tie downs can go on next.'};finish(wrap,'vestibule','insulating-blanket');
 const tie:Recipe={id:'habitat-secure-wrapped-vestibule',a:'wrapped-vestibule',b:'tie-downs',out:'insulated-vestibule',description:'Secure the wrapped vestibule with the tie downs.'};finish(tie,'wrapped-vestibule','tie-downs');s.recipes.push(wrap,tie);
 s.notes=[...(s.notes??[]),'29 October playtest: Dirty water filters into Water directly. Remove the empty-canister/fill wrapper; water serves both seed preparation orders and the existing later pump-loop priming use. Wet seeds are an optional state of the original seeds, not another stock item or plant. Tie downs and insulating blanket can be fitted in either order, preserving the same vestibule and fitted pieces. No runtime, location or artwork change.'];
 return s;
}
