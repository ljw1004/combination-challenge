import type {Story} from '../story/types.ts';
import {declarationDiagnostics} from '../lint/declarations.ts';
import {constructionMetrics} from './construction.ts';
import {measureRoute} from './route.ts';
import {summarize} from './statistics.ts';

export function analyzeStory(story: Story) {
  const errors = [...story.diagnostics, ...declarationDiagnostics(story)].filter(d => d.severity === 'error');
  if (errors.length) throw new Error(errors.map(d => `${d.source.file}:${d.source.line}: ${d.message}`).join('\n'));
  const items = constructionMetrics(story), route = measureRoute(story);
  const primitives = items.filter(i => i.primitive).length;
  const lengths = summarize(items.map(i => i.depth)), checkpointItems = summarize(route.checkpoints.map(c => c.items));
  return {
    id: story.id, title: story.title, source: story.source.file,
    totals: {
      primitives, derived: items.length - primitives,
      combinations: story.recipes.length, chapters: story.chapters.length,
    },
    completion: {combinations: route.combinations},
    chains: {
      average: lengths.avg, longest: lengths.max,
      acrossChapters: route.items.filter(i => i.chapters > 1).length,
    },
    chapterItems: {average: checkpointItems.avg, max: checkpointItems.max},
    details: {items, route},
  };
}
export type StoryAnalysis = ReturnType<typeof analyzeStory>;
