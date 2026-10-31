import type {Scenario} from './campaign.ts';
/** Declarative successor validation, deliberately separate from legacy snapshots. */
export function validateLocationPlan(s:Scenario):string[]{
 const p=s.locationPlan;if(!p)return [];
 const errors:string[]=[],bad=(text:string)=>errors.push('Location plan: '+text);
 const unique=(ids:string[])=>new Set(ids).size===ids.length;
 if(p.panel?.width!==390||p.panel?.height!==844)bad('fixed panel reference must be 390 × 844');
 if(!Array.isArray(p.locations)||!Array.isArray(p.visits))return [...errors,'Location plan: locations and visits must be arrays'];
 if(!unique(p.locations.map(l=>l.id))||!unique(p.visits.map(v=>v.id)))bad('duplicate location or visit');
 const items=new Set(s.items.map(i=>i.id)),hotspots=new Set(s.hotspots.map(h=>h.id)),sources=new Set<string>(),stockIds=new Set<string>(),revealed=new Set<string>();
 for(const l of p.locations){
  if(!l.id||!l.label||!l.travelText||!l.background?.stableKey||!l.background.sceneBrief)bad('incomplete location '+l.id);
  if(l.background?.asset&&!/^\/?assets\/locations\/[a-zA-Z0-9._-]+\.(png|webp|jpg)$/.test(l.background.asset))bad('unsafe asset path '+l.id);
  for(const h of l.hotspots??[]){if(!hotspots.has(h)||revealed.has(h))bad('unknown or multiply owned hotspot '+h);revealed.add(h);}
  for(const batch of l.stockBatches??[]){if(!batch.id||stockIds.has(batch.id)||!batch.label||!batch.narrative||!batch.items.length)bad('invalid stock batch '+batch.id);stockIds.add(batch.id);for(const k of batch.items){if(!items.has(k)||sources.has(k))bad('unknown or duplicate ordinary stock '+k);sources.add(k);}}
 }
 const chapterIds=s.chapters.map(ch=>ch.id),covered:string[]=[],cueIds:string[]=[];
 for(const v of p.visits){
  if(!p.locations.some(l=>l.id===v.locationId)||!v.chapterIds.length)bad('invalid visit '+v.id);
  const positions=v.chapterIds.map(id=>chapterIds.indexOf(id));
  if(positions.some((n,i)=>n<0||i>0&&n!==positions[i-1]+1))bad('visit chapters must be contiguous '+v.id);
  for(const id of v.chapterIds){covered.push(id);const ch=s.chapters.find(ch=>ch.id===id);if(ch&&(ch.visitId!==v.id||ch.location.id!==v.locationId))bad('chapter/visit/location disagreement '+id);}
  for(const k of v.carry??[])if(!items.has(k))bad('unknown visit carry '+k);
 }
 if(!unique(covered)||covered.length!==s.chapters.length||chapterIds.some(id=>!covered.includes(id)))bad('every chapter must belong to exactly one visit');
 for(const ch of s.chapters){
  if(ch.caches?.length||ch.hotspots?.length||ch.carry?.length)bad('chapter may not own ordinary stock, hotspots or carry '+ch.id);
  const cue=ch.entryCue;if(!cue?.id||!cue.text?.trim()||!cue.voice?.trim()||!['arrival-and-beat','beat','source-update-and-beat'].includes(cue.mode)||!['silent-title-card','speech-bubble','radio','source-update-card'].includes(cue.format))bad('missing or invalid entry cue '+ch.id);else cueIds.push(cue.id);
  if(ch.travel){const t=ch.travel;if(!t.id||!p.locations.some(l=>l.id===t.locationId)||!t.afterCreated.length||t.afterCreated.some(k=>!items.has(k))||t.carry.some(k=>!items.has(k))||!t.entryCue?.id||!t.entryCue.text||t.entryCue.mode!=='arrival-and-beat')bad('invalid earned travel '+ch.id);else cueIds.push(t.entryCue.id);}
  const update=ch.sourceUpdate;if(update){if(!update.id||stockIds.has(update.id)||!update.label||!update.narrative||!update.arrivalFact||!update.items.length||cue?.mode!=='source-update-and-beat')bad('invalid source update '+ch.id);stockIds.add(update.id);for(const k of update.items){if(!items.has(k)||sources.has(k))bad('unknown or duplicate updated source '+k);sources.add(k);}}
  if(!ch.onAlreadyComplete)bad('explicit skip/bridge policy required '+ch.id);
 }
 if(!unique(cueIds))bad('duplicate entry cue id');
 for(const k of s.initialItems)if(sources.has(k))bad('opening item repeated in stock '+k);
 return errors;
}
