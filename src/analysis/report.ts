import type {StoryAnalysis} from './analyze.ts';

export type SourcedAnalysis = StoryAnalysis & {sha256: string};
const average = (value: number | null) => value === null ? 'n/a' : value.toFixed(1);
const count = (value: number | null) => value === null ? 'n/a' : String(value);

export function textReport(story: StoryAnalysis): string {
  const {totals, completion, chains, chapterItems} = story;
  return [
    `1. Number of items: total ${totals.primitives + totals.derived}, of which primitive ${totals.primitives}`,
    `2. Number of combinations: total ${totals.combinations}, to complete story ${completion.combinations}`,
    `3. Number of chapters: ${totals.chapters}`,
    `4. Chain length: avg ${average(chains.average)}, max ${count(chains.longest)}`,
    `5. Number of >1 chapter chains: ${chains.acrossChapters}`,
    `6. Number of items at each chapter start: avg ${average(chapterItems.average)}, max ${count(chapterItems.max)}`,
  ].join('\n') + '\n';
}

export function markdownTable(stories: readonly StoryAnalysis[]): string {
  const secondary = '\u00a0\u00a0'; // Visible indentation in both Markdown source and rendered HTML.
  const rows = [
    ['Measure', ...stories.map(s => s.title)],
    ['Number of items', ...stories.map(s => count(s.totals.primitives + s.totals.derived))],
    [`${secondary}of which primitive`, ...stories.map(s => count(s.totals.primitives))],
    ['Number of combinations', ...stories.map(s => count(s.totals.combinations))],
    [`${secondary}to complete story`, ...stories.map(s => count(s.completion.combinations))],
    ['Number of chapters', ...stories.map(s => count(s.totals.chapters))],
    ['Chain length: avg', ...stories.map(s => average(s.chains.average))],
    [`${secondary}max`, ...stories.map(s => count(s.chains.longest))],
    ['Number of >1 chapter chains', ...stories.map(s => count(s.chains.acrossChapters))],
    ['Number of items at each chapter start: avg', ...stories.map(s => average(s.chapterItems.average))],
    [`${secondary}max`, ...stories.map(s => count(s.chapterItems.max))],
  ].map(row => row.map(cell => cell.replaceAll('|', '\\|').replaceAll('\n', ' ')));
  const widths = rows[0].map((_, column) => Math.max(3, ...rows.map(row => row[column].length)));
  const format = (row: string[]) => '| ' + row.map((cell, column) => column ? cell.padStart(widths[column]) : cell.padEnd(widths[column])).join(' | ') + ' |';
  const separator = widths.map((width, column) => '-'.repeat(width - Number(column > 0)) + (column ? ':' : ''));
  return [format(rows[0]), format(separator), ...rows.slice(1).map(format)].join('\n') + '\n';
}

export function jsonReport(stories: readonly SourcedAnalysis[], details = false): string {
  return JSON.stringify({
    schemaVersion: 2,
    stories: stories.map(s => {
      const {details: detail, ...summary} = s;
      return {...summary, ...(details ? {details: detail} : {})};
    }),
  }, null, 2) + '\n';
}
