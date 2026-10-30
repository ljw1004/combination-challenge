import type {Scenario} from '../../schema/campaign.ts';

/** Narrow A12 operation-meaning correction. Apply AFTER withPlainLanguage.
 * A report at this reading desk is evidence about a real voyage; the desk does
 * not send its clock to sea. All graph, stock, lifecycle and goal IDs remain. */
export function withAtlasSeaTrialRecord(before:Scenario):Scenario{
 if(!before.chapters.some(c=>c.id==='longitude')||!before.recipes.some(r=>r.id==='make-sea-tested-clock'))throw Error('Atlas sea-trial correction requires the longitude comparison');
 const s=structuredClone(before),recordId='longitude-harrison-trial-record',historyId='longitude-h4-trial-history';
 const sources:NonNullable<Scenario['sources']>=[
  {id:recordId,title:'Royal Museums Greenwich: Harrison’s 1765 account, BGN/14',url:'https://www.rmg.co.uk/collections/objects/rmgc-object-478825',note:'Museum catalogue identifies a surviving contemporary pamphlet advocating Harrison’s reward after H4 trials. The game paraphrases a documented report; it does not invent a voyage performed at this desk.'},
  {id:historyId,title:'Royal Museums Greenwich: Harrison’s timekeepers and trials',url:'https://www.rmg.co.uk/stories/time/harrisons-clocks-longitude-problem',note:'Confirms the 1764 Barbados trial, the result considered in 1765, and continued dispute/testing. A successful trial is not a guarantee for every clock or final closure of the controversy.'},
 ];
 for(const source of sources){const old=s.sources?.find(x=>x.id===source.id);if(old)Object.assign(old,source);else(s.sources??=[]).push(source);}
 const addSources=(target:{sources?:string[]})=>target.sources=[...new Set([...(target.sources??[]),recordId,historyId])];
 const explain=(id:string,text:string)=>{const item=s.items.find(i=>i.id===id);if(!item)throw Error('Missing Atlas item '+id);item.description=text;if(item.reading)item.reading={...item.reading,text};return item;};
 explain('reference-timekeeper','The clock carries the time of a reference place. Comparing it with local noon explains how to find an east–west difference. This describes the method; a separate voyage report provides evidence about performance at sea.');
 const evidence=explain('sea-tested-clock','H4’s reported voyage shows that a clock could carry useful reference time at sea. This supports the method; it does not certify every clock. Further testing and the reward remained disputed. The comparison here reads that evidence, rather than sending this desk’s clock on a voyage.');
 evidence.label='Sea-tested reference time';
 if(evidence.reading)evidence.reading.attribution='Historical reconstruction, not a quotation. The report represents Harrison’s published case, not an impartial transcript.';
 addSources(evidence);
 explain('time-longitude','A difference between local noon and reference time gives an east–west difference. The comparison can explain the method from a clock or from the recorded trial example. Explaining the method does not by itself prove an untested clock reliable.');
 const report=s.hotspots.find(h=>h.id==='longitude-sea');if(!report)throw Error('Missing longitude report hotspot');
 report.label='H4 sea-trial report';report.description='A reading place for Harrison’s published account of H4’s voyage trial, including the Barbados result. Compare its evidence with the reference-time method. This is a report on the desk, not a moving ship.';addSources(report);
 const compare=s.recipes.find(r=>r.id==='make-sea-tested-clock')!;
 if(compare.a!=='reference-timekeeper'||compare.b!=='@longitude-sea'||compare.out!=='sea-tested-clock')throw Error('Unexpected sea-trial operands');
 compare.description='Compare the reference-time method with the documented H4 voyage result. The new conclusion is evidence that the method worked in that trial, not a newly tested physical clock.';addSources(compare);
 const tested=s.recipes.find(r=>r.id==='make-tested-clock-longitude')!;
 if(tested.a!=='sea-tested-clock'||tested.b!=='local-noon'||tested.out!=='time-longitude')throw Error('Unexpected tested-longitude operands');
 tested.description='Use the recorded trial’s example of maintained reference time with the local-noon principle to reconstruct longitude by time comparison. A report illustrates the method; it is not a live clock reading.';addSources(tested);
 s.recipes.find(r=>r.id==='make-time-longitude')!.description='Compare the clock’s reference time with local noon to explain the longitude method. This calculation principle alone does not establish that a clock keeps time reliably at sea.';
 // Keep the latest inquiry-question contract; do not ask for a literal voyage.
 for(const c of s.chapters)for(const objective of c.objectives)if(objective.item==='sea-tested-clock')objective.text='Can a clock keep reference time at sea?';
 // The prose overlay creates this explanation; retain its ID/predicate/artwork.
 for(const milestone of s.milestones??[])if(milestone.item==='sea-tested-clock'){milestone.title=evidence.label;milestone.text=evidence.description!;}
 return s;
}
