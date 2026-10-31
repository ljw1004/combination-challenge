import type {Chapter, Diagnostic, DiagnosticFix} from '../story/types.ts';

/** The acknowledgment is author metadata; only non-next goals start visible chains. */
export function goalCountDiagnostics(chapter: Chapter): Diagnostic[] {
  const count = chapter.goals.filter(goal => !goal.next).length;
  const acknowledgments = chapter.goalAcknowledgments ?? [];
  const source = chapter.goalsSource ?? chapter.goals[0]?.source ?? chapter.source;
  const diagnostics: Diagnostic[] = [];
  if (count >= 4) diagnostics.push({severity: 'error', code: 'too-many-visible-goals', stage: 'fast', source, span: source.span ?? {from: 0, to: 0},
    message: `${chapter.name} starts with ${count} goal chains; at most three are allowed. Group related conditions or use next: for sequential disclosure; all goals remain required.`});
  if (count === 3 && !(acknowledgments.length === 1 && acknowledgments[0].reason.trim() && !acknowledgments[0].reason.includes('<REASON>'))) {
    const fixes: DiagnosticFix[] = [];
    if (!acknowledgments.length && chapter.goalsInsertion) {
      const {offset, newline, indent} = chapter.goalsInsertion;
      const text = `${newline}${indent}- (three goals are a lot but okay here because <REASON>)`;
      const from = text.indexOf('<REASON>');
      fixes.push({label: 'Suppress warning with an explanation', edits: [{span: {from: offset, to: offset}, text}],
        selection: {edit: 0, from, to: from + '<REASON>'.length}});
    }
    diagnostics.push({severity: 'warning', code: 'many-visible-goals', stage: 'fast', source, span: source.span ?? {from: 0, to: 0},
      message: `${chapter.name} starts with 3 goal chains. Explain why three goals belong together, or consider next: for sequential disclosure; all goals remain required.`,
      ...(fixes.length ? {fixes, fixTitle: 'Three goals'} : {})});
  }
  for (const [index, acknowledgment] of acknowledgments.entries()) {
    const {source} = acknowledgment;
    if (index) diagnostics.push({severity: 'error', code: 'duplicate-goal-acknowledgment', stage: 'fast', source, span: source.span ?? {from: 0, to: 0},
      message: 'A Goals section may contain only one three-goal acknowledgment per chapter.'});
    if (count < 3) diagnostics.push({severity: 'warning', code: 'stale-goal-acknowledgment', stage: 'fast', source, span: source.span ?? {from: 0, to: 0},
      message: `${chapter.name} starts with ${count} goal chains, so its three-goal acknowledgment is no longer needed.`,
      fixTitle: 'Three-goal acknowledgment', fixes: [{label: 'Remove obsolete acknowledgment', edits: [{span: acknowledgment.removalSpan, text: ''}]}]});
  }
  return diagnostics;
}
