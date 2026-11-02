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
  const installations = story.recipes.filter(r => r.installation).length;
  const terminal = story.chapters.length > 0 && !story.chapters.at(-1)!.goals.length;
  return {
    id: story.id, title: story.title, source: story.source.file,
    totals: {
      items: items.length, primitives, derived: items.length - primitives,
      rules: story.recipes.length, explicitRules: story.recipes.length - installations, installations,
      chapters: story.chapters.length, playableChapters: story.chapters.length - Number(terminal),
    },
    metrics: {
      constructionDepth: summarize(items.map(i => i.depth)),
      constructionNodes: summarize(items.map(i => i.nodes)),
      primitiveLeaves: summarize(items.map(i => i.leaves)),
      chainChapters: summarize(route.items.map(i => i.chapters)),
      newPrimitives: summarize(route.chapters.map(c => c.newPrimitives)),
      combinations: summarize(route.chapters.map(c => c.combinations)),
      peakBoard: summarize(route.chapters.map(c => c.peakBoard)),
    },
    details: {items, route},
  };
}
export type StoryAnalysis = ReturnType<typeof analyzeStory>;

export function corpusSummary(stories: readonly StoryAnalysis[]) {
  return {
    items: summarize(stories.map(s => s.totals.items)),
    rules: summarize(stories.map(s => s.totals.rules)),
    chapters: summarize(stories.map(s => s.totals.chapters)),
  };
}
