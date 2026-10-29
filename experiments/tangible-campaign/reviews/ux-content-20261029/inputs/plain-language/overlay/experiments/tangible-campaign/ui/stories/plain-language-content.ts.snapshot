import type {Scenario} from '../../schema/campaign.ts';
import {plainLanguageData} from './plain-language-data.ts';

/** Explicit opt-in editorial overlay. Never applied to the archived catalogue.
 * IDs, input lifecycles, recipes, objective requirements, stock, carry and save identities
 * are untouched. The caller owns any distinct successor registration. */
export type PlainLanguageFamily='mars'|'atlas'|'elements'|'kitchen'|'copy'|'divinity'|'light'|'creature';
type ChapterProse={text:string;contextHeading:string|null};
type ExplanationMilestone=NonNullable<Scenario['milestones']>[number]&{presentation?:'explanation'|'celebration'};
type ContextItem=Scenario['items'][number]&{labelByLocation?:Record<string,string>};
const data=plainLanguageData as unknown as {
 objectives:Record<string,Record<string,string>>;
 items:Record<string,Record<string,string>>;
 chapters:Record<string,Record<string,ChapterProse>>;
 atlasSessions:Record<string,ChapterProse>;
 wonderTexts:Record<string,Record<string,string>>;
 wonderItems:Record<string,string[]>;
 existingMilestones:Record<string,Record<string,{title:string;text:string}>>;
 endings:Record<string,Record<string,string>>;
 bridges:Record<string,Record<string,string>>;
};
const replaceText=(s:Scenario,id:string,text:string)=>{const i=s.items.find(i=>i.id===id);if(!i)return;i.description=text;if(i.reading)i.reading.text=text;};
const setCue=(s:Scenario,id:string,text:string,contextHeading:string|null=null)=>{
 const c=s.chapters.find(c=>c.id===id);if(!c)return;
 c.motivation=text;
 if(c.entryCue){const cue={...c.entryCue,text} as typeof c.entryCue&{contextHeading?:string};delete cue.contextHeading;if(contextHeading)cue.contextHeading=contextHeading;c.entryCue=cue;}
};

export function withPlainLanguage(before:Scenario,family:PlainLanguageFamily):Scenario{
 const s=structuredClone(before),key=family==='creature'?'mars':family;
 for(const [id,text]of Object.entries(data.items[key]??{}))replaceText(s,id,text);
 const chapterTexts=key==='atlas'&&s.chapters.some(c=>c.id.includes('-session-'))?data.atlasSessions:data.chapters[key]??{};
 for(const [id,p]of Object.entries(chapterTexts))setCue(s,id,p.text,p.contextHeading);
 for(const c of s.chapters){
  for(const o of c.objectives){const text=o.item&&data.objectives[key]?.[o.item];if(text)o.text=text;}
  const ending=data.endings[key]?.[c.id];if(ending)c.completionText=ending;
  const bridge=data.bridges[key]?.[c.id];if(bridge&&c.onAlreadyComplete?.mode==='bridge')c.onAlreadyComplete.text=bridge;
 }
 for(const m of s.milestones??[]){
  const prose=data.existingMilestones[key]?.[m.id];if(prose)Object.assign(m,prose);
 }
 // Every educational wonder names a real created output, never a primitive.
 // Existing IDs, predicates, capabilities and artwork are retained unchanged.
 const selected=new Set(data.wonderItems[key]??[]),outputs=new Set(s.recipes.flatMap(r=>r.out?[r.out]:[]));
 for(const itemId of selected){
  if(!outputs.has(itemId))continue;
  const item=s.items.find(i=>i.id===itemId);if(!item)continue;
  const text=data.wonderTexts[key]?.[itemId]??item.reading?.text??item.description;
  if(!text?.trim())throw Error(`Missing explanation for ${s.id}/${itemId}`);
  const existing=s.milestones?.find(m=>m.item===itemId);
  if(existing){Object.assign(existing,{title:item.label,text,presentation:'explanation'});}
  else(s.milestones??=[]).push({id:`plain-${key}-${itemId}`,item:itemId,when:'created',title:item.label,text,presentation:'explanation'} as ExplanationMilestone);
 }
 // New physical successors compose first; do not overwrite their changed
 // object meanings with wording from the old source's canister/map chain.
 if(key==='mars'&&s.items.some(i=>i.id==='wet-seeds')){
  replaceText(s,'wet-seeds','The seeds have received water and are ready to be planted in the prepared tray. They have not yet sprouted.');
  replaceText(s,'wrapped-vestibule','The outer entrance has its insulating covering, but is not yet secured to its anchors. The inner cabin supplies pressure and life support.');
 }
 if(key==='mars'&&s.chapters.some(c=>c.id==='habitat-seedlings')){
  setCue(s,'habitat','The inner cabin survived, but its outer entrance is torn. Outside, I need to collect water from the ice, secure and insulate the entrance, and leave a signal the missing crew can find.');
  setCue(s,'habitat-seedlings','Inside, the cabin is still warm and pressurized. I can filter the water collected outside and plant the seeds in their prepared tray.');
 }
 if(key==='mars'&&!s.items.some(i=>i.id==='survey-map')){
  replaceText(s,'terrain-sheet','The expedition’s regional map shows known mission sites, including the ice outcrop, weather station, relay and depot. It does not show every local obstacle.');
  replaceText(s,'panorama','The photograph shows the visible outcrop and landmarks between it and the landed sled. It helps locate an approach on the map without proving that all the ground is safe.');
  replaceText(s,'bearing-map','The expedition map now marks the starting point and approach to the visible ice outcrop. It remains the same regional map for later travel.');
  replaceText(s,'weather-record','The station record shows an interval of improved local visibility. It does not guarantee the weather later in the journey.');
  replaceText(s,'rescue-route','The crew’s reported landmark has been matched to the regional map. These directions can be loaded into the rover to reach their stranded crawler.');
  replaceText(s,'cliff-photograph','An optional photograph of the visible cliff and its layers. It does not establish a passable route, buried ice quantities or the history of another site.');
  setCue(s,'rover','The regional map already shows the ice outcrop and the stations beyond it. From the landed sled, I can match the visible landmarks to the map and prepare the rover to follow the approach.');
  setCue(s,'relay','The relay mast reaches beyond the ridge. I need to contact the missing crew, locate their reported landmark and load the directions into the rover.');
 }
 if(key==='elements'&&s.items.some(i=>i.id==='water-lifting-wheel')){
  replaceText(s,'water-lifting-wheel','Jars fixed around the waterwheel scoop water from the stream and tip it into a raised basin as the current turns the wheel.');
  setCue(s,'waterworks','The stream is below the growing beds. Use the current to lift water into a raised basin, then bring it to the garden without carrying every bucket uphill.');
 }
 if(key==='divinity'){
  const sessions:Record<string,{label:string;time:string;text:string}>={
   'divinity-augustine-study':{label:'Augustine’s study',time:'Daytime',text:'The study table holds the wound and meal examples alongside Augustine’s account of evil.'},
   'divinity-grace-alcove':{label:'Augustine’s study — evening',time:'Evening',text:'It is evening. The table has been cleared for a new session on God’s grace, with the promise and infant cases laid out. Earlier work remains available in the previous session.'},
   'divinity-medieval-disputation-desk':{label:'Medieval manuscript study',time:'Daytime',text:'The study opens a medieval argument about the sources of good and evil, with Augustine’s earlier conclusion available for comparison.'},
   'divinity-cause-comparison-bench':{label:'Manuscript study — next morning',time:'Next morning',text:'The next morning, the cleared table is ready for Aquinas’s fire example and the earlier question about a creator’s responsibility.'},
   'divinity-trinity-lectern':{label:'Manuscript study — evening',time:'Evening',text:'It is evening. Relationship examples and Trinity texts are laid out for another study session.'},
   'divinity-ritual-comparison-room':{label:'Ritual study',time:'Daytime',text:'A new study session examines the separate Lyon ritual manuscript and the physical actions it describes.'},
   'divinity-baptism-bench':{label:'Ritual study — next morning',time:'Next morning',text:'The next morning, the cleared table holds the tool example and Aquinas’s account of baptism.'},
   'divinity-eucharist-table':{label:'Ritual study — evening',time:'Evening',text:'It is evening. The table is cleared for the bread case and Aquinas’s different account of Communion.'},
   'divinity-reformation-print-table':{label:'Wittenberg printshop',time:'1517 texts',text:'The printshop study compares Luther’s 1517 claims with a household that has one coin and no supper.'},
   'divinity-liberty-bench':{label:'Wittenberg study — later session',time:'1520 texts',text:'A later study session opens Luther’s 1520 argument about faith and service. The earlier work remains available rather than being erased.'},
   'divinity-confessions-table':{label:'Marburg records',time:'1529',text:'A study session compares the Marburg writings and signed articles, keeping agreement and disagreement separate.'},
   'divinity-trent-decree-desk':{label:'Trent records — later session',time:'1547',text:'A later study session examines Trent’s 1547 decree. Earlier Marburg texts remain available for comparison.'},
   'divinity-prayer-and-provenance-bench':{label:'Reformation study',time:'1543–1559 texts',text:'The study compares Calvin’s writings with distinct prayer, painting and bone-fragment cases.'},
   'divinity-reply-records-desk':{label:'Reformation study — next day',time:'Next day; 1563 replies',text:'The next day, the cleared table holds Trent’s 1563 replies and a new record about the fragment.'},
  };
  for(const l of s.locationPlan?.locations??[]){const p=sessions[l.id];if(!p)continue;l.label=p.label;l.travelText=p.text;l.timeLabel=p.time;l.background.sceneBrief=p.text;for(const b of l.stockBatches)b.narrative='The texts and cases for this study session are laid out together. Earlier work remains available in its previous session.';}
  for(const c of s.chapters){const p=sessions[c.location.id];if(p)c.location={...c.location,label:p.label,travelText:p.text};}
  // Only the two Augustine-home locations omit this explicit prefix. Underlying
  // labels and all later mixed-thinker contexts retain the full attribution.
  const homes=['divinity-augustine-study','divinity-grace-alcove'];
  for(const i of s.items as ContextItem[]){if(!i.label.startsWith('Augustine:'))continue;i.labelByLocation={...i.labelByLocation};for(const location of homes)i.labelByLocation[location]=i.label.slice('Augustine:'.length).trimStart();}
 }
 if(family==='creature'){
  replaceText(s,'core-tube','The sealed sampling tube has a clear liner and a protective sleeve. Its mission connections keep the collected core protected without opening it.');
  replaceText(s,'ice-core','The original ice core remains inside its sealed tube and protective sleeve. It travels with the expedition for closer examination.');
  replaceText(s,'creature-core','A small body with jointed limbs is visible inside the original sealed ice core. The tube has not been opened. Its age, origin and whether it is alive remain unknown.');
  replaceText(s,'return-capsule','The mission return capsule has a protected bay for the sealed ice-core tube and separate compartments for the other specimens and records.');
  replaceText(s,'sleeved-comparison','The photographs and diagram keep the ripple and gravel sites separate. The gravel within its surrounding rock layers supports an ancient-water explanation more strongly than the ripple shape alone. The layers’ age remains unknown.');
  setCue(s,'outcrop','The route passes exposed ice. I will keep a core in its sealed protective tube so that we can examine it at the field laboratory.');
  setCue(s,'buried-story','The field microscope is ready. I can examine the protected ice core brought from the outcrop, then collect and record the separate sediment layers in this basin.');
  setCue(s,'departure','The crew is ready to leave. I will pack the creature’s sealed core, preserve its records and the crew portrait, and leave the camp ready for whoever comes next.');
  setCue(s,'homebound','The return meeting is agreed. I will bring the crew and the protected core aboard the return vehicle, then meet the orbiter.');
  const last=s.chapters.find(c=>c.id==='homebound');if(last){last.completionText='The crew is safely aboard the orbiter. The creature remains in its original sealed core inside the docked ship, beside the records and our table portrait. Its age, origin and whether it is alive remain unknown.';if(last.onAlreadyComplete?.mode==='bridge')last.onAlreadyComplete.text=last.completionText;}
  const m=s.milestones?.find(m=>m.id==='mars-ice-creature');if(m){m.title='Creature in ice';m.text='A small body with jointed limbs is visible inside the ice core collected earlier. The specimen and its sealed tube are the same objects we brought here. Its age, origin and whether it is alive are still unknown.';}
 }
 return s;
}
