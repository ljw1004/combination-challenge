import type {Story, Diagnostic, DiagnosticFix} from '../story/types.ts';
import {activeHotspots} from '../engine/analysis.ts';

/** Count the actual scene, including inherited hotspots; acknowledgments are local. */
export function hotspotCountDiagnostics(story: Story, index: number, observedCount?:number): Diagnostic[] {
  const chapter = story.chapters[index], count = observedCount ?? new Set(activeHotspots(story, index)).size;
  const acknowledgments = chapter.hotspotAcknowledgments ?? [], source = chapter.hotspotsSource ?? chapter.source;
  const diagnostics: Diagnostic[] = [];
  if (count >= 4) diagnostics.push({severity:'error', code:'too-many-hotspots', stage:'fast', source, span:source.span!,
    message:`${chapter.name} has ${count} active hotspots; at most three are allowed. Combine routine apparatus steps or redesign the scene.`});
  if (count === 3 && !(acknowledgments.length === 1 && acknowledgments[0].reason.trim() && !acknowledgments[0].reason.includes('<REASON>'))) {
    const fixes: DiagnosticFix[] = [];
    if (!acknowledgments.length && chapter.hotspotsInsertion) {
      const {offset, newline, indent, needsHeading} = chapter.hotspotsInsertion;
      const text = `${newline}${needsHeading ? `**Hotspots**${newline}` : ''}${indent}- (three hotspots are a lot but okay here because <REASON>)${needsHeading ? `${newline}${newline}` : ''}`;
      const from = text.indexOf('<REASON>');
      fixes.push({label:'Suppress warning with an explanation', edits:[{span:{from:offset,to:offset},text}], selection:{edit:0,from,to:from+'<REASON>'.length}});
    }
    diagnostics.push({severity:'warning', code:'many-hotspots', stage:'fast', source, span:source.span!,
      message:`${chapter.name} has 3 active hotspots. Explain why these distinct places or apparatus belong together, or simplify the scene.`,
      ...(fixes.length ? {fixes,fixTitle:'Three hotspots'} : {})});
  }
  for (const [index, acknowledgment] of acknowledgments.entries()) {
    const {source} = acknowledgment;
    if (index) diagnostics.push({severity:'error',code:'duplicate-hotspot-acknowledgment',stage:'fast',source,span:source.span!,
      message:'A chapter may contain only one three-hotspot acknowledgment.'});
    if (count < 3) diagnostics.push({severity:'warning',code:'stale-hotspot-acknowledgment',stage:'fast',source,span:source.span!,
      message:`${chapter.name} has ${count} active hotspots, so its three-hotspot acknowledgment is no longer needed.`,
      fixTitle:'Three-hotspot acknowledgment',fixes:[{label:'Remove obsolete acknowledgment',edits:[{span:acknowledgment.removalSpan,text:''}]}]});
  }
  return diagnostics;
}
