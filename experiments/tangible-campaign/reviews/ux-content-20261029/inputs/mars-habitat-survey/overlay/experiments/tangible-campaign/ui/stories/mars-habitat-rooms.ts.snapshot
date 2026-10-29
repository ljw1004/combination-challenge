import type {Action,Chapter,Scenario} from '../../schema/campaign.ts';
/** Apply after the frozen water/vestibule helper. The exterior artwork is a new
 * asset; every predecessor's indoor M02 artwork and saved identity remain intact. */
export function withMarsHabitatRooms(before:Scenario,id:string):Scenario{
 const s=structuredClone(before);s.id=id;
 const index=s.chapters.findIndex(c=>c.id==='habitat'),outside=s.chapters[index],indoorStock=new Set(['water-filter','seeds','planting-tray','clear-cover']);
 if(index<0||!s.locationPlan||!s.items.some(i=>i.id==='wet-seeds'))throw Error('Habitat rooms require the water/vestibule successor');
 const original=s.locationPlan.locations.find(l=>l.id==='M02')!;
 const inside={...structuredClone(original),label:'Habitat cabin',travelText:'Inside the surviving cabin, the water filter and planting supplies are ready.',hotspots:['warm-habitat'],stockBatches:original.stockBatches.map(b=>({...b,id:b.id.replace('@M02','@M02-cabin'),label:'Cabin water and planting supplies',narrative:'The surviving cabin stores hold the water filter, seeds, prepared planting tray and clear cover.',items:b.items.filter(i=>indoorStock.has(i))}))};
 inside.background.sceneBrief='Inside the surviving pressurized cabin: enclosed walls, a clear floor and a window onto Mars.';
 const entrance={...structuredClone(original),id:'M02-entrance',label:'Habitat entrance',travelText:'Outside the surviving cabin, the torn entrance and signal mast face the landing site.',hotspots:['sheltered-ice','refuge-contact-mast'],stockBatches:original.stockBatches.map(b=>({...b,id:b.id.replace('@M02','@M02-entrance'),label:'Entrance repair supplies',narrative:'The exterior repair locker holds the heater, fabric patching materials, hatch frame, tie downs and insulating blanket. The fixed enclosed melt station stands beside the nearby ice.',items:b.items.filter(i=>!indoorStock.has(i))})),background:{...structuredClone(original.background),stableKey:'M02-entrance',asset:'/assets/locations/M02-entrance.webp',sceneBrief:'An exterior mission habitat entrance on Martian ground, with a fixed sealed melt station beside sheltered exposed ice and an intact signal mast. The outer vestibule still needs repair, tie downs and insulation; no finished vestibule is pictured.'}};
 const waterGoals=outside.objectives.filter(o=>['habitat-goal-0','habitat-goal-1'].includes(o.id));
 const interior:Chapter={...structuredClone(outside),id:'habitat-seedlings',title:'Something living',location:{id:'M02',label:inside.label,travelText:inside.travelText},visitId:'M02-cabin-visit-1',objectives:waterGoals,motivation:'The cabin is still warm. I can filter the water we collected outside and start the seeds in their tray.',completionText:'The water is filtered and the seedlings have a warm, sheltered home.',entryCue:{...outside.entryCue!,id:`${id}:habitat-seedlings:entry-v1`,sourceCaption:inside.label,text:'The cabin is still warm. I can filter the water we collected outside and start the seeds in their tray.'},onAlreadyComplete:{mode:'skip'}};
 outside.location={id:entrance.id,label:entrance.label,travelText:entrance.travelText};outside.visitId='M02-entrance-visit-1';outside.objectives=[{id:'habitat-collect-water',kind:'create',item:'meltwater',text:'Collect water'},...outside.objectives.filter(o=>!waterGoals.includes(o))];
 outside.motivation='The cabin survived, but its outer entrance is torn. I need water from the ice, a secure entrance and a signal the missing crew can find.';outside.entryCue!.text=outside.motivation;outside.entryCue!.sourceCaption=entrance.label;outside.completionText='The water is collected, the entrance is secure and insulated, and our signal marks the refuge.';
 s.chapters.splice(index+1,0,interior);
 const locationIndex=s.locationPlan.locations.indexOf(original);s.locationPlan.locations.splice(locationIndex,1,entrance,inside);
 const visitIndex=s.locationPlan.visits.findIndex(v=>v.chapterIds.includes('habitat'));
 s.locationPlan.visits.splice(visitIndex,1,{...s.locationPlan.visits[visitIndex],id:outside.visitId,locationId:entrance.id,chapterIds:['habitat']},{id:interior.visitId!,locationId:inside.id,chapterIds:[interior.id]});
 for(const c of s.chapters){if(c.entryCue)c.entryCue.id=`${id}:${c.id}:entry-v1`;if(c.travel)c.travel.entryCue.id=`${id}:${c.travel.id}:entry-v1`;}
 const planting=new Set(['habitat-1-filtered-water','habitat-3-seed-tray','habitat-4-watered-seed-tray','habitat-5-sprouted-tray','habitat-6-propagator','habitat-cover-dry-tray','habitat-water-covered-tray','habitat-cover-watered-tray','habitat-germinate-covered-tray','habitat-wet-seeds','habitat-plant-wet-seeds']);
 const pair=(a:string,b:string)=>[a,b].sort().join('|');
 const insideAction=(a:Action)=>a.type==='combine'&&s.recipes.some(r=>planting.has(r.id)&&pair(r.a,r.b)===pair(a.a,a.b));
 const split=(actions:Action[])=>{
  let chapter=0,start=-1,end=-1;for(let i=0;i<actions.length;i++){if(chapter===index&&start<0)start=i;if(actions[i].type==='advance'){if(chapter===index){end=i;break;}chapter++;}}
  if(start<0||end<0)return actions;
  const work=actions.slice(start,end);return [...actions.slice(0,start),...work.filter(a=>!insideAction(a)),{type:'advance'} as Action,...work.filter(insideAction),...actions.slice(end)];
 };
 for(const cp of s.checkpoints??[]){cp.actions=split(cp.actions);const oldChapter=before.chapters.find(c=>cp.label.endsWith(c.title));if(oldChapter){const n=s.chapters.findIndex(c=>c.id===oldChapter.id);cp.label=`${n+1}. ${oldChapter.title}`;}}
 const complete=s.checkpoints?.find(c=>c.id==='complete');if(complete){let count=0,end=0;for(;end<complete.actions.length;end++)if(complete.actions[end].type==='advance'&&++count===index+1){end++;break;}s.checkpoints!.splice(index+1,0,{id:'chapter-habitat-seedlings',label:`${index+2}. ${interior.title}`,actions:complete.actions.slice(0,end)});}
 s.notes=[...(s.notes??[]),'29 October habitat boundary correction: exterior ice/entry/mast work is distinct from the surviving indoor cabin and planting supplies. The already-collected dirty water moves indoors; no vessel, recipe or supply is added. New exterior artwork uses M02-entrance.webp; old M02.webp remains the cabin.'];
 return s;
}
