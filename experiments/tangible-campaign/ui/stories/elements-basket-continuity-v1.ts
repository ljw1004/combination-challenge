import type {Action,Chapter,Scenario} from '../../schema/campaign.ts';

/** Additive content-only successor, applied after Waterworks v9. Historical
 * worlds and their checkpoints are untouched. No runtime, stock or art changes. */
export function withElementsBasketContinuity(before:Scenario,id='elements-basket-continuity-v10'):Scenario{
 const s=structuredClone(before);s.id=id;
 const pair=(a:string,b:string)=>[a,b].sort().join('|');
 const basket=s.recipes.find(r=>r.id==='basket')!;
 if(s.recipes.some(r=>r.id!=='basket'&&pair(r.a,r.b)===pair('fiber','rope')))throw Error('Basket pair is already occupied');
 basket.a='fiber';basket.b='rope';
 basket.description='Weave the plant fibers into a carrier and bind its rim and handle with rope.';
 basket.lifecycle={fiber:{role:'transform',reason:'The plant-fiber supply is woven into the basket body; other independent fiber work keeps its own remaining supply.'},rope:{role:'incorporate',reason:'Rope binds the basket rim and forms its handle; other independent cordage work keeps its own remaining supply.'}};
 s.items.find(i=>i.id==='basket')!.description='A woven plant-fiber carrier with a rope-bound rim and handle.';
 const firedBowl=s.recipes.find(r=>r.id==='glazed-bowl')!;
 firedBowl.lifecycle!.bowl.reason='The same formed clay vessel is glazed and fired. Retain a dry shaping form only while an unfinished jar still independently needs it; basket-making does not use a bowl.';

 const letters=s.chapters.find(c=>c.id==='letters')!;
 const quarry=s.locationPlan!.locations.find(l=>l.id==='E05')!;
 const fuel:Chapter={id:'ink-charcoal',title:'Charcoal for the messages',speaker:letters.speaker,motivation:'We stop at the quarry kiln for charcoal. At the landing, we can grind it into ink for our invitations.',location:{id:quarry.id,label:quarry.label,travelText:'Back at the quarry workshop, the brick kiln remains where we built it.'},visitId:'E05-ink-charcoal-visit',objectives:[{id:'ink-charcoal-made',kind:'create',item:'charcoal',text:'Make charcoal for ink'}],completionText:'The cooled charcoal is ready to carry to the landing. The kiln stays at the quarry.',onAlreadyComplete:{mode:'skip'},entryCue:{...letters.entryCue!,id:`${id}:ink-charcoal:entry-v1`,mode:'arrival-and-beat',sourceCaption:quarry.label,text:'We stop at the quarry kiln for charcoal. At the landing, we can grind it into ink for our invitations.'}};
 s.chapters.splice(s.chapters.indexOf(letters),0,fuel);
 const letterVisit=s.locationPlan!.visits.find(v=>v.id===letters.visitId)!;
 s.locationPlan!.visits.splice(s.locationPlan!.visits.indexOf(letterVisit),0,{id:fuel.visitId!,locationId:quarry.id,chapterIds:[fuel.id],carry:['wood']});
 // The only imported thing for this return is timber. The kiln stays resident;
 // pre-made charcoal satisfies the beat wherever it already is and auto-skips.
 // Normal following-visit closure then gathers charcoal or already-made ink,
 // never the kiln, because the charcoal result has actually been earned.

 for(const chapter of s.chapters){
  if(chapter.entryCue)chapter.entryCue.id=`${id}:${chapter.id}:entry-v1`;
  if(chapter.travel)chapter.travel.entryCue.id=`${id}:${chapter.travel.id}:entry-v1`;
 }
 // Rewrite every authored prefix by chapter identity, not shifted indices.
 const rewrite=(actions:Action[]):Action[]=>{
  let chapterIndex=0;const out:Action[]=[];
  for(const action of actions){
   const current=before.chapters[chapterIndex]?.id;
   if(action.type==='combine'){
    const p=pair(action.a,action.b);
    if(current==='bakery'&&p===pair('clay','wheel'))continue;
    if(p===pair('fiber','bowl')){out.push({type:'combine',a:'fiber',b:'rope'});continue;}
    if(current==='orchard'&&p===pair('clay','bowl'))out.push({type:'combine',a:'clay',b:'wheel'});
    if(current==='letters'&&p===pair('wood','kiln'))continue;
   }
   out.push(action);
   if(action.type==='advance'){
    chapterIndex++;
    if(before.chapters[chapterIndex]?.id==='letters')out.push({type:'combine',a:'wood',b:'kiln'},{type:'advance'});
   }
  }
  return out;
 };
 const old=s.checkpoints??[];
 s.checkpoints=old.map(cp=>{
  const original=before.checkpoints!.find(c=>c.id===cp.id)!;
  const oldIndex=before.chapters.findIndex((_,i)=>original.id===`chapter-${i+1}`);
  if(oldIndex<0)return {...cp,actions:rewrite(cp.actions)};
  const chapter=s.chapters.find(c=>c.id===before.chapters[oldIndex].id)!;
  const index=s.chapters.indexOf(chapter);
  return {...cp,id:`chapter-${index+1}`,label:`${index+1}. ${chapter.title}`,actions:rewrite(cp.actions)};
 });
 // `letters` is cloned, so locate the predecessor by ID rather than reference.
 const lettersPrefix=before.checkpoints!.find(cp=>cp.id===`chapter-${before.chapters.findIndex(c=>c.id==='letters')+1}`)!;
 const fuelIndex=s.chapters.indexOf(fuel),fuelActions=rewrite(lettersPrefix.actions).slice(0,-2);
 s.checkpoints.splice(fuelIndex,0,{id:`chapter-${fuelIndex+1}`,label:`${fuelIndex+1}. ${fuel.title}`,actions:fuelActions});
 s.notes!.push('Basket/continuity successor: weave plant fiber with existing rope, without a clay-bowl mold or a new tool. The packed-bread picnic remains unchanged. Form the bowl at its first remaining jar use. An automatically skipped-if-prepared quarry return moves the existing charcoal action before landing work: the brick kiln remains resident and only real portable supplies travel. No new recipes, ingredients, stock, artwork or hidden storage. Garden continuity remains separately reviewed. Logical evidence is not native/browser or human-comprehension evidence.');
 return s;
}
